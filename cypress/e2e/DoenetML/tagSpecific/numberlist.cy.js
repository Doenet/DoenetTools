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
      <copy prop="number3" target="_numberlist1" createComponentOfType="number" />
      <numberlist>
        <numberlist name="mid">
          <number><copy prop="number1" target="_numberlist1" createComponentOfType="number" /></number>
          <numberlist>4 5</numberlist>
        </numberlist>
        <numberlist>
          <copy prop="number2" target="_numberlist1" createComponentOfType="number" />
          <copy prop="number5" target="_numberlist1" createComponentOfType="number" />
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

  it('numberlist and rounding, from strings', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist displayDigits="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDigits="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDecimals="3">2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDecimals="3" padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDigits="3" displaySmallAsZero>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>
    <p><numberlist displayDigits="3" displaySmallAsZero padZeros>2345.1535268 3.52343 0.5 0.00000000000052523 0.000000000000000000006</numberList></p>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numbers1 = stateVariables["/_numberlist1"].activeChildren.map(x => x.componentName);
      let numbers2 = stateVariables["/_numberlist2"].activeChildren.map(x => x.componentName);
      let numbers3 = stateVariables["/_numberlist3"].activeChildren.map(x => x.componentName);
      let numbers4 = stateVariables["/_numberlist4"].activeChildren.map(x => x.componentName);
      let numbers5 = stateVariables["/_numberlist5"].activeChildren.map(x => x.componentName);
      let numbers6 = stateVariables["/_numberlist6"].activeChildren.map(x => x.componentName);

      cy.get(cesc('#' + numbers1[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers1[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers1[2])).should('have.text', '0.5')
      cy.get(cesc('#' + numbers1[3])).should('have.text', '5.25 * 10^(-13)')
      cy.get(cesc('#' + numbers1[4])).should('have.text', '6 * 10^(-21)')


      cy.get(cesc('#' + numbers2[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers2[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers2[2])).should('have.text', '0.500')
      cy.get(cesc('#' + numbers2[3])).should('have.text', '5.25 * 10^(-13)')
      cy.get(cesc('#' + numbers2[4])).should('have.text', '6.00 * 10^(-21)')


      cy.get(cesc('#' + numbers3[0])).should('have.text', '2345.154')
      cy.get(cesc('#' + numbers3[1])).should('have.text', '3.523')
      cy.get(cesc('#' + numbers3[2])).should('have.text', '0.5')
      cy.get(cesc('#' + numbers3[3])).should('have.text', '0')
      cy.get(cesc('#' + numbers3[4])).should('have.text', '0')

      cy.get(cesc('#' + numbers4[0])).should('have.text', '2345.154')
      cy.get(cesc('#' + numbers4[1])).should('have.text', '3.523')
      cy.get(cesc('#' + numbers4[2])).should('have.text', '0.500')
      cy.get(cesc('#' + numbers4[3])).should('have.text', '0.000')
      cy.get(cesc('#' + numbers4[4])).should('have.text', '0.000')

      cy.get(cesc('#' + numbers5[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers5[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers5[2])).should('have.text', '0.5')
      cy.get(cesc('#' + numbers5[3])).should('have.text', '5.25 * 10^(-13)')
      cy.get(cesc('#' + numbers5[4])).should('have.text', '0')

      cy.get(cesc('#' + numbers6[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers6[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers6[2])).should('have.text', '0.500')
      cy.get(cesc('#' + numbers6[3])).should('have.text', '5.25 * 10^(-13)')
      cy.get(cesc('#' + numbers6[4])).should('have.text', '0.00')



    })

  })

  it('numberlist and rounding, override number children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberlist name="ml1">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml2" displayDigits="3">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml3" displayDigits="3" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml4" displayDigits="3" padZeros="false">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml5" displayDecimals="3">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml6" displayDecimals="3" padZeros>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml7" displayDecimals="3" padZeros="false">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml8" displayDigits="3" displaySmallAsZero>
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    <p><numberlist name="ml9" displayDigits="3" displaySmallAsZero="false">
      <number displayDigits="5">2345.1535268</number>
      <number displayDecimals="5">3.52343</number>
      <number displayDigits="5" padZeros>5</number>
      <number>0.00000000000000052523</number>
      <number displaySmallAsZero>0.000000000000000000006</number>
    </numberList></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let numbers1 = stateVariables["/ml1"].activeChildren.map(x => x.componentName);
      let numbers2 = stateVariables["/ml2"].activeChildren.map(x => x.componentName);
      let numbers3 = stateVariables["/ml3"].activeChildren.map(x => x.componentName);
      let numbers4 = stateVariables["/ml4"].activeChildren.map(x => x.componentName);
      let numbers5 = stateVariables["/ml5"].activeChildren.map(x => x.componentName);
      let numbers6 = stateVariables["/ml6"].activeChildren.map(x => x.componentName);
      let numbers7 = stateVariables["/ml7"].activeChildren.map(x => x.componentName);
      let numbers8 = stateVariables["/ml8"].activeChildren.map(x => x.componentName);
      let numbers9 = stateVariables["/ml9"].activeChildren.map(x => x.componentName);

      cy.get(cesc('#' + numbers1[0])).should('have.text', '2345.2')
      cy.get(cesc('#' + numbers1[1])).should('have.text', '3.52343')
      cy.get(cesc('#' + numbers1[2])).should('have.text', '5.0000')
      cy.get(cesc('#' + numbers1[3])).should('have.text', '5.2523 * 10^(-16)')
      cy.get(cesc('#' + numbers1[4])).should('have.text', '0')


      cy.get(cesc('#' + numbers2[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers2[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers2[2])).should('have.text', '5.00')
      cy.get(cesc('#' + numbers2[3])).should('have.text', '5.25 * 10^(-16)')
      cy.get(cesc('#' + numbers2[4])).should('have.text', '0')


      cy.get(cesc('#' + numbers3[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers3[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers3[2])).should('have.text', '5.00')
      cy.get(cesc('#' + numbers3[3])).should('have.text', '5.25 * 10^(-16)')
      cy.get(cesc('#' + numbers3[4])).should('have.text', '0.00')

      cy.get(cesc('#' + numbers4[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers4[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers4[2])).should('have.text', '5')
      cy.get(cesc('#' + numbers4[3])).should('have.text', '5.25 * 10^(-16)')
      cy.get(cesc('#' + numbers4[4])).should('have.text', '0')

      cy.get(cesc('#' + numbers5[0])).should('have.text', '2345.154')
      cy.get(cesc('#' + numbers5[1])).should('have.text', '3.523')
      cy.get(cesc('#' + numbers5[2])).should('have.text', '5.000')
      cy.get(cesc('#' + numbers5[3])).should('have.text', '0')
      cy.get(cesc('#' + numbers5[4])).should('have.text', '0')

      cy.get(cesc('#' + numbers6[0])).should('have.text', '2345.154')
      cy.get(cesc('#' + numbers6[1])).should('have.text', '3.523')
      cy.get(cesc('#' + numbers6[2])).should('have.text', '5.000')
      cy.get(cesc('#' + numbers6[3])).should('have.text', '0.000')
      cy.get(cesc('#' + numbers6[4])).should('have.text', '0.000')

      cy.get(cesc('#' + numbers7[0])).should('have.text', '2345.154')
      cy.get(cesc('#' + numbers7[1])).should('have.text', '3.523')
      cy.get(cesc('#' + numbers7[2])).should('have.text', '5')
      cy.get(cesc('#' + numbers7[3])).should('have.text', '0')
      cy.get(cesc('#' + numbers7[4])).should('have.text', '0')

      cy.get(cesc('#' + numbers8[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers8[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers8[2])).should('have.text', '5.00')
      cy.get(cesc('#' + numbers8[3])).should('have.text', '0')
      cy.get(cesc('#' + numbers8[4])).should('have.text', '0')


      cy.get(cesc('#' + numbers9[0])).should('have.text', '2350')
      cy.get(cesc('#' + numbers9[1])).should('have.text', '3.52')
      cy.get(cesc('#' + numbers9[2])).should('have.text', '5.00')
      cy.get(cesc('#' + numbers9[3])).should('have.text', '5.25 * 10^(-16)')
      cy.get(cesc('#' + numbers9[4])).should('have.text', '6 * 10^(-21)')


    })

  })

  it('numberlist and rounding, override math children', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><numberList name="ml1">
      <math name="n11" displayDigits="5">2345.1535268</math>
      <math name="n12" displayDecimals="5">3.52343</math>
      <math name="n13" displayDigits="5" padZeros>5</math>
      <math name="n14">0.00000000000000052523</math>
      <math name="n15" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml2" displayDigits="3">
      <math name="n21" displayDigits="5">2345.1535268</math>
      <math name="n22" displayDecimals="5">3.52343</math>
      <math name="n23" displayDigits="5" padZeros>5</math>
      <math name="n24">0.00000000000000052523</math>
      <math name="n25" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml3" displayDigits="3" padZeros>
      <math name="n31" displayDigits="5">2345.1535268</math>
      <math name="n32" displayDecimals="5">3.52343</math>
      <math name="n33" displayDigits="5" padZeros>5</math>
      <math name="n34">0.00000000000000052523</math>
      <math name="n35" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml4" displayDigits="3" padZeros="false">
      <math name="n41" displayDigits="5">2345.1535268</math>
      <math name="n42" displayDecimals="5">3.52343</math>
      <math name="n43" displayDigits="5" padZeros>5</math>
      <math name="n44">0.00000000000000052523</math>
      <math name="n45" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml5" displayDecimals="3">
      <math name="n51" displayDigits="5">2345.1535268</math>
      <math name="n52" displayDecimals="5">3.52343</math>
      <math name="n53" displayDigits="5" padZeros>5</math>
      <math name="n54">0.00000000000000052523</math>
      <math name="n55" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml6" displayDecimals="3" padZeros>
      <math name="n61" displayDigits="5">2345.1535268</math>
      <math name="n62" displayDecimals="5">3.52343</math>
      <math name="n63" displayDigits="5" padZeros>5</math>
      <math name="n64">0.00000000000000052523</math>
      <math name="n65" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml7" displayDecimals="3" padZeros="false">
      <math name="n71" displayDigits="5">2345.1535268</math>
      <math name="n72" displayDecimals="5">3.52343</math>
      <math name="n73" displayDigits="5" padZeros>5</math>
      <math name="n74">0.00000000000000052523</math>
      <math name="n75" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml8" displayDigits="3" displaySmallAsZero>
      <math name="n81" displayDigits="5">2345.1535268</math>
      <math name="n82" displayDecimals="5">3.52343</math>
      <math name="n83" displayDigits="5" padZeros>5</math>
      <math name="n84">0.00000000000000052523</math>
      <math name="n85" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    <p><numberList name="ml9" displayDigits="3" displaySmallAsZero="false">
      <math name="n91" displayDigits="5">2345.1535268</math>
      <math name="n92" displayDecimals="5">3.52343</math>
      <math name="n93" displayDigits="5" padZeros>5</math>
      <math name="n94">0.00000000000000052523</math>
      <math name="n95" displaySmallAsZero>0.000000000000000000006</math>
    </numberList></p>
    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get(cesc('#/n11')).should('have.text', '2345.2')
    cy.get(cesc('#/n12')).should('have.text', '3.52343')
    cy.get(cesc('#/n13')).should('have.text', '5.0000')
    cy.get(cesc('#/n14')).should('have.text', '5.2523 * 10^(-16)')
    cy.get(cesc('#/n15')).should('have.text', '0')


    cy.get(cesc('#/n21')).should('have.text', '2350')
    cy.get(cesc('#/n22')).should('have.text', '3.52')
    cy.get(cesc('#/n23')).should('have.text', '5.00')
    cy.get(cesc('#/n24')).should('have.text', '5.25 * 10^(-16)')
    cy.get(cesc('#/n25')).should('have.text', '0')


    cy.get(cesc('#/n31')).should('have.text', '2350')
    cy.get(cesc('#/n32')).should('have.text', '3.52')
    cy.get(cesc('#/n33')).should('have.text', '5.00')
    cy.get(cesc('#/n34')).should('have.text', '5.25 * 10^(-16)')
    cy.get(cesc('#/n35')).should('have.text', '0.00')

    cy.get(cesc('#/n41')).should('have.text', '2350')
    cy.get(cesc('#/n42')).should('have.text', '3.52')
    cy.get(cesc('#/n43')).should('have.text', '5')
    cy.get(cesc('#/n44')).should('have.text', '5.25 * 10^(-16)')
    cy.get(cesc('#/n45')).should('have.text', '0')

    cy.get(cesc('#/n51')).should('have.text', '2345.154')
    cy.get(cesc('#/n52')).should('have.text', '3.523')
    cy.get(cesc('#/n53')).should('have.text', '5.000')
    cy.get(cesc('#/n54')).should('have.text', '0')
    cy.get(cesc('#/n55')).should('have.text', '0')

    cy.get(cesc('#/n61')).should('have.text', '2345.154')
    cy.get(cesc('#/n62')).should('have.text', '3.523')
    cy.get(cesc('#/n63')).should('have.text', '5.000')
    cy.get(cesc('#/n64')).should('have.text', '0.000')
    cy.get(cesc('#/n65')).should('have.text', '0.000')

    cy.get(cesc('#/n71')).should('have.text', '2345.154')
    cy.get(cesc('#/n72')).should('have.text', '3.523')
    cy.get(cesc('#/n73')).should('have.text', '5')
    cy.get(cesc('#/n74')).should('have.text', '0')
    cy.get(cesc('#/n75')).should('have.text', '0')

    cy.get(cesc('#/n81')).should('have.text', '2350')
    cy.get(cesc('#/n82')).should('have.text', '3.52')
    cy.get(cesc('#/n83')).should('have.text', '5.00')
    cy.get(cesc('#/n84')).should('have.text', '0')
    cy.get(cesc('#/n85')).should('have.text', '0')


    cy.get(cesc('#/n91')).should('have.text', '2350')
    cy.get(cesc('#/n92')).should('have.text', '3.52')
    cy.get(cesc('#/n93')).should('have.text', '5.00')
    cy.get(cesc('#/n94')).should('have.text', '5.25 * 10^(-16)')
    cy.get(cesc('#/n95')).should('have.text', '6 * 10^(-21)')


  })

  it('numberlist adapts to math and text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <numberlist><number>1</number> <number>2</number><number>3</number></numberlist>

    <p>number list as math: <math>$_numberlist1</math></p>
    <p>number list as text: <text>$_numberlist1</text></p>

    ` }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/_number1').should('have.text', '1');
    cy.get('#\\/_number2').should('have.text', '2');
    cy.get('#\\/_number3').should('have.text', '3');
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1,2,3')
    })
    cy.get("#\\/_text2").should('have.text', '1, 2, 3')

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].stateValues.value).eqls(["list", 1, 2, 3]);
      expect(stateVariables['/_text2'].stateValues.value).eq("1, 2, 3");

    })

  })
  
})
