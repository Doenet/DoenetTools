import CompositeComponent from "./abstract/CompositeComponent";
import {
  convertAttributesForComponentType,
  postProcessCopy,
} from "../utils/copy";
import { processAssignNames } from "../utils/serializedStateProcessing";
import { replacementFromProp } from "./Copy";
import { deepClone } from "../utils/deepFunctions";

export default class Collect extends CompositeComponent {
  static componentType = "collect";

  static assignNamesToReplacements = true;

  static acceptTarget = true;
  static acceptAnyAttribute = true;

  static stateVariableToEvaluateAfterReplacements =
    "needsReplacementsUpdatedWhenStale";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    // delete off attributes from base component that should apply to replacements instead
    // (using acceptAnyAttribute)
    delete attributes.disabled;
    delete attributes.modifyIndirectly;
    delete attributes.fixed;
    delete attributes.styleNumber;
    delete attributes.isResponse;
    delete attributes.hide;

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.prop = {
      createPrimitiveOfType: "string",
    };
    attributes.maxNumber = {
      createComponentOfType: "number",
      createStateVariable: "maxNumber",
      defaultValue: null,
      public: true,
    };
    attributes.componentIndex = {
      createComponentOfType: "integer",
      createStateVariable: "componentIndex",
      defaultValue: null,
      public: true,
    };

    attributes.propIndex = {
      createComponentOfType: "numberList",
      createStateVariable: "propIndex",
      defaultValue: null,
      public: true,
    };

    attributes.sourceAttributesToIgnore = {
      createPrimitiveOfType: "stringArray",
      createStateVariable: "sourceAttributesToIgnore",
      defaultValue: ["isResponse"],
      public: true,
    };

    attributes.componentTypes = {
      createComponentOfType: "textList",
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.link = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { link: true } }),
    };

    stateVariableDefinitions.targetComponent = {
      shadowVariable: true,
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "targetComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            targetComponent: dependencyValues.targetComponent,
          },
        };
      },
    };

    stateVariableDefinitions.targetInactive = {
      stateVariablesDeterminingDependencies: ["targetComponent"],
      returnDependencies({ stateValues }) {
        if (stateValues.targetComponent) {
          return {
            targetIsInactiveCompositeReplacement: {
              dependencyType: "stateVariable",
              componentName: stateValues.targetComponent.componentName,
              variableName: "isInactiveCompositeReplacement",
            },
          };
        } else {
          return {};
        }
      },
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            targetInactive: Boolean(
              dependencyValues.targetIsInactiveCompositeReplacement,
            ),
          },
        };
      },
    };

    stateVariableDefinitions.targetName = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.targetComponent === null) {
          let warning = {
            message: "No source found for collect.",
            level: 1,
          };
          return { setValue: { targetName: "" }, sendWarnings: [warning] };
        }
        return {
          setValue: {
            targetName: dependencyValues.targetComponent.componentName,
          },
        };
      },
    };

    stateVariableDefinitions.propName = {
      shadowVariable: true,
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } };
      },
    };

    stateVariableDefinitions.componentTypesToCollect = {
      shadowVariable: true,
      additionalStateVariablesDefined: [
        {
          variableName: "componentClassesToCollect",
          shadowVariable: true,
        },
      ],
      returnDependencies: () => ({
        componentTypesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "componentTypes",
          variableNames: ["texts"],
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let componentTypesToCollect = [];
        let componentClassesToCollect = [];
        let warnings = [];

        if (dependencyValues.componentTypesAttr !== null) {
          for (let cType of dependencyValues.componentTypesAttr.stateValues
            .texts) {
            let componentType =
              componentInfoObjects.componentTypeLowerCaseMapping[
                cType.toLowerCase()
              ];
            let cClass =
              componentInfoObjects.allComponentClasses[componentType];

            if (cClass) {
              componentTypesToCollect.push(componentType);
              componentClassesToCollect.push(cClass);
            } else {
              let message =
                "Cannot collect components of type <" +
                cType +
                "> as it is an invalid component type.";
              warnings.push({ message, level: 1 });
            }
          }
        }

        return {
          setValue: {
            componentTypesToCollect,
            componentClassesToCollect,
          },
          sendWarnings: warnings,
        };
      },
    };

    stateVariableDefinitions.collectedComponents = {
      stateVariablesDeterminingDependencies: [
        "componentTypesToCollect",
        "targetName",
        "propName",
        "componentIndex",
        "propIndex",
      ],
      additionalStateVariablesDefined: ["effectivePropNameByComponent"],
      returnDependencies: function ({ stateValues }) {
        if (!stateValues.targetName) {
          return {};
        }

        let descendants = {
          dependencyType: "descendant",
          ancestorName: stateValues.targetName,
          componentTypes: stateValues.componentTypesToCollect,
          useReplacementsForComposites: true,
          includeNonActiveChildren: true,
          recurseToMatchedChildren: false,
          componentIndex: stateValues.componentIndex,
        };

        if (stateValues.propName) {
          let propIndex = stateValues.propIndex;
          if (propIndex) {
            // make propIndex be a shallow copy
            // so that can detect if it changed
            // when update dependencies
            propIndex = [...propIndex];
          }
          descendants.variableNames = [stateValues.propName];
          descendants.variablesOptional = true;
          descendants.propIndex = propIndex;
          descendants.caseInsensitiveVariableMatch = true;
          descendants.publicStateVariablesOnly = true;
          descendants.useMappedVariableNames = true;
        }

        return {
          descendants,
          maxNumber: {
            dependencyType: "stateVariable",
            variableName: "maxNumber",
          },
          propName: {
            dependencyType: "stateVariable",
            variableName: "propName",
          },
        };
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of collectedComponents for ${componentName}`)
        // console.log(dependencyValues)

        let collectedComponents = dependencyValues.descendants;
        if (!collectedComponents) {
          collectedComponents = [];
        }

        if (
          dependencyValues.maxNumber !== null &&
          collectedComponents.length > dependencyValues.maxNumber
        ) {
          let maxnum = Math.max(0, Math.floor(dependencyValues.maxNumber));
          collectedComponents = collectedComponents.slice(0, maxnum);
        }

        let effectivePropNameByComponent = [];

        for (let comp of collectedComponents) {
          let propName;
          if (comp.stateValues) {
            propName = Object.keys(comp.stateValues)[0];
          }
          if (!propName && dependencyValues.propName) {
            // a propName was specified, but it just wasn't found
            propName = "__prop_name_not_found";
          }
          effectivePropNameByComponent.push(propName);
        }

        return {
          setValue: { collectedComponents, effectivePropNameByComponent },
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        collectedComponents: {
          dependencyType: "stateVariable",
          variableName: "collectedComponents",
        },
        needsReplacementsUpdatedWhenStale: {
          dependencyType: "stateVariable",
          variableName: "needsReplacementsUpdatedWhenStale",
        },
      }),
      definition: () => ({
        setValue: { readyToExpandWhenResolved: true },
      }),
    };

    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      returnDependencies() {
        return {
          collectedComponents: {
            dependencyType: "stateVariable",
            variableName: "collectedComponents",
          },
        };
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale() {
        return { updateReplacements: true };
      },
      definition() {
        return { setValue: { needsReplacementsUpdatedWhenStale: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    workspace,
    componentInfoObjects,
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
    flags,
  }) {
    // console.log(`create serialized replacements for ${component.componentName}`)
    // console.log(await component.stateValues.collectedComponents)

    let errors = [];
    let warnings = [];

    workspace.numReplacementsByCollected = [];
    workspace.collectedNames = [];
    workspace.replacementNamesByCollected = [];
    workspace.propVariablesCopiedByCollected = [];
    workspace.uniqueIdentifiersUsedByCollected = {};

    if (!(await component.stateValues.targetComponent)) {
      return { replacements: [], errors, warnings };
    }

    let replacements = [];

    let numReplacementsByCollected = [];
    let numReplacementsSoFar = 0;
    let replacementNamesByCollected = [];

    let compositeAttributesObj = this.createAttributesObject();

    let collectedComponents = await component.stateValues.collectedComponents;
    for (
      let collectedNum = 0;
      collectedNum < collectedComponents.length;
      collectedNum++
    ) {
      if (collectedComponents[collectedNum]) {
        let uniqueIdentifiersUsed = (workspace.uniqueIdentifiersUsedByCollected[
          collectedNum
        ] = []);
        let results = await this.createReplacementForCollected({
          component,
          collectedNum,
          components,
          numReplacementsSoFar,
          uniqueIdentifiersUsed,
          componentInfoObjects,
          compositeAttributesObj,
          numComponentsForSource,
          publicCaseInsensitiveAliasSubstitutions,
          flags,
        });
        errors.push(...results.errors);
        warnings.push(...results.warnings);

        workspace.propVariablesCopiedByCollected[collectedNum] =
          results.propVariablesCopiedByReplacement;

        let collectedReplacements = results.serializedReplacements;
        numReplacementsByCollected[collectedNum] = collectedReplacements.length;
        numReplacementsSoFar += collectedReplacements.length;
        replacements.push(...collectedReplacements);
        replacementNamesByCollected[collectedNum] = collectedReplacements.map(
          (x) => x.componentName,
        );
      } else {
        numReplacementsByCollected[collectedNum] = 0;
        replacementNamesByCollected[collectedNum] = [];
        workspace.propVariablesCopiedByCollected[collectedNum] = [];
      }
    }

    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = collectedComponents.map((x) => x.componentName);
    workspace.replacementNamesByCollected = replacementNamesByCollected;
    return { replacements, errors, warnings };
  }

  static async createReplacementForCollected({
    component,
    components,
    collectedNum,
    numReplacementsSoFar,
    uniqueIdentifiersUsed,
    componentInfoObjects,
    compositeAttributesObj,
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
    flags,
  }) {
    // console.log(`create replacement for collected ${collectedNum}, ${numReplacementsSoFar}`)

    let errors = [];
    let warnings = [];

    let collectedObj = (await component.stateValues.collectedComponents)[
      collectedNum
    ];
    let collectedName = collectedObj.componentName;
    let collectedComponent = components[collectedName];

    let serializedReplacements = [];
    let propVariablesCopiedByReplacement = [];

    // since we delayed recalculating descendants,
    // it's possible that a collectedComponent no longer exists
    // but hasn't been removed from the state variable
    // In this case, skip
    if (!collectedComponent) {
      return {
        serializedReplacements,
        propVariablesCopiedByReplacement,
        errors,
        warnings,
      };
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let propName = (await component.stateValues.effectivePropNameByComponent)[
      collectedNum
    ];
    if (propName) {
      let results = await replacementFromProp({
        component,
        components,
        replacementSource: collectedObj,
        propName,
        // numReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
      });
      errors.push(...results.errors);
      warnings.push(...results.warnings);

      serializedReplacements = results.serializedReplacements;
      propVariablesCopiedByReplacement =
        results.propVariablesCopiedByReplacement;
    } else {
      let sourceAttributesToIgnore = await component.stateValues
        .sourceAttributesToIgnore;

      let serializedCopy = [
        await collectedComponent.serialize({
          sourceAttributesToIgnore,
        }),
      ];

      serializedReplacements = postProcessCopy({
        serializedComponents: serializedCopy,
        componentName: component.componentName,
        uniqueIdentifiersUsed,
        identifierPrefix: collectedNum + "|",
      });

      for (let repl of serializedReplacements) {
        // add attributes
        if (!repl.attributes) {
          repl.attributes = {};
        }
        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: repl.componentType,
          componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
          flags,
        });
        Object.assign(repl.attributes, attributesFromComposite);
      }
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      indOffset: numReplacementsSoFar,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    serializedReplacements = processResult.serializedComponents;

    return {
      serializedReplacements,
      propVariablesCopiedByReplacement,
      errors,
      warnings,
    };
  }

  static async calculateReplacementChanges({
    component,
    componentChanges,
    components,
    workspace,
    componentInfoObjects,
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
    flags,
  }) {
    // console.log("Calculating replacement changes for " + component.componentName);
    // console.log((await component.stateValues.collectedComponents).map(x => x.componentName))
    // console.log(deepClone(workspace));
    // console.log(component.replacements.map(x => x.componentName))

    // TODO: don't yet have a way to return errors and warnings!
    let errors = [];
    let warnings = [];

    let numReplacementsFoundSoFar = 0;

    // adjust workspace variables by any replacements that were deleted
    for (
      let collectedNum = 0;
      collectedNum < workspace.numReplacementsByCollected.length;
      collectedNum++
    ) {
      let indsDeleted = [];
      for (let [ind, repName] of workspace.replacementNamesByCollected[
        collectedNum
      ].entries()) {
        if (
          !component.replacements[numReplacementsFoundSoFar] ||
          component.replacements[numReplacementsFoundSoFar].componentName !==
            repName
        ) {
          indsDeleted.push(ind);
        } else {
          numReplacementsFoundSoFar++;
        }
      }

      for (let ind of indsDeleted.reverse()) {
        workspace.replacementNamesByCollected[collectedNum].splice(ind, 1);
        workspace.propVariablesCopiedByCollected[collectedNum].splice(ind, 1);
      }
      workspace.numReplacementsByCollected[collectedNum] -= indsDeleted.length;
    }

    let replacementChanges = [];

    let numReplacementsSoFar = 0;

    let numReplacementsByCollected = [];
    let propVariablesCopiedByCollected = [];
    let replacementNamesByCollected = [];

    let collectedComponents = await component.stateValues.collectedComponents;
    let maxCollectedLength = Math.max(
      collectedComponents.length,
      workspace.numReplacementsByCollected.length,
    );

    let recreateRemaining = false;

    let compositeAttributesObj = this.createAttributesObject();

    for (
      let collectedNum = 0;
      collectedNum < maxCollectedLength;
      collectedNum++
    ) {
      let collected = collectedComponents[collectedNum];
      if (collected === undefined) {
        if (workspace.numReplacementsByCollected[collectedNum] > 0) {
          if (!recreateRemaining) {
            // since deleting replacement will shift the remaining replacements
            // and change resulting names,
            // delete all remaining and mark to be recreated

            let numberReplacementsLeft = workspace.numReplacementsByCollected
              .slice(collectedNum)
              .reduce((a, c) => a + c, 0);

            if (numberReplacementsLeft > 0) {
              let replacementInstruction = {
                changeType: "delete",
                changeTopLevelReplacements: true,
                firstReplacementInd: numReplacementsSoFar,
                numberReplacementsToDelete: numberReplacementsLeft,
              };
              replacementChanges.push(replacementInstruction);
            }

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsByCollected
              .slice(collectedNum)
              .forEach((v, i) => (workspace.numReplacementsByCollected[i] = 0));
          }

          workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
        }

        numReplacementsByCollected[collectedNum] = 0;
        propVariablesCopiedByCollected.push([]);
        replacementNamesByCollected.push([]);

        continue;
      }

      let prevCollectedName = workspace.collectedNames[collectedNum];

      // check if collected has changed
      if (
        prevCollectedName === undefined ||
        collected.componentName !== prevCollectedName ||
        recreateRemaining
      ) {
        let prevNumReplacements = 0;
        if (prevCollectedName !== undefined) {
          prevNumReplacements =
            workspace.numReplacementsByCollected[collectedNum];
        }

        let numReplacementsToDelete = prevNumReplacements;
        if (recreateRemaining) {
          // already deleted old replacements
          numReplacementsToDelete = 0;
        }

        let uniqueIdentifiersUsed = (workspace.uniqueIdentifiersUsedByCollected[
          collectedNum
        ] = []);
        let results = await this.recreateReplacements({
          component,
          collectedNum,
          numReplacementsSoFar,
          numReplacementsToDelete,
          components,
          uniqueIdentifiersUsed,
          componentInfoObjects,
          compositeAttributesObj,
          numComponentsForSource,
          publicCaseInsensitiveAliasSubstitutions,
          flags,
        });
        errors.push(...results.errors);
        warnings.push(...results.warnings);

        numReplacementsSoFar += results.numReplacements;

        numReplacementsByCollected[collectedNum] = results.numReplacements;

        propVariablesCopiedByCollected[collectedNum] =
          results.propVariablesCopiedByReplacement;

        let replacementInstruction = results.replacementInstruction;

        replacementNamesByCollected[collectedNum] =
          replacementInstruction.serializedReplacements.map(
            (x) => x.componentName,
          );

        if (!recreateRemaining) {
          if (results.numReplacements !== prevNumReplacements) {
            // we changed the number of replacements which shifts remaining ones
            // since names won't match, we need to delete
            // all the remaining replacements and recreate them

            let numberReplacementsLeft = workspace.numReplacementsByCollected
              .slice(collectedNum)
              .reduce((a, c) => a + c, 0);

            replacementInstruction.numberReplacementsToReplace =
              numberReplacementsLeft;

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsByCollected
              .slice(collectedNum)
              .forEach((v, i) => (workspace.numReplacementsByCollected[i] = 0));
          }
        }

        replacementChanges.push(replacementInstruction);

        continue;
      }

      if (!(await component.stateValues.propName)) {
        numReplacementsSoFar +=
          workspace.numReplacementsByCollected[collectedNum];
        numReplacementsByCollected[collectedNum] =
          workspace.numReplacementsByCollected[collectedNum];
        replacementNamesByCollected[collectedNum] =
          workspace.replacementNamesByCollected[collectedNum];
        propVariablesCopiedByCollected[collectedNum] = [];
        continue;
      }

      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = (workspace.uniqueIdentifiersUsedByCollected[
        collectedNum
      ] = []);
      let results = await this.createReplacementForCollected({
        component,
        collectedNum,
        components,
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
        componentInfoObjects,
        compositeAttributesObj,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        flags,
      });
      errors.push(...results.errors);
      warnings.push(...results.warnings);

      let propVariablesCopiedByReplacement =
        results.propVariablesCopiedByReplacement;

      let newSerializedReplacements = results.serializedReplacements;

      let nNewReplacements = newSerializedReplacements.length;
      let nOldReplacements = workspace.numReplacementsByCollected[collectedNum];

      if (nNewReplacements !== nOldReplacements) {
        // changing the number of replacements will shift the remaining replacements
        // and change resulting names,
        // delete all remaining and mark to be recreated

        let numberReplacementsLeft = workspace.numReplacementsByCollected
          .slice(collectedNum)
          .reduce((a, c) => a + c, 0);

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: numReplacementsSoFar,
          numberReplacementsToReplace: numberReplacementsLeft,
          serializedReplacements: newSerializedReplacements,
          assignNamesOffset: numReplacementsSoFar,
        };

        replacementChanges.push(replacementInstruction);

        recreateRemaining = true;

        // since deleted remaining, change in workspace
        // so that don't attempt to delete again
        workspace.numReplacementsByCollected
          .slice(collectedNum)
          .forEach((v, i) => (workspace.numReplacementsByCollected[i] = 0));
      } else {
        for (let ind = 0; ind < nNewReplacements; ind++) {
          if (
            propVariablesCopiedByReplacement[ind].length !==
              workspace.propVariablesCopiedByCollected[collectedNum][ind]
                .length ||
            workspace.propVariablesCopiedByCollected[collectedNum][ind].some(
              (v, i) => v !== propVariablesCopiedByReplacement[ind][i],
            )
          ) {
            let replacementInstruction = {
              changeType: "add",
              changeTopLevelReplacements: true,
              firstReplacementInd: numReplacementsSoFar + ind,
              numberReplacementsToReplace: 1,
              serializedReplacements: [newSerializedReplacements[ind]],
              assignNamesOffset: numReplacementsSoFar + ind,
            };
            replacementChanges.push(replacementInstruction);
          }
        }
      }

      numReplacementsSoFar += nNewReplacements;

      numReplacementsByCollected[collectedNum] = nNewReplacements;

      propVariablesCopiedByCollected[collectedNum] =
        propVariablesCopiedByReplacement;

      replacementNamesByCollected[collectedNum] = newSerializedReplacements.map(
        (x) => x.componentName,
      );
    }

    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = collectedComponents.map((x) => x.componentName);
    workspace.propVariablesCopiedByCollected = propVariablesCopiedByCollected;
    workspace.replacementNamesByCollected = replacementNamesByCollected;

    return replacementChanges;
  }

  static async recreateReplacements({
    component,
    collectedNum,
    numReplacementsSoFar,
    numReplacementsToDelete,
    uniqueIdentifiersUsed,
    components,
    componentInfoObjects,
    compositeAttributesObj,
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
    flags,
  }) {
    let errors = [];
    let warnings = [];

    let results = await this.createReplacementForCollected({
      component,
      collectedNum,
      components,
      numReplacementsSoFar,
      uniqueIdentifiersUsed,
      componentInfoObjects,
      compositeAttributesObj,
      numComponentsForSource,
      publicCaseInsensitiveAliasSubstitutions,
      flags,
    });
    errors.push(...results.errors);
    warnings.push(...results.warnings);

    let propVariablesCopiedByReplacement =
      results.propVariablesCopiedByReplacement;

    let newSerializedChildren = results.serializedReplacements;

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: numReplacementsToDelete,
      serializedReplacements: newSerializedChildren,
      assignNamesOffset: numReplacementsSoFar,
    };

    return {
      numReplacements: newSerializedChildren.length,
      propVariablesCopiedByReplacement,
      replacementInstruction,
      errors,
      warnings,
    };
  }
}
