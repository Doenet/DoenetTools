
export function replaceIncompleteProp({activeChildrenPieces, allComponentClasses}) {

  let propChild = activeChildrenPieces[0][0];
  let childnumberChild = activeChildrenPieces[1][0];
  let sourceChildren = activeChildrenPieces[2];
  let componentsChildren = activeChildrenPieces[3];


  // separate result for each piece
  let resultsByPiece = [{},{},{}];
  if(componentsChildren !== undefined) {
    resultsByPiece.push({});
  }

  // we don't actually change the children
  for(let ind in activeChildrenPieces) {
    resultsByPiece[ind].newChildren = activeChildrenPieces[ind].map(x=> ({
      createdComponent: true,
      componentName: x.componentName,
    }));
  }


  let authorProp = propChild.state.authorProp.toLowerCase();

  // if authorProp is childnumber, it's a special case
  // don't need to know anything about component, just make variable name be childnumber

  if(authorProp === "childnumber") {

    let propChanges = {
      activeChildrenMatched: [propChild.state.stringChild],
    };

    propChanges.newChildren = [{
      componentType: 'authorprop',
      children: [{
        createdComponent: true,
        componentName: propChild.state.stringChild.componentName,
      }]
    },{
      componentType: 'variablename',
      state: {value: "childnumber"}
    }];

    resultsByPiece[0].childChanges = {
      [propChild.componentName]: propChanges
    }

    return {
      success: true,
      resultsByPiece: resultsByPiece,
    }
  }

  // to determine prop, only look at first source child
  if(sourceChildren.length === 0) {
    // can't determine prop if don't have a source child
    return {success: false}
  }

  // if source children correspond to a single reftarget
  // then replace source children with the target component
  let sourceChild = sourceChildren[0]
  if(sourceChildren.length === 1) {
    if(sourceChild.componentType === "reftarget") {
      if(sourceChild.unresolvedState.refTarget) {
        return {success: false};
      }
      sourceChild = sourceChild.state.refTarget;
    }
  }

  if(componentsChildren !== undefined) {
    // we are inside a collect, which means that we want to find
    // a descendant of sourceChild[0] that is type given by componentsChildren

    let componentsChild = componentsChildren[0];
    let componentTypesToCollect = componentsChild.state.texts;

    if(componentTypesToCollect.length === 0) {
      throw Error("Cannot collect prop " + propChild.state.authorProp + " when don't have components.")
    }

    let componentClassesToCollect = [];
    for(let ct of componentTypesToCollect) {
      let cClass = allComponentClasses[ct];
      if(cClass === undefined) {
        let message = "Cannot collect component type " + ct + ". Class not found.";
        throw Error(message);
      }else {
        componentClassesToCollect.push(cClass);
      }
    }

    sourceChild = collectFirstComponentDescendants(sourceChild, componentClassesToCollect)

    if(sourceChild === undefined) {
      throw Error("Cannot collect prop " + propChild.state.authorProp + " when don't have matching components.")
    }
  }

  if(childnumberChild !== undefined) {
    let childIndex = childnumberChild.state.number-1;
    if(Number.isInteger(childIndex) && childIndex >= 0 && childIndex < sourceChild.activeChildren.length) {
      sourceChild = sourceChild.activeChildren[childIndex];
    }else {
      console.warn("Invalid childnumber " + childnumberChild.state.number);
      return {success: false}
    }
  }

  // if sourceChild is a ref or extract with at least one replacement
  // use its replacement instead
  while((sourceChild.componentType === "ref" || sourceChild.componentType === "extract")) {
    if(sourceChild.replacements.length >= 1) {
      sourceChild = sourceChild.replacements[0];
    }else {
      return {success: false}
    }
  }

  let result = completeProp({
    authorProp: authorProp,
    component: sourceChild,
  })

  if(result.success !== true) {
    // go back to propChild to retain case of authorProp
    console.warn("Invalid prop " + propChild.state.authorProp + " for component type " + sourceChild.componentType);
    return {success: false};
  }

  let propChanges = {
    activeChildrenMatched: [propChild.state.stringChild],
  };

  propChanges.newChildren = [{
    componentType: 'authorprop',
    children: [{
      createdComponent: true,
      componentName: propChild.state.stringChild.componentName,
    }]
  },{
    componentType: 'variablename',
    state: {value: result.variableName}
  }];

  if(result.additionalChildren) {
    propChanges.newChildren.push(...result.additionalChildren);
  }

  resultsByPiece[0].childChanges = {
    [propChild.componentName]: propChanges
  }

  return {
    success: true,
    resultsByPiece: resultsByPiece,
  }
}

function completeProp({authorProp, component}) {

  let componentState = component._state;
  
  let propStateVariable = componentState[authorProp];
  
  // if prop didn't exist, check to see if it refers to an array component
  if(propStateVariable === undefined) {
    if(component.arrayEntries !== undefined) {
      for(let entryName in component.arrayEntries) {
        if(authorProp.slice(0,entryName.length) === entryName) {
          let arrayEntry = component.arrayEntries[entryName];
          let arrayStateVariable = componentState[arrayEntry.arrayVariableName];
          if(arrayStateVariable === undefined || arrayStateVariable.isArray !== true) {
            continue;
          }
          let indexString = authorProp.slice(entryName.length);
          let additionalChildren = arrayEntry.getSugarReplacement(indexString);

          if(additionalChildren !== undefined) {
            return {
              success: true,
              variableName: arrayEntry.arrayVariableName,
              additionalChildren: additionalChildren,
            }
          }
        }
      }
    }
    return {success: false};
  }else {
    // if propStateVariable initially was defined,
    // check if it is an alias or an alias to an array entry
    if(propStateVariable.isAlias === true) {
      if(propStateVariable.aliasArrayIndex === undefined) {
        // alias to another prop.
        // just change prop to new value if target is
        // a public state variable
        let targetStateVariable = componentState[propStateVariable.aliasTargetName];
        if(targetStateVariable !== undefined &&
          targetStateVariable.public === true &&
          targetStateVariable.componentType !== undefined
        ) {
          return {
            success: true,
            variableName: propStateVariable.aliasTargetName,
          }
        }
      }else {
        // alias to an array entry
        let arrayEntry = component.arrayEntries[propStateVariable.aliasTargetName];
        let arrayStateVariable = componentState[arrayEntry.arrayVariableName];
        if(arrayStateVariable.isArray === true) {
          let additionalChildren = arrayEntry.getSugarReplacement(propStateVariable.aliasArrayIndex);
          if(additionalChildren !== undefined) {
            return {
              success: true,
              variableName: arrayEntry.arrayVariableName,
              additionalChildren: additionalChildren,
            }
          }
        }
      }

      // invalid alias
      return {success: false};
    }

    return {
      success: true,
      variableName: authorProp
    }
  }

}


function collectFirstComponentDescendants(component, componentClassesToCollect) {

  if(component.inactive) {
    return;
  }
  if(componentClassesToCollect.some(x => component instanceof x)) {
    return component;
  }

  for(let childName in component.allChildren) {
    let child = component.allChildren[childName].component;
    let collected = collectFirstComponentDescendants(child,componentClassesToCollect);
    // stop after found first one
    if(collected !== undefined) {
      return collected;
    }
  }
  if(component.replacements) {
    for(let replacement of component.replacements) {
      // don't need to check if replacement is withheld, as it will be inactive
      let collected = collectFirstComponentDescendants(replacement,componentClassesToCollect);
      // stop after found first one
      if(collected !== undefined) {
        return collected;
      }
    }
  }

  // TODO: have a concept of components available
  // for cases such as points or cells available in a spreadsheet
  // even though they aren't actual component


}