import InlineComponent from '../abstract/InlineComponent';
import me from 'math-expressions';

const elements = {
  H: {
    name: "Hydrogen",
    atomicNumber: 1,
    nValenceElectrons: 1,
    electronConfiguration: me.fromText("1s^1"),
    defaultMassNumber: 1,
    groupNumber: 1,
    metal: "nonmetal",
  },
  He: {
    name: "Helium",
    atomicNumber: 2,
    nValenceElectrons: 2,
    electronConfiguration: me.fromText("1s^2"),
    defaultMassNumber: 4,
    groupNumber: 18,
    groupName: "Noble Gases",
    metal: "nonmetal",
  },
  Li: {
    name: "Lithium",
    atomicNumber: 3,
    nValenceElectrons: 1,
    electronConfiguration: me.fromText("1s^2 2s^1"),
    defaultMassNumber: 7,
    groupNumber: 1,
    groupName: "Alkali Metals",
    metal: "metal",
  },
}

const neutronMass = 1.6749274980495E-27;
//, 1.674927471E-27, 1.6749286E-27, 1.6726231E-27]
const protonMass = 1.6726219236951E-27;
const electronMass = 9.109383701528E-31;



export default class Atom extends InlineComponent {
  static componentType = "atom";
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
      definition: function ({ dependencyValues }) {

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

    stateVariableDefinitions.nValenceElectrons = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let nValenceElectrons = elements[dependencyValues.symbol]?.nValenceElectrons;
        if (!nValenceElectrons) {
          nValenceElectrons = null;
        }
        return {
          setValue: { nValenceElectrons }
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

    stateVariableDefinitions.mass = {
      public: true,
      componentType: "math",
      returnDependencies: () => ({
        atomicNumber: {
          dependencyType: "stateVariable",
          variableName: "atomicNumber"
        },
        massNumber: {
          dependencyType: "stateVariable",
          variableName: "massNumber"
        }
      }),
      definition({ dependencyValues }) {
        return {
          setValue: {
            mass: me.fromAst(dependencyValues.atomicNumber * (protonMass + electronMass)
              + (dependencyValues.massNumber - dependencyValues.atomicNumber) * neutronMass)
          }
        }
      }
    }

    stateVariableDefinitions.groupNumber = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let groupNumber = elements[dependencyValues.symbol]?.groupNumber;
        if (!groupNumber) {
          groupNumber = null;
        }
        return {
          setValue: { groupNumber }
        }
      }
    }

    stateVariableDefinitions.groupName = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let groupName = elements[dependencyValues.symbol]?.groupName;
        if (!groupName) {
          groupName = null;
        }
        return {
          setValue: { groupName }
        }
      }
    }

    stateVariableDefinitions.metal = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let metal = elements[dependencyValues.symbol]?.metal;
        if (!metal) {
          metal = null;
        }
        return {
          setValue: { metal }
        }
      }
    }

    stateVariableDefinitions.isotopeSymbol = {
      public: true,
      componentType: "m",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
        atomicNumber: {
          dependencyType: "stateVariable",
          variableName: "atomicNumber",
        },
        massNumber: {
          dependencyType: "stateVariable",
          variableName: "massNumber",
        },
      }),
      definition({ dependencyValues }) {
        let latex;
        if (!(dependencyValues.symbol in elements)) {
          latex = "[Invalid Chemical Symbol]";
        } else {
          latex = `{}^{${dependencyValues.massNumber}}_{${dependencyValues.atomicNumber}}\\text{${dependencyValues.symbol}}`
        }
        return {
          setValue: { isotopeSymbol: latex }
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
