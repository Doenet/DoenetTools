import InlineComponent from '../abstract/InlineComponent.js';
import me from '../../../_snowpack/pkg/math-expressions.js';

const elements = {
  H: {
    name: "Hydrogen",
    atomicNumber: 1,
    nValenceElectrons: 1,
    electronConfiguration: me.fromText("1s^1"),
    defaultMassNumber: 1,
    groupNumber: 1,
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["U"] }]
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
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }]
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
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["U"] }]
  },
  Be: {
    name: "Beryllium",
    atomicNumber: 4,
    nValenceElectrons: 2,
    electronConfiguration: me.fromText("1s^2 2s^2"),
    defaultMassNumber: 9,
    groupNumber: 2,
    groupName: "Alkaline Earth Metals",
    metal: "metal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }]
  },
  B: {
    name: "Boron",
    atomicNumber: 5,
    nValenceElectrons: 3,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^1"),
    defaultMassNumber: 11,
    groupNumber: 13,
    metal: "metalloid",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["U", "", ""] }]
  },
  C: {
    name: "Carbon",
    atomicNumber: 6,
    nValenceElectrons: 4,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^2"),
    defaultMassNumber: 12,
    groupNumber: 14,
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["U", "U", ""] }]
  },
  N: {
    name: "Nitrogen",
    atomicNumber: 7,
    nValenceElectrons: 5,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^3"),
    defaultMassNumber: 14,
    groupNumber: 15,
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["U", "U", "U"] }]
  },
  O: {
    name: "Oxygen",
    atomicNumber: 8,
    nValenceElectrons: 6,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^4"),
    defaultMassNumber: 16,
    groupNumber: 16,
    groupName: "Chalcogens",
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "U", "U"] }]
  },
  F: {
    name: "Fluorine",
    atomicNumber: 9,
    nValenceElectrons: 7,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^5"),
    defaultMassNumber: 19,
    groupNumber: 17,
    groupName: "Halogens",
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "U"] }]
  },
  Ne: {
    name: "Neon",
    atomicNumber: 10,
    nValenceElectrons: 8,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6"),
    defaultMassNumber: 20,
    groupNumber: 18,
    groupName: "Noble gases",
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }]
  },
  Na: {
    name: "Sodium",
    atomicNumber: 11,
    nValenceElectrons: 1,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^1"),
    defaultMassNumber: 23,
    groupNumber: 1,
    groupName: "Alkali metals",
    metal: "metal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["U"] }]
  },
  Mg: {
    name: "Magnesium",
    atomicNumber: 12,
    nValenceElectrons: 2,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2"),
    defaultMassNumber: 24,
    groupNumber: 2,
    groupName: "Alkaline earth metals",
    metal: "metal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }]
  },
  Al: {
    name: "Aluminum",
    atomicNumber: 13,
    nValenceElectrons: 3,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2 3p^1"),
    defaultMassNumber: 27,
    groupNumber: 13,
    metal: "metal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }, { orbitalText: "3p", boxes: ["U", "", ""] }]
  },
  Si: {
    name: "Silicon",
    atomicNumber: 14,
    nValenceElectrons: 4,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2 3p^2"),
    defaultMassNumber: 28,
    groupNumber: 14,
    metal: "metalloid",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }, { orbitalText: "3p", boxes: ["U", "U", ""] }]
  },
  P: {
    name: "Phosphorus",
    atomicNumber: 15,
    nValenceElectrons: 5,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2 3p^3"),
    defaultMassNumber: 31,
    groupNumber: 15,
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }, { orbitalText: "3p", boxes: ["U", "U", "U"] }]
  },
  S: {
    name: "Sulfur",
    atomicNumber: 16,
    nValenceElectrons: 6,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2 3p^4"),
    defaultMassNumber: 32,
    groupNumber: 16,
    groupName: "Chalcogens",
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }, { orbitalText: "3p", boxes: ["UD", "U", "U"] }]
  },
  Cl: {
    name: "Chlorine",
    atomicNumber: 17,
    nValenceElectrons: 7,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2 3p^5"),
    defaultMassNumber: 35,
    groupNumber: 17,
    groupName: "Halogens",
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }, { orbitalText: "3p", boxes: ["UD", "UD", "U"] }]
  },
  Ar: {
    name: "Argon",
    atomicNumber: 18,
    nValenceElectrons: 8,
    electronConfiguration: me.fromText("1s^2 2s^2 2p^6 3s^2 3p^6"),
    defaultMassNumber: 40,
    groupNumber: 18,
    groupName: "Noble gases",
    metal: "nonmetal",
    orbitalDiagram: [{ orbitalText: "1s", boxes: ["UD"] }, { orbitalText: "2s", boxes: ["UD"] }, { orbitalText: "2p", boxes: ["UD", "UD", "UD"] }, { orbitalText: "3s", boxes: ["UD"] }, { orbitalText: "3p", boxes: ["UD", "UD", "UD"] }]
  },
}

const symbolByAtomicNumber = {};
const symbolLowerCaseMapping = {};
for (let symbol in elements) {
  symbolLowerCaseMapping[symbol.toLowerCase()] = symbol;
  symbolByAtomicNumber[elements[symbol].atomicNumber] = symbol;
}

const neutronMass = 1.6749274980495E-27;
//, 1.674927471E-27, 1.6749286E-27, 1.6726231E-27]
const protonMass = 1.6726219236951E-27;
const electronMass = 9.109383701528E-31;



export default class Atom extends InlineComponent {
  static componentType = "atom";
  static rendererType = "math";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.symbol = {
      createComponentOfType: "text",
    };

    attributes.atomicNumber = {
      createComponentOfType: "integer",
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

    stateVariableDefinitions.symbol = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        symbolAttr: {
          dependencyType: "attributeComponent",
          attributeName: "symbol",
          variableNames: ["value"]
        },

        atomicNumberAttr: {
          dependencyType: "attributeComponent",
          attributeName: "atomicNumber",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {

        let symbol;

        if(dependencyValues.symbolAttr) {
          symbol = symbolLowerCaseMapping[dependencyValues.symbolAttr.stateValues.value.toLowerCase()];
        } else if(dependencyValues.atomicNumberAttr) {
          symbol = symbolByAtomicNumber[dependencyValues.atomicNumberAttr.stateValues.value]
        }

        if (!symbol) {
          symbol = null;
        }

        return { setValue: { symbol } }

      }
    }

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

    stateVariableDefinitions.orbitalDiagram = {
      public: true,
      componentType: "orbitalDiagram",
      returnDependencies: () => ({
        symbol: {
          dependencyType: "stateVariable",
          variableName: "symbol",
        },
      }),
      definition({ dependencyValues }) {
        let orbitalDiagram = elements[dependencyValues.symbol]?.orbitalDiagram;
        return {
          setValue: { orbitalDiagram }
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
