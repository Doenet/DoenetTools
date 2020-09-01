describe('Document Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('hint, document and variable components test', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
        <document>
            <p>this point will appear on graph</p>
            <mathinput prefill="1"></mathinput>
            <mathinput prefill="3"></mathinput>
            <variable>x=<ref prop="value">_mathinput1</ref></variable>
            <p>
              <variable>y=<ref prop="value">_mathinput2</ref></variable>
            </p>

            
            <hint>x+y=<math simplify><ref prop="value">_mathinput1</ref>+<ref prop="value">_mathinput2</ref></math simplify></hint>
            <graph>
              <line>
                <point name="A">(1,3)</point>  
                <point name="B">(0,1)</point>
              </line>
              <circle>
                <point>(<ref prop="value">_mathinput1</ref>,<ref prop="value">_mathinput2</ref>)
                </point>
              </circle>
            </graph>
            <table>
              <cell colnum="A" rownum="1"><ref prop="value">_mathinput1</ref></cell>
              <cell colnum="B" rownum="1"><ref prop="value">_mathinput2</ref></cell>
              <cell colnum="C" rownum="1"><ref prop="radius">_circle1</ref></cell>
            </table>
        </document>
    
  `}, "*");
    });
    

    cy.log('Test values displayed in browser')
    cy.get('#\\/_variable1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x=1')
    })
    cy.get('#\\/_variable2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y=3')
    })
    cy.get('#\\/_hint1').click().eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('Hint x+y=444') //??
    })
    cy.get('#\\/_mathinput1_input').should('have.value', '1');
    cy.get('#\\/_mathinput2_input').should('have.value', '3');
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",1,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([1,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(1);
      expect(components.__point1.state.xs[1].tree).eq(3);
    })
    
    cy.log("typing1");
    cy.get('#\\/_mathinput1_input').clear().type('7{enter}');
    cy.get('#\\/_mathinput1_input').should('have.value', '7');
    cy.get('#\\/_mathinput2_input').clear().type('3{enter}');
    cy.get('#\\/_mathinput2_input').should('have.value', '3');
    cy.get('#\\/_hint1').click().eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('Hint x+y=10')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",7,3]);
      expect(components['/_circle1'].state.centerNumeric).eqls([7,3]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(7);
      expect(components.__point1.state.xs[1].tree).eq(3);
    })
    cy.log("typing2");
    cy.get('#\\/_mathinput1_input').clear().type('10{enter}');
    cy.get('#\\/_mathinput1_input').should('have.value', '10');
    cy.get('#\\/_mathinput2_input').clear().type('2{enter}');
    cy.get('#\\/_mathinput2_input').should('have.value', '2');
    cy.get('#\\/_hint1').click().eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('Hint x+y=12')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",10,2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([10,2]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(10);
      expect(components.__point1.state.xs[1].tree).eq(2);
    })

    cy.log("typing3");
    cy.get('#\\/_mathinput1_input').clear().type('-10{enter}');
    cy.get('#\\/_mathinput1_input').should('have.value', '-10');
    cy.get('#\\/_mathinput2_input').clear().type('2{enter}');
    cy.get('#\\/_mathinput2_input').should('have.value', '2');
    cy.get('#\\/_hint1').click().eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('Hint x+y=-8')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_circle1'].state.center.tree).eqls(["tuple",-8,2]);
      expect(components['/_circle1'].state.centerNumeric).eqls([-8,2]);
      expect(components['/_circle1'].state.radius.tree).eq(1);
      expect(components['/_circle1'].state.radiusNumeric).eq(1);
      expect(components.__point1.state.xs[0].tree).eq(-8);
      expect(components.__point1.state.xs[1].tree).eq(2);
    })

    cy.log('move circle')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      let t1x=3, t1y=1;
      let t2x=2, t2y=0;
      let r=Math.sqrt(Math.pow(t1x-t2x,2)+Math.pow(t1y-t2y,2))/2;
      let cx=(t1x+t2x)/2, cy=(t1y+t2y)/2;
      
      cy.get('#\\/_mathinput1_input').should('have.value').closeTo(cx,1E-12);
      cy.get('#\\/_mathinput2_input').should('have.value').closeTo(cy,1E-12);
      components['/_circle1'].moveCircle({center: [cx,cy], radius: r})
      expect(components['/_circle1'].state.center.tree[1]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.center.tree[2]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.centerNumeric[0]).closeTo(cx,1E-12);
      expect(components['/_circle1'].state.centerNumeric[1]).closeTo(cy,1E-12);
      expect(components['/_circle1'].state.radius.tree).closeTo(r,1E-12);
      expect(components['/_circle1'].state.radiusNumeric).closeTo(r,1E-12);
      expect(components['/_point1'].state.xs[0].tree).closeTo(t1x,1E-12);
      expect(components['/_point1'].state.xs[1].tree).closeTo(t1y,1E-12);
      expect(components['/_point2'].state.xs[0].tree).closeTo(t2x,1E-12);
      expect(components['/_point2'].state.xs[1].tree).closeTo(t2y,1E-12);
      expect(components.__point1.state.xs[0].tree).closeTo(cx,1E-12);
      expect(components.__point1.state.xs[1].tree).closeTo(cy,1E-12);
      expect(components.__radius1.state.value.tree).closeTo(r,1E-12);
    })
    

    
})});
