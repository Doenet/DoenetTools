import MathComponent from './Math';
import me from 'math-expressions';
import { deepClone } from '../utils/deepFunctions';

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

    return attributes;
  }

  static returnChildGroups() {
    return []
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.expressionWithCodes;
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
        if (dependencyValues.period !== null) {
          let periodNum = dependencyValues.period.evaluate_to_constant();
          if (periodNum !== null) {
            for (let ind1 = 0; ind1 < dependencyValues.nOffsets; ind1++) {
              for (let ind2 = 0; ind2 < ind1; ind2++) {
                let offsetDiff = dependencyValues.offsets[ind1].subtract(dependencyValues.offsets[ind2]).evaluate_to_constant();
                if (offsetDiff !== null && Math.abs(offsetDiff % periodNum) < 1E-10 * periodNum) {
                  redundantOffsets = true;
                  break;
                }
              }
              if (redundantOffsets) {
                break;
              }
            }
          }
        }

        return { newValues: { redundantOffsets } }
      }
    }

    return stateVariableDefinitions;
  }


}