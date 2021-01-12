import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Basic copy assignName Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('assignNames to dynamic copied sequence', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="s1"><aslist>
  <sequence assignNames="a,b" type="letters">
    <count><copy prop="value" tname="n" /></count>
  </sequence>
  </aslist></p>

  <p name="pa">a: <copy name="cpa" tname="a" /></p>
  <p name="pb">b: <copy name="cpb" tname="b" /></p>

  <p name="s2"><aslist>
  <copy name="cpall" tname="_sequence1" assignNames="a1,b1,c1" />
  </aslist></p>
  <p name="pa1">a1: <copy name="cpa1" tname="a1" /></p>
  <p name="pb1">b1: <copy name="cpb1" tname="b1" /></p>
  <p name="pc1">c1: <copy name="cpc1" tname="c1" /></p>

  <p name="s3"><aslist>
  <copy name="cpall2" tname="cpall" assignNames="a2,b2,c2,d2,e2" />
  </aslist></p>
  <p name="pa2">a2: <copy name="cpa2" tname="a2" /></p>
  <p name="pb2">b2: <copy name="cpb2" tname="b2" /></p>
  <p name="pc2">c2: <copy name="cpc2" tname="c2" /></p>
  <p name="pd2">d2: <copy name="cpd2" tname="d2" /></p>
  <p name="pe2">e2: <copy name="cpe2" tname="e2" /></p>

  <p name="s4"><aslist>
  <copy name="cpall3" tname="cpall2" assignNames="a3,b3,c3,d3" />
  </aslist></p>
  <p name="pa3">a3: <copy name="cpa3" tname="a3" /></p>
  <p name="pb3">b3: <copy name="cpb3" tname="b3" /></p>
  <p name="pc3">c3: <copy name="cpc3" tname="c3" /></p>
  <p name="pd3">d3: <copy name="cpd3" tname="d3" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/s1').should('have.text', 'a');
    cy.get('#\\/s2').should('have.text', 'a');
    cy.get('#\\/s3').should('have.text', 'a');
    cy.get('#\\/s4').should('have.text', 'a');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('not.exist');
    cy.get('#\\/b1').should('not.exist');
    cy.get('#\\/b2').should('not.exist');
    cy.get('#\\/b3').should('not.exist');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n to 2')
    cy.get('#\\/n_input').clear().type('2{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b');
    cy.get('#\\/s2').should('have.text', 'a, b');
    cy.get('#\\/s3').should('have.text', 'a, b');
    cy.get('#\\/s4').should('have.text', 'a, b');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n back to 1')
    cy.get('#\\/n_input').clear().type('1{enter}')

    cy.get('#\\/s1').should('have.text', 'a');
    cy.get('#\\/s2').should('have.text', 'a');
    cy.get('#\\/s3').should('have.text', 'a');
    cy.get('#\\/s4').should('have.text', 'a');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('not.exist');
    cy.get('#\\/b1').should('not.exist');
    cy.get('#\\/b2').should('not.exist');
    cy.get('#\\/b3').should('not.exist');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n back to 2')
    cy.get('#\\/n_input').clear().type('2{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b');
    cy.get('#\\/s2').should('have.text', 'a, b');
    cy.get('#\\/s3').should('have.text', 'a, b');
    cy.get('#\\/s4').should('have.text', 'a, b');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n to 3')
    cy.get('#\\/n_input').clear().type('3{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b, c');
    cy.get('#\\/s2').should('have.text', 'a, b, c');
    cy.get('#\\/s3').should('have.text', 'a, b, c');
    cy.get('#\\/s4').should('have.text', 'a, b, c');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('have.text', 'c');
    cy.get('#\\/c2').should('have.text', 'c');
    cy.get('#\\/c3').should('have.text', 'c');
    cy.get('#\\/pc1').should('have.text', 'c1: c');
    cy.get('#\\/pc2').should('have.text', 'c2: c');
    cy.get('#\\/pc3').should('have.text', 'c3: c');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');



    cy.log('change n back to 1 again')
    cy.get('#\\/n_input').clear().type('1{enter}')

    cy.get('#\\/s1').should('have.text', 'a');
    cy.get('#\\/s2').should('have.text', 'a');
    cy.get('#\\/s3').should('have.text', 'a');
    cy.get('#\\/s4').should('have.text', 'a');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('not.exist');
    cy.get('#\\/b1').should('not.exist');
    cy.get('#\\/b2').should('not.exist');
    cy.get('#\\/b3').should('not.exist');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n to 5')
    cy.get('#\\/n_input').clear().type('5{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b, c, d, e');
    cy.get('#\\/s2').should('have.text', 'a, b, c, d, e');
    cy.get('#\\/s3').should('have.text', 'a, b, c, d, e');
    cy.get('#\\/s4').should('have.text', 'a, b, c, d, e');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('have.text', 'c');
    cy.get('#\\/c2').should('have.text', 'c');
    cy.get('#\\/c3').should('have.text', 'c');
    cy.get('#\\/pc1').should('have.text', 'c1: c');
    cy.get('#\\/pc2').should('have.text', 'c2: c');
    cy.get('#\\/pc3').should('have.text', 'c3: c');

    cy.get('#\\/d2').should('have.text', 'd');
    cy.get('#\\/d3').should('have.text', 'd');
    cy.get('#\\/pd2').should('have.text', 'd2: d');
    cy.get('#\\/pd3').should('have.text', 'd3: d');

    cy.get('#\\/e2').should('have.text', 'e');
    cy.get('#\\/pe2').should('have.text', 'e2: e');


    cy.log('change n to 4')
    cy.get('#\\/n_input').clear().type('4{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b, c, d');
    cy.get('#\\/s2').should('have.text', 'a, b, c, d');
    cy.get('#\\/s3').should('have.text', 'a, b, c, d');
    cy.get('#\\/s4').should('have.text', 'a, b, c, d');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('have.text', 'c');
    cy.get('#\\/c2').should('have.text', 'c');
    cy.get('#\\/c3').should('have.text', 'c');
    cy.get('#\\/pc1').should('have.text', 'c1: c');
    cy.get('#\\/pc2').should('have.text', 'c2: c');
    cy.get('#\\/pc3').should('have.text', 'c3: c');

    cy.get('#\\/d2').should('have.text', 'd');
    cy.get('#\\/d3').should('have.text', 'd');
    cy.get('#\\/pd2').should('have.text', 'd2: d');
    cy.get('#\\/pd3').should('have.text', 'd3: d');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n to 10')
    cy.get('#\\/n_input').clear().type('10{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b, c, d, e, f, g, h, i, j');
    cy.get('#\\/s2').should('have.text', 'a, b, c, d, e, f, g, h, i, j');
    cy.get('#\\/s3').should('have.text', 'a, b, c, d, e, f, g, h, i, j');
    cy.get('#\\/s4').should('have.text', 'a, b, c, d, e, f, g, h, i, j');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('have.text', 'c');
    cy.get('#\\/c2').should('have.text', 'c');
    cy.get('#\\/c3').should('have.text', 'c');
    cy.get('#\\/pc1').should('have.text', 'c1: c');
    cy.get('#\\/pc2').should('have.text', 'c2: c');
    cy.get('#\\/pc3').should('have.text', 'c3: c');

    cy.get('#\\/d2').should('have.text', 'd');
    cy.get('#\\/d3').should('have.text', 'd');
    cy.get('#\\/pd2').should('have.text', 'd2: d');
    cy.get('#\\/pd3').should('have.text', 'd3: d');

    cy.get('#\\/e2').should('have.text', 'e');
    cy.get('#\\/pe2').should('have.text', 'e2: e');


    cy.log('change n back to 2 again')
    cy.get('#\\/n_input').clear().type('2{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b');
    cy.get('#\\/s2').should('have.text', 'a, b');
    cy.get('#\\/s3').should('have.text', 'a, b');
    cy.get('#\\/s4').should('have.text', 'a, b');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n to 0')
    cy.get('#\\/n_input').clear().type('0{enter}')

    cy.get('#\\/s1').should('have.text', '');
    cy.get('#\\/s2').should('have.text', '');
    cy.get('#\\/s3').should('have.text', '');
    cy.get('#\\/s4').should('have.text', '');

    cy.get('#\\/a').should('not.exist');
    cy.get('#\\/a1').should('not.exist');
    cy.get('#\\/a2').should('not.exist');
    cy.get('#\\/a3').should('not.exist');
    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: ');
    cy.get('#\\/pa2').should('have.text', 'a2: ');
    cy.get('#\\/pa3').should('have.text', 'a3: ');

    cy.get('#\\/b').should('not.exist');
    cy.get('#\\/b1').should('not.exist');
    cy.get('#\\/b2').should('not.exist');
    cy.get('#\\/b3').should('not.exist');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/c2').should('not.exist');
    cy.get('#\\/c3').should('not.exist');
    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/d2').should('not.exist');
    cy.get('#\\/d3').should('not.exist');
    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


    cy.log('change n back to 4')
    cy.get('#\\/n_input').clear().type('4{enter}')

    cy.get('#\\/s1').should('have.text', 'a, b, c, d');
    cy.get('#\\/s2').should('have.text', 'a, b, c, d');
    cy.get('#\\/s3').should('have.text', 'a, b, c, d');
    cy.get('#\\/s4').should('have.text', 'a, b, c, d');

    cy.get('#\\/a').should('have.text', 'a');
    cy.get('#\\/a1').should('have.text', 'a');
    cy.get('#\\/a2').should('have.text', 'a');
    cy.get('#\\/a3').should('have.text', 'a');
    cy.get('#\\/pa').should('have.text', 'a: a');
    cy.get('#\\/pa1').should('have.text', 'a1: a');
    cy.get('#\\/pa2').should('have.text', 'a2: a');
    cy.get('#\\/pa3').should('have.text', 'a3: a');

    cy.get('#\\/b').should('have.text', 'b');
    cy.get('#\\/b1').should('have.text', 'b');
    cy.get('#\\/b2').should('have.text', 'b');
    cy.get('#\\/b3').should('have.text', 'b');
    cy.get('#\\/pb').should('have.text', 'b: b');
    cy.get('#\\/pb1').should('have.text', 'b1: b');
    cy.get('#\\/pb2').should('have.text', 'b2: b');
    cy.get('#\\/pb3').should('have.text', 'b3: b');

    cy.get('#\\/c1').should('have.text', 'c');
    cy.get('#\\/c2').should('have.text', 'c');
    cy.get('#\\/c3').should('have.text', 'c');
    cy.get('#\\/pc1').should('have.text', 'c1: c');
    cy.get('#\\/pc2').should('have.text', 'c2: c');
    cy.get('#\\/pc3').should('have.text', 'c3: c');

    cy.get('#\\/d2').should('have.text', 'd');
    cy.get('#\\/d3').should('have.text', 'd');
    cy.get('#\\/pd2').should('have.text', 'd2: d');
    cy.get('#\\/pd3').should('have.text', 'd3: d');

    cy.get('#\\/e2').should('not.exist');
    cy.get('#\\/pe2').should('have.text', 'e2: ');


  })


});
