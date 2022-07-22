import InlineComponent from '../abstract/InlineComponent';
import me from 'math-expressions';


export default class IonicCompound extends InlineComponent {
  static componentType = "ionicCompound";
  static rendererType = "math";


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.symbol = {
      createComponentOfType: "text",
    };

    attributes.atomicNumber = {
      createComponentOfType: "integer",
    };

    attributes.charge = {
      createComponentOfType: "integer",
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "ions",
      componentTypes: ["ion"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.ionicCompound = {
      // public: true,
      // shadowingInstructions: {
      //   createComponentOfType: "integer",
      // },
      returnDependencies: () => ({
        ionChildren: {
          dependencyType: "child",
          childGroups: ["ions"],
          variableNames: ["symbol", "charge", "atomicNumber", "name"]
        }
      }),
      definition({ dependencyValues }) {

        let charges = dependencyValues.ionChildren.map(child => child.stateValues.charge);

        if (charges.length !== 2) {
          console.warn("have not implemented ionic compound for anything other than two ions");
          return { setValue: { ionicCompound: null } }
        }

        if (!(charges[0] * charges[1] < 0)) {
          console.warn("ionic compound implemented only for one cation and one anion");
          return { setValue: { ionicCompound: null } }
        }

        let n1 = Math.abs(charges[1]);
        let n2 = Math.abs(charges[0]);

        let gcd = me.math.gcd(n1, n2);
        n1 /= gcd;
        n2 /= gcd;

        let ionicCompound = [{
          symbol: dependencyValues.ionChildren[0].stateValues.symbol,
          atomicNumber: dependencyValues.ionChildren[0].stateValues.atomicNumber,
          name: dependencyValues.ionChildren[0].stateValues.name,
          charge: charges[0],
          count: n1
        }, {
          symbol: dependencyValues.ionChildren[1].stateValues.symbol,
          atomicNumber: dependencyValues.ionChildren[1].stateValues.atomicNumber,
          name: dependencyValues.ionChildren[1].stateValues.name,
          charge: charges[1],
          count: n2
        }
        ]

        return { setValue: { ionicCompound } }

      }
    }



    stateVariableDefinitions.latex = {
      additionalStateVariablesDefined: [{
        variableName: "latexWithInputChildren",
        forRenderer: true,
      }],
      returnDependencies: () => ({
        ionicCompound: {
          dependencyType: "stateVariable",
          variableName: "ionicCompound",
        },
      }),
      definition({ dependencyValues }) {
        let latex;

        if(dependencyValues.ionicCompound) {
          latex = "";
          for(let piece of dependencyValues.ionicCompound) {
            latex += `\\text{${piece.symbol}}`;
            if(piece.count > 1) {
              latex += `_{${piece.count}}`
            }
            if (piece.charge === -1) {
              latex = latex + `^-`
            } else if (piece.charge === 1) {
              latex = latex + `^+`
            } else if (piece.charge < 0) {
              latex = latex + `^{${Math.abs(piece.charge)}-}`
            } else if (piece.charge > 0) {
              latex = latex + `^{${Math.abs(piece.charge)}+}`
            }
          }
        } else {
          latex = "[\\text{Invalid Ionic Compound}]";
        }
        return {
          setValue: { latex, latexWithInputChildren: [latex] }
        }
      }
    }


    return stateVariableDefinitions;
  }


}


