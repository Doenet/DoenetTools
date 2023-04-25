import { cesc } from "../../../../src/_utils/url";

describe("DoenetML tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("doenetML state variable", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <p name="theP">
          Did you know that
          <math name="m">1 + 1</math>
          =
          $m{simplify}?
        </p>
      
        <pre name="theDoenetML">$theP.doenetML</pre>
      
  `,
        },
        "*",
      );
    });

    let thePDoenetML = `<p name="theP">
  Did you know that
  <math name="m">1 + 1</math>
  =
  $m{simplify}?
</p>
`;

    cy.get(cesc("#\\/theP")).should(
      "contains.text",
      "\n          Did you know that\n          1+1",
    );
    cy.get(cesc("#\\/theP")).should(
      "contains.text",
      "1\n          =\n          2",
    );
    cy.get(cesc("#\\/theDoenetML")).should("have.text", thePDoenetML);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/theP"].stateValues.doenetML).eqls(thePDoenetML);

      let preChild =
        stateVariables["/theDoenetML"].activeChildren[0].componentName;
      expect(stateVariables[preChild].stateValues.value).eqls(thePDoenetML);
    });
  });

  it("doenetML from displayDoenetML", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <pre name="theDoenetML"><displayDoenetML name="ddml">
          <p>A graph of a point</p>

          <graph>
            <point name="P">(3,4)</point>
          </graph>

          A string by itself!
        </displayDoenetML></pre>
      
        <p name="pxcoord">The x-coordinate is $P.x.</p>
        <p>Change the x-coordinate: <mathinput name="mixcoord" bindValueTo="$P.x" /></p>


        <pre name="theDoenetML2"><displayDoenetML>String with no space.</displayDoenetML></pre>

  `,
        },
        "*",
      );
    });

    let thePDoenetML = `<p>A graph of a point</p>

<graph>
  <point name="P">(3,4)</point>
</graph>

A string by itself!
`;

    cy.get(cesc("#\\/theDoenetML")).should("have.text", thePDoenetML);
    cy.get(cesc("#\\/theDoenetML2")).should(
      "have.text",
      "String with no space.\n",
    );

    cy.get(cesc("#\\/pxcoord") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ddml"].stateValues.value).eq(thePDoenetML);
      expect(stateVariables["/ddml"].stateValues.text).eq(thePDoenetML);
      expect(stateVariables["/_displaydoenetml2"].stateValues.value).eq(
        "String with no space.\n",
      );

      expect(stateVariables["/P"].stateValues.xs).eqls([3, 4]);
    });

    cy.log("Change point coords, don't change DoenetML");
    cy.get(cesc("#\\/mixcoord") + " textarea").type(
      "{end}{backspace}9{enter}",
      { force: true },
    );

    cy.get(cesc("#\\/pxcoord") + " .mjx-mrow").should("contain.text", "9");
    cy.get(cesc("#\\/pxcoord") + " .mjx-mrow")
      .eq(0)
      .should("have.text", "9");

    cy.get(cesc("#\\/theDoenetML")).should("have.text", thePDoenetML);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ddml"].stateValues.value).eq(thePDoenetML);
      expect(stateVariables["/ddml"].stateValues.text).eq(thePDoenetML);
      expect(stateVariables["/_displaydoenetml2"].stateValues.value).eq(
        "String with no space.\n",
      );

      expect(stateVariables["/P"].stateValues.xs).eqls([9, 4]);
    });
  });
});
