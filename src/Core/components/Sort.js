import CompositeComponent from "./abstract/CompositeComponent";
import { postProcessCopy } from "../utils/copy";
import me from "math-expressions";
import { processAssignNames } from "../utils/serializedStateProcessing";

export default class Sort extends CompositeComponent {
  static componentType = "sort";

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";
  static assignNamesToReplacements = true;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };

    attributes.sortVectorsBy = {
      createComponentOfType: "text",
      createStateVariable: "sortVectorsBy",
      defaultValue: "displacement",
      public: true,
      toLowerCase: true,
      validValues: ["displacement", "tail"],
    };

    attributes.sortByComponent = {
      createComponentOfType: "integer",
      createStateVariable: "sortByComponent",
      defaultValue: "1",
      public: true,
    };

    attributes.sortByProp = {
      createPrimitiveOfType: "string",
    };

    return attributes;
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

    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "sortByProp",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } };
      },
    };

    stateVariableDefinitions.componentNamesForValues = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["anything"],
          variableNames: ["componentNamesInList"],
          variablesOptional: true,
        },
      }),
      definition({ dependencyValues }) {
        let componentNamesForValues = [];
        for (let child of dependencyValues.children) {
          if (child.stateValues.componentNamesInList) {
            componentNamesForValues.push(
              ...child.stateValues.componentNamesInList,
            );
          } else {
            componentNamesForValues.push(child.componentName);
          }
        }

        return { setValue: { componentNamesForValues } };
      },
    };

    stateVariableDefinitions.sortedValues = {
      stateVariablesDeterminingDependencies: [
        "componentNamesForValues",
        "sortByComponent",
        "propName",
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          sortVectorsBy: {
            dependencyType: "stateVariable",
            variableName: "sortVectorsBy",
          },
          sortByComponent: {
            dependencyType: "stateVariable",
            variableName: "sortByComponent",
          },
          propName: {
            dependencyType: "stateVariable",
            variableName: "propName",
          },
        };
        if (stateValues.propName) {
          for (let [
            ind,
            cName,
          ] of stateValues.componentNamesForValues.entries()) {
            dependencies[`component${ind}`] = {
              dependencyType: "stateVariable",
              componentName: cName,
              variableName: stateValues.propName,
              variablesOptional: true,
              caseInsensitiveVariableMatch: true,
              publicStateVariablesOnly: true,
              returnAsComponentObject: true,
            };
          }
        } else {
          for (let [
            ind,
            cName,
          ] of stateValues.componentNamesForValues.entries()) {
            dependencies[`component${ind}`] = {
              dependencyType: "multipleStateVariables",
              componentName: cName,
              variableNames: [
                "value",
                `x${stateValues.sortByComponent}`,
                `tailX${stateValues.sortByComponent}`,
              ],
              variablesOptional: true,
            };
          }
        }
        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {
        let allValues = [];
        let allAreNumeric = true;
        for (let depName in dependencyValues) {
          if (depName.substring(0, 9) !== "component") {
            continue;
          }
          let component = dependencyValues[depName];
          if (dependencyValues.propName) {
            let value = Object.values(component.stateValues)[0];
            allValues.push({
              componentName: component.componentName,
              numericalValue: Number(value),
              textValue: String(value),
            });
            if (!Number.isFinite(value)) {
              allAreNumeric = false;
            }
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: component.componentType,
              baseComponentType: "number",
            })
          ) {
            allValues.push({
              componentName: component.componentName,
              numericalValue: component.stateValues.value,
              textValue: String(component.stateValues.value),
            });
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: component.componentType,
              baseComponentType: "text",
            })
          ) {
            let numericalValue = NaN;
            let textValue = component.stateValues.value;
            allValues.push({
              componentName: component.componentName,
              numericalValue,
              textValue,
            });
            allAreNumeric = false;
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: component.componentType,
              baseComponentType: "math",
            })
          ) {
            let numericalValue =
              component.stateValues.value.evaluate_to_constant();
            if (Number.isNaN(numericalValue)) {
              allAreNumeric = false;
            }
            allValues.push({
              componentName: component.componentName,
              numericalValue,
              textValue: component.stateValues.value.toString(),
            });
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: component.componentType,
              baseComponentType: "point",
            })
          ) {
            let compValue =
              component.stateValues[`x${dependencyValues.sortByComponent}`];
            let numericalValue = NaN;
            let textValue = "";
            if (compValue) {
              numericalValue = compValue.evaluate_to_constant();
              if (Number.isNaN(numericalValue)) {
                allAreNumeric = false;
              }
              textValue = compValue.toString();
            }
            allValues.push({
              componentName: component.componentName,
              numericalValue,
              textValue,
            });
          } else if (
            componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: component.componentType,
              baseComponentType: "vector",
            })
          ) {
            let numericalValue = NaN;
            let textValue = "";
            let compValue =
              component.stateValues[`x${dependencyValues.sortByComponent}`];
            if (dependencyValues.sortVectorsBy === "displacement") {
              compValue =
                component.stateValues[`x${dependencyValues.sortByComponent}`];
            } else {
              compValue =
                component.stateValues[
                  `tailX${dependencyValues.sortByComponent}`
                ];
            }
            if (compValue) {
              numericalValue = compValue.evaluate_to_constant();
              if (Number.isNaN(numericalValue)) {
                allAreNumeric = false;
              }
              textValue = compValue.toString();
            }
            allValues.push({
              componentName: component.componentName,
              numericalValue,
              textValue,
            });
          }
        }

        if (allAreNumeric) {
          allValues.sort((a, b) => a.numericalValue - b.numericalValue);
        } else {
          allValues.sort((a, b) =>
            a.textValue > b.textValue ? 1 : a.textValue < b.textValue ? -1 : 0,
          );
        }

        return {
          setValue: {
            sortedValues: allValues,
          },
        };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        sortedValues: {
          dependencyType: "stateVariable",
          variableName: "sortedValues",
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    componentInfoObjects,
    workspace,
  }) {
    let replacements = [];

    let componentsCopied = [];

    for (let valueObj of await component.stateValues.sortedValues) {
      let replacementSource;

      if (valueObj.listInd === undefined) {
        replacementSource = components[valueObj.componentName];
      } else {
        let listComponent = components[valueObj.componentName];
        replacementSource = listComponent.activeChildren[valueObj.listInd];
      }

      if (replacementSource) {
        componentsCopied.push(replacementSource.componentName);

        replacements.push(
          await replacementSource.serialize({
            primitiveSourceAttributesToIgnore: ["isResponse"],
          }),
        );
      }
    }

    workspace.uniqueIdentifiersUsed = [];
    replacements = postProcessCopy({
      serializedComponents: replacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed,
      addShadowDependencies: true,
      markAsPrimaryShadow: true,
    });

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: await component.stateValues.newNamespace,
      componentInfoObjects,
    });

    workspace.componentsCopied = componentsCopied;

    return { replacements: processResult.serializedComponents };
  }

  static async calculateReplacementChanges({
    component,
    components,
    componentInfoObjects,
    workspace,
  }) {
    let componentsToCopy = [];

    for (let valueObj of await component.stateValues.sortedValues) {
      let replacementSource;

      if (valueObj.listInd === undefined) {
        replacementSource = components[valueObj.componentName];
      } else {
        let listComponent = components[valueObj.componentName];
        replacementSource = listComponent.activeChildren[valueObj.listInd];
      }

      if (replacementSource) {
        componentsToCopy.push(replacementSource.componentName);
      }
    }

    if (
      componentsToCopy.length == workspace.componentsCopied.length &&
      workspace.componentsCopied.every((x, i) => x === componentsToCopy[i])
    ) {
      return [];
    }

    // for now, just recreated
    let replacements = (
      await this.createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        workspace,
      })
    ).replacements;

    let replacementChanges = [
      {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: replacements,
      },
    ];

    return replacementChanges;
  }
}
