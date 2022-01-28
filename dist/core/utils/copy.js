import { getUniqueIdentifierFromBase } from "./naming.js";
import { applyMacros, applySugar, componentFromAttribute, removeBlankStringChildren } from "./serializedStateProcessing.js";

export function postProcessCopy({ serializedComponents, componentName,
  addShadowDependencies = true, uniqueIdentifiersUsed = [], identifierPrefix = "",
  unlinkExternalCopies = false, copiesByTargetComponentName = {}, componentNamesFound = [], assignNamesFound = [], activeAliases = [],
  init = true
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
        if (component.originalDoenetAttributes && component.originalDoenetAttributes.assignNames) {
          let originalNamespace;
          if (component.attributes.newNamespace && component.attributes.newNamespace.primitive) {
            originalNamespace = component.originalName;
          } else {
            let lastSlash = component.originalName.lastIndexOf('/');
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
      uniqueIdentifierBase = identifierPrefix + component.originalName + "|shadow";

      if (addShadowDependencies && !component.originalNameFromSerializedComponent) {
        let downDep = {
          [component.originalName]: [{
            dependencyType: "referenceShadow",
            compositeName: componentName,
          }]
        };
        if (init) {
          downDep[component.originalName][0].firstLevelReplacement = true;
        }
        if (component.state) {
          let stateVariables = Object.keys(component.state);
          downDep[component.originalName].downstreamStateVariables = stateVariables;
          downDep[component.originalName].upstreamStateVariables = stateVariables;
        }

        // create downstream dependency
        component.downstreamDependencies = downDep;
      }


    } else {
      uniqueIdentifierBase = identifierPrefix + component.componentType + "|shadowUnnamed";
    }

    if (component.componentType === "copy" && unlinkExternalCopies) {
      let targetComponentName = component.doenetAttributes.targetComponentName;
      if (!targetComponentName) {
        if (!component.attributes.uri) {
          throw Error('we need to create a targetComponentName here, then.')
        }
      } else {
        if (activeAliases.includes(component.doenetAttributes.target)) {
          // TODO: is the this right thing to do?
          // Not clear if following the same rules for when a match would override an alias
          // Setting targetComponentName to a relative name presumably prevents the targetComponentName
          // from ever matching anything.  Is that what we want?
          component.doenetAttributes.targetComponentName = component.doenetAttributes.target;
        } else {
          // don't create if matches an alias
          if (copiesByTargetComponentName[targetComponentName] === undefined) {
            copiesByTargetComponentName[targetComponentName] = [];
          }
          copiesByTargetComponentName[targetComponentName].push(component);
        }
      }

    }

    component.uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);
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
      addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
      unlinkExternalCopies, copiesByTargetComponentName, componentNamesFound, assignNamesFound,
      activeAliases: [...activeAliases],  // don't add values from children
      init: false
    });

    for (let attrName in component.attributes) {
      let attribute = component.attributes[attrName];
      if (attribute.component) {
        attribute.component =
          postProcessCopy({
            serializedComponents: [attribute.component],
            componentName,
            addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
            unlinkExternalCopies, copiesByTargetComponentName, componentNamesFound, assignNamesFound,
            activeAliases: [...activeAliases],  // don't add values from children
            init: false,
          })[0];
      }
    }

    if (component.replacements) {
      postProcessCopy({
        serializedComponents: component.replacements,
        componentName,
        addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
        unlinkExternalCopies, copiesByTargetComponentName, componentNamesFound, assignNamesFound,
        activeAliases: [...activeAliases],  // don't add values from children
        init: false
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
          for (let copyComponent of copiesByTargetComponentName[targetComponentName]) {
            if (!copyComponent.attributes) {
              copyComponent.attributes = {};
            }
            copyComponent.attributes.link = { primitive: false }
            copyComponent.doenetAttributes.target = copyComponent.doenetAttributes.targetComponentName;
          }
        }
      }
    }
  }



  return serializedComponents;

}

export function convertAttributesForComponentType({
  attributes, componentType,
  componentInfoObjects, compositeAttributesObj = {},
  compositeCreatesNewNamespace,
  flags,
}) {


  let newClass = componentInfoObjects.allComponentClasses[componentType];
  let newAttributesObj = newClass.createAttributesObject({ flags });
  let attributeLowerCaseMapping = {};
  for (let propName in newAttributesObj) {
    attributeLowerCaseMapping[propName.toLowerCase()] = propName;
  }

  let newAttributes = {};

  for (let attrName in attributes) {
    if (attrName in compositeAttributesObj && !compositeAttributesObj[attrName].leaveRaw) {
      // skip any attributes in the composite itself
      // unless specifically marked to not be processed for the composite
      continue;
    }

    let propName = attributeLowerCaseMapping[attrName.toLowerCase()];
    let attrObj = newAttributesObj[propName];
    if (attrObj) {
      if (propName in newAttributes) {
        throw Error(`Cannot repeat prop ${propName}`)
      }

      newAttributes[propName] = componentFromAttribute({
        attrObj,
        value: JSON.parse(JSON.stringify(attributes[attrName])),
        componentInfoObjects
      });

      if (newAttributes[propName].component?.children) {

        let serializedComponents = [newAttributes[propName].component];

        applyMacros(serializedComponents, componentInfoObjects);

        removeBlankStringChildren(serializedComponents, componentInfoObjects)

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
      newAttributes[attrName] = JSON.parse(JSON.stringify(attributes[attrName]));
    }

  }

  return newAttributes;

}
