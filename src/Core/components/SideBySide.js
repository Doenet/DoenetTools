import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";

export class SideBySide extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "sideBySide";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.width = {
      createComponentOfType: "_componentSize",
    };
    attributes.widths = {
      createComponentOfType: "_componentSizeList",
    };

    attributes.margins = {
      createComponentOfType: "_componentSizeList",
    };

    attributes.valign = {
      createComponentOfType: "text",
    };
    attributes.valigns = {
      createComponentOfType: "textList",
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "blocks",
        componentTypes: ["_block"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numPanels = {
      forRenderer: true,
      returnDependencies: () => ({
        blockChildren: {
          dependencyType: "child",
          childGroups: ["blocks"],
          skipComponentNames: true,
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: { numPanels: dependencyValues.blockChildren.length },
          checkForActualChange: { numPanels: true },
        };
      },
    };

    // have separate state variable for essential widths so that
    // if have a parent sbsgroup, can determine which widths have been changed
    // and so should override the parent sbsGroup width
    stateVariableDefinitions.essentialWidths = {
      isArray: true,
      entryPrefixes: ["essentialWidth"],
      defaultValueByArrayKey: () => null,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        numPanels: {
          dependencyType: "stateVariable",
          variableName: "numPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numPanels];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {
        let essentialWidths = {};
        for (let arrayKey of arrayKeys) {
          essentialWidths[arrayKey] = true;
        }

        return { useEssentialOrDefaultValue: { essentialWidths } };
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let value = {};
        for (let arrayKey in desiredStateVariableValues.essentialWidths) {
          value[arrayKey] =
            desiredStateVariableValues.essentialWidths[arrayKey];
        }

        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "essentialWidths",
              value,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.allWidthsSpecified = {
      additionalStateVariablesDefined: ["widthsAbsolute"],
      returnDependencies() {
        return {
          numPanels: {
            dependencyType: "stateVariable",
            variableName: "numPanels",
          },
          widthAttr: {
            dependencyType: "attributeComponent",
            attributeName: "width",
            variableNames: ["componentSize"],
          },
          widthsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "widths",
            variableNames: ["numComponents", "componentSizes"],
          },
          parentWidths: {
            dependencyType: "parentStateVariable",
            parentComponentType: "sbsGroup",
            variableName: `specifiedWidths`,
          },
          parentWidthsAbsolute: {
            dependencyType: "parentStateVariable",
            parentComponentType: "sbsGroup",
            variableName: `widthsAbsolute`,
          },
          essentialWidth: {
            dependencyType: "stateVariable",
            variableName: `essentialWidths`,
          },
        };
      },
      definition({ dependencyValues }) {
        let allWidthsSpecified = [];
        let widthsAbsolute = null;

        let nWidthsSpecifiedFromAttrs;
        let usingSingleWidth = false;

        if (dependencyValues.widthsAttr !== null) {
          nWidthsSpecifiedFromAttrs =
            dependencyValues.widthsAttr.stateValues.numComponents;
        } else if (dependencyValues.widthAttr !== null) {
          nWidthsSpecifiedFromAttrs = dependencyValues.numPanels;
          usingSingleWidth = true;
        } else {
          nWidthsSpecifiedFromAttrs = 0;
        }

        for (let ind = 0; ind < dependencyValues.numPanels; ind++) {
          let thisAbsolute = null;

          if (ind < nWidthsSpecifiedFromAttrs) {
            if (usingSingleWidth) {
              if (dependencyValues.widthAttr.stateValues.componentSize) {
                allWidthsSpecified[ind] =
                  dependencyValues.widthAttr.stateValues.componentSize.size;
                thisAbsolute = Boolean(
                  dependencyValues.widthAttr.stateValues.componentSize
                    .isAbsolute,
                );
              } else {
                allWidthsSpecified[ind] = null;
              }
            } else {
              if (dependencyValues.widthsAttr.stateValues.componentSizes[ind]) {
                allWidthsSpecified[ind] =
                  dependencyValues.widthsAttr.stateValues.componentSizes[
                    ind
                  ].size;
                thisAbsolute = Boolean(
                  dependencyValues.widthsAttr.stateValues.componentSizes[ind]
                    .isAbsolute,
                );
              } else {
                allWidthsSpecified[ind] = null;
              }
            }
          } else {
            if (dependencyValues.parentWidths) {
              if (dependencyValues.essentialWidth[ind] === null) {
                allWidthsSpecified[ind] = dependencyValues.parentWidths[ind];
              } else {
                allWidthsSpecified[ind] = dependencyValues.essentialWidth[ind];
              }
              thisAbsolute = dependencyValues.parentWidthsAbsolute;
            } else {
              allWidthsSpecified[ind] = dependencyValues.essentialWidth[ind];
            }
          }

          if (widthsAbsolute === null) {
            widthsAbsolute = thisAbsolute;
          } else if (thisAbsolute !== null && widthsAbsolute !== thisAbsolute) {
            throw Error(
              `SideBySide is not implemented for absolute measurements`,
            );
            throw Error(
              `Cannot mix absolute and relative widths for sideBySide`,
            );
          }
        }

        // treat any non-numeric widths as being unspecified
        allWidthsSpecified = allWidthsSpecified.map((x) =>
          Number.isFinite(x) ? x : null,
        );

        return { setValue: { allWidthsSpecified, widthsAbsolute } };
      },
    };

    stateVariableDefinitions.essentialMargins = {
      isArray: true,
      entryPrefixes: ["essentialMargin"],
      hasEssential: true,
      defaultValueByArrayKey: () => null,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {
        let essentialMargins = {};
        for (let arrayKey of arrayKeys) {
          essentialMargins[arrayKey] = true;
        }

        return { useEssentialOrDefaultValue: { essentialMargins } };
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let value = {};
        for (let arrayKey in desiredStateVariableValues.essentialMargins) {
          value[arrayKey] =
            desiredStateVariableValues.essentialMargins[arrayKey];
        }

        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "essentialMargins",
              value,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.allMarginsSpecified = {
      additionalStateVariablesDefined: ["marginsAbsolute"],
      returnDependencies() {
        return {
          numPanels: {
            dependencyType: "stateVariable",
            variableName: "numPanels",
          },
          marginsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "margins",
            variableNames: ["numComponents", "componentSizes"],
          },
          parentMargins: {
            dependencyType: "parentStateVariable",
            parentComponentType: "sbsGroup",
            variableName: `specifiedMargins`,
          },
          parentMarginsAbsolute: {
            dependencyType: "parentStateVariable",
            parentComponentType: "sbsGroup",
            variableName: `marginsAbsolute`,
          },
          essentialMargins: {
            dependencyType: "stateVariable",
            variableName: `essentialMargins`,
          },
        };
      },
      definition({ dependencyValues }) {
        let allMarginsSpecified = [];
        let marginsAbsolute = null;

        if (dependencyValues.marginsAttr === null) {
          if (dependencyValues.parentMargins) {
            marginsAbsolute = dependencyValues.parentMarginsAbsolute;
            for (let ind = 0; ind < 2; ind++) {
              if (dependencyValues.essentialMargins[ind] === null) {
                allMarginsSpecified[ind] = dependencyValues.parentMargins[ind];
              } else {
                allMarginsSpecified[ind] =
                  dependencyValues.essentialMargins[ind];
              }
            }
          } else {
            for (let ind = 0; ind < 2; ind++) {
              allMarginsSpecified[ind] = dependencyValues.essentialMargins[ind];
            }
          }
        } else if (
          dependencyValues.marginsAttr.stateValues.numComponents === 0
        ) {
          for (let ind = 0; ind < 2; ind++) {
            allMarginsSpecified[ind] = dependencyValues.essentialMargins[ind];
          }
        } else if (
          dependencyValues.marginsAttr.stateValues.numComponents === 1
        ) {
          let margin = null;
          if (dependencyValues.marginsAttr.stateValues.componentSizes[0]) {
            margin =
              dependencyValues.marginsAttr.stateValues.componentSizes[0].size;
            if (!Number.isFinite(margin)) {
              margin = null;
            }
            marginsAbsolute = Boolean(
              dependencyValues.marginsAttr.stateValues.componentSizes[0]
                .isAbsolute,
            );
          }
          allMarginsSpecified = [margin, margin];
        } else {
          if (dependencyValues.marginsAttr.stateValues.componentSizes[0]) {
            // two (or more) components of marginsAttr
            marginsAbsolute = Boolean(
              dependencyValues.marginsAttr.stateValues.componentSizes[0]
                .isAbsolute,
            );
          } else {
            marginsAbsolute = false;
          }
          let secondMarginAbsolute;
          if (dependencyValues.marginsAttr.stateValues.componentSizes[1]) {
            secondMarginAbsolute = Boolean(
              dependencyValues.marginsAttr.stateValues.componentSizes[1]
                .isAbsolute,
            );
          } else {
            secondMarginAbsolute = false;
          }

          if (secondMarginAbsolute !== marginsAbsolute) {
            throw Error(
              `SideBySide is not implemented for absolute measurements`,
            );
            throw Error(
              `Cannot mix absolute and relative margins for sideBySide`,
            );
          }
          allMarginsSpecified =
            dependencyValues.marginsAttr.stateValues.componentSizes
              .slice(0, 2)
              .map((x) => (x && Number.isFinite(x.size) ? x.size : null));
        }

        return { setValue: { allMarginsSpecified, marginsAbsolute } };
      },
    };

    stateVariableDefinitions.absoluteMeasurements = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      forRenderer: true,
      returnDependencies: () => ({
        widthsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "widthsAbsolute",
        },
        marginsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "marginsAbsolute",
        },
      }),
      definition({ dependencyValues }) {
        let absoluteMeasurements;
        if (dependencyValues.widthsAbsolute === null) {
          if (dependencyValues.marginsAbsolute === null) {
            absoluteMeasurements = false;
          } else {
            absoluteMeasurements = dependencyValues.marginsAbsolute;
          }
        } else {
          if (dependencyValues.marginsAbsolute === null) {
            absoluteMeasurements = dependencyValues.widthsAbsolute;
          } else {
            if (
              dependencyValues.widthsAbsolute !==
              dependencyValues.marginsAbsolute
            ) {
              throw Error(
                `SideBySide is not implemented for absolute measurements`,
              );
              throw Error(
                `Cannot mix absolute and relative widths and margins for sideBySide`,
              );
            }
            absoluteMeasurements = dependencyValues.widthsAbsolute;
          }
        }

        if (absoluteMeasurements === true) {
          throw Error(
            `SideBySide is not implemented for absolute measurements`,
          );
        }

        return { setValue: { absoluteMeasurements } };
      },
    };

    stateVariableDefinitions.allWidths = {
      additionalStateVariablesDefined: [
        "allMargins",
        {
          variableName: "gapWidth",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "number",
          },
          forRenderer: true,
        },
      ],
      returnDependencies: () => ({
        numPanels: {
          dependencyType: "stateVariable",
          variableName: "numPanels",
        },
        allWidthsSpecified: {
          dependencyType: "stateVariable",
          variableName: "allWidthsSpecified",
        },
        allMarginsSpecified: {
          dependencyType: "stateVariable",
          variableName: "allMarginsSpecified",
        },
        absoluteMeasurements: {
          dependencyType: "stateVariable",
          variableName: "absoluteMeasurements",
        },
      }),
      definition({ dependencyValues }) {
        let gapWidth = 0;
        let allWidths = [...dependencyValues.allWidthsSpecified];
        let allMargins = [...dependencyValues.allMarginsSpecified];

        let totalWidthSpecified = 0;
        let nWidthsUndefined = 0;

        for (let ind = 0; ind < dependencyValues.numPanels; ind++) {
          let width = allWidths[ind];
          if (width === null) {
            nWidthsUndefined++;
          } else {
            totalWidthSpecified += width;
          }
        }

        let totalMarginSpecified = 0;
        let nMarginsUndefined = 0;

        for (let ind = 0; ind < 2; ind++) {
          let margin = allMargins[ind];
          if (margin === null) {
            nMarginsUndefined++;
          } else {
            totalMarginSpecified += margin;
          }
        }
        totalMarginSpecified *= dependencyValues.numPanels;

        if (!dependencyValues.absoluteMeasurements) {
          if (totalWidthSpecified + totalMarginSpecified >= 100) {
            // we are already over 100%
            // anything null becomes width 0
            // everything else is normalized to add up to 100

            let normalization =
              100 / (totalWidthSpecified + totalMarginSpecified);
            for (let ind = 0; ind < dependencyValues.numPanels; ind++) {
              if (allWidths[ind] === null) {
                allWidths[ind] = 0;
              } else {
                allWidths[ind] *= normalization;
              }
            }
            for (let ind = 0; ind < 2; ind++) {
              let margin = allMargins[ind];
              if (margin === null) {
                allMargins[ind] = 0;
              } else {
                allMargins[ind] *= normalization;
              }
            }
          } else {
            // since we are under 100%, we try the following to get to 100%
            // 1. if there are any null widths,
            //    define them to be the same value that makes the total 100%
            //    and make any null margins be zero
            // 2. else, if there are any null margins,
            //    define them to be the same value that makes the total 100%
            // 3. else if there two or panels, set gapWidth to make the total 100%
            // 4. else if there is one panel, expand the right margin
            // 5. do nothing (child groups aren't matched)

            if (nWidthsUndefined > 0) {
              let newWidth =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                nWidthsUndefined;
              for (let ind = 0; ind < dependencyValues.numPanels; ind++) {
                if (allWidths[ind] === null) {
                  allWidths[ind] = newWidth;
                }
              }

              for (let ind = 0; ind < 2; ind++) {
                let margin = allMargins[ind];
                if (margin === null) {
                  allMargins[ind] = 0;
                }
              }
            } else if (nMarginsUndefined > 0) {
              let newMargin =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                (nMarginsUndefined * dependencyValues.numPanels);
              for (let ind = 0; ind < 2; ind++) {
                if (allMargins[ind] === null) {
                  allMargins[ind] = newMargin;
                }
              }
            } else if (dependencyValues.numPanels > 1) {
              gapWidth =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                (dependencyValues.numPanels - 1);
            } else if (dependencyValues.numPanels === 1) {
              allMargins[1] = 100 - (allMargins[0] + allWidths[0]);
            } else {
              console.warn(
                "Invalid sideBySide, as it must have at least one block child",
              );
            }
          }
        } else {
          // we won't reach here, as we throw an error about not implementing
          // absolute measurements before get this far
        }

        return { setValue: { allWidths, allMargins, gapWidth } };
      },
    };

    stateVariableDefinitions.widths = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      entryPrefixes: ["width"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numPanels: {
          dependencyType: "stateVariable",
          variableName: "numPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numPanels];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        // Note: only the allWidths dependency is used to calculate widths
        // The other dependencies are used in the inverse direction
        // to facilitate single keys being changed at a time
        let globalDependencies = {
          allWidths: {
            dependencyType: "stateVariable",
            variableName: `allWidths`,
          },
          widthsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "widths",
            variableNames: [`numComponents`],
          },
          widthAttr: {
            dependencyType: "attributeComponent",
            attributeName: "width",
            variableNames: ["componentSize"],
          },
          absoluteMeasurements: {
            dependencyType: "stateVariable",
            variableName: "absoluteMeasurements",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            widthsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "widths",
              variableNames: [`componentSize${varEnding}`],
            },
            essentialWidth: {
              dependencyType: "stateVariable",
              variableName: `essentialWidth${varEnding}`,
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let widths = {};
        for (let arrayKey of arrayKeys) {
          widths[arrayKey] = globalDependencyValues.allWidths[arrayKey];
        }

        return { setValue: { widths } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        globalDependencyValues,
        arraySize,
      }) {
        let nWidthsSpecifiedFromAttrs;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecifiedFromAttrs =
            globalDependencyValues.widthsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecifiedFromAttrs = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecifiedFromAttrs = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.widths) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecifiedFromAttrs) {
            if (usingSingleWidth) {
              // last one wins
              instructions.push({
                setDependency: "widthAttr",
                desiredValue: {
                  size: desiredStateVariableValues.widths[arrayKey],
                  isAbsolute: globalDependencyValues.absoluteMeasurements,
                },
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].widthsAttr,
                desiredValue: {
                  size: desiredStateVariableValues.widths[arrayKey],
                  isAbsolute: globalDependencyValues.absoluteMeasurements,
                },
                variableIndex: 0,
              });
            }
          } else {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].essentialWidth,
              desiredValue: desiredStateVariableValues.widths[arrayKey],
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.margins = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      entryPrefixes: ["margin"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        // Note: only the allMargins dependency is used to calculate widths
        // The other dependencies are used in the inverse direction
        // to facilitate single keys being changed at a time
        let globalDependencies = {
          allMargins: {
            dependencyType: "stateVariable",
            variableName: `allMargins`,
          },
          marginsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "margins",
            variableNames: [
              "componentSize1",
              "componentSize2",
              "numComponents",
            ],
          },
          absoluteMeasurements: {
            dependencyType: "stateVariable",
            variableName: "absoluteMeasurements",
          },
        };

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            essentialMargin: {
              dependencyType: "stateVariable",
              variableName: `essentialMargin${varEnding}`,
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let margins = {};
        for (let arrayKey of arrayKeys) {
          margins[arrayKey] = globalDependencyValues.allMargins[arrayKey];
        }

        return { setValue: { margins } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyNamesByKey,
      }) {
        let instructions = [];

        if (globalDependencyValues.marginsAttr === null) {
          for (let arrayKey in desiredStateVariableValues.margins) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].essentialMargin,
              desiredValue: desiredStateVariableValues.margins[arrayKey],
            });
          }
        } else if (
          !(
            globalDependencyValues.marginsAttr.stateValues.componentSize1 &&
            Number.isFinite(
              globalDependencyValues.marginsAttr.stateValues.componentSize1
                .size,
            )
          )
        ) {
          if ("0" in desiredStateVariableValues.margins) {
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: {
                size: desiredStateVariableValues.margins[0],
                isAbsolute: globalDependencyValues.absoluteMeasurements,
              },
              variableIndex: 0,
            });
          } else {
            // if didn't specify the first margin, then set the first margin
            // to be equal to the second
            // (since if we didn't overwrite the non-numeric first margin,
            // the margins would still be null)
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: {
                size: desiredStateVariableValues.margins[1],
                isAbsolute: globalDependencyValues.absoluteMeasurements,
              },
              variableIndex: 0,
            });
          }

          if ("1" in desiredStateVariableValues.margins) {
            if (
              globalDependencyValues.marginsAttr.stateValues.numComponents > 1
            ) {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: {
                  size: desiredStateVariableValues.margins[1],
                  isAbsolute: globalDependencyValues.absoluteMeasurements,
                },
                variableIndex: 1,
              });
            }
            // if didn't have a second margin specified,
            // then we are forced to be symmetric
          }
        } else {
          let symmetricMargins =
            globalDependencyValues.marginsAttr.stateValues.numComponents === 1;

          for (let arrayKey in desiredStateVariableValues.margins) {
            if (symmetricMargins) {
              // last one wins
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: {
                  size: desiredStateVariableValues.margins[arrayKey],
                  isAbsolute: globalDependencyValues.absoluteMeasurements,
                },
                variableIndex: 0,
              });
            } else {
              let varEnding = Number(arrayKey) + 1;
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: {
                  size: desiredStateVariableValues.margins[arrayKey],
                  isAbsolute: globalDependencyValues.absoluteMeasurements,
                },
                variableIndex: arrayKey,
              });
            }
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.essentialValigns = {
      isArray: true,
      entryPrefixes: ["essentialValign"],
      defaultValueByArrayKey: () => null,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        numPanels: {
          dependencyType: "stateVariable",
          variableName: "numPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numPanels];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {
        let essentialValigns = {};
        for (let arrayKey of arrayKeys) {
          essentialValigns[arrayKey] = true;
        }

        return { useEssentialOrDefaultValue: { essentialValigns } };
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let value = {};
        for (let arrayKey in desiredStateVariableValues.essentialValigns) {
          value[arrayKey] =
            desiredStateVariableValues.essentialValigns[arrayKey];
        }

        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "essentialValigns",
              value,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.valigns = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      entryPrefixes: ["valign"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numPanels: {
          dependencyType: "stateVariable",
          variableName: "numPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numPanels];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          valignAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valign",
            variableNames: ["value"],
          },
          valignsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valigns",
            variableNames: ["numComponents"],
          },
        };
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            valignsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "valigns",
              variableNames: [`text${varEnding}`],
            },
            parentValign: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `valign${varEnding}`,
            },
            parentValignAbsolute: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `valignAbsolute${varEnding}`,
            },
            essentialValign: {
              dependencyType: "stateVariable",
              variableName: `essentialValign${varEnding}`,
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        arraySize,
      }) {
        let valigns = {};

        let nValignsSpecifiedFromAttrs;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecifiedFromAttrs =
            globalDependencyValues.valignsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.valignAttr !== null) {
          nValignsSpecifiedFromAttrs = arraySize[0];
          usingSingleValign = true;
        } else {
          nValignsSpecifiedFromAttrs = 0;
        }

        for (let arrayKey of arrayKeys) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nValignsSpecifiedFromAttrs) {
            if (usingSingleValign) {
              valigns[arrayKey] =
                globalDependencyValues.valignAttr.stateValues.value.toLowerCase();
            } else {
              let varEnding = arrayIndex + 1;
              valigns[arrayKey] =
                dependencyValuesByKey[arrayKey].valignsAttr.stateValues[
                  `text${varEnding}`
                ].toLowerCase();
            }
            if (!["top", "middle", "bottom"].includes(valigns[arrayKey])) {
              valigns[arrayKey] = "top";
            }
          } else {
            if (dependencyValuesByKey[arrayKey].parentValign) {
              if (dependencyValuesByKey[arrayKey].essentialValign === null) {
                valigns[arrayKey] =
                  dependencyValuesByKey[arrayKey].parentValign;
              } else {
                valigns[arrayKey] =
                  dependencyValuesByKey[arrayKey].essentialValign;
              }
            } else {
              if (dependencyValuesByKey[arrayKey].essentialValign === null) {
                valigns[arrayKey] = "top";
              } else {
                valigns[arrayKey] =
                  dependencyValuesByKey[arrayKey].essentialValign;
              }
            }
          }
        }

        return { setValue: { valigns } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        globalDependencyValues,
        arraySize,
      }) {
        let nValignsSpecifiedFromAttrs;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecifiedFromAttrs =
            globalDependencyValues.valignsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.valignAttr !== null) {
          nValignsSpecifiedFromAttrs = arraySize[0];
          usingSingleValign = true;
        } else {
          nValignsSpecifiedFromAttrs = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.valigns) {
          let desiredValue =
            desiredStateVariableValues.valigns[arrayKey].toLowerCase();
          if (!["top", "middle", "bottom"].includes(desiredValue)) {
            continue;
          }

          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nValignsSpecifiedFromAttrs) {
            if (usingSingleValign) {
              // last one wins
              instructions.push({
                setDependency: "valignAttr",
                desiredValue,
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].valignsAttr,
                desiredValue,
                variableIndex: 0,
              });
            }
          } else {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].essentialValign,
              desiredValue,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}

export class SbsGroup extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "sbsGroup";
  static rendererType = "containerBlock";
  static renderChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.width = {
      createComponentOfType: "_componentSize",
    };
    attributes.widths = {
      createComponentOfType: "_componentSizeList",
    };

    attributes.margins = {
      createComponentOfType: "_componentSizeList",
    };

    attributes.valign = {
      createComponentOfType: "text",
    };
    attributes.valigns = {
      createComponentOfType: "textList",
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "sideBySides",
        componentTypes: ["sideBySide"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.maxNPanelsPerRow = {
      // forRenderer: true,
      returnDependencies: () => ({
        sideBySideChildren: {
          dependencyType: "child",
          childGroups: ["sideBySides"],
          variableNames: ["numPanels"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            maxNPanelsPerRow: me.math.max(
              dependencyValues.sideBySideChildren.map(
                (x) => x.stateValues.numPanels,
              ),
            ),
          },
          checkForActualChange: { maxNPanelsPerRow: true },
        };
      },
    };

    stateVariableDefinitions.specifiedWidths = {
      additionalStateVariablesDefined: [
        {
          variableName: "widthsAbsoluteArray",
          isArray: true,
        },
      ],
      isArray: true,
      entryPrefixes: ["specifiedWidth"],
      hasEssential: true,
      defaultValueByArrayKey: () => null,
      returnArraySizeDependencies: () => ({
        maxNPanelsPerRow: {
          dependencyType: "stateVariable",
          variableName: "maxNPanelsPerRow",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.maxNPanelsPerRow];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          widthAttr: {
            dependencyType: "attributeComponent",
            attributeName: "width",
            variableNames: ["componentSize"],
          },
          widthsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "widths",
            variableNames: ["numComponents"],
          },
        };
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            widthsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "widths",
              variableNames: [`componentSize${varEnding}`],
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        arraySize,
      }) {
        let specifiedWidths = {};
        let essentialSpecifiedWidths = {};
        let widthsAbsoluteArray = {};

        let nWidthsSpecifiedFromAttrs;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecifiedFromAttrs =
            globalDependencyValues.widthsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecifiedFromAttrs = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecifiedFromAttrs = 0;
        }

        for (let arrayKey of arrayKeys) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecifiedFromAttrs) {
            if (usingSingleWidth) {
              if (globalDependencyValues.widthAttr.stateValues.componentSize) {
                specifiedWidths[arrayKey] =
                  globalDependencyValues.widthAttr.stateValues.componentSize.size;
                widthsAbsoluteArray[arrayKey] =
                  globalDependencyValues.widthAttr.stateValues.componentSize.isAbsolute;
              }
            } else {
              let varEnding = arrayIndex + 1;
              let widthComponentSize =
                dependencyValuesByKey[arrayKey].widthsAttr.stateValues[
                  `componentSize${varEnding}`
                ];

              if (widthComponentSize) {
                specifiedWidths[arrayKey] = widthComponentSize.size;
                widthsAbsoluteArray[arrayKey] = widthComponentSize.isAbsolute;
              }
            }
          } else {
            essentialSpecifiedWidths[arrayKey] = true;
            widthsAbsoluteArray[arrayKey] = null;
          }
        }

        let result = { setValue: { widthsAbsoluteArray, specifiedWidths } };

        if (Object.keys(essentialSpecifiedWidths).length > 0) {
          result.useEssentialOrDefaultValue = {
            specifiedWidths: essentialSpecifiedWidths,
          };
        }

        return result;
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        globalDependencyValues,
        stateValues,
        arraySize,
      }) {
        let nWidthsSpecified;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecified =
            globalDependencyValues.widthsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecified = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecified = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.specifiedWidths) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecified) {
            if (usingSingleWidth) {
              // last one wins
              instructions.push({
                setDependency: "widthAttr",
                desiredValue: {
                  size: desiredStateVariableValues.specifiedWidths[arrayKey],
                  isAbsolute: stateValues.widthsAbsolute,
                },
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].widthsAttr,
                desiredValue: {
                  size: desiredStateVariableValues.specifiedWidths[arrayKey],
                  isAbsolute: stateValues.widthsAbsolute,
                },
                variableIndex: 0,
              });
            }
          } else {
            instructions.push({
              setEssentialValue: "specifiedWidths",
              value: {
                [arrayKey]:
                  desiredStateVariableValues.specifiedWidths[arrayKey],
              },
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.widthsAbsolute = {
      returnDependencies: () => ({
        widthsAbsoluteArray: {
          dependencyType: "stateVariable",
          variableName: "widthsAbsoluteArray",
        },
      }),
      definition({ dependencyValues }) {
        let widthsAbsolute = null;

        for (let ind in dependencyValues.widthsAbsoluteArray) {
          let thisAbsolute = dependencyValues.widthsAbsoluteArray[ind];
          if (thisAbsolute !== null) {
            thisAbsolute = Boolean(thisAbsolute);
            if (widthsAbsolute === null) {
              widthsAbsolute = thisAbsolute;
            } else if (widthsAbsolute !== thisAbsolute) {
              throw Error(
                `SbsGroup is not implemented for absolute measurements`,
              );
              throw Error(
                `Cannot mix absolute and relative widths for sbsGroup`,
              );
            }
          }
        }

        return { setValue: { widthsAbsolute } };
      },
    };

    stateVariableDefinitions.specifiedMargins = {
      additionalStateVariablesDefined: [
        {
          variableName: "marginsAbsoluteArray",
          isArray: true,
          entryPrefixes: ["marginAbsolute"],
        },
      ],
      isArray: true,
      entryPrefixes: ["specifiedMargin"],
      hasEssential: true,
      defaultValueByArrayKey: () => null,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          marginsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "margins",
            variableNames: [
              "componentSize1",
              "componentSize2",
              "numComponents",
            ],
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({
        dependencyValuesByKey,
        globalDependencyValues,
        arrayKeys,
      }) {
        let specifiedMargins = {};
        let essentialSpecifiedMargins = {};
        let marginsAbsoluteArray = {};

        if (
          globalDependencyValues.marginsAttr === null ||
          globalDependencyValues.marginsAttr.stateValues.numComponents === 0
        ) {
          for (let arrayKey of arrayKeys) {
            essentialSpecifiedMargins[arrayKey] = true;
            marginsAbsoluteArray[arrayKey] = null;
          }
        } else if (
          globalDependencyValues.marginsAttr.stateValues.numComponents === 1
        ) {
          let margin = null,
            absolute = null;
          if (globalDependencyValues.marginsAttr.stateValues.componentSize1) {
            margin =
              globalDependencyValues.marginsAttr.stateValues.componentSize1
                .size;
            if (!Number.isFinite(margin)) {
              margin = null;
            }
            absolute = Boolean(
              globalDependencyValues.marginsAttr.stateValues.componentSize1
                .isAbsolute,
            );
          }
          for (let arrayKey of arrayKeys) {
            specifiedMargins[arrayKey] = margin;
            marginsAbsoluteArray[arrayKey] = absolute;
          }
        } else {
          // two (or more) components of marginsAttr
          for (let arrayKey of arrayKeys) {
            if (
              globalDependencyValues.marginsAttr.stateValues[
                `componentSize${Number(arrayKey) + 1}`
              ]
            ) {
              let margin =
                globalDependencyValues.marginsAttr.stateValues[
                  `componentSize${Number(arrayKey) + 1}`
                ].size;
              if (!Number.isFinite(margin)) {
                margin = null;
              }
              let absolute = Boolean(
                globalDependencyValues.marginsAttr.stateValues[
                  `componentSize${Number(arrayKey) + 1}`
                ].isAbsolute,
              );

              specifiedMargins[arrayKey] = margin;
              marginsAbsoluteArray[arrayKey] = absolute;
            }
          }
        }

        let result = { setValue: { marginsAbsoluteArray, specifiedMargins } };

        if (Object.keys(essentialSpecifiedMargins).length > 0) {
          result.useEssentialOrDefaultValue = {
            specifiedMargins: essentialSpecifiedMargins,
          };
        }

        return result;
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        globalDependencyValues,
        stateValues,
      }) {
        let instructions = [];

        if (globalDependencyValues.marginsAttr === null) {
          instructions.push({
            setEssentialValue: "specifiedMargins",
            value: desiredStateVariableValues.specifiedMargins,
          });
        } else if (
          !(
            globalDependencyValues.marginsAttr.stateValues.componentSize1 &&
            Number.isFinite(
              globalDependencyValues.marginsAttr.stateValues.componentSize1
                .size,
            )
          )
        ) {
          if ("0" in desiredStateVariableValues.specifiedMargins) {
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: {
                size: desiredStateVariableValues.specifiedMargins[0],
                isAbsolute: await stateValues.marginsAbsolute,
              },
              variableIndex: 0,
            });
          } else {
            // if didn't specify the first margin, then set the first margin
            // to be equal to the second
            // (since if we didn't overwrite the non-numeric first margin,
            // the margins would still be null)
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: {
                size: desiredStateVariableValues.specifiedMargins[1],
                isAbsolute: await stateValues.marginsAbsolute,
              },
              variableIndex: 0,
            });
          }

          if ("1" in desiredStateVariableValues.specifiedMargins) {
            if (
              globalDependencyValues.marginsAttr.stateValues.numComponents > 1
            ) {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: {
                  size: desiredStateVariableValues.specifiedMargins[1],
                  isAbsolute: await stateValues.marginsAbsolute,
                },
                variableIndex: 1,
              });
            }
            // if didn't have a second margin specified,
            // then we are forced to be symmetric
          }
        } else {
          let symmetricMargins =
            globalDependencyValues.marginsAttr.stateValues.numComponents === 1;

          for (let arrayKey in desiredStateVariableValues.specifiedMargins) {
            if (symmetricMargins) {
              // last one wins
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: {
                  size: desiredStateVariableValues.specifiedMargins[arrayKey],
                  isAbsolute: await stateValues.marginsAbsolute,
                },
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: {
                  size: desiredStateVariableValues.specifiedMargins[arrayKey],
                  isAbsolute: await stateValues.marginsAbsolute,
                },
                variableIndex: arrayKey,
              });
            }
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.marginsAbsolute = {
      returnDependencies: () => ({
        marginsAbsoluteArray: {
          dependencyType: "stateVariable",
          variableName: "marginsAbsoluteArray",
        },
      }),
      definition({ dependencyValues }) {
        let marginsAbsolute = null;

        for (let ind in dependencyValues.marginsAbsoluteArray) {
          let thisAbsolute = dependencyValues.marginsAbsoluteArray[ind];
          if (thisAbsolute !== null) {
            thisAbsolute = Boolean(thisAbsolute);
            if (marginsAbsolute === null) {
              marginsAbsolute = thisAbsolute;
            } else if (marginsAbsolute !== thisAbsolute) {
              throw Error(
                `SbsGroup is not implemented for absolute measurements`,
              );
              throw Error(
                `Cannot mix absolute and relative margins for sbsGroup`,
              );
            }
          }
        }

        return { setValue: { marginsAbsolute } };
      },
    };

    stateVariableDefinitions.absoluteMeasurements = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      // forRenderer: true,
      returnDependencies: () => ({
        widthsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "widthsAbsolute",
        },
        marginsAbsolute: {
          dependencyType: "stateVariable",
          variableName: "marginsAbsolute",
        },
      }),
      definition({ dependencyValues }) {
        let absoluteMeasurements;
        if (dependencyValues.widthsAbsolute === null) {
          if (dependencyValues.marginsAbsolute === null) {
            absoluteMeasurements = false;
          } else {
            absoluteMeasurements = dependencyValues.marginsAbsolute;
          }
        } else {
          if (dependencyValues.marginsAbsolute === null) {
            absoluteMeasurements = dependencyValues.widthsAbsolute;
          } else {
            if (
              dependencyValues.widthsAbsolute !==
              dependencyValues.marginsAbsolute
            ) {
              throw Error(
                `SbsGroup is not implemented for absolute measurements`,
              );
              throw Error(
                `Cannot mix absolute and relative widths and margins for sbsGroup`,
              );
            }
            absoluteMeasurements = dependencyValues.widthsAbsolute;
          }
        }

        if (absoluteMeasurements === true) {
          throw Error(`SbsGroup is not implemented for absolute measurements`);
        }

        return { setValue: { absoluteMeasurements } };
      },
    };

    stateVariableDefinitions.allWidths = {
      additionalStateVariablesDefined: [
        "allMargins",
        {
          variableName: "gapWidth",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "number",
          },
          // forRenderer: true
        },
      ],
      returnDependencies: () => ({
        maxNPanelsPerRow: {
          dependencyType: "stateVariable",
          variableName: "maxNPanelsPerRow",
        },
        specifiedWidths: {
          dependencyType: "stateVariable",
          variableName: "specifiedWidths",
        },
        specifiedMargins: {
          dependencyType: "stateVariable",
          variableName: "specifiedMargins",
        },
        absoluteMeasurements: {
          dependencyType: "stateVariable",
          variableName: "absoluteMeasurements",
        },
      }),
      definition({ dependencyValues }) {
        let gapWidth = 0;
        let allWidths = [...dependencyValues.specifiedWidths];
        let allMargins = [...dependencyValues.specifiedMargins];

        let totalWidthSpecified = 0;
        let nWidthsUndefined = 0;

        for (let ind = 0; ind < dependencyValues.maxNPanelsPerRow; ind++) {
          let width = allWidths[ind];
          if (width === null) {
            nWidthsUndefined++;
          } else {
            totalWidthSpecified += width;
          }
        }

        let totalMarginSpecified = 0;
        let nMarginsUndefined = 0;

        for (let ind = 0; ind < 2; ind++) {
          let margin = allMargins[ind];
          if (margin === null) {
            nMarginsUndefined++;
          } else {
            totalMarginSpecified += margin;
          }
        }
        totalMarginSpecified *= dependencyValues.maxNPanelsPerRow;

        if (!dependencyValues.absoluteMeasurements) {
          if (totalWidthSpecified + totalMarginSpecified >= 100) {
            // we are already over 100%
            // anything null becomes width 0
            // everything else is normalized to add up to 100

            let normalization =
              100 / (totalWidthSpecified + totalMarginSpecified);
            for (let ind = 0; ind < dependencyValues.maxNPanelsPerRow; ind++) {
              if (allWidths[ind] === null) {
                allWidths[ind] = 0;
              } else {
                allWidths[ind] *= normalization;
              }
            }
            for (let ind = 0; ind < 2; ind++) {
              let margin = allMargins[ind];
              if (margin === null) {
                allMargins[ind] = 0;
              } else {
                allMargins[ind] *= normalization;
              }
            }
          } else {
            // since we are under 100%, we try the following to get to 100%
            // 1. if there are any null widths,
            //    define them to be the same value that makes the total 100%
            //    and make any null margins be zero
            // 2. else, if there are any null margins,
            //    define them to be the same value that makes the total 100%
            // 3. else if there two or panels, set gapWidth to make the total 100%
            // 4. else if there is one panel, expand the right margin
            // 5. do nothing (child groups aren't matched)

            if (nWidthsUndefined > 0) {
              let newWidth =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                nWidthsUndefined;
              for (
                let ind = 0;
                ind < dependencyValues.maxNPanelsPerRow;
                ind++
              ) {
                if (allWidths[ind] === null) {
                  allWidths[ind] = newWidth;
                }
              }

              for (let ind = 0; ind < 2; ind++) {
                let margin = allMargins[ind];
                if (margin === null) {
                  allMargins[ind] = 0;
                }
              }
            } else if (nMarginsUndefined > 0) {
              let newMargin =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                (nMarginsUndefined * dependencyValues.maxNPanelsPerRow);
              for (let ind = 0; ind < 2; ind++) {
                if (allMargins[ind] === null) {
                  allMargins[ind] = newMargin;
                }
              }
            } else if (dependencyValues.maxNPanelsPerRow > 1) {
              gapWidth =
                (100 - (totalWidthSpecified + totalMarginSpecified)) /
                (dependencyValues.maxNPanelsPerRow - 1);
            } else if (dependencyValues.maxNPanelsPerRow === 1) {
              allMargins[1] = 100 - (allMargins[0] + allWidths[0]);
            } else {
              console.warn(
                "Invalid sideBySide, as it must have at least one block child",
              );
            }
          }
        } else {
          // we won't reach here, as we throw an error about not implementing
          // absolute measurements before get this far
        }

        return { setValue: { allWidths, allMargins, gapWidth } };
      },
    };

    stateVariableDefinitions.widths = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      entryPrefixes: ["width"],
      // forRenderer: true,
      returnArraySizeDependencies: () => ({
        maxNPanelsPerRow: {
          dependencyType: "stateVariable",
          variableName: "maxNPanelsPerRow",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.maxNPanelsPerRow];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          allWidths: {
            dependencyType: "stateVariable",
            variableName: `allWidths`,
          },
        };

        // Note: the specifiedWidth dependency is used only in the inverse direction
        // to facilitate single keys being changed at a time
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            specifiedWidth: {
              dependencyType: "stateVariable",
              variableName: `specifiedWidth${varEnding}`,
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let widths = {};
        for (let arrayKey of arrayKeys) {
          widths[arrayKey] = globalDependencyValues.allWidths[arrayKey];
        }

        return { setValue: { widths } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.widths) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].specifiedWidth,
            desiredValue: desiredStateVariableValues.widths[arrayKey],
            variableIndex: 0,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.margins = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      entryPrefixes: ["margin"],
      // forRenderer: true,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          allMargins: {
            dependencyType: "stateVariable",
            variableName: `allMargins`,
          },
        };

        // Note: the specifiedMargin dependency is used only in the inverse direction
        // to facilitate single keys being changed at a time
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            specifiedMargin: {
              dependencyType: "stateVariable",
              variableName: `specifiedMargin${varEnding}`,
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
        let margins = {};
        for (let arrayKey of arrayKeys) {
          margins[arrayKey] = globalDependencyValues.allMargins[arrayKey];
        }

        return { setValue: { margins } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.margins) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].specifiedMargin,
            desiredValue: desiredStateVariableValues.margins[arrayKey],
            variableIndex: 0,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.valigns = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      entryPrefixes: ["valign"],
      // forRenderer: true,
      hasEssential: true,
      defaultValueByArrayKey: () => "top",
      returnArraySizeDependencies: () => ({
        maxNPanelsPerRow: {
          dependencyType: "stateVariable",
          variableName: "maxNPanelsPerRow",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.maxNPanelsPerRow];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          valignAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valign",
            variableNames: ["value"],
          },
          valignsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valigns",
            variableNames: ["numComponents"],
          },
        };
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            valignsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "valigns",
              variableNames: [`text${varEnding}`],
            },
          };
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        arraySize,
      }) {
        let valigns = {};
        let essentialValigns = {};

        let nValignsSpecified;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecified =
            globalDependencyValues.valignsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.valignAttr !== null) {
          nValignsSpecified = arraySize[0];
          usingSingleValign = true;
        } else {
          nValignsSpecified = 0;
        }

        for (let arrayKey of arrayKeys) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nValignsSpecified) {
            if (usingSingleValign) {
              valigns[arrayKey] =
                globalDependencyValues.valignAttr.stateValues.value.toLowerCase();
            } else {
              let varEnding = arrayIndex + 1;
              valigns[arrayKey] =
                dependencyValuesByKey[arrayKey].valignsAttr.stateValues[
                  `text${varEnding}`
                ].toLowerCase();
            }
            if (!["top", "middle", "bottom"].includes(valigns[arrayKey])) {
              valigns[arrayKey] = "top";
            }
          } else {
            essentialValigns[arrayKey] = true;
          }
        }

        let result = {};

        if (Object.keys(valigns).length > 0) {
          result.setValue = { valigns };
        }
        if (Object.keys(essentialValigns).length > 0) {
          result.useEssentialOrDefaultValue = { valigns: essentialValigns };
        }

        return result;
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        globalDependencyValues,
        arraySize,
      }) {
        let nValignsSpecified;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecified =
            globalDependencyValues.valignsAttr.stateValues.numComponents;
        } else if (globalDependencyValues.valignAttr !== null) {
          nValignsSpecified = arraySize[0];
          usingSingleValign = true;
        } else {
          nValignsSpecified = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.valigns) {
          let desiredValue =
            desiredStateVariableValues.valigns[arrayKey].toLowerCase();
          if (!["top", "middle", "bottom"].includes(desiredValue)) {
            continue;
          }

          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nValignsSpecified) {
            if (usingSingleValign) {
              // last one wins
              instructions.push({
                setDependency: "valignAttr",
                desiredValue,
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].valignsAttr,
                desiredValue,
                variableIndex: 0,
              });
            }
          } else {
            instructions.push({
              setEssentialValue: "valigns",
              value: { [arrayKey]: desiredValue },
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    return stateVariableDefinitions;
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}

export class Stack extends BlockComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      recordVisibilityChange: this.recordVisibilityChange.bind(this),
    });
  }
  static componentType = "stack";
  static rendererType = "containerBlock";
  static renderChildren = true;

  static includeBlankStringChildren = true;

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  recordVisibilityChange({ isVisible }) {
    this.coreFunctions.requestRecordEvent({
      verb: "visibilityChanged",
      object: {
        componentName: this.componentName,
        componentType: this.componentType,
      },
      result: { isVisible },
    });
  }
}
