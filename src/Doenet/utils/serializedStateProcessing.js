import me from 'math-expressions';

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


export function doenetMLToSerializedState({ doenetML, includeBlankStrings = true, propertyClasses = {}, standardComponentTypes, allComponentClasses, init = true }) {
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
    if (!(startTag.tagType in standardComponentTypes) || startTag.tagType === "string") {
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
      let startTagClass = standardComponentTypes[startTag.tagType].class;

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
    let componentClass = standardComponentTypes[startTag.tagType].class;
    let includeBlankStringChildren = componentClass.includeBlankStringChildren === true;
    let definedProperties = Object.keys(componentClass.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
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
        standardComponentTypes,
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

export function createComponentsFromProps(serializedState, standardComponentTypes) {
  for (let component of serializedState) {
    // if there are any props of json that are componentTypes,
    // return array of children
    let newChildren = [];
    if (component.props) {
      for (let prop in component.props) {
        let propLower = prop.toLowerCase();
        if (standardComponentTypes[propLower] !== undefined) {
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
        } else if (!(propLower === "name" || propLower === "assignnames" || propLower === "assignnamespaces" || propLower === "newnamespace")) {
          throw Error("Invalid property " + prop);
        }
      }
      component.children.unshift(...newChildren);
    }

    //recurse on children
    if (component.children !== undefined) {
      createComponentsFromProps(component.children, standardComponentTypes);
    }
  }
}


function lowercaseDeep(arr1) {
  return arr1.map(val => Array.isArray(val) ? lowercaseDeep(val) : val.toLowerCase());
}

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

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
  componentTypesTakingComponentNames, allComponentClasses,
  nameSpaceForChildren, parentDoenetAttributes,
}) {

  if (namespaceStack.length === 0) {
    namespaceStack.push({ namespace: '', componentCounts: {}, namesUsed: {} });
  }
  let level = namespaceStack.length - 1;

  // console.log("createComponentNames " + level);
  // console.log(serializedState);
  // console.log(namespaceStack);

  let currentNamespace = namespaceStack[level];

  for (let serializedComponent of serializedState) {
    let componentType = serializedComponent.componentType;
    // don't name strings
    if (componentType === "string") {
      continue;
    }

    let doenetAttributes = serializedComponent.doenetAttributes;
    if (doenetAttributes === undefined) {
      doenetAttributes = serializedComponent.doenetAttributes = {};
    }


    let prescribedName = doenetAttributes.prescribedName;
    let assignNames = doenetAttributes.assignNames;
    let assignNamespaces = doenetAttributes.assignNamespaces;
    let newNamespace = doenetAttributes.newNamespace;


    if (!doenetAttributes.createdFromProperty) {

      let prescribedNameFromDoenetAttributes = prescribedName !== undefined;

      let props = serializedComponent.props;
      if (props === undefined) {
        props = serializedComponent.props = {};
      } else {
        // look for a property that matches name, assignNames, assignNamespaces, or newNamespace
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
          } else if (lowercaseKey === "assignnamespaces") {
            if (assignNamespaces === undefined) {
              assignNamespaces = props[key].split(",").map(x => x.trim());
              delete props[key];
            } else {
              throw Error("Cannot define assignNamespaces twice for a component");
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
        if (prescribedName !== undefined) {
          // name was specified
          // put it into doenetAttributes
          doenetAttributes.prescribedName = prescribedName;
          // change it to lowerCase
          prescribedName = prescribedName.toLowerCase();

          if (!prescribedNameFromDoenetAttributes) {
            if (!(/[a-z]/.test(prescribedName.substring(0, 1)))) {
              throw Error("Component name must begin with a letter");
            }
            if (!(/^[a-z0-9_-]+$/.test(prescribedName))) {
              throw Error("Component name can contain only letters, numbers, hypens, and underscores");
            }
          }
        } else if (doenetAttributes.createUniqueName) {

          let prescribedNameBase = "_unique_";
          let ind = 1;
          prescribedName = prescribedNameBase + ind;
          while (prescribedName in currentNamespace.namesUsed) {
            ind++;
            prescribedName = prescribedNameBase + ind;
          }
        }
        if (assignNames !== undefined) {
          if (assignNamespaces !== undefined) {
            throw Error("Cannot both include assignNames and assignNamespaces")
          }

          // assignNames was specified
          // change it to lower case
          assignNames = lowercaseDeep(assignNames);
          // put in doenetAttributes as assignNames array
          doenetAttributes.assignNames = assignNames;

          let flattedNames = flattenDeep(assignNames);
          for (let name of flattedNames) {
            if (!(/[a-z]/.test(name.substring(0, 1)))) {
              throw Error("All assigned names must begin with a letter");
            }
            if (!(/^[a-z0-9_-]+$/.test(name))) {
              throw Error("Assigned names can contain only letters, numbers, hyphens, and underscores");
            }
          }
          // check if unique names
          if (flattedNames.length !== new Set(flattedNames).size) {
            throw Error("Duplicate assigned names");
          }
        }
        if (assignNamespaces !== undefined) {
          // assignNamespaces was specified
          // change it to lower case
          assignNamespaces = assignNamespaces.map(x => x.toLowerCase());
          // put in doenetAttributes as assignNamespaces array
          doenetAttributes.assignNamespaces = assignNamespaces;

          for (let name of assignNamespaces) {
            if (!(/[a-z]/.test(name.substring(0, 1)))) {
              throw Error("All assigned namespaces must begin with a letter");
            }
            if (!(/^[a-z0-9_-]+$/.test(name))) {
              throw Error("Assigned namespaces can contain only letters, numbers, hypens, and underscores");
            }
          }
          // check if unique namespaces
          if (assignNamespaces.length !== new Set(assignNamespaces).size) {
            throw Error("Duplicate assigned namespaces");
          }
        }
        if (newNamespace) {
          // newNamespace was specified
          // put in doenetAttributes as boolean
          doenetAttributes.newNamespace = newNamespace;
          if (prescribedName === undefined) {
            throw Error("Cannot create new namespace without defining a name");
          }
        }

      }
    }

    if (componentType in componentTypesTakingComponentNames) {
      // find string child and convert it to full path name

      if (newNamespace) {
        namespaceStack.push({ namespace: prescribedName, componentCounts: {}, namesUsed: {} });
      }

      convertComponentTarget({
        allComponentClasses, componentType, serializedComponent,
        doenetAttributes, parentDoenetAttributes, namespaceStack
      });

      if (newNamespace) {
        namespaceStack.pop();
      }
    }


    // don't name components that were created from a property
    if (doenetAttributes.createdFromProperty) {
      continue;
    }


    let count = currentNamespace.componentCounts[componentType];
    if (count === undefined) {
      count = 0;
    }
    currentNamespace.componentCounts[componentType] = ++count;

    let componentName = '';
    for (let l = 0; l <= level; l++) {
      componentName += namespaceStack[l].namespace + '/';
    }
    if (prescribedName === undefined) {
      componentName += '_' + componentType + count;
    } else {
      componentName += prescribedName;
    }

    doenetAttributes.componentName = componentName;
    if (prescribedName !== undefined) {
      if (prescribedName in currentNamespace.namesUsed) {
        throw Error("Duplicate component name " + componentName)
      }
      currentNamespace.namesUsed[prescribedName] = true;
    }
    // if newNamespace is false,
    // then register assignNames or assignNamespaces as belonging to current namespace
    if (newNamespace !== true) {
      if (assignNames !== undefined) {
        for (let name of flattenDeep(assignNames)) {
          if (name in currentNamespace.namesUsed) {
            throw Error("Duplicate component name (from assignNames) " + componentName)
          }
          currentNamespace.namesUsed[name] = true;
        }
      } else if (assignNamespaces !== undefined) {
        for (let name of assignNamespaces) {
          if (name in currentNamespace.namesUsed) {
            throw Error("Duplicate component name (from assignNamespaces) " + componentName)
          }
          currentNamespace.namesUsed[name] = true;
        }
      }
    }


    if (serializedComponent.children !== undefined) {
      let componentClass = allComponentClasses[serializedComponent.componentType];

      if (nameSpaceForChildren) {
        namespaceStack.push({ namespace: nameSpaceForChildren, componentCounts: {}, namesUsed: {} });
        createComponentNames({
          serializedState: serializedComponent.children,
          namespaceStack,
          componentTypesTakingComponentNames,
          allComponentClasses,
          parentDoenetAttributes: doenetAttributes,
        });
        namespaceStack.pop();

      } else if (assignNamespaces === undefined && componentClass.assignNamespacesToChildrenOf === undefined) {
        if (assignNames === undefined && componentClass.assignNamesToAllChildrenExcept === undefined) {
          // recurse on child, creating new namespace if specified
          if (newNamespace !== true) {
            createComponentNames({
              serializedState: serializedComponent.children,
              namespaceStack,
              componentTypesTakingComponentNames,
              allComponentClasses,
              parentDoenetAttributes: doenetAttributes,
            });
          } else {
            namespaceStack.push({ namespace: prescribedName, componentCounts: {}, namesUsed: {} });
            createComponentNames({
              serializedState: serializedComponent.children,
              namespaceStack,
              componentTypesTakingComponentNames,
              allComponentClasses,
              parentDoenetAttributes: doenetAttributes,
            });
            namespaceStack.pop();
          }
        } else {
          // assignNames or componentClass.assignNamesToAllChildrenExcept is defined
          // look up class to see what children are assigned names
          let assignNamesToAllChildrenExcept = componentClass.assignNamesToAllChildrenExcept;
          let assignNamesToReplacements = componentClass.assignNamesToReplacements;
          if (!assignNamesToReplacements && assignNamesToAllChildrenExcept === undefined) {
            throw Error("Cannot assign names for component type " + serializedComponent.componentType);
          }

          for (let child of serializedComponent.children) {
            let assignChild = !assignNamesToReplacements && !assignNamesToAllChildrenExcept.includes(child.componentType);

            if (assignChild) {
              // for each child
              // 1. mark as giving a new namespace for its children
              // 2. if name exists, save it and then delete it
              // 3. mark it as requiring a unique name
              if (child.props === undefined) {
                child.props = {};
              }
              if (child.doenetAttributes === undefined) {
                child.doenetAttributes = {};
              }

              // look for name and newnamespace in child
              let childAlreadyHasNewNamespace = child.doenetAttributes.childAlreadyHasNewNamespace;
              let childName = child.doenetAttributes.prescribedName;

              for (let key in child.props) {
                let lowercaseKey = key.toLowerCase();
                if (lowercaseKey === "name") {
                  if (childName === undefined) {
                    childName = child.props[key];
                    delete child.props[key];
                  } else {
                    throw Error("Cannot define name twice for a component");
                  }
                } else if (lowercaseKey === "newnamespace") {
                  if (childAlreadyHasNewNamespace) {
                    throw Error("Cannot define newNamespace twice for a component");
                  }
                  if (child.props[key] === true || ["true", "t"].includes(child.props[key].trim().toLowerCase())) {
                    childAlreadyHasNewNamespace = true;
                  }
                  delete child.props[key];
                }

              }
              if (childName !== undefined) {
                child.doenetAttributes.prescribedName = childName;
                childName = childName.toLowerCase();

                if (!(/[a-z]/.test(childName.substring(0, 1)))) {
                  throw Error("Component name must begin with a letter");
                }
                if (!(/^[a-z0-9_-]+$/.test(childName))) {
                  throw Error("Component name can contain only letters, numbers, hyphens, and underscores");
                }

              }
              if (childAlreadyHasNewNamespace) {
                if (childName === undefined) {
                  throw Error("Cannot create new namespace without defining a name");
                }
                child.doenetAttributes.alreadyHadNewNamespace = true;
              }

              child.doenetAttributes.createUniqueName = true;
              child.doenetAttributes.newNamespace = true;
            }
          }


          // recurse on children
          if (newNamespace !== true) {
            createComponentNames({
              serializedState: serializedComponent.children,
              namespaceStack,
              componentTypesTakingComponentNames,
              allComponentClasses,
              parentDoenetAttributes: doenetAttributes,
            });
          } else {

            // if newNamespace, then need to make sure that assigned names
            // don't conflict with new names added,
            // so include in namesused
            let namesUsed = {};
            if (assignNames !== undefined) {
              flattenDeep(assignNames).forEach(x => namesUsed[x] = true);
            }

            namespaceStack.push({ namespace: prescribedName, componentCounts: {}, namesUsed: namesUsed });
            createComponentNames({
              serializedState: serializedComponent.children,
              namespaceStack,
              componentTypesTakingComponentNames,
              allComponentClasses,
              parentDoenetAttributes: doenetAttributes,
            });

            namespaceStack.pop();

          }

        }
      } else {
        // assignNamespaces or assignNamespacesToChildrenOf is defined
        // look up class to see what children are assigned namespaces
        let assignNamespacesToChildrenOf = componentClass.assignNamespacesToChildrenOf;
        if (assignNamespacesToChildrenOf === undefined) {
          throw Error("Cannot assign namespaces for component type " + serializedComponent.componentType);
        }
        let childrenAssigned = [];
        let childrenNotAssigned = [];
        for (let child of serializedComponent.children) {
          if (assignNamespacesToChildrenOf.includes(child.componentType)) {
            childrenAssigned.push(child);
          } else {
            childrenNotAssigned.push(child);
          }
        }

        let standinNamespace;

        if (assignNamespaces !== undefined) {
          standinNamespace = assignNamespaces[0]
        } else if (newNamespace) {
          // if new namespace, then we don't have to worry about colliding with
          // another _unique name
          standinNamespace = '__temp_unique_1';
        } else {
          // create a unique name from the component name
          let nameBase = prescribedName;
          if (nameBase === undefined) {
            nameBase = '_' + componentType + count;
          }
          standinNamespace = `__temp_${nameBase}_1`;
        }

        // recurse on children assign and not assigned namespace
        if (newNamespace !== true) {
          createComponentNames({
            serializedState: childrenNotAssigned,
            namespaceStack,
            componentTypesTakingComponentNames,
            allComponentClasses,
            parentDoenetAttributes: doenetAttributes,
          });

          // just use first assignedNamespace for the aliases
          // namespaceStack.push({ namespace: standinNamespace, componentCounts: {}, namesUsed: {} });
          createComponentNames({
            serializedState: childrenAssigned,
            namespaceStack,
            componentTypesTakingComponentNames,
            allComponentClasses,
            nameSpaceForChildren: standinNamespace,
            parentDoenetAttributes: doenetAttributes,
          });
          // namespaceStack.pop();

        } else {

          // if newNamespace, then need to make sure that assigned namespaces
          // don't conflict with new names added,
          // so include in namesused
          let namesUsed = {};
          if(assignNamespaces) {
            assignNamespaces.forEach(x => namesUsed[x] = true);
          }

          namespaceStack.push({ namespace: prescribedName, componentCounts: {}, namesUsed: namesUsed });
          createComponentNames({
            serializedState: childrenNotAssigned,
            namespaceStack,
            componentTypesTakingComponentNames,
            allComponentClasses,
            parentDoenetAttributes: doenetAttributes,
          });

          // namespaceStack.push({ namespace: standinNamespace, componentCounts: {}, namesUsed: {} });
          createComponentNames({
            serializedState: childrenAssigned,
            namespaceStack,
            componentTypesTakingComponentNames,
            allComponentClasses,
            nameSpaceForChildren: standinNamespace,
            parentDoenetAttributes: doenetAttributes,
          });
          // namespaceStack.pop();
          namespaceStack.pop();

        }
      }
    }

  }
}

function convertComponentTarget({ allComponentClasses, componentType,
  serializedComponent, doenetAttributes, parentDoenetAttributes,
  namespaceStack
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
    for(let key in serializedComponent.downstreamDependencies) {
      if(serializedComponent.downstreamDependencies[key].dependencyType === "referenceShadow") {
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
    throw Error(`Have state variable for taking component name but original target defined.`);
  }

  let stringChild;
  if (!stateVariableForTakingComponentName) {
    for (let child of serializedComponent.children) {
      if (child.componentType === "string") {
        stringChild = child;
        let target;
        if (!originalTarget) {
          target = child.state.value.trim();
          if (target === "") {
            continue;  // ignore strings that are only whitespace
          }
          // don't allow one to ref names with __
          if (/__/.test(target)) {
            throw Error("Invalid reference target: " + target);
          }
          originalTarget = target;
        }
      }
    }
  }

  let fullTarget;

  if (originalTarget) {

    // save original ref target as doenetAttribute so that can use it
    // for an error message if we can't resolve it later
    doenetAttributes.originalTarget = originalTarget;

    // calculate full target from original target
    // putting it into the context of the current namespace
    let target = originalTarget;
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
    fullTarget = fullTarget.toLowerCase();
  }

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
