import cssesc from 'cssesc';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Map Tag Tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('single map of maths', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <map>
      <template><math>sin(2$x) + $i</math></template>
      <sources alias="x" indexAlias="i">
        <math>x</math>
        <math>y</math>
      </sources>
    </map>
    </aslist>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements;
      let mathr1 = replacements[0].replacements[0];
      let mathr1Anchor = '#' + mathr1.componentName;
      let mathr2 = replacements[1].replacements[0];
      let mathr2Anchor = '#' + mathr2.componentName;

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(mathr1Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2x)+1');
      });
      cy.get(`${cesc(mathr2Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2y)+2');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(() => {
        expect(mathr1.stateValues.value.tree).eqls(['+', ['apply', 'sin', ['*', 2, 'x']], 1]);
        expect(mathr2.stateValues.value.tree).eqls(['+', ['apply', 'sin', ['*', 2, 'y']], 2]);
      })
    })
  });

  it('single map of texts', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map >
      <template><text>You are a $animal!</text> </template>
      <sources alias="animal"><text>squirrel</text><text>bat</text></sources>
    </map>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements;
      let textr1 = replacements[0].replacements[0];
      let textr1Anchor = '#' + textr1.componentName;
      let textr2 = replacements[1].replacements[0];
      let textr2Anchor = '#' + textr2.componentName;

      cy.log('Test values displayed in browser')
      cy.get(cesc(textr1Anchor)).should('have.text', "You are a squirrel!");
      cy.get(cesc(textr2Anchor)).should('have.text', "You are a bat!");

      cy.log('Test internal values are set to the correct values')
      cy.window().then(() => {
        expect(textr1.stateValues.value).eq("You are a squirrel!");
        expect(textr2.stateValues.value).eq("You are a bat!");
      })
    })
  });

  it('single map of sequence', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
      <template><math simplify>$n^2</math> </template>
      <sources alias="n"><sequence from="1" to="5"/></sources>
    </map>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements;
      let mathrs = replacements.map(x => x.replacements[0]);
      let mathrAnchors = mathrs.map(x => '#' + x.componentName);

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(mathrAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get(`${cesc(mathrAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4');
      });
      cy.get(`${cesc(mathrAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('9');
      });
      cy.get(`${cesc(mathrAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('16');
      });
      cy.get(`${cesc(mathrAnchors[4])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('25');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(() => {
        expect(mathrs[0].stateValues.value.tree).eq(1);
        expect(mathrs[1].stateValues.value.tree).eq(4);
        expect(mathrs[2].stateValues.value.tree).eq(9);
        expect(mathrs[3].stateValues.value.tree).eq(16);
        expect(mathrs[4].stateValues.value.tree).eq(25);
      })
    })
  });

  it('triple parallel map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <map behavior="parallel">
      <template><math>($l, $m, $n)</math><math>($i, $j, $k)</math></template>
      <sources alias="l" indexalias="i"><sequence from="1" to="5"/></sources>
      <sources alias="m" indexalias="j"><sequence from="21" to="23"/></sources>
      <sources alias="n" indexalias="k"><sequence from="-5" to="-21" step="-3"/></sources>
    </map>
    </aslist>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements;
      let mathrs = replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let mathrAnchors = mathrs.map(x => '#' + x.componentName);

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(mathrAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,21,−5)');
      });
      cy.get(`${cesc(mathrAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1,1)');
      });
      cy.get(`${cesc(mathrAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,22,−8)');
      });
      cy.get(`${cesc(mathrAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,2,2)');
      });
      cy.get(`${cesc(mathrAnchors[4])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,23,−11)');
      });
      cy.get(`${cesc(mathrAnchors[5])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,3,3)');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(() => {
        expect(mathrs[0].stateValues.value.tree).eqls(["tuple", 1, 21, -5]);
        expect(mathrs[1].stateValues.value.tree).eqls(["tuple", 1, 1, 1]);
        expect(mathrs[2].stateValues.value.tree).eqls(["tuple", 2, 22, -8]);
        expect(mathrs[3].stateValues.value.tree).eqls(["tuple", 2, 2, 2]);
        expect(mathrs[4].stateValues.value.tree).eqls(["tuple", 3, 23, -11]);
        expect(mathrs[5].stateValues.value.tree).eqls(["tuple", 3, 3, 3]);
      })
    })
  });

  it('triple combination map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map behavior="combination">
      <template><math>($l, $m, $n)</math><math>($i, $j, $k)</math></template>
      <sources alias="l" indexalias="i"><sequence from="1" to="3"/></sources>
      <sources alias="m" indexalias="j"><sequence from="21" to="23" step="2"/></sources>
      <sources alias="n" indexalias="k"><sequence from="-5" to="-8" step="-3"/></sources>
    </map>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements;
      let mathrs = replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let mathrAnchors = mathrs.map(x => '#' + x.componentName);

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(mathrAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,21,−5)');
      });
      cy.get(`${cesc(mathrAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1,1)');
      });
      cy.get(`${cesc(mathrAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,21,−8)');
      });
      cy.get(`${cesc(mathrAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1,2)');
      });
      cy.get(`${cesc(mathrAnchors[4])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,23,−5)');
      });
      cy.get(`${cesc(mathrAnchors[5])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,1)');
      });
      cy.get(`${cesc(mathrAnchors[6])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,23,−8)');
      });
      cy.get(`${cesc(mathrAnchors[7])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2,2)');
      });
      cy.get(`${cesc(mathrAnchors[8])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,21,−5)');
      });
      cy.get(`${cesc(mathrAnchors[9])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1,1)');
      });
      cy.get(`${cesc(mathrAnchors[10])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,21,−8)');
      });
      cy.get(`${cesc(mathrAnchors[11])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,1,2)');
      });
      cy.get(`${cesc(mathrAnchors[12])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,23,−5)');
      });
      cy.get(`${cesc(mathrAnchors[13])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,2,1)');
      });
      cy.get(`${cesc(mathrAnchors[14])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,23,−8)');
      });
      cy.get(`${cesc(mathrAnchors[15])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,2,2)');
      });
      cy.get(`${cesc(mathrAnchors[16])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,21,−5)');
      });
      cy.get(`${cesc(mathrAnchors[17])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,1,1)');
      });
      cy.get(`${cesc(mathrAnchors[18])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,21,−8)');
      });
      cy.get(`${cesc(mathrAnchors[19])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,1,2)');
      });
      cy.get(`${cesc(mathrAnchors[20])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,23,−5)');
      });
      cy.get(`${cesc(mathrAnchors[21])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2,1)');
      });
      cy.get(`${cesc(mathrAnchors[22])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,23,−8)');
      });
      cy.get(`${cesc(mathrAnchors[23])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,2,2)');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(() => {
        expect(mathrs[0].stateValues.value.tree).eqls(["tuple", 1, 21, -5]);
        expect(mathrs[1].stateValues.value.tree).eqls(["tuple", 1, 1, 1]);
        expect(mathrs[2].stateValues.value.tree).eqls(["tuple", 1, 21, -8]);
        expect(mathrs[3].stateValues.value.tree).eqls(["tuple", 1, 1, 2]);
        expect(mathrs[4].stateValues.value.tree).eqls(["tuple", 1, 23, -5]);
        expect(mathrs[5].stateValues.value.tree).eqls(["tuple", 1, 2, 1]);
        expect(mathrs[6].stateValues.value.tree).eqls(["tuple", 1, 23, -8]);
        expect(mathrs[7].stateValues.value.tree).eqls(["tuple", 1, 2, 2]);
        expect(mathrs[8].stateValues.value.tree).eqls(["tuple", 2, 21, -5]);
        expect(mathrs[9].stateValues.value.tree).eqls(["tuple", 2, 1, 1]);
        expect(mathrs[10].stateValues.value.tree).eqls(["tuple", 2, 21, -8]);
        expect(mathrs[11].stateValues.value.tree).eqls(["tuple", 2, 1, 2]);
        expect(mathrs[12].stateValues.value.tree).eqls(["tuple", 2, 23, -5]);
        expect(mathrs[13].stateValues.value.tree).eqls(["tuple", 2, 2, 1]);
        expect(mathrs[14].stateValues.value.tree).eqls(["tuple", 2, 23, -8]);
        expect(mathrs[15].stateValues.value.tree).eqls(["tuple", 2, 2, 2]);
        expect(mathrs[16].stateValues.value.tree).eqls(["tuple", 3, 21, -5]);
        expect(mathrs[17].stateValues.value.tree).eqls(["tuple", 3, 1, 1]);
        expect(mathrs[18].stateValues.value.tree).eqls(["tuple", 3, 21, -8]);
        expect(mathrs[19].stateValues.value.tree).eqls(["tuple", 3, 1, 2]);
        expect(mathrs[20].stateValues.value.tree).eqls(["tuple", 3, 23, -5]);
        expect(mathrs[21].stateValues.value.tree).eqls(["tuple", 3, 2, 1]);
        expect(mathrs[22].stateValues.value.tree).eqls(["tuple", 3, 23, -8]);
        expect(mathrs[23].stateValues.value.tree).eqls(["tuple", 3, 2, 2]);
      })
    });
  });

  it('two nested maps', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <map>
      <template><map>
          <template><math simplify>$m+$n</math><math simplify>$i+2$j</math></template>
          <sources alias="m" indexalias="i"><sequence from="1" to="2"/></sources>
        </map></template>
      <sources alias="n" indexalias="j"><number>-10</number><number>5</number></sources>
    </map>
    </aslist>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements;
      let mathrs = replacements.reduce(
        (a, c) => [
          ...a,
          ...c.replacements[0].replacements.reduce((a1, c1) => [...a1, ...c1.replacements], [])
        ], []
      );
      let mathrAnchors = mathrs.map(x => '#' + x.componentName);

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(mathrAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−9');
      });
      cy.get(`${cesc(mathrAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('3');
      });
      cy.get(`${cesc(mathrAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('−8');
      });
      cy.get(`${cesc(mathrAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('4');
      });
      cy.get(`${cesc(mathrAnchors[4])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6');
      });
      cy.get(`${cesc(mathrAnchors[5])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('5');
      });
      cy.get(`${cesc(mathrAnchors[6])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('7');
      });
      cy.get(`${cesc(mathrAnchors[7])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('6');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(() => {
        expect(mathrs[0].stateValues.value.tree).eq(-9);
        expect(mathrs[1].stateValues.value.tree).eq(3);
        expect(mathrs[2].stateValues.value.tree).eq(-8);
        expect(mathrs[3].stateValues.value.tree).eq(4);
        expect(mathrs[4].stateValues.value.tree).eq(6);
        expect(mathrs[5].stateValues.value.tree).eq(5);
        expect(mathrs[6].stateValues.value.tree).eq(7);
        expect(mathrs[7].stateValues.value.tree).eq(6);
      })
    })
  });

  it('three nested maps with graphs and copied', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
    <template><graph>
        <map>
          <template><map>
              <template><point>($l+$n, $m)</point><point>($i+2*$k, $j)</point></template>
              <sources alias="l" indexalias="i"><sequence from="1" to="2"/></sources>
            </map></template>
          <sources alias="m" indexalias="j"><sequence from="-5" to="5" step="10"/></sources>
        </map>
      </graph></template>
    <sources alias="n" indexalias="k"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    <copy name="mapcopy" target="_map1" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load

    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let graphs = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
      let graphsChildren = graphs.map(x => x.activeChildren);
      let graphs2 = stateVariables['/mapcopy'].replacements.map(x => x.replacements[0]);
      let graphs2Children = graphs2.map(x => x.activeChildren);

      expect(graphs[0].stateValues.graphicalDescendants.length).eq(8);
      expect(graphs[1].stateValues.graphicalDescendants.length).eq(8);
      expect(graphs2[0].stateValues.graphicalDescendants.length).eq(8);
      expect(graphs2[1].stateValues.graphicalDescendants.length).eq(8);

      expect(graphsChildren[0][0].stateValues.xs[0].tree).eq(-9);
      expect(graphsChildren[0][0].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[0][1].stateValues.xs[0].tree).eq(3);
      expect(graphsChildren[0][1].stateValues.xs[1].tree).eq(1);
      expect(graphsChildren[0][2].stateValues.xs[0].tree).eq(-8);
      expect(graphsChildren[0][2].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[0][3].stateValues.xs[0].tree).eq(4);
      expect(graphsChildren[0][3].stateValues.xs[1].tree).eq(1);
      expect(graphsChildren[0][4].stateValues.xs[0].tree).eq(-9);
      expect(graphsChildren[0][4].stateValues.xs[1].tree).eq(5);
      expect(graphsChildren[0][5].stateValues.xs[0].tree).eq(3);
      expect(graphsChildren[0][5].stateValues.xs[1].tree).eq(2);
      expect(graphsChildren[0][6].stateValues.xs[0].tree).eq(-8);
      expect(graphsChildren[0][6].stateValues.xs[1].tree).eq(5);
      expect(graphsChildren[0][7].stateValues.xs[0].tree).eq(4);
      expect(graphsChildren[0][7].stateValues.xs[1].tree).eq(2);

      expect(graphsChildren[1][0].stateValues.xs[0].tree).eq(6);
      expect(graphsChildren[1][0].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[1][1].stateValues.xs[0].tree).eq(5);
      expect(graphsChildren[1][1].stateValues.xs[1].tree).eq(1);
      expect(graphsChildren[1][2].stateValues.xs[0].tree).eq(7);
      expect(graphsChildren[1][2].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[1][3].stateValues.xs[0].tree).eq(6);
      expect(graphsChildren[1][3].stateValues.xs[1].tree).eq(1);
      expect(graphsChildren[1][4].stateValues.xs[0].tree).eq(6);
      expect(graphsChildren[1][4].stateValues.xs[1].tree).eq(5);
      expect(graphsChildren[1][5].stateValues.xs[0].tree).eq(5);
      expect(graphsChildren[1][5].stateValues.xs[1].tree).eq(2);
      expect(graphsChildren[1][6].stateValues.xs[0].tree).eq(7);
      expect(graphsChildren[1][6].stateValues.xs[1].tree).eq(5);
      expect(graphsChildren[1][7].stateValues.xs[0].tree).eq(6);
      expect(graphsChildren[1][7].stateValues.xs[1].tree).eq(2);

      expect(graphs2Children[0][0].stateValues.xs[0].tree).eq(-9);
      expect(graphs2Children[0][0].stateValues.xs[1].tree).eq(-5);
      expect(graphs2Children[0][1].stateValues.xs[0].tree).eq(3);
      expect(graphs2Children[0][1].stateValues.xs[1].tree).eq(1);
      expect(graphs2Children[0][2].stateValues.xs[0].tree).eq(-8);
      expect(graphs2Children[0][2].stateValues.xs[1].tree).eq(-5);
      expect(graphs2Children[0][3].stateValues.xs[0].tree).eq(4);
      expect(graphs2Children[0][3].stateValues.xs[1].tree).eq(1);
      expect(graphs2Children[0][4].stateValues.xs[0].tree).eq(-9);
      expect(graphs2Children[0][4].stateValues.xs[1].tree).eq(5);
      expect(graphs2Children[0][5].stateValues.xs[0].tree).eq(3);
      expect(graphs2Children[0][5].stateValues.xs[1].tree).eq(2);
      expect(graphs2Children[0][6].stateValues.xs[0].tree).eq(-8);
      expect(graphs2Children[0][6].stateValues.xs[1].tree).eq(5);
      expect(graphs2Children[0][7].stateValues.xs[0].tree).eq(4);
      expect(graphs2Children[0][7].stateValues.xs[1].tree).eq(2);

      expect(graphs2Children[1][0].stateValues.xs[0].tree).eq(6);
      expect(graphs2Children[1][0].stateValues.xs[1].tree).eq(-5);
      expect(graphs2Children[1][1].stateValues.xs[0].tree).eq(5);
      expect(graphs2Children[1][1].stateValues.xs[1].tree).eq(1);
      expect(graphs2Children[1][2].stateValues.xs[0].tree).eq(7);
      expect(graphs2Children[1][2].stateValues.xs[1].tree).eq(-5);
      expect(graphs2Children[1][3].stateValues.xs[0].tree).eq(6);
      expect(graphs2Children[1][3].stateValues.xs[1].tree).eq(1);
      expect(graphs2Children[1][4].stateValues.xs[0].tree).eq(6);
      expect(graphs2Children[1][4].stateValues.xs[1].tree).eq(5);
      expect(graphs2Children[1][5].stateValues.xs[0].tree).eq(5);
      expect(graphs2Children[1][5].stateValues.xs[1].tree).eq(2);
      expect(graphs2Children[1][6].stateValues.xs[0].tree).eq(7);
      expect(graphs2Children[1][6].stateValues.xs[1].tree).eq(5);
      expect(graphs2Children[1][7].stateValues.xs[0].tree).eq(6);
      expect(graphs2Children[1][7].stateValues.xs[1].tree).eq(2);

    })
  });

  it('three nested maps with graphs and assignnames', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map assignnames="u v">
    <template newNamespace>
      <graph>
        <map assignnames="u v">
          <template newNamespace>
            <map assignnames="u v">
              <template newNamespace>
                <point name="A">($l+$n, $m)</point>
              </template>
              <sources alias="l"><sequence from="1" to="2"/></sources>
            </map>
          </template>
          <sources alias="m"><sequence from="-5" to="5" step="10"/></sources>
        </map>
      </graph>
    </template>
    <sources alias="n"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    <copy name="c1" prop="coords" target="/u/u/u/A" />
    <copy name="c2" prop="coords" target="/u/u/v/A" />
    <copy name="c3" prop="coords" target="/u/v/u/A" />
    <copy name="c4" prop="coords" target="/u/v/v/A" />
    <copy name="c5" prop="coords" target="/v/u/u/A" />
    <copy name="c6" prop="coords" target="/v/u/v/A" />
    <copy name="c7" prop="coords" target="/v/v/u/A" />
    <copy name="c8" prop="coords" target="/v/v/v/A" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');   // to wait for page to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1 = stateVariables['/c1'].replacements[0];
      let coords1Anchor = cesc('#' + coords1.componentName);
      let coords2 = stateVariables['/c2'].replacements[0];
      let coords2Anchor = cesc('#' + coords2.componentName);
      let coords3 = stateVariables['/c3'].replacements[0];
      let coords3Anchor = cesc('#' + coords3.componentName);
      let coords4 = stateVariables['/c4'].replacements[0];
      let coords4Anchor = cesc('#' + coords4.componentName);
      let coords5 = stateVariables['/c5'].replacements[0];
      let coords5Anchor = cesc('#' + coords5.componentName);
      let coords6 = stateVariables['/c6'].replacements[0];
      let coords6Anchor = cesc('#' + coords6.componentName);
      let coords7 = stateVariables['/c7'].replacements[0];
      let coords7Anchor = cesc('#' + coords7.componentName);
      let coords8 = stateVariables['/c8'].replacements[0];
      let coords8Anchor = cesc('#' + coords8.componentName);

      cy.log('Test values displayed in browser')
      cy.get(`${coords1Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,−5)');
      });
      cy.get(`${coords2Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,−5)');
      });
      cy.get(`${coords3Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−9,5)');
      });
      cy.get(`${coords4Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−8,5)');
      });
      cy.get(`${coords5Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,−5)');
      });
      cy.get(`${coords6Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,−5)');
      });
      cy.get(`${coords7Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(6,5)');
      });
      cy.get(`${coords8Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(7,5)');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/u/_graph1'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/v/_graph1'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/u/u/u/A'].stateValues.xs[0].tree).eq(-9);
        expect(stateVariables['/u/u/u/A'].stateValues.xs[1].tree).eq(-5);
        expect(stateVariables['/u/u/v/A'].stateValues.xs[0].tree).eq(-8);
        expect(stateVariables['/u/u/v/A'].stateValues.xs[1].tree).eq(-5);
        expect(stateVariables['/u/v/u/A'].stateValues.xs[0].tree).eq(-9);
        expect(stateVariables['/u/v/u/A'].stateValues.xs[1].tree).eq(5);
        expect(stateVariables['/u/v/v/A'].stateValues.xs[0].tree).eq(-8);
        expect(stateVariables['/u/v/v/A'].stateValues.xs[1].tree).eq(5);
        expect(stateVariables['/v/u/u/A'].stateValues.xs[0].tree).eq(6);
        expect(stateVariables['/v/u/u/A'].stateValues.xs[1].tree).eq(-5);
        expect(stateVariables['/v/u/v/A'].stateValues.xs[0].tree).eq(7);
        expect(stateVariables['/v/u/v/A'].stateValues.xs[1].tree).eq(-5);
        expect(stateVariables['/v/v/u/A'].stateValues.xs[0].tree).eq(6);
        expect(stateVariables['/v/v/u/A'].stateValues.xs[1].tree).eq(5);
        expect(stateVariables['/v/v/v/A'].stateValues.xs[0].tree).eq(7);
        expect(stateVariables['/v/v/v/A'].stateValues.xs[1].tree).eq(5);
      })
    })
  });

  it('combination map nested inside map with graphs', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
    <template><graph>
      <map behavior="combination">
        <template><point>($l+$n, $m)</point></template>
        <sources alias="l"><sequence from="1" to="2"/></sources>
        <sources alias="m"><sequence from="-5" to="5" step="10"/></sources>
      </map>
    </graph></template>
    <sources alias="n"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.log('Test internal values are set to the correct values')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let graphs = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
      let graphsChildren = graphs.map(x => x.activeChildren);

      expect(graphs[0].stateValues.graphicalDescendants.length).eq(4);
      expect(graphs[1].stateValues.graphicalDescendants.length).eq(4);
      expect(graphsChildren[0][0].stateValues.xs[0].tree).eq(-9);
      expect(graphsChildren[0][0].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[0][1].stateValues.xs[0].tree).eq(-9);
      expect(graphsChildren[0][1].stateValues.xs[1].tree).eq(5);
      expect(graphsChildren[0][2].stateValues.xs[0].tree).eq(-8);
      expect(graphsChildren[0][2].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[0][3].stateValues.xs[0].tree).eq(-8);
      expect(graphsChildren[0][3].stateValues.xs[1].tree).eq(5);

      expect(graphsChildren[1][0].stateValues.xs[0].tree).eq(6);
      expect(graphsChildren[1][0].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[1][1].stateValues.xs[0].tree).eq(6);
      expect(graphsChildren[1][1].stateValues.xs[1].tree).eq(5);
      expect(graphsChildren[1][2].stateValues.xs[0].tree).eq(7);
      expect(graphsChildren[1][2].stateValues.xs[1].tree).eq(-5);
      expect(graphsChildren[1][3].stateValues.xs[0].tree).eq(7);
      expect(graphsChildren[1][3].stateValues.xs[1].tree).eq(5);

    })
  });

  it('map with copies', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
    <template newNamespace><math simplify>
        <copy target="n" name="b"/> + <copy target="j" name="i"/> + <copy target="../a" /> 
        + <math name="q">z</math> + <copy target="q" /> + <copy target="b" /> +<copy target="i" />
      </math><math>x</math></template>
    <sources alias="n" indexalias="j"><sequence from="1" to="2"/></sources>
    </map>
    <math name="a">x</math>
    <copy name="mapcopy" target="_map1" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors = replacements.map(x => '#' + x.componentName)
      let replacements2 = stateVariables['/mapcopy'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors2 = replacements2.map(x => '#' + x.componentName)

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(replacementAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+8');
      });
      cy.get(`${cesc(replacementAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });

      cy.get(`${cesc('#/a')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });

      cy.get(`${cesc(replacementAnchors2[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors2[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+8');
      });
      cy.get(`${cesc(replacementAnchors2[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });

    })
  });

  it('map with copies, extended dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <number name="length" hide>1</number>
    <map>
    <template newnamespace><math simplify>
        <copy target="n" name="b"/> + <copy target="j" name="i"/> + <copy target="../a" /> 
        + <math name="q">z</math> + <copy target="q" /> + <copy target="b" /> +<copy target="i" />
      </math><math>x</math></template>
    <sources alias="n" indexalias="j"><sequence from="1" length="$length"/></sources>
    </map>
    <math name="a">x</math>
    <copy name="mapcopy" target="_map1" />

    <updatevalue label="double" target="length" newValue="2$length" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors = replacements.map(x => '#' + x.componentName)
      let replacements2 = stateVariables['/mapcopy'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors2 = replacements2.map(x => '#' + x.componentName)

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(replacementAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc('#/a')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors2[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
    })


    cy.log('Double the length then test again')
    cy.get(cesc('#/_updatevalue1_button')).click(); //Update Button

    cy.window().then(async (win) => {
      console.log('hello')
      let stateVariables = await win.returnAllStateVariables1();
      console.log(stateVariables["/_map1"].replacements)
      let replacements = stateVariables['/_map1'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors = replacements.map(x => '#' + x.componentName)
      console.log(stateVariables["/mapcopy"].replacements)
      console.log(stateVariables['/mapcopy'].replacements.reduce((a, c) => [...a, ...c.replacements], []))
      let replacements2 = stateVariables['/mapcopy'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors2 = replacements2.map(x => '#' + x.componentName)

      cy.get(`${cesc(replacementAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+8');
      });
      cy.get(`${cesc(replacementAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc('#/a')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors2[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+8');
      });
      cy.get(`${cesc(replacementAnchors2[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
    });


    cy.log('Double the length again then test one more time')
    cy.get(cesc('#/_updatevalue1_button')).click(); //Update Button

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors = replacements.map(x => '#' + x.componentName)
      let replacements2 = stateVariables['/mapcopy'].replacements.reduce((a, c) => [...a, ...c.replacements], []);
      let replacementAnchors2 = replacements2.map(x => '#' + x.componentName)

      cy.get(`${cesc(replacementAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+8');
      });
      cy.get(`${cesc(replacementAnchors[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors[4])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+12');
      });
      cy.get(`${cesc(replacementAnchors[5])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors[6])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+16');
      });
      cy.get(`${cesc(replacementAnchors[7])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc('#/a')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+4');
      });
      cy.get(`${cesc(replacementAnchors2[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+8');
      });
      cy.get(`${cesc(replacementAnchors2[3])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[4])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+12');
      });
      cy.get(`${cesc(replacementAnchors2[5])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });
      cy.get(`${cesc(replacementAnchors2[6])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x+2z+16');
      });
      cy.get(`${cesc(replacementAnchors2[7])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('x');
      });

    });
  });

  it('map with copied template', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
    <template><math simplify="full">sin(<copy target="i"/><copy target="x"/>)</math></template>
    <sources alias="x" indexalias="i"><math>x</math><math>y</math></sources>
    </map>
  
    <map>
    <copy target="_template1" />
    <sources alias="x" indexalias="i"><math>q</math><math>p</math></sources>
    </map>

    <copy name="mapcopy" target="_map2" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
      let replacementAnchors = replacements.map(x => '#' + x.componentName)
      let replacements2 = stateVariables['/_map2'].replacements.map(x => x.replacements[0]);
      let replacementAnchors2 = replacements2.map(x => '#' + x.componentName)
      let replacements3 = stateVariables['/mapcopy'].replacements.map(x => x.replacements[0]);
      let replacementAnchors3 = replacements3.map(x => '#' + x.componentName)

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(replacementAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(x)');
      });
      cy.get(`${cesc(replacementAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2y)');
      });
      cy.get(`${cesc(replacementAnchors2[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(q)');
      });
      cy.get(`${cesc(replacementAnchors2[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2p)');
      });
      cy.get(`${cesc(replacementAnchors3[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(q)');
      });
      cy.get(`${cesc(replacementAnchors3[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2p)');
      });
    })
  });

  it('map with new namespace but no new namespace on template', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map newNamespace>
    <template><math simplify="full">sin($i$x)</math></template>
    <sources alias="x" indexalias="i"><math>x</math><math>y</math></sources>
    </map>
  
    <copy name="mapcopy" target="_map1" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
      let replacementAnchors = replacements.map(x => '#' + x.componentName)
      let replacements2 = stateVariables['/mapcopy'].replacements.map(x => x.replacements[0]);
      let replacementAnchors2 = replacements2.map(x => '#' + x.componentName)

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(replacementAnchors[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(x)');
      });
      cy.get(`${cesc(replacementAnchors[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2y)');
      });
      cy.get(`${cesc(replacementAnchors2[0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(x)');
      });
      cy.get(`${cesc(replacementAnchors2[1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('sin(2y)');
      });
    })
  });

  it('graph with new namespace and assignnames', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <copy target="/hi/c/_point1" prop="coords" />
    <copy target="/hi/s/_point1" prop="coords" />
    <copy target="/hi/q/_point1" prop="coords" />
    
    <grapH Name="hi" newNamespace >
    <map assignnames="q  c s">
      <template newnamespace><point>($m, $n)</point></template>
      <sources alias="m"><sequence from="1" to="2"/></sources>
      <sources alias="n"><sequence from="-3" to="-2"/></sources>
    </map>
    </graph>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1 = stateVariables['/_copy1'].replacements[0];
      let coords1Anchor = cesc('#' + coords1.componentName);
      let coords2 = stateVariables['/_copy2'].replacements[0];
      let coords2Anchor = cesc('#' + coords2.componentName);
      let coords3 = stateVariables['/_copy3'].replacements[0];
      let coords3Anchor = cesc('#' + coords3.componentName);

      let replacements = stateVariables['/hi/_map1'].replacements.map(x => x.replacements[0]);

      cy.log('Test values displayed in browser')

      cy.get(`${coords1Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−2)');
      });
      cy.get(`${coords2Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−3)');
      });
      cy.get(`${coords3Anchor} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−3)');
      });

      cy.log('Test internal values are set to the correct values')
      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables['/hi'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/hi/q/_point1'].stateValues.xs[0].tree).eq(1);
        expect(stateVariables['/hi/q/_point1'].stateValues.xs[1].tree).eq(-3);
        expect(stateVariables['/hi/c/_point1'].stateValues.xs[0].tree).eq(1);
        expect(stateVariables['/hi/c/_point1'].stateValues.xs[1].tree).eq(-2);
        expect(stateVariables['/hi/s/_point1'].stateValues.xs[0].tree).eq(2);
        expect(stateVariables['/hi/s/_point1'].stateValues.xs[1].tree).eq(-3);
        expect(replacements[3].stateValues.xs[0].tree).eq(2);
        expect(replacements[3].stateValues.xs[1].tree).eq(-2);
      })
    })
  });

  it('map copying source of other map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map assignnames="u v w">
      <template newNamespace><math>(<copy target="n"/>, <copy target="../e/_copy1" />)</math></template>
      <sources alias="n"><sequence from="1" to="3"/></sources>
    </map>
    <map assignnames="c d e">
      <template newNamespace><math>sin(<copy target="n"/>)</math></template>
      <sources alias="n"><sequence from="4" to="6"/></sources>
    </map>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.log('Test values displayed in browser')
    cy.get(`${cesc('#/u/_math1')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,6)');
    });
    cy.get(`${cesc('#/v/_math1')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,6)');
    });
    cy.get(`${cesc('#/w/_math1')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)');
    });
    cy.get(`${cesc('#/c/_math1')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(4)');
    });
    cy.get(`${cesc('#/d/_math1')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(5)');
    });
    cy.get(`${cesc('#/e/_math1')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('sin(6)');
    });
  });

  it('map length depending on other map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map>
    <template><map>
       <template><math>($a, $b)</math></template>
       <sources alias="a"><sequence from="1" to="$b" /></sources>
     </map></template>
    <sources alias="b"><sequence from="1" to="3"/></sources>
    </map>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let replacements = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
      let replacementAnchors = replacements.map(x => x.replacements.map(y => '#' + y.replacements[0].componentName))

      cy.log('Test values displayed in browser')
      cy.get(`${cesc(replacementAnchors[0][0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,1)');
      });
      cy.get(`${cesc(replacementAnchors[1][0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,2)');
      });
      cy.get(`${cesc(replacementAnchors[1][1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,2)');
      });
      cy.get(`${cesc(replacementAnchors[2][0])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,3)');
      });
      cy.get(`${cesc(replacementAnchors[2][1])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,3)');
      });
      cy.get(`${cesc(replacementAnchors[2][2])} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,3)');
      });

    });
  });

  it('map begins zero length, copied multiple times', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <p>
    <map>
    <template><math simplify>$n^2</math><text>,</text></template>
    <sources alias="n">
    <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
    </sources>
    </map>
    </p>

    <mathinput name="sequenceFrom" prefill="1"/>
    <mathinput name="sequenceTo" prefill="2"/>
    <mathinput name="sequenceCount" prefill="0"/>
    
    <p><copy name="copymap2" target="_map1" /></p>
    <p><copy name="copymap3" target="copymap2" /></p>

    <copy name="copymapthroughp" target="_p1" />
    <copy name="copymapthroughp2" target="copymapthroughp" />
    <copy name="copymapthroughp3" target="copymapthroughp2" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let p4 = stateVariables['/copymapthroughp'].replacements[0];
      let p4Anchor = cesc('#' + p4.componentName);
      let p5 = stateVariables['/copymapthroughp2'].replacements[0];
      let p5Anchor = cesc('#' + p5.componentName);
      let p6 = stateVariables['/copymapthroughp3'].replacements[0];
      let p6Anchor = cesc('#' + p6.componentName);


      cy.log('At beginning, nothing shown')
      cy.get(cesc('#/_p1')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(cesc('#/_p2')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(cesc('#/_p3')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p4Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p5Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p6Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });


      cy.log('make sequence length 1');
      cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}1{enter}', { force: true });

      cy.window().then(() => {

        let map1maths = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
        let map1mathAnchors = map1maths.map(x => '#' + x.componentName)
        let map2maths = stateVariables['/copymap2'].replacements.map(x => x.replacements[0]);
        let map2mathAnchors = map2maths.map(x => '#' + x.componentName)
        let map3maths = stateVariables['/copymap3'].replacements.map(x => x.replacements[0]);
        let map3mathAnchors = map3maths.map(x => '#' + x.componentName)
        let map4maths = stateVariables['/copymapthroughp'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map4mathAnchors = map4maths.map(x => '#' + x.componentName)
        let map5maths = stateVariables['/copymapthroughp2'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map5mathAnchors = map5maths.map(x => '#' + x.componentName)
        let map6maths = stateVariables['/copymapthroughp3'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map6mathAnchors = map6maths.map(x => '#' + x.componentName)

        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });

      })

      cy.log('make sequence length 0 again');
      cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}0{enter}', { force: true });

      cy.get(cesc('#/_p1')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(cesc('#/_p2')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(cesc('#/_p3')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p4Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p5Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p6Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });

      cy.log('make sequence length 2');
      cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}2{enter}', { force: true });

      cy.window().then(() => {

        let map1maths = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
        let map1mathAnchors = map1maths.map(x => '#' + x.componentName)
        let map2maths = stateVariables['/copymap2'].replacements.map(x => x.replacements[0]);
        let map2mathAnchors = map2maths.map(x => '#' + x.componentName)
        let map3maths = stateVariables['/copymap3'].replacements.map(x => x.replacements[0]);
        let map3mathAnchors = map3maths.map(x => '#' + x.componentName)
        let map4maths = stateVariables['/copymapthroughp'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map4mathAnchors = map4maths.map(x => '#' + x.componentName)
        let map5maths = stateVariables['/copymapthroughp2'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map5mathAnchors = map5maths.map(x => '#' + x.componentName)
        let map6maths = stateVariables['/copymapthroughp3'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map6mathAnchors = map6maths.map(x => '#' + x.componentName)

        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('4');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('4');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('4');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('4');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('4');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('1');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('4');
        });

      });

      cy.log('change limits');
      cy.get(cesc('#/sequenceFrom') + " textarea").type('{end}{backspace}3{enter}', { force: true });
      cy.get(cesc('#/sequenceTo') + " textarea").type('{end}{backspace}5{enter}', { force: true });


      cy.window().then(() => {

        let map1maths = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
        let map1mathAnchors = map1maths.map(x => '#' + x.componentName)
        let map2maths = stateVariables['/copymap2'].replacements.map(x => x.replacements[0]);
        let map2mathAnchors = map2maths.map(x => '#' + x.componentName)
        let map3maths = stateVariables['/copymap3'].replacements.map(x => x.replacements[0]);
        let map3mathAnchors = map3maths.map(x => '#' + x.componentName)
        let map4maths = stateVariables['/copymapthroughp'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map4mathAnchors = map4maths.map(x => '#' + x.componentName)
        let map5maths = stateVariables['/copymapthroughp2'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map5mathAnchors = map5maths.map(x => '#' + x.componentName)
        let map6maths = stateVariables['/copymapthroughp3'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map6mathAnchors = map6maths.map(x => '#' + x.componentName)

        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
      });

      cy.log('make sequence length 0 again');
      cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}0{enter}', { force: true });

      cy.get(cesc('#/_p1')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(cesc('#/_p2')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(cesc('#/_p3')).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p4Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p5Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });
      cy.get(p6Anchor).invoke('text').then((text) => {
        expect(text.trim()).equal('');
      });

      cy.log('make sequence length 3');
      cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}3{enter}', { force: true });

      cy.window().then(() => {

        let map1maths = stateVariables['/_map1'].replacements.map(x => x.replacements[0]);
        let map1mathAnchors = map1maths.map(x => '#' + x.componentName)
        let map2maths = stateVariables['/copymap2'].replacements.map(x => x.replacements[0]);
        let map2mathAnchors = map2maths.map(x => '#' + x.componentName)
        let map3maths = stateVariables['/copymap3'].replacements.map(x => x.replacements[0]);
        let map3mathAnchors = map3maths.map(x => '#' + x.componentName)
        let map4maths = stateVariables['/copymapthroughp'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map4mathAnchors = map4maths.map(x => '#' + x.componentName)
        let map5maths = stateVariables['/copymapthroughp2'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map5mathAnchors = map5maths.map(x => '#' + x.componentName)
        let map6maths = stateVariables['/copymapthroughp3'].replacements[0].activeChildren.filter(x => x.componentType === "math");
        let map6mathAnchors = map6maths.map(x => '#' + x.componentName)

        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('16');
        });
        cy.get(cesc('#/_p1')).children(cesc(map1mathAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('16');
        });
        cy.get(cesc('#/_p2')).children(cesc(map2mathAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('16');
        });
        cy.get(cesc('#/_p3')).children(cesc(map3mathAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('16');
        });
        cy.get(p4Anchor).children(cesc(map4mathAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('16');
        });
        cy.get(p5Anchor).children(cesc(map5mathAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[0])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('9');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[1])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('16');
        });
        cy.get(p6Anchor).children(cesc(map6mathAnchors[2])).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
          expect(text.trim()).equal('25');
        });
      })
    })
  });

  it('map with circular dependence in template', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <map assignnames="a b c">
        <template newNamespace><point>
            (<copy target="../q" />$n^2,
            <copy prop="x" target="_point2" />)
          </point><point>
            (<copy target="../r" />$n,
            <copy prop="x" target="_point1" />)
          </point></template>
      <sources alias='n'>
        <sequence from="2" to="4" />
      </sources>
      </map>
    </graph>
    <math name="q">1</math>
    <math name="r">1</math>
    <copy name="c1" prop="coords" target="a/_point1" />
    <copy name="c2" prop="coords" target="a/_point2" />
    <copy name="c3" prop="coords" target="b/_point1" />
    <copy name="c4" prop="coords" target="b/_point2" />
    <copy name="c5" prop="coords" target="c/_point1" />
    <copy name="c6" prop="coords" target="c/_point2" />
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.log('Test values displayed in browser')
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1 = stateVariables['/c1'].replacements[0];
      let coords1Anchor = '#' + coords1.componentName;
      let coords2 = stateVariables['/c2'].replacements[0];
      let coords2Anchor = '#' + coords2.componentName;
      let coords3 = stateVariables['/c3'].replacements[0];
      let coords3Anchor = '#' + coords3.componentName;
      let coords4 = stateVariables['/c4'].replacements[0];
      let coords4Anchor = '#' + coords4.componentName;
      let coords5 = stateVariables['/c5'].replacements[0];
      let coords5Anchor = '#' + coords5.componentName;
      let coords6 = stateVariables['/c6'].replacements[0];
      let coords6Anchor = '#' + coords6.componentName;

      cy.get(`${cesc(coords1Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,2)');
      });
      cy.get(`${cesc(coords2Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,4)');
      });
      cy.get(`${cesc(coords3Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(9,3)');
      });
      cy.get(`${cesc(coords4Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,9)');
      });
      cy.get(`${cesc(coords5Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(16,4)');
      });
      cy.get(`${cesc(coords6Anchor)} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,16)');
      });
      cy.get(`${cesc('#/q')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });
      cy.get(`${cesc('#/r')} .mjx-mrow`).eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('1');
      });

    })


    cy.window().then(async (win) => {
      let r = 1;
      let q = 1;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(6);
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).eq(xs1[ind]);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).eq(xs2[ind]);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).eq(xs2[ind]);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).eq(xs1[ind]);
      }
    });

    cy.log("move point a1");
    cy.window().then(async (win) => {
      let r = 1.3;
      let q = -2.1;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a/_point1",
        args: { x: xs1[0], y: xs2[0] }
      })
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).closeTo(xs1[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).closeTo(xs1[ind], 1E-14);
      }
    });

    cy.log("move point a2");
    cy.window().then(async (win) => {
      let r = 0.7;
      let q = 1.8;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/a/_point2",
        args: { x: xs2[0], y: xs1[0] }
      })
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).closeTo(xs1[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).closeTo(xs1[ind], 1E-14);
      }
    });

    cy.log("move point b1");
    cy.window().then(async (win) => {
      let r = -0.2;
      let q = 0.3;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b/_point1",
        args: { x: xs1[1], y: xs2[1] }
      })
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).closeTo(xs1[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).closeTo(xs1[ind], 1E-14);
      }
    });

    cy.log("move point b2");
    cy.window().then(async (win) => {
      let r = 0.6;
      let q = 0.35;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/b/_point2",
        args: { x: xs2[1], y: xs1[1] }
      })
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).closeTo(xs1[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).closeTo(xs1[ind], 1E-14);
      }
    });

    cy.log("move point c1");
    cy.window().then(async (win) => {
      let r = -0.21;
      let q = -0.46;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c/_point1",
        args: { x: xs1[2], y: xs2[2] }
      })
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).closeTo(xs1[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).closeTo(xs1[ind], 1E-14);
      }
    });

    cy.log("move point c2");
    cy.window().then(async (win) => {
      let r = 0.37;
      let q = -0.73;
      let s = [2, 3, 4];
      let xs1 = s.map(v => v * v * q);
      let xs2 = s.map(v => v * r);
      let ns = ["a", "b", "c"];
      let stateVariables = await win.returnAllStateVariables1();

      await win.callAction1({
        actionName: "movePoint",
        componentName: "/c/_point2",
        args: { x: xs2[2], y: xs1[2] }
      })
      for (let ind = 0; ind < 3; ind++) {
        let namespace = ns[ind];
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[0].tree).closeTo(xs1[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point1`].stateValues.xs[1].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[0].tree).closeTo(xs2[ind], 1E-14);
        expect(stateVariables[`/${namespace}/_point2`].stateValues.xs[1].tree).closeTo(xs1[ind], 1E-14);
      }
    });

  });

  it('two maps with mutual copies, begin zero length, copied multiple times', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <graph>
      <map assignnames="a b c">
        <template newNamespace><point>
            (-$n, $n<copy prop="x" target="../q/_point1" />)
          </point></template>
      <sources alias="n">
        <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
      </sources>
      </map>
      <map assignnames="q r s">
        <template newNamespace><point>
            ($n, $n<copy prop="x" target="../a/_point1" />)
          </point></template>
      <sources alias="n">
        <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
      </sources>
      </map>
    </graph>
    
    <mathinput name="sequenceFrom" prefill="1"/>
    <mathinput name="sequenceTo" prefill="2"/>
    <mathinput name="sequenceCount" prefill="0"/>
    
    <graph>
    <copy name="copymap1" target="_map1" />
    <copy name="copymap2" target="_map2" />
    </graph>
    <graph>
    <copy name="copymap1b" target="copymap1" />
    <copy name="copymap2b" target="copymap2" />
    </graph>
    
    <copy name="graph4" target="_graph1" />
    <p><collect componentTypes="point" target="_graph1"/></p>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.log('At beginning, nothing shown')
    cy.get(cesc('#/_p1')).invoke('text').then((text) => {
      expect(text.trim()).equal('');
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(0);
    })

    cy.log('make sequence length 1');
    cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}1{enter}', { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc('#' + stateVariables["/_collect1"].replacements[0].adapterUsed.componentName);
      let coords2Anchor = cesc('#' + stateVariables["/_collect1"].replacements[1].adapterUsed.componentName);

      cy.get(cesc('#/_p1')).children(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,1)');
      });
      cy.get(cesc('#/_p1')).children(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−1)');
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(2);
        expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(2);
        expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(2);
        expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(2);
        expect(stateVariables['/a/_point1'].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/q/_point1'].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/copymap1'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/copymap2'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/copymap1b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/copymap2b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[0].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[1].stateValues.coords.tree).eqls(["vector", 1, -1]);
      })
    })

    cy.log('make sequence length 0 again');
    cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}0{enter}', { force: true });

    cy.get(cesc('#/_p1')).invoke('text').then((text) => {
      expect(text.trim()).equal('');
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(0);
    })


    cy.log('make sequence length 2');
    cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}2{enter}', { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc('#' + stateVariables["/_collect1"].replacements[0].adapterUsed.componentName);
      let coords2Anchor = cesc('#' + stateVariables["/_collect1"].replacements[1].adapterUsed.componentName);
      let coords3Anchor = cesc('#' + stateVariables["/_collect1"].replacements[2].adapterUsed.componentName);
      let coords4Anchor = cesc('#' + stateVariables["/_collect1"].replacements[3].adapterUsed.componentName);

      cy.get(cesc('#/_p1')).children(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−1,1)');
      });
      cy.get(cesc('#/_p1')).children(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−2,2)');
      });
      cy.get(cesc('#/_p1')).children(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(1,−1)');
      });
      cy.get(cesc('#/_p1')).children(coords4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(2,−2)');
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/a/_point1'].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/q/_point1'].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/copymap1'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/copymap2'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/copymap1b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/copymap2b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[0].stateValues.coords.tree).eqls(["vector", -1, 1]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[2].stateValues.coords.tree).eqls(["vector", 1, -1]);
        expect(stateVariables['/b/_point1'].stateValues.coords.tree).eqls(["vector", -2, 2]);
        expect(stateVariables['/r/_point1'].stateValues.coords.tree).eqls(["vector", 2, -2]);
        expect(stateVariables['/copymap1'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", -2, 2]);
        expect(stateVariables['/copymap2'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", 2, -2]);
        expect(stateVariables['/copymap1b'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", -2, 2]);
        expect(stateVariables['/copymap2b'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", 2, -2]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[1].stateValues.coords.tree).eqls(["vector", -2, 2]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[3].stateValues.coords.tree).eqls(["vector", 2, -2]);
      })

    })

    cy.log('change limits');
    cy.get(cesc('#/sequenceFrom') + " textarea").type('{end}{backspace}3{enter}', { force: true });
    cy.get(cesc('#/sequenceTo') + " textarea").type('{end}{backspace}5{enter}', { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc('#' + stateVariables["/_collect1"].replacements[0].adapterUsed.componentName);
      let coords2Anchor = cesc('#' + stateVariables["/_collect1"].replacements[1].adapterUsed.componentName);
      let coords3Anchor = cesc('#' + stateVariables["/_collect1"].replacements[2].adapterUsed.componentName);
      let coords4Anchor = cesc('#' + stateVariables["/_collect1"].replacements[3].adapterUsed.componentName);

      cy.get(cesc('#/_p1')).children(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,9)');
      });
      cy.get(cesc('#/_p1')).children(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,15)');
      });
      cy.get(cesc('#/_p1')).children(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−9)');
      });
      cy.get(cesc('#/_p1')).children(coords4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−15)');
      });

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(4);
        expect(stateVariables['/a/_point1'].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/q/_point1'].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/copymap1'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/copymap2'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/copymap1b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/copymap2b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[0].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[2].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/b/_point1'].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/r/_point1'].stateValues.coords.tree).eqls(["vector", 5, -15]);
        expect(stateVariables['/copymap1'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/copymap2'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", 5, -15]);
        expect(stateVariables['/copymap1b'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/copymap2b'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", 5, -15]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[1].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[3].stateValues.coords.tree).eqls(["vector", 5, -15]);
      })
    })

    cy.log('make sequence length 0 again');
    cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}0{enter}', { force: true });

    cy.get(cesc('#/_p1')).invoke('text').then((text) => {
      expect(text.trim()).equal('');
    });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(0);
      expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(0);
    })

    cy.log('make sequence length 3');
    cy.get(cesc('#/sequenceCount') + " textarea").type('{end}{backspace}3{enter}', { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let coords1Anchor = cesc('#' + stateVariables["/_collect1"].replacements[0].adapterUsed.componentName);
      let coords2Anchor = cesc('#' + stateVariables["/_collect1"].replacements[1].adapterUsed.componentName);
      let coords3Anchor = cesc('#' + stateVariables["/_collect1"].replacements[2].adapterUsed.componentName);
      let coords4Anchor = cesc('#' + stateVariables["/_collect1"].replacements[3].adapterUsed.componentName);
      let coords5Anchor = cesc('#' + stateVariables["/_collect1"].replacements[4].adapterUsed.componentName);
      let coords6Anchor = cesc('#' + stateVariables["/_collect1"].replacements[5].adapterUsed.componentName);


      cy.get(cesc('#/_p1')).children(coords1Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−3,9)');
      });
      cy.get(cesc('#/_p1')).children(coords2Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−4,12)');
      });
      cy.get(cesc('#/_p1')).children(coords3Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(−5,15)');
      });
      cy.get(cesc('#/_p1')).children(coords4Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(3,−9)');
      });
      cy.get(cesc('#/_p1')).children(coords5Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(4,−12)');
      });
      cy.get(cesc('#/_p1')).children(coords6Anchor).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
        expect(text.trim()).equal('(5,−15)');
      });


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables['/_graph1'].stateValues.graphicalDescendants.length).eq(6);
        expect(stateVariables['/_graph2'].stateValues.graphicalDescendants.length).eq(6);
        expect(stateVariables['/_graph3'].stateValues.graphicalDescendants.length).eq(6);
        expect(stateVariables['/graph4'].replacements[0].stateValues.graphicalDescendants.length).eq(6);
        expect(stateVariables['/a/_point1'].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/q/_point1'].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/copymap1'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/copymap2'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/copymap1b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/copymap2b'].replacements[0].replacements[0].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[0].stateValues.coords.tree).eqls(["vector", -3, 9]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[3].stateValues.coords.tree).eqls(["vector", 3, -9]);
        expect(stateVariables['/b/_point1'].stateValues.coords.tree).eqls(["vector", -4, 12]);
        expect(stateVariables['/r/_point1'].stateValues.coords.tree).eqls(["vector", 4, -12]);
        expect(stateVariables['/copymap1'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", -4, 12]);
        expect(stateVariables['/copymap2'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", 4, -12]);
        expect(stateVariables['/copymap1b'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", -4, 12]);
        expect(stateVariables['/copymap2b'].replacements[1].replacements[0].stateValues.coords.tree).eqls(["vector", 4, -12]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[1].stateValues.coords.tree).eqls(["vector", -4, 12]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[4].stateValues.coords.tree).eqls(["vector", 4, -12]);
        expect(stateVariables['/c/_point1'].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/s/_point1'].stateValues.coords.tree).eqls(["vector", 5, -15]);
        expect(stateVariables['/copymap1'].replacements[2].replacements[0].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/copymap2'].replacements[2].replacements[0].stateValues.coords.tree).eqls(["vector", 5, -15]);
        expect(stateVariables['/copymap1b'].replacements[2].replacements[0].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/copymap2b'].replacements[2].replacements[0].stateValues.coords.tree).eqls(["vector", 5, -15]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[2].stateValues.coords.tree).eqls(["vector", -5, 15]);
        expect(stateVariables['/graph4'].replacements[0].activeChildren[5].stateValues.coords.tree).eqls(["vector", 5, -15]);
      })
    })


  });

  it('map points to adapt to math', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="number"/></p>
    <p>Step size: <mathinput name="step" /></p>
    
    <math>
      <map>
        <template><point>($n, sin($n))</point></template>
        <sources alias="n">
          <sequence from="2" length="$number" step="$step" />
        </sources>
      </map>
    </math>
    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(0);
    })

    cy.get(cesc("#/number") + " textarea").type("10{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(0);
    })

    cy.get(cesc("#/step") + " textarea").type("1{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(10);
      for (let i = 0; i < 10; i++) {
        let j = i + 2;
        expect(stateVariables['/_math1'].activeChildren[i].stateValues.value.tree).eqls(["vector", j, ["apply", "sin", j]]);
      }
    })

    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}{backspace}20{enter}", { force: true });

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(20);
      for (let i = 0; i < 20; i++) {
        let j = i + 2;
        expect(stateVariables['/_math1'].activeChildren[i].stateValues.value.tree).eqls(["vector", j, ["apply", "sin", j]]);
      }
    })

    cy.get(cesc("#/step") + " textarea").type("{end}{backspace}0.5{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(20);
      for (let i = 0; i < 20; i++) {
        let j = 2 + i * 0.5;
        expect(stateVariables['/_math1'].activeChildren[i].stateValues.value.tree).eqls(["vector", j, ["apply", "sin", j]]);
      }
    })

    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}{backspace}10{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(10);
      for (let i = 0; i < 10; i++) {
        let j = 2 + i * 0.5;
        expect(stateVariables['/_math1'].activeChildren[i].stateValues.value.tree).eqls(["vector", j, ["apply", "sin", j]]);
      }
    })

    cy.get(cesc("#/step") + " textarea").type("{end}{backspace}{backspace}{backspace}{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(0);
    })

    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}{backspace}5{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(0);
    })

    cy.get(cesc("#/step") + " textarea").type("-3{enter}", { force: true });
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/_math1'].activeChildren.length).eq(5);
      for (let i = 0; i < 5; i++) {
        let j = 2 - i * 3;
        expect(stateVariables['/_math1'].activeChildren[i].stateValues.value.tree).eqls(["vector", j, ["apply", "sin", j]]);
      }
    })

  });

  it('map inside sources of map', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number of points: <mathinput name="number"/></p>
    
    <map name="m1" assignNames="p1 p2 p3">
      <template newNamespace><point name="pt">($n, 2$n)</point></template>
      <sources alias="n">
        <sequence length="$number" />
      </sources>
    </map>

    <map name="m2" assignNames="q1 q2 q3">
      <template newNamespace>
        <point name="pt">(<copy target="p" prop="x" />^2, <copy target="p" prop="y" />^2)</point>
      </template>
      <sources alias="p">
        <copy target="m1" />
      </sources>
    </map>

    p1a: <copy target="p1" assignNames="p1a" />,
    p1b: <copy target="p1/pt" assignNames="p1b" />,
    p2a: <copy target="p2" assignNames="p2a" />,
    p2b: <copy target="p2/pt" assignNames="p2b" />,
    p3a: <copy target="p3" assignNames="p3a" />,
    p3b: <copy target="p3/pt" assignNames="p3b" />,

    q1a: <copy target="q1" assignNames="q1a" />,
    q1b: <copy target="q1/pt" assignNames="q1b" />,
    q2a: <copy target="q2" assignNames="q2a" />,
    q2b: <copy target="q2/pt" assignNames="q2b" />,
    q3a: <copy target="q3" assignNames="q3a" />,
    q3b: <copy target="q3/pt" assignNames="q3b" />,

    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.get(cesc('#/p1/pt')).should('not.exist');
    cy.get(cesc('#/p1a/pt')).should('not.exist');
    cy.get(cesc('#/p1b')).should('not.exist');
    cy.get(cesc('#/p2/pt')).should('not.exist');
    cy.get(cesc('#/p2a/pt')).should('not.exist');
    cy.get(cesc('#/p2b')).should('not.exist');
    cy.get(cesc('#/p3/pt')).should('not.exist');
    cy.get(cesc('#/p3a/pt')).should('not.exist');
    cy.get(cesc('#/p3b')).should('not.exist');

    cy.get(cesc('#/q1/pt')).should('not.exist');
    cy.get(cesc('#/q1a/pt')).should('not.exist');
    cy.get(cesc('#/q1b')).should('not.exist');
    cy.get(cesc('#/q2/pt')).should('not.exist');
    cy.get(cesc('#/q2a/pt')).should('not.exist');
    cy.get(cesc('#/q2b')).should('not.exist');
    cy.get(cesc('#/q3/pt')).should('not.exist');
    cy.get(cesc('#/q3a/pt')).should('not.exist');
    cy.get(cesc('#/q3b')).should('not.exist');



    cy.log('set number to be 2');
    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}2{enter}", { force: true });

    cy.get(cesc('#/p1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get(cesc('#/p2/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,4)')
    })
    cy.get(cesc('#/p2a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,4)')
    })
    cy.get(cesc('#/p2b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,4)')
    })

    cy.get(cesc('#/p3/pt')).should('not.exist');
    cy.get(cesc('#/p3a/pt')).should('not.exist');
    cy.get(cesc('#/p3b')).should('not.exist');

    cy.get(cesc('#/q1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })

    cy.get(cesc('#/q2/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,16)')
    })
    cy.get(cesc('#/q2a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,16)')
    })
    cy.get(cesc('#/q2b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,16)')
    })

    cy.get(cesc('#/q3/pt')).should('not.exist');
    cy.get(cesc('#/q3a/pt')).should('not.exist');
    cy.get(cesc('#/q3b')).should('not.exist');



    cy.log('set number to be 1');
    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}1{enter}", { force: true });

    cy.get(cesc('#/p1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get(cesc('#/p2/pt')).should('not.exist');
    cy.get(cesc('#/p2a/pt')).should('not.exist');
    cy.get(cesc('#/p2b')).should('not.exist');
    cy.get(cesc('#/p3/pt')).should('not.exist');
    cy.get(cesc('#/p3a/pt')).should('not.exist');
    cy.get(cesc('#/p3b')).should('not.exist');

    cy.get(cesc('#/q1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })

    cy.get(cesc('#/q2/pt')).should('not.exist');
    cy.get(cesc('#/q2a/pt')).should('not.exist');
    cy.get(cesc('#/q2b')).should('not.exist');
    cy.get(cesc('#/q3/pt')).should('not.exist');
    cy.get(cesc('#/q3a/pt')).should('not.exist');
    cy.get(cesc('#/q3b')).should('not.exist');



    cy.log('set number to be 3');
    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}3{enter}", { force: true });

    cy.get(cesc('#/p1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get(cesc('#/p2/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,4)')
    })
    cy.get(cesc('#/p2a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,4)')
    })
    cy.get(cesc('#/p2b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(2,4)')
    })

    cy.get(cesc('#/p3/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    })
    cy.get(cesc('#/p3a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    })
    cy.get(cesc('#/p3b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(3,6)')
    })


    cy.get(cesc('#/q1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })

    cy.get(cesc('#/q2/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,16)')
    })
    cy.get(cesc('#/q2a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,16)')
    })
    cy.get(cesc('#/q2b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(4,16)')
    })

    cy.get(cesc('#/q3/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9,36)')
    })
    cy.get(cesc('#/q3a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9,36)')
    })
    cy.get(cesc('#/q3b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(9,36)')
    })


    cy.log('set number back to zero');
    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}0{enter}", { force: true });

    cy.get(cesc('#/p1/pt')).should('not.exist');
    cy.get(cesc('#/p1a/pt')).should('not.exist');
    cy.get(cesc('#/p1b')).should('not.exist');
    cy.get(cesc('#/p2/pt')).should('not.exist');
    cy.get(cesc('#/p2a/pt')).should('not.exist');
    cy.get(cesc('#/p2b')).should('not.exist');
    cy.get(cesc('#/p3/pt')).should('not.exist');
    cy.get(cesc('#/p3a/pt')).should('not.exist');
    cy.get(cesc('#/p3b')).should('not.exist');

    cy.get(cesc('#/q1/pt')).should('not.exist');
    cy.get(cesc('#/q1a/pt')).should('not.exist');
    cy.get(cesc('#/q1b')).should('not.exist');
    cy.get(cesc('#/q2/pt')).should('not.exist');
    cy.get(cesc('#/q2a/pt')).should('not.exist');
    cy.get(cesc('#/q2b')).should('not.exist');
    cy.get(cesc('#/q3/pt')).should('not.exist');
    cy.get(cesc('#/q3a/pt')).should('not.exist');
    cy.get(cesc('#/q3b')).should('not.exist');


    cy.log('set number back to 1');
    cy.get(cesc("#/number") + " textarea").type("{end}{backspace}1{enter}", { force: true });

    cy.get(cesc('#/p1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })
    cy.get(cesc('#/p1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,2)')
    })

    cy.get(cesc('#/p2/pt')).should('not.exist');
    cy.get(cesc('#/p2a/pt')).should('not.exist');
    cy.get(cesc('#/p2b')).should('not.exist');
    cy.get(cesc('#/p3/pt')).should('not.exist');
    cy.get(cesc('#/p3a/pt')).should('not.exist');
    cy.get(cesc('#/p3b')).should('not.exist');

    cy.get(cesc('#/q1/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1a/pt')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })
    cy.get(cesc('#/q1b')).find('.mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('(1,4)')
    })

    cy.get(cesc('#/q2/pt')).should('not.exist');
    cy.get(cesc('#/q2a/pt')).should('not.exist');
    cy.get(cesc('#/q2b')).should('not.exist');
    cy.get(cesc('#/q3/pt')).should('not.exist');
    cy.get(cesc('#/q3a/pt')).should('not.exist');
    cy.get(cesc('#/q3b')).should('not.exist');


  });

  it('can override fixed of source index', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <map assignNames="a b">
      <template newNamespace>
      <copy target="i" assignNames="ind" />
      <mathinput bindValueTo="$ind" />
      </template>
      <sources indexAlias="i"><text>red</text><text>yellow</text></sources>
    </map>
    <map assignNames="c d">
      <template newNamespace>
      <copy target="i" assignNames="ind" fixed="false"  />
      <mathinput bindValueTo="$ind" />
      </template>
      <sources indexAlias="i"><text>red</text><text>yellow</text></sources>
    </map>


    `}, "*");
    });

    cy.get(cesc('#/_text1')).should('have.text', 'a');  //wait for window to load

    cy.get(cesc('#/a/ind')).should('have.text', '1');
    cy.get(cesc('#/b/ind')).should('have.text', '2');
    cy.get(cesc('#/c/ind')).should('have.text', '1');
    cy.get(cesc('#/d/ind')).should('have.text', '2');

    cy.get(cesc('#/a/_mathinput1') + " textarea").type('{end}{backspace}3{enter}', { force: true })
    cy.get(cesc('#/b/_mathinput1') + " textarea").type('{end}{backspace}4{enter}', { force: true })
    cy.get(cesc('#/c/_mathinput1') + " textarea").type('{end}{backspace}5{enter}', { force: true })
    cy.get(cesc('#/d/_mathinput1') + " textarea").type('{end}{backspace}6{enter}', { force: true })

    cy.get(cesc('#/a/ind')).should('have.text', '1');
    cy.get(cesc('#/b/ind')).should('have.text', '2');
    cy.get(cesc('#/c/ind')).should('have.text', '5');
    cy.get(cesc('#/d/ind')).should('have.text', '6');

    cy.get(cesc('#/a/_mathinput1') + " textarea").type('{end}x{enter}', { force: true })
    cy.get(cesc('#/b/_mathinput1') + " textarea").type('{end}x{enter}', { force: true })
    cy.get(cesc('#/c/_mathinput1') + " textarea").type('{end}x{enter}', { force: true })
    cy.get(cesc('#/d/_mathinput1') + " textarea").type('{end}x{enter}', { force: true })

    cy.get(cesc('#/a/ind')).should('have.text', '1');
    cy.get(cesc('#/b/ind')).should('have.text', '2');
    cy.get(cesc('#/c/ind')).should('have.text', 'NaN');
    cy.get(cesc('#/d/ind')).should('have.text', 'NaN');

    cy.get(cesc('#/a/_mathinput1') + " textarea").type('{end}{backspace}{backspace}{backspace}7{enter}', { force: true })
    cy.get(cesc('#/b/_mathinput1') + " textarea").type('{end}{backspace}{backspace}{backspace}8{enter}', { force: true })
    cy.get(cesc('#/c/_mathinput1') + " textarea").type('{end}{backspace}{backspace}{backspace}9{enter}', { force: true })
    cy.get(cesc('#/d/_mathinput1') + " textarea").type('{end}{backspace}{backspace}{backspace}10{enter}', { force: true })

    cy.get(cesc('#/a/ind')).should('have.text', '1');
    cy.get(cesc('#/b/ind')).should('have.text', '2');
    cy.get(cesc('#/c/ind')).should('have.text', '9');
    cy.get(cesc('#/d/ind')).should('have.text', '10');


  });

  it('maps hide dynamically', () => {
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" label="Hide first map" />
    <booleaninput name='h2' prefill="true" label="Hide second map" />
    <p>Length of map 1: <mathinput name="n1" prefill="4" /></p>
    <p>Length of map 2: <mathinput name="n2" prefill="4" /></p>

    <p name="m1">map 1: <map hide="$h1">
    <template>hi$a </template>
    <sources alias="a"><sequence length="$n1" /></sources>
    </map></p>
    <p name="m2">map 2: <map hide="$h2">
    <template>hi$a </template>
    <sources alias="a"><sequence length="$n2" /></sources>
    </map></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.get('#\\/m1').should('have.text', 'map 1: hi1 hi2 hi3 hi4 ')
    cy.get('#\\/m2').should('have.text', 'map 2: ')

    cy.get('#\\/n1 textarea').type("{end}{backspace}6{enter}", { force: true })
    cy.get('#\\/n2 textarea').type("{end}{backspace}6{enter}", { force: true })

    cy.get('#\\/m1').should('have.text', 'map 1: hi1 hi2 hi3 hi4 hi5 hi6 ')
    cy.get('#\\/m2').should('have.text', 'map 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/m1').should('have.text', 'map 1: ')
    cy.get('#\\/m2').should('have.text', 'map 2: hi1 hi2 hi3 hi4 hi5 hi6 ')

    cy.get('#\\/n1 textarea').type("{end}{backspace}8{enter}", { force: true })
    cy.get('#\\/n2 textarea').type("{end}{backspace}8{enter}", { force: true })

    cy.get('#\\/m1').should('have.text', 'map 1: ')
    cy.get('#\\/m2').should('have.text', 'map 2: hi1 hi2 hi3 hi4 hi5 hi6 hi7 hi8 ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/m1').should('have.text', 'map 1: hi1 hi2 hi3 hi4 hi5 hi6 hi7 hi8 ')
    cy.get('#\\/m2').should('have.text', 'map 2: ')

    cy.get('#\\/n1 textarea').type("{end}{backspace}3{enter}", { force: true })
    cy.get('#\\/n2 textarea').type("{end}{backspace}3{enter}", { force: true })

    cy.get('#\\/m1').should('have.text', 'map 1: hi1 hi2 hi3 ')
    cy.get('#\\/m2').should('have.text', 'map 2: ')

    cy.get('#\\/h1_input').click();
    cy.get('#\\/h2_input').click();

    cy.get('#\\/m1').should('have.text', 'map 1: ')
    cy.get('#\\/m2').should('have.text', 'map 2: hi1 hi2 hi3 ')

    cy.get('#\\/n1 textarea').type("{end}{backspace}4{enter}", { force: true })
    cy.get('#\\/n2 textarea').type("{end}{backspace}4{enter}", { force: true })

    cy.get('#\\/m1').should('have.text', 'map 1: ')
    cy.get('#\\/m2').should('have.text', 'map 2: hi1 hi2 hi3 hi4 ')


  });



});