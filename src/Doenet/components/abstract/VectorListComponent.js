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

    stateVariableDefinitions.vectors = {
      isArray: true,
      entryPrefixes: ["vector"],
      returnDependencies: function ({ arrayKeys }) {

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }
        if (arrayKey === undefined) {
          return {
            vectorChildren: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroVectors",
              variableNames: ["displacement"]
            }
          }
        } else {
          return {
            vectorChild: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastZeroVectors",
              variableNames: ["displacement"],
              childIndices: [arrayKey],
            }
          }
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {
        // console.log('mark stale for vectorlist vectors')
        // console.log(changes);
        // console.log(arrayKeys);

        let freshByKey = freshnessInfo.vectors.freshByKey;

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {

          if (changes.vectorChildren) {
            if (changes.vectorChildren.componentIdentitiesChanged) {
              for (let key in freshByKey) {
                delete freshByKey[key];
              }
            } else {
              for (let key in changes.vectorChildren.valuesChanged) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { vectors: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements vectors has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: { vectors: true } }
          }
        } else {

          // have arrayKey
          // so asked for just one component

          if (changes.vectorChild) {
            if (changes.vectorChild.componentIdentitiesChanged) {
              delete freshByKey[arrayKey];
            } else {
              if (changes.vectorChild.valuesChanged[0]) {
                delete freshByKey[arrayKey];
              }
            }
          }

          return { fresh: { vectors: freshByKey[arrayKey] === true } };
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.vectors.freshByKey;

        // console.log('definition of vectors for vectorlist')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValues)))
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          if (changes.vectorChildren && changes.vectorChildren.componentIdentitiesChanged) {
            // send array so that now should overwrite entire array
            for (let key in dependencyValues.vectorChildren) {
              freshByKey[key] = true;
            }

            return {
              newValues: {
                vectors: dependencyValues.vectorChildren.map(x => x.stateValues.displacement),
              }
            }
          }

          let newVectorValues = {};
          for (let arrayKey in dependencyValues.vectorChildren) {
            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              newVectorValues[arrayKey] = dependencyValues.vectorChildren[arrayKey].stateValues.displacement
            }
          }
          return { newValues: { vectors: newVectorValues } }
        } else {

          // have arrayKey

          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;
            let displacement;
            if (dependencyValues.vectorChild.length === 1) {
              displacement = dependencyValues.vectorChild[0].stateValues.displacement
            } else {
              displacement = me.fromAst('\uff3f')
            }
            return {
              newValues: {
                vectors: {
                  [arrayKey]: displacement
                }
              }
            }
          } else {
            // arrayKey asked for didn't change
            // don't need to report noChanges for array state variable
            return {};
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues,
        stateValues, arrayKeys
      }) {

        // console.log('inverse definition of vectors of vectorlist')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          // working with entire array

          let instructions = [];
          for (let key in desiredStateVariableValues.vectors) {
            instructions.push({
              setDependency: "vectorChildren",
              desiredValue: desiredStateVariableValues.vectors[key],
              childIndex: key,
              variableIndex: 0
            })
          }

          return {
            success: true,
            instructions
          }
        } else {

          // just have one arrayKey
          return {
            success: true,
            instructions: [{
              setDependency: "vectorChild",
              desiredValue: desiredStateVariableValues.vectors[arrayKey],
              childIndex: 0,
              variableIndex: 0
            }]
          }

        }

      }
    }

    stateVariableDefinitions.nVectors = {
      returnDependencies: () => ({
        vectorChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroVectors",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nVectors: dependencyValues.vectorChildren.length },
        checkForActualChange: ["nVectors"]
      })
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
