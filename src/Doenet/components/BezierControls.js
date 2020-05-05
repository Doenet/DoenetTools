import BaseComponent from './abstract/BaseComponent';
import { breakEmbeddedStringByCommas, breakIntoVectorComponents } from './commonsugar/breakstrings';
import me from 'math-expressions';

export default class BezierControls extends BaseComponent {
  static componentType = "beziercontrols";
  static rendererType = "container";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let checkIfMathVector = function (compList) {
      if (compList.length === 1) {
        let component = compList[0]._component;
        if (component !== undefined && component.componentType === "math") {
          let tree = component.state.value.tree;
          if (tree !== undefined) {
            if (Array.isArray(tree) && (tree[0] === "tuple" || tree[0] === "vector")) {
              return true;
            }
          }
        }
      }
      return false;
    }

    let createControlList = function ({ dependencyValues }) {

      let results = breakEmbeddedStringByCommas({
        childrenList: dependencyValues.stringsAndMaths,
      });

      if (results.success !== true) {
        return { success: false }
      }

      let defaultcontrolsChild = dependencyValues.defaultControls[0];
      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let newChildren = [];
      let controlsAreVectors = false;
      if (defaultcontrolsChild !== undefined) {
        newChildren.push({
          createdComponent: true,
          componentName: defaultcontrolsChild.componentName
        });
        if (defaultcontrolsChild.stateValues.value === "vector") {
          controlsAreVectors = true;
        }
      }

      for (let ind = 0; ind < pieces.length; ind++) {
        let piece = pieces[ind];

        // each piece must be a vector (if not, we won't sugar)
        // the next step is to find the vector components
        // so that we can see if the components themselves are vectors

        let componentsAreVectors = false;
        let vectorComponents;
        let result = breakIntoVectorComponents(piece);
        if (result.foundVector !== true) {
          // check if is a single math that is a tuple or vector
          if (!checkIfMathVector(piece)) {
            return { success: false };
          }
        } else {

          vectorComponents = result.vectorComponents;

          // check if each component is itself a vector
          componentsAreVectors = true;
          for (let comp of vectorComponents) {
            let result2 = breakIntoVectorComponents(comp);
            if (result2.foundVector !== true) {
              if (!checkIfMathVector(comp)) {
                componentsAreVectors = false;
                break;
              }
            }
          }
        }

        let children;
        let controlType = "point";
        let controlListType = "controlpoints";
        if (controlsAreVectors) {
          controlType = "vector";
          controlListType = "controlvectors";
        }

        if (componentsAreVectors) {
          // found a piece that is a vector of vectors
          // Instead of using the piece itself as the children for the control,
          // we'll use the vector components of the piece

          // since we're actually breaking it up,
          // add any more strings to delete
          // that we encountered in the initial breaking into components
          toDelete = [...toDelete, ...result.toDelete];

          children = vectorComponents.map(x => ({
            componentType: controlType,
            children: x
          }));

        } else {
          // if not vector of vectors, just keep original children from piece
          children = [{
            componentType: controlType,
            children: piece
          }]
        }

        newChildren.push({
          componentType: controlListType,
          children: children
        })

      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let defaultControlsForSugar = childLogic.newLeaf({
      name: "defaultControlsForSugar",
      componentType: 'defaultcontrols',
      comparison: 'atMost',
      number: 1,
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
    });

    let stringsAndMathsSugar = childLogic.newOperator({
      name: "stringsAndMathsSugar",
      operator: 'and',
      propositions: [defaultControlsForSugar, stringsAndMaths],
      isSugar: true,
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        },
        defaultControls: {
          dependencyType: "childStateVariables",
          childLogicName: "defaultControlsForSugar",
          variableNames: ["value"],
        }
      }),
      logicToWaitOnSugar: ["atLeastOneControlpoints", "atLeastOneControlvectors"],
      replacementFunction: createControlList,
    });

    let defaultControls = childLogic.newLeaf({
      name: "defaultControls",
      componentType: 'defaultcontrols',
      comparison: 'atMost',
      number: 1,
    });

    let atLeastOnePoint = childLogic.newLeaf({
      name: "atLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneVector = childLogic.newLeaf({
      name: "atLeastOneVector",
      componentType: 'vector',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneControlpoints = childLogic.newLeaf({
      name: "atLeastOneControlpoints",
      componentType: 'controlpoints',
      comparison: 'atLeast',
      number: 1
    });

    let atLeastOneControlvectors = childLogic.newLeaf({
      name: "atLeastOneControlvectors",
      componentType: 'controlvectors',
      comparison: 'atLeast',
      number: 1
    });

    let atLeastOneControl = childLogic.newOperator({
      name: "atLeastOneControl",
      operator: "or",
      propositions: [atLeastOneControlpoints, atLeastOneControlvectors, atLeastOnePoint, atLeastOneVector],
      requireConsecutive: true,
    })

    let controlsWithDefault = childLogic.newOperator({
      name: "controlsWithDefault",
      operator: "and",
      propositions: [defaultControls, atLeastOneControl]
    })

    childLogic.newOperator({
      name: "controlsXorSugar",
      operator: 'xor',
      propositions: [controlsWithDefault, stringsAndMathsSugar],
      allowSpillover: false,
      setAsBase: true
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.controls = {
      isArray: true,
      entryPrefixes: ["control"],
      nDimensions: 2,
      returnDependencies: function ({ arrayKeys }) {
        if (arrayKeys === undefined) {
          return {
            controlChildren: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastOneControl",
              variableNames: ["coords", "displacement", "point1", "point2", "vector1", "vector2"],
              variablesOptional: true
            }
          }
        } else {
          let dependencies = {};

          for (let arrayKey of arrayKeys) {
            let arrayIndex = arrayKey.split(",");

            if (arrayIndex[1] === '0') {
              dependencies['controlChild' + arrayKey] = {
                dependencyType: "childStateVariables",
                childLogicName: "atLeastOneControl",
                variableNames: ["coords", "displacement", "point1", "vector1"],
                variablesOptional: true,
                childIndices: [arrayIndex[0]],
              }
            } else if (arrayIndex[1] === '1') {
              dependencies['controlChild' + arrayKey] = {
                dependencyType: "childStateVariables",
                childLogicName: "atLeastOneControl",
                variableNames: ["point2", "vector2"],
                variablesOptional: true,
                childIndices: [arrayIndex[0]],
              }
            }
          }

          return dependencies;
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {
        // console.log('mark stale for beziercontrols controls')
        // console.log(changes);
        // console.log(arrayKeys);

        let freshByKey = freshnessInfo.controls.freshByKey;

        if (arrayKeys === undefined) {

          if (changes.controlChildren) {
            if (changes.controlChildren.componentIdentitiesChanged) {
              // if controlChildren changed
              // then the entire controls array is also changed

              for (let key in freshByKey) {
                delete freshByKey[key];
              }
            } else {

              for (let ind in changes.controlChildren.valuesChanged) {

                let valuesChanged = changes.controlChildren.valuesChanged[ind];

                if (valuesChanged.coords || valuesChanged.displacement
                  || valuesChanged.point1 || valuesChanged.vector1
                ) {
                  delete freshByKey[[ind, 0]]
                } else if (valuesChanged.point2 || valuesChanged.vector2) {
                  delete freshByKey[[ind, 1]]
                }

              }
            }
          }
        } else {

          for (let arrayKey of arrayKeys) {
            if (changes['controlChild' + arrayKey]) {
              delete freshByKey[arrayKey]
            }
          }

        }

        if (arrayKeys === undefined) {

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { controls: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements controls has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: { controls: true } }
          }
        } else {

          let allFresh = true;
          let allStale = true;

          for (let arrayKey of arrayKeys) {
            if (freshByKey[arrayKey] === true) {
              allStale = false;
            } else {
              allFresh = false;
            }
          }

          if (allStale) {
            return { fresh: { controls: false } }
          }
          if (allFresh) {
            return { fresh: { controls: true } }
          }
          return { partiallyFresh: { controls: true } }
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.controls.freshByKey;

        // console.log('definition of controls for beziercontrols')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValues)))
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        if (arrayKeys === undefined) {
          if (changes.controlChildren && changes.controlChildren.componentIdentitiesChanged) {
            // send array so that now should overwrite entire array
            let controls = [];

            for (let [ind, child] of dependencyValues.controlChildren.entries()) {
              let controlsForPoint = [];
              controlsForPoint.push(getControl(child, 0));
              freshByKey[[ind, 0]] = true;
              let c2 = getControl(child, 1);
              if (c2) {
                controlsForPoint.push(c2);
              }
              freshByKey[[ind, 1]] = true;
              controls.push(controlsForPoint);

            }
            return {
              newValues: {
                controls
              }
            }
          }

          let newControlValues = {};
          for (let [ind, child] of dependencyValues.controlChildren.entries()) {
            if (!freshByKey[[ind, 0]]) {
              freshByKey[[ind, 0]] = true;
              newControlValues[[ind, 0]] = getControl(child, 0);
            }
            if (!freshByKey[[ind, 1]]) {
              freshByKey[[ind, 1]] = true;
              let c2 = getControl(child, 1);
              if (c2) {
                newControlValues[[ind, 1]] = c2;
              }
            }
          }

          return { newValues: { controls: newControlValues } }
        } else {

          // have arrayKeys
          let newControlValues = {};

          for (let arrayKey of arrayKeys) {
            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              let child = dependencies['controlChild' + arrayKey][0];
              if (child) {
                let ind = Number(arrayKey.split(',')[1]);
                let control = getControl(child, ind);
                if (control) {
                  newControlValues[arrayKey] = control;
                }
              }
            }
          }
          if (Object.keys(newControlValues).length > 1) {
            return {
              newValues: {
                controls: newControlValues
              }
            }
          } else {
            // no arrayKeys asked for changed
            // don't need to report noChanges for array state variable
            return {}
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues,
        dependencyValues, arrayKeys
      }) {

        // console.log('inverse definition of controls of beziercontrols')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        if (arrayKeys === undefined) {
          // working with entire array

          let instructions = [];

          let variableNames0 = {
            0: "coords", 1: "displacement", 2: "point1", 4: "vector1"
          };
          let variableNames1 = {
            3: "point2", 4: "vector2"
          };

          for (let key in desiredStateVariableValues.controls) {

            let arrayIndex = key.split(",");

            let child = dependencyValues.controlChildren[arrayIndex[0]];

            if (!child) {
              return { success: false }
            }

            let variableNames;
            if (arrayIndex[1] === '1') {
              variablesNames = variableNames1;
            } else {
              variablesNames = variableNames0;
            }

            instructions.push(invertControls({
              dependencyName: "controlChildren",
              desiredValue: desiredStateVariableValues.controls[key],
              childIndex: arrayIndex[0],
              controlChild: child,
              variableNames,
            }))
          }

          return {
            success: true,
            instructions
          }
        } else {

          // have arrayKeys

          let instructions = [];

          let variableNames0 = {
            0: "coords", 1: "displacement", 2: "point1", 3: "vector1"
          };
          let variableNames1 = {
            0: "point2", 1: "vector2"
          };

          for (let arrayKey of arrayKeys) {

            let child = dependencies['controlChild' + arrayKey];
            if (!child) {
              return { success: false }
            }

            let arrayIndex = arrayKey.split(",");

            let variableNames;
            if (arrayIndex[1] === '1') {
              variablesNames = variableNames1;
            } else {
              variablesNames = variableNames0;
            }

            instructions.push(invertControls({
              dependencyName: 'controlChild' + arrayKey,
              desiredValue: desiredStateVariableValues.controls[arrayKey],
              childIndex: 0,
              controlChild: child,
              variableNames,
            }))

          }
          return {
            success: true,
            instructions
          }

        }

      }
    }

    return stateVariableDefinitions;

  }


}

function getControl(child, ind) {
  if (ind === 0) {
    if (child.stateValues.vector1) {
      return {
        vector: child.stateValues.vector1,
      };
    } else if (child.stateValues.point1) {
      return {
        point: child.stateValues.point1,
      };
    } else if (child.stateValues.displacement) {
      return {
        vector: child.stateValues.displacement,
      };
    } else {
      return {
        point: child.stateValues.coords,
      };
    }
  } else if (ind === 1) {
    if (child.stateValues.vector2) {
      return {
        vector: child.stateValues.vector2,
      };
    } else if (child.stateValues.point2) {
      return {
        point: child.stateValues.point2,
      };
    } else {
      return;
    }
  }
}

function invertControls({
  dependencyName,
  desiredValue,
  childIndex,
  controlChild,
  variableNames,
}) {

  for (let varInd in variableNames) {
    let varName = variableNames[varInd]

    if (controlChild.stateValues[varName]) {

      return {
        setDependency: dependencyName,
        desiredValue,
        childIndex,
        variableIndex: varInd
      }
    }
  }

}