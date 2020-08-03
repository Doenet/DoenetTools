import CompositeComponent from './abstract/CompositeComponent';
import { flattenDeep } from '../utils/array';
import { getUniqueIdentifierFromBase } from '../utils/naming';

export default class Extract extends CompositeComponent {
  static componentType = "extract";

  static useReplacementsWhenCopyProp = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.includeUndefinedArrayEntries = { default: false };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let anything = childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      excludeComponentTypes: ["_composite"],
      number: 0,
    });


    let exactlyOneProp = childLogic.newLeaf({
      name: "exactlyOneProp",
      componentType: 'prop',
      number: 1,
    });

    childLogic.newOperator({
      name: "propPlus",
      operator: "and",
      propositions: [exactlyOneProp, anything],
      setAsBase: true,
    });


    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.sourceComponents = {
      returnDependencies: () => ({
        children: {
          dependencyType: "childIdentity",
          childLogicName: "anything",
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          sourceComponents: dependencyValues.children
        }
      })
    }

    stateVariableDefinitions.effectiveTargetClasses = {
      returnDependencies: () => ({
        sourceComponents: {
          dependencyType: "stateVariable",
          variableName: "sourceComponents"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let effectiveTargetClasses = dependencyValues.sourceComponents.map(
          x => componentInfoObjects.allComponentClasses[x.componentType]
        )
        return {
          newValues: { effectiveTargetClasses }
        };
      }
    };

    stateVariableDefinitions.propVariableObjs = {
      returnDependencies: () => ({
        propChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneProp",
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

    // replacement classes are determined by componentType
    // of propVariableObjs
    // Except that, if propVariableObjs doesn't have componentType specified,
    // then the componentType is determined by the actual statevariable of source components
    // We also track potentialReplacementClasses, which is all possible
    // replacementClasses this copy might return if array parameters change
    // (needed to load potential renderers)
    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: [
        "stateVariablesRequested", "validProp",
        "componentTypeBySource", "potentialReplacementClasses",
        "propDependenciesSetUp"
      ],
      stateVariablesDeterminingDependencies: [
        "propVariableObjs", "sourceComponents",
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
          effectiveTargetClasses: {
            dependencyType: "stateVariable",
            variableName: "effectiveTargetClasses",
          },
          sourceComponents: {
            dependencyType: "stateVariable",
            variableName: "sourceComponents",
          },
          propVariableObjs: {
            dependencyType: "stateVariable",
            variableName: "propVariableObjs",
          },
          includeUndefinedArrayEntries: {
            dependencyType: "stateVariable",
            variableName: "includeUndefinedArrayEntries"
          },
        };

        // if have a prop variable where couldn't determine componentType
        // from just the component class, we will get 
        // componentType of the actual statevariable
        // of the source component
        // Also, get size for arrays and
        // actual statevariable for array entries (so that can determine their size)
        if (stateValues.propVariableObjs !== null) {
          for (let [ind, propVariableObj] of stateValues.propVariableObjs.entries()) {
            if (!propVariableObj.componentType) {
              dependencies[`replacementComponentType${ind}`] = {
                dependencyType: "componentStateVariableComponentType",
                componentIdentity: stateValues.sourceComponents[ind],
                variableName: propVariableObj.varName,
              }
            }
            if (propVariableObj.isArrayEntry) {
              dependencies[`targetArray${ind}`] = {
                dependencyType: "componentStateVariable",
                variableName: propVariableObj.varName,
                componentIdentity: stateValues.sourceComponents[ind],
              }
            } else if (propVariableObj.isArray) {
              dependencies[`targetArraySize${ind}`] = {
                dependencyType: "componentStateVariableArraySize",
                variableName: propVariableObj.varName,
                componentIdentity: stateValues.sourceComponents[ind],
              }
            }
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.propVariableObjs === null) {
          return {
            newValues: {
              replacementClasses: [],
              stateVariablesRequested: null,
              validProp: false,
              propDependenciesSetUp: true,
              componentTypeBySource: null,
              potentialReplacementClasses: [],
            }
          };
        }

        let replacementClasses = [];
        let stateVariablesRequested = [];
        let componentTypeBySource = [];
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
              if (dependencyValues.includeUndefinedArrayEntries) {
                arrayLength = 1;
              } else {
                arrayLength = 0;
              }
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

          componentTypeBySource.push(componentType);

          stateVariablesRequested.push({
            componentOrReplacementOf: dependencyValues.sourceComponents[ind].componentName,
            stateVariable: propVariableObj.varName,
          })
        }

        return {
          newValues: {
            replacementClasses,
            stateVariablesRequested,
            validProp: true,
            propDependenciesSetUp,
            componentTypeBySource,
            potentialReplacementClasses,
          }
        };

      }
    }

    stateVariableDefinitions.replacementClassesForProp = {
      returnDependencies: () => ({
        replacementClasses: {
          dependencyType: "stateVariable",
          variableName: "replacementClasses"
        },
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { replacementClassesForProp: dependencyValues.replacementClasses }
      })
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
      definition: function ({ dependencyValues }) {
        return { newValues: { readyToExpand: dependencyValues.propDependenciesSetUp } };
      },
    };


    // similar to sourceComponents state variable
    // but include prop variable if have a prop
    // Note: this collects components a second time when have a prop
    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      stateVariablesDeterminingDependencies: [
        "propVariableObjs"
      ],
      returnDependencies: function ({ stateValues }) {
        // console.log('dependencies for needsreplace')
        // console.log(stateValues)
        let dependencies = {};

        if (stateValues.propVariableObjs === null) {
          dependencies.children = {
            dependencyType: "childIdentity",
            childLogicName: "anything",
          }
        } else {
          dependencies.childrenWithProp = {
            dependencyType: "childStateVariables",
            childLogicName: "anything",
            variableNames: stateValues.propVariableObjs.map(x => x.varName),
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

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = [];

    let allReplacementClasses = [
      ...this.stateValues.replacementClasses,
      ...this.stateValues.replacementClassesForProp,
      ...this.stateValues.potentialReplacementClasses,
    ]

    for (let replacementClass of allReplacementClasses) {
      let rendererType = replacementClass.rendererType;
      if (rendererType && !allPotentialRendererTypes.includes(rendererType)) {
        allPotentialRendererTypes.push(rendererType);
      }
    }

    if (this.replacements) {
      for (let replacement of this.replacements) {
        for (let rendererType of replacement.allPotentialRendererTypes) {
          if (!allPotentialRendererTypes.includes(rendererType)) {
            allPotentialRendererTypes.push(rendererType);
          }
        }

      }
    }

    return allPotentialRendererTypes;

  }

  static createSerializedReplacements({ component, components, workspace }) {

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    // console.log(`calculating replacements for ${component.componentName}`);

    let replacements = [];

    let numReplacementsBySource = [];

    let numReplacementsSoFar = 0;

    workspace.propVariablesCopiedBySource = [];

    workspace.uniqueIdentifiersUsedBySource = {};

    for (let sourceNum = 0; sourceNum < component.stateValues.sourceComponents.length; sourceNum++) {
      if (component.stateValues.sourceComponents[sourceNum] !== undefined) {
        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];
        let results = this.createReplacementForSource({
          component,
          sourceNum,
          components,
          numReplacementsSoFar,
          uniqueIdentifiersUsed,
        });
        workspace.propVariablesCopiedBySource.push(results.propVariablesCopied);

        let sourceReplacements = results.serializedReplacements;
        numReplacementsBySource[sourceNum] = sourceReplacements.length;
        numReplacementsSoFar += sourceReplacements.length;
        replacements.push(...sourceReplacements);
      } else {
        numReplacementsBySource[sourceNum] = 0;
      }
    }

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.sourceNames = component.stateValues.sourceComponents.map(x => x.componentName)

    return { replacements };

  }


  static createReplacementForSource({ component, components, sourceNum, numReplacementsSoFar, uniqueIdentifiersUsed }) {

    // console.log(`create replacement for source ${sourceNum}, ${numReplacementsSoFar}`)

    let serializedReplacements = [];
    let propVariablesCopied = [];

    let replacementInd = numReplacementsSoFar - 1;
    let propVariableObj = component.stateValues.propVariableObjs[sourceNum];
    let componentTypes = component.stateValues.componentTypeBySource[sourceNum];

    let numReplacementsForSource = 1;
    if (Array.isArray(componentTypes)) {
      numReplacementsForSource = componentTypes.length;
    }

    let sourceName = component.stateValues.sourceComponents[sourceNum].componentName;
    let sourceComponent = components[sourceName];

    let stateVarObj = sourceComponent.state[propVariableObj.varName];

    if (propVariableObj.isArray || propVariableObj.isArrayEntry) {

      let arrayStateVarObj, unflattenedArrayKeys;
      if (stateVarObj.isArray) {
        arrayStateVarObj = stateVarObj;
        unflattenedArrayKeys = stateVarObj.getAllArrayKeys(stateVarObj.arraySize, false);
      } else {
        arrayStateVarObj = sourceComponent.state[stateVarObj.arrayStateVariable];
        unflattenedArrayKeys = stateVarObj.unflattenedArrayKeys;
      }

      let wrappingComponents = stateVarObj.wrappingComponents;
      let numWrappingComponents = wrappingComponents.length;

      if (numWrappingComponents === 0) {
        // return flattened entries

        let flattenedArrayKeys = flattenDeep(unflattenedArrayKeys);

        for (let ind = 0; ind < numReplacementsForSource; ind++) {
          replacementInd++;

          let replacementClass = component.stateValues.replacementClasses[replacementInd];

          let componentType = replacementClass.componentType.toLowerCase();

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

                // use sourceNum in unique identifier
                // as we have separate uniqueIdentifiersUsed for each source
                let uniqueIdentifierBase = componentToCopy.componentName + "|" + sourceNum + "|copy";
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
                // use sourceNum in unique identifier
                // as we have separate uniqueIdentifiersUsed for each source
                let uniqueIdentifierBase = componentType + "|" + sourceNum + "|empty";
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                serializedReplacements.push({
                  componentType,
                  uniqueIdentifier,
                })
                propVariablesCopied.push(null)

              }

            } else {

              // don't need to use sourceNum in unique identifier
              // even though we have separate uniqueIdentifiersUsed for each source
              // as sourceName will be unique
              let uniqueIdentifierBase = sourceName + "|shadow|" + propVariable;
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              serializedReplacements.push({
                componentType,
                downstreamDependencies: {
                  [sourceName]: [{
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
            // use sourceNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentType + "|" + sourceNum + "|empty";
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
          if (nDimensionsLeft > 1) {
            // since nDimensionsLeft > 1, each component of subArray should be an array
            for (let subSubArrayKeys of subArrayKeys) {
              // recurse down to previous dimension
              pieces.push(...createReplacementPiece(subSubArrayKeys, nDimensionsLeft - 1))
            }

          } else {
            // down to last piece
            for (let arrayKey of subArrayKeys) {
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

                  // use sourceNum in unique identifier
                  // as we have separate uniqueIdentifiersUsed for each source
                  let uniqueIdentifierBase = componentToCopy.componentName + "|" + sourceNum + "|copy";
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
                  propVariablesCopied.push(componentToCopy.componentName)

                } else {
                  // just give an empty component of componentType
                  // use sourceNum in unique identifier
                  // as we have separate uniqueIdentifiersUsed for each source
                  let uniqueIdentifierBase = componentType + "|" + sourceNum + "|empty";
                  let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                  pieces.push({
                    componentType: arrayStateVarObj.componentType,
                    uniqueIdentifier,
                  })
                  propVariablesCopied.push(null)

                }

              } else {

                // don't need to use sourceNum in unique identifier
                // even though we have separate uniqueIdentifiersUsed for each source
                // as sourceName will be unique
                let uniqueIdentifierBase = sourceName + "|shadow|" + propVariable;
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                pieces.push({
                  componentType: arrayStateVarObj.componentType,
                  downstreamDependencies: {
                    [sourceName]: [{
                      dependencyType: "referenceShadow",
                      compositeName: component.componentName,
                      propVariable
                    }]
                  },
                  uniqueIdentifier
                })
              }
            }
          }

          // we wrap this dimension if have corresponding wrapping components
          let wrapCs = wrappingComponents[nDimensionsLeft - 1];
          if (wrapCs && wrapCs.length > 0) {
            for (let ind = wrapCs.length - 1; ind >= 0; ind--) {

              // use sourceNum in unique identifier
              // as we have separate uniqueIdentifiersUsed for each source
              let uniqueIdentifierBase = wrapCs[ind] + "|" + sourceNum + "|wrapper";
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              pieces = [{
                componentType: wrapCs[ind],
                children: pieces,
                uniqueIdentifier,
              }]
            }
          }

          return pieces;

        }

        let newReplacements = createReplacementPiece(unflattenedArrayKeys, stateVarObj.nDimensions);

        // add downstream dependencies to top level replacements
        // (which are wrappers, so didn't get downstream dependencies originally)
        for (let replacement of newReplacements) {
          replacement.downstreamDependencies = {
            [sourceName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: propVariableObj.varName,
              ignorePrimaryStateVariable: true,
            }]
          }
        }

        replacementInd += newReplacements.length;

        serializedReplacements.push(...newReplacements);

        if (newReplacements.length < numReplacementsForSource) {
          // we didn't create enough replacements,
          // which could happen if we have includeUndefinedArrayEntries set

          // just create additional replacements,
          // even though they won't yet refer to the right dependencies

          for (let ind = newReplacements.length; ind < numReplacementsForSource; ind++) {
            replacementInd++;

            let replacementClass = component.stateValues.replacementClasses[replacementInd];
            let componentType = replacementClass.componentType.toLowerCase();

            // just add an empty component of componentType
            // use sourceNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentType + "|" + sourceNum + "|empty";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType,
              uniqueIdentifier
            })
          }

        } else if (newReplacements > numReplacementsForSource) {
          throw Error(`Something went wrong when creating replacements for ${component.componentName} as we ended up with too many replacements`)
        }
      }


    } else {
      // if not array or array entry

      for (let ind = 0; ind < numReplacementsForSource; ind++) {
        replacementInd++;

        let replacementClass = component.stateValues.replacementClasses[replacementInd];

        let componentType = replacementClass.componentType

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

            // use sourceNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentToCopy.componentName + "|" + sourceNum + "|copy";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType: "copy",
              children: [{
                componentType: "tname",
                state: { targetName: componentToCopy.componentName },
              }],
              uniqueIdentifier
            });
          } else {
            // just give an empty component of componentType
            // use sourceNum in unique identifier
            // as we have separate uniqueIdentifiersUsed for each source
            let uniqueIdentifierBase = componentType + "|" + sourceNum + "|empty";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType,
              uniqueIdentifier,
            })
          }

        } else {
          propVariablesCopied.push(propVariableObj.varName);

          // don't need to use sourceNum in unique identifier
          // even though we have separate uniqueIdentifiersUsed for each source
          // as sourceName will be unique
          let uniqueIdentifierBase = sourceName + "|shadow|" + propVariableObj.varName;
          let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

          serializedReplacements.push({
            componentType,
            downstreamDependencies: {
              [sourceName]: [{
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable: propVariableObj.varName,
              }]
            },
            uniqueIdentifier,
          })

        }
      }
    }
    return { serializedReplacements, propVariablesCopied };

  }

  static calculateReplacementChanges({ component, components, workspace }) {

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    // console.log(`calculating replacement changes for ${component.componentName}`);
    // console.log(workspace.numReplacementsBySource);
    // console.log(component.replacements);

    if (!component.stateValues.propDependenciesSetUp) {
      return [];
    }

    let replacementChanges = [];

    let numReplacementsSoFar = 0;

    let numReplacementsBySource = [];
    let propVariablesCopiedBySource = [];

    // // cumulative sum: https://stackoverflow.com/a/44081700
    // let replacementIndexBySource = [0, ...workspace.numReplacementsBySource];
    // replacementIndexBySource = replacementIndexBySource.reduce(
    //   (a, x, i) => [...a, x + (a[i - 1] || 0)], []);


    let maxSourceLength = Math.max(component.stateValues.sourceComponents.length, workspace.numReplacementsBySource.length);

    for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
      let source = component.stateValues.sourceComponents[sourceNum];
      if (source === undefined) {
        if (workspace.numReplacementsBySource[sourceNum] > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToDelete: workspace.numReplacementsBySource[sourceNum],
          }

          replacementChanges.push(replacementInstruction);

          numReplacementsBySource[sourceNum] = 0;

          delete workspace.uniqueIdentifiersUsedBySource[sourceNum];
        }

        propVariablesCopiedBySource.push([]);

        continue;
      }

      let prevSourceName = workspace.sourceNames[sourceNum];

      // check if source has changed
      if (prevSourceName === undefined || source.componentName !== prevSourceName) {

        let prevNumReplacements = 0;
        if (prevSourceName !== undefined) {
          prevNumReplacements = workspace.numReplacementsBySource[sourceNum];
        }
        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];
        let results = this.recreateReplacements({
          component,
          sourceNum,
          numReplacementsSoFar,
          prevNumReplacements,
          replacementChanges,
          components,
          uniqueIdentifiersUsed
        });

        numReplacementsSoFar += results.numReplacements;

        numReplacementsBySource[sourceNum] = results.numReplacements;

        propVariablesCopiedBySource.push(results.propVariablesCopied);

        continue;
      }

      let redoReplacements = false;
      let testReplacementChanges = [];
      let results;

      // use new uniqueIdentifiersUsed for recreateReplacements
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = [];

      // don't change replacements unless
      // the number of components or their component types changed
      results = this.recreateReplacements({
        component,
        sourceNum,
        numReplacementsSoFar,
        prevNumReplacements: workspace.numReplacementsBySource[sourceNum],
        replacementChanges: testReplacementChanges,
        components,
        uniqueIdentifiersUsed,
      });

      let changeInstruction = testReplacementChanges[testReplacementChanges.length - 1];
      let newSerializedReplacements = changeInstruction.serializedReplacements;
      propVariablesCopiedBySource.push(results.propVariablesCopied);

      if (newSerializedReplacements.length !== workspace.numReplacementsBySource[sourceNum] ||
        propVariablesCopiedBySource[sourceNum].length !== workspace.propVariablesCopiedBySource[sourceNum].length ||
        workspace.propVariablesCopiedBySource[sourceNum].some((v, i) => v !== propVariablesCopiedBySource[sourceNum][i])
      ) {
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
        numReplacementsBySource[sourceNum] = results.numReplacements;

        // add uniqueIdentifiersUsed to workspace
        workspace.uniqueIdentifiersUsedBySource[sourceNum] = uniqueIdentifiersUsed;
      } else {
        numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
        numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
      }

    }


    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.sourceNames = component.stateValues.sourceComponents.map(x => x.componentName)
    workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;

    // console.log("replacementChanges");
    // console.log(replacementChanges);


    return replacementChanges;

  }

  static recreateReplacements({ component, sourceNum, numReplacementsSoFar, prevNumReplacements,
    replacementChanges, uniqueIdentifiersUsed, components
  }) {
    // if (prevNumReplacements > 0) {
    //   // give instructions to move dependency to new source
    //   let prevSourceName = workspace.previousSources[sourceNum];
    //   let newSource = component.stateValues.sourceComponents[sourceNum];
    //   if (prevSourceName !== undefined) {
    //     if (prevSourceName !== newSource.componentName) {
    //       let replacementInstruction = {
    //         changeType: "moveDependency",
    //         dependencyDirection: "downstream",
    //         oldComponentName: prevSourceName,
    //         newComponentName: newSource.componentName,
    //         dependencyType: "reference",
    //         otherAttributes: { shadowed: true, prop: component.state.propChild.componentName }
    //       };
    //       replacementChanges.push(replacementInstruction);
    //     }
    //   }
    //   else {
    //     // since no previous source, need to create new dependencies
    //     let replacementInstruction = {
    //       changeType: "addDependency",
    //       dependencyDirection: "downstream",
    //       newComponentName: newSource.componentName,
    //       dependencyType: "reference",
    //       otherAttributes: { shadowed: true, prop: component.state.propChild.componentName }
    //     };
    //     replacementChanges.push(replacementInstruction);
    //   }
    // }
    let results = this.createReplacementForSource({
      component, sourceNum, numReplacementsSoFar, components, uniqueIdentifiersUsed
    });

    let propVariablesCopied = results.propVariablesCopied;

    let newSerializedChildren = results.serializedReplacements

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: prevNumReplacements,
      serializedReplacements: newSerializedChildren,
    };
    replacementChanges.push(replacementInstruction);

    return { numReplacements: newSerializedChildren.length, propVariablesCopied }
  }

}
