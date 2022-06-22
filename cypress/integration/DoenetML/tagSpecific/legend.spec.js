import cssesc from 'cssesc';
import { createFunctionFromDefinition } from '../../../../src/Core/utils/function';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Legend Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('legend includes unique styles, points separate', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect(stateVariables['/_legend1'].stateValues.position).eq("upperright");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(4);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("parabola and circle")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("marker")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value)
        .eq("\\(\\left( -3, 2 \\right)\\) and \\(\\left( -5, 6 \\right)\\)")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

      expect(stateVariables['/_legend1'].stateValues.legendElements[2].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.value).eq("vector")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[3].legendType).eq("marker")
      expect(stateVariables['/_legend1'].stateValues.legendElements[3].label.value).eq("\\(r^2\\)")
      expect(stateVariables['/_legend1'].stateValues.legendElements[3].label.hasLatex).eq(true);


    })
  });

  it('legend with dynamical functions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
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
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("upperright");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(1);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

    })

    cy.get('#\\/pos_input').type("upperLeft{enter}");

    cy.get('#\\/pos2').should('have.text', 'upperLeft');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("upperleft");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(1);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

    })

    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get('#\\/n2 .mjx-mrow').should('contain.text', '3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("upperleft");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(2);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value).eq("\\(\\int_a^b f(x) \\,dx\\) is it!")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

    })


    cy.get('#\\/n textarea').type("{end}{backspace}4{enter}", { force: true });

    cy.get('#\\/n2 .mjx-mrow').should('contain.text', '4')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("upperleft");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(2);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value).eq("\\(\\int_a^b f(x) \\,dx\\) is it!")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

    })


    cy.get('#\\/n textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.get('#\\/n2 .mjx-mrow').should('contain.text', '5')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("upperleft");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(3);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value).eq("\\(\\int_a^b f(x) \\,dx\\) is it!")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

      expect(stateVariables['/_legend1'].stateValues.legendElements[2].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.value).eq("only this")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.hasLatex).eq(false);

    })

    cy.get('#\\/pos_input').clear().type("LowerRight{enter}");

    cy.get('#\\/pos2').should('have.text', 'LowerRight');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("lowerright");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(3);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value).eq("\\(\\int_a^b f(x) \\,dx\\) is it!")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

      expect(stateVariables['/_legend1'].stateValues.legendElements[2].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.value).eq("only this")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.hasLatex).eq(false);

    })


    cy.get('#\\/n textarea').type("{end}{backspace}8{enter}", { force: true });

    cy.get('#\\/n2 .mjx-mrow').should('contain.text', '8')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("lowerright");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(4);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value).eq("\\(\\int_a^b f(x) \\,dx\\) is it!")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

      expect(stateVariables['/_legend1'].stateValues.legendElements[2].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.value).eq("only this")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[3].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[3].label.value).eq("\\(x^2\\)")
      expect(stateVariables['/_legend1'].stateValues.legendElements[3].label.hasLatex).eq(true);

    })


    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.get('#\\/n2 .mjx-mrow').should('contain.text', '1')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("lowerright");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(1);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

    })

    cy.get('#\\/pos_input').clear().type("lowerleft{enter}");

    cy.get('#\\/pos2').should('have.text', 'lowerleft');


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("lowerleft");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(1);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

    })



    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true });

    cy.get('#\\/n2 .mjx-mrow').should('contain.text', '10')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_legend1'].stateValues.position).eq("lowerleft");

      expect(stateVariables['/_legend1'].stateValues.legendElements.length).eq(5);

      expect(stateVariables['/_legend1'].stateValues.legendElements[0].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.value).eq("hi")
      expect(stateVariables['/_legend1'].stateValues.legendElements[0].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[1].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.value).eq("\\(\\int_a^b f(x) \\,dx\\) is it!")
      expect(stateVariables['/_legend1'].stateValues.legendElements[1].label.hasLatex).eq(true);

      expect(stateVariables['/_legend1'].stateValues.legendElements[2].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.value).eq("only this")
      expect(stateVariables['/_legend1'].stateValues.legendElements[2].label.hasLatex).eq(false);

      expect(stateVariables['/_legend1'].stateValues.legendElements[3].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[3].label.value).eq("\\(x^2\\)")
      expect(stateVariables['/_legend1'].stateValues.legendElements[3].label.hasLatex).eq(true);

      expect(stateVariables['/_legend1'].stateValues.legendElements[4].legendType).eq("line")
      expect(stateVariables['/_legend1'].stateValues.legendElements[4].label).eq(undefined)

    })


  });

});