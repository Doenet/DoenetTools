import Template from './Template';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Group extends Template {
  static componentType = "group";

  static renderedDefault = true;

  static includeBlankStringChildren = true;
  static assignNamesToReplacements = true;
  static originalNamesAreConsistent = true;


  static createSerializedReplacements({ component, componentInfoObjects }) {
    // console.log(`create serialized replacements for ${component.componentName}`)
    // console.log(component.stateValues.rendered);

    if (!component.stateValues.rendered) {
      return { replacements: [] };
    } else {

      let replacements = deepClone(component.state.serializedChildren.value);

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

}
