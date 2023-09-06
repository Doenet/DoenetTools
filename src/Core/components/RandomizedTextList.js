import InlineComponent from "./abstract/InlineComponent";

export default class TextList extends InlineComponent {
  static componentType = "randomizedTextList";

  static excludeFromSchema = true;

  // when another component has a attribute that is a textList,
  // use the texts state variable to populate that attribute
  static stateVariableToBeShadowed = "texts";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.unordered = { default: false };
    attributes.maxNumber = { default: null };
    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: "text",
      comparison: "atLeast",
      number: 0,
    });

    let atLeastZeroTextLists = childLogic.newLeaf({
      name: "atLeastZeroTextLists",
      componentType: "textList",
      comparison: "atLeast",
      number: 0,
    });

    let breakStringIntoTextsByCommas = function ({ dependencyValues }) {
      let stringChild = dependencyValues.stringChildren[0];
      let newChildren = stringChild.stateValues.value.split(",").map((x) => ({
        componentType: "text",
        state: { value: x.trim() },
      }));
      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      };
    };

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: "string",
      number: 1,
      isSugar: true,
      returnSugarDependencies: () => ({
        stringChildren: {
          dependencyType: "child",
          childLogicName: "exactlyOneString",
          variableNames: ["value"],
        },
      }),
      logicToWaitOnSugar: ["atLeastZeroTexts"],
      replacementFunction: breakStringIntoTextsByCommas,
    });

    let textAndTextLists = childLogic.newOperator({
      name: "textAndTextLists",
      operator: "and",
      propositions: [atLeastZeroTexts, atLeastZeroTextLists],
    });

    childLogic.newOperator({
      name: "TextsXorSugar",
      operator: "xor",
      propositions: [exactlyOneString, textAndTextLists],
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.texts = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      isArray: true,
      entryPrefixes: ["text"],
      returnDependencies: () => ({
        textAndTextListChildren: {
          dependencyType: "child",
          childLogicName: "textAndTextLists",
          variableNames: ["value", "texts"],
          variablesOptional: true,
        },
        maxNumber: {
          dependencyType: "stateVariable",
          variableName: "maxNumber",
        },
        childrenToRender: {
          dependencyType: "stateVariable",
          variableName: "childrenToRender",
        },
      }),
      definition: function ({ dependencyValues }) {
        let texts = [];

        let childNames = dependencyValues.textAndTextListChildren.map(
          (x) => x.componentName,
        );
        for (let childName of dependencyValues.childrenToRender) {
          let index = childNames.indexOf(childName);
          let child = dependencyValues.textAndTextListChildren[index];
          if (child.stateValues.texts) {
            texts.push(...child.stateValues.texts);
          } else {
            texts.push(child.stateValues.value);
          }
        }

        return { setValue: { texts } };
      },
    };

    stateVariableDefinitions.text = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "text",
      },
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { text: dependencyValues.texts.join(", ") },
      }),
    };

    stateVariableDefinitions.numComponents = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "number",
      },
      returnDependencies: () => ({
        texts: {
          dependencyType: "stateVariable",
          variableName: "texts",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { numComponents: dependencyValues.texts.length } };
      },
    };

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: ({ sharedParameters }) => ({
        textAndTextListChildren: {
          dependencyType: "child",
          childLogicName: "textAndTextLists",
          variableNames: ["childrenToRender"],
          variablesOptional: true,
        },
        maxNumber: {
          dependencyType: "stateVariable",
          variableName: "maxNumber",
        },
        selectRng: {
          dependencyType: "value",
          value: sharedParameters.selectRng,
          doNotProxy: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        let childrenToRender = [];

        for (let child of dependencyValues.textAndTextListChildren) {
          if (child.stateValues.childrenToRender) {
            childrenToRender.push(...child.stateValues.childrenToRender);
          } else {
            childrenToRender.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maxNumber;
        if (maxNum !== null && childrenToRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenToRender = childrenToRender.slice(0, maxNum);
        }

        console.log(`randomizing children`);

        // first shuffle the array
        // https://stackoverflow.com/a/12646864
        for (let i = childrenToRender.length - 1; i > 0; i--) {
          const rand = dependencyValues.selectRng();
          const j = Math.floor(rand * (i + 1));
          [childrenToRender[i], childrenToRender[j]] = [
            childrenToRender[j],
            childrenToRender[i],
          ];
        }

        let numChildren = Math.ceil(
          dependencyValues.selectRng() * childrenToRender.length,
        );
        console.log(`numChildren: ${numChildren}`);
        childrenToRender = childrenToRender.slice(0, numChildren);

        return { setValue: { childrenToRender } };
      },
    };

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
