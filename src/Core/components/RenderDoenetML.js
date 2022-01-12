import CompositeComponent from './abstract/CompositeComponent';
import * as serializeFunctions from '../utils/serializedStateProcessing';


export default class RenderDoenetML extends CompositeComponent {
  static componentType = "renderDoenetML";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "needsReplacementsUpdatedWhenStale";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }

    attributes.codeSource = {
      createPrimitiveOfType: "string",
      createStateVariable: "rawCodeSource",
      defaultValue: null,
    }


    return attributes;


  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.codeSourceComponentName = {
      stateVariablesDeterminingDependencies: ["rawCodeSource"],
      returnDependencies({ stateValues }) {
        if (stateValues.rawCodeSource) {
          return {
            codeSourceComponentName: {
              dependencyType: "expandTargetName",
              target: stateValues.rawCodeSource
            }
          }
        } else {
          return {}
        }
      },
      definition({ dependencyValues }) {
        return { newValues: { codeSourceComponentName: dependencyValues.codeSourceComponentName } }
      }
    }

    stateVariableDefinitions.codeSource = {
      returnDependencies: () => ({
        codeSourceComponentName: {
          dependencyType: "stateVariable",
          variableName: "codeSourceComponentName"
        },
        codeViewerParent: {
          dependencyType: "parentIdentity",
          parentComponentType: "codeEditor"
        },
      }),
      definition: function ({ dependencyValues }) {
        console.log("dependencyValues",dependencyValues)
        if (dependencyValues.codeSourceComponentName){
          return { newValues: { codeSource: dependencyValues.codeSourceComponentName } }; 
        }else if(dependencyValues.codeViewerParent){
          return { newValues: { codeSource: dependencyValues.codeViewerParent.componentName } }; 
        }else{
          return { newValues: { codeSource: null } }; 
        }
     
      },
    }


    stateVariableDefinitions.doenetML = {
      stateVariablesDeterminingDependencies: ["codeSourceComponentName"],
      returnDependencies: ({ stateValues }) => ({
        doenetML: {
          dependencyType: "stateVariable",
          componentName: stateValues.codeSourceComponentName,
          variableName: "text",
          variablesOptional: true,
        }
      }),
      definition({ dependencyValues }) {
        let doenetML = "";

        if (dependencyValues.doenetML) {
          doenetML = dependencyValues.doenetML;
          if (typeof doenetML !== "string") {
            doenetML = "";
          }
        }

        return { setValue: { doenetML } };
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
        return { setValue: { needsReplacementsUpdatedWhenStale: true } };
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

    let serializedComponents = [];

    let doenetML = (await component.stateValues.doenetML).trim();

    workspace.previousDoenetML = doenetML;

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