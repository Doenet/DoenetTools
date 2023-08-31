import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";
import { vectorOperators } from "../utils/math";
import {
  returnRoundingAttributeComponentShadowing,
  returnRoundingAttributes,
  returnRoundingStateVariableDefinitions,
} from "../utils/rounding";

export default class FunctionIterates extends InlineComponent {
  static componentType = "functionIterates";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.numIterates = {
      createComponentOfType: "integer",
      createStateVariable: "numIterates",
      defaultValue: 0,
      public: true,
    };
    attributes.forceSymbolic = {
      createComponentOfType: "boolean",
      createStateVariable: "forceSymbolic",
      defaultValue: false,
      public: true,
    };
    attributes.forceNumeric = {
      createComponentOfType: "boolean",
      createStateVariable: "forceNumeric",
      defaultValue: false,
      public: true,
    };
    attributes.initialValue = {
      createComponentOfType: "math",
      createStateVariable: "initialValue",
      defaultValue: me.fromAst("\uff3f"),
    };
    attributes.function = {
      createComponentOfType: "function",
    };

    Object.assign(attributes, returnRoundingAttributes());

    return attributes;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    Object.assign(
      stateVariableDefinitions,
      returnRoundingStateVariableDefinitions(),
    );

    stateVariableDefinitions.numDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["numInputs", "numOutputs"],
        },
      }),
      definition({ dependencyValues }) {
        if (!dependencyValues.functionAttr) {
          return { setValue: { numDimensions: 0 } };
        } else if (
          dependencyValues.functionAttr.stateValues.numInputs !==
          dependencyValues.functionAttr.stateValues.numOutputs
        ) {
          let numInputs = dependencyValues.functionAttr.stateValues.numInputs;
          let numInputsPhrase =
            numInputs.toString() + (numInputs === 1 ? " input" : " inputs");
          let numOutputs = dependencyValues.functionAttr.stateValues.numOutputs;
          let numOutputsPhrase =
            numOutputs.toString() + (numOutputs === 1 ? " output" : " outputs");
          let warning = {
            message: `Function iterates are possible only if the number of inputs of the function is equal to the number of outputs. This function has ${numInputsPhrase} and ${numOutputsPhrase}.`,
            level: 1,
          };
          return { setValue: { numDimensions: 0 }, sendWarnings: [warning] };
        } else {
          return {
            setValue: {
              numDimensions:
                dependencyValues.functionAttr.stateValues.numInputs,
            },
          };
        }
      },
    };

    stateVariableDefinitions.allIterates = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "mathList",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["symbolicfs", "numericalfs", "symbolic"],
        },
        forceSymbolic: {
          dependencyType: "stateVariable",
          variableName: "forceSymbolic",
        },
        forceNumeric: {
          dependencyType: "stateVariable",
          variableName: "forceNumeric",
        },
        numDimensions: {
          dependencyType: "stateVariable",
          variableName: "numDimensions",
        },
        initialValue: {
          dependencyType: "stateVariable",
          variableName: "initialValue",
        },
        numIterates: {
          dependencyType: "stateVariable",
          variableName: "numIterates",
        },
      }),
      definition({ dependencyValues }) {
        let allIterates = [];
        let functionComp = dependencyValues.functionAttr;
        let initialValue = dependencyValues.initialValue;
        let symbolic =
          !dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic);
        let numIterates = dependencyValues.numIterates;

        if (
          !functionComp ||
          dependencyValues.numDimensions === 0 ||
          !(
            dependencyValues.numDimensions === 1 ||
            (Array.isArray(initialValue.tree) &&
              vectorOperators.includes(initialValue.tree[0]) &&
              initialValue.tree.length === dependencyValues.numDimensions + 1)
          )
        ) {
          allIterates = Array(numIterates).fill(me.fromAst("\uff3f"));
          return { setValue: { allIterates } };
        }

        if (symbolic) {
          if (dependencyValues.numDimensions === 1) {
            let symbolicf = functionComp.stateValues.symbolicfs[0];
            let value = initialValue;
            for (let ind = 0; ind < numIterates; ind++) {
              value = symbolicf(value);
              allIterates.push(value);
            }
          } else {
            let symbolicfs = functionComp.stateValues.symbolicfs;
            let value = initialValue.tree.slice(1).map((v) => me.fromAst(v));
            for (let ind = 0; ind < numIterates; ind++) {
              let iterComps = [];
              for (let i = 0; i < dependencyValues.numDimensions; i++) {
                iterComps.push(symbolicfs[i](...value).tree);
              }
              allIterates.push(me.fromAst(["vector", ...iterComps]));
              value = iterComps.map((v) => me.fromAst(v));
            }
          }
        } else {
          if (dependencyValues.numDimensions === 1) {
            let numericalf = functionComp.stateValues.numericalfs[0];
            let value = initialValue.evaluate_to_constant();
            if (Number.isNaN(value)) {
              allIterates = Array(numIterates).fill(me.fromAst("\uff3f"));
            } else {
              for (let ind = 0; ind < numIterates; ind++) {
                value = numericalf(value);
                allIterates.push(me.fromAst(value));
              }
            }
          } else {
            let numericalfs = functionComp.stateValues.numericalfs;
            let value = initialValue.tree
              .slice(1)
              .map((x) => me.fromAst(x).evaluate_to_constant());
            for (let ind = 0; ind < numIterates; ind++) {
              let iterComps = [];
              for (let i = 0; i < dependencyValues.numDimensions; i++) {
                iterComps.push(numericalfs[i](...value));
              }
              allIterates.push(me.fromAst(["vector", ...iterComps]));
              value = iterComps;
            }
          }
        }

        return { setValue: { allIterates } };
      },
    };

    stateVariableDefinitions.allIteratesWithInitial = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "mathList",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      returnDependencies: () => ({
        initialValue: {
          dependencyType: "stateVariable",
          variableName: "initialValue",
        },
        allIterates: {
          dependencyType: "stateVariable",
          variableName: "allIterates",
        },
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            allIteratesWithInitial: [
              dependencyValues.initialValue,
              ...dependencyValues.allIterates,
            ],
          },
        };
      },
    };

    stateVariableDefinitions.iterates = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      entryPrefixes: ["iterate"],
      returnArraySizeDependencies: () => ({
        numIterates: {
          dependencyType: "stateVariable",
          variableName: "numIterates",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.numIterates];
      },
      returnArrayDependenciesByKey() {
        let globalDependencies = {
          allIterates: {
            dependencyType: "stateVariable",
            variableName: "allIterates",
          },
        };

        return { globalDependencies };
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {
        let iterates = {};

        for (let ind = 0; ind < arraySize[0]; ind++) {
          iterates[ind] = globalDependencyValues.allIterates[ind];
        }

        return { setValue: { iterates } };
      },
    };

    stateVariableDefinitions.finalIterate = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
          returnRoundingAttributeComponentShadowing(),
      },
      stateVariablesDeterminingDependencies: ["numIterates"],
      returnDependencies({ stateValues }) {
        if (
          !Number.isFinite(stateValues.numIterates) ||
          stateValues.numIterates < 0
        ) {
          return {};
        }

        if (stateValues.numIterates > 0) {
          return {
            finalIterate: {
              dependencyType: "stateVariable",
              variableName: `iterate${stateValues.numIterates}`,
            },
          };
        } else {
          return {
            finalIterate: {
              dependencyType: "stateVariable",
              variableName: "initialValue",
            },
          };
        }
      },
      definition({ dependencyValues }) {
        return { setValue: { finalIterate: dependencyValues.finalIterate } };
      },
    };

    return stateVariableDefinitions;
  }
}
