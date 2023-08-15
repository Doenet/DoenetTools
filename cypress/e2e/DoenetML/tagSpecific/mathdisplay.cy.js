import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Math Display Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("inline and display", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <m>\\sin(x)</m>
    <me>\\cos(x)</me>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(x)");
      });
    // not sure how to test that it is centered
    cy.get(cesc("#\\/_me1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("cos(x)");
      });
  });

  it("numbered equations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <lorem generateParagraphs="2" />
    <men name="e1">\\sin(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e2">\\cos(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e3">\\tan(x)</men>
    <lorem generateParagraphs="2" />

    <p>We have equation <ref target="e1" name="re1" />, equation <ref target="e2" name="re2" />, and equation <ref target="e3" name="re3" />.</p>
    <p>From copying properties: $e1.equationTag{assignNames="te1"}, $e2.equationTag{assignNames="te2"}, and $e3.equationTag{assignNames="te3"}.</p>

    <lorem generateParagraphs="8" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/e1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("sin(x)(1)");
      });
    cy.get(cesc("#\\/e2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("cos(x)(2)");
      });
    cy.get(cesc("#\\/e3"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("tan(x)(3)");
      });
    cy.get(cesc("#\\/_p1")).should(
      "have.text",
      "We have equation (1), equation (2), and equation (3).",
    );
    cy.get(cesc("#\\/re1")).should("have.text", "(1)");
    cy.get(cesc("#\\/re2")).should("have.text", "(2)");
    cy.get(cesc("#\\/re3")).should("have.text", "(3)");

    cy.get(cesc("#\\/_p2")).should(
      "have.text",
      "From copying properties: 1, 2, and 3.",
    );
    cy.get(cesc("#\\/te1")).should("have.text", "1");
    cy.get(cesc("#\\/te2")).should("have.text", "2");
    cy.get(cesc("#\\/te3")).should("have.text", "3");

    cy.get(cesc("#\\/re1")).click();

    cy.get(cesc("#\\/e1")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(5);
    });

    cy.get(cesc("#\\/re2")).click();

    cy.get(cesc("#\\/e2")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(5);
    });

    cy.get(cesc("#\\/re3")).click();

    cy.get(cesc("#\\/e3")).then((el) => {
      let rect = el[0].getBoundingClientRect();
      expect(rect.top).gt(-1).lt(5);
    });
  });

  it("dynamic numbered equations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <map assignNames="m1 m2 m3 m4 m5 m6">
      <template newNamespace><men name='eq'>$i m</men></template>
      <sources indexAlias="i"><sequence length="$m" /></sources>
    </map>
    <men name="y">y</men>
    <map assignNames="n1 n2 n3 n4 n5 n6">
      <template newNamespace><men name="eq">$i n</men></template>
      <sources indexAlias="i"><sequence length="$n" /></sources>
    </map>
    <men name="z">z</men>
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" target="x" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" target="m1/eq" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" target="m2/eq" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" target="m3/eq" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" target="m4/eq" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" target="m5/eq" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" target="m6/eq" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" target="y" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" target="n1/eq" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" target="n2/eq" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" target="n3/eq" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" target="n4/eq" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" target="n5/eq" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" target="n6/eq" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" target="z" />, equation <ref target="z" name="rz" /></p>
    <p>
      $m.value{assignNames="ma"}
      $n.value{assignNames="na"}
    </p>
    <lorem generateParagraphs="8" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");

    function checkEquationNumbering(m, n) {
      let counter = 1;

      cy.get(cesc("#\\/x"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(`x(${counter})`);
        });
      cy.get(cesc("#\\/px")).should(
        "have.text",
        `x: ${counter}, equation (${counter})`,
      );
      cy.get(cesc("#\\/etx")).should("have.text", `${counter}`);
      cy.get(cesc("#\\/rx")).should("have.text", `(${counter})`);
      cy.get(cesc("#\\/rx")).click();
      cy.get(cesc("#\\/x")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        expect(rect.top).gt(-1).lt(5);
      });

      for (let i = 1; i <= m; i++) {
        cy.window().then(async (win) => {
          counter++;
          cy.get(cesc(`#\\/m${i}\\/eq`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(`${i}m(${counter})`);
            });
          if (i <= 6) {
            cy.get(cesc(`#\\/pm${i}`)).should(
              "have.text",
              `m${i}: ${counter}, equation (${counter})`,
            );
            cy.get(cesc(`#\\/etm${i}`)).should("have.text", `${counter}`);
            cy.get(cesc(`#\\/rm${i}`)).should("have.text", `(${counter})`);
            cy.get(cesc(`#\\/rm${i}`)).click();
            cy.get(cesc(`#\\/m${i}\\/eq`)).then((el) => {
              let rect = el[0].getBoundingClientRect();
              expect(rect.top).gt(-1).lt(5);
            });
          }
        });
      }
      for (let i = m + 1; i <= 6; i++) {
        cy.window().then(async (win) => {
          cy.get(cesc(`#\\/pm${i}`)).should(
            "have.text",
            `m${i}: , equation ???`,
          );
          cy.get(cesc(`#\\/etm${i}`)).should("not.exist");
          cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
          // cy.get(cesc(`#\\/rm${i}`)).click();
          // cy.window().then(async (win) => {
          //   expect(win.scrollY).eq(0);
          // });
        });
      }

      cy.window().then(async (win) => {
        counter++;
        cy.get(cesc("#\\/y"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(`y(${counter})`);
          });
        cy.get(cesc("#\\/py")).should(
          "have.text",
          `y: ${counter}, equation (${counter})`,
        );
        cy.get(cesc("#\\/ety")).should("have.text", `${counter}`);
        cy.get(cesc("#\\/ry")).should("have.text", `(${counter})`);
        cy.get(cesc("#\\/ry")).click();
        cy.get(cesc("#\\/y")).then((el) => {
          let rect = el[0].getBoundingClientRect();
          expect(rect.top).gt(-1).lt(5);
        });
      });

      for (let i = 1; i <= n; i++) {
        cy.window().then(async (win) => {
          counter++;
          cy.get(cesc(`#\\/n${i}\\/eq`))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(`${i}n(${counter})`);
            });
          if (i <= 6) {
            cy.get(cesc(`#\\/pn${i}`)).should(
              "have.text",
              `n${i}: ${counter}, equation (${counter})`,
            );
            cy.get(cesc(`#\\/etn${i}`)).should("have.text", `${counter}`);
            cy.get(cesc(`#\\/rn${i}`)).should("have.text", `(${counter})`);
            cy.get(cesc(`#\\/rn${i}`)).click();
            cy.get(cesc(`#\\/n${i}\\/eq`)).then((el) => {
              let rect = el[0].getBoundingClientRect();
              expect(rect.top).gt(-1).lt(5);
            });
          }
        });
      }

      for (let i = n + 1; i <= 6; i++) {
        cy.window().then(async (win) => {
          cy.get(cesc(`#\\/pn${i}`)).should(
            "have.text",
            `n${i}: , equation ???`,
          );
          cy.get(cesc(`#\\/etn${i}`)).should("not.exist");
          cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
          // cy.get(cesc(`#\\/rn${i}`)).click();
          // cy.window().then(async (win) => {
          //   expect(win.scrollY).eq(0);
          // });
        });
      }

      cy.window().then(async (win) => {
        counter++;
        cy.get(cesc("#\\/z"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(`z(${counter})`);
          });
        cy.get(cesc("#\\/pz")).should(
          "have.text",
          `z: ${counter}, equation (${counter})`,
        );
        cy.get(cesc("#\\/etz")).should("have.text", `${counter}`);
        cy.get(cesc("#\\/rz")).should("have.text", `(${counter})`);
        cy.get(cesc("#\\/rz")).click();
        cy.get(cesc("#\\/z")).then((el) => {
          let rect = el[0].getBoundingClientRect();
          expect(rect.top).gt(-1).lt(5);
        });
      });
    }

    checkEquationNumbering(2, 1);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "4");
    checkEquationNumbering(4, 1);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}2{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "2");
    checkEquationNumbering(4, 2);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}0{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "0");
    checkEquationNumbering(0, 2);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}6{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "6");
    checkEquationNumbering(0, 6);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}3{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "3");
    checkEquationNumbering(3, 6);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}1{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "1");
    checkEquationNumbering(3, 1);
  });

  it("math inside", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <m><math simplify>x+x</math></m>
    <me><math simplify>y+y</math></me>
    <men><math simplify>z+z</math></men>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2x");
      });
    cy.get(cesc("#\\/_me1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2y");
      });
    cy.get(cesc("#\\/_men1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2z(1)");
      });
  });

  it("number inside", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <m><number>1</number></m>
    <me><number>2+0i</number></me>
    <men><number>3+4i</number></men>
    <m><number>5+1i</number></m>
    <me><number>6-1i</number></me>
    <men><number>0-i</number></men>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });
    cy.get(cesc("#\\/_me1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("2");
      });
    cy.get(cesc("#\\/_men1"))
      .find(".mjx-mtd")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("3+4i");
      });
    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("5+i");
      });
    cy.get(cesc("#\\/_me2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("6−i");
      });
    cy.get(cesc("#\\/_men2"))
      .find(".mjx-mtd")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("−i");
      });
  });

  it("align equations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <md>
      <mrow>q \\amp = sin(x)</mrow>
      <mrow>cos(x) \\amp = z</mrow>
    </md>
    <mdn>
      <mrow>q \\amp = sin(x)</mrow>
      <mrow>cos(x) \\amp = z</mrow>
    </mdn>
    <md>
      <mrow number="true">q \\amp = sin(x)</mrow>
      <mrow number="true">cos(x) \\amp = z</mrow>
    </md>
    <mdn>
      <mrow number="false">q \\amp = sin(x)</mrow>
      <mrow number="false">cos(x) \\amp = z</mrow>
    </mdn>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_md1"))
      .find(".mjx-mtr")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q=sin(x)");
      });
    cy.get(cesc("#\\/_md1"))
      .find(".mjx-mtr")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("cos(x)=z");
      });
    cy.get(cesc("#\\/_mdn1"))
      .find(".mjx-mlabeledtr")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q=sin(x)");
      });
    cy.get(cesc("#\\/_mdn1"))
      .find(".mjx-mlabeledtr")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("cos(x)=z");
      });
    cy.get(cesc("#\\/_mdn1"))
      .find(".mjx-label")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(1)");
      });
    cy.get(cesc("#\\/_mdn1"))
      .find(".mjx-label")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(2)");
      });
    cy.get(cesc("#\\/_md2"))
      .find(".mjx-mlabeledtr")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q=sin(x)");
      });
    cy.get(cesc("#\\/_md2"))
      .find(".mjx-mlabeledtr")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("cos(x)=z");
      });
    cy.get(cesc("#\\/_md2"))
      .find(".mjx-label")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(3)");
      });
    cy.get(cesc("#\\/_md2"))
      .find(".mjx-label")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("(4)");
      });
    cy.get(cesc("#\\/_mdn2"))
      .find(".mjx-mtr")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("q=sin(x)");
      });
    cy.get(cesc("#\\/_mdn2"))
      .find(".mjx-mtr")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("cos(x)=z");
      });
  });

  it("dynamic numbered aligned equations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <map assignNames="m1 m2 m3 m4 m5 m6">
        <template newNamespace><mrow name='eq'>$i m &amp;= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$m" from="11" /></sources>
      </map>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <map assignNames="n1 n2 n3 n4 n5 n6">
        <template newNamespace><mrow name="eq">$i n &= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" target="x" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" target="m1/eq" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" target="m2/eq" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" target="m3/eq" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" target="m4/eq" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" target="m5/eq" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" target="m6/eq" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" target="y" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" target="n1/eq" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" target="n2/eq" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" target="n3/eq" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" target="n4/eq" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" target="n5/eq" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" target="n6/eq" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" target="z" />, equation <ref target="z" name="rz" /></p>
    <p>
      $m.value{assignNames="ma"}
      $n.value{assignNames="na"}
    </p>
    <lorem generateParagraphs="8" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");

    function checkEquationNumbering(m, n) {
      let counter = 1;

      cy.get(cesc("#\\/x"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(`x(${counter})`);
        });
      cy.get(cesc("#\\/px")).should(
        "have.text",
        `x: ${counter}, equation (${counter})`,
      );
      cy.get(cesc("#\\/etx")).should("have.text", `${counter}`);
      cy.get(cesc("#\\/rx")).should("have.text", `(${counter})`);
      cy.get(cesc("#\\/rx")).click();
      cy.get(cesc("#\\/x")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        expect(rect.top).gt(-1).lt(5);
      });

      for (let i = 1; i <= m; i++) {
        cy.window().then(async (win) => {
          counter++;
          cy.get(cesc("#\\/ms"))
            .find(".mjx-mlabeledtr")
            .eq(i - 1)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(`${i}m=${i + 10}`);
            });
          cy.get(cesc("#\\/ms"))
            .find(".mjx-label")
            .eq(i - 1)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(`(${counter})`);
            });
          if (i <= 6) {
            cy.get(cesc(`#\\/pm${i}`)).should(
              "have.text",
              `m${i}: ${counter}, equation (${counter})`,
            );
            cy.get(cesc(`#\\/etm${i}`)).should("have.text", `${counter}`);
            cy.get(cesc(`#\\/rm${i}`)).should("have.text", `(${counter})`);
            cy.get(cesc(`#\\/rm${i}`)).click();
            cy.get(cesc(`#\\/m${i}\\/eq`)).then((el) => {
              let rect = el[0].getBoundingClientRect();
              expect(rect.top).gt(-1).lt(5);
            });
          }
        });
      }
      for (let i = m + 1; i <= 6; i++) {
        cy.window().then(async (win) => {
          cy.get(cesc(`#\\/pm${i}`)).should(
            "have.text",
            `m${i}: , equation ???`,
          );
          cy.get(cesc(`#\\/etm${i}`)).should("not.exist");
          cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
          // cy.get(cesc(`#\\/rm${i}`)).click();
          // cy.window().then(async (win) => {
          //   expect(win.scrollY).eq(0);
          // });
        });
      }

      cy.window().then(async (win) => {
        counter++;
        cy.get(cesc("#\\/y"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(`y(${counter})`);
          });
        cy.get(cesc("#\\/py")).should(
          "have.text",
          `y: ${counter}, equation (${counter})`,
        );
        cy.get(cesc("#\\/ety")).should("have.text", `${counter}`);
        cy.get(cesc("#\\/ry")).should("have.text", `(${counter})`);
        cy.get(cesc("#\\/ry")).click();
        cy.get(cesc("#\\/y")).then((el) => {
          let rect = el[0].getBoundingClientRect();
          expect(rect.top).gt(-1).lt(5);
        });
      });

      for (let i = 1; i <= n; i++) {
        cy.window().then(async (win) => {
          counter++;
          cy.get(cesc("#\\/ns"))
            .find(".mjx-mlabeledtr")
            .eq(i - 1)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(`${i}n=${i + 10}`);
            });
          cy.get(cesc("#\\/ns"))
            .find(".mjx-label")
            .eq(i - 1)
            .invoke("text")
            .then((text) => {
              expect(text.trim()).equal(`(${counter})`);
            });
          if (i <= 6) {
            cy.get(cesc(`#\\/pn${i}`)).should(
              "have.text",
              `n${i}: ${counter}, equation (${counter})`,
            );
            cy.get(cesc(`#\\/etn${i}`)).should("have.text", `${counter}`);
            cy.get(cesc(`#\\/rn${i}`)).should("have.text", `(${counter})`);
            cy.get(cesc(`#\\/rn${i}`)).click();
            cy.get(cesc(`#\\/n${i}\\/eq`)).then((el) => {
              let rect = el[0].getBoundingClientRect();
              expect(rect.top).gt(-1).lt(5);
            });
          }
        });
      }

      for (let i = n + 1; i <= 6; i++) {
        cy.window().then(async (win) => {
          cy.get(cesc(`#\\/pn${i}`)).should(
            "have.text",
            `n${i}: , equation ???`,
          );
          cy.get(cesc(`#\\/etn${i}`)).should("not.exist");
          cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
          // cy.get(cesc(`#\\/rn${i}`)).click();
          // cy.window().then(async (win) => {
          //   expect(win.scrollY).eq(0);
          // });
        });
      }

      cy.window().then(async (win) => {
        counter++;
        cy.get(cesc("#\\/z"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(`z(${counter})`);
          });
        cy.get(cesc("#\\/pz")).should(
          "have.text",
          `z: ${counter}, equation (${counter})`,
        );
        cy.get(cesc("#\\/etz")).should("have.text", `${counter}`);
        cy.get(cesc("#\\/rz")).should("have.text", `(${counter})`);
        cy.get(cesc("#\\/rz")).click();
        cy.get(cesc("#\\/z")).then((el) => {
          let rect = el[0].getBoundingClientRect();
          expect(rect.top).gt(-1).lt(5);
        });
      });
    }

    checkEquationNumbering(2, 1);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "4");
    checkEquationNumbering(4, 1);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}2{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "2");
    checkEquationNumbering(4, 2);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}0{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "0");
    checkEquationNumbering(0, 2);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}6{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "6");
    checkEquationNumbering(0, 6);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}3{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "3");
    checkEquationNumbering(3, 6);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}1{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "1");
    checkEquationNumbering(3, 1);
  });

  it("dynamic numbered aligned equations, numbering swapped", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <map assignNames="m1 m2 m3 m4 m5 m6">
        <template newNamespace><mrow name='eq' number="mod($i,2)=1">$i m &amp;= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$m" from="11" /></sources>
      </map>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <map assignNames="n1 n2 n3 n4 n5 n6">
        <template newNamespace><mrow name="eq" number="(-1)^$i = 1">$i n &= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" target="x" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" target="m1/eq" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" target="m2/eq" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" target="m3/eq" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" target="m4/eq" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" target="m5/eq" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" target="m6/eq" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" target="y" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" target="n1/eq" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" target="n2/eq" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" target="n3/eq" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" target="n4/eq" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" target="n5/eq" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" target="n6/eq" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" target="z" />, equation <ref target="z" name="rz" /></p>
    <p>
      $m.value{assignNames="ma"}
      $n.value{assignNames="na"}
    </p>
    <lorem generateParagraphs="8" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");

    function checkEquationNumbering(m, n) {
      let counter = 1;

      cy.get(cesc("#\\/x"))
        .find(".mjx-mrow")
        .eq(0)
        .invoke("text")
        .then((text) => {
          expect(text.trim()).equal(`x(${counter})`);
        });
      cy.get(cesc("#\\/px")).should(
        "have.text",
        `x: ${counter}, equation (${counter})`,
      );
      cy.get(cesc("#\\/etx")).should("have.text", `${counter}`);
      cy.get(cesc("#\\/rx")).should("have.text", `(${counter})`);
      cy.get(cesc("#\\/rx")).click();
      cy.url().should("match", RegExp(cesc(`#\\/x`) + "$"));
      cy.get(cesc("#\\/x")).then((el) => {
        let rect = el[0].getBoundingClientRect();
        expect(rect.top).gt(-1).lt(5);
      });

      let labeledMs = 0;
      let unlabeledMs = 0;
      for (let i = 1; i <= m; i++) {
        cy.window().then(async (win) => {
          if (i % 2 === 1) {
            labeledMs++;
            counter++;
            cy.get(cesc("#\\/ms"))
              .find(".mjx-mlabeledtr")
              .eq(labeledMs - 1)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(`${i}m=${i + 10}`);
              });
            cy.get(cesc("#\\/ms"))
              .find(".mjx-label")
              .eq(i - 1)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(`(${counter})`);
              });
            if (i <= 6) {
              cy.get(cesc(`#\\/pm${i}`)).should(
                "have.text",
                `m${i}: ${counter}, equation (${counter})`,
              );
              cy.get(cesc(`#\\/etm${i}`)).should("have.text", `${counter}`);
              cy.get(cesc(`#\\/rm${i}`)).should("have.text", `(${counter})`);
              cy.get(cesc(`#\\/rm${i}`)).click();
              cy.url().should("match", RegExp(cesc(`#\\/m${i}\\/eq`) + "$"));
              cy.get(cesc(`#\\/m${i}\\/eq`)).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
              });
            }
          } else {
            unlabeledMs++;
            cy.get(cesc("#\\/ms"))
              .find(".mjx-mtr")
              .eq(unlabeledMs - 1)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(`${i}m=${i + 10}`);
              });
            if (i <= 6) {
              cy.get(cesc(`#\\/pm${i}`)).should(
                "have.text",
                `m${i}: , equation ???`,
              );
              cy.get(cesc(`#\\/etm${i}`)).should("have.text", "");
              cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
              cy.get(cesc(`#\\/rm${i}`)).click();
              cy.url().should("match", RegExp(cesc(`#\\/m${i}\\/eq`) + "$"));
            }
          }
        });
      }
      for (let i = m + 1; i <= 6; i++) {
        cy.window().then(async (win) => {
          cy.get(cesc(`#\\/pm${i}`)).should(
            "have.text",
            `m${i}: , equation ???`,
          );
          cy.get(cesc(`#\\/etm${i}`)).should("not.exist");
          cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
          cy.get(cesc(`#\\/rm${i}`)).click();
          cy.url().should("match", RegExp(`#$`));
          // cy.window().then(async (win) => {
          //   expect(win.scrollY).eq(0);
          // });
        });
      }

      cy.window().then(async (win) => {
        counter++;
        cy.get(cesc("#\\/y"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(`y(${counter})`);
          });
        cy.get(cesc("#\\/py")).should(
          "have.text",
          `y: ${counter}, equation (${counter})`,
        );
        cy.get(cesc("#\\/ety")).should("have.text", `${counter}`);
        cy.get(cesc("#\\/ry")).should("have.text", `(${counter})`);
        cy.get(cesc("#\\/ry")).click();
        cy.url().should("match", RegExp(cesc(`#\\/y`) + "$"));
        cy.get(cesc("#\\/y")).then((el) => {
          let rect = el[0].getBoundingClientRect();
          expect(rect.top).gt(-1).lt(5);
        });
      });

      let labeledNs = 0;
      let unlabeledNs = 0;
      for (let i = 1; i <= n; i++) {
        cy.window().then(async (win) => {
          if (i % 2 === 0) {
            labeledNs++;
            counter++;
            cy.get(cesc("#\\/ns"))
              .find(".mjx-mlabeledtr")
              .eq(labeledNs - 1)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(`${i}n=${i + 10}`);
              });
            cy.get(cesc("#\\/ns"))
              .find(".mjx-label")
              .eq(i - 1)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(`(${counter})`);
              });
            if (i <= 6) {
              cy.get(cesc(`#\\/pn${i}`)).should(
                "have.text",
                `n${i}: ${counter}, equation (${counter})`,
              );
              cy.get(cesc(`#\\/etn${i}`)).should("have.text", `${counter}`);
              cy.get(cesc(`#\\/rn${i}`)).should("have.text", `(${counter})`);
              cy.get(cesc(`#\\/rn${i}`)).click();
              cy.url().should("match", RegExp(cesc(`#\\/n${i}\\/eq`) + "$"));
              cy.get(cesc(`#\\/n${i}\\/eq`)).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
              });
            }
          } else {
            unlabeledNs++;
            cy.get(cesc("#\\/ns"))
              .find(".mjx-mtr")
              .eq(unlabeledNs - 1)
              .invoke("text")
              .then((text) => {
                expect(text.trim()).equal(`${i}n=${i + 10}`);
              });
            if (i <= 6) {
              cy.get(cesc(`#\\/pn${i}`)).should(
                "have.text",
                `n${i}: , equation ???`,
              );
              cy.get(cesc(`#\\/etn${i}`)).should("have.text", ``);
              cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
              cy.get(cesc(`#\\/rn${i}`)).click();
              cy.url().should("match", RegExp(cesc(`#\\/n${i}\\/eq`) + "$"));
            }
          }
        });
      }

      for (let i = n + 1; i <= 6; i++) {
        cy.window().then(async (win) => {
          cy.get(cesc(`#\\/pn${i}`)).should(
            "have.text",
            `n${i}: , equation ???`,
          );
          cy.get(cesc(`#\\/etn${i}`)).should("not.exist");
          cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
          cy.get(cesc(`#\\/rn${i}`)).click();
          cy.url().should("match", RegExp(`#$`));
          // cy.window().then(async (win) => {
          //   expect(win.scrollY).eq(0);
          // });
        });
      }

      cy.window().then(async (win) => {
        counter++;
        cy.get(cesc("#\\/z"))
          .find(".mjx-mrow")
          .eq(0)
          .invoke("text")
          .then((text) => {
            expect(text.trim()).equal(`z(${counter})`);
          });
        cy.get(cesc("#\\/pz")).should(
          "have.text",
          `z: ${counter}, equation (${counter})`,
        );
        cy.get(cesc("#\\/etz")).should("have.text", `${counter}`);
        cy.get(cesc("#\\/rz")).should("have.text", `(${counter})`);
        cy.get(cesc("#\\/rz")).click();
        cy.url().should("match", RegExp(cesc(`#\\/z`) + "$"));
        cy.get(cesc("#\\/z")).then((el) => {
          let rect = el[0].getBoundingClientRect();
          expect(rect.top).gt(-1).lt(5);
        });
      });
    }

    checkEquationNumbering(2, 1);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}4{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "4");
    checkEquationNumbering(4, 1);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}2{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "2");
    checkEquationNumbering(4, 2);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}0{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "0");
    checkEquationNumbering(0, 2);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}6{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "6");
    checkEquationNumbering(0, 6);

    cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}3{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/ma")).should("contain.text", "3");
    checkEquationNumbering(3, 6);

    cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}1{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("contain.text", "1");
    checkEquationNumbering(3, 1);
  });

  it("add commas to large integers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><intcomma>25236501.35</intcomma></p>
    <p><intcomma><math>25236501.35</math></intcomma></p>
    <p><m><intcomma>25236501.35</intcomma></m></p>
    <p><m><intcomma><math>25236501.35</math></intcomma></m></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_p1")).should("have.text", "25,236,501.35");
    cy.get(cesc("#\\/_p2")).should("have.text", "25,236,501.35");
    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("25,236,501.35");
      });
    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("25,236,501.35");
      });
  });

  it("include blank string children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <math name="b">beta</math>
    <math name="s">s</math>
    <m>$b $s</m>
    <me>$b $s</me>
    <md>
      <mrow>$b $s</mrow>
    </md>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("βs");
      });
    cy.get(cesc("#\\/_me1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("βs");
      });
    cy.get(cesc("#\\/_md1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("βs");
      });
  });

  it("aslist inside displayed math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    
    <m>s=<aslist name="al"><sequence from="1" to="3" /></aslist></m>
    <m>s=$al</m>
    <me>s = $al</me>
    <md>
      <mrow>s \\amp= $al</mrow>
    </md>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/_m1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s=1,2,3");
      });
    cy.get(cesc("#\\/_m2"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s=1,2,3");
      });
    cy.get(cesc("#\\/_me1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s=1,2,3");
      });
    cy.get(cesc("#\\/_md1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("s=1,2,3");
      });
  });

  it("change essential latex", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    
    <m name="m" />
    <p><updateValue name="uv" target="m.latex" type="text" newValue="\\frac{1}{2}" ><label>Change latex</label></updateValue></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/m"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.latex).eq("");
    });
    cy.get(cesc("#\\/uv")).click();

    cy.get(cesc("#\\/m") + " .mjx-mrow").should("contain.text", "12");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m"].stateValues.latex).eq("\\frac{1}{2}");
    });
  });

  it("subscripts and superscripts numbers to unicode text", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  <p><m name="m1">2x_1y_{23}+z_{456}-a_{7+8-90}</m></p>
  <p><m name="m2">2x^1y^{23}+z^{456}-a^{7+8-90}</m></p>
  <p name="m1t">$m1.text</p>
  <p name="m2t">$m2.text</p>

  <p><md name="md">
    <mrow>2x_1y_{23}+z_{456}-a_{7+8-90}</mrow>
    <mrow>2x^1y^{23}+z^{456}-a^{7+8-90}</mrow>
    </md>
  </p>
  <p name="mdt">$md.text</p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded
    cy.get(cesc("#\\/m1t")).should("have.text", "2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀");
    cy.get(cesc("#\\/m2t")).should("have.text", "2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰");
    cy.get(cesc("#\\/mdt")).should(
      "have.text",
      "2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀\\\\\n2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰",
    );
  });

  it("m in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <m anchor="$anchorCoords1" name="math1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">\\frac{\\partial f}{\\partial x}</m>
      <m name="math2">\\int_a^b f(x) dx</m>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $math1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $math2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$math2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $math1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $math2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$math2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$math2.draggable" /></p>
    <p name="pContent1">Content 1: $math1</p>
    <p name="pContent2">Content 2: $math2</p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: upperright",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: center",
    );
    cy.get(cesc("#\\/positionFromAnchor1")).should("have.value", "1");
    cy.get(cesc("#\\/positionFromAnchor2")).should("have.value", "9");
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");
    cy.get(cesc("#\\/pContent1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∂f∂x");
    cy.get(cesc("#\\/pContent2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∫baf(x)dx");

    cy.log("move maths by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: 4, y: -5 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−5)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,−5)");

    cy.log("move maths by entering coordinates");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should("contain.text", "(8,9)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("change position from anchor");
    cy.get(cesc("#\\/positionFromAnchor1")).select("lowerLeft");
    cy.get(cesc("#\\/positionFromAnchor2")).select("lowerRight");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: lowerleft",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("make not draggable");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: false");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: false");

    cy.log("cannot move maths by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: -8, y: -7 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");
  });

  it("m in graph, handle bad anchor coordinates", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph >
      <m anchor="$anchorCoords1" name="m1">x^2</m>
    </graph>
    

    <p name="pAnchor1">Anchor 1 coordinates: $m1.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="x" /></p>
    

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x");

    cy.log("give good anchor coords");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "(6,7)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");

    cy.log("give bad anchor coords again");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}q{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow").should("contain.text", "q");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "q");
  });

  it("me in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <me anchor="$anchorCoords1" name="math1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">\\frac{\\partial f}{\\partial x}</me>
      <me name="math2">\\int_a^b f(x) dx</me>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $math1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $math2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$math2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $math1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $math2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$math2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$math2.draggable" /></p>
    <p name="pContent1">Content 1: $math1</p>
    <p name="pContent2">Content 2: $math2</p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: upperright",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: center",
    );
    cy.get(cesc("#\\/positionFromAnchor1")).should("have.value", "1");
    cy.get(cesc("#\\/positionFromAnchor2")).should("have.value", "9");
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");
    cy.get(cesc("#\\/pContent1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∂f∂x");
    cy.get(cesc("#\\/pContent2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "∫baf(x)dx");

    cy.log("move maths by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: 4, y: -5 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−5)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,−5)");

    cy.log("move maths by entering coordinates");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should("contain.text", "(8,9)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("change position from anchor");
    cy.get(cesc("#\\/positionFromAnchor1")).select("lowerLeft");
    cy.get(cesc("#\\/positionFromAnchor2")).select("lowerRight");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: lowerleft",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("make not draggable");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: false");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: false");

    cy.log("cannot move maths by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: -8, y: -7 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");
  });

  it("md in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <md anchor="$anchorCoords1" name="math1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">
        <mrow>Q \\amp= \\frac{\\partial f}{\\partial x}</mrow>
        <mrow>R \\amp= \\frac{\\partial g}{\\partial y}</mrow>
      </md>
      <md name="math2">
        <mrow>F \\amp=\\int_a^b f(x) dx</mrow>
        <mrow>G \\amp=\\int_c^d g(y) dy</mrow>
      </md>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $math1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $math2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$math2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $math1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $math2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$math2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$math2.draggable" /></p>
    <p name="pContent1">Content 1: $math1</p>
    <p name="pContent2">Content 2: $math2</p>
    <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(1,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(0,0)");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: upperright",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: center",
    );
    cy.get(cesc("#\\/positionFromAnchor1")).should("have.value", "1");
    cy.get(cesc("#\\/positionFromAnchor2")).should("have.value", "9");
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: true");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: true");
    cy.get(cesc("#\\/pContent1"))
      .find(".mjx-mtr")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("Q=∂f∂x");
      });
    cy.get(cesc("#\\/pContent1"))
      .find(".mjx-mtr")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("R=∂g∂y");
      });
    cy.get(cesc("#\\/pContent2"))
      .find(".mjx-mtr")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("F=∫baf(x)dx");
      });
    cy.get(cesc("#\\/pContent2"))
      .find(".mjx-mtr")
      .eq(1)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("G=∫dcg(y)dy");
      });

    cy.log("move maths by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: 4, y: -5 },
      });
    });

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should(
      "contain.text",
      "(4,−5)",
    );

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(−2,3)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(4,−5)");

    cy.log("move maths by entering coordinates");

    cy.get(cesc("#\\/anchorCoords1") + " textarea").type(
      "{home}{shift+end}{backspace}(6,7){enter}",
      { force: true },
    );
    cy.get(cesc("#\\/anchorCoords2") + " textarea").type(
      "{home}{shift+end}{backspace}(8,9){enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow").should("contain.text", "(8,9)");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");

    cy.log("change position from anchor");
    cy.get(cesc("#\\/positionFromAnchor1")).select("lowerLeft");
    cy.get(cesc("#\\/positionFromAnchor2")).select("lowerRight");

    cy.get(cesc("#\\/pPositionFromAnchor1")).should(
      "have.text",
      "Position from anchor 1: lowerleft",
    );
    cy.get(cesc("#\\/pPositionFromAnchor2")).should(
      "have.text",
      "Position from anchor 2: lowerright",
    );

    cy.log("make not draggable");

    cy.get(cesc("#\\/draggable1")).click();
    cy.get(cesc("#\\/draggable2")).click();
    cy.get(cesc("#\\/pDraggable1")).should("have.text", "Draggable 1: false");
    cy.get(cesc("#\\/pDraggable2")).should("have.text", "Draggable 2: false");

    cy.log("cannot move maths by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveMath",
        componentName: "/math2",
        args: { x: -8, y: -7 },
      });
    });

    // since nothing will change, wait for boolean input to change to know core has responded
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b")).should("have.text", "true");

    cy.get(cesc("#\\/pAnchor1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(6,7)");
    cy.get(cesc("#\\/pAnchor2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "(8,9)");
  });

  it("color m via style", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><m name="no_style">x^2</m> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><m name="fixed_style" stylenumber="2">x^3</m> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><m name="variable_style" stylenumber="$sn">x^4</m> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    // TODO: how to test color in graph

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should(
      "have.text",
      "red with a blue background",
    );
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "red");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "blue");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(255, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgb(0, 0, 255)",
    );
  });

  it("color me via style", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><me name="no_style">x^2</me> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><me name="fixed_style" stylenumber="2">x^3</me> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><me name="variable_style" stylenumber="$sn">x^4</me> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    // TODO: how to test color in graph

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should(
      "have.text",
      "red with a blue background",
    );
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "red");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "blue");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(255, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgb(0, 0, 255)",
    );
  });

  it("color md via style", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><md name="no_style"><mrow>x^2</mrow><mrow>y^2</mrow></md> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><md name="fixed_style" stylenumber="2"><mrow>x^3</mrow><mrow>y^3</mrow></md> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><md name="variable_style" stylenumber="$sn"><mrow>x^4</mrow><mrow>y^4</mrow></md> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    // TODO: how to test color in graph

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}2{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/tsd_variable_style")).should(
      "have.text",
      "red with a blue background",
    );
    cy.get(cesc("#\\/tc_variable_style")).should("have.text", "red");
    cy.get(cesc("#\\/bc_variable_style")).should("have.text", "blue");

    cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
    cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

    cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
    cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

    cy.get(cesc("#\\/no_style")).should("have.css", "color", "rgb(0, 0, 0)");
    cy.get(cesc("#\\/no_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "color",
      "rgb(0, 128, 0)",
    );
    cy.get(cesc("#\\/fixed_style")).should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)",
    );

    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "color",
      "rgb(255, 0, 0)",
    );
    cy.get(cesc("#\\/variable_style")).should(
      "have.css",
      "background-color",
      "rgb(0, 0, 255)",
    );
  });

  it("m copied by plain macro, but not latex, reflects style and anchor position", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" />
      </styleDefinitions>
    </setup>

    <text>a</text>

    <graph name="g1">
      <m styleNumber="2" name="m1">x^2</m>
      <m styleNumber="3" anchor="(3,4)" name="m2" >x^3</m>
    </graph>

    <coords copySource="m1.anchor" name="m1coords" />
    <coords copySource="m2.anchor" name="m2coords" />

    <graph name="g2">
      $m1
      $m2
    </graph>

    <collect componentTypes="m" source="g2" prop="anchor" assignNames="m1acoords m2acoords" />

    <graph name="g3">
      $m1.latex
      $m2.latex
    </graph>

    <collect componentTypes="text" source="g3" prop="anchor" assignNames="m1bcoords m2bcoords" />

    <p name="p1">$m1 $m2</p>

    <p name="p2">$m1.latex $m2.latex</p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let m1aName = stateVariables["/g2"].activeChildren[0].componentName;
      let m2aName = stateVariables["/g2"].activeChildren[1].componentName;
      let m1bName = stateVariables["/g3"].activeChildren[0].componentName;
      let m2bName = stateVariables["/g3"].activeChildren[1].componentName;
      let m1cName = stateVariables["/p1"].activeChildren[0].componentName;
      let m2cName = stateVariables["/p1"].activeChildren[2].componentName;
      let m1dName = stateVariables["/p2"].activeChildren[0].componentName;
      let m2dName = stateVariables["/p2"].activeChildren[2].componentName;

      let m1cAnchor = "#" + cesc2(m1cName) + " .mjx-mrow";
      let m2cAnchor = "#" + cesc2(m2cName) + " .mjx-mrow";
      let m1dAnchor = "#" + cesc2(m1dName);
      let m2dAnchor = "#" + cesc2(m2dName);

      cy.get(m1cAnchor).eq(0).should("have.text", "x2");
      cy.get(m1dAnchor).should("have.text", "x^2");
      cy.get(m2cAnchor).eq(0).should("have.text", "x3");
      cy.get(m2dAnchor).should("have.text", "x^3");

      cy.get(m1cAnchor).should("have.css", "color", "rgb(0, 128, 0)");
      cy.get(m1dAnchor).should("have.css", "color", "rgb(0, 0, 0)");
      cy.get(m2cAnchor).should("have.css", "color", "rgb(255, 0, 0)");
      cy.get(m2dAnchor).should("have.css", "color", "rgb(0, 0, 0)");

      cy.get(cesc("#\\/m1coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc("#\\/m2coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(3,4)");
      cy.get(cesc("#\\/m1acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc("#\\/m2acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(3,4)");
      cy.get(cesc("#\\/m1bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc("#\\/m2bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");

      cy.log("move first ms");
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveMath",
          componentName: "/m1",
          args: { x: -2, y: 3 },
        });
        win.callAction1({
          actionName: "moveMath",
          componentName: "/m2",
          args: { x: 4, y: -5 },
        });
      });

      cy.get(cesc("#\\/m2coords") + " .mjx-mrow").should(
        "contain.text",
        "(4,−5)",
      );

      cy.get(cesc("#\\/m1coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−2,3)");
      cy.get(cesc("#\\/m2coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(4,−5)");
      cy.get(cesc("#\\/m1acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−2,3)");
      cy.get(cesc("#\\/m2acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(4,−5)");
      cy.get(cesc("#\\/m1bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc("#\\/m2bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");

      cy.log("move second ms");
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveMath",
          componentName: m1aName,
          args: { x: 7, y: 1 },
        });
        win.callAction1({
          actionName: "moveMath",
          componentName: m2aName,
          args: { x: -8, y: 2 },
        });
      });

      cy.get(cesc("#\\/m2coords") + " .mjx-mrow").should(
        "contain.text",
        "(−8,2)",
      );

      cy.get(cesc("#\\/m1coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,1)");
      cy.get(cesc("#\\/m2coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−8,2)");
      cy.get(cesc("#\\/m1acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,1)");
      cy.get(cesc("#\\/m2acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−8,2)");
      cy.get(cesc("#\\/m1bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");
      cy.get(cesc("#\\/m2bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(0,0)");

      cy.log("move third ms");
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "moveText",
          componentName: m1bName,
          args: { x: -6, y: 3 },
        });
        win.callAction1({
          actionName: "moveText",
          componentName: m2bName,
          args: { x: -5, y: -4 },
        });
      });

      cy.get(cesc("#\\/m2bcoords") + " .mjx-mrow").should(
        "contain.text",
        "(−5,−4)",
      );

      cy.get(cesc("#\\/m1coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,1)");
      cy.get(cesc("#\\/m2coords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−8,2)");
      cy.get(cesc("#\\/m1acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(7,1)");
      cy.get(cesc("#\\/m2acoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−8,2)");
      cy.get(cesc("#\\/m1bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−6,3)");
      cy.get(cesc("#\\/m2bcoords") + " .mjx-mrow")
        .eq(0)
        .should("have.text", "(−5,−4)");
    });
  });

  it("warning if have child with string text or latex state variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<m>x = <answer>x</answer></m>`,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_m1") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "x=");

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(1);

      expect(errorWarnings.warnings[0].message).contain(
        `Child <answer> of <m> ignored as it does not have a string "text" or "latex" state variable`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(29);
    });
  });
});
