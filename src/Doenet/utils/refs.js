
export function postProcessRef({ serializedComponents, componentName, addShadowDependencies = true }) {
  // add downstream dependencies to original component
  // put internal and external references in right form

  let preserializedNamesFound = {};
  let refTargetNamesFound = {};

  postProcessRefSub({
    serializedComponents,
    preserializedNamesFound, refTargetNamesFound,
    componentName, addShadowDependencies,
  });

  for (let refTargetName in refTargetNamesFound) {

    for (let refComponent of refTargetNamesFound[refTargetName]) {
      // change state variable refTargetName to the componentName
      // in case below doesn't work (i.e., have more than 1 replacement)
      for (let child of refComponent.children) {
        if (child.componentType === "reftarget") {
          child.state.refTargetName = refTargetName;
          break;
        }
      }

    }

  }

  return serializedComponents;

}


function postProcessRefSub({ serializedComponents, preserializedNamesFound,
  refTargetNamesFound, componentName, addShadowDependencies = true }) {
  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - collect names and reference targets

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

    if (component.preserializedName) {

      preserializedNamesFound[component.preserializedName] = component;

      if (addShadowDependencies) {
        let downDep = {
          [component.preserializedName]: [{
            dependencyType: "referenceShadow",
            refComponentName: componentName,
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

    if (component.componentType === "ref") {
      let refTargetName = component.refTargetComponentName;
      if (!refTargetName) {
        // if refTargetComponentName is undefined,
        // then the ref wasn't serialized via ref's serialize function
        // e.g., directly have a serialized ref from a select
        // in this case, just find ref target by looking at component
        // (and normalizing the form to have a reftarget child at same time)
        refTargetName = normalizeSerializedRef(component);

      }
      if (refTargetName) {
        if (!refTargetNamesFound[refTargetName]) {
          refTargetNamesFound[refTargetName] = [];
        }
        refTargetNamesFound[refTargetName].push(component);
      }
    }

    // recursion
    postProcessRefSub({
      serializedComponents: component.children,
      preserializedNamesFound,
      refTargetNamesFound,
      componentName,
      addShadowDependencies,
    });

    if (component.replacements) {
      postProcessRefSub({
        serializedComponents: component.replacements,
        preserializedNamesFound,
        refTargetNamesFound,
        componentName,
        addShadowDependencies,
      });
    }

  }
}



export function normalizeSerializedRef(serializedRef) {

  let refTargetName;

  // find the refTarget child
  let refTargetChild;
  for (let child of serializedRef.children) {
    if (child.componentType === "reftarget") {
      refTargetChild = child;
      break;
    }
  }
  // if no refTargetChild, then check for string child
  // which we have to do since sugar may not have been applied
  if (!refTargetChild) {
    for (let childInd = 0; childInd < serializedRef.children.length; childInd++) {
      let child = serializedRef.children[childInd];
      if (child.componentType === "string") {
        refTargetName = child.state.value;

        // delete the string child and create a refTarget child
        serializedRef.children[childInd] = {
          componentType: "reftarget",
          state: { refTargetName: refTargetName }
        }
      }
    }
  } else {
    // found a refTargetChild

    // first look to see if refTargetName is defined in state
    if (refTargetChild.state) {
      refTargetName = refTargetChild.state.refTargetName;
    }

    // if not, look for first string child
    if (!refTargetName && refTargetChild.children) {
      for (let childInd = 0; childInd < refTargetChild.children.length; childInd++) {
        let child = refTargetChild.children[childInd];
        if (child.componentType === "string") {
          refTargetName = child.state.value;

          // for consistency, we'll change the form of the reftarget
          // so that the refTargetName is stored in state
          // rather than child.
          // That way, we don't have to deal with cases
          // when processing the refs
          refTargetChild.children.splice(childInd, 1); // delete child
          childInd--;
          if (!refTargetChild.state) {
            refTargetChild.state = {};
          }
          refTargetChild.state.refTargetName = refTargetName; // store in state
        }
      }
    }
  }

  return refTargetName;
}
