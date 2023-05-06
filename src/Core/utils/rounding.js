export function returnRoundingStateVariableDefinitions({
  childsGroupIfSingleMatch = [],
  childGroupsToStopSingleMatch = [],
  includeListParents = false,
  displayDigitsDefault = 3,
  additionalAttributeComponent = null,
} = {}) {
  let stateVariableDefinitions = {};

  stateVariableDefinitions.displayDigits = {
    public: true,
    shadowingInstructions: {
      createComponentOfType: "integer",
    },
    hasEssential: true,
    defaultValue: displayDigitsDefault,
    returnDependencies: roundingDependencies({
      stateVariable: "displayDigits",
      childsGroupIfSingleMatch,
      childGroupsToStopSingleMatch,
      includeIgnore: true,
      includeListParents,
      additionalAttributeComponent,
    }),
    definition: roundingDefinition({
      stateVariable: "displayDigits",
      valueIfIgnore: 0,
      includeListParents,
    }),
  };

  stateVariableDefinitions.displayDecimals = {
    public: true,
    shadowingInstructions: {
      createComponentOfType: "integer",
    },
    hasEssential: true,
    defaultValue: 2,
    returnDependencies: roundingDependencies({
      stateVariable: "displayDecimals",
      childsGroupIfSingleMatch,
      childGroupsToStopSingleMatch,
      includeIgnore: true,
      includeListParents,
      additionalAttributeComponent,
    }),
    definition: roundingDefinition({
      stateVariable: "displayDecimals",
      valueIfIgnore: -Infinity,
      includeListParents,
    }),
  };

  stateVariableDefinitions.displaySmallAsZero = {
    public: true,
    shadowingInstructions: {
      createComponentOfType: "number",
    },
    hasEssential: true,
    defaultValue: 1e-14,
    returnDependencies: roundingDependencies({
      stateVariable: "displaySmallAsZero",
      childsGroupIfSingleMatch,
      childGroupsToStopSingleMatch,
      includeListParents,
      additionalAttributeComponent,
    }),
    definition: roundingDefinition({
      stateVariable: "displaySmallAsZero",
      includeListParents,
    }),
  };

  stateVariableDefinitions.padZeros = {
    public: true,
    shadowingInstructions: {
      createComponentOfType: "boolean",
    },
    hasEssential: true,
    defaultValue: false,
    returnDependencies: roundingDependencies({
      stateVariable: "padZeros",
      childsGroupIfSingleMatch,
      childGroupsToStopSingleMatch,
      includeListParents,
      additionalAttributeComponent,
    }),
    definition: roundingDefinition({
      stateVariable: "padZeros",
      includeListParents,
    }),
  };

  return stateVariableDefinitions;
}

function roundingDependencies({
  stateVariable,
  childsGroupIfSingleMatch,
  childGroupsToStopSingleMatch,
  includeIgnore = false,
  includeListParents = false,
  additionalAttributeComponent = null,
}) {
  return function () {
    let dependencies = {
      attribute: {
        dependencyType: "attributeComponent",
        attributeName: stateVariable,
        variableNames: ["value"],
      },
      singleMatchChildren: {
        dependencyType: "child",
        childGroups: childsGroupIfSingleMatch,
        variableNames: [stateVariable],
        variablesOptional: true,
      },
      stopSingleMatchChildren: {
        dependencyType: "child",
        childGroups: childGroupsToStopSingleMatch,
      },
    };

    if (includeListParents) {
      dependencies.fromMathListParent = {
        dependencyType: "parentStateVariable",
        parentComponentType: "mathList",
        variableName: stateVariable,
      };
      dependencies.fromNumberListParent = {
        dependencyType: "parentStateVariable",
        parentComponentType: "numberList",
        variableName: stateVariable,
      };
    }

    if (includeIgnore) {
      let ignoreVariable =
        "ignore" + stateVariable[0].toUpperCase() + stateVariable.slice(1);
      dependencies.attributeIgnore = {
        dependencyType: "attributeComponent",
        attributeName: ignoreVariable,
        variableNames: ["value"],
        dontRecurseToShadowsIfHaveAttribute: stateVariable,
      };

      dependencies.attribute.dontRecurseToShadowsIfHaveAttribute =
        ignoreVariable;
    }

    if (additionalAttributeComponent) {
      dependencies.additionalAttribute = {
        dependencyType: "attributeComponent",
        attributeName: additionalAttributeComponent,
        variableNames: [stateVariable],
      };
    }
    return dependencies;
  };
}

function roundingDefinition({
  stateVariable,
  valueIfIgnore = null,
  includeListParents,
}) {
  return function ({ dependencyValues, usedDefault }) {
    let foundDefaultValue = false;
    let theDefaultValueFound;

    if (includeListParents) {
      if (dependencyValues.fromMathListParent !== null) {
        if (usedDefault.fromMathListParent) {
          foundDefaultValue = true;
          theDefaultValueFound = dependencyValues.fromMathListParent;
        } else {
          // Have a mathlist parent that prescribed rounding.
          // This overrides everything else.
          return {
            setValue: {
              [stateVariable]: dependencyValues.fromMathListParent,
            },
          };
        }
      }

      if (dependencyValues.fromNumberListParent !== null) {
        if (usedDefault.fromNumberListParent) {
          foundDefaultValue = true;
          theDefaultValueFound = dependencyValues.fromNumberListParent;
        } else {
          // Have a numberlist parent that prescribed rounding.
          // This overrides everything else.
          return {
            setValue: {
              [stateVariable]: dependencyValues.fromNumberListParent,
            },
          };
        }
      }
    }

    if (dependencyValues.attribute) {
      if (usedDefault.attribute) {
        foundDefaultValue = true;
        theDefaultValueFound = dependencyValues.attribute.stateValues.value;
      } else {
        return {
          setValue: {
            [stateVariable]: dependencyValues.attribute.stateValues.value,
          },
        };
      }
    } else if (dependencyValues.attributeIgnore?.stateValues.value) {
      return {
        setValue: {
          [stateVariable]: valueIfIgnore,
        },
      };
    } else if (dependencyValues.additionalAttribute) {
      if (usedDefault.additionalAttribute) {
        foundDefaultValue = true;
        theDefaultValueFound =
          dependencyValues.additionalAttribute.stateValues[stateVariable];
      } else {
        return {
          setValue: {
            [stateVariable]:
              dependencyValues.additionalAttribute.stateValues[stateVariable],
          },
        };
      }
    }

    if (
      dependencyValues.singleMatchChildren.length === 1 &&
      dependencyValues.stopSingleMatchChildren.length === 0 &&
      dependencyValues.singleMatchChildren[0].stateValues[stateVariable] !==
        undefined &&
      !usedDefault.singleMatchChildren[0]?.[stateVariable]
    ) {
      return {
        setValue: {
          [stateVariable]:
            dependencyValues.singleMatchChildren[0].stateValues[stateVariable],
        },
      };
    }

    if (foundDefaultValue) {
      return {
        useEssentialOrDefaultValue: {
          [stateVariable]: { defaultValue: theDefaultValueFound },
        },
      };
    } else {
      return { useEssentialOrDefaultValue: { [stateVariable]: true } };
    }
  };
}

export function returnRoundingAttributes() {
  return {
    displayDigits: {
      createComponentOfType: "integer",
    },
    ignoreDisplayDigits: {
      createComponentOfType: "boolean",
    },
    displayDecimals: {
      createComponentOfType: "integer",
    },
    ignoreDisplayDecimals: {
      createComponentOfType: "boolean",
    },
    displaySmallAsZero: {
      createComponentOfType: "number",
      valueForTrue: 1e-14,
      valueForFalse: 0,
    },
    padZeros: {
      createComponentOfType: "boolean",
    },
  };
}
