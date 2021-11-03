import { getUniqueIdentifierFromBase } from "./naming";
import { applyMacros, componentFromAttribute } from "./serializedStateProcessing";

export function postProcessCopy({ serializedComponents, componentName,
  addShadowDependencies = true, uniqueIdentifiersUsed = [], identifierPrefix = "",
  unlinkExternalCopies = false, copiesByFullTName = {}, componentNamesFound = [], assignNamesFound = [], activeAliases = [],
  init = true
}) {

  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - add unique identifiers

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

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
      let fullTName = component.doenetAttributes.fullTName;
      if (!fullTName) {
        if (!component.attributes.uri) {
          throw Error('we need to create a fullTName here, then.')
        }
      } else {
        if (activeAliases.includes(component.doenetAttributes.tName)) {
          // TODO: is the this right thing to do?
          // Not clear if following the same rules for when a match would override an alias
          // Setting fullTName to a relative name presumably prevents the fullTName
          // from ever matching anything.  Is that what we want?
          component.doenetAttributes.fullTName = component.doenetAttributes.tName;
        } else {
          // don't create if matches an alias
          if (copiesByFullTName[fullTName] === undefined) {
            copiesByFullTName[fullTName] = [];
          }
          copiesByFullTName[fullTName].push(component);
        }
      }

    }

    component.uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);
  }


  // recurse after processing all components
  // so that first gather all active aliases

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

    postProcessCopy({
      serializedComponents: component.children,
      componentName,
      addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
      unlinkExternalCopies, copiesByFullTName, componentNamesFound, assignNamesFound,
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
            unlinkExternalCopies, copiesByFullTName, componentNamesFound, assignNamesFound,
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
        unlinkExternalCopies, copiesByFullTName, componentNamesFound, assignNamesFound,
        activeAliases: [...activeAliases],  // don't add values from children
        init: false
      });
    }

  }

  if (init && unlinkExternalCopies) {
    for (let fullTName in copiesByFullTName) {
      if (!componentNamesFound.includes(fullTName)) {
        let foundMatchViaAssignNames = false;
        for (let cName of assignNamesFound) {
          let namespace = cName + "/";
          let nSpaceLen = namespace.length;
          if (fullTName.substring(0, nSpaceLen) === namespace) {
            foundMatchViaAssignNames = true;
            break;
          }
        }
        if (!foundMatchViaAssignNames) {
          for (let copyComponent of copiesByFullTName[fullTName]) {
            if (!copyComponent.attributes) {
              copyComponent.attributes = {};
            }
            copyComponent.attributes.link = { primitive: false }
            copyComponent.doenetAttributes.tName = copyComponent.doenetAttributes.fullTName;
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

      if (newAttributes[propName].children) {
        newAttributes[propName].children = applyMacros(newAttributes[propName].children, componentInfoObjects);
        if (compositeCreatesNewNamespace) {
          // modify tNames to go back one namespace
          for (let child of newAttributes[propName].children) {
            if (child.componentType === "copy") {
              let tName = child.doenetAttributes.tName;
              if (/[a-zA-Z_]/.test(tName[0])) {
                child.doenetAttributes.tName = "../" + tName;
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
