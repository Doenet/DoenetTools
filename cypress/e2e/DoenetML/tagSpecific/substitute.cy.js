import me from 'math-expressions';

describe('Substitute Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })

  it('substitute into string sugared to math', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "alpha", ["^", "b", 2]])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "alpha", ["^", "b", 2]])
      expect(stateVariables['/s_two'].stateValues.value).eqls(['+', 'd', ['^', 'b', 2]])
      expect(stateVariables['/two'].stateValues.value).eqls(['+', 'd', ['^', 'b', 2]])
    })
  });

  it('substitute into string sugared to math, explicit type', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "alpha", ["^", "b", 2]])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "alpha", ["^", "b", 2]])
      expect(stateVariables['/s_two'].stateValues.value).eqls(['+', 'd', ['^', 'b', 2]])
      expect(stateVariables['/two'].stateValues.value).eqls(['+', 'd', ['^', 'b', 2]])
    })
  });

  it('substitute into math', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "alpha", ["^", "b", 2]])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "alpha", ["^", "b", 2]])
      expect(stateVariables['/s_two'].stateValues.value).eqls(['+', 'd', ['^', 'b', 2]])
      expect(stateVariables['/two'].stateValues.value).eqls(['+', 'd', ['^', 'b', 2]])
    })
  });

  it('change simplify', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "y", "y"])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "y", "y"])
    })

    cy.log("set simplify to full")
    cy.get('#\\/simplify_input').clear().type("full{enter}");

    cy.get('#\\/one .mjx-mrow').should("contain.text", '2y')
    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2y')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["*", 2, "y"])
      expect(stateVariables['/one'].stateValues.value).eqls(["*", 2, "y"])
    })

    cy.log("set simplify back to none")
    cy.get('#\\/simplify_input').clear().type("none{enter}");


    cy.get('#\\/one .mjx-mrow').should("contain.text", 'y+y')
    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('y+y')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "y", "y"])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "y", "y"])
    })

  });

  it('substitute with math, global', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(
        ['+', ['^', 'b', 2], 'd', ['/', 'b', 'd']]
      )
      expect(stateVariables['/one'].stateValues.value).eqls(
        ['+', ['^', 'b', 2], 'd', ['/', 'b', 'd']]
      )
    })
  });

  it('change values in math', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "y", ["^", "b", 2]])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "y", ["^", "b", 2]])
    })

    cy.log('change original')
    cy.get('#\\/original textarea').type(`{ctrl+home}{shift+end}{backspace}q/x{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').should('contain.text', 'qb')
    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qb')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["/", "q", "b"])
      expect(stateVariables['/one'].stateValues.value).eqls(["/", "q", "b"])
    })


    cy.log('change match so does not match')
    cy.get('#\\/match textarea').type(`{end}{backspace}{backspace}c{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').should('contain.text', 'qx')
    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('qx')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["/", "q", "x"])
      expect(stateVariables['/one'].stateValues.value).eqls(["/", "q", "x"])
    })

    cy.log('change match so matches again')
    cy.get('#\\/match textarea').type(`{end}{backspace}{backspace}q{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').should('contain.text', 'bx')
    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('bx')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["/", "b", "x"])
      expect(stateVariables['/one'].stateValues.value).eqls(["/", "b", "x"])
    })


    cy.log('change replacement')
    cy.get('#\\/replacement textarea').type(`{end}{backspace}{backspace}m^2{enter}`, { force: true });

    cy.get('#\\/one .mjx-mrow').should('contain.text', 'm2x')
    cy.get('#\\/one .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('m2x')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["/", ["^", "m", 2], "x"])
      expect(stateVariables['/one'].stateValues.value).eqls(["/", ["^", "m", 2], "x"])
    })


  });

  // Is the desired behavior?  It is how substitute works in math-expressinons.
  it('substitute does not change numbers in math', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eqls(["+", "x", 1])
      expect(stateVariables['/one'].stateValues.value).eqls(["+", "x", 1])
      expect(stateVariables['/s_two'].stateValues.value).eqls(["+", "y", 1])
      expect(stateVariables['/two'].stateValues.value).eqls(["+", "y", 1])
    })
  });

  it('substitute into string sugared to text', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value.trim()).eq(s1);
      expect(stateVariables['/one'].stateValues.value.trim()).eq(s1);
      expect(stateVariables['/s_two'].stateValues.value.trim()).eq(s2);
      expect(stateVariables['/two'].stateValues.value.trim()).eq(s2);

    })
  });

  it('substitute into text', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);
      expect(stateVariables['/s_two'].stateValues.value).eq(s2);
      expect(stateVariables['/two'].stateValues.value).eq(s2);

    })
  });

  it('substitute into text, match case', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute matchCase name="s_one" type="text" match="Be" replacement="cHe" assignNames="one">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    <substitute matchCase name="s_two" type="text" match="bE" replacement="cHe" assignNames="two">
      <text>Big banana BerAtes brown bErry.</text>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "Big banana cHerAtes brown bErry."
    let s2 = "Big banana BerAtes brown cHerry."

    cy.get('#\\/one').should('have.text', s1)
    cy.get('#\\/two').should('have.text', s2)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);
      expect(stateVariables['/s_two'].stateValues.value).eq(s2);
      expect(stateVariables['/two'].stateValues.value).eq(s2);

    })

  });

  it('substitute into text, preserve case', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute preserveCase name="s_one" type="text" match="word" replacement="new" assignNames="one">
      <text>A word WORD Word wOrD WoRd.</text>
    </substitute>
    <substitute preserveCase name="s_two" type="text" match="word" replacement="NEW" assignNames="two">
      <text>A word WORD Word wOrD WoRd.</text>
    </substitute>
    <substitute preserveCase name="s_three" type="text" match="word" replacement="NeW" assignNames="three">
      <text>A word WORD Word wOrD WoRd.</text>
    </substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let s1 = "A new NEW New new New."
    let s2 = "A new NEW NEW nEW NEW."
    let s3 = "A new NEW NeW neW NeW."

    cy.get('#\\/one').should('have.text', s1)
    cy.get('#\\/two').should('have.text', s2)
    cy.get('#\\/three').should('have.text', s3)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);
      expect(stateVariables['/s_two'].stateValues.value).eq(s2);
      expect(stateVariables['/two'].stateValues.value).eq(s2);
      expect(stateVariables['/s_three'].stateValues.value).eq(s3);
      expect(stateVariables['/three'].stateValues.value).eq(s3);

    })

  });

  it('substitute into text, match whole word', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);
      expect(stateVariables['/s_two'].stateValues.value).eq(s2);
      expect(stateVariables['/two'].stateValues.value).eq(s2);

    })

  });

  it('substitute into text, match whole word with spaces', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);
      expect(stateVariables['/s_two'].stateValues.value).eq(s2);
      expect(stateVariables['/two'].stateValues.value).eq(s2);

    })

  });

  it('substitute into text, global', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);

    })

  })

  it('change pattern and replaces in text', () => {
    cy.window().then(async (win) => {
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s1);
      expect(stateVariables['/one'].stateValues.value).eq(s1);
    })

    cy.log('change original')
    cy.get('#\\/original_input').clear().type(`The bicycle belongs to me.{enter}`);
    let s2 = "The bicycle cHelongs to me."
    cy.get('#\\/one').should('have.text', s2)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s2);
      expect(stateVariables['/one'].stateValues.value).eq(s2);
    })

    cy.log('change match so does not match')
    cy.get('#\\/match_input').clear().type(`bike{enter}`);
    let s3 = "The bicycle belongs to me."
    cy.get('#\\/one').should('have.text', s3)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s3);
      expect(stateVariables['/one'].stateValues.value).eq(s3);
    })

    cy.log('change match so matches again')
    cy.get('#\\/match_input').clear().type(`e b{enter}`);
    let s4 = "ThcHeicyclcHeelongs to me."
    cy.get('#\\/one').should('have.text', s4)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s4);
      expect(stateVariables['/one'].stateValues.value).eq(s4);
    })

    cy.log('change match and replacement')
    cy.get('#\\/match_input').clear().type(`bicycle{enter}`);
    cy.get('#\\/replacement_input').clear().type(`scooter{enter}`);
    let s5 = "The scooter belongs to me."
    cy.get('#\\/one').should('have.text', s5)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/s_one'].stateValues.value).eq(s5);
      expect(stateVariables['/one'].stateValues.value).eq(s5);
    })
  });

  it('modify in inverse direction, math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original: <mathinput name="orig" prefill="x^2+2x+3y" /></p>
    <p>Original 2:<math name="orig2">$orig</math></p>

    <p>Match: <mathinput name="match" prefill="x"/></p>
    <p>Replacement: <mathinput name="replacement" prefill="b"/></p>

    <p>Substituted: <substitute match="$match" replacement="$replacement" assignNames="subbed" name="s">$orig2</substitute></p>

    <p>Substituted 2: <mathinput name="subbed2" bindValueTo="$subbed" /></p>


    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2+2x+3y')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+2x+3y')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+2b+3y')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b2+2b+3y')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^2+2x+3y").tree;
      let subbedExpr = me.fromText("b^2+2b+3y").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })

    cy.log('change original')
    cy.get('#\\/orig textarea').type(`{end}{backspace}x{enter}`, { force: true });

    cy.get('#\\/orig2 .mjx-mrow').should('contain.text', 'x2+2x+3x')
    cy.get(`#\\/subbed2 .mq-editable-field`).should('contain.text', 'b2+2b+3b')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2+2x+3x')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+2x+3x')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+2b+3b')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b2+2b+3b')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^2+2x+3x").tree;
      let subbedExpr = me.fromText("b^2+2b+3b").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('change subbed')
    cy.get('#\\/subbed2 textarea').type(`{end}{backspace}v/b{enter}`, { force: true });

    cy.get('#\\/orig2 .mjx-mrow').should('contain.text', 'x2+2x+3vx')
    cy.get(`#\\/subbed2 .mq-editable-field`).should('contain.text', 'b2+2b+3vb')
    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2+2x+3vx')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+2x+3vx')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+2b+3vb')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('b2+2b+3vb')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^2+2x+3v/x").tree;
      let subbedExpr = me.fromText("b^2+2b+3v/b").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('change replacement so that it is in original')
    cy.get('#\\/replacement textarea').type(`{end}{backspace}v{enter}`, { force: true });

    cy.get('#\\/subbed .mjx-mrow').should('contain.text', 'v2+2v+3vv')
    cy.get(`#\\/subbed2 .mq-editable-field`).should('contain.text', 'v2+2v+3vv')
    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2+2x+3vx')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+2x+3vx')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v2+2v+3vv')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v2+2v+3vv')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^2+2x+3v/x").tree;
      let subbedExpr = me.fromText("v^2+2v+3v/v").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('Cannot modify subbed')
    cy.get('#\\/subbed2 textarea').type(`{end}{backspace}+1{enter}`, { force: true });

    cy.get(`#\\/subbed2 .mq-editable-field`).should('not.contain.text', 'v2+2v+3vv+1')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2+2x+3vx')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+2x+3vx')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v2+2v+3vv')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v2+2v+3vv')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^2+2x+3v/x").tree;
      let subbedExpr = me.fromText("v^2+2v+3v/v").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('change original to not contain replacement')
    cy.get('#\\/orig textarea').type(`{end}{leftArrow}{leftArrow}{leftArrow}{backspace}u{enter}`, { force: true });
    cy.get('#\\/orig2 .mjx-mrow').should('contain.text', 'x2+2x+3ux')
    cy.get(`#\\/subbed2 .mq-editable-field`).should('contain.text', 'v2+2v+3uv')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x2+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v2+2v+3uv')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v2+2v+3uv')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^2+2x+3u/x").tree;
      let subbedExpr = me.fromText("v^2+2v+3u/v").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })

    cy.log('Can modify subbed again')
    cy.get('#\\/subbed2 textarea').type(`{home}{rightArrow}{rightArrow}{rightArrow}{backspace}5{enter}`, { force: true });

    cy.get('#\\/orig2 .mjx-mrow').should('contain.text', 'x5+2x+3ux')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x5+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x5+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v5+2v+3uv')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v5+2v+3uv')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^5+2x+3u/x").tree;
      let subbedExpr = me.fromText("v^5+2v+3u/v").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('change replacement to be more than a variable')
    cy.get('#\\/replacement textarea').type(`{end}+1{enter}`, { force: true });

    cy.get('#\\/subbed .mjx-mrow').should('contain.text', '(v+1)5+2(v+1)+3uv+1')
    cy.get(`#\\/subbed2 .mq-editable-field`).should('contain.text', '(v+1)5+2(v+1)+3uv+1')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x5+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x5+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(v+1)5+2(v+1)+3uv+1')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('(v+1)5+2(v+1)+3uv+1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^5+2x+3u/x").tree;
      let subbedExpr = me.fromText("(v+1)^5+2(v+1)+3u/(v+1)").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('Cannot modify subbed')
    cy.get('#\\/subbed2 textarea').type(`{home}+7{enter}`, { force: true });

    cy.get(`#\\/subbed2 .mq-editable-field`).should('not.contain.text', '+7')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x5+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x5+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(v+1)5+2(v+1)+3uv+1')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('(v+1)5+2(v+1)+3uv+1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^5+2x+3u/x").tree;
      let subbedExpr = me.fromText("(v+1)^5+2(v+1)+3u/(v+1)").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })

    cy.log('change replacement to involve a subscript')
    cy.get('#\\/replacement textarea').type(`{end}{backspace}{backspace}_3{enter}`, { force: true });

    cy.waitUntil(() => cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) =>
      text.replace(/[\s\u200B-\u200D\uFEFF]/g, '') === 'v53+2v3+3uv3'
    ))

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('x5+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x5+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v53+2v3+3uv3')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v53+2v3+3uv3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("x^5+2x+3u/x").tree;
      let subbedExpr = me.fromText("v_3^5+2v_3+3u/v_3").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('Can modify subbed once more')
    cy.get('#\\/subbed2 textarea').type(`{home}{rightArrow}{rightArrow}{rightArrow}{backspace}9{enter}`, { force: true });

    cy.get('#\\/subbed .mjx-mrow').should('contain.text', 'v59+2v3+3uv3')
    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v59+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v59+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v59+2v3+3uv3')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v59+2v3+3uv3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("v_9^5+2x+3u/x").tree;
      let subbedExpr = me.fromText("v_9^5+2v_3+3u/v_3").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('change match to involve a subscript')
    cy.get('#\\/match textarea').type(`{end}{backspace}v_9{enter}`, { force: true });

    cy.get('#\\/subbed .mjx-mrow').should('contain.text', 'v53+2x+3ux')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v59+2x+3ux')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v59+2x+3ux')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v53+2x+3ux')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v53+2x+3ux')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("v_9^5+2x+3u/x").tree;
      let subbedExpr = me.fromText("v_3^5+2x+3u/x").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('Can still modify subbed')
    cy.get('#\\/subbed2 textarea').type(`{end}{leftArrow}{backspace}v_3{enter}`, { force: true });

    cy.get('#\\/subbed .mjx-mrow').should('contain.text', 'v53+2x+3uv3')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v59+2x+3uv9')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v59+2x+3uv9')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v53+2x+3uv3')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v53+2x+3uv3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("v_9^5+2x+3u/v_9").tree;
      let subbedExpr = me.fromText("v_3^5+2x+3u/v_3").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })


    cy.log('Cannot modify subbed to include match')
    cy.get('#\\/subbed2 textarea').type(`{end}+v_9{enter}`, { force: true });

    cy.get(`#\\/subbed2 .mq-editable-field`).should('not.contain.text', '+v9')

    cy.get(`#\\/orig .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v59+2x+3uv9')
    })
    cy.get('#\\/orig2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v59+2x+3uv9')
    })

    cy.get('#\\/subbed .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('v53+2x+3uv3')
    })
    cy.get(`#\\/subbed2 .mq-editable-field`).invoke('text').then((text) => {
      expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, '')).equal('v53+2x+3uv3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let origExpr = me.fromText("v_9^5+2x+3u/v_9").tree;
      let subbedExpr = me.fromText("v_3^5+2x+3u/v_3").tree;
      expect(stateVariables['/orig'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/orig2'].stateValues.value).eqls(origExpr)
      expect(stateVariables['/subbed'].stateValues.value).eqls(subbedExpr)
      expect(stateVariables['/subbed2'].stateValues.value).eqls(subbedExpr)
    })



  });

  it('modify in inverse direction, text', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Original: <textinput name="orig" prefill="hello there" size="20" /></p>
    <p>Original 2:<text name="orig2">$orig</text></p>

    <p>Match: <textinput name="match" prefill="hello"/></p>
    <p>Match whole word: <booleaninput name="wholeWord"/></p>
    <p>Match case: <booleaninput name="matchCase"/></p>
    <p>Replacement: <textinput name="replacement" prefill="bye"/></p>
    <p>Preserve case: <booleaninput name="preserveCase"/></p>

    <p>Substituted: <substitute type="text" match="$match" replacement="$replacement" matchWholeWord="$wholeWord" matchCase="$matchCase" preserveCase="$preserveCase" assignNames="subbed" name="s">$orig2</substitute></p>

    <p>Substituted 2: <textinput name="subbed2" bindValueTo="$subbed" size="20" /></p>

    <p><copy prop="value" target="matchCase" assignNames="matchCase2" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/orig_input').should('have.value', 'hello there');
    cy.get('#\\/orig2').should('have.text', 'hello there');
    cy.get('#\\/subbed').should('have.text', 'bye there');
    cy.get('#\\/subbed2_input').should('have.value', 'bye there');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello there")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello there")
      expect(stateVariables['/subbed'].stateValues.value).eq("bye there")
      expect(stateVariables['/subbed2'].stateValues.value).eq("bye there")
    })

    cy.log('change original')
    cy.get('#\\/orig_input').type(`{end}Hello{enter}`);

    cy.get('#\\/orig2').should('have.text', 'hello thereHello');
    cy.get('#\\/orig_input').should('have.value', 'hello thereHello');
    cy.get('#\\/subbed').should('have.text', 'bye therebye');
    cy.get('#\\/subbed2_input').should('have.value', 'bye therebye');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thereHello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thereHello")
      expect(stateVariables['/subbed'].stateValues.value).eq("bye therebye")
      expect(stateVariables['/subbed2'].stateValues.value).eq("bye therebye")
    })


    cy.log('change subbed')
    cy.get('#\\/subbed2_input').type(`{end}Bye{enter}`);

    cy.get('#\\/orig_input').should('have.value', 'hello therehellohello');
    cy.get('#\\/orig2').should('have.text', 'hello therehellohello');
    cy.get('#\\/subbed').should('have.text', 'bye therebyebye');
    cy.get('#\\/subbed2_input').should('have.value', 'bye therebyebye');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello therehellohello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello therehellohello")
      expect(stateVariables['/subbed'].stateValues.value).eq("bye therebyebye")
      expect(stateVariables['/subbed2'].stateValues.value).eq("bye therebyebye")
    })

    cy.log('change replacement so that it is in original')
    cy.get('#\\/replacement_input').clear().type(`There{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'There thereThereThere');
    cy.get('#\\/orig_input').should('have.value', 'hello therehellohello');
    cy.get('#\\/orig2').should('have.text', 'hello therehellohello');
    cy.get('#\\/subbed').should('have.text', 'There thereThereThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello therehellohello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello therehellohello")
      expect(stateVariables['/subbed'].stateValues.value).eq("There thereThereThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("There thereThereThere")
    })


    cy.log('Cannot modify subbed')
    cy.get('#\\/subbed2_input').type(`{end} extra{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'There thereThereThere');
    cy.get('#\\/orig_input').should('have.value', 'hello therehellohello');
    cy.get('#\\/orig2').should('have.text', 'hello therehellohello');
    cy.get('#\\/subbed').should('have.text', 'There thereThereThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello therehellohello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello therehellohello")
      expect(stateVariables['/subbed'].stateValues.value).eq("There thereThereThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("There thereThereThere")
    })

    cy.log('change original to not contain replacement')
    cy.get('#\\/orig_input').type("{end}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{backspace}{backspace}n{enter}")

    cy.get('#\\/orig2').should('have.text', 'hello thenhellohello');
    cy.get('#\\/orig_input').should('have.value', 'hello thenhellohello');
    cy.get('#\\/subbed').should('have.text', 'There thenThereThere');
    cy.get('#\\/subbed2_input').should('have.value', 'There thenThereThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhellohello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhellohello")
      expect(stateVariables['/subbed'].stateValues.value).eq("There thenThereThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("There thenThereThere")
    })

    cy.log('Can modify subbed again')
    cy.get('#\\/subbed2_input').type(`{end}{backspace}{backspace}{enter}`);

    cy.get('#\\/orig_input').should('have.value', 'hello thenhelloThe');
    cy.get('#\\/orig2').should('have.text', 'hello thenhelloThe');
    cy.get('#\\/subbed').should('have.text', 'There thenThereThe');
    cy.get('#\\/subbed2_input').should('have.value', 'There thenThereThe');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/subbed'].stateValues.value).eq("There thenThereThe")
      expect(stateVariables['/subbed2'].stateValues.value).eq("There thenThereThe")
    })

    cy.log('Cannot modify subbed to include match')
    cy.get('#\\/subbed2_input').type(`{end}HELLO{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'There thenThereThe');
    cy.get('#\\/orig_input').should('have.value', 'hello thenhelloThe');
    cy.get('#\\/orig2').should('have.text', 'hello thenhelloThe');
    cy.get('#\\/subbed').should('have.text', 'There thenThereThe');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/subbed'].stateValues.value).eq("There thenThereThe")
      expect(stateVariables['/subbed2'].stateValues.value).eq("There thenThereThe")
    })

    cy.log('match whole word')
    cy.get('#\\/wholeWord_input').click();

    cy.get('#\\/subbed2_input').should('have.value', 'There thenhelloThe');
    cy.get('#\\/orig_input').should('have.value', 'hello thenhelloThe');
    cy.get('#\\/orig2').should('have.text', 'hello thenhelloThe');
    cy.get('#\\/subbed').should('have.text', 'There thenhelloThe');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/subbed'].stateValues.value).eq("There thenhelloThe")
      expect(stateVariables['/subbed2'].stateValues.value).eq("There thenhelloThe")
    })


    cy.log("change replacement so matches original, but not as a whole word")
    cy.get('#\\/replacement_input').clear().type(`Then{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Then thenhelloThe');
    cy.get('#\\/orig_input').should('have.value', 'hello thenhelloThe');
    cy.get('#\\/orig2').should('have.text', 'hello thenhelloThe');
    cy.get('#\\/subbed').should('have.text', 'Then thenhelloThe');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhelloThe")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then thenhelloThe")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then thenhelloThe")
    })

    cy.log('Can still modify subbed')
    cy.get('#\\/subbed2_input').type(`{end}re{enter}`);

    cy.get('#\\/orig_input').should('have.value', 'hello thenhelloThere');
    cy.get('#\\/orig2').should('have.text', 'hello thenhelloThere');
    cy.get('#\\/subbed').should('have.text', 'Then thenhelloThere');
    cy.get('#\\/subbed2_input').should('have.value', 'Then thenhelloThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhelloThere")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhelloThere")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then thenhelloThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then thenhelloThere")
    })


    cy.log('Cannnot modify subbed by adding spaces to separate match')
    cy.get('#\\/subbed2_input').type(`{end}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow} {leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow} {enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Then thenhelloThere');
    cy.get('#\\/orig_input').should('have.value', 'hello thenhelloThere');
    cy.get('#\\/orig2').should('have.text', 'hello thenhelloThere');
    cy.get('#\\/subbed').should('have.text', 'Then thenhelloThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello thenhelloThere")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello thenhelloThere")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then thenhelloThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then thenhelloThere")
    })


    cy.log("change original so that replacement matches original as a whole word")
    cy.get('#\\/orig_input').type('{end}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow}{leftArrow} {enter}')

    cy.get('#\\/orig2').should('have.text', 'hello then helloThere');
    cy.get('#\\/orig_input').should('have.value', 'hello then helloThere');
    cy.get('#\\/subbed').should('have.text', 'Then then helloThere');
    cy.get('#\\/subbed2_input').should('have.value', 'Then then helloThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello then helloThere")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello then helloThere")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then then helloThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then then helloThere")
    })

    cy.log('Cannot modify subbed due to replacement match')
    cy.get('#\\/subbed2_input').type(`{end}nothing{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Then then helloThere');
    cy.get('#\\/orig_input').should('have.value', 'hello then helloThere');
    cy.get('#\\/orig2').should('have.text', 'hello then helloThere');
    cy.get('#\\/subbed').should('have.text', 'Then then helloThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello then helloThere")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello then helloThere")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then then helloThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then then helloThere")
    })


    cy.log('match case')
    cy.get('#\\/matchCase_input').click();

    cy.get("#\\/matchCase2").should('have.text', 'true');

    cy.get('#\\/orig_input').should('have.value', 'hello then helloThere');
    cy.get('#\\/orig2').should('have.text', 'hello then helloThere');
    cy.get('#\\/subbed').should('have.text', 'Then then helloThere');
    cy.get('#\\/subbed2_input').should('have.value', 'Then then helloThere');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello then helloThere")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello then helloThere")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then then helloThere")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then then helloThere")
    })


    cy.log('Now cannot modify subbed due to replacement not matching original case')
    cy.get('#\\/subbed2_input').type(`{end} Hello{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Then then helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'hello then helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'hello then helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'Then then helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello then helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello then helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then then helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then then helloThere Hello")
    })

    cy.log('Cannot add match to subbed')
    cy.get('#\\/subbed2_input').type(`{end} hello{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Then then helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'hello then helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'hello then helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'Then then helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("hello then helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("hello then helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then then helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then then helloThere Hello")
    })


    cy.log('Change subbed to switch cases')
    cy.get('#\\/subbed2_input').type(`{home}{rightArrow}{backspace}t{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{backspace}T{enter}`);

    cy.get('#\\/orig_input').should('have.value', 'then hello helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'then hello helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'then Then helloThere Hello');
    cy.get('#\\/subbed2_input').should('have.value', 'then Then helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("then Then helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("then Then helloThere Hello")
    })

    cy.log('preserve case')
    cy.get('#\\/preserveCase_input').click();

    cy.get('#\\/subbed2_input').should('have.value', 'then then helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'then hello helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'then hello helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'then then helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("then then helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("then then helloThere Hello")
    })


    cy.log('Cannot change subbed since original contains effective replacement')
    cy.get('#\\/subbed2_input').type(`{end} more{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'then then helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'then hello helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'then hello helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'then then helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("then then helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("then then helloThere Hello")
    })

    cy.log('change case of match so that effective replacement is not in original')
    cy.get('#\\/match_input').type(`{home}{rightArrow}{backspace}H{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'then hello helloThere Then');
    cy.get('#\\/orig_input').should('have.value', 'then hello helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'then hello helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'then hello helloThere Then');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("then hello helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("then hello helloThere Then")
      expect(stateVariables['/subbed2'].stateValues.value).eq("then hello helloThere Then")
    })


    cy.log('Can now change subbed')
    cy.get('#\\/subbed2_input').type(`{home}{rightArrow}{backspace}T{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{backspace}{backspace}{backspace}{backspace}{backspace}HELLO THEN{enter}`);

    cy.get('#\\/orig_input').should('have.value', 'Hello HELLO THEN helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'Hello HELLO THEN helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'Then HELLO THEN helloThere Then');
    cy.get('#\\/subbed2_input').should('have.value', 'Then HELLO THEN helloThere Then');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("Hello HELLO THEN helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("Hello HELLO THEN helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("Then HELLO THEN helloThere Then")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Then HELLO THEN helloThere Then")
    })


    cy.log('change case of match so that effective replacement is again in original')
    cy.get('#\\/match_input').type(`{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{backspace}{backspace}{backspace}{backspace}ELLO{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Hello THEN THEN helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'Hello HELLO THEN helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'Hello HELLO THEN helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'Hello THEN THEN helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("Hello HELLO THEN helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("Hello HELLO THEN helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("Hello THEN THEN helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Hello THEN THEN helloThere Hello")
    })

    cy.log('Cannot change subbed')
    cy.get('#\\/subbed2_input').type(`{end} ineffective{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Hello THEN THEN helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'Hello HELLO THEN helloThere Hello');
    cy.get('#\\/orig2').should('have.text', 'Hello HELLO THEN helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'Hello THEN THEN helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("Hello HELLO THEN helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("Hello HELLO THEN helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("Hello THEN THEN helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Hello THEN THEN helloThere Hello")
    })


    cy.log('change original so no longer has effective replacement')
    cy.get('#\\/orig_input').type(`{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{backspace}{backspace}{backspace}hen{enter}`);

    cy.get('#\\/orig2').should('have.text', 'Hello HELLO Then helloThere Hello');
    cy.get('#\\/orig_input').should('have.value', 'Hello HELLO Then helloThere Hello');
    cy.get('#\\/subbed').should('have.text', 'Hello THEN Then helloThere Hello');
    cy.get('#\\/subbed2_input').should('have.value', 'Hello THEN Then helloThere Hello');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("Hello HELLO Then helloThere Hello")
      expect(stateVariables['/orig2'].stateValues.value).eq("Hello HELLO Then helloThere Hello")
      expect(stateVariables['/subbed'].stateValues.value).eq("Hello THEN Then helloThere Hello")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Hello THEN Then helloThere Hello")
    })

    cy.log('Can change subbed once more')
    cy.get('#\\/subbed2_input').type(`{end}{backspace}{backspace}{backspace}{backspace}{backspace}THEN{enter}`);

    cy.get('#\\/orig_input').should('have.value', 'Hello HELLO Then helloThere HELLO');
    cy.get('#\\/orig2').should('have.text', 'Hello HELLO Then helloThere HELLO');
    cy.get('#\\/subbed').should('have.text', 'Hello THEN Then helloThere THEN');
    cy.get('#\\/subbed2_input').should('have.value', 'Hello THEN Then helloThere THEN');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("Hello HELLO Then helloThere HELLO")
      expect(stateVariables['/orig2'].stateValues.value).eq("Hello HELLO Then helloThere HELLO")
      expect(stateVariables['/subbed'].stateValues.value).eq("Hello THEN Then helloThere THEN")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Hello THEN Then helloThere THEN")
    })

    cy.log('Cannot add match to subbed')
    cy.get('#\\/subbed2_input').type(`{end} HELLO{enter}`);

    cy.get('#\\/subbed2_input').should('have.value', 'Hello THEN Then helloThere THEN');
    cy.get('#\\/orig_input').should('have.value', 'Hello HELLO Then helloThere HELLO');
    cy.get('#\\/orig2').should('have.text', 'Hello HELLO Then helloThere HELLO');
    cy.get('#\\/subbed').should('have.text', 'Hello THEN Then helloThere THEN');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/orig'].stateValues.value).eq("Hello HELLO Then helloThere HELLO")
      expect(stateVariables['/orig2'].stateValues.value).eq("Hello HELLO Then helloThere HELLO")
      expect(stateVariables['/subbed'].stateValues.value).eq("Hello THEN Then helloThere THEN")
      expect(stateVariables['/subbed2'].stateValues.value).eq("Hello THEN Then helloThere THEN")
    })


  });

  it('substitute with incomplete attributes does nothing', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <substitute assignNames="m1">x+1</substitute>
    <substitute assignNames="m2" match="x">x+1</substitute>
    <substitute assignNames="m3" replacement="y">x+1</substitute>
    <substitute type="text" assignNames="t1">hello</substitute>
    <substitute type="text" assignNames="t2" match="hello">hello</substitute>
    <substitute type="text" assignNames="t3" replacement="bye">hello</substitute>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/m1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    })
    cy.get('#\\/m2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    })
    cy.get('#\\/m3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x+1')
    })

    cy.get('#\\/t1').should('have.text', 'hello')
    cy.get('#\\/t2').should('have.text', 'hello')
    cy.get('#\\/t3').should('have.text', 'hello')

  });

  it('rounding with math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <math name="orig">ax+847.29418392+5y</math>
    <math name="origDig3" displayDigits="3">ax+847.29418392+5y</math>
    <math name="origDec3" displayDecimals="3">ax+847.29418392+5y</math>
    <math name="origPad" padZeros>ax+847.29418392+5y</math>

    <p><substitute match="a" replacement="0.07394918" assignNames="e1">
      $orig
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e1Dig4" displayDigits="4">
      $orig
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e1Dec4" displayDecimals="4">
      $orig
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e1Pad" padZeros>
      $orig
    </substitute></p>
    <p>
      <math copySource="e1Dec4" name="e1Dig4a" displayDigits="4" />
      <math copySource="e1Dig4" name="e1Dec4a" displayDecimals="4" />
    </p>


    <p><substitute match="a" replacement="0.07394918" assignNames="e2">
      $origDig3
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e2Dig4" displayDigits="4">
      $origDig3
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e2Dec4" displayDecimals="4">
      $origDig3
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e2Pad" padZeros>
      $origDig3
    </substitute></p>
    <p>
      <math copySource="e2Dec4" name="e2Dig4a" displayDigits="4" />
      <math copySource="e2Dig4" name="e2Dec4a" displayDecimals="4" />
    </p>

    <p><substitute match="a" replacement="0.07394918" assignNames="e3">
      $origDec3
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e3Dig4" displayDigits="4">
      $origDec3
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e3Dec4" displayDecimals="4">
      $origDec3
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e3Pad" padZeros>
      $origDec3
    </substitute></p>
    <p>
      <math copySource="e3Dec4" name="e3Dig4a" displayDigits="4" />
      <math copySource="e3Dig4" name="e3Dec4a" displayDecimals="4" />
    </p>

    <p><substitute match="a" replacement="0.07394918" assignNames="e4">
      $origPad
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e4Dig4" displayDigits="4">
      $origPad
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e4Dec4" displayDecimals="4">
      $origPad
    </substitute>
    <substitute match="a" replacement="0.07394918" assignNames="e4NoPad" padZeros="false">
      $origPad
    </substitute></p>
    <p>
      <math copySource="e4Dec4" name="e4Dig4a" displayDigits="4" />
      <math copySource="e4Dig4" name="e4Dec4a" displayDecimals="4" />
    </p>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/e1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07394918x+847.2941839+5y')
    })
    cy.get('#\\/e1Dig4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5y')
    })
    cy.get('#\\/e1Dec4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5y')
    })
    cy.get('#\\/e1Pad .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07394918000x+847.2941839+5.000000000y')
    })
    cy.get('#\\/e1Dig4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5y')
    })
    cy.get('#\\/e1Dec4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5y')
    })


    cy.get('#\\/e2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847+5y')
    })
    cy.get('#\\/e2Dig4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5y')
    })
    cy.get('#\\/e2Dec4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5y')
    })
    cy.get('#\\/e2Pad .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847+5.00y')
    })
    cy.get('#\\/e2Dig4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5y')
    })
    cy.get('#\\/e2Dec4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5y')
    })


    cy.get('#\\/e3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.074x+847.294+5y')
    })
    cy.get('#\\/e3Dig4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5y')
    })
    cy.get('#\\/e3Dec4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5y')
    })
    cy.get('#\\/e3Pad .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.074x+847.294+5.000y')
    })
    cy.get('#\\/e3Dig4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5y')
    })
    cy.get('#\\/e3Dec4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5y')
    })

    cy.get('#\\/e4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07394918000x+847.2941839+5.000000000y')
    })
    cy.get('#\\/e4Dig4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5.000y')
    })
    cy.get('#\\/e4Dec4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5.0000y')
    })
    cy.get('#\\/e4NoPad .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07394918x+847.2941839+5y')
    })
    cy.get('#\\/e4Dig4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.07395x+847.3+5.000y')
    })
    cy.get('#\\/e4Dec4a .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text).equal('0.0739x+847.2942+5.0000y')
    })


  });

})
