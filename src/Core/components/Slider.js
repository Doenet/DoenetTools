import { roundForDisplay } from '../utils/math';
import BaseComponent from './abstract/BaseComponent';
import me from 'math-expressions';

export default class Slider extends BaseComponent {
  constructor(args) {
    super(args);
    this.changeValue = this.changeValue.bind(this);

    this.actions = {
      changeValue: this.changeValue
    };
  }
  static componentType = "slider";

  static variableForPlainMacro = "value";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.type = {
      createPrimitiveOfType: "string",
      defaultValue: "number"
    };
    attributes.width = {
      createComponentOfType: "_componentSize",
      createStateVariable: "width",
      defaultValue: { size: 300, isAbsolute: true },
      public: true,
      forRenderer: true
    };
    attributes.height = {
      createComponentOfType: "_componentSize",
      createStateVariable: "height",
      defaultValue: { size: 100, isAbsolute: true },
      public: true,
      forRenderer: true
    };
    attributes.initialValue = {
      createComponentOfType: "_componentWithSelectableType",
      createStateVariable: "initialValue",
      defaultValue: undefined,
    }
    attributes.label = {
      createComponentOfType: "text",
      createStateVariable: "label",
      defaultValue: undefined,
      public: true,
      forRenderer: true
    };
    attributes.showControls = {
      createComponentOfType: "boolean",
      createStateVariable: "showControls",
      defaultValue: false,
      public: true,
      forRenderer: true
    };
    attributes.showTicks = {
      createComponentOfType: "boolean",
      createStateVariable: "showTicks",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.showValue = {
      createComponentOfType: "boolean",
      createStateVariable: "showValue",
      defaultValue: true,
      public: true,
      forRenderer: true
    };
    attributes.from = {
      createComponentOfType: "number",
      createStateVariable: "from",
      defaultValue: 0,
      public: true,
      forRenderer: true
    };
    attributes.to = {
      createComponentOfType: "number",
      createStateVariable: "to",
      defaultValue: 10,
      public: true,
      forRenderer: true
    };
    attributes.step = {
      createComponentOfType: "number",
      createStateVariable: "step",
      defaultValue: 1,
      public: true,
      forRenderer: true
    };

    attributes.displayDigits = {
      createComponentOfType: "integer",
      createStateVariable: "displayDigits",
      defaultValue: 10,
      public: true,
    };

    attributes.displayDecimals = {
      createComponentOfType: "integer",
      createStateVariable: "displayDecimals",
      defaultValue: null,
      public: true,
    };
    attributes.displaySmallAsZero = {
      createComponentOfType: "number",
      createStateVariable: "displaySmallAsZero",
      valueForTrue: 1E-14,
      valueForFalse: 0,
      defaultValue: 0,
      public: true,
    };

    return attributes;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroNumbers = childLogic.newLeaf({
      name: "atLeastZeroNumbers",
      componentType: 'number',
      comparison: 'atLeast',
      number: 0,
    });
    let atLeastZeroTexts = childLogic.newLeaf({
      name: "atLeastZeroTexts",
      componentType: 'text',
      comparison: 'atLeast',
      number: 0,
    });


    let numbersAndTexts = childLogic.newOperator({
      name: "numbersAndTexts",
      operator: 'and',
      propositions: [atLeastZeroTexts, atLeastZeroNumbers],
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
      propositions: [numbersAndTexts, atMostOneMarkers],
      setAsBase: true,
    });


    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.type = {
      forRenderer: true,
      returnDependencies: () => ({
        type: {
          dependencyType: "attribute",
          attributeName: "type",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.type) {
          let type = dependencyValues.type.toLowerCase()
          if (["number", "text"].includes(type)) {
            return { newValues: { type } };
          } else {
            console.warn(`Invalid type ${dependencyValues.type} of a slider.  Defaulting to number.`)
          }
        }
        return { newValues: { type: "number" } };
      },
    };

    stateVariableDefinitions.items = {
      forRenderer: true,
      public: true,
      hasVariableComponentType: true,
      // isArray: true,
      // entryPrefixes: ["item"],
      // entireArrayAtOnce: true,
      returnDependencies: () => ({
        numberAndTextChildren: {
          dependencyType: "child",
          childLogicName: "numbersAndTexts",
          variableNames: ["value"]
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let items = [];

        // Note: if no numberAndTextChildren, items will be empty.
        // If, in additional, type="number", will use from/to/step attributes
        // to determine items implicitly

        if (dependencyValues.type === "text") {
          for(let child of dependencyValues.numberAndTextChildren) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "text"
            })) {
              items.push(child.stateValues.value)
            } else {
              // number child
              items.push(child.stateValues.value.toString())
            }
          }
        } else if (dependencyValues.numberAndTextChildren.length > 0) {

          for(let child of dependencyValues.numberAndTextChildren) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "number"
            })) {
              items.push(child.stateValues.value)
            } else {
              // text child
              let num = Number(child.stateValues.value)
              if(Number.isFinite(num)) {
                items.push(num);
              }
            }
          }
          items.sort((a, b) => { return a - b; }); //sort in number order
        }

        return {
          newValues: { items },
          setComponentType: { items: dependencyValues.type },
        };
      }
    }


    stateVariableDefinitions.nItems = {
      forRenderer: true,
      public: true,
      componentType: "integer",
      returnDependencies: () => ({
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        to: {
          dependencyType: "stateVariable",
          variableName: "to"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        }
      }),
      definition({ dependencyValues }) {
        let nItems = dependencyValues.items.length;

        if (nItems === 0 && dependencyValues.type ===  "number") {
          // Note: add 1E-10 before taking floor
          // to make sure round-off error doesn't reduce number of items
          nItems = Math.floor((dependencyValues.to - dependencyValues.from) / dependencyValues.step + 1E-10) + 1;
          if (!(nItems >= 0 && Number.isFinite(nItems))) {
            nItems = 0;
          }
        }

        return { newValues: { nItems } }
      }
    }

    stateVariableDefinitions.firstItem = {
      forRenderer: true,
      returnDependencies: () => ({
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
      }),
      definition({ dependencyValues }) {

        let firstItem;

        if(dependencyValues.items.length > 0) {
          firstItem = dependencyValues.items[0];
        } else if(dependencyValues.type==="number") {
          firstItem = dependencyValues.from
        } else {
          firstItem = null;  // text with no children
        }

        return { newValues: { firstItem } }
      }
    }

    stateVariableDefinitions.lastItem = {
      forRenderer: true,
      returnDependencies: () => ({
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        nItems: {
          dependencyType: "stateVariable",
          variableName: "nItems"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
      }),
      definition({ dependencyValues }) {

        let lastItem;

        if (dependencyValues.items.length > 0) {
          lastItem = dependencyValues.items[dependencyValues.items.length - 1];
        } else if(dependencyValues.type === "number") {
          lastItem = dependencyValues.from + (dependencyValues.nItems - 1) * dependencyValues.step;
        } else {
          lastItem = null;   // text with no children
        }

        return { newValues: { lastItem } }
      }
    }


    stateVariableDefinitions.valueToIndex = {
      forRenderer: true,
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
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        initialValue: {
          dependencyType: "stateVariable",
          variableName: "initialValue"
        },
      }),
      definition({ dependencyValues }) {
        return {
          useEssentialOrDefaultValue: {
            preliminaryValue: {
              variablesToCheck: "value",
              get defaultValue() {
                return dependencyValues.initialValue;
              }
            }
          }
        }
      },
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "preliminaryValue",
            value: desiredStateVariableValues.preliminaryValue
          }]
        }
      }
    }

    stateVariableDefinitions.index = {
      forRenderer: true,
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
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
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
        nItems: {
          dependencyType: "stateVariable",
          variableName: "nItems"
        }
      }),
      definition: function ({ dependencyValues }) {

        let index = findIndexOfClosestValidValue(dependencyValues);

        //The text value might not match so choose the first item
        if (index === undefined) {
          index = 0;
        }

        return { newValues: { index } }

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues }) {

        if (dependencyValues.items.length === 0) {
          // values specified by from, to, step

          let from = dependencyValues.from;
          let step = dependencyValues.step;

          let ind = desiredStateVariableValues.index;
          if (!Number.isInteger(ind)) {
            return { success: false };
          }

          if (ind >= 0 && ind < dependencyValues.nItems) {
            return {
              success: true,
              instructions: [{
                setDependency: "preliminaryValue",
                desiredValue: from + ind * step
              }]
            }
          } else {
            return { success: false };
          }

        }


        let desiredValue = dependencyValues.items[desiredStateVariableValues.index];

        if (desiredValue === undefined) {
          return { success: false };
        }

        return {
          success: true,
          instructions: [{
            setDependency: "preliminaryValue",
            desiredValue
          }]
        }

      }

    }

    stateVariableDefinitions.value = {
      forRenderer: true,
      public: true,
      essential: true,
      hasVariableComponentType: true,
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
        },
        items: {
          dependencyType: "stateVariable",
          variableName: "items"
        },
        index: {
          dependencyType: "stateVariable",
          variableName: "index"
        },
        from: {
          dependencyType: "stateVariable",
          variableName: "from"
        },
        step: {
          dependencyType: "stateVariable",
          variableName: "step"
        },
      }),
      definition: function ({ dependencyValues }) {
        let value;
        if (dependencyValues.items.length > 0) {
          value = dependencyValues.items[dependencyValues.index];
        } else {
          // value determined by from,to,step
          value = dependencyValues.from + dependencyValues.step * dependencyValues.index;
        }

        return {
          newValues: { value },
          setComponentType: { value: dependencyValues.type },
        }

      },
      inverseDefinition: invertSliderValue,
    }

    stateVariableDefinitions.valueForDisplay = {
      forRenderer: true,
      returnDependencies: () => ({
        value: {
          dependencyType: "stateVariable",
          variableName: "value"
        },
        displayDigits: {
          dependencyType: "stateVariable",
          variableName: "displayDigits"
        },
        displayDecimals: {
          dependencyType: "stateVariable",
          variableName: "displayDecimals"
        },
        displaySmallAsZero: {
          dependencyType: "stateVariable",
          variableName: "displaySmallAsZero"
        },
      }),
      definition: function ({ dependencyValues, usedDefault }) {
        // for display via latex and text, round any decimal numbers to the significant digits
        // determined by displaydigits or displaydecimals
        let rounded = roundForDisplay({
          value: dependencyValues.value,
          dependencyValues, usedDefault
        });

        return {
          newValues: {
            valueForDisplay: rounded.tree
          }
        }
      }
    }



    stateVariableDefinitions.markers = {
      forRenderer: true,
      returnDependencies: () => ({
        markersChild: {
          dependencyType: "child",
          childLogicName: "atMostOneMarkers",
          variableNames: ["markerType", "markers"]
        },
        type: {
          dependencyType: "stateVariable",
          variableName: "type"
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
          } else if (markerType !== dependencyValues.type) {
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

    // stateVariableDefinitions.disabled = {
    //   forRenderer: true,
    //   returnDependencies: () => ({
    //     // collaborateGroups: {
    //     //   dependencyType: "stateVariable",
    //     //   variableName: "collaborateGroups"
    //     // },
    //     // collaboration: {
    //     //   dependencyType: "flag",
    //     //   flagName: "collaboration"
    //     // }
    //   }),
    //   definition: ({ dependencyValues }) => ({
    //     newValues: {
    //       // disabled: !dependencyValues.collaborateGroups.matchGroup(dependencyValues.collaboration)
    //       disabled: false
    //     }
    //   })
    // }

    return stateVariableDefinitions;
  }


  changeValue({ value, transient }) {
    if (!this.stateValues.disabled) {
      if (transient) {
        this.coreFunctions.requestUpdate({
          updateInstructions: [{
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "value",
            value
          }],
          transient
        });
      } else {
        this.coreFunctions.requestUpdate({
          updateInstructions: [{
            updateType: "updateValue",
            componentName: this.componentName,
            stateVariable: "value",
            value
          }],
          event: {
            verb: "selected",
            object: {
              componentName: this.componentName,
              componentType: this.componentType,
            },
            result: {
              response: value,
              responseText: value.toString()
            }
          }
        });
      }
    }
  }


}

function findIndexOfClosestValidValue({ preliminaryValue, valueToIndex,
  type, items,
  from, step, nItems,
}) {

  let value = preliminaryValue;

  if (items.length === 0) {
    // values specified by from, to, step
    if (!Number.isFinite(value)) {
      return undefined;
    }

    let ind = Math.round((value - from) / step);

    if (ind >= 0) {
      if (ind < nItems) {
        return ind;
      } else {
        return nItems - 1;
      }
    } else {
      return 0;
    }

  }

  // first check if value is actually a known value
  let matchedIndex = valueToIndex[value];
  if (matchedIndex !== undefined) {
    return matchedIndex;
  }

  // for text, we don't have a way to find the closest value
  if (type === "text") {
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
  if (closeIndex !== 0) {
    let leftValue = items[closeIndex - 1];
    let rightValue = items[closeIndex];
    let leftDist = Math.abs(value - leftValue);
    let rightDist = Math.abs(value - rightValue);
    if (leftDist < rightDist) {
      closeIndex--;
    }
  }
  return closeIndex;
}

function invertSliderValue({ desiredStateVariableValues, stateValues }) {

  // console.log(`invert slider value`)
  // console.log(desiredStateVariableValues)
  // console.log(stateValues);

  let preliminaryValue = desiredStateVariableValues.value;
  if(stateValues.type === "text") {
    preliminaryValue = preliminaryValue.toString();
  } else {
    if(preliminaryValue instanceof me.class) {
      preliminaryValue = preliminaryValue.evaluate_to_constant();
      if(preliminaryValue === null) {
        return {success: false}
      }
    } else {
      preliminaryValue = Number(preliminaryValue);
    }
  }

  let newIndex = findIndexOfClosestValidValue({
    preliminaryValue,
    valueToIndex: stateValues.valueToIndex,
    type: stateValues.type,
    items: stateValues.items,
    from: stateValues.from,
    step: stateValues.step,
    nItems: stateValues.nItems
  });

  // Text value requested didn't match so can't update
  if (newIndex === undefined) {
    return { success: false };
  } else {
    return {
      success: true,
      instructions: [{
        setDependency: "index",
        desiredValue: newIndex
      }]
    }
  }

}