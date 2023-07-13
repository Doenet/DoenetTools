import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "../utils/deepFunctions";
import { processAssignNames } from "../utils/serializedStateProcessing";
import {
  convertAttributesForComponentType,
  verifyReplacementsMatchSpecifiedType,
} from "../utils/copy";
import { setUpVariantSeedAndRng } from "../utils/variants";

export default class Template extends CompositeComponent {
  static componentType = "template";

  static treatAsComponentForRecursiveReplacements = true;
  static includeBlankStringChildren = true;
  static renderedDefault = false;

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      return Object.keys(serializedComponent.children);
    }
  }

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.rendered = {
      createComponentOfType: "boolean",
      createStateVariable: "rendered",
      defaultValue: this.renderedDefault,
      public: true,
    };
    attributes.isResponse = {
      leaveRaw: true,
    };
    attributes.createComponentOfType = {
      createPrimitiveOfType: "string",
    };
    attributes.numComponents = {
      createPrimitiveOfType: "number",
    };

    attributes.asList = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "asList",
      defaultValue: false,
    };

    return attributes;
  }

  // don't need child logic
  // as all children will remain serialized

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let componentClass = this;

    stateVariableDefinitions.serializedChildren = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            serializedChildren: dependencyValues.serializedChildren,
          },
        };
      },
    };

    stateVariableDefinitions.newNamespace = {
      returnDependencies: () => ({
        newNamespace: {
          dependencyType: "attributePrimitive",
          attributeName: "newNamespace",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            newNamespace: dependencyValues.newNamespace,
          },
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        rendered: {
          dependencyType: "stateVariable",
          variableName: "rendered",
        },
      }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
      markStale() {
        return { updateReplacements: true };
      },
    };

    stateVariableDefinitions.isVariantComponent = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { isVariantComponent: true } }),
    };

    stateVariableDefinitions.generatedVariantInfo = {
      returnDependencies: ({ sharedParameters, componentInfoObjects }) => ({
        variantSeed: {
          dependencyType: "value",
          value: sharedParameters.variantSeed,
        },
        variantDescendants: {
          dependencyType: "descendant",
          componentTypes: Object.keys(
            componentInfoObjects.componentTypesCreatingVariants,
          ),
          variableNames: ["isVariantComponent", "generatedVariantInfo"],
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
          },
        };

        let subvariants = (generatedVariantInfo.subvariants = []);
        for (let descendant of dependencyValues.variantDescendants) {
          if (descendant.stateValues.isVariantComponent) {
            subvariants.push(descendant.stateValues.generatedVariantInfo);
          } else if (descendant.stateValues.generatedVariantInfo) {
            subvariants.push(
              ...descendant.stateValues.generatedVariantInfo.subvariants,
            );
          }
        }

        return {
          setValue: {
            generatedVariantInfo,
          },
        };
      },
    };

    stateVariableDefinitions.numComponentsSpecified = {
      returnDependencies: () => ({
        numComponentsAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "numComponents",
        },
        typeAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "createComponentOfType",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let numComponentsSpecified;

        if (dependencyValues.typeAttr) {
          let componentType =
            componentInfoObjects.componentTypeLowerCaseMapping[
              dependencyValues.typeAttr.toLowerCase()
            ];

          if (!(componentType in componentInfoObjects.allComponentClasses)) {
            throw Error(
              `Invalid componentType ${dependencyValues.typeAttr} of copy.`,
            );
          }
          if (dependencyValues.numComponentsAttr !== null) {
            numComponentsSpecified = dependencyValues.numComponentsAttr;
          } else {
            numComponentsSpecified = 1;
          }
        } else if (dependencyValues.numComponentsAttr !== null) {
          throw Error(
            `You must specify createComponentOfType when specifying numComponents for a ${componentClass.componentType}.`,
          );
        } else {
          numComponentsSpecified = null;
        }

        return { setValue: { numComponentsSpecified } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    componentInfoObjects,

    publicCaseInsensitiveAliasSubstitutions,
  }) {
    // evaluate numComponentsSpecified so get error if specify numComponents without createComponentOfType
    await component.stateValues.numComponentsSpecified;

    if (!(await component.stateValues.rendered)) {
      return { replacements: [] };
    } else {
      let replacements = deepClone(
        await component.state.serializedChildren.value,
      );

      let newNamespace = component.attributes.newNamespace?.primitive;

      if ("isResponse" in component.attributes) {
        // pass isResponse to replacements

        for (let repl of replacements) {
          if (typeof repl !== "object") {
            continue;
          }

          let attributesFromComposite = convertAttributesForComponentType({
            attributes: { isResponse: component.attributes.isResponse },
            componentType: repl.componentType,
            componentInfoObjects,
            compositeCreatesNewNamespace: newNamespace,
          });
          if (!repl.attributes) {
            repl.attributes = {};
          }

          Object.assign(repl.attributes, attributesFromComposite);
        }
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
        originalNamesAreConsistent: true,
      });

      let verificationResult = await verifyReplacementsMatchSpecifiedType({
        component,
        replacements: processResult.serializedComponents,
        assignNames: component.doenetAttributes.assignNames,
        componentInfoObjects,
        compositeAttributesObj: this.createAttributesObject(),

        components,
        publicCaseInsensitiveAliasSubstitutions,
      });

      // console.log(`serialized replacements for ${component.componentName}`)
      // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)))

      return { replacements: verificationResult.replacements };
    }
  }

  static async calculateReplacementChanges({
    component,
    componentInfoObjects,
  }) {
    if (!(await component.stateValues.rendered)) {
      if (
        component.replacements.length > 0 &&
        component.replacementsToWithhold === 0
      ) {
        let replacementsToWithhold = component.replacements.length;
        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold,
        };
        return [replacementInstruction];
      } else {
        return [];
      }
    } else {
      if (component.replacements.length > 0) {
        if (component.replacementsToWithhold > 0) {
          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: 0,
          };
          return [replacementInstruction];
        } else {
          return [];
        }
      } else {
        let createResult = await this.createSerializedReplacements({
          component,
          componentInfoObjects,
        });

        let replacements = createResult.replacements;

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToReplace: 0,
          serializedReplacements: replacements,
          replacementsToWithhold: 0,
        };

        return [replacementInstruction];
      }
    }
  }

  static setUpVariant({
    serializedComponent,
    sharedParameters,
    descendantVariantComponents,
  }) {
    setUpVariantSeedAndRng({
      serializedComponent,
      sharedParameters,
      descendantVariantComponents,
      useSubpartVariantRng: true,
    });
  }

  get allPotentialRendererTypes() {
    let allPotentialRendererTypes = super.allPotentialRendererTypes;

    let additionalRendererTypes =
      this.potentialRendererTypesFromSerializedComponents(
        this.serializedChildren,
      );
    for (let rendererType of additionalRendererTypes) {
      if (!allPotentialRendererTypes.includes(rendererType)) {
        allPotentialRendererTypes.push(rendererType);
      }
    }

    return allPotentialRendererTypes;
  }
}
