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
    cy.visit('/cypressTest')
  })

  it('select single text, assign sub on copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="2" />
    <p name="pa">a: <selectByCondition assignNames="a" maximumnumbertoselect="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
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

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');


    cy.log(`change prefill value to -1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="-1" />
    <p name="pa">a: <selectByCondition assignNames="a" maximumnumbertoselect="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');


    cy.log(`change prefill value to 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="1" />
    <p name="pa">a: <selectByCondition assignNames="a" maximumnumbertoselect="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded



    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-3{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

  });

  it('select single text, initially assign sub', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="2" />
    <p name="pa">a: <selectByCondition assignNames="(a)" maximumnumbertoselect="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
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

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');


    cy.log(`change prefill value to -1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="-1" />
    <p name="pa">a: <selectByCondition assignNames="(a)" maximumnumbertoselect="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="a1" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="b" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="(b1)" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');


    cy.log(`change prefill value to 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="1" />
    <p name="pa">a: <selectByCondition assignNames="(a)" maximumnumbertoselect="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="a1" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="b" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="(b1)" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-3{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

  });

  it('select single text with multiple matches, assign sub on copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="2" />
    <p name="pa">a,aa: <selectByCondition assignNames="a aa">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>
    <p name="paa1">aa1: <copy tname="aa" assignNames="(aa1)" /></p>

    <p name="pb" >b,bb: <copy tname="_selectbycondition1" assignNames="(b) (bb)" /></p>

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


    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

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

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

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


    cy.log(`change prefill value to -1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="-1" />
    <p name="pa">a,aa: <selectByCondition assignNames="a aa">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>
    <p name="paa1">aa1: <copy tname="aa" assignNames="(aa1)" /></p>

    <p name="pb" >b,bb: <copy tname="_selectbycondition1" assignNames="(b) (bb)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>
    <p name="pbb1">bb1: <copy tname="bb" assignNames="bb1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

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

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}1{enter}", { force: true })

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

    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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


    cy.log(`change prefill value to 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="1" />
    <p name="pa">a,aa: <selectByCondition assignNames="a aa">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>
    <p name="paa1">aa1: <copy tname="aa" assignNames="(aa1)" /></p>

    <p name="pb" >b,bb: <copy tname="_selectbycondition1" assignNames="(b) (bb)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>
    <p name="pbb1">bb1: <copy tname="bb" assignNames="bb1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

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

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-3{enter}", { force: true })

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

  });

  it('select single text, assign sub on copy, copy condition to restrict to one', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="2" />
    <p name="pa">a: <selectByCondition assignNames="a">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="not $(_case1{prop='conditionSatisfied'}) and $n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
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


    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');


    cy.log(`change prefill value to -1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="-1" />
    <p name="pa">a: <selectByCondition assignNames="a">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="not $(_case1{prop='conditionSatisfied'}) and $n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');


    cy.log(`change prefill value to 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="1" />
    <p name="pa">a: <selectByCondition assignNames="a">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="not $(_case1{prop='conditionSatisfied'}) and $n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_selectbycondition1" assignNames="(b)" /></p>

    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-3{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

  });

  it('select text, math, and optional', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="2" />
    <p>original: <selectByCondition assignNames="(a b c d)" maximumNumberToSelect="1">
      <case condition="$n<0" >
        <text>dog</text>
        <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$n <= 1" ><text>cat</text>  <math>y</math>
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

    <p>copy: <copy name="cp1" tname="_selectbycondition1" assignNames="(e f g h i)" /></p>

    <p>e1: <copy tname="e" assignNames="e1" /></p>
    <p>f1: <copy tname="f" assignNames="f1" /></p>
    <p>g1: <copy tname="g" assignNames="g1" /></p>
    <p>h1: <copy tname="h" assignNames="h1" /></p>
    <p>i1: <copy tname="i" assignNames="i1" /></p>

    <p>copied copy: <copy tname="cp1" assignNames="(j k l)" /></p>

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

    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

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

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

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


    cy.log(`change prefill value to -1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="-1" />
    <p>original: <selectByCondition assignNames="(a b c d)" maximumNumberToSelect="1">
      <case condition="$n<0" >
        <text>dog</text>
        <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$n <= 1" ><text>cat</text>  <math>y</math>
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

    <p>copy: <copy name="cp1" tname="_selectbycondition1" assignNames="(e f g h i)" /></p>

    <p>e1: <copy tname="e" assignNames="e1" /></p>
    <p>f1: <copy tname="f" assignNames="f1" /></p>
    <p>g1: <copy tname="g" assignNames="g1" /></p>
    <p>h1: <copy tname="h" assignNames="h1" /></p>
    <p>i1: <copy tname="i" assignNames="i1" /></p>

    <p>copied copy: <copy tname="cp1" assignNames="(j k l)" /></p>

    <p>j1: <copy tname="j" assignNames="j1" /></p>
    <p>k1: <copy tname="k" assignNames="k1" /></p>
    <p>l1: <copy tname="l" assignNames="l1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

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


    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}1{enter}", { force: true })

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


    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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



    cy.log(`change prefill value to 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="1" />
    <p>original: <selectByCondition assignNames="(a b c d)" maximumNumberToSelect="1">
      <case condition="$n<0" >
        <text>dog</text>
        <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$n <= 1" ><text>cat</text>  <math>y</math>
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

    <p>copy: <copy name="cp1" tname="_selectbycondition1" assignNames="(e f g h i)" /></p>

    <p>e1: <copy tname="e" assignNames="e1" /></p>
    <p>f1: <copy tname="f" assignNames="f1" /></p>
    <p>g1: <copy tname="g" assignNames="g1" /></p>
    <p>h1: <copy tname="h" assignNames="h1" /></p>
    <p>i1: <copy tname="i" assignNames="i1" /></p>

    <p>copied copy: <copy tname="cp1" assignNames="(j k l)" /></p>

    <p>j1: <copy tname="j" assignNames="j1" /></p>
    <p>k1: <copy tname="k" assignNames="k1" /></p>
    <p>l1: <copy tname="l" assignNames="l1" /></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

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


    cy.log(`doesn't change if change input`)
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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


    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-3{enter}", { force: true })

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

  });

  it('dynamic internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="1" />
    <selectByCondition assignNames="a" maximumNumberToSelect="1">
      <case condition="$n<0" newNamespace>
        <p>What is your favorite animal? <textinput name="response" /></p>
        <p>I like <copy prop="value" tname="response" />, too.</p>
      </case>
      <case condition="$n <= 1" newNamespace >
        <p>What is your name? <textinput name="response" /></p>
        <p>Hello, <copy prop="value" tname="response" />!</p>
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


    cy.log(`doesn't change`)
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })
    cy.get(`#\\/a\\/_p1`).should('have.text', 'What is your name? ')
    cy.get(`#\\/a\\/_p2`).should('have.text', 'Hello, Fred!')
    cy.get(`#\\/_p1`).should('have.text', 'The response: Fred')
    cy.get(`#\\/b\\/_p1`).should('have.text', 'What is your name? ')
    cy.get(`#\\/b\\/_p2`).should('have.text', 'Hello, Fred!')
    cy.get(`#\\/_p2`).should('have.text', 'The response one more time: Fred')


  });


  it('copy case', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="1" />

    <p><selectByCondition>
      <case name="positiveCase" condition="$n>0" ><text>positive</text></case>
      <else><text>non-positive</text></else>
    </selectByCondition></p>
    
    <p><selectByCondition>
      <copy tname="positiveCase" />
      <case condition="$n<0" ><text>negative</text></case>
      <else><text>neither</text></else>
    </selectByCondition></p>
    
    <p><copy tname="_selectbycondition1" /></p>

    <p><copy tname="_selectbycondition2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'positive');
    cy.get('#\\/_p3').should('have.text', 'positive');
    cy.get('#\\/_p2').should('have.text', 'positive');
    cy.get('#\\/_p4').should('have.text', 'positive');

    cy.log('enter -1')
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'positive');
    cy.get('#\\/_p3').should('have.text', 'positive');
    cy.get('#\\/_p2').should('have.text', 'positive');
    cy.get('#\\/_p4').should('have.text', 'positive');


    cy.log('enter 0')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}0{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'positive');
    cy.get('#\\/_p3').should('have.text', 'positive');
    cy.get('#\\/_p2').should('have.text', 'positive');
    cy.get('#\\/_p4').should('have.text', 'positive');

    cy.log(`change prefill to 0`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="0" />

    <p><selectByCondition>
      <case name="positiveCase" condition="$n>0" ><text>positive</text></case>
      <else><text>non-positive</text></else>
    </selectByCondition></p>
    
    <p><selectByCondition>
      <copy tname="positiveCase" />
      <case condition="$n<0" ><text>negative</text></case>
      <else><text>neither</text></else>
    </selectByCondition></p>
    
    <p><copy tname="_selectbycondition1" /></p>

    <p><copy tname="_selectbycondition2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded


    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'neither');
    cy.get('#\\/_p4').should('have.text', 'neither');

    cy.log('enter 1')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}0{enter}", { force: true })


    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'neither');
    cy.get('#\\/_p4').should('have.text', 'neither');

  });

  it('copy else', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" prefill="-1" />

    <p><selectByCondition>
      <case condition="$n>0" ><text>hello</text></case>
      <else name="bye"><text>bye</text></else>
    </selectByCondition></p>
    
    <p><selectByCondition>
      <case condition="$n<0" ><text>hello</text></case>
      <case condition="$n>0" ><text>oops</text></case>
      <copy tname="bye"/>
    </selectByCondition></p>
    
    <p><copy tname="_selectbycondition1" /></p>

    <p><copy tname="_selectbycondition2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'hello');
    cy.get('#\\/_p4').should('have.text', 'hello');


    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'hello');
    cy.get('#\\/_p4').should('have.text', 'hello');

    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })


    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'hello');
    cy.get('#\\/_p4').should('have.text', 'hello');

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <mathinput name="n" prefill="0" />

    <p><selectByCondition>
      <case condition="$n>0" ><text>hello</text></case>
      <else name="bye"><text>bye</text></else>
    </selectByCondition></p>
    
    <p><selectByCondition>
      <case condition="$n<0" ><text>hello</text></case>
      <case condition="$n>0" ><text>oops</text></case>
      <copy tname="bye"/>
    </selectByCondition></p>
    
    <p><copy tname="_selectbycondition1" /></p>

    <p><copy tname="_selectbycondition2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'b');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}0{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

  });

  it('selectbyconditions hide dynamically', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" label="Hide first selectByCondition" />
    <booleaninput name='h2' prefill="true" label="Hide second selectByCondition" />
    <mathinput name="n" />
    <p name="pa">a: <selectByCondition assignNames="a" maximumnumbertoselect="1" hide="$h1">
      <case condition="$n<0">
        <text>dog</text>
      </case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>
    <p name="pb">b: <selectByCondition assignNames="b" maximumnumbertoselect="1" hide="$h2">
      <case condition="$n<0">
        <text>dog</text>
      </case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </selectByCondition></p>
    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>
    <p name="pb1">b1: <copy tname="b" assignNames="(b1)" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.log('enter 1')
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.log('enter -3')
    cy.get('#\\/n textarea').type("{end}{backspace}-3{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');


  });



});
