import BlockComponent from './abstract/BlockComponent';
import me from 'math-expressions';

export class SideBySide extends BlockComponent {
  static componentType = "sideBySide";
  static rendererType = "container";
  static renderChildren = true;

  static get stateVariablesShadowedForReference() { return ["widths", "margins", "valigns"] };


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.width = {
      createComponentOfType: "_componentSize",
    };
    attributes.widths = {
      createComponentOfType: "_componentSizeList",
    };

    attributes.margins = {
      createComponentOfType: "_componentSizeList"
    }

    attributes.valign = {
      createComponentOfType: "text"
    }
    attributes.valigns = {
      createComponentOfType: "textList"
    }

    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atLeastZeroBlocks',
      componentType: '_block',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nPanels = {
      forRenderer: true,
      returnDependencies: () => ({
        blockChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroBlocks",
          skipComponentNames: true,
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { nPanels: dependencyValues.blockChildren.length },
          checkForActualChange: { nPanels: true }
        }
      }
    }


    // have separate state variable for essential widths so that
    // if have a parent sbsgroup, can determine which widths have been changed
    // and so should override the parent sbsGroup width
    stateVariableDefinitions.essentialWidths = {
      isArray: true,
      entryPrefixes: ["essentialWidth"],
      defaultEntryValue: undefined,
      returnArraySizeDependencies: () => ({
        nPanels: {
          dependencyType: "stateVariable",
          variableName: "nPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPanels];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {

        let essentialWidths = {};
        for (let arrayKey of arrayKeys) {
          essentialWidths[arrayKey] = {};
        }

        return { useEssentialOrDefaultValue: { essentialWidths } }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {

        let value = {};
        for (let arrayKey in desiredStateVariableValues.essentialWidths) {
          value[arrayKey] = desiredStateVariableValues.essentialWidths[arrayKey];
        }

        return {
          success: true,
          instructions: [{
            setStateVariable: "essentialWidths",
            value
          }]
        }
      }

    }

    stateVariableDefinitions.widths = {
      additionalStateVariablesDefined: [{
        variableName: "widthsAbsolute",
        isArray: true,
        entryPrefixes: ["widthAbsolute"],
        public: true,
        componentType: "boolean",
        defaultEntryValue: false,
        forRenderer: true,
      }],
      public: true,
      isArray: true,
      componentType: "number",
      entryPrefixes: ["width"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nPanels: {
          dependencyType: "stateVariable",
          variableName: "nPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPanels];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          widthAttr: {
            dependencyType: "attributeComponent",
            attributeName: "width",
            variableNames: ["value", "isAbsolute"]
          },
          widthsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "widths",
            variableNames: ["nComponents"]
          }
        }
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            widthsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "widths",
              variableNames: [`componentSize${varEnding}`, `isAbsolute${varEnding}`],
            },
            parentWidth: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `width${varEnding}`
            },
            parentWidthAbsolute: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `widthAbsolute${varEnding}`
            },
            essentialWidth: {
              dependencyType: "stateVariable",
              variableName: `essentialWidth${varEnding}`
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys, arraySize, usedDefault }) {
        let widths = {};
        let widthsAbsolute = {};
        let essentialWidthsAbsolute = {};

        let nWidthsSpecified;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecified = globalDependencyValues.widthsAttr.stateValues.nComponents
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecified = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecified = 0;
        }


        for (let arrayKey of arrayKeys) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecified) {
            if (usingSingleWidth) {
              widths[arrayKey] = globalDependencyValues.widthAttr.stateValues.value;
              widthsAbsolute[arrayKey] = globalDependencyValues.widthAttr.stateValues.isAbsolute;
            } else {
              let varEnding = arrayIndex + 1;
              let widthsState = dependencyValuesByKey[arrayKey].widthsAttr.stateValues;
              widths[arrayKey] = widthsState[`componentSize${varEnding}`];
              widthsAbsolute[arrayKey] = widthsState[`isAbsolute${varEnding}`];
            }
          } else {
            if (Number.isFinite(dependencyValuesByKey[arrayKey].parentWidth)) {
              if (dependencyValuesByKey[arrayKey].essentialWidth === undefined) {
                widths[arrayKey] = dependencyValuesByKey[arrayKey].parentWidth;
              } else {
                widths[arrayKey] = dependencyValuesByKey[arrayKey].essentialWidth;
              }
              widthsAbsolute[arrayKey] = dependencyValuesByKey[arrayKey].parentWidthAbsolute;

            } else {
              widths[arrayKey] = dependencyValuesByKey[arrayKey].essentialWidth;
              essentialWidthsAbsolute[arrayKey] = {};
            }
          }
        }

        let result = { newValues: { widths } }

        if (Object.keys(widthsAbsolute).length > 0) {
          result.newValues.widthsAbsolute = widthsAbsolute;
        }
        if (Object.keys(essentialWidthsAbsolute).length > 0) {
          result.useEssentialOrDefaultValue = {
            widthsAbsolute: essentialWidthsAbsolute
          }
        }

        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey,
        globalDependencyValues, arraySize
      }) {

        let nWidthsSpecified;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecified = globalDependencyValues.widthsAttr.stateValues.nComponents
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecified = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecified = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.widths) {

          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecified) {
            if (usingSingleWidth) {
              // last one wins
              instructions.push({
                setDependency: "widthAttr",
                desiredValue: desiredStateVariableValues.widths[arrayKey],
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].widthsAttr,
                desiredValue: desiredStateVariableValues.widths[arrayKey],
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
          instructions
        }


      }
    }

    stateVariableDefinitions.essentialMargins = {
      isArray: true,
      entryPrefixes: ["essentialMargin"],
      defaultEntryValue: undefined,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {

        let essentialMargins = {};
        for (let arrayKey of arrayKeys) {
          essentialMargins[arrayKey] = {};
        }

        return { useEssentialOrDefaultValue: { essentialMargins } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {

        let value = {};
        for (let arrayKey in desiredStateVariableValues.essentialMargins) {
          value[arrayKey] = desiredStateVariableValues.essentialMargins[arrayKey];
        }

        return {
          success: true,
          instructions: [{
            setStateVariable: "essentialMargins",
            value
          }]
        }
      }
    }

    stateVariableDefinitions.margins = {
      additionalStateVariablesDefined: [{
        variableName: "marginsAbsolute",
        isArray: true,
        entryPrefixes: ["marginAbsolute"],
        public: true,
        componentType: "boolean",
        defaultEntryValue: false,
        forRenderer: true,
      }],
      public: true,
      isArray: true,
      componentType: "number",
      entryPrefixes: ["margin"],
      forRenderer: true,
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
              "componentSize1", "componentSize2",
              "isAbsolute1", "isAbsolute2",
              "nComponents",
            ]
          },
        }

        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            parentMargin: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `margin${varEnding}`
            },
            parentMarginAbsolute: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `marginAbsolute${varEnding}`
            },
            essentialMargin: {
              dependencyType: "stateVariable",
              variableName: `essentialMargin${varEnding}`
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        let margins = {};
        let marginsAbsolute = {};
        let essentialMarginsAbsolute = {};

        if (globalDependencyValues.marginsAttr === null) {

          for (let arrayKey of arrayKeys) {

            if (Number.isFinite(dependencyValuesByKey[arrayKey].parentMargin)) {
              if (dependencyValuesByKey[arrayKey].essentialMargin === undefined) {
                margins[arrayKey] = dependencyValuesByKey[arrayKey].parentMargin;
              } else {
                margins[arrayKey] = dependencyValuesByKey[arrayKey].essentialMargin;
              }
              marginsAbsolute[arrayKey] = dependencyValuesByKey[arrayKey].parentMarginAbsolute;

            } else {
              margins[arrayKey] = dependencyValuesByKey[arrayKey].essentialMargin;
              essentialMarginsAbsolute[arrayKey] = {};
            }
          }

        } else if (!Number.isFinite(globalDependencyValues.marginsAttr.stateValues.componentSize1)) {
          // since attribute margins="auto" should give default behavior
          // of not specifying margins,
          // just give this default behavior if a non-numeric first margin is specified
          for (let arrayKey of arrayKeys) {
            margins[arrayKey] = undefined;
            marginsAbsolute[arrayKey] = false;
          }
        } else {
          let symmetricMargins = globalDependencyValues.marginsAttr.stateValues.nComponents === 1;

          for (let arrayKey of arrayKeys) {
            if (symmetricMargins) {
              margins[arrayKey] = globalDependencyValues.marginsAttr.stateValues.componentSize1;
              marginsAbsolute[arrayKey] = globalDependencyValues.marginsAttr.stateValues.isAbsolute1;
            } else {
              let varEnding = Number(arrayKey) + 1;
              margins[arrayKey] = globalDependencyValues.marginsAttr.stateValues[`componentSize${varEnding}`];
              marginsAbsolute[arrayKey] = globalDependencyValues.marginsAttr.stateValues[`isAbsolute${varEnding}`];
            }
          }
        }

        let result = { newValues: { margins } }

        if (Object.keys(marginsAbsolute).length > 0) {
          result.newValues.marginsAbsolute = marginsAbsolute;
        }
        if (Object.keys(essentialMarginsAbsolute).length > 0) {
          result.useEssentialOrDefaultValue = { marginsAbsolute: essentialMarginsAbsolute }
        }

        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        globalDependencyValues, dependencyNamesByKey
      }) {

        let instructions = [];

        if (globalDependencyValues.marginsAttr === null) {
          for (let arrayKey in desiredStateVariableValues.margins) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].essentialMargin,
              desiredValue: desiredStateVariableValues.margins[arrayKey],
            });
          }
        } else if (!Number.isFinite(globalDependencyValues.marginsAttr.stateValues.componentSize1)) {

          if ("0" in desiredStateVariableValues.margins) {
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: desiredStateVariableValues.margins[0],
              variableIndex: 0,
            });
          } else {
            // if didn't specify the first margin, then set the first margin
            // to be equal to the second
            // (since if we didn't overwrite the non-numeric first margin,
            // the margins would still be undefined)
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: desiredStateVariableValues.margins[1],
              variableIndex: 0,
            });
          }

          if ("1" in desiredStateVariableValues.margins) {
            if (globalDependencyValues.marginsAttr.stateValues.nComponents > 1) {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: desiredStateVariableValues.margins[1],
                variableIndex: 1,
              });
            }
            // if didn't have a second margin specified,
            // then we are forced to be symmetric
          }


        } else {

          let symmetricMargins = globalDependencyValues.marginsAttr.stateValues.nComponents === 1;

          for (let arrayKey in desiredStateVariableValues.margins) {
            if (symmetricMargins) {
              // last one wins
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: desiredStateVariableValues.margins[arrayKey],
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: desiredStateVariableValues.margins[arrayKey],
                variableIndex: arrayKey,
              });
            }

          }

        }

        return {
          success: true,
          instructions
        }


      }
    }

    stateVariableDefinitions.essentialValigns = {
      isArray: true,
      entryPrefixes: ["essentialValign"],
      defaultEntryValue: undefined,
      returnArraySizeDependencies: () => ({
        nPanels: {
          dependencyType: "stateVariable",
          variableName: "nPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPanels];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {

        let essentialValigns = {};
        for (let arrayKey of arrayKeys) {
          essentialValigns[arrayKey] = {};
        }

        return { useEssentialOrDefaultValue: { essentialValigns } }
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {

        let value = {};
        for (let arrayKey in desiredStateVariableValues.essentialValigns) {
          value[arrayKey] = desiredStateVariableValues.essentialValigns[arrayKey];
        }

        return {
          success: true,
          instructions: [{
            setStateVariable: "essentialValigns",
            value
          }]
        }
      }

    }


    stateVariableDefinitions.valigns = {
      public: true,
      isArray: true,
      componentType: "text",
      entryPrefixes: ["valign"],
      defaultEntryValue: "top",
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        nPanels: {
          dependencyType: "stateVariable",
          variableName: "nPanels",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nPanels];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          valignAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valign",
            variableNames: ["value"]
          },
          valignsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valigns",
            variableNames: ["nComponents"]
          }
        }
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
              variableName: `valign${varEnding}`
            },
            parentValignAbsolute: {
              dependencyType: "parentStateVariable",
              parentComponentType: "sbsGroup",
              variableName: `valignAbsolute${varEnding}`
            },
            essentialValign: {
              dependencyType: "stateVariable",
              variableName: `essentialValign${varEnding}`
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys, arraySize }) {
        let valigns = {};

        let nValignsSpecified;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecified = globalDependencyValues.valignsAttr.stateValues.nComponents
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
              valigns[arrayKey] = globalDependencyValues.valignAttr.stateValues.value.toLowerCase();

            } else {
              let varEnding = arrayIndex + 1;
              valigns[arrayKey] = dependencyValuesByKey[arrayKey].valignsAttr.stateValues[`text${varEnding}`].toLowerCase();
            }
            if (!["top", "middle", "bottom"].includes(valigns[arrayKey])) {
              valigns[arrayKey] = "top";
            }
          } else {
            if (dependencyValuesByKey[arrayKey].parentValign) {
              if (dependencyValuesByKey[arrayKey].essentialValign === undefined) {
                valigns[arrayKey] = dependencyValuesByKey[arrayKey].parentValign;
              } else {
                valigns[arrayKey] = dependencyValuesByKey[arrayKey].essentialValign;
              }
            } else {
              valigns[arrayKey] = dependencyValuesByKey[arrayKey].essentialValign;
            }
          }
        }

        return { newValues: { valigns } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, globalDependencyValues, arraySize
      }) {

        let nValignsSpecified;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecified = globalDependencyValues.valignsAttr.stateValues.nComponents
        } else if (globalDependencyValues.valignAttr !== null) {
          nValignsSpecified = arraySize[0];
          usingSingleValign = true;
        } else {
          nValignsSpecified = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.valigns) {

          let desiredValue = desiredStateVariableValues.valigns[arrayKey].toLowerCase();
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
              setDependency: dependencyNamesByKey[arrayKey].essentialValign,
              desiredValue,
            })
          }

        }

        return {
          success: true,
          instructions
        }


      }
    }


    return stateVariableDefinitions;
  }
}



export class SbsGroup extends BlockComponent {
  static componentType = "sbsGroup";
  static rendererType = "container";
  static renderChildren = true;

  static get stateVariablesShadowedForReference() { return ["widths", "margins", "valigns"] };


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.width = {
      createComponentOfType: "_componentSize",
    };
    attributes.widths = {
      createComponentOfType: "_componentSizeList",
    };

    attributes.margins = {
      createComponentOfType: "_componentSizeList"
    }

    attributes.valign = {
      createComponentOfType: "text"
    }
    attributes.valigns = {
      createComponentOfType: "textList"
    }

    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atLeastZeroSideBySides',
      componentType: 'sideBySide',
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.maxNPanelsPerRow = {
      forRenderer: true,
      returnDependencies: () => ({
        sideBySideChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroSideBySides",
          variableNames: ["nPanels"]
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            maxNPanelsPerRow:
              me.math.max(
                dependencyValues.sideBySideChildren.map(x => x.stateValues.nPanels)
              )
          },
          checkForActualChange: { maxNPanelsPerRow: true }
        }
      }
    }

    stateVariableDefinitions.widths = {
      additionalStateVariablesDefined: [{
        variableName: "widthsAbsolute",
        isArray: true,
        entryPrefixes: ["widthAbsolute"],
        public: true,
        componentType: "boolean",
        defaultEntryValue: false,
        forRenderer: true,
      }],
      public: true,
      isArray: true,
      componentType: "number",
      entryPrefixes: ["width"],
      defaultEntryValue: undefined,
      forRenderer: true,
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
            variableNames: ["value", "isAbsolute"]
          },
          widthsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "widths",
            variableNames: ["nComponents"]
          }
        }
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            widthsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "widths",
              variableNames: [`componentSize${varEnding}`, `isAbsolute${varEnding}`],
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys, arraySize }) {
        let widths = {};
        let widthsAbsolute = {};
        let essentialWidths = {};
        let essentialWidthsAbsolute = {};

        let nWidthsSpecified;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecified = globalDependencyValues.widthsAttr.stateValues.nComponents
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecified = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecified = 0;
        }


        for (let arrayKey of arrayKeys) {
          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecified) {
            if (usingSingleWidth) {
              widths[arrayKey] = globalDependencyValues.widthAttr.stateValues.value;
              widthsAbsolute[arrayKey] = globalDependencyValues.widthAttr.stateValues.isAbsolute;
            } else {
              let varEnding = arrayIndex + 1;
              let widthsState = dependencyValuesByKey[arrayKey].widthsAttr.stateValues;
              widths[arrayKey] = widthsState[`componentSize${varEnding}`];
              widthsAbsolute[arrayKey] = widthsState[`isAbsolute${varEnding}`];
            }
          } else {
            essentialWidths[arrayKey] = {};
            essentialWidthsAbsolute[arrayKey] = {};
          }
        }

        let result = {};

        if (Object.keys(widths).length > 0) {
          result.newValues = { widths, widthsAbsolute };
        }
        if (Object.keys(essentialWidths).length > 0) {
          result.useEssentialOrDefaultValue = {
            widths: essentialWidths,
            widthsAbsolute: essentialWidthsAbsolute
          }
        }

        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, globalDependencyValues, arraySize
      }) {

        let nWidthsSpecified;
        let usingSingleWidth = false;

        if (globalDependencyValues.widthsAttr !== null) {
          nWidthsSpecified = globalDependencyValues.widthsAttr.stateValues.nComponents
        } else if (globalDependencyValues.widthAttr !== null) {
          nWidthsSpecified = arraySize[0];
          usingSingleWidth = true;
        } else {
          nWidthsSpecified = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.widths) {

          let arrayIndex = Number(arrayKey);

          if (arrayIndex < nWidthsSpecified) {
            if (usingSingleWidth) {
              // last one wins
              instructions.push({
                setDependency: "widthAttr",
                desiredValue: desiredStateVariableValues.widths[arrayKey],
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].widthsAttr,
                desiredValue: desiredStateVariableValues.widths[arrayKey],
                variableIndex: 0,
              });
            }
          } else {
            instructions.push({
              setStateVariable: "widths",
              value: { [arrayKey]: desiredStateVariableValues.widths[arrayKey] },
            })
          }


        }

        return {
          success: true,
          instructions
        }


      }
    }


    stateVariableDefinitions.margins = {
      additionalStateVariablesDefined: [{
        variableName: "marginsAbsolute",
        isArray: true,
        entryPrefixes: ["marginAbsolute"],
        public: true,
        componentType: "boolean",
        defaultEntryValue: false,
        forRenderer: true,
      }],
      public: true,
      isArray: true,
      componentType: "number",
      entryPrefixes: ["margin"],
      defaultEntryValue: undefined,
      forRenderer: true,
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          marginsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "margins",
            variableNames: [
              "componentSize1", "componentSize2",
              "isAbsolute1", "isAbsolute2",
              "nComponents",
            ]
          },
        }
        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {

        if (globalDependencyValues.marginsAttr === null ||
          !Number.isFinite(globalDependencyValues.marginsAttr.stateValues.componentSize1)
        ) {
          // since attribute margins="auto" should give default behavior
          // of not specifying margins,
          // just give this default behavior if a non-numeric first margin is specified
          return {
            useEssentialOrDefaultValue: {
              margins: { 0: {}, 1: {} },
              marginsAbsolute: { 0: {}, 1: {} },
            }
          }
        }

        let margins = {};
        let marginsAbsolute = {};
        let symmetricMargins = globalDependencyValues.marginsAttr.stateValues.nComponents === 1;

        for (let arrayKey of arrayKeys) {
          if (symmetricMargins) {
            margins[arrayKey] = globalDependencyValues.marginsAttr.stateValues.componentSize1;
            marginsAbsolute[arrayKey] = globalDependencyValues.marginsAttr.stateValues.isAbsolute1;
          } else {
            let varEnding = Number(arrayKey) + 1;
            margins[arrayKey] = globalDependencyValues.marginsAttr.stateValues[`componentSize${varEnding}`];
            marginsAbsolute[arrayKey] = globalDependencyValues.marginsAttr.stateValues[`isAbsolute${varEnding}`];
          }
        }

        return { newValues: { margins, marginsAbsolute } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        globalDependencyValues,
      }) {

        let instructions = [];

        if (globalDependencyValues.marginsAttr === null) {
          for (let arrayKey in desiredStateVariableValues.margins) {
            instructions.push({
              setStateVariable: "margins",
              value: { [arrayKey]: desiredStateVariableValues.margins[arrayKey] },
            })
          }
        } else if (!Number.isFinite(globalDependencyValues.marginsAttr.stateValues.componentSize1)) {

          if ("0" in desiredStateVariableValues.margins) {
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: desiredStateVariableValues.margins[0],
              variableIndex: 0,
            });
          } else {
            // if didn't specify the first margin, then set the first margin
            // to be equal to the second
            // (since if we didn't overwrite the non-numeric first margin,
            // the margins would still be undefined)
            instructions.push({
              setDependency: "marginsAttr",
              desiredValue: desiredStateVariableValues.margins[1],
              variableIndex: 0,
            });
          }


          if ("1" in desiredStateVariableValues.margins) {
            if (globalDependencyValues.marginsAttr.stateValues.nComponents > 1) {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: desiredStateVariableValues.margins[1],
                variableIndex: 1,
              });
            }
            // if didn't have a second margin specified,
            // then we are forced to be symmetric
          }


        } else {

          let symmetricMargins = globalDependencyValues.marginsAttr.stateValues.nComponents === 1;

          for (let arrayKey in desiredStateVariableValues.margins) {
            if (symmetricMargins) {
              // last one wins
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: desiredStateVariableValues.margins[arrayKey],
                variableIndex: 0,
              });
            } else {
              instructions.push({
                setDependency: "marginsAttr",
                desiredValue: desiredStateVariableValues.margins[arrayKey],
                variableIndex: arrayKey,
              });
            }

          }

        }

        return {
          success: true,
          instructions
        }


      }
    }

    stateVariableDefinitions.valigns = {
      public: true,
      isArray: true,
      componentType: "text",
      entryPrefixes: ["valign"],
      defaultEntryValue: "top",
      forRenderer: true,
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
            variableNames: ["value"]
          },
          valignsAttr: {
            dependencyType: "attributeComponent",
            attributeName: "valigns",
            variableNames: ["nComponents"]
          }
        }
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            valignsAttr: {
              dependencyType: "attributeComponent",
              attributeName: "valigns",
              variableNames: [`text${varEnding}`],
            }
          }
        }
        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys, arraySize }) {
        let valigns = {};
        let essentialValigns = {};

        let nValignsSpecified;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecified = globalDependencyValues.valignsAttr.stateValues.nComponents
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
              valigns[arrayKey] = globalDependencyValues.valignAttr.stateValues.value.toLowerCase();

            } else {
              let varEnding = arrayIndex + 1;
              valigns[arrayKey] = dependencyValuesByKey[arrayKey].valignsAttr.stateValues[`text${varEnding}`].toLowerCase();
            }
            if (!["top", "middle", "bottom"].includes(valigns[arrayKey])) {
              valigns[arrayKey] = "top";
            }
          } else {
            essentialValigns[arrayKey] = {};
          }
        }

        let result = {};

        if (Object.keys(valigns).length > 0) {
          result.newValues = { valigns };
        }
        if (Object.keys(essentialValigns).length > 0) {
          result.useEssentialOrDefaultValue = {
            valigns: essentialValigns,
          }
        }

        return result;

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey, globalDependencyValues, arraySize
      }) {

        let nValignsSpecified;
        let usingSingleValign = false;

        if (globalDependencyValues.valignsAttr !== null) {
          nValignsSpecified = globalDependencyValues.valignsAttr.stateValues.nComponents
        } else if (globalDependencyValues.valignAttr !== null) {
          nValignsSpecified = arraySize[0];
          usingSingleValign = true;
        } else {
          nValignsSpecified = 0;
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.valigns) {

          let desiredValue = desiredStateVariableValues.valigns[arrayKey].toLowerCase();
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
              setStateVariable: "valigns",
              value: { [arrayKey]: desiredValue },
            })
          }

        }

        return {
          success: true,
          instructions
        }


      }
    }


    return stateVariableDefinitions;
  }
}
