
export function postProcessCopy({ serializedComponents, componentName, addShadowDependencies = true }) {
  // add downstream dependencies to original component
  // put internal and external references in right form

  let preserializedNamesFound = {};
  let targetNamesFound = {};

  postProcessCopySub({
    serializedComponents,
    preserializedNamesFound, targetNamesFound,
    componentName, addShadowDependencies,
  });

  for (let targetName in targetNamesFound) {

    for (let targetComponent of targetNamesFound[targetName]) {
      // change state variable targetName to the componentName
      // in case below doesn't work (i.e., have more than 1 replacement)
      for (let child of targetComponent.children) {
        if (child.componentType === "tname") {
          child.state.targetName = targetName;
          break;
        }
      }

    }

  }

  return serializedComponents;

}


function postProcessCopySub({ serializedComponents, preserializedNamesFound,
  targetNamesFound, componentName, addShadowDependencies = true }) {
  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - collect names and tnames

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

    if (component.preserializedName) {

      preserializedNamesFound[component.preserializedName] = component;

      if (addShadowDependencies) {
        let downDep = {
          [component.preserializedName]: [{
            dependencyType: "referenceShadow",
            compositeName: componentName,
          }]
        };
        if (component.state) {
          let stateVariables = Object.keys(component.state);
          downDep[component.preserializedName].downstreamStateVariables = stateVariables;
          downDep[component.preserializedName].upstreamStateVariables = stateVariables;
        }
        if (component.includeAnyDefiningChildren) {
          downDep[component.preserializedName].includeAnyDefiningChildren =
            component.includeAnyDefiningChildren;
        }
        if (component.includePropertyChildren) {
          downDep[component.preserializedName].includePropertyChildren =
            component.includePropertyChildren;
        }

        // create downstream dependency
        component.downstreamDependencies = downDep;
      }

    }

    if (component.componentType === "copy") {
      let targetName = component.targetComponentName;
      if (!targetName) {
        // if targetComponentName is undefined,
        // then the copy wasn't serialized via copy's serialize function
        // e.g., directly have a serialized copy from a select
        // in this case, just find copy target by looking at component
        // (and normalizing the form to have a tname child at same time)
        targetName = normalizeSerializedCopy(component);

      }
      if (targetName) {
        if (!targetNamesFound[targetName]) {
          targetNamesFound[targetName] = [];
        }
        targetNamesFound[targetName].push(component);
      }
    }

    // recursion
    postProcessCopySub({
      serializedComponents: component.children,
      preserializedNamesFound,
      targetNamesFound,
      componentName,
      addShadowDependencies,
    });

    if (component.replacements) {
      postProcessCopySub({
        serializedComponents: component.replacements,
        preserializedNamesFound,
        targetNamesFound,
        componentName,
        addShadowDependencies,
      });
    }

  }
}



export function normalizeSerializedCopy(serializedCopy) {

  let targetName;

  // find the tname child
  let tnameChild;
  for (let child of serializedCopy.children) {
    if (child.componentType === "tname") {
      tnameChild = child;
      break;
    }
  }
  // if no tnameChild, then check for string child
  // which we have to do since sugar may not have been applied
  if (!tnameChild) {
    for (let childInd = 0; childInd < serializedCopy.children.length; childInd++) {
      let child = serializedCopy.children[childInd];
      if (child.componentType === "string") {
        targetName = child.state.value;

        // delete the string child and create a tname child
        serializedCopy.children[childInd] = {
          componentType: "tname",
          state: { targetName: targetName }
        }
      }
    }
  } else {
    // found a tnameChild

    // first look to see if targetName is defined in state
    if (tnameChild.state) {
      targetName = tnameChild.state.targetName;
    }

    // if not, look for first string child
    if (!targetName && tnameChild.children) {
      for (let childInd = 0; childInd < tnameChild.children.length; childInd++) {
        let child = tnameChild.children[childInd];
        if (child.componentType === "string") {
          targetName = child.state.value;

          // for consistency, we'll change the form of the tname
          // so that the targetName is stored in state
          // rather than child.
          // That way, we don't have to deal with cases
          // when processing the copies
          tnameChild.children.splice(childInd, 1); // delete child
          childInd--;
          if (!tnameChild.state) {
            tnameChild.state = {};
          }
          tnameChild.state.targetName = targetName; // store in state
        }
      }
    }
  }

  return targetName;
}
