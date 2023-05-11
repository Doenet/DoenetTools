import BaseComponent from "./BaseComponent";
import me from "math-expressions";
import { convertValueToMathExpression, textToAst } from "../../utils/math";
import { breakEmbeddedStringsIntoParensPieces } from "../commonsugar/breakstrings";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "../commonsugar/lists";

export class ComponentWithSelectableType extends BaseComponent {
  static componentType = "_componentWithSelectableType";
  static rendererType = undefined;

  static includeBlankStringChildren = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.type = {
      createPrimitiveOfType: "string",
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = [];

    function addType({
      matchedChildren,
      componentAttributes,
      parentAttributes,
    }) {
      let type = componentAttributes.type;
      if (!type) {
        type = parentAttributes.type;
      }
      if (!type) {
        type = "number";
      } else if (
        !["number", "letters", "math", "text", "boolean"].includes(type)
      ) {
        console.warn(`Invalid type ${type}, setting type to number`);
        type = "number";
      }

      let componentType = type === "letters" ? "text" : type;

      // remove blank string if componentType isn't text
      if (componentType !== "text") {
        matchedChildren = matchedChildren.filter(
          (x) => typeof x !== "string" || x.trim() !== "",
        );
      }

      return {
        success: true,
        newChildren: [
          {
            componentType,
            children: matchedChildren,
          },
        ],
      };
    }

    sugarInstructions.push({
      replacementFunction: addType,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "anything",
        componentTypes: ["_base"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.type = {
      shadowVariable: true,
      returnDependencies: () => ({
        type: {
          dependencyType: "doenetAttribute",
          attributeName: "type",
        },
        parentType: {
          dependencyType: "parentStateVariable",
          variableName: "type",
        },
      }),
      definition: function ({ dependencyValues, componentName }) {
        let type = dependencyValues.type;
        if (!type) {
          type = dependencyValues.parentType;
        }
        if (!type) {
          type = "number";
        } else if (
          !["number", "letters", "math", "text", "boolean"].includes(type)
        ) {
          console.warn(`Invalid type ${type}, setting type to number`);
          type = "number";
        }

        return { setValue: { type } };
      },
    };

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
      },
      shadowVariable: true,
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        atMostOneChild: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        let value;

        if (dependencyValues.atMostOneChild.length > 0) {
          // value = convertValueToType(
          //   dependencyValues.atMostOneChild[0].stateValues.value,
          //   dependencyValues.type
          // );
          value = dependencyValues.atMostOneChild[0].stateValues.value;
        } else {
          // use the behavior of the different types
          if (
            dependencyValues.type === "text" ||
            dependencyValues.type === "letters"
          ) {
            value = "";
          } else if (dependencyValues.type === "boolean") {
            value = false;
          } else if (dependencyValues.type === "number") {
            value = NaN;
          } else {
            value = me.fromAst("\uff3f");
          }
        }

        return {
          setValue: { value },
          setCreateComponentOfType: { value: dependencyValues.type },
        };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.atMostOneChild.length > 0) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "atMostOneChild",
                desiredValue: desiredStateVariableValues.value,
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

    return stateVariableDefinitions;
  }
}

export class ComponentListWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentListWithSelectableType";

  static includeBlankStringChildren = true;
  static removeBlankStringChildrenPostSugar = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.type = {
      createPrimitiveOfType: "string",
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = [];

    sugarInstructions.push({
      replacementFunction: function ({
        matchedChildren,
        componentAttributes,
        parentAttributes,
        isAttributeComponent = false,
        createdFromMacro = false,
        componentInfoObjects,
      }) {
        let type = componentAttributes.type;
        if (!type) {
          type = parentAttributes.type;
        }
        if (!type) {
          type = "number";
        } else if (
          !["number", "letters", "math", "text", "boolean"].includes(type)
        ) {
          console.warn(`Invalid type ${type}, setting type to number`);
          type = "number";
        }

        let componentType = type === "letters" ? "text" : type;

        let groupIntoComponentTypesSeparatedBySpaces =
          returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
            componentType,
          });

        return groupIntoComponentTypesSeparatedBySpaces({ matchedChildren });
      },
    });

    return sugarInstructions;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.value;

    stateVariableDefinitions.numValues = {
      additionalStateVariablesDefined: ["childForValue"],
      returnDependencies: () => ({
        anythingForSelectedType: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["numValues"],
          variablesOptional: true,
        },
      }),
      definition({ dependencyValues }) {
        let numValues = 0;
        let childForValue = [];
        for (let [
          ind,
          child,
        ] of dependencyValues.anythingForSelectedType.entries()) {
          let n = Number.isInteger(child.stateValues.numValues)
            ? child.stateValues.numValues
            : 1;
          numValues += n;
          for (let i = 0; i < n; i++) {
            childForValue.push({ child: ind, valueIndex: i });
          }
        }
        return {
          setValue: { numValues, childForValue },
        };
      },
    };

    stateVariableDefinitions.values = {
      public: true,
      isArray: true,
      shadowingInstructions: {
        hasVariableComponentType: true,
      },
      entryPrefixes: ["value"],
      stateVariablesDeterminingDependencies: ["childForValue"],
      returnArraySizeDependencies: () => ({
        numValues: {
          dependencyType: "stateVariable",
          variableName: "numValues",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numValues];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let globalDependencies = {
          type: {
            dependencyType: "stateVariable",
            variableName: "type",
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let childInfo = stateValues.childForValue[arrayKey];
          dependenciesByKey[arrayKey] = {
            anythingForSelectedType: {
              dependencyType: "child",
              childGroups: ["anything"],
              variableNames: ["value", "values"],
              childIndices: [childInfo.child],
              variablesOptional: true,
            },
            valueIndex: {
              dependencyType: "value",
              value: childInfo.valueIndex,
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
        // console.log(`array definition for value of component list with selectable type, ${componentName}`)
        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey);
        // console.log(arrayKeys)

        let values = {};

        for (let arrayKey of arrayKeys) {
          if (
            dependencyValuesByKey[arrayKey].anythingForSelectedType &&
            dependencyValuesByKey[arrayKey].anythingForSelectedType.length === 1
          ) {
            let child =
              dependencyValuesByKey[arrayKey].anythingForSelectedType[0];
            let value;
            if (child.stateValues.values) {
              value =
                child.stateValues.values[
                  dependencyValuesByKey[arrayKey].valueIndex
                ];
            } else {
              value = child.stateValues.value;
            }
            values[arrayKey] = convertValueToType(
              value,
              globalDependencyValues.type,
            );
          }
        }

        return {
          setValue: { values },
          setCreateComponentOfType: { values: globalDependencyValues.type },
        };
      },
    };

    return stateVariableDefinitions;
  }
}

export class ComponentListOfListsWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentListOfListsWithSelectableType";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.type = {
      createPrimitiveOfType: "string",
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = [];

    let breakIntoListsByParensAndAddType = function ({
      matchedChildren,
      componentAttributes,
      parentAttributes,
    }) {
      let results = breakEmbeddedStringsIntoParensPieces({
        componentList: matchedChildren,
        removeParens: true,
      });

      if (results.success !== true) {
        return { success: false };
      }

      let type = componentAttributes.type;
      if (!type) {
        type = parentAttributes.type;
      }
      if (!type) {
        type = "number";
      } else if (
        !["number", "letters", "math", "text", "boolean"].includes(type)
      ) {
        console.warn(`Invalid type ${type}, setting type to number`);
        type = "number";
      }

      return {
        success: true,
        newChildren: results.pieces.map((x) => ({
          componentType: "_componentListWithSelectableType",
          attributes: { type: { primitive: type } },
          children: x,
        })),
      };
    };

    sugarInstructions.push({
      replacementFunction: breakIntoListsByParensAndAddType,
    });

    return sugarInstructions;
  }

  static returnChildGroups() {
    return [
      {
        group: "lists",
        componentTypes: ["_componentListWithSelectableType"],
      },
    ];
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.value;

    stateVariableDefinitions.nLists = {
      returnDependencies: () => ({
        listChildren: {
          dependencyType: "child",
          childGroups: ["lists"],
        },
      }),
      definition({ dependencyValues }) {
        return { setValue: { nLists: dependencyValues.listChildren.length } };
      },
    };

    stateVariableDefinitions.lists = {
      isArray: true,
      entryPrefixes: ["list"],
      returnArraySizeDependencies: () => ({
        nLists: {
          dependencyType: "stateVariable",
          variableName: "nLists",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nLists];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          type: {
            dependencyType: "stateVariable",
            variableName: "type",
          },
        };

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            listChildren: {
              dependencyType: "child",
              childGroups: ["lists"],
              variableNames: ["values", "type"],
              childIndices: [arrayKey],
            },
          };
        }

        return { globalDependencies, dependenciesByKey };
      },
      arrayDefinitionByKey({
        globalDependencyValues,
        dependencyValuesByKey,
        arrayKeys,
      }) {
        let lists = {};

        for (let arrayKey of arrayKeys) {
          if (
            dependencyValuesByKey[arrayKey].listChildren &&
            dependencyValuesByKey[arrayKey].listChildren.length === 1
          ) {
            let listChild = dependencyValuesByKey[arrayKey].listChildren[0];
            if (listChild.stateValues.type === globalDependencyValues.type) {
              lists[arrayKey] = listChild.stateValues.values;
            } else {
              // have a list child of the wrong type, attempt to convert
              lists[arrayKey] = listChild.stateValues.values.map((x) =>
                convertValueToType(x, globalDependencyValues.type),
              );
            }
          }
        }

        return {
          setValue: { lists },
        };
      },
    };

    return stateVariableDefinitions;
  }
}

function convertValueToType(value, type) {
  if (Array.isArray(value)) {
    value = value[0];
  }
  if (type === "number") {
    if (value instanceof me.class) {
      let num = value.evaluate_to_constant();
      return num;
    }
    return Number(value);
  } else if (type === "math") {
    if (typeof value === "string") {
      try {
        return me.fromAst(textToAst.convert(value));
      } catch (e) {}
    }
    return convertValueToMathExpression(value);
  } else if (type === "boolean") {
    return Boolean(value);
  } else {
    // type is letters or text
    return String(value);
  }
}
