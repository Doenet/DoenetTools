import { breakEmbeddedStringsIntoParensPieces } from '../commonsugar/breakstrings';
import BaseComponent from './BaseComponent';

export class ComponentWithSelectableType extends BaseComponent {
  static componentType = "_componentwithselectabletype";
  static rendererType = undefined;

  static acceptType = true;

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value", "type"] };

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    function addType({ matchedChildren, componentProps, parentProps }) {

      let type = componentProps.type;
      if (!type) {
        type = parentProps.type;
      }
      if (!type) {
        type = "number";
      } else if (!["number", "letters", "math", "text", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}, setting type to number`);
        type = "number";
      }

      // if already have a single child of the correct type
      // don't match sugar: child will be matched by atMostOneChild.
      if (matchedChildren.length === 1 && matchedChildren[0].componentType === type) {
        return { success: false }
      }

      return {
        success: true,
        newChildren: [{ componentType: type, children: matchedChildren }],
      }
    }

    sugarInstructions.push({
      replacementFunction: addType
    })

    return sugarInstructions;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atMostOneChild',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.type = {
      returnDependencies: () => ({
        type: {
          dependencyType: "doenetAttribute",
          attributeName: "type",
        },
        parentType: {
          dependencyType: "parentStateVariable",
          variableName: "type"
        }
      }),
      definition: function ({ dependencyValues, componentName }) {
        let type = dependencyValues.type;
        if (!type) {
          type = dependencyValues.parentType;
        }
        if (!type) {
          type = "number";
        } else if (!["number", "letters", "math", "text", "boolean"].includes(type)) {
          console.warn(`Invalid type ${type}, setting type to number`);
          type = "number";
        }

        return { newValues: { type } };

      },
    };


    stateVariableDefinitions.value = {
      public: true,
      returnDependencies: () => ({
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        atMostOneChild: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition({ dependencyValues }) {
        let value;

        if (dependencyValues.atMostOneChild.length === 1) {
          value = dependencyValues.atMostOneChild[0].stateValues.value;
        } else {
          value = null;
        }

        return {
          newValues: { value },
          setComponentType: { value: dependencyValues.type },
        };
      }
    }

    return stateVariableDefinitions;
  }

}


export class ComponentListWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentlistwithselectabletype";

  static acceptType = true;

  static returnSugarInstructions() {
    let sugarInstructions = [];

    function breakIntoTypesBySpacesAndAddType({ matchedChildren, componentProps, parentProps }) {

      let type = componentProps.type;
      if (!type) {
        type = parentProps.type;
      }
      if (!type) {
        type = "number";
      } else if (!["number", "letters", "math", "text", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}, setting type to number`);
        type = "number";
      }

      // break any string by white space
      matchedChildren = matchedChildren.reduce(function (a, c) {
        if (c.componentType === "string") {
          return [
            ...a,
            ...c.state.value.split(/\s+/)
              .filter(s => s)
              .map(s => ({ componentType: "string", state: { value: s } }))
          ]
        } else {
          return [...a, c]
        }
      }, []);

      // wrap components with type if they aren't that type already
      return {
        success: true,
        newChildren: matchedChildren.map(x => x.componentType === type ? x : ({ componentType: type, children: [x] })),
      }
    }

    sugarInstructions.push({
      replacementFunction: breakIntoTypesBySpacesAndAddType
    })


    return sugarInstructions;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: 'anythingForSelectedType',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'atLeast',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.value;

    stateVariableDefinitions.nValues = {
      returnDependencies: () => ({
        anythingForSelectedType: {
          dependencyType: "child",
          childLogicName: "anythingForSelectedType",
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { nValues: dependencyValues.anythingForSelectedType.length } }
      }
    }

    stateVariableDefinitions.values = {
      public: true,
      isArray: true,
      entryPrefixes: ["value"],
      returnArraySizeDependencies: () => ({
        nValues: {
          dependencyType: "stateVariable",
          variableName: "nValues",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nValues];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          type: {
            dependencyType: "stateVariable",
            variableName: "type"
          }
        }

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            anythingForSelectedType: {
              dependencyType: "child",
              childLogicName: "anythingForSelectedType",
              variableNames: ["value"],
              childIndices: [arrayKey]
            },
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        // console.log(`array definition for value of component list with selectable type`)
        // console.log(globalDependencyValues)
        // console.log(dependencyValuesByKey);
        // console.log(arrayKeys)

        let values = {};

        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].anythingForSelectedType &&
            dependencyValuesByKey[arrayKey].anythingForSelectedType.length === 1
          ) {
            values[arrayKey] = dependencyValuesByKey[arrayKey].anythingForSelectedType[0].stateValues.value
          }
        }

        return {
          newValues: { values },
          setComponentType: { values: globalDependencyValues.type },
        };
      }
    }

    stateVariableDefinitions.value = {
      isAlias: true,
      targetVariableName: "values"
    };

    return stateVariableDefinitions;
  }

}


export class ComponentListOfListsWithSelectableType extends ComponentWithSelectableType {
  static componentType = "_componentlistoflistswithselectabletype";
  static componentTypeSingular = "_componentlistwithselectabletype";
  static acceptType = true;

  static returnSugarInstructions() {
    let sugarInstructions = [];
    let listClass = this;

    let breakIntoListsByParensAndAddType = function ({ matchedChildren, componentProps, parentProps }) {

      let results = breakEmbeddedStringsIntoParensPieces({
        componentList: matchedChildren,
        removeParens: true,
      });

      if (results.success !== true) {
        return { success: false }
      }

      let type = componentProps.type;
      if (!type) {
        type = parentProps.type;
      }
      if (!type) {
        type = "number";
      } else if (!["number", "letters", "math", "text", "boolean"].includes(type)) {
        console.warn(`Invalid type ${type}, setting type to number`);
        type = "number";
      }


      return {
        success: true,
        newChildren: results.pieces.map(function (piece) {
          if (piece.length > 1 || piece[0].componentType === "string") {
            return {
              componentType: listClass.componentTypeSingular,
              props: { type: type },
              children: piece,
            }
          } else {
            return piece[0]
          }
        })
      }

    }

    sugarInstructions.push({
      replacementFunction: breakIntoListsByParensAndAddType
    })


    return sugarInstructions;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);
    childLogic.deleteAllLogic();

    childLogic.newLeaf({
      name: 'atLeastZeroLists',
      componentType: this.componentTypeSingular,
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    delete stateVariableDefinitions.value;

    stateVariableDefinitions.nLists = {
      returnDependencies: () => ({
        listChildren: {
          dependencyType: "child",
          childLogicName: "atLeastZeroLists",
        },
      }),
      definition({ dependencyValues }) {
        return { newValues: { nLists: dependencyValues.listChildren.length } }
      }
    }

    stateVariableDefinitions.lists = {
      isArray: true,
      entryPrefixes: ["list"],
      returnArraySizeDependencies: () => ({
        nLists: {
          dependencyType: "stateVariable",
          variableName: "nLists",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nLists];
      },
      returnArrayDependenciesByKey({ arrayKeys }) {
        let globalDependencies = {
          type: {
            dependencyType: "stateVariable",
            variableName: "type"
          }
        }

        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            listChildren: {
              dependencyType: "child",
              childLogicName: "atLeastZeroLists",
              variableNames: ["values", "type"],
              childIndices: [arrayKey]
            },
          }
        }

        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({ globalDependencyValues, dependencyValuesByKey, arrayKeys }) {

        let lists = {};

        for (let arrayKey of arrayKeys) {
          if (dependencyValuesByKey[arrayKey].listChildren &&
            dependencyValuesByKey[arrayKey].listChildren.length === 1
          ) {
            let listChild = dependencyValuesByKey[arrayKey].listChildren[0];
            if (listChild.stateValues.type === globalDependencyValues.type) {
              lists[arrayKey] = listChild.stateValues.values
            } else {
              // have a list child of the wrong type, attempt to convert
              if (globalDependencyValues.type === "number") {
                lists[arrayKey] = listChild.stateValues.values.map(Number)
              } else if (globalDependencyValues.type === "math") {
                lists[arrayKey] = listChild.stateValues.values.map(convertValueToMathExpression)
              } else if (globalDependencyValues.type === "boolean") {
                lists[arrayKey] = listChild.stateValues.values.map(Boolean)
              } else {
                // type is letters or text
                lists[arrayKey] = listChild.stateValues.values.map(String)
              }
            }
          }
        }

        return {
          newValues: { lists },
        };
      }
    }


    return stateVariableDefinitions;
  }

}
