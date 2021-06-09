import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class ConditionalContent extends CompositeComponent {
  static componentType = "conditionalContent";

  static includeBlankStringChildren = true;

  static assignNamesToReplacements = true;

  static get stateVariablesShadowedForReference() {
    return ["baseConditionSatisfied"]
  }

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";


  // keep serialized all children other othan cases or else
  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    }
    let keepSerializedInds = [];
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (!["case", "else"].includes(child.componentType)) {
        if (!(child.attributes && ["case", "else"].includes(child.attributes.componentType))) {
          keepSerializedInds.push(ind)
        }
      }
    }

    return keepSerializedInds;
  }


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.maximumNumberToShow = {
      createComponentOfType: "number",
      createStateVariable: "maximumNumberToShow",
      defaultValue: null,
      public: true,
    }

    attributes.condition = {
      createComponentOfType: "boolean",
    };

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

    stateVariableDefinitions.baseConditionSatisfied = {
      returnDependencies: () => ({
        conditionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "condition",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let baseConditionSatisfied = true;
        if (dependencyValues.conditionAttr) {
          baseConditionSatisfied = dependencyValues.conditionAttr.stateValues.value;
        }

        return { newValues: { baseConditionSatisfied } }
      }
    };


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

    stateVariableDefinitions.haveCasesOrElse = {
      returnDependencies: () => ({
        nCases: {
          dependencyType: "stateVariable",
          variableName: "nCases"
        },
        elseChild: {
          dependencyType: "stateVariable",
          variableName: "elseChild"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { haveCasesOrElse: dependencyValues.nCases > 0 || dependencyValues.elseChild !== null }
      })
    }


    stateVariableDefinitions.selectedIndices = {
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
        maximumNumberToShow: {
          dependencyType: "stateVariable",
          variableName: "maximumNumberToShow"
        }
      }),
      definition({ dependencyValues }) {
        let selectedIndices = [];
        for (let [ind, child] of dependencyValues.caseChildren.entries()) {
          if (child.stateValues.conditionSatisfied) {
            selectedIndices.push(ind);
          }
        }
        if (selectedIndices.length === 0 && dependencyValues.elseChild) {
          selectedIndices.push(dependencyValues.caseChildren.length);
        }

        if (dependencyValues.maximumNumberToShow !== null && selectedIndices.length > dependencyValues.maximumNumberToShow) {
          let maxnum = Math.max(0, Math.floor(dependencyValues.maximumNumberToShow));
          selectedIndices = selectedIndices.slice(0, maxnum)
        }

        return {
          newValues: {
            selectedIndices,
          }
        };
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        baseConditionSatisfied: {
          dependencyType: "stateVariable",
          variableName: "baseConditionSatisfied"
        },
        haveCasesOrElse: {
          dependencyType: "stateVariable",
          variableName: "haveCasesOrElse"
        },
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition() {
        return {
          newValues: { readyToExpandWhenResolved: true }
        }
      }
    }

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, components, workspace, componentInfoObjects }) {

    let replacements = this.getReplacements(component, components, componentInfoObjects);

    workspace.previousSelectedIndices = [...component.stateValues.selectedIndices];
    workspace.previousBaseConditionSatisfied = component.stateValues.baseConditionSatisfied;

    // console.log(`replacements for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(replacements)));
    // console.log(replacements);

    return { replacements };

  }

  static getReplacements(component, components, componentInfoObjects) {


    if (!component.stateValues.baseConditionSatisfied) {
      return [];
    }

    let replacements = [];

    if (!component.stateValues.haveCasesOrElse) {
      replacements = deepClone(component.serializedChildren);
    } else {

      for (let selectedIndex of component.stateValues.selectedIndices) {

        let selectedChildName, childComponentType;
        if (selectedIndex < component.stateValues.nCases) {
          selectedChildName = component.stateValues.caseChildren[selectedIndex].componentName;
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
          serializedChild.attributes = { newNamespace: true }
        }

        replacements.push(serializedChild);
      }
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.attributes.newNamespace,
      componentInfoObjects,
    });


    return processResult.serializedComponents;

  }

  static calculateReplacementChanges({ component, componentChanges, components, workspace, componentInfoObjects }) {

    // console.log(`calculate replacement changes for selectByCondition ${component.componentName}`)
    // console.log(workspace.previousSelectedIndices);
    // console.log(component.stateValues.selectedIndices);

    if (workspace.previousSelectedIndices.length === component.stateValues.selectedIndices.length
      && workspace.previousSelectedIndices.every((v, i) => v === component.stateValues.selectedIndices[i])
    ) {

      if (workspace.previousBaseConditionSatisfied === component.stateValues.baseConditionSatisfied) {
        return [];
      } else {


        if (component.stateValues.baseConditionSatisfied) {
          if (component.replacements.length === component.serializedChildren.length) {
            // just stop withholding replacements
            // stop withholding replacements

            let replacementInstruction = {
              changeType: "changeReplacementsToWithhold",
              replacementsToWithhold: 0,
            };

            workspace.previousBaseConditionSatisfied = component.stateValues.baseConditionSatisfied;
            return [replacementInstruction];
          }

        } else {
          let replacementsToWithhold = component.replacements.length;
          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold,
          };

          workspace.previousBaseConditionSatisfied = component.stateValues.baseConditionSatisfied;
          return [replacementInstruction];

        }
      }
    }


    // delete previous replacements and create new ones
    // TODO: could we find a way to withhold old ones?
    // Either change order of replacements or allow to withhold later replacements

    let replacementChanges = [];

    let replacements = this.getReplacements(component, components, componentInfoObjects);

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: replacements,
      replacementsToWithhold: 0,
    };

    replacementChanges.push(replacementInstruction);

    workspace.previousSelectedIndices = [...component.stateValues.selectedIndices];
    workspace.previousBaseConditionSatisfied = component.stateValues.baseConditionSatisfied;

    return replacementChanges;

  }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = super.allPotentialRendererTypes;

    if (this.serializedChildren) {
      let additionalRendererTypes = this.potentialRendererTypesFromSerializedComponents(
        this.serializedChildren
      );
      for (let rendererType of additionalRendererTypes) {
        if (!allPotentialRendererTypes.includes(rendererType)) {
          allPotentialRendererTypes.push(rendererType);
        }
      }
    }

    return allPotentialRendererTypes;

  }
}
