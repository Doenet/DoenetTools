describe('factor polynomial tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  // Note: even after develop a better factoring test,
  // should keep these tests, as they probe how well
  // we can handle components that change type
  // (due to the multiple conditionalContents that are copied)
  it('factor x^2-1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
    <math name="poly">(x-1)(x+1)</math>
    <math name="polyExpandSimplify" simplify expand>$poly</math>
  </setup>

  <p>Question: Factor the polynomial $polyExpandSimplify.</p>
  
  <p>Answer <mathinput name="ans" /></p>

  <answer name="check">
    <award>
      <when>
        <hasSameFactoring>$ans$poly</hasSameFactoring>
      </when>
    </award>
  </answer>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('x^2-1')
    cy.get('#\\/ans textarea').type('x^2{rightArrow}-1{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(2x^2-2)/2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x^2{rightArrow}-2)/2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(x-1)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(x-1)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(1-x)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('-(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}-(1-x)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    // verify bug from changing component types is fixed
    cy.log('swap minus signs a few times')
    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(1-x)(-1-x){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('-(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('-(x-1)(-1-x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}-(x-1)(-1-x){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


    cy.log('(x^2-1)x/x')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(x^2{rightArrow}-1)x/x{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(x^2-1)5/5')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}{backspace}(x^2{rightArrow}-1)5/5{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('((x-1)(x+1))')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}((x-1)(x+1)){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x-2)(x+1)/2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x-2)(x+1)/2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(2x-2)(x+1)(1/2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x-2)(x+1)(1/2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('1/2(2x-2)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}1/2{rightarrow}(2x-2)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('0.5(2x-2)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}0.5(2x-2)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('0.25(2x-2)(2x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}0.25(2x-2)(2x+2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('sqrt(x^2-1)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrtx^2{rightArrow}-1{rightArrow}^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('sqrt(2x^2-2)sqrt((x^2-1)/2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrt2x^2{rightArrow}-2{rightArrow}sqrt(x^2{rightArrow}-1)/2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('sqrt(4x^2-4)sqrt(x^2-1)/4')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrt4x^2{rightArrow}-4{rightArrow}sqrt(x^2{rightArrow}-1)/4{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

  });

  it('factor 4x^2-4', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">4(x-1)(x+1)</math>
      <math name="polyExpandSimplify" simplify expand>$poly</math>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
  
    <p>Answer <mathinput name="ans" /></p>
  
    <answer name="check">
      <award>
        <when>
          <hasSameFactoring>$ans$poly</hasSameFactoring>
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('4x^2-4')
    cy.get('#\\/ans textarea').type('4x^2{rightArrow}-4{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x-1)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x-1)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(1-x)(x+1){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(1-x)(-1-x){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('-4(1-x)(1+x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}-4(1-x)(1+x){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(1+x)(-4)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(1-x)(1+x)(-4){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('2(1-x)(1+x)(-2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}2(1-x)(1+x)(-2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x-2)(x+1)2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x-2)(x+1)2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('2(x-1)(2x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}2(x-1)(2x+2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


    cy.log('(3x-3)(8x+8)/6')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(3x-3)(8x+8)/6{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(3x-3)(8x+8)(1/6)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(3x-3)(8x+8)(1/6{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(6x-6)(8x+8)(1/6)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(6x-6)(8x+8)(1/6{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')


    cy.log('0.5(6x-6)(4x+4)(1/3)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}0.5(6x-6)(4x+4)(1/3{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

  });

  it('factor (6z-4)(5z+10)', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">(6z-4)(5z+10)</math>
      <math name="polyExpandSimplify" simplify expand>$poly</math>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
  
    <p>Answer <mathinput name="ans" /></p>
  
    <answer name="check">
      <award>
        <when>
          <hasSameFactoring>$ans$poly</hasSameFactoring>
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('30z^2+40z-40')
    cy.get('#\\/ans textarea').type('30z^2{rightArrow}+40z-40{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(6z-4)(5z+10)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(6z-4)(5z+10){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('5(6z-4)(z+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}5(6z-4)(z+2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('5(4-6z)(z+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}5(4-6z)(z+2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('5(2-3z)(z+2)(-2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}5(2-3z)(z+2)(-2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('15(2-3z)(z+2)(-2)(1/3')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}15(2-3z)(z+2)(-2)(1/3{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('15(2-3z)3(z+2)(-2)(1/9)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}15(2-3z)3(z+2)(-2)(1/9{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

  });



  it('factor (2x+4)^2', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">(2x+4)^2</math>
      <math name="polyExpandSimplify" simplify expand>$poly</math>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
  
    <p>Answer <mathinput name="ans" /></p>
  
    <answer name="check">
      <award>
        <when>
          <hasSameFactoring>$ans$poly</hasSameFactoring>
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('4x^2+16x+16')
    cy.get('#\\/ans textarea').type('4x^2{rightArrow}+16x+16{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x^2+4x+4)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x^2{rightArrow}+4x+4){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x+2)(x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x+2)(x+2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4(x+2)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x+2)^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x+4)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x+4)^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2(x+2))^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2(x+2))^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(x+4+x)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(x+4+x)^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(4x+8)(x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(4x+8)(x+2){enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4sqrt(x^2+4x+4)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4sqrtx^2{rightArrow}+4x+4{rightArrow}^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('sqrt(4x^2+16x+16)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrt4x^2{rightArrow}+16x+16{rightArrow}^2{enter}', { force: true });
    cy.wait(200);
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

  });


});