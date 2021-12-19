import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Parabola Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('parabola with no parameters gives y=x^2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <parabola />
    <copy prop="vertex" name="v" tname="_parabola1" />
    </graph>
    <graph name="g2">
    <copy name="p2" tname="_parabola1" />
    <copy name="v2" tname="v" />
    </graph>
    <copy name="g3" tname="g2"/>

    <copy prop="equation" name="e2" tname="p2" />

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1{prop='a'})"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1{prop='b'})"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1{prop='c'})"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2{prop='a'})"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2{prop='b'})"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2{prop='c'})"/></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let equationAnchor = cesc("#" + components["/e2"].replacements[0].componentName);
      let parabola3 = components["/g3"].replacements[0].activeChildren[0];
      let vertex3 = components["/g3"].replacements[0].activeChildren[1];



      cy.window().then(async (win) => {

        let a = 1, b = 0, c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=x2')
        })

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
        })

      })

      cy.log("Change a");
      cy.get('#\\/a textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 0, c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=−2x2')
        })

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })


      cy.log("Change b");
      cy.get('#\\/b textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=−2x2+3x')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change c");
      cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}9{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=−2x2+3x+9')
        })

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change a2");
      cy.get('#\\/a2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}0.2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = 3, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=0.2x2+3x+9')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-1.7{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=0.2x2−1.7x+9')
        })

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change c2");
      cy.get('#\\/c2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-4.5{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = -4.5;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=0.2x2−1.7x−4.5')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v2'].replacements[0].movePoint({ x: 5, y: -6 })

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex3");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await vertex3.movePoint({ x: -3, y: -2 })

        let a = 0.2;

        let vertex_x = -3;
        let vertex_y = -2;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

    })

  });

  it('parabola through no points gives y=x^2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <parabola through="" />
    <copy prop="vertex" name="v" tname="_parabola1" />
    </graph>
    <graph name="g2">
    <copy name="p2" tname="_parabola1" />
    <copy name="v2" tname="v" />
    </graph>
    <copy name="g3" tname="g2"/>

    <copy prop="equation" name="e2" tname="p2" />

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1{prop='a'})"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1{prop='b'})"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1{prop='c'})"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2{prop='a'})"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2{prop='b'})"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2{prop='c'})"/></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let equationAnchor = cesc("#" + components["/e2"].replacements[0].componentName);
      let parabola3 = components["/g3"].replacements[0].activeChildren[0];
      let vertex3 = components["/g3"].replacements[0].activeChildren[1];



      cy.window().then(async (win) => {

        let a = 1, b = 0, c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=x2')
        })

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
        })

      })

      cy.log("Change a");
      cy.get('#\\/a textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 0, c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=−2x2')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })


      cy.log("Change b");
      cy.get('#\\/b textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 0;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=−2x2+3x')
        })

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change c");
      cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}9{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=−2x2+3x+9')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change a2");
      cy.get('#\\/a2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}0.2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = 3, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=0.2x2+3x+9')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-1.7{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=0.2x2−1.7x+9')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change c2");
      cy.get('#\\/c2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-4.5{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = -4.5;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.get(equationAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('y=0.2x2−1.7x−4.5')
        })


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v2'].replacements[0].movePoint({ x: 5, y: -6 })

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex3");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await vertex3.movePoint({ x: -3, y: -2 })

        let a = 0.2;

        let vertex_x = -3;
        let vertex_y = -2;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

    })

  });

  it('parabola through one point uses it as vertex', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <parabola through="$_point1"/>
    <copy prop="vertex" name="v" tname="_parabola1" />
    </graph>
    <graph name="g2">
    <copy name="p2" tname="_parabola1" />
    <copy name="v2" tname="v" />
    </graph>
    <copy name="g3" tname="g2"/>

    <copy prop="equation" name="e2" tname="p2" />

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1{prop='a'})"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1{prop='b'})"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1{prop='c'})"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2{prop='a'})"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2{prop='b'})"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2{prop='c'})"/></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parabola3 = components["/g3"].replacements[0].activeChildren[0];
      let vertex3 = components["/g3"].replacements[0].activeChildren[1];



      cy.window().then(async (win) => {

        let a = 1, b = -2, c = 3;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
        })

      })

      cy.log("Change a");
      cy.get('#\\/a textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = -2, c = 3;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })


      cy.log("Change b");
      cy.get('#\\/b textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 3;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change c");
      cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}9{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change a2");
      cy.get('#\\/a2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}0.2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = 3, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-1.7{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = 9;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("Change c2");
      cy.get('#\\/c2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-4.5{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = -4.5;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v2'].replacements[0].movePoint({ x: 5, y: -6 })

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })


      cy.log("move point defining vertex");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        await components['/_point1'].movePoint({ x: 2, y: 6 });

        let a = 0.2;

        let vertex_x = 2;
        let vertex_y = 6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_point1'].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);

        })
      })


    })

  });

  it('parabola through two points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <parabola through="$_point1 $_point2"/>
    <copy prop="vertex" name="v" tname="_parabola1" />
    </graph>
    <graph name="g2">
    <copy name="p2" tname="_parabola1" />
    <copy name="v2" tname="v" />
    </graph>
    <copy name="g3" tname="g2"/>

    <copy prop="equation" name="e2" tname="p2" />

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1{prop='a'})"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1{prop='b'})"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1{prop='c'})"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2{prop='a'})"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2{prop='b'})"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2{prop='c'})"/></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parabola3 = components["/g3"].replacements[0].activeChildren[0];
      let vertex3 = components["/g3"].replacements[0].activeChildren[1];



      cy.window().then(async (win) => {

        let x1 = 1, x2 = 3;
        let y1 = 2, y2 = 4;

        let a = 1;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
        })

      })

      cy.log("Change a");
      cy.get('#\\/a textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // first calculate old values of parameters
        let x1 = 1, x2 = 3;
        let y1 = 2, y2 = 4;

        let a = 1;
        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        a = -2;

        // revise y1 and y2 for new value of a
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })


      cy.log("Change b");
      cy.get('#\\/b textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // first calculate old values of parameters
        let x1 = 1, x2 = 3;
        let y1 = 2, y2 = 4;

        let a = 1;
        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        a = -2, b = 3;

        // revise y1 and y2 for new values of a and b
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("Change c");
      cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}9{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("Change a2");
      cy.get('#\\/a2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}0.2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = 3, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-1.7{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("Change c2");
      cy.get('#\\/c2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-4.5{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = -4.5;

        // calculate point locations
        let x1 = 1, x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1, x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v2'].replacements[0].movePoint({ x: 5, y: -6 })

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1, x2 = 3;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })


      cy.log("move both points");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);


        let x1 = -4, x2 = 0;
        let y1 = 7, y2 = -2;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("move points on top of each other, become vertex");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 3;
        let y1 = -9, y2 = -9;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let vertex_x = x1;
        let vertex_y = y1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("move points above each other, parabola undefined");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -4, x2 = -4;
        let y1 = -9, y2 = 1;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });


        cy.window().then(async (win) => {
          assert.isNaN(components['/_parabola1'].stateValues.a);
          assert.isNaN(components['/_parabola1'].stateValues.b);
          assert.isNaN(components['/_parabola1'].stateValues.c);
          expect((await components['/_parabola1'].stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq("\uff3f");
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq("\uff3f");
          assert.isNaN(components['/p2'].replacements[0].stateValues.a);
          assert.isNaN(components['/p2'].replacements[0].stateValues.b);
          assert.isNaN(components['/p2'].replacements[0].stateValues.c);
          expect((await components['/p2'].replacements[0].stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq("\uff3f");
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq("\uff3f");
          assert.isNaN(parabola3.stateValues.a);
          assert.isNaN(parabola3.stateValues.b);
          assert.isNaN(parabola3.stateValues.c);
          expect((await parabola3.stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await vertex3.stateValues.xs)[0].tree).eq("\uff3f")
          expect((await vertex3.stateValues.xs)[1].tree).eq("\uff3f")
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })

      cy.log("move points apart");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 4, x2 = -6;
        let y1 = 5, y2 = 8;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);

        })
      })


    })

  });

  it('parabola through three points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <point>(1,2)</point>
    <point>(3,4)</point>
    <point>(5,6)</point>
    <parabola through="$_point1 $_point2 $_point3"/>
    <copy prop="vertex" name="v" tname="_parabola1" />
    </graph>
    <graph name="g2">
    <copy name="p2" tname="_parabola1" />
    <copy name="v2" tname="v" />
    </graph>
    <copy name="g3" tname="g2"/>

    <copy prop="equation" name="e2" tname="p2" />

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1{prop='a'})"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1{prop='b'})"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1{prop='c'})"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2{prop='a'})"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2{prop='b'})"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2{prop='c'})"/></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parabola3 = components["/g3"].replacements[0].activeChildren[0];
      let vertex3 = components["/g3"].replacements[0].activeChildren[1];

      cy.window().then(async (win) => {

        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = 2, y2 = 4, y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].tree).eq('\uff3f');
          expect((await components['/_parabola1'].stateValues.vertex)[1].tree).eq('\uff3f');
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq('\uff3f');
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq('\uff3f');
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].tree).eq('\uff3f');
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].tree).eq('\uff3f');
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq('\uff3f');
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq('\uff3f');
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].tree).eq('\uff3f');
          expect((await parabola3.stateValues.vertex)[1].tree).eq('\uff3f');
          expect((await vertex3.stateValues.xs)[0].tree).eq('\uff3f');
          expect((await vertex3.stateValues.xs)[1].tree).eq('\uff3f');
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);
        })

      })

      cy.log("Change a");
      cy.get('#\\/a textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // first calculate old values of parameters
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = 2, y2 = 4, y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        a = -2;

        // revise ys for new value of a
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change b");
      cy.get('#\\/b textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // first calculate old values of parameters
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = 2, y2 = 4, y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        a = -2, b = 3;

        // revise ys for new values of a and b
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change c");
      cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}9{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change a2");
      cy.get('#\\/a2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}0.2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = 3, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-1.7{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change c2");
      cy.get('#\\/c2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-4.5{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = -4.5;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v2'].replacements[0].movePoint({ x: 5, y: -6 })

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move all points");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -4, x2 = 0, x3 = -9;
        let y1 = 7, y2 = -2, y3 = -2;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });
        await components['/_point3'].movePoint({ x: x3, y: y3 });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move points on top of each other, become vertex");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 3, x3 = 3;
        let y1 = -9, y2 = -9, y3 = -9;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });
        await components['/_point3'].movePoint({ x: x3, y: y3 });

        let a = 0.2;

        let vertex_x = x1;
        let vertex_y = y1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move one point apart");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 3, x3 = 4;
        let y1 = -9, y2 = -9, y3 = -9;

        await components['/_point3'].movePoint({ x: x3, y: y3 });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);


        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("change point grouping");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 4, x3 = 4;
        let y1 = -9, y2 = -9, y3 = -9;

        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);


        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("change point grouping again");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 4, x2 = 6, x3 = 4;
        let y1 = -9, y2 = 3, y3 = -9;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);


        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move points above each other, parabola undefined");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -4, x2 = -4, x3 = 0;
        let y1 = -9, y2 = 1, y3 = 1;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });
        await components['/_point3'].movePoint({ x: x3, y: y3 });


        cy.window().then(async (win) => {
          assert.isNaN(components['/_parabola1'].stateValues.a);
          assert.isNaN(components['/_parabola1'].stateValues.b);
          assert.isNaN(components['/_parabola1'].stateValues.c);
          expect((await components['/_parabola1'].stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq("\uff3f");
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq("\uff3f");
          assert.isNaN(components['/p2'].replacements[0].stateValues.a);
          assert.isNaN(components['/p2'].replacements[0].stateValues.b);
          assert.isNaN(components['/p2'].replacements[0].stateValues.c);
          expect((await components['/p2'].replacements[0].stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq("\uff3f");
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq("\uff3f");
          assert.isNaN(parabola3.stateValues.a);
          assert.isNaN(parabola3.stateValues.b);
          assert.isNaN(parabola3.stateValues.c);
          expect((await parabola3.stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await vertex3.stateValues.xs)[0].tree).eq("\uff3f")
          expect((await vertex3.stateValues.xs)[1].tree).eq("\uff3f")
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move points apart");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -5, x2 = -4, x3 = 0;
        let y1 = -9, y2 = 1, y3 = 1;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })


    })

  });

  // test unfinished
  it.skip('parabola through variable number of points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="n" prefill="1" /></p>
    <graph>
    <parabola><through hide="false">
      <map>
        <template>
          <point>($i+<math>0</math>, $m+<math>0</math>)</point>
        </template>
        <sources alias="m" indexAlias="i">
          <sequence step="2"><count><copy prop="value" tname="n" /></count></sequence>
        </sources>
      </map>
    </through></parabola>
    <copy prop="vertex" name="v" tname="_parabola1" />
    </graph>
    <graph name="g2">
    <copy name="p2" tname="_parabola1" />
    <copy name="v2" tname="v" />
    </graph>
    <copy name="g3" tname="g2"/>

    <p>a = <mathinput name="a" bindValueTo="$(_parabola1{prop='a'})"/></p>
    <p>b = <mathinput name="b" bindValueTo="$(_parabola1{prop='b'})"/></p>
    <p>c = <mathinput name="c" bindValueTo="$(_parabola1{prop='c'})"/></p>

    <p>a2 = <mathinput name="a2" bindValueTo="$(p2{prop='a'})"/></p>
    <p>b2 = <mathinput name="b2" bindValueTo="$(p2{prop='b'})"/></p>
    <p>c2 = <mathinput name="c2" bindValueTo="$(p2{prop='c'})"/></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let parabola3 = components["/g3"].replacements[0].activeChildren[0];
      let vertex3 = components["/g3"].replacements[0].activeChildren[1];

      cy.window().then(async (win) => {

        let a = 1, b = -2, c = 2;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/_parabola1'].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await parabola3.stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await vertex3.stateValues.xs)[0].tree).eq(vertex_x);
          expect((await vertex3.stateValues.xs)[1].tree).eq(vertex_y);
        })

      })

      cy.log("Change a");
      cy.get('#\\/a textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-2{enter}", { force: true });


      cy.window().then(async (win) => {

        let a = -2, b = -2, c = 2;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/_parabola1'].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await parabola3.stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await vertex3.stateValues.xs)[0].tree).eq(vertex_x);
          expect((await vertex3.stateValues.xs)[1].tree).eq(vertex_y);
        })

      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {

        let a = -2, b = 3, c = 2;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/_parabola1'].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await parabola3.stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await vertex3.stateValues.xs)[0].tree).eq(vertex_x);
          expect((await vertex3.stateValues.xs)[1].tree).eq(vertex_y);
        })

      })


      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = -2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/_parabola1'].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await parabola3.stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await vertex3.stateValues.xs)[0].tree).eq(vertex_x);
          expect((await vertex3.stateValues.xs)[1].tree).eq(vertex_y);
        })

      })


      cy.log("Add a second point");
      cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}2{enter}", { force: true });


      cy.window().then(async (win) => {

        let a = -2;

        let x1 = -2, x2 = 2;
        let y1 = 1, y2 = 3;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/_parabola1'].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq(vertex_x);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq(vertex_y);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.vertex)[0].tree).eq(vertex_x);
          expect((await parabola3.stateValues.vertex)[1].tree).eq(vertex_y);
          expect((await vertex3.stateValues.xs)[0].tree).eq(vertex_x);
          expect((await vertex3.stateValues.xs)[1].tree).eq(vertex_y);
        })

      })


      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // first calculate old values of parameters
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = 2, y2 = 4, y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        a = -2;

        // revise ys for new value of a
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change b");
      cy.get('#\\/b textarea').type("{end}{backspace}{backspace}{backspace}{backspace}3{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        // first calculate old values of parameters
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = 2, y2 = 4, y3 = 6;

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        a = -2, b = 3;

        // revise ys for new values of a and b
        y1 = a * x1 ** 2 + b * x1 + c;
        y2 = a * x2 ** 2 + b * x2 + c;
        y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change c");
      cy.get('#\\/c textarea').type("{end}{backspace}{backspace}{backspace}{backspace}9{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = -2, b = 3, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change a2");
      cy.get('#\\/a2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}0.2{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = 3, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change b2");
      cy.get('#\\/b2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-1.7{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = 9;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("Change c2");
      cy.get('#\\/c2 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-4.5{enter}", { force: true });

      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        let a = 0.2, b = -1.7, c = -4.5;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move vertex1");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v'].replacements[0].movePoint({ x: -2, y: 1 })

        let a = 0.2;

        let vertex_x = -2;
        let vertex_y = 1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move vertex2");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);
        await components['/v2'].replacements[0].movePoint({ x: 5, y: -6 })

        let a = 0.2;

        let vertex_x = 5;
        let vertex_y = -6;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        // calculate point locations
        let x1 = 1, x2 = 3, x3 = 5;
        let y1 = a * x1 ** 2 + b * x1 + c;
        let y2 = a * x2 ** 2 + b * x2 + c;
        let y3 = a * x3 ** 2 + b * x3 + c;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move all points");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -4, x2 = 0, x3 = -9;
        let y1 = 7, y2 = -2, y3 = -2;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });
        await components['/_point3'].movePoint({ x: x3, y: y3 });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move points on top of each other, become vertex");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 3, x3 = 3;
        let y1 = -9, y2 = -9, y3 = -9;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });
        await components['/_point3'].movePoint({ x: x3, y: y3 });

        let a = 0.2;

        let vertex_x = x1;
        let vertex_y = y1;

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move one point apart");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 3, x3 = 4;
        let y1 = -9, y2 = -9, y3 = -9;

        await components['/_point3'].movePoint({ x: x3, y: y3 });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);


        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("change point grouping");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 3, x2 = 4, x3 = 4;
        let y1 = -9, y2 = -9, y3 = -9;

        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let b = (y1 - y3 - a * (x1 ** 2 - x3 ** 2)) / (x1 - x3);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);


        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("change point grouping again");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = 4, x2 = 6, x3 = 4;
        let y1 = -9, y2 = 3, y3 = -9;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let a = 0.2;

        let b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
        let c = y1 - a * x1 ** 2 - b * x1;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);


        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move points above each other, parabola undefined");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -4, x2 = -4, x3 = 0;
        let y1 = -9, y2 = 1, y3 = 1;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });
        await components['/_point3'].movePoint({ x: x3, y: y3 });


        cy.window().then(async (win) => {
          assert.isNaN(components['/_parabola1'].stateValues.a);
          assert.isNaN(components['/_parabola1'].stateValues.b);
          assert.isNaN(components['/_parabola1'].stateValues.c);
          expect((await components['/_parabola1'].stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].tree).eq("\uff3f");
          expect((await components['/v'].replacements[0].stateValues.xs)[1].tree).eq("\uff3f");
          assert.isNaN(components['/p2'].replacements[0].stateValues.a);
          assert.isNaN(components['/p2'].replacements[0].stateValues.b);
          assert.isNaN(components['/p2'].replacements[0].stateValues.c);
          expect((await components['/p2'].replacements[0].stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].tree).eq("\uff3f");
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].tree).eq("\uff3f");
          assert.isNaN(parabola3.stateValues.a);
          assert.isNaN(parabola3.stateValues.b);
          assert.isNaN(parabola3.stateValues.c);
          expect((await parabola3.stateValues.vertex).map(x => x.tree)).eqls(["\uff3f", "\uff3f"]);
          expect((await vertex3.stateValues.xs)[0].tree).eq("\uff3f")
          expect((await vertex3.stateValues.xs)[1].tree).eq("\uff3f")
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })

      cy.log("move points apart");
      cy.window().then(async (win) => {
        let components = Object.assign({}, win.state.components);

        let x1 = -5, x2 = -4, x3 = 0;
        let y1 = -9, y2 = 1, y3 = 1;

        await components['/_point1'].movePoint({ x: x1, y: y1 });
        await components['/_point2'].movePoint({ x: x2, y: y2 });

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        let a = (z1 * v2 - z2 * v1) / det;
        let b = (z2 * u1 - z1 * u2) / det;
        let c = y1 - b * x1 - a * x12;

        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);


        cy.window().then(async (win) => {

          expect(components['/_parabola1'].stateValues.a).closeTo(a, 1E-12);
          expect(components['/_parabola1'].stateValues.b).closeTo(b, 1E-12);
          expect(components['/_parabola1'].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/_parabola1'].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/_parabola1'].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/_parabola1'].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.a).closeTo(a, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.b).closeTo(b, 1E-12);
          expect(components['/p2'].replacements[0].stateValues.c).closeTo(c, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.equation).equals(equationExpression)).eq(true);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/p2'].replacements[0].stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await components['/v2'].replacements[0].stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect(components['/e2'].replacements[0].stateValues.value.equals(equationExpression)).eq(true);
          expect(parabola3.stateValues.a).closeTo(a, 1E-12);
          expect(parabola3.stateValues.b).closeTo(b, 1E-12);
          expect(parabola3.stateValues.c).closeTo(c, 1E-12);
          expect((await parabola3.stateValues.equation).equals(equationExpression)).eq(true);
          expect((await parabola3.stateValues.vertex)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await parabola3.stateValues.vertex)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await vertex3.stateValues.xs)[0].evaluate_numbers().tree).closeTo(vertex_x, 1E-12);
          expect((await vertex3.stateValues.xs)[1].evaluate_numbers().tree).closeTo(vertex_y, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x1, 1E-12);
          expect((await components["/_point1"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y1, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x2, 1E-12);
          expect((await components["/_point2"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y2, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[0].evaluate_numbers().tree).closeTo(x3, 1E-12);
          expect((await components["/_point3"].stateValues.xs)[1].evaluate_numbers().tree).closeTo(y3, 1E-12);

        })
      })


    })

  });


  it('constrain to parabola', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <parabola through="(1,2)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" tname="p" />
      <copy assignNames="A2" tname="A" />
    </graph>
    <copy assignNames="g3" tname="g2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let f_p = x => (x - 1) ** 2 + 2;

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let A3 = components["/g3"].activeChildren[1];

      let [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      let [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      let [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(0)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A"].movePoint({ x: 9, y: -2 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(9)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A2"].movePoint({ x: -9, y: 4 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(-9)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 0.9, y: 9 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(0.9)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 1.1, y: 9 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(1.11)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)


    })





  });


  it('constrain to parabola opening downward', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <parabola through="(1,-2) (2,-3) (0,-3)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" tname="p" />
      <copy assignNames="A2" tname="A" />
    </graph>
    <copy assignNames="g3" tname="g2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let f_p = x => -((x - 1) ** 2 + 2);

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let A3 = components["/g3"].activeChildren[1];

      let [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      let [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      let [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(0)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A"].movePoint({ x: 9, y: 2 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(9)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A2"].movePoint({ x: -9, y: -4 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(-9)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 0.9, y: -9 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(0.9)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 1.1, y: -9 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(1.11)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)


    })





  });


  it('constrain to parabola that is a line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
    <parabola through="(1,2) (3,3) (5, 4)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" tname="p" />
      <copy assignNames="A2" tname="A" />
    </graph>
    <copy assignNames="g3" tname="g2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let f_p = x => 0.5*x + 1.5;

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let A3 = components["/g3"].activeChildren[1];

      let [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      let [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      let [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).closeTo(1.5/-2.5, 1E-14)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A"].movePoint({ x: 9, y: -2 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).closeTo((1.5-2*9+2)/-2.5, 1E-14)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A2"].movePoint({ x: -9, y: 4 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).closeTo((1.5+2*9-4)/-2.5, 1E-14)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 0.9, y: 9 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).closeTo((1.5-2*0.9-9)/-2.5, 1E-14)
      expect(x2).closeTo(f_p(x1), 1E-14);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

    })


  });


  it('constrain to parabola opening downward, different axis scales', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph ymin="-1000" ymax="1000">
    <parabola through="(1,-200) (2,-300) (0,-300)" name="p" />
    <point x="0" y="0" name="A">
      <constraints>
        <constrainTo>$p</constrainTo>
      </constraints>
    </point>
    </graph>
    <graph name="g2">
      <copy assignNames="p2" tname="p" />
      <copy assignNames="A2" tname="A" />
    </graph>
    <copy assignNames="g3" tname="g2"/>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let f_p = x => -100*((x - 1) ** 2 + 2);

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let A3 = components["/g3"].activeChildren[1];

      let [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      let [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      let [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(0)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A"].movePoint({ x: 9, y: 200 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(9)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A2"].movePoint({ x: -9, y: -400 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(-9)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 0.9, y: -900 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(0.9)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await A3.movePoint({ x: 1.1, y: -900 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(1.11)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)

      await components["/A"].movePoint({ x: 9, y: 0 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).greaterThan(2)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)


      await components["/A2"].movePoint({ x: -9, y: 100 });
      [x1, x2] = components["/A"].stateValues.xs.map(x => x.tree);
      [x12, x22] = components["/A2"].stateValues.xs.map(x => x.tree);
      [x13, x23] = A3.stateValues.xs.map(x => x.tree);
      expect(x1).lessThan(0)
      expect(x2).closeTo(f_p(x1), 1E-12);
      expect(x12).eq(x1)
      expect(x13).eq(x1)
      expect(x22).eq(x2)
      expect(x23).eq(x2)


    })





  });

});
