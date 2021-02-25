describe('UpdateValue Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
    

  })
  
  it('incrementing graph of line segments',() => {

    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <number name="step">20/<copy tname="count" /></number>
    <graph>
    <map>
    <template>
    <linesegment>
      <endpoints>
      <point><coords>(<copySource/>, sin(<copySource/>))</coords></point>
      <point><coords>(<copySource/>+<copy tname="step" />, sin(<copySource/>+<copy tname="step" />))</coords></point>
      </endpoints>
    </linesegment>
    </template>
    <sources>
    <sequence from="-10">
      <to><number>10-<copy tname="step" /></number></to>
      <count><number name="count">2</number></count>
    </sequence>
    </sources>
    </map>
    </graph>
    <p></p>
    <updatevalue label="double">
      <mathtarget><copy tname="count" /></mathtarget>
      <newmathvalue>2<copy tname="count" /></newmathvalue>
    </updatevalue>
    `},"*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let left=-10;

    cy.log(`check internal values`);
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 2;
      let step = 20/count;

      expect(components['/count'].state.number).eq(count);
      expect(components['/step'].state.number).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(0)
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(0)
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

    cy.log('double number');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 4;
      let step = 20/count;

      expect(components['/count'].state.number).eq(count);
      expect(components['/step'].state.number).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(0)
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(0)
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

    cy.log('double number a second time');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 8;
      let step = 20/count;

      expect(components['/count'].state.number).eq(count);
      expect(components['/step'].state.number).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(0)
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(0)
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

    cy.log('double number a third time');
    cy.get('#\\/_updatevalue1').click();
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);

      let count = 16;
      let step = 20/count;

      expect(components['/count'].state.number).eq(count);
      expect(components['/step'].state.number).eq(step);

      for(let ind=1; ind<= count; ind++) {
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(0)
          .evaluate_to_constant()).closeTo(left+(ind-1)*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[0].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+(ind-1)*step),1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(0)
          .evaluate_to_constant()).closeTo(left+ind*step,1E-12);
        expect(components['/__map1_'+(ind-1)+'_linesegment1'].state.endpoints[1].get_component(1)
          .evaluate_to_constant()).closeTo(Math.sin(left+ind*step),1E-12);
      }
    });

  })

});