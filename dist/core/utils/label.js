
export function returnLabelStateVariableDefinitions() {

  let stateVariableDefinitions = {};

  stateVariableDefinitions.componentNameAndShadowSourceNames = {
    returnDependencies: () => ({
      shadowSource: {
        dependencyType: "shadowSource",
        variableNames: ["componentNameAndShadowSourceNames"],
      },
      unlinkedCopySource: {
        dependencyType: "unlinkedCopySource",
        variableNames: ["componentNameAndShadowSourceNames"],
      }
    }),
    definition({ dependencyValues, componentName }) {
      let componentNameAndShadowSourceNames = [componentName];
      if (dependencyValues.shadowSource?.stateValues.componentNameAndShadowSourceNames) {
        componentNameAndShadowSourceNames.push(...dependencyValues.shadowSource.stateValues.componentNameAndShadowSourceNames)
      } else if (dependencyValues.unlinkedCopySource?.stateValues.componentNameAndShadowSourceNames) {
        componentNameAndShadowSourceNames.push(...dependencyValues.unlinkedCopySource.stateValues.componentNameAndShadowSourceNames)
      }
      return { setValue: { componentNameAndShadowSourceNames } }
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
    doNotShadowEssential: true,
    defaultValue: "",
    provideEssentialValuesInDefinition: true,
    additionalStateVariablesDefined: [{
      variableName: "labelHasLatex",
      forRenderer: true,
    }],
    returnDependencies: () => ({
      labelChild: {
        dependencyType: "child",
        childGroups: ["labels"],
        variableNames: ["value", "hasLatex"]
      },
      // Note: assuming component has a labelIsName attribute
      // that creates an attribute component and state variable
      labelIsName: {
        dependencyType: "stateVariable",
        variableName: "labelIsName"
      },
      labelIsNameAttr: {
        dependencyType: "attributeComponent",
        attributeName: "labelIsName",
      },
      componentNameAndShadowSourceNames: {
        dependencyType: "stateVariable",
        variableName: "componentNameAndShadowSourceNames"
      },
      shadowSource: {
        dependencyType: "shadowSource",
        variableNames: ["label", "labelHasLatex"]
      },
    }),
    definition({ dependencyValues, essentialValues }) {

      let labelChild = dependencyValues.labelChild[dependencyValues.labelChild.length - 1];

      if (labelChild && !labelChild.shadowDepth) {

        return {
          setValue: {
            label: labelChild.stateValues.value,
            labelHasLatex: labelChild.stateValues.hasLatex
          }
        }
      } else if (essentialValues.label !== undefined) {
        return {
          useEssentialOrDefaultValue: {
            label: true
          },
          setValue: { labelHasLatex: false }
        }
      } else if (dependencyValues.labelIsName && !dependencyValues.labelIsNameAttr.shadowDepth) {

        // find a valid name for a label from the component name
        // or the name of one of its shadow targets,
        // starting with the shadow depth of labelIsName attribute,
        // i.e., starting with closest component that had the attribute

        let label = "__";
        let cNames = dependencyValues.componentNameAndShadowSourceNames;

        for (let cN of cNames) {
          let lastSlash = cN.lastIndexOf('/');
          label = cN.substring(lastSlash + 1);
          if (label.slice(0, 2) !== "__") {
            break;
          }
        }
        if (label.slice(0, 2) === "__") {
          // if label from componentName starts with two underscores,
          // it is an automatically generated component name that has random characters in it
          // Don't display name, as they are for internal use only (and the user cannot refer to them)
          return {
            setValue: {
              label: "",
              labelHasLatex: false
            }
          }
        }

        if (label[0] !== "_") {
          // we have a user supplied name

          if (label.includes("_") || label.includes("-")) {
            label = label.replace(/[_\-]/g, " ")
          } else if (label.match(/^[a-z]/)) {
            if (label.match(/[A-Z]/)) {
              // label starts with a lower case letter and has an upper case letter
              // treat as camel case and add spaces and lowercase letters
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
      } else if (typeof dependencyValues.shadowSource?.stateValues.label === "string") {
        return {
          setValue: {
            label: dependencyValues.shadowSource.stateValues.label,
            labelHasLatex: Boolean(dependencyValues.shadowSource.stateValues.labelHasLatex)
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
      if (typeof desiredStateVariableValues.label !== "string") {
        return { success: false }
      }

      let lastLabelInd = dependencyValues.labelChild.length - 1;
      let labelChild = dependencyValues.labelChild[lastLabelInd];

      if (labelChild && !labelChild.shadowDepth) {
        return {
          success: true,
          instructions: [{
            setDependency: "labelChild",
            desiredValue: desiredStateVariableValues.label,
            childIndex: lastLabelInd,
            variableIndex: 0
          }]
        }
      } else if (dependencyValues.labelIsName && !dependencyValues.labelIsNameAttr.shadowDepth) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "label",
            value: desiredStateVariableValues.label
          }]
        }
      } else if (typeof dependencyValues.shadowSource?.stateValues.label === "string") {
        return {
          success: true,
          instructions: [{
            setDependency: "shadowSource",
            desiredValue: desiredStateVariableValues.label,
            variableIndex: 0
          }]
        }
      } else {
        return {
          success: true,
          instructions: [{
            setEssentialValue: "label",
            value: desiredStateVariableValues.label
          }]
        }
      }
    }
  }

  stateVariableDefinitions.labelForGraph = {
    forRenderer: true,
    returnDependencies: () => ({
      label: {
        dependencyType: "stateVariable",
        variableName: "label"
      },
      labelHasLatex: {
        dependencyType: "stateVariable",
        variableName: "labelHasLatex"
      }
    }),
    definition({ dependencyValues }) {
      let labelForGraph;
      if (dependencyValues.labelHasLatex) {
        // when not inside parents
        // replace all _ with &UnderBar; and all ^ with &Hat;
        let nParens = 0;
        labelForGraph = "";
        for (let s of dependencyValues.label) {
          if (s === "(") {
            nParens++;
          } else if (s === ")") {
            nParens--;
          } else if (nParens === 0) {
            if (s === "_") {
              s = "&UnderBar;"
            } else if (s === "^") {
              s = "&Hat;"
            }
          }
          labelForGraph += s;
        }
      } else {
        labelForGraph = dependencyValues.label.replaceAll("_", "&UnderBar;").replaceAll("^", "&Hat;");
      }

      return { setValue: { labelForGraph } };

    }
  }
  return stateVariableDefinitions;

}