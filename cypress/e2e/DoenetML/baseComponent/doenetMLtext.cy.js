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
</p>`;

    cy.get(cesc("#\\/theP")).should(
      "contain.text",
      "\n          Did you know that\n          1+1",
    );
    cy.get(cesc("#\\/theP")).should(
      "contain.text",
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
      
        <pre name="theDoenetML2"><displayDoenetML>String with no space.</displayDoenetML></pre>

        <p name="pMacro">This is a macro: <c><displayDoenetML>$f</displayDoenetML></c>.</p>

  `,
        },
        "*",
      );
    });

    let thePDoenetML = `<p>A graph of a point</p>

<graph>
  <point name="P">(3,4)</point>
</graph>

A string by itself!`;

    cy.get(cesc("#\\/theDoenetML")).should("have.text", thePDoenetML);
    cy.get(cesc("#\\/theDoenetML2")).should(
      "have.text",
      "String with no space.",
    );
    cy.get(cesc("#\\/pMacro")).should("have.text", "This is a macro: $f.");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ddml"].stateValues.value).eq(thePDoenetML);
      expect(stateVariables["/ddml"].stateValues.text).eq(thePDoenetML);
      expect(stateVariables["/_displaydoenetml2"].stateValues.value).eq(
        "String with no space.",
      );
      expect(stateVariables["/_displaydoenetml3"].stateValues.value).eq("$f");
    });
  });

  it("doenetML from displayDoenetML, remove preceding spacing in pre", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <pre name="preDoenetML1">
          <displayDoenetML name="ddml1">
            <p>A graph of a point</p>

            <graph>
              <point name="P">(3,4)</point>
            </graph>

            A string by itself!
          </displayDoenetML>
          </pre>
      
        <pre name="preDoenetML2">
          DoenetML A:
          <displayDoenetML name="ddml2">
            <graph>
              <point />
            </graph>
          </displayDoenetML>
          DoenetML B:
          <displayDoenetML name="ddml3">
            <p>
              Hello
            </p>
          </displayDoenetML>

        </pre>


  `,
        },
        "*",
      );
    });

    let theDoenetML1 = `<p>A graph of a point</p>

<graph>
  <point name="P">(3,4)</point>
</graph>

A string by itself!`;

    let thePre1 = `
${theDoenetML1}
          `;

    let theDoenetML2 = `<graph>
  <point />
</graph>`;
    let theDoenetML3 = `<p>
  Hello
</p>`;

    let thePre2 = `
          DoenetML A:
${theDoenetML2}
          DoenetML B:
${theDoenetML3}

        `;
    cy.get(cesc("#\\/preDoenetML1")).should("have.text", thePre1);
    cy.get(cesc("#\\/preDoenetML2")).should("have.text", thePre2);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/ddml1"].stateValues.value).eq(theDoenetML1);
      expect(stateVariables["/ddml1"].stateValues.text).eq(theDoenetML1);
      expect(stateVariables["/ddml2"].stateValues.value).eq(theDoenetML2);
      expect(stateVariables["/ddml2"].stateValues.text).eq(theDoenetML2);
      expect(stateVariables["/ddml3"].stateValues.value).eq(theDoenetML3);
      expect(stateVariables["/ddml3"].stateValues.text).eq(theDoenetML3);
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
  $s1{name="s3"}
  <section name="s4" copySource="s1" link="false" />
  $s1{name="s5" link="false"}

  
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

    cy.get(cesc2("#/s1/_pre1")).should("have.text", `<text>hello!</text>`);
    cy.get(cesc2("#/s1/pd")).should("have.text", `DoenetML: <p>A sentence</p>`);

    cy.get(cesc2("#/s2/_pre1")).should("have.text", `<text>hello!</text>`);
    cy.get(cesc2("#/s2/pd")).should("have.text", `DoenetML: <p>A sentence</p>`);

    cy.get(cesc2("#/s3/_pre1")).should("have.text", `<text>hello!</text>`);
    cy.get(cesc2("#/s3/pd")).should("have.text", `DoenetML: <p>A sentence</p>`);

    cy.get(cesc2("#/s4/_pre1")).should("have.text", `<text>hello!</text>`);
    cy.get(cesc2("#/s4/pd")).should("have.text", `DoenetML: <p>A sentence</p>`);

    cy.get(cesc2("#/s5/_pre1")).should("have.text", `<text>hello!</text>`);
    cy.get(cesc2("#/s5/pd")).should("have.text", `DoenetML: <p>A sentence</p>`);

    cy.get(cesc2("#/s1a/p1")).should("have.text", `Copy: <text>hello!</text>`);
    cy.get(cesc2("#/s1a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s1a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s1a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>`,
    );

    cy.get(cesc2("#/s2a/p1")).should("have.text", `Copy: <text>hello!</text>`);
    cy.get(cesc2("#/s2a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s2a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s2a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>`,
    );

    cy.get(cesc2("#/s3a/p1")).should("have.text", `Copy: <text>hello!</text>`);
    cy.get(cesc2("#/s3a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s3a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s3a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>`,
    );

    cy.get(cesc2("#/s4a/p1")).should("have.text", `Copy: <text>hello!</text>`);
    cy.get(cesc2("#/s4a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s4a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s4a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>`,
    );

    cy.get(cesc2("#/s5a/p1")).should("have.text", `Copy: <text>hello!</text>`);
    cy.get(cesc2("#/s5a/p2")).should(
      "have.text",
      `Copy, no link: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s5a/p3")).should(
      "have.text",
      `Copy text: <text>hello!</text>`,
    );
    cy.get(cesc2("#/s5a/p4")).should(
      "have.text",
      `Copy text, no link: <text>hello!</text>`,
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
        <copy uri="doenet:cid=bafkreiatr7qxnkb5lnjd7bccsiravqyy7xnpynyskilyg2etb3hva7oe74" name="external" />
      </section>
      
      <p>Grab the DoenetML from external pre:</p>
      <pre>$(external/_pre1.doenetML)</pre>

      <p>Grab the DoenetML from external p from external:</p>
      <pre>$(external/external/p.doenetML)</pre>
    </section>


    $s1{name="s2" newNamespace}

    <section copySource="s1" name="s3" newNamespace />

    $s1{name="s4" newNamespace link="false"}

    <section copySource="s1" name="s5" link="false" newNamespace />
  `,
        },
        "*",
      );
    });

    let theGraphDoenetML = `<graph>
  <point name="P" />
</graph>`;

    cy.log("check original");

    cy.get(cesc2("#/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
    );

    cy.get(cesc2("#/external/_pre1")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );
    cy.get(cesc2("#/external/_pre2")).should("have.text", `<text>hi</text>`);

    cy.get(cesc2("#/_pre1")).should(
      "have.text",
      `<pre>$(external/p.doenetML)</pre>`,
    );
    cy.get(cesc2("#/_pre2")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );

    cy.log("check s2");

    cy.get(cesc2("#/s2/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s2/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
    );

    cy.get(cesc2("#/s2/external/_pre1")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );
    cy.get(cesc2("#/s2/external/_pre2")).should("have.text", `<text>hi</text>`);

    cy.get(cesc2("#/s2/_pre1")).should(
      "have.text",
      `<pre>$(external/p.doenetML)</pre>`,
    );
    cy.get(cesc2("#/s2/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
    );

    cy.log("check s3");

    cy.get(cesc2("#/s3/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s3/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
    );

    cy.get(cesc2("#/s3/external/_pre1")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );
    cy.get(cesc2("#/s3/external/_pre2")).should("have.text", `<text>hi</text>`);

    cy.get(cesc2("#/s3/_pre1")).should(
      "have.text",
      `<pre>$(external/p.doenetML)</pre>`,
    );
    cy.get(cesc2("#/s3/_pre2")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );

    cy.log("check s4");

    cy.get(cesc2("#/s4/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s4/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
    );

    cy.get(cesc2("#/s4/external/_pre1")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );
    cy.get(cesc2("#/s4/external/_pre2")).should("have.text", `<text>hi</text>`);

    cy.get(cesc2("#/s4/_pre1")).should(
      "have.text",
      `<pre>$(external/p.doenetML)</pre>`,
    );
    cy.get(cesc2("#/s4/_pre2")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );

    cy.log("check s5");

    cy.get(cesc2("#/s5/external/external/_pre1")).should(
      "have.text",
      theGraphDoenetML,
    );
    cy.get(cesc2("#/s5/external/external/_pre2")).should(
      "have.text",
      `<p name="p">The <alert>DoenetML</alert> of a graph:</p>`,
    );

    cy.get(cesc2("#/s5/external/_pre1")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );
    cy.get(cesc2("#/s5/external/_pre2")).should("have.text", `<text>hi</text>`);

    cy.get(cesc2("#/s5/_pre1")).should(
      "have.text",
      `<pre>$(external/p.doenetML)</pre>`,
    );
    cy.get(cesc2("#/s5/_pre2")).should(
      "have.text",
      '<p name="p">The <alert>DoenetML</alert> of a graph:</p>',
    );
  });
});
