import InlineComponent from '../abstract/InlineComponent';
import me from 'math-expressions';

const elements = {
  H: {
    name: "Hydrogen",
    atomicNumber: 1,
    electronConfiguration: me.fromText("1s^1"),
    defaultMassNumber: 1,
  },
  He: {
    name: "Helium",
    atomicNumber: 2,
    electronConfiguration: me.fromText("1s^2"),
    defaultMassNumber: 4,
  },
  Li: {
    name: "Lithium",
    atomicNumber: 3,
    electronConfiguration: me.fromText("1s^2 2s^1"),
    defaultMassNumber: 7,

  },
}

export default class ChemAtom extends InlineComponent {
  static componentType = "chemAtom";
  static rendererType = "math";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.symbol = {
      createComponentOfType: "text",
      createStateVariable: "symbol",
      defaultValue: null,
      public: true,
    };

    attributes.massNumber = {
      createComponentOfType: "number",
    }

    attributes.displayMassNumber = {
      createComponentOfType: "boolean",
      createStateVariable: "displayMassNumber",
      defaultValue: false,
      public: true,
    };


    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.massNumber = {
      public: true,
      componentType: "number",
      hasEssential: true,
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
        massNumberAttr: {
          dependencyType: "attributeComponent",
          attributeName: "massNumber",
          variableNames: ["value"],
        }
      }),
      definition: function ({ dependencyValues, componentName }) {
        console.log(`dependencyValues of ${componentName}`, dependencyValues)

        if (dependencyValues.massNumberAttr) {
          return { setValue: { massNumber: dependencyValues.massNumberAttr.stateValues.value } }
        } else {
          return {
            useEssentialOrDefaultValue: {
              massNumber: {
                get defaultValue() {
                  let massNumber = elements[dependencyValues.symbol]?.defaultMassNumber;
                  if (!massNumber) {
                    massNumber = null;
                  }
                  return massNumber;

                }
              }
            }
          }
        }
      }
    }

    stateVariableDefinitions.displayMassNumber = {
      public: true,
      componentType: "boolean",
      hasEssential: true,
      defaultValue: false,
      returnDependencies: () => ({
        massNumber: {
          dependencyType: "stateVariable",
          variableName: "massNumber"
        },
        displayMassNumberAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayMassNumber",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayMassNumberAttr) {
          return {
            setValue: {
              displayMassNumber: dependencyValues.displayMassNumberAttr.stateValues.value
            }
          }
        } else {
          return {
            useEssentialOrDefaultValue: {
              displayMassNumber: { defaultValue: !usedDefault.massNumber }
            }
          }
        }

      }
    }

    stateVariableDefinitions.atomicNumber = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let atomicNumber = elements[dependencyValues.symbol]?.atomicNumber;
        if (!atomicNumber) {
          atomicNumber = null;
        }
        return {
          setValue: { atomicNumber }
        }
      }
    }


    stateVariableDefinitions.electronConfiguration = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let electronConfiguration = elements[dependencyValues.symbol]?.electronConfiguration;
        if (!electronConfiguration) {
          electronConfiguration = me.fromAst('\uff3f');
        }
        return {
          setValue: { electronConfiguration }
        }
      }
    }

    stateVariableDefinitions.latex = {
      additionalStateVariablesDefined: [{
        variableName: "latexWithInputChildren",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
        massNumber: {
          dependencyType: "stateVariable",
          variableName: "massNumber",
        },
        displayMassNumber: {
          dependencyType: "stateVariable",
          variableName: "displayMassNumber",
        },
      }),
      definition({ dependencyValues }) {
        let latex;
        if (!(dependencyValues.symbol in elements)) {
          latex = "[Invalid Chemical Symbol]";
        } else {
          latex = `\\text{${dependencyValues.symbol}}`
          if (dependencyValues.displayMassNumber) {
            latex = `{}^{${dependencyValues.massNumber}} ${latex}`
          }
        }
        return {
          setValue: { latex, latexWithInputChildren: [latex] }
        }
      }
    }


    return stateVariableDefinitions;
  }

}
