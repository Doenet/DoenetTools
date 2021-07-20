import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class SelectByCondition extends CompositeComponent {
  static componentType = "selectByCondition";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.maximumNumberToSelect = {
      createComponentOfType: "number",
      createStateVariable: "maximumNumberToSelect",
      defaultValue: null,
      public: true,
    }

    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroCases = childLogic.newLeaf({
      name: "atLeastZeroCases",
      componentType: 'case',
      comparison: 'atLeast',
      number: 0,
    });

    let atMostOneElse = childLogic.newLeaf({
      name: "atMostOneElse",
      componentType: 'else',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "casesAndElse",
      operator: "and",
      propositions: [atLeastZeroCases, atMostOneElse],
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nCases = {
      additionalStateVariablesDefined: ["caseChildren"],
      returnDependencies: () => ({
        caseChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroCases",
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            caseChildren: dependencyValues.caseChildren,
            nCases: dependencyValues.caseChildren.length
          }
        }
      }
    }

    stateVariableDefinitions.elseChild = {
      returnDependencies: () => ({
        elseChild: {
          dependencyType: "child",
          childLogicName: "atMostOneElse"
        },
      }),
      definition({ dependencyValues }) {
        let elseChild = null;
        if (dependencyValues.elseChild.length === 1) {
          elseChild = dependencyValues.elseChild[0]
        }
        return { newValues: { elseChild } };
      }
    }

    stateVariableDefinitions.selectedIndices = {
      immutable: true,
      returnDependencies: () => ({
        caseChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroCases",
          variableNames: ["conditionSatisfied"]
        },
        elseChild: {
          dependencyType: "stateVariable",
          variableName: "elseChild"
        },
        maximumNumberToSelect: {
          dependencyType: "stateVariable",
          variableName: "maximumNumberToSelect"
        },
        variants: {
          dependencyType: "variants",
        },
      }),
      definition({ dependencyValues }) {

        // if desiredIndices is specfied, use those
        if (dependencyValues.variants && dependencyValues.variants.desiredVariant !== undefined) {
          let desiredIndices = dependencyValues.variants.desiredVariant.indices;
          if (desiredIndices !== undefined) {
            desiredIndices = desiredIndices.map(Number);
            if (!desiredIndices.every(Number.isInteger)) {
              throw Error("All indices specified for select must be integers");
            }
            let n = dependencyValues.caseChildren.length;
            if (dependencyValues.elseChild) {
              n++;
            }

            desiredIndices = desiredIndices.map(x => ((((x - 1) % n) + n) % n) + 1);

            return {
              makeEssential: { selectedIndices: true },
              newValues: {
                selectedIndices: desiredIndices,
              },
            }
          }
        }

        let selectedIndices = [];

        for (let [ind, child] of dependencyValues.caseChildren.entries()) {
          if (child.stateValues.conditionSatisfied) {
            selectedIndices.push(ind + 1);
          }
        }
        if (selectedIndices.length === 0 && dependencyValues.elseChild) {
          selectedIndices.push(dependencyValues.caseChildren.length + 1);
        }

        if (dependencyValues.maximumNumberToSelect !== null && selectedIndices.length > dependencyValues.maximumNumberToSelect) {
          let maxnum = Math.max(0, Math.floor(dependencyValues.maximumNumberToSelect));
          selectedIndices = selectedIndices.slice(0, maxnum)
        }

        return {
          newValues: {
            selectedIndices,
          }
        };
      }
    }

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { isVariantComponent: true } })
    }

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: ({ componentInfoObjects }) => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(componentInfoObjects.componentTypeWithPotentialVariants),
          variableNames: [
            "isVariantComponent",
            "generatedVariantInfo",
          ],
          useReplacementsForComposites: true,
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfMatchedComposites: true,
          definingChildrenFirst: true,
        }
      }),
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {
          indices: dependencyValues.selectedIndices,
          meta: { createdBy: componentName }
        };

        let subvariants = generatedVariantInfo.subvariants = [];

        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo)
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
          }

        }
        return { newValues: { generatedVariantInfo } }

      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        }
      }),
      definition() {
        return {
          newValues: { readyToExpandWhenResolved: true }
        }
      }
    }

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, components, componentInfoObjects }) {

    let replacements = [];

    for (let selectedIndex of component.stateValues.selectedIndices) {

      let selectedChildName, childComponentType;
      if (selectedIndex <= component.stateValues.nCases) {
        selectedChildName = component.stateValues.caseChildren[selectedIndex - 1].componentName;
        childComponentType = "case";

      } else {
        selectedChildName = component.stateValues.elseChild.componentName;
        childComponentType = "else";
      }
      // use state, not stateValues, as read only proxy messes up internal
      // links between descendant variant components and the components themselves

      let serializedGrandchildren = deepClone(components[selectedChildName].state.serializedChildren.value);
      let serializedChild = {
        componentType: childComponentType,
        state: { rendered: true },
        doenetAttributes: Object.assign({}, components[selectedChildName].doenetAttributes),
        children: serializedGrandchildren,
        originalName: selectedChildName,
      }

      if (components[selectedChildName].attributes.newNamespace) {
        serializedChild.attributes = { newNamespace: { primitive: true } }
      }

      replacements.push(serializedChild);
    }

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });


    return { replacements: processResult.serializedComponents };

  }


}
