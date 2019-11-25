describe('Xref Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
      
    })
      
  it('xref to sections',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
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
      <xref name="toTwo" ref="/section2">Section 2</xref>,
      <xref name="toThree" ref="/section3">Section 3</xref>
      <xref name="toFour" ref="/section4">Section 4</xref>
      <xref name="toThreeii" ref="/section3/_p2">Second paragraph of Section 3</xref>
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
      <xref name="toOne" ref="/section1">Section 1</xref>,
      <xref name="toThree" ref="/section3">Section 3</xref>
      <xref name="toFour" ref="/section4">Section 4</xref>
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
      <xref name="toOne" ref="/section1">Section 1</xref>
      <xref name="toTwo" ref="/section2">Section 2</xref>,
      <xref name="toFour" ref="/section4">Section 4</xref>
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
      <xref ref="/section1">Section 1</xref>,
      <xref name="toOne" ref="/section1">Section 1</xref>,
      <xref name="toTwo" ref="/section2">Section 2</xref>,
      <xref name="toThree" ref="/section3">Section 3</xref>
      <xref name="toTwoe" ref="/section2/_p5">Fifth paragraph of Section 3</xref>
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
    <xref ref="/section1">Section 1</xref>,
    <xref name="toOne" ref="/section1">Section 1</xref>,
    <xref name="toTwo" ref="/section2">Section 2</xref>,
    <xref name="toThree" ref="/section3">Section 3</xref>
    <xref name="toTwoe" ref="/section2/_p5">Fifth paragarph of Section 3</xref>
    </p>
  </section>

    `},"*");
    });

    // to wait for page to load
    cy.get('#\\/section1_heading').should('have.text', 'Section 1')

    cy.get('#\\/section1\\/tofour').click();
    cy.url().should('include', '#/section4')

    cy.get('#\\/section4\\/toone').click();
    cy.url().should('include', '#/section1')

    cy.get('#\\/section1\\/tothreeii').click();
    cy.url().should('include', '#/section3/_p2')

    cy.get('#\\/section4\\/totwoe').click();
    cy.url().should('include', '#/section2/_p5')


  });

});