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

    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        functionAttr: {
          dependencyType: "attributeComponent",
          attributeName: "function",
          variableNames: ["nInputs", "nOutputs"],
        },
      }),
      definition({ dependencyValues }) {
        if (!dependencyValues.functionAttr) {
          return { newValues: { nDimensions: 0 } }
        } else if (dependencyValues.functionAttr.stateValues.nInputs !==
          dependencyValues.functionAttr.stateValues.nOutputs
        ) {
          console.warn(`Function iterates are possible only if the number of inputs is equal to the number of outputs`)
          return { newValues: { nDimensions: 0 } }
        } else {
          return { newValues: { nDimensions: dependencyValues.functionAttr.stateValues.nInputs } }
        }
      }
    }


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
          if (!functionComp || globalDependencyValues.nDimensions === 0) {
            iterates[arrayKey] = me.fromAst('\uff3f')
          } else {

            let prevValue = dependencyValuesByKey[arrayKey].prevValue;

            if (!globalDependencyValues.forceNumeric &&
              (functionComp.stateValues.symbolic || globalDependencyValues.forceSymbolic)
            ) {
              let symbolicfs = functionComp.stateValues.symbolicfs;
              if (globalDependencyValues.nDimensions === 1) {
                iterates[arrayKey] = symbolicfs[0](prevValue);
              } else {
                if (Array.isArray(prevValue.tree)
                  && ["vector", "tuple"].includes(prevValue.tree[0])
                  && prevValue.tree.length === globalDependencyValues.nDimensions + 1
                ) {
                  let iterComps = [];
                  let inputs = prevValue.tree.slice(1);

                  for (let i = 0; i < globalDependencyValues.nDimensions; i++) {
                    iterComps.push(symbolicfs[i](...inputs))
                  }
                  iterates[arrayKey] = me.fromAst(["vector", ...iterComps])
                } else {
                  iterates[arrayKey] = me.fromAst('\uff3f')
                }
              }
            } else {
              let numericalfs = functionComp.stateValues.numericalfs;

              if (globalDependencyValues.nDimensions === 1) {

                let numericInput = prevValue.evaluate_to_constant();
                if (numericInput === null) {
                  numericInput = NaN;
                }
                iterates[arrayKey] = me.fromAst(numericalfs[0](numericInput))
              } else {
                if (Array.isArray(prevValue.tree)
                  && ["vector", "tuple"].includes(prevValue.tree[0])
                  && prevValue.tree.length === globalDependencyValues.nDimensions + 1
                ) {
                  let iterComps = [];
                  let inputs = prevValue.tree.slice(1).map(x => me.fromAst(x).evaluate_to_constant())
                    .map(x => x == null ? NaN : x)

                  for (let i = 0; i < globalDependencyValues.nDimensions; i++) {
                    iterComps.push(numericalfs[i](...inputs))
                  }
                  iterates[arrayKey] = me.fromAst(["vector", ...iterComps])
                } else {
                  iterates[arrayKey] = me.fromAst('\uff3f')
                }
              }
            }


          }
        }

        // console.log("iterates")
        // console.log(iterates)

        return {
          newValues: { iterates }
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
