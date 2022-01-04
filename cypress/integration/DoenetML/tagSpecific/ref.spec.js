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
    cy.visit('/cypressTest')

  })

  it('ref to sections', () => {
    cy.window().then((win) => {
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
    cy.get('#\\/section1_title').should('have.text', 'Section 1')

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
    cy.window().then((win) => {
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
    cy.window().then((win) => {
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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p>A link to <ref uri="doenet:doenetId=abcdefg">a Doenet doc</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'A link to a Doenet doc.')

    cy.get('#\\/_ref1').should('have.text', 'a Doenet doc').invoke('attr', 'href')
      .then((href) => expect(href).eq("https://www.doenet.org/#/course?tool=assignment&doenetId=abcdefg"));

  })

  it('url with no link text', () => {
    cy.window().then((win) => {
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
    cy.window().then((win) => {
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

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      cy.get(cesc('#' + components["/_copy1"].replacements[0].componentName))
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
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <p><ref uri="http://doenet.org" name="toDoenet" createButton>Go to Doenet</ref>.</p>
  `}, "*");
    });

    cy.get('#\\/toDoenet button').should('contain', 'Go to Doenet');
  })


});