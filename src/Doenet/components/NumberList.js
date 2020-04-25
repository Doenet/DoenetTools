import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class NumberList extends InlineComponent {
  static componentType = "numberlist";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.unordered = { default: false };
    properties.maximumNumber = { default: undefined };
    properties.mergeNumberLists = { default: false };
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroNumbers = childLogic.newLeaf({
      name: "atLeastZeroNumbers",
      componentType: 'number',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroNumberlists = childLogic.newLeaf({
      name: "atLeastZeroNumberlists",
      componentType: 'numberlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoNumbersByCommas = function ({ activeChildrenMatched }) {
      let stringChild = activeChildrenMatched[0];


      let stringPieces = stringChild.stateValues.value.split(",").map(x => x.trim()).filter(x => x != "");
      let newChildren = [];

      for (let piece of stringPieces) {
        let number= Number(piece);
        if (Number.isNaN(number)) {
          try {
            number = me.fromText(piece).evaluate_to_constant();
            if (number === null) {
              number = NaN;
            }
          } catch (e) {
            number = NaN;
          }
        }
        newChildren.push({
          componentType: "number",
          state: { value: number },
        });
      }

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
      logicToWaitOnSugar: ["atLeastZeroNumbers"],
      replacementFunction: breakStringIntoNumbersByCommas,
    });

    let numberAndNumberLists = childLogic.newOperator({
      name: "numberAndNumberLists",
      operator: "and",
      propositions: [atLeastZeroNumbers, atLeastZeroNumberlists]
    })

    childLogic.newOperator({
      name: "numbersXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, numberAndNumberLists],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.numberAndNumberlistChildren = {
      returnDependencies: () => ({
        numberAndNumberlistChildren: {
          dependencyType: "childIdentity",
          childLogicName: "numberAndNumberLists",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            numberAndNumberlistChildren: dependencyValues.numberAndNumberlistChildren
          }
        }
      }
    }

    stateVariableDefinitions.numbers = {
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["number"],
      returnDependencies: () => ({
        numberAndNumberlistChildren: {
          dependencyType: "stateVariable",
          variableName: "numberAndNumberlistChildren",
        },
        numberChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroNumbers",
          variableNames: ["value"],
        },
        numberlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroNumberlists",
          variableNames: ["numbers"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        mergeNumberLists: {
          dependencyType: "stateVariable",
          variableName: "mergeNumberLists",
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numberNumber = 0;
        let numberlistNumber = 0;
        let numbers = [];

        for (let child of dependencyValues.numberAndNumberlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "number"
          })) {

            numbers.push(dependencyValues.numberChildren[numberNumber].stateValues.value);
            numberNumber++;

          } else {
            numbers.push(...dependencyValues.numberlistChildren[numberlistNumber].stateValues.numbers);
            numberlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && numbers.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          numbers = numbers.slice(0, maxNum)
        }

        return { newValues: { numbers } }

      }
    }


    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        numberAndNumberlistChildren: {
          dependencyType: "stateVariable",
          variableName: "numberAndNumberlistChildren",
        },
        numberChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroNumbers",
          variableNames: ["valueForDisplay", "text"],
        },
        numberlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroNumberlists",
          variableNames: ["text"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        mergeNumberLists: {
          dependencyType: "stateVariable",
          variableName: "mergeNumberLists",
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numberNumber = 0;
        let numberlistNumber = 0;
        let texts = [];

        for (let child of dependencyValues.numberAndNumberlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "number"
          })) {

            texts.push(dependencyValues.numberChildren[numberNumber].stateValues.text);
            numberNumber++;

          } else {
            texts.push(...dependencyValues.numberlistChildren[numberlistNumber].stateValues.text);
            numberlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        let text = texts.join(', ');

        return { newValues: { text } }

      }
    }

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        numbers: {
          dependencyType: "stateVariable",
          variableName: "numbers"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nComponents: dependencyValues.numbers.length } }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        numberAndNumberlistChildren: {
          dependencyType: "stateVariable",
          variableName: "numberAndNumberlistChildren",
        },
        numberChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroNumbers",
        },
        numberlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroNumberlists",
          variableNames: ["childrenToRender"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let numberNumber = 0;
        let numberlistNumber = 0;
        let childrenToRender = [];

        for (let child of dependencyValues.numberAndNumberlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "number"
          })) {
            childrenToRender.push(dependencyValues.numberChildren[numberNumber].componentName);
            numberNumber++;
          } else {
            childrenToRender.push(...dependencyValues.numberlistChildren[numberlistNumber].stateValues.childrenToRender);
            numberlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && childrenToRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenToRender = childrenToRender.slice(0, maxNum)
        }

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