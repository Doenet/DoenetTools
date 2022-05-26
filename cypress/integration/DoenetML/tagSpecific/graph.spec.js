import cssesc from 'cssesc';
import { createFunctionFromDefinition } from '../../../../src/Core/utils/function';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Graph Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it.skip('string sugared to curve in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>x^2</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let curve = stateVariables["/_graph1"].activeChildren[0];
      expect(curve.stateValues.flipFunction).eq(false);
      expect(curve.stateValues.fs[0](-2)).eq(4);
      expect(curve.stateValues.fs[0](3)).eq(9);
    })

  });

  it.skip('y = function string sugared to curve in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>y=x^2</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let curve = stateVariables["/_graph1"].activeChildren[0];
      let functioncurve = curve.activeChildren[0];
      expect(curve.stateValues.variables[0].tree).eq("x");
      expect(curve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.variables[0].tree).eq("x");
      expect(functioncurve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.flipFunction).eq(false);
      expect(functioncurve.stateValues.f(-2)).eq(4);
      expect(functioncurve.stateValues.f(3)).eq(9);
    })

  });

  it.skip('inverse function string sugared to curve in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>y^2=x</graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let curve = stateVariables["/_graph1"].activeChildren[0];
      let functioncurve = curve.activeChildren[0];
      expect(curve.stateValues.variables[0].tree).eq("x");
      expect(curve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.variables[0].tree).eq("x");
      expect(functioncurve.stateValues.variables[1].tree).eq("y");
      expect(functioncurve.stateValues.flipFunction).eq(true);
      expect(functioncurve.stateValues.f(-2)).eq(4);
      expect(functioncurve.stateValues.f(3)).eq(9);
    })

  });

  it('functions sugared to curves in graph', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <function>x^2</function>
      <function variables="t" stylenumber="2" label="g">t^3</function>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let curve1Name = stateVariables["/_graph1"].activeChildren[0].componentName;
      let curve2Name = stateVariables["/_graph1"].activeChildren[1].componentName;

      let f1 = createFunctionFromDefinition(stateVariables[curve1Name].stateValues.fDefinitions[0]);
      let f2 = createFunctionFromDefinition(stateVariables[curve2Name].stateValues.fDefinitions[0]);
      expect(f1(-2)).eq(4);
      expect(f1(3)).eq(9);
      expect(f2(-2)).eq(-8);
      expect(f2(3)).eq(27);
      expect(stateVariables[curve1Name].stateValues.label).eq("");
      expect(stateVariables[curve2Name].stateValues.label).eq("g");
      expect(stateVariables[curve1Name].stateValues.styleNumber).eq(1);
      expect(stateVariables[curve2Name].stateValues.styleNumber).eq(2);

    })

  });

  it('changing bounding box', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph><point>(0,0)</point>
    </graph>

    <p>xmin: <copy prop="xmin" target="_graph1" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="_graph1" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="_graph1" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="_graph1" assignNames="ymax" /></p>

    <p>Change xmin: <mathinput name="xminInput" bindValueTo="$(_graph1{prop='xmin'})" /></p>
    <p>Change xmax: <mathinput name="xmaxInput" bindValueTo="$(_graph1{prop='xmax'})" /></p>
    <p>Change ymin: <mathinput name="yminInput" bindValueTo="$(_graph1{prop='ymin'})" /></p>
    <p>Change ymax: <mathinput name="ymaxInput" bindValueTo="$(_graph1{prop='ymax'})" /></p>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    function checkLimits(xmin, xmax, ymin, ymax) {
      cy.get('#\\/xmin').should('have.text', String(xmin));
      cy.get('#\\/xmax').should('have.text', String(xmax));
      cy.get('#\\/ymin').should('have.text', String(ymin));
      cy.get('#\\/ymax').should('have.text', String(ymax));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_graph1"].stateValues.xmin).eq(xmin);
        expect(stateVariables["/_graph1"].stateValues.xmax).eq(xmax);
        expect(stateVariables["/_graph1"].stateValues.ymin).eq(ymin);
        expect(stateVariables["/_graph1"].stateValues.ymax).eq(ymax);

      })

    }


    let xmin = -10, xmax = 10, ymin = -10, ymax = 10;

    checkLimits(xmin, xmax, ymin, ymax)

    cy.get('#\\/_graph1_navigationbar > :nth-child(6)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin += increment;
      ymax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(6)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin += increment;
      ymax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(5)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin -= increment;
      ymax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(4)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin -= increment;
      xmax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(7)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin += increment;
      xmax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(7)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin += increment;
      xmax += increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(3)').click().then((_) => {
      let meanx = (xmax + xmin) / 2;
      xmin = meanx + 0.8 * (xmin - meanx);
      xmax = meanx + 0.8 * (xmax - meanx);
      let meany = (ymax + ymin) / 2;
      ymin = meany + 0.8 * (ymin - meany);
      ymax = meany + 0.8 * (ymax - meany);
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(3)').click().then((_) => {
      let meanx = (xmax + xmin) / 2;
      xmin = meanx + 0.8 * (xmin - meanx);
      xmax = meanx + 0.8 * (xmax - meanx);
      let meany = (ymax + ymin) / 2;
      ymin = meany + 0.8 * (ymin - meany);
      ymax = meany + 0.8 * (ymax - meany);
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(1)').click().then((_) => {
      let meanx = (xmax + xmin) / 2;
      xmin = meanx + (xmin - meanx) / 0.8;
      xmax = meanx + (xmax - meanx) / 0.8;
      let meany = (ymax + ymin) / 2;
      ymin = meany + (ymin - meany) / 0.8;
      ymax = meany + (ymax - meany) / 0.8;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/xminInput textarea').type(`{end}{backspace}{backspace}-8{enter}`, { force: true }).then((_) => {
      xmin = -8;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/xmaxInput textarea').type(`{end}{backspace}{backspace}12{enter}`, { force: true }).then((_) => {
      xmax = 12;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/yminInput textarea').type(`{end}{backspace}{backspace}-4{enter}`, { force: true }).then((_) => {
      ymin = -4;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/ymaxInput textarea').type(`{end}{backspace}{backspace}16{enter}`, { force: true }).then((_) => {
      ymax = 16;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(5)').click().then((_) => {
      let increment = 0.1 * (ymax - ymin);
      ymin -= increment;
      ymax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.get('#\\/_graph1_navigationbar > :nth-child(4)').click().then((_) => {
      let increment = 0.1 * (xmax - xmin);
      xmin -= increment;
      xmax -= increment;
      checkLimits(xmin, xmax, ymin, ymax)
    })


  });

  it('labels and positioning', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" xlabel="$xlabel" xlabelPosition="$xlabelpos" ylabel="$ylabel" ylabelPosition="$ylabelpos" ylabelAlignment="$ylabelalign">

    </graph>

    <tabular>
      <row>
        <cell>xlabel: <textinput name="xlabel" prefill="x" /></cell>
        <cell>position: 
        <choiceinput inline preselectChoice="2" name="xlabelpos">
          <choice>left</choice>
          <choice>right</choice>
        </choiceinput></cell>
      </row>
      <row>
        <cell>ylabel: <textinput name="ylabel" prefill="y" /></cell>
        <cell>position:
        <choiceinput inline preselectChoice="1" name="ylabelpos">
          <choice>top</choice>
          <choice>bottom</choice>
        </choiceinput>
        </cell>
        <cell>alignment:
        <choiceinput inline preselectChoice="1" name="ylabelalign">
          <choice>left</choice>
          <choice>right</choice>
        </choiceinput>
        </cell>
      </row>
    </tabular>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...

    cy.get('#\\/xlabel_input').clear().type("hello{enter}")
    cy.get('#\\/ylabel_input').clear().type("bye{enter}")

    cy.get('#\\/xlabelpos').select("left")
    cy.get('#\\/ylabelpos').select("bottom")
    cy.get('#\\/ylabelalign').select("left")

  });

  it('identical axis scales', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    function checkLimits(xmin, xmax, ymin, ymax) {
      cy.get('#\\/xmin').should('have.text', String(xmin));
      cy.get('#\\/xmax').should('have.text', String(xmax));
      cy.get('#\\/ymin').should('have.text', String(ymin));
      cy.get('#\\/ymax').should('have.text', String(ymax));

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/g"].stateValues.xmin).eq(xmin);
        expect(stateVariables["/g"].stateValues.xmax).eq(xmax);
        expect(stateVariables["/g"].stateValues.ymin).eq(ymin);
        expect(stateVariables["/g"].stateValues.ymax).eq(ymax);

      })

    }

    let xmin = -10, xmax = 10, ymin = -10, ymax = 10;

    checkLimits(xmin, xmax, ymin, ymax)

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -5;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -20;
      ymax = 20;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -40;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -10;
      ymax = 10;
      checkLimits(xmin, xmax, ymin, ymax)
    })


    cy.reload();

    cy.log('xmin alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmin="-5" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'b').then(() => {
      xmin = -5;
      xmax = 15;
      ymin = -10;
      ymax = 10;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -5;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -20;
      ymax = 20;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -40;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -10;
      ymax = 10;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('xmax alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmax="5" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'c').then(() => {
      xmin = -15;
      xmax = 5;
      ymin = -10;
      ymax = 10;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -5;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -20;
      ymax = 20;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -40;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -10;
      ymax = 10;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('ymin alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>d</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" ymin="-5" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'd').then(() => {
      xmin = -10;
      xmax = 10;
      ymin = -5;
      ymax = 15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymax = 35;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymax = 75;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymax = 15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('ymax alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" ymax="5" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'e').then(() => {
      xmin = -10;
      xmax = 10;
      ymin = -15;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -35;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -75;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('xmin and xmax specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>f</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmin='-20' xmax="40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'f').then(() => {
      xmin = -20;
      xmax = 40;
      ymin = -30;
      ymax = 30;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -15;
      ymax = 15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -60;
      ymax = 60;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -120;
      ymax = 120;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -30;
      ymax = 30;
      checkLimits(xmin, xmax, ymin, ymax)
    })


    cy.reload();

    cy.log('ymin and ymax specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" ymin='-20' ymax="40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'g').then(() => {
      xmin = -30;
      xmax = 30;
      ymin = -20;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      xmin = -60;
      xmax = 60;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmin = -15;
      xmax = 15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      xmin = -7.5;
      xmax = 7.5;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmin = -30;
      xmax = 30;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();


    cy.log('xmin, xmax, ymin and ymax specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>h</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmin="-50" xmax="30" ymin='-20' ymax="40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'h').then(() => {
      xmin = -50;
      xmax = 30;
      ymin = -20;
      ymax = 60;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      xmax = 70;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmax = 30;
      ymax = 140;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymax = 300;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymax = 60;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('leave out xmin')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>i</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmax="30" ymin='-20' ymax="40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'i').then(() => {
      xmin = -30;
      xmax = 30;
      ymin = -20;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      xmin = -90;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmin = 0;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      xmin = 15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmin = -30;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('leave out xmax')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>j</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmin="-30" ymin='-20' ymax="40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'j').then(() => {
      xmin = -30;
      xmax = 30;
      ymin = -20;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      xmax = 90;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmax = 0;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      xmax = -15;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      xmax = 30;
      checkLimits(xmin, xmax, ymin, ymax)
    })


    cy.reload();

    cy.log('leave out ymin')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>k</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmin="-50" xmax="30" ymax="40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'k').then(() => {
      xmin = -50;
      xmax = 30;
      ymin = -40;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = 0;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -120;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymin = -280;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymin = -40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.reload();

    cy.log('leave out ymax')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>l</text>
    <p>Width: <mathinput name="width" prefill="200" /></p>
    <p>Height: <mathinput name="height" prefill="200" /></p>

    <graph name="g" identicalAxisScales width="$width" height="$height" xmin="-50" xmax="30" ymin="-40" />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>
   
    `}, "*");
    });

    //wait for page to load
    cy.get('#\\/_text1').should('have.text', 'l').then(() => {
      xmin = -50;
      xmax = 30;
      ymin = -40;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 400')
    cy.get('#\\/width textarea').type('{rightArrow}{backspace}4{enter}', { force: true }).then(() => {
      ymax = 0;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set width to 100')
    cy.get('#\\/width textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymax = 120;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 400')
    cy.get('#\\/height textarea').type('{rightarrow}{backspace}4{enter}', { force: true }).then(() => {
      ymax = 280;
      checkLimits(xmin, xmax, ymin, ymax)
    })

    cy.log('set height to 100')
    cy.get('#\\/height textarea').type('{backspace}1{enter}', { force: true }).then(() => {
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
    })


  });

  it('show grid', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g1">
    </graph>
    <p>Graph 1 has grid: <copy prop="grid" target="g1" assignNames="sg1" /></p>

    <graph name="g2" grid="none">
    </graph>
    <p>Graph 2 has grid: <copy prop="grid" target="g2" assignNames="sg2" /></p>

    <graph name="g3" grid>
    </graph>
    <p>Graph 3 has grid: <copy prop="grid" target="g3" assignNames="sg3" /></p>

    <graph name="g4" grid="medium">
    </graph>
    <p>Graph 4 has grid: <copy prop="grid" target="g4" assignNames="sg4" /></p>

    <graph name="g5" grid="dense">
    </graph>
    <p>Graph 5 has grid: <copy prop="grid" target="g5" assignNames="sg5" /></p>


    <p>Show grid: <booleanInput name="bi" /></p>
    <graph name="g6" grid="$bi">
    </graph>
    <p>Graph 6 has grid: <copy prop="grid" target="g6" assignNames="sg6" /></p>


    <p>Show grid: <textinput name="ti" /></p>
    <graph name="g7" grid="$ti">
    </graph>
    <p>Graph 7 has grid: <copy prop="grid" target="g7" assignNames="sg7" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...
    cy.get('#\\/sg1').should('have.text', 'none')
    cy.get('#\\/sg2').should('have.text', 'none')
    cy.get('#\\/sg3').should('have.text', 'medium')
    cy.get('#\\/sg4').should('have.text', 'medium')
    cy.get('#\\/sg5').should('have.text', 'dense')
    cy.get('#\\/sg6').should('have.text', 'none')
    cy.get('#\\/sg7').should('have.text', 'none')

    cy.get('#\\/bi_input').click();
    cy.get('#\\/sg6').should('have.text', 'medium')

    cy.get('#\\/ti_input').type('true{enter}')
    cy.get('#\\/sg7').should('have.text', 'medium')

    cy.get('#\\/ti_input').clear().type('false{enter}')
    cy.get('#\\/sg7').should('have.text', 'none')

    cy.get('#\\/ti_input').clear().type('dense{enter}')
    cy.get('#\\/sg7').should('have.text', 'dense')

    cy.get('#\\/ti_input').clear().type('hello{enter}')
    cy.get('#\\/sg7').should('have.text', 'none')

    cy.get('#\\/ti_input').clear().type('medium{enter}')
    cy.get('#\\/sg7').should('have.text', 'medium')

    cy.get('#\\/ti_input').clear().type('none{enter}')
    cy.get('#\\/sg7').should('have.text', 'none')



  });

  // check for bug in placeholder adapter
  it('graph with label as submitted response, componentType specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph xlabel="$(x{prop='submittedResponse' componentType='math'})" ylabel="y" />

    <answer name="x">x</answer>
    <copy prop="submittedResponse" target="x" assignNames="sr" />
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...
    // but main thing is that don't have an error


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.xlabel).eq('\uff3f');

      let mathinputName = stateVariables['/x'].stateValues.inputChildren[0].componentName
      let mathinputAnchor = cesc('#' + mathinputName) + " textarea";


      cy.get(mathinputAnchor).type("x{enter}", { force: true });

      cy.get('#\\/sr .mjx-mrow').should('contain.text', 'x')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/_graph1"].stateValues.xlabel).eq('x');
      });


    });


  });

  it('display tick labels', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph displayXAxisTickLabels="$b1" displayYAxisTickLabels="$b2">
    </graph>
    <booleaninput name="b1" />
    <copy prop="displayXAxisTickLabels" target="_graph1" assignNames="b1a" />
    <booleaninput name="b2" prefill="true" />
    <copy prop="displayYAxisTickLabels" target="_graph1" assignNames="b2a" />


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...
    cy.get('#\\/b1a').should('have.text', 'false')
    cy.get('#\\/b2a').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxisTickLabels).eq(false);
      expect(stateVariables["/_graph1"].stateValues.displayYAxisTickLabels).eq(true);
    })


    cy.get('#\\/b1_input').click();

    cy.get('#\\/b1a').should('have.text', 'true')
    cy.get('#\\/b2a').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxisTickLabels).eq(true);
      expect(stateVariables["/_graph1"].stateValues.displayYAxisTickLabels).eq(true);
    })

    cy.get('#\\/b2_input').click();

    cy.get('#\\/b1a').should('have.text', 'true')
    cy.get('#\\/b2a').should('have.text', 'false')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxisTickLabels).eq(true);
      expect(stateVariables["/_graph1"].stateValues.displayYAxisTickLabels).eq(false);
    })

    cy.get('#\\/b1_input').click();

    cy.get('#\\/b1a').should('have.text', 'false')
    cy.get('#\\/b2a').should('have.text', 'false')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxisTickLabels).eq(false);
      expect(stateVariables["/_graph1"].stateValues.displayYAxisTickLabels).eq(false);
    })

    cy.get('#\\/b2_input').click();

    cy.get('#\\/b1a').should('have.text', 'false')
    cy.get('#\\/b2a').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxisTickLabels).eq(false);
      expect(stateVariables["/_graph1"].stateValues.displayYAxisTickLabels).eq(true);
    })



  });

});