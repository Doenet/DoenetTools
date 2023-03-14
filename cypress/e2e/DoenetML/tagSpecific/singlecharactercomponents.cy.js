
describe('Single Character Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('dashes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  1 <ndash/> 2 <mdash/> that's it
  `}, "*");
    });


    // Note these dashes are different unicode even though they display the same here
    cy.get('#\\/_document1').should('contain.text', "1 – 2 — that's it")

  })

  it('nbsp', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
   act<nbsp/>like<nbsp/>one<nbsp/>word
  `}, "*");
    });

    cy.get('#\\/_document1').should('contain.text', "act\u00a0like\u00a0one\u00a0word")

  })

  it('ellipsis', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
   we could do that<ellipsis/>
  `}, "*");
    });

    cy.get('#\\/_document1').should('contain.text', "we could do that…")

  })

  it('unmatched quotes', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
   <rq/><lq/><rsq/><lsq/>
  `}, "*");
    });

    cy.get('#\\/_document1').should('contain.text', "”“’‘")

  })

})
