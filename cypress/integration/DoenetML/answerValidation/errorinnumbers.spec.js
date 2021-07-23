import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Allow error in numbers validation tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('expression with single number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.00001">
        <copy tname="_math1" />
      </award>
      <award credit="0.8" allowederrorinnumbers="0.0001">
        <copy tname="_math1" />
      </award>
      <award credit="0.6" allowederrorinnumbers="0.001">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.04x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.01x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.001x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.0001x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.999x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.99x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.9x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('expression with single number, absolute error', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.00001" allowederrorisabsolute="true">
        <copy tname="_math1" />
      </award>
      <award credit="0.8" allowederrorinnumbers="0.0001" allowederrorisabsolute="true">
        <copy tname="_math1" />
      </award>
      <award credit="0.6" allowederrorinnumbers="0.001" allowederrorisabsolute="true">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.002x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.0005x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.00005x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.000005x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.99995x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.9995x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.995x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  // since will randomly fail, just skip test
  it.skip('complicated expression with three numbers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math simplify>10 exp(7x^2/(3-sqrt(y)))</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.0000001">
        <copy tname="_math1" />
      </award>
      <award credit="0.6" allowederrorinnumbers="0.0001">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10 exp(7x^2/3-sqrty{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('9.9 exp(6.9x^2/3.1-sqrty{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).clear().type('10.0001 exp(7.00005x^2/2.99995-sqrty{enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('10.0000001 exp(7.0000001x^2/2.9999999-sqrty{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });
    })

  });

  it("don't ignore exponents", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>10x^2-4</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.0001">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>

    <p>Allow for error in exponents
    <answer size="30">
      <award allowederrorinnumbers="0.0001" includeerrorinnumberexponents>
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = cesc(components['/_answer2'].stateValues.inputChildren[0].componentName)
      let mathinput2Anchor = '#' + mathinput2Name + ' textarea';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10x^2{rightarrow}-4{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('10x^2{rightarrow}-4{enter}', { force: true, delay: 0 });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.002x^2.0004{rightarrow}-4.0008{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.002x^2.0004{rightarrow}-4.0008{enter}', { force: true, delay: 0 });
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Too large an error if don't allow exponent error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.002x^2{rightarrow}-4.0008{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.002x^2{rightarrow}-4.0008{enter}', { force: true, delay: 0 });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Shrink to allowable error in both cases")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.0002x^2{rightarrow}-4.00008{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.0002x^2{rightarrow}-4.00008{enter}', { force: true, delay: 0 });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic, expression with single number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.00001" simplifyOnCompare>
        <copy tname="_math1" />
      </award>
      <award credit="0.8" symbolicequality="true" allowederrorinnumbers="0.0001" simplifyOnCompare>
        <copy tname="_math1" />
      </award>
      <award credit="0.6" symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare>
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.04x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.01x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.001x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.0001x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.999x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.99x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.9x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('symbolic, expression with single number, absolute error', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>log(32x+c)</math> 
    <answer size="30" symbolicequality allowederrorinnumbers="0.00001" allowederrorisabsolute simplifyOnCompare>
      <award>$_math1</award>
      <award credit="0.8" allowederrorinnumbers="0.0001">$_math1</award>
      <award credit="0.6" allowederrorinnumbers="0.001">$_math1</award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.002x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.0005x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.00005x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(32.000005x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.99995x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.9995x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}log(31.995x+c){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('symbolic, complicated expression with three numbers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>10000 exp(7x^2/(0.00003-sqrt(y)))</math> 
    <answer size="40" symbolicequality simplifyOnCompare>
      <award allowederrorinnumbers="0.0000001" >
        <copy tname="_math1" />
      </award>
      <award credit="0.8" allowederrorinnumbers="0.000001">
        <copy tname="_math1" />
      </award>
      <award credit="0.6" allowederrorinnumbers="0.00001">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10000 exp(7x^2{rightarrow}/0.00003-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first number")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999 exp(7x^2{rightarrow}/0.00003-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in second number")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10000 exp(7.0001x^2{rightarrow}/0.00003-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in third number")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10000 exp(7x^2{rightarrow}/0.0000300005-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("partial credit error in each")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.91 exp(7.00005x^2{rightarrow}/0.0000300002-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("higher partial credit error in each")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.991 exp(7.000005x^2{rightarrow}/0.00003000002-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });

      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.9991 exp(7.0000005x^2{rightarrow}/0.000030000002-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

    })
  });

  it('symbolic, complicated expression with three numbers, absolute error', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math simplify>10000 exp(7x^2/(0.00003-sqrt(y)))</math> 
    <answer size="40">
      <award symbolicequality="true" allowederrorinnumbers="0.0000001" allowederrorisabsolute simplifyOnCompare>
        <copy tname="_math1" />
      </award>
      <award symbolicequality="true" credit="0.8" allowederrorinnumbers="0.000001" allowederrorisabsolute simplifyOnCompare>
        <copy tname="_math1" />
      </award>
      <award symbolicequality="true" credit="0.6" allowederrorinnumbers="0.00001" allowederrorisabsolute simplifyOnCompare>
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10000 exp(7x^2{rightarrow}/0.00003-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first number")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.9999 exp(7x^2{rightarrow}/0.00003-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in second number")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10000 exp(7.00002x^2{rightarrow}/0.00003-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in third number")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10000 exp(7x^2{rightarrow}/0.00005-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("partial credit error in each")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.999991 exp(7.000005x^2{rightarrow}/0.000032-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("higher partial credit error in each")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.9999991 exp(7.0000005x^2{rightarrow}/0.0000302-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });

      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9999.99999991 exp(7.00000005x^2{rightarrow}/0.00003002-sqrty{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it("symbolic, don't ignore exponents", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math simplify>10x^2-4</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.0001" simplifyOnCompare>
        <copy tname="_math1" />
      </award>
    </answer>
    </p>

    <p>Allow for error in exponents
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.0001" includeerrorinnumberexponents simplifyOnCompare>
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = cesc(components['/_answer2'].stateValues.inputChildren[0].componentName)
      let mathinput2Anchor = '#' + mathinput2Name + ' textarea';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10x^2{rightarrow}-4{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('10x^2{rightarrow}-4{enter}', { force: true, delay: 0 });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in exponent")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10x^2{rightarrow}.0004-4{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10x^2{rightarrow}.0004-4{enter}', { force: true, delay: 0 });
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Small error in exponent")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10x^2{rightarrow}.0001-4{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10x^2{rightarrow}.0001-4{enter}', { force: true, delay: 0 });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Error in numbers not in exponents")
      cy.get(mathinputAnchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.0002x^2{rightarrow}-4.00008{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}10.0002x^2{rightarrow}-4.00008{enter}', { force: true, delay: 0 });
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });
    })
  });

  it('symbolic, no simplification', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>2.15234262pi+e*25.602348230</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('2.15234262pi+e*25.602348230{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering not allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}pi2.15234262+e*25.602348230{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}e*25.602348230+2.15234262pi{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation not allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}.35618172248981{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2.15pi+e*25.602348230{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2.15234262pi+2.73*25.602348230{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("acceptable rounding")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2.152 3.142 + 2.718*25.6{enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });
    })

  });

  // TODO: currently failing.  Need to investigate
  it.skip('symbolic, evaluate numbers, preserve order', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>sin(2pi+1x+4x+pi+6)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare="numbersPreserveOrder">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('sin(2pi+1x+4x+pi+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering not allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(2pi+pi+1x+4x+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Combining terms not allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(2pi+5x+pi+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation OK")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(6.28318+x+4x+9.14159){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(6.28318+x+4x+9.14{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}6.28+x+4x+9.14159{enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

    })
  });

  it('symbolic, evaluate numbers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>sin(2pi+1x+4x+pi+6)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare="numbers">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('sin(2pi+1x+4x+pi+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(2pi+pi+1x+4x+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combining terms not allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(2pi+5x+pi+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation OK")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(6.28318+x+4x+9.14159){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(x+15.42478+4x){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(x+15.4+4x){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
    })

  });

  it('symbolic, full simplification', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math>sin(2pi+1x+4x+pi+6)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001" simplifyOnCompare="full">
        <copy tname="_math1" />
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = cesc(components['/_answer1'].stateValues.inputChildren[0].componentName)
      let mathinputAnchor = '#' + mathinputName + ' textarea';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('sin(2pi+1x+4x+pi+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(2pi+pi+1x+4x+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combining terms allowed")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(2pi+5x+pi+6){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Numeric evaluation OK")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(6.28318+x+4x+9.14159){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(15.42478+5x){enter}', { force: true, delay: 0 });
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}sin(15.4+5x){enter}', { force: true, delay: 0 });
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

    });
  })

});