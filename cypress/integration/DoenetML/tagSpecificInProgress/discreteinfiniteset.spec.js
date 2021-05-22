describe('DiscreteInfiniteSet Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it.skip('match given discrete infinite set', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <answer>
    <p>Offsets: <mathinput name="o"/></p>
    <p>Period: <mathinput name="p" /></p>
      <award>
        <if>
        <discreteinfiniteset name="s1" simplify>
          <offsets mergemathlists="true"><copy prop="value" tname="o" /></offsets>
          <period><copy prop="value" tname="p" /></period>
        </discreteinfiniteset>
        =
        <discreteinfiniteset name="s2" simplify>
          <offsets mergemathlists="true">pi/4,3pi/4</offsets>
          <period>pi</period>
        </discreteinfiniteset>
        </if>
      </award>
    </answer>
    <p>Credit achieved: <copy prop="creditAchieved" tname="_answer1" /></p>
    `}, "*");
    });


    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s1'].state.value.tree).eq('\uFF3F');

      let s2 = ['discrete_infinite_set'];
      s2.push(['tuple', ['/', 'pi', 4], 'pi', ['-', Infinity], Infinity])
      s2.push(['tuple', ['/', ['*', 3, 'pi'], 4], 'pi', ['-', Infinity], Infinity])
      expect(components['/s2'].state.value.tree).eqls(s2);
      expect(components['/s2'].state.nOffsets).eq(2);
      expect(components['/s2'].state.offsets[0].tree).eqls(['/', 'pi', 4]);
      expect(components['/s2'].state.offsets[1].tree).eqls(['/', ['*', 3, 'pi'], 4]);
      expect(components['/s2'].state.period.tree).eq('pi');
      expect(components['/s2'].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Type in an offset and submit")
    cy.get('#\\/o_input').clear().type(`-pi/4{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s1'].state.value.tree).eq('\uFF3F');
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Type in a period and submit")
    cy.get('#\\/p_input').clear().type(`pi/2{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['discrete_infinite_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], ['-', Infinity], Infinity])
      expect(components['/s1'].state.value.tree).eqls(s1);
      expect(components['/s1'].state.nOffsets).eq(1);
      expect(components['/s1'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/s1'].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });

    cy.log("Change period")
    cy.get('#\\/p_input').clear().type(`pi{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['discrete_infinite_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', ['-', Infinity], Infinity])
      expect(components['/s1'].state.value.tree).eqls(s1);
      expect(components['/s1'].state.nOffsets).eq(1);
      expect(components['/s1'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].state.period.tree).eqls('pi');
      expect(components['/s1'].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("add offset")
    cy.get('#\\/o_input').type(`, 5pi/4{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['discrete_infinite_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', ['-', Infinity], Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', ['-', Infinity], Infinity])
      expect(components['/s1'].state.value.tree).eqls(s1);
      expect(components['/s1'].state.nOffsets).eq(2);
      expect(components['/s1'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].state.offsets[1].tree).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(components['/s1'].state.period.tree).eqls('pi');
      expect(components['/s1'].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });

    cy.log("add redundant offset")
    cy.get('#\\/o_input').type(`, pi/4{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['discrete_infinite_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', ['-', Infinity], Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', ['-', Infinity], Infinity])
      s1.push(['tuple', ['/', 'pi', 4], 'pi', ['-', Infinity], Infinity])
      expect(components['/s1'].state.value.tree).eqls(s1);
      expect(components['/s1'].state.nOffsets).eq(3);
      expect(components['/s1'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].state.offsets[1].tree).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(components['/s1'].state.offsets[2].tree).eqls(['/', 'pi', 4]);
      expect(components['/s1'].state.period.tree).eqls('pi');
      expect(components['/s1'].state.redundantoffsets).eq(true);

      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });

    cy.log("add incorrect offset")
    cy.get('#\\/o_input').type(`, pi/2{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let s1 = ['discrete_infinite_set'];
      s1.push(['tuple', ['-', ['/', 'pi', 4]], 'pi', ['-', Infinity], Infinity])
      s1.push(['tuple', ['/', ['*', 5, 'pi'], 4], 'pi', ['-', Infinity], Infinity])
      s1.push(['tuple', ['/', 'pi', 4], 'pi', ['-', Infinity], Infinity])
      s1.push(['tuple', ['/', 'pi', 2], 'pi', ['-', Infinity], Infinity])
      expect(components['/s1'].state.value.tree).eqls(s1);
      expect(components['/s1'].state.nOffsets).eq(4);
      expect(components['/s1'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/s1'].state.offsets[1].tree).eqls(['/', ['*', 5, 'pi'], 4]);
      expect(components['/s1'].state.offsets[2].tree).eqls(['/', 'pi', 4]);
      expect(components['/s1'].state.offsets[3].tree).eqls(['/', 'pi', 2]);
      expect(components['/s1'].state.period.tree).eqls('pi');
      expect(components['/s1'].state.redundantoffsets).eq(true);

      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("add invalid math")
    cy.get('#\\/o_input').type(`, ({enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#__number1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let s1 = ['discrete_infinite_set'];
      s1.push(['tuple', '\uff3f', 'pi', ['-', Infinity], Infinity])
  
      expect(components['/s1'].state.value.tree).eqls(s1);
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });


  });

  it.skip('match reffed discrete infinite sets', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>Offsets: <mathinput name="offsets" /></p>
    <p>Period: <mathinput name="period" /></p>
    
    <p>Offsets 2: <mathinput name="offsets2" /></p>
    <p>Period 2: <mathinput name="period2" /></p>
    
    <discreteinfiniteset name="a">
    <offsets mergemathlists="true"><copy prop="value" tname="offsets" /></offsets>
    <period><copy prop="value" tname="period" /></period>
    </discreteinfiniteset>
    
    <discreteinfiniteset name="b">
    <offsets mergemathlists="true"><copy prop="value" tname="offsets2" /></offsets>
    <period><copy prop="value" tname="period2" /></period>
    </discreteinfiniteset>
    
    <answer>
      <award>
        <if><copy name="a2" tname="a" /> = <copy name="b2" tname="b" /></if>
      </award>
    </answer>
    
    <p>Credit achieved: <copy prop="creditAchieved" tname="_answer1" /></p>
    
    <p>Redundancies: <copy prop="redundantoffsets" tname="a" />, <copy prop="redundantoffsets" tname="b" />, <copy prop="redundantoffsets" tname="a2" />, <copy prop="redundantoffsets" tname="b2" /></p>
    `}, "*");
    });

    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('')
    })
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].state.value.tree).eq('\uFF3F');
      expect(components['/b'].state.value.tree).eq('\uFF3F');
      expect(components['/a2'].replacements[0].state.value.tree).eq('\uFF3F');
      expect(components['/b2'].replacements[0].state.value.tree).eq('\uFF3F');
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Submit offset for both")
    cy.get('#\\/offsets_input').clear().type(`-pi/4{enter}`);
    cy.get('#\\/offsets2_input').clear().type(`-pi/4{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/a'].state.value.tree).eq('\uFF3F');
      expect(components['/b'].state.value.tree).eq('\uFF3F');
      expect(components['/a2'].replacements[0].state.value.tree).eq('\uFF3F');
      expect(components['/b2'].replacements[0].state.value.tree).eq('\uFF3F');
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Submit periods for both")
    cy.get('#\\/period_input').clear().type(`pi/2{enter}`);
    cy.get('#\\/period2_input').clear().type(`2pi{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/a').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('')
    })
    cy.get('#\\/b').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('')
    })
    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let a = ['discrete_infinite_set'];
      a.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], ['-', Infinity], Infinity])
      expect(components['/a'].state.value.tree).eqls(a);
      expect(components['/a'].state.nOffsets).eq(1);
      expect(components['/a'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a'].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].state.redundantoffsets).eq(false);
      expect(components['/a2'].replacements[0].state.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].state.nOffsets).eq(1);
      expect(components['/a2'].replacements[0].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a2'].replacements[0].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].state.redundantoffsets).eq(false);

      let b = ['discrete_infinite_set'];
      b.push(['tuple', ['-', ['/', 'pi', 4]], ['*', 2, 'pi'], ['-', Infinity], Infinity])
      expect(components['/b'].state.value.tree).eqls(b);
      expect(components['/b'].state.nOffsets).eq(1);
      expect(components['/b'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/b'].state.redundantoffsets).eq(false);
      expect(components['/b'].state.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].state.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].state.nOffsets).eq(1);
      expect(components['/b2'].replacements[0].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/b2'].replacements[0].state.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Add offsets to match")
    cy.get('#\\/offsets2_input').type(`, pi/4, 11pi/4, -11pi/4{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/_p6').should('have.text', 'Redundancies: false, false, false, false')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let a = ['discrete_infinite_set'];
      a.push(['tuple', ['-', ['/', 'pi', 4]], ['/', 'pi', 2], ['-', Infinity], Infinity])
      expect(components['/a'].state.value.tree).eqls(a);
      expect(components['/a'].state.nOffsets).eq(1);
      expect(components['/a'].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a'].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].state.redundantoffsets).eq(false);
      expect(components['/a2'].replacements[0].state.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].state.nOffsets).eq(1);
      expect(components['/a2'].replacements[0].state.offsets[0].tree).eqls(['-', ['/', 'pi', 4]]);
      expect(components['/a2'].replacements[0].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].state.redundantoffsets).eq(false);

      let b = ['discrete_infinite_set'];

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      b.push(['tuple', offset1, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      b.push(['tuple', offset2, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      b.push(['tuple', offset3, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      expect(components['/b'].state.value.tree).eqls(b);
      expect(components['/b'].state.nOffsets).eq(4);
      expect(components['/b'].state.offsets[0].tree).eqls(offset0);
      expect(components['/b'].state.offsets[1].tree).eqls(offset1);
      expect(components['/b'].state.offsets[2].tree).eqls(offset2);
      expect(components['/b'].state.offsets[3].tree).eqls(offset3);
      expect(components['/b'].state.redundantoffsets).eq(false);
      expect(components['/b'].state.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].state.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].state.nOffsets).eq(4);
      expect(components['/b2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].state.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].state.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].state.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });


    cy.log("Add extra offsets")
    cy.get('#\\/offsets_input').type(`, -17pi/4{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, false, true, false')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['discrete_infinite_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], ['-', Infinity], Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], ['-', Infinity], Infinity])
      expect(components['/a'].state.value.tree).eqls(a);
      expect(components['/a'].state.nOffsets).eq(2);
      expect(components['/a'].state.offsets[0].tree).eqls(offset0);
      expect(components['/a'].state.offsets[1].tree).eqls(offset1);
      expect(components['/a'].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].state.redundantoffsets).eq(true);
      expect(components['/a2'].replacements[0].state.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].state.nOffsets).eq(2);
      expect(components['/a2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/a2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/a2'].replacements[0].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].state.redundantoffsets).eq(true);

      let b = ['discrete_infinite_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      b.push(['tuple', offset1, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      b.push(['tuple', offset2, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      b.push(['tuple', offset3, ['*', 2, 'pi'], ['-', Infinity], Infinity])
      expect(components['/b'].state.value.tree).eqls(b);
      expect(components['/b'].state.nOffsets).eq(4);
      expect(components['/b'].state.offsets[0].tree).eqls(offset0);
      expect(components['/b'].state.offsets[1].tree).eqls(offset1);
      expect(components['/b'].state.offsets[2].tree).eqls(offset2);
      expect(components['/b'].state.offsets[3].tree).eqls(offset3);
      expect(components['/b'].state.redundantoffsets).eq(false);
      expect(components['/b'].state.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].state.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].state.nOffsets).eq(4);
      expect(components['/b2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].state.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].state.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].state.period.tree).eqls(['*', 2, 'pi']);
      expect(components['/b2'].replacements[0].state.redundantoffsets).eq(false);

      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });


    cy.log("reduce period")
    cy.get('#\\/period2_input').clear().type(`pi{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, true, true, true')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['discrete_infinite_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], ['-', Infinity], Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], ['-', Infinity], Infinity])
      expect(components['/a'].state.value.tree).eqls(a);
      expect(components['/a'].state.nOffsets).eq(2);
      expect(components['/a'].state.offsets[0].tree).eqls(offset0);
      expect(components['/a'].state.offsets[1].tree).eqls(offset1);
      expect(components['/a'].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].state.redundantoffsets).eq(true);
      expect(components['/a2'].replacements[0].state.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].state.nOffsets).eq(2);
      expect(components['/a2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/a2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/a2'].replacements[0].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].state.redundantoffsets).eq(true);

      let b = ['discrete_infinite_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];

      b.push(['tuple', offset0, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset1, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset2, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset3, 'pi', ['-', Infinity], Infinity])
      expect(components['/b'].state.value.tree).eqls(b);
      expect(components['/b'].state.nOffsets).eq(4);
      expect(components['/b'].state.offsets[0].tree).eqls(offset0);
      expect(components['/b'].state.offsets[1].tree).eqls(offset1);
      expect(components['/b'].state.offsets[2].tree).eqls(offset2);
      expect(components['/b'].state.offsets[3].tree).eqls(offset3);
      expect(components['/b'].state.redundantoffsets).eq(true);
      expect(components['/b'].state.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].state.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].state.nOffsets).eq(4);
      expect(components['/b2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].state.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].state.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].state.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].state.redundantoffsets).eq(true);

      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });


    cy.log("add incorrect offset")
    cy.get('#\\/offsets2_input').type(`, 0{enter}`);
    cy.get('#\\/_answer1_submit').click();

    cy.get('#\\/_p5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('0')
    })
    cy.get('#\\/_p6').should('have.text', 'Redundancies: true, true, true, true')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let offset0 = ['-', ['/', 'pi', 4]];
      let offset1 = ['-', ['/', ['*', 17, 'pi'], 4]];

      let a = ['discrete_infinite_set'];
      a.push(['tuple', offset0, ['/', 'pi', 2], ['-', Infinity], Infinity])
      a.push(['tuple', offset1, ['/', 'pi', 2], ['-', Infinity], Infinity])
      expect(components['/a'].state.value.tree).eqls(a);
      expect(components['/a'].state.nOffsets).eq(2);
      expect(components['/a'].state.offsets[0].tree).eqls(offset0);
      expect(components['/a'].state.offsets[1].tree).eqls(offset1);
      expect(components['/a'].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a'].state.redundantoffsets).eq(true);
      expect(components['/a2'].replacements[0].state.value.tree).eqls(a);
      expect(components['/a2'].replacements[0].state.nOffsets).eq(2);
      expect(components['/a2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/a2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/a2'].replacements[0].state.period.tree).eqls(['/', 'pi', 2]);
      expect(components['/a2'].replacements[0].state.redundantoffsets).eq(true);

      let b = ['discrete_infinite_set'];

      offset0 = ['-', ['/', 'pi', 4]];
      offset1 = ['/', 'pi', 4];
      let offset2 = ['/', ['*', 11, 'pi'], 4];
      let offset3 = ['-', ['/', ['*', 11, 'pi'], 4]];
      let offset4 = 0;

      b.push(['tuple', offset0, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset1, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset2, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset3, 'pi', ['-', Infinity], Infinity])
      b.push(['tuple', offset4, 'pi', ['-', Infinity], Infinity])
      expect(components['/b'].state.value.tree).eqls(b);
      expect(components['/b'].state.nOffsets).eq(5);
      expect(components['/b'].state.offsets[0].tree).eqls(offset0);
      expect(components['/b'].state.offsets[1].tree).eqls(offset1);
      expect(components['/b'].state.offsets[2].tree).eqls(offset2);
      expect(components['/b'].state.offsets[3].tree).eqls(offset3);
      expect(components['/b'].state.offsets[4].tree).eqls(offset4);
      expect(components['/b'].state.redundantoffsets).eq(true);
      expect(components['/b'].state.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].state.value.tree).eqls(b);
      expect(components['/b2'].replacements[0].state.nOffsets).eq(5);
      expect(components['/b2'].replacements[0].state.offsets[0].tree).eqls(offset0);
      expect(components['/b2'].replacements[0].state.offsets[1].tree).eqls(offset1);
      expect(components['/b2'].replacements[0].state.offsets[2].tree).eqls(offset2);
      expect(components['/b2'].replacements[0].state.offsets[3].tree).eqls(offset3);
      expect(components['/b2'].replacements[0].state.offsets[4].tree).eqls(offset4);
      expect(components['/b2'].replacements[0].state.period.tree).eqls('pi');
      expect(components['/b2'].replacements[0].state.redundantoffsets).eq(true);

      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

  });
  

  it.skip('partial credit with discrete infinite set', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <offsets hide name="correct_offsets" mergemathlists="true">30,150</offsets>
    <period hide name="correct_period">180</period>
    <discreteinfiniteset name="correct" simplify="full">
      <copy tname="correct_offsets" />
      <copy tname="correct_period" />
    </discreteinfiniteset>
    
    <p>What is the period?
      <answer name="period">
        <mathinput name="period_input" />
        <award><if>
          <isinteger>
            <number><copy prop="value" tname="period_input" />/<copy prop="value" tname="correct_period" /></number>
          </isinteger>
        </if></award>
      </answer>
    </p>

    <p>How many offsets? 
      <answer name="number_offsets">
        <mathinput name="number_offsets_input" />
        <award><if>
          <isinteger><number><copy prop="value" tname="number_offsets_input" /></number></isinteger>
          and
          <copy prop="value" tname="number_offsets_input" /> >= 
            <number><copy prop="submittedResponse" tname="period" />/<copy prop="value" tname="correct_period" />
              *<copy prop="ncomponents" tname="correct_offsets" />
            </number>
        </if></award>  
      </answer> 
    </p>

    <p name="offset_p">Enter the offsets:
      <map>
        <template>
          <mathinput />
        </template>
        <sources>
          <sequence><count><copy prop="submittedResponse" tname="number_offsets" /></count></sequence>
        </sources>
      </map>
    </p>
    
    <answer>
      <award>
          <if matchpartial="true">
          <discreteinfiniteset simplify="full">
            <offsets>
              <extract prop="value"><collect components="mathinput" tname="offset_p" /></extract>
            </offsets>
            <period><copy prop="submittedResponse" tname="period" /></period>
          </discreteinfiniteset>
          =
          <copy tname="correct" />
        </if>
      </award>
    </answer>
    `}, "*");
    });


    cy.get('#\\/_p1').should('contain.text','What is the period?')


    cy.log('partially correct answer')
    cy.get('#\\/period_input_input').clear().type('360{enter}');
    cy.get('#\\/period_input_correct').should('be.visible');

    cy.get('#\\/number_offsets_input_input').clear().type('4{enter}');
    cy.get('#\\/number_offsets_input_correct').should('be.visible');

    cy.get('#\\/__map1_0_mathinput3_input').clear().type('30').blur();
    cy.get('#\\/__map1_1_mathinput3_input').clear().type('150').blur();
    cy.get('#\\/__map1_2_mathinput3_input').clear().type('210').blur();
    cy.get('#\\/__map1_3_mathinput3_input').clear().type('211').blur();

    cy.get('#\\/_answer3_submit').click();

    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.log('correct answer');

    cy.get('#\\/__map1_3_mathinput3_input').clear().type('-30').blur();

    cy.get('#\\/_answer3_submit').click();

    cy.get('#\\/_answer3_correct').should('be.visible');


    cy.log('add extraneous answer blanks');
    cy.get('#\\/number_offsets_input_input').clear().type('10{enter}');
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })

    cy.log('add in a duplicate')
    cy.get('#\\/__map1_4_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('fill in with duplicates')
    cy.get('#\\/__map1_5_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/__map1_6_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/__map1_7_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/__map1_8_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/__map1_9_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");


    cy.log('too few answer blanks');
    cy.get('#\\/number_offsets_input_input').clear().type('3{enter}');
    cy.get('#\\/number_offsets_input_incorrect').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('75% correct')
    })

    cy.get('#\\/__map1_2_mathinput3_input').clear().type('100').blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('even fewer answer blanks');
    cy.get('#\\/number_offsets_input_input').clear().type('2{enter}');
    cy.get('#\\/number_offsets_input_incorrect').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })

    cy.log('change period')
    cy.get('#\\/period_input_input').clear().type('180{enter}');
    cy.get('#\\/period_input_correct').should('be.visible');
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");

    cy.log('additional answer blanks');
    cy.get('#\\/number_offsets_input_input').clear().type('3{enter}');
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    })

    cy.get('#\\/__map1_2_mathinput3_input').clear().type('330').blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_correct').should("be.visible");


    cy.log('change period')
    cy.get('#\\/period_input_input').clear().type('90{enter}');
    cy.get('#\\/period_input_incorrect').should('be.visible');
    cy.get('#\\/number_offsets_input_submit').click();
    cy.get('#\\/number_offsets_input_correct').should('be.visible');
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    cy.get('#\\/__map1_2_mathinput3_input').clear().type('100').blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('33% correct')
    })
    cy.get('#\\/__map1_2_mathinput3_input').clear().type('150').blur();
    cy.get('#\\/_answer3_submit').click();
    cy.get('#\\/_answer3_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    })
    

  });

});
