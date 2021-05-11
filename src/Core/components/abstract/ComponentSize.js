import BaseComponent from './BaseComponent';

export class ComponentSize extends BaseComponent {
  static componentType = "_componentSize";
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

    // let componentType = this.componentType;

    stateVariableDefinitions.value = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: ["isAbsolute"],
      returnDependencies: () => ({
        componentSizeChild: {
          dependencyType: "child",
          childLogicName: "atMostOneComponentSize",
          variableNames: ["value", "isAbsolute"]
        },
        numberChild: {
          dependencyType: "child",
          childLogicName: "atMostOneNumber",
          variableNames: ["value"]
        },
        stringChild: {
          dependencyType: "child",
          childLogicName: "atMostOneString",
          variableNames: ["value"]
        },
        parentDefaultAbsoluteSize: {
          dependencyType: "parentStateVariable",
          variableName: "defaultAbsoluteSize"
        }
      }),
      definition({ dependencyValues }) {

        // console.log('value dependencyValues')
        // console.log(dependencyValues);

        let defaultIsAbsolute = dependencyValues.parentDefaultAbsoluteSize === undefined ? false : dependencyValues.parentDefaultAbsoluteSize;

        if (dependencyValues.stringChild.length === 0) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.componentSizeChild.length === 0) {
              return {
                useEssentialOrDefaultValue: {
                  value: { variablesToCheck: "value", defaultValue: 100 },
                  isAbsolute: { variablesToCheck: "isAbsolute", defaultValue: defaultIsAbsolute }
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

            let result = dependencyValues.stringChild[0].stateValues.value.trim().match(/^(-?[\d.]+)\s*(.*)$/);
            if (result === null) {
              // console.warn(componentType + " must begin with a number.");
              return { newValues: { value: null, isAbsolute: defaultIsAbsolute } };
            }
            originalValue = result[1];
            originalUnit = result[2].trim();
          }

          originalValue = Number(originalValue);
          if (!Number.isFinite(originalValue)) {
            // console.warn(componentType + " must have a number");
            return { newValues: { value: null, isAbsolute: defaultIsAbsolute } };
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
            // console.warn(originalUnit + ' is not a defined unit of measure.');
            return { newValues: { value: originalValue, isAbsolute: defaultIsAbsolute } };
          }
          let value = conversionFactor[originalUnit] * originalValue;

          // console.log(`value: ${value}, isAbsolute: ${isAbsolute}`);

          return {
            newValues: { value, isAbsolute }
          }

        }

      },
      inverseDefinition({ desiredStateVariableValues, dependencyValues, stateValues }) {
        if (dependencyValues.stringChild.length === 0) {
          if (dependencyValues.numberChild.length === 0) {
            if (dependencyValues.componentSizeChild.length === 0) {

              return {
                success: true,
                instructions: [{
                  setStateVariable: "value",
                  value: desiredStateVariableValues.value
                }]
              }
            } else {
              //only componentSize child

              return {
                success: true,
                instructions: [{
                  setDependency: "componentSizeChild",
                  desiredValue: desiredStateVariableValues.value,
                  childIndex: 0,
                  variableIndex: 0
                }]
              }
            }
          } else {
            //only number child

            return {
              success: true,
              instructions: [{
                setDependency: "numberChild",
                desiredValue: desiredStateVariableValues.value,
                childIndex: 0,
                variableIndex: 0
              }]
            }
          }
        } else {
          //string child

          if (dependencyValues.numberChild.length === 1) {
            //string and number child

            let instructions = [{
              setDependency: "numberChild",
              desiredValue: desiredStateVariableValues.value,
              childIndex: 0,
              variableIndex: 0
            }];

            if (stateValues.isAbsolute) {
              instructions.push({
                setDependency: "stringChild",
                desiredValue: "px",
                childIndex: 0,
                variableIndex: 0
              })
            } else {
              instructions.push({
                setDependency: "stringChild",
                desiredValue: "%",
                childIndex: 0,
                variableIndex: 0
              })
            }

            return {
              success: true,
              instructions
            }

          } else {
            //only string child

            if (stateValues.isAbsolute) {

              return {
                success: true,
                instructions: [{
                  setDependency: "stringChild",
                  desiredValue: desiredStateVariableValues.value + "px",
                  childIndex: 0,
                  variableIndex: 0
                }]
              }
            } else {
              return {
                success: true,
                instructions: [{
                  setDependency: "stringChild",
                  desiredValue: desiredStateVariableValues.value + "%",
                  childIndex: 0,
                  variableIndex: 0
                }]
              }
            }
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

export class ComponentSizeList extends BaseComponent {
  static componentType = "_componentSizeList";
  static rendererType = "asList";
  static renderChildren = true;

  // when another component has a attribute that is a componentSizeList,
  // use the componentSizes state variable to populate that attribute
  static stateVariableForAttributeValue = "componentSizes";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.unordered = {
      createComponentOfType: "boolean",
      createStateVariable: "unordered",
      defaultValue: false,
      public: true,
    };

    attributes.maximumNumber = {
      createComponentOfType: "number",
      createStateVariable: "maximumNumber",
      defaultValue: null,
      public: true,
    };

    return attributes;
  }


  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsIntoComponentSizesBySpaces = function ({ matchedChildren }) {

      // break any string by white space and wrap pieces with componentSize

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (c.componentType === "string") {
          return [
            ...a,
            ...c.state.value.split(/\s+/)
              .filter(s => s)
              .map(s => ({
                componentType: "_componentSize",
                children: [{ componentType: "string", state: { value: s } }]
              }))
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
      replacementFunction: breakStringsIntoComponentSizesBySpaces
    });

    return sugarInstructions;

  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroComponentSizes = childLogic.newLeaf({
      name: "atLeastZeroComponentSizes",
      componentType: '_componentSize',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroComponentSizeLists = childLogic.newLeaf({
      name: "atLeastZeroComponentSizeLists",
      componentType: '_componentSizeList',
      comparison: 'atLeast',
      number: 0
    });

    childLogic.newOperator({
      name: "componentSizeAndComponentSizeLists",
      operator: "and",
      propositions: [atLeastZeroComponentSizes, atLeastZeroComponentSizeLists],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    // set overrideChildHide so that children are hidden
    // only based on whether or not the list is hidden
    // so that can't have a list with partially hidden components
    stateVariableDefinitions.overrideChildHide = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { overrideChildHide: true } })
    }

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies() {
        return {
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber",
          },
          componentSizeListChildren: {
            dependencyType: "child",
            childLogicName: "atLeastZeroComponentSizeLists",
            variableNames: ["nComponents"],
          },
          componentSizeAndComponentSizeListChildren: {
            dependencyType: "child",
            childLogicName: "componentSizeAndComponentSizeLists",
            skipComponentNames: true,
          },
        }
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let nComponents = 0;
        let childIndexByArrayKey = [];

        let nComponentSizeLists = 0;
        for (let [childInd, child] of dependencyValues.componentSizeAndComponentSizeListChildren.entries()) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "componentSizeList"
          })) {
            let componentSizeListChild = dependencyValues.componentSizeListChildren[nComponentSizeLists];
            nComponentSizeLists++;
            for (let i = 0; i < componentSizeListChild.stateValues.nComponents; i++) {
              childIndexByArrayKey[nComponents + i] = [childInd, i];
            }
            nComponents += componentSizeListChild.stateValues.nComponents;

          } else {
            childIndexByArrayKey[nComponents] = [childInd, 0];
            nComponents += 1;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && nComponents > maxNum) {
          nComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          newValues: { nComponents, childIndexByArrayKey },
          checkForActualChange: { nComponents: true }
        }
      }
    }

    stateVariableDefinitions.componentSizes = {
      additionalStateVariablesDefined: [{
        variableName: "areAbsolute",
        public: true,
        isArray: true,
        componentType: "boolean",
        entryPrefixes: ["isAbsolute"]
      }],
      public: true,
      componentType: "number",
      isArray: true,
      entryPrefixes: ["componentSize"],
      stateVariablesDeterminingDependencies: ["childIndexByArrayKey"],
      returnArraySizeDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {}
        let globalDependencies = {
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey"
          }
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let componentSizeIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            componentSizeIndex = stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            componentSizeAndComponentSizeListChildren: {
              dependencyType: "child",
              childLogicName: "componentSizeAndComponentSizeLists",
              variableNames: ["value", "componentSize" + componentSizeIndex, "isAbsolute", "isAbsolute" + componentSizeIndex],
              variablesOptional: true,
              childIndices,
            },
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let componentSizes = {};
        let areAbsolute = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].componentSizeAndComponentSizeListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              componentSizes[arrayKey] = child.stateValues.value;
              areAbsolute[arrayKey] = child.stateValues.isAbsolute;
            } else {
              let componentSizeIndex = globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              componentSizes[arrayKey] = child.stateValues["componentSize" + componentSizeIndex];
              areAbsolute[arrayKey] = child.stateValues["isAbsolute" + componentSizeIndex];
            }

          }

        }

        return { newValues: { componentSizes, areAbsolute } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.componentSizes) {

          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child = dependencyValuesByKey[arrayKey].componentSizeAndComponentSizeListChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].componentSizeAndComponentSizeListChildren,
                desiredValue: desiredStateVariableValues.componentSizes[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });

            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].componentSizeAndComponentSizeListChildren,
                desiredValue: desiredStateVariableValues.componentSizes[arrayKey],
                childIndex: 0,
                variableIndex: 1,
              });

            }
          }
        }

        return {
          success: true,
          instructions
        }


      }
    }

    stateVariableDefinitions.nValues = {
      isAlias: true,
      targetVariableName: "nComponents"
    };

    stateVariableDefinitions.values = {
      isAlias: true,
      targetVariableName: "componentSizes"
    };



    // stateVariableDefinitions.childrenToRender = {
    //   returnDependencies: () => ({
    //     componentSizeAndComponentSizeListChildren: {
    //       dependencyType: "child",
    //       childLogicName: "componentSizeAndComponentSizeLists",
    //       variableNames: ["childrenToRender"],
    //       variablesOptional: true,
    //     },
    //     maximumNumber: {
    //       dependencyType: "stateVariable",
    //       variableName: "maximumNumber",
    //     },
    //   }),
    //   definition: function ({ dependencyValues, componentInfoObjects }) {

    //     let childrenToRender = [];

    //     for (let child of dependencyValues.componentSizeAndComponentSizeListChildren) {
    //       if (componentInfoObjects.isInheritedComponentType({
    //         inheritedComponentType: child.componentType,
    //         baseComponentType: "componentSizeList"
    //       })) {
    //         childrenToRender.push(...child.stateValues.childrenToRender);
    //       } else {
    //         childrenToRender.push(child.componentName);
    //       }
    //     }

    //     let maxNum = dependencyValues.maximumNumber;
    //     if (maxNum !== null && childrenToRender.length > maxNum) {
    //       maxNum = Math.max(0, Math.floor(maxNum));
    //       childrenToRender = childrenToRender.slice(0, maxNum)
    //     }

    //     return { newValues: { childrenToRender } }

    //   }
    // }

    return stateVariableDefinitions;
  }

}