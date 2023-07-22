import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "../utils/deepFunctions";
import { processAssignNames } from "../utils/serializedStateProcessing";
import { createUniqueName } from "../utils/naming";
import { setUpVariantSeedAndRng } from "../utils/variants";

export default class ConditionalContent extends CompositeComponent {
  static componentType = "conditionalContent";

  static includeBlankStringChildren = true;

  static assignNamesToReplacements = true;

  static createsVariants = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  // keep serialized all children other othan cases or else
  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    let componentIsSpecifiedType =
      componentInfoObjects.componentIsSpecifiedType;

    let keepSerializedInds = [];
    for (let [ind, child] of serializedComponent.children.entries()) {
      if (
        !(
          componentIsSpecifiedType(child, "case") ||
          componentIsSpecifiedType(child, "else")
        )
      ) {
        keepSerializedInds.push(ind);
      }
    }

    return keepSerializedInds;
  }

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };

    attributes.condition = {
      createComponentOfType: "boolean",
    };

    return attributes;
  }

  static returnChildGroups() {
    return [
      {
        group: "cases",
        componentTypes: ["case"],
      },
      {
        group: "elses",
        componentTypes: ["else"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.baseConditionSatisfied = {
      returnDependencies: () => ({
        conditionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "condition",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let baseConditionSatisfied = true;
        if (dependencyValues.conditionAttr) {
          baseConditionSatisfied =
            dependencyValues.conditionAttr.stateValues.value;
        }

        return { setValue: { baseConditionSatisfied } };
      },
    };

    stateVariableDefinitions.numCases = {
      additionalStateVariablesDefined: ["caseChildren"],
      returnDependencies: () => ({
        caseChildren: {
          dependencyType: "child",
          childGroups: ["cases"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            caseChildren: dependencyValues.caseChildren,
            numCases: dependencyValues.caseChildren.length,
          },
        };
      },
    };

    stateVariableDefinitions.elseChild = {
      returnDependencies: () => ({
        elseChild: {
          dependencyType: "child",
          childGroups: ["elses"],
        },
      }),
      definition({ dependencyValues }) {
        let elseChild = null;
        if (dependencyValues.elseChild.length > 0) {
          elseChild = dependencyValues.elseChild[0];
        }
        return { setValue: { elseChild } };
      },
    };

    stateVariableDefinitions.haveCasesOrElse = {
      returnDependencies: () => ({
        numCases: {
          dependencyType: "stateVariable",
          variableName: "numCases",
        },
        elseChild: {
          dependencyType: "stateVariable",
          variableName: "elseChild",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          haveCasesOrElse:
            dependencyValues.numCases > 0 ||
            dependencyValues.elseChild !== null,
        },
      }),
    };

    stateVariableDefinitions.selectedIndex = {
      returnDependencies: () => ({
        caseChildren: {
          dependencyType: "child",
          childGroups: ["cases"],
          variableNames: ["conditionSatisfied"],
        },
        elseChild: {
          dependencyType: "stateVariable",
          variableName: "elseChild",
        },
      }),
      definition({ dependencyValues }) {
        let selectedIndex = null;
        for (let [ind, child] of dependencyValues.caseChildren.entries()) {
          if (child.stateValues.conditionSatisfied) {
            selectedIndex = ind;
            break;
          }
        }
        if (selectedIndex === null && dependencyValues.elseChild) {
          selectedIndex = dependencyValues.caseChildren.length;
        }

        return {
          setValue: {
            selectedIndex,
          },
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        baseConditionSatisfied: {
          dependencyType: "stateVariable",
          variableName: "baseConditionSatisfied",
        },
        haveCasesOrElse: {
          dependencyType: "stateVariable",
          variableName: "haveCasesOrElse",
        },
        selectedIndex: {
          dependencyType: "stateVariable",
          variableName: "selectedIndex",
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition() {
        return {
          setValue: { readyToExpandWhenResolved: true },
        };
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

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    workspace,
    componentInfoObjects,
  }) {
    let replacementResults = await this.getReplacements(
      component,
      components,
      componentInfoObjects,
    );

    workspace.previousSelectedIndex = await component.stateValues.selectedIndex;
    workspace.previousBaseConditionSatisfied = await component.stateValues
      .baseConditionSatisfied;

    // console.log(`replacements for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(replacements)));
    // console.log(replacements);

    return replacementResults;
  }

  static async getReplacements(component, components, componentInfoObjects) {
    let errors = [];
    let warnings = [];

    if (!(await component.stateValues.baseConditionSatisfied)) {
      return { replacements: [], errors, warnings };
    }

    let replacements = [];

    if (!(await component.stateValues.haveCasesOrElse)) {
      replacements = deepClone(component.serializedChildren);
    } else {
      let caseChildren = await component.stateValues.caseChildren;

      let selectedIndex = await component.stateValues.selectedIndex;

      if (selectedIndex !== null) {
        let selectedChildName, childComponentType, newNameForSelectedChild;
        if (selectedIndex < (await component.stateValues.numCases)) {
          selectedChildName = caseChildren[selectedIndex].componentName;
          newNameForSelectedChild = createUniqueName(
            "case",
            `${component.componentName}|replacement|${selectedIndex}`,
          );
          childComponentType = "case";
        } else {
          selectedChildName = (await component.stateValues.elseChild)
            .componentName;
          newNameForSelectedChild = createUniqueName(
            "else",
            `${component.componentName}|replacement|${selectedIndex}`,
          );
          childComponentType = "else";
        }

        let lastSlash = selectedChildName.lastIndexOf("/");
        let originalNamespace = selectedChildName.substring(0, lastSlash);
        newNameForSelectedChild =
          originalNamespace + "/" + newNameForSelectedChild;

        // use state, not stateValues, as read only proxy messes up internal
        // links between descendant variant components and the components themselves

        let serializedGrandchildren = deepClone(
          await components[selectedChildName].state.serializedChildren.value,
        );
        let serializedChild = {
          componentType: childComponentType,
          state: { rendered: true },
          doenetAttributes: Object.assign(
            {},
            components[selectedChildName].doenetAttributes,
          ),
          children: serializedGrandchildren,
          originalName: newNameForSelectedChild,
          variants: {
            desiredVariant: {
              seed:
                component.sharedParameters.variantSeed +
                "|" +
                selectedIndex.toString(),
            },
          },
        };

        if (components[selectedChildName].attributes.newNamespace) {
          serializedChild.attributes = { newNamespace: { primitive: true } };
        }

        replacements.push(serializedChild);
      }
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
      originalNamesAreConsistent: true,
      doenetMLrange: component.doenetMLrange,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    return {
      replacements: processResult.serializedComponents,
      errors,
      warnings,
    };
  }

  static async calculateReplacementChanges({
    component,
    components,
    workspace,
    componentInfoObjects,
  }) {
    // console.log(`calculate replacement changes for selectByCondition ${component.componentName}`)
    // console.log(workspace.previousSelectedIndex);
    // console.log(component.stateValues.selectedIndex);

    // TODO: don't yet have a way to return errors and warnings!
    let errors = [];
    let warnings = [];

    let selectedIndex = await component.stateValues.selectedIndex;
    let baseConditionSatisfied = await component.stateValues
      .baseConditionSatisfied;

    if (workspace.previousSelectedIndex === selectedIndex) {
      if (workspace.previousBaseConditionSatisfied === baseConditionSatisfied) {
        return [];
      } else {
        if (baseConditionSatisfied) {
          if (
            component.replacements.length ===
            component.serializedChildren.length
          ) {
            // just stop withholding replacements
            // stop withholding replacements

            let replacementInstruction = {
              changeType: "changeReplacementsToWithhold",
              replacementsToWithhold: 0,
            };

            workspace.previousBaseConditionSatisfied = baseConditionSatisfied;
            return [replacementInstruction];
          }
        } else {
          let replacementsToWithhold = component.replacements.length;
          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold,
          };

          workspace.previousBaseConditionSatisfied = baseConditionSatisfied;
          return [replacementInstruction];
        }
      }
    }

    // delete previous replacements and create new ones
    // TODO: could we find a way to withhold old ones?
    // Either change order of replacements or allow to withhold later replacements

    let replacementChanges = [];

    let replacementResults = await this.getReplacements(
      component,
      components,
      componentInfoObjects,
    );
    errors.push(...replacementResults.errors);
    warnings.push(...replacementResults.warnings);

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: replacementResults.replacements,
      replacementsToWithhold: 0,
    };

    replacementChanges.push(replacementInstruction);

    workspace.previousSelectedIndex = selectedIndex;
    workspace.previousBaseConditionSatisfied = baseConditionSatisfied;

    return replacementChanges;
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

    if (this.serializedChildren) {
      let additionalRendererTypes =
        this.potentialRendererTypesFromSerializedComponents(
          this.serializedChildren,
        );
      for (let rendererType of additionalRendererTypes) {
        if (!allPotentialRendererTypes.includes(rendererType)) {
          allPotentialRendererTypes.push(rendererType);
        }
      }
    }

    return allPotentialRendererTypes;
  }
}
