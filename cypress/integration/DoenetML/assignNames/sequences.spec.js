import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('sequence and map assignName Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('assignNames to dynamic copied sequence', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="s1"><aslist>
  <sequence assignNames="a b" type="letters" length="$n" />
  </aslist></p>

  <p name="pa">a: <copy name="cpa" target="a" /></p>
  <p name="pb">b: <copy name="cpb" target="b" /></p>

  <p name="s2"><aslist>
  <copy name="cpall" target="_sequence1" assignNames="a1 b1 c1" />
  </aslist></p>
  <p name="pa1">a1: <copy name="cpa1" target="a1" /></p>
  <p name="pb1">b1: <copy name="cpb1" target="b1" /></p>
  <p name="pc1">c1: <copy name="cpc1" target="c1" /></p>

  <p name="s3"><aslist>
  <copy name="cpall2" target="cpall" assignNames="a2 b2 c2 d2 e2" />
  </aslist></p>
  <p name="pa2">a2: <copy name="cpa2" target="a2" /></p>
  <p name="pb2">b2: <copy name="cpb2" target="b2" /></p>
  <p name="pc2">c2: <copy name="cpc2" target="c2" /></p>
  <p name="pd2">d2: <copy name="cpd2" target="d2" /></p>
  <p name="pe2">e2: <copy name="cpe2" target="e2" /></p>

  <p name="s4"><aslist>
  <copy name="cpall3" target="cpall2" assignNames="a3 b3 c3 d3" />
  </aslist></p>
  <p name="pa3">a3: <copy name="cpa3" target="a3" /></p>
  <p name="pb3">b3: <copy name="cpb3" target="b3" /></p>
  <p name="pc3">c3: <copy name="cpc3" target="c3" /></p>
  <p name="pd3">d3: <copy name="cpd3" target="d3" /></p>
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
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}5{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}4{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}10{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}{backspace}2{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}0{enter}', { force: true })

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
    cy.get('#\\/n textarea').type('{end}{backspace}4{enter}', { force: true })

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

  it('assignNames to dynamic copied map of sequence', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1"><map assignNames="a b">
    <template newNamespace>Letter <copy target="i" name="n" /> is <copy target="l" name="v" />. </template>
    <sources alias="l" indexAlias="i">
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>

  <p name="pa">a: <copy name="cpa" target="a" /></p>
  <p name="pb">b: <copy name="cpb" target="b" /></p>

  <p name="pan">a/n: <copy name="cpan" target="a/n" /></p>
  <p name="pbn">b/n: <copy name="cpbn" target="b/n" /></p>

  <p name="pav">a/v: <copy name="cpav" target="a/v" /></p>
  <p name="pbv">b/v: <copy name="cpbv" target="b/v" /></p>


  <p name="m2"><copy name="cpall" target="_map1" assignNames="a1 b1 c1" /></p>
  <p name="pa1">a1: <copy name="cpa1" target="a1" /></p>
  <p name="pb1">b1: <copy name="cpb1" target="b1" /></p>
  <p name="pc1">c1: <copy name="cpc1" target="c1" /></p>

  <p name="pan1">a1/n: <copy name="cpan1" target="a1/n" /></p>
  <p name="pbn1">b1/n: <copy name="cpbn1" target="b1/n" /></p>
  <p name="pcn1">c1/n: <copy name="cpcn1" target="c1/n" /></p>

  <p name="pav1">a1/v: <copy name="cpav1" target="a1/v" /></p>
  <p name="pbv1">b1/v: <copy name="cpbv1" target="b1/v" /></p>
  <p name="pcv1">c1/v: <copy name="cpcv1" target="c1/v" /></p>


  <p name="m3"><copy name="cpall2" target="cpall" assignNames="a2 b2 c2 d2 e2" /></p>
  <p name="pa2">a2: <copy name="cpa2" target="a2" /></p>
  <p name="pb2">b2: <copy name="cpb2" target="b2" /></p>
  <p name="pc2">c2: <copy name="cpc2" target="c2" /></p>
  <p name="pd2">d2: <copy name="cpd2" target="d2" /></p>
  <p name="pe2">e2: <copy name="cpe2" target="e2" /></p>
  
  <p name="pan2">a2/n: <copy name="cpan2" target="a2/n" /></p>
  <p name="pbn2">b2/n: <copy name="cpbn2" target="b2/n" /></p>
  <p name="pcn2">c2/n: <copy name="cpcn2" target="c2/n" /></p>
  <p name="pdn2">d2/n: <copy name="cpdn2" target="d2/n" /></p>
  <p name="pen2">e2/n: <copy name="cpen2" target="e2/n" /></p>

  <p name="pav2">a2/v: <copy name="cpav2" target="a2/v" /></p>
  <p name="pbv2">b2/v: <copy name="cpbv2" target="b2/v" /></p>
  <p name="pcv2">c2/v: <copy name="cpcv2" target="c2/v" /></p>
  <p name="pdv2">d2/v: <copy name="cpdv2" target="d2/v" /></p>
  <p name="pev2">e2/v: <copy name="cpev2" target="e2/v" /></p>


  <p name="m4"><copy name="cpall3" target="cpall2" assignNames="a3 b3 c3 d3" /></p>
  <p name="pa3">a3: <copy name="cpa3" target="a3" /></p>
  <p name="pb3">b3: <copy name="cpb3" target="b3" /></p>
  <p name="pc3">c3: <copy name="cpc3" target="c3" /></p>
  <p name="pd3">d3: <copy name="cpd3" target="d3" /></p>

  <p name="pan3">a3/n: <copy name="cpan3" target="a3/n" /></p>
  <p name="pbn3">b3/n: <copy name="cpbn3" target="b3/n" /></p>
  <p name="pcn3">c3/n: <copy name="cpcn3" target="c3/n" /></p>
  <p name="pdn3">d3/n: <copy name="cpdn3" target="d3/n" /></p>

  <p name="pav3">a3/v: <copy name="cpav3" target="a3/v" /></p>
  <p name="pbv3">b3/v: <copy name="cpbv3" target="b3/v" /></p>
  <p name="pcv3">c3/v: <copy name="cpcv3" target="c3/v" /></p>
  <p name="pdv3">d3/v: <copy name="cpdv3" target="d3/v" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/pbn').should('have.text', 'b/n: ');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: ');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: ');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: ');

    cy.get('#\\/pbv').should('have.text', 'b/v: ');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: ');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: ');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: ');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n to 2')
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n back to 1')
    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/pbn').should('have.text', 'b/n: ');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: ');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: ');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: ');

    cy.get('#\\/pbv').should('have.text', 'b/v: ');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: ');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: ');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: ');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');


    cy.log('change n back to 2')
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n to 3')
    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');
    cy.get('#\\/pc2').should('have.text', 'c2: Letter 3 is c. ');
    cy.get('#\\/pc3').should('have.text', 'c3: Letter 3 is c. ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: 3');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: 3');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: 3');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: c');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: c');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: c');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n back to 1 again')
    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/pbn').should('have.text', 'b/n: ');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: ');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: ');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: ');

    cy.get('#\\/pbv').should('have.text', 'b/v: ');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: ');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: ');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: ');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n to 5')
    cy.get('#\\/n textarea').type('{end}{backspace}5{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');
    cy.get('#\\/pc2').should('have.text', 'c2: Letter 3 is c. ');
    cy.get('#\\/pc3').should('have.text', 'c3: Letter 3 is c. ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: 3');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: 3');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: 3');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: c');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: c');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: c');


    cy.get('#\\/pd2').should('have.text', 'd2: Letter 4 is d. ');
    cy.get('#\\/pd3').should('have.text', 'd3: Letter 4 is d. ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: 4');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: 4');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: d');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: d');


    cy.get('#\\/pe2').should('have.text', 'e2: Letter 5 is e. ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: 5');

    cy.get('#\\/pev2').should('have.text', 'e2/v: e');



    cy.log('change n to 4')
    cy.get('#\\/n textarea').type('{end}{backspace}4{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');
    cy.get('#\\/pc2').should('have.text', 'c2: Letter 3 is c. ');
    cy.get('#\\/pc3').should('have.text', 'c3: Letter 3 is c. ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: 3');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: 3');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: 3');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: c');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: c');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: c');


    cy.get('#\\/pd2').should('have.text', 'd2: Letter 4 is d. ');
    cy.get('#\\/pd3').should('have.text', 'd3: Letter 4 is d. ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: 4');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: 4');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: d');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: d');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n to 10')
    cy.get('#\\/n textarea').type('{end}{backspace}10{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. Letter 6 is f. Letter 7 is g. Letter 8 is h. Letter 9 is i. Letter 10 is j. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');
    cy.get('#\\/pc2').should('have.text', 'c2: Letter 3 is c. ');
    cy.get('#\\/pc3').should('have.text', 'c3: Letter 3 is c. ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: 3');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: 3');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: 3');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: c');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: c');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: c');


    cy.get('#\\/pd2').should('have.text', 'd2: Letter 4 is d. ');
    cy.get('#\\/pd3').should('have.text', 'd3: Letter 4 is d. ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: 4');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: 4');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: d');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: d');


    cy.get('#\\/pe2').should('have.text', 'e2: Letter 5 is e. ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: 5');

    cy.get('#\\/pev2').should('have.text', 'e2/v: e');



    cy.log('change n back to 2 again')
    cy.get('#\\/n textarea').type('{end}{backspace}{backspace}2{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n to 0')
    cy.get('#\\/n textarea').type('{end}{backspace}0{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', '');
    cy.get('#\\/m2').should('have.text', '');
    cy.get('#\\/m3').should('have.text', '');
    cy.get('#\\/m4').should('have.text', '');


    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: ');
    cy.get('#\\/pa2').should('have.text', 'a2: ');
    cy.get('#\\/pa3').should('have.text', 'a3: ');

    cy.get('#\\/pan').should('have.text', 'a/n: ');
    cy.get('#\\/pan1').should('have.text', 'a1/n: ');
    cy.get('#\\/pan2').should('have.text', 'a2/n: ');
    cy.get('#\\/pan3').should('have.text', 'a3/n: ');

    cy.get('#\\/pav').should('have.text', 'a/v: ');
    cy.get('#\\/pav1').should('have.text', 'a1/v: ');
    cy.get('#\\/pav2').should('have.text', 'a2/v: ');
    cy.get('#\\/pav3').should('have.text', 'a3/v: ');


    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');
    cy.get('#\\/pb2').should('have.text', 'b2: ');
    cy.get('#\\/pb3').should('have.text', 'b3: ');

    cy.get('#\\/pbn').should('have.text', 'b/n: ');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: ');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: ');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: ');

    cy.get('#\\/pbv').should('have.text', 'b/v: ');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: ');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: ');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: ');


    cy.get('#\\/pc1').should('have.text', 'c1: ');
    cy.get('#\\/pc2').should('have.text', 'c2: ');
    cy.get('#\\/pc3').should('have.text', 'c3: ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: ');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: ');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: ');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: ');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: ');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: ');


    cy.get('#\\/pd2').should('have.text', 'd2: ');
    cy.get('#\\/pd3').should('have.text', 'd3: ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: ');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: ');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: ');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: ');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');



    cy.log('change n back to 4')
    cy.get('#\\/n textarea').type('{end}{backspace}4{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');
    cy.get('#\\/m3').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');
    cy.get('#\\/m4').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. ');


    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');
    cy.get('#\\/pa2').should('have.text', 'a2: Letter 1 is a. ');
    cy.get('#\\/pa3').should('have.text', 'a3: Letter 1 is a. ');

    cy.get('#\\/pan').should('have.text', 'a/n: 1');
    cy.get('#\\/pan1').should('have.text', 'a1/n: 1');
    cy.get('#\\/pan2').should('have.text', 'a2/n: 1');
    cy.get('#\\/pan3').should('have.text', 'a3/n: 1');

    cy.get('#\\/pav').should('have.text', 'a/v: a');
    cy.get('#\\/pav1').should('have.text', 'a1/v: a');
    cy.get('#\\/pav2').should('have.text', 'a2/v: a');
    cy.get('#\\/pav3').should('have.text', 'a3/v: a');


    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');
    cy.get('#\\/pb2').should('have.text', 'b2: Letter 2 is b. ');
    cy.get('#\\/pb3').should('have.text', 'b3: Letter 2 is b. ');

    cy.get('#\\/pbn').should('have.text', 'b/n: 2');
    cy.get('#\\/pbn1').should('have.text', 'b1/n: 2');
    cy.get('#\\/pbn2').should('have.text', 'b2/n: 2');
    cy.get('#\\/pbn3').should('have.text', 'b3/n: 2');

    cy.get('#\\/pbv').should('have.text', 'b/v: b');
    cy.get('#\\/pbv1').should('have.text', 'b1/v: b');
    cy.get('#\\/pbv2').should('have.text', 'b2/v: b');
    cy.get('#\\/pbv3').should('have.text', 'b3/v: b');


    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');
    cy.get('#\\/pc2').should('have.text', 'c2: Letter 3 is c. ');
    cy.get('#\\/pc3').should('have.text', 'c3: Letter 3 is c. ');

    cy.get('#\\/pcn1').should('have.text', 'c1/n: 3');
    cy.get('#\\/pcn2').should('have.text', 'c2/n: 3');
    cy.get('#\\/pcn3').should('have.text', 'c3/n: 3');

    cy.get('#\\/pcv1').should('have.text', 'c1/v: c');
    cy.get('#\\/pcv2').should('have.text', 'c2/v: c');
    cy.get('#\\/pcv3').should('have.text', 'c3/v: c');


    cy.get('#\\/pd2').should('have.text', 'd2: Letter 4 is d. ');
    cy.get('#\\/pd3').should('have.text', 'd3: Letter 4 is d. ');

    cy.get('#\\/pdn2').should('have.text', 'd2/n: 4');
    cy.get('#\\/pdn3').should('have.text', 'd3/n: 4');

    cy.get('#\\/pdv2').should('have.text', 'd2/v: d');
    cy.get('#\\/pdv3').should('have.text', 'd3/v: d');


    cy.get('#\\/pe2').should('have.text', 'e2: ');

    cy.get('#\\/pen2').should('have.text', 'e2/n: ');

    cy.get('#\\/pev2').should('have.text', 'e2/v: ');


  })

  it('copy source and index assign names', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1"><map assignNames="a b">
    <template newNamespace>Letter <copy target="i" assignNames="n1 n2" /> is <copy target="m" assignnames="v1  v2" />. </template>
    <sources alias="m" indexAlias="i">
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>


  <p name="pa">a: <copy name="cpa" target="a" /></p>
  <p name="pb">b: <copy name="cpb" target="b" /></p>

  <p name="pan1">a/n1: <copy name="cpan1" target="a/n1" /></p>
  <p name="pbn1">b/n1: <copy name="cpbn1" target="b/n1" /></p>
  <p name="pan2">a/n2: <copy name="cpan2" target="a/n2" /></p>
  <p name="pbn2">b/n2: <copy name="cpbn2" target="b/n2" /></p>

  <p name="pav1">a/v1: <copy name="cpav1" target="a/v1" /></p>
  <p name="pbv1">b/v1: <copy name="cpbv1" target="b/v1" /></p>
  <p name="pav2">a/v2: <copy name="cpav2" target="a/v2" /></p>
  <p name="pbv2">b/v2: <copy name="cpbv2" target="b/v2" /></p>


  <p name="m2"><copy name="cpall" target="_map1" assignNames="a1 b1 c1" /></p>
  <p name="pa1">a1: <copy name="cpa1" target="a1" /></p>
  <p name="pb1">b1: <copy name="cpb1" target="b1" /></p>
  <p name="pc1">c1: <copy name="cpc1" target="c1" /></p>

  <p name="pan11">a1/n1: <copy name="cpan11" target="a1/n1" /></p>
  <p name="pbn11">b1/n1: <copy name="cpbn11" target="b1/n1" /></p>
  <p name="pcn11">c1/n1: <copy name="cpcn11" target="c1/n1" /></p>

  <p name="pan21">a1/n2: <copy name="cpan21" target="a1/n2" /></p>
  <p name="pbn21">b1/n2: <copy name="cpbn21" target="b1/n2" /></p>
  <p name="pcn21">c1/n2: <copy name="cpcn21" target="c1/n2" /></p>

  <p name="pav11">a1/v1: <copy name="cpav11" target="a1/v1" /></p>
  <p name="pbv11">b1/v1: <copy name="cpbv11" target="b1/v1" /></p>
  <p name="pcv11">c1/v1: <copy name="cpcv11" target="c1/v1" /></p>

  <p name="pav21">a1/v2: <copy name="cpav21" target="a1/v2" /></p>
  <p name="pbv21">b1/v2: <copy name="cpbv21" target="b1/v2" /></p>
  <p name="pcv21">c1/v2: <copy name="cpcv21" target="c1/v2" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. ');

    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');

    cy.get('#\\/pan1').should('have.text', 'a/n1: 1');
    cy.get('#\\/pan11').should('have.text', 'a1/n1: 1');
    cy.get('#\\/pan2').should('have.text', 'a/n2: ');
    cy.get('#\\/pan21').should('have.text', 'a1/n2: ');

    cy.get('#\\/pav1').should('have.text', 'a/v1: a');
    cy.get('#\\/pav11').should('have.text', 'a1/v1: a');
    cy.get('#\\/pav2').should('have.text', 'a/v2: ');
    cy.get('#\\/pav21').should('have.text', 'a1/v2: ');

    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');

    cy.get('#\\/pbn1').should('have.text', 'b/n1: ');
    cy.get('#\\/pbn11').should('have.text', 'b1/n1: ');
    cy.get('#\\/pbn2').should('have.text', 'b/n2: ');
    cy.get('#\\/pbn21').should('have.text', 'b1/n2: ');

    cy.get('#\\/pbv1').should('have.text', 'b/v1: ');
    cy.get('#\\/pbv11').should('have.text', 'b1/v1: ');
    cy.get('#\\/pbv2').should('have.text', 'b/v2: ');
    cy.get('#\\/pbv21').should('have.text', 'b1/v2: ');

    cy.get('#\\/pc1').should('have.text', 'c1: ');

    cy.get('#\\/pcn11').should('have.text', 'c1/n1: ');
    cy.get('#\\/pcn21').should('have.text', 'c1/n2: ');

    cy.get('#\\/pcv11').should('have.text', 'c1/v1: ');
    cy.get('#\\/pcv21').should('have.text', 'c1/v2: ');



    cy.log('change n to 2')
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. ');

    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');

    cy.get('#\\/pan1').should('have.text', 'a/n1: 1');
    cy.get('#\\/pan11').should('have.text', 'a1/n1: 1');
    cy.get('#\\/pan2').should('have.text', 'a/n2: ');
    cy.get('#\\/pan21').should('have.text', 'a1/n2: ');

    cy.get('#\\/pav1').should('have.text', 'a/v1: a');
    cy.get('#\\/pav11').should('have.text', 'a1/v1: a');
    cy.get('#\\/pav2').should('have.text', 'a/v2: ');
    cy.get('#\\/pav21').should('have.text', 'a1/v2: ');

    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');

    cy.get('#\\/pbn1').should('have.text', 'b/n1: 2');
    cy.get('#\\/pbn11').should('have.text', 'b1/n1: 2');
    cy.get('#\\/pbn2').should('have.text', 'b/n2: ');
    cy.get('#\\/pbn21').should('have.text', 'b1/n2: ');

    cy.get('#\\/pbv1').should('have.text', 'b/v1: b');
    cy.get('#\\/pbv11').should('have.text', 'b1/v1: b');
    cy.get('#\\/pbv2').should('have.text', 'b/v2: ');
    cy.get('#\\/pbv21').should('have.text', 'b1/v2: ');

    cy.get('#\\/pc1').should('have.text', 'c1: ');

    cy.get('#\\/pcn11').should('have.text', 'c1/n1: ');
    cy.get('#\\/pcn21').should('have.text', 'c1/n2: ');

    cy.get('#\\/pcv11').should('have.text', 'c1/v1: ');
    cy.get('#\\/pcv21').should('have.text', 'c1/v2: ');


    cy.log('change n to 0')
    cy.get('#\\/n textarea').type('{end}{backspace}0{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', '');
    cy.get('#\\/m2').should('have.text', '');

    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: ');

    cy.get('#\\/pan1').should('have.text', 'a/n1: ');
    cy.get('#\\/pan11').should('have.text', 'a1/n1: ');
    cy.get('#\\/pan2').should('have.text', 'a/n2: ');
    cy.get('#\\/pan21').should('have.text', 'a1/n2: ');

    cy.get('#\\/pav1').should('have.text', 'a/v1: ');
    cy.get('#\\/pav11').should('have.text', 'a1/v1: ');
    cy.get('#\\/pav2').should('have.text', 'a/v2: ');
    cy.get('#\\/pav21').should('have.text', 'a1/v2: ');

    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: ');

    cy.get('#\\/pbn1').should('have.text', 'b/n1: ');
    cy.get('#\\/pbn11').should('have.text', 'b1/n1: ');
    cy.get('#\\/pbn2').should('have.text', 'b/n2: ');
    cy.get('#\\/pbn21').should('have.text', 'b1/n2: ');

    cy.get('#\\/pbv1').should('have.text', 'b/v1: ');
    cy.get('#\\/pbv11').should('have.text', 'b1/v1: ');
    cy.get('#\\/pbv2').should('have.text', 'b/v2: ');
    cy.get('#\\/pbv21').should('have.text', 'b1/v2: ');

    cy.get('#\\/pc1').should('have.text', 'c1: ');

    cy.get('#\\/pcn11').should('have.text', 'c1/n1: ');
    cy.get('#\\/pcn21').should('have.text', 'c1/n2: ');

    cy.get('#\\/pcv11').should('have.text', 'c1/v1: ');
    cy.get('#\\/pcv21').should('have.text', 'c1/v2: ');



    cy.log('change n to 3')
    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. ');

    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');

    cy.get('#\\/pan1').should('have.text', 'a/n1: 1');
    cy.get('#\\/pan11').should('have.text', 'a1/n1: 1');
    cy.get('#\\/pan2').should('have.text', 'a/n2: ');
    cy.get('#\\/pan21').should('have.text', 'a1/n2: ');

    cy.get('#\\/pav1').should('have.text', 'a/v1: a');
    cy.get('#\\/pav11').should('have.text', 'a1/v1: a');
    cy.get('#\\/pav2').should('have.text', 'a/v2: ');
    cy.get('#\\/pav21').should('have.text', 'a1/v2: ');

    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');

    cy.get('#\\/pbn1').should('have.text', 'b/n1: 2');
    cy.get('#\\/pbn11').should('have.text', 'b1/n1: 2');
    cy.get('#\\/pbn2').should('have.text', 'b/n2: ');
    cy.get('#\\/pbn21').should('have.text', 'b1/n2: ');

    cy.get('#\\/pbv1').should('have.text', 'b/v1: b');
    cy.get('#\\/pbv11').should('have.text', 'b1/v1: b');
    cy.get('#\\/pbv2').should('have.text', 'b/v2: ');
    cy.get('#\\/pbv21').should('have.text', 'b1/v2: ');

    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');

    cy.get('#\\/pcn11').should('have.text', 'c1/n1: 3');
    cy.get('#\\/pcn21').should('have.text', 'c1/n2: ');

    cy.get('#\\/pcv11').should('have.text', 'c1/v1: c');
    cy.get('#\\/pcv21').should('have.text', 'c1/v2: ');



    cy.log('change n to 5')
    cy.get('#\\/n textarea').type('{end}{backspace}5{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Letter 2 is b. Letter 3 is c. Letter 4 is d. Letter 5 is e. ');

    cy.get('#\\/pa').should('have.text', 'a: Letter 1 is a. ');
    cy.get('#\\/pa1').should('have.text', 'a1: Letter 1 is a. ');

    cy.get('#\\/pan1').should('have.text', 'a/n1: 1');
    cy.get('#\\/pan11').should('have.text', 'a1/n1: 1');
    cy.get('#\\/pan2').should('have.text', 'a/n2: ');
    cy.get('#\\/pan21').should('have.text', 'a1/n2: ');

    cy.get('#\\/pav1').should('have.text', 'a/v1: a');
    cy.get('#\\/pav11').should('have.text', 'a1/v1: a');
    cy.get('#\\/pav2').should('have.text', 'a/v2: ');
    cy.get('#\\/pav21').should('have.text', 'a1/v2: ');

    cy.get('#\\/pb').should('have.text', 'b: Letter 2 is b. ');
    cy.get('#\\/pb1').should('have.text', 'b1: Letter 2 is b. ');

    cy.get('#\\/pbn1').should('have.text', 'b/n1: 2');
    cy.get('#\\/pbn11').should('have.text', 'b1/n1: 2');
    cy.get('#\\/pbn2').should('have.text', 'b/n2: ');
    cy.get('#\\/pbn21').should('have.text', 'b1/n2: ');

    cy.get('#\\/pbv1').should('have.text', 'b/v1: b');
    cy.get('#\\/pbv11').should('have.text', 'b1/v1: b');
    cy.get('#\\/pbv2').should('have.text', 'b/v2: ');
    cy.get('#\\/pbv21').should('have.text', 'b1/v2: ');

    cy.get('#\\/pc1').should('have.text', 'c1: Letter 3 is c. ');

    cy.get('#\\/pcn11').should('have.text', 'c1/n1: 3');
    cy.get('#\\/pcn21').should('have.text', 'c1/n2: ');

    cy.get('#\\/pcv11').should('have.text', 'c1/v1: c');
    cy.get('#\\/pcv21').should('have.text', 'c1/v2: ');


  })

  it('copy source and index assign names, no new template namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1"><map>
    <template>Letter <copy target="i" assignNames="n1" /> is <copy target="m" assignnames="v1" />. Repeat: letter $n1 is $v1. </template>
    <sources alias='m' indexAlias='i'>
      <sequence type="letters" length="$n" />
   </sources>
  </map></p>

  <p name="m2"><copy name="cpall" target="_map1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. ');

    cy.log('change n to 2')
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ');

    cy.log('change n to 0')
    cy.get('#\\/n textarea').type('{end}{backspace}0{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', '');
    cy.get('#\\/m2').should('have.text', '');

    cy.log('change n to 3')
    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ');


  })

  it('copy source and index assign names, no new template namespace, inside namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" prefill="1" />
  <p name="m1" newNamespace><map>
    <template>Letter <copy target="i" assignNames="n1" /> is <copy target="m" assignnames="v1" />. Repeat: letter $n1 is $v1. </template>
    <sources alias="m" indexAlias="i">
      <sequence type="letters" length="$(../n)" />
   </sources>
  </map></p>

  <p name="m2"><copy name="cpall" target="m1/_map1" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. ');

    cy.log('change n to 2')
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. ');

    cy.log('change n to 0')
    cy.get('#\\/n textarea').type('{end}{backspace}0{enter}', { force: true })


    cy.get('#\\/m1').should('have.text', '');
    cy.get('#\\/m2').should('have.text', '');

    cy.log('change n to 3')
    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', { force: true })

    cy.get('#\\/m1').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ');
    cy.get('#\\/m2').should('have.text', 'Letter 1 is a. Repeat: letter 1 is a. Letter 2 is b. Repeat: letter 2 is b. Letter 3 is c. Repeat: letter 3 is c. ');


  })

});
