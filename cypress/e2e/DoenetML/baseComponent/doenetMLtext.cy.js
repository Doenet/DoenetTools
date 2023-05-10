import { cesc, cesc2 } from "../../../../src/_utils/url";

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

  it("copying displayDoenetML, with or without linking", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
  <section name="s1" newNamespace>
    <pre><displayDoenetML>
      <text>hello!</text>
    </displayDoenetML></pre>

    <p>A sentence</p>

    <p name="pd">DoenetML: <c>$_p1.doenetML</c></p>

  </section>

  <section name="s2" copySource="s1" />
  <copy source="s1" assignNames="s3" />
  <section name="s4" copySource="s1" link="false" />
  <copy source="s1" assignNames="s5" link="false" />

  
  <section name="s1a" newNamespace>
    <title>$(/s1.title)</title>
    <p name="p1">Copy: $(/s1/_displaydoenetml1)</p>
    <p name="p2">Copy, no link: $(/s1/_displaydoenetml1{link="false"})</p>
    <p name="p3">Copy text: $(/s1/_displaydoenetml1.text)</p>
    <p name="p4">Copy text, no link: $(/s1/_displaydoenetml1.text{link="false"})</p>
  </section>

  <section name="s2a" newNamespace>
    <title>$(/s2.title)</title>
    <p name="p1">Copy: $(/s2/_displaydoenetml1)</p>
    <p name="p2">Copy, no link: $(/s2/_displaydoenetml1{link="false"})</p>
    <p name="p3">Copy text: $(/s2/_displaydoenetml1.text)</p>
    <p name="p4">Copy text, no link: $(/s2/_displaydoenetml1.text{link="false"})</p>
  </section>

  <section name="s3a" newNamespace>
    <title>$(/s3.title)</title>
    <p name="p1">Copy: $(/s3/_displaydoenetml1)</p>
    <p name="p2">Copy, no link: $(/s3/_displaydoenetml1{link="false"})</p>
    <p name="p3">Copy text: $(/s3/_displaydoenetml1.text)</p>
    <p name="p4">Copy text, no link: $(/s3/_displaydoenetml1.text{link="false"})</p>
  </section>

  <section name="s4a" newNamespace>
    <title>$(/s4.title)</title>
    <p name="p1">Copy: $(/s4/_displaydoenetml1)</p>
    <p name="p2">Copy, no link: $(/s4/_displaydoenetml1{link="false"})</p>
    <p name="p3">Copy text: $(/s4/_displaydoenetml1.text)</p>
    <p name="p4">Copy text, no link: $(/s4/_displaydoenetml1.text{link="false"})</p>
  </section>

  <section name="s5a" newNamespace>
    <title>$(/s5.title)</title>
    <p name="p1">Copy: $(/s5/_displaydoenetml1)</p>
    <p name="p2">Copy, no link: $(/s5/_displaydoenetml1{link="false"})</p>
    <p name="p3">Copy text: $(/s5/_displaydoenetml1.text)</p>
    <p name="p4">Copy text, no link: $(/s5/_displaydoenetml1.text{link="false"})</p>
  </section>

  `,
        },
        "*",
      );
    });

    cy.get(cesc2("#/s1/_pre1")).should("have.text", `<text>hello!</text>\n`);
    cy.get(cesc2("#/s1/pd")).should(
      "have.text",
      `DoenetML: <p>A sentence</p>\n`,
    );

    cy.get(cesc2("#/s2/_pre1")).should("have.text", `<text>hello!</text>\n`);
    cy.get(cesc2("#/s2/pd")).should(
      "have.text",
      `DoenetML: <p>A sentence</p>\n`,
    );

    cy.get(cesc2("#/s3/_pre1")).should("have.text", `<text>hello!</text>\n`);
    cy.get(cesc2("#/s3/pd")).should(
      "have.text",
      `DoenetML: <p>A sentence</p>\n`,
    );

    cy.get(cesc2("#/s4/_pre1")).should("have.text", `<text>hello!</text>\n`);
    cy.get(cesc2("#/s4/pd")).should(
      "have.text",
      `DoenetML: <p>A sentence</p>\n`,
    );

    cy.get(cesc2("#/s5/_pre1")).should("have.text", `<text>hello!</text>\n`);
    cy.get(cesc2("#/s5/pd")).should(
      "have.text",
      `DoenetML: <p>A sentence</p>\n`,
    );

    cy.get(cesc2("#/s1a/p1")).should(
      "have.text",
      `Copy: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s1a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s1a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s1a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>\n`,
    );

    cy.get(cesc2("#/s2a/p1")).should(
      "have.text",
      `Copy: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s2a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s2a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s2a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>\n`,
    );

    cy.get(cesc2("#/s3a/p1")).should(
      "have.text",
      `Copy: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s3a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s3a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s3a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>\n`,
    );

    cy.get(cesc2("#/s4a/p1")).should(
      "have.text",
      `Copy: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s4a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s4a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s4a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>\n`,
    );

    cy.get(cesc2("#/s5a/p1")).should(
      "have.text",
      `Copy: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s5a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s5a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>\n`,
    );
    cy.get(cesc2("#/s5a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>\n`,
    );
  });

  it("doenetML with external copies", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <section name="s1">
      <section boxed>
        <title>Copy in external</title>
        <copy uri="doenet:cid=bafkreia2rjmvbvsyjf5yibxvlsmrrgkaj2xfd2aqrdycwagibjmiifkjve" assignNames="external" />
      </section>

      <p>Grab the DoenetML from external pre:</p>
      <pre>$(external/_pre1.doenetML)</pre>

      <p>Grab the DoenetML from external graph from external:</p>
      <pre>$(external/external/_graph1.doenetML)</pre>
    </section>


    <copy source="s1" assignNames="s2" assignNewNamespaces />

    <section copySource="s1" name="s3" newNamespace />

    <copy source="s1" assignNames="s4" link="false" assignNewNamespaces />

    <section copySource="s1" name="s5" link="false" newNamespace />
  `,
        },
        "*",
      );
    });

    let theGraphDoenetML = `<graph>
  <point name="P" />
</graph>
`;

    cy.log("check original");

    cy.get(cesc2("#/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>
`,
    );

    cy.get(cesc2("#/external/_pre1")).should("have.text", theGraphDoenetML);
    cy.get(cesc2("#/external/_pre2")).should(
      "have.text",
      `<text>hi</text>
`,
    );

    cy.get(cesc2("#/_pre1")).should(
      "have.text",
      `<pre>$(external/_graph1.doenetML)</pre>
`,
    );
    cy.get(cesc2("#/_pre2")).should("have.text", theGraphDoenetML);

    cy.log("check s2");

    cy.get(cesc2("#/s2/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s2/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>
`,
    );

    cy.get(cesc2("#/s2/external/_pre1")).should("have.text", theGraphDoenetML);
    cy.get(cesc2("#/s2/external/_pre2")).should(
      "have.text",
      `<text>hi</text>
`,
    );

    cy.get(cesc2("#/s2/_pre1")).should(
      "have.text",
      `<pre>$(external/_graph1.doenetML)</pre>
`,
    );
    cy.get(cesc2("#/s2/_pre2")).should("have.text", theGraphDoenetML);

    cy.log("check s3");

    cy.get(cesc2("#/s3/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s3/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>
`,
    );

    cy.get(cesc2("#/s3/external/_pre1")).should("have.text", theGraphDoenetML);
    cy.get(cesc2("#/s3/external/_pre2")).should(
      "have.text",
      `<text>hi</text>
`,
    );

    cy.get(cesc2("#/s3/_pre1")).should(
      "have.text",
      `<pre>$(external/_graph1.doenetML)</pre>
`,
    );
    cy.get(cesc2("#/s3/_pre2")).should("have.text", theGraphDoenetML);

    cy.log("check s4");

    cy.get(cesc2("#/s4/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s4/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>
`,
    );

    cy.get(cesc2("#/s4/external/_pre1")).should("have.text", theGraphDoenetML);
    cy.get(cesc2("#/s4/external/_pre2")).should(
      "have.text",
      `<text>hi</text>
`,
    );

    cy.get(cesc2("#/s4/_pre1")).should(
      "have.text",
      `<pre>$(external/_graph1.doenetML)</pre>
`,
    );
    cy.get(cesc2("#/s4/_pre2")).should("have.text", theGraphDoenetML);

    cy.log("check s5");

    cy.get(cesc2("#/s5/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s5/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>
`,
    );

    cy.get(cesc2("#/s5/external/_pre1")).should("have.text", theGraphDoenetML);
    cy.get(cesc2("#/s5/external/_pre2")).should(
      "have.text",
      `<text>hi</text>
`,
    );

    cy.get(cesc2("#/s5/_pre1")).should(
      "have.text",
      `<pre>$(external/_graph1.doenetML)</pre>
`,
    );
    cy.get(cesc2("#/s5/_pre2")).should("have.text", theGraphDoenetML);
  });
});
