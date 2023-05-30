import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import {
  returnNVariables,
  convertValueToMathExpression,
  roundForDisplay,
} from "../utils/math";
import { returnTextStyleDescriptionDefinitions } from "../utils/style";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import { returnWrapNonLabelsSugarFunction } from "../utils/label";

export default class Line extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      moveLine: this.moveLine.bind(this),
      switchLine: this.switchLine.bind(this),
      lineClicked: this.lineClicked.bind(this),
      lineFocused: this.lineFocused.bind(this),
    });
  }
  static componentType = "line";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.equation = {
      createComponentOfType: "math",
    };
    attributes.through = {
      createComponentOfType: "_pointListComponent",
    };
    attributes.slope = {
      createComponentOfType: "number",
    };
    attributes.variables = {
      createComponentOfType: "_variableNameList",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: ["upperright", "upperleft", "lowerright", "lowerleft"],
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    sugarInstructions.push({
      replacementFunction: returnWrapNonLabelsSugarFunction({
        wrappingComponentType: "math",
        createAttributeOfType: "equation",
      }),
    });
    return sugarInstructions;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    stateVariableDefinitions.styleDescription = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        document: {
          dependencyType: "ancestor",
          componentType: "document",
          variableNames: ["theme"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let lineColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          lineColorWord = dependencyValues.selectedStyle.lineColorWordDarkMode;
        } else {
          lineColorWord = dependencyValues.selectedStyle.lineColorWord;
        }

        let styleDescription = dependencyValues.selectedStyle.lineWidthWord;
        if (dependencyValues.selectedStyle.lineStyleWord) {
          if (styleDescription) {
            styleDescription += " ";
          }
          styleDescription += dependencyValues.selectedStyle.lineStyleWord;
        }

        if (styleDescription) {
          styleDescription += " ";
        }

        styleDescription += lineColorWord;

        return { setValue: { styleDescription } };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {
        let styleDescriptionWithNoun =
          dependencyValues.styleDescription + " line";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      stateVariablesDeterminingDependencies: ["equationIdentity"],
      returnDependencies: function ({ stateValues }) {
        if (stateValues.equationIdentity === null) {
          return {
            through: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: ["numDimensions"],
            },
          };
        } else {
          return {
            equation: {
              dependencyType: "attributeComponent",
              attributeName: "equation",
            },
          };
        }
      },
      definition: function ({ dependencyValues, changes }) {
        // console.log(`definition of numDimensions of ${componentName}`)
        // console.log(dependencyValues)
        // console.log(changes)

        // if have an equation, we must be 2D
        // (Haven't implemented a line in 3D determined by 2 equations)
        if (dependencyValues.equation) {
          if (changes.equation && changes.equation.componentIdentitiesChanged) {
            return {
              setValue: { numDimensions: 2 },
              checkForActualChange: { numDimensions: true },
            };
          } else {
            return { noChanges: ["numDimensions"] };
          }
        } else {
          if (dependencyValues.through) {
            let numDimensions =
              dependencyValues.through.stateValues.numDimensions;
            return {
              setValue: { numDimensions },
              checkForActualChange: { numDimensions: true },
            };
          } else {
            // line through zero points
            return { setValue: { numDimensions: 2 } };
          }
        }
      },
    };

    stateVariableDefinitions.numPointsPrescribed = {
      returnDependencies: () => ({
        throughAttr: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["numPoints"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.throughAttr === null) {
          return { setValue: { numPointsPrescribed: 0 } };
        } else {
          return {
            setValue: {
              numPointsPrescribed:
                dependencyValues.throughAttr.stateValues.numPoints,
            },
          };
        }
      },
    };

    stateVariableDefinitions.basedOnSlope = {
      returnDependencies: () => ({
        slopeAttr: {
          dependencyType: "attributeComponent",
          attributeName: "slope",
        },
        numPointsPrescribed: {
          dependencyType: "stateVariable",
          variableName: "numPointsPrescribed",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            basedOnSlope:
              dependencyValues.numPointsPrescribed < 2 &&
              dependencyValues.slopeAttr !== null &&
              dependencyValues.numDimensions === 2,
          },
        };
      },
    };

    stateVariableDefinitions.dForSlope = {
      defaultValue: 1,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          dForSlope: true,
        },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "dForSlope",
              value: desiredStateVariableValues.dForSlope,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.variables = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_variableName",
      },
      entryPrefixes: ["var"],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          variables: {
            dependencyType: "attributeComponent",
            attributeName: "variables",
            variableNames: ["variables"],
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {
        let variablesSpecified = [];
        if (globalDependencyValues.variables !== null) {
          variablesSpecified =
            globalDependencyValues.variables.stateValues.variables;
        }

        return {
          setValue: {
            variables: returnNVariables(arraySize[0], variablesSpecified),
          },
        };
      },
    };

    // we make equation identity be a state variable
    // as we need a state variable to determine other dependencies
    // using stateVariablesDeterminingDependencies
    stateVariableDefinitions.equationIdentity = {
      returnDependencies: () => ({
        equation: {
          dependencyType: "attributeComponent",
          attributeName: "equation",
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`definition of equation child for ${componentName}`)
        // console.log(dependencyValues);

        if (dependencyValues.equation !== null) {
          return { setValue: { equationIdentity: dependencyValues.equation } };
        } else {
          return { setValue: { equationIdentity: null } };
        }
      },
    };

    stateVariableDefinitions.essentialPoints = {
      isArray: true,
      numDimensions: "2",
      isLocation: true,
      hasEssential: true,
      entryPrefixes: ["essentialPointX", "essentialPoint"],
      set: convertValueToMathExpression,
      defaultValueByArrayKey: (arrayKey) =>
        me.fromAst(arrayKey === "0,0" ? 1 : 0),
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "essentialPointX") {
          // essentialPointX1_2 is the 2nd component of the first point
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 2 &&
            indices.every((x, i) => Number.isInteger(x) && x >= 0)
          ) {
            if (arraySize) {
              if (indices.every((x, i) => x < arraySize[i])) {
                return [String(indices)];
              } else {
                return [];
              }
            } else {
              // If not given the array size,
              // then return the array keys assuming the array is large enough.
              // Must do this as it is used to determine potential array entries.
              return [String(indices)];
            }
          } else {
            return [];
          }
        } else {
          // essentialPoint3 is all components of the third point

          let pointInd = Number(varEnding) - 1;
          if (!(Number.isInteger(pointInd) && pointInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [pointInd + ",0"];
          }
          if (pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(
              Array(arraySize[1]),
              (_, i) => pointInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [2, dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey: () => ({}),
      arrayDefinitionByKey({ arrayKeys }) {
        let essentialPoints = {};
        for (let arrayKey of arrayKeys) {
          essentialPoints[arrayKey] = true;
        }

        return { useEssentialOrDefaultValue: { essentialPoints } };
      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.essentialPoints) {
          instructions.push({
            setEssentialValue: "essentialPoints",
            value: {
              [arrayKey]: convertValueToMathExpression(
                desiredStateVariableValues.essentialPoints[arrayKey],
              ),
            },
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.points = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "pointX") {
            return [];
          } else {
            // point or entire array
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      numDimensions: 2,
      entryPrefixes: ["pointX", "point"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "pointX") {
          // pointX1_2 is the 2nd component of the first point
          let indices = varEnding.split("_").map((x) => Number(x) - 1);
          if (
            indices.length === 2 &&
            indices.every((x, i) => Number.isInteger(x) && x >= 0)
          ) {
            if (arraySize) {
              if (indices.every((x, i) => x < arraySize[i])) {
                return [String(indices)];
              } else {
                return [];
              }
            } else {
              // If not given the array size,
              // then return the array keys assuming the array is large enough.
              // Must do this as it is used to determine potential array entries.
              return [String(indices)];
            }
          } else {
            return [];
          }
        } else {
          // point3 is all components of the third point

          let pointInd = Number(varEnding) - 1;
          if (!(Number.isInteger(pointInd) && pointInd >= 0)) {
            return [];
          }

          if (!arraySize) {
            // If don't have array size, we just need to determine if it is a potential entry.
            // Return the first entry assuming array is large enough
            return [pointInd + ",0"];
          }
          if (pointInd < arraySize[0]) {
            // array of "pointInd,i", where i=0, ..., arraySize[1]-1
            return Array.from(
              Array(arraySize[1]),
              (_, i) => pointInd + "," + i,
            );
          } else {
            return [];
          }
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === "points") {
          if (propIndex.length === 1) {
            return "point" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `pointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 5) === "point") {
          // could be point or pointX
          let pointNum = Number(varName.slice(5));
          if (Number.isInteger(pointNum) && pointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `pointX${pointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      stateVariablesDeterminingDependencies: [
        "equationIdentity",
        "numPointsPrescribed",
        "basedOnSlope",
      ],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [2, dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ stateValues, arrayKeys }) {
        if (stateValues.equationIdentity === null) {
          let dependenciesByKey = {};
          for (let arrayKey of arrayKeys) {
            let [pointInd, dim] = arrayKey.split(",");
            let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

            dependenciesByKey[arrayKey] = {
              through: {
                dependencyType: "attributeComponent",
                attributeName: "through",
                variableNames: ["pointX" + varEnding],
              },
            };
            if (stateValues.basedOnSlope) {
              if (pointInd === "1") {
                if (stateValues.numPointsPrescribed === 1) {
                  // need that first prescribed point to calculate second point
                  dependenciesByKey[arrayKey].through.variableNames.push(
                    "pointX1_" + (Number(dim) + 1),
                  );
                }
                dependenciesByKey[arrayKey].dForSlope = {
                  dependencyType: "stateVariable",
                  variableName: "dForSlope",
                };
                dependenciesByKey[arrayKey].slopeAttr = {
                  dependencyType: "attributeComponent",
                  attributeName: "slope",
                  variableNames: ["value"],
                };
              }
              if (stateValues.numPointsPrescribed === 0) {
                // use second essential point so defaults to (0,0)
                dependenciesByKey[arrayKey].essentialPoint = {
                  dependencyType: "stateVariable",
                  variableName: "essentialPointX2_" + (Number(dim) + 1),
                };
              }
            } else {
              // not based on slope
              dependenciesByKey[arrayKey].essentialPoint = {
                dependencyType: "stateVariable",
                variableName: "essentialPointX" + varEnding,
              };
            }
          }
          let globalDependencies = {
            numPointsPrescribed: {
              dependencyType: "stateVariable",
              variableName: "numPointsPrescribed",
            },
            numDimensions: {
              dependencyType: "stateVariable",
              variableName: "numDimensions",
            },
            basedOnSlope: {
              dependencyType: "stateVariable",
              variableName: "basedOnSlope",
            },
          };
          return { dependenciesByKey, globalDependencies };
        } else {
          let globalDependencies = {
            coeff0: {
              dependencyType: "stateVariable",
              variableName: "coeff0",
            },
            coeffvar1: {
              dependencyType: "stateVariable",
              variableName: "coeffvar1",
            },
            coeffvar2: {
              dependencyType: "stateVariable",
              variableName: "coeffvar2",
            },
            variables: {
              dependencyType: "stateVariable",
              variableName: "variables",
            },
            lastPointsFromInverting: {
              dependencyType: "stateVariable",
              variableName: "lastPointsFromInverting",
            },
          };
          return { globalDependencies };
        }
      },

      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        arraySize,
        componentName,
      }) {
        // console.log(`array definition of points for ${componentName}`)
        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys)

        if ("coeff0" in globalDependencyValues) {
          let result = calculatePointsFromCoeffs(globalDependencyValues);

          if (!result.success) {
            let points = {};
            for (let ind1 = 0; ind1 < arraySize[0]; ind1++) {
              for (let ind2 = 0; ind2 < arraySize[1]; ind2++) {
                points[ind1 + "," + ind2] = me.fromAst("\uff3f");
              }
            }
            return { setValue: { points } };
          } else {
            return { setValue: { points: result.points } };
          }
        } else {
          let points = {};

          for (let arrayKey of arrayKeys) {
            let [pointInd, dim] = arrayKey.split(",");
            let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

            if (
              dependencyValuesByKey[arrayKey].through !== null &&
              dependencyValuesByKey[arrayKey].through.stateValues[
                "pointX" + varEnding
              ]
            ) {
              points[arrayKey] =
                dependencyValuesByKey[arrayKey].through.stateValues[
                  "pointX" + varEnding
                ];
            } else {
              if (globalDependencyValues.basedOnSlope) {
                let point1;
                if (globalDependencyValues.numPointsPrescribed === 1) {
                  point1 =
                    dependencyValuesByKey[arrayKey].through.stateValues[
                      "pointX1_" + (Number(dim) + 1)
                    ];
                } else {
                  point1 = dependencyValuesByKey[arrayKey].essentialPoint;
                }

                if (pointInd === "0") {
                  // will get here only if numPointsPrescribed === 0
                  points[arrayKey] = point1;
                } else {
                  // 0 or 1 points prescribed, slope prescribed, and on second point, in 2D
                  let slope =
                    dependencyValuesByKey[arrayKey].slopeAttr.stateValues.value;

                  if (slope === Infinity || slope === -Infinity) {
                    if (dim === "0") {
                      points[arrayKey] = point1;
                    } else {
                      points[arrayKey] = me.fromAst([
                        "+",
                        point1.tree,
                        dependencyValuesByKey[arrayKey].dForSlope *
                          Math.sign(slope),
                      ]);
                    }
                  } else if (Number.isFinite(slope)) {
                    let theta = Math.atan(slope);
                    if (dim === "0") {
                      points[arrayKey] = me.fromAst([
                        "+",
                        point1.tree,
                        dependencyValuesByKey[arrayKey].dForSlope *
                          Math.cos(theta),
                      ]);
                    } else {
                      points[arrayKey] = me.fromAst([
                        "+",
                        point1.tree,
                        dependencyValuesByKey[arrayKey].dForSlope *
                          Math.sin(theta),
                      ]);
                    }
                  } else {
                    points[arrayKey] = me.fromAst("\uff3f");
                  }
                }
              } else {
                points[arrayKey] =
                  dependencyValuesByKey[arrayKey].essentialPoint;
              }
            }
          }

          // console.log(`result of array definition of points of line`)
          // console.log({points});
          return { setValue: { points } };
        }
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        initialChange,
        stateValues,
        workspace,
      }) {
        // console.log(`inverse array definition of points of line`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);
        // console.log(globalDependencyValues);

        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        if ("coeff0" in globalDependencyValues) {
          // dependencies are coeffs

          if (!workspace.desiredPoints) {
            workspace.desiredPoints = {};
          }

          Object.assign(
            workspace.desiredPoints,
            desiredStateVariableValues.points,
          );

          let points = await stateValues.points;

          let point1x, point1y, point2x, point2y;
          if (workspace.desiredPoints["0,0"]) {
            point1x = workspace.desiredPoints["0,0"];
          } else {
            point1x = points[0][0];
          }
          if (workspace.desiredPoints["0,1"]) {
            point1y = workspace.desiredPoints["0,1"];
          } else {
            point1y = points[0][1];
          }
          if (workspace.desiredPoints["1,0"]) {
            point2x = workspace.desiredPoints["1,0"];
          } else {
            point2x = points[1][0];
          }
          if (workspace.desiredPoints["1,1"]) {
            point2y = workspace.desiredPoints["1,1"];
          } else {
            point2y = points[1][1];
          }

          if (
            typeof point1x.tree === "number" &&
            typeof point1y.tree === "number" &&
            typeof point2x.tree === "number" &&
            typeof point2y.tree === "number"
          ) {
            let numericalPoint1 = [point1x.tree, point1y.tree];
            let numericalPoint2 = [point2x.tree, point2y.tree];

            let coeffvar1 = numericalPoint1[1] - numericalPoint2[1];
            let coeffvar2 = numericalPoint2[0] - numericalPoint1[0];
            let coeff0 =
              numericalPoint1[0] * numericalPoint2[1] -
              numericalPoint1[1] * numericalPoint2[0];

            let sVCoeffVar1 = await stateValues.coeffvar1;
            let sVCoeffVar2 = await stateValues.coeffvar2;

            let prodDiff = Math.abs(
              coeffvar1 * sVCoeffVar2 - sVCoeffVar1 * coeffvar2,
            );

            let instructions = [];

            if (prodDiff < Math.abs(coeffvar1 * sVCoeffVar2) * 1e-12) {
              // the slope didn't change, so line was translated
              // don't change coeffvar1 or coeffvar2, but just coeff0

              if (coeffvar1 !== 0) {
                coeff0 *= sVCoeffVar1 / coeffvar1;
              } else {
                coeff0 *= sVCoeffVar2 / coeffvar2;
              }

              instructions.push({
                setDependency: "coeff0",
                desiredValue: coeff0,
                additionalDependencyValues: {
                  coeffvar1: sVCoeffVar1,
                  coeffvar2: sVCoeffVar2,
                },
              });
            } else {
              instructions.push({
                setDependency: "coeff0",
                desiredValue: coeff0,
                additionalDependencyValues: {
                  coeffvar1,
                  coeffvar2,
                },
              });
            }

            instructions.push({
              setDependency: "lastPointsFromInverting",
              desiredValue: [numericalPoint1, numericalPoint2],
            });

            return {
              success: true,
              instructions,
            };
          }

          let coeffvar1 = point1y.subtract(point2y).simplify();
          let coeffvar2 = point2x.subtract(point1x).simplify();
          let coeff0 = point1x
            .multiply(point2y)
            .subtract(point1y.multiply(point2x))
            .simplify();

          return {
            success: true,
            instructions: [
              {
                setDependency: "coeff0",
                desiredValue: coeff0,
                additionalDependencyValues: {
                  coeffvar1,
                  coeffvar2,
                },
              },
            ],
          };
        } else {
          // no coeff0, so must depend on through points

          let instructions = [];

          // process in reverse order so x-coordinate and first point
          // are processed last and take precedence
          for (let arrayKey of Object.keys(
            desiredStateVariableValues.points,
          ).reverse()) {
            let [pointInd, dim] = arrayKey.split(",");
            let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

            if (
              dependencyValuesByKey[arrayKey].through !== null &&
              dependencyValuesByKey[arrayKey].through.stateValues[
                "pointX" + varEnding
              ]
            ) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].through,
                desiredValue: desiredStateVariableValues.points[arrayKey],
                variableIndex: 0,
              });
            } else if (globalDependencyValues.basedOnSlope) {
              if (pointInd === "0") {
                instructions.push({
                  setDependency: dependencyNamesByKey[arrayKey].essentialPoint,
                  desiredValue: desiredStateVariableValues.points[arrayKey],
                  variableIndex: 0,
                });
              } else {
                let val = desiredStateVariableValues.points[arrayKey];
                if (val instanceof me.class) {
                  val = val.evaluate_to_constant();
                }

                if (!workspace.desiredPoint1) {
                  workspace.desiredPoint1 = [];
                }

                workspace.desiredPoint1[dim] = val;

                let oDim = dim === "0" ? "1" : "0";
                if (workspace.desiredPoint1[oDim] === undefined) {
                  let oVal = (await stateValues.points)[1][
                    oDim
                  ].evaluate_to_constant();
                  workspace.desiredPoint1[oDim] = oVal;
                }

                if (workspace.desiredPoint1.every(Number.isFinite)) {
                  let xOther = (
                    await stateValues.points
                  )[0][0].evaluate_to_constant();
                  let yOther = (
                    await stateValues.points
                  )[0][1].evaluate_to_constant();
                  if (Number.isFinite(xOther) && Number.isFinite(yOther)) {
                    let dx = workspace.desiredPoint1[0] - xOther;
                    let dy = workspace.desiredPoint1[1] - yOther;
                    let dForSlope = Math.sqrt(dx * dx + dy * dy);
                    if (dx !== 0) {
                      dForSlope *= Math.sign(dx);
                    }

                    instructions.push({
                      setDependency: dependencyNamesByKey[arrayKey].dForSlope,
                      desiredValue: dForSlope,
                    });
                    instructions.push({
                      setDependency: dependencyNamesByKey[arrayKey].slopeAttr,
                      desiredValue: dy / dx,
                      variableIndex: 0,
                    });
                  }
                }
              }
            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].essentialPoint,
                desiredValue: desiredStateVariableValues.points[arrayKey],
              });
            }
          }

          return {
            success: true,
            instructions,
          };
        }
      },
    };

    stateVariableDefinitions.equation = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      stateVariablesDeterminingDependencies: ["equationIdentity"],
      additionalStateVariablesDefined: [
        {
          variableName: "coeff0",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
              returnRoundingAttributeComponentShadowing(),
          },
        },
        {
          variableName: "coeffvar1",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
              returnRoundingAttributeComponentShadowing(),
          },
        },
        {
          variableName: "coeffvar2",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
              returnRoundingAttributeComponentShadowing(),
          },
        },
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          variables: {
            dependencyType: "stateVariable",
            variableName: "variables",
          },
        };
        if (stateValues.equationIdentity === null) {
          dependencies.points = {
            dependencyType: "stateVariable",
            variableName: "points",
          };
          dependencies.numDimensions = {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          };
        } else {
          dependencies.equation = {
            dependencyType: "attributeComponent",
            attributeName: "equation",
            variableNames: ["value"],
          };
        }
        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        // console.log(`definition of equation for ${componentName}`)
        // console.log(dependencyValues);

        let variables = dependencyValues.variables;

        let blankMath = me.fromAst("\uff3f");

        if (dependencyValues.equation) {
          let equation = dependencyValues.equation.stateValues.value;

          let result = calculateCoeffsFromEquation({ equation, variables });

          if (!result.success) {
            return {
              setValue: {
                equation,
                coeff0: blankMath,
                coeffvar1: blankMath,
                coeffvar2: blankMath,
              },
            };
          }

          let { coeff0, coeffvar1, coeffvar2 } = result;
          return {
            setValue: {
              equation,
              coeff0,
              coeffvar1,
              coeffvar2,
            },
          };
        }

        // have two points
        let numDimens = dependencyValues.numDimensions;

        if (Number.isNaN(numDimens)) {
          console.warn("Line through points of undetermined dimensions");
          return {
            setValue: {
              equation: blankMath,
              coeff0: blankMath,
              coeffvar1: blankMath,
              coeffvar2: blankMath,
            },
          };
        }

        if (numDimens < 2) {
          console.warn(
            "Line must be through points of at least two dimensions",
          );
          return {
            setValue: {
              equation: blankMath,
              coeff0: blankMath,
              coeffvar1: blankMath,
              coeffvar2: blankMath,
            },
          };
        }

        let point1x = dependencyValues.points[0][0];
        let point1y = dependencyValues.points[0][1];
        let point2x = dependencyValues.points[1][0];
        let point2y = dependencyValues.points[1][1];

        let varStrings = [...variables.map((x) => x.toString())];

        for (let i = 0; i < numDimens; i++) {
          if (
            point1x.variables().indexOf(varStrings[i]) !== -1 ||
            point1y.variables().indexOf(varStrings[i]) !== -1 ||
            point2x.variables().indexOf(varStrings[i]) !== -1 ||
            point2y.variables().indexOf(varStrings[i]) !== -1
          ) {
            console.warn(
              "Points through line depend on variables: " +
                varStrings.join(", "),
            );
            return {
              setValue: {
                equation: blankMath,
                coeff0: blankMath,
                coeffvar1: blankMath,
                coeffvar2: blankMath,
              },
            };
          }
        }

        if (numDimens !== 2) {
          // no equation if not in 2D
          return {
            setValue: {
              equation: blankMath,
              coeff0: blankMath,
              coeffvar1: blankMath,
              coeffvar2: blankMath,
            },
          };
        }

        if (point1x.equals(point2x) && point1y.equals(point2y)) {
          // points are equal, so equation is undefined.  Set all coordinates to 0
          let zero = me.fromAst(0);
          return {
            setValue: {
              equation: blankMath,
              coeff0: zero,
              coeffvar1: zero,
              coeffvar2: zero,
            },
          };
        }

        // TODO: somehow normalize the equation for the line
        // at least for case where coeffs are numbers
        // Maybe detect case where coeffs are numbers so can do these calculation faster?

        let coeffvar1 = point1y.subtract(point2y).simplify();
        let coeffvar2 = point2x.subtract(point1x).simplify();
        let coeff0 = point1x
          .multiply(point2y)
          .subtract(point1y.multiply(point2x))
          .simplify();
        // let equation = me.fromAst('ax+by+c=0').substitute({a:coeffvar1, b:coeffvar2, c: coeff0, x: var1, y:var2}).simplify();
        let equation = me
          .fromAst(["=", ["+", ["*", "a", "x"], ["*", "b", "y"], "c"], 0])
          .substitute({
            a: coeffvar1,
            b: coeffvar2,
            c: coeff0,
            x: variables[0],
            y: variables[1],
          })
          .simplify();

        return {
          setValue: {
            equation,
            coeff0,
            coeffvar1,
            coeffvar2,
          },
        };
      },
      inverseDefinition: function ({
        desiredStateVariableValues,
        dependencyValues,
      }) {
        // console.log(`inverse definition of equation, coeffs`);
        // console.log(desiredStateVariableValues)

        if (dependencyValues.points) {
          console.log(
            `Haven't implemented inverse definition of equation of line based on points`,
          );
          return { success: false };
        }

        if (desiredStateVariableValues.equation) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "equation",
                desiredValue: desiredStateVariableValues.equation,
                variableIndex: 0,
              },
            ],
          };
        }

        // if not inverting equation, must be inverting coeffs
        if (
          !(
            "coeff0" in desiredStateVariableValues &&
            "coeffvar1" in desiredStateVariableValues &&
            "coeffvar2" in desiredStateVariableValues
          )
        ) {
          console.log(
            `Haven't implemented inverting coeffs if not specifying all of them`,
          );
          return { success: false };
        }

        let equation = me
          .fromAst(["=", 0, ["+", ["*", "a", "x"], ["*", "b", "y"], "c"]])
          .substitute({
            a: desiredStateVariableValues.coeffvar1,
            b: desiredStateVariableValues.coeffvar2,
            c: desiredStateVariableValues.coeff0,
            x: dependencyValues.variables[0],
            y: dependencyValues.variables[1],
          })
          .simplify();

        return {
          success: true,
          instructions: [
            {
              setDependency: "equation",
              desiredValue: equation,
              variableIndex: 0,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.numericalPoints = {
      isArray: true,
      entryPrefixes: ["numericalPoint"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        if (Number.isNaN(dependencyValues.numDimensions)) {
          return [0];
        }
        return [2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          numDimensions: {
            dependencyType: "stateVariable",
            variableName: "numDimensions",
          },
        };
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            point: {
              dependencyType: "stateVariable",
              variableName: "point" + (Number(arrayKey) + 1),
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },

      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        componentName,
      }) {
        // console.log(`array definition by key of numericalPoints of ${componentName}`)

        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys);

        if (Number.isNaN(globalDependencyValues.numDimensions)) {
          return {};
        }

        let numericalPoints = {};
        for (let arrayKey of arrayKeys) {
          let point = dependencyValuesByKey[arrayKey].point;
          // if we are in 1 dimensions,
          // point isn't an array, so make it an array
          if (!Array.isArray(point)) {
            point = [point];
          }
          let numericalP = [];
          for (let ind = 0; ind < globalDependencyValues.numDimensions; ind++) {
            let val = point[ind].evaluate_to_constant();
            numericalP.push(val);
          }
          numericalPoints[arrayKey] = numericalP;
        }

        return { setValue: { numericalPoints } };
      },
    };

    stateVariableDefinitions.numericalCoeff0 = {
      additionalStateVariablesDefined: [
        "numericalCoeffvar1",
        "numericalCoeffvar2",
      ],
      returnDependencies: () => ({
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0",
        },
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1",
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2",
        },
      }),
      definition: function ({ dependencyValues }) {
        let numericalCoeff0 = dependencyValues.coeff0.evaluate_to_constant();
        let numericalCoeffvar1 =
          dependencyValues.coeffvar1.evaluate_to_constant();
        let numericalCoeffvar2 =
          dependencyValues.coeffvar2.evaluate_to_constant();

        return {
          setValue: { numericalCoeff0, numericalCoeffvar1, numericalCoeffvar2 },
        };
      },
    };

    stateVariableDefinitions.slope = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1",
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2",
        },
      }),
      definition: function ({ dependencyValues }) {
        let slope = me
          .fromAst(["-", ["/", "a", "b"]])
          .substitute({
            a: dependencyValues.coeffvar1,
            b: dependencyValues.coeffvar2,
          })
          .simplify();

        return { setValue: { slope } };
      },
    };

    stateVariableDefinitions.xintercept = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0",
        },
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          xintercept: me
            .fromAst(["-", ["/", "a", "b"]])
            .substitute({
              a: dependencyValues.coeff0,
              b: dependencyValues.coeffvar1,
            })
            .simplify(),
        },
      }),
    };

    stateVariableDefinitions.yintercept = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0",
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          yintercept: me
            .fromAst(["-", ["/", "a", "b"]])
            .substitute({
              a: dependencyValues.coeff0,
              b: dependencyValues.coeffvar2,
            })
            .simplify(),
        },
      }),
    };

    stateVariableDefinitions.lastPointsFromInverting = {
      defaultValue: null,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          lastPointsFromInverting: true,
        },
      }),
      inverseDefinition: ({ desiredStateVariableValues }) => ({
        success: true,
        instructions: [
          {
            setEssentialValue: "lastPointsFromInverting",
            value: desiredStateVariableValues.lastPointsFromInverting,
          },
        ],
      }),
    };

    stateVariableDefinitions.latex = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      returnDependencies: () => ({
        equation: {
          dependencyType: "stateVariable",
          variableName: "equation",
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits",
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals",
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero",
        },
        padZeros: {
          dependencyType: "stateVariable",
          variableName: "padZeros",
        },
      }),
      definition: function ({ dependencyValues }) {
        let params = {};
        if (dependencyValues.padZeros) {
          if (Number.isFinite(dependencyValues.displayDecimals)) {
            params.padToDecimals = dependencyValues.displayDecimals;
          }
          if (dependencyValues.displayDigits >= 1) {
            params.padToDigits = dependencyValues.displayDigits;
          }
        }
        let latex = roundForDisplay({
          value: dependencyValues.equation,
          dependencyValues,
        }).toLatex(params);

        return { setValue: { latex } };
      },
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        numericalCoeff0: {
          dependencyType: "stateVariable",
          variableName: "numericalCoeff0",
        },
        numericalCoeffvar1: {
          dependencyType: "stateVariable",
          variableName: "numericalCoeffvar1",
        },
        numericalCoeffvar2: {
          dependencyType: "stateVariable",
          variableName: "numericalCoeffvar2",
        },
      }),
      definition({ dependencyValues }) {
        let a0 = dependencyValues.numericalCoeffvar1;
        let b0 = dependencyValues.numericalCoeffvar2;
        let c = dependencyValues.numericalCoeff0;
        let constantCoeffs =
          Number.isFinite(a0) && Number.isFinite(b0) && Number.isFinite(c);

        // only implement for
        // - 2D
        // - constant coefficients and
        // - non-degenerate parameters
        let skip =
          dependencyValues.numDimensions !== 2 ||
          !constantCoeffs ||
          (a0 === 0 && b0 === 0);

        return {
          setValue: {
            nearestPoint: function ({ variables, scales = [1, 1] }) {
              if (skip) {
                return {};
              }

              let xscale = scales[0];
              let yscale = scales[1];

              let a = a0 * xscale;
              let b = b0 * yscale;

              let denom = a * a + b * b;

              let x1 = variables.x1?.evaluate_to_constant();
              let x2 = variables.x2?.evaluate_to_constant();

              if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
                return {};
              }

              let x1Effective = x1 / xscale;
              let x2Effective = x2 / yscale;

              let result = {};
              result.x1 =
                ((b * (b * x1Effective - a * x2Effective) - a * c) * xscale) /
                denom;
              result.x2 =
                ((a * (-b * x1Effective + a * x2Effective) - b * c) * yscale) /
                denom;

              if (variables.x3 !== undefined) {
                result.x3 = 0;
              }

              return result;
            },
          },
        };
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "equation",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];

  async moveLine({
    point1coords,
    point2coords,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let desiredPoints = {
      "0,0": me.fromAst(point1coords[0]),
      "0,1": me.fromAst(point1coords[1]),
    };
    if (!(await this.stateValues.basedOnSlope)) {
      desiredPoints["1,0"] = me.fromAst(point2coords[0]);
      desiredPoints["1,1"] = me.fromAst(point2coords[1]);
    }

    // Note: we set skipRendererUpdate to true
    // so that we can make further adjustments before the renderers are updated
    if (transient) {
      await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "points",
            value: desiredPoints,
          },
        ],
        transient: true,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
      });
    } else {
      await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "points",
            value: desiredPoints,
          },
        ],
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
        event: {
          verb: "interacted",
          object: {
            componentId: this.componentName,
          },
          result: {
            point1: point1coords,
            point2: point2coords,
          },
        },
      });
    }

    // we will attempt to keep the slope of the line fixed
    // even if one of the points is constrained
    if (!(await this.stateValues.basedOnSlope)) {
      // based on two points

      let numericalPoints = [point1coords, point2coords];
      let resultingNumericalPoints = await this.stateValues.numericalPoints;

      let pointsChanged = [];
      let numPointsChanged = 0;

      for (let [ind, pt] of numericalPoints.entries()) {
        if (!pt.every((v, i) => v === resultingNumericalPoints[ind][i])) {
          pointsChanged.push(ind);
          numPointsChanged++;
        }
      }

      if (numPointsChanged === 1) {
        // One point was altered from the requested location
        // while the other point stayed at the requested location.
        // We interpret this as one point being constrained and the second one being free
        // and we move the second point to keep their relative position fixed.

        let changedInd = pointsChanged[0];

        let orig1 = numericalPoints[changedInd];
        let changed1 = resultingNumericalPoints[changedInd];
        let changevec1 = orig1.map((v, i) => v - changed1[i]);

        let newNumericalPoints = [];

        for (let i = 0; i < 2; i++) {
          if (i === changedInd) {
            newNumericalPoints.push(resultingNumericalPoints[i]);
          } else {
            newNumericalPoints.push(
              numericalPoints[i].map((v, j) => v - changevec1[j]),
            );
          }
        }

        let newPointComponents = {};
        for (let ind in newNumericalPoints) {
          newPointComponents[ind + ",0"] = me.fromAst(
            newNumericalPoints[ind][0],
          );
          newPointComponents[ind + ",1"] = me.fromAst(
            newNumericalPoints[ind][1],
          );
        }

        let newInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "points",
            value: newPointComponents,
          },
        ];

        return await this.coreFunctions.performUpdate({
          updateInstructions: newInstructions,
          transient,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      }
    }

    // if no modifications were made, still need to update renderers
    // as original update was performed with skipping renderer update
    return await this.coreFunctions.updateRenderers({
      actionId,
      sourceInformation,
      skipRendererUpdate,
    });
  }

  switchLine() {}

  async lineClicked({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "click",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }

    this.coreFunctions.resolveAction({ actionId });
  }

  async lineFocused({
    actionId,
    name,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    if (!(await this.stateValues.fixed)) {
      await this.coreFunctions.triggerChainedActions({
        triggeringAction: "focus",
        componentName: name, // use name rather than this.componentName to get original name if adapted
        actionId,
        sourceInformation,
        skipRendererUpdate,
      });
    }

    this.coreFunctions.resolveAction({ actionId });
  }
}

function calculateCoeffsFromEquation({ equation, variables }) {
  // determine if equation is a linear equation in the variables

  let var1 = variables[0];
  let var2 = variables[1];
  let var1String = var1.toString();
  let var2String = var2.toString();

  equation = equation.expand().simplify();

  if (
    !(
      Array.isArray(equation.tree) &&
      equation.tree[0] === "=" &&
      equation.tree.length === 3
    )
  ) {
    return { success: false };
  }

  let rhs = me
    .fromAst(["+", equation.tree[2], ["-", equation.tree[1]]])
    .expand()
    .simplify();
  // divide rhs into terms

  let terms = [];
  if (Array.isArray(rhs.tree) && rhs.tree[0] === "+") {
    terms = rhs.tree.slice(1);
  } else {
    terms = [rhs.tree];
  }

  let coeffvar1 = me.fromAst(0);
  let coeffvar2 = me.fromAst(0);
  let coeff0 = me.fromAst(0);

  for (let term of terms) {
    let coeffs = getTermCoeffs(term);
    if (!coeffs.success) {
      return { success: false };
    }
    coeffvar1 = coeffvar1.add(coeffs.coeffvar1);
    coeffvar2 = coeffvar2.add(coeffs.coeffvar2);
    coeff0 = coeff0.add(coeffs.coeff0);
  }
  coeffvar1 = coeffvar1.simplify();
  coeffvar2 = coeffvar2.simplify();
  coeff0 = coeff0.simplify();

  return { success: true, coeff0, coeffvar1, coeffvar2 };

  function getTermCoeffs(term) {
    let cv1 = 0,
      cv2 = 0,
      c0 = 0;

    if (typeof term === "string") {
      if (term === var1String) {
        cv1 = 1;
      } else if (term === var2String) {
        cv2 = 1;
      } else {
        c0 = term;
      }
    } else if (typeof term === "number") {
      c0 = term;
    } else if (!Array.isArray(term)) {
      console.warn(
        "Invalid format for equation of line in variables " +
          var1 +
          " and " +
          var2,
      );
      return { success: false };
    } else {
      let operator = term[0];
      let operands = term.slice(1);
      if (operator === "-") {
        let coeffs = getTermCoeffs(operands[0]);
        if (!coeffs.success) {
          return { success: false };
        }
        cv1 = ["-", coeffs.coeffvar1.tree];
        cv2 = ["-", coeffs.coeffvar2.tree];
        c0 = ["-", coeffs.coeff0.tree];
      } else if (operator === "+") {
        console.warn(
          "Invalid format for equation of line in variables " +
            var1 +
            " and " +
            var2,
        );
        return { success: false };
      } else if (operator === "*") {
        let var1ind = -1,
          var2ind = -1;
        for (let i = 0; i < operands.length; i++) {
          if (var1.equals(me.fromAst(operands[i]))) {
            var1ind = i;
            break;
          } else if (var2.equals(me.fromAst(operands[i]))) {
            var2ind = i;
            break;
          }
        }
        if (var1ind !== -1) {
          operands.splice(var1ind, 1);
          if (operands.length === 1) {
            cv1 = operands[0];
          } else {
            cv1 = ["*"].concat(operands);
          }
        } else if (var2ind !== -1) {
          operands.splice(var2ind, 1);
          if (operands.length === 1) {
            cv2 = operands[0];
          } else {
            cv2 = ["*"].concat(operands);
          }
        } else {
          c0 = term;
        }
      } else if (operator === "/") {
        let coeffs = getTermCoeffs(operands[0]);
        if (!coeffs.success) {
          return { success: false };
        }
        cv1 = ["/", coeffs.coeffvar1.tree, operands[1]];
        cv2 = ["/", coeffs.coeffvar2.tree, operands[1]];
        c0 = ["/", coeffs.coeff0.tree, operands[1]];
      } else if (operator === "_") {
        if (var1.equals(me.fromAst(term))) {
          cv1 = 1;
        } else if (var2.equals(me.fromAst(term))) {
          cv2 = 1;
        } else {
          c0 = term;
        }
      } else {
        c0 = term;
      }
    }
    return {
      success: true,
      coeffvar1: me.fromAst(cv1),
      coeffvar2: me.fromAst(cv2),
      coeff0: me.fromAst(c0),
    };
  }
}

function calculatePointsFromCoeffs({
  coeff0,
  coeffvar1,
  coeffvar2,
  variables,
  lastPointsFromInverting,
}) {
  let var1 = variables[0];
  let var2 = variables[1];
  let var1String = var1.toString();
  let var2String = var2.toString();

  // if any of the coefficients have var1 or var2 in them, then it's not a line
  if (
    coeffvar1.variables(true).indexOf(var1String) !== -1 ||
    coeffvar1.variables(true).indexOf(var2String) !== -1 ||
    coeffvar2.variables(true).indexOf(var1String) !== -1 ||
    coeffvar2.variables(true).indexOf(var2String) !== -1 ||
    coeff0.variables(true).indexOf(var1String) !== -1 ||
    coeff0.variables(true).indexOf(var2String) !== -1
  ) {
    console.warn(
      "Invalid format for equation of line in variables " +
        var1String +
        " and " +
        var2String,
    );
    return { success: false };
  }
  let zero = me.fromAst(0);
  if (coeffvar1.equals(zero) && coeffvar2.equals(zero)) {
    console.warn(
      "Invalid format for equation of line in variables " +
        var1String +
        " and " +
        var2String,
    );
    return { success: false };
  }

  // console.log("coefficient of " + var1 + " is " + coeffvar1);
  // console.log("coefficient of " + var2 + " is " + coeffvar2);
  // console.log("constant coefficient is " + coeff0);

  let a = coeffvar1.evaluate_to_constant();
  let b = coeffvar2.evaluate_to_constant();
  let c = coeff0.evaluate_to_constant();

  let point1x, point1y, point2x, point2y;
  let points = {};

  if (Number.isFinite(c) && Number.isFinite(a) && Number.isFinite(b)) {
    let denom = a * a + b * b;
    if (denom === 0) {
      return { success: false };
    }

    if (lastPointsFromInverting) {
      let x1 = lastPointsFromInverting[0][0];
      let x2 = lastPointsFromInverting[0][1];
      point1x = (b * (b * x1 - a * x2) - a * c) / denom;
      point1y = (a * (-b * x1 + a * x2) - b * c) / denom;

      x1 = lastPointsFromInverting[1][0];
      x2 = lastPointsFromInverting[1][1];
      point2x = (b * (b * x1 - a * x2) - a * c) / denom;
      point2y = (a * (-b * x1 + a * x2) - b * c) / denom;
    } else {
      // create two points that equation passes through
      point1x = (2 * b - a * c) / denom;
      point1y = (-2 * a - b * c) / denom;
      point2x = (b - a * c) / denom;
      point2y = -(a + b * c) / denom;
    }

    points["0,0"] = me.fromAst(point1x);
    points["0,1"] = me.fromAst(point1y);
    points["1,0"] = me.fromAst(point2x);
    points["1,1"] = me.fromAst(point2y);
  } else {
    // create two points that equation passes through
    let denom = coeffvar1.pow(2).add(coeffvar2.pow(2));
    point1x = coeffvar2
      .multiply(2)
      .subtract(coeffvar1.multiply(coeff0))
      .divide(denom);
    point1y = coeffvar1
      .multiply(-2)
      .subtract(coeffvar2.multiply(coeff0))
      .divide(denom);
    point2x = coeffvar2.subtract(coeffvar1.multiply(coeff0)).divide(denom);
    point2y = coeffvar1
      .add(coeffvar2.multiply(coeff0))
      .multiply(-1)
      .divide(denom);

    points["0,0"] = point1x;
    points["0,1"] = point1y;
    points["1,0"] = point2x;
    points["1,1"] = point2y;
  }

  return { success: true, points };
}
