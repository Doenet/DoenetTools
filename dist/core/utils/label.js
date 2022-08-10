
export function returnLabelStateVariableDefinitions() {

  let stateVariableDefinitions = {};

  stateVariableDefinitions.originalComponentName = {
    shadowVariable: true,
    returnDependencies: () => ({}),
    definition({ componentName }) {
      return { setValue: { originalComponentName: componentName } }
    }
  }

  stateVariableDefinitions.label = {
    forRenderer: true,
    public: true,
    shadowingInstructions: {
      createComponentOfType: "label",
      addStateVariablesShadowingStateVariables: {
        hasLatex: {
          stateVariableToShadow: "labelHasLatex",
        }
      },
    },
    hasEssential: true,
    defaultValue: "",
    additionalStateVariablesDefined: [{
      variableName: "labelHasLatex",
      forRenderer: true,
    }],
    returnDependencies: () => ({
      labelAttr: {
        dependencyType: "attributeComponent",
        attributeName: "label",
        variableNames: ["value", "hasLatex"]
      },
      labelChild: {
        dependencyType: "child",
        childGroups: ["labels"],
        variableNames: ["value", "hasLatex"]
      },
      labelIsName: {
        dependencyType: "stateVariable",
        variableName: "labelIsName"
      },
      originalComponentName: {
        dependencyType: "stateVariable",
        variableName: "originalComponentName"
      }
    }),
    definition({ dependencyValues }) {
      if (dependencyValues.labelChild.length > 0) {
        let labelChild = dependencyValues.labelChild[dependencyValues.labelChild.length - 1]
        return {
          setValue: {
            label: labelChild.stateValues.value,
            labelHasLatex: labelChild.stateValues.hasLatex
          }
        }
      } else if (dependencyValues.labelAttr) {
        return {
          setValue: {
            label: dependencyValues.labelAttr.stateValues.value,
            labelHasLatex: dependencyValues.labelAttr.stateValues.hasLatex
          }
        }
      } else if (dependencyValues.labelIsName) {
        let lastSlash = dependencyValues.originalComponentName.lastIndexOf('/');
        let label = dependencyValues.originalComponentName.substring(lastSlash + 1);
        if (label.slice(0, 2) === "__") {
          // if label from componentName starts with two underscores,
          // it is an automatically generated component name that has random characters in it
          // Don't display name, as they are for internal use only (and the user cannot refer to them)
          return {
            useEssentialOrDefaultValue: { label: true },
            setValue: { labelHasLatex: false }
          }
        }

        if (label[0] === "_") {
          // &#95; is HTML entity for underscore, so JSXgraph won't replace it with subscript
          label = label.replaceAll("_", "&#95;");
        } else {
          // we have a user supplied name

          if (label.includes("_") || label.includes("-")) {
            label = label.replace(/[_\-]/g, " ")
          } else if (label.match(/^[a-z]/)) {
            if (label.match(/[A-Z]/)) {
              // label starts with a lower case letter and has an upper case letter
              // treat as camel case and add spaces and capitalize first letter
              label = label.replace(/([A-Z])/g, ' $1').toLowerCase();
            }
          } else if (label.match(/^[A-Z]/)) {
            if (label.match(/[a-z]/)) {
              // label starts with a upper case letter and has an lower case letter
              // treat as pascal case and add spaces
              label = label.replace(/([A-Z])/g, ' $1')
              label = label.slice(1);  // delete extra space at beginning
            }
          }
        }

        return {
          setValue: {
            label,
            labelHasLatex: false
          }
        }
      } else {
        return {
          useEssentialOrDefaultValue: { label: true },
          setValue: { labelHasLatex: false }
        }
      }
    },
    inverseDefinition({ desiredStateVariableValues, dependencyValues }) {
      console.log({ desiredStateVariableValues, dependencyValues })
      if (typeof desiredStateVariableValues.label !== "string") {
        return { success: false }
      }

      if (dependencyValues.labelChild.length > 0) {
        let lastLabelInd = dependencyValues.labelChild.length - 1;
        return {
          success: true,
          instructions: [{
            setDependency: "labelChild",
            desiredValue: desiredStateVariableValues.label,
            childIndex: lastLabelInd,
            variableIndex: 0
          }]
        }
      } else if (dependencyValues.labelAttr) {
        return {
          success: true,
          instructions: [{
            setDependency: "labelAttr",
            desiredValue: desiredStateVariableValues.label,
            variableIndex: 0
          }]
        }
      } else if (dependencyValues.labelIsName) {
        return { success: false }
      } else {
        return {
          success: true,
          instructions: [{
            setStateVariable: "label",
            value: desiredStateVariableValues.label
          }]
        }
      }
    }
  }

  return stateVariableDefinitions;

}