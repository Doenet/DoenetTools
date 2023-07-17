import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Numberlist Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("numberlist from string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>5 1+1 pi</numberlist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "5, 2, 3.14");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(5);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(2);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[2].componentName
        ].stateValues.value,
      ).closeTo(Math.PI, 14);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).closeTo(
        Math.PI,
        14,
      );
    });
  });

  it("numberlist with error in string", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>5 _  1+1 </numberlist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "5, NaN, 2");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(5);
      assert.isNaN(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[1].componentName
        ].stateValues.value,
      );
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[2].componentName
        ].stateValues.value,
      ).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(5);
      assert.isNaN(stateVariables["/_numberlist1"].stateValues.numbers[1]);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(2);
    });
  });

  it("numberlist with number children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>5</number>
      <number>1+1</number>
    </numberlist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "5, 2");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(5);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(2);
    });
  });

  it("numberlist with number and string children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>
      -1 8/2
      <number>5</number> 9
      <number>1+1</number>
    </numberlist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "-1, 4, 5, 9, 2");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(-1);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(4);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[2].componentName
        ].stateValues.value,
      ).eq(5);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[3].componentName
        ].stateValues.value,
      ).eq(9);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[4].componentName
        ].stateValues.value,
      ).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(-1);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(4);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(5);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[3]).eq(9);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[4]).eq(2);
    });
  });

  it("numberlist with math and number children", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>5</number>
      <math>1+1</math>
    </numberlist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "5, 2");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[0].componentName
        ].stateValues.value,
      ).eq(5);
      expect(
        stateVariables[
          stateVariables["/_numberlist1"].activeChildren[1].componentName
        ].stateValues.value,
      ).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(2);
    });
  });

  it("numberlist with numberlist children, test inverse", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>1</number>
      <numberlist>2 3</numberlist>
      <number>4</number>
      <numberlist>
        <numberlist>
          <number>5</number>
          <numberlist>6 7</numberlist>
        </numberlist>
        <numberlist>8 9</numberlist>
      </numberlist>
    </numberlist></p>

    <mathinput bindValueTo="$(_numberlist1.number1)"/>
    <mathinput bindValueTo="$(_numberlist1.number2)"/>
    <mathinput bindValueTo="$(_numberlist1.number3)"/>
    <mathinput bindValueTo="$(_numberlist1.number4)"/>
    <mathinput bindValueTo="$(_numberlist1.number5)"/>
    <mathinput bindValueTo="$(_numberlist1.number6)"/>
    <mathinput bindValueTo="$(_numberlist1.number7)"/>
    <mathinput bindValueTo="$(_numberlist1.number8)"/>
    <mathinput bindValueTo="$(_numberlist1.number9)"/>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 4, 5, 6, 7, 8, 9");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(1);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(3);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[3]).eq(4);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[4]).eq(5);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[5]).eq(6);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[6]).eq(7);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[7]).eq(8);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[8]).eq(9);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[0]).eq(2);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[1]).eq(3);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[1]).eq(6);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[2]).eq(7);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[3]).eq(8);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[4]).eq(9);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[1]).eq(6);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[2]).eq(7);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[0]).eq(6);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[1]).eq(7);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[0]).eq(8);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[1]).eq(9);
    });

    cy.log("change values");

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-11{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}-12{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput3") + " textarea").type(
      "{end}{backspace}-13{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput4") + " textarea").type(
      "{end}{backspace}-14{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput5") + " textarea").type(
      "{end}{backspace}-15{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput6") + " textarea").type(
      "{end}{backspace}-16{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput7") + " textarea").type(
      "{end}{backspace}-17{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput8") + " textarea").type(
      "{end}{backspace}-18{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput9") + " textarea").type(
      "{end}{backspace}-19{enter}",
      { force: true },
    );

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should(
      "have.text",
      "-11, -12, -13, -14, -15, -16, -17, -18, -19",
    );

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(-11);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(-12);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(-13);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[3]).eq(-14);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[4]).eq(-15);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[5]).eq(-16);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[6]).eq(-17);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[7]).eq(-18);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[8]).eq(-19);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[0]).eq(-12);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[1]).eq(-13);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[0]).eq(-15);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[1]).eq(-16);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[2]).eq(-17);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[3]).eq(-18);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[4]).eq(-19);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[0]).eq(-15);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[1]).eq(-16);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[2]).eq(-17);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[0]).eq(-16);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[1]).eq(-17);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[0]).eq(-18);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[1]).eq(-19);
    });
  });

  it("numberlist with numberlist children and sugar, test inverse", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>
      1
      <numberlist>2 3</numberlist> 
      <number>4</number>
      <numberlist>
        <numberlist>
          5
          <numberlist>6 7</numberlist>
        </numberlist>
        <numberlist>8 9</numberlist>
      </numberlist>
    </numberlist></p>

    <mathinput bindValueTo="$(_numberlist1.number1)"/>
    <mathinput bindValueTo="$(_numberlist1.number2)"/>
    <mathinput bindValueTo="$(_numberlist1.number3)"/>
    <mathinput bindValueTo="$(_numberlist1.number4)"/>
    <mathinput bindValueTo="$(_numberlist1.number5)"/>
    <mathinput bindValueTo="$(_numberlist1.number6)"/>
    <mathinput bindValueTo="$(_numberlist1.number7)"/>
    <mathinput bindValueTo="$(_numberlist1.number8)"/>
    <mathinput bindValueTo="$(_numberlist1.number9)"/>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 4, 5, 6, 7, 8, 9");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(1);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(3);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[3]).eq(4);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[4]).eq(5);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[5]).eq(6);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[6]).eq(7);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[7]).eq(8);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[8]).eq(9);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[0]).eq(2);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[1]).eq(3);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[1]).eq(6);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[2]).eq(7);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[3]).eq(8);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[4]).eq(9);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[0]).eq(5);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[1]).eq(6);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[2]).eq(7);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[0]).eq(6);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[1]).eq(7);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[0]).eq(8);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[1]).eq(9);
    });

    cy.log("change values");

    cy.get(cesc("#\\/_mathinput1") + " textarea").type(
      "{end}{backspace}-11{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput2") + " textarea").type(
      "{end}{backspace}-12{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput3") + " textarea").type(
      "{end}{backspace}-13{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput4") + " textarea").type(
      "{end}{backspace}-14{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput5") + " textarea").type(
      "{end}{backspace}-15{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput6") + " textarea").type(
      "{end}{backspace}-16{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput7") + " textarea").type(
      "{end}{backspace}-17{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput8") + " textarea").type(
      "{end}{backspace}-18{enter}",
      { force: true },
    );
    cy.get(cesc("#\\/_mathinput9") + " textarea").type(
      "{end}{backspace}-19{enter}",
      { force: true },
    );

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should(
      "have.text",
      "-11, -12, -13, -14, -15, -16, -17, -18, -19",
    );

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(-11);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(-12);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(-13);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[3]).eq(-14);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[4]).eq(-15);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[5]).eq(-16);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[6]).eq(-17);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[7]).eq(-18);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[8]).eq(-19);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[0]).eq(-12);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[1]).eq(-13);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[0]).eq(-15);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[1]).eq(-16);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[2]).eq(-17);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[3]).eq(-18);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[4]).eq(-19);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[0]).eq(-15);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[1]).eq(-16);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[2]).eq(-17);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[0]).eq(-16);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[1]).eq(-17);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[0]).eq(-18);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[1]).eq(-19);
    });
  });

  it("numberlist with self references", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>1</number>
      <numberlist>2 3</numberlist>
      <number copySource="_numberlist1.number3" />
      <numberlist>
        <numberlist name="mid">
          <number><number copySource="_numberlist1.number1" /></number>
          <numberlist>4 5</numberlist>
        </numberlist>
        <numberlist>
          <number copySource="_numberlist1.number2" />
          <number copySource="_numberlist1.number5" />
        </numberlist>
      </numberlist>
      $mid
    </numberlist></p>

    <mathinput bindValueTo="$(_numberlist1.number1)"/>
    <mathinput bindValueTo="$(_numberlist1.number2)"/>
    <mathinput bindValueTo="$(_numberlist1.number3)"/>
    <mathinput bindValueTo="$(_numberlist1.number4)"/>
    <mathinput bindValueTo="$(_numberlist1.number5)"/>
    <mathinput bindValueTo="$(_numberlist1.number6)"/>
    <mathinput bindValueTo="$(_numberlist1.number7)"/>
    <mathinput bindValueTo="$(_numberlist1.number8)"/>
    <mathinput bindValueTo="$(_numberlist1.number9)"/>
    <mathinput bindValueTo="$(_numberlist1.number10)"/>
    <mathinput bindValueTo="$(_numberlist1.number11)"/>
    <mathinput bindValueTo="$(_numberlist1.number12)"/>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let vals = [1, 2, 3, 4, 5];
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = (i) => vals[mapping[i]];

      let numbers = stateVariables["/_numberlist1"].stateValues.numbers;

      let mathinputAnchors = [];
      for (let i in mapping) {
        mathinputAnchors.push(
          cesc(`#\\/_mathinput${Number(i) + 1}`) + ` textarea`,
        );
      }

      cy.log("Test value displayed in browser");
      cy.get(cesc("#\\/_p1")).should(
        "have.text",
        mapping.map((x) => vals[x]).join(", "),
      );

      cy.log("Test internal values are set to the correct values");
      cy.window().then(async (win) => {
        for (let i in mapping) {
          expect(numbers[i]).eq(mv(i));
        }
      });

      cy.log("change values");

      for (let changeInd in mapping) {
        cy.window().then(async (win) => {
          vals[mapping[changeInd]] = 100 + Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).type(
            "{ctrl+home}{shift+end}{backspace}" +
              (100 + Number(changeInd)) +
              "{enter}",
            { force: true },
          );

          cy.log("Test value displayed in browser");
          cy.get(cesc("#\\/_p1")).should(
            "have.text",
            mapping.map((x) => vals[x]).join(", "),
          );

          cy.log("Test internal values are set to the correct values");
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let numbers = stateVariables["/_numberlist1"].stateValues.numbers;
            for (let i in mapping) {
              expect(numbers[i]).eq(mv(i));
            }
          });
        });
      }
    });
  });

  it("numberlist with maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist maxNumber="7">
      <number>1</number>
      <numberlist maxNumber="2">2 3 4 5</numberlist>
      <number>6</number>
      <numberlist maxNumber="4">
        <numberlist maxNumber="2">
          <number>7</number>
          <numberlist>8 9</numberlist>
        </numberlist>
        <numberlist>10 11 12</numberlist>
      </numberlist>
    </numberlist></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 6, 7, 8, 10");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_numberlist1"].stateValues.numbers.length).eq(7);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[0]).eq(1);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[1]).eq(2);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[2]).eq(3);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[3]).eq(6);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[4]).eq(7);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[5]).eq(8);
      expect(stateVariables["/_numberlist1"].stateValues.numbers[6]).eq(10);
      expect(stateVariables["/_numberlist2"].stateValues.numbers.length).eq(2);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[0]).eq(2);
      expect(stateVariables["/_numberlist2"].stateValues.numbers[1]).eq(3);
      expect(stateVariables["/_numberlist3"].stateValues.numbers.length).eq(4);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[0]).eq(7);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[1]).eq(8);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[2]).eq(10);
      expect(stateVariables["/_numberlist3"].stateValues.numbers[3]).eq(11);
      expect(stateVariables["/_numberlist4"].stateValues.numbers.length).eq(2);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[0]).eq(7);
      expect(stateVariables["/_numberlist4"].stateValues.numbers[1]).eq(8);
      expect(stateVariables["/_numberlist5"].stateValues.numbers.length).eq(2);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[0]).eq(8);
      expect(stateVariables["/_numberlist5"].stateValues.numbers[1]).eq(9);
      expect(stateVariables["/_numberlist6"].stateValues.numbers.length).eq(3);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[0]).eq(10);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[1]).eq(11);
      expect(stateVariables["/_numberlist6"].stateValues.numbers[2]).eq(12);
    });
  });

  it("dynamic maximum number", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
      <text>a</text>
      <p><numberlist name="nl1" maxNumber="$mn1">1 2 3 4 5</numberlist></p>
      <p>$nl1{maxNumber="$mn2" name="nl2"}</p>
      <p>Maximum number 1: <mathinput name="mn1" prefill="2" /></p>
      <p>Maximum number 2: <mathinput name="mn2" /></p>

      `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      cy.get(cesc("#\\/_p1")).should("have.text", "1, 2");
      cy.get(cesc("#\\/_p2")).should("have.text", "1, 2, 3, 4, 5");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/nl1"].stateValues.numbers).eqls([1, 2]);
        expect(stateVariables["/nl2"].stateValues.numbers).eqls([
          1, 2, 3, 4, 5,
        ]);
      });
    });

    cy.log("clear first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea")
      .type("{end}{backspace}", { force: true })
      .blur();
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 4, 5");
    cy.get(cesc("#\\/_p2")).should("have.text", "1, 2, 3, 4, 5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/nl1"].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
      expect(stateVariables["/nl2"].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
    });

    cy.log("number in second maxnum");
    cy.get(cesc("#\\/mn2") + " textarea").type("3{enter}", { force: true });
    cy.get(cesc("#\\/_p2")).should("have.text", "1, 2, 3");
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 4, 5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/nl1"].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
      expect(stateVariables["/nl2"].stateValues.numbers).eqls([1, 2, 3]);
    });

    cy.log("number in first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea").type("4{enter}", { force: true });
    cy.get(cesc("#\\/_p1")).should("have.text", "1, 2, 3, 4");
    cy.get(cesc("#\\/_p2")).should("have.text", "1, 2, 3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/nl1"].stateValues.numbers).eqls([1, 2, 3, 4]);
      expect(stateVariables["/nl2"].stateValues.numbers).eqls([1, 2, 3]);
    });

    cy.log("change number in first maxnum");
    cy.get(cesc("#\\/mn1") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });
    cy.get(cesc("#\\/_p1")).should("have.text", "1");
    cy.get(cesc("#\\/_p2")).should("have.text", "1, 2, 3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/nl1"].stateValues.numbers).eqls([1]);
      expect(stateVariables["/nl2"].stateValues.numbers).eqls([1, 2, 3]);
    });
  });

  it("numberlist within numberlists, with child hide", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist name="numberlist1" hide="true">1 2 3</numberlist></p>

    <p><numberlist name="numberlist1a" hide="false" copysource="numberlist1" /></p>

    <p><numberlist name="numberlist2">
      <number>4</number>
      <numberlist copysource="numberlist1" hide="false" />
      <number hide>5</number>
      $numberlist1a
    </numberlist></p>

    <p><numberlist name="numberlist3" maxNumber="6" copysource="numberlist2" /></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");

    cy.get(cesc("#\\/_p1")).should("have.text", "");

    cy.get(cesc("#\\/_p2")).should("have.text", "1, 2, 3");

    cy.get(cesc("#\\/_p3")).should("have.text", "4, 1, 2, 3, 1, 2, 3");

    cy.get(cesc("#\\/_p4")).should("have.text", "4, 1, 2, 3, 1");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/numberlist1"].stateValues.numbers.length).eq(3);
      expect(stateVariables["/numberlist1"].stateValues.numbers[0]).eq(1);
      expect(stateVariables["/numberlist1"].stateValues.numbers[1]).eq(2);
      expect(stateVariables["/numberlist1"].stateValues.numbers[2]).eq(3);
      expect(stateVariables["/numberlist1a"].stateValues.numbers.length).eq(3);
      expect(stateVariables["/numberlist1a"].stateValues.numbers[0]).eq(1);
      expect(stateVariables["/numberlist1a"].stateValues.numbers[1]).eq(2);
      expect(stateVariables["/numberlist1a"].stateValues.numbers[2]).eq(3);
      expect(stateVariables["/numberlist2"].stateValues.numbers.length).eq(8);
      expect(stateVariables["/numberlist2"].stateValues.numbers[0]).eq(4);
      expect(stateVariables["/numberlist2"].stateValues.numbers[1]).eq(1);
      expect(stateVariables["/numberlist2"].stateValues.numbers[2]).eq(2);
      expect(stateVariables["/numberlist2"].stateValues.numbers[3]).eq(3);
      expect(stateVariables["/numberlist2"].stateValues.numbers[4]).eq(5);
      expect(stateVariables["/numberlist2"].stateValues.numbers[5]).eq(1);
      expect(stateVariables["/numberlist2"].stateValues.numbers[6]).eq(2);
      expect(stateVariables["/numberlist2"].stateValues.numbers[7]).eq(3);
      expect(stateVariables["/numberlist3"].stateValues.numbers.length).eq(6);
      expect(stateVariables["/numberlist3"].stateValues.numbers[0]).eq(4);
      expect(stateVariables["/numberlist3"].stateValues.numbers[1]).eq(1);
      expect(stateVariables["/numberlist3"].stateValues.numbers[2]).eq(2);
      expect(stateVariables["/numberlist3"].stateValues.numbers[3]).eq(3);
      expect(stateVariables["/numberlist3"].stateValues.numbers[4]).eq(5);
      expect(stateVariables["/numberlist3"].stateValues.numbers[5]).eq(1);
    });
  });

  it("numberlist and rounding, from strings", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist displayDigits="4">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDigits="4" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDigits="4" displaySmallAsZero="false">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDigits="4" displaySmallAsZero="false" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numbers1 = stateVariables["/_numberlist1"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers2 = stateVariables["/_numberlist2"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers3 = stateVariables["/_numberlist3"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers4 = stateVariables["/_numberlist4"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers5 = stateVariables["/_numberlist5"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers6 = stateVariables["/_numberlist6"].activeChildren.map(
        (x) => x.componentName,
      );

      cy.get(cesc2("#" + numbers1[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers1[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers1[2])).should("have.text", "0.5");
      cy.get(cesc2("#" + numbers1[3])).should("have.text", "5.252 * 10^(-13)");
      cy.get(cesc2("#" + numbers1[4])).should("have.text", "0");

      cy.get(cesc2("#" + numbers2[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers2[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers2[2])).should("have.text", "0.5000");
      cy.get(cesc2("#" + numbers2[3])).should("have.text", "5.252 * 10^(-13)");
      cy.get(cesc2("#" + numbers2[4])).should("have.text", "0.000");

      cy.get(cesc2("#" + numbers3[0])).should("have.text", "2345.154");
      cy.get(cesc2("#" + numbers3[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers3[2])).should("have.text", "0.5");
      cy.get(cesc2("#" + numbers3[3])).should("have.text", "0");
      cy.get(cesc2("#" + numbers3[4])).should("have.text", "0");

      cy.get(cesc2("#" + numbers4[0])).should("have.text", "2345.154");
      cy.get(cesc2("#" + numbers4[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers4[2])).should("have.text", "0.500");
      cy.get(cesc2("#" + numbers4[3])).should("have.text", "0.000");
      cy.get(cesc2("#" + numbers4[4])).should("have.text", "0.000");

      cy.get(cesc2("#" + numbers5[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers5[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers5[2])).should("have.text", "0.5");
      cy.get(cesc2("#" + numbers5[3])).should("have.text", "5.252 * 10^(-13)");
      cy.get(cesc2("#" + numbers5[4])).should("have.text", "6 * 10^(-21)");

      cy.get(cesc2("#" + numbers6[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers6[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers6[2])).should("have.text", "0.5000");
      cy.get(cesc2("#" + numbers6[3])).should("have.text", "5.252 * 10^(-13)");
      cy.get(cesc2("#" + numbers6[4])).should("have.text", "6.000 * 10^(-21)");
    });
  });

  it("numberlist and rounding, number children attributes ignored", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberlist name="ml1">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml2" displayDigits="4">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml3" displayDigits="4" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml5" displayDecimals="4">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml6" displayDecimals="4" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml9" displayDigits="4" displaySmallAsZero="false">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="4">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number displaySmallAsZero="false">0.00000000000000052523</number>
      <number>0.000000000000000000006</number>
    </numberList></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numbers1 = stateVariables["/ml1"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers2 = stateVariables["/ml2"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers3 = stateVariables["/ml3"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers5 = stateVariables["/ml5"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers6 = stateVariables["/ml6"].activeChildren.map(
        (x) => x.componentName,
      );
      let numbers9 = stateVariables["/ml9"].activeChildren.map(
        (x) => x.componentName,
      );

      cy.get(cesc2("#" + numbers1[0])).should("have.text", "2345.15");
      cy.get(cesc2("#" + numbers1[1])).should("have.text", "3.52");
      cy.get(cesc2("#" + numbers1[2])).should("have.text", "5");
      cy.get(cesc2("#" + numbers1[3])).should("have.text", "0");
      cy.get(cesc2("#" + numbers1[4])).should("have.text", "0");

      cy.get(cesc2("#" + numbers2[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers2[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers2[2])).should("have.text", "5");
      cy.get(cesc2("#" + numbers2[3])).should("have.text", "0");
      cy.get(cesc2("#" + numbers2[4])).should("have.text", "0");

      cy.get(cesc2("#" + numbers3[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers3[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers3[2])).should("have.text", "5.000");
      cy.get(cesc2("#" + numbers3[3])).should("have.text", "0.000");
      cy.get(cesc2("#" + numbers3[4])).should("have.text", "0.000");

      cy.get(cesc2("#" + numbers5[0])).should("have.text", "2345.1535");
      cy.get(cesc2("#" + numbers5[1])).should("have.text", "3.5234");
      cy.get(cesc2("#" + numbers5[2])).should("have.text", "5");
      cy.get(cesc2("#" + numbers5[3])).should("have.text", "0");
      cy.get(cesc2("#" + numbers5[4])).should("have.text", "0");

      cy.get(cesc2("#" + numbers6[0])).should("have.text", "2345.1535");
      cy.get(cesc2("#" + numbers6[1])).should("have.text", "3.5234");
      cy.get(cesc2("#" + numbers6[2])).should("have.text", "5.0000");
      cy.get(cesc2("#" + numbers6[3])).should("have.text", "0.0000");
      cy.get(cesc2("#" + numbers6[4])).should("have.text", "0.0000");

      cy.get(cesc2("#" + numbers9[0])).should("have.text", "2345");
      cy.get(cesc2("#" + numbers9[1])).should("have.text", "3.523");
      cy.get(cesc2("#" + numbers9[2])).should("have.text", "5");
      cy.get(cesc2("#" + numbers9[3])).should("have.text", "5.252 * 10^(-16)");
      cy.get(cesc2("#" + numbers9[4])).should("have.text", "6 * 10^(-21)");
    });
  });

  it("numberlist and rounding, math children attributes ignored", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p><numberList name="ml1">
      <math name="n11" displayDigits="5">2345.1535268</math>
      <math name="n12" displayDecimals="4">3.52343</math>
      <math name="n13" displayDigits="5" padZeros>5</math>
      <math name="n14" displaySmallAsZero="false">0.00000000000000052523</math>
      <math name="n15">0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml2" displayDigits="4">
      <math name="n21" displayDigits="5">2345.1535268</math>
      <math name="n22" displayDecimals="4">3.52343</math>
      <math name="n23" displayDigits="5" padZeros>5</math>
      <math name="n24" displaySmallAsZero="false">0.00000000000000052523</math>
      <math name="n25">0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml3" displayDigits="4" padZeros>
      <math name="n31" displayDigits="5">2345.1535268</math>
      <math name="n32" displayDecimals="4">3.52343</math>
      <math name="n33" displayDigits="5" padZeros>5</math>
      <math name="n34" displaySmallAsZero="false">0.00000000000000052523</math>
      <math name="n35">0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml5" displayDecimals="4">
      <math name="n51" displayDigits="5">2345.1535268</math>
      <math name="n52" displayDecimals="4">3.52343</math>
      <math name="n53" displayDigits="5" padZeros>5</math>
      <math name="n54" displaySmallAsZero="false">0.00000000000000052523</math>
      <math name="n55">0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml6" displayDecimals="4" padZeros>
      <math name="n61" displayDigits="5">2345.1535268</math>
      <math name="n62" displayDecimals="4">3.52343</math>
      <math name="n63" displayDigits="5" padZeros>5</math>
      <math name="n64" displaySmallAsZero="false">0.00000000000000052523</math>
      <math name="n65">0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml9" displayDigits="4" displaySmallAsZero="false">
      <math name="n91" displayDigits="5">2345.1535268</math>
      <math name="n92" displayDecimals="4">3.52343</math>
      <math name="n93" displayDigits="5" padZeros>5</math>
      <math name="n94" displaySmallAsZero="false">0.00000000000000052523</math>
      <math name="n95">0.000000000000000000006</math>
    </numberList></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc2("#/n11")).should("have.text", "2345.15");
    cy.get(cesc2("#/n12")).should("have.text", "3.52");
    cy.get(cesc2("#/n13")).should("have.text", "5");
    cy.get(cesc2("#/n14")).should("have.text", "0");
    cy.get(cesc2("#/n15")).should("have.text", "0");

    cy.get(cesc2("#/n21")).should("have.text", "2345");
    cy.get(cesc2("#/n22")).should("have.text", "3.523");
    cy.get(cesc2("#/n23")).should("have.text", "5");
    cy.get(cesc2("#/n24")).should("have.text", "0");
    cy.get(cesc2("#/n25")).should("have.text", "0");

    cy.get(cesc2("#/n31")).should("have.text", "2345");
    cy.get(cesc2("#/n32")).should("have.text", "3.523");
    cy.get(cesc2("#/n33")).should("have.text", "5.000");
    cy.get(cesc2("#/n34")).should("have.text", "0.000");
    cy.get(cesc2("#/n35")).should("have.text", "0.000");

    cy.get(cesc2("#/n51")).should("have.text", "2345.1535");
    cy.get(cesc2("#/n52")).should("have.text", "3.5234");
    cy.get(cesc2("#/n53")).should("have.text", "5");
    cy.get(cesc2("#/n54")).should("have.text", "0");
    cy.get(cesc2("#/n55")).should("have.text", "0");

    cy.get(cesc2("#/n61")).should("have.text", "2345.1535");
    cy.get(cesc2("#/n62")).should("have.text", "3.5234");
    cy.get(cesc2("#/n63")).should("have.text", "5.0000");
    cy.get(cesc2("#/n64")).should("have.text", "0.0000");
    cy.get(cesc2("#/n65")).should("have.text", "0.0000");

    cy.get(cesc2("#/n91")).should("have.text", "2345");
    cy.get(cesc2("#/n92")).should("have.text", "3.523");
    cy.get(cesc2("#/n93")).should("have.text", "5");
    cy.get(cesc2("#/n94")).should("have.text", "5.252 * 10^(-16)");
    cy.get(cesc2("#/n95")).should("have.text", "6 * 10^(-21)");
  });

  it("numberlist and rounding, copy and override", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p><numberList name="ml1">34.245023482352345 <number displayDigits="7">245.23823402358234234</number></numberList></p>
    <p><numberList name="ml1Dig6" copySource="ml1" displayDigits="6" /></p>
    <p><numberList name="ml1Dec6" copySource="ml1" displayDecimals="6" /></p>
    <p><numberList name="ml1Dig6a" copySource="ml1Dec6" displayDigits="6" /></p>
    <p><numberList name="ml1Dec6a" copySource="ml1Dig6" displayDecimals="6" /></p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.get(cesc("#\\/ml1")).should("have.text", "34.25, 245.24");

    cy.get(cesc("#\\/ml1Dig6")).should("have.text", "34.245, 245.238");
    cy.get(cesc("#\\/ml1Dig6a")).should("have.text", "34.245, 245.238");

    cy.get(cesc("#\\/ml1Dec6")).should("have.text", "34.245023, 245.238234");
    cy.get(cesc("#\\/ml1Dec6a")).should("have.text", "34.245023, 245.238234");
  });

  it("numberlist adapts to math and text", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <numberlist><number>1</number> <number>2</number><number>3</number></numberlist>

    <p>number list as math: <math>$_numberlist1</math></p>
    <p>number list as text: <text>$_numberlist1</text></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

    cy.log("Test value displayed in browser");
    cy.get(cesc("#\\/_number1")).should("have.text", "1");
    cy.get(cesc("#\\/_number2")).should("have.text", "2");
    cy.get(cesc("#\\/_number3")).should("have.text", "3");
    cy.get(cesc("#\\/_math1") + " .mjx-mrow")
      .eq(0)
      .invoke("text")
      .then((text) => {
        expect(text.trim()).equal("1,2,3");
      });
    cy.get(cesc("#\\/_text2")).should("have.text", "1, 2, 3");

    cy.log("Test internal values are set to the correct values");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_math1"].stateValues.value).eqls([
        "list",
        1,
        2,
        3,
      ]);
      expect(stateVariables["/_text2"].stateValues.value).eq("1, 2, 3");
    });
  });

  it("numberlist adapts to mathlist", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <numberlist name="nl"><number>9</number> <number>8</number><number>7</number></numberlist>

    <p><mathlist name="ml">$nl</mathlist></p>
    <p>Change second math: <mathinput name="mi1">$ml.math2</mathinput></p>

    <p>Change 1st and 3rd math via point: <mathinput name="mi2"><point>($ml.number1,$ml.math3)</point></mathinput></p>

    `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9,8,7");

    cy.get(cesc2("#/nl")).should("have.text", "9, 8, 7");

    cy.get(cesc2("#/mi1") + " textarea").type("{end}3{enter}", { force: true });

    cy.get(cesc2("#/nl")).should("have.text", "9, 83, 7");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9,83,7");

    cy.get(cesc2("#/mi2") + " textarea").type(
      "{end}{leftarrow}{backspace}{backspace}{backspace}-1,2{enter}",
      { force: true },
    );

    cy.get(cesc2("#/nl")).should("have.text", "-1, 83, 2");
    cy.get(cesc2("#/ml") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "−1,83,2");
  });
});
