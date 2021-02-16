import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';
import CompositeComponent from './abstract/CompositeComponent';

export default class Template extends CompositeComponent {
  static componentType = "template";

  static treatAsComponentForRecursiveReplacements = true;
  static includeBlankStringChildren = true;

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
    properties.rendered = { default: false };
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
        return {
          newValues: {
            serializedChildren: dependencyValues.serializedChildren
          }
        }
      }
    }

    stateVariableDefinitions.newNamespace = {
      returnDependencies: () => ({
        newNamespace: {
          dependencyType: "doenetAttribute",
          attributeName: "newNamespace"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            newNamespace: dependencyValues.newNamespace
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

    if (!component.stateValues.rendered) {
      return { replacements: [] };
    } else {

      let replacements = deepClone(component.state.serializedChildren.value);

      if (component.stateValues.hide) {
        // if template is hidden, then make each of its replacements hidden
        for (let rep of replacements) {
          if (!rep.state) {
            rep.state = {};
          }
          rep.state.hide = true;
        }
      }

      return { replacements }
    }

  }

  get allPotentialRendererTypes() {

    return this.potentialRendererTypesFromSerializedComponents(
      this.stateValues.serializedChildren
    );

  }
}
