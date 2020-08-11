describe('Math Display Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('inline and display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <m>sin(x)</m>
    <me>cos(x)</me>
    `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)')
    })
    // not sure how to test that it is centered
    cy.get('#\\/_me1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)')
    })

  });

  it('numbered equations', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <men>sin(x)</men>
    <men>cos(x)</men>
    <men>tan(x)</men>
    `}, "*");
    });
    cy.log('Test value displayed in browser')
    cy.get('#\\/_men1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)(1)')
    })
    cy.get('#\\/_men2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)(2)')
    })
    cy.get('#\\/_men3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('tan(x)(3)')
    })

    // TODO: how to test this?  Or is this not relevant anymore?
    // Do we test this by using the editor?

    // // still same numbers after hitting update again
    // cy.get('[data-cy=editorUpdateButton]').click(); //Update Button
    // cy.log('Test value displayed in browser')
    // cy.get('#__men1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('sin(x)(1)')
    // })
    // cy.get('#__men2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('cos(x)(2)')
    // })
    // cy.get('#__men3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
    //   expect(text.trim()).equal('tan(x)(3)')
    // })

    // don't know how to test numbering with reset button
    // as don't know how to change the default Doenet code

  });

  it('math inside', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <m><math simplify>x+x</math></m>
    <me><math simplify>y+y</math></me>
    <men><math simplify>z+z</math></men>
    `}, "*");
    });
    cy.log('Test value displayed in browser')
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2x')
    })
    cy.get('#\\/_me1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2y')
    })
    cy.get('#\\/_men1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2z(1)')
    })

  });

  it('align equations', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <md>
      <mrow>q \\amp = sin(x)</mrow>
      <mrow>cos(x) \\amp = z</mrow>
    </md>
    <mdn>
      <mrow>q \\amp = sin(x)</mrow>
      <mrow>cos(x) \\amp = z</mrow>
    </mdn>
    `}, "*");
    });

    cy.log('Test value displayed in browser')
    cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q=sin(x)')
    })
    cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)=z')
    })
    cy.get('#\\/_mdn1').find('.mjx-mlabeledtr').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q=sin(x)')
    })
    cy.get('#\\/_mdn1').find('.mjx-mlabeledtr').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)=z')
    })
    cy.get('#\\/_mdn1').find('.mjx-label').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1)')
    })
    cy.get('#\\/_mdn1').find('.mjx-label').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('(2)')
    })
    
  });

  it('add commas to large integers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p><intcomma>25236501.35</intcomma></p>
    <p><intcomma><math>25236501.35</math></intcomma></p>
    <p><m><intcomma>25236501.35</intcomma></m></p>
    <p><m><intcomma><math>25236501.35</math></intcomma></m></p>
  `}, "*");
    });

    cy.get('#\\/_p1').should('have.text','25,236,501.35');
    cy.get('#\\/_p2').should('have.text','25,236,501.35');
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25,236,501.35')
    })
    cy.get('#\\/_m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25,236,501.35')
    })

  });

})
