import me from 'math-expressions';

describe('Select Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
  })

  it("no parameters, select doesn't do anything", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><select/></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/_p1'].activeChildren.length).eq(0);
    });
  });

  it('select single math', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select assignnames="(x1)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x2)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x3)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x4)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x5)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x6)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x7)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x8)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x9)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select assignnames="(x10)">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 10; ind++) {
        let x = components['/x' + ind].stateValues.value.tree;
        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
      }
    })
  });

  it('select multiple maths', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numberToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numberToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numberToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numberToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numberToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 5; ind++) {
        let x = components['/x' + ind].stateValues.value.tree;
        let y = components['/y' + ind].stateValues.value.tree;
        let z = components['/z' + ind].stateValues.value.tree;

        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(y)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(z)).eq(true);
        expect(x).not.eq(y);
        expect(x).not.eq(z);
        expect(y).not.eq(z);
      }
    })
  });

  it('select multiple maths, initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numberToSelect="$n" >
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numberToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numberToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numberToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numberToSelect="$n">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>

    <copy name="n2" tname="n3" />
    <copy name="n" tname="num1" />
    <math name="num1" simplify><copy tname="n2" />+<copy tname="num2" /></math>
    <math name="num2" simplify><copy tname="n3" />+<copy tname="num3" /></math>
    <copy name="n3" tname="num3" />
    <number name="num3">1</number>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');
    cy.get('#\\/num1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('3')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 5; ind++) {
        let x = components['/x' + ind].stateValues.value.tree;
        let y = components['/y' + ind].stateValues.value.tree;
        let z = components['/z' + ind].stateValues.value.tree;

        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(y)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(z)).eq(true);
        expect(x).not.eq(y);
        expect(x).not.eq(z);
        expect(y).not.eq(z);
      }
    })
  });

  it('select multiple maths with namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numberToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numberToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numberToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numberToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numberToSelect="3" newNameSpace>
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 5; ind++) {
        let x = components['/s' + ind + '/x' + ind].stateValues.value.tree;
        let y = components['/s' + ind + '/y' + ind].stateValues.value.tree;
        let z = components['/s' + ind + '/z' + ind].stateValues.value.tree;

        expect(["u", "v", "w", "x", "y", "z"].includes(x)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(y)).eq(true);
        expect(["u", "v", "w", "x", "y", "z"].includes(z)).eq(true);
        expect(x).not.eq(y);
        expect(x).not.eq(z);
        expect(y).not.eq(z);
      }
    })
  });

  it('select multiple maths, with replacement', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select name="s1" assignnames="(x1)  (y1)  (z1)" numberToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2" assignnames="(x2)  (y2)  (z2)" numberToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s3" assignnames="(x3)  (y3)  (z3)" numberToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s4" assignnames="(x4)  (y4)  (z4)" numberToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s5" assignnames="(x5)  (y5)  (z5)" numberToSelect="5" withReplacement>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 5; ind++) {
        let x = components['/x' + ind].stateValues.value.tree;
        let y = components['/y' + ind].stateValues.value.tree;
        let z = components['/z' + ind].stateValues.value.tree;

        expect(["x", "y", "z"].includes(x)).eq(true);
        expect(["x", "y", "z"].includes(y)).eq(true);
        expect(["x", "y", "z"].includes(z)).eq(true);

        let s = components['/s' + ind];

        for (let i = 3; i < 5; i++) {
          expect(["x", "y", "z"].includes(s.replacements[i].replacements[0].stateValues.value.tree)).eq(true);
        }
      }
    })
  });

  it("copies don't resample", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>
    <aslist>
    <select name="s1">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    <select name="s2">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>
    </aslist>
    </p>

    <p>
    <aslist>
    <copy name="noresample1" tname="s1" />
    <copy name="noresample2" tname="s2" />
    <copy name="noreresample1" tname="noresample1" />
    <copy name="noreresample2" tname="noresample2" />
    </aslist>
    </p>

    <p>
    <copy name="noresamplelist" tname="_aslist1" />
    </p>

    <p>
    <copy name="noreresamplelist" tname="noresamplelist" />
    </p>

    <copy name="noresamplep" tname="_p1" />
    <copy name="noreresamplep" tname="noresamplep" />
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/s1'].replacements[0].replacements[0].stateValues.value.tree;
      let x2 = components['/s2'].replacements[0].replacements[0].stateValues.value.tree;
      expect(["u", "v", "w", "x", "y", "z"].includes(x1)).eq(true);
      expect(["u", "v", "w", "x", "y", "z"].includes(x2)).eq(true);

      expect(components['/noresample1'].replacements[0].replacements[0].stateValues.value.tree).eq(x1);
      expect(components['/noresample2'].replacements[0].replacements[0].stateValues.value.tree).eq(x2);
      expect(components['/noreresample1'].replacements[0].replacements[0].stateValues.value.tree).eq(x1);
      expect(components['/noreresample2'].replacements[0].replacements[0].stateValues.value.tree).eq(x2);

      expect(components['/noresamplelist'].replacements[0].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noresamplelist'].replacements[0].activeChildren[1].stateValues.value.tree).eq(x2);
      expect(components['/noreresamplelist'].replacements[0].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noreresamplelist'].replacements[0].activeChildren[1].stateValues.value.tree).eq(x2);

      expect(components['/noresamplep'].replacements[0].activeChildren[1].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noresamplep'].replacements[0].activeChildren[1].activeChildren[1].stateValues.value.tree).eq(x2);
      expect(components['/noreresamplep'].replacements[0].activeChildren[1].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noreresamplep'].replacements[0].activeChildren[1].activeChildren[1].stateValues.value.tree).eq(x2);

    })
  });

  it("select doesn't change dynamically", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>Number to select: <mathinput prefill="5" name="numbertoselect"/></p>
    <p>First option: <mathinput prefill="a" name="x"/></p>
    <p>Second option: <mathinput prefill="b" name="y"/></p>
    <p>Third option: <mathinput prefill="c" name="z"/></p>
    <p name="pchoices">
    Selected choices: <aslist>
    <select name="sample1" withReplacement numbertoselect="$numbertoselect">
      <option><copy prop="value" tname="x" /></option>
      <option><copy prop="value" tname="y" /></option>
      <option><copy prop="value" tname="z" /></option>
    </select>
    </aslist>
    </p>

    <p name="pchoices2">Selected choices: <aslist><copy name="noresample" tname="sample1" /></aslist></p>

    <copy name="pchoices3" tname="pchoices" />

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let samplemaths;
    let sampleIndices;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let samplereplacements = components['/sample1'].replacements;
      expect(samplereplacements.length).eq(5);
      samplemaths = samplereplacements.map(x => x.replacements[0].replacements[0].stateValues.value.tree);
      for (let val of samplemaths) {
        expect(["a", "b", "c"].includes(val)).eq(true);
      }

      let choices2 = components['/pchoices2'].activeChildren[1].activeChildren;
      let choices3 = components['/pchoices3'].replacements[0].activeChildren[1].activeChildren;
      expect(choices2.length).eq(5);
      expect(choices3.length).eq(5);

      for (let ind = 0; ind < 5; ind++) {
        expect(choices2[ind].stateValues.value.tree).eq(samplemaths[ind]);
        expect(choices3[ind].stateValues.value.tree).eq(samplemaths[ind]);
      }

      sampleIndices = samplemaths.map(x => ["a", "b", "c"].indexOf(x) + 1);
      expect(components["/sample1"].stateValues.selectedIndices).eqls(sampleIndices)
      // expect(components["/noresample"].replacements[0].stateValues.selectedIndices).eqls(sampleIndices)
      expect(components['/pchoices3'].replacements[0].activeChildren[1].definingChildren[0].stateValues.selectedIndices).eqls(sampleIndices)
    });


    cy.log("Nothing changes when change number to select");
    cy.get('#\\/numbertoselect textarea').type(`{end}{backspace}7{enter}`, { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let samplereplacements = components['/sample1'].replacements;
      let choices2 = components['/pchoices2'].activeChildren[1].activeChildren;
      let choices3 = components['/pchoices3'].replacements[0].activeChildren[1].activeChildren;

      expect(samplereplacements.length).eq(5);
      expect(choices2.length).eq(5);
      expect(choices3.length).eq(5);
      for (let ind = 0; ind < 5; ind++) {
        expect(samplereplacements[ind].replacements[0].replacements[0].stateValues.value.tree).eq(samplemaths[ind]);
        expect(choices2[ind].stateValues.value.tree).eq(samplemaths[ind]);
        expect(choices3[ind].stateValues.value.tree).eq(samplemaths[ind]);
      }

      expect(components["/sample1"].stateValues.selectedIndices).eqls(sampleIndices)
      // expect(components["/noresample"].replacements[0].stateValues.selectedIndices).eqls(sampleIndices)
      expect(components['/pchoices3'].replacements[0].activeChildren[1].definingChildren[0].stateValues.selectedIndices).eqls(sampleIndices)

    })

    cy.log("Values change to reflect copy sources");

    let newvalues = {
      a: "q",
      b: "r",
      c: "s"
    }
    cy.get('#\\/x textarea').type("{end}{backspace}" + newvalues.a + `{enter}`, { force: true });
    cy.get('#\\/y textarea').type("{end}{backspace}" + newvalues.b + `{enter}`, { force: true });
    cy.get('#\\/z textarea').type("{end}{backspace}" + newvalues.c + `{enter}`, { force: true });

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let samplereplacements = components['/sample1'].replacements;
      let choices2 = components['/pchoices2'].activeChildren[1].activeChildren;
      let choices3 = components['/pchoices3'].replacements[0].activeChildren[1].activeChildren;

      expect(samplereplacements.length).eq(5);
      expect(choices2.length).eq(5);
      expect(choices3.length).eq(5);
      for (let ind = 0; ind < 5; ind++) {
        expect(samplereplacements[ind].replacements[0].replacements[0].stateValues.value.tree).eq(newvalues[samplemaths[ind]]);
        expect(choices2[ind].stateValues.value.tree).eq(newvalues[samplemaths[ind]]);
        expect(choices3[ind].stateValues.value.tree).eq(newvalues[samplemaths[ind]]);
      }

      expect(components["/sample1"].stateValues.selectedIndices).eqls(sampleIndices)
      // expect(components["/noresample"].replacements[0].stateValues.selectedIndices).eqls(sampleIndices)
      expect(components['/pchoices3'].replacements[0].activeChildren[1].definingChildren[0].stateValues.selectedIndices).eqls(sampleIndices)

    })


  });

  it("select doesn't resample in dynamic map", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    How many variables do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnames="a b c d e f">
      <template newNamespace>
        <select assignnames="(n)">
          <option><math>u</math></option>
          <option><math>v</math></option>
          <option><math>w</math></option>
          <option><math>x</math></option>
          <option><math>y</math></option>
          <option><math>z</math></option>
          <option><math>p</math></option>
          <option><math>q</math></option>
          <option><math>r</math></option>
          <option><math>s</math></option>
          <option><math>t</math></option>
        </select>
      </template>
      <sources>
      <sequence length="$_mathinput1"/>
      </sources>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><copy tname="_map1" /></aslist></p>
    <p name="p3"><copy tname="_aslist1" /></p>

    <copy name="p4" tname="p1" />
    <copy name="p5" tname="p2" />
    <copy name="p6" tname="p3" />

    <copy name="p7" tname="p4" />
    <copy name="p8" tname="p5" />
    <copy name="p9" tname="p6" />
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let sampledvariables = [];

    cy.log("initially nothing")
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("sample one variable");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value.tree;
      sampledvariables.push(n1);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get same number back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}1{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value.tree;
      expect(n1).eq(sampledvariables[0]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("get two more samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}3{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value.tree;
      let n2 = components['/b/n'].stateValues.value.tree;
      let n3 = components['/c/n'].stateValues.value.tree;
      expect(n1).eq(sampledvariables[0]);
      sampledvariables.push(n2);
      sampledvariables.push(n3);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });


    cy.log("get first two numbers back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}2{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value.tree;
      let n2 = components['/b/n'].stateValues.value.tree;
      expect(n1).eq(sampledvariables[0]);
      expect(n2).eq(sampledvariables[1]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("get six total samples");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value.tree;
      let n2 = components['/b/n'].stateValues.value.tree;
      let n3 = components['/c/n'].stateValues.value.tree;
      let n4 = components['/d/n'].stateValues.value.tree;
      let n5 = components['/e/n'].stateValues.value.tree;
      let n6 = components['/f/n'].stateValues.value.tree;
      expect(n1).eq(sampledvariables[0]);
      expect(n2).eq(sampledvariables[1]);
      expect(n3).eq(sampledvariables[2]);
      sampledvariables.push(n4);
      sampledvariables.push(n5);
      sampledvariables.push(n6);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}0{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get all six back");
    cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}6{enter}`, { force: true });
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let n1 = components['/a/n'].stateValues.value.tree;
      let n2 = components['/b/n'].stateValues.value.tree;
      let n3 = components['/c/n'].stateValues.value.tree;
      let n4 = components['/d/n'].stateValues.value.tree;
      let n5 = components['/e/n'].stateValues.value.tree;
      let n6 = components['/f/n'].stateValues.value.tree;
      expect(n1).eq(sampledvariables[0]);
      expect(n2).eq(sampledvariables[1]);
      expect(n3).eq(sampledvariables[2]);
      expect(n4).eq(sampledvariables[3]);
      expect(n5).eq(sampledvariables[4]);
      expect(n6).eq(sampledvariables[5]);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p7'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })


  });

  it('select single group of maths, assign names to grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p name="p1"><aslist><select assignnames="(x1 y1 z1)">
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p2"><aslist><select assignnames="(x2 y2 z2)">
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p3"><aslist><select assignnames="(x3 y3 z3)">
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="q1"><aslist><copy tname="x1" /><copy tname="y1" /><copy tname="z1" /></aslist></p>
    <p name="q2"><aslist><copy tname="x2" /><copy tname="y2" /><copy tname="z2" /></aslist></p>
    <p name="q3"><aslist><copy tname="x3" /><copy tname="y3" /><copy tname="z3" /></aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let lists = {
      x: ["x", "y", "z"],
      u: ["u", "v", "w"],
      a: ["a", "b", "c"],
      q: ["q", "r", "s"]
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/x1'].stateValues.value.tree;
      let y1 = components['/y1'].stateValues.value.tree;
      let z1 = components['/z1'].stateValues.value.tree;
      let x2 = components['/x2'].stateValues.value.tree;
      let y2 = components['/y2'].stateValues.value.tree;
      let z2 = components['/z2'].stateValues.value.tree;
      let x3 = components['/x3'].stateValues.value.tree;
      let y3 = components['/y3'].stateValues.value.tree;
      let z3 = components['/z3'].stateValues.value.tree;

      let list1 = lists[x1];
      let list2 = lists[x2];
      let list3 = lists[x3];

      expect(y1).eq(list1[1]);
      expect(z1).eq(list1[2]);
      expect(y2).eq(list2[1]);
      expect(z2).eq(list2[2]);
      expect(y3).eq(list3[1]);
      expect(z3).eq(list3[2]);

      for (let name of ["/p1", "/q1"]) {
        let aslistChildren = components[name].activeChildren[0].activeChildren;
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value.tree).eq(list1[ind]);
        }
      }
      for (let name of ["/p2", "/q2"]) {
        let aslistChildren = components[name].activeChildren[0].activeChildren;
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value.tree).eq(list2[ind]);
        }
      }
      for (let name of ["/p3", "/q3"]) {
        let aslistChildren = components[name].activeChildren[0].activeChildren;
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value.tree).eq(list3[ind]);
        }
      }


    })
  });

  it('select single group of maths, assign names with namespace to grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p name="p1"><aslist><select assignnames="(x y z)" name="s1" newnamespace>
      <option><math>u</math><math>v</math><math>w</math></option>
      <option><math>x</math><math>y</math><math>z</math></option>
      <option><math>a</math><math>b</math><math>c</math></option>
      <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p2"><aslist><select assignnames="(x y z)" name="s2" newnamespace>
    <option><math>u</math><math>v</math><math>w</math></option>
    <option><math>x</math><math>y</math><math>z</math></option>
    <option><math>a</math><math>b</math><math>c</math></option>
    <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="p3"><aslist><select assignnames="(x y z)" name="s3" newnamespace>
    <option><math>u</math><math>v</math><math>w</math></option>
    <option><math>x</math><math>y</math><math>z</math></option>
    <option><math>a</math><math>b</math><math>c</math></option>
    <option><math>q</math><math>r</math><math>s</math></option>
    </select></aslist></p>
    <p name="q1"><aslist><copy tname="s1/x" /><copy tname="s1/y" /><copy tname="s1/z" /></aslist></p>
    <p name="q2"><aslist><copy tname="s2/x" /><copy tname="s2/y" /><copy tname="s2/z" /></aslist></p>
    <p name="q3"><aslist><copy tname="s3/x" /><copy tname="s3/y" /><copy tname="s3/z" /></aslist></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let lists = {
      x: ["x", "y", "z"],
      u: ["u", "v", "w"],
      a: ["a", "b", "c"],
      q: ["q", "r", "s"]
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/s1/x'].stateValues.value.tree;
      let y1 = components['/s1/y'].stateValues.value.tree;
      let z1 = components['/s1/z'].stateValues.value.tree;
      let x2 = components['/s2/x'].stateValues.value.tree;
      let y2 = components['/s2/y'].stateValues.value.tree;
      let z2 = components['/s2/z'].stateValues.value.tree;
      let x3 = components['/s3/x'].stateValues.value.tree;
      let y3 = components['/s3/y'].stateValues.value.tree;
      let z3 = components['/s3/z'].stateValues.value.tree;

      let list1 = lists[x1];
      let list2 = lists[x2];
      let list3 = lists[x3];

      expect(y1).eq(list1[1]);
      expect(z1).eq(list1[2]);
      expect(y2).eq(list2[1]);
      expect(z2).eq(list2[2]);
      expect(y3).eq(list3[1]);
      expect(z3).eq(list3[2]);

      for (let name of ["/p1", "/q1"]) {
        let aslistChildren = components[name].activeChildren[0].activeChildren;
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value.tree).eq(list1[ind]);
        }
      }
      for (let name of ["/p2", "/q2"]) {
        let aslistChildren = components[name].activeChildren[0].activeChildren;
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value.tree).eq(list2[ind]);
        }
      }
      for (let name of ["/p3", "/q3"]) {
        let aslistChildren = components[name].activeChildren[0].activeChildren;
        for (let ind = 0; ind < 3; ind++) {
          expect(aslistChildren[ind].stateValues.value.tree).eq(list3[ind]);
        }
      }


    })
  });

  it('select multiple group of maths, assign names to grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p name="p1"><aslist>
      <select assignnames="(x1 y1 z1) (x2 y2 z2) (x3 y3 z3)" numbertoselect="3">
        <option><math>u</math><math>v</math><math>w</math></option>
        <option><math>x</math><math>y</math><math>z</math></option>
        <option><math>a</math><math>b</math><math>c</math></option>
        <option><math>q</math><math>r</math><math>s</math></option>
      </select>
    </aslist></p>
    <p name="q1"><aslist>
      <copy tname="x1" /><copy tname="y1" /><copy tname="z1" />
      <copy tname="x2" /><copy tname="y2" /><copy tname="z2" />
      <copy tname="x3" /><copy tname="y3" /><copy tname="z3" />
    </aslist></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let lists = {
      x: ["x", "y", "z"],
      u: ["u", "v", "w"],
      a: ["a", "b", "c"],
      q: ["q", "r", "s"]
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/x1'].stateValues.value.tree;
      let y1 = components['/y1'].stateValues.value.tree;
      let z1 = components['/z1'].stateValues.value.tree;
      let x2 = components['/x2'].stateValues.value.tree;
      let y2 = components['/y2'].stateValues.value.tree;
      let z2 = components['/z2'].stateValues.value.tree;
      let x3 = components['/x3'].stateValues.value.tree;
      let y3 = components['/y3'].stateValues.value.tree;
      let z3 = components['/z3'].stateValues.value.tree;

      let list1 = lists[x1];
      let list2 = lists[x2];
      let list3 = lists[x3];

      let listsByInd = [list1, list2, list3];

      expect(x1).not.eq(x2);
      expect(x1).not.eq(x3);
      expect(x2).not.eq(x3);

      expect(y1).eq(list1[1]);
      expect(z1).eq(list1[2]);
      expect(y2).eq(list2[1]);
      expect(z2).eq(list2[2]);
      expect(y3).eq(list3[1]);
      expect(z3).eq(list3[2]);

      for (let name of ["/p1", "/q1"]) {
        let astlistChildren = components[name].activeChildren[0].activeChildren
        for (let ind1 = 0; ind1 < 3; ind1++) {
          for (let ind2 = 0; ind2 < 3; ind2++) {
            expect(astlistChildren[ind1 * 3 + ind2].stateValues.value.tree).eq(listsByInd[ind1][ind2]);
          }
        }
      }

    })
  });

  it('references to outside components', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select assignnames="q r s t u" numbertoselect="5" withreplacement>
      <option newNamespace><p>Option 1: <math>3<copy tname="../x1" /><copy tname="../y1" /></math></p></option>
      <option><p name="h" newnamespace>Option 2: <math>4<copy tname="../x2" /><copy tname="../y2" /></math></p></option>
      <option newNamespace><p name="l">Option 3: <math>5<copy tname="../x3" /><copy tname="../y3" /></math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let option = {
      "Option 1: ": me.fromText("3xa"),
      "Option 2: ": me.fromText("4yb"),
      "Option 3: ": me.fromText('5zc')
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let q2 = components['/q2'].replacements[0].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);

    })
  });

  it('references to outside components, no new namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <math hide name="x1">x</math>
    <math hide name="x2">y</math>
    <math hide name="x3">z</math>

    <select assignnames="q r s t u" numbertoselect="5" withreplacement>
      <option><p>Option 1: <math>3<copy tname="x1" /><copy tname="y1" /></math></p></option>
      <option><p name="h">Option 2: <math>4<copy tname="x2" /><copy tname="y2" /></math></p></option>
      <option><p name="l">Option 3: <math>5<copy tname="x3" /><copy tname="y3" /></math></p></option>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    let option = {
      "Option 1: ": me.fromText("3xa"),
      "Option 2: ": me.fromText("4yb"),
      "Option 3: ": me.fromText('5zc')
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let q2 = components['/q2'].replacements[0].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);

    })
  });

  it('internal references', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <select assignnames="q r s t u" numbertoselect="5" withreplacement>
      <option newNamespace><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + <copy tname="x" />^2<copy tname="z1" />^3</math></p></option>
      <option newNamespace><p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + <copy tname="x" />^2<copy tname="z2" />^3</math></p></option>
      <option newNamespace><p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + <copy tname="x" />^2<copy tname="z3" />^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />

    <p>Copy x from within selection options</p>
    <p><copy name="qx" tname="q/x" /></p>
    <p><copy name="rx" tname="r/x" /></p>
    <p><copy name="sx" tname="s/x" /></p>
    <p><copy name="tx" tname="t/x" /></p>
    <p><copy name="ux" tname="u/x" /></p>

    <p>Copy select itself</p>
    <section name="repeat"><copy tname="_select1" /></section>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let option = {
      "Option 1: ": me.fromText("3x+a+x^2a^3"),
      "Option 2: ": me.fromText("4y+b+y^2b^3"),
      "Option 3: ": me.fromText('5z+c+z^2c^3')
    }

    let xoption = {
      "Option 1: ": "x",
      "Option 2: ": "y",
      "Option 3: ": "z"
    }


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let q2 = components['/q2'].replacements[0].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);
      let qx = components['/qx'].replacements[0].stateValues.value.tree;
      expect(qx).eq(xoption[q2string]);
      let repeatqmath = components["/repeat"].activeChildren[0].activeChildren[1].stateValues.value;
      expect(repeatqmath.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);
      let rx = components['/rx'].replacements[0].stateValues.value.tree;
      expect(rx).eq(xoption[r2string]);
      let repeatrmath = components["/repeat"].activeChildren[1].activeChildren[1].stateValues.value;
      expect(repeatrmath.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);
      let sx = components['/sx'].replacements[0].stateValues.value.tree;
      expect(sx).eq(xoption[s2string]);
      let repeatsmath = components["/repeat"].activeChildren[2].activeChildren[1].stateValues.value;
      expect(repeatsmath.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);
      let tx = components['/tx'].replacements[0].stateValues.value.tree;
      expect(tx).eq(xoption[t2string]);
      let repeattmath = components["/repeat"].activeChildren[3].activeChildren[1].stateValues.value;
      expect(repeattmath.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);
      let ux = components['/ux'].replacements[0].stateValues.value.tree;
      expect(ux).eq(xoption[u2string]);
      let repeatumath = components["/repeat"].activeChildren[4].activeChildren[1].stateValues.value;
      expect(repeatumath.equals(option[u2string])).eq(true);

    })
  });

  it('internal references with no new namespace', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <select assignnames="q r s t u" numbertoselect="5" withreplacement>
      <option><p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + <copy tname="x" />^2<copy tname="z1" />^3</math></p></option>
      <option><p>Option 2: <math>4<math name="y">y</math> + <math name="z2">b</math> + <copy tname="y" />^2<copy tname="z2" />^3</math></p></option>
      <option><p>Option 3: <math>5<math name="z">z</math> + <math name="z3">c</math> + <copy tname="z" />^2<copy tname="z3" />^3</math></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />

    <p>Copy select itself</p>
    <section name="repeat"><copy tname="_select1" /></section>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    let option = {
      "Option 1: ": me.fromText("3x+a+x^2a^3"),
      "Option 2: ": me.fromText("4y+b+y^2b^3"),
      "Option 3: ": me.fromText('5z+c+z^2c^3')
    }

    let xoption = {
      "Option 1: ": "x",
      "Option 2: ": "y",
      "Option 3: ": "z"
    }


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let q2 = components['/q2'].replacements[0].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);
      let repeatqmath = components["/repeat"].activeChildren[0].activeChildren[1].stateValues.value;
      expect(repeatqmath.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);
      let repeatrmath = components["/repeat"].activeChildren[1].activeChildren[1].stateValues.value;
      expect(repeatrmath.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);
      let repeatsmath = components["/repeat"].activeChildren[2].activeChildren[1].stateValues.value;
      expect(repeatsmath.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);
      let repeattmath = components["/repeat"].activeChildren[3].activeChildren[1].stateValues.value;
      expect(repeattmath.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);
      let repeatumath = components["/repeat"].activeChildren[4].activeChildren[1].stateValues.value;
      expect(repeatumath.equals(option[u2string])).eq(true);

    })
  });

  it('variant names specified, select single', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="5" variantNames="aVocado  broCColi   carrot  Dill eggplanT"/>

    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="dill"><math>d</math></option>
      <option selectForVariantNames="Carrot"><math>c</math></option>
      <option selectForVariantNames="eggPlant"><math>e</math></option>
      <option selectForVariantNames="avocadO"><math>a</math></option>
      <option selectForVariantNames="broccOli"><math>b</math></option>
    </select>
    </p>

    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variantName = components['/x'].sharedParameters.variantName;
      let expectedx = variantName.substring(0, 1);

      let x = components['/x'].stateValues.value.tree;

      expect(x).eq(expectedx);

      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);

      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);

      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);

    })
  });

  it('variant names specified, select multiple', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="5" variantNames="avocado  brOccoli   carrot  dill    eggPlant  "/>

    <p>Selected variables:
    <aslist>
    <select assignnames="(x)  (y)  (z)" numbertoselect="3">
      <option selectForVariantNames="dill  carrot  avocado"><math>d</math></option>
      <option selectForVariantNames="cArrOt eggplant eggplant"><math>c</math></option>
      <option selectForVariantNames="eggplant  broccoli  dilL"><math>e</math></option>
      <option selectForVariantNames="aVocado   avocado   broccoli"><math>a</math></option>
      <option selectForVariantNames="  broccoli     caRRot     dill    "><math>b</math></option>
    </select>
    </aslist>
    </p>

    <p>Selected first variable: <copy name="x2" tname="x" /></p>
    <p>Selected second variable: <copy name="y2" tname="y" /></p>
    <p>Selected third variable: <copy name="z2" tname="z" /></p>
    <p>Selected variables repeated: <aslist><copy name="s2" tname="_select1" /></aslist></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variantMap = {
        avocado: ["d", "a", "a"],
        broccoli: ["e", "a", "b"],
        carrot: ["d", "c", "b"],
        dill: ["d", "e", "b"],
        eggplant: ["c", "c", "e"]
      }

      let variantName = components['/x'].sharedParameters.variantName;
      let variantVars = variantMap[variantName];

      let x = components['/x'].stateValues.value.tree;

      expect(variantVars.includes(x)).eq(true);
      variantVars.splice(variantVars.indexOf(x), 1);

      let y = components['/y'].stateValues.value.tree;
      expect(variantVars.includes(y)).eq(true);
      variantVars.splice(variantVars.indexOf(y), 1);

      let z = components['/z'].stateValues.value.tree;
      expect(z).eq(variantVars[0]);

      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(x);
      let yorig = components['/_select1'].replacements[1].replacements[0].stateValues.value.tree;
      expect(yorig).eq(y);
      let zorig = components['/_select1'].replacements[2].replacements[0].stateValues.value.tree;
      expect(zorig).eq(z);

      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(x);
      let y2 = components['/y2'].replacements[0].stateValues.value.tree;
      expect(y2).eq(y);
      let z2 = components['/z2'].replacements[0].stateValues.value.tree;
      expect(z2).eq(z);

      let x3 = components['/s2'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(x);
      let y3 = components['/s2'].replacements[1].replacements[0].stateValues.value.tree;
      expect(y3).eq(y);
      let z3 = components['/s2'].replacements[2].replacements[0].stateValues.value.tree;
      expect(z3).eq(z);

    })
  });

  it('select math as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select type="math" assignnames="(m1) (m2) (m3) (m4) (m5)" numbertoselect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let options = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"]
      .map(x => me.fromText(x))

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let math = components['/m' + ind].stateValues.value;
        expect(options.some(x => x.equalsViaSyntax(math))).eq(true);
        expect(mathsSoFar.some(x => x.equalsViaSyntax(math))).eq(false);
        mathsSoFar.push(math);
      }
    })
  });

  it('select math as sugar, no type specified', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select assignnames="(m1) (m2) (m3) (m4) (m5)" numbertoselect="5">
      x^2  x/y  u  a  b-c  s+t  mn  -1
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    let options = ["x^2", "x/y", "u", "a", "b-c", "s+t", "mn", "-1"]
      .map(x => me.fromText(x))

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let mathsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let math = components['/m' + ind].stateValues.value;
        expect(options.some(x => x.equalsViaSyntax(math))).eq(true);
        expect(mathsSoFar.some(x => x.equalsViaSyntax(math))).eq(false);
        mathsSoFar.push(math);
      }
    })
  });

  it('select text as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select type="text" assignnames="(w1) (w2) (w3) (w4) (w5)" numbertoselect="5">
      Lorem  ipsum  dolor  sit  amet  consectetur  adipiscing  elit
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let wordsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let word = components['/w' + ind].stateValues.value;
        expect(["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"].includes(word)).eq(true);
        expect(wordsSoFar.includes(word)).eq(false);
        wordsSoFar.push(word);
      }
    })
  });

  it('select number as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select type="number" assignnames="(n1) (n2) (n3) (n4) (n5) (n6) (n7) (n8) (n9) (n10)" numbertoselect="10" withReplacement>
      2 3 5 7 11 13 17 19
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 10; ind++) {
        let num = components['/n' + ind].stateValues.value;
        expect([2, 3, 5, 7, 11, 13, 17, 19].includes(num)).eq(true);
      }
    })
  });

  it('select boolean as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select type="boolean" assignnames="(b1) (b2) (b3) (b4) (b5) (b6) (b7) (b8) (b9) (b10) (b11) (b12) (b13) (b14) (b15) (b16) (b17) (b18) (b19) (b20)" numbertoselect="20" withReplacement>
      true false
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let foundTrue = false, foundFalse = false;
      for (let ind = 1; ind <= 20; ind++) {
        let bool = components['/b' + ind].stateValues.value;
        expect([true, false].includes(bool)).eq(true);
        if(bool === true) {
          foundTrue = true;
        } else {
          foundFalse = true;
        }
      }
      expect(foundTrue).be.true;
      expect(foundFalse).be.true;
    })
  });

  it('select weighted', () => {

    // TODO: this test seems to fail with num Y < 17 once in awhile
    // even though it should fail less than 0.1% of the time
    // Is there a flaw?

    let numX = 0, numY = 0, numZ = 0;

    for (let ind = 1; ind <= 200; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantcontrol nvariants="200"/>
        <aslist>
        <select assignnames="(x)">
          <option selectweight="0.2"><text>x</text></option>
          <option><text>y</text></option>
          <option selectweight="5"><text>z</text></option>
          </select>
        </aslist>
        `,
          requestedVariant: { index: ind },
        }, "*");
      });

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let x = components['/x'].stateValues.value;
        if (x === "z") {
          numZ++;
        } else if (x === "y") {
          numY++;
        } else {
          numX++;
        }
      });

    }

    cy.window().then((win) => {

      expect(numX).greaterThan(0);
      expect(numX).lessThan(15);
      expect(numY).greaterThan(17);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(140);

    })
  });

  it('select weighted with replacement', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <aslist>
    <select numbertoselect="200" withreplacement>
      <option selectweight="0.2"><text>x</text></option>
      <option><text>y</text></option>
      <option selectweight="5"><text>z</text></option>
    </select>
    </aslist>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let numX = 0, numY = 0, numZ = 0;
      let selectReplacements = components['/_select1'].replacements;
      for (let ind = 0; ind < 200; ind++) {
        let x = selectReplacements[ind].replacements[0].stateValues.value;
        if (x === "x") {
          numX++;
        } else if (x === "y") {
          numY++;
        } else {
          numZ++;
        }
      }
      expect(numX).greaterThan(0);
      expect(numX).lessThan(15);
      expect(numY).greaterThan(20);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(150);

    })
  });

  it('select weighted without replacement', () => {

    let numX = 0, numY = 0, numZ = 0, numUVW = 0;

    for (let ind = 1; ind <= 200; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantcontrol nvariants="200"/>
        <aslist>
        <select assignnames="(x) (y)" numbertoselect="2">
          <option selectweight="0.1"><text>u</text></option>
          <option selectweight="0.1"><text>v</text></option>
          <option selectweight="0.1"><text>w</text></option>
          <option selectweight="5"><text>x</text></option>
          <option><text>y</text></option>
          <option selectweight="10"><text>z</text></option>
        </select>
        </aslist>
        `,
          requestedVariant: { index: ind },
        }, "*");
      });


      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        let x = components['/x'].stateValues.value;
        if (x === "z") {
          numZ++;
        } else if (x === "y") {
          numY++;
        } else if (x === "x") {
          numX++;
        } else {
          numUVW++;
        }
        let y = components['/y'].stateValues.value;
        if (y === "z") {
          numZ++;
        } else if (y === "y") {
          numY++;
        } else if (y === "x") {
          numX++;
        } else {
          numUVW++;
        }
      });

    }

    cy.window().then((win) => {
      expect(numUVW).greaterThan(0);
      expect(numUVW).lessThan(15);
      expect(numX).greaterThan(150);
      expect(numY).greaterThan(10);
      expect(numY).lessThan(50);
      expect(numZ).greaterThan(170);

    })
  });

  it('references to internal assignnames', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <select name="original" assignnames="(q) (r) (s) (t) (u) (v) (w)" numbertoselect="7" withreplacement>
      <option><p newNamespace><select assignnames="(q) (r)" numbertoselect="2">a e i o u</select><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p></option>
      <option><p newNamespace><selectfromsequence type="letters" assignnames="q r" numbertoselect="2" from="a" to="z" /><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p></option>
      <option><p newNamespace><text name="q">z</text><selectfromsequence type="letters" assignnames="r" numbertoselect="1" from="u" to="z" /><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p></option>
      <option><p newNamespace><text name="q">q</text><text name="r">r</text><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />
    <copy name="v2" tname="v" />
    <copy name="w2" tname="w" />

    <p>Copy q and r and their copies from within selected options</p>
    <p><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /><copy name="qq2" tname="q/q2" /><copy name="qr2" tname="q/r2" /></p>
    <p><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /><copy name="rq2" tname="r/q2" /><copy name="rr2" tname="r/r2" /></p>
    <p><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /><copy name="sq2" tname="s/q2" /><copy name="sr2" tname="s/r2" /></p>
    <p><copy name="tq" tname="t/q" /><copy name="tr" tname="t/r" /><copy name="tq2" tname="t/q2" /><copy name="tr2" tname="t/r2" /></p>
    <p><copy name="uq" tname="u/q" /><copy name="ur" tname="u/r" /><copy name="uq2" tname="u/q2" /><copy name="ur2" tname="u/r2" /></p>
    <p><copy name="vq" tname="v/q" /><copy name="vr" tname="v/r" /><copy name="vq2" tname="v/q2" /><copy name="vr2" tname="v/r2" /></p>
    <p><copy name="wq" tname="w/q" /><copy name="wr" tname="w/r" /><copy name="wq2" tname="w/q2" /><copy name="wr2" tname="w/r2" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].activeChildren.map(x => x.stateValues.value)
      let rs = components['/r'].activeChildren.map(x => x.stateValues.value)
      let ss = components['/s'].activeChildren.map(x => x.stateValues.value)
      let ts = components['/t'].activeChildren.map(x => x.stateValues.value)
      let us = components['/u'].activeChildren.map(x => x.stateValues.value)
      let vs = components['/v'].activeChildren.map(x => x.stateValues.value)
      let ws = components['/w'].activeChildren.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let v2s = components['/v2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let w2s = components['/w2'].replacements[0].activeChildren.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);
      expect(v2s).eqls(vs);
      expect(w2s).eqls(ws);

      let q3s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
        components['/qq2'].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].stateValues.value,
      ]
      let r3s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
        components['/rq2'].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].stateValues.value,
      ]
      let s3s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
        components['/sq2'].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].stateValues.value,
      ]
      let t3s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
        components['/tq2'].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].stateValues.value,
      ]
      let u3s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
        components['/uq2'].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].stateValues.value,
      ]
      let v3s = [
        components['/vq'].replacements[0].stateValues.value,
        components['/vr'].replacements[0].stateValues.value,
        components['/vq2'].replacements[0].stateValues.value,
        components['/vr2'].replacements[0].stateValues.value,
      ]
      let w3s = [
        components['/wq'].replacements[0].stateValues.value,
        components['/wr'].replacements[0].stateValues.value,
        components['/wq2'].replacements[0].stateValues.value,
        components['/wr2'].replacements[0].stateValues.value,
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);
      expect(v3s).eqls(vs);
      expect(w3s).eqls(ws);

    })
  });

  it('references to internal assignnames, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select name="original" assignnames="(q) (r) (s) (t) (u) (v) (w)" numbertoselect="7" withreplacement>
      <option><p newNamespace><select name="s" newnamespace assignnames="(q) (r)" numbertoselect="2">a e i o u</select><copy name="q2" tname="s/q" /><copy name="r2" tname="s/r" /></p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numbertoselect="2" from="a" to="z" /><copy name="q2" tname="s/q" /><copy name="r2" tname="s/r" /></p></option>
      <option><p newNamespace><selectfromsequence type="letters" name="s" newnamespace assignnames="q r" numbertoselect="2" withreplacement from="u" to="z" /><copy name="q2" tname="s/q" /><copy name="r2" tname="s/r" /></p></option>
    </select>

    <p>Selected options repeated</p>
    <copy name="q2" tname="q" />
    <copy name="r2" tname="r" />
    <copy name="s2" tname="s" />
    <copy name="t2" tname="t" />
    <copy name="u2" tname="u" />
    <copy name="v2" tname="v" />
    <copy name="w2" tname="w" />

    <p>Selected options repeated, no p</p>
    <p><copy name="q3" tname="q/s" /></p>
    <p><copy name="r3" tname="r/s" /></p>
    <p><copy name="s3" tname="s/s" /></p>
    <p><copy name="t3" tname="t/s" /></p>
    <p><copy name="u3" tname="u/s" /></p>
    <p><copy name="v3" tname="v/s" /></p>
    <p><copy name="w3" tname="w/s" /></p>

    <p>Copy q and r from within selected options</p>
    <p><copy name="qq" tname="q/s/q" /><copy name="qr" tname="q/s/r" /><copy name="qq2" tname="q/q2" /><copy name="qr2" tname="q/r2" /></p>
    <p><copy name="rq" tname="r/s/q" /><copy name="rr" tname="r/s/r" /><copy name="rq2" tname="r/q2" /><copy name="rr2" tname="r/r2" /></p>
    <p><copy name="sq" tname="s/s/q" /><copy name="sr" tname="s/s/r" /><copy name="sq2" tname="s/q2" /><copy name="sr2" tname="s/r2" /></p>
    <p><copy name="tq" tname="t/s/q" /><copy name="tr" tname="t/s/r" /><copy name="tq2" tname="t/q2" /><copy name="tr2" tname="t/r2" /></p>
    <p><copy name="uq" tname="u/s/q" /><copy name="ur" tname="u/s/r" /><copy name="uq2" tname="u/q2" /><copy name="ur2" tname="u/r2" /></p>
    <p><copy name="vq" tname="v/s/q" /><copy name="vr" tname="v/s/r" /><copy name="vq2" tname="v/q2" /><copy name="vr2" tname="v/r2" /></p>
    <p><copy name="wq" tname="w/s/q" /><copy name="wr" tname="w/s/r" /><copy name="wq2" tname="w/q2" /><copy name="wr2" tname="w/r2" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].activeChildren.map(x => x.stateValues.value)
      let rs = components['/r'].activeChildren.map(x => x.stateValues.value)
      let ss = components['/s'].activeChildren.map(x => x.stateValues.value)
      let ts = components['/t'].activeChildren.map(x => x.stateValues.value)
      let us = components['/u'].activeChildren.map(x => x.stateValues.value)
      let vs = components['/v'].activeChildren.map(x => x.stateValues.value)
      let ws = components['/w'].activeChildren.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let v2s = components['/v2'].replacements[0].activeChildren.map(x => x.stateValues.value);
      let w2s = components['/w2'].replacements[0].activeChildren.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);
      expect(v2s).eqls(vs);
      expect(w2s).eqls(ws);

      let q3s = components['/q3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let r3s = components['/r3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let s3s = components['/s3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let t3s = components['/t3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let u3s = components['/u3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let v3s = components['/v3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let w3s = components['/w3'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);

      expect(q3s).eqls(qs.slice(0, 2));
      expect(r3s).eqls(rs.slice(0, 2));
      expect(s3s).eqls(ss.slice(0, 2));
      expect(t3s).eqls(ts.slice(0, 2));
      expect(u3s).eqls(us.slice(0, 2));
      expect(v3s).eqls(vs.slice(0, 2));
      expect(w3s).eqls(ws.slice(0, 2));

      let q4s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
        components['/qq2'].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].stateValues.value,
      ]
      let r4s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
        components['/rq2'].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].stateValues.value,
      ]
      let s4s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
        components['/sq2'].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].stateValues.value,
      ]
      let t4s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
        components['/tq2'].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].stateValues.value,
      ]
      let u4s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
        components['/uq2'].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].stateValues.value,
      ]
      let v4s = [
        components['/vq'].replacements[0].stateValues.value,
        components['/vr'].replacements[0].stateValues.value,
        components['/vq2'].replacements[0].stateValues.value,
        components['/vr2'].replacements[0].stateValues.value,
      ]
      let w4s = [
        components['/wq'].replacements[0].stateValues.value,
        components['/wr'].replacements[0].stateValues.value,
        components['/wq2'].replacements[0].stateValues.value,
        components['/wr2'].replacements[0].stateValues.value,
      ]

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);
      expect(v4s).eqls(vs);
      expect(w4s).eqls(ws);

    })
  });

  // can no longer reference between named grandchildren using their original names
  it.skip('references to internal assignnames, named grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <select name="original" assignnames="(q qq  qr) (r  rq rr) (s  sq  sr) (t  tq  tr) (u uq ur)" numbertoselect="5" withreplacement>
      <p><select assignnames="q r" numbertoselect="2">a e i o u</select><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
      <p><selectfromsequence type="letters" assignnames="q r" numbertoselect="2">a z</selectfromsequence><copy name="q2" tname="q" /><copy name="r2" tname="r" /></p>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p><copy name="qq2" tname="q/q" /><copy name="qr2" tname="q/r" /><copy name="qq3" tname="qq" /><copy name="qr3" tname="qr" /></p>
    <p><copy name="rq2" tname="r/q" /><copy name="rr2" tname="r/r" /><copy name="rq3" tname="rq" /><copy name="rr3" tname="rr" /></p>
    <p><copy name="sq2" tname="s/q" /><copy name="sr2" tname="s/r" /><copy name="sq3" tname="sq" /><copy name="sr3" tname="sr" /></p>
    <p><copy name="tq2" tname="t/q" /><copy name="tr2" tname="t/r" /><copy name="tq3" tname="tq" /><copy name="tr3" tname="tr" /></p>
    <p><copy name="uq2" tname="u/q" /><copy name="ur2" tname="u/r" /><copy name="uq3" tname="uq" /><copy name="ur3" tname="ur" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq2'].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].stateValues.value,
      ];
      let q4s = [
        components['/qq3'].replacements[0].stateValues.value,
        components['/qr3'].replacements[0].stateValues.value,
      ];
      let r3s = [
        components['/rq2'].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rq3'].replacements[0].stateValues.value,
        components['/rr3'].replacements[0].stateValues.value,
      ];
      let s3s = [
        components['/sq2'].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sq3'].replacements[0].stateValues.value,
        components['/sr3'].replacements[0].stateValues.value,
      ];
      let t3s = [
        components['/tq2'].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].stateValues.value,
      ];
      let t4s = [
        components['/tq3'].replacements[0].stateValues.value,
        components['/tr3'].replacements[0].stateValues.value,
      ];
      let u3s = [
        components['/uq2'].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].stateValues.value,
      ];
      let u4s = [
        components['/uq3'].replacements[0].stateValues.value,
        components['/ur3'].replacements[0].stateValues.value,
      ];


      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);

    })
  });

  // can no longer reference between named grandchildren using their original names
  it.skip('references to internal assignnames, newnamespaces, named grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
        <select name="original" assignnames="(q qq  qr) (r  rq rr) (s  sq  sr) (t  tq  tr) (u uq ur)" numbertoselect="5" withreplacement>
      <p><select name="a" assignnames="q r" numbertoselect="2" newnamespace>a e i o u</select><copy name="q2" tname="a/q" /><copy name="r2" tname="a/r" /></p>
      <p><selectfromsequence type="letters" name="b" assignnames="q r" numbertoselect="2" newnamespace>a z</selectfromsequence><copy name="q2" tname="b/q" /><copy name="r2" tname="b/r" /></p>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r and their copies from within selected options</p>
    <p><copy name="qq2" tname="q/q" /><copy name="qr2" tname="q/r" /><copy name="qq3" tname="qq" /><copy name="qr3" tname="qr" /></p>
    <p><copy name="rq2" tname="r/q" /><copy name="rr2" tname="r/r" /><copy name="rq3" tname="rq" /><copy name="rr3" tname="rr" /></p>
    <p><copy name="sq2" tname="s/q" /><copy name="sr2" tname="s/r" /><copy name="sq3" tname="sq" /><copy name="sr3" tname="sr" /></p>
    <p><copy name="tq2" tname="t/q" /><copy name="tr2" tname="t/r" /><copy name="tq3" tname="tq" /><copy name="tr3" tname="tr" /></p>
    <p><copy name="uq2" tname="u/q" /><copy name="ur2" tname="u/r" /><copy name="uq3" tname="uq" /><copy name="ur3" tname="ur" /></p>


    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.stateValues.value)

      let q2s = components['/q2'].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements.map(x => x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq2'].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].stateValues.value,
      ];
      let q4s = [
        components['/qq3'].replacements[0].stateValues.value,
        components['/qr3'].replacements[0].stateValues.value,
      ];
      let r3s = [
        components['/rq2'].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rq3'].replacements[0].stateValues.value,
        components['/rr3'].replacements[0].stateValues.value,
      ];
      let s3s = [
        components['/sq2'].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sq3'].replacements[0].stateValues.value,
        components['/sr3'].replacements[0].stateValues.value,
      ];
      let t3s = [
        components['/tq2'].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].stateValues.value,
      ];
      let t4s = [
        components['/tq3'].replacements[0].stateValues.value,
        components['/tr3'].replacements[0].stateValues.value,
      ];
      let u3s = [
        components['/uq2'].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].stateValues.value,
      ];
      let u4s = [
        components['/uq3'].replacements[0].stateValues.value,
        components['/ur3'].replacements[0].stateValues.value,
      ];


      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);
      expect(t4s).eqls(ts);
      expect(u4s).eqls(us);

    })
  });

  it('references to select of selects', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select name="original" assignnames="(q) (r) (s) (t) (u)" numbertoselect="5" withreplacement>
      <option><select newNamespace assignnames="(q) (r)" numbertoselect="2">a e i o u</select></option>
      <option><selectfromsequence type="letters" newNamespace assignnames="q r" numbertoselect="2" from="a" to="z" /></option>
    </select>

    <p>Selected options repeated</p>
    <p><copy name="q2" tname="q" /></p>
    <p><copy name="r2" tname="r" /></p>
    <p><copy name="s2" tname="s" /></p>
    <p><copy name="t2" tname="t" /></p>
    <p><copy name="u2" tname="u" /></p>

    <p>Copy x/q and x/r</p>
    <p><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /></p>
    <p><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /></p>
    <p><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /></p>
    <p><copy name="tq" tname="t/q" /><copy name="tr" tname="t/r" /></p>
    <p><copy name="uq" tname="u/q" /><copy name="ur" tname="u/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value)
      let rs = components['/r'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value)
      let ss = components['/s'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value)
      let ts = components['/t'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value)
      let us = components['/u'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value)

      let q2s = components['/q2'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let r2s = components['/r2'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let s2s = components['/s2'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let t2s = components['/t2'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);
      let u2s = components['/u2'].replacements.map(x => x.replacements ? x.replacements[0].stateValues.value : x.stateValues.value);

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);
      expect(t2s).eqls(ts);
      expect(u2s).eqls(us);

      let q3s = [
        components['/qq'].replacements[0].stateValues.value,
        components['/qr'].replacements[0].stateValues.value,
      ]
      let r3s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
      ]
      let s3s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
      ]
      let t3s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
      ]
      let u3s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);
      expect(t3s).eqls(ts);
      expect(u3s).eqls(us);

    })
  });

  it('references to select of selects of selects', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <select assignnames="q r s" numbertoselect="3" withreplacement>
      <option newNamespace><select assignnames="q r s" numbertoselect="3" withreplacement>
        <option newNamespace><select type="text" assignnames="q r" numbertoselect="2">a e i o u</select></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numbertoselect="2" from="a" to="j" /></option>
      </select></option>
      <option newNamespace><select assignnames="q r s" numbertoselect="3">
        <option newNamespace><select type="text" assignnames="q r" numbertoselect="2">v w x y z</select></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numbertoselect="2" from="k" to="n" /></option>
        <option newNamespace><selectfromsequence type="letters" assignnames="q r" numbertoselect="2" from="x" to="z" /></option>
        <option newNamespace><select type="text" assignnames="q r" numbertoselect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2"><copy name="q2" tname="q" /></p>
    <p name="pr2"><copy name="r2" tname="r" /></p>
    <p name="ps2"><copy name="s2" tname="s" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3"><copy name="qq" tname="q/q" /><copy name="qr" tname="q/r" /><copy name="qs" tname="q/s" /></p>
    <p name="pr3"><copy name="rq" tname="r/q" /><copy name="rr" tname="r/r" /><copy name="rs" tname="r/s" /></p>
    <p name="ps3"><copy name="sq" tname="s/q" /><copy name="sr" tname="s/r" /><copy name="ss" tname="s/s" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4"><copy name="qqq" tname="q/q/q" /><copy name="qqr" tname="q/q/r" /><copy name="qrq" tname="q/r/q" /><copy name="qrr" tname="q/r/r" /><copy name="qsq" tname="q/s/q" /><copy name="qsr" tname="q/s/r" /></p>
    <p name="pr4"><copy name="rqq" tname="r/q/q" /><copy name="rqr" tname="r/q/r" /><copy name="rrq" tname="r/r/q" /><copy name="rrr" tname="r/r/r" /><copy name="rsq" tname="r/s/q" /><copy name="rsr" tname="r/s/r" /></p>
    <p name="ps4"><copy name="sqq" tname="s/q/q" /><copy name="sqr" tname="s/q/r" /><copy name="srq" tname="s/r/q" /><copy name="srr" tname="s/r/r" /><copy name="ssq" tname="s/s/q" /><copy name="ssr" tname="s/s/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a');

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = ['/q/q/q', '/q/q/r', '/q/r/q', '/q/r/r', '/q/s/q', '/q/s/r'].map(x => components[x].replacements ? components[x].replacements[0].stateValues.value : components[x].stateValues.value)
      let rs = ['/r/q/q', '/r/q/r', '/r/r/q', '/r/r/r', '/r/s/q', '/r/s/r'].map(x => components[x].replacements ? components[x].replacements[0].stateValues.value : components[x].stateValues.value)
      let ss = ['/s/q/q', '/s/q/r', '/s/r/q', '/s/r/r', '/s/s/q', '/s/s/r'].map(x => components[x].replacements ? components[x].replacements[0].stateValues.value : components[x].stateValues.value)

      cy.get('#\\/pq2').should('have.text', qs.join(""))
      cy.get('#\\/pr2').should('have.text', rs.join(""))
      cy.get('#\\/ps2').should('have.text', ss.join(""))

      cy.get('#\\/pq3').should('have.text', qs.join(""))
      cy.get('#\\/pr3').should('have.text', rs.join(""))
      cy.get('#\\/ps3').should('have.text', ss.join(""))

      cy.get('#\\/pq4').should('have.text', qs.join(""))
      cy.get('#\\/pr4').should('have.text', rs.join(""))
      cy.get('#\\/ps4').should('have.text', ss.join(""))

    })
  });

  it('references to select of selects of selects, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <select name="a" newnamespace assignnames="(q) (r) (s)" numbertoselect="3" withreplacement>
      <option><select name="b" newnamespace assignnames="(q) (r) (s)" numbertoselect="3" withreplacement>
        <option><select name="c" newnamespace type="text" assignnames="q r" numbertoselect="2">a e i o u</select></option>
        <option><selectfromsequence type="letters" name="d" newnamespace assignnames="q r" numbertoselect="2" from="a" to="j" /></option>
      </select></option>
      <option><select name="e" newnamespace assignnames="(q) (r) (s)" numbertoselect="3">
        <option><select name="f" newnamespace type="text" assignnames="q r" numbertoselect="2">v w x y z</select></option>
        <option><selectfromsequence type="letters" name="g" newnamespace assignnames="q r" numbertoselect="2" from="k" to="n" /></option>
        <option><selectfromsequence type="letters" name="h" newnamespace assignnames="q r" numbertoselect="2" from="x" to="z" /></option>
        <option><select name="i" newnamespace type="text" assignnames="q r" numbertoselect="2">p d q</select></option>
      </select></option>
    </select>

    <p>Selected options repeated</p>
    <p name="pq2"><copy name="q2" tname="a/q" /></p>
    <p name="pr2"><copy name="r2" tname="a/r" /></p>
    <p name="ps2"><copy name="s2" tname="a/s" /></p>

    <p>Copy x/q, x/r, x/s</p>
    <p name="pq3"><copy name="qq" tname="a/q/q" /><copy name="qr" tname="a/q/r" /><copy name="qs" tname="a/q/s" /></p>
    <p name="pr3"><copy name="rq" tname="a/r/q" /><copy name="rr" tname="a/r/r" /><copy name="rs" tname="a/r/s" /></p>
    <p name="ps3"><copy name="sq" tname="a/s/q" /><copy name="sr" tname="a/s/r" /><copy name="ss" tname="a/s/s" /></p>

    <p>Copy x/x/q, x/x/r</p>
    <p name="pq4"><copy name="qqq" tname="a/q/q/q" /><copy name="qqr" tname="a/q/q/r" /><copy name="qrq" tname="a/q/r/q" /><copy name="qrr" tname="a/q/r/r" /><copy name="qsq" tname="a/q/s/q" /><copy name="qsr" tname="a/q/s/r" /></p>
    <p name="pr4"><copy name="rqq" tname="a/r/q/q" /><copy name="rqr" tname="a/r/q/r" /><copy name="rrq" tname="a/r/r/q" /><copy name="rrr" tname="a/r/r/r" /><copy name="rsq" tname="a/r/s/q" /><copy name="rsr" tname="a/r/s/r" /></p>
    <p name="ps4"><copy name="sqq" tname="a/s/q/q" /><copy name="sqr" tname="a/s/q/r" /><copy name="srq" tname="a/s/r/q" /><copy name="srr" tname="a/s/r/r" /><copy name="ssq" tname="a/s/s/q" /><copy name="ssr" tname="a/s/s/r" /></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', 'a')

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = ['/a/q/q/q', '/a/q/q/r', '/a/q/r/q', '/a/q/r/r', '/a/q/s/q', '/a/q/s/r'].map(x => components[x].replacements ? components[x].replacements[0].stateValues.value : components[x].stateValues.value)
      let rs = ['/a/r/q/q', '/a/r/q/r', '/a/r/r/q', '/a/r/r/r', '/a/r/s/q', '/a/r/s/r'].map(x => components[x].replacements ? components[x].replacements[0].stateValues.value : components[x].stateValues.value)
      let ss = ['/a/s/q/q', '/a/s/q/r', '/a/s/r/q', '/a/s/r/r', '/a/s/s/q', '/a/s/s/r'].map(x => components[x].replacements ? components[x].replacements[0].stateValues.value : components[x].stateValues.value)

      cy.get('#\\/pq2').should('have.text', qs.join(""))
      cy.get('#\\/pr2').should('have.text', rs.join(""))
      cy.get('#\\/ps2').should('have.text', ss.join(""))

      cy.get('#\\/pq3').should('have.text', qs.join(""))
      cy.get('#\\/pr3').should('have.text', rs.join(""))
      cy.get('#\\/ps3').should('have.text', ss.join(""))

      cy.get('#\\/pq4').should('have.text', qs.join(""))
      cy.get('#\\/pr4').should('have.text', rs.join(""))
      cy.get('#\\/ps4').should('have.text', ss.join(""))


    })
  });

  it("references to named grandchildren's children", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select assignnames="(a b c d)">
    <option>
      <math name="h1" newNamespace><math name="w">x</math><math>y</math></math>
      <math simplify newNamespace><math name="q">z</math> + 2<copy name="v" tname="q" /></math>
      <copy tname="a/w" />
      <copy tname="b/q" />
    </option>
    <option>
      <math name="h2" newNamespace><math name="w">u</math><math>v</math></math>
      <math simplify newNamespace><math name="q">t</math> + 2<copy name="v" tname="q" /></math>
      <copy tname="a/w" />
      <copy tname="b/q" />
    </option>
    </select>
    
    <p>Copy grandchidren</p>
    <p><copy name="a2" tname="a" /></p>
    <p><copy name="b2" tname="b" /></p>
    <p><copy name="c2" tname="c" /></p>
    <p><copy name="d2" tname="d" /></p>
    
    <p>Copy named children of grandchild</p>
    <p><copy name="w2" tname="a/w" /></p>
    <p><copy name="v2" tname="b/v" /></p>
    
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let options = [{
      a: "x y",
      b: "3 z",
      c: "x",
      d: "z",
      v: "z",
      w: "x",
    },
    {
      a: "u v",
      b: "3 t",
      c: "u",
      d: "t",
      v: "t",
      w: "u",
    }];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let chosenChildren = components['/_select1'].replacements[0].replacements
        .filter(x => x.componentType !== "string")
        .map((v, i) => i < 2 ? v : v.replacements[0])
      let option = options[components['/_select1'].stateValues.selectedIndices[0] - 1];

      expect(chosenChildren[0].stateValues.value.toString()).eq(option.a)
      expect(chosenChildren[1].stateValues.value.toString()).eq(option.b)
      expect(chosenChildren[2].stateValues.value.toString()).eq(option.c)
      expect(chosenChildren[3].stateValues.value.toString()).eq(option.d)


      let a2 = components['/a2'].replacements[0].stateValues.value.toString();
      let b2 = components['/b2'].replacements[0].stateValues.value.toString();
      let c2 = components['/c2'].replacements[0].stateValues.value.toString();
      let d2 = components['/d2'].replacements[0].stateValues.value.toString();
      let v2 = components['/v2'].replacements[0].stateValues.value.toString();
      let w2 = components['/w2'].replacements[0].stateValues.value.toString();

      expect(a2).eq(option.a);
      expect(b2).eq(option.b);
      expect(c2).eq(option.c);
      expect(d2).eq(option.d);
      expect(v2).eq(option.v);
      expect(w2).eq(option.w);

    })
  });

  it("select of a map of a select, with references", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist name="list1">
    <select assignnames="(j) (k) (l)" numbertoselect="3" withreplacement>
    <option><map assignnames="a b" newNamespace>
      <template newNamespace>
        <select assignnames="(p q) (r s)" numbertoselect="2">
          <option><math>$x^2</math><math>$x^6</math></option>
          <option><math>$x^3</math><math>$x^7</math></option>
          <option><math>$x^4</math><math>$x^8</math></option>
          <option><math>$x^5</math><math>$x^9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>x</math><math>y</math>
      </sources>
    </map></option>
    <option><map assignnames="a b" newNamespace>
      <template newNamespace>
        <select assignnames="(p q) (r s)" numbertoselect="2">
          <option><math>$x 2</math><math>$x 6</math></option>
          <option><math>$x 3</math><math>$x 7</math></option>
          <option><math>$x 4</math><math>$x 8</math></option>
          <option><math>$x 5</math><math>$x 9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>u</math><math>v</math>
      </sources>
    </map></option>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2"><copy name="s2" tname="_select1" /></aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    <copy name="j2" tname="j" />
    <copy name="k2" tname="k" />
    <copy name="l2" tname="l" />
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    <copy name="p1" tname="j/a/p" /><copy name="p2" tname="j/a/q" /><copy name="p3" tname="j/a/r" /><copy name="p4" tname="j/a/s" /><copy name="p5" tname="j/b/p" /><copy name="p6" tname="j/b/q" /><copy name="p7" tname="j/b/r" /><copy name="p8" tname="j/b/s" />
    <copy name="p9" tname="k/a/p" /><copy name="p10" tname="k/a/q" /><copy name="p11" tname="k/a/r" /><copy name="p12" tname="k/a/s" /><copy name="p13" tname="k/b/p" /><copy name="p14" tname="k/b/q" /><copy name="p15" tname="k/b/r" /><copy name="p16" tname="k/b/s" />
    <copy name="p17" tname="l/a/p" /><copy name="p18" tname="l/a/q" /><copy name="p19" tname="l/a/r" /><copy name="p20" tname="l/a/s" /><copy name="p21" tname="l/b/p" /><copy name="p22" tname="l/b/q" /><copy name="p23" tname="l/b/r" /><copy name="p24" tname="l/b/s" />
    </aslist></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let theList1 = components['/list1'].activeChildren.map(x => x.stateValues.value.toString())
      let theList2 = components['/list2'].activeChildren.map(x => x.stateValues.value.toString())
      let theList3 = components['/list3'].activeChildren.map(x => x.stateValues.value.toString())

      expect(theList2).eqls(theList1);
      expect(theList3).eqls(theList1);

      let theList4 = [...Array(24).keys()].map(i => components['/p' + (i + 1)].replacements[0].stateValues.value.toString());

      expect(theList4).eqls(theList1);

    })
  });

  it("select of a map of a select, new namespaces", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p><aslist name="list1">
    <select name="s" newnamespace assignnames="(j) (k) (l)" numbertoselect="3" withreplacement>
    <option><map name="m" newnamespace assignnames="a b">
      <template newnamespace>
        <select name="v" newnamespace assignnames="(p q) (r s)" numbertoselect="2">
          <option><math>$x^2</math><math>$x^6</math></option>
          <option><math>$x^3</math><math>$x^7</math></option>
          <option><math>$x^4</math><math>$x^8</math></option>
          <option><math>$x^5</math><math>$x^9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>x</math><math>y</math>
      </sources>
    </map></option>
    <option><map name="n" newnamespace assignnames="a b">
      <template newnamespace>
        <select name="v" newnamespace assignnames="(p q) (r s)" numbertoselect="2">
          <option><math>$x 2</math><math>$x 6</math></option>
          <option><math>$x 3</math><math>$x 7</math></option>
          <option><math>$x 4</math><math>$x 8</math></option>
          <option><math>$x 5</math><math>$x 9</math></option>
        </select>
      </template>
      <sources alias="x">
        <math>u</math><math>v</math>
      </sources>
    </map></option>
    </select>
    </aslist></p>

    <p>Copy whole select again</p>
    <p><aslist name="list2"><copy name="s2" tname="s" /></aslist></p>

    <p>Copy individual selections</p>
    <p><aslist name="list3">
    <copy name="j2" tname="s/j" />
    <copy name="k2" tname="s/k" />
    <copy name="l2" tname="s/l" />
    </aslist></p>

    <p>Copy individual pieces</p>
    <p><aslist name="list4">
    <copy name="p1" tname="s/j/a/v/p" /><copy name="p2" tname="s/j/a/v/q" /><copy name="p3" tname="s/j/a/v/r" /><copy name="p4" tname="s/j/a/v/s" /><copy name="p5" tname="s/j/b/v/p" /><copy name="p6" tname="s/j/b/v/q" /><copy name="p7" tname="s/j/b/v/r" /><copy name="p8" tname="s/j/b/v/s" />
    <copy name="p9" tname="s/k/a/v/p" /><copy name="p10" tname="s/k/a/v/q" /><copy name="p11" tname="s/k/a/v/r" /><copy name="p12" tname="s/k/a/v/s" /><copy name="p13" tname="s/k/b/v/p" /><copy name="p14" tname="s/k/b/v/q" /><copy name="p15" tname="s/k/b/v/r" /><copy name="p16" tname="s/k/b/v/s" />
    <copy name="p17" tname="s/l/a/v/p" /><copy name="p18" tname="s/l/a/v/q" /><copy name="p19" tname="s/l/a/v/r" /><copy name="p20" tname="s/l/a/v/s" /><copy name="p21" tname="s/l/b/v/p" /><copy name="p22" tname="s/l/b/v/q" /><copy name="p23" tname="s/l/b/v/r" /><copy name="p24" tname="s/l/b/v/s" />
    </aslist></p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let theList1 = components['/list1'].activeChildren.map(x => x.stateValues.value.toString())
      let theList2 = components['/list2'].activeChildren.map(x => x.stateValues.value.toString())
      let theList3 = components['/list3'].activeChildren.map(x => x.stateValues.value.toString())

      expect(theList2).eqls(theList1);
      expect(theList3).eqls(theList1);

      let theList4 = [...Array(24).keys()].map(i => components['/p' + (i + 1)].replacements[0].stateValues.value.toString());

      expect(theList4).eqls(theList1);

    })
  });

  it('select with hide will hide replacements but not copies', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selects and hide</p>
      <p><select assignnames="(c)">
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select>, <select assignnames="(d)" hide>
        <option><text>a</text></option>
        <option><text>b</text></option>
        <option><text>c</text></option>
        <option><text>d</text></option>
        <option><text>e</text></option>
      </select></p>
      <p><copy tname="c" />, <copy tname="d" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_p1').should('have.text', "Selects and hide");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let c = components['/c'].stateValues.value;
      let d = components['/d'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(`#\\/_p2`).should('have.text', `${c}, `)
      cy.get(`#\\/_p3`).should('have.text', `${c}, ${d}`)

    })
  });

  it('select with hide will hide named grandchildren replacements but not copies', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selects and hide</p>
      <p><aslist><select assignnames="(a b c)">
        <option>
          <text>a</text>
          <text>b</text>
          <text>c</text>
        </option>
        <option>
          <text>d</text>
          <text>e</text>
          <text>f</text>
        </option>
      </select><select assignnames="(d e)" hide>
        <option>
          <text>a</text>
          <text>b</text>
        </option>
        <option>
          <text>c</text>
          <text>d</text>
        </option>
        <option>
          <text>e</text>
          <text>f</text>
        </option>
      </select></aslist></p>
      <p><copy tname="a" />, <copy hide="true" tname="b" />, <copy tname="c" />, <copy hide="false" tname="d" />, <copy tname="e" /></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_p1').should('have.text', "Selects and hide");

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let a = components['/a'].stateValues.value;
      let b = components['/b'].stateValues.value;
      let c = components['/c'].stateValues.value;
      let d = components['/d'].stateValues.value;
      let e = components['/e'].stateValues.value;
      expect(["a", "d"].includes(a)).eq(true);
      expect(["b", "e"].includes(b)).eq(true);
      expect(["c", "f"].includes(c)).eq(true);
      expect(["a", "c", "e"].includes(d)).eq(true);
      expect(["b", "d", "f"].includes(e)).eq(true);

      cy.get(`#\\/_p2`).should('have.text', `${a}, ${b}, ${c}`)
      cy.get(`#\\/_p3`).should('have.text', `${a}, , ${c}, ${d}, ${e}`)

    })
  });

  it('selects hide dynamically', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <booleaninput name='h1' prefill="false" label="Hide first select" />
    <booleaninput name='h2' prefill="true" label="Hide second select" />
    <p><select assignnames="(c)" hide="$h1">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select>, <select assignnames="(d)" hide="$h2">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
      <option><text>d</text></option>
      <option><text>e</text></option>
    </select></p>
    <p><copy tname="c" />, <copy tname="d" /></p>
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let c = components['/c'].stateValues.value;
      let d = components['/d'].stateValues.value;
      expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
      expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

      cy.get(`#\\/_p1`).should('have.text', `${c}, `)
      cy.get(`#\\/_p2`).should('have.text', `${c}, ${d}`)

      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();

      cy.get(`#\\/_p1`).should('have.text', `, ${d}`)
      cy.get(`#\\/_p2`).should('have.text', `${c}, ${d}`)

      cy.get('#\\/h1_input').click();
      cy.get('#\\/h2_input').click();

      cy.get(`#\\/_p1`).should('have.text', `${c}, `)
      cy.get(`#\\/_p2`).should('have.text', `${c}, ${d}`)

    })
  });

  it("string and blank strings in options", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>

    <text name="animal1" hide>fox</text><text name="verb1" hide>jumps</text>
    <text name="animal2" hide>elephant</text><text name="verb2" hide>trumpets</text>
  
    <p name="pa">a: <select assignnames="a">
      <option>The $animal1 $verb1.</option>
      <option>The $animal2 $verb2.</option>
    </select></p>

    <p name="pa1">a1: <copy tname="a" assignNames="((a11) (a12))" /></p>

    <p name="ppieces" >pieces: <copy tname="_select1" assignNames="(b c)" /></p>
  
    <p name="pb1">b1: <copy tname="b" assignNames="b1" /></p>
    <p name="pc1">c1: <copy tname="c" assignNames="c1" /></p>
  
    
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let options = [{
      animal: "fox",
      verb: "jumps"
    },
    {
      animal: "elephant",
      verb: "trumpets"
    }];

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let option = options[components['/_select1'].stateValues.selectedIndices[0] - 1];


      cy.get('#\\/pa').should('have.text', `a: The ${option.animal} ${option.verb}.`);
      cy.get('#\\/pa1').should('have.text', `a1: The ${option.animal} ${option.verb}.`);
      cy.get('#\\/ppieces').should('have.text', `pieces: The ${option.animal} ${option.verb}.`);
      cy.get('#\\/pb1').should('have.text', `b1: ${option.animal}`);
      cy.get('#\\/pc1').should('have.text', `c1: ${option.verb}`);

      cy.get('#\\/a11').should('have.text', `${option.animal}`);
      cy.get('#\\/a12').should('have.text', `${option.verb}`);
      cy.get('#\\/b1').should('have.text', `${option.animal}`);
      cy.get('#\\/c1').should('have.text', `${option.verb}`);




    })
  });

});
