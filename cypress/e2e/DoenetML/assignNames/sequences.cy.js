import me from "math-expressions";
import { cesc } from "../../../../src/_utils/url";

describe("sequence and map assignName Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("assignNames to dynamic copied sequence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="s1"><aslist>
  <sequence assignNames="a b" type="letters" length="$n" />
  </aslist></p>

  <p name="pa">a: $a{name="cpa"}</p>
  <p name="pb">b: $b{name="cpb"}</p>

  <p name="s2"><aslist>
  <sequence name="cpall" copysource="_sequence1" assignNames="a1 b1 c1" />
  </aslist></p>
  <p name="pa1">a1: $a1{name="cpa1"}</p>
  <p name="pb1">b1: $b1{name="cpb1"}</p>
  <p name="pc1">c1: $c1{name="cpc1"}</p>

  <p name="s3"><aslist>
  <sequence name="cpall2" copysource="cpall" assignNames="a2 b2 c2 d2 e2" />
  </aslist></p>
  <p name="pa2">a2: $a2{name="cpa2"}</p>
  <p name="pb2">b2: $b2{name="cpb2"}</p>
  <p name="pc2">c2: $c2{name="cpc2"}</p>
  <p name="pd2">d2: $d2{name="cpd2"}</p>
  <p name="pe2">e2: $e2{name="cpe2"}</p>

  <p name="s4"><aslist>
  <sequence name="cpall3" copysource="cpall2" assignNames="a3 b3 c3 d3" />
  </aslist></p>
  <p name="pa3">a3: $a3{name="cpa3"}</p>
  <p name="pb3">b3: $b3{name="cpb3"}</p>
  <p name="pc3">c3: $c3{name="cpc3"}</p>
  <p name="pd3">d3: $d3{name="cpd3"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/s1")).should("have.text", "a");
    cy.get(cesc("#\\/s2")).should("have.text", "a");
    cy.get(cesc("#\\/s3")).should("have.text", "a");
    cy.get(cesc("#\\/s4")).should("have.text", "a");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("not.exist");
    cy.get(cesc("#\\/b1")).should("not.exist");
    cy.get(cesc("#\\/b2")).should("not.exist");
    cy.get(cesc("#\\/b3")).should("not.exist");
    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n back to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a");
    cy.get(cesc("#\\/s2")).should("have.text", "a");
    cy.get(cesc("#\\/s3")).should("have.text", "a");
    cy.get(cesc("#\\/s4")).should("have.text", "a");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("not.exist");
    cy.get(cesc("#\\/b1")).should("not.exist");
    cy.get(cesc("#\\/b2")).should("not.exist");
    cy.get(cesc("#\\/b3")).should("not.exist");
    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n back to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b, c");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b, c");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b, c");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b, c");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("have.text", "c");
    cy.get(cesc("#\\/c2")).should("have.text", "c");
    cy.get(cesc("#\\/c3")).should("have.text", "c");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: c");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: c");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: c");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n back to 1 again");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a");
    cy.get(cesc("#\\/s2")).should("have.text", "a");
    cy.get(cesc("#\\/s3")).should("have.text", "a");
    cy.get(cesc("#\\/s4")).should("have.text", "a");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("not.exist");
    cy.get(cesc("#\\/b1")).should("not.exist");
    cy.get(cesc("#\\/b2")).should("not.exist");
    cy.get(cesc("#\\/b3")).should("not.exist");
    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n to 5");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b, c, d, e");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b, c, d, e");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b, c, d, e");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b, c, d, e");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("have.text", "c");
    cy.get(cesc("#\\/c2")).should("have.text", "c");
    cy.get(cesc("#\\/c3")).should("have.text", "c");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: c");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: c");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: c");

    cy.get(cesc("#\\/d2")).should("have.text", "d");
    cy.get(cesc("#\\/d3")).should("have.text", "d");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: d");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: d");

    cy.get(cesc("#\\/e2")).should("have.text", "e");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: e");

    cy.log("change n to 4");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b, c, d");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("have.text", "c");
    cy.get(cesc("#\\/c2")).should("have.text", "c");
    cy.get(cesc("#\\/c3")).should("have.text", "c");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: c");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: c");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: c");

    cy.get(cesc("#\\/d2")).should("have.text", "d");
    cy.get(cesc("#\\/d3")).should("have.text", "d");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: d");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: d");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n to 10");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b, c, d, e, f, g, h, i, j");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b, c, d, e, f, g, h, i, j");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b, c, d, e, f, g, h, i, j");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b, c, d, e, f, g, h, i, j");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("have.text", "c");
    cy.get(cesc("#\\/c2")).should("have.text", "c");
    cy.get(cesc("#\\/c3")).should("have.text", "c");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: c");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: c");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: c");

    cy.get(cesc("#\\/d2")).should("have.text", "d");
    cy.get(cesc("#\\/d3")).should("have.text", "d");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: d");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: d");

    cy.get(cesc("#\\/e2")).should("have.text", "e");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: e");

    cy.log("change n back to 2 again");
    cy.get(cesc("#\\/n") + " textarea").type(
      "{end}{backspace}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/s1")).should("have.text", "a, b");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n to 0");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "");
    cy.get(cesc("#\\/s2")).should("have.text", "");
    cy.get(cesc("#\\/s3")).should("have.text", "");
    cy.get(cesc("#\\/s4")).should("have.text", "");

    cy.get(cesc("#\\/a")).should("not.exist");
    cy.get(cesc("#\\/a1")).should("not.exist");
    cy.get(cesc("#\\/a2")).should("not.exist");
    cy.get(cesc("#\\/a3")).should("not.exist");
    cy.get(cesc("#\\/pa")).should("have.text", "a: ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: ");

    cy.get(cesc("#\\/b")).should("not.exist");
    cy.get(cesc("#\\/b1")).should("not.exist");
    cy.get(cesc("#\\/b2")).should("not.exist");
    cy.get(cesc("#\\/b3")).should("not.exist");
    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/c1")).should("not.exist");
    cy.get(cesc("#\\/c2")).should("not.exist");
    cy.get(cesc("#\\/c3")).should("not.exist");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/d2")).should("not.exist");
    cy.get(cesc("#\\/d3")).should("not.exist");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.log("change n back to 4");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/s1")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/s2")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/s3")).should("have.text", "a, b, c, d");
    cy.get(cesc("#\\/s4")).should("have.text", "a, b, c, d");

    cy.get(cesc("#\\/a")).should("have.text", "a");
    cy.get(cesc("#\\/a1")).should("have.text", "a");
    cy.get(cesc("#\\/a2")).should("have.text", "a");
    cy.get(cesc("#\\/a3")).should("have.text", "a");
    cy.get(cesc("#\\/pa")).should("have.text", "a: a");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: a");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: a");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: a");

    cy.get(cesc("#\\/b")).should("have.text", "b");
    cy.get(cesc("#\\/b1")).should("have.text", "b");
    cy.get(cesc("#\\/b2")).should("have.text", "b");
    cy.get(cesc("#\\/b3")).should("have.text", "b");
    cy.get(cesc("#\\/pb")).should("have.text", "b: b");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: b");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: b");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: b");

    cy.get(cesc("#\\/c1")).should("have.text", "c");
    cy.get(cesc("#\\/c2")).should("have.text", "c");
    cy.get(cesc("#\\/c3")).should("have.text", "c");
    cy.get(cesc("#\\/pc1")).should("have.text", "c1: c");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: c");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: c");

    cy.get(cesc("#\\/d2")).should("have.text", "d");
    cy.get(cesc("#\\/d3")).should("have.text", "d");
    cy.get(cesc("#\\/pd2")).should("have.text", "d2: d");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: d");

    cy.get(cesc("#\\/e2")).should("not.exist");
    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");
  });

  it("assignNames to dynamic copied map of sequence", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1"><map assignNames="a b" aslist="false">
    <template newNamespace>Letter $i{name="n"} is $l{name="v"}. </template>
    <sources alias="l" indexAlias="i">
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>

  <p name="pa">a: $a{name="cpa"}</p>
  <p name="pb">b: $b{name="cpb"}</p>

  <p name="pan">a/n: $(a/n{name="cpan"})</p>
  <p name="pbn">b/n: $(b/n{name="cpbn"})</p>

  <p name="pav">a/v: $(a/v{name="cpav"})</p>
  <p name="pbv">b/v: $(b/v{name="cpbv"})</p>


  <p name="m2"><map name="cpall" copysource="_map1" assignNames="a1 b1 c1" /></p>
  <p name="pa1">a1: $a1{name="cpa1"}</p>
  <p name="pb1">b1: $b1{name="cpb1"}</p>
  <p name="pc1">c1: $c1{name="cpc1"}</p>

  <p name="pan1">a1/n: $(a1/n{name="cpan1"})</p>
  <p name="pbn1">b1/n: $(b1/n{name="cpbn1"})</p>
  <p name="pcn1">c1/n: $(c1/n{name="cpcn1"})</p>

  <p name="pav1">a1/v: $(a1/v{name="cpav1"})</p>
  <p name="pbv1">b1/v: $(b1/v{name="cpbv1"})</p>
  <p name="pcv1">c1/v: $(c1/v{name="cpcv1"})</p>


  <p name="m3"><map name="cpall2" copysource="cpall" assignNames="a2 b2 c2 d2 e2" /></p>
  <p name="pa2">a2: $a2{name="cpa2"}</p>
  <p name="pb2">b2: $b2{name="cpb2"}</p>
  <p name="pc2">c2: $c2{name="cpc2"}</p>
  <p name="pd2">d2: $d2{name="cpd2"}</p>
  <p name="pe2">e2: $e2{name="cpe2"}</p>
  
  <p name="pan2">a2/n: $(a2/n{name="cpan2"})</p>
  <p name="pbn2">b2/n: $(b2/n{name="cpbn2"})</p>
  <p name="pcn2">c2/n: $(c2/n{name="cpcn2"})</p>
  <p name="pdn2">d2/n: $(d2/n{name="cpdn2"})</p>
  <p name="pen2">e2/n: $(e2/n{name="cpen2"})</p>

  <p name="pav2">a2/v: $(a2/v{name="cpav2"})</p>
  <p name="pbv2">b2/v: $(b2/v{name="cpbv2"})</p>
  <p name="pcv2">c2/v: $(c2/v{name="cpcv2"})</p>
  <p name="pdv2">d2/v: $(d2/v{name="cpdv2"})</p>
  <p name="pev2">e2/v: $(e2/v{name="cpev2"})</p>


  <p name="m4"><map name="cpall3" copysource="cpall2" assignNames="a3 b3 c3 d3" /></p>
  <p name="pa3">a3: $a3{name="cpa3"}</p>
  <p name="pb3">b3: $b3{name="cpb3"}</p>
  <p name="pc3">c3: $c3{name="cpc3"}</p>
  <p name="pd3">d3: $d3{name="cpd3"}</p>

  <p name="pan3">a3/n: $(a3/n{name="cpan3"})</p>
  <p name="pbn3">b3/n: $(b3/n{name="cpbn3"})</p>
  <p name="pcn3">c3/n: $(c3/n{name="cpcn3"})</p>
  <p name="pdn3">d3/n: $(d3/n{name="cpdn3"})</p>

  <p name="pav3">a3/v: $(a3/v{name="cpav3"})</p>
  <p name="pbv3">b3/v: $(b3/v{name="cpbv3"})</p>
  <p name="pcv3">c3/v: $(c3/v{name="cpcv3"})</p>
  <p name="pdv3">d3/v: $(d3/v{name="cpdv3"})</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/m1")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m2")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m3")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m4")).should("have.text", "Letter 1 is a. ");

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: ");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: ");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: ");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: ");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: ");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: ");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: ");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: ");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n back to 1");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m2")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m3")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m4")).should("have.text", "Letter 1 is a. ");

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: ");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: ");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: ");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: ");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: ");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: ");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: ");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: ");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n back to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: Letter 3 is c. ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: 3");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: 3");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: 3");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: c");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: c");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: c");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n back to 1 again");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m2")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m3")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m4")).should("have.text", "Letter 1 is a. ");

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: ");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: ");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: ");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: ");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: ");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: ");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: ");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: ");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n to 5");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: Letter 3 is c. ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: 3");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: 3");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: 3");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: c");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: c");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: c");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: Letter 4 is d. ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: Letter 4 is d. ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: 4");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: 4");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: d");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: d");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: Letter 5 is e. ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: 5");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: e");

    cy.log("change n to 4");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: Letter 3 is c. ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: 3");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: 3");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: 3");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: c");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: c");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: c");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: Letter 4 is d. ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: Letter 4 is d. ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: 4");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: 4");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: d");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: d");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n to 10");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: Letter 3 is c. ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: 3");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: 3");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: 3");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: c");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: c");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: c");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: Letter 4 is d. ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: Letter 4 is d. ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: 4");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: 4");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: d");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: d");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: Letter 5 is e. ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: 5");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: e");

    cy.log("change n back to 2 again");
    cy.get(cesc("#\\/n") + " textarea").type(
      "{end}{backspace}{backspace}2{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n to 0");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("have.text", "");
    cy.get(cesc("#\\/m2")).should("have.text", "");
    cy.get(cesc("#\\/m3")).should("have.text", "");
    cy.get(cesc("#\\/m4")).should("have.text", "");

    cy.get(cesc("#\\/pa")).should("have.text", "a: ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: ");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: ");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: ");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: ");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: ");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: ");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: ");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: ");

    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: ");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: ");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: ");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: ");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: ");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: ");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: ");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: ");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: ");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: ");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: ");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: ");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: ");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: ");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: ");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: ");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: ");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: ");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");

    cy.log("change n back to 4");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );
    cy.get(cesc("#\\/m3")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );
    cy.get(cesc("#\\/m4")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");
    cy.get(cesc("#\\/pa2")).should("have.text", "a2: Letter 1 is a. ");
    cy.get(cesc("#\\/pa3")).should("have.text", "a3: Letter 1 is a. ");

    cy.get(cesc("#\\/pan")).should("have.text", "a/n: 1");
    cy.get(cesc("#\\/pan1")).should("have.text", "a1/n: 1");
    cy.get(cesc("#\\/pan2")).should("have.text", "a2/n: 1");
    cy.get(cesc("#\\/pan3")).should("have.text", "a3/n: 1");

    cy.get(cesc("#\\/pav")).should("have.text", "a/v: a");
    cy.get(cesc("#\\/pav1")).should("have.text", "a1/v: a");
    cy.get(cesc("#\\/pav2")).should("have.text", "a2/v: a");
    cy.get(cesc("#\\/pav3")).should("have.text", "a3/v: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");
    cy.get(cesc("#\\/pb2")).should("have.text", "b2: Letter 2 is b. ");
    cy.get(cesc("#\\/pb3")).should("have.text", "b3: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn")).should("have.text", "b/n: 2");
    cy.get(cesc("#\\/pbn1")).should("have.text", "b1/n: 2");
    cy.get(cesc("#\\/pbn2")).should("have.text", "b2/n: 2");
    cy.get(cesc("#\\/pbn3")).should("have.text", "b3/n: 2");

    cy.get(cesc("#\\/pbv")).should("have.text", "b/v: b");
    cy.get(cesc("#\\/pbv1")).should("have.text", "b1/v: b");
    cy.get(cesc("#\\/pbv2")).should("have.text", "b2/v: b");
    cy.get(cesc("#\\/pbv3")).should("have.text", "b3/v: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");
    cy.get(cesc("#\\/pc2")).should("have.text", "c2: Letter 3 is c. ");
    cy.get(cesc("#\\/pc3")).should("have.text", "c3: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn1")).should("have.text", "c1/n: 3");
    cy.get(cesc("#\\/pcn2")).should("have.text", "c2/n: 3");
    cy.get(cesc("#\\/pcn3")).should("have.text", "c3/n: 3");

    cy.get(cesc("#\\/pcv1")).should("have.text", "c1/v: c");
    cy.get(cesc("#\\/pcv2")).should("have.text", "c2/v: c");
    cy.get(cesc("#\\/pcv3")).should("have.text", "c3/v: c");

    cy.get(cesc("#\\/pd2")).should("have.text", "d2: Letter 4 is d. ");
    cy.get(cesc("#\\/pd3")).should("have.text", "d3: Letter 4 is d. ");

    cy.get(cesc("#\\/pdn2")).should("have.text", "d2/n: 4");
    cy.get(cesc("#\\/pdn3")).should("have.text", "d3/n: 4");

    cy.get(cesc("#\\/pdv2")).should("have.text", "d2/v: d");
    cy.get(cesc("#\\/pdv3")).should("have.text", "d3/v: d");

    cy.get(cesc("#\\/pe2")).should("have.text", "e2: ");

    cy.get(cesc("#\\/pen2")).should("have.text", "e2/n: ");

    cy.get(cesc("#\\/pev2")).should("have.text", "e2/v: ");
  });

  it("copy alias and index alias with names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1"><map assignNames="a b" asList="false">
    <template newNamespace>Letter $i{name="n1"} is $m{name="v1"}. </template>
    <sources alias="m" indexAlias="i">
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>


  <p name="pa">a: $a{name="cpa"}</p>
  <p name="pb">b: $b{name="cpb"}</p>

  <p name="pan1">a/n1: $(a/n1{name="cpan1"})</p>
  <p name="pbn1">b/n1: $(b/n1{name="cpbn1"})</p>

  <p name="pav1">a/v1: $(a/v1{name="cpav1"})</p>
  <p name="pbv1">b/v1: $(b/v1{name="cpbv1"})</p>


  <p name="m2">$_map1{name="cpall" assignNames="a1 b1 c1"}</p>
  <p name="pa1">a1: $a1{name="cpa1"}</p>
  <p name="pb1">b1: $b1{name="cpb1"}</p>
  <p name="pc1">c1: $c1{name="cpc1"}</p>

  <p name="pan11">a1/n1: $(a1/n1{name="cpan11"})</p>
  <p name="pbn11">b1/n1: $(b1/n1{name="cpbn11"})</p>
  <p name="pcn11">c1/n1: $(c1/n1{name="cpcn11"})</p>

  <p name="pav11">a1/v1: $(a1/v1{name="cpav11"})</p>
  <p name="pbv11">b1/v1: $(b1/v1{name="cpbv11"})</p>
  <p name="pcv11">c1/v1: $(c1/v1{name="cpcv11"})</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/m1")).should("have.text", "Letter 1 is a. ");
    cy.get(cesc("#\\/m2")).should("have.text", "Letter 1 is a. ");

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");

    cy.get(cesc("#\\/pan1")).should("have.text", "a/n1: 1");
    cy.get(cesc("#\\/pan11")).should("have.text", "a1/n1: 1");

    cy.get(cesc("#\\/pav1")).should("have.text", "a/v1: a");
    cy.get(cesc("#\\/pav11")).should("have.text", "a1/v1: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");

    cy.get(cesc("#\\/pbn1")).should("have.text", "b/n1: ");
    cy.get(cesc("#\\/pbn11")).should("have.text", "b1/n1: ");

    cy.get(cesc("#\\/pbv1")).should("have.text", "b/v1: ");
    cy.get(cesc("#\\/pbv11")).should("have.text", "b1/v1: ");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");

    cy.get(cesc("#\\/pcn11")).should("have.text", "c1/n1: ");

    cy.get(cesc("#\\/pcv11")).should("have.text", "c1/v1: ");

    cy.log("change n to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");

    cy.get(cesc("#\\/pan1")).should("have.text", "a/n1: 1");
    cy.get(cesc("#\\/pan11")).should("have.text", "a1/n1: 1");

    cy.get(cesc("#\\/pav1")).should("have.text", "a/v1: a");
    cy.get(cesc("#\\/pav11")).should("have.text", "a1/v1: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn1")).should("have.text", "b/n1: 2");
    cy.get(cesc("#\\/pbn11")).should("have.text", "b1/n1: 2");

    cy.get(cesc("#\\/pbv1")).should("have.text", "b/v1: b");
    cy.get(cesc("#\\/pbv11")).should("have.text", "b1/v1: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");

    cy.get(cesc("#\\/pcn11")).should("have.text", "c1/n1: ");

    cy.get(cesc("#\\/pcv11")).should("have.text", "c1/v1: ");

    cy.log("change n to 0");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("have.text", "");
    cy.get(cesc("#\\/m2")).should("have.text", "");

    cy.get(cesc("#\\/pa")).should("have.text", "a: ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: ");

    cy.get(cesc("#\\/pan1")).should("have.text", "a/n1: ");
    cy.get(cesc("#\\/pan11")).should("have.text", "a1/n1: ");

    cy.get(cesc("#\\/pav1")).should("have.text", "a/v1: ");
    cy.get(cesc("#\\/pav11")).should("have.text", "a1/v1: ");

    cy.get(cesc("#\\/pb")).should("have.text", "b: ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: ");

    cy.get(cesc("#\\/pbn1")).should("have.text", "b/n1: ");
    cy.get(cesc("#\\/pbn11")).should("have.text", "b1/n1: ");

    cy.get(cesc("#\\/pbv1")).should("have.text", "b/v1: ");
    cy.get(cesc("#\\/pbv11")).should("have.text", "b1/v1: ");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: ");

    cy.get(cesc("#\\/pcn11")).should("have.text", "c1/n1: ");

    cy.get(cesc("#\\/pcv11")).should("have.text", "c1/v1: ");

    cy.log("change n to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");

    cy.get(cesc("#\\/pan1")).should("have.text", "a/n1: 1");
    cy.get(cesc("#\\/pan11")).should("have.text", "a1/n1: 1");

    cy.get(cesc("#\\/pav1")).should("have.text", "a/v1: a");
    cy.get(cesc("#\\/pav11")).should("have.text", "a1/v1: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn1")).should("have.text", "b/n1: 2");
    cy.get(cesc("#\\/pbn11")).should("have.text", "b1/n1: 2");

    cy.get(cesc("#\\/pbv1")).should("have.text", "b/v1: b");
    cy.get(cesc("#\\/pbv11")).should("have.text", "b1/v1: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn11")).should("have.text", "c1/n1: 3");

    cy.get(cesc("#\\/pcv11")).should("have.text", "c1/v1: c");

    cy.log("change n to 5");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ",
    );

    cy.get(cesc("#\\/pa")).should("have.text", "a: Letter 1 is a. ");
    cy.get(cesc("#\\/pa1")).should("have.text", "a1: Letter 1 is a. ");

    cy.get(cesc("#\\/pan1")).should("have.text", "a/n1: 1");
    cy.get(cesc("#\\/pan11")).should("have.text", "a1/n1: 1");

    cy.get(cesc("#\\/pav1")).should("have.text", "a/v1: a");
    cy.get(cesc("#\\/pav11")).should("have.text", "a1/v1: a");

    cy.get(cesc("#\\/pb")).should("have.text", "b: Letter 2 is b. ");
    cy.get(cesc("#\\/pb1")).should("have.text", "b1: Letter 2 is b. ");

    cy.get(cesc("#\\/pbn1")).should("have.text", "b/n1: 2");
    cy.get(cesc("#\\/pbn11")).should("have.text", "b1/n1: 2");

    cy.get(cesc("#\\/pbv1")).should("have.text", "b/v1: b");
    cy.get(cesc("#\\/pbv11")).should("have.text", "b1/v1: b");

    cy.get(cesc("#\\/pc1")).should("have.text", "c1: Letter 3 is c. ");

    cy.get(cesc("#\\/pcn11")).should("have.text", "c1/n1: 3");

    cy.get(cesc("#\\/pcv11")).should("have.text", "c1/v1: c");
  });

  it("copy alias and index alias with names, no new template namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1"><map asList="false">
    <template>Letter $i{name="n1"} is $m{name="v1"}. Repeat: letter $n1 is $v1. </template>
    <sources alias='m' indexAlias='i'>
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>

  <p name="m2">$_map1{name="cpall"}</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. ",
    );

    cy.log("change n to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ",
    );

    cy.log("change n to 0");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("have.text", "");
    cy.get(cesc("#\\/m2")).should("have.text", "");

    cy.log("change n to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ",
    );
  });

  it("copy source and index assign names, no new template namespace, inside namespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1" newNamespace><map asList="false">
    <template>Letter $i{name="n1"} is $m{name="v1"}. Repeat: letter $n1 is $v1. </template>
    <sources alias="m" indexAlias="i">
      <sequence type="letters" length="$(../n)" />
   </sources>
  </map></p>

  <p name="m2">$(m1/_map1{name="cpall"})</p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. ",
    );

    cy.log("change n to 2");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ",
    );

    cy.log("change n to 0");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}0{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should("have.text", "");
    cy.get(cesc("#\\/m2")).should("have.text", "");

    cy.log("change n to 3");
    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/m1")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ",
    );
    cy.get(cesc("#\\/m2")).should(
      "have.text",
      "Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ",
    );
  });
});
