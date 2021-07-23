import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Module Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')


  })


  it('module with sentence', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="p1"><module name="m">
      <moduleSetup>
        <moduleAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </moduleSetup>
      Hello $item!
    </module>
    </p>

    <p name="p2">Hello $item!</p>

    <p name="p3"><copy tname="m" item="plant" /></p>

    <p><textinput name="item2" prefill="animal" /></p>
    <p name="p4"><copy tname="m" item="$item2" /></p>
    <p name="p5"><copy tname="m" /></p>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p1').should('contain.text', 'Hello who?!');
    cy.get('#\\/p2').should('contain.text', 'Hello who?!');
    cy.get('#\\/p3').should('contain.text', 'Hello plant!');
    cy.get('#\\/p4').should('contain.text', 'Hello animal!');
    cy.get('#\\/p5').should('contain.text', 'Hello who?!');

    cy.get('#\\/item2_input').clear().type("rock").blur();
    cy.get('#\\/p1').should('contain.text', 'Hello who?!');
    cy.get('#\\/p2').should('contain.text', 'Hello who?!');
    cy.get('#\\/p3').should('contain.text', 'Hello plant!');
    cy.get('#\\/p4').should('contain.text', 'Hello rock!');
    cy.get('#\\/p5').should('contain.text', 'Hello who?!');

  })

  it('module with sentence, newnamespace', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <moduleSetup>
        <moduleAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </moduleSetup>
      <p>Hello $item!</p>
    </module>

    <p name="p2">Hello $(m/item)!</p>

    <copy tname="m" item="plant" assignNames="m2" />
    <p><textinput name="item" prefill="animal" /></p>
    <copy tname="m" item="$item" assignNames="m3" />
    <copy tname="m" assignNames="m4" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello animal!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

    cy.get('#\\/item_input').clear().type("rock").blur();
    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello rock!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

  })

  it('module with sentence, nested newnamespaces', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <moduleSetup newNamespace name="mads">
        <moduleAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </moduleSetup>
      <p>Hello $(mads/item)!</p>
    </module>

    <p name="p2">Hello $(m/mads/item)!</p>

    <copy tname="m" item="plant" assignNames="m2" />
    <p><textinput name="item" prefill="animal" /></p>
    <copy tname="m" item="$item" assignNames="m3" />
    <copy tname="m" assignNames="m4" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello animal!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

    cy.get('#\\/item_input').clear().type("rock").blur();
    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello rock!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

  })

  it('module with sentence, triple nested newnamespaces', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <moduleSetup newNamespace name="mads">
        <moduleAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" newNamespace name="ma" />
      </moduleSetup>
      <p>Hello $(mads/ma/item)!</p>
    </module>

    <p name="p2">Hello $(m/mads/ma/item)!</p>

    <copy tname="m" item="plant" assignNames="m2" />
    <p><textinput name="item" prefill="animal" /></p>
    <copy tname="m" item="$item" assignNames="m3" />
    <copy tname="m" assignNames="m4" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello animal!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

    cy.get('#\\/item_input').clear().type("rock").blur();
    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello rock!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

  })

  it('module with graph, newnamespace', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <moduleSetup>
        <moduleAttribute componentType="math" attribute="x" defaultValue="3" assignNames="pointX" />
        <moduleAttribute componentType="math" attribute="y" defaultValue="5" assignNames="pointY" />
        <moduleAttribute componentType="_componentSize" attribute="width" defaultValue="300px" assignNames="graphWidth" />
        <moduleAttribute componentType="_componentSize" attribute="height" defaultValue="300px" assignNames="graphHeight" />
      </moduleSetup>
      <graph width="$graphWidth" height="$graphHeight" name="g">
        <point name="p" x="$pointX" y="$pointY" />
      </graph>
      <p>Point coords:
        <mathinput name="x2" bindValueTo="$(p{prop='x'})" />
        <mathinput name="y2" bindValueTo="$(p{prop='y'})" />
      </p>
    </module>

    <p>Point coords: <mathinput name="x" prefill="7" /> <mathinput name="y" prefill='-7' /></p>
    <p>Graph size: <mathinput name="w" prefill="200" /> <mathinput name="h" prefill="100" /></p>
    
    <copy tname="m" x="$x" y="$y" width="$w" height="$h" assignNames="m2" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m/g"].stateValues.width.size).eq(300)
      expect(components["/m/g"].stateValues.height.size).eq(300)
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([3, 5]);
      expect(components["/m2/g"].stateValues.width.size).eq(200)
      expect(components["/m2/g"].stateValues.height.size).eq(100)
      expect(components["/m2/p"].stateValues.xs.map(x => x.tree)).eqls([7, -7]);
    });

    cy.get(cesc('#/m/x2') + " textarea").type("{end}{backspace}-6{enter}", { force: true })
    cy.get(cesc('#/m/y2') + " textarea").type("{end}{backspace}9{enter}", { force: true })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m/g"].stateValues.width.size).eq(300)
      expect(components["/m/g"].stateValues.height.size).eq(300)
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 9]);
      expect(components["/m2/g"].stateValues.width.size).eq(200)
      expect(components["/m2/g"].stateValues.height.size).eq(100)
      expect(components["/m2/p"].stateValues.xs.map(x => x.tree)).eqls([7, -7]);
    });


    cy.get(cesc('#/x') + " textarea").type("{end}{backspace}{backspace}1{enter}", { force: true })
    cy.get(cesc('#/y') + " textarea").type("{end}{backspace}{backspace}2{enter}", { force: true })
    cy.get(cesc('#/w') + " textarea").type("{end}{backspace}{backspace}30{enter}", { force: true })
    cy.get(cesc('#/h') + " textarea").type("{end}{backspace}{backspace}80{enter}", { force: true })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m/g"].stateValues.width.size).eq(300)
      expect(components["/m/g"].stateValues.height.size).eq(300)
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 9]);
      expect(components["/m2/g"].stateValues.width.size).eq(230)
      expect(components["/m2/g"].stateValues.height.size).eq(180)
      expect(components["/m2/p"].stateValues.xs.map(x => x.tree)).eqls([1, 2]);
    });

    cy.get(cesc('#/m2/x2') + " textarea").type("{end}{backspace}-3{enter}", { force: true })
    cy.get(cesc('#/m2/y2') + " textarea").type("{end}{backspace}-4{enter}", { force: true })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m/g"].stateValues.width.size).eq(300)
      expect(components["/m/g"].stateValues.height.size).eq(300)
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 9]);
      expect(components["/m2/g"].stateValues.width.size).eq(230)
      expect(components["/m2/g"].stateValues.height.size).eq(180)
      expect(components["/m2/p"].stateValues.xs.map(x => x.tree)).eqls([-3, -4]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/m/p"].movePoint({ x: -8, y: -9 })

      expect(components["/m/g"].stateValues.width.size).eq(300)
      expect(components["/m/g"].stateValues.height.size).eq(300)
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-8, -9]);
      expect(components["/m2/g"].stateValues.width.size).eq(230)
      expect(components["/m2/g"].stateValues.height.size).eq(180)
      expect(components["/m2/p"].stateValues.xs.map(x => x.tree)).eqls([-3, -4]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/m2/p"].movePoint({ x: 6, y: -10 })

      expect(components["/m/g"].stateValues.width.size).eq(300)
      expect(components["/m/g"].stateValues.height.size).eq(300)
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-8, -9]);
      expect(components["/m2/g"].stateValues.width.size).eq(230)
      expect(components["/m2/g"].stateValues.height.size).eq(180)
      expect(components["/m2/p"].stateValues.xs.map(x => x.tree)).eqls([6, -10]);
    });


  })

  it('module inside a module', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <moduleSetup>
        <moduleAttribute componentType="math" attribute="x" defaultValue="3" assignNames="pointX" />
        <moduleAttribute componentType="math" attribute="y" defaultValue="5" assignNames="pointY" />
      </moduleSetup>
      <graph>
        <point name="p" x="$pointX" y="$pointY" />
      </graph>
    </module>

    <module name="n" newNamespace>
      <moduleSetup>
        <moduleAttribute componentType="math" attribute="u" defaultValue="1" assignNames="u" />
        <moduleAttribute componentType="math" attribute="v" defaultValue="-2" assignNames="v" />
      </moduleSetup>
      <graph>
        <point name="p" x="$u" y="$v" />
      </graph>
      <math name="vfixed" modifyIndirectly="false" hide>$v</math>
      <copy tname="../m" x="$u+$vfixed" y="9" assignNames="m" />
      
    </module>

    <p>Point coords: <mathinput name="x" prefill="7" /> <mathinput name="y" prefill='-7' /></p>
    <copy tname="n" u="$x" v="$y" assignNames="n2" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([3, 5]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([1, -2]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([-1, 9]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([7, -7]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([0, 9]);
    });

    cy.get(cesc('#/x') + " textarea").type("{end}{backspace}{backspace}-6{enter}", { force: true })
    cy.get(cesc('#/y') + " textarea").type("{end}{backspace}{backspace}8{enter}", { force: true })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([3, 5]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([1, -2]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([-1, 9]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 8]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([2, 9]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/m/p"].movePoint({ x: -2, y: -4 })
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -4]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([1, -2]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([-1, 9]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 8]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([2, 9]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/n/p"].movePoint({ x: 7, y: -3 })
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -4]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([7, -3]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([4, 9]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 8]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([2, 9]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/n/m/p"].movePoint({ x: -5, y: -7 })
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -4]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -3]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([-5, -7]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([-6, 8]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([2, 9]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/n2/p"].movePoint({ x: 4, y: 5 })
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -4]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -3]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([-5, -7]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([4, 5]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([9, 9]);
    });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/n2/m/p"].movePoint({ x: -5, y: -6 })
      expect(components["/m/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -4]);
      expect(components["/n/p"].stateValues.xs.map(x => x.tree)).eqls([-2, -3]);
      expect(components["/n/m/p"].stateValues.xs.map(x => x.tree)).eqls([-5, -7]);
      expect(components["/n2/p"].stateValues.xs.map(x => x.tree)).eqls([-10, 5]);
      expect(components["/n2/m/p"].stateValues.xs.map(x => x.tree)).eqls([-5, -6]);
    });

  })

  it('module from uri', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section><title>First one</title>
    <copy uri='doenet:contentId=06429281c962f456a8b07d8d904f441da5c354ca8206fd145a217938d981b99d' assignNames="m1" />

    <p>Submitted response for problem 1: <math name="sr1"><copy prop="submittedResponse" tname="m1/ans" /></math></p>
    <p>Credit for problem 1: <copy prop="creditAchieved" tname="m1/prob" assignNames="ca1" /></p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    <copy uri='doenet:contentId=06429281c962f456a8b07d8d904f441da5c354ca8206fd145a217938d981b99d' title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" width="200px" height="200px" assignNames="m2" />

    <p>Submitted response for problem 2: <math name="sr2"><copy prop="submittedResponse" tname="m2/ans" /></math></p>
    <p>Credit for problem 2: <copy prop="creditAchieved" tname="m2/prob" assignNames="ca2" /></p>
    </section>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc(`#/m1/_m1`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(3,4)')
    })
    cy.get(`#\\/coordsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,3)')
    })
    cy.get(`#\\/coordsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,-5)')
    })
    cy.get(cesc(`#/m2/_m1`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,-5)')
    })
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })
    cy.get('#\\/ca1').should('have.text', '0');
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })
    cy.get('#\\/ca2').should('have.text', '0');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/m1/P"].stateValues.xs.map(x => x.tree)).eqls([0, 0]);
      expect(components["/m2/P"].stateValues.xs.map(x => x.tree)).eqls([-3, 3]);
    });

    cy.log('submit answers')

    cy.get(cesc('#/m1/ans_submit')).click();
    cy.get(cesc('#/m2/ans_submit')).click();
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(0,0)')
    })
    cy.get('#\\/ca1').should('have.text', '0');
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,3)')
    })
    cy.get('#\\/ca2').should('have.text', '0');


    cy.log('move near correct answers')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/m1/P"].movePoint({ x: 3.2, y: 3.9 });
      components["/m2/P"].movePoint({ x: 7.2, y: -4.9 });
    });


    cy.get(cesc(`#/m1/_m1`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(3,4)')
    })
    cy.get(`#\\/coordsa`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,3)')
    })
    cy.get(`#\\/coordsb`).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,-5)')
    })
    cy.get(cesc(`#/m2/_m1`)).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,-5)')
    })


    cy.log('submit answers')

    cy.get(cesc('#/m1/ans_submit')).click();
    cy.get(cesc('#/m2/ans_submit')).click();
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(3,4)')
    })
    cy.get('#\\/ca1').should('have.text', '1');
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,-5)')
    })
    cy.get('#\\/ca2').should('have.text', '1');


  })

  it('module from uri inside a module', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <module name="g" newNamespace>
      <moduleSetup>
        <moduleAttribute componentType="math" attribute="a" defaultValue="1" assignNames="a" />
        <moduleAttribute componentType="math" attribute="b" defaultValue="2" assignNames="b" />
        <moduleAttribute componentType="math" attribute="c" defaultValue="3" assignNames="c" />
        <moduleAttribute componentType="_componentSize" attribute="width" defaultValue="300px" assignNames="width" />
        <moduleAttribute componentType="_componentSize" attribute="height" defaultValue="300px" assignNames="height" />
      </moduleSetup>
    
      <p>Make the goal be <m>($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m>$c</m>.</p>
      <copy width="$width" height="$height" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" uri="doenet:contentId=06429281c962f456a8b07d8d904f441da5c354ca8206fd145a217938d981b99d" assignNames="extMod" />
    
      <p>Submitted response for problem: <math name="sr"><copy prop="submittedResponse" tname="extMod/ans" /></math></p>
      <p>Credit for problem: <copy prop="creditAchieved" tname="extMod/prob" assignNames="ca" /></p>

    </module>
    
    <copy tname="g" b="-5" c="9" width="200px" height="250px" assignNames="g2" />
    <copy tname="g" a="7" c="-3" width="350x" height="325px" assignNames="g3" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load


    cy.get(cesc('#/g/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
    })
    cy.get(cesc('#/g/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('3')
    })
    cy.get(cesc('#/g/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
    })
    cy.get(cesc('#/g/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })
    cy.get(cesc('#/g/ca')).should('have.text', '0');

    cy.get(cesc('#/g2/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
    })
    cy.get(cesc('#/g2/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('9')
    })
    cy.get(cesc('#/g2/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
    })
    cy.get(cesc('#/g2/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })
    cy.get(cesc('#/g2/ca')).should('have.text', '0');

    cy.get(cesc('#/g3/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
    })
    cy.get(cesc('#/g3/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('-3')
    })
    cy.get(cesc('#/g3/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
    })
    cy.get(cesc('#/g3/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('＿')
    })
    cy.get(cesc('#/g3/ca')).should('have.text', '0');


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components["/g/extMod/P"].stateValues.xs.map(x => x.tree)).eqls([3, 0]);
      expect(components["/g2/extMod/P"].stateValues.xs.map(x => x.tree)).eqls([9, 0]);
      expect(components["/g3/extMod/P"].stateValues.xs.map(x => x.tree)).eqls([-3, 0]);
      expect(components["/g/extMod/_graph1"].stateValues.width.size).eq(300);
      expect(components["/g/extMod/_graph1"].stateValues.height.size).eq(300);
      expect(components["/g2/extMod/_graph1"].stateValues.width.size).eq(200);
      expect(components["/g2/extMod/_graph1"].stateValues.height.size).eq(250);
      expect(components["/g3/extMod/_graph1"].stateValues.width.size).eq(350);
      expect(components["/g3/extMod/_graph1"].stateValues.height.size).eq(325);
    });

    cy.log('submit answers')

    cy.get(cesc('#/g/extMod/ans_submit')).click();
    cy.get(cesc('#/g2/extMod/ans_submit')).click();
    cy.get(cesc('#/g3/extMod/ans_submit')).click();

    cy.get(cesc('#/g/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(3,0)')
    })
    cy.get(cesc('#/g/ca')).should('have.text', '0');
    cy.get(cesc('#/g2/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(9,0)')
    })
    cy.get(cesc('#/g2/ca')).should('have.text', '0');
    cy.get(cesc('#/g3/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,0)')
    })
    cy.get(cesc('#/g3/ca')).should('have.text', '0');



    cy.log('move near correct answers')
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/g/extMod/P"].movePoint({ x: 1.2, y: 1.9 });
      components["/g2/extMod/P"].movePoint({ x: 1.2, y: -4.9 });
      components["/g3/extMod/P"].movePoint({ x: 7.2, y: 1.9 });
    });


    cy.get(cesc('#/g/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
    })
    cy.get(cesc('#/g/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('3')
    })
    cy.get(cesc('#/g/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
    })
    cy.get(cesc('#/g/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(3,0)')
    })
    cy.get(cesc('#/g/ca')).should('have.text', '0');

    cy.get(cesc('#/g2/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
    })
    cy.get(cesc('#/g2/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('9')
    })
    cy.get(cesc('#/g2/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
    })
    cy.get(cesc('#/g2/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(9,0)')
    })
    cy.get(cesc('#/g2/ca')).should('have.text', '0');

    cy.get(cesc('#/g3/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
    })
    cy.get(cesc('#/g3/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('-3')
    })
    cy.get(cesc('#/g3/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
    })
    cy.get(cesc('#/g3/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,0)')
    })
    cy.get(cesc('#/g3/ca')).should('have.text', '0');


    cy.log('submit answers')

    cy.get(cesc('#/g/extMod/ans_submit')).click();
    cy.get(cesc('#/g2/extMod/ans_submit')).click();
    cy.get(cesc('#/g3/extMod/ans_submit')).click();

    cy.get(cesc('#/g/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
    })
    cy.get(cesc('#/g/ca')).should('have.text', '1');
    cy.get(cesc('#/g2/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
    })
    cy.get(cesc('#/g2/ca')).should('have.text', '1');
    cy.get(cesc('#/g3/sr')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
    })
    cy.get(cesc('#/g3/ca')).should('have.text', '1');




  })


  // with no new namespace, links to inside the external module currently don't work
  // but we can set parameters
  it('module from uri inside a module, partial functionality with no new namespace', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <module name="g">
      <moduleSetup>
        <moduleAttribute componentType="math" attribute="a" defaultValue="1" assignNames="a" />
        <moduleAttribute componentType="math" attribute="b" defaultValue="2" assignNames="b" />
        <moduleAttribute componentType="math" attribute="c" defaultValue="3" assignNames="c" />
        <moduleAttribute componentType="_componentSize" attribute="width" defaultValue="300px" assignNames="width" />
        <moduleAttribute componentType="_componentSize" attribute="height" defaultValue="300px" assignNames="height" />
      </moduleSetup>
    
      <p>Make the goal be <m>($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m>$c</m>.</p>
      <copy width="$width" height="$height" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" uri="doenet:contentId=06429281c962f456a8b07d8d904f441da5c354ca8206fd145a217938d981b99d" assignNames="extMod" />

    </module>
    
    <copy tname="g" b="-5" c="9" width="200px" height="250px" assignNames="g2" />
    <copy tname="g" a="7" c="-3" width="350x" height="325px" assignNames="g3" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let g2m1Anchor = cesc('#' + components["/g2"].replacements[3].activeChildren[1].componentName);
      let g2m3Anchor = cesc('#' + components["/g2"].replacements[5].activeChildren[3].componentName);
      let g2extProblem = components["/g2"].replacements[7].replacements[0].replacements[0].replacements[3];
      let g2extm1Anchor = cesc('#' + g2extProblem.activeChildren[2].activeChildren[1].componentName);
      let g2extGraph = g2extProblem.activeChildren[4];
      let g2extP = g2extGraph.activeChildren[0];
      let g2extAnswerSubmitAnchor = cesc('#' + g2extProblem.activeChildren[6].componentName + "_submit");
      let g3m1Anchor = cesc('#' + components["/g3"].replacements[3].activeChildren[1].componentName);
      let g3m3Anchor = cesc('#' + components["/g3"].replacements[5].activeChildren[3].componentName);
      let g3extProblem = components["/g3"].replacements[7].replacements[0].replacements[0].replacements[3];
      let g3extm1Anchor = cesc('#' + g3extProblem.activeChildren[2].activeChildren[1].componentName);
      let g3extGraph = g3extProblem.activeChildren[4];
      let g3extP = g3extGraph.activeChildren[0];
      let g3extAnswerSubmitAnchor = cesc('#' + g3extProblem.activeChildren[6].componentName + "_submit");

      cy.get(cesc('#/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
      })
      cy.get(cesc('#/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('3')
      })
      cy.get(cesc('#/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
      })
      cy.get(g2m1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
      })
      cy.get(g2m3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('9')
      })
      cy.get(g2extm1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
      })
      cy.get(g3m1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
      })
      cy.get(g3m3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('-3')
      })
      cy.get(g3extm1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
      })


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/extMod/P"].stateValues.xs.map(x => x.tree)).eqls([3, 0]);
        expect(g2extP.stateValues.xs.map(x => x.tree)).eqls([9, 0]);
        expect(g3extP.stateValues.xs.map(x => x.tree)).eqls([-3, 0]);
        expect(components["/extMod/_graph1"].stateValues.width.size).eq(300);
        expect(components["/extMod/_graph1"].stateValues.height.size).eq(300);
        expect(g2extGraph.stateValues.width.size).eq(200);
        expect(g2extGraph.stateValues.height.size).eq(250);
        expect(g3extGraph.stateValues.width.size).eq(350);
        expect(g3extGraph.stateValues.height.size).eq(325);
      });

      cy.log('submit answers')

      cy.get(cesc('#/extMod/ans_submit')).click();
      cy.get(g2extAnswerSubmitAnchor).click();
      cy.get(g3extAnswerSubmitAnchor).click();


      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/extMod/prob"].stateValues.creditAchieved).eq(0);
        expect(g2extProblem.stateValues.creditAchieved).eq(0);
        expect(g3extProblem.stateValues.creditAchieved).eq(0);
      })


      cy.log('move near correct answers')
      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        components["/extMod/P"].movePoint({ x: 1.2, y: 1.9 });
        g2extP.movePoint({ x: 1.2, y: -4.9 });
        g3extP.movePoint({ x: 7.2, y: 1.9 });
      });


      cy.get(cesc('#/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
      })
      cy.get(cesc('#/_m3')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('3')
      })
      cy.get(cesc('#/extMod/_m1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,2)')
      })
      cy.get(g2m1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
      })
      cy.get(g2m3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('9')
      })
      cy.get(g2extm1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(1,-5)')
      })
      cy.get(g3m1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
      })
      cy.get(g3m3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('-3')
      })
      cy.get(g3extm1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim().replace(/−/g, '-')).equal('(7,2)')
      })

      cy.log('submit answers')

      cy.get(cesc('#/extMod/ans_submit')).click();
      cy.get(g2extAnswerSubmitAnchor).click();
      cy.get(g3extAnswerSubmitAnchor).click();

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/extMod/prob"].stateValues.creditAchieved).eq(1);
        expect(g2extProblem.stateValues.creditAchieved).eq(1);
        expect(g3extProblem.stateValues.creditAchieved).eq(1);
      })
    })


  })

  it('apply sugar in module attributes', () => {

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <moduleSetup>
        <moduleAttribute componentType="point" attribute="P" defaultValue="(1,2)" assignNames="P" />
      </moduleSetup>
      <p>Point: $P</p>
    </module>
    
    <copy tname="m" P="(3,4)" assignNames="m2" />

    <graph>
      <point name="Q">(5,6)</point>
    </graph>
    <copy tname="m" P="$Q" assignNames="m3" />
    

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("(1,2)")
    })
    cy.get(cesc('#/m2/_p1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("(3,4)")
    })
    cy.get(cesc('#/m3/_p1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("(5,6)")
    })


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      components["/Q"].movePoint({ x: 7, y: 8 });
    });

    cy.get(cesc('#/m3/_p1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("(7,8)")
    })


  })


})