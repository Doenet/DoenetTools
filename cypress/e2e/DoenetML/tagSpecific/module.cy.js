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
    cy.clearIndexedDB();
    cy.visit('/cypressTest')

  })


  it('module with sentence', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p name="p1"><module name="m">
      <setup>
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </setup>
      Hello $item!
    </module>
    </p>

    <p name="p2">Hello $item!</p>

    <p name="p3"><copy target="m" item="plant" /></p>

    <p><textinput name="item2" prefill="animal" /></p>
    <p name="p4"><copy target="m" item="$item2" /></p>
    <p name="p5"><copy target="m" /></p>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/p1').should('contain.text', 'Hello who?!');
    cy.get('#\\/p2').should('contain.text', 'Hello who?!');
    cy.get('#\\/p3').should('contain.text', 'Hello plant!');
    cy.get('#\\/p4').should('contain.text', 'Hello animal!');
    cy.get('#\\/p5').should('contain.text', 'Hello who?!');

    cy.get('#\\/item2_input').clear().type("rock").blur();
    cy.get('#\\/p4').should('contain.text', 'Hello rock!');
    cy.get('#\\/p1').should('contain.text', 'Hello who?!');
    cy.get('#\\/p2').should('contain.text', 'Hello who?!');
    cy.get('#\\/p3').should('contain.text', 'Hello plant!');
    cy.get('#\\/p5').should('contain.text', 'Hello who?!');

  })

  it('module with sentence, newnamespace', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </setup>
      <p>Hello $item!</p>
    </module>

    <p name="p2">Hello $(m/item)!</p>

    <copy target="m" item="plant" assignNames="m2" />
    <p><textinput name="item" prefill="animal" /></p>
    <copy target="m" item="$item" assignNames="m3" />
    <copy target="m" assignNames="m4" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello animal!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

    cy.get('#\\/item_input').clear().type("rock").blur();
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello rock!');
    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

  })

  it('module with sentence, nested newnamespaces', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <setup newNamespace name="mads">
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </setup>
      <p>Hello $(mads/item)!</p>
    </module>

    <p name="p2">Hello $(m/mads/item)!</p>

    <copy target="m" item="plant" assignNames="m2" />
    <p><textinput name="item" prefill="animal" /></p>
    <copy target="m" item="$item" assignNames="m3" />
    <copy target="m" assignNames="m4" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello animal!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

    cy.get('#\\/item_input').clear().type("rock").blur();
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello rock!');
    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

  })

  it('module with sentence, triple nested newnamespaces', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <setup newNamespace name="mads">
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" newNamespace name="ma" />
      </setup>
      <p>Hello $(mads/ma/item)!</p>
    </module>

    <p name="p2">Hello $(m/mads/ma/item)!</p>

    <copy target="m" item="plant" assignNames="m2" />
    <p><textinput name="item" prefill="animal" /></p>
    <copy target="m" item="$item" assignNames="m3" />
    <copy target="m" assignNames="m4" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello animal!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

    cy.get('#\\/item_input').clear().type("rock").blur();
    cy.get(cesc('#/m3/_p1')).should('have.text', 'Hello rock!');
    cy.get(cesc('#/m/_p1')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/p2')).should('have.text', 'Hello who?!');
    cy.get(cesc('#/m2/_p1')).should('have.text', 'Hello plant!');
    cy.get(cesc('#/m4/_p1')).should('have.text', 'Hello who?!');

  })

  it('module with graph, newnamespace', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="x" defaultValue="3" assignNames="pointX" />
        <customAttribute componentType="math" attribute="y" defaultValue="5" assignNames="pointY" />
        <customAttribute componentType="text" attribute="size" defaultValue="medium" assignNames="graphSize" />
        <customAttribute componentType="number" attribute="aspectRatio" defaultValue="300px" assignNames="graphAspectRatio" />
      </setup>
      <graph size="$graphSize" aspectRatio="$graphAspectRatio" name="g">
        <point name="p" x="$pointX" y="$pointY" />
      </graph>
      <p>Point coords:
        <mathinput name="x2" bindValueTo="$(p.x)" />
        <mathinput name="y2" bindValueTo="$(p.y)" />
      </p>
      <p><copy prop="value" target="y2" assignNames="y2a" /></p>
    </module>

    <p>Point coords: <mathinput name="x" prefill="7" /> <mathinput name="y" prefill='-7' /></p>
    <p>Graph size: <textinput name="s" prefill="small" /> <mathinput name="ar" prefill="1/2" /></p>
    
    <copy target="m" x="$x" y="$y" size="$s" aspectRatio="$ar" assignNames="m2" />

    <p><copy prop="value" target="ar" assignNames="ar2" /></p>
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let smallWidth = 255;
    let mediumWidth = 425;
    let largeWidth = 595;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m/g"].stateValues.size).eq("medium")
      expect(stateVariables["/m/g"].stateValues.width.size).eq(mediumWidth)
      expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1)
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([3, 5]);
      expect(stateVariables["/m2/g"].stateValues.size).eq("small")
      expect(stateVariables["/m2/g"].stateValues.width.size).eq(smallWidth)
      expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(0.5)
      expect((stateVariables["/m2/p"].stateValues.xs)).eqls([7, -7]);
    });

    cy.get(cesc('#/m/x2') + " textarea").type("{end}{backspace}-6{enter}", { force: true })
    cy.get(cesc('#/m/y2') + " textarea").type("{end}{backspace}9{enter}", { force: true })
    cy.get(cesc('#/m/y2a')).should('contain.text', '9')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m/g"].stateValues.size).eq("medium")
      expect(stateVariables["/m/g"].stateValues.width.size).eq(mediumWidth)
      expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1)
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-6, 9]);
      expect(stateVariables["/m2/g"].stateValues.size).eq("small")
      expect(stateVariables["/m2/g"].stateValues.width.size).eq(smallWidth)
      expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(0.5)
      expect((stateVariables["/m2/p"].stateValues.xs)).eqls([7, -7]);
    });


    cy.get(cesc('#/x') + " textarea").type("{end}{backspace}{backspace}1{enter}", { force: true })
    cy.get(cesc('#/y') + " textarea").type("{end}{backspace}{backspace}2{enter}", { force: true })
    cy.get(cesc('#/s') + "_input").clear().type("large{enter}", { force: true })
    cy.get(cesc('#/ar') + " textarea").type("{ctrl+home}{shift+ctrl+end}{backspace}3/2{enter}", { force: true })
    cy.get(cesc('#/ar2')).should('contain.text', '3');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m/g"].stateValues.size).eq("medium")
      expect(stateVariables["/m/g"].stateValues.width.size).eq(mediumWidth)
      expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1)
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-6, 9]);
      expect(stateVariables["/m2/g"].stateValues.size).eq("large")
      expect(stateVariables["/m2/g"].stateValues.width.size).eq(largeWidth)
      expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(1.5)
      expect((stateVariables["/m2/p"].stateValues.xs)).eqls([1, 2]);
    });

    cy.get(cesc('#/m2/x2') + " textarea").type("{end}{backspace}-3{enter}", { force: true })
    cy.get(cesc('#/m2/y2') + " textarea").type("{end}{backspace}-4{enter}", { force: true })
    cy.get(cesc('#/m2/y2a')).should('contain.text', '−4')

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m/g"].stateValues.size).eq("medium")
      expect(stateVariables["/m/g"].stateValues.width.size).eq(mediumWidth)
      expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1)
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-6, 9]);
      expect(stateVariables["/m2/g"].stateValues.size).eq("large")
      expect(stateVariables["/m2/g"].stateValues.width.size).eq(largeWidth)
      expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(1.5)
      expect((stateVariables["/m2/p"].stateValues.xs)).eqls([-3, -4]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m/p",
        args: { x: -8, y: -9 }
      })

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m/g"].stateValues.size).eq("medium")
      expect(stateVariables["/m/g"].stateValues.width.size).eq(mediumWidth)
      expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1)
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-8, -9]);
      expect(stateVariables["/m2/g"].stateValues.size).eq("large")
      expect(stateVariables["/m2/g"].stateValues.width.size).eq(largeWidth)
      expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(1.5)
      expect((stateVariables["/m2/p"].stateValues.xs)).eqls([-3, -4]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m2/p",
        args: { x: 6, y: -10 }
      })

      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/m/g"].stateValues.size).eq("medium")
      expect(stateVariables["/m/g"].stateValues.width.size).eq(mediumWidth)
      expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1)
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-8, -9]);
      expect(stateVariables["/m2/g"].stateValues.size).eq("large")
      expect(stateVariables["/m2/g"].stateValues.width.size).eq(largeWidth)
      expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(1.5)
      expect((stateVariables["/m2/p"].stateValues.xs)).eqls([6, -10]);
    });


  })

  it('module inside a module', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="x" defaultValue="3" assignNames="pointX" />
        <customAttribute componentType="math" attribute="y" defaultValue="5" assignNames="pointY" />
      </setup>
      <graph>
        <point name="p" x="$pointX" y="$pointY" />
      </graph>
    </module>

    <module name="n" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="u" defaultValue="1" assignNames="u" />
        <customAttribute componentType="math" attribute="v" defaultValue="-2" assignNames="v" />
      </setup>
      <graph>
        <point name="p" x="$u" y="$v" />
      </graph>
      <math name="vfixed" modifyIndirectly="false" hide>$v</math>
      <copy target="../m" x="$u+$vfixed" y="9" assignNames="m" />
      
    </module>

    <p>Point coords: <mathinput name="x" prefill="7" /> <mathinput name="y" prefill='-7' /></p>
    <copy target="n" u="$x" v="$y" assignNames="n2" />

    <p><copy prop="value" target="y" assignNames="y2" /></p>

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([3, 5]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([1, -2]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([-1, 9]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([7, -7]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([0, 9]);
    });

    cy.get(cesc('#/x') + " textarea").type("{end}{backspace}{backspace}-6{enter}", { force: true })
    cy.get(cesc('#/y') + " textarea").type("{end}{backspace}{backspace}8{enter}", { force: true })
    cy.get(cesc('#/y2')).should('contain.text', '8');

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([3, 5]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([1, -2]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([-1, 9]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([-6, 8]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([2, 9]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m/p",
        args: { x: -2, y: -4 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-2, -4]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([1, -2]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([-1, 9]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([-6, 8]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([2, 9]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/n/p",
        args: { x: 7, y: -3 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-2, -4]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([7, -3]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([4, 9]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([-6, 8]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([2, 9]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/n/m/p",
        args: { x: -5, y: -7 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-2, -4]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([-2, -3]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([-5, -7]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([-6, 8]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([2, 9]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/n2/p",
        args: { x: 4, y: 5 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-2, -4]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([-2, -3]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([-5, -7]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([4, 5]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([9, 9]);
    });

    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/n2/m/p",
        args: { x: -5, y: -6 }
      })
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m/p"].stateValues.xs)).eqls([-2, -4]);
      expect((stateVariables["/n/p"].stateValues.xs)).eqls([-2, -3]);
      expect((stateVariables["/n/m/p"].stateValues.xs)).eqls([-5, -7]);
      expect((stateVariables["/n2/p"].stateValues.xs)).eqls([-10, 5]);
      expect((stateVariables["/n2/m/p"].stateValues.xs)).eqls([-5, -6]);
    });

  })

  it('module from uri', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <section><title>First one</title>
    <copy uri='doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4' assignNames="m1" />

    <p>Submitted response for problem 1: <math name="sr1"><copy prop="submittedResponse" target="m1/ans" /></math></p>
    <p>Credit for problem 1: <copy prop="creditAchieved" target="m1/prob" assignNames="ca1" /></p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    
    <copy uri='doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4' title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" size="medium" aspectRatio="1" assignNames="m2" />
    <p>Submitted response for problem 2: <math name="sr2"><copy prop="submittedResponse" target="m2/ans" /></math></p>
    <p>Credit for problem 2: <copy prop="creditAchieved" target="m2/prob" assignNames="ca2" /></p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m1/P"].stateValues.xs)).eqls([0, 0]);
      expect((stateVariables["/m2/P"].stateValues.xs)).eqls([-3, 3]);
    });

    cy.log('submit answers')

    cy.get(cesc('#/m1/ans_submit')).click();
    cy.get(cesc('#/m2/ans_submit')).click();
    cy.get('#\\/sr2').should('contain.text', '(−3,3)')
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(0,0)')
    })
    cy.get('#\\/ca1').should('have.text', '0');
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,3)')
    })
    cy.get('#\\/ca2').should('have.text', '0');


    cy.log('move near correct answers')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m1/P",
        args: { x: 3.2, y: 3.9 }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m2/P",
        args: { x: 7.2, y: -4.9 }
      });
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
    cy.get('#\\/sr2').should('contain.text', '(7,−5)')
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

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <module name="g" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="a" defaultValue="1" assignNames="a" />
        <customAttribute componentType="math" attribute="b" defaultValue="2" assignNames="b" />
        <customAttribute componentType="math" attribute="c" defaultValue="3" assignNames="c" />
        <customAttribute componentType="text" attribute="size" defaultValue="medium" assignNames="size" />
        <customAttribute componentType="number" attribute="aspectRatio" defaultValue="1" assignNames="aspectRatio" />
      </setup>
    
      <p>Make the goal be <m>($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m>$c</m>.</p>
      <copy size="$size" aspectRatio="$aspectRatio" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" uri="doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4" assignNames="extMod" />
    
      <p>Submitted response for problem: <math name="sr"><copy prop="submittedResponse" target="extMod/ans" /></math></p>
      <p>Credit for problem: <copy prop="creditAchieved" target="extMod/prob" assignNames="ca" /></p>

    </module>
    
    <copy target="g" b="-5" c="9" size="small" aspectRatio="4/5" assignNames="g2" />
    <copy target="g" a="7" c="-3" size="large" aspectRatio="1.2" assignNames="g3" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let smallWidth = 255;
    let mediumWidth = 425;
    let largeWidth = 595;

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


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/g/extMod/P"].stateValues.xs)).eqls([3, 0]);
      expect((stateVariables["/g2/extMod/P"].stateValues.xs)).eqls([9, 0]);
      expect((stateVariables["/g3/extMod/P"].stateValues.xs)).eqls([-3, 0]);
      expect(stateVariables["/g/extMod/_graph1"].stateValues.size).eq("medium");
      expect(stateVariables["/g/extMod/_graph1"].stateValues.width.size).eq(mediumWidth);
      expect(stateVariables["/g/extMod/_graph1"].stateValues.aspectRatio).eq(1);
      expect(stateVariables["/g2/extMod/_graph1"].stateValues.size).eq("small");
      expect(stateVariables["/g2/extMod/_graph1"].stateValues.width.size).eq(smallWidth);
      expect(stateVariables["/g2/extMod/_graph1"].stateValues.aspectRatio).eq(0.8);
      expect(stateVariables["/g3/extMod/_graph1"].stateValues.size).eq("large");
      expect(stateVariables["/g3/extMod/_graph1"].stateValues.width.size).eq(largeWidth);
      expect(stateVariables["/g3/extMod/_graph1"].stateValues.aspectRatio).eq(1.2);
    });

    cy.log('submit answers')

    cy.get(cesc('#/g/extMod/ans_submit')).click();
    cy.get(cesc('#/g2/extMod/ans_submit')).click();
    cy.get(cesc('#/g3/extMod/ans_submit')).click();

    cy.get(cesc('#/g3/sr')).should('contain.text', '(−3,0)')

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
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g/extMod/P",
        args: { x: 1.2, y: 1.9 }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g2/extMod/P",
        args: { x: 1.2, y: -4.9 }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/g3/extMod/P",
        args: { x: 7.2, y: 1.9 }
      });
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

    cy.get(cesc('#/g3/sr')).should('contain.text', '(7,2)')

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

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <module name="g">
      <setup>
        <customAttribute componentType="math" attribute="a" defaultValue="1" assignNames="a" />
        <customAttribute componentType="math" attribute="b" defaultValue="2" assignNames="b" />
        <customAttribute componentType="math" attribute="c" defaultValue="3" assignNames="c" />
        <customAttribute componentType="text" attribute="size" defaultValue="medium" assignNames="size" />
        <customAttribute componentType="number" attribute="aspectRatio" defaultValue="1" assignNames="aspectRatio" />
      </setup>
    
      <p>Make the goal be <m>($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m>$c</m>.</p>
      <copy size="$size" aspectRatio="$aspectRatio" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" uri="doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4" assignNames="extMod" />

    </module>
    
    <copy target="g" b="-5" c="9" size="small" aspectRatio="4/5" assignNames="g2" />
    <copy target="g" a="7" c="-3" size="large" aspectRatio="1.2" assignNames="g3" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    let smallWidth = 255;
    let mediumWidth = 425;
    let largeWidth = 595;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let g2m1Anchor = cesc('#' + stateVariables[stateVariables["/g2"].replacements[3].componentName].activeChildren[1].componentName);
      let g2m3Anchor = cesc('#' + stateVariables[stateVariables["/g2"].replacements[5].componentName].activeChildren[3].componentName);
      let g2extProblem = stateVariables[stateVariables[stateVariables[stateVariables["/g2"].replacements[7].componentName].replacements[0].componentName].replacements[3].componentName];
      let g2extm1Anchor = cesc('#' + stateVariables[g2extProblem.activeChildren[2].componentName].activeChildren[1].componentName);
      let g2extGraph = stateVariables[g2extProblem.activeChildren[4].componentName];
      let g2extPName = g2extGraph.activeChildren[0].componentName;
      let g2extAnswerSubmitAnchor = cesc('#' + g2extProblem.activeChildren[6].componentName + "_submit");
      let g2extAnswerCorrectAnchor = cesc('#' + g2extProblem.activeChildren[6].componentName + "_correct");
      let g2extAnswerIncorrectAnchor = cesc('#' + g2extProblem.activeChildren[6].componentName + "_incorrect");
      let g3m1Anchor = cesc('#' + stateVariables[stateVariables["/g3"].replacements[3].componentName].activeChildren[1].componentName);
      let g3m3Anchor = cesc('#' + stateVariables[stateVariables["/g3"].replacements[5].componentName].activeChildren[3].componentName);
      let g3extProblem = stateVariables[stateVariables[stateVariables[stateVariables["/g3"].replacements[7].componentName].replacements[0].componentName].replacements[3].componentName];
      let g3extm1Anchor = cesc('#' + stateVariables[g3extProblem.activeChildren[2].componentName].activeChildren[1].componentName);
      let g3extGraph = stateVariables[g3extProblem.activeChildren[4].componentName];
      let g3extPName = g3extGraph.activeChildren[0].componentName;
      let g3extAnswerSubmitAnchor = cesc('#' + g3extProblem.activeChildren[6].componentName + "_submit");
      let g3extAnswerCorrectAnchor = cesc('#' + g3extProblem.activeChildren[6].componentName + "_correct");
      let g3extAnswerIncorrectAnchor = cesc('#' + g3extProblem.activeChildren[6].componentName + "_incorrect");

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


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect((stateVariables["/extMod/P"].stateValues.xs)).eqls([3, 0]);
        expect(stateVariables[g2extPName].stateValues.xs).eqls([9, 0]);
        expect(stateVariables[g3extPName].stateValues.xs).eqls([-3, 0]);
        expect(stateVariables["/extMod/_graph1"].stateValues.size).eq("medium");
        expect(stateVariables["/extMod/_graph1"].stateValues.width.size).eq(mediumWidth);
        expect(stateVariables["/extMod/_graph1"].stateValues.aspectRatio).eq(1);
        expect(stateVariables[g2extGraph.componentName].stateValues.size).eq("small");
        expect(stateVariables[g2extGraph.componentName].stateValues.width.size).eq(smallWidth);
        expect(stateVariables[g2extGraph.componentName].stateValues.aspectRatio).eq(0.8);
        expect(stateVariables[g3extGraph.componentName].stateValues.size).eq("large");
        expect(stateVariables[g3extGraph.componentName].stateValues.width.size).eq(largeWidth);
        expect(stateVariables[g3extGraph.componentName].stateValues.aspectRatio).eq(1.2);
      });

      cy.log('submit answers')

      cy.get(cesc('#/extMod/ans_submit')).click();
      cy.get(g2extAnswerSubmitAnchor).click();
      cy.get(g3extAnswerSubmitAnchor).click();
      cy.get(g2extAnswerIncorrectAnchor).should('be.visible');
      cy.get(g3extAnswerIncorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/extMod/prob"].stateValues.creditAchieved).eq(0);
        expect(stateVariables[g2extProblem.componentName].stateValues.creditAchieved).eq(0);
        expect(stateVariables[g3extProblem.componentName].stateValues.creditAchieved).eq(0);
      })


      cy.log('move near correct answers')
      cy.window().then(async (win) => {
        await win.callAction1({
          actionName: "movePoint",
          componentName: "/extMod/P",
          args: { x: 1.2, y: 1.9 }
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: g2extPName,
          args: { x: 1.2, y: -4.9 }
        });
        await win.callAction1({
          actionName: "movePoint",
          componentName: g3extPName,
          args: { x: 7.2, y: 1.9 }
        });
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
      cy.get(g2extAnswerCorrectAnchor).should('be.visible');
      cy.get(g3extAnswerCorrectAnchor).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/extMod/prob"].stateValues.creditAchieved).eq(1);
        expect(stateVariables[g2extProblem.componentName].stateValues.creditAchieved).eq(1);
        expect(stateVariables[g3extProblem.componentName].stateValues.creditAchieved).eq(1);
      })
    })


  })

  it('apply sugar in module attributes', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="point" attribute="P" defaultValue="(1,2)" assignNames="P" />
      </setup>
      <p>Point: $P</p>
    </module>
    
    <copy target="m" P="(3,4)" assignNames="m2" />

    <graph>
      <point name="Q">(5,6)</point>
    </graph>
    <copy target="m" P="$Q" assignNames="m3" />
    

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


    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/Q",
        args: { x: 7, y: 8 }
      });
    });

    cy.get(cesc('#/m3/_p1')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal("(7,8)")
    })


  })

  it('invalid attributes ignored in module', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name='m' newNamespace>
      <setup>
        <customAttribute componentType="boolean" attribute="disabled" defaultValue="true" assignNames="disabled" />
      </setup>
      <p>Disabled? $disabled</p>
    </module>
    
    <copy target="m" assignNames="m1" />
    <copy target="m" disabled="true" assignNames="m2" />
    <copy target="m" disabled="false" assignNames="m3" />
    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get(cesc('#/m/_p1')).should('have.text', "Disabled? ");
    cy.get(cesc('#/m1/_p1')).should('have.text', "Disabled? ");
    cy.get(cesc('#/m2/_p1')).should('have.text', "Disabled? ");
    cy.get(cesc('#/m3/_p1')).should('have.text', "Disabled? ");

  })

  it('copy module and overwrite attribute values', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <module name="md" newNamespace>
      <setup>
        <customAttribute attribute="n" componentType="number" defaultValue="2" assignNames="n" />
        <customAttribute attribute="m" componentType="number" defaultValue="1" assignNames="m" />
      </setup>
      <p>The first number is $m; the second number is $n.</p>
      <p>Next value? <mathinput name="q" />  OK $q it is.</p>
    </module>
    
    <copy target="md" assignNames="md1" />
    <copy target="md1" n="10" assignNames="md2" />
    <copy target="md2" m="100" assignNames="md3" />
    <copy target="md3" n="0" assignNames="md4" />

    <copy target="md" m="13" n="17" assignNames="md5" />
    <copy target="md5" m="" n="a" assignNames="md6" />
    <copy target="md6" m="3" n="4" assignNames="md7" />

    `}, "*");
    });
    cy.get('#\\/_text1').should('have.text', 'a') //wait for page to load

    cy.get('#\\/md\\/_p1').should('have.text', 'The first number is 1; the second number is 2.')
    cy.get('#\\/md1\\/_p1').should('have.text', 'The first number is 1; the second number is 2.')
    cy.get('#\\/md2\\/_p1').should('have.text', 'The first number is 1; the second number is 10.')
    cy.get('#\\/md3\\/_p1').should('have.text', 'The first number is 100; the second number is 10.')
    cy.get('#\\/md4\\/_p1').should('have.text', 'The first number is 100; the second number is 0.')
    cy.get('#\\/md5\\/_p1').should('have.text', 'The first number is 13; the second number is 17.')
    cy.get('#\\/md6\\/_p1').should('have.text', 'The first number is NaN; the second number is NaN.')
    cy.get('#\\/md7\\/_p1').should('have.text', 'The first number is 3; the second number is 4.')

    cy.get('#\\/md\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md1\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md2\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md3\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md4\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md5\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md6\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })
    cy.get('#\\/md7\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('\uff3f')
    })


    cy.get('#\\/md\\/q textarea').type('x{enter}', { force: true })
    cy.get('#\\/md1\\/q textarea').type('y{enter}', { force: true })
    cy.get('#\\/md2\\/q textarea').type('z{enter}', { force: true })
    cy.get('#\\/md3\\/q textarea').type('u{enter}', { force: true })
    cy.get('#\\/md4\\/q textarea').type('v{enter}', { force: true })
    cy.get('#\\/md5\\/q textarea').type('w{enter}', { force: true })
    cy.get('#\\/md6\\/q textarea').type('s{enter}', { force: true })
    cy.get('#\\/md7\\/q textarea').type('t{enter}', { force: true })

    cy.get('#\\/md7\\/_p2 .mjx-mrow').should('contain.text', 't')

    cy.get('#\\/md\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('x')
    })
    cy.get('#\\/md1\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('y')
    })
    cy.get('#\\/md2\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('z')
    })
    cy.get('#\\/md3\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('u')
    })
    cy.get('#\\/md4\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('v')
    })
    cy.get('#\\/md5\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('w')
    })
    cy.get('#\\/md6\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('s')
    })
    cy.get('#\\/md7\\/_p2 .mjx-mrow').eq(0).invoke('text').then(text => {
      expect(text).eq('t')
    })

  })

  it('copy sourcesAreResponses with parent namespace target', () => {

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <setup>
      <module name="mod" newNamespace>
        <setup>
          <customAttribute componentType="text" attribute="title" defaultValue="Find point" assignNames="title" />
          <customAttribute componentType="math" attribute="initialx" defaultValue="0" assignNames="initialx" />
          <customAttribute componentType="math" attribute="initialy" defaultValue="0" assignNames="initialy" />
          <customAttribute componentType="math" attribute="goalx" defaultValue="3" assignNames="goalx" />
          <customAttribute componentType="math" attribute="goaly" defaultValue="4" assignNames="goaly" />
          <customAttribute componentType="_componentSize" attribute="width" defaultValue="300px" assignNames="width" />
          <customAttribute componentType="number" attribute="aspectRatio" defaultValue="1" assignNames="aspectRatio" />
        </setup>
      
        <problem name="prob"><title>$title</title>
      
          <p>Move the point to <m>($goalx, $goaly)</m>.</p>
          <graph width="$width" aspectRatio="$aspectRatio">
            <point x="$(initialx{link='false'})" y="$(initialy{link='false'})" name="P">
              <constraints>
                <attractTo><point x="$goalx" y="$goaly" ></point></attractTo>
              </constraints>
            </point>
          </graph>
      
          <answer name="ans" newNamespace>
            <award sourcesAreResponses="../P">
              <when>
                $(../P) = ($(../goalx), $(../goaly))
              </when>
            </award>
          </answer>
        </problem>
      </module>
    </setup>


    <section><title>First one</title>
    <copy target="mod" assignNames="m1" />

    <p>Submitted response for problem 1: <math name="sr1"><copy prop="submittedResponse" target="m1/ans" /></math></p>
    <p>Credit for problem 1: <copy prop="creditAchieved" target="m1/prob" assignNames="ca1" /></p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    
    <copy target="mod" title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" width="200px" aspectRatio="1" assignNames="m2" />
    <p>Submitted response for problem 2: <math name="sr2"><copy prop="submittedResponse" target="m2/ans" /></math></p>
    <p>Credit for problem 2: <copy prop="creditAchieved" target="m2/prob" assignNames="ca2" /></p>
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

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect((stateVariables["/m1/P"].stateValues.xs)).eqls([0, 0]);
      expect((stateVariables["/m2/P"].stateValues.xs)).eqls([-3, 3]);
    });

    cy.log('submit answers')

    cy.get(cesc('#/m1/ans_submit')).click();
    cy.get(cesc('#/m2/ans_submit')).click();
    cy.get('#\\/sr2').should('contain.text', '(−3,3)')
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(0,0)')
    })
    cy.get('#\\/ca1').should('have.text', '0');
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(-3,3)')
    })
    cy.get('#\\/ca2').should('have.text', '0');


    cy.log('move near correct answers')
    cy.window().then(async (win) => {
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m1/P",
        args: { x: 3.2, y: 3.9 }
      });
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/m2/P",
        args: { x: 7.2, y: -4.9 }
      });
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
    cy.get('#\\/sr2').should('contain.text', '(7,−5)')
    cy.get('#\\/sr1').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(3,4)')
    })
    cy.get('#\\/ca1').should('have.text', '1');
    cy.get('#\\/sr2').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim().replace(/−/g, '-')).equal('(7,-5)')
    })
    cy.get('#\\/ca2').should('have.text', '1');


  })

})