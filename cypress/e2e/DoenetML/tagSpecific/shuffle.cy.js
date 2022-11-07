
describe('Shuffle Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('consistent order for n elements for given variant', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>m: <mathinput prefill="1" name="m" /> <number name="m2" copySource="m" /></p>
  <p>n: <mathinput prefill="6" name="n" /> <number name="n2" copySource="n" /></p>
  <p name="pList"><aslist><shuffle name="sh">
    <sequence from="$m" to="$n" />
  </shuffle></aslist></p>
  <p name="pList2"><aslist>$sh</aslist></p>
  <p name="pList3">$_aslist1</p>
  `,
        requestedVariantIndex: 1,
      }, "*");
    });

    cy.get('#\\/n2').should('have.text', '6');

    let texts = {};
    let orders = {};


    cy.window().then(async (win) => {
      let m = 1, n = 6;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(n - m + 1).keys()].map(x => x + m))

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })


    cy.log('switch n to 8')

    cy.get('#\\/n textarea').type("{end}{backspace}8{enter}", { force: true });
    cy.get('#\\/n2').should('have.text', '8');

    cy.window().then(async (win) => {
      let m = 1, n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(n - m + 1).keys()].map(x => x + m))

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })


    cy.log('get another list of length 6 by setting m to 3')

    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true });
    cy.get('#\\/m2').should('have.text', '3');

    cy.window().then(async (win) => {
      let m = 3, n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect(componentOrder).eqls(orders[[1, 6]])

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })


    cy.log('get another list of length 8 by setting n to 10')

    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true });
    cy.get('#\\/n2').should('have.text', '10');

    cy.window().then(async (win) => {
      let m = 3, n = 10;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect(componentOrder).eqls(orders[[1, 8]])

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })

    cy.log('values change with another variant')

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <p>m: <mathinput prefill="1" name="m" /> <number name="m2" copySource="m" /></p>
  <p>n: <mathinput prefill="6" name="n" /> <number name="n2" copySource="n" /></p>
  <p name="pList"><aslist><shuffle name="sh">
    <sequence from="$m" to="$n" />
  </shuffle></aslist></p>
  <p name="pList2"><aslist>$sh</aslist></p>
  <p name="pList3">$_aslist1</p>
  `,
        requestedVariantIndex: 2,
      }, "*");
    });


    cy.get('#\\/m2').should('have.text', '1');
    cy.get('#\\/n2').should('have.text', '6');

    cy.window().then(async (win) => {
      let m = 1, n = 6;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect(componentOrder).not.eqls(orders[[m, n]])

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(n - m + 1).keys()].map(x => x + m))

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })



    cy.log('switch n to 8')

    cy.get('#\\/n textarea').type("{end}{backspace}8{enter}", { force: true });
    cy.get('#\\/n2').should('have.text', '8');

    cy.window().then(async (win) => {
      let m = 1, n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect(componentOrder).not.eqls(orders[[m, n]])

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(n - m + 1).keys()].map(x => x + m))

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })


    cy.log('get another list of length 6 by setting m to 3')

    cy.get('#\\/m textarea').type("{end}{backspace}3{enter}", { force: true });
    cy.get('#\\/m2').should('have.text', '3');

    cy.window().then(async (win) => {
      let m = 3, n = 8;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect(componentOrder).eqls(orders[[1, 6]])

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })


    cy.log('get another list of length 8 by setting n to 10')

    cy.get('#\\/n textarea').type("{end}{backspace}10{enter}", { force: true });
    cy.get('#\\/n2').should('have.text', '10');

    cy.window().then(async (win) => {
      let m = 3, n = 10;

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect(componentOrder).eqls(orders[[1, 8]])

      orders[[m, n]] = componentOrder;

      let pText = componentOrder.map(x => x + m - 1).join(", ");

      cy.get("#\\/pList").should('have.text', pText)
      cy.get("#\\/pList2").should('have.text', pText)
      cy.get("#\\/pList3").should('have.text', pText)

      texts[[m, n]] = pText;

    })


  })

  it('shuffle with math and mathlists', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p name="pList"><aslist><shuffle name="sh">
    <math>x</math>
    <math>y</math>
    <math>z</math>
    <mathlist>a b c d</mathlist>
    <math>q</math>
    <mathlist>1 2 3 4</mathlist>
  </shuffle></aslist></p>
  `,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    let options = ["x", "y", "z", "a", "b", "c", "d", "q", "1", "2", "3", "4"]


    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(12).keys()].map(x => x + 1))

      let orderedOptions = componentOrder.map(x => options[x - 1]);

      let indOfa = orderedOptions.indexOf("a");
      let indOfb = orderedOptions.indexOf("b");
      let indOfc = orderedOptions.indexOf("c");
      let indOfd = orderedOptions.indexOf("d");

      expect([indOfb, indOfc, indOfd]).not.eqls([indOfa + 1, indOfa + 2, indOfa + 3])

      let indOf1 = orderedOptions.indexOf("1");
      let indOf2 = orderedOptions.indexOf("2");
      let indOf3 = orderedOptions.indexOf("3");
      let indOf4 = orderedOptions.indexOf("4");

      expect([indOf2, indOf3, indOf4]).not.eqls([indOf1 + 1, indOf1 + 2, indOf1 + 3])


      for (let ind = 0; ind < 12; ind++) {
        cy.get('#\\/pList .mjx-mrow').eq(ind).should('contain.text', orderedOptions[ind])
      }

    })


  })

  it('shuffle with number and numberlists', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p name="pList"><aslist><shuffle name="sh">
    <number>10</number>
    <number>11</number>
    <number>12</number>
    <numberlist>101 102 103 104 105</numberlist>
    <number>-5</number>
    <numberlist>1 2 3 4</numberlist>
    <number>-99</number>
    </shuffle></aslist></p>
  `,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    let options = ["10", "11", "12", "101", "102", "103", "104", "105", "-5", "1", "2", "3", "4", "-99"]


    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(14).keys()].map(x => x + 1))

      let orderedOptions = componentOrder.map(x => options[x - 1]);

      let indOf1 = orderedOptions.indexOf("1");
      let indOf2 = orderedOptions.indexOf("2");
      let indOf3 = orderedOptions.indexOf("3");
      let indOf4 = orderedOptions.indexOf("4");

      expect([indOf2, indOf3, indOf4]).not.eqls([indOf1 + 1, indOf1 + 2, indOf1 + 3])

      let indOf101 = orderedOptions.indexOf("101");
      let indOf102 = orderedOptions.indexOf("102");
      let indOf103 = orderedOptions.indexOf("103");
      let indOf104 = orderedOptions.indexOf("104");
      let indOf105 = orderedOptions.indexOf("105");

      expect([indOf102, indOf103, indOf104, indOf105]).not.eqls([indOf101 + 1, indOf101 + 2, indOf101 + 3, indOf101 + 4])

      cy.get('#\\/pList').should('have.text', orderedOptions.join(", "))

    })


  })

  it('shuffle with text and textlists', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p name="pList"><aslist><shuffle name="sh">
    <text>apple</text>
    <text>banana</text>
    <text>orange</text>
    <textlist>hello there now then too</textlist>
    <text>almost</text>
    <textlist>1 2 3 4</textlist>
    <text>above</text>
    </shuffle></aslist></p>
  `,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');

    let options = ["apple", "banana", "orange", "hello", "there", "now", "then", "too", "almost", "1", "2", "3", "4", "above"]


    cy.window().then(async (win) => {

      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

      expect([...componentOrder].sort((a, b) => a - b)).eqls([...Array(14).keys()].map(x => x + 1))

      let orderedOptions = componentOrder.map(x => options[x - 1]);

      let indOf1 = orderedOptions.indexOf("1");
      let indOf2 = orderedOptions.indexOf("2");
      let indOf3 = orderedOptions.indexOf("3");
      let indOf4 = orderedOptions.indexOf("4");

      expect([indOf2, indOf3, indOf4]).not.eqls([indOf1 + 1, indOf1 + 2, indOf1 + 3])

      let indOfhello = orderedOptions.indexOf("hello");
      let indOfthere = orderedOptions.indexOf("there");
      let indOfnow = orderedOptions.indexOf("now");
      let indOfthen = orderedOptions.indexOf("then");
      let indOftoo = orderedOptions.indexOf("too");

      expect([indOfthere, indOfnow, indOfthen, indOftoo]).not.eqls([indOfhello + 1, indOfhello + 2, indOfhello + 3, indOfhello + 4])

      cy.get('#\\/pList').should('have.text', orderedOptions.join(", "))

    })


  })



})