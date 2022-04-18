describe('PeriodicSet Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('match given periodic set', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Offsets: <mathinput name="o"/></p>
    <p>Period: <mathinput name="p" /></p>
    <answer>
      <award>
        <when>
          <periodicSet name="s1"  offsets="$o" period="$p" />
          =
          <periodicSet name="s2"  offsets="pi/4 3pi/4" period="pi" />
        </when>
      </award>
    </answer>
    <p>Credit achieved: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    `}, "*");
    });


    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/s1'].stateValues.value)).eq('\uFF3F');

      let s2 = ['periodic_set'];
      s2.push(['tuple', ['/', 'pi', 4], 'pi', -Infinity, Infinity])
      s2.push(['tuple', ['/', ['*', 3, 'pi'], 4], 'pi', -Infinity, Infinity])
      expect((stateVariables['/s2'].stateValues.value)).eqls(s2);
      expect((stateVariables['/s2'].stateValues.nOffsets)).eq(2);
      expect((stateVariables['/s2'].stateValues.offsets)[0]).eqls(['/', 'pi', 4]);
      expect((stateVariables['/s2'].stateValues.offsets)[1]).eqls(['/', ['*', 3, 'pi'], 4]);
      expect(stateVariables['/s2'].stateValues.period).eq('pi');
      expect((stateVariables['/s2'].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Type in an offset and submit")
    cy.get('#\\/o textarea').type(`-pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/s1'].stateValues.value)).eq('\uFF3F');
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Type in a period and submit")
    cy.get('#\\/p textarea').type(`pi/2{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_correct').should('be.visible');

    cy.get('#\\/ca').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], -Infinity, Infinity])
      expect((stateVariables['/s1'].stateValues.value)).eqls(s1);
      expect((stateVariables['/s1'].stateValues.nOffsets)).eq(1);
      expect((stateVariables['/s1'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables['/s1'].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables['/s1'].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Change period to be irrational factor of other period")
    cy.get('#\\/p textarea').type(`{ctrl+home}{shift+end}{backspace}1{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 1, -Infinity, Infinity])
      expect((stateVariables['/s1'].stateValues.value)).eqls(s1);
      expect((stateVariables['/s1'].stateValues.nOffsets)).eq(1);
      expect((stateVariables['/s1'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables['/s1'].stateValues.period).eqls(1);
      expect((stateVariables['/s1'].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });


    cy.log("Change period")
    cy.get('#\\/p textarea').type(`{ctrl+home}{shift+end}{backspace}pi{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      expect((stateVariables['/s1'].stateValues.value)).eqls(s1);
      expect((stateVariables['/s1'].stateValues.nOffsets)).eq(1);
      expect((stateVariables['/s1'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables['/s1'].stateValues.period).eqls('pi');
      expect((stateVariables['/s1'].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add offset")
    cy.get('#\\/o textarea').type(`{end}, 5pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_correct').should('be.visible');
    cy.get('#\\/ca').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', -Infinity, Infinity])
      expect((stateVariables['/s1'].stateValues.value)).eqls(s1);
      expect((stateVariables['/s1'].stateValues.nOffsets)).eq(2);
      expect((stateVariables['/s1'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect((stateVariables['/s1'].stateValues.offsets)[1]).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(stateVariables['/s1'].stateValues.period).eqls('pi');
      expect((stateVariables['/s1'].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("add redundant offset")
    cy.get('#\\/o textarea').type(`{end}, pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_correct').should('be.visible');
    cy.get('#\\/ca').should('have.text', '1')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', 'pi', 4], 'pi', -Infinity, Infinity])
      expect((stateVariables['/s1'].stateValues.value)).eqls(s1);
      expect((stateVariables['/s1'].stateValues.nOffsets)).eq(3);
      expect((stateVariables['/s1'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect((stateVariables['/s1'].stateValues.offsets)[1]).eqls(['/', ['*', 5, 'pi'], 4]);
      expect((stateVariables['/s1'].stateValues.offsets)[2]).eqls(['/', 'pi', 4]);
      expect(stateVariables['/s1'].stateValues.period).eqls('pi');
      expect((stateVariables['/s1'].stateValues.redundantOffsets)).eq(true);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("add incorrect offset")
    cy.get('#\\/o textarea').type(`{end}, pi/2{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', 'pi', 4], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', 'pi', 2], 'pi', -Infinity, Infinity])
      expect((stateVariables['/s1'].stateValues.value)).eqls(s1);
      expect((stateVariables['/s1'].stateValues.nOffsets)).eq(4);
      expect((stateVariables['/s1'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect((stateVariables['/s1'].stateValues.offsets)[1]).eqls(['/', ['*', 5, 'pi'], 4]);
      expect((stateVariables['/s1'].stateValues.offsets)[2]).eqls(['/', 'pi', 4]);
      expect((stateVariables['/s1'].stateValues.offsets)[3]).eqls(['/', 'pi', 2]);
      expect(stateVariables['/s1'].stateValues.period).eqls('pi');
      expect((stateVariables['/s1'].stateValues.redundantOffsets)).eq(true);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add invalid math")
    cy.get('#\\/o textarea').type(`{end}, ({enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_answer1_incorrect').should('be.visible');
    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      expect((stateVariables['/s1'].stateValues.value)).eq('\uff3f');
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });


  });

  it('match copied periodic sets', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Offsets: <mathinput name="offsets" /></p>
    <p>Period: <mathinput name="period" /></p>
    
    <p>Offsets 2: <mathinput name="offsets2" /></p>
    <p>Period 2: <mathinput name="period2" /></p>
    
    <periodicSet name="a"  offsets="$offsets" period="$period" />
    <periodicSet name="b"  offsets="$offsets2" period="$period2" />
    
    <answer>
      <award>
        <when><copy name="a2" target="a" /> = <copy name="b2" target="b" /></when>
      </award>
    </answer>
    
    <p>Credit achieved: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    
    <p>Redundancies: <copy prop="redundantOffsets" target="a" />, <copy prop="redundantOffsets" target="b" />, <copy prop="redundantOffsets" target="a2" />, <copy prop="redundantOffsets" target="b2" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/ca').should('have.text', '0')
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/a'].stateValues.value)).eq('\uFF3F');
      expect((stateVariables['/b'].stateValues.value)).eq('\uFF3F');
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eq('\uFF3F');
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eq('\uFF3F');
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit offset for both")
    cy.get('#\\/offsets textarea').type(`-pi/4{enter}`, { force: true });
    cy.get('#\\/offsets2 textarea').type(`-pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_incorrect').should('be.visible');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/a'].stateValues.value)).eq('\uFF3F');
      expect((stateVariables['/b'].stateValues.value)).eq('\uFF3F');
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eq('\uFF3F');
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eq('\uFF3F');
      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit periods for both")
    cy.get('#\\/period textarea').type(`pi/2{enter}`, { force: true });
    cy.get('#\\/period2 textarea').type(`2pi{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/ca').should('have.text', '0')
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let a = ['periodic_set'];
      a.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], -Infinity, Infinity])
      expect((stateVariables['/a'].stateValues.value)).eqls(a);
      expect((stateVariables['/a'].stateValues.nOffsets)).eq(1);
      expect((stateVariables['/a'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables['/a'].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables['/a'].stateValues.redundantOffsets)).eq(false);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eqls(a);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.nOffsets)).eq(1);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(false);

      let b = ['periodic_set'];
      b.push(['tuple', ['-', ['/', 'pi', 4]], ['*', 2, 'pi'], -Infinity, Infinity])
      expect((stateVariables['/b'].stateValues.value)).eqls(b);
      expect((stateVariables['/b'].stateValues.nOffsets)).eq(1);
      expect((stateVariables['/b'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect((stateVariables['/b'].stateValues.redundantOffsets)).eq(false);
      expect(stateVariables['/b'].stateValues.period).eqls(['*', 2, 'pi']);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eqls(b);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.nOffsets)).eq(1);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.period).eqls(['*', 2, 'pi']);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Add offsets to match")
    cy.get('#\\/offsets2 textarea').type(`{end}, pi/4{rightArrow}, 11pi/4{rightArrow}, -11pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_correct').should('be.visible');

    cy.get('#\\/ca').should('have.text', '1')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let a = ['periodic_set'];
      a.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], -Infinity, Infinity])
      expect((stateVariables['/a'].stateValues.value)).eqls(a);
      expect((stateVariables['/a'].stateValues.nOffsets)).eq(1);
      expect((stateVariables['/a'].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables['/a'].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables['/a'].stateValues.redundantOffsets)).eq(false);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eqls(a);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.nOffsets)).eq(1);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(['-', ['/', 'pi', 4]]);
      expect(stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(false);

      let b = ['periodic_set'];

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset1, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset2, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset3, ['*', 2, 'pi'], -Infinity, Infinity])
      expect((stateVariables['/b'].stateValues.value)).eqls(b);
      expect((stateVariables['/b'].stateValues.nOffsets)).eq(4);
      expect((stateVariables['/b'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/b'].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables['/b'].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables['/b'].stateValues.offsets)[3]).eqls(offset3);
      expect((stateVariables['/b'].stateValues.redundantOffsets)).eq(false);
      expect(stateVariables['/b'].stateValues.period).eqls(['*', 2, 'pi']);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eqls(b);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.nOffsets)).eq(4);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[3]).eqls(offset3);
      expect(stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.period).eqls(['*', 2, 'pi']);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Add extra offsets")
    cy.get('#\\/offsets textarea').type(`{end}, -17pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_correct').should('be.visible');

    cy.get('#\\/ca').should('have.text', '1')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, false, true, false')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['periodic_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], -Infinity, Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], -Infinity, Infinity])
      expect((stateVariables['/a'].stateValues.value)).eqls(a);
      expect((stateVariables['/a'].stateValues.nOffsets)).eq(2);
      expect((stateVariables['/a'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/a'].stateValues.offsets)[1]).eqls(offset1);
      expect(stateVariables['/a'].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables['/a'].stateValues.redundantOffsets)).eq(true);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eqls(a);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.nOffsets)).eq(2);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect(stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(true);

      let b = ['periodic_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset1, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset2, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset3, ['*', 2, 'pi'], -Infinity, Infinity])
      expect((stateVariables['/b'].stateValues.value)).eqls(b);
      expect((stateVariables['/b'].stateValues.nOffsets)).eq(4);
      expect((stateVariables['/b'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/b'].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables['/b'].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables['/b'].stateValues.offsets)[3]).eqls(offset3);
      expect((stateVariables['/b'].stateValues.redundantOffsets)).eq(false);
      expect(stateVariables['/b'].stateValues.period).eqls(['*', 2, 'pi']);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eqls(b);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.nOffsets)).eq(4);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[3]).eqls(offset3);
      expect(stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.period).eqls(['*', 2, 'pi']);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(false);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("reduce period")
    cy.get('#\\/period2 textarea').type(`{end}{backspace}{backspace}pi{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_correct').should('be.visible');

    cy.get('#\\/ca').should('have.text', '1')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, true, true, true')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['periodic_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], -Infinity, Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], -Infinity, Infinity])
      expect((stateVariables['/a'].stateValues.value)).eqls(a);
      expect((stateVariables['/a'].stateValues.nOffsets)).eq(2);
      expect((stateVariables['/a'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/a'].stateValues.offsets)[1]).eqls(offset1);
      expect(stateVariables['/a'].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables['/a'].stateValues.redundantOffsets)).eq(true);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eqls(a);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.nOffsets)).eq(2);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect(stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(true);

      let b = ['periodic_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset1, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset2, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset3, 'pi', -Infinity, Infinity])
      expect((stateVariables['/b'].stateValues.value)).eqls(b);
      expect((stateVariables['/b'].stateValues.nOffsets)).eq(4);
      expect((stateVariables['/b'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/b'].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables['/b'].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables['/b'].stateValues.offsets)[3]).eqls(offset3);
      expect((stateVariables['/b'].stateValues.redundantOffsets)).eq(true);
      expect(stateVariables['/b'].stateValues.period).eqls('pi');
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eqls(b);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.nOffsets)).eq(4);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[3]).eqls(offset3);
      expect(stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.period).eqls('pi');
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(true);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("add incorrect offset")
    cy.get('#\\/offsets2 textarea').type(`{end}, 0{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_incorrect').should('be.visible');

    cy.get('#\\/ca').should('have.text', '0')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, true, true, true')


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['periodic_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], -Infinity, Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], -Infinity, Infinity])
      expect((stateVariables['/a'].stateValues.value)).eqls(a);
      expect((stateVariables['/a'].stateValues.nOffsets)).eq(2);
      expect((stateVariables['/a'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/a'].stateValues.offsets)[1]).eqls(offset1);
      expect(stateVariables['/a'].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables['/a'].stateValues.redundantOffsets)).eq(true);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.value)).eqls(a);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.nOffsets)).eq(2);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect(stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.period).eqls(['/', 'pi', 2]);
      expect((stateVariables[stateVariables['/a2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(true);

      let b = ['periodic_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];
      let offset4 = 0;

      b.push(['tuple', offset0, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset1, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset2, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset3, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset4, 'pi', -Infinity, Infinity])
      expect((stateVariables['/b'].stateValues.value)).eqls(b);
      expect((stateVariables['/b'].stateValues.nOffsets)).eq(5);
      expect((stateVariables['/b'].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables['/b'].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables['/b'].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables['/b'].stateValues.offsets)[3]).eqls(offset3);
      expect((stateVariables['/b'].stateValues.offsets)[4]).eqls(offset4);
      expect((stateVariables['/b'].stateValues.redundantOffsets)).eq(true);
      expect(stateVariables['/b'].stateValues.period).eqls('pi');
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.value)).eqls(b);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.nOffsets)).eq(5);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[0]).eqls(offset0);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[1]).eqls(offset1);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[2]).eqls(offset2);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[3]).eqls(offset3);
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.offsets)[4]).eqls(offset4);
      expect(stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.period).eqls('pi');
      expect((stateVariables[stateVariables['/b2'].replacements[0].componentName].stateValues.redundantOffsets)).eq(true);

      expect(stateVariables['/_answer1'].stateValues.creditAchieved).eq(0);
    });

  });

  it('partial credit with periodic set', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <mathlist name="correct_offsets" mergemathlists="true">30,150</mathlist>
      <copy prop="nComponents" target="correct_offsets" assignNames="n_correct_offsets" />
      <math name="correct_period">180</math>
      <periodicSet name="correct"  offsets="$correct_offsets" period="$correct_period" />
    </setup>
    <p>What is the period?
      <answer name="period">
        <mathinput name="period_input" />
        <award><when>
          <isinteger>$period_input/$correct_period</isinteger>
        </when></award>
      </answer>
    </p>

    <p>How many offsets? 
      <answer name="number_offsets">
        <mathinput name="number_offsets_input" />
        <award><when>
          <isinteger>$number_offsets_input</isinteger>
          and
          $number_offsets_input >= $period/$correct_period*$n_correct_offsets
        </when></award>  
      </answer> 
    </p>

    <p name="offset_p">Enter the offsets:
      <map assignNames="(mi1) (mi2) (mi3) (mi4) (mi5) (mi6) (mi7) (mi8) (mi9) (mi10)">
        <template>
          <mathinput />
        </template>
        <sources>
          <sequence length="$number_offsets" />
        </sources>
      </map>
    </p>

    <mathlist name="collected_offsets" hide>
      <collect componentTypes="mathinput" prop="value" target="offset_p" />
    </mathlist>

    <setup>
      <periodicSet offsets="$collected_offsets" period="$period" name="userPeriodicSet" />
      <conditionalContent hide assignNames="(maxCreditRedund)">
        <case condition="$(userPeriodicSet{prop='redundantOffsets'})">
          <number>0.8</number>
        </case>
        <else>
          <number>1</number>
        </else>
      </conditionalContent>
    </setup>
    
    <answer>
      <award>
        <when matchpartial="true">
          $userPeriodicSet = $correct
        </when>
      </award>
    </answer>


    <p>Answer when penalizing redundant offsets: 
      <answer>
        <award credit="$maxCreditRedund">
          <when matchPartial>
            $userPeriodicSet = $correct
          </when>
        </award>
        <award name="redund" credit="0">
          <when><copy prop="redundantOffsets" target="userPeriodicSet" /></when>
        </award>
        <considerAsResponses>
          $p$o
        </considerAsResponses>
      </answer>
    </p>

    `}, "*");
    });


    cy.get('#\\/_p1').should('contain.text', 'What is the period?')


    cy.log('partially correct answer')
    cy.get('#\\/period_input textarea').type('360{enter}', { force: true });
    cy.get('#\\/period_input_correct').should('be.visible');

    cy.get('#\\/number_offsets_input textarea').type('4{enter}', { force: true });
    cy.get('#\\/number_offsets_input_correct').should('be.visible');

    cy.get('#\\/mi1 textarea').type('30', { force: true }).blur();
    cy.get('#\\/mi2 textarea').type('150', { force: true }).blur();
    cy.get('#\\/mi3 textarea').type('210', { force: true }).blur();
    cy.get('#\\/mi4 textarea').type('211', { force: true }).blur();

    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '75')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '75')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.log('correct answer');

    cy.get('#\\/mi4 textarea').type('{ctrl+home}{shift+end}{backspace}-30', { force: true }).blur();

    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should('be.visible');

    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_correct').should('be.visible');


    cy.log('add extraneous answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}10', { force: true });
    cy.get('#\\/number_offsets_input_submit').should('be.visible');
    cy.get('#\\/number_offsets_input textarea').type('{enter}', { force: true });
    cy.get('#\\/number_offsets_input_correct').should('be.visible');

    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '40')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '40')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.log('add in a duplicate')
    cy.get('#\\/mi5 textarea').type('330', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '50')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '40')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })


    cy.log('fill in with duplicates')
    cy.get('#\\/mi6 textarea').type('330', { force: true }).blur();
    cy.get('#\\/mi7 textarea').type('330', { force: true }).blur();
    cy.get('#\\/mi8 textarea').type('330', { force: true }).blur();
    cy.get('#\\/mi9 textarea').type('330', { force: true }).blur();
    cy.get('#\\/mi10 textarea').type('330', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '80')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })

    cy.log('too few answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}{backspace}3', { force: true });
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_incorrect').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '75')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '75')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.get('#\\/mi3 textarea').type('{ctrl+home}{shift+end}{backspace}100', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '50')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '50')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('even fewer answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}2', { force: true });
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_incorrect').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '50')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '50')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('change period')
    cy.get('#\\/period_input textarea').type('{ctrl+home}{shift+end}{backspace}180', { force: true });
    cy.get('#\\/period_input_submit').click();
    cy.get('#\\/period_input_correct').should('be.visible');
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_correct').should("be.visible");

    cy.log('additional answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}3', { force: true });
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '67')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '67')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/mi3 textarea').type('{ctrl+home}{shift+end}{backspace}330', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '80')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })

    cy.log('change period')
    cy.get('#\\/period_input textarea').type('{ctrl+home}{shift+end}{backspace}90', { force: true });
    cy.get('#\\/period_input_submit').click();
    cy.get('#\\/period_input_incorrect').should('be.visible');
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '50')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '40')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/mi3 textarea').type('{ctrl+home}{shift+end}{backspace}100', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '33')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '33')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/mi3 textarea').type('{ctrl+home}{shift+end}{backspace}150', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').should('contain.text', '50')
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').should('contain.text', '40')
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })


  });

  it('display periodic set as list', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Period: <mathinput name="period" /></p>
    <p>Offsets: <mathinput name="offsets" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset" />
  
    <p>As list: <copy prop="asList" target="pset" assignNames="l1" /></p>

    <p>Min index: <mathinput name="minIndex" />, <mathinput name="maxIndex" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset2" minIndexAsList="$minIndex" maxIndexAsList="$maxIndex" />

    <p>As list with specified min/max: <copy prop="asList" target="pset2" assignNames="l2" /></p>

    <p><copy prop="value" target="offsets" assignNames="offsets2" /></p>

    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/l1").should('not.exist');
    cy.get("#\\/l2").should('not.exist');

    cy.get('#\\/period textarea').type('7{enter}', { force: true });
    cy.get('#\\/offsets textarea').type('1{enter}', { force: true });

    cy.get("#\\/l1").should('contain.text', '…,−6,1,8,…')
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,1,8,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,1,8,…')
    })

    cy.get('#\\/minIndex textarea').type('3{enter}', { force: true });
    cy.get("#\\/l2").should('contain.text', '…,…')
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,…')
    })
    cy.get('#\\/maxIndex textarea').type('6{enter}', { force: true });
    cy.get("#\\/l2").should('contain.text', '…,22,29,36,43,…')
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,29,36,43,…')
    })

    cy.get('#\\/offsets textarea').type('{end},3{enter}', { force: true });
    cy.get('#\\/offsets2').should('contain.text', '1,3')
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−4,1,3,8,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,24,29,31,36,38,43,45,…')
    })

    cy.get('#\\/offsets textarea').type('{end}{backspace}{backspace}{leftArrow}3,{enter}', { force: true });
    cy.get('#\\/offsets2').should('contain.text', '3,1')
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−4,1,3,8,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,24,29,31,36,38,43,45,…')
    })

    cy.get('#\\/offsets textarea').type('{end},8{enter}', { force: true });
    cy.get('#\\/offsets2').should('contain.text', '3,1,8')
    
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−4,1,3,8,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,24,29,31,36,38,43,45,…')
    })

    cy.get('#\\/offsets textarea').type('{end},79{enter}', { force: true });
    cy.get('#\\/offsets2').should('contain.text', '3,1,8,79')
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−5,−4,1,2,3,8,9,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,23,24,29,30,31,36,37,38,43,44,45,…')
    })

  });



});
