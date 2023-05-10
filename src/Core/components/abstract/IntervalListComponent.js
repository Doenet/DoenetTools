import BaseComponent from "./BaseComponent";

export default class IntervalListComponent extends BaseComponent {
  static componentType = "_intervalListComponent";
  static rendererType = "containerInline";
  static renderChildren = true;

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let createIntervalList = function ({ matchedChildren }) {
      let results = breakEmbeddedStringsIntoIntervalPieces({
        componentList: matchedChildren,
      });

      if (results.success !== true) {
        return { success: false };
      }

      return {
        success: true,
        newChildren: results.pieces.map(function (piece) {
          if (piece.length > 1 || typeof piece[0] === "string") {
            return {
              componentType: "interval",
              children: piece,
            };
          } else {
            return piece[0];
          }
        }),
      };
    };

    sugarInstructions.push({
      replacementFunction: createIntervalList,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "intervals",
        componentTypes: ["interval"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nIntervals = {
      returnDependencies: () => ({
        intervalChildren: {
          dependencyType: "child",
          childGroups: ["intervals"],
          skipComponentNames: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          setValue: { nIntervals: dependencyValues.intervalChildren.length },
          checkForActualChange: { nIntervals: true },
        };
      },
    };

    stateVariableDefinitions.intervals = {
      isArray: true,
      nDimensions: 1,
      entryPrefixes: ["interval"],
      returnArraySizeDependencies: () => ({
        nIntervals: {
          dependencyType: "stateVariable",
          variableName: "nIntervals",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nIntervals];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            intervalChild: {
              dependencyType: "child",
              childGroups: ["intervals"],
              variableNames: ["value"],
              childIndices: [arrayKey],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log('array definition of intervals for intervallist')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let intervals = {};

        for (let arrayKey of arrayKeys) {
          let intervalChild = dependencyValuesByKey[arrayKey].intervalChild[0];
          if (intervalChild) {
            intervals[arrayKey] = intervalChild.stateValues["value"];
          }
        }

        // console.log("result")
        // console.log(JSON.parse(JSON.stringify(intervals)));

        return { setValue: { intervals } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
      }) {
        // console.log('array inverse definition of intervals of intervallist')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.intervals) {
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].intervalChild,
            desiredValue: desiredStateVariableValues.intervals[arrayKey],
            childIndex: 0,
            variableIndex: 0,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    return stateVariableDefinitions;
  }
}

function breakEmbeddedStringsIntoIntervalPieces({ componentList }) {
  let Nparens = 0;
  let pieces = [];
  let currentPiece = [];

  for (let component of componentList) {
    if (typeof component !== "string") {
      if (Nparens === 0) {
        // if not in a parenthesis, isn't an interval
        return { success: false };
      } else {
        currentPiece.push(component);
      }
      continue;
    }

    let s = component.trim();

    let beginInd = 0;

    for (let ind = 0; ind < s.length; ind++) {
      let char = s[ind];

      if (char === "(" || (Nparens === 0 && char === "[")) {
        Nparens++;
      } else if (char === ")" || (Nparens === 1 && char === "]")) {
        if (Nparens === 0) {
          // parens didn't match, so return failure
          return { success: false };
        }
        if (Nparens === 1) {
          // found end of piece in parens
          if (ind + 1 > beginInd) {
            let lastInd = ind + 1;
            let newString = s.substring(beginInd, lastInd).trim();
            if (newString.length > 0) {
              currentPiece.push(newString);
            }
          }

          pieces.push(currentPiece);
          currentPiece = [];
          beginInd = ind + 1;
        }
        Nparens--;
      } else if (Nparens === 0 && !char.match(/\s/)) {
        // starting a new piece
        // each piece must begin with parens
        return { success: false };
      }
    }

    if (s.length > beginInd) {
      let newString = s.substring(beginInd, s.length).trim();
      currentPiece.push(newString);
    }
  }

  // parens didn't match, so return failure
  if (Nparens !== 0) {
    return { success: false };
  }

  if (currentPiece.length > 0) {
    // didn't have intervals
    return { success: false };
  }

  return {
    success: true,
    pieces: pieces,
  };
}
