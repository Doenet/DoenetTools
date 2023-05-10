export function gatherDescendants({
  ancestor,
  descendantTypes,
  recurseToMatchedChildren = true,
  useReplacementsForComposites = false,
  includeNonActiveChildren = false,
  skipOverAdapters = false,
  ignoreReplacementsOfMatchedComposites = false,
  ignoreReplacementsOfEncounteredComposites = false,
  init = true,
  componentInfoObjects,
}) {
  // Note: ignoreReplacementsOfEncounteredComposites means ignore replacements
  // of all composites except copies of external content

  let matchChildToTypes = (child) =>
    descendantTypes.some((ct) =>
      componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: child.componentType,
        baseComponentType: ct,
      }),
    );

  let childrenToCheck = [];

  if (
    useReplacementsForComposites &&
    componentInfoObjects.isInheritedComponentType({
      inheritedComponentType: ancestor.componentType,
      baseComponentType: "_composite",
    })
  ) {
    if (init) {
      // if not init, parent will also be checked.
      // Since replacements will be children of parent,
      // don't need to gather them here
      childrenToCheck.push(
        ...replacementsForComposites({
          composite: ancestor,
          componentInfoObjects,
          includeComposites: includeNonActiveChildren,
        }).filter((x) => typeof x === "object"),
      );
    }
  } else {
    // add children in the order of allChildren ordered
    for (let childName of ancestor.allChildrenOrdered) {
      let childObj = ancestor.allChildren[childName];
      let child;
      let childIsActive = false;
      let childIsAdapter = false;
      if (childObj) {
        child = childObj.component;
        if (child.adaptedFrom) {
          childIsAdapter = true;
        }
        if (ancestor.activeChildren.includes(child)) {
          childIsActive = true;
        }
      } else {
        // must have a placeholder
        // look in activeChildren
        // include the placedholders adapted into the activeChildren
        for (let aChild of ancestor.activeChildren) {
          if (aChild.placeholderInd === childName) {
            child = aChild;
            childIsActive = true;
            if (
              typeof childName === "string" &&
              childName.substring(childName.length - 5, childName.length) ===
                "adapt"
            ) {
              childIsAdapter = true;
            }
            break;
          } else if (
            aChild.adaptedFrom &&
            achild.adaptedFrom.placeholderInd === childName
          ) {
            child = aChild.adaptedFrom;
            break;
          }
        }
      }

      if (child) {
        if (childIsAdapter && skipOverAdapters) {
          if (!childrenToCheck.includes(child.adaptedFrom)) {
            childrenToCheck.push(child.adaptedFrom);
          }
        } else if (childIsActive || includeNonActiveChildren) {
          childrenToCheck.push(child);
        }
      }
    }
  }

  if (
    ignoreReplacementsOfMatchedComposites ||
    ignoreReplacementsOfEncounteredComposites
  ) {
    // first check if have matched any composites, so can ignore their replacements
    let namesToIgnore = [];
    for (let child of childrenToCheck) {
      let checkChildForReplacements = matchChildToTypes(child);
      if (
        ignoreReplacementsOfEncounteredComposites &&
        !checkChildForReplacements
      ) {
        // we explicitly will not ignore replacements of copies of external content
        checkChildForReplacements = !(
          child.componentType === "copy" && child.doenetAttributes.copiedURI
        );
      }
      if (
        checkChildForReplacements &&
        componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: child.componentType,
          baseComponentType: "_composite",
        })
      ) {
        namesToIgnore = [
          ...namesToIgnore,
          ...replacementsForComposites({
            composite: child,
            componentInfoObjects,
            includeComposites: true,
          })
            .filter((x) => typeof x === "object")
            .map((x) => (x.componentName ? x.componentName : x.placeholderInd)),
        ];
      }
    }

    if (namesToIgnore.length > 0) {
      childrenToCheck = childrenToCheck.filter(
        (x) =>
          !(
            namesToIgnore.includes(x.componentName) ||
            namesToIgnore.includes(x.placeholderInd)
          ),
      );
    }
  }

  let descendants = [];

  for (let child of childrenToCheck) {
    let matchedChild = matchChildToTypes(child);
    if (matchedChild) {
      descendants.push({
        componentName: child.componentName
          ? child.componentName
          : child.placeholderInd,
        componentType: child.componentType,
      });
    }

    if (
      (!matchedChild || recurseToMatchedChildren) &&
      child.placeholderInd === undefined
    ) {
      // recurse
      let additionalDescendants = gatherDescendants({
        ancestor: child,
        descendantTypes,
        recurseToMatchedChildren,
        useReplacementsForComposites,
        includeNonActiveChildren,
        skipOverAdapters,
        ignoreReplacementsOfMatchedComposites,
        ignoreReplacementsOfEncounteredComposites,
        init: false,
        componentInfoObjects,
      });
      descendants.push(...additionalDescendants);
    }
  }

  return descendants;
}

function replacementsForComposites({
  composite,
  includeComposites = false,
  componentInfoObjects,
}) {
  let replacements = [];

  if (composite.replacements) {
    let originalReplacements;
    if (composite.replacementsToWithhold) {
      let numReplacements =
        composite.replacements.length - composite.replacementsToWithhold;
      originalReplacements = composite.replacements.slice(0, numReplacements);
    } else {
      originalReplacements = composite.replacements;
    }

    for (let replacement of originalReplacements) {
      if (
        componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: replacement.componentType,
          baseComponentType: "_composite",
        })
      ) {
        if (includeComposites) {
          replacements.push(replacement);
        }
        replacements.push(
          ...replacementsForComposites({
            composite: replacement,
            componentInfoObjects,
            includeComposites,
          }),
        );
      } else {
        replacements.push(replacement);
      }
    }
  }

  return replacements;
}

export function ancestorsIncludingComposites(comp, components) {
  if (comp.ancestors === undefined || comp.ancestors.length === 0) {
    return [];
  }

  let comps = [comp.ancestors[0].componentName];

  let parent = components[comp.ancestors[0].componentName];
  if (parent) {
    comps.push(...ancestorsIncludingComposites(parent, components));
  }

  if (comp.replacementOf) {
    comps.push(comp.replacementOf.componentName);
    let replacementAs = ancestorsIncludingComposites(
      comp.replacementOf,
      components,
    );
    for (let a of replacementAs) {
      if (!comps.includes(a)) {
        comps.push(a);
      }
    }
  }

  return comps;
}
