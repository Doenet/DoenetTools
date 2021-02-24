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
    cy.visit('/test')
  })

  it('angle determined by three points, 45-45-90 triangle', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy prop="angle" tname="_angle1" />
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>

  <graph>
  <point>
    <x><copy prop="value" tname="_mathinput1" /></x>
    <y><copy prop="value" tname="_mathinput2" /></y>
  </point>
  <point>(2,4)</point>
  <point>(4,2)</point>
    <angle>
      <through>
        <copy tname="_point1" />
        <copy tname="_point2" />
        <copy tname="_point3" />
      </through>
    </angle>
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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI / 4, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('4{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(7 * Math.PI / 4, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(7 * Math.PI / 4, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('0{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('2{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI / 2, 1E-12);
      })


      cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('6{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(3 * Math.PI / 2, 1E-12);
      })

    })
  })

  it('angle determined by two lines', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <copy prop="angle" tname="_angle1" />
  <mathinput prefill="2"/>
  <mathinput prefill="2"/>
  <mathinput prefill="-2"/>
  <mathinput prefill="2"/>

  <graph>
  <point>
    <x><copy prop="value" tname="_mathinput1" /></x>
    <y><copy prop="value" tname="_mathinput2" /></y>
  </point>
  <point>
    <x><copy prop="value" tname="_mathinput1" /> + cos(<copy prop="value" tname="_mathinput3" />)</x>
    <y><copy prop="value" tname="_mathinput2" /> + sin(<copy prop="value" tname="_mathinput3" />)</y>
  </point>
  <point>
    <x><copy prop="value" tname="_mathinput1" /> + cos(<copy prop="value" tname="_mathinput4" />)</x>
    <y><copy prop="value" tname="_mathinput2" /> + sin(<copy prop="value" tname="_mathinput4" />)</y>
    </point>
  <line>
    <through>
      <copy tname="_point1" />
      <copy tname="_point2" />
    </through>
  </line>
  <line>
    <through>
      <copy tname="_point1" />
      <copy tname="_point3" />
    </through>
  </line>

  <angle radius="2">
    <copy tname="_line1" />
    <copy tname="_line2" />
  </angle>
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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(4, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('-3{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('7{enter}');
      cy.get('#\\/_mathinput3_input').clear().type('4{enter}');
      cy.get('#\\/_mathinput4_input').clear().type('6{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(2, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('5{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('-3{enter}');
      cy.get('#\\/_mathinput3_input').clear().type('3{enter}');
      cy.get('#\\/_mathinput4_input').clear().type('3{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(0, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('2{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('-1{enter}');
      cy.get('#\\/_mathinput3_input').clear().type('pi/4{enter}');
      cy.get('#\\/_mathinput4_input').clear().type('5pi/4{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI, 1E-12);
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

  <graph>
  <line>
    <through>
      <point>(1,2)</point>
      <point>
        <xs>
          <copy prop="value" tname="_mathinput1" />
          <copy prop="value" tname="_mathinput2" />
        </xs>
      </point>
    </through>
  </line>
  <line><through>(6,2),(8,4)</through></line>

  <angle>
    <copy tname="_line1" />
    <copy tname="_line2" />
  </angle>
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

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        assert.isNaN(components['/_angle1'].stateValues.angle.tree);
      })

      cy.get('#\\/_mathinput2_input').clear().type('0{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 2, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI / 2, 1E-12);
      })


      cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
      cy.get('#\\/_mathinput2_input').clear().type('2{enter}');

      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).eq("＿");
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        assert.isNaN(components['/_angle1'].stateValues.angle.tree);
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
    <point><xs><math>7cos(1)</math><math>7sin(1)</math></xs></point>
    <angle radius="$_mathinput1">
      <through><copy tname="_point1" /><copy tname="_point2" /><copy tname="_point3" /></through>
    </angle>
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
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(1, 1E-12);
        expect(components['/_angle1'].stateValues.radius.tree).eq('\uFF3F');
      })

      cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq(1);
      })

      cy.get('#\\/_mathinput1_input').clear().type('2{enter}');
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq(2);
      })

      cy.get('#\\/_mathinput1_input').clear().type('-3{enter}');
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.simplify().tree).eq(-3);
      })

      cy.get('#\\/_mathinput1_input').clear().type('x{enter}');
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.radius.tree).eq('x');
      })

      cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
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
    <point><xs>
      <math>8cos(<copy prop="value" tname="_mathinput1" />)</math>
      <math>8sin(<copy prop="value" tname="_mathinput1" />)</math>
    </xs></point>
    <angle><through>
      <copy tname="_point1" /><copy tname="_point2" /><copy tname="_point3" />
    </through></angle>
  </graph>
  <p><copy name="alpha" prop="angle" tname="_angle1" /></p>
  <p><copy name="alphadeg" prop="degrees" tname="_angle1" /></p>
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
      cy.get(angleDegAnchor).should("have.text", "NaN");

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        assert.isNaN(components['/_angle1'].stateValues.angle.tree);
        assert.isNaN(components['/_angle1'].stateValues.degrees);
      })

      cy.get('#\\/_mathinput1_input').clear().type('pi/4{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 4, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(45, 1E-6)
      })

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI / 4, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(45, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(1, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(180 / Math.PI, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(1, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(180 / Math.PI, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('pi/3{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI / 3, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(60, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI / 3, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(60, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('2pi/3{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2 * Math.PI / 3, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(120, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(2 * Math.PI / 3, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(120, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('pi{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(Math.PI, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(180, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(Math.PI, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(180, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('4{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(4, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(4 * 180 / Math.PI, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(4, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(4 * 180 / Math.PI, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('3pi/2{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(3 * Math.PI / 2, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(270, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(3 * Math.PI / 2, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(270, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('11pi/6{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(11 * Math.PI / 6, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(330, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(11 * Math.PI / 6, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(330, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('2pi{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(2 * Math.PI, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(360, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(2 * Math.PI, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(360, 1E-12);
      })

      cy.get('#\\/_mathinput1_input').clear().type('2pi+0.00001{enter}');
      cy.get(angleAnchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0.00001, 1E-6)
      })
      cy.get(angleDegAnchor).invoke('text').then((text) => {
        expect(Number(text)).closeTo(0.0018 / Math.PI, 1E-6)
      })
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components['/_angle1'].stateValues.angle.tree).closeTo(0.00001, 1E-12);
        expect(components['/_angle1'].stateValues.degrees).closeTo(0.0018 / Math.PI, 1E-12);
      })
    })

  })

  it('angle from number', () => {
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
      expect(components['/_angle1'].stateValues.angle.tree).eqls(['/', 'pi', 2]);
      expect(components['/_angle1'].stateValues.degrees).eq(90);
    })

  })

  it('angle from variable', () => {
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

    cy.get('#\\/_math1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2α")
    })
    cy.get('#\\/_math3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).eq("2＿")
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_angle1'].stateValues.angle.tree).eq('alpha');
      assert.isNaN(components['/_angle1'].stateValues.degrees);
    })

  })

});
