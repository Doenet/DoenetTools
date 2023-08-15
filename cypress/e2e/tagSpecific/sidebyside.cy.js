import { cesc, cesc2 } from "../../../../src/utils/url";

describe("SideBySide Tag Tests", function () {
  beforeEach(() => {
    cy.clearIndexedDB();
    cy.visit("/src/Tools/cypressTest/");
  });

  let checkSingleColumnSbs = async function ({
    specifiedWidth = null,
    specifiedMargins = [null, null],
    specifiedValign = null,
    sbsWidth,
    sbsName = "/sbs",
    isSbsGroup = false,
    widthValueName = "/w1a",
    leftMarginValueName = "/m1a",
    rightMarginValueName = "/m2a",
    valignValueName = "/v1a",
    ignoreInitialDOMChecks = false,
  }) {
    let actualWidth = specifiedWidth;
    let actualLeftMargin = specifiedMargins[0];
    let actualRightMargin = specifiedMargins[1];

    if (actualWidth === null) {
      if (actualLeftMargin === null) {
        if (actualRightMargin === null) {
          actualWidth = 100;
          actualLeftMargin = actualRightMargin = 0;
        } else {
          actualLeftMargin = 0;
          actualWidth = Math.max(0, 100 - actualRightMargin);
        }
      } else {
        if (actualRightMargin === null) {
          actualRightMargin = 0;
          actualWidth = Math.max(0, 100 - actualLeftMargin);
        } else {
          actualWidth = Math.max(0, 100 - actualLeftMargin - actualRightMargin);
        }
      }
    } else {
      if (actualLeftMargin === null) {
        if (actualRightMargin === null) {
          actualLeftMargin = actualRightMargin = Math.max(
            0,
            (100 - actualWidth) / 2,
          );
        } else {
          actualLeftMargin = Math.max(0, 100 - actualWidth - actualRightMargin);
        }
      } else {
        if (actualRightMargin === null) {
          actualRightMargin = Math.max(0, 100 - actualWidth - actualLeftMargin);
        }
      }
    }

    let originalTotal = actualWidth + actualLeftMargin + actualRightMargin;

    if (originalTotal > 100) {
      // rescale to 100
      let rescale = 100 / originalTotal;
      actualWidth *= rescale;
      actualLeftMargin *= rescale;
      actualRightMargin *= rescale;
    } else if (originalTotal < 100) {
      // add to right margin
      actualRightMargin += 100 - originalTotal;
    }

    let valign = specifiedValign ? specifiedValign : "top";

    if (!ignoreInitialDOMChecks) {
      cy.get(cesc2("#" + widthValueName)).should(
        "contain.text",
        Math.trunc(actualWidth),
      );
      cy.get(cesc2("#" + leftMarginValueName)).should(
        "contain.text",
        Math.trunc(actualLeftMargin),
      );
      cy.get(cesc2("#" + rightMarginValueName)).should(
        "contain.text",
        Math.trunc(actualRightMargin),
      );
      cy.get(cesc2("#" + valignValueName)).should("have.text", valign);
    }

    if (!isSbsGroup) {
      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(1)`)
        .invoke("width")
        .then((width) => {
          expect(Number(width)).closeTo((sbsWidth * actualWidth) / 100, 0.1);
        });

      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(1)`)
        .invoke("css", "margin-left")
        .then((margin) => {
          expect(parseFloat(margin)).closeTo(
            (sbsWidth * actualLeftMargin) / 100,
            0.1,
          );
        });

      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(1)`)
        .invoke("css", "margin-right")
        .then((margin) => {
          expect(parseFloat(margin)).closeTo(
            (sbsWidth * actualRightMargin) / 100,
            0.1,
          );
        });
    }

    let specifiedWidthName = isSbsGroup
      ? "specifiedWidths"
      : "allWidthsSpecified";
    let specifiedMarginName = isSbsGroup
      ? "specifiedMargins"
      : "allMarginsSpecified";

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[sbsName].stateValues.widths.length).eq(1);
      expect(stateVariables[sbsName].stateValues[specifiedWidthName]).eqls([
        specifiedWidth,
      ]);
      expect(stateVariables[sbsName].stateValues.widths[0]).closeTo(
        actualWidth,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues[specifiedMarginName]).eqls(
        specifiedMargins,
      );
      expect(stateVariables[sbsName].stateValues.margins.length).eq(2);
      expect(stateVariables[sbsName].stateValues.margins[0]).closeTo(
        actualLeftMargin,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.margins[1]).closeTo(
        actualRightMargin,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.valigns).eqls([valign]);
    });
  };

  let checkTwoColumnSbs = function ({
    specifiedWidths = [null, null],
    specifiedMargins = [null, null],
    specifiedValigns = [null, null],
    sbsWidth,
    sbsName = "/sbs",
    isSbsGroup = false,
    leftWidthValueName = "/w1a",
    rightWidthValueName = "/w2a",
    leftMarginValueName = "/m1a",
    rightMarginValueName = "/m2a",
    leftValignValueName = "/v1a",
    rightValignValueName = "/v2a",
    ignoreInitialDOMChecks = false,
  }) {
    let actualWidth1 = specifiedWidths[0];
    let actualWidth2 = specifiedWidths[1];
    let actualLeftMargin = specifiedMargins[0];
    let actualRightMargin = specifiedMargins[1];
    let actualGap = 0;

    if (actualWidth1 === null) {
      if (actualWidth2 === null) {
        if (actualLeftMargin === null) {
          if (actualRightMargin === null) {
            actualWidth1 = actualWidth2 = 50;
            actualLeftMargin = actualRightMargin = 0;
          } else {
            actualWidth1 = actualWidth2 = Math.max(
              0,
              (100 - 2 * actualRightMargin) / 2,
            );
            actualLeftMargin = 0;
          }
        } else {
          if (actualRightMargin === null) {
            actualWidth1 = actualWidth2 = Math.max(
              0,
              (100 - 2 * actualLeftMargin) / 2,
            );
            actualRightMargin = 0;
          } else {
            actualWidth1 = actualWidth2 = Math.max(
              0,
              (100 - 2 * (actualLeftMargin + actualRightMargin)) / 2,
            );
          }
        }
      } else {
        if (actualLeftMargin === null) {
          if (actualRightMargin === null) {
            actualWidth1 = Math.max(0, 100 - actualWidth2);
            actualLeftMargin = actualRightMargin = 0;
          } else {
            actualWidth1 = Math.max(
              0,
              100 - actualWidth2 - 2 * actualRightMargin,
            );
            actualLeftMargin = 0;
          }
        } else {
          if (actualRightMargin === null) {
            actualWidth1 = Math.max(
              0,
              100 - actualWidth2 - 2 * actualLeftMargin,
            );
            actualRightMargin = 0;
          } else {
            actualWidth1 = Math.max(
              0,
              100 - actualWidth2 - 2 * (actualLeftMargin + actualRightMargin),
            );
          }
        }
      }
    } else {
      if (actualWidth2 === null) {
        if (actualLeftMargin === null) {
          if (actualRightMargin === null) {
            actualWidth2 = Math.max(0, 100 - actualWidth1);
            actualLeftMargin = actualRightMargin = 0;
          } else {
            actualWidth2 = Math.max(
              0,
              100 - actualWidth1 - 2 * actualRightMargin,
            );
            actualLeftMargin = 0;
          }
        } else {
          if (actualRightMargin === null) {
            actualWidth2 = Math.max(
              0,
              100 - actualWidth1 - 2 * actualLeftMargin,
            );
            actualRightMargin = 0;
          } else {
            actualWidth2 = Math.max(
              0,
              100 - actualWidth1 - 2 * (actualLeftMargin + actualRightMargin),
            );
          }
        }
      } else {
        if (actualLeftMargin === null) {
          if (actualRightMargin === null) {
            actualLeftMargin = actualRightMargin = Math.max(
              0,
              (100 - actualWidth1 - actualWidth2) / 4,
            );
          } else {
            actualLeftMargin = Math.max(
              0,
              (100 - actualWidth1 - actualWidth2 - 2 * actualRightMargin) / 2,
            );
          }
        } else {
          if (actualRightMargin === null) {
            actualRightMargin = Math.max(
              0,
              (100 - actualWidth1 - actualWidth2 - 2 * actualLeftMargin) / 2,
            );
          }
        }
      }
    }

    let originalTotal =
      actualWidth1 + actualWidth2 + 2 * (actualLeftMargin + actualRightMargin);

    if (originalTotal > 100) {
      // rescale to 100
      let rescale = 100 / originalTotal;
      actualWidth1 *= rescale;
      actualWidth2 *= rescale;
      actualLeftMargin *= rescale;
      actualRightMargin *= rescale;
    } else if (originalTotal < 100) {
      // add to gap
      actualGap = 100 - originalTotal;
    }

    let valigns = [
      specifiedValigns[0] ? specifiedValigns[0] : "top",
      specifiedValigns[1] ? specifiedValigns[1] : "top",
    ];

    if (!ignoreInitialDOMChecks) {
      cy.get(cesc2("#" + leftWidthValueName)).should(
        "contain.text",
        Math.trunc(actualWidth1),
      );
      cy.get(cesc2("#" + rightWidthValueName)).should(
        "contain.text",
        Math.trunc(actualWidth2),
      );
      cy.get(cesc2("#" + leftMarginValueName)).should(
        "contain.text",
        Math.trunc(actualLeftMargin),
      );
      cy.get(cesc2("#" + rightMarginValueName)).should(
        "contain.text",
        Math.trunc(actualRightMargin),
      );
      cy.get(cesc2("#" + leftValignValueName)).should("have.text", valigns[0]);
      cy.get(cesc2("#" + rightValignValueName)).should("have.text", valigns[1]);
    }

    if (!isSbsGroup) {
      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(1)`)
        .invoke("width")
        .then((width) => {
          expect(Number(width)).closeTo((sbsWidth * actualWidth1) / 100, 0.1);
        });
      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(1)`)
        .invoke("css", "margin-left")
        .then((margin) => {
          expect(parseFloat(margin)).closeTo(
            (sbsWidth * actualLeftMargin) / 100,
            0.1,
          );
        });
      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(1)`)
        .invoke("css", "margin-right")
        .then((margin) => {
          expect(parseFloat(margin)).closeTo(
            (sbsWidth * (actualRightMargin + actualGap / 2)) / 100,
            0.1,
          );
        });

      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(2)`)
        .invoke("width")
        .then((width) => {
          expect(Number(width)).closeTo((sbsWidth * actualWidth2) / 100, 0.1);
        });
      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(2)`)
        .invoke("css", "margin-left")
        .then((margin) => {
          expect(parseFloat(margin)).closeTo(
            (sbsWidth * (actualLeftMargin + actualGap / 2)) / 100,
            0.1,
          );
        });
      cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(2)`)
        .invoke("css", "margin-right")
        .then((margin) => {
          expect(parseFloat(margin)).closeTo(
            (sbsWidth * actualRightMargin) / 100,
            0.1,
          );
        });
    }

    let specifiedWidthName = isSbsGroup
      ? "specifiedWidths"
      : "allWidthsSpecified";
    let specifiedMarginName = isSbsGroup
      ? "specifiedMargins"
      : "allMarginsSpecified";

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[sbsName].stateValues[specifiedWidthName]).eqls(
        specifiedWidths,
      );
      expect(stateVariables[sbsName].stateValues.widths.length).eq(2);
      expect(stateVariables[sbsName].stateValues.widths[0]).closeTo(
        actualWidth1,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.widths[1]).closeTo(
        actualWidth2,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues[specifiedMarginName]).eqls(
        specifiedMargins,
      );
      expect(stateVariables[sbsName].stateValues.margins.length).eq(2);
      expect(stateVariables[sbsName].stateValues.margins[0]).closeTo(
        actualLeftMargin,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.margins[1]).closeTo(
        actualRightMargin,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.gapWidth).closeTo(
        actualGap,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.valigns).eqls(valigns);
    });
  };

  let checkFourColumnSbs = function ({
    specifiedWidths = [null, null, null, null],
    specifiedMargins = [null, null],
    specifiedValigns = [null, null, null, null],
    sbsWidth,
    sbsName = "/sbs",
    isSbsGroup = false,
    width1ValueName = "/w1a",
    width2ValueName = "/w2a",
    width3ValueName = "/w3a",
    width4ValueName = "/w4a",
    leftMarginValueName = "/m1a",
    rightMarginValueName = "/m2a",
    valign1ValueName = "/v1a",
    valign2ValueName = "/v2a",
    valign3ValueName = "/v3a",
    valign4ValueName = "/v4a",
    ignoreInitialDOMChecks = false,
  }) {
    let totalWidthSpecified = 0;
    let nWidthsUndefined = 0;

    for (let ind = 0; ind < 4; ind++) {
      let width = specifiedWidths[ind];
      if (width === null) {
        nWidthsUndefined++;
      } else {
        totalWidthSpecified += width;
      }
    }

    let totalMarginSpecified = 0;
    let nMarginsUndefined = 0;

    for (let ind = 0; ind < 2; ind++) {
      let margin = specifiedMargins[ind];
      if (margin === null) {
        nMarginsUndefined++;
      } else {
        totalMarginSpecified += margin;
      }
    }
    totalMarginSpecified *= 4;

    let actualWidths = [...specifiedWidths];
    let actualMargins = [...specifiedMargins];
    let actualGap = 0;

    if (totalWidthSpecified + totalMarginSpecified >= 100) {
      // we are already over 100%
      // anything null becomes width 0
      // everything else is normalized to add up to 100

      let normalization = 100 / (totalWidthSpecified + totalMarginSpecified);
      for (let ind = 0; ind < 4; ind++) {
        if (actualWidths[ind] === null) {
          actualWidths[ind] = 0;
        } else {
          actualWidths[ind] *= normalization;
        }
      }
      for (let ind = 0; ind < 2; ind++) {
        if (actualMargins[ind] === null) {
          actualMargins[ind] = 0;
        } else {
          actualMargins[ind] *= normalization;
        }
      }
    } else {
      // since we are under 100%, we try the following to get to 100%
      // 1. if there are any null widths,
      //    define them to be the same value that makes the total 100%
      //    and make any null margins be zero
      // 2. else, if there are any null margins,
      //    define them to be the same value that makes the total 100%
      // 3. else set gapWidth to make the total 100%

      if (nWidthsUndefined > 0) {
        let newWidth =
          (100 - (totalWidthSpecified + totalMarginSpecified)) /
          nWidthsUndefined;
        for (let ind = 0; ind < 4; ind++) {
          if (actualWidths[ind] === null) {
            actualWidths[ind] = newWidth;
          }
        }

        for (let ind = 0; ind < 2; ind++) {
          let margin = actualMargins[ind];
          if (margin === null) {
            actualMargins[ind] = 0;
          }
        }
      } else if (nMarginsUndefined > 0) {
        let newMargin =
          (100 - (totalWidthSpecified + totalMarginSpecified)) /
          (nMarginsUndefined * 4);
        for (let ind = 0; ind < 2; ind++) {
          if (actualMargins[ind] === null) {
            actualMargins[ind] = newMargin;
          }
        }
      } else {
        actualGap = (100 - (totalWidthSpecified + totalMarginSpecified)) / 3;
      }
    }

    let actualLeftMargin = actualMargins[0];
    let actualRightMargin = actualMargins[1];

    let valigns = specifiedValigns.map((x) => (x ? x : "top"));

    if (!ignoreInitialDOMChecks) {
      cy.get(cesc2("#" + width1ValueName)).should(
        "contain.text",
        Math.trunc(actualWidths[0]),
      );
      cy.get(cesc2("#" + width2ValueName)).should(
        "contain.text",
        Math.trunc(actualWidths[1]),
      );
      cy.get(cesc2("#" + width3ValueName)).should(
        "contain.text",
        Math.trunc(actualWidths[2]),
      );
      cy.get(cesc2("#" + width4ValueName)).should(
        "contain.text",
        Math.trunc(actualWidths[3]),
      );
      cy.get(cesc2("#" + leftMarginValueName)).should(
        "contain.text",
        Math.trunc(actualLeftMargin),
      );
      cy.get(cesc2("#" + rightMarginValueName)).should(
        "contain.text",
        Math.trunc(actualRightMargin),
      );
      cy.get(cesc2("#" + valign1ValueName)).should("have.text", valigns[0]);
      cy.get(cesc2("#" + valign2ValueName)).should("have.text", valigns[1]);
      cy.get(cesc2("#" + valign3ValueName)).should("have.text", valigns[2]);
      cy.get(cesc2("#" + valign4ValueName)).should("have.text", valigns[3]);
    }

    if (!isSbsGroup) {
      for (let col = 0; col < 4; col++) {
        let thisLeftMargin = actualLeftMargin;
        let thisRightMargin = actualRightMargin;

        if (col > 0) {
          thisLeftMargin += actualGap / 2;
        }
        if (col < 3) {
          thisRightMargin += actualGap / 2;
        }

        cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(${col + 1})`)
          .invoke("width")
          .then((width) => {
            expect(Number(width)).closeTo(
              (sbsWidth * actualWidths[col]) / 100,
              0.1,
            );
          });

        cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(${col + 1})`)
          .invoke("css", "margin-left")
          .then((margin) => {
            expect(parseFloat(margin)).closeTo(
              (sbsWidth * thisLeftMargin) / 100,
              0.1,
            );
          });

        cy.get(`${cesc2("#" + sbsName)} > span:nth-of-type(${col + 1})`)
          .invoke("css", "margin-right")
          .then((margin) => {
            expect(parseFloat(margin)).closeTo(
              (sbsWidth * thisRightMargin) / 100,
              0.1,
            );
          });
      }
    }

    let specifiedWidthName = isSbsGroup
      ? "specifiedWidths"
      : "allWidthsSpecified";
    let specifiedMarginName = isSbsGroup
      ? "specifiedMargins"
      : "allMarginsSpecified";

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables[sbsName].stateValues[specifiedWidthName]).eqls(
        specifiedWidths,
      );
      expect(stateVariables[sbsName].stateValues.widths.length).eq(4);
      expect(stateVariables[sbsName].stateValues.widths[0]).closeTo(
        actualWidths[0],
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.widths[1]).closeTo(
        actualWidths[1],
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.widths[2]).closeTo(
        actualWidths[2],
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.widths[3]).closeTo(
        actualWidths[3],
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues[specifiedMarginName]).eqls(
        specifiedMargins,
      );
      expect(stateVariables[sbsName].stateValues.margins.length).eq(2);
      expect(stateVariables[sbsName].stateValues.margins[0]).closeTo(
        actualLeftMargin,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.margins[1]).closeTo(
        actualRightMargin,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.gapWidth).closeTo(
        actualGap,
        1e-5,
      );
      expect(stateVariables[sbsName].stateValues.valigns).eqls(valigns);
    });
  };

  it("sideBySide with no arguments, one panel, change margins first", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change left margin first, unspecified width adjusts`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin, unspecified width adjusts`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedMargins: [10, 20],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change width to be smaller, add extra to right margin`);
        //  Note: add to right margin since with one panel, there is not gapWidth to set
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}60{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [10, 20],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change width to be larger, rescale to 100%`);
        // Note: this rescaling ignores the extra width added to the right margin,
        // as it was an indirect consequence of changing the width.
        // Computations assume the right margin is at the origin 20% specified
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}95{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 95,
          specifiedMargins: [10, 20],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink margins to make specified values add back to 100%`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}3{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}2{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m2a")).should("not.contain.text", "1");

        checkSingleColumnSbs({
          specifiedWidth: 95,
          specifiedMargins: [3, 2],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink right margin to 1, gets recreated to make 100%`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}1{enter}",
          { force: true },
        );
        // since value of m2a doesn't get changed, can't use it to determine how long to wait
        // use boolean input to check that core has responded to that
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkSingleColumnSbs({
          specifiedWidth: 95,
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase left margin to make specified total be 100%`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}4{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 95,
          specifiedMargins: [4, 1],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change totals to keep at 100%`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}80{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}15{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [15, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increasing right margin rescales`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [15, 30],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increasing left margin rescales`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}50{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [50, 30],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink width to get specified back to 100%`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 20,
          specifiedMargins: [50, 30],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 20,
          specifiedMargins: [50, 30],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid valign ignored`);
        cy.get(cesc("#\\/v1_input")).clear().type("invalid{enter}");
        // since no change, use booleaninput to wait for core
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "false");

        checkSingleColumnSbs({
          specifiedWidth: 20,
          specifiedMargins: [50, 30],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with no arguments, one panel, change width first", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs"].stateValues.allWidthsSpecified).eqls([
            null,
          ]);
          expect(stateVariables["/sbs"].stateValues.widths).eqls([100]);
          expect(stateVariables["/sbs"].stateValues.allMarginsSpecified).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs"].stateValues.margins).eqls([0, 0]);
          expect(stateVariables["/sbs"].stateValues.valigns).eqls(["top"]);
        });

        cy.log(`change width first, unspecified margins adjusts`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}70{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 70,
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change width larger than 100%, scaled back to 100%`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}170{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 170,
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change width smaller again`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}60{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin, unspecified left margin adjusts`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [null, 10],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin so total is larger than 100%, rescales`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}60{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [null, 60],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change left margin to be large, rescaling adjusts`);
        //  Note: add to right margin since with one panel, there is not gapWidth to set
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}120{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [120, 60],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with singular relative arguments, one panel", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="80%" margins="10%" valign="middle">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [10, 10],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(
          `change left margin, specified margins stay symmetric, get rescaling`,
        );
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}40{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [40, 40],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(
          `change right margin, specified margins stay symmetric, extra added to right`,
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [5, 5],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`symmetry regained by increasing width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}90{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [5, 5],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [5, 5],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`ignore invalid valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("green{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [5, 5],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with plural relative arguments, one panel", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="80%" margins="15% 5%" valigns="middle">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [15, 5],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`decrease left margin, space added to right margin`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [10, 5],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase right margin, get rescaling`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}35{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [10, 35],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease width to return to 100%`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}55{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 55,
          specifiedMargins: [10, 35],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 55,
          specifiedMargins: [10, 35],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`ignore invalid valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("green{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkSingleColumnSbs({
          specifiedWidth: 55,
          specifiedMargins: [10, 35],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with singular relative arguments and auto margins, one panel", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="80%" margins="auto" valign="middle">
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Width: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valign: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(
          `change left margin, specified margins stay symmetric, get rescaling`,
        );
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}40{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [40, 40],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(
          `change right margin, specified margins stay symmetric, extra added to right`,
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 80,
          specifiedMargins: [5, 5],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`symmetry regained by increasing width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}90{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [5, 5],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [5, 5],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`ignore invalid valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("green{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [5, 5],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with no arguments, two panels, change margins first", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change left margin first, unspecified widths adjust`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin, unspecified widths adjust`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first width to be smaller, add extra to second width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, null],
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(
          `change first width to be larger, second width shrinks to zero, rescale to 100%`,
        );
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}95{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [95, null],
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first width to be smaller again`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, null],
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width to be smaller, extra added to gap`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}50{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 50],
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width to be larger, rescaled to 100%`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}85{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 85],
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink margins to make specified values add back to 100%`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}1.5{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}1{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 85],
          specifiedMargins: [1.5, 1],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink right margin to 0.5, extra added to gap`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}0.5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 85],
          specifiedMargins: [1.5, 0.5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase left margin to make specified total be 100%`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}2{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 85],
          specifiedMargins: [2, 0.5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change totals to keep at 100%`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}50{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}4{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}6{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 50],
          specifiedMargins: [4, 6],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increasing right margin rescales`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}18.5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 50],
          specifiedMargins: [4, 18.5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increasing left margin rescales`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}21.5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 50],
          specifiedMargins: [21.5, 18.5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink widths to get specified below 100%`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}5{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [5, 10],
          specifiedMargins: [21.5, 18.5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [5, 10],
          specifiedMargins: [21.5, 18.5],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [5, 10],
          specifiedMargins: [21.5, 18.5],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid valign ignored`);
        cy.get(cesc("#\\/v2_input")).clear().type("invalid{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkTwoColumnSbs({
          specifiedWidths: [5, 10],
          specifiedMargins: [21.5, 18.5],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with no arguments, two panels, change widths first", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(
          `change second width past 100%, unspecified first width shrinks to zero, rescales`,
        );
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}130{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [null, 130],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width, unspecified first width adjusts`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [null, 10],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first width, unspecified margins adjust`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 10],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin, unspecified left margin adjusts`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 10],
          specifiedMargins: [null, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase second width so total is past 100%, rescaling`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}85{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 85],
          specifiedMargins: [null, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease second width`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 20],
          specifiedMargins: [null, 5],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`specify first margin to be smaller, remainder in gap`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 20],
          specifiedMargins: [10, 5],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with singular relative arguments, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="20%" margins="10%" valign="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change first width, second matches`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width, first matches, rescaling`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}80{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [80, 80],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink width, rest in gap`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase left margin, right margin matches`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [20, 20],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase right margin, left margin matches, rescaling`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}45{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid valign ignored`);
        cy.get(cesc("#\\/v1_input")).clear().type("invalid{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with plural relative arguments, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="20% 10%" margins="10% 20%" valigns="middle bottom">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [20, 10],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change first width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 10],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width, rescaling`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}110{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 110],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink second width`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease right margin`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [10, 5],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase left margin, rescaling`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}77.5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [77.5, 5],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [77.5, 5],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [77.5, 5],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid valign ignored`);
        cy.get(cesc("#\\/v2_input")).clear().type("invalid{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [77.5, 5],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with half-specified plural relative arguments and auto margins", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="20%" margins="auto" valigns="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [20, null],
          specifiedMargins: [null, null],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change first width, unspecified second width adjusts`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          specifiedMargins: [null, null],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(
          `change right margin, left is symmetric, unspecified second width adjusts`,
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width, rest in gap`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first width, rescaling`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}140{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [140, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink first width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease right margin, left matches`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 20],
          specifiedMargins: [5, 5],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase left margin, right matches, rescaling`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}42.5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 20],
          specifiedMargins: [42.5, 42.5],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 20],
          specifiedMargins: [42.5, 42.5],
          specifiedValigns: ["top", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 20],
          specifiedMargins: [42.5, 42.5],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid valign ignored`);
        cy.get(cesc("#\\/v2_input")).clear().type("invalid{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkTwoColumnSbs({
          specifiedWidths: [10, 20],
          specifiedMargins: [42.5, 42.5],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with no arguments, four panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    <mathinput name="w3" bindValueTo="$(sbs.width3)" />
    <mathinput name="w4" bindValueTo="$(sbs.width4)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    <textinput name="v3" bindValueTo="$(sbs.valign3)" />
    <textinput name="v4" bindValueTo="$(sbs.valign4)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $w3.value{assignNames="w3a"}
      $w4.value{assignNames="w4a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
      $v3.value{assignNames="v3a"}
      $v4.value{assignNames="v4a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkFourColumnSbs({
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change left margin first, unspecified widths adjust`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}2{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedMargins: [2, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin, unspecified widths adjust`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}3{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 3rd width to be smaller, add extra to other widths`);
        cy.get(cesc("#\\/w3") + " textarea").type(
          "{end}{backspace}{backspace}14{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [null, null, 14, null],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(
          `change 3rd width to be larger, others widths shrinks to zero, rescale to 100%`,
        );
        cy.get(cesc("#\\/w3") + " textarea").type(
          "{end}{backspace}{backspace}180{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [null, null, 180, null],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 3rd width to be smaller again`);
        cy.get(cesc("#\\/w3") + " textarea").type(
          "{end}{backspace}{backspace}11{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [null, null, 11, null],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 2nd width to be smaller`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}15{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [null, 15, 11, null],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 1st width to be smaller`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [20, 15, 11, null],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 4th width to be smaller, remainder added to gap`);
        cy.get(cesc("#\\/w4") + " textarea").type(
          "{end}{backspace}{backspace}19{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [20, 15, 11, 19],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 2nd width to be larger, rescaled to 100%`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}55{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [20, 55, 11, 19],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink width 2 to make specified values add back to 100%`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 3],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink right margin, extra added to gap`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}1{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 1],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change fourth valign`);
        cy.get(cesc("#\\/v4_input")).clear().type("bottom{enter}");

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 1],
          specifiedValigns: [null, null, null, "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("middle{enter}");

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 1],
          specifiedValigns: [null, "middle", null, "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("middle{enter}");

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 1],
          specifiedValigns: ["middle", "middle", null, "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change third valign`);
        cy.get(cesc("#\\/v3_input")).clear().type("bottom{enter}");

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 1],
          specifiedValigns: ["middle", "middle", "bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid valign ignored`);
        cy.get(cesc("#\\/v3_input")).clear().type("invalid{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkFourColumnSbs({
          specifiedWidths: [20, 30, 11, 19],
          specifiedMargins: [2, 1],
          specifiedValigns: ["middle", "middle", "bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with singular relative arguments, four panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="15%" margins="5%" valign="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    <mathinput name="w3" bindValueTo="$(sbs.width3)" />
    <mathinput name="w4" bindValueTo="$(sbs.width4)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    <textinput name="v3" bindValueTo="$(sbs.valign3)" />
    <textinput name="v4" bindValueTo="$(sbs.valign4)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $w3.value{assignNames="w3a"}
      $w4.value{assignNames="w4a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
      $v3.value{assignNames="v3a"}
      $v4.value{assignNames="v4a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkFourColumnSbs({
          specifiedWidths: [15, 15, 15, 15],
          specifiedMargins: [5, 5],
          specifiedValigns: ["middle", "middle", "middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change 4th width, rest match, remainder added to gap`);
        cy.get(cesc("#\\/w4") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [10, 10, 10, 10],
          specifiedMargins: [5, 5],
          specifiedValigns: ["middle", "middle", "middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change right margin, rescaled`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [10, 10, 10, 10],
          specifiedMargins: [20, 20],
          specifiedValigns: ["middle", "middle", "middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`shrink left margin`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}2{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [10, 10, 10, 10],
          specifiedMargins: [2, 2],
          specifiedValigns: ["middle", "middle", "middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change fourth valign`);
        cy.get(cesc("#\\/v4_input")).clear().type("bottom{enter}");

        checkFourColumnSbs({
          specifiedWidths: [10, 10, 10, 10],
          specifiedMargins: [2, 2],
          specifiedValigns: ["bottom", "bottom", "bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with plural relative arguments, four panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="5% 10% 15% 20%" margins="5% 2%" valigns="middle">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    <mathinput name="w3" bindValueTo="$(sbs.width3)" />
    <mathinput name="w4" bindValueTo="$(sbs.width4)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    <textinput name="v3" bindValueTo="$(sbs.valign3)" />
    <textinput name="v4" bindValueTo="$(sbs.valign4)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $w3.value{assignNames="w3a"}
      $w4.value{assignNames="w4a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
      $v3.value{assignNames="v3a"}
      $v4.value{assignNames="v4a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkFourColumnSbs({
          specifiedWidths: [5, 10, 15, 20],
          specifiedMargins: [5, 2],
          specifiedValigns: ["middle", null, null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change 4th width, remainder added to gap`);
        cy.get(cesc("#\\/w4") + " textarea").type(
          "{end}{backspace}{backspace}9{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [5, 10, 15, 9],
          specifiedMargins: [5, 2],
          specifiedValigns: ["middle", null, null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change 1st width, rescaled`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}63{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [63, 10, 15, 9],
          specifiedMargins: [5, 2],
          specifiedValigns: ["middle", null, null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change more widths, remainder added to gap`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}3{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}8{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/w3") + " textarea").type(
          "{end}{backspace}{backspace}13{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [3, 8, 13, 9],
          specifiedMargins: [5, 2],
          specifiedValigns: ["middle", null, null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change margins`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}7{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}6{enter}",
          { force: true },
        );

        checkFourColumnSbs({
          specifiedWidths: [3, 8, 13, 9],
          specifiedMargins: [7, 6],
          specifiedValigns: ["middle", null, null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change valigns`);
        cy.get(cesc("#\\/v1_input")).clear().type("top{enter}");
        cy.get(cesc("#\\/v2_input")).clear().type("middle{enter}");
        cy.get(cesc("#\\/v3_input")).clear().type("bottom{enter}");
        cy.get(cesc("#\\/v4_input")).clear().type("middle{enter}");

        checkFourColumnSbs({
          specifiedWidths: [3, 8, 13, 9],
          specifiedMargins: [7, 6],
          specifiedValigns: ["top", "middle", "bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("copy sideBySide and overwrite parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" widths="5% 10% 15% 20%" margins="5% 2%" valigns="middle">
      <lorem generateParagraphs="4" />
    </sideBySide>

    <sideBySide copySource="sbs" widths="30% 10%" margins="1% 3%" valigns="bottom middle top bottom" name="sbs2" />

    <sideBySide copySource="sbs2" widths="7% 8% 11% 12%" valigns="top bottom" name="sbs3" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkFourColumnSbs({
          specifiedWidths: [5, 10, 15, 20],
          specifiedMargins: [5, 2],
          specifiedValigns: ["middle", null, null, null],
          sbsWidth,
          sbsName: "/sbs",
          ignoreInitialDOMChecks: true,
        });

        checkFourColumnSbs({
          specifiedWidths: [30, 10, null, null],
          specifiedMargins: [1, 3],
          specifiedValigns: ["bottom", "middle", "top", "bottom"],
          sbsWidth,
          sbsName: "/sbs2",
          ignoreInitialDOMChecks: true,
        });

        checkFourColumnSbs({
          specifiedWidths: [7, 8, 11, 12],
          specifiedMargins: [1, 3],
          specifiedValigns: ["top", "bottom", null, null],
          sbsWidth,
          sbsName: "/sbs3",
          ignoreInitialDOMChecks: true,
        });
      });
  });

  it("sideBySide absolute measurements turned to absolute with warning", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sidebyside width="100px" margins="1px">
      <p>Hello</p>
      <p>Hello</p>
    </sidebyside>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_sidebyside1"].stateValues.marginsAbsolute).eq(
        false,
      );
      expect(stateVariables["/_sidebyside1"].stateValues.widthsAbsolute).eq(
        false,
      );
    });

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(2);

      expect(errorWarnings.warnings[0].message).contain(
        `<sideBySide> is not implemented for absolute measurements. Setting widths to relative`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(17);

      expect(errorWarnings.warnings[1].message).contain(
        `<sideBySide> is not implemented for absolute measurements. Setting margins to relative`,
      );
      expect(errorWarnings.warnings[1].level).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(17);
    });
  });

  it("sbsGroup with no arguments, one panel", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg">
      <sideBySide name="sbs1">
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2">
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsgroup>
    
    <p>Width for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg.width1)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathinput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valign for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg.valign1)" />
    </p>
    
    <p>Width for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1.width1)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathinput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valign for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1.valign1)" />
    </p>
    
    <p>Width for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2.width1)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathinput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valign for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2.valign1)" />
    </p>


    <p>
      $w1g.value{assignNames="w1ga"}
      $m1g.value{assignNames="m1ga"}
      $m2g.value{assignNames="m2ga"}
      $v1g.value{assignNames="v1ga"}
      $w11.value{assignNames="w11a"}
      $m11.value{assignNames="m11a"}
      $m21.value{assignNames="m21a"}
      $v11.value{assignNames="v11a"}
      $w12.value{assignNames="w12a"}
      $m12.value{assignNames="m12a"}
      $m22.value{assignNames="m22a"}
      $v12.value{assignNames="v12a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    // Note: including essentialWidths and essentialMargins
    // just so can keep track of which sbs will still be affected by the spsGroup

    cy.get(cesc("#\\/sbs1"))
      .invoke("width")
      .then((sbsWidth) => {
        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbsg"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbs1, unspecified width of sbs1 adjusts`);
        cy.get(cesc("#\\/m11") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width of sbsg, unspecified margin(s) adjust`);
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}70{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 70,
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 70,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 70,
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change right margin of sbs2, unspecified margin adjusts`);
        cy.get(cesc("#\\/m22") + " textarea").type(
          "{end}{backspace}{backspace}25{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 70,
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 70,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 70,
          specifiedMargins: [null, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`change left margin of sbsg, affects only sbs2`);
        cy.get(cesc("#\\/m1g") + " textarea").type(
          "{end}{backspace}{backspace}4{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 70,
          specifiedMargins: [4, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 70,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 70,
          specifiedMargins: [4, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(
          `change sbsg width to be smaller, adds to unspecified or right margins`,
        );
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{end}{backspace}{backspace}60{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [4, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [4, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(
          `change sbs1 width to be smaller, adds to unspecified right margin`,
        );
        cy.get(cesc("#\\/w11") + " textarea").type(
          "{end}{backspace}{backspace}50{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [4, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [4, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`increase sbsg left margin, cause rescaling just in sbs2`);
        cy.get(cesc("#\\/m1g") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [20, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 60,
          specifiedMargins: [20, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(
          `increase sbsg width, causing rescaling in sbsg and a second in sbs2`,
        );
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{end}{backspace}{backspace}90{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [20, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 90,
          specifiedMargins: [20, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`shrink sbsg width to remove rescaling`);
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}40{enter}",
          { force: true },
        );

        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`change valign of sbs1`);
        cy.get(cesc("#\\/v11_input")).clear().type("bottom{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, 25],
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`change valign of sbsg`);
        cy.get(cesc("#\\/v1g_input")).clear().type("middle{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, null],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, 25],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`change valign of sbs2`);
        cy.get(cesc("#\\/v12_input")).clear().type("top{enter}");

        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, null],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, 25],
          specifiedValign: "top",
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });

        cy.log(`valign of sbsg ignores invalid`);
        cy.get(cesc("#\\/v1g_input")).clear().type("banana{enter}");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b")).should("have.text", "true");

        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, null],
          specifiedValign: "middle",
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          widthValueName: "/w1ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          valignValueName: "/v1ga",
        });
        checkSingleColumnSbs({
          specifiedWidth: 50,
          specifiedMargins: [10, null],
          specifiedValign: "bottom",
          sbsWidth,
          sbsName: "/sbs1",
          widthValueName: "/w11a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          valignValueName: "/v11a",
        });
        checkSingleColumnSbs({
          specifiedWidth: 40,
          specifiedMargins: [20, 25],
          specifiedValign: "top",
          sbsWidth,
          sbsName: "/sbs2",
          widthValueName: "/w12a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          valignValueName: "/v12a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            50,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            10,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            25,
          ]);
        });
      });
  });

  it("sbsGroup with no arguments, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg">
      <sideBySide name="sbs1">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsgroup>
    
    <p>Widths for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg.width1)" />
    <mathinput name="w2g" bindValueTo="$(sbsg.width2)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathinput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valigns for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg.valign1)" />
    <textinput name="v2g" bindValueTo="$(sbsg.valign2)" />
    </p>
    
    <p>Widths for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1.width1)" />
    <mathinput name="w21" bindValueTo="$(sbs1.width2)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathinput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valigns for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1.valign1)" />
    <textinput name="v21" bindValueTo="$(sbs1.valign2)" />
    </p>
    
    <p>Widths for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2.width1)" />
    <mathinput name="w22" bindValueTo="$(sbs2.width2)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathinput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valigns for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2.valign1)" />
    <textinput name="v22" bindValueTo="$(sbs2.valign2)" />
    </p>


    <p>
      $w1g.value{assignNames="w1ga"}
      $w2g.value{assignNames="w2ga"}
      $m1g.value{assignNames="m1ga"}
      $m2g.value{assignNames="m2ga"}
      $v1g.value{assignNames="v1ga"}
      $v2g.value{assignNames="v2ga"}
      $w11.value{assignNames="w11a"}
      $w21.value{assignNames="w21a"}
      $m11.value{assignNames="m11a"}
      $m21.value{assignNames="m21a"}
      $v11.value{assignNames="v11a"}
      $v21.value{assignNames="v21a"}
      $w12.value{assignNames="w12a"}
      $w22.value{assignNames="w22a"}
      $m12.value{assignNames="m12a"}
      $m22.value{assignNames="m22a"}
      $v12.value{assignNames="v12a"}
      $v22.value{assignNames="v22a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    // Note: including essentialWidths and essentialMargins
    // just so can keep track of which sbs will still be affected by the spsGroup

    cy.get(cesc("#\\/sbs1"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbsg"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width1 of sbsg`);
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{end}{backspace}{backspace}40{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`override width1 of sbs1`);
        cy.get(cesc("#\\/w11") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`override width2 of sbs2`);
        cy.get(cesc("#\\/w22") + " textarea").type(
          "{end}{backspace}{backspace}50{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbs1`);
        cy.get(cesc("#\\/m11") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          specifiedMargins: [5, null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbsg`);
        cy.get(cesc("#\\/m1g") + " textarea").type(
          "{end}{backspace}{backspace}3{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          specifiedMargins: [3, null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          specifiedMargins: [5, null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          specifiedMargins: [3, null],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.allMarginsSpecified).eqls([
            3,
            null,
          ]);
        });

        cy.log(`change right margin of sbsg`);
        cy.get(cesc("#\\/m2g") + " textarea").type(
          "{end}{backspace}{backspace}1{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, null],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          specifiedMargins: [5, 1],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change second width of sbsg`);
        cy.get(cesc("#\\/w2g") + " textarea").type(
          "{end}{backspace}{backspace}45{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, 45],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 45],
          specifiedMargins: [5, 1],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`increase second width of sbsg to cause rescaling`);
        cy.get(cesc("#\\/w2g") + " textarea").type(
          "{end}{backspace}{backspace}65{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, 65],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 65],
          specifiedMargins: [5, 1],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`decrease second width of sbs1 to drop below 100%`);
        cy.get(cesc("#\\/w21") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}55{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [40, 65],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 55],
          specifiedMargins: [5, 1],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 50],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30, 55,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`decrease first width of sbsg to drop below 100%`);
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}25{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [25, 65],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 55],
          specifiedMargins: [5, 1],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 50],
          specifiedMargins: [3, 1],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30, 55,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change first valign of sbsg`);
        cy.get(cesc("#\\/v1g_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [25, 65],
          specifiedMargins: [3, 1],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 55],
          specifiedMargins: [5, 1],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 50],
          specifiedMargins: [3, 1],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30, 55,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change first valign of sbs2`);
        cy.get(cesc("#\\/v12_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [25, 65],
          specifiedMargins: [3, 1],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 55],
          specifiedMargins: [5, 1],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 50],
          specifiedMargins: [3, 1],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30, 55,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change second valign of sbs1`);
        cy.get(cesc("#\\/v21_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [25, 65],
          specifiedMargins: [3, 1],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 55],
          specifiedMargins: [5, 1],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 50],
          specifiedMargins: [3, 1],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30, 55,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change second valign of sbsg`);
        cy.get(cesc("#\\/v2g_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [25, 65],
          specifiedMargins: [3, 1],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 55],
          specifiedMargins: [5, 1],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 50],
          specifiedMargins: [3, 1],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            30, 55,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            5,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            50,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });
      });
  });

  it("sbsGroup with singular arguments, sidebysides with plural or no arguments, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg" width="25%" margins="10%" valign="middle">
      <sideBySide name="sbs1" widths="40% 20%" valigns="top">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2" margins="15% 5%" valigns="bottom top">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsgroup>
    
    <p>Widths for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg.width1)" />
    <mathinput name="w2g" bindValueTo="$(sbsg.width2)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathinput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valigns for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg.valign1)" />
    <textinput name="v2g" bindValueTo="$(sbsg.valign2)" />
    </p>
    
    <p>Widths for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1.width1)" />
    <mathinput name="w21" bindValueTo="$(sbs1.width2)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathinput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valigns for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1.valign1)" />
    <textinput name="v21" bindValueTo="$(sbs1.valign2)" />
    </p>
    
    <p>Widths for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2.width1)" />
    <mathinput name="w22" bindValueTo="$(sbs2.width2)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathinput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valigns for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2.valign1)" />
    <textinput name="v22" bindValueTo="$(sbs2.valign2)" />
    </p>

    <p>
      $w1g.value{assignNames="w1ga"}
      $w2g.value{assignNames="w2ga"}
      $m1g.value{assignNames="m1ga"}
      $m2g.value{assignNames="m2ga"}
      $v1g.value{assignNames="v1ga"}
      $v2g.value{assignNames="v2ga"}
      $w11.value{assignNames="w11a"}
      $w21.value{assignNames="w21a"}
      $m11.value{assignNames="m11a"}
      $m21.value{assignNames="m21a"}
      $v11.value{assignNames="v11a"}
      $v21.value{assignNames="v21a"}
      $w12.value{assignNames="w12a"}
      $w22.value{assignNames="w22a"}
      $m12.value{assignNames="m12a"}
      $m22.value{assignNames="m22a"}
      $v12.value{assignNames="v12a"}
      $v22.value{assignNames="v22a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs1"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [25, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 25],
          specifiedMargins: [15, 5],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbsg"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width1 of sbsg`);
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [15, 5],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width2 of sbs2`);
        cy.get(cesc("#\\/w22") + " textarea").type(
          "{end}{backspace}{backspace}15{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 15],
          specifiedMargins: [15, 5],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width2 of sbsg`);
        cy.get(cesc("#\\/w2g") + " textarea").type(
          "{end}{backspace}{backspace}12{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [40, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [15, 5],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width1 of sbs1`);
        cy.get(cesc("#\\/w11") + " textarea").type(
          "{end}{backspace}{backspace}35{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [15, 5],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change margins of sbs2`);
        cy.get(cesc("#\\/m12") + " textarea").type(
          "{end}{backspace}{backspace}22{enter}",
          { force: true },
        );
        cy.get(cesc("#\\/m22") + " textarea").type(
          "{end}{backspace}{backspace}11{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change right margin of sbsg`);
        cy.get(cesc("#\\/m2g") + " textarea").type(
          "{end}{backspace}{backspace}8{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [8, 8],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change right margin of sbs1`);
        cy.get(cesc("#\\/m21") + " textarea").type(
          "{end}{backspace}{backspace}7{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [8, 7],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbsg`);
        cy.get(cesc("#\\/m1g") + " textarea").type(
          "{end}{backspace}{backspace}9{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [9, 7],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbs1`);
        cy.get(cesc("#\\/m11") + " textarea").type(
          "{end}{backspace}{backspace}6{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign1 of sbsg`);
        cy.get(cesc("#\\/v1g_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign2 of sbs1`);
        cy.get(cesc("#\\/v21_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign2 of sbsg`);
        cy.get(cesc("#\\/v2g_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign1 of sbs1`);
        cy.get(cesc("#\\/v11_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [6, 7],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valigns of sbs2`);
        cy.get(cesc("#\\/v12_input")).clear().type("middle{enter}");
        cy.get(cesc("#\\/v22_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [12, 12],
          specifiedMargins: [9, 9],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 20],
          specifiedMargins: [6, 7],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [12, 15],
          specifiedMargins: [22, 11],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            15,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });
      });
  });

  it("sbsGroup with plural arguments, sidebysides with singular or no arguments, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg" widths="25% 15%" margins="5% 10%" valigns="middle top">
      <sideBySide name="sbs1" width="20%" valign="top">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
      <sideBySide name="sbs2" margins="8%">
        <lorem generateParagraphs="1" />
        <lorem generateParagraphs="1" />
      </sideBySide>
    </sbsgroup>
    
    <p>Widths for sbsg: 
    <mathinput name="w1g" bindValueTo="$(sbsg.width1)" />
    <mathinput name="w2g" bindValueTo="$(sbsg.width2)" />
    </p>
    
    <p>Margins for sbsg: 
    <mathinput name="m1g" bindValueTo="$(sbsg.margin1)" />
    <mathinput name="m2g" bindValueTo="$(sbsg.margin2)" />
    </p>
    
    <p>Valigns for sbsg: 
    <textinput name="v1g" bindValueTo="$(sbsg.valign1)" />
    <textinput name="v2g" bindValueTo="$(sbsg.valign2)" />
    </p>
    
    <p>Widths for sbs1: 
    <mathinput name="w11" bindValueTo="$(sbs1.width1)" />
    <mathinput name="w21" bindValueTo="$(sbs1.width2)" />
    </p>
    
    <p>Margins for sbs1: 
    <mathinput name="m11" bindValueTo="$(sbs1.margin1)" />
    <mathinput name="m21" bindValueTo="$(sbs1.margin2)" />
    </p>
    
    <p>Valigns for sbs1: 
    <textinput name="v11" bindValueTo="$(sbs1.valign1)" />
    <textinput name="v21" bindValueTo="$(sbs1.valign2)" />
    </p>
    
    <p>Widths for sbs2: 
    <mathinput name="w12" bindValueTo="$(sbs2.width1)" />
    <mathinput name="w22" bindValueTo="$(sbs2.width2)" />
    </p>
    
    <p>Margins for sbs2: 
    <mathinput name="m12" bindValueTo="$(sbs2.margin1)" />
    <mathinput name="m22" bindValueTo="$(sbs2.margin2)" />
    </p>
    
    <p>Valigns for sbs2: 
    <textinput name="v12" bindValueTo="$(sbs2.valign1)" />
    <textinput name="v22" bindValueTo="$(sbs2.valign2)" />
    </p>

    <p>
      $w1g.value{assignNames="w1ga"}
      $w2g.value{assignNames="w2ga"}
      $m1g.value{assignNames="m1ga"}
      $m2g.value{assignNames="m2ga"}
      $v1g.value{assignNames="v1ga"}
      $v2g.value{assignNames="v2ga"}
      $w11.value{assignNames="w11a"}
      $w21.value{assignNames="w21a"}
      $m11.value{assignNames="m11a"}
      $m21.value{assignNames="m21a"}
      $v11.value{assignNames="v11a"}
      $v21.value{assignNames="v21a"}
      $w12.value{assignNames="w12a"}
      $w22.value{assignNames="w22a"}
      $m12.value{assignNames="m12a"}
      $m22.value{assignNames="m22a"}
      $v12.value{assignNames="v12a"}
      $v22.value{assignNames="v22a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs1"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [25, 15],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 15],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbsg"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.absoluteMeasurements).eq(
            false,
          );
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width1 of sbsg`);
        cy.get(cesc("#\\/w1g") + " textarea").type(
          "{end}{backspace}{backspace}20{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 15],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 15],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width2 of sbs2`);
        cy.get(cesc("#\\/w22") + " textarea").type(
          "{end}{backspace}{backspace}25{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 15],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width2 of sbsg`);
        cy.get(cesc("#\\/w2g") + " textarea").type(
          "{end}{backspace}{backspace}12{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width1 of sbs1`);
        cy.get(cesc("#\\/w11") + " textarea").type(
          "{end}{backspace}{backspace}35{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [35, 35],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width2 of sbs1`);
        cy.get(cesc("#\\/w21") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [20, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            null,
            25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change width1 of sbs2`);
        cy.get(cesc("#\\/w12") + " textarea").type(
          "{end}{backspace}{backspace}22{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change right margin of sbsg`);
        cy.get(cesc("#\\/m2g") + " textarea").type(
          "{end}{backspace}{backspace}8{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [5, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [5, 8],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change right margin of sbs1`);
        cy.get(cesc("#\\/m21") + " textarea").type(
          "{end}{backspace}{backspace}7{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [5, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [5, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbsg`);
        cy.get(cesc("#\\/m1g") + " textarea").type(
          "{end}{backspace}{backspace}9{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [9, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            null,
            7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbs1`);
        cy.get(cesc("#\\/m11") + " textarea").type(
          "{end}{backspace}{backspace}6{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change right margin of sbs2`);
        cy.get(cesc("#\\/m22") + " textarea").type(
          "{end}{backspace}{backspace}3{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [3, 3],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change left margin of sbs2`);
        cy.get(cesc("#\\/m12") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign1 of sbsg`);
        cy.get(cesc("#\\/v1g_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign2 of sbs1`);
        cy.get(cesc("#\\/v21_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["bottom", "top"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign2 of sbsg`);
        cy.get(cesc("#\\/v2g_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valign1 of sbs1`);
        cy.get(cesc("#\\/v11_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });

        cy.log(`change valigns of sbs2`);
        cy.get(cesc("#\\/v12_input")).clear().type("middle{enter}");
        cy.get(cesc("#\\/v22_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [20, 12],
          specifiedMargins: [9, 8],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          leftWidthValueName: "/w1ga",
          rightWidthValueName: "/w2ga",
          leftMarginValueName: "/m1ga",
          rightMarginValueName: "/m2ga",
          leftValignValueName: "/v1ga",
          rightValignValueName: "/v2ga",
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [6, 7],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs1",
          leftWidthValueName: "/w11a",
          rightWidthValueName: "/w21a",
          leftMarginValueName: "/m11a",
          rightMarginValueName: "/m21a",
          leftValignValueName: "/v11a",
          rightValignValueName: "/v21a",
        });
        checkTwoColumnSbs({
          specifiedWidths: [22, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs2",
          leftWidthValueName: "/w12a",
          rightWidthValueName: "/w22a",
          leftMarginValueName: "/m12a",
          rightMarginValueName: "/m22a",
          leftValignValueName: "/v12a",
          rightValignValueName: "/v22a",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs1"].stateValues.essentialWidths).eqls([
            null,
            null,
          ]);
          expect(stateVariables["/sbs1"].stateValues.essentialMargins).eqls([
            6, 7,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialWidths).eqls([
            22, 25,
          ]);
          expect(stateVariables["/sbs2"].stateValues.essentialMargins).eqls([
            null,
            null,
          ]);
        });
      });
  });

  it("copy sbsGroup and overwrite parameters", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sbsgroup name="sbsg" widths="25% 15%" margins="5% 10%" valigns="middle top" newNamespace>
      <sideBySide name="sbs1" width="20%" valign="top">
        <lorem generateParagraphs="2" />
      </sideBySide>
      <sideBySide name="sbs2" margins="8%">
        <lorem generateParagraphs="2" />
      </sideBySide>
    </sbsgroup>

    <sbsgroup copySource="sbsg" widths="30% 10%" margins="1% 3%" valigns="bottom middle" name="sbsg2" />

    <sbsgroup copySource="sbsg2" widths="7%" valigns="top bottom" name="sbsg3" />

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbsg\\/sbs1"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [25, 15],
          specifiedMargins: [5, 10],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg",
          isSbsGroup: true,
          ignoreInitialDOMChecks: true,
        });

        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [5, 10],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbsg/sbs1",
          ignoreInitialDOMChecks: true,
        });
        checkTwoColumnSbs({
          specifiedWidths: [25, 15],
          specifiedMargins: [8, 8],
          specifiedValigns: ["middle", "top"],
          sbsWidth,
          sbsName: "/sbsg/sbs2",
          ignoreInitialDOMChecks: true,
        });

        checkTwoColumnSbs({
          specifiedWidths: [30, 10],
          specifiedMargins: [1, 3],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbsg2",
          isSbsGroup: true,
          ignoreInitialDOMChecks: true,
        });

        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [1, 3],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbsg2/sbs1",
          ignoreInitialDOMChecks: true,
        });
        checkTwoColumnSbs({
          specifiedWidths: [30, 10],
          specifiedMargins: [8, 8],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbsg2/sbs2",
          ignoreInitialDOMChecks: true,
        });

        checkTwoColumnSbs({
          specifiedWidths: [7, null],
          specifiedMargins: [1, 3],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbsg3",
          isSbsGroup: true,
          ignoreInitialDOMChecks: true,
        });

        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [1, 3],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbsg3/sbs1",
          ignoreInitialDOMChecks: true,
        });
        checkTwoColumnSbs({
          specifiedWidths: [7, null],
          specifiedMargins: [8, 8],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbsg3/sbs2",
          ignoreInitialDOMChecks: true,
        });
      });
  });

  it("sbsGroup absolute measurements turned to absolute with warning", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sbsGroup width="100px" margins="1px">
      <sidebyside>
        <p>Hello</p>
        <p>Hello</p>
      </sidebyside>
    </sbsGroup>

    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.window().then(async (win) => {
      let stateVariables = await win.returnAllStateVariables1();
      expect(stateVariables["/_sbsgroup1"].stateValues.marginsAbsolute).eq(
        false,
      );
      expect(stateVariables["/_sbsgroup1"].stateValues.widthsAbsolute).eq(
        false,
      );
    });

    cy.window().then(async (win) => {
      let errorWarnings = await win.returnErrorWarnings1();

      expect(errorWarnings.errors.length).eq(0);
      expect(errorWarnings.warnings.length).eq(2);

      expect(errorWarnings.warnings[0].message).contain(
        `<sbsGroup> is not implemented for absolute measurements. Setting widths to relative`,
      );
      expect(errorWarnings.warnings[0].level).eq(1);
      expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(8);
      expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(15);

      expect(errorWarnings.warnings[1].message).contain(
        `<sbsGroup> is not implemented for absolute measurements. Setting margins to relative`,
      );
      expect(errorWarnings.warnings[1].level).eq(1);
      expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
      expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(5);
      expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(8);
      expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(15);
    });
  });

  it("sideBySide with a stack", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <sideBySide name="sbs" width="49%" margins="0%">
      <stack>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
      </stack>
      <p>Fringilla ut morbi tincidunt augue interdum velit euismod in. Mattis molestie a iaculis at erat. Pharetra magna ac placerat vestibulum lectus mauris ultrices. Nisl rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Congue quisque egestas diam in arcu cursus euismod quis viverra. Et leo duis ut diam quam nulla porttitor massa. Dolor sit amet consectetur adipiscing elit. Ullamcorper malesuada proin libero nunc consequat interdum varius. Nunc lobortis mattis aliquam faucibus purus. Amet commodo nulla facilisi nullam vehicula. Massa placerat duis ultricies lacus sed turpis.</p>
    </sideBySide>
    
  
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [49, 49],
          specifiedMargins: [0, 0],
          sbsWidth,
          sbsName: "/sbs",
          ignoreInitialDOMChecks: true,
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });
      });
  });

  it("sideBySide with singular relative arguments from inputs, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>

    <p>Width: <mathinput name="w" prefill="20" /></p>
    <p>Margin: <mathinput name="m" prefill="10" /></p>
    <p>Valign: <textinput name="v" prefill="middle" /></p>

    <sideBySide name="sbs" width="$(w)%" margins="$(m)%" valign="$v">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [20, 20],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change first width, second matches`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 30],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second width, first matches, rescaling`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}80{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [80, 80],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change defining width`);
        cy.get(cesc("#\\/w") + " textarea").type(
          "{end}{backspace}{backspace}25{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [25, 25],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid defining width treated as null`);
        cy.get(cesc("#\\/w") + " textarea").type(
          "{end}{backspace}{backspace}x{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [null, null],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset width by changing second width`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}10{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [10, 10],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease defining margin`);
        cy.get(cesc("#\\/m") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [5, 5],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid defining margin treated as null`);
        cy.get(cesc("#\\/m") + " textarea").type(
          "{end}{backspace}{backspace}none{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [null, null],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset from left margin, right margin matches`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{end}{backspace}{backspace}15{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [15, 15],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase right margin, left margin matches, rescaling`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}45{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["top", "top"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change defining valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["middle", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid defining valign becomes top`);
        cy.get(cesc("#\\/v_input")).clear().type("invalid{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: [null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset from first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [10, 10],
          specifiedMargins: [45, 45],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });

  it("sideBySide with plural relative arguments from inputs, two panels", () => {
    cy.window().then(async (win) => {
      win.postMessage(
        {
          doenetML: `
    <text>a</text>
    <p>Defining widths: 
    <mathinput name="dw1" prefill="20" />
    <mathinput name="dw2" prefill="10" />
    </p>
    <p>Defining margins: 
    <mathinput name="dm1" prefill="10" />
    <mathinput name="dm2" prefill="20" />
    </p>
    <p>Defining valigns: 
    <textinput name="dv1" prefill="middle" />
    <textinput name="dv2" prefill="bottom" />
    </p>

    <sideBySide name="sbs" widths="$(dw1)% $(dw2)%" margins="$(dm1)% $(dm2)%" valigns="$dv1 $dv2">
    <lorem generateParagraphs="1" />
    <lorem generateParagraphs="1" />
    </sideBySide>

    <p>Widths: 
    <mathinput name="w1" bindValueTo="$(sbs.width1)" />
    <mathinput name="w2" bindValueTo="$(sbs.width2)" />
    </p>

    <p>Margins: 
    <mathinput name="m1" bindValueTo="$(sbs.margin1)" />
    <mathinput name="m2" bindValueTo="$(sbs.margin2)" />
    </p>

    <p>Valigns: 
    <textinput name="v1" bindValueTo="$(sbs.valign1)" />
    <textinput name="v2" bindValueTo="$(sbs.valign2)" />
    </p>

    <p>
      $w1.value{assignNames="w1a"}
      $w2.value{assignNames="w2a"}
      $m1.value{assignNames="m1a"}
      $m2.value{assignNames="m2a"}
      $v1.value{assignNames="v1a"}
      $v2.value{assignNames="v2a"}
    </p>
    <p>
      <booleaninput name="bi"/>
      $bi.value{assignNames="b"}
    </p>
    `,
        },
        "*",
      );
    });

    cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

    cy.get(cesc("#\\/sbs"))
      .invoke("width")
      .then((sbsWidth) => {
        checkTwoColumnSbs({
          specifiedWidths: [20, 10],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.window().then(async (win) => {
          let stateVariables = await win.returnAllStateVariables1();
          expect(stateVariables["/sbs"].stateValues.absoluteMeasurements).eq(
            false,
          );
        });

        cy.log(`change first width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 10],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second defining width, rescaling`);
        cy.get(cesc("#\\/dw2") + " textarea").type(
          "{end}{backspace}{backspace}110{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 110],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`make second defining width be invalid, treated as null`);
        cy.get(cesc("#\\/dw2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}hello{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, null],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`make first defining width be invalid, treated as null`);
        cy.get(cesc("#\\/dw1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}bye{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [null, null],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset second width`);
        cy.get(cesc("#\\/w2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [null, 5],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset first width`);
        cy.get(cesc("#\\/w1") + " textarea").type(
          "{end}{backspace}{backspace}30{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [10, 20],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease right margin`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{end}{backspace}{backspace}5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [10, 5],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`increase left defining margin, rescaling`);
        cy.get(cesc("#\\/dm1") + " textarea").type(
          "{end}{backspace}{backspace}77.5{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [77.5, 5],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`decrease left margin`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}7{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [7, 5],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid left defining margin, treated as null`);
        cy.get(cesc("#\\/dm1") + " textarea").type(
          "{end}{backspace}{backspace}hello{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [null, 5],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid right defining margin, treated as null`);
        cy.get(cesc("#\\/dm2") + " textarea").type(
          "{end}{backspace}{backspace}bye{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [null, null],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset left margin`);
        cy.get(cesc("#\\/m1") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}12{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, null],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset right margin`);
        cy.get(cesc("#\\/m2") + " textarea").type(
          "{ctrl+home}{shift+end}{backspace}8{enter}",
          { force: true },
        );

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("top{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["top", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["top", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change first defining valign`);
        cy.get(cesc("#\\/dv1_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["bottom", "middle"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`change second defining valign`);
        cy.get(cesc("#\\/dv2_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["bottom", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid second defining valign treated as null`);
        cy.get(cesc("#\\/dv2_input")).clear().type("banana{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["bottom", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`invalid first defining valign treated as null`);
        cy.get(cesc("#\\/dv1_input")).clear().type("apple{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: [null, null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset first valign`);
        cy.get(cesc("#\\/v1_input")).clear().type("middle{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["middle", null],
          sbsWidth,
          sbsName: "/sbs",
        });

        cy.log(`reset second valign`);
        cy.get(cesc("#\\/v2_input")).clear().type("bottom{enter}");

        checkTwoColumnSbs({
          specifiedWidths: [30, 5],
          specifiedMargins: [12, 8],
          specifiedValigns: ["middle", "bottom"],
          sbsWidth,
          sbsName: "/sbs",
        });
      });
  });
});
