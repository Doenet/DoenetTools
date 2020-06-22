import BaseComponent from './BaseComponent';

export default class ComponentSize extends BaseComponent {
  static componentType = "_componentsize";
  static rendererType = "number";

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value", "isAbsolute"] };


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneString = childLogic.newLeaf({
      name: "atMostOneString",
      componentType: 'string',
      comparison: 'atMost',
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
      propositions: [atMostOneNumber, atMostOneString],
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

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    let componentType = this.componentType;

    stateVariableDefinitions.value = {
      additionalStateVariablesDefined: ["isAbsolute"],
      returnDependencies: () => ({
        componentSizeChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneComponentSize",
          variableNames: ["value", "isAbsolute"]
        },
        numberChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneNumber",
          variableNames: ["value"]
        },
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneString",
          variableNames: ["value"]
        }
      }),
      definition({ dependencyValues }) {

        // console.log('value dependencyValues')
        // console.log(dependencyValues);

        if (dependencyValues.stringChild.length === 0) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.componentSizeChild.length === 0) {
              return {
                useEssentialOrDefaultValue: {
                  value: { variablesToCheck: "value", defaultValue: 100 },
                  isAbsolute: { variablesToCheck: "isAbsolute", defaultValue: false }
                }
              }
            } else {
              //only componentSize child

              return {
                newValues: dependencyValues.componentSizeChild[0].stateValues
              }
            }
          } else {
            //only number child

            return {
              newValues: {
                value: dependencyValues.numberChild[0].stateValues.value,
                isAbsolute: true
              }
            }
          }
        } else {
          //string child

          let originalValue, originalUnit;

          if (dependencyValues.numberChild.length === 1) {
            //string and number child

            originalValue = dependencyValues.numberChild[0].stateValues.value;
            originalUnit = dependencyValues.stringChild[0].stateValues.value.trim();
          } else {
            //only string child

            // <width>100</width>
            // <width>100px</width>
            // <width>100 px</width>
            // <width>100 pixels</width>
            // <width>100pixels</width>
            // <width>100     pixel</width>
            // <width>100pixel</width>
            // <width>50%</width>

            let result = dependencyValues.stringChild[0].stateValues.value.trim().match(/^(\d+)\s*(.*)$/);
            if (result === null) {
              console.warn(componentType + " must begin with a number.");
              return { newValues: { value: null, isAbsolute: true } };
            }
            originalValue = result[1];
            originalUnit = result[2].trim();
          }

          originalValue = Number(originalValue);
          if (!Number.isFinite(originalValue)) {
            console.warn(componentType + " must have a number");
            return { newValues: { value: null, isAbsolute: true } };
          }

          if (originalUnit === "") {
            return { newValues: { value: originalValue, isAbsolute: true } };
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
            console.warn(originalUnit + ' is not a defined unit of measure.');
            return { newValues: { value: originalValue, isAbsolute: true } };
          }
          let value = conversionFactor[originalUnit] * originalValue;

          // console.log(`value: ${value}, isAbsolute: ${isAbsolute}`);

          return {
            newValues: { value, isAbsolute }
          }

        }

      }
    }

    stateVariableDefinitions.valueForDisplay = {
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { valueForDisplay: dependencyValues.value }
      })
    }

    return stateVariableDefinitions;
  }


}