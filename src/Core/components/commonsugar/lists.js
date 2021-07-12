
export function returnGroupIntoComponentTypeSeparatedBySpaces({ componentType }) {

  return function ({ matchedChildren }) {

    // any components not separated by a space 
    // are wrapped by a componentType unless it is a single non-string

    let newChildren = [];
    let pieces = [];

    function createNewChild() {
      if (pieces.length === 1 && pieces[0].componentType !== "string") {
        // a single non-string becomes a child
        newChildren.push(pieces[0])
      } else if (pieces.length > 0) {
        // wrap anything else in componentType
        newChildren.push({
          componentType,
          children: pieces
        })
      }
      pieces = [];
    }

    for (let child of matchedChildren) {
      if (child.componentType !== "string") {
        pieces.push(child);
      } else {

        let stringPieces = child.state.value.split(/\s+/);
        let s0 = stringPieces[0];

        if (s0 === '') {
          createNewChild();
        } else {
          pieces.push({
            componentType: "string",
            state: { value: s0 }
          })
        }

        for (let s of stringPieces.slice(1)) {
          // if have more than one piece, must have had a space in between pieces
          createNewChild();
          if (s !== "") {
            pieces.push({
              componentType: "string",
              state: { value: s }
            })
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
      if (c.componentType === "string") {
        return [
          ...a,
          ...c.state.value.split(/\s+/)
            .filter(s => s)
            .map(s => ({
              componentType,
              children: [{ componentType: "string", state: { value: s } }]
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