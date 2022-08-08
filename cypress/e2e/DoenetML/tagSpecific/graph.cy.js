import cssesc from 'cssesc';
import { createFunctionFromDefinition } from '../../../../src/Core/utils/function';
import { widthsBySize } from '../../../../src/Core/utils/size';

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

    <p>Change xmin: <mathinput name="xminInput" bindValueTo="$_graph1.xmin" /></p>
    <p>Change xmax: <mathinput name="xmaxInput" bindValueTo="$_graph1.xmax" /></p>
    <p>Change ymin: <mathinput name="yminInput" bindValueTo="$_graph1.ymin" /></p>
    <p>Change ymax: <mathinput name="ymaxInput" bindValueTo="$_graph1.ymax" /></p>
    
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

  it('identical axis scales, with given aspect ratio', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" />

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
    cy.get('#\\/g').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
    cy.get('#\\/g').invoke('css', 'height')
      .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymin = -5;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymin = -20;
      ymax = 20;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })


    cy.reload();

    cy.log('xmin alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmin="-5" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymin = -5;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymin = -20;
      ymax = 20;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })


    cy.reload();

    cy.log('xmax alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmax="5" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymin = -5;
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymin = -20;
      ymax = 20;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('ymin alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>d</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" ymin="-5" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymax = 5;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymax = 35;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('ymax alone specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" ymax="5" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymin = -5;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymin = -35;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('xmin and xmax specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>f</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmin='-20' xmax="40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymin = -15;
      ymax = 15;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymin = -60;
      ymax = 60;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('ymin and ymax specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" ymin='-20' ymax="40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      xmin = -60;
      xmax = 60;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      xmin = -15;
      xmax = 15;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();


    cy.log('xmin, xmax, ymin and ymax specified')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>h</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmin="-50" xmax="30" ymin='-20' ymax="40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      xmax = 70;
      ymax = 40;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      xmax = 30;
      ymax = 140;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('leave out xmin')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>i</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmax="30" ymin='-20' ymax="40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      xmin = -90;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      xmin = 0;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('leave out xmax')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>j</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmin="-30" ymin='-20' ymax="40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      xmax = 90;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      xmax = 0;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('leave out ymin')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>k</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmin="-50" xmax="30" ymax="40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymin = 0;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymin = -120;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

    cy.reload();

    cy.log('leave out ymax')
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>l</text>
    <p>Aspect ratio: <mathinput name="aspectRatio" prefill="1" /></p>

    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" xmin="-50" xmax="30" ymin="-40" />

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
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)

    })

    cy.log('set aspect ratio to 2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}2{enter}', { force: true }).then(() => {
      ymax = 0;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 212).and('be.lte', 213)

    })

    cy.log('set aspect ratio to 1/2')
    cy.get('#\\/aspectRatio textarea').type('{end}{backspace}1/2{enter}', { force: true }).then(() => {
      ymax = 120;
      checkLimits(xmin, xmax, ymin, ymax)
      cy.get('#\\/g').invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
      cy.get('#\\/g').invoke('css', 'height')
        .then(height => parseInt(height)).should('be.gte', 849).and('be.lte', 851)

    })

  });

  it('identical axis scales, without given aspect ratio', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" identicalAxisScales />

    <p>xmin: <copy prop="xmin" target="g" assignNames="xmin" /></p>
    <p>xmax: <copy prop="xmax" target="g" assignNames="xmax" /></p>
    <p>ymin: <copy prop="ymin" target="g" assignNames="ymin" /></p>
    <p>ymax: <copy prop="ymax" target="g" assignNames="ymax" /></p>

    <p>Change xmin: <mathinput name="xminInput" bindValueTo="$g.xmin" /></p>
    <p>Change xmax: <mathinput name="xmaxInput" bindValueTo="$g.xmax" /></p>
    <p>Change ymin: <mathinput name="yminInput" bindValueTo="$g.ymin" /></p>
    <p>Change ymax: <mathinput name="ymaxInput" bindValueTo="$g.ymax" /></p>

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


    cy.get('#\\/g').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
    cy.get('#\\/g').invoke('css', 'height')
      .then(height => parseInt(height)).should('be.gte', 424).and('be.lte', 426)


    checkLimits(-10, 10, -10, 10)


    cy.log('set xmin to -5')
    cy.get("#\\/xminInput textarea").type("{ctrl+home}{shift+ctrl+end}{backspace}-5{enter}", { force: true });

    cy.get('#\\/xmin').should('have.text', '-5');
    cy.get('#\\/g').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
    cy.get('#\\/g').invoke('css', 'height')
      .then(height => parseInt(height)).should('be.gte', 566).and('be.lte', 567)

    checkLimits(-5, 10, -10, 10)

    cy.log('set ymax to 0')
    cy.get("#\\/ymaxInput textarea").type("{ctrl+home}{shift+ctrl+end}{backspace}0{enter}", { force: true });

    cy.get('#\\/ymax').should('have.text', '0');
    cy.get('#\\/g').invoke('css', 'width')
      .then(width => parseInt(width)).should('be.gte', 424).and('be.lte', 426)
    cy.get('#\\/g').invoke('css', 'height')
      .then(height => parseInt(height)).should('be.gte', 283).and('be.lte', 284)

    checkLimits(-5, 10, -10, 0)


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

  it('fixed grids', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g1" grid="1 pi/2" displayDigits="4">
    </graph>
    <p>Graph 1 has grid: <copy prop="grid" target="g1" assignNames="sg1" /></p>

    <p>grid x: <mathinput name="g2x" /></p>
    <p>grid y: <mathinput name="g2y" /></p>
    <graph name="g2" grid="$g2x $g2y">
    </graph>
    <p>Graph 2 has grid: <copy prop="grid" target="g2" assignNames="sg2" /></p>

    <p>grid x: <mathinput name="g3x" /> <number name="g3xa" hide>$g3x</number></p>
    <p>grid y: <mathinput name="g3y" /> <number name="g3ya" hide>$g3y</number></p>
    <graph name="g3" grid="$g3xa $g3ya">
    </graph>
    <p>Graph 3 has grid: <copy prop="grid" target="g3" assignNames="sg3" /></p>

    <p>grid x: <mathinput name="g4x" prefill="1" /></p>
    <p>grid y: <mathinput name="g4y" prefill="1" /></p>
    <graph name="g4" grid="2$g4x 3$g4y" displayDecimals="2">
    </graph>
    <p>Graph 4 has grid: <copy prop="grid" target="g4" assignNames="sg4" /></p>

    <p>grid x: <mathinput name="g5x" prefill="1" /> <number name="g5xa">$g5x</number></p>
    <p>grid y: <mathinput name="g5y" prefill="1" /> <number name="g5ya">$g5y</number></p>
    <graph name="g5" grid="2$g5xa 3$g5ya" displayDecimals="2">
    </graph>
    <p>Graph 5 has grid: <copy prop="grid" target="g5" assignNames="sg5" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/sg1').should('have.text', '1, 1.571')
    cy.get('#\\/sg2').should('have.text', 'none')
    cy.get('#\\/sg3').should('have.text', 'none')
    cy.get('#\\/sg4').should('have.text', '2, 3')
    cy.get('#\\/sg5').should('have.text', '2, 3')

    cy.get("#\\/g2x textarea").type("3", { force: true })
    cy.get("#\\/g2y textarea").type("1.5", { force: true }).blur();
    cy.get('#\\/sg2').should('have.text', '3, 1.5')

    cy.get("#\\/g3x textarea").type("3", { force: true })
    cy.get("#\\/g3y textarea").type("1.5", { force: true }).blur();
    cy.get('#\\/sg3').should('have.text', '3, 1.5')

    cy.get("#\\/g4x textarea").type("{end}{backspace}3", { force: true })
    cy.get("#\\/g4y textarea").type("{end}.5", { force: true }).blur();
    cy.get('#\\/sg4').should('have.text', '6, 4.5')

    cy.get("#\\/g5x textarea").type("{end}{backspace}3", { force: true })
    cy.get("#\\/g5y textarea").type("{end}.5", { force: true }).blur();
    cy.get('#\\/sg5').should('have.text', '6, 4.5')


    cy.get("#\\/g2x textarea").type("{end}e/2", { force: true })
    cy.get("#\\/g2y textarea").type("{end}pi", { force: true }).blur();
    cy.get('#\\/sg2').should('have.text', '4.077422743, 4.71238898')

    cy.get("#\\/g3x textarea").type("{end}e/2", { force: true })
    cy.get("#\\/g3y textarea").type("{end}pi", { force: true }).blur();
    cy.get('#\\/sg3').should('have.text', '4.077422743, 4.71238898')

    cy.get("#\\/g4x textarea").type("{end}pi/5", { force: true })
    cy.get("#\\/g4y textarea").type("{end}e/6", { force: true }).blur();
    cy.get('#\\/sg4').should('have.text', '3.77, 2.04')

    cy.get("#\\/g5x textarea").type("{end}pi/5", { force: true })
    cy.get("#\\/g5y textarea").type("{end}e/6", { force: true }).blur();
    cy.get('#\\/sg5').should('have.text', '3.77, 2.04')


  });

  // check for bug in placeholder adapter
  it('graph with label as submitted response, createComponentOfType specified', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph xlabel="$(x.submittedResponse{ createComponentOfType='math'})" ylabel="y" />

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

  it('graph sizes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" />

    <graph name="gtiny" size="tiny" />
    <graph name="gsmall" size="small" />
    <graph name="gmedium" size="medium" />
    <graph name="glarge" size="large" />
    <graph name="gfull" size="full" />
    <graph name="ginvalid" size="invalid" />

    <graph name="ga10" width="10" />
    <graph name="ga100" width="100" />
    <graph name="ga200" width="200" />
    <graph name="ga300" width="300" />
    <graph name="ga400" width="400" />
    <graph name="ga500" width="500" />
    <graph name="ga600" width="600" />
    <graph name="ga700" width="700" />
    <graph name="ga800" width="800" />
    <graph name="ga900" width="900" />
    <graph name="ga10000" width="10000" />

    <graph name="gp1" width="1%" />
    <graph name="gp10" width="10%" />
    <graph name="gp20" width="20%" />
    <graph name="gp30" width="30%" />
    <graph name="gp40" width="40%" />
    <graph name="gp50" width="50%" />
    <graph name="gp60" width="60%" />
    <graph name="gp70" width="70%" />
    <graph name="gp80" width="80%" />
    <graph name="gp90" width="90%" />
    <graph name="gp100" width="100%" />
    <graph name="gp1000" width="1000%" />

    <graph name="gbadwidth" width="bad" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    let expectedSizes = {
      g: "medium",
      gtiny: "tiny",
      gsmall: "small",
      gmedium: "medium",
      glarge: "large",
      gfull: "full",
      ginvalid: "medium",
      ga10: "tiny",
      ga100: "tiny",
      ga200: "small",
      ga300: "small",
      ga400: "medium",
      ga500: "medium",
      ga600: "large",
      ga700: "large",
      ga800: "full",
      ga900: "full",
      ga10000: "full",
      gp1: "tiny",
      gp10: "tiny",
      gp20: "small",
      gp30: "small",
      gp40: "small",
      gp50: "medium",
      gp60: "medium",
      gp70: "large",
      gp80: "large",
      gp90: "full",
      gp100: "full",
      gp1000: "full",
      gbadwidth: "medium",
    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      for (let name in expectedSizes) {
        expect(stateVariables["/" + name].stateValues.size).eq(expectedSizes[name])
      }

    });

    for (let name in expectedSizes) {
      cy.get(cesc("#/" + name)).invoke('css', 'width')
        .then(width => parseInt(width)).should('be.gte', widthsBySize[expectedSizes[name]] - 4).and('be.lte', widthsBySize[expectedSizes[name]] + 1)
    }

  });

  it('horizontal align', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" />
    <graph name="gleft" horizontalAlign="left" />
    <graph name="gright" horizontalAlign="right" />
    <graph name="gcenter" horizontalAlign="center" />
    <graph name="ginvalid" horizontalAlign="invalid" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].stateValues.horizontalAlign).eq("center")
      expect(stateVariables["/gleft"].stateValues.horizontalAlign).eq("left")
      expect(stateVariables["/gright"].stateValues.horizontalAlign).eq("right")
      expect(stateVariables["/gcenter"].stateValues.horizontalAlign).eq("center")
      expect(stateVariables["/ginvalid"].stateValues.horizontalAlign).eq("center")

    });

    // TODO: anything to check in the DOM?

  });

  it('displayMode', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" />
    <graph name="ginline" displayMode="inline" />
    <graph name="gblock" displayMode="block" />
    <graph name="ginvalid" displayMode="invalid" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/g"].stateValues.displayMode).eq("block")
      expect(stateVariables["/ginline"].stateValues.displayMode).eq("inline")
      expect(stateVariables["/gblock"].stateValues.displayMode).eq("block")
      expect(stateVariables["/ginvalid"].stateValues.displayMode).eq("block")

    });

    // TODO: anything to check in the DOM?

  });

  it('tick scale factor', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="none" />

    <graph name="xpi" xTickScaleFactor="pi" />
    <graph name="ypi" yTickScaleFactor="pi" />
    <graph name="bothpi" xTickScaleFactor="pi" yTickScaleFactor="pi" />

    <graph name="xe" xTickScaleFactor="e" />
    <graph name="ye" yTickScaleFactor="e" />
    <graph name="bothe" xTickScaleFactor="e" yTickScaleFactor="e" />

    <graph name="ignorebad" xTickScaleFactor="x" yTickScaleFactor="/" />

    <copy prop="xmin" target="ignorebad" assignNames="xmin" />
    <copy prop="xmax" target="ignorebad" assignNames="xmax" />
    <copy prop="ymin" target="ignorebad" assignNames="ymin" />
    <copy prop="ymax" target="ignorebad" assignNames="ymax" />



    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // Note: these are brittle tests and could start failing if internals of jsxgraph changes


    cy.get('#\\/none').should('not.contain.text', 'π')
    cy.get('#\\/none').should('not.contain.text', 'e')
    cy.get('#\\/none').should('contain.text', '68')
    cy.get('#\\/none').should('contain.text', '−2−4−6−8')

    cy.get('#\\/xpi').should('contain.text', 'π2π3π')
    cy.get('#\\/xpi').should('contain.text', '−π−2π−3π')
    cy.get('#\\/xpi').should('contain.text', '24')
    cy.get('#\\/xpi').should('contain.text', '68')
    cy.get('#\\/xpi').should('contain.text', '−2−4−6−8')

    cy.get('#\\/ypi').should('contain.text', 'π2π3π')
    cy.get('#\\/ypi').should('contain.text', '−π−2π−3π')
    cy.get('#\\/ypi').should('contain.text', '24')
    cy.get('#\\/ypi').should('contain.text', '68')
    cy.get('#\\/ypi').should('contain.text', '−2−4−6−8')

    cy.get('#\\/bothpi').should('contain.text', 'π2π3π')
    cy.get('#\\/bothpi').should('contain.text', '−π−2π−3π')
    cy.get('#\\/bothpi').should('not.contain.text', '24')
    cy.get('#\\/bothpi').should('not.contain.text', '68')
    cy.get('#\\/bothpi').should('not.contain.text', '−2−4−6−8')

    cy.get('#\\/xe').should('contain.text', 'e2e3e')
    cy.get('#\\/xe').should('contain.text', '−e−2e−3e')
    cy.get('#\\/xe').should('contain.text', '24')
    cy.get('#\\/xe').should('contain.text', '68')
    cy.get('#\\/xe').should('contain.text', '−2−4−6−8')

    cy.get('#\\/ye').should('contain.text', 'e2e3e')
    cy.get('#\\/ye').should('contain.text', '−e−2e−3e')
    cy.get('#\\/ye').should('contain.text', '24')
    cy.get('#\\/ye').should('contain.text', '68')
    cy.get('#\\/ye').should('contain.text', '−2−4−6−8')

    cy.get('#\\/bothe').should('contain.text', 'e2e3e')
    cy.get('#\\/bothe').should('contain.text', '−e−2e−3e')
    cy.get('#\\/bothe').should('not.contain.text', '24')
    cy.get('#\\/bothe').should('not.contain.text', '68')
    cy.get('#\\/bothe').should('not.contain.text', '−2−4−6−8')

    cy.get('#\\/ignorebad').should('not.contain.text', 'π')
    cy.get('#\\/ignorebad').should('not.contain.text', 'e')
    cy.get('#\\/ignorebad').should('contain.text', '68')
    cy.get('#\\/ignorebad').should('contain.text', '−2−4−6−8')


    cy.get('#\\/none_navigationbar > :nth-child(1)').click();
    cy.get('#\\/xpi_navigationbar > :nth-child(1)').click();
    cy.get('#\\/ypi_navigationbar > :nth-child(1)').click();
    cy.get('#\\/bothpi_navigationbar > :nth-child(1)').click();
    cy.get('#\\/xe_navigationbar > :nth-child(1)').click();
    cy.get('#\\/ye_navigationbar > :nth-child(1)').click();
    cy.get('#\\/bothe_navigationbar > :nth-child(1)').click();
    cy.get('#\\/ignorebad_navigationbar > :nth-child(1)').click();

    cy.get('#\\/xmax').should('have.text', '12.5')

    cy.get('#\\/none').should('not.contain.text', 'π')
    cy.get('#\\/none').should('not.contain.text', 'e')
    cy.get('#\\/none').should('contain.text', '10')
    cy.get('#\\/none').should('contain.text', '−10')

    cy.get('#\\/xpi').should('contain.text', 'π2π3π')
    cy.get('#\\/xpi').should('contain.text', '−π−2π−3π')
    cy.get('#\\/xpi').should('contain.text', '10')
    cy.get('#\\/xpi').should('contain.text', '−10')

    cy.get('#\\/ypi').should('contain.text', 'π2π3π')
    cy.get('#\\/ypi').should('contain.text', '−π−2π−3π')
    cy.get('#\\/ypi').should('contain.text', '10')
    cy.get('#\\/ypi').should('contain.text', '−10')

    cy.get('#\\/bothpi').should('contain.text', 'π2π3π')
    cy.get('#\\/bothpi').should('contain.text', '−π−2π−3π')
    cy.get('#\\/bothpi').should('not.contain.text', '10')
    cy.get('#\\/bothpi').should('not.contain.text', '−10')

    cy.get('#\\/xe').should('contain.text', 'e2e3e4e')
    cy.get('#\\/xe').should('contain.text', '−e−2e')
    cy.get('#\\/xe').should('contain.text', '−3e−4e')
    cy.get('#\\/xe').should('contain.text', '10')
    cy.get('#\\/xe').should('contain.text', '−10')

    cy.get('#\\/ye').should('contain.text', 'e2e3e4e')
    cy.get('#\\/ye').should('contain.text', '−e−2e')
    cy.get('#\\/ye').should('contain.text', '−3e−4e')
    cy.get('#\\/ye').should('contain.text', '10')
    cy.get('#\\/ye').should('contain.text', '−10')

    cy.get('#\\/bothe').should('contain.text', 'e2e3e4e')
    cy.get('#\\/bothe').should('contain.text', '−e−2e')
    cy.get('#\\/bothe').should('contain.text', '−3e−4e')
    cy.get('#\\/bothe').should('not.contain.text', '10')
    cy.get('#\\/bothe').should('not.contain.text', '−10')

    cy.get('#\\/ignorebad').should('not.contain.text', 'π')
    cy.get('#\\/ignorebad').should('not.contain.text', 'e')
    cy.get('#\\/ignorebad').should('contain.text', '10')
    cy.get('#\\/ignorebad').should('contain.text', '−10')


    cy.get('#\\/none_navigationbar > :nth-child(1)').click();
    cy.get('#\\/xpi_navigationbar > :nth-child(1)').click();
    cy.get('#\\/ypi_navigationbar > :nth-child(1)').click();
    cy.get('#\\/bothpi_navigationbar > :nth-child(1)').click();
    cy.get('#\\/xe_navigationbar > :nth-child(1)').click();
    cy.get('#\\/ye_navigationbar > :nth-child(1)').click();
    cy.get('#\\/bothe_navigationbar > :nth-child(1)').click();
    cy.get('#\\/ignorebad_navigationbar > :nth-child(1)').click();

    cy.get('#\\/xmax').should('have.text', '15.625')

    cy.get('#\\/none').should('not.contain.text', 'π')
    cy.get('#\\/none').should('not.contain.text', 'e')
    cy.get('#\\/none').should('contain.text', '10')
    cy.get('#\\/none').should('contain.text', '−10')

    cy.get('#\\/xpi').should('contain.text', 'π2π3π4π')
    cy.get('#\\/xpi').should('contain.text', '−π−2π')
    cy.get('#\\/xpi').should('contain.text', '−3π−4π')
    cy.get('#\\/xpi').should('contain.text', '10')
    cy.get('#\\/xpi').should('contain.text', '−10')

    cy.get('#\\/ypi').should('contain.text', 'π2π3π4π')
    cy.get('#\\/ypi').should('contain.text', '−π−2π')
    cy.get('#\\/ypi').should('contain.text', '−3π−4π')
    cy.get('#\\/ypi').should('contain.text', '10')
    cy.get('#\\/ypi').should('contain.text', '−10')

    cy.get('#\\/bothpi').should('contain.text', 'π2π3π4π')
    cy.get('#\\/bothpi').should('contain.text', '−π−2π')
    cy.get('#\\/bothpi').should('contain.text', '−3π−4π')
    cy.get('#\\/bothpi').should('not.contain.text', '10')
    cy.get('#\\/bothpi').should('not.contain.text', '−10')

    cy.get('#\\/xe').should('contain.text', 'e2e3e4e5e')
    cy.get('#\\/xe').should('contain.text', '−e')
    cy.get('#\\/xe').should('contain.text', '−2e−3e')
    cy.get('#\\/xe').should('contain.text', '−4e−5e')
    cy.get('#\\/xe').should('contain.text', '10')
    cy.get('#\\/xe').should('contain.text', '−10')

    cy.get('#\\/ye').should('contain.text', 'e2e3e4e5e')
    cy.get('#\\/ye').should('contain.text', '−e')
    cy.get('#\\/ye').should('contain.text', '−2e−3e')
    cy.get('#\\/ye').should('contain.text', '−4e−5e')
    cy.get('#\\/ye').should('contain.text', '10')
    cy.get('#\\/ye').should('contain.text', '−10')

    cy.get('#\\/bothe').should('contain.text', 'e2e3e4e5e')
    cy.get('#\\/bothe').should('contain.text', '−e−2e')
    cy.get('#\\/bothe').should('contain.text', '−3e−4e−5e')
    cy.get('#\\/bothe').should('not.contain.text', '10')
    cy.get('#\\/bothe').should('not.contain.text', '−10')

    cy.get('#\\/ignorebad').should('not.contain.text', 'π')
    cy.get('#\\/ignorebad').should('not.contain.text', 'e')
    cy.get('#\\/ignorebad').should('contain.text', '10')
    cy.get('#\\/ignorebad').should('contain.text', '−10')


  });

  it('display axes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph displayXAxis="$b1" displayYAxis="$b2">
    </graph>
    <booleaninput name="b1" />
    <copy prop="displayXAxis" target="_graph1" assignNames="b1a" />
    <booleaninput name="b2" prefill="true" />
    <copy prop="displayYAxis" target="_graph1" assignNames="b2a" />


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...
    cy.get('#\\/b1a').should('have.text', 'false')
    cy.get('#\\/b2a').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxis).eq(false);
      expect(stateVariables["/_graph1"].stateValues.displayYAxis).eq(true);
    })


    cy.get('#\\/b1_input').click();

    cy.get('#\\/b1a').should('have.text', 'true')
    cy.get('#\\/b2a').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxis).eq(true);
      expect(stateVariables["/_graph1"].stateValues.displayYAxis).eq(true);
    })

    cy.get('#\\/b2_input').click();

    cy.get('#\\/b1a').should('have.text', 'true')
    cy.get('#\\/b2a').should('have.text', 'false')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxis).eq(true);
      expect(stateVariables["/_graph1"].stateValues.displayYAxis).eq(false);
    })

    cy.get('#\\/b1_input').click();

    cy.get('#\\/b1a').should('have.text', 'false')
    cy.get('#\\/b2a').should('have.text', 'false')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxis).eq(false);
      expect(stateVariables["/_graph1"].stateValues.displayYAxis).eq(false);
    })

    cy.get('#\\/b2_input').click();

    cy.get('#\\/b1a').should('have.text', 'false')
    cy.get('#\\/b2a').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.displayXAxis).eq(false);
      expect(stateVariables["/_graph1"].stateValues.displayYAxis).eq(true);
    })



  });

  it('display navigation bar', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph showNavigation="$b">
    </graph>
    <booleaninput name="b" />
    <copy prop="showNavigation" target="_graph1" assignNames="ba" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    // not sure what to test as don't know how to check renderer...
    cy.get('#\\/ba').should('have.text', 'false')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.showNavigation).eq(false);
    })


    cy.get('#\\/b_input').click();

    cy.get('#\\/ba').should('have.text', 'true')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.showNavigation).eq(true);
    })

    cy.get('#\\/b_input').click();

    cy.get('#\\/ba').should('have.text', 'false')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_graph1"].stateValues.showNavigation).eq(false);
    })


  });

  it('display digits and decimals, overwrite in copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <graph name="g" size="small" xmin="-45.03232523423" xmax="8.2857234234" ymin="-5.582342383823423" ymax="7.83710375032" />
    <graph name="gdg3" displayDigits="3" copySource="g" />
    <graph name="gdc5" displayDecimals="5" copySource="g" />
    <graph name="gdg3a" displayDigits="3" copySource="gdc5" />
    <graph name="gdc5a" displayDecimals="5" copySource="gdg3" />
    <graph name="gdg3b" displayDigits="3" copySource="gdc5a" />
    <graph name="gdc5b" displayDecimals="5" copySource="gdg3a" />

    <p name="p">$g.xmin, $g.xmax, $g.ymin, $g.ymax</p>

    <p name="pdg3">$gdg3.xmin, $gdg3.xmax, $gdg3.ymin, $gdg3.ymax</p>
    <p name="pdg3a">$gdg3a.xmin, $gdg3a.xmax, $gdg3a.ymin, $gdg3a.ymax</p>
    <p name="pdg3b">$gdg3b.xmin, $gdg3b.xmax, $gdg3b.ymin, $gdg3b.ymax</p>
    <p name="pdg3c">$g{displayDigits="3"}.xmin, $g{displayDigits="3"}.xmax, $g{displayDigits="3"}.ymin, $g{displayDigits="3"}.ymax</p>
    <p name="pdg3d">$gdc5{displayDigits="3"}.xmin, $gdc5{displayDigits="3"}.xmax, $gdc5{displayDigits="3"}.ymin, $gdc5{displayDigits="3"}.ymax</p>

    <p name="pdc5">$gdc5.xmin, $gdc5.xmax, $gdc5.ymin, $gdc5.ymax</p>
    <p name="pdc5a">$gdc5a.xmin, $gdc5a.xmax, $gdc5a.ymin, $gdc5a.ymax</p>
    <p name="pdc5b">$gdc5b.xmin, $gdc5b.xmax, $gdc5b.ymin, $gdc5b.ymax</p>
    <p name="pdc5c">$g{displayDecimals="5"}.xmin, $g{displayDecimals="5"}.xmax, $g{displayDecimals="5"}.ymin, $g{displayDecimals="5"}.ymax</p>
    <p name="pdc5d">$gdg3{displayDecimals="5"}.xmin, $gdg3{displayDecimals="5"}.xmax, $gdg3{displayDecimals="5"}.ymin, $gdg3{displayDecimals="5"}.ymax</p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p').should('have.text', '-45.03232523, 8.285723423, -5.582342384, 7.83710375')
    cy.get('#\\/pdg3').should('have.text', '-45, 8.29, -5.58, 7.84')
    cy.get('#\\/pdg3b').should('have.text', '-45, 8.29, -5.58, 7.84')
    cy.get('#\\/pdg3c').should('have.text', '-45, 8.29, -5.58, 7.84')
    cy.get('#\\/pdg3d').should('have.text', '-45, 8.29, -5.58, 7.84')
    cy.get('#\\/pdc5').should('have.text', '-45.03233, 8.28572, -5.58234, 7.8371')
    cy.get('#\\/pdc5b').should('have.text', '-45.03233, 8.28572, -5.58234, 7.8371')
    cy.get('#\\/pdc5c').should('have.text', '-45.03233, 8.28572, -5.58234, 7.8371')
    cy.get('#\\/pdc5d').should('have.text', '-45.03233, 8.28572, -5.58234, 7.8371')


  });

});