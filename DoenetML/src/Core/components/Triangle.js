import Polygon from "./Polygon";
import me from "math-expressions";

export default class Triangle extends Polygon {
  static componentType = "triangle";
  static rendererType = "polygon";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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
        "triangle",
      );

      return { setValue: { styleDescriptionWithNoun } };
    };

    stateVariableDefinitions.vertices.hasEssential = true;

    stateVariableDefinitions.vertices.defaultValueByArrayKey = function (
      arrayKey,
    ) {
      if (["0,1", "1,0"].includes(arrayKey)) {
        return me.fromAst(1);
      } else {
        return me.fromAst(0);
      }
    };

    stateVariableDefinitions.vertices.returnArraySizeDependencies = () => ({
      numDimensions: {
        dependencyType: "stateVariable",
        variableName: "numDimensions",
      },
    });
    stateVariableDefinitions.vertices.returnArraySize = function ({
      dependencyValues,
    }) {
      return [3, dependencyValues.numDimensions];
    };

    stateVariableDefinitions.vertices.arrayDefinitionByKey = function ({
      dependencyValuesByKey,
      arrayKeys,
    }) {
      // console.log('array definition of triangle vertices');
      // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
      // console.log(arrayKeys);

      let vertices = {};
      let useEssential = {};

      for (let arrayKey of arrayKeys) {
        let [pointInd, dim] = arrayKey.split(",");
        let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

        let verticesAttr = dependencyValuesByKey[arrayKey].vertices;
        if (
          verticesAttr !== null &&
          verticesAttr.stateValues["pointX" + varEnding]
        ) {
          vertices[arrayKey] = verticesAttr.stateValues["pointX" + varEnding];
        } else {
          useEssential[arrayKey] = true;
        }
      }

      // console.log({
      //   setValue: { vertices },
      //   useEssentialOrDefaultValue: { vertices: useEssential }

      // })

      return {
        setValue: { vertices },
        useEssentialOrDefaultValue: { vertices: useEssential },
      };
    };

    stateVariableDefinitions.vertices.inverseArrayDefinitionByKey =
      async function ({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        initialChange,
        stateValues,
      }) {
        // console.log(`inverseArrayDefinition of vertices of triangle`);
        // console.log(desiredStateVariableValues)
        // console.log(JSON.parse(JSON.stringify(stateValues)))
        // console.log(dependencyValuesByKey);

        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.vertices) {
          let [pointInd, dim] = arrayKey.split(",");
          let varEnding = Number(pointInd) + 1 + "_" + (Number(dim) + 1);

          if (
            dependencyValuesByKey[arrayKey].vertices !== null &&
            dependencyValuesByKey[arrayKey].vertices.stateValues[
              "pointX" + varEnding
            ]
          ) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].vertices,
              desiredValue: desiredStateVariableValues.vertices[arrayKey],
              variableIndex: 0,
            });
          } else {
            instructions.push({
              setEssentialValue: "vertices",
              value: {
                [arrayKey]:
                  desiredStateVariableValues.vertices[arrayKey].simplify(),
              },
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      };
    // stateVariableDefinitions.vertices.inverseDefinition = function ({ desiredStateVariableValues, dependencyValues,
    //   stateValues, initialChange, arrayKeys, workspace,
    // }) {

    //   // console.log(`inverseDefinition of vertices of triangle`);
    //   // console.log(desiredStateVariableValues)
    //   // console.log(JSON.parse(JSON.stringify(stateValues)))
    //   // console.log(arrayKeys);
    //   // console.log(dependencyValues);

    //   // if not draggable, then disallow initial change
    //   if (initialChange && !stateValues.draggable) {
    //     return { success: false };
    //   }

    //   let arrayKey;
    //   if (arrayKeys) {
    //     arrayKey = Number(arrayKeys[0]);
    //   }

    //   if (!workspace.desiredVertices) {
    //     workspace.desiredVertices = {};
    //   }

    //   if (arrayKey === undefined) {
    //     // working with entire array

    //     let instructions = [];

    //     let numVerticesSpecified = 0;
    //     if (dependencyValues.verticesAttr.length === 1) {
    //       numVerticesSpecified = Math.min(3, dependencyValues.verticesAttr[0].stateValues.numPoints);

    //       let verticesForVerticesAttr;
    //       if (Array.isArray(desiredStateVariableValues)) {
    //         verticesForVerticesAttr = desiredStateVariableValues.vertices.slice(0, numVerticesSpecified)
    //       } else {
    //         verticesForVerticesAttr = {};
    //         for (let key in desiredStateVariableValues.vertices) {
    //           if (Number(key) < numVerticesSpecified) {
    //             verticesForVerticesAttr[key] = desiredStateVariableValues.vertices[key]
    //           }
    //         }
    //         if (Object.keys(verticesForVerticesAttr).length === 0) {
    //           verticesForVerticesAttr = undefined;
    //         }
    //       }

    //       if (verticesForVerticesAttr) {
    //         instructions.push({
    //           setDependency: "verticesAttr",
    //           desiredValue: verticesForVerticesAttr,
    //           childIndex: 0,
    //           variableIndex: 0
    //         })
    //       }
    //     }

    //     for (let ind = numVerticesSpecified; ind < 3; ind++) {
    //       if (desiredStateVariableValues.vertices[ind] !== undefined) {

    //         // Since we don't have a vertex child that will do the merge,
    //         // we must manually merge here.
    //         let desiredVertex = mergeVertex({
    //           workspaceVertices: workspace.desiredVertices[ind],
    //           currentVertexValue: stateValues.vertices[ind],
    //           desiredVertex: desiredStateVariableValues.vertices[ind],
    //         });

    //         workspace.desiredVertices[ind] = desiredVertex.tree;

    //         instructions.push({
    //           setEssentialValue: "vertices",
    //           value: { [ind]: desiredVertex.simplify() },
    //         })
    //       }
    //     }

    //     return {
    //       success: true,
    //       instructions
    //     }
    //   } else {

    //     // just have one arrayKey
    //     if (arrayKey > 2) {
    //       return { success: false }
    //     }

    //     if (dependencyValues.verticesAttr.length === 1) {
    //       // so child variable of verticesAttr is an array entry (rather than array)
    //       let numVerticesSpecified = Math.min(3, dependencyValues.verticesAttr[0].stateValues.numPoints);
    //       if (arrayKey < numVerticesSpecified) {
    //         return {
    //           success: true,
    //           instructions: [{
    //             setDependency: "verticesAttr",
    //             desiredValue: desiredStateVariableValues.vertices[arrayKey],
    //             childIndex: 0,
    //             variableIndex: 0,
    //           }]
    //         }

    //       }
    //     }

    //     // Since we don't have a vertex child that will do the merge,
    //     // we must manually merge here.
    //     let desiredVertex = mergeVertex({
    //       workspaceVertices: workspace.desiredVertices[arrayKey],
    //       currentVertexValue: stateValues.vertices[arrayKey],
    //       desiredVertex: desiredStateVariableValues.vertices[arrayKey],
    //     });

    //     workspace.desiredVertices[arrayKey] = desiredVertex.tree;

    //     return {
    //       success: true,
    //       instructions: [{
    //         setEssentialValue: "vertices",
    //         value: { [arrayKey]: desiredVertex.simplify() },
    //       }]
    //     }

    //   }

    // }

    stateVariableDefinitions.numVertices = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numVertices: 3 } }),
    };

    return stateVariableDefinitions;
  }
}
