describe('Substitute Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')

  })

  it('substitute into string sugared to math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute name="s_one" match="x" replacement="b" assignNames="one">
      alpha+x^2
    </substitute>
    <substitute name="s_two" match="x" replacement="b" assignNames="two">
      <substitute match="alpha" replacement="d">
        alpha+x^2
      </substitute>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α+b2')
    })
    cy.get('#\\/two .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "alpha", ["^", "b", 2]])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "alpha", ["^", "b", 2]])
      expect(components['/s_two'].stateValues.value.tree).eqls(['+', 'd', ['^', 'b', 2]])
      expect(components['/two'].stateValues.value.tree).eqls(['+', 'd', ['^', 'b', 2]])
    })
  });

  it('substitute into string sugared to math, explicit type', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute type="math" name="s_one" match="x" replacement="b" assignNames="one">
      alpha+x^2
    </substitute>
    <substitute type="math" name="s_two" match="x" replacement="b" assignNames="two">
      <substitute type="math" match="alpha" replacement="d">
        alpha+x^2
      </substitute>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α+b2')
    })
    cy.get('#\\/two .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "alpha", ["^", "b", 2]])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "alpha", ["^", "b", 2]])
      expect(components['/s_two'].stateValues.value.tree).eqls(['+', 'd', ['^', 'b', 2]])
      expect(components['/two'].stateValues.value.tree).eqls(['+', 'd', ['^', 'b', 2]])
    })
  });

  it('substitute into math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute type="math" name="s_one" match="x" replacement="b" assignNames="one">
      <math>alpha+x^2</math>
    </substitute>
    <substitute type="math" name="s_two" match="x" replacement="b" assignNames="two">
      <substitute type="math" match="alpha" replacement="d">
        <math>alpha+x^2</math>
      </substitute>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α+b2')
    })
    cy.get('#\\/two .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "alpha", ["^", "b", 2]])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "alpha", ["^", "b", 2]])
      expect(components['/s_two'].stateValues.value.tree).eqls(['+', 'd', ['^', 'b', 2]])
      expect(components['/two'].stateValues.value.tree).eqls(['+', 'd', ['^', 'b', 2]])
    })
  });

  it('change simplify', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="simplify" />
    <substitute name="s_one" match="x" replacement="y" assignNames="one" simplify="$simplify">
      x+y
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y+y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "y", "y"])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "y", "y"])
    })

    cy.log("set simplify to full")
    cy.get('#\\/simplify_input').clear().type("full{enter}");

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["*", 2, "y"])
      expect(components['/one'].stateValues.value.tree).eqls(["*", 2, "y"])
    })

    cy.log("set simplify back to none")
    cy.get('#\\/simplify_input').clear().type("none{enter}");


    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y+y')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "y", "y"])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "y", "y"])
    })

  });

  it('substitute with math, global', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute type="math" name="s_one" match="x" replacement="b" assignNames="one">
      <substitute type="math" match="alpha" replacement="d">
        <math>x^2+alpha + x/alpha</math>
      </substitute>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d+bd')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(
        ['+', ['^', 'b', 2], 'd', ['/', 'b', 'd']]
      )
      expect(components['/one'].stateValues.value.tree).eqls(
        ['+', ['^', 'b', 2], 'd', ['/', 'b', 'd']]
      )
    })
  });

  it('change values in math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="original" prefill="y+x^2"/>
    <mathinput name="match" prefill="x"/>
    <mathinput name="replacement" prefill="b"/>

    <substitute name="s_one" match="$match" replacement="$replacement" assignNames="one">
      $original
    </substitute>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "y", ["^", "b", 2]])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "y", ["^", "b", 2]])
    })

    cy.log('change original')
    cy.get('#\\/original textarea').type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}q/x{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qb')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["/", "q", "b"])
      expect(components['/one'].stateValues.value.tree).eqls(["/", "q", "b"])
    })


    cy.log('change match so does not match')
    cy.get('#\\/match textarea').type(`{end}{backspace}{backspace}c{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qx')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["/", "q", "x"])
      expect(components['/one'].stateValues.value.tree).eqls(["/", "q", "x"])
    })

    cy.log('change match so matches again')
    cy.get('#\\/match textarea').type(`{end}{backspace}{backspace}q{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('bx')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["/", "b", "x"])
      expect(components['/one'].stateValues.value.tree).eqls(["/", "b", "x"])
    })


    cy.log('change replacement')
    cy.get('#\\/replacement textarea').type(`{end}{backspace}{backspace}m^2{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m2x')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["/", ["^", "m", 2], "x"])
      expect(components['/one'].stateValues.value.tree).eqls(["/", ["^", "m", 2], "x"])
    })


  });

  // Is the desired behavior?  It is how substitute works in math-expressinons.
  it('substitute does not change numbers in math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute name="s_one" match="1" replacement="2" assignNames="one">
      x+1
    </substitute>
    <substitute name="s_two" match="x" replacement="y" assignNames="two">
      x+1
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    })
    cy.get('#\\/two .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y+1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.tree).eqls(["+", "x", 1])
      expect(components['/one'].stateValues.value.tree).eqls(["+", "x", 1])
      expect(components['/s_two'].stateValues.value.tree).eqls(["+", "y", 1])
      expect(components['/two'].stateValues.value.tree).eqls(["+", "y", 1])
    })
  });
  
  it('substitute into string sugared to text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute name="s_one" type="text" match="Be" replacement="cHe" assignNames="one">
      Big banana BerAtes brown bErry.
    </substitute>
    <substitute name="s_two" type="text" match="Be" replacement="cHe" assignNames="two">
      <substitute type="text" match=" berateS " replacement=" chideS">
        Big banana BerAtes brown bErry.
      </substitute>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana cHerAtes brown cHerry."
    let s2 = "Big banana chideSbrown cHerry."

    cy.get('#\\/one').should('contain.text', s1)
    cy.get('#\\/two').should('contain.text', s2)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value.trim()).eq(s1);
      expect(components['/one'].stateValues.value.trim()).eq(s1);
      expect(components['/s_two'].stateValues.value.trim()).eq(s2);
      expect(components['/two'].stateValues.value.trim()).eq(s2);

    })
  });

  it('substitute into text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute name="s_one" type="text" match="Be" replacement="cHe" assignNames="one">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute name="s_two" type="text" match="Be" replacement="cHe" assignNames="two">
      <substitute type="text" match=" berateS " replacement=" chideS">
        <text>Big banana BerAtes brown bErry.</text>
      </substitute>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana cHerAtes brown cHerry."
    let s2 = "Big banana chideSbrown cHerry."

    cy.get('#\\/one').should('have.text', s1)
    cy.get('#\\/two').should('have.text', s2)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s1);
      expect(components['/one'].stateValues.value).eq(s1);
      expect(components['/s_two'].stateValues.value).eq(s2);
      expect(components['/two'].stateValues.value).eq(s2);

    })
  });

  it('substitute into text, case sensitive', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute caseSensitive name="s_one" type="text" match="Be" replacement="cHe" assignNames="one">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute caseSensitive name="s_two" type="text" match="bE" replacement="cHe" assignNames="two">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana cHerAtes brown bErry."
    let s2 = "Big banana BerAtes brown cHerry."

    cy.get('#\\/one').should('have.text', s1)
    cy.get('#\\/two').should('have.text', s2)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s1);
      expect(components['/one'].stateValues.value).eq(s1);
      expect(components['/s_two'].stateValues.value).eq(s2);
      expect(components['/two'].stateValues.value).eq(s2);

    })

  });

  it('substitute into text, match whole word', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute matchWholeWord name="s_one" type="text" match="Be" replacement="cHe" assignNames="one">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute matchWholeWord name="s_two" type="text" match="berateS" replacement="chideS" assignNames="two">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana BerAtes brown bErry."
    let s2 = "Big banana chideS brown bErry."

    cy.get('#\\/one').should('have.text', s1)
    cy.get('#\\/two').should('have.text', s2)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s1);
      expect(components['/one'].stateValues.value).eq(s1);
      expect(components['/s_two'].stateValues.value).eq(s2);
      expect(components['/two'].stateValues.value).eq(s2);

    })

  });

  it('substitute into text, match whole word with spaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute matchWholeWord name="s_one" type="text" match=" Be" replacement="cHe" assignNames="one">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute matchWholeWord name="s_two" type="text" match=" berateS " replacement="chideS" assignNames="two">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana BerAtes brown bErry."
    let s2 = "Big bananachideSbrown bErry."

    cy.get('#\\/one').should('have.text', s1)
    cy.get('#\\/two').should('have.text', s2)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s1);
      expect(components['/one'].stateValues.value).eq(s1);
      expect(components['/s_two'].stateValues.value).eq(s2);
      expect(components['/two'].stateValues.value).eq(s2);

    })

  });

  it('substitute into text, global', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute name="s_one" type="text" match="b" replacement="c" assignNames="one">
      <text>Big babana BerAtes brown bErry.</text>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "cig cacana cerAtes crown cErry."

    cy.get('#\\/one').should('have.text', s1)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s1);
      expect(components['/one'].stateValues.value).eq(s1);

    })

  })

  it('change pattern and replaces in text', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <textinput name="original" prefill="Big banana BerAtes brown bErry."/>
    <textinput name="match" prefill="Be"/>
    <textinput name="replacement" prefill="cHe"/>

    <substitute type="text" name="s_one" match="$match" replacement="$replacement" assignNames="one">
      <text>$original</text>
    </substitute>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana cHerAtes brown cHerry."

    cy.get('#\\/one').should('have.text', s1)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s1);
      expect(components['/one'].stateValues.value).eq(s1);
    })

    cy.log('change original')
    cy.get('#\\/original_input').clear().type(`The bicycle belongs to me.{enter}`);
    let s2 = "The bicycle cHelongs to me."
    cy.get('#\\/one').should('have.text', s2)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s2);
      expect(components['/one'].stateValues.value).eq(s2);
    })

    cy.log('change match so does not match')
    cy.get('#\\/match_input').clear().type(`bike{enter}`);
    let s3 = "The bicycle belongs to me."
    cy.get('#\\/one').should('have.text', s3)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s3);
      expect(components['/one'].stateValues.value).eq(s3);
    })

    cy.log('change match so matches again')
    cy.get('#\\/match_input').clear().type(`e b{enter}`);
    let s4 = "ThcHeicyclcHeelongs to me."
    cy.get('#\\/one').should('have.text', s4)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s4);
      expect(components['/one'].stateValues.value).eq(s4);
    })

    cy.log('change match and replacement')
    cy.get('#\\/match_input').clear().type(`bicycle{enter}`);
    cy.get('#\\/replacement_input').clear().type(`scooter{enter}`);
    let s5 = "The scooter belongs to me."
    cy.get('#\\/one').should('have.text', s5)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/s_one'].stateValues.value).eq(s5);
      expect(components['/one'].stateValues.value).eq(s5);
    })
  });

})
