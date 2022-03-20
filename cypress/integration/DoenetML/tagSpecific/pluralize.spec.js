
describe('Pluralize Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('number followed by noun', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <p><pluralize>one dog</pluralize></p>
    <p><pluralize>two dog</pluralize></p>
    <p><pluralize>zero dog</pluralize></p>
    <p><pluralize>1 mouse</pluralize></p>
    <p><pluralize>2 mouse</pluralize></p>
    <p><pluralize>0 mouse</pluralize></p>
    <p><pluralize>one thousand bus</pluralize></p>
    <p><pluralize>0.5 bus</pluralize></p>
    <p><pluralize>1 bus</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'one dog')
    cy.get('#\\/_p2').should('have.text', 'two dogs')
    cy.get('#\\/_p3').should('have.text', 'zero dogs')
    cy.get('#\\/_p4').should('have.text', '1 mouse')
    cy.get('#\\/_p5').should('have.text', '2 mice')
    cy.get('#\\/_p6').should('have.text', '0 mice')
    cy.get('#\\/_p7').should('have.text', 'one thousand buses')
    cy.get('#\\/_p8').should('have.text', '0.5 buses')
    cy.get('#\\/_p9').should('have.text', '1 bus')

  })

  it('single word', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <p><pluralize>dog</pluralize></p>
    <p><pluralize>mouse</pluralize></p>
    <p><pluralize>bus</pluralize></p>
    <p><pluralize>goose</pluralize></p>
    <p><pluralize>pony</pluralize></p>
    <p><pluralize>only</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'dogs')
    cy.get('#\\/_p2').should('have.text', 'mice')
    cy.get('#\\/_p3').should('have.text', 'buses')
    cy.get('#\\/_p4').should('have.text', 'geese')
    cy.get('#\\/_p5').should('have.text', 'ponies')
    cy.get('#\\/_p6').should('have.text', 'only')

  })

  it('number followed by noun with plural form', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  
      <p><pluralize pluralForm="cheetahs">one dog</pluralize></p>
      <p><pluralize pluralForm="cheetahs">two dog</pluralize></p>
      <p><pluralize pluralForm="cheetahs">zero dog</pluralize></p>
      <p><pluralize pluralForm="cheetahs">1 mouse</pluralize></p>
      <p><pluralize pluralForm="cheetahs">2 mouse</pluralize></p>
      <p><pluralize pluralForm="cheetahs">0 mouse</pluralize></p>
      <p><pluralize pluralForm="cheetahs">one thousand bus</pluralize></p>
      <p><pluralize pluralForm="cheetahs">0.5 bus</pluralize></p>
      <p><pluralize pluralForm="cheetahs">1 bus</pluralize></p>
      `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'one dog')
    cy.get('#\\/_p2').should('have.text', 'two cheetahs')
    cy.get('#\\/_p3').should('have.text', 'zero cheetahs')
    cy.get('#\\/_p4').should('have.text', '1 mouse')
    cy.get('#\\/_p5').should('have.text', '2 cheetahs')
    cy.get('#\\/_p6').should('have.text', '0 cheetahs')
    cy.get('#\\/_p7').should('have.text', 'one thousand cheetahs')
    cy.get('#\\/_p8').should('have.text', '0.5 cheetahs')
    cy.get('#\\/_p9').should('have.text', '1 bus')

  })

  it('single word, with plural form', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <p><pluralize pluralForm="cheetahs">dog</pluralize></p>
    <p><pluralize pluralForm="cheetahs">mouse</pluralize></p>
    <p><pluralize pluralForm="cheetahs">bus</pluralize></p>
    <p><pluralize pluralForm="cheetahs">goose</pluralize></p>
    <p><pluralize pluralForm="cheetahs">pony</pluralize></p>
    <p><pluralize pluralForm="cheetahs">only</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'cheetahs')
    cy.get('#\\/_p2').should('have.text', 'cheetahs')
    cy.get('#\\/_p3').should('have.text', 'cheetahs')
    cy.get('#\\/_p4').should('have.text', 'cheetahs')
    cy.get('#\\/_p5').should('have.text', 'cheetahs')
    cy.get('#\\/_p6').should('have.text', 'cheetahs')

  })

  it('number followed by noun, based on number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <p><pluralize basedOnNumber="3">one dog</pluralize></p>
    <p><pluralize basedOnNumber="1">two dog</pluralize></p>
    <p><pluralize basedOnNumber="5">zero dog</pluralize></p>
    <p><pluralize basedOnNumber="3">1 mouse</pluralize></p>
    <p><pluralize basedOnNumber="8">2 mouse</pluralize></p>
    <p><pluralize basedOnNumber="1">0 mouse</pluralize></p>
    <p><pluralize basedOnNumber="1">one thousand bus</pluralize></p>
    <p><pluralize basedOnNumber="2">0.5 bus</pluralize></p>
    <p><pluralize basedOnNumber="3">1 bus</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'one dogs')
    cy.get('#\\/_p2').should('have.text', 'two dog')
    cy.get('#\\/_p3').should('have.text', 'zero dogs')
    cy.get('#\\/_p4').should('have.text', '1 mice')
    cy.get('#\\/_p5').should('have.text', '2 mice')
    cy.get('#\\/_p6').should('have.text', '0 mouse')
    cy.get('#\\/_p7').should('have.text', 'one thousand bus')
    cy.get('#\\/_p8').should('have.text', '0.5 buses')
    cy.get('#\\/_p9').should('have.text', '1 buses')

  })


  it('single word, based on number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `

    <p><pluralize basedOnNumber="7">dog</pluralize></p>
    <p><pluralize basedOnNumber="1">dog</pluralize></p>
    <p><pluralize basedOnNumber="1.6">mouse</pluralize></p>
    <p><pluralize basedOnNumber="1">mouse</pluralize></p>
    <p><pluralize basedOnNumber="0">bus</pluralize></p>
    <p><pluralize basedOnNumber="1">bus</pluralize></p>
    <p><pluralize basedOnNumber="0.5">goose</pluralize></p>
    <p><pluralize basedOnNumber="1">goose</pluralize></p>
    <p><pluralize basedOnNumber="-1">pony</pluralize></p>
    <p><pluralize basedOnNumber="1">pony</pluralize></p>
    <p><pluralize basedOnNumber="3">only</pluralize></p>
    <p><pluralize basedOnNumber="1">only</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'dogs')
    cy.get('#\\/_p2').should('have.text', 'dog')
    cy.get('#\\/_p3').should('have.text', 'mice')
    cy.get('#\\/_p4').should('have.text', 'mouse')
    cy.get('#\\/_p5').should('have.text', 'buses')
    cy.get('#\\/_p6').should('have.text', 'bus')
    cy.get('#\\/_p7').should('have.text', 'geese')
    cy.get('#\\/_p8').should('have.text', 'goose')
    cy.get('#\\/_p9').should('have.text', 'ponies')
    cy.get('#\\/_p10').should('have.text', 'pony')
    cy.get('#\\/_p11').should('have.text', 'only')
    cy.get('#\\/_p12').should('have.text', 'only')

  })


  it('phrases', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p><pluralize>one dog three cat two squirrel or 1 cat plus 7 goose</pluralize></p>
    <p><pluralize>one hundred green plane flew through one big sky, rather than six shiny sky</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p1').should('have.text', 'one dog three cats two squirrels or 1 cat plus 7 geese')
    cy.get('#\\/_p2').should('have.text', 'one hundred green planes flew through one big sky, rather than six shiny skies')

  })


  it('dynamic', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>How many geese? <textinput name="ngeese" prefill="1" /></p>
    <p>How many teeth? <textinput name="nteeth" prefill="1" /></p>

    <p><pluralize>I have <copy prop="value" target="ngeese" /> goose even if one doesn't have <copy prop="value" target="nteeth" /> tooth</pluralize></p>
    `}, "*");
    });

    cy.get('#\\/_p3').should('have.text', `I have 1 goose even if one doesn't have 1 tooth`);

    cy.get('#\\/ngeese_input').clear().type("three{enter}");
    cy.get('#\\/_p3').should('have.text', `I have three geese even if one doesn't have 1 tooth`);

    cy.get('#\\/nteeth_input').clear().type("0{enter}");
    cy.get('#\\/_p3').should('have.text', `I have three geese even if one doesn't have 0 teeth`);

    cy.get('#\\/nteeth_input').clear().type("one{enter}");
    cy.get('#\\/_p3').should('have.text', `I have three geese even if one doesn't have one tooth`);

    cy.get('#\\/nteeth_input').clear().type("one thousand{enter}");
    cy.get('#\\/_p3').should('have.text', `I have three geese even if one doesn't have one thousand teeth`);

    cy.get('#\\/ngeese_input').clear().type("-1{enter}");
    cy.get('#\\/_p3').should('have.text', `I have -1 geese even if one doesn't have one thousand teeth`);

    cy.get('#\\/ngeese_input').clear().type("-2{enter}");
    cy.get('#\\/_p3').should('have.text', `I have -2 geese even if one doesn't have one thousand teeth`);

  })
})



