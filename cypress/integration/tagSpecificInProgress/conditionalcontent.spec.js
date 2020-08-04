
describe('Conditional Content Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('inline content containing sign of number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput />

  <p>You typed 
    <conditionalinlinecontent>
      <if><ref prop="value">_mathinput1</ref> > 0</if>
      a positive number.
    </conditionalinlinecontent>
    <conditionalinlinecontent>
      <if><ref prop="value">_mathinput1</ref> < 0</if>
      a negative number.
    </conditionalinlinecontent>
    <conditionalinlinecontent>
      <if><ref prop="value">_mathinput1</ref> = 0</if>
      zero.
    </conditionalinlinecontent>
    <conditionalinlinecontent>
      <if>
        !(<ref prop="value">_mathinput1</ref> > 0 or
        <ref prop="value">_mathinput1</ref> < 0 or
        <ref prop="value">_mathinput1</ref> = 0)
      </if>
      something else.
    </conditionalinlinecontent>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/_mathinput1_input').clear().type("10{enter}");
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });

    cy.get('#\\/_mathinput1_input').clear().type("-5/9{enter}");
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });

    cy.get('#\\/_mathinput1_input').clear().type("5-5{enter}");
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });

    cy.get('#\\/_mathinput1_input').clear().type("-x{enter}");
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

  })

  it('block content containing sign of number', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <mathinput />

    <conditionalcontent>
      <if><ref prop="value">_mathinput1</ref> > 0</if>
      <p>You typed a positive number.</p>
    </conditionalcontent>
    <conditionalcontent>
      <if><ref prop="value">_mathinput1</ref> < 0</if>
      <p>You typed a negative number.</p>
    </conditionalcontent>
    <conditionalcontent>
      <if><ref prop="value">_mathinput1</ref> = 0</if>
      <p>You typed zero.</p>
    </conditionalcontent>
    <conditionalcontent>
      <if>
        !(<ref prop="value">_mathinput1</ref> > 0 or
        <ref prop="value">_mathinput1</ref> < 0 or
        <ref prop="value">_mathinput1</ref> = 0)
      </if>
      <p>You typed something else.</p>
    </conditionalcontent>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('p#\\/_p1').should('not.exist');
    cy.get('p#\\/_p2').should('not.exist');
    cy.get('p#\\/_p3').should('not.exist');
    cy.get('p#\\/_p4').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/_mathinput1_input').clear().type("10{enter}");
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });
    cy.get('p#\\/_p2').should('not.exist');
    cy.get('p#\\/_p3').should('not.exist');
    cy.get('p#\\/_p4').should('not.exist');

    cy.get('#\\/_mathinput1_input').clear().type("-5/9{enter}");
    cy.get('p#\\/_p1').should('not.exist');
    cy.get('p#\\/_p2').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });
    cy.get('p#\\/_p3').should('not.exist');
    cy.get('p#\\/_p4').should('not.exist');

    cy.get('#\\/_mathinput1_input').clear().type("5-5{enter}");
    cy.get('p#\\/_p1').should('not.exist');
    cy.get('p#\\/_p2').should('not.exist');
    cy.get('p#\\/_p3').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });
    cy.get('p#\\/_p4').should('not.exist');

    cy.get('#\\/_mathinput1_input').clear().type("-x{enter}");
    cy.get('p#\\/_p1').should('not.exist');
    cy.get('p#\\/_p2').should('not.exist');
    cy.get('p#\\/_p3').should('not.exist');
    cy.get('p#\\/_p4').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

  })

  it('conditional text used as correct answer', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Enter a slope: <mathinput /></p>

  <p>If this is the slope at an equilibrium of a discrete dynamical system, the equilibrium is
  <answer>
    <choiceinput inline="true"><choice>stable</choice><choice>unstable</choice></choiceinput>
    <award><if>
      <ref prop="selectedvalue">_choiceinput1</ref>
      =
      <text>
        <conditionaltext><if><abs><ref prop="value">_mathinput1</ref></abs> < 1</if>
          stable
        </conditionaltext>
        <conditionaltext><if><abs><ref prop="value">_mathinput1</ref></abs> > 1</if>
          unstable
        </conditionaltext>
      </text>
    </if></award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('3{enter}');
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('-0.8{enter}');
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('1/3{enter}');
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');


    cy.get('#\\/_mathinput1_input').clear().type('-7/5{enter}');
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');


    cy.get('#\\/_mathinput1_input').clear().type('1{enter}');
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');


  })

  it('conditional math used as correct answer', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p>Require <choiceinput inline="true"><choice>positive</choice><choice>negative</choice></choiceinput>.</p>

  <p>Condition on <m>x</m>:
  <answer>
    <mathinput />
    <award><if>
      <ref prop="value">_mathinput1</ref>
      =
      <math>
        <conditionalmath><if><ref prop="selectedvalue">_choiceinput1</ref> = positive</if>
          x > 0
        </conditionalmath> +
        <conditionalmath><if><ref prop="selectedvalue">_choiceinput1</ref> = negative</if>
          x < 0
        </conditionalmath>
      </math>
    </if></award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')
    cy.get('#\\/_mathinput1_submit').click();
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('x > 0{enter}');
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('x < 0{enter}');
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');


    cy.get('#\\/_choiceinput1').select(`negative`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.get('#\\/_mathinput1_correct').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('x > 0{enter}');
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');


    cy.get('#\\/_choiceinput1').select(`positive`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.get('#\\/_mathinput1_correct').should('be.visible');

    cy.get('#\\/_mathinput1_input').clear().type('x < 0{enter}');
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');


  })

})



