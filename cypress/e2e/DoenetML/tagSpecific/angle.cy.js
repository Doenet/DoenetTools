import me from 'math-expressions';
import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Angle Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('angle determined by three points, 45-45-90 triangle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy prop="angle" target="_angle1" assignNames="angle2" />
  <p>Angle again: $_angle1</p>
  
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>

  <graph>
    <point x="$_mathinput1" y="$_mathinput2" />
    <point>(2,4)</point>
    <point>(4,2)</point>
    <angle through="$_point1 $_point2 $_point3" chooseReflexAngle="allowed" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 4, 1E-12);
      expect(stateVariables["/_angle1"].stateValues.points).eqls([[2, 2], [2, 4], [4, 2]])
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}4{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should('contain.text', '5.4')

    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(7 * Math.PI / 4, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(7 * Math.PI / 4, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(7 * Math.PI / 4, 1E-12);
      expect(stateVariables["/_angle1"].stateValues.points).eqls([[4, 4], [2, 4], [4, 2]])
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}0{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}2{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should('contain.text', '1.5')

    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 2, 1E-12);
      expect(stateVariables["/_angle1"].stateValues.points).eqls([[0, 2], [2, 4], [4, 2]])
    })


    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}6{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should('contain.text', '4.7')

    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(3 * Math.PI / 2, 1E-12);
      expect(stateVariables["/_angle1"].stateValues.points).eqls([[4, 6], [2, 4], [4, 2]])
    })

  })

  it('angle determined by two lines', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy prop="angle" target="_angle1" assignNames="angle2" />
  <p>Angle again: $_angle1</p>
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>
  <mathinput prefill="-2"/>
  <mathinput prefill="2"/>

  <graph>
  <point x="$_mathinput1" y="$_mathinput2" />
  <point x="$_mathinput1 + cos($_mathinput3)" y="$_mathinput2 + sin($_mathinput3)" />
  <point x="$_mathinput1 + cos($_mathinput4)" y="$_mathinput2 + sin($_mathinput4)" />
  <line through="$_point1 $_point2" />
  <line through="$_point1 $_point3" />

  <angle radius="2" betweenLines="$_line1 $_line2" chooseReflexAngle="allowed" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(4, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-3{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}7{enter}', { force: true });
    cy.get('#\\/_mathinput3 textarea').type('{end}{backspace}{backspace}4{enter}', { force: true });
    cy.get('#\\/_mathinput4 textarea').type('{end}{backspace}6{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should("have.text", "2")
    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(2, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}5{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}-3{enter}', { force: true });
    cy.get('#\\/_mathinput3 textarea').type('{end}{backspace}3{enter}', { force: true });
    cy.get('#\\/_mathinput4 textarea').type('{end}{backspace}3{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should("have.text", "0")
    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(0, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}2{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}{backspace}-1{enter}', { force: true });
    cy.get('#\\/_mathinput3 textarea').type('{end}{backspace}pi/4{enter}', { force: true });
    cy.get('#\\/_mathinput4 textarea').type('{end}{backspace}5pi/4{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should("contain.text", "3.1")
    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI, 1E-12);
    })


  })

  it('parallel and undefined lines', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput prefill="3"/>
  <mathinput prefill="4"/>
  <copy prop="angle" target="_angle1" assignNames="angle2" />
  <p>Angle again: $_angle1</p>

  <graph>
  <line through="(1,2) ($_mathinput1, $_mathinput2)" />
  <line through="(6,2)(8,4)" />

  <angle betweenLines="$_line1 $_line2" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq("＿");
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq("＿");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eq('\uff3f')
    })

    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}0{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should("contain.text", "1.5")
    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 2, 1E-12);
    })


    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}1{enter}', { force: true });
    cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}2{enter}', { force: true });

    cy.get("#\\/angle2 .mjx-mrow").should("contain.text", "＿")
    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq("＿");
    })
    cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq("＿");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eq('\uff3f')
    })

  })

  it('changing radius', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput />
  <graph>
    <point>(5,0)</point>
    <point>(0,0)</point>
    <point x="7cos(1)" y="7sin(1)" />
    <angle radius="$_mathinput1" through="$_point1 $_point2 $_point3" />
  </graph>
  <copy assignNames="angle2" prop="angle" target="_angle1" />
  <copy assignNames="radius2" prop="radius" target="_angle1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/angle2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(1, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(1, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.radius).eq('\uFF3F');
    })

    cy.get('#\\/_mathinput1 textarea').type('1{enter}', { force: true });
    cy.get("#\\/radius2 .mjx-mrow").should("have.text", "1")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radius).eq(1);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}2{enter}', { force: true });
    cy.get("#\\/radius2 .mjx-mrow").should("have.text", "2")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radius).eq(2);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-3{enter}', { force: true });
    cy.get("#\\/radius2 .mjx-mrow").should("have.text", "−3")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radius).simplify().tree).eq(-3);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}x{enter}', { force: true });
    cy.get("#\\/radius2 .mjx-mrow").should("have.text", "x")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radius).eq('x');
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
    cy.get("#\\/radius2 .mjx-mrow").should("have.text", "4")
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radius).eq(4);
    })

  })

  it('systematically vary angle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput />
  <graph>
    <point>(5,0)</point>
    <point>(0,0)</point>
    <point x="8cos($_mathinput1)" y="8sin($_mathinput1)" />
    <angle through="$_point1 $_point2 $_point3" chooseReflexAngle="allowed" />
  </graph>
  <p><copy assignNames="alpha" prop="angle" target="_angle1" /></p>
  <p><copy assignNames="alphadeg" prop="degrees" target="_angle1" /></p>
  <p>Angle again: $_angle1</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load


    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("＿")
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("＿")
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("＿")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eq('\uff3f')
      expect(stateVariables['/_angle1'].stateValues.degrees).eq('\uff3f')
    })

    cy.get('#\\/_mathinput1 textarea').type('pi/4{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "0.7")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(45, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 4, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(45, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}1{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("have.text", "1")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(1, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(180 / Math.PI, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(1, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(1, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(180 / Math.PI, 1E-12)
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}pi/3{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "1.0")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 3, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(60, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 3, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 3, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}2pi/3{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "2.0")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2 * Math.PI / 3, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(120, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2 * Math.PI / 3, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(2 * Math.PI / 3, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(120, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}pi{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "3.1")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(180, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(180, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("have.text", "4")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4 * 180 / Math.PI, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(4, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(4 * 180 / Math.PI, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}3pi/2{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "4.7")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(270, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(3 * Math.PI / 2, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(270, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}11pi/6{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "5.7")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(11 * Math.PI / 6, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(330, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(11 * Math.PI / 6, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(11 * Math.PI / 6, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(330, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{ctrl+home}{shift+end}{backspace}{backspace}2pi{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "6.2")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2 * Math.PI, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(360, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2 * Math.PI, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(2 * Math.PI, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(360, 1E-12);
    })

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}2pi+0.00001{enter}', { force: true });
    cy.get("#\\/alpha .mjx-mrow").should("contain.text", "0.000")
    cy.get("#\\/alpha").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0.00001, 1E-6)
    })
    cy.get("#\\/alphadeg").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0.0018 / Math.PI, 1E-6)
    })
    cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0.00001, 1E-6)
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(0.00001, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(0.0018 / Math.PI, 1E-12);
    })


  })

  it('angle from number sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    $_angle1
  </graph>
  <angle>pi/2</angle>
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π2")
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 2]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(0, 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).eq(1);
    })

  })

  it('angle from radians number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    $_angle1
  </graph>
  <angle radians="pi/2" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π2")
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 2]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(0, 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).eq(1);
    })

  })

  it('angle from degrees number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    $_angle1
  </graph>
  <angle degrees="90" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  <angle degrees="75" />

  `}, "*");
    });

    // TODO: once can simply ratios, check that 2*_angle2 is simplified correctly

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π2")
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(["/", "pi", 2]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(0, 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).eq(1);
      expect(stateVariables['/_angle2'].stateValues.radians).eqls(["/", ["*", 5, "pi"], 12]);
      expect(stateVariables['/_angle2'].stateValues.degrees).closeTo(75, 1E-12);
    })

  })

  it('angle from variable sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle>alpha</angle>
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("α")
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360απ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eq('alpha');
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls(["/", ["*", 180, "alpha"], "pi"]);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f']);
    })

  })

  it('angle from variable radians', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle radians="alpha" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("α")
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360απ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eq('alpha');
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls(["/", ["*", 180, "alpha"], "pi"]);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f']);
    })

  })

  it('angle from variable degrees', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle degrees="alpha" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("απ180")
    })
    // TODO: add once can simplify fractions
    // cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq("απ90")
    // })
    // cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq("απ90")
    // })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(["/", ["*", "alpha", "pi"], 180]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq("alpha");
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f']);
    })

  })

  it('angle from sugar with macro and string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    $_angle1
  </graph>
  <angle>$pi/2</angle>
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <math name="pi">pi</math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π2")
    })

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(["/", "pi", 2]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
    })

  })

  it('choose reflex angle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>choose reflex angle: <textinput name="ra"  /></p>
  <copy prop="chooseReflexAngle" target="alpha" assignNames="ra2" />
  <graph>
    <point name="A">(-6,5)</point>
    <point name="B">(0,0)</point>
    <point name="C">(4,2)</point>
    <angle name="alpha" through="$A $B $C" chooseReflexAngle="$ra" />
  </graph>
  <p>angle: <copy target="alpha" assignNames="alpha2" /></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    function angleFromPs(ps, reflex) {
      let angle = Math.atan2(ps[2][1] - ps[1][1], ps[2][0] - ps[1][0]) -
        Math.atan2(ps[0][1] - ps[1][1], ps[0][0] - ps[1][0]);
      if (angle < 0) {
        angle += 2 * Math.PI;
      }
      if (angle > Math.PI) {
        if (reflex === -1) {
          angle = 2 * Math.PI - angle;
        }
      } else if (reflex === 1) {
        angle = 2 * Math.PI - angle;
      }
      return angle;
    }

    // not sure how to test this
    // but at least make sure we don't throw any errors.

    let points = [[-6, 5], [0, 0], [4, 2]];

    // should now be > pi if no modifications

    cy.get('#\\/ra2').should('have.text', 'never');
    cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points, -1) * 1000))
    })

    cy.get('#\\/ra_input').clear().type('allowed{enter}');
    cy.get('#\\/ra2').should('have.text', 'allowed');

    cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points) * 1000))
    })


    cy.get('#\\/ra_input').clear().type('always{enter}');
    cy.get('#\\/ra2').should('have.text', 'always');

    cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
      expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points) * 1000))
    })


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: -3 }
      })

      points[0] = [1, -3];
      // should now be < pi if no modifications


      cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
        expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points, 1) * 1000))
      })

      cy.get('#\\/ra_input').clear().type('never{enter}');
      cy.get('#\\/ra2').should('have.text', 'never');
      cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
        expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points) * 1000))
      })

      cy.get('#\\/ra_input').clear().type('allowed{enter}');
      cy.get('#\\/ra2').should('have.text', 'allowed');
      cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
        expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points) * 1000))
      })


    })

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/C",
        args: { x: -1, y: -5 }
      })

      points[2] = [-1, -5]
      // should now be > pi if no modifications

      cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
        expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points) * 1000))
      })

      cy.get('#\\/ra_input').clear().type('never{enter}');
      cy.get('#\\/ra2').should('have.text', 'never');
      cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
        expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points, -1) * 1000))
      })

      cy.get('#\\/ra_input').clear().type('always{enter}');
      cy.get('#\\/ra2').should('have.text', 'always');
      cy.get('#\\/alpha2 .mjx-mrow').eq(0).invoke("text").then(text => {
        expect(Math.trunc(Number(text) * 1000)).eq(Math.trunc(angleFromPs(points) * 1000))
      })

    });



  })

  it('empty angle', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    $_angle1
  </graph>
  <angle/>
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(Math.PI / 2);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0]);
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(0, 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).eq(1);
    })

  })

  it('angle through 1 point', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="A">(3,5)</point>
    $_angle1
  </graph>
  <angle through="$A" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="A" assignNames="A2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(Math.PI / 2);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([3, 5]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(5, 3) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('move point')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: 7 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,7)')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 2, 1E-14);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(7, 1) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })

  })

  it('angle through 1 point, specify radians', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Desired radians: <mathinput name="desiredRadians" prefill="pi/3" /></p>
  <graph>
    <point name="A">(3,5)</point>
    $_angle1
  </graph>
  <angle through="$A" radians="$desiredRadians" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="A" assignNames="A2" />
  <copy target="desiredRadians" prop="value" assignNames="desiredRadians2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π3')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("120")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 3]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([3, 5]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(5, 3) + Math.PI / 3;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('move point')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: 7 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,7)')


    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π3')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("120")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 3]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(7, 1) + Math.PI / 3;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('change desired radians')
    cy.get('#\\/desiredRadians textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}2pi/5{enter}", { force: true })

    cy.get('#\\/desiredRadians2 .mjx-mrow').should('contain.text', '2π5')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π5')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('4π5')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('4π5')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("144")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', ['*', 2, 'pi'], 5]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(72, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(7, 1) + 2 * Math.PI / 5;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('change desired radians to variable')
    cy.get('#\\/desiredRadians textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}theta{enter}", { force: true })

    cy.get('#\\/desiredRadians2 .mjx-mrow').should('contain.text', 'θ')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('θ')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2θ')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2θ')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360θπ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls('theta');
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls(['/', ['*', 180, 'theta'], 'pi']);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f'])
    })


  })

  it('angle through 1 point, specify degrees', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Desired degrees: <mathinput name="desiredDegrees" prefill="90" /></p>
  <graph>
    <point name="A">(3,5)</point>
    $_angle1
  </graph>
  <angle through="$A" degrees="$desiredDegrees" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="A" assignNames="A2" />
  <copy target="desiredDegrees" prop="value" assignNames="desiredDegrees2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    // TODO: add when can simplify ratios
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('π2')
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radians).equals(me.fromAst(['/', 'pi', 2]))).eq(true);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([3, 5]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(5, 3) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('move point')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: 7 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,7)')

    // TODO: add when can simplify ratios
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('π2')
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radians).equals(me.fromAst(['/', 'pi', 2]))).eq(true);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(7, 1) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('change desired degrees')
    cy.get('#\\/desiredDegrees textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}180{enter}", { force: true })

    cy.get('#\\/desiredDegrees2 .mjx-mrow').should('contain.text', '180')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls('pi');
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(180, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      let theta = Math.atan2(7, 1) + Math.PI;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(Math.sin(theta), 1E-14);
    })


    cy.log('change desired degrees to variable')
    cy.get('#\\/desiredDegrees textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}theta{enter}", { force: true })

    cy.get('#\\/desiredDegrees2 .mjx-mrow').should('contain.text', 'θ')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('πθ180')
    })
    // TODO: uncomment when can simplify fractions
    // cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('πθ90')
    // })
    // cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('πθ90')
    // })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2θ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', ['*', 'pi', 'theta'], 180]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls('theta');
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([0, 0])
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f'])
    })

  })

  it('angle through 2 points', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <point name="A">(3,5)</point>
    <point name="B">(6,1)</point>
    $_angle1
  </graph>
  <angle through="$A $B" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="A" assignNames="A2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(Math.PI / 2);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([3, 5]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6, 1])
      let theta = Math.atan2(5 - 1, 3 - 6) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(1 + Math.sin(theta), 1E-14);
    })


    cy.log('move points')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -3, y: -2 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: 7 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,7)')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 2, 1E-14);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      let theta = Math.atan2(7 - -2, 1 - -3) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-3 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(-2 + Math.sin(theta), 1E-14);
    })

  })

  it('angle through 2 points, specify radians', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Desired radians: <mathinput name="desiredRadians" prefill="pi/3" /></p>
  <graph>
    <point name="A">(3,5)</point>
    <point name="B">(6,1)</point>
    $_angle1
  </graph>
  <angle through="$A $B" radians="$desiredRadians" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="A" assignNames="A2" />
  <copy target="desiredRadians" prop="value" assignNames="desiredRadians2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π3')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("120")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 3]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([3, 5]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6, 1])
      let theta = Math.atan2(5 - 1, 3 - 6) + Math.PI / 3;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(1 + Math.sin(theta), 1E-14);
    })


    cy.log('move points')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -3, y: -2 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: 7 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,7)')


    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π3')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("120")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 3]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      let theta = Math.atan2(7 - -2, 1 - -3) + Math.PI / 3;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-3 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(-2 + Math.sin(theta), 1E-14);
    })


    cy.log('change desired radians')
    cy.get('#\\/desiredRadians textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}2pi/5{enter}", { force: true })

    cy.get('#\\/desiredRadians2 .mjx-mrow').should('contain.text', '2π5')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π5')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('4π5')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('4π5')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("144")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', ['*', 2, 'pi'], 5]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(72, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      let theta = Math.atan2(7 - -2, 1 - -3) + 2 * Math.PI / 5;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-3 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(-2 + Math.sin(theta), 1E-14);
    })


    cy.log('change desired radians to variable')
    cy.get('#\\/desiredRadians textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}theta{enter}", { force: true })

    cy.get('#\\/desiredRadians2 .mjx-mrow').should('contain.text', 'θ')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('θ')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2θ')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2θ')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360θπ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls('theta');
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls(['/', ['*', 180, 'theta'], 'pi']);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f'])
    })


  })

  it('angle through 2 points, specify degrees', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Desired degrees: <mathinput name="desiredDegrees" prefill="90" /></p>
  <graph>
    <point name="A">(3,5)</point>
    <point name="B">(6,1)</point>
    $_angle1
  </graph>
  <angle through="$A $B" degrees="$desiredDegrees" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="A" assignNames="A2" />
  <copy target="desiredDegrees" prop="value" assignNames="desiredDegrees2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    // TODO: add when can simplify ratios
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('π2')
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radians).equals(me.fromAst(['/', 'pi', 2]))).eq(true);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([3, 5]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6, 1])
      let theta = Math.atan2(5 - 1, 3 - 6) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(1 + Math.sin(theta), 1E-14);
    })


    cy.log('move points')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/B",
        args: { x: -3, y: -2 }
      })
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/A",
        args: { x: 1, y: 7 }
      })
    })

    cy.get('#\\/A2 .mjx-mrow').should('contain.text', '(1,7)')

    // TODO: add when can simplify ratios
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('π2')
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radians).equals(me.fromAst(['/', 'pi', 2]))).eq(true);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      let theta = Math.atan2(7 - -2, 1 - -3) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-3 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(-2 + Math.sin(theta), 1E-14);
    })

    cy.log('change desired degrees')
    cy.get('#\\/desiredDegrees textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}180{enter}", { force: true })

    cy.get('#\\/desiredDegrees2 .mjx-mrow').should('contain.text', '180')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls('pi');
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(180, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      let theta = Math.atan2(7 - -2, 1 - -3) + Math.PI;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-3 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(-2 + Math.sin(theta), 1E-14);
    })



    cy.log('change desired degrees to variable')
    cy.get('#\\/desiredDegrees textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}theta{enter}", { force: true })

    cy.get('#\\/desiredDegrees2 .mjx-mrow').should('contain.text', 'θ')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('πθ180')
    })
    // TODO: uncomment when can simplify fractions
    // cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('πθ90')
    // })
    // cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('πθ90')
    // })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2θ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', ['*', 'pi', 'theta'], 180]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls('theta');
      expect(stateVariables['/_angle1'].stateValues.points[0]).eqls([1, 7]);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-3, -2])
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f'])
    })


  })

  it('angle with one line', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Equation of line: <mathinput name="equation" prefill="y=2x+1" /></p>
  <graph>
    <line name="l">$equation</line>
    $_angle1
  </graph>
  <angle betweenLines="$l" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="equation" prop="value" assignNames="equation2" />
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(Math.PI / 2);
      expect(stateVariables['/_angle1'].stateValues.degrees).eq(90);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(-2 / 5 + 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(1 / 5 + 2 / Math.sqrt(5), 1E-14);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-2 / 5, 1 / 5])
      let theta = Math.atan2(2 / Math.sqrt(5), 1 / Math.sqrt(5)) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-2 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(1 / 5 + Math.sin(theta), 1E-14);
    })


    cy.log('change line')
    cy.get('#\\/equation textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}y=-1/2{rightarrow}x+3{enter}", { force: true })

    cy.get('#\\/equation2 .mjx-mrow').should('contain.text', 'y=−(12)x+3')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI / 2 * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq((Math.round(Math.PI * 10 ** 9) / 10 ** 9).toString())
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).closeTo(Math.PI / 2, 1E-14);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      let theta = Math.atan2(-1 / Math.sqrt(5), 2 / Math.sqrt(5)) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(12 / 5 + Math.sin(theta), 1E-14);
    })

  })

  it('angle with one line, specify radians', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Equation of line: <mathinput name="equation" prefill="y=2x+1" /></p>
  <p>Desired radians: <mathinput name="desiredRadians" prefill="pi/3" /></p>
  <graph>
    <line name="l">$equation</line>
    $_angle1
  </graph>
  <angle betweenLines="$l" radians="$desiredRadians" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="equation" prop="value" assignNames="equation2" />
  <copy target="desiredRadians" prop="value" assignNames="desiredRadians2" />
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π3')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("120")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 3]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(-2 / 5 + 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(1 / 5 + 2 / Math.sqrt(5), 1E-14);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-2 / 5, 1 / 5])
      let theta = Math.atan2(2 / Math.sqrt(5), 1 / Math.sqrt(5)) + Math.PI / 3;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-2 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(1 / 5 + Math.sin(theta), 1E-14);
    })


    cy.log('change line')
    cy.get('#\\/equation textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}y=-1/2{rightarrow}x+3{enter}", { force: true })

    cy.get('#\\/equation2 .mjx-mrow').should('contain.text', 'y=−(12)x+3')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π3')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π3')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("120")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', 'pi', 3]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      let theta = Math.atan2(-1 / Math.sqrt(5), 2 / Math.sqrt(5)) + Math.PI / 3;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(12 / 5 + Math.sin(theta), 1E-14);
    })


    cy.log('change desired radians')
    cy.get('#\\/desiredRadians textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}2pi/5{enter}", { force: true })

    cy.get('#\\/desiredRadians2 .mjx-mrow').should('contain.text', '2π5')


    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π5')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('4π5')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('4π5')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("144")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', ['*', 2, 'pi'], 5]);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(72, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      let theta = Math.atan2(-1 / Math.sqrt(5), 2 / Math.sqrt(5)) + 2 * Math.PI / 5;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(12 / 5 + Math.sin(theta), 1E-14);
    })



    cy.log('change desired radians to variable')
    cy.get('#\\/desiredRadians textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}theta{enter}", { force: true })

    cy.get('#\\/desiredRadians2 .mjx-mrow').should('contain.text', 'θ')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('θ')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2θ')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2θ')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360θπ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls('theta');
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls(['/', ['*', 180, 'theta'], 'pi']);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f'])
    })


  })

  it('angle with one line, specify degrees', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Equation of line: <mathinput name="equation" prefill="y=2x+1" /></p>
  <p>Desired degrees: <mathinput name="desiredDegrees" prefill="90" /></p>
  <graph>
    <line name="l">$equation</line>
    $_angle1
  </graph>
  <angle betweenLines="$l" degrees="$desiredDegrees" />
  <math simplify>2<copy target="_angle1" /></math>
  <math simplify>2<copy prop="angle" target="_angle1" /></math>
  <math simplify>2<copy prop="degrees" target="_angle1" /></math>
  <copy target="equation" prop="value" assignNames="equation2" />
  <copy target="desiredDegrees" prop="value" assignNames="desiredDegrees2" />
  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    // TODO: add when can simplify ratios
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('π2')
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radians).equals(me.fromAst(['/', 'pi', 2]))).eq(true);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(-2 / 5 + 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(1 / 5 + 2 / Math.sqrt(5), 1E-14);
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([-2 / 5, 1 / 5])
      let theta = Math.atan2(2 / Math.sqrt(5), 1 / Math.sqrt(5)) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(-2 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(1 / 5 + Math.sin(theta), 1E-14);
    })


    cy.log('change line')
    cy.get('#\\/equation textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}y=-1/2{rightarrow}x+3{enter}", { force: true })

    cy.get('#\\/equation2 .mjx-mrow').should('contain.text', 'y=−(12)x+3')

    // TODO: add when can simplify ratios
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('π2')
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(me.fromAst(stateVariables['/_angle1'].stateValues.radians).equals(me.fromAst(['/', 'pi', 2]))).eq(true);
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(90, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      let theta = Math.atan2(-1 / Math.sqrt(5), 2 / Math.sqrt(5)) + Math.PI / 2;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(12 / 5 + Math.sin(theta), 1E-14);
    })


    cy.log('change desired degrees')
    cy.get('#\\/desiredDegrees textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}180{enter}", { force: true })

    cy.get('#\\/desiredDegrees2 .mjx-mrow').should('contain.text', '180')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('π')
    })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π')
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('2π')
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("360")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls('pi');
      expect(stateVariables['/_angle1'].stateValues.degrees).closeTo(180, 1E-12);
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      let theta = Math.atan2(-1 / Math.sqrt(5), 2 / Math.sqrt(5)) + Math.PI;
      expect(stateVariables['/_angle1'].stateValues.points[2][0]).closeTo(6 / 5 + Math.cos(theta), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[2][1]).closeTo(12 / 5 + Math.sin(theta), 1E-14);
    })



    cy.log('change desired degrees to variable')
    cy.get('#\\/desiredDegrees textarea').type("{ctrl+home}{shift+ctrl+end}{backspace}theta{enter}", { force: true })

    cy.get('#\\/desiredDegrees2 .mjx-mrow').should('contain.text', 'θ')

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq('πθ180')
    })
    // TODO: uncomment when can simplify fractions
    // cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('πθ90')
    // })
    // cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq('πθ90')
    // })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2θ")
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_angle1'].stateValues.radians).eqls(['/', ['*', 'pi', 'theta'], 180]);
      expect(stateVariables['/_angle1'].stateValues.degrees).eqls('theta');
      expect(stateVariables['/_angle1'].stateValues.points[0][0]).closeTo(6 / 5 + 2 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[0][1]).closeTo(12 / 5 - 1 / Math.sqrt(5), 1E-14)
      expect(stateVariables['/_angle1'].stateValues.points[1]).eqls([6 / 5, 12 / 5])
      expect(stateVariables['/_angle1'].stateValues.points[2]).eqls(['\uff3f', '\uff3f'])
    })


  })

  it('angle with label and number sugar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <graph>
    <angle name="a">
      <label><m>\\alpha^2</m></label>
    </angle>
    <angle name="b" through="(5,7)">
      <label>This is <math>m/2</math></label>
    </angle>
  </graph>

  `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/a'].stateValues.label).eq("\\(\\alpha^2\\)")
      expect(stateVariables['/b'].stateValues.label).eq("This is \\(\\frac{m}{2}\\)")
    })



  })

  it('display digits and decimals, overwrite in copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle name="a">1.39372582305929123842034823</angle>
  <angle name="aDig5a" displayDigits="5" copySource="a" />
  <angle name="aDec6a" displayDecimals="6" copySource="a" />
  <angle name="aDig5b" displayDigits="5" copySource="aDec6a" />
  <angle name="aDec6b" displayDecimals="6" copySource="aDig5a" />
  <angle name="aDig5c" displayDigits="5" copySource="aDec6b" />
  <angle name="aDec6c" displayDecimals="6" copySource="aDig5b" />

  <angle name="aDig5d" displayDigits="5">1.39372582305929123842034823</angle>
  <angle name="aDec6d" displayDecimals="6">1.39372582305929123842034823</angle>
  <angle name="aDig5e" displayDigits="5" copySource="aDec6d" />
  <angle name="aDec6e" displayDecimals="6" copySource="aDig5d" />
  <angle name="aDig5f" displayDigits="5" copySource="aDec6e" />
  <angle name="aDec6f" displayDecimals="6" copySource="aDig5e" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393725823")
    })
    cy.get('#\\/aDig5a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.3937")
    })
    cy.get('#\\/aDec6a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393726")
    })
    cy.get('#\\/aDig5b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.3937")
    })
    cy.get('#\\/aDec6b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393726")
    })
    cy.get('#\\/aDig5c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.3937")
    })
    cy.get('#\\/aDec6c').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393726")
    })
    cy.get('#\\/aDig5d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.3937")
    })
    cy.get('#\\/aDec6d').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393726")
    })
    cy.get('#\\/aDig5e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.3937")
    })
    cy.get('#\\/aDec6e').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393726")
    })
    cy.get('#\\/aDig5f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.3937")
    })
    cy.get('#\\/aDec6f').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("1.393726")
    })


  })

});
