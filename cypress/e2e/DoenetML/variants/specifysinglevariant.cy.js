import { numberToLetters } from "../../../../src/Core/utils/sequence";
import cssesc from 'cssesc';
import me from 'math-expressions';

function cesc(s) {
  s = cssesc(s, { isIdentifier: true });
  if (s.slice(0, 2) === '\\#') {
    s = s.slice(1);
  }
  return s;
}

describe('Specifying single variant document tests', function () {

  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit('/cypressTest')
  })

  it('document with no variant control', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>1</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)

    let nWithIndex1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithIndex1 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba", "bb", "bc", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bk", "bl", "bm", "bn", "bo", "bp", "bq", "br", "bs", "bt", "bu", "bv", "bw", "bx", "by", "bz", "ca", "cb", "cc", "cd", "ce", "cf", "cg", "ch", "ci", "cj", "ck", "cl", "cm", "cn", "co", "cp", "cq", "cr", "cs", "ct", "cu", "cv"]);
    })

    cy.log("Number doesn't change with multiple updates");

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>a</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>b</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    });

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `b`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>c</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let generatedVariantInfo;
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(stateVariables["/_document1"].stateValues.generatedVariantInfo));
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    // cy.log(`Number doesn't change when use generatedVariantInfo`)
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>d</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `d`)
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 1,
    //     name: 'a',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex1],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    // })

    cy.log("Number changes for index 2");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>e</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 2,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithIndex2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithIndex2 = stateVariables['/n'].stateValues.value;
      expect(nWithIndex2).not.eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>f</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 2,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `f`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 2,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index 102 same as index 2");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>g2</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 102,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g2`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>h</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 102,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index -298 same as index 2");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>i</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: -298,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `i`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.reload(); // occasionally reload so doesn't slow way down (presumably due to garbage collection)

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>j</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: -298,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("Index 83057201 same as index 1");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>k</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 83057201,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `k`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>l</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 83057201,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `l`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    // cy.log("Variant 'a' same as index 1");
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>m</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'a' },
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `m`);
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 1,
    //     name: 'a',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex1],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    // })

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>n</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'a' },
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `n`);
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 1,
    //     name: 'a',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex1],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    // })

    // cy.log("Variant 'b' same as index 2");
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>o</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'b' },
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `o`);
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 2,
    //     name: 'b',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex2],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    // })

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>q</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'b' },
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `q`);
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex2);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 2,
    //     name: 'b',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex2],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    // })

    cy.log("Index '301' same as index 1");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>r</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '301',
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `r`);
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("Variant 'cQ' and index '95' are the same");
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>s</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '95',
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `s`);

    let nWithIndex95;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithIndex95 = stateVariables['/n'].stateValues.value;
      expect(nWithIndex95).not.eq(nWithIndex1);
      expect(nWithIndex95).not.eq(nWithIndex2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 95,
        name: 'cq',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex95],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('95');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(95);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('cq');
    })

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>t</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'cQ' },
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `t`);
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex95);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 95,
    //     name: 'cq',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex95],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('95');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(95);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('cq');
    // })

    cy.reload(); // occasionally reload so doesn't slow way down (presumably due to garbage collection)

    cy.log(`invalid index gives variant 1`)
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>u</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: "bad",
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `u`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })


    // cy.log(`invalid name gives variant 1`)
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <p>
    //   <text>v</text>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: "bad" },
    //   }, "*");
    // });
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `v`)

    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithIndex1);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 1,
    //     name: 'a',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [nWithIndex1],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    // })


    cy.log(`round variant index to nearest integer`)
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <p>
      <text>w</text>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 95.48,
      }, "*");
    });
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `w`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithIndex95);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 95,
        name: 'cq',
        meta: {
          createdBy: "/_document1"
        },
        subvariants: [{
          indices: [nWithIndex95],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('95');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(95);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('cq');
    })


  });

  it('document with variant control specifying variantNames', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
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
    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)

    cy.window().then(async (win) => {
      let expectedx = 'a';

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/x'].stateValues.value;
      expect(x).eq(expectedx);
      let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(xorig).eq(expectedx);
      let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
      expect(x2).eq(expectedx);
      let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(x3).eq(expectedx);
      // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
      //   index: 1,
      //   name: 'avocado',
      //   meta: {
      //     createdBy: "/_document1"
      //   },
      //   subvariants: [{
      //     indices: [4],
      //     subvariants: [],
      //     meta: { createdBy: "/_select1" }
      //   }]
      // })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('avocado');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["avocado", "broccoli", "carrot", "dill", "eggplant"]);
    })

    cy.log("specify third variant index")
    cy.window().then(async (win) => {
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
    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
        requestedVariantIndex: 3,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `2`)

    cy.window().then(async (win) => {
      let expectedx = 'c';

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/x'].stateValues.value;
      expect(x).eq(expectedx);
      let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(xorig).eq(expectedx);
      let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
      expect(x2).eq(expectedx);
      let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(x3).eq(expectedx);
      // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
      //   index: 3,
      //   name: 'carrot',
      //   meta: {
      //     createdBy: "/_document1"
      //   },
      //   subvariants: [{
      //     indices: [2],
      //     subvariants: [],
      //     meta: { createdBy: "/_select1" }
      //   }]
      // })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('carrot');
    })


    // cy.log("specify variant bRoccoli")
    // let generatedVariantInfo;
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>3</text>
    // <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    // <p>Selected variable:
    // <select assignnames="(x)">
    //   <option selectForVariantNames="Dill"><math>d</math></option>
    //   <option selectForVariantNames="carrot"><math>c</math></option>
    //   <option selectForVariantNames="eggplant"><math>e</math></option>
    //   <option selectForVariantNames="avocado"><math>a</math></option>
    //   <option selectForVariantNames="broccoli"><math>b</math></option>
    // </select>
    // </p>
    // <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    // <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    // `,
    //     requestedVariant: { name: 'bRoccoli' },
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `3`)

    // cy.window().then(async (win) => {
    //   let expectedx = 'b';

    //   let stateVariables = await win.returnAllStateVariables1();
    //   let x = stateVariables['/x'].stateValues.value;
    //   expect(x).eq(expectedx);
    //   let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(xorig).eq(expectedx);
    //   let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
    //   expect(x2).eq(expectedx);
    //   let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(x3).eq(expectedx);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 2,
    //     name: 'broccoli',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [5],
    //       subvariants: [],
    //       meta: { createdBy: "/_select1" }
    //     }]
    //   })
    //   generatedVariantInfo = JSON.parse(JSON.stringify(stateVariables["/_document1"].stateValues.generatedVariantInfo))
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('broccoli');
    // })


    // cy.log("same result with previous generatedVariantInfo")
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>3a</text>
    // <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    // <p>Selected variable:
    // <select assignnames="(x)">
    //   <option selectForVariantNames="Dill"><math>d</math></option>
    //   <option selectForVariantNames="carrot"><math>c</math></option>
    //   <option selectForVariantNames="eggplant"><math>e</math></option>
    //   <option selectForVariantNames="avocado"><math>a</math></option>
    //   <option selectForVariantNames="broccoli"><math>b</math></option>
    // </select>
    // </p>
    // <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    // <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `3a`)

    // cy.window().then(async (win) => {
    //   let expectedx = 'b';

    //   let stateVariables = await win.returnAllStateVariables1();
    //   let x = stateVariables['/x'].stateValues.value;
    //   expect(x).eq(expectedx);
    //   let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(xorig).eq(expectedx);
    //   let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
    //   expect(x2).eq(expectedx);
    //   let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(x3).eq(expectedx);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 2,
    //     name: 'broccoli',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [5],
    //       subvariants: [],
    //       meta: { createdBy: "/_select1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('broccoli');
    // })

    // cy.log("specify variant dill")
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>4</text>
    // <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    // <p>Selected variable:
    // <select assignnames="(x)">
    //   <option selectForVariantNames="Dill"><math>d</math></option>
    //   <option selectForVariantNames="carrot"><math>c</math></option>
    //   <option selectForVariantNames="eggplant"><math>e</math></option>
    //   <option selectForVariantNames="avocado"><math>a</math></option>
    //   <option selectForVariantNames="broccoli"><math>b</math></option>
    // </select>
    // </p>
    // <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    // <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    // `,
    //     requestedVariant: { name: 'dill' },
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `4`)

    // cy.window().then(async (win) => {
    //   let expectedx = 'd';

    //   let stateVariables = await win.returnAllStateVariables1();
    //   let x = stateVariables['/x'].stateValues.value;
    //   expect(x).eq(expectedx);
    //   let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(xorig).eq(expectedx);
    //   let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
    //   expect(x2).eq(expectedx);
    //   let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(x3).eq(expectedx);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 4,
    //     name: 'dill',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [1],
    //       subvariants: [],
    //       meta: { createdBy: "/_select1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('4');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(4);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('dill');
    // })


    cy.log("specify large variant index")
    cy.window().then(async (win) => {
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
    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
        requestedVariantIndex: 20582310,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `5`)

    cy.window().then(async (win) => {
      let expectedx = 'e';

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/x'].stateValues.value;
      expect(x).eq(expectedx);
      let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(xorig).eq(expectedx);
      let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
      expect(x2).eq(expectedx);
      let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(x3).eq(expectedx);
      // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
      //   index: 5,
      //   name: 'eggplant',
      //   meta: {
      //     createdBy: "/_document1"
      //   },
      //   subvariants: [{
      //     indices: [3],
      //     subvariants: [],
      //     meta: { createdBy: "/_select1" }
      //   }]
      // })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('eggplant');
    })


    cy.log("specify negative variant index as string")
    cy.window().then(async (win) => {
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
    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
        requestedVariantIndex: '-20582308',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `6`)

    cy.window().then(async (win) => {
      let expectedx = 'b';

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/x'].stateValues.value;
      expect(x).eq(expectedx);
      let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(xorig).eq(expectedx);
      let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
      expect(x2).eq(expectedx);
      let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(x3).eq(expectedx);
      // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
      //   index: 2,
      //   name: 'broccoli',
      //   meta: {
      //     createdBy: "/_document1"
      //   },
      //   subvariants: [{
      //     indices: [5],
      //     subvariants: [],
      //     meta: { createdBy: "/_select1" }
      //   }]
      // })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('broccoli');
    })


    cy.log("invalid variant index gives index 1")
    cy.window().then(async (win) => {
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
    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
        requestedVariantIndex: 'wrong',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `7`)

    cy.window().then(async (win) => {
      let expectedx = 'a';

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/x'].stateValues.value;
      expect(x).eq(expectedx);
      let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(xorig).eq(expectedx);
      let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
      expect(x2).eq(expectedx);
      let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(x3).eq(expectedx);
      // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
      //   index: 1,
      //   name: 'avocado',
      //   meta: {
      //     createdBy: "/_document1"
      //   },
      //   subvariants: [{
      //     indices: [4],
      //     subvariants: [],
      //     meta: { createdBy: "/_select1" }
      //   }]
      // })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('avocado');
    })


    // cy.log("invalid variant name gives index 0")
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>8</text>
    // <variantControl nvariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
    // <p>Selected variable:
    // <select assignnames="(x)">
    //   <option selectForVariantNames="Dill"><math>d</math></option>
    //   <option selectForVariantNames="carrot"><math>c</math></option>
    //   <option selectForVariantNames="eggplant"><math>e</math></option>
    //   <option selectForVariantNames="avocado"><math>a</math></option>
    //   <option selectForVariantNames="broccoli"><math>b</math></option>
    // </select>
    // </p>
    // <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    // <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    // `,
    //     requestedVariant: { name: 'rotten' },
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `8`)

    // cy.window().then(async (win) => {
    //   let expectedx = 'a';

    //   let stateVariables = await win.returnAllStateVariables1();
    //   let x = stateVariables['/x'].stateValues.value;
    //   expect(x).eq(expectedx);
    //   let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(xorig).eq(expectedx);
    //   let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
    //   expect(x2).eq(expectedx);
    //   let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
    //   expect(x3).eq(expectedx);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 1,
    //     name: 'avocado',
    //     meta: {
    //       createdBy: "/_document1"
    //     },
    //     subvariants: [{
    //       indices: [4],
    //       subvariants: [],
    //       meta: { createdBy: "/_select1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('avocado');
    // })


    cy.log("round non-integer variant index")
    cy.window().then(async (win) => {
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
    <p>Selected variable repeated: <copy name="x2" target="x" /></p>
    <p>Selected variable repeated again: <copy name="x3" target="_select1" /></p>
    `,
        requestedVariantIndex: 4.5,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `9`)

    cy.window().then(async (win) => {
      let expectedx = 'e';

      let stateVariables = await win.returnAllStateVariables1();
      let x = stateVariables['/x'].stateValues.value;
      expect(x).eq(expectedx);
      let xorig = stateVariables[stateVariables[stateVariables['/_select1'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(xorig).eq(expectedx);
      let x2 = stateVariables[stateVariables['/x2'].replacements[0].componentName].stateValues.value;
      expect(x2).eq(expectedx);
      let x3 = stateVariables[stateVariables[stateVariables['/x3'].replacements[0].componentName].replacements[0].componentName].stateValues.value;
      expect(x3).eq(expectedx);
      // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
      //   index: 5,
      //   name: 'eggplant',
      //   meta: {
      //     createdBy: "/_document1"
      //   },
      //   subvariants: [{
      //     indices: [3],
      //     subvariants: [],
      //     meta: { createdBy: "/_select1" }
      //   }]
      // })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('eggplant');
    })

  });

  it('document with variant control specifying seeds, two different orders', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed50283;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed50283 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c", "d", "e"]);
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>b</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `b`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed50283);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("specify second variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 124082,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let nWithSeed25018;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed25018 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed25018).not.eq(nWithSeed50283);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>d</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 124082,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `d`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed25018);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("specify third variant")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '3',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithSeed52018;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed52018 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed52018).not.eq(nWithSeed50283);
      expect(nWithSeed52018).not.eq(nWithSeed25018);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed52018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('52018');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('c');
    })

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>f</text>
    // <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    // <p>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'c' },
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `f`)
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithSeed52018);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 3,
    //     name: 'c',
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [{
    //       indices: [nWithSeed52018],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('52018');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('c');
    // })

    cy.log("specify fourth variant as string")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '820572309',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)

    let nWithSeed2917392;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed2917392 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed2917392).not.eq(nWithSeed50283);
      expect(nWithSeed2917392).not.eq(nWithSeed25018);
      expect(nWithSeed2917392).not.eq(nWithSeed52018);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'd',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('d');
    })

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>h</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '820572309',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `h`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed2917392);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'd',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('d');
    })


    cy.log("specify fifth variant as negative")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>i</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '-820572305',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `i`)

    let nWithSeed603962;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed603962 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed603962).not.eq(nWithSeed50283);
      expect(nWithSeed603962).not.eq(nWithSeed25018);
      expect(nWithSeed603962).not.eq(nWithSeed52018);
      expect(nWithSeed603962).not.eq(nWithSeed2917392);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed603962],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('603962');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
    })

    let generatedVariantInfo;
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>j</text>
    <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>1
    `,
        requestedVariantIndex: '-820572305',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `j`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed603962);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed603962],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      generatedVariantInfo = JSON.parse(JSON.stringify(stateVariables["/_document1"].stateValues.generatedVariantInfo))
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('603962');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
    })


    // cy.log('same results with previous generatedVariantInfo')
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>ja</text>
    // <variantControl nvariants="5" seeds="50283  25018  52018  2917392  603962"/>
    // <p>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>1
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `ja`)
    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithSeed603962);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 5,
    //     name: 'e',
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [{
    //       indices: [nWithSeed603962],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('603962');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
    // })


    cy.log('reorder seeds');
    cy.log("specify first variant index")

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>k</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `k`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed2917392);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.reload(); // occasionally reload so doesn't slow way down (presumably due to garbage collection)

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>l</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `l`)
    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed2917392);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed2917392],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2917392');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })

    cy.log("specify second variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>m</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 124082,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `m`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed52018);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed52018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('52018');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })


    // cy.log("specify third variant by name")
    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>n</text>
    // <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    // <p>
    //   Selected number: 
    //   <selectfromsequence assignnames="n" length="10000000000" />
    // </p>
    // `,
    //     requestedVariant: { name: 'c' },
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `n`)

    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();
    //   expect(stateVariables['/n'].stateValues.value).eq(nWithSeed603962);
    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
    //     index: 3,
    //     name: 'c',
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [{
    //       indices: [nWithSeed603962],
    //       meta: { createdBy: "/_selectfromsequence1" }
    //     }]
    //   })
    //   expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('603962');
    //   expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
    //   expect(stateVariables["/_document1"].sharedParameters.variantName).eq('c');
    // })

    cy.log("specify fourth variant as string")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>o</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '820572309',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `o`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed50283);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'd',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('d');
    })

    cy.log("specify fifth variant as negative")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>p</text>
    <variantControl nvariants="5" seeds="2917392  52018  603962  50283  25018"/>
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '-820572305',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `p`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed25018);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 5,
        name: 'e',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
    })

  });

  it('document with variant control partially specifying seeds and variantNames', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="4" seeds="50283  25018  " variantNames="d h" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed50283;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed50283 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'd',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed50283],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('50283');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('d');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["d", "h", "c", "e"]);
    })

    cy.log("specify second variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="4" seeds="50283  25018  " variantNames="d h" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 124082,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let nWithSeed25018;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed25018 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed25018).not.eq(nWithSeed50283);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'h',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed25018],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('25018');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('h');
    })

    cy.log("specify third variant")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="4" seeds="50283  25018 " variantNames="d h" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '3',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithSeed3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed3 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed3).not.eq(nWithSeed50283);
      expect(nWithSeed3).not.eq(nWithSeed25018);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed3],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('c');
    })

    cy.log("specify fourth variant as string")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>g</text>
    <variantControl nvariants="4" seeds="50283  25018 " variantNames="d h" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '820572308',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `g`)

    let nWithSeed4;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed4 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed4).not.eq(nWithSeed50283);
      expect(nWithSeed4).not.eq(nWithSeed25018);
      expect(nWithSeed4).not.eq(nWithSeed3);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 4,
        name: 'e',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed4],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('4');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(4);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
    })

  });

  it('document with variant control specifying only number of variants', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="3" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed1 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c"]);
    })

    cy.log("specify second variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="3" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 5,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    let nWithSeed2;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed2 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed2).not.eq(nWithSeed1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 2,
        name: 'b',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed2],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('b');
    })

    cy.log("specify third variant")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>e</text>
    <variantControl nvariants="3" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: '3',
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `e`)

    let nWithSeed3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed3 = stateVariables['/n'].stateValues.value;
      expect(nWithSeed3).not.eq(nWithSeed1);
      expect(nWithSeed3).not.eq(nWithSeed2);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed3],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('c');
    })


  });

  it('document with variant control specifying zero variants', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="0" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed1 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a"]);
    })

    cy.log("specify second variant index gives first")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="0" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 2,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })


  });

  it('document with variant control specifying fractional number of variants', () => {

    cy.log("specify third variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="3.5" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 7,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed3;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed3 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 3,
        name: 'c',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed3],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('3');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('c');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a", "b", "c", "d"]);
    })


  });

  it('document with variant control specifying negative fractional number of variants', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="-3.5" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 19,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed1 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["a"]);
    })

    cy.log("specify second variant index gives first")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>c</text>
    <variantControl nvariants="-3.5" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 5,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `c`)

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables['/n'].stateValues.value).eq(nWithSeed1);
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
    })


  });

  it('document with variant control specifying too many variants', () => {

    cy.log("specify first variant index")
    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
    <text>a</text>
    <variantControl nvariants="10000" />
    <p>
      Selected number: 
      <selectfromsequence assignnames="n" length="10000000000" />
    </p>
    `,
        requestedVariantIndex: 1001,
      }, "*");
    })
    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `a`)

    let nWithSeed1;

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      nWithSeed1 = stateVariables['/n'].stateValues.value;
      expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls({
        index: 1,
        name: 'a',
        meta: {
          createdBy: "/_document1",
        },
        subvariants: [{
          indices: [nWithSeed1],
          meta: { createdBy: "/_selectfromsequence1" }
        }]
      })
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('1');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('a');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants.length).eq(1000);
    })

  });

  it('nested selects', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    let doenetML = `
    <variantControl nvariants="100"/>

    <select assignnames="(p)">
      <option><p newNamespace>Favorite color:
        <select assignNames="(item)">
          <option><text>red</text></option>
          <option><text>orange</text></option>
          <option><text>green</text></option>
          <option><text>white</text></option>
          <option><text>chartreuse</text></option>
        </select>
      </p></option>
      <option><p newNamespace>Selected number: 
        <select assignNames="(item)">
          <option><selectfromsequence from="1000" to="2000" /></option>
          <option><selectfromsequence from="-1000" to="-900" /></option>
        </select>
      </p></option>
      <option><p newNamespace>Chosen letter: <selectfromsequence type="letters" to="g" assignNames="item" /></p></option>
      <option><p newNamespace>Variable: <select type="text" assignNames="item">u v w x z y</select></p></option>
    </select>
    <p>Enter item $item as text: <answer><textinput/><award><text>$(p/item)</text></award></answer></p>
    `

    let firstStringsToInd = {
      "Favorite color:": 0,
      "Selected number:": 1,
      "Chosen letter:": 2,
      "Variable:": 3
    }

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 5; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let p = stateVariables['/p'];


        let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
        expect(variantInd).not.eq(undefined);

        let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;

        if (variantInd === 0) {
          let i = ["red", "orange", "green", "white", "chartreuse"].indexOf(secondValue)
          expect(i).not.eq(-1);
        } else if (variantInd === 1) {
          let num = secondValue;
          expect(Number.isInteger(num)).eq(true);
          if (num > 0) {
            expect(num).gte(1000);
            expect(num).lte(2000);
          } else {
            expect(num).gte(-1000);
            expect(num).lte(-900)
          }
        } else if (variantInd === 2) {
          let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(secondValue);
          expect(i).not.eq(-1);
        } else {
          let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondValue);
          expect(i).not.eq(-1);
        }

        cy.get('#\\/_textinput1_input').type(`${secondValue}{enter}`)
        cy.get('#\\/_textinput1_correct').should('be.visible');

        cy.wait(2000);  // wait for 2 second debounce
        cy.reload();


        // don't need to give requested variant here,
        // as will load variant from IndexedDB given the attempt number
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `<text>${ind}</text>${doenetML}`,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/_textinput1"];
        }))

        cy.get('#\\/_textinput1_correct').should('be.visible');
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          let p = stateVariables['/p'];


          let variantInd2 = firstStringsToInd[p.activeChildren[0].trim()];
          expect(variantInd2).eq(variantInd);

          let secondValue2 = stateVariables[p.activeChildren[1].componentName].stateValues.value;
          expect(secondValue2).eq(secondValue);

          cy.get('#\\/_textinput1_input').type(`{end}X`)
          cy.get('#\\/_textinput1_submit').click();
          cy.get('#\\/_textinput1_incorrect').should('be.visible');
          cy.get('#\\/_textinput1_input').type(`{end}{backspace}`)
          cy.get('#\\/_textinput1_submit').click();
          cy.get('#\\/_textinput1_correct').should('be.visible');


        })


      })

    }

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

    // let generatedVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 2 === 0) {
        cy.reload();
      }

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
          <option><problem newNamespace suppressAutoName suppressAutoNumber><title>A word problem</title>
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
          <option><problem newNamespace suppressAutoName suppressAutoNumber><title>A number problem</title>
            <variantControl nvariants="4" />
            <p>Number: <selectfromsequence to="10"/></p>
          </problem></option>
        </select>
        `,
            requestedVariantIndex: ind,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          // generatedVariantInfo = {
          //   index: ind,
          //   name: numberToLetters(ind, true),
          //   meta: {
          //     createdBy: "/_document1",
          //   },
          //   subvariants: [{
          //     indices: [],
          //     meta: { createdBy: "/_select1" },
          //     subvariants: []
          //   }]
          // }

          let variantInds = [];
          let secondValues = [];

          for (let i = 1; i <= 3; i++) {
            let problem = stateVariables['/problem' + i];
            let variantInd = titlesToInd[problem.stateValues.title];

            expect(variantInd).not.eq(undefined);

            variantInds.push(variantInd);
            // generatedVariantInfo.subvariants[0].indices.push(variantInd);

            let p = stateVariables[problem.activeChildren[4].componentName];

            if (variantInd === 1) {
              expect(p.activeChildren[0].trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;
              expect(problemVariantInd).not.eq(0)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              // let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;

              // generatedVariantInfo.subvariants[0].subvariants.push({
              //   index: problemVariantInd,
              //   name: numberToLetters(problemVariantInd, true),
              //   meta: {
              //     createdBy: `/problem${i}`,
              //   },
              //   subvariants: [{
              //     indices: [selectVariantInd],
              //     meta: {
              //       createdBy: `/problem${i}/_select1`,
              //     },
              //     subvariants: []
              //   }]
              // })
            } else {
              expect(p.activeChildren[0].trim()).eq("Number:");
              let num = stateVariables[p.activeChildren[1].componentName].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              // generatedVariantInfo.subvariants[0].subvariants.push({
              //   index: problemVariantInd,
              //   name: numberToLetters(problemVariantInd, true),
              //   meta: {
              //     createdBy: `/problem${i}`,
              //   },
              //   subvariants: [{
              //     indices: [num],
              //     meta: {
              //       createdBy: `/problem${i}/_selectfromsequence1`,
              //     },
              //   }]
              // })
            }

            let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
            if (secondValue === undefined) {
              secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
            }
            secondValues.push(secondValue);
          }

          // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
          //   generatedVariantInfo
          // )
          // expect(stateVariables["/_document1"].stateValues.itemVariantInfo).eqls(
          //   generatedVariantInfo.subvariants[0].subvariants
          // );


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

    // cy.log(`repeat last with previous generatedVariantInfo`)

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>repeat</text>
    // <variantControl nvariants="100"/>

    // <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
    //   <option><problem newNamespace><title>A word problem</title>
    //     <variantControl nvariants="5" variantNames="a b c d e" />
    //     <p>Word:
    //       <select>
    //         <option selectForVariantNames="b"><text>bad</text></option>
    //         <option selectForVariantNames="a"><text>angry</text></option>
    //         <option selectForVariantNames="d"><text>drab</text></option>
    //         <option selectForVariantNames="e"><text>excoriated</text></option>
    //         <option selectForVariantNames="c"><text>churlish</text></option>
    //       </select>
    //     </p>
    //   </problem></option>
    //   <option><problem newNamespace><title>A number problem</title>
    //     <variantControl nvariants="6" />
    //     <p>Number: <selectfromsequence to="10"/></p>
    //   </problem></option>
    // </select>
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `repeat`)

    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();

    //   generatedVariantInfo = {
    //     index: 10,
    //     name: numberToLetters(10, true),
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [{
    //       indices: [],
    //       meta: { createdBy: "/_select1" },
    //       subvariants: []
    //     }]
    //   }

    //   let variantInds = [];
    //   let secondValues = [];

    //   for (let i = 1; i <= 3; i++) {
    //     let problem = stateVariables['/problem' + i];
    //     let variantInd = titlesToInd[problem.stateValues.title];

    //     expect(variantInd).not.eq(undefined);

    //     variantInds.push(variantInd);
    //     generatedVariantInfo.subvariants[0].indices.push(variantInd);

    //     let p = problem.activeChildren[4];

    //     if (variantInd === 1) {
    //       expect(p.activeChildren[0].trim()).eq("Word:")
    //       let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;
    //       expect(problemVariantInd).not.eq(0)
    //       if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
    //         variantOfProblemsFound[0].push(problemVariantInd);
    //       }
    //       expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

    //       let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;

    //       generatedVariantInfo.subvariants[0].subvariants.push({
    //         index: problemVariantInd,
    //         name: numberToLetters(problemVariantInd, true),
    //         meta: {
    //           createdBy: `/problem${i}`,
    //         },
    //         subvariants: [{
    //           indices: [selectVariantInd],
    //           meta: {
    //             createdBy: `/problem${i}/_select1`,
    //           },
    //           subvariants: []
    //         }]
    //       })
    //     } else {
    //       expect(p.activeChildren[0].trim()).eq("Number:");
    //       let num = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //       expect(Number.isInteger(num)).eq(true);
    //       expect(num >= 1 && num <= 10).eq(true);

    //       let problemVariantInd = problem.stateValues.generatedVariantInfo.index
    //       if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
    //         variantOfProblemsFound[1].push(problemVariantInd);
    //       }
    //       generatedVariantInfo.subvariants[0].subvariants.push({
    //         index: problemVariantInd,
    //         name: numberToLetters(problemVariantInd, true),
    //         meta: {
    //           createdBy: `/problem${i}`,
    //         },
    //         subvariants: [{
    //           indices: [num],
    //           meta: {
    //             createdBy: `/problem${i}/_selectfromsequence1`,
    //           },
    //         }]
    //       })
    //     }

    //     let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //     if (secondValue === undefined) {
    //       secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //     }
    //     secondValues.push(secondValue);
    //   }

    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
    //     generatedVariantInfo
    //   )
    //   expect(stateVariables["/_document1"].stateValues.itemVariantInfo).eqls(
    //     generatedVariantInfo.subvariants[0].subvariants
    //   );

    //   expect(variantInds).eqls(originalVariantInds);
    //   expect(secondValues).eqls(originalSecondValues);


    // })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3, 4, 5]);
      expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4]);
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

    // let generatedVariantInfo;
    // let itemVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 5 === 0) {
        cy.reload();
      }

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <problem newNamespace name="problem1" suppressAutoName suppressAutoNumber><title>A number problem</title>
          <variantControl nvariants="4" />
          <p>Number: <selectfromsequence to="10"/></p>
        </problem>
        <select assignnames="(problem2)  (problem3)" numbertoselect="2" withReplacement>
          <option><problem newNamespace suppressAutoName suppressAutoNumber><title>A word problem</title>
            <variantControl nvariants="3" variantNames="a b c" />
            <p>Word:
              <select>
                <option selectForVariantNames="b"><text>bad</text></option>
                <option selectForVariantNames="a"><text>angry</text></option>
                <option selectForVariantNames="c"><text>churlish</text></option>
              </select>
            </p>
          </problem></option>
          <option><problem newNamespace suppressAutoName suppressAutoNumber><title>A number problem</title>
            <variantControl nvariants="4" />
            <p>Number: <selectfromsequence to="10"/></p>
          </problem></option>
        </select>
        `,
            requestedVariantIndex: ind,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          // generatedVariantInfo = {
          //   index: ind,
          //   name: numberToLetters(ind, true),
          //   meta: {
          //     createdBy: "/_document1",
          //   },
          //   subvariants: [undefined, {
          //     indices: [],
          //     meta: { createdBy: "/_select1" },
          //     subvariants: []
          //   }]
          // }

          // itemVariantInfo = [];

          let variantInds = [];
          let secondValues = [];

          for (let i = 1; i <= 3; i++) {
            let problem = stateVariables['/problem' + i];
            let variantInd = titlesToInd[problem.stateValues.title];

            expect(variantInd).not.eq(undefined);

            variantInds.push(variantInd);
            // if (i !== 1) {
            //   generatedVariantInfo.subvariants[1].indices.push(variantInd);
            // }
            let p = stateVariables[problem.activeChildren[4].componentName];

            if (variantInd === 1) {
              expect(p.activeChildren[0].trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;
              expect(problemVariantInd).not.eq(0)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              // let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;

              // let problemVariantInfo = {
              //   index: problemVariantInd,
              //   name: numberToLetters(problemVariantInd, true),
              //   meta: {
              //     createdBy: `/problem${i}`,
              //   },
              //   subvariants: [{
              //     indices: [selectVariantInd],
              //     meta: {
              //       createdBy: `/problem${i}/_select1`,
              //     },
              //     subvariants: []
              //   }]

              // }

              // itemVariantInfo.push(problemVariantInfo);
              // generatedVariantInfo.subvariants[1].subvariants.push(
              //   problemVariantInfo
              // );

            } else {
              expect(p.activeChildren[0].trim()).eq("Number:");
              let num = stateVariables[p.activeChildren[1].componentName].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              // let problemVariantInfo = {
              //   index: problemVariantInd,
              //   name: numberToLetters(problemVariantInd, true),
              //   meta: {
              //     createdBy: `/problem${i}`,
              //   },
              //   subvariants: [{
              //     indices: [num],
              //     meta: {
              //       createdBy: `/problem${i}/_selectfromsequence1`,
              //     },
              //   }]
              // }
              // itemVariantInfo.push(problemVariantInfo);
              // if (i === 1) {
              //   generatedVariantInfo.subvariants[0] = problemVariantInfo
              // } else {
              //   generatedVariantInfo.subvariants[1].subvariants.push(
              //     problemVariantInfo
              //   );
              // }
            }

            let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
            secondValues.push(secondValue);
          }

          // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
          //   generatedVariantInfo
          // )
          // expect(stateVariables["/_document1"].stateValues.itemVariantInfo).eqls(
          //   itemVariantInfo
          // );


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

    // cy.log(`repeat last with previous generatedVariantInfo`)

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>repeat</text>
    // <variantControl nvariants="100"/>

    // <problem newNamespace name="problem1"><title>A number problem</title>
    //   <variantControl nvariants="6" />
    //   <p>Number: <selectfromsequence to="10"/></p>
    // </problem>
    // <select assignnames="(problem2)  (problem3)" numbertoselect="2" withReplacement>
    //   <option><problem newNamespace><title>A word problem</title>
    //     <variantControl nvariants="5" variantNames="a b c d e" />
    //     <p>Word:
    //       <select>
    //         <option selectForVariantNames="b"><text>bad</text></option>
    //         <option selectForVariantNames="a"><text>angry</text></option>
    //         <option selectForVariantNames="d"><text>drab</text></option>
    //         <option selectForVariantNames="e"><text>excoriated</text></option>
    //         <option selectForVariantNames="c"><text>churlish</text></option>
    //       </select>
    //     </p>
    //   </problem></option>
    //   <option><problem newNamespace><title>A number problem</title>
    //     <variantControl nvariants="6" />
    //     <p>Number: <selectfromsequence to="10"/></p>
    //   </problem></option>
    // </select>
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `repeat`)

    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();

    //   generatedVariantInfo = {
    //     index: 10,
    //     name: numberToLetters(10, true),
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [undefined, {
    //       indices: [],
    //       meta: { createdBy: "/_select1" },
    //       subvariants: []
    //     }]
    //   }

    //   itemVariantInfo = [];

    //   let variantInds = [];
    //   let secondValues = [];

    //   for (let i = 1; i <= 3; i++) {
    //     let problem = stateVariables['/problem' + i];
    //     let variantInd = titlesToInd[problem.stateValues.title];

    //     expect(variantInd).not.eq(undefined);

    //     variantInds.push(variantInd);
    //     if (i !== 1) {
    //       generatedVariantInfo.subvariants[1].indices.push(variantInd);
    //     }
    //     let p = problem.activeChildren[4];

    //     if (variantInd === 1) {
    //       expect(p.activeChildren[0].trim()).eq("Word:")
    //       let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;
    //       expect(problemVariantInd).not.eq(0)
    //       if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
    //         variantOfProblemsFound[0].push(problemVariantInd);
    //       }
    //       expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

    //       let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;

    //       let problemVariantInfo = {
    //         index: problemVariantInd,
    //         name: numberToLetters(problemVariantInd, true),
    //         meta: {
    //           createdBy: `/problem${i}`,
    //         },
    //         subvariants: [{
    //           indices: [selectVariantInd],
    //           meta: {
    //             createdBy: `/problem${i}/_select1`,
    //           },
    //           subvariants: []
    //         }]

    //       }

    //       itemVariantInfo.push(problemVariantInfo);
    //       generatedVariantInfo.subvariants[1].subvariants.push(
    //         problemVariantInfo
    //       );
    //     } else {
    //       expect(p.activeChildren[0].trim()).eq("Number:");
    //       let num = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //       expect(Number.isInteger(num)).eq(true);
    //       expect(num >= 1 && num <= 10).eq(true);

    //       let problemVariantInd = problem.stateValues.generatedVariantInfo.index
    //       if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
    //         variantOfProblemsFound[1].push(problemVariantInd);
    //       }
    //       let problemVariantInfo = {
    //         index: problemVariantInd,
    //         name: numberToLetters(problemVariantInd, true),
    //         meta: {
    //           createdBy: `/problem${i}`,
    //         },
    //         subvariants: [{
    //           indices: [num],
    //           meta: {
    //             createdBy: `/problem${i}/_selectfromsequence1`,
    //           },
    //         }]
    //       }
    //       itemVariantInfo.push(problemVariantInfo);
    //       if (i === 1) {
    //         generatedVariantInfo.subvariants[0] = problemVariantInfo
    //       } else {
    //         generatedVariantInfo.subvariants[1].subvariants.push(
    //           problemVariantInfo
    //         );
    //       }
    //     }

    //     let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //     if (secondValue === undefined) {
    //       secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //     }
    //     secondValues.push(secondValue);
    //   }

    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
    //     generatedVariantInfo
    //   )
    //   expect(stateVariables["/_document1"].stateValues.itemVariantInfo).eqls(
    //     itemVariantInfo
    //   );

    //   expect(variantInds).eqls(originalVariantInds);
    //   expect(secondValues).eqls(originalSecondValues);


    // })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3]);
      expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4]);
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

    // let generatedVariantInfo;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 5 === 0) {
        cy.reload();
      }

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
    
        <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
          <option><problem newNamespace suppressAutoName suppressAutoNumber><title>A word problem</title>
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
          <option><problem newNamespace suppressAutoName suppressAutoNumber><title>A number problem</title>
            <text>Filler to move children to same spot</text>
            <p>Number: <selectfromsequence to="10"/></p>
          </problem></option>
        </select>
        `,
            requestedVariantIndex: ind,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          // generatedVariantInfo = {
          //   index: ind,
          //   name: numberToLetters(ind, true),
          //   meta: {
          //     createdBy: "/_document1",
          //   },
          //   subvariants: [{
          //     indices: [],
          //     meta: { createdBy: "/_select1" },
          //     subvariants: []
          //   }]
          // }

          let variantInds = [];
          let secondValues = [];

          for (let i = 1; i <= 3; i++) {
            let problem = stateVariables['/problem' + i];
            let variantInd = titlesToInd[problem.stateValues.title];

            expect(variantInd).not.eq(undefined);

            variantInds.push(variantInd);
            // generatedVariantInfo.subvariants[0].indices.push(variantInd);

            let p = stateVariables[problem.activeChildren[4].componentName];

            if (variantInd === 1) {
              expect(p.activeChildren[0].trim()).eq("Word:")
              let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;
              expect(problemVariantInd).not.eq(0)
              if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
                variantOfProblemsFound[0].push(problemVariantInd);
              }
              expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

              // let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;

              // generatedVariantInfo.subvariants[0].subvariants.push({
              //   index: problemVariantInd,
              //   name: numberToLetters(problemVariantInd, true),
              //   meta: {
              //     createdBy: `/problem${i}`,
              //   },
              //   subvariants: [{
              //     indices: [selectVariantInd],
              //     meta: {
              //       createdBy: `/problem${i}/_select1`,
              //     },
              //     subvariants: []
              //   }]
              // })
            } else {
              expect(p.activeChildren[0].trim()).eq("Number:");
              let num = stateVariables[p.activeChildren[1].componentName].stateValues.value;
              expect(Number.isInteger(num)).eq(true);
              expect(num >= 1 && num <= 10).eq(true);

              let problemVariantInd = problem.stateValues.generatedVariantInfo.index
              if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
                variantOfProblemsFound[1].push(problemVariantInd);
              }
              // generatedVariantInfo.subvariants[0].subvariants.push({
              //   index: problemVariantInd,
              //   name: numberToLetters(problemVariantInd, true),
              //   meta: {
              //     createdBy: `/problem${i}`,
              //   },
              //   subvariants: [{
              //     indices: [num],
              //     meta: {
              //       createdBy: `/problem${i}/_selectfromsequence1`,
              //     },
              //   }]
              // })
            }

            let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
            if (secondValue === undefined) {
              secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
            }
            secondValues.push(secondValue);
          }

          // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
          //   generatedVariantInfo
          // )
          // expect(stateVariables["/_document1"].stateValues.itemVariantInfo).eqls(
          //   generatedVariantInfo.subvariants[0].subvariants
          // );


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

    // cy.log(`repeat last with previous generatedVariantInfo`)

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>repeat</text>
    // <variantControl nvariants="100"/>

    // <select assignnames="(problem1)  (problem2)  (problem3)" numbertoselect="3" withReplacement>
    //   <option><problem newNamespace><title>A word problem</title>
    //     <variantControl nvariants="5" variantNames="a b c d e" />
    //     <p>Word:
    //       <select>
    //         <option selectForVariantNames="b"><text>bad</text></option>
    //         <option selectForVariantNames="a"><text>angry</text></option>
    //         <option selectForVariantNames="d"><text>drab</text></option>
    //         <option selectForVariantNames="e"><text>excoriated</text></option>
    //         <option selectForVariantNames="c"><text>churlish</text></option>
    //       </select>
    //     </p>
    //   </problem></option>
    //   <option><problem newNamespace><title>A number problem</title>
    //     <text>Filler to move children to same spot</text>
    //     <p>Number: <selectfromsequence to="10"/></p>
    //   </problem></option>
    // </select>
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `repeat`)

    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();

    //   generatedVariantInfo = {
    //     index: 10,
    //     name: numberToLetters(10, true),
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [{
    //       indices: [],
    //       meta: { createdBy: "/_select1" },
    //       subvariants: []
    //     }]
    //   }

    //   let variantInds = [];
    //   let secondValues = [];

    //   for (let i = 1; i <= 3; i++) {
    //     let problem = stateVariables['/problem' + i];
    //     let variantInd = titlesToInd[problem.stateValues.title];

    //     expect(variantInd).not.eq(undefined);

    //     variantInds.push(variantInd);
    //     generatedVariantInfo.subvariants[0].indices.push(variantInd);

    //     let p = problem.activeChildren[4];

    //     if (variantInd === 1) {
    //       expect(p.activeChildren[0].trim()).eq("Word:")
    //       let problemVariantInd = ["angry", "bad", "churlish", "drab", "excoriated"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;
    //       expect(problemVariantInd).not.eq(0)
    //       if (!variantOfProblemsFound[0].includes(problemVariantInd)) {
    //         variantOfProblemsFound[0].push(problemVariantInd);
    //       }
    //       expect(problemVariantInd).eq(problem.stateValues.generatedVariantInfo.index)

    //       let selectVariantInd = ["bad", "angry", "drab", "excoriated", "churlish"].indexOf(stateVariables[p.activeChildren[1].componentName].stateValues.value) + 1;

    //       generatedVariantInfo.subvariants[0].subvariants.push({
    //         index: problemVariantInd,
    //         name: numberToLetters(problemVariantInd, true),
    //         meta: {
    //           createdBy: `/problem${i}`,
    //         },
    //         subvariants: [{
    //           indices: [selectVariantInd],
    //           meta: {
    //             createdBy: `/problem${i}/_select1`,
    //           },
    //           subvariants: []
    //         }]
    //       })
    //     } else {
    //       expect(p.activeChildren[0].trim()).eq("Number:");
    //       let num = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //       expect(Number.isInteger(num)).eq(true);
    //       expect(num >= 1 && num <= 10).eq(true);

    //       let problemVariantInd = problem.stateValues.generatedVariantInfo.index
    //       if (!variantOfProblemsFound[1].includes(problemVariantInd)) {
    //         variantOfProblemsFound[1].push(problemVariantInd);
    //       }
    //       generatedVariantInfo.subvariants[0].subvariants.push({
    //         index: problemVariantInd,
    //         name: numberToLetters(problemVariantInd, true),
    //         meta: {
    //           createdBy: `/problem${i}`,
    //         },
    //         subvariants: [{
    //           indices: [num],
    //           meta: {
    //             createdBy: `/problem${i}/_selectfromsequence1`,
    //           },
    //         }]
    //       })
    //     }

    //     let secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //     if (secondValue === undefined) {
    //       secondValue = stateVariables[p.activeChildren[1].componentName].stateValues.value;
    //     }
    //     secondValues.push(secondValue);
    //   }

    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
    //     generatedVariantInfo
    //   )
    //   expect(stateVariables["/_document1"].stateValues.itemVariantInfo).eqls(
    //     generatedVariantInfo.subvariants[0].subvariants
    //   );

    //   expect(variantInds).eqls(originalVariantInds);
    //   expect(secondValues).eqls(originalSecondValues);


    // })


    cy.log('make sure all problem variants were selected at least once').then(() => {
      expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3, 4, 5]);
      // not for second problem since have 100 possible variants by default
      // expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4, 5, 6]);
    })

  });

  it('select and sample random numbers', () => {

    // let generatedVariantInfo;
    let originalNumbers;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 10; ind++) {

      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 5 === 0) {
        cy.reload();
      }

      // show values don't change for same variant
      for (let ind2 = 0; ind2 < 2; ind2++) {
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `
        <text>${ind}</text>
        <text>${ind2}</text>
        <variantControl nvariants="100"/>
        <p><selectRandomNumbers name="s1" assignNames="m" /></p>
        <p><sampleRandomNumbers name="s2" assignNames="n" variantDeterminesSeed /></p>
        <p><selectRandomNumbers name="s3" type="gaussian" numberToSelect="3" assignNames="x1 x2 x3" /></p>
        <p><sampleRandomNumbers name="s4" type="gaussian" numberOfSamples="3" assignNames="y1 y2 y3" variantDeterminesSeed /></p>
        `,
            requestedVariantIndex: ind,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)
        cy.get('#\\/_text2').should('have.text', `${ind2}`)

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let valuesS1 = stateVariables["/s1"].stateValues.selectedValues;
          let valuesS3 = stateVariables["/s3"].stateValues.selectedValues;

          let valuesS2 = stateVariables["/s2"].stateValues.sampledValues;
          let valuesS4 = stateVariables["/s4"].stateValues.sampledValues;

          // generatedVariantInfo = {
          //   index: ind,
          //   name: numberToLetters(ind, true),
          //   meta: {
          //     createdBy: "/_document1",
          //   },
          //   subvariants: [{
          //     values: [...valuesS1],
          //     meta: { createdBy: "/s1" }
          //   }, {
          //     values: [...valuesS3],
          //     meta: { createdBy: "/s3" }
          //   }]
          // }

          // expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
          //   generatedVariantInfo
          // )

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

    // cy.log(`repeat last one with previous generatedVariantInfo`)

    // cy.window().then(async (win) => {
    //   win.postMessage({
    //     doenetML: `
    // <text>repeat</text>
    // <variantControl nvariants="100"/>
    // <p><selectRandomNumbers name="s1" assignNames="m" /></p>
    // <p><sampleRandomNumbers name="s2" assignNames="n" /></p>
    // <p><selectRandomNumbers name="s3" type="gaussian" numberToSelect="3" assignNames="x1 x2 x3" /></p>
    // <p><sampleRandomNumbers name="s4" type="gaussian" numberOfSamples="3" assignNames="y1 y2 y3" /></p>
    // `,
    //     requestedVariant: generatedVariantInfo,
    //   }, "*");
    // })
    // // to wait for page to load
    // cy.get('#\\/_text1').should('have.text', `repeat`)


    // cy.window().then(async (win) => {
    //   let stateVariables = await win.returnAllStateVariables1();

    //   let valuesS1 = stateVariables["/s1"].stateValues.selectedValues;
    //   let valuesS3 = stateVariables["/s3"].stateValues.selectedValues;

    //   let valuesS2 = stateVariables["/s2"].stateValues.sampledValues;
    //   let valuesS4 = stateVariables["/s4"].stateValues.sampledValues;

    //   generatedVariantInfo = {
    //     index: 10,
    //     name: numberToLetters(10, true),
    //     meta: {
    //       createdBy: "/_document1",
    //     },
    //     subvariants: [{
    //       values: [...valuesS1],
    //       meta: { createdBy: "/s1" }
    //     }, {
    //       values: [...valuesS3],
    //       meta: { createdBy: "/s3" }
    //     }]
    //   }

    //   expect(stateVariables["/_document1"].stateValues.generatedVariantInfo).eqls(
    //     generatedVariantInfo
    //   )

    //   let allNumbers = [...valuesS1, ...valuesS2, ...valuesS3, ...valuesS4]

    //   expect(allNumbers).eqls(originalNumbers);

    // })


  });

  it('choiceinputs', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    let doenetML = `
    <variantControl nvariants="100"/>
    <p><choiceinput shuffleOrder name="c1">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceinput></p>
    <p><choiceinput shuffleOrder inline name="c2">
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
    <p><copy prop="selectedValue" target="c1" assignNames="c1v" /></p>
    `;

    // let generatedVariantInfo;
    let originalChoiceOrders;
    let originalChoiceTexts;

    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 4; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let orderC1 = stateVariables["/c1"].stateValues.choiceOrder;
        let orderC2 = stateVariables["/c2"].stateValues.choiceOrder;

        let orderC3 = stateVariables["/c3"].stateValues.choiceOrder;
        let orderC4 = stateVariables["/c4"].stateValues.choiceOrder;

        let textC1 = stateVariables["/c1"].stateValues.choiceTexts;
        let textC2 = stateVariables["/c2"].stateValues.choiceTexts;

        let textC3 = stateVariables["/c3"].stateValues.choiceTexts;
        let textC4 = stateVariables["/c4"].stateValues.choiceTexts;


        let allOrders = [...orderC1, ...orderC2, ...orderC3, ...orderC4]
        let allTexts = [...textC1, ...textC2, ...textC3, ...textC4]
        expect(allOrders).not.eqls(originalChoiceOrders);
        originalChoiceOrders = allOrders;
        expect(allTexts).not.eqls(originalChoiceTexts);
        originalChoiceTexts = allTexts;

        // click a choice input so that data is saved to IndexedDB
        cy.get(cesc(`#/c1_choice1_input`)).click();
        cy.get(cesc(`#/c1v`)).should('have.text', textC1[0])
        cy.get(cesc(`#/c1_choice1_input`)).should('be.checked')

        cy.wait(2000);  // wait for 2 second debounce
        cy.reload();


        // don't need to give requested variant here,
        // as will load variant from IndexedDB given the attempt number
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML: `<text>${ind}</text>${doenetML}`,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/c1"];
        }))



        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();

          let orderC1 = stateVariables["/c1"].stateValues.choiceOrder;
          let orderC2 = stateVariables["/c2"].stateValues.choiceOrder;

          let orderC3 = stateVariables["/c3"].stateValues.choiceOrder;
          let orderC4 = stateVariables["/c4"].stateValues.choiceOrder;

          let textC1 = stateVariables["/c1"].stateValues.choiceTexts;
          let textC2 = stateVariables["/c2"].stateValues.choiceTexts;

          let textC3 = stateVariables["/c3"].stateValues.choiceTexts;
          let textC4 = stateVariables["/c4"].stateValues.choiceTexts;


          let allOrders = [...orderC1, ...orderC2, ...orderC3, ...orderC4]
          let allTexts = [...textC1, ...textC2, ...textC3, ...textC4]
          expect(allOrders).eqls(originalChoiceOrders);
          expect(allTexts).eqls(originalChoiceTexts);

          // click a choice input so that data is saved to IndexedDB
          cy.get(cesc(`#/c1_choice1_input`)).should('be.checked')
          cy.get(cesc(`#/c1_choice2_input`)).click();
          cy.get(cesc(`#/c1v`)).should('have.text', textC1[1])
          cy.get(cesc(`#/c1_choice1_input`)).should('not.be.checked')
          cy.get(cesc(`#/c1_choice2_input`)).should('be.checked')



        })
      })

    }

  });

  it('excluded sequence items, reload', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 4; ind++) {

      let doenetML = `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
      <selectFromSequence from="1" to="2000000000" exclude="2000000000 3000000000 4000000000 5000000000 6000000000 8000000000 9000000000 1100000000 1200000000 1300000000 1400000000 1500000000 1600000000 1700000000 1900000000" assignNames="m" />
      <selectFromSequence from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" assignNames="n" />
      <p>Enter $m: <answer><mathinput/><award>$m</award></answer></p>
      <p>Enter $n: <answer><mathinput/><award>$n</award></answer></p>

      `
      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML,
          requestedVariantIndex: ind,
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      let indexChosen1, indexChosen2;
      let m, n;

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        indexChosen1 = stateVariables["/_selectfromsequence1"].stateValues.selectedIndices[0];
        indexChosen2 = stateVariables["/_selectfromsequence1"].stateValues.selectedIndices[0];
        m = stateVariables["/m"].stateValues.value;
        n = stateVariables["/n"].stateValues.value;

        cy.get('#\\/_mathinput1 textarea').type(`${m}{enter}`, { force: true });
        cy.get('#\\/_mathinput2 textarea').type(`${n}{enter}`, { force: true });
        cy.get('#\\/_mathinput1_correct').should('be.visible')
        cy.get('#\\/_mathinput2_correct').should('be.visible')

        cy.wait(2000);  // wait for 2 second debounce
        cy.reload();


        // don't need to give requested variant here,
        // as will load variant from IndexedDB given the attempt number
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/m"];
        }))

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_selectfromsequence1"].stateValues.selectedIndices[0]).eq(indexChosen1);
          expect(stateVariables["/_selectfromsequence1"].stateValues.selectedIndices[0]).eq(indexChosen2);
          expect(stateVariables["/m"].stateValues.value).eq(m);
          expect(stateVariables["/n"].stateValues.value).eq(n);

        })


        cy.get('#\\/_mathinput1_correct').should('be.visible')
        cy.get('#\\/_mathinput2_correct').should('be.visible')

        cy.get('#\\/_mathinput1 textarea').type(`{end}X`, { force: true });
        cy.get('#\\/_mathinput2 textarea').type(`{end}X`, { force: true });
        cy.get('#\\/_mathinput1_submit').click();
        cy.get('#\\/_mathinput2_submit').click();
        cy.get('#\\/_mathinput1_incorrect').should('be.visible')
        cy.get('#\\/_mathinput2_incorrect').should('be.visible')

        cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}`, { force: true });
        cy.get('#\\/_mathinput2 textarea').type(`{end}{backspace}`, { force: true });
        cy.get('#\\/_mathinput1_submit').click();
        cy.get('#\\/_mathinput2_submit').click();
        cy.get('#\\/_mathinput1_correct').should('be.visible')
        cy.get('#\\/_mathinput2_correct').should('be.visible')


      })


    }


  });

  it('excluded combinations of sequence items, reload', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.log("Test a bunch of variants")
    for (let ind = 1; ind <= 4; ind++) {

      let doenetML = `
      <text>${ind}</text>
      <variantControl nvariants="100"/>
      <selectFromSequence from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" excludeCombinations="(1 7) (1 10) (1 18) (7 10) (7 18) (7 20) (10 1) (10 7) (10 20) (18 1) (18 7) (18 20) (20 1) (20 10)" assignNames="m n" numberToSelect="2" />
      <selectFromSequence type="math" from="x" step="h" length="7" exclude="x+h x+2h x+3h x+5h" excludeCombinations="(x x+4h) (x+4h x+6h) (x+6h x)" assignNames="x1 x2" numberToSelect="2" />
      <selectFromSequence type="letters" from="a" to="i" exclude="b c d e f h" excludeCombinations="(a i) (g a) (i g)" assignNames="l1 l2" numberToSelect="2" />
      <p>Enter $m: <answer><mathinput/><award><math>$m</math></award></answer></p>
      <p>Enter $x2: <answer><mathinput/><award><math>$x2</math></award></answer></p>
      <p>Enter $l1: <answer><textinput/><award><text>$l1</text></award></answer></p>
      `;

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML,
          requestedVariantIndex: ind,
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      let indicesChosen1, indicesChosen2, indicesChosen3;
      let m, n, x1, x2, l1, l2;

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        indicesChosen1 = [...stateVariables["/_selectfromsequence1"].stateValues.selectedIndices];
        m = stateVariables["/m"].stateValues.value;
        n = stateVariables["/n"].stateValues.value;

        indicesChosen2 = [...stateVariables["/_selectfromsequence2"].stateValues.selectedIndices];
        x1 = stateVariables["/x1"].stateValues.value;
        x2 = stateVariables["/x2"].stateValues.value;

        indicesChosen3 = [...stateVariables["/_selectfromsequence3"].stateValues.selectedIndices];
        l1 = stateVariables["/l1"].stateValues.value;
        l2 = stateVariables["/l2"].stateValues.value;



        cy.get('#\\/_mathinput1 textarea').type(`${m}{enter}`, { force: true });
        cy.get('#\\/_mathinput2 textarea').type(`${me.fromAst(x2).toString()}{enter}`, { force: true });
        cy.get('#\\/_textinput1_input').type(`${l1}{enter}`);
        cy.get('#\\/_mathinput1_correct').should('be.visible')
        cy.get('#\\/_mathinput2_correct').should('be.visible')
        cy.get('#\\/_textinput1_correct').should('be.visible')

        cy.wait(2000);  // wait for 2 second debounce
        cy.reload();


        // don't need to give requested variant here,
        // as will load variant from IndexedDB given the attempt number
        cy.window().then(async (win) => {
          win.postMessage({
            doenetML,
          }, "*");
        })
        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/m"];
        }))


        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_selectfromsequence1"].stateValues.selectedIndices).eqls(indicesChosen1);
          expect(stateVariables["/m"].stateValues.value).eq(m);
          expect(stateVariables["/n"].stateValues.value).eq(n);
          expect(stateVariables["/_selectfromsequence2"].stateValues.selectedIndices).eqls(indicesChosen2);
          expect(me.fromAst(stateVariables["/x1"].stateValues.value).equals(me.fromAst(x1))).be.true;
          expect(me.fromAst(stateVariables["/x2"].stateValues.value).equals(me.fromAst(x2))).be.true;
          expect(stateVariables["/_selectfromsequence1"].stateValues.selectedIndices).eqls(indicesChosen1);
          expect(stateVariables["/l1"].stateValues.value).eq(l1);
          expect(stateVariables["/l2"].stateValues.value).eq(l2);

        })

        cy.get('#\\/_mathinput1_correct').should('be.visible')
        cy.get('#\\/_mathinput2_correct').should('be.visible')
        cy.get('#\\/_textinput1_correct').should('be.visible')

        cy.get('#\\/_mathinput1 textarea').type(`{end}X`, { force: true });
        cy.get('#\\/_mathinput2 textarea').type(`{end}X`, { force: true });
        cy.get('#\\/_textinput1_input').type(`{end}X`);
        cy.get('#\\/_mathinput1_submit').click();
        cy.get('#\\/_mathinput2_submit').click();
        cy.get('#\\/_textinput1_submit').click();
        cy.get('#\\/_mathinput1_incorrect').should('be.visible')
        cy.get('#\\/_mathinput2_incorrect').should('be.visible')
        cy.get('#\\/_textinput1_incorrect').should('be.visible')

        cy.get('#\\/_mathinput1 textarea').type(`{end}{backspace}`, { force: true });
        cy.get('#\\/_mathinput2 textarea').type(`{end}{backspace}`, { force: true });
        cy.get('#\\/_textinput1_input').type(`{end}{backspace}`);
        cy.get('#\\/_mathinput1_submit').click();
        cy.get('#\\/_mathinput2_submit').click();
        cy.get('#\\/_textinput1_submit').click();
        cy.get('#\\/_mathinput1_correct').should('be.visible')
        cy.get('#\\/_mathinput2_correct').should('be.visible')
        cy.get('#\\/_textinput1_correct').should('be.visible')
      })

    }


  });

  it('replacements of composites are not included in generated variant info', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();

    let doenetML = `
    <group name="g" newNamespace>
      <choiceinput shuffleOrder name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
      </choiceinput>
      <p>Selected value: $ci</p>
      <p>Enter <selectFromSequence assignNames="n" />. <answer name="ans">$n</answer></p>
    </group>

    <copy target="g" assignNames="g2" />

    <copy target="g" assignNames="g3" link="false" />

    <p>Enter <selectFromSequence assignNames="m" />. <answer name="ans">$m</answer></p>
    `

    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: `
      <text>1</text>${doenetML}`,
        requestedVariantIndex: 1,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)

    let choices = ["a", "b", "c"]

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();

      let choiceOrder = stateVariables["/g/ci"].stateValues.choiceOrder;
      let n = stateVariables["/g/n"].stateValues.value;
      let m = stateVariables["/m"].stateValues.value;

      let mathinput1Name = stateVariables[`/g/ans`].stateValues.inputChildren[0].componentName;
      let mathinput2Name = stateVariables[`/g2/ans`].stateValues.inputChildren[0].componentName;
      let mathinput3Name = stateVariables[`/g3/ans`].stateValues.inputChildren[0].componentName;
      let mathinput4Name = stateVariables[`/ans`].stateValues.inputChildren[0].componentName;

      let mathinput1Anchor = cesc('#' + mathinput1Name) + " textarea";
      let answer1Correct = cesc('#' + mathinput1Name + "_correct");
      let answer1Incorrect = cesc('#' + mathinput1Name + "_incorrect");
      let answer1Submit = cesc('#' + mathinput1Name + "_submit");

      let mathinput2Anchor = cesc('#' + mathinput2Name) + " textarea";
      let answer2Correct = cesc('#' + mathinput2Name + "_correct");
      let answer2Incorrect = cesc('#' + mathinput2Name + "_incorrect");
      let answer2Submit = cesc('#' + mathinput2Name + "_submit");

      let mathinput3Anchor = cesc('#' + mathinput3Name) + " textarea";
      let answer3Correct = cesc('#' + mathinput3Name + "_correct");
      let answer3Incorrect = cesc('#' + mathinput3Name + "_incorrect");
      let answer3Submit = cesc('#' + mathinput3Name + "_submit");

      let mathinput4Anchor = cesc('#' + mathinput4Name) + " textarea";
      let answer4Correct = cesc('#' + mathinput4Name + "_correct");
      let answer4Incorrect = cesc('#' + mathinput4Name + "_incorrect");
      let answer4Submit = cesc('#' + mathinput4Name + "_submit");

      cy.get(`label[for=${cesc("/g/ci_choice1_input")}]`).should('have.text', choices[choiceOrder[0] - 1]);
      cy.get(`label[for=${cesc("/g/ci_choice2_input")}]`).should('have.text', choices[choiceOrder[1] - 1]);
      cy.get(`label[for=${cesc("/g/ci_choice3_input")}]`).should('have.text', choices[choiceOrder[2] - 1]);
      cy.get(`label[for=${cesc("/g2/ci_choice1_input")}]`).should('have.text', choices[choiceOrder[0] - 1]);
      cy.get(`label[for=${cesc("/g2/ci_choice2_input")}]`).should('have.text', choices[choiceOrder[1] - 1]);
      cy.get(`label[for=${cesc("/g2/ci_choice3_input")}]`).should('have.text', choices[choiceOrder[2] - 1]);
      cy.get(`label[for=${cesc("/g3/ci_choice1_input")}]`).should('have.text', choices[choiceOrder[0] - 1]);
      cy.get(`label[for=${cesc("/g3/ci_choice2_input")}]`).should('have.text', choices[choiceOrder[1] - 1]);
      cy.get(`label[for=${cesc("/g3/ci_choice3_input")}]`).should('have.text', choices[choiceOrder[2] - 1]);

      cy.get(cesc(`#/g/_p2`)).should('have.text', `Enter ${n}. `)
      cy.get(cesc(`#/g2/_p2`)).should('have.text', `Enter ${n}. `)
      cy.get(cesc(`#/g3/_p2`)).should('have.text', `Enter ${n}. `)
      cy.get(cesc(`#/_p1`)).should('have.text', `Enter ${m}. `)

      cy.get(cesc(`#/g/ci_choice2_input`)).click();
      cy.get(cesc(`#/g/ci_choice2_input`)).should('be.checked')
      cy.get(cesc(`#/g2/ci_choice2_input`)).should('be.checked')
      cy.get(cesc(`#/g3/ci_choice2_input`)).should('not.be.checked')

      cy.get(cesc(`#/g/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g2/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g3/_p1`)).should('have.text', `Selected value: `)

      cy.get(cesc(`#/g3/ci_choice1_input`)).click();
      cy.get(cesc(`#/g/ci_choice2_input`)).should('be.checked')
      cy.get(cesc(`#/g2/ci_choice2_input`)).should('be.checked')
      cy.get(cesc(`#/g3/ci_choice1_input`)).should('be.checked')

      cy.get(cesc(`#/g/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g2/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g3/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[0] - 1]}`)

      cy.get(mathinput2Anchor).type(`${n}{enter}`, { force: true })
      cy.get(answer1Correct).should('be.visible')
      cy.get(answer2Correct).should('be.visible')
      cy.get(answer3Submit).should('be.visible')
      cy.get(answer4Submit).should('be.visible')

      cy.get(mathinput3Anchor).type(`${n}{enter}`, { force: true })
      cy.get(answer3Correct).should('be.visible');

      cy.get(mathinput4Anchor).type(`${m}{enter}`, { force: true })
      cy.get(answer4Correct).should('be.visible');

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/g2/n"].stateValues.value).eq(n)
        expect(stateVariables["/g3/n"].stateValues.value).eq(n)
        expect(stateVariables["/g2/ci"].stateValues.choiceOrder).eqls(choiceOrder);
        expect(stateVariables["/g3/ci"].stateValues.choiceOrder).eqls(choiceOrder);

        expect(stateVariables["/g/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[1] - 1]])
        expect(stateVariables["/g2/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[1] - 1]])
        expect(stateVariables["/g3/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[0] - 1]])

        expect(stateVariables["/g/ans"].stateValues.submittedResponses).eqls([n])
        expect(stateVariables["/g2/ans"].stateValues.submittedResponses).eqls([n])
        expect(stateVariables["/g3/ans"].stateValues.submittedResponses).eqls([n])
        expect(stateVariables["/ans"].stateValues.submittedResponses).eqls([m])


      })

      cy.wait(2000);  // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML: `
      <text>1</text>${doenetML}`,
          requestedVariantIndex: 1,
        }, "*");
      })

      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `1`)

      // wait until core is loaded
      cy.waitUntil(() => cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        return stateVariables["/ans"];
      }))


      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        expect(stateVariables["/g/n"].stateValues.value).eq(n)
        expect(stateVariables["/g2/n"].stateValues.value).eq(n)
        expect(stateVariables["/g3/n"].stateValues.value).eq(n)
        expect(stateVariables["/m"].stateValues.value).eq(m)

        expect(stateVariables["/g/ci"].stateValues.choiceOrder).eqls(choiceOrder);
        expect(stateVariables["/g2/ci"].stateValues.choiceOrder).eqls(choiceOrder);
        expect(stateVariables["/g3/ci"].stateValues.choiceOrder).eqls(choiceOrder);

        expect(stateVariables["/g/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[1] - 1]])
        expect(stateVariables["/g2/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[1] - 1]])
        expect(stateVariables["/g3/ci"].stateValues.selectedValues).eqls([choices[choiceOrder[0] - 1]])

        expect(stateVariables["/g/ans"].stateValues.submittedResponses).eqls([n])
        expect(stateVariables["/g2/ans"].stateValues.submittedResponses).eqls([n])
        expect(stateVariables["/g3/ans"].stateValues.submittedResponses).eqls([n])
        expect(stateVariables["/ans"].stateValues.submittedResponses).eqls([m])


      })

      cy.get(cesc(`#/g/ci_choice2_input`)).should('be.checked')
      cy.get(cesc(`#/g2/ci_choice2_input`)).should('be.checked')
      cy.get(cesc(`#/g3/ci_choice1_input`)).should('be.checked')

      cy.get(cesc(`#/g/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g2/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g3/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[0] - 1]}`)


      cy.get(cesc(`#/g/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g2/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[1] - 1]}`)
      cy.get(cesc(`#/g3/_p1`)).should('have.text', `Selected value: ${choices[choiceOrder[0] - 1]}`)


      cy.get(answer1Correct).should('be.visible')
      cy.get(answer2Correct).should('be.visible')
      cy.get(answer3Correct).should('be.visible')
      cy.get(answer4Correct).should('be.visible')

      cy.get(mathinput1Anchor).type(`{end}{backspace}{backspace}${n + 1}`, { force: true })
      cy.get(answer2Submit).click();
      cy.get(answer1Incorrect).should('be.visible')
      cy.get(answer2Incorrect).should('be.visible')

      cy.get(mathinput2Anchor).type(`{end}{backspace}{backspace}${n}`, { force: true })
      cy.get(answer1Submit).click();
      cy.get(answer1Correct).should('be.visible')
      cy.get(answer2Correct).should('be.visible')

      cy.get(mathinput3Anchor).type(`{end}{backspace}{backspace}${n + 1}`, { force: true })
      cy.get(answer3Submit).click();
      cy.get(answer3Incorrect).should('be.visible')
      cy.get(mathinput3Anchor).type(`{end}{backspace}{backspace}${n}`, { force: true })
      cy.get(answer3Submit).click();
      cy.get(answer3Correct).should('be.visible')


      cy.get(mathinput4Anchor).type(`{end}{backspace}{backspace}${m + 1}`, { force: true })
      cy.get(answer4Submit).click();
      cy.get(answer4Incorrect).should('be.visible')
      cy.get(mathinput4Anchor).type(`{end}{backspace}{backspace}${m}`, { force: true })
      cy.get(answer4Submit).click();
      cy.get(answer4Correct).should('be.visible')



    })

  })

  it('document inherits variants from single problem', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.log("get both options and then they repeat")
    for (let ind = 1; ind <= 3; ind++) {

      if (ind > 1) {
        cy.get('#testRunner_toggleControls').click();
        cy.get('#testRunner_newAttempt').click()
        cy.wait(100)
        cy.get('#testRunner_toggleControls').click();
        cy.reload();
      }

      let doenetML = `
      <problem>
        <variantControl nVariants="2" variantNames="apple orange" />
        <text>${ind}</text>
        <setup>
          <select assignNames="(fruit)">
            <option selectForVariantNames="apple"><text>apple</text></option>
            <option selectForVariantNames="orange"><text>orange</text></option>
          </select>
        </setup>
        <p>Enter $fruit:
          <answer type="text">$fruit</answer>
        </p>
      </problem>
      `

      cy.window().then(async (win) => {
        win.postMessage({
          doenetML,
          requestedVariantIndex: ind,
        }, "*");
      })
      // to wait for page to load
      cy.get('#\\/_text1').should('have.text', `${ind}`)

      let fruit = ["apple", "orange"][(ind - 1) % 2];

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let textinputName = cesc(stateVariables['/_answer1'].stateValues.inputChildren[0].componentName)
        let textinputAnchor = '#' + textinputName + '_input';
        let textinputSubmitAnchor = '#' + textinputName + '_submit';
        let textinputCorrectAnchor = '#' + textinputName + '_correct';
        let textinputIncorrectAnchor = '#' + textinputName + '_incorrect';


        expect(stateVariables["/fruit"].stateValues.value).eq(fruit);
        expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["apple", "orange"])
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(fruit)

        cy.get(textinputAnchor).type(`${fruit}{enter}`);

        cy.get(textinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer1"].stateValues.submittedResponses).eqls([fruit]);

        });

        cy.wait(2000);  // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage({
            doenetML,
            requestedVariantIndex: ind,
          }, "*");
        })

        // to wait for page to load
        cy.get('#\\/_text1').should('have.text', `${ind}`)

        // wait until core is loaded
        cy.waitUntil(() => cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/_answer1"];
        }))


        cy.get(textinputAnchor).should('have.value', `${fruit}`)
        cy.get(textinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer1"].stateValues.submittedResponses).eqls([fruit]);
        });

        cy.get(textinputAnchor).type(`{end}s`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputIncorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
          expect(stateVariables["/_answer1"].stateValues.submittedResponses).eqls([fruit + "s"]);
        });

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(textinputSubmitAnchor).click();
        cy.get(textinputCorrectAnchor).should('be.visible');

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer1"].stateValues.submittedResponses).eqls([fruit]);
        });

      })

    }


  });

  it('variantsToInclude and variantsToExclude', () => {

    cy.get('#testRunner_toggleControls').click();
    cy.get('#testRunner_allowLocalState').click()
    cy.wait(100)
    cy.get('#testRunner_toggleControls').click();


    cy.log('get two variants with no include/exclude');

    let baseDoenetMLa = `
    <variantControl nVariants="10" variantNames="first second" />
    Selected number: 
    <selectfromsequence assignnames="n" length="100000" />
    `

    let values = [];


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>2</text' + baseDoenetMLa,
        requestedVariantIndex: 2,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `2`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      values.push(stateVariables["/n"].stateValues.value)
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('second');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>5</text' + baseDoenetMLa,
        requestedVariantIndex: 5,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `5`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      values.push(stateVariables["/n"].stateValues.value)
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    })




    cy.log('get same variants when add variantsToInclude');


    let baseDoenetMLb = `
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="second e" />
    Selected number: 
    <selectfromsequence assignnames="n" length="100000" />
    `


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>1</text' + baseDoenetMLb,
        requestedVariantIndex: 1,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(values[0])
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('second');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["second", "e"]);
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>2</text' + baseDoenetMLb,
        requestedVariantIndex: 2,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `2`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(values[1])
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["second", "e"]);
    })



    cy.log('get same variants when add variantsToExclude');


    let baseDoenetMLc = `
    <variantControl nVariants="10" variantNames="first second" variantsToExclude="first d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="100000" />
    `


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>1</text' + baseDoenetMLc,
        requestedVariantIndex: 1,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(values[0])
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('second');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["second", "c", "e", "f", "g", "i"]);
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>3</text' + baseDoenetMLc,
        requestedVariantIndex: 3,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `3`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(values[1])

      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["second", "c", "e", "f", "g", "i"]);
    })




    cy.log('get same variants when add variantsToInclude and variantsToExclude');


    let baseDoenetMLd = `
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="first second d e g h" variantsToExclude="first c d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="100000" />
    `


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>1</text' + baseDoenetMLd,
        requestedVariantIndex: 1,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `1`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(values[0])
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('2');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('second');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["second", "e", "g"]);
    })


    cy.window().then(async (win) => {
      win.postMessage({
        doenetML: '<text>2</text' + baseDoenetMLd,
        requestedVariantIndex: 2,
      }, "*");
    })

    // to wait for page to load
    cy.get('#\\/_text1').should('have.text', `2`)


    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(values[1])

      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq('5');
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq('e');
      expect(stateVariables["/_document1"].sharedParameters.allPossibleVariants).eqls(["second", "e", "g"]);
    })


  });


});
