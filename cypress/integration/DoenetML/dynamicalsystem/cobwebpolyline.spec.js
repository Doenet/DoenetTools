import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

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

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);

      await components["/graph1/cobweb"].movePolyline({
        pointCoords: { 0: [1, 0] },
        sourceInformation: { vertex: 0 }
      })
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

      cy.get('#\\/addline').click().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 1: [3, 4] },
          sourceInformation: { vertex: 1 }
        })

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
      cy.window().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 1: [1, 1] },
          sourceInformation: { vertex: 1 }
        })
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

      cy.window().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 1: [1, 1.6] },
          sourceInformation: { vertex: 1 }
        })
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


      // don't move to check that it is at center of graph
      cy.get('#\\/addline').click();
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
      let xCenter = (-2 + 5) / 2, yCenter = (-2.2 + 4.5) / 2;
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal(`(${xCenter},${yCenter})`)
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).should('not.exist');


      cy.window().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 2: [1.6, 1.6] },
          sourceInformation: { vertex: 2 }
        })
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


      cy.get('#\\/addline').click().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 3: [1, 2] },
          sourceInformation: { vertex: 3 }
        })
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


      cy.window().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 3: [1.6, 2.4] },
          sourceInformation: { vertex: 3 }
        })
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


      cy.get('#\\/addline').click().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 4: [2.4, 2.4] },
          sourceInformation: { vertex: 4 }
        })
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


      cy.get('#\\/addline').click().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 5: [-1, 3] },
          sourceInformation: { vertex: 5 }
        })
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



      cy.window().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 5: [2.4, 3] },
          sourceInformation: { vertex: 5 }
        })
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


      cy.get('#\\/addline').click().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 6: [3, 1] },
          sourceInformation: { vertex: 6 }
        })
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



      cy.window().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 6: [3, 3] },
          sourceInformation: { vertex: 6 }
        })
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



      cy.get('#\\/addline').click().then(async () => {
        await components["/graph1/cobweb"].movePolyline({
          pointCoords: { 7: [3, 3] },
          sourceInformation: { vertex: 7 }
        })
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

  it('cobweb graded applet', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <copy uri="doenet:contentId=7b504f0c51580d25125f3902e835986c632b0ce3991c82e93c17547e521d5466" assignNames="gradedApplet" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" nIterationsRequired="3" initialValueDx="0.2" x0="1" />
 
  `}, "*");
    });

    let f = x => 2 * x - x ** 2 / 3;

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#/gradedApplet/initialCorrect_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_incorrect')).should('be.visible')

    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')

    cy.get(cesc('#/gradedApplet/startFeedback')).should('be.visible')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({
        pointCoords: { 0: [1, 0] },
      })
    });

    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')
    cy.get(cesc('#/gradedApplet/initialCorrect_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('span').eq(0).click();

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).should('not.exist');

    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/startFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    let x1 = f(1);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 1: [1, x1] } })
    });
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })
    cy.get(cesc('#/gradedApplet/insufficientFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).should('not.exist');

    cy.get(cesc('#/gradedApplet/cobwebApplet/deleteLine')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')
    cy.get(cesc('#/gradedApplet/startFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).should('not.exist');


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })
    cy.get(cesc('#/gradedApplet/insufficientFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).should('not.exist');


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 2: [x1, x1] } })
    });
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('40% correct')
    })
    cy.get(cesc('#/gradedApplet/insufficientFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).should('not.exist');


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    let x2 = f(x1);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 3: [x1, x2] } })
    });

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x2=${Math.round(x2 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(3).should('not.exist');


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 4: [x2, x2] } })
    });

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x2=${Math.round(x2 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(3).should('not.exist');


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    let x3 = f(x2);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 5: [x2, x3] } })
    });

    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_correct')).should('be.visible')


    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x2=${Math.round(x2 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(3).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x3=${Math.round(x3 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(4).should('not.exist');



    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('83% correct')
    })
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 6: [x3, x3] } })
    });
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_correct')).should('be.visible')


    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x2=${Math.round(x2 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(3).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x3=${Math.round(x3 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(4).should('not.exist');



    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('86% correct')
    })
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    let x4 = f(x3);
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components["/gradedApplet/cobwebApplet/cobwebPolyline"].movePolyline({ pointCoords: { 7: [x3, x4] } })
    });
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_correct')).should('be.visible')


    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x1=${Math.round(x1 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(2).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x2=${Math.round(x2 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(3).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x3=${Math.round(x3 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(4).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal(`x4=${Math.round(x4 * 10000) / 10000}`)
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(5).should('not.exist');


  });

  it('cobweb intro tutorial', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <copy uri="doenet:contentId=6d72350e798b3c98ad5f78b47c3ed1dee7526cc219c0265a4114314b2aa9e708" assignNames="cobwebTutorial" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" nIterationsRequired="3" initialValueDx="0.2" x0="1" />
 
  <p>Credit achieved: <copy tname="_document1" prop="creditAchieved" assignNames="ca" /></p>
  `}, "*");
    });

    let f = x => 2 * x - x ** 2 / 3;

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/cobwebTutorial/addPoint1')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P1"].movePoint({ x: 0.9, y: -0.1 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.get((cesc('#/cobwebTutorial/addVline1'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/v1"].moveLine({
        point1coords: [1.2, 1],
        point2coords: [1.2, 2]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get((cesc('#/cobwebTutorial/addHline1'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/h1"].moveLine({
        point1coords: [2, 1.5],
        point2coords: [3, 1.5]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint2'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P2"].movePoint({ x: -0.1, y: 1.7 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get((cesc('#/cobwebTutorial/addPoint3'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P3"].movePoint({ x: 1.8, y: 0 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.5')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.667')


    cy.get((cesc('#/cobwebTutorial/addVline2'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/v2"].moveLine({
        point1coords: [1.5, 3],
        point2coords: [1.5, 4]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.667')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.833')

    cy.get((cesc('#/cobwebTutorial/addHline2'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/h2"].moveLine({
        point1coords: [4, 2.3],
        point2coords: [5, 2.3]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint4'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P4"].movePoint({ x: 0.1, y: 2.5 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.get(cesc('#/cobwebTutorial/shortcutButton')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.get(cesc('#/cobwebTutorial/resetTutorial')).click();


    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/cobwebTutorial/addPoint1')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P1"].movePoint({ x: 0.9, y: -0.1 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.get((cesc('#/cobwebTutorial/addVline1'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/v1"].moveLine({
        point1coords: [1.2, 1],
        point2coords: [1.2, 2]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get((cesc('#/cobwebTutorial/addHline1'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/h1"].moveLine({
        point1coords: [2, 1.5],
        point2coords: [3, 1.5]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint2'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P2"].movePoint({ x: -0.1, y: 1.7 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get((cesc('#/cobwebTutorial/addPoint3'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P3"].movePoint({ x: 1.8, y: 0 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.5')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.667')


    cy.get((cesc('#/cobwebTutorial/addVline2'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/v2"].moveLine({
        point1coords: [1.5, 3],
        point2coords: [1.5, 4]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.667')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.833')

    cy.get((cesc('#/cobwebTutorial/addHline2'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/h2"].moveLine({
        point1coords: [4, 2.3],
        point2coords: [5, 2.3]
      });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint4'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/cobwebTutorial/P4"].movePoint({ x: 0.1, y: 2.5 });
    })

    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.get(cesc('#/cobwebTutorial/shortcutButton')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')


  });


});
