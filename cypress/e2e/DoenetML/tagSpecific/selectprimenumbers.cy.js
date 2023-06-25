import { cesc } from "../../../../src/_utils/url";

describe("SelecPrimeNumbers Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no parameters, select single prime number from 2 to 10", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers name="sample1"/>
    <selectprimenumbers name="sample2"/>
    <selectprimenumbers name="sample3"/>
    <selectprimenumbers name="sample4"/>
    <selectprimenumbers name="sample5"/>
    <selectprimenumbers name="sample6"/>
    <selectprimenumbers name="sample7"/>
    <selectprimenumbers name="sample8"/>
    <selectprimenumbers name="sample9"/>
    <selectprimenumbers name="sample10"/>
    <selectprimenumbers name="sample11"/>
    <selectprimenumbers name="sample12"/>
    <selectprimenumbers name="sample13"/>
    <selectprimenumbers name="sample14"/>
    <selectprimenumbers name="sample15"/>
    <selectprimenumbers name="sample16"/>
    <selectprimenumbers name="sample17"/>
    <selectprimenumbers name="sample18"/>
    <selectprimenumbers name="sample19"/>
    <selectprimenumbers name="sample20"/>
    <selectprimenumbers name="sample21"/>
    <selectprimenumbers name="sample22"/>
    <selectprimenumbers name="sample23"/>
    <selectprimenumbers name="sample24"/>
    <selectprimenumbers name="sample25"/>
    <selectprimenumbers name="sample26"/>
    <selectprimenumbers name="sample27"/>
    <selectprimenumbers name="sample28"/>
    <selectprimenumbers name="sample29"/>
    <selectprimenumbers name="sample30"/>
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        expect([2, 3, 5, 7].includes(num)).eq(true);
      }
    });
  });

  it("select single prime number from 2 to 6", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers name="sample1" maxValue="6" />
    <selectprimenumbers name="sample2" maxValue="6" />
    <selectprimenumbers name="sample3" maxValue="6" />
    <selectprimenumbers name="sample4" maxValue="6" />
    <selectprimenumbers name="sample5" maxValue="6" />
    <selectprimenumbers name="sample6" maxValue="6" />
    <selectprimenumbers name="sample7" maxValue="6" />
    <selectprimenumbers name="sample8" maxValue="6" />
    <selectprimenumbers name="sample9" maxValue="6" />
    <selectprimenumbers name="sample10" maxValue="6" />
    <selectprimenumbers name="sample11" maxValue="6" />
    <selectprimenumbers name="sample12" maxValue="6" />
    <selectprimenumbers name="sample13" maxValue="6" />
    <selectprimenumbers name="sample14" maxValue="6" />
    <selectprimenumbers name="sample15" maxValue="6" />
    <selectprimenumbers name="sample16" maxValue="6" />
    <selectprimenumbers name="sample17" maxValue="6" />
    <selectprimenumbers name="sample18" maxValue="6" />
    <selectprimenumbers name="sample19" maxValue="6" />
    <selectprimenumbers name="sample20" maxValue="6" />
    <selectprimenumbers name="sample21" maxValue="6" />
    <selectprimenumbers name="sample22" maxValue="6" />
    <selectprimenumbers name="sample23" maxValue="6" />
    <selectprimenumbers name="sample24" maxValue="6" />
    <selectprimenumbers name="sample25" maxValue="6" />
    <selectprimenumbers name="sample26" maxValue="6" />
    <selectprimenumbers name="sample27" maxValue="6" />
    <selectprimenumbers name="sample28" maxValue="6" />
    <selectprimenumbers name="sample29" maxValue="6" />
    <selectprimenumbers name="sample30" maxValue="6" />
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        expect([2, 3, 5].includes(num)).eq(true);
      }
    });
  });

  it("select single prime number from 9 to 39", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers name="sample1" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample2" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample3" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample4" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample5" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample6" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample7" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample8" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample9" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample10" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample11" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample12" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample13" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample14" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample15" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample16" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample17" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample18" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample19" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample20" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample21" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample22" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample23" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample24" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample25" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample26" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample27" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample28" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample29" minValue="9" maxValue="39" />
    <selectprimenumbers name="sample30" minValue="9" maxValue="39" />
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        expect([11, 13, 17, 19, 23, 29, 31, 37].includes(num)).eq(true);
      }
    });
  });

  it("select single prime number from 9 to 39, excluding 19", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers exclude="19" name="sample1" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample2" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample3" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample4" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample5" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample6" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample7" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample8" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample9" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample10" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample11" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample12" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample13" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample14" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample15" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample16" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample17" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample18" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample19" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample20" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample21" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample22" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample23" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample24" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample25" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample26" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample27" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample28" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample29" minValue="9" maxValue="39" />
    <selectprimenumbers exclude="19" name="sample30" minValue="9" maxValue="39" />
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 30; ind++) {
        let num =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        expect([11, 13, 17, 23, 29, 31, 37].includes(num)).eq(true);
      }
    });
  });

  it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample1" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample2" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample3" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample4" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample5" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample6" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample7" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample8" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample9" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample10" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample11" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample12" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample13" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample14" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample15" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample16" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample17" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample18" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample19" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample20" minValue="1020" maxValue="1050" />
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        expect([1021, 1033, 1039, 1051].includes(num1)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num2)).eq(true);
        expect(num1).not.eq(num2);
      }
    });
  });

  it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample1" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample2" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample3" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample4" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample5" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample6" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample7" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample8" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample9" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample10" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample11" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample12" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample13" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample14" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample15" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample16" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample17" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample18" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample19" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample20" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let allowedCombinations = [
      [1021, 1039],
      [1033, 1021],
      [1039, 1033],
    ];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;

        expect(
          allowedCombinations.some((v) => v[0] === num1 && v[1] === num2),
        ).eq(true);
      }
    });
  });

  it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations, as copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <numberlist name="ec">1021 1033</numberlist>
    <number name="e1">1033</number>
    <number name="e2">1039</number>
    <math name="e3">1021</math>
    <numberlist name="ec2">1021 1033</numberlist>
    <numberlist name="ec3">1033 1039</numberlist>
    <mathlist name="ec4">1039 1021</mathlist>

    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample1" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample2" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample3" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample4" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample5" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample6" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample7" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample8" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample9" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample10" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample11" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample12" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample13" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample14" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample15" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample16" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample17" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample18" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample19" minValue="1020" maxValue="1050" excludecombinations="$ec ($e1 1039) ($e2 $e3)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="1031 1049" numToSelect="2" name="sample20" minValue="1020" maxValue="1050" excludecombinations="$ec2 $ec3 $ec4" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let allowedCombinations = [
      [1021, 1039],
      [1033, 1021],
      [1039, 1033],
    ];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;

        expect(
          allowedCombinations.some((v) => v[0] === num1 && v[1] === num2),
        ).eq(true);
      }
    });
  });

  it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations, exclude extras", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample1" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample2" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample3" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample4" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample5" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample6" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample7" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample8" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample9" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample10" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample11" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample12" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample13" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample14" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample15" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample16" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample17" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample18" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample19" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    <p><aslist><selectprimenumbers exclude="19 1031 1036 1037 1038 1049 1050 1061" numToSelect="2" name="sample20" minValue="1020" maxValue="1050" excludecombinations="(1021 1033) (1033 1039) (1039 1021)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let allowedCombinations = [
      [1021, 1039],
      [1033, 1021],
      [1039, 1033],
    ];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;

        expect(
          allowedCombinations.some((v) => v[0] === num1 && v[1] === num2),
        ).eq(true);
      }
    });
  });

  it("select three prime numbers up to 5, exclude combinations with two 2s", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample1" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample2" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample3" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample4" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample5" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample6" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample7" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample8" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample9" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample10" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample11" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample12" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample13" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample14" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample15" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample16" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample17" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample18" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample19" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample20" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let allowedCombinations = [
      [2, 3, 3],
      [2, 3, 5],
      [2, 5, 3],
      [2, 5, 5],
      [3, 2, 3],
      [3, 2, 5],
      [5, 2, 3],
      [5, 2, 5],
      [3, 3, 2],
      [3, 5, 2],
      [5, 3, 2],
      [5, 5, 2],
      [3, 3, 3],
      [3, 3, 5],
      [3, 5, 3],
      [5, 3, 3],
      [5, 5, 3],
      [5, 3, 5],
      [3, 5, 5],
      [5, 5, 5],
    ];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        let num3 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[2].componentName
          ].stateValues.value;

        expect(
          allowedCombinations.some(
            (v) => v[0] === num1 && v[1] === num2 && v[2] === num3,
          ),
        ).eq(true);
      }
    });
  });

  it("select three prime numbers up to 5, exclude combinations with two 2s, duplicate excludes", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample1" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample2" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample3" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample4" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample5" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample6" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample7" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample8" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample9" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample10" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample11" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample12" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample13" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample14" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample15" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample16" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample17" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample18" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample19" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" withReplacement name="sample20" maxValue="5" excludecombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let allowedCombinations = [
      [2, 3, 3],
      [2, 3, 5],
      [2, 5, 3],
      [2, 5, 5],
      [3, 2, 3],
      [3, 2, 5],
      [5, 2, 3],
      [5, 2, 5],
      [3, 3, 2],
      [3, 5, 2],
      [5, 3, 2],
      [5, 5, 2],
      [3, 3, 3],
      [3, 3, 5],
      [3, 5, 3],
      [5, 3, 3],
      [5, 5, 3],
      [5, 3, 5],
      [3, 5, 5],
      [5, 5, 5],
    ];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        let num3 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[2].componentName
          ].stateValues.value;

        expect(
          allowedCombinations.some(
            (v) => v[0] === num1 && v[1] === num2 && v[2] === num3,
          ),
        ).eq(true);
      }
    });
  });

  it("select four prime numbers from 3 to 11, exclude positions of each number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample1" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample2" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample3" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample4" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample5" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample6" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample7" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample8" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample9" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample10" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample11" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample12" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample13" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample14" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample15" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample16" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample17" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample18" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample19" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="4" withReplacement name="sample20" minValue="3" maxValue="11" excludecombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        let num3 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[2].componentName
          ].stateValues.value;
        let num4 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[3].componentName
          ].stateValues.value;

        expect([5, 7, 11].includes(num1)).eq(true);
        expect([3, 7, 11].includes(num2)).eq(true);
        expect([3, 5, 11].includes(num3)).eq(true);
        expect([3, 5, 7].includes(num4)).eq(true);
      }
    });
  });

  it("select three prime numbers up to 5, without replacement exclude positions of each number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample1" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample2" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample3" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample4" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample5" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample6" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample7" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample8" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample9" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample10" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample11" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample12" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample13" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample14" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample15" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample16" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample17" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample18" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample19" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample20" maxValue="5" excludecombinations="(2 _ _) (_ 3 _) (_ _ 5)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        let num3 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[2].componentName
          ].stateValues.value;

        expect([3, 5].includes(num1)).eq(true);
        expect([2, 5].includes(num2)).eq(true);
        expect([2, 3].includes(num3)).eq(true);
      }
    });
  });

  it("select three prime numbers up to 5, without replacement, exclude any place for 2", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="3" name="sample1" maxValue="5" excludecombinations="(2 _ _) (_ 2 _) (_ _ 2)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    cy.document().should("contain.text", "Excluded over 70%");
  });

  it("select 10 prime numbers from the first 10, without replacement, exclude positions of each number", () => {
    // make sure that exclude combinations does not enumerate all combinations excluded
    // to count them

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample1" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample2" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample3" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample4" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample5" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample6" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample7" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample8" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample9" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    <p><aslist><selectprimenumbers numToSelect="10" name="sample10" maxValue="30" excludecombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" /></aslist></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let allNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 10; ind++) {
        for (let j = 0; j < 10; j++) {
          let num =
            stateVariables[
              stateVariables["/sample" + ind].replacements[j].componentName
            ].stateValues.value;

          let validNums = [...allNumbers];
          validNums.splice(j, 1);

          expect(validNums.includes(num)).eq(true);
        }
      }
    });
  });

  it("select two prime numbers with replacement from 1020 to 1050, excluding 1031 and 1049", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample1" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample2" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample3" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample4" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample5" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample6" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample7" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample8" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample9" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample10" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample11" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample12" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample13" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample14" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample15" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample16" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample17" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample18" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample19" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" numToSelect="5" withReplacement name="sample20" minValue="1020" maxValue="1050" />
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        let num3 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[2].componentName
          ].stateValues.value;
        let num4 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[3].componentName
          ].stateValues.value;
        let num5 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[4].componentName
          ].stateValues.value;
        expect([1021, 1033, 1039, 1051].includes(num1)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num2)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num3)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num4)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num5)).eq(true);
      }
    });
  });

  it("select five (number initially unresolved) prime numbers with replacement from 1020 to 1050, excluding 1031 and 1049", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <aslist>
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample1" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample2" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample3" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample4" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample5" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample6" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample7" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample8" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample9" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample10" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample11" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample12" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample13" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample14" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample15" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample16" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample17" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample18" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample19" numToSelect="$n" minValue="1020" maxValue="1050" />
    <selectprimenumbers exclude="1031 1049" withReplacement name="sample20" numToSelect="$n" minValue="1020" maxValue="1050" />
    </aslist>
    <copy name="n2" target="n3" />
    <copy name="n" target="num1" />
    <math name="num1"><copy target="n2" />+<copy target="num2" />+2</math>
    <math name="num2"><copy target="n3" />+<copy target="num3" /></math>
    <copy name="n3" target="num3" />
    <number name="num3">1</number>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 1; ind <= 20; ind++) {
        let num1 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[0].componentName
          ].stateValues.value;
        let num2 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[1].componentName
          ].stateValues.value;
        let num3 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[2].componentName
          ].stateValues.value;
        let num4 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[3].componentName
          ].stateValues.value;
        let num5 =
          stateVariables[
            stateVariables["/sample" + ind].replacements[4].componentName
          ].stateValues.value;
        expect([1021, 1033, 1039, 1051].includes(num1)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num2)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num3)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num4)).eq(true);
        expect([1021, 1033, 1039, 1051].includes(num5)).eq(true);
      }
    });
  });

  it("select 100 large prime numbers, check that are prime", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <aslist>
    <selectprimenumbers numToSelect="100" name="sample" maxValue="1000000" />
    </aslist>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let ind = 0; ind < 100; ind++) {
        let num =
          stateVariables[
            stateVariables["/sample"].replacements[ind].componentName
          ].stateValues.value;

        expect(Number.isInteger(num) && num >= 2 && num <= 1000000).eq(true);

        let isprime = true;
        let sqrtnum = Math.sqrt(num);
        for (let i = 2; i <= sqrtnum; i++) {
          if (num % i === 0) {
            isprime = false;
            break;
          }
        }
        expect(isprime).eq(true);
      }
    });
  });

  it("copies don't resample", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <p><aslist>
    <selectprimenumbers name="sample1" maxvalue="100" />
    <selectprimenumbers name="sample2" maxvalue="100" />
    </aslist></p>

    <p><aslist>
    <copy name="noresample1" target="sample1" />
    <copy name="noresample2" target="sample2" />
    <copy name="noreresample1" target="noresample1" />
    <copy name="noreresample2" target="noresample2" />
    </aslist></p>

    <p><copy name="noresamplelist" target="_aslist1" /></p>

    <p><copy name="noreresamplelist" target="noresamplelist" /></p>

    <copy name="noresamplep" target="_p1" />
    <copy name="noreresamplep" target="noresamplep" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let num1 =
        stateVariables[stateVariables["/sample1"].replacements[0].componentName]
          .stateValues.value;
      let num2 =
        stateVariables[stateVariables["/sample2"].replacements[0].componentName]
          .stateValues.value;
      expect(Number.isInteger(num1) && num1 >= 2 && num1 <= 100).eq(true);
      expect(Number.isInteger(num2) && num2 >= 2 && num2 <= 100).eq(true);
      // check numbers are prime
      for (let num of [num1, num2]) {
        let sqrtnum = Math.sqrt(num);
        for (let i = 2; i <= sqrtnum; i++) {
          expect(num % i).greaterThan(0);
        }
      }

      expect(
        stateVariables[
          stateVariables["/noresample1"].replacements[0].componentName
        ].stateValues.value,
      ).eq(num1);
      expect(
        stateVariables[
          stateVariables["/noresample2"].replacements[0].componentName
        ].stateValues.value,
      ).eq(num2);
      expect(
        stateVariables[
          stateVariables["/noreresample1"].replacements[0].componentName
        ].stateValues.value,
      ).eq(num1);
      expect(
        stateVariables[
          stateVariables["/noreresample2"].replacements[0].componentName
        ].stateValues.value,
      ).eq(num2);

      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresamplelist"].replacements[0].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(num1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noresamplelist"].replacements[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(num2);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresamplelist"].replacements[0].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(num1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables["/noreresamplelist"].replacements[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(num2);

      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noresamplep"].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(num1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noresamplep"].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(num2);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noreresamplep"].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(num1);
      expect(
        stateVariables[
          stateVariables[
            stateVariables[
              stateVariables["/noreresamplep"].replacements[0].componentName
            ].activeChildren[0].componentName
          ].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(num2);
    });
  });

  it("select doesn't change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <math>1</math>
    <mathinput prefill="5" name="numToSelect"/>
    <mathinput prefill="3" name="maxnum"/>
    <p><aslist>
    <selectprimenumbers name="sample1" withReplacement maxValue="$maxnum" numToSelect="$numToSelect" />
    </aslist></p>

    <mathinput prefill="2" name="numToSelect2"/>
    <mathinput prefill="10" name="maxnum2"/>
    <p><aslist>
    <selectprimenumbers name="sample2" withReplacement maxValue="$maxnum2" numToSelect="$numToSelect2" />
    </aslist></p>
    <p><copy prop="value" target="maxnum2" assignNames="maxnum2a" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1");
      });

    let sample1numbers, sample2numbers;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let sample1replacements = stateVariables["/sample1"].replacements;
      let sample2replacements = stateVariables["/sample2"].replacements;
      expect(sample1replacements.length).eq(5);
      expect(sample2replacements.length).eq(2);
      sample1numbers = sample1replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbers = sample2replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      for (let num of sample1numbers) {
        expect([2, 3].includes(num)).eq(true);
      }
      for (let num of sample2numbers) {
        expect([2, 3, 5, 7].includes(num)).eq(true);
      }
    });

    cy.log("Nothing changes when change mathinputs");
    cy.get(cesc("#\\/numToSelect") + " textarea").type(
      `{end}{backspace}7{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/maxnum") + " textarea").type(`{end}{backspace}11{enter}`, {
      force: true,
    });
    cy.get(cesc("#\\/numToSelect2") + " textarea").type(
      `{end}{backspace}15{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/maxnum2") + " textarea").type(
      `{end}{backspace}{backspace}18{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/maxnum2a")).should("contain.text", "18");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let sample1replacements = stateVariables["/sample1"].replacements;
      let sample2replacements = stateVariables["/sample2"].replacements;

      expect(
        sample1replacements.map(
          (x) => stateVariables[x.componentName].stateValues.value,
        ),
      ).eqls(sample1numbers);
      expect(
        sample2replacements.map(
          (x) => stateVariables[x.componentName].stateValues.value,
        ),
      ).eqls(sample2numbers);
    });
  });

  it("select doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <selectprimenumbers assignnames="n" maxValue="100" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy target="_map1" /></aslist></p>
    <p name="p3"><copy target="_aslist1" /></p>

    <copy name="p4" target="p1" />
    <copy name="p5" target="p2" />
    <copy name="p6" target="p3" />

    <copy name="p7" target="p4" />
    <copy name="p8" target="p5" />
    <copy name="p9" target="p6" />
    <p><copy prop="value" target="_mathinput1" assignNames="m1" /></p>
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    let samplednumbers = [];

    cy.log("initially nothing");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
    });

    cy.log("sample one variable");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      samplednumbers.push(n1);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
    });

    cy.log("get same number back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}1{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "1");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("get two more samples");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}3{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "3");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      samplednumbers.push(n2);
      samplednumbers.push(n3);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
    });

    cy.log("get first two numbers back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}2{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "2");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("get six total samples");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}6{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      let n4 = stateVariables["/d/n"].stateValues.value;
      let n5 = stateVariables["/e/n"].stateValues.value;
      let n6 = stateVariables["/f/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      samplednumbers.push(n4);
      samplednumbers.push(n5);
      samplednumbers.push(n6);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });

    cy.log("go back to nothing");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}0{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "0");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(0);
    });

    cy.log("get all six back");
    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      `{end}{backspace}6{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/m1")).should("contain.text", "6");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/a/n"].stateValues.value;
      let n2 = stateVariables["/b/n"].stateValues.value;
      let n3 = stateVariables["/c/n"].stateValues.value;
      let n4 = stateVariables["/d/n"].stateValues.value;
      let n5 = stateVariables["/e/n"].stateValues.value;
      let n6 = stateVariables["/f/n"].stateValues.value;
      expect(n1).eq(samplednumbers[0]);
      expect(n2).eq(samplednumbers[1]);
      expect(n3).eq(samplednumbers[2]);
      expect(n4).eq(samplednumbers[3]);
      expect(n5).eq(samplednumbers[4]);
      expect(n6).eq(samplednumbers[5]);
      expect(
        stateVariables[stateVariables["/p1"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p2"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p3"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p4"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p5"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p6"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p7"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p8"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[
          stateVariables[stateVariables["/p9"].replacements[0].componentName]
            .activeChildren[0].componentName
        ].activeChildren.length,
      ).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p2"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p3"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p4"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p5"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p6"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p7"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p8"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables[
                stateVariables["/p9"].replacements[0].componentName
              ].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });
  });

  it("select prime numbers and sort", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="20" sortresults="true" withreplacement="true" maxValue="100" /></aslist></p>

    <p><copy target="_aslist1" /></p>
    <copy target="_p1" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let lastnumber = -20;
      let originalnumbers = stateVariables[
        "/_selectprimenumbers1"
      ].replacements.map((x) => stateVariables[x.componentName]);
      let secondnumbers = stateVariables[
        stateVariables["/_copy1"].replacements[0].componentName
      ].activeChildren.map((x) => stateVariables[x.componentName]);
      let thirdnumbers = stateVariables[
        stateVariables[stateVariables["/_copy2"].replacements[0].componentName]
          .activeChildren[0].componentName
      ].activeChildren.map((x) => stateVariables[x.componentName]);
      for (let i = 0; i < 20; i++) {
        let newnumber = originalnumbers[i].stateValues.value;
        expect(newnumber).gte(lastnumber);
        lastnumber = newnumber;
        expect(secondnumbers[i].stateValues.value).eq(newnumber);
        expect(thirdnumbers[i].stateValues.value).eq(newnumber);
      }
    });
  });

  it("select a few prime numbers and sort", () => {
    // Note: checking to make sure unique variants doesn't mess this up
    // (Currently we have turned off unique variants for sort results
    // but this test should still pass if we implement it)
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist><selectprimenumbers numToSelect="3" sortresults="true" withreplacement="true" maxValue="10" /></aslist></p>

    <p><copy target="_aslist1" /></p>
    <copy target="_p1" />
    `,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", "a");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let lastnumber = -20;
      let originalnumbers = stateVariables[
        "/_selectprimenumbers1"
      ].replacements.map((x) => stateVariables[x.componentName]);
      let secondnumbers = stateVariables[
        stateVariables["/_copy1"].replacements[0].componentName
      ].activeChildren.map((x) => stateVariables[x.componentName]);
      let thirdnumbers = stateVariables[
        stateVariables[stateVariables["/_copy2"].replacements[0].componentName]
          .activeChildren[0].componentName
      ].activeChildren.map((x) => stateVariables[x.componentName]);
      for (let i = 0; i < 3; i++) {
        let newnumber = originalnumbers[i].stateValues.value;
        expect(newnumber).gte(lastnumber);
        lastnumber = newnumber;
        expect(secondnumbers[i].stateValues.value).eq(newnumber);
        expect(thirdnumbers[i].stateValues.value).eq(newnumber);
      }
    });
  });

  it("selectprimenumbers hides dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleaninput>
    <booleaninput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleaninput>
    <p><selectprimenumbers assignnames="c" hide="$h1" />, <selectprimenumbers assignnames="d" hide="$h2" /></p>
    <p><copy target="c" />, <copy target="d" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let c = await stateVariables["/c"].stateValues.value;
      let d = await stateVariables["/d"].stateValues.value;
      expect([2, 3, 5, 7].includes(c)).eq(true);
      expect([2, 3, 5, 7].includes(d)).eq(true);

      cy.get(cesc(`#\\/_p1`)).should("have.text", `${c}, `);
      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, ${d}`);

      cy.get(cesc("#\\/h1")).click();
      cy.get(cesc("#\\/h2")).click();

      cy.get(cesc(`#\\/_p1`)).should("have.text", `, ${d}`);
      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, ${d}`);

      cy.get(cesc("#\\/h1")).click();
      cy.get(cesc("#\\/h2")).click();

      cy.get(cesc(`#\\/_p1`)).should("have.text", `${c}, `);
      cy.get(cesc(`#\\/_p2`)).should("have.text", `${c}, ${d}`);
    });
  });

  it("numToSelect from selectprimenumbers", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>n1 = <selectfromsequence from="1" to="5" assignNames="n1" /></p>
    <p>nums = <aslist><selectprimenumbers name="nums1" maxValue="30" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1" /></aslist></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectfromsequence from="1" to="5" assignNames="n2" /></p>
    <p>nums = <aslist><selectprimenumbers name="nums2" maxValue="30" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2" /></aslist></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectfromsequence from="1" to="5" assignNames="n3" /></p>
    <p>nums = <aslist><selectprimenumbers name="nums3" maxValue="30" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3" /></aslist></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectfromsequence from="1" to="5" assignNames="n4" /></p>
    <p>nums = <aslist><selectprimenumbers name="nums4" maxValue="30" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4" /></aslist></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectfromsequence from="1" to="5" assignNames="n5" /></p>
    <p>nums = <aslist><selectprimenumbers name="nums5" maxValue="30" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5" /></aslist></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let n1 = stateVariables["/n1"].stateValues.value;
      let n2 = stateVariables["/n2"].stateValues.value;
      let n3 = stateVariables["/n3"].stateValues.value;
      let n4 = stateVariables["/n4"].stateValues.value;
      let n5 = stateVariables["/n5"].stateValues.value;

      let nums1 = stateVariables["/nums1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums2 = stateVariables["/nums2"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums3 = stateVariables["/nums3"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums4 = stateVariables["/nums4"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      let nums5 = stateVariables["/nums5"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(nums1.length).eq(n1);
      expect(nums2.length).eq(n2);
      expect(nums3.length).eq(n3);
      expect(nums4.length).eq(n4);
      expect(nums5.length).eq(n5);

      nums1.length = 5;
      nums2.length = 5;
      nums3.length = 5;
      nums4.length = 5;
      nums5.length = 5;

      nums1.fill("", n1);
      nums2.fill("", n2);
      nums3.fill("", n3);
      nums4.fill("", n4);
      nums5.fill("", n5);

      let l = ["a", "b", "c", "d", "e"];

      cy.get(cesc("#\\/p1")).should(
        "have.text",
        nums1.map((v, i) => `${l[i]}1=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p2")).should(
        "have.text",
        nums2.map((v, i) => `${l[i]}2=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p3")).should(
        "have.text",
        nums3.map((v, i) => `${l[i]}3=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p4")).should(
        "have.text",
        nums4.map((v, i) => `${l[i]}4=${v}`).join(", "),
      );
      cy.get(cesc("#\\/p5")).should(
        "have.text",
        nums5.map((v, i) => `${l[i]}5=${v}`).join(", "),
      );
    });
  });
});
