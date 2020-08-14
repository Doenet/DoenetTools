import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';
import { flattenLevels, flattenDeep } from '../utils/array';
import { getUniqueIdentifierFromBase } from '../utils/naming';


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
        if (!collectedComponents) {
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

    // If there is no prop, replacementClasses are the effectiveTargetClasses
    // If there is a prop, replacement classes are determined by componentType
    // of propVariableObjs
    // Except that, if propVariableObjs doesn't have componentType specified,
    // then the componentType is determined by the actual statevariable of collected components
    // We also track potentialReplacementClasses, which is all possible
    // replacementClasses this copy might return if array parameters change
    // (needed to load potential renderers)
    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: [
        "stateVariablesRequested", "validProp", "componentTypeByCollected",
        "potentialReplacementClasses",
        "propDependenciesSetUp"
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
        // Also, get size for arrays and
        // actual statevariable for array entries (so that can determine their size)
        if (stateValues.propVariableObjs !== null) {
          for (let [ind, propVariableObj] of stateValues.propVariableObjs.entries()) {
            if (!propVariableObj.componentType) {
              dependencies[`replacementComponentType${ind}`] = {
                dependencyType: "componentStateVariableComponentType",
                componentIdentity: stateValues.collectedComponents[ind],
                variableName: propVariableObj.varName,
              }
            }
            if (propVariableObj.isArrayEntry) {
              dependencies[`targetArray${ind}`] = {
                dependencyType: "componentStateVariable",
                variableName: propVariableObj.varName,
                componentIdentity: stateValues.collectedComponents[ind],
              }
            } else if (propVariableObj.isArray) {
              dependencies[`targetArraySize${ind}`] = {
                dependencyType: "componentStateVariableArraySize",
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
              propDependenciesSetUp: true,
              componentTypeByCollected: null,
              potentialReplacementClasses: dependencyValues.effectiveTargetClasses,
            }
          };
        }

        if (dependencyValues.propVariableObjs === null) {
          return {
            newValues: {
              replacementClasses: [],
              stateVariablesRequested: null,
              validProp: false,
              propDependenciesSetUp: true,
              componentTypeByCollected: null,
              potentialReplacementClasses: [],
            }
          };
        }


        let replacementClasses = [];
        let stateVariablesRequested = [];
        let componentTypeByCollected = [];
        let potentialReplacementClasses = [];
        let propDependenciesSetUp = true;

        for (let [ind, propVariableObj] of dependencyValues.propVariableObjs.entries()) {
          let componentType = propVariableObj.componentType;
          if (!componentType) {
            componentType = dependencyValues[`replacementComponentType${ind}`];
            if (!componentType) {
              continue;
            }
          }

          if (Array.isArray(componentType)) {
            // remove undefined componentType entries
            // (It might be possible to have as it has happened with copy)
            componentType = componentType.filter(x => x);

            replacementClasses.push(...componentType.map(x =>
              componentInfoObjects.allComponentClasses[x])
            );
            potentialReplacementClasses.push(...componentType.map(x =>
              componentInfoObjects.allComponentClasses[x])
            )
          } else if (propVariableObj.isArray) {
            if (dependencyValues[`targetArraySize${ind}`] === undefined) {
              propDependenciesSetUp = false;
              continue;
            }

            // let arrayLength;
            let arraySize = dependencyValues[`targetArraySize${ind}`];
            let numWrappingComponents = propVariableObj.wrappingComponents.length;
            let arrayLength = 1;

            // console.log(`arraySize: ${arraySize}`)

            if (numWrappingComponents === 0) {
              // array size is total number of entries in array
              if (propVariableObj.nDimensions === 1) {
                // This is the most common case
                arrayLength = arraySize[0];
              } else {
                arrayLength = arraySize.reduce((a, c) => a * c); // product of entries
              }
            } else if (numWrappingComponents < propVariableObj.nDimensions) {
              // if had an outer wrapping component, would just have a single component
              // so skip that case

              // product of array size entries after excluding the first
              // numWrappingComponents dimensions
              arrayLength = arraySize.slice(numWrappingComponents).reduce((a, c) => a * c, 1);

            }

            let componentClass = componentInfoObjects.allComponentClasses[componentType];
            replacementClasses.push(...Array(arrayLength).fill(componentClass));
            componentType = Array(arrayLength).fill(componentType);
            potentialReplacementClasses.push(componentClass)


          } else if (propVariableObj.isArrayEntry) {

            let arrayLength = 1;
            if (!(`targetArray${ind}` in dependencyValues)) {
              propDependenciesSetUp = false;
              continue;
            }
            let targetArrayEntry = dependencyValues[`targetArray${ind}`];
            if (Array.isArray(targetArrayEntry)) {
              let numWrappingComponents = propVariableObj.wrappingComponents.length;

              if (numWrappingComponents === 0) {
                // with no wrapping components, will just output
                // one component for each component of the array
                arrayLength = flattenDeep(targetArrayEntry).length;
              } else if (numWrappingComponents < propVariableObj.nDimensions) {
                // if had an outer wrapping component, would just have a single component
                // so skip that case
                if (numWrappingComponents === propVariableObj.nDimensions - 1) {
                  // if the second from outer dimension is wrapped
                  // then just count the number of entries in the original array
                  arrayLength = targetArrayEntry.length;
                } else {
                  // if have at least two unwrapped dimensions,
                  // flatten the array so that the entries counted are the outermost wrapped
                  // Note: we need to create a 3D array entry to access this,
                  // so this code is so far untested
                  let nLevelsToFlatten = propVariableObj.nDimensions - numWrappingComponents - 1;
                  arrayLength = flattenLevels(targetArrayEntry, nLevelsToFlatten).length;
                }
              }
            } else if (targetArrayEntry === undefined) {
              arrayLength = 0;
            }

            // console.log(`arrayLength for ${propVariableObj.varName}: ${arrayLength}`)
            let componentClass = componentInfoObjects.allComponentClasses[componentType];
            replacementClasses.push(...Array(arrayLength).fill(componentClass));
            componentType = Array(arrayLength).fill(componentType);
            potentialReplacementClasses.push(componentClass)
          } else {
            replacementClasses.push(componentInfoObjects.allComponentClasses[componentType]);
            potentialReplacementClasses.push(componentInfoObjects.allComponentClasses[componentType]);
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
            propDependenciesSetUp,
            componentTypeByCollected,
            potentialReplacementClasses,
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
        },
        propDependenciesSetUp: {
          dependencyType: "stateVariable",
          variableName: "propDependenciesSetUp"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { readyToExpand: dependencyValues.propDependenciesSetUp }
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
          dependencies.replacementClasses = {
            dependencyType: "stateVariable",
            variableName: "replacementClasses"
          }
        }

        return dependencies;
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale() {
        return { updateReplacements: true }
      },
      definition() {
        return { newValues: { needsReplacementsUpdatedWhenStale: true } }
      }
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

    workspace.propVariablesCopiedByCollected = [];

    workspace.uniqueIdentifiersUsedByCollected = {};

    for (let collectedNum = 0; collectedNum < component.stateValues.collectedComponents.length; collectedNum++) {
      if (component.stateValues.collectedComponents[collectedNum] !== undefined) {
        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
        let results = this.createReplacementForCollected({
          component,
          collectedNum,
          components,
          numReplacementsSoFar,
          uniqueIdentifiersUsed,
        });

        workspace.propVariablesCopiedByCollected[collectedNum] = results.propVariablesCopiedByReplacement;

        let collectedReplacements = results.serializedReplacements;
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



  static createReplacementForCollected({ component, components, collectedNum, numReplacementsSoFar, uniqueIdentifiersUsed }) {

    // console.log(`create replacement for collected ${collectedNum}, ${numReplacementsSoFar}`)

    if (!component.stateValues.useProp) {

      let target = components[component.stateValues.collectedComponents[collectedNum].componentName];

      let serializedCopy = [target.serialize({ forCopy: true })];

      return {
        serializedReplacements: postProcessCopy({
          serializedComponents: serializedCopy,
          componentName: component.componentName,
          uniqueIdentifiersUsed, identifierPrefix: collectedNum + "|"
        })
      };
    }

    let serializedReplacements = [];
    let propVariablesCopiedByReplacement = [];

    let replacementInd = numReplacementsSoFar - 1;
    let propVariableObj = component.stateValues.propVariableObjs[collectedNum];
    let componentTypes = component.stateValues.componentTypeByCollected[collectedNum];

    let numReplacementsForCollected = 1;
    if (Array.isArray(componentTypes)) {
      numReplacementsForCollected = componentTypes.length;
    }

    let collectedName = component.stateValues.collectedComponents[collectedNum].componentName;
    let collectedComponent = components[collectedName];

    let stateVarObj = collectedComponent.state[propVariableObj.varName];

    if (propVariableObj.isArray || propVariableObj.isArrayEntry) {

      let arrayStateVarObj, unflattenedArrayKeys;
      if (stateVarObj.isArray) {
        arrayStateVarObj = stateVarObj;
        unflattenedArrayKeys = stateVarObj.getAllArrayKeys(stateVarObj.arraySize, false);
      } else {
        arrayStateVarObj = collectedComponent.state[stateVarObj.arrayStateVariable];
        unflattenedArrayKeys = stateVarObj.unflattenedArrayKeys;
      }

      let wrappingComponents = stateVarObj.wrappingComponents;
      let numWrappingComponents = wrappingComponents.length;

      if (numWrappingComponents === 0) {
        // return flattened entries

        let flattenedArrayKeys = flattenDeep(unflattenedArrayKeys);

        for (let ind = 0; ind < numReplacementsForCollected; ind++) {
          replacementInd++;

          let propVariablesCopied = propVariablesCopiedByReplacement[ind] = [];

          let replacementClass = component.stateValues.replacementClasses[replacementInd];

          let componentType = replacementClass.componentType

          let arrayKey = flattenedArrayKeys[ind];

          if (arrayKey) {

            let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

            propVariablesCopied.push(propVariable);

            if (propVariableObj.containsComponentNamesToCopy) {

              let componentNameToCopy = arrayStateVarObj.getArrayValue({ arrayKey });
              let componentToCopy = components[componentNameToCopy];

              if (componentToCopy) {
                while (componentToCopy.replacementOf
                  && componentToCopy.replacementOf.replacements.length === 1
                ) {
                  componentToCopy = componentToCopy.replacementOf;
                }

                let stateForReplacementCopy;
                if (arrayStateVarObj.targetPropertiesToIgnoreOnCopy) {
                  stateForReplacementCopy = {
                    targetPropertiesToIgnore: arrayStateVarObj.targetPropertiesToIgnoreOnCopy
                  }
                }

                // use collectedNum in unique identifier
                // as we have separate uniqueIdentifiersUsed for each source
                let uniqueIdentifierBase = componentToCopy.componentName + "|" + collectedNum + "|copy";
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                serializedReplacements.push({
                  componentType: "copy",
                  children: [{
                    componentType: "tname",
                    state: { targetName: componentToCopy.componentName },
                  }],
                  state: stateForReplacementCopy,
                  uniqueIdentifier,
                });

                propVariablesCopied.push(componentToCopy.componentName)

              } else {
                // just give an empty component of componentType
                // use collectedNum in unique identifier
                // as we have separate uniqueIdentifiersUsed for each source
                let uniqueIdentifierBase = componentType + "|" + collectedNum + "|empty";
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                serializedReplacements.push({
                  componentType,
                  uniqueIdentifier,
                })
                propVariablesCopied.push(null)

              }

            } else {

              // don't need to use collectedNum in unique identifier
              // even though we have separate uniqueIdentifiersUsed for each source
              // as collectedName will be unique
              let uniqueIdentifierBase = collectedName + "|shadow|" + propVariable;
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              serializedReplacements.push({
                componentType,
                downstreamDependencies: {
                  [collectedName]: [{
                    dependencyType: "referenceShadow",
                    compositeName: component.componentName,
                    propVariable
                  }]
                },
                uniqueIdentifier
              })
            }
          } else {
            // didn't match an array key, so just add an empty component of componentType
            // use collectedNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentType + "|" + collectedNum + "|empty";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType,
              uniqueIdentifier,
            })

          }
        }
      } else {

        let createReplacementPiece = function (subArrayKeys, nDimensionsLeft) {

          let pieces = [];
          let propVariablesCopiedByPiece = [];

          if (nDimensionsLeft > 1) {
            // since nDimensionsLeft > 1, each component of subArray should be an array
            for (let subSubArrayKeys of subArrayKeys) {
              // recurse down to previous dimension
              let result = createReplacementPiece(subSubArrayKeys, nDimensionsLeft - 1);
              pieces.push(...result.pieces);
              propVariablesCopiedByPiece.push(...result.propVariablesCopiedByPiece);
            }

          } else {
            // down to last piece
            for (let arrayKey of subArrayKeys) {
              let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);
              let propVariablesCopiedForThisPiece = [propVariable];

              if (propVariableObj.containsComponentNamesToCopy) {

                let componentNameToCopy = arrayStateVarObj.getArrayValue({ arrayKey });
                let componentToCopy = components[componentNameToCopy];

                if (componentToCopy) {
                  while (componentToCopy.replacementOf
                    && componentToCopy.replacementOf.replacements.length === 1
                  ) {
                    componentToCopy = componentToCopy.replacementOf;
                  }

                  let stateForReplacementCopy;
                  if (arrayStateVarObj.targetPropertiesToIgnoreOnCopy) {
                    stateForReplacementCopy = {
                      targetPropertiesToIgnore: arrayStateVarObj.targetPropertiesToIgnoreOnCopy
                    }
                  }

                  // use collectedNum in unique identifier
                  // as we have separate uniqueIdentifiersUsed for each source
                  let uniqueIdentifierBase = componentToCopy.componentName + "|" + collectedNum + "|copy";
                  let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                  pieces.push({
                    componentType: "copy",
                    children: [{
                      componentType: "tname",
                      state: { targetName: componentToCopy.componentName },
                    }],
                    state: stateForReplacementCopy,
                    uniqueIdentifier
                  });
                  propVariablesCopiedForThisPiece.push(componentToCopy.componentName)

                } else {
                  // just give an empty component of componentType
                  // use collectedNum in unique identifier
                  // as we have separate uniqueIdentifiersUsed for each source
                  let uniqueIdentifierBase = componentType + "|" + collectedNum + "|empty";
                  let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                  pieces.push({
                    componentType: arrayStateVarObj.componentType,
                    uniqueIdentifier,
                  })
                  propVariablesCopiedForThisPiece.push(null)

                }

              } else {

                // don't need to use collectedNum in unique identifier
                // even though we have separate uniqueIdentifiersUsed for each source
                // as collectedName will be unique
                let uniqueIdentifierBase = collectedName + "|shadow|" + propVariable;
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                pieces.push({
                  componentType: arrayStateVarObj.componentType,
                  downstreamDependencies: {
                    [collectedName]: [{
                      dependencyType: "referenceShadow",
                      compositeName: component.componentName,
                      propVariable
                    }]
                  },
                  uniqueIdentifier
                })
              }
              propVariablesCopiedByPiece.push(propVariablesCopiedForThisPiece);

            }
          }

          // we wrap this dimension if have corresponding wrapping components
          let wrapCs = wrappingComponents[nDimensionsLeft - 1];
          if (wrapCs && wrapCs.length > 0) {
            for (let ind = wrapCs.length - 1; ind >= 0; ind--) {

              // use collectedNum in unique identifier
              // as we have separate uniqueIdentifiersUsed for each source
              let uniqueIdentifierBase = wrapCs[ind] + "|" + collectedNum + "|wrapper";
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              pieces = [{
                componentType: wrapCs[ind],
                children: pieces,
                uniqueIdentifier
              }]
            }
            propVariablesCopiedByPiece = [flattenDeep(propVariablesCopiedByPiece)];

          }

          return { pieces, propVariablesCopiedByPiece };

        }

        let result = createReplacementPiece(unflattenedArrayKeys, stateVarObj.nDimensions);

        let newReplacements = result.pieces;
        propVariablesCopiedByReplacement = result.propVariablesCopiedByPiece;

        // add downstream dependencies to top level replacements
        // (which are wrappers, so didn't get downstream dependencies originally)
        for (let replacement of newReplacements) {
          replacement.downstreamDependencies = {
            [collectedName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: propVariableObj.varName,
              ignorePrimaryStateVariable: true,
            }]
          }
        }

        replacementInd += newReplacements.length;

        serializedReplacements.push(...newReplacements);

        if (newReplacements.length < numReplacementsForCollected) {
          // we didn't create enough replacements,
          // (not sure if could happen since we don't have includeUndefinedArrayEntries for collect)

          // just create additional replacements,
          // even though they won't yet refer to the right dependencies

          for (let ind = newReplacements.length; ind < numReplacementsForCollected; ind++) {
            replacementInd++;
            propVariablesCopiedByReplacement[ind] = [];

            let replacementClass = component.stateValues.replacementClasses[replacementInd];
            let componentType = replacementClass.componentType.toLowerCase();

            // just add an empty component of componentType
            // use collectedNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentType + "|" + collectedNum + "|empty";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType,
              uniqueIdentifier
            })
          }

        } else if (newReplacements > numReplacementsForCollected) {
          throw Error(`Something went wrong when creating replacements for ${component.componentName} as we ended up with too many replacements`)
        }

      }

    } else {
      // if not array or array entry

      for (let ind = 0; ind < numReplacementsForCollected; ind++) {
        replacementInd++;
        let propVariablesCopied = propVariablesCopiedByReplacement[ind] = [];

        let replacementClass = component.stateValues.replacementClasses[replacementInd];

        let componentType = replacementClass.componentType

        propVariablesCopied.push(propVariableObj.varName);

        if (propVariableObj.containsComponentNamesToCopy) {

          let componentNameToCopy = sourceComponent.state[propVariableObj.varName].value
          let componentToCopy = components[componentNameToCopy];

          if (componentToCopy) {
            while (componentToCopy.replacementOf
              && componentToCopy.replacementOf.replacements.length === 1
            ) {
              componentToCopy = componentToCopy.replacementOf;
            }

            if (stateVarObj.targetPropertiesToIgnoreOnCopy) {
              stateForReplacementCopy = {
                targetPropertiesToIgnore: stateVarObj.targetPropertiesToIgnoreOnCopy
              }
            }

            // use collectedNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentToCopy.componentName + "|" + collectedNum + "|copy";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType: "copy",
              children: [{
                componentType: "tname",
                state: { targetName: componentToCopy.componentName },
              }],
              uniqueIdentifier
            });

            propVariablesCopied.push(componentToCopy.componentName);

          } else {
            // just give an empty component of componentType
            // use collectedNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentType + "|" + collectedNum + "|empty";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType,
              uniqueIdentifier,
            })

            propVariablesCopied.push(null);

          }

        } else {

          // don't need to use collectedNum in unique identifier
          // even though we have separate uniqueIdentifiersUsed for each source
          // as collectedName will be unique
          let uniqueIdentifierBase = collectedName + "|shadow|" + propVariableObj.varName;
          let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

          serializedReplacements.push({
            componentType,
            downstreamDependencies: {
              [collectedName]: [{
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable: propVariableObj.varName,
              }]
            },
            uniqueIdentifier
          })
        }
      }
    }

    return { serializedReplacements, propVariablesCopiedByReplacement };

  }


  static calculateReplacementChanges({ component, componentChanges, components, workspace }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (!component.stateValues.propDependenciesSetUp) {
      return [];
    }

    let replacementChanges = [];

    let numReplacementsSoFar = 0;

    let numReplacementsByCollected = [];
    let propVariablesCopiedByCollected = [];

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

          delete workspace.uniqueIdentifiersUsedByCollected[collectedNum];

        }

        propVariablesCopiedByCollected.push([]);

        continue;
      }

      let prevCollectedName = workspace.collectedNames[collectedNum];

      // check if collected has changed
      if (prevCollectedName === undefined || collected.componentName !== prevCollectedName) {

        let prevNumReplacements = 0;
        if (prevCollectedName !== undefined) {
          prevNumReplacements = workspace.numReplacementsByCollected[collectedNum];
        }
        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
        let results = this.recreateReplacements({
          component,
          collectedNum,
          numReplacementsSoFar,
          prevNumReplacements,
          replacementChanges,
          components,
          uniqueIdentifiersUsed
        });

        numReplacementsSoFar += results.numReplacements;

        numReplacementsByCollected[collectedNum] = results.numReplacements;

        propVariablesCopiedByCollected[collectedNum] = results.propVariablesCopiedByReplacement;

        continue;
      }

      if (!component.stateValues.useProp) {
        numReplacementsSoFar += workspace.numReplacementsByCollected[collectedNum];
        numReplacementsByCollected[collectedNum] = workspace.numReplacementsByCollected[collectedNum];
        continue;

      }

 
      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedByCollected[collectedNum] = [];
      let results = this.createReplacementForCollected({
        component,
        collectedNum,
        components,
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
      });

      let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

      let newSerializedReplacements = results.serializedReplacements;

      let nNewReplacements = newSerializedReplacements.length;
      let nOldReplacements = workspace.numReplacementsByCollected[collectedNum];

      for (let ind = 0; ind < Math.min(nNewReplacements, nOldReplacements); ind++) {
        if (propVariablesCopiedByReplacement[ind].length !== workspace.propVariablesCopiedByCollected[collectedNum][ind].length ||
          workspace.propVariablesCopiedByCollected[collectedNum][ind].some((v, i) => v !== propVariablesCopiedByReplacement[ind][i])
        ) {

          let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar + ind,
            numberReplacementsToReplace: 1,
            serializedReplacements: [newSerializedReplacements[ind]],
          };
          replacementChanges.push(replacementInstruction);
        }
      }

      if (nNewReplacements > nOldReplacements) {
        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: numReplacementsSoFar + nOldReplacements,
          numberReplacementsToReplace: 0,
          serializedReplacements: newSerializedReplacements.slice(nOldReplacements),
        };
        replacementChanges.push(replacementInstruction);
      } else if (nNewReplacements < nOldReplacements) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: numReplacementsSoFar + nNewReplacements,
          numberReplacementsToDelete: nOldReplacements - nNewReplacements,
        }

        replacementChanges.push(replacementInstruction);
      }

      numReplacementsSoFar += nNewReplacements;

      numReplacementsByCollected[collectedNum] = nNewReplacements;

      propVariablesCopiedByCollected[collectedNum] = propVariablesCopiedByReplacement;

    }


    workspace.numReplacementsByCollected = numReplacementsByCollected;
    workspace.collectedNames = component.stateValues.collectedComponents.map(x => x.componentName)
    workspace.propVariablesCopiedByCollected = propVariablesCopiedByCollected;
    
    return replacementChanges;

  }

  // getReferenceFromCollected(component) {
  //   let collectedDeps = {};

  //   let thisDep = this.downstreamDependencies[component.componentName];
  //   if (thisDep === undefined) {
  //     return {};
  //   }

  //   collectedDeps[component.componentName] = thisDep;

  //   if (!(component instanceof this.allComponentClasses['_composite'])) {
  //     for (let child of component.definingChildren) {
  //       Object.assign(collectedDeps, this.getReferenceFromCollected(child));
  //     }
  //   }

  //   return collectedDeps;
  // }


  static recreateReplacements({ component, collectedNum, numReplacementsSoFar, prevNumReplacements,
    replacementChanges, uniqueIdentifiersUsed, components }) {

    let results = this.createReplacementForCollected({
      component, collectedNum, components, numReplacementsSoFar, uniqueIdentifiersUsed
    });

    let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

    let newSerializedChildren = results.serializedReplacements;

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: prevNumReplacements,
      serializedReplacements: newSerializedChildren,
    };
    replacementChanges.push(replacementInstruction);

    return { numReplacements: newSerializedChildren.length, propVariablesCopiedByReplacement }
  }

}
