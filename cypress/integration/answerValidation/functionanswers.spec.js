describe('Function answer validation tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('simple function of input', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <function name="f">cos(2*pi*x)</function>
  
  <p>Enter a number close to an integer:
  <answer>
    <mathinput name="x" />
    <award credit="$$f($(x{prop='immediateValue' isResponse}))">
      <when>true</when>
    </award>
  </answer>
  </p>
    `}, "*");
    });

    let partialCredit005 = Math.cos(2 * Math.PI * 0.05);
    let partialCredit01 = Math.cos(2 * Math.PI * 0.1);
    let partialCredit015 = Math.cos(2 * Math.PI * 0.15);
    let partialCredit02 = Math.cos(2 * Math.PI * 0.2);
    let partialCredit005Percent = Math.round(Math.cos(2 * Math.PI * 0.05) * 100);
    let partialCredit01Percent = Math.round(Math.cos(2 * Math.PI * 0.1) * 100);
    let partialCredit015Percent = Math.round(Math.cos(2 * Math.PI * 0.15) * 100);
    let partialCredit02Percent = Math.round(Math.cos(2 * Math.PI * 0.2) * 100);

    cy.get('#\\/x_submit').should('be.visible');

    cy.log("Submit empty answer")
    cy.get('#\\/x_submit').click();
    cy.get('#\\/x_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit correct answers")
    cy.get('#\\/x textarea').type('7{enter}', { force: true });
    cy.get('#\\/x_correct').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}0{enter}', { force: true });
    cy.get('#\\/x_correct').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}-14{enter}', { force: true });
    cy.get('#\\/x_correct').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}33{enter}', { force: true });
    cy.get('#\\/x_correct').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}-102351{enter}', { force: true });
    cy.get('#\\/x_correct').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Submit incorrect answers")
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}9.5{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}x^2{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}-253.3{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}23.6{enter}', { force: true });
    cy.get('#\\/x_incorrect').should('be.visible');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit partially correct answers")
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}{backspace}11.9{enter}', { force: true });
    cy.get('#\\/x_partial').should('have.text', `${partialCredit01Percent} %`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).closeTo(partialCredit01, 1E-12);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}{backspace}73.15{enter}', { force: true });
    cy.get('#\\/x_partial').should('have.text', `${partialCredit015Percent} %`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).closeTo(partialCredit015, 1E-12);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}-103.8{enter}', { force: true });
    cy.get('#\\/x_partial').should('have.text', `${partialCredit02Percent} %`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).closeTo(partialCredit02, 1E-12);
    });
    cy.get('#\\/x textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-0.05{enter}', { force: true });
    cy.get('#\\/x_partial').should('have.text', `${partialCredit005Percent} %`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).closeTo(partialCredit005, 1E-12);
    });

  });


  it('function with parameters', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `

  <p>Offset: <mathinput name="offset" prefill="0"/></p>
  <p>Period: <mathinput name="period" prefill="1"/></p>
  <p>Magnitude <mathinput name="magnitude" prefill="1"/></p>
  <function name="f" formula="$magnitude cos(2*pi*(x-$offset)/$period)" />
  <p>Enter a number:
  <answer>
    <mathinput name="x" />
    <award credit="$$f($(x{prop='immediateValue' isResponse}))">
      <when>true</when>
    </award>
  </answer>
  </p>
    `}, "*");
    });

    let offsets = [0, Math.E,];
    let periods = [2, Math.PI / 2];
    let magnitudes = [0.5, 2];

    let partialCredit = (o, p, m, x) => Math.max(0, Math.min(1, m * Math.cos(2 * Math.PI * (x - o) / p)));
    let partialCreditPercent = (o, p, m, x) => Math.round(partialCredit(o, p, m, x) * 100);

    let numberAnswers = [Math.E, 0, 2 / 3, -Math.PI / 2, -252351.9]

    cy.get('#\\/x_submit').should('be.visible');

    cy.log("Submit empty answer")
    cy.get('#\\/x_submit').click();
    cy.get('#\\/x_incorrect').should('be.visible');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });


    for (let offset of offsets) {
      cy.get('#\\/offset textarea').type(`{end}{backspace}{backspace}{backspace}${offset}{enter}`, { force: true });
      for (let period of periods) {
        cy.get('#\\/period textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}${period}{enter}`, { force: true });
        for (let magnitude of magnitudes) {
          cy.get('#\\/magnitude textarea').type(`{end}{backspace}{backspace}{backspace}${magnitude}{enter}`, { force: true });

          let maximals = [offset, offset + 2 * period, offset - 7 * period];
          let minimals = [offset + 1.5 * period, offset + 5.5 * period, offset - 7.5 * period];

          cy.log("Submit answers");
          for (let ans of [...maximals, ...minimals, ...numberAnswers]) {
            cy.get('#\\/x textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}${ans}{enter}`, { force: true });
            let credit = partialCredit(offset, period, magnitude, ans);
            if (credit === 1) {
              cy.get('#\\/x_correct').should('be.visible');
            } else if (credit === 0) {
              cy.get('#\\/x_incorrect').should('be.visible');
            } else {
              let percent = partialCreditPercent(offset, period, magnitude, ans);
              cy.get('#\\/x_partial').should('have.text', `${percent} %`)

              cy.window().then((win) => {
                let components = Object.assign({}, win.state.components);
                expect(components['/_answer1'].stateValues.creditAchieved).closeTo(credit, 1E-8);
              });
            }
          }
        }
      }
    }


  });



});