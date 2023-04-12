import { cesc } from '../../../../src/_utils/url';


describe('Boolean Operator on Math Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')
  })

  it('isinteger, is number', () => {

    cy.window().then(async (win) => {
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

    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/int7')).should('have.text', "true");
    cy.get(cesc('#\\/int8')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "false");
    cy.get(cesc('#\\/num2')).should('have.text', "false");
    cy.get(cesc('#\\/num3')).should('have.text', "false");
    cy.get(cesc('#\\/num4')).should('have.text', "false");
    cy.get(cesc('#\\/num5')).should('have.text', "false");
    cy.get(cesc('#\\/num6')).should('have.text', "false");
    cy.get(cesc('#\\/num7')).should('have.text', "true");
    cy.get(cesc('#\\/num8')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/int7'].stateValues.value).eq(true);
      expect(stateVariables['/int8'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(false);
      expect(stateVariables['/num2'].stateValues.value).eq(false);
      expect(stateVariables['/num3'].stateValues.value).eq(false);
      expect(stateVariables['/num4'].stateValues.value).eq(false);
      expect(stateVariables['/num5'].stateValues.value).eq(false);
      expect(stateVariables['/num6'].stateValues.value).eq(false);
      expect(stateVariables['/num7'].stateValues.value).eq(true);
      expect(stateVariables['/num8'].stateValues.value).eq(true);
    });

    cy.log('36');
    cy.get(cesc('#\\/n') + ' textarea').type("36{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "true");
    cy.get(cesc('#\\/int6')).should('have.text', "true");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(true);
      expect(stateVariables['/int6'].stateValues.value).eq(true);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('37');
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}7{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('37.1');
    cy.get(cesc('#\\/n') + ' textarea').type("{end}.1{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('42/3');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}42/3{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "true");
    cy.get(cesc('#\\/int6')).should('have.text', "true");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(true);
      expect(stateVariables['/int6'].stateValues.value).eq(true);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('-39.6/3.3');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}-39.6/3.3{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "true");
    cy.get(cesc('#\\/int6')).should('have.text', "true");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(true);
      expect(stateVariables['/int6'].stateValues.value).eq(true);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('x');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}x{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "false");
    cy.get(cesc('#\\/num2')).should('have.text', "false");
    cy.get(cesc('#\\/num3')).should('have.text', "false");
    cy.get(cesc('#\\/num4')).should('have.text', "false");
    cy.get(cesc('#\\/num5')).should('have.text', "false");
    cy.get(cesc('#\\/num6')).should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(false);
      expect(stateVariables['/num2'].stateValues.value).eq(false);
      expect(stateVariables['/num3'].stateValues.value).eq(false);
      expect(stateVariables['/num4'].stateValues.value).eq(false);
      expect(stateVariables['/num5'].stateValues.value).eq(false);
      expect(stateVariables['/num6'].stateValues.value).eq(false);
    });

    cy.log('sqrt(4)');
    cy.get(cesc('#\\/n') + ' textarea').type("{end}{backspace}{backspace}sqrt4{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "true");
    cy.get(cesc('#\\/int6')).should('have.text', "true");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(true);
      expect(stateVariables['/int6'].stateValues.value).eq(true);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('2sin(pi/4)^2');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}2sin(pi/4){rightarrow}{rightarrow}^2{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('1E-300');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}1E-300{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });

    cy.log('-0');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}-0{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "true");
    cy.get(cesc('#\\/int2')).should('have.text', "true");
    cy.get(cesc('#\\/int3')).should('have.text', "true");
    cy.get(cesc('#\\/int4')).should('have.text', "true");
    cy.get(cesc('#\\/int5')).should('have.text', "true");
    cy.get(cesc('#\\/int6')).should('have.text', "true");
    cy.get(cesc('#\\/num1')).should('have.text', "true");
    cy.get(cesc('#\\/num2')).should('have.text', "true");
    cy.get(cesc('#\\/num3')).should('have.text', "true");
    cy.get(cesc('#\\/num4')).should('have.text', "true");
    cy.get(cesc('#\\/num5')).should('have.text', "true");
    cy.get(cesc('#\\/num6')).should('have.text', "true");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(true);
      expect(stateVariables['/int2'].stateValues.value).eq(true);
      expect(stateVariables['/int3'].stateValues.value).eq(true);
      expect(stateVariables['/int4'].stateValues.value).eq(true);
      expect(stateVariables['/int5'].stateValues.value).eq(true);
      expect(stateVariables['/int6'].stateValues.value).eq(true);
      expect(stateVariables['/num1'].stateValues.value).eq(true);
      expect(stateVariables['/num2'].stateValues.value).eq(true);
      expect(stateVariables['/num3'].stateValues.value).eq(true);
      expect(stateVariables['/num4'].stateValues.value).eq(true);
      expect(stateVariables['/num5'].stateValues.value).eq(true);
      expect(stateVariables['/num6'].stateValues.value).eq(true);
    });


    cy.log('0/0');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}0/0{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "false");
    cy.get(cesc('#\\/num2')).should('have.text', "false");
    cy.get(cesc('#\\/num3')).should('have.text', "false");
    cy.get(cesc('#\\/num4')).should('have.text', "false");
    cy.get(cesc('#\\/num5')).should('have.text', "false");
    cy.get(cesc('#\\/num6')).should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(false);
      expect(stateVariables['/num2'].stateValues.value).eq(false);
      expect(stateVariables['/num3'].stateValues.value).eq(false);
      expect(stateVariables['/num4'].stateValues.value).eq(false);
      expect(stateVariables['/num5'].stateValues.value).eq(false);
      expect(stateVariables['/num6'].stateValues.value).eq(false);
    });


    cy.log('10/0');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}10/0{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "false");
    cy.get(cesc('#\\/num2')).should('have.text', "false");
    cy.get(cesc('#\\/num3')).should('have.text', "false");
    cy.get(cesc('#\\/num4')).should('have.text', "false");
    cy.get(cesc('#\\/num5')).should('have.text', "false");
    cy.get(cesc('#\\/num6')).should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(false);
      expect(stateVariables['/num2'].stateValues.value).eq(false);
      expect(stateVariables['/num3'].stateValues.value).eq(false);
      expect(stateVariables['/num4'].stateValues.value).eq(false);
      expect(stateVariables['/num5'].stateValues.value).eq(false);
      expect(stateVariables['/num6'].stateValues.value).eq(false);
    });


    cy.log('10/-0');
    cy.get(cesc('#\\/n') + ' textarea').type("{ctrl+home}{shift+end}{backspace}10/-0{enter}", { force: true });
    cy.get(cesc('#\\/int1')).should('have.text', "false");
    cy.get(cesc('#\\/int2')).should('have.text', "false");
    cy.get(cesc('#\\/int3')).should('have.text', "false");
    cy.get(cesc('#\\/int4')).should('have.text', "false");
    cy.get(cesc('#\\/int5')).should('have.text', "false");
    cy.get(cesc('#\\/int6')).should('have.text', "false");
    cy.get(cesc('#\\/num1')).should('have.text', "false");
    cy.get(cesc('#\\/num2')).should('have.text', "false");
    cy.get(cesc('#\\/num3')).should('have.text', "false");
    cy.get(cesc('#\\/num4')).should('have.text', "false");
    cy.get(cesc('#\\/num5')).should('have.text', "false");
    cy.get(cesc('#\\/num6')).should('have.text', "false");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/int1'].stateValues.value).eq(false);
      expect(stateVariables['/int2'].stateValues.value).eq(false);
      expect(stateVariables['/int3'].stateValues.value).eq(false);
      expect(stateVariables['/int4'].stateValues.value).eq(false);
      expect(stateVariables['/int5'].stateValues.value).eq(false);
      expect(stateVariables['/int6'].stateValues.value).eq(false);
      expect(stateVariables['/num1'].stateValues.value).eq(false);
      expect(stateVariables['/num2'].stateValues.value).eq(false);
      expect(stateVariables['/num3'].stateValues.value).eq(false);
      expect(stateVariables['/num4'].stateValues.value).eq(false);
      expect(stateVariables['/num5'].stateValues.value).eq(false);
      expect(stateVariables['/num6'].stateValues.value).eq(false);
    });




  })


});