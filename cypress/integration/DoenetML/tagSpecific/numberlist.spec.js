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
    cy.clearIndexedDB();
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[0].componentName].stateValues.value).eq(5);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[1].componentName].stateValues.value).eq(2);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[2].componentName].stateValues.value).closeTo(Math.PI, 14);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).closeTo(Math.PI, 14);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[0].componentName].stateValues.value).eq(5);
      assert.isNaN(stateVariables[stateVariables['/_numberlist1'].activeChildren[1].componentName].stateValues.value);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[2].componentName].stateValues.value).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      assert.isNaN((stateVariables['/_numberlist1'].stateValues.numbers)[1]);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(2);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[0].componentName].stateValues.value).eq(5);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[1].componentName].stateValues.value).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[0].componentName].stateValues.value).eq(-1);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[1].componentName].stateValues.value).eq(4);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[2].componentName].stateValues.value).eq(5);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[3].componentName].stateValues.value).eq(9);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[4].componentName].stateValues.value).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(-1);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(4);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(5);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[3]).eq(9);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[4]).eq(2);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[0].componentName].stateValues.value).eq(5);
      expect(stateVariables[stateVariables['/_numberlist1'].activeChildren[1].componentName].stateValues.value).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[3]).eq(4);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[4]).eq(5);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[5]).eq(6);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[6]).eq(7);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[7]).eq(8);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[8]).eq(9);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[0]).eq(2);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[1]).eq(3);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[1]).eq(6);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[2]).eq(7);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[3]).eq(8);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[4]).eq(9);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[1]).eq(6);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[2]).eq(7);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[0]).eq(6);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[1]).eq(7);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[0]).eq(8);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[1]).eq(9);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(-11);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(-12);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(-13);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[3]).eq(-14);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[4]).eq(-15);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[5]).eq(-16);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[6]).eq(-17);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[7]).eq(-18);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[8]).eq(-19);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[0]).eq(-12);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[1]).eq(-13);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[0]).eq(-15);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[1]).eq(-16);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[2]).eq(-17);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[3]).eq(-18);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[4]).eq(-19);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[0]).eq(-15);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[1]).eq(-16);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[2]).eq(-17);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[0]).eq(-16);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[1]).eq(-17);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[0]).eq(-18);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[1]).eq(-19);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[3]).eq(4);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[4]).eq(5);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[5]).eq(6);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[6]).eq(7);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[7]).eq(8);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[8]).eq(9);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[0]).eq(2);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[1]).eq(3);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[1]).eq(6);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[2]).eq(7);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[3]).eq(8);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[4]).eq(9);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[0]).eq(5);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[1]).eq(6);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[2]).eq(7);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[0]).eq(6);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[1]).eq(7);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[0]).eq(8);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[1]).eq(9);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(-11);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(-12);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(-13);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[3]).eq(-14);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[4]).eq(-15);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[5]).eq(-16);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[6]).eq(-17);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[7]).eq(-18);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[8]).eq(-19);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[0]).eq(-12);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[1]).eq(-13);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[0]).eq(-15);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[1]).eq(-16);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[2]).eq(-17);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[3]).eq(-18);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[4]).eq(-19);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[0]).eq(-15);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[1]).eq(-16);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[2]).eq(-17);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[0]).eq(-16);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[1]).eq(-17);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[0]).eq(-18);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[1]).eq(-19);
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
      <copy prop="number3" target="_numberlist1" componentType="number" />
      <numberlist>
        <numberlist name="mid">
          <number><copy prop="number1" target="_numberlist1" componentType="number" /></number>
          <numberlist>4 5</numberlist>
        </numberlist>
        <numberlist>
          <copy prop="number2" target="_numberlist1" componentType="number" />
          <copy prop="number5" target="_numberlist1" componentType="number" />
        </numberlist>
      </numberlist>
      <copy target="mid" />
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
      let stateVariables = await win.returnAllStateVariables1();

      let vals = [1, 2, 3, 4, 5]
      let mapping = [0, 1, 2, 2, 0, 3, 4, 1, 0, 0, 3, 4];
      let mv = i => vals[mapping[i]];

      let numbers = (stateVariables['/_numberlist1'].stateValues.numbers);

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
          cy.get(mathinputAnchors[changeInd]).type("{ctrl+home}{shift+end}{backspace}" + (100 + Number(changeInd)) + "{enter}", { force: true });

          cy.log('Test value displayed in browser')
          cy.get('#\\/_p1').should('have.text', mapping.map(x => vals[x]).join(", "))

          cy.log('Test internal values are set to the correct values')
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let numbers = (stateVariables['/_numberlist1'].stateValues.numbers);
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
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables['/_numberlist1'].stateValues.numbers).length).eq(7);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[3]).eq(6);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[4]).eq(7);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[5]).eq(8);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[6]).eq(10);
      expect((stateVariables['/_numberlist2'].stateValues.numbers).length).eq(2);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[0]).eq(2);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[1]).eq(3);
      expect((stateVariables['/_numberlist3'].stateValues.numbers).length).eq(4);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[0]).eq(7);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[1]).eq(8);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[2]).eq(10);
      expect((stateVariables['/_numberlist3'].stateValues.numbers)[3]).eq(11);
      expect((stateVariables['/_numberlist4'].stateValues.numbers).length).eq(2);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[0]).eq(7);
      expect((stateVariables['/_numberlist4'].stateValues.numbers)[1]).eq(8);
      expect((stateVariables['/_numberlist5'].stateValues.numbers).length).eq(2);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[0]).eq(8);
      expect((stateVariables['/_numberlist5'].stateValues.numbers)[1]).eq(9);
      expect((stateVariables['/_numberlist6'].stateValues.numbers).length).eq(3);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[0]).eq(10);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[1]).eq(11);
      expect((stateVariables['/_numberlist6'].stateValues.numbers)[2]).eq(12);
    })
  })

  it('dynamic maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>a</text>
      <p><numberlist name="nl1" maximumNumber="$mn1">1 2 3 4 5</numberlist></p>
      <p><copy target="nl1" maximumNumber="$mn2" assignNames="nl2" /></p>
      <p>Maximum number 1: <mathinput name="mn1" prefill="2" /></p>
      <p>Maximum number 2: <mathinput name="mn2" /></p>

      ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded


    cy.window().then(async (win) => {

      cy.get('#\\/_p1').should('have.text', '1, 2')
      cy.get('#\\/_p2').should('have.text', '1, 2, 3, 4, 5')

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/nl1'].stateValues.numbers).eqls([1, 2]);
        expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
      })
    })

    cy.log("clear first maxnum")
    cy.get('#\\/mn1 textarea').type("{end}{backspace}", { force: true }).blur();
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4, 5')
    cy.get('#\\/_p2').should('have.text', '1, 2, 3, 4, 5')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/nl1'].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
    })


    cy.log("number in second maxnum")
    cy.get('#\\/mn2 textarea').type("3{enter}", { force: true });
    cy.get('#\\/_p2').should('have.text', '1, 2, 3')
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4, 5')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/nl1'].stateValues.numbers).eqls([1, 2, 3, 4, 5]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3]);
    })


    cy.log("number in first maxnum")
    cy.get('#\\/mn1 textarea').type("4{enter}", { force: true });
    cy.get('#\\/_p1').should('have.text', '1, 2, 3, 4')
    cy.get('#\\/_p2').should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/nl1'].stateValues.numbers).eqls([1, 2, 3, 4]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3]);
    })


    cy.log("change number in first maxnum")
    cy.get('#\\/mn1 textarea').type("{end}{backspace}1{enter}", { force: true });
    cy.get('#\\/_p1').should('have.text', '1')
    cy.get('#\\/_p2').should('have.text', '1, 2, 3')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/nl1'].stateValues.numbers).eqls([1]);
      expect(stateVariables['/nl2'].stateValues.numbers).eqls([1, 2, 3]);
    })


  })

  it('numberlist within numberlists, with child hide', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist hide="true">1 2 3</numberlist></p>

    <p><copy name="numberlist1a" hide="false" target="_numberlist1" /></p>

    <p><numberlist>
      <number>4</number>
      <copy target="_numberlist1" />
      <number hide>5</number>
      <copy target="numberlist1a" />
    </numberlist></p>

    <p><copy name="numberlist3" maximumnumber="6" target="_numberlist2" /></p>

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
      let stateVariables = await win.returnAllStateVariables1();
      let numberlist1a = stateVariables[stateVariables["/numberlist1a"].replacements[0].componentName];
      let numberlist3 = stateVariables[stateVariables["/numberlist3"].replacements[0].componentName];
      expect((stateVariables['/_numberlist1'].stateValues.numbers).length).eq(3);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[0]).eq(1);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[1]).eq(2);
      expect((stateVariables['/_numberlist1'].stateValues.numbers)[2]).eq(3);
      expect((numberlist1a.stateValues.numbers).length).eq(3);
      expect((numberlist1a.stateValues.numbers)[0]).eq(1);
      expect((numberlist1a.stateValues.numbers)[1]).eq(2);
      expect((numberlist1a.stateValues.numbers)[2]).eq(3);
      expect((stateVariables['/_numberlist2'].stateValues.numbers).length).eq(8);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[0]).eq(4);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[1]).eq(1);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[2]).eq(2);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[3]).eq(3);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[4]).eq(5);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[5]).eq(1);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[6]).eq(2);
      expect((stateVariables['/_numberlist2'].stateValues.numbers)[7]).eq(3);
      expect((numberlist3.stateValues.numbers).length).eq(6);
      expect((numberlist3.stateValues.numbers)[0]).eq(4);
      expect((numberlist3.stateValues.numbers)[1]).eq(1);
      expect((numberlist3.stateValues.numbers)[2]).eq(2);
      expect((numberlist3.stateValues.numbers)[3]).eq(3);
      expect((numberlist3.stateValues.numbers)[4]).eq(5);
      expect((numberlist3.stateValues.numbers)[5]).eq(1);

    })

  })

})
