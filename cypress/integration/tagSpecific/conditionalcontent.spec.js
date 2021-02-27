
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
    <conditionalcontent>
      <condition><copy prop="value" tname="_mathinput1" /> > 0</condition>
      a positive number.
    </conditionalcontent>
    <conditionalcontent>
      <condition><copy prop="value" tname="_mathinput1" /> < 0</condition>
      a negative number.
    </conditionalcontent>
    <conditionalcontent>
      <condition><copy prop="value" tname="_mathinput1" /> = 0</condition>
      zero.
    </conditionalcontent>
    <conditionalcontent>
      <condition>
        !(<copy prop="value" tname="_mathinput1" /> > 0 or
        <copy prop="value" tname="_mathinput1" /> < 0 or
        <copy prop="value" tname="_mathinput1" /> = 0)
      </condition>
      something else.
    </conditionalcontent>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/_mathinput1 textarea').type("10{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}-5/9{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}5-5{enter}", { force: true });
    cy.get('p#\\/_p1').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}-x{enter}", { force: true });
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

    <section>
    <conditionalcontent>
      <condition><copy prop="value" tname="_mathinput1" /> > 0</condition>
      <p>You typed a positive number.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent>
      <condition><copy prop="value" tname="_mathinput1" /> < 0</condition>
      <p>You typed a negative number.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent>
      <condition><copy prop="value" tname="_mathinput1" /> = 0</condition>
      <p>You typed zero.</p>
    </conditionalcontent>
    </section>
    <section>
    <conditionalcontent>
      <condition>
        !(<copy prop="value" tname="_mathinput1" /> > 0 or
        <copy prop="value" tname="_mathinput1" /> < 0 or
        <copy prop="value" tname="_mathinput1" /> = 0)
      </condition>
      <p>You typed something else.</p>
    </conditionalcontent>
    </section>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')

    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed something else.')
    });

    cy.get('#\\/_mathinput1 textarea').type("10{enter}", { force: true });
    cy.get('#\\/_section1 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a positive number.')
    });
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').should('not.exist');

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}-5/9{enter}", { force: true });
    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed a negative number.')
    });
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').should('not.exist');

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}{backspace}5-5{enter}", { force: true });
    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').invoke('text').then((text) => {
      expect(text.replace(/\s+/g, " ").trim()).equal('You typed zero.')
    });
    cy.get('#\\/_section4 p').should('not.exist');

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}{backspace}{backspace}-x{enter}", { force: true });
    cy.get('#\\/_section1 p').should('not.exist');
    cy.get('#\\/_section2 p').should('not.exist');
    cy.get('#\\/_section3 p').should('not.exist');
    cy.get('#\\/_section4 p').invoke('text').then((text) => {
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
    <award><when>
      <copy prop="selectedvalue" tname="_choiceinput1" />
      =
      <text>
        <conditionalcontent><condition><abs><copy prop="value" tname="_mathinput1" /></abs> < 1</condition>
          stable
        </conditionalcontent>
        <conditionalcontent><condition><abs><copy prop="value" tname="_mathinput1" /></abs> > 1</condition>
          unstable
        </conditionalcontent>
      </text>
    </when></award>
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

    cy.get('#\\/_mathinput1 textarea').type('3{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}-0.8{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}1/3{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');


    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}-7/5{enter}', { force: true });
    cy.get('#\\/_choiceinput1').select(`stable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_incorrect').should('be.visible');
    cy.get('#\\/_choiceinput1').select(`unstable`);
    cy.get('#\\/_choiceinput1_submit').click();
    cy.get('#\\/_choiceinput1_correct').should('be.visible');


    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}{backspace}{backspace}1{enter}', { force: true });
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
    <award><when>
      <copy prop="immediateValue" tname="_mathinput1" />
      =
      <math>
        <conditionalcontent><condition><copy prop="selectedvalue" tname="_choiceinput1" /> = positive</condition>
          x > 0
        </conditionalcontent>
        <conditionalcontent><condition><copy prop="selectedvalue" tname="_choiceinput1" /> = negative</condition>
          x < 0
        </conditionalcontent>
      </math>
    </when></award>
  </answer>
  </p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a')
    cy.get('#\\/_mathinput1_submit').click();
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1 textarea').type('x > 0{enter}', { force: true });
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}< 0{enter}', { force: true });
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');


    cy.get('#\\/_choiceinput1').select(`negative`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.get('#\\/_mathinput1_correct').should('be.visible');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}> 0{enter}', { force: true });
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');


    cy.get('#\\/_choiceinput1').select(`positive`);
    cy.get('#\\/_mathinput1_submit').click();
    cy.get('#\\/_mathinput1_correct').should('be.visible');

    cy.get('#\\/_mathinput1 textarea').type('{end}{backspace}{backspace}{backspace}< 0{enter}', { force: true });
    cy.get('#\\/_mathinput1_incorrect').should('be.visible');


  })

})



