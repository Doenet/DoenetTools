import { cesc } from "../../../../src/_utils/url";

describe("Legend Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("legend includes unique styles, points separate, closed path not separate", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph>
      <function styleNumber="3">(x+5)^2</function>
      <point styleNumber="1" displayDigits="2">(-3,2)</point>
      <circle styleNumber="3" center="(5,-8)" />
      <vector styleNumber="2" head="(-3,1)" tail="(2,2)" />
      <point styleNumber="1" displayDigits="2">(-5,6)</point>
      <point styleNumber="2">(0,-6)</point>

      <legend>
        <label>parabola and circle</label>
        <label>$_point1 and $_point2</label>
        <label>vector</label>
        <label><m>r^2</m></label>
        <label>This will be unused</label>
      </legend>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_legend1"].stateValues.position).eq("upperright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        4,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("parabola and circle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\left( -3, 2 \\right)\\) and \\(\\left( -5, 6 \\right)\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("vector");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label.value,
      ).eq("\\(r^2\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label
          .hasLatex,
      ).eq(true);
    });
  });

  it("displayClosedSwatches separates closed path", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph>
      <function styleNumber="3">(x+5)^2</function>
      <point styleNumber="1" displayDigits="2">(-3,2)</point>
      <circle styleNumber="3" center="(5,-8)" />
      <vector styleNumber="2" head="(-3,1)" tail="(2,2)" />
      <point styleNumber="1" displayDigits="2">(-5,6)</point>
      <point styleNumber="2">(0,-6)</point>

      <legend displayClosedSwatches>
        <label>parabola</label>
        <label>$_point1 and $_point2</label>
        <label>circle</label>
        <label>vector</label>
        <label><m>r^2</m></label>
        <label>This will be unused</label>
      </legend>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_legend1"].stateValues.position).eq("upperright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        5,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("parabola");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\left( -3, 2 \\right)\\) and \\(\\left( -5, 6 \\right)\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("rectangle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("circle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label.value,
      ).eq("vector");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].label.value,
      ).eq("\\(r^2\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].label
          .hasLatex,
      ).eq(true);
    });
  });

  it("legend with dynamical functions", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <mathinput name="n" prefill="2" />
    <textinput name="pos" />
    <graph>
      <map>
        <template>
          <function stylenumber="floor($v/2+1/2)">sin(x)+$v</function>
        </template>
        <sources alias="v"><sequence length="$n" /></sources>
      </map>
      <legend position="$pos">
        <label>hi</label>
        <label><m>\\int_a^b f(x) \\,dx</m> is it!</label>
        <label>only this</label>
        <label><m>x^2</m></label>
      </legend>
    </graph>

    <copy prop="value" target="n" assignNames="n2" />
    <copy prop="value" target="pos" assignNames="pos2" />
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("upperright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        1,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);
    });

    cy.get(cesc("#\\/pos_input")).type("upperLeft{enter}");

    cy.get(cesc("#\\/pos2")).should("have.text", "upperLeft");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("upperleft");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        1,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("contain.text", "3");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("upperleft");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        2,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\int_a^b f(x) \\,dx\\) is it!");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("contain.text", "4");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("upperleft");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        2,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\int_a^b f(x) \\,dx\\) is it!");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}5{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("contain.text", "5");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("upperleft");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        3,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\int_a^b f(x) \\,dx\\) is it!");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("only this");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(false);
    });

    cy.get(cesc("#\\/pos_input")).clear().type("LowerRight{enter}");

    cy.get(cesc("#\\/pos2")).should("have.text", "LowerRight");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("lowerright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        3,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\int_a^b f(x) \\,dx\\) is it!");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("only this");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(false);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}8{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("contain.text", "8");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("lowerright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        4,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\int_a^b f(x) \\,dx\\) is it!");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("only this");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label.value,
      ).eq("\\(x^2\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label
          .hasLatex,
      ).eq(true);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}1{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("contain.text", "1");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("lowerright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        1,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);
    });

    cy.get(cesc("#\\/pos_input")).clear().type("lowerleft{enter}");

    cy.get(cesc("#\\/pos2")).should("have.text", "lowerleft");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("lowerleft");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        1,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);
    });

    cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}10{enter}", {
      force: true,
    });

    cy.get(cesc("#\\/n2") + " .mjx-mrow").should("contain.text", "10");

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_legend1"].stateValues.position).eq("lowerleft");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        4,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("hi");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("\\(\\int_a^b f(x) \\,dx\\) is it!");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(true);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("only this");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(false);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label.value,
      ).eq("\\(x^2\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label
          .hasLatex,
      ).eq(true);
    });
  });

  it("legend with forObject", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="green" lineWidth="1" lineOpacity="0.9" lineStyle="dotted" markerSize="5" markerStyle="triangle" markerColor="green" fillColor="red" fillOpacity="0.3" />
        <styleDefinition styleNumber="2" lineColor="blue" lineWidth="2" lineOpacity="0.8" lineStyle="dashed" markerSize="4" markerStyle="square" markerColor="blue" fillColor="orange" fillOpacity="0.4" />
        <styleDefinition styleNumber="3" lineColor="cyan" lineWidth="3" lineOpacity="0.7" lineStyle="solid" markerSize="3" markerStyle="circle" markerColor="cyan" fillColor="magenta" fillOpacity="0.5" />
        <styleDefinition styleNumber="4" lineColor="black" lineWidth="4" lineOpacity="0.6" lineStyle="dotted" />
      </styleDefinitions>
    </setup>

    <p>display closed swatches: <booleaninput name="closedSwatches" /></p>

    <graph>
      <lineSegment styleNumber="3" />
      <point styleNumber="1" displayDigits="2" name="A">(-3,2)</point>
      <circle styleNumber="3" center="(5,-8)" filled />
      <vector styleNumber="2" head="(-3,1)" tail="(2,2)" />
      <point styleNumber="1" displayDigits="2" name="B">(-5,6)</point>
      <point styleNumber="2" name="C">(0,-6)</point>
      <function styleNumber="2" name="f">(x+5)^2</function>
      <rectangle styleNumber="2" filled />
      <curve through="(-9,-9) (-8, -8) (-7, -9)" styleNumber="4" />

      <legend displayClosedSwatches="$closedSwatches">
        <label forObject="f">targeted function</label>
        <label>first one</label>
        <label>second one <m>x^2</m></label>
        <label forObject="B">targeted point <m>B</m></label>
        <label>third one</label>
        <label forObject="incorrect">This will be unused</label>
        <label>fourth one</label>
      </legend>
    </graph>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_legend1"].stateValues.position).eq("upperright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        5,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("targeted function");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineStyle,
      ).eq("dashed");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineColor,
      ).eq("blue");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineWidth,
      ).eq(2);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineOpacity,
      ).eq(0.8);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("first one");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineStyle,
      ).eq("solid");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineColor,
      ).eq("cyan");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineWidth,
      ).eq(3);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineOpacity,
      ).eq(0.7);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("second one \\(x^2\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(true);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].markerStyle,
      ).eq("square");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].markerColor,
      ).eq("blue");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].markerSize,
      ).eq(4);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label.value,
      ).eq("targeted point \\(B\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label
          .hasLatex,
      ).eq(true);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].markerStyle,
      ).eq("triangle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].markerColor,
      ).eq("green");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].markerSize,
      ).eq(5);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].label.value,
      ).eq("third one");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].lineStyle,
      ).eq("dotted");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].lineColor,
      ).eq("black");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].lineWidth,
      ).eq(4);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].lineOpacity,
      ).eq(0.6);
    });

    cy.log("change displayClosedSwatches to true");
    cy.get(cesc("#\\/closedSwatches")).click();

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables["/_legend1"].stateValues.position).eq("upperright");

      expect(stateVariables["/_legend1"].stateValues.legendElements.length).eq(
        6,
      );

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("targeted function");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineStyle,
      ).eq("dashed");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineColor,
      ).eq("blue");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineWidth,
      ).eq(2);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].lineOpacity,
      ).eq(0.8);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("line");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("first one");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineStyle,
      ).eq("solid");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineColor,
      ).eq("cyan");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineWidth,
      ).eq(3);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].lineOpacity,
      ).eq(0.7);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].swatchType,
      ).eq("rectangle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label.value,
      ).eq("second one \\(x^2\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].label
          .hasLatex,
      ).eq(true);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].lineStyle,
      ).eq("solid");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].lineColor,
      ).eq("cyan");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].lineWidth,
      ).eq(3);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].lineOpacity,
      ).eq(0.7);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].fillColor,
      ).eq("magenta");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].filled,
      ).eq(true);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[2].fillOpacity,
      ).eq(0.5);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label.value,
      ).eq("targeted point \\(B\\)");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].label
          .hasLatex,
      ).eq(true);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].markerStyle,
      ).eq("triangle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].markerColor,
      ).eq("green");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[3].markerSize,
      ).eq(5);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].label.value,
      ).eq("third one");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].markerStyle,
      ).eq("square");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].markerColor,
      ).eq("blue");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[4].markerSize,
      ).eq(4);

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].swatchType,
      ).eq("rectangle");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].label.value,
      ).eq("fourth one");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].label
          .hasLatex,
      ).eq(false);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].lineStyle,
      ).eq("dashed");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].lineColor,
      ).eq("blue");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].lineWidth,
      ).eq(2);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].lineOpacity,
      ).eq(0.8);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].fillColor,
      ).eq("orange");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].filled,
      ).eq(true);
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[5].fillOpacity,
      ).eq(0.4);
    });
  });

  it("legend with forObject, use names of shadow sources", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <graph>
      <point name="p" labelIsName>(3,4)</point>
      <point name="Q" styleNumber="2" labelIsName>(4,5)</point>
      <legend>
        <label forObject="p">point p</label>
        <label forObject="Q">point Q</label>
      </legend> 
    </graph>
    
    
    <graph>
      $p
      $Q
      <legend>
      <label forObject="Q">point Q</label>
      <label forObject="p">point p</label>
      </legend> 
    </graph>
  
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[0].label.value,
      ).eq("point p");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend1"].stateValues.legendElements[1].label.value,
      ).eq("point Q");
      expect(
        stateVariables["/_legend2"].stateValues.legendElements[0].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend2"].stateValues.legendElements[0].label.value,
      ).eq("point Q");
      expect(
        stateVariables["/_legend2"].stateValues.legendElements[1].swatchType,
      ).eq("marker");
      expect(
        stateVariables["/_legend2"].stateValues.legendElements[1].label.value,
      ).eq("point p");
    });
  });
});
