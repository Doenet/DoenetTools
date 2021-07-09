describe('CobwebPolyline Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')

  })

  it('logistic system', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <function name='f' hide='true' variables='x'>1/3*x*(3-x)+x</function>
  <number hide="true" name="nPoints">1</number>

  <point name="P1" hide="true" x="-1.5" y="0">
    <constraints>
    <attractToGrid dx="0.2" xthreshold="0.05"/>
    </constraints>
  </point>

    
  <p>Initial condition is <m>x_0 = 1</m>:
  <answer name="check_initial">
    <award><when>
    <copy prop="coords" tname="P1"/> = <math>(1,0)</math>
    </when></award>
  </answer>
  </p>

  <updateValue label="Add line" name="addline" tName="nPoints" newValue="$nPoints+1" />
  <updateValue label="Delete line" name="deleteline" hide="$nPoints=1" tName='nPoints' newValue="$nPoints-1" />
  
  <graph xmin="-2" xmax="5" ymin="-2.2" ymax="4.5" width="500px" height="300px" name="graph1" xlabel="x_n" ylabel="x_{n+1}" newnamespace="true">
    <cobwebpolyline name="cobweb" stylenumber="4" attractThreshold="0.2" nPoints="$(../nPoints)" function="$(../f)" initialPoint="$(../P1)" nIterationsRequired='3' />
  </graph> 


  <subsection>
    <title>Result of cobweb sketch</title>

    <md>
    <map>
      <template>
        <mrow>
          x_{<number>$i-1</number>} \\amp = $(x{displayDigits="5"})
        </mrow>
      </template>
      <sources alias="x" indexAlias="i">
        <copy prop="iterateValues" tname="graph1/cobweb" />
      </sources>
    </map>
    </md>

  </subsection>

  <p>Cobweb at least three iterations</p>
  <p><answer name="check_cobweb">
  <award credit="$(graph1/cobweb{prop='fractionCorrectVerticesAdjusted'})"><when>true</when></award>
    <considerAsResponses>
      <copy prop="vertices" tname="graph1/cobweb" />
    </considerAsResponses>
  </answer>
  </p>

  <p name="psr">Submitted responses are the vertices of the polyline: <aslist><copy tname="check_cobweb" prop="submittedResponses" displaydigits="5" /></aslist></p>

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#\\/_p1').should('contain.text', 'Initial condition is')
    cy.get('#\\/check_initial_submit').click();
    cy.get('#\\/check_initial_incorrect').should('be.visible');
    cy.get('#\\/check_cobweb_submit').click();
    cy.get('#\\/check_cobweb_incorrect').should('be.visible');

    cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x0=−1.5')
    })
    cy.get('#\\/_md1').find('.mjx-mtr').eq(1).should('not.exist');

    cy.get('#\\/psr').find('.mjx-mrow').eq(0).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−1.5,0)')
    })
    cy.get('#\\/psr').find('.mjx-mrow').eq(2).should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components["/graph1/cobweb"].movePolyline({ 0: [1, 0] }, false, { vertex: 0 })
      cy.get('#\\/check_initial_submit').click();
      cy.get('#\\/check_initial_correct').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1.5,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).should('not.exist');

      cy.get('#\\/addline').click().then((_) => {
        components["/graph1/cobweb"].movePolyline({ 1: [3, 4] }, false, { vertex: 1 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_incorrect').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=4')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).should('not.exist');

      // Note: move to second wrong point to make sure submit button reappears
      cy.window().then(() => {
        components["/graph1/cobweb"].movePolyline({ 1: [1, 1] }, false, { vertex: 1 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_incorrect').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).should('not.exist');

      cy.window().then(() => {
        components["/graph1/cobweb"].movePolyline({ 1: [1, 1.6] }, false, { vertex: 1 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('20% correct')
      });

      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).should('not.exist');


      cy.get('#\\/addline').click().then((_) => {
        // don't move to check that it is at center of graph
        // components["/graph1/cobweb"].movePolyline({ 2: [2, 1] }, false, { vertex: 2 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('20% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      let xCenter = (-2+5)/2, yCenter = (-2.2+4.5)/2;
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal(`(${xCenter},${yCenter})`)
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).should('not.exist');


      cy.window().then(() => {
        components["/graph1/cobweb"].movePolyline({ 2: [1.6, 1.6] }, false, { vertex: 2 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('40% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).should('not.exist');


      cy.get('#\\/addline').click().then((_) => {
        components["/graph1/cobweb"].movePolyline({ 3: [1, 2] }, false, { vertex: 3 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('40% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).should('not.exist');


      cy.window().then(() => {
        components["/graph1/cobweb"].movePolyline({ 3: [1.6, 2.4] }, false, { vertex: 3 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('60% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).should('not.exist');


      cy.get('#\\/deleteline').click();
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('40% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).should('not.exist');


      cy.get('#\\/addline').click();
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('60% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).should('not.exist');


      cy.get('#\\/addline').click().then((_) => {
        components["/graph1/cobweb"].movePolyline({ 4: [2.4, 2.4] }, false, { vertex: 4 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('80% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(10).should('not.exist');


      cy.get('#\\/addline').click().then((_) => {
        components["/graph1/cobweb"].movePolyline({ 5: [-1, 3] }, false, { vertex: 5 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('80% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('x3=3')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(4).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(10).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,3)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(12).should('not.exist');



      cy.window().then(() => {
        components["/graph1/cobweb"].movePolyline({ 5: [2.4, 3] }, false, { vertex: 5 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_correct').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('x3=2.8829')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(4).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(10).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.8829)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(12).should('not.exist');


      cy.get('#\\/addline').click().then((_) => {
        components["/graph1/cobweb"].movePolyline({ 6: [3, 1] }, false, { vertex: 6 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').invoke('text').then((text) => {
        expect(text.trim().toLowerCase()).equal('83% correct')
      });
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('x3=2.8829')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(4).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(10).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.8829)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(12).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,1)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(14).should('not.exist');



      cy.window().then(() => {
        components["/graph1/cobweb"].movePolyline({ 6: [3, 3] }, false, { vertex: 6 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_correct').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('x3=2.8829')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(4).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(10).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.8829)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(12).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.8829,2.8829)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(14).should('not.exist');



      cy.get('#\\/addline').click().then((_) => {
        components["/graph1/cobweb"].movePolyline({ 7: [3, 3] }, false, { vertex: 7 })
      })
      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_correct').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x1=1.6667')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('x2=2.4074')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(3).invoke('text').then((text) => {
        expect(text.trim()).equal('x3=2.8829')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('x4=2.9954')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(5).should('not.exist');
      cy.get('#\\/psr').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,1.6667)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).invoke('text').then((text) => {
        expect(text.trim()).equal('(1.6667,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(8).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.4074)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(10).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.4074,2.8829)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(12).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.8829,2.8829)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(14).invoke('text').then((text) => {
        expect(text.trim()).equal('(2.8829,2.9954)')
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(16).should('not.exist');


    });

  });

});
