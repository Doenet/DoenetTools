import MathComponent from "./Math";
import {
  buildSubsetFromMathExpression,
  mathExpressionFromSubsetValue,
} from "../utils/subset-of-reals";
import { renameStateVariable } from "../utils/stateVariables";
import me from "math-expressions";
export default class SubsetOfReals extends MathComponent {
  static componentType = "subsetOfReals";
  static rendererType = "math";

  // used when creating new component via adapter or copy prop
  static primaryStateVariableForDefinition = "subsetValue";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.createIntervals.defaultValue = true;

    attributes.variable = {
      createComponentOfType: "_variableName",
      createStateVariable: "variable",
      defaultValue: me.fromAst("x"),
    };

    attributes.displayMode = {
      createComponentOfType: "text",
      createStateVariable: "displayMode",
      defaultValue: "intervals",
      public: true,
      toLowerCase: true,
      validValues: ["intervals", "inequalities"],
    };

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // rename unnormalizedValue to unnormalizedValuePreliminary
    renameStateVariable({
      stateVariableDefinitions,
      oldName: "unnormalizedValue",
      newName: "unnormalizedValuePreliminary",
    });

    stateVariableDefinitions.value.shadowingInstructions.createComponentOfType =
      "math";

    stateVariableDefinitions.haveSingleSubsetChild = {
      returnDependencies: () => ({
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let haveSingleSubsetChild =
          dependencyValues.mathChildren.length === 1 &&
          dependencyValues.mathChildren.filter((child) =>
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "subsetOfReals",
            }),
          ).length === 1;

        return { setValue: { haveSingleSubsetChild } };
      },
    };

    stateVariableDefinitions.subsetValue = {
      stateVariablesDeterminingDependencies: ["haveSingleSubsetChild"],
      returnDependencies({ stateValues }) {
        let dependencies = {
          haveSingleSubsetChild: {
            dependencyType: "stateVariable",
            variableName: "haveSingleSubsetChild",
          },
        };

        if (stateValues.haveSingleSubsetChild) {
          dependencies.subsetChild = {
            dependencyType: "child",
            childGroups: ["maths"],
            variableNames: ["subsetValue"],
          };
        } else {
          dependencies.unnormalizedValuePreliminary = {
            dependencyType: "stateVariable",
            variableName: "unnormalizedValuePreliminary",
          };
          dependencies.variable = {
            dependencyType: "stateVariable",
            variableName: "variable",
          };
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let subsetValue;

        if (dependencyValues.haveSingleSubsetChild) {
          subsetValue = dependencyValues.subsetChild[0].stateValues.subsetValue;
        } else {
          subsetValue = buildSubsetFromMathExpression(
            dependencyValues.unnormalizedValuePreliminary,
            dependencyValues.variable,
          );
        }

        return { setValue: { subsetValue } };
      },
      async inverseDefinition({
        desiredStateVariableValues,
        dependencyValues,
        stateValues,
      }) {
        if (dependencyValues.haveSingleSubsetChild) {
          return {
            success: true,
            instructions: [
              {
                setDependency: "subsetChild",
                desiredValue: desiredStateVariableValues.subsetValue,
                childIndex: 0,
                variableIndex: 0,
              },
            ],
          };
        } else {
          let mathExpression = mathExpressionFromSubsetValue({
            subsetValue: desiredStateVariableValues.subsetValue,
            variable: dependencyValues.variable,
            displayMode: await stateValues.displayMode,
          });

          return {
            success: true,
            instructions: [
              {
                setDependency: "unnormalizedValuePreliminary",
                desiredValue: mathExpression,
              },
            ],
          };
        }
      },
    };

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        subsetValue: {
          dependencyType: "stateVariable",
          variableName: "subsetValue",
        },
        displayMode: {
          dependencyType: "stateVariable",
          variableName: "displayMode",
        },
        variable: {
          dependencyType: "stateVariable",
          variableName: "variable",
        },
      }),
      definition({ dependencyValues }) {
        let unnormalizedValue = mathExpressionFromSubsetValue(dependencyValues);

        return { setValue: { unnormalizedValue } };
      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
        let subsetValue = buildSubsetFromMathExpression(
          desiredStateVariableValues.unnormalizedValue,
          dependencyValues.variable,
        );

        return {
          success: true,
          instructions: [
            {
              setDependency: "subsetValue",
              desiredValue: subsetValue,
            },
          ],
        };
      },
    };

    return stateVariableDefinitions;
  }
}
