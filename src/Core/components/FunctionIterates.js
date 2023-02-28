import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';
import { vectorOperators } from '../utils/math';

export default class FunctionIterates extends InlineComponent {
  static componentType = "functionIterates";
  static rendererType = undefined;


  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.nIterates = {
      createComponentOfType: "integer",
      createStateVariable: "nIterates",
      defaultValue: 0,
      public: true,
    }
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
      defaultValue: me.fromAst('\uff3f'),
    }
    attributes.function = {
      createComponentOfType: "function"
    }


    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nDimensions = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["nInputs", "nOutputs"],
        },
      }),
      definition({ dependencyValues }) {
        if (!dependencyValues.functionAttr) {
          return { setValue: { nDimensions: 0 } }
        } else if (dependencyValues.functionAttr.stateValues.nInputs !==
          dependencyValues.functionAttr.stateValues.nOutputs
        ) {
          console.warn(`Function iterates are possible only if the number of inputs is equal to the number of outputs`)
          return { setValue: { nDimensions: 0 } }
        } else {
          return { setValue: { nDimensions: dependencyValues.functionAttr.stateValues.nInputs } }
        }
      }
    }



    stateVariableDefinitions.allIterates = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "mathList",
      },
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["symbolicfs", "numericalfs", "symbolic"],
        },
        forceSymbolic: {
          dependencyType: "stateVariable",
          variableName: "forceSymbolic"
        },
        forceNumeric: {
          dependencyType: "stateVariable",
          variableName: "forceNumeric"
        },
        nDimensions: {
          dependencyType: "stateVariable",
          variableName: "nDimensions"
        },
        initialValue: {
          dependencyType: "stateVariable",
          variableName: "initialValue",
        },
        nIterates: {
          dependencyType: "stateVariable",
          variableName: "nIterates",
        },
      }),
      definition({ dependencyValues }) {
        let allIterates = [];
        let functionComp = dependencyValues.functionAttr;
        let initialValue = dependencyValues.initialValue;
        let symbolic = !dependencyValues.forceNumeric &&
          (functionComp.stateValues.symbolic || dependencyValues.forceSymbolic);
        let nIterates = dependencyValues.nIterates;


        if (
          !functionComp || dependencyValues.nDimensions === 0 ||
          !(dependencyValues.nDimensions === 1 ||
            Array.isArray(initialValue.tree)
            && vectorOperators.includes(initialValue.tree[0])
            && initialValue.tree.length === dependencyValues.nDimensions + 1
          )
        ) {
          allIterates = Array(nIterates).fill(me.fromAst('\uff3f'));
          return { setValue: { allIterates } };
        }

        if (symbolic) {

          if (dependencyValues.nDimensions === 1) {
            let symbolicf = functionComp.stateValues.symbolicfs[0];
            let value = initialValue;
            for (let ind = 0; ind < nIterates; ind++) {
              value = symbolicf(value);
              allIterates.push(value);
            }
          } else {
            let symbolicfs = functionComp.stateValues.symbolicfs;
            let value = initialValue.tree.slice(1);
            for (let ind = 0; ind < nIterates; ind++) {
              let iterComps = [];
              for (let i = 0; i < dependencyValues.nDimensions; i++) {
                iterComps.push(symbolicfs[i](...value).tree)
              }
              allIterates.push(me.fromAst(["vector", ...iterComps]));
              value = iterComps;
            }
          }
        } else {
          if (dependencyValues.nDimensions === 1) {
            let numericalf = functionComp.stateValues.numericalfs[0];
            let value = initialValue.evaluate_to_constant();
            if (value === null) {
              allIterates = Array(nIterates).fill(me.fromAst('\uff3f'));
            } else {
              for (let ind = 0; ind < nIterates; ind++) {
                value = numericalf(value);
                allIterates.push(me.fromAst(value));
              }
            }
          } else {
            let numericalfs = functionComp.stateValues.numericalfs;
            let value = initialValue.tree.slice(1).map(x => me.fromAst(x).evaluate_to_constant())
              .map(x => x == null ? NaN : x);
            for (let ind = 0; ind < nIterates; ind++) {
              let iterComps = [];
              for (let i = 0; i < dependencyValues.nDimensions; i++) {
                iterComps.push(numericalfs[i](...value))
              }
              allIterates.push(me.fromAst(["vector", ...iterComps]));
              value = iterComps;
            }
          }
        }

        return { setValue: { allIterates } };

      }
    }

    stateVariableDefinitions.allIteratesWithInitial = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "mathList",
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
              dependencyValues.initialValue, ...dependencyValues.allIterates
            ]
          }
        }

      }
    }

    stateVariableDefinitions.iterates = {
      isArray: true,
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      entryPrefixes: ["iterate"],
      returnArraySizeDependencies: () => ({
        nIterates: {
          dependencyType: "stateVariable",
          variableName: "nIterates",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nIterates];
      },
      returnArrayDependenciesByKey() {

        let globalDependencies = {
          allIterates: {
            dependencyType: "stateVariable",
            variableName: "allIterates"
          },
        }

        return { globalDependencies }
      },
      arrayDefinitionByKey({ globalDependencyValues, arraySize }) {

        let iterates = {};

        for (let ind = 0; ind < arraySize[0]; ind++) {
          iterates[ind] = globalDependencyValues.allIterates[ind];
        }

        return { setValue: { iterates } }
      }

    }

    stateVariableDefinitions.finalIterate = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      stateVariablesDeterminingDependencies: ["nIterates"],
      returnDependencies({ stateValues }) {
        if (!Number.isFinite(stateValues.nIterates) || stateValues.nIterates < 0) {
          return {};
        }


        if (stateValues.nIterates > 0) {
          return {
            finalIterate: {
              dependencyType: "stateVariable",
              variableName: `iterate${stateValues.nIterates}`
            }
          }
        } else {
          return {
            finalIterate: {
              dependencyType: "stateVariable",
              variableName: "initialValue"
            }
          }
        }
      },
      definition({ dependencyValues }) {
        return { setValue: { finalIterate: dependencyValues.finalIterate } }
      }
    }

    return stateVariableDefinitions;

  }



}
