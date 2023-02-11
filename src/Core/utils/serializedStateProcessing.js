import me from 'math-expressions';
import { createUniqueName } from './naming';
import { flattenDeep } from './array';
import { deepClone } from './deepFunctions';
import { breakEmbeddedStringByCommas } from '../components/commonsugar/breakstrings';
import { parseAndCompile } from '../../Parser/parser';
import subsets from './subset-of-reals';
import { retrieveTextFileForCid } from './retrieveTextFile';

export async function expandDoenetMLsToFullSerializedComponents({
  cids, doenetMLs,
  componentInfoObjects,
}) {

  let arrayOfSerializedComponents = [];
  let cidComponents = {};

  for (let doenetML of doenetMLs) {

    let serializedComponents = parseAndCompile(doenetML);

    serializedComponents = cleanIfHaveJustDocument(serializedComponents);

    substituteDeprecations(serializedComponents);

    temporarilyRenameSourceBackToTarget(serializedComponents);

    correctComponentTypeCapitalization(serializedComponents, componentInfoObjects.componentTypeLowerCaseMapping);

    copyTargetOrFromURIAttributeCreatesCopyComponent(serializedComponents, componentInfoObjects.isCompositeComponent);

    createAttributesFromProps(serializedComponents, componentInfoObjects);

    breakUpTargetIntoPropsAndIndices(serializedComponents, componentInfoObjects)

    applyMacros(serializedComponents, componentInfoObjects);

    // remove blank string children after applying macros,
    // as applying macros could create additional blank string children
    removeBlankStringChildren(serializedComponents, componentInfoObjects)

    decodeXMLEntities(serializedComponents);

    applySugar({ serializedComponents, componentInfoObjects });

    arrayOfSerializedComponents.push(serializedComponents);

    let newContentComponents = findContentCopies({ serializedComponents });

    for (let cid in newContentComponents.cidComponents) {
      if (cidComponents[cid] === undefined) {
        cidComponents[cid] = []
      }
      cidComponents[cid].push(...newContentComponents.cidComponents[cid])
    }
  }

  let cidList = Object.keys(cidComponents);
  if (cidList.length > 0) {
    // found copies with cids
    // so look up those cids
    // convert to doenetMLs, and recurse on those doenetMLs

    let { newDoenetMLs, newCids } = await cidsToDoenetMLs(cidList);

    // check to see if got the cids requested
    for (let [ind, cid] of cidList.entries()) {
      if (newCids[ind] && newCids[ind].substring(0, cid.length) !== cid) {
        return Promise.reject(new Error(`Requested cid ${cid} but got back ${newCids[ind]}!`));
      }
    }

    let expectedN = cidList.length;
    for (let ind = 0; ind < expectedN; ind++) {
      let cid = newCids[ind];
      if (!cid) {
        // wasn't able to retrieve content
        console.warn(`Unable to retrieve content with cid = ${cidList[ind]}`)
        newDoenetMLs[ind] = "";
      }
    }

    // recurse to additional doenetMLs
    let { fullSerializedComponents } = await expandDoenetMLsToFullSerializedComponents({
      doenetMLs: newDoenetMLs,
      cids: newCids,
      componentInfoObjects,
    });

    for (let [ind, cid] of cidList.entries()) {
      let serializedComponentsForCid = fullSerializedComponents[ind];

      for (let originalCopyWithUri of cidComponents[cid]) {
        if (originalCopyWithUri.children === undefined) {
          originalCopyWithUri.children = [];
        }

        if (!originalCopyWithUri.doenetAttributes) {
          originalCopyWithUri.doenetAttributes = {};
        }

        originalCopyWithUri.doenetAttributes.copiedURI = true;

        let originalChildren = JSON.parse(JSON.stringify(serializedComponentsForCid));

        // remove blank string children
        let nonBlankStringChildren = originalChildren.filter(x => typeof x !== "string" || x.trim());

        let haveSingleComponent = nonBlankStringChildren.length === 1 && typeof nonBlankStringChildren[0] === "object";

        let fromCopyFromURI = originalCopyWithUri.doenetAttributes?.fromCopyFromURI;

        if (fromCopyFromURI || haveSingleComponent) {

          if (fromCopyFromURI && !haveSingleComponent) {
            console.warn('ignoring copyFromURI as it was not a single component')
          } else {

            let comp = nonBlankStringChildren[0];


            if (!comp.attributes) {
              comp.attributes = {};
            }

            if (!originalCopyWithUri.doenetAttributes) {
              originalCopyWithUri.doenetAttributes = {};
            }

            originalCopyWithUri.doenetAttributes.keptNewNamespaceOfLastChild = Boolean(comp.attributes.newNamespace?.primitive);

            comp.attributes.newNamespace = { primitive: true };

            originalCopyWithUri.children = [comp, ...originalCopyWithUri.children];

            // Note: name of last child will get changed by assignName (or be given unique name if no assignNames)
            // however, when first creating component names, need to keep its original name in case nay of its children reference it
            // When assignNames, such references will be converted to newly assigned names
            originalCopyWithUri.doenetAttributes.nameFirstChildIndependently = true;

          }


        } else {

          let extContent = {
            componentType: "externalContent",
            children: JSON.parse(JSON.stringify(serializedComponentsForCid)),
            attributes: { newNamespace: { primitive: true } },
            doenetAttributes: { createUniqueName: true }
          };

          originalCopyWithUri.children = [extContent, ...originalCopyWithUri.children];

        }
      }
    }

  }


  return {
    cids,
    fullSerializedComponents: arrayOfSerializedComponents,
  };

}

function cidsToDoenetMLs(cids) {
  let promises = [];
  let newCids = cids;

  for (let cid of cids) {
    promises.push(retrieveTextFileForCid(cid, "doenet"));
  }

  return Promise.all(promises).then((newDoenetMLs) => {

    // console.log({ newDoenetMLs, newCids })
    return Promise.resolve({ newDoenetMLs, newCids });

  }).catch(err => {

    let message;
    if (newCids.length === 1) {
      message = `Could not retrieve cid ${newCids[0]}`
    } else {
      message = `Could not retrieve cids ${newCids.join(',')}`
    }

    message += ": " + err.message;

    console.error(message)

    return Promise.reject(new Error(message));

  })

}

export function removeBlankStringChildren(serializedComponents, componentInfoObjects) {

  for (let component of serializedComponents) {
    if (component.children) {
      let componentClass = componentInfoObjects.allComponentClasses[component.componentType];
      if (componentClass && !componentClass.includeBlankStringChildren) {
        component.children = component.children.filter(
          x => typeof x !== "string" || x.trim() !== ""
        )
      }

      removeBlankStringChildren(component.children, componentInfoObjects)

    }

    // TODO: do we also need to remove blank string components
    // from childrenForComponent of an attribute that is not yet a component?
    for (let attrName in component.attributes) {
      let comp = component.attributes[attrName].component;
      if (comp && comp.children) {
        removeBlankStringChildren([comp], componentInfoObjects)
      }
    }
  }

}

function findContentCopies({ serializedComponents }) {

  let cidComponents = {};
  for (let serializedComponent of serializedComponents) {
    if (serializedComponent.componentType === "copy") {
      if (serializedComponent.attributes && serializedComponent.attributes.uri) {
        let uri = serializedComponent.attributes.uri.primitive;

        if (uri && uri.substring(0, 7).toLowerCase() === "doenet:") {

          let result = uri.match(/[:&]cid=([^&]+)/i);
          if (result) {
            let cid = result[1];
            if (cidComponents[cid] === undefined) {
              cidComponents[cid] = [];
            }
            cidComponents[cid].push(serializedComponent);
          }

        }
      }
    } else {
      if (serializedComponent.children !== undefined) {
        let results = findContentCopies({ serializedComponents: serializedComponent.children })

        // append results on to cidComponents
        for (let cid in results.cidComponents) {
          if (cidComponents[cid] === undefined) {
            cidComponents[cid] = [];
          }
          cidComponents[cid].push(...results.cidComponents[cid]);
        }
      }
    }
  }
  return { cidComponents };
}

export function addDocumentIfItsMissing(serializedComponents) {

  if (serializedComponents.length !== 1 || serializedComponents[0].componentType !== 'document') {
    let components = serializedComponents.splice(0);
    serializedComponents.push({ componentType: 'document', children: components });
  }
}

function substituteDeprecations(serializedComponents) {

  // Note: use lower case for keys
  let deprecatedPropertySubstitutions = {
    tname: "target",
    triggerwithtnames: "triggerWith",
    updatewithtname: "updateWith",
    paginatortname: "paginator",
    randomizeorder: "shuffleOrder",
    copytarget: "copySource",
    triggerwithtargets: "triggerWith",
    triggerwhentargetsclicked: "triggerWhenObjectsClicked",
    fortarget: "forObject",
    targetattributestoignore: "sourceAttributesToIgnore",
    targetattributestoignorerecursively: "sourceAttributesToIgnoreRecursively",
    targetsareresponses: "sourcesAreResponses",
    updatewithtarget: "updateWith",
    targetsarefunctionsymbols: "sourcesAreFunctionSymbols",
    selectforvariantnames: "selectForVariants",
  }

  // Note: use lower case for keys
  let deprecatedPropertySubstitutionsComponentSpecific = {
    copy: {
      target: "source",
      tname: "source",
    },
    collect: {
      target: "source",
      tname: "source",
    },
    summarystatistics: {
      target: "source",
    }
  }

  for (let component of serializedComponents) {
    if (typeof component !== "object") {
      continue;
    }

    if (component.props) {
      let cType = component.componentType;
      let typeSpecificDeps = deprecatedPropertySubstitutionsComponentSpecific[cType.toLowerCase()];
      if (!typeSpecificDeps) {
        typeSpecificDeps = {};
      }
      let retry = true;
      while (retry) {
        retry = false;
        for (let prop in component.props) {
          let propLower = prop.toLowerCase();
          if (propLower in typeSpecificDeps) {
            let newProp = typeSpecificDeps[propLower];

            console.warn(`Attribute ${prop} of component type ${cType} is deprecated.  Use ${newProp} instead.`)

            component.props[newProp] = component.props[prop];
            delete component.props[prop];

            // since modified object over which are looping
            // break out of loop and start over
            retry = true;
            break;
          } else if (propLower in deprecatedPropertySubstitutions) {
            let newProp = deprecatedPropertySubstitutions[propLower];

            console.warn(`Attribute ${prop} is deprecated.  Use ${newProp} instead.`)

            component.props[newProp] = component.props[prop];
            delete component.props[prop];

            // since modified object over which are looping
            // break out of loop and start over
            retry = true;
            break;

          }
        }
      }
    }

    if (component.children) {
      substituteDeprecations(component.children);
    }
  }


}


function temporarilyRenameSourceBackToTarget(serializedComponents) {

  // Note: use lower case for keys
  let backwardsDeprecatedPropertySubstitutions = {
    copysource: "copyTarget"
  }

  // Note: use lower case for keys
  let backwardsDeprecatedPropertySubstitutionsComponentSpecific = {
    copy: {
      source: "target",
    },
    collect: {
      source: "target",
    }
  }

  for (let component of serializedComponents) {
    if (typeof component !== "object") {
      continue;
    }

    if (component.props) {
      let cType = component.componentType;
      let typeSpecificDeps = backwardsDeprecatedPropertySubstitutionsComponentSpecific[cType.toLowerCase()];
      if (!typeSpecificDeps) {
        typeSpecificDeps = {};
      }
      let retry = true;
      while (retry) {
        retry = false;
        for (let prop in component.props) {
          let propLower = prop.toLowerCase();
          if (propLower in typeSpecificDeps) {
            let newProp = typeSpecificDeps[propLower];

            component.props[newProp] = component.props[prop];
            delete component.props[prop];

            // since modified object over which are looping
            // break out of loop and start over
            retry = true;
            break;
          } else if (propLower in backwardsDeprecatedPropertySubstitutions) {
            let newProp = backwardsDeprecatedPropertySubstitutions[propLower];

            component.props[newProp] = component.props[prop];
            delete component.props[prop];

            // since modified object over which are looping
            // break out of loop and start over
            retry = true;
            break;

          }
        }
      }
    }

    if (component.children) {
      temporarilyRenameSourceBackToTarget(component.children);
    }
  }


}

function cleanIfHaveJustDocument(serializedComponents) {
  let componentsWithoutBlankStrings = serializedComponents.filter(
    x => typeof x !== "string" || x.trim() !== ""
  )

  if (componentsWithoutBlankStrings.length === 1 && componentsWithoutBlankStrings[0].componentType === 'document') {
    return componentsWithoutBlankStrings;
  } else {
    return serializedComponents
  }
}

function correctComponentTypeCapitalization(serializedComponents, componentTypeLowerCaseMapping) {

  //special case for macros before application
  // componentTypeLowerCaseMapping["macro"] = "macro";
  for (let component of serializedComponents) {
    if (typeof component !== "object") {
      continue;
    }

    let componentTypeFixed = componentTypeLowerCaseMapping[component.componentType.toLowerCase()];

    if (componentTypeFixed) {
      component.componentType = componentTypeFixed;
    } else {
      throw Error(`Invalid component type${indexRangeString(component)}: ${component.componentType}`);
    }

    if (component.children) {
      correctComponentTypeCapitalization(component.children, componentTypeLowerCaseMapping);
    }

  }

}

function copyTargetOrFromURIAttributeCreatesCopyComponent(serializedComponents, isCompositeComponent) {
  for (let component of serializedComponents) {
    if (component.props) {
      let foundCopyTarget = false;
      let foundCopyFromURI = false;
      let foundAssignNames = false;
      let originalType = component.componentType;
      let haveComposite = isCompositeComponent({
        componentType: originalType,
        includeNonStandard: false
      });
      let haveAnyComposite = isCompositeComponent({
        componentType: originalType,
        includeNonStandard: true
      });
      for (let prop of Object.keys(component.props)) {
        let lowerCaseProp = prop.toLowerCase();
        if (lowerCaseProp === "copytarget") {
          if (foundCopyTarget) {
            throw Error(`Cannot repeat attribute ${prop}.  Found in component type ${originalType}${indexRangeString(component)}`)
          } else if (foundCopyFromURI) {
            throw Error(`Cannot combine copyTarget and copyFromURI attribiutes.  For in component of type ${originalType}${indexRangeString(component)}`)
          } else if (foundAssignNames) {
            if (haveAnyComposite) {
              throw Error(`A component of type ${originalType} cannot have both assignNames and copyTarget.  Found${indexRangeString(component)}.`)
            } else {
              throw Error(`Invalid attribute assignNames for component of type ${originalType}${indexRangeString(component)}`)
            }
          }
          foundCopyTarget = true;
          if (!component.doenetAttributes) {
            component.doenetAttributes = {};
          }
          if (!haveComposite) {
            component.props.createComponentOfType = originalType;
            component.doenetAttributes.nameBecomesAssignNames = true;
          }
          component.componentType = "copy";
          component.props.target = component.props[prop];
          if (typeof component.props.target !== "string") {
            throw Error(`Must specify value for copyTarget.  Found in component of type ${originalType}${indexRangeString(component)}`)
          }
          delete component.props[prop];

          component.doenetAttributes.fromCopyTarget = true;
          component.doenetAttributes.createNameFromComponentType = originalType;
          component.props.assignNamesSkip = "1";

        } else if (lowerCaseProp === "copyfromuri") {
          if (foundCopyFromURI) {
            throw Error(`Cannot repeat attribute ${prop}.  Found in component type ${originalType}${indexRangeString(component)}`)
          } else if (foundCopyTarget) {
            throw Error(`Cannot combine copyTarget and copyFromURI attribiutes.  For in component of type ${originalType}${indexRangeString(component)}`)
          } else if (foundAssignNames) {
            if (haveAnyComposite) {
              throw Error(`A component of type ${originalType} cannot have both assignNames and copyFromURI.  Found${indexRangeString(component)}.`)
            } else {
              throw Error(`Invalid attribute assignNames for component of type ${originalType}${indexRangeString(component)}`)
            }
          }
          foundCopyFromURI = true;
          if (!component.doenetAttributes) {
            component.doenetAttributes = {};
          }
          if (!haveComposite) {
            component.props.createComponentOfType = originalType;
            component.doenetAttributes.nameBecomesAssignNames = true;
          }
          component.componentType = "copy";
          component.props.uri = component.props[prop];
          if (typeof component.props.uri !== "string") {
            throw Error(`Must specify value for copyFromURI.  Found in component of type ${originalType}${indexRangeString(component)}`)
          }
          delete component.props[prop];
          component.doenetAttributes.fromCopyFromURI = true;
          component.doenetAttributes.createNameFromComponentType = originalType;
          component.props.assignNamesSkip = "1";

        } else if (lowerCaseProp === "assignnames" && !haveComposite) {
          if (foundCopyTarget || foundCopyFromURI) {
            if (haveAnyComposite) {
              throw Error(`A component of type ${originalType} cannot have both assignNames and copyTarget.  Found${indexRangeString(component)}.`)
            } else {
              throw Error(`Invalid attribute assignNames for component of type ${originalType}${indexRangeString(component)}`)
            }
          }
          foundAssignNames = true;
        }
      }

      if (foundCopyTarget) {
        // give error if have prop name "prop"
        // after that rename copyProp to "prop"
        for (let prop of Object.keys(component.props)) {
          let lowerCaseProp = prop.toLowerCase();
          if (lowerCaseProp === "prop") {
            throw Error(`Invalid attribute prop for component of type ${originalType}${indexRangeString(component)}`)
          }
        }
        let foundCopyProp = false;
        for (let prop of Object.keys(component.props)) {
          let lowerCaseProp = prop.toLowerCase();
          if (lowerCaseProp === "copyprop") {
            if (foundCopyProp) {
              throw Error(`Cannot repeat attribute ${prop}.  Found in component type ${originalType}${indexRangeString(component)}`)
            }
            component.props.prop = component.props[prop];
            delete component.props[prop];
            foundCopyProp = true;
          }
        }
      }
    }

    if (component.children) {
      copyTargetOrFromURIAttributeCreatesCopyComponent(component.children, isCompositeComponent);
    }
  }
}

function breakUpTargetIntoPropsAndIndices(serializedComponents, componentInfoObjects, ancestorString = "") {

  for (let [component_ind, component] of serializedComponents.entries()) {

    // Note: do not do this for collect, as this dot notation would be confusing for collect

    if (component.props &&
      ["copy", "updateValue", "animateFromSequence"].includes(component.componentType)
    ) {

      let targetPropName;
      let sourceName;
      let componentIndex;
      let componentAttributes;
      let propArray;
      let subNames;

      let originalSource;

      for (let prop of Object.keys(component.props)) {
        let lowerCaseProp = prop.toLowerCase();
        if (lowerCaseProp === "target") {

          if (targetPropName) {
            throw Error(`Cannot repeat attribute ${prop}.  Found in component type ${component.componentType}${indexRangeString(component)}`)
          }

          targetPropName = prop;
          originalSource = component.props[prop];

          let sourcePiecesResult = buildSourcePieces(originalSource, true)

          if (sourcePiecesResult.success
            && sourcePiecesResult.matchLength === originalSource.length
          ) {

            sourceName = sourcePiecesResult.sourceName;
            componentIndex = sourcePiecesResult.componentIndex;
            componentAttributes = sourcePiecesResult.componentAttributes;
            propArray = sourcePiecesResult.propArray;
            subNames = sourcePiecesResult.subNames;
          }

        }
      }

      if (targetPropName && sourceName) {
        if (componentIndex || componentAttributes || propArray.length > 0) {

          // found an extended target

          if (component.attributes.prop) {
            throw Error(`Cannot combine the prop attribute with an extended source attribute.  Found in component type ${component.componentType}${indexRangeString(component)}`)
          }
          if (component.attributes.propIndex) {
            throw Error(`Cannot combine the propIndex attribute with an extended source attribute.  Found in component type ${component.componentType}${indexRangeString(component)}`)
          }
          if (component.attributes.componentIndex) {
            throw Error(`Cannot combine the componentIndex attribute with an extended source attribute.  Found in component type ${component.componentType}${indexRangeString(component)}`)
          }


          let componentResult = createComponentFromExtendedSource({
            sourceName,
            componentIndex,
            subNames,
            componentAttributes,
            propArray,
            componentInfoObjects
          });

          if (componentResult.success) {
            let newComponent = componentResult.newComponent;

            if (component.componentType === "copy") {

              // assign new componentType, attributes, and doenetAttributes
              // to original component
              delete component.props[targetPropName];
              Object.assign(component.attributes, newComponent.attributes)
              if (!component.doenetAttributes) {
                component.doenetAttributes = {};
              }
              Object.assign(component.doenetAttributes, newComponent.doenetAttributes)
              if (!component.doenetAttributes.createNameFromComponentType) {
                component.doenetAttributes.createNameFromComponentType = component.componentType;
              }
              component.componentType = newComponent.componentType;

              if (propArray.length === 0 &&
                !(component.attributes.prop || component.attributes.propIndex)
              ) {
                component.doenetAttributes.isPlainCopy = true;
              }

              if (newComponent.children) {
                component.children = newComponent.children;
              }
            } else {
              // have updateValue or animateFromSequence
              if (newComponent.componentType === "copy") {
                // if the new component created was a copy
                // then we can just add the attributes to the original component

                // assign new componentType, attributes, and doenetAttributes
                // to original component
                delete component.props[targetPropName];
                Object.assign(component.attributes, newComponent.attributes)
                if (!component.doenetAttributes) {
                  component.doenetAttributes = {};
                }
                Object.assign(component.doenetAttributes, newComponent.doenetAttributes)
              } else {
                // if the new component created was an extract
                // then wrap the extract in a setup and append
                // and modify the updateValue/animateFromSequence to point to the extract

                let longNameId = "fromExtendedSource" + ancestorString + "|" + component_ind;
                let nameForExtract = createUniqueName("extract", longNameId);
                newComponent.doenetAttributes.prescribedName = nameForExtract;
                newComponent.doenetAttributes.createdFromMacro = true;

                let setupComponent = {
                  componentType: "setup",
                  children: [newComponent],
                  doenetAttributes: { createdFromMacro: true }
                }
                serializedComponents.push(setupComponent);

                delete component.props[targetPropName];

                if (!component.doenetAttributes) {
                  component.doenetAttributes = {};
                }
                component.doenetAttributes.target = nameForExtract;
                component.doenetAttributes.allowDoubleUnderscoreTarget = true;

              }

            }
          } else {
            if (component.componentType === "copy") {
              console.warn(`invalid copy source: ${originalSource}`)
            } else {
              console.warn(`invalid target: ${originalSource}`)
            }

          }

        } else {
          // have copy with just a simple target prop that is a targetName
          if (component.componentType === "copy" &&
            !(component.attributes.prop || component.attributes.propIndex)
          ) {
            if (!component.doenetAttributes) {
              component.doenetAttributes = {};
            }
            component.doenetAttributes.isPlainCopy = true;

          }
        }
      }

    }

    if (component.children) {
      breakUpTargetIntoPropsAndIndices(component.children, componentInfoObjects, ancestorString + "|" + component_ind);
    }
  }
}

function createAttributesFromProps(serializedComponents, componentInfoObjects) {
  for (let component of serializedComponents) {
    if (typeof component !== "object") {
      continue;
    }

    let componentClass = componentInfoObjects.allComponentClasses[component.componentType];
    let classAttributes = componentClass.createAttributesObject();

    let attributeLowerCaseMapping = {};

    for (let propName in classAttributes) {
      attributeLowerCaseMapping[propName.toLowerCase()] = propName;
    }

    let attributes = {};

    // if there are any props of json that match attributes for component class
    // create the specified components or primitives

    let originalComponentProps = Object.assign({}, component.props)
    if (component.props) {
      for (let prop in component.props) {
        let propName = attributeLowerCaseMapping[prop.toLowerCase()]
        let attrObj = classAttributes[propName];
        if (attrObj) {

          if (propName in attributes) {
            throw Error(`Cannot repeat attribute ${propName}.  Found in component type ${component.componentType}${indexRangeString(component)}`)
          }

          attributes[propName] = componentFromAttribute({
            attrObj,
            value: component.props[prop],
            originalComponentProps,
            componentInfoObjects,
          });
          delete component.props[prop];
        } else if (!["name", "assignnames", "target"].includes(prop.toLowerCase())) {

          if (componentClass.acceptAnyAttribute) {
            attributes[prop] = componentFromAttribute({
              value: component.props[prop],
              originalComponentProps,
              componentInfoObjects,
            });
            delete component.props[prop];
          } else {
            throw Error(`Invalid attribute ${prop} for component of type ${component.componentType}${indexRangeString(component)}`)
          }

        }
      }
    }


    // if there are any primitive attributes that define a default value
    // but were not specified via props, add them with their default value

    for (let attrName in classAttributes) {
      let attrObj = classAttributes[attrName];

      if (attrObj.createPrimitiveOfType && ("defaultPrimitiveValue" in attrObj) && !(attrName in attributes)) {
        attributes[attrName] = componentFromAttribute({
          attrObj,
          originalComponentProps,
          value: attrObj.defaultPrimitiveValue.toString(),
          componentInfoObjects,
        });
      }
    }

    component.attributes = attributes;

    //recurse on children
    if (component.children !== undefined) {
      createAttributesFromProps(component.children, componentInfoObjects);
    }
  }
}

export function componentFromAttribute({ attrObj, value, originalComponentProps,
  componentInfoObjects
}) {
  if (typeof value !== "object") {
    // typically this would mean value is a string.
    // However, if had an attribute with no value, would get true.
    // Also, when get addAttributeComponentsShadowingStateVariables,
    // it is possible their values are not strings
    value = { rawString: value.toString() }
  } else if (value === null) {
    // could get null from addAttributeComponentsShadowingStateVariables
    value = { rawString: "" }
  }

  if (attrObj && attrObj.createComponentOfType) {
    let newComponent;
    let valueTrimLower = value.rawString.trim().toLowerCase();

    if (valueTrimLower === "true" && attrObj.valueForTrue !== undefined) {
      newComponent = {
        componentType: attrObj.createComponentOfType,
        state: { value: attrObj.valueForTrue }
      };
    } else if (valueTrimLower === "false" && attrObj.valueForFalse !== undefined) {
      newComponent = {
        componentType: attrObj.createComponentOfType,
        state: { value: attrObj.valueForFalse }
      };
    } else if (componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: attrObj.createComponentOfType,
      baseComponentType: "boolean",
    }) && ["true", "false"].includes(valueTrimLower)) {
      newComponent = {
        componentType: attrObj.createComponentOfType,
        state: { value: valueTrimLower === "true" }
      };
    } else {
      let children = value.childrenForComponent;
      if (children) {
        children = JSON.parse(JSON.stringify(children));
      } else {
        children = [value.rawString]
      }
      newComponent = {
        componentType: attrObj.createComponentOfType,
        children
      };

      removeBlankStringChildren([newComponent], componentInfoObjects)

    }

    if (attrObj.attributesForCreatedComponent || attrObj.copyComponentAttributesForCreatedComponent) {
      if (attrObj.attributesForCreatedComponent) {
        newComponent.props = attrObj.attributesForCreatedComponent;
      } else {
        newComponent.props = {};
      }

      if (attrObj.copyComponentAttributesForCreatedComponent) {
        for (let attrName of attrObj.copyComponentAttributesForCreatedComponent) {
          if (originalComponentProps[attrName]) {
            newComponent.props[attrName] = JSON.parse(JSON.stringify(originalComponentProps[attrName]))
          }
        }

      }

      createAttributesFromProps([newComponent], componentInfoObjects)
    }

    let attr = { component: newComponent };
    if (attrObj.ignoreFixed) {
      attr.ignoreFixed = true;
    }
    return attr;
  } else if (attrObj && attrObj.createPrimitiveOfType) {
    let newPrimitive;
    if (attrObj.createPrimitiveOfType === "boolean") {
      let valueTrimLower = value.rawString.trim().toLowerCase();
      newPrimitive = valueTrimLower === "true";
    } else if (attrObj.createPrimitiveOfType === "number") {
      newPrimitive = Number(value.rawString);
    } else if (attrObj.createPrimitiveOfType === "integer") {
      newPrimitive = Math.round(Number(value.rawString));
    } else if (attrObj.createPrimitiveOfType === "stringArray") {
      newPrimitive = value.rawString.trim().split(/\s+/);
    } else if (attrObj.createPrimitiveOfType === "numberArray") {
      newPrimitive = value.rawString.split(/\s+/).map(Number);
    } else {
      // else assume string
      newPrimitive = value.rawString;
    }

    if (attrObj.validationFunction) {
      newPrimitive = attrObj.validationFunction(newPrimitive);
    }
    return { primitive: newPrimitive };
  } else {
    if (!value.childrenForComponent) {
      value.childrenForComponent = [value.rawString]
    }
    return value;
  }
}

function findPreSugarIndsAndMarkFromSugar(components) {
  let preSugarIndsFound = [];
  for (let component of components) {
    if (typeof component !== "object") {
      continue;
    }
    if (component.preSugarInd !== undefined) {
      preSugarIndsFound.push(component.preSugarInd)
    } else {
      if (!component.doenetAttributes) {
        component.doenetAttributes = {};
      }
      component.doenetAttributes.createdFromSugar = true;
      if (component.children) {
        let inds = findPreSugarIndsAndMarkFromSugar(component.children);
        preSugarIndsFound.push(...inds);
      }
    }
  }

  return preSugarIndsFound;
}

export function applyMacros(serializedComponents, componentInfoObjects) {

  for (let component of serializedComponents) {
    if (component.children) {
      applyMacros(component.children, componentInfoObjects);
    }
    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
          applyMacros([attribute.component], componentInfoObjects)
        } else if (attribute.childrenForComponent) {
          applyMacros(attribute.childrenForComponent, componentInfoObjects);
        }
      }
    }
  }

  substituteMacros(serializedComponents, componentInfoObjects);

}

function substituteMacros(serializedComponents, componentInfoObjects) {

  for (let componentInd = 0; componentInd < serializedComponents.length; componentInd++) {
    let component = serializedComponents[componentInd];

    if (typeof component === "string") {

      let startInd = 0;
      while (startInd < component.length) {

        let str = component;
        let result = findFirstFullMacroInString(str.slice(startInd));

        if (!result.success) {
          break;
        }

        let firstIndMatched = result.firstIndMatched + startInd;
        let matchLength = result.matchLength;
        let nDollarSigns = result.nDollarSigns;

        let componentsFromMacro;

        let componentResult = createComponentFromExtendedSource({
          sourceName: result.sourceName,
          componentIndex: result.componentIndex,
          subNames: result.subNames,
          componentAttributes: result.componentAttributes,
          propArray: result.propArray,
          componentInfoObjects
        });

        let newComponent;
        if (componentResult.success) {
          newComponent = componentResult.newComponent;
        } else {
          let strWithError = str.slice(firstIndMatched, firstIndMatched + matchLength);
          let macroStartInd = firstIndMatched;
          // TODO: if previous component is a string,
          // keep going back and add string lengths to get actual index
          if (componentInd > 0 && serializedComponents[componentInd - 1].range) {
            let previousRange = serializedComponents[componentInd - 1].range;
            if (previousRange.closeEnd) {
              macroStartInd += previousRange.closeEnd;
            } else if (previousRange.selfCloseEnd) {
              macroStartInd += previousRange.selfCloseBegin;
            }
          }

          throw Error(`${componentResult.message}. At indices ${macroStartInd}-${macroStartInd + matchLength}.  Found: ${strWithError}`)

        }

        markCreatedFromMacro([newComponent]);


        if (result.propArray.length === 0) {
          newComponent.doenetAttributes.isPlainMacro = true;
        }

        componentsFromMacro = [newComponent];

        let nComponentsToRemove = 1;
        let stringToAddAtEnd = str.substring(firstIndMatched + matchLength);

        if (nDollarSigns === 2) {

          let matchOpeningParens = str.slice(firstIndMatched + matchLength).match(/^\s*\(/);

          if (!matchOpeningParens) {
            // if don't match function,
            // don't replace double dollar sign macro
            startInd = firstIndMatched + 2;
            continue;
          }

          let matchLengthWithOpeningParens = matchLength + matchOpeningParens[0].length;

          // look for a closing parenthesis

          // get array of the component with the rest of this string
          // plus the rest of the components in the array
          let remainingComponents = [];
          let includeFirstInRemaining = false;

          if (str.length > firstIndMatched + matchLengthWithOpeningParens) {
            includeFirstInRemaining = true;
            remainingComponents.push(str.substring(firstIndMatched + matchLengthWithOpeningParens))
          }

          remainingComponents.push(...serializedComponents.slice(componentInd + 1));

          let evaluateResult = createEvaluateIfFindMatchedClosingParens({
            componentsFromMacro,
            remainingComponents,
            includeFirstInRemaining,
            componentInfoObjects
          })

          if (!evaluateResult.success) {
            // if couldn't create evaluate,
            // don't replace double dollar macro
            startInd = firstIndMatched + 2;
            continue;
          }

          componentsFromMacro = evaluateResult.componentsFromMacro;

          nComponentsToRemove = evaluateResult.lastComponentIndMatched + 1;
          if (!includeFirstInRemaining) {
            nComponentsToRemove++;
          }

          // leftover string already included in componentsFromMacro
          stringToAddAtEnd = "";


        }

        let replacements = [];

        // the string before the function name
        if (firstIndMatched > 0) {
          replacements.push(str.substring(0, firstIndMatched))
        }

        replacements.push(...componentsFromMacro);

        if (stringToAddAtEnd.length > 0) {
          replacements.push(stringToAddAtEnd)
        }

        // splice new replacements into serializedComponents
        serializedComponents.splice(componentInd, nComponentsToRemove, ...replacements)

        if (firstIndMatched > 0) {
          // increment componentInd because we now have to skip
          // over two components
          // (the component made from the beginning of the string
          // as well as the component made from the macro)
          componentInd++;
        }

        // break out of loop processing string,
        // as finished current one
        // (possibly breaking it into pieces, so will address remainder as other component)

        break;

      }
    }

  }

}


function createComponentFromExtendedSource({ sourceName,
  componentIndex, componentAttributes, propArray,
  subNames,
  componentInfoObjects }) {

  let newComponent = {
    componentType: "copy",
    doenetAttributes: { target: sourceName, },
    attributes: {},
  };

  if (componentIndex) {
    let childrenForAttribute = [componentIndex];
    applyMacros(childrenForAttribute, componentInfoObjects);

    newComponent.attributes.componentIndex = {
      component: {
        componentType: "integer",
        children: childrenForAttribute
      }
    };
  }

  if (subNames?.length > 0) {
    let sourceSubnames = [];
    let sourceSubnamesComponentIndex = [];

    for (let subNameObj of subNames) {
      sourceSubnames.push(subNameObj.subName);
      if (subNameObj.subNameComponentIndex !== undefined) {
        if (sourceSubnamesComponentIndex.length < sourceSubnames - 1) {
          // TODO: NaN will presumably make it not return anything
          // When we enable recursing to composites, we'll need a staregy to skip subname component index
          sourceSubnamesComponentIndex.push(...Array[sourceSubnames - 1 - sourceSubnamesComponentIndex.length].fill(NaN))
        }
        sourceSubnamesComponentIndex.push(subNameObj.subNameComponentIndex);
      }
    }

    newComponent.attributes.sourceSubnames = {
      primitive: sourceSubnames
    };
    if (sourceSubnamesComponentIndex.length > 0) {
      let childrenForAttribute = [sourceSubnamesComponentIndex.join(" ")];
      applyMacros(childrenForAttribute, componentInfoObjects);

      newComponent.attributes.sourceSubnamesComponentIndex = {
        component: {
          componentType: "numberList",
          children: childrenForAttribute
        }
      };
    }
  }

  let propsAddExtract = false;

  if (componentAttributes) {
    propsAddExtract = true;

    let attributesResult = createAttributesFromString(componentAttributes, componentInfoObjects);
    if (!attributesResult.success) {
      return attributesResult;
    }

    Object.assign(newComponent.attributes, attributesResult.newAttributes)

    if (attributesResult.assignNames) {
      newComponent.props = { assignNames: attributesResult.assignNames };
    }
  }


  for (let propObj of propArray) {

    if (propsAddExtract) {

      newComponent.doenetAttributes.createdFromMacro = true;

      newComponent = {
        componentType: "extract",
        attributes: {},
        doenetAttributes: {},
        children: [newComponent]
      };
    }

    newComponent.attributes.prop = { primitive: propObj.prop };

    if (propObj.propIndex) {
      let childrenForAttribute = [propObj.propIndex.join(" ")];
      applyMacros(childrenForAttribute, componentInfoObjects);

      newComponent.attributes.propIndex = {
        component: {
          componentType: "numberList",
          children: childrenForAttribute
        }
      };
    }

    if (propObj.attributes) {

      let attributesResult = createAttributesFromString(propObj.attributes, componentInfoObjects);
      if (!attributesResult.success) {
        return attributesResult;
      }

      Object.assign(newComponent.attributes, attributesResult.newAttributes);


      if (attributesResult.assignNames) {
        newComponent.props = { assignNames: attributesResult.assignNames };
      }
    }


    propsAddExtract = true;

  }

  return { success: true, newComponent };
}

function createAttributesFromString(componentAttributes, componentInfoObjects) {
  // parse a copy component with those attributes
  // to get attributes parsed

  let attributesDoenetML = `<copy ${componentAttributes} />`;
  let componentsForAttributes;
  try {
    componentsForAttributes = parseAndCompile(attributesDoenetML);
  } catch (e) {
    return { success: false, message: "Error in macro" }
  }

  createAttributesFromProps(componentsForAttributes, componentInfoObjects);
  markCreatedFromMacro(componentsForAttributes);

  // recurse in case there were more macros in additionalAttributes
  applyMacros(componentsForAttributes, componentInfoObjects);


  let newAttributes = componentsForAttributes[0].attributes;

  if (newAttributes.prop || newAttributes.propIndex || newAttributes.componentIndex) {
    return {
      success: false,
      message: "Error in macro: macro cannot directly add attributes prop, propIndex, or componentIndex"
    }
  }

  let assignNames;
  if (componentsForAttributes[0].props) {
    for (let prop in componentsForAttributes[0].props) {
      if (prop.toLowerCase() === "assignnames") {
        if (assignNames) {
          return {
            success: false,
            message: "Error in macro: cannot repeat assignNames"
          }
        } else {
          assignNames = componentsForAttributes[0].props[prop];
        }
      }
    }
  }

  return { success: true, newAttributes, assignNames }
}

function findFirstFullMacroInString(str) {

  let offset = 0;
  let nDollarSigns;

  while (true) {
    // look for a macro
    let matchDollars = str.substring(offset).match(/(\$+)(.?)/);

    if (!matchDollars) {
      return { success: false };
    }

    nDollarSigns = matchDollars[1].length;
    offset += matchDollars.index + nDollarSigns;

    if (nDollarSigns <= 2) {

      let extendedWordCharacters = false;

      let strForMacro = str.substring(offset);
      let requiredLength = 0;

      let findResult = findWordOrDelimitedGroup(strForMacro, extendedWordCharacters);

      if (findResult.startDelim === "(") {
        // if have parens, then restrict to string inside parens
        // and allowed extended characters in words
        extendedWordCharacters = true;
        strForMacro = findResult.group;
        requiredLength = findResult.group.length;
      }

      let result = buildSourcePieces(strForMacro, extendedWordCharacters)

      if (result.success) {

        if (extendedWordCharacters) {
          // if were in parens, then must match all characters
          if (result.matchLength !== requiredLength) {
            return { success: false }
          }
          result.matchLength += 2;  // +2 for the parens
        }

        result.nDollarSigns = nDollarSigns;
        result.firstIndMatched = offset - nDollarSigns;
        result.matchLength += nDollarSigns;

        return result;
      }
    }

    // try for another match, given that offset was shifted after last dollar signs

  }


}

function buildSourcePieces(str, extendedWordCharacters) {


  let findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

  let matchLength = 0;

  if (findResult.withPeriod || !findResult.word) {
    // must start with a word without a period
    return { success: false };
  }

  let result = {
    sourceName: (findResult.withSlash ? "/" : "") + findResult.word
  }

  matchLength += findResult.matchLength;
  str = str.substring(findResult.matchLength);

  findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

  if (findResult.startDelim === "[") {
    result.componentIndex = findResult.group;
    matchLength += findResult.matchLength;
    str = str.substring(findResult.matchLength);
    findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
  }

  let subNames = [];
  while (findResult.withSlash) {
    // check for additional subname piece of /name[componentIndex]

    let subnameObj = { subName: findResult.word }
    matchLength += findResult.matchLength;
    str = str.substring(findResult.matchLength);
    findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

    if (findResult.startDelim === "[") {
      subnameObj.subNameComponentIndex = findResult.group;
      matchLength += findResult.matchLength;
      str = str.substring(findResult.matchLength);
      findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
    }

    subNames.push(subnameObj);
  }

  result.subNames = subNames;


  if (findResult.startDelim === "{") {
    result.componentAttributes = findResult.group;
    matchLength += findResult.matchLength;
    str = str.substring(findResult.matchLength);
    findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
  }


  let propArray = [];

  while (findResult.withPeriod) {
    // check to a prop object of prop[propIndex]{attributes}
    // where [] and {} parts are optional

    let propObj = { prop: findResult.word };
    matchLength += findResult.matchLength;
    str = str.substring(findResult.matchLength);
    findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

    let propIndex = [];

    while (findResult.startDelim === "[") {
      propIndex.push(findResult.group);
      matchLength += findResult.matchLength;
      str = str.substring(findResult.matchLength);
      findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
    }

    if (propIndex.length > 0) {
      propObj.propIndex = propIndex;
    }

    if (findResult.startDelim === "{") {
      propObj.attributes = findResult.group;
      matchLength += findResult.matchLength;
      str = str.substring(findResult.matchLength);
      findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
    }

    propArray.push(propObj)

  }


  result.propArray = propArray;
  result.matchLength = matchLength;
  result.success = true;

  return result;

}

function findWordOrDelimitedGroup(str, extendedWordCharacters = false) {
  // find the next word (possibly begininng with a period or, extendedWordCharacters, a slash ),
  // or a group delimited by (), [], or {},
  // where the word/group must start with the first character of the string

  let withPeriod = false;
  let withSlash = false;
  if (str[0] === "." && str[1] !== ".") {
    withPeriod = true;
    str = str.substring(1);
  }

  let wordRe;

  if (extendedWordCharacters) {
    if (withPeriod) {
      wordRe = /^[\w-]+/;
    } else {
      if (str[0] === "/" && str[1].match(/\w/)) {
        withSlash = true;
        str = str.substring(1);
      }
      wordRe = /^([\w\/-]|\.\.\/)+/;
    }
  } else {
    wordRe = /^[a-zA-Z_]\w*/;
  }

  let match = str.match(wordRe);

  if (match) {
    return {
      success: true,
      withPeriod,
      withSlash,
      word: match[0],
      matchLength: match[0].length + (withPeriod ? 1 : 0) + (withSlash ? 1 : 0)
    }
  } else if (withPeriod || withSlash) {
    // if starts with a period or slash, must have word next
    return { success: false };
  }

  let neededClosingDelimStack = [];
  let closingByOpeningDelim = {
    "(": ")",
    "{": "}",
    "[": "]",
  }
  let closeDelims = Object.values(closingByOpeningDelim);

  let startDelim = str[0];

  let nextClosing = closingByOpeningDelim[startDelim];

  if (!nextClosing) {
    return { success: false }
  }

  neededClosingDelimStack.push(nextClosing);

  for (let ind = 1; ind < str.length; ind++) {
    let char = str[ind];

    if (char in closingByOpeningDelim) {
      neededClosingDelimStack.push(closingByOpeningDelim[char])
    } else if (closeDelims.includes(char)) {
      if (char !== neededClosingDelimStack.pop()) {
        // mismatched closing delim
        return { success: false }
      }
      if (neededClosingDelimStack.length === 0) {
        // matched startDelim
        return {
          success: true,
          group: str.substring(1, ind),  // does not include delimiters
          startDelim,
          matchLength: ind + 1
        }
      }
    }

  }

  // got to end of str with closing out startDelim
  return { success: false }

}

function markCreatedFromMacro(serializedComponents) {
  for (let serializedComponent of serializedComponents) {
    if (!serializedComponent.doenetAttributes) {
      serializedComponent.doenetAttributes = {};
    }
    serializedComponent.doenetAttributes.createdFromMacro = true;

    if (serializedComponent.children) {
      markCreatedFromMacro(serializedComponent.children);
    }
  }
}

function createEvaluateIfFindMatchedClosingParens({
  componentsFromMacro, remainingComponents, includeFirstInRemaining, componentInfoObjects
}) {

  let result = findFirstUnmatchedClosingParens(remainingComponents);

  if (!result.success) {
    return result;
  }
  // found unmatched closing parenthesis, so is the one
  // matching the opening parenthesis

  let lastComponentInd = result.componentInd;

  remainingComponents = remainingComponents.slice(0, lastComponentInd + 1);

  let lastComponentOfFunction = remainingComponents[lastComponentInd];

  let stringAfterFunction = "";

  // if have text after closing parenthesis
  // save in stringAfterFunction
  if (result.charInd + 1 < lastComponentOfFunction.length) {
    stringAfterFunction = lastComponentOfFunction.substring(result.charInd + 1);
  }

  // remove closing parenthesis and any subsequent text
  // from the last component
  if (result.charInd > 0) {
    remainingComponents[lastComponentInd]
      = lastComponentOfFunction.substring(0, result.charInd)
  } else {
    // remove this component altogether as there is nothing left
    remainingComponents = remainingComponents.slice(0, lastComponentInd);
  }


  let breakResults = breakEmbeddedStringByCommas({ childrenList: remainingComponents });

  // recurse on pieces
  breakResults.pieces.forEach(x => applyMacros(x, componentInfoObjects));

  let inputArray = breakResults.pieces.map(x => {
    if (x.length === 1 && typeof x[0] !== "string") {
      return x[0]
    } else {
      return {
        componentType: "math",
        doenetAttributes: { createdFromMacro: true },
        children: x
      }
    }
  })

  let evaluateComponent = {
    componentType: "evaluate",
    doenetAttributes: { createdFromMacro: true },
    attributes: {
      function: {
        component: {
          componentType: "function",
          doenetAttributes: { createdFromMacro: true },
          children: componentsFromMacro
        }
      },
      input: {
        component: {
          componentType: "mathList",
          doenetAttributes: { createdFromMacro: true },
          children: inputArray
        }
      }
    }
  }

  let replacements = [evaluateComponent];

  // if have text after function
  // include string component at end containing that text
  if (stringAfterFunction.length > 0) {
    replacements.push(stringAfterFunction)
  }

  return {
    success: true,
    componentsFromMacro: replacements,
    lastComponentIndMatched: lastComponentInd,
  }


}

function findFirstUnmatchedClosingParens(components) {

  let Nparens = 0;

  for (let [componentInd, component] of components.entries()) {
    if (typeof component === "string") {
      let s = component;

      for (let charInd = 0; charInd < s.length; charInd++) {
        let char = s[charInd];
        if (char === "(") {
          Nparens++;
        } else if (char === ")") {
          if (Nparens === 0) {
            // parens didn't match
            return {
              success: true,
              componentInd,
              charInd
            }
          } else {
            Nparens--;
          }
        }
      }

    }
  }

  // never found a closing parenthesis that wasn't matched
  return { success: false }
}

function decodeXMLEntities(serializedComponents) {

  function replaceEntities(s) {
    return s
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&dollar;/g, '$')
      .replace(/&amp;/g, '&');
  }

  for (let [ind, serializedComponent] of serializedComponents.entries()) {
    if (typeof serializedComponent === "string") {
      serializedComponents[ind] = replaceEntities(serializedComponent);
    } else {

      if (serializedComponent.children) {
        decodeXMLEntities(serializedComponent.children)
      }

      if (serializedComponent.attributes) {
        for (let attrName in serializedComponent.attributes) {
          let attribute = serializedComponent.attributes[attrName];

          if (attribute.component) {
            decodeXMLEntities([attribute.component])
          } else if (attribute.primitive) {
            if (typeof attribute.primitive === "string") {
              attribute.primitive = replaceEntities(attribute.primitive);
            }
          } else {
            if (attribute.childrenForComponent) {
              decodeXMLEntities(attribute.childrenForComponent);
            }
            if (attribute.rawString) {
              attribute.rawString = replaceEntities(attribute.rawString);
            }
          }
        }
      }
    }
  }
}

export function applySugar({ serializedComponents, parentParametersFromSugar = {},
  parentAttributes = {},
  componentInfoObjects,
  parentUniqueId = "",
  isAttributeComponent = false,
}) {

  for (let [componentInd, component] of serializedComponents.entries()) {
    if (typeof component !== "object") {
      continue;
    }

    let componentType = component.componentType;
    let componentClass = componentInfoObjects.allComponentClasses[componentType];
    if (!componentClass) {
      throw Error(`Unrecognized component type ${componentType}`)
    }
    let uniqueId = parentUniqueId + '|' + componentType + componentInd;

    let componentAttributes = {};
    // add primitive attributes to componentAttributes
    for (let attrName in component.attributes) {
      let attribute = component.attributes[attrName];
      if (attribute.primitive !== undefined) {
        componentAttributes[attrName] = attribute.primitive;
      }
    }

    if (component.children) {

      let newParentParametersFromSugar = {};

      if (!component.skipSugar) {

        for (let [sugarInd, sugarInstruction] of componentClass.returnSugarInstructions().entries()) {

          // if (component.children.length === 0) {
          //   break;
          // }

          let childTypes = component.children
            .map(x => typeof x === "string" ? "s" : "n")
            .join("");

          if (sugarInstruction.childrenRegex) {
            let match = childTypes.match(sugarInstruction.childrenRegex);

            if (!match || match[0].length !== component.children.length) {
              // sugar pattern didn't match all children
              // so don't apply sugar

              continue;
            }

          }


          let matchedChildren = deepClone(component.children);

          let nNonStrings = 0;
          for (let child of matchedChildren) {
            if (typeof child !== "string") {
              child.preSugarInd = nNonStrings;
              nNonStrings++;
            }
          }

          let createdFromMacro = false;
          if (component.doenetAttributes && component.doenetAttributes.createdFromMacro) {
            createdFromMacro = true;
          }

          let sugarResults = sugarInstruction.replacementFunction({
            matchedChildren,
            parentParametersFromSugar,
            parentAttributes,
            componentAttributes,
            uniqueId: uniqueId + '|sugar' + sugarInd,
            componentInfoObjects,
            isAttributeComponent,
            createdFromMacro
          });

          // console.log("sugarResults")
          // console.log(sugarResults)

          if (sugarResults.success) {

            let newChildren = sugarResults.newChildren;
            let newAttributes = sugarResults.newAttributes;

            let preSugarIndsFoundInChildren = [], preSugarIndsFoundInAttributes = [];

            if (newChildren) {
              preSugarIndsFoundInChildren = findPreSugarIndsAndMarkFromSugar(newChildren);
            }
            if (newAttributes) {
              for (let attrName in newAttributes) {
                let comp = newAttributes[attrName].component;
                if (comp) {
                  preSugarIndsFoundInAttributes.push(...findPreSugarIndsAndMarkFromSugar(comp.children));
                }
              }
            }

            let preSugarIndsFound = [...preSugarIndsFoundInChildren, ...preSugarIndsFoundInAttributes];

            if (preSugarIndsFound.length !== nNonStrings ||
              !preSugarIndsFound.sort((a, b) => a - b).every((v, i) => v === i)
            ) {
              throw Error(`Invalid sugar for ${componentType} as didn't return set of original components`)
            }

            if (preSugarIndsFoundInChildren.length > 0) {
              let sortedList = [...preSugarIndsFoundInChildren].sort((a, b) => a - b);
              if (!sortedList.every((v, i) => v === preSugarIndsFoundInChildren[i])) {
                throw Error(`Invalid sugar for ${componentType} as didn't return original components in order`)
              }
            }


            if (sugarResults.parametersForChildrenSugar) {
              Object.assign(newParentParametersFromSugar, sugarResults.parametersForChildrenSugar)
            }

            if (newChildren) {
              component.children = newChildren;
            } else {
              component.children = [];
            }

            if (newAttributes) {
              if (!component.attributes) {
                component.attributes = {}
              }
              Object.assign(component.attributes, newAttributes)

            }

          }

        }
      }

      if (componentClass.removeBlankStringChildrenPostSugar) {
        component.children = component.children.filter(x => typeof x !== "string" || /\S/.test(x))
      }

      // Note: don't pass in isAttributeComponent
      // as that flag should be set just for the top level attribute component

      applySugar({
        serializedComponents: component.children,
        parentParametersFromSugar: newParentParametersFromSugar,
        parentAttributes: componentAttributes,
        componentInfoObjects,
        parentUniqueId: uniqueId,
      })
    }

    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];

        if (attribute.component) {

          applySugar({
            serializedComponents: [attribute.component],
            parentAttributes: componentAttributes,
            componentInfoObjects,
            parentUniqueId: uniqueId,
            isAttributeComponent: true,
          })
        }
      }
    }
  }
}

function breakStringInPiecesBySpacesOrParens(string) {

  if (typeof string !== "string") {
    return { success: false }
  }

  let Nparens = 0;
  let pieces = [];

  string = string.trim();
  let beginInd = 0;

  for (let ind = 0; ind < string.length; ind++) {
    let char = string[ind];
    if (char === "(") {
      if (Nparens === 0) {
        // beginning new parens piece
        // what have so far is a new piece
        let newPiece = string.substring(beginInd, ind).trim();
        if (newPiece.length > 0) {
          pieces.push(newPiece);
        }
        beginInd = ind;
      }

      Nparens++;
    } else if (char === ")") {
      if (Nparens === 0) {
        // parens didn't match, so return failure
        return { success: false };
      }
      if (Nparens === 1) {
        // found end of piece in parens
        let newPiece = string.substring(beginInd + 1, ind).trim();
        if (newPiece.length > 0) {
          // try to break further
          let result = breakStringInPiecesBySpacesOrParens(newPiece);
          if (result.success === true) {
            pieces.push(result.pieces);
          } else {
            pieces.push(newPiece);
          }
        }
        beginInd = ind + 1;
      }
      Nparens--
    } else if (Nparens === 0 && char.match(/\s/)) {
      // not in parens and found a space so potentially have a new piece
      let newPiece = string.substring(beginInd, ind).trim();
      if (newPiece.length > 0) {
        pieces.push(newPiece);
      }
      beginInd = ind;
    }

  }

  // parens didn't match, so return failure
  if (Nparens !== 0) {
    return { success: false };
  }

  let newPiece = string.substring(beginInd, string.length).trim();
  if (newPiece.length > 0) {
    pieces.push(newPiece);
  }

  return {
    success: true,
    pieces: pieces,
  }

}

export function countRegularComponentTypesInNamespace(serializedComponents, componentCounts = {}) {

  for (let serializedComponent of serializedComponents) {
    if (typeof serializedComponent === "object") {

      let componentType = serializedComponent.componentType;

      let count = componentCounts[componentType];
      if (count === undefined) {
        count = 0;
      }

      let doenetAttributes = serializedComponent.doenetAttributes;

      // if created from a attribute/sugar/macro, don't include in component counts
      if (!(doenetAttributes?.isAttributeChild || doenetAttributes?.createdFromSugar
        || doenetAttributes?.createdFromMacro
      )) {
        componentCounts[componentType] = ++count;
      }

      if (serializedComponent.children && !serializedComponent.attributes?.newNamespace?.primitive) {
        // if don't have new namespace, recurse to children
        componentCounts = countRegularComponentTypesInNamespace(serializedComponent.children, componentCounts);
      }
    }
  }

  return componentCounts;

}

export function renameAutonameBasedOnNewCounts(serializedComponents, newComponentCounts = {}) {

  let componentCounts = { ...newComponentCounts };

  for (let serializedComponent of serializedComponents) {
    if (typeof serializedComponent === "object") {

      let componentType = serializedComponent.componentType;

      let count = componentCounts[componentType];
      if (count === undefined) {
        count = 0;
      }

      let doenetAttributes = serializedComponent.doenetAttributes;

      // if created from a attribute/sugar/macro, don't include in component counts
      if (!(doenetAttributes?.isAttributeChild || doenetAttributes?.createdFromSugar
        || doenetAttributes?.createdFromMacro
      )) {
        componentCounts[componentType] = ++count;

        // check if name was created from counting components

        if (serializedComponent.componentName) {
          let lastSlash = serializedComponent.componentName.lastIndexOf('/');
          let originalName = serializedComponent.componentName.substring(lastSlash + 1);
          let nameStartFromComponentType = '_' + componentType.toLowerCase();
          if (originalName.substring(0, nameStartFromComponentType.length) === nameStartFromComponentType) {
            // recreate using new count
            serializedComponent.componentName = serializedComponent.componentName.substring(0, lastSlash + 1)
              + nameStartFromComponentType + count;
          }
        }

      }

      if (serializedComponent.children && !serializedComponent.attributes?.newNamespace?.primitive) {
        // if don't have new namespace, recurse to children
        componentCounts = renameAutonameBasedOnNewCounts(serializedComponent.children, componentCounts);
      }
    }
  }

  return componentCounts;

}

export function createComponentNames({ serializedComponents, namespaceStack = [],
  componentInfoObjects,
  parentDoenetAttributes = {},
  parentName,
  useOriginalNames = false,
  doenetAttributesByTargetComponentName,
  indOffset = 0,
  createNameContext = "",
  initWithoutShadowingComposite = false,
}) {

  if (namespaceStack.length === 0) {
    namespaceStack.push({ namespace: '', componentCounts: {}, namesUsed: {} });
  }
  let level = namespaceStack.length - 1;

  // console.log("createComponentNames " + level);
  // console.log(serializedComponents);
  // console.log(namespaceStack);

  let currentNamespace = namespaceStack[level];

  for (let [componentInd, serializedComponent] of serializedComponents.entries()) {
    if (typeof serializedComponent !== "object") {
      continue;
    }
    let componentType = serializedComponent.componentType;
    let componentClass = componentInfoObjects.allComponentClasses[componentType];

    let doenetAttributes = serializedComponent.doenetAttributes;
    if (doenetAttributes === undefined) {
      doenetAttributes = serializedComponent.doenetAttributes = {};
    }

    let attributes = serializedComponent.attributes;
    if (!attributes) {
      attributes = serializedComponent.attributes = {};
    }

    if (doenetAttributes.createNameFromComponentType) {
      componentType = doenetAttributes.createNameFromComponentType;
    }

    let prescribedName = doenetAttributes.prescribedName;
    let assignNames = doenetAttributes.assignNames;
    let target = doenetAttributes.target;
    // let propName = doenetAttributes.propName;
    // let type = doenetAttributes.type;
    // let alias = doenetAttributes.alias;
    // let indexAlias = doenetAttributes.indexAlias;

    let mustCreateUniqueName =
      doenetAttributes.isAttributeChild
      || doenetAttributes.createdFromSugar
      || doenetAttributes.createdFromMacro
      || doenetAttributes.createUniqueName;


    let newNamespace;
    if (attributes.newNamespace?.primitive ||
      (useOriginalNames && serializedComponent.originalAttributes
        && serializedComponent.originalAttributes.newNamespace)
    ) {
      newNamespace = true;
    }

    let prescribedNameFromDoenetAttributes = prescribedName !== undefined;

    let props = serializedComponent.props;
    if (props === undefined) {
      props = serializedComponent.props = {};
    } else {
      // look for a attribute that matches an prop
      // but case insensitive
      for (let key in props) {
        let lowercaseKey = key.toLowerCase();
        if (lowercaseKey === "name") {
          if (prescribedName === undefined) {
            prescribedName = props[key];
            delete props[key];
          } else {
            throw Error(`Cannot define name twice.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
          }
        } else if (lowercaseKey === "assignnames") {
          if (assignNames === undefined) {
            let result = breakStringInPiecesBySpacesOrParens(props[key]);
            if (result.success) {
              assignNames = result.pieces;
            } else {
              throw Error(`Invalid format for assignnames.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
            }
            delete props[key];
          } else {
            throw Error(`Cannot define assignNames twice for a component.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
          }
        } else if (lowercaseKey === "target") {
          if (target === undefined) {
            if (typeof props[key] !== "string") {
              throw Error(`Must specify value for target.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
            }
            target = props[key].trim();
            delete props[key];
          } else {
            throw Error(`Cannot define target twice for a component.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
          }
        }
      }
    }


    if (prescribedName) {

      if (!prescribedNameFromDoenetAttributes && !doenetAttributes.createdFromSugar) {

        if (!(/[a-zA-Z]/.test(prescribedName.substring(0, 1)))) {
          throw Error(`Invalid component name: ${prescribedName}.  Component name must begin with a letter.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
        }
        if (!(/^[a-zA-Z0-9_\-]+$/.test(prescribedName))) {
          throw Error(`Invalid component name: ${prescribedName}.  Component name can contain only letters, numbers, hyphens, and underscores.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
        }
      }

      // name was specified
      // put it into doenetAttributes
      doenetAttributes.prescribedName = prescribedName;

    } else if (mustCreateUniqueName) {
      let longNameId = parentName + "|createUniqueName|";

      if (serializedComponent.downstreamDependencies) {
        longNameId += JSON.stringify(serializedComponent.downstreamDependencies);
      } else {
        longNameId += componentInd + "|" + indOffset + "|" + createNameContext;
      }

      prescribedName = createUniqueName(componentType.toLowerCase(), longNameId);
    }

    if (!assignNames && useOriginalNames
      && serializedComponent.originalDoenetAttributes
      && serializedComponent.originalDoenetAttributes.assignNames
    ) {
      assignNames = serializedComponent.originalDoenetAttributes.assignNames;
    }

    if (assignNames) {

      let assignNamesToReplacements = componentClass.assignNamesToReplacements;
      if (!assignNamesToReplacements) {
        throw Error(`Cannot assign names for component type ${componentType}${indexRangeString(serializedComponent)}`);
      }

      // assignNames was specified
      // put in doenetAttributes as assignNames array
      doenetAttributes.assignNames = assignNames;

      if (!doenetAttributes.createUniqueAssignNames) {
        let flattenedNames = flattenDeep(assignNames);
        if (!doenetAttributes.fromCopyTarget && !doenetAttributes.fromCopyFromURI) {
          for (let name of flattenedNames) {
            if (!(/[a-zA-Z]/.test(name.substring(0, 1)))) {
              throw Error(`All assigned names must begin with a letter.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`);
            }
            if (!(/^[a-zA-Z0-9_\-]+$/.test(name))) {
              throw Error(`Assigned names can contain only letters, numbers, hyphens, and underscores.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`);
            }
          }
        }
        // check if unique names
        if (flattenedNames.length !== new Set(flattenedNames).size) {
          throw Error(`Duplicate assigned names.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`);
        }
      }
    }


    if (newNamespace) {
      // newNamespace was specified
      // put in attributes as boolean
      attributes.newNamespace = { primitive: newNamespace };
    }


    let count = currentNamespace.componentCounts[componentType];
    if (count === undefined) {
      count = 0;
    }

    // if created from a attribute/sugar/macro, don't include in component counts
    if (!(doenetAttributes.isAttributeChild || doenetAttributes.createdFromSugar
      || doenetAttributes.createdFromMacro
    )) {
      currentNamespace.componentCounts[componentType] = ++count;
    }

    let componentName = '';
    for (let l = 0; l <= level; l++) {
      componentName += namespaceStack[l].namespace + '/';
    }
    if (!prescribedName) {
      if (useOriginalNames) {

        if (serializedComponent.originalName) {
          let lastInd = serializedComponent.originalName.lastIndexOf("/");
          prescribedName = serializedComponent.originalName.substring(lastInd + 1);
          // } else if (serializedComponent.componentName) {
          //   let lastInd = serializedComponent.componentName.lastIndexOf("/");
          //   prescribedName = serializedComponent.componentName.substring(lastInd + 1);
        }
      }
      if (!prescribedName) {
        prescribedName = '_' + componentType.toLowerCase() + count;
      }
    }

    if (doenetAttributes.nameBecomesAssignNames) {
      if (newNamespace) {
        // delete newNamespace from target but make it assignNewNamespaces
        attributes.assignNewNamespaces = { primitive: true };
        delete attributes.newNamespace;
        newNamespace = false;
      }
      assignNames = doenetAttributes.assignNames = [prescribedName];

      // delete nameBecomesAssignNames so that copies
      // or further applications of createComponentNames
      // do not repeat this process and make assignNames be the randomly generated name
      delete doenetAttributes.nameBecomesAssignNames;

      // create unique name for copy
      let longNameId = parentName + "|createUniqueName|";
      doenetAttributes.createUniqueName = true;
      delete doenetAttributes.prescribedName;

      if (serializedComponent.downstreamDependencies) {
        longNameId += JSON.stringify(serializedComponent.downstreamDependencies);
      } else {
        longNameId += componentInd + "|" + indOffset + "|" + createNameContext;
      }

      prescribedName = createUniqueName("copy", longNameId);
    }

    componentName += prescribedName;

    serializedComponent.componentName = componentName;
    if (prescribedName) {
      if (prescribedName in currentNamespace.namesUsed) {
        throw Error(`Duplicate component name ${componentName}.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
      }
      currentNamespace.namesUsed[prescribedName] = true;
    }

    // if newNamespace is false,
    // then register assignNames as belonging to current namespace
    if (!newNamespace) {
      if (assignNames) {
        for (let name of flattenDeep(assignNames)) {
          if (name in currentNamespace.namesUsed) {
            throw Error(`Duplicate component name ${name} (from assignNames of ${componentName}).  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
          }
          currentNamespace.namesUsed[name] = true;
        }
      }
    }


    if (serializedComponent.doenetAttributes.createUniqueAssignNames &&
      serializedComponent.originalName
    ) {

      let originalAssignNames = serializedComponent.doenetAttributes.assignNames;
      if (!originalAssignNames) {
        originalAssignNames = serializedComponent.doenetAttributes.originalAssignNames;
      }

      let longNameIdBase = componentName + "|createUniqueName|assignNames|";

      let namespace = '';
      let oldNamespace;
      if (!newNamespace) {
        for (let l = 0; l <= level; l++) {
          namespace += namespaceStack[l].namespace + '/';
        }
        let lastInd = serializedComponent.originalName.lastIndexOf("/");
        oldNamespace = serializedComponent.originalName.slice(0, lastInd + 1)
      } else {
        namespace = componentName + '/';
        oldNamespace = serializedComponent.originalName + '/';
      }

      let newAssignNames = createNewAssignNamesAndRenameMatchingTNames({
        originalAssignNames, longNameIdBase,
        namespace, oldNamespace, doenetAttributesByTargetComponentName
      });

      assignNames = serializedComponent.doenetAttributes.assignNames = newAssignNames;

    }

    renameMatchingTNames(serializedComponent, doenetAttributesByTargetComponentName);

    if (target) {
      if (!componentClass.acceptTarget) {
        throw Error(`Component type ${componentType} does not accept a target attribute.   Found in component ${componentName}${indexRangeString(serializedComponent)}`);
      }

      if (target.includes('|')) {
        throw Error(`target cannot include |.  Found in component of type ${componentType}${indexRangeString(serializedComponent)}`)
      }

      // convert target to full name
      doenetAttributes.target = target;

      doenetAttributes.targetComponentName = convertComponentTarget({
        target,
        oldTargetComponentName: doenetAttributes.targetComponentName,
        namespaceStack,
        acceptDoubleUnderscore: doenetAttributes.createdFromSugar || doenetAttributes.allowDoubleUnderscoreTarget
      });

    }


    if (serializedComponent.children) {


      // recurse on child, creating new namespace if specified

      if (!(newNamespace || attributes.assignNewNamespaces?.primitive)) {

        let children = serializedComponent.children;


        if (doenetAttributes.nameFirstChildIndependently && children.length > 0) {

          // when creating names for first child, ignore all previous names and treat it as a separate unit

          children = children.slice(1)

          let originalNamesUsed = currentNamespace.namesUsed;
          let originalComponentCounts = currentNamespace.componentCounts;
          currentNamespace.namesUsed = {};
          currentNamespace.componentCounts = {};

          createComponentNames({
            serializedComponents: [serializedComponent.children[0]],
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            useOriginalNames,
            doenetAttributesByTargetComponentName,
          });

          currentNamespace.namesUsed = originalNamesUsed;
          currentNamespace.componentCounts = originalComponentCounts;

        }

        createComponentNames({
          serializedComponents: children,
          namespaceStack,
          componentInfoObjects,
          parentDoenetAttributes: doenetAttributes,
          parentName: componentName,
          useOriginalNames,
          doenetAttributesByTargetComponentName,
        });

      } else {


        // if newNamespace, then need to make sure that assigned names
        // don't conflict with new names added,
        // so include in namesused
        let namesUsed = {};
        // if (assignNames && !componentClass.assignNamesToChildren) {
        if (assignNames) {
          flattenDeep(assignNames).forEach(x => namesUsed[x] = true);
        }

        let children = serializedComponent.children;


        if (doenetAttributes.nameFirstChildIndependently && serializedComponent.children.length > 0) {

          // when creating names for first child, ignore all previous names and treat it as a separate unit

          children = children.slice(1)

          let separateNewNamespaceInfo = { namespace: prescribedName, componentCounts: {}, namesUsed: {} };
          namespaceStack.push(separateNewNamespaceInfo);

          createComponentNames({
            serializedComponents: [serializedComponent.children[0]],
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            useOriginalNames,
            doenetAttributesByTargetComponentName,
          });

          namespaceStack.pop();

        }



        let newNamespaceInfo = { namespace: prescribedName, componentCounts: {}, namesUsed };

        if (doenetAttributes.haveNewNamespaceOnlyFromShadow) {

          // if the parent component only has newNamespace from the fact that it is a shadow,
          // as opposed to explicitly getting it from assignNewNamespaces,
          // then, if a child is marked to ignore parent's newNamespace, it ignores it
          // Note: ignoreParentNewNamespace is only added when have fromCopyTarget

          let addingNewNamespace = true;
          let remainingChildren = [...children];

          while (remainingChildren.length > 0) {
            let nextChildren = [];

            for (let child of remainingChildren) {
              if (Boolean(child.doenetAttributes?.ignoreParentNewNamespace) === addingNewNamespace) {
                break;
              }
              nextChildren.push(child);
            }

            remainingChildren.splice(0, nextChildren.length);

            if (addingNewNamespace) {
              namespaceStack.push(newNamespaceInfo);
            } else if (initWithoutShadowingComposite) {
              // if this is the first time through and we aren't shadowing a composite
              // it is possible that ignoring the namespace will lead to name conflicts,
              // so give the child a unique name
              nextChildren.forEach(child => child.doenetAttributes.createUniqueName = true)
            }

            createComponentNames({
              serializedComponents: nextChildren,
              namespaceStack,
              componentInfoObjects,
              parentDoenetAttributes: doenetAttributes,
              parentName: componentName,
              useOriginalNames,
              doenetAttributesByTargetComponentName,
            });

            if (addingNewNamespace) {
              namespaceStack.pop();
            }

            addingNewNamespace = !addingNewNamespace;
          }
        } else {
          namespaceStack.push(newNamespaceInfo);
          createComponentNames({
            serializedComponents: children,
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            useOriginalNames,
            doenetAttributesByTargetComponentName,
          });
          namespaceStack.pop();
        }


      }
    }

    if (serializedComponent.attributes) {

      // recurse on attributes that are components

      for (let attrName in serializedComponent.attributes) {

        let attribute = serializedComponent.attributes[attrName];

        if (attribute.component) {

          let comp = attribute.component;

          if (!comp.doenetAttributes) {
            comp.doenetAttributes = {};
          }

          comp.doenetAttributes.isAttributeChild = true;
          if (attribute.ignoreFixed) {
            comp.doenetAttributes.ignoreParentFixed = true;
          }

          createComponentNames({
            serializedComponents: [comp],
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            useOriginalNames,
            doenetAttributesByTargetComponentName,
            createNameContext: attrName
          });

        } else if (attribute.childrenForComponent) {

          // TODO: what to do about parentName/parentDoenetAttributes
          // since parent of these isn't created
          // Note: the main (only?) to recurse here is to rename targets
          createComponentNames({
            serializedComponents: attribute.childrenForComponent,
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            useOriginalNames,
            doenetAttributesByTargetComponentName,
            createNameContext: attrName
          });
        }

      }
    }

    // TODO: is there any reason to run createComponentNames on attribute components?

  }

  return serializedComponents;

}

function createNewAssignNamesAndRenameMatchingTNames({
  originalAssignNames, longNameIdBase,
  namespace, oldNamespace, doenetAttributesByTargetComponentName
}) {

  let assignNames = [];

  for (let [ind, originalName] of originalAssignNames.entries()) {

    if (Array.isArray(originalName)) {
      // recurse to next level
      let assignNamesSub = createNewAssignNamesAndRenameMatchingTNames({
        originalAssignNames: originalName,
        longNameIdBase: longNameIdBase + ind + "_",
        namespace, oldNamespace, doenetAttributesByTargetComponentName
      })
      assignNames.push(assignNamesSub);
    } else {

      let longNameId = longNameIdBase + ind;
      let newName = createUniqueName("fromAssignNames", longNameId);
      assignNames.push(newName);

      let infoForRenaming = {
        componentName: namespace + newName,
        originalName: oldNamespace + originalName
      };

      renameMatchingTNames(infoForRenaming, doenetAttributesByTargetComponentName, true);
    }

  }

  return assignNames;

}

export function convertComponentTarget({
  target,
  oldTargetComponentName,
  namespaceStack,
  acceptDoubleUnderscore,
}) {


  if (!oldTargetComponentName && /__/.test(target) && !acceptDoubleUnderscore) {
    throw Error("Invalid reference target: " + target);

  }

  let targetComponentName;

  // console.log(`target: ${target}`)
  // console.log(JSON.parse(JSON.stringify(namespaceStack)))

  if (target.substring(0, 1) === '/') {
    // if starts with /, then don't add anything to path
    targetComponentName = target;
  } else {

    // calculate full target from target
    // putting it into the context of the current namespace

    let lastLevel = namespaceStack.length - 1;

    while (target.substring(0, 3) === '../') {
      // take off one level for every ../
      target = target.substring(3);
      lastLevel--;
    }

    if (lastLevel < 0) {
      // the target cannot possibly be valid
      // if there were more ../s than namespace levels
      lastLevel = 0;
    }

    targetComponentName = '';
    for (let l = 0; l <= lastLevel; l++) {
      targetComponentName += namespaceStack[l].namespace + '/';
    }
    targetComponentName += target;

  }

  return targetComponentName;

}

export function serializedComponentsReplacer(key, value) {
  if (value !== value) {
    return { objectType: 'special-numeric', stringValue: 'NaN' };
  } else if (value === Infinity) {
    return { objectType: 'special-numeric', stringValue: 'Infinity' };
  } else if (value === -Infinity) {
    return { objectType: 'special-numeric', stringValue: '-Infinity' };
  }
  return value;
}

let nanInfinityReviver = function (key, value) {

  if (value && value.objectType === "special-numeric") {
    if (value.stringValue === "NaN") {
      return NaN;
    } else if (value.stringValue === "Infinity") {
      return Infinity;
    } else if (value.stringValue === "-Infinity") {
      return -Infinity;
    }
  }

  return value;
}

export function serializedComponentsReviver(key, value) {
  return me.reviver(key, subsets.Subset.reviver(key, nanInfinityReviver(key, value)))
}

export function processAssignNames({
  assignNames = [],
  assignNewNamespaces = false,
  serializedComponents,
  parentName,
  parentCreatesNewNamespace,
  componentInfoObjects,
  indOffset = 0,
  originalNamesAreConsistent = false,
  shadowingComposite = false,
}) {


  // console.log(`process assign names`)
  // console.log(deepClone(serializedComponents));
  // console.log(`originalNamesAreConsistent: ${originalNamesAreConsistent}`)

  let nComponents = serializedComponents.length;

  // normalize form so all names are originalNames,
  // independent of whether the components originated from a copy
  // or directly from a serialized state that was already given names
  moveComponentNamesToOriginalNames(serializedComponents);

  let doenetAttributesByTargetComponentName = {};

  let originalNamespace = null;

  if (originalNamesAreConsistent) {

    // need to use a component for original name, as parentName is the new name
    if (nComponents > 0) {
      // find a component with an original name, i.e., not a string
      let component = serializedComponents.filter(x => typeof x === "object")[0];
      if (component && component.originalName) {
        let lastSlash = component.originalName.lastIndexOf('/');
        originalNamespace = component.originalName.substring(0, lastSlash);
      }
    }

    if (originalNamespace !== null) {
      for (let component of serializedComponents) {
        setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({
          namespace: originalNamespace,
          components: [component],
          doenetAttributesByTargetComponentName
        });
      }
    }
  } else {
    for (let ind = 0; ind < nComponents; ind++) {

      let component = serializedComponents[ind];

      if (typeof component !== "object") {
        continue;
      }

      originalNamespace = null;
      // need to use a component for original name, as parentName is the new name
      if (nComponents > 0 && component.originalName) {
        let lastSlash = component.originalName.lastIndexOf('/');
        originalNamespace = component.originalName.substring(0, lastSlash);
      }

      if (originalNamespace !== null) {
        setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({
          namespace: originalNamespace,
          components: [component],
          doenetAttributesByTargetComponentName
        });
      }

    }
  }


  let processedComponents = [];

  // don't name strings or primitive numbers
  let numPrimitives = 0;

  for (let ind = 0; ind < nComponents; ind++) {

    let indForNames = ind + indOffset;

    let component = serializedComponents[ind];

    if (typeof component !== "object") {
      numPrimitives++;
      processedComponents.push(component);
      continue;
    }

    let name = assignNames[indForNames - numPrimitives];


    if (!component.doenetAttributes) {
      component.doenetAttributes = {};
    }

    if (!originalNamesAreConsistent) {
      // doenetAttributesByTargetComponentName = {};

      originalNamespace = null;
      // need to use a component for original name, as parentName is the new name
      if (nComponents > 0 && component.originalName) {
        let lastSlash = component.originalName.lastIndexOf('/');
        originalNamespace = component.originalName.substring(0, lastSlash);
      }

    }

    if (name) {
      if (componentInfoObjects.allComponentClasses[
        component.componentType].assignNamesSkipOver
      ) {
        name = [name];
      } else if (component.attributes?.assignNamesSkip) {
        let numberToSkip = component.attributes.assignNamesSkip.primitive;
        if (numberToSkip > 0) {
          for (let i = 0; i < numberToSkip; i++) {
            name = [name];
          }
        }

      }
    }

    if (assignNewNamespaces) {
      if (!component.attributes) {
        component.attributes = {};
      }
      component.attributes.newNamespace = { primitive: true }
    }

    if (Array.isArray(name)) {

      if (componentInfoObjects.allComponentClasses[
        component.componentType].assignNamesToReplacements
      ) {

        // give component itself an unreachable name
        let longNameId = parentName + "|assignName|" + indForNames.toString();
        component.doenetAttributes.prescribedName = createUniqueName(component.componentType.toLowerCase(), longNameId);

        let componentName = parentName;
        if (!parentCreatesNewNamespace) {
          let lastSlash = parentName.lastIndexOf("/");
          componentName = parentName.substring(0, lastSlash);
        }
        componentName += "/" + component.doenetAttributes.prescribedName;
        component.componentName = componentName;

        component.doenetAttributes.assignNames = name;

        processedComponents.push(component);
        continue;

      } else {

        // TODO: what to do when try to assign names recursively to non-composite?
        console.warn(`Cannot assign names recursively to ${component.componentType}`)
        name = null;

      }

    }


    if (!name) {
      if (originalNamesAreConsistent && component.originalName && !component.doenetAttributes?.createUniqueName) {
        name = component.originalName.slice(originalNamespace.length + 1);
      } else {
        let longNameId = parentName + "|assignName|" + (indForNames).toString();
        name = createUniqueName(component.componentType.toLowerCase(), longNameId);
      }
    }


    component.doenetAttributes.prescribedName = name;
    // delete component.originalName;

    // even if original names are consistent, we still use component's original assignNames
    // (we wouldn't use assignNames of the component's children as they should have unique names)
    if (originalNamesAreConsistent && !component.doenetAttributes.assignNames
      && component.originalDoenetAttributes
      && component.originalDoenetAttributes.assignNames
    ) {
      component.doenetAttributes.assignNames = component.originalDoenetAttributes.assignNames;
    }

    createComponentNamesFromParentName({
      parentName,
      ind: indForNames,
      component,
      parentCreatesNewNamespace, componentInfoObjects,
      doenetAttributesByTargetComponentName,
      originalNamesAreConsistent,
      shadowingComposite,
    });

    processedComponents.push(component);

  }


  return {
    serializedComponents: processedComponents,
  };

}

function createComponentNamesFromParentName({
  parentName, component,
  ind,
  parentCreatesNewNamespace, componentInfoObjects,
  doenetAttributesByTargetComponentName,
  originalNamesAreConsistent,
  shadowingComposite,
}) {


  let namespacePieces = parentName.split('/');

  if (!parentCreatesNewNamespace) {
    namespacePieces.pop();
  }

  let namespaceStack = namespacePieces.map(x => ({
    namespace: x,
    componentCounts: {},
    namesUsed: {}
  }));

  if (!(parentName[0] === '/')) {
    // if componentName doesn't begin with a /
    // still add a namespace for the root namespace at the beginning
    namespaceStack.splice(0, 0, {
      componentCounts: {},
      namesUsed: {},
      namespace: ""
    });
  }

  if (!component.doenetAttributes) {
    component.doenetAttributes = {};
  }
  if (!component.attributes) {
    component.attributes = {};
  }

  // let originalNamespaceForComponentChildren = parentName;
  // if (!parentCreatesNewNamespace) {
  //   let lastSlash = parentName.lastIndexOf("/");
  //   namespaceForComponent = parentName.substring(0, lastSlash);
  // }


  let useOriginalNames;
  if (component.attributes.newNamespace?.primitive
    || originalNamesAreConsistent
  ) {
    useOriginalNames = true;
  } else {
    useOriginalNames = false;

    if (component.children) {
      markToCreateAllUniqueNames(component.children)
    }
  }

  // always mark component attributes to create unique names
  for (let attrName in component.attributes) {
    let attribute = component.attributes[attrName];
    if (attribute.component) {
      markToCreateAllUniqueNames([attribute.component]);
    } else if (attribute.childrenForComponent) {
      markToCreateAllUniqueNames(attribute.childrenForComponent);
    }
  }


  // console.log(`before create componentName`)
  // console.log(deepClone(component))
  // console.log(useOriginalNames);
  // console.log(component.attributes.newNamespace);

  createComponentNames({
    serializedComponents: [component],
    namespaceStack,
    componentInfoObjects,
    parentName,
    useOriginalNames,
    doenetAttributesByTargetComponentName,
    indOffset: ind,
    initWithoutShadowingComposite: !shadowingComposite,
  });

  // console.log(`result of create componentName`)
  // console.log(deepClone(component))

}

function setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({ namespace, components, doenetAttributesByTargetComponentName }) {

  let namespaceLength = namespace.length;
  for (let component of components) {
    if (typeof component !== "object") {
      continue;
    }

    if (component.doenetAttributes && component.doenetAttributes.target) {
      let targetComponentName = component.doenetAttributes.targetComponentName;
      if (targetComponentName !== undefined) {
        if (targetComponentName.substring(0, namespaceLength) !== namespace) {
          component.doenetAttributes.target = targetComponentName;
        }
        if (!doenetAttributesByTargetComponentName[targetComponentName]) {
          doenetAttributesByTargetComponentName[targetComponentName] = [];
        }
        doenetAttributesByTargetComponentName[targetComponentName].push(component.doenetAttributes);
      }
    }

    if (component.children) {
      setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({ namespace, components: component.children, doenetAttributesByTargetComponentName })
    }
    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
          setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({ namespace, components: [attribute.component], doenetAttributesByTargetComponentName })
        } else if (attribute.childrenForComponent) {
          setTargetsOutsideNamespaceToAbsoluteAndRecordAllTargetComponentNames({ namespace, components: attribute.childrenForComponent, doenetAttributesByTargetComponentName })
        }
      }
    }
  }
}

function renameMatchingTNames(component, doenetAttributesByTargetComponentName, renameMatchingNamespaces = false) {

  if (component.originalName &&
    doenetAttributesByTargetComponentName
    && component.componentName !== component.originalName) {
    // we have a component who has been named and there are other components
    // whose targetComponentName refers to this component
    // Modify the target and targetComponentName of the other components to refer to the new name
    // (Must modify targetComponentName as we don't know if this component has been processed yet)
    if (doenetAttributesByTargetComponentName[component.originalName]) {
      for (let dAttributes of doenetAttributesByTargetComponentName[component.originalName]) {
        dAttributes.target = component.componentName;
        dAttributes.targetComponentName = component.componentName;
      }
    }
    if (renameMatchingNamespaces) {
      let originalNamespace = component.originalName + "/";
      let nSpaceLen = originalNamespace.length;
      for (let originalTargetComponentName in doenetAttributesByTargetComponentName) {
        if (originalTargetComponentName.substring(0, nSpaceLen) === originalNamespace) {
          let originalEnding = originalTargetComponentName.substring(nSpaceLen);
          for (let dAttributes of doenetAttributesByTargetComponentName[originalTargetComponentName]) {
            dAttributes.target = component.componentName + "/" + originalEnding;
            dAttributes.targetComponentName = component.componentName + "/" + originalEnding;
          }
        }
      }
    }
  }
}

function moveComponentNamesToOriginalNames(components) {
  for (let component of components) {
    if (component.componentName) {
      component.originalName = component.componentName;
      delete component.componentName;
    }
    if (component.children) {
      moveComponentNamesToOriginalNames(component.children);
    }
    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
          moveComponentNamesToOriginalNames([attribute.component]);
        } else if (attribute.childrenForComponent) {
          moveComponentNamesToOriginalNames(attribute.childrenForComponent);
        }
      }
    }
  }
}

export function markToCreateAllUniqueNames(components) {
  for (let component of components) {
    if (typeof component !== "object") {
      continue;
    }

    if (!component.doenetAttributes) {
      component.doenetAttributes = {};
    }
    component.doenetAttributes.createUniqueName = true;
    delete component.doenetAttributes.prescribedName;

    if (!component.attributes?.newNamespace?.primitive) {
      if (component.doenetAttributes.assignNames) {
        component.doenetAttributes.createUniqueAssignNames = true;
        component.doenetAttributes.originalAssignNames = component.doenetAttributes.assignNames;
        delete component.doenetAttributes.assignNames;
      } else if (component.originalDoenetAttributes && component.originalDoenetAttributes.assignNames) {
        component.doenetAttributes.createUniqueAssignNames = true;
        component.doenetAttributes.originalAssignNames = component.originalDoenetAttributes.assignNames;
      }
      if (component.children) {
        markToCreateAllUniqueNames(component.children);
      }
    }

    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
          markToCreateAllUniqueNames([attribute.component]);
        } else if (attribute.childrenForComponent) {
          markToCreateAllUniqueNames(attribute.childrenForComponent);
        }
      }
    }
  }
}

export function setTNamesToAbsolute(components) {

  for (let component of components) {
    if (component.doenetAttributes && component.doenetAttributes.target) {
      let targetComponentName = component.doenetAttributes.targetComponentName;
      if (targetComponentName !== undefined) {
        component.doenetAttributes.target = targetComponentName;
      }
    }

    if (component.children) {
      setTNamesToAbsolute(component.children)
    }
    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
          setTNamesToAbsolute([attribute.component])
        } else if (attribute.childrenForComponent) {
          setTNamesToAbsolute(attribute.childrenForComponent)
        }
      }
    }
  }
}

export function restrictTNamesToNamespace({ components, namespace, parentNamespace, parentIsCopy = false, invalidateReferencesToBaseNamespace = false }) {

  if (parentNamespace === undefined) {
    parentNamespace = namespace;
  }

  let nSpace = namespace.length;

  for (let component of components) {

    if (component.doenetAttributes && component.doenetAttributes.target) {
      let target = component.doenetAttributes.target;

      if (target[0] === "/") {
        if (target.substring(0, nSpace) !== namespace) {
          // if left part of target matches the left part of the namespace, delete matched part from larget
          // else if left part of target matches the right part of the namespace, delete matched part

          let namespaceParts = namespace.split("/").slice(1);
          let targetParts = target.split("/").slice(1);;
          let foundAMatch = false;
          let targetComponentName = namespace + target.slice(1);

          while (namespaceParts.length > 0 && namespaceParts[0] === targetParts[0]) {
            namespaceParts = namespaceParts.slice(1);
            targetParts = targetParts.slice(1);
            foundAMatch = true;
          }

          if (foundAMatch) {
            targetComponentName = namespace + targetParts.join("/");
          } else {

            let namespaceParts = namespace.split("/").slice(1);
            for (let ind = 1; ind < namespaceParts.length; ind++) {
              let namespacePiece = "/" + namespaceParts.slice(ind).join("/");
              if (target.substring(0, namespacePiece.length) === namespacePiece) {
                targetComponentName = "/" + namespaceParts.slice(0, ind).join("/") + target;
                break;
              }
            }

          }

          component.doenetAttributes.target = targetComponentName;
          component.doenetAttributes.targetComponentName = targetComponentName;
        } else if (invalidateReferencesToBaseNamespace) {
          let lastSlash = target.lastIndexOf("/");
          if (target.slice(0, lastSlash + 1) === namespace) {
            component.doenetAttributes.target = "";
            component.doenetAttributes.targetComponentName = "";
          }
        }
      } else if (target.substring(0, 3) === "../") {
        let tNamePart = target;
        let namespacePart = parentNamespace;
        while (tNamePart.substring(0, 3) === "../") {
          tNamePart = tNamePart.substring(3);
          let lastSlash = namespacePart.substring(0, namespacePart.length - 1).lastIndexOf("/");
          namespacePart = namespacePart.substring(0, lastSlash + 1);
          if (namespacePart.substring(0, nSpace) !== namespace) {
            while (tNamePart.substring(0, 3) === "../") {
              tNamePart = tNamePart.substring(3);
            }

            let targetComponentName = namespace + tNamePart;
            component.doenetAttributes.target = targetComponentName;
            component.doenetAttributes.targetComponentName = targetComponentName;
            break;
          }
        }
        if (invalidateReferencesToBaseNamespace) {
          let targetComponentName = component.doenetAttributes.targetComponentName;
          let lastSlash = targetComponentName.lastIndexOf("/");
          if (targetComponentName.slice(0, lastSlash + 1) === namespace) {
            component.doenetAttributes.target = "";
            component.doenetAttributes.targetComponentName = "";
          }
        }

      }
    }

    if (component.children) {
      let adjustedNamespace = namespace;
      if (parentIsCopy && component.componentType === "externalContent") {
        // if have a external content inside a copy,
        // then restrict children to the namespace of the externalContent
        adjustedNamespace = component.componentName + "/";
      }
      let namespaceForChildren = parentNamespace;
      if (component.attributes && component.attributes.newNamespace?.primitive) {
        namespaceForChildren = component.componentName;
      }
      restrictTNamesToNamespace({
        components: component.children,
        namespace: adjustedNamespace,
        parentNamespace: namespaceForChildren,
        parentIsCopy: component.componentType === "copy",
        invalidateReferencesToBaseNamespace
      })
    }
    if (component.attributes) {
      for (let attrName in component.attributes) {
        let attribute = component.attributes[attrName];
        if (attribute.component) {
          restrictTNamesToNamespace({
            components: [attribute.component], namespace, parentNamespace,
            invalidateReferencesToBaseNamespace
          })
        } else if (attribute.childrenForComponent) {
          restrictTNamesToNamespace({
            components: attribute.childrenForComponent, namespace, parentNamespace,
            invalidateReferencesToBaseNamespace
          })
        }
      }
    }
  }
}

function indexRangeString(serializedComponent) {
  let message = "";
  if (serializedComponent.range) {
    let indBegin, indEnd;
    if (serializedComponent.range.selfCloseBegin !== undefined) {
      indBegin = serializedComponent.range.selfCloseBegin;
      indEnd = serializedComponent.range.selfCloseEnd;
    } else if (serializedComponent.range.openBegin !== undefined) {
      indBegin = serializedComponent.range.openBegin;
      indEnd = serializedComponent.range.closeEnd;
    }
    if (indBegin !== undefined) {
      message += ` at indices ${indBegin}-${indEnd}`;
    }
  }
  return message;
}

export function extractComponentNamesAndIndices(serializedComponents, nameSubstitutions = {}) {
  let componentArray = [];

  for (let serializedComponent of serializedComponents) {
    if (typeof serializedComponent === "object") {
      let componentName = serializedComponent.componentName;
      for (let originalName in nameSubstitutions) {
        componentName = componentName.replace(originalName, nameSubstitutions[originalName])
      }
      if (serializedComponent.doenetAttributes?.fromCopyTarget) {
        let lastSlash = componentName.lastIndexOf("/");
        let originalName = componentName.slice(lastSlash + 1);
        let newName = serializedComponent.doenetAttributes.assignNames[0];
        componentName = componentName.replace(originalName, newName);
        nameSubstitutions[originalName] = newName;
      }
      let componentObj = {
        componentName
      }
      if (serializedComponent.range) {
        if (serializedComponent.range.selfCloseBegin !== undefined) {
          componentObj.indBegin = serializedComponent.range.selfCloseBegin;
          componentObj.indEnd = serializedComponent.range.selfCloseEnd;
        } else if (serializedComponent.range.openBegin !== undefined) {
          componentObj.indBegin = serializedComponent.range.openBegin;
          componentObj.indEnd = serializedComponent.range.closeEnd;
        }
      }

      componentArray.push(componentObj);

      if (serializedComponent.children) {
        componentArray.push(...extractComponentNamesAndIndices(serializedComponent.children, { ...nameSubstitutions }))
      }

    }
  }

  return componentArray;

}

export function extractRangeIndexPieces({
  componentArray, lastInd = 0, stopInd = Infinity, enclosingComponentName
}) {

  let rangePieces = [];

  let componentInd = 0;
  let foundComponentAfterStopInd = false;
  while (componentInd < componentArray.length) {
    let componentObj = componentArray[componentInd];

    if (componentObj.indBegin === undefined) {
      componentInd++;
      continue;
    }

    if (componentObj.indBegin > stopInd) {
      if (enclosingComponentName && lastInd <= stopInd) {
        rangePieces.push({
          begin: lastInd,
          end: stopInd,
          componentName: enclosingComponentName
        })
      }
      foundComponentAfterStopInd = true;
      break;
    }

    if (enclosingComponentName && componentObj.indBegin > lastInd) {
      rangePieces.push({
        begin: lastInd,
        end: componentObj.indBegin - 1,
        componentName: enclosingComponentName
      })
    }


    let extractResult = extractRangeIndexPieces({
      componentArray: componentArray.slice(componentInd + 1),
      lastInd: componentObj.indBegin,
      stopInd: componentObj.indEnd,
      enclosingComponentName: componentObj.componentName
    });

    componentInd += extractResult.componentsConsumed + 1;
    rangePieces.push(...extractResult.rangePieces);

    lastInd = componentObj.indEnd + 1;

  }

  if (!foundComponentAfterStopInd && Number.isFinite(stopInd) && stopInd >= lastInd) {
    rangePieces.push({
      begin: lastInd,
      end: stopInd,
      componentName: enclosingComponentName
    })
  }


  return { componentsConsumed: componentInd, rangePieces };

}

export function countComponentTypes(serializedComponents) {
  let componentTypeCounts = {};

  for (let component of serializedComponents) {
    if (typeof component === "object") {
      let cType = component.componentType;
      let nComponents = 1;
      if (component.attributes?.createComponentOfType?.primitive) {
        cType = component.attributes.createComponentOfType.primitive;
        nComponents = component.attributes.nComponents?.primitive;
        if (!(Number.isInteger(nComponents) && nComponents > 0)) {
          nComponents = 1;
        }
      }
      if (cType in componentTypeCounts) {
        componentTypeCounts[cType] += nComponents;
      } else {
        componentTypeCounts[cType] = nComponents;
      }
    }
  }

  return componentTypeCounts;

}