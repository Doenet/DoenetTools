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
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('logistic system', () => {
    cy.window().then(async (win) => {
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
    <copy prop="coords" target="P1"/> = <math>(1,0)</math>
    </when></award>
  </answer>
  </p>

  <updateValue label="Add line" name="addline" target="nPoints" newValue="$nPoints+1" />
  <updateValue label="Delete line" name="deleteline" hide="$nPoints=1" target='nPoints' newValue="$nPoints-1" />
  
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
        <copy prop="iterateValues" target="graph1/cobweb" />
      </sources>
    </map>
    </md>

  </subsection>

  <p>Cobweb at least three iterations</p>
  <p><answer name="check_cobweb">
  <award credit="$(graph1/cobweb{prop='fractionCorrectVerticesAdjusted'})"><when>true</when></award>
    <considerAsResponses>
      <copy prop="vertices" target="graph1/cobweb" />
    </considerAsResponses>
  </answer>
  </p>

  <p name="psr">Submitted responses are the vertices of the polyline: <aslist><copy target="check_cobweb" prop="submittedResponses" displaydigits="5" /></aslist></p>

  Current responses are the vertices of the polyline: 
  <copy target="check_cobweb" prop="currentResponses" displaydigits="5" assignNames="cr1 cr2 cr3 cr4 cr5 cr6 cr7 cr8 cr9 cr10" />

  `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let xCenter = (-2 + 5) / 2, yCenter = (-2.2 + 4.5) / 2;

    cy.get('#\\/_p1').should('contain.text', 'Initial condition is')

    cy.log('Click both submit buttons');
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

    cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(−1.5,0)')
    })
    cy.get("#\\/cr2").should('not.exist');


    cy.log('Move first point');

    cy.window().then(async (win) => {

      win.callAction1({
        actionName: "movePolyline",
        componentName: "/graph1/cobweb",
        args: {
          pointCoords: { 0: [1, 0] },
          sourceInformation: { vertex: 0 }
        }
      })

      cy.get("#\\/cr1 .mjx-mrow").should('contain.text', '(1,0)')

      cy.log('Click submit');

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2").should('not.exist');

      cy.log('Add second point');

      cy.get('#\\/addline_button').click();

      cy.get("#\\/cr2 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.log('Move second point to wrong location');

      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 1: [3, 4] },
            sourceInformation: { vertex: 1 }
          }
        })
      })

      cy.get("#\\/cr2 .mjx-mrow").should('contain.text', '(3,4)')

      cy.log('Click submit');

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,4)')
      })
      cy.get("#\\/cr3").should('not.exist');


      cy.log('Move second point to second wrong location');

      // Note: move to second wrong point to make sure submit button reappears
      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 1: [1, 1] },
            sourceInformation: { vertex: 1 }
          }
        })
      })
      cy.get("#\\/cr2 .mjx-mrow").should('contain.text', '(1,1)')

      cy.log('Click submit');

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)')
      })
      cy.get("#\\/cr3").should('not.exist');

      cy.log('Move second point to correct location');

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 1: [1, 1.6] },
            sourceInformation: { vertex: 1 }
          }
        })
      })

      cy.get("#\\/cr2 .mjx-mrow").should('contain.text', '(1,1.6667)')

      cy.log('Click submit');

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3").should('not.exist');


      cy.log('Add third point');

      // don't move to check that it is at center of graph
      cy.get('#\\/addline_button').click();

      cy.get("#\\/cr3 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '20%')
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
      cy.get('#\\/psr').find('.mjx-mrow').eq(4).invoke('text').then((text) => {
        expect(text.trim()).equal(`(${xCenter},${yCenter})`)
      })
      cy.get('#\\/psr').find('.mjx-mrow').eq(6).should('not.exist');

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(${xCenter},${yCenter})`)
      })
      cy.get("#\\/cr4").should('not.exist');


      cy.log('Move third point to correct location');

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 2: [1.6, 1.6] },
            sourceInformation: { vertex: 2 }
          }
        })
      })

      cy.get("#\\/cr3 .mjx-mrow").should('contain.text', `(1.6667,1.6667)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '40%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4").should('not.exist');


      cy.log('Add fourth point and move to wrong location');

      cy.get('#\\/addline_button').click()

      cy.get("#\\/cr4 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.window().then(async (win) => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 3: [1, 2] },
            sourceInformation: { vertex: 3 }
          }
        })
      })

      cy.get("#\\/cr4 .mjx-mrow").should('contain.text', `(1,2)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '40%')

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1,2)`)
      })
      cy.get("#\\/cr5").should('not.exist');


      cy.log('Move fourth point to correct location');

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 3: [1.6, 2.4] },
            sourceInformation: { vertex: 3 }
          }
        })
      })

      cy.get("#\\/cr4 .mjx-mrow").should('contain.text', `(1.6667,2.4074)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '60%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5").should('not.exist');


      cy.log("Delete fourth point");
      cy.get('#\\/deleteline_button').click();

      cy.get("#\\/cr4").should('not.exist');

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '40%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4").should('not.exist');


      cy.log('Add fourth point back')
      cy.get('#\\/addline_button').click();

      cy.get("#\\/cr4 .mjx-mrow").should('contain.text', `(1.6667,2.4074)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '60%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5").should('not.exist');


      cy.log('Add fifth point and move to correct location');

      cy.get('#\\/addline_button').click();
      cy.get("#\\/cr5 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 4: [2.4, 2.4] },
            sourceInformation: { vertex: 4 }
          }
        })
      })

      cy.get("#\\/cr5 .mjx-mrow").should('contain.text', `(2.4074,2.4074)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '80%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.4074)`)
      })
      cy.get("#\\/cr6").should('not.exist');

      cy.log('Add sixth point and move to wrong location');

      cy.get('#\\/addline_button').click();
      cy.get("#\\/cr6 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 5: [-1, 3] },
            sourceInformation: { vertex: 5 }
          }
        })
      })

      cy.get("#\\/cr6 .mjx-mrow").should('contain.text', `(−1,3)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '80%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.4074)`)
      })
      cy.get("#\\/cr6 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(−1,3)`)
      })
      cy.get("#\\/cr7").should('not.exist');


      cy.log('Move sixth point correct location');

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 5: [2.4, 3] },
            sourceInformation: { vertex: 5 }
          }
        })
      })

      cy.get("#\\/cr6 .mjx-mrow").should('contain.text', `(2.4074,2.8829)`)

      cy.log('Click submit');

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.4074)`)
      })
      cy.get("#\\/cr6 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.8829)`)
      })
      cy.get("#\\/cr7").should('not.exist');


      cy.log('Add seventh point and move to wrong location');

      cy.get('#\\/addline_button').click();
      cy.get("#\\/cr7 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 6: [3, 1] },
            sourceInformation: { vertex: 6 }
          }
        })
      })

      cy.get("#\\/cr7 .mjx-mrow").should('contain.text', `(3,1)`)

      cy.log('Click submit');

      cy.get('#\\/check_cobweb_submit').click();
      cy.get('#\\/check_cobweb_partial').should('contain.text', '83%')
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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.4074)`)
      })
      cy.get("#\\/cr6 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.8829)`)
      })
      cy.get("#\\/cr7 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(3,1)`)
      })
      cy.get("#\\/cr8").should('not.exist');


      cy.log('Move seventh point correct location');

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 6: [3, 3] },
            sourceInformation: { vertex: 6 }
          }
        })
      })

      cy.get("#\\/cr7 .mjx-mrow").should('contain.text', `(2.8829,2.8829)`)

      cy.log('Click submit');

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

      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.4074)`)
      })
      cy.get("#\\/cr6 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.8829)`)
      })
      cy.get("#\\/cr7 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.8829,2.8829)`)
      })
      cy.get("#\\/cr8").should('not.exist');


      cy.log('Add eighth point and move to correct location');

      cy.get('#\\/addline_button').click();
      cy.get("#\\/cr8 .mjx-mrow").should('contain.text', `(${xCenter},${yCenter})`)

      cy.window().then(async () => {
        win.callAction1({
          actionName: "movePolyline",
          componentName: "/graph1/cobweb",
          args: {
            pointCoords: { 7: [3, 3] },
            sourceInformation: { vertex: 7 }
          }
        })
      })

      cy.get("#\\/cr8 .mjx-mrow").should('contain.text', `(2.8829,2.9954)`)

      cy.log('Click submit');

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


      cy.get("#\\/cr1 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,0)')
      })
      cy.get("#\\/cr2 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1.6667)')
      })
      cy.get("#\\/cr3 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,1.6667)`)
      })
      cy.get("#\\/cr4 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(1.6667,2.4074)`)
      })
      cy.get("#\\/cr5 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.4074)`)
      })
      cy.get("#\\/cr6 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.4074,2.8829)`)
      })
      cy.get("#\\/cr7 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.8829,2.8829)`)
      })
      cy.get("#\\/cr8 .mjx-mrow").eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal(`(2.8829,2.9954)`)
      })
      cy.get("#\\/cr9").should('not.exist');


    });

  });

  it('cobweb graded applet', () => {
    cy.window().then(async (win) => {
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
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 0: [1, 0] },
        }
      })
    });

    cy.get(cesc('#/gradedApplet/initialCorrect_submit')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')
    cy.get(cesc('#/gradedApplet/initialCorrect_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('span').eq(0).click();

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).should('not.exist');

    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).should('be.visible')
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/startFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    let x1 = f(1);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 1: [1, x1] }
        }
      })
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

    cy.get(cesc('#/gradedApplet/cobwebApplet/deleteLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/initialCorrect_correct')).should('be.visible')
    cy.get(cesc('#/gradedApplet/correctCobwebbing_incorrect')).should('be.visible')
    cy.get(cesc('#/gradedApplet/startFeedback')).should('be.visible')

    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("x0=1")
    })
    cy.get(cesc('#/gradedApplet/cobwebApplet/calculatedValue')).find('.mjx-mtr').eq(1).should('not.exist');


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
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


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('20% correct')
    })
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 2: [x1, x1] }
        }
      })
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


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).should('be.visible')

    let x2 = f(x1);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 3: [x1, x2] }
        }
      })
    });
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).should('be.visible');

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


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();

    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).should('be.visible')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 4: [x2, x2] }
        }
      })
    });

    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).should('be.visible');

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


    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).should('be.visible')

    let x3 = f(x2);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 5: [x2, x3] }
        }
      })
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



    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).should('be.visible');
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('83% correct')
    })
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 6: [x3, x3] }
        }
      })
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



    cy.get(cesc('#/gradedApplet/cobwebApplet/addLine_button')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_submit')).click();
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).should('be.visible');
    cy.get(cesc('#/gradedApplet/correctCobwebbing_partial')).invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('86% correct')
    })
    cy.get(cesc('#/gradedApplet/incorrectFeedback')).should('be.visible')

    let x4 = f(x3);
    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePolyline",
        componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
        args: {
          pointCoords: { 7: [x3, x4] }
        }
      })
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
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <copy uri="doenet:contentId=6d72350e798b3c98ad5f78b47c3ed1dee7526cc219c0265a4114314b2aa9e708" assignNames="cobwebTutorial" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" nIterationsRequired="3" initialValueDx="0.2" x0="1" />
 
  <p>Credit achieved: <copy target="_document1" prop="creditAchieved" assignNames="ca" /></p>
  `}, "*");
    });

    let f = x => 2 * x - x ** 2 / 3;

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/cobwebTutorial/addPoint1_button')).click();
    cy.get(cesc('#/cobwebTutorial/addPoint1_button')).should('not.exist');
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P1",
        args: { x: 0.9, y: -0.1 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.get((cesc('#/cobwebTutorial/addVline1_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addVline1_button'))).should('not.exist');
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/v1",
        args: {
          point1coords: [1.2, 1],
          point2coords: [1.2, 2]
        }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get((cesc('#/cobwebTutorial/addHline1_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addHline1_button'))).should('not.exist');
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/h1",
        args: {
          point1coords: [2, 1.5],
          point2coords: [3, 1.5]
        }
      })
    })
    cy.get((cesc('#/cobwebTutorial/addPoint2_button'))).should('be.visible')
    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint2_button'))).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P2",
        args: { x: -0.1, y: 1.7 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get((cesc('#/cobwebTutorial/addPoint3_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addPoint3_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P3",
        args: { x: 1.8, y: 0 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.5')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.667')


    cy.get((cesc('#/cobwebTutorial/addVline2_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addVline2_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/v2",
        args: {
          point1coords: [1.5, 3],
          point2coords: [1.5, 4]
        }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.667')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.833')

    cy.get((cesc('#/cobwebTutorial/addHline2_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addHline2_button'))).should('not.exist');
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/h2",
        args: {
          point1coords: [4, 2.3],
          point2coords: [5, 2.3]
        }
      })
    })

    cy.get((cesc('#/cobwebTutorial/addPoint4_button'))).should('be.visible')
    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint4_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addPoint4_button'))).should("not.exist")
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P4",
        args: { x: 0.1, y: 2.5 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.get(cesc('#/cobwebTutorial/shortcutButton_button')).click();
    cy.get(cesc('#/cobwebTutorial/shortcutButton_button')).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.get(cesc('#/cobwebTutorial/resetTutorial_button')).click();


    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/cobwebTutorial/addPoint1_button')).click();
    cy.get(cesc('#/cobwebTutorial/addPoint1_button')).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P1",
        args: { x: 0.9, y: -0.1 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.get((cesc('#/cobwebTutorial/addVline1_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addVline1_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/v1",
        args: {
          point1coords: [1.2, 1],
          point2coords: [1.2, 2]
        }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.167')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.333')

    cy.get((cesc('#/cobwebTutorial/addHline1_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addHline1_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/h1",
        args: {
          point1coords: [2, 1.5],
          point2coords: [3, 1.5]
        }
      })
    })

    cy.get((cesc('#/cobwebTutorial/addPoint2_button'))).should('be.visible')
    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint2_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addPoint2_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P2",
        args: { x: -0.1, y: 1.7 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.333')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.5')

    cy.get((cesc('#/cobwebTutorial/addPoint3_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addPoint3_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P3",
        args: { x: 1.8, y: 0 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.5')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.667')


    cy.get((cesc('#/cobwebTutorial/addVline2_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addVline2_button'))).should("not.exist")
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/v2",
        args: {
          point1coords: [1.5, 3],
          point2coords: [1.5, 4]
        }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.667')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.833')

    cy.get((cesc('#/cobwebTutorial/addHline2_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addHline2_button'))).should("not.exist")
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "moveLine",
        componentName: "/cobwebTutorial/h2",
        args: {
          point1coords: [4, 2.3],
          point2coords: [5, 2.3]
        }
      })
    })

    cy.get((cesc('#/cobwebTutorial/addPoint4_button'))).should("be.visible")
    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get((cesc('#/cobwebTutorial/addPoint4_button'))).click();
    cy.get((cesc('#/cobwebTutorial/addPoint4_button'))).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');

    cy.window().then(async (win) => {
      win.callAction1({
        actionName: "movePoint",
        componentName: "/cobwebTutorial/P4",
        args: { x: 0.1, y: 2.5 }
      })
    })

    cy.get(cesc('#/cobwebTutorial/next_button')).should('not.be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '0.833')
    cy.get(cesc('#/cobwebTutorial/next_button')).click();
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')

    cy.get(cesc('#/cobwebTutorial/shortcutButton_button')).click();
    cy.get(cesc('#/cobwebTutorial/shortcutButton_button')).should('not.exist')
    cy.get(cesc('#/cobwebTutorial/next_button')).should('be.disabled');
    cy.get(cesc('#/ca')).should('have.text', '1')


  });


});
