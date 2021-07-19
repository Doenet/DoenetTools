import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';
import { convertAttributesForComponentType } from '../utils/copy';

export default class Template extends CompositeComponent {
  static componentType = "template";

  static treatAsComponentForRecursiveReplacements = true;
  static includeBlankStringChildren = true;
  static renderedDefault = false;

  static assignNamesToReplacements = true;
  static originalNamesAreConsistent = true;


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
    attributes.isResponse = {
      leaveRaw: true,
    }
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

  static createSerializedReplacements({ component, componentInfoObjects }) {
    // console.log(`create serialized replacements for ${component.componentName}`)
    // console.log(component.stateValues.rendered);

    if (!component.stateValues.rendered) {
      return { replacements: [] };
    } else {

      let replacements = deepClone(component.state.serializedChildren.value);

      for (let repl of replacements) {
        // pass isResponse to replacements
        let attributesFromComposite = {};

        if ("isResponse" in component.attributes) {
          attributesFromComposite = convertAttributesForComponentType({
            attributes: { isResponse: component.attributes.isResponse },
            componentType: repl.componentType,
            componentInfoObjects,
            compositeCreatesNewNamespace: component.attributes.newNamespace
          })
        }

        if(!repl.attributes) {
          repl.attributes = {};
        }

        Object.assign(repl.attributes, attributesFromComposite)

      }

      let processResult = processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.attributes.newNamespace,
        componentInfoObjects,
        originalNamesAreConsistent: component.attributes.newNamespace || !component.doenetAttributes.assignNames,
      });

      return { replacements: processResult.serializedComponents };


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
