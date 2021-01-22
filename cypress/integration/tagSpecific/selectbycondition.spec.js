import me from 'math-expressions';

describe('SelectByCondition Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('select single text', () => {
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
        <text>dog</text>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <text>cat</text>
      </case>
      <else>
        <text>mouse</text>
      </else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="a1" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="b" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded
  
    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('select single text, assign sub', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <selectByCondition assignNames="(a)">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <text>dog</text>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <text>cat</text>
      </case>
      <else>
        <text>mouse</text>
      </else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="a1" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded
  
    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter 1')
    cy.get('#\\/n_input').clear().type("1{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n_input').clear().type("10{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n_input').clear().type("-1{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n_input').clear().type("x{enter}")
  
    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
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
    <p>original: <selectByCondition assignNames="(a,b,c,d)">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <text>dog</text>
        <math>x</math>
        <text>optional text!</text>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="n" /> <= 1
        </condition>
        <text>cat</text>
        <math>y</math>
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
        <text>dog</text>
        <math>x</math>
        <text>optional text!</text>
      </case>
      <case>
        <condition>
          <copy prop="value" tname="../n" /> <= 1
        </condition>
        <text>cat</text>
        <math>y</math>
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


  it.only('references to outside components', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text hide name="x1">dog</text>
    <text hide name="x2">cat</text>
    <text hide name="x3">house</text>

    <mathinput name="n" />
    <p>original: <selectByCondition assignNames="(a,b)">
      <case>
        <condition>
          <copy prop="value" tname="n" /> < 0
        </condition>
        <copy tname="../x1" />
        <copy tname="../y1" />
      </case>
      <case name="secondcase" newnamespace>
        <condition>
          <copy prop="value" tname="../n" /> <= 1
        </condition>
        <copy tname="../x" />
        <copy tname="../y2" />
      </case>
      <else name="anelse">
        <copy tname="../x3" />
        <copy tname="../y3" />
      </else>
    </selectByCondition></p>

    <text hide name="y1">tree</text>
    <text hide name="y2">shrub</text>
    <text hide name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let option = {
      "Option 1: ": me.fromText("3xa"),
      "Option 2: ": me.fromText("4yb"),
      "Option 3: ": me.fromText('5zc')
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let q2 = components['/q2'].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);

    })
  });

  it('internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <select assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + <copy tname="x" />^2<copy tname="z1" />^3</math></p>
      <p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + <copy tname="x" />^2<copy tname="z2" />^3</math></p>
      <p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + <copy tname="x" />^2<copy tname="z3" />^3</math></p>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />

    <p>Copy x from within selection options</p>
    <p><copy name="qx" tname="q/x" /></p>
    <p><copy name="rx" tname="r/x" /></p>
    <p><copy name="sx" tname="s/x" /></p>
    <p><copy name="tx" tname="t/x" /></p>
    <p><copy name="ux" tname="u/x" /></p>

    <p>Copy select itself</p>
    <section name="repeat"><copy tname="_select1" /></section>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let option = {
      "Option 1: ": me.fromText("3x+a+x^2a^3"),
      "Option 2: ": me.fromText("4y+b+y^2b^3"),
      "Option 3: ": me.fromText('5z+c+z^2c^3')
    }

    let xoption = {
      "Option 1: ": "x",
      "Option 2: ": "y",
      "Option 3: ": "z"
    }


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let q2 = components['/q2'].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);
      let qx = components['/qx'].replacements[0].stateValues.value.tree;
      expect(qx).eq(xoption[q2string]);
      let repeatqmath = components["/repeat"].activeChildren[0].activeChildren[1].stateValues.value;
      expect(repeatqmath.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);
      let rx = components['/rx'].replacements[0].stateValues.value.tree;
      expect(rx).eq(xoption[r2string]);
      let repeatrmath = components["/repeat"].activeChildren[1].activeChildren[1].stateValues.value;
      expect(repeatrmath.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);
      let sx = components['/sx'].replacements[0].stateValues.value.tree;
      expect(sx).eq(xoption[s2string]);
      let repeatsmath = components["/repeat"].activeChildren[2].activeChildren[1].stateValues.value;
      expect(repeatsmath.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);
      let tx = components['/tx'].replacements[0].stateValues.value.tree;
      expect(tx).eq(xoption[t2string]);
      let repeattmath = components["/repeat"].activeChildren[3].activeChildren[1].stateValues.value;
      expect(repeattmath.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);
      let ux = components['/ux'].replacements[0].stateValues.value.tree;
      expect(ux).eq(xoption[u2string]);
      let repeatumath = components["/repeat"].activeChildren[4].activeChildren[1].stateValues.value;
      expect(repeatumath.equals(option[u2string])).eq(true);

    })
  });

  it('variants specified, select single', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <variantControl nvariants="5" variants="aVocado, broCColi , carrot ,Dill,eggplanT"/>

    <p>Selected variable:
    <select assignnames="x">
      <math variants="dill">d</math>
      <math variants="Carrot">c</math>
      <math variants="eggPlant">e</math>
      <math variants="avocadO">a</math>
      <math variants="broccOli">b</math>
    </select>
    </p>

    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variant = components['/x'].sharedParameters.variant;
      let expectedx = variant.substring(0, 1);

      let x = components['/x'].stateValues.value.tree;

      expect(x).eq(expectedx);

      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);

      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);

      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);

    })
  });

  it('variants specified, select multiple', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <variantControl nvariants="5" variants="avocado, brOccoli , carrot ,dill,   eggPlant  "/>

    <p>Selected variables:
    <aslist>
    <select assignnames="x, y, z" numbertoselect="3">
      <math variants="dill, carrot, avocado">d</math>
      <math variants="cArrOt,eggplant,eggplant">c</math>
      <math variants="eggplant ,broccoli ,dilL">e</math>
      <math variants="aVocado , avocado , broccoli">a</math>
      <math variants="  broccoli   , caRRot   , dill    ">b</math>
    </select>
    </aslist>
    </p>

    <p>Selected first variable: <copy name="x2" tname="x" /></p>
    <p>Selected second variable: <copy name="y2" tname="y" /></p>
    <p>Selected third variable: <copy name="z2" tname="z" /></p>
    <p>Selected variables repeated: <aslist><copy name="s2" tname="_select1" /></aslist></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variantMap = {
        avocado: ["d", "a", "a"],
        broccoli: ["e", "a", "b"],
        carrot: ["d", "c", "b"],
        dill: ["d", "e", "b"],
        eggplant: ["c", "c", "e"]
      }

      let variant = components['/x'].sharedParameters.variant;
      let variantVars = variantMap[variant];

      let x = components['/x'].stateValues.value.tree;

      expect(variantVars.includes(x)).eq(true);
      variantVars.splice(variantVars.indexOf(x), 1);

      let y = components['/y'].stateValues.value.tree;
      expect(variantVars.includes(y)).eq(true);
      variantVars.splice(variantVars.indexOf(y), 1);

      let z = components['/z'].stateValues.value.tree;
      expect(z).eq(variantVars[0]);

      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(x);
      let yorig = components['/_select1'].replacements[1].stateValues.value.tree;
      expect(yorig).eq(y);
      let zorig = components['/_select1'].replacements[2].stateValues.value.tree;
      expect(zorig).eq(z);

      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(x);
      let y2 = components['/y2'].replacements[0].stateValues.value.tree;
      expect(y2).eq(y);
      let z2 = components['/z2'].replacements[0].stateValues.value.tree;
      expect(z2).eq(z);

      let x3 = components['/s2'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(x);
      let y3 = components['/s2'].replacements[0].replacements[1].stateValues.value.tree;
      expect(y3).eq(y);
      let z3 = components['/s2'].replacements[0].replacements[2].stateValues.value.tree;
      expect(z3).eq(z);

    })
  });

  it('select text as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <select assignnames="w1,w2,w3,w4,w5" numbertoselect="5">
      Lorem, ipsum ,dolor, sit, amet, consectetur, adipiscing, elit
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let wordsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let word = components['/w' + ind].stateValues.value;
        expect(["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"].includes(word)).eq(true);
        expect([wordsSoFar].includes(word)).eq(false);
        wordsSoFar.push(word);
      }
    })
  });

  it('select numbers as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <select assignnames="n1,n2,n3,n4,n5,n6,n7,n8,n9,n10" numbertoselect="10" withReplacement>
      2,3,5,7,11,13,17,19
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 10; ind++) {
        let num = components['/n' + ind].stateValues.value;
        expect([2, 3, 5, 7, 11, 13, 17, 19].includes(num)).eq(true);
      }
    })
  });

  it('select weighted', () => {

    // TODO: this test seems to fail with num Y < 17 once in awhile
    // even though it should fail less than 0.1% of the time
    // Is there a flaw?

    let numX = 0, numY = 0, numZ = 0;

    for (let ind = 1; ind <= 200; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantcontrol nvariants="200"/>
        <aslist>
        <select assignnames="x">
          <text selectweight="0.2">x</text>
          <text>y</text>
          <text selectweight="5">z</text></select>
        </aslist>
        `,
          requestedVariant: { index: ind },
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let x = components['/x'].stateValues.value;
        if (x === "z") {
          numZ++;
        } else if (x === "y") {
          numY++;
        } else {
          numX++;
        }
      });

    }

    cy.window().then((win) => {

      expect(numX).greaterThan(0);
      expect(numX).lessThan(15);
      expect(numY).greaterThan(17);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(140);

    })
  });

  it('select weighted with replacement', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <select assignnames="x1" numbertoselect="200" withreplacement>
      <text selectweight="0.2">x</text>
      <text>y</text>
      <text selectweight="5">z</text>
    </select>
    </aslist>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let numX = 0, numY = 0, numZ = 0;
      let selectReplacements = components['/_select1'].replacements;
      for (let ind = 0; ind < 200; ind++) {
        let x = selectReplacements[ind].stateValues.value;
        if (x === "x") {
          numX++;
        } else if (x === "y") {
          numY++;
        } else {
          numZ++;
        }
      }
      expect(numX).greaterThan(0);
      expect(numX).lessThan(15);
      expect(numY).greaterThan(20);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(150);

    })
  });

  it('select weighted without replacement', () => {

    let numX = 0, numY = 0, numZ = 0, numUVW = 0;

    for (let ind = 1; ind <= 200; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantcontrol nvariants="200"/>
        <aslist>
        <select assignnames="x,y" numbertoselect="2">
          <text selectweight="0.1">u</text>
          <text selectweight="0.1">v</text>
          <text selectweight="0.1">w</text>
          <text selectweight="5">x</text>
          <text>y</text>
          <text selectweight="10">z</text>
        </select>
        </aslist>
        `,
          requestedVariant: { index: ind },
        }, "*");
      });


      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let x = components['/x'].stateValues.value;
        if (x === "z") {
          numZ++;
        } else if (x === "y") {
          numY++;
        } else if (x === "x") {
          numX++;
        } else {
          numUVW++;
        }
        let y = components['/y'].stateValues.value;
        if (y === "z") {
          numZ++;
        } else if (y === "y") {
          numY++;
        } else if (y === "x") {
          numX++;
        } else {
          numUVW++;
        }
      });

    }

    cy.window().then((win) => {
      expect(numUVW).greaterThan(0);
      expect(numUVW).lessThan(15);
      expect(numX).greaterThan(150);
      expect(numY).greaterThan(10);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(170);

    })
  });

  it('references to internal assignnames', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>

    <select name="original" assignnames="q,r,s,t,u,v,w" numbertoselect="7" withreplacement>
      <p><select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
      <p><selectfromsequence assignnames="q,r" numbertoselect="2">a,z</selectfromsequence><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
      <p><text name="q">z</text><selectfromsequence assignnames="r" numbertoselect="1">u,z</selectfromsequence><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
      <p><text name="q">q</text><text name="r">r</text><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />
    <copy name="v2" tname="v" />
    <copy name="w2" tname="w" />

    <p>Copy q and r and their copies from within selected options</p>
    <p><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /><copy name="qq2" tname="q/q2" /><copy name="qr2" tname="q/r2" /></p>
    <p><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /><copy name="rq2" tname="r/q2" /><copy name="rr2" tname="r/r2" /></p>
    <p><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /><copy name="sq2" tname="s/q2" /><copy name="sr2" tname="s/r2" /></p>
    <p><copy name="tq" tname="t/q" /><copy name="tr" tname="t/r" /><copy name="tq2" tname="t/q2" /><copy name="tr2" tname="t/r2" /></p>
    <p><copy name="uq" tname="u/q" /><copy name="ur" tname="u/r" /><copy name="uq2" tname="u/q2" /><copy name="ur2" tname="u/r2" /></p>
    <p><copy name="vq" tname="v/q" /><copy name="vr" tname="v/r" /><copy name="vq2" tname="v/q2" /><copy name="vr2" tname="v/r2" /></p>
    <p><copy name="wq" tname="w/q" /><copy name="wr" tname="w/r" /><copy name="wq2" tname="w/q2" /><copy name="wr2" tname="w/r2" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].activeChildren.map(x => x.stateValues.value)
      let rs = components['/r'].activeChildren.map(x => x.stateValues.value)
      let ss = components['/s'].activeChildren.map(x => x.stateValues.value)
      let ts = components['/t'].activeChildren.map(x => x.stateValues.value)
      let us = components['/u'].activeChildren.map(x => x.stateValues.value)
      let vs = components['/v'].activeChildren.map(x => x.stateValues.value)
      let ws = components['/w'].activeChildren.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let v2s = components['/v2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let w2s = components['/w2'].replacements[0].activeChildren.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);
      expect(v2s).eqls(vs);
      expect(w2s).eqls(ws);

      let q3s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
        components['/qq2'].replacements[0].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let r3s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
        components['/rq2'].replacements[0].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let s3s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
        components['/sq2'].replacements[0].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let t3s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
        components['/tq2'].replacements[0].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let u3s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
        components['/uq2'].replacements[0].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].replacements[0].stateValues.value,
      ]
      let v3s = [
        components['/vq'].replacements[0].stateValues.value,
        components['/vr'].replacements[0].stateValues.value,
        components['/vq2'].replacements[0].replacements[0].stateValues.value,
        components['/vr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let w3s = [
        components['/wq'].replacements[0].stateValues.value,
        components['/wr'].replacements[0].stateValues.value,
        components['/wq2'].replacements[0].replacements[0].stateValues.value,
        components['/wr2'].replacements[0].replacements[0].stateValues.value,
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);
      expect(v3s).eqls(vs);
      expect(w3s).eqls(ws);

    })
  });

  it('references to internal assignnames, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <select name="original" assignnames="q,r,s,t,u,v,w" numbertoselect="7" withreplacement>
      <p><select name="s" newnamespace assignnames="q,r" numbertoselect="2">a,e,i,o,u</select><copy name="q2" tname="s/q" /><copy name="r2" tname="s/r" /></p>
      <p><selectfromsequence name="s" newnamespace assignnames="q,r" numbertoselect="2">a,z</selectfromsequence><copy name="q2" tname="s/q" /><copy name="r2" tname="s/r" /></p>
      <p><selectfromsequence name="s" newnamespace assignnames="q,r" numbertoselect="2" withreplacement>u,z</selectfromsequence><copy name="q2" tname="s/q" /><copy name="r2" tname="s/r" /></p>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />
    <copy name="v2" tname="v" />
    <copy name="w2" tname="w" />

    <p>Selected options repeated, no p</p>
    <p><copy name="q3" tname="q/s" /></p>
    <p><copy name="r3" tname="r/s" /></p>
    <p><copy name="s3" tname="s/s" /></p>
    <p><copy name="t3" tname="t/s" /></p>
    <p><copy name="u3" tname="u/s" /></p>
    <p><copy name="v3" tname="v/s" /></p>
    <p><copy name="w3" tname="w/s" /></p>

    <p>Copy q and r from within selected options</p>
    <p><copy name="qq" tname="q/s/q" /><copy name="qr" tname="q/s/r" /><copy name="qq2" tname="q/q2" /><copy name="qr2" tname="q/r2" /></p>
    <p><copy name="rq" tname="r/s/q" /><copy name="rr" tname="r/s/r" /><copy name="rq2" tname="r/q2" /><copy name="rr2" tname="r/r2" /></p>
    <p><copy name="sq" tname="s/s/q" /><copy name="sr" tname="s/s/r" /><copy name="sq2" tname="s/q2" /><copy name="sr2" tname="s/r2" /></p>
    <p><copy name="tq" tname="t/s/q" /><copy name="tr" tname="t/s/r" /><copy name="tq2" tname="t/q2" /><copy name="tr2" tname="t/r2" /></p>
    <p><copy name="uq" tname="u/s/q" /><copy name="ur" tname="u/s/r" /><copy name="uq2" tname="u/q2" /><copy name="ur2" tname="u/r2" /></p>
    <p><copy name="vq" tname="v/s/q" /><copy name="vr" tname="v/s/r" /><copy name="vq2" tname="v/q2" /><copy name="vr2" tname="v/r2" /></p>
    <p><copy name="wq" tname="w/s/q" /><copy name="wr" tname="w/s/r" /><copy name="wq2" tname="w/q2" /><copy name="wr2" tname="w/r2" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/s\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].activeChildren.map(x => x.stateValues.value)
      let rs = components['/r'].activeChildren.map(x => x.stateValues.value)
      let ss = components['/s'].activeChildren.map(x => x.stateValues.value)
      let ts = components['/t'].activeChildren.map(x => x.stateValues.value)
      let us = components['/u'].activeChildren.map(x => x.stateValues.value)
      let vs = components['/v'].activeChildren.map(x => x.stateValues.value)
      let ws = components['/w'].activeChildren.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let v2s = components['/v2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let w2s = components['/w2'].replacements[0].activeChildren.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);
      expect(v2s).eqls(vs);
      expect(w2s).eqls(ws);

      let q3s = components['/q3'].replacements[0].replacements.map(x => x.stateValues.value);
      let r3s = components['/r3'].replacements[0].replacements.map(x => x.stateValues.value);
      let s3s = components['/s3'].replacements[0].replacements.map(x => x.stateValues.value);
      let t3s = components['/t3'].replacements[0].replacements.map(x => x.stateValues.value);
      let u3s = components['/u3'].replacements[0].replacements.map(x => x.stateValues.value);
      let v3s = components['/v3'].replacements[0].replacements.map(x => x.stateValues.value);
      let w3s = components['/w3'].replacements[0].replacements.map(x => x.stateValues.value);

      expect(q3s).eqls(qs.slice(0, 2));
      expect(r3s).eqls(rs.slice(0, 2));
      expect(s3s).eqls(ss.slice(0, 2));
      expect(t3s).eqls(ts.slice(0, 2));
      expect(u3s).eqls(us.slice(0, 2));
      expect(v3s).eqls(vs.slice(0, 2));
      expect(w3s).eqls(ws.slice(0, 2));

      let q4s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
        components['/qq2'].replacements[0].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let r4s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
        components['/rq2'].replacements[0].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let s4s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
        components['/sq2'].replacements[0].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let t4s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
        components['/tq2'].replacements[0].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let u4s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
        components['/uq2'].replacements[0].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].replacements[0].stateValues.value,
      ]
      let v4s = [
        components['/vq'].replacements[0].stateValues.value,
        components['/vr'].replacements[0].stateValues.value,
        components['/vq2'].replacements[0].replacements[0].stateValues.value,
        components['/vr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let w4s = [
        components['/wq'].replacements[0].stateValues.value,
        components['/wr'].replacements[0].stateValues.value,
        components['/wq2'].replacements[0].replacements[0].stateValues.value,
        components['/wr2'].replacements[0].replacements[0].stateValues.value,
      ]

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);
      expect(v4s).eqls(vs);
      expect(w4s).eqls(ws);

    })
  });

  // can no longer reference between named grandchildren using their original names
  it.skip('references to internal assignnames, named grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <select name="original" assignnames="(q,qq, qr),(r, rq,rr),(s, sq, sr),(t, tq, tr),(u,uq,ur)" numbertoselect="5" withreplacement>
      <p><select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
      <p><selectfromsequence assignnames="q,r" numbertoselect="2">a,z</selectfromsequence><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p><copy name="qq2" tname="q/q" /><copy name="qr2" tname="q/r" /><copy name="qq3" tname="qq" /><copy name="qr3" tname="qr" /></p>
    <p><copy name="rq2" tname="r/q" /><copy name="rr2" tname="r/r" /><copy name="rq3" tname="rq" /><copy name="rr3" tname="rr" /></p>
    <p><copy name="sq2" tname="s/q" /><copy name="sr2" tname="s/r" /><copy name="sq3" tname="sq" /><copy name="sr3" tname="sr" /></p>
    <p><copy name="tq2" tname="t/q" /><copy name="tr2" tname="t/r" /><copy name="tq3" tname="tq" /><copy name="tr3" tname="tr" /></p>
    <p><copy name="uq2" tname="u/q" /><copy name="ur2" tname="u/r" /><copy name="uq3" tname="uq" /><copy name="ur3" tname="ur" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq2'].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].stateValues.value,
      ];
      let q4s = [
        components['/qq3'].replacements[0].stateValues.value,
        components['/qr3'].replacements[0].stateValues.value,
      ];
      let r3s = [
        components['/rq2'].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rq3'].replacements[0].stateValues.value,
        components['/rr3'].replacements[0].stateValues.value,
      ];
      let s3s = [
        components['/sq2'].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sq3'].replacements[0].stateValues.value,
        components['/sr3'].replacements[0].stateValues.value,
      ];
      let t3s = [
        components['/tq2'].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].stateValues.value,
      ];
      let t4s = [
        components['/tq3'].replacements[0].stateValues.value,
        components['/tr3'].replacements[0].stateValues.value,
      ];
      let u3s = [
        components['/uq2'].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].stateValues.value,
      ];
      let u4s = [
        components['/uq3'].replacements[0].stateValues.value,
        components['/ur3'].replacements[0].stateValues.value,
      ];


      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);

    })
  });

  // can no longer reference between named grandchildren using their original names
  it.skip('references to internal assignnames, newnamespaces, named grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
        <select name="original" assignnames="(q,qq, qr),(r, rq,rr),(s, sq, sr),(t, tq, tr),(u,uq,ur)" numbertoselect="5" withreplacement>
      <p><select name="a" assignnames="q,r" numbertoselect="2" newnamespace>a,e,i,o,u</select><copy name="q2" tname="a/q" /><copy name="r2" tname="a/r" /></p>
      <p><selectfromsequence name="b" assignnames="q,r" numbertoselect="2" newnamespace>a,z</selectfromsequence><copy name="q2" tname="b/q" /><copy name="r2" tname="b/r" /></p>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p><copy name="qq2" tname="q/q" /><copy name="qr2" tname="q/r" /><copy name="qq3" tname="qq" /><copy name="qr3" tname="qr" /></p>
    <p><copy name="rq2" tname="r/q" /><copy name="rr2" tname="r/r" /><copy name="rq3" tname="rq" /><copy name="rr3" tname="rr" /></p>
    <p><copy name="sq2" tname="s/q" /><copy name="sr2" tname="s/r" /><copy name="sq3" tname="sq" /><copy name="sr3" tname="sr" /></p>
    <p><copy name="tq2" tname="t/q" /><copy name="tr2" tname="t/r" /><copy name="tq3" tname="tq" /><copy name="tr3" tname="tr" /></p>
    <p><copy name="uq2" tname="u/q" /><copy name="ur2" tname="u/r" /><copy name="uq3" tname="uq" /><copy name="ur3" tname="ur" /></p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq2'].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].stateValues.value,
      ];
      let q4s = [
        components['/qq3'].replacements[0].stateValues.value,
        components['/qr3'].replacements[0].stateValues.value,
      ];
      let r3s = [
        components['/rq2'].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rq3'].replacements[0].stateValues.value,
        components['/rr3'].replacements[0].stateValues.value,
      ];
      let s3s = [
        components['/sq2'].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sq3'].replacements[0].stateValues.value,
        components['/sr3'].replacements[0].stateValues.value,
      ];
      let t3s = [
        components['/tq2'].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].stateValues.value,
      ];
      let t4s = [
        components['/tq3'].replacements[0].stateValues.value,
        components['/tr3'].replacements[0].stateValues.value,
      ];
      let u3s = [
        components['/uq2'].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].stateValues.value,
      ];
      let u4s = [
        components['/uq3'].replacements[0].stateValues.value,
        components['/ur3'].replacements[0].stateValues.value,
      ];


      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);

    })
  });

  it('references to select of selects', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <select name="original" assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
      <selectfromsequence assignnames="q,r" numbertoselect="2">a,z</selectfromsequence>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r</p>
    <p><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /></p>
    <p><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /></p>
    <p><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /></p>
    <p><copy name="tq" tname="t/q" /><copy name="tr" tname="t/r" /></p>
    <p><copy name="uq" tname="u/q" /><copy name="ur" tname="u/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements[0].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].replacements.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
      ]
      let r3s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
      ]
      let s3s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
      ]
      let t3s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
      ]
      let u3s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

    })
  });

  it('references to select of selects, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>

    <select name="original" assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <select name="a" newnamespace assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
      <selectfromsequence name="b" newnamespace assignnames="q,r" numbertoselect="2">a,z</selectfromsequence>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r</p>
    <p><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /></p>
    <p><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /></p>
    <p><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /></p>
    <p><copy name="tq" tname="t/q" /><copy name="tr" tname="t/r" /></p>
    <p><copy name="uq" tname="u/q" /><copy name="ur" tname="u/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements[0].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].replacements.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
      ]
      let r3s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
      ]
      let s3s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
      ]
      let t3s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
      ]
      let u3s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

    })
  });

  it('references to select of selects of selects', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>

    <select assignnames="q,r,s" numbertoselect="3" withreplacement>
      <select assignnames="q,r,s" numbertoselect="3" withreplacement>
        <select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
        <selectfromsequence assignnames="q,r" numbertoselect="2">a,j</selectfromsequence>
      </select>
      <select assignnames="q,r,s" numbertoselect="3">
        <select assignnames="q,r" numbertoselect="2">v,w,x,y,z</select>
        <selectfromsequence assignnames="q,r" numbertoselect="2">k,n</selectfromsequence>
        <selectfromsequence assignnames="q,r" numbertoselect="2">x,z</selectfromsequence>
        <select assignnames="q,r" numbertoselect="2">p,d,q</select>
      </select>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /><copy name="qs" tname="q/s" /></p>
    <p><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /><copy name="rs" tname="r/s" /></p>
    <p><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /><copy name="ss" tname="s/s" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p><copy name="qqq" tname="q/q/q" /><copy name="qqr" tname="q/q/r" /><copy name="qrq" tname="q/r/q" /><copy name="qrr" tname="q/r/r" /><copy name="qsq" tname="q/s/q" /><copy name="qsr" tname="q/s/r" /></p>
    <p><copy name="rqq" tname="r/q/q" /><copy name="rqr" tname="r/q/r" /><copy name="rrq" tname="r/r/q" /><copy name="rrr" tname="r/r/r" /><copy name="rsq" tname="r/s/q" /><copy name="rsr" tname="r/s/r" /></p>
    <p><copy name="sqq" tname="s/q/q" /><copy name="sqr" tname="s/q/r" /><copy name="srq" tname="s/r/q" /><copy name="srr" tname="s/r/r" /><copy name="ssq" tname="s/s/q" /><copy name="ssr" tname="s/s/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/s\\/s\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let rs = components['/r'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let ss = components['/s'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      let q2s = components['/q2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let r2s = components['/r2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let s2s = components['/s2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);

      let q3s = [
        ...components['/qq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let r3s = [
        ...components['/rq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let s3s = [
        ...components['/sq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/sr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/ss'].replacements[0].replacements.map(x => x.stateValues.value),
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);

      let q4s = [
        components['/qqq'].replacements[0].stateValues.value,
        components['/qqr'].replacements[0].stateValues.value,
        components['/qrq'].replacements[0].stateValues.value,
        components['/qrr'].replacements[0].stateValues.value,
        components['/qsq'].replacements[0].stateValues.value,
        components['/qsr'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rqq'].replacements[0].stateValues.value,
        components['/rqr'].replacements[0].stateValues.value,
        components['/rrq'].replacements[0].stateValues.value,
        components['/rrr'].replacements[0].stateValues.value,
        components['/rsq'].replacements[0].stateValues.value,
        components['/rsr'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sqq'].replacements[0].stateValues.value,
        components['/sqr'].replacements[0].stateValues.value,
        components['/srq'].replacements[0].stateValues.value,
        components['/srr'].replacements[0].stateValues.value,
        components['/ssq'].replacements[0].stateValues.value,
        components['/ssr'].replacements[0].stateValues.value,
      ];

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);


    })
  });

  it('references to select of selects of selects, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>

    <select name="a" newnamespace assignnames="q,r,s" numbertoselect="3" withreplacement>
      <select name="b" newnamespace assignnames="q,r,s" numbertoselect="3" withreplacement>
        <select name="c" newnamespace assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
        <selectfromsequence name="d" newnamespace assignnames="q,r" numbertoselect="2">a,j</selectfromsequence>
      </select>
      <select name="e" newnamespace assignnames="q,r,s" numbertoselect="3">
        <select name="f" newnamespace assignnames="q,r" numbertoselect="2">v,w,x,y,z</select>
        <selectfromsequence name="g" newnamespace assignnames="q,r" numbertoselect="2">k,n</selectfromsequence>
        <selectfromsequence name="h" newnamespace assignnames="q,r" numbertoselect="2">x,z</selectfromsequence>
        <select name="i" newnamespace assignnames="q,r" numbertoselect="2">p,d,q</select>
      </select>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="a/q" /></p>
    <p><copy name="r2" tname="a/r" /></p>
    <p><copy name="s2" tname="a/s" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p><copy name="qq" tname="a/q/q" /><copy name="qr" tname="a/q/r" /><copy name="qs" tname="a/q/s" /></p>
    <p><copy name="rq" tname="a/r/q" /><copy name="rr" tname="a/r/r" /><copy name="rs" tname="a/r/s" /></p>
    <p><copy name="sq" tname="a/s/q" /><copy name="sr" tname="a/s/r" /><copy name="ss" tname="a/s/s" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p><copy name="qqq" tname="a/q/q/q" /><copy name="qqr" tname="a/q/q/r" /><copy name="qrq" tname="a/q/r/q" /><copy name="qrr" tname="a/q/r/r" /><copy name="qsq" tname="a/q/s/q" /><copy name="qsr" tname="a/q/s/r" /></p>
    <p><copy name="rqq" tname="a/r/q/q" /><copy name="rqr" tname="a/r/q/r" /><copy name="rrq" tname="a/r/r/q" /><copy name="rrr" tname="a/r/r/r" /><copy name="rsq" tname="a/r/s/q" /><copy name="rsr" tname="a/r/s/r" /></p>
    <p><copy name="sqq" tname="a/s/q/q" /><copy name="sqr" tname="a/s/q/r" /><copy name="srq" tname="a/s/r/q" /><copy name="srr" tname="a/s/r/r" /><copy name="ssq" tname="a/s/s/q" /><copy name="ssr" tname="a/s/s/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/a\\/s\\/s\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/a/q'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let rs = components['/a/r'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let ss = components['/a/s'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      let q2s = components['/q2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let r2s = components['/r2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let s2s = components['/s2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);

      let q3s = [
        ...components['/qq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let r3s = [
        ...components['/rq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let s3s = [
        ...components['/sq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/sr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/ss'].replacements[0].replacements.map(x => x.stateValues.value),
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);

      let q4s = [
        components['/qqq'].replacements[0].stateValues.value,
        components['/qqr'].replacements[0].stateValues.value,
        components['/qrq'].replacements[0].stateValues.value,
        components['/qrr'].replacements[0].stateValues.value,
        components['/qsq'].replacements[0].stateValues.value,
        components['/qsr'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rqq'].replacements[0].stateValues.value,
        components['/rqr'].replacements[0].stateValues.value,
        components['/rrq'].replacements[0].stateValues.value,
        components['/rrr'].replacements[0].stateValues.value,
        components['/rsq'].replacements[0].stateValues.value,
        components['/rsr'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sqq'].replacements[0].stateValues.value,
        components['/sqr'].replacements[0].stateValues.value,
        components['/srq'].replacements[0].stateValues.value,
        components['/srr'].replacements[0].stateValues.value,
        components['/ssq'].replacements[0].stateValues.value,
        components['/ssr'].replacements[0].stateValues.value,
      ];

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);


    })
  });

  it("references to named grandchildren's children", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select assignnames="(a,b,c,d)">
    <group>
      <math name="h"><math name="w">x</math><math>y</math></math>
      <math simplify><math name="q">z</math> + 2<copy name="v" tname="q" /></math>
      <copy tname="a/w" />
      <copy tname="b/q" />
    </group>
    <group>
      <math name="h"><math name="w">u</math><math>v</math></math>
      <math simplify><math name="q">t</math> + 2<copy name="v" tname="q" /></math>
      <copy tname="a/w" />
      <copy tname="b/q" />
    </group>
    </select>
    
    <p>Copy grandchidren</p>
    <p><copy name="a2" tname="a" /></p>
    <p><copy name="b2" tname="b" /></p>
    <p><copy name="c2" tname="c" /></p>
    <p><copy name="d2" tname="d" /></p>
    
    <p>Copy named children of grandchild</p>
    <p><copy name="w2" tname="a/w" /></p>
    <p><copy name="v2" tname="b/v" /></p>
    
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let options = [{
      a: "x y",
      b: "3 z",
      c: "x",
      d: "z",
      v: "z",
      w: "x",
    },
    {
      a: "u v",
      b: "3 t",
      c: "u",
      d: "t",
      v: "t",
      w: "u",
    }];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let chosenChildren = components['/_select1'].stateValues.recursiveReplacements.map(x => components[x.componentName])
      let option = options[components['/_select1'].stateValues.selectedIndices[0]];

      expect(chosenChildren[0].stateValues.value.toString()).eq(option.a)
      expect(chosenChildren[1].stateValues.value.toString()).eq(option.b)
      expect(chosenChildren[2].stateValues.value.toString()).eq(option.c)
      expect(chosenChildren[3].stateValues.value.toString()).eq(option.d)


      let a2 = components['/a2'].replacements[0].stateValues.value.toString();
      let b2 = components['/b2'].replacements[0].stateValues.value.toString();
      let c2 = components['/c2'].replacements[0].replacements[0].stateValues.value.toString();
      let d2 = components['/d2'].replacements[0].replacements[0].stateValues.value.toString();
      let v2 = components['/v2'].replacements[0].replacements[0].stateValues.value.toString();
      let w2 = components['/w2'].replacements[0].stateValues.value.toString();

      expect(a2).eq(option.a);
      expect(b2).eq(option.b);
      expect(c2).eq(option.c);
      expect(d2).eq(option.d);
      expect(v2).eq(option.v);
      expect(w2).eq(option.w);

    })
  });

  it("references to named grandchildren's children, newnamespaces", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select assignnames="(a,b,c,d)">
    <group>
      <math name="h" newnamespace><math name="w">x</math><math>y</math></math>
      <math simplify newnamespace name="a"><math name="q">z</math> + 2<copy name="v" tname="q" /></math>
      <copy tname="a/w" />
      <copy tname="b/q" />
    </group>
    <group>
      <math name="h" newnamespace><math name="w">u</math><math>v</math></math>
      <math simplify newnamespace name="a"><math name="q">t</math> + 2<copy name="v" tname="q" /></math>
      <copy tname="a/w" />
      <copy tname="b/q" />
    </group>
    </select>
    
    <p>Copy grandchidren</p>
    <p><copy name="a2" tname="a" /></p>
    <p><copy name="b2" tname="b" /></p>
    <p><copy name="c2" tname="c" /></p>
    <p><copy name="d2" tname="d" /></p>
    
    <p>Copy named children of grandchild</p>
    <p><copy name="w2" tname="a/w" /></p>
    <p><copy name="v2" tname="b/v" /></p>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let options = [{
      a: "x y",
      b: "3 z",
      c: "x",
      d: "z",
      v: "z",
      w: "x",
    },
    {
      a: "u v",
      b: "3 t",
      c: "u",
      d: "t",
      v: "t",
      w: "u",
    }];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let chosenChildren = components['/_select1'].stateValues.recursiveReplacements.map(x => components[x.componentName])
      let option = options[components['/_select1'].stateValues.selectedIndices[0]];

      expect(chosenChildren[0].stateValues.value.toString()).eq(option.a)
      expect(chosenChildren[1].stateValues.value.toString()).eq(option.b)
      expect(chosenChildren[2].stateValues.value.toString()).eq(option.c)
      expect(chosenChildren[3].stateValues.value.toString()).eq(option.d)


      let a2 = components['/a2'].replacements[0].stateValues.value.toString();
      let b2 = components['/b2'].replacements[0].stateValues.value.toString();
      let c2 = components['/c2'].replacements[0].replacements[0].stateValues.value.toString();
      let d2 = components['/d2'].replacements[0].replacements[0].stateValues.value.toString();
      let v2 = components['/v2'].replacements[0].replacements[0].stateValues.value.toString();
      let w2 = components['/w2'].replacements[0].stateValues.value.toString();

      expect(a2).eq(option.a);
      expect(b2).eq(option.b);
      expect(c2).eq(option.c);
      expect(d2).eq(option.d);
      expect(v2).eq(option.v);
      expect(w2).eq(option.w);

    })
  });

  it("select of a map of a select, with references", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist name="list1">
    <select assignnames="j,k,l" numbertoselect="3" withreplacement>
    <map assignnames="a,b">
      <template>
        <select assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><copyFromSubs/>^2</math><math><copyFromSubs/>^6</math></group>
          <group><math><copyFromSubs/>^3</math><math><copyFromSubs/>^7</math></group>
          <group><math><copyFromSubs/>^4</math><math><copyFromSubs/>^8</math></group>
          <group><math><copyFromSubs/>^5</math><math><copyFromSubs/>^9</math></group>
        </select>
      </template>
      <substitutions>
        <math>x</math><math>y</math>
      </substitutions>
    </map>
    <map assignnames="a,b">
      <template>
        <select assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><copyFromSubs/>2</math><math><copyFromSubs/>6</math></group>
          <group><math><copyFromSubs/>3</math><math><copyFromSubs/>7</math></group>
          <group><math><copyFromSubs/>4</math><math><copyFromSubs/>8</math></group>
          <group><math><copyFromSubs/>5</math><math><copyFromSubs/>9</math></group>
        </select>
      </template>
      <substitutions>
        <math>u</math><math>v</math>
      </substitutions>
    </map>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2"><copy name="s2" tname="_select1" /></aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    <copy name="j2" tname="j" />
    <copy name="k2" tname="k" />
    <copy name="l2" tname="l" />
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    <copy name="p1" tname="j/a/p" /><copy name="p2" tname="j/a/q" /><copy name="p3" tname="j/a/r" /><copy name="p4" tname="j/a/s" /><copy name="p5" tname="j/b/p" /><copy name="p6" tname="j/b/q" /><copy name="p7" tname="j/b/r" /><copy name="p8" tname="j/b/s" />
    <copy name="p9" tname="k/a/p" /><copy name="p10" tname="k/a/q" /><copy name="p11" tname="k/a/r" /><copy name="p12" tname="k/a/s" /><copy name="p13" tname="k/b/p" /><copy name="p14" tname="k/b/q" /><copy name="p15" tname="k/b/r" /><copy name="p16" tname="k/b/s" />
    <copy name="p17" tname="l/a/p" /><copy name="p18" tname="l/a/q" /><copy name="p19" tname="l/a/r" /><copy name="p20" tname="l/a/s" /><copy name="p21" tname="l/b/p" /><copy name="p22" tname="l/b/q" /><copy name="p23" tname="l/b/r" /><copy name="p24" tname="l/b/s" />
    </aslist></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let theList1 = components['/list1'].activeChildren.map(x => x.stateValues.value.toString())
      let theList2 = components['/list2'].activeChildren.map(x => x.stateValues.value.toString())
      let theList3 = components['/list3'].activeChildren.map(x => x.stateValues.value.toString())

      expect(theList2).eqls(theList1);
      expect(theList3).eqls(theList1);

      let theList4 = [...Array(24).keys()].map(i => components['/p' + (i + 1)].replacements[0].stateValues.value.toString());

      expect(theList4).eqls(theList1);

    })
  });

  it("select of a map of a select, new namespaces", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist name="list1">
    <select name="s" newnamespace assignnames="j,k,l" numbertoselect="3" withreplacement>
    <map name="m" newnamespace assignnames="a,b">
      <template>
        <select name="v" newnamespace assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><copyFromSubs/>^2</math><math><copyFromSubs/>^6</math></group>
          <group><math><copyFromSubs/>^3</math><math><copyFromSubs/>^7</math></group>
          <group><math><copyFromSubs/>^4</math><math><copyFromSubs/>^8</math></group>
          <group><math><copyFromSubs/>^5</math><math><copyFromSubs/>^9</math></group>
        </select>
      </template>
      <substitutions>
        <math>x</math><math>y</math>
      </substitutions>
    </map>
    <map name="n" newnamespace assignnames="a,b">
      <template>
        <select name="v" newnamespace assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><copyFromSubs/>2</math><math><copyFromSubs/>6</math></group>
          <group><math><copyFromSubs/>3</math><math><copyFromSubs/>7</math></group>
          <group><math><copyFromSubs/>4</math><math><copyFromSubs/>8</math></group>
          <group><math><copyFromSubs/>5</math><math><copyFromSubs/>9</math></group>
        </select>
      </template>
      <substitutions>
        <math>u</math><math>v</math>
      </substitutions>
    </map>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2"><copy name="s2" tname="s" /></aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    <copy name="j2" tname="s/j" />
    <copy name="k2" tname="s/k" />
    <copy name="l2" tname="s/l" />
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    <copy name="p1" tname="s/j/a/v/p" /><copy name="p2" tname="s/j/a/v/q" /><copy name="p3" tname="s/j/a/v/r" /><copy name="p4" tname="s/j/a/v/s" /><copy name="p5" tname="s/j/b/v/p" /><copy name="p6" tname="s/j/b/v/q" /><copy name="p7" tname="s/j/b/v/r" /><copy name="p8" tname="s/j/b/v/s" />
    <copy name="p9" tname="s/k/a/v/p" /><copy name="p10" tname="s/k/a/v/q" /><copy name="p11" tname="s/k/a/v/r" /><copy name="p12" tname="s/k/a/v/s" /><copy name="p13" tname="s/k/b/v/p" /><copy name="p14" tname="s/k/b/v/q" /><copy name="p15" tname="s/k/b/v/r" /><copy name="p16" tname="s/k/b/v/s" />
    <copy name="p17" tname="s/l/a/v/p" /><copy name="p18" tname="s/l/a/v/q" /><copy name="p19" tname="s/l/a/v/r" /><copy name="p20" tname="s/l/a/v/s" /><copy name="p21" tname="s/l/b/v/p" /><copy name="p22" tname="s/l/b/v/q" /><copy name="p23" tname="s/l/b/v/r" /><copy name="p24" tname="s/l/b/v/s" />
    </aslist></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let theList1 = components['/list1'].activeChildren.map(x => x.stateValues.value.toString())
      let theList2 = components['/list2'].activeChildren.map(x => x.stateValues.value.toString())
      let theList3 = components['/list3'].activeChildren.map(x => x.stateValues.value.toString())

      expect(theList2).eqls(theList1);
      expect(theList3).eqls(theList1);

      let theList4 = [...Array(24).keys()].map(i => components['/p' + (i + 1)].replacements[0].stateValues.value.toString());

      expect(theList4).eqls(theList1);

    })
  });

  it('two selects with mutual dependence, numbertoselect initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><aslist>
    <select name="s1" assignnames="x1, y1, z1" withReplacement>
      <numberToSelect><copy prop="numberToSelect" tname="s2" /></numberToSelect>
      <math>x</math><math>y</math><math>z</math>
    </select>
  </aslist></p>
  
  <p><aslist>
    <select name="s2" assignnames="x2, y2, z2">
      <numberToSelect><copy tname="n" /></numberToSelect>
      <withReplacement><copy prop="withReplacement" tname="s1" /></withReplacement>
      <math>u</math><math>v</math><math>w</math>
    </select>
  </aslist></p>
  
  <p><copy name="x1a" tname="x1" />, <copy name="y1a" tname="y1" />, <copy name="z1a" tname="z1" /></p>
  <p><copy name="x2a" tname="x2" />, <copy name="y2a" tname="y2" />, <copy name="z2a" tname="z2" /></p>
  
  <p> 
    <copy name="n2" tname="n3" />
    <copy name="n" tname="num1" />
    <math name="num1"><copy tname="n2" />+<copy tname="num2" /></math>
    <math name="num2"><copy tname="n3" />+<copy tname="num3" /></math>
    <copy name="n3" tname="num3" />
    <number name="num3">1</number>
  </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/x1'].stateValues.value.tree;
      let y1 = components['/y1'].stateValues.value.tree;
      let z1 = components['/z1'].stateValues.value.tree;
      let x2 = components['/x2'].stateValues.value.tree;
      let y2 = components['/y2'].stateValues.value.tree;
      let z2 = components['/z2'].stateValues.value.tree;

      expect(["x", "y", "z"].includes(x1)).eq(true);
      expect(["x", "y", "z"].includes(y1)).eq(true);
      expect(["x", "y", "z"].includes(z1)).eq(true);
      expect(["u", "v", "w"].includes(x2)).eq(true);
      expect(["u", "v", "w"].includes(y2)).eq(true);
      expect(["u", "v", "w"].includes(z2)).eq(true);

      let x1a = components['/x1a'].replacements[0].stateValues.value.tree;
      let y1a = components['/y1a'].replacements[0].stateValues.value.tree;
      let z1a = components['/z1a'].replacements[0].stateValues.value.tree;
      let x2a = components['/x2a'].replacements[0].stateValues.value.tree;
      let y2a = components['/y2a'].replacements[0].stateValues.value.tree;
      let z2a = components['/z2a'].replacements[0].stateValues.value.tree;

      expect(x1a).eq(x1);
      expect(y1a).eq(y1);
      expect(z1a).eq(z1);
      expect(x2a).eq(x2);
      expect(y2a).eq(y2);
      expect(z2a).eq(z2);

    })
  });

  it('two selects with mutual dependence through intermediate copies, numbertoselect initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><aslist>
    <select name="s1" assignnames="x1, y1, z1" withReplacement>
      <numberToSelect><copy prop="numberToSelect" tname="s2b" /></numberToSelect>
      <math>x</math><math>y</math><math>z</math>
    </select>
  </aslist></p>

  <p><aslist>
    <select name="s2" assignnames="x2, y2, z2">
      <numberToSelect><copy tname="n" /></numberToSelect>
      <withReplacement><copy prop="withReplacement" tname="s1b" /></withReplacement>
      <math>u</math><math>v</math><math>w</math>
    </select>
  </aslist></p>

  <p><aslist><copy name="s1a" tname="s1" /></aslist></p>
  <p><aslist><copy name="s2a" tname="s2" /></aslist></p>
  <p><aslist><copy name="s1b" tname="s1a" /></aslist></p>
  <p><aslist><copy name="s2b" tname="s2a" /></aslist></p>

  <p><copy name="x1a" tname="x1" />, <copy name="y1a" tname="y1" />, <copy name="z1a" tname="z1" /></p>
  <p><copy name="x2a" tname="x2" />, <copy name="y2a" tname="y2" />, <copy name="z2a" tname="z2" /></p>
  
  <p> 
    <copy name="n2" tname="n3" />
    <copy name="n" tname="num1" />
    <math name="num1"><copy tname="n2" />+<copy tname="num2" /></math>
    <math name="num2"><copy tname="n3" />+<copy tname="num3" /></math>
    <copy name="n3" tname="num3" />
    <number name="num3">1</number>
  </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/x1'].stateValues.value.tree;
      let y1 = components['/y1'].stateValues.value.tree;
      let z1 = components['/z1'].stateValues.value.tree;
      let x2 = components['/x2'].stateValues.value.tree;
      let y2 = components['/y2'].stateValues.value.tree;
      let z2 = components['/z2'].stateValues.value.tree;

      expect(["x", "y", "z"].includes(x1)).eq(true);
      expect(["x", "y", "z"].includes(y1)).eq(true);
      expect(["x", "y", "z"].includes(z1)).eq(true);
      expect(["u", "v", "w"].includes(x2)).eq(true);
      expect(["u", "v", "w"].includes(y2)).eq(true);
      expect(["u", "v", "w"].includes(z2)).eq(true);

      let x1a = components['/x1a'].replacements[0].stateValues.value.tree;
      let y1a = components['/y1a'].replacements[0].stateValues.value.tree;
      let z1a = components['/z1a'].replacements[0].stateValues.value.tree;
      let x2a = components['/x2a'].replacements[0].stateValues.value.tree;
      let y2a = components['/y2a'].replacements[0].stateValues.value.tree;
      let z2a = components['/z2a'].replacements[0].stateValues.value.tree;

      expect(x1a).eq(x1);
      expect(y1a).eq(y1);
      expect(z1a).eq(z1);
      expect(x2a).eq(x2);
      expect(y2a).eq(y2);
      expect(z2a).eq(z2);

    })
  });

  it('select with hide will hide replacements', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selects and hide</p>
      <p><select assignnames="c">
        <text>a</text>
        <text>b</text>
        <text>c</text>
        <text>d</text>
        <text>e</text>
      </select>, <select assignnames="d" hide>
        <text>a</text>
        <text>b</text>
        <text>c</text>
        <text>d</text>
        <text>e</text>
      </select></p>
      <p><copy tname="c" />, <copy hide="false" tname="d" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_p1').should('have.text', "Selects and hide");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let c = components['/c'].stateValues.value;
      let d = components['/d'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(`#\\/_p2`).should('have.text', `${c}, `)
      cy.get(`#\\/_p3`).should('have.text', `${c}, ${d}`)

    })
  });

  it('select with hide will hide named grandchildren replacements', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selects and hide</p>
      <p><aslist><select assignnames="(a,b,c)">
        <group>
          <text>a</text>
          <text>b</text>
          <text>c</text>
        </group>
        <group>
          <text>d</text>
          <text>e</text>
          <text>f</text>
        </group>
      </select><select assignnames="(d,e)" hide>
        <group>
          <text>a</text>
          <text>b</text>
        </group>
        <group>
          <text>c</text>
          <text>d</text>
        </group>
        <group>
          <text>e</text>
          <text>f</text>
        </group>
      </select></aslist></p>
      <p><copy tname="a" />, <copy hide="true" tname="b" />, <copy tname="c" />, <copy hide="false" tname="d" />, <copy tname="e" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_p1').should('have.text', "Selects and hide");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let a = components['/a'].stateValues.value;
      let b = components['/b'].stateValues.value;
      let c = components['/c'].stateValues.value;
      let d = components['/d'].stateValues.value;
      let e = components['/e'].stateValues.value;
      expect(["a", "d"].includes(a)).eq(true);
      expect(["b", "e"].includes(b)).eq(true);
      expect(["c", "f"].includes(c)).eq(true);
      expect(["a", "c", "e"].includes(d)).eq(true);
      expect(["b", "d", "f"].includes(e)).eq(true);

      cy.get(`#\\/_p2`).should('have.text', `${a}, ${b}, ${c}`)
      cy.get(`#\\/_p3`).should('have.text', `${a}, , ${c}, ${d}, `)

    })
  });


});
