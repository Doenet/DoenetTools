describe('Collect Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it('collect points from graphs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,5)</point>
    </graph>

    <graph>
      <copy target="_point1" />
      <point>(4,2)</point>
      <point>
        (<copy prop="y" target="_point2" />,
        <copy prop="x" target="_point2" />)
      </point>
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" name="points" target="_panel1"/>
    </graph>

    <p>Coordinates of points: <collect componentTypes="point" prop="coords" name="coords" target="_panel1"/></p>
    <p><m>x</m>-coordinates of points: <aslist><collect componentTypes="point" prop="x" name="xs" target="_graph3"/></aslist></p>
    <p><m>x</m>-coordinates of points via a copy: <aslist><copy name="xs2" target="xs" /></aslist></p>
    <p><m>x</m>-coordinates of points via extract: <aslist><extract prop="x" name="xs3"><copy name="points2" target="points" /></extract></aslist></p>
    <p>Average of <m>y</m>-coordinates of points: <mean name="mean"><collect componentTypes="point" prop="y" name="ys" target="_graph3"/></mean></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let x1 = -3, y1 = 1;
    let x2 = -7, y2 = 5;
    let x3 = 4, y3 = 2;

    let coords1Text = ('(' + x1 + ',' + y1 + ')').replace(/-/g, '−')
    let coords2Text = ('(' + x2 + ',' + y2 + ')').replace(/-/g, '−')
    let coords3Text = ('(' + x3 + ',' + y3 + ')').replace(/-/g, '−')
    let coords2tText = ('(' + y2 + ',' + x2 + ')').replace(/-/g, '−')

    let meany = (y1 + y2 + y1 + y3 + x2) / 5

    cy.get('#\\/_p1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords1Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords2Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords1Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords3Text);
    })
    cy.get('#\\/_p1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(coords2tText);
    })

    cy.get('#\\/_p2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/, '−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x2).replace(/-/, '−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/, '−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x3).replace(/-/, '−'));
    })
    cy.get('#\\/_p2 > span:nth-of-type(6)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(y2).replace(/-/, '−'));
    })

    cy.get('#\\/_p3 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/, '−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x2).replace(/-/, '−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/, '−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x3).replace(/-/, '−'));
    })
    cy.get('#\\/_p3 > span:nth-of-type(6)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(y2).replace(/-/, '−'));
    })


    cy.get('#\\/_p4 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/, '−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x2).replace(/-/, '−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x1).replace(/-/, '−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(x3).replace(/-/, '−'));
    })
    cy.get('#\\/_p4 > span:nth-of-type(6)').find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal(String(y2).replace(/-/, '−'));
    })

    cy.get('#\\/_p5 > span:nth-of-type(2)').find('.mjx-mrow').invoke('text').then((text) => {
      expect(text.trim()).equal(String(meany).replace(/-/, '−'));
    })


    cy.window().then(async (win) => {
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      let stateVariables = await win.returnAllStateVariables1();
      for (let i = 0; i < 5; i++) {
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/coords'].replacements[i].stateValues.value).tree).eqls(["vector", xs[i], ys[i]]);
        expect(stateVariables['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs2'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(stateVariables['/mean'].stateValues.value.tree).eq(meany);

    })

    cy.log("move point 1")
    cy.window().then(async (win) => {
      x1 = -8;
      y1 = 6;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5

      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point1",
        args: { x: x1, y: y1 }
      });

      for (let i = 0; i < 5; i++) {
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/coords'].replacements[i].stateValues.value).tree).eqls(["vector", xs[i], ys[i]]);
        expect(stateVariables['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs2'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(stateVariables['/mean'].stateValues.value.tree).eq(meany);

    })

    cy.log("move point 1 via copy")
    cy.window().then(async (win) => {
      x1 = 2;
      y1 = 0;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5

      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables['/_copy1'].replacements[0].movePoint({ x: x1, y: y1 });

      for (let i = 0; i < 5; i++) {
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/coords'].replacements[i].stateValues.value).tree).eqls(["vector", xs[i], ys[i]]);
        expect(stateVariables['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs2'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(stateVariables['/mean'].stateValues.value.tree).eq(meany);

    })


    cy.log("move point 2")
    cy.window().then(async (win) => {
      x2 = 4;
      y2 = 8;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5

      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point2",
        args: { x: x2, y: y2 }
      });

      for (let i = 0; i < 5; i++) {
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/coords'].replacements[i].stateValues.value).tree).eqls(["vector", xs[i], ys[i]]);
        expect(stateVariables['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs2'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(stateVariables['/mean'].stateValues.value.tree).eq(meany);

    })


    cy.log("move flipped point 2")
    cy.window().then(async (win) => {
      x2 = -1;
      y2 = -3;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5

      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point4",
        args: { x: y2, y: x2 }
      });

      for (let i = 0; i < 5; i++) {
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/coords'].replacements[i].stateValues.value).tree).eqls(["vector", xs[i], ys[i]]);
        expect(stateVariables['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs2'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(stateVariables['/mean'].stateValues.value.tree).eq(meany);

    })

    cy.log("move point 3")
    cy.window().then(async (win) => {
      x3 = -5;
      y3 = 9;
      let xs = [x1, x2, x1, x3, y2];
      let ys = [y1, y2, y1, y3, x2];
      meany = (y1 + y2 + y1 + y3 + x2) / 5

      let stateVariables = await win.returnAllStateVariables1();
      await win.callAction1({
        actionName: "movePoint",
        componentName: "/_point3",
        args: { x: x3, y: y3 }
      });

      for (let i = 0; i < 5; i++) {
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[0].tree).eq(xs[i]);
        expect((stateVariables['/points2'].replacements[i].stateValues.xs)[1].tree).eq(ys[i]);
        expect((stateVariables['/coords'].replacements[i].stateValues.value).tree).eqls(["vector", xs[i], ys[i]]);
        expect(stateVariables['/xs'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs2'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/xs3'].replacements[i].stateValues.value.tree).eq(xs[i]);
        expect(stateVariables['/ys'].replacements[i].stateValues.value.tree).eq(ys[i]);
      }
      expect(stateVariables['/mean'].stateValues.value.tree).eq(meany);

    })
  });

  it('collect dynamic points from graphs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="length" prefill="3"/>
    <mathinput name="mult" prefill="2"/>
    <panel>
    <graph>
      <map>
        <template newNamespace><point>($x, <copy prop="value" target="../mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map>
      <template newNamespace><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
      <sources alias="p"><collect componentTypes="point" target="_map1"/></sources>
    </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" target="_panel1"/>
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" target="_graph3" />
    </aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(3);
      expect(stateVariables['/_collect1'].replacements.length).eq(3);
      expect(stateVariables['/_map2'].replacements.length).eq(3);
      expect(stateVariables['/_collect2'].replacements.length).eq(6);
      expect(stateVariables['/_collect3'].replacements.length).eq(6);

      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_collect2'].replacements[i + 3].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 3].stateValues.xs[1].tree).eq(3 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
        expect(stateVariables['/_collect3'].replacements[i + 3].stateValues.value.tree).eq(3 * x);
      }

    })

    cy.log("increase number of points")
    cy.get('#\\/length textarea').type(`{end}{backspace}5{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(3 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
        expect(stateVariables['/_collect3'].replacements[i + 5].stateValues.value.tree).eq(3 * x);
      }

    })


    cy.log("change multiple")
    cy.get('#\\/mult textarea').type(`{end}{backspace}0.5{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 5].stateValues.value.tree).eq(0.75 * x);
      }

    })


    cy.log("decrease number of points")
    cy.get('#\\/length textarea').type(`{end}{backspace}1{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(1);
      expect(stateVariables['/_collect1'].replacements.length).eq(1);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(1);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect3'].replacements.length).eq(2);

      for (let i = 0; i < 1; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 1].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 1].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 1].stateValues.value.tree).eq(0.75 * x);
      }

    })


    cy.log("increase number of points back to 4")
    cy.get('#\\/length textarea').type(`{end}{backspace}4{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect1'].replacements.length).eq(4);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect2'].replacements.length).eq(8);
      expect(stateVariables['/_collect3'].replacements.length).eq(8);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 4].stateValues.value.tree).eq(0.75 * x);
      }

    })

    cy.log("increase number of points to 6")
    cy.get('#\\/length textarea').type(`{end}{backspace}6{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(6);
      expect(stateVariables['/_collect1'].replacements.length).eq(6);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(6);
      expect(stateVariables['/_collect2'].replacements.length).eq(12);
      expect(stateVariables['/_collect3'].replacements.length).eq(12);

      for (let i = 0; i < 6; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 6].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 6].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 6].stateValues.value.tree).eq(0.75 * x);
      }

    })
  });

  it('collect dynamic points from groups', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="length" prefill="3"/>
    <mathinput name="mult" prefill="2"/>
    <section>
    <group>
      <map>
        <template newNamespace><point>($x, <copy prop="value" target="../mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </group>

    <group>
      <map>
      <template newNamespace><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
      <sources alias="p"><collect componentTypes="point" target="_map1"/></sources>
    </map>

    </group>
    </section>

    <group>
      <collect componentTypes="point" target="_section1"/>
    </group>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" target="_group3" />
    </aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(3);
      expect(stateVariables['/_collect1'].replacements.length).eq(3);
      expect(stateVariables['/_map2'].replacements.length).eq(3);
      expect(stateVariables['/_collect2'].replacements.length).eq(6);
      expect(stateVariables['/_collect3'].replacements.length).eq(6);

      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_collect2'].replacements[i + 3].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 3].stateValues.xs[1].tree).eq(3 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
        expect(stateVariables['/_collect3'].replacements[i + 3].stateValues.value.tree).eq(3 * x);
      }

    })

    cy.log("increase number of points")
    cy.get('#\\/length textarea').type(`{end}{backspace}5{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(3 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
        expect(stateVariables['/_collect3'].replacements[i + 5].stateValues.value.tree).eq(3 * x);
      }

    })


    cy.log("change multiple")
    cy.get('#\\/mult textarea').type(`{end}{backspace}0.5{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 5].stateValues.value.tree).eq(0.75 * x);
      }

    })


    cy.log("decrease number of points")
    cy.get('#\\/length textarea').type(`{end}{backspace}1{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(1);
      expect(stateVariables['/_collect1'].replacements.length).eq(1);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(1);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect3'].replacements.length).eq(2);

      for (let i = 0; i < 1; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 1].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 1].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 1].stateValues.value.tree).eq(0.75 * x);
      }

    })


    cy.log("increase number of points back to 4")
    cy.get('#\\/length textarea').type(`{end}{backspace}4{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect1'].replacements.length).eq(4);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect2'].replacements.length).eq(8);
      expect(stateVariables['/_collect3'].replacements.length).eq(8);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 4].stateValues.value.tree).eq(0.75 * x);
      }

    })

    cy.log("increase number of points to 6")
    cy.get('#\\/length textarea').type(`{end}{backspace}6{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(6);
      expect(stateVariables['/_collect1'].replacements.length).eq(6);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(6);
      expect(stateVariables['/_collect2'].replacements.length).eq(12);
      expect(stateVariables['/_collect3'].replacements.length).eq(12);

      for (let i = 0; i < 6; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 6].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 6].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 6].stateValues.value.tree).eq(0.75 * x);
      }

    })
  });

  // got rid of include hidden and always include hidden
  // rationale: if component becomes unhidden, it's not communicated to collect so it can't grab it after the fact
  it.skip(`default don't include hidden`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="x"><copy prop="endpoint1" target="_linesegment1" /></extract>
    <graph>
      <linesegment>(1,2),(-3,5)</linesegment>
    </graph>

    <graph>
      <collect componentTypes="point" target="_graph1"/>
    </graph>

    <collect componentTypes="point" prop="x" target="_graph1"/>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements.length).eq(0);
      expect(stateVariables['/_collect2'].replacements.length).eq(0);
    })

  })

  it.skip(`dynamically change if include hidden`, () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <extract prop="x"><copy prop="endpoint1" target="_linesegment1" /></extract>
    <p>Include hidden: <booleaninput /></p>
    <graph>
      <linesegment>(1,2),(-3,5)</linesegment>
    </graph>

    <graph>
      <collect componentTypes="point" target="_graph1">
        <includehidden><copy prop="value" target="_booleaninput1" /></includehidden>
      </collect>
    </graph>

    <p>x-coordinates of points: <aslist>
      <collect componentTypes="point" prop="x">
        <includehidden><copy prop="value" target="_booleaninput1" /></includehidden>
        _graph1
      </collect>
    </aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.get('#__math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements.length).eq(0);
      expect(stateVariables['/_collect2'].replacements.length).eq(0);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 1, 2]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", -3, 5]);
    })

    cy.log('include hidden')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements.length).eq(2);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(1);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(2);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(-3);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect2'].replacements[0].stateValues.value.tree).eq(1);
      expect(stateVariables['/_collect2'].replacements[1].stateValues.value.tree).eq(-3);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 1, 2]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", -3, 5]);

    })

    cy.log('move points')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables['/_collect1'].replacements[0].movePoint({ x: 3, y: 9 })
      await stateVariables['/_collect1'].replacements[1].movePoint({ x: -7, y: -6 })
      expect(stateVariables['/_collect1'].replacements.length).eq(2);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(3);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(9);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(-7);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(-6);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect2'].replacements[0].stateValues.value.tree).eq(3);
      expect(stateVariables['/_collect2'].replacements[1].stateValues.value.tree).eq(-7);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 3, 9]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", -7, -6]);

    })

    cy.log(`don't include hidden`)
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements.length).eq(0);
      expect(stateVariables['/_collect2'].replacements.length).eq(0);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 3, 9]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", -7, -6]);
    })


    cy.log('move line segment point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables['/_linesegment1'].moveLineSegment({ point1coords: [0, -8] })
      expect(stateVariables['/_collect1'].replacements.length).eq(0);
      expect(stateVariables['/_collect2'].replacements.length).eq(0);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 0, -8]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", -7, -6]);

    })

    cy.log('include hidden again')
    cy.get('#\\/_booleaninput1_input').click();
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements.length).eq(2);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(0);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(-8);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(-7);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(-6);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect2'].replacements[0].stateValues.value.tree).eq(0);
      expect(stateVariables['/_collect2'].replacements[1].stateValues.value.tree).eq(-7);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 0, -8]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", -7, -6]);

    })

    cy.log('move other line segment point')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables['/_linesegment1'].moveLineSegment({ point2coords: [3, 4] })
      expect(stateVariables['/_collect1'].replacements.length).eq(2);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[0].tree).eq(0);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.xs[1].tree).eq(-8);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[0].tree).eq(3);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.xs[1].tree).eq(4);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect2'].replacements[0].stateValues.value.tree).eq(0);
      expect(stateVariables['/_collect2'].replacements[1].stateValues.value.tree).eq(3);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[0].tree).eqls(["vector", 0, -8]);
      expect(stateVariables['/_linesegment1'].stateValues.endpoints[1].tree).eqls(["vector", 3, 4]);

    })
  })

  it('collect points and vectors from graphs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <panel>
    <graph>
      <point>(-3,1)</point>
      <point>(-7,4)</point>
      <vector tail="$_point1" head="$_point2" />
    </graph>

    <graph>
      <point>
        (<copy prop="y" target="_point1" />,
        <copy prop="x" target="_point1" />)
      </point>
      <point>
        (<copy prop="y" target="_point2" />,
        <copy prop="x" target="_point2" />)
      </point>
      <vector tail="$_point3" head="$_point4" />
    </graph>
    </panel>

    <graph>
      <collect componentTypes="point vector" target="_panel1"/>
    </graph>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    let x1 = -3, y1 = 1;
    let x2 = -7, y2 = 4;


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_point1'].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(stateVariables['/_point2'].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(stateVariables['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(stateVariables['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(stateVariables['/_point3'].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(stateVariables['/_point4'].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(stateVariables['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([y1, x1]);
      expect(stateVariables['/_vector2'].stateValues.head.map(x => x.tree)).eqls([y2, x2]);
      expect(stateVariables['/_collect1'].replacements.length).eq(6);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(stateVariables['/_collect1'].replacements[3].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(stateVariables['/_collect1'].replacements[4].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.tail.map(x => x.tree)).eqls([y1, x1]);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.head.map(x => x.tree)).eqls([y2, x2]);

    })

    cy.log("move vector 1 via copy")
    cy.window().then(async (win) => {
      x1 = -8;
      y1 = 6;
      x2 = 3;
      y2 = 2;

      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables['/_collect1'].replacements[2].moveVector({ tailcoords: [x1, y1], headcoords: [x2, y2] });
      expect(stateVariables['/_point1'].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(stateVariables['/_point2'].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(stateVariables['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(stateVariables['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(stateVariables['/_point3'].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(stateVariables['/_point4'].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(stateVariables['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([y1, x1]);
      expect(stateVariables['/_vector2'].stateValues.head.map(x => x.tree)).eqls([y2, x2]);
      expect(stateVariables['/_collect1'].replacements.length).eq(6);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(stateVariables['/_collect1'].replacements[3].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(stateVariables['/_collect1'].replacements[4].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.tail.map(x => x.tree)).eqls([y1, x1]);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.head.map(x => x.tree)).eqls([y2, x2]);

    })

    cy.log("move vector 2 via copy")
    cy.window().then(async (win) => {
      x1 = 9;
      y1 = 0;
      x2 = -7;
      y2 = 5;

      let stateVariables = await win.returnAllStateVariables1();
      await stateVariables['/_collect1'].replacements[5].moveVector({ tailcoords: [y1, x1], headcoords: [y2, x2] });
      expect(stateVariables['/_point1'].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(stateVariables['/_point2'].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(stateVariables['/_vector1'].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(stateVariables['/_vector1'].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(stateVariables['/_point3'].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(stateVariables['/_point4'].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(stateVariables['/_vector2'].stateValues.tail.map(x => x.tree)).eqls([y1, x1]);
      expect(stateVariables['/_vector2'].stateValues.head.map(x => x.tree)).eqls([y2, x2]);
      expect(stateVariables['/_collect1'].replacements.length).eq(6);
      expect(stateVariables['/_collect1'].replacements[0].stateValues.coords.tree).eqls(["vector", x1, y1]);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.coords.tree).eqls(["vector", x2, y2]);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.tail.map(x => x.tree)).eqls([x1, y1]);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.head.map(x => x.tree)).eqls([x2, y2]);
      expect(stateVariables['/_collect1'].replacements[3].stateValues.coords.tree).eqls(["vector", y1, x1]);
      expect(stateVariables['/_collect1'].replacements[4].stateValues.coords.tree).eqls(["vector", y2, x2]);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.tail.map(x => x.tree)).eqls([y1, x1]);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.head.map(x => x.tree)).eqls([y2, x2]);

    })
  });

  it('maximum number', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput name="length" prefill="5"/>
    <mathinput name="mult" prefill="2"/>
    <mathinput name="maxnumber" prefill="2"/>
    <panel>
    <graph>
      <map>
        <template newNamespace><point>($x, <copy prop="value" target="../mult" />$x)</point></template>
        <sources alias="x"><sequence to="$length" /></sources>
      </map>
      <line>y=x/3</line>
    </graph>

    <graph>
      <map>
      <template newNamespace><point>(<extract prop="x">$p</extract>+1, 1.5*<extract prop="y">$p</extract>)</point></template>
      <sources alias="p"><collect componentTypes="point" target="_map1" maximumnumber="$maxnumber" /></sources>
    </map>

    </graph>
    </panel>

    <graph>
      <collect componentTypes="point" target="_panel1" maximumnumber="2$maxnumber" />
    </graph>

    <p>y-coordinates of points: <aslist>
      <collect componentTypes="point" prop="y" target="_graph3" maximumnumber="$maxnumber" />
    </aslist></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(2);
      expect(stateVariables['/_map2'].replacements.length).eq(2);
      expect(stateVariables['/_collect2'].replacements.length).eq(4);
      expect(stateVariables['/_collect3'].replacements.length).eq(2);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
      }
      for (let i = 0; i < 2; i++) {
        let x = i + 1;
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
      }
      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
      }
      for (let i = 0; i < 2; i++) {
        let x = i + 1;
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
      }

    })


    cy.log("increase maxnumber")
    cy.get('#\\/maxnumber textarea').type(`{end}{backspace}5{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(5);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(3 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
        // expect(stateVariables['/_collect3'].replacements[i+5].stateValues.value.tree).eq(3*x);
      }

    })



    cy.log("increase maxnumber further")
    cy.get('#\\/maxnumber textarea').type(`{end}{backspace}10{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(2 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(3 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(2 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(3 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(2 * x);
        expect(stateVariables['/_collect3'].replacements[i + 5].stateValues.value.tree).eq(3 * x);
      }

    })



    cy.log("change multiple")
    cy.get('#\\/mult textarea').type(`{end}{backspace}0.5{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length).eq(5);
      expect(stateVariables['/_collect1'].replacements.length).eq(5);
      expect(stateVariables['/_map2'].replacements.length).eq(5);
      expect(stateVariables['/_collect2'].replacements.length).eq(10);
      expect(stateVariables['/_collect3'].replacements.length).eq(10);

      for (let i = 0; i < 5; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 5].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 5].stateValues.value.tree).eq(0.75 * x);
      }

    })


    cy.log("decrease number of points")
    cy.get('#\\/length textarea').type(`{end}{backspace}1{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(1);
      expect(stateVariables['/_collect1'].replacements.length).eq(1);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(1);
      expect(stateVariables['/_collect2'].replacements.length).eq(2);
      expect(stateVariables['/_collect3'].replacements.length).eq(2);

      for (let i = 0; i < 1; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 1].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 1].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 1].stateValues.value.tree).eq(0.75 * x);
      }

    })


    cy.log("increase number of points back to 4")
    cy.get('#\\/length textarea').type(`{end}{backspace}4{enter}`, { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect1'].replacements.length).eq(4);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect2'].replacements.length).eq(8);
      expect(stateVariables['/_collect3'].replacements.length).eq(8);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[1].tree).eq(0.75 * x);
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
        expect(stateVariables['/_collect3'].replacements[i + 4].stateValues.value.tree).eq(0.75 * x);
      }

    })

    cy.log("decrease max number to 3")
    cy.get('#\\/maxnumber textarea').type(`{end}{backspace}{backspace}3{enter}`, { force: true });


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_map1'].replacements.length - stateVariables['/_map1'].replacementsToWithhold).eq(4);
      expect(stateVariables['/_collect1'].replacements.length).eq(3);
      expect(stateVariables['/_map2'].replacements.length - stateVariables['/_map2'].replacementsToWithhold).eq(3);
      expect(stateVariables['/_collect2'].replacements.length).eq(6);
      expect(stateVariables['/_collect3'].replacements.length).eq(3);

      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
      }
      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect1'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_map2'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.75 * x);
      }
      for (let i = 0; i < 4; i++) {
        let x = i + 1;
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[0].tree).eq(x);
        expect(stateVariables['/_map1'].replacements[i].replacements[0].stateValues.xs[1].tree).eq(0.5 * x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[0].tree).eq(x);
        expect((stateVariables['/_collect2'].replacements[i].stateValues.xs)[1].tree).eq(0.5 * x);
      }
      for (let i = 0; i < 2; i++) {
        let x = i + 1;
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[0].tree).eq(x + 1);
        expect(stateVariables['/_collect2'].replacements[i + 4].stateValues.xs[1].tree).eq(0.75 * x);
      }
      for (let i = 0; i < 3; i++) {
        let x = i + 1;
        expect(stateVariables['/_collect3'].replacements[i].stateValues.value.tree).eq(0.5 * x);
      }

    })
  });

  // removed functionality of collecting child numbers, at least for now
  it.skip('collect child numbers', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput />

    <math>
      <sequence to="$_mathinput1" />
      <math>a</math>
      <math>b</math>
      <math>c</math>
    </math>
    
    <collect prop="childnumber" componentTypes="math" target="_math1"/>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements[0].stateValues.number).eq(1);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.number).eq(2);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.number).eq(3);
    })

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}3{enter}", { force: true });

    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number9 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number10 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('5')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('6')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements[0].stateValues.number).eq(1);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.number).eq(2);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.number).eq(3);
      expect(stateVariables['/_collect1'].replacements[3].stateValues.number).eq(4);
      expect(stateVariables['/_collect1'].replacements[4].stateValues.number).eq(5);
      expect(stateVariables['/_collect1'].replacements[5].stateValues.number).eq(6);
    })

    cy.get('#\\/_mathinput1 textarea').type("{end}{backspace}1{enter}", { force: true });

    cy.get('#__number8 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })
    cy.get('#__number2 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('2')
    })
    cy.get('#__number3 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })
    cy.get('#__number4 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('4')
    })

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_collect1'].replacements[0].stateValues.number).eq(1);
      expect(stateVariables['/_collect1'].replacements[1].stateValues.number).eq(2);
      expect(stateVariables['/_collect1'].replacements[2].stateValues.number).eq(3);
      expect(stateVariables['/_collect1'].replacements[3].stateValues.number).eq(4);
    })

  });

  it('collect, extract, copy multiple ways', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>

  <p>How many blanks? 
    <mathinput name="n" prefill="1" />
  </p>
 
  <p name="p_original">Enter expressions:
    <map>
      <template>
        <mathinput />
      </template>
      <sources>
        <sequence length="$n" />
      </sources>
    </map>
  </p>
  
  <p name="p_1">Inputs collected then, values extracted: 
  <aslist name="al1"><extract prop="value" name="values1"><collect componentTypes="mathinput" target="p_original"/></extract></aslist></p>

  <p name="p_1a">Copied: <aslist name="al1a"><copy name="values1a" target="values1" /></aslist></p>
  <p name="p_1b">Copy aslist: <copy name="al1b" target="al1" /></p>
  <p name="p_1c">Copy copied: <aslist><copy target="values1a" /></aslist></p>
  <p name="p_1d">Copy aslist containing copy: <copy target="al1a" /></p>
  <p name="p_1e">Copy copied aslist: <copy target="al1b" /></p>

  <p name="p_2">Values collected: 
    <aslist name="al2"><collect prop="value" name="values2" componentTypes="mathinput" target="p_original"/></aslist></p>
    
  <p name="p_2a">Copied: <aslist name="al2a"><copy name="values2a" target="values2" /></aslist></p>
  <p name="p_2b">Copy aslist: <copy name="al2b" target="al2" /></p>
  <p name="p_2c">Copy copied: <aslist><copy target="values2a" /></aslist></p>
  <p name="p_2d">Copy aslist containing copy: <copy target="al2a" /></p>
  <p name="p_2e">Copy copied aslist: <copy target="al2b" /></p>

  <p name="p_3">Inputs collected: <aslist name="al3"><collect name="col" componentTypes="mathinput" target="p_original"/></aslist></p>
  
  <p name="p_3a">Copied: <aslist name="al3a"><copy name="cola" target="col" /></aslist></p>
  <p name="p_3b">Copy aslist: <copy name="al3b" target="al3" /></p>
  <p name="p_3c">Copy copied: <aslist><copy target="cola" /></aslist></p>
  <p name="p_3d">Copy aslist containing copy: <copy target="al3a" /></p>
  <p name="p_3e">Copy copied aslist: <copy target="al3b" /></p>
  
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.get('#\\/p_3e span:nth-of-type(1) textarea').type('x{enter}', { force: true });


    // cy.get('#\\/p_original span:nth-of-type(1) input').should('have.value', 'x');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })

    // cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'x');


    cy.get('#\\/n textarea').type("{end}{backspace}5{enter}", { force: true });

    cy.get('#\\/p_original > span:nth-of-type(2) textarea').type('{end}{backspace}y', { force: true }).blur();
    cy.get('#\\/p_original > span:nth-of-type(3) textarea').type('{end}{backspace}z', { force: true }).blur();
    cy.get('#\\/p_original > span:nth-of-type(4) textarea').type('{end}{backspace}u', { force: true }).blur();
    cy.get('#\\/p_original > span:nth-of-type(5) textarea').type('{end}{backspace}v', { force: true }).blur();


    // cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'x');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })

    // cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'x');


    // cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'y');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })

    // cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'y');


    // cy.get('#\\/p_original > span:nth-of-type(3) input').should('have.value', 'z');

    cy.get('#\\/p_1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })

    cy.get('#\\/p_2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })

    // cy.get('#\\/p_3 > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3a > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3b > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3c > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3d > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3e > span:nth-of-type(3) input').should('have.value', 'z');


    // cy.get('#\\/p_original > span:nth-of-type(4) input').should('have.value', 'u');

    cy.get('#\\/p_1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })

    cy.get('#\\/p_2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })

    // cy.get('#\\/p_3 > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3a > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3b > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3c > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3d > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3e > span:nth-of-type(4) input').should('have.value', 'u');


    // cy.get('#\\/p_original > span:nth-of-type(5) input').should('have.value', 'v');

    cy.get('#\\/p_1 > span:nth-of-type(5) .mjx-mrow').should('contain.text', 'v')
    cy.get('#\\/p_1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })

    cy.get('#\\/p_2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })

    // cy.get('#\\/p_3 > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3a > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3b > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3c > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3d > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3e > span:nth-of-type(5) input').should('have.value', 'v');




    cy.get('#\\/n textarea').type("{end}{backspace}0{enter}", { force: true });

    cy.get('#\\/n textarea').type("{end}{backspace}2{enter}", { force: true });


    // cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'x');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('x') })

    // cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'x');
    // cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'x');


    // cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'y');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('y') })

    // cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'y');
    // cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'y');



    cy.get('#\\/p_3 > span:nth-of-type(1) textarea').type('{end}{backspace}a{enter}', { force: true });
    cy.get('#\\/p_3a > span:nth-of-type(2) textarea').type('{end}{backspace}b{enter}', { force: true });


    // cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'a');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })

    // cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'a');


    // cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })

    // cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'b');



    cy.get('#\\/n textarea').type("{end}{backspace}5{enter}", { force: true });


    // cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'a');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })

    // cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'a');


    // cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })

    // cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'b');


    // cy.get('#\\/p_original > span:nth-of-type(3) input').should('have.value', 'z');

    cy.get('#\\/p_1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_1e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })

    cy.get('#\\/p_2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })
    cy.get('#\\/p_2e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('z') })

    // cy.get('#\\/p_3 > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3a > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3b > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3c > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3d > span:nth-of-type(3) input').should('have.value', 'z');
    // cy.get('#\\/p_3e > span:nth-of-type(3) input').should('have.value', 'z');


    // cy.get('#\\/p_original > span:nth-of-type(4) input').should('have.value', 'u');

    cy.get('#\\/p_1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_1e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })

    cy.get('#\\/p_2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })
    cy.get('#\\/p_2e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('u') })

    // cy.get('#\\/p_3 > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3a > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3b > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3c > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3d > span:nth-of-type(4) input').should('have.value', 'u');
    // cy.get('#\\/p_3e > span:nth-of-type(4) input').should('have.value', 'u');


    // cy.get('#\\/p_original > span:nth-of-type(5) input').should('have.value', 'v');

    cy.get('#\\/p_1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_1e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })

    cy.get('#\\/p_2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })
    cy.get('#\\/p_2e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('v') })

    // cy.get('#\\/p_3 > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3a > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3b > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3c > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3d > span:nth-of-type(5) input').should('have.value', 'v');
    // cy.get('#\\/p_3e > span:nth-of-type(5) input').should('have.value', 'v');



    cy.get('#\\/p_3b > span:nth-of-type(3) textarea').type('{end}{backspace}c{enter}', { force: true });
    cy.get('#\\/p_3c > span:nth-of-type(4) textarea').type('{end}{backspace}d{enter}', { force: true });
    cy.get('#\\/p_3d > span:nth-of-type(5) textarea').type('{end}{backspace}e{enter}', { force: true });


    // cy.get('#\\/p_original > span:nth-of-type(1) input').should('have.value', 'a');

    cy.get('#\\/p_1 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_1e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })

    cy.get('#\\/p_2 > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2a > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2b > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2c > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2d > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })
    cy.get('#\\/p_2e > span:nth-of-type(1)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('a') })

    // cy.get('#\\/p_3 > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3a > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3b > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3c > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3d > span:nth-of-type(1) input').should('have.value', 'a');
    // cy.get('#\\/p_3e > span:nth-of-type(1) input').should('have.value', 'a');


    // cy.get('#\\/p_original > span:nth-of-type(2) input').should('have.value', 'b');

    cy.get('#\\/p_1 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_1e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })

    cy.get('#\\/p_2 > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2a > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2b > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2c > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2d > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })
    cy.get('#\\/p_2e > span:nth-of-type(2)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('b') })

    // cy.get('#\\/p_3 > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3a > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3b > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3c > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3d > span:nth-of-type(2) input').should('have.value', 'b');
    // cy.get('#\\/p_3e > span:nth-of-type(2) input').should('have.value', 'b');


    // cy.get('#\\/p_original > span:nth-of-type(3) input').should('have.value', 'c');

    cy.get('#\\/p_1 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_1a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_1b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_1c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_1d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_1e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })

    cy.get('#\\/p_2 > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_2a > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_2b > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_2c > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_2d > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })
    cy.get('#\\/p_2e > span:nth-of-type(3)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('c') })

    // cy.get('#\\/p_3 > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get('#\\/p_3a > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get('#\\/p_3b > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get('#\\/p_3c > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get('#\\/p_3d > span:nth-of-type(3) input').should('have.value', 'c');
    // cy.get('#\\/p_3e > span:nth-of-type(3) input').should('have.value', 'c');


    // cy.get('#\\/p_original > span:nth-of-type(4) input').should('have.value', 'd');

    cy.get('#\\/p_1 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_1a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_1b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_1c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_1d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_1e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })

    cy.get('#\\/p_2 > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_2a > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_2b > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_2c > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_2d > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })
    cy.get('#\\/p_2e > span:nth-of-type(4)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('d') })

    // cy.get('#\\/p_3 > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get('#\\/p_3a > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get('#\\/p_3b > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get('#\\/p_3c > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get('#\\/p_3d > span:nth-of-type(4) input').should('have.value', 'd');
    // cy.get('#\\/p_3e > span:nth-of-type(4) input').should('have.value', 'd');


    // cy.get('#\\/p_original > span:nth-of-type(5) input').should('have.value', 'e');

    cy.get('#\\/p_1 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_1a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_1b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_1c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_1d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_1e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })

    cy.get('#\\/p_2 > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_2a > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_2b > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_2c > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_2d > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })
    cy.get('#\\/p_2e > span:nth-of-type(5)').find('.mjx-mrow').eq(0).invoke('text').then((text) => { expect(text.trim()).equal('e') })

    // cy.get('#\\/p_3 > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get('#\\/p_3a > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get('#\\/p_3b > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get('#\\/p_3c > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get('#\\/p_3d > span:nth-of-type(5) input').should('have.value', 'e');
    // cy.get('#\\/p_3e > span:nth-of-type(5) input').should('have.value', 'e');



  });

  // main point: when use macro on collection (but not group)
  // inputs turn into their values
  it('test macros by collecting inputs and others', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <group>
      <mathinput name="a" prefill="x" />
      <textinput name="b" prefill="hello" />
      <booleaninput name="c" />
      <math>2$a</math>
      <text>$b there</text>
      <boolean>not $c</boolean>
    </group>

    <p><collect target="_group1" componentTypes="_input math text boolean" /></p>
    <p>$_collect1</p>
    <p>$_group1</p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a'); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let collect2 = stateVariables["/_p2"].definingChildren[0];
      let group2 = stateVariables["/_p3"].definingChildren[0];

      let group2reps = (await group2.stateValues.fullRecursiveReplacements)
        .map(x => stateVariables[x.componentName]);

      expect(stateVariables['/_group1'].replacements.length).eq(13);
      expect(stateVariables['/_collect1'].replacements.length).eq(6);
      expect(collect2.replacements.length).eq(6);
      expect(group2.replacements.length).eq(1);
      expect(group2reps.length).eq(13);

      expect(stateVariables['/_group1'].replacements[1].componentType).eq("mathInput");
      expect(stateVariables['/_group1'].replacements[1].stateValues.value.tree).eq('x');
      expect(stateVariables['/_collect1'].replacements[0].componentType).eq("mathInput");
      expect(stateVariables['/_collect1'].replacements[0].stateValues.value.tree).eq('x');
      expect(collect2.replacements[0].componentType).eq("math");
      expect(collect2.replacements[0].stateValues.value.tree).eq('x');
      expect(group2reps[1].componentType).eq("mathInput");
      expect(group2reps[1].stateValues.value.tree).eq('x');

      expect(stateVariables['/_group1'].replacements[3].componentType).eq("textInput");
      expect(stateVariables['/_group1'].replacements[3].stateValues.value).eq('hello');
      expect(stateVariables['/_collect1'].replacements[1].componentType).eq("textInput");
      expect(stateVariables['/_collect1'].replacements[1].stateValues.value).eq('hello');
      expect(collect2.replacements[1].componentType).eq("text");
      expect(collect2.replacements[1].stateValues.value).eq('hello');
      expect(group2reps[3].componentType).eq("textInput");
      expect(group2reps[3].stateValues.value).eq('hello');

      expect(stateVariables['/_group1'].replacements[5].componentType).eq("booleanInput");
      expect(stateVariables['/_group1'].replacements[5].stateValues.value).eq(false);
      expect(stateVariables['/_collect1'].replacements[2].componentType).eq("booleanInput");
      expect(stateVariables['/_collect1'].replacements[2].stateValues.value).eq(false);
      expect(collect2.replacements[2].componentType).eq("boolean");
      expect(collect2.replacements[2].stateValues.value).eq(false);
      expect(group2reps[5].componentType).eq("booleanInput");
      expect(group2reps[5].stateValues.value).eq(false);

      expect(stateVariables['/_group1'].replacements[7].componentType).eq("math");
      expect(stateVariables['/_group1'].replacements[7].stateValues.value.tree).eqls(["*", 2, "x"]);
      expect(stateVariables['/_collect1'].replacements[3].componentType).eq("math");
      expect(stateVariables['/_collect1'].replacements[3].stateValues.value.tree).eqls(["*", 2, "x"]);
      expect(collect2.replacements[3].componentType).eq("math");
      expect(collect2.replacements[3].stateValues.value.tree).eqls(["*", 2, "x"]);
      expect(group2reps[7].componentType).eq("math");
      expect(group2reps[7].stateValues.value.tree).eqls(["*", 2, "x"]);

      expect(stateVariables['/_group1'].replacements[9].componentType).eq("text");
      expect(stateVariables['/_group1'].replacements[9].stateValues.value).eq('hello there');
      expect(stateVariables['/_collect1'].replacements[4].componentType).eq("text");
      expect(stateVariables['/_collect1'].replacements[4].stateValues.value).eq('hello there');
      expect(collect2.replacements[4].componentType).eq("text");
      expect(collect2.replacements[4].stateValues.value).eq('hello there');
      expect(group2reps[9].componentType).eq("text");
      expect(group2reps[9].stateValues.value).eq('hello there');

      expect(stateVariables['/_group1'].replacements[11].componentType).eq("boolean");
      expect(stateVariables['/_group1'].replacements[11].stateValues.value).eq(true);
      expect(stateVariables['/_collect1'].replacements[5].componentType).eq("boolean");
      expect(stateVariables['/_collect1'].replacements[5].stateValues.value).eq(true);
      expect(collect2.replacements[5].componentType).eq("boolean");
      expect(collect2.replacements[5].stateValues.value).eq(true);
      expect(group2reps[11].componentType).eq("boolean");
      expect(group2reps[11].stateValues.value).eq(true);

    })

  });

  it('collect does not ignore hide by default', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <section>
      <text hide>secret</text>
      <text>public</text>
    </section>
    <p>Hidden by default: <collect componentTypes="text" target="_section1" /></p>
    <p>Force to reveal: <collect componentTypes="text" target="_section1" targetAttributesToIgnore="hide" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.get('#\\/_section1').should('contain.text', 'public');
    cy.get('#\\/_section1').should('not.contain.text', 'secret');

    cy.get('#\\/_p1').should('have.text', 'Hidden by default: public');
    cy.get('#\\/_p2').should('have.text', 'Force to reveal: secretpublic');


  });

  it('collect keeps hidden children hidden', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <section>
      <p name="theP1" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
      <copy target="theP1" assignNames="theP2" />
      <p hide name="theP3" newNamespace>Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      <copy target="theP3" assignNames="theP4" />
    </section>
    <collect componentTypes="p" target="_section1" assignNames="cp1 cp2 cp3 cp4" />
    <collect componentTypes="p" target="_section1" targetAttributesToIgnore="hide" assignNames="cp5 cp6 cp7 cp8" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.get('#\\/theP1').should('have.text', 'Hidden text: ')
    cy.get('#\\/theP2').should('have.text', 'Hidden text: ')
    cy.get('#\\/theP3').should('not.exist')
    cy.get('#\\/theP4').should('have.text', 'Hidden paragraph with hidden text: ')
    cy.get('#\\/cp1').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp2').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp3').should('not.exist')
    cy.get('#\\/cp4').should('have.text', 'Hidden paragraph with hidden text: ')
    cy.get('#\\/cp5').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp6').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp7').should('have.text', 'Hidden paragraph with hidden text: ')
    cy.get('#\\/cp8').should('have.text', 'Hidden paragraph with hidden text: ')

  });

  it('collecting from within a hidden section', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <section hide>
      <p name="theP1" newNamespace>Hidden text: <text name="hidden" hide>secret</text></p>
      <copy target="theP1" assignNames="theP2" />
      <p hide name="theP3" newNamespace>Hidden paragraph with hidden text: <text name="hidden" hide>top secret</text></p>
      <copy target="theP3" assignNames="theP4" />
    </section>
    <collect componentTypes="p" target="_section1" assignNames="cp1 cp2 cp3 cp4" />
    <collect componentTypes="p" target="_section1" targetAttributesToIgnore="hide" assignNames="cp5 cp6 cp7 cp8" />
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.get('#\\/theP1').should('not.exist')
    cy.get('#\\/theP2').should('not.exist')
    cy.get('#\\/theP3').should('not.exist')
    cy.get('#\\/theP4').should('not.exist')
    cy.get('#\\/cp1').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp2').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp3').should('not.exist')
    cy.get('#\\/cp4').should('have.text', 'Hidden paragraph with hidden text: ')
    cy.get('#\\/cp5').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp6').should('have.text', 'Hidden text: ')
    cy.get('#\\/cp7').should('have.text', 'Hidden paragraph with hidden text: ')
    cy.get('#\\/cp8').should('have.text', 'Hidden paragraph with hidden text: ')

  });

  it('copies hide dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
      <map>
        <template><text>Hello, $l! </text></template>
        <sources alias="l"><sequence type="letters" from="a" length="$n" /></sources>
      </map>
    </p>

    <booleaninput name='h1' prefill="false" label="Hide first collect" />
    <booleaninput name='h2' prefill="true" label="Hide second collect" />
    <p>Number of points <mathinput name="n" prefill="4" /></p>

    <p name="c1">collect 1: <collect hide="$h1" componentTypes="text" target="_p1" /></p>
    <p name="c2">collect 2: <collect hide="$h2" componentTypes="text" prop="value" target="_p1" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/c1').should('have.text', 'collect 1: Hello, a! Hello, b! Hello, c! Hello, d! ')
    cy.get('#\\/c2').should('have.text', 'collect 2: ')

    cy.get('#\\/n textarea').type("{end}{backspace}6{enter}", { force: true })

    cy.get('#\\/c1').should('have.text', 'collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ')
    cy.get('#\\/c2').should('have.text', 'collect 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'collect 1: ')
    cy.get('#\\/c2').should('have.text', 'collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! ')

    cy.get('#\\/n textarea').type("{end}{backspace}8{enter}", { force: true })

    cy.get('#\\/c1').should('have.text', 'collect 1: ')
    cy.get('#\\/c2').should('have.text', 'collect 2: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'collect 1: Hello, a! Hello, b! Hello, c! Hello, d! Hello, e! Hello, f! Hello, g! Hello, h! ')
    cy.get('#\\/c2').should('have.text', 'collect 2: ')

    cy.get('#\\/n textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/c1').should('have.text', 'collect 1: Hello, a! Hello, b! Hello, c! ')
    cy.get('#\\/c2').should('have.text', 'collect 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/c1').should('have.text', 'collect 1: ')
    cy.get('#\\/c2').should('have.text', 'collect 2: Hello, a! Hello, b! Hello, c! ')

    cy.get('#\\/n textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/c1').should('have.text', 'collect 1: ')
    cy.get('#\\/c2').should('have.text', 'collect 2: Hello, a! Hello, b! Hello, c! Hello, d! ')


  })

  it('allChildrenOrdered consistent with dynamic collect and adapters', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <mathinput prefill="2" name='n' />

    <p>
      begin
      <point name="A">(1,2)</point>
      <map>
        <template><point>($x, $i)</point></template>
        <sources alias="x" indexAlias="i"><sequence length="$n" /></sources>
      </map>
      <point name="B">(3,4)</point>
      end
    </p>
    
    <p>Hello <collect componentTypes="point" target="_p1" /> there</p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    function checkAllChildren(components) {
      let p1AllChildren = [];
      p1AllChildren.push("/A");
      p1AllChildren.push(stateVariables["/A"].adapterUsed.componentName);
      p1AllChildren.push("/_map1");

      let map = stateVariables['/_map1'];

      let nActiveReps = map.replacements.length;
      if(map.replacementsToWithhold) {
        nActiveReps -= stateVariables["/_map1"].replacementsToWithhold 
      }
      for (let template of map.replacements.slice(0, nActiveReps)) {
        p1AllChildren.push(template.componentName);
        let point = template.replacements[0];
        p1AllChildren.push(point.componentName);
        p1AllChildren.push(point.adapterUsed.componentName);
      }
      p1AllChildren.push("/B");
      p1AllChildren.push(stateVariables["/B"].adapterUsed.componentName);

      expect(stateVariables['/_p1'].allChildrenOrdered).eqls(p1AllChildren)

      let p2AllChildren = [];
      p2AllChildren.push("/_collect1");
      let collect = stateVariables['/_collect1'];
      nActiveReps = collect.replacements.length;
      if(collect.replacementsToWithhold) {
        nActiveReps -= stateVariables["/_collect1"].replacementsToWithhold 
      }
      for (let rep of collect.replacements.slice(0, nActiveReps)) {
        p2AllChildren.push(rep.componentName);
        p2AllChildren.push(rep.adapterUsed.componentName);
      }

      expect(stateVariables['/_p2'].allChildrenOrdered).eqls(p2AllChildren)

    }

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(components);
    });

    cy.get('#\\/n textarea').type('{end}{backspace}4{enter}', { force: true })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(components);
    });


    cy.get('#\\/n textarea').type('{end}{backspace}0{enter}', { force: true })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(components);
    });

    cy.get('#\\/n textarea').type('{end}{backspace}3{enter}', { force: true })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(components);
    });

    cy.get('#\\/n textarea').type('{end}{backspace}1{enter}', { force: true })
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      checkAllChildren(components);
    });

  })

  it('overwrite attributes using collect', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>Collected points are fixed: <booleaninput name="fixed" /></p>

    <graph name="g1">
      <point name="A">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    
    <graph name="g2">
      <collect componentTypes="point" target="g1" fixed="$fixed" assignNames="A2 B2" />
    </graph>
    
    <copy target="g2" assignNames="g3" />

    <aslist name="al"><collect componentTypes="point" prop="x" target="g1" fixed="$fixed" assignNames="Ax Bx" /></aslist>

    <copy target="al" assignNames="al2" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let A3 = stateVariables["/g3"].activeChildren[0];
      let B3 = stateVariables["/g3"].activeChildren[1];

      let Ax2 = stateVariables["/al2"].activeChildren[0];
      let Bx2 = stateVariables["/al2"].activeChildren[1];

      expect(stateVariables['/A'].stateValues.fixed).eq(false);
      expect(stateVariables['/B'].stateValues.fixed).eq(false);
      expect(stateVariables['/A2'].stateValues.fixed).eq(false);
      expect(stateVariables['/B2'].stateValues.fixed).eq(false);
      expect(A3.stateValues.fixed).eq(false);
      expect(B3.stateValues.fixed).eq(false);
      expect(stateVariables['/Ax'].stateValues.fixed).eq(false);
      expect(stateVariables['/Bx'].stateValues.fixed).eq(false);
      expect(Ax2.stateValues.fixed).eq(false);
      expect(Bx2.stateValues.fixed).eq(false);

      cy.get('#\\/fixed_input').click().then(() => {

        expect(stateVariables['/A'].stateValues.fixed).eq(false);
        expect(stateVariables['/B'].stateValues.fixed).eq(false);
        expect(stateVariables['/A2'].stateValues.fixed).eq(true);
        expect(stateVariables['/B2'].stateValues.fixed).eq(true);
        expect(A3.stateValues.fixed).eq(true);
        expect(B3.stateValues.fixed).eq(true);
        expect(stateVariables['/Ax'].stateValues.fixed).eq(true);
        expect(stateVariables['/Bx'].stateValues.fixed).eq(true);
        expect(Ax2.stateValues.fixed).eq(true);
        expect(Bx2.stateValues.fixed).eq(true);
      });


      cy.get('#\\/fixed_input').click().then(() => {

        expect(stateVariables['/A'].stateValues.fixed).eq(false);
        expect(stateVariables['/B'].stateValues.fixed).eq(false);
        expect(stateVariables['/A2'].stateValues.fixed).eq(false);
        expect(stateVariables['/B2'].stateValues.fixed).eq(false);
        expect(A3.stateValues.fixed).eq(false);
        expect(B3.stateValues.fixed).eq(false);
        expect(stateVariables['/Ax'].stateValues.fixed).eq(false);
        expect(stateVariables['/Bx'].stateValues.fixed).eq(false);
        expect(Ax2.stateValues.fixed).eq(false);
        expect(Bx2.stateValues.fixed).eq(false);
      });


    });
    

  })


});
