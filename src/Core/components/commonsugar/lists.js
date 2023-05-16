export function returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
  componentType,
  forceComponentType = false,
  includeNonMacros = false,
}) {
  return function ({ matchedChildren, componentInfoObjects }) {
    // Split strings and interleaving children by spaces in the strings that are outside parens.
    // The resulting groups are wrapped by a componentType unless the group is either
    // - a single non-string component (when forceComponentType is false), or
    // - a single component with a matching componentType (when forceComponentType is true)
    // If includeNonMacros is false
    // then non-string, non-macros components are always their own group of one component
    // and reset the parens count

    let newChildren = [];
    let pieces = [];

    function createNewChild() {
      let addedSingleMatch = false;
      if (pieces.length === 1) {
        let comp = pieces[0];
        if (forceComponentType) {
          // if have a component of the matching componentType
          // then add that component directly
          if (
            componentInfoObjects.componentIsSpecifiedType(comp, componentType)
          ) {
            newChildren.push(comp);
            addedSingleMatch = true;
          }
        } else {
          // forceComponentType is false so add any single non-string directly
          if (typeof comp !== "string") {
            newChildren.push(comp);
            addedSingleMatch = true;
          }
        }
      }

      if (!addedSingleMatch && pieces.length > 0) {
        // wrap anything else in componentType
        newChildren.push({
          componentType,
          children: pieces,
        });
      }

      pieces = [];
    }

    let Nparens = 0;

    for (let child of matchedChildren) {
      if (typeof child !== "string") {
        if (!(includeNonMacros || child.doenetAttributes?.createdFromMacro)) {
          createNewChild();
          pieces.push(child);
          createNewChild();
          Nparens = 0;
        } else {
          pieces.push(child);
        }
      } else {
        let s = child;

        let beginInd = 0;

        for (let ind = 0; ind < s.length; ind++) {
          let char = s[ind];

          if (char === "(") {
            Nparens++;
          } else if (char === ")") {
            if (Nparens === 0) {
              // parens didn't match, so just make a child out of what have so far
              createNewChild();
            } else {
              Nparens--;
            }
          } else if (Nparens === 0 && char.match(/\s/)) {
            // found a space outside parens

            if (ind > beginInd) {
              pieces.push(s.substring(beginInd, ind));
            }

            createNewChild();

            beginInd = ind + 1;
          }
        }

        if (s.length > beginInd) {
          pieces.push(s.substring(beginInd, s.length));
        }
      }
    }

    createNewChild();

    return {
      success: true,
      newChildren,
    };
  };
}

export function returnBreakStringsMacrosIntoComponentTypeBySpacesOutsideParens({
  componentType,
}) {
  return function ({ matchedChildren }) {
    // break any string by white space that is outside parens and wrap pieces with componentType

    let newChildren = [];

    for (let child of matchedChildren) {
      if (typeof child !== "string") {
        newChildren.push(child);
      } else {
        let Nparens = 0;
        let s = child;

        let beginInd = 0;

        let childrenFromString = [];

        for (let ind = 0; ind < s.length; ind++) {
          let char = s[ind];

          if (char === "(") {
            Nparens++;
          } else if (char === ")") {
            if (Nparens === 0) {
              // parens didn't match
              // set parens to -1 so will wrap entire string at end
              Nparens = -1;
              break;
            }
            Nparens--;
          } else if (Nparens === 0 && char.match(/\s/)) {
            // found a space outside parens

            if (ind > beginInd) {
              childrenFromString.push({
                componentType,
                children: [s.substring(beginInd, ind)],
              });
            }

            beginInd = ind + 1;
          }
        }

        // parens didn't match, so return failure
        if (Nparens !== 0) {
          newChildren.push({
            componentType,
            children: [child],
          });
        } else {
          if (s.length > beginInd) {
            childrenFromString.push({
              componentType,
              children: [s.substring(beginInd, s.length)],
            });
          }
          newChildren.push(...childrenFromString);
        }
      }
    }

    return {
      success: true,
      newChildren: newChildren,
    };
  };
}
