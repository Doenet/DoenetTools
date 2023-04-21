import BaseComponent from './abstract/BaseComponent';
import {
  returnBreakStringsSugarFunction, breakEmbeddedStringsIntoParensPieces
} from './commonsugar/breakstrings';

export class Extremum extends BaseComponent {
  static componentType = "extremum";
  static rendererType = undefined;


  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.location = {
      createComponentOfType: "math"
    }
    attributes.value = {
      createComponentOfType: "math"
    }

    return attributes;

  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakIntoLocationValueByCommas = function ({ matchedChildren }) {
      let childrenToComponentFunction = x => ({
        componentType: "math", children: x
      });

      let breakFunction = returnBreakStringsSugarFunction({
        childrenToComponentFunction,
        mustStripOffOuterParentheses: true
      })

      let result = breakFunction({ matchedChildren });

      if (!result.success && matchedChildren.length === 1) {
        // if didn't succeed and just have a single string child,
        // then just wrap string with a value
        return {
          success: true,
          newAttributes: {
            value: {
              component: {
                componentType: "math",
                children: matchedChildren
              }
            }
          }
        }
      }

      if (result.success) {
        if (result.newChildren.length === 1) {
          // one component is a value
          return {
            success: true,
            newAttributes: {
              value: {
                component: result.newChildren[0]
              }
            }
          }
        } else if (result.newChildren.length === 2) {
          // two components is a location and value

          let locationComponent = result.newChildren[0];
          let valueComponent = result.newChildren[1];

          let newAttributes = {
            location: {
              component: locationComponent
            },
            value: {
              component: valueComponent
            }
          }

          // remove components that are empty
          if (locationComponent.children.length === 0 ||
            (
              locationComponent.children.length === 1 &&
              typeof locationComponent.children[0] === "string" &&
              locationComponent.children[0].trim() === ""
            )
          ) {
            delete newAttributes.location;
          }

          if (valueComponent.children.length === 0 ||
            (
              valueComponent.children.length === 1 &&
              typeof valueComponent.children[0] === "string" &&
              valueComponent.children[0].trim() === ""
            )
          ) {
            delete newAttributes.value;
          }

          return {
            success: true,
            newAttributes
          }


        } else {
          return { success: false }
        }
      }

      return result;

    };

    sugarInstructions.push({
      childrenRegex: /s+(.*s)?/,
      replacementFunction: breakIntoLocationValueByCommas
    })

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "points",
      componentTypes: ["point"]
    }]

  }


  static returnStateVariableDefinitions({ numerics }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ numerics });

    let componentClass = this;

    stateVariableDefinitions.value = {
      public: true,
      shadowingInstructions: {
        createComponentOfType: "math",
      },
      defaultValue: null,
      hasEssential: true,
      additionalStateVariablesDefined: [{
        variableName: "location",
        public: true,
        shadowingInstructions: {
          createComponentOfType: "math",
        },
        defaultValue: null,
        hasEssential: true,
      }],
      returnDependencies: () => ({
        extremumChild: {
          dependencyType: "child",
          childGroups: ["points"],
          variableNames: ["nDimensions", "xs"]
        },
        location: {
          dependencyType: "attributeComponent",
          attributeName: "location",
          variableNames: ["value"]
        },
        value: {
          dependencyType: "attributeComponent",
          attributeName: "value",
          variableNames: ["value"]
        },
      }),
      definition: function ({ dependencyValues }) {
        let location, value;

        if (dependencyValues.extremumChild.length > 0) {
          let extremumChild = dependencyValues.extremumChild[0];
          if (extremumChild.stateValues.nDimensions !== 2) {
            console.log("Cannot determine " + componentClass.componentType + " from a point that isn't 2D");
            location = null;
            value = null;
          } else {
            location = extremumChild.stateValues.xs[0];
            value = extremumChild.stateValues.xs[1];
          }
        } else {
          if (dependencyValues.location !== null) {
            location = dependencyValues.location.stateValues.value;
          }
          if (dependencyValues.value !== null) {
            value = dependencyValues.value.stateValues.value;
          }
        }

        let setValue = {};
        let useEssentialOrDefaultValue = {};
        let haveNewValues = false;
        let haveEssential = false;
        if (location === undefined) {
          useEssentialOrDefaultValue.location = true
          haveEssential = true;
        } else {
          setValue.location = location;
          haveNewValues = true;
        }

        if (value === undefined) {
          useEssentialOrDefaultValue.value = true
          haveEssential = true;
        } else {
          setValue.value = value;
          haveNewValues = true;
        }

        let result = {};
        if (haveNewValues) {
          result.setValue = setValue;
        }
        if (haveEssential) {
          result.useEssentialOrDefaultValue = useEssentialOrDefaultValue;
        }

        return result;
      }
    }

    return stateVariableDefinitions;

  }

}

// export class Maximum extends Extremum {
//   static componentType = "maximum";
// }

// export class Minimum extends Extremum {
//   static componentType = "minimum";
// }

export class Extrema extends BaseComponent {
  static componentType = "extrema";
  static rendererType = undefined;
  static componentTypeSingular = "extremum"
  static get componentTypeCapitalized() {
    return this.componentType.charAt(0).toUpperCase() + this.componentType.slice(1);
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();
    let extremaClass = this;


    let createExtremumList = function ({ matchedChildren }) {

      let results = breakEmbeddedStringsIntoParensPieces({
        componentList: matchedChildren,
      });

      if (results.success !== true) {
        return { success: false }
      }

      return {
        success: true,
        newChildren: results.pieces.map(function (piece) {
          if (piece.length > 1 || typeof piece[0] === "string") {
            return {
              componentType: extremaClass.componentTypeSingular,
              children: piece
            }
          } else {
            return piece[0]
          }
        })
      }
    }

    sugarInstructions.push({
      // childrenRegex: /s+(.*s)?/,
      replacementFunction: createExtremumList
    });

    return sugarInstructions;

  }

  static returnChildGroups() {

    return [{
      group: "extrema",
      componentTypes: [this.componentTypeSingular]
    }, {
      group: "points",
      componentTypes: ["point"]
    }]

  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();
    let extremaClass = this;

    stateVariableDefinitions["n" + extremaClass.componentTypeCapitalized] = {
      additionalStateVariablesDefined: ["childIdentities"],
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childGroups: ["extrema", "points"],
        }
      }),
      definition: function ({ dependencyValues }) {
        let extremeVarName = "n" + extremaClass.componentTypeCapitalized;
        return {
          setValue: {
            [extremeVarName]: dependencyValues.children.length,
            childIdentities: dependencyValues.children,
          },
        }
      }
    }

    stateVariableDefinitions[extremaClass.componentType] = {
      isArray: true,
      nDimensions: 2,
      isLocation: true,
      entryPrefixes: [
        extremaClass.componentTypeSingular,
        extremaClass.componentTypeSingular + "Locations",
        extremaClass.componentTypeSingular + "Location",
        extremaClass.componentTypeSingular + "Values",
        extremaClass.componentTypeSingular + "Value"
      ],
      stateVariablesDeterminingDependencies: ["childIdentities"],
      getArrayKeysFromVarName({ arrayEntryPrefix, varEnding, arraySize }) {
        if ([
          extremaClass.componentTypeSingular,
          extremaClass.componentTypeSingular + "Location",
          extremaClass.componentTypeSingular + "Value"
        ].includes(arrayEntryPrefix)) {
          let extremumInd = Number(varEnding) - 1;
          if (Number.isInteger(extremumInd) && extremumInd >= 0) {
            // If not given the array size,
            // then return the array keys assuming the array is large enough.
            // Must do this as it is used to determine potential array entries.
            if (!arraySize || extremumInd < arraySize[0]) {
              if (arrayEntryPrefix === extremaClass.componentTypeSingular) {
                return [extremumInd + ",0", extremumInd + ",1"];
              } else if (arrayEntryPrefix === extremaClass.componentTypeSingular + "Location") {
                return [extremumInd + ",0"]
              } else {
                return [extremumInd + ",1"]
              }
            } else {
              return []
            }
          } else {
            return [];
          }
        } else if (arrayEntryPrefix === extremaClass.componentTypeSingular + "Locations") {
          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,0"]
          }

          // array of "i,0"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",0")
        } else if (arrayEntryPrefix === extremaClass.componentTypeSingular + "Values") {

          if (varEnding !== "") {
            return [];
          }

          if (!arraySize) {
            // if don't have arraySize, just use first point assuming array size is large enough
            return ["0,1"]
          }

          // array of "i,1"", where i=0, ..., arraySize[0]-1
          return Array.from(Array(arraySize[0]), (_, i) => i + ",1")
        } else {
          return [];
        }

      },
      arrayVarNameFromArrayKey(arrayKey) {
        let [ind1, ind2] = arrayKey.split(',');

        if (ind2 === "0") {
          return extremaClass.componentTypeSingular + "Location" + (Number(ind1) + 1)
        } else {
          return extremaClass.componentTypeSingular + "Value" + (Number(ind1) + 1)
        }
      },
      arrayVarNameFromPropIndex(propIndex, varName) {
        if (varName === extremaClass.componentType) {
          if (propIndex.length === 1) {
            return extremaClass.componentTypeSingular + propIndex[0];
          } else {
            // if propIndex has additional entries, ignore them
            let componentNum = Number(propIndex[0]);
            if (Number.isInteger(componentNum) && componentNum > 0) {
              if (propIndex[1] === 1) {
                return extremaClass.componentTypeSingular + "Location" + componentNum
              } else if (propIndex[1] === 2) {
                return extremaClass.componentTypeSingular + "Value" + componentNum
              }
            }
            return null;
          }
        }
        if (varName === extremaClass.componentTypeSingular + "Locations") {
          // if propIndex has additional entries, ignore them
          return extremaClass.componentTypeSingular + "Location" + propIndex[0];
        }
        if (varName === extremaClass.componentTypeSingular + "Values") {
          // if propIndex has additional entries, ignore them
          return extremaClass.componentTypeSingular + "Value" + propIndex[0];
        }
        let typeLen = extremaClass.componentTypeSingular.length;
        if (varName.slice(0, typeLen) === extremaClass.componentTypeSingular) {
          // could be extremaClass.componentTypeSingular, or with "Location" or "Value" appended
          let componentNum = Number(varName.slice(typeLen));
          if (Number.isInteger(componentNum) && componentNum > 0) {
            // if propIndex has additional entries, ignore them
            if (propIndex[0] === 1) {
              return extremaClass.componentTypeSingular + "Location" + componentNum
            } else if (propIndex[0] === 2) {
              return extremaClass.componentTypeSingular + "Value" + componentNum
            }
          }
        }
        return null;
      },
      returnArraySizeDependencies: () => ({
        nChildren: {
          dependencyType: "stateVariable",
          variableName: "n" + extremaClass.componentTypeCapitalized,
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nChildren, 2];
      },
      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          let [extremumInd, dim] = arrayKey.split(',');
          let varName;
          if (stateValues.childIdentities[extremumInd].componentType === extremaClass.componentTypeSingular) {
            varName = Number(dim) === 0 ? "location" : "value"
          } else {
            varName = "x" + (Number(dim) + 1);
          }
          dependenciesByKey[arrayKey] = {
            child: {
              dependencyType: "child",
              childGroups: ["extrema", "points"],
              variableNames: [varName],
              childIndices: [extremumInd],
            }
          }
        }

        return { dependenciesByKey };

      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log(`array definition of ${extremaClass.componentType} for ${extremaClass.componentType}`)
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let extrema = {};

        for (let arrayKey of arrayKeys) {

          let child = dependencyValuesByKey[arrayKey].child[0];
          if (child) {
            let dim = arrayKey.split(',')[1];
            let varName = Number(dim) === 0 ? "location" : "value"
            if (varName in child.stateValues) {
              extrema[arrayKey] = child.stateValues[varName];
            } else {
              extrema[arrayKey] = child.stateValues["x" + (Number(dim) + 1)]
            }
          }
        }

        return { setValue: { [extremaClass.componentType]: extrema } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey
      }) {

        // console.log('array inverse definition of points of pointlist')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues[extremaClass.componentType]) {

          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].extremumChild,
            desiredValue: desiredStateVariableValues[extremaClass.componentType][arrayKey],
            childIndex: 0,
            variableIndex: 0
          })

        }

        return {
          success: true,
          instructions
        }

      }
    }

    return stateVariableDefinitions;

  }

}

// export class Maxima extends Extrema {
//   static componentType = "maxima";
//   static componentTypeSingular = "maximum"
// }

// export class Minima extends Extrema {
//   static componentType = "minima";
//   static componentTypeSingular = "minimum"
// }
