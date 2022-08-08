
export function returnGroupIntoComponentTypeSeparatedBySpaces({ componentType, forceComponentType = false }) {

  return function ({ matchedChildren, componentInfoObjects }) {

    // any components not separated by a space 
    // are wrapped by a componentType unless it is either
    // - a single non-string component (when forceComponentType is false), or
    // - a single component with a matching componentType (when forcComponentType is true)

    let newChildren = [];
    let pieces = [];

    function createNewChild() {

      let addedSingleMatch = false;
      if (forceComponentType) {
        // if have a single component of the matching componentType
        // then add that component directly
        if (pieces.length === 1) {
          let comp = pieces[0];
          let compComponentType = comp.componentType;
          if (compComponentType === "copy" && comp.attributes?.createComponentOfType) {
            if (!comp.attributes.nComponents || comp.attributes.nComponents.primitive === 1) {
              compComponentType = comp.attributes.createComponentOfType.primitive;
            }
          }
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: compComponentType,
            baseComponentType: componentType
          })) {
            newChildren.push(comp);
            addedSingleMatch = true;
          }
        }
      } else {
        // forceComponentType is false so add any single non-string directly
        if(pieces.length === 1 && typeof pieces[0] !== "string") {
          newChildren.push(pieces[0]);
          addedSingleMatch = true;
        }
      }

      if (!addedSingleMatch && pieces.length > 0) {
        // wrap anything else in componentType
        newChildren.push({
          componentType,
          children: pieces
        })
      }

      pieces = [];
    }

    for (let child of matchedChildren) {
      if (typeof child !== "string") {
        pieces.push(child);
      } else {

        let stringPieces = child.split(/\s+/);
        let s0 = stringPieces[0];

        if (s0 === '') {
          createNewChild();
        } else {
          pieces.push(s0)
        }

        for (let s of stringPieces.slice(1)) {
          // if have more than one piece, must have had a space in between pieces
          createNewChild();
          if (s !== "") {
            pieces.push(s)
          }

        }

      }
    }

    createNewChild();

    return {
      success: true,
      newChildren,
    }
  }
}

export function returnBreakStringsIntoComponentTypeBySpaces({ componentType }) {

  return function ({ matchedChildren }) {

    // break any string by white space and wrap pieces with componentType

    let newChildren = matchedChildren.reduce(function (a, c) {
      if (typeof c === "string") {
        return [
          ...a,
          ...c.split(/\s+/)
            .filter(s => s)
            .map(s => ({
              componentType,
              children: [s]
            }))
        ]
      } else {
        return [...a, c]
      }
    }, []);

    return {
      success: true,
      newChildren: newChildren,
    }
  }
}