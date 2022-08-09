import MathComponent from './Math.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { deepClone } from '../utils/deepFunctions.js';

export default class PeriodicSet extends MathComponent {
  static componentType = "periodicSet";
  static rendererType = undefined;


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.minIndex = {
      createComponentOfType: "integer",
      createStateVariable: "minIndex",
      defaultValue: -Infinity,
      public: true,
    };

    attributes.maxIndex = {
      createComponentOfType: "integer",
      createStateVariable: "maxIndex",
      defaultValue: Infinity,
      public: true,
    };

    attributes.offsets = {
      createComponentOfType: "mathList",
      createStateVariable: "offsets",
      defaultValue: null,
      public: true,
    }

    attributes.period = {
      createComponentOfType: "math",
      createStateVariable: "period",
      defaultValue: null,
      public: true,
    }

    attributes.minIndexAsList = {
      createComponentOfType: "integer",
      createStateVariable: "minIndexAsList",
      defaultValue: -1,
      public: true
    }
    attributes.maxIndexAsList = {
      createComponentOfType: "integer",
      createStateVariable: "maxIndexAsList",
      defaultValue: 1,
      public: true
    }

    return attributes;
  }

  static returnChildGroups() {
    return []
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.expressionWithCodes;
    delete stateVariableDefinitions.mathChildrenFunctionSymbols;
    delete stateVariableDefinitions.codesAdjacentToStrings;
    delete stateVariableDefinitions.mathChildrenByVectorComponent;
    delete stateVariableDefinitions.mathChildrenWithCanBeModified;
    delete stateVariableDefinitions.unordered;

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { canBeModified: false } })
    }


    stateVariableDefinitions.displayDigits = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        mathListParentDisplayDigits: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDigits"
        },
        numberListParentDisplayDigits: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displayDigits"
        },
        mathListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDecimals"
        },
        numberListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displayDecimals"
        },
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.mathListParentDisplayDigits !== null) {
          if (usedDefault.mathListParentDisplayDigits) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentDisplayDigits;
          } else {
            // having a mathlist parent that prescribed displayDigits.
            // this overrides everything else
            return {
              setValue: {
                displayDigits: dependencyValues.mathListParentDisplayDigits
              }
            }
          }
        }

        if (dependencyValues.numberListParentDisplayDigits !== null) {
          if (usedDefault.numberListParentDisplayDigits) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentDisplayDigits;
          } else {
            // having a numberlist parent that prescribed displayDigits.
            // this overrides everything else
            return {
              setValue: {
                displayDigits: dependencyValues.numberListParentDisplayDigits
              }
            }
          }
        }

        let haveListParentWithDisplayDecimals =
          dependencyValues.numberListParentDisplayDecimals !== null && !usedDefault.numberListParentDisplayDecimals
          ||
          dependencyValues.mathListParentDisplayDecimals !== null && !usedDefault.mathListParentDisplayDecimals;


        if (!haveListParentWithDisplayDecimals && dependencyValues.displayDigitsAttr !== null) {
          // have to check to exclude case where have displayDecimals from mathList parent
          // because otherwise a non-default displayDigits will win over displayDecimals

          if (usedDefault.displayDigitsAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.displayDigitsAttr.stateValues.value;
          } else {
            return {
              setValue: {
                displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
              }
            }
          }
        }

        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { displayDigits: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { displayDigits: true } }
        }

      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({
        mathListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displayDecimals"
        },
        numberListParentDisplayDecimals: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displayDecimals"
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.mathListParentDisplayDecimals !== null) {
          if (usedDefault.mathListParentDisplayDecimals) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentDisplayDecimals;

          } else {
            // having a mathlist parent that prescribed displayDecimals.
            // this overrides everything else
            return {
              setValue: {
                displayDecimals: dependencyValues.mathListParentDisplayDecimals
              }
            }
          }
        }

        if (dependencyValues.numberListParentDisplayDecimals !== null) {
          if (usedDefault.numberListParentDisplayDecimals) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentDisplayDecimals;
          } else {
            // having a numberlist parent that prescribed displayDecimals.
            // this overrides everything else
            return {
              setValue: {
                displayDecimals: dependencyValues.numberListParentDisplayDecimals
              }
            }
          }
        }

        if (dependencyValues.displayDecimalsAttr !== null) {
          if (usedDefault.displayDecimalsAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.displayDecimalsAttr.stateValues.value;
          } else {
            return {
              setValue: {
                displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
              }
            }
          }
        }

        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { displayDecimals: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { displayDecimals: true } }
        }
      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      hasEssential: true,
      defaultValue: 0,
      returnDependencies: () => ({
        mathListParentDisplaySmallAsZero: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "displaySmallAsZero"
        },
        numberListParentDisplaySmallAsZero: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "displaySmallAsZero"
        },
        displaySmallAsZeroAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displaySmallAsZero",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.mathListParentDisplaySmallAsZero !== null) {
          if (usedDefault.mathListParentDisplaySmallAsZero) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentDisplaySmallAsZero;
          } else {
            // having a mathlist parent that prescribed displaySmallAsZero.
            // this overrides everything else
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.mathListParentDisplaySmallAsZero
              }
            }
          }
        }

        if (dependencyValues.numberListParentDisplaySmallAsZero !== null) {
          if (usedDefault.numberListParentDisplaySmallAsZero) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentDisplaySmallAsZero;
          } else {
            // having a numberlist parent that prescribed displaySmallAsZero.
            // this overrides everything else
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.numberListParentDisplaySmallAsZero
              }
            }
          }
        }

        if (dependencyValues.displaySmallAsZeroAttr !== null) {
          if (usedDefault.displaySmallAsZeroAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.displaySmallAsZeroAttr.stateValues.value;
          } else {
            return {
              setValue: {
                displaySmallAsZero: dependencyValues.displaySmallAsZeroAttr.stateValues.value
              }
            }
          }
        }

        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { displaySmallAsZero: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { displaySmallAsZero: true } }
        }
      }
    }

    stateVariableDefinitions.padZeros = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      hasEssential: true,
      defaultValue: false,
      returnDependencies: () => ({
        mathListParentPadZeros: {
          dependencyType: "parentStateVariable",
          parentComponentType: "mathList",
          variableName: "padZeros"
        },
        numberListParentPadZeros: {
          dependencyType: "parentStateVariable",
          parentComponentType: "numberList",
          variableName: "padZeros"
        },
        padZerosAttr: {
          dependencyType: "attributeComponent",
          attributeName: "padZeros",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {

        let foundDefaultValue = false;
        let theDefaultValueFound;

        if (dependencyValues.mathListParentPadZeros !== null) {
          if (usedDefault.mathListParentPadZeros) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.mathListParentPadZeros;
          } else {
            // having a mathlist parent that prescribed padZeros.
            // this overrides everything else
            return {
              setValue: {
                padZeros: dependencyValues.mathListParentPadZeros
              }
            }
          }
        }

        if (dependencyValues.numberListParentPadZeros !== null) {
          if (usedDefault.numberListParentPadZeros) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.numberListParentPadZeros;
          } else {
            // having a numberlist parent that prescribed padZeros.
            // this overrides everything else
            return {
              setValue: {
                padZeros: dependencyValues.numberListParentPadZeros
              }
            }
          }
        }

        if (dependencyValues.padZerosAttr !== null) {
          if (usedDefault.padZerosAttr) {
            foundDefaultValue = true;
            theDefaultValueFound = dependencyValues.padZerosAttr.stateValues.value;
          } else {
            return {
              setValue: {
                padZeros: dependencyValues.padZerosAttr.stateValues.value
              }
            }
          }
        }

        if (foundDefaultValue) {
          return { useEssentialOrDefaultValue: { padZeros: { defaultValue: theDefaultValueFound } } }
        } else {
          return { useEssentialOrDefaultValue: { padZeros: true } }
        }

      }
    }

    stateVariableDefinitions.nOffsets = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        offsets: {
          dependencyType: "stateVariable",
          variableName: "offsets"
        },
      }),
      definition({ dependencyValues }) {
        let nOffsets = 0;
        if (dependencyValues.offsets !== null) {
          nOffsets = dependencyValues.offsets.length;
        }
        return { setValue: { nOffsets } }
      }
    }

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        offsets: {
          dependencyType: "stateVariable",
          variableName: "offsets"
        },
        period: {
          dependencyType: "stateVariable",
          variableName: "period"
        },
        minIndex: {
          dependencyType: "stateVariable",
          variableName: "minIndex"
        },
        maxIndex: {
          dependencyType: "stateVariable",
          variableName: "maxIndex"
        }
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.offsets === null
          || dependencyValues.offsets.length === 0
          || dependencyValues.offsets.length === 1 && dependencyValues.offsets[0].tree === '\uff3f'
          || dependencyValues.period === null
          || dependencyValues.period.tree === '\uff3f'
        ) {
          return {
            setValue: { unnormalizedValue: me.fromAst('\uff3f') }
          }
        }

        let periodicInfo = [];
        let period = dependencyValues.period.tree;
        let minIndex = dependencyValues.minIndex;
        let maxIndex = dependencyValues.maxIndex;

        for (let offset of dependencyValues.offsets) {
          periodicInfo.push(["tuple", offset.tree, period, minIndex, maxIndex])
        }

        let unnormalizedValue = me.fromAst(['periodic_set', ...periodicInfo])

        return { setValue: { unnormalizedValue } }

      }
    }


    stateVariableDefinitions.redundantOffsets = {
      additionalStateVariablesDefined: ["uniqueOffsets"],
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        nOffsets: {
          dependencyType: "stateVariable",
          variableName: "nOffsets"
        },
        offsets: {
          dependencyType: "stateVariable",
          variableName: "offsets"
        },
        period: {
          dependencyType: "stateVariable",
          variableName: "period"
        }
      }),
      definition({ dependencyValues }) {
        // check if have duplicate offsets
        let redundantOffsets = false;
        let uniqueOffsets = [];
        if (dependencyValues.period !== null) {
          let periodValue = dependencyValues.period.evaluate_to_constant();
          if (periodValue !== null) {
            for (let ind1 = 0; ind1 < dependencyValues.nOffsets; ind1++) {
              let isUnique = true;
              for (let ind2 = 0; ind2 < ind1; ind2++) {
                let offsetDiff = dependencyValues.offsets[ind1].subtract(dependencyValues.offsets[ind2]).evaluate_to_constant();
                if (offsetDiff !== null && Math.abs(offsetDiff % periodValue) < 1E-10 * periodValue) {
                  redundantOffsets = true;
                  isUnique = false;
                  break;
                }
              }
              if (isUnique) {
                uniqueOffsets.push(dependencyValues.offsets[ind1]);
              }
            }
          }
        }

        return { setValue: { redundantOffsets, uniqueOffsets } }
      }
    }


    stateVariableDefinitions.asList = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "mathList",
      },
      returnDependencies: () => ({
        uniqueOffsets: {
          dependencyType: "stateVariable",
          variableName: "uniqueOffsets"
        },
        period: {
          dependencyType: "stateVariable",
          variableName: "period"
        },
        minIndexAsList: {
          dependencyType: "stateVariable",
          variableName: "minIndexAsList"
        },
        maxIndexAsList: {
          dependencyType: "stateVariable",
          variableName: "maxIndexAsList"
        }
      }),
      definition({ dependencyValues }) {
        let asList = [];
        // remove redundant offsets
        if (dependencyValues.period !== null) {
          let periodValue = dependencyValues.period.evaluate_to_constant();
          if (periodValue !== null) {

            let period = dependencyValues.period.simplify()

            let allFinite = true;
            let shiftedOffsetsWithNumeric = [];
            for (let offset of dependencyValues.uniqueOffsets) {
              let offsetValue = offset.evaluate_to_constant();
              if (offsetValue === null) {
                allFinite = false;
                break;
              } else {
                let shiftedOffset = offset.subtract(period.multiply(Math.floor(offsetValue / periodValue))).simplify();
                let shiftedOffsetValue = shiftedOffset.evaluate_to_constant();
                shiftedOffsetsWithNumeric.push({
                  num: shiftedOffsetValue,
                  offset: shiftedOffset,
                })
              }
            }


            if (allFinite) {

              asList.push(me.fromAst(["ldots"]))
              // sort by numeric value
              shiftedOffsetsWithNumeric.sort((a, b) => a.num - b.num);

              let minIndex = -1, maxIndex = 1;

              if (Number.isFinite(dependencyValues.minIndexAsList)) {
                minIndex = dependencyValues.minIndexAsList;
              }
              if (Number.isFinite(dependencyValues.maxIndexAsList)) {
                maxIndex = dependencyValues.maxIndexAsList;
              }

              for (let i = minIndex; i <= maxIndex; i++) {
                for (let offsetObj of shiftedOffsetsWithNumeric) {
                  asList.push(offsetObj.offset.add(period.multiply(i)).simplify())
                }
              }
              asList.push(me.fromAst(["ldots"]))

            }

          }
        }

        return { setValue: { asList } }
      }
    }

    return stateVariableDefinitions;
  }


}