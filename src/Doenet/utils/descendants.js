export function gatherDescendants({ ancestor, descendantClasses,
  recurseToMatchedChildren = true,
  useReplacementsForComposites = false, compositeClass,
  includeNonActiveChildren = false,
  includePropertyChildren = false,
  init = true
}) {

  let childrenToCheck = [];

  if (useReplacementsForComposites && ancestor instanceof compositeClass) {
    if (init) {
      // if not init, parent will also be checked.
      // Since replacements will be children of parent,
      // don't need to gather them here
      childrenToCheck.push(...replacementsForComposites({ composite: ancestor, compositeClass }))
    }

  } else {

    // first add active children in order
    if (ancestor.activeChildren) {
      for (let child of ancestor.activeChildren) {
        if (includePropertyChildren || !child.componentIsAProperty) {
          childrenToCheck.push(child);
        }
      }
    }

    if (includeNonActiveChildren) {
      // add any non-active defining children in order
      let childrenToCheckNames = childrenToCheck.map(x => x.componentName);
      for (let child of ancestor.definingChildren) {
        if (!(childrenToCheckNames.includes(child.componentName))) {
          if (includePropertyChildren || !child.componentIsAProperty) {
            childrenToCheck.push(child);
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

  let descendants = [];

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
        init: false,
      });
      descendants.push(...additionalDescendants);
    }
  }

  return descendants;
}


function replacementsForComposites({ composite, compositeClass }) {

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
        replacements.push(...replacementsForComposites({ composite: replacement, compositeClass }))
      } else {
        replacements.push(replacement)
      }
    }

  }

  return replacements;

}