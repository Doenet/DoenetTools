import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('SelectByCondition Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('select single text, assign sub on copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <selectByCondition assignNames="a" maximumnumbertoselect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result><text>dog</text></result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result><text>cat</text></result>
      </case>
      <else>
        <text>mouse</text>
      </else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('select single text, initially assign sub', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <selectByCondition assignNames="(a)" maximumnumbertoselect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result><text>dog</text></result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result><text>cat</text></result>
      </case>
      <else>
        <text>mouse</text>
      </else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="a1" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="b" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="(b1)" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('select single text with multiple matches, assign sub on copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a,aa: <selectByCondition assignNames="a,aa">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result><text>dog</text></result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result><text>cat</text></result>
      </case>
      <else>
        <text>mouse</text>
      </else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>
    <p name="paa1">aa1: <copy tname="aa" assignNames="(aa1)" /></p>

    <p name="pb" >b,bb: <copy tname="_selectbycondition1" assignNames="(b),(bb)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>
    <p name="pbb1">bb1: <copy tname="bb" assignNames="bb1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a,aa: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/paa1').should('have.text', 'aa1: ');
    cy.get('#\\/pb').should('have.text', 'b,bb: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');
    cy.get('#\\/pbb1').should('have.text', 'bb1: ');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/aa1').should('not.exist');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/bb').should('not.exist');
    cy.get('#\\/b1').should('have.text', 'mouse');
    cy.get('#\\/bb1').should('not.exist');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/pa').should('have.text', 'a,aa: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/paa1').should('have.text', 'aa1: ');
    cy.get('#\\/pb').should('have.text', 'b,bb: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');
    cy.get('#\\/pbb1').should('have.text', 'bb1: ');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/aa1').should('not.exist');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/bb').should('not.exist');
    cy.get('#\\/b1').should('have.text', 'cat');
    cy.get('#\\/bb1').should('not.exist');

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get('#\\/pa').should('have.text', 'a,aa: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/paa1').should('have.text', 'aa1: ');
    cy.get('#\\/pb').should('have.text', 'b,bb: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');
    cy.get('#\\/pbb1').should('have.text', 'bb1: ');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/aa1').should('not.exist');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/bb').should('not.exist');
    cy.get('#\\/b1').should('have.text', 'mouse');
    cy.get('#\\/bb1').should('not.exist');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get('#\\/pa').should('have.text', 'a,aa: dogcat');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/paa1').should('have.text', 'aa1: cat');
    cy.get('#\\/pb').should('have.text', 'b,bb: dogcat');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');
    cy.get('#\\/pbb1').should('have.text', 'bb1: cat');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/aa1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/bb').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'dog');
    cy.get('#\\/bb1').should('have.text', 'cat');

    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")

    cy.get('#\\/pa').should('have.text', 'a,aa: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/paa1').should('have.text', 'aa1: ');
    cy.get('#\\/pb').should('have.text', 'b,bb: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');
    cy.get('#\\/pbb1').should('have.text', 'bb1: ');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/aa1').should('not.exist');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/bb').should('not.exist');
    cy.get('#\\/b1').should('have.text', 'mouse');
    cy.get('#\\/bb1').should('not.exist');

  });

  it('select single text, assign sub on copy, copy condition to restrict to one', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <selectByCondition assignNames="a">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result><text>dog</text></result>
      </case>
      <case>
        <condition>
          <not><copy prop="conditionSatisfied" tname="_case1" /></not> and
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result><text>cat</text></result>
      </case>
      <else>
        <text>mouse</text>
      </else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('select text, math, and optional', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="(a,b,c,d)" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result>
          <text>dog</text>
          <math>x</math>
          <text>optional text!</text>
        </result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result>
          <text>cat</text>
          <math>y</math>
        </result>
      </case>
      <else>
        <text>mouse</text>
        <math>z</math>
      </else>
    </selectByCondition></p>

    <p>a1: <copy tname="a" assignNames="a1" /></p>
    <p>b1: <copy tname="b" assignNames="b1" /></p>
    <p>c1: <copy tname="c" assignNames="c1" /></p>
    <p>d1: <copy tname="d" assignNames="d1" /></p>

    <p>copy: <copy name="cp1" tname="_selectbycondition1" assignNames="(e,f,g,h,i)" /></p>

    <p>e1: <copy tname="e" assignNames="e1" /></p>
    <p>f1: <copy tname="f" assignNames="f1" /></p>
    <p>g1: <copy tname="g" assignNames="g1" /></p>
    <p>h1: <copy tname="h" assignNames="h1" /></p>
    <p>i1: <copy tname="i" assignNames="i1" /></p>

    <p>copied copy: <copy tname="cp1" assignNames="(j,k,l)" /></p>

    <p>j1: <copy tname="j" assignNames="j1" /></p>
    <p>k1: <copy tname="k" assignNames="k1" /></p>
    <p>l1: <copy tname="l" assignNames="l1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/e').should('have.text', 'mouse');
    cy.get('#\\/e1').should('have.text', 'mouse');
    cy.get('#\\/j').should('have.text', 'mouse');
    cy.get('#\\/j1').should('have.text', 'mouse');

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get('#\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');


    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/e').should('have.text', 'cat');
    cy.get('#\\/e1').should('have.text', 'cat');
    cy.get('#\\/j').should('have.text', 'cat');
    cy.get('#\\/j1').should('have.text', 'cat');

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })

    cy.get('#\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');



    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/e').should('have.text', 'mouse');
    cy.get('#\\/e1').should('have.text', 'mouse');
    cy.get('#\\/j').should('have.text', 'mouse');
    cy.get('#\\/j1').should('have.text', 'mouse');

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get('#\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")


    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/e').should('have.text', 'dog');
    cy.get('#\\/e1').should('have.text', 'dog');
    cy.get('#\\/j').should('have.text', 'dog');
    cy.get('#\\/j1').should('have.text', 'dog');

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/c').should('have.text', 'optional text!');
    cy.get('#\\/c1').should('have.text', 'optional text!');
    cy.get('#\\/g').should('have.text', 'optional text!');
    cy.get('#\\/g1').should('have.text', 'optional text!');
    cy.get('#\\/l').should('have.text', 'optional text!');
    cy.get('#\\/l1').should('have.text', 'optional text!');

    cy.get('#\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');


    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/e').should('have.text', 'mouse');
    cy.get('#\\/e1').should('have.text', 'mouse');
    cy.get('#\\/j').should('have.text', 'mouse');
    cy.get('#\\/j1').should('have.text', 'mouse');

    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get('#\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');

  });

  it('select text, math, and optional, new namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="(a,b,c,d)" name="s1" newnamespace>
      <case>
        <condition>
          <copy prop="value" tname="../n" /> < 0
        </condition>
        <result>
          <text>dog</text>
          <math>x</math>
          <text>optional text!</text>
        </result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="../n" /> <= 1
        </condition>
        <result>
          <text>cat</text>
          <math>y</math>
        </result>
      </case>
      <else>
        <text>mouse</text>
        <math>z</math>
      </else>
    </selectByCondition></p>

    <p>a1: <copy tname="s1/a" assignNames="a1" /></p>
    <p>b1: <copy tname="s1/b" assignNames="b1" /></p>
    <p>c1: <copy tname="s1/c" assignNames="c1" /></p>
    <p>d1: <copy tname="s1/d" assignNames="d1" /></p>

    <p>copy: <copy name="s2" tname="s1" assignNames="(e,f,g,h,i)" /></p>

    <p>e1: <copy tname="e" assignNames="e1" /></p>
    <p>f1: <copy tname="f" assignNames="f1" /></p>
    <p>g1: <copy tname="g" assignNames="g1" /></p>
    <p>h1: <copy tname="h" assignNames="h1" /></p>
    <p>i1: <copy tname="i" assignNames="i1" /></p>

    <p>copied copy: <copy name="s3" tname="s2" assignNames="(j,k,l)" newNamespace /></p>

    <p>j1: <copy tname="s3/j" assignNames="j1" /></p>
    <p>k1: <copy tname="s3/k" assignNames="k1" /></p>
    <p>l1: <copy tname="s3/l" assignNames="l1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/s1\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/e').should('have.text', 'mouse');
    cy.get('#\\/e1').should('have.text', 'mouse');
    cy.get('#\\/s3\\/j').should('have.text', 'mouse');
    cy.get('#\\/j1').should('have.text', 'mouse');

    cy.get('#\\/s1\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/s3\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get('#\\/s1\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/s3\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/s1\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');


    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/s1\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/e').should('have.text', 'cat');
    cy.get('#\\/e1').should('have.text', 'cat');
    cy.get('#\\/s3\\/j').should('have.text', 'cat');
    cy.get('#\\/j1').should('have.text', 'cat');

    cy.get('#\\/s1\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/s3\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })

    cy.get('#\\/s1\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/s3\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/s1\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');



    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get('#\\/s1\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/e').should('have.text', 'mouse');
    cy.get('#\\/e1').should('have.text', 'mouse');
    cy.get('#\\/s3\\/j').should('have.text', 'mouse');
    cy.get('#\\/j1').should('have.text', 'mouse');

    cy.get('#\\/s1\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/s3\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get('#\\/s1\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/s3\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/s1\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")


    cy.get('#\\/s1\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/e').should('have.text', 'dog');
    cy.get('#\\/e1').should('have.text', 'dog');
    cy.get('#\\/s3\\/j').should('have.text', 'dog');
    cy.get('#\\/j1').should('have.text', 'dog');

    cy.get('#\\/s1\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/s3\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })

    cy.get('#\\/s1\\/c').should('have.text', 'optional text!');
    cy.get('#\\/c1').should('have.text', 'optional text!');
    cy.get('#\\/g').should('have.text', 'optional text!');
    cy.get('#\\/g1').should('have.text', 'optional text!');
    cy.get('#\\/s3\\/l').should('have.text', 'optional text!');
    cy.get('#\\/l1').should('have.text', 'optional text!');

    cy.get('#\\/s1\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');


    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")

    cy.get('#\\/s1\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/e').should('have.text', 'mouse');
    cy.get('#\\/e1').should('have.text', 'mouse');
    cy.get('#\\/s3\\/j').should('have.text', 'mouse');
    cy.get('#\\/j1').should('have.text', 'mouse');

    cy.get('#\\/s1\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/b1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/f1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/s3\\/k').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get('#\\/k1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })

    cy.get('#\\/s1\\/c').should('not.exist');
    cy.get('#\\/c1').should('not.exist');
    cy.get('#\\/g').should('not.exist');
    cy.get('#\\/g1').should('not.exist');
    cy.get('#\\/s3\\/l').should('not.exist');
    cy.get('#\\/l1').should('not.exist');

    cy.get('#\\/s1\\/d').should('not.exist');
    cy.get('#\\/d1').should('not.exist');
    cy.get('#\\/h').should('not.exist');
    cy.get('#\\/h1').should('not.exist');
    cy.get('#\\/i').should('not.exist');
    cy.get('#\\/i1').should('not.exist');

  });

  it('references to internal and external components', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="(a,b,c)" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result>
          <copy tname="x1" />
          <copy tname="y1" />
          <math simplify>3<math name="a1">x</math><math name="b1">a</math> + <copy tname="a1" /><copy tname="b1" /></math>
        </result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result>
          <copy tname="x2" />
          <copy tname="y2" />
          <math simplify>4<math name="a2">y</math><math name="b2">b</math> + <copy tname="a2" /><copy tname="b2" /></math>
        </result>
      </case>
      <else>
        <copy tname="x3" />
        <copy tname="y3" />
        <math simplify>5<math name="a3">z</math><math name="b3">c</math> + <copy tname="a3" /><copy tname="b3" /></math>
      </else>
    </selectByCondition></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy assignNames="aa" tname="a" />
    <copy assignNames="bb" tname="b" />
    <copy assignNames="cc" tname="c" />

    <p>Whole thing repeated</p>
    <copy tname="_selectbycondition1" assignNames="(d,e,f)" />

    <p>Selected options repeated from copy</p>
    <copy assignNames="dd" tname="d" />
    <copy assignNames="ee" tname="e" />
    <copy assignNames="ff" tname="f" />


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aAnchor = cesc('#' + components["/a"].replacements[0].componentName);
      let bAnchor = cesc('#' + components["/b"].replacements[0].componentName);
      let dAnchor = cesc('#' + components["/d"].replacements[0].componentName);
      let eAnchor = cesc('#' + components["/e"].replacements[0].componentName);

      cy.get(aAnchor).should('have.text', 'mouse')
      cy.get(bAnchor).should('have.text', 'bush')
      cy.get(`#\\/c`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })
      cy.get(`#\\/aa`).should('have.text', 'mouse')
      cy.get(`#\\/bb`).should('have.text', 'bush')
      cy.get(`#\\/cc`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })

      cy.get(dAnchor).should('have.text', 'mouse')
      cy.get(eAnchor).should('have.text', 'bush')
      cy.get(`#\\/f`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })
      cy.get(`#\\/dd`).should('have.text', 'mouse')
      cy.get(`#\\/ee`).should('have.text', 'bush')
      cy.get(`#\\/ff`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })
    });

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aAnchor = cesc('#' + components["/a"].replacements[0].componentName);
      let bAnchor = cesc('#' + components["/b"].replacements[0].componentName);
      let dAnchor = cesc('#' + components["/d"].replacements[0].componentName);
      let eAnchor = cesc('#' + components["/e"].replacements[0].componentName);

      cy.get(aAnchor).should('have.text', 'cat')
      cy.get(bAnchor).should('have.text', 'shrub')
      cy.get(`#\\/c`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5by')
      })
      cy.get(`#\\/aa`).should('have.text', 'cat')
      cy.get(`#\\/bb`).should('have.text', 'shrub')
      cy.get(`#\\/cc`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5by')
      })

      cy.get(dAnchor).should('have.text', 'cat')
      cy.get(eAnchor).should('have.text', 'shrub')
      cy.get(`#\\/f`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5by')
      })
      cy.get(`#\\/dd`).should('have.text', 'cat')
      cy.get(`#\\/ee`).should('have.text', 'shrub')
      cy.get(`#\\/ff`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5by')
      })
    });


    cy.log('enter -1')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aAnchor = cesc('#' + components["/a"].replacements[0].componentName);
      let bAnchor = cesc('#' + components["/b"].replacements[0].componentName);
      let dAnchor = cesc('#' + components["/d"].replacements[0].componentName);
      let eAnchor = cesc('#' + components["/e"].replacements[0].componentName);

      cy.get(aAnchor).should('have.text', 'dog')
      cy.get(bAnchor).should('have.text', 'tree')
      cy.get(`#\\/c`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })
      cy.get(`#\\/aa`).should('have.text', 'dog')
      cy.get(`#\\/bb`).should('have.text', 'tree')
      cy.get(`#\\/cc`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })

      cy.get(dAnchor).should('have.text', 'dog')
      cy.get(eAnchor).should('have.text', 'tree')
      cy.get(`#\\/f`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })
      cy.get(`#\\/dd`).should('have.text', 'dog')
      cy.get(`#\\/ee`).should('have.text', 'tree')
      cy.get(`#\\/ff`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })
    });

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aAnchor = cesc('#' + components["/a"].replacements[0].componentName);
      let bAnchor = cesc('#' + components["/b"].replacements[0].componentName);
      let dAnchor = cesc('#' + components["/d"].replacements[0].componentName);
      let eAnchor = cesc('#' + components["/e"].replacements[0].componentName);

      cy.get(aAnchor).should('have.text', 'mouse')
      cy.get(bAnchor).should('have.text', 'bush')
      cy.get(`#\\/c`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })
      cy.get(`#\\/aa`).should('have.text', 'mouse')
      cy.get(`#\\/bb`).should('have.text', 'bush')
      cy.get(`#\\/cc`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })

      cy.get(dAnchor).should('have.text', 'mouse')
      cy.get(eAnchor).should('have.text', 'bush')
      cy.get(`#\\/f`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })
      cy.get(`#\\/dd`).should('have.text', 'mouse')
      cy.get(`#\\/ee`).should('have.text', 'bush')
      cy.get(`#\\/ff`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6cz')
      })
    });

  });

  it('references to internal and external components, new namespace at result/else', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="a" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result newNamespace>
          <copy tname="../x1" assignNames="animal" />
          <copy tname="../y1" assignNames="plant" />
          <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + <copy tname="x" /><copy tname="a" /></math>
        </result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result newNamespace>
          <copy tname="../x2" assignNames="animal" />
          <copy tname="../y2" assignNames="plant" />
          <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + <copy tname="x" /><copy tname="a" /></math>
        </result>
      </case>
      <else newNamespace>
        <copy tname="../x3" assignNames="animal" />
        <copy tname="../y3" assignNames="plant" />
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + <copy tname="x" /><copy tname="a" /></math>
      </else>
    </selectByCondition></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy assignNames="animal" tname="a/animal" />
    <copy assignNames="plant" tname="a/plant" />
    <copy assignNames="p" tname="a/p" />
    <copy assignNames="xx" tname="a/x" />
    <copy assignNames="aa" tname="a/a" />

    <p>Whole thing repeated</p>
    <copy tname="_selectbycondition1" assignNames="b" />

    <p>Selected options repeated from copy</p>
    <copy assignNames="animalcopy" tname="b/animal" />
    <copy assignNames="plantcopy" tname="b/plant" />
    <copy assignNames="pcopy" tname="b/p" />
    <copy assignNames="xxcopy" tname="b/x" />
    <copy assignNames="aacopy" tname="b/a" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/b\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'mouse')
    cy.get(`#\\/plantcopy`).should('have.text', 'bush')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/a\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })

    cy.get(`#\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/b\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'cat')
    cy.get(`#\\/plantcopy`).should('have.text', 'shrub')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })

    cy.log('enter -1')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/a\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })

    cy.get(`#\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/b\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'dog')
    cy.get(`#\\/plantcopy`).should('have.text', 'tree')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })


    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


    cy.get(`#\\/b\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/b\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'mouse')
    cy.get(`#\\/plantcopy`).should('have.text', 'bush')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })

  });

  it('references to internal and external components, multiple layers of new namespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="a" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result newNamespace>
          <copy tname="../x1" assignNames="animal" />
          <copy tname="../y1" assignNames="plant" />
          <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + <copy tname="x" /><copy tname="a" /></math>
        </result>
      </case>
      <case newNamespace>
        <condition>
          <copy prop="value" tname="../n" /> <= 1
        </condition>
        <result newNamespace>
          <copy tname="../../x2" assignNames="animal" />
          <copy tname="../../y2" assignNames="plant" />
          <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + <copy tname="x" /><copy tname="a" /></math>
        </result>
      </case>
      <else newNamespace>
        <copy tname="../x3" assignNames="animal" />
        <copy tname="../y3" assignNames="plant" />
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + <copy tname="x" /><copy tname="a" /></math>
      </else>
    </selectByCondition></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy assignNames="animal" tname="a/animal" />
    <copy assignNames="plant" tname="a/plant" />
    <copy assignNames="p" tname="a/p" />
    <copy assignNames="xx" tname="a/x" />
    <copy assignNames="aa" tname="a/a" />

    <p>Whole thing repeated</p>
    <copy tname="_selectbycondition1" assignNames="b" />

    <p>Selected options repeated from copy</p>
    <copy assignNames="animalcopy" tname="b/animal" />
    <copy assignNames="plantcopy" tname="b/plant" />
    <copy assignNames="pcopy" tname="b/p" />
    <copy assignNames="xxcopy" tname="b/x" />
    <copy assignNames="aacopy" tname="b/a" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/b\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'mouse')
    cy.get(`#\\/plantcopy`).should('have.text', 'bush')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/a\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })

    cy.get(`#\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/b\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'cat')
    cy.get(`#\\/plantcopy`).should('have.text', 'shrub')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })

    cy.log('enter -1')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/a\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })

    cy.get(`#\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/b\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'dog')
    cy.get(`#\\/plantcopy`).should('have.text', 'tree')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4ax')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('a')
    })


    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


    cy.get(`#\\/b\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/b\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'mouse')
    cy.get(`#\\/plantcopy`).should('have.text', 'bush')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


  });

  it('references to internal and external components, inconsistent new namespaces', () => {
    // not sure why would want to do this, as give inconsistent behavior
    // depending on which option is chosen
    // but, we handle it gracefully
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="a" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result>
          <copy tname="x1" assignNames="theanimal" />
          <copy tname="y1" assignNames="theplant" />
          <math simplify name="thep">3<math name="thex">x</math><math name="thea">a</math> + <copy tname="thex" /><copy tname="thea" /></math>
        </result>
      </case>
      <case newNamespace>
        <condition>
          <copy prop="value" tname="../n" /> <= 1
        </condition>
        <result newNamespace>
          <copy tname="../../x2" assignNames="animal" />
          <copy tname="../../y2" assignNames="plant" />
          <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + <copy tname="x" /><copy tname="a" /></math>
        </result>
      </case>
      <else newNamespace>
        <copy tname="../x3" assignNames="animal" />
        <copy tname="../y3" assignNames="plant" />
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + <copy tname="x" /><copy tname="a" /></math>
      </else>
    </selectByCondition></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy assignNames="animal" tname="a/animal" />
    <copy assignNames="plant" tname="a/plant" />
    <copy assignNames="p" tname="a/p" />
    <copy assignNames="xx" tname="a/x" />
    <copy assignNames="aa" tname="a/a" />

    <p>Whole thing repeated</p>
    <p name="repeat"><copy tname="_selectbycondition1" assignNames="b" /></p>

    <p>Selected options repeated from copy</p>
    <copy assignNames="animalcopy" tname="b/animal" />
    <copy assignNames="plantcopy" tname="b/plant" />
    <copy assignNames="pcopy" tname="b/p" />
    <copy assignNames="xxcopy" tname="b/x" />
    <copy assignNames="aacopy" tname="b/a" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/b\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'mouse')
    cy.get(`#\\/plantcopy`).should('have.text', 'bush')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/a\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })

    cy.get(`#\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })

    cy.get(`#\\/b\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/b\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'cat')
    cy.get(`#\\/plantcopy`).should('have.text', 'shrub')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5by')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b')
    })


    cy.log('enter -1')
    cy.get('#\\/n_input').clear().type("-1{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aReplacements = components["/a"].replacements;
      let theAnimalAnchor = cesc("#" + aReplacements[0].replacements[0].componentName)
      let thePlantAnchor = cesc("#" + aReplacements[1].replacements[0].componentName)
      let thePAnchor = cesc("#" + aReplacements[2].componentName)

      let bReplacements = components["/b"].replacements;
      let theAnimalCopyAnchor = cesc("#" + bReplacements[0].replacements[0].componentName)
      let thePlantCopyAnchor = cesc("#" + bReplacements[1].replacements[0].componentName)
      let thePCopyAnchor = cesc("#" + bReplacements[2].componentName)

      cy.get(`#\\/a\\/animal`).should('not.exist')
      cy.get(`#\\/a\\/plant`).should('not.exist')
      cy.get(`#\\/a\\/p`).should('not.exist')

      cy.get(`#\\/_p1`).should('contain', 'dogtree4ax')
      cy.get(`#\\/_p1`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })

      cy.get(theAnimalAnchor).should('have.text', 'dog')
      cy.get(thePlantAnchor).should('have.text', 'tree')
      cy.get(thePAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })

      cy.get(`#\\/animal`).should('not.exist')
      cy.get(`#\\/plant`).should('not.exist')
      cy.get(`#\\/p`).should('not.exist')
      cy.get(`#\\/xx`).should('not.exist')
      cy.get(`#\\/aa`).should('not.exist')


      cy.get(`#\\/b\\/animal`).should('not.exist')
      cy.get(`#\\/b\\/plant`).should('not.exist')
      cy.get(`#\\/b\\/p`).should('not.exist')

      cy.get(`#\\/repeat`).should('contain', 'dogtree4ax')
      cy.get(`#\\/repeat`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })


      cy.get(theAnimalCopyAnchor).should('have.text', 'dog')
      cy.get(thePlantCopyAnchor).should('have.text', 'tree')
      cy.get(thePCopyAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4ax')
      })

      cy.get(`#\\/animalcopy`).should('not.exist')
      cy.get(`#\\/plantcopy`).should('not.exist')
      cy.get(`#\\/pcopy`).should('not.exist')
      cy.get(`#\\/xxcopy`).should('not.exist')
      cy.get(`#\\/aacopy`).should('not.exist')


    })

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")

    cy.get(`#\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xx`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })


    cy.get(`#\\/b\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/b\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/b\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })

    cy.get(`#\\/animalcopy`).should('have.text', 'mouse')
    cy.get(`#\\/plantcopy`).should('have.text', 'bush')
    cy.get(`#\\/pcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6cz')
    })
    cy.get(`#\\/xxcopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('z')
    })
    cy.get(`#\\/aacopy`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })

  });

  it('dynamic internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="1" />
    <selectByCondition assignNames="a" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result newNamespace>
          <p>What is your favorite animal? <textinput name="response" /></p>
          <p>I like <copy prop="value" tname="response" />, too.</p>
        </result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result newNamespace>
          <p>What is your name? <textinput name="response" /></p>
          <p>Hello, <copy prop="value" tname="response" />!</p>
        </result>
      </case>
      <else newNamespace>
        <p>Anything else? <textinput name="response" /></p>
        <p>To repeat: <copy prop="value" tname="response" />.</p>
      </else>
    </selectByCondition>
    
    <p>The response: <copy tname="a/response" prop="value" /></p>
    
    <copy name="sc2" tname="_selectbycondition1" assignNames="b" />
    
    <p>The response one more time: <copy tname="b/response" prop="value" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/a\\/_p1`).should('have.text', 'What is your name? ')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'Hello, !')
    cy.get(`#\\/_p1`).should('have.text', 'The response: ')
    cy.get(`#\\/b\\/_p1`).should('have.text', 'What is your name? ')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'Hello, !')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: ')


    cy.get(`#\\/a\\/response_input`).clear().type('Fred{enter}')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'Hello, Fred!')
    cy.get(`#\\/_p1`).should('have.text', 'The response: Fred')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'Hello, Fred!')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: Fred')


    cy.get('#\\/n_input').clear().type("-1{enter}")
    cy.get(`#\\/a\\/_p1`).should('have.text', 'What is your favorite animal? ')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'I like , too.')
    cy.get(`#\\/_p1`).should('have.text', 'The response: ')
    cy.get(`#\\/b\\/_p1`).should('have.text', 'What is your favorite animal? ')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'I like , too.')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: ')

    cy.get(`#\\/a\\/response_input`).clear().type('dogs{enter}')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'I like dogs, too.')
    cy.get(`#\\/_p1`).should('have.text', 'The response: dogs')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'I like dogs, too.')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: dogs')



    cy.get('#\\/n_input').clear().type("3{enter}")
    cy.get(`#\\/a\\/_p1`).should('have.text', 'Anything else? ')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'To repeat: .')
    cy.get(`#\\/_p1`).should('have.text', 'The response: ')
    cy.get(`#\\/b\\/_p1`).should('have.text', 'Anything else? ')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'To repeat: .')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: ')

    cy.get(`#\\/a\\/response_input`).clear().type('Goodbye{enter}')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'To repeat: Goodbye.')
    cy.get(`#\\/_p1`).should('have.text', 'The response: Goodbye')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'To repeat: Goodbye.')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: Goodbye')


  });

  it('dynamic internal references, assign pieces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="1" />
    <selectByCondition assignNames="(a,b)" maximumNumberToSelect="1">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <result>
          <p newNamespace name="panimal">What is your favorite animal? <textinput name="response" /></p>
          <p newNamespace>I like <copy prop="value" tname="../panimal/response" />, too.</p>
        </result>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <result>
          <p newNamespace name="pname">What is your name? <textinput name="response" /></p>
          <p newNamespace>Hello, <copy prop="value" tname="../pname/response" />!</p>
        </result>
      </case>
      <else>
        <p newNamespace name="pelse">Anything else? <textinput name="response" /></p>
        <p newNamespace>To repeat: <copy prop="value" tname="../pelse/response" />.</p>
      </else>
    </selectByCondition>
    
    <p name="pResponse">The response: <copy tname="a/response" prop="value" /></p>
    
    <copy name="sc2" tname="_selectbycondition1" assignNames="(c,d)" />
    
    <p name="pResponse2">The response one more time: <copy tname="c/response" prop="value" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/a`).should('have.text', 'What is your name? ')
    cy.get(`#\\/b`).should('have.text', 'Hello, !')
    cy.get(`#\\/pResponse`).should('have.text', 'The response: ')
    cy.get(`#\\/c`).should('have.text', 'What is your name? ')
    cy.get(`#\\/d`).should('have.text', 'Hello, !')
    cy.get(`#\\/pResponse2`).should('have.text', 'The response one more time: ')


    cy.get(`#\\/a\\/response_input`).clear().type('Fred{enter}')
    cy.get(`#\\/b`).should('have.text', 'Hello, Fred!')
    cy.get(`#\\/pResponse`).should('have.text', 'The response: Fred')
    cy.get(`#\\/d`).should('have.text', 'Hello, Fred!')
    cy.get(`#\\/pResponse2`).should('have.text', 'The response one more time: Fred')


    cy.get('#\\/n_input').clear().type("-1{enter}")
    cy.get(`#\\/a`).should('have.text', 'What is your favorite animal? ')
    cy.get(`#\\/b`).should('have.text', 'I like , too.')
    cy.get(`#\\/pResponse`).should('have.text', 'The response: ')
    cy.get(`#\\/c`).should('have.text', 'What is your favorite animal? ')
    cy.get(`#\\/d`).should('have.text', 'I like , too.')
    cy.get(`#\\/pResponse2`).should('have.text', 'The response one more time: ')

    cy.get(`#\\/a\\/response_input`).clear().type('dogs{enter}')
    cy.get(`#\\/b`).should('have.text', 'I like dogs, too.')
    cy.get(`#\\/pResponse`).should('have.text', 'The response: dogs')
    cy.get(`#\\/d`).should('have.text', 'I like dogs, too.')
    cy.get(`#\\/pResponse2`).should('have.text', 'The response one more time: dogs')


    cy.get('#\\/n_input').clear().type("3{enter}")
    cy.get(`#\\/a`).should('have.text', 'Anything else? ')
    cy.get(`#\\/b`).should('have.text', 'To repeat: .')
    cy.get(`#\\/pResponse`).should('have.text', 'The response: ')
    cy.get(`#\\/c`).should('have.text', 'Anything else? ')
    cy.get(`#\\/d`).should('have.text', 'To repeat: .')
    cy.get(`#\\/pResponse2`).should('have.text', 'The response one more time: ')

    cy.get(`#\\/a\\/response_input`).clear().type('Goodbye{enter}')
    cy.get(`#\\/b`).should('have.text', 'To repeat: Goodbye.')
    cy.get(`#\\/pResponse`).should('have.text', 'The response: Goodbye')
    cy.get(`#\\/d`).should('have.text', 'To repeat: Goodbye.')
    cy.get(`#\\/pResponse2`).should('have.text', 'The response one more time: Goodbye')


  });

  it('copy case', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />

    <p><selectByCondition>
      <case name="positiveCase">
        <condition><copy prop="value" tname="n" /> > 0</condition>
        <result>
          <text>positive</text>
        </result>
      </case>
      <else>
        <text>non-positive</text>
      </else>
    </selectByCondition></p>
    
    <p><selectByCondition>
      <copy tname="positiveCase" />
      <case>
        <condition><copy prop="value" tname="n" /> < 0</condition>
        <result>
          <text>negative</text>
        </result>
      </case>
      <else>
        <text>neither</text>
      </else>
    </selectByCondition></p>
    
    
    <p><copy tname="_selectbycondition1" /></p>

    <p><copy tname="_selectbycondition2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'neither');
    cy.get('#\\/_p4').should('have.text', 'neither');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/_p1').should('have.text', 'positive');
    cy.get('#\\/_p3').should('have.text', 'positive');
    cy.get('#\\/_p2').should('have.text', 'positive');
    cy.get('#\\/_p4').should('have.text', 'positive');

    cy.log('enter -1')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'negative');
    cy.get('#\\/_p4').should('have.text', 'negative');

    cy.log('enter 0')
    cy.get('#\\/n_input').clear().type("0{enter}")
    
    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'neither');
    cy.get('#\\/_p4').should('have.text', 'neither');

  });

  it('copy result and else', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />

    <p><selectByCondition>
      <case>
        <condition><copy prop="value" tname="n" /> > 0</condition>
        <result name="hello">
          <text>hello</text>
        </result>
      </case>
      <else name="bye">
        <text>bye</text>
      </else>
    </selectByCondition></p>
    
    <p><selectByCondition>
      <case>
        <condition><copy prop="value" tname="n" /> < 0</condition>
        <copy tname="hello"/>
      </case>
      <case>
        <condition><copy prop="value" tname="n" /> > 0</condition>
        <result>
          <text>oops</text>
        </result>
      </case>
      <copy tname="bye"/>
    </selectByCondition></p>
    
    <p><copy tname="_selectbycondition1" /></p>

    <p><copy tname="_selectbycondition2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")

    cy.get('#\\/_p1').should('have.text', 'hello');
    cy.get('#\\/_p3').should('have.text', 'hello');
    cy.get('#\\/_p2').should('have.text', 'oops');
    cy.get('#\\/_p4').should('have.text', 'oops');

    cy.log('enter -1')
    cy.get('#\\/n_input').clear().type("-1{enter}")

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'hello');
    cy.get('#\\/_p4').should('have.text', 'hello');

    cy.log('enter 0')
    cy.get('#\\/n_input').clear().type("0{enter}")
    
    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

  });

});
