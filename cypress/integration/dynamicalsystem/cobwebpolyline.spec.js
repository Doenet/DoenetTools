describe('ODEsystem Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('1D linear system', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetCode: `
  <function name='f' hide='true' variable='x'>1/3*x*(3-x)+x</function>
  <number hide="true" name="nPoints">1</number>

  <point name="P1" hide="true">
    <attractToGrid dx="0.2" xthreshold="0.05"/>
    (-1.5,0)
  </point>
  
  <p>Initial condition is at <m>x_0 = 1</m>:
  <answer name="check_initial"><award><if>
  <ref prop="coords">P1</ref> = <math>(1,0)</math>
  </if></award></answer>
  </p>

  <updateValue label="Add line" name="addline">
    <mathtarget><ref>nPoints</ref></mathtarget>
    <newmathvalue><ref>nPoints</ref>+1</newmathvalue>
  </updateValue>
  <updateValue label="Delete line" name="deleteline">
    <hide><if><ref>nPoints</ref> = 1</if></hide>
    <mathtarget><ref>nPoints</ref></mathtarget>
    <newmathvalue><ref>nPoints</ref>-1</newmathvalue>
  </updateValue>

  <panel>
  <graph xmin="-2" xmax="5" ymin="-2.2" ymax="4.5" width="500px" height="300px" name="graph1" xlabel="x_n" ylabel="x_{n+1}" newnamespace="true">
    <ref fixed="true">../f</ref>
    <line fixed="true" stylenumber="2">y=x</line>

    <point name="P1show">
      <fixed><if><ref>../nPoints</ref> > 1</if></fixed>
      <label>x_0 = <ref prop="x" displaydigits="3">../P1</ref></label>
      <showlabel><if><ref>../nPoints</ref> = 1</if></showlabel>
      <ref prop="coords">../P1</ref>
    </point>

    <cobwebpolyline name="cobweb" stylenumber="4" attractThreshold="0.2">
      <nPoints><ref>../nPoints</ref></nPoints>
      <ref>../f</ref>
      <initialpoint><ref>../P1</ref></initialpoint>
    </cobwebpolyline>


    <ref prop="lastVertex" stylenumber="4" name="lastP">
      <hide><if><ref>../nPoints</ref>=1</if></hide>
      <label>(x_{<number><ref>../nPoints</ref>/2-1</number>}, x_{<number><ref>../nPoints</ref>/2</number>}) = <ref prop="coords" displaydigits="3">lastP</ref></label>
      <showlabel><if><mod><ref>../nPoints</ref><number>2</number></mod>=0</if></showlabel>
      cobweb
    </ref>
  </graph>      


  <aside width="200px">
    <title>Result of cobweb sketch</title>

  <md>
  <mrow>x_0 \\amp = <ref prop="x" displaydigits="5">P1</ref></mrow>
  <map>
    <template>
      <mrow>
        x_{<subsindex/>} \\amp = <subsref displaydigits="5"/>
      </mrow>
    </template>
    <substitutions>
      <ref prop="iterateValues">graph1/cobweb</ref>
    </substitutions>
  </map>
  </md>

  </aside>
  </panel>

  <p>Cobweb at least three iterations
  <answer name="check_cobweb">
  <award>
    <if matchpartial="true">
      <booleanlist>
      <ref prop="correctVertices">graph1/cobweb</ref>
      </booleanlist>
      =
      <booleanlist>
        <map>
          <template>
            <boolean>true</boolean>
          </template>
          <substitutions>
            <sequence><to><max><number><ref>nPoints</ref>-1</number><number>5</number></max></to></sequence>
          </substitutions>
        </map>
      </booleanlist>
    </if>
  </award>
  </answer>
  </p>

  `}, "*");
    });

    cy.get('#\\/_p1').should('contain.text', 'Initial condition is at')
    cy.get('#\\/check_initial_submit').click();
    cy.get('#\\/check_initial_incorrect').should('be.visible');
    cy.get('#\\/check_cobweb_submit').click();
    cy.get('#\\/check_cobweb_incorrect').should('be.visible');

    cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x0=−1.5')
    })
    cy.get('#\\/_md1').find('.mjx-mtr').eq(1).should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      components['/graph1/p1show'].movePoint({x: 1.02, y: 0.02})
      cy.get('#\\/check_initial_submit').click();
      cy.get('#\\/check_initial_correct').should('be.visible');
      cy.get('#\\/_md1').find('.mjx-mtr').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x0=1')
      })
      cy.get('#\\/_md1').find('.mjx-mtr').eq(1).should('not.exist');

      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 3, y: 4})
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

      cy.window().then(() => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 1, y: 1.6})
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


      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 2, y: 1})
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


      cy.window().then(() => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 1.6, y: 1.6})
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


      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 1, y: 2})
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

      
      cy.window().then(() => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 1.6, y: 2.4})
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


      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 2.4, y: 2.4})
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


      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: -1, y: 3})
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


            
      cy.window().then(() => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 2.4, y: 3})
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


      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 3, y: 1})
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


            
      cy.window().then(() => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 3, y: 3})
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



      cy.get('#\\/addline').click().then((_) => {
        components['/graph1/lastp'].replacements[0].movePoint({x: 3, y: 3})
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


    });

  });

});
