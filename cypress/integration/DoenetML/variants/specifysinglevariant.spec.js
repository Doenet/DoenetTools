import { numberToLetters } from "../../../../src/Core/utils/sequence";

describe('Specifying single variant document tests', function () {

  beforeEach(() => {
    cy.visit('/cypressTest')
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
        requestedVariant: { index: 1 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)

    let nWithIndex1;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithIndex1 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba", "bb", "bc", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bk", "bl", "bm", "bn", "bo", "bp", "bq", "br", "bs", "bt", "bu", "bv", "bw", "bx", "by", "bz", "ca", "cb", "cc", "cd", "ce", "cf", "cg", "ch", "ci", "cj", "ck", "cl", "cm", "cn", "co", "cp", "cq", "cr", "cs", "ct", "cu", "cv"]);
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
        requestedVariant: { index: 1 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
        requestedVariant: { index: 1 },
      }, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `b`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
        requestedVariant: { index: 1 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let generatedVariantInfo;
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo));
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: true,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("Number changes for index 2");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>e</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 2 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithIndex2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithIndex2 = components['/n'].stateValues.value;
      expect(nWithIndex2).not.eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
        requestedVariant: { index: 2 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `f`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
        requestedVariant: { index: 2 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index 102 same as index 2");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 102 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>h</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 102 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index -298 same as index 2");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>i</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: -298 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `i`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
        requestedVariant: { index: -298 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index 83057201 same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>k</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 83057201 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `k`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
        requestedVariant: { index: 83057201 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `l`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("Variant 'a' same as index 1");
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
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("Variant 'b' same as index 2");
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
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
      expect(components['/n'].stateValues.value).eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index '301' same as index 1");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>r</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: '301' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `r`);
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("Variant 'cQ' and index '95' are the same");
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>s</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: '95' },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `s`);

    let nWithIndex95;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithIndex95 = components['/n'].stateValues.value;
      expect(nWithIndex95).not.eq(nWithIndex1);
      expect(nWithIndex95).not.eq(nWithIndex2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 95,
        name: 'cq',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex95],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('95');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(95);
      expect(components["/_document1"].sharedParameters.variantName).eq('cq');
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
      expect(components['/n'].stateValues.value).eq(nWithIndex95);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 95,
        name: 'cq',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex95],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('95');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(95);
      expect(components["/_document1"].sharedParameters.variantName).eq('cq');
    })


    cy.log(`invalid index gives variant 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>u</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: "bad" },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `u`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })


    cy.log(`invalid name gives variant 1`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>v</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { name: "bad" },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `v`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })


    cy.log(`round variant index to nearest integer`)
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>w</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 95.48 },
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `w`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithIndex95);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 95,
        name: 'cq',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex95],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('95');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(95);
      expect(components["/_document1"].sharedParameters.variantName).eq('cq');
    })


  });

  it('document with variant control specifying variantNames', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>1</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 1 },
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
        index: 1,
        name: 'avocado',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('avocado');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["avocado", "broccoli", "carrot", "dill", "eggplant"]);
    })

    cy.log("specify third variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>2</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 3 },
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
        index: 3,
        name: 'carrot',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('carrot');
    })


    cy.log("specify variant bRoccoli")
    let generatedVariantInfo;
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>3</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
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
        index: 2,
        name: 'broccoli',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [5],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo))
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('broccoli');
    })


    cy.log("same result with previous generatedVariantInfo")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>3a</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
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
        index: 2,
        name: 'broccoli',
        meta: {
          subvariantsSpecified: true,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [5],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('broccoli');
    })

    cy.log("specify variant dill")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>4</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
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
        index: 4,
        name: 'dill',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('4');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(components["/_document1"].sharedParameters.variantName).eq('dill');
    })


    cy.log("specify large variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>5</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 20582310 },
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
        index: 5,
        name: 'eggplant',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(components["/_document1"].sharedParameters.variantName).eq('eggplant');
    })


    cy.log("specify negative variant index as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>6</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: '-20582308' },
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
        index: 2,
        name: 'broccoli',
        meta: {
          subvariantsSpecified: false,
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [5],
          subvariants: [],
          meta: { createdBy: "/_select1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('broccoli');
    })


    cy.log("invalid variant index gives index 1")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>7</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 'wrong' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `7`)

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
        index: 1,
        name: 'avocado',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('avocado');
    })


    cy.log("invalid variant name gives index 0")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>8</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { name: 'rotten' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `8`)

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
        index: 1,
        name: 'avocado',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('avocado');
    })


    cy.log("round non-integer variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>9</text>
    <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    <p>Selected variable:
    <select assignnames="(x)">
      <option selectForVariantNames="Dill"><math>d</math></option>
      <option selectForVariantNames="carrot"><math>c</math></option>
      <option selectForVariantNames="eggplant"><math>e</math></option>
      <option selectForVariantNames="avocado"><math>a</math></option>
      <option selectForVariantNames="broccoli"><math>b</math></option>
    </select>
    </p>
    <p>Selected variable repeated: <copy name="x2" tname="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" tname="_select1" /></p>
    `,
        requestedVariant: { index: 4.5 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `9`)

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
        index: 5,
        name: 'eggplant',
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
      expect(components["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(components["/_document1"].sharedParameters.variantName).eq('eggplant');
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
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed50283;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed50283 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c", "d", "e"]);
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
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `b`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed50283);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
        requestedVariant: { index: 124082 },
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
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
        requestedVariant: { index: 124082 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `d`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed25018);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed52018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('52018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('c');
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
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed52018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('52018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('c');
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
        requestedVariant: { index: '820572309' },
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
        index: 4,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(components["/_document1"].sharedParameters.variantName).eq('d');
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
        requestedVariant: { index: '820572309' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(components["/_document1"].sharedParameters.variantName).eq('d');
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
        requestedVariant: { index: '-820572305' },
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
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed603962],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('603962');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(components["/_document1"].sharedParameters.variantName).eq('e');
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
        requestedVariant: { index: '-820572305' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed603962);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed603962],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo))
      expect(components["/_document1"].sharedParameters.variantSeed).eq('603962');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(components["/_document1"].sharedParameters.variantName).eq('e');
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
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: [{
          indices: [nWithSeed603962],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('603962');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(components["/_document1"].sharedParameters.variantName).eq('e');
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
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `k`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `l`)
    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed2917392);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
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
        requestedVariant: { index: 124082 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `m`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed52018);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed52018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('52018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
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
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed603962],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('603962');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('c');
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
        requestedVariant: { index: '820572309' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `o`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed50283);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(components["/_document1"].sharedParameters.variantName).eq('d');
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
        requestedVariant: { index: '-820572305' },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `p`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed25018);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(components["/_document1"].sharedParameters.variantName).eq('e');
    })

  });

  it('document with variant control partially specifying seeds and variantNames', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="4" seeds="50283  25018  " variantNames="d h" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed50283;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed50283 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'd',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('d');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["d", "h", "c", "e"]);
    })

    cy.log("specify second variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="4" seeds="50283  25018  " variantNames="d h" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 124082 },
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
        index: 2,
        name: 'h',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('h');
    })

    cy.log("specify third variant by name")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="4" seeds="50283  25018 " variantNames="d h" />
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

    let nWithSeed3;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed3 = components['/n'].stateValues.value;
      expect(nWithSeed3).not.eq(nWithSeed50283);
      expect(nWithSeed3).not.eq(nWithSeed25018);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed3],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('c');
    })

    cy.log("specify fourth variant as string")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <variantControl nvariants="4" seeds="50283  25018 " variantNames="d h" />
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

    let nWithSeed4;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed4 = components['/n'].stateValues.value;
      expect(nWithSeed4).not.eq(nWithSeed50283);
      expect(nWithSeed4).not.eq(nWithSeed25018);
      expect(nWithSeed4).not.eq(nWithSeed3);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'e',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed4],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('4');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(components["/_document1"].sharedParameters.variantName).eq('e');
    })

  });

  it('document with variant control specifying only number of variants', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="3" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed1 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c"]);
    })

    cy.log("specify second variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="3" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 5 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let nWithSeed2;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed2 = components['/n'].stateValues.value;
      expect(nWithSeed2).not.eq(nWithSeed1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(components["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("specify third variant by name")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="3" />
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

    let nWithSeed3;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed3 = components['/n'].stateValues.value;
      expect(nWithSeed3).not.eq(nWithSeed1);
      expect(nWithSeed3).not.eq(nWithSeed2);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed3],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('c');
    })


  });

  it('document with variant control specifying zero variants', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="0" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 1 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed1 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["a"]);
    })

    cy.log("specify second variant index gives first")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="0" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 2 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })


  });

  it('document with variant control specifying fractional number of variants', () => {

    cy.log("specify third variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="3.5" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 7 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed3;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed3 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed3],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(components["/_document1"].sharedParameters.variantName).eq('c');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c", "d"]);
    })


  });

  it('document with variant control specifying negative fractional number of variants', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="-3.5" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 19 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed1 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
      expect(components["/_document1"].sharedParameters.allPossibleVariants).eqls(["a"]);
    })

    cy.log("specify second variant index gives first")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="-3.5" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 5 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      expect(components['/n'].stateValues.value).eq(nWithSeed1);
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
    })


  });

  it('document with variant control specifying too many variants', () => {

    cy.log("specify first variant index")
    cy.window().then((win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="10000" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariant: { index: 1000 },
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);
      nWithSeed1 = components['/n'].stateValues.value;
      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: false,
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(components["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(components["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(components["/_document1"].sharedParameters.variantName).eq('a');
      expect(components["/_document1"].sharedParameters.allPossibleVariants.length).eq(999);
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
    for (let ind = 1; ind <= 20; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
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
            name: numberToLetters(ind, true),
            meta: {
              createdBy: "/_document1",
              subvariantsSpecified: false,
            },
            subvariants: []
          }

          let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
          expect(variantInd).not.eq(undefined);

          let secondChild = p.activeChildren[1];

          if (variantInd === 0) {
            let i = ["red", "orange", "green", "white", "chartreuse"].indexOf(secondChild.stateValues.value)
            expect(i).not.eq(-1);
            generatedVariantInfo.subvariants.push({
              indices: [1],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [i + 1],
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
                indices: [2],
                meta: { createdBy: "/_select1" },
                subvariants: [{
                  indices: [1],
                  meta: { createdBy: "/p/_select1" },
                  subvariants: [{
                    indices: [num - 999],
                    meta: { createdBy: "/p/s" }
                  }]
                }]
              })
            } else {
              expect(num).gte(-1000);
              expect(num).lte(-900)
              generatedVariantInfo.subvariants.push({
                indices: [2],
                meta: { createdBy: "/_select1" },
                subvariants: [{
                  meta: { createdBy: "/p/_select1" },
                  indices: [2],
                  subvariants: [{
                    indices: [num + 1001],
                    meta: { createdBy: "/p/s" }
                  }]
                }]
              })
            }
          } else if (variantInd === 2) {
            let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(secondChild.stateValues.value);
            expect(i).not.eq(-1);
            generatedVariantInfo.subvariants.push({
              indices: [3],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [i + 1],
                meta: { createdBy: "/p/_selectfromsequence1" },
              }]
            })
          } else {
            let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondChild.stateValues.value);
            expect(i).not.eq(-1);
            generatedVariantInfo.subvariants.push({
              indices: [4],
              meta: { createdBy: "/_select1" },
              subvariants: [{
                indices: [i + 1],
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
        index: 20,
        name: numberToLetters(20, true),
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: []
      }

      let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
      expect(variantInd).not.eq(undefined);

      let secondChild = p.activeChildren[1];

      if (variantInd === 0) {
        let i = ["red", "orange", "green", "white", "chartreuse"].indexOf(secondChild.stateValues.value)
        expect(i).not.eq(-1);
        generatedVariantInfo.subvariants.push({
          indices: [1],
          meta: { createdBy: "/_select1" },
          subvariants: [{
            indices: [i + 1],
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
            indices: [2],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              indices: [1],
              meta: { createdBy: "/p/_select1" },
              subvariants: [{
                indices: [num - 999],
                meta: { createdBy: "/p/s" }
              }]
            }]
          })
        } else {
          expect(num).gte(-1000);
          expect(num).lte(-900)
          generatedVariantInfo.subvariants.push({
            indices: [2],
            meta: { createdBy: "/_select1" },
            subvariants: [{
              meta: { createdBy: "/p/_select1" },
              indices: [2],
              subvariants: [{
                indices: [num + 1001],
                meta: { createdBy: "/p/s" }
              }]
            }]
          })
        }
      } else if (variantInd === 2) {
        let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(secondChild.stateValues.value);
        expect(i).not.eq(-1);
        generatedVariantInfo.subvariants.push({
          indices: [3],
          meta: { createdBy: "/_select1" },
          subvariants: [{
            indices: [i + 1],
            meta: { createdBy: "/p/_selectfromsequence1" },
          }]
        })
      } else {
        let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondChild.stateValues.value);
        expect(i).not.eq(-1);
        generatedVariantInfo.subvariants.push({
          indices: [4],
          meta: { createdBy: "/_select1" },
          subvariants: [{
            indices: [i + 1],
            meta: { createdBy: "/p/_select1" },
            subvariants: []
          }]
        })
      }

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
      "A word problem": 1,
      "A number problem": 2,
    }

    let variantOfProblemsFound = {
      0: [],
      1: []
    }

    let originalVariantInds;
    let originalSecondValues;

    let generatedVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
          <option><problem newNamespace><title>A word problem</title>
            <variantControl nvariants="5" variantNames="a b c d e" />
            <p>Word:
              <select>
                <option selectForVariantNames="b"><text>bad</text></option>
                <option selectForVariantNames="a"><text>angry</text></option>
                <option selectForVariantNames="d"><text>drab</text></option>
                <option selectForVariantNames="e"><text>excoriated</text></option>
                <option selectForVariantNames="c"><text>churlish</text></option>
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
            name: numberToLetters(ind, true),
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

            if (variantInd === 1) {
              expect(p.activeChildren[0].trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value) + 1;
              expect(problemVariantInd).not.eq(0)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value) + 1;

              generatedVariantInfo.subvariants[0].subvariants.push({
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd, true),
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
              expect(p.activeChildren[0].trim()).eq("Number:");
              let num = p.activeChildren[1].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              generatedVariantInfo.subvariants[0].subvariants.push({
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd, true),
                meta: {
                  createdBy: `/problem${i}`,
                  subvariantsSpecified: false,
                },
                subvariants: [{
                  indices: [num],
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
          expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
            generatedVariantInfo.subvariants[0].subvariants
          );


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
        <variantControl nvariants="5" variantNames="a b c d e" />
        <p>Word:
          <select>
            <option selectForVariantNames="b"><text>bad</text></option>
            <option selectForVariantNames="a"><text>angry</text></option>
            <option selectForVariantNames="d"><text>drab</text></option>
            <option selectForVariantNames="e"><text>excoriated</text></option>
            <option selectForVariantNames="c"><text>churlish</text></option>
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
        index: 10,
        name: numberToLetters(10, true),
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

        if (variantInd === 1) {
          expect(p.activeChildren[0].trim()).eq("Word:")
          let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value) + 1;
          expect(problemVariantInd).not.eq(0)
          if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
            variantOfProblemsFound[0].push(problemVariantInd);
          }
          expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

          let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value) + 1;

          generatedVariantInfo.subvariants[0].subvariants.push({
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd, true),
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
          expect(p.activeChildren[0].trim()).eq("Number:");
          let num = p.activeChildren[1].stateValues.value;
          expect(Number.isInteger(num)).eq(true);
          expect(num >= 1 && num <= 10).eq(true);

          let problemVariantInd = problem.stateValues.generatedVariantInfo.index
          if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
            variantOfProblemsFound[1].push(problemVariantInd);
          }
          generatedVariantInfo.subvariants[0].subvariants.push({
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd, true),
            meta: {
              createdBy: `/problem${i}`,
              subvariantsSpecified: true,
            },
            subvariants: [{
              indices: [num],
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
      expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
        generatedVariantInfo.subvariants[0].subvariants
      );

      expect(variantInds).eqls(originalVariantInds);
      expect(secondValues).eqls(originalSecondValues);


    })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3, 4, 5]);
      expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4, 5, 6]);
    })

  });

  it('selected problems, one outside select', () => {

    let titlesToInd = {
      "A word problem": 1,
      "A number problem": 2,
    }

    let variantOfProblemsFound = {
      0: [],
      1: []
    }

    let originalVariantInds;
    let originalSecondValues;

    let generatedVariantInfo;
    let itemVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <problem newNamespace name="problem1"><title>A number problem</title>
          <variantControl nvariants="6" />
          <p>Number: <selectfromsequence to="10"/></p>
        </problem>
        <select assignnames="(problem2)  (problem3)" numbertoselect="2" withReplacement>
          <option><problem newNamespace><title>A word problem</title>
            <variantControl nvariants="5" variantNames="a b c d e" />
            <p>Word:
              <select>
                <option selectForVariantNames="b"><text>bad</text></option>
                <option selectForVariantNames="a"><text>angry</text></option>
                <option selectForVariantNames="d"><text>drab</text></option>
                <option selectForVariantNames="e"><text>excoriated</text></option>
                <option selectForVariantNames="c"><text>churlish</text></option>
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
            name: numberToLetters(ind, true),
            meta: {
              createdBy: "/_document1",
              subvariantsSpecified: false,
            },
            subvariants: [undefined, {
              indices: [],
              meta: { createdBy: "/_select1" },
              subvariants: []
            }]
          }

          itemVariantInfo = [];

          let variantInds = [];
          let secondValues = [];

          for (let i = 1; i <= 3; i++) {
            let problem = components['/problem' + i];
            let variantInd = titlesToInd[problem.stateValues.title];

            expect(variantInd).not.eq(undefined);

            variantInds.push(variantInd);
            if (i !== 1) {
              generatedVariantInfo.subvariants[1].indices.push(variantInd);
            }
            let p = problem.activeChildren[4];

            if (variantInd === 1) {
              expect(p.activeChildren[0].trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value) + 1;
              expect(problemVariantInd).not.eq(0)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value) + 1;

              let problemVariantInfo = {
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd, true),
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

              }

              itemVariantInfo.push(problemVariantInfo);
              generatedVariantInfo.subvariants[1].subvariants.push(
                problemVariantInfo
              );

            } else {
              expect(p.activeChildren[0].trim()).eq("Number:");
              let num = p.activeChildren[1].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              let problemVariantInfo = {
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd, true),
                meta: {
                  createdBy: `/problem${i}`,
                  subvariantsSpecified: false,
                },
                subvariants: [{
                  indices: [num],
                  meta: {
                    createdBy: `/problem${i}/_selectfromsequence1`,
                  },
                }]
              }
              itemVariantInfo.push(problemVariantInfo);
              if (i === 1) {
                generatedVariantInfo.subvariants[0] = problemVariantInfo
              } else {
                generatedVariantInfo.subvariants[1].subvariants.push(
                  problemVariantInfo
                );
              }
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
          expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
            itemVariantInfo
          );


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

    <problem newNamespace name="problem1"><title>A number problem</title>
      <variantControl nvariants="6" />
      <p>Number: <selectfromsequence to="10"/></p>
    </problem>
    <select assignnames="(problem2)  (problem3)" numbertoselect="2" withReplacement>
      <option><problem newNamespace><title>A word problem</title>
        <variantControl nvariants="5" variantNames="a b c d e" />
        <p>Word:
          <select>
            <option selectForVariantNames="b"><text>bad</text></option>
            <option selectForVariantNames="a"><text>angry</text></option>
            <option selectForVariantNames="d"><text>drab</text></option>
            <option selectForVariantNames="e"><text>excoriated</text></option>
            <option selectForVariantNames="c"><text>churlish</text></option>
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
        index: 10,
        name: numberToLetters(10, true),
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: [undefined, {
          indices: [],
          meta: { createdBy: "/_select1" },
          subvariants: []
        }]
      }

      itemVariantInfo = [];

      let variantInds = [];
      let secondValues = [];

      for (let i = 1; i <= 3; i++) {
        let problem = components['/problem' + i];
        let variantInd = titlesToInd[problem.stateValues.title];

        expect(variantInd).not.eq(undefined);

        variantInds.push(variantInd);
        if (i !== 1) {
          generatedVariantInfo.subvariants[1].indices.push(variantInd);
        }
        let p = problem.activeChildren[4];

        if (variantInd === 1) {
          expect(p.activeChildren[0].trim()).eq("Word:")
          let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value) + 1;
          expect(problemVariantInd).not.eq(0)
          if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
            variantOfProblemsFound[0].push(problemVariantInd);
          }
          expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

          let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value) + 1;

          let problemVariantInfo = {
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd, true),
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

          }

          itemVariantInfo.push(problemVariantInfo);
          generatedVariantInfo.subvariants[1].subvariants.push(
            problemVariantInfo
          );
        } else {
          expect(p.activeChildren[0].trim()).eq("Number:");
          let num = p.activeChildren[1].stateValues.value;
          expect(Number.isInteger(num)).eq(true);
          expect(num >= 1 && num <= 10).eq(true);

          let problemVariantInd = problem.stateValues.generatedVariantInfo.index
          if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
            variantOfProblemsFound[1].push(problemVariantInd);
          }
          let problemVariantInfo = {
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd, true),
            meta: {
              createdBy: `/problem${i}`,
              subvariantsSpecified: true,
            },
            subvariants: [{
              indices: [num],
              meta: {
                createdBy: `/problem${i}/_selectfromsequence1`,
              },
            }]
          }
          itemVariantInfo.push(problemVariantInfo);
          if (i === 1) {
            generatedVariantInfo.subvariants[0] = problemVariantInfo
          } else {
            generatedVariantInfo.subvariants[1].subvariants.push(
              problemVariantInfo
            );
          }
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
      expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
        itemVariantInfo
      );

      expect(variantInds).eqls(originalVariantInds);
      expect(secondValues).eqls(originalSecondValues);


    })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3, 4, 5]);
      expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4, 5, 6]);
    })

  });

  it('selected problems, one without variant control', () => {

    let titlesToInd = {
      "A word problem": 1,
      "A number problem": 2,
    }

    let variantOfProblemsFound = {
      0: [],
      1: []
    }

    let originalVariantInds;
    let originalSecondValues;

    let generatedVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
          <option><problem newNamespace><title>A word problem</title>
            <variantControl nvariants="5" variantNames="a b c d e" />
            <p>Word:
              <select>
                <option selectForVariantNames="b"><text>bad</text></option>
                <option selectForVariantNames="a"><text>angry</text></option>
                <option selectForVariantNames="d"><text>drab</text></option>
                <option selectForVariantNames="e"><text>excoriated</text></option>
                <option selectForVariantNames="c"><text>churlish</text></option>
              </select>
            </p>
          </problem></option>
          <option><problem newNamespace><title>A number problem</title>
            <text>Filler to move children to same spot</text>
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
            name: numberToLetters(ind, true),
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

            if (variantInd === 1) {
              expect(p.activeChildren[0].trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value) + 1;
              expect(problemVariantInd).not.eq(0)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value) + 1;

              generatedVariantInfo.subvariants[0].subvariants.push({
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd, true),
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
              expect(p.activeChildren[0].trim()).eq("Number:");
              let num = p.activeChildren[1].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              generatedVariantInfo.subvariants[0].subvariants.push({
                index: problemVariantInd,
                name: numberToLetters(problemVariantInd, true),
                meta: {
                  createdBy: `/problem${i}`,
                  subvariantsSpecified: false,
                },
                subvariants: [{
                  indices: [num],
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
          expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
            generatedVariantInfo.subvariants[0].subvariants
          );


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
        <variantControl nvariants="5" variantNames="a b c d e" />
        <p>Word:
          <select>
            <option selectForVariantNames="b"><text>bad</text></option>
            <option selectForVariantNames="a"><text>angry</text></option>
            <option selectForVariantNames="d"><text>drab</text></option>
            <option selectForVariantNames="e"><text>excoriated</text></option>
            <option selectForVariantNames="c"><text>churlish</text></option>
          </select>
        </p>
      </problem></option>
      <option><problem newNamespace><title>A number problem</title>
        <text>Filler to move children to same spot</text>
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
        index: 10,
        name: numberToLetters(10, true),
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

        if (variantInd === 1) {
          expect(p.activeChildren[0].trim()).eq("Word:")
          let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(p.activeChildren[1].stateValues.value) + 1;
          expect(problemVariantInd).not.eq(0)
          if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
            variantOfProblemsFound[0].push(problemVariantInd);
          }
          expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

          let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(p.activeChildren[1].stateValues.value) + 1;

          generatedVariantInfo.subvariants[0].subvariants.push({
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd, true),
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
          expect(p.activeChildren[0].trim()).eq("Number:");
          let num = p.activeChildren[1].stateValues.value;
          expect(Number.isInteger(num)).eq(true);
          expect(num >= 1 && num <= 10).eq(true);

          let problemVariantInd = problem.stateValues.generatedVariantInfo.index
          if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
            variantOfProblemsFound[1].push(problemVariantInd);
          }
          generatedVariantInfo.subvariants[0].subvariants.push({
            index: problemVariantInd,
            name: numberToLetters(problemVariantInd, true),
            meta: {
              createdBy: `/problem${i}`,
              subvariantsSpecified: true,
            },
            subvariants: [{
              indices: [num],
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
      expect(components["/_document1"].stateValues.itemVariantInfo).eqls(
        generatedVariantInfo.subvariants[0].subvariants
      );

      expect(variantInds).eqls(originalVariantInds);
      expect(secondValues).eqls(originalSecondValues);


    })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3, 4, 5]);
      // not for second problem since have 100 possible variants by default
      // expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4, 5, 6]);
    })

  });

  it('select and sample random numbers', () => {

    let generatedVariantInfo;
    let originalNumbers;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
        <p><selectRandomNumbers name="s1" assignNames="m" /></p>
        <p><sampleRandomNumbers name="s2" assignNames="n" /></p>
        <p><selectRandomNumbers name="s3" type="gaussian" numberToSelect="3" assignNames="x1 x2 x3" /></p>
        <p><sampleRandomNumbers name="s4" type="gaussian" numberOfSamples="3" assignNames="y1 y2 y3" /></p>
        `,
            requestedVariant: { index: ind },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          let valuesS1 = components["/s1"].stateValues.selectedValues;
          let valuesS3 = components["/s3"].stateValues.selectedValues;

          let valuesS2 = components["/s2"].stateValues.sampledValues;
          let valuesS4 = components["/s4"].stateValues.sampledValues;

          generatedVariantInfo = {
            index: ind,
            name: numberToLetters(ind, true),
            meta: {
              createdBy: "/_document1",
              subvariantsSpecified: false,
            },
            subvariants: [{
              values: [...valuesS1],
              meta: { createdBy: "/s1" }
            }, {
              values: [...valuesS3],
              meta: { createdBy: "/s3" }
            }]
          }

          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
            generatedVariantInfo
          )

          let allNumbers = [...valuesS1, ...valuesS2, ...valuesS3, ...valuesS4]

          if (ind2 === 0) {
            expect(allNumbers).not.eqls(originalNumbers);
            originalNumbers = allNumbers;
          } else {
            expect(allNumbers).eqls(originalNumbers);
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
    <p><selectRandomNumbers name="s1" assignNames="m" /></p>
    <p><sampleRandomNumbers name="s2" assignNames="n" /></p>
    <p><selectRandomNumbers name="s3" type="gaussian" numberToSelect="3" assignNames="x1 x2 x3" /></p>
    <p><sampleRandomNumbers name="s4" type="gaussian" numberOfSamples="3" assignNames="y1 y2 y3" /></p>
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `repeat`)


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let valuesS1 = components["/s1"].stateValues.selectedValues;
      let valuesS3 = components["/s3"].stateValues.selectedValues;

      let valuesS2 = components["/s2"].stateValues.sampledValues;
      let valuesS4 = components["/s4"].stateValues.sampledValues;

      generatedVariantInfo = {
        index: 10,
        name: numberToLetters(10, true),
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: [{
          values: [...valuesS1],
          meta: { createdBy: "/s1" }
        }, {
          values: [...valuesS3],
          meta: { createdBy: "/s3" }
        }]
      }

      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
        generatedVariantInfo
      )

      let allNumbers = [...valuesS1, ...valuesS2, ...valuesS3, ...valuesS4]

      expect(allNumbers).eqls(originalNumbers);

    })


  });

  it('choiceinputs', () => {

    let generatedVariantInfo;
    let originalChoiceOrders;
    let originalChoiceTexts;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then((win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
        <p><choiceinput randomizeOrder name="c1">
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
        </choiceinput></p>
        <p><choiceinput randomizeOrder inline name="c2">
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
        </choiceinput></p>
        <p><choiceinput name="c3">
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
        </choiceinput></p>
        <p><choiceinput inline name="c4">
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
          <choice><lorem generateWords="3" /></choice>
        </choiceinput></p>
        `,
            requestedVariant: { index: ind },
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then((win) => {
          let components = Object.assign({}, win.state.components);

          let orderC1 = components["/c1"].stateValues.choiceOrder;
          let orderC2 = components["/c2"].stateValues.choiceOrder;

          let orderC3 = components["/c3"].stateValues.choiceOrder;
          let orderC4 = components["/c4"].stateValues.choiceOrder;

          generatedVariantInfo = {
            index: ind,
            name: numberToLetters(ind, true),
            meta: {
              createdBy: "/_document1",
              subvariantsSpecified: false,
            },
            subvariants: [{
              indices: [...orderC1],
              meta: { createdBy: "/c1" },
              subvariants: []
            }, {
              indices: [...orderC2],
              meta: { createdBy: "/c2" },
              subvariants: []
            }]
          }

          expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
            generatedVariantInfo
          )

          let textC1 = components["/c1"].stateValues.choiceTexts;
          let textC2 = components["/c2"].stateValues.choiceTexts;

          let textC3 = components["/c3"].stateValues.choiceTexts;
          let textC4 = components["/c4"].stateValues.choiceTexts;


          let allOrders = [...orderC1, ...orderC2, ...orderC3, ...orderC4]
          let allTexts = [...textC1, ...textC2, ...textC3, ...textC4]
          if (ind2 === 0) {
            expect(allOrders).not.eqls(originalChoiceOrders);
            originalChoiceOrders = allOrders;
            expect(allTexts).not.eqls(originalChoiceTexts);
            originalChoiceTexts = allTexts;
          } else {
            expect(allOrders).eqls(originalChoiceOrders);
            expect(allTexts).eqls(originalChoiceTexts);
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
    <p><choiceinput randomizeOrder name="c1">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput randomizeOrder inline name="c2">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput name="c3">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput inline name="c4">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    `,
        requestedVariant: generatedVariantInfo,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `repeat`)


    cy.window().then((win) => {
      let components = Object.assign({}, win.state.components);

      let orderC1 = components["/c1"].stateValues.choiceOrder;
      let orderC2 = components["/c2"].stateValues.choiceOrder;

      let orderC3 = components["/c3"].stateValues.choiceOrder;
      let orderC4 = components["/c4"].stateValues.choiceOrder;

      generatedVariantInfo = {
        index: 10,
        name: numberToLetters(10, true),
        meta: {
          createdBy: "/_document1",
          subvariantsSpecified: true,
        },
        subvariants: [{
          indices: [...orderC1],
          meta: { createdBy: "/c1" },
          subvariants: []
        }, {
          indices: [...orderC2],
          meta: { createdBy: "/c2" },
          subvariants: []
        }]
      }

      expect(components["/_document1"].stateValues.generatedVariantInfo).eqls(
        generatedVariantInfo
      )


      let textC1 = components["/c1"].stateValues.choiceTexts;
      let textC2 = components["/c2"].stateValues.choiceTexts;

      let textC3 = components["/c3"].stateValues.choiceTexts;
      let textC4 = components["/c4"].stateValues.choiceTexts;

      let allOrders = [...orderC1, ...orderC2, ...orderC3, ...orderC4]
      let allTexts = [...textC1, ...textC2, ...textC3, ...textC4]
      expect(allOrders).eqls(originalChoiceOrders);
      expect(allTexts).eqls(originalChoiceTexts);
    })


  });

  it('excluded sequence items, reload generated variant', () => {


    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {


      let doenetML = `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
      <selectFromSequence from="1" to="20000000000" exclude="20000000000 30000000000 40000000000 50000000000 60000000000 80000000000 90000000000 11000000000 12000000000 13000000000 14000000000 15000000000 16000000000 17000000000 19000000000" assignNames="m" />
      <selectFromSequence from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" assignNames="n" />
      `

      cy.window().then((win) => {
        win.postMessage({
          doenetML,
          requestedVariant: { index: ind },
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      let generatedVariantInfo;
      let indexChosen1, indexChosen2;
      let m,n;

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo));
        indexChosen1 = components["/_selectfromsequence1"].stateValues.selectedIndices[0];
        indexChosen2 = components["/_selectfromsequence1"].stateValues.selectedIndices[0];
        m = components["/m"].stateValues.value;
        n = components["/n"].stateValues.value;

      })


      cy.log('repeat from generatedVariantInfo')


      cy.window().then((win) => {

        win.postMessage({
          doenetML: `<text>${ind}a</text>${doenetML}`,
          requestedVariant: generatedVariantInfo,
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}a`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/_selectfromsequence1"].stateValues.selectedIndices[0]).eq(indexChosen1);
        expect(components["/_selectfromsequence1"].stateValues.selectedIndices[0]).eq(indexChosen2);
        expect(components["/m"].stateValues.value).eq(m);
        expect(components["/n"].stateValues.value).eq(n);

      })


    }


  });

  it('excluded combinations of sequence items, reload generated variant', () => {


    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      let doenetML = `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
      <selectFromSequence from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" excludeCombinations="(1 7) (1 10) (1 18) (7 10) (7 18) (7 20) (10 1) (10 7) (10 20) (18 1) (18 7) (18 20) (20 1) (20 10)" assignNames="m n" numberToSelect="2" />
      <selectFromSequence type="math" from="x" step="h" length="7" exclude="x+h x+2h x+3h x+5h" excludeCombinations="(x x+4h) (x+4h x+6h) (x+6h x)" assignNames="x1 x2" numberToSelect="2" />
      <selectFromSequence type="letters" from="a" to="i" exclude="b c d e f h" excludeCombinations="(a i) (g a) (i g)" assignNames="l1 l2" numberToSelect="2" />
      `;

      cy.window().then((win) => {
        win.postMessage({
          doenetML,
          requestedVariant: { index: ind },
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      let generatedVariantInfo;
      let indicesChosen1, indicesChosen2, indicesChosen3;
      let m, n, x1, x2, l1, l2;

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        generatedVariantInfo = JSON.parse(JSON.stringify(components["/_document1"].stateValues.generatedVariantInfo));

        indicesChosen1 = [...components["/_selectfromsequence1"].stateValues.selectedIndices];
        m = components["/m"].stateValues.value;
        n = components["/n"].stateValues.value;

        indicesChosen2 = [...components["/_selectfromsequence2"].stateValues.selectedIndices];
        x1 = components["/x1"].stateValues.value;
        x2 = components["/x2"].stateValues.value;

        indicesChosen3 = [...components["/_selectfromsequence3"].stateValues.selectedIndices];
        l1 = components["/l1"].stateValues.value;
        l2 = components["/l2"].stateValues.value;

      })


      cy.log('repeat from generatedVariantInfo')


      cy.window().then((win) => {

        win.postMessage({
          doenetML: `<text>${ind}a</text>${doenetML}`,
          requestedVariant: generatedVariantInfo,
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}a`)

      cy.window().then((win) => {
        let components = Object.assign({}, win.state.components);
        expect(components["/_selectfromsequence1"].stateValues.selectedIndices).eqls(indicesChosen1);
        expect(components["/m"].stateValues.value).eq(m);
        expect(components["/n"].stateValues.value).eq(n);
        expect(components["/_selectfromsequence2"].stateValues.selectedIndices).eqls(indicesChosen2);
        expect(components["/x1"].stateValues.value.equals(x1)).be.true;
        expect(components["/x2"].stateValues.value.equals(x2)).be.true;
        expect(components["/_selectfromsequence1"].stateValues.selectedIndices).eqls(indicesChosen1);
        expect(components["/l1"].stateValues.value).eq(l1);
        expect(components["/l2"].stateValues.value).eq(l2);

      })


    }


  });



});
