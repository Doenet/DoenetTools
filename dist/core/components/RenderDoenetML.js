import CompositeComponent from './abstract/CompositeComponent.js';
import * as serializeFunctions from '../utils/serializedStateProcessing.js';
import { setUpVariantSeedAndRng } from '../utils/variants.js';


export default class RenderDoenetML extends CompositeComponent {
  static componentType = "renderDoenetML";

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "triggerUpdates";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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
        return { setValue: { codeSourceComponentName: dependencyValues.codeSourceComponentName } }
      }
    }

    stateVariableDefinitions.codeSource = {
      returnDependencies: () => ({
        codeSourceComponentName: {
          dependencyType: "stateVariable",
          variableName: "codeSourceComponentName"
        },
        parentCodeSource: {
          dependencyType: "parentStateVariable",
          parentComponentType: "codeViewer",
          variableName: "codeSource"
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.codeSourceComponentName) {
          return { setValue: { codeSource: dependencyValues.codeSourceComponentName } };
        } else if (dependencyValues.parentCodeSource) {
          return { setValue: { codeSource: dependencyValues.parentCodeSource } };
        } else {
          return { setValue: { codeSource: null } };
        }

      },
    }

    stateVariableDefinitions.doenetML = {
      stateVariablesDeterminingDependencies: ["codeSource"],
      returnDependencies: ({ stateValues }) => ({
        doenetML: {
          dependencyType: "stateVariable",
          componentName: stateValues.codeSource,
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
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    stateVariableDefinitions.triggerUpdates = {
      defaultValue: true,
      hasEssential: true,
      returnDependencies: () => ({}),
      markStale() {
        return { updateReplacements: true }
      },
      definition() {
        return { useEssentialOrDefaultValue: { triggerUpdates: {} } };
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "triggerUpdates",
            value: desiredStateVariableValues.triggerUpdates,
          }]
        };
      }
    };


    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } })
    }


    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: ({ sharedParameters, componentInfoObjects }) => ({
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed,
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(componentInfoObjects.componentTypesCreatingVariants),
          variableNames: [
            "isVariantComponent",
            "generatedVariantInfo",
          ],
          useReplacementsForComposites: true,
          recurseToMatchedChildren: false,
          variablesOptional: true,
          includeNonActiveChildren: true,
          ignoreReplacementsOfEncounteredComposites: true,
        },
      }),
      definition({ dependencyValues, componentName }) {

        let generatedVariantInfo = {
          seed: dependencyValues.variantSeed,
          meta: {
            createdBy: componentName,
          }
        };


        let subvariants = generatedVariantInfo.subvariants = [];
        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo)
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(...descendant.stateValues.generatedVariantInfo.subvariants)
          }
        }

        return {
          setValue: {
            generatedVariantInfo,
          }
        }

      }
    }

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
        cids: [], doenetMLs: [doenetML],
        componentInfoObjects,
        flags,
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

  static async setUpVariant({
    serializedComponent, sharedParameters,
    descendantVariantComponents,
  }) {

    setUpVariantSeedAndRng({
      serializedComponent, sharedParameters,
      descendantVariantComponents
    });

  }

  async updateComponents({ actionId }) {
    let updateInstructions = [{
      updateType: "updateValue",
      componentName: this.componentName,
      stateVariable: "triggerUpdates",
      value: true,
    }];

    await this.coreFunctions.performUpdate({
      updateInstructions,
      actionId,
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
    updateComponents: this.updateComponents.bind(this)
  };

}