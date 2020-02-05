import InlineComponent from './abstract/InlineComponent';

export default class TextList extends InlineComponent {
  static componentType = "textlist";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.unordered = { default: false };
    properties.maximumNumber = { default: null };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroTextlists = childLogic.newLeaf({
      name: "atLeastZeroTextlists",
      componentType: 'textlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoTextsByCommas = function ({ dependencyValues }) {
      let stringChild = dependencyValues.stringChildren[0];
      let newChildren = stringChild.stateValues.value.split(",").map(x => ({
        componentType: "text",
        state: { value: x.trim() }
      }));
      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      sugarDependencies: {
        stringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      },
      affectedBySugar: ["atLeastZeroTexts"],
      replacementFunction: breakStringIntoTextsByCommas,
    });

    let textAndTextLists = childLogic.newOperator({
      name: "textAndTextLists",
      operator: "and",
      propositions: [atLeastZeroTexts, atLeastZeroTextlists]
    })

    childLogic.newOperator({
      name: "TextsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, textAndTextLists],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.texts = {
      public: true,
      componentType: "text",
      isArray: true,
      entryPrefixes: ["text"],
      returnDependencies: () => ({
        textAndTextlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "textAndTextLists",
          variableNames: ["value", "texts"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        }
      }),
      definition: function ({ dependencyValues }) {
        let texts = [];

        for (let child of dependencyValues.textAndTextlistChildren) {
          if (child.stateValues.texts) {
            texts.push(...child.stateValues.texts);
          } else {
            texts.push(child.stateValues.value);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        return { newValues: { texts } }

      }
    }

    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { text: dependencyValues.texts.join(", ") }
      })
    }

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nComponents: dependencyValues.texts.length } }
      }
    }

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        textAndTextlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "textAndTextLists",
          variableNames: ["childrenWhoRender"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues }) {
        let childrenWhoRender = [];

        for (let child of dependencyValues.textAndTextlistChildren) {

          if (child.stateValues.childrenWhoRender) {
            childrenWhoRender.push(...child.stateValues.childrenWhoRender);
          } else {
            childrenWhoRender.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && childrenWhoRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenWhoRender = childrenWhoRender.slice(0, maxNum)
        }

        return { newValues: { childrenWhoRender } }

      }
    }

    return stateVariableDefinitions;
  }

  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

}