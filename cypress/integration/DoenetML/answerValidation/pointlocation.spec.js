describe('Point location validation tests',function() {

  beforeEach(() => {
    cy.visit('/cypressTest')
    })
  
  it('point in first quadrant',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p>Move point to first quadrant</p>
    <graph><point>(-3.9,4.5)</point></graph>
    <p><answer>
      <award><when>
        <copy prop="x" target="_point1" /> > 0 and 
        <copy prop="y" target="_point1" /> > 0
      </when></award>
      <considerAsResponses>$_point1</considerAsResponses>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" /></p>
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

    
  it('point in first quadrant, remember submitted on reload',() => {

    let doenetML =  `
    <text>a</text>
    <p>Move point to first quadrant</p>
    <graph><point>(-3.9,4.5)</point></graph>
    <p><answer>
      <award><when>
        <copy prop="x" target="_point1" /> > 0 and 
        <copy prop="y" target="_point1" /> > 0
      </when></award>
      <considerAsResponses>$_point1</considerAsResponses>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" /></p>
    `;


    cy.window().then((win) => {
      win.postMessage({
        doenetML: ''
      }, "*");
    });

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalPageState').click()
    cy.wait(1000)
    cy.get('#testRunner_toggleControls').click();


    cy.window().then((win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });


    cy.get('#\\/_text1').should('have.text','a');   // to wait for page to load

    cy.log("Move point to correct quadrant and move again")
    // for some reason, have to move point twice to trigger bug
    // that occurs when expressionWithCodes of math isn't changed
    
    cy.window().then((win) => {
      let core = win.state.core;
      // Note: have to use requestAction here
      // rather than call movePoint twice directly
      // to make sure the second action is queued and waits for first to complete
      core.requestAction({
        componentName: "/_point1",
        actionName: "movePoint",
        args: {x: 5.9, y: 3.5},
      })
      core.requestAction({
        componentName: "/_point1",
        actionName: "movePoint",
        args: {x: 5.9, y: 3.4},
      })
      // let components = Object.assign({},win.state.components);
      // components['/_point1'].movePoint({x: 5.9, y: 3.5})
      // components['/_point1'].movePoint({x: 5.9, y: 3.4})
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

    cy.log("Reload page")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: '<text>b</text>',
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

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


    cy.log("Reload page")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: '<text>b</text>',
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

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
      let core = win.state.core;
      // Note: have to use requestAction here
      // rather than call movePoint twice directly
      // to make sure the second action is queued and waits for first to complete
      core.requestAction({
        componentName: "/_point1",
        actionName: "movePoint",
        args: {x: -9.4, y: -5.1},
      })
      core.requestAction({
        componentName: "/_point1",
        actionName: "movePoint",
        args: {x: -9.5, y: -5.1},
      })
      let components = Object.assign({},win.state.components);
      // components['/_point1'].movePoint({x: -9.4, y: -5.1})
      // components['/_point1'].movePoint({x: -9.5, y: -5.1})
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


    cy.log("Reload page")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: '<text>b</text>',
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'b') //wait for page to load

    cy.window().then((win) => {
      win.postMessage({
        doenetML,
      }, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');


  });


  it('point at precise location with attract',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal">(-4.1, 7.4)</point>
    <p>Move point to <copy prop="coords" target="goal" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy target="goal" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer><award><when>
    <copy prop="x" target="A" isResponse /> = <copy prop="x" target="goal" /> and 
    <copy prop="y" target="A" isResponse /> = <copy prop="y" target="goal" />
    </when></award></answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" /></p>
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

    <number hide name="criterion2"><copy prop="value" target="criterion" />^2</number>
    <number hide name="partialcriterion2"><copy prop="value" target="partialcriterion" />^2</number>
    <number hide name="distance2">(<copy prop="x" target="A" /> - <copy prop="x" target="goal" />)^2 + 
    (<copy prop="y" target="A" /> - <copy prop="y" target="goal" />)^2</number>

    <p>Move point to within distance of <copy prop="value" target="criterion" /> to <copy prop="coords" target="goal" /></p>
    <graph>
      <point name="A">(4.9, -1.1)</point>
    </graph>
    <p><answer>
      <award><when>
        <copy target="distance2" /> < <copy target="criterion2" />
      </when></award>
      <award credit="0.6"><when>
        <copy target="distance2" /> < <copy target="partialcriterion2" />
      </when></award>
      <considerAsResponses>$A</considerAsResponses>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" /></p>
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
  

  it('two points at precise locations, partial match',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer>
      <award matchPartial unorderedCompare targetsAreResponses="A B">
        <when>
          ($A, $B) = ($goal1, $goal2)
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((4.9,-1.1),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move A near correct point")
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Move point A further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-2.3,-3.4))')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point B close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -3.8, y: 7.1})
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 6.9, y: 9.0})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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

    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Move point B away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -9.9, y: -8.8})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });
  

    cy.log("Move point B close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: 6.7, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 0.1, y: -1.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.6})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

  });

  it('two points at precise locations, partial match, ordered',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer>
      <award matchPartial targetsAreResponses="A B">
        <when>
          ($A, $B) = ($goal1, $goal2)
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((4.9,-1.1),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move A near correct point")
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Move point A further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-2.3,-3.4))')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point B close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -3.8, y: 7.1})
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 6.9, y: 9.0})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });

    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point B away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -9.9, y: -8.8})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });
  

    cy.log("Move point B close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: 6.7, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 0.1, y: -1.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.6})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

  });

  it('two points at precise locations, award based as string literals, partial match',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer>
      <award matchPartial unorderedCompare targetsAreResponses="A B">
        <when>
          ($A, $B) = ((-4.1, 7.4), (6.8, 9.1))
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((4.9,-1.1),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move A near correct point")
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Move point A further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-2.3,-3.4))')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point B close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -3.8, y: 7.1})
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 6.9, y: 9.0})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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

    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Move point B away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -9.9, y: -8.8})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });
  

    cy.log("Move point B close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: 6.7, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 0.1, y: -1.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.6})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

  });

  it('two points at precise locations, award based as string literals, partial match, ordered',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer>
      <award matchPartial targetsAreResponses="A B">
        <when>
          ($A, $B) = ((-4.1, 7.4), (6.8, 9.1))
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((4.9,-1.1),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move A near correct point")
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Move point A further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-2.3,-3.4))')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point B close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -3.8, y: 7.1})
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 6.9, y: 9.0})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });

    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point B away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -9.9, y: -8.8})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });
  

    cy.log("Move point B close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: 6.7, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 0.1, y: -1.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.6})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

  });

  it('two points at precise locations, partial match, as mathlists',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <graph>
      <point name="A" x="4.9" y="-1.1">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
      <point name="B" x="-2.3" y="-3.4">
        <constraints>
          <attractTo><copy target="goal1" /></attractTo>
          <attractTo><copy target="goal2" /></attractTo>
        </constraints>
      </point>
    </graph>
    <p><answer>
      <award matchPartial unorderedCompare targetsAreResponses="A B">
        <when>
          <mathlist>$A $B</mathlist> = <mathlist>$goal1 $goal2</mathlist>
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((4.9,-1.1),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move A near correct point")
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(-2.3,-3.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });

    cy.log("Move point A further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-2.3,-3.4))')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  
    cy.log("Move point B close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -3.8, y: 7.1})
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 6.9, y: 9.0})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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

    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });


    cy.log("Move point B away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -9.9, y: -8.8})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });
  

    cy.log("Move point B close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: 6.7, y: 9})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 0.1, y: -1.1})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
    });


    cy.log("Move point A near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.6})
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0.5);
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
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(1);
    });

  });

  it('dynamical number of points, partial match, as mathlists',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <p>Number of points: <mathinput prefill="0" name="n" /></p>
    <graph>
      <map name="map1" assignNames="(A) (B) (C)">
        <template>
          <point x='$i' y='1'>
            <constraints>
              <attractTo><copy target="goal1" /></attractTo>
              <attractTo><copy target="goal2" /></attractTo>
            </constraints>
          </point>
        </template>
        <sources alias="i"><sequence fixed='false' from="1" to="$n" /></sources>
      </map>
    </graph>
    <p><answer>
      <award matchPartial unorderedCompare targetsAreResponses="map1">
        <when>
          <mathlist>$map1</mathlist> = <mathlist>$goal1 $goal2</mathlist>
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  

    cy.log('Create point A and submit')
    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,1)')
    })


    cy.log("Move A near correct point")
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-4.1,7.4)')
    })

    cy.log("Move point A further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.7, y: 7})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3.7,7)')
    })
  
    cy.log('create point B and submit');
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(2,1))')
    })

    cy.log("Move point B close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -3.8, y: 7.1})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })


    cy.log("Move point A close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 6.9, y: 9.0})
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })


    cy.log("Move point B away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: -9.9, y: -8.8})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.log("Move point B close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B'].movePoint({x: 6.7, y: 9})
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })


    cy.log("Move point A away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: 0.1, y: -1.1})
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.log("Move point A near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A'].movePoint({x: -3.8, y: 7.6})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.log('create point C and submit');
    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.6666666667)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1),(3,1))')
    })


    cy.log("Move point C near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/C'].movePoint({x: -3.8, y: 7.6})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('67% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.6666666667)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1),(-4.1,7.4))')
    })

    cy.log('remove point C and submit');
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })


  });

  it('dynamical number of points, double map, partial match',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <point name="goal1">(-4.1, 7.4)</point>
    <point name="goal2">(6.8, 9.1)</point>
    <p>Move points to <copy prop="coords" target="goal1" /> <copy prop="coords" target="goal2" /></p>
    <p>Number of points: <mathinput prefill="0" name="n" /></p>
    <p>Number of points 2: <mathinput prefill="0" name="m" /></p>
    <graph>
      <map name="map1" assignNames="(A1 ((A2))) (B1 ((B2)))">
        <template>
          <point x='$i' y='1'>
            <constraints>
              <attractTo><copy target="goal1" /></attractTo>
              <attractTo><copy target="goal2" /></attractTo>
            </constraints>
          </point>
          <map>
            <template>
              <point x='$j' y='2'>
                <constraints>
                  <attractTo><copy target="goal1" /></attractTo>
                  <attractTo><copy target="goal2" /></attractTo>
                </constraints>
              </point>
            </template>
            <sources alias="j"><sequence fixed='false' from="1" to="$m" /></sources>
          </map>
        </template>
        <sources alias="i"><sequence fixed='false' from="1" to="$n" /></sources>
      </map>
    </graph>
    <p><answer>
      <award matchPartial unorderedCompare targetsAreResponses="map1">
        <when>
          <mathlist>$map1</mathlist> = <mathlist>$goal1 $goal2</mathlist>
        </when>
      </award>
    </answer></p>
    <p>Credit for answer: <copy prop="creditAchieved" target="_answer1" assignNames="ca" /></p>
    <p>Submitted responses: <math name="srs"><copy prop="submittedResponses" target="_answer1" /></math></p>
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
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_answer1'].stateValues.creditAchieved).eq(0);
    });
  

    cy.log('Create point A1 and submit')
    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,1)')
    })


    cy.log("Move A1 near correct point")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A1'].movePoint({x: -4, y: 7.6})
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
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-4.1,7.4)')
    })

    cy.log("Move point A1 further away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A1'].movePoint({x: -3.7, y: 7})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 0.0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3.7,7)')
    })
  
    cy.log('create point A2 and submit');
    cy.get('#\\/m textarea').type('{end}{backspace}1{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('incorrect')
    });
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 0)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(1,2))')
    })

    cy.log("Move point A2 close and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A2'].movePoint({x: -3.8, y: 7.1})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-3.7,7),(-4.1,7.4))')
    })


    cy.log("Move point A1 close to other goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A1'].movePoint({x: 6.9, y: 9.0})
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');

    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-4.1,7.4))')
    })


    cy.log("Move point A2 away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A2'].movePoint({x: -9.9, y: -8.8})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(-9.9,-8.8))')
    })

    cy.log("Move point A2 close to second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A2'].movePoint({x: 6.7, y: 9})
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((6.8,9.1),(6.8,9.1))')
    })


    cy.log("Move point A1 away and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A1'].movePoint({x: 0.1, y: -1.1})
    });

    cy.log("Submit answer")
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((0.1,-1.1),(6.8,9.1))')
    })

    cy.log("Move point A1 near first goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/A1'].movePoint({x: -3.8, y: 7.6})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })

    cy.log('create point B1 and B2 and submit');
    cy.get('#\\/n textarea').type('{end}{backspace}2{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1),(2,1),(1,2))')
    })


    cy.log("Move point B1 near second goal and submit")
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      components['/B1'].movePoint({x: 7, y: 9})
    });

    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').should('not.exist');
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('50% correct')
    });
    cy.get('#\\/ca').should('have.text', 0.5)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1),(6.8,9.1),(1,2))')
    })

    cy.log('remove points A2 and B2 and submit');
    cy.get('#\\/m textarea').type('{end}{backspace}0{enter}', {force:true});
    cy.get('#\\/_answer1_submit').click();
    cy.get('#\\/_answer1_submit').should('not.exist');
    cy.get('#\\/_answer1_correct').invoke('text').then((text) => {
      expect(text.trim().toLowerCase()).equal('correct')
    });
    cy.get('#\\/_answer1_incorrect').should('not.exist');
    cy.get('#\\/_answer1_partial').should('not.exist');
    cy.get('#\\/ca').should('have.text', 1)
    cy.get(`#\\/srs`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('((-4.1,7.4),(6.8,9.1))')
    })


  });

  
});