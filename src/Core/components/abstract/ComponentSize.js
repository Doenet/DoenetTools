import BaseComponent from "./BaseComponent";
import InlineComponent from "./InlineComponent";
import { mathStateVariableFromNumberStateVariable } from "../../utils/math";
import {
  returnSelectedStyleStateVariableDefinition,
  returnTextStyleDescriptionDefinitions,
} from "../../utils/style";

const unitConversions = {
  "": 1,
  px: 1,
  pixel: 1,
  pixels: 1,
  "%": 1,
  em: 100,
  in: 96,
  inch: 96,
  inches: 96,
  pt: 1.333333333333,
  mm: 3.7795296,
  millimeter: 3.7795296,
  millimeters: 3.7795296,
  cm: 37.795296,
  centimeter: 37.795296,
  centimeters: 37.795296,
};

export class ComponentSize extends InlineComponent {
  static componentType = "_componentSize";
  static rendererType = "text";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "componentSize";
  static stateVariableToBeShadowed = "componentSize";

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let addNumberAroundMultipleComponents = function ({ matchedChildren }) {
      // if last child is a string, extract unit if it exists
      let lastChild = matchedChildren[matchedChildren.length - 1];
      if (typeof lastChild === "string") {
        let lastWordRe = /([a-zA-z]+|%)$/;
        let lastString = lastChild.trim();
        let match = lastString.match(lastWordRe);

        if (match) {
          let unit = match[1];

          if (unit in unitConversions) {
            let rest = lastString.slice(0, match.index);

            let childrenForNumber = matchedChildren.slice(
              0,
              matchedChildren.length - 1,
            );
            if (rest.length > 0) {
              childrenForNumber.push(rest);
            }

            let newChildren = [
              {
                componentType: "number",
                children: childrenForNumber,
              },
              unit,
            ];

            return {
              success: true,
              newChildren,
            };
          }
        }
      }

      // if no unit, wrap all children with number
      return {
        success: true,
        newChildren: [
          {
            componentType: "number",
            children: matchedChildren,
          },
        ],
      };
    };

    // add math around multiple children
    // math will be adapted to a number
    sugarInstructions.push({
      childrenRegex: /..+/,
      replacementFunction: addNumberAroundMultipleComponents,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "strings",
        componentTypes: ["string"],
      },
      {
        group: "numbers",
        componentTypes: ["number"],
      },
      {
        group: "componentSizes",
        componentTypes: ["_componentSize"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let selectedStyleDefinition = returnSelectedStyleStateVariableDefinition();
    Object.assign(stateVariableDefinitions, selectedStyleDefinition);

    let styleDescriptionDefinitions = returnTextStyleDescriptionDefinitions();
    Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

    stateVariableDefinitions.componentSize = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
      hasEssential: true,
      returnDependencies: () => ({
        componentSizeChild: {
          dependencyType: "child",
          childGroups: ["componentSizes"],
          variableNames: ["componentSize"],
        },
        numberChild: {
          dependencyType: "child",
          childGroups: ["numbers"],
          variableNames: ["value"],
        },
        stringChild: {
          dependencyType: "child",
          childGroups: ["strings"],
          variableNames: ["value"],
        },
        parentDefaultAbsoluteSize: {
          dependencyType: "parentStateVariable",
          variableName: "defaultAbsoluteSize",
        },
      }),
      definition({ dependencyValues }) {
        // console.log('value dependencyValues')
        // console.log(dependencyValues);

        let defaultIsAbsolute =
          dependencyValues.parentDefaultAbsoluteSize === undefined
            ? false
            : dependencyValues.parentDefaultAbsoluteSize;

        if (dependencyValues.stringChild.length === 0) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.componentSizeChild.length === 0) {
              return {
                useEssentialOrDefaultValue: {
                  componentSize: {
                    defaultValue: {
                      size: 100,
                      isAbsolute: defaultIsAbsolute,
                    },
                  },
                },
              };
            } else {
              //only componentSize child

              return {
                setValue: {
                  componentSize:
                    dependencyValues.componentSizeChild[0].stateValues
                      .componentSize,
                },
              };
            }
          } else {
            //only number child

            return {
              setValue: {
                componentSize: {
                  size: dependencyValues.numberChild[0].stateValues.value,
                  isAbsolute: true,
                },
              },
            };
          }
        } else {
          //string child

          let originalSize, originalUnit;

          if (dependencyValues.numberChild.length > 0) {
            //string and number child

            originalSize = dependencyValues.numberChild[0].stateValues.value;
            originalUnit = dependencyValues.stringChild[0].trim();
          } else {
            //only string child

            // <width>100</width>
            // <width>100px</width>
            // <width>100 px</width>
            // <width>100 pixels</width>
            // <width>100pixels</width>
            // <width>100     pixel</width>
            // <width>100pixel</width>
            // <width>50%</width>

            let result = dependencyValues.stringChild[0]
              .trim()
              .match(/^(-?[\d.]+)\s*(.*)$/);
            if (result === null) {
              // console.warn(componentType + " must begin with a number.");
              return { setValue: { componentSize: null } };
            }
            originalSize = result[1];
            originalUnit = result[2].trim();
          }

          originalSize = Number(originalSize);
          if (!Number.isFinite(originalSize)) {
            // console.warn(componentType + " must have a number");
            return { setValue: { componentSize: null } };
          }

          let isAbsolute = !(originalUnit === "%" || originalUnit === "em");

          let factor = unitConversions[originalUnit];
          if (factor === undefined) {
            // console.warn(originalUnit + ' is not a defined unit of measure.');
            factor = 1;
          }

          let size = factor * originalSize;

          // console.log(`value: ${value}, isAbsolute: ${isAbsolute}`);

          return {
            setValue: {
              componentSize: {
                size,
                isAbsolute,
              },
            },
          };
        }
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.stringChild.length === 0) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.componentSizeChild.length === 0) {
              return {
                success: true,
                instructions: [
                  {
                    setEssentialValue: "componentSize",
                    value: desiredStateVariableValues.componentSize,
                  },
                ],
              };
            } else {
              //only componentSize child

              return {
                success: true,
                instructions: [
                  {
                    setDependency: "componentSizeChild",
                    desiredValue: desiredStateVariableValues.componentSize,
                    childIndex: 0,
                    variableIndex: 0,
                  },
                ],
              };
            }
          } else {
            //only number child

            if (!desiredStateVariableValues.componentSize.isAbsolute) {
              // if have only a number child, then we must have an absolute size
              return { success: false };
            }

            return {
              success: true,
              instructions: [
                {
                  setDependency: "numberChild",
                  desiredValue: desiredStateVariableValues.componentSize.size,
                  childIndex: 0,
                  variableIndex: 0,
                },
              ],
            };
          }
        } else {
          //string child

          if (dependencyValues.numberChild.length > 0) {
            //string and number child

            // this is the only case where we use the original unit specified by the string
            // (since the number could be defined in this context)

            let originalUnit = dependencyValues.stringChild[0].trim();
            let originalIsAbsolute = !(
              originalUnit === "%" || originalUnit === "em"
            );

            if (
              desiredStateVariableValues.componentSize.isAbsolute !==
              originalIsAbsolute
            ) {
              // we don't allow changing isAbsolute
              return { success: false };
            }

            let factor = unitConversions[originalUnit];
            if (factor === undefined) {
              factor = 1;
            }

            let desiredSize =
              desiredStateVariableValues.componentSize.size / factor;

            let instructions = [
              {
                setDependency: "numberChild",
                desiredValue: desiredSize,
                childIndex: 0,
                variableIndex: 0,
              },
            ];

            return {
              success: true,
              instructions,
            };
          } else {
            //only string child

            let desiredString = desiredStateVariableValues.componentSize.size;
            if (desiredStateVariableValues.componentSize.isAbsolute) {
              desiredString += "px";
            } else {
              desiredString += "%";
            }

            return {
              success: true,
              instructions: [
                {
                  setDependency: "stringChild",
                  desiredValue: desiredString,
                  childIndex: 0,
                  variableIndex: 0,
                },
              ],
            };
          }
        }
      },
    };

    stateVariableDefinitions.number = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        componentSize: {
          dependencyType: "stateVariable",
          variableName: "componentSize",
        },
      }),
      definition({ dependencyValues }) {
        let number = null;

        if (dependencyValues.componentSize) {
          number = dependencyValues.componentSize.size;
        }

        return { setValue: { number } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (!dependencyValues.componentSize) {
          return { success: false };
        }
        let desiredComponentSize = {
          size: desiredStateVariableValues.number,
          isAbsolute: dependencyValues.componentSize.isAbsolute,
        };

        return {
          success: true,
          instructions: [
            {
              setDependency: "componentSize",
              desiredValue: desiredComponentSize,
            },
          ],
        };
      },
    };

    stateVariableDefinitions.math = mathStateVariableFromNumberStateVariable({
      numberVariableName: "number",
      mathVariableName: "math",
      isPublic: true,
    });

    stateVariableDefinitions.isAbsolute = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "boolean",
      },
      returnDependencies: () => ({
        componentSize: {
          dependencyType: "stateVariable",
          variableName: "componentSize",
        },
      }),
      definition({ dependencyValues }) {
        let isAbsolute = null;

        if (dependencyValues.componentSize) {
          isAbsolute = dependencyValues.componentSize.isAbsolute;
        }

        return { setValue: { isAbsolute } };
      },
    };

    stateVariableDefinitions.text = {
      forRenderer: true,
      returnDependencies: () => ({
        componentSize: {
          dependencyType: "stateVariable",
          variableName: "componentSize",
        },
      }),
      definition({ dependencyValues }) {
        let text = "";

        if (dependencyValues.componentSize) {
          text = dependencyValues.componentSize.size;
          if (dependencyValues.componentSize.isAbsolute) {
            text += "px";
          } else {
            text += "%";
          }
        }

        return {
          setValue: { text },
        };
      },
    };

    return stateVariableDefinitions;
  }

  static adapters = ["number", "math"];
}

export class ComponentSizeList extends BaseComponent {
  static componentType = "_componentSizeList";
  static rendererType = "asList";
  static renderChildren = true;

  // when another component has a attribute that is a componentSizeList,
  // use the componentSizes state variable to populate that attribute
  static stateVariableToBeShadowed = "componentSizes";

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoComponentSizesByEmbeddedSpaces = function ({
      matchedChildren,
    }) {
      // break components into pieces by any spaces in a string
      // and wrap pieces with componentSize

      let newChildren = [];
      let piece = [];

      let createNewChildFromPiece = function () {
        if (piece.length > 0) {
          newChildren.push({
            componentType: "_componentSize",
            children: piece,
          });
          piece = [];
        }
      };

      for (let child of matchedChildren) {
        if (typeof child === "string") {
          let strParts = child.split(/\s+/);

          if (strParts[0].length === 0) {
            // string begins with a space
            // so if piece contains anything, it is a new child

            createNewChildFromPiece();

            strParts = strParts.slice(1);
          }

          for (let [i, s] of strParts.entries()) {
            if (s.length > 0) {
              piece.push(s);
              if (i < strParts.length - 1) {
                // if not last part, it means there was a space
                // after this part
                createNewChildFromPiece();
              }
            } else {
              // if have empty string (could only occur at end)
              // then means ended with a space
              createNewChildFromPiece();
            }
          }
        } else {
          // not a string, so add to piece
          piece.push(child);
        }
      }

      createNewChildFromPiece();

      return {
        success: true,
        newChildren,
      };
    };

    sugarInstructions.push({
      replacementFunction: breakIntoComponentSizesByEmbeddedSpaces,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "componentSizes",
        componentTypes: ["_componentSize"],
      },
      {
        group: "componentSizeLists",
        componentTypes: ["_componentSizeList"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // set overrideChildHide so that children are hidden
    // only based on whether or not the list is hidden
    // so that can't have a list with partially hidden components
    stateVariableDefinitions.overrideChildHide = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { overrideChildHide: true } }),
    };

    stateVariableDefinitions.numComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies() {
        return {
          componentSizeListChildren: {
            dependencyType: "child",
            childGroups: ["componentSizeLists"],
            variableNames: ["numComponents"],
          },
          componentSizeAndComponentSizeListChildren: {
            dependencyType: "child",
            childGroups: ["componentSizes", "componentSizeLists"],
            skipComponentNames: true,
          },
        };
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numComponents = 0;
        let childIndexByArrayKey = [];

        let nComponentSizeLists = 0;
        for (let [
          childInd,
          child,
        ] of dependencyValues.componentSizeAndComponentSizeListChildren.entries()) {
          if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "_componentSizeList",
            })
          ) {
            let componentSizeListChild =
              dependencyValues.componentSizeListChildren[nComponentSizeLists];
            nComponentSizeLists++;
            for (
              let i = 0;
              i < componentSizeListChild.stateValues.numComponents;
              i++
            ) {
              childIndexByArrayKey[numComponents + i] = [childInd, i];
            }
            numComponents += componentSizeListChild.stateValues.numComponents;
          } else {
            childIndexByArrayKey[numComponents] = [childInd, 0];
            numComponents += 1;
          }
        }

        return {
          setValue: { numComponents, childIndexByArrayKey },
          checkForActualChange: { numComponents: true },
        };
      },
    };

    stateVariableDefinitions.componentSizes = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "_componentSize",
      },
      isArray: true,
      entryPrefixes: ["componentSize"],
      stateVariablesDeterminingDependencies: ["childIndexByArrayKey"],
      returnArraySizeDependencies: () => ({
        numComponents: {
          dependencyType: "stateVariable",
          variableName: "numComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        let globalDependencies = {
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey",
          },
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let componentSizeIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            componentSizeIndex =
              stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            componentSizeAndComponentSizeListChildren: {
              dependencyType: "child",
              childGroups: ["componentSizes", "componentSizeLists"],
              variableNames: [
                "componentSize",
                "componentSize" + componentSizeIndex,
              ],
              variablesOptional: true,
              childIndices,
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
        componentInfoObjects,
      }) {
        let componentSizes = {};

        for (let arrayKey of arrayKeys) {
          let child =
            dependencyValuesByKey[arrayKey]
              .componentSizeAndComponentSizeListChildren[0];

          if (child) {
            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "_componentSizeList",
              })
            ) {
              let componentSizeIndex =
                globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              componentSizes[arrayKey] =
                child.stateValues["componentSize" + componentSizeIndex];
            } else {
              componentSizes[arrayKey] = child.stateValues.componentSize;
            }
          }
        }

        return { setValue: { componentSizes } };
      },
      inverseArrayDefinitionByKey({
        desiredStateVariableValues,
        globalDependencyValues,
        dependencyValuesByKey,
        dependencyNamesByKey,
        arraySize,
        componentInfoObjects,
      }) {
        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.componentSizes) {
          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child =
            dependencyValuesByKey[arrayKey]
              .componentSizeAndComponentSizeListChildren[0];

          if (child) {
            if (
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "_componentSizeList",
              })
            ) {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey]
                    .componentSizeAndComponentSizeListChildren,
                desiredValue:
                  desiredStateVariableValues.componentSizes[arrayKey],
                childIndex: 0,
                variableIndex: 1,
              });
            } else {
              instructions.push({
                setDependency:
                  dependencyNamesByKey[arrayKey]
                    .componentSizeAndComponentSizeListChildren,
                desiredValue:
                  desiredStateVariableValues.componentSizes[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });
            }
          }
        }

        return {
          success: true,
          instructions,
        };
      },
    };

    stateVariableDefinitions.numValues = {
      isAlias: true,
      targetVariableName: "numComponents",
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "componentSizes",
    };

    return stateVariableDefinitions;
  }
}
