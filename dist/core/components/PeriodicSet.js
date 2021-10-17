import MathComponent from './Math.js';
import me from '../../_snowpack/pkg/math-expressions.js';
import { deepClone } from '../utils/deepFunctions.js';

export default class PeriodicSet extends MathComponent {
  static componentType = "periodicSet";
  static rendererType = undefined;


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

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
    delete stateVariableDefinitions.mathChildrenByArrayComponent;
    delete stateVariableDefinitions.mathChildrenWithCanBeModified;
    delete stateVariableDefinitions.unordered;

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { canBeModified: false } })
    }

    stateVariableDefinitions.nOffsets = {
      public: true,
      componentType: "integer",
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
        return { newValues: { nOffsets } }
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
            newValues: { unnormalizedValue: me.fromAst('\uff3f') }
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

        return { newValues: { unnormalizedValue } }

      }
    }


    stateVariableDefinitions.redundantOffsets = {
      additionalStateVariablesDefined: ["uniqueOffsets"],
      public: true,
      componentType: "boolean",
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

        return { newValues: { redundantOffsets, uniqueOffsets } }
      }
    }


    stateVariableDefinitions.asList = {
      public: true,
      componentType: "mathList",
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

              let minIndex = -1, maxIndex=1;

              if(Number.isFinite(dependencyValues.minIndexAsList)) {
                minIndex = dependencyValues.minIndexAsList;
              }
              if(Number.isFinite(dependencyValues.maxIndexAsList)) {
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

        return { newValues: { asList } }
      }
    }

    return stateVariableDefinitions;
  }


}