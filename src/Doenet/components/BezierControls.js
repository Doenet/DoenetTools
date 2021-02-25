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

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      let newChildren = [];

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

        if (componentsAreVectors) {
          // found a piece that is a vector of vectors
          // Instead of using the piece itself as the children for the control,
          // we'll use the vector components of the piece

          // since we're actually breaking it up,
          // add any more strings to delete
          // that we encountered in the initial breaking into components
          toDelete = [...toDelete, ...result.toDelete];

          children = vectorComponents.map(x => ({
            componentType: "vector",
            children: x
          }));

        } else {
          // if not vector of vectors, just keep original children from piece
          children = [{
            componentType: "vector",
            children: piece
          }]
        }

        let direction = children.length === 1 ? "symmetric" : "both";

        newChildren.push({
          componentType: "controlvectors",
          children: children,
          state: { direction }
        })

      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

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
          dependencyType: "child",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        },
      }),
      logicToWaitOnSugar: ["atLeastOneControlvector"],
      replacementFunction: createControlList,
    });

    // let atLeastOneVector = childLogic.newLeaf({
    //   name: "atLeastOneVector",
    //   componentType: 'vector',
    //   comparison: 'atLeast',
    //   number: 1,
    // });

    let atLeastOneControlvector = childLogic.newLeaf({
      name: "atLeastOneControlvector",
      componentType: 'controlvectors',
      comparison: 'atLeast',
      number: 1,
      requireConsecutive: true,
    });

    // let atLeastOneControl = childLogic.newOperator({
    //   name: "atLeastOneControl",
    //   operator: "or",
    //   propositions: [atLeastOneControlvector, atLeastOneVector],
    //   requireConsecutive: true,
    // })

    childLogic.newOperator({
      name: "controlsXorSugar",
      operator: 'xor',
      propositions: [atLeastOneControlvector, stringsAndMaths],
      allowSpillover: false,
      setAsBase: true
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nControlsShadow = {
      defaultValue: 0,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          nControlsShadow: {
            variablesToCheck: ["nControls", "nControlsShadow"]
          }
        }
      }),
      inverseDefinition: function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setStateVariable: "nControlsShadow",
            value: desiredStateVariableValues.nControlsShadow
          }]
        };
      }
    }

    stateVariableDefinitions.specifiedDirections = {
      isArray: true,
      entryPrefixes: ["specifiedDirection"],
      returnDependencies: function ({ arrayKeys }) {
        if (arrayKeys === undefined) {
          return {
            controlChildren: {
              dependencyType: "child",
              childLogicName: "atLeastOneControlvector",
              variableNames: ["direction"],
            }
          }
        } else {
          return {
            controlChild: {
              dependencyType: "child",
              childLogicName: "atLeastOneControlvector",
              variableNames: ["direction"],
              childIndices: [arrayKeys[0]]
            }
          }
        }
      },
      markStale: function ({ freshnessInfo, changes, arrayKeys }) {
        let freshByKey = freshnessInfo.specifiedDirections.freshByKey;

        if (changes.controlChildren) {
          if (changes.controlChildren.componentIdentitiesChanged) {
            // if controlChildren changed
            // then the entire array is also changed

            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            for (let ind in changes.controlChildren.valuesChanged) {

              let valuesChanged = changes.controlChildren.valuesChanged[ind];

              if (valuesChanged.direction) {
                delete freshByKey[ind]
              }

            }
          }
          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { specifiedDirections: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements specifiedDirections has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: { specifiedDirections: true } }
          }
        } else {
          // have arrayKeys
          let arrayKey = arrayKeys[0]
          if (changes.controlChild) {
            delete freshByKey[arrayKey]
          }
          return { fresh: { specifiedDirections: freshByKey[arrayKey] === true } }

        }

      },
      freshenOnNoChanges: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.specifiedDirections.freshByKey;
        if (arrayKeys === undefined) {
          for (let ind in dependencyValues.controlChildren) {
            freshByKey[ind] = true;
          }
        } else {
          freshByKey[arrayKeys[0]] = true;
        }
      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.specifiedDirections.freshByKey;

        if (arrayKeys === undefined) {
          if (changes.controlChildren && changes.controlChildren.componentIdentitiesChanged) {
            // send array so that now should overwrite entire array
            let specifiedDirections = [];
            for (let [ind, child] of dependencyValues.controlChildren.entries()) {
              specifiedDirections.push(child.stateValues.direction);
              freshByKey[ind] = true;
            }
            return {
              newValues: {
                specifiedDirections
              }
            }
          }

          let newDirections = {};
          for (let [ind, child] of dependencyValues.controlChildren.entries()) {
            if (!freshByKey[ind]) {
              freshByKey[ind] = true;
              newDirections[ind] = child.stateValues.direction;
            }
          }

          return { newValues: { specifiedDirections: newDirections } }

        } else {
          // have arrayKeys
          let arrayKey = arrayKeys[0];

          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;

            let newDirections = {};
            if (dependencyValues.controlChild.length === 1) {
              newDirections[arrayKey] = dependencyValues.controlChild[0].stateValues.direction;
            } else {
              newDirections[arrayKey] = undefined;
            }

            return { newValues: { specifiedDirections: newDirections } }
          } else {
            // arrayKey asked for did not change
            // don't need to report noChanges for array state variable
            return {};
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues,
        dependencyValues, arrayKeys
      }) {

        // console.log('inverse definition of specifiedDirections of beziercontrols')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = arrayKeys[0];
        }

        if (arrayKey === undefined) {
          // working with entire array

          let instructions = [];

          for (let key in desiredStateVariableValues.specifiedDirections) {

            let child = dependencyValues.controlChildren[key];
            if (child) {
              instructions.push({
                setDependency: "controlChildren",
                desiredValue: desiredStateVariableValues.specifiedDirections[key],
                childIndex: key,
                variableIndex: 0
              })
            }
          }

          return {
            success: true,
            instructions
          }
        } else {

          // have arrayKey

          let instructions = [];

          let child = dependencyValues.controlChild[0];
          if (child) {
            instructions.push({
              setDependency: "controlChild",
              desiredValue: desiredStateVariableValues.specifiedDirections[arrayKey],
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
    }

    stateVariableDefinitions.specifiedControls = {
      isArray: true,
      entryPrefixes: ["specifiedControl"],
      nDimensions: 2,
      stateVariablesDeterminingDependencies: ["specifiedDirections"],
      returnDependencies: function ({ arrayKeys, stateValues }) {
        if (arrayKeys === undefined) {
          return {
            controlChildren: {
              dependencyType: "child",
              childLogicName: "atLeastOneControlvector",
              variableNames: ["direction", "vector1", "vector2"],
            },
          }
        } else {
          let dependencies = {};

          for (let arrayKey of arrayKeys) {
            let arrayIndices = arrayKey.split(",").map(x => Number(x));
            let varEndings = arrayIndices.map(x => x + 1);
            let jointVarEnding = varEndings.join('_')
            let specifiedDirection = stateValues.specifiedDirections[arrayIndices[0]]

            if (arrayIndices[1] === 0) {
              if (specifiedDirection !== "next" && specifiedDirection !== "none") {
                dependencies['controlChild' + jointVarEnding] = {
                  dependencyType: "child",
                  childLogicName: "atLeastOneControlvector",
                  variableNames: ["direction", "vector1"],
                  childIndices: [arrayIndices[0]],
                }
              }
            } else if (arrayIndices[1] === 1) {
              if (specifiedDirection === "both") {
                dependencies['controlChild' + jointVarEnding] = {
                  dependencyType: "child",
                  childLogicName: "atLeastOneControlvector",
                  variableNames: ["direction", "vector2"],
                  childIndices: [arrayIndices[0]],
                }
              } else if (specifiedDirection === "next") {
                dependencies['controlChild' + jointVarEnding] = {
                  dependencyType: "child",
                  childLogicName: "atLeastOneControlvector",
                  variableNames: ["direction", "vector1"],
                  childIndices: [arrayIndices[0]],
                }
              }
            }
          }

          return dependencies;
        }
      },
      getPreviousDependencyValuesForMarkStale: true,
      markStale: function ({ freshnessInfo, changes, arrayKeys, previousDependencyValues }) {
        let freshByKey = freshnessInfo.specifiedControls.freshByKey;

        // console.log('mark stale for beziercontrols specifiedControls')
        // console.log(JSON.parse(JSON.stringify(changes)));
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));

        if (arrayKeys === undefined) {

          if (changes.controlChildren) {
            if (changes.controlChildren.componentIdentitiesChanged) {
              // if controlChildren changed
              // then the entire specifiedControls array is also changed

              for (let key in freshByKey) {
                delete freshByKey[key];
              }
            } else {

              for (let ind in changes.controlChildren.valuesChanged) {

                let valuesChanged = changes.controlChildren.valuesChanged[ind];

                if (valuesChanged.direction) {
                  delete freshByKey[[ind, 0]];
                  delete freshByKey[[ind, 1]];
                } else {
                  let direction = previousDependencyValues.controlChildren[ind].stateValues.direction;
                  if (valuesChanged.vector1) {
                    if (direction === "next") {
                      delete freshByKey[[ind, 1]];
                    } else {
                      delete freshByKey[[ind, 0]];
                    }
                  }
                  if (valuesChanged.vector2) {
                    if (direction === "both") {
                      delete freshByKey[[ind, 1]];
                    }
                  }
                }

              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { specifiedControls: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements specifiedControls has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: { specifiedControls: true } }
          }

        } else {


          let allFresh = true;
          let allStale = true;

          for (let arrayKey of arrayKeys) {
            let jointVarEnding = arrayKey.split(",").map(x => Number(x) + 1).join('_');

            if (changes['controlChild' + jointVarEnding]) {
              delete freshByKey[arrayKey]
            }

            if (freshByKey[arrayKey] === true) {
              allStale = false;
            } else {
              allFresh = false;
            }
          }

          if (allStale) {
            return { fresh: { specifiedControls: false } }
          }
          if (allFresh) {
            return { fresh: { specifiedControls: true } }
          }
          return { partiallyFresh: { specifiedControls: true } }
        }

      },
      freshenOnNoChanges: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.specifiedControls.freshByKey;
        if (arrayKeys === undefined) {
          for (let ind in dependencyValues.controlChildren) {
            freshByKey[[ind, 0]] = true;
            freshByKey[[ind, 1]] = true;
          }
        } else {
          for (let arrayKey of arrayKeys) {
            freshByKey[arrayKey] = true;
          }
        }
      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.specifiedControls.freshByKey;

        // console.log('definition of specifiedControls for beziercontrols')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValues)))
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        if (arrayKeys === undefined) {
          if (changes.controlChildren && changes.controlChildren.componentIdentitiesChanged) {
            // send array so that now should overwrite entire array
            let specifiedControls = [];

            for (let [ind, child] of dependencyValues.controlChildren.entries()) {
              let controlsForPoint = [];

              if (child.stateValues.direction === "both") {
                controlsForPoint.push(undefinedToNull(child.stateValues.vector1));
                controlsForPoint.push(undefinedToNull(child.stateValues.vector2));
              } else if (child.stateValues.direction === "next") {
                controlsForPoint.push(null);
                controlsForPoint.push(undefinedToNull(child.stateValues.vector1))
              } else {
                // symmetric or previous
                controlsForPoint.push(undefinedToNull(child.stateValues.vector1));
                controlsForPoint.push(null);
              }
              freshByKey[[ind, 0]] = true;
              freshByKey[[ind, 1]] = true;
              specifiedControls.push(controlsForPoint);

            }
            return {
              newValues: {
                specifiedControls
              }
            }
          }

          let newControlValues = {};
          for (let [ind, child] of dependencyValues.controlChildren.entries()) {
            if (!freshByKey[[ind, 0]]) {
              freshByKey[[ind, 0]] = true;
              if (child.stateValues.direction === "next") {
                newControlValues[[ind, 0]] = null
              } else {
                newControlValues[[ind, 0]] = undefinedToNull(child.stateValues.vector1);
              }
            }
            if (!freshByKey[[ind, 1]]) {
              freshByKey[[ind, 1]] = true;
              if (child.stateValues.direction === "both") {
                newControlValues[[ind, 1]] = undefinedToNull(child.stateValues.vector2);
              } else if (child.stateValues.direction === "next") {
                newControlValues[[ind, 1]] = undefinedToNull(child.stateValues.vector1);
              } else {
                // symmetric or previous
                newControlValues[[ind, 1]] = null;
              }
            }
          }

          return { newValues: { specifiedControls: newControlValues } }
        } else {

          // have arrayKeys
          let newControlValues = {};

          for (let arrayKey of arrayKeys) {
            let arrayIndices = arrayKey.split(",").map(x => Number(x));
            let varEndings = arrayIndices.map(x => x + 1);
            let jointVarEnding = varEndings.join('_')

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              let child = dependencyValues['controlChild' + jointVarEnding][0];
              if (child) {
                if (child.stateValues.direction === "both") {
                  if (arrayIndices[1] === 1) {
                    newControlValues[arrayKey] = undefinedToNull(child.stateValues.vector2);
                  } else {
                    newControlValues[arrayKey] = undefinedToNull(child.stateValues.vector1);
                  }
                } else if (child.stateValues.direction === "next") {
                  if (arrayIndices[1] === 1) {
                    newControlValues[arrayKey] = undefinedToNull(child.stateValues.vector1);
                  } else {
                    newControlValues[arrayKey] = null;
                  }
                } else {
                  // symmetric or previous
                  if (arrayIndices[1] === 1) {
                    newControlValues[arrayKey] = null;
                  } else {
                    newControlValues[arrayKey] = undefinedToNull(child.stateValues.vector1);
                  }
                }
              } else {
                newControlValues[arrayKey] = null;
              }
            }
          }
          if (Object.keys(newControlValues).length > 0) {
            return {
              newValues: {
                specifiedControls: newControlValues
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

        // console.log('inverse definition of specifiedControls of beziercontrols')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)
        // console.log(arrayKeys);

        if (arrayKeys === undefined) {
          // working with entire array

          let instructions = [];

          for (let key in desiredStateVariableValues.specifiedControls) {
            let arrayIndices = key.split(",").map(x => Number(x));

            let child = dependencyValues.controlChildren[arrayIndices[0]];
            if (!child) {
              continue;
            }

            if (arrayIndices[1] === 0) {
              if (child.stateValues.direction !== "next" && child.stateValues.direction !== "none" && child.stateValues.vector1) {
                instructions.push({
                  setDependency: "controlChildren",
                  desiredValue: desiredStateVariableValues.specifiedControls[key],
                  childIndex: arrayIndices[0],
                  variableIndex: 1
                })
              }
            } else if (arrayIndices[1] === 1) {
              if (child.stateValues.direction === "both") {
                if (child.stateValues.vector2) {
                  instructions.push({
                    setDependency: "controlChildren",
                    desiredValue: desiredStateVariableValues.specifiedControls[key],
                    childIndex: arrayIndices[0],
                    variableIndex: 2
                  })
                }
              } else if (child.stateValues.direction === "next" && child.stateValues.vector1) {
                instructions.push({
                  setDependency: "controlChildren",
                  desiredValue: desiredStateVariableValues.specifiedControls[key],
                  childIndex: arrayIndices[0],
                  variableIndex: 1
                })
              }
            }
          }

          return {
            success: true,
            instructions
          }
        } else {

          // have arrayKeys

          let instructions = [];

          for (let arrayKey of arrayKeys) {
            let arrayIndices = arrayKey.split(",").map(x => Number(x));
            let varEndings = arrayIndices.map(x => x + 1);
            let jointVarEnding = varEndings.join('_')

            let child = dependencyValues['controlChild' + jointVarEnding][0];
            if (child) {
              instructions.push({
                setDependency: 'controlChild' + jointVarEnding,
                desiredValue: desiredStateVariableValues.specifiedControls[arrayKey],
                childIndex: 0,
                variableIndex: 1
              })
            }
          }

          return {
            success: true,
            instructions
          }

        }

      }
    }

    stateVariableDefinitions.pointIndMap = {
      returnDependencies: () => ({
        controlChildren: {
          dependencyType: "child",
          childLogicName: "atLeastOneControlvector",
          variableNames: ["pointNumber"],
        }
      }),
      definition: function ({ dependencyValues }) {
        let pointIndMap = [];
        let currentPointInd = -1;
        for (let [controlInd, controlChild] of dependencyValues.controlChildren.entries()) {
          let pointNumber = controlChild.stateValues.pointNumber;
          if (Number.isFinite(pointNumber)) {
            currentPointInd = Math.round(pointNumber) - 1;
          } else {
            currentPointInd += 1;
          }
          pointIndMap[currentPointInd] = controlInd;
        }

        return { newValues: { pointIndMap } }
      }
    }

    stateVariableDefinitions.directions = {
      isArray: true,
      entryPrefixes: ["direction"],
      defaultEntryValue: "none",
      stateVariablesDeterminingDependencies: ["pointIndMap"],
      returnDependencies: function ({ arrayKeys, stateValues }) {

        if (arrayKeys === undefined) {
          return {
            specifiedDirections: {
              dependencyType: "stateVariable",
              variableName: "specifiedDirections",
            },
            pointIndMap: {
              dependencyType: "stateVariable",
              variableName: "pointIndMap",
            },
            nControlsShadow: {
              dependencyType: "stateVariable",
              variableName: "nControlsShadow",
            }
          }
        } else {

          let dependencies = {
            nControlsShadow: {
              dependencyType: "stateVariable",
              variableName: "nControlsShadow",
            }
          };

          let controlInd = stateValues.pointIndMap[arrayKeys[0]];
          if (controlInd !== undefined) {
            let mappedVarEnding = controlInd + 1;
            dependencies.specifiedDirection = {
              dependencyType: "stateVariable",
              variableName: "specifiedDirection" + mappedVarEnding
            }
          }

          return dependencies;

        }
      },
      getPreviousDependencyValuesForMarkStale: true,
      markStale: function ({ freshnessInfo, changes, arrayKeys, previousDependencyValues }) {
        // console.log('mark stale for beziercontrols directions')
        // console.log(changes);
        // console.log(arrayKeys);

        let freshByKey = freshnessInfo.directions.freshByKey;

        if (arrayKeys === undefined) {
          if (changes.pointIndMap) {
            // if pointIndMap changed, mark all entries as stale
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else if (changes.specifiedDirections) {
            // map any keys that were stale in specifiedDirections
            // to keys in directions using previous values of pointIndMap
            let specifiedFreshByKey = changes.specifiedDirections.valuesChanged.specifiedDirections.freshnessInfo.freshByKey;
            for (let key in freshByKey) {
              let mappedKey = previousDependencyValues.pointIndMap[key];
              if (!specifiedFreshByKey[mappedKey]) {
                delete freshByKey[key];
              }
            }
          }

          if (Object.keys(freshByKey).length === 0) {
            // asked for entire array and it is all stale
            return { fresh: { directions: false } }
          } else {
            // asked for entire array, but it has some fresh elements
            // (we don't know here how many elements directions has, 
            // so can't determine if completely fresh)
            return { partiallyFresh: { directions: true } }
          }
        } else {
          // asked for just one component

          let arrayKey = arrayKeys[0]

          if (changes.specifiedDirection) {
            delete freshByKey[arrayKey]
          }

          return {
            fresh: {
              directions: freshByKey[arrayKey] === true,
            }
          }
        }

      },
      freshenOnNoChanges: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.directions.freshByKey;

        if (arrayKeys === undefined) {

          let nPoints = dependencyValues.pointIndMap.length;

          if (dependencyValues.nControlsShadow > nPoints) {
            nPoints = dependencyValues.nControlsShadow;
          }

          for (let ind = 0; ind < nPoints; ind++) {
            freshByKey[ind] = true;
          }
        } else {
          freshByKey[arrayKeys[0]] = true;
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.directions.freshByKey;

        // console.log('definition of directions for beziercontrols')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValues)))
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        if (arrayKeys === undefined) {
          let overwriteArray = false;

          if (changes.pointIndMap) {
            overwriteArray = true;
          } else if (changes.specifiedDirections) {
            let changedDirections = changes.specifiedDirections.valuesChanged.specifiedDirections.changed;

            if (changedDirections === true || changedDirections.changedEntireArray === true) {
              overwriteArray = true;
            }
          }

          if (overwriteArray) {
            // send array so that now should overwrite entire array
            let directions = [];
            let essentialDirections = {};

            for (let [ind, mappedInd] of dependencyValues.pointIndMap.entries()) {
              freshByKey[ind] = true;

              let direction = dependencyValues.specifiedDirections[mappedInd];

              if (direction) {
                directions.push(direction);
              } else {
                directions.push(undefined);
                essentialDirections[ind] = {
                  variablesToCheck: ["directions" + (ind + 1)]
                }
              }

            }

            // check for essential values if nControlsShadow is larger
            for (let ind = dependencyValues.pointIndMap.length; ind < dependencyValues.nControlsShadow; ind++) {
              essentialDirections[ind] = {
                variablesToCheck: ["directions" + (ind + 1)]
              }
              freshByKey[ind] = true;
            }

            return {
              newValues: {
                directions
              },
              useEssentialOrDefaultValue: {
                directions: essentialDirections,
              }
            }
          }


          let newDirections = {};
          let essentialDirections = {};

          for (let [ind, mappedInd] of dependencyValues.pointIndMap.entries()) {

            if (!freshByKey[ind]) {
              freshByKey[ind] = true;

              let direction = dependencyValues.specifiedDirections[mappedInd];

              if (direction) {
                newDirections[ind] = direction;
              } else {
                essentialDirections[ind] = {
                  variablesToCheck: ["directions" + (ind + 1)]
                }
              }
            }
          }

          // check for essential values if nControlsShadow is larger
          for (let ind = dependencyValues.pointIndMap.length; ind < dependencyValues.nControlsShadow; ind++) {
            essentialDirections[ind] = {
              variablesToCheck: ["directions" + (ind + 1)]
            }
            freshByKey[ind] = true;
          }

          return {
            newValues: {
              directions: newDirections
            },
            useEssentialOrDefaultValue: {
              directions: essentialDirections,
            }
          }
        } else {

          // have arrayKeys

          let arrayKey = arrayKeys[0];

          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;
            let direction = dependencyValues.specifiedDirection;

            if (direction) {
              return {
                newValues: {
                  directions: {
                    [arrayKey]: direction
                  }
                }
              }
            } else {
              return {
                useEssentialOrDefaultValue: {
                  directions: {
                    [arrayKey]: { variablesToCheck: ["directions" + (arrayKey + 1)] }
                  }
                }
              }
            }
          }

          // arrayKey asked for didn't change
          // don't need to report noChanges for array state variable
          return {};

        }
      },
      inverseDefinition: function ({ desiredStateVariableValues,
        dependencyValues, arrayKeys
      }) {

        // console.log('inverse definition of directions of beziercontrols')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)
        // console.log(arrayKeys);

        if (arrayKeys === undefined) {
          // working with entire array

          let instructions = [];
          let desiredSpecifiedDirections = {};

          for (let arrayKey in desiredStateVariableValues.directions) {
            let mappedInd = dependencyValues.pointIndMap[arrayKey];

            if (dependencyValues.specifiedDirections[mappedInd]) {
              desiredSpecifiedDirections[mappedInd] = desiredStateVariableValues.directions[arrayKey];
            } else {
              instructions.push({
                setStateVariable: "directions",
                value: { [arrayKey]: desiredStateVariableValues.directions[arrayKey] },
              })
            }

          }

          if (Object.keys(desiredSpecifiedDirections).length > 0) {
            instructions.push({
              setDependency: "specifiedDirections",
              desiredValue: desiredSpecifiedDirections
            })
          }

          instructions.push({
            setDependency: "nControlsShadow",
            value: desiredStateVariableValues.directions.length
          });

          return {
            success: true,
            instructions
          }

        } else {

          // have arrayKeys

          let arrayKey = arrayKeys[0];
          let instructions = [];

          if (dependencyValues.specifiedDirection) {
            instructions.push({
              setDependency: "specifiedDirection",
              desiredValue: desiredStateVariableValues.directions[arrayKey],
            })
          } else {
            instructions.push({
              setStateVariable: "directions",
              value: { [arrayKey]: desiredStateVariableValues.directions[arrayKey] },
            })
          }

          let controlNum = Number(arrayKey) + 1;

          if (controlNum > dependencyValues.nControlsShadow) {
            instructions.push({
              setDependency: "nControlsShadow",
              value: controlNum
            });
          }

          return {
            success: true,
            instructions
          }

        }

      }
    }

    stateVariableDefinitions.controls = {
      isArray: true,
      entryPrefixes: ["control"],
      nDimensions: 2,
      defaultEntryValue: null,
      stateVariablesDeterminingDependencies: ["pointIndMap", "directions"],
      returnDependencies: function ({ arrayKeys, stateValues }) {
        if (arrayKeys === undefined) {
          return {
            specifiedControls: {
              dependencyType: "stateVariable",
              variableName: "specifiedControls",
            },
            pointIndMap: {
              dependencyType: "stateVariable",
              variableName: "pointIndMap",
            },
            nControlsShadow: {
              dependencyType: "stateVariable",
              variableName: "nControlsShadow",
            },
            directions: {
              dependencyType: "stateVariable",
              variableName: "directions",
            }
          }
        } else {
          let dependencies = {
            nControlsShadow: {
              dependencyType: "stateVariable",
              variableName: "nControlsShadow",
            }
          };

          for (let arrayKey of arrayKeys) {
            let arrayIndices = arrayKey.split(",").map(x => Number(x));
            let varEndings = arrayIndices.map(x => x + 1);
            let jointVarEnding = varEndings.join('_')

            let direction = stateValues.directions[arrayIndices[0]];
            if (direction && direction !== "none" &&
              (arrayIndices[1] === 0 || arrayIndices[1] === 1)
            ) {
              let controlInd = stateValues.pointIndMap[arrayIndices[0]];
              if (controlInd !== undefined) {
                let pointVarEnding = controlInd + 1;
                if (direction === "symmetric") {
                  let mappedVarEnding = pointVarEnding + "_1";
                  dependencies['mappedSpecifiedControl' + jointVarEnding] = {
                    dependencyType: "stateVariable",
                    variableName: "specifiedControl" + mappedVarEnding
                  }
                } else if (direction === "both"
                  || (direction === "previous" && arrayIndices[1] === 0)
                  || (direction === "next" && arrayIndices[1] === 1)
                ) {
                  let mappedVarEnding = pointVarEnding + "_" + varEndings[1];
                  dependencies['mappedSpecifiedControl' + jointVarEnding] = {
                    dependencyType: "stateVariable",
                    variableName: "specifiedControl" + mappedVarEnding
                  }
                }
              }
            }
            dependencies["direction" + varEndings[0]] = {
              dependencyType: "stateVariable",
              variableName: "direction" + varEndings[0]
            }
          }

          return dependencies;
        }
      },
      getPreviousDependencyValuesForMarkStale: true,
      markStale: function ({ freshnessInfo, changes, arrayKeys, previousDependencyValues }) {
        let freshByKey = freshnessInfo.controls.freshByKey;

        // console.log('mark stale for beziercontrols controls')
        // console.log(JSON.parse(JSON.stringify(changes)));
        // console.log(arrayKeys);
        // console.log(JSON.parse(JSON.stringify(freshByKey)));

        if (arrayKeys === undefined) {

          if (changes.pointIndMap) {
            // if pointIndMap changed, mark all entries as stale
            for (let key in freshByKey) {
              delete freshByKey[key];
            }
          } else {

            if (changes.directions) {
              // map any keys that were stale in diretions
              // to keys in controls
              let directionFreshByKey = changes.directions.valuesChanged.directions.freshnessInfo.freshByKey;
              for (let key in freshByKey) {
                let pieces = key.split(",");
                if (!directionFreshByKey[pieces[0]]) {
                  delete freshByKey[key];
                }
              }
            }

            if (changes.specifiedControls) {
              // map any keys that were stale in specifiedControls
              // to keys in controls using previous values of pointIndMap
              let specifiedFreshByKey = changes.specifiedControls.valuesChanged.specifiedControls.freshnessInfo.freshByKey;
              for (let key in freshByKey) {
                let pieces = key.split(",");
                let direction = previousDependencyValues.directions[pieces[0]];
                let mappedKey;
                if (direction === "symmetric") {
                  mappedKey = previousDependencyValues.pointIndMap[pieces[0]] + ",0";
                }
                else if (direction === "both"
                  || (direction === "previous" && pieces[1] === "0")
                  || (direction === "next" && pieces[1] === "1")
                ) {
                  mappedKey = previousDependencyValues.pointIndMap[pieces[0]] + "," + pieces[1];
                }
                if (mappedKey && !specifiedFreshByKey[mappedKey]) {
                  delete freshByKey[key];
                }
              }
            }


          }

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

            let endingPieces = arrayKey.split(",").map(x => Number(x) + 1);
            let jointVarEnding = endingPieces.join('_');

            if (freshByKey[arrayKey]) {
              if (changes['mappedSpecifiedControl' + jointVarEnding]
                || changes['direction' + endingPieces[0]]
              ) {
                delete freshByKey[arrayKey];
                allFresh = false;
              } else {
                allStale = false;
              }
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
      freshenOnNoChanges: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {
        let freshByKey = freshnessInfo.controls.freshByKey;

        if (arrayKeys === undefined) {

          let nPoints = dependencyValues.pointIndMap.length;

          if (dependencyValues.nControlsShadow > nPoints) {
            nPoints = dependencyValues.nControlsShadow;
          }

          for (let ind = 0; ind < nPoints; ind++) {
            freshByKey[[ind, 0]] = true;
            freshByKey[[ind, 1]] = true;
          }
        } else {
          for (let arrayKey of arrayKeys) {
            freshByKey[arrayKey] = true;
          }
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
          let overwriteArray = false;

          if (changes.pointIndMap) {
            overwriteArray = true;
          } else if (changes.specifiedControls) {
            let changedControls = changes.specifiedControls.valuesChanged.specifiedControls.changed;

            if (changedControls === true || changedControls.changedEntireArray === true) {
              overwriteArray = true;
            }
          }

          if (overwriteArray) {
            // send array so that now should overwrite entire array
            let controls = [];
            let essentialControls = {};


            for (let [ind, direction] of dependencyValues.directions.entries()) {

              freshByKey[[ind, 0]] = true;
              freshByKey[[ind, 1]] = true;

              if (direction === "none") {
                controls.push([null, null]);
                continue;
              }

              let mappedInd = dependencyValues.pointIndMap[ind];
              let controlsForPoint = dependencyValues.specifiedControls[mappedInd];

              if (!controlsForPoint) {
                controlsForPoint = [undefined, undefined];
              } else {
                controlsForPoint = [...controlsForPoint];
              }

              if (direction === "symmetric") {
                if (controlsForPoint[0]) {
                  controls.push([controlsForPoint[0], flipVector(controlsForPoint[0])])
                } else {
                  controls.push([undefined, undefined]);
                  essentialControls[[ind, 0]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_1']
                  }
                  essentialControls[[ind, 1]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_2']
                  }
                }
              } else if (direction === "both") {
                if (!controlsForPoint[0]) {
                  controlsForPoint[0] = undefined;
                  essentialControls[[ind, 0]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_1']
                  }
                }
                if (!controlsForPoint[1]) {
                  controlsForPoint[1] = undefined;
                  essentialControls[[ind, 1]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_2']
                  }
                }
                controls.push(controlsForPoint);

              } else if (direction === "next") {
                controlsForPoint[0] = null;
                if (!controlsForPoint[1]) {
                  controlsForPoint[1] = undefined;
                  essentialControls[[ind, 1]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_2']
                  }
                }
                controls.push(controlsForPoint);

              } else {
                // prev
                controlsForPoint[1] = null;
                if (!controlsForPoint[0]) {
                  controlsForPoint[0] = undefined;
                  essentialControls[[ind, 0]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_1']
                  }
                }
                controls.push(controlsForPoint);

              }
            }

            return {
              newValues: {
                controls
              },
              useEssentialOrDefaultValue: {
                controls: essentialControls,
              },
              makeEssential: ["controls"],
            }
          }

          let newControlValues = {};
          let essentialControls = {};

          for (let [ind, direction] of dependencyValues.directions.entries()) {


            let mappedInd = dependencyValues.pointIndMap[ind];
            let controlsForPoint = dependencyValues.specifiedControls[mappedInd];

            if (!controlsForPoint) {
              controlsForPoint = [];
            }

            if (!freshByKey[[ind, 0]]) {
              freshByKey[[ind, 0]] = true;
              if (direction === "none" || direction === "next") {
                newControlValues[[ind, 0]] = null;
              } else {
                if (controlsForPoint[0]) {
                  newControlValues[[ind, 0]] = controlsForPoint[0];
                } else {
                  essentialControls[[ind, 0]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_1']
                  }
                }
              }
            }
            if (!freshByKey[[ind, 1]]) {
              freshByKey[[ind, 1]] = true;
              if (direction === "none" || direction === "previous") {
                newControlValues[[ind, 1]] = null;
              } else if (direction === "symmetric") {
                if (controlsForPoint[0]) {
                  newControlValues[[ind, 1]] = flipVector(controlsForPoint[0]);
                } else {
                  essentialControls[[ind, 1]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_2']
                  }
                }
              } else {
                if (controlsForPoint[1]) {
                  newControlValues[[ind, 1]] = controlsForPoint[1];
                } else {
                  essentialControls[[ind, 1]] = {
                    variablesToCheck: ["controls" + (ind + 1) + '_2']
                  }
                }
              }
            }
          }

          return {
            newValues: {
              controls: newControlValues
            },
            useEssentialOrDefaultValue: {
              controls: essentialControls,
            },
            makeEssential: ["controls"],
          }
        } else {

          // have arrayKeys
          let newControlValues = {};
          let essentialControls = {};

          for (let arrayKey of arrayKeys) {
            let arrayIndices = arrayKey.split(",").map(x => Number(x));
            let varEndings = arrayIndices.map(x => x + 1);
            let jointVarEnding = varEndings.join('_')

            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;

              let direction = dependencyValues["direction" + varEndings[0]];
              if (!direction) {
                newControlValues[arrayKey] = undefined;
              } else {
                let control = dependencyValues['mappedSpecifiedControl' + jointVarEnding];

                if (arrayIndices[1] === 0) {
                  if (direction === "none" || direction === "next") {
                    newControlValues[arrayKey] = null;
                  } else {
                    if (control) {
                      newControlValues[arrayKey] = control;
                    } else {
                      essentialControls[arrayKey] = {
                        variablesToCheck: ["controls" + jointVarEnding]
                      }
                    }
                  }
                } else if (arrayIndices[1] === 1) {
                  if (direction === "none" || direction === "previous") {
                    newControlValues[arrayKey] = null;
                  } else {
                    if (control) {
                      if (direction === "symmetric") {
                        newControlValues[arrayKey] = flipVector(control);
                      } else {
                        newControlValues[arrayKey] = control;

                      }
                    } else {
                      essentialControls[arrayKey] = {
                        variablesToCheck: ["controls" + jointVarEnding]
                      }
                    }
                  }

                }
              }
            }
          }
          return {
            newValues: {
              controls: newControlValues
            },
            useEssentialOrDefaultValue: {
              controls: essentialControls,
            },
            makeEssential: ["controls"],
          }
        }
      },
      inverseDefinition: function ({ desiredStateVariableValues,
        dependencyValues, arrayKeys
      }) {

        // console.log('inverse definition of controls of beziercontrols')
        // console.log(desiredStateVariableValues)
        // console.log(dependencyValues)
        // console.log(arrayKeys);

        let maxControlNum = 0;

        if (arrayKeys === undefined) {
          // working with entire array

          let instructions = [];

          let desiredSpecifiedControls = {};

          for (let arrayKey in desiredStateVariableValues.controls) {

            let arrayIndices = arrayKey.split(",").map(x => Number(x));

            if (arrayIndices[0] > maxControlNum) {
              maxControlNum = arrayIndices[0];
            }

            let direction = dependencyValues.directions[arrayIndices[0]];

            if (direction === "none") {
              continue;
            }

            let mappedInd = dependencyValues.pointIndMap[arrayIndices[0]];

            let controlsForPoint = dependencyValues.specifiedControls[mappedInd];

            let controlForPoint1, controlForPoint2;
            if (controlsForPoint) {
              controlForPoint1 = controlsForPoint[0];
              controlForPoint2 = controlsForPoint[1];
            }

            if (arrayIndices[1] === 0) {
              if (direction !== "next") {
                // if direction is next, then first control is supposed to be null
                // so we ignore it

                if (controlForPoint1) {
                  desiredSpecifiedControls[mappedInd + ",0"] = desiredStateVariableValues.controls[arrayKey];
                } else {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  })
                  if (direction === "symmetric") {
                    // if don't have a control in symmetric case
                    // also save state variable to make it symmetric
                    instructions.push({
                      setStateVariable: "controls",
                      value: { [arrayIndices[0] + ",1"]: flipVector(desiredStateVariableValues.controls[arrayKey]).evaluate_numbers() },
                    })
                  }
                }
              }
            } else if (arrayIndices[1] === 1) {
              if (direction === "symmetric") {
                if (controlForPoint1) {
                  desiredSpecifiedControls[mappedInd + ",0"] = flipVector(desiredStateVariableValues.controls[arrayKey]).evaluate_numbers();
                } else {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  })
                  // if don't have a control in symmetric case
                  // also save state variable to make it symmetric
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayIndices[0] + ",0"]: flipVector(desiredStateVariableValues.controls[arrayKey]).evaluate_numbers() },
                  })
                }


              } else if (direction !== "previous") {
                // if direction is previous, then second control is supposed to be null
                // so we ignore it


                if (controlForPoint2) {
                  desiredSpecifiedControls[mappedInd + ",1"] = desiredStateVariableValues.controls[arrayKey];
                } else {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  })
                }
              }
            }

          }

          if (Object.keys(desiredSpecifiedControls).length > 0) {
            instructions.push({
              setDependency: "specifiedControls",
              desiredValue: desiredSpecifiedControls
            })
          }

          // since setting the whole array, maxControlNum is the number of controls
          // so we set nControlsShadow even if we are decreasing its value

          if (maxControlNum !== dependencyValues.nControlsShadow) {

            instructions.push({
              setDependency: "nControlsShadow",
              desiredValue: maxControlNum
            });
          }

          return {
            success: true,
            instructions
          }

        } else {

          // have arrayKeys

          let instructions = [];

          let maxControlNum = 0;

          for (let arrayKey of arrayKeys) {
            let arrayIndices = arrayKey.split(",").map(x => Number(x));
            let varEndings = arrayIndices.map(x => x + 1);
            let jointVarEnding = varEndings.join('_')
            if (arrayIndices[0] > maxControlNum) {
              maxControlNum = arrayIndices[0];
            }

            let control = dependencyValues['mappedSpecifiedControl' + jointVarEnding];
            let desiredValue = desiredStateVariableValues.controls[arrayKey];
            let direction = dependencyValues["direction" + varEndings[0]];

            if (direction === "none" || !direction) {
              continue;
            }

            if (control) {

              if (arrayIndices[1] === 1 && direction === "symmetric") {
                desiredValue = flipVector(desiredValue).evaluate_numbers();
              }

              instructions.push({
                setDependency: 'mappedSpecifiedControl' + jointVarEnding,
                desiredValue: desiredValue,
              })

            } else {
              if (arrayIndices[1] === 0) {
                if (direction === "symmetric") {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  });
                  // also save symmetric value to state variable
                  let flippedValue = flipVector(desiredStateVariableValues.controls[arrayKey]).evaluate_numbers();
                  let symmetricKey = arrayIndices[0] + ",1";
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [symmetricKey]: flippedValue },
                  })
                } else if (direction === "both" || direction === "previous") {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  })
                }

              } else if (arrayIndices[1] === 1) {

                if (direction === "symmetric") {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  });
                  // also save symmetric value to state variable
                  let flippedValue = flipVector(desiredStateVariableValues.controls[arrayKey]).evaluate_numbers();
                  let symmetricKey = arrayIndices[0] + ",0";
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [symmetricKey]: flippedValue },
                  })
                } else if (direction === "both" || direction === "next") {
                  instructions.push({
                    setStateVariable: "controls",
                    value: { [arrayKey]: desiredStateVariableValues.controls[arrayKey] },
                  });
                }
              }
            }
          }

          // since not setting the whole array, maxControlNum may not be the number of controls
          // so we set nControlsShadow only if we are increasing its value

          if (maxControlNum > dependencyValues.nControlsShadow) {
            instructions.push({
              setDependency: "nControlsShadow",
              value: maxControlNum
            });

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

function flipVector(vector) {
  if (!vector) {
    return
  }

  let vectorTree = vector.tree;
  if (Array.isArray(vectorTree)) {
    return me.fromAst([vectorTree[0], ...vectorTree.slice(1).map(x => ['-', x])])
  } else {
    return me.fromAst(['-', vectorTree])
  }
}


function undefinedToNull(value) {
  if (value === undefined) {
    return null;
  } else {
    return value;
  }
}