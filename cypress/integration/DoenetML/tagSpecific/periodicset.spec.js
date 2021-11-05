describe('PeriodicSet Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('match given periodic set', () => {
    cy.window().then((win) => {
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
    <p>Credit achieved: <copy prop="creditAchieved" tname="_answer1" assignNames="ca" /></p>
    `}, "*");
    });


    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s1'].stateValues.value.tree).eq('\uFF3F');

      let s2 = ['periodic_set'];
      s2.push(['tuple', ['/', 'pi', 4], 'pi', -Infinity, Infinity])
      s2.push(['tuple', ['/', ['*', 3, 'pi'], 4], 'pi', -Infinity, Infinity])
      expect(components['/s2'].stateValues.value.tree).eqls(s2);
      expect(components['/s2'].stateValues.nOffsets).eq(2);
      expect(components['/s2'].stateValues.offsets[0].tree).eqls(['/', 'pi', 4]);
      expect(components['/s2'].stateValues.offsets[1].tree).eqls(['/', ['*', 3, 'pi'], 4]);
      expect(components['/s2'].stateValues.period.tree).eq('pi');
      expect(components['/s2'].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Type in an offset and submit")
    cy.get('#\\/o textarea').type(`-pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s1'].stateValues.value.tree).eq('\uFF3F');
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Type in a period and submit")
    cy.get('#\\/p textarea').type(`pi/2{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '1')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], -Infinity, Infinity])
      expect(components['/s1'].stateValues.value.tree).eqls(s1);
      expect(components['/s1'].stateValues.nOffsets).eq(1);
      expect(components['/s1'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/s1'].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Change period to be irrational factor of other period")
    cy.get('#\\/p textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}1{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 1, -Infinity, Infinity])
      expect(components['/s1'].stateValues.value.tree).eqls(s1);
      expect(components['/s1'].stateValues.nOffsets).eq(1);
      expect(components['/s1'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].stateValues.period.tree).eqls(1);
      expect(components['/s1'].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });


    cy.log("Change period")
    cy.get('#\\/p textarea').type(`{end}{backspace}{backspace}{backspace}pi{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      expect(components['/s1'].stateValues.value.tree).eqls(s1);
      expect(components['/s1'].stateValues.nOffsets).eq(1);
      expect(components['/s1'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].stateValues.period.tree).eqls('pi');
      expect(components['/s1'].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add offset")
    cy.get('#\\/o textarea').type(`{end}, 5pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '1')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', -Infinity, Infinity])
      expect(components['/s1'].stateValues.value.tree).eqls(s1);
      expect(components['/s1'].stateValues.nOffsets).eq(2);
      expect(components['/s1'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].stateValues.offsets[1].tree).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(components['/s1'].stateValues.period.tree).eqls('pi');
      expect(components['/s1'].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("add redundant offset")
    cy.get('#\\/o textarea').type(`{end}, pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '1')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', 'pi', 4], 'pi', -Infinity, Infinity])
      expect(components['/s1'].stateValues.value.tree).eqls(s1);
      expect(components['/s1'].stateValues.nOffsets).eq(3);
      expect(components['/s1'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].stateValues.offsets[1].tree).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(components['/s1'].stateValues.offsets[2].tree).eqls(['/', 'pi', 4]);
      expect(components['/s1'].stateValues.period.tree).eqls('pi');
      expect(components['/s1'].stateValues.redundantOffsets).eq(true);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("add incorrect offset")
    cy.get('#\\/o textarea').type(`{end}, pi/2{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['periodic_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', 'pi', 4], 'pi', -Infinity, Infinity])
      s1.push(['tuple', ['/', 'pi', 2], 'pi', -Infinity, Infinity])
      expect(components['/s1'].stateValues.value.tree).eqls(s1);
      expect(components['/s1'].stateValues.nOffsets).eq(4);
      expect(components['/s1'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].stateValues.offsets[1].tree).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(components['/s1'].stateValues.offsets[2].tree).eqls(['/', 'pi', 4]);
      expect(components['/s1'].stateValues.offsets[3].tree).eqls(['/', 'pi', 2]);
      expect(components['/s1'].stateValues.period.tree).eqls('pi');
      expect(components['/s1'].stateValues.redundantOffsets).eq(true);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("add invalid math")
    cy.get('#\\/o textarea').type(`{end}, ({enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '0')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      expect(components['/s1'].stateValues.value.tree).eq('\uff3f');
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });


  });

  it('match reffed periodic sets', () => {
    cy.window().then((win) => {
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
        <when><copy name="a2" tname="a" /> = <copy name="b2" tname="b" /></when>
      </award>
    </answer>
    
    <p>Credit achieved: <copy prop="creditAchieved" tname="_answer1" assignNames="ca" /></p>
    
    <p>Redundancies: <copy prop="redundantOffsets" tname="a" />, <copy prop="redundantOffsets" tname="b" />, <copy prop="redundantOffsets" tname="a2" />, <copy prop="redundantOffsets" tname="b2" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/_answer1_submit').click();

    // cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('\uff3f')
    // })
    // cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('\uff3f')
    // })
    cy.get('#\\/ca').should('have.text', '0')
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eq('\uFF3F');
      expect(components['/b'].stateValues.value.tree).eq('\uFF3F');
      expect(components['/a2'].replacements[0].stateValues.value.tree).eq('\uFF3F');
      expect(components['/b2'].replacements[0].stateValues.value.tree).eq('\uFF3F');
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit offset for both")
    cy.get('#\\/offsets textarea').type(`-pi/4{enter}`, { force: true });
    cy.get('#\\/offsets2 textarea').type(`-pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].stateValues.value.tree).eq('\uFF3F');
      expect(components['/b'].stateValues.value.tree).eq('\uFF3F');
      expect(components['/a2'].replacements[0].stateValues.value.tree).eq('\uFF3F');
      expect(components['/b2'].replacements[0].stateValues.value.tree).eq('\uFF3F');
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Submit periods for both")
    cy.get('#\\/period textarea').type(`pi/2{enter}`, { force: true });
    cy.get('#\\/period2 textarea').type(`2pi{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    // cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('\uff3f')
    // })
    // cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('\uff3f')
    // })
    cy.get('#\\/ca').should('have.text', '0')
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let a = ['periodic_set'];
      a.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], -Infinity, Infinity])
      expect(components['/a'].stateValues.value.tree).eqls(a);
      expect(components['/a'].stateValues.nOffsets).eq(1);
      expect(components['/a'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a'].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].stateValues.redundantOffsets).eq(false);
      expect(components['/a2'].replacements[0].stateValues.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].stateValues.nOffsets).eq(1);
      expect(components['/a2'].replacements[0].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a2'].replacements[0].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].stateValues.redundantOffsets).eq(false);

      let b = ['periodic_set'];
      b.push(['tuple', ['-', ['/', 'pi', 4]], ['*', 2, 'pi'], -Infinity, Infinity])
      expect(components['/b'].stateValues.value.tree).eqls(b);
      expect(components['/b'].stateValues.nOffsets).eq(1);
      expect(components['/b'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/b'].stateValues.redundantOffsets).eq(false);
      expect(components['/b'].stateValues.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].stateValues.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].stateValues.nOffsets).eq(1);
      expect(components['/b2'].replacements[0].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/b2'].replacements[0].stateValues.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Add offsets to match")
    cy.get('#\\/offsets2 textarea').type(`{end}, pi/4{rightArrow}, 11pi/4{rightArrow}, -11pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '1')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let a = ['periodic_set'];
      a.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], -Infinity, Infinity])
      expect(components['/a'].stateValues.value.tree).eqls(a);
      expect(components['/a'].stateValues.nOffsets).eq(1);
      expect(components['/a'].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a'].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].stateValues.redundantOffsets).eq(false);
      expect(components['/a2'].replacements[0].stateValues.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].stateValues.nOffsets).eq(1);
      expect(components['/a2'].replacements[0].stateValues.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a2'].replacements[0].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].stateValues.redundantOffsets).eq(false);

      let b = ['periodic_set'];

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset1, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset2, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset3, ['*', 2, 'pi'], -Infinity, Infinity])
      expect(components['/b'].stateValues.value.tree).eqls(b);
      expect(components['/b'].stateValues.nOffsets).eq(4);
      expect(components['/b'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b'].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b'].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b'].stateValues.redundantOffsets).eq(false);
      expect(components['/b'].stateValues.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].stateValues.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].stateValues.nOffsets).eq(4);
      expect(components['/b2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].stateValues.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Add extra offsets")
    cy.get('#\\/offsets textarea').type(`{end}, -17pi/4{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '1')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, false, true, false')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['periodic_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], -Infinity, Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], -Infinity, Infinity])
      expect(components['/a'].stateValues.value.tree).eqls(a);
      expect(components['/a'].stateValues.nOffsets).eq(2);
      expect(components['/a'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/a'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/a'].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].stateValues.redundantOffsets).eq(true);
      expect(components['/a2'].replacements[0].stateValues.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].stateValues.nOffsets).eq(2);
      expect(components['/a2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/a2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/a2'].replacements[0].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].stateValues.redundantOffsets).eq(true);

      let b = ['periodic_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset1, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset2, ['*', 2, 'pi'], -Infinity, Infinity])
      b.push(['tuple', offset3, ['*', 2, 'pi'], -Infinity, Infinity])
      expect(components['/b'].stateValues.value.tree).eqls(b);
      expect(components['/b'].stateValues.nOffsets).eq(4);
      expect(components['/b'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b'].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b'].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b'].stateValues.redundantOffsets).eq(false);
      expect(components['/b'].stateValues.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].stateValues.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].stateValues.nOffsets).eq(4);
      expect(components['/b2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].stateValues.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].stateValues.redundantOffsets).eq(false);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("reduce period")
    cy.get('#\\/period2 textarea').type(`{end}{backspace}{backspace}pi{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '1')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, true, true, true')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['periodic_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], -Infinity, Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], -Infinity, Infinity])
      expect(components['/a'].stateValues.value.tree).eqls(a);
      expect(components['/a'].stateValues.nOffsets).eq(2);
      expect(components['/a'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/a'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/a'].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].stateValues.redundantOffsets).eq(true);
      expect(components['/a2'].replacements[0].stateValues.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].stateValues.nOffsets).eq(2);
      expect(components['/a2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/a2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/a2'].replacements[0].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].stateValues.redundantOffsets).eq(true);

      let b = ['periodic_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset1, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset2, 'pi', -Infinity, Infinity])
      b.push(['tuple', offset3, 'pi', -Infinity, Infinity])
      expect(components['/b'].stateValues.value.tree).eqls(b);
      expect(components['/b'].stateValues.nOffsets).eq(4);
      expect(components['/b'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b'].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b'].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b'].stateValues.redundantOffsets).eq(true);
      expect(components['/b'].stateValues.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].stateValues.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].stateValues.nOffsets).eq(4);
      expect(components['/b2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].stateValues.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].stateValues.redundantOffsets).eq(true);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("add incorrect offset")
    cy.get('#\\/offsets2 textarea').type(`{end}, 0{enter}`, { force: true });
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/ca').should('have.text', '0')

    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, true, true, true')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['periodic_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], -Infinity, Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], -Infinity, Infinity])
      expect(components['/a'].stateValues.value.tree).eqls(a);
      expect(components['/a'].stateValues.nOffsets).eq(2);
      expect(components['/a'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/a'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/a'].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].stateValues.redundantOffsets).eq(true);
      expect(components['/a2'].replacements[0].stateValues.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].stateValues.nOffsets).eq(2);
      expect(components['/a2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/a2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/a2'].replacements[0].stateValues.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].stateValues.redundantOffsets).eq(true);

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
      expect(components['/b'].stateValues.value.tree).eqls(b);
      expect(components['/b'].stateValues.nOffsets).eq(5);
      expect(components['/b'].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b'].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b'].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b'].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b'].stateValues.offsets[4].tree).eqls(offset4);
      expect(components['/b'].stateValues.redundantOffsets).eq(true);
      expect(components['/b'].stateValues.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].stateValues.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].stateValues.nOffsets).eq(5);
      expect(components['/b2'].replacements[0].stateValues.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].stateValues.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].stateValues.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].stateValues.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].stateValues.offsets[4].tree).eqls(offset4);
      expect(components['/b2'].replacements[0].stateValues.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].stateValues.redundantOffsets).eq(true);

      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

  });

  it('partial credit with periodic set', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <mathlist name="correct_offsets" mergemathlists="true">30,150</mathlist>
      <copy prop="nComponents" tname="correct_offsets" assignNames="n_correct_offsets" />
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
      <collect componentTypes="mathinput" prop="value" tname="offset_p" />
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
          <when><copy prop="redundantOffsets" tname="userPeriodicSet" /></when>
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
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.log('correct answer');

    cy.get('#\\/mi4 textarea').type('{end}{backspace}{backspace}{backspace}-30', { force: true }).blur();

    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should('be.visible');

    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_correct').should('be.visible');


    cy.log('add extraneous answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}10{enter}', { force: true });
    cy.get('#\\/number_offsets_input_correct').should('be.visible');

    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.log('add in a duplicate')
    cy.get('#\\/mi5 textarea').type('330', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
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
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })

    cy.log('too few answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}{backspace}3{enter}', { force: true });
    cy.get('#\\/number_offsets_input_incorrect').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.get('#\\/mi3 textarea').type('{end}{backspace}{backspace}{backspace}100', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('even fewer answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}2{enter}', { force: true });
    cy.get('#\\/number_offsets_input_incorrect').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('change period')
    cy.get('#\\/period_input textarea').type('{end}{backspace}{backspace}{backspace}180{enter}', { force: true });
    cy.get('#\\/period_input_correct').should('be.visible');
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_correct').should("be.visible");

    cy.log('additional answer blanks');
    cy.get('#\\/number_offsets_input textarea').type('{end}{backspace}3{enter}', { force: true });
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/mi3 textarea').type('{end}{backspace}{backspace}{backspace}330', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('80% correct')
    })

    cy.log('change period')
    cy.get('#\\/period_input textarea').type('{end}{backspace}{backspace}{backspace}90{enter}', { force: true });
    cy.get('#\\/period_input_incorrect').should('be.visible');
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.get('#\\/mi3 textarea').type('{end}{backspace}{backspace}{backspace}100', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })

    cy.get('#\\/mi3 textarea').type('{end}{backspace}{backspace}{backspace}150', { force: true }).blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/_answer4_submit').click();
    cy.get('#\\/_answer4_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })


  });

  it('display periodic set as list', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Period: <mathinput name="period" /></p>
    <p>Offsets: <mathinput name="offsets" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset" />
  
    <p>As list: <copy prop="asList" tname="pset" assignNames="l1" /></p>

    <p>Min index: <mathinput name="minIndex" />, <mathinput name="maxIndex" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset2" minIndexAsList="$minIndex" maxIndexAsList="$maxIndex" />

    <p>As list with specified min/max: <copy prop="asList" tname="pset2" assignNames="l2" /></p>



    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get("#\\/l1").should('not.exist');
    cy.get("#\\/l2").should('not.exist');

    cy.get('#\\/period textarea').type('7{enter}', { force: true });
    cy.get('#\\/offsets textarea').type('1{enter}', { force: true });

    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,1,8,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,1,8,…')
    })

    cy.get('#\\/minIndex textarea').type('3{enter}', { force: true });
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,…')
    })
    cy.get('#\\/maxIndex textarea').type('6{enter}', { force: true });
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,29,36,43,…')
    })

    cy.get('#\\/offsets textarea').type('{end},3{enter}', { force: true });
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−4,1,3,8,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,24,29,31,36,38,43,45,…')
    })

    cy.get('#\\/offsets textarea').type('{end}{backspace}{backspace}{leftArrow}3,{enter}', { force: true });
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−4,1,3,8,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,24,29,31,36,38,43,45,…')
    })

    cy.get('#\\/offsets textarea').type('{end},8{enter}', { force: true });
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−4,1,3,8,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,24,29,31,36,38,43,45,…')
    })

    cy.get('#\\/offsets textarea').type('{end},79{enter}', { force: true });
    cy.get("#\\/l1").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,−6,−5,−4,1,2,3,8,9,10,…')
    })
    cy.get("#\\/l2").find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('…,22,23,24,29,30,31,36,37,38,43,44,45,…')
    })

  });



});
