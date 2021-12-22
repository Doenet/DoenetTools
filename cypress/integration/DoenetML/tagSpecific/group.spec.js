describe('Group Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('nested groups, copied', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Animal: <textinput name="animal" prefill="fox"/></p>
    <p>Plant: <textinput name="plant" prefill="tree"/></p>
    
    <group name="g1">
      <p name="animalp">The animal is a <copy prop="value" target="animal" />.</p>
      <group name="g2">
        <p name="plantp">The plant is a <copy prop="value" target="plant" />.</p>
        <copy target="animalp" assignNames="animalp2" />
        <group name="g3">
          <copy target="plantp" assignNames="plantp2" />
        </group>
        <copy target="g3" assignNames="((plantp3))" />
      </group>
      <copy target="g2" assignNames="(plantp4 (animalp3) ((plantp5)) (((plantp6))))" />
    </group>
    <copy target="g1" assignNames="(animalp4 (plantp7 (animalp5) ((plantp8)) (((plantp9)))) ((plantp10 (animalp6) ((plantp11)) (((plantp12)))  )) )" />
    `}, "*");
    });


    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let animal = "fox";
    let plant = "tree";
    let animalSentence = "The animal is a " + animal + ".";
    let plantSentence = "The plant is a " + plant + ".";
    cy.get('#\\/animalp').should('have.text', animalSentence)
    cy.get('#\\/plantp').should('have.text', plantSentence)
    cy.get('#\\/animalp2').should('have.text', animalSentence)
    cy.get('#\\/plantp2').should('have.text', plantSentence)
    cy.get('#\\/plantp3').should('have.text', plantSentence)
    cy.get('#\\/plantp4').should('have.text', plantSentence)
    cy.get('#\\/animalp3').should('have.text', animalSentence)
    cy.get('#\\/plantp5').should('have.text', plantSentence)
    cy.get('#\\/plantp6').should('have.text', plantSentence)
    cy.get('#\\/animalp4').should('have.text', animalSentence)
    cy.get('#\\/plantp7').should('have.text', plantSentence)
    cy.get('#\\/animalp5').should('have.text', animalSentence)
    cy.get('#\\/plantp8').should('have.text', plantSentence)
    cy.get('#\\/plantp9').should('have.text', plantSentence)
    cy.get('#\\/plantp10').should('have.text', plantSentence)
    cy.get('#\\/animalp6').should('have.text', animalSentence)
    cy.get('#\\/plantp11').should('have.text', plantSentence)
    cy.get('#\\/plantp12').should('have.text', plantSentence)

    cy.get('#\\/animal_input').clear().type('beetle{enter}');
    cy.get('#\\/plant_input').clear().type('dandelion{enter}');
    let animal2 = "beetle";
    let plant2 = "dandelion";
    let animalSentence2 = "The animal is a " + animal2 + ".";
    let plantSentence2 = "The plant is a " + plant2 + ".";
    cy.get('#\\/animalp').should('have.text', animalSentence2)
    cy.get('#\\/plantp').should('have.text', plantSentence2)
    cy.get('#\\/animalp2').should('have.text', animalSentence2)
    cy.get('#\\/plantp2').should('have.text', plantSentence2)
    cy.get('#\\/plantp3').should('have.text', plantSentence2)
    cy.get('#\\/plantp4').should('have.text', plantSentence2)
    cy.get('#\\/animalp3').should('have.text', animalSentence2)
    cy.get('#\\/plantp5').should('have.text', plantSentence2)
    cy.get('#\\/plantp6').should('have.text', plantSentence2)
    cy.get('#\\/animalp4').should('have.text', animalSentence2)
    cy.get('#\\/plantp7').should('have.text', plantSentence2)
    cy.get('#\\/animalp5').should('have.text', animalSentence2)
    cy.get('#\\/plantp8').should('have.text', plantSentence2)
    cy.get('#\\/plantp9').should('have.text', plantSentence2)
    cy.get('#\\/plantp10').should('have.text', plantSentence2)
    cy.get('#\\/animalp6').should('have.text', animalSentence2)
    cy.get('#\\/plantp11').should('have.text', plantSentence2)
    cy.get('#\\/plantp12').should('have.text', plantSentence2)


  })

  it('nested groups, initially unresolved, reffed', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `

    <copy target="g1" />
    <group name="g1">
      <p name="animalp">The animal <copy target="animalphrase" />.</p>
      <group name="g2">
        <p name="plantp">The plant <copy target="plantphrase" />.</p>
        <copy target="animalp" assignNames="animalp2" />
        <group name="g3">
          <copy target="plantp" assignNames="plantp2" />
        </group>
        <copy target="g3" assignNames="((plantp3))" />
      </group>
      <copy target="g2" assignNames="(plantp4 (animalp3) ((plantp5)) (((plantp6))))" />
    </group>
    <copy target="g1" assignNames="(animalp4 (plantp7 (animalp5) ((plantp8)) (((plantp9)))) ((plantp10 (animalp6) ((plantp11)) (((plantp12)))  )) )" />

    <copy name="verb" target="verb1" />
    <copy name="animalphrase" target="animalphrase1" />
    <text name="animalphrase1"><copy target="verb" /> <copy target="animal1" /></text>
    <text name="animal1"><copy target="article" /> <copy prop="value" target="animal" /></text>
    <copy name="verb1" target="verb2" />
    <text name="verb2">is</text>
    <text name="article"><copy target="article1" /></text>
    <copy name="article1" target="article2" />
    <text name="article2">a</text>
    <copy name="plantphrase" target="plantphrase1" />
    <text name="plantphrase1"><copy target="verb" /> <copy target="plant1" /></text>
    <text name="plant1"><copy target="article" /> <copy prop="value" target="plant" /></text>

    <p>Animal: <textinput name="animal" prefill="fox"/></p>
    <p>Plant: <textinput name="plant" prefill="tree"/></p>
    
    `}, "*");
    });

    let animal = "fox";
    let plant = "tree";
    let animalSentence = "The animal is a " + animal + ".";
    let plantSentence = "The plant is a " + plant + ".";
    cy.get('#\\/animalp').should('have.text', animalSentence)
    cy.get('#\\/plantp').should('have.text', plantSentence)
    cy.get('#\\/animalp2').should('have.text', animalSentence)
    cy.get('#\\/plantp2').should('have.text', plantSentence)
    cy.get('#\\/plantp3').should('have.text', plantSentence)
    cy.get('#\\/plantp4').should('have.text', plantSentence)
    cy.get('#\\/animalp3').should('have.text', animalSentence)
    cy.get('#\\/plantp5').should('have.text', plantSentence)
    cy.get('#\\/plantp6').should('have.text', plantSentence)
    cy.get('#\\/animalp4').should('have.text', animalSentence)
    cy.get('#\\/plantp7').should('have.text', plantSentence)
    cy.get('#\\/animalp5').should('have.text', animalSentence)
    cy.get('#\\/plantp8').should('have.text', plantSentence)
    cy.get('#\\/plantp9').should('have.text', plantSentence)
    cy.get('#\\/plantp10').should('have.text', plantSentence)
    cy.get('#\\/animalp6').should('have.text', animalSentence)
    cy.get('#\\/plantp11').should('have.text', plantSentence)
    cy.get('#\\/plantp12').should('have.text', plantSentence)

    cy.get('#\\/animal_input').clear().type('beetle{enter}');
    cy.get('#\\/plant_input').clear().type('dandelion{enter}');
    let animal2 = "beetle";
    let plant2 = "dandelion";
    let animalSentence2 = "The animal is a " + animal2 + ".";
    let plantSentence2 = "The plant is a " + plant2 + ".";
    cy.get('#\\/animalp').should('have.text', animalSentence2)
    cy.get('#\\/plantp').should('have.text', plantSentence2)
    cy.get('#\\/animalp2').should('have.text', animalSentence2)
    cy.get('#\\/plantp2').should('have.text', plantSentence2)
    cy.get('#\\/plantp3').should('have.text', plantSentence2)
    cy.get('#\\/plantp4').should('have.text', plantSentence2)
    cy.get('#\\/animalp3').should('have.text', animalSentence2)
    cy.get('#\\/plantp5').should('have.text', plantSentence2)
    cy.get('#\\/plantp6').should('have.text', plantSentence2)
    cy.get('#\\/animalp4').should('have.text', animalSentence2)
    cy.get('#\\/plantp7').should('have.text', plantSentence2)
    cy.get('#\\/animalp5').should('have.text', animalSentence2)
    cy.get('#\\/plantp8').should('have.text', plantSentence2)
    cy.get('#\\/plantp9').should('have.text', plantSentence2)
    cy.get('#\\/plantp10').should('have.text', plantSentence2)
    cy.get('#\\/animalp6').should('have.text', animalSentence2)
    cy.get('#\\/plantp11').should('have.text', plantSentence2)
    cy.get('#\\/plantp12').should('have.text', plantSentence2)

  })

  it('group with a map that begins zero length, copied multiple times', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="p1"><aslist><group>
    <map>
    <template><math simplify>$x^2</math></template>
    <sources alias="x">
    <sequence from="$from" to="$to" length="$count" />
    </sources>
    </map>
    </group></aslist></p>

    <mathinput name="from" prefill="1"/>
    <mathinput name="to" prefill="2"/>
    <mathinput name="count" prefill="0"/>
    
    <p name="p2"><aslist><copy name="copygroup2" target="_group1" /></aslist></p>
    <p name="p3"><aslist><copy name="copygroup3" target="copygroup2" /></aslist></p>

    <copy name="copygroupthroughp" target="p1" assignNames="p4" />
    <copy name="copygroupthroughp2" target="copygroupthroughp" assignNames="p5" />
    <copy name="copygroupthroughp3" target="copygroupthroughp2" assignNames="p6" />
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('At beginning, nothing shown')
    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).should('have.text', '')
    }

    cy.log('make sequence length 1');
    cy.get('#\\/count textarea').type('{end}{backspace}1{enter}', { force: true });

    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(1).should('not.exist')
    }


    cy.log('make sequence length 0 again');
    cy.get('#\\/count textarea').type('{end}{backspace}0{enter}', { force: true });
    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).should('have.text', '')
    }


    cy.log('make sequence length 2');
    cy.get('#\\/count textarea').type('{end}{backspace}2{enter}', { force: true });

    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('4');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(2).should('not.exist')
    }


    cy.log('change limits');
    cy.get('#\\/from textarea').type('{end}{backspace}3{enter}', { force: true });
    cy.get('#\\/to textarea').type('{end}{backspace}5{enter}', { force: true });

    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('25');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(2).should('not.exist')
    }


    cy.log('make sequence length 0 once again');
    cy.get('#\\/count textarea').type('{end}{backspace}0{enter}', { force: true });
    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).should('have.text', '')
    }

    cy.log('make sequence length 3');
    cy.get('#\\/count textarea').type('{end}{backspace}3{enter}', { force: true });


    for (let i = 1; i <= 6; i++) {
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('16');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(2).invoke('text').then((text) => {
        expect(text.trim()).equal('25');
      });
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(3).should('not.exist')
    }

  });

  it('group with mutual references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="p1">
    <aslist>
    <group><math simplify><math name="x"><copy prop="value" target="var1" /></math> + <copy target="y" /></math></group>
    <group><math simplify><math name="y"><copy prop="value" target="var2" /></math> + <copy target="x" /></math></group>
    </aslist>
    </p>
    
    <mathinput prefill="x" name="var1"/>
    <mathinput prefill="y" name="var2"/>
    
    <p name="p2"><aslist><copy target="_group1" /><copy target="_group2" /></aslist></p>
    <p name="p3"><copy target="_aslist1" /></p>
    
    <copy name="c4" assignNames="p4" target="p1" />
    <copy name="c5" assignNames="p5" target="p2" />
    <copy name="c6" assignNames="p6" target="p3" />
    
    <copy name="c7" assignNames="p7" target="c4" />
    <copy name="c8" assignNames="p8" target="c5" />
    <copy name="c9" assignNames="p9" target="c6" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    for (let i = 1; i <= 9; i++) {
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })

      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })
    }

    cy.log('change variables');
    cy.get('#\\/var1 textarea').type('{end}{backspace}u{enter}', { force: true });
    cy.get('#\\/var2 textarea').type('{end}{backspace}v{enter}', { force: true });

    for (let i = 1; i <= 9; i++) {
      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u+v')
      })

      cy.get(`#\\/p${i}`).find('.mjx-mrow').eq(1).invoke('text').then((text) => {
        expect(text.trim()).equal('u+v')
      })
    }

  });

  it('fixed propagated when copy group', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <group name="g" newNamespace>
        <point name="A">(1,2)</point>
      </group>
    </graph>

    <graph>
      <copy target="g" fixed assignNames="g2" />
    </graph>

    <graph>
      <copy target="g2" fixed="false" assignNames="g3" />
    </graph>

    <graph>
      <copy target="g2" fixed="false" link="false" assignNames="g4" />
    </graph>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Initial values')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/g'].stateValues.fixed).eq(false);
      expect(components['/g/A'].stateValues.fixed).eq(false);
      expect(components['/g/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components['/g2'].stateValues.fixed).eq(true);
      expect(components['/g2/A'].stateValues.fixed).eq(true);
      expect(components['/g2/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components['/g3'].stateValues.fixed).eq(false);
      expect(components['/g3/A'].stateValues.fixed).eq(false);
      expect(components['/g3/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
      expect(components['/g4'].stateValues.fixed).eq(false);
      expect(components['/g4/A'].stateValues.fixed).eq(false);
      expect(components['/g4/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
    })

    cy.log('move first point')
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/g/A'].movePoint({ x: 3, y: 4 })
      expect(components['/g/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g2/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g3/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g4/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
    })

    cy.log(`can't move second point as fixed`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/g2/A'].movePoint({ x: 5, y: 6 })
      expect(components['/g/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g2/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g3/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g4/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
    })

    cy.log(`can't move third point as depends on fixed second point`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/g3/A'].movePoint({ x: 7, y: 8 })
      expect(components['/g/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g2/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g3/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g4/A'].stateValues.xs.map(x => x.tree)).eqls([1, 2])
    })

    cy.log(`can move fourth point`)
    cy.window().then(async (win) => {
      let components = Object.assign({}, win.state.components);
      await components['/g4/A'].movePoint({ x: 9, y: 0 })
      expect(components['/g/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g2/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g3/A'].stateValues.xs.map(x => x.tree)).eqls([3, 4])
      expect(components['/g4/A'].stateValues.xs.map(x => x.tree)).eqls([9, 0])
    })



  })

  it('disabled propagated when copy group', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
      <group name="g" newNamespace>
        <textinput name="ti" prefill="hello" />
      </group>

      <copy target="g" disabled assignNames="g2" />

      <copy target="g2" disabled="false" assignNames="g3" />

      <copy target="g2" disabled="false" link="false" assignNames="g4" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.log('Initial values')

    cy.get('#\\/g\\/ti_input').should('not.be.disabled')
    cy.get('#\\/g2\\/ti_input').should('be.disabled')
    cy.get('#\\/g3\\/ti_input').should('not.be.disabled')
    cy.get('#\\/g4\\/ti_input').should('not.be.disabled')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/g'].stateValues.disabled).eq(false);
      expect(components['/g/ti'].stateValues.disabled).eq(false);
      expect(components['/g/ti'].stateValues.value).eq("hello")
      expect(components['/g2'].stateValues.disabled).eq(true);
      expect(components['/g2/ti'].stateValues.disabled).eq(true);
      expect(components['/g2/ti'].stateValues.value).eq("hello")
      expect(components['/g3'].stateValues.disabled).eq(false);
      expect(components['/g3/ti'].stateValues.disabled).eq(false);
      expect(components['/g3/ti'].stateValues.value).eq("hello")
      expect(components['/g4'].stateValues.disabled).eq(false);
      expect(components['/g4/ti'].stateValues.disabled).eq(false);
      expect(components['/g4/ti'].stateValues.value).eq("hello")
    })

    cy.log('type in first textinput')
    cy.get('#\\/g\\/ti_input').clear().type("bye{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/g/ti'].stateValues.value).eq("bye")
      expect(components['/g2/ti'].stateValues.value).eq("bye")
      expect(components['/g3/ti'].stateValues.value).eq("bye")
      expect(components['/g4/ti'].stateValues.value).eq("hello")
    })

    cy.log('type in third textinput')
    cy.get('#\\/g3\\/ti_input').clear().type("this{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/g/ti'].stateValues.value).eq("this")
      expect(components['/g2/ti'].stateValues.value).eq("this")
      expect(components['/g3/ti'].stateValues.value).eq("this")
      expect(components['/g4/ti'].stateValues.value).eq("hello")
    })


    cy.log('type in fourth textinput')
    cy.get('#\\/g4\\/ti_input').clear().type("that{enter}")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/g/ti'].stateValues.value).eq("this")
      expect(components['/g2/ti'].stateValues.value).eq("this")
      expect(components['/g3/ti'].stateValues.value).eq("this")
      expect(components['/g4/ti'].stateValues.value).eq("that")
    })


  })

});