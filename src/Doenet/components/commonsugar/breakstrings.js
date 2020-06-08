
// function: returnBreakStringsSugarFunction
//
// returns a sugar replacement function that
// - expects string and other children,
// - breaks the children by commas in strings not enclosed in parenthesis,
// - returns an array of components created by mapping the childrenToComponentFunction
//   function onto each of the pieces
// - other children are not examined or altered, so they could be anything
//
// For example, to take the dependency "stringAndMathChildren"
// and create points with coordinates determined by the pieces
// one could use the sugar replacement function
// let childrenToComponentFunction = x => ({
//   componentType: "point", children: [{
//     componentType: "coords", children: x}]
// })
// returnBreakStringsSugarFunction({
//   childrenToComponentFunction,
//   dependencyNameWithChildren: "stringAndMathChildren"
//  })

export function returnBreakStringsSugarFunction({
  childrenToComponentFunction,
  dependencyNameWithChildren
}) {
  return function ({ dependencyValues }) {
    let Nparens = 0;
    let pieces = [];
    let currentPiece = [];
    let toDelete = [];

    for (let component of dependencyValues[dependencyNameWithChildren]) {
      if (component.componentType !== "string") {
        currentPiece.push({
          createdComponent: true,
          componentName: component.componentName
        });
        continue;
      }

      let s = component.stateValues.value.trim();
      let beginInd = 0;
      let deleteOriginalString = false;

      for (let ind = 0; ind < s.length; ind++) {
        let char = s[ind];
        if (char === "(") {
          Nparens++;
        }
        if (char === ")") {
          if (Nparens === 0) {
            // parens didn't match, so return failure
            return { success: false };
          }
          Nparens--
        }
        if (char === "," && Nparens === 0) {
          if (ind > beginInd) {
            currentPiece.push({
              componentType: "string",
              state: { value: s.substring(beginInd, ind) }
            });
          }
          pieces.push(currentPiece);
          currentPiece = [];
          beginInd = ind + 1;
          if (deleteOriginalString !== true) {
            toDelete.push(component.componentName);
          }
          deleteOriginalString = true;

        }
      }

      if (deleteOriginalString) {
        if (s.length > beginInd) {
          currentPiece.push({
            componentType: "string",
            state: { value: s.substring(beginInd, s.length) }
          });
        }
      } else {
        currentPiece.push({
          createdComponent: true,
          componentName: component.componentName
        });
      }

    }

    // parens didn't match, so return failure
    if (Nparens !== 0) {
      return { success: false };
    }

    pieces.push(currentPiece);

    let newChildren = pieces.map(childrenToComponentFunction);

    return {
      success: true,
      toDelete: toDelete,
      newChildren: newChildren
    };
  }
}


// function: breakEmbeddedStringByCommas
//
// Utility function that can be used at the beginning of a sugar replacement function.
// It breaks children by commas not enclosed in parentheses.
// Components that are instances of entries of classesToExtract extracted into a separate array
// Remaining components are kept embedded in the pieces

// Returns
// - success: true if successed to break pieces
// - pieces: array of pieces that were broken apart by commas
//   Each piece is an array of components.
//   Each component is either a serialized string or a created component
// - componentsExtracted: array of created components that matched classesToExtract
// - toDelete: strings that were broken apart and hence must be deleted

// In both pieces and componentsExtracted, additional information is added for internal use
// (the information will be ignored when sugar replacement is processed)
// - strings (whether createdComponents or serialized) have a _string property containing their string
// - other created components have a _component property containing the original (proxied) child

export function breakEmbeddedStringByCommas({ childrenList, classesToExtract = [] }) {
  let Nparens = 0;
  let pieces = [];
  let currentPiece = [];
  let toDelete = [];

  let componentsExtracted = [];

  for (let component of childrenList) {

    if (component.componentType !== "string") {

      let extracted = false;
      for (let cl of classesToExtract) {
        if (component instanceof cl) {
          componentsExtracted.push({
            createdComponent: true,
            componentName: component.componentName,
            _component: component,
          });
          extracted = true;
          break;
        }
      }
      if (!extracted) {
        currentPiece.push({
          createdComponent: true,
          componentName: component.componentName,
          _component: component,
        });
      }
      continue;
    }

    let s = component.stateValues.value.trim();
    let beginInd = 0;
    let deleteOriginalString = false;

    for (let ind = 0; ind < s.length; ind++) {
      let char = s[ind];
      if (char === "(") {
        Nparens++;
      }
      if (char === ")") {
        if (Nparens === 0) {
          // parens didn't match, so return failure
          return { success: false };
        }
        Nparens--
      }
      if (char === "," && Nparens === 0) {
        if (ind > beginInd) {
          let newString = s.substring(beginInd, ind).trim()
          currentPiece.push({
            componentType: "string",
            state: { value: newString },
            _string: newString,
          });
        }

        pieces.push(currentPiece);
        currentPiece = [];
        beginInd = ind + 1;
        if (deleteOriginalString !== true) {
          toDelete.push(component.componentName);
        }
        deleteOriginalString = true;

      }
    }

    if (deleteOriginalString) {
      if (s.length > beginInd) {
        let newString = s.substring(beginInd, s.length);
        currentPiece.push({
          componentType: "string",
          state: { value: newString },
          _string: newString,
        });
      }
    } else {
      currentPiece.push({
        createdComponent: true,
        componentName: component.componentName,
        _string: component.stateValues.value,
      });
    }

  }

  // parens didn't match, so return failure
  if (Nparens !== 0) {
    return { success: false };
  }

  pieces.push(currentPiece);

  return {
    success: true,
    pieces: pieces,
    toDelete: toDelete,
    componentsExtracted: componentsExtracted,
  }
}


// function: breakIntoVectorComponents
//
// Utility function that attempts to break an array of components (compList) into components of a vector
// To be considered a vector, compList must
//  -start with a string beginning with (
//  -end with a string ending with )
// Moreover, once those parens are removed, the remainder must be able to be broken by commas not in parens
// (If not, then either compList didn't obey math rules of paren or the parens removed didn't match each other
//
// Assumes that compList was already a results of breakEmbeddedStringByCommas
// as strings are intenfied solely by the presence of the _string property.
// All other components are left embedded in the pieces
//
// Returns:
// - foundVector: true if succeded
// - vectorComponents: array whose components are arrays representing the vector components
// - toDelete: strings that were broken apart and hence must be deleted

export function breakIntoVectorComponents(compList, dryRun = false) {
  if (compList.length === 0) {
    return { foundVector: false };
  }
  let s0 = compList[0]._string;
  if (s0 === undefined) {
    return { foundVector: false };
  }
  let char0 = s0.trim()[0];
  if (char0 !== "(") {
    return { foundVector: false };
  }

  let sl = compList[compList.length - 1]._string;
  if (sl === undefined) {
    return { foundVector: false };
  }
  let charl = sl.trim().slice(-1);
  if (charl !== ")") {
    return { foundVector: false };
  }

  let newCompList = [];
  let toDelete = [];
  if (compList.length === 1) {
    let snew = s0.trim().slice(1, -1).trim();
    if (snew.length > 0) {
      newCompList.push({
        componentType: "string",
        state: { value: snew },
        _string: snew,
      })
    }
    if (dryRun !== true && compList[0].createdComponent === true) {
      toDelete.push(compList[0].componentName);
    }
  } else {
    let snew = s0.trim().slice(1).trim();
    if (snew.length > 0) {
      newCompList.push({
        componentType: "string",
        state: { value: snew },
        _string: snew,
      })
    }
    if (dryRun !== true && compList[0].createdComponent === true) {
      toDelete.push(compList[0].componentName);
    }

    for (let comp of compList.slice(1, -1)) {
      newCompList.push(comp);
    }
    snew = sl.trim().slice(0, -1).trim();
    if (snew.length > 0) {
      newCompList.push({
        componentType: "string",
        state: { value: snew },
        _string: snew,
      });
    }
    if (dryRun !== true && compList[compList.length - 1].createdComponent === true) {
      toDelete.push(compList[compList.length - 1].componentName);
    }

  }
  let Nparens = 0;
  let pieces = [];
  let currentPiece = [];

  for (let comp of newCompList) {
    let s = comp._string;

    if (s === undefined) {
      currentPiece.push(comp);
      continue;
    }
    s = s.trim();

    let beginInd = 0;
    let deleteOriginalString = false;

    for (let ind = 0; ind < s.length; ind++) {
      let char = s[ind];
      if (char === "(") {
        Nparens++;
      }
      if (char === ")") {
        if (Nparens === 0) {
          // parens didn't match, so it wasn't a vector
          return { foundVector: false };
        }
        Nparens--
      }
      if (dryRun !== true) {
        if (char === "," && Nparens === 0) {
          if (ind > beginInd) {
            let snew = s.substring(beginInd, ind).trim();
            currentPiece.push({
              componentType: "string",
              state: { value: snew },
              _string: snew,
            });
          }

          pieces.push(currentPiece);
          currentPiece = [];
          beginInd = ind + 1;
          if (deleteOriginalString !== true) {
            if (comp.createdComponent) {
              toDelete.push(comp.componentName);
            }
          }
          deleteOriginalString = true;
        }
      }
    }

    if (dryRun !== true) {
      if (deleteOriginalString) {
        if (s.length > beginInd) {
          let snew = s.substring(beginInd, s.length).trim();
          currentPiece.push({
            componentType: "string",
            state: { value: snew },
            _string: snew,
          });
        }
      } else {
        currentPiece.push(comp);
      }
    }
  }

  // parens didn't match, so it wasn't a vector
  if (Nparens !== 0) {
    return { foundVector: false };
  }

  if (dryRun === true) {
    return { foundVector: true };
  }

  pieces.push(currentPiece);

  return {
    foundVector: true,
    vectorComponents: pieces,
    toDelete: toDelete,
  }
}


// function: breakPiecesByEquals
//
// We break each piece into lhs and rhs separated by an equal sign.
// If no piece contains an equal sign, then rhs's will be empty
// If some pieces contain an equal sign but not others, return failure
// If a pieced contains two equal signs, return failure
//
// If parseVectorEquality is true and there is a single piece
// with an equal sign, then attempt to parse both lhs and rhs as vectors.
// If both are vectors of the same size, put the components individually
// into lhs and rhs pieces (i.e., treat the same as if had separate pieces
// with an equal sign for each component)
// If one side but not the other is a vector or if they have different sizes,
// then return failure
// If neither side is a vector, keep lhs and rhs as they were
//
// Returns:
// - success: true if didn't run into troubles described above
// - lhsByPiece: array of lhs of each piece
// - rhsByPiece: array of rhs of each piece
// - toDelete: strings that were broken apart and hence must be deleted
//
// Note: all punctuation (equal sign as well as comma and parens for vectors)
// are recognized only inside strings
//
// Note 2: we assume pieces have already been processed by breakEmbeddedStringByCommas
// so that strings can be idenified by the _string property

export function breakPiecesByEquals(pieces, parseVectorEquality = false) {

  let lhsByPiece = [];
  let rhsByPiece = [];
  let toDelete = [];

  let foundEqualSignInAPiece;
  let re_equal = /^([^=]*)(=([^=]*))?$/;

  for (let ind = 0; ind < pieces.length; ind++) {
    let piece = pieces[ind];

    let lhs = [];
    let rhs = [];
    let foundEqualSign = false;
    for (let comp of piece) {

      let s = comp._string;
      if (s === undefined) {
        if (foundEqualSign) {
          rhs.push(comp);
        } else {
          lhs.push(comp);
        }
        continue;
      }

      // we have a string s
      let result = s.match(re_equal);
      if (result === null) {
        // found more than one = sign in the single string
        return { success: false };
      }
      if (result[2] === undefined) {
        // no equal sign, so just add to lhs or rhs
        if (foundEqualSign) {
          rhs.push(comp);
        } else {
          lhs.push(comp);
        }
      } else {

        // found one equal sign
        if (foundEqualSign) {
          // found second equal sign
          return { succes: false };
        }
        foundEqualSign = true;
        let l = result[1];
        let r = result[3];
        if (l.length > 0) {
          lhs.push({
            componentType: "string",
            state: { value: l },
            _string: l,
          })
        }
        if (r.length > 0) {
          rhs.push({
            componentType: "string",
            state: { value: r },
            _string: r,
          })
        }
        if (comp.createdComponent === true) {
          // broke up an original string
          // need to make original string as to be deleted
          toDelete.push(comp.componentName);
        }
      }
    }

    if (ind === 0) {
      foundEqualSignInAPiece = foundEqualSign;
    } else {
      if (foundEqualSign !== foundEqualSignInAPiece) {
        // inconsistent pieces, some with and without equal signs
        // sugar fails
        return { success: false };
      }
    }

    if (foundEqualSign) {

      if (pieces.length === 1 && parseVectorEquality) {
        // check if lhs and rhs are vectors
        let lhsResult = breakIntoVectorComponents(lhs);
        if (lhsResult.foundVector === true) {
          let rhsResult = breakIntoVectorComponents(rhs);
          if (rhsResult.foundVector !== true) {
            // on side is vector, the other isn't
            return { success: false }
          }
          if (lhsResult.vectorComponents.length !== rhsResult.vectorComponents.length) {
            // have different vector lengths
            return { success: false }
          }

          // found two vectors of the same length
          // should treat the same as separate equalities
          for (let i = 0; i < lhsResult.vectorComponents.length; i++) {
            lhsByPiece.push(lhsResult.vectorComponents[i]);
            rhsByPiece.push(rhsResult.vectorComponents[i]);
          }
          // add any more strings to delete
          toDelete = [...toDelete, ...lhsResult.toDelete, ...rhsResult.toDelete]

          return {
            success: true,
            lhsByPiece: lhsByPiece,
            rhsByPiece: rhsByPiece,
            toDelete: toDelete,
          }

        } else {
          // didn't find vector in lhs
          // just make sure isn't a vector in rhs
          let rhsResult = breakIntoVectorComponents(rhs, true);
          if (rhsResult.success === true) {
            return { success: false };
          }
        }
      }
      lhsByPiece.push(lhs);
      rhsByPiece.push(rhs);
    } else {
      // no equal sign, so we just have lhs
      lhsByPiece.push(lhs);
    }
  }

  return {
    success: true,
    lhsByPiece: lhsByPiece,
    rhsByPiece: rhsByPiece,
    toDelete: toDelete,

  }
}