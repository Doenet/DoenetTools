import me from 'math-expressions';
import { createUniqueName } from './naming';
import { flattenDeep } from './array';
import { deepClone } from './deepFunctions';

export function scrapeOffAllDoumentRelated(serializedState) {

  if (serializedState.length === 1 && serializedState[0].componentType === "document") {
    serializedState = serializedState[0].children;
  }

  for (let ind = serializedState.length - 1; ind >= 0; ind--) {
    let component = serializedState[ind];

    // delete any title or meta components
    if (["title", "meta"].includes(component.componentType)) {
      let numberToDelete = 1;
      let followingComponent = serializedState[ind + 1];
      if (followingComponent.componentType === "string" && followingComponent.state.value.trim() === "") {
        numberToDelete = 2;
      }
      serializedState.splice(ind, numberToDelete);
    }
  }

  // strip off any blank strings at beginning or end
  let firstNonblankInd, lastNonblankInd;
  for (let [ind, component] of serializedState.entries()) {
    if (component.componentType !== "string" || component.state.value.trim() !== "") {
      if (firstNonblankInd === undefined) {
        firstNonblankInd = ind;
      }
      lastNonblankInd = ind;
    }
  }
  serializedState = serializedState.slice(firstNonblankInd, lastNonblankInd + 1);

  return serializedState;

}

function findNextTag(text) {
  let tagRegEx = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/;
  let matchObj = tagRegEx.exec(text);
  if (matchObj === null) { return false; } //no tags so return
  let tagString = matchObj[0];
  //make tags lower case
  tagString = tagString.toLowerCase();
  let tagIndex = matchObj.index;

  //Find tagType
  let parts = tagString.split(" ");
  let tagType = parts[0].substring(1, parts[0].length - 1);
  if (parts.length > 1) {
    tagType = parts[0].substring(1, parts[0].length);
  }
  if (tagType.substring(tagType.length - 1, tagType.length) === '/') {
    tagType = tagType.substring(0, tagType.length - 1);
  }

  let tagPropsString = matchObj[1];
  tagPropsString = tagPropsString.trim();
  let tagProps = {};

  //Process Double Quoted Props
  let startPropDoubleRegEx = /\w+\s*=\s*["]/;
  matchObj = "not null";
  while (matchObj !== null) {
    matchObj = startPropDoubleRegEx.exec(tagPropsString);
    if (matchObj !== null) {
      let followingCode = tagPropsString.substring(matchObj.index + matchObj[0].length - 1, tagPropsString.length);
      let doubleQuoteRegEx = /"[^"\\]*(?:\\.[^"\\]*)*"/;
      let doubleMatchObj = doubleQuoteRegEx.exec(followingCode);
      let insideDoubleQuotes = doubleMatchObj[0].substring(1, doubleMatchObj[0].length - 1);
      let nameParts = matchObj[0].split('=');
      let propName = nameParts[0].trim();
      if (propName.substring(0, 1) === '_') {
        throw Error("The prop " + propName + " is reserved for internal use only.");
      }
      insideDoubleQuotes = insideDoubleQuotes.replace(/\\"/g, '"');
      if (propName in tagProps) {
        throw Error("Duplicate property " + propName + " in tag " + tagType);
      }
      tagProps[propName] = insideDoubleQuotes;
      tagPropsString = tagPropsString.substring(0, matchObj.index) +
        tagPropsString.substring(matchObj.index + matchObj[0].length +
          doubleMatchObj[0].length, tagPropsString.length);
    }
  }

  //Process Single Quoted Props
  let startPropSingleRegEx = /\w+\s*=\s*[']/;
  matchObj = "not null";
  while (matchObj !== null) {
    matchObj = startPropSingleRegEx.exec(tagPropsString);
    if (matchObj !== null) {
      let followingCode = tagPropsString.substring(matchObj.index + matchObj[0].length - 1, tagPropsString.length);
      let singleQuoteRegEx = /'[^'\\]*(?:\\.[^'\\]*)*'/;
      let singleMatchObj = singleQuoteRegEx.exec(followingCode);
      let insideSingleQuotes = singleMatchObj[0].substring(1, singleMatchObj[0].length - 1);
      let nameParts = matchObj[0].split('=');
      let propName = nameParts[0].trim();
      if (propName.substring(0, 1) === '_') {
        throw Error("The prop " + propName + " is reserved for internal use only.");
      }
      insideSingleQuotes = insideSingleQuotes.replace(/\\'/g, "'");
      if (propName in tagProps) {
        throw Error("Duplicate property " + propName + " in tag " + tagType);
      }
      tagProps[propName] = insideSingleQuotes;
      tagPropsString = tagPropsString.substring(0, matchObj.index) +
        tagPropsString.substring(matchObj.index + matchObj[0].length +
          singleMatchObj[0].length, tagPropsString.length);

    }
  }

  //Process Unquoted Props
  if (/\S/.test(tagPropsString)) {
    let unquotedParts = tagPropsString.split(" ");
    for (let propName of unquotedParts) {
      if (/\S/.test(propName)) {
        tagProps[propName] = true;
      }
    }
  }
  return { tagString: tagString, tagType: tagType, tagIndex: tagIndex, tagProps: tagProps };
}


export function doenetMLToSerializedState({ doenetML, includeBlankStrings = true, propertyClasses = {}, standardComponentClasses, allComponentClasses, init = true }) {
  if (doenetML === undefined) { return []; }
  if (init) {

    let startCommentIndex = doenetML.search('<!--');
    while (startCommentIndex !== -1) {
      let endCommentIndex = doenetML.search('-->');
      //if no end comment then the rest of the doenetML is commented out
      if (endCommentIndex === -1) { endCommentIndex = doenetML.length; } else { endCommentIndex = endCommentIndex + 3 }
      doenetML = doenetML.substring(0, startCommentIndex) + doenetML.substring(endCommentIndex, doenetML.length);
      startCommentIndex = doenetML.search('<!--');
    }

  }
  let json = [];

  //starting and ending index candidates
  let stringBeforeCode = "";
  let betweenTagsCode = "";
  while (doenetML.length > 0) {

    let startTag = findNextTag(doenetML);

    if (startTag === false) {
      //just text remains so return it if it has something in it
      if (/\S/.test(doenetML) || (includeBlankStrings && doenetML.length > 0)) {
        json.push({ componentType: "string", state: { value: doenetML } });
      }
      return json;
    }
    // Check if tag is valid
    if (!(startTag.tagType in standardComponentClasses) || startTag.tagType === "string") {
      throw Error("Tag " + startTag.tagType + " is not defined.");
    }
    let lastCharactorInsideStartTag =
      startTag.tagString.substring(startTag.tagString.length - 2, startTag.tagString.length - 1);
    if (lastCharactorInsideStartTag === '/') {
      //empty tag
      stringBeforeCode = doenetML.substring(0, startTag.tagIndex);
      betweenTagsCode = "";
      doenetML = doenetML.substring(startTag.tagIndex + startTag.tagString.length, doenetML.length);
    } else {
      //find the matching end tag
      let numStarts = 1;
      let numEnds = 0;
      let nextTag = JSON.parse(JSON.stringify(startTag));
      let searchForNextTagBeginingAtIndex = 0;
      let afterStartCode = "";

      while (numStarts > numEnds) {
        // console.log(numStarts+" --- "+numEnds);
        searchForNextTagBeginingAtIndex = Number(searchForNextTagBeginingAtIndex) + Number(nextTag.tagString.length) + Number(nextTag.tagIndex);
        afterStartCode = doenetML.substring(searchForNextTagBeginingAtIndex, doenetML.length);
        nextTag = findNextTag(afterStartCode);
        if (nextTag === false) {
          throw Error("No matching </" + startTag.tagType + "> end tag")
        }
        if (nextTag.tagType === startTag.tagType) { numStarts++; }
        if (nextTag.tagType === "/" + startTag.tagType) { numEnds++; }
      }

      stringBeforeCode = doenetML.substring(0, startTag.tagIndex);
      let startBetweenIndex = Number(startTag.tagIndex) + Number(startTag.tagString.length);
      let endBetweenIndex = Number(searchForNextTagBeginingAtIndex) + Number(nextTag.tagIndex);
      betweenTagsCode = doenetML.substring(startBetweenIndex, endBetweenIndex);
      doenetML = doenetML.substring(Number(endBetweenIndex) + Number(nextTag.tagString.length), doenetML.length);
    }

    if (/\S/.test(stringBeforeCode)) {
      // have non-blank string before code
      json.push({ componentType: "string", state: { value: stringBeforeCode } });

    } else if (includeBlankStrings && stringBeforeCode.length > 0) {

      // we have a blank string before startTag
      // and we are supposed to include blank strings
      // However, we will make an exception if startTag is the first occurence
      // of a property class, in which case we'll won't create the blank string

      let createBlankString = true;
      let startTagClass = standardComponentClasses[startTag.tagType];

      for (let className in propertyClasses) {
        if (propertyClasses[className]) {
          continue;  // skip if already seen, as only first occurrence of tag is property
        }

        // use allComponentClasses for property class name, as it might be abstract
        let pClass = allComponentClasses[className];

        // skip if property class doesn't exist
        if (pClass === undefined) {
          continue;
        }

        // if startTag is either the property className
        // or its class inherits from the property class
        if (startTag.tagType === className || pClass.isPrototypeOf(startTagClass)) {
          // upcoming tag is a first instance of a property class
          // so don't create blank string
          propertyClasses[className] = true;   // mark true so ignore next time
          createBlankString = false;
        }
      }
      if (createBlankString) {
        json.push({ componentType: "string", state: { value: stringBeforeCode } });
      }
    }


    let children = [];
    let componentClass = standardComponentClasses[startTag.tagType];
    let includeBlankStringChildren = componentClass.includeBlankStringChildren === true;
    let definedProperties = Object.keys(componentClass.createPropertiesObject({
      standardComponentClasses: standardComponentClasses
    }));
    // create object with keys being child properties,
    // values initialized to false to indicate that property hasn't been encountered yet
    let childPropertyClasses = {};
    definedProperties.forEach(x => childPropertyClasses[x] = false);

    if (/\S/.test(betweenTagsCode) || (includeBlankStringChildren && betweenTagsCode.length > 0)) {
      children = doenetMLToSerializedState({
        doenetML: betweenTagsCode,
        includeBlankStrings: includeBlankStringChildren,
        propertyClasses: childPropertyClasses,
        standardComponentClasses,
        allComponentClasses,
        init: false,
      });
    }

    json.push({ componentType: startTag.tagType, children: children, props: startTag.tagProps });

    if (!/\S/.test(doenetML)) {
      if (includeBlankStrings && doenetML.length > 0) {
        json.push({ componentType: "string", state: { value: doenetML } });
      }

      if (init) {
        // if this is the initial call, strip off any blank strings
        // at beginning or end
        let firstNonblankInd, lastNonblankInd;
        for (let [ind, component] of json.entries()) {
          if (component.componentType !== "string" || component.state.value.trim() !== "") {
            if (firstNonblankInd === undefined) {
              firstNonblankInd = ind;
            }
            lastNonblankInd = ind;
          }
        }
        json = json.slice(firstNonblankInd, lastNonblankInd + 1);
      }


      return json;
    }

  }

  return json;
}

export function findContentIdRefs({ serializedState }) {

  let contentIdComponents = {};
  for (let serializedComponent of serializedState) {
    if (serializedComponent.componentType === "ref") {
      if (serializedComponent.children !== undefined) {
        let contentIdComponent;
        for (let child of serializedComponent.children) {
          if (child.componentType === "contentid") {
            contentIdComponent = child;
            break;
          }
        }
        if (contentIdComponent) {
          let contentId;
          if (contentIdComponent.state !== undefined) {
            contentId = contentIdComponent.state.value;
          }
          if (contentIdComponent.children !== undefined) {
            for (let child of contentIdComponent.children) {
              if (child.componentType === "string") {
                contentId = child.state.value;
                break;
              }
            }
          }
          if (contentId !== undefined) {
            if (contentIdComponents[contentId] === undefined) {
              contentIdComponents[contentId] = [];
            }
            contentIdComponents[contentId].push(serializedComponent);
          }
        }
      }
    } else {
      if (serializedComponent.children !== undefined) {
        let results = findContentIdRefs({ serializedState: serializedComponent.children })

        // append results on to contentIdComponents
        for (let contentID in results) {
          if (contentIdComponents[contentID] === undefined) {
            contentIdComponents[contentID] = [];
          }
          contentIdComponents[contentID].push(...results[contentID]);
        }
      }
    }
  }
  return contentIdComponents;
}

export function addDocumentIfItsMissing(serializedState) {

  if (serializedState.length !== 1 || serializedState[0].componentType !== 'document') {
    let components = serializedState.splice(0);
    serializedState.push({ componentType: 'document', children: components });
  }
}

export function createComponentsFromProps(serializedState, standardComponentClasses) {
  for (let component of serializedState) {
    // if there are any props of json that are componentTypes,
    // return array of children
    let newChildren = [];
    if (component.props) {
      for (let prop in component.props) {
        let propLower = prop.toLowerCase();
        if (standardComponentClasses[propLower] !== undefined) {
          let newComponent;
          if (component.props[prop] === true) {
            // special case where had prop with no value
            // so its value was set to be boolean true (rather than string)
            // in this case, set state directly in component
            newComponent = {
              componentType: propLower,
              doenetAttributes: { createdFromProperty: true },
              state: { implicitValue: true }
            };
          } else {
            newComponent = {
              componentType: propLower,
              doenetAttributes: { createdFromProperty: true },
              children: [
                { componentType: "string", state: { value: component.props[prop] } }
              ]
            };
          }
          newChildren.push(newComponent);
          delete component.props[prop];
        } else if (!(propLower === "name" || propLower === "assignnames" || propLower === "newnamespace")) {
          throw Error("Invalid property: " + prop);
        }
      }
      component.children.unshift(...newChildren);
    }

    //recurse on children
    if (component.children !== undefined) {
      createComponentsFromProps(component.children, standardComponentClasses);
    }
  }
}


// function lowercaseDeep(arr1) {
//   return arr1.map(val => Array.isArray(val) ? lowercaseDeep(val) : val.toLowerCase());
// }

function breakStringByCommasWithParens(string) {
  let Nparens = 0;
  let pieces = [];

  string = string.trim();
  let beginInd = 0;

  for (let ind = 0; ind < string.length; ind++) {
    let char = string[ind];
    if (char === "(") {
      Nparens++;
    }
    if (char === ")") {
      if (Nparens === 0) {
        // parens didn't match, so return failure
        return { success: false };
      }
      Nparens--
    }
    if (char === "," && Nparens === 0) {
      let newPiece = string.substring(beginInd, ind).trim();
      if (newPiece[0] === "(" && newPiece[newPiece.length - 1] === ")") {
        // piece is in parens, try to break further
        let result = breakStringByCommasWithParens(newPiece.substring(1, newPiece.length - 1));
        if (result.success === true) {
          pieces.push(result.pieces);
        } else {
          pieces.push(newPiece);
        }
      } else {
        pieces.push(newPiece);
      }
      beginInd = ind + 1;
    }
  }

  // parens didn't match, so return failure
  if (Nparens !== 0) {
    return { success: false };
  }

  let newPiece = string.substring(beginInd, string.length).trim();
  if (newPiece[0] === "(" && newPiece[newPiece.length - 1] === ")") {
    // piece is in parens, try to break further
    let result = breakStringByCommasWithParens(newPiece.substring(1, newPiece.length - 1));
    if (result.success === true) {
      pieces.push(result.pieces);
    } else {
      pieces.push(newPiece);
    }
  } else {
    pieces.push(newPiece);
  }

  return {
    success: true,
    pieces: pieces,
  }

}

export function createComponentNames({ serializedState, namespaceStack = [],
  componentInfoObjects,
  nameSpaceForChildren,
  parentDoenetAttributes = {},
  parentName,
  usePreserializedNames,
  preserveFullTargetNamesOutsideNamespace,
  indOffset = 0,
}) {

  if (namespaceStack.length === 0) {
    namespaceStack.push({ namespace: '', componentCounts: {}, namesUsed: {} });
  }
  let level = namespaceStack.length - 1;

  // console.log("createComponentNames " + level);
  // console.log(serializedState);
  // console.log(namespaceStack);

  let currentNamespace = namespaceStack[level];

  for (let [componentInd, serializedComponent] of serializedState.entries()) {
    let componentType = serializedComponent.componentType;

    let doenetAttributes = serializedComponent.doenetAttributes;
    if (doenetAttributes === undefined) {
      doenetAttributes = serializedComponent.doenetAttributes = {};
    }


    let prescribedName = doenetAttributes.prescribedName;
    let assignNames = doenetAttributes.assignNames;
    let newNamespace = doenetAttributes.newNamespace;

    let mustCreateUniqueName =
      componentType === "string"
      || doenetAttributes.createdFromProperty
      || doenetAttributes.createUniqueName;

    if (!newNamespace && usePreserializedNames && serializedComponent.preserializedDoenetAttributes
      && serializedComponent.preserializedDoenetAttributes.newNamespace
    ) {
      newNamespace = true;
    }

    let prescribedNameFromDoenetAttributes = prescribedName !== undefined;
    let newNamespaceFromDoenetAttributes = newNamespace !== undefined;

    let props = serializedComponent.props;
    if (props === undefined) {
      props = serializedComponent.props = {};
    } else {
      // look for a property that matches name, assignNames, or newNamespace
      // but case insensitive
      for (let key in props) {
        let lowercaseKey = key.toLowerCase();
        if (lowercaseKey === "name") {
          if (prescribedName === undefined) {
            prescribedName = props[key];
            delete props[key];
          } else {
            throw Error("Cannot define name twice for a component");
          }
        } else if (lowercaseKey === "assignnames") {
          if (assignNames === undefined) {
            let result = breakStringByCommasWithParens(props[key]);
            if (result.success) {
              assignNames = result.pieces;
            } else {
              throw Error("Invalid format for assignnames");
            }
            delete props[key];
          } else {
            throw Error("Cannot define assignNames twice for a component");
          }
        } else if (lowercaseKey === "newnamespace") {
          if (newNamespace === undefined) {
            if (props[key] === true) {
              newNamespace = true;
            } else if (["true", "t"].includes(props[key].trim().toLowerCase())) {
              newNamespace = true;
            } else {
              newNamespace = false;  // make false for any other option
            }
            delete props[key];
          } else {
            throw Error("Cannot define newNamespace twice for a component");
          }
        }
      }
    }

    if (prescribedName !== undefined) {

      if (!prescribedNameFromDoenetAttributes) {

        if (!(/[a-zA-Z]/.test(prescribedName.substring(0, 1)))) {
          throw Error("Component name must begin with a letter");
        }
        if (!(/^[a-zA-Z0-9_-]+$/.test(prescribedName))) {
          throw Error("Component name can contain only letters, numbers, hyphens, and underscores");
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
        longNameId += componentInd + indOffset;
      }

      prescribedName = createUniqueName(componentType, longNameId);
    }

    if (!assignNames && usePreserializedNames
      && serializedComponent.preserializedDoenetAttributes
      && serializedComponent.preserializedDoenetAttributes.assignNames
    ) {
      assignNames = serializedComponent.preserializedDoenetAttributes.assignNames;
    }

    if (assignNames) {

      // assignNames was specified
      // put in doenetAttributes as assignNames array
      doenetAttributes.assignNames = assignNames;

      let flattedNames = flattenDeep(assignNames);
      for (let name of flattedNames) {
        if (!(/[a-zA-Z]/.test(name.substring(0, 1)))) {
          throw Error("All assigned names must begin with a letter");
        }
        if (!(/^[a-zA-Z0-9_-]+$/.test(name))) {
          throw Error("Assigned names can contain only letters, numbers, hyphens, and underscores");
        }
      }
      // check if unique names
      if (flattedNames.length !== new Set(flattedNames).size) {
        throw Error("Duplicate assigned names");
      }
    }
    if (newNamespace) {
      // newNamespace was specified
      // put in doenetAttributes as boolean
      doenetAttributes.newNamespace = newNamespace;
      if (prescribedName === undefined && !newNamespaceFromDoenetAttributes) {
        throw Error("Cannot create new namespace without defining a name");
      }
    }


    let count = currentNamespace.componentCounts[componentType];
    if (count === undefined) {
      count = 0;
    }

    // if created from a property, don't include in component counts
    if (!doenetAttributes.createdFromProperty) {
      currentNamespace.componentCounts[componentType] = ++count;
    }

    let componentName = '';
    for (let l = 0; l <= level; l++) {
      componentName += namespaceStack[l].namespace + '/';
    }
    if (!prescribedName) {
      if (usePreserializedNames) {

        if (serializedComponent.preserializedName) {
          let lastInd = serializedComponent.preserializedName.lastIndexOf("/");
          prescribedName = serializedComponent.preserializedName.substring(lastInd + 1);
          // } else if (serializedComponent.componentName) {
          //   let lastInd = serializedComponent.componentName.lastIndexOf("/");
          //   prescribedName = serializedComponent.componentName.substring(lastInd + 1);
        }
      }
      if (!prescribedName) {
        prescribedName = '_' + componentType + count;
      }
    }

    componentName += prescribedName;

    serializedComponent.componentName = componentName;
    if (prescribedName !== undefined) {
      if (prescribedName in currentNamespace.namesUsed) {
        throw Error("Duplicate component name " + componentName)
      }
      currentNamespace.namesUsed[prescribedName] = true;
    }
    // if newNamespace is false,
    // then register assignNames as belonging to current namespace
    if (newNamespace !== true) {
      if (assignNames !== undefined) {
        for (let name of flattenDeep(assignNames)) {
          if (name in currentNamespace.namesUsed) {
            throw Error("Duplicate component name (from assignNames) " + componentName)
          }
          currentNamespace.namesUsed[name] = true;
        }
      }
    }



    if (componentType in componentInfoObjects.componentTypesTakingComponentNames) {
      // find string child and convert it to full path name

      if (newNamespace) {
        namespaceStack.push({ namespace: prescribedName, componentCounts: {}, namesUsed: {} });
      }

      let preserve = preserveFullTargetNamesOutsideNamespace;
      if (parentName === preserveFullTargetNamesOutsideNamespace) {
        // if the component taking component names is a direct child of the
        // component creating the namespace, then we want to preserve
        // the full target name, as that component already skipped adding a namespace
        preserve = null;
        console.log(`setting preserve to null`)
      }

      convertComponentTarget({
        allComponentClasses: componentInfoObjects.allComponentClasses,
        componentType, serializedComponent,
        doenetAttributes, parentDoenetAttributes, namespaceStack,
        preserveFullTargetNamesOutsideNamespace: preserve,
      });

      if (newNamespace) {
        namespaceStack.pop();
      }
    }


    if (serializedComponent.children !== undefined) {
      let componentClass = componentInfoObjects.allComponentClasses[serializedComponent.componentType];

      if (componentClass.createNewNamespacesForChildren) {
        for (let child of serializedComponent.children) {
          if (componentClass.createNewNamespacesForChildren.includes(child.componentType)) {
            if (!child.doenetAttributes) {
              child.doenetAttributes = {};
            }
            child.doenetAttributes.newNamespace = true;
          }
        }

      }

      if (nameSpaceForChildren) {
        namespaceStack.push({ namespace: nameSpaceForChildren, componentCounts: {}, namesUsed: {} });
        createComponentNames({
          serializedState: serializedComponent.children,
          namespaceStack,
          componentInfoObjects,
          parentDoenetAttributes: doenetAttributes,
          parentName: componentName,
          usePreserializedNames,
          preserveFullTargetNamesOutsideNamespace,
        });
        namespaceStack.pop();

      } else if (assignNames === undefined) {
        // recurse on child, creating new namespace if specified

        if (newNamespace !== true) {
          createComponentNames({
            serializedState: serializedComponent.children,
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            usePreserializedNames,
            preserveFullTargetNamesOutsideNamespace,
          });
        } else {


          let newNamespaceInfo = { namespace: prescribedName, componentCounts: {}, namesUsed: {} };

          for (let [ind, child] of serializedComponent.children.entries()) {

            if (child.componentType === "tname") {
              createComponentNames({
                serializedState: [child],
                namespaceStack,
                componentInfoObjects,
                parentDoenetAttributes: doenetAttributes,
                parentName: componentName,
                usePreserializedNames,
                preserveFullTargetNamesOutsideNamespace,
                indOffset: ind,
              });
            } else {
              namespaceStack.push(newNamespaceInfo);
              createComponentNames({
                serializedState: [child],
                namespaceStack,
                componentInfoObjects,
                parentDoenetAttributes: doenetAttributes,
                parentName: componentName,
                usePreserializedNames,
                preserveFullTargetNamesOutsideNamespace,
                indOffset: ind,
              });
              namespaceStack.pop();
            }
          }
        }
      } else {
        // assignNames is defined
        // look up class to see what children are assigned names
        let assignNamesToReplacements = componentClass.assignNamesToReplacements;
        if (!assignNamesToReplacements) {
          throw Error("Cannot assign names for component type " + serializedComponent.componentType);
        }

        // console.log('******************')
        // console.log(componentClass.passArrayAssignNamesToChildren);
        // console.log(assignNames);
        // if (assignNames && componentClass.passArrayAssignNamesToChildren) {
        //   for (let [ind, componentTypesToMatch] of componentClass.passArrayAssignNamesToChildren.entries()) {
        //     console.log(componentTypesToMatch)
        //     if (Array.isArray(assignNames[ind])) {
        //       console.log(`******* found array assign Names *****`)
        //       console.log(serializedComponent.componentType)
        //       console.log(componentTypesToMatch);
        //       for (let child of serializedComponent.children) {
        //         if (componentTypesToMatch.includes(child.componentType)) {
        //           child.parentHadArrayAssignNames = true;
        //           console.log(`added tag to ${child.componentType}`)
        //         }
        //       }
        //     }
        //   }
        // }

        // if (assignNewNamespaceToAllChildrenExcept) {
        //   for (let child of serializedComponent.children) {
        //     if (!assignNewNamespaceToAllChildrenExcept.includes(child.componentType)) {

        //       // for each child
        //       // 1. mark as giving a new namespace for its children
        //       // 2. if name exists, save it and then delete it
        //       // 3. mark it as requiring a unique name
        //       if (child.props === undefined) {
        //         child.props = {};
        //       }
        //       if (child.doenetAttributes === undefined) {
        //         child.doenetAttributes = {};
        //       }

        //       // look for name and newnamespace in child
        //       let childAlreadyHasNewNamespace = child.doenetAttributes.childAlreadyHasNewNamespace;
        //       let childName = child.doenetAttributes.prescribedName;
        //       let prescribedChildNameFromDoenetAttributes = childName !== undefined;

        //       let childAlreadyHasNewNamespaceFromDoenetAttributes = childAlreadyHasNewNamespace !== undefined;

        //       for (let key in child.props) {
        //         let lowercaseKey = key.toLowerCase();
        //         if (lowercaseKey === "name") {
        //           if (childName === undefined) {
        //             childName = child.props[key];
        //             delete child.props[key];
        //           } else {
        //             throw Error("Cannot define name twice for a component");
        //           }
        //         } else if (lowercaseKey === "newnamespace") {
        //           if (childAlreadyHasNewNamespace) {
        //             throw Error("Cannot define newNamespace twice for a component");
        //           }
        //           if (child.props[key] === true || ["true", "t"].includes(child.props[key].trim().toLowerCase())) {
        //             childAlreadyHasNewNamespace = true;
        //           }
        //           delete child.props[key];
        //         }

        //       }
        //       if (childName !== undefined && !prescribedChildNameFromDoenetAttributes) {
        //         child.doenetAttributes.prescribedName = childName;

        //         if (!(/[a-zA-Z]/.test(childName.substring(0, 1)))) {
        //           throw Error("Component name must begin with a letter");
        //         }
        //         if (!(/^[a-zA-Z0-9_-]+$/.test(childName))) {
        //           throw Error("Component name can contain only letters, numbers, hyphens, and underscores");
        //         }

        //       }
        //       if (childAlreadyHasNewNamespace) {
        //         if (childName === undefined && !childAlreadyHasNewNamespaceFromDoenetAttributes) {
        //           throw Error("Cannot create new namespace without defining a name");
        //         }
        //         child.doenetAttributes.alreadyHadNewNamespace = true;
        //       }

        //       if (!componentClass.preserveOriginalNamesWhenAssignChildrenNewNamespace) {
        //         child.doenetAttributes.createUniqueName = true;
        //       }

        //       child.doenetAttributes.newNamespace = true;


        //       // console.log(`assigNames`)
        //       // console.log(assignNames)
        //       // console.log(serializedComponent.componentType)
        //       // console.log(componentInfoObjects.allComponentClasses[
        //       //   serializedComponent.componentType.toLowerCase()
        //       // ].passThroughParentArrayAssignNames)


        //       // let assignNewNamespace = true;
        //       // if (child.parentHadArrayAssignNames) {
        //       //   assignNewNamespace = false;
        //       // } else if (serializedComponent.parentHadArrayAssignNames &&
        //       //   componentClass.passThroughParentArrayAssignNames
        //       // ) {
        //       //   assignNewNamespace = false;
        //       // }

        //       // if (assignNewNamespace) {
        //       //   child.doenetAttributes.newNamespace = true;
        //       // } else {
        //       //   // idea: don't create a new namespace (if not already specified)
        //       //   // when assignNames is an array, as that means that
        //       //   // the child will be creating namespaces of its children instead.

        //       //   if (childAlreadyHasNewNamespace) {
        //       //     child.doenetAttributes.newNamespace = childAlreadyHasNewNamespace;
        //       //   }
        //       // }

        //       // console.log(`newNamespace: ${child.doenetAttributes.newNamespace}`)
        //       // console.log(deepClone(child));


        //     }
        //   }
        // }



        // recurse on children
        if (!newNamespace) {
          createComponentNames({
            serializedState: serializedComponent.children,
            namespaceStack,
            componentInfoObjects,
            parentDoenetAttributes: doenetAttributes,
            parentName: componentName,
            usePreserializedNames,
            preserveFullTargetNamesOutsideNamespace,
          });
        } else {

          // if newNamespace, then need to make sure that assigned names
          // don't conflict with new names added,
          // so include in namesused
          let namesUsed = {};
          if (assignNames !== undefined) {
            flattenDeep(assignNames).forEach(x => namesUsed[x] = true);
          }


          let newNamespaceInfo = { namespace: prescribedName, componentCounts: {}, namesUsed };

          for (let [ind, child] of serializedComponent.children.entries()) {

            if (child.componentType === "tname") {
              createComponentNames({
                serializedState: [child],
                namespaceStack,
                componentInfoObjects,
                parentDoenetAttributes: doenetAttributes,
                parentName: componentName,
                usePreserializedNames,
                preserveFullTargetNamesOutsideNamespace,
                indOffset: ind,
              });
            } else {
              namespaceStack.push(newNamespaceInfo);
              createComponentNames({
                serializedState: [child],
                namespaceStack,
                componentInfoObjects,
                parentDoenetAttributes: doenetAttributes,
                parentName: componentName,
                usePreserializedNames,
                preserveFullTargetNamesOutsideNamespace,
                indOffset: ind,
              });
              namespaceStack.pop();
            }
          }
        }

      }
    }

  }

  return serializedState;

}

function convertComponentTarget({ allComponentClasses, componentType,
  serializedComponent, doenetAttributes, parentDoenetAttributes,
  namespaceStack, preserveFullTargetNamesOutsideNamespace,
}) {

  let level = namespaceStack.length - 1;

  let originalTarget = "";
  let stateVariableForTakingComponentName;
  let componentClass = allComponentClasses[componentType];

  if (componentClass.stateVariableForTakingComponentName) {
    if (serializedComponent.state && componentClass.stateVariableForTakingComponentName in serializedComponent.state) {
      stateVariableForTakingComponentName = componentClass.stateVariableForTakingComponentName;
    }
  }

  if (!stateVariableForTakingComponentName && serializedComponent.children === undefined) {
    // Can't find where originalTarget might be.
    // Check if this component is a reference shadow
    for (let key in serializedComponent.downstreamDependencies) {
      if (serializedComponent.downstreamDependencies[key].some(x => x.dependencyType === "referenceShadow")) {
        // Found reference shadow, nothing to do as presumably will get target
        // from the shadowed component
        return;
      }
    }
    throw Error(`Invalid location of a ${serializedComponent.componentType}.  Was it entered as a property?`)
  }


  if (doenetAttributes.originalTarget) {
    // component already has an original target,
    // which means it already had names created and the string child is a full target name
    // In this, we will ignore string child's value and use originalTarget
    // We use same algorithm for determining full target
    // as namespace may be different from when names were originally created
    originalTarget = doenetAttributes.originalTarget;
  }
  else if (parentDoenetAttributes && parentDoenetAttributes.originalTarget) {
    originalTarget = parentDoenetAttributes.originalTarget;
  }
  else if (stateVariableForTakingComponentName) {
    throw Error(`Have state variable for taking component name but original target not defined.`);
  }

  let stringChild;
  let targetFromStringChild;

  if (!stateVariableForTakingComponentName) {
    for (let child of serializedComponent.children) {
      if (child.componentType === "string") {
        stringChild = child;
        let target = child.state.value.trim();
        if (target === "") {
          continue;  // ignore strings that are only whitespace
        }
        // don't allow one to target names with __
        if (/__/.test(target)) {
          if (!preserveFullTargetNamesOutsideNamespace && !originalTarget) {
            throw Error("Invalid reference target: " + target);
          }
        }
        targetFromStringChild = target;
      }
    }
  }


  if (!doenetAttributes.originalTarget) {
    // save original copy target as doenetAttribute so that can use it
    // for an error message if we can't resolve it later
    doenetAttributes.originalTarget = targetFromStringChild;
  }

  console.log(`originalTarget: ${originalTarget}`)
  console.log(`targetFromStringChild: ${targetFromStringChild}`)

  let useOriginalTarget = true;
  if (preserveFullTargetNamesOutsideNamespace === null) {
    useOriginalTarget = false;
  } else if (preserveFullTargetNamesOutsideNamespace && targetFromStringChild) {
    let stringBegin = targetFromStringChild.substring(0, preserveFullTargetNamesOutsideNamespace.length);
    if (stringBegin !== preserveFullTargetNamesOutsideNamespace) {
      useOriginalTarget = false;
    }
  }

  console.log(`useOriginalTarget: ${useOriginalTarget}`)

  let target, fullTarget
  if (originalTarget && useOriginalTarget) {
    target = originalTarget;
  } else {
    target = targetFromStringChild;
  }

  console.log(`target: ${target}`)

  if (target) {
    // calculate full target from target
    // putting it into the context of the current namespace
    let lastLevel = level;
    if (target.substring(0, 1) === '/') {
      // if starts with /, then don't add anything to path
      lastLevel = 0;
      target = target.substring(1);
    }

    while (target.substring(0, 3) === '../') {
      // take off one level for every ../
      target = target.substring(3);
      lastLevel--;
    }

    if (lastLevel < 0) {
      // the target cannot possibly be valid
      // if there were more ../s than namespace levels
      throw Error("Target " + originalTarget + " not found");
    }

    fullTarget = '';
    for (let l = 0; l <= lastLevel; l++) {
      fullTarget += namespaceStack[l].namespace + '/';
    }
    fullTarget += target;
  }

  console.log(`fullTarget: ${fullTarget}`)

  if (stringChild) {
    stringChild.state.value = fullTarget;
  }
  else if (stateVariableForTakingComponentName) {
    serializedComponent.state[stateVariableForTakingComponentName] = fullTarget;
  }
}

export function serializedStateReplacer(key, value) {
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

export function serializedStateReviver(key, value) {
  return me.reviver(key, nanInfinityReviver(key, value))
}

export function gatherVariantComponents({ serializedState, componentTypesCreatingVariants, allComponentClasses }) {

  // a list of lists of variantComponents
  // where each component is a list of variantComponents 
  // of corresponding serializedComponent
  let variantComponents = [];

  for (let serializedComponent of serializedState) {
    let componentType = serializedComponent.componentType;

    if (componentType in componentTypesCreatingVariants) {
      if (serializedComponent.variants === undefined) {
        serializedComponent.variants = {};
      }
      serializedComponent.variants.isVariantComponent = true;
      variantComponents.push(serializedComponent);
    }
    // recurse on children
    if (serializedComponent.children !== undefined) {
      let descendantVariantComponents = gatherVariantComponents({
        serializedState: serializedComponent.children,
        componentTypesCreatingVariants,
        allComponentClasses,
      });

      if (descendantVariantComponents.length > 0) {
        if (serializedComponent.variants === undefined) {
          serializedComponent.variants = {};
        }

        // if one of children is a variantControl,
        // then component itself is considered a variantComponent
        let variantControlInd, variantControlChild;
        for (let [index, dvc] of descendantVariantComponents.entries()) {
          if (dvc.componentType === "variantcontrol") {
            variantControlInd = index;
            variantControlChild = dvc;
            break;
          }
        }
        if (variantControlInd !== undefined) {
          if (!serializedComponent.variants.isVariantComponent) {
            serializedComponent.variants.isVariantComponent = true;
            variantComponents.push(serializedComponent);
          }
          // delete variant control child from descendantVariantComponents
          descendantVariantComponents.splice(variantControlInd, 1);
        }

        serializedComponent.variants.descendantVariantComponents = descendantVariantComponents;

        if (!serializedComponent.variants.isVariantComponent) {
          variantComponents.push(...descendantVariantComponents)
        }

        // if have a variant control child
        // check if it specifies remove duplicates
        // if so, then attempt determine number of variants available
        if (variantControlChild !== undefined) {
          let uniquevariants = false;
          if (variantControlChild.state !== undefined &&
            variantControlChild.state.uniquevariants !== undefined) {
            uniquevariants = variantControlChild.state.uniquevariants;
          }
          if (variantControlChild.children !== undefined) {
            for (let child of variantControlChild.children) {
              if (child.componentType === "uniquevariants") {
                if (child.state !== undefined) {
                  if (child.state.implicitValue !== undefined) {
                    uniquevariants = child.state.implicitValue;
                  }
                  if (child.state.value !== undefined) {
                    uniquevariants = child.state.value;
                  }
                }
                if (child.children !== undefined) {
                  for (let grandchild of child.children) {
                    if (grandchild.componentType === "string") {
                      uniquevariants = grandchild.state.value;
                      break;
                    }
                  }
                }
              }
            }
          }
          if (typeof uniquevariants === "string") {
            if (["true", "t"].includes(uniquevariants.trim().toLowerCase())) {
              uniquevariants = true;
            } else {
              uniquevariants = false;
            }
          }

          if (uniquevariants) {
            serializedComponent.variants.uniquevariants = true;
            determineNumVariants({ serializedComponent, allComponentClasses });
          }
        }
      }
    }
  }

  return variantComponents;
}

export function determineNumVariants({ serializedComponent, allComponentClasses }) {
  let childVariantProduct = 1;
  if (serializedComponent.children !== undefined) {
    for (let child of serializedComponent.children) {
      if (child.variants !== undefined) {
        if (child.variants.isVariantComponent ||
          child.variants.descendantVariantComponents !== undefined) {
          let result = determineNumVariants({ serializedComponent: child, allComponentClasses });
          if (!result.success) {
            return { success: false }
          }
          childVariantProduct *= result.numberOfVariants;
        }
      }
    }
  }
  let numberOfVariants;

  if (serializedComponent.variants === undefined) {
    serializedComponent.variants = {};
  }

  let compClass = allComponentClasses[serializedComponent.componentType];
  if (compClass.determineNumberOfUniqueVariants !== undefined) {

    let result = compClass.determineNumberOfUniqueVariants({
      serializedComponent: serializedComponent,
    })
    if (!result.success) {
      return { success: false }
    }
    numberOfVariants = result.numberOfVariants;
    serializedComponent.variants.uniqueVariantData = result.uniqueVariantData;
  }
  if (numberOfVariants === undefined) {
    numberOfVariants = childVariantProduct;
    // serializedComponent.variants.uniqueVariantData = {
    //   numberOfVariantsByChild: numberOfVariantsByChild,
    // }
  }

  serializedComponent.variants.numberOfVariants = numberOfVariants;
  // console.log("For " + serializedComponent.componentType +
  //   " numberOfVariants is " + numberOfVariants)
  return { success: true, numberOfVariants: numberOfVariants }

}


export function removeNamespace(serializedState, namespace) {
  let spaceLength = namespace.length;
  let spacePrefixLength = namespace.lastIndexOf('/');
  for (let serializedComponent of serializedState) {
    let cName = serializedComponent.componentName;
    if (cName && cName.substring(0, spaceLength) === namespace) {
      serializedComponent.componentName
        = cName.substring(0, spacePrefixLength) + cName.substring(spaceLength);
      serializedComponent.nameBeforeRemovingNamespace = cName;
    }
    if (serializedComponent.children) {
      removeNamespace(serializedComponent.children, namespace);
    }
  }
}

export function processAssignNames({
  assignNames = [],
  serializedComponents,
  assignDirectlyToComposite,
  // componentTypeByTarget,
  // propVariableObjs,
  parentName,
  parentCreatesNewNamespace,
  componentInfoObjects,
  indOffset = 0,
  addEmpties = true,
  createEmptiesFunction,
  additionalArgsForEmptiesFunction,
  useSerializedNames = false,
}) {


  // if assignDirectlyToComposite and serializedComponents is a single composite
  // that asssigns names to replacements,
  // just give assignNames as attribute of the composite
  if (
    assignDirectlyToComposite &&
    serializedComponents.length === 1 &&
    componentInfoObjects.allComponentClasses[serializedComponents[0].componentType].assignNamesToReplacements
  ) {

    if (indOffset > 0) {
      console.error(`assigning name to composite directly with non-zero indOffset`)
    }

    if (!serializedComponents[0].doenetAttributes) {
      serializedComponents[0].doenetAttributes = {};
    }

    serializedComponents[0].doenetAttributes.assignNames = assignNames;

    addEmpties = false;

    assignNames = [];

    // return { serializedComponents };

  }

  let processedComponents = [];
  let emptiesToAdd = [];

  // if assignNames is longer than original number of compoments
  // will pad components with empties so that all names have a target
  let nComponents = serializedComponents.length;
  if (addEmpties) {
    nComponents = Math.max(assignNames.length - indOffset, nComponents)
  }

  for (let ind = 0; ind < nComponents; ind++) {

    let name = assignNames[ind + indOffset];
    let component = serializedComponents[ind];
    let componentTakesAssignNames = false;

    let addingEmpty = false;

    if (component === undefined) {
      if (createEmptiesFunction) {
        let empties = createEmptiesFunction({
          nEmptiesToAdd: 1,
          firstInd: ind + indOffset,
          assignNames, parentName, parentCreatesNewNamespace,
          componentInfoObjects,
          additionalArgs: additionalArgsForEmptiesFunction
        });
        component = empties[0];

      } else {
        component = {
          componentType: "empty"
        }
      }

      addingEmpty = true;
      componentTakesAssignNames = true;
    } else {
      componentTakesAssignNames = componentInfoObjects.allComponentClasses[
        component.componentType].assignNamesToReplacements;

    }

    if (!component.doenetAttributes) {
      component.doenetAttributes = {};
    }

    if (Array.isArray(name)) {
      if (componentTakesAssignNames) {

        component.doenetAttributes.assignNames = name;

        if (addingEmpty) {
          emptiesToAdd.push(component);
        } else {
          processedComponents.push(component);
        }

        // console.log(`assigned name ${name.toString()} to composite`)

        // if (component.doenetAttributes.newNamespace) {
        //   console.log(deepClone(component))
        //   // since we don't want to add an extra layer of namespaces
        //   // we need to undo that fact, since createComponentNames added it
        //   delete component.doenetAttributes.newNamespace;
        //   let componentName = component.componentName;
        //   if (!componentName) {
        //     componentName = component.preserializedName;
        //   }
        //   if (component.children) {
        //     removeNamespace(component.children, componentName);
        //   }
        // }

        // delete name
        delete component.componentName
        delete component.doenetAttributes.prescribedName
        delete component.preserializedName;


      } else {

        // TODO: what to do when try to assign names recursively to non-composite?
        console.warn(`Cannot assign names recursively to non-composites`)

        // for now, at least add empties so that names are created
        // and pass on component unchanged
        emptiesToAdd.push({
          componentType: "empty",
          doenetAttributes: { assignNames: name }
        })
        processedComponents.push(component);
      }

    } else {

      if (name === undefined) {
        if (useSerializedNames && component.componentName) {
          let lastInd = component.componentName.lastIndexOf("/");
          name = component.componentName.substring(lastInd + 1);
        } else {
          let longNameId = parentName + "|assignName|" + (ind + indOffset).toString();
          name = createUniqueName(component.componentType,
            longNameId);
        }
      }


      let originalNamespaceForComponentChildren;
      console.log(deepClone(component))
      // if (component.nameBeforeRemovingNamespace) {
      //   originalNamespaceForComponentChildren = component.nameBeforeRemovingNamespace;
      // } else 
      if (component.componentName) {
        originalNamespaceForComponentChildren = component.componentName;
      } else if (component.preserializedName) {
        originalNamespaceForComponentChildren = component.preserializedName;
      }
      if (originalNamespaceForComponentChildren && !component.doenetAttributes.newNamespace) {
        let lastSlash = originalNamespaceForComponentChildren.lastIndexOf('/');
        originalNamespaceForComponentChildren = originalNamespaceForComponentChildren.substring(0, lastSlash);
      }

      console.log(`originalNamespceForComponentChildren: ${originalNamespaceForComponentChildren}`)


      component.doenetAttributes.prescribedName = name;
      delete component.preserializedName;

      // if (!dontAddNewNamespace) {
      //   component.doenetAttributes.newNamespace = true;
      // }

      if (addingEmpty) {
        if (!createEmptiesFunction) {
          createComponentNamesFromParentName({
            parentName,
            ind: ind + indOffset,
            component,
            parentCreatesNewNamespace, componentInfoObjects,
            originalNamespaceForComponentChildren,
          });
        }
        emptiesToAdd.push(component);
      } else {
        createComponentNamesFromParentName({
          parentName,
          ind: ind + indOffset,
          component,
          parentCreatesNewNamespace, componentInfoObjects,
          originalNamespaceForComponentChildren
        });
        processedComponents.push(component);
      }

    }

  }


  if (emptiesToAdd.length > 0) {
    // if already have empties at the end without assignNames, just use those empties
    // rather than accumulating extra empties
    let haveAvailableExistingEmpties = false;
    if (processedComponents.length >= emptiesToAdd.length) {
      haveAvailableExistingEmpties = true;
      // make sure all components at the end are empties
      // that don't have a componentName or assignNames
      for (let component of processedComponents.slice(processedComponents.length - emptiesToAdd.length)) {
        if (component.componentType !== "empty") {
          haveAvailableExistingEmpties = false;
          break;
        }
        if (component.doenetAttributes) {
          if (component.doenetAttributes.assignNames) {
            haveAvailableExistingEmpties = false;
            break;
          }
          if (component.componentName) {
            // if componentName without namespace doesn't start with "__"
            // then the name was specified
            let lastSlash = component.componentName.lastIndexOf("/");
            if (component.componentName.substring(lastSlash + 1, lastSlash + 3) !== "__") {
              haveAvailableExistingEmpties = false;
              break;
            }
          }
        }
      }

    }

    if (haveAvailableExistingEmpties) {
      for (let [ind, component] of processedComponents.slice(processedComponents.length - emptiesToAdd.length).entries()) {
        if (!component.doenetAttributes) {
          component.doenetAttributes = {};
        }
        delete component.componentName;
        delete component.doenetAttributes.newNamespace;
        Object.assign(component.doenetAttributes, emptiesToAdd[ind].doenetAttributes)
      }
      emptiesToAdd = [];
    } else {
      processedComponents.push(...emptiesToAdd);
    }

  }

  return {
    serializedComponents: processedComponents,
    nEmptiesAdded: emptiesToAdd.length,
  };

}

export function createComponentNamesFromParentName({
  parentName, component,
  ind,
  parentCreatesNewNamespace, componentInfoObjects,
  originalNamespaceForComponentChildren,
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

  if (component.doenetAttributes.newNamespace) {
    if (component.children) {
      for (let child of component.children) {
        if (child.componentType === "tname") {
          if (!child.doenetAttributes) {
            child.doenetAttributes = {};
          }
          delete child.componentName;
          child.doenetAttributes.createUniqueName = true;
          delete child.preserializedName;
        }
      }
    }
  }

  // let originalNamespaceForComponentChildren = parentName;
  // if (!parentCreatesNewNamespace) {
  //   let lastSlash = parentName.lastIndexOf("/");
  //   namespaceForComponent = parentName.substring(0, lastSlash);
  // }

  console.log(deepClone(component))
  console.log(component.doenetAttributes.newNamespace)
  if (component.doenetAttributes.newNamespace) {
    createComponentNames({
      serializedState: [component],
      namespaceStack,
      componentInfoObjects,
      parentName,
      usePreserializedNames: true,
      preserveFullTargetNamesOutsideNamespace: originalNamespaceForComponentChildren,
      indOffset: ind,
    });
  }

  console.log(`result of create componentName`)
  console.log(deepClone(component))

}
