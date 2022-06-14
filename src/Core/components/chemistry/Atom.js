import InlineComponent from '../abstract/InlineComponent';
import me from 'math-expressions';


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

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.dataForAtom = {
      returnDependencies: () => ({
        fileContents: {
          dependencyType: "file",
          cid: "bafkreifow4gfnfdgxu44ahkx565dt7rb75vhollgt3nbcdfwwksyzw53ry",
          fileType: "csv"
        },
        symbolAttr: {
          dependencyType: "attributeComponent",
          attributeName: "symbol",
          variableNames: ["value"]
        },
        atomicNumberAttr: {
          dependencyType: "attributeComponent",
          attributeName: "atomicNumber",
          variableNames: ["value"]
        },
      }),


      definition: function ({ dependencyValues }) {

        let symbol = null, atomicNumber = null;
        if (dependencyValues.symbolAttr) {
          symbol = dependencyValues.symbolAttr.stateValues.value.toLowerCase();
        } else if (dependencyValues.atomicNumberAttr) {
          atomicNumber = dependencyValues.atomicNumberAttr.stateValues.value;
        } else {
          return { setValue: { dataForAtom: null } }
        }

        let allRowData = dependencyValues.fileContents.trim().split("\n");

        let rowInd;

        if (atomicNumber !== null) {
          rowInd = atomicNumber - 1;
        } else {
          rowInd = ["h", "he", "li", "be", "b", "c", "n", "o", "f", "ne", "na", "mg", "al", "si", "p", "s", "cl", "ar", "k", "ca", "sc", "ti", "v", "cr", "mn", "fe", "co", "ni", "cu", "zn", "ga", "ge", "as", "se", "br", "kr", "rb", "sr", "y", "zr", "nb", "mo", "tc", "ru", "rh", "pd", "ag", "cd", "in", "sn", "sb", "te", "i", "xe", "cs", "ba", "la", "ce", "pr", "nd", "pm", "sm", "eu", "gd", "tb", "dy", "ho", "er", "tm", "yb", "lu", "hf", "ta", "w", "re", "os", "ir", "pt", "au", "hg", "tl", "pb", "bi", "po", "at", "rn", "fr", "ra", "ac", "th", "pa", "u", "np", "pu", "am", "cm", "bk", "cf", "es", "fm", "md", "no", "lr", "rf", "db", "sg", "bh", "hs", "mt", "ds", "rg", "cn", "nh", "fl", "mc", "lv", "ts", "og"].indexOf(symbol.toLowerCase());
        }

        let rowData = allRowData.slice(1)[rowInd];
        if (!rowData) {
          return { setValue: { dataForAtom: null } }
        }

        rowData = rowData.trim().split(",").map(y => y.trim())

        let columnNames = allRowData[0].trim().split(",").map(y => y.trim()).map(value => {
          if ([`"`, `'`].includes(value[0]) && value[value.length - 1] === value[0]) {
            value = value.substring(1, value.length - 1).trim();
          }
          return value;
        });

        let numColumns = columnNames.length;

        let columnTypes = ["number", "string", "string", "number", "number", "string", "number", "number", "number", "number", "number", "number", "number", "string"];


        let dataForAtom = {};
        for (let colInd = 0; colInd < numColumns; colInd++) {
          let colName = columnNames[colInd];
          let prescribedType = columnTypes[colInd];
          let value;
          if (prescribedType === "number") {
            value = Number(rowData[colInd]);
          } else {
            value = rowData[colInd];
            if ([`"`, `'`].includes(value[0]) && value[value.length - 1] === value[0]) {
              value = value.substring(1, value.length - 1);
            }
          }
          if (colName === "Electron Configuration") {
            dataForAtom[colName] = me.fromText(value);
          } else {
            dataForAtom[colName] = value;
          }
        }

        return { setValue: { dataForAtom } };

      },

    }

    stateVariableDefinitions.atomicNumber = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let atomicNumber;

        if (dependencyValues.dataForAtom) {
          atomicNumber = dependencyValues.dataForAtom["Atomic Number"];
        } else {
          atomicNumber = null;
        }

        return { setValue: { atomicNumber } }

      }
    }

    stateVariableDefinitions.symbol = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let symbol;

        if (dependencyValues.dataForAtom) {
          symbol = dependencyValues.dataForAtom.Symbol;
        } else {
          symbol = null;
        }

        return { setValue: { symbol } }

      }
    }

    stateVariableDefinitions.name = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let name;

        if (dependencyValues.dataForAtom) {
          name = dependencyValues.dataForAtom.Name;
        } else {
          name = null;
        }

        return { setValue: { name } }

      }
    }

    stateVariableDefinitions.group = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let group;

        if (dependencyValues.dataForAtom) {
          group = dependencyValues.dataForAtom.Group;
        } else {
          group = null;
        }

        return { setValue: { group } }

      }
    }

    stateVariableDefinitions.atomicMass = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let atomicMass;

        if (dependencyValues.dataForAtom) {
          atomicMass = dependencyValues.dataForAtom["Atomic Mass"];
        } else {
          atomicMass = null;
        }

        return { setValue: { atomicMass } }

      }
    }

    stateVariableDefinitions.phaseAtSTP = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let phaseAtSTP;

        if (dependencyValues.dataForAtom) {
          phaseAtSTP = dependencyValues.dataForAtom["Phase at STP"];
        } else {
          phaseAtSTP = null;
        }

        return { setValue: { phaseAtSTP } }

      }
    }


    stateVariableDefinitions.period = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let period;

        if (dependencyValues.dataForAtom) {
          period = dependencyValues.dataForAtom.Period;
        } else {
          period = null;
        }

        return { setValue: { period } }

      }
    }


    stateVariableDefinitions.ionizationEnergy = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let ionizationEnergy;

        if (dependencyValues.dataForAtom) {
          ionizationEnergy = dependencyValues.dataForAtom["Ionization Energy"];
        } else {
          ionizationEnergy = null;
        }

        return { setValue: { ionizationEnergy } }

      }
    }


    stateVariableDefinitions.meltingPoint = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let meltingPoint;

        if (dependencyValues.dataForAtom) {
          meltingPoint = dependencyValues.dataForAtom["Melting Point"];
        } else {
          meltingPoint = null;
        }

        return { setValue: { meltingPoint } }

      }
    }


    stateVariableDefinitions.boilingPoint = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let boilingPoint;

        if (dependencyValues.dataForAtom) {
          boilingPoint = dependencyValues.dataForAtom["Boiling Point"];
        } else {
          boilingPoint = null;
        }

        return { setValue: { boilingPoint } }

      }
    }


    stateVariableDefinitions.atomicRadius = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "integer",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let atomicRadius;

        if (dependencyValues.dataForAtom) {
          atomicRadius = dependencyValues.dataForAtom["Atomic Radius"];
        } else {
          atomicRadius = null;
        }

        return { setValue: { atomicRadius } }

      }
    }


    stateVariableDefinitions.density = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let density;

        if (dependencyValues.dataForAtom) {
          density = dependencyValues.dataForAtom.Density;
        } else {
          density = null;
        }

        return { setValue: { density } }

      }
    }



    stateVariableDefinitions.electronegativity = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let electronegativity;

        if (dependencyValues.dataForAtom) {
          electronegativity = dependencyValues.dataForAtom.Electronegativity;
        } else {
          electronegativity = null;
        }

        return { setValue: { electronegativity } }

      }
    }



    stateVariableDefinitions.electronConfiguration = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "electronConfiguration",
      },
      returnDependencies: () => ({
        dataForAtom: {
          dependencyType: "stateVariable",
          variableName: "dataForAtom",
        },
      }),
      definition({ dependencyValues }) {
        let electronConfiguration;

        if (dependencyValues.dataForAtom) {
          electronConfiguration = dependencyValues.dataForAtom["Electron Configuration"];
        } else {
          electronConfiguration = null;
        }

        return { setValue: { electronConfiguration } }

      }
    }


    stateVariableDefinitions.orbitalDiagram = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "orbitalDiagram",
      },
      returnDependencies: () => ({
        electronConfiguration: {
          dependencyType: "stateVariable",
          variableName: "electronConfiguration",
        },
      }),
      definition({ dependencyValues }) {
        let orbitalDiagram;
        if (dependencyValues.electronConfiguration) {
          orbitalDiagram = electronConfigurationToOrbitalDiagram(dependencyValues.electronConfiguration)
        } else {
          orbitalDiagram = null;
        }
        return {
          setValue: { orbitalDiagram }
        }
      }
    }


    // stateVariableDefinitions.isotopeSymbol = {
    //   public: true,
    //   shadowingInstructions: {
    //     createComponentOfType: "m",
    //   },
    //   returnDependencies: () => ({
    //     symbol: {
    //       dependencyType: "stateVariable",
    //       variableName: "symbol",
    //     },
    //     atomicNumber: {
    //       dependencyType: "stateVariable",
    //       variableName: "atomicNumber",
    //     },
    //     massNumber: {
    //       dependencyType: "stateVariable",
    //       variableName: "massNumber",
    //     },
    //   }),
    //   definition({ dependencyValues }) {
    //     let latex;
    //     if (!(dependencyValues.symbol in elements)) {
    //       latex = "[Invalid Chemical Symbol]";
    //     } else {
    //       latex = `{}^{${dependencyValues.massNumber}}_{${dependencyValues.atomicNumber}}\\text{${dependencyValues.symbol}}`
    //     }
    //     return {
    //       setValue: { isotopeSymbol: latex }
    //     }
    //   }
    // }

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
        // massNumber: {
        //   dependencyType: "stateVariable",
        //   variableName: "massNumber",
        // },
        // displayMassNumber: {
        //   dependencyType: "stateVariable",
        //   variableName: "displayMassNumber",
        // },
      }),
      definition({ dependencyValues }) {
        let latex;
        if (dependencyValues.symbol) {
          latex = `\\text{${dependencyValues.symbol}}`
        } else {
          latex = "[Invalid Chemical Symbol]";
        }
        return {
          setValue: { latex, latexWithInputChildren: [latex] }
        }
      }
    }


    return stateVariableDefinitions;
  }

}


function electronConfigurationToOrbitalDiagram(electronConfiguration) {

  let electronConfig = electronConfiguration.tree;

  if (!(Array.isArray(electronConfig) && electronConfig[0] === "*")) {
    return null;
  }

  electronConfig = electronConfig.slice(1);

  let nRows = electronConfig.length / 2;
  if (!Number.isInteger(nRows)) {
    return null;
  }

  let orbitalDiagram = [];

  for (let rowInd = 0; rowInd < nRows; rowInd++) {
    let electronLevel = electronConfig[2 * rowInd];
    if (!(Number.isInteger(electronLevel) && electronLevel > 0)) {
      return null;
    }

    let infoObj = electronConfig[2 * rowInd + 1];
    if (!(Array.isArray(infoObj) && infoObj[0] === "^")) {
      return null;
    }

    let shellType = infoObj[1];
    let nElectrons = infoObj[2];

    if (!(["s", "p", "d", "f"].includes(shellType) && Number.isInteger(nElectrons) && nElectrons > 0)) {
      return null;
    }

    let orbitalText = `${electronLevel}${shellType}`;

    let nBoxes;
    if (shellType === "s") {
      nBoxes = 1;
    } else if (shellType === "p") {
      nBoxes = 3;
    } else if (shellType === "d") {
      nBoxes = 5;
    } else {
      nBoxes = 7;
    }

    let boxes = Array(nBoxes).fill("");

    for (let electronInd = 0; electronInd < Math.min(nBoxes, nElectrons); electronInd++) {
      if (nElectrons <= electronInd + nBoxes) {
        boxes[electronInd] = "U";
      } else {
        boxes[electronInd] = "UD";
      }
    }

    orbitalDiagram.push({ orbitalText, boxes })
  }

  return orbitalDiagram;
}