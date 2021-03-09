describe('Group Tag Tests',function() {

  beforeEach(() => {
    cy.visit('/test')
  })

  it.only('nested groups, copied', () => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>Animal: <textinput name="animal" prefill="fox"/></p>
    <p>Plant: <textinput name="plant" prefill="tree"/></p>
    
    <group name="g1">
      <p name="animalp">The animal is a <copy prop="value" tname="animal" />.</p>
      <group name="g2">
        <p name="plantp">The plant is a <copy prop="value" tname="plant" />.</p>
        <copy tname="animalp" />
        <group name="g3">
          <copy tname="plantp" />
        </group>
        <copy tname="g3" />
      </group>
      <copy tname="g2" />
    </group>
    <copy tname="g1" />
    `},"*");
    });

    let animal="fox";
    let plant="tree";
    let animalSentence = "The animal is a " + animal + ".";
    let plantSentence = "The plant is a " + plant + ".";
    cy.get('#__p13').should('have.text', animalSentence)
    cy.get('#__p14').should('have.text', plantSentence)
    cy.get('#__p15').should('have.text', animalSentence)
    cy.get('#__p16').should('have.text', plantSentence)
    cy.get('#__p17').should('have.text', plantSentence)
    cy.get('#__p18').should('have.text', plantSentence)
    cy.get('#__p19').should('have.text', animalSentence)
    cy.get('#__p20').should('have.text', plantSentence)
    cy.get('#__p21').should('have.text', plantSentence)
    cy.get('#__p22').should('have.text', animalSentence)
    cy.get('#__p23').should('have.text', plantSentence)
    cy.get('#__p24').should('have.text', animalSentence)
    cy.get('#__p25').should('have.text', plantSentence)
    cy.get('#__p26').should('have.text', plantSentence)
    cy.get('#__p27').should('have.text', plantSentence)
    cy.get('#__p28').should('have.text', animalSentence)
    cy.get('#__p29').should('have.text', plantSentence)
    cy.get('#__p30').should('have.text', plantSentence)

    cy.get('#\\/animal_input').clear().type('beetle{enter}');
    cy.get('#\\/plant_input').clear().type('dandelion{enter}');
    let animal2="beetle";
    let plant2="dandelion";
    let animalSentence2 = "The animal is a " + animal2 + ".";
    let plantSentence2 = "The plant is a " + plant2 + ".";
    cy.get('#__p13').should('have.text', animalSentence2)
    cy.get('#__p14').should('have.text', plantSentence2)
    cy.get('#__p15').should('have.text', animalSentence2)
    cy.get('#__p16').should('have.text', plantSentence2)
    cy.get('#__p17').should('have.text', plantSentence2)
    cy.get('#__p18').should('have.text', plantSentence2)
    cy.get('#__p19').should('have.text', animalSentence2)
    cy.get('#__p20').should('have.text', plantSentence2)
    cy.get('#__p21').should('have.text', plantSentence2)
    cy.get('#__p22').should('have.text', animalSentence2)
    cy.get('#__p23').should('have.text', plantSentence2)
    cy.get('#__p24').should('have.text', animalSentence2)
    cy.get('#__p25').should('have.text', plantSentence2)
    cy.get('#__p26').should('have.text', plantSentence2)
    cy.get('#__p27').should('have.text', plantSentence2)
    cy.get('#__p28').should('have.text', animalSentence2)
    cy.get('#__p29').should('have.text', plantSentence2)
    cy.get('#__p30').should('have.text', plantSentence2)


  })

  it('nested groups, initially unresolved, reffed', () => {
    cy.window().then((win) => { win.postMessage({doenetML: `

    <group name="g1">
      <p name="animalp">The animal <copy tname="animalphrase" />.</p>
      <group name="g2">
        <p name="plantp">The plant <copy tname="plantphrase" />.</p>
        <copy tname="animalp" />
        <group name="g3">
          <copy tname="plantp" />
        </group>
        <copy tname="g3" />
      </group>
      <copy tname="g2" />
    </group>
    <copy tname="g1" />

    <copy name="verb" tname="verb1" />
    <copy name="animalphrase" tname="animalphrase1" />
    <text name="animalphrase1"><copy tname="verb" /> <copy tname="animal1" /></text>
    <text name="animal1"><copy tname="article" /> <copy prop="value" tname="animal" /></text>
    <copy name="verb1" tname="verb2" />
    <text name="verb2">is</text>
    <text name="article"><copy tname="article1" /></text>
    <copy name="article1" tname="article2" />
    <text name="article2">a</text>
    <copy name="plantphrase" tname="plantphrase1" />
    <text name="plantphrase1"><copy tname="verb" /> <copy tname="plant1" /></text>
    <text name="plant1"><copy tname="article" /> <copy prop="value" tname="plant" /></text>

    <p>Animal: <textinput name="animal" prefill="fox"/></p>
    <p>Plant: <textinput name="plant" prefill="tree"/></p>
    
    `},"*");
    });

    let animal="fox";
    let plant="tree";
    let animalSentence = "The animal is a " + animal + ".";
    let plantSentence = "The plant is a " + plant + ".";
    cy.get('#__p13').should('have.text', animalSentence)
    cy.get('#__p14').should('have.text', plantSentence)
    cy.get('#__p15').should('have.text', animalSentence)
    cy.get('#__p16').should('have.text', plantSentence)
    cy.get('#__p17').should('have.text', plantSentence)
    cy.get('#__p18').should('have.text', plantSentence)
    cy.get('#__p19').should('have.text', animalSentence)
    cy.get('#__p20').should('have.text', plantSentence)
    cy.get('#__p21').should('have.text', plantSentence)
    cy.get('#__p22').should('have.text', animalSentence)
    cy.get('#__p23').should('have.text', plantSentence)
    cy.get('#__p24').should('have.text', animalSentence)
    cy.get('#__p25').should('have.text', plantSentence)
    cy.get('#__p26').should('have.text', plantSentence)
    cy.get('#__p27').should('have.text', plantSentence)
    cy.get('#__p28').should('have.text', animalSentence)
    cy.get('#__p29').should('have.text', plantSentence)
    cy.get('#__p30').should('have.text', plantSentence)

    cy.get('#\\/animal_input').clear().type('beetle{enter}');
    cy.get('#\\/plant_input').clear().type('dandelion{enter}');
    let animal2="beetle";
    let plant2="dandelion";
    let animalSentence2 = "The animal is a " + animal2 + ".";
    let plantSentence2 = "The plant is a " + plant2 + ".";
    cy.get('#__p13').should('have.text', animalSentence2)
    cy.get('#__p14').should('have.text', plantSentence2)
    cy.get('#__p15').should('have.text', animalSentence2)
    cy.get('#__p16').should('have.text', plantSentence2)
    cy.get('#__p17').should('have.text', plantSentence2)
    cy.get('#__p18').should('have.text', plantSentence2)
    cy.get('#__p19').should('have.text', animalSentence2)
    cy.get('#__p20').should('have.text', plantSentence2)
    cy.get('#__p21').should('have.text', plantSentence2)
    cy.get('#__p22').should('have.text', animalSentence2)
    cy.get('#__p23').should('have.text', plantSentence2)
    cy.get('#__p24').should('have.text', animalSentence2)
    cy.get('#__p25').should('have.text', plantSentence2)
    cy.get('#__p26').should('have.text', plantSentence2)
    cy.get('#__p27').should('have.text', plantSentence2)
    cy.get('#__p28').should('have.text', animalSentence2)
    cy.get('#__p29').should('have.text', plantSentence2)
    cy.get('#__p30').should('have.text', plantSentence2)


  })

  it('group with a map that begins zero length, reffed multiple times',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p>
    <group>
    Number list:
    <aslist>
    <map>
    <template><math simplify><copy tname="_source" />^2</math></template>
    <sources>
    <sequence>
      <from><copy prop="value" tname="from" /></from>
      <to><copy prop="value" tname="to" /></to>
      <count><copy prop="value" tname="count" /></count>
    </sequence>
    </sources>
    </map>
    </aslist>
    </group>
    </p>

    <mathinput name="from" prefill="1"/>
    <mathinput name="to" prefill="2"/>
    <mathinput name="count" prefill="0"/>
    
    <copy name="refgroup2" tname="_group1" />
    <copy name="refgroup3" tname="refgroup2" />

    <copy name="refgroupthroughp" tname="_p1" />
    <copy name="refgroupthroughp2" tname="refgroupthroughp" />
    <copy name="refgroupthroughp3" tname="refgroupthroughp2" />
    `},"*");
    });
  

    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.log('At beginning, nothing shown')
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p3').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });

    cy.get('#__math5').should('not.exist');
    cy.get('#__math7').should('not.exist');
    
    cy.log('make sequence length 1');
    cy.get('#\\/count_input').type('1{enter}');

    cy.get('#\\/_p1').children('#__math4').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__math5').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__math7').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__p1').children('#__math6').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__p2').children('#__math8').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__p3').children('#__math9').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });

    cy.log('make sequence length 0 again');
    cy.get('#\\/count_input').clear().type('0{enter}');

    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p3').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });

    cy.get('#__math5').should('not.exist');
    cy.get('#__math7').should('not.exist');
    

    cy.log('make sequence length 2');
    cy.get('#\\/count_input').clear().type('2{enter}');

    cy.get('#\\/_p1').children('#__math10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#\\/_p1').children('#__math11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });
    cy.get('#__math12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__math13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });
    cy.get('#__math16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__math17').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });
    cy.get('#__p1').children('#__math14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__p1').children('#__math15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });
    cy.get('#__p2').children('#__math18').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__p2').children('#__math19').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });
    cy.get('#__p3').children('#__math20').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1');
    });
    cy.get('#__p3').children('#__math21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4');
    });

  
    cy.log('change limits');
    cy.get('#\\/from_input').clear().type('3{enter}');
    cy.get('#\\/to_input').clear().type('5{enter}');


    cy.get('#\\/_p1').children('#__math10').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#\\/_p1').children('#__math11').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__math12').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__math13').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__math16').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__math17').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__p1').children('#__math14').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__p1').children('#__math15').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__p2').children('#__math18').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__p2').children('#__math19').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__p3').children('#__math20').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__p3').children('#__math21').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });


    cy.log('make sequence length 0 again');
    cy.get('#\\/count_input').clear().type('0{enter}');

    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p1').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p2').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    cy.get('#__p3').invoke('text').then((text) => {
      expect(text.trim()).equal('Number list:');
    });
    
    cy.get('#__math12').should('not.exist');
    cy.get('#__math13').should('not.exist');
    cy.get('#__math16').should('not.exist');
    cy.get('#__math17').should('not.exist');

    cy.log('make sequence length 3');
    cy.get('#\\/count_input').clear().type('3{enter}');
 
    cy.get('#\\/_p1').children('#__math22').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#\\/_p1').children('#__math23').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16');
    });
    cy.get('#\\/_p1').children('#__math24').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__math25').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__math26').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16');
    });
    cy.get('#__math27').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__math31').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__math32').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16');
    });
    cy.get('#__math33').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__p1').children('#__math28').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__p1').children('#__math29').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16');
    });
    cy.get('#__p1').children('#__math30').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__p2').children('#__math34').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__p2').children('#__math35').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16');
    });
    cy.get('#__p2').children('#__math36').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });
    cy.get('#__p3').children('#__math37').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('9');
    });
    cy.get('#__p3').children('#__math38').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('16');
    });
    cy.get('#__p3').children('#__math39').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('25');
    });

  });

  it('group with mutual references',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <text>a</text>
    <p name="p1">
    <aslist>
    <group><math simplify><math name="x"><copy prop="value" tname="var1" /></math> + <copy tname="y" /></math></group>
    <group><math simplify><math name="y"><copy prop="value" tname="var2" /></math> + <copy tname="x" /></math></group>
    </aslist>
    </p>
    
    <mathinput prefill="x" name="var1"/>
    <mathinput prefill="y" name="var2"/>
    
    <p name="p2"><aslist><copy tname="_group1" /><copy tname="_group2" /></aslist></p>
    <p name="p3"><copy tname="_aslist1" /></p>
    
    <copy name="p4" tname="p1" />
    <copy name="p5" tname="p2" />
    <copy name="p6" tname="p3" />
    
    <copy name="p7" tname="p4" />
    <copy name="p8" tname="p5" />
    <copy name="p9" tname="p6" />
    `},"*");
    });
  
    cy.get('#\\/_text1').should('have.text','a');  // to wait until loaded

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+y')
    })

    for(let i=4; i<20; i++) {
      cy.get(`#__math${i} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+y')
      })
    }
 
    cy.log('change variables');
    cy.get('#\\/var1_input').clear().type('u{enter}');
    cy.get('#\\/var2_input').clear().type('v{enter}');

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('u+v')
    })

    for(let i=4; i<20; i++) {
      cy.get(`#__math${i} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('u+v')
      })
    }
 
  });


});