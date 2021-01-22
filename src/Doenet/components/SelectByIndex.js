import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class SelectByIndex extends CompositeComponent {
  static componentType = "selectByIndex";

  // static assignNewNamespaceToAllChildrenExcept = Object.keys(this.createPropertiesObject({})).map(x => x.toLowerCase());
  static assignNamesToReplacements = true;

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["selectedIndices"] };

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    let propertyClasses = [];
    for (let componentType in this.createPropertiesObject({})) {
      let ct = componentType.toLowerCase();
      propertyClasses.push({
        componentType: ct,
        class: componentInfoObjects.allComponentClasses[ct]
      });
    }

    let nonPropertyChildInds = [];

    // first occurence of a property component class
    // will be created
    // any other component will stay serialized
    for (let [ind, child] of serializedComponent.children.entries()) {
      let propFound = false;
      for (let propObj of propertyClasses) {
        if (componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: propObj.componentType
        }) && !propObj.propFound) {
          propFound = propObj.propFound = true;
          break;
        }
      }
      if (!propFound) {
        nonPropertyChildInds.push(ind);
      }
    }

    return nonPropertyChildInds;

  }

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.selectIndices = { default: [] };
    return properties;
  }

  // don't need additional child logic
  // as all non-property children will remain serialized


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenToSelect = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {

        // deepClone remove readonly proxy
        let childrenToSelect = deepClone(dependencyValues.serializedChildren);

        // if have just one string, convert it to array of text or numbers
        // in the same fashion that sugar works for regular children
        if (childrenToSelect.length === 1 && childrenToSelect[0].componentType === "string") {
          childrenToSelect = numbersOrTextFromString(childrenToSelect[0].state.value)
        }

        for (let child of childrenToSelect) {

          // make sure each serialized child has children and doenetAttributes
          if (child.children === undefined) {
            child.children = [];
          }
          if (child.doenetAttributes === undefined) {
            child.doenetAttributes = {};
          }

        }

        return {
          newValues: {
            childrenToSelect,
          }
        }
      }
    }

    stateVariableDefinitions.numberOfChildren = {
      returnDependencies: () => ({
        childrenToSelect: {
          dependencyType: "stateVariable",
          variableName: "childrenToSelect"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { numberOfChildren: dependencyValues.childrenToSelect.length } };
      }
    }

    stateVariableDefinitions.selectedIndices = {
      returnDependencies: () => ({
        numberOfChildren: {
          dependencyType: "stateVariable",
          variableName: "numberOfChildren"
        },
        selectIndices: {
          dependencyType: "stateVariable",
          variableName: "selectIndices"
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`definition of selectedIndices`)
        // console.log(dependencyValues);

        if (dependencyValues.numberOfChildren === 0) {
          return { newValues: { selectedIndices: [] } }
        }

        let indicesToSelect = dependencyValues.selectIndices;

        let selectedIndices = indicesToSelect.filter(ind =>
          Number.isInteger(ind) && ind >= 1
          && ind <= dependencyValues.numberOfChildren
        );

        return { newValues: { selectedIndices } };

      }
    }

    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
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
        selectedIndices: {
          dependencyType: "stateVariable",
          variableName: "selectedIndices"
        }
      }),
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale: () => ({ updateReplacements: true }),
      definition: () => ({ newValues: { needsReplacementsUpdatedWhenStale: true } })
    }



    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, components, workspace, componentInfoObjects }) {

    let replacements = this.getReplacements(component, componentInfoObjects);

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    workspace.previousSelectedIndices = [...component.stateValues.selectedIndices];

    return { replacements };

  }

  static getReplacements(component, componentInfoObjects) {

    let replacements = [];

    for (let childIndex of component.stateValues.selectedIndices) {

      // use state, not stateValues, as read only proxy messes up internal
      // links between descendant variant components and the components themselves
      let serializedChild = deepClone(component.state.childrenToSelect.value[childIndex - 1]);


      if (component.stateValues.hide) {
        // if select is hidden, then make each of its replacements hidden
        if (!serializedChild.state) {
          serializedChild.state = {};
        }

        serializedChild.state.hide = true;

        // // if assigning names to grandchild, then hide those as well
        // // so that refs of those will be hidden, for consistency
        // if (Array.isArray(name)) {
        //   if (serializedChild.children) {
        //     for (let grandchild of serializedChild.children) {
        //       if (!grandchild.state) {
        //         grandchild.state = {};
        //       }
        //       grandchild.state.hide = true;
        //     }
        //   }
        // }
      }

      replacements.push(serializedChild);
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
    });

    // console.log(`replacements for selectByIndex`)
    // console.log(deepClone(processResult.serializedComponents));

    return processResult.serializedComponents;

  }

  static calculateReplacementChanges({ component, componentChanges, components, workspace, componentInfoObjects }) {

    // console.log(`calculate replacement changes for selectByIndex`)
    // console.log([...workspace.previousSelectedIndices]);
    // console.log([...component.stateValues.selectedIndices])

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (workspace.previousSelectedIndices.length === component.stateValues.selectedIndices.length
      && component.stateValues.selectedIndices.every((v, i) => v === workspace.previousSelectedIndices[i])
    ) {
      return [];
    }


    // delete previous replacements and create new ones
    // TODO: could we find a way to withhold old ones?
    // Either change order of replacements or allow to withhold latter replacements

    let replacementChanges = [];

    let replacements = this.getReplacements(component, componentInfoObjects);

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

    // console.log(`replacementChanges for selectByIndex ${component.componentName}`);
    // console.log(replacementChanges);

    return replacementChanges;

  }

}
