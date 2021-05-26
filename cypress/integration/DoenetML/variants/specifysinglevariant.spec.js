import { numberToLetters } from "../../../../src/Core/utils/sequence";

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
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Number doesn't change with multiple updates");

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>a</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>b</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>c</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 0 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let generatedVariantInfo;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo));
    })

    cy.log(`Number doesn't change when use generatedVariantInfo`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>d</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `d`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: true,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Number changes for index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>e</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })


    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>f</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Index 101 same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>h</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
      index: 0,
      subvariants: [{
        indices: [nWithIndex1 - 1]
      }]
    })
    `,
        requestedVariant: { index: 101 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Index -299 same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>i</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>j</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Index 83057200 same as index 0");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>k</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>l</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Variant 'a' same as index 0");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>m</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'a' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `m`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>n</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'a' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `n`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex0);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Variant 'b' same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>o</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'b' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `o`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>q</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'b' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `q`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Index '300' same as index 0");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>r</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex0 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("Variant 'cQ' and index '94' are the same");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>s</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 94,
        name: 'cq',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex94 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>t</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'cQ' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `t`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex94);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 94,
        name: 'cq',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex94 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

  });

  it('document with variant control specifying variants', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>1</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
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
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'avocado',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [3],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
    })

    cy.log("specify third variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>2</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
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
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'carrot',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [1],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
    })


    cy.log("specify variant bRoccoli")
    let generatedVariantInfo;
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>3</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { name: 'bRoccoli' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `3`)

    cy.window().then((win) => {
      let expectedx = 'b';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'broccoli',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [4],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo))
    })


    cy.log("same result with previous generatedVariantInfo")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>3a</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `3a`)

    cy.window().then((win) => {
      let expectedx = 'b';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'broccoli',
        meta: {
          subvariantsSpecified: true,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [4],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
    })

    cy.log("specify variant dill")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>4</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { name: 'dill' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `4`)

    cy.window().then((win) => {
      let expectedx = 'd';

      let components = Object.assign({}, win.state.components);
      let x = components['/x'].stateValues.value.tree;
      expect(x).eq(expectedx);
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'dill',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [0],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
    })


    cy.log("specify large variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>5</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
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
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'eggplant',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [2],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
    })


    cy.log("specify negative variant index as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>6</text>
    <variantControl nvariants="5" variants="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariants="Dill"><math>d</math></option>
      <option selectForVariants="carrot"><math>c</math></option>
      <option selectForVariants="eggplant"><math>e</math></option>
      <option selectForVariants="avocado"><math>a</math></option>
      <option selectForVariants="broccoli"><math>b</math></option>
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
      let xorig = components['/_select1'].replacements[0].replacements[0].stateValues.value.tree;
      expect(xorig).eq(expectedx);
      let x2 = components['/x2'].replacements[0].stateValues.value.tree;
      expect(x2).eq(expectedx);
      let x3 = components['/x3'].replacements[0].replacements[0].stateValues.value.tree;
      expect(x3).eq(expectedx);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'broccoli',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [4],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
    })

  });

  it('document with variant control specifying seeds, two different orders', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("specify second variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>d</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("specify third variant by name")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'c' },
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed52018 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>f</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'c' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `f`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed52018);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed52018 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("specify fourth variant as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>h</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })


    cy.log("specify fifth variant as negative")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>i</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: '-820572306' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `i`)

    let nWithSeed603962;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed603962 = components['/n'].stateValues.value;
      expect(nWithSeed603962).not.eq(nWithSeed50283);
      expect(nWithSeed603962).not.eq(nWithSeed25018);
      expect(nWithSeed603962).not.eq(nWithSeed52018);
      expect(nWithSeed603962).not.eq(nWithSeed2917392);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed603962 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    let generatedVariantInfo;
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>j</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>1
    `,
        requestedVariant: { index: '-820572306' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed603962);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed603962 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo))
    })


    cy.log('same results with previous generatedVariantInfo')
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>ja</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>1
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `ja`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed603962);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: [{
          indices: [nWithSeed603962 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })


    cy.log('reorder seeds');
    cy.log("specify first variant index")

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>k</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>l</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 0,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("specify second variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>m</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed52018 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })


    cy.log("specify third variant by name")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>n</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: 'c' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `n`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed603962);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed603962 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("specify fourth variant as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>o</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

    cy.log("specify fifth variant as negative")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>p</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
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
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018 - 1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
    })

  });

  it('nested selects', () => {

    let firstStringsToInd = {
      "Favorite color:": 0,
      "Selected number:": 1,
      "Chosen letter:": 2,
      "Variable:": 3
    }

    let generatedVariantInfo;
    let originalVariantInd;
    let originalSecondValue;

    cy.log("Test a bunch of variants")
    for (let ind = 0; ind < 20; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 3; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="(p)">
          <option><p newNamespace>Favorite color:
            <select>
              <option><text>red</text></option>
              <option><text>orange</text></option>
              <option><text>green</text></option>
              <option><text>white</text></option>
              <option><text>chartreuse</text></option>
            </select>
          </p></option>
          <option><p newNamespace>Selected number: 
            <select assignNames="(s)">
              <option><selectfromsequence from="1000" to="2000" /></option>
              <option><selectfromsequence from="-1000" to="-900" /></option>
            </select>
          </p></option>
          <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" to="g" /></p></option>
          <option><p newNamespace>Variable: <select type="text">u v w x z y</select></p></option>
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

          generatedVariantInfo = {
            index: ind,
            name: numberToLetters(ind + 1, true),
            meta: {
              createdBy: "/_document1",
              subvariantsSpecified: false,
            },
            subvariants: []
          }

          let variantInd = firstStringsToInd[p.activeChildren[0].stateValues.value.trim()];
          expect(variantInd).not.eq(undefined);

          let secondChild = p.activeChildren[1];

          if (variantInd === 0) {
            let i = ["red", "orange", "green", "white", "chartreuse"].indexOf(secondChild.stateValues.value)
            expect(i).not.eq(-1);
            generatedVariantInfo.subvariants.push({
              indices: [0],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [i],
                meta: { createdBy: "/p/_select1" },
                subvariants: []
              }]
            })
          } else if (variantInd === 1) {
            let num = secondChild.stateValues.value;
            expect(Number.isInteger(num)).eq(true);
            if (num > 0) {
              expect(num).gte(1000);
              expect(num).lte(2000);
              generatedVariantInfo.subvariants.push({
                indices: [1],
                meta: { createdBy: "/_select1" },
                subvariants: [{
                  indices: [0],
                  meta: { createdBy: "/p/_select1" },
                  subvariants: [{
                    indices: [num - 1000],
                    meta: { createdBy: "/p/s" }
                  }]
                }]
              })
            } else {
              expect(num).gte(-1000);
              expect(num).lte(-900)
              generatedVariantInfo.subvariants.push({
                indices: [1],
                meta: { createdBy: "/_select1" },
                subvariants: [{
                  meta: { createdBy: "/p/_select1" },
                  indices: [1],
                  subvariants: [{
                    indices: [num + 1000],
                    meta: { createdBy: "/p/s" }
                  }]
                }]
              })
            }
          } else if (variantInd === 2) {
            let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(secondChild.stateValues.value);
            expect(i).not.eq(-1);
            generatedVariantInfo.subvariants.push({
              indices: [2],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [i],
                meta: { createdBy: "/p/_selectfromsequence1" },
              }]
            })
          } else {
            let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondChild.stateValues.value);
            expect(i).not.eq(-1);
            generatedVariantInfo.subvariants.push({
              indices: [3],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [i],
                meta: { createdBy: "/p/_select1" },
                subvariants: []
              }]
            })
          }

          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
            generatedVariantInfo
          )

          let secondValue = secondChild.stateValues.value;

          if (ind2 === 0) {
            originalVariantInd = variantInd;
            originalSecondValue = secondValue
          } else {
            expect(variantInd).eq(originalVariantInd);
            expect(secondValue).eq(originalSecondValue);
          }

        })
      }

    }

    cy.log(`repeat last one with previous generatedVariantInfo`)

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>repeat</text>
    <variantControl nvariants="100"/>
    
    <select assignnames="(p)">
      <option><p newNamespace>Favorite color:
        <select>
          <option><text>red</text></option>
          <option><text>orange</text></option>
          <option><text>green</text></option>
          <option><text>white</text></option>
          <option><text>chartreuse</text></option>
        </select>
      </p></option>
      <option><p newNamespace>Selected number: 
        <select assignNames="(s)">
          <option><selectfromsequence from="1000" to="2000" /></option>
          <option><selectfromsequence from="-1000" to="-900" /></option>
        </select>
      </p></option>
      <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" to="g" /></p></option>
      <option><p newNamespace>Variable: <select type="text">u v w x z y</select></p></option>
    </select>
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `repeat`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      let p = components['/p'];

      generatedVariantInfo = {
        index: 19,
        name: numberToLetters(19 + 1, true),
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: []
      }

      let variantInd = firstStringsToInd[p.activeChildren[0].stateValues.value.trim()];
      expect(variantInd).not.eq(undefined);

      let secondChild = p.activeChildren[1];

      if (variantInd === 0) {
        let i = ["red", "orange", "green", "white", "chartreuse"].indexOf(secondChild.stateValues.value)
        expect(i).not.eq(-1);
        generatedVariantInfo.subvariants.push({
          indices: [0],
          meta: { createdBy: "/_select1" },
          subvariants: [{
            indices: [i],
            meta: { createdBy: "/p/_select1" },
            subvariants: []
          }]
        })
      } else if (variantInd === 1) {
        let num = secondChild.stateValues.value;
        expect(Number.isInteger(num)).eq(true);
        if (num > 0) {
          expect(num).gte(1000);
          expect(num).lte(2000);
          generatedVariantInfo.subvariants.push({
            indices: [1],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              indices: [0],
              meta: { createdBy: "/p/_select1" },
              subvariants: [{
                indices: [num - 1000],
                meta: { createdBy: "/p/s" }
              }]
            }]
          })
        } else {
          expect(num).gte(-1000);
          expect(num).lte(-900)
          generatedVariantInfo.subvariants.push({
            indices: [1],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              meta: { createdBy: "/p/_select1" },
              indices: [1],
              subvariants: [{
                indices: [num + 1000],
                meta: { createdBy: "/p/s" }
              }]
            }]
          })
        }
      } else if (variantInd === 2) {
        let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(secondChild.stateValues.value);
        expect(i).not.eq(-1);
        generatedVariantInfo.subvariants.push({
          indices: [2],
          meta: { createdBy: "/_select1" },
          subvariants: [{
            indices: [i],
            meta: { createdBy: "/p/_selectfromsequence1" },
          }]
        })
      } else {
        let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondChild.stateValues.value);
        expect(i).not.eq(-1);
        generatedVariantInfo.subvariants.push({
          indices: [3],
          meta: { createdBy: "/_select1" },
          subvariants: [{
            indices: [i],
            meta: { createdBy: "/p/_select1" },
            subvariants: []
          }]
        })
      }

      console.log(JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo)))
      console.log(generatedVariantInfo)

      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
        generatedVariantInfo
      )

      let secondValue = secondChild.stateValues.value;

      expect(variantInd).eq(originalVariantInd);
      expect(secondValue).eq(originalSecondValue);

    })

  });

  it('selected problems', () => {

    let titlesToInd = {
      "A word problem": 0,
      "A number problem": 1,
    }

    let variantOfProblemsFound = {
      0: [],
      1: []
    }

    let originalVariantInds;
    let originalSecondValues;

    let generatedVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 0; ind < 10; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 3; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
          <option><problem newNamespace><title>A word problem</title>
            <variantControl nvariants="5" variants="a b c d e" />
            <p>Word:
              <select>
                <option selectForVariants="b"><text>bad</text></option>
                <option selectForVariants="a"><text>angry</text></option>
                <option selectForVariants="d"><text>drab</text></option>
                <option selectForVariants="e"><text>excoriated</text></option>
                <option selectForVariants="c"><text>churlish</text></option>
              </select>
            </p>
          </problem></option>
          <option><problem newNamespace><title>A number problem</title>
            <variantControl nvariants="6" />
            <p>Number: <selectfromsequence to="10"/></p>
          </problem></option>
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

          generatedVariantInfo = {
            index: ind,
            name: numberToLetters(ind + 1, true),
            meta: {
              createdBy: "/_document1",
              subvariantsSpecified: false,
            },
            subvariants: [{
              indices: [],
              meta: { createdBy: "/_select1" },
              subvariants: []
            }]
          }

          let variantInds = [];
          let secondValues = [];

          for (let i = 1; i <= 3; i++) {
            let problem = components['/problem' + i];
            let variantInd = titlesToInd[problem.stateValues.title];

            expect(variantInd).not.eq(undefined);

            variantInds.push(variantInd);
            generatedVariantInfo.subvariants[0].indices.push(variantInd);

            let p = problem.activeChildren[4];

            if (variantInd === 0) {
              expect(p.activeChildren[0].stateValues.value.trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value);
              expect(problemVariantInd).not.eq(-1)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value);

              generatedVariantInfo.subvariants[0].subvariants.push({
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd + 1, true),
                meta: {
                  createdBy: `/problem${i}`,
                  subvariantsSpecified: false,
                },
                subvariants: [{
                  indices: [selectVariantInd],
                  meta: {
                    createdBy: `/problem${i}/_select1`,
                  },
                  subvariants: []
                }]
              })
            } else {
              expect(p.activeChildren[0].stateValues.value.trim()).eq("Number:");
              let num = p.activeChildren[1].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              generatedVariantInfo.subvariants[0].subvariants.push({
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd + 1, true),
                meta: {
                  createdBy: `/problem${i}`,
                  subvariantsSpecified: false,
                },
                subvariants: [{
                  indices: [num - 1],
                  meta: {
                    createdBy: `/problem${i}/_selectfromsequence1`,
                  },
                }]
              })
            }

            let secondValue = p.activeChildren[1].stateValues.value;
            if (secondValue === undefined) {
              secondValue = p.activeChildren[1].stateValues.value;
            }
            secondValues.push(secondValue);
          }

          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
            generatedVariantInfo
          )

          if (ind2 === 0) {
            originalVariantInds = variantInds;
            originalSecondValues = secondValues
          } else {
            expect(variantInds).eqls(originalVariantInds);
            expect(secondValues).eqls(originalSecondValues);
          }



        })

      }
    }

    cy.log(`repeat last with previous generatedVariantInfo`)

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>repeat</text>
    <variantControl nvariants="100"/>

    <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
      <option><problem newNamespace><title>A word problem</title>
        <variantControl nvariants="5" variants="a b c d e" />
        <p>Word:
          <select>
            <option selectForVariants="b"><text>bad</text></option>
            <option selectForVariants="a"><text>angry</text></option>
            <option selectForVariants="d"><text>drab</text></option>
            <option selectForVariants="e"><text>excoriated</text></option>
            <option selectForVariants="c"><text>churlish</text></option>
          </select>
        </p>
      </problem></option>
      <option><problem newNamespace><title>A number problem</title>
        <variantControl nvariants="6" />
        <p>Number: <selectfromsequence to="10"/></p>
      </problem></option>
    </select>
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `repeat`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      generatedVariantInfo = {
        index: 9,
        name: numberToLetters(9 + 1, true),
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: [{
          indices: [],
          meta: { createdBy: "/_select1" },
          subvariants: []
        }]
      }

      let variantInds = [];
      let secondValues = [];

      for (let i = 1; i <= 3; i++) {
        let problem = components['/problem' + i];
        let variantInd = titlesToInd[problem.stateValues.title];

        expect(variantInd).not.eq(undefined);

        variantInds.push(variantInd);
        generatedVariantInfo.subvariants[0].indices.push(variantInd);

        let p = problem.activeChildren[4];

        if (variantInd === 0) {
          expect(p.activeChildren[0].stateValues.value.trim()).eq("Word:")
          let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value);
          expect(problemVariantInd).not.eq(-1)
          if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
            variantOfProblemsFound[0].push(problemVariantInd);
          }
          expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

          let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value);

          generatedVariantInfo.subvariants[0].subvariants.push({
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd + 1, true),
            meta: {
              createdBy: `/problem${i}`,
              subvariantsSpecified: true,
            },
            subvariants: [{
              indices: [selectVariantInd],
              meta: {
                createdBy: `/problem${i}/_select1`,
              },
              subvariants: []
            }]
          })
        } else {
          expect(p.activeChildren[0].stateValues.value.trim()).eq("Number:");
          let num = p.activeChildren[1].stateValues.value;
          expect(Number.isInteger(num)).eq(true);
          expect(num >= 1 && num <= 10).eq(true);

          let problemVariantInd = problem.stateValues.generatedVariantInfo.index
          if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
            variantOfProblemsFound[1].push(problemVariantInd);
          }
          generatedVariantInfo.subvariants[0].subvariants.push({
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd + 1, true),
            meta: {
              createdBy: `/problem${i}`,
              subvariantsSpecified: true,
            },
            subvariants: [{
              indices: [num - 1],
              meta: {
                createdBy: `/problem${i}/_selectfromsequence1`,
              },
            }]
          })
        }

        let secondValue = p.activeChildren[1].stateValues.value;
        if (secondValue === undefined) {
          secondValue = p.activeChildren[1].stateValues.value;
        }
        secondValues.push(secondValue);
      }

      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
        generatedVariantInfo
      )

      expect(variantInds).eqls(originalVariantInds);
      expect(secondValues).eqls(originalSecondValues);


    })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([0, 1, 2, 3, 4]);
      expect(variantOfProblemsFound[1].sort()).eqls([0, 1, 2, 3, 4, 5]);
    })

  });

});
