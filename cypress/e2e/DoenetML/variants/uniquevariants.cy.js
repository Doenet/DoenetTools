import { cesc, cesc2 } from "../../../../src/_utils/url";

describe("Specifying unique variant tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  it("single select", () => {
    let values = ["u", "v", "w", "x", "y", "z"];

    cy.log("get all values in order and they repeat in next variants");
    for (let ind = 1; ind <= 18; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <select assignnames="x">u v w x y z</select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/x") + " .mjx-mrow").should(
        "have.text",
        values[(ind - 1) % 6],
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(
          values[(ind - 1) % 6],
        );
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);
      });
    }
  });

  it("single selectfromsequence", () => {
    cy.log("get all values in order and they repeat in next variants");
    for (let ind = 1; ind <= 15; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <selectfromsequence assignnames="x" length="5" />
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/x")).should("have.text", ((ind - 1) % 5) + 1);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(((ind - 1) % 5) + 1);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e"]);
      });
    }
  });

  it("selectfromsequence with excludes", () => {
    cy.log("get all values in order and they repeat in next variants");
    for (let ind = 1; ind <= 12; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      let letters = ["c", "e", "i", "m"];

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <selectfromsequence assignnames="x" type="letters" from="c" to="m" step="2" exclude="g k" />
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/x")).should("have.text", letters[(ind - 1) % 4]);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(
          letters[(ind - 1) % 4],
        );
      });
    }
  });

  it("select and selectfromsequence combination", () => {
    let valuesW = ["m", "n"];
    let valuesX = ["x", "y", "z"];
    let valuesY = [2, 3, 4];
    let valuesZ = [3, 7];

    let values = [];
    for (let w of valuesW) {
      for (let x of valuesX) {
        for (let y of valuesY) {
          for (let z of valuesZ) {
            values.push([w, x, y, z].join(","));
          }
        }
      }
    }
    let valuesFound = [];

    let numVariants =
      valuesW.length * valuesX.length * valuesY.length * valuesZ.length;

    let wsFound = [],
      xsFound = [],
      ysFound = [],
      zsFound = [];

    cy.log("get all values in variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w" from="m" to="n" />
        <select assignnames="x">x y z</select>
        <selectfromsequence assignnames="y" from="2" to="4" />
        <select assignnames="z">3 7</select>
      </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables["/w"].stateValues.value;
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 3) {
          wsFound.push(newW);
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      });
    }

    cy.log("all individual options selected in first variants");
    cy.window().then(async (win) => {
      expect(wsFound.slice(0, 2).sort()).eqls(valuesW);
      expect(xsFound.sort()).eqls(valuesX);
      expect(ysFound.sort()).eqls(valuesY);
      expect(zsFound.slice(0, 2).sort()).eqls(valuesZ);
    });

    cy.log("values begin to repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 15; ind += 3) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <selectfromsequence type="letters" assignnames="w" from="m" to="n" />
        <select assignnames="x">x y z</select>
        <selectfromsequence assignnames="y" from="2" to="4" />
        <select assignnames="z">3 7</select>
      </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables["/w"].stateValues.value;
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(",");

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("select multiple", () => {
    let valuesSingle = ["w", "x", "y", "z"];
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        if (y == x) {
          continue;
        }
        for (let z of valuesSingle) {
          if (z === x || z === y) {
            continue;
          }
          values.push([x, y, z].join(","));
        }
      }
    }

    let numVariants = values.length;

    let xsFound = [],
      ysFound = [],
      zsFound = [];

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3">w x y z</select>
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 4) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      });
    }

    cy.log("all individual options selected in first variants");
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle);
    });

    cy.log("values begin to repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3">w x y z</select>
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("select multiple with replacement", () => {
    let valuesSingle = ["x", "y", "z"];
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        for (let z of valuesSingle) {
          values.push([x, y, z].join(","));
        }
      }
    }

    let numVariants = values.length;
    let xsFound = [],
      ysFound = [],
      zsFound = [];

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3" withreplacement>x y z</select>
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 3) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      });
    }

    cy.log("all individual options selected in first variants");
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle);
    });

    cy.log("values begin to repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="x y z" numbertoselect="3" withreplacement>x y z</select>
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("select multiple from sequence", () => {
    let valuesSingle = ["w", "x", "y", "z"];
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        if (y == x) {
          continue;
        }
        for (let z of valuesSingle) {
          if (z === x || z === y) {
            continue;
          }
          values.push([x, y, z].join(","));
        }
      }
    }

    let numVariants = values.length;
    let xsFound = [],
      ysFound = [],
      zsFound = [];

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" from="w" to="z" />
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 4) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      });
    }

    cy.log("all individual options selected in first variants");
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle);
    });

    cy.log("values begin to repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" from="w" to="z" />
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("select multiple from sequence with replacement", () => {
    let valuesSingle = ["x", "y", "z"];
    let valuesFound = [];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        for (let z of valuesSingle) {
          values.push([x, y, z].join(","));
        }
      }
    }

    let numVariants = values.length;
    let xsFound = [],
      ysFound = [],
      zsFound = [];

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" withreplacement from="x" to="z" />
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 3) {
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      });
    }

    cy.log("all individual options selected in first variants");
    cy.window().then(async (win) => {
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle);
    });

    cy.log("values begin to repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <selectfromsequence type="letters" assignnames="x y z" numbertoselect="3" withreplacement from="x" to="z" />
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newX, newY, newZ].join(",");

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("limit variants", () => {
    let valuesSingle = ["u", "v", "w", "x", "y", "z"];
    let valuesFound = [];
    let values = [];
    for (let w of valuesSingle) {
      for (let x of valuesSingle) {
        for (let y of valuesSingle) {
          for (let z of valuesSingle) {
            values.push([w, x, y, z].join(","));
          }
        }
      }
    }

    let numVariants = 10;
    let wsFound = [],
      xsFound = [],
      ysFound = [],
      zsFound = [];

    cy.log("get unique values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w x y z" numbertoselect="4" withreplacement from="u" to="z" />
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables["/w"].stateValues.value;
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);

        if (ind <= 6) {
          wsFound.push(newW);
          xsFound.push(newX);
          ysFound.push(newY);
          zsFound.push(newZ);
        }
      });
    }

    cy.log("all individual options selected in first variants");
    cy.window().then(async (win) => {
      expect(wsFound.sort()).eqls(valuesSingle);
      expect(xsFound.sort()).eqls(valuesSingle);
      expect(ysFound.sort()).eqls(valuesSingle);
      expect(zsFound.sort()).eqls(valuesSingle);
    });

    cy.log("values repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= 2 * numVariants + 3; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants nvariants="10" />
        <aslist>
          <selectfromsequence type="letters" assignnames="w x y z" numbertoselect="4" withreplacement from="u" to="z" />
        </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newW = stateVariables["/w"].stateValues.value;
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newZ = stateVariables["/z"].stateValues.value;
        let newValue = [newW, newX, newY, newZ].join(",");

        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("selects of selectfromsequence", () => {
    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <selectfromsequence from="1" to="2" />
        </option>
        <option>
          <selectfromsequence from="101" to="103" />
        </option>
        <option>
          <selectfromsequence from="201" to="204" />
        </option>
      </select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables["/x"].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants");
          cy.window().then(async (win) => {
            expect(valuesFound.some((x) => x <= 2)).eq(true);
            expect(valuesFound.some((x) => x >= 101 && x <= 103)).eq(true);
            expect(valuesFound.some((x) => x >= 201 && x <= 204)).eq(true);
          });
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants");
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                0,
              ),
            ).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                0,
              ),
            ).eq(2);
          });
        }

        if (ind === 8) {
          cy.log(
            "most individual groups selected three times in first variants",
          );
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                0,
              ),
            ).eq(3);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                0,
              ),
            ).eq(3);
          });
        }
      });
    }

    cy.log("values repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <selectfromsequence from="1" to="2" />
        </option>
        <option>
          <selectfromsequence from="101" to="103" />
        </option>
        <option>
          <selectfromsequence from="201" to="204" />
        </option>
      </select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables["/x"].stateValues.value;
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("selects of selects", () => {
    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <select>1 2</select>
        </option>
        <option>
          <select>101 102 103</select>
        </option>
        <option>
          <select>201 202 203 204</select>
        </option>
      </select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables["/x"].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants");
          cy.window().then(async (win) => {
            expect(valuesFound.some((x) => x <= 2)).eq(true);
            expect(valuesFound.some((x) => x >= 101 && x <= 103)).eq(true);
            expect(valuesFound.some((x) => x >= 201 && x <= 204)).eq(true);
          });
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants");
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                0,
              ),
            ).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                0,
              ),
            ).eq(2);
          });
        }

        if (ind === 8) {
          cy.log(
            "most individual groups selected three times in first variants",
          );
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                0,
              ),
            ).eq(3);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                0,
              ),
            ).eq(3);
          });
        }
      });
    }

    cy.log("values repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="((x))">
        <option>
          <select>1 2</select>
        </option>
        <option>
          <select>101 102 103</select>
        </option>
        <option>
          <select>201 202 203 204</select>
        </option>
      </select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables["/x"].stateValues.value;
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("selects of paragraphs of selects/selectfromsequence", () => {
    let valuesFound = [];
    let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let numVariants = values.length;

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <option newNamespace>
          <p><select assignnames="n">1 2</select></p>
        </option>
        <option newNamespace>
         <p><selectfromsequence assignnames="n" from="101" to="103"/></p>
        </option>
        <option newNamespace>
          <p><select assignnames="n">201 202 203 204</select></p>
        </option>
      </select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables["/x/n"].stateValues.value;
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants");
          cy.window().then(async (win) => {
            expect(valuesFound.some((x) => x <= 2)).eq(true);
            expect(valuesFound.some((x) => x >= 101 && x <= 103)).eq(true);
            expect(valuesFound.some((x) => x >= 201 && x <= 204)).eq(true);
          });
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants");
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                0,
              ),
            ).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                0,
              ),
            ).eq(2);
          });
        }

        if (ind === 8) {
          cy.log(
            "most individual groups selected three times in first variants",
          );
          cy.window().then(async (win) => {
            expect(valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(2);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                0,
              ),
            ).eq(3);
            expect(
              valuesFound.reduce(
                (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                0,
              ),
            ).eq(3);
          });
        }
      });
    }

    cy.log("values repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <select assignnames="x">
        <option newNamespace>
          <p><select assignnames="n">1 2</select></p>
        </option>
        <option newNamespace>
         <p><selectfromsequence assignnames="n" from="101" to="103"/></p>
        </option>
        <option newNamespace>
          <p><select assignnames="n">201 202 203 204</select></p>
        </option>
      </select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newValue = stateVariables["/x/n"].stateValues.value;
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("selects of selects, select multiple", () => {
    let valuesFound = [];
    let valuesSingle = [1, 2, 101, 102, 103, 201, 202, 203, 204];
    let values = [];
    for (let x of valuesSingle) {
      for (let y of valuesSingle) {
        if (Math.abs(y - x) > 5) {
          values.push([x, y].join(","));
        }
      }
    }
    let numVariants = values.length;

    cy.log("get unique values in first variants");
    for (let ind = 1; ind <= 20; ind++) {
      // reload every 10 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 10 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="((x)) ((y))" numberToSelect="2">
          <option>
            <select>1 2</select>
          </option>
          <option>
            <select>101 102 103</select>
          </option>
          <option>
            <select>201 202 203 204</select>
          </option>
        </select>
      </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newValue = [newX, newY].join(",");
        expect(values.includes(newValue)).eq(true);
        expect(valuesFound.includes(newValue)).eq(false);
        valuesFound.push(newValue);
      });
    }

    cy.log("values repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 20; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
      <text>${ind}</text>
      <variantControl uniquevariants />
      <aslist>
        <select assignnames="((x)) ((y))" numberToSelect="2">
          <option>
            <select>1 2</select>
          </option>
          <option>
            <select>101 102 103</select>
          </option>
          <option>
            <select>201 202 203 204</select>
          </option>
        </select>
      </aslist>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let newX = stateVariables["/x"].stateValues.value;
        let newY = stateVariables["/y"].stateValues.value;
        let newValue = [newX, newY].join(",");
        expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }

    cy.log("selects all individual groups equally in first variants");
    let valuesFound1 = [];
    let valuesFound2 = [];
    for (let pass = 0; pass < 12; pass++) {
      for (let ind = pass * 3 + 1; ind <= (pass + 1) * 3; ind++) {
        // reload every 10 times to keep it from slowing down
        // (presumably due to garbage collecting)
        if (ind % 10 === 0) {
          cy.reload();
        }

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `
        <text>${ind}</text>
        <variantControl uniquevariants />
        <aslist>
          <select assignnames="((x)) ((y))" numberToSelect="2">
            <option>
              <select>1 2</select>
            </option>
            <option>
              <select>101 102 103</select>
            </option>
            <option>
              <select>201 202 203 204</select>
            </option>
          </select>
        </aslist>
        `,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });
        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          valuesFound1.push(stateVariables["/x"].stateValues.value);
          valuesFound2.push(stateVariables["/y"].stateValues.value);
        });
      }
      cy.window().then(async (win) => {
        expect(valuesFound1.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(
          pass + 1,
        );
        expect(
          valuesFound1.reduce((a, c) => a + (c >= 101 && c <= 103 ? 1 : 0), 0),
        ).eq(pass + 1);
        expect(
          valuesFound1.reduce((a, c) => a + (c >= 201 && c <= 204 ? 1 : 0), 0),
        ).eq(pass + 1);
        expect(valuesFound2.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(
          pass + 1,
        );
        expect(
          valuesFound2.reduce((a, c) => a + (c >= 101 && c <= 103 ? 1 : 0), 0),
        ).eq(pass + 1);
        expect(
          valuesFound2.reduce((a, c) => a + (c >= 201 && c <= 204 ? 1 : 0), 0),
        ).eq(pass + 1);
      });
    }
  });

  it("deeper nesting of selects/selectfromsequence", () => {
    let doenetML = `
    <variantControl nvariants="24" uniquevariants/>
    <select assignnames="(p)">
      <option>
        <p>Favorite color:
          <select>
            <option>
              <select type="text">red orange yellow magenta maroon fuchsia scarlet</select>
            </option>
            <option>
              <select type="text">green chartreuse turquoise</select>
            </option>
            <option>
              <select type="text">white black</select>
            </option>
          </select>
        </p>
      </option>
      <option>
        <p>Selected number:
          <select>
            <option><selectfromsequence from="1000" to="2000" /></option>
            <option><selectfromsequence from="-1000" to="-900" /></option>
          </select>
        </p>
      </option>
      <option>
        <p>Chosen letter: <selectfromsequence type="letters" from="a" to="z" /></p>
      </option>
      <option>
        <p>Variable:
          <select>u v w x y z</select>
        </p>
      </option>
    </select>
    `;

    let valuesFound = [];

    let colorsA = [
      "red",
      "orange",
      "yellow",
      "magenta",
      "maroon",
      "fuchsia",
      "scarlet",
    ];
    let colorsB = ["green", "chartreuse", "turquoise"];
    let colorsC = ["white", "black"];
    let allColors = [...colorsA, ...colorsB, ...colorsC];

    let letters = [...Array(26)].map((_, i) =>
      String.fromCharCode("a".charCodeAt(0) + i),
    );

    let variables = ["u", "v", "w", "x", "y", "z"];

    let categories = [
      "Favorite color:",
      "Selected number:",
      "Chosen letter:",
      "Variable:",
    ];

    let numVariants = 24;

    let colorsFound = [];
    let numbersFound = [];
    let lettersFound = [];
    let variablesFound = [];
    let categoriesFound = [];

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      // reload every 8 times to keep it from slowing down
      // (presumably due to garbage collecting)
      if (ind % 8 === 0) {
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables["/p"].activeChildren[0].trim();
        expect(categories.includes(category)).eq(true);

        let component =
          stateVariables[
            stateVariables["/p"].activeChildren.filter(
              (x) => x.componentName,
            )[0].componentName
          ];
        let newValue = component.stateValues.value;
        if (category === categories[0]) {
          expect(allColors.includes(newValue)).eq(true);
          colorsFound.push(newValue);
        } else if (category === categories[1]) {
          let validNum =
            Number.isInteger(newValue) &&
            ((newValue >= 1000 && newValue <= 2000) ||
              (newValue >= -1000 && newValue <= -900));
          expect(validNum).eq(true);
          numbersFound.push(newValue);
        } else if (category === categories[2]) {
          expect(letters.includes(newValue)).eq(true);
          lettersFound.push(newValue);
        } else {
          expect(variables.includes(newValue)).eq(true);
          variablesFound.push(newValue);
        }

        let combinedValue = [category, newValue].join(",");

        expect(valuesFound.includes(combinedValue)).eq(false);
        valuesFound.push(combinedValue);

        categoriesFound.push(category);

        if (ind === 4) {
          cy.log("all individual groups selected in first variants");
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 4; ind++) {
              expect(categoriesFound.includes(categories[ind])).eq(true);
            }
          });
        }

        if (ind === 8) {
          cy.log("all individual groups selected twice in first variants");
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 4; ind++) {
              expect(categoriesFound.slice(4, 8).includes(categories[ind])).eq(
                true,
              );
            }
          });
        }
      });
    }

    cy.log(
      "the 24 values are distributed 6 to each category and evenly distributed across subcategories",
    );
    cy.window().then(async (win) => {
      let colorsFoundSet = new Set(colorsFound);
      expect(colorsFoundSet.size).eq(6);
      expect(
        colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
      ).eq(2);
      expect(
        colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
      ).eq(2);
      expect(
        colorsC.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
      ).eq(2);

      expect(numbersFound.reduce((a, c) => a + (c > 0 ? 1 : 0), 0)).eq(3);
      expect(numbersFound.reduce((a, c) => a + (c < 0 ? 1 : 0), 0)).eq(3);

      expect(lettersFound.length).eq(6);
      expect(variablesFound.length).eq(6);

      expect(variablesFound.sort()).eqls(variables);
    });

    cy.log("values repeat in next variants");
    cy.reload();
    for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables["/p"].activeChildren[0].trim();
        let component =
          stateVariables[
            stateVariables["/p"].activeChildren.filter(
              (x) => x.componentName,
            )[0].componentName
          ];
        let newValue = component.stateValues.value;
        let combinedValue = [category, newValue].join(",");
        expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("select problems of selects/selectfromsequence", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl nvariants="6" uniquevariants/>
    <select assignnames="(problem)">
      <option>
        <problem newNamespace><title>Favorite color</title>
          <select assignNames="(p)">
            <option>
              <p newNamespace>I like 
                <select type="text" assignNames="color">red orange yellow magenta maroon fuchsia scarlet</select>
              </p>
            </option>
            <option>
              <p newNamespace>You like
                <select type="text" assignNames="color">green chartreuse turquoise</select>
              </p>
            </option>
          </select>
          <p>Enter the color $(p/color): <answer name="ans" type="text">$(p/color)</answer></p>
        </problem>
      </option>
      <option>
        <problem newNamespace><title>Selected word</title>
          <select assignNames="(p)">
            <option><p newNamespace>Verb: <select type="text" assignNames="word">run walk jump skip</select></p></option>
            <option><p newNamespace>Adjective: <select type="text" assignNames="word">soft scary large empty residual limitless</select></p></option>
          </select>
          <p>Enter the word $(p/word): <answer name="ans" type="text">$(p/word)</answer></p>
        </problem>
      </option>
      <option>
        <problem newNamespace><title>Chosen letter</title>
          <p>Letter
            <selectfromsequence  assignNames="l" type="letters" from="a" to="z" />
          </p>
          <p>Enter the letter $l: <answer name="ans" type="text">$l</answer></p>
        </problem>
      </option>
    </select>
    `;

    let valuesFound = [];

    let colorsA = [
      "red",
      "orange",
      "yellow",
      "magenta",
      "maroon",
      "fuchsia",
      "scarlet",
    ];
    let colorsB = ["green", "chartreuse", "turquoise"];
    let allColors = [...colorsA, ...colorsB];

    let wordsA = ["run", "walk", "jump", "skip"];
    let wordsB = ["soft", "scary", "large", "empty", "residual", "limitless"];
    let allWords = [...wordsA, ...wordsB];

    let letters = [...Array(26)].map((_, i) =>
      String.fromCharCode("a".charCodeAt(0) + i),
    );

    let categories = ["Favorite color", "Selected word", "Chosen letter"];

    let numVariants = 6;

    let categoriesFound = [];
    let colorsFound = [];
    let wordsFound = [];
    let lettersFound = [];

    cy.log("get all values in first variants");
    for (let ind = 1; ind <= numVariants; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      let category, newValue;

      let textinputName;

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        textinputName =
          stateVariables[`/problem/ans`].stateValues.inputChildren[0]
            .componentName;
        category = stateVariables["/problem"].stateValues.title;
        expect(categories.includes(category)).eq(true);

        let component =
          stateVariables[
            stateVariables[
              stateVariables["/problem"].activeChildren.filter(
                (x) => x.componentName,
              )[1].componentName
            ].activeChildren[1].componentName
          ];
        newValue = component.stateValues.value;
        if (category === categories[0]) {
          expect(allColors.includes(newValue)).eq(true);
          colorsFound.push(newValue);
        } else if (category === categories[1]) {
          expect(allWords.includes(newValue)).eq(true);
          wordsFound.push(newValue);
        } else if (category === categories[2]) {
          expect(letters.includes(newValue)).eq(true);
          lettersFound.push(newValue);
        }

        let combinedValue = [category, newValue].join(",");

        expect(valuesFound.includes(combinedValue)).eq(false);
        valuesFound.push(combinedValue);

        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        categoriesFound.push(category);

        if (ind === 3) {
          cy.log("all individual groups selected in first variants");
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 3; ind++) {
              expect(categoriesFound.includes(categories[ind])).eq(true);
            }
          });
        }

        if (ind === 6) {
          cy.log("all individual groups selected twice in first variants");
          cy.window().then(async (win) => {
            for (let ind = 0; ind < 3; ind++) {
              expect(categoriesFound.slice(3).includes(categories[ind])).eq(
                true,
              );
            }
          });
        }
      });

      cy.window().then(async (win) => {
        let textinputAnchor = cesc2("#" + textinputName) + "_input";
        let answerCorrect = cesc2("#" + textinputName + "_correct");
        let answerIncorrect = cesc2("#" + textinputName + "_incorrect");
        let answerSubmit = cesc2("#" + textinputName + "_submit");

        cy.get(textinputAnchor).type(`${newValue}{enter}`);

        cy.get(answerCorrect).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(
            1,
          );
          expect(
            stateVariables["/problem/ans"].stateValues.submittedResponses,
          ).eqls([newValue]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue);
        });

        cy.wait(1500); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });
        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/problem/ans"];
          }),
        );

        cy.get(answerCorrect).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(
            1,
          );
          expect(
            stateVariables["/problem/ans"].stateValues.submittedResponses,
          ).eqls([newValue]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue);
        });

        cy.get(textinputAnchor).type(`{end}X`);
        cy.get(answerSubmit).click();
        cy.get(answerIncorrect).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(
            0,
          );
          expect(
            stateVariables["/problem/ans"].stateValues.submittedResponses,
          ).eqls([newValue + "X"]);
          expect(stateVariables[textinputName].stateValues.value).eq(
            newValue + "X",
          );
        });

        cy.get(textinputAnchor).type(`{end}{backspace}`);
        cy.get(answerSubmit).click();
        cy.get(answerCorrect).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/problem/ans"].stateValues.creditAchieved).eq(
            1,
          );
          expect(
            stateVariables["/problem/ans"].stateValues.submittedResponses,
          ).eqls([newValue]);
          expect(stateVariables[textinputName].stateValues.value).eq(newValue);
        });
      });
    }

    cy.window().then(async (win) => {
      let colorsFoundSet = new Set(colorsFound);
      expect(colorsFoundSet.size).eq(2);
      expect(
        colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
      ).eq(1);
      expect(
        colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
      ).eq(1);

      let wordsFoundSet = new Set(wordsFound);
      expect(wordsFoundSet.size).eq(2);
      expect(wordsA.reduce((a, c) => a + (wordsFoundSet.has(c) ? 1 : 0), 0)).eq(
        1,
      );
      expect(wordsB.reduce((a, c) => a + (wordsFoundSet.has(c) ? 1 : 0), 0)).eq(
        1,
      );
    });

    cy.log("values repeat in next variants");
    for (let ind = numVariants + 1; ind <= numVariants + 6; ind += 2) {
      cy.get("#testRunner_toggleControls").click();
      cy.get("#testRunner_newAttempt").click();
      cy.wait(100);
      cy.get("#testRunner_toggleControls").click();
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let category = stateVariables["/problem"].stateValues.title;
        let component =
          stateVariables[
            stateVariables[
              stateVariables["/problem"].activeChildren.filter(
                (x) => x.componentName,
              )[1].componentName
            ].activeChildren[1].componentName
          ];
        let newValue = component.stateValues.value;
        let combinedValue = [category, newValue].join(",");
        expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants]);
      });
    }
  });

  it("can get unique with map without variants", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <selectfromsequence assignnames="x" length="3" />
    <map assignNames="(p1) (p2) (p3) (p4)">
      <template>
        <p>letter: $v</p>
      </template>
      <sources alias="v">
        <sequence type="letters" length="$n" />
      </sources>
    </map>
    <p>N: <mathinput name="n" prefill="1" /></p>
    `;

    cy.log("get all values in order and they repeat in next variants");
    for (let ind = 1; ind <= 4; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/x")).should("have.text", ((ind - 1) % 3) + 1);

      cy.get(cesc("#\\/p1")).should("have.text", "letter: a");
      cy.get(cesc("#\\/p2")).should("not.exist");

      cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
        force: true,
      });
      cy.get(cesc("#\\/p1")).should("have.text", "letter: a");
      cy.get(cesc("#\\/p2")).should("have.text", "letter: b");
      cy.get(cesc("#\\/p3")).should("have.text", "letter: c");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(((ind - 1) % 3) + 1);
        expect(
          stateVariables[stateVariables["/p1"].activeChildren[1].componentName]
            .stateValues.value,
        ).eq("a");
        expect(
          stateVariables[stateVariables["/p2"].activeChildren[1].componentName]
            .stateValues.value,
        ).eq("b");
        expect(
          stateVariables[stateVariables["/p3"].activeChildren[1].componentName]
            .stateValues.value,
        ).eq("c");
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c"]);
      });

      cy.wait(1500); // wait for 1 second debounce
      cy.reload();

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });

      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      // wait until core is loaded
      cy.waitUntil(() =>
        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          return stateVariables["/x"];
        }),
      );

      cy.get(cesc("#\\/x")).should("have.text", ((ind - 1) % 3) + 1);

      cy.get(cesc("#\\/p1")).should("have.text", "letter: a");
      cy.get(cesc("#\\/p2")).should("have.text", "letter: b");
      cy.get(cesc("#\\/p3")).should("have.text", "letter: c");

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(((ind - 1) % 3) + 1);
        expect(
          stateVariables[stateVariables["/p1"].activeChildren[1].componentName]
            .stateValues.value,
        ).eq("a");
        expect(
          stateVariables[stateVariables["/p2"].activeChildren[1].componentName]
            .stateValues.value,
        ).eq("b");
        expect(
          stateVariables[stateVariables["/p3"].activeChildren[1].componentName]
            .stateValues.value,
        ).eq("c");
      });

      cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
        force: true,
      });
      cy.get(cesc("#\\/p1")).should("have.text", "letter: a");
      cy.get(cesc("#\\/p2")).should("have.text", "letter: b");
      cy.get(cesc("#\\/p3")).should("have.text", "letter: c");
      cy.get(cesc("#\\/p4")).should("have.text", "letter: d");
    }
  });

  it("single shuffled choiceinput", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <choiceinput name="ci" shuffleOrder>
      <choice>red</choice>
      <choice>blue</choice>
      <choice>green</choice>
    </choiceinput>
    <p>Selected value: <copy prop='selectedvalue' target="ci" assignNames="selectedValue" /></p>

    `;

    let ordersFound = [];
    let choices = ["red", "blue", "green"];

    cy.log("get all orders in first 6 variants");
    for (let ind = 1; ind <= 6; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
        let selectedOrder = choiceOrder.join(",");
        expect(ordersFound.includes(selectedOrder)).eq(false);
        ordersFound.push(selectedOrder);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        for (let i = 0; i < 3; i++) {
          cy.get(cesc(`#\\/ci_choice${i + 1}_input`)).click();
          cy.get(cesc("#\\/selectedValue")).should(
            "have.text",
            choices[choiceOrder[i] - 1],
          );
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
              choices[choiceOrder[i] - 1],
            ]);
          });
        }

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/ci"];
          }),
        );

        cy.get(cesc("#\\/selectedValue")).should(
          "have.text",
          choices[choiceOrder[2] - 1],
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
            choices[choiceOrder[2] - 1],
          ]);
        });

        cy.get(cesc(`#\\/ci_choice1_input`)).click();
        cy.get(cesc("#\\/selectedValue")).should(
          "have.text",
          choices[choiceOrder[0] - 1],
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
            choices[choiceOrder[0] - 1],
          ]);
        });
      });
    }

    cy.log("7th variant repeats first order");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_newAttempt").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    let ind = 7;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
      let selectedOrder = choiceOrder.join(",");
      expect(selectedOrder).eq(ordersFound[0]);
    });
  });

  it("single shuffled choiceinput, choices copied in", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <choice name="red">red</choice>
    <group name="twoChoices">
      <choice>blue</choice>
      <choice>green</choice>
    </group>

    <choiceinput name="ci" shuffleOrder>
      <choice copySource="red" />
      <copy source="twoChoices" createComponentOfType="choice" nComponents="2" />
    </choiceinput>
    <p>Selected value: <copy prop='selectedvalue' target="ci" assignNames="selectedValue" /></p>

    `;

    let ordersFound = [];
    let choices = ["red", "blue", "green"];

    cy.log("get all orders in first 6 variants");
    for (let ind = 1; ind <= 6; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
        let selectedOrder = choiceOrder.join(",");
        expect(ordersFound.includes(selectedOrder)).eq(false);
        ordersFound.push(selectedOrder);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        for (let i = 0; i < 3; i++) {
          cy.get(cesc(`#\\/ci_choice${i + 1}_input`)).click();
          cy.get(cesc("#\\/selectedValue")).should(
            "have.text",
            choices[choiceOrder[i] - 1],
          );
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
              choices[choiceOrder[i] - 1],
            ]);
          });
        }

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/ci"];
          }),
        );

        cy.get(cesc("#\\/selectedValue")).should(
          "have.text",
          choices[choiceOrder[2] - 1],
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
            choices[choiceOrder[2] - 1],
          ]);
        });

        cy.get(cesc(`#\\/ci_choice1_input`)).click();
        cy.get(cesc("#\\/selectedValue")).should(
          "have.text",
          choices[choiceOrder[0] - 1],
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
            choices[choiceOrder[0] - 1],
          ]);
        });
      });
    }

    cy.log("7th variant repeats first order");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_newAttempt").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    let ind = 7;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
      let selectedOrder = choiceOrder.join(",");
      expect(selectedOrder).eq(ordersFound[0]);
    });
  });

  it("single shuffled choiceinput sugared inside answer", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <answer name="ans" shuffleOrder>
      <choice credit="1">red</choice>
      <choice>blue</choice>
      <choice>green</choice>
    </answer>
    <p>Submitted response: <copy prop='submittedResponse' target="ans" assignNames="sr" /></p>

    `;

    let ordersFound = [];
    let choices = ["red", "blue", "green"];

    cy.log("get all orders in first 6 variants");
    for (let ind = 1; ind <= 6; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceInputName =
          stateVariables["/ans"].stateValues.inputChildren[0].componentName;
        let choiceOrder =
          stateVariables[choiceInputName].stateValues.choiceOrder;
        let selectedOrder = choiceOrder.join(",");
        expect(ordersFound.includes(selectedOrder)).eq(false);
        ordersFound.push(selectedOrder);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        for (let i = 0; i < 3; i++) {
          cy.get(
            "#" + cesc2(choiceInputName) + `_choice${i + 1}_input`,
          ).click();
          cy.get("#" + cesc2(choiceInputName) + "_submit").click();
          cy.get(cesc("#\\/sr")).should(
            "have.text",
            choices[choiceOrder[i] - 1],
          );
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
              stateVariables[choiceInputName].stateValues.selectedValues,
            ).eqls([choices[choiceOrder[i] - 1]]);
          });
        }

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/ans"];
          }),
        );

        cy.get(cesc("#\\/sr")).should("have.text", choices[choiceOrder[2] - 1]);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(
            stateVariables[choiceInputName].stateValues.selectedValues,
          ).eqls([choices[choiceOrder[2] - 1]]);
        });

        cy.get("#" + cesc2(choiceInputName) + `_choice1_input`).click();
        cy.get("#" + cesc2(choiceInputName) + "_submit").click();
        cy.get(cesc("#\\/sr")).should("have.text", choices[choiceOrder[0] - 1]);

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(
            stateVariables[choiceInputName].stateValues.selectedValues,
          ).eqls([choices[choiceOrder[0] - 1]]);
        });
      });
    }

    cy.log("7th variant repeats first order");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_newAttempt").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    let ind = 7;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceInputName =
        stateVariables["/ans"].stateValues.inputChildren[0].componentName;
      let choiceOrder = stateVariables[choiceInputName].stateValues.choiceOrder;
      let selectedOrder = choiceOrder.join(",");
      expect(selectedOrder).eq(ordersFound[0]);
    });
  });

  it("shuffled choiceinput with selectFromSequence in choices", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <choiceinput name="ci" shuffleOrder>
      <choice><selectFromSequence from="1" to="2" assignNames="n" /></choice>
      <choice><selectFromSequence type="letters" from="a" to="b" assignNames="l" /></choice>
    </choiceinput>
    <p>Selected value: <copy prop='selectedvalue' target="ci" assignNames="selectedValue" /></p>
    `;

    let selectionsFound = [];

    cy.log("get all options in first 8 variants");
    for (let ind = 1; ind <= 8; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
        let n = stateVariables["/n"].stateValues.value;
        let l = stateVariables["/l"].stateValues.value;
        let choices = [n.toString(), l];
        let selectedOption = [...choiceOrder, ...choices].join(",");
        expect(selectionsFound.includes(selectedOption)).eq(false);
        selectionsFound.push(selectedOption);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h"]);

        for (let i = 0; i < 2; i++) {
          cy.get(cesc(`#\\/ci_choice${i + 1}_input`)).click();
          cy.get(cesc("#\\/selectedValue")).should(
            "have.text",
            choices[choiceOrder[i] - 1],
          );
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
              choices[choiceOrder[i] - 1],
            ]);
          });
        }

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/ci"];
          }),
        );

        cy.get(cesc("#\\/selectedValue")).should(
          "have.text",
          choices[choiceOrder[1] - 1],
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
            choices[choiceOrder[1] - 1],
          ]);
        });

        cy.get(cesc(`#\\/ci_choice1_input`)).click();
        cy.get(cesc("#\\/selectedValue")).should(
          "have.text",
          choices[choiceOrder[0] - 1],
        );

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
            choices[choiceOrder[0] - 1],
          ]);
        });
      });
    }

    cy.log("9th variant repeats first order");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_newAttempt").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    let ind = 9;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
      let n = stateVariables["/n"].stateValues.value;
      let l = stateVariables["/l"].stateValues.value;
      let choices = [n.toString(), l];
      let selectedOption = [...choiceOrder, ...choices].join(",");
      expect(selectedOption).eq(selectionsFound[0]);
    });
  });

  it("shuffle", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <p name="pList"><aslist><shuffle name="sh">
      <text>red</text>
      <text>blue</text>
      <text>green</text>
    </shuffle></aslist></p>
    <p><booleanInput name="bi" /><boolean name="b" copySource="bi" /></p>

    `;

    let ordersFound = [];
    let colors = ["red", "blue", "green"];

    cy.log("get all orders in first 6 variants");
    for (let ind = 1; ind <= 6; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let componentOrder = stateVariables["/sh"].stateValues.componentOrder;
        expect([...componentOrder].sort()).eqls([1, 2, 3]);

        let selectedOrder = componentOrder.join(",");
        expect(ordersFound.includes(selectedOrder)).eq(false);
        ordersFound.push(selectedOrder);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        cy.get(cesc("#\\/pList")).should(
          "have.text",
          componentOrder.map((x) => colors[x - 1]).join(", "),
        );

        // check reloading for just one variant
        if (ind === 4) {
          cy.get(cesc("#\\/bi")).click();
          cy.get(cesc("#\\/b")).should("have.text", "true");

          cy.wait(1500); // wait for 1 second debounce
          cy.reload();

          cy.window().then(async (win) => {
            win.postMessage(
              {
                doenetML: `<text>${ind}</text>${doenetML}`,
                requestedVariantIndex: ind,
              },
              "*",
            );
          });

          // to wait for page to load
          cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

          cy.get(cesc("#\\/b")).should("have.text", "true");
          cy.get(cesc("#\\/bi")).click();
          cy.get(cesc("#\\/b")).should("have.text", "false");

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/sh"].stateValues.componentOrder).eqls(
              componentOrder,
            );
          });
        }
      });
    }

    cy.log("7th variant repeats first order");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_newAttempt").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    let ind = 7;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;
      let selectedOrder = componentOrder.join(",");
      expect(selectedOrder).eq(ordersFound[0]);

      cy.get(cesc("#\\/pList")).should(
        "have.text",
        componentOrder.map((x) => colors[x - 1]).join(", "),
      );
    });
  });

  it("shuffle, copy in components", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <text name="red">red</text>
    <group name="twoColors">
      <text>blue</text>
      <text>green</text>
    </group>
    <p name="pList"><aslist><shuffle name="sh">
      <text copySource="red" />
      <copy source="twoColors" createComponentOfType="text" nComponents="2" />
    </shuffle></aslist></p>
    <p><booleanInput name="bi" /><boolean name="b" copySource="bi" /></p>

    `;

    let ordersFound = [];
    let colors = ["red", "blue", "green"];

    cy.log("get all orders in first 6 variants");
    for (let ind = 1; ind <= 6; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let componentOrder = stateVariables["/sh"].stateValues.componentOrder;
        expect([...componentOrder].sort()).eqls([1, 2, 3]);

        let selectedOrder = componentOrder.join(",");
        expect(ordersFound.includes(selectedOrder)).eq(false);
        ordersFound.push(selectedOrder);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        cy.get(cesc("#\\/pList")).should(
          "have.text",
          componentOrder.map((x) => colors[x - 1]).join(", "),
        );

        // check reloading for just one variant
        if (ind === 4) {
          cy.get(cesc("#\\/bi")).click();
          cy.get(cesc("#\\/b")).should("have.text", "true");

          cy.wait(1500); // wait for 1 second debounce
          cy.reload();

          cy.window().then(async (win) => {
            win.postMessage(
              {
                doenetML: `<text>${ind}</text>${doenetML}`,
                requestedVariantIndex: ind,
              },
              "*",
            );
          });

          // to wait for page to load
          cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

          cy.get(cesc("#\\/b")).should("have.text", "true");
          cy.get(cesc("#\\/bi")).click();
          cy.get(cesc("#\\/b")).should("have.text", "false");

          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/sh"].stateValues.componentOrder).eqls(
              componentOrder,
            );
          });
        }
      });
    }

    cy.log("7th variant repeats first order");
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_newAttempt").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();
    cy.reload();

    let ind = 7;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `<text>${ind}</text>${doenetML}`,
          requestedVariantIndex: ind,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      let componentOrder = stateVariables["/sh"].stateValues.componentOrder;
      let selectedOrder = componentOrder.join(",");
      expect(selectedOrder).eq(ordersFound[0]);

      cy.get(cesc("#\\/pList")).should(
        "have.text",
        componentOrder.map((x) => colors[x - 1]).join(", "),
      );
    });
  });

  it("document and problems with unique variants", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <variantControl uniquevariants />
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="1" to="2" assignNames="m" />:
        <answer>$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="3" to="5" assignNames="n" />:
        <answer>$n</answer>
      </p>
    </problem>
    `;

    cy.log("get all 6 options and then they repeat");
    for (let ind = 1; ind <= 8; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      let m = ((ind - 1) % 2) + 1;
      let n = ((ind - 1) % 3) + 3;

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let mathinputName = cesc2(
          stateVariables["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinputAnchor = "#" + mathinputName + " textarea";
        let mathinputEditiableFieldAnchor =
          "#" + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
        let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
        let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

        let mathinput2Name = cesc2(
          stateVariables["/_answer2"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinput2Anchor = "#" + mathinput2Name + " textarea";
        let mathinput2EditiableFieldAnchor =
          "#" + mathinput2Name + " .mq-editable-field";
        let mathinput2SubmitAnchor = "#" + mathinput2Name + "_submit";
        let mathinput2CorrectAnchor = "#" + mathinput2Name + "_correct";
        let mathinput2IncorrectAnchor = "#" + mathinput2Name + "_incorrect";

        expect(stateVariables["/m"].stateValues.value).eq(m);
        expect(stateVariables["/n"].stateValues.value).eq(n);

        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f"]);

        cy.get(mathinputAnchor).type(`${m}{enter}`, { force: true });
        cy.get(mathinput2Anchor).type(`${n}{enter}`, { force: true });

        cy.get(mathinputCorrectAnchor).should("be.visible");
        cy.get(mathinput2CorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n]);
        });

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/_answer1"];
          }),
        );

        cy.get(mathinputEditiableFieldAnchor).should("contain.text", `${m}`);
        cy.get(mathinput2EditiableFieldAnchor).should("contain.text", `${n}`);
        cy.get(mathinputCorrectAnchor).should("be.visible");
        cy.get(mathinput2CorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n]);
        });

        cy.get(mathinputAnchor).type(`{end}1`, { force: true });
        cy.get(mathinput2Anchor).type(`{end}1`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinput2SubmitAnchor).click();
        cy.get(mathinputIncorrectAnchor).should("be.visible");
        cy.get(mathinput2IncorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m * 10 + 1]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n * 10 + 1]);
        });

        cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinput2Anchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinput2SubmitAnchor).click();
        cy.get(mathinputCorrectAnchor).should("be.visible");
        cy.get(mathinput2CorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n]);
        });
      });
    }
  });

  it("problems with unique variants, but not document", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    let doenetML = `
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="1" to="2" assignNames="m" />:
        <answer>$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="3" to="5" assignNames="n" />:
        <answer>$n</answer>
      </p>
    </problem>
    `;

    cy.log("get randomly chosen options for each problem");
    for (let ind = 1; ind <= 3; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `<text>${ind}</text>${doenetML}`,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let mathinputName = cesc2(
          stateVariables["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinputAnchor = "#" + mathinputName + " textarea";
        let mathinputEditiableFieldAnchor =
          "#" + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
        let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
        let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

        let mathinput2Name = cesc2(
          stateVariables["/_answer2"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinput2Anchor = "#" + mathinput2Name + " textarea";
        let mathinput2EditiableFieldAnchor =
          "#" + mathinput2Name + " .mq-editable-field";
        let mathinput2SubmitAnchor = "#" + mathinput2Name + "_submit";
        let mathinput2CorrectAnchor = "#" + mathinput2Name + "_correct";
        let mathinput2IncorrectAnchor = "#" + mathinput2Name + "_incorrect";

        let m =
          stateVariables["/_problem1"].stateValues.generatedVariantInfo.index;
        let n =
          stateVariables["/_problem2"].stateValues.generatedVariantInfo.index +
          2;

        expect(m).gte(1);
        expect(m).lte(2);
        expect(n).gte(3);
        expect(n).lte(5);

        expect(stateVariables["/m"].stateValues.value).eq(m);
        expect(stateVariables["/n"].stateValues.value).eq(n);

        cy.get(mathinputAnchor).type(`${m}{enter}`, { force: true });
        cy.get(mathinput2Anchor).type(`${n}{enter}`, { force: true });

        cy.get(mathinputCorrectAnchor).should("be.visible");
        cy.get(mathinput2CorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n]);
        });

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML: `<text>${ind}</text>${doenetML}`,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/_answer1"];
          }),
        );

        cy.get(mathinputEditiableFieldAnchor).should("contain.text", `${m}`);
        cy.get(mathinput2EditiableFieldAnchor).should("contain.text", `${n}`);
        cy.get(mathinputCorrectAnchor).should("be.visible");
        cy.get(mathinput2CorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n]);
        });

        cy.get(mathinputAnchor).type(`{end}1`, { force: true });
        cy.get(mathinput2Anchor).type(`{end}1`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinput2SubmitAnchor).click();
        cy.get(mathinputIncorrectAnchor).should("be.visible");
        cy.get(mathinput2IncorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(0);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m * 10 + 1]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n * 10 + 1]);
        });

        cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinput2Anchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinput2SubmitAnchor).click();
        cy.get(mathinputCorrectAnchor).should("be.visible");
        cy.get(mathinput2CorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(stateVariables["/_answer2"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
          expect(
            stateVariables["/_answer2"].stateValues.submittedResponses,
          ).eqls([n]);
        });
      });
    }
  });

  it("document inherits variants from single problem with unique variants", () => {
    cy.get("#testRunner_toggleControls").click();
    cy.get("#testRunner_allowLocalState").click();
    cy.wait(100);
    cy.get("#testRunner_toggleControls").click();

    cy.log("get all 3 options and then they repeat");
    for (let ind = 1; ind <= 4; ind++) {
      if (ind > 1) {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_newAttempt").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
        cy.reload();
      }

      let doenetML = `
      <problem>
        <variantControl uniqueVariants variantNames="five six seven" />
        <p>Enter <selectFromSequence from="5" to="7" assignNames="m" />:
          <answer>$m</answer>
        </p>
        <text>${ind}</text>
      </problem>
      `;

      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      let m = ((ind - 1) % 3) + 5;

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();

        let mathinputName = cesc2(
          stateVariables["/_answer1"].stateValues.inputChildren[0]
            .componentName,
        );
        let mathinputAnchor = "#" + mathinputName + " textarea";
        let mathinputEditiableFieldAnchor =
          "#" + mathinputName + " .mq-editable-field";
        let mathinputSubmitAnchor = "#" + mathinputName + "_submit";
        let mathinputCorrectAnchor = "#" + mathinputName + "_correct";
        let mathinputIncorrectAnchor = "#" + mathinputName + "_incorrect";

        expect(stateVariables["/m"].stateValues.value).eq(m);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["five", "six", "seven"]);
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
          ["five", "six", "seven"][(ind - 1) % 3],
        );

        cy.get(mathinputAnchor).type(`${m}{enter}`, { force: true });

        cy.get(mathinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
        });

        cy.wait(1500); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
          win.postMessage(
            {
              doenetML,
              requestedVariantIndex: ind,
            },
            "*",
          );
        });

        // to wait for page to load
        cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

        // wait until core is loaded
        cy.waitUntil(() =>
          cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            return stateVariables["/_answer1"];
          }),
        );

        cy.get(mathinputEditiableFieldAnchor).should("contain.text", `${m}`);
        cy.get(mathinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
        });

        cy.get(mathinputAnchor).type(`{end}1`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinputIncorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(0);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m * 10 + 1]);
        });

        cy.get(mathinputAnchor).type(`{end}{backspace}`, { force: true });
        cy.get(mathinputSubmitAnchor).click();
        cy.get(mathinputCorrectAnchor).should("be.visible");

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/_answer1"].stateValues.creditAchieved).eq(1);
          expect(
            stateVariables["/_answer1"].stateValues.submittedResponses,
          ).eqls([m]);
        });
      });
    }
  });

  it("no variant control, 1 unique variant", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
        <text>a</text>
        hello!
      `,
        },
        "*",
      );
    });
    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `a`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a"]);
    });
  });

  it("no variant control, single select", () => {
    let values = ["u", "v", "w"];

    cy.log("get all values in order and they repeat in next variants");
    for (let ind = 1; ind <= 4; ind++) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <select assignnames="x">u v w</select>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/x") + " .mjx-mrow").should(
        "have.text",
        values[(ind - 1) % 3],
      );

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(
          values[(ind - 1) % 3],
        );
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c"]);
      });
    }
  });

  it("no variant control, select and selectFromSequence", () => {
    let values = ["u", "v", "w"];

    cy.log("get first values in order");
    for (let ind = 1; ind <= 3; ind++) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <select assignnames="x">u v w</select>
        <selectfromsequence assignNames="n" />
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/x") + " .mjx-mrow").should("have.text", values[ind - 1]);
      cy.get(cesc("#\\/n")).should("have.text", ind.toString());

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/x"].stateValues.value).eq(values[ind - 1]);
        expect(stateVariables["/n"].stateValues.value).eq(ind);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants
            .length,
        ).eq(30);
      });
    }
  });

  it("no variant control, 100 is still unique variants", () => {
    cy.log("get first values in order");
    for (let ind = 1; ind <= 5; ind++) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <selectfromsequence assignNames="n" length="100" />
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.get(cesc("#\\/n")).should("have.text", ind.toString());

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        expect(stateVariables["/n"].stateValues.value).eq(ind);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants
            .length,
        ).eq(100);
      });
    }
  });

  it("no variant control, 101 is not unique variants", () => {
    let foundOneNotInOrder = false;

    cy.log("don't get first values in order");
    for (let ind = 1; ind <= 3; ind++) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <selectfromsequence assignNames="n" length="101" />
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        if (stateVariables["/n"].stateValues.value !== ind) {
          foundOneNotInOrder = true;
        }
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants
            .length,
        ).eq(100);
      });
    }

    cy.window().then(async (win) => {
      expect(foundOneNotInOrder).eq(true);
    });
  });

  it("no variant control, problem with 3 selects", () => {
    // Catch bug in enumerateCombinations
    // where was indirectly overwriting numberOfVariantsByDescendant
    let values = [135, 246, 145, 236, 136, 245, 146, 235];

    cy.log("get each value exactly one");
    let valuesFound = [];
    for (let ind = 1; ind <= 8; ind++) {
      cy.window().then(async (win) => {
        win.postMessage(
          {
            doenetML: `
        <text>${ind}</text>
        <problem>
          <select type="number" assignNames="a">1 2</select>
          <select type="number" assignNames="b">3 4</select>
          <select type="number" assignNames="c">5 6</select>
        </problem>
      `,
            requestedVariantIndex: ind,
          },
          "*",
        );
      });
      // to wait for page to load
      cy.get(cesc("#\\/_text1")).should("have.text", `${ind}`);

      cy.window().then(async (win) => {
        let stateVariables = await win.returnAllStateVariables1();
        let a = stateVariables["/a"].stateValues.value;
        let b = stateVariables["/b"].stateValues.value;
        let c = stateVariables["/c"].stateValues.value;

        let val = a * 100 + b * 10 + c;
        valuesFound.push(val);
        expect(
          stateVariables["/_document1"].sharedParameters.allPossibleVariants
            .length,
        ).eq(8);

        cy.get(cesc("#\\/a")).should("have.text", a.toString());
        cy.get(cesc("#\\/b")).should("have.text", b.toString());
        cy.get(cesc("#\\/c")).should("have.text", c.toString());
      });
    }
    cy.window().then((win) => {
      expect([...valuesFound].sort((a, b) => a - b)).eqls(
        [...values].sort((a, b) => a - b),
      );
    });
  });

  it("variantsToInclude and variantsToExclude", () => {
    cy.log("get two variants with no include/exclude");

    let baseDoenetMLa = `
    <variantControl nVariants="10" variantNames="first second" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>2</text" + baseDoenetMLa,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>5</text" + baseDoenetMLa,
          requestedVariantIndex: 5,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "5",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log("get same variants when add variantsToInclude");

    let baseDoenetMLb = `
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="second e" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>1</text" + baseDoenetMLb,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `1`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>2</text" + baseDoenetMLb,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "5",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log("get same variants when add variantsToExclude");

    let baseDoenetMLc = `
    <variantControl nVariants="10" variantNames="first second" variantsToExclude="first d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>1</text" + baseDoenetMLc,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `1`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>3</text" + baseDoenetMLc,
          requestedVariantIndex: 3,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `3`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "5",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log(
      "get same variants when add variantsToInclude and variantsToExclude",
    );

    let baseDoenetMLd = `
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="first second d e g h" variantsToExclude="first c d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>1</text" + baseDoenetMLd,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `1`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>2</text" + baseDoenetMLd,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "5",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });
  });

  it("variantsToInclude and variantsToExclude in problem as only child", () => {
    cy.log("get two variants with no include/exclude");

    let baseDoenetMLa = `
    <problem>
    <variantControl nVariants="10" variantNames="first second" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLa,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLa,
          requestedVariantIndex: 5,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "5",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log("get same variants when add variantsToInclude");

    let baseDoenetMLb = `
    <problem>
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="second e" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLb,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "1",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLb,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log("get same variants when add variantsToExclude");

    let baseDoenetMLc = `
    <problem>
    <variantControl nVariants="10" variantNames="first second" variantsToExclude="first d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLc,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "1",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLc,
          requestedVariantIndex: 3,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "3",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log(
      "get same variants when add variantsToInclude and variantsToExclude",
    );

    let baseDoenetMLd = `
    <problem>
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="first second d e g h" variantsToExclude="first c d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLd,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "1",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLd,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });
  });

  it("variantsToInclude and variantsToExclude in problem, extra child", () => {
    cy.log("get two variants with no include/exclude");

    let baseDoenetMLa = `
    Hello!
    <problem>
    <variantControl nVariants="10" variantNames="first second" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    let allDocVariants = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "aa",
      "ab",
      "ac",
      "ad",
      "ae",
      "af",
      "ag",
      "ah",
      "ai",
      "aj",
      "ak",
      "al",
      "am",
      "an",
      "ao",
      "ap",
      "aq",
      "ar",
      "as",
      "at",
      "au",
      "av",
      "aw",
      "ax",
      "ay",
      "az",
      "ba",
      "bb",
      "bc",
      "bd",
      "be",
      "bf",
      "bg",
      "bh",
      "bi",
      "bj",
      "bk",
      "bl",
      "bm",
      "bn",
      "bo",
      "bp",
      "bq",
      "br",
      "bs",
      "bt",
      "bu",
      "bv",
      "bw",
      "bx",
      "by",
      "bz",
      "ca",
      "cb",
      "cc",
      "cd",
      "ce",
      "cf",
      "cg",
      "ch",
      "ci",
      "cj",
      "ck",
      "cl",
      "cm",
      "cn",
      "co",
      "cp",
      "cq",
      "cr",
      "cs",
      "ct",
      "cu",
      "cv",
    ];

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLa,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "b",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLa,
          requestedVariantIndex: 5,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "5",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "e",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(5);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log("get same variants when add variantsToInclude");

    let baseDoenetMLb = `
    Hello!
    <problem>
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="second e" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLb,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "1",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "a",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLb,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "b",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log("get same variants when add variantsToExclude");

    let baseDoenetMLc = `
    Hello!
    <problem>
    <variantControl nVariants="10" variantNames="first second" variantsToExclude="first d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLc,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "1",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "a",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b", "c", "d", "e", "f"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLc,
          requestedVariantIndex: 3,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "3",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "c",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b", "c", "d", "e", "f"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(3);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "c", "e", "f", "g", "i"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.log(
      "get same variants when add variantsToInclude and variantsToExclude",
    );

    let baseDoenetMLd = `
    Hello!
    <problem>
    <variantControl nVariants="10" variantNames="first second" variantsToInclude="first second d e g h" variantsToExclude="first c d h j" />
    Selected number: 
    <selectfromsequence assignnames="n" length="10" />
    </problem>
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLd,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "1",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "a",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b", "c"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("2");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq(
        "second",
      );
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: baseDoenetMLd,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/n")).should("have.text", `5`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(5);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "2",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "b",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["a", "b", "c"]);
      expect(
        stateVariables["/_document1"].sharedParameters.allVariantNames,
      ).eqls(allDocVariants);
      expect(stateVariables["/_problem1"].sharedParameters.variantSeed).eq("5");
      expect(stateVariables["/_problem1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_problem1"].sharedParameters.variantName).eq("e");
      expect(
        stateVariables["/_problem1"].sharedParameters.allPossibleVariants,
      ).eqls(["second", "e", "g"]);
      expect(
        stateVariables["/_problem1"].sharedParameters.allVariantNames,
      ).eqls(["first", "second", "c", "d", "e", "f", "g", "h", "i", "j"]);
    });
  });

  it("unique variants determined by nVariants specified, even with variantsToInclude and variantsToExclude", () => {
    cy.log("unique variants when nVariants is 1000");

    let baseDoenetMLa = `
    <variantControl nVariants="1000" variantsToInclude="b t ax cv" variantsToExclude="b ax" />
    Selected number: 
    <selectfromsequence assignnames="n" length="1000" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>1</text" + baseDoenetMLa,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `1`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(20);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "20",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "t",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["t", "cv"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>2</text" + baseDoenetMLa,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).eq(100);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "100",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "cv",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["t", "cv"]);
    });

    cy.log("non-unique variants when nVariants is 100");

    let baseDoenetMLb = `
    <variantControl nVariants="100" variantsToInclude="b t ax cv" variantsToExclude="b ax" />
    Selected number: 
    <selectfromsequence assignnames="n" length="1000" />
    `;

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>1</text" + baseDoenetMLb,
          requestedVariantIndex: 1,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `1`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).not.eq(20);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "20",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(1);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "t",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["t", "cv"]);
    });

    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: "<text>2</text" + baseDoenetMLb,
          requestedVariantIndex: 2,
        },
        "*",
      );
    });

    // to wait for page to load
    cy.get(cesc("#\\/_text1")).should("have.text", `2`);

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/n"].stateValues.value).not.eq(100);
      expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
        "100",
      );
      expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(2);
      expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
        "cv",
      );
      expect(
        stateVariables["/_document1"].sharedParameters.allPossibleVariants,
      ).eqls(["t", "cv"]);
    });
  });
});
