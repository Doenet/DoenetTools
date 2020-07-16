import CompositeComponent from './abstract/CompositeComponent';

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
        "componentTypeBySource", "potentialReplacementClasses"
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
              replacementClasses: null,
              stateVariablesRequested: null,
              validProp: false,
              componentTypeBySource: null,
              potentialReplacementClasses: null,
            }
          };
        }

        let replacementClasses = [];
        let stateVariablesRequested = [];
        let componentTypeBySource = [];
        let potentialReplacementClasses = [];

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
      }),
      definition: function () {
        return { newValues: { readyToExpand: true } };
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

    for (let sourceNum = 0; sourceNum < component.stateValues.sourceComponents.length; sourceNum++) {
      if (component.stateValues.sourceComponents[sourceNum] !== undefined) {
        let sourceReplacements = this.createReplacementForSource({
          component,
          sourceNum,
          components,
          numReplacementsSoFar
        });
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


  static createReplacementForSource({ component, components, sourceNum, numReplacementsSoFar }) {

    // console.log(`create replacement for source ${sourceNum}, ${numReplacementsSoFar}`)

    let serializedReplacements = [];

    let replacementInd = numReplacementsSoFar - 1;
    let propVariableObj = component.stateValues.propVariableObjs[sourceNum];
    let componentTypes = component.stateValues.componentTypeBySource[sourceNum];

    let numReplacementsForSource = 1;
    if (Array.isArray(componentTypes)) {
      numReplacementsForSource = componentTypes.length;
    }

    let sourceName = component.stateValues.sourceComponents[sourceNum].componentName;
    let sourceComponent = components[sourceName];

    for (let ind = 0; ind < numReplacementsForSource; ind++) {
      replacementInd++;

      let replacementClass = component.stateValues.replacementClasses[replacementInd];

      let componentType = replacementClass.componentType

      if (propVariableObj.isArray) {
        let arrayStateVarObj = sourceComponent.state[propVariableObj.varName];

        // TODO: generalize to multi-dimensional arrays

        let arrayKey = arrayStateVarObj.indexToKey(ind);
        let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

        if (propVariableObj.containsComponentNamesToCopy) {

          let componentNameToCopy = arrayStateVarObj.getArrayValue({ arrayKey });
          let componentToCopy = components[componentNameToCopy];

          if (componentToCopy) {
            while (componentToCopy.replacementOf
              && componentToCopy.replacementOf.replacements.length === 1
            ) {
              componentToCopy = componentToCopy.replacementOf;
            }

            serializedReplacements.push({
              componentType: "copy",
              children: [{
                componentType: "tname",
                state: { targetName: componentToCopy.componentName },
              }]
            });
          }

        } else {
          serializedReplacements.push({
            componentType,
            downstreamDependencies: {
              [sourceName]: [{
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable
                // arrayStateVariable: propVariableObj.varName,
                // arrayKey
              }]
            }
          })
        }

      } else if (propVariableObj.isArrayEntry) {

        let arrayStateVarObj = sourceComponent.state[propVariableObj.arrayVarName];
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


        let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

        if (propVariableObj.containsComponentNamesToCopy) {

          let componentNameToCopy = arrayStateVarObj.getArrayValue({ arrayKey });
          let componentToCopy = components[componentNameToCopy];

          if (componentToCopy) {
            while (componentToCopy.replacementOf
              && componentToCopy.replacementOf.replacements.length === 1
            ) {
              componentToCopy = componentToCopy.replacementOf;
            }

            serializedReplacements.push({
              componentType: "copy",
              children: [{
                componentType: "tname",
                state: { targetName: componentToCopy.componentName },
              }]
            });
          } else if (component.stateValues.includeUndefinedArrayEntries) {

            serializedReplacements.push({
              componentType,
              downstreamDependencies: {
                [sourceName]: [{
                  dependencyType: "referenceShadow",
                  compositeName: component.componentName,
                  propVariable,
                  // propVariable: propVariableObj.varName,
                  // arrayStateVariable: propVariableObj.arrayVarName,
                  // arrayKey
                }]
              }
            })
          }

        } else {
          serializedReplacements.push({
            componentType,
            downstreamDependencies: {
              [sourceName]: [{
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable,
                // propVariable: propVariableObj.varName,
                // arrayStateVariable: propVariableObj.arrayVarName,
                // arrayKey
              }]
            }
          })
        }
        // }
        // }

      } else {

        if (propVariableObj.containsComponentNamesToCopy) {

          let componentNameToCopy = sourceComponent.state[propVariableObj.varName].value
          let componentToCopy = components[componentNameToCopy];

          if (componentToCopy) {
            while (componentToCopy.replacementOf
              && componentToCopy.replacementOf.replacements.length === 1
            ) {
              componentToCopy = componentToCopy.replacementOf;
            }

            serializedReplacements.push({
              componentType: "copy",
              children: [{
                componentType: "tname",
                state: { targetName: componentToCopy.componentName },
              }]
            });
          }

        } else {
          serializedReplacements.push({
            componentType,
            downstreamDependencies: {
              [sourceName]: [{
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable: propVariableObj.varName,
              }]
            }
          })
        }

      }
    }

    return serializedReplacements;

  }

  static calculateReplacementChanges({ component, components, workspace }) {

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    // console.log(`calculating replacement changes for ${component.componentName}`);
    // console.log(workspace.numReplacementsBySource);
    // console.log(component.replacements);


    let replacementChanges = [];

    let numReplacementsSoFar = 0;

    let numReplacementsBySource = [];

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
        }
        continue;
      }

      let prevSourceName = workspace.sourceNames[sourceNum];

      // check if source has changed
      if (prevSourceName === undefined || source.componentName !== prevSourceName) {

        let prevNumReplacements = 0;
        if (prevSourceName !== undefined) {
          prevNumReplacements = workspace.numReplacementsBySource[sourceNum];
        }
        let results = this.recreateReplacements({
          component,
          sourceNum,
          numReplacementsSoFar,
          prevNumReplacements,
          replacementChanges,
          components,
          workspace,
        });

        numReplacementsSoFar += results.numReplacements;

        numReplacementsBySource[sourceNum] = results.numReplacements;

        continue;
      }

      let redoReplacements = false;
      let testReplacementChanges = [];
      let results;


      // don't change replacements unless
      // the number of components or their component types changed
      results = this.recreateReplacements({
        component,
        sourceNum,
        numReplacementsSoFar,
        prevNumReplacements: workspace.numReplacementsBySource[sourceNum],
        replacementChanges: testReplacementChanges,
        components,
      });

      let changeInstruction = testReplacementChanges[testReplacementChanges.length - 1];
      let newSerializedReplacements = changeInstruction.serializedReplacements;

      if (newSerializedReplacements.length !== workspace.numReplacementsBySource[sourceNum]) {
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
      } else {
        numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
        numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
      }

    }


    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.sourceNames = component.stateValues.sourceComponents.map(x => x.componentName)

    // console.log("replacementChanges");
    // console.log(replacementChanges);


    return replacementChanges;

  }

  static recreateReplacements({ component, sourceNum, numReplacementsSoFar, prevNumReplacements,
    replacementChanges, workspace, components
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
    let newSerializedChildren = this.createReplacementForSource({ component, sourceNum, numReplacementsSoFar, components, workspace });

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
