import BaseComponent from './BaseComponent';

export default class ComponentSize extends BaseComponent {
  static componentType = "_componentsize";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value", "isAbsolute"] };


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      comparison: 'exactly',
      number: 1,
    });

    let atMostOneNumber = childLogic.newLeaf({
      name: "atMostOneNumber",
      componentType: 'number',
      comparison: 'atMost',
      number: 1,
    });

    let numberAndString = childLogic.newOperator({
      name: "numberAndString",
      operator: 'and',
      propositions: [atMostOneNumber, exactlyOneString],
      requireConsecutive: true,
      sequenceMatters: true,
    });

    let atMostOneComponentSize = childLogic.newLeaf({
      name: "atMostOneComponentSize",
      componentType: '_componentsize',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "numberAndStringXorComponentSize",
      operator: 'xor',
      propositions: [numberAndString, atMostOneComponentSize],
      setAsBase: true
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    let componentType = this.componentType;

    stateVariableDefinitions.value = {
      additionalStateVariablesDefined: ["isAbsolute"],
      returnDependencies: () => ({
        componentSizeChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneComponentSize",
          variableNames: ["value", "isAbsolute"]
        },
        numberAndStringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "numberAndString",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {

        // console.log('value dependencyValues')
        // console.log(dependencyValues);

        if (dependencyValues.numberAndStringChildren.length === 0) {
          if (dependencyValues.componentSizeChild.length === 0) {
            return {
              useEssentialOrDefaultValue: {
                value: { variablesToCheck: "value", defaultValue: 100 },
                isAbsolute: { variablesToCheck: "isAbsolute", defaultValue: false }
              }
            }
          } else {
            return {
              newValues: dependencyValues.componentSizeChild[0].stateValues
            }
          }
        } else {
          // number and string children

          let originalValue, originalUnit;

          if (dependencyValues.numberAndStringChildren.length === 1) {
            //Only have a string
            // <width>100px</width>
            // <width>100 px</width>
            // <width>100 pixels</width>
            // <width>100pixels</width>
            // <width>100     pixel</width>
            // <width>100pixel</width>

            let result = dependencyValues.numberAndStringChildren[0].stateValues.value.match(/^\s*(\d+)\s*([a-zA-Z]+|%+)\s*$/);
            if (result === null) { throw Error(componentType + " must have a number and a unit."); }
            originalValue = result[1];
            originalUnit = result[2];

          } else {
            //Have a number followed by a string
            originalValue = dependencyValues.numberAndStringChildren[0].stateValues.value;
            if (!Number.isFinite(originalValue)) {
              throw Error(componentType + " must have a number");
            }
            let result = dependencyValues.numberAndStringChildren[1].stateValues.value.match(/^\s*([a-zA-Z]+|%+)\s*$/);
            if (result === null) { throw Error(componentType + " must have a number and a unit."); }
            originalUnit = result[1];

          }


          let isAbsolute = !(originalUnit === '%' || originalUnit === 'em');

          let conversionFactor = {
            'px': 1,
            'pixel': 1,
            'pixels': 1,
            '%': 1,
            'em': 100,
            'in': 96,
            'inch': 96,
            'inches': 96,
            'pt': 1.333333333333,
            'mm': 3.7795296,
            'millimeter': 3.7795296,
            'millimeters': 3.7795296,
            'cm': 37.795296,
            'centimeter': 37.795296,
            'centimeters': 37.795296,
          }
          if (conversionFactor[originalUnit] === undefined) {
            throw Error(originalUnit + ' is not a defined unit of measure.');
          }
          let value = conversionFactor[originalUnit] * originalValue;

          // console.log(`value: ${value}, isAbsolute: ${isAbsolute}`);

          return {
            newValues: { value, isAbsolute }
          }

        }

      }
    }

    return stateVariableDefinitions;
  }


}