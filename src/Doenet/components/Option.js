import Template from './Template';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Option extends Template {
  static componentType = "option";

  static includeBlankStringChildren = false;
  // static assignArrayOfNamesToChildren = true;
  static assignNamesToReplacements = true;
  static originalNamesAreConsistent = true;


  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.selectForVariants = { default: [] };
    properties.selectWeight = { default: 1 };
    return properties;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let componentClass = this;

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
          console.warn(`String child of ${componentClass.componentType} ignored.`)
        }

        return {
          newValues: {
            serializedChildren
          }
        }
      }
    }

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, componentInfoObjects }) {
    // console.log(`create serialized replacements for ${component.componentName}`)
    // console.log(component.stateValues.rendered);

    if (!component.stateValues.rendered) {
      return { replacements: [] };
    } else {

      let replacements = deepClone(component.state.serializedChildren.value);

      if (component.stateValues.hide) {
        // if option is hidden, then make each of its replacements hidden
        for (let rep of replacements) {
          if (!rep.state) {
            rep.state = {};
          }
          rep.state.hide = true;
        }
      }

      let processResult = processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        componentInfoObjects,
        originalNamesAreConsistent: component.doenetAttributes.newNamespace || !component.doenetAttributes.assignNames,
      });

      return { replacements: processResult.serializedComponents };


    }

  }

}
