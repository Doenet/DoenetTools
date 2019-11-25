import me from 'math-expressions';

describe('Selectable Type Tag Tests',function() {

beforeEach(() => {
    cy.visit('/test')
  })

  it('from with number string',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <from>7</from>
    <ref prop="value">_from1</ref>
    `},"*");
    });

    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("number");
      expect(components['/_from1'].state.value).eq(7);

    })
  });

  it('from with letter string',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <from>q</from>
    <ref prop="value">_from1</ref>
    `},"*");
    });

    cy.get('#__letters2').should('have.text','q')
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("letters");
      expect(components['/_from1'].state.value).eq('q');

    })
  });

  it('from with letternumber string',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <from>z3</from>
    <ref prop="value">_from1</ref>
    `},"*");
    });

    cy.get('#__text2').should('have.text','z3')
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("text");
      expect(components['/_from1'].state.value).eq('z3');

    })
  });

  it('from with boolean child',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <from><boolean>false</boolean></from>
    <ref prop="value">_from1</ref>
    `},"*");
    });

    cy.get('#__boolean1').should('have.text','false')
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("boolean");
      expect(components['/_from1'].state.value).eq(false);

    })
  });

  it('from with dynamic boolean child',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <from><ref prop="value">b</ref></from>
    <ref prop="value">_from1</ref>
    <booleaninput name="b"/>
    `},"*");
    });

    cy.get('#__boolean2').should('have.text','false')
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("boolean");
      expect(components['/_from1'].state.value).eq(false);
    })

    cy.log('check the box')
    cy.get('#\\/b_input').click();

    cy.get('#__boolean2').should('have.text','true')
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("boolean");
      expect(components['/_from1'].state.value).eq(true);
    })

    cy.log('uncheck the box')
    cy.get('#\\/b_input').click();

    cy.get('#__boolean2').should('have.text','false')
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("boolean");
      expect(components['/_from1'].state.value).eq(false);
    })

  });
  
  it('from with type from originally unresolved ref',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <from>
      <type><ref>_text1</ref></type>
      x^2
    </from>
    <ref prop="value">_from1</ref>
    <text>math</text>
    `},"*");
    });

    cy.get('#__math2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_from1'].state.type).eq("math");
      expect(components['/_from1'].state.value.tree).eqls(['^', 'x',2]);

    })

  });

  it('exclude with number string',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <exclude>3,7</exclude>
    <p><aslist><ref prop="values">_exclude1</ref></aslist></p>
    `},"*");
    });

    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('7')
    })
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_exclude1'].state.type).eq("number");
      expect(components['/_exclude1'].state.values).eqls([3,7]);

    })
  });

  it('exclude with letters string',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <exclude>q,u</exclude>
    <p><aslist><ref prop="values">_exclude1</ref></aslist></p>
    `},"*");
    });

    cy.get('#__letters3').should('have.text', 'q')
    cy.get('#__letters4').should('have.text', 'u')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_exclude1'].state.type).eq("letters");
      expect(components['/_exclude1'].state.values).eqls(['q','u']);
    })

  });

  it('exclude with letternumber string',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <exclude>2,i</exclude>
    <p><aslist><ref prop="values">_exclude1</ref></aslist></p>
    `},"*");
    });

    cy.get('#__text3').should('have.text', '2')
    cy.get('#__text4').should('have.text', 'i')
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_exclude1'].state.type).eq("text");
      expect(components['/_exclude1'].state.values).eqls(['2','i']);
    })
    
  });

  
  it('exclude with type from originally unresolved ref',() => {
    cy.window().then((win) => { win.postMessage({doenetCode: `
    <exclude>
      <type><ref>_text1</ref></type>
      x^2, b/u
    </exclude>
    <ref prop="values">_exclude1</ref>
    <text>math</text>
    `},"*");
    });

    cy.get('#__math3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('x2')
    })
    cy.get('#__math4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('bu')
    })
  
    cy.window().then((win) => {
      let components = Object.assign({},win.state.components);
      expect(components['/_exclude1'].state.type).eq("math");
      expect(components['/_exclude1'].state.values[0].tree).eqls(['^', 'x',2]);
      expect(components['/_exclude1'].state.values[1].tree).eqls(['/', 'b','u']);

    })

  });

});

