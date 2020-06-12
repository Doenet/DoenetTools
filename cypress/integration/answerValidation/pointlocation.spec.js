describe('Point location validation tests',function() {

  beforeEach(() => {
    cy.visit('/test')
    })
  
  it('point in first quadrant',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p>Move point to first quadrant</p>
    <graph><point>(-3.9,4.5)</point></graph>
    <p><answer><award><if>
    <ref prop="x">_point1</ref> > 0 and 
    <ref prop="y">_point1</ref> > 0
    </if></award></answer></p>
    <p>Credit for answer: <ref prop="creditAchieved">_answer1</ref></p>
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });
  
    cy.log("Move point to correct quadrant")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 5.9, y: 3.5})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });

    cy.log("Move point to second quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -8.8, y: 1.3})
      expect(components['/_answer1'].state.creditAchieved).eq(1);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });
  
    cy.log("Move point to third quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: -9.4, y: -5.1})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });
  
    cy.log("Move point to fourth quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 4.2, y: -2.9})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Move point back to first quadrant and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/_point1'].movePoint({x: 4.6, y: 0.1})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });
  
  });

  it('point at precise location with attract',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal">(-4.1, 7.4)</point>
    <p>Move point to <ref prop="coords">goal</ref></p>
    <graph>
      <point name="A">(4.9, -1.1)
        <attractTo><ref>goal</ref></attractTo>
      </point>
    </graph>
    <p><answer><award><if>
    <ref prop="x">A</ref> = <ref prop="x">goal</ref> and 
    <ref prop="y">A</ref> = <ref prop="y">goal</ref>
    </if></award></answer></p>
    <p>Credit for answer: <ref prop="creditAchieved">_answer1</ref></p>
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });
  
    cy.log("Move near correct point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -4, y: 7.6})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });

    cy.log("Move point further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].state.creditAchieved).eq(1);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });
  
    cy.log("Move point close again and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -3.8, y: 7.1})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });
  
  });

  it('point close enough to precise location',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal">(-4.1, 7.4)</point>

    <p>Criterion distance: <mathinput name="criterion" prefill="2"/></p>
    <p>Partial credit distance: <mathinput name="partialcriterion" prefill="3"/></p>

    <number hide name="criterion2"><ref prop="value">criterion</ref>^2</number>
    <number hide name="partialcriterion2"><ref prop="value">partialcriterion</ref>^2</number>
    <number hide name="distance2">(<ref prop="x">A</ref> - <ref prop="x">goal</ref>)^2 + 
    (<ref prop="y">A</ref> - <ref prop="y">goal</ref>)^2</number>

    <p>Move point to within distance of <ref prop="value">criterion</ref> to <ref prop="coords">goal</ref></p>
    <graph>
      <point name="A">(4.9, -1.1)</point>
    </graph>
    <p><answer>
      <award><if>
        <ref>distance2</ref> < <ref>criterion2</ref>
      </if></award>
      <award credit="0.6"><if>
        <ref>distance2</ref> < <ref>partialcriterion2</ref>
      </if></award>
    </answer></p>
    <p>Credit for answer: <ref prop="creditAchieved">_answer1</ref></p>
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });
  
    cy.log("Move near correct point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -5, y: 7})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });


    cy.log("change criterion")
    cy.get("#\\/criterion_input").clear().type('1').blur();
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(1);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });


    cy.log("Move point further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -2.8, y: 9})
      expect(components['/_answer1'].state.creditAchieved).eq(1);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0.6);
    });
  
    cy.log("change partial criterion")
    cy.get("#\\/partialcriterion_input").clear().type('2').blur();
    cy.get('#\\/_answer1_submit').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('check work')
    })
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].state.creditAchieved).eq(0.6);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0);
    });

    cy.log("Move point closer again and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -3, y: 9})
      expect(components['/_answer1'].state.creditAchieved).eq(0);
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
      expect(components['/_answer1'].state.creditAchieved).eq(0.6);
    });

    cy.log("Move point even closer and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/a'].movePoint({x: -3.5, y: 8})
      expect(components['/_answer1'].state.creditAchieved).eq(0.6);
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
      expect(components['/_answer1'].state.creditAchieved).eq(1);
    });
  
  });
  
  
});