import CompositeComponent from './abstract/CompositeComponent';
import * as serializeFunctions from '../utils/serializedStateProcessing';


export default class RenderDoenetML extends CompositeComponent {
  static componentType = "renderDoenetML";

  static assignNamesToReplacements = true;

  static acceptTarget = true;

  static stateVariableToEvaluateAfterReplacements = "needsReplacementsUpdatedWhenStale";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }


    return attributes;


  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.doenetML = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "targetComponent",
          variableNames: ["text"],
          variablesOptional: true,
        }
      }),
      definition({ dependencyValues }) {
        let doenetML = "";

        if (dependencyValues.targetComponent) {
          doenetML = dependencyValues.targetComponent.stateValues.text;
          if (!typeof doenetML === "string") {
            doenetML = "";
          }
        }

        return { newValues: { doenetML } };
      }

    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        doenetML: {
          dependencyType: "stateVariable",
          variableName: "doenetML"
        },
      }),
      definition() {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      returnDependencies: () => ({
  
        triggerUpdates: {
          dependencyType: "stateVariable",
          variableName: "triggerUpdates"
        }
      }),
      markStale() {
        return { updateReplacements: true }
      },
      definition() {
        return { newValues: { needsReplacementsUpdatedWhenStale: true } };
      },
    };

    stateVariableDefinitions.triggerUpdates = {
      defaultValue: true,
      returnDependencies: () => ({}),
      definition() {
        return { useEssentialOrDefaultValue: { triggerUpdates: {} } };
      },
      inverseDefinition({desiredStateVariableValues}) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "triggerUpdates",
            value: desiredStateVariableValues.triggerUpdates,
          }]
         };
      }
    };


    return stateVariableDefinitions;

  }

  static async createSerializedReplacements({ component,
    componentInfoObjects, flags, workspace
  }) {
    console.log(`create serialized replacements for ${component.componentName}`)

    let serializedComponents = [];

    let doenetML = (await component.stateValues.doenetML).trim();

    workspace.previousDoenetML = doenetML;


    console.log(component.coreFunctions)

    try {
      let expandResult = await serializeFunctions.expandDoenetMLsToFullSerializedComponents({
        contentIds: [], doenetMLs: [doenetML],
        componentInfoObjects,
        flags,
        contentIdsToDoenetMLs: component.coreFunctions.contentIdsToDoenetMLs
      });

      serializedComponents = expandResult.fullSerializedComponents[0];

    } catch (e) {
      console.warn('error in user entered doenetML')
      console.warn(e.message);
      // throw e; //TODO: Need to communicate to user
      return { replacements: [] }
    }


    console.log(serializedComponents)

    let namespaceStack = component.componentName.split('/').map(x => ({ namespace: x, componentCounts: {}, namesUsed: {} }))

    serializeFunctions.createComponentNames({
      serializedComponents,
      componentInfoObjects,
      namespaceStack,
    });

    serializeFunctions.restrictTNamesToNamespace({
      components: serializedComponents,
      namespace: `${component.componentName}/`
    })

    let processResult = serializeFunctions.processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: serializedComponents,
      parentName: component.componentName,
      parentCreatesNewNamespace: true,
      componentInfoObjects,
      originalNamesAreConsistent: true,
    });

    console.log(processResult.serializedComponents)

    return { replacements: processResult.serializedComponents };


  }

  static async calculateReplacementChanges({ component, componentChanges,
    componentInfoObjects, flags, workspace
  }) {


    let doenetML = (await component.stateValues.doenetML).trim();

    if (workspace.previousDoenetML === doenetML) {
      return [];
    }

    workspace.previousDoenetML = doenetML;


    // aways recreate?

    let replacements = (await this.createSerializedReplacements({
      component, componentInfoObjects, flags, workspace
    })).replacements;


    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: replacements,
    };

    console.log(replacementInstruction)

    return [replacementInstruction];

  }

  async updateComponents(){
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable:"triggerUpdates",
      value: true,
    }];

    await this.coreFunctions.performUpdate({
      updateInstructions,
      // event: {
      //   verb: "selected",
      //   object: {
      //     componentName: this.componentName,
      //     componentType: this.componentType,
      //   },
      //   result: {
      //     response: newValue,
      //     responseText: newValue.toString(),
      //   }
      // },
    });
  }

  actions = {
    updateComponents: this.updateComponents.bind(
      new Proxy(this, this.readOnlyProxyHandler)
    )
  };

}