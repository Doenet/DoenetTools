import CompositeComponent from './abstract/CompositeComponent';
import { postProcessRef, refReplacementFromProp, processChangesForReplacements } from './Ref';


export default class Collect extends CompositeComponent {
  static componentType = "collect";

  static takesComponentName = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.maximumNumber = { default: undefined };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addRefTarget = function ({ activeChildrenMatched }) {
      // add <reftarget> around string
      return {
        success: true,
        newChildren: [{
          componentType: "reftarget", children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }]
        }],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: 'exactlyOneString',
      componentType: 'string',
      number: 1,
      isSugar: true,
      affectedBySugar: ["exactlyOneRefTarget"],
      replacementFunction: addRefTarget,
    });

    let atMostOnePropForString = childLogic.newLeaf({
      name: "atMostOnePropForString",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
    });

    let exactlyOneComponentTypesForString = childLogic.newLeaf({
      name: "exactlyOneComponentTypesForString",
      componentType: "componentTypes",
      number: 1,
    })

    let stringWithOptionalProp = childLogic.newOperator({
      name: "stringWithOptionalProp",
      propositions: [
        exactlyOneString,
        atMostOnePropForString,
        exactlyOneComponentTypesForString,
      ],
      operator: 'and',
    })

    let exactlyOneRefTarget = childLogic.newLeaf({
      name: 'exactlyOneRefTarget',
      componentType: 'reftarget',
      number: 1,
    });

    let exactlyOneComponentTypes = childLogic.newLeaf({
      name: "exactlyOneComponentTypes",
      componentType: "componentTypes",
      number: 1,
    })

    let atMostOneProp = childLogic.newLeaf({
      name: "atMostOneProp",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
    });

    let refTargetWithOptionalProp = childLogic.newOperator({
      name: "refTargetWithOptionalProp",
      operator: "and",
      propositions: [
        exactlyOneRefTarget,
        atMostOneProp,
        exactlyOneComponentTypes,
      ]
    });

    childLogic.newOperator({
      name: "refTargetPropXorSugar",
      operator: "xor",
      propositions: [refTargetWithOptionalProp, stringWithOptionalProp],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.refTarget = {
      returnDependencies: () => ({
        refTargetChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneRefTarget",
          variableNames: ["refTarget"],
        },
      }),
      defaultValue: undefined,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.refTargetChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              refTarget: { variablesToCheck: "refTarget" }
            }
          }
        }
        return { newValues: { refTarget: dependencyValues.refTargetChild[0].stateValues.refTarget } }
      },
    };

    stateVariableDefinitions.refTargetName = {
      returnDependencies: () => ({
        refTarget: {
          dependencyType: "stateVariable",
          variableName: "refTarget",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { refTargetName: dependencyValues.refTarget.componentName } }
      },
    };

    stateVariableDefinitions.useProp = {
      returnDependencies: () => ({
        propChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneProp",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.propChild.length === 0) {
          return {
            newValues: { useProp: false }
          };
        } else {
          return {
            newValues: { useProp: true }
          };
        }
      }
    }

    stateVariableDefinitions.componentTypesToCollect = {
      returnDependencies: () => ({
        componentTypesChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneComponentTypes",
          variableNames: ["texts"],
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            componentTypesToCollect: dependencyValues.componentTypesChild[0].stateValues.texts
          }
        }
      }
    }

    stateVariableDefinitions.componentClassesToCollect = {
      returnDependencies: () => ({
        componentTypesToCollect: {
          dependencyType: "stateVariable",
          variableName: "componentTypesToCollect",
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let componentClassesToCollect = [];
        for (let ct of dependencyValues.componentTypesToCollect) {
          let cClass = componentInfoObjects.allComponentClasses[ct];
          if (cClass === undefined) {
            let message = "Cannot collect component type " + ct + ". Component type not found.";
            console.warn(message);
          } else {
            componentClassesToCollect.push(cClass);
          }
        }

        return { newValues: { componentClassesToCollect } }

      }
    }

    stateVariableDefinitions.collectedComponents = {
      stateVariablesDeterminingDependencies: ["componentTypesToCollect", "refTargetName"],
      returnDependencies: ({ stateValues }) => ({
        descendants: {
          dependencyType: "componentDescendantIdentity",
          ancestorName: stateValues.refTargetName,
          componentTypes: stateValues.componentTypesToCollect,
          useReplacementsForComposites: true,
          includeNonActiveChildren: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber"
        }
      }),
      definition: function ({ dependencyValues }) {

        let collectedComponents = dependencyValues.descendants;

        if (dependencyValues.maximumNumber !== undefined && collectedComponents.length > dependencyValues.maximumNumber) {
          let maxnum = Math.max(0, Math.floor(dependencyValues.maximumNumber));
          collectedComponents = collectedComponents.slice(0, maxnum)
        }

        return {
          newValues: { collectedComponents }
        }

      }
    }



    stateVariableDefinitions.effectiveTargetClasses = {
      returnDependencies: () => ({
        collectedComponents: {
          dependencyType: "stateVariable",
          variableName: "collectedComponents",
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let effectiveTargetClasses = dependencyValues.collectedComponents
          .map(x => componentInfoObjects.allComponentClasses[x.componentType]);
        return {
          newValues: { effectiveTargetClasses }
        };
      },
    };

    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: ["propVariableObjs", "stateVariablesRequested", "validProp"],
      returnDependencies: () => ({
        effectiveTargetClasses: {
          dependencyType: "stateVariable",
          variableName: "effectiveTargetClasses",
        },
        collectedComponents: {
          dependencyType: "stateVariable",
          variableName: "collectedComponents",
        },
        propChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneProp",
          variableNames: ["propVariableObjs", "propComponentTypes"],
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        if (dependencyValues.propChild.length === 0) {
          return {
            newValues: {
              replacementClasses: dependencyValues.effectiveTargetClasses,
              propVariableObjs: undefined,
              stateVariablesRequested: undefined,
              validProp: undefined,
            }
          };
        }

        let propVariableObjs = dependencyValues.propChild[0].stateValues.propVariableObjs;
        let propComponentTypes = dependencyValues.propChild[0].stateValues.propComponentTypes;

        let validProp = true;

        let replacementClasses = [];

        if (propComponentTypes === undefined) {
          validProp = false;
        } else {
          for (let propComponentType of propComponentTypes) {
            if (propComponentType === undefined) {
              console.warn(`Have not implemented case of collect of prop with undefined component type`)
              validProp = false;
              replacementClasses.push(undefined);
            } else {
              replacementClasses.push(componentInfoObjects.allComponentClasses[propComponentType.toLowerCase()]);
            }
          }
        }

        if (!validProp) {
          return {
            newValues: {
              replacementClasses: undefined,
              propVariableObjs,
              stateVariablesRequested: undefined,
              validProp,
            }
          };
        }

        let stateVariablesRequested = [];

        for (let [index, propVariableObj] of propVariableObjs.entries()) {
          stateVariablesRequested.push({
            componentOrReplacementOf: dependencyValues.collectedComponents[index].componentName,
            stateVariable: propVariableObj.varName,
          })
        }
        return {
          newValues: {
            replacementClasses: replacementClasses,
            propVariableObjs,
            stateVariablesRequested,
            validProp,
          }
        };

      }
    }


    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        collectedComponents: {
          dependencyType: "stateVariable",
          variableName: "replacementClasses"
        }
      }),
      definition: () => ({
        newValues: { readyToExpandWhenResolved: true }
      })
    }

    return stateVariableDefinitions;

  }



  static createSerializedReplacements({ component, components, getComponentNamesForProp, workspace }) {


    if (component.stateValues.refTarget === undefined) {
      return { replacements: [] };
    }

    let replacements = [];

    let numReplacementsByCollected = [];

    for (let collectedNum = 0; collectedNum < component.stateValues.collectedComponents.length; collectedNum++) {
      if (component.stateValues.collectedComponents[collectedNum] !== undefined) {
        let collectedReplacements = this.createReplacementForCollected({ component, collectedNum, components, getComponentNamesForProp });
        numReplacementsByCollected[collectedNum] = collectedReplacements.length;
        replacements.push(...collectedReplacements);
      } else {
        numReplacementsByCollected[collectedNum] = 0;
      }
    }

    workspace.numReplacementsByCollected = numReplacementsByCollected;

    return { replacements };

  }


  static createReplacementForCollected({ component, collectedNum, components, getComponentNamesForProp }) {

    if (component.stateValues.useProp) {

      let componentOrReplacementNames = getComponentNamesForProp(component.stateValues.collectedComponents[collectedNum].componentName);

      return refReplacementFromProp({ component, components, componentOrReplacementNames });
    }

    let target = components[component.stateValues.collectedComponents[collectedNum].componentName];

    let serializedCopy = [target.serialize({ forReference: true })];

    return postProcessRef({ serializedComponents: serializedCopy, componentName: component.componentName });

  }

  static calculateReplacementChanges({ component, componentChanges, components }) {

    // console.log("Calculating replacement changes for " + component.componentName);
    let replacementChanges = [];

    // if there are no children in location of childnumber
    // or prop doesn't currently refer to a target
    // or didn't collect any components
    // delete the replacements (if they currently exist)
    if (component.state.refTarget === undefined || component.state.collectedComponents.length === 0) {
      if (component.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: component.replacements.length,
        }

        replacementChanges.push(replacementInstruction);
      }

      return replacementChanges;

    }

    // check if refTarget has changed or previously had no collected components
    if (component.state.previousRefTarget === undefined ||
      component.state.refTarget.componentName !== component.state.previousRefTarget.componentName ||
      component.state.previousCollectedComponents.length === 0) {

      this.recreateAllReplacements({ component, replacementChanges, components });

      return replacementChanges;
    }

    // have same ref target and there are previous and current collected components
    // attempt to match the collected components

    // initialize as having all previous components deleted and current components created
    let originOfCurrent = component.state.collectedComponents.map(_x => ({ create: true }));
    let destinationOfPrevious = component.state.previousCollectedComponents.map(_x => ({ delete: true }));

    let lastPrevInd = -1;
    for (let indCur = 0; indCur < component.state.collectedComponents.length; indCur++) {
      let componentName = component.state.collectedComponents[indCur].componentName;
      for (let indPrev = lastPrevInd + 1; indPrev < component.state.previousCollectedComponents.length; indPrev++) {
        if (component.state.previousCollectedComponents[indPrev].componentName === componentName) {
          originOfCurrent[indCur] = { create: false, fromPrevious: indPrev };
          destinationOfPrevious[indPrev] = { delete: false, toCurrent: indCur };
          lastPrevInd = indPrev;
          break;
        }
      }
    }

    // cumulative sum: https://stackoverflow.com/a/44081700
    // include extra index so keep track of replacements in last index
    let replacementIndexByCollected = [0, ...component.state.numReplacementsByCollected];
    replacementIndexByCollected = replacementIndexByCollected.reduce(
      (a, x, i) => [...a, x + (a[i - 1] || 0)], []);

    let numDeletedSoFar = 0;
    let numIndicesDeleted = 0;
    // specify delete instructions
    for (let ind = 0; ind < destinationOfPrevious.length; ind++) {
      if (destinationOfPrevious[ind].delete) {
        let numToDelete = component.state.numReplacementsByCollected[ind];
        if (numToDelete > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: replacementIndexByCollected[ind - numIndicesDeleted] - numDeletedSoFar,
            numberReplacementsToDelete: numToDelete,
          }
          numDeletedSoFar += numToDelete;
          replacementChanges.push(replacementInstruction);
        }
        replacementIndexByCollected.splice(ind - numIndicesDeleted, 1);
        numIndicesDeleted++;

      }
    }


    let newNumReplacementsByCollected = [];

    let numReplacementsSoFar = 0;

    // specify add or instructions
    // let lastReplacementInd = component.replacements.length;
    for (let collectedNum = 0; collectedNum < originOfCurrent.length; collectedNum++) {
      if (originOfCurrent[collectedNum].create) {

        // create new 
        let newSerializedReplacements = this.createReplacementForCollected({ component, collectedNum, components });
        let numToAdd = newSerializedReplacements.length;
        newNumReplacementsByCollected[collectedNum] = numToAdd;

        if (numToAdd > 0) {
          let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToReplace: 0,
            serializedReplacements: newSerializedReplacements,
          };


          // changesByInd[numReplacementsSoFar].push(replacementInstruction);
          replacementChanges.push(replacementInstruction);


          replacementInstruction = {
            changeType: "addDependency",
            dependencyDirection: "downstream",
            newComponentName: component.state.collectedComponents[collectedNum].componentName,
            dependencyType: "reference",
            otherAttributes: { shadowed: true }
          };
          if (component.state.propChild === undefined) {
            replacementInstruction.recurseToChildren = true;
          }
          // changesByInd[numReplacementsSoFar].push(replacementInstruction);
          replacementChanges.push(replacementInstruction);

          numReplacementsSoFar += newSerializedReplacements.length;

          replacementIndexByCollected.splice(collectedNum, 0, 0);

        }
      } else {
        // will create any earlier current at index of this replacement index
        let prevCollectedNum = originOfCurrent[collectedNum].fromPrevious;
        // lastReplacementInd = replacementIndexByCollected[prevCollectedNum];

        let prevNumReplacements = component.state.numReplacementsByCollected[prevCollectedNum];

        // if ref determined by prop
        if (component.state.propChild !== undefined) {
          let redoReplacements = false;
          let testReplacementChanges = [];
          let results;

          // don't change replacements unless
          // the number of components or their component types changed
          results = this.recreateReplacements({
            component,
            collectedNum: collectedNum,
            numReplacementsSoFar: numReplacementsSoFar,
            prevNumReplacements: prevNumReplacements,
            replacementChanges: testReplacementChanges,
            components,
          });


          let changeInstruction = testReplacementChanges[testReplacementChanges.length - 1];
          let newSerializedReplacements = changeInstruction.serializedReplacements;

          if (newSerializedReplacements.length !== prevNumReplacements) {
            redoReplacements = true;
          } else {
            for (let ind = 0; ind < newSerializedReplacements.length; ind++) {
              if (newSerializedReplacements[ind].componentType !==
                component.replacements[replacementIndexByCollected[collectedNum] + ind].componentType) {
                redoReplacements = true;
                break;
              }
            }
          }

          if (redoReplacements) {
            // changesByInd[numReplacementsSoFar].push(...testReplacementChanges);
            replacementChanges.push(...testReplacementChanges);

            newNumReplacementsByCollected[collectedNum] = results.numReplacements;
            numReplacementsSoFar += results.numReplacements;
          } else {
            newNumReplacementsByCollected[collectedNum] = prevNumReplacements;
            numReplacementsSoFar += prevNumReplacements;

          }

        } else {

          // ref not determined by a prop

          // filter out downstream dependencies just for this collected component
          let collecteDownstream = component.getReferenceFromCollected(
            component.state.collectedComponents[collectedNum]
          );

          // look for changes that are in downstream dependencies
          let additionalReplacementChanges = processChangesForReplacements({
            componentChanges: componentChanges,
            componentName: component.componentName,
            downstreamDependencies: collecteDownstream,
            components: components
          })

          // changesByInd[numReplacementsSoFar].push(...additionalReplacementChanges);
          replacementChanges.push(...additionalReplacementChanges);

          newNumReplacementsByCollected[collectedNum] = prevNumReplacements;
          numReplacementsSoFar += prevNumReplacements;

          for (let change of additionalReplacementChanges) {
            if (change.changeTopLevelReplacements) {
              if (change.changeType === "add") {
                let numReplacementsAdded = change.serializedReplacements.length - change.numberReplacementsToReplace;
                newNumReplacementsByCollected[collectedNum] += numReplacementsAdded;
                numReplacementsSoFar += numReplacementsAdded;
              } else if (change.changeType === "delete") {
                newNumReplacementsByCollected[collectedNum] -= change.numberReplacementsToDelete;
                numReplacementsSoFar -= change.numberReplacementsToDelete;
              }
            }
          }
        }
      }
    }

    let replacementInstruction = {
      changeType: "updateStateVariables",
      component: component,
      stateChanges: { numReplacementsByCollected: newNumReplacementsByCollected },
      allowChangeToNonEssential: true,
    }
    replacementChanges.push(replacementInstruction);


    return replacementChanges;

  }

  getReferenceFromCollected(component) {
    let collectedDeps = {};

    let thisDep = this.downstreamDependencies[component.componentName];
    if (thisDep === undefined) {
      return {};
    }

    collectedDeps[component.componentName] = thisDep;

    if (!(component instanceof this.allComponentClasses['_composite'])) {
      for (let child of component.definingChildren) {
        Object.assign(collectedDeps, this.getReferenceFromCollected(child));
      }
    }

    return collectedDeps;
  }

  static recreateAllReplacements({ component, replacementChanges, components }) {
    if (component.state.previousRefTarget !== undefined) {
      if (component.state.previousRefTarget.componentName !== component.state.refTarget.componentName) {
        let replacementInstruction = {
          changeType: "moveDependency",
          dependencyDirection: "downstream",
          oldComponentName: component.state.previousRefTarget.componentName,
          newComponentName: component.state.refTarget.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true }
        };
        if (component.state.propChild !== undefined) {
          replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
        }
        replacementChanges.push(replacementInstruction);
      }
    }
    else {
      // since no previous refTarget, need to create new dependencies
      let replacementInstruction = {
        changeType: "addDependency",
        dependencyDirection: "downstream",
        newComponentName: component.state.refTarget.componentName,
        dependencyType: "reference",
        otherAttributes: { shadowed: true }
      };
      if (component.state.propChild !== undefined) {
        replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
      }
      replacementChanges.push(replacementInstruction);
    }

    let results = this.createSerializedReplacements({ component, components });

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: results.replacements,
    };
    replacementChanges.push(replacementInstruction);

    replacementInstruction = {
      changeType: "updateStateVariables",
      component: component,
      stateChanges: results.stateVariableChanges,
      allowChangeToNonEssential: true,
    }
    replacementChanges.push(replacementInstruction);

    for (let collectedNum = 0; collectedNum < component.state.collectedComponents.length; collectedNum++) {
      replacementInstruction = {
        changeType: "addDependency",
        dependencyDirection: "downstream",
        newComponentName: component.state.collectedComponents[collectedNum].componentName,
        dependencyType: "reference",
        otherAttributes: { shadowed: true }
      };
      if (component.state.propChild === undefined) {
        replacementInstruction.recurseToChildren = true;
      } else {
        replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
      }
      replacementChanges.push(replacementInstruction);
    }

  }


  static recreateReplacements({ component, collectedNum, numReplacementsSoFar, prevNumReplacements, replacementChanges, components }) {

    let newSerializedChildren = this.createReplacementForCollected({ component, collectedNum, components });

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: prevNumReplacements,
      serializedReplacements: newSerializedChildren,
    };
    replacementChanges.push(replacementInstruction);

    return { numReplacements: newSerializedChildren.length }
  }

}
