describe('Point location validation tests',function() {

  beforeEach(() => {
    cy.visit('/cypressTest')
    })
  
  it('point in first quadrant',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p>Move point to first quadrant</p>
    <graph><point>(-3.9,4.5)</point></graph>
    <p><answer><award><when>
    <copy prop="x" tname="_point1" /> > 0 and 
    <copy prop="y" tname="_point1" /> > 0
    </when></award></answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" tname="_answer1" /></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a');   // to wait for page to load

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point to correct quadrant")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 5.9, y: 3.5})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Move point to second quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -8.8, y: 1.3})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');


    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point to third quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -9.4, y: -5.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point to fourth quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 4.2, y: -2.9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Move point back to first quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 4.6, y: 0.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
  
  });

  it('point at precise location with attract',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal">(-4.1, 7.4)</point>
    <p>Move point to <copy prop="coords" tname="goal" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy tname="goal" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer><award><when>
    <copy prop="x" tname="A" /> = <copy prop="x" tname="goal" /> and 
    <copy prop="y" tname="A" /> = <copy prop="y" tname="goal" />
    </when></award></answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" tname="_answer1" /></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a');   // to wait for page to load

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move near correct point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -4, y: 7.6})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Move point further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point close again and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
  
  });

  it('point close enough to precise location',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal">(-4.1, 7.4)</point>

    <p>Criterion distance: <mathinput name="criterion" prefill="2"/></p>
    <p>Partial credit distance: <mathinput name="partialcriterion" prefill="3"/></p>

    <number hide name="criterion2"><copy prop="value" tname="criterion" />^2</number>
    <number hide name="partialcriterion2"><copy prop="value" tname="partialcriterion" />^2</number>
    <number hide name="distance2">(<copy prop="x" tname="A" /> - <copy prop="x" tname="goal" />)^2 + 
    (<copy prop="y" tname="A" /> - <copy prop="y" tname="goal" />)^2</number>

    <p>Move point to within distance of <copy prop="value" tname="criterion" /> to <copy prop="coords" tname="goal" /></p>
    <graph>
      <point name="A">(4.9, -1.1)</point>
    </graph>
    <p><answer>
      <award><when>
        <copy tname="distance2" /> < <copy tname="criterion2" />
      </when></award>
      <award credit="0.6"><when>
        <copy tname="distance2" /> < <copy tname="partialcriterion2" />
      </when></award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" tname="_answer1" /></p>
    `},"*");
    });

    cy.get('#\\/_text1').should('have.text','a');   // to wait for page to load

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move near correct point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -5, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("change criterion")
    cy.get("#\\/criterion textarea").type('{end}{backspace}{backspace}{backspace}1', {force:true}).blur();
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

    cy.log("Resubmit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');
    
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Move point further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -2.8, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('60% correct')
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.6);
    });
  
    cy.log("change partial criterion")
    cy.get("#\\/partialcriterion textarea").type('{end}{backspace}{backspace}{backspace}2', {force:true}).blur();
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.6);
    });

    cy.log("Resubmit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });

    cy.log("Move point closer again and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('60% correct')
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.6);
    });

    cy.log("Move point even closer and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.5, y: 8})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.6);
    });
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist')

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });
  
  });
  
  
});