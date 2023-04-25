import InlineComponent from "./abstract/InlineComponent";
import { breakEmbeddedStringsIntoParensPieces } from "./commonsugar/breakstrings";
import me from "math-expressions";

export default class BezierControls extends InlineComponent {
  static componentType = "bezierControls";
  static rendererType = "containerInline";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.alwaysVisible = {
      createComponentOfType: "boolean",
      createStateVariable: "alwaysVisible",
      defaultValue: false,
      public: true,
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let createControlVectorsList = function ({ matchedChildren }) {
      let results = breakEmbeddedStringsIntoParensPieces({
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
              componentType: "controlVectors",
              children: [
                {
                  componentType: "vector",
                  children: piece,
                },
              ],
            };
          } else {
            return piece[0];
          }
        }),
      };
    };

    sugarInstructions.push({
      // childrenRegex: /s+(.*s)?/,
      replacementFunction: createControlVectorsList,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "controlVectors",
        componentTypes: ["controlVectors"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nControls = {
      returnDependencies: () => ({
        nParentPoints: {
          dependencyType: "parentStateVariable",
          variableName: "nThroughPoints",
          skipComponentNames: true,
        },
      }),
      definition({ dependencyValues }) {
        let nControls = dependencyValues.nParentPoints;
        if (!(Number.isInteger(nControls) && nControls >= 0)) {
          nControls = 0;
        }
        return { setValue: { nControls } };
      },
    };

    stateVariableDefinitions.pointIndMap = {
      returnDependencies: () => ({
        controlChildren: {
          dependencyType: "child",
          childGroups: ["controlVectors"],
          variableNames: ["pointNumber"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let pointIndMap = [];
        let currentPointInd = -1;
        for (let [
          controlInd,
          controlChild,
        ] of dependencyValues.controlChildren.entries()) {
          let pointNumber = controlChild.stateValues.pointNumber;
          if (Number.isFinite(pointNumber)) {
            currentPointInd = Math.round(pointNumber) - 1;
          } else {
            currentPointInd += 1;
          }
          pointIndMap[currentPointInd] = controlInd;
        }

        return { setValue: { pointIndMap } };
      },
    };

    stateVariableDefinitions.directions = {
      isArray: true,
      entryPrefixes: ["direction"],
      hasEssential: true,
      isLocation: true,
      defaultValueByArrayKey: () => "none",
      stateVariablesDeterminingDependencies: ["pointIndMap"],
      returnArraySizeDependencies: () => ({
        nControls: {
          dependencyType: "stateVariable",
          variableName: "nControls",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nControls];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let controlInd = stateValues.pointIndMap[arrayKey];
          if (controlInd !== undefined) {
            dependenciesByKey[arrayKey] = {
              controlChild: {
                dependencyType: "child",
                childGroups: ["controlVectors"],
                variableNames: ["direction"],
                childIndices: [controlInd],
              },
            };
          }
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let directions = {};
        let essentialDirections = {};

        for (let arrayKey of arrayKeys) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length === 1) {
            directions[arrayKey] = controlChild[0].stateValues.direction;
          } else {
            essentialDirections[arrayKey] = true;
          }
        }

        return {
          setValue: { directions },
          useEssentialOrDefaultValue: { directions: essentialDirections },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        // componentName
      }) {
        // console.log(`inverse definition of directions for beziercontrols of ${componentName}`)
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)));
        // console.log(JSON.parse(JSON.stringify(dependencyNamesByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));

        let instructions = [];
        let newDirectionValues = {};
        for (let arrayKey in desiredStateVariableValues.directions) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length === 1) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlChild,
              desiredValue: desiredStateVariableValues.directions[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            });
          } else {
            newDirectionValues[arrayKey] =
              desiredStateVariableValues.directions[arrayKey];
          }
        }

        if (Object.keys(newDirectionValues).length > 0) {
          instructions.push({
            setEssentialValue: "directions",
            value: newDirectionValues,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.hiddenControls = {
      isArray: true,
      entryPrefixes: ["hiddenControl"],
      hasEssential: true,
      defaultValueByArrayKey: () => false,
      stateVariablesDeterminingDependencies: ["pointIndMap"],
      returnArraySizeDependencies: () => ({
        nControls: {
          dependencyType: "stateVariable",
          variableName: "nControls",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nControls];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let controlInd = stateValues.pointIndMap[arrayKey];
          if (controlInd !== undefined) {
            dependenciesByKey[arrayKey] = {
              controlChild: {
                dependencyType: "child",
                childGroups: ["controlVectors"],
                variableNames: ["hide"],
                childIndices: [controlInd],
              },
            };
          }
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let hiddenControls = {};
        let essentialHiddenControls = {};

        for (let arrayKey of arrayKeys) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length === 1) {
            hiddenControls[arrayKey] = controlChild[0].stateValues.hide;
          } else {
            essentialHiddenControls[arrayKey] = true;
          }
        }

        return {
          setValue: { hiddenControls },
          useEssentialOrDefaultValue: {
            hiddenControls: essentialHiddenControls,
          },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
        // componentName
      }) {
        // console.log(`inverse definition of hiddenControls for beziercontrols of ${componentName}`)
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)));
        // console.log(JSON.parse(JSON.stringify(dependencyNamesByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));

        let instructions = [];
        let newHiddenControlValues = {};
        for (let arrayKey in desiredStateVariableValues.hiddenControls) {
          let controlChild = dependencyValuesByKey[arrayKey].controlChild;

          if (controlChild && controlChild.length === 1) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].controlChild,
              desiredValue: desiredStateVariableValues.hiddenControls[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            });
          } else {
            newHiddenControlValues[arrayKey] =
              desiredStateVariableValues.hiddenControls[arrayKey];
          }
        }

        if (Object.keys(newHiddenControlValues).length > 0) {
          instructions.push({
            setEssentialValue: "hiddenControls",
            value: newHiddenControlValues,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.nDimensions = {
      returnDependencies() {
        return {
          nParentDimensions: {
            dependencyType: "parentStateVariable",
            variableName: "nDimensions",
          },
        };
      },
      definition: function ({ dependencyValues }) {
        let nDimensions = dependencyValues.nParentDimensions;
        if (!(Number.isInteger(nDimensions) && nDimensions >= 0)) {
          nDimensions = 0;
        }

        return {
          setValue: { nDimensions },
          checkForActualChange: { nDimensions: true },
        };
      },
    };

    // if have an essential symmetric control
    // need one vector that both control vectors depend on
    stateVariableDefinitions.essentialSymmetricControls = {
      isArray: true,
      entryPrefixes: ["essentialSymmetricControl"],
      nDimensions: 2,
      hasEssential: true,
      isLocation: true,
      defaultValueByArrayKey: () => me.fromAst(1),
      returnArraySizeDependencies: () => ({
        nControls: {
          dependencyType: "stateVariable",
          variableName: "nControls",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nControls, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {
        let essentialControls = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));

          essentialControls[arrayKey] = true;
        }

        return {
          useEssentialOrDefaultValue: {
            essentialSymmetricControls: essentialControls,
          },
        };
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let instructions = [];
        let newControlValues = {};
        for (let arrayKey in desiredStateVariableValues.essentialSymmetricControls) {
          newControlValues[arrayKey] =
            desiredStateVariableValues.essentialSymmetricControls[arrayKey];
        }

        if (Object.keys(newControlValues).length > 0) {
          instructions.push({
            setEssentialValue: "essentialSymmetricControls",
            value: newControlValues,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.controls = {
      isArray: true,
      entryPrefixes: ["control"],
      nDimensions: 3,
      hasEssential: true,
      shadowVariable: true,
      isLocation: true,
      defaultValueByArrayKey: () => me.fromAst(1),
      stateVariablesDeterminingDependencies: ["pointIndMap", "directions"],
      returnArraySizeDependencies: () => ({
        nControls: {
          dependencyType: "stateVariable",
          variableName: "nControls",
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nControls, 2, dependencyValues.nDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);

          dependenciesByKey[arrayKey] = {
            direction: {
              dependencyType: "stateVariable",
              variableName: "direction" + varEndings[0],
            },
          };

          let direction = stateValues.directions[arrayIndices[0]];
          if (
            direction !== "none" &&
            (arrayIndices[1] === 0 || arrayIndices[1] === 1)
          ) {
            let controlInd = stateValues.pointIndMap[arrayIndices[0]];
            if (controlInd !== undefined) {
              if (
                direction === "symmetric" ||
                (direction === "previous" && arrayIndices[1] === 0) ||
                (direction === "next" && arrayIndices[1] === 1)
              ) {
                dependenciesByKey[arrayKey].controlChild = {
                  dependencyType: "child",
                  childGroups: ["controlVectors"],
                  variableNames: ["vectorX1_" + varEndings[2]],
                  childIndices: [controlInd],
                };
              } else if (direction === "both") {
                dependenciesByKey[arrayKey].controlChild = {
                  dependencyType: "child",
                  childGroups: ["controlVectors"],
                  variableNames: [
                    "vectorX" + varEndings[1] + "_" + varEndings[2],
                  ],
                  childIndices: [controlInd],
                };
              }
            }

            if (direction === "symmetric") {
              dependenciesByKey[arrayKey].essentialSymmetricControl = {
                dependencyType: "stateVariable",
                variableName:
                  "essentialSymmetricControl" +
                  varEndings[0] +
                  "_" +
                  varEndings[2],
              };
            }
          }
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({
        dependencyValuesByKey,
        arrayKeys,
        componentName,
      }) {
        // console.log(`definition of controls for beziercontrols of ${componentName}`)
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let newControlValues = {};
        let essentialControls = {};

        for (let arrayKey of arrayKeys) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);

          let direction = dependencyValuesByKey[arrayKey].direction;

          if (arrayIndices[1] === 0) {
            if (direction === "none" || direction === "next") {
              newControlValues[arrayKey] = null;
            } else {
              let controlChild = dependencyValuesByKey[arrayKey].controlChild;
              let useEssential = true;
              if (controlChild && controlChild.length === 1) {
                let value =
                  controlChild[0].stateValues["vectorX1_" + varEndings[2]];
                if (value) {
                  useEssential = false;
                  value = value.evaluate_to_constant();
                  newControlValues[arrayKey] = me.fromAst(value);
                }
              }

              if (useEssential) {
                if (direction === "symmetric") {
                  newControlValues[arrayKey] =
                    dependencyValuesByKey[arrayKey].essentialSymmetricControl;
                } else {
                  essentialControls[arrayKey] = true;
                }
              }
            }
          } else if (arrayIndices[1] === 1) {
            if (direction === "none" || direction === "previous") {
              newControlValues[arrayKey] = null;
            } else {
              let controlChild = dependencyValuesByKey[arrayKey].controlChild;
              let useEssential = true;
              if (controlChild && controlChild.length === 1) {
                if (direction === "both") {
                  let value =
                    controlChild[0].stateValues["vectorX2_" + varEndings[2]];
                  if (value) {
                    useEssential = false;
                    value = value.evaluate_to_constant();
                    newControlValues[arrayKey] = me.fromAst(value);
                  }
                } else {
                  let value =
                    controlChild[0].stateValues["vectorX1_" + varEndings[2]];
                  if (value) {
                    useEssential = false;
                    value = value.evaluate_to_constant();
                    if (direction === "symmetric") {
                      newControlValues[arrayKey] = me.fromAst(-value);
                    } else {
                      newControlValues[arrayKey] = me.fromAst(value);
                    }
                  }
                }
              }

              if (useEssential) {
                if (direction === "symmetric") {
                  if (
                    dependencyValuesByKey[arrayKey].essentialSymmetricControl
                  ) {
                    newControlValues[arrayKey] = me.fromAst(
                      -dependencyValuesByKey[arrayKey].essentialSymmetricControl
                        .tree,
                    );
                  }
                } else {
                  essentialControls[arrayKey] = true;
                }
              }
            }
          }
        }
        return {
          setValue: {
            controls: newControlValues,
          },
          useEssentialOrDefaultValue: {
            controls: essentialControls,
          },
        };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        dependencyValuesByKey,
      }) {
        // console.log('inverse definition of controls for beziercontrols')
        // console.log(JSON.parse(JSON.stringify(desiredStateVariableValues)));
        // console.log(JSON.parse(JSON.stringify(dependencyNamesByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));

        let instructions = [];
        let newControlValues = {};
        for (let arrayKey in desiredStateVariableValues.controls) {
          let arrayIndices = arrayKey.split(",").map((x) => Number(x));
          let varEndings = arrayIndices.map((x) => x + 1);

          let direction = dependencyValuesByKey[arrayKey].direction;
          if (direction) {
            if (arrayIndices[1] === 0) {
              if (!(direction === "none" || direction === "next")) {
                let controlChild = dependencyValuesByKey[arrayKey].controlChild;
                let useEssential = true;
                if (controlChild && controlChild.length === 1) {
                  let value =
                    controlChild[0].stateValues["vectorX1_" + varEndings[2]];
                  if (value) {
                    useEssential = false;
                    instructions.push({
                      setDependency:
                        dependencyNamesByKey[arrayKey].controlChild,
                      desiredValue:
                        desiredStateVariableValues.controls[arrayKey],
                      childIndex: 0,
                      variableIndex: 0,
                    });
                  }
                }

                if (useEssential) {
                  // make sure essential values are numeric
                  let desiredValue = me.fromAst(
                    desiredStateVariableValues.controls[
                      arrayKey
                    ].evaluate_to_constant(),
                  );
                  if (direction === "symmetric") {
                    instructions.push({
                      setDependency:
                        dependencyNamesByKey[arrayKey]
                          .essentialSymmetricControl,
                      desiredValue,
                    });
                  } else {
                    newControlValues[arrayKey] = desiredValue;
                  }
                }
              }
            } else if (arrayIndices[1] === 1) {
              if (!(direction === "none" || direction === "previous")) {
                let controlChild = dependencyValuesByKey[arrayKey].controlChild;
                let useEssential = true;
                if (controlChild && controlChild.length === 1) {
                  if (direction === "both") {
                    let value =
                      controlChild[0].stateValues["vectorX2_" + varEndings[2]];
                    if (value) {
                      useEssential = false;
                    }
                  } else {
                    let value =
                      controlChild[0].stateValues["vectorX1_" + varEndings[2]];
                    if (value) {
                      useEssential = false;
                    }
                  }
                }

                let desiredValue;
                if (direction === "symmetric") {
                  desiredValue = me.fromAst([
                    "-",
                    desiredStateVariableValues.controls[arrayKey].tree,
                  ]);
                } else {
                  desiredValue = desiredStateVariableValues.controls[arrayKey];
                }

                if (useEssential) {
                  // make sure essential values are numeric
                  desiredValue = me.fromAst(
                    desiredValue.evaluate_to_constant(),
                  );
                  if (direction === "symmetric") {
                    instructions.push({
                      setDependency:
                        dependencyNamesByKey[arrayKey]
                          .essentialSymmetricControl,
                      desiredValue,
                    });
                  } else {
                    newControlValues[arrayKey] = desiredValue;
                  }
                } else {
                  instructions.push({
                    setDependency: dependencyNamesByKey[arrayKey].controlChild,
                    desiredValue,
                    childIndex: 0,
                    variableIndex: 0,
                  });
                }
              }
            }
          }
        }

        if (Object.keys(newControlValues).length > 0) {
          instructions.push({
            setEssentialValue: "controls",
            value: newControlValues,
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
