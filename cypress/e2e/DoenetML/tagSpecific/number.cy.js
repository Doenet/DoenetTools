import me from "math-expressions";
import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Number Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("1+1", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <copy target="_number1" />
      <number>1+1</number>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let number0Name = stateVariables["/_copy1"].replacements[0].componentName;
      let number0Anchor = cesc2("#" + number0Name);

      cy.log("Test value displayed in browser");
      cy.get(number0Anchor).should("have.text", "2");
      cy.get(cesc("#\\/_number1")).should("have.text", "2");

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables[number0Name].stateValues.value).eq(2);
        expect(stateVariables["/_number1"].stateValues.value).eq(2);
      });
    });
  });

  it(`number that isn't a number`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <copy target="_number1" />
      <number>x+1</number>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let number0Name = stateVariables["/_copy1"].replacements[0].componentName;
      let number0Anchor = cesc2("#" + number0Name);

      cy.log("Test value displayed in browser");
      cy.get(number0Anchor).should("have.text", "NaN");
      cy.get(cesc("#\\/_number1")).should("have.text", "NaN");

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        assert.isNaN(stateVariables[number0Name].stateValues.value);
        assert.isNaN(stateVariables["/_number1"].stateValues.value);
      });
    });
  });

  it(`number becomes non-numeric through inverse`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="n">5</number>
      <mathinput bindValueTo="$n" />
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n")).should("have.text", "5");

    cy.get(cesc("#\\/_mathinput1") + " textarea").type("{end}x{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/n")).should("have.text", "NaN");

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{ctrl+home}{shift+end}{backspace}9{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/n")).should("have.text", "9");
  });

  it("number in math", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <math>x+<number>3</number></math>
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
        expect(text.trim()).equal("x+3");
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.value).eqls(["+", "x", 3]);
      expect(stateVariables["/_number1"].stateValues.value).to.eq(3);
    });
  });

  it("math in number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number><math>5+<math>3</math></math></number>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_number1")).should("have.text", "8");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.value).eqls(["+", 5, 3]);
      expect(stateVariables["/_math2"].stateValues.value).eq(3);
      expect(stateVariables["/_number1"].stateValues.value).eq(8);
    });
  });

  it("number converts to decimals", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number>log(0.5/0.3)</number>, 
      <math><copy target="_number1" /></math>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    let num = Math.log(0.5 / 0.3);
    let numString = me.math.round(num, 3).toString();

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_number1")).should("have.text", numString);
    cy.get(cesc("#\\/_math1"))
      .find(".mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal(numString);
      });

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.value).closeTo(num, 1e-14);
      expect(stateVariables["/_number1"].stateValues.value).closeTo(num, 1e-14);
    });
  });

  it("rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="n1">234234823.34235235324</number>
      <number name="n2">5.4285023408250342</number>
      <number name="n3">0.000000000000005023481340324</number>
      <copy target="n1" displayDigits='5' ignoreDisplayDecimals assignNames="n1a" />
      <copy target="n1" displayDecimals='3' assignNames="n1b" />
      <copy target="n1" displayDigits='5' displaySmallAsZero="false" assignNames="n1c" />
      <copy target="n2" displayDigits='5' assignNames="n2a" />
      <copy target="n2" displayDecimals='3' assignNames="n2b" />
      <copy target="n2" displayDigits='5' displaySmallAsZero="false" assignNames="n2c" />
      <copy target="n3" displayDigits='5' assignNames="n3a" />
      <copy target="n3" displayDecimals='3' assignNames="n3b" />
      <copy target="n3" displayDigits='5' displaySmallAsZero="false" assignNames="n3c" />

      <copy target="n1a" displayDigits='5' assignNames="n1aa" />
      <copy target="n1a" displayDecimals='3' assignNames="n1ab" />
      <copy target="n2a" displayDigits='5' assignNames="n2aa" />
      <copy target="n2a" displayDecimals='3' assignNames="n2ab" />
      <copy target="n3a" displayDigits='5' displaySmallAsZero="false" assignNames="n3aa" />
      <copy target="n3a" displayDecimals='3' displaySmallAsZero="false" ignoreDisplayDigits assignNames="n3ab" />

      <copy target="n1b" displayDigits='5' ignoreDisplayDecimals assignNames="n1ba" />
      <copy target="n1b" displayDecimals='3' assignNames="n1bb" />
      <copy target="n2b" displayDigits='5' assignNames="n2ba" />
      <copy target="n2b" displayDecimals='3' assignNames="n2bb" />
      <copy target="n3b" displayDigits='5' displaySmallAsZero="false" assignNames="n3ba" />
      <copy target="n3b" displayDecimals='3' displaySmallAsZero="false" ignoreDisplayDigits assignNames="n3bb" />

      <m name="n1am">$n1a</m>
      <m name="n1bm">$n1b</m>
      <m name="n1cm">$n1c</m>
      <m name="n2am">$n2a</m>
      <m name="n2bm">$n2b</m>
      <m name="n2cm">$n2c</m>
      <m name="n3am">$n3a</m>
      <m name="n3bm">$n3b</m>
      <m name="n3cm">$n3c</m>

      <m name="n1aam">$n1aa</m>
      <m name="n1abm">$n1ab</m>
      <m name="n2aam">$n2aa</m>
      <m name="n2abm">$n2ab</m>
      <m name="n3aam">$n3aa</m>
      <m name="n3abm">$n3ab</m>

      <m name="n1bam">$n1ba</m>
      <m name="n1bbm">$n1bb</m>
      <m name="n2bam">$n2ba</m>
      <m name="n2bbm">$n2bb</m>
      <m name="n3bam">$n3ba</m>
      <m name="n3bbm">$n3bb</m>
      
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n1")).should("have.text", "234234823.34");
    cy.get(cesc("#\\/n1a")).should("have.text", "234230000");
    cy.get(cesc("#\\/n1b")).should("have.text", "234234823.342");
    cy.get(cesc("#\\/n1c")).should("have.text", "234234823.34");
    cy.get(cesc("#\\/n1am") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234230000");
    cy.get(cesc("#\\/n1bm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234234823.342");
    cy.get(cesc("#\\/n1cm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234234823.34");

    cy.get(cesc("#\\/n2")).should("have.text", "5.43");
    cy.get(cesc("#\\/n2a")).should("have.text", "5.4285");
    cy.get(cesc("#\\/n2b")).should("have.text", "5.429");
    cy.get(cesc("#\\/n2c")).should("have.text", "5.4285");
    cy.get(cesc("#\\/n2am") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.4285");
    cy.get(cesc("#\\/n2bm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.429");
    cy.get(cesc("#\\/n2cm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.4285");

    cy.get(cesc("#\\/n3")).should("have.text", "0");
    cy.get(cesc("#\\/n3a")).should("have.text", "0");
    cy.get(cesc("#\\/n3b")).should("have.text", "0");
    cy.get(cesc("#\\/n3c")).should("have.text", "5.0235 * 10^(-15)");
    cy.get(cesc("#\\/n3am") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n3bm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n3cm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.0235⋅10−15");

    cy.get(cesc("#\\/n1aa")).should("have.text", "234230000");
    cy.get(cesc("#\\/n1ab")).should("have.text", "234234823.342");
    cy.get(cesc("#\\/n1aam") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234230000");
    cy.get(cesc("#\\/n1abm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234234823.342");

    cy.get(cesc("#\\/n2aa")).should("have.text", "5.4285");
    cy.get(cesc("#\\/n2ab")).should("have.text", "5.4285");
    cy.get(cesc("#\\/n2aam") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.4285");
    cy.get(cesc("#\\/n2abm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.4285");

    cy.get(cesc("#\\/n3aa")).should("have.text", "5.0235 * 10^(-15)");
    cy.get(cesc("#\\/n3ab")).should("have.text", "0");
    cy.get(cesc("#\\/n3aam") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.0235⋅10−15");
    cy.get(cesc("#\\/n3abm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");

    cy.get(cesc("#\\/n1ba")).should("have.text", "234230000");
    cy.get(cesc("#\\/n1bb")).should("have.text", "234234823.342");
    cy.get(cesc("#\\/n1bam") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234230000");
    cy.get(cesc("#\\/n1bbm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "234234823.342");

    cy.get(cesc("#\\/n2ba")).should("have.text", "5.4285");
    cy.get(cesc("#\\/n2bb")).should("have.text", "5.429");
    cy.get(cesc("#\\/n2bam") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.4285");
    cy.get(cesc("#\\/n2bbm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.429");

    cy.get(cesc("#\\/n3ba")).should("have.text", "5.0235 * 10^(-15)");
    cy.get(cesc("#\\/n3bb")).should("have.text", "0");
    cy.get(cesc("#\\/n3bam") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.0235⋅10−15");
    cy.get(cesc("#\\/n3bbm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value).eq(234234823.34235235324);
      expect(stateVariables["/n1a"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(stateVariables["/n1b"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(stateVariables["/n1c"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(
        stateVariables[stateVariables["/n1am"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(
        stateVariables[stateVariables["/n1bm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(
        stateVariables[stateVariables["/n1cm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(stateVariables["/n2"].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables["/n2a"].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables["/n2b"].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables["/n2c"].stateValues.value).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2am"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2bm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2cm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(stateVariables["/n3"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(stateVariables["/n3a"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(stateVariables["/n3b"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(stateVariables["/n3c"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(
        stateVariables[stateVariables["/n3am"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);
      expect(
        stateVariables[stateVariables["/n3bm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);
      expect(
        stateVariables[stateVariables["/n3cm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);

      expect(stateVariables["/n1aa"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(stateVariables["/n1ab"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(
        stateVariables[stateVariables["/n1aam"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(
        stateVariables[stateVariables["/n1abm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(stateVariables["/n2aa"].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables["/n2ab"].stateValues.value).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2aam"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2abm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(stateVariables["/n3aa"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(stateVariables["/n3ab"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(
        stateVariables[stateVariables["/n3aam"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);
      expect(
        stateVariables[stateVariables["/n3abm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);

      expect(stateVariables["/n1ba"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(stateVariables["/n1bb"].stateValues.value).eq(
        234234823.34235235324,
      );
      expect(
        stateVariables[stateVariables["/n1bam"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(
        stateVariables[stateVariables["/n1bbm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(234234823.34235235324);
      expect(stateVariables["/n2ba"].stateValues.value).eq(5.4285023408250342);
      expect(stateVariables["/n2bb"].stateValues.value).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2bam"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(
        stateVariables[stateVariables["/n2bbm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(5.4285023408250342);
      expect(stateVariables["/n3ba"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(stateVariables["/n3bb"].stateValues.value).eq(
        0.000000000000005023481340324,
      );
      expect(
        stateVariables[stateVariables["/n3bam"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);
      expect(
        stateVariables[stateVariables["/n3bbm"].activeChildren[0].componentName]
          .stateValues.value,
      ).eq(0.000000000000005023481340324);
    });
  });

  it("pad zeros with rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="n1">22</number>
      <number name="n2" displaySmallAsZero="false">0.000000000000005</number>
      <copy target="n1" displayDigits='4' assignNames="n1a" />
      <copy target="n1" displayDigits='4' assignNames="n1apad" padZeros />
      <copy target="n1" displayDecimals='3' assignNames="n1b" />
      <copy target="n1" displayDecimals='3' assignNames="n1bpad" padZeros />
      <copy target="n1" displayDigits='4' displaySmallAsZero assignNames="n1c" />
      <copy target="n1" displayDigits='4' displaySmallAsZero assignNames="n1cpad" padZeros />
      <copy target="n2" displayDigits='4' assignNames="n2a" />
      <copy target="n2" displayDigits='4' assignNames="n2apad" padZeros />
      <copy target="n2" displayDecimals='3' ignoreDisplayDigits assignNames="n2b" />
      <copy target="n2" displayDecimals='3' ignoreDisplayDigits assignNames="n2bpad" padZeros />
      <copy target="n2" displayDigits='4' displaySmallAsZero assignNames="n2c" />
      <copy target="n2" displayDigits='4' displaySmallAsZero assignNames="n2cpad" padZeros />

      <m name="n1am">$n1a</m>
      <m name="n1apadm">$n1apad</m>
      <m name="n1bm">$n1b</m>
      <m name="n1bpadm">$n1bpad</m>
      <m name="n1cm">$n1c</m>
      <m name="n1cpadm">$n1cpad</m>
      <m name="n2am">$n2a</m>
      <m name="n2apadm">$n2apad</m>
      <m name="n2bm">$n2b</m>
      <m name="n2bpadm">$n2bpad</m>
      <m name="n2cm">$n2c</m>
      <m name="n2cpadm">$n2cpad</m>

      <number name="n1aNumber">$n1a</number>
      <number name="n1apadNumber">$n1apad</number>
      <number name="n1bNumber">$n1b</number>
      <number name="n1bpadNumber">$n1bpad</number>
      <number name="n1cNumber">$n1c</number>
      <number name="n1cpadNumber">$n1cpad</number>
      <number name="n2aNumber">$n2a</number>
      <number name="n2apadNumber">$n2apad</number>
      <number name="n2bNumber">$n2b</number>
      <number name="n2bpadNumber">$n2bpad</number>
      <number name="n2cNumber">$n2c</number>
      <number name="n2cpadNumber">$n2cpad</number>

      <math name="n1aMath">$n1a</math>
      <math name="n1apadMath">$n1apad</math>
      <math name="n1bMath">$n1b</math>
      <math name="n1bpadMath">$n1bpad</math>
      <math name="n1cMath">$n1c</math>
      <math name="n1cpadMath">$n1cpad</math>
      <math name="n2aMath">$n2a</math>
      <math name="n2apadMath">$n2apad</math>
      <math name="n2bMath">$n2b</math>
      <math name="n2bpadMath">$n2bpad</math>
      <math name="n2cMath">$n2c</math>
      <math name="n2cpadMath">$n2cpad</math>

      <copy prop="value" target="n1a" assignNames="n1aValue" />
      <copy prop="value" target="n1apad" assignNames="n1apadValue" />
      <copy prop="value" target="n1b" assignNames="n1bValue" />
      <copy prop="value" target="n1bpad" assignNames="n1bpadValue" />
      <copy prop="value" target="n1c" assignNames="n1cValue" />
      <copy prop="value" target="n1cpad" assignNames="n1cpadValue" />
      <copy prop="value" target="n2a" assignNames="n2aValue" />
      <copy prop="value" target="n2apad" assignNames="n2apadValue" />
      <copy prop="value" target="n2b" assignNames="n2bValue" />
      <copy prop="value" target="n2bpad" assignNames="n2bpadValue" />
      <copy prop="value" target="n2c" assignNames="n2cValue" />
      <copy prop="value" target="n2cpad" assignNames="n2cpadValue" />

      <copy prop="text" target="n1a" assignNames="n1aText" />
      <copy prop="text" target="n1apad" assignNames="n1apadText" />
      <copy prop="text" target="n1b" assignNames="n1bText" />
      <copy prop="text" target="n1bpad" assignNames="n1bpadText" />
      <copy prop="text" target="n1c" assignNames="n1cText" />
      <copy prop="text" target="n1cpad" assignNames="n1cpadText" />
      <copy prop="text" target="n2a" assignNames="n2aText" />
      <copy prop="text" target="n2apad" assignNames="n2apadText" />
      <copy prop="text" target="n2b" assignNames="n2bText" />
      <copy prop="text" target="n2bpad" assignNames="n2bpadText" />
      <copy prop="text" target="n2c" assignNames="n2cText" />
      <copy prop="text" target="n2cpad" assignNames="n2cpadText" />

      <copy prop="math" target="n1a" assignNames="n1aMath2" />
      <copy prop="math" target="n1apad" assignNames="n1apadMath2" />
      <copy prop="math" target="n1b" assignNames="n1bMath2" />
      <copy prop="math" target="n1bpad" assignNames="n1bpadMath2" />
      <copy prop="math" target="n1c" assignNames="n1cMath2" />
      <copy prop="math" target="n1cpad" assignNames="n1cpadMath2" />
      <copy prop="math" target="n2a" assignNames="n2aMath2" />
      <copy prop="math" target="n2apad" assignNames="n2apadMath2" />
      <copy prop="math" target="n2b" assignNames="n2bMath2" />
      <copy prop="math" target="n2bpad" assignNames="n2bpadMath2" />
      <copy prop="math" target="n2c" assignNames="n2cMath2" />
      <copy prop="math" target="n2cpad" assignNames="n2cpadMath2" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n1")).should("have.text", "22");
    cy.get(cesc("#\\/n1a")).should("have.text", "22");
    cy.get(cesc("#\\/n1apad")).should("have.text", "22.00");
    cy.get(cesc("#\\/n1b")).should("have.text", "22");
    cy.get(cesc("#\\/n1bpad")).should("have.text", "22.000");
    cy.get(cesc("#\\/n1c")).should("have.text", "22");
    cy.get(cesc("#\\/n1cpad")).should("have.text", "22.00");
    cy.get(cesc("#\\/n2")).should("have.text", "5 * 10^(-15)");
    cy.get(cesc("#\\/n2a")).should("have.text", "5 * 10^(-15)");
    cy.get(cesc("#\\/n2apad")).should("have.text", "5.000 * 10^(-15)");
    cy.get(cesc("#\\/n2b")).should("have.text", "0");
    cy.get(cesc("#\\/n2bpad")).should("have.text", "0.000");
    cy.get(cesc("#\\/n2c")).should("have.text", "0");
    cy.get(cesc("#\\/n2cpad")).should("have.text", "0.000");

    cy.get(cesc("#\\/n1am") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1apadm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.00");
    cy.get(cesc("#\\/n1bm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1bpadm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.000");
    cy.get(cesc("#\\/n1cm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1cpadm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.00");
    cy.get(cesc("#\\/n2am") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5⋅10−15");
    cy.get(cesc("#\\/n2apadm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.000⋅10−15");
    cy.get(cesc("#\\/n2bm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n2bpadm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0.000");
    cy.get(cesc("#\\/n2cm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n2cpadm") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0.000");

    cy.get(cesc("#\\/n1aNumber")).should("have.text", "22");
    cy.get(cesc("#\\/n1apadNumber")).should("have.text", "22.00");
    cy.get(cesc("#\\/n1bNumber")).should("have.text", "22");
    cy.get(cesc("#\\/n1bpadNumber")).should("have.text", "22.000");
    cy.get(cesc("#\\/n1cNumber")).should("have.text", "22");
    cy.get(cesc("#\\/n1cpadNumber")).should("have.text", "22.00");
    cy.get(cesc("#\\/n2aNumber")).should("have.text", "5 * 10^(-15)");
    cy.get(cesc("#\\/n2apadNumber")).should("have.text", "5.000 * 10^(-15)");
    cy.get(cesc("#\\/n2bNumber")).should("have.text", "0");
    cy.get(cesc("#\\/n2bpadNumber")).should("have.text", "0.000");
    cy.get(cesc("#\\/n2cNumber")).should("have.text", "0");
    cy.get(cesc("#\\/n2cpadNumber")).should("have.text", "0.000");

    cy.get(cesc("#\\/n1aMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1apadMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.00");
    cy.get(cesc("#\\/n1bMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1bpadMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.000");
    cy.get(cesc("#\\/n1cMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1cpadMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.00");
    cy.get(cesc("#\\/n2aMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5⋅10−15");
    cy.get(cesc("#\\/n2apadMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.000⋅10−15");
    cy.get(cesc("#\\/n2bMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n2bpadMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0.000");
    cy.get(cesc("#\\/n2cMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n2cpadMath") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0.000");

    cy.get(cesc("#\\/n1aValue")).should("have.text", "22");
    cy.get(cesc("#\\/n1apadValue")).should("have.text", "22.00");
    cy.get(cesc("#\\/n1bValue")).should("have.text", "22");
    cy.get(cesc("#\\/n1bpadValue")).should("have.text", "22.000");
    cy.get(cesc("#\\/n1cValue")).should("have.text", "22");
    cy.get(cesc("#\\/n1cpadValue")).should("have.text", "22.00");
    cy.get(cesc("#\\/n2aValue")).should("have.text", "5 * 10^(-15)");
    cy.get(cesc("#\\/n2apadValue")).should("have.text", "5.000 * 10^(-15)");
    cy.get(cesc("#\\/n2bValue")).should("have.text", "0");
    cy.get(cesc("#\\/n2bpadValue")).should("have.text", "0.000");
    cy.get(cesc("#\\/n2cValue")).should("have.text", "0");
    cy.get(cesc("#\\/n2cpadValue")).should("have.text", "0.000");

    cy.get(cesc("#\\/n1aText")).should("have.text", "22");
    cy.get(cesc("#\\/n1apadText")).should("have.text", "22.00");
    cy.get(cesc("#\\/n1bText")).should("have.text", "22");
    cy.get(cesc("#\\/n1bpadText")).should("have.text", "22.000");
    cy.get(cesc("#\\/n1cText")).should("have.text", "22");
    cy.get(cesc("#\\/n1cpadText")).should("have.text", "22.00");
    cy.get(cesc("#\\/n2aText")).should("have.text", "5 * 10^(-15)");
    cy.get(cesc("#\\/n2apadText")).should("have.text", "5.000 * 10^(-15)");
    cy.get(cesc("#\\/n2bText")).should("have.text", "0");
    cy.get(cesc("#\\/n2bpadText")).should("have.text", "0.000");
    cy.get(cesc("#\\/n2cText")).should("have.text", "0");
    cy.get(cesc("#\\/n2cpadText")).should("have.text", "0.000");

    cy.get(cesc("#\\/n1aMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1apadMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.00");
    cy.get(cesc("#\\/n1bMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1bpadMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.000");
    cy.get(cesc("#\\/n1cMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22");
    cy.get(cesc("#\\/n1cpadMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "22.00");
    cy.get(cesc("#\\/n2aMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5⋅10−15");
    cy.get(cesc("#\\/n2apadMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "5.000⋅10−15");
    cy.get(cesc("#\\/n2bMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n2bpadMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0.000");
    cy.get(cesc("#\\/n2cMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0");
    cy.get(cesc("#\\/n2cpadMath2") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "0.000");
  });

  it("dynamic rounding", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p>Number: <number name="n">35203423.02352343201</number></p>
      <p>Number of digits: <mathinput name="ndigits" prefill="3" /></p>
      <p>Number of decimals: <mathinput name="ndecimals" prefill="3" /></p>
      <p><copy target="n" displayDigits='$ndigits' displayDecimals='$ndecimals' assignNames="na" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n")).should("have.text", "35203423.02");
    cy.get(cesc("#\\/na")).should("have.text", "35203423.024");

    cy.log("only digits");
    cy.get(cesc("#\\/ndecimals") + " textarea").type(
      "{end}{backspace}-\\infty{enter}{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/na")).should("have.text", "35200000");

    cy.log("more digits");
    cy.get(cesc("#\\/ndigits") + " textarea").type(
      "{end}{backspace}12{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/na")).should("have.text", "35203423.0235");

    cy.log("remove digits");
    cy.get(cesc("#\\/ndigits") + " textarea").type(
      "{end}{backspace}{backspace}0{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/na")).should("contain.text", "35203423.02352343");

    cy.log("Fewer digits than have");
    cy.get(cesc("#\\/ndecimals") + " textarea").type(
      "{end}{backspace}10{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/na")).should("contain.text", "0");

    cy.log("add one digit");
    cy.get(cesc("#\\/ndigits") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/na")).should("have.text", "40000000");

    cy.log("invalid precision means no rounding");
    cy.get(cesc("#\\/ndigits") + " textarea").type(
      "{end}{backspace}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/ndecimals") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}y{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/na")).should("contain.text", "35203423.02352343");

    cy.log("add a decimal");
    cy.get(cesc("#\\/ndecimals") + " textarea").type(
      "{end}{backspace}1{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/na")).should("have.text", "35203423");

    cy.log("negative precision, ignores display digits");
    cy.get(cesc("#\\/ndigits") + " textarea").type(
      "{end}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/ndecimals") + " textarea").type(
      "{end}{backspace}-3{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/na")).should("have.text", "35203000");
  });

  it("infinity and nan", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <number name="inf1">Infinity</number>
      <number name="inf2">Infinity+Infinity</number>
      <number name="inf3">1/0</number>
      <number name="inf4">-2/-0</number>
      <number name="inf5"><math>Infinity</math></number>
      <number name="inf6"><math>Infinity</math>+<math>Infinity</math></number>
      <number name="inf7"><math>5/0</math></number>
      <number name="inf8"><math>-6</math>/<math>-0</math></number>

      <number name="ninf1">-Infinity</number>
      <number name="ninf2">-3/0</number>
      <number name="ninf3">4/-0</number>
      <number name="ninf4"><math>-Infinity</math></number>
      <number name="ninf5"><math>-8/0</math></number>
      <number name="ninf6"><math>7</math>/<math>-0</math></number>

      <number name="nan1">Infinity-Infinity</number>
      <number name="nan2">Infinity/Infinity</number>
      <number name="nan3">0/0</number>
      <number name="nan4">-0/0</number>
      <number name="nan5"><math>-Infinity</math>+<math>Infinity</math></number>
      <number name="nan6"><math>Infinity/Infinity</math></number>
      <number name="nan7"><math>0/0</math></number>
      <number name="nan8"><math>0</math>/<math>-0</math></number>


    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/inf1")).should("have.text", "∞");
    cy.get(cesc("#\\/inf2")).should("have.text", "∞");
    cy.get(cesc("#\\/inf3")).should("have.text", "∞");
    cy.get(cesc("#\\/inf4")).should("have.text", "∞");
    cy.get(cesc("#\\/inf5")).should("have.text", "∞");
    cy.get(cesc("#\\/inf6")).should("have.text", "∞");
    cy.get(cesc("#\\/inf7")).should("have.text", "∞");
    cy.get(cesc("#\\/inf8")).should("have.text", "∞");

    cy.get(cesc("#\\/ninf1")).should("have.text", "-∞");
    cy.get(cesc("#\\/ninf2")).should("have.text", "-∞");
    cy.get(cesc("#\\/ninf3")).should("have.text", "-∞");
    cy.get(cesc("#\\/ninf4")).should("have.text", "-∞");
    cy.get(cesc("#\\/ninf5")).should("have.text", "-∞");
    cy.get(cesc("#\\/ninf6")).should("have.text", "-∞");

    cy.get(cesc("#\\/nan1")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan2")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan3")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan4")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan5")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan6")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan7")).should("have.text", "NaN");
    cy.get(cesc("#\\/nan8")).should("have.text", "NaN");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/inf1"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf2"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf3"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf4"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf5"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf6"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf7"].stateValues.value).eq(Infinity);
      expect(stateVariables["/inf8"].stateValues.value).eq(Infinity);

      expect(stateVariables["/ninf1"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/ninf2"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/ninf3"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/ninf4"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/ninf5"].stateValues.value).eq(-Infinity);
      expect(stateVariables["/ninf6"].stateValues.value).eq(-Infinity);

      expect(stateVariables["/nan1"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan2"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan3"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan4"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan5"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan6"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan7"].stateValues.value).eqls(NaN);
      expect(stateVariables["/nan8"].stateValues.value).eqls(NaN);
    });
  });

  it("copy value prop copies attributes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  <p><number name="n1" displayDigits="2" ignoreDisplayDecimals>8.5203845251</number>
  <copy target="n1" prop="value" assignNames="n1a" />
  <copy target="n1" prop="value" displayDigits="5" assignNames="n1b" />
  <copy target="n1" prop="value" link="false" assignNames="n1c" />
  <copy target="n1" prop="value" link="false" displayDigits="5" assignNames="n1d" />
  </p>

  <p><number name="n2" displayDecimals="0" ignoreDisplayDigits>8.5203845251</number>
  <copy target="n2" prop="value" assignNames="n2a" />
  <copy target="n2" prop="value" displayDecimals="6" assignNames="n2b" />
  <copy target="n2" prop="value" link="false" assignNames="n2c" />
  <copy target="n2" prop="value" link="false" displayDecimals="6" assignNames="n2d" />
  </p>

  <p><number name="n3" displaySmallAsZero="false">0.000000000000000015382487</number>
  <copy target="n3" prop="value" assignNames="n3a" />
  <copy target="n3" prop="value" displaySmallAsZero assignNames="n3b" />
  <copy target="n3" prop="value" link="false" assignNames="n3c" />
  <copy target="n3" prop="value" link="false" displaySmallAsZero assignNames="n3d" />
  </p>

  <p><number name="n4" padZeros>8</number>
  <copy target="n4" prop="value" assignNames="n4a" />
  <copy target="n4" prop="value" padZeros="false" assignNames="n4b" />
  <copy target="n4" prop="value" link="false" assignNames="n4c" />
  <copy target="n4" prop="value" link="false" padZeros="false" assignNames="n4d" />
  </p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n1")).should("have.text", "8.5");
    cy.get(cesc("#\\/n1a")).should("have.text", "8.5");
    cy.get(cesc("#\\/n1b")).should("have.text", "8.5204");
    cy.get(cesc("#\\/n1c")).should("have.text", "8.5");
    cy.get(cesc("#\\/n1d")).should("have.text", "8.5204");

    cy.get(cesc("#\\/n2")).should("have.text", "9");
    cy.get(cesc("#\\/n2a")).should("have.text", "9");
    cy.get(cesc("#\\/n2b")).should("have.text", "8.520385");
    cy.get(cesc("#\\/n2c")).should("have.text", "9");
    cy.get(cesc("#\\/n2d")).should("have.text", "8.520385");

    cy.get(cesc("#\\/n3")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/n3a")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/n3b")).should("have.text", "0");
    cy.get(cesc("#\\/n3c")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/n3d")).should("have.text", "0");

    cy.get(cesc("#\\/n4")).should("have.text", "8.00");
    cy.get(cesc("#\\/n4a")).should("have.text", "8.00");
    cy.get(cesc("#\\/n4b")).should("have.text", "8");
    cy.get(cesc("#\\/n4c")).should("have.text", "8.00");
    cy.get(cesc("#\\/n4d")).should("have.text", "8");
  });

  it("display rounding preserved when only one number or math child", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  <p><number name="m1"><math displayDigits="2" ignoreDisplayDecimals>8.5203845251</math></number>
    <number name="m1a"><number displayDigits="2" ignoreDisplayDecimals>8.5203845251</number></number>
    <number name="m1b"><math displayDigits="2" ignoreDisplayDecimals>8.5203845251</math>2.8392634947</number>
    <number name="m1c"><number displayDigits="2" ignoreDisplayDecimals>8.5203845251</number>2.8392634947</number>
    <number name="m1d"><math displayDigits="2" ignoreDisplayDecimals>8.5203845251</math><math displayDigits="2" ignoreDisplayDecimals>2.8392634947</math></number>
    <number name="m1e"><number displayDigits="2" ignoreDisplayDecimals>8.5203845251</number><math displayDigits="2" ignoreDisplayDecimals>2.8392634947</math></number>
    <number name="m1f" displayDigits="1"><math displayDigits="2" ignoreDisplayDecimals>8.5203845251</math></number>
    <number name="m1g" displayDecimals="8"><math displayDigits="2" ignoreDisplayDecimals>8.5203845251</math></number>
  </p>

  <p><number name="m1_v" copySource="m1.value" />
    <number name="m1a_v" copySource="m1a.value" />
    <number name="m1b_v" copySource="m1b.value" />
    <number name="m1c_v" copySource="m1c.value" />
    <number name="m1d_v" copySource="m1d.value" />
    <number name="m1e_v" copySource="m1e.value" />
    <number name="m1f_v" copySource="m1f.value" />
    <number name="m1g_v" copySource="m1g.value" />
  </p>

  <p><number name="m2"><math displayDecimals="4">8.5203845251</math></number>
    <number name="m2a"><number displayDecimals="4">8.5203845251</number></number>
    <number name="m2b"><math displayDecimals="4">8.5203845251</math>2.8392634947</number>
    <number name="m2c"><number displayDecimals="4">8.5203845251</number>2.8392634947</number>
    <number name="m2d"><math displayDecimals="4">8.5203845251</math><math displayDecimals="4">2.8392634947</math></number>
    <number name="m2e"><number displayDecimals="4">8.5203845251</number><math displayDecimals="4">2.8392634947</math></number>
    <number name="m2f" displayDecimals="6"><math displayDecimals="4">8.5203845251</math></number>
    <number name="m2g" displayDigits="8"><math displayDecimals="4">8.5203845251</math></number>
  </p>

  <p><number name="m2_v" copySource="m2.value" />
    <number name="m2a_v" copySource="m2a.value" />
    <number name="m2b_v" copySource="m2b.value" />
    <number name="m2c_v" copySource="m2c.value" />
    <number name="m2d_v" copySource="m2d.value" />
    <number name="m2e_v" copySource="m2e.value" />
    <number name="m2f_v" copySource="m2f.value" />
    <number name="m2g_v" copySource="m2g.value" />
  </p>

  <p><number name="m3"><math displaySmallAsZero="false">0.000000000000000015382487</math></number>
    <number name="m3a"><number displaySmallAsZero="false">0.000000000000000015382487</number></number>
    <number name="m3b"><math displaySmallAsZero="false">0.000000000000000015382487</math>2.8392634947</number>
    <number name="m3c"><number displaySmallAsZero="false">0.000000000000000015382487</number>2.8392634947</number>
    <number name="m3d"><math displaySmallAsZero="false">0.000000000000000015382487</math><math displaySmallAsZero="false">2.8392634947</math></number>
    <number name="m3e"><number displaySmallAsZero="false">0.000000000000000015382487</number><math displaySmallAsZero="false">2.8392634947</math></number>
    <number name="m3f" displaySmallAsZero="false"><math displaySmallAsZero="true">0.000000000000000015382487</math></number>
  </p>

  <p><number name="m3_v" copySource="m3.value" />
    <number name="m3a_v" copySource="m3a.value" />
    <number name="m3b_v" copySource="m3b.value" />
    <number name="m3c_v" copySource="m3c.value" />
    <number name="m3d_v" copySource="m3d.value" />
    <number name="m3e_v" copySource="m3e.value" />
    <number name="m3f_v" copySource="m3f.value" />
  </p>

  <p><number name="m4"><math displayDigits="3" padZeros>8</math></number>
    <number name="m4a"><number displayDigits="3" padZeros>8</number></number>
    <number name="m4b"><math displayDigits="3" padZeros>8</math>2</number>
    <number name="m4c"><number displayDigits="3" padZeros>8</number>2</number>
    <number name="m4d"><math displayDigits="3" padZeros>8</math><math displayDigits="3" padZeros>2</math></number>
    <number name="m4e"><number displayDigits="3" padZeros>8</number><math displayDigits="3" padZeros>2</math></number>
    <number name="m4f" padZeros="false"><math displayDigits="3" padZeros>8</math></number>
  </p>

  <p><number name="m4_v" copySource="m4.value" />
    <number name="m4a_v" copySource="m4a.value" />
    <number name="m4b_v" copySource="m4b.value" />
    <number name="m4c_v" copySource="m4c.value" />
    <number name="m4d_v" copySource="m4d.value" />
    <number name="m4e_v" copySource="m4e.value" />
    <number name="m4f_v" copySource="m4f.value" />
  </p>


  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/m1")).should("have.text", "8.5");
    cy.get(cesc("#\\/m1a")).should("have.text", "8.5");
    cy.get(cesc("#\\/m1b")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1c")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1d")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1e")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1f")).should("have.text", "9");
    cy.get(cesc("#\\/m1g")).should("have.text", "8.52038453");

    cy.get(cesc("#\\/m1_v")).should("have.text", "8.5");
    cy.get(cesc("#\\/m1a_v")).should("have.text", "8.5");
    cy.get(cesc("#\\/m1b_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1c_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1d_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1e_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m1f_v")).should("have.text", "9");
    cy.get(cesc("#\\/m1g_v")).should("have.text", "8.52038453");

    cy.get(cesc("#\\/m2")).should("have.text", "8.5204");
    cy.get(cesc("#\\/m2a")).should("have.text", "8.5204");
    cy.get(cesc("#\\/m2b")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2c")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2d")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2e")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2f")).should("have.text", "8.520385");
    cy.get(cesc("#\\/m2g")).should("have.text", "8.5203845");

    cy.get(cesc("#\\/m2_v")).should("have.text", "8.5204");
    cy.get(cesc("#\\/m2a_v")).should("have.text", "8.5204");
    cy.get(cesc("#\\/m2b_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2c_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2d_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2e_v")).should("have.text", "24.19");
    cy.get(cesc("#\\/m2f_v")).should("have.text", "8.520385");
    cy.get(cesc("#\\/m2g_v")).should("have.text", "8.5203845");

    cy.get(cesc("#\\/m3")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/m3a")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/m3b")).should("have.text", "0");
    cy.get(cesc("#\\/m3c")).should("have.text", "0");
    cy.get(cesc("#\\/m3d")).should("have.text", "0");
    cy.get(cesc("#\\/m3e")).should("have.text", "0");
    cy.get(cesc("#\\/m3f")).should("have.text", "1.54 * 10^(-17)");

    cy.get(cesc("#\\/m3_v")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/m3a_v")).should("have.text", "1.54 * 10^(-17)");
    cy.get(cesc("#\\/m3b_v")).should("have.text", "0");
    cy.get(cesc("#\\/m3c_v")).should("have.text", "0");
    cy.get(cesc("#\\/m3d_v")).should("have.text", "0");
    cy.get(cesc("#\\/m3e_v")).should("have.text", "0");
    cy.get(cesc("#\\/m3f_v")).should("have.text", "1.54 * 10^(-17)");

    cy.get(cesc("#\\/m4")).should("have.text", "8.00");
    cy.get(cesc("#\\/m4a")).should("have.text", "8.00");
    cy.get(cesc("#\\/m4b")).should("have.text", "16");
    cy.get(cesc("#\\/m4c")).should("have.text", "16");
    cy.get(cesc("#\\/m4d")).should("have.text", "16");
    cy.get(cesc("#\\/m4e")).should("have.text", "16");
    cy.get(cesc("#\\/m4f")).should("have.text", "8");

    cy.get(cesc("#\\/m4_v")).should("have.text", "8.00");
    cy.get(cesc("#\\/m4a_v")).should("have.text", "8.00");
    cy.get(cesc("#\\/m4b_v")).should("have.text", "16");
    cy.get(cesc("#\\/m4c_v")).should("have.text", "16");
    cy.get(cesc("#\\/m4d_v")).should("have.text", "16");
    cy.get(cesc("#\\/m4e_v")).should("have.text", "16");
    cy.get(cesc("#\\/m4f_v")).should("have.text", "8");
  });

  it("value on NaN", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  
  <p>
    <mathinput name="mi1" />
    <number name="n1">$mi1</number>
  </p>
  
  <p>
    <mathinput name="mi2" />
    <number name="n2" valueOnNaN="3">$mi2</number>
  </p>

  <p>
    <mathinput name="mi3" bindValueTo="$n3" hideNaN="false" />
    <number name="n3" />
  </p>

  <p>
    <mathinput name="mi4" bindValueTo="$n4" />
    <number name="n4" valueOnNan="5" />
  </p>


  <p>
    <mathinput name="mi1a" />
    <number name="n1a"><number>$mi1a</number></number>
  </p>
  
  <p>
    <mathinput name="mi2a" />
    <number name="n2a" valueOnNaN="3"><number>$mi2a</number></number>
  </p>
  
  <p>
    <mathinput name="mi2b" />
    <number name="n2b"><number valueOnNaN="3">$mi2b</number></number>
  </p>

  <p>
    <mathinput name="mi3a" bindValueTo="$n3a" />
    <number name="n3a"><number /></number>
  </p>

  <p>
    <mathinput name="mi4a" bindValueTo="$n4a" />
    <number name="n4a" valueOnNan="5"><number/></number>
  </p>

  <p>
    <mathinput name="mi4b" bindValueTo="$n4b" />
    <number name="n4b"><number valueOnNan="5"/></number>
  </p>


  <p>
    <number name="n5">8/</number>
    <number name="n6" valueOnNan="7">8/</number>
  </p>

  <p>
    <boolean name="b" hide />
    <number name="n7" convertBoolean>$b>y</number>
    <number name="n8" convertBoolean valueOnNaN="9">$b>y</number>
  </p>

  <p>
    <number name="n9">x>y</number>
    <number name="n10" valueOnNaN="-9">x>y</number>
  </p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n1")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n2")).should("have.text", "3");

    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("NaN");
      });
    cy.get(cesc("#\\/n3")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi4`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/n4")).should("have.text", "5");

    cy.get(cesc(`#\\/mi1a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n1a")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi2a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n2a")).should("have.text", "3");

    cy.get(cesc(`#\\/mi3a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n3a")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi4a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/n4a")).should("have.text", "5");

    cy.get(cesc(`#\\/mi2b`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n2b")).should("have.text", "3");

    cy.get(cesc(`#\\/mi4b`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/n4b")).should("have.text", "5");

    cy.get(cesc("#\\/n5")).should("have.text", "NaN");
    cy.get(cesc("#\\/n6")).should("have.text", "7");

    cy.get(cesc("#\\/n7")).should("have.text", "NaN");
    cy.get(cesc("#\\/n8")).should("have.text", "9");

    cy.get(cesc("#\\/n9")).should("have.text", "NaN");
    cy.get(cesc("#\\/n10")).should("have.text", "-9");

    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi2") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi3") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi4") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mi1a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi2a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi3a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi4a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mi2b") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi4b") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}3/4{enter}",
      { force: true },
    );

    cy.get(cesc(`#\\/mi4b`) + ` .mq-editable-field`).should(
      "contain.text",
      "0.75",
    );

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("34");
      });
    cy.get(cesc("#\\/n1")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("34");
      });
    cy.get(cesc("#\\/n2")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0.75");
      });
    cy.get(cesc("#\\/n3")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi4`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0.75");
      });
    cy.get(cesc("#\\/n4")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi1a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("34");
      });
    cy.get(cesc("#\\/n1a")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi2a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("34");
      });
    cy.get(cesc("#\\/n2a")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi3a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0.75");
      });
    cy.get(cesc("#\\/n3a")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi4a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0.75");
      });
    cy.get(cesc("#\\/n4a")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi2b`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("34");
      });
    cy.get(cesc("#\\/n2b")).should("have.text", "0.75");

    cy.get(cesc(`#\\/mi4b`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("0.75");
      });
    cy.get(cesc("#\\/n4b")).should("have.text", "0.75");

    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi2") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi3") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi4") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mi1a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi2a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi3a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi4a") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/mi2b") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi4b") + " textarea").type(
      "{ctrl+home}{shift+ctrl+end}{backspace}x{enter}",
      { force: true },
    );

    cy.get(cesc(`#\\/mi4b`) + ` .mq-editable-field`).should(
      "contain.text",
      "5",
    );

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc("#\\/n1")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc("#\\/n2")).should("have.text", "3");

    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("NaN");
      });
    cy.get(cesc("#\\/n3")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi4`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/n4")).should("have.text", "5");

    cy.get(cesc(`#\\/mi1a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc("#\\/n1a")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi2a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc("#\\/n2a")).should("have.text", "3");

    cy.get(cesc(`#\\/mi3a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("");
      });
    cy.get(cesc("#\\/n3a")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi4a`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/n4a")).should("have.text", "5");

    cy.get(cesc(`#\\/mi2b`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("x");
      });
    cy.get(cesc("#\\/n2b")).should("have.text", "3");

    cy.get(cesc(`#\\/mi4b`) + ` .mq-editable-field`)
      .invoke("text")
      .then((text) => {
        expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal("5");
      });
    cy.get(cesc("#\\/n4b")).should("have.text", "5");
  });

  it("indeterminant forms give NaN", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  
  <p><number name="if1">0^0</number></p>
  <p><number name="if2">Infinity^0</number></p>
  <p><number name="if3">0/0</number></p>
  <p><number name="if4">Infinity/Infinity</number></p>
  <p><number name="if5">0*Infinity</number></p>
  <p><number name="if6">Infinity-Infinity</number></p>
  <p><number name="if7">1^Infinity</number></p>
  <p><number name="ifalt"><number>0^0</number>^0</number></p>
  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/if1")).should("have.text", "NaN");
    cy.get(cesc("#\\/if2")).should("have.text", "NaN");
    cy.get(cesc("#\\/if3")).should("have.text", "NaN");
    cy.get(cesc("#\\/if4")).should("have.text", "NaN");
    cy.get(cesc("#\\/if5")).should("have.text", "NaN");
    cy.get(cesc("#\\/if6")).should("have.text", "NaN");
    cy.get(cesc("#\\/if7")).should("have.text", "NaN");
    cy.get(cesc("#\\/ifalt")).should("have.text", "NaN");
  });

  it("complex numbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  
  <p><number name="i1">i</number></p>
  <p><math name="i1a">$i1</math></p>
  <p><number name="i2" displaySmallAsZero>sqrt(-1)</number></p>
  <p><number name="i3" displaySmallAsZero>exp(pi i/2)</number></p>
  <p><number name="i4">$ni1^3</number></p>
  <p><number name="i5">$ni2^3</number></p>
  <p><number name="i6" displaySmallAsZero>$ni3^3</number></p>
  <p><number name="i7">1/-i</number></p>
  <p><number name="i8" displaySmallAsZero>1/$ni4</number></p>
  <p><number name="i9">1/$ni5</number></p>
  <p><number name="i10" displaySmallAsZero>1/$ni6</number></p>
  <p><number name="i11">0+i</number></p>
  <p><number name="i12">1i</number></p>

  <p><number name="ni1">-i</number></p>
  <p><math name="ni1a">$ni1</math></p>
  <p><number name="ni2">i^3</number></p>
  <p><number name="ni3" displaySmallAsZero>(-1)^(3/2)</number></p>
  <p><number name="ni4" displaySmallAsZero>exp(3 pi i/2)</number></p>
  <p><number name="ni5">$i1^3</number></p>
  <p><number name="ni6" displaySmallAsZero>$i2^3</number></p>
  <p><number name="ni7" displaySmallAsZero>$i3^3</number></p>
  <p><number name="ni8">1/i</number></p>
  <p><number name="ni9">1/$i4</number></p>
  <p><number name="ni10">1/$i5</number></p>
  <p><number name="ni11" displaySmallAsZero>1/$i6</number></p>
  <p><number name="ni12">0-i</number></p>
  <p><number name="ni13">-1i</number></p>

  <p><number name="c1">2+3i</number></p>
  <p><number name="c2"><math>2+3i</math></number></p>
  <p><number name="c3">(2+3i)/(3+i)</number></p>
  <p><number name="c4"><math>2+3i</math>/<number>3+i</number></number></p>
  <p><number name="c5">Infinity i</number></p>
  <p><number name="c6"><math format="latex">\\infty i</math></number></p>
  <p><number name="c7">5+0i</number></p>
  <p><number name="c8"><math>5+0i</math></number></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/i1")).should("have.text", "i");
    cy.get(cesc("#\\/i1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "i");
    cy.get(cesc("#\\/i2")).should("have.text", "i");
    cy.get(cesc("#\\/i3")).should("have.text", "i");
    cy.get(cesc("#\\/i4")).should("have.text", "i");
    cy.get(cesc("#\\/i5")).should("have.text", "i");
    cy.get(cesc("#\\/i6")).should("have.text", "i");
    cy.get(cesc("#\\/i7")).should("have.text", "i");
    cy.get(cesc("#\\/i8")).should("have.text", "i");
    cy.get(cesc("#\\/i9")).should("have.text", "i");
    cy.get(cesc("#\\/i10")).should("have.text", "i");
    cy.get(cesc("#\\/i11")).should("have.text", "i");
    cy.get(cesc("#\\/i12")).should("have.text", "i");

    cy.get(cesc("#\\/ni1")).should("have.text", "-i");
    cy.get(cesc("#\\/ni1a") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "−i");
    cy.get(cesc("#\\/ni2")).should("have.text", "-i");
    cy.get(cesc("#\\/ni3")).should("have.text", "-i");
    cy.get(cesc("#\\/ni4")).should("have.text", "-i");
    cy.get(cesc("#\\/ni5")).should("have.text", "-i");
    cy.get(cesc("#\\/ni6")).should("have.text", "-i");
    cy.get(cesc("#\\/ni7")).should("have.text", "-i");
    cy.get(cesc("#\\/ni8")).should("have.text", "-i");
    cy.get(cesc("#\\/ni9")).should("have.text", "-i");
    cy.get(cesc("#\\/ni10")).should("have.text", "-i");
    cy.get(cesc("#\\/ni11")).should("have.text", "-i");
    cy.get(cesc("#\\/ni12")).should("have.text", "-i");
    cy.get(cesc("#\\/ni13")).should("have.text", "-i");

    cy.get(cesc("#\\/c1")).should("have.text", "2 + 3 i");
    cy.get(cesc("#\\/c2")).should("have.text", "2 + 3 i");
    cy.get(cesc("#\\/c3")).should("have.text", "0.9 + 0.7 i");
    cy.get(cesc("#\\/c4")).should("have.text", "0.9 + 0.7 i");
    cy.get(cesc("#\\/c5")).should("have.text", "NaN + NaN i");
    cy.get(cesc("#\\/c6")).should("have.text", "NaN + NaN i");
    cy.get(cesc("#\\/c7")).should("have.text", "5");
    cy.get(cesc("#\\/c8")).should("have.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/i1"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/i1a"].stateValues.value).eqls("i");
      expect(stateVariables["/i2"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/i2"].stateValues.value.im).eq(1);
      expect(stateVariables["/i3"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/i3"].stateValues.value.im).eq(1);
      expect(stateVariables["/i4"].stateValues.value.re).eq(0);
      expect(stateVariables["/i4"].stateValues.value.im).eq(1);
      expect(stateVariables["/i5"].stateValues.value.re).eq(0);
      expect(stateVariables["/i5"].stateValues.value.im).eq(1);
      expect(stateVariables["/i6"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/i6"].stateValues.value.im).eq(1);
      expect(stateVariables["/i7"].stateValues.value.re).eq(0);
      expect(stateVariables["/i7"].stateValues.value.im).eq(1);
      expect(stateVariables["/i8"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/i8"].stateValues.value.im).eq(1);
      expect(stateVariables["/i9"].stateValues.value.re).eq(0);
      expect(stateVariables["/i9"].stateValues.value.im).eq(1);
      expect(stateVariables["/i10"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/i10"].stateValues.value.im).eq(1);
      expect(stateVariables["/i11"].stateValues.value.re).eq(0);
      expect(stateVariables["/i11"].stateValues.value.im).eq(1);
      expect(stateVariables["/i12"].stateValues.value.re).eq(0);
      expect(stateVariables["/i12"].stateValues.value.im).eq(1);

      expect(stateVariables["/ni1"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni1"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni1a"].stateValues.value).eqls(["-", "i"]);
      expect(stateVariables["/ni2"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni2"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni3"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/ni3"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni4"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/ni4"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni5"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni5"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni6"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/ni6"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni7"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/ni7"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni8"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni8"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni9"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni9"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni10"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni10"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni11"].stateValues.value.re).closeTo(0, 1e-14);
      expect(stateVariables["/ni11"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni12"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni12"].stateValues.value.im).eq(-1);
      expect(stateVariables["/ni13"].stateValues.value.re).eq(0);
      expect(stateVariables["/ni13"].stateValues.value.im).eq(-1);

      expect(stateVariables["/c1"].stateValues.value.re).eq(2);
      expect(stateVariables["/c1"].stateValues.value.im).eq(3);
      expect(stateVariables["/c2"].stateValues.value.re).eq(2);
      expect(stateVariables["/c2"].stateValues.value.im).eq(3);
      expect(stateVariables["/c3"].stateValues.value.re).closeTo(0.9, 1e-14);
      expect(stateVariables["/c3"].stateValues.value.im).closeTo(0.7, 1e-14);
      expect(stateVariables["/c4"].stateValues.value.re).closeTo(0.9, 1e-14);
      expect(stateVariables["/c4"].stateValues.value.im).closeTo(0.7, 1e-14);
      expect(stateVariables["/c5"].stateValues.value.re).eqls(NaN);
      expect(stateVariables["/c5"].stateValues.value.im).eqls(NaN);
      expect(stateVariables["/c6"].stateValues.value.re).eqls(NaN);
      expect(stateVariables["/c6"].stateValues.value.im).eqls(NaN);
      expect(stateVariables["/c7"].stateValues.value).eq(5);
      expect(stateVariables["/c8"].stateValues.value).eq(5);
    });
  });

  it("complex numbers and inverse definition", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  <p><number name="n1">1</number> <mathinput bindValueto="$n1" name="mi1" /></p>
  <p><number name="n2"><number>1</number></number> <mathinput bindValueto="$n2" name="mi2" /></p>
  <p><number name="n3"></number> <mathinput bindValueto="$n3" name="mi3" /></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n1")).should("have.text", "1");
    cy.get(cesc("#\\/n2")).should("have.text", "1");
    cy.get(cesc("#\\/n3")).should("have.text", "NaN");

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`).should("have.text", "1");
    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`).should("have.text", "1");
    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`).should("have.text", "");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value).eqls(1);
      expect(stateVariables["/n2"].stateValues.value).eqls(1);
      expect(stateVariables["/n3"].stateValues.value).eqls(NaN);
      expect(stateVariables["/mi1"].stateValues.value).eqls(1);
      expect(stateVariables["/mi2"].stateValues.value).eqls(1);
      expect(stateVariables["/mi3"].stateValues.value).eqls(NaN);
    });

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}i{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}i{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{end}{backspace}i{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/n1")).should("have.text", "i");
    cy.get(cesc("#\\/n2")).should("have.text", "i");
    cy.get(cesc("#\\/n3")).should("have.text", "i");

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`).should("have.text", "i");
    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`).should("have.text", "i");
    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`).should("have.text", "i");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/n2"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/n3"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/mi1"].stateValues.value).eqls("i");
      expect(stateVariables["/mi2"].stateValues.value).eqls("i");
      expect(stateVariables["/mi3"].stateValues.value).eqls("i");
    });

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}+2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}+2{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{end}+2{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/n1")).should("have.text", "2 + i");
    cy.get(cesc("#\\/n2")).should("have.text", "2 + i");
    cy.get(cesc("#\\/n3")).should("have.text", "2 + i");

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`).should("have.text", "2+i");
    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`).should("have.text", "2+i");
    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`).should("have.text", "2+i");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value.re).eq(2);
      expect(stateVariables["/n1"].stateValues.value.im).eq(1);
      expect(stateVariables["/n2"].stateValues.value.re).eq(2);
      expect(stateVariables["/n2"].stateValues.value.im).eq(1);
      expect(stateVariables["/n3"].stateValues.value.re).eq(2);
      expect(stateVariables["/n3"].stateValues.value.im).eq(1);
      expect(stateVariables["/mi1"].stateValues.value).eqls(["+", 2, "i"]);
      expect(stateVariables["/mi2"].stateValues.value).eqls(["+", 2, "i"]);
      expect(stateVariables["/mi3"].stateValues.value).eqls(["+", 2, "i"]);
    });

    cy.get(cesc("#\\/mi1") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}3+0i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi2") + " textarea").type(
      "{end}{backspace}{backspace}{backspace}3+0i{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{end}{backspace}{backspace}{backspace}3+0i{enter}", {
        force: true,
      })
      .blur();

    cy.get(cesc("#\\/n1")).should("have.text", "3");
    cy.get(cesc("#\\/n2")).should("have.text", "3");
    cy.get(cesc("#\\/n3")).should("have.text", "3");

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`).should("have.text", "3");
    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`).should("have.text", "3");
    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`).should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value).eq(3);
      expect(stateVariables["/n2"].stateValues.value).eq(3);
      expect(stateVariables["/n3"].stateValues.value).eq(3);
      expect(stateVariables["/mi1"].stateValues.value).eqls(3);
      expect(stateVariables["/mi2"].stateValues.value).eqls(3);
      expect(stateVariables["/mi3"].stateValues.value).eqls(3);
    });

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}1i{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}1i{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{end}{backspace}1i{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/n1")).should("have.text", "i");
    cy.get(cesc("#\\/n2")).should("have.text", "i");
    cy.get(cesc("#\\/n3")).should("have.text", "i");

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`).should("have.text", "i");
    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`).should("have.text", "i");
    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`).should("have.text", "i");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/n2"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/n3"].stateValues.value).eqls({ re: 0, im: 1 });
      expect(stateVariables["/mi1"].stateValues.value).eqls("i");
      expect(stateVariables["/mi2"].stateValues.value).eqls("i");
      expect(stateVariables["/mi3"].stateValues.value).eqls("i");
    });

    cy.get(cesc("#\\/mi1") + " textarea").type("{end}{backspace}-1i+0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi2") + " textarea").type("{end}{backspace}-1i+0{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/mi3") + " textarea")
      .type("{end}{backspace}-1i+0{enter}", { force: true })
      .blur();

    cy.get(cesc("#\\/n1")).should("have.text", "-i");
    cy.get(cesc("#\\/n2")).should("have.text", "-i");
    cy.get(cesc("#\\/n3")).should("have.text", "-i");

    cy.get(cesc(`#\\/mi1`) + ` .mq-editable-field`).should("have.text", "−i");
    cy.get(cesc(`#\\/mi2`) + ` .mq-editable-field`).should("have.text", "−i");
    cy.get(cesc(`#\\/mi3`) + ` .mq-editable-field`).should("have.text", "−i");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value.re).eq(0);
      expect(stateVariables["/n1"].stateValues.value.im).eq(-1);
      expect(stateVariables["/n2"].stateValues.value.re).eq(0);
      expect(stateVariables["/n2"].stateValues.value.im).eq(-1);
      expect(stateVariables["/n3"].stateValues.value.re).eq(0);
      expect(stateVariables["/n3"].stateValues.value.im).eq(-1);
      expect(stateVariables["/mi1"].stateValues.value).eqls(["-", "i"]);
      expect(stateVariables["/mi2"].stateValues.value).eqls(["-", "i"]);
      expect(stateVariables["/mi3"].stateValues.value).eqls(["-", "i"]);
    });
  });

  it("complex numbers, re and im", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <p><text>a</text></p>
  
  <p><number name="n1">re(2-4i)</number></p>
  <p><number name="n2">im(2-4i)</number></p>
  <p><number name="n3">re((2-4i)(3-i))</number></p>
  <p><number name="n4">im((2-4i)(3-i))</number></p>
  <p><number name="n1a"><math>re(2-4i)</math></number></p>
  <p><number name="n2a"><math>im(2-4i)</math></number></p>
  <p><number name="n3a"><math>re((2-4i)(3-i))</math></number></p>
  <p><number name="n4a"><math>im((2-4i)(3-i))</math></number></p>
  <p><number name="n1b"><math format="latex">\\Re(2-4i)</math></number></p>
  <p><number name="n2b"><math format="latex">\\Im(2-4i)</math></number></p>
  <p><number name="n3b"><math format="latex">\\Re((2-4i)(3-i))</math></number></p>
  <p><number name="n4b"><math format="latex">\\Im((2-4i)(3-i))</math></number></p>

  `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/n1")).should("have.text", "2");
    cy.get(cesc("#\\/n2")).should("have.text", "-4");
    cy.get(cesc("#\\/n3")).should("have.text", "2");
    cy.get(cesc("#\\/n4")).should("have.text", "-14");
    cy.get(cesc("#\\/n1a")).should("have.text", "2");
    cy.get(cesc("#\\/n2a")).should("have.text", "-4");
    cy.get(cesc("#\\/n3a")).should("have.text", "2");
    cy.get(cesc("#\\/n4a")).should("have.text", "-14");
    cy.get(cesc("#\\/n1b")).should("have.text", "2");
    cy.get(cesc("#\\/n2b")).should("have.text", "-4");
    cy.get(cesc("#\\/n3b")).should("have.text", "2");
    cy.get(cesc("#\\/n4b")).should("have.text", "-14");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n1"].stateValues.value).eq(2);
      expect(stateVariables["/n2"].stateValues.value).eq(-4);
      expect(stateVariables["/n3"].stateValues.value).eq(2);
      expect(stateVariables["/n4"].stateValues.value).eq(-14);
      expect(stateVariables["/n1a"].stateValues.value).eq(2);
      expect(stateVariables["/n2a"].stateValues.value).eq(-4);
      expect(stateVariables["/n3a"].stateValues.value).eq(2);
      expect(stateVariables["/n4a"].stateValues.value).eq(-14);
      expect(stateVariables["/n1b"].stateValues.value).eq(2);
      expect(stateVariables["/n2b"].stateValues.value).eq(-4);
      expect(stateVariables["/n3b"].stateValues.value).eq(2);
      expect(stateVariables["/n4b"].stateValues.value).eq(-14);
    });
  });

  it("number in graph", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <graph >
      <number anchor="$anchorCoords1" name="number1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1">$content1</number>
      <number name="number2">-17</number>
    </graph>

    <p name="pAnchor1">Anchor 1 coordinates: $number1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $number2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$number2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $number1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $number2.positionFromAnchor</p>
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
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$number2.positionFromAnchor">
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
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$number2.draggable" /></p>
    <p name="pContent1">Content 1: $number1</p>
    <p name="pContent2">Content 2: $number2</p>
    <p>Content 1 <mathinput name="content1" prefill="11" /></p>
    <p>Content 2 <mathinput name="content2" bindValueTo="$number2" /></p>
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
    cy.get(cesc("#\\/pContent1")).should("have.text", "Content 1: 11");
    cy.get(cesc("#\\/pContent2")).should("have.text", "Content 2: -17");

    cy.log("move numbers by dragging");

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveNumber",
        componentName: "/number1",
        args: { x: -2, y: 3 },
      });
      win.callAction1({
        actionName: "moveNumber",
        componentName: "/number2",
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

    cy.log("move numbers by entering coordinates");

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

    cy.log("cannot move numbers by dragging");
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveNumber",
        componentName: "/number1",
        args: { x: -10, y: -9 },
      });
      win.callAction1({
        actionName: "moveNumber",
        componentName: "/number2",
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

    cy.log("change content of number");
    cy.get(cesc("#\\/content1") + " textarea").type("{end}+5{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/content2") + " textarea").type("{end}-1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/pContent2")).should("have.text", "Content 2: -18");
    cy.get(cesc("#\\/pContent1")).should("have.text", "Content 1: 16");
  });
});
