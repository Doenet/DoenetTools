
describe('Image Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })


  it('image from external source', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="300px" description="A giant anteater" />
  `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load
    cy.get('#\\/_image1').invoke('attr', 'width').then((width) => expect(width).eq('300px'))
    cy.get('#\\/_image1').invoke('attr', 'height').then((height) => expect(height).eq(undefined))
    cy.get('#\\/_image1').invoke('attr', 'alt').then((alt) => expect(alt).eq("A giant anteater" ))
  })


})



