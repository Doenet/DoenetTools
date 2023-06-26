import me from "math-expressions";
import {
  convertValueToMathExpression,
  vectorOperators,
} from "../../utils/math";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingStateVariableDefinitions,
} from "../../utils/rounding";
import BaseComponent from "./BaseComponent";

export default class DirectionComponent extends BaseComponent {
  static componentType = "_directionComponent";
  static rendererType = undefined;

  static primaryStateVariableForDefinition = "directionShadow";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    Object.assign(attributes, returnRoundingAttributeComponentShadowing());
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let wrapNonMathInMath = function ({ matchedChildren }) {
      if (matchedChildren.length === 0) {
        return { success: false };
      }

      if (
        matchedChildren.length > 1 ||
        typeof matchedChildren[0] === "string"
      ) {
        return {
          success: true,
          newChildren: [
            {
              componentType: "math",
              children: matchedChildren,
            },
          ],
        };
      }

      return { success: false };
    };

    sugarInstructions.push({
      replacementFunction: wrapNonMathInMath,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    let childGroups = super.returnChildGroups();

    childGroups.push(
      ...[
        {
          group: "directions",
          componentTypes: ["_directionComponent"],
        },
        // {
        //   group: "maths",
        //   componentTypes: ["math"],
        // },
      ],
    );

    return childGroups;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.directionShadow = {
      defaultValue: me.fromAst(["vector", 1, 0]),
      hasEssential: true,
      essentialVarName: "direction",
      set: convertValueToMathExpression,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          directionShadow: true,
        },
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "directionShadow",
              value: convertValueToMathExpression(
                desiredStateVariableValues.directionShadow,
              ),
            },
          ],
        };
      },
    };

    stateVariableDefinitions.unnormalizedDirection = {
      returnDependencies: () => ({
        directionChild: {
          dependencyType: "child",
          childGroups: ["directions"],
          variableNames: ["unnormalizedDirection"],
        },
        // mathChild: {
        //   dependencyType: "child",
        //   childGroups: ["maths"],
        //   variableNames: ["value"],
        // },
        directionShadow: {
          dependencyType: "stateVariable",
          variableName: "directionShadow",
        },
      }),
      definition({ dependencyValues }) {
        let unnormalizedDirection;
        if (dependencyValues.directionChild.length > 0) {
          unnormalizedDirection =
            dependencyValues.directionChild[0].stateValues
              .unnormalizedDirection;
          // } else if (dependencyValues.mathChild.length > 0) {
          //   unnormalizedDirection =
          //     dependencyValues.mathChild[0].stateValues.value;
        } else {
          unnormalizedDirection = dependencyValues.directionShadow;
        }
        unnormalizedDirection = unnormalizedDirection
          .tuples_to_vectors()
          .expand()
          .simplify();
        return { setValue: { unnormalizedDirection } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let instructions;
        if (dependencyValues.directionChild.length > 0) {
          instructions = [
            {
              setDependency: "directionChild",
              desiredValue: desiredStateVariableValues.unnormalizedDirection,
              childIndex: 0,
              variableIndex: 0,
            },
          ];
          // } else if (dependencyValues.mathChild.length > 0) {
          //   instructions = [
          //     {
          //       setDependency: "mathChild",
          //       desiredValue: desiredStateVariableValues.unnormalizedDirection,
          //       childIndex: 0,
          //       variableIndex: 0,
          //     },
          //   ];
        } else {
          instructions = [
            {
              setDependency: "directionShadow",
              desiredValue: desiredStateVariableValues.unnormalizedDirection,
            },
          ];
        }
        return { success: true, instructions };
      },
    };

    stateVariableDefinitions.numDimensions = {
      returnDependencies: () => ({
        unnormalizedDirection: {
          dependencyType: "stateVariable",
          variableName: "unnormalizedDirection",
        },
      }),
      definition({ dependencyValues }) {
        let directionTree = dependencyValues.unnormalizedDirection.tree;
        let numDimensions;
        if (
          Array.isArray(directionTree) &&
          vectorOperators.includes(directionTree[0])
        ) {
          numDimensions = directionTree.length - 1;
        } else {
          numDimensions = 1;
        }

        return { setValue: { numDimensions } };
      },
    };

    stateVariableDefinitions.direction = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
        returnWrappingComponents(prefix) {
          if (prefix === "x") {
            return [];
          } else {
            // entire array
            // wrap by both <vector> and <xs>
            return [
              ["vector", { componentType: "mathList", isAttribute: "xs" }],
            ];
          }
        },
      },
      isArray: true,
      entryPrefixes: ["x"],
      hasEssential: true,
      essentialVarName: "direction2", // since "direction" used for directionShadow
      set: convertValueToMathExpression,
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
          unnormalizedDirection: {
            dependencyType: "stateVariable",
            variableName: "unnormalizedDirection",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey: function ({ globalDependencyValues, arraySize }) {
        let direction = {};

        let directionTree = globalDependencyValues.unnormalizedDirection.tree;
        if (
          Array.isArray(directionTree) &&
          vectorOperators.includes(directionTree[0])
        ) {
          let numericalDirection = [];
          let nDim = arraySize[0];
          let len2 = 0;
          let foundNumerical = true;

          for (let dim = 0; dim < nDim; dim++) {
            let val = globalDependencyValues.unnormalizedDirection
              .get_component(dim)
              .evaluate_to_constant();

            if (Number.isFinite(val)) {
              numericalDirection.push(val);
              len2 += val * val;
            } else {
              foundNumerical = false;
              break;
            }
          }

          if (foundNumerical) {
            let len = Math.sqrt(len2);
            for (let dim = 0; dim < nDim; dim++) {
              direction[dim.toString()] = me.fromAst(
                numericalDirection[dim] / len,
              );
            }
          } else {
            for (let dim = 0; dim < nDim; dim++) {
              direction[dim.toString()] = me.fromAst("\uff3f");
            }
          }
        } else {
          direction["0"] = me.fromAst(1);
        }

        return { setValue: { direction } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        arraySize,
      }) {
        let instructions = [];

        if (arraySize[0] > 1) {
          // try to preserve the magnitude of unnormalizedDirection
          let unnormalizedMagnitude = 0;
          for (let dim = 0; dim < arraySize[0]; dim++) {
            let comp = globalDependencyValues.unnormalizedDirection
              .get_component(dim)
              .evaluate_to_constant();
            unnormalizedMagnitude += comp * comp;
          }
          if (Number.isFinite(unnormalizedMagnitude)) {
            unnormalizedMagnitude = Math.sqrt(unnormalizedMagnitude);
          } else {
            unnormalizedMagnitude = 1;
          }

          let desiredDirection = ["vector"];
          for (let arrayKey in desiredStateVariableValues.direction) {
            desiredDirection[Number(arrayKey) + 1] =
              desiredStateVariableValues.direction[arrayKey].tree *
              unnormalizedMagnitude;
          }

          desiredDirection.length = arraySize[0] + 1;
          instructions.push({
            setDependency: "unnormalizedDirection",
            desiredValue: me.fromAst(desiredDirection),
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
