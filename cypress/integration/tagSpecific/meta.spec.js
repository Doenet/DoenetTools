
describe('Meta Tag Tests', function () {

  beforeEach(() => {

    cy.visit('/test')

  })


  it('meta keywords', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
    <meta>
      <keyword>cat</keyword>
      <keyword>dog</keyword>
    </meta>
    
    <p>Keywords from meta: <aslist><ref prop="keywords">_meta1</ref></aslist></p>
    <p>Keywords from document: <aslist><ref prop="keywords">_document1</ref></aslist></p>
    <p>Keyword 1 from meta: <aslist><ref prop="keyword1">_meta1</ref></aslist></p>
    <p>Keyword 1 from document: <aslist><ref prop="keyword1">_document1</ref></aslist></p>
    <p>Keyword 2 from meta: <aslist><ref prop="keyword2">_meta1</ref></aslist></p>
    <p>Keyword 2 from document: <aslist><ref prop="keyword2">_document1</ref></aslist></p>
    <p>Keyword 3 from meta: <aslist><ref prop="keyword3">_meta1</ref></aslist></p>
    <p>Keyword 3 from document: <aslist><ref prop="keyword3">_document1</ref></aslist></p>
    <p>Keyword from meta: <aslist><ref prop="keyword">_meta1</ref></aslist></p>
    <p>Keyword from document: <aslist><ref prop="keyword">_document1</ref></aslist></p>
        `}, "*");
    });

    cy.log('keywords in text');
    cy.get('p#\\/_p1').should('have.text', 'Keywords from meta: cat, dog')
    cy.get('p#\\/_p2').should('have.text', 'Keywords from document: cat, dog')
    cy.get('p#\\/_p3').should('have.text', 'Keyword 1 from meta: cat')
    cy.get('p#\\/_p4').should('have.text', 'Keyword 1 from document: cat')
    cy.get('p#\\/_p5').should('have.text', 'Keyword 2 from meta: dog')
    cy.get('p#\\/_p6').should('have.text', 'Keyword 2 from document: dog')
    cy.get('p#\\/_p7').should('have.text', 'Keyword 3 from meta: ')
    cy.get('p#\\/_p8').should('have.text', 'Keyword 3 from document: ')
    cy.get('p#\\/_p9').should('have.text', 'Keyword from meta: cat')
    cy.get('p#\\/_p10').should('have.text', 'Keyword from document: cat')
 
    cy.log('keyword state variables');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_meta1'].state.keywords).eqls(['cat','dog']);
      expect(components['/_document1'].state.keywords).eqls(['cat','dog']);
    })

  })

})



