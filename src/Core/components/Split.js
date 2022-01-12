import CompositeComponent from './abstract/CompositeComponent';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Split extends CompositeComponent {
  static componentType = 'split';

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }

    // TODO: other types than text or eliminate type attribute
    attributes.type = {
      createPrimitiveOfType: "string",
      createStateVariable: "type",
      defaultPrimitiveValue: "text",
      toLowerCase: true,
      validValues: ["text"]
    }

    attributes.splitBy = {
      createComponentOfType: "text",
      createStateVariable: "splitBy",
      defaultValue: "letter",
      toLowerCase: true,
      validValues: ["letter", "word", "comma"]
    }

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = [];

    function addType({ matchedChildren, componentAttributes }) {

      let type = componentAttributes.type;
      if (!["text"].includes(type)) {
        type = "text";
      }

      return {
        success: true,
        newChildren: [{
          componentType: type,
          children: matchedChildren
        }]
      }
    }

    sugarInstructions.push({
      replacementFunction: addType
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "anything",
      componentTypes: ["_base"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.originalValue = {
      returnDependencies: () => ({
        child: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.child.length > 0) {
          return { setValue: { originalValue: dependencyValues.child[0].stateValues.value } }
        } else {
          return { setValue: { originalValue: null } }
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.child.length > 0) {

          return {
            success: true,
            instructions: [{
              setDependency: "child",
              desiredValue: desiredStateVariableValues.originalValue,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return { success: false }
        }
      }

    }

    stateVariableDefinitions.splitValues = {
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        originalValue: {
          dependencyType: "stateVariable",
          variableName: "originalValue"
        },
        splitBy: {
          dependencyType: "stateVariable",
          variableName: "splitBy"
        },
      }),
      definition({ dependencyValues }) {

        if (dependencyValues.originalValue === null) {
          return {
            setValue: { splitValues: [] },
          }
        }

        let splitValues = [];

        if (dependencyValues.splitBy === "letter") {
          splitValues = [...dependencyValues.originalValue];
        } else if(dependencyValues.splitBy === "word") {
          splitValues = dependencyValues.originalValue.split(/\s+/)
        } else if(dependencyValues.splitBy === "comma") {
          splitValues = dependencyValues.originalValue.split(/\s*,\s*/)
        } else {
          splitValues = [dependencyValues.originalValue];
        }

        return {
          setValue: { splitValues },
        }

      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        splitValues: {
          dependencyType: "stateVariable",
          variableName: "splitValues",
        },
      }),
      // when this state variable is marked stale
      // it indicates we should update replacement
      // For this to work, must get value in replacement functions
      // so that the variable is marked fresh
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };


    return stateVariableDefinitions;

  }


  static async createSerializedReplacements({ component, componentInfoObjects }) {

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let serializedReplacement = {
      componentType: "textList",
      state: { textsShadow: await component.stateValues.splitValues },
      downstreamDependencies: {
        [component.componentName]: [{
          dependencyType: "referenceShadow",
          compositeName: component.componentName,
          propVariable: "splitValues",
        }]
      },
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: [serializedReplacement],
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };
  }


}
