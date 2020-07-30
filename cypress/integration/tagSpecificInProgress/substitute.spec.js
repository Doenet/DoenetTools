describe('Substitute Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')

  })

  it('substitute with one string sugared to math',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
      <substitute>
        alpha+x^2,(x,b),(alpha,d)
      </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })
  });

  it('substitute with pattern and replaces sugared to math',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
      <substitute>
        <pattern>alpha+x^2</pattern>
        <replace>x,b</replace>
        <replace>alpha,d</replace>
      </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })
  });

  it('substitute with math pattern and replaces',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
      <substitute>
        <pattern><math>alpha+x^2</math></pattern>
        <replace><math>x</math><math>b</math></replace>
        <replace><variable>alpha</variable><math>d</math></replace>
      </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })
  });

  it('change simplify, substitute with one string sugared to math',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <textinput name="simplify" />
    <p>
      <substitute>
      <simplify><ref prop="value">simplify</ref></simplify>
      alpha+x^2,(x,b),(alpha,d)
      </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', 'd', ['^','b', 2]])
    })

    cy.log("set simplify to full")
    cy.get('#\\/simplify_input').clear().type("full{enter}");

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })


    cy.log("set simplify back to none")
    cy.get('#\\/simplify_input').clear().type("none{enter}");

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', 'd', ['^','b', 2]])
    })

  });

  it('change simplify, substitute with with pattern and replaces sugared to math, ',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <textinput name="simplify"/>
    <p>
      <substitute>
      <simplify><ref prop="value">simplify</ref></simplify>
      <pattern>alpha+x^2</pattern>
      <replace>x,b</replace>
      <replace>alpha,d</replace>
    </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', 'd', ['^','b', 2]])
    })

    cy.log("set simplify to full")
    cy.get('#\\/simplify_input').clear().type("full{enter}");

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })


    cy.log("set simplify back to none")
    cy.get('#\\/simplify_input').clear().type("none{enter}");

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', 'd', ['^','b', 2]])
    })

  });

  it('change simplify, substitute with with math pattern and replaces',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <textinput name="simplify"/>
    <p>
      <substitute>
      <simplify><ref prop="value">simplify</ref></simplify>
      <pattern><math simplify="false">alpha+x^2</math></pattern>
      <replace><math>x</math><math>b</math></replace>
      <replace><variable>alpha</variable><math>d</math></replace>
    </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', 'd', ['^','b', 2]])
    })

    cy.log("set simplify to full")
    cy.get('#\\/simplify_input').clear().type("full{enter}");

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })


    cy.log("set simplify back to none")
    cy.get('#\\/simplify_input').clear().type("none{enter}");

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+b2')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', 'd', ['^','b', 2]])
    })

  });

  it('substitute with math, global',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
      <substitute>
        <pattern><math>x^2+alpha + x/alpha</math></pattern>
        <replace><math>x</math><math>b</math></replace>
        <replace><variable>alpha</variable><math>d</math></replace>
      </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+bd+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['+', ['^','b', 2], ['/', 'b', 'd'], 'd'])
    })
  });

  it('change pattern and replaces in math',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <mathinput name="pattern" prefill="x^2+alpha"/>
    <mathinput name="var1" prefill="x"/>
    <mathinput name="replacement1" prefill="b"/>
    <mathinput name="var2" prefill="alpha"/>
    <mathinput name="replacement2" prefill="d"/>

    <p>
    <substitute>
      <pattern><ref prop="value">pattern</ref></pattern>
      <replace><ref prop="value">var1</ref><ref prop="value">replacement1</ref></replace>
      <replace><ref prop="value">var2</ref><ref prop="value">replacement2</ref></replace>
    </substitute>
    </p>
    `},"*");
    });

    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b2+d')
    })

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(['+', ['^','b', 2], 'd'])
    })

    cy.log('change pattern')
    cy.get('#\\/pattern_input').clear().type(`(alpha+beta^3)/(x^2+y){enter}`).blur();
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('β3+db2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', ['^','beta', 3], 'd'], ['+', ['^', 'b', 2], 'y']])
    })

    cy.log('change variable 1 to not match')
    cy.get('#\\/var1_input').clear().type(`c{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('β3+dx2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', ['^','beta', 3], 'd'], ['+', ['^', 'x', 2], 'y']])
    })

    cy.log('variable 1 cannot match replacement 2')
    cy.get('#\\/var1_input').clear().type(`d{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('β3+dx2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', ['^','beta', 3], 'd'], ['+', ['^', 'x', 2], 'y']])
    })

    cy.log('change variable 1 to match')
    cy.get('#\\/var1_input').clear().type(`beta{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('b3+dx2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', ['^','b', 3], 'd'], ['+', ['^', 'x', 2], 'y']])
    })

    cy.log('change replacement 1 ')
    cy.get('#\\/replacement1_input').clear().type(`p+q{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('d+(p+q)3x2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', 'd', ['^',['+','p', 'q'], 3]], ['+', ['^', 'x', 2], 'y']])
    })

    cy.log('change replacement 2 ')
    cy.get('#\\/replacement2_input').clear().type(`u/v{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('uv+(p+q)3x2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', ['/','u','v'], ['^',['+','p', 'q'], 3]], ['+', ['^', 'x', 2], 'y']])
    })

    cy.log('change variable 2 to not match')
    cy.get('#\\/var2_input').clear().type(`a{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α+(p+q)3x2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', 'alpha', ['^',['+','p', 'q'], 3]], ['+', ['^', 'x', 2], 'y']])
    })

    cy.log('change variable 2 to match replacement 1')
    cy.get('#\\/var2_input').clear().type(`q{enter}`);
    cy.get('#\\/_p1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('α+(p+uv)3x2+y')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value.tree).eqls(
        ['/', ['+', 'alpha', ['^',['+','p', ['/','u','v'] ], 3]], ['+', ['^', 'x', 2], 'y']])
    })

  });

  it('substitute with one string sugared to text',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
      <substitute type="text">
        Big banana BerAtes brown bErry., (   berateS  
            , chideS ),(Be, cHe)
      </substitute>
    </p>
    `},"*");
    });

    let s = "Big banana chideS brown cHerry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with pattern and replaces sugared to text',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute type="text">
      <pattern>Big banana BerAtes brown bErry.</pattern>
      <replace>   berateS  
         , chideS </replace>
      <replace>Be, cHe</replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big banana chideS brown cHerry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text pattern and sugared replaces',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute>
      <pattern><text>Big banana BerAtes brown bErry.</text></pattern>
      <replace>   berateS  
         , chideS </replace>
      <replace>Be, cHe</replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big banana chideS brown cHerry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text pattern and replaces',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute>
      <pattern><text>Big banana BerAtes brown bErry.</text></pattern>
      <replace>
        <text>berateS</text>
        <text>chideS</text>
      </replace>
      <replace><text>Be</text><text>cHe</text></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big banana chideS brown cHerry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text, including spaces',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute>
      <pattern><text>Big banana BerAtes brown bErry.</text></pattern>
      <replace>
        <text> berateS </text>
        <text>chideS</text>
      </replace>
      <replace><text>banana  </text><text>carrot</text></replace>
      <replace><text>Be</text><text>cHe </text></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big bananachideSbrown cHe rry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text, case sensitive',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute casesensitive>
      <pattern><text>Big banana BerAtes brown bErry.</text></pattern>
      <replace>
        <text>berateS</text>
        <text>chideS</text>
      </replace>
      <replace><text>bE</text><text>cHe</text></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big banana BerAtes brown cHerry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text, match whole word',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute matchwholeword>
      <pattern><text>Big banana BerAtes brown bErry.</text></pattern>
      <replace>
        <text>berateS</text>
        <text>chideS</text>
      </replace>
      <replace><text>Be</text><text>cHe</text></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big banana chideS brown bErry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text, match whole word with spaces',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute matchwholeword>
      <pattern><text>Big banana BerAtes brown bErry.</text></pattern>
      <replace>
        <text> berateS </text>
        <text>chideS</text>
      </replace>
      <replace><text>  Berry</text><text>cHerry</text></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "Big bananachideSbrown bErry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('substitute with text, global',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <p>
    <substitute>
      <pattern><text>Big babana BerAtes brown bErry.</text></pattern>
      <replace><text>b</text><text>c</text></replace>
      <replace><text>Be</text><text>cHe </text></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s = "cig cacana cerAtes crown cErry."
    cy.get('#\\/_p1').invoke('text').then((text) => {
      expect(text.trim()).eq(s);
    });

    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s);
    })
  });

  it('change pattern and replaces in text',() => {
    cy.window().then((win) => { win.postMessage({doenetML: `
    <textinput name="pattern" prefill="Big banana BerAtes brown bErry."/>
    <textinput name="var1" prefill="berateS"/>
    <textinput name="replacement1" prefill="chideS"/>
    <textinput name="var2" prefill="Be"/>
    <textinput name="replacement2" prefill="cHe"/>

    <p>
    <substitute>
      <pattern><ref prop="value">pattern</ref></pattern>
      <replace><ref prop="value">var1</ref><ref prop="value">replacement1</ref></replace>
      <replace><ref prop="value">var2</ref><ref prop="value">replacement2</ref></replace>
    </substitute>
    </p>
    `},"*");
    });

    let s1 = "Big banana chideS brown cHerry."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s1)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s1);
    })

    cy.log('change pattern')
    cy.get('#\\/pattern_input').clear().type(`The bicycle belongs to me.{enter}`);
    let s2 = "The bicycle cHelongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s2)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s2);
    })

    cy.log('variable 1 cannot match replacement 2')
    cy.get('#\\/var1_input').clear().type(`ch{enter}`);
    let s3 = "The bicycle cHelongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s3)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s3);
    })

    cy.log('change variable 1 to match')
    cy.get('#\\/var1_input').clear().type(`bicycle{enter}`);
    let s4 = "The chideS cHelongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s4)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s4);
    })

    cy.log('change replacement 1 ')
    cy.get('#\\/replacement1_input').clear().type(`scooter{enter}`);
    let s5 = "The scooter cHelongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s5)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s5);
    })

    cy.log('change replacement 2 ')
    cy.get('#\\/replacement2_input').clear().type(`ale{enter}`);
    let s6 = "The scooter alelongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s6)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s6);
    })

    cy.log('change variable 2 to not match')
    cy.get('#\\/var2_input').clear().type(`noodle{enter}`);
    let s7 = "The scooter belongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s7)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s7);
    })

    cy.log('change variable 2 to match replacement 1')
    cy.get('#\\/var2_input').clear().type(`ooter{enter}`);
    let s8 = "The scale belongs to me."
    cy.get('#\\/_p1').invoke('text').then((text) => {expect(text.trim()).eq(s8)});
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_substitute1'].replacements[0].state.value).eq(s8);
    })

  });

})
