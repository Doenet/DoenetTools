describe('Specifying single variant document tests', function () {

  beforeEach(() => {
    cy.visit('/test')
  })

  it('document with no variant control', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>1</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)

    let nWithIndex0;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithIndex0 = components['/n'].stateValues.value;
    })

    cy.log("Number doesn't change with multiple updates");

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>a</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>b</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `b`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>c</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>d</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `d`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.log("Number changes for index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>e</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 1 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithIndex1;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithIndex1 = components['/n'].stateValues.value;
      expect(nWithIndex1).not.eq(nWithIndex0);
    })


    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>f</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 1 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `f`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 1 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.log("Index 101 same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 101 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>h</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 101 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.log("Index -299 same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>i</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: -299 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `i`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>j</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: -299 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.log("Index 83057200 same as index 0");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>k</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 83057200 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `k`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>l</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 83057200 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `l`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.log("Variant 'a' same as index 0");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>m</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'a' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `m`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>n</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'a' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `n`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.log("Variant 'b' same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>o</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'b' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `o`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>q</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'b' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `q`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
    })

    cy.log("Index '300' same as index 0");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>r</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '300' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `r`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
    })

    cy.log("Variant 'cQ' and index '94' are the same");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>s</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '94' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `s`);

    let nWithIndex94;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithIndex94 = components['/n'].stateValues.value;
      expect(nWithIndex94).not.eq(nWithIndex0);
      expect(nWithIndex94).not.eq(nWithIndex1);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>t</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'cQ' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `t`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex94);
    })

    cy.log("Variant 'nonexistent one' doesn't change");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>u</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'nonexistent one' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `u`);

    let nWithValueNonexistent;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithValueNonexistent = components['/n'].stateValues.value;
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>v</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'nonexistent one' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `v`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithValueNonexistent);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>w</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'nonexistent one' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `w`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithValueNonexistent);
    })


    cy.log("Object as variant doesn't change");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>x</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: { a: 'b', c: [9, 2, 'q', 'z'], d: { 'h': null } } },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `x`);

    let nWithObject;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithObject = components['/n'].stateValues.value;
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>y</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: { a: 'b', c: [9, 2, 'q', 'z'], d: { 'h': null } } },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `y`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithObject);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>z</text>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: { a: 'b', c: [9, 2, 'q', 'z'], d: { 'h': null } } },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `z`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithObject);
    })


  });

  it('document with variant control specifying variants', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>1</text>
    <variantControl nvariants="5" variants="avocado, broccoli , cArrot ,dill,Eggplant"/>
    <p>Selected variable:
    <select assignnames="x">
      <math variants="Dill">d</math>
      <math variants="carrot">c</math>
      <math variants="eggplant">e</math>
      <math variants="avocado">a</math>
      <math variants="broccoli">b</math>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)

    cy.window().then((win) => {
      let expectedx = 'a';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
    })

    cy.log("specify third variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>2</text>
    <variantControl nvariants="5" variants="avocado, broccoli , cArrot ,dill,Eggplant"/>
    <p>Selected variable:
    <select assignnames="x">
      <math variants="Dill">d</math>
      <math variants="carrot">c</math>
      <math variants="eggplant">e</math>
      <math variants="avocado">a</math>
      <math variants="broccoli">b</math>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 2 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `2`)

    cy.window().then((win) => {
      let expectedx = 'c';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
    })


    cy.log("specify variant bRoccoli")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>3</text>
    <variantControl nvariants="5" variants="avocado, broccoli , cArrot ,dill,Eggplant"/>
    <p>Selected variable:
    <select assignnames="x">
      <math variants="Dill">d</math>
      <math variants="carrot">c</math>
      <math variants="eggplant">e</math>
      <math variants="avocado">a</math>
      <math variants="broccoli">b</math>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { value: 'bRoccoli' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `3`)

    cy.window().then((win) => {
      let expectedx = 'b';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
    })


    cy.log("specify variant dill")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>4</text>
    <variantControl nvariants="5" variants="avocado, broccoli , cArrot ,dill,Eggplant"/>
    <p>Selected variable:
    <select assignnames="x">
      <math variants="Dill">d</math>
      <math variants="carrot">c</math>
      <math variants="eggplant">e</math>
      <math variants="avocado">a</math>
      <math variants="broccoli">b</math>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { value: 'dill' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `4`)

    cy.window().then((win) => {
      let expectedx = 'd';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
    })


    cy.log("specify large variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>5</text>
    <variantControl nvariants="5" variants="avocado, broccoli , cArrot ,dill,Eggplant"/>
    <p>Selected variable:
    <select assignnames="x">
      <math variants="Dill">d</math>
      <math variants="carrot">c</math>
      <math variants="eggplant">e</math>
      <math variants="avocado">a</math>
      <math variants="broccoli">b</math>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 20582309 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `5`)

    cy.window().then((win) => {
      let expectedx = 'e';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
    })


    cy.log("specify negative variant index as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>6</text>
    <variantControl nvariants="5" variants="avocado, broccoli , cArrot ,dill,Eggplant"/>
    <p>Selected variable:
    <select assignnames="x">
      <math variants="Dill">d</math>
      <math variants="carrot">c</math>
      <math variants="eggplant">e</math>
      <math variants="avocado">a</math>
      <math variants="broccoli">b</math>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: '-20582309' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `6`)

    cy.window().then((win) => {
      let expectedx = 'b';

      let components = Object.assign({}, win.state.components);
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

  it('document with variant control specifying seeds, two different orders', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed50283;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed50283 = components['/n'].stateValues.value;
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `b`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed50283);
    })

    cy.log("specify second variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 124081 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let nWithSeed25018;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed25018 = components['/n'].stateValues.value;
      expect(nWithSeed25018).not.eq(nWithSeed50283);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>d</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 124081 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `d`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed25018);
    })

    cy.log("specify third variant by name")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'c' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithSeed52018;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed52018 = components['/n'].stateValues.value;
      expect(nWithSeed52018).not.eq(nWithSeed50283);
      expect(nWithSeed52018).not.eq(nWithSeed25018);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>f</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'c' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `f`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed52018);
    })

    cy.log("specify fourth variant as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '820572308' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)

    let nWithSeed2917392;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed2917392 = components['/n'].stateValues.value;
      expect(nWithSeed2917392).not.eq(nWithSeed50283);
      expect(nWithSeed2917392).not.eq(nWithSeed25018);
      expect(nWithSeed2917392).not.eq(nWithSeed52018);
    })

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
    })

    cy.log("specify fourth variant as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>h</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '820572308' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
    })


    cy.log("specify fifth variant as negative")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>i</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '-820572306' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `i`)
    cy.window().then((win) => {
      win.tempvariant = {
        index: '-820572306'
      }
    });

    let nWithSeed603962;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed603962 = components['/n'].stateValues.value;
      expect(nWithSeed603962).not.eq(nWithSeed50283);
      expect(nWithSeed603962).not.eq(nWithSeed25018);
      expect(nWithSeed603962).not.eq(nWithSeed52018);
      expect(nWithSeed603962).not.eq(nWithSeed2917392);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>j</text>
    <variantControl nvariants="5" seeds="50283, 25018, 52018, 2917392, 603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '-820572306' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed603962);
    })

    cy.log('reorder seeds');
    cy.log("specify first variant index")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>k</text>
    <variantControl nvariants="5" seeds="2917392, 52018, 603962, 50283, 25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `k`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>l</text>
    <variantControl nvariants="5" seeds="2917392, 52018, 603962, 50283, 25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `l`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
    })

    cy.log("specify second variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>m</text>
    <variantControl nvariants="5" seeds="2917392, 52018, 603962, 50283, 25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: 124081 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `m`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed52018);
    })


    cy.log("specify third variant by name")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>n</text>
    <variantControl nvariants="5" seeds="2917392, 52018, 603962, 50283, 25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { value: 'c' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `n`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed603962);
    })

    cy.log("specify fourth variant as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>o</text>
    <variantControl nvariants="5" seeds="2917392, 52018, 603962, 50283, 25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '820572308' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `o`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed50283);
    })

    cy.log("specify fifth variant as negative")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>p</text>
    <variantControl nvariants="5" seeds="2917392, 52018, 603962, 50283, 25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n">10000000000</selectfromsequence>
    </p>
    `,
        requestedVariant: { index: '-820572306' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `p`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed25018);
    })

  });

  it('nested selects', () => {

    let firstStringsToInd = {
      "Favorite color:": 0,
      "Selected number:": 1,
      "Chosen letter:": 2,
      "Variable:": 3
    }

    cy.log("Test a bunch of variants")
    for (let ind = 0; ind < 10; ind++) {

      let originalVariantInd;
      let originalSecondValue;

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 3; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="p">
          <p>Favorite color:
            <select>
              <text>red</text>
              <text>orange</text>
              <text>green</text>
              <text>white</text>
              <text>chartreuse</text>
            </select>
          </p>
          <p>Selected number: 
            <select>
              <selectfromsequence>1000, 2000</selectfromsequence>
              <selectfromsequence>-1000,-900</selectfromsequence>
            </select>
          </p>
          <p>Chosen letter: <selectfromsequence type="letters">g</selectfromsequence></p>
          <p>Variable: <select>u,v,w,x,z,y</select></p>
        </select>
        `,
            requestedVariant: { index: ind },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);
          let p = components['/p'];

          let variantInd = firstStringsToInd[p.activeChildren[0].stateValues.value.trim()];
          expect(variantInd).not.eq(undefined);

          let secondChild = p.activeChildren[1];

          if (variantInd === 0) {
            expect(["red", "orange", "green", "white", "chartreuse"].includes(secondChild.stateValues.value)).eq(true)
          } else if (variantInd === 1) {
            let num = secondChild.stateValues.value;
            expect(Number.isInteger(num)).eq(true);
            expect((num >= 1000 && num <= 2000) || (num >= -1000 && num <= -900)).eq(true);
          } else if (variantInd === 2) {
            expect(["a", "b", "c", "d", "e", "f", "g"].includes(secondChild.stateValues.value)).eq(true)
          } else {
            expect(["u", "v", "w", "x", "y", "z"].includes(secondChild.stateValues.value)).eq(true)
          }

          let secondValue = secondChild.stateValues.value;
          if (secondValue === undefined) {
            secondValue = secondChild.stateValues.value;
          }

          if (originalVariantInd === undefined) {
            originalVariantInd = variantInd;
            originalSecondValue = secondValue
          } else {
            expect(variantInd).eq(originalVariantInd);
            expect(secondValue).eq(originalSecondValue);
          }

        })
      }

    }

  });

  it('selected problems', () => {

    let titlesToInd = {
      "A word problem": 0,
      "A number problem": 1,
    }

    cy.log("Test a bunch of variants")
    for (let ind = 0; ind < 10; ind++) {

      let originalVariantInds = [];
      let originalSecondValues = [];

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 3; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="problem1, problem2, problem3" numbertoselect="3" withReplacement>
          <problem><title>A word problem</title>
            <variantControl nvariants="5" variants="a,b,c,d,e" />
            <p>Word:
              <select>
                <text variants="a">angry</text>
                <text variants="b">bad</text>
                <text variants="c">churlish</text>
                <text variants="d">drab</text>
                <text variants="e">excoriated</text>
              </select>
            </p>
          </problem>
          <problem><title>A number problem</title>
            <variantControl nvariants="10" />
            <p>Number: <selectfromsequence>10</selectfromsequence></p>
          </problem>
        </select>
        `,
            requestedVariant: { index: ind },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          let variantInds = [];
          let secondValues = [];

          for (let i = 1; i <= 3; i++) {
            let problem = components['/problem' + i];
            let variantInd = titlesToInd[problem.stateValues.title];

            expect(variantInd).not.eq(undefined);

            variantInds.push(variantInd);

            let p = problem.activeChildren[4];

            if (variantInd === 0) {
              expect(p.activeChildren[0].stateValues.value.trim()).eq("Word:")
              expect(["angry", "bad", "churlish", "drab", "excoriated"].includes(p.activeChildren[1].stateValues.value)).eq(true)
            } else {
              expect(p.activeChildren[0].stateValues.value.trim()).eq("Number:");
              let num = p.activeChildren[1].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);
            }

            let secondValue = p.activeChildren[1].stateValues.value;
            if (secondValue === undefined) {
              secondValue = p.activeChildren[1].stateValues.value;
            }
            secondValues.push(secondValue);
          }

          if (originalVariantInds.length === 0) {
            originalVariantInds = variantInds;
            originalSecondValues = secondValues
          } else {
            expect(variantInds).eqls(originalVariantInds);
            expect(secondValues).eqls(originalSecondValues);
          }



        })

      }
    }

  });

});
