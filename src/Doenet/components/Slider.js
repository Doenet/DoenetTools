import BaseComponent from './abstract/BaseComponent';

export default class Slider extends BaseComponent {
  constructor(args) {
    super(args);
    this.changeValue = this.changeValue.bind(this);
  }
  static componentType = "slider";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.width = { default: 300 };
    properties.height = { default: 50 };
    properties.initialNumber = { default: undefined };
    properties.initialText = { default: undefined };
    properties.label = { default: undefined };
    properties.showControls = { default: false };
    properties.showTicks = { default: true };
    properties.collaborateGroups = { default: undefined };

    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastOneNumbers = childLogic.newLeaf({
      name: "atLeastOneNumbers",
      componentType: 'number',
      comparison: 'atLeast',
      number: 1,
    });
    let atLeastOneTexts = childLogic.newLeaf({
      name: "atLeastOneTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 1,
    });

    // let exactlyOneSequence = childLogic.newLeaf({
    //   name: "exactlyOneSequence",
    //   componentType: 'sequence',
    //   number: 1,
    // });

    let numbersXorTextsXorSequence = childLogic.newOperator({
      name: "numbersXorTextsXorSequence",
      operator: 'xor',
      propositions: [atLeastOneNumbers, atLeastOneTexts, /*exactlyOneSequence*/],
    });

    let atMostOneMarkers = childLogic.newLeaf({
      name: "atMostOneMarkers",
      componentType: 'markers',
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "SliderLogic",
      operator: 'and',
      propositions: [numbersXorTextsXorSequence, atMostOneMarkers],
      setAsBase: true,
    });


    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.sliderType = {
      returnDependencies: () => ({
        textChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneTexts",
        },
        numberChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneNumbers",
        },
      }),
      definition: function ({ dependencyValues }) {
        let sliderType;
        if (dependencyValues.textChildren.length > 0) {
          sliderType = "text";
        } else {
          sliderType = "number"
        }
        return { newValues: { sliderType } }
      }
    }

    stateVariableDefinitions.items = {
      public: true,
      isArray: true,
      entryPrefixes: ["item"],
      returnDependencies: () => ({
        textChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneTexts",
          variableNames: ["value"]
        },
        numberChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneNumbers",
          variableNames: ["value"]
        },
        sliderType: {
          dependencyType: "stateVariable",
          variableName: "sliderType"
        }
      }),
      definition: function ({ dependencyValues }) {

        let items;

        if (dependencyValues.sliderType === "text") {
          items = dependencyValues.textChildren.map(x => x.stateValues.value);
        } else {
          items = dependencyValues.numberChildren.map(x => x.stateValues.value);
          items.sort((a, b) => { return a - b; }); //sort in number order
        }

        return {
          newValues: { items },
          setComponentType: { items: dependencyValues.sliderType },
        };
      }
    }

    stateVariableDefinitions.valueToIndex = {
      returnDependencies: () => ({
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        }
      }),
      definition: function ({ dependencyValues }) {
        let valueToIndex = {};
        for (let [ind, item] of dependencyValues.items.entries()) {
          valueToIndex[item] = ind;
        }
        return { newValues: { valueToIndex } }
      }
    }


    stateVariableDefinitions.preliminaryValue = {
      returnDependencies: () => ({
        sliderType: {
          dependencyType: "stateVariable",
          variableName: "sliderType"
        },
        initialNumber: {
          dependencyType: "stateVariable",
          variableName: "initialNumber"
        },
        initialText: {
          dependencyType: "stateVariable",
          variableName: "initialText"
        },
      }),
      definition({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            preliminaryValue: {
              variablesToCheck: "value",
              get defaultValue() {
                if (dependencyValues.sliderType === "text") {
                  return dependencyValues.initialText;
                } else {
                  return dependencyValues.initialNumber;
                }
              }
            }
          }
        }
      }
    }

    stateVariableDefinitions.index = {
      returnDependencies: () => ({
        sliderType: {
          dependencyType: "stateVariable",
          variableName: "sliderType"
        },
        valueToIndex: {
          dependencyType: "stateVariable",
          variableName: "valueToIndex",
        },
        items: {
          dependencyType: "stateVariable",
          variableName: "items",
        },
        preliminaryValue: {
          dependencyType: "stateVariable",
          variableName: "preliminaryValue"
        }
      }),
      definition: function ({ dependencyValues }) {

        let value = findClosestValidValue(dependencyValues);

        //The text value might not match so choose the first item
        let index = 0;

        if (value !== undefined) {
          index = dependencyValues.valueToIndex[value];
        }

        return { newValues: { index } }

      }

    }

    stateVariableDefinitions.value = {
      public: true,
      returnDependencies: () => ({
        sliderType: {
          dependencyType: "stateVariable",
          variableName: "sliderType"
        },
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        },
        index: {
          dependencyType: "stateVariable",
          variableName: "index"
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: { value: dependencyValues.items[dependencyValues.index] },
          makeEssential: ["value"],
          setComponentType: { value: dependencyValues.sliderType },
        }
      },
      inverseDefinition: invertSliderValue,
    }

    stateVariableDefinitions.markers = {
      returnDependencies: () => ({
        markersChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneMarkers",
          variableNames: ["markerType", "markers"]
        },
        sliderType: {
          dependencyType: "stateVariable",
          variableName: "sliderType"
        },
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        },
      }),
      definition: function ({ dependencyValues }) {
        let markers = [];

        if (dependencyValues.markersChild.length === 1) {

          let markerType = dependencyValues.markersChild[0].stateValues.markerType;

          if (markerType === 'empty') {
            //All Ticks become markers
            markers = [...dependencyValues.items];
          } else if (markerType !== dependencyValues.sliderType) {
            //Note: no markers when they don't match and not init
            console.warn("Markers type doesn't match slider type.");
            markers = [];
          } else {
            markers = dependencyValues.markersChild[0].stateValues.markers;
          }
        }

        return { newValues: { markers } }

      }
    }

    stateVariableDefinitions.disabled = {
      returnDependencies: () => ({
        collaborateGroups: {
          dependencyType: "stateVariable",
          variableName: "collaborateGroups"
        },
        collaboration: {
          dependencyType: "flag",
          flagName: "collaboration"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          disabled: !dependencyValues.collaborateGroups.matchGroup(dependencyValues.collaboration)
        }
      })
    }

    return stateVariableDefinitions;
  }


  changeValue({ value }) {
    if (!this.stateValues.disabled) {
      this.requestUpdate({
        updateType: "updateValue",
        updateInstructions: [{
          componentName: this.componentName,
          stateVariable: "value",
          value
        }]
      });
    }
  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    const actions = {
      changeValue: this.changeValue,
    }

    this.renderer = new this.availableRenderers.slider({
      actions: actions,
      key: this.componentName,
      index: this.stateValues.index,
      items: this.stateValues.items,
      sliderType: this.stateValues.sliderType,
      width: this.stateValues.width,
      height: this.stateValues.height,
      valueToIndex: this.stateValues.valueToIndex,
      markers: this.stateValues.markers,
      label: this.stateValues.label,
      showControls: this.stateValues.showControls,
      showTicks: this.stateValues.showTicks,
      disabled: this.stateValues.disabled,
    });
  }

  updateRenderer() {

    this.renderer.updateSlider({
      index: this.stateValues.index,
      items: this.stateValues.items,
      sliderType: this.stateValues.sliderType,
      width: this.stateValues.width,
      height: this.stateValues.height,
      valueToIndex: this.stateValues.valueToIndex,
      markers: this.stateValues.markers,
      label: this.stateValues.label,
      showControls: this.stateValues.showControls,
      showTicks: this.stateValues.showTicks,
      disabled: this.stateValues.disabled,
    })

  }

}

function findClosestValidValue({ preliminaryValue, valueToIndex, sliderType, items }) {

  let value = preliminaryValue;

  // first check if value is actually a known value
  let matchedIndex = valueToIndex[value];
  if (matchedIndex !== undefined) {
    return value;
  }

  // for text, we don't have a way to find the closest value
  if (sliderType === "text") {
    return undefined;
  }

  let findNextLargerIndex = function (minIndex = 0, maxIndex = items.length - 1) {
    if (maxIndex <= minIndex + 1) {
      if (value > items[minIndex]) {
        return maxIndex;
      }
      else {
        return minIndex;
      }
    }
    let midIndex = Math.round((maxIndex + minIndex) / 2);
    if (value > items[midIndex]) {
      return findNextLargerIndex(midIndex, maxIndex);
    }
    else {
      return findNextLargerIndex(minIndex, midIndex);
    }
  };
  let closeIndex = findNextLargerIndex();
  if (closeIndex === 0) {
    value = items[0];
  }
  else {
    let leftValue = items[closeIndex - 1];
    let rightValue = items[closeIndex];
    let leftDist = Math.abs(value - leftValue);
    let rightDist = Math.abs(value - rightValue);
    if (leftDist < rightDist) {
      value = leftValue;
    }
    else {
      value = rightValue;
    }
  }
  return value;
}

function invertSliderValue({ desiredStateVariableValues, stateValues }) {

  let newValue = findClosestValidValue({
    preliminaryValue: desiredStateVariableValues.value,
    valueToIndex: stateValues.valueToIndex,
    sliderType: stateValues.sliderType,
    items: stateValues.items
  });

  //Text value given by another component didn't match so can't update
  if (newValue === undefined) {
    return { success: false };
  } else {
    return {
      success: true,
      instructions: [
        {
          setStateVariable: "value",
          value: newValue
        },
        {
          setStateVariable: "preliminaryValue",
          value: newValue
        },
      ]
    }
  }

}
