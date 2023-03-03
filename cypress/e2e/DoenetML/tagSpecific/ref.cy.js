import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('ref Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('ref to sections', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <section newnamespace name="section1">
      <title>Section 1</title>
      <p>Paragraph one</p>
      <p>Paragraph two</p>
      <p>Paragraph three</p>
      <p>Paragraph four</p>
      <p>Paragraph five</p>
      <p>Paragraph six</p>
      <p>Paragraph seven</p>
      <p>Paragraph eight</p>
      <p>Goto:
      <ref name="toTwo" target="/section2">Section 2</ref>,
      <ref name="toThree" target="/section3">Section 3</ref>
      <ref name="toFour" target="/section4">Section 4</ref>
      <ref name="toThreeii" target="/section3/_p2">Second paragraph of Section 3</ref>
      </p>

    </section>

    <section newnamespace name="section2">
      <title>Section 2</title>
      <p>Paragraph a</p>
      <p>Paragraph b</p>
      <p>Paragraph c</p>
      <p>Paragraph d</p>
      <p>Paragraph e</p>
      <p>Paragraph f</p>
      <p>Paragraph g</p>
      <p>Paragraph h</p>
      <p>Goto:
      <ref name="toOne" target="/section1">Section 1</ref>,
      <ref name="toThree" target="/section3">Section 3</ref>
      <ref name="toFour" target="/section4">Section 4</ref>
      </p>
    </section>

    <section newnamespace name="section3">
      <title>Section 3</title>
      <p>Paragraph i</p>
      <p>Paragraph ii</p>
      <p>Paragraph iii</p>
      <p>Paragraph iv</p>
      <p>Paragraph v</p>
      <p>Paragraph vi</p>
      <p>Paragraph vii</p>
      <p>Paragraph viii</p>
      <p>Goto:
      <ref name="toOne" target="/section1">Section 1</ref>
      <ref name="toTwo" target="/section2">Section 2</ref>,
      <ref name="toFour" target="/section4">Section 4</ref>
      </p>
    </section>

    <section newnamespace name="section4">
      <title>Section 4</title>
      <p>Paragraph A</p>
      <p>Paragraph B</p>
      <p>Paragraph C</p>
      <p>Paragraph D</p>
      <p>Paragraph E</p>
      <p>Paragraph F</p>
      <p>Paragraph G</p>
      <p>Paragraph H</p>
      <p>Goto:
      <ref target="/section1">Section 1</ref>,
      <ref name="toOne" target="/section1">Section 1</ref>,
      <ref name="toTwo" target="/section2">Section 2</ref>,
      <ref name="toThree" target="/section3">Section 3</ref>
      <ref name="toTwoe" target="/section2/_p5">Fifth paragraph of Section 3</ref>
      </p>
    </section>

    <section newnamespace name="section5">
    <title>Section 5</title>
    <p>Paragraph I</p>
    <p>Paragraph II</p>
    <p>Paragraph III</p>
    <p>Paragraph IV</p>
    <p>Paragraph V</p>
    <p>Paragraph VI</p>
    <p>Paragraph VII</p>
    <p>Paragraph VII</p>
    <p>Goto:
    <ref target="/section1">Section 1</ref>,
    <ref name="toOne" target="/section1">Section 1</ref>,
    <ref name="toTwo" target="/section2">Section 2</ref>,
    <ref name="toThree" target="/section3">Section 3</ref>
    <ref name="toTwoe" target="/section2/_p5">Fifth paragarph of Section 3</ref>
    </p>
  </section>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/section1_title').should('include.text', 'Section 1')

    cy.get('#\\/section1\\/toFour').click();
    cy.url().should('include', '#/section4')

    cy.get('#\\/section4\\/toOne').click();
    cy.url().should('include', '#/section1')

    cy.get('#\\/section1\\/toThreeii').click();
    cy.url().should('include', '#/section3/_p2')

    cy.get('#\\/section4\\/toTwoe').click();
    cy.url().should('include', '#/section2/_p5')


  });

  it('simple url', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>A link to <ref uri="http://doenet.org">Doenet</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'A link to Doenet.')

    cy.get('#\\/_ref1').should('have.text', 'Doenet').invoke('attr', 'href')
      .then((href) => expect(href).eq("http://doenet.org"));

  })

  it('url with XML entity', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>A link to <ref uri="http://doenet.org/#a&amp;b">Doenet</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'A link to Doenet.')

    cy.get('#\\/_ref1').should('have.text', 'Doenet').invoke('attr', 'href')
      .then((href) => expect(href).eq("http://doenet.org/#a&b"));

  })

  it('ref to DoenetId', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>A link to <ref uri="doenet:doenetId=abcdefg">a Doenet doc</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'A link to a Doenet doc.')

    cy.get('#\\/_ref1').should('have.text', 'a Doenet doc').invoke('attr', 'href')
      .then((href) => expect(href).eq("/public?doenetId=abcdefg"));

  })

  it('url with no link text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>A link to <ref uri="http://doenet.org"/>.</p>
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'A link to http://doenet.org.')

    cy.get('#\\/_ref1').should('have.text', 'http://doenet.org').invoke('attr', 'href')
      .then((href) => expect(href).eq("http://doenet.org"));

  })

  // TODO: do we allow one to use a component/copy inside a uri?
  it('referencing refs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>A link to <ref uri="http://doenet.org">Doenet</ref>.</p>
  <p>Repeat url: <copy target="_ref1" />.</p>
  <p>The link address is: <copy prop="uri" target="_ref1" />.</p>
  <p>The text linked is: <copy prop="linktext" target="_ref1" />.</p>
  <!--<p>Recreate from pieces: <ref uri="$uri" >
     <copy prop="linktext" target="_ref1" /></ref>.</p>
  <text name="uri" hide><copy prop="uri" target="_ref1" /></text>-->
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'A link to Doenet.')


    cy.get('#\\/_ref1').should('have.text', 'Doenet').invoke('attr', 'href')
      .then((href) => expect(href).eq("http://doenet.org"));

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      cy.get(cesc('#' + stateVariables["/_copy1"].replacements[0].componentName))
        .should('have.text', 'Doenet').invoke('attr', 'href')
        .then((href) => expect(href).eq("http://doenet.org"));
    })

    cy.get('#\\/_p3').should('have.text', 'The link address is: http://doenet.org.')

    cy.get('#\\/_p4').should('have.text', 'The text linked is: Doenet.')

    // cy.get('#\\/_p5').should('have.text', 'Recreate from pieces: Doenet.')

    // cy.get('#\\/_ref2').should('have.text', 'Doenet').invoke('attr', 'href')
    //   .then((href) => expect(href).eq("http://doenet.org"));

  })

  it('create button', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p><ref uri="http://doenet.org" name="toDoenet" createButton>Go to Doenet</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/toDoenet button').should('contain', 'Go to Doenet');
  })

  it('ref opens aside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>Goto:
    <ref name="toAside" target="/aside">Aside</ref>
    </p>
    <p>Paragraph one</p>
    <p>Paragraph two</p>
    <p>Paragraph three</p>
    <p>Paragraph four</p>
    <p>Paragraph five</p>
    <p>Paragraph six</p>
    <p>Paragraph seven</p>
    <p>Paragraph eight</p>

    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="inside">Inside the aside</p>
    </aside>

    <p>Paragraph a</p>
    <p>Paragraph b</p>
    <p>Paragraph c</p>
    <p>Paragraph d</p>
    <p>Paragraph e</p>
    <p>Paragraph f</p>
    <p>Paragraph g</p>
    <p>Paragraph h</p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/asideTitle').should('have.text', 'The aside')

    cy.log('Aside closed at the beginning')
    cy.get('#\\/inside').should('not.exist')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/aside"].stateValues.open).eq(false);
    })

    cy.log('clicking link opens aside')
    cy.get('#\\/toAside').click();

    cy.get('#\\/inside').should('have.text', "Inside the aside");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/aside"].stateValues.open).eq(true);
    })

  });

  it('navigate to target action opens aside', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <ref name="toAside" target="/aside" hide>Aside</ref>
    <p>
    <callAction target="toAside" actionName="navigateToTarget" name="go"><label>Go to aside</label></callAction>
    </p>
    <lorem generateParagraphs="2" />

    <aside name="aside">
      <title name="asideTitle">The aside</title>
      <p name="inside">Inside the aside</p>
    </aside>

    <lorem generateParagraphs="10" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/asideTitle').should('have.text', 'The aside')

    cy.log('Aside closed at the beginning')
    cy.get('#\\/inside').should('not.exist')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/aside"].stateValues.open).eq(false);
    })

    cy.log('clicking action opens aside')
    cy.get('#\\/go').click();

    cy.get('#\\/inside').should('have.text', "Inside the aside");
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/aside"].stateValues.open).eq(true);
    })

  });

  it('chain action to navigate to target', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <setup>
      <ref target="countAside" name="refCountAside" />
      <animateFromSequence target="n" from="1" to="5" animationinterval="500" animationmode="increase once" name="count" />
    </setup>

    <callAction target="refCountAside" actionName="navigateToTarget" name="startCount">
      <label>Start counting</label>
    </callAction>
    <callAction target="count" actionName="startAnimation" triggerWith="startCount" />
    <ref name="toAside" target="/aside" hide>Aside</ref>
    <p>
    <callAction target="toAside" actionName="navigateToTarget" name="go"><label>Go to aside</label></callAction>
    </p>

    <lorem generateParagraphs="1" />

    <aside name="countAside">
      <title name="asideTitle">Counting</title>
      Let's count: <number name="n">1</number>
    </aside>

    <lorem generateParagraphs="10" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/asideTitle').should('have.text', 'Counting')

    cy.log('Aside closed at the beginning')
    cy.get('#\\/n').should('not.exist')

    cy.log('clicking action opens aside and starts counting')
    cy.get('#\\/startCount').click();

    cy.get('#\\/n').should('have.text', '1');
    cy.get('#\\/n').should('have.text', '2');
    cy.get('#\\/n').should('have.text', '3');
    cy.get('#\\/n').should('have.text', '4');
    cy.get('#\\/n').should('have.text', '5');

  });



});