import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames, removeNamespace } from '../utils/serializedStateProcessing';

export default class Group extends CompositeComponent {
  static componentType = "group";

  // static assignNewNamespaceToAllChildrenExcept = Object.keys(this.createPropertiesObject({})).map(x => x.toLowerCase());
  // static preserveOriginalNamesWhenAssignChildrenNewNamespace = true;

  static assignNamesToReplacements = true;

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
    properties.rendered = { default: true };
    return properties;
  }

  // don't need additional child logic
  // as all non-property children will remain serialized


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.serializedChildren = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {
        let serializedChildren =
          deepClone(dependencyValues.serializedChildren)
            .filter(x => x.componentType !== "string");

        if (serializedChildren.length !== dependencyValues.serializedChildren.length) {
          console.warn(`String child of group ignored.`)
        }

        // serializedChildren = serializedChildren.map(
        //   x => x.componentType !== "string" ? x : {
        //     componentType: "text",
        //     children: [x]
        //   });

        return {
          newValues: {
            serializedChildren
          }
        }
      }
    }

    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({}),
      definition: function () {
        return { newValues: { readyToExpand: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, componentInfoObjects }) {

    let replacements = [];

    if (component.stateValues.rendered) {

      let processResult = processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: deepClone(component.state.serializedChildren.value),
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        componentInfoObjects,
        useSerializedNames: true,
      });

      replacements = processResult.serializedComponents

    }

    // console.log(`serialized replacements for ${component.componentName}`)
    // console.log(deepClone(replacements));

    return { replacements };

  }

  static calculateReplacementChanges({ component, componentChanges, components }) {

    return [];

    let replacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: component.componentName,
      downstreamDependencies: component.downstreamDependencies,
      components
    })
    // console.log(`replacementChanges for group ${component.componentName}`);
    // console.log(replacementChanges);
    return replacementChanges;
  }

}
