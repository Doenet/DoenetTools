describe('Boolean Operator on Math Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('isinteger, is number', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <mathinput name="n"/>
    <number name="asNum">$n</number>
    <p>
    <isInteger name="int1">$n</isInteger>
    <isInteger name="int2">$asNum</isInteger>
    <boolean name="int3">isinteger($n)</boolean>
    <boolean name="int4">isinteger($asNum)</boolean>
    <isInteger name="int5">$n/2</isInteger>
    <isInteger name="int6">$asNum/2</isInteger>
    <isInteger name="int7">5</isInteger>
    <isInteger name="int8">5.3</isInteger>
    <isNumber name="num1">$n</isNumber>
    <isNumber name="num2">$asNum</isNumber>
    <boolean name="num3">isnumber($n)</boolean>
    <boolean name="num4">isnumber($asNum)</boolean>
    <isNumber name="num5">$n/2</isNumber>
    <isNumber name="num6">$asNum/2</isNumber>
    <isNumber name="num7">5</isNumber>
    <isNumber name="num8">5.3</isNumber>
    </p>
    `}, "*");
    });

    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/int7').should('have.text', "true");
    cy.get('#\\/int8').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "false");
    cy.get('#\\/num2').should('have.text', "false");
    cy.get('#\\/num3').should('have.text', "false");
    cy.get('#\\/num4').should('have.text', "false");
    cy.get('#\\/num5').should('have.text', "false");
    cy.get('#\\/num6').should('have.text', "false");
    cy.get('#\\/num7').should('have.text', "true");
    cy.get('#\\/num8').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/int7'].stateValues.value).eq(true);
      expect(components['/int8'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(false);
      expect(components['/num2'].stateValues.value).eq(false);
      expect(components['/num3'].stateValues.value).eq(false);
      expect(components['/num4'].stateValues.value).eq(false);
      expect(components['/num5'].stateValues.value).eq(false);
      expect(components['/num6'].stateValues.value).eq(false);
      expect(components['/num7'].stateValues.value).eq(true);
      expect(components['/num8'].stateValues.value).eq(true);
    });

    cy.log('36');
    cy.get('#\\/n textarea').type("36{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "true");
    cy.get('#\\/int6').should('have.text', "true");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(true);
      expect(components['/int6'].stateValues.value).eq(true);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('37');
    cy.get('#\\/n textarea').type("{end}{backspace}7{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('37.1');
    cy.get('#\\/n textarea').type("{end}.1{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('42/3');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}42/3{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "true");
    cy.get('#\\/int6').should('have.text', "true");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(true);
      expect(components['/int6'].stateValues.value).eq(true);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('-39.6/3.3');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}-39.6/3.3{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "true");
    cy.get('#\\/int6').should('have.text', "true");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(true);
      expect(components['/int6'].stateValues.value).eq(true);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('x');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}x{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "false");
    cy.get('#\\/num2').should('have.text', "false");
    cy.get('#\\/num3').should('have.text', "false");
    cy.get('#\\/num4').should('have.text', "false");
    cy.get('#\\/num5').should('have.text', "false");
    cy.get('#\\/num6').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(false);
      expect(components['/num2'].stateValues.value).eq(false);
      expect(components['/num3'].stateValues.value).eq(false);
      expect(components['/num4'].stateValues.value).eq(false);
      expect(components['/num5'].stateValues.value).eq(false);
      expect(components['/num6'].stateValues.value).eq(false);
    });

    cy.log('sqrt(4)');
    cy.get('#\\/n textarea').type("{end}{backspace}sqrt4{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "true");
    cy.get('#\\/int6').should('have.text', "true");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(true);
      expect(components['/int6'].stateValues.value).eq(true);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('2sin(pi/4)^2');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}2sin(pi/4){rightarrow}{rightarrow}^2{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('1E-300');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}1E-300{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });

    cy.log('-0');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}-0{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "true");
    cy.get('#\\/int2').should('have.text', "true");
    cy.get('#\\/int3').should('have.text', "true");
    cy.get('#\\/int4').should('have.text', "true");
    cy.get('#\\/int5').should('have.text', "true");
    cy.get('#\\/int6').should('have.text', "true");
    cy.get('#\\/num1').should('have.text', "true");
    cy.get('#\\/num2').should('have.text', "true");
    cy.get('#\\/num3').should('have.text', "true");
    cy.get('#\\/num4').should('have.text', "true");
    cy.get('#\\/num5').should('have.text', "true");
    cy.get('#\\/num6').should('have.text', "true");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(true);
      expect(components['/int2'].stateValues.value).eq(true);
      expect(components['/int3'].stateValues.value).eq(true);
      expect(components['/int4'].stateValues.value).eq(true);
      expect(components['/int5'].stateValues.value).eq(true);
      expect(components['/int6'].stateValues.value).eq(true);
      expect(components['/num1'].stateValues.value).eq(true);
      expect(components['/num2'].stateValues.value).eq(true);
      expect(components['/num3'].stateValues.value).eq(true);
      expect(components['/num4'].stateValues.value).eq(true);
      expect(components['/num5'].stateValues.value).eq(true);
      expect(components['/num6'].stateValues.value).eq(true);
    });


    cy.log('0/0');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}0/0{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "false");
    cy.get('#\\/num2').should('have.text', "false");
    cy.get('#\\/num3').should('have.text', "false");
    cy.get('#\\/num4').should('have.text', "false");
    cy.get('#\\/num5').should('have.text', "false");
    cy.get('#\\/num6').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(false);
      expect(components['/num2'].stateValues.value).eq(false);
      expect(components['/num3'].stateValues.value).eq(false);
      expect(components['/num4'].stateValues.value).eq(false);
      expect(components['/num5'].stateValues.value).eq(false);
      expect(components['/num6'].stateValues.value).eq(false);
    });


    cy.log('10/0');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}10/0{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "false");
    cy.get('#\\/num2').should('have.text', "false");
    cy.get('#\\/num3').should('have.text', "false");
    cy.get('#\\/num4').should('have.text', "false");
    cy.get('#\\/num5').should('have.text', "false");
    cy.get('#\\/num6').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(false);
      expect(components['/num2'].stateValues.value).eq(false);
      expect(components['/num3'].stateValues.value).eq(false);
      expect(components['/num4'].stateValues.value).eq(false);
      expect(components['/num5'].stateValues.value).eq(false);
      expect(components['/num6'].stateValues.value).eq(false);
    });


    cy.log('10/-0');
    cy.get('#\\/n textarea').type("{end}{backspace}{backspace}{backspace}{backspace}10/-0{enter}", { force: true });
    cy.get('#\\/int1').should('have.text', "false");
    cy.get('#\\/int2').should('have.text', "false");
    cy.get('#\\/int3').should('have.text', "false");
    cy.get('#\\/int4').should('have.text', "false");
    cy.get('#\\/int5').should('have.text', "false");
    cy.get('#\\/int6').should('have.text', "false");
    cy.get('#\\/num1').should('have.text', "false");
    cy.get('#\\/num2').should('have.text', "false");
    cy.get('#\\/num3').should('have.text', "false");
    cy.get('#\\/num4').should('have.text', "false");
    cy.get('#\\/num5').should('have.text', "false");
    cy.get('#\\/num6').should('have.text', "false");
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/int1'].stateValues.value).eq(false);
      expect(components['/int2'].stateValues.value).eq(false);
      expect(components['/int3'].stateValues.value).eq(false);
      expect(components['/int4'].stateValues.value).eq(false);
      expect(components['/int5'].stateValues.value).eq(false);
      expect(components['/int6'].stateValues.value).eq(false);
      expect(components['/num1'].stateValues.value).eq(false);
      expect(components['/num2'].stateValues.value).eq(false);
      expect(components['/num3'].stateValues.value).eq(false);
      expect(components['/num4'].stateValues.value).eq(false);
      expect(components['/num5'].stateValues.value).eq(false);
      expect(components['/num6'].stateValues.value).eq(false);
    });




  })


});