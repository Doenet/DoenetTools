import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Numberlist Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('numberlist from string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>5 1+1 pi</numberlist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '5, 2, 3.141592654')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
      expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(2);
      expect(components['/_numberlist1'].activeChildren[2].stateValues.value).closeTo(Math.PI, 14);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).closeTo(Math.PI, 14);
    })
  })

  it('numberlist with error in string', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>5 (  1+1 </numberlist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '5, NaN, 2')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
      assert.isNaN(components['/_numberlist1'].activeChildren[1].stateValues.value);
      expect(components['/_numberlist1'].activeChildren[2].stateValues.value).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      assert.isNaN((await components['/_numberlist1'].stateValues.numbers)[1]);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(2);
    })
  })

  it('numberlist with number children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>5</number>
      <number>1+1</number>
    </numberlist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '5, 2')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
      expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
    })
  })

  it('numberlist with number and string children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>
      -1 8/2
      <number>5</number> 9
      <number>1+1</number>
    </numberlist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '-1, 4, 5, 9, 2')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(-1);
      expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(4);
      expect(components['/_numberlist1'].activeChildren[2].stateValues.value).eq(5);
      expect(components['/_numberlist1'].activeChildren[3].stateValues.value).eq(9);
      expect(components['/_numberlist1'].activeChildren[4].stateValues.value).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(-1);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(4);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(5);
      expect((await components['/_numberlist1'].stateValues.numbers)[3]).eq(9);
      expect((await components['/_numberlist1'].stateValues.numbers)[4]).eq(2);
    })
  })

  it('numberlist with math and number children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>5</number>
      <math>1+1</math>
    </numberlist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '5, 2')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_numberlist1'].activeChildren[0].stateValues.value).eq(5);
      expect(components['/_numberlist1'].activeChildren[1].stateValues.value).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
    })
  })

  it('numberlist with numberlist children, test inverse', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>1</number>
      <numberlist>2 3</numberlist>
      <number>4</number>
      <numberlist>
        <numberlist>
          <number>5</number>
          <numberlist>6 7</numberlist>
        </numberlist>
        <numberlist>8 9</numberlist>
      </numberlist>
    </numberlist></p>

    <mathinput bindValueTo="$(_numberlist1{prop='number1'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number2'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number3'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number4'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number5'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number6'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number7'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number8'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number9'})"/>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4, 5, 6, 7, 8, 9')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((await components['/_numberlist1'].stateValues.numbers)[3]).eq(4);
      expect((await components['/_numberlist1'].stateValues.numbers)[4]).eq(5);
      expect((await components['/_numberlist1'].stateValues.numbers)[5]).eq(6);
      expect((await components['/_numberlist1'].stateValues.numbers)[6]).eq(7);
      expect((await components['/_numberlist1'].stateValues.numbers)[7]).eq(8);
      expect((await components['/_numberlist1'].stateValues.numbers)[8]).eq(9);
      expect((await components['/_numberlist2'].stateValues.numbers)[0]).eq(2);
      expect((await components['/_numberlist2'].stateValues.numbers)[1]).eq(3);
      expect((await components['/_numberlist3'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist3'].stateValues.numbers)[1]).eq(6);
      expect((await components['/_numberlist3'].stateValues.numbers)[2]).eq(7);
      expect((await components['/_numberlist3'].stateValues.numbers)[3]).eq(8);
      expect((await components['/_numberlist3'].stateValues.numbers)[4]).eq(9);
      expect((await components['/_numberlist4'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist4'].stateValues.numbers)[1]).eq(6);
      expect((await components['/_numberlist4'].stateValues.numbers)[2]).eq(7);
      expect((await components['/_numberlist5'].stateValues.numbers)[0]).eq(6);
      expect((await components['/_numberlist5'].stateValues.numbers)[1]).eq(7);
      expect((await components['/_numberlist6'].stateValues.numbers)[0]).eq(8);
      expect((await components['/_numberlist6'].stateValues.numbers)[1]).eq(9);
    })

    cy.log('change values')

    cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}-11{enter}", { force: true })
    cy.get("#\\/_mathinput2 textarea").type("{end}{backspace}-12{enter}", { force: true })
    cy.get("#\\/_mathinput3 textarea").type("{end}{backspace}-13{enter}", { force: true })
    cy.get("#\\/_mathinput4 textarea").type("{end}{backspace}-14{enter}", { force: true })
    cy.get("#\\/_mathinput5 textarea").type("{end}{backspace}-15{enter}", { force: true })
    cy.get("#\\/_mathinput6 textarea").type("{end}{backspace}-16{enter}", { force: true })
    cy.get("#\\/_mathinput7 textarea").type("{end}{backspace}-17{enter}", { force: true })
    cy.get("#\\/_mathinput8 textarea").type("{end}{backspace}-18{enter}", { force: true })
    cy.get("#\\/_mathinput9 textarea").type("{end}{backspace}-19{enter}", { force: true })


    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '-11, -12, -13, -14, -15, -16, -17, -18, -19')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(-11);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(-12);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(-13);
      expect((await components['/_numberlist1'].stateValues.numbers)[3]).eq(-14);
      expect((await components['/_numberlist1'].stateValues.numbers)[4]).eq(-15);
      expect((await components['/_numberlist1'].stateValues.numbers)[5]).eq(-16);
      expect((await components['/_numberlist1'].stateValues.numbers)[6]).eq(-17);
      expect((await components['/_numberlist1'].stateValues.numbers)[7]).eq(-18);
      expect((await components['/_numberlist1'].stateValues.numbers)[8]).eq(-19);
      expect((await components['/_numberlist2'].stateValues.numbers)[0]).eq(-12);
      expect((await components['/_numberlist2'].stateValues.numbers)[1]).eq(-13);
      expect((await components['/_numberlist3'].stateValues.numbers)[0]).eq(-15);
      expect((await components['/_numberlist3'].stateValues.numbers)[1]).eq(-16);
      expect((await components['/_numberlist3'].stateValues.numbers)[2]).eq(-17);
      expect((await components['/_numberlist3'].stateValues.numbers)[3]).eq(-18);
      expect((await components['/_numberlist3'].stateValues.numbers)[4]).eq(-19);
      expect((await components['/_numberlist4'].stateValues.numbers)[0]).eq(-15);
      expect((await components['/_numberlist4'].stateValues.numbers)[1]).eq(-16);
      expect((await components['/_numberlist4'].stateValues.numbers)[2]).eq(-17);
      expect((await components['/_numberlist5'].stateValues.numbers)[0]).eq(-16);
      expect((await components['/_numberlist5'].stateValues.numbers)[1]).eq(-17);
      expect((await components['/_numberlist6'].stateValues.numbers)[0]).eq(-18);
      expect((await components['/_numberlist6'].stateValues.numbers)[1]).eq(-19);
    })


  })

  it('numberlist with numberlist children and sugar, test inverse', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>
      1
      <numberlist>2 3</numberlist> 
      <number>4</number>
      <numberlist>
        <numberlist>
          5
          <numberlist>6 7</numberlist>
        </numberlist>
        <numberlist>8 9</numberlist>
      </numberlist>
    </numberlist></p>

    <mathinput bindValueTo="$(_numberlist1{prop='number1'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number2'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number3'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number4'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number5'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number6'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number7'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number8'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number9'})"/>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4, 5, 6, 7, 8, 9')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((await components['/_numberlist1'].stateValues.numbers)[3]).eq(4);
      expect((await components['/_numberlist1'].stateValues.numbers)[4]).eq(5);
      expect((await components['/_numberlist1'].stateValues.numbers)[5]).eq(6);
      expect((await components['/_numberlist1'].stateValues.numbers)[6]).eq(7);
      expect((await components['/_numberlist1'].stateValues.numbers)[7]).eq(8);
      expect((await components['/_numberlist1'].stateValues.numbers)[8]).eq(9);
      expect((await components['/_numberlist2'].stateValues.numbers)[0]).eq(2);
      expect((await components['/_numberlist2'].stateValues.numbers)[1]).eq(3);
      expect((await components['/_numberlist3'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist3'].stateValues.numbers)[1]).eq(6);
      expect((await components['/_numberlist3'].stateValues.numbers)[2]).eq(7);
      expect((await components['/_numberlist3'].stateValues.numbers)[3]).eq(8);
      expect((await components['/_numberlist3'].stateValues.numbers)[4]).eq(9);
      expect((await components['/_numberlist4'].stateValues.numbers)[0]).eq(5);
      expect((await components['/_numberlist4'].stateValues.numbers)[1]).eq(6);
      expect((await components['/_numberlist4'].stateValues.numbers)[2]).eq(7);
      expect((await components['/_numberlist5'].stateValues.numbers)[0]).eq(6);
      expect((await components['/_numberlist5'].stateValues.numbers)[1]).eq(7);
      expect((await components['/_numberlist6'].stateValues.numbers)[0]).eq(8);
      expect((await components['/_numberlist6'].stateValues.numbers)[1]).eq(9);
    })

    cy.log('change values')

    cy.get("#\\/_mathinput1 textarea").type("{end}{backspace}-11{enter}", { force: true })
    cy.get("#\\/_mathinput2 textarea").type("{end}{backspace}-12{enter}", { force: true })
    cy.get("#\\/_mathinput3 textarea").type("{end}{backspace}-13{enter}", { force: true })
    cy.get("#\\/_mathinput4 textarea").type("{end}{backspace}-14{enter}", { force: true })
    cy.get("#\\/_mathinput5 textarea").type("{end}{backspace}-15{enter}", { force: true })
    cy.get("#\\/_mathinput6 textarea").type("{end}{backspace}-16{enter}", { force: true })
    cy.get("#\\/_mathinput7 textarea").type("{end}{backspace}-17{enter}", { force: true })
    cy.get("#\\/_mathinput8 textarea").type("{end}{backspace}-18{enter}", { force: true })
    cy.get("#\\/_mathinput9 textarea").type("{end}{backspace}-19{enter}", { force: true })


    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '-11, -12, -13, -14, -15, -16, -17, -18, -19')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(-11);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(-12);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(-13);
      expect((await components['/_numberlist1'].stateValues.numbers)[3]).eq(-14);
      expect((await components['/_numberlist1'].stateValues.numbers)[4]).eq(-15);
      expect((await components['/_numberlist1'].stateValues.numbers)[5]).eq(-16);
      expect((await components['/_numberlist1'].stateValues.numbers)[6]).eq(-17);
      expect((await components['/_numberlist1'].stateValues.numbers)[7]).eq(-18);
      expect((await components['/_numberlist1'].stateValues.numbers)[8]).eq(-19);
      expect((await components['/_numberlist2'].stateValues.numbers)[0]).eq(-12);
      expect((await components['/_numberlist2'].stateValues.numbers)[1]).eq(-13);
      expect((await components['/_numberlist3'].stateValues.numbers)[0]).eq(-15);
      expect((await components['/_numberlist3'].stateValues.numbers)[1]).eq(-16);
      expect((await components['/_numberlist3'].stateValues.numbers)[2]).eq(-17);
      expect((await components['/_numberlist3'].stateValues.numbers)[3]).eq(-18);
      expect((await components['/_numberlist3'].stateValues.numbers)[4]).eq(-19);
      expect((await components['/_numberlist4'].stateValues.numbers)[0]).eq(-15);
      expect((await components['/_numberlist4'].stateValues.numbers)[1]).eq(-16);
      expect((await components['/_numberlist4'].stateValues.numbers)[2]).eq(-17);
      expect((await components['/_numberlist5'].stateValues.numbers)[0]).eq(-16);
      expect((await components['/_numberlist5'].stateValues.numbers)[1]).eq(-17);
      expect((await components['/_numberlist6'].stateValues.numbers)[0]).eq(-18);
      expect((await components['/_numberlist6'].stateValues.numbers)[1]).eq(-19);
    })

  })

  it('numberlist with self references', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist>
      <number>1</number>
      <numberlist>2 3</numberlist>
      <copy prop="number3" tname="_numberlist1" componentType="number" />
      <numberlist>
        <numberlist name="mid">
          <number><copy prop="number1" tname="_numberlist1" componentType="number" /></number>
          <numberlist>4 5</numberlist>
        </numberlist>
        <numberlist>
          <copy prop="number2" tname="_numberlist1" componentType="number" />
          <copy prop="number5" tname="_numberlist1" componentType="number" />
        </numberlist>
      </numberlist>
      <copy tname="mid" />
    </numberlist></p>

    <mathinput bindValueTo="$(_numberlist1{prop='number1'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number2'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number3'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number4'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number5'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number6'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number7'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number8'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number9'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number10'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number11'})"/>
    <mathinput bindValueTo="$(_numberlist1{prop='number12'})"/>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      let vals = [1, 2, 3, 4, 5]
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = i => vals[mapping[i]];

      let numbers = (await components['/_numberlist1'].stateValues.numbers);

      let mathinputAnchors = []
      for (let i in mapping) {
        mathinputAnchors.push(`#\\/_mathinput${Number(i) + 1} textarea`)
      }

      cy.log('Test value displayed in browser')
      cy.get('#\\/_p1').should('have.text', mapping.map(x => vals[x]).join(", "))

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        for (let i in mapping) {
          expect(numbers[i]).eq(mv(i));
        }
      })

      cy.log('change values')

      for (let changeInd in mapping) {
        cy.window().then(async (win) => {
          vals[mapping[changeInd]] = 100 + Number(changeInd);
          cy.get(mathinputAnchors[changeInd]).type("{end}{backspace}{backspace}{backspace}" + (100 + Number(changeInd)) + "{enter}", { force: true });

          cy.log('Test value displayed in browser')
          cy.get('#\\/_p1').should('have.text', mapping.map(x => vals[x]).join(", "))

          cy.log('Test internal values are set to the correct values')
          cy.window().then(async (win) => {
            for (let i in mapping) {
              expect(numbers[i]).eq(mv(i));
            }
          })

        })

      }

    })
  })

  it('numberlist with maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist maximumnumber="7">
      <number>1</number>
      <numberlist maximumnumber="2">2 3 4 5</numberlist>
      <number>6</number>
      <numberlist maximumnumber="4">
        <numberlist maximumnumber="2">
          <number>7</number>
          <numberlist>8 9</numberlist>
        </numberlist>
        <numberlist>10 11 12</numberlist>
      </numberlist>
    </numberlist></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 6, 7, 8, 10')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      expect((await components['/_numberlist1'].stateValues.numbers).length).eq(7);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((await components['/_numberlist1'].stateValues.numbers)[3]).eq(6);
      expect((await components['/_numberlist1'].stateValues.numbers)[4]).eq(7);
      expect((await components['/_numberlist1'].stateValues.numbers)[5]).eq(8);
      expect((await components['/_numberlist1'].stateValues.numbers)[6]).eq(10);
      expect((await components['/_numberlist2'].stateValues.numbers).length).eq(2);
      expect((await components['/_numberlist2'].stateValues.numbers)[0]).eq(2);
      expect((await components['/_numberlist2'].stateValues.numbers)[1]).eq(3);
      expect((await components['/_numberlist3'].stateValues.numbers).length).eq(4);
      expect((await components['/_numberlist3'].stateValues.numbers)[0]).eq(7);
      expect((await components['/_numberlist3'].stateValues.numbers)[1]).eq(8);
      expect((await components['/_numberlist3'].stateValues.numbers)[2]).eq(10);
      expect((await components['/_numberlist3'].stateValues.numbers)[3]).eq(11);
      expect((await components['/_numberlist4'].stateValues.numbers).length).eq(2);
      expect((await components['/_numberlist4'].stateValues.numbers)[0]).eq(7);
      expect((await components['/_numberlist4'].stateValues.numbers)[1]).eq(8);
      expect((await components['/_numberlist5'].stateValues.numbers).length).eq(2);
      expect((await components['/_numberlist5'].stateValues.numbers)[0]).eq(8);
      expect((await components['/_numberlist5'].stateValues.numbers)[1]).eq(9);
      expect((await components['/_numberlist6'].stateValues.numbers).length).eq(3);
      expect((await components['/_numberlist6'].stateValues.numbers)[0]).eq(10);
      expect((await components['/_numberlist6'].stateValues.numbers)[1]).eq(11);
      expect((await components['/_numberlist6'].stateValues.numbers)[2]).eq(12);
    })
  })

  it('numberlist within numberlists, with child hide', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist hide="true">1 2 3</numberlist></p>

    <p><copy name="numberlist1a" hide="false" tname="_numberlist1" /></p>

    <p><numberlist>
      <number>4</number>
      <copy tname="_numberlist1" />
      <number hide>5</number>
      <copy tname="numberlist1a" />
    </numberlist></p>

    <p><copy name="numberlist3" maximumnumber="6" tname="_numberlist2" /></p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')

    cy.get('#\\/_p1').should('have.text', '')

    cy.get('#\\/_p2').should('have.text', '1, 2, 3')

    cy.get('#\\/_p3').should('have.text', '4, 1, 2, 3, 1, 2, 3')

    cy.get('#\\/_p4').should('have.text', '4, 1, 2, 3, 1')


    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      let numberlist1a = components["/numberlist1a"].replacements[0];
      let numberlist3 = components["/numberlist3"].replacements[0];
      expect((await components['/_numberlist1'].stateValues.numbers).length).eq(3);
      expect((await components['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((await components['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((await components['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((await numberlist1a.stateValues.numbers).length).eq(3);
      expect((await numberlist1a.stateValues.numbers)[0]).eq(1);
      expect((await numberlist1a.stateValues.numbers)[1]).eq(2);
      expect((await numberlist1a.stateValues.numbers)[2]).eq(3);
      expect((await components['/_numberlist2'].stateValues.numbers).length).eq(8);
      expect((await components['/_numberlist2'].stateValues.numbers)[0]).eq(4);
      expect((await components['/_numberlist2'].stateValues.numbers)[1]).eq(1);
      expect((await components['/_numberlist2'].stateValues.numbers)[2]).eq(2);
      expect((await components['/_numberlist2'].stateValues.numbers)[3]).eq(3);
      expect((await components['/_numberlist2'].stateValues.numbers)[4]).eq(5);
      expect((await components['/_numberlist2'].stateValues.numbers)[5]).eq(1);
      expect((await components['/_numberlist2'].stateValues.numbers)[6]).eq(2);
      expect((await components['/_numberlist2'].stateValues.numbers)[7]).eq(3);
      expect((await numberlist3.stateValues.numbers).length).eq(6);
      expect((await numberlist3.stateValues.numbers)[0]).eq(4);
      expect((await numberlist3.stateValues.numbers)[1]).eq(1);
      expect((await numberlist3.stateValues.numbers)[2]).eq(2);
      expect((await numberlist3.stateValues.numbers)[3]).eq(3);
      expect((await numberlist3.stateValues.numbers)[4]).eq(5);
      expect((await numberlist3.stateValues.numbers)[5]).eq(1);

    })

  })

})
