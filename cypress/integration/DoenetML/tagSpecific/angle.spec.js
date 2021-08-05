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
    cy.visit('/cypressTest')
  })

  it('angle determined by three points, 45-45-90 triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy prop="angle" tname="_angle1" />
  <p>Angle again: $_angle1</p>
  
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>

  <graph>
  <point x="$_mathinput1" y="$_mathinput2" />
  <point>(2,4)</point>
  <point>(4,2)</point>
  <angle through="$_point1 $_point2 $_point3" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let angleAnchor = cesc('#' + components["/_copy1"].replacements[0].componentName);

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI / 4, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}4{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(7 * Math.PI / 4, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(7 * Math.PI / 4, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(7 * Math.PI / 4, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}0{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}2{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
      })


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI / 2, 1E-12);
      })


      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}6{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(3 * Math.PI / 2, 1E-12);
      })

    })
  })

  it('angle determined by two lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy prop="angle" tname="_angle1" />
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

  <angle radius="2" betweenLines="$_line1 $_line2" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let angleAnchor = cesc('#' + components["/_copy1"].replacements[0].componentName);

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(4, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(4, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(4, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-3{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}7{enter}', { force: true });
      cy.get('#\\/_mathinput3 textarea').type('{end}{backspace}{backspace}4{enter}', { force: true });
      cy.get('#\\/_mathinput4 textarea').type('{end}{backspace}6{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(2, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}5{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}-3{enter}', { force: true });
      cy.get('#\\/_mathinput3 textarea').type('{end}{backspace}3{enter}', { force: true });
      cy.get('#\\/_mathinput4 textarea').type('{end}{backspace}3{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(0, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}2{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}{backspace}-1{enter}', { force: true });
      cy.get('#\\/_mathinput3 textarea').type('{end}{backspace}pi/4{enter}', { force: true });
      cy.get('#\\/_mathinput4 textarea').type('{end}{backspace}5pi/4{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI, 1E-12);
      })
    })

  })

  it('parallel and undefined lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput prefill="3"/>
  <mathinput prefill="4"/>
  <copy prop="angle" tname="_angle1" />
  <p>Angle again: $_angle1</p>

  <graph>
  <line through="(1,2) ($_mathinput1, $_mathinput2)" />
  <line through="(6,2)(8,4)" />

  <angle betweenLines="$_line1 $_line2" />
  </graph>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let angleAnchor = cesc('#' + components["/_copy1"].replacements[0].componentName);

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq("＿");
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq("＿");
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).eq('\uff3f')
      })

      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}0{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI / 2, 1E-12);
      })


      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}1{enter}', { force: true });
      cy.get('#\\/_mathinput2 textarea').type('{end}{backspace}2{enter}', { force: true });

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq("＿");
      })
      cy.get("#\\/_p1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq("＿");
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).eq('\uff3f')
      })
    })

  })

  it('changing radius', () => {
    cy.window().then((win) => {
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
  <copy name="alpha" prop="angle" tname="_angle1" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let angleAnchor = cesc('#' + components["/alpha"].replacements[0].componentName);

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(1, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(1, 1E-12);
        expect(components['/_angle1'].stateValues.radius.tree).eq('\uFF3F');
      })

      cy.get('#\\/_mathinput1 textarea').type('1{enter}', { force: true });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq(1);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}2{enter}', { force: true });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq(2);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-3{enter}', { force: true });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.simplify().tree).eq(-3);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}x{enter}', { force: true });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq('x');
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq(4);
      })

    })
  })

  it('systematically vary angle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput />
  <graph>
    <point>(5,0)</point>
    <point>(0,0)</point>
    <point x="8cos($_mathinput1)" y="8sin($_mathinput1)" />
    <angle through="$_point1 $_point2 $_point3" />
  </graph>
  <p><copy name="alpha" prop="angle" tname="_angle1" /></p>
  <p><copy name="alphadeg" prop="degrees" tname="_angle1" /></p>
  <p>Angle again: $_angle1</p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let angleAnchor = cesc('#' + components["/alpha"].replacements[0].componentName);
      let angleDegAnchor = cesc('#' + components["/alphadeg"].replacements[0].componentName);

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text).eq("＿")
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text).eq("＿")
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text).eq("＿")
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).eq('\uff3f')
        expect(components['/_angle1'].stateValues.degrees.tree).eq('\uff3f')
      })

      cy.get('#\\/_mathinput1 textarea').type('pi/4{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(45, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI / 4, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(45, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}1{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(1, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq('180π')
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(1, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(1, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).eqls(["/", 180, "pi"]);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}pi/3{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 3, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(60, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 3, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI / 3, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(60, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}2pi/3{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2 * Math.PI / 3, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(120, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2 * Math.PI / 3, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(2 * Math.PI / 3, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(120, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}pi{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(180, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(Math.PI, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(180, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}4{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(4, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq('720π')
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(4, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(4, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.evaluate_to_constant()).closeTo(4 * 180 / Math.PI, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}3pi/2{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(270, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(3 * Math.PI / 2, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(270, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}11pi/6{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(11 * Math.PI / 6, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(330, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(11 * Math.PI / 6, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(11 * Math.PI / 6, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(330, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}2pi{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2 * Math.PI, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(360, 1E-6)
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2 * Math.PI, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(2 * Math.PI, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.tree).closeTo(360, 1E-12);
      })

      cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}2pi+0.00001{enter}', { force: true });
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0.00001, 1E-6)
      })
      cy.get(angleDegAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq('0.0018π')
      })
      cy.get("#\\/_p3").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0.00001, 1E-6)
      })
      
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radians.tree).closeTo(0.00001, 1E-12);
        expect(components['/_angle1'].stateValues.degrees.evaluate_to_constant()).closeTo(0.0018 / Math.PI, 1E-12);
      })
    })

  })

  it('angle from number sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle>pi/2</angle>
  <math simplify>2<copy tname="_angle1" /></math>
  <math simplify>2<copy prop="angle" tname="_angle1" /></math>
  <math simplify>2<copy prop="degrees" tname="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π/2")
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.radians.tree).eqls(['/', 'pi', 2]);
      expect(components['/_angle1'].stateValues.degrees.tree).eq(90);
    })

  })

  it('angle from radians number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle radians="pi/2" />
  <math simplify>2<copy tname="_angle1" /></math>
  <math simplify>2<copy prop="angle" tname="_angle1" /></math>
  <math simplify>2<copy prop="degrees" tname="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π/2")
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.radians.tree).eqls(['/', 'pi', 2]);
      expect(components['/_angle1'].stateValues.degrees.tree).eq(90);
    })

  })

  it('angle from degrees number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle degrees="90" />
  <math simplify>2<copy tname="_angle1" /></math>
  <math simplify>2<copy prop="angle" tname="_angle1" /></math>
  <math simplify>2<copy prop="degrees" tname="_angle1" /></math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    // TODO: add this when can simplify ratioss
    // cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text).eq("π/2")
    // })
    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("180")
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.radians.evaluate_to_constant()).closeTo(Math.PI/2, 1E-12);
      expect(components['/_angle1'].stateValues.degrees.tree).eq(90);
    })

  })

  it('angle from variable sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle>alpha</angle>
  <math simplify>2<copy tname="_angle1" /></math>
  <math simplify>2<copy prop="angle" tname="_angle1" /></math>
  <math simplify>2<copy prop="degrees" tname="_angle1" /></math>

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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.radians.tree).eq('alpha');
      expect(components['/_angle1'].stateValues.degrees.tree).eqls(["/", ["*", 180, "alpha"], "pi"]);
    })

  })

  it('angle from variable radians', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle radians="alpha" />
  <math simplify>2<copy tname="_angle1" /></math>
  <math simplify>2<copy prop="angle" tname="_angle1" /></math>
  <math simplify>2<copy prop="degrees" tname="_angle1" /></math>

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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.radians.tree).eq('alpha');
      expect(components['/_angle1'].stateValues.degrees.tree).eqls(["/", ["*", 180, "alpha"], "pi"]);
    })

  })

  it('angle from sugar with macro and string', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <angle>$pi/2</angle>
  <math simplify>2<copy tname="_angle1" /></math>
  <math simplify>2<copy prop="angle" tname="_angle1" /></math>
  <math simplify>2<copy prop="degrees" tname="_angle1" /></math>
  <math name="pi">pi</math>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_angle1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("π/2")
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.radians.tree).eqls(["/", "pi", 2]);
      expect(components['/_angle1'].stateValues.degrees.tree).eq(90);
    })

  })

});
