describe('Angle Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('angle determined by three points, 45-45-90 triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <ref prop="angle">_angle1</ref>
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>

  <graph>
  <point>(<ref prop="value">_mathinput1</ref>,
    <ref prop="value">_mathinput2</ref>)</point>
  <point>(2,4)</point>
  <point>(4,2)</point>
    <angle>
      <ref>_point1</ref>
      <ref>_point2</ref>
      <ref>_point3</ref>
    </angle>
  </graph>
  `}, "*");
    });

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI / 4, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('4{enter}');

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(7 * Math.PI / 4, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(7 * Math.PI / 4, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('0{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('2{enter}');

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI / 2, 1E-12);
    })


    cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('6{enter}');

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(3 * Math.PI / 2, 1E-12);
    })

  })

  it('angle determined by two lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <ref prop="angle">_angle1</ref>
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>
  <mathinput prefill="-2"/>
  <mathinput prefill="2"/>

  <graph>
  <point>(<ref prop="value">_mathinput1</ref>,
    <ref prop="value">_mathinput2</ref>)</point>
  <point>(<ref prop="value">_mathinput1</ref> + cos(<ref prop="value">_mathinput3</ref>),
    <ref prop="value">_mathinput2</ref> + sin(<ref prop="value">_mathinput3</ref>))</point>
  <point>(<ref prop="value">_mathinput1</ref> + cos(<ref prop="value">_mathinput4</ref>),
    <ref prop="value">_mathinput2</ref> + sin(<ref prop="value">_mathinput4</ref>))</point>
  <line>
    <ref>_point1</ref>
    <ref>_point2</ref>
  </line>
  <line>
    <ref>_point1</ref>
    <ref>_point3</ref>
  </line>

  <angle radius="2">
    <ref>_line1</ref>
    <ref>_line2</ref>
  </angle>
  </graph>
  `}, "*");
    });

    cy.get('#__math11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(4, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('-3{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('7{enter}');
    cy.get('#\\/_mathinput3_input').clear().type('4{enter}');
    cy.get('#\\/_mathinput4_input').clear().type('6{enter}');

    cy.get('#__math11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(2, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('5{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('-3{enter}');
    cy.get('#\\/_mathinput3_input').clear().type('3{enter}');
    cy.get('#\\/_mathinput4_input').clear().type('3{enter}');

    cy.get('#__math11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(0, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('2{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('-1{enter}');
    cy.get('#\\/_mathinput3_input').clear().type('pi/4{enter}');
    cy.get('#\\/_mathinput4_input').clear().type('5pi/4{enter}');

    cy.get('#__math11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI, 1E-12);
    })


  })

  it('parallel and undefined lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <mathinput prefill="3"/>
  <mathinput prefill="4"/>
  <ref prop="angle">_angle1</ref>

  <graph>
  <line>(1,2),(<ref prop="value">_mathinput1</ref>,
    <ref prop="value">_mathinput2</ref>)</line>
  <line>(6,2),(8,4)</line>

  <angle>
    <ref>_line1</ref>
    <ref>_line2</ref>
  </angle>
  </graph>
  `}, "*");
    });

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq("NaN");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      assert.isNaN(components['/_angle1'].state.angle);
    })

    cy.get('#\\/_mathinput2_input').clear().type('0{enter}');

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI / 2, 1E-12);
    })


    cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
    cy.get('#\\/_mathinput2_input').clear().type('2{enter}');

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).eq("NaN");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      assert.isNaN(components['/_angle1'].state.angle);
    })


  })

  it('changing radius', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <mathinput />
  <graph>
    <point>(5,0)</point>
    <point>(0,0)</point>
    <point>(<math>7cos(1)</math>,<math>7sin(1)</math>)</point>
    <angle><radius><ref prop="value">_mathinput1</ref></radius>
      <ref>_point1</ref><ref>_point2</ref><ref>_point3</ref>
    </angle>
  </graph>
  <ref prop="angle">_angle1</ref>
  `}, "*");
    });

    cy.get('#__math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(1, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(1, 1E-12);
      expect(components['/_angle1'].state.radius.tree).eq('\uFF3F');
      expect(components['/_angle1'].renderer.radius).eq(null);
    })

    cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.radius.tree).eq(1);
      expect(components['/_angle1'].renderer.radius).eq(1);
    })

    cy.get('#\\/_mathinput1_input').clear().type('2{enter}');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.radius.tree).eq(2);
      expect(components['/_angle1'].renderer.radius).eq(2);
    })

    cy.get('#\\/_mathinput1_input').clear().type('-3{enter}');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.radius.tree).eq(-3);
      expect(components['/_angle1'].renderer.radius).eq(-3);
    })

    cy.get('#\\/_mathinput1_input').clear().type('x{enter}');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.radius.tree).eq('x');
      expect(components['/_angle1'].renderer.radius).eq(null);
    })

    cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.radius.tree).eq(4);
      expect(components['/_angle1'].renderer.radius).eq(4);
    })

  })

  it('systematically vary angle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <mathinput />
  <graph>
    <point>(5,0)</point>
    <point>(0,0)</point>
    <point>
      (<math>8cos(<ref prop="value">_mathinput1</ref>)</math>,
      <math>8sin(<ref prop="value">_mathinput1</ref>)</math>)
    </point>
    <angle>
      <ref>_point1</ref><ref>_point2</ref><ref>_point3</ref>
    </angle>
  </graph>
  <p><ref prop="angle">_angle1</ref></p>
  <p><ref prop="degrees">_angle1</ref></p>
  `}, "*");
    });

    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("NaN")
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("NaN")
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      assert.isNaN(components['/_angle1'].state.angle);
      assert.isNaN(components['/_angle1'].state.degrees);
    })

    cy.get('#\\/_mathinput1_input').clear().type('pi/4{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(45, 1E-6)
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI / 4, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(45, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(1, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(180 / Math.PI, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(1, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(180 / Math.PI, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('pi/3{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI / 3, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(60, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI / 3, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(60, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('2pi/3{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2 * Math.PI / 3, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(120, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(2 * Math.PI / 3, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(120, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('pi{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(Math.PI, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(180, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(Math.PI, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(180, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(4 * 180 / Math.PI, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(4, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(4 * 180 / Math.PI, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('3pi/2{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(270, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(3 * Math.PI / 2, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(270, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('11pi/6{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(11 * Math.PI / 6, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(330, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(11 * Math.PI / 6, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(330, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('2pi{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(2 * Math.PI, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(360, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(2 * Math.PI, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(360, 1E-12);
    })

    cy.get('#\\/_mathinput1_input').clear().type('2pi+0.00001{enter}');
    cy.get('#__math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0.00001, 1E-6)
    })
    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text)).closeTo(0.0018 / Math.PI, 1E-6)
    })
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle).closeTo(0.00001, 1E-12);
      expect(components['/_angle1'].state.degrees).closeTo(0.0018 / Math.PI, 1E-12);
    })


  })

  it('angle from number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <angle>pi/2</angle>
  <math simplify>2<ref>_angle1</ref></math>
  <math simplify>2<ref prop="angle">_angle1</ref></math>
  <math simplify>2<ref prop="degrees">_angle1</ref></math>

  `}, "*");
    });

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
      expect(components['/_angle1'].state.angle.tree).eqls(['/', 'pi', 2]);
      expect(components['/_angle1'].state.degrees).eq(90);
    })

  })

  it('angle from variable', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <angle>alpha</angle>
  <math simplify>2<ref>_angle1</ref></math>
  <math simplify>2<ref prop="angle">_angle1</ref></math>
  <math simplify>2<ref prop="degrees">_angle1</ref></math>

  `}, "*");
    });

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("NaN")
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].state.angle.tree).eq('alpha');
      assert.isNaN(components['/_angle1'].state.degrees);
    })

  })

});
