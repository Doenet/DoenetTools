import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("SamplePrimeNumbers Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("no parameters, sample random prime number up to 100", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers/></template>
      <sources><sequence length="50" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      $_map1
    </aslist></p>

    $p2{name="p3"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples.length).eq(50);

      for (let sample of samples) {
        expect(
          [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97,
          ].includes(sample),
        ).eq(true);
      }

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five prime numbers up to 20, only maxValue specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers numSamples="5" maxValue="20" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      $_map1
    </aslist></p>

    $p2{name="p3"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(50);

      for (let sample of samples) {
        expect([2, 3, 5, 7, 11, 13, 17, 19].includes(sample)).eq(true);
      }

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample five prime numbers between 50 and 100, only minValue specified", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers numSamples="5" minValue="50" /></template>
      <sources><sequence length="10" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      $_map1
    </aslist></p>

    $p2{name="p3"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(50);

      for (let sample of samples) {
        expect([53, 59, 61, 67, 71, 73, 79, 83, 89, 97].includes(sample)).eq(
          true,
        );
      }

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample ten prime numbers betweeen 10,000 and 100,0000", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers numSamples="10" minValue="10000" maxValue="100000" /></template>
      <sources><sequence length="5" /></sources>
    </map>
    </aslist></p>

    <p name="p2"><aslist>
      $_map1
    </aslist></p>

    $p2{name="p3"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(samples.length).eq(50);

      for (let sample of samples) {
        expect(
          Number.isInteger(sample) && sample >= 10000 && sample <= 100000,
        ).eq(true);

        let isprime = true;
        let sqrtsample = Math.sqrt(sample);
        for (let i = 2; i <= sqrtsample; i++) {
          if (sample % i === 0) {
            isprime = false;
            break;
          }
        }

        expect(isprime).eq(true);
      }

      let copiedSamples = stateVariables[
        stateVariables["/p2"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sample fifty prime numbers betweeen 1900 and 2000, excluding 1931, 1979, and 1997", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p name="p1"><aslist>
      <samplePrimeNumbers name="samples" numSamples="50" minValue="1900" maxValue="2000" exclude="1931 1979 1997" />
    </aslist></p>

    <p name="p2"><aslist>
      $samples{name="samples2"}
    </aslist></p>

    $p2{name="p3"}
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples = stateVariables["/samples"].replacements.map(
        (y) => stateVariables[y.componentName].stateValues.value,
      );
      expect(samples.length).eq(50);

      for (let sample of samples) {
        expect(
          [1901, 1907, 1913, 1933, 1949, 1951, 1973, 1987, 1993, 1999].includes(
            sample,
          ),
        ).eq(true);
      }

      let copiedSamples = stateVariables["/samples2"].replacements.map(
        (y) => stateVariables[y.componentName].stateValues.value,
      );
      expect(copiedSamples).eqls(samples);

      let copiedCopiedSamples = stateVariables[
        stateVariables["/p3"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(copiedCopiedSamples).eqls(samples);
    });
  });

  it("sampled number does change dynamically", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <mathinput prefill="50" name="numSamples"/>
    <mathinput prefill="10" name="maxnum"/>
    <p><aslist>
    <samplePrimeNumbers name="sample1" maxValue="$maxnum" numSamples="$numSamples" />
    </aslist></p>

    <mathinput prefill="180" name="numSamples2"/>
    <mathinput prefill="7, 19, 29, 37, 47" name="exclude"/>
    <mathlist name="ml_exclude">$exclude</mathlist>
    <p><aslist>
    <samplePrimeNumbers  name="sample2" exclude="$ml_exclude" maxValue="50" numSamples="$numSamples2" />
    </aslist></p>
    <p>
      $numSamples2.value{assignNames="numSamples2a"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let sample1numbers, sample2numbers;
    let sample1numbersb, sample2numbersb;
    let sample1numbersc, sample2numbersc;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbers = stateVariables["/sample1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbers = stateVariables["/sample2"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      expect(sample1numbers.length).eq(50);
      expect(sample2numbers.length).eq(180);

      for (let num of sample1numbers) {
        expect([2, 3, 5, 7].includes(num)).eq(true);
      }

      for (let num of sample2numbers) {
        expect([2, 3, 5, 11, 13, 17, 23, 31, 41, 43].includes(num)).eq(true);
      }
    });

    cy.log("Get new samples when change number of samples");
    cy.get(cesc("#\\/numSamples") + " textarea").type(
      `{end}{backspace}{backspace}70{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/numSamples2") + " textarea").type(
      `{ctrl+home}{shift+end}{backspace}160{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/numSamples2a")).should("contain.text", "160");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbersb = stateVariables["/sample1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbersb = stateVariables["/sample2"].replacements
        .slice(
          0,
          stateVariables["/sample2"].replacements.length -
            stateVariables["/sample2"].replacementsToWithhold,
        )
        .map((x) => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbersb.length).eq(70);
      expect(sample2numbersb.length).eq(160);

      for (let num of sample1numbersb) {
        expect([2, 3, 5, 7].includes(num)).eq(true);
      }

      for (let num of sample2numbersb) {
        expect([2, 3, 5, 11, 13, 17, 23, 31, 41, 43].includes(num)).eq(true);
      }

      expect(sample1numbersb.slice(0, 10)).not.eqls(
        sample1numbers.slice(0, 10),
      );
      expect(sample2numbersb.slice(0, 10)).not.eqls(
        sample2numbers.slice(0, 10),
      );
    });

    cy.log("Get new samples when change parameters");
    cy.get(cesc("#\\/maxnum") + " textarea").type(
      `{end}{backspace}{backspace}20{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/exclude") + " textarea").type(
      `{end}, 2, 11, 23, 31, 41{enter}`,
      { force: true },
    );
    cy.get(cesc("#\\/ml_exclude")).should("contain.text", "41");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      sample1numbersc = stateVariables["/sample1"].replacements.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );
      sample2numbersc = stateVariables["/sample2"].replacements
        .slice(
          0,
          stateVariables["/sample2"].replacements.length -
            stateVariables["/sample2"].replacementsToWithhold,
        )
        .map((x) => stateVariables[x.componentName].stateValues.value);
      expect(sample1numbersc.length).eq(70);
      expect(sample2numbersc.length).eq(160);

      for (let num of sample1numbersc) {
        expect([2, 3, 5, 7, 11, 13, 17, 19].includes(num)).eq(true);
      }

      for (let num of sample2numbersc) {
        expect([3, 5, 13, 17, 43].includes(num)).eq(true);
      }

      expect(sample1numbersc.slice(0, 10)).not.eqls(
        sample1numbersb.slice(0, 10),
      );
      expect(sample2numbersc.slice(0, 10)).not.eqls(
        sample2numbersb.slice(0, 10),
      );
    });
  });

  it("sampled number doesn't resample in dynamic map", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    How many numbers do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <samplePrimeNumbers assignnames="n" />
      </template>
      <sources>
      <sequence length="$_mathinput1" />
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist>$_map1</aslist></p>
    <p name="p3">$_aslist1</p>

    $p1{name="p4"}
    $p2{name="p5"}
    $p3{name="p6"}

    $p6{name="p7"}
    $p7{name="p8"}
    $p8{name="p9"}
    <p>$_mathinput1.value{assignNames="m1"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
    });

    cy.log("sample one number");
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(1);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(3);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(2);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(0);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
        stateVariables[stateVariables["/p4"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p5"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p6"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p7"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p8"].activeChildren[0].componentName]
          .activeChildren.length,
      ).eq(6);
      expect(
        stateVariables[stateVariables["/p9"].activeChildren[0].componentName]
          .activeChildren.length,
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
              stateVariables["/p4"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p5"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p6"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p7"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p8"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
        expect(
          stateVariables[
            stateVariables[
              stateVariables["/p9"].activeChildren[0].componentName
            ].activeChildren[ind].componentName
          ].stateValues.value,
        ).eq(samplednumbers[ind]);
      }
    });
  });

  it("sample single prime number, assign name", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><samplePrimeNumbers minValue="80" maxValue="90" assignnames="u"/></p>
    <p><samplePrimeNumbers minValue="80" maxValue="90" assignnames="v"/></p>
    <p><samplePrimeNumbers minValue="80" maxValue="90" assignnames="w"/></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        },
        "*",
      );
    });

    let options = [83, 89];

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/u"];
      let u2 = stateVariables["/u2"];

      expect(options.includes(u.stateValues.value)).eq(true);
      expect(u.stateValues.value).eq(u2.stateValues.value);

      let v = stateVariables["/v"];
      let v2 = stateVariables["/v2"];
      expect(options.includes(v.stateValues.value)).eq(true);
      expect(v.stateValues.value).eq(v2.stateValues.value);

      let w = stateVariables["/w"];
      let w2 = stateVariables["/w2"];
      expect(options.includes(w.stateValues.value)).eq(true);
      expect(w.stateValues.value).eq(w2.stateValues.value);
    });
  });

  it("sample multiple prime numbers, assign names", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
      <samplePrimeNumbers name="s" minvalue="175" maxValue="205" assignnames="u v w" numSamples="6"  />
    </aslist></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get(cesc("#\\/_p1") + " > :nth-child(" + (2 * ind + 4) + ")")
        .invoke("text")
        .then((text) => {
          let num = Number(text);
          results[ind] = num;
          expect([179, 181, 191, 193, 197, 199].includes(num));
        });
    }

    cy.log("check by name").then(() => {
      cy.get(cesc("#\\/u")).should("have.text", results[0]);
      cy.get(cesc("#\\/u2")).should("have.text", results[0]);
      cy.get(cesc("#\\/v")).should("have.text", results[1]);
      cy.get(cesc("#\\/v2")).should("have.text", results[1]);
      cy.get(cesc("#\\/w")).should("have.text", results[2]);
      cy.get(cesc("#\\/w2")).should("have.text", results[2]);
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/u"];
      let u2 = stateVariables["/u2"];
      expect(u.stateValues.value).eq(results[0]);
      expect(u2.stateValues.value).eq(results[0]);

      let v = stateVariables["/v"];
      let v2 = stateVariables["/v2"];
      expect(v.stateValues.value).eq(results[1]);
      expect(v2.stateValues.value).eq(results[1]);

      let w = stateVariables["/w"];
      let w2 = stateVariables["/w2"];
      expect(w.stateValues.value).eq(results[2]);
      expect(w2.stateValues.value).eq(results[2]);

      let s = stateVariables["/s"];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).eq(results[ind]);
      }
    });
  });

  it("sample multiple prime numbers, assign names, newNamespace", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><aslist>
      <samplePrimeNumbers name="s" newnamespace minValue="175" maxValue="205" assignnames="u v w" numSamples="6"  />
    </aslist></p>
    <p>$(s/u{name="u2"})</p>
    <p>$(s/v{name="v2"})</p>
    <p>$(s/w{name="w2"})</p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    for (let ind = 0; ind < 6; ind++) {
      cy.get(cesc("#\\/_p1") + " > :nth-child(" + (2 * ind + 4) + ")")
        .invoke("text")
        .then((text) => {
          let num = Number(text);
          results[ind] = num;
          expect([179, 181, 191, 193, 197, 199].includes(num));
        });
    }

    cy.log("check by name").then(() => {
      cy.get(cesc("#\\/s\\/u")).should("have.text", results[0]);
      cy.get(cesc("#\\/u2")).should("have.text", results[0]);
      cy.get(cesc("#\\/s\\/v")).should("have.text", results[1]);
      cy.get(cesc("#\\/v2")).should("have.text", results[1]);
      cy.get(cesc("#\\/s\\/w")).should("have.text", results[2]);
      cy.get(cesc("#\\/w2")).should("have.text", results[2]);
    });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let u = stateVariables["/s/u"];
      let u2 = stateVariables["/u2"];
      expect(u.stateValues.value).eq(results[0]);
      expect(u2.stateValues.value).eq(results[0]);

      let v = stateVariables["/s/v"];
      let v2 = stateVariables["/v2"];
      expect(v.stateValues.value).eq(results[1]);
      expect(v2.stateValues.value).eq(results[1]);

      let w = stateVariables["/s/w"];
      let w2 = stateVariables["/w2"];
      expect(w.stateValues.value).eq(results[2]);
      expect(w2.stateValues.value).eq(results[2]);

      let s = stateVariables["/s"];
      expect(s.replacements.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        let r = stateVariables[s.replacements[ind].componentName];
        expect(r.stateValues.value).eq(results[ind]);
      }
    });
  });

  it("asList", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><samplePrimeNumbers name="s" minvalue="175" maxValue="205" assignnames="u v w x y" numSamples="5" /></p>
    <p><samplePrimeNumbers copySource="s" name="s2" asList="false" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let results = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      results.push(stateVariables["/u"].stateValues.value);
      results.push(stateVariables["/v"].stateValues.value);
      results.push(stateVariables["/w"].stateValues.value);
      results.push(stateVariables["/x"].stateValues.value);
      results.push(stateVariables["/y"].stateValues.value);

      for (let num of results) {
        expect([179, 181, 191, 193, 197, 199].includes(num));
      }
      cy.get(cesc2("#/_p1")).should("have.text", results.join(", "));
      cy.get(cesc2("#/_p2")).should("have.text", results.join(""));
    });
  });

  it(`different numbers when reload page if don't save state`, () => {
    let doenetML = `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(
          [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97,
          ].includes(sample),
        ).eq(true);
      }
    });

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples2.length).eq(100);

      for (let sample of samples2) {
        expect(
          [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97,
          ].includes(sample),
        ).eq(true);
      }
      expect(samples2).not.eqls(samples);
    });
  });

  it("same numbers when reload if save state", () => {
    let doenetML = `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers  /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <booleaninput name="bi" /><boolean name="b2" copySource="bi" />

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

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(
          [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97,
          ].includes(sample),
        ).eq(true);
      }
    });

    cy.log("interact so changes will be saved to database");
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b2")).should("have.text", "true");

    cy.log("wait for debounce");
    cy.wait(1500);

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
        },
        "*",
      );
    });

    cy.log("make sure core is up and running");
    cy.get(cesc("#\\/bi")).click();
    cy.get(cesc("#\\/b2")).should("have.text", "false");

    cy.log("check that values are unchanged");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples2).eqls(samples);
    });
  });

  it("same numbers for given variant if variantDeterminesSeed", () => {
    let doenetML = `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers variantDeterminesSeed /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let samples = [];

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      samples = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples.length).eq(100);

      for (let sample of samples) {
        expect(
          [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97,
          ].includes(sample),
        ).eq(true);
      }
    });

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples2).eqls(samples);
    });

    cy.reload();

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let samples2 = stateVariables[
        stateVariables["/p1"].activeChildren[0].componentName
      ].activeChildren.map(
        (x) => stateVariables[x.componentName].stateValues.value,
      );

      expect(samples2.length).eq(100);

      for (let sample of samples2) {
        expect(
          [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97,
          ].includes(sample),
        ).eq(true);
      }

      expect(samples2).not.eqls(samples);
    });
  });

  it(`resample prime numbers`, () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
          <text>a</text>
          <p><aslist><samplePrimeNumbers name="spn1" assignNames="pn1 pn2" numSamples="2" maxValue="1000" /></aslist>,
          <samplePrimeNumbers name="spn2" assignNames="pn3" minValue="1000" maxValue="10000" />
          </p>

          <p>
            <callAction name="resamp1" target="spn1" actionName="resample"><label>Resample first two</label></callAction>
            <callAction name="resamp2" target="spn2" actionName="resample"><label>Resample last</label></callAction>
          </p>
      
          `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    let pn1, pn2, pn3;
    let pn1b, pn2b, pn3b;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      pn1 = stateVariables["/pn1"].stateValues.value;
      pn2 = stateVariables["/pn2"].stateValues.value;
      pn3 = stateVariables["/pn3"].stateValues.value;

      expect(pn1).gt(1).lt(1000);
      expect(pn2).gt(1).lt(1000);
      expect(pn3).gt(1000).lt(10000);

      cy.get(cesc2("#/pn1")).should("have.text", pn1.toString());

      cy.get(cesc2("#/resamp1")).click();

      cy.get(cesc2("#/pn1")).should("not.have.text", pn1.toString());
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      pn1b = stateVariables["/pn1"].stateValues.value;
      pn2b = stateVariables["/pn2"].stateValues.value;
      pn3b = stateVariables["/pn3"].stateValues.value;

      expect(pn1b).gt(1).lt(1000);
      expect(pn2b).gt(1).lt(1000);
      expect(pn3b).gt(1000).lt(10000);

      expect(pn1b).not.eq(pn1);
      expect(pn2b).not.eq(pn2);
      expect(pn3b).eq(pn3);

      cy.get(cesc2("#/pn3")).should("have.text", pn3.toString());

      cy.get(cesc2("#/resamp2")).click();

      cy.get(cesc2("#/pn3")).should("not.have.text", pn3.toString());
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let pn1c = stateVariables["/pn1"].stateValues.value;
      let pn2c = stateVariables["/pn2"].stateValues.value;
      let pn3c = stateVariables["/pn3"].stateValues.value;

      expect(pn1c).gt(1).lt(1000);
      expect(pn2c).gt(1).lt(1000);
      expect(pn3c).gt(1000).lt(10000);

      expect(pn1c).eq(pn1b);
      expect(pn2c).eq(pn2b);
      expect(pn3c).not.eq(pn3);
    });
  });
});
