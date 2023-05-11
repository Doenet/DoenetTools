import { returnRoundingAttributeComponentShadowing } from "../utils/rounding";
import Polygon from "./Polygon";
import me from "math-expressions";

export default class RegularPolygon extends Polygon {
  static componentType = "regularPolygon";
  static rendererType = "polygon";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.numVertices = {
      createComponentOfType: "integer",
    };

    attributes.nSides = {
      createComponentOfType: "integer",
    };

    // Note: vertices is already an attribute from polygon

    attributes.center = {
      createComponentOfType: "point",
    };

    // if center and vertex or two vertices are specified
    // then the following size attributes are ignored

    // circumradius and radrius are the same thing and either attribute can be used
    // If both specified, circumradius is used
    attributes.circumradius = {
      createComponentOfType: "number",
    };
    attributes.radius = {
      createComponentOfType: "number",
    };

    // inradius and apothem are the same thing and either attribute can be used
    // If both specified, inradius is used.
    // If circumradius is specified, inradius is ignored
    attributes.inradius = {
      createComponentOfType: "number",
    };
    attributes.apothem = {
      createComponentOfType: "number",
    };

    // if circumradius or inradius is specified, sideLength is ignored
    attributes.sideLength = {
      createComponentOfType: "number",
    };

    // if circumradius, inradius, or sideLength is specified, perimeter is ignored
    attributes.perimeter = {
      createComponentOfType: "number",
    };

    // if circumradius, inradius, sideLength, or perimeter is specified, area is ignored
    attributes.area = {
      createComponentOfType: "number",
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let styleDescriptionWithNounDeps =
      stateVariableDefinitions.styleDescriptionWithNoun.returnDependencies();
    styleDescriptionWithNounDeps.nSides = {
      dependencyType: "stateVariable",
      variableName: "nSides",
    };

    stateVariableDefinitions.styleDescriptionWithNoun.returnDependencies = () =>
      styleDescriptionWithNounDeps;

    let styleDescriptionWithNounDef =
      stateVariableDefinitions.styleDescriptionWithNoun.definition;

    stateVariableDefinitions.styleDescriptionWithNoun.definition = function ({
      dependencyValues,
    }) {
      let styleDescriptionWithNoun = styleDescriptionWithNounDef({
        dependencyValues,
      }).setValue.styleDescriptionWithNoun;

      styleDescriptionWithNoun = styleDescriptionWithNoun.replaceAll(
        "polygon",
        `${dependencyValues.nSides}-sided regular polygon`,
      );

      return { setValue: { styleDescriptionWithNoun } };
    };

    stateVariableDefinitions.numVertices = {
      isLocation: true,
      hasEssential: true,
      defaultValue: 3,
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        numVerticesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "numVertices",
          variableNames: ["value"],
        },
        nSidesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "nSides",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.numVerticesAttr) {
          return {
            setValue: {
              numVertices: dependencyValues.numVerticesAttr.stateValues.value,
            },
          };
        } else if (dependencyValues.nSidesAttr) {
          return {
            setValue: {
              numVertices: dependencyValues.nSidesAttr.stateValues.value,
            },
          };
        } else {
          return {
            useEssentialOrDefaultValue: { numVertices: true },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.numVerticesAttr) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "numVerticesAttr",
                desiredValue: desiredStateVariableValues.numVertices,
                variableIndex: 0,
              },
            ],
          };
        } else if (dependencyValues.nSidesAttr) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "nSidesAttr",
                desiredValue: desiredStateVariableValues.numVertices,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return {
            success: true,
            instructions: [
              {
                setEssentialValue: "numVertices",
                value: desiredStateVariableValues.numVertices,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.nSides = {
      isAlias: true,
      targetVariableName: "numVertices",
    };

    stateVariableDefinitions.numVerticesSpecified = {
      returnDependencies: () => ({
        verticesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "vertices",
          variableNames: ["numPoints"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.verticesAttr !== null) {
          return {
            setValue: {
              numVerticesSpecified:
                dependencyValues.verticesAttr.stateValues.numPoints,
            },
          };
        } else {
          return { setValue: { numVerticesSpecified: 0 } };
        }
      },
    };

    stateVariableDefinitions.essentialDirection = {
      isArray: true,
      isLocation: true,
      entryPrefixes: ["essentialVertexX"],
      defaultValueByArrayKey: () => 0,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        numVerticesSpecified: {
          dependencyType: "stateVariable",
          variableName: "numVerticesSpecified",
        },
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter",
        },
      }),
      returnArraySize({ dependencyValues }) {
        let needDir =
          (dependencyValues.haveSpecifiedCenter ? 1 : 0) +
            dependencyValues.numVerticesSpecified <=
          1;
        return [needDir ? 2 : 0];
      },

      returnArrayDependenciesByKey() {
        return {};
      },

      arrayDefinitionByKey: function ({ arrayKeys }) {
        let essentialDirection = {};

        for (let arrayKey of arrayKeys) {
          if (arrayKey === "0") {
            essentialDirection[arrayKey] = { defaultValue: 1 };
          } else {
            // uses defaultValueByArrayKey
            essentialDirection[arrayKey] = true;
          }
        }
        return { useEssentialOrDefaultValue: { essentialDirection } };
      },

      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.essentialDirection) {
          instructions.push({
            setEssentialValue: "essentialDirection",
            value: {
              [arrayKey]:
                desiredStateVariableValues.essentialDirection[arrayKey],
            },
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.haveSpecifiedCenter = {
      returnDependencies: () => ({
        centerAttr: {
          dependencyType: "attributeComponent",
          attributeName: "center",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          haveSpecifiedCenter: dependencyValues.centerAttr !== null,
        },
      }),
    };

    stateVariableDefinitions.specifiedCenter = {
      isArray: true,
      isLocation: true,
      entryPrefixes: ["specifiedCenterX"],
      returnArraySizeDependencies: () => ({
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.haveSpecifiedCenter ? 2 : 0];
      },

      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            centerAttr: {
              dependencyType: "attributeComponent",
              attributeName: "center",
              variableNames: ["x" + varEnding],
            },
          };
        }

        return { dependenciesByKey };
      },

      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {
        let specifiedCenter = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (dependencyValuesByKey[arrayKey].centerAttr !== null) {
            specifiedCenter[arrayKey] =
              dependencyValuesByKey[arrayKey].centerAttr.stateValues[
                "x" + varEnding
              ].evaluate_to_constant();
          }
        }

        return { setValue: { specifiedCenter } };
      },

      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.specifiedCenter) {
          if (
            dependencyValuesByKey[arrayKey].centerAttr &&
            dependencyValuesByKey[arrayKey].centerAttr !== null
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].centerAttr,
              desiredValue: me.fromAst(
                desiredStateVariableValues.specifiedCenter[arrayKey],
              ),
              variableIndex: 0,
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.essentialCenter = {
      isArray: true,
      isLocation: true,
      entryPrefixes: ["essentialCenterX"],
      defaultValueByArrayKey: () => 0,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.haveSpecifiedCenter ? 0 : 2];
      },

      returnArrayDependenciesByKey() {
        return {};
      },

      arrayDefinitionByKey: function ({ arrayKeys }) {
        let essentialCenter = {};

        for (let arrayKey of arrayKeys) {
          essentialCenter[arrayKey] = true;
        }
        return { useEssentialOrDefaultValue: { essentialCenter } };
      },

      inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.essentialCenter) {
          instructions.push({
            setEssentialValue: "essentialCenter",
            value: {
              [arrayKey]: desiredStateVariableValues.essentialCenter[arrayKey],
            },
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.specifiedCircumradius = {
      isLocation: true,
      returnDependencies() {
        return {
          circumradiusAttr: {
            dependencyType: "attributeComponent",
            attributeName: "circumradius",
            variableNames: ["value"],
          },
          radiusAttr: {
            dependencyType: "attributeComponent",
            attributeName: "radius",
            variableNames: ["value"],
          },
          numVerticesSpecified: {
            dependencyType: "stateVariable",
            variableName: "numVerticesSpecified",
          },
          haveSpecifiedCenter: {
            dependencyType: "stateVariable",
            variableName: "haveSpecifiedCenter",
          },
        };
      },

      definition({ dependencyValues }) {
        if (dependencyValues.circumradiusAttr !== null) {
          return {
            setValue: {
              specifiedCircumradius:
                dependencyValues.circumradiusAttr.stateValues.value,
            },
          };
        } else if (dependencyValues.radiusAttr !== null) {
          return {
            setValue: {
              specifiedCircumradius:
                dependencyValues.radiusAttr.stateValues.value,
            },
          };
        } else {
          return { setValue: { specifiedCircumradius: null } };
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.circumradiusAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "circumradiusAttr",
                desiredValue: desiredStateVariableValues.specifiedCircumradius,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else if (dependencyValues.radiusAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "radiusAttr",
                desiredValue: desiredStateVariableValues.specifiedCircumradius,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { success: false };
        }
      },
    };

    stateVariableDefinitions.specifiedInradius = {
      isLocation: true,
      returnDependencies() {
        return {
          inradiusAttr: {
            dependencyType: "attributeComponent",
            attributeName: "inradius",
            variableNames: ["value"],
          },
          apothemAttr: {
            dependencyType: "attributeComponent",
            attributeName: "apothem",
            variableNames: ["value"],
          },
        };
      },

      definition({ dependencyValues }) {
        if (dependencyValues.inradiusAttr !== null) {
          return {
            setValue: {
              specifiedInradius:
                dependencyValues.inradiusAttr.stateValues.value,
            },
          };
        } else if (dependencyValues.apothemAttr !== null) {
          return {
            setValue: {
              specifiedInradius: dependencyValues.apothemAttr.stateValues.value,
            },
          };
        } else {
          return { setValue: { specifiedInradius: null } };
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.inradiusAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "inradiusAttr",
                desiredValue: desiredStateVariableValues.specifiedInradius,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else if (dependencyValues.apothemAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "apothemAttr",
                desiredValue: desiredStateVariableValues.specifiedInradius,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { sucess: false };
        }
      },
    };

    stateVariableDefinitions.specifiedSideLength = {
      isLocation: true,
      returnDependencies() {
        return {
          sideLengthAttr: {
            dependencyType: "attributeComponent",
            attributeName: "sideLength",
            variableNames: ["value"],
          },
        };
      },

      definition({ dependencyValues }) {
        if (dependencyValues.sideLengthAttr !== null) {
          return {
            setValue: {
              specifiedSideLength:
                dependencyValues.sideLengthAttr.stateValues.value,
            },
          };
        } else {
          return { setValue: { specifiedSideLength: null } };
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.sideLengthAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "sideLengthAttr",
                desiredValue: desiredStateVariableValues.specifiedSideLength,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { sucess: false };
        }
      },
    };

    stateVariableDefinitions.specifiedPerimeter = {
      isLocation: true,
      returnDependencies() {
        return {
          perimeterAttr: {
            dependencyType: "attributeComponent",
            attributeName: "perimeter",
            variableNames: ["value"],
          },
        };
      },

      definition({ dependencyValues }) {
        if (dependencyValues.perimeterAttr !== null) {
          return {
            setValue: {
              specifiedPerimeter:
                dependencyValues.perimeterAttr.stateValues.value,
            },
          };
        } else {
          return { setValue: { specifiedPerimeter: null } };
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.perimeterAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "perimeterAttr",
                desiredValue: desiredStateVariableValues.specifiedPerimeter,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { sucess: false };
        }
      },
    };

    stateVariableDefinitions.specifiedArea = {
      isLocation: true,
      returnDependencies() {
        return {
          areaAttr: {
            dependencyType: "attributeComponent",
            attributeName: "area",
            variableNames: ["value"],
          },
        };
      },

      definition({ dependencyValues }) {
        if (dependencyValues.areaAttr !== null) {
          return {
            setValue: {
              specifiedArea: dependencyValues.areaAttr.stateValues.value,
            },
          };
        } else {
          return { setValue: { specifiedArea: null } };
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.areaAttr !== null) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "areaAttr",
                desiredValue: desiredStateVariableValues.specifiedArea,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          return { sucess: false };
        }
      },
    };

    stateVariableDefinitions.essentialCircumradius = {
      isLocation: true,
      hasEssential: true,
      defaultValue: 1,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: { essentialCircumradius: true },
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "essentialCircumradius",
              value: desiredStateVariableValues.essentialCircumradius,
            },
          ],
        };
      },
    };

    // Note: we create the non-array centerComponents
    // because we currently can't use additionalStateVariablesDefined with arrays
    // unless all state variables are arrays of the same size
    stateVariableDefinitions.centerComponents = {
      isLocation: true,
      additionalStateVariablesDefined: ["directionWithRadius"],
      returnDependencies: () => ({
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
        numVerticesSpecified: {
          dependencyType: "stateVariable",
          variableName: "numVerticesSpecified",
        },
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter",
        },

        specifiedCircumradius: {
          dependencyType: "stateVariable",
          variableName: "specifiedCircumradius",
        },
        specifiedInradius: {
          dependencyType: "stateVariable",
          variableName: "specifiedInradius",
        },
        specifiedSideLength: {
          dependencyType: "stateVariable",
          variableName: "specifiedSideLength",
        },
        specifiedPerimeter: {
          dependencyType: "stateVariable",
          variableName: "specifiedPerimeter",
        },
        specifiedArea: {
          dependencyType: "stateVariable",
          variableName: "specifiedArea",
        },

        essentialCircumradius: {
          dependencyType: "stateVariable",
          variableName: "essentialCircumradius",
        },
        essentialDirection: {
          dependencyType: "stateVariable",
          variableName: "essentialDirection",
        },

        verticesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "vertices",
          variableNames: ["points"],
        },

        specifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "specifiedCenter",
        },

        essentialCenter: {
          dependencyType: "stateVariable",
          variableName: "essentialCenter",
        },
      }),
      definition({ dependencyValues }) {
        let numVertices = dependencyValues.numVertices;

        let center;
        let directionWithRadius;

        if (dependencyValues.numVerticesSpecified === 0) {
          // with no vertices, use center (specified or essential), direction, and a measure of size

          if (dependencyValues.haveSpecifiedCenter) {
            center = dependencyValues.specifiedCenter;
          } else {
            center = dependencyValues.essentialCenter;
          }

          let circumradius;

          if (dependencyValues.specifiedCircumradius !== null) {
            circumradius = dependencyValues.specifiedCircumradius;
          } else if (dependencyValues.specifiedInradius !== null) {
            circumradius =
              dependencyValues.specifiedInradius /
              Math.cos(Math.PI / numVertices);
          } else if (dependencyValues.specifiedSideLength !== null) {
            circumradius =
              dependencyValues.specifiedSideLength /
              (2 * Math.sin(Math.PI / numVertices));
          } else if (dependencyValues.specifiedPerimeter !== null) {
            circumradius =
              dependencyValues.specifiedPerimeter /
              (2 * numVertices * Math.sin(Math.PI / numVertices));
          } else if (dependencyValues.specifiedArea !== null) {
            circumradius = Math.sqrt(
              dependencyValues.specifiedArea /
                ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices)),
            );
          } else {
            circumradius = dependencyValues.essentialCircumradius;
          }

          directionWithRadius = dependencyValues.essentialDirection.map(
            (x) => x * circumradius,
          );
        } else if (dependencyValues.haveSpecifiedCenter) {
          // base polygon on center and first vertex

          center = dependencyValues.specifiedCenter;

          let vertex = dependencyValues.verticesAttr.stateValues.points[0].map(
            (x) => x.evaluate_to_constant(),
          );

          directionWithRadius = [vertex[0] - center[0], vertex[1] - center[1]];
        } else if (dependencyValues.numVerticesSpecified === 1) {
          // one vertex, no center
          // use vertex, direction, and a measure of size

          let circumradius;

          if (dependencyValues.specifiedCircumradius !== null) {
            circumradius = dependencyValues.specifiedCircumradius;
          } else if (dependencyValues.specifiedInradius !== null) {
            circumradius =
              dependencyValues.specifiedInradius /
              Math.cos(Math.PI / numVertices);
          } else if (dependencyValues.specifiedSideLength !== null) {
            circumradius =
              dependencyValues.specifiedSideLength /
              (2 * Math.sin(Math.PI / numVertices));
          } else if (dependencyValues.specifiedPerimeter !== null) {
            circumradius =
              dependencyValues.specifiedPerimeter /
              (2 * numVertices * Math.sin(Math.PI / numVertices));
          } else if (dependencyValues.specifiedArea !== null) {
            circumradius = Math.sqrt(
              dependencyValues.specifiedArea /
                ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices)),
            );
          } else {
            circumradius = dependencyValues.essentialCircumradius;
          }

          directionWithRadius = dependencyValues.essentialDirection.map(
            (x) => x * circumradius,
          );

          let vertex = dependencyValues.verticesAttr.stateValues.points[0].map(
            (x) => x.evaluate_to_constant(),
          );

          center = [
            vertex[0] - directionWithRadius[0],
            vertex[1] - directionWithRadius[1],
          ];
        } else {
          // have at least two vertices specified, use the first 2
          // these vertices are adjacent vertices of the polygon, in counterclockwise order

          let vertex1 = dependencyValues.verticesAttr.stateValues.points[0].map(
            (x) => x.evaluate_to_constant(),
          );
          let vertex2 = dependencyValues.verticesAttr.stateValues.points[1].map(
            (x) => x.evaluate_to_constant(),
          );

          let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
          let midpoint = [
            (vertex1[0] + vertex2[0]) / 2,
            (vertex1[1] + vertex2[1]) / 2,
          ];
          let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
          let inradius = sideLength / (2 * Math.tan(Math.PI / numVertices));

          let inradiusDirection = [
            -sideVector[1] / sideLength,
            sideVector[0] / sideLength,
          ];

          center = [
            midpoint[0] + inradiusDirection[0] * inradius,
            midpoint[1] + inradiusDirection[1] * inradius,
          ];

          directionWithRadius = [
            vertex1[0] - center[0],
            vertex1[1] - center[1],
          ];
        }

        return { setValue: { centerComponents: center, directionWithRadius } };
      },
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        workspace,
        stateValues,
      }) {
        let numVertices = dependencyValues.numVertices;

        let instructions = [];

        let desiredCenter = desiredStateVariableValues.centerComponents;
        if (!desiredCenter) {
          desiredCenter = workspace.desiredCenter;
        }
        if (!desiredCenter) {
          desiredCenter = (await stateValues.center).map((x) =>
            x.evaluate_to_constant(),
          );
        }

        let desiredDirectionWithRadius =
          desiredStateVariableValues.directionWithRadius;
        if (!desiredDirectionWithRadius) {
          desiredDirectionWithRadius = workspace.desiredDirectionWithRadius;
        }
        if (!desiredDirectionWithRadius) {
          let center = (await stateValues.center).map((x) =>
            x.evaluate_to_constant(),
          );
          let vertex1 = (await stateValues.vertices)[0].map((x) =>
            x.evaluate_to_constant(),
          );
          desiredDirectionWithRadius = [
            vertex1[0] - center[0],
            vertex1[1] - center[1],
          ];
        }

        workspace.desiredCenter = desiredCenter;
        workspace.desiredDirectionWithRadius = desiredDirectionWithRadius;

        if (dependencyValues.numVerticesSpecified === 0) {
          // with no vertices, use center (specified or essential), direction, and a measure of size

          if (dependencyValues.haveSpecifiedCenter) {
            instructions.push({
              setDependency: "specifiedCenter",
              desiredValue: desiredCenter,
            });
          } else {
            instructions.push({
              setDependency: "essentialCenter",
              desiredValue: desiredCenter,
            });
          }

          let desiredCircumradius = Math.sqrt(
            desiredDirectionWithRadius[0] ** 2 +
              desiredDirectionWithRadius[1] ** 2,
          );
          let desiredDirection = desiredDirectionWithRadius.map(
            (x) => x / desiredCircumradius,
          );

          if (dependencyValues.specifiedCircumradius !== null) {
            instructions.push({
              setDependency: "specifiedCircumradius",
              desiredValue: desiredCircumradius,
            });
          } else if (dependencyValues.specifiedInradius !== null) {
            instructions.push({
              setDependency: "specifiedInradius",
              desiredValue:
                desiredCircumradius * Math.cos(Math.PI / numVertices),
            });
          } else if (dependencyValues.specifiedSideLength !== null) {
            instructions.push({
              setDependency: "specifiedSideLength",
              desiredValue:
                desiredCircumradius * (2 * Math.sin(Math.PI / numVertices)),
            });
          } else if (dependencyValues.specifiedPerimeter !== null) {
            instructions.push({
              setDependency: "specifiedPerimeter",
              desiredValue:
                desiredCircumradius *
                (2 * numVertices * Math.sin(Math.PI / numVertices)),
            });
          } else if (dependencyValues.specifiedArea !== null) {
            instructions.push({
              setDependency: "specifiedArea",
              desiredValue:
                desiredCircumradius ** 2 *
                ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices)),
            });
          } else {
            instructions.push({
              setDependency: "essentialCircumradius",
              desiredValue: desiredCircumradius,
            });
          }

          instructions.push({
            setDependency: "essentialDirection",
            desiredValue: desiredDirection,
          });
        } else if (dependencyValues.haveSpecifiedCenter) {
          // base polygon on center and first vertex

          instructions.push({
            setDependency: "specifiedCenter",
            desiredValue: desiredCenter,
          });

          let desiredVertices = {
            "0,0": me.fromAst(desiredDirectionWithRadius[0] + desiredCenter[0]),
            "0,1": me.fromAst(desiredDirectionWithRadius[1] + desiredCenter[1]),
          };

          instructions.push({
            setDependency: "verticesAttr",
            desiredValue: desiredVertices,
            variableIndex: 0,
          });
        } else if (dependencyValues.numVerticesSpecified === 1) {
          // one vertex, no center
          // use vertex, direction, and a measure of size

          let desiredCircumradius = Math.sqrt(
            desiredDirectionWithRadius[0] ** 2 +
              desiredDirectionWithRadius[1] ** 2,
          );
          let desiredDirection = desiredDirectionWithRadius.map(
            (x) => x / desiredCircumradius,
          );

          if (dependencyValues.specifiedCircumradius !== null) {
            instructions.push({
              setDependency: "specifiedCircumradius",
              desiredValue: desiredCircumradius,
            });
          } else if (dependencyValues.specifiedInradius !== null) {
            instructions.push({
              setDependency: "specifiedInradius",
              desiredValue:
                desiredCircumradius * Math.cos(Math.PI / numVertices),
            });
          } else if (dependencyValues.specifiedSideLength !== null) {
            instructions.push({
              setDependency: "specifiedSideLength",
              desiredValue:
                desiredCircumradius * (2 * Math.sin(Math.PI / numVertices)),
            });
          } else if (dependencyValues.specifiedPerimeter !== null) {
            instructions.push({
              setDependency: "specifiedPerimeter",
              desiredValue:
                desiredCircumradius *
                (2 * numVertices * Math.sin(Math.PI / numVertices)),
            });
          } else if (dependencyValues.specifiedArea !== null) {
            instructions.push({
              setDependency: "specifiedArea",
              desiredValue:
                desiredCircumradius ** 2 *
                ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices)),
            });
          } else {
            instructions.push({
              setDependency: "essentialCircumradius",
              desiredValue: desiredCircumradius,
            });
          }

          instructions.push({
            setDependency: "essentialDirection",
            desiredValue: desiredDirection,
          });

          let desiredVertices = {
            "0,0": me.fromAst(desiredDirectionWithRadius[0] + desiredCenter[0]),
            "0,1": me.fromAst(desiredDirectionWithRadius[1] + desiredCenter[1]),
          };

          instructions.push({
            setDependency: "verticesAttr",
            desiredValue: desiredVertices,
            variableIndex: 0,
          });
        } else {
          // have at least two vertices specified
          // these vertices are adjacent vertices of the polygon, in counterclockwise order

          let angle = (2 * Math.PI) / numVertices;

          let c = Math.cos(angle);
          let s = Math.sin(angle);

          let desiredDirectionWithRadius2 = [
            desiredDirectionWithRadius[0] * c -
              desiredDirectionWithRadius[1] * s,
            desiredDirectionWithRadius[0] * s +
              desiredDirectionWithRadius[1] * c,
          ];

          let desiredVertices = {
            "0,0": me.fromAst(desiredDirectionWithRadius[0] + desiredCenter[0]),
            "0,1": me.fromAst(desiredDirectionWithRadius[1] + desiredCenter[1]),
            "1,0": me.fromAst(
              desiredDirectionWithRadius2[0] + desiredCenter[0],
            ),
            "1,1": me.fromAst(
              desiredDirectionWithRadius2[1] + desiredCenter[1],
            ),
          };

          instructions.push({
            setDependency: "verticesAttr",
            desiredValue: desiredVertices,
            variableIndex: 0,
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.vertices = {
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "vertexX") {
            return [];
          } else {
            // vertex or entire array
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
      entryPrefixes: ["vertexX", "vertex"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "vertexX") {
          // vertexX1_2 is the 2nd component of the first vertex
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
          // vertex3 is all components of the third vertex

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
        if (varName === "vertices") {
          if (propIndex.length === 1) {
            return "vertex" + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            return `vertexX${propIndex[0]}_${propIndex[1]}`;
          }
        }
        if (varName.slice(0, 6) === "vertex") {
          // could be vertex or vertexX
          let vertexNum = Number(varName.slice(6));
          if (Number.isInteger(vertexNum) && vertexNum > 0) {
            // if propIndex has additional entries, ignore them
            return `vertexX${vertexNum}_${propIndex[0]}`;
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numVertices, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          numVertices: {
            dependencyType: "stateVariable",
            variableName: "numVertices",
          },
          centerComponents: {
            dependencyType: "stateVariable",
            variableName: "centerComponents",
          },
          directionWithRadius: {
            dependencyType: "stateVariable",
            variableName: "directionWithRadius",
          },
        };

        return {
          globalDependencies,
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {
        // just compute all vertices every time, as they are all mutually dependent
        // (rather than just computing for the array keys requested)

        let numVertices = globalDependencyValues.numVertices;

        let center = globalDependencyValues.centerComponents;
        let directionWithRadius = globalDependencyValues.directionWithRadius;

        let vertices = {};

        if (
          center.some((x) => !Number.isFinite(x)) ||
          directionWithRadius.some((x) => !Number.isFinite(x))
        ) {
          for (let vertexInd = 0; vertexInd < numVertices; vertexInd++) {
            vertices[`${vertexInd},0`] = me.fromAst("\uff3f");
            vertices[`${vertexInd},1`] = me.fromAst("\uff3f");
          }
        } else {
          for (let vertexInd = 0; vertexInd < numVertices; vertexInd++) {
            let rotation = (vertexInd * 2 * Math.PI) / numVertices;

            let s = Math.sin(rotation);
            let c = Math.cos(rotation);

            vertices[`${vertexInd},0`] = me.fromAst(
              center[0] +
                directionWithRadius[0] * c -
                directionWithRadius[1] * s,
            );
            vertices[`${vertexInd},1`] = me.fromAst(
              center[1] +
                directionWithRadius[0] * s +
                directionWithRadius[1] * c,
            );
          }
        }

        return { setValue: { vertices } };
      },

      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        stateValues,
        workspace,
      }) {
        let numVertices = globalDependencyValues.numVertices;

        if (!workspace.desiredVertices) {
          workspace.desiredVertices = {};
        }
        Object.assign(
          workspace.desiredVertices,
          desiredStateVariableValues.vertices,
        );

        let desiredKeys = Object.keys(workspace.desiredVertices);
        let vertexInd1String = desiredKeys[0].split(",")[0];
        let changingJustOneVertex = desiredKeys.every(
          (v) => v.split(",")[0] === vertexInd1String,
        );

        let desiredCenter;

        if (changingJustOneVertex) {
          // if change one vertex, then make sure that center stays the same

          desiredCenter = (await stateValues.center).map((x) =>
            x.evaluate_to_constant(),
          );
        } else {
          // if change multiple vertices, then calculate center as average of all vertices

          if (!workspace.allVertices) {
            workspace.allVertices = {};
          }

          Object.assign(workspace.allVertices, workspace.desiredVertices);

          let center_x = 0,
            center_y = 0;

          for (let vertexInd = 0; vertexInd < numVertices; vertexInd++) {
            let v_x = workspace.allVertices[vertexInd + ",0"];
            if (!v_x) {
              let vertices = await stateValues.vertices;
              v_x = vertices[vertexInd][0];
              workspace.allVertices[vertexInd + ",0"] = v_x;
            }

            let v_y = workspace.allVertices[vertexInd + ",1"];
            if (!v_y) {
              let vertices = await stateValues.vertices;
              v_y = vertices[vertexInd][1];
              workspace.allVertices[vertexInd + ",1"] = v_y;
            }

            center_x += v_x.evaluate_to_constant();
            center_y += v_y.evaluate_to_constant();
          }

          center_x /= numVertices;
          center_y /= numVertices;

          desiredCenter = [center_x, center_y];
        }

        // use the first index found in desired indices to determine directionWithRadius
        let vertexInd1 = Number(vertexInd1String);

        let desiredVertex_x =
          workspace.desiredVertices[vertexInd1String + ",0"];
        if (!desiredVertex_x) {
          let vertices = await stateValues.vertices;
          desiredVertex_x = vertices[vertexInd1][0];
        }

        let desiredVertex_y =
          workspace.desiredVertices[vertexInd1String + ",1"];
        if (!desiredVertex_y) {
          let vertices = await stateValues.vertices;
          desiredVertex_y = vertices[vertexInd1][1];
        }

        let desiredVertex = [
          desiredVertex_x.evaluate_to_constant(),
          desiredVertex_y.evaluate_to_constant(),
        ];

        let centerToVertex = [
          desiredVertex[0] - desiredCenter[0],
          desiredVertex[1] - desiredCenter[1],
        ];

        let angle = (-vertexInd1 * 2 * Math.PI) / numVertices;

        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let desiredDirectionWithRadius = [
          centerToVertex[0] * c - centerToVertex[1] * s,
          centerToVertex[0] * s + centerToVertex[1] * c,
        ];

        let instructions = [
          {
            setDependency: "centerComponents",
            desiredValue: desiredCenter,
          },
          {
            setDependency: "directionWithRadius",
            desiredValue: desiredDirectionWithRadius,
          },
        ];

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.center = {
      isLocation: true,
      public: true,
      isArray: true,
      entryPrefixes: ["centerX"],
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "centerX") {
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

      returnArraySizeDependencies: () => ({}),
      returnArraySize: () => [2],

      returnArrayDependenciesByKey() {
        let globalDependencies = {
          centerComponents: {
            dependencyType: "stateVariable",
            variableName: "centerComponents",
          },
        };

        return { globalDependencies };
      },

      arrayDefinitionByKey({ globalDependencyValues }) {
        return {
          setValue: {
            center: globalDependencyValues.centerComponents.map((x) =>
              me.fromAst(x),
            ),
          },
        };
      },

      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        stateValues,
        workspace,
      }) {
        let desired_center_x = desiredStateVariableValues.center[0];
        if (!desired_center_x) {
          desired_center_x = workspace.desired_center_x;
        }
        if (!desired_center_x) {
          desired_center_x = (await stateValues.center)[0];
        }
        workspace.desired_center_x = desired_center_x;

        let desired_center_y = desiredStateVariableValues.center[1];
        if (!desired_center_y) {
          desired_center_y = workspace.desired_center_y;
        }
        if (!desired_center_y) {
          desired_center_y = (await stateValues.center)[1];
        }
        workspace.desired_center_y = desired_center_y;

        let instructions = [
          {
            setDependency: "centerComponents",
            desiredValue: [
              desired_center_x.evaluate_to_constant(),
              desired_center_y.evaluate_to_constant(),
            ],
          },
        ];

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.circumradius = {
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        center: {
          dependencyType: "stateVariable",
          variableName: "center",
        },
        vertex1: {
          dependencyType: "stateVariable",
          variableName: "vertex1",
        },
      }),
      definition({ dependencyValues }) {
        let center = dependencyValues.center.map((x) =>
          x.evaluate_to_constant(),
        );

        let vertex1 = dependencyValues.vertex1.map((x) =>
          x.evaluate_to_constant(),
        );

        let circumradius = Math.sqrt(
          (vertex1[0] - center[0]) ** 2 + (vertex1[1] - center[1]) ** 2,
        );

        return { setValue: { circumradius } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let center = dependencyValues.center.map((x) =>
          x.evaluate_to_constant(),
        );

        let vertex1 = dependencyValues.vertex1.map((x) =>
          x.evaluate_to_constant(),
        );

        let directionWithRadius = [
          vertex1[0] - center[0],
          vertex1[1] - center[1],
        ];

        let previousRadius = Math.sqrt(
          directionWithRadius[0] ** 2 + directionWithRadius[1] ** 2,
        );

        let desiredRadius = desiredStateVariableValues.circumradius;

        let desiredDirectionWithRadius = directionWithRadius.map(
          (x) => (x / previousRadius) * desiredRadius,
        );

        let desiredVertex1 = [
          me.fromAst(desiredDirectionWithRadius[0] + center[0]),
          me.fromAst(desiredDirectionWithRadius[1] + center[1]),
        ];

        return {
          success: true,
          instructions: [
            {
              setDependency: "vertex1",
              desiredValue: desiredVertex1,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.radius = {
      isAlias: true,
      targetVariableName: "circumradius",
    };

    stateVariableDefinitions.inradius = {
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius",
        },
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let numVertices = dependencyValues.numVertices;

        let inradius = circumradius * Math.cos(Math.PI / numVertices);

        return { setValue: { inradius } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredInradius = desiredStateVariableValues.inradius;
        let numVertices = dependencyValues.numVertices;

        let desiredCircumradius =
          desiredInradius / Math.cos(Math.PI / numVertices);

        return {
          success: true,
          instructions: [
            {
              setDependency: "circumradius",
              desiredValue: desiredCircumradius,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.apothem = {
      isAlias: true,
      targetVariableName: "inradius",
    };

    stateVariableDefinitions.sideLength = {
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius",
        },
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let numVertices = dependencyValues.numVertices;

        let sideLength = circumradius * (2 * Math.sin(Math.PI / numVertices));

        return { setValue: { sideLength } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredSideLength = desiredStateVariableValues.sideLength;
        let numVertices = dependencyValues.numVertices;

        let desiredCircumradius =
          desiredSideLength / (2 * Math.sin(Math.PI / numVertices));

        return {
          success: true,
          instructions: [
            {
              setDependency: "circumradius",
              desiredValue: desiredCircumradius,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.perimeter = {
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius",
        },
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let numVertices = dependencyValues.numVertices;

        let perimeter =
          circumradius * (2 * numVertices * Math.sin(Math.PI / numVertices));

        return { setValue: { perimeter } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredPerimeter = desiredStateVariableValues.perimeter;
        let numVertices = dependencyValues.numVertices;

        let desiredCircumradius =
          desiredPerimeter /
          (2 * numVertices * Math.sin(Math.PI / numVertices));

        return {
          success: true,
          instructions: [
            {
              setDependency: "circumradius",
              desiredValue: desiredCircumradius,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.area = {
      isLocation: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius",
        },
        numVertices: {
          dependencyType: "stateVariable",
          variableName: "numVertices",
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let numVertices = dependencyValues.numVertices;

        let area =
          circumradius ** 2 *
          ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices));

        return { setValue: { area } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let desiredArea = desiredStateVariableValues.area;
        let numVertices = dependencyValues.numVertices;

        let desiredCircumradius = Math.sqrt(
          desiredArea /
            ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices)),
        );

        return {
          success: true,
          instructions: [
            {
              setDependency: "circumradius",
              desiredValue: desiredCircumradius,
            },
          ],
        };
      },
    };

    return stateVariableDefinitions;
  }

  async movePolygon({
    pointCoords,
    transient,
    sourceDetails,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let numVerticesMoved = Object.keys(pointCoords).length;

    if (numVerticesMoved === 1) {
      // single vertex dragged

      if (!(await this.stateValues.verticesDraggable)) {
        return await this.coreFunctions.resolveAction({ actionId });
      }

      // Since the case where drag the entire regular polygon is complicated,
      // we perform the entire move for a single vertex here and return.

      // If a single vertex is dragged, we perform update on the vertex,
      // as one typically does for a polygon
      let vertexComponents = {};
      for (let ind in pointCoords) {
        vertexComponents[ind + ",0"] = me.fromAst(pointCoords[ind][0]);
        vertexComponents[ind + ",1"] = me.fromAst(pointCoords[ind][1]);
      }

      if (transient) {
        return await this.coreFunctions.performUpdate({
          updateInstructions: [
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "vertices",
              value: vertexComponents,
              sourceDetails,
            },
          ],
          transient,
          actionId,
          sourceInformation,
          skipRendererUpdate,
        });
      } else {
        return await this.coreFunctions.performUpdate({
          updateInstructions: [
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "vertices",
              value: vertexComponents,
              sourceDetails,
            },
          ],
          actionId,
          sourceInformation,
          skipRendererUpdate,
          event: {
            verb: "interacted",
            object: {
              componentName: this.componentName,
              componentType: this.componentType,
            },
            result: {
              pointCoordinates: pointCoords,
            },
          },
        });
      }
    }

    // whole polyline dragged
    if (!(await this.stateValues.draggable)) {
      return await this.coreFunctions.resolveAction({ actionId });
    }

    // In order to detect if one of the points used to defined the regular polygon is constrained
    // (so that we can adjust to keep the shape in that case)
    // we perform that calculations of the inverseDefinition of vertices here
    // and perform that update directly on centerComponents and directionWithRadius.
    // (The inverse definition of vertices will still be used if other components
    // are connected to the vertices.)
    // We just want this special behavior for the case when the entire polygon
    // is moved by the renderer.

    let numVertices = await this.stateValues.numVertices;

    // First calculate the desired centers as the average of all points

    let center_x = 0,
      center_y = 0;

    for (let vertexInd = 0; vertexInd < numVertices; vertexInd++) {
      center_x += pointCoords[vertexInd][0];
      center_y += pointCoords[vertexInd][1];
    }

    center_x /= numVertices;
    center_y /= numVertices;

    let center = [center_x, center_y];

    // use the first index determine directionWithRadius
    let vertex1 = pointCoords[0];

    let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

    let updateInstructions = [
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "centerComponents",
        value: center,
        sourceDetails,
      },
      {
        updateType: "updateValue",
        componentName: this.componentName,
        stateVariable: "directionWithRadius",
        value: directionWithRadius,
        sourceDetails,
      },
    ];

    // Note: we set skipRendererUpdate to true
    // so that we can make further adjustments before the renderers are updated
    if (transient) {
      await this.coreFunctions.performUpdate({
        updateInstructions,
        transient,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
      });
    } else {
      await this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
        event: {
          verb: "interacted",
          object: {
            componentName: this.componentName,
            componentType: this.componentType,
          },
          result: {
            pointCoordinates: pointCoords,
          },
        },
      });
    }

    // we will attempt to create a rigid translation of the polygon
    // even if a subset of the vertices are constrained.
    let numVerticesSpecified = await this.stateValues.numVerticesSpecified;
    let haveSpecifiedCenter = await this.stateValues.haveSpecifiedCenter;

    if (haveSpecifiedCenter) {
      if (numVerticesSpecified >= 1) {
        // polygon was determined by center and 1 vertex

        let resultingCenter = await this.stateValues.centerComponents;

        let resultingDirectionWithRadius = await this.stateValues
          .directionWithRadius;
        let resultingVertex1 = [
          resultingCenter[0] + resultingDirectionWithRadius[0],
          resultingCenter[1] + resultingDirectionWithRadius[1],
        ];

        let tol = 1e-6;

        let vertex1Changed = !vertex1.every(
          (v, i) => Math.abs(v - resultingVertex1[i]) < tol,
        );
        let centerChanged = !center.every(
          (v, i) => Math.abs(v - resultingCenter[i]) < tol,
        );

        if (centerChanged) {
          if (!vertex1Changed) {
            // only center changed
            // keep directionWithRadius the same
            // and use new center position

            let newInstructions = [
              {
                updateType: "updateValue",
                componentName: this.componentName,
                stateVariable: "centerComponents",
                value: resultingCenter,
              },
              {
                updateType: "updateValue",
                componentName: this.componentName,
                stateVariable: "directionWithRadius",
                value: directionWithRadius,
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
        } else if (vertex1Changed) {
          // only vertex 1 changed
          // keep directionWithRadius the same
          // adjust center to put vertex 1 at its new location

          let newCenter = [
            resultingVertex1[0] - directionWithRadius[0],
            resultingVertex1[1] - directionWithRadius[1],
          ];

          let newInstructions = [
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "centerComponents",
              value: newCenter,
            },
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "directionWithRadius",
              value: directionWithRadius,
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
    } else if (numVerticesSpecified >= 2) {
      //polygon was determined by two vertices

      // calculate the value of vertex2 calculated from center and vertex1
      let angle = (2 * Math.PI) / numVertices;

      let c = Math.cos(angle);
      let s = Math.sin(angle);

      let directionWithRadius2 = [
        directionWithRadius[0] * c - directionWithRadius[1] * s,
        directionWithRadius[0] * s + directionWithRadius[1] * c,
      ];

      let vertex2 = [
        directionWithRadius2[0] + center[0],
        directionWithRadius2[1] + center[1],
      ];

      let resultingVertices = await this.stateValues.vertices;
      let resultingVertex1 = resultingVertices[0].map((x) =>
        x.evaluate_to_constant(),
      );
      let resultingVertex2 = resultingVertices[1].map((x) =>
        x.evaluate_to_constant(),
      );

      let tol = 1e-6;

      let vertex1Changed = !vertex1.every(
        (v, i) => Math.abs(v - resultingVertex1[i]) < tol,
      );
      let vertex2Changed = !vertex2.every(
        (v, i) => Math.abs(v - resultingVertex2[i]) < tol,
      );

      if (vertex1Changed) {
        if (!vertex2Changed) {
          // only vertex 1 changed
          // keep directionWithRadius the same
          // adjust center to put vertex 1 at its new location

          let newCenter = [
            resultingVertex1[0] - directionWithRadius[0],
            resultingVertex1[1] - directionWithRadius[1],
          ];

          let newInstructions = [
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "centerComponents",
              value: newCenter,
            },
            {
              updateType: "updateValue",
              componentName: this.componentName,
              stateVariable: "directionWithRadius",
              value: directionWithRadius,
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
      } else if (vertex2Changed) {
        // only vertex 2 changed
        // keep directionWithRadius the same
        // adjust center to put vertex 2 at its new location

        let newCenter = [
          resultingVertex2[0] - directionWithRadius2[0],
          resultingVertex2[1] - directionWithRadius2[1],
        ];

        let newInstructions = [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "centerComponents",
            value: newCenter,
          },
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "directionWithRadius",
            value: directionWithRadius,
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
}
