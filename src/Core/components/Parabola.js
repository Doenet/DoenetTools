import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import Curve from "./Curve";
import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";

export default class Parabola extends Curve {
  static componentType = "parabola";
  static rendererType = "curve";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.through = {
      createComponentOfType: "_pointListComponent",
    };
    attributes.vertex = {
      createComponentOfType: "point",
      isLocation: true,
      createStateVariable: "prescribedVertex",
      defaultValue: null,
    };

    delete attributes.parMin;
    delete attributes.parMax;
    delete attributes.variable;

    return attributes;
  }

  static returnChildGroups() {
    return GraphicalComponent.returnChildGroups();
  }

  static returnStateVariableDefinitions(args) {
    let stateVariableDefinitions =
      GraphicalComponent.returnStateVariableDefinitions(args);

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    let curveStateVariableDefinitions = super.returnStateVariableDefinitions(
      args,
    );

    // also defines graphXmax, graphYmin, and graphYmax
    stateVariableDefinitions.graphXmin =
      curveStateVariableDefinitions.graphXmin;

    stateVariableDefinitions.styleDescription =
      curveStateVariableDefinitions.styleDescription;

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
          dependencyValues.styleDescription + " parabola";

        return { setValue: { styleDescriptionWithNoun } };
      },
    };

    stateVariableDefinitions.curveType = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { curveType: "function" } }),
    };

    stateVariableDefinitions.parMax = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { parMax: +Infinity } }),
    };

    stateVariableDefinitions.parMin = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { parMin: -Infinity } }),
    };

    // variable to store essential value of a
    // that we can then use its value to calculate b and c
    stateVariableDefinitions.aShadow = {
      defaultValue: 1,
      hasEssential: true,
      isLocation: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          aShadow: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        // console.log('inverse definition of aShadow')
        // console.log(desiredStateVariableValues)
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "aShadow",
              value: desiredStateVariableValues.aShadow,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.numThroughPoints = {
      returnDependencies: () => ({
        throughAttr: {
          dependencyType: "attributeComponent",
          attributeName: "through",
          variableNames: ["numPoints"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.throughAttr === null) {
          return {
            setValue: { numThroughPoints: 0 },
          };
        } else {
          return {
            setValue: {
              numThroughPoints:
                dependencyValues.throughAttr.stateValues.numPoints,
            },
          };
        }
      },
    };

    stateVariableDefinitions.throughPoints = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "throughPointX") {
            return [];
          } else {
            // through point or entire array
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
      entryPrefixes: ["throughPointX", "throughPoint"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "throughPointX") {
          // throughPointX1_2 is the 2nd component of the first through point
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
          // throughPoint3 is all components of the third throughPoint

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
        if (varName === "throughPoints") {
          if (propIndex.length === 1) {
            return "throughPoint" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `throughPointX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 12) === "throughPoint") {
          // could be throughPoint or throughPointX
          let throughPointNum = Number(varName.slice(12));
          if (Number.isInteger(throughPointNum) && throughPointNum > 0) {
            // if propIndex has additional entries, ignore them
            return `throughPointX${throughPointNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints, 2];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          dependenciesByKey[arrayKey] = {
            throughAttr: {
              dependencyType: "attributeComponent",
              attributeName: "through",
              variableNames: ["pointX" + varEnding],
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log(`array definition of throughPoints`)
        // console.log(dependencyValuesByKey)
        // console.log(arrayKeys)

        let throughPoints = {};

        for (let arrayKey of arrayKeys) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          let throughAttr = dependencyValuesByKey[arrayKey].throughAttr;
          if (
            throughAttr !== null &&
            throughAttr.stateValues["pointX" + varEnding]
          ) {
            let numericalVal =
              throughAttr.stateValues[
                "pointX" + varEnding
              ].evaluate_to_constant();
            if (Number.isFinite(numericalVal)) {
              throughPoints[arrayKey] = me.fromAst(numericalVal);
            } else {
              throughPoints[arrayKey] = me.fromAst("\uff3f");
            }
          } else {
            throughPoints[arrayKey] = me.fromAst("\uff3f");
          }
        }

        return { setValue: { throughPoints } };
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        initialChange,
        stateValues,
      }) {
        // console.log('inverse definition of throughPoints')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValuesByKey)

        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.throughPoints) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          if (
            dependencyValuesByKey[arrayKey].throughAttr !== null &&
            dependencyValuesByKey[arrayKey].throughAttr.stateValues[
              "pointX" + varEnding
            ]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].throughAttr,
              desiredValue: desiredStateVariableValues.throughPoints[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            });
          } else {
            return { success: false };
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numericalThroughPoints = {
      isArray: true,
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numThroughPoints",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numThroughPoints];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            throughPoint: {
              dependencyType: "stateVariable",
              variableName: "throughPoint" + (Number(arrayKey) + 1),
            },
          };
        }

        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        let numericalThroughPoints = {};

        for (let arrayKey of arrayKeys) {
          let point = dependencyValuesByKey[arrayKey].throughPoint.map(
            (x) => x.tree,
          );
          if (!point.every((x) => Number.isFinite(x))) {
            point = Array(point.length).fill(NaN);
          }
          numericalThroughPoints[arrayKey] = point;
        }

        return { setValue: { numericalThroughPoints } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
      }) {
        // console.log('inverse definition of numericalThroughPoints')
        // console.log(desiredStateVariableValues)

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.numericalThroughPoints) {
          if (dependencyValuesByKey[arrayKey].throughPoint) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].throughPoint,
              desiredValue: desiredStateVariableValues.numericalThroughPoints[
                arrayKey
              ].map((x) => me.fromAst(x)),
            });
          } else {
            return { success: false };
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numericalPrescribedVertex = {
      returnDependencies: () => ({
        prescribedVertex: {
          dependencyType: "stateVariable",
          variableName: "prescribedVertex",
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.prescribedVertex === null) {
          return { setValue: { numericalPrescribedVertex: null } };
        }

        let x, y;

        try {
          x = dependencyValues.prescribedVertex
            .get_component(0)
            .evaluate_to_constant();
          y = dependencyValues.prescribedVertex
            .get_component(1)
            .evaluate_to_constant();

          if (!(Number.isFinite(x) && Number.isFinite(y))) {
            x = NaN;
            y = NaN;
          }
        } catch (e) {
          x = NaN;
          y = NaN;
        }

        return { setValue: { numericalPrescribedVertex: [x, y] } };
      },
    };

    stateVariableDefinitions.pointsAreNumerical = {
      returnDependencies: () => ({
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints",
        },
        numericalPrescribedVertex: {
          dependencyType: "stateVariable",
          variableName: "numericalPrescribedVertex",
        },
      }),
      definition: ({ dependencyValues }) => ({
        // need to check just the first entry of numericalThroughPoints
        // and numericalPrescribedVertex
        setValue: {
          pointsAreNumerical:
            dependencyValues.numericalThroughPoints.every((x) =>
              Number.isFinite(x[0]),
            ) &&
            (!dependencyValues.numericalPrescribedVertex ||
              Number.isFinite(dependencyValues.numericalPrescribedVertex[0])),
        },
        checkForActualChange: { pointsAreNumerical: true },
      }),
    };

    stateVariableDefinitions.a = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      additionalStateVariablesDefined: [
        {
          variableName: "b",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "number",
            addAttributeComponentsShadowingStateVariables:
              returnRoundingAttributeComponentShadowing(),
          },
          hasEssential: true,
          defaultValue: 0,
        },
        {
          variableName: "c",
          public: true,
          shadowingInstructions: {
            createComponentOfType: "number",
            addAttributeComponentsShadowingStateVariables:
              returnRoundingAttributeComponentShadowing(),
          },
          hasEssential: true,
          defaultValue: 0,
        },
        "realValued",
      ],
      returnDependencies: () => ({
        numericalThroughPoints: {
          dependencyType: "stateVariable",
          variableName: "numericalThroughPoints",
        },
        numericalPrescribedVertex: {
          dependencyType: "stateVariable",
          variableName: "numericalPrescribedVertex",
        },
        pointsAreNumerical: {
          dependencyType: "stateVariable",
          variableName: "pointsAreNumerical",
        },
        aShadow: {
          dependencyType: "stateVariable",
          variableName: "aShadow",
        },
      }),
      definition: function ({ dependencyValues, componentName }) {
        // console.log(`definition of a, b, c, realValued of parabola ${componentName}`)
        // console.log(dependencyValues)

        if (!dependencyValues.pointsAreNumerical) {
          return {
            setValue: {
              a: NaN,
              b: NaN,
              c: NaN,
              realValued: false,
            },
          };
        }

        let a, b, c;
        let realValued = true;

        if (dependencyValues.numericalPrescribedVertex) {
          if (dependencyValues.numericalThroughPoints.length === 0) {
            // only vertex prescribed.
            // create parabola y = a*(x-x1)^2 + y1

            let v = dependencyValues.numericalPrescribedVertex;
            let x1 = v[0];
            let y1 = v[1];

            a = dependencyValues.aShadow;
            b = -2 * a * x1;
            c = a * x1 * x1 + y1;

            return {
              setValue: {
                a,
                b,
                c,
                realValued: true,
              },
            };
          } else {
            // vertex and at least one point prescribed.
            // use the first point and ignore the remaining

            // create parabola y = a*(x-x1)^2 + y1
            // where a is determined by the first point

            let v = dependencyValues.numericalPrescribedVertex;
            let x1 = v[0];
            let y1 = v[1];

            let p1 = dependencyValues.numericalThroughPoints[0];
            let x2 = p1[0];
            let y2 = p1[1];

            a = (y2 - y1) / (x2 - x1) ** 2;
            b = -2 * a * x1;
            c = a * x1 * x1 + y1;

            return {
              setValue: {
                a,
                b,
                c,
                realValued: true,
              },
            };
          }
        }

        if (dependencyValues.numericalThroughPoints.length === 0) {
          // nothing specified.  Create parabola y=a*x^2, by default
          return {
            setValue: {
              a: dependencyValues.aShadow,
              realValued: true,
            },
            useEssentialOrDefaultValue: {
              b: true,
              c: true,
            },
          };
        } else if (dependencyValues.numericalThroughPoints.length === 1) {
          // one point
          // create parabola with point as vertex

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];
          let y1 = p1[1];

          a = dependencyValues.aShadow;
          b = -2 * a * x1;
          c = a * x1 * x1 + y1;

          return {
            setValue: {
              a,
              b,
              c,
              realValued: true,
            },
          };
        } else if (dependencyValues.numericalThroughPoints.length === 2) {
          // two points
          // create parabola through those points with given value of a

          a = dependencyValues.aShadow;

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          if (x1 === x2) {
            if (y1 == y2) {
              b = -2 * a * x1;
              c = a * x12 + y1;
            } else {
              realValued = false;
              a = NaN;
              b = NaN;
              c = NaN;
            }
          } else {
            b = (y1 - y2 - a * (x12 - x22)) / (x1 - x2);
            c = y1 - a * x12 - b * x1;
          }

          return { setValue: { a, b, c, realValued } };
        } else if (dependencyValues.numericalThroughPoints.length === 3) {
          // three points

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];
          let y1 = p1[1];
          let x12 = x1 * x1;

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];
          let y2 = p2[1];
          let x22 = x2 * x2;

          let p3 = dependencyValues.numericalThroughPoints[2];
          let x3 = p3[0];
          let y3 = p3[1];
          let x32 = x3 * x3;

          let u1 = x12 - x32;
          let u2 = x22 - x32;

          let v1 = x1 - x3;
          let v2 = x2 - x3;

          let z1 = y1 - y3;
          let z2 = y2 - y3;

          let det = u1 * v2 - u2 * v1;

          if (det === 0) {
            let foundInconsistentPoints = false;
            let nUniquePoints;
            let ux2, uy2;
            if (x1 === x2) {
              if (y1 === y2) {
                if (x1 === x3) {
                  if (y1 == y3) {
                    nUniquePoints = 1;
                  } else {
                    foundInconsistentPoints = true;
                  }
                } else {
                  nUniquePoints = 2;
                  ux2 = x3;
                  uy2 = y3;
                }
              } else {
                foundInconsistentPoints = true;
              }
            } else if (x1 === x3) {
              if (y1 === y3) {
                nUniquePoints = 2;
                ux2 = x2;
                uy2 = y2;
              } else {
                foundInconsistentPoints = true;
              }
            } else if (x2 === x3) {
              if (y2 === y3) {
                nUniquePoints = 2;
                ux2 = x2;
                uy2 = y2;
              } else {
                foundInconsistentPoints = true;
              }
            } else {
              // can't have all unique points if det = 0
              // so shouldn't reach here
              foundInconsistentPoints = true;
            }

            if (foundInconsistentPoints) {
              realValued = false;
              a = NaN;
              b = NaN;
              c = NaN;
            } else if (nUniquePoints === 1) {
              a = dependencyValues.aShadow;
              b = -2 * a * x1;
              c = a * x1 * x1 + y1;
            } else {
              a = dependencyValues.aShadow;
              b = (y1 - uy2 - a * (x12 - ux2 * ux2)) / (x1 - ux2);
              c = y1 - a * x12 - b * x1;
            }
          } else {
            a = (z1 * v2 - z2 * v1) / det;
            b = (z2 * u1 - z1 * u2) / det;
            c = y1 - b * x1 - a * x12;
          }

          return { setValue: { a, b, c, realValued } };
        } else {
          let warning = {
            message: "Haven't implemented parabola through more than 3 points.",
            level: 1,
          };
          return {
            setValue: {
              a: NaN,
              b: NaN,
              c: NaN,
              realValued: false,
            },
            sendWarnings: [warning],
          };
        }
      },
      inverseDefinition: async function ({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
        workspace,
      }) {
        // console.log('inverse definition of a, b, c, realValued of parabola')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues);
        // console.log(workspace);

        if (!dependencyValues.pointsAreNumerical) {
          return { success: false };
        }

        let desiredNumericalValues = {};

        let findNumericalValue = function (par) {
          if (Number.isFinite(par)) {
            return { success: true, value: par };
          } else if (par instanceof me.class) {
            let val = par.evaluate_to_constant();
            if (Number.isFinite(val)) {
              return { success: true, value: val };
            }
          }
          return { success: false };
        };

        if (desiredStateVariableValues.a !== undefined) {
          let numerical = findNumericalValue(desiredStateVariableValues.a);
          if (numerical.success) {
            desiredNumericalValues.a = numerical.value;
          } else {
            return { success: false };
          }
        }
        if (desiredStateVariableValues.b !== undefined) {
          let numerical = findNumericalValue(desiredStateVariableValues.b);
          if (numerical.success) {
            desiredNumericalValues.b = numerical.value;
          } else {
            return { success: false };
          }
        }
        if (desiredStateVariableValues.c !== undefined) {
          let numerical = findNumericalValue(desiredStateVariableValues.c);
          if (numerical.success) {
            desiredNumericalValues.c = numerical.value;
          } else {
            return { success: false };
          }
        }

        Object.assign(workspace, desiredNumericalValues);

        let getWorkingParameterValue = async function (parName) {
          if (workspace[parName] !== undefined) {
            return workspace[parName];
          } else {
            return await stateValues[parName];
          }
        };

        if (dependencyValues.numericalThroughPoints.length === 0) {
          let instructions = [];

          if (desiredNumericalValues.a !== undefined) {
            instructions.push({
              setDependency: "aShadow",
              desiredValue: desiredNumericalValues.a,
            });
          }
          if (desiredNumericalValues.b !== undefined) {
            instructions.push({
              setEssentialValue: "b",
              value: desiredNumericalValues.b,
            });
          }
          if (desiredNumericalValues.c !== undefined) {
            instructions.push({
              setEssentialValue: "c",
              value: desiredNumericalValues.c,
            });
          }
          return {
            success: true,
            instructions,
          };
        } else if (dependencyValues.numericalThroughPoints.length === 1) {
          // one point
          // move point to be at vertex
          // modify a if changed

          let a = await getWorkingParameterValue("a");
          let b = await getWorkingParameterValue("b");
          let c = await getWorkingParameterValue("c");

          let x1 = -b / (2 * a);
          let y1 = c - (b * b) / (4 * a);

          let instructions = [
            {
              setDependency: "numericalThroughPoints",
              desiredValue: [[x1, y1]],
            },
          ];

          if (desiredNumericalValues.a !== undefined) {
            instructions.push({
              setDependency: "aShadow",
              desiredValue: desiredNumericalValues.a,
            });
          }

          return {
            success: true,
            instructions,
          };
        } else if (dependencyValues.numericalThroughPoints.length === 2) {
          // two points
          // move points vertically to be on parabola
          // modify a if changed
          // Exception, if points are identical, make them be at vertex

          let a = await getWorkingParameterValue("a");
          let b = await getWorkingParameterValue("b");
          let c = await getWorkingParameterValue("c");

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];

          if (x1 === x2) {
            x1 = -b / (2 * a);
            let y1 = c - (b * b) / (4 * a);

            let instructions = [
              {
                setDependency: "numericalThroughPoints",
                desiredValue: [
                  [x1, y1],
                  [x1, y1],
                ],
              },
            ];

            if (desiredNumericalValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredNumericalValues.a,
              });
            }

            return {
              success: true,
              instructions,
            };
          } else {
            let y1 = a * x1 * x1 + b * x1 + c;
            let y2 = a * x2 * x2 + b * x2 + c;

            let instructions = [
              {
                setDependency: "numericalThroughPoints",
                desiredValue: [
                  [x1, y1],
                  [x2, y2],
                ],
              },
            ];

            if (desiredNumericalValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredNumericalValues.a,
              });
            }

            return {
              success: true,
              instructions,
            };
          }
        } else if (dependencyValues.numericalThroughPoints.length === 3) {
          // three points
          // move points vertically to be on parabola
          // Exceptions if some points are identical

          let a = await getWorkingParameterValue("a");
          let b = await getWorkingParameterValue("b");
          let c = await getWorkingParameterValue("c");

          let p1 = dependencyValues.numericalThroughPoints[0];
          let x1 = p1[0];

          let p2 = dependencyValues.numericalThroughPoints[1];
          let x2 = p2[0];

          let p3 = dependencyValues.numericalThroughPoints[2];
          let x3 = p3[0];

          let nUniquePoints = 3;
          let nonIdenticalPointInd; // (for case with two unique points)
          if (x1 === x2) {
            if (x1 === x3) {
              nUniquePoints = 1;
            } else {
              nUniquePoints = 2;
              nonIdenticalPointInd = 3;
            }
          } else if (x1 === x3) {
            nUniquePoints = 2;
            nonIdenticalPointInd = 2;
          } else if (x2 === x3) {
            nUniquePoints = 2;
            nonIdenticalPointInd = 1;
          }

          if (nUniquePoints === 3) {
            let y1 = a * x1 * x1 + b * x1 + c;
            let y2 = a * x2 * x2 + b * x2 + c;
            let y3 = a * x3 * x3 + b * x3 + c;

            let instructions = [
              {
                setDependency: "numericalThroughPoints",
                desiredValue: [
                  [x1, y1],
                  [x2, y2],
                  [x3, y3],
                ],
              },
            ];

            // even though don't use a in computation of parabola
            // when have three unique points
            // still set aShadow in case two points become identical
            if (desiredNumericalValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredNumericalValues.a,
              });
            }
            return {
              success: true,
              instructions,
            };
          } else if (nUniquePoints === 2) {
            if (nonIdenticalPointInd === 1) {
              let ux1 = x1,
                ux2 = x2;
              let uy1 = a * ux1 * ux1 + b * ux1 + c;
              let uy2 = a * ux2 * ux2 + b * ux2 + c;

              let instructions = [
                {
                  setDependency: "numericalThroughPoints",
                  desiredValue: [
                    [ux1, uy1],
                    [ux2, uy2],
                    [ux2, uy2],
                  ],
                },
              ];

              if (desiredNumericalValues.a !== undefined) {
                instructions.push({
                  setDependency: "aShadow",
                  desiredValue: desiredNumericalValues.a,
                });
              }
              return {
                success: true,
                instructions,
              };
            } else if (nonIdenticalPointInd === 2) {
              let ux1 = x1,
                ux2 = x2;
              let uy1 = a * ux1 * ux1 + b * ux1 + c;
              let uy2 = a * ux2 * ux2 + b * ux2 + c;

              let instructions = [
                {
                  setDependency: "numericalThroughPoints",
                  desiredValue: [
                    [ux1, uy1],
                    [ux2, uy2],
                    [ux1, uy1],
                  ],
                },
              ];

              if (desiredNumericalValues.a !== undefined) {
                instructions.push({
                  setDependency: "aShadow",
                  desiredValue: desiredNumericalValues.a,
                });
              }
              return {
                success: true,
                instructions,
              };
            } else {
              // nonIdenticalPointInd === 3
              let ux1 = x1,
                ux2 = x3;
              let uy1 = a * ux1 * ux1 + b * ux1 + c;
              let uy2 = a * ux2 * ux2 + b * ux2 + c;

              let instructions = [
                {
                  setDependency: "numericalThroughPoints",
                  desiredValue: [
                    [ux1, uy1],
                    [ux1, uy1],
                    [ux2, uy2],
                  ],
                },
              ];

              if (desiredNumericalValues.a !== undefined) {
                instructions.push({
                  setDependency: "aShadow",
                  desiredValue: desiredNumericalValues.a,
                });
              }
              return {
                success: true,
                instructions,
              };
            }
          } else {
            // one unique point: make point be at vertex
            x1 = -b / (2 * a);
            let y1 = c - (b * b) / (4 * a);

            let instructions = [
              {
                setDependency: "numericalThroughPoints",
                desiredValue: [
                  [x1, y1],
                  [x1, y1],
                  [x1, y1],
                ],
              },
            ];

            if (desiredNumericalValues.a !== undefined) {
              instructions.push({
                setDependency: "aShadow",
                desiredValue: desiredNumericalValues.a,
              });
            }

            return {
              success: true,
              instructions,
            };
          }
        } else {
          return { success: false };
        }
      },
    };

    stateVariableDefinitions.vertex = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "vertexX") {
            return [];
          } else {
            // entire array
            // wrap by both <point> and <xs>
            return [
              ["point", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["vertexX"],
      returnArraySizeDependencies: () => ({}),
      returnArraySize() {
        return [2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          a: {
            dependencyType: "stateVariable",
            variableName: "a",
          },
          b: {
            dependencyType: "stateVariable",
            variableName: "b",
          },
          c: {
            dependencyType: "stateVariable",
            variableName: "c",
          },
          realValued: {
            dependencyType: "stateVariable",
            variableName: "realValued",
          },
        };
        return { globalDependencies };
      },
      arrayDefinitionByKey: function ({ globalDependencyValues }) {
        let vertex = {};

        if (
          globalDependencyValues.realValued &&
          globalDependencyValues.a !== 0
        ) {
          vertex[0] = me.fromAst(
            -globalDependencyValues.b / (2 * globalDependencyValues.a),
          );
          vertex[1] = me.fromAst(
            globalDependencyValues.c -
              globalDependencyValues.b ** 2 / (4 * globalDependencyValues.a),
          );
        } else {
          vertex[0] = me.fromAst("\uff3f");
          vertex[1] = me.fromAst("\uff3f");
        }
        return { setValue: { vertex } };
      },
      inverseArrayDefinitionByKey: async function ({
        desiredStateVariableValues,
        globalDependencyValues,
        workspace,
        stateValues,
      }) {
        // console.log(`inverse definition of parabola vertex`)
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues)

        // change b and c to match vertex

        let x;
        if ("0" in desiredStateVariableValues.vertex) {
          x = desiredStateVariableValues.vertex[0].evaluate_to_constant();
        } else if (workspace.x !== undefined) {
          x = workspace.x;
        } else {
          x = (await stateValues.vertex)[0].tree;
        }
        if (Number.isFinite(x)) {
          workspace.x = x;
        } else {
          return { success: false };
        }

        let y;
        if ("1" in desiredStateVariableValues.vertex) {
          y = desiredStateVariableValues.vertex[1].evaluate_to_constant();
        } else if (workspace.y !== undefined) {
          y = workspace.y;
        } else {
          y = (await stateValues.vertex)[1].tree;
        }
        if (Number.isFinite(y)) {
          workspace.y = y;
        } else {
          return { success: false };
        }

        let a = globalDependencyValues.a;
        let b = -2 * a * x;
        let c = y + a * x * x;

        return {
          success: true,
          instructions: [
            {
              setDependency: "b",
              desiredValue: b,
              additionalDependencyValues: { c: c },
            },
          ],
        };
      },
    };

    stateVariableDefinitions.equation = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      // TODO: implement additional properties
      additionalProperties: {
        simplify: "numberspreserveorder",
        displaysmallaszero: true,
      },

      returnDependencies: () => ({
        a: {
          dependencyType: "stateVariable",
          variableName: "a",
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b",
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c",
        },
      }),
      definition: function ({ dependencyValues }) {
        let ast = [
          "=",
          "y",
          [
            "+",
            ["*", dependencyValues.a, ["^", "x", 2]],
            ["*", dependencyValues.b, "x"],
            dependencyValues.c,
          ],
        ];

        let equation = me
          .fromAst(ast)
          .evaluate_numbers({ skip_ordering: true });

        return { setValue: { equation } };
      },
    };

    stateVariableDefinitions.fs = {
      forRenderer: true,
      isArray: true,
      entryPrefixes: ["f"],
      additionalStateVariablesDefined: [
        {
          variableName: "fDefinitions",
          isArray: true,
          forRenderer: true,
        },
      ],
      returnArraySizeDependencies: () => ({}),
      returnArraySize: () => [1],
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          a: {
            dependencyType: "stateVariable",
            variableName: "a",
          },
          b: {
            dependencyType: "stateVariable",
            variableName: "b",
          },
          c: {
            dependencyType: "stateVariable",
            variableName: "c",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        let f = function (x) {
          return (
            globalDependencyValues.a * x * x +
            globalDependencyValues.b * x +
            globalDependencyValues.c
          );
        };

        return {
          setValue: {
            fs: [f],
            fDefinitions: [
              {
                functionType: "formula",
                formula: [
                  "+",
                  ["*", globalDependencyValues.a, "x", "x"],
                  ["*", globalDependencyValues.b, "x"],
                  globalDependencyValues.c,
                ],
                variables: ["x"],
                numInputs: 1,
                numOutputs: 1,
                domain: null,
              },
            ],
          },
        };
      },
    };

    stateVariableDefinitions.f = {
      isAlias: true,
      targetVariableName: "f1",
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        f: {
          dependencyType: "stateVariable",
          variableName: "f",
        },
        a: {
          dependencyType: "stateVariable",
          variableName: "a",
        },
        b: {
          dependencyType: "stateVariable",
          variableName: "b",
        },
        c: {
          dependencyType: "stateVariable",
          variableName: "c",
        },
      }),
      definition({ dependencyValues, componentName }) {
        let skip = !(
          Number.isFinite(dependencyValues.a) &&
          Number.isFinite(dependencyValues.b) &&
          Number.isFinite(dependencyValues.c)
        );

        return {
          setValue: {
            nearestPoint: function ({ variables, scales }) {
              if (skip) {
                return {};
              }

              let xscale = scales[0];
              let yscale = scales[1];

              let x1 = variables.x1?.evaluate_to_constant();
              let x2 = variables.x2?.evaluate_to_constant();

              if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
                return {};
              }

              x1 /= xscale;
              x2 /= yscale;

              let a0 = (dependencyValues.a * xscale * xscale) / yscale;
              let b0 = (dependencyValues.b * xscale) / yscale;
              let c0 = dependencyValues.c / yscale;

              if (a0 === 0) {
                // have line y = b0*x+c0

                let denom = b0 * b0 + 1;

                let result = {};
                result.x1 = ((x1 + b0 * x2 - b0 * c0) / denom) * xscale;
                result.x2 = ((b0 * (x1 + b0 * x2) + c0) / denom) * yscale;

                if (variables.x3 !== undefined) {
                  result.x3 = 0;
                }

                return result;
              }

              let d2 = c0 - x2;
              let a = 2 * a0 ** 2;
              let b = (3 * a0 * b0) / a;
              let c = (2 * a0 * d2 + b0 ** 2 + 1) / a;
              let d = (b0 * d2 - x1) / a;

              let resultCardano = cardano(b, c, d, 1e-14);

              let x1AtMin = resultCardano[0];
              let x2AtMin = dependencyValues.f(x1AtMin * xscale) / yscale;
              let d2AtMin = (x1 - x1AtMin) ** 2 + (x2 - x2AtMin) ** 2;

              for (let r of resultCardano.slice(1)) {
                let x = r;
                let fx = dependencyValues.f(x * xscale) / yscale;
                let d2 = (x1 - x) ** 2 + (x2 - fx) ** 2;
                if (d2 < d2AtMin) {
                  x1AtMin = x;
                  x2AtMin = fx;
                  d2AtMin = d2;
                }
              }

              let result = {
                x1: x1AtMin * xscale,
                x2: x2AtMin * yscale,
              };
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

  // parameterizationMin = 0;
  // parameterizationMax = 1;
  // parameterizationPeriodic = true;
}

// function cardano is from linalg.js:

/*
 * Copyright (c) 2020 Joseph Rabinoff
 * All rights reserved
 *
 * This file is part of linalg.js.
 *
 * linalg.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * linalg.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with linalg.js.  If not, see <https://www.gnu.org/licenses/>.
 */

function cardano(b, c, d, ε = 1e-10) {
  // Change of variables x --> x-b/3
  const [p, q] = [
    (-1 / 3) * b * b + c,
    (2 / 27) * b * b * b - (1 / 3) * b * c + d,
  ];
  // Now we're solving x^3 + px + q

  // Handle roots at zero
  if (Math.abs(q) <= ε) {
    if (Math.abs(p) <= ε) return [-b / 3]; // Triple root
    let s = Math.sqrt(Math.abs(p));
    if (p < 0) return [-s - b / 3, -b / 3, s - b / 3];
    // Edit: return only real
    return [-b / 3];
  }

  // Discriminant
  const Δ = -27 * q * q - 4 * p * p * p;
  if (Math.abs(Δ) <= ε) {
    // Simple root and double root
    const cr = Math.cbrt(-q / 2);
    return [2 * cr - b / 3, -cr - b / 3];
  }

  if (Δ > 0) {
    // Three distinct real roots: 2*Re(cube roots of -q/2 + i sqrt(Δ/108))
    const D = Math.sqrt(Δ / 108);
    const mod = Math.sqrt(Math.cbrt((q * q) / 4 + Δ / 108)) * 2;
    const arg = Math.atan2(D, -q / 2);
    return [
      Math.cos(arg / 3),
      Math.cos(arg / 3 + (2 * Math.PI) / 3),
      Math.cos(arg / 3 - (2 * Math.PI) / 3),
    ]
      .sort((x, y) => x - y)
      .map((x) => mod * x - b / 3);
  }

  // Simple real root and conjugate complex roots
  // Edit: just return real root
  const D = Math.sqrt(-Δ / 108);
  const α = Math.cbrt(-q / 2 + D),
    β = Math.cbrt(-q / 2 - D),
    r = α + β - b / 3;
  return [r];
  // let ret = [[C(α + β), 1]];
  // const z = ζ.clone().scale(α).add(ζ.clone().conj().scale(β)).sub(b / 3);
  // if (z.Im < 0) z.conj();
  // return (r <= z.Re ? [r, z, z.clone().conj()] : [z, z.clone().conj(), r])
  //   .map(x => [x, 1]);
}
