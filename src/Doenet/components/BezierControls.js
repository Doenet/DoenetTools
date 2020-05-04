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
      nDimensinos: 2,
      returnDependencies: function ({ arrayKeys }) {
        if (arrayKeys === undefined) {
          return {
            controlChildren: {
              dependencyType: "childStateVariables",
              childLogicName: "atLeastOneControl",
              variableNames: ["coords", "displacement", "points", "nPoints", "vectors", "nVectors"],
              variablesOptional: true
            }
          }
        } else {
          let dependencies = {};

          for (let arrayKey of arrayKeys) {
            let arrayIndex = arrayKey.split(",").map(x => Number(x));

            if (arrayIndex[1] === 0) {
              dependencies['controlChild' + arrayKey] = {
                dependencyType: "childStateVariables",
                childLogicName: "atLeastOneControl",
                variableNames: ["coords", "displacement", "point1", "vector1"],
                variablesOptional: true,
                childIndices: [arrayIndex[0]],
              }
            } else if(arrayIndex[1] === 1) {
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
              for (let key in freshByKey) {
                delete freshByKey[key];
              }
            } else {
              for (let ind in changes.controlChildren.valuesChanged) {
                // TODO: check which of the components actually changed
                console.log(`changes from control child ${ind}`);
                console.log(changes.controlChildren.valuesChanged[ind])
                delete freshByKey[[ind,0]];
                delete freshByKey[[ind,1]];
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

          // have arrayKeys
          // so asked for just one component

          if (changes.controlChild) {
            if (changes.controlChild.componentIdentitiesChanged) {
              delete freshByKey[arrayKey];
            } else {
              if (changes.controlChild.valuesChanged[0]) {
                delete freshByKey[arrayKey];
              }
            }
          }

          return { fresh: { controls: freshByKey[arrayKey] === true } };
        }

      },
      definition: function ({ dependencyValues, arrayKeys, freshnessInfo, changes }) {

        let freshByKey = freshnessInfo.controls.freshByKey;

        // console.log('definition of controls for beziercontrols')
        // console.log(JSON.parse(JSON.stringify(freshByKey)));
        // console.log(JSON.parse(JSON.stringify(dependencyValues)))
        // console.log(JSON.parse(JSON.stringify(changes)))
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          if (changes.controlChildren && changes.controlChildren.componentIdentitiesChanged) {
            // send array so that now should overwrite entire array
            for (let key in dependencyValues.controlChildren) {
              freshByKey[key] = true;
            }

            return {
              newValues: {
                controls: dependencyValues.controlChildren.map(x => getControl(x)),
              }
            }
          }

          let newControlValues = {};
          for (let arrayKey in dependencyValues.controlChildren) {
            if (!freshByKey[arrayKey]) {
              freshByKey[arrayKey] = true;
              newControlValues[arrayKey] = getControl(dependencyValues.controlChildren[arrayKey]);
            }
          }
          return { newValues: { controls: newControlValues } }
        } else {

          // have arrayKey

          if (!freshByKey[arrayKey]) {
            freshByKey[arrayKey] = true;
            let control;
            if (dependencyValues.controlChildren.length === 1) {
              control = getControl(dependencyValues.controlChildren[0])
            }
            return {
              newValues: {
                controls: {
                  [arrayKey]: control
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
        dependencyValues, arrayKeys
      }) {

        // console.log('inverse definition of controls of beziercontrols')
        // console.log(desiredStateVariableValues)
        // console.log(arrayKeys);

        let arrayKey;
        if (arrayKeys) {
          arrayKey = Number(arrayKeys[0]);
        }

        if (arrayKey === undefined) {
          // working with entire array

          let instructions = [];
          for (let key in desiredStateVariableValues.controls) {
            if (!dependencyValues.controlChildren[key]) {
              return { success: false }
            }
            instructions.push(invertControls({
              dependencyName: "controlChildren",
              desiredValue: desiredStateVariableValues.controls[key],
              childIndex: key,
              controlChild: dependencyValues.controlChildren[key]
            }))
            // instructions.push({
            //   setDependency: "pointChildren",
            //   desiredValue: desiredStateVariableValues.points[key],
            //   childIndex: key,
            //   variableIndex: 0
            // })
          }

          return {
            success: true,
            instructions
          }
        } else {

          // just have one arrayKey
          if (!dependencyValues.controlChildren[arrayKey]) {
            return { success: false }
          }
          return {
            success: true,
            instructions: [
              invertControls({
                dependencyName: "controlChild",
                desiredValue: desiredStateVariableValues.controls[arrayKey],
                childIndex: 0,
                controlChild: dependencyValues.controlChildren[arrayKey]
              })
            ]
            // instructions: [{
            //   setDependency: "pointChild",
            //   desiredValue: desiredStateVariableValues.points[arrayKey],
            //   childIndex: 0,
            //   variableIndex: 0
            // }]
          }

        }

      }
    }

    return stateVariableDefinitions;

  }

  updateState(args = {}) {
    if (args.init) {
      this.makeArrayVariable({
        variableName: "controls",
        trackChanges: true
      });
    }

    super.updateState(args);


    if (childrenChanged) {
      let controlInds = this.childLogic.returnMatches("atLeastOneControl");
      this.state.controlChildren = controlInds.map(x => this.activeChildren[x]);
    }

    if (childrenChanged) {
      this.state.controls = [];
    }

    for (let [ind, child] of this.state.controlChildren.entries()) {

    }

  }

  allowDownstreamUpdates() {
    return true;
  }

  get variablesUpdatableDownstream() {
    return ["controls"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newControls = {};
    let newStateVariables = {};
    for (let varName in stateVariablesToUpdate) {
      if (varName === "controls") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          newControls[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    for (let ind in newControls) {
      let child = this.state.controlChildren[ind];
      if (child === undefined) {
        continue;
      }
      let name = child.componentName;


    }

    // this.updateShadowSources({
    //   newStateVariables: newStateVariables,
    //   dependenciesToUpdate: dependenciesToUpdate,
    // });

    return true;

  }

}

function getControls(child) {
  if (child.stateValues.vectors) {
    if (child.stateValues.nVectors === 0) {
      console.log("can't create bezier controlvector with zero vectors");
      return {
        controlType: "vector",
        vectors: [me.fromAst(0)],
      };
    }
    if (child.stateValues.nVectors > 2) {
      throw Error("can't create bezier controlvector with more than two vectors");
    }
    return {
      controlType: "vector",
      vectors: child.stateValues.vectors,
    };
  } else if (child.stateValues.points) {
    if (child.stateValues.nPoints === 0) {
      console.log("can't create bezier controlpoint with zero points");
      return {
        controlType: "point",
        points: [me.fromAst(0)],
      };
    }
    if (child.stateValues.nPoints > 2) {
      throw Error("can't create bezier controlpoint with more than two points");
    }
    return {
      controlType: "point",
      points: child.stateValues.points,
    };
  } else if (child.stateValues.displacement) {
    return {
      controlType: "vector",
      vectors: [child.stateValues.displacement],
    };
  } else {
    return {
      controlType: "point",
      points: [child.stateValues.coords],
    };
  }

}

function invertControls({
  dependencyName,
  desiredValue,
  childIndex,
  controlChild,
}) {

  // variableNames: ["coords", "displacement", "points", "nPoints", "vectors", "nVectors"],

  if (controlChild.stateValues.vectors) {

    return {
      setDependency: dependencyName,
      desiredValue,
      childIndex,
      variableIndex: 4
    }
  }

  if (child instanceof this.allComponentClasses.controlvectors) {
    let vectors = child.state.vectors;
    for (let ind2 = 0; ind2 < vectors.length; ind2++) {
      if (newControls[ind][ind2] !== undefined) {
        let vectorName = vectors[ind2].componentName;
        dependenciesToUpdate[vectorName] = { displacement: { changes: newControls[ind][ind2] } };
      }
    }
  } else if (child instanceof this.allComponentClasses.controlpoints) {
    let points = child.state.points;
    for (let ind2 = 0; ind2 < points.length; ind2++) {
      if (newControls[ind][ind2] !== undefined) {
        let pointName = points[ind2].componentName;
        dependenciesToUpdate[pointName] = { coords: { changes: newControls[ind][ind2] } };
      }
    }
  } else if (child instanceof this.allComponentClasses.vector) {
    dependenciesToUpdate[name] = { displacement: { changes: newControls[ind][0] } };
  } else if (child instanceof this.allComponentClasses.point) {
    dependenciesToUpdate[name] = { coords: { changes: newControls[ind][0] } };
  }

}