describe('ODEsystem Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('1D linear system', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>a = <mathinput name="a" prefill="1"/></p>
  <p>initial condition = <mathinput name="ic" prefill="1"/></p>
  <p>tol = <mathinput name="tol" prefill="1E-6"/></p>
  <odesystem name="ode">
  <tolerance><ref prop="value">tol</ref></tolerance>
  <righthandside simplify><ref prop="value">a</ref>x</righthandside>
  <initialcondition simplify><ref prop="value">ic</ref></initialcondition>
  </odesystem>

  <graph>
  <ref prop="numericalsolution">ode</ref>
  <point>
    <x fixed>0</x>
    <y><ref prop="value">ic</ref></y>
  </point>
  </graph>
  `}, "*");
    });

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    let ic = 1, a = 1, tol = 1e-6;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


    cy.log("Change initial condition")
    cy.get('#\\/ic_input').clear().type(`3{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=3')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      ic = 3;

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.log("Change parameter")
    cy.get('#\\/a_input').clear().type(`-2{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace('−', '-').trim()).equal('dxdt=-2xx(0)=3')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      a = -2;

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


    cy.log("Change ic with point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      ic = -5;

      components['/_point1'].movePoint({ y: ic });

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=-2xx(0)=-5')
    })


    cy.log("Change tolerance")
    cy.get('#\\/tol_input').clear().type(`1E-10{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=-2xx(0)=-5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      tol = 1E-10;

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


    cy.log("Change parameter again")
    cy.get('#\\/a_input').clear().type(`0.5{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=0.5xx(0)=-5')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      a = 0.5;

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      let expectedF = x => ic * Math.exp(a * x);
      for (let x = 0; x <= 5; x += 0.5) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.log("Change initial condition to zero")
    cy.get('#\\/ic_input').clear().type(`0{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.replace(/−/g, '-').trim()).equal('dxdt=0.5xx(0)=0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      for (let x = 0; x <= 1000; x += 100) {
        expect(solutionF(x)).eq(0);
      }

    });

  });

  it('effect of max iterations, chunksize', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>tol = <mathinput name="tol" prefill="1E-6"/></p>
  <p>T = <mathinput name="T" prefill="10"/></p>
  <p>maxiter = <mathinput name="maxiter" prefill="1000"/></p>
  <p>chunksize = <mathinput name="chunksize" prefill="10"/></p>
  <odesystem name="ode" initialcondition="1" righthandside="x">
    <maxiterations><ref prop="value">maxiter</ref></maxiterations>
    <tolerance><ref prop="value">tol</ref></tolerance>
    <chunksize><ref prop="value">chunksize</ref></chunksize>
  </odesystem>

  <p><m>f(<ref prop="value">T</ref>) =
    <evaluate>
      <ref prop="numericalsolution">ode</ref><ref prop="value">t</ref>
    </evaluate>
  </m></p>
  `}, "*");
    });

    let tol = 1E-6;
    let expectedF = x => Math.exp(x);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(10), tol * expectedF(10));
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      for (let x = 0; x <= 10; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.log("Can't make it to t=20");
    cy.get('#\\/t_input').clear().type(`20{enter}`);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[1].trim()).eq("NaN");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      assert.isNaN(solutionF(20));

    });

    cy.log("increase maxiterations");
    cy.get('#\\/maxiter_input').clear().type(`2000{enter}`);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(20), tol * expectedF(20));
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });

    cy.log("Can't make it if decrease tolerance");
    cy.get('#\\/tol_input').clear().type(`1E-8{enter}`);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[1].trim()).eq("NaN");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      assert.isNaN(solutionF(20));

    });


    cy.log("increase maxiterations further");
    cy.get('#\\/maxiter_input').clear().type(`5000{enter}`);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(20), tol * expectedF(20));
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


    cy.log("decrease maxiterations back down");
    cy.get('#\\/maxiter_input').clear().type(`1000{enter}`);


    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.split('=')[1].trim()).eq("NaN");
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      assert.isNaN(solutionF(20));

    });


    cy.log("decrease chunksize");
    cy.get('#\\/chunksize_input').clear().type(`1{enter}`);

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(Number(text.split('=')[1])).closeTo(expectedF(20), tol * expectedF(20));
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      for (let x = 0; x <= 20; x += 1) {
        expect(solutionF(x)).closeTo(expectedF(x), tol * Math.max(1, Math.abs(expectedF(x))));
      }

    });


  })

  it('change variables 1D', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>independent variable = <mathinput name="ivar" prefill="t"/></p>
  <p>dependent variable = <mathinput name="dvar" prefill="x"/></p>
  
  <odesystem name="ode" initialcondition="1">
  <independentvariable><ref prop="value">ivar</ref></independentvariable>
  <variables><ref prop="value">dvar</ref></variables>
  <righthandside><ref prop="value">dvar</ref></righthandside>
  </odesystem>

  <graph>
  <ref prop="numericalsolution">ode</ref>
  </graph>
  `}, "*");
    });

    let tol = 1e-6;
    let expectedF = x => Math.exp(x);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }

    });

    cy.log("change independent variable");
    cy.get('#\\/ivar_input').clear().type(`s{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxds=xx(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }

    });

    cy.log("erase independent variable");
    cy.get('#\\/ivar_input').clear().type('{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxd＿=xx(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
      }
    });

    cy.log("restore independent variable");
    cy.get('#\\/ivar_input').clear().type('u{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdu=xx(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }
    });


    cy.log("invalid independent variable");
    cy.get('#\\/ivar_input').clear().type('1{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxd1=xx(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
      }
    });

    cy.log("restore independent variable");
    cy.get('#\\/ivar_input').clear().type('v{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdv=xx(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }
    });

    cy.log("change dependent variable");
    cy.get('#\\/dvar_input').clear().type('z{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dzdv=zz(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }
    });


    cy.log("duplicate variable");
    cy.get('#\\/dvar_input').clear().type('v{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdv=vv(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
      }
    });


    cy.log("different dependent variable");
    cy.get('#\\/dvar_input').clear().type('v_1{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dv1dv=v1v1(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }
    });


    cy.log("invalid dependent variable");
    cy.get('#\\/dvar_input').clear().type('ab{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dabdv=abab(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        assert.isNaN(solutionF(t));
      }
    });

    cy.log("restore dependent variable");
    cy.get('#\\/dvar_input').clear().type('a{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dadv=aa(0)=1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionF = ode.state.numericalsolutions[0];
      expect(solutionF(0)).eq(1);
      for (let t = 1; t <= 5; t += 1) {
        expect(solutionF(t)).closeTo(expectedF(t), tol * Math.max(1, Math.abs(expectedF(t))));
      }
    });

  })

  it('display digits', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>displaydigits = <mathinput name="digits" prefill="10"/></p>
  
  <odesystem name="ode">
  <displaydigits><ref prop="value">digits</ref></displaydigits>
  <righthandside>0.123456789123456789x</righthandside>
  <initialcondition>9.87654321987654321</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=0.1234567891xx(0)=9.87654322')
    })

    cy.log('change display digits')
    cy.get('#\\/digits_input').clear().type('2{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=0.12xx(0)=9.9')
    })

    cy.log('change display digits again')
    cy.get('#\\/digits_input').clear().type('14{enter}');

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=0.12345678912346xx(0)=9.8765432198765')
    })


  })

  it('initial independent variable value', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>initial t = <mathinput name="t0" prefill="0"/></p>
  <p>final t = <mathinput name="tf" prefill="10"/></p>
  
  <odesystem name="ode" initialcondition="1" righthandside="x">
  <initialIndependentVariableValue><ref prop="value">t0</ref></initialIndependentVariableValue>
  </odesystem>

  <p>We started with 
  <m>x(<ref prop="initialindependentvariablevalue">ode</ref>) = 1</m>.</p>

  <p>We end with
  <m>x(<ref prop="value">tf</ref>) = 
  <evaluate><ref prop="numericalsolution">ode</ref><ref prop="value">tf</ref></evaluate>
  </m></p>
  `}, "*");
    });

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
    cy.get('#\\/t0_input').clear().type('-5{enter}');

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
    cy.get('#\\/t0_input').clear().type('11{enter}');
    cy.get('#\\/tf_input').clear().type('12{enter}');

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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>display initial conditions: <booleaninput name="showic" prefill="true"/></p>  
  <odesystem name="ode" initialcondition="1" righthandside="x">
  <hideInitialCondition><not><ref prop="value">showic</ref></not></hideInitialCondition>
  </odesystem>

  `}, "*");
    });

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

    cy.log("don't display initial conditions");
    cy.get('#\\/showic_input').click();
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x')
    })

    cy.log("display initial conditions again");
    cy.get('#\\/showic_input').click();
    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=xx(0)=1')
    })

  })

  it('2D linear system', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>initial condition 1 = <mathinput name="ic1" prefill="1"/></p>
  <p>initial condition 2 = <mathinput name="ic2" prefill="3"/></p>
  <odesystem name="ode">
  <righthandside>-0.2y</righthandside>
  <righthandside>0.1x + 0.3y</righthandside>
  <initialcondition><ref prop="value">ic1</ref></initialcondition>
  <initialcondition><ref prop="value">ic2</ref></initialcondition>
  </odesystem>

  <graph>
  <curve>
    <parmin>0</parmin>
    <parmax>10</parmax>
    <ref prop="numericalsolutions">ode</ref>
  </curve>
  <point>
    <x><ref prop="value">ic1</ref></x>
    <y><ref prop="value">ic2</ref></y>
  </point>
  </graph>
  `}, "*");
    });

    let tol = 1e-6;

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=1y(0)=3')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionFx = ode.state.numericalsolutions[0];
      let solutionFy = ode.state.numericalsolutions[1];
      let expectedFx = t => 8 * Math.exp(0.1 * t) - 7 * Math.exp(0.2 * t);
      let expectedFy = t => -4 * Math.exp(0.1 * t) + 7 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(expectedFx(t), tol * Math.max(1, Math.abs(expectedFx(t))));
        expect(solutionFy(t)).closeTo(expectedFy(t), tol * Math.max(1, Math.abs(expectedFy(t))));
      }

    });


    cy.log("Change initial condition")
    cy.get('#\\/ic1_input').clear().type(`3{enter}`);
    cy.get('#\\/ic2_input').clear().type(`-1{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=3y(0)=-1')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionFx = ode.state.numericalsolutions[0];
      let solutionFy = ode.state.numericalsolutions[1];
      let expectedFx = t => 4 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
      let expectedFy = t => -2 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(expectedFx(t), tol * Math.max(1, Math.abs(expectedFx(t))));
        expect(solutionFy(t)).closeTo(expectedFy(t), tol * Math.max(1, Math.abs(expectedFy(t))));
      }

    });


    cy.log("Change ic with point")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components['/_point1'].movePoint({ x: -5, y: 2 });

      let ode = components['/ode'];
      let solutionFx = ode.state.numericalsolutions[0];
      let solutionFy = ode.state.numericalsolutions[1];
      let expectedFx = t => -6 * Math.exp(0.1 * t) + 1 * Math.exp(0.2 * t);
      let expectedFy = t => 3 * Math.exp(0.1 * t) - 1 * Math.exp(0.2 * t);
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).closeTo(expectedFx(t), tol * Math.max(1, Math.abs(expectedFx(t))));
        expect(solutionFy(t)).closeTo(expectedFy(t), tol * Math.max(1, Math.abs(expectedFy(t))));
      }

    });

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=-5y(0)=2')
    })


    cy.log("Change initial condition to zero")
    cy.get('#\\/ic1_input').clear().type(`0{enter}`);
    cy.get('#\\/ic2_input').clear().type(`0{enter}`);

    cy.get('#\\/ode').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('dxdt=-0.2ydydt=0.1x+0.3yx(0)=0y(0)=0')
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let ode = components['/ode'];
      let solutionFx = ode.state.numericalsolutions[0];
      let solutionFy = ode.state.numericalsolutions[1];
      for (let t = 0; t <= 10; t += 1) {
        expect(solutionFx(t)).eq(0);
        expect(solutionFy(t)).eq(0);
      }

    });

  });

  it('match variables, two assigned in ode', () => {

    cy.log("assign two ode variables")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="var1" prefill="u"/>
  <mathinput name="var2" prefill="v"/>
  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/var1_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydvdt=4x+5yy(0)=av(0)=b')
    })

    cy.get('#\\/var2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.log("match first rhs variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <mathinput name="var1" prefill="u"/>
  <mathinput name="var2" prefill="v"/>
  <mathinput name="rvar" prefill="u"/>
  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dqdt=x+3yu(0)=av(0)=bq(0)=0')
    })

    cy.get('#\\/var2_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydqdt=x+3yu(0)=aq(0)=b')
    })

    cy.get('#\\/var1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=4x+5ydqdt=x+3yw(0)=aq(0)=b')
    })


    cy.log("match second rhs variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <mathinput name="var1" prefill="u"/>
  <mathinput name="var2" prefill="v"/>
  <mathinput name="rvar" prefill="u"/>
  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>
  <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dqdt=4x+5yu(0)=av(0)=bq(0)=0')
    })

    cy.get('#\\/var2_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydqdt=4x+5yu(0)=aq(0)=b')
    })

    cy.get('#\\/var1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=x+3ydqdt=4x+5yw(0)=aq(0)=b')
    })


    cy.log("match first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>d</text>
  <mathinput name="var1" prefill="u"/>
  <mathinput name="var2" prefill="v"/>
  <mathinput name="ivar" prefill="u"/>
  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'd')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydqdt=0u(0)=bv(0)=0q(0)=a')
    })

    cy.get('#\\/var2_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydqdt=4x+5yu(0)=bq(0)=a')
    })

    cy.get('#\\/var1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=x+3ydqdt=4x+5yw(0)=bq(0)=a')
    })


    cy.log("match second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>e</text>
  <mathinput name="var1" prefill="u"/>
  <mathinput name="var2" prefill="v"/>
  <mathinput name="ivar" prefill="u"/>
  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'e')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydqdt=0u(0)=av(0)=0q(0)=b')
    })

    cy.get('#\\/var2_input').clear().type('q{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydqdt=4x+5yu(0)=aq(0)=b')
    })

    cy.get('#\\/var1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=x+3ydqdt=4x+5yw(0)=aq(0)=b')
    })


    cy.log("match first rhs and initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>f</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="u"/>
  <odesystem variables="u,v">
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'f')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3yu(0)=bv(0)=aw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3yu(0)=av(0)=bw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3yu(0)=bv(0)=0w(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3ydxdt=0u(0)=bv(0)=0w(0)=0x(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=bv(0)=0x(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3ydxdt=0u(0)=bv(0)=0x(0)=a')
    })


    cy.log("match first rhs and second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>g</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="u"/>
  <odesystem variables="u,v">
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'g')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=bv(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3yu(0)=av(0)=bw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3yu(0)=bv(0)=aw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3yu(0)=av(0)=0w(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=0dwdt=x+3ydxdt=0u(0)=av(0)=0w(0)=0x(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=av(0)=0x(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3ydxdt=0u(0)=av(0)=0x(0)=b')
    })


    cy.log("match second rhs and first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>h</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="u"/>
  <odesystem variables="u,v">
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'h')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5yu(0)=bv(0)=aw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5yu(0)=av(0)=bw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5yu(0)=bv(0)=0w(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5ydxdt=0u(0)=bv(0)=0w(0)=0x(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3ydxdt=0u(0)=bv(0)=0x(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=bv(0)=0x(0)=a')
    })


    cy.log("match second rhs and initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>i</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="u"/>
  <odesystem variables="u,v">
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'i')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5yu(0)=av(0)=bw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5yu(0)=bv(0)=aw(0)=0')
    })

    cy.get('#\\/ivar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5yu(0)=av(0)=0w(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=0dwdt=4x+5ydxdt=0u(0)=av(0)=0w(0)=0x(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3ydxdt=0u(0)=av(0)=0x(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=av(0)=0x(0)=b')
    })


    cy.log("match all variables and initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>j</text>
  <mathinput name="var1" prefill="u"/>
  <mathinput name="var2" prefill="v"/>
  <mathinput name="rvar1" prefill="u"/>
  <mathinput name="rvar2" prefill="v"/>
  <mathinput name="ivar1" prefill="u"/>
  <mathinput name="ivar2" prefill="v"/>
  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>
    <variable><ref prop="value">rvar1</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>
    <variable><ref prop="value">rvar2</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar1</ref></variable>
    a
  </initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar2</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'j')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar1_input').clear().type('v{enter}');
    cy.get('#\\/rvar2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('v{enter}');
    cy.get('#\\/ivar2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydvdt=x+3yu(0)=bv(0)=a')
    })

    cy.get('#\\/var1_input').clear().type('v{enter}');
    cy.get('#\\/var2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydudt=4x+5yv(0)=au(0)=b')
    })

    cy.get('#\\/rvar1_input').clear().type('w{enter}');
    cy.get('#\\/rvar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=0dudt=0dwdt=x+3ydxdt=4x+5yv(0)=au(0)=bw(0)=0x(0)=0')
    })

    cy.get('#\\/ivar1_input').clear().type('y{enter}');
    cy.get('#\\/ivar2_input').clear().type('z{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=0dudt=0dwdt=x+3ydxdt=4x+5ydydt=0dzdt=0v(0)=0u(0)=0w(0)=0x(0)=0y(0)=az(0)=b')
    })

    cy.get('#\\/var1_input').clear().type('y{enter}');
    cy.get('#\\/var2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=0dxdt=4x+5ydwdt=x+3ydzdt=0y(0)=ax(0)=0w(0)=0z(0)=b')
    })

    cy.get('#\\/rvar1_input').clear().type('y{enter}');
    cy.get('#\\/ivar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

  });

  it('specify variables, none assigned in ode', () => {

    cy.log("no variables assigned")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })


    cy.log("specify first rhs variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <mathinput name="rvar" prefill="u"/>
  <odesystem>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })


    cy.log("specify second rhs variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <mathinput name="rvar" prefill="u"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydudt=4x+5yx(0)=au(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })


    cy.log("specify first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>d</text>
  <mathinput name="ivar" prefill="u"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'd')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })


    cy.log("specify second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>e</text>
  <mathinput name="ivar" prefill="u"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'e')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydudt=4x+5yx(0)=au(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })


    cy.log("specify both rhs variables")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>f</text>
  <mathinput name="rvar1" prefill="u"/>
  <mathinput name="rvar2" prefill="v"/>
  <odesystem>
  <righthandside>
    <variable><ref prop="value">rvar1</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>
    <variable><ref prop="value">rvar2</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'f')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })

    cy.get('#\\/rvar1_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })


    cy.log("specify both initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>g</text>
  <mathinput name="ivar1" prefill="u"/>
  <mathinput name="ivar2" prefill="v"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar1</ref></variable>
    a
  </initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar2</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'g')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })


    cy.log("specify first rhs and initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>h</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="v"/>
  <odesystem>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'h')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydxdt=4x+5yv(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('x{enter}');
    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })


    cy.log("specify second rhs and first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>i</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="v"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'i')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydudt=4x+5yv(0)=au(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydvdt=4x+5yx(0)=bv(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('x{enter}');
    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=by(0)=a')
    })


    cy.log("specify first rhs and second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>j</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="v"/>
  <odesystem>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'j')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydxdt=4x+5yv(0)=bx(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('x{enter}');
    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=by(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })


    cy.log("specify second rhs and initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>k</text>
  <mathinput name="rvar" prefill="u"/>
  <mathinput name="ivar" prefill="v"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'k')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydudt=4x+5yv(0)=bu(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydvdt=4x+5yx(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('x{enter}');
    cy.get('#\\/ivar_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })


    cy.log("specify both rhs variables and first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>l</text>
  <mathinput name="ivar" prefill="u"/>
  <odesystem>
  <righthandside variable="u">x + 3y</righthandside>
  <righthandside variable="v">4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'l')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0u(0)=bv(0)=0w(0)=a')
    })


    cy.log("specify both rhs variables and second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>m</text>
  <mathinput name="ivar" prefill="u"/>
  <odesystem>
  <righthandside variable="u">x + 3y</righthandside>
  <righthandside variable="v">4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'm')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0u(0)=av(0)=0w(0)=b')
    })


    cy.log("specify first rhs variable and both initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>n</text>
  <mathinput name="rvar" prefill="u"/>
  <odesystem>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition variable="u">a</initialcondition>
  <initialcondition variable="v">b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'n')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydudt=4x+5yv(0)=bu(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=x+3ydudt=4x+5ydvdt=0w(0)=0u(0)=av(0)=b')
    })


    cy.log("specify second rhs variable and both initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>o</text>
  <mathinput name="rvar" prefill="u"/>
  <odesystem>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition variable="u">a</initialcondition>
  <initialcondition variable="v">b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'o')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydudt=4x+5yv(0)=bu(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydwdt=4x+5ydvdt=0u(0)=aw(0)=0v(0)=b')
    })


    cy.log("specify all rhs variables and initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>p</text>
  <mathinput name="ivar1" prefill="u"/>
  <mathinput name="ivar2" prefill="v"/>
  <odesystem>
  <righthandside variable="u">x + 3y</righthandside>
  <righthandside variable="v">4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar1</ref></variable>
    a
  </initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar2</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'p')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0u(0)=0v(0)=bw(0)=a')
    })

    cy.get('#\\/ivar2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0u(0)=bv(0)=0w(0)=a')
    })

    cy.get('#\\/ivar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0dxdt=0u(0)=0v(0)=0w(0)=ax(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=av(0)=0x(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=0v(0)=ax(0)=b')
    })

    cy.get('#\\/ivar2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

  });

  it('match variables, one assigned in ode', () => {

    cy.log("assign one ode variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput name="var" prefill="q"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dqdt=x+3ydxdt=4x+5yq(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })


    cy.log("specify first rhs variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=4x+5ydydt=x+3yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydydt=x+3yu(0)=ay(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })


    cy.log("specify second rhs variable")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=4x+5ydydt=x+3yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=ay(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydxdt=x+3yu(0)=ax(0)=b')
    })


    cy.log("specify first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>d</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'd')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=by(0)=a')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=by(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })


    cy.log("specify second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>e</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'e')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=by(0)=a')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=ay(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=bx(0)=a')
    })


    cy.log("specify both rhs variables")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>f</text>
  <mathinput name="var" prefill="u"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside variable="u">x + 3y</righthandside>
  <righthandside variable="v">4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'f')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/var_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=4x+5ydudt=x+3yv(0)=au(0)=b')
    })

    cy.get('#\\/var_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=0dudt=x+3ydvdt=4x+5yw(0)=au(0)=bv(0)=0')
    })


    cy.log("specify both initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>g</text>
  <mathinput name="var" prefill="u"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition variable="u">a</initialcondition>
  <initialcondition variable="v">b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'g')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/var_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=x+3ydudt=4x+5yv(0)=bu(0)=a')
    })

    cy.get('#\\/var_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=x+3ydudt=4x+5ydvdt=0w(0)=0u(0)=av(0)=b')
    })


    cy.log("specify first rhs variable and initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>h</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'h')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=bx(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=4x+5ydydt=x+3yx(0)=by(0)=a')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydydt=x+3yu(0)=by(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=by(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=ax(0)=b')
    })


    cy.log("specify first rhs variable and second initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>i</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    x + 3y
  </righthandside>
  <righthandside>4x+5y</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
  b
  <variable><ref prop="value">ivar</ref></variable>
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'i')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=by(0)=a')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=4x+5ydydt=x+3yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydydt=x+3yu(0)=ay(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=ay(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydxdt=4x+5yu(0)=bx(0)=a')
    })


    cy.log("specify second rhs variable and first initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>j</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    a
  </initialcondition>
  <initialcondition>b</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'j')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=4x+5ydydt=x+3yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=bx(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=bx(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=ax(0)=b')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=by(0)=a')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=by(0)=a')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydydt=x+3yu(0)=by(0)=a')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydxdt=x+3yu(0)=ax(0)=b')
    })


    cy.log("specify second rhs variable and initial condition")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>k</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>x + 3y</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>
    4x+5y
  </righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'k')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=4x+5ydydt=x+3yx(0)=by(0)=a')
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=x+3ydxdt=4x+5yy(0)=ax(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=ax(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dydt=4x+5ydxdt=x+3yy(0)=bx(0)=a')
    })

    cy.get('#\\/var_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dxdt=x+3ydydt=4x+5yx(0)=ay(0)=b')
    })

    cy.get('#\\/var_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydydt=4x+5yu(0)=ay(0)=b')
    })

    cy.get('#\\/rvar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydydt=x+3yu(0)=ay(0)=b')
    })

    cy.get('#\\/ivar_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=4x+5ydxdt=x+3yu(0)=bx(0)=a')
    })


    cy.log("specify all rhs variables and initial conditions")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>l</text>
  <mathinput name="var" prefill="u"/>
  <mathinput name="ivar1" prefill="u"/>
  <mathinput name="ivar2" prefill="v"/>
  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside variable="u">x + 3y</righthandside>
  <righthandside variable="v">4x+5y</righthandside>
  <initialcondition>
    <variable><ref prop="value">ivar1</ref></variable>
    a
  </initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar2</ref></variable>
    b
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'l')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=av(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0u(0)=0v(0)=bw(0)=a')
    })

    cy.get('#\\/ivar2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0u(0)=bv(0)=0w(0)=a')
    })

    cy.get('#\\/ivar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydwdt=0dxdt=0u(0)=0v(0)=0w(0)=ax(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=av(0)=0x(0)=b')
    })

    cy.get('#\\/ivar1_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5ydxdt=0u(0)=0v(0)=ax(0)=b')
    })

    cy.get('#\\/ivar2_input').clear().type('u{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dudt=x+3ydvdt=4x+5yu(0)=bv(0)=a')
    })

    cy.get('#\\/var_input').clear().type('v{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dvdt=4x+5ydudt=x+3yv(0)=au(0)=b')
    })

    cy.get('#\\/var_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=0dudt=x+3ydvdt=4x+5yw(0)=0u(0)=bv(0)=a')
    })

    cy.get('#\\/ivar1_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=0dudt=x+3ydvdt=4x+5ydxdt=0w(0)=0u(0)=bv(0)=0x(0)=a')
    })

    cy.get('#\\/ivar2_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('dwdt=0dudt=x+3ydvdt=4x+5ydxdt=0dydt=0w(0)=0u(0)=0v(0)=0x(0)=ay(0)=b')
    })

  });

  it('specify variables, higher dimensional ode', () => {

    cy.log("no variables assigned")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <odesystem>
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  <initialcondition>c</initialcondition>
  <initialcondition>d</initialcondition>
  <initialcondition>e</initialcondition>
  <initialcondition>f</initialcondition>
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

    let vs = ["x", "y", "z", "x4", "x5", "x6"];
    let rs = ["q", "r", "s", "u", "v", "w"];
    let is = ["a", "b", "c", "d", "e", "f"]

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {

      expect(text.trim()).equal(disp(vs, rs, is))
    })


    cy.log("one variable each")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>b</text>
  <mathinput name="var" prefill="x"/>
  <mathinput name="rvar" prefill="x"/>
  <mathinput name="ivar" prefill="x"/>

  <odesystem>
  <variables><ref prop="value">var</ref></variables>
  <righthandside>q</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar</ref></variable>  
    r
  </righthandside>
  <righthandside>s</righthandside>
  <righthandside>u</righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar</ref></variable>  
    c
  </initialcondition>
  <initialcondition>d</initialcondition>
  <initialcondition>e</initialcondition>
  <initialcondition>f</initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "z", "x4", "x5", "x6"];
      rs = ["r", "q", "s", "u", "v", "w"];
      is = ["c", "a", "b", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["y", "x", "z", "x4", "x5", "x6"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "c", "b", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var_input').clear().type('x_4{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x4", "x", "y", "z", "x5", "x6"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "c", "b", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var_input').clear().type('m{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "x", "y", "z", "x4", "x5"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "c", "b", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "y", "x", "z", "x4", "x5"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar_input').clear().type('x_4{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "x4", "x", "y", "z", "x5"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar_input').clear().type('n{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "n", "x", "y", "z", "x4"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "n", "y", "x", "z", "x4"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar_input').clear().type('x_4{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "n", "x4", "x", "y", "z"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar_input').clear().type('p{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "n", "p", "x", "y", "z"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]

      expect(text.trim()).equal(disp(vs, rs, is))
    })


    cy.log("two variables each")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>c</text>
  <mathinput name="var1" prefill="x"/>
  <mathinput name="var2" prefill="y"/>
  <mathinput name="rvar1" prefill="x"/>
  <mathinput name="rvar2" prefill="y"/>
  <mathinput name="ivar1" prefill="x"/>
  <mathinput name="ivar2" prefill="y"/>

  <odesystem>
  <variables><ref prop="value">var1</ref><ref prop="value">var2</ref></variables>
  <righthandside>q</righthandside>
  <righthandside>r</righthandside>
  <righthandside>
    <variable><ref prop="value">rvar1</ref></variable>  
    s
  </righthandside>
  <righthandside>
    <variable><ref prop="value">rvar2</ref></variable>  
    u
  </righthandside>
  <righthandside>v</righthandside>
  <righthandside>w</righthandside>
  <initialcondition>a</initialcondition>
  <initialcondition>b</initialcondition>
  <initialcondition>c</initialcondition>
  <initialcondition>d</initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar1</ref></variable>  
    e
  </initialcondition>
  <initialcondition>
    <variable><ref prop="value">ivar2</ref></variable>  
    f
  </initialcondition>
  </odesystem>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'c')  // to wait for page to load

    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "z", "x4", "x5", "x6"];
      rs = ["s", "u", "q", "r", "v", "w"];
      is = ["e", "f", "a", "b", "c", "d"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar1_input').clear().type('z{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "x4", "x5", "x6", "z"];
      rs = ["s", "u", "q", "r", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar1_input').clear().type('x_4{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "z", "x5", "x6", "x4"];
      rs = ["s", "u", "q", "r", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar1_input').clear().type('m{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "z", "x4", "x5", "m"];
      rs = ["s", "u", "q", "r", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar2_input').clear().type('z{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "x4", "z", "x5", "m"];
      rs = ["s", "q", "r", "u", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar2_input').clear().type('m{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "z", "m", "x4", "x5"];
      rs = ["s", "q", "r", "u", "v", "w"];
      is = ["a", "f", "b", "e", "c", "d"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar2_input').clear().type('n{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["x", "y", "z", "n", "x4", "m"];
      rs = ["s", "q", "r", "u", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var1_input').clear().type('m{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["m", "y", "x", "n", "z", "x4"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["e", "f", "a", "b", "c", "d"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var1_input').clear().type('n{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["n", "y", "z", "x", "x4", "m"];
      rs = ["u", "q", "r", "s", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var1_input').clear().type('p{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "z", "m"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar2_input').clear().type('x{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "z", "m"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "f", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar2_input').clear().type('n{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "z", "m"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "f", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar2_input').clear().type('p{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "z", "m"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["f", "a", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/ivar2_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "m", "w"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar1_input').clear().type('p{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "m", "w"];
      rs = ["s", "q", "r", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar1_input').clear().type('y{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "x", "n", "m", "w"];
      rs = ["q", "s", "r", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar1_input').clear().type('m{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "m", "n", "x", "w"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "e", "c", "d", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar1_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "w", "n", "x", "m"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "f", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/rvar1_input').clear().type('z{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "y", "z", "n", "m", "w"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var2_input').clear().type('z{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "z", "x", "n", "m", "w"];
      rs = ["q", "s", "r", "u", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var2_input').clear().type('n{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "n", "x", "z", "m", "w"];
      rs = ["q", "u", "r", "s", "v", "w"];
      is = ["a", "b", "c", "d", "e", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var2_input').clear().type('m{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "m", "z", "n", "x", "w"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "e", "b", "c", "d", "f"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

    cy.get('#\\/var2_input').clear().type('w{enter}');
    cy.get('#\\/_odesystem1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      vs = ["p", "w", "z", "n", "x", "m"];
      rs = ["q", "r", "s", "u", "v", "w"];
      is = ["a", "f", "b", "c", "d", "e"]
      expect(text.trim()).equal(disp(vs, rs, is))
    })

  })

  it('ref righthandside, initial conditions', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <odesystem name="ode">
  <righthandside>a*x*y+z</righthandside>
  <righthandside>x/y</righthandside>
  <initialcondition>c</initialcondition>
  <initialcondition>3</initialcondition>
  </odesystem>

  <p>RHS1: <ref name="rhs1a" prop="rhs1">ode</ref></p>
  <p>RHS2: <ref name="rhs2a" prop="rhs2">ode</ref></p>
  <p>RHS1: <ref name="rhs1b" prop="rhs">ode</ref></p>
  <p>Both RHSs: <aslist><ref name="rhssa" prop="rhss">ode</ref></aslist></p>
  <p>RHS1: <ref name="rhs1c" prop="righthandside1">ode</ref></p>
  <p>RHS2: <ref name="rhs2b" prop="righthandside2">ode</ref></p>
  <p>RHS1: <ref name="rhs1d" prop="righthandside">ode</ref></p>
  <p>Both RHSs: <aslist><ref name="rhssb" prop="righthandsides">ode</ref></aslist></p>
  
  <p>IC1: <ref name="ic1a" prop="initialcondition1">ode</ref></p>
  <p>IC2: <ref name="ic2a" prop="initialcondition2">ode</ref></p>
  <p>IC2: <ref name="ic1b" prop="initialcondition">ode</ref></p>
  <p>Both ICs: <aslist><ref name="icsa" prop="initialconditions">ode</ref></aslist></p>

  <p>Swap right hand sides and keep initial conditions</p>

  <odesystem name="odeswap">
  <ref prop="rhs2">ode</ref>
  <ref prop="rhs1">ode</ref>
  <ref prop="initialconditions">ode</ref>
  </odesystem>
  `}, "*");
    });


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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let rhs1tree = ['+', ['*', 'a', 'x', 'y'], 'z'];
      let rhs2tree = ['/', 'x', 'y'];
      expect(components['/rhs1a'].replacements[0].state.value.tree).eqls(rhs1tree);
      expect(components['/rhs1b'].replacements[0].state.value.tree).eqls(rhs1tree);
      expect(components['/rhs1c'].replacements[0].state.value.tree).eqls(rhs1tree);
      expect(components['/rhs1d'].replacements[0].state.value.tree).eqls(rhs1tree);
      expect(components['/rhs2a'].replacements[0].state.value.tree).eqls(rhs2tree);
      expect(components['/rhs2b'].replacements[0].state.value.tree).eqls(rhs2tree);
      expect(components['/rhssa'].replacements[0].state.value.tree).eqls(rhs1tree);
      expect(components['/rhssa'].replacements[1].state.value.tree).eqls(rhs2tree);
      expect(components['/rhssb'].replacements[0].state.value.tree).eqls(rhs1tree);
      expect(components['/rhssb'].replacements[1].state.value.tree).eqls(rhs2tree);
      expect(components['/ic1a'].replacements[0].state.value.tree).eqls('c');
      expect(components['/ic1b'].replacements[0].state.value.tree).eqls('c');
      expect(components['/ic2a'].replacements[0].state.value.tree).eqls(3);
      expect(components['/icsa'].replacements[0].state.value.tree).eqls('c');
      expect(components['/icsa'].replacements[1].state.value.tree).eqls(3);

    });


  });


})
