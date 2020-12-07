import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';

export default class SelectByCondition extends CompositeComponent {
  static componentType = "selectByCondition";

  static assignNamesToAllChildrenExcept = ["case", ...Object.keys(this.createPropertiesObject({})).map(x => x.toLowerCase())];

  // used when referencing this component without prop
  // static useChildrenForReference = false;
  // static get stateVariablesShadowedForReference() { return ["selectedIndex"] };

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastOneCase = childLogic.newLeaf({
      name: "atLeastOneCase",
      componentType: 'case',
      comparison: 'atLeast',
      number: 1,
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
      propositions: [atLeastOneCase, atMostOneElse],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nCases = {
      additionalStateVariablesDefined: ["caseChildren"],
      returnDependencies: () => ({
        caseChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneCase",
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

    stateVariableDefinitions.selectedIndex = {
      additionalStateVariablesDefined: ["elseChild"],
      returnDependencies: () => ({
        caseChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneCase",
          variableNames: ["conditionSatisfied"]
        },
        elseChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneElse"
        }
      }),
      definition({ dependencyValues }) {
        let selectedIndex = null;
        for (let [ind, child] of dependencyValues.caseChildren.entries()) {
          if (child.stateValues.conditionSatisfied) {
            selectedIndex = ind;
            break;
          }
        }
        if (selectedIndex === null && dependencyValues.elseChild.length === 1) {
          selectedIndex = dependencyValues.caseChildren.length;
        }

        return {
          newValues: {
            selectedIndex,
            elseChild: dependencyValues.elseChild[0]
          }
        };
      }
    }

    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndex"
        }
      }),
      definition() {
        return {
          newValues: { readyToExpand: true }
        }
      }
    }

    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      returnDependencies: () => ({
        selectedIndex: {
          dependencyType: "stateVariable",
          variableName: "selectedIndex"
        }
      }),
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale: () => ({ updateReplacements: true }),
      definition: () => ({ newValues: { needsReplacementsUpdatedWhenStale: true } })
    }



    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, components, workspace }) {

    let replacementsWithInstructions = this.getReplacementsWithInstructions(component, components);

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    workspace.previousSelectedIndex = component.stateValues.selectedIndex;

    console.log(`replacement with instructions for ${component.componentName}`)
    console.log(JSON.parse(JSON.stringify(replacementsWithInstructions)));
    console.log(replacementsWithInstructions);

    return { replacementsWithInstructions };

  }

  static getReplacementsWithInstructions(component, components) {

    let replacementsWithInstructions = [];

    if (component.stateValues.selectedIndex === null) {
      return replacementsWithInstructions;
    }

    let assignNames = component.doenetAttributes.assignNames;

    let name;
    if (assignNames !== undefined) {
      name = assignNames[0];
    }
    let instruction = {
      operation: "assignName",
      name,
      uniqueIdentifier: "0"
    };


    let selectedChildName;
    if (component.stateValues.selectedIndex < component.stateValues.nCases) {
      selectedChildName = component.stateValues.caseChildren[component.stateValues.selectedIndex].componentName;
    } else {
      selectedChildName = component.stateValues.elseChild.componentName;
    }
    // use state, not stateValues, as read only proxy messes up internal
    // links between descendant variant components and the components themselves

    let serializedGrandchildren = deepClone(components[selectedChildName].state.childrenWhenSelected.value);
    let serializedChild = {
      componentType: "group",
      doenetAttributes: {},
      children: serializedGrandchildren
    }


    if (component.stateValues.hide) {
      // if select is hidden, then make each of its replacements hidden
      if (!serializedChild.state) {
        serializedChild.state = {};
      }

      serializedChild.state.hide = true;

      // if assigning names to grandchild, then hide those as well
      // so that refs of those will be hidden, for consistency
      if (Array.isArray(name)) {
        if (serializedChild.children) {
          for (let grandchild of serializedChild.children) {
            if (!grandchild.state) {
              grandchild.state = {};
            }
            grandchild.state.hide = true;
          }
        }
      }
    }

    replacementsWithInstructions.push({
      instructions: [instruction],
      replacements: [serializedChild]
    });
    return replacementsWithInstructions;
  }

  static calculateReplacementChanges({ component, componentChanges, components, workspace }) {

    console.log(`calculate replacement changes for selectByIndex`)
    console.log(workspace.previousSelectedIndex);
    console.log(component.stateValues.selectedIndex);

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (workspace.previousSelectedIndex === component.stateValues.selectedIndex) {
      return [];
    }


    // delete previous replacements and create new ones
    // TODO: could we find a way to withhold old ones?
    // Either change order of replacements or allow to withhold latter replacements

    let replacementChanges = [];

    let replacementsWithInstructions = this.getReplacementsWithInstructions(component, components);

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      replacementsWithInstructions,
      replacementsToWithhold: 0,
    };

    replacementChanges.push(replacementInstruction);

    workspace.previousSelectedIndex = component.stateValues.selectedIndex;

    console.log(`replacementChanges for if ${component.componentName}`);
    console.log(replacementChanges);
    return replacementChanges;

    // let replacementChanges = processChangesForReplacements({
    //   componentChanges: componentChanges,
    //   componentName: component.componentName,
    //   downstreamDependencies: component.downstreamDependencies,
    //   components
    // })
    // // console.log(`replacementChanges for group ${component.componentName}`);
    // // console.log(replacementChanges);
    // return replacementChanges;
  }

}
