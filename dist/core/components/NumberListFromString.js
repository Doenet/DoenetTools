import InlineComponent from './abstract/InlineComponent.js';

export default class NumberListFromString extends InlineComponent {
  static componentType = "numberListFromString";
  static rendererType = "asList";
  static renderChildren = true;

  static stateVariableForAttributeValue = "numbers";

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsBySpaces = function ({ matchedChildren }) {

      // break any string by white space

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (typeof c === "string") {
          return [
            ...a,
            ...c.split(/\s+/)
              .filter(s => s)
          ]
        } else {
          return [...a, c]
        }
      }, []);

      return {
        success: true,
        newChildren: newChildren,
      }
    }

    sugarInstructions.push({
      replacementFunction: breakStringsBySpaces
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "strings",
      componentTypes: ["string"]
    }]
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        stringChildren: {
          dependencyType: "child",
          childGroups: ["strings"],
        }
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { nComponents: dependencyValues.stringChildren.length } }
      }
    }

    stateVariableDefinitions.numbers = {
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["number"],
      returnArraySizeDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nComponents];
      },

      returnArrayDependenciesByKey() {
        let globalDependencies = {
          stringChildren: {
            dependencyType: "child",
            childGroups: ["strings"],
          }
        };
        return { globalDependencies }

      },
      arrayDefinitionByKey({
        globalDependencyValues, arrayKeys,
      }) {

        let numbers = {};
        for(let [ind,child] of globalDependencyValues.stringChildren.entries()) {
          numbers[ind] = Number(child);
        }
        return { setValue: { numbers } }

      },
    }

    stateVariableDefinitions.nValues = {
      isAlias: true,
      targetVariableName: "nComponents"
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "numbers"
    };

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      additionalStateVariablesDefined: ["texts"],
      returnDependencies: () => ({
        numbers: {
          dependencyType: "stateVariable",
          variableName: "numbers",
        },
      }),
      definition: function ({ dependencyValues }) {

        let texts = dependencyValues.numbers.map(x=>x.toString());

        let text = texts.join(', ');

        return { setValue: { text, texts } }

      }
    }

    return stateVariableDefinitions;
  }

}