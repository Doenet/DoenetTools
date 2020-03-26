import InlineComponent from './abstract/InlineComponent';

export default class TextList extends InlineComponent {
  static componentType = "randomizedtextlist";

  // when another component has a property that is a textlist,
  // use the texts state variable to populate that property
  static stateVariableForPropertyValue = "texts";

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
      returnSugarDependencies: () => ({
        stringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      }),
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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
        },
        childrenToRender: {
          dependencyType: "stateVariable",
          variableName: "childrenToRender"
        }
      }),
      definition: function ({ dependencyValues }) {
        let texts = [];

        let childNames = dependencyValues.textAndTextlistChildren.map(x => x.componentName);
        for (let childName of dependencyValues.childrenToRender) {
          let index = childNames.indexOf(childName);
          let child = dependencyValues.textAndTextlistChildren[index];
          if (child.stateValues.texts) {
            texts.push(...child.stateValues.texts);
          } else {
            texts.push(child.stateValues.value);
          }
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

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: ({ sharedParameters }) => ({
        textAndTextlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "textAndTextLists",
          variableNames: ["childrenToRender"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        selectRng: {
          dependencyType: "value",
          value: sharedParameters.selectRng,
          doNotProxy: true,
        }
      }),
      definition: function ({ dependencyValues }) {
        let childrenToRender = [];


        for (let child of dependencyValues.textAndTextlistChildren) {

          if (child.stateValues.childrenToRender) {
            childrenToRender.push(...child.stateValues.childrenToRender);
          } else {
            childrenToRender.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && childrenToRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenToRender = childrenToRender.slice(0, maxNum)
        }

        console.log(`randomizing children`)

        // first shuffle the array
        // https://stackoverflow.com/a/12646864
        for (let i = childrenToRender.length - 1; i > 0; i--) {
          const rand = dependencyValues.selectRng.random();
          const j = Math.floor(rand * (i + 1));
          [childrenToRender[i], childrenToRender[j]] = [childrenToRender[j], childrenToRender[i]];
        }

        let numChildren = Math.ceil(dependencyValues.selectRng.random() * childrenToRender.length);
        console.log(`numChildren: ${numChildren}`)
        childrenToRender = childrenToRender.slice(0, numChildren)


        return { newValues: { childrenToRender } }

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