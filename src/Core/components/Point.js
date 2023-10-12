import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import {
  convertValueToMathExpression,
  roundForDisplay,
  vectorOperators,
} from "../utils/math";
import { breakEmbeddedStringByCommas } from "./commonsugar/breakstrings";
import { deepClone } from "../utils/deepFunctions";
import { returnTextStyleDescriptionDefinitions } from "../utils/style";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class Point extends GraphicalComponent {
  constructor(args) {
    super(args);

    Object.assign(this.actions, {
      movePoint: this.movePoint.bind(this),
      switchPoint: this.switchPoint.bind(this),
      pointClicked: this.pointClicked.bind(this),
      pointFocused: this.pointFocused.bind(this),
    });
  }
  static componentType = "point";

  // Note: for other components with public point state variables,
  // the recommended course of action is not to have
  // a public state variable with component type point, which would use coordsShadow
  // Instead have a public array state variable of maths for each component
  // and use wrapping components to create points from those
  static primaryStateVariableForDefinition = "coordsShadow";
  static stateVariableToBeShadowed = "coords";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.draggable = {
      createComponentOfType: "boolean",
      createStateVariable: "draggable",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.x = {
      createComponentOfType: "math",
    };
    attributes.y = {
      createComponentOfType: "math",
    };
    attributes.z = {
      createComponentOfType: "math",
    };
    attributes.xs = {
      createComponentOfType: "mathList",
    };
    attributes.coords = {
      createComponentOfType: "coords",
    };

    Object.assign(attributes, returnRoundingAttributes());

    attributes.labelPosition = {
      createComponentOfType: "text",
      createStateVariable: "labelPosition",
      defaultValue: "upperright",
      public: true,
      forRenderer: true,
      toLowerCase: true,
      validValues: [
        "upperright",
        "upperleft",
        "lowerright",
        "lowerleft",
        "top",
        "bottom",
        "left",
        "right",
      ],
    };

    attributes.showCoordsWhenDragging = {
      createComponentOfType: "boolean",
      createStateVariable: "showCoordsWhenDragging",
      defaultValue: true,
      public: true,
      forRenderer: true,
    };

    attributes.hideOffGraphIndicator = {
      createComponentOfType: "boolean",
    };

    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoXsOrCoords = function ({
      matchedChildren,
      componentInfoObjects,
    }) {
      let componentIsSpecifiedType =
        componentInfoObjects.componentIsSpecifiedType;

      // Find potential component children, i.e., consecutive children that aren't constraints or labels
      let componentChildren = [],
        nonComponentChildrenBegin = [],
        nonComponentChildrenEnd = [];

      for (let child of matchedChildren) {
        if (
          componentIsSpecifiedType(child, "constraints") ||
          componentIsSpecifiedType(child, "label")
        ) {
          if (componentChildren.length > 0) {
            nonComponentChildrenEnd.push(child);
          } else {
            nonComponentChildrenBegin.push(child);
          }
        } else if (nonComponentChildrenEnd.length > 0) {
          nonComponentChildrenEnd.push(child);
        } else {
          componentChildren.push(child);
        }
      }

      if (componentChildren.length === 0) {
        return { success: false };
      }

      if (componentChildren.length === 1) {
        let child = componentChildren[0];

        if (
          componentIsSpecifiedType(child, "point") ||
          componentIsSpecifiedType(child, "vector")
        ) {
          // if have an isolated point or vector, don't use sugar
          // and that child will picked up by the point or vector child group
          return { success: false };
        }
      }

      let nCompChildren = componentChildren.length;

      // check if componentChildren represent a single expression inside parens
      let firstChar, lastChar;
      if (typeof componentChildren[0] === "string") {
        componentChildren[0] = componentChildren[0].trimStart();
        firstChar = componentChildren[0][0];
      }
      if (typeof componentChildren[nCompChildren - 1] === "string") {
        componentChildren[nCompChildren - 1] =
          componentChildren[nCompChildren - 1].trimEnd();
        let lastChild = componentChildren[nCompChildren - 1];
        lastChar = lastChild[lastChild.length - 1];
      }

      if (firstChar === "(" && lastChar === ")") {
        // start and end with parens, check if can split by commas after removing these parens
        let modifiedChildren = [...componentChildren];
        modifiedChildren[0] = modifiedChildren[0].substring(1);

        let lastChild = modifiedChildren[modifiedChildren.length - 1];
        modifiedChildren[modifiedChildren.length - 1] = lastChild.substring(
          0,
          lastChild.length - 1,
        );

        let breakResult = breakEmbeddedStringByCommas({
          childrenList: modifiedChildren,
        });

        if (breakResult.success) {
          // wrap maths around each piece, wrap whole thing in mathList
          // and use for xs attribute
          return {
            success: true,
            newAttributes: {
              xs: {
                component: {
                  componentType: "mathList",
                  children: breakResult.pieces.map((x) => ({
                    componentType: "math",
                    children: x,
                  })),
                  skipSugar: true,
                },
              },
            },
            newChildren: [
              ...nonComponentChildrenBegin,
              ...nonComponentChildrenEnd,
            ],
          };
        }
      }

      // if didn't succeed in breaking it into xs, then use the component children as a coords
      return {
        success: true,
        newAttributes: {
          coords: {
            component: {
              componentType: "coords",
              children: componentChildren,
            },
          },
        },
        newChildren: [...nonComponentChildrenBegin, ...nonComponentChildrenEnd],
      };
    };

    sugarInstructions.push({
      replacementFunction: breakIntoXsOrCoords,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    let childGroups = super.returnChildGroups();

    childGroups.push(
      ...[
        {
          group: "pointsAndVectors",
          componentTypes: ["point", "vector"],
        },
        {
          group: "constraints",
          componentTypes: ["constraints"],
        },
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
        let markerColorWord;
        if (dependencyValues.document?.stateValues.theme === "dark") {
          markerColorWord =
            dependencyValues.selectedStyle.markerColorWordDarkMode;
        } else {
          markerColorWord = dependencyValues.selectedStyle.markerColorWord;
        }
        return {
          setValue: {
            styleDescription: markerColorWord,
          },
        };
      },
    };

    stateVariableDefinitions.styleDescriptionWithNoun = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
        styleDescription: {
          dependencyType: "stateVariable",
          variableName: "styleDescription",
        },
      }),
      definition: function ({ dependencyValues }) {
        let pointDescription =
          dependencyValues.styleDescription +
          " " +
          dependencyValues.selectedStyle.markerStyleWord;
        return { setValue: { styleDescriptionWithNoun: pointDescription } };
      },
    };

    stateVariableDefinitions.hideOffGraphIndicator = {
      public: true,
      forRenderer: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        hideOffGraphIndicatorAttr: {
          dependencyType: "attributeComponent",
          attributeName: "hideOffGraphIndicator",
          variableNames: ["value"],
        },
        graphAncestor: {
          dependencyType: "ancestor",
          componentType: "graph",
          variableNames: ["hideOffGraphIndicators"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.hideOffGraphIndicatorAttr) {
          return {
            setValue: {
              hideOffGraphIndicator:
                dependencyValues.hideOffGraphIndicatorAttr.stateValues.value,
            },
          };
        } else if (dependencyValues.graphAncestor) {
          return {
            setValue: {
              hideOffGraphIndicator:
                dependencyValues.graphAncestor.stateValues
                  .hideOffGraphIndicators,
            },
          };
        } else {
          return {
            setValue: { hideOffGraphIndicator: false },
          };
        }
      },
    };

    // coordsShadow will be null unless point was created
    // via an adapter or copy prop or from serialized state with coords value
    // In case of adapter or copy prop,
    // given the primaryStateVariableForDefinition static variable,
    // the definition of coordsShadow will be changed to be the value
    // that shadows the component adapted or copied
    stateVariableDefinitions.coordsShadow = {
      defaultValue: null,
      isLocation: true,
      hasEssential: true,
      essentialVarName: "coords",
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          coordsShadow: true,
        },
      }),
      inverseDefinition: async function ({
        desiredStateVariableValues,
        stateValues,
        workspace,
      }) {
        return {
          success: true,
          instructions: [
            {
              setEssentialValue: "coordsShadow",
              value: desiredStateVariableValues.coordsShadow,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        coordsShadow: {
          dependencyType: "stateVariable",
          variableName: "coordsShadow",
        },
        coords: {
          dependencyType: "attributeComponent",
          attributeName: "coords",
          variableNames: ["value"],
        },
        x: {
          dependencyType: "attributeComponent",
          attributeName: "x",
        },
        y: {
          dependencyType: "attributeComponent",
          attributeName: "y",
        },
        z: {
          dependencyType: "attributeComponent",
          attributeName: "z",
        },
        xs: {
          dependencyType: "attributeComponent",
          attributeName: "xs",
          variableNames: ["numComponents"],
        },
        pointOrVectorChild: {
          dependencyType: "child",
          childGroups: ["pointsAndVectors"],
          variableNames: ["numDimensions"],
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`numDimensions definition`)
        // console.log(dependencyValues)

        let basedOnCoords = false;
        let coords;
        let numDimensions;

        // if have a component child, they will overwrite any other component values
        // so is a minimum for numDimensions
        // Exception if only x is specified, least numDimensions at zero
        // so that only specifying x still gives a 2D point
        // (If want 1D point, specify via other means, such as coords or xs)
        if (dependencyValues.z !== null) {
          numDimensions = 3;
        } else if (dependencyValues.y !== null) {
          numDimensions = 2;
        } else {
          numDimensions = 0;
        }

        if (dependencyValues.coords !== null) {
          basedOnCoords = true;
          coords = dependencyValues.coords.stateValues.value;
        } else if (dependencyValues.coordsShadow) {
          basedOnCoords = true;
          coords = dependencyValues.coordsShadow.tuples_to_vectors();
        }

        if (basedOnCoords) {
          let coordsTree = coords.expand().simplify().tree;
          if (
            Array.isArray(coordsTree) &&
            vectorOperators.includes(coordsTree[0])
          ) {
            numDimensions = Math.max(coordsTree.length - 1, numDimensions);
          } else {
            numDimensions = Math.max(1, numDimensions);
          }

          // if based on coords, should check for actual change
          // as frequently the dimension doesn't change
          return {
            setValue: { numDimensions },
            checkForActualChange: { numDimensions: true },
          };
        } else {
          if (dependencyValues.xs !== null) {
            return {
              setValue: {
                numDimensions: Math.max(
                  dependencyValues.xs.stateValues.numComponents,
                  numDimensions,
                ),
              },
            };
          }
          if (dependencyValues.pointOrVectorChild.length > 0) {
            return {
              setValue: {
                numDimensions: Math.max(
                  dependencyValues.pointOrVectorChild[0].stateValues
                    .numDimensions,
                  numDimensions,
                ),
              },
            };
          }

          if (numDimensions === 0) {
            // if nothing specified, make it a 2D point
            numDimensions = 2;
          }

          return {
            setValue: { numDimensions },
            checkForActualChange: { numDimensions: true },
          };
        }
      },
    };

    stateVariableDefinitions.arrayVariableForConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { arrayVariableForConstraints: "unconstrainedXs" },
      }),
    };

    stateVariableDefinitions.arrayEntryPrefixForConstraints = {
      returnDependencies: () => ({}),
      definition: () => ({
        setValue: { arrayEntryPrefixForConstraints: "unconstrainedX" },
      }),
    };

    stateVariableDefinitions.numDimensionsForConstraints = {
      isAlias: true,
      targetVariableName: "numDimensions",
    };

    stateVariableDefinitions.unconstrainedXs = {
      isArray: true,
      isLocation: true,
      entryPrefixes: ["unconstrainedX"],
      defaultValueByArrayKey: () => me.fromAst(0),
      hasEssential: true,
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          coordsShadow: {
            dependencyType: "stateVariable",
            variableName: "coordsShadow",
          },
          coords: {
            dependencyType: "attributeComponent",
            attributeName: "coords",
            variableNames: ["value"],
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            xs: {
              dependencyType: "attributeComponent",
              attributeName: "xs",
              variableNames: ["math" + varEnding],
            },
            pointOrVectorChild: {
              dependencyType: "child",
              childGroups: ["pointsAndVectors"],
              variableNames: ["x" + varEnding],
            },
          };
          if (arrayKey === "0") {
            dependenciesByKey[arrayKey].component = {
              dependencyType: "attributeComponent",
              attributeName: "x",
              variableNames: ["value"],
            };
          } else if (arrayKey === "1") {
            dependenciesByKey[arrayKey].component = {
              dependencyType: "attributeComponent",
              attributeName: "y",
              variableNames: ["value"],
            };
          } else if (arrayKey === "2") {
            dependenciesByKey[arrayKey].component = {
              dependencyType: "attributeComponent",
              attributeName: "z",
              variableNames: ["value"],
            };
          }
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        // console.log(`unconstrained xs definition by key for ${componentName}`)
        // console.log(deepClone(globalDependencyValues))
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let newXs = {};
        let essentialXs = {};

        let basedOnCoords = false;
        let coords;

        if (globalDependencyValues.coords !== null) {
          basedOnCoords = true;
          coords = globalDependencyValues.coords.stateValues.value;
        } else if (globalDependencyValues.coordsShadow) {
          basedOnCoords = true;
          coords = globalDependencyValues.coordsShadow.tuples_to_vectors();
        }

        if (basedOnCoords) {
          coords = coords.expand().simplify();
          let coordsTree = coords.tree;
          if (
            Array.isArray(coordsTree) &&
            vectorOperators.includes(coordsTree[0])
          ) {
            for (let arrayKey of arrayKeys) {
              let ind = Number(arrayKey);
              if (ind >= 0 || ind < coordsTree.length - 1) {
                if (coordsTree[ind + 1] === undefined) {
                  newXs[arrayKey] = me.fromAst("\uff3f");
                } else {
                  newXs[arrayKey] = coords.get_component(ind);
                }
              }
            }
          } else {
            if (arrayKeys.includes("0")) {
              newXs[0] = coords;
            }
          }
        } else {
          for (let arrayKey of arrayKeys) {
            let varEnding = Number(arrayKey) + 1;
            let xs = dependencyValuesByKey[arrayKey].xs;
            if (xs !== null) {
              let val = xs.stateValues["math" + varEnding];
              if (val !== undefined) {
                newXs[arrayKey] = val.simplify();
              }
            } else {
              let pointOrVectorChild =
                dependencyValuesByKey[arrayKey].pointOrVectorChild;
              if (pointOrVectorChild.length > 0) {
                newXs[arrayKey] =
                  pointOrVectorChild[0].stateValues["x" + varEnding];
              }
            }
          }
        }

        // if have a component, that supercedes other values
        for (let arrayKey of arrayKeys) {
          let component = dependencyValuesByKey[arrayKey].component;
          if (component) {
            newXs[arrayKey] = component.stateValues.value.simplify();
          } else if (newXs[arrayKey] === undefined) {
            essentialXs[arrayKey] = true;
          }
        }

        // console.log("newXs");
        // console.log(newXs);
        // console.log("essentialXs");
        // console.log(essentialXs);
        let result = {};
        if (Object.keys(newXs).length > 0) {
          result.setValue = { unconstrainedXs: newXs };
        }
        if (Object.keys(essentialXs).length > 0) {
          result.useEssentialOrDefaultValue = { unconstrainedXs: essentialXs };
        }
        return result;
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
      }) {
        // console.log(`invertUnconstrainedXs, ${componentName}`);
        // console.log(desiredStateVariableValues)
        // console.log(globalDependencyValues);
        // console.log(dependencyValuesByKey);

        let instructions = [];
        let basedOnCoords = false;
        let coordsDependency;
        let coordsTree;
        let setCoords = false;

        if (globalDependencyValues.coords !== null) {
          basedOnCoords = true;
          coordsDependency = "coords";
          coordsTree = Array(arraySize[0] + 1);
        } else if (globalDependencyValues.coordsShadow !== null) {
          basedOnCoords = true;
          coordsDependency = "coordsShadow";
          coordsTree = Array(arraySize[0] + 1);
        }

        for (let arrayKey of Object.keys(
          desiredStateVariableValues.unconstrainedXs,
        ).reverse()) {
          let desiredValue = convertValueToMathExpression(
            desiredStateVariableValues.unconstrainedXs[arrayKey],
          );

          let component = dependencyValuesByKey[arrayKey].component;
          if (component !== null) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].component,
              desiredValue,
              childIndex: 0,
              variableIndex: 0,
            });
          } else if (basedOnCoords) {
            coordsTree[Number(arrayKey) + 1] = desiredValue.tree;
            setCoords = true;
          } else {
            let xs = dependencyValuesByKey[arrayKey].xs;
            if (xs !== null) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].xs,
                desiredValue,
                childIndex: 0,
                variableIndex: 0,
              });
            } else {
              let pointOrVectorChild =
                dependencyValuesByKey[arrayKey].pointOrVectorChild;
              if (pointOrVectorChild.length > 0) {
                instructions.push({
                  setDependency:
                    dependencyNamesByKey[arrayKey].pointOrVectorChild,
                  desiredValue,
                  childIndex: 0,
                  variableIndex: 0,
                });
              } else {
                instructions.push({
                  setEssentialValue: "unconstrainedXs",
                  value: { [arrayKey]: desiredValue },
                });
              }
            }
          }
        }

        if (setCoords) {
          let desiredCoords;
          if (arraySize[0] === 1) {
            desiredCoords = me.fromAst(coordsTree[1]);
          } else {
            coordsTree[0] = "vector";
            desiredCoords = me.fromAst(coordsTree);
          }
          let instruction = {
            setDependency: coordsDependency,
            desiredValue: desiredCoords,
          };
          if (coordsDependency === "coords") {
            instruction.childIndex = 0;
            instruction.variableIndex = 0;
          }

          instructions.push(instruction);
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.xs = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      isArray: true,
      entryPrefixes: ["x"],
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;

          let keyDeps = {};
          keyDeps.unconstrainedX = {
            dependencyType: "stateVariable",
            variableName: `unconstrainedX${varEnding}`,
          };
          keyDeps.constraintsChild = {
            dependencyType: "child",
            childGroups: ["constraints"],
            variableNames: [`constraintResult${varEnding}`],
          };
          dependenciesByKey[arrayKey] = keyDeps;
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log('array definition of xs')
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys));

        let xs = {};

        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].constraintsChild.length > 0) {
            let varEnding = Number(arrayKey) + 1;
            xs[arrayKey] = convertValueToMathExpression(
              dependencyValuesByKey[arrayKey].constraintsChild[0].stateValues[
                "constraintResult" + varEnding
              ],
            );
          } else {
            xs[arrayKey] = convertValueToMathExpression(
              dependencyValuesByKey[arrayKey].unconstrainedX,
            );
          }
        }

        if (arrayKeys.length > 0) {
          return { setValue: { xs } };
        } else {
          return {};
        }
      },
      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        initialChange,
        stateValues,
      }) {
        // console.log('invert xs')
        // console.log(desiredStateVariableValues);
        // console.log(dependencyValuesByKey);
        // console.log(dependencyNamesByKey);

        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey of Object.keys(
          desiredStateVariableValues.xs,
        ).reverse()) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }
          if (dependencyValuesByKey[arrayKey].constraintsChild.length > 0) {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].constraintsChild,
              desiredValue: desiredStateVariableValues.xs[arrayKey],
              childIndex: 0,
              variableIndex: 0,
            });
          } else {
            instructions.push({
              setDependency: dependencyNamesByKey[arrayKey].unconstrainedX,
              desiredValue: desiredStateVariableValues.xs[arrayKey],
            });
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.x = {
      isAlias: true,
      targetVariableName: "x1",
    };

    stateVariableDefinitions.y = {
      isAlias: true,
      targetVariableName: "x2",
    };

    stateVariableDefinitions.z = {
      isAlias: true,
      targetVariableName: "x3",
    };

    stateVariableDefinitions.coords = {
      public: true,
      isLocation: true,
      shadowingInstructions: {
        createComponentOfType: "coords",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        xs: {
          dependencyType: "stateVariable",
          variableName: "xs",
        },
      }),
      definition: function ({ dependencyValues }) {
        // console.log(`definition of coords`)
        // console.log(deepClone(dependencyValues));
        let coordsAst = [];
        for (let v of dependencyValues.xs) {
          if (v) {
            coordsAst.push(v.tree);
          } else {
            coordsAst.push("\uff3f");
          }
        }
        if (coordsAst.length > 1) {
          coordsAst = ["vector", ...coordsAst];
        } else if (coordsAst.length === 1) {
          coordsAst = coordsAst[0];
        } else {
          coordsAst = "\uff3f";
        }

        return { setValue: { coords: me.fromAst(coordsAst) } };
      },

      inverseDefinition: async function ({
        desiredStateVariableValues,
        stateValues,
        initialChange,
      }) {
        // console.log("invertCoords");
        // console.log(desiredStateVariableValues)
        // console.log(stateValues);

        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        let instructions = [];

        let desiredXValues = {};

        let coordsTree = desiredStateVariableValues.coords.tree;

        if (
          !(
            Array.isArray(coordsTree) && vectorOperators.includes(coordsTree[0])
          )
        ) {
          desiredXValues[0] = desiredStateVariableValues.coords;
        } else {
          for (let i = 0; i < coordsTree.length - 1; i++) {
            let desiredValue =
              desiredStateVariableValues.coords.get_component(i);
            if (desiredValue.tree !== undefined) {
              desiredXValues[i] = desiredValue;
            }
          }
        }

        instructions.push({
          setDependency: "xs",
          desiredValue: desiredXValues,
        });

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.latex = {
      forRenderer: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "latex",
      },
      returnDependencies: () => ({
        coords: {
          dependencyType: "stateVariable",
          variableName: "coords",
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
          value: dependencyValues.coords,
          dependencyValues,
        }).toLatex(params);

        return { setValue: { latex } };
      },
    };

    // currently value is used by answer to get variable for response
    stateVariableDefinitions.value = {
      isAlias: true,
      targetVariableName: "coords",
    };

    stateVariableDefinitions.constraintUsed = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        constraintsChild: {
          dependencyType: "child",
          childGroups: ["constraints"],
          variableNames: ["constraintUsed"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.constraintsChild.length === 0) {
          return { setValue: { constraintUsed: false } };
        } else {
          return {
            setValue: {
              constraintUsed:
                dependencyValues.constraintsChild[0].stateValues.constraintUsed,
            },
          };
        }
      },
    };

    stateVariableDefinitions.numericalXs = {
      isArray: true,
      entryPrefixes: ["numericalX"],
      forRenderer: true,
      returnArraySizeDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numDimensions];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let varEnding = Number(arrayKey) + 1;
          dependenciesByKey[arrayKey] = {
            [`x`]: {
              dependencyType: "stateVariable",
              variableName: `x${varEnding}`,
            },
          };
        }
        return { dependenciesByKey };
      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
        // console.log(`definition of numericalXs`)
        // console.log(deepClone(dependencyValuesByKey))
        // console.log(deepClone(arrayKeys))

        let numericalXs = {};

        for (let arrayKey of arrayKeys) {
          let x = dependencyValuesByKey[arrayKey].x;
          if (x) {
            x = dependencyValuesByKey[arrayKey].x.evaluate_to_constant();
            numericalXs[arrayKey] = Number(x);
          } else {
            numericalXs[arrayKey] = NaN;
          }
        }

        return { setValue: { numericalXs } };
      },

      async inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        dependencyNamesByKey,
        initialChange,
        stateValues,
      }) {
        // if not draggable, then disallow initial change
        if (initialChange && !(await stateValues.draggable)) {
          return { success: false };
        }

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.numericalXs) {
          if (!dependencyNamesByKey[arrayKey]) {
            continue;
          }
          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].xs,
            desiredValue: desiredStateVariableValues.numericalXs[arrayKey],
          });
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        numericalXs: {
          dependencyType: "stateVariable",
          variableName: "numericalXs",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          nearestPoint: function () {
            // for point, nearest point is just the point itself
            // only implement for numerical values
            let result = {};

            for (let ind = 1; ind <= dependencyValues.numDimensions; ind++) {
              let x = dependencyValues.numericalXs[ind - 1];
              if (!Number.isFinite(x)) {
                return {};
              }
              result["x" + ind] = x;
            }
            return result;
          },
        },
      }),
    };

    return stateVariableDefinitions;
  }

  static adapters = [
    {
      stateVariable: "coords",
      stateVariablesToShadow: Object.keys(
        returnRoundingStateVariableDefinitions(),
      ),
    },
  ];

  async movePoint({
    x,
    y,
    z,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
  }) {
    let components = {};
    if (x !== undefined) {
      components[0] = me.fromAst(x);
    }
    if (y !== undefined) {
      components[1] = me.fromAst(y);
    }
    if (z !== undefined) {
      components[2] = me.fromAst(z);
    }
    if (transient) {
      return await this.coreFunctions.performUpdate({
        updateInstructions: [
          {
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "xs",
            value: components,
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
            stateVariable: "xs",
            value: components,
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
            x,
            y,
            z,
          },
        },
      });
    }
  }

  switchPoint() {}

  async pointClicked({
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
  }

  async pointFocused({
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
  }
}
