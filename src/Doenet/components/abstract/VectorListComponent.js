import BaseComponent from './BaseComponent';
import { returnBreakStringsSugarFunction } from '../commonsugar/breakstrings';

export default class VectorListComponent extends BaseComponent {
  static componentType = "_vectorlistcomponent";
  static rendererType = "container";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = { default: true, forRenderer: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroVectors = childLogic.newLeaf({
      name: "atLeastZeroVectors",
      componentType: 'vector',
      comparison: 'atLeast',
      number: 0
    });

    let childrenToComponentFunction = x => ({
      componentType: "vector", children: [{
        componentType: "head", children: [{
          componentType: "coords", children: x
        }]
      }]
    });

    let breakIntoVectorsByCommas = returnBreakStringsSugarFunction({
      childrenToComponentFunction,
      dependencyNameWithChildren: "stringsAndMaths"
    });

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        }
      }),
      logicToWaitOnSugar: ["atLeastZeroVectors"],
      replacementFunction: breakIntoVectorsByCommas,
    });

    childLogic.newOperator({
      name: "vectorsXorSugar",
      operator: 'xor',
      propositions: [stringsAndMaths, atLeastZeroVectors],
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nVectors = {
      returnDependencies: () => ({
        vectorChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroVectors",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nVectors: dependencyValues.vectorChildren.length },
        checkForActualChange: { nVectors: true }
      })
    }


    stateVariableDefinitions.vectors = {
      isArray: true,
      entryPrefixes: ["vector"],
      returnArraySizeDependencies: () => ({
        nVectors: {
          dependencyType: "stateVariable",
          variableName: "nVectors",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nVectors];
      },

      returnArrayDependenciesByKey({ arrayKeys }) {
        let dependenciesByKey = {};
        for (let arrayKey of arrayKeys) {
          dependenciesByKey[arrayKey] = {
            vectorChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroVectors",
              variableNames: ["displacement"],
              childIndices: [arrayKey],
            }
          }
        }

        return { dependenciesByKey };

      },
      arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {

        // console.log('array definition of vectors for vectorlist')
        // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
        // console.log(arrayKeys);

        let vectors = {};

        for (let arrayKey of arrayKeys) {
          let vectorChild = dependencyValuesByKey[arrayKey].vectorChild[0];
          if (vectorChild) {
            vectors[arrayKey] = vectorChild.stateValues.coords;
          }
        }

        return { newValues: { vectors } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues,
        dependencyNamesByKey
      }) {

        // console.log('array inverse definition of vectors of vectorlist')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let instructions = [];
        for (let arrayKey in desiredStateVariableValues.vectors) {

          instructions.push({
            setDependency: dependencyNamesByKey[arrayKey].vectorChild,
            desiredValue: desiredStateVariableValues.vectors[arrayKey],
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


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        vectorChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroVectors",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          childrenToRender: dependencyValues.vectorChildren.map(x => x.componentName)
        }
      })
    }

    return stateVariableDefinitions;

  }

}
