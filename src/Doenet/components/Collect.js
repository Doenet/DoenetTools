import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';


export default class Collect extends CompositeComponent {
  static componentType = "collect";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.maximumNumber = { default: undefined };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneTname = childLogic.newLeaf({
      name: 'exactlyOneTname',
      componentType: 'tname',
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

    let tnameWithOptionalProp = childLogic.newOperator({
      name: "tnameWithOptionalProp",
      operator: "and",
      propositions: [
        exactlyOneTname,
        atMostOneProp,
        exactlyOneComponentTypes,
      ],
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetComponent = {
      returnDependencies: () => ({
        tnameChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneTname",
          variableNames: ["targetComponent"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.tnameChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              targetComponent: { variablesToCheck: "targetComponent" }
            }
          }
        }
        return { newValues: { targetComponent: dependencyValues.tnameChild[0].stateValues.targetComponent } }
      },
    };

    stateVariableDefinitions.targetName = {
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.targetComponent === null) {
          console.warn(`No copy target`);
          return { newValues: { targetName: "" } }
        }
        return { newValues: { targetName: dependencyValues.targetComponent.componentName } }
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
            newValues: {
              useProp: false,
            }
          };
        } else {
          return {
            newValues: {
              useProp: true,
            }
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
        if (dependencyValues.componentTypesChild.length === 1) {
          return {
            newValues: {
              componentTypesToCollect: dependencyValues.componentTypesChild[0].stateValues.texts
            }
          }
        } else {
          return {
            newValues: {
              componentTypesToCollect: []
            }
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
      stateVariablesDeterminingDependencies: ["componentTypesToCollect", "targetName"],
      returnDependencies: function ({ stateValues }) {
        if (!stateValues.targetName) {
          return {};
        }
        return {
          descendants: {
            dependencyType: "componentDescendantIdentity",
            ancestorName: stateValues.targetName,
            componentTypes: stateValues.componentTypesToCollect,
            useReplacementsForComposites: true,
            includeNonActiveChildren: true,
            recurseToMatchedChildren: false,
          },
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber"
          }
        }
      },
      definition: function ({ dependencyValues }) {

        // console.log(`definition of collectedComponents`)
        // console.log(dependencyValues)

        let collectedComponents = dependencyValues.descendants;
        if(!collectedComponents) {
          collectedComponents = [];
        }

        if (dependencyValues.maximumNumber !== null && collectedComponents.length > dependencyValues.maximumNumber) {
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


    stateVariableDefinitions.propVariableObjs = {
      returnDependencies: () => ({
        propChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneProp",
          variableNames: ["propVariableObjs"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.propChild.length === 0) {
          return {
            newValues: {
              propVariableObjs: null
            }
          }
        } else {
          return {
            newValues: {
              propVariableObjs: dependencyValues.propChild[0].stateValues.propVariableObjs
            }
          }
        }
      }
    }


    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: [
        "stateVariablesRequested", "validProp", "componentTypeByCollected"
      ],
      stateVariablesDeterminingDependencies: [
        "propVariableObjs", "collectedComponents",
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          effectiveTargetClasses: {
            dependencyType: "stateVariable",
            variableName: "effectiveTargetClasses",
          },
          collectedComponents: {
            dependencyType: "stateVariable",
            variableName: "collectedComponents",
          },
          useProp: {
            dependencyType: "stateVariable",
            variableName: "useProp",
          },
          propVariableObjs: {
            dependencyType: "stateVariable",
            variableName: "propVariableObjs",
          },
        }


        // if have a prop variable where couldn't determine componentType
        // from just the component class, we will get 
        // componentType of the actual statevariable
        // of the collected component
        // Also, get actual statevariable for arrays so that can determine their size
        if (stateValues.propVariableObjs !== null) {
          for (let [ind, propVariableObj] of stateValues.propVariableObjs.entries()) {
            if (!propVariableObj.componentType) {
              dependencies[`replacementComponentType${ind}`] = {
                dependencyType: "componentStateVariableComponentType",
                componentIdentity: stateValues.collectedComponents[ind],
                variableName: propVariableObj.varName,
              }
            }
            if (propVariableObj.isArray) {
              dependencies[`targetArray${ind}`] = {
                dependencyType: "componentStateVariable",
                componentIdentity: stateValues.collectedComponents[ind],
                variableName: propVariableObj.varName,
              }
            }
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        if (!dependencyValues.useProp) {
          return {
            newValues: {
              replacementClasses: dependencyValues.effectiveTargetClasses,
              stateVariablesRequested: null,
              validProp: null,
              componentTypeByCollected: null,
            }
          };
        }

        if (dependencyValues.propVariableObjs === null) {
          return {
            newValues: {
              replacementClasses: null,
              stateVariablesRequested: null,
              validProp: false,
              componentTypeByCollected: null,
            }
          };
        }


        let replacementClasses = [];
        let stateVariablesRequested = [];
        let componentTypeByCollected = [];

        for (let [ind, propVariableObj] of dependencyValues.propVariableObjs.entries()) {
          let componentType = propVariableObj.componentType;
          if (!componentType) {
            componentType = dependencyValues[`replacementComponentType${ind}`];
          }

          if (Array.isArray(componentType)) {
            replacementClasses.push(...componentType.map(x =>
              componentInfoObjects.allComponentClasses[x])
            );
          } else if (propVariableObj.isArray) {
            // TODO: what about multi-dimensional arrays?
            let arrayLength = dependencyValues[`targetArray${ind}`].length;
            let componentClass = componentInfoObjects.allComponentClasses[componentType];
            replacementClasses.push(...Array(arrayLength).fill(componentClass));
            componentType = Array(arrayLength).fill(componentType);
          } else {
            replacementClasses.push(componentInfoObjects.allComponentClasses[componentType]);
          }

          componentTypeByCollected.push(componentType);

          stateVariablesRequested.push({
            componentOrReplacementOf: dependencyValues.collectedComponents[ind].componentName,
            stateVariable: propVariableObj.varName,
          })
        }

        return {
          newValues: {
            replacementClasses,
            stateVariablesRequested,
            validProp: true,
            componentTypeByCollected,
          }
        };

      }
    }



    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({
        replacementClasses: {
          dependencyType: "stateVariable",
          variableName: "replacementClasses"
        },
        needsReplacementsUpdatedWhenStale: {
          dependencyType: "stateVariable",
          variableName: "needsReplacementsUpdatedWhenStale"
        }
      }),
      definition: () => ({
        newValues: { readyToExpand: true }
      })
    }


    // similar to collectedComponents state variable
    // but include prop variable if have a prop
    // Note: this collects components a second time when have a prop
    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      stateVariablesDeterminingDependencies: [
        "componentTypesToCollect", "targetName", "propVariableObjs"
      ],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber"
          }
        }

        if (stateValues.propVariableObjs === null) {
          dependencies.collectedComponents = {
            dependencyType: "stateVariable",
            variableName: "collectedComponents"
          }
        } else {
          dependencies.descendantsWithProp = {
            dependencyType: "componentDescendantStateVariables",
            variableNames: [stateValues.propVariableObjs[0].varName],
            ancestorName: stateValues.targetName,
            componentTypes: stateValues.componentTypesToCollect,
            useReplacementsForComposites: true,
            includeNonActiveChildren: true,
            recurseToMatchedChildren: false,
          }
        }

        return dependencies;
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale: () => ({ updateReplacements: true }),
      definition: () => ({ newValues: { needsReplacementsUpdatedWhenStale: true } })
    }

    return stateVariableDefinitions;

  }



  static createSerializedReplacements({ component, components, workspace }) {

    // console.log(`create serialized replacements for ${component.componentName}`)

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (component.stateValues.targetComponent === undefined) {
      return { replacements: [] };
    }

    let replacements = [];

    let numReplacementsByCollected = [];
    let numReplacementsSoFar = 0;

    for (let collectedNum = 0; collectedNum < component.stateValues.collectedComponents.length; collectedNum++) {
      if (component.stateValues.collectedComponents[collectedNum] !== undefined) {
        let collectedReplacements = this.createReplacementForCollected({
          component,
          collectedNum,
          components,
          numReplacementsSoFar
        });
        numReplacementsByCollected[collectedNum] = collectedReplacements.length;
        numReplacementsSoFar += collectedReplacements.length;
        replacements.push(...collectedReplacements);
      } else {
        numReplacementsByCollected[collectedNum] = 0;
      }
    }

    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = component.stateValues.collectedComponents.map(x => x.componentName)

    return { replacements };

  }



  static createReplacementForCollected({ component, components, collectedNum, numReplacementsSoFar }) {

    // console.log(`create replacement for collected ${collectedNum}, ${numReplacementsSoFar}`)

    if (!component.stateValues.useProp) {

      let target = components[component.stateValues.collectedComponents[collectedNum].componentName];

      let serializedCopy = [target.serialize({ forCopy: true })];

      return postProcessCopy({ serializedComponents: serializedCopy, componentName: component.componentName });
    }

    let serializedReplacements = [];

    let replacementInd = numReplacementsSoFar - 1;
    let propVariableObj = component.stateValues.propVariableObjs[collectedNum];
    let componentTypes = component.stateValues.componentTypeByCollected[collectedNum];

    let numReplacementsForCollected = 1;
    if (Array.isArray(componentTypes)) {
      numReplacementsForCollected = componentTypes.length;
    }

    let collectedName = component.stateValues.collectedComponents[collectedNum].componentName;
    let collectedComponent = components[collectedName];

    for (let ind = 0; ind < numReplacementsForCollected; ind++) {
      replacementInd++;

      let replacementClass = component.stateValues.replacementClasses[replacementInd];

      let componentType = replacementClass.componentType

      if (propVariableObj.isArray) {
        let arrayStateVarObj = collectedComponent.state[propVariableObj.varName];

        // TODO: generalize to multi-dimensional arrays

        let arrayKey = arrayStateVarObj.indexToKey(ind);
        serializedReplacements.push({
          componentType,
          downstreamDependencies: {
            [collectedName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey),
              // arrayStateVariable: propVariableObj.varName,
              // arrayKey
            }]
          }
        })
      } else if (propVariableObj.isArrayEntry) {

        let arrayStateVarObj = collectedComponent.state[propVariableObj.arrayVarName];
        let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
          varEnding: propVariableObj.varEnding,
          arrayEntryPrefix: propVariableObj.arrayEntryPrefix,
        });

        // TODO: commented out below two conditiions to get tests to pass
        // Check why these conditions were added in the first place.

        // let entryValue = targetComponent.state[propVariableObj.varName].value;

        // if (entryValue !== undefined) {
        let arrayKey = arrayKeys[ind];
        // if (arrayStateVarObj.getArrayValue({ arrayKey }) !== undefined) {
        serializedReplacements.push({
          componentType,
          downstreamDependencies: {
            [collectedName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey),
              // propVariable: propVariableObj.varName,
              // arrayStateVariable: propVariableObj.arrayVarName,
              // arrayKey
            }]
          }
        })
        // }
        // }

      } else {
        serializedReplacements.push({
          componentType,
          downstreamDependencies: {
            [collectedName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: propVariableObj.varName,
            }]
          }
        })
      }
    }

    return serializedReplacements;

  }


  static calculateReplacementChanges({ component, componentChanges, components, workspace }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    let replacementChanges = [];

    let numReplacementsSoFar = 0;

    let numReplacementsByCollected = [];

    // // cumulative sum: https://stackoverflow.com/a/44081700
    // let replacementIndexByCollected = [0, ...workspace.numReplacementsByCollected];
    // replacementIndexByCollected = replacementIndexByCollected.reduce(
    //   (a, x, i) => [...a, x + (a[i - 1] || 0)], []);


    let maxCollectedLength = Math.max(component.stateValues.collectedComponents.length, workspace.numReplacementsByCollected.length);

    for (let collectedNum = 0; collectedNum < maxCollectedLength; collectedNum++) {
      let collected = component.stateValues.collectedComponents[collectedNum];
      if (collected === undefined) {
        if (workspace.numReplacementsByCollected[collectedNum] > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToDelete: workspace.numReplacementsByCollected[collectedNum],
          }

          replacementChanges.push(replacementInstruction);

          numReplacementsByCollected[collectedNum] = 0;
        }
        continue;
      }

      let prevCollectedName = workspace.collectedNames[collectedNum];

      // check if collected has changed
      if (prevCollectedName === undefined || collected.componentName !== prevCollectedName) {

        let prevNumReplacements = 0;
        if (prevCollectedName !== undefined) {
          prevNumReplacements = workspace.numReplacementsByCollected[collectedNum];
        }
        let results = this.recreateReplacements({
          component,
          collectedNum,
          numReplacementsSoFar,
          prevNumReplacements,
          replacementChanges,
          components,
          workspace,
        });

        numReplacementsSoFar += results.numReplacements;

        numReplacementsByCollected[collectedNum] = results.numReplacements;

        continue;
      }

      let redoReplacements = false;
      let testReplacementChanges = [];
      let results;


      // don't change replacements unless
      // the number of components or their component types changed
      results = this.recreateReplacements({
        component,
        collectedNum,
        numReplacementsSoFar,
        prevNumReplacements: workspace.numReplacementsByCollected[collectedNum],
        replacementChanges: testReplacementChanges,
        components,
      });

      let changeInstruction = testReplacementChanges[testReplacementChanges.length - 1];
      let newSerializedReplacements = changeInstruction.serializedReplacements;

      if (newSerializedReplacements.length !== workspace.numReplacementsByCollected[collectedNum]) {
        redoReplacements = true;
      } else {
        for (let ind = 0; ind < newSerializedReplacements.length; ind++) {
          if (newSerializedReplacements[ind].componentType !==
            component.replacements[numReplacementsSoFar + ind].componentType) {
            redoReplacements = true;
            break;
          }
        }
      }


      if (redoReplacements) {
        replacementChanges.push(...testReplacementChanges);

        numReplacementsSoFar += results.numReplacements;
        numReplacementsByCollected[collectedNum] = results.numReplacements;
      } else {
        numReplacementsSoFar += workspace.numReplacementsByCollected[collectedNum];
        numReplacementsByCollected[collectedNum] = workspace.numReplacementsByCollected[collectedNum];
      }

    }


    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = component.stateValues.collectedComponents.map(x => x.componentName)

    // console.log(replacementChanges);


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


  static recreateReplacements({ component, collectedNum, numReplacementsSoFar, prevNumReplacements, replacementChanges, components }) {

    let newSerializedChildren = this.createReplacementForCollected({ component, collectedNum, components, numReplacementsSoFar });

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
