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
          dependencyType: "attributePrimitive",
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

  static async createSerializedReplacements({ component, componentInfoObjects, alwaysCreateReplacements }) {
    // console.log(`create serialized replacements for ${component.componentName}`)
    // console.log(await component.stateValues.rendered);

    if (!(await component.stateValues.rendered || alwaysCreateReplacements)) {
      return { replacements: [] };
    } else {

      let replacements = deepClone(await component.state.serializedChildren.value);

      let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

      for (let repl of replacements) {
        if (typeof repl !== "object") {
          continue;
        }

        // pass isResponse to replacements
        let attributesFromComposite = {};

        if ("isResponse" in component.attributes) {
          attributesFromComposite = convertAttributesForComponentType({
            attributes: { isResponse: component.attributes.isResponse },
            componentType: repl.componentType,
            componentInfoObjects,
            compositeCreatesNewNamespace: newNamespace
          })
        }

        if (!repl.attributes) {
          repl.attributes = {};
        }

        Object.assign(repl.attributes, attributesFromComposite)

      }


      // TODO: usual procedure is that original names are consistent
      // if have new namespace
      // In addition, we make them consistent if don't assignNames
      // so that a template (actually group, usually)
      // gets expanded with the original names.

      // However, at some point, got duplicate names if copying without link,
      // but can't reproduce that error now
      // Adding condition for not being replacement fixed the duplicate name
      // error but broke above requirements
      // Find a solution when can reproduce that duplicate name error


      let processResult = processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
        originalNamesAreConsistent: newNamespace
          || (!component.doenetAttributes.assignNames
            //  && !component.replacementOf
          ),
      });

      return { replacements: processResult.serializedComponents };


    }

  }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = super.allPotentialRendererTypes;

    let additionalRendererTypes = this.potentialRendererTypesFromSerializedComponents(
      this.serializedChildren
    );
    for (let rendererType of additionalRendererTypes) {
      if (!allPotentialRendererTypes.includes(rendererType)) {
        allPotentialRendererTypes.push(rendererType);
      }
    }

    return allPotentialRendererTypes;

  }
}
