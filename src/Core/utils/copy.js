import { getUniqueIdentifierFromBase } from "./naming";

export function postProcessCopy({ serializedComponents, componentName,
  addShadowDependencies = true, uniqueIdentifiersUsed, identifierPrefix = ""
}) {
  // add downstream dependencies to original component

  postProcessCopySub({
    serializedComponents,
    componentName, addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
  });

  return serializedComponents;

}


function postProcessCopySub({ serializedComponents,
  componentName, addShadowDependencies = true,
  uniqueIdentifiersUsed = [], identifierPrefix = ""
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
        if (component.state) {
          let stateVariables = Object.keys(component.state);
          downDep[component.originalName].downstreamStateVariables = stateVariables;
          downDep[component.originalName].upstreamStateVariables = stateVariables;
        }
        if (component.includeAnyDefiningChildren) {
          downDep[component.originalName].includeAnyDefiningChildren =
            component.includeAnyDefiningChildren;
        }
        if (component.includePropertyChildren) {
          downDep[component.originalName].includePropertyChildren =
            component.includePropertyChildren;
        }

        // create downstream dependency
        component.downstreamDependencies = downDep;
      }

    } else {
      uniqueIdentifierBase = identifierPrefix + component.componentType + "|shadowUnnamed";
    }

    component.uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

    // recursion
    postProcessCopySub({
      serializedComponents: component.children,
      componentName,
      addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
    });

    if (component.replacements) {
      postProcessCopySub({
        serializedComponents: component.replacements,
        componentName,
        addShadowDependencies, uniqueIdentifiersUsed, identifierPrefix,
      });
    }

  }
}

