export function gatherDescendants({ ancestor, descendantClasses,
  recurseToMatchedChildren = true,
  useReplacementsForComposites = false, compositeClass,
  includeNonActiveChildren = false,
  includePropertyChildren = false,
  skipOverAdapters = false,
  ignoreReplacementsOfMatchedComposites = false,
  definingChildrenFirst = false,
  namesToIgnore = [],
  init = true
}) {

  let childrenToCheck = [];

  if (useReplacementsForComposites && ancestor instanceof compositeClass) {
    if (init) {
      // if not init, parent will also be checked.
      // Since replacements will be children of parent,
      // don't need to gather them here
      childrenToCheck.push(...replacementsForComposites({
        composite: ancestor,
        compositeClass,
        includeComposites: includeNonActiveChildren,
      }))
    }

  } else {

    if (includeNonActiveChildren && definingChildrenFirst) {
      // add defining children in order
      for (let child of ancestor.definingChildren) {
        if (includePropertyChildren || !child.componentIsAProperty) {
          childrenToCheck.push(child);
        }
      }
    }


    // first add active children in order
    if (ancestor.activeChildren) {
      for (let child of ancestor.activeChildren) {
        if (includePropertyChildren || !child.componentIsAProperty) {
          if (!childrenToCheck.map(x => x.componentName).includes(child.componentName)) {
            childrenToCheck.push(child);
          }
        }
      }
    }

    if (includeNonActiveChildren) {
      if (!definingChildrenFirst) {
        // add any non-active defining children in order
        for (let child of ancestor.definingChildren) {
          if (includePropertyChildren || !child.componentIsAProperty) {
            if (!childrenToCheck.map(x => x.componentName).includes(child.componentName)) {
              childrenToCheck.push(child);
            }
          }
        }
      }

      // add any other children
      if (ancestor.allChildren) {
        for (let childName in ancestor.allChildren) {
          let childObj = ancestor.allChildren[childName];
          if (childObj.definingChildrenIndex === undefined && childObj.activeChildrenIndex === undefined) {
            let child = childObj.component;
            if (includePropertyChildren || !child.componentIsAProperty) {
              childrenToCheck.push(child);
            }
          }
        }
      }
    }
  }

  if (ignoreReplacementsOfMatchedComposites) {
    // first check if have matched any composites, so can ignore their replacements
    for (let child of childrenToCheck) {
      let matchedChild = descendantClasses.some(x => child instanceof x);
      if (matchedChild && child instanceof compositeClass) {
        namesToIgnore = [
          ...namesToIgnore,
          ...replacementsForComposites({
            composite: child, compositeClass, includeComposites: true
          }).map(x => x.componentName)
        ]
      }
    }

  }

  if (skipOverAdapters) {
    for (let [ind, child] of childrenToCheck.entries()) {
      if (child.adaptedFrom && !namesToIgnore.includes(child.componentName)) {
        // found an adapter

        namesToIgnore = [
          ...namesToIgnore,
          child.componentName
        ];


        let adaptedLocation = childrenToCheck.map(x => x.componentName).indexOf(child.adaptedFrom.componentName);
        if (adaptedLocation === -1) {
          // if adapted component isn't in childrenToCheck
          // then replace adapter with adapted component
          childrenToCheck.splice(ind, 1, child.adaptedFrom);
        } else {
          // if both adapter and adapted component are in childrenToCheck, then
          // as long as the adapted component isn't a defining child
          // with definingChildrenFirst 
          // (in which case the adapted component would already be in the right spot)
          // switch the locations of the adapted component and the adapter
          // Rationale: the adapter is in the location that one would expect

          if (!(definingChildrenFirst && ancestor.definingChildren
            .map(x => x.componentName).includes(child.adaptedFrom.componentName)
          )) {
            // swap locations
            childrenToCheck.splice(ind, 1, child.adaptedFrom);
            childrenToCheck.splice(adaptedLocation, 1, child);
          }
        }

      }
    }
  }

  if (namesToIgnore.length > 0) {
    childrenToCheck = childrenToCheck.filter(x => !namesToIgnore.includes(x.componentName));
  }

  let descendants = [];
  let replacementsNamesOfMatchedComposites = [];

  for (let child of childrenToCheck) {
    let matchedChild = descendantClasses.some(x => child instanceof x);
    if (matchedChild) {
      descendants.push(child.componentName);
    }

    if (!matchedChild || recurseToMatchedChildren) {
      // recurse
      let additionalDescendants = gatherDescendants({
        ancestor: child,
        descendantClasses, recurseToMatchedChildren,
        useReplacementsForComposites, compositeClass,
        includeNonActiveChildren,
        includePropertyChildren,
        skipOverAdapters,
        ignoreReplacementsOfMatchedComposites,
        definingChildrenFirst,
        init: false,
      });
      descendants.push(...additionalDescendants);
    }
  }

  if (ignoreReplacementsOfMatchedComposites) {
    descendants = descendants.filter(x => !replacementsNamesOfMatchedComposites.includes(x))
  }

  return descendants;
}


function replacementsForComposites({ composite, compositeClass, includeComposites = false }) {

  let replacements = [];

  if (composite.replacements) {
    let originalReplacements;
    if (composite.replacementsToWithhold) {
      let numReplacements = composite.replacements.length - composite.replacementsToWithhold;
      originalReplacements = composite.replacements.slice(0, numReplacements);
    } else {
      originalReplacements = composite.replacements;
    }

    for (let replacement of originalReplacements) {
      if (replacement instanceof compositeClass) {
        if (includeComposites) {
          replacements.push(replacement);
        }
        replacements.push(...replacementsForComposites({ composite: replacement, compositeClass, includeComposites }))
      } else {
        replacements.push(replacement)
      }
    }

  }

  return replacements;

}