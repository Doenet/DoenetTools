import { getUniqueIdentifierFromBase } from "./naming";
import { applyMacros, componentFromAttribute } from "./serializedStateProcessing";

export function postProcessCopy({ serializedComponents, componentName,
  addShadowDependencies = true, uniqueIdentifiersUsed = [], identifierPrefix = "",
  addDontLinkToCopies = false,
  init = true
}) {

  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - add unique identifiers

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

    let uniqueIdentifierBase;
    if (component.originalName) {

      // preserializedNamesFound[component.originalName] = component;
      uniqueIdentifierBase = identifierPrefix + component.originalName + "|shadow";

      if (addShadowDependencies && !component.originalNameFromSerializedComponent) {
        let downDep = {
          [component.originalName]: [{
            dependencyType: "referenceShadow",
            compositeName: componentName,
          }]
        };
        if(init) {
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

      if(component.componentType === "copy" && addDontLinkToCopies) {
        if(!component.attributes) {
          component.attributes = {};
        }
        component.attributes.link = false;
      }

    } else {
      uniqueIdentifierBase = identifierPrefix + component.componentType + "|shadowUnnamed";
    }

    component.uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

    // recursion
    postProcessCopy({
      serializedComponents: component.children,
      componentName,
      addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
      addDontLinkToCopies,
      init: false
    });

    for (let attr in component.attributes) {
      let attrComp = component.attributes[attr];
      if (attrComp.componentType) {
        component.attributes[attr] =
          postProcessCopy({
            serializedComponents: [attrComp],
            componentName,
            addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
            addDontLinkToCopies,
            init: false,
          })[0];
      }
    }

    if (component.replacements) {
      postProcessCopy({
        serializedComponents: component.replacements,
        componentName,
        addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
        addDontLinkToCopies,
        init: false
      });
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

  for (let attr in attributes) {
    if (attr in compositeAttributesObj && !compositeAttributesObj[attr].leaveRaw) {
      // skip any attributes in the composite itself
      // unless specifically marked to not be processed for the composite
      continue;
    }

    let propName = attributeLowerCaseMapping[attr.toLowerCase()];
    let attrObj = newAttributesObj[propName];
    if (attrObj) {
      if (propName in newAttributes) {
        throw Error(`Cannot repeat prop ${propName}`)
      }

      newAttributes[propName] = componentFromAttribute({
        attrObj,
        value: attributes[attr],
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
    }

  }

  return newAttributes;

}
