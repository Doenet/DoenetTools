import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class FunctionIterates extends InlineComponent {
  static componentType = "functionIterates";
  static rendererType = undefined;


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
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

    stateVariableDefinitions.iterates = {
      isArray: true,
      public: true,
      componentType: "math",
      entryPrefixes: ["iterate"],
      basedOnArrayKeyStateVariables: true,
      returnArraySizeDependencies: () => ({
        nIterates: {
          dependencyType: "stateVariable",
          variableName: "nIterates",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nIterates];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {

        let globalDependencies = {
          functionAttr: {
            dependencyType: "attributeComponent",
            attributeName: "function",
            variableNames: ["symbolicf", "numericalf", "symbolic"],
          },
          forceSymbolic: {
            dependencyType: "stateVariable",
            variableName: "forceSymbolic"
          },
          forceNumeric: {
            dependencyType: "stateVariable",
            variableName: "forceNumeric"
          }
        }


        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          if (arrayKey === '0') {
            dependenciesByKey[arrayKey] = {
              prevValue: {
                dependencyType: "stateVariable",
                variableName: "initialValue",
              }
            }
          } else {
            dependenciesByKey[arrayKey] = {
              prevValue: {
                dependencyType: "stateVariable",
                variableName: "iterate" + arrayKey
              }
            }
          }
        }

        return { globalDependencies, dependenciesByKey }
      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {
        let iterates = {};
        let functionComp = globalDependencyValues.functionAttr;


        for (let arrayKey of arrayKeys) {
          if (!functionComp) {
            iterates[arrayKey] = me.fromAst('\uff3f')
          } else {

            let prevValue = dependencyValuesByKey[arrayKey].prevValue;

            if (!globalDependencyValues.forceNumeric &&
              (functionComp.stateValues.symbolic || globalDependencyValues.forceSymbolic)
            ) {
              iterates[arrayKey] = functionComp.stateValues.symbolicf(prevValue);
            } else {
              let numericInput = prevValue.evaluate_to_constant();
              if (numericInput === null) {
                numericInput = NaN;
              }

              iterates[arrayKey] = me.fromAst(functionComp.stateValues.numericalf(numericInput))

            }

            // console.log("iterates")
            // console.log(iterates)

            return {
              newValues: { iterates }
            }
          }
        }
      }

    }

    stateVariableDefinitions.finalIterate = {
      public: true,
      componentType: "math",
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
        return { newValues: { finalIterate: dependencyValues.finalIterate } }
      }
    }

    return stateVariableDefinitions;

  }



}
