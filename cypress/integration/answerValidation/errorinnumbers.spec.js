describe('Allow error in numbers validation tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('expression with single number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math simplify>log(32x+c)</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.00001">
        <ref>_math1</ref>
      </award>
      <award credit="0.8" allowederrorinnumbers="0.0001">
        <ref>_math1</ref>
      </award>
      <award credit="0.6" allowederrorinnumbers="0.001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('log(32.04x+c){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).clear().type('log(32.01x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).clear().type('log(32.001x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('log(32.0001x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).clear().type('log(31.999x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).clear().type('log(31.99x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).clear().type('log(31.9x+c){enter}');
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
    <p><math simplify>log(32x+c)</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.00001" allowederrorisabsolute="true">
        <ref>_math1</ref>
      </award>
      <award credit="0.8" allowederrorinnumbers="0.0001" allowederrorisabsolute="true">
        <ref>_math1</ref>
      </award>
      <award credit="0.6" allowederrorinnumbers="0.001" allowederrorisabsolute="true">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('log(32.002x+c){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).clear().type('log(32.0005x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).clear().type('log(32.00005x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('log(32.000005x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).clear().type('log(31.99995x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).clear().type('log(31.9995x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).clear().type('log(31.995x+c){enter}');
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
        <ref>_math1</ref>
      </award>
      <award credit="0.6" allowederrorinnumbers="0.0001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10 exp(7x^2/(3-sqrt(y))){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('9.9 exp(6.9x^2/(3.1-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).clear().type('10.0001 exp(7.00005x^2/(2.99995-sqrt(y))){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('10.0000001 exp(7.0000001x^2/(2.9999999-sqrt(y))){enter}');
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
    <p><math simplify>10x^2-4</math> 
    <answer size="30">
      <award allowederrorinnumbers="0.0001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>

    <p>Allow for error in exponents
    <answer size="30">
      <award allowederrorinnumbers="0.0001" includeerrorinnumberexponents>
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputDescendants[0].componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10x^2-4{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('10x^2-4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('10.002x^2.0004-4.0008{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('10.002x^2.0004-4.0008{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Too large an error if don't allow exponent error")
      cy.get(mathinputAnchor).clear().type('10.002x^2-4.0008{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('10.002x^2-4.0008{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Shrink to allowable error in both cases")
      cy.get(mathinputAnchor).clear().type('10.0002x^2-4.00008{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('10.0002x^2-4.00008{enter}');
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
    <p><math simplify>log(32x+c)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.00001">
        <ref>_math1</ref>
      </award>
      <award credit="0.8" symbolicequality="true" allowederrorinnumbers="0.0001">
        <ref>_math1</ref>
      </award>
      <award credit="0.6" symbolicequality="true" allowederrorinnumbers="0.001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('log(32.04x+c){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).clear().type('log(32.01x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).clear().type('log(32.001x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('log(32.0001x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).clear().type('log(31.999x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).clear().type('log(31.99x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).clear().type('log(31.9x+c){enter}');
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
    <p><math simplify>log(32x+c)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.00001" allowederrorisabsolute="true">
        <ref>_math1</ref>
      </award>
      <award credit="0.8" symbolicequality="true" allowederrorinnumbers="0.0001" allowederrorisabsolute="true">
        <ref>_math1</ref>
      </award>
      <award credit="0.6" symbolicequality="true" allowederrorinnumbers="0.001" allowederrorisabsolute="true">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('log(32x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error")
      cy.get(mathinputAnchor).clear().type('log(32.002x+c){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("shink error")
      cy.get(mathinputAnchor).clear().type('log(32.0005x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("shink error further")
      cy.get(mathinputAnchor).clear().type('log(32.00005x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('log(32.000005x+c){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });


      cy.log("increase error")
      cy.get(mathinputAnchor).clear().type('log(31.99995x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });


      cy.log("increase error further")
      cy.get(mathinputAnchor).clear().type('log(31.9995x+c){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("error too large again")
      cy.get(mathinputAnchor).clear().type('log(31.995x+c){enter}');
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
    <p><math simplify>10000 exp(7x^2/(0.00003-sqrt(y)))</math> 
    <answer size="40">
      <award symbolicequality="true" allowederrorinnumbers="0.0000001">
        <ref>_math1</ref>
      </award>
      <award symbolicequality="true" credit="0.8" allowederrorinnumbers="0.000001">
        <ref>_math1</ref>
      </award>
      <award symbolicequality="true" credit="0.6" allowederrorinnumbers="0.00001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10000 exp(7x^2/(0.00003-sqrt(y))){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first number")
      cy.get(mathinputAnchor).clear().type('9999 exp(7x^2/(0.00003-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in second number")
      cy.get(mathinputAnchor).clear().type('10000 exp(7.0001x^2/(0.00003-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in third number")
      cy.get(mathinputAnchor).clear().type('10000 exp(7x^2/(0.0000300005-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("partial credit error in each")
      cy.get(mathinputAnchor).clear().type('9999.91 exp(7.00005x^2/(0.0000300002-sqrt(y))){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("higher partial credit error in each")
      cy.get(mathinputAnchor).clear().type('9999.991 exp(7.000005x^2/(0.00003000002-sqrt(y))){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });

      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('9999.9991 exp(7.0000005x^2/(0.000030000002-sqrt(y))){enter}');
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
      <award symbolicequality="true" allowederrorinnumbers="0.0000001" allowederrorisabsolute>
        <ref>_math1</ref>
      </award>
      <award symbolicequality="true" credit="0.8" allowederrorinnumbers="0.000001" allowederrorisabsolute>
        <ref>_math1</ref>
      </award>
      <award symbolicequality="true" credit="0.6" allowederrorinnumbers="0.00001" allowederrorisabsolute>
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10000 exp(7x^2/(0.00003-sqrt(y))){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in first number")
      cy.get(mathinputAnchor).clear().type('9999.9999 exp(7x^2/(0.00003-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in second number")
      cy.get(mathinputAnchor).clear().type('10000 exp(7.00002x^2/(0.00003-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Enter too large an error in third number")
      cy.get(mathinputAnchor).clear().type('10000 exp(7x^2/(0.00005-sqrt(y))){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("partial credit error in each")
      cy.get(mathinputAnchor).clear().type('9999.999991 exp(7.000005x^2/(0.000032-sqrt(y))){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '60 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.6, 1E-14);
      });

      cy.log("higher partial credit error in each")
      cy.get(mathinputAnchor).clear().type('9999.9999991 exp(7.0000005x^2/(0.0000302-sqrt(y))){enter}');
      cy.get(mathinputPartialAnchor).should('have.text', '80 %');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).closeTo(0.8, 1E-14);
      });

      cy.log("acceptable error for full credit")
      cy.get(mathinputAnchor).clear().type('9999.99999991 exp(7.00000005x^2/(0.00003002-sqrt(y))){enter}');
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
      <award symbolicequality="true" allowederrorinnumbers="0.0001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>

    <p>Allow for error in exponents
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.0001" includeerrorinnumberexponents>
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      let mathinput2Name = components['/_answer2'].stateValues.inputDescendants[0].componentName
      let mathinput2Anchor = '#' + mathinput2Name + '_input';
      let mathinput2SubmitAnchor = '#' + mathinput2Name + '_submit';
      let mathinput2CorrectAnchor = '#' + mathinput2Name + '_correct';
      let mathinput2PartialAnchor = '#' + mathinput2Name + '_partial';
      let mathinput2IncorrectAnchor = '#' + mathinput2Name + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');
      cy.get(mathinput2SubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('10x^2-4{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).type('10x^2-4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Enter too large an error in exponent")
      cy.get(mathinputAnchor).clear().type('10x^2.0004-4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('10x^2.0004-4{enter}');
      cy.get(mathinput2IncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Small error in exponent")
      cy.get(mathinputAnchor).clear().type('10x^2.0001-4{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('10x^2.0001-4{enter}');
      cy.get(mathinput2CorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
        expect(components['/_answer2'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Error in numbers not in exponents")
      cy.get(mathinputAnchor).clear().type('10.0002x^2-4.00008{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');
      cy.get(mathinput2Anchor).clear().type('10.0002x^2-4.00008{enter}');
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
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('2.15234262pi+e*25.602348230{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering not allowed")
      cy.get(mathinputAnchor).clear().type('pi2.15234262+e*25.602348230{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).clear().type('e*25.602348230+2.15234262pi{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation not allowed")
      cy.get(mathinputAnchor).clear().type('76.35618172248981{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).clear().type('2.15pi+e*25.602348230{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).clear().type('2.15234262pi+2.73*25.602348230{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("acceptable rounding")
      cy.get(mathinputAnchor).clear().type('2.152 3.142 + 2.718*25.6{enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });
    })

  });

  it('symbolic, evaluate numbers, preserve order', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>a</p>
    <p><math simplify="numbersPreserveOrder">sin(2pi+1x+4x+pi+6)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('sin(2pi+1x+4x+pi+6){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering not allowed")
      cy.get(mathinputAnchor).clear().type('sin(2pi+pi+1x+4x+6){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Combining terms not allowed")
      cy.get(mathinputAnchor).clear().type('sin(2pi+5x+pi+6){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation OK")
      cy.get(mathinputAnchor).clear().type('sin(6.28318+x+4x+9.14159){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).clear().type('sin(6.28318+x+4x+9.14{enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });
      cy.get(mathinputAnchor).clear().type('6.28+x+4x+9.14159{enter}');
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
    <p><math simplify="numbers">sin(2pi+1x+4x+pi+6)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('sin(2pi+1x+4x+pi+6){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering allowed")
      cy.get(mathinputAnchor).clear().type('sin(2pi+pi+1x+4x+6){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combining terms not allowed")
      cy.get(mathinputAnchor).clear().type('sin(2pi+5x+pi+6){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

      cy.log("Numeric evaluation OK")
      cy.get(mathinputAnchor).clear().type('sin(6.28318+x+4x+9.14159){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.get(mathinputAnchor).clear().type('sin(x+15.42478+4x){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).clear().type('sin(x+15.4+4x){enter}');
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
    <p><math simplify="full">sin(2pi+1x+4x+pi+6)</math> 
    <answer size="30">
      <award symbolicequality="true" allowederrorinnumbers="0.001">
        <ref>_math1</ref>
      </award>
    </answer>
    </p>
    `}, "*");
    });
    cy.get('#\\/_p1').should('have.text', "a");  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathinputName = components['/_answer1'].stateValues.inputDescendants[0].componentName
      let mathinputAnchor = '#' + mathinputName + '_input';
      let mathinputSubmitAnchor = '#' + mathinputName + '_submit';
      let mathinputCorrectAnchor = '#' + mathinputName + '_correct';
      let mathinputPartialAnchor = '#' + mathinputName + '_partial';
      let mathinputIncorrectAnchor = '#' + mathinputName + '_incorrect';

      cy.get(mathinputSubmitAnchor).should('be.visible');

      cy.log("Submit exact answer")
      cy.get(mathinputAnchor).type('sin(2pi+1x+4x+pi+6){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Reordering allowed")
      cy.get(mathinputAnchor).clear().type('sin(2pi+pi+1x+4x+6){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Combining terms allowed")
      cy.get(mathinputAnchor).clear().type('sin(2pi+5x+pi+6){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Numeric evaluation OK")
      cy.get(mathinputAnchor).clear().type('sin(6.28318+x+4x+9.14159){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.get(mathinputAnchor).clear().type('sin(15.42478+5x){enter}');
      cy.get(mathinputCorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
      });

      cy.log("Round too much")
      cy.get(mathinputAnchor).clear().type('sin(15.4+5x){enter}');
      cy.get(mathinputIncorrectAnchor).should('be.visible');

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
      });

    });
  })

});