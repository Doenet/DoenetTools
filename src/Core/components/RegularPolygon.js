import Polygon from './Polygon';
import me from "math-expressions";

export default class RegularPolygon extends Polygon {
  static componentType = "regularPolygon";
  static rendererType = "polygon";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.nVertices = {
      createComponentOfType: "number",
      createStateVariable: "nVertices",
      defaultValue: 3,
      public: true,
      forRenderer: true,
    };

    // Note: vertices is already an attribute from polygon

    attributes.center = {
      createComponentOfType: "point"
    }


    // if center and vertex or two vertices are specified
    // then the following size attributes are ignored

    // circumradius and radrius are the same thing and either attribute can be used
    // If both specified, circumradius is used
    attributes.circumradius = {
      createComponentOfType: "number"
    }
    attributes.radius = {
      createComponentOfType: "number"
    }


    // inradius and apothem are the same thing and either attribute can be used
    // If both specified, inradius is used.
    // If circumradius is specified, inradius is ignored
    attributes.inradius = {
      createComponentOfType: "number"
    }
    attributes.apothem = {
      createComponentOfType: "number"
    }

    // if circumradius or inradius is specified, sideLength is ignored
    attributes.sideLength = {
      createComponentOfType: "number"
    }

    // if circumradius, inradius, or sideLength is specified, perimeter is ignored
    attributes.perimeter = {
      createComponentOfType: "number"
    }

    // if circumradius, inradius, sideLength, or perimeter is specified, area is ignored
    attributes.area = {
      createComponentOfType: "number"
    }

    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.nVertices;

    let styleDescriptionWithNounDeps = stateVariableDefinitions.styleDescriptionWithNoun.returnDependencies();
    styleDescriptionWithNounDeps.nSides = {
      dependencyType: "stateVariable",
      variableName: "nSides"
    }

    stateVariableDefinitions.styleDescriptionWithNoun.returnDependencies = () => styleDescriptionWithNounDeps;


    let styleDescriptionWithNounDef = stateVariableDefinitions.styleDescriptionWithNoun.definition;

    stateVariableDefinitions.styleDescriptionWithNoun.definition = function ({ dependencyValues }) {
      let styleDescriptionWithNoun = styleDescriptionWithNounDef({ dependencyValues }).setValue.styleDescriptionWithNoun;

      styleDescriptionWithNoun = styleDescriptionWithNoun.replaceAll("polygon", `${dependencyValues.nSides}-sided regular polygon`);

      return { setValue: { styleDescriptionWithNoun } }
    }

    stateVariableDefinitions.nVerticesSpecified = {

      returnDependencies: () => ({
        verticesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "vertices",
          variableNames: ["nPoints"]
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.verticesAttr !== null) {
          return { setValue: { nVerticesSpecified: dependencyValues.verticesAttr.stateValues.nPoints } }
        } else {
          return { setValue: { nVerticesSpecified: 0 } }
        }

      }
    }

    stateVariableDefinitions.essentialDirection = {
      isArray: true,
      entryPrefixes: ["essentialVertexX"],
      defaultValueByArrayKey: () => 0,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        nVerticesSpecified: {
          dependencyType: "stateVariable",
          variableName: "nVerticesSpecified",
        },
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter",
        }
      }),
      returnArraySize({ dependencyValues }) {
        let needDir = (dependencyValues.haveSpecifiedCenter ? 1 : 0) + dependencyValues.nVerticesSpecified <= 1;
        return [needDir ? 2 : 0];
      },

      returnArrayDependenciesByKey() {
        return {};
      },

      arrayDefinitionByKey: function ({ arrayKeys }) {
        let essentialDirection = {};

        for (let arrayKey of arrayKeys) {
          if (arrayKey === "0") {
            essentialDirection[arrayKey] = { defaultValue: 1 }
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
            value: { [arrayKey]: desiredStateVariableValues.essentialDirection[arrayKey] },
          });
        }

        return {
          success: true,
          instructions
        }
      }
    }

    stateVariableDefinitions.haveSpecifiedCenter = {
      returnDependencies: () => ({
        centerAttr: {
          dependencyType: "attributeComponent",
          attributeName: "center"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          haveSpecifiedCenter: dependencyValues.centerAttr !== null
        }
      })
    }

    stateVariableDefinitions.specifiedCenter = {
      isArray: true,
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
          }
        }

        return { dependenciesByKey }
      },

      arrayDefinitionByKey: function ({ dependencyValuesByKey, arrayKeys }) {

        let specifiedCenter = {};

        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          if (dependencyValuesByKey[arrayKey].centerAttr !== null) {
            specifiedCenter[arrayKey] = evaluate_to_constant(dependencyValuesByKey[arrayKey].centerAttr.stateValues["x" + varEnding]);
          }
        }

        return { setValue: { specifiedCenter } }
      },

      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyValuesByKey, dependencyNamesByKey,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.specifiedCenter) {

          if (dependencyValuesByKey[arrayKey].centerAttr &&
            dependencyValuesByKey[arrayKey].centerAttr !== null
          ) {

            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].centerAttr,
              desiredValue: me.fromAst(desiredStateVariableValues.specifiedCenter[arrayKey]),
              variableIndex: 0,
            })
          }
        }

        return {
          success: true,
          instructions
        };

      }
    }


    stateVariableDefinitions.essentialCenter = {
      isArray: true,
      entryPrefixes: ["essentialCenterX"],
      defaultValueByArrayKey: () => 0,
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter",
        }
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
            value: { [arrayKey]: desiredStateVariableValues.essentialCenter[arrayKey] },
          });
        }

        return {
          success: true,
          instructions
        }
      }
    }



    stateVariableDefinitions.specifiedCircumradius = {
      returnDependencies() {
        return {
          circumradiusAttr: {
            dependencyType: "attributeComponent",
            attributeName: "circumradius",
            variableNames: ["value"]
          },
          radiusAttr: {
            dependencyType: "attributeComponent",
            attributeName: "radius",
            variableNames: ["value"]
          },
          nVerticesSpecified: {
            dependencyType: "stateVariable",
            variableName: "nVerticesSpecified"
          },
          haveSpecifiedCenter: {
            dependencyType: "stateVariable",
            variableName: "haveSpecifiedCenter"
          }
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.circumradiusAttr !== null) {
          return { setValue: { specifiedCircumradius: dependencyValues.circumradiusAttr.stateValues.value } };

        } else if (dependencyValues.radiusAttr !== null) {
          return { setValue: { specifiedCircumradius: dependencyValues.radiusAttr.stateValues.value } };

        } else {
          return { setValue: { specifiedCircumradius: null } }
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.circumradiusAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "circumradiusAttr",
              desiredValue: desiredStateVariableValues.specifiedCircumradius,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else if (dependencyValues.radiusAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "radiusAttr",
              desiredValue: desiredStateVariableValues.specifiedCircumradius,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return { success: false }
        }
      }
    }


    stateVariableDefinitions.specifiedInradius = {
      returnDependencies() {
        return {
          inradiusAttr: {
            dependencyType: "attributeComponent",
            attributeName: "inradius",
            variableNames: ["value"]
          },
          apothemAttr: {
            dependencyType: "attributeComponent",
            attributeName: "apothem",
            variableNames: ["value"]
          },
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.inradiusAttr !== null) {
          return { setValue: { specifiedInradius: dependencyValues.inradiusAttr.stateValues.value } };

        } else if (dependencyValues.apothemAttr !== null) {
          return { setValue: { specifiedInradius: dependencyValues.apothemAttr.stateValues.value } };

        } else {
          return { setValue: { specifiedInradius: null } }
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.inradiusAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "inradiusAttr",
              desiredValue: desiredStateVariableValues.specifiedInradius,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else if (dependencyValues.apothemAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "apothemAttr",
              desiredValue: desiredStateVariableValues.specifiedInradius,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return { sucess: false }
        }
      }
    }


    stateVariableDefinitions.specifiedSideLength = {
      returnDependencies() {
        return {
          sideLengthAttr: {
            dependencyType: "attributeComponent",
            attributeName: "sideLength",
            variableNames: ["value"]
          },
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.sideLengthAttr !== null) {
          return { setValue: { specifiedSideLength: dependencyValues.sideLengthAttr.stateValues.value } };

        } else {
          return { setValue: { specifiedSideLength: null } }
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.sideLengthAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "sideLengthAttr",
              desiredValue: desiredStateVariableValues.specifiedSideLength,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return { sucess: false }
        }
      }
    }


    stateVariableDefinitions.specifiedPerimeter = {
      returnDependencies() {
        return {
          perimeterAttr: {
            dependencyType: "attributeComponent",
            attributeName: "perimeter",
            variableNames: ["value"]
          },
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.perimeterAttr !== null) {
          return { setValue: { specifiedPerimeter: dependencyValues.perimeterAttr.stateValues.value } };

        } else {
          return { setValue: { specifiedPerimeter: null } }
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.perimeterAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "perimeterAttr",
              desiredValue: desiredStateVariableValues.specifiedPerimeter,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return { sucess: false }
        }
      }
    }


    stateVariableDefinitions.specifiedArea = {
      returnDependencies() {
        return {
          areaAttr: {
            dependencyType: "attributeComponent",
            attributeName: "area",
            variableNames: ["value"]
          },
        }
      },

      definition({ dependencyValues }) {
        if (dependencyValues.areaAttr !== null) {
          return { setValue: { specifiedArea: dependencyValues.areaAttr.stateValues.value } };

        } else {
          return { setValue: { specifiedArea: null } }
        }
      },

      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.areaAttr !== null) {
          return {
            success: true,
            instructions: [{
              setDependency: "areaAttr",
              desiredValue: desiredStateVariableValues.specifiedArea,
              childIndex: 0,
              variableIndex: 0
            }]
          }
        } else {
          return { sucess: false }
        }
      }
    }


    stateVariableDefinitions.essentialCircumradius = {
      hasEssential: true,
      defaultValue: 1,
      returnDependencies: () => ({}),
      definition: () => ({ useEssentialOrDefaultValue: { essentialCircumradius: true } }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "essentialCircumradius",
            value: desiredStateVariableValues.essentialCircumradius
          }]
        }
      }
    }


    // Note: we create the non-array centerComponents
    // because we currently can't use additionalStateVariablesDefined with arrays
    // unless all state variables are arrays of the same size
    stateVariableDefinitions.centerComponents = {
      additionalStateVariablesDefined: ["directionWithRadius"],
      returnDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
        nVerticesSpecified: {
          dependencyType: "stateVariable",
          variableName: "nVerticesSpecified"
        },
        haveSpecifiedCenter: {
          dependencyType: "stateVariable",
          variableName: "haveSpecifiedCenter"
        },

        specifiedCircumradius: {
          dependencyType: "stateVariable",
          variableName: "specifiedCircumradius"
        },
        specifiedInradius: {
          dependencyType: "stateVariable",
          variableName: "specifiedInradius"
        },
        specifiedSideLength: {
          dependencyType: "stateVariable",
          variableName: "specifiedSideLength"
        },
        specifiedPerimeter: {
          dependencyType: "stateVariable",
          variableName: "specifiedPerimeter"
        },
        specifiedArea: {
          dependencyType: "stateVariable",
          variableName: "specifiedArea"
        },

        essentialCircumradius: {
          dependencyType: "stateVariable",
          variableName: "essentialCircumradius"
        },
        essentialDirection: {
          dependencyType: "stateVariable",
          variableName: "essentialDirection"
        },

        verticesAttr: {
          dependencyType: "attributeComponent",
          attributeName: "vertices",
          variableNames: ["points"]
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


        let nVertices = dependencyValues.nVertices;

        let center;
        let directionWithRadius;

        if (dependencyValues.nVerticesSpecified === 0) {

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
            circumradius = dependencyValues.specifiedInradius / Math.cos(Math.PI / nVertices);
          } else if (dependencyValues.specifiedSideLength !== null) {
            circumradius = dependencyValues.specifiedSideLength / (2 * Math.sin(Math.PI / nVertices));
          } else if (dependencyValues.specifiedPerimeter !== null) {
            circumradius = dependencyValues.specifiedPerimeter / (2 * nVertices * Math.sin(Math.PI / nVertices))
          } else if (dependencyValues.specifiedArea !== null) {
            circumradius = Math.sqrt(dependencyValues.specifiedArea
              / (nVertices / 2 * Math.sin(2 * Math.PI / nVertices)))
          } else {
            circumradius = dependencyValues.essentialCircumradius;
          }

          directionWithRadius = dependencyValues.essentialDirection.map(x => x * circumradius);


        } else if (dependencyValues.haveSpecifiedCenter) {

          // base polygon on center and first vertex

          center = dependencyValues.specifiedCenter;

          let vertex = dependencyValues.verticesAttr.stateValues.points[0].map(evaluate_to_constant);

          directionWithRadius = [vertex[0] - center[0], vertex[1] - center[1]]

        } else if (dependencyValues.nVerticesSpecified === 1) {
          // one vertex, no center
          // use vertex, direction, and a measure of size

          let circumradius;

          if (dependencyValues.specifiedCircumradius !== null) {
            circumradius = dependencyValues.specifiedCircumradius;
          } else if (dependencyValues.specifiedInradius !== null) {
            circumradius = dependencyValues.specifiedInradius / Math.cos(Math.PI / nVertices);
          } else if (dependencyValues.specifiedSideLength !== null) {
            circumradius = dependencyValues.specifiedSideLength / (2 * Math.sin(Math.PI / nVertices));
          } else if (dependencyValues.specifiedPerimeter !== null) {
            circumradius = dependencyValues.specifiedPerimeter / (2 * nVertices * Math.sin(Math.PI / nVertices))
          } else if (dependencyValues.specifiedArea !== null) {
            circumradius = Math.sqrt(dependencyValues.specifiedArea
              / (nVertices / 2 * Math.sin(2 * Math.PI / nVertices)))
          } else {
            circumradius = dependencyValues.essentialCircumradius;
          }

          directionWithRadius = dependencyValues.essentialDirection.map(x => x * circumradius);


          let vertex = dependencyValues.verticesAttr.stateValues.points[0].map(evaluate_to_constant);


          center = [vertex[0] - directionWithRadius[0], vertex[1] - directionWithRadius[1]];

        } else {
          // have at least two vertices specified, use the first 2
          // these vertices are adjacent vertices of the polygon, in counterclockwise order

          let vertex1 = dependencyValues.verticesAttr.stateValues.points[0].map(evaluate_to_constant);
          let vertex2 = dependencyValues.verticesAttr.stateValues.points[1].map(evaluate_to_constant);

          let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
          let midpoint = [(vertex1[0] + vertex2[0]) / 2, (vertex1[1] + vertex2[1]) / 2];
          let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
          let inradius = sideLength / (2 * Math.tan(Math.PI / nVertices));

          let inradiusDirection = [-sideVector[1] / sideLength, sideVector[0] / sideLength];

          center = [midpoint[0] + inradiusDirection[0] * inradius, midpoint[1] + inradiusDirection[1] * inradius];

          directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]]

        }

        return { setValue: { centerComponents: center, directionWithRadius } }

      },
      async inverseDefinition({ desiredStateVariableValues, dependencyValues, workspace, stateValues }) {

        let nVertices = dependencyValues.nVertices;

        let instructions = [];


        let desiredCenter = desiredStateVariableValues.centerComponents;
        if (!desiredCenter) {
          desiredCenter = workspace.desiredCenter;
        }
        if (!desiredCenter) {
          desiredCenter = (await stateValues.center).map(evaluate_to_constant);
        }

        let desiredDirectionWithRadius = desiredStateVariableValues.directionWithRadius;
        if (!desiredDirectionWithRadius) {
          desiredDirectionWithRadius = workspace.desiredDirectionWithRadius
        };
        if (!desiredDirectionWithRadius) {
          let center = (await stateValues.center).map(evaluate_to_constant);
          let vertex1 = (await stateValues.vertices)[0].map(evaluate_to_constant);
          desiredDirectionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]]
        }

        workspace.desiredCenter = desiredCenter;
        workspace.desiredDirectionWithRadius = desiredDirectionWithRadius;


        if (dependencyValues.nVerticesSpecified === 0) {

          // with no vertices, use center (specified or essential), direction, and a measure of size

          if (dependencyValues.haveSpecifiedCenter) {
            instructions.push({
              setDependency: "specifiedCenter",
              desiredValue: desiredCenter,
            })
          } else {
            instructions.push({
              setDependency: "essentialCenter",
              desiredValue: desiredCenter,
            })
          }

          let desiredCircumradius = Math.sqrt(desiredDirectionWithRadius[0] ** 2 + desiredDirectionWithRadius[1] ** 2);
          let desiredDirection = desiredDirectionWithRadius.map(x => x / desiredCircumradius);


          if (dependencyValues.specifiedCircumradius !== null) {
            instructions.push({
              setDependency: "specifiedCircumradius",
              desiredValue: desiredCircumradius,
            })
          } else if (dependencyValues.specifiedInradius !== null) {
            instructions.push({
              setDependency: "specifiedInradius",
              desiredValue: desiredCircumradius * Math.cos(Math.PI / nVertices),
            })
          } else if (dependencyValues.specifiedSideLength !== null) {
            instructions.push({
              setDependency: "specifiedSideLength",
              desiredValue: desiredCircumradius * (2 * Math.sin(Math.PI / nVertices)),
            })
          } else if (dependencyValues.specifiedPerimeter !== null) {
            instructions.push({
              setDependency: "specifiedPerimeter",
              desiredValue: desiredCircumradius * (2 * nVertices * Math.sin(Math.PI / nVertices)),
            })
          } else if (dependencyValues.specifiedArea !== null) {
            instructions.push({
              setDependency: "specifiedArea",
              desiredValue: desiredCircumradius ** 2 * (nVertices / 2 * Math.sin(2 * Math.PI / nVertices)),
            })
          } else {
            instructions.push({
              setDependency: "essentialCircumradius",
              desiredValue: desiredCircumradius,
            })
          }

          instructions.push({
            setDependency: "essentialDirection",
            desiredValue: desiredDirection,
          })


        } else if (dependencyValues.haveSpecifiedCenter) {

          // base polygon on center and first vertex

          instructions.push({
            setDependency: "specifiedCenter",
            desiredValue: desiredCenter,
          })

          let desiredVertices = {
            "0,0": me.fromAst(desiredDirectionWithRadius[0] + desiredCenter[0]),
            "0,1": me.fromAst(desiredDirectionWithRadius[1] + desiredCenter[1])
          };

          instructions.push({
            setDependency: "verticesAttr",
            desiredValue: desiredVertices,
            variableIndex: 0,
          })

        } else if (dependencyValues.nVerticesSpecified === 1) {
          // one vertex, no center
          // use vertex, direction, and a measure of size

          let desiredCircumradius = Math.sqrt(desiredDirectionWithRadius[0] ** 2 + desiredDirectionWithRadius[1] ** 2);
          let desiredDirection = desiredDirectionWithRadius.map(x => x / desiredCircumradius);

          if (dependencyValues.specifiedCircumradius !== null) {
            instructions.push({
              setDependency: "specifiedCircumradius",
              desiredValue: desiredCircumradius,
            })
          } else if (dependencyValues.specifiedInradius !== null) {
            instructions.push({
              setDependency: "specifiedInradius",
              desiredValue: desiredCircumradius * Math.cos(Math.PI / nVertices),
            })
          } else if (dependencyValues.specifiedSideLength !== null) {
            instructions.push({
              setDependency: "specifiedSideLength",
              desiredValue: desiredCircumradius * (2 * Math.sin(Math.PI / nVertices)),
            })
          } else if (dependencyValues.specifiedPerimeter !== null) {
            instructions.push({
              setDependency: "specifiedPerimeter",
              desiredValue: desiredCircumradius * (2 * nVertices * Math.sin(Math.PI / nVertices)),
            })
          } else if (dependencyValues.specifiedArea !== null) {
            instructions.push({
              setDependency: "specifiedArea",
              desiredValue: desiredCircumradius ** 2 * (nVertices / 2 * Math.sin(2 * Math.PI / nVertices)),
            })
          } else {
            instructions.push({
              setDependency: "essentialCircumradius",
              desiredValue: desiredCircumradius,
            })
          }

          instructions.push({
            setDependency: "essentialDirection",
            desiredValue: desiredDirection,
          })

          let desiredVertices = {
            "0,0": me.fromAst(desiredDirectionWithRadius[0] + desiredCenter[0]),
            "0,1": me.fromAst(desiredDirectionWithRadius[1] + desiredCenter[1])
          };

          instructions.push({
            setDependency: "verticesAttr",
            desiredValue: desiredVertices,
            variableIndex: 0,
          })

        } else {
          // have at least two vertices specified
          // these vertices are adjacent vertices of the polygon, in counterclockwise order

          let angle = 2 * Math.PI / nVertices;

          let c = Math.cos(angle);
          let s = Math.sin(angle);

          let desiredDirectionWithRadius2 = [desiredDirectionWithRadius[0] * c - desiredDirectionWithRadius[1] * s, desiredDirectionWithRadius[0] * s + desiredDirectionWithRadius[1] * c];

          let desiredVertices = {
            "0,0": me.fromAst(desiredDirectionWithRadius[0] + desiredCenter[0]),
            "0,1": me.fromAst(desiredDirectionWithRadius[1] + desiredCenter[1]),
            "1,0": me.fromAst(desiredDirectionWithRadius2[0] + desiredCenter[0]),
            "1,1": me.fromAst(desiredDirectionWithRadius2[1] + desiredCenter[1])
          };


          instructions.push({
            setDependency: "verticesAttr",
            desiredValue: desiredVertices,
            variableIndex: 0,
          })

        }

        return {
          success: true,
          instructions
        }

      }

    }


    stateVariableDefinitions.vertices = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        returnWrappingComponents(prefix) {
          if (prefix === "vertexX") {
            return [];
          } else {
            // vertex or entire array
            // wrap inner dimension by both <point> and <xs>
            // don't wrap outer dimension (for entire array)
            return [["point", { componentType: "mathList", isAttribute: "xs" }]];
          }
        },
      },
      isArray: true,
      nDimensions: 2,
      entryPrefixes: ["vertexX", "vertex"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if (arrayEntryPrefix === "vertexX") {
          // vertexX1_2 is the 2nd component of the first vertex
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === 2 && indices.every(
            (x, i) => Number.isInteger(x) && x >= 0
          )) {
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
            return Array.from(Array(arraySize[1]), (_, i) => pointInd + "," + i)
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
            return `vertexX${propIndex[0]}_${propIndex[1]}`
          }
        }
        if (varName.slice(0, 6) === "vertex") {
          // could be vertex or vertexX
          let vertexNum = Number(varName.slice(6));
          if (Number.isInteger(vertexNum) && vertexNum > 0) {
            // if propIndex has additional entries, ignore them
            return `vertexX${vertexNum}_${propIndex[0]}`
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        }
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVertices, 2];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          nVertices: {
            dependencyType: "stateVariable",
            variableName: "nVertices"
          },
          centerComponents: {
            dependencyType: "stateVariable",
            variableName: "centerComponents"
          },
          directionWithRadius: {
            dependencyType: "stateVariable",
            variableName: "directionWithRadius"
          },

        };

        return {
          globalDependencies
        };
      },
      arrayDefinitionByKey({ globalDependencyValues }) {

        // just compute all vertices every time, as they are all mutually dependent
        // (rather than just computing for the array keys requested)

        let nVertices = globalDependencyValues.nVertices;

        let center = globalDependencyValues.centerComponents;
        let directionWithRadius = globalDependencyValues.directionWithRadius;


        let vertices = {};

        if (center.some(x => !Number.isFinite(x)) || directionWithRadius.some(x => !Number.isFinite(x))) {
          for (let vertexInd = 0; vertexInd < nVertices; vertexInd++) {
            vertices[`${vertexInd},0`] = me.fromAst('\uff3f')
            vertices[`${vertexInd},1`] = me.fromAst('\uff3f')

          }
        } else {

          for (let vertexInd = 0; vertexInd < nVertices; vertexInd++) {

            let rotation = vertexInd * 2 * Math.PI / nVertices;

            let s = Math.sin(rotation);
            let c = Math.cos(rotation);

            vertices[`${vertexInd},0`] = me.fromAst(center[0] + directionWithRadius[0] * c - directionWithRadius[1] * s);
            vertices[`${vertexInd},1`] = me.fromAst(center[1] + directionWithRadius[0] * s + directionWithRadius[1] * c);

          }
        }

        return { setValue: { vertices } };
      },

      async inverseArrayDefinitionByKey({
        desiredStateVariableValues, globalDependencyValues,
        stateValues, workspace
      }) {

        let nVertices = globalDependencyValues.nVertices;

        if (!workspace.desiredVertices) {
          workspace.desiredVertices = {};
        }
        Object.assign(workspace.desiredVertices, desiredStateVariableValues.vertices);


        let desiredKeys = Object.keys(workspace.desiredVertices);
        let vertexInd1String = desiredKeys[0].split(",")[0];
        let changingJustOneVertex = desiredKeys.every(v => v.split(",")[0] === vertexInd1String);

        let desiredCenter;

        if (changingJustOneVertex) {
          // if change one vertex, then make sure that center stays the same

          desiredCenter = (await stateValues.center).map(evaluate_to_constant);

        } else {

          // if change multiple vertices, then calculate center as average of all vertices

          if (!workspace.allVertices) {
            workspace.allVertices = {};
          }

          Object.assign(workspace.allVertices, workspace.desiredVertices);

          let center_x = 0, center_y = 0;

          for (let vertexInd = 0; vertexInd < nVertices; vertexInd++) {

            let v_x = workspace.allVertices[vertexInd + ",0"];
            if (!v_x) {
              let vertices = await stateValues.vertices
              v_x = vertices[vertexInd][0];
              workspace.allVertices[vertexInd + ",0"] = v_x;
            }


            let v_y = workspace.allVertices[vertexInd + ",1"];
            if (!v_y) {
              let vertices = await stateValues.vertices
              v_y = vertices[vertexInd][1];
              workspace.allVertices[vertexInd + ",1"] = v_y;
            }

            center_x += evaluate_to_constant(v_x);
            center_y += evaluate_to_constant(v_y);
          }

          center_x /= nVertices;
          center_y /= nVertices;

          desiredCenter = [center_x, center_y];

        }


        // use the first index found in desired indices to determine directionWithRadius
        let vertexInd1 = Number(vertexInd1String);

        let desiredVertex_x = workspace.desiredVertices[vertexInd1String + ",0"];
        if (!desiredVertex_x) {
          let vertices = await stateValues.vertices;
          desiredVertex_x = vertices[vertexInd1][0];
        }

        let desiredVertex_y = workspace.desiredVertices[vertexInd1String + ",1"];
        if (!desiredVertex_y) {
          let vertices = await stateValues.vertices;
          desiredVertex_y = vertices[vertexInd1][1];
        }

        let desiredVertex = [evaluate_to_constant(desiredVertex_x), evaluate_to_constant(desiredVertex_y)];

        let centerToVertex = [desiredVertex[0] - desiredCenter[0], desiredVertex[1] - desiredCenter[1]];

        let angle = -vertexInd1 * 2 * Math.PI / nVertices;

        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let desiredDirectionWithRadius = [centerToVertex[0] * c - centerToVertex[1] * s, centerToVertex[0] * s + centerToVertex[1] * c];



        let instructions = [{
          setDependency: "centerComponents",
          desiredValue: desiredCenter,
        }, {
          setDependency: "directionWithRadius",
          desiredValue: desiredDirectionWithRadius,
        }];


        return {
          success: true,
          instructions
        }
      }
    }



    stateVariableDefinitions.center = {
      public: true,
      isArray: true,
      entryPrefixes: ["centerX"],
      shadowingInstructions: {
        createComponentOfType: "math",
        returnWrappingComponents(prefix) {
          if (prefix === "centerX") {
            return [];
          } else {
            // entire array
            // wrap by both <point> and <xs>
            return [["point", { componentType: "mathList", isAttribute: "xs" }]];
          }
        },
      },

      returnArraySizeDependencies: () => ({}),
      returnArraySize: () => [2],

      returnArrayDependenciesByKey() {

        let globalDependencies = {
          centerComponents: {
            dependencyType: "stateVariable",
            variableName: "centerComponents"
          },
        };

        return { globalDependencies };
      },

      arrayDefinitionByKey({ globalDependencyValues }) {

        return { setValue: { center: globalDependencyValues.centerComponents.map(x => me.fromAst(x)) } };
      },

      async inverseArrayDefinitionByKey({ desiredStateVariableValues, stateValues, workspace }) {


        let desired_center_x = desiredStateVariableValues.center[0];
        if (!desired_center_x) {
          desired_center_x = workspace.desired_center_x;
        }
        if (!desired_center_x) {
          desired_center_x = (await stateValues.center)[0]
        }
        workspace.desired_center_x = desired_center_x;

        let desired_center_y = desiredStateVariableValues.center[1];
        if (!desired_center_y) {
          desired_center_y = workspace.desired_center_y;
        }
        if (!desired_center_y) {
          desired_center_y = (await stateValues.center)[1]
        }
        workspace.desired_center_y = desired_center_y;



        let instructions = [{
          setDependency: "centerComponents",
          desiredValue: [evaluate_to_constant(desired_center_x), evaluate_to_constant(desired_center_y)],
        }];

        return {
          success: true,
          instructions
        }
      }
    }


    stateVariableDefinitions.circumradius = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        center: {
          dependencyType: "stateVariable",
          variableName: "center"
        },
        vertex1: {
          dependencyType: "stateVariable",
          variableName: "vertex1"
        }
      }),
      definition({ dependencyValues }) {
        let center = dependencyValues.center.map(evaluate_to_constant);

        let vertex1 = dependencyValues.vertex1.map(evaluate_to_constant);

        let circumradius = Math.sqrt(
          (vertex1[0] - center[0]) ** 2
          + (vertex1[1] - center[1]) ** 2
        )

        return { setValue: { circumradius } };

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let center = dependencyValues.center.map(evaluate_to_constant);

        let vertex1 = dependencyValues.vertex1.map(evaluate_to_constant);

        let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

        let previousRadius = Math.sqrt(directionWithRadius[0] ** 2 + directionWithRadius[1] ** 2);

        let desiredRadius = desiredStateVariableValues.circumradius;

        let desiredDirectionWithRadius = directionWithRadius.map(x => x / previousRadius * desiredRadius);


        let desiredVertex1 = [
          me.fromAst(desiredDirectionWithRadius[0] + center[0]),
          me.fromAst(desiredDirectionWithRadius[1] + center[1]),
        ]

        return {
          success: true,
          instructions: [{
            setDependency: "vertex1",
            desiredValue: desiredVertex1
          }]
        }

      }
    }



    stateVariableDefinitions.radius = {
      isAlias: true,
      targetVariableName: "circumradius"
    };



    stateVariableDefinitions.inradius = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let nVertices = dependencyValues.nVertices;

        let inradius = circumradius * Math.cos(Math.PI / nVertices)

        return { setValue: { inradius } };

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        let desiredInradius = desiredStateVariableValues.inradius;
        let nVertices = dependencyValues.nVertices;

        let desiredCircumradius = desiredInradius / Math.cos(Math.PI / nVertices);

        return {
          success: true,
          instructions: [{
            setDependency: "circumradius",
            desiredValue: desiredCircumradius
          }]
        }

      }
    }


    stateVariableDefinitions.apothem = {
      isAlias: true,
      targetVariableName: "inradius"
    };


    stateVariableDefinitions.sideLength = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let nVertices = dependencyValues.nVertices;

        let sideLength = circumradius * (2 * Math.sin(Math.PI / nVertices))

        return { setValue: { sideLength } };

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        let desiredSideLength = desiredStateVariableValues.sideLength;
        let nVertices = dependencyValues.nVertices;

        let desiredCircumradius = desiredSideLength / (2 * Math.sin(Math.PI / nVertices));

        return {
          success: true,
          instructions: [{
            setDependency: "circumradius",
            desiredValue: desiredCircumradius
          }]
        }

      }
    }


    stateVariableDefinitions.perimeter = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let nVertices = dependencyValues.nVertices;

        let perimeter = circumradius * (2 * nVertices * Math.sin(Math.PI / nVertices))

        return { setValue: { perimeter } };

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        let desiredPerimeter = desiredStateVariableValues.perimeter;
        let nVertices = dependencyValues.nVertices;

        let desiredCircumradius = desiredPerimeter / (2 * nVertices * Math.sin(Math.PI / nVertices));

        return {
          success: true,
          instructions: [{
            setDependency: "circumradius",
            desiredValue: desiredCircumradius
          }]
        }

      }
    }


    stateVariableDefinitions.area = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        circumradius: {
          dependencyType: "stateVariable",
          variableName: "circumradius"
        },
        nVertices: {
          dependencyType: "stateVariable",
          variableName: "nVertices"
        },
      }),
      definition({ dependencyValues }) {
        let circumradius = dependencyValues.circumradius;
        let nVertices = dependencyValues.nVertices;

        let area = circumradius ** 2 * (nVertices / 2 * Math.sin(2 * Math.PI / nVertices))

        return { setValue: { area } };

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        let desiredArea = desiredStateVariableValues.area;
        let nVertices = dependencyValues.nVertices;



        let desiredCircumradius = Math.sqrt(desiredArea
          / (nVertices / 2 * Math.sin(2 * Math.PI / nVertices)))

        return {
          success: true,
          instructions: [{
            setDependency: "circumradius",
            desiredValue: desiredCircumradius
          }]
        }

      }
    }




    stateVariableDefinitions.nSides = {
      isAlias: true,
      targetVariableName: "nVertices"
    };

    return stateVariableDefinitions;
  }


}

function evaluate_to_constant(x) {
  let val = x.evaluate_to_constant();
  if (val === null) {
    return NaN;
  } else {
    return val;
  }
}