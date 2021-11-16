import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Conditional Content Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  // tests without cases or else

  it('inline content containing sign of number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />

  <p>You typed 
    <conditionalcontent condition="$n > 0">
      a positive number.
    </conditionalcontent>
    <conditionalcontent condition="$n < 0">
      a negative number.
    </conditionalcontent>
    <conditionalcontent condition="$n=0">
      zero.
    </conditionalcontent>
    <conditionalcontent condition="not ($n>0 or $n<0 or $n=0)" >
      something else.
    </conditionalcontent>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/n textarea').type("10{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-5/9{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}5-5{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}-x{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

  })

  it('inline content containing sign of number, use XML entities', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />

  <p>You typed 
    <conditionalcontent condition="$n &gt; 0">
      a positive number.
    </conditionalcontent>
    <conditionalcontent condition="$n &lt; 0">
      a negative number.
    </conditionalcontent>
    <conditionalcontent condition="$n=0">
      zero.
    </conditionalcontent>
    <conditionalcontent condition="not ($n&gt;0 or $n&lt;0 or $n=0)" >
      something else.
    </conditionalcontent>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/n textarea').type("10{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-5/9{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}5-5{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}-x{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

  })

  it('block content containing sign of number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />

    <section>
    <conditionalcontent condition="$n>0" >
      <p>You typed a positive number.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent condition="$n<0" >
      <p>You typed a negative number.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent condition="$n=0" >
      <p>You typed zero.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent condition="not ($n>0 or $n<0 or $n=0)" >
      <p>You typed something else.</p>
    </conditionalcontent>
    </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/n textarea').type("10{enter}", { force: true });
    cy.get('#\\/_section1 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').should('not.exist');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-5/9{enter}", { force: true });
    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').should('not.exist');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}5-5{enter}", { force: true });
    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });
    cy.get('#\\/_section4 p').should('not.exist');

    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}-x{enter}", { force: true });
    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

  })

  it('conditional text used as correct answer', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter a slope: <mathinput name="m" /></p>

  <p>If this is the slope at an equilibrium of a discrete dynamical system, the equilibrium is
  <answer>
    <choiceinput inline="true" randomizeOrder><choice>stable</choice><choice>unstable</choice></choiceinput>
    <award><when>
      <copy prop="selectedvalue" tname="_choiceinput1" />
      =
      <text>
        <conditionalcontent condition="abs($m) < 1" >
          stable
        </conditionalcontent>
        <conditionalcontent condition="abs($m) > 1" >
          unstable
        </conditionalcontent>
      </text>
    </when></award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

    cy.get('#\\/m textarea').type('3{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');

    cy.get('#\\/m textarea').type('{end}{backspace}-0.8{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

    cy.get('#\\/m textarea').type('{end}{backspace}{backspace}{backspace}{backspace}1/3{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');


    cy.get('#\\/m textarea').type('{end}{backspace}{backspace}{backspace}{backspace}-7/5{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');


    cy.get('#\\/m textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}1{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');


  })

  it('conditional math used as correct answer', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Require <choiceinput inline="true" name="c" randomizeOrder><choice>positive</choice><choice>negative</choice></choiceinput>.</p>

  <p>Condition on <m>x</m>:
  <answer>
    <mathinput name="x" />
    <award><when>
      <copy prop="immediateValue" tname="x" />
      =
      <math>
        <conditionalcontent condition="$c = positive" >
          x > 0
        </conditionalcontent>
        <conditionalcontent condition="$c = negative" >
          x < 0
        </conditionalcontent>
      </math>
    </when></award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')
    cy.get('#\\/x_submit').click();
    cy.get('#\\/x_incorrect').should('be.visible');

    cy.get('#\\/x textarea').type('x > 0{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');

    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}< 0{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');


    cy.get('#\\/c').select(`negative`);
    cy.get('#\\/x_submit').click();
    cy.get('#\\/x_correct').should('be.visible');

    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}> 0{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');


    cy.get('#\\/c').select(`positive`);
    cy.get('#\\/x_submit').click();
    cy.get('#\\/x_correct').should('be.visible');

    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}< 0{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');


  })

  it('include blank string between tags', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <text name="animal" hide>fox</text><text name="verb" hide>jumps</text>
  <booleaninput label="animal phrase" name="b" />

  <p name="p"><conditionalContent condition="$b">The $animal $verb.</conditionalcontent></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/p').should('have.text', '');

    cy.get('#\\/b').click();

    cy.get('#\\/p').should('have.text', 'The fox jumps.');


  })

  it('assignNames skips strings but strings still displayed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="p1"><conditionalContent condition="$n > 0" assignNames="a b">
      <text>dog</text> mouse <text>cat</text>
    </conditionalContent></p>

    <p name="pa">$a</p>
    
    <p name="pb">$b</p>

    <p name="p2" ><copy tname="_conditionalcontent1" assignNames="c d" /></p>

    <p name="pc">$c</p>
    
    <p name="pd">$d</p>


    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/p1').should('have.text', '');
    cy.get('#\\/pa').should('have.text', '');
    cy.get('#\\/pb').should('have.text', '');
    cy.get('#\\/p2').should('have.text', '');
    cy.get('#\\/pc').should('have.text', '');
    cy.get('#\\/pd').should('have.text', '');

    cy.log('enter 1')
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/p1').should('contain.text', 'dog mouse cat');
    cy.get('#\\/pa').should('have.text', 'dog');
    cy.get('#\\/pb').should('have.text', 'cat');
    cy.get('#\\/p2').should('contain.text', 'dog mouse cat');
    cy.get('#\\/pc').should('have.text', 'dog');
    cy.get('#\\/pd').should('have.text', 'cat');


    cy.log('enter 0')
    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })

    cy.get('#\\/p1').should('have.text', '');
    cy.get('#\\/pa').should('have.text', '');
    cy.get('#\\/pb').should('have.text', '');
    cy.get('#\\/p2').should('have.text', '');
    cy.get('#\\/pc').should('have.text', '');
    cy.get('#\\/pd').should('have.text', '');


  });


  // tests with cases or else


  it('case/else with single text, assign sub on copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="a" maximumNumberToShow="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_conditionalcontent1" assignNames="(b)" /></p>

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
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}x{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('case/else with single text, initially assign sub', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="(a)" maximumNumberToShow="1">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: <copy tname="a" assignNames="a1" /></p>

    <p name="pb" >b: <copy tname="_conditionalcontent1" assignNames="b" /></p>

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
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a').should('have.text', 'cat');
    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a').should('have.text', 'dog');
    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}x{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a').should('have.text', 'mouse');
    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('case/else with single text with multiple matches, assign sub on copy', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a,aa: <conditionalContent assignNames="a aa">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="$n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>
    <p name="paa1">aa1: <copy tname="aa" assignNames="(aa1)" /></p>

    <p name="pb" >b,bb: <copy tname="_conditionalcontent1" assignNames="(b) (bb)" /></p>

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
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}x{enter}", { force: true })

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

  it('case/else with single text, assign sub on copy, copy condition to restrict to one', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="a">
      <case condition="$n < 0"><text>dog</text></case>
      <case condition="not $(_case1{prop='conditionSatisfied'}) and $n <=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: <copy tname="a" assignNames="(a1)" /></p>

    <p name="pb" >b: <copy tname="_conditionalcontent1" assignNames="(b)" /></p>

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
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/a1').should('have.text', 'cat');
    cy.get('#\\/b').should('have.text', 'cat');
    cy.get('#\\/b1').should('have.text', 'cat');

    cy.log('enter 10')
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

    cy.log('enter -11')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/a1').should('have.text', 'dog');
    cy.get('#\\/b').should('have.text', 'dog');
    cy.get('#\\/b1').should('have.text', 'dog');

    cy.log('enter x')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}x{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: mouse');
    cy.get('#\\/pa1').should('have.text', 'a1: mouse');
    cy.get('#\\/pb').should('have.text', 'b: mouse');
    cy.get('#\\/pb1').should('have.text', 'b1: mouse');

    cy.get('#\\/a1').should('have.text', 'mouse');
    cy.get('#\\/b').should('have.text', 'mouse');
    cy.get('#\\/b1').should('have.text', 'mouse');

  });

  it('case/else with text, math, and optional', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="(a b c d)" maximumNumberToShow="1">
      <case condition="$n<0" ><text>dog</text>  <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$n <= 1" ><text>cat</text>  <math>y</math>
      </case>
      <else><text>mouse</text>  <math>z</math>
      </else>
    </conditionalContent></p>

    <p>a1: <copy tname="a" assignNames="a1" /></p>
    <p>b1: <copy tname="b" assignNames="b1" /></p>
    <p>c1: <copy tname="c" assignNames="c1" /></p>
    <p>d1: <copy tname="d" assignNames="d1" /></p>

    <p>copy: <copy name="cp1" tname="_conditionalcontent1" assignNames="(e f g h i)" /></p>

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


    cy.log('enter 1')
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })


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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}x{enter}", { force: true })

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

  it('case/else with text, math, and optional, new namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="(a b c d)" name="s1" newnamespace>
      <case condition="$(../n)<0" ><text>dog</text>  <math>x</math>
        <text>optional text!</text>
      </case>
      <case condition="$(../n) <= 1" ><text>cat</text>  <math>y</math>
      </case>
      <else><text>mouse</text>  <math>z</math>
      </else>
    </conditionalContent></p>

    <p>a1: <copy tname="s1/a" assignNames="a1" /></p>
    <p>b1: <copy tname="s1/b" assignNames="b1" /></p>
    <p>c1: <copy tname="s1/c" assignNames="c1" /></p>
    <p>d1: <copy tname="s1/d" assignNames="d1" /></p>

    <p>copy: <copy name="s2" tname="s1" assignNames="(e f g h i)" /></p>

    <p>e1: <copy tname="e" assignNames="e1" /></p>
    <p>f1: <copy tname="f" assignNames="f1" /></p>
    <p>g1: <copy tname="g" assignNames="g1" /></p>
    <p>h1: <copy tname="h" assignNames="h1" /></p>
    <p>i1: <copy tname="i" assignNames="i1" /></p>

    <p>copied copy: <copy name="s3" tname="s2" assignNames="(j k l)" newNamespace /></p>

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
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}-1{enter}", { force: true })


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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}x{enter}", { force: true })

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
    <p>original: <conditionalContent assignNames="(a b c)" maximumNumberToShow="1">
      <case condition="$n<0" >
        <copy tname="x1" />
        <copy tname="y1" />
        <math simplify>3<math name="a1">x</math><math name="b1">a</math> + <copy tname="a1" /><copy tname="b1" /></math>
      </case>
      <case condition="$n <= 1" >
        <copy tname="x2" />
        <copy tname="y2" />
        <math simplify>4<math name="a2">y</math><math name="b2">b</math> + <copy tname="a2" /><copy tname="b2" /></math>
      </case>
      <else>
        <copy tname="x3" />
        <copy tname="y3" />
        <math simplify>5<math name="a3">z</math><math name="b3">c</math> + <copy tname="a3" /><copy tname="b3" /></math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy assignNames="aa" tname="a" />
    <copy assignNames="bb" tname="b" />
    <copy assignNames="cc" tname="c" />

    <p>Whole thing repeated</p>
    <copy tname="_conditionalcontent1" assignNames="(d e f)" />

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
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}10{enter}", { force: true })

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

  it('references to internal and external components, new namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>

    <mathinput name="n" />
    <p>original: <conditionalContent assignNames="a" maximumNumberToShow="1">
      <case condition="$n<0" newNamespace >
        <copy tname="../x1" assignNames="animal" />
        <copy tname="../y1" assignNames="plant" />
        <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + <copy tname="x" /><copy tname="a" /></math>
      </case>
      <case condition="$n <= 1" newNamespace >
        <copy tname="../x2" assignNames="animal" />
        <copy tname="../y2" assignNames="plant" />
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + <copy tname="x" /><copy tname="a" /></math>
      </case>
      <else newNamespace>
        <copy tname="../x3" assignNames="animal" />
        <copy tname="../y3" assignNames="plant" />
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + <copy tname="x" /><copy tname="a" /></math>
      </else>
    </conditionalContent></p>

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
    <copy tname="_conditionalcontent1" assignNames="b" />

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
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}10{enter}", { force: true })

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
    <p>original: <conditionalContent name="s" assignNames="a" maximumNumberToShow="1" newNamespace>
      <case newNamespace condition="$(../n) < 0" >
        <copy tname="../../x1" assignNames="animal" />
        <copy tname="../../y1" assignNames="plant" />
        <math simplify name="p">3<math name="x">x</math><math name="a">a</math> + <copy tname="x" /><copy tname="a" /></math>
      </case>
      <case newNamespace condition="$(../n) <= 1" >
        <copy tname="../../x2" assignNames="animal" />
        <copy tname="../../y2" assignNames="plant" />
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + <copy tname="x" /><copy tname="a" /></math>
      </case>
      <else newNamespace>
        <copy tname="../../x3" assignNames="animal" />
        <copy tname="../../y3" assignNames="plant" />
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + <copy tname="x" /><copy tname="a" /></math>
      </else>
    </conditionalContent></p>

    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>

    <p>Selected options repeated</p>
    <copy assignNames="animal" tname="s/a/animal" />
    <copy assignNames="plant" tname="s/a/plant" />
    <copy assignNames="p" tname="s/a/p" />
    <copy assignNames="xx" tname="s/a/x" />
    <copy assignNames="aa" tname="s/a/a" />

    <p>Whole thing repeated</p>
    <copy tname="s" assignNames="b" />

    <p>Selected options repeated from copy</p>
    <copy assignNames="animalcopy" tname="b/animal" />
    <copy assignNames="plantcopy" tname="b/plant" />
    <copy assignNames="pcopy" tname="b/p" />
    <copy assignNames="xxcopy" tname="b/x" />
    <copy assignNames="aacopy" tname="b/a" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(`#\\/s\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/s\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/s\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get(`#\\/s\\/a\\/animal`).should('have.text', 'cat')
    cy.get(`#\\/s\\/a\\/plant`).should('have.text', 'shrub')
    cy.get(`#\\/s\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

    cy.get(`#\\/s\\/a\\/animal`).should('have.text', 'dog')
    cy.get(`#\\/s\\/a\\/plant`).should('have.text', 'tree')
    cy.get(`#\\/s\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}10{enter}", { force: true })

    cy.get(`#\\/s\\/a\\/animal`).should('have.text', 'mouse')
    cy.get(`#\\/s\\/a\\/plant`).should('have.text', 'bush')
    cy.get(`#\\/s\\/a\\/p`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
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
    <p>original: <conditionalContent assignNames="a" maximumNumberToShow="1">
      <case condition="$n<0" >
        <copy tname="x1" assignNames="theanimal" />
        <copy tname="y1" assignNames="theplant" />
        <math simplify name="thep">3<math name="thex">x</math><math name="thea">a</math> + <copy tname="thex" /><copy tname="thea" /></math>
      </case>
      <case newNamespace condition="$n <= 1" >
        <copy tname="../x2" assignNames="animal" />
        <copy tname="../y2" assignNames="plant" />
        <math simplify name="p">4<math name="x">y</math><math name="a">b</math> + <copy tname="x" /><copy tname="a" /></math>
      </case>
      <else newNamespace>
        <copy tname="../x3" assignNames="animal" />
        <copy tname="../y3" assignNames="plant" />
        <math simplify name="p">5<math name="x">z</math><math name="a">c</math> + <copy tname="x" /><copy tname="a" /></math>
      </else>
    </conditionalContent></p>

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
    <p name="repeat"><copy tname="_conditionalcontent1" assignNames="b" /></p>

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
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

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
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let aReplacements = components["/a"].replacements;
      let theAnimalAnchor = cesc("#" + aReplacements[1].replacements[0].componentName)
      let thePlantAnchor = cesc("#" + aReplacements[3].replacements[0].componentName)
      let thePAnchor = cesc("#" + aReplacements[5].componentName)

      let bReplacements = components["/b"].replacements;
      let theAnimalCopyAnchor = cesc("#" + bReplacements[1].replacements[0].componentName)
      let thePlantCopyAnchor = cesc("#" + bReplacements[3].replacements[0].componentName)
      let thePCopyAnchor = cesc("#" + bReplacements[5].componentName)

      cy.get(`#\\/a\\/animal`).should('not.exist')
      cy.get(`#\\/a\\/plant`).should('not.exist')
      cy.get(`#\\/a\\/p`).should('not.exist')

      cy.get(`#\\/_p1`).invoke('text').then(text => {
        let words = text.split(/\s+/).slice(1);
        expect(words[0]).eq("dog")
        expect(words[1]).eq("tree")
      })
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

      cy.get(`#\\/repeat`).invoke('text').then(text => {
        let words = text.split(/\s+/).slice(1);
        expect(words[0]).eq("dog")
        expect(words[1]).eq("tree")
      })
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
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}10{enter}", { force: true })

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
    <conditionalContent assignNames="a" maximumNumberToShow="1">
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
    </conditionalContent>
    
    <p>The response: <copy tname="a/response" prop="value" /></p>
    
    <copy name="sc2" tname="_conditionalcontent1" assignNames="b" />
    
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


    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })
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



    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}3{enter}", { force: true })
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
    <conditionalContent assignNames="(a b)" maximumNumberToShow="1">
      <case condition="$n<0" >
        <p newNamespace name="panimal">What is your favorite animal? <textinput name="response" /></p>
        <p newNamespace>I like <copy prop="value" tname="../panimal/response" />, too.</p>
      </case>
      <case condition="$n <= 1" >
        <p newNamespace name="pname">What is your name? <textinput name="response" /></p>
        <p newNamespace>Hello, <copy prop="value" tname="../pname/response" />!</p>
      </case>
      <else>
        <p newNamespace name="pelse">Anything else? <textinput name="response" /></p>
        <p newNamespace>To repeat: <copy prop="value" tname="../pelse/response" />.</p>
      </else>
    </conditionalContent>
    
    <p name="pResponse">The response: <copy tname="a/response" prop="value" /></p>
    
    <copy name="sc2" tname="_conditionalcontent1" assignNames="(c d)" />
    
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


    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })
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


    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}3{enter}", { force: true })
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

    <p><conditionalContent>
      <case name="positiveCase" condition="$n>0" ><text>positive</text></case>
      <else><text>non-positive</text></else>
    </conditionalContent></p>
    
    <p><conditionalContent>
      <copy tname="positiveCase" componentType="case" />
      <case condition="$n<0" ><text>negative</text></case>
      <else><text>neither</text></else>
    </conditionalContent></p>
    
    
    <p><copy tname="_conditionalcontent1" /></p>

    <p><copy tname="_conditionalcontent2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'neither');
    cy.get('#\\/_p4').should('have.text', 'neither');

    cy.log('enter 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'positive');
    cy.get('#\\/_p3').should('have.text', 'positive');
    cy.get('#\\/_p2').should('have.text', 'positive');
    cy.get('#\\/_p4').should('have.text', 'positive');

    cy.log('enter -1')
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'non-positive');
    cy.get('#\\/_p3').should('have.text', 'non-positive');
    cy.get('#\\/_p2').should('have.text', 'negative');
    cy.get('#\\/_p4').should('have.text', 'negative');

    cy.log('enter 0')
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
    <mathinput name="n" />

    <p><conditionalContent>
      <case condition="$n>0" ><text>hello</text></case>
      <else name="bye"><text>bye</text></else>
    </conditionalContent></p>
    
    <p><conditionalContent>
      <case condition="$n<0" ><text>hello</text></case>
      <case condition="$n>0" ><text>oops</text></case>
      <copy tname="bye" componentType="else" />
    </conditionalContent></p>
    
    <p><copy tname="_conditionalcontent1" /></p>

    <p><copy tname="_conditionalcontent2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

    cy.log('enter 1')
    cy.get('#\\/n textarea').type("{end}{backspace}1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'hello');
    cy.get('#\\/_p3').should('have.text', 'hello');
    cy.get('#\\/_p2').should('have.text', 'oops');
    cy.get('#\\/_p4').should('have.text', 'oops');

    cy.log('enter -1')
    cy.get('#\\/n textarea').type("{end}{backspace}-1{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'hello');
    cy.get('#\\/_p4').should('have.text', 'hello');

    cy.log('enter 0')
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}0{enter}", { force: true })

    cy.get('#\\/_p1').should('have.text', 'bye');
    cy.get('#\\/_p3').should('have.text', 'bye');
    cy.get('#\\/_p2').should('have.text', 'bye');
    cy.get('#\\/_p4').should('have.text', 'bye');

  });

  it('conditionalcontents hide dynamically', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" label="Hide first conditionalContent" />
    <booleaninput name='h2' prefill="true" label="Hide second conditionalContent" />
    <mathinput name="n" />
    <p name="pa">a: <conditionalContent assignNames="a" maximumNumberToShow="1" hide="$h1">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
    <p name="pb">b: <conditionalContent assignNames="b" maximumNumberToShow="1" hide="$h2">
      <case condition="$n<0"><text>dog</text></case>
      <case condition="$n<=1"><text>cat</text></case>
      <else><text>mouse</text></else>
    </conditionalContent></p>
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

    cy.get('#\\/pa').should('have.text', 'a: cat');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: cat');
    cy.get('#\\/pb').should('have.text', 'b: cat');
    cy.get('#\\/pb1').should('have.text', 'b1: cat');

    cy.log('enter -3')
    cy.get('#\\/n textarea').type("{end}{backspace}-3{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: ');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: dog');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/pa').should('have.text', 'a: dog');
    cy.get('#\\/pa1').should('have.text', 'a1: dog');
    cy.get('#\\/pb').should('have.text', 'b: ');
    cy.get('#\\/pb1').should('have.text', 'b1: dog');


  });

  it('string and blank strings in case and else', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <text name="animal1" hide>fox</text><text name="verb1" hide>jumps</text>
  <text name="animal2" hide>elephant</text><text name="verb2" hide>trumpets</text>

  <mathinput name="n" />
  <p name="pa">a: <conditionalContent assignNames="a" maximumNumberToShow="1">
    <case condition="$n > 0">The $animal1 $verb1.</case>
    <else>The $animal2 $verb2.</else>
  </conditionalContent></p>

  <p name="pa1">a1: <copy tname="a" assignNames="((a11) (a12))" /></p>

  <p name="ppieces" >pieces: <copy tname="_conditionalcontent1" assignNames="(b c)" /></p>

  <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>
  <p name="pc1">c1: <copy tname="c" assignNames="c1" /></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/pa').should('have.text', 'a: The elephant trumpets.');
    cy.get('#\\/pa1').should('have.text', 'a1: The elephant trumpets.');
    cy.get('#\\/ppieces').should('have.text', 'pieces: The elephant trumpets.');
    cy.get('#\\/pb1').should('have.text', 'b1: elephant');
    cy.get('#\\/pc1').should('have.text', 'c1: trumpets');

    cy.get('#\\/a11').should('have.text', 'elephant');
    cy.get('#\\/a12').should('have.text', 'trumpets');
    cy.get('#\\/b1').should('have.text', 'elephant');
    cy.get('#\\/c1').should('have.text', 'trumpets');

    cy.log('enter 1')
    cy.get('#\\/n textarea').type("1{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: The fox jumps.');
    cy.get('#\\/pa1').should('have.text', 'a1: The fox jumps.');
    cy.get('#\\/ppieces').should('have.text', 'pieces: The fox jumps.');
    cy.get('#\\/pb1').should('have.text', 'b1: fox');
    cy.get('#\\/pc1').should('have.text', 'c1: jumps');

    cy.get('#\\/a11').should('have.text', 'fox');
    cy.get('#\\/a12').should('have.text', 'jumps');
    cy.get('#\\/b1').should('have.text', 'fox');
    cy.get('#\\/c1').should('have.text', 'jumps');

    cy.log('enter 0')
    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true })

    cy.get('#\\/pa').should('have.text', 'a: The elephant trumpets.');
    cy.get('#\\/pa1').should('have.text', 'a1: The elephant trumpets.');
    cy.get('#\\/ppieces').should('have.text', 'pieces: The elephant trumpets.');
    cy.get('#\\/pb1').should('have.text', 'b1: elephant');
    cy.get('#\\/pc1').should('have.text', 'c1: trumpets');

    cy.get('#\\/a11').should('have.text', 'elephant');
    cy.get('#\\/a12').should('have.text', 'trumpets');
    cy.get('#\\/b1').should('have.text', 'elephant');
    cy.get('#\\/c1').should('have.text', 'trumpets');

  })

  it('copy with invalid tname gets expanded', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />
  before
  <conditionalContent assignNames='a'>
    <case condition="$n=1" newNamespace>nothing: <copy tname="nada" name="nothing" /></case>
  </conditionalContent>
  after
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/n textarea').type("1", { force: true }).blur();

    cy.get('#\\/_document1').should('have.text', '\n  a\n  1\n  before\n  nothing: \n  after\n  ')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/a/nothing"].isExpanded).eq(true)
      expect(components["/a/nothing"].replacements).eqls([])
      expect(components["/_document1"].activeChildren.filter(x => x.componentType === "copy")).eqls([])
    });

  })


  
  it('use original names if no assignNames', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="n" />

  <conditionalContent condition="$n > 0">
    <p>We have a <text name="winner1">first winner</text>!</p>
  </conditionalContent>
  
  <conditionalContent>
    <case condition="$n > 0">
      <p>Just emphasizing that we have that <text name="winner1b">first winner</text>!</p>
    </case>
    <case condition="$n > 1">
      <p>We have a <text name="winner2">second winner</text>!</p>
    </case>
    <case condition="$n > 2">
      <p>We have a <text name="winner3">third winner</text>!</p>
    </case>
    <else>
      <p>We have <text name="winner0">no winner</text>.</p>
    </else>
  </conditionalContent>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/winner1').should('not.exist');
    cy.get('#\\/_p1').should('not.exist');
    cy.get('#\\/winner1b').should('not.exist');
    cy.get('#\\/_p2').should('not.exist');
    cy.get('#\\/winner2').should('not.exist');
    cy.get('#\\/_p3').should('not.exist');
    cy.get('#\\/winner3').should('not.exist');
    cy.get('#\\/_p4').should('not.exist');
    cy.get('#\\/winner0').should('have.text', "no winner");
    cy.get('#\\/_p5').should('have.text', "We have no winner.");


    cy.get('#\\/n textarea').type("1", { force: true }).blur();

    cy.get('#\\/winner1').should('have.text', "first winner");
    cy.get('#\\/_p1').should('have.text', "We have a first winner!");
    cy.get('#\\/winner1b').should('have.text', "first winner");
    cy.get('#\\/_p2').should('have.text', "Just emphasizing that we have that first winner!");
    cy.get('#\\/winner2').should('not.exist');
    cy.get('#\\/_p3').should('not.exist');
    cy.get('#\\/winner3').should('not.exist');
    cy.get('#\\/_p4').should('not.exist');
    cy.get('#\\/winner0').should('not.exist');
    cy.get('#\\/_p5').should('not.exist');


    cy.get('#\\/n textarea').type("{end}{backspace}2", { force: true }).blur();

    cy.get('#\\/winner1').should('have.text', "first winner");
    cy.get('#\\/_p1').should('have.text', "We have a first winner!");
    cy.get('#\\/winner1b').should('have.text', "first winner");
    cy.get('#\\/_p2').should('have.text', "Just emphasizing that we have that first winner!");
    cy.get('#\\/winner2').should('have.text', "second winner");
    cy.get('#\\/_p3').should('have.text', "We have a second winner!");
    cy.get('#\\/winner3').should('not.exist');
    cy.get('#\\/_p4').should('not.exist');
    cy.get('#\\/winner0').should('not.exist');
    cy.get('#\\/_p5').should('not.exist');

    cy.get('#\\/n textarea').type("{end}{backspace}3", { force: true }).blur();

    cy.get('#\\/winner1').should('have.text', "first winner");
    cy.get('#\\/_p1').should('have.text', "We have a first winner!");
    cy.get('#\\/winner1b').should('have.text', "first winner");
    cy.get('#\\/_p2').should('have.text', "Just emphasizing that we have that first winner!");
    cy.get('#\\/winner2').should('have.text', "second winner");
    cy.get('#\\/_p3').should('have.text', "We have a second winner!");
    cy.get('#\\/winner3').should('have.text', "third winner");
    cy.get('#\\/_p4').should('have.text', "We have a third winner!");
    cy.get('#\\/winner0').should('not.exist');
    cy.get('#\\/_p5').should('not.exist');

    cy.get('#\\/n textarea').type("{end}{backspace}x", { force: true }).blur();

    cy.get('#\\/winner1').should('not.exist');
    cy.get('#\\/_p1').should('not.exist');
    cy.get('#\\/winner1b').should('not.exist');
    cy.get('#\\/_p2').should('not.exist');
    cy.get('#\\/winner2').should('not.exist');
    cy.get('#\\/_p3').should('not.exist');
    cy.get('#\\/winner3').should('not.exist');
    cy.get('#\\/_p4').should('not.exist');
    cy.get('#\\/winner0').should('have.text', "no winner");
    cy.get('#\\/_p5').should('have.text', "We have no winner.");

  })


})



