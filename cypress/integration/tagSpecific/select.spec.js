import me from 'math-expressions';

describe('Select Tag Tests', function () {

  beforeEach(() => {
    cy.visit('/test')
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
    <select assignnames="x1">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x2">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x3">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x4">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x5">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x6">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x7">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x8">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x9">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select assignnames="x10">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
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
    <select name="s1" assignnames="X1, y1, z1" numberToSelect="3">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s2" assignnames="x2, Y2, z2" numberToSelect="3">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s3" assignnames="x3, y3, Z3" numberToSelect="3">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s4" assignnames="X4, Y4, z4" numberToSelect="3">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s5" assignnames="x5, Y5, Z5" numberToSelect="3">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
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
    <select name="s1" assignnames="X1, y1, z1">
      <numberToSelect><ref>n</ref></numberToSelect>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s2" assignnames="x2, Y2, z2">
      <numberToSelect><ref>n</ref></numberToSelect>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s3" assignnames="x3, y3, Z3">
      <numberToSelect><ref>n</ref></numberToSelect>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s4" assignnames="X4, Y4, z4">
      <numberToSelect><ref>n</ref></numberToSelect>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s5" assignnames="x5, Y5, Z5">
      <numberToSelect><ref>n</ref></numberToSelect>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    </aslist>

    <ref name="n2">n3</ref>
    <ref name="n">num1</ref>
    <math name="num1" simplify><ref>n2</ref>+<ref>num2</ref></math>
    <math name="num2" simplify><ref>n3</ref>+<ref>num3</ref></math>
    <ref name="n3">num3</ref>
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
    <select name="s1" assignnames="x1, y1, z1" numberToSelect="3" newNameSpace>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s2" assignnames="x2, y2, z2" numberToSelect="3" newNameSpace>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s3" assignnames="x3, y3, z3" numberToSelect="3" newNameSpace>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s4" assignnames="x4, y4, z4" numberToSelect="3" newNameSpace>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s5" assignnames="x5, y5, z5" numberToSelect="3" newNameSpace>
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
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
    <select name="s1" assignnames="x1, y1, z1" numberToSelect="5" withReplacement>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s2" assignnames="x2, y2, z2" numberToSelect="5" withReplacement>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s3" assignnames="x3, y3, z3" numberToSelect="5" withReplacement>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s4" assignnames="x4, y4, z4" numberToSelect="5" withReplacement>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s5" assignnames="x5, y5, z5" numberToSelect="5" withReplacement>
      <math>x</math>
      <math>y</math>
      <math>z</math>
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
          expect(["x", "y", "z"].includes(s.replacements[i].stateValues.value.tree)).eq(true);
        }
      }
    })
  });

  it("refs don't resample", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <p>
    <aslist>
    <select name="s1">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    <select name="s2">
      <math>u</math>
      <math>v</math>
      <math>w</math>
      <math>x</math>
      <math>y</math>
      <math>z</math>
    </select>
    </aslist>
    </p>

    <p>
    <aslist>
    <ref name="noresample1">s1</ref>
    <ref name="noresample2">s2</ref>
    <ref name="noreresample1">noresample1</ref>
    <ref name="noreresample2">noresample2</ref>
    </aslist>
    </p>

    <p>
    <ref name="noresamplelist">_aslist1</ref>
    </p>

    <p>
    <ref name="noreresamplelist">noresamplelist</ref>
    </p>

    <ref name="noresamplep">_p1</ref>
    <ref name="noreresamplep">noresamplep</ref>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/s1'].replacements[0].stateValues.value.tree;
      let x2 = components['/s2'].replacements[0].stateValues.value.tree;
      expect(["u", "v", "w", "x", "y", "z"].includes(x1)).eq(true);
      expect(["u", "v", "w", "x", "y", "z"].includes(x2)).eq(true);

      expect(components['/noresample1'].replacements[0].replacements[0].stateValues.value.tree).eq(x1);
      expect(components['/noresample2'].replacements[0].replacements[0].stateValues.value.tree).eq(x2);
      expect(components['/noreresample1'].replacements[0].replacements[0].replacements[0].stateValues.value.tree).eq(x1);
      expect(components['/noreresample2'].replacements[0].replacements[0].replacements[0].stateValues.value.tree).eq(x2);

      expect(components['/noresamplelist'].replacements[0].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noresamplelist'].replacements[0].activeChildren[1].stateValues.value.tree).eq(x2);
      expect(components['/noreresamplelist'].replacements[0].replacements[0].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noreresamplelist'].replacements[0].replacements[0].activeChildren[1].stateValues.value.tree).eq(x2);

      expect(components['/noresamplep'].replacements[0].activeChildren[1].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noresamplep'].replacements[0].activeChildren[1].activeChildren[1].stateValues.value.tree).eq(x2);
      expect(components['/noreresamplep'].replacements[0].replacements[0].activeChildren[1].activeChildren[0].stateValues.value.tree).eq(x1);
      expect(components['/noreresamplep'].replacements[0].replacements[0].activeChildren[1].activeChildren[1].stateValues.value.tree).eq(x2);

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
    <select name="sample1" withReplacement>
      <numbertoselect><ref prop="value">numbertoselect</ref></numbertoselect>
      <ref prop="value">../x</ref>
      <ref prop="value">../y</ref>
      <ref prop="value">../z</ref>
    </select>
    </aslist>
    </p>

    <p name="pchoices2">Selected choices: <aslist><ref name="noresample">sample1</ref></aslist></p>

    <ref name="pchoices3">pchoices</ref>

    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait until loaded

    let samplemaths;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let samplereplacements = components['/sample1'].replacements;
      expect(samplereplacements.length).eq(5);
      samplemaths = samplereplacements.map(x => x.replacements[0].stateValues.value.tree);
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

    });


    cy.log("Nothing changes when change number to select");
    cy.get('#\\/numbertoselect_input').clear().type(`7{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let samplereplacements = components['/sample1'].replacements;
      let choices2 = components['/pchoices2'].activeChildren[1].activeChildren;
      let choices3 = components['/pchoices3'].replacements[0].activeChildren[1].activeChildren;

      expect(samplereplacements.length).eq(5);
      expect(choices2.length).eq(5);
      expect(choices3.length).eq(5);
      for (let ind = 0; ind < 5; ind++) {
        expect(samplereplacements[ind].replacements[0].stateValues.value.tree).eq(samplemaths[ind]);
        expect(choices2[ind].stateValues.value.tree).eq(samplemaths[ind]);
        expect(choices3[ind].stateValues.value.tree).eq(samplemaths[ind]);
      }
    })

    cy.log("Values change to reflect ref sources");

    let newvalues = {
      a: "q",
      b: "r",
      c: "s"
    }
    cy.get('#\\/x_input').clear().type(newvalues.a + `{enter}`);
    cy.get('#\\/y_input').clear().type(newvalues.b + `{enter}`);
    cy.get('#\\/z_input').clear().type(newvalues.c + `{enter}`);

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let samplereplacements = components['/sample1'].replacements;
      let choices2 = components['/pchoices2'].activeChildren[1].activeChildren;
      let choices3 = components['/pchoices3'].replacements[0].activeChildren[1].activeChildren;

      expect(samplereplacements.length).eq(5);
      expect(choices2.length).eq(5);
      expect(choices3.length).eq(5);
      for (let ind = 0; ind < 5; ind++) {
        expect(samplereplacements[ind].replacements[0].stateValues.value.tree).eq(newvalues[samplemaths[ind]]);
        expect(choices2[ind].stateValues.value.tree).eq(newvalues[samplemaths[ind]]);
        expect(choices3[ind].stateValues.value.tree).eq(newvalues[samplemaths[ind]]);
      }
    })


  });

  it("select doesn't resample in dynamic map", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    How many variables do you want? <mathinput />
    <p name="p1"><aslist>
    <map assignnamespaces="a,b,c,d,e,f">
      <template>
        <select assignnames="n">
          <math>u</math>
          <math>v</math>
          <math>w</math>
          <math>x</math>
          <math>y</math>
          <math>z</math>
          <math>p</math>
          <math>q</math>
          <math>r</math>
          <math>s</math>
          <math>t</math>
        </select>
      </template>
      <substitutions>
      <sequence>
        <count><ref prop="value">_mathinput1</ref></count>
      </sequence>
      </substitutions>
    </map>
    </aslist></p>
    
    <p name="p2"><aslist><ref>_map1</ref></aslist></p>
    <p name="p3"><ref>_aslist1</ref></p>

    <ref name="p4">p1</ref>
    <ref name="p5">p2</ref>
    <ref name="p6">p3</ref>

    <ref name="p7">p4</ref>
    <ref name="p8">p5</ref>
    <ref name="p9">p6</ref>
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("sample one variable");
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      for (let ind = 0; ind < 1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get same number back");
    cy.get('#\\/_mathinput1_input').clear().type(`1{enter}`);
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(1);

      for (let ind = 0; ind < 1; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("get two more samples");
    cy.get('#\\/_mathinput1_input').clear().type(`3{enter}`);
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(3);
      for (let ind = 0; ind < 3; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });


    cy.log("get first two numbers back");
    cy.get('#\\/_mathinput1_input').clear().type(`2{enter}`);
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(2);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(2);

      for (let ind = 0; ind < 2; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("get six total samples");
    cy.get('#\\/_mathinput1_input').clear().type(`6{enter}`);
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })

    cy.log("go back to nothing")
    cy.get('#\\/_mathinput1_input').clear().type(`0{enter}`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/p1'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p2'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p3'].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p4'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p5'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p6'].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(0);
    });

    cy.log("get all six back");
    cy.get('#\\/_mathinput1_input').clear().type(`6{enter}`);
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
      expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren.length).eq(6);
      for (let ind = 0; ind < 6; ind++) {
        expect(components['/p1'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p2'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p3'].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p4'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p5'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p6'].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p7'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p8'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
        expect(components['/p9'].replacements[0].replacements[0].activeChildren[0].activeChildren[ind].stateValues.value.tree).eq(sampledvariables[ind]);
      }
    })


  });

  it('select single group of maths, assign names to grandchildren', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <p name="p1"><aslist><select assignnames="(x1,y1,z1)">
      <group><math>u</math><math>v</math><math>w</math></group>
      <group><math>x</math><math>y</math><math>z</math></group>
      <group><math>a</math><math>b</math><math>c</math></group>
      <group><math>q</math><math>r</math><math>s</math></group>
    </select></aslist></p>
    <p name="p2"><aslist><select assignnames="(x2,y2,z2)">
      <group><math>u</math><math>v</math><math>w</math></group>
      <group><math>x</math><math>y</math><math>z</math></group>
      <group><math>a</math><math>b</math><math>c</math></group>
      <group><math>q</math><math>r</math><math>s</math></group>
    </select></aslist></p>
    <p name="p3"><aslist><select assignnames="(x3,y3,z3)">
      <group><math>u</math><math>v</math><math>w</math></group>
      <group><math>x</math><math>y</math><math>z</math></group>
      <group><math>a</math><math>b</math><math>c</math></group>
      <group><math>q</math><math>r</math><math>s</math></group>
    </select></aslist></p>
    <p name="q1"><aslist><ref>x1</ref><ref>y1</ref><ref>z1</ref></aslist></p>
    <p name="q2"><aslist><ref>x2</ref><ref>y2</ref><ref>z2</ref></aslist></p>
    <p name="q3"><aslist><ref>x3</ref><ref>y3</ref><ref>z3</ref></aslist></p>
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
    <p name="p1"><aslist><select assignnames="(x,y,z)" name="s1" newnamespace>
      <group><math>u</math><math>v</math><math>w</math></group>
      <group><math>x</math><math>y</math><math>z</math></group>
      <group><math>a</math><math>b</math><math>c</math></group>
      <group><math>q</math><math>r</math><math>s</math></group>
    </select></aslist></p>
    <p name="p2"><aslist><select assignnames="(x,y,z)" name="s2" newnamespace>
    <group><math>u</math><math>v</math><math>w</math></group>
    <group><math>x</math><math>y</math><math>z</math></group>
    <group><math>a</math><math>b</math><math>c</math></group>
    <group><math>q</math><math>r</math><math>s</math></group>
    </select></aslist></p>
    <p name="p3"><aslist><select assignnames="(x,y,z)" name="s3" newnamespace>
    <group><math>u</math><math>v</math><math>w</math></group>
    <group><math>x</math><math>y</math><math>z</math></group>
    <group><math>a</math><math>b</math><math>c</math></group>
    <group><math>q</math><math>r</math><math>s</math></group>
    </select></aslist></p>
    <p name="q1"><aslist><ref>s1/x</ref><ref>s1/y</ref><ref>s1/z</ref></aslist></p>
    <p name="q2"><aslist><ref>s2/x</ref><ref>s2/y</ref><ref>s2/z</ref></aslist></p>
    <p name="q3"><aslist><ref>s3/x</ref><ref>s3/y</ref><ref>s3/z</ref></aslist></p>

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
      <select assignnames="(x1,y1,z1),(x2,y2,z2),(x3,y3,z3)" numbertoselect="3">
        <group><math>u</math><math>v</math><math>w</math></group>
        <group><math>x</math><math>y</math><math>z</math></group>
        <group><math>a</math><math>b</math><math>c</math></group>
        <group><math>q</math><math>r</math><math>s</math></group>
      </select>
    </aslist></p>
    <p name="q1"><aslist>
      <ref>x1</ref><ref>y1</ref><ref>z1</ref>
      <ref>x2</ref><ref>y2</ref><ref>z2</ref>
      <ref>x3</ref><ref>y3</ref><ref>z3</ref>
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

    <select assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <p>Option 1: <math>3<ref>../x1</ref><ref>../y1</ref></math></p>
      <p name="h" newnamespace>Option 2: <math>4<ref>../x2</ref><ref>../y2</ref></math></p>
      <p name="l">Option 3: <math>5<ref>../x3</ref><ref>../y3</ref></math></p>
    </select>

    <math hide name="y1">a</math>
    <math hide name="y2">b</math>
    <math hide name="y3">c</math>

    <p>Selected options repeated</p>
    <ref name="q2">q</ref>
    <ref name="r2">r</ref>
    <ref name="s2">s</ref>
    <ref name="t2">t</ref>
    <ref name="u2">u</ref>

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

      let q2 = components['/q2'].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].activeChildren;
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

    <select assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <p>Option 1: <math>3<math name="x">x</math> + <math name="z1">a</math> + <ref>x</ref>^2<ref>z1</ref>^3</math></p>
      <p>Option 2: <math>4<math name="x">y</math> + <math name="z2">b</math> + <ref>x</ref>^2<ref>z2</ref>^3</math></p>
      <p>Option 3: <math>5<math name="x">z</math> + <math name="z3">c</math> + <ref>x</ref>^2<ref>z3</ref>^3</math></p>
    </select>

    <p>Selected options repeated</p>
    <ref name="q2">q</ref>
    <ref name="r2">r</ref>
    <ref name="s2">s</ref>
    <ref name="t2">t</ref>
    <ref name="u2">u</ref>

    <p>Ref to x from within selection options</p>
    <p><ref name="qx">q/x</ref></p>
    <p><ref name="rx">r/x</ref></p>
    <p><ref name="sx">s/x</ref></p>
    <p><ref name="tx">t/x</ref></p>
    <p><ref name="ux">u/x</ref></p>

    <p>Ref select itself</p>
    <section name="repeat"><ref>_select1</ref></section>

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

      let q2 = components['/q2'].replacements[0].activeChildren;
      let q2string = q2[0].stateValues.value;
      let q2math = q2[1].stateValues.value;
      expect(q2math.equals(option[q2string])).eq(true);
      let qx = components['/qx'].replacements[0].stateValues.value.tree;
      expect(qx).eq(xoption[q2string]);
      let repeatqmath = components["/repeat"].activeChildren[0].activeChildren[1].stateValues.value;
      expect(repeatqmath.equals(option[q2string])).eq(true);

      let r2 = components['/r2'].replacements[0].activeChildren;
      let r2string = r2[0].stateValues.value;
      let r2math = r2[1].stateValues.value;
      expect(r2math.equals(option[r2string])).eq(true);
      let rx = components['/rx'].replacements[0].stateValues.value.tree;
      expect(rx).eq(xoption[r2string]);
      let repeatrmath = components["/repeat"].activeChildren[1].activeChildren[1].stateValues.value;
      expect(repeatrmath.equals(option[r2string])).eq(true);

      let s2 = components['/s2'].replacements[0].activeChildren;
      let s2string = s2[0].stateValues.value;
      let s2math = s2[1].stateValues.value;
      expect(s2math.equals(option[s2string])).eq(true);
      let sx = components['/sx'].replacements[0].stateValues.value.tree;
      expect(sx).eq(xoption[s2string]);
      let repeatsmath = components["/repeat"].activeChildren[2].activeChildren[1].stateValues.value;
      expect(repeatsmath.equals(option[s2string])).eq(true);

      let t2 = components['/t2'].replacements[0].activeChildren;
      let t2string = t2[0].stateValues.value;
      let t2math = t2[1].stateValues.value;
      expect(t2math.equals(option[t2string])).eq(true);
      let tx = components['/tx'].replacements[0].stateValues.value.tree;
      expect(tx).eq(xoption[t2string]);
      let repeattmath = components["/repeat"].activeChildren[3].activeChildren[1].stateValues.value;
      expect(repeattmath.equals(option[t2string])).eq(true);

      let u2 = components['/u2'].replacements[0].activeChildren;
      let u2string = u2[0].stateValues.value;
      let u2math = u2[1].stateValues.value;
      expect(u2math.equals(option[u2string])).eq(true);
      let ux = components['/ux'].replacements[0].stateValues.value.tree;
      expect(ux).eq(xoption[u2string]);
      let repeatumath = components["/repeat"].activeChildren[4].activeChildren[1].stateValues.value;
      expect(repeatumath.equals(option[u2string])).eq(true);

    })
  });

  it('variants specified, select single', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <variantControl nvariants="5" variants="aVocado, broCColi , carrot ,Dill,eggplanT"/>

    <p>Selected variable:
    <select assignnames="x">
      <math variants="dill">d</math>
      <math variants="Carrot">c</math>
      <math variants="eggPlant">e</math>
      <math variants="avocadO">a</math>
      <math variants="broccOli">b</math>
    </select>
    </p>

    <p>Selected variable repeated: <ref name="x2">x</ref></p>
    <p>Selected variable repeated again: <ref name="x3">_select1</ref></p>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variant = components['/x'].sharedParameters.variant;
      let expectedx = variant.substring(0, 1);

      let x = components['/x'].stateValues.value.tree;

      expect(x).eq(expectedx);

      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);

      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);

      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);

    })
  });

  it('variants specified, select multiple', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <variantControl nvariants="5" variants="avocado, brOccoli , carrot ,dill,   eggPlant  "/>

    <p>Selected variables:
    <aslist>
    <select assignnames="x, y, z" numbertoselect="3">
      <math variants="dill, carrot, avocado">d</math>
      <math variants="cArrOt,eggplant,eggplant">c</math>
      <math variants="eggplant ,broccoli ,dilL">e</math>
      <math variants="aVocado , avocado , broccoli">a</math>
      <math variants="  broccoli   , caRRot   , dill    ">b</math>
    </select>
    </aslist>
    </p>

    <p>Selected first variable: <ref name="x2">x</ref></p>
    <p>Selected second variable: <ref name="y2">y</ref></p>
    <p>Selected third variable: <ref name="z2">z</ref></p>
    <p>Selected variables repeated: <aslist><ref name="s2">_select1</ref></aslist></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let variantMap = {
        avocado: ["d", "a", "a"],
        broccoli: ["e", "a", "b"],
        carrot: ["d", "c", "b"],
        dill: ["d", "e", "b"],
        eggplant: ["c", "c", "e"]
      }

      let variant = components['/x'].sharedParameters.variant;
      let variantVars = variantMap[variant];

      let x = components['/x'].stateValues.value.tree;

      expect(variantVars.includes(x)).eq(true);
      variantVars.splice(variantVars.indexOf(x), 1);

      let y = components['/y'].stateValues.value.tree;
      expect(variantVars.includes(y)).eq(true);
      variantVars.splice(variantVars.indexOf(y), 1);

      let z = components['/z'].stateValues.value.tree;
      expect(z).eq(variantVars[0]);

      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(x);
      let yorig = components['/_select1'].replacements[1].stateValues.value.tree;
      expect(yorig).eq(y);
      let zorig = components['/_select1'].replacements[2].stateValues.value.tree;
      expect(zorig).eq(z);

      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(x);
      let y2 = components['/y2'].replacements[0].stateValues.value.tree;
      expect(y2).eq(y);
      let z2 = components['/z2'].replacements[0].stateValues.value.tree;
      expect(z2).eq(z);

      let x3 = components['/s2'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(x);
      let y3 = components['/s2'].replacements[0].replacements[1].stateValues.value.tree;
      expect(y3).eq(y);
      let z3 = components['/s2'].replacements[0].replacements[2].stateValues.value.tree;
      expect(z3).eq(z);

    })
  });

  it('select text as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <select assignnames="w1,w2,w3,w4,w5" numbertoselect="5">
      Lorem, ipsum ,dolor, sit, amet, consectetur, adipiscing, elit
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let wordsSoFar = [];
      for (let ind = 1; ind <= 5; ind++) {
        let word = components['/w' + ind].stateValues.value;
        expect(["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"].includes(word)).eq(true);
        expect([wordsSoFar].includes(word)).eq(false);
        wordsSoFar.push(word);
      }
    })
  });

  it('select numbers as sugar', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>
    <aslist>
    <select assignnames="n1,n2,n3,n4,n5,n6,n7,n8,n9,n10" numbertoselect="10" withReplacement>
      2,3,5,7,11,13,17,19
    </select>
    </aslist>
    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      for (let ind = 1; ind <= 10; ind++) {
        let num = components['/n' + ind].stateValues.value;
        expect([2, 3, 5, 7, 11, 13, 17, 19].includes(num)).eq(true);
      }
    })
  });

  it('select weighted', () => {

    let numX = 0, numY = 0, numZ = 0;

    for (let ind = 1; ind <= 200; ind++) {

      cy.window().then((win) => {
        win.postMessage({
          doenetML: `
        <text>${ind}</text>
        <variantcontrol nvariants="200"/>
        <aslist>
        <select assignnames="x">
          <text selectweight="0.2">x</text>
          <text>y</text>
          <text selectweight="5">z</text></select>
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
    <math>1</math>
    <aslist>
    <select assignnames="x1" numbertoselect="200" withreplacement>
      <text selectweight="0.2">x</text>
      <text>y</text>
      <text selectweight="5">z</text>
    </select>
    </aslist>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });

    // to wait for page to load
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let numX = 0, numY = 0, numZ = 0;
      let selectReplacements = components['/_select1'].replacements;
      for (let ind = 0; ind < 200; ind++) {
        let x = selectReplacements[ind].stateValues.value;
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
        <select assignnames="x,y" numbertoselect="2">
          <text selectweight="0.1">u</text>
          <text selectweight="0.1">v</text>
          <text selectweight="0.1">w</text>
          <text selectweight="5">x</text>
          <text>y</text>
          <text selectweight="10">z</text>
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
    <math>1</math>

    <select name="original" assignnames="q,r,s,t,u,v,w" numbertoselect="7" withreplacement>
      <p><select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select><ref name="q2">q</ref><ref name="r2">r</ref></p>
      <p><selectfromsequence assignnames="q,r" numbertoselect="2">a,z</selectfromsequence><ref name="q2">q</ref><ref name="r2">r</ref></p>
      <p><text name="q">z</text><selectfromsequence assignnames="r" numbertoselect="1">u,z</selectfromsequence><ref name="q2">q</ref><ref name="r2">r</ref></p>
      <p><text name="q">q</text><text name="r">r</text><ref name="q2">q</ref><ref name="r2">r</ref></p>
    </select>

    <p>Selected options repeated</p>
    <ref name="q2">q</ref>
    <ref name="r2">r</ref>
    <ref name="s2">s</ref>
    <ref name="t2">t</ref>
    <ref name="u2">u</ref>
    <ref name="v2">v</ref>
    <ref name="w2">w</ref>

    <p>Ref to q and r and their refs from within selected options</p>
    <p><ref name="qq">q/q</ref><ref name="qr">q/r</ref><ref name="qq2">q/q2</ref><ref name="qr2">q/r2</ref></p>
    <p><ref name="rq">r/q</ref><ref name="rr">r/r</ref><ref name="rq2">r/q2</ref><ref name="rr2">r/r2</ref></p>
    <p><ref name="sq">s/q</ref><ref name="sr">s/r</ref><ref name="sq2">s/q2</ref><ref name="sr2">s/r2</ref></p>
    <p><ref name="tq">t/q</ref><ref name="tr">t/r</ref><ref name="tq2">t/q2</ref><ref name="tr2">t/r2</ref></p>
    <p><ref name="uq">u/q</ref><ref name="ur">u/r</ref><ref name="uq2">u/q2</ref><ref name="ur2">u/r2</ref></p>
    <p><ref name="vq">v/q</ref><ref name="vr">v/r</ref><ref name="vq2">v/q2</ref><ref name="vr2">v/r2</ref></p>
    <p><ref name="wq">w/q</ref><ref name="wr">w/r</ref><ref name="wq2">w/q2</ref><ref name="wr2">w/r2</ref></p>

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
        components['/qq2'].replacements[0].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let r3s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
        components['/rq2'].replacements[0].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let s3s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
        components['/sq2'].replacements[0].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let t3s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
        components['/tq2'].replacements[0].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let u3s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
        components['/uq2'].replacements[0].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].replacements[0].stateValues.value,
      ]
      let v3s = [
        components['/vq'].replacements[0].stateValues.value,
        components['/vr'].replacements[0].stateValues.value,
        components['/vq2'].replacements[0].replacements[0].stateValues.value,
        components['/vr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let w3s = [
        components['/wq'].replacements[0].stateValues.value,
        components['/wr'].replacements[0].stateValues.value,
        components['/wq2'].replacements[0].replacements[0].stateValues.value,
        components['/wr2'].replacements[0].replacements[0].stateValues.value,
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
    <math>1</math>
    <select name="original" assignnames="q,r,s,t,u,v,w" numbertoselect="7" withreplacement>
      <p><select name="s" newnamespace assignnames="q,r" numbertoselect="2">a,e,i,o,u</select><ref name="q2">s/q</ref><ref name="r2">s/r</ref></p>
      <p><selectfromsequence name="s" newnamespace assignnames="q,r" numbertoselect="2">a,z</selectfromsequence><ref name="q2">s/q</ref><ref name="r2">s/r</ref></p>
      <p><selectfromsequence name="s" newnamespace assignnames="q,r" numbertoselect="2" withreplacement>u,z</selectfromsequence><ref name="q2">s/q</ref><ref name="r2">s/r</ref></p>
    </select>

    <p>Selected options repeated</p>
    <ref name="q2">q</ref>
    <ref name="r2">r</ref>
    <ref name="s2">s</ref>
    <ref name="t2">t</ref>
    <ref name="u2">u</ref>
    <ref name="v2">v</ref>
    <ref name="w2">w</ref>

    <p>Selected options repeated, no p</p>
    <p><ref name="q3">q/s</ref></p>
    <p><ref name="r3">r/s</ref></p>
    <p><ref name="s3">s/s</ref></p>
    <p><ref name="t3">t/s</ref></p>
    <p><ref name="u3">u/s</ref></p>
    <p><ref name="v3">v/s</ref></p>
    <p><ref name="w3">w/s</ref></p>

    <p>Ref to q and r from within selected options</p>
    <p><ref name="qq">q/s/q</ref><ref name="qr">q/s/r</ref><ref name="qq2">q/q2</ref><ref name="qr2">q/r2</ref></p>
    <p><ref name="rq">r/s/q</ref><ref name="rr">r/s/r</ref><ref name="rq2">r/q2</ref><ref name="rr2">r/r2</ref></p>
    <p><ref name="sq">s/s/q</ref><ref name="sr">s/s/r</ref><ref name="sq2">s/q2</ref><ref name="sr2">s/r2</ref></p>
    <p><ref name="tq">t/s/q</ref><ref name="tr">t/s/r</ref><ref name="tq2">t/q2</ref><ref name="tr2">t/r2</ref></p>
    <p><ref name="uq">u/s/q</ref><ref name="ur">u/s/r</ref><ref name="uq2">u/q2</ref><ref name="ur2">u/r2</ref></p>
    <p><ref name="vq">v/s/q</ref><ref name="vr">v/s/r</ref><ref name="vq2">v/q2</ref><ref name="vr2">v/r2</ref></p>
    <p><ref name="wq">w/s/q</ref><ref name="wr">w/s/r</ref><ref name="wq2">w/q2</ref><ref name="wr2">w/r2</ref></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/u\\/s\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

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

      let q3s = components['/q3'].replacements[0].replacements.map(x => x.stateValues.value);
      let r3s = components['/r3'].replacements[0].replacements.map(x => x.stateValues.value);
      let s3s = components['/s3'].replacements[0].replacements.map(x => x.stateValues.value);
      let t3s = components['/t3'].replacements[0].replacements.map(x => x.stateValues.value);
      let u3s = components['/u3'].replacements[0].replacements.map(x => x.stateValues.value);
      let v3s = components['/v3'].replacements[0].replacements.map(x => x.stateValues.value);
      let w3s = components['/w3'].replacements[0].replacements.map(x => x.stateValues.value);

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
        components['/qq2'].replacements[0].replacements[0].stateValues.value,
        components['/qr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let r4s = [
        components['/rq'].replacements[0].stateValues.value,
        components['/rr'].replacements[0].stateValues.value,
        components['/rq2'].replacements[0].replacements[0].stateValues.value,
        components['/rr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let s4s = [
        components['/sq'].replacements[0].stateValues.value,
        components['/sr'].replacements[0].stateValues.value,
        components['/sq2'].replacements[0].replacements[0].stateValues.value,
        components['/sr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let t4s = [
        components['/tq'].replacements[0].stateValues.value,
        components['/tr'].replacements[0].stateValues.value,
        components['/tq2'].replacements[0].replacements[0].stateValues.value,
        components['/tr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let u4s = [
        components['/uq'].replacements[0].stateValues.value,
        components['/ur'].replacements[0].stateValues.value,
        components['/uq2'].replacements[0].replacements[0].stateValues.value,
        components['/ur2'].replacements[0].replacements[0].stateValues.value,
      ]
      let v4s = [
        components['/vq'].replacements[0].stateValues.value,
        components['/vr'].replacements[0].stateValues.value,
        components['/vq2'].replacements[0].replacements[0].stateValues.value,
        components['/vr2'].replacements[0].replacements[0].stateValues.value,
      ]
      let w4s = [
        components['/wq'].replacements[0].stateValues.value,
        components['/wr'].replacements[0].stateValues.value,
        components['/wq2'].replacements[0].replacements[0].stateValues.value,
        components['/wr2'].replacements[0].replacements[0].stateValues.value,
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
    <select name="original" assignnames="(q,qq, qr),(r, rq,rr),(s, sq, sr),(t, tq, tr),(u,uq,ur)" numbertoselect="5" withreplacement>
      <p><select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select><ref name="q2">q</ref><ref name="r2">r</ref></p>
      <p><selectfromsequence assignnames="q,r" numbertoselect="2">a,z</selectfromsequence><ref name="q2">q</ref><ref name="r2">r</ref></p>
    </select>

    <p>Selected options repeated</p>
    <p><ref name="q2">q</ref></p>
    <p><ref name="r2">r</ref></p>
    <p><ref name="s2">s</ref></p>
    <p><ref name="t2">t</ref></p>
    <p><ref name="u2">u</ref></p>

    <p>Ref to x/q and x/r and their refs from within selected options</p>
    <p><ref name="qq2">q/q</ref><ref name="qr2">q/r</ref><ref name="qq3">qq</ref><ref name="qr3">qr</ref></p>
    <p><ref name="rq2">r/q</ref><ref name="rr2">r/r</ref><ref name="rq3">rq</ref><ref name="rr3">rr</ref></p>
    <p><ref name="sq2">s/q</ref><ref name="sr2">s/r</ref><ref name="sq3">sq</ref><ref name="sr3">sr</ref></p>
    <p><ref name="tq2">t/q</ref><ref name="tr2">t/r</ref><ref name="tq3">tq</ref><ref name="tr3">tr</ref></p>
    <p><ref name="uq2">u/q</ref><ref name="ur2">u/r</ref><ref name="uq3">uq</ref><ref name="ur3">ur</ref></p>

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
        <select name="original" assignnames="(q,qq, qr),(r, rq,rr),(s, sq, sr),(t, tq, tr),(u,uq,ur)" numbertoselect="5" withreplacement>
      <p><select name="a" assignnames="q,r" numbertoselect="2" newnamespace>a,e,i,o,u</select><ref name="q2">a/q</ref><ref name="r2">a/r</ref></p>
      <p><selectfromsequence name="b" assignnames="q,r" numbertoselect="2" newnamespace>a,z</selectfromsequence><ref name="q2">b/q</ref><ref name="r2">b/r</ref></p>
    </select>

    <p>Selected options repeated</p>
    <p><ref name="q2">q</ref></p>
    <p><ref name="r2">r</ref></p>
    <p><ref name="s2">s</ref></p>
    <p><ref name="t2">t</ref></p>
    <p><ref name="u2">u</ref></p>

    <p>Ref to x/q and x/r and their refs from within selected options</p>
    <p><ref name="qq2">q/q</ref><ref name="qr2">q/r</ref><ref name="qq3">qq</ref><ref name="qr3">qr</ref></p>
    <p><ref name="rq2">r/q</ref><ref name="rr2">r/r</ref><ref name="rq3">rq</ref><ref name="rr3">rr</ref></p>
    <p><ref name="sq2">s/q</ref><ref name="sr2">s/r</ref><ref name="sq3">sq</ref><ref name="sr3">sr</ref></p>
    <p><ref name="tq2">t/q</ref><ref name="tr2">t/r</ref><ref name="tq3">tq</ref><ref name="tr3">tr</ref></p>
    <p><ref name="uq2">u/q</ref><ref name="ur2">u/r</ref><ref name="uq3">uq</ref><ref name="ur3">ur</ref></p>


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
    <math>1</math>
    <select name="original" assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
      <selectfromsequence assignnames="q,r" numbertoselect="2">a,z</selectfromsequence>
    </select>

    <p>Selected options repeated</p>
    <p><ref name="q2">q</ref></p>
    <p><ref name="r2">r</ref></p>
    <p><ref name="s2">s</ref></p>
    <p><ref name="t2">t</ref></p>
    <p><ref name="u2">u</ref></p>

    <p>Ref to x/q and x/r</p>
    <p><ref name="qq">q/q</ref><ref name="qr">q/r</ref></p>
    <p><ref name="rq">r/q</ref><ref name="rr">r/r</ref></p>
    <p><ref name="sq">s/q</ref><ref name="sr">s/r</ref></p>
    <p><ref name="tq">t/q</ref><ref name="tr">t/r</ref></p>
    <p><ref name="uq">u/q</ref><ref name="ur">u/r</ref></p>

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

      let q2s = components['/q2'].replacements[0].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].replacements.map(x => x.stateValues.value);

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

  it('references to select of selects, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>

    <select name="original" assignnames="q,r,s,t,u" numbertoselect="5" withreplacement>
      <select name="a" newnamespace assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
      <selectfromsequence name="b" newnamespace assignnames="q,r" numbertoselect="2">a,z</selectfromsequence>
    </select>

    <p>Selected options repeated</p>
    <p><ref name="q2">q</ref></p>
    <p><ref name="r2">r</ref></p>
    <p><ref name="s2">s</ref></p>
    <p><ref name="t2">t</ref></p>
    <p><ref name="u2">u</ref></p>

    <p>Ref to x/q and x/r</p>
    <p><ref name="qq">q/q</ref><ref name="qr">q/r</ref></p>
    <p><ref name="rq">r/q</ref><ref name="rr">r/r</ref></p>
    <p><ref name="sq">s/q</ref><ref name="sr">s/r</ref></p>
    <p><ref name="tq">t/q</ref><ref name="tr">t/r</ref></p>
    <p><ref name="uq">u/q</ref><ref name="ur">u/r</ref></p>

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

      let q2s = components['/q2'].replacements[0].replacements.map(x => x.stateValues.value);
      let r2s = components['/r2'].replacements[0].replacements.map(x => x.stateValues.value);
      let s2s = components['/s2'].replacements[0].replacements.map(x => x.stateValues.value);
      let t2s = components['/t2'].replacements[0].replacements.map(x => x.stateValues.value);
      let u2s = components['/u2'].replacements[0].replacements.map(x => x.stateValues.value);

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
    <math>1</math>

    <select assignnames="q,r,s" numbertoselect="3" withreplacement>
      <select assignnames="q,r,s" numbertoselect="3" withreplacement>
        <select assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
        <selectfromsequence assignnames="q,r" numbertoselect="2">a,j</selectfromsequence>
      </select>
      <select assignnames="q,r,s" numbertoselect="3">
        <select assignnames="q,r" numbertoselect="2">v,w,x,y,z</select>
        <selectfromsequence assignnames="q,r" numbertoselect="2">k,n</selectfromsequence>
        <selectfromsequence assignnames="q,r" numbertoselect="2">x,z</selectfromsequence>
        <select assignnames="q,r" numbertoselect="2">p,d,q</select>
      </select>
    </select>

    <p>Selected options repeated</p>
    <p><ref name="q2">q</ref></p>
    <p><ref name="r2">r</ref></p>
    <p><ref name="s2">s</ref></p>

    <p>Ref to x/q, x/r, x/s</p>
    <p><ref name="qq">q/q</ref><ref name="qr">q/r</ref><ref name="qs">q/s</ref></p>
    <p><ref name="rq">r/q</ref><ref name="rr">r/r</ref><ref name="rs">r/s</ref></p>
    <p><ref name="sq">s/q</ref><ref name="sr">s/r</ref><ref name="ss">s/s</ref></p>

    <p>Ref to x/x/q, x/x/r</p>
    <p><ref name="qqq">q/q/q</ref><ref name="qqr">q/q/r</ref><ref name="qrq">q/r/q</ref><ref name="qrr">q/r/r</ref><ref name="qsq">q/s/q</ref><ref name="qsr">q/s/r</ref></p>
    <p><ref name="rqq">r/q/q</ref><ref name="rqr">r/q/r</ref><ref name="rrq">r/r/q</ref><ref name="rrr">r/r/r</ref><ref name="rsq">r/s/q</ref><ref name="rsr">r/s/r</ref></p>
    <p><ref name="sqq">s/q/q</ref><ref name="sqr">s/q/r</ref><ref name="srq">s/r/q</ref><ref name="srr">s/r/r</ref><ref name="ssq">s/s/q</ref><ref name="ssr">s/s/r</ref></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/s\\/s\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/q'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let rs = components['/r'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let ss = components['/s'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      let q2s = components['/q2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let r2s = components['/r2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let s2s = components['/s2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);

      let q3s = [
        ...components['/qq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let r3s = [
        ...components['/rq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let s3s = [
        ...components['/sq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/sr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/ss'].replacements[0].replacements.map(x => x.stateValues.value),
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);

      let q4s = [
        components['/qqq'].replacements[0].stateValues.value,
        components['/qqr'].replacements[0].stateValues.value,
        components['/qrq'].replacements[0].stateValues.value,
        components['/qrr'].replacements[0].stateValues.value,
        components['/qsq'].replacements[0].stateValues.value,
        components['/qsr'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rqq'].replacements[0].stateValues.value,
        components['/rqr'].replacements[0].stateValues.value,
        components['/rrq'].replacements[0].stateValues.value,
        components['/rrr'].replacements[0].stateValues.value,
        components['/rsq'].replacements[0].stateValues.value,
        components['/rsr'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sqq'].replacements[0].stateValues.value,
        components['/sqr'].replacements[0].stateValues.value,
        components['/srq'].replacements[0].stateValues.value,
        components['/srr'].replacements[0].stateValues.value,
        components['/ssq'].replacements[0].stateValues.value,
        components['/ssr'].replacements[0].stateValues.value,
      ];

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);


    })
  });

  it('references to select of selects of selects, newnamespaces', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <math>1</math>

    <select name="a" newnamespace assignnames="q,r,s" numbertoselect="3" withreplacement>
      <select name="b" newnamespace assignnames="q,r,s" numbertoselect="3" withreplacement>
        <select name="c" newnamespace assignnames="q,r" numbertoselect="2">a,e,i,o,u</select>
        <selectfromsequence name="d" newnamespace assignnames="q,r" numbertoselect="2">a,j</selectfromsequence>
      </select>
      <select name="e" newnamespace assignnames="q,r,s" numbertoselect="3">
        <select name="f" newnamespace assignnames="q,r" numbertoselect="2">v,w,x,y,z</select>
        <selectfromsequence name="g" newnamespace assignnames="q,r" numbertoselect="2">k,n</selectfromsequence>
        <selectfromsequence name="h" newnamespace assignnames="q,r" numbertoselect="2">x,z</selectfromsequence>
        <select name="i" newnamespace assignnames="q,r" numbertoselect="2">p,d,q</select>
      </select>
    </select>

    <p>Selected options repeated</p>
    <p><ref name="q2">a/q</ref></p>
    <p><ref name="r2">a/r</ref></p>
    <p><ref name="s2">a/s</ref></p>

    <p>Ref to x/q, x/r, x/s</p>
    <p><ref name="qq">a/q/q</ref><ref name="qr">a/q/r</ref><ref name="qs">a/q/s</ref></p>
    <p><ref name="rq">a/r/q</ref><ref name="rr">a/r/r</ref><ref name="rs">a/r/s</ref></p>
    <p><ref name="sq">a/s/q</ref><ref name="sr">a/s/r</ref><ref name="ss">a/s/s</ref></p>

    <p>Ref to x/x/q, x/x/r</p>
    <p><ref name="qqq">a/q/q/q</ref><ref name="qqr">a/q/q/r</ref><ref name="qrq">a/q/r/q</ref><ref name="qrr">a/q/r/r</ref><ref name="qsq">a/q/s/q</ref><ref name="qsr">a/q/s/r</ref></p>
    <p><ref name="rqq">a/r/q/q</ref><ref name="rqr">a/r/q/r</ref><ref name="rrq">a/r/r/q</ref><ref name="rrr">a/r/r/r</ref><ref name="rsq">a/r/s/q</ref><ref name="rsr">a/r/s/r</ref></p>
    <p><ref name="sqq">a/s/q/q</ref><ref name="sqr">a/s/q/r</ref><ref name="srq">a/s/r/q</ref><ref name="srr">a/s/r/r</ref><ref name="ssq">a/s/s/q</ref><ref name="ssr">a/s/s/r</ref></p>

    `}, "*");
    });

    // to wait for page to load
    cy.get('#\\/a\\/s\\/s\\/r').invoke('text').then((text) => {
      expect(text.length).equal(1);
    })
    cy.get('#\\/_math1 .mjx-mrow').eq(0).invoke('text').then((text) => {
      expect(text.trim()).equal('1')
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let qs = components['/a/q'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let rs = components['/a/r'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let ss = components['/a/s'].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      let q2s = components['/q2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let r2s = components['/r2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])
      let s2s = components['/s2'].replacements[0].replacements.reduce((a, c) => [...a, ...c.replacements.map(x => x.stateValues.value)], [])

      expect(q2s).eqls(qs);
      expect(r2s).eqls(rs);
      expect(s2s).eqls(ss);

      let q3s = [
        ...components['/qq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/qs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let r3s = [
        ...components['/rq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/rs'].replacements[0].replacements.map(x => x.stateValues.value),
      ]
      let s3s = [
        ...components['/sq'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/sr'].replacements[0].replacements.map(x => x.stateValues.value),
        ...components['/ss'].replacements[0].replacements.map(x => x.stateValues.value),
      ]

      expect(q3s).eqls(qs);
      expect(r3s).eqls(rs);
      expect(s3s).eqls(ss);

      let q4s = [
        components['/qqq'].replacements[0].stateValues.value,
        components['/qqr'].replacements[0].stateValues.value,
        components['/qrq'].replacements[0].stateValues.value,
        components['/qrr'].replacements[0].stateValues.value,
        components['/qsq'].replacements[0].stateValues.value,
        components['/qsr'].replacements[0].stateValues.value,
      ];
      let r4s = [
        components['/rqq'].replacements[0].stateValues.value,
        components['/rqr'].replacements[0].stateValues.value,
        components['/rrq'].replacements[0].stateValues.value,
        components['/rrr'].replacements[0].stateValues.value,
        components['/rsq'].replacements[0].stateValues.value,
        components['/rsr'].replacements[0].stateValues.value,
      ];
      let s4s = [
        components['/sqq'].replacements[0].stateValues.value,
        components['/sqr'].replacements[0].stateValues.value,
        components['/srq'].replacements[0].stateValues.value,
        components['/srr'].replacements[0].stateValues.value,
        components['/ssq'].replacements[0].stateValues.value,
        components['/ssr'].replacements[0].stateValues.value,
      ];

      expect(q4s).eqls(qs);
      expect(r4s).eqls(rs);
      expect(s4s).eqls(ss);


    })
  });

  it("references to named grandchildren's children", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select assignnames="(a,b,c,d)">
    <group>
      Option 1: <math name="h"><math name="w">x</math><math>y</math></math>,
      <math simplify><math name="q">z</math> + 2<ref name="v">q</ref></math>,
      <ref>../a/w</ref>,
      <ref>../b/q</ref>
    </group>
    <group>
      Option 2: <math name="h"><math name="w">u</math><math>v</math></math>,
      <math simplify><math name="q">t</math> + 2<ref name="v">q</ref></math>,
      <ref>../a/w</ref>,
      <ref>../b/q</ref>
    </group>
    </select>
    
    <p>Ref grandchidren</p>
    <p><ref name="a2">a</ref></p>
    <p><ref name="b2">b</ref></p>
    <p><ref name="c2">c</ref></p>
    <p><ref name="d2">d</ref></p>
    
    <p>Ref named children of grandchild</p>
    <p><ref name="w2">a/w</ref></p>
    <p><ref name="v2">b/v</ref></p>
    
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let options = {
      "Option 1:": {
        a: "x y",
        b: "3 z",
        c: "x",
        d: "z",
        v: "z",
        w: "x",
      },
      "Option 2:": {
        a: "u v",
        b: "3 t",
        c: "u",
        d: "t",
        v: "t",
        w: "u",
      },
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let chosenChildren = components['/_select1'].replacements[0].activeChildren;
      let option = options[chosenChildren[0].stateValues.value.trim()];

      expect(chosenChildren[1].stateValues.value.toString()).eq(option.a)
      expect(chosenChildren[3].stateValues.value.toString()).eq(option.b)
      expect(chosenChildren[5].stateValues.value.toString()).eq(option.c)
      expect(chosenChildren[7].stateValues.value.toString()).eq(option.d)


      let a2 = components['/a2'].replacements[0].stateValues.value.toString();
      let b2 = components['/b2'].replacements[0].stateValues.value.toString();
      let c2 = components['/c2'].replacements[0].replacements[0].stateValues.value.toString();
      let d2 = components['/d2'].replacements[0].replacements[0].stateValues.value.toString();
      let v2 = components['/v2'].replacements[0].replacements[0].stateValues.value.toString();
      let w2 = components['/w2'].replacements[0].stateValues.value.toString();

      expect(a2).eq(option.a);
      expect(b2).eq(option.b);
      expect(c2).eq(option.c);
      expect(d2).eq(option.d);
      expect(v2).eq(option.v);
      expect(w2).eq(option.w);

    })
  });

  it("references to named grandchildren's children, newnamespaces", () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <select assignnames="(a,b,c,d)">
    <group>
      Option 1: <math name="h" newnamespace><math name="w">x</math><math>y</math></math>,
      <math simplify newnamespace name="a"><math name="q">z</math> + 2<ref name="v">q</ref></math>,
      <ref>../a/w</ref>,
      <ref>../b/q</ref>
    </group>
    <group>
      Option 2: <math name="h" newnamespace><math name="w">u</math><math>v</math></math>,
      <math simplify newnamespace name="a"><math name="q">t</math> + 2<ref name="v">q</ref></math>,
      <ref>../a/w</ref>,
      <ref>../b/q</ref>
    </group>
    </select>
    
    <p>Ref grandchidren</p>
    <p><ref name="a2">a</ref></p>
    <p><ref name="b2">b</ref></p>
    <p><ref name="c2">c</ref></p>
    <p><ref name="d2">d</ref></p>
    
    <p>Ref named children of grandchild</p>
    <p><ref name="w2">a/w</ref></p>
    <p><ref name="v2">b/v</ref></p>
    
    `}, "*");
    });

    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    let options = {
      "Option 1:": {
        a: "x y",
        b: "3 z",
        c: "x",
        d: "z",
        v: "z",
        w: "x",
      },
      "Option 2:": {
        a: "u v",
        b: "3 t",
        c: "u",
        d: "t",
        v: "t",
        w: "u",
      },
    }

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let chosenChildren = components['/_select1'].replacements[0].activeChildren;
      let option = options[chosenChildren[0].stateValues.value.trim()];

      expect(chosenChildren[1].stateValues.value.toString()).eq(option.a)
      expect(chosenChildren[3].stateValues.value.toString()).eq(option.b)
      expect(chosenChildren[5].stateValues.value.toString()).eq(option.c)
      expect(chosenChildren[7].stateValues.value.toString()).eq(option.d)


      let a2 = components['/a2'].replacements[0].stateValues.value.toString();
      let b2 = components['/b2'].replacements[0].stateValues.value.toString();
      let c2 = components['/c2'].replacements[0].replacements[0].stateValues.value.toString();
      let d2 = components['/d2'].replacements[0].replacements[0].stateValues.value.toString();
      let v2 = components['/v2'].replacements[0].replacements[0].stateValues.value.toString();
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
    <select assignnames="j,k,l" numbertoselect="3" withreplacement>
    <map assignnamespaces="a,b">
      <template>
        <select assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><subsref/>^2</math><math><subsref/>^6</math></group>
          <group><math><subsref/>^3</math><math><subsref/>^7</math></group>
          <group><math><subsref/>^4</math><math><subsref/>^8</math></group>
          <group><math><subsref/>^5</math><math><subsref/>^9</math></group>
        </select>
      </template>
      <substitutions>
        <math>x</math><math>y</math>
      </substitutions>
    </map>
    <map assignnamespaces="a,b">
      <template>
        <select assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><subsref/>2</math><math><subsref/>6</math></group>
          <group><math><subsref/>3</math><math><subsref/>7</math></group>
          <group><math><subsref/>4</math><math><subsref/>8</math></group>
          <group><math><subsref/>5</math><math><subsref/>9</math></group>
        </select>
      </template>
      <substitutions>
        <math>u</math><math>v</math>
      </substitutions>
    </map>
    </select>
    </aslist></p>

    <p>Ref whole select again</p>
    <p><aslist name="list2"><ref name="s2">_select1</ref></aslist></p>

    <p>Ref individual selections</p>
    <p><aslist name="list3">
    <ref name="j2">j</ref>
    <ref name="k2">k</ref>
    <ref name="l2">l</ref>
    </aslist></p>

    <p>Ref individual pieces</p>
    <p><aslist name="list4">
    <ref name="p1">j/a/p</ref><ref name="p2">j/a/q</ref><ref name="p3">j/a/r</ref><ref name="p4">j/a/s</ref><ref name="p5">j/b/p</ref><ref name="p6">j/b/q</ref><ref name="p7">j/b/r</ref><ref name="p8">j/b/s</ref>
    <ref name="p9">k/a/p</ref><ref name="p10">k/a/q</ref><ref name="p11">k/a/r</ref><ref name="p12">k/a/s</ref><ref name="p13">k/b/p</ref><ref name="p14">k/b/q</ref><ref name="p15">k/b/r</ref><ref name="p16">k/b/s</ref>
    <ref name="p17">l/a/p</ref><ref name="p18">l/a/q</ref><ref name="p19">l/a/r</ref><ref name="p20">l/a/s</ref><ref name="p21">l/b/p</ref><ref name="p22">l/b/q</ref><ref name="p23">l/b/r</ref><ref name="p24">l/b/s</ref>
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
    <select name="s" newnamespace assignnames="j,k,l" numbertoselect="3" withreplacement>
    <map name="m" newnamespace assignnamespaces="a,b">
      <template>
        <select name="v" newnamespace assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><subsref/>^2</math><math><subsref/>^6</math></group>
          <group><math><subsref/>^3</math><math><subsref/>^7</math></group>
          <group><math><subsref/>^4</math><math><subsref/>^8</math></group>
          <group><math><subsref/>^5</math><math><subsref/>^9</math></group>
        </select>
      </template>
      <substitutions>
        <math>x</math><math>y</math>
      </substitutions>
    </map>
    <map name="n" newnamespace assignnamespaces="a,b">
      <template>
        <select name="v" newnamespace assignnames="(p,q),(r,s)" numbertoselect="2">
          <group><math><subsref/>2</math><math><subsref/>6</math></group>
          <group><math><subsref/>3</math><math><subsref/>7</math></group>
          <group><math><subsref/>4</math><math><subsref/>8</math></group>
          <group><math><subsref/>5</math><math><subsref/>9</math></group>
        </select>
      </template>
      <substitutions>
        <math>u</math><math>v</math>
      </substitutions>
    </map>
    </select>
    </aslist></p>

    <p>Ref whole select again</p>
    <p><aslist name="list2"><ref name="s2">s</ref></aslist></p>

    <p>Ref individual selections</p>
    <p><aslist name="list3">
    <ref name="j2">s/j</ref>
    <ref name="k2">s/k</ref>
    <ref name="l2">s/l</ref>
    </aslist></p>

    <p>Ref individual pieces</p>
    <p><aslist name="list4">
    <ref name="p1">s/j/a/v/p</ref><ref name="p2">s/j/a/v/q</ref><ref name="p3">s/j/a/v/r</ref><ref name="p4">s/j/a/v/s</ref><ref name="p5">s/j/b/v/p</ref><ref name="p6">s/j/b/v/q</ref><ref name="p7">s/j/b/v/r</ref><ref name="p8">s/j/b/v/s</ref>
    <ref name="p9">s/k/a/v/p</ref><ref name="p10">s/k/a/v/q</ref><ref name="p11">s/k/a/v/r</ref><ref name="p12">s/k/a/v/s</ref><ref name="p13">s/k/b/v/p</ref><ref name="p14">s/k/b/v/q</ref><ref name="p15">s/k/b/v/r</ref><ref name="p16">s/k/b/v/s</ref>
    <ref name="p17">s/l/a/v/p</ref><ref name="p18">s/l/a/v/q</ref><ref name="p19">s/l/a/v/r</ref><ref name="p20">s/l/a/v/s</ref><ref name="p21">s/l/b/v/p</ref><ref name="p22">s/l/b/v/q</ref><ref name="p23">s/l/b/v/r</ref><ref name="p24">s/l/b/v/s</ref>
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

  it('two selects with mutual dependence, numbertoselect initially unresolved', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
  <text>a</text>
  <p><aslist>
    <select name="s1" assignnames="X1, y1, z1" withReplacement>
      <numberToSelect><ref prop="numberToSelect">s2</ref></numberToSelect>
      <math>x</math><math>y</math><math>z</math>
    </select>
  </aslist></p>
  
  <p><aslist>
    <select name="s2" assignnames="X2, y2, z2">
      <numberToSelect><ref>n</ref></numberToSelect>
      <withReplacement><ref prop="withReplacement">s1</ref></withReplacement>
      <math>u</math><math>v</math><math>w</math>
    </select>
  </aslist></p>
  
  <p><ref name="x1a">x1</ref>, <ref name="y1a">y1</ref>, <ref name="z1a">z1</ref></p>
  <p><ref name="x2a">X2</ref>, <ref name="y2a">Y2</ref>, <ref name="z2a">Z2</ref></p>
  
  <p> 
    <ref name="n2">n3</ref>
    <ref name="n">num1</ref>
    <math name="num1"><ref>n2</ref>+<ref>num2</ref></math>
    <math name="num2"><ref>n3</ref>+<ref>num3</ref></math>
    <ref name="n3">num3</ref>
    <number name="num3">1</number>
  </p>
    `}, "*");
    });


    cy.get('#\\/_text1').should('have.text', 'a');  // to wait for page to load

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let x1 = components['/x1'].stateValues.value.tree;
      let y1 = components['/y1'].stateValues.value.tree;
      let z1 = components['/z1'].stateValues.value.tree;
      let x2 = components['/x2'].stateValues.value.tree;
      let y2 = components['/y2'].stateValues.value.tree;
      let z2 = components['/z2'].stateValues.value.tree;

      expect(["x", "y", "z"].includes(x1)).eq(true);
      expect(["x", "y", "z"].includes(y1)).eq(true);
      expect(["x", "y", "z"].includes(z1)).eq(true);
      expect(["u", "v", "w"].includes(x2)).eq(true);
      expect(["u", "v", "w"].includes(y2)).eq(true);
      expect(["u", "v", "w"].includes(z2)).eq(true);

      let x1a = components['/x1a'].replacements[0].stateValues.value.tree;
      let y1a = components['/y1a'].replacements[0].stateValues.value.tree;
      let z1a = components['/z1a'].replacements[0].stateValues.value.tree;
      let x2a = components['/x2a'].replacements[0].stateValues.value.tree;
      let y2a = components['/y2a'].replacements[0].stateValues.value.tree;
      let z2a = components['/z2a'].replacements[0].stateValues.value.tree;

      expect(x1a).eq(x1);
      expect(y1a).eq(y1);
      expect(z1a).eq(z1);
      expect(x2a).eq(x2);
      expect(y2a).eq(y2);
      expect(z2a).eq(z2);

    })
  });

  it('select with hide will hide replacements', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selects and hide</p>
      <p><select assignnames="c">
        <text>a</text>
        <text>b</text>
        <text>c</text>
        <text>d</text>
        <text>e</text>
      </select>, <select assignnames="d" hide>
        <text>a</text>
        <text>b</text>
        <text>c</text>
        <text>d</text>
        <text>e</text>
      </select></p>
      <p><ref>c</ref>, <ref hide="false">d</ref></p>
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

  it('select with hide will hide named grandchildren replacements', () => {
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
      <p>Selects and hide</p>
      <p><aslist><select assignnames="(a,b,c)">
        <group>
          <text>a</text>
          <text>b</text>
          <text>c</text>
        </group>
        <group>
          <text>d</text>
          <text>e</text>
          <text>f</text>
        </group>
      </select><select assignnames="(d,e)" hide>
        <group>
          <text>a</text>
          <text>b</text>
        </group>
        <group>
          <text>c</text>
          <text>d</text>
        </group>
        <group>
          <text>e</text>
          <text>f</text>
        </group>
      </select></aslist></p>
      <p><ref>a</ref>, <ref hide="true">b</ref>, <ref>c</ref>, <ref hide="false">d</ref>, <ref>e</ref></p>
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
      cy.get(`#\\/_p3`).should('have.text', `${a}, , ${c}, ${d}, `)

    })
  });


});
