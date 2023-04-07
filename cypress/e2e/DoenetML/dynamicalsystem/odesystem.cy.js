import { createFunctionFromDefinition } from "../../../../src/Core/utils/function";

describe('ODEsystem Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/src/Tools/cypressTest/')

  })

  it('1D linear system', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>a = <mathinput name="a" prefill="1"/></p>
    <p>initial condition = <mathinput name="ic" prefill="1"/></p>
    <p>tol = <mathinput name="tol" parseScientificNotation prefill="1E-6"/></p>
    <odesystem name="ode" tolerance="$tol" initialconditions="$ic">
    <righthandside simplify>$a x</righthandside>

    </odesystem>

    <graph>
    <copy prop="numericalsolution" target="ode" assignNames="f" />
    <point x='$zeroFixed' y='$ic' />
    </graph>

    <p><aslist><map>
      <template><evaluate function="$f" input="$v" /></template>
      <sources alias="v">
        <sequence from="0" to="5" step="0.5" />
      </sources>
    </map></aslist></p>

    <number fixed hide name="zeroFixed">0</number>
    <copy prop="value" target="tol" assignNames="tol2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    let ic = 1, a = 1, tol = 1e-6;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);

      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }

    });


    cy.log("Change initial condition")
    cy.get('#\\/ic textarea').type(`{end}{backspace}3{enter}`, { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=xx(0)=3')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      ic = 3;

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }

    });

    cy.log("Change parameter")
    cy.get('#\\/a textarea').type(`{end}{backspace}-2{enter}`, { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=−2xx(0)=3')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace('−', '-').trim()).equal('dxdt=-2xx(0)=3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      a = -2;

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }

    });


    cy.log("Change ic with point")
    cy.window().then(async (win) => {
      ic = -5;

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { y: ic }
      });

      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }

    });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=−2xx(0)=−5')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=-2xx(0)=-5')
    })


    cy.log("Change tolerance")
    cy.get('#\\/tol textarea').type(`{ctrl+home}{shift+end}{backspace}1E-10{enter}`, { force: true });

    cy.get('#\\/tol2 .mjx-mrow').should('contain.text', '1⋅10−10')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=-2xx(0)=-5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      tol = 1E-10;

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }

    });


    cy.log("Change parameter again")
    cy.get('#\\/a textarea').type(`{end}{backspace}{backspace}0.5{enter}`, { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=0.5xx(0)=−5')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=0.5xx(0)=-5')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      a = 0.5;

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
        expect(solutionsFromCore[2 * x]).eq(solutionF(x));
      }

    });

    cy.log("Change initial condition to zero")
    cy.get('#\\/ic textarea').type(`{end}{backspace}{backspace}0{enter}`, { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=0.5xx(0)=0')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=0.5xx(0)=0')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      for (let x = 0; x <= 1000; x += 100) {
        expect(solutionF(x)).eq(0);
      }
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionsFromCore[2 * x]).eq(0);
      }
    });

  });

  it('effect of max iterations, chunksize', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>tol = <mathinput name="tol" parseScientificNotation prefill="1E-6"/></p>
  <p>T = <mathinput name="T" prefill="10"/></p>
  <p>maxiter = <mathinput name="maxiter" prefill="1000"/></p>
  <p>chunksize = <mathinput name="chunksize" prefill="10"/></p>
  <odesystem name="ode" initialconditions="1" maxiterations="$maxiter" tolerance="$tol" chunksize="$chunksize">
    <righthandside>x</righthandside>
  </odesystem>

  <p><m>f($T) = $$(ode.numericalSolution)($T)
  </m></p>


  <copy prop="value" target="tol" assignNames="tol2" />
  <copy prop="value" target="T" assignNames="T2" />
  <copy prop="value" target="maxiter" assignNames="maxiter2" />
  <copy prop="value" target="chunksize" assignNames="chunksize2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let tol = 1E-6;
    let expectedF = x => Math.exp(x);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(10), tol * expectedF(10));
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      for (let x = 0; x <= 10; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.log("Can't make it to t=20");
    cy.get('#\\/T textarea').type(`{end}{backspace}{backspace}20{enter}`, { force: true });

    cy.get('#\\/T2 .mjx-mrow').should('contain.text', '20')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[1].trim()).eq("NaN");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      assert.isNaN(solutionF(20));

    });

    cy.log("increase maxiterations");
    cy.get('#\\/maxiter textarea').type(`{ctrl+home}{shift+end}{backspace}2000{enter}`, { force: true });

    cy.get('#\\/maxiter2 .mjx-mrow').should('contain.text', '2000')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(20), tol * expectedF(20));
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.log("Can't make it if decrease tolerance");
    cy.get('#\\/tol textarea').type(`{ctrl+home}{shift+end}{backspace}1E-8{enter}`, { force: true });

    cy.get('#\\/tol2 .mjx-mrow').should('contain.text', '1⋅10−8')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[1].trim()).eq("NaN");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      assert.isNaN(solutionF(20));

    });


    cy.log("increase maxiterations further");
    cy.get('#\\/maxiter textarea').type(`{ctrl+home}{shift+end}{backspace}5000{enter}`, { force: true });

    cy.get('#\\/maxiter2 .mjx-mrow').should('contain.text', '5000')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(20), tol * expectedF(20));
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


    cy.log("decrease maxiterations back down");
    cy.get('#\\/maxiter textarea').type(`{ctrl+home}{shift+end}{backspace}1000{enter}`, { force: true });


    cy.get('#\\/maxiter2 .mjx-mrow').should('contain.text', '1000')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[1].trim()).eq("NaN");
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      assert.isNaN(solutionF(20));

    });


    cy.log("decrease chunksize");
    cy.get('#\\/chunksize textarea').type(`{end}{backspace}{backspace}1{enter}`, { force: true });

    cy.get('#\\/chunksize2 .mjx-mrow').should('not.contain.text', '10')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(20), tol * expectedF(20));
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


  })

  it('change variables 1D', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>independent variable = <mathinput name="ivar" prefill="t"/></p>
  <p>dependent variable = <mathinput name="dvar" prefill="x"/></p>
  
  <odesystem name="ode" initialconditions="1" independentvariable="$ivar" variables="$dvar">
  <righthandside>$dvar</righthandside>
  </odesystem>

  <graph>
  <copy prop="numericalsolution" target="ode" assignNames="f" />
  </graph>


  <p><aslist><map>
    <template><evaluate function="$f" input="$v" /></template>
    <sources alias="v">
      <sequence from="0" to="5" />
    </sources>
  </map></aslist></p>

  <copy prop="value" target="ivar" assignNames="ivar2" />
  <copy prop="value" target="dvar" assignNames="dvar2" />
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let tol = 1e-6;
    let expectedF = x => Math.exp(x);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);

      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }

    });

    cy.log("change independent variable");
    cy.get('#\\/ivar textarea').type(`{end}{backspace}s{enter}`, { force: true });

    cy.get('#\\/ivar2 .mjx-mrow').should('contain.text', 's')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxds=xx(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }

    });

    cy.log("erase independent variable");
    cy.get('#\\/ivar textarea').type('{end}{backspace}{enter}', { force: true });

    cy.get('#\\/ivar2 .mjx-mrow').should('contain.text', '＿')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxd＿=xx(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("restore independent variable");
    cy.get('#\\/ivar textarea').type('{end}{backspace}u{enter}', { force: true });

    cy.get('#\\/ivar2 .mjx-mrow').should('contain.text', 'u')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdu=xx(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });


    cy.log("invalid independent variable");
    cy.get('#\\/ivar textarea').type('{end}{backspace}1{enter}', { force: true });

    cy.get('#\\/ivar2 .mjx-mrow').should('contain.text', '1')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxd1=xx(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("restore independent variable");
    cy.get('#\\/ivar textarea').type('{end}{backspace}v{enter}', { force: true });

    cy.get('#\\/ivar2 .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdv=xx(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

    cy.log("change dependent variable");
    cy.get('#\\/dvar textarea').type('{end}{backspace}z{enter}', { force: true });

    cy.get('#\\/dvar2 .mjx-mrow').should('contain.text', 'z')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dzdv=zz(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });


    cy.log("duplicate variable");
    cy.get('#\\/dvar textarea').type('{end}{backspace}v{enter}', { force: true });

    cy.get('#\\/dvar2 .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdv=vv(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });


    cy.log("different dependent variable");
    cy.get('#\\/dvar textarea').type('{end}{backspace}v_1{enter}', { force: true });

    cy.get('#\\/dvar2 .mjx-mrow').should('contain.text', 'v1')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dv1dv=v1v1(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });


    cy.log("invalid dependent variable");
    cy.get('#\\/dvar textarea').type('{ctrl+home}{shift+end}{backspace}ab{enter}', { force: true });

    cy.get('#\\/dvar2 .mjx-mrow').should('contain.text', 'ab')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dabdv=abab(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
        assert.isNaN(solutionsFromCore[t]);
      }
    });

    cy.log("restore dependent variable");
    cy.get('#\\/dvar textarea').type('{end}{backspace}{backspace}a{enter}', { force: true });

    cy.get('#\\/dvar2 .mjx-mrow').should('not.contain.text', 'ab')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dadv=aa(0)=1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let solutionF = createFunctionFromDefinition(stateVariables['/ode'].stateValues.numericalSolutionFDefinitions[0]);
      let solutionsFromCore = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      expect(solutionF(0)).eq(1);
      expect(solutionsFromCore[0]).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
        expect(solutionsFromCore[t]).eq(solutionF(t));
      }
    });

  })

  it('display digits', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>displaydigits = <mathinput name="digits" prefill="10"/></p>

  <odesystem name="ode" displaydigits="$digits" initialconditions="9.87654321987654321">
  <righthandside>0.123456789123456789x</righthandside>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=0.1234567891xx(0)=9.87654322')
    })

    cy.log('change display digits')
    cy.get('#\\/digits textarea').type('{end}{backspace}{backspace}2{enter}', { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=0.12xx(0)=9.9')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=0.12xx(0)=9.9')
    })

    cy.log('change display digits again')
    cy.get('#\\/digits textarea').type('{end}{backspace}14{enter}', { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=0.12345678912346xx(0)=9.8765432198765')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=0.12345678912346xx(0)=9.8765432198765')
    })


  })

  it('initial independent variable value', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>initial t = <mathinput name="t0" prefill="0"/></p>
  <p>final t = <mathinput name="tf" prefill="10"/></p>
  
  <odesystem name="ode" initialconditions="1" initialIndependentVariableValue="$t0">
    <righthandside>x</righthandside>
  </odesystem>

  <p>We started with 
  <m>x(<copy prop="initialindependentvariablevalue" target="ode"/>) = 1</m>.</p>

  <p>We end with
  <m>x($tf) = $$(ode.numericalSolution)($tf)</m></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x(0)=1')
    })

    cy.get('#\\/_m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[0].trim()).equal('x(10)')
      expect(Number(text.split('=')[1])).closeTo(Math.exp(10), 1E-6 * Math.exp(10));
    })

    cy.log("Change initial time");
    cy.get('#\\/t0 textarea').type('{end}{backspace}-5{enter}', { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=xx(−5)=1')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(−5)=1')
    })

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x(−5)=1')
    })

    cy.get('#\\/_m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[0].trim()).equal('x(10)')
      expect(Number(text.split('=')[1])).closeTo(Math.exp(15), 1E-6 * Math.exp(15));
    })

    cy.log("Change initial and final time");
    cy.get('#\\/tf textarea').type('{end}{backspace}{backspace}12{enter}', { force: true });
    cy.get('#\\/t0 textarea').type('{end}{backspace}{backspace}11{enter}', { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=xx(11)=1')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(11)=1')
    })

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x(11)=1')
    })

    cy.get('#\\/_m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[0].trim()).equal('x(12)')
      expect(Number(text.split('=')[1])).closeTo(Math.exp(1), 1E-6 * Math.exp(1));
    })


  })

  it('display initial conditions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>display initial conditions: <booleaninput name="showic" prefill="true"/></p>  
  <odesystem name="ode" initialconditions="1" hideInitialCondition="!$showic">
    <righthandside>x</righthandside>
  </odesystem>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    cy.log("don't display initial conditions");
    cy.get('#\\/showic').click();
    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=x')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x')
    })

    cy.log("display initial conditions again");
    cy.get('#\\/showic').click();
    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=xx(0)=1')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

  })

  it('2D linear system', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>initial condition 1 = <mathinput name="ic1" prefill="1"/></p>
  <p>initial condition 2 = <mathinput name="ic2" prefill="3"/></p>
  <odesystem name="ode" initialconditions="$ic1 $ic2">
  <righthandside>-0.2y</righthandside>
  <righthandside>0.1x + 0.3y</righthandside>
  </odesystem>

  <graph>
    <curve parmin="0" parmax="10">
      <copy prop="numericalsolutions" target="ode" assignNames="f1 f2" />
    </curve>
    <point x="$ic1" y="$ic2" />
  </graph>

  <p><aslist><map>
    <template><evaluate function="$f1" input="$v" /><evaluate function="$f2" input="$v" /></template>
    <sources alias="v">
      <sequence from="0" to="10" />
    </sources>
  </map></aslist></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let tol = 1e-6;

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=1y(0)=3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ode = stateVariables['/ode'];
      let solutionFx = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[0]);
      let solutionFy = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[1]);
      let solutionFx2 = createFunctionFromDefinition(stateVariables["/f1"].stateValues.fDefinitions[0]);
      let solutionFy2 = createFunctionFromDefinition(stateVariables["/f2"].stateValues.fDefinitions[0]);
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[1].componentName].stateValues.value);
      let expectedFx = t => 8 * Math.exp(0.1 * t) - 7 * Math.exp(0.2 * t);
      let expectedFy = t => -4 * Math.exp(0.1 * t) + 7 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(expectedFx(t), tol * Math.max(1, Math.abs(expectedFx(t))));
        expect(solutionFy(t)).closeTo(expectedFy(t), tol * Math.max(1, Math.abs(expectedFy(t))));
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }

    });


    cy.log("Change initial condition")
    cy.get('#\\/ic1 textarea').type(`{end}{backspace}3{enter}`, { force: true });
    cy.get('#\\/ic2 textarea').type(`{end}{backspace}-1{enter}`, { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=−0.2ydydt=0.1x+0.3yx(0)=3y(0)=−1')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=3y(0)=-1')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ode = stateVariables['/ode'];
      let solutionFx = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[0]);
      let solutionFy = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[1]);
      let solutionFx2 = createFunctionFromDefinition(stateVariables["/f1"].stateValues.fDefinitions[0]);
      let solutionFy2 = createFunctionFromDefinition(stateVariables["/f2"].stateValues.fDefinitions[0]);
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[1].componentName].stateValues.value);
      let expectedFx = t => 4 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
      let expectedFy = t => -2 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(expectedFx(t), tol * Math.max(1, Math.abs(expectedFx(t))));
        expect(solutionFy(t)).closeTo(expectedFy(t), tol * Math.max(1, Math.abs(expectedFy(t))));
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }

    });


    cy.log("Change ic with point")
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: -5, y: 2 }
      });

      let stateVariables = await win.returnAllStateVariables1();

      let ode = stateVariables['/ode'];
      let solutionFx = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[0]);
      let solutionFy = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[1]);
      let solutionFx2 = createFunctionFromDefinition(stateVariables["/f1"].stateValues.fDefinitions[0]);
      let solutionFy2 = createFunctionFromDefinition(stateVariables["/f2"].stateValues.fDefinitions[0]);
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[1].componentName].stateValues.value);
      let expectedFx = t => -6 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
      let expectedFy = t => 3 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(expectedFx(t), tol * Math.max(1, Math.abs(expectedFx(t))));
        expect(solutionFy(t)).closeTo(expectedFy(t), tol * Math.max(1, Math.abs(expectedFy(t))));
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }

    });

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=-5y(0)=2')
    })


    cy.log("Change initial condition to zero")
    cy.get('#\\/ic1 textarea').type(`{end}{backspace}{backspace}0{enter}`, { force: true });
    cy.get('#\\/ic2 textarea').type(`{end}{backspace}0{enter}`, { force: true });

    cy.get('#\\/ode .mjx-mrow').should('contain.text', 'dxdt=−0.2ydydt=0.1x+0.3yx(0)=0y(0)=0')
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=0y(0)=0')
    })


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let ode = stateVariables['/ode'];
      let solutionFx = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[0]);
      let solutionFy = createFunctionFromDefinition(ode.stateValues.numericalSolutionFDefinitions[1]);
      let solutionFx2 = createFunctionFromDefinition(stateVariables["/f1"].stateValues.fDefinitions[0]);
      let solutionFy2 = createFunctionFromDefinition(stateVariables["/f2"].stateValues.fDefinitions[0]);
      let solutionsFromCoreX = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[0].componentName].stateValues.value);
      let solutionsFromCoreY = stateVariables["/_map1"].replacements.map(x => stateVariables[stateVariables[x.componentName].replacements[1].componentName].stateValues.value);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).eq(0);
        expect(solutionFy(t)).eq(0);
        expect(solutionFx2(t)).eq(solutionFx(t));
        expect(solutionFy2(t)).eq(solutionFy(t));
        expect(solutionsFromCoreX[t]).eq(solutionFx(t));
        expect(solutionsFromCoreY[t]).eq(solutionFy(t));
      }

    });

  });


  it('higher dimensional ode', () => {

    cy.log("no variables specified")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <odesystem initialconditions="a b c d e f">
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    let disp = function (vs, rs, is) {
      let s = "";
      for (let i = 0; i < vs.length; i++) {
        s += "d" + vs[i] + "dt=" + rs[i];
      }
      for (let i = 0; i < vs.length; i++) {
        s += vs[i] + "(0)=" + is[i];
      }
      return s;
    }

    let vs = ["x1", "x2", "x3", "x4", "x5", "x6"];
    let rs = ["q", "r", "s", "u", "v", "w"];
    let is = ["a", "b", "c", "d", "e", "f"]

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.log("all variables specified")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <odesystem initialconditions="a b c d e f" variables="j k l m n p">
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b')  // to wait for page to load

    let vs2 = ["j", "k", "l", "m", "n", "p"];

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {

      expect(text.trim()).equal(disp(vs2, rs, is))
    })


    cy.log("some variables specified")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <odesystem initialconditions="a b c d e f" variables="j k l">
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c')  // to wait for page to load

    let vs3 = ["j", "k", "l", "x4", "x5", "x6"];

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {

      expect(text.trim()).equal(disp(vs3, rs, is))
    })

  })

  it('copy righthandside, initial conditions', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <odesystem name="ode" initialconditions="c 3">
  <righthandside>a*x*y+z</righthandside>
  <righthandside>x/y</righthandside>
  </odesystem>

  <p>RHS1: <copy name="rhs1a" prop="rhs1" target="ode" /></p>
  <p>RHS2: <copy name="rhs2a" prop="rhs2" target="ode" /></p>
  <p>RHS1: <copy name="rhs1b" prop="rhs" target="ode" /></p>
  <p>Both RHSs: <aslist><copy name="rhssa" prop="rhss" target="ode" /></aslist></p>
  <p>RHS1: <copy name="rhs1c" prop="righthandside1" target="ode" /></p>
  <p>RHS2: <copy name="rhs2b" prop="righthandside2" target="ode" /></p>
  <p>RHS1: <copy name="rhs1d" prop="righthandside" target="ode" /></p>
  <p>Both RHSs: <aslist><copy name="rhssb" prop="righthandsides" target="ode" /></aslist></p>
  
  <p>IC1: <copy name="ic1a" prop="initialcondition1" target="ode" /></p>
  <p>IC2: <copy name="ic2a" prop="initialcondition2" target="ode" /></p>
  <p>IC1: <copy name="ic1b" prop="initialcondition" target="ode" /></p>
  <p>Both ICs: <aslist><copy name="icsa" prop="initialconditions" target="ode" /></aslist></p>

  <p>Swap right hand sides and keep initial conditions</p>

  <odesystem name="odeswap" initialconditions="$(ode.initialconditions)">
    <righthandside><copy prop="rhs2" target="ode" /></righthandside>
    <righthandside><copy prop="rhs1" target="ode" /></righthandside>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('axy+z')
    })
    cy.get('#\\/_p2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/_p3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('axy+z')
    })
    cy.get('#\\/_p4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('axy+z')
    })
    cy.get('#\\/_p4 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('axy+z')
    })
    cy.get('#\\/_p6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/_p7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('axy+z')
    })
    cy.get('#\\/_p8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('axy+z')
    })
    cy.get('#\\/_p8 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('xy')
    })
    cy.get('#\\/_p9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })
    cy.get('#\\/_p10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#\\/_p11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })
    cy.get('#\\/_p12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('c')
    })
    cy.get('#\\/_p12 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.get('#\\/odeswap').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xydydt=axy+zx(0)=cy(0)=3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let rhs1tree = ['+', ['*', 'a', 'x', 'y'], 'z'];
      let rhs2tree = ['/', 'x', 'y'];
      expect(stateVariables[stateVariables['/rhs1a'].replacements[0].componentName].stateValues.value).eqls(rhs1tree);
      expect(stateVariables[stateVariables['/rhs1b'].replacements[0].componentName].stateValues.value).eqls(rhs1tree);
      expect(stateVariables[stateVariables['/rhs1c'].replacements[0].componentName].stateValues.value).eqls(rhs1tree);
      expect(stateVariables[stateVariables['/rhs1d'].replacements[0].componentName].stateValues.value).eqls(rhs1tree);
      expect(stateVariables[stateVariables['/rhs2a'].replacements[0].componentName].stateValues.value).eqls(rhs2tree);
      expect(stateVariables[stateVariables['/rhs2b'].replacements[0].componentName].stateValues.value).eqls(rhs2tree);
      expect(stateVariables[stateVariables['/rhssa'].replacements[0].componentName].stateValues.value).eqls(rhs1tree);
      expect(stateVariables[stateVariables['/rhssa'].replacements[1].componentName].stateValues.value).eqls(rhs2tree);
      expect(stateVariables[stateVariables['/rhssb'].replacements[0].componentName].stateValues.value).eqls(rhs1tree);
      expect(stateVariables[stateVariables['/rhssb'].replacements[1].componentName].stateValues.value).eqls(rhs2tree);
      expect(stateVariables[stateVariables['/ic1a'].replacements[0].componentName].stateValues.value).eqls('c');
      expect(stateVariables[stateVariables['/ic1b'].replacements[0].componentName].stateValues.value).eqls('c');
      expect(stateVariables[stateVariables['/ic2a'].replacements[0].componentName].stateValues.value).eqls(3);
      expect(stateVariables[stateVariables['/icsa'].replacements[0].componentName].stateValues.value).eqls('c');
      expect(stateVariables[stateVariables['/icsa'].replacements[1].componentName].stateValues.value).eqls(3);

    });


  });


})
