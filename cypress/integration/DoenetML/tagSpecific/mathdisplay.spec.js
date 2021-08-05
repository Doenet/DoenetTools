describe('Math Display Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('inline and display', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <m>\sin(x)</m>
    <me>\cos(x)</me>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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
    <text>a</text>
    <men name="e1">\\sin(x)</men>
    <men name="e2">\\cos(x)</men>
    <men name="e3">\\tan(x)</men>

    <p>We have equation <ref tname="e1" name="re1" />, equation <ref tname="e2" name="re2" />, and equation <ref tname="e3" name="re3" />.</p>
    <p>From copying properties: <copy prop="equationTag" tname="e1" assignNames="te1" />, <copy prop="equationTag" tname="e2" assignNames="te2" />, and <copy prop="equationTag" tname="e3" assignNames="te3" />.</p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')
    cy.get('#\\/e1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(x)(1)')
    })
    cy.get('#\\/e2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)(2)')
    })
    cy.get('#\\/e3').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('tan(x)(3)')
    })
    cy.get('#\\/_p1').should('have.text', 'We have equation (1), equation (2), and equation (3).')
    cy.get('#\\/re1').should('have.text', '(1)')
    cy.get('#\\/re2').should('have.text', '(2)')
    cy.get('#\\/re3').should('have.text', '(3)')
    cy.get('#\\/re1').should('have.attr', 'href', '#/e1')
    cy.get('#\\/re2').should('have.attr', 'href', '#/e2')
    cy.get('#\\/re3').should('have.attr', 'href', '#/e3')

    cy.get('#\\/_p2').should('have.text', 'From copying properties: 1, 2, and 3.')
    cy.get('#\\/te1').should('have.text', '1')
    cy.get('#\\/te2').should('have.text', '2')
    cy.get('#\\/te3').should('have.text', '3')

  });

  it('dynamic numbered equations', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <map assignNames="m1 m2 m3 m4 m5 m6">
      <template newNamespace><men name='eq'>$i m</men></template>
      <sources indexAlias="i"><sequence length="$m" /></sources>
    </map>
    <men name="y">y</men>
    <map assignNames="n1 n2 n3 n4 n5 n6">
      <template newNamespace><men name="eq">$i n</men></template>
      <sources indexAlias="i"><sequence length="$n" /></sources>
    </map>
    <men name="z">z</men>
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" tname="x" />, equation <ref tname="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" tname="m1/eq" />, equation <ref tname="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" tname="m2/eq" />, equation <ref tname="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" tname="m3/eq" />, equation <ref tname="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" tname="m4/eq" />, equation <ref tname="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" tname="m5/eq" />, equation <ref tname="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" tname="m6/eq" />, equation <ref tname="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" tname="y" />, equation <ref tname="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" tname="n1/eq" />, equation <ref tname="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" tname="n2/eq" />, equation <ref tname="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" tname="n3/eq" />, equation <ref tname="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" tname="n4/eq" />, equation <ref tname="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" tname="n5/eq" />, equation <ref tname="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" tname="n6/eq" />, equation <ref tname="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" tname="z" />, equation <ref tname="z" name="rz" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')

    function checkEquationNumbering(m, n) {

      let counter = 1;

      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`x(${counter})`)
      })
      cy.get('#\\/px').should('have.text', `x: ${counter}, equation (${counter})`)
      cy.get('#\\/etx').should('have.text', `${counter}`)
      cy.get('#\\/rx').should('have.text', `(${counter})`)
      cy.get('#\\/rx').should('have.attr', 'href', `#/x`)

      for (let i = 1; i <= m; i++) {
        cy.window().then((win) => {
          counter++;
          cy.get(`#\\/m${i}\\/eq`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}m(${counter})`)
          })
          if (i <= 6) {
            cy.get(`#\\/pm${i}`).should('have.text', `m${i}: ${counter}, equation (${counter})`)
            cy.get(`#\\/etm${i}`).should('have.text', `${counter}`)
            cy.get(`#\\/rm${i}`).should('have.text', `(${counter})`)
            cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#/m${i}/eq`)
          }
        })
      }
      for (let i = m + 1; i <= 6; i++) {
        cy.window().then((win) => {
          cy.get(`#\\/pm${i}`).should('have.text', `m${i}: , equation ???`)
          cy.get(`#\\/etm${i}`).should('not.exist')
          cy.get(`#\\/rm${i}`).should('have.text', `???`)
          cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#`)
        })
      }

      cy.window().then((win) => {
        counter++;
        cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`y(${counter})`)
        })
        cy.get('#\\/py').should('have.text', `y: ${counter}, equation (${counter})`)
        cy.get('#\\/ety').should('have.text', `${counter}`)
        cy.get('#\\/ry').should('have.text', `(${counter})`)
        cy.get('#\\/ry').should('have.attr', 'href', `#/y`)
      })

      for (let i = 1; i <= n; i++) {
        cy.window().then((win) => {
          counter++;
          cy.get(`#\\/n${i}\\/eq`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}n(${counter})`)
          })
          if (i <= 6) {
            cy.get(`#\\/pn${i}`).should('have.text', `n${i}: ${counter}, equation (${counter})`)
            cy.get(`#\\/etn${i}`).should('have.text', `${counter}`)
            cy.get(`#\\/rn${i}`).should('have.text', `(${counter})`)
            cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#/n${i}/eq`)
          }
        })
      }

      for (let i = n + 1; i <= 6; i++) {
        cy.window().then((win) => {
          cy.get(`#\\/pn${i}`).should('have.text', `n${i}: , equation ???`)
          cy.get(`#\\/etn${i}`).should('not.exist')
          cy.get(`#\\/rn${i}`).should('have.text', `???`)
          cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#`)
        })
      }


      cy.window().then((win) => {
        counter++;
        cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`z(${counter})`)
        })
        cy.get('#\\/pz').should('have.text', `z: ${counter}, equation (${counter})`)
        cy.get('#\\/etz').should('have.text', `${counter}`)
        cy.get('#\\/rz').should('have.text', `(${counter})`)
        cy.get('#\\/rz').should('have.attr', 'href', `#/z`)
      })
    }

    checkEquationNumbering(2, 1)


    cy.get('#\\/m textarea').type(`{end}{backspace}4{enter}`, { force: true });
    checkEquationNumbering(4, 1)

    cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
    checkEquationNumbering(4, 2)

    cy.get('#\\/m textarea').type(`{end}{backspace}0{enter}`, { force: true });
    checkEquationNumbering(0, 2)

    cy.get('#\\/n textarea').type(`{end}{backspace}6{enter}`, { force: true });
    checkEquationNumbering(0, 6)

    cy.get('#\\/m textarea').type(`{end}{backspace}3{enter}`, { force: true });
    checkEquationNumbering(3, 6)

    cy.get('#\\/n textarea').type(`{end}{backspace}1{enter}`, { force: true });
    checkEquationNumbering(3, 1)


  });

  it('math inside', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <m><math simplify>x+x</math></m>
    <me><math simplify>y+y</math></me>
    <men><math simplify>z+z</math></men>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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
    <text>a</text>
    <md>
      <mrow>q \\amp = sin(x)</mrow>
      <mrow>cos(x) \\amp = z</mrow>
    </md>
    <mdn>
      <mrow>q \\amp = sin(x)</mrow>
      <mrow>cos(x) \\amp = z</mrow>
    </mdn>
    <md>
      <mrow number="true">q \\amp = sin(x)</mrow>
      <mrow number="true">cos(x) \\amp = z</mrow>
    </md>
    <mdn>
      <mrow number="false">q \\amp = sin(x)</mrow>
      <mrow number="false">cos(x) \\amp = z</mrow>
    </mdn>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

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
    cy.get('#\\/_md2').find('.mjx-mlabeledtr').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q=sin(x)')
    })
    cy.get('#\\/_md2').find('.mjx-mlabeledtr').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)=z')
    })
    cy.get('#\\/_md2').find('.mjx-label').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3)')
    })
    cy.get('#\\/_md2').find('.mjx-label').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('(4)')
    })
    cy.get('#\\/_mdn2').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('q=sin(x)')
    })
    cy.get('#\\/_mdn2').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim()).equal('cos(x)=z')
    })

  });

  it('dynamic numbered aligned equations', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <map assignNames="m1 m2 m3 m4 m5 m6">
        <template newNamespace><mrow name='eq'>$i m &amp;= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$m" from="11" /></sources>
      </map>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <map assignNames="n1 n2 n3 n4 n5 n6">
        <template newNamespace><mrow name="eq">$i n &= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" tname="x" />, equation <ref tname="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" tname="m1/eq" />, equation <ref tname="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" tname="m2/eq" />, equation <ref tname="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" tname="m3/eq" />, equation <ref tname="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" tname="m4/eq" />, equation <ref tname="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" tname="m5/eq" />, equation <ref tname="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" tname="m6/eq" />, equation <ref tname="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" tname="y" />, equation <ref tname="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" tname="n1/eq" />, equation <ref tname="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" tname="n2/eq" />, equation <ref tname="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" tname="n3/eq" />, equation <ref tname="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" tname="n4/eq" />, equation <ref tname="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" tname="n5/eq" />, equation <ref tname="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" tname="n6/eq" />, equation <ref tname="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" tname="z" />, equation <ref tname="z" name="rz" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')

    function checkEquationNumbering(m, n) {

      let counter = 1;

      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`x(${counter})`)
      })
      cy.get('#\\/px').should('have.text', `x: ${counter}, equation (${counter})`)
      cy.get('#\\/etx').should('have.text', `${counter}`)
      cy.get('#\\/rx').should('have.text', `(${counter})`)
      cy.get('#\\/rx').should('have.attr', 'href', `#/x`)

      for (let i = 1; i <= m; i++) {
        cy.window().then((win) => {
          counter++;
          cy.get('#\\/ms').find('.mjx-mlabeledtr').eq(i - 1).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}m=${i + 10}`)
          })
          cy.get('#\\/ms').find('.mjx-label').eq(i - 1).invoke('text').then((text) => {
            expect(text.trim()).equal(`(${counter})`)
          })
          if (i <= 6) {
            cy.get(`#\\/pm${i}`).should('have.text', `m${i}: ${counter}, equation (${counter})`)
            cy.get(`#\\/etm${i}`).should('have.text', `${counter}`)
            cy.get(`#\\/rm${i}`).should('have.text', `(${counter})`)
            cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#/m${i}/eq`)
          }
        })
      }
      for (let i = m + 1; i <= 6; i++) {
        cy.window().then((win) => {
          cy.get(`#\\/pm${i}`).should('have.text', `m${i}: , equation ???`)
          cy.get(`#\\/etm${i}`).should('not.exist')
          cy.get(`#\\/rm${i}`).should('have.text', `???`)
          cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#`)
        })
      }

      cy.window().then((win) => {
        counter++;
        cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`y(${counter})`)
        })
        cy.get('#\\/py').should('have.text', `y: ${counter}, equation (${counter})`)
        cy.get('#\\/ety').should('have.text', `${counter}`)
        cy.get('#\\/ry').should('have.text', `(${counter})`)
        cy.get('#\\/ry').should('have.attr', 'href', `#/y`)
      })

      for (let i = 1; i <= n; i++) {
        cy.window().then((win) => {
          counter++;
          cy.get('#\\/ns').find('.mjx-mlabeledtr').eq(i - 1).invoke('text').then((text) => {
            expect(text.trim()).equal(`${i}n=${i + 10}`)
          })
          cy.get('#\\/ns').find('.mjx-label').eq(i - 1).invoke('text').then((text) => {
            expect(text.trim()).equal(`(${counter})`)
          })
          if (i <= 6) {
            cy.get(`#\\/pn${i}`).should('have.text', `n${i}: ${counter}, equation (${counter})`)
            cy.get(`#\\/etn${i}`).should('have.text', `${counter}`)
            cy.get(`#\\/rn${i}`).should('have.text', `(${counter})`)
            cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#/n${i}/eq`)
          }
        })
      }

      for (let i = n + 1; i <= 6; i++) {
        cy.window().then((win) => {
          cy.get(`#\\/pn${i}`).should('have.text', `n${i}: , equation ???`)
          cy.get(`#\\/etn${i}`).should('not.exist')
          cy.get(`#\\/rn${i}`).should('have.text', `???`)
          cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#`)
        })
      }


      cy.window().then((win) => {
        counter++;
        cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`z(${counter})`)
        })
        cy.get('#\\/pz').should('have.text', `z: ${counter}, equation (${counter})`)
        cy.get('#\\/etz').should('have.text', `${counter}`)
        cy.get('#\\/rz').should('have.text', `(${counter})`)
        cy.get('#\\/rz').should('have.attr', 'href', `#/z`)
      })
    }

    checkEquationNumbering(2, 1)


    cy.get('#\\/m textarea').type(`{end}{backspace}4{enter}`, { force: true });
    checkEquationNumbering(4, 1)

    cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
    checkEquationNumbering(4, 2)

    cy.get('#\\/m textarea').type(`{end}{backspace}0{enter}`, { force: true });
    checkEquationNumbering(0, 2)

    cy.get('#\\/n textarea').type(`{end}{backspace}6{enter}`, { force: true });
    checkEquationNumbering(0, 6)

    cy.get('#\\/m textarea').type(`{end}{backspace}3{enter}`, { force: true });
    checkEquationNumbering(3, 6)

    cy.get('#\\/n textarea').type(`{end}{backspace}1{enter}`, { force: true });
    checkEquationNumbering(3, 1)


  });

  it('dynamic numbered aligned equations, numbering swapped', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <map assignNames="m1 m2 m3 m4 m5 m6">
        <template newNamespace><mrow name='eq' number="mod($i,2)=1">$i m &amp;= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$m" from="11" /></sources>
      </map>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <map assignNames="n1 n2 n3 n4 n5 n6">
        <template newNamespace><mrow name="eq" number="(-1)^$i = 1">$i n &= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" tname="x" />, equation <ref tname="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" tname="m1/eq" />, equation <ref tname="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" tname="m2/eq" />, equation <ref tname="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" tname="m3/eq" />, equation <ref tname="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" tname="m4/eq" />, equation <ref tname="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" tname="m5/eq" />, equation <ref tname="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" tname="m6/eq" />, equation <ref tname="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" tname="y" />, equation <ref tname="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" tname="n1/eq" />, equation <ref tname="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" tname="n2/eq" />, equation <ref tname="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" tname="n3/eq" />, equation <ref tname="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" tname="n4/eq" />, equation <ref tname="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" tname="n5/eq" />, equation <ref tname="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" tname="n6/eq" />, equation <ref tname="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" tname="z" />, equation <ref tname="z" name="rz" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Test value displayed in browser')

    function checkEquationNumbering(m, n) {

      let counter = 1;

      cy.get('#\\/x').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`x(${counter})`)
      })
      cy.get('#\\/px').should('have.text', `x: ${counter}, equation (${counter})`)
      cy.get('#\\/etx').should('have.text', `${counter}`)
      cy.get('#\\/rx').should('have.text', `(${counter})`)
      cy.get('#\\/rx').should('have.attr', 'href', `#/x`)

      let labeledMs = 0;
      let unlabeledMs = 0;
      for (let i = 1; i <= m; i++) {
        cy.window().then((win) => {
          if (i % 2 === 1) {
            labeledMs++;
            counter++;
            cy.get('#\\/ms').find('.mjx-mlabeledtr').eq(labeledMs - 1).invoke('text').then((text) => {
              expect(text.trim()).equal(`${i}m=${i + 10}`)
            })
            cy.get('#\\/ms').find('.mjx-label').eq(i - 1).invoke('text').then((text) => {
              expect(text.trim()).equal(`(${counter})`)
            })
            if (i <= 6) {
              cy.get(`#\\/pm${i}`).should('have.text', `m${i}: ${counter}, equation (${counter})`)
              cy.get(`#\\/etm${i}`).should('have.text', `${counter}`)
              cy.get(`#\\/rm${i}`).should('have.text', `(${counter})`)
              cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#/m${i}/eq`)
            }
          } else {
            unlabeledMs++;
            cy.get('#\\/ms').find('.mjx-mtr').eq(unlabeledMs - 1).invoke('text').then((text) => {
              expect(text.trim()).equal(`${i}m=${i + 10}`)
            })
            if (i <= 6) {
              cy.get(`#\\/pm${i}`).should('have.text', `m${i}: , equation ???`)
              cy.get(`#\\/etm${i}`).should('have.text', '')
              cy.get(`#\\/rm${i}`).should('have.text', `???`)
              cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#/m${i}/eq`)
            }
          }
        })
      }
      for (let i = m + 1; i <= 6; i++) {
        cy.window().then((win) => {
          cy.get(`#\\/pm${i}`).should('have.text', `m${i}: , equation ???`)
          cy.get(`#\\/etm${i}`).should('not.exist')
          cy.get(`#\\/rm${i}`).should('have.text', `???`)
          cy.get(`#\\/rm${i}`).should('have.attr', 'href', `#`)
        })
      }

      cy.window().then((win) => {
        counter++;
        cy.get('#\\/y').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`y(${counter})`)
        })
        cy.get('#\\/py').should('have.text', `y: ${counter}, equation (${counter})`)
        cy.get('#\\/ety').should('have.text', `${counter}`)
        cy.get('#\\/ry').should('have.text', `(${counter})`)
        cy.get('#\\/ry').should('have.attr', 'href', `#/y`)
      })

      let labeledNs = 0;
      let unlabeledNs = 0;
      for (let i = 1; i <= n; i++) {
        cy.window().then((win) => {
          if (i % 2 === 0) {
            labeledNs++;
            counter++;
            cy.get('#\\/ns').find('.mjx-mlabeledtr').eq(labeledNs - 1).invoke('text').then((text) => {
              expect(text.trim()).equal(`${i}n=${i + 10}`)
            })
            cy.get('#\\/ns').find('.mjx-label').eq(i - 1).invoke('text').then((text) => {
              expect(text.trim()).equal(`(${counter})`)
            })
            if (i <= 6) {
              cy.get(`#\\/pn${i}`).should('have.text', `n${i}: ${counter}, equation (${counter})`)
              cy.get(`#\\/etn${i}`).should('have.text', `${counter}`)
              cy.get(`#\\/rn${i}`).should('have.text', `(${counter})`)
              cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#/n${i}/eq`)
            }
          } else {
            unlabeledNs++;
            cy.get('#\\/ns').find('.mjx-mtr').eq(unlabeledNs - 1).invoke('text').then((text) => {
              expect(text.trim()).equal(`${i}n=${i + 10}`)
            })
            if (i <= 6) {
              cy.get(`#\\/pn${i}`).should('have.text', `n${i}: , equation ???`)
              cy.get(`#\\/etn${i}`).should('have.text', ``)
              cy.get(`#\\/rn${i}`).should('have.text', `???`)
              cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#/n${i}/eq`)
            }
          }
        })
      }

      for (let i = n + 1; i <= 6; i++) {
        cy.window().then((win) => {
          cy.get(`#\\/pn${i}`).should('have.text', `n${i}: , equation ???`)
          cy.get(`#\\/etn${i}`).should('not.exist')
          cy.get(`#\\/rn${i}`).should('have.text', `???`)
          cy.get(`#\\/rn${i}`).should('have.attr', 'href', `#`)
        })
      }


      cy.window().then((win) => {
        counter++;
        cy.get('#\\/z').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal(`z(${counter})`)
        })
        cy.get('#\\/pz').should('have.text', `z: ${counter}, equation (${counter})`)
        cy.get('#\\/etz').should('have.text', `${counter}`)
        cy.get('#\\/rz').should('have.text', `(${counter})`)
        cy.get('#\\/rz').should('have.attr', 'href', `#/z`)
      })
    }

    checkEquationNumbering(2, 1)


    cy.get('#\\/m textarea').type(`{end}{backspace}4{enter}`, { force: true });
    checkEquationNumbering(4, 1)

    cy.get('#\\/n textarea').type(`{end}{backspace}2{enter}`, { force: true });
    checkEquationNumbering(4, 2)

    cy.get('#\\/m textarea').type(`{end}{backspace}0{enter}`, { force: true });
    checkEquationNumbering(0, 2)

    cy.get('#\\/n textarea').type(`{end}{backspace}6{enter}`, { force: true });
    checkEquationNumbering(0, 6)

    cy.get('#\\/m textarea').type(`{end}{backspace}3{enter}`, { force: true });
    checkEquationNumbering(3, 6)

    cy.get('#\\/n textarea').type(`{end}{backspace}1{enter}`, { force: true });
    checkEquationNumbering(3, 1)


  });

  it('add commas to large integers', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><intcomma>25236501.35</intcomma></p>
    <p><intcomma><math>25236501.35</math></intcomma></p>
    <p><m><intcomma>25236501.35</intcomma></m></p>
    <p><m><intcomma><math>25236501.35</math></intcomma></m></p>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_p1').should('have.text', '25,236,501.35');
    cy.get('#\\/_p2').should('have.text', '25,236,501.35');
    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25,236,501.35')
    })
    cy.get('#\\/_m2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25,236,501.35')
    })

  });

  it('include blank string children', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="b">beta</math>
    <math name="s">s</math>
    <m>$b $s</m>
    <me>$b $s</me>
    <md>
      <mrow>$b $s</mrow>
    </md>
  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.get('#\\/_m1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('βs')
    })
    cy.get('#\\/_me1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('βs')
    })
    cy.get('#\\/_md1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('βs')
    })

  })

})
