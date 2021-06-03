import { deepClone } from '../utils/deepFunctions';
import CompositeComponent from './abstract/CompositeComponent';

export default class Template extends CompositeComponent {
  static componentType = "template";

  static treatAsComponentForRecursiveReplacements = true;
  static includeBlankStringChildren = true;
  static renderedDefault = false;

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      return Object.keys(serializedComponent.children)
    }
  }

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.rendered = {
      createComponentOfType: "boolean",
      createStateVariable: "rendered",
      defaultValue: this.renderedDefault,
      public: true,
    };
    return attributes;
  }


  // don't need child logic
  // as all children will remain serialized


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
          dependencyType: "attribute",
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

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({}),
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component }) {

    if (!component.stateValues.rendered) {
      return { replacements: [] };
    } else {

      let replacements = deepClone(component.state.serializedChildren.value);

      return { replacements }
    }

  }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = super.allPotentialRendererTypes;

    let additionalRendererTypes = this.potentialRendererTypesFromSerializedComponents(
      this.stateValues.serializedChildren
    );
    for (let rendererType of additionalRendererTypes) {
      if (!allPotentialRendererTypes.includes(rendererType)) {
        allPotentialRendererTypes.push(rendererType);
      }
    }

    return allPotentialRendererTypes;

  }
}
