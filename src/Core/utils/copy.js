import { getUniqueIdentifierFromBase } from "./naming";
import {
  applyMacros,
  applySugar,
  componentFromAttribute,
  processAssignNames,
  removeBlankStringChildren,
} from "./serializedStateProcessing";

export function postProcessCopy({
  serializedComponents,
  componentName,
  addShadowDependencies = true,
  markAsPrimaryShadow = false,
  uniqueIdentifiersUsed = [],
  identifierPrefix = "",
  unlinkExternalCopies = false,
  copiesByTargetComponentName = {},
  componentNamesFound = [],
  assignNamesFound = [],
  activeAliases = [],
  init = true,
}) {
  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - add unique identifiers

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

    if (typeof component !== "object") {
      continue;
    }

    let uniqueIdentifierBase;
    if (component.originalName) {
      if (unlinkExternalCopies) {
        componentNamesFound.push(component.originalName);
        if (
          component.originalDoenetAttributes &&
          component.originalDoenetAttributes.assignNames
        ) {
          let originalNamespace;
          if (component.attributes.newNamespace?.primitive) {
            originalNamespace = component.originalName;
          } else {
            let lastSlash = component.originalName.lastIndexOf("/");
            originalNamespace = component.originalName.substring(0, lastSlash);
          }
          for (let cName of component.originalDoenetAttributes.assignNames) {
            componentNamesFound.push(originalNamespace + "/" + cName);
            assignNamesFound.push(originalNamespace + "/" + cName);
          }
        }
        if (component.attributes) {
          if (component.attributes.alias) {
            activeAliases.push(component.attributes.alias.primitive);
          }
          if (component.attributes.indexAlias) {
            activeAliases.push(component.attributes.indexAlias.primitive);
          }
        }
      }

      // preserializedNamesFound[component.originalName] = component;
      uniqueIdentifierBase =
        identifierPrefix + component.originalName + "|shadow";

      if (!component.originalNameFromSerializedComponent) {
        // if originalNameFromSerializedComponent, then was copied from a serialized component
        // so copy cannot shadow anything
        if (addShadowDependencies) {
          let downDep = {
            [component.originalName]: [
              {
                dependencyType: "referenceShadow",
                compositeName: componentName,
              },
            ],
          };
          if (init) {
            downDep[component.originalName][0].firstLevelReplacement = true;
          }
          if (markAsPrimaryShadow) {
            downDep[component.originalName][0].isPrimaryShadow = true;
          }
          if (component.state) {
            let stateVariables = Object.keys(component.state);
            downDep[component.originalName].downstreamStateVariables =
              stateVariables;
            downDep[component.originalName].upstreamStateVariables =
              stateVariables;
          }

          // create downstream dependency
          component.downstreamDependencies = downDep;
        } else {
          component.unlinkedCopySource = component.originalName;
        }
      }
    } else {
      uniqueIdentifierBase =
        identifierPrefix + component.componentType + "|shadowUnnamed";
    }

    if (component.componentType === "copy" && unlinkExternalCopies) {
      let targetComponentName = component.doenetAttributes.targetComponentName;
      if (!targetComponentName) {
        if (!component.attributes.uri) {
          throw Error("we need to create a targetComponentName here, then.");
        }
      } else {
        if (activeAliases.includes(component.doenetAttributes.target)) {
          // TODO: is the this right thing to do?
          // Not clear if following the same rules for when a match would override an alias
          // Setting targetComponentName to a relative name presumably prevents the targetComponentName
          // from ever matching anything.  Is that what we want?
          component.doenetAttributes.targetComponentName =
            component.doenetAttributes.target;
        } else {
          // don't create if matches an alias
          if (copiesByTargetComponentName[targetComponentName] === undefined) {
            copiesByTargetComponentName[targetComponentName] = [];
          }
          copiesByTargetComponentName[targetComponentName].push(component);
        }
      }
    }

    component.uniqueIdentifier = getUniqueIdentifierFromBase(
      uniqueIdentifierBase,
      uniqueIdentifiersUsed,
    );
  }

  // recurse after processing all components
  // so that first gather all active aliases

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];
    if (typeof component !== "object") {
      continue;
    }

    postProcessCopy({
      serializedComponents: component.children,
      componentName,
      addShadowDependencies,
      markAsPrimaryShadow,
      uniqueIdentifiersUsed,
      identifierPrefix,
      unlinkExternalCopies,
      copiesByTargetComponentName,
      componentNamesFound,
      assignNamesFound,
      activeAliases: [...activeAliases], // don't add values from children
      init: false,
    });

    for (let attrName in component.attributes) {
      let attribute = component.attributes[attrName];
      if (attribute.component) {
        attribute.component = postProcessCopy({
          serializedComponents: [attribute.component],
          componentName,
          addShadowDependencies,
          markAsPrimaryShadow,
          uniqueIdentifiersUsed,
          identifierPrefix,
          unlinkExternalCopies,
          copiesByTargetComponentName,
          componentNamesFound,
          assignNamesFound,
          activeAliases: [...activeAliases], // don't add values from children
          init: false,
        })[0];
      }
    }

    if (component.replacements) {
      postProcessCopy({
        serializedComponents: component.replacements,
        componentName,
        addShadowDependencies,
        markAsPrimaryShadow,
        uniqueIdentifiersUsed,
        identifierPrefix,
        unlinkExternalCopies,
        copiesByTargetComponentName,
        componentNamesFound,
        assignNamesFound,
        activeAliases: [...activeAliases], // don't add values from children
        init: false,
      });
    }
  }

  if (init && unlinkExternalCopies) {
    for (let targetComponentName in copiesByTargetComponentName) {
      if (!componentNamesFound.includes(targetComponentName)) {
        let foundMatchViaAssignNames = false;
        for (let cName of assignNamesFound) {
          let namespace = cName + "/";
          let nSpaceLen = namespace.length;
          if (targetComponentName.substring(0, nSpaceLen) === namespace) {
            foundMatchViaAssignNames = true;
            break;
          }
        }
        if (!foundMatchViaAssignNames) {
          for (let copyComponent of copiesByTargetComponentName[
            targetComponentName
          ]) {
            if (!copyComponent.attributes) {
              copyComponent.attributes = {};
            }
            copyComponent.attributes.link = { primitive: false };
            copyComponent.doenetAttributes.target =
              copyComponent.doenetAttributes.targetComponentName;
          }
        }
      }
    }
  }

  return serializedComponents;
}

export function convertAttributesForComponentType({
  attributes,
  componentType,
  componentInfoObjects,
  compositeAttributesObj = {},
  compositeCreatesNewNamespace,
}) {
  let newClass = componentInfoObjects.allComponentClasses[componentType];
  let newAttributesObj = newClass.createAttributesObject();
  let attributeLowerCaseMapping = {};
  for (let propName in newAttributesObj) {
    attributeLowerCaseMapping[propName.toLowerCase()] = propName;
  }

  let newAttributes = {};

  for (let attrName in attributes) {
    if (
      attrName in compositeAttributesObj &&
      !compositeAttributesObj[attrName].leaveRaw
    ) {
      // skip any attributes in the composite itself
      // unless specifically marked to not be processed for the composite
      continue;
    }

    let propName = attributeLowerCaseMapping[attrName.toLowerCase()];
    let attrObj = newAttributesObj[propName];
    if (attrObj) {
      if (propName in newAttributes) {
        throw Error(`Cannot repeat prop ${propName}`);
      }

      newAttributes[propName] = componentFromAttribute({
        attrObj,
        value: JSON.parse(JSON.stringify(attributes[attrName])),
        componentInfoObjects,
      });

      if (newAttributes[propName].component?.children) {
        let serializedComponents = [newAttributes[propName].component];

        applyMacros(serializedComponents, componentInfoObjects);

        removeBlankStringChildren(serializedComponents, componentInfoObjects);

        applySugar({
          serializedComponents,
          componentInfoObjects,
          isAttributeComponent: true,
        });

        if (compositeCreatesNewNamespace) {
          // modify targets to go back one namespace
          for (let child of newAttributes[propName].component.children) {
            if (child.componentType === "copy") {
              let target = child.doenetAttributes.target;
              if (/[a-zA-Z_]/.test(target[0])) {
                child.doenetAttributes.target = "../" + target;
              }
            }
          }
        }
      }
    } else if (newClass.acceptAnyAttribute) {
      newAttributes[attrName] = JSON.parse(
        JSON.stringify(attributes[attrName]),
      );
    }
  }

  return newAttributes;
}

export async function verifyReplacementsMatchSpecifiedType({
  component,
  replacements,
  replacementChanges,
  assignNames,
  workspace = {},
  componentInfoObjects,
  compositeAttributesObj,
  components,
  publicCaseInsensitiveAliasSubstitutions,
}) {
  if (
    !component.attributes.createComponentOfType?.primitive &&
    !component.sharedParameters.compositesMustHaveAReplacement
  ) {
    return { replacements, replacementChanges };
  }

  let replacementsToWithhold = component.replacementsToWithhold;
  let replacementTypes;

  if (!replacementChanges) {
    // if have a template, filter out blank strings
    if (
      componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: component.componentType,
        baseComponentType: "template",
      })
    ) {
      replacements = replacements.filter(
        (x) => x.componentType || x.trim().length > 0,
      );
    }

    replacementTypes = replacements.map((x) => x.componentType);

    if (
      replacementTypes.length === 1 &&
      replacementTypes[0] === "externalContent"
    ) {
      // since looking for a particular componentType, filter out blank strings
      replacementTypes = replacements[0].children
        .filter((x) => x.componentType || x.trim().length > 0)
        .map((x) => x.componentType);
    }
  } else {
    replacementTypes = component.replacements.map((x) => x.componentType);

    // apply any replacement changes to replacementTypes and replacementsToWithhold
    for (let change of replacementChanges) {
      if (change.changeType === "add") {
        if (change.replacementsToWithhold !== undefined) {
          replacementsToWithhold = change.replacementsToWithhold;
        }

        if (!change.changeTopLevelReplacements) {
          continue;
        }

        if (change.serializedReplacements) {
          let numberToDelete = change.numberReplacementsToReplace;
          if (!(numberToDelete > 0)) {
            numberToDelete = 0;
          }

          let firstIndex = change.firstReplacementInd;

          let newTypes = change.serializedReplacements.map(
            (x) => x.componentType,
          );

          replacementTypes.splice(firstIndex, numberToDelete, ...newTypes);
        }
      } else if (change.changeType === "delete") {
        if (change.replacementsToWithhold !== undefined) {
          replacementsToWithhold = change.replacementsToWithhold;
        }

        if (change.changeTopLevelReplacements) {
          let firstIndex = change.firstReplacementInd;
          let numberToDelete = change.numberReplacementsToDelete;
          replacementTypes.splice(firstIndex, numberToDelete);
        }
      } else if (change.changeType === "changeReplacementsToWithhold") {
        if (change.replacementsToWithhold !== undefined) {
          replacementsToWithhold = change.replacementsToWithhold;
        }
      }
    }
  }

  if (replacementsToWithhold > 0) {
    replacementTypes = replacementTypes.slice(
      0,
      replacementTypes.length - replacementsToWithhold,
    );
  }

  if (
    !component.attributes.createComponentOfType?.primitive &&
    component.sharedParameters.compositesMustHaveAReplacement &&
    replacementTypes.length > 0
  ) {
    // no changes since only reason we got this far was that
    // composites must have a replacement
    // and we have at least one replacement
    return { replacements, replacementChanges };
  }

  let requiredComponentType =
    component.attributes.createComponentOfType?.primitive;

  let requiredLength = await component.stateValues.numComponentsSpecified;

  if (!requiredComponentType) {
    // must have be here due to composites needing a replacement
    requiredComponentType =
      component.sharedParameters.compositesDefaultReplacementType;
    if (!requiredComponentType) {
      throw Error(
        `A component class specified descendantCompositesMustHaveAReplacement but didn't specify descendantCompositesDefaultReplacementType`,
      );
    }
    requiredLength = 1;
  }

  requiredComponentType =
    componentInfoObjects.componentTypeLowerCaseMapping[
      requiredComponentType.toLowerCase()
    ];

  if (
    replacementTypes.length !== requiredLength ||
    !replacementTypes.every((x) => x === requiredComponentType)
  ) {
    // console.warn(`Replacements from ${component.componentType} ${component.componentName} do not match the specified createComponentOfType and numComponents`);

    // if only replacement is a template
    // then give the template the createComponentOfType and numComponentsSpecified
    if (
      replacements?.length === 1 &&
      componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: replacements[0].componentType,
        baseComponentType: "template",
      })
    ) {
      if (!replacements[0].attributes) {
        replacements[0].attributes = {};
      }
      replacements[0].attributes.createComponentOfType = {
        primitive: requiredComponentType,
      };
      replacements[0].attributes.numComponents = { primitive: requiredLength };
      return { replacements, replacementChanges };
    }

    // if the only discrepancy is the components are the wrong type,
    // with number of sources matching the number of components
    // then wrap each replacement with a blank component we are creating,
    // i.e., add each current replacement as the child of a new component

    let wrapExistingReplacements =
      replacementTypes.length === requiredLength &&
      !(replacementsToWithhold > 0) &&
      workspace.sourceNames?.length === requiredLength;

    // let uniqueIdentifiersUsed;
    let originalReplacements;

    if (wrapExistingReplacements && replacementChanges) {
      // if we have replacement changes, we can wrap only if we are replacing all components
      // in a single add
      if (
        replacementChanges.length === 1 &&
        replacementChanges[0].numberReplacementsToReplace === requiredLength
      ) {
        originalReplacements = replacementChanges[0].serializedReplacements;
      } else {
        wrapExistingReplacements = false;
      }
    }

    if (wrapExistingReplacements) {
      if (!originalReplacements) {
        originalReplacements = replacements;
      }
    } else {
      // since clearing out all replacements, reset all workspace variables
      workspace.numReplacementsBySource = [];
      workspace.numNonStringReplacementsBySource = [];
      workspace.propVariablesCopiedBySource = [];
      workspace.sourceNames = [];
      workspace.uniqueIdentifiersUsedBySource = {};

      workspace.uniqueIdentifiersUsedBySource[0] = [];
      // uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[0] = [];
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    replacements = [];
    for (let i = 0; i < requiredLength; i++) {
      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: requiredComponentType,
        componentInfoObjects,
        compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace,
      });

      let uniqueIdentifierBase = requiredComponentType + "|empty" + i;
      let uniqueIdentifier = getUniqueIdentifierFromBase(
        uniqueIdentifierBase,
        workspace.uniqueIdentifiersUsedBySource[0],
      );
      replacements.push({
        componentType: requiredComponentType,
        attributes: attributesFromComposite,
        uniqueIdentifier,
      });
    }

    // If we require a single replacement but had none,
    // then attempt to link the empty replacement to a state variable
    // from the target (by adding a downstreamDependencies to the replacement).
    // The most relevant scenario is where we are trying to copy
    // an array state variable or an array entry state variable
    // that currently is empty, but want the ability to
    // set the future value of this state variable (and make it non-empty)
    // via the copy we are now creating.
    // Since we don't see a use case for non-arrays,
    // this is only implemented for arrays
    if (replacementTypes.length === 0 && requiredLength === 1) {
      let targetInactive = await component.stateValues.targetInactive;

      let propName = (
        await component.stateValues.effectivePropNameBySource
      )?.[0];

      if (propName && !targetInactive) {
        let replacementSources = await component.stateValues
          .replacementSourceIdentities;

        if (replacementSources === undefined) {
          // check if based on extract
          replacementSources = await component.stateValues.sourceComponents;
        }

        let replacementSource = replacementSources[0];

        let target = components[replacementSource.componentName];

        let propVariable = publicCaseInsensitiveAliasSubstitutions({
          stateVariables: [propName],
          componentClass: target.constructor,
        })[0];

        let stateVarObj = target.state[propVariable];
        if (stateVarObj?.isArray || stateVarObj?.isArrayEntry) {
          let arrayStateVarObj, arrayKeys;
          if (stateVarObj.isArray) {
            arrayStateVarObj = stateVarObj;
            let arraySize = await stateVarObj.arraySize;
            arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
          } else {
            arrayStateVarObj = target.state[stateVarObj.arrayStateVariable];
            // use getArrayKeysFromVarName without specifying arraySize
            // so that get keys for the entry that might occur
            // if the array size were increased
            arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
              arrayEntryPrefix: stateVarObj.entryPrefix,
              varEnding: stateVarObj.varEnding,
              numDimensions: arrayStateVarObj.numDimensions,
            });
          }

          // want the prop variable corresponding to just the first entry
          // of the array or the array entry
          propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(
            arrayKeys[0] ||
              Array(arrayStateVarObj.numDimensions).fill("0").join(","),
          );
        } else {
          // Since we don't currently see a use case for non-arrays,
          // we are setting stateVarObj to undefined
          // so that dependencies are not added
          stateVarObj = undefined;
        }

        if (stateVarObj) {
          replacements[0].downstreamDependencies = {
            [replacementSource.componentName]: [
              {
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable,
                additionalStateVariableShadowing:
                  stateVarObj.shadowingInstructions
                    .addStateVariablesShadowingStateVariables,
              },
            ],
          };
        }
      }
    }

    if (wrapExistingReplacements) {
      for (let [ind, repl] of replacements.entries()) {
        repl.children = [originalReplacements[ind]];
      }
    }

    let processResult = processAssignNames({
      assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    replacements = processResult.serializedComponents;

    if (!wrapExistingReplacements) {
      workspace.numReplacementsBySource.push(replacements.length);
      workspace.numNonStringReplacementsBySource.push(
        replacements.filter((x) => typeof x !== "string").length,
      );
    }

    if (replacementChanges) {
      replacementChanges = [];
      if (component.replacementsToWithhold > 0) {
        replacementChanges.push({
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: 0,
        });
      }

      let numberReplacementsToReplace = 0;
      if (component.replacements) {
        numberReplacementsToReplace = component.replacements.length;
      }

      replacementChanges.push({
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace,
        serializedReplacements: replacements,
      });
    }
  }

  return { replacements, replacementChanges };
}
