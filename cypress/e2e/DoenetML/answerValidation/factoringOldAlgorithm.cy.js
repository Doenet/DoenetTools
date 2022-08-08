describe('factor polynomial tests, old algorithm', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  // Note: even through have a better factoring test,
  // we are keeping these tests, as they probe how well
  // we can handle components that change type
  // (due to the multiple conditionalContents that are copied)
  it('factor x^2-1', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
    <math name="poly">x^2-1</math>
    <math name="polyExpandSimplify" simplify expand>$poly</math>
    <math name="ansSimplify" simplify>$ans</math>
    <math name="ansExpandSimplify" simplify expand>$ans</math>
    <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
    <text name="minus">-</text>
    <text name="mult">*</text>
    <text name="div">/</text>
    <text name="pow">^</text>
    <text name="add">+</text>
    <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
      <case condition="$originalOperator=$minus">
        <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
        <extractMathOperator>$temp</extractMathOperator>
      </case>
      <else>$ansSimplify $originalOperator</else>
    </conditionalContent>
    <conditionalContent assignNames="(numerator denominator numeratorOperator)">
      <case condition="$postMinusOperator=$div">
        <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
        <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
        <extractMathOperator>$temp2</extractMathOperator>
      </case>
      <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
    </conditionalContent>
    <extractMath type="operand" operandNumber="1" name="numeratorOperand1">$numerator</extractMath>
    <extractMath type="numberOfOperands" name="numeratorNumOperands">$numerator</extractMath>
    <conditionalContent assignNames="(innerPiece innerOperator)">
      <case condition="$numeratorOperator=$mult and isnumber($numeratorOperand1) and $numeratorNumOperands = 2" >
        <extractMath type="operand" operandNumber="2" name="temp3">$numerator</extractMath>
        <extractMathOperator>$temp3</extractMathOperator>
      </case>
      <else>$numerator $numeratorOperator</else>
    </conditionalContent>
  </setup>

  <p>Question: Factor the polynomial $polyExpandSimplify.</p>
  
  <p>Answer <mathinput name="ans" /></p>

  <answer name="check" symbolicEquality>
    <award>
      <when>
        $ansExpandSimplify = $polyExpandSimplify
        and
        (
          (
            $innerOperator = $pow 
            and
            <extractMathOperator><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></extractMathOperator> = $add
          )
          or
          $innerOperator = $mult
          and
          <isNumber>$denominator</isNumber>
          and
          (
            <extractMath type="numberOfOperands">$innerPiece</extractMath> = 3
            or 
            not <isNumber><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></isNumber>
          )
        )
      </when>
    </award>
  </answer>
      `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('x^2-1')
    cy.get('#\\/ans textarea').type('x^2{rightArrow}-1{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(2x^2-2)/2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x^2{rightArrow}-2)/2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(x-1)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(x-1)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(1-x)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('-(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}-(1-x)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    // verify bug from changing component types is fixed
    cy.log('swap minus signs a few times')
    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.get('#\\/ans textarea').type('{home}{rightarrow}{backspace}{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(1-x)(-1-x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('-(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{home}-{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('-(x-1)(-1-x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}-(x-1)(-1-x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


    cy.log('(x^2-1)x/x')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(x^2{rightArrow}-1)x/x{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(x^2-1)5/5')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}{backspace}(x^2{rightArrow}-1)5/5{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('((x-1)(x+1))')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}((x-1)(x+1)){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x-2)(x+1)/2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x-2)(x+1)/2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('1/2(2x-2)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}1/2{rightarrow}(2x-2)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('0.5(2x-2)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}0.5(2x-2)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('0.25(2x-2)(2x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}0.25(2x-2)(2x+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('sqrt(x^2-1)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrtx^2{rightArrow}-1{rightArrow}^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('sqrt(2x^2-2)sqrt((x^2-1)/2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrt2x^2{rightArrow}-2{rightArrow}sqrt(x^2{rightArrow}-1)/2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('sqrt(4x^2-4)sqrt(x^2-1)/4')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrt4x^2{rightArrow}-4{rightArrow}sqrt(x^2{rightArrow}-1)/4{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

  });

  it('factor 4x^2-4', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">4x^2-4</math>
      <math name="polyExpandSimplify" simplify expand>$poly</math>
      <math name="ansSimplify" simplify>$ans</math>
      <math name="ansExpandSimplify" simplify expand>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <text name="pow">^</text>
      <text name="add">+</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
      <extractMath type="operand" operandNumber="1" name="numeratorOperand1">$numerator</extractMath>
      <extractMath type="numberOfOperands" name="numeratorNumOperands">$numerator</extractMath>
      <conditionalContent assignNames="(innerPiece innerOperator)">
        <case condition="$numeratorOperator=$mult and isnumber($numeratorOperand1) and $numeratorNumOperands = 2" >
          <extractMath type="operand" operandNumber="2" name="temp3">$numerator</extractMath>
          <extractMathOperator>$temp3</extractMathOperator>
        </case>
        <else>$numerator $numeratorOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check" symbolicEquality>
      <award>
        <when>
          $ansExpandSimplify = $polyExpandSimplify
          and
          (
            (
              $innerOperator = $pow 
              and
              <extractMathOperator><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></extractMathOperator> = $add
            )
            or
            $innerOperator = $mult
            and
            <isNumber>$denominator</isNumber>
            and
            (
              <extractMath type="numberOfOperands">$innerPiece</extractMath> = 3
              or 
              not <isNumber><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('4x^2-4')
    cy.get('#\\/ans textarea').type('4x^2{rightArrow}-4{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x-1)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x-1)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4(1-x)(x+1)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(1-x)(x+1){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(1-x)(-1-x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(1-x)(-1-x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('-4(1-x)(1+x)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}-4(1-x)(1+x){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(1-x)(1+x)(-4)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(1-x)(1+x)(-4){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('2(1-x)(1+x)(-2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}2(1-x)(1+x)(-2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x-2)(x+1)2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x-2)(x+1)2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('2(x-1)(2x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}2(x-1)(2x+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')


    cy.log('(3x-3)(8x+8)/6')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(3x-3)(8x+8)/6{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(6x-6)(8x+8)/6')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(6x-6)(8x+8)/6{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')


    cy.log('0.5(6x-6)(4x+4)/3')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}0.5(6x-6)(4x+4)/3{enter}', { force: true });
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
      <math name="ansSimplify" simplify>$ans</math>
      <math name="ansExpandSimplify" simplify expand>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <text name="pow">^</text>
      <text name="add">+</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
      <extractMath type="operand" operandNumber="1" name="numeratorOperand1">$numerator</extractMath>
      <extractMath type="numberOfOperands" name="numeratorNumOperands">$numerator</extractMath>
      <conditionalContent assignNames="(innerPiece innerOperator)">
        <case condition="$numeratorOperator=$mult and isnumber($numeratorOperand1) and $numeratorNumOperands = 2" >
          <extractMath type="operand" operandNumber="2" name="temp3">$numerator</extractMath>
          <extractMathOperator>$temp3</extractMathOperator>
        </case>
        <else>$numerator $numeratorOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check" symbolicEquality simplifyOnCompare>
      <award simplifyOnCompare expandOnCompare>
        <when>
          $ansExpandSimplify = $polyExpandSimplify
          and
          (
            (
              $innerOperator = $pow 
              and
              <extractMathOperator><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></extractMathOperator> = $add
            )
            or
            $innerOperator = $mult
            and
            <isNumber>$denominator</isNumber>
            and
            (
              <extractMath type="numberOfOperands">$innerPiece</extractMath> = 3
              or 
              not <isNumber><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('30z^2+40z-40')
    cy.get('#\\/ans textarea').type('30z^2{rightArrow}+40z-40{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(6z-4)(5z+10)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(6z-4)(5z+10){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('5(6z-4)(z+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}5(6z-4)(z+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('5(4-6z)(z+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}5(4-6z)(z+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('5(2-3z)(z+2)(-2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}5(2-3z)(z+2)(-2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('15(2-3z)(z+2)(-2)/3')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}15(2-3z)(z+2)(-2)/3{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('15(2-3z)3(z+2)(-2)/9')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}15(2-3z)3(z+2)(-2)/9{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

  });

  it('factor (3q+2r)(6s+8t)', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><text>a</text></p>
    <setup>
      <math name="poly">(3q+2r)(6s+8t)</math>
      <math name="polyExpandSimplify" simplify expand>$poly</math>
      <math name="ansSimplify" simplify>$ans</math>
      <math name="ansExpandSimplify" simplify expand>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <text name="pow">^</text>
      <text name="add">+</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
      <extractMath type="operand" operandNumber="1" name="numeratorOperand1">$numerator</extractMath>
      <extractMath type="numberOfOperands" name="numeratorNumOperands">$numerator</extractMath>
      <conditionalContent assignNames="(innerPiece innerOperator)">
        <case condition="$numeratorOperator=$mult and isnumber($numeratorOperand1) and $numeratorNumOperands = 2" >
          <extractMath type="operand" operandNumber="2" name="temp3">$numerator</extractMath>
          <extractMathOperator>$temp3</extractMathOperator>
        </case>
        <else>$numerator $numeratorOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check" symbolicEquality>
      <award>
        <when>
          $ansExpandSimplify = $polyExpandSimplify
          and
          (
            (
              $innerOperator = $pow 
              and
              <extractMathOperator><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></extractMathOperator> = $add
            )
            or
            $innerOperator = $mult
            and
            <isNumber>$denominator</isNumber>
            and
            (
              <extractMath type="numberOfOperands">$innerPiece</extractMath> = 3
              or 
              not <isNumber><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('18qs+24qt+12rs+16rt')
    cy.get('#\\/ans textarea').type('30z^2{rightArrow}+40z-40{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(3q+2r)(6s+8t)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(3q+2r)(6s+8t){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('3q(6s+8t) + 2r(6s+8t)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}3q(6s+8t) + 2r(6s+8t){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('(6s+8t)(3q+2r)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(6s+8t)(3q+2r){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(8t+6s)(3q+2r)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(8t+6s)(3q+2r){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(8t+6s)(2r+3q)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(8t+6s)(2r+3q){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(8t+6s)(2r+q+q+q)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(8t+6s)(2r+q+q+q){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(4t+3s)2(2r+3q)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(4t+3s)2(2r+3q){enter}', { force: true });
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
      <math name="ansSimplify" simplify>$ans</math>
      <math name="ansExpandSimplify" simplify expand>$ans</math>
      <extractMathOperator name="originalOperator">$ansSimplify</extractMathOperator>
      <text name="minus">-</text>
      <text name="mult">*</text>
      <text name="div">/</text>
      <text name="pow">^</text>
      <text name="add">+</text>
      <conditionalContent assignNames="(ansNoMinus postMinusOperator)">
        <case condition="$originalOperator=$minus">
          <extractMath type="operand" operandNumber="1" name="temp">$ansSimplify</extractMath>
          <extractMathOperator>$temp</extractMathOperator>
        </case>
        <else>$ansSimplify $originalOperator</else>
      </conditionalContent>
      <conditionalContent assignNames="(numerator denominator numeratorOperator)">
        <case condition="$postMinusOperator=$div">
          <extractMath type="operand" operandNumber="1" name="temp2">$ansNoMinus</extractMath>
          <extractMath type="operand" operandNumber="2">$ansNoMinus</extractMath>
          <extractMathOperator>$temp2</extractMathOperator>
        </case>
        <else>$ansNoMinus <math>1</math> $postMinusOperator</else>
      </conditionalContent>
      <extractMath type="operand" operandNumber="1" name="numeratorOperand1">$numerator</extractMath>
      <extractMath type="numberOfOperands" name="numeratorNumOperands">$numerator</extractMath>
      <conditionalContent assignNames="(innerPiece innerOperator)">
        <case condition="$numeratorOperator=$mult and isnumber($numeratorOperand1) and $numeratorNumOperands = 2" >
          <extractMath type="operand" operandNumber="2" name="temp3">$numerator</extractMath>
          <extractMathOperator>$temp3</extractMathOperator>
        </case>
        <else>$numerator $numeratorOperator</else>
      </conditionalContent>
    </setup>
  
    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
    
    <p>Answer <mathinput name="ans" /></p>

    <answer name="check" symbolicEquality>
      <award>
        <when>
          $ansExpandSimplify = $polyExpandSimplify
          and
          (
            (
              $innerOperator = $pow 
              and
              <extractMathOperator><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></extractMathOperator> = $add
            )
            or
            $innerOperator = $mult
            and
            <isNumber>$denominator</isNumber>
            and
            (
              <extractMath type="numberOfOperands">$innerPiece</extractMath> = 3
              or 
              not <isNumber><extractMath type="operand" operandNumber="1">$innerPiece</extractMath></isNumber>
            )
          )
        </when>
      </award>
    </answer>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    cy.log('4x^2+16x+16')
    cy.get('#\\/ans textarea').type('4x^2{rightArrow}+16x+16{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x^2+4x+4)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x^2{rightArrow}+4x+4){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('4(x+2)(x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x+2)(x+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4(x+2)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4(x+2)^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2x+4)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2x+4)^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(2(x+2))^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(2(x+2))^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(x+4+x)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(x+4+x)^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('(4x+8)(x+2)')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}(4x+8)(x+2){enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_correct').should('be.visible')

    cy.log('4sqrt(x^2+4x+4)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}4sqrtx^2{rightArrow}+4x+4{rightArrow}^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

    cy.log('sqrt(4x^2+16x+16)^2')
    cy.get('#\\/ans textarea').type('{ctrl+home}{shift+end}{backspace}sqrt4x^2{rightArrow}+16x+16{rightArrow}^2{enter}', { force: true });
    cy.get('#\\/check_submit').click();
    cy.get('#\\/check_incorrect').should('be.visible')

  });


});