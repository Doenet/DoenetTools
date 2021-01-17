import CompositeComponent from './abstract/CompositeComponent';
import * as serializeFunctions from '../utils/serializedStateProcessing';
import { postProcessCopy } from '../utils/copy';
import { flattenDeep, flattenLevels } from '../utils/array';
import { getUniqueIdentifierFromBase } from '../utils/naming';


export default class Copy extends CompositeComponent {
  constructor(args) {
    super(args);
    this.processNewDoenetML = this.processNewDoenetML.bind(this);
  }
  static componentType = "copy";

  static childrenSkippingNewNamespace = ["tname"];

  static assignNamesToReplacements = true;

  static useReplacementsWhenCopyProp = true;

  static createPropertiesObject({ allPossibleProperties }) {

    if (allPossibleProperties === undefined) {
      return {};
    }


    // Note: putting all possible properties as state variables
    // risks a collision between a newly defined property
    // and one of the state variables of Copy.
    // TODO: is there a better way to organize to avoid this potential collision
    // (Naming state variables beginning with a _ is not an option
    // as the idea is to exclude such state variable names to avoid
    // collision with internal state variables that core creates.)

    // Allow all standard component types to be entered as a property
    // at this stage with no defaults.
    // Will check validity depending on copy target
    let properties = {};
    for (let componentType of allPossibleProperties) {
      properties[componentType] = { ignorePropagationFromAncestors: true, default: null };
    }

    // Just in case there is a component that added these as a property, delete them

    // delete string and prop
    delete properties.string;
    delete properties.prop;
    delete properties.tname;
    delete properties.contentid;

    // delete basic types, in case they were used as property
    delete properties.math;
    delete properties.number;
    delete properties.text;

    properties.includeUndefinedArrayEntries = { default: false };

    // properties.targetPropertiesToIgnore = { default: [] };

    return properties;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneTname = childLogic.newLeaf({
      name: 'exactlyOneTname',
      componentType: 'tname',
      number: 1,
    });

    let atMostOneProp = childLogic.newLeaf({
      name: "atMostOneProp",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
    });

    let tnameWithOptionalProp = childLogic.newOperator({
      name: "tnameWithOptionalProp",
      operator: "and",
      propositions: [exactlyOneTname, atMostOneProp],// atMostOneChildnumber]
    });

    let exactlyOneContentId = childLogic.newLeaf({
      name: "exactlyOneContentId",
      componentType: 'contentid',
      number: 1,
    });

    childLogic.newOperator({
      name: "contentIdXorTnameProp",
      operator: "xor",
      propositions: [exactlyOneContentId, tnameWithOptionalProp],
      setAsBase: true,
    });


    return childLogic;
  }

  static returnStateVariableDefinitions({ propertyNames }) {

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
        return {
          newValues: {
            targetComponent: dependencyValues.tnameChild[0].stateValues.targetComponent
          }
        }
      },
    };

    stateVariableDefinitions.targetInactive = {
      returnDependencies: () => ({
        tnameChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneTname",
          variableNames: ["targetInactive"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.tnameChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              targetInactive: { variablesToCheck: "targetInactive" }
            }
          }
        }
        return {
          newValues: {
            targetInactive: dependencyValues.tnameChild[0].stateValues.targetInactive
          }
        }

      }
    }

    stateVariableDefinitions.contentId = {
      returnDependencies: () => ({
        contentIdChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneContentId",
          variableNames: ["value"],
        },
        newNamespace: {
          dependencyType: "doenetAttribute",
          attributeName: "newNamespace",
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.contentIdChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              contentId: { variablesToCheck: "contentId" }
            }
          }
        }

        if (!newNamespace.value) {
          throw Error("Cannot copy contentId without specifying a new namespace")
        }

        return { newValues: { contentId: dependencyValues.contentIdChild[0].stateValues.value } }
      },
    };


    stateVariableDefinitions.serializedStateForContentId = {
      returnDependencies: () => ({}),
      defaultValue: null,
      definition: function () {
        return {
          useEssentialOrDefaultValue: {
            serializedStateForContentId: { variablesToCheck: "serializedStateForContentId" }
          }
        }
      }
    };

    // stateVariableDefinitions.serializedContent = {
    //   returnDependencies: () => ({
    //     contentId: {
    //       dependencyType: "stateVariable",
    //       variableName: "contentId",
    //     },
    //     serializedStateForContentId: {
    //       dependencyType: "stateVariable",
    //       variableName: "serializedStateForContentId",
    //     },
    //   }),
    //   defaultValue: undefined,
    //   definition: function ({ contentId, serializedStateForContentId }, { allComponentClasses, componentTypesTakingComponentNames, standardComponentClasses, componentTypesCreatingVariants }) {
    //     if (contentId.value === undefined) {
    //       return { useEssentialOrDefaultValue: { serializedContent: "serializedContent" } }
    //     }

    //     if (serializedStateForContentId.value === undefined) {
    //       // TODO: implement
    //       throw Error("Need to implement resolving contentId on the fly.")
    //       // this.externalFunctions.contentIdsToDoenetMLs({ contentIds: [this.state.contentId], callBack: this.processNewDoenetML })

    //     }
    //     if (!serializedStateForContentId.valueChanged) {
    //       return { noChanges: true };
    //     }

    //     let serializedState = JSON.parse(JSON.stringify(serializedStateForContentId.value));
    //     serializedState = serializeFunctions.scrapeOffAllDoumentRelated(serializedState);

    //     serializeFunctions.createComponentsFromProps(serializedState, standardComponentClasses);

    //     serializeFunctions.createComponentNames({ serializedState, componentTypesTakingComponentNames, allComponentClasses });

    //     this.componentNameToPreserializedName(serializedState, componentTypesTakingComponentNames);

    //     serializeFunctions.gatherVariantComponents({
    //       serializedState,
    //       componentTypesCreatingVariants,
    //       allComponentClasses,
    //     });

    //     return { newValues: { serializedContent: serializedState } }
    //   },
    // };


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


    stateVariableDefinitions.effectiveTargetClasses = {
      stateVariablesDeterminingDependencies: ["targetComponent", "useProp"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {
        // If copying a prop, then want to change the effective target classes
        // to be the classes of the replacements, as the validity of the prop
        // is determined by this replacement class.
        // Otherwise, the effective target class is just the class of the targetComponent

        if (stateValues.targetComponent === null) {
          return {
            targetComponent: {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            }
          }
        }

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let targetClass = componentInfoObjects.allComponentClasses[stateValues.targetComponent.componentType];

        let dependencies = {
          targetInactive: {
            dependencyType: "stateVariable",
            variableName: "targetInactive"
          }
        };

        // if copying a prop of a composite for which useReplacementsWhenCopyProp is set,
        // then the prop will be based on that composite's replacements
        // so will use state variable replacementClassesForProp for effective target class
        if (stateValues.useProp && compositeClass.isPrototypeOf(targetClass) &&
          targetClass.useReplacementsWhenCopyProp
        ) {
          dependencies.targetReplacementClassesForProp = {
            dependencyType: "componentStateVariable",
            componentIdentity: stateValues.targetComponent,
            variableName: "replacementClassesForProp"
          }
        } else {
          dependencies.targetComponent = {
            dependencyType: "stateVariable",
            variableName: "targetComponent"
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        let effectiveTargetClasses;
        if (dependencyValues.targetInactive) {
          effectiveTargetClasses = [];
        } else if (dependencyValues.targetComponent) {
          effectiveTargetClasses = [componentInfoObjects.allComponentClasses[dependencyValues.targetComponent.componentType]]
        } else if (dependencyValues.targetComponent === null) {
          effectiveTargetClasses = [];
        } else {
          effectiveTargetClasses = dependencyValues.targetReplacementClassesForProp;
          if (!effectiveTargetClasses) {
            effectiveTargetClasses = [];
          }
        }
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
    // then the componentType is determined by targetComponent state variable
    // We also track potentialReplacementClasses, which is all possible
    // replacementClasses this copy might return if array parameters change
    // (needed to load potential renderers)
    stateVariableDefinitions.replacementClasses = {
      additionalStateVariablesDefined: [
        "stateVariablesRequested", "validProp",
        "componentTypeByTarget", "potentialReplacementClasses",
        "propDependenciesSetUp"
      ],
      stateVariablesDeterminingDependencies: [
        "propVariableObjs", "targetComponent",
        "componentIdentitiesForProp"
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
          effectiveTargetClasses: {
            dependencyType: "stateVariable",
            variableName: "effectiveTargetClasses",
          },
          targetName: {
            dependencyType: "stateVariable",
            variableName: "targetName",
          },
          useProp: {
            dependencyType: "stateVariable",
            variableName: "useProp",
          },
          propVariableObjs: {
            dependencyType: "stateVariable",
            variableName: "propVariableObjs",
          },
          includeUndefinedArrayEntries: {
            dependencyType: "stateVariable",
            variableName: "includeUndefinedArrayEntries"
          }
        };

        // if have a prop variable where couldn't determine componentType
        // from just the component class, we will get 
        // componentType of the actual statevariable
        // of the targetComponent
        // Also, get size for arrays and
        // actual statevariable for array entries (so that can determine their size)
        if (stateValues.propVariableObjs !== null) {
          for (let [ind, propVariableObj] of stateValues.propVariableObjs.entries()) {
            if (stateValues.componentIdentitiesForProp && stateValues.componentIdentitiesForProp[ind]) {
              dependencies[`replacementComponentType${ind}`] = {
                dependencyType: "componentStateVariableComponentType",
                componentIdentity: stateValues.componentIdentitiesForProp[ind],
                variableName: propVariableObj.varName,
              }
              if (propVariableObj.isArrayEntry) {
                dependencies[`targetArray${ind}`] = {
                  dependencyType: "componentStateVariable",
                  variableName: propVariableObj.varName,
                  componentIdentity: stateValues.componentIdentitiesForProp[ind],
                }
              } else if (propVariableObj.isArray) {
                dependencies[`targetArraySize${ind}`] = {
                  dependencyType: "componentStateVariableArraySize",
                  variableName: propVariableObj.varName,
                  componentIdentity: stateValues.componentIdentitiesForProp[ind],
                }
              }
            }
          }
        }
        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        // console.log(`definition of replacement classes`)
        // console.log(dependencyValues)
        if (!dependencyValues.useProp) {
          return {
            newValues: {
              replacementClasses: dependencyValues.effectiveTargetClasses,
              stateVariablesRequested: null,
              validProp: null,
              propDependenciesSetUp: true,
              componentTypeByTarget: null,
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
              componentTypeByTarget: null,
              potentialReplacementClasses: [],
            }
          };
        }

        let replacementClasses = [];
        let stateVariablesRequested = [];
        let componentTypeByTarget = [];
        let potentialReplacementClasses = [];
        let propDependenciesSetUp = true;

        for (let [ind, propVariableObj] of dependencyValues.propVariableObjs.entries()) {
          let componentType = dependencyValues[`replacementComponentType${ind}`];
          if (!componentType) {
            componentType = propVariableObj.componentType;
            if (!componentType) {
              continue;
            }
          }

          if (Array.isArray(componentType)) {

            // remove undefined componentType entries
            // (Could have undefined if, for example, have unsatisfied
            // childlogic for a component.  Just skip such entries here
            // so that can get to the error message describing child logic)
            componentType = componentType.filter(x => x).map(x => x.toLowerCase());

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
              arrayLength = arraySize.slice(0, arraySize.length - numWrappingComponents).reduce((a, c) => a * c, 1);

            }

            componentType = componentType.toLowerCase();
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
            componentType = componentType.toLowerCase();
            let componentClass = componentInfoObjects.allComponentClasses[componentType];
            replacementClasses.push(...Array(arrayLength).fill(componentClass));
            componentType = Array(arrayLength).fill(componentType);
            potentialReplacementClasses.push(componentClass)
          } else {
            componentType = componentType.toLowerCase();
            replacementClasses.push(componentInfoObjects.allComponentClasses[componentType]);
            potentialReplacementClasses.push(componentInfoObjects.allComponentClasses[componentType]);
          }

          componentTypeByTarget.push(componentType);

          stateVariablesRequested.push({
            componentOrReplacementOf: dependencyValues.targetName,
            stateVariable: propVariableObj.varName,
          })
        }

        return {
          newValues: {
            replacementClasses,
            stateVariablesRequested,
            validProp: true,
            propDependenciesSetUp,
            componentTypeByTarget,
            potentialReplacementClasses,
          }
        };

      }
    }

    stateVariableDefinitions.replacementClassesForProp = {
      stateVariablesDeterminingDependencies: ["targetComponent", "useProp"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        if (stateValues.targetComponent === null) {
          return {
            replacementClasses: {
              dependencyType: "stateVariable",
              variableName: "replacementClasses"
            }
          }
        }

        // If copied a composite without using a prop
        // the replacement will be the composite itself
        // However, if one copies this copy with a prop, that copy will need to know
        // the ultimate non-composite replacement class to determine
        // if the prop is valid

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let targetClass = componentInfoObjects.allComponentClasses[stateValues.targetComponent.componentType];

        let dependencies = {};

        if (!stateValues.useProp && compositeClass.isPrototypeOf(targetClass) &&
          targetClass.useReplacementsWhenCopyProp
        ) {
          dependencies.targetReplacementClassesForProp = {
            dependencyType: "componentStateVariable",
            componentIdentity: stateValues.targetComponent,
            variableName: "replacementClassesForProp"
          }
        } else {
          dependencies.replacementClasses = {
            dependencyType: "stateVariable",
            variableName: "replacementClasses"
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {
        let replacementClassesForProp;
        if (dependencyValues.targetReplacementClassesForProp) {
          replacementClassesForProp = dependencyValues.targetReplacementClassesForProp
        } else {
          replacementClassesForProp = dependencyValues.replacementClasses;
          if (!replacementClassesForProp) {
            replacementClassesForProp = [];
          }
        }
        return {
          newValues: { replacementClassesForProp }
        };
      },
    };


    stateVariableDefinitions.validPropertiesSpecified = {
      returnDependencies: function () {
        let dependencies = {
          replacementClasses: {
            dependencyType: "stateVariable",
            variableName: "replacementClasses"
          },
          useProp: {
            dependencyType: "stateVariable",
            variableName: "useProp",
          },
          validProp: {
            dependencyType: "stateVariable",
            variableName: "validProp"
          }
        }
        for (let property of propertyNames) {
          dependencies[property] = {
            dependencyType: "stateVariable",
            variableName: property,
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        if (dependencyValues.useProp && !dependencyValues.validProp) {
          return { newValues: { validPropertiesSpecified: false } }
        }

        let replacementClasses = dependencyValues.replacementClasses;

        let validProperties = true;


        for (let targetClass of replacementClasses) {
          let propertiesObject = targetClass.createPropertiesObject({
            standardComponentClasses: componentInfoObjects.standardComponentClasses,
            allPossibleProperties: componentInfoObjects.allPossibleProperties
          });

          for (let property in dependencyValues) {
            if (!["replacementClasses", "useProp", "validProp",
              "includeUndefinedArrayEntries", "fromSubstitutions", "fromMapAncestor"].includes(property)
              && (!(property in propertiesObject) || propertiesObject[property].disallowOverwriteOnCopy)
            ) {
              let prescribedValue = dependencyValues[property];
              if (prescribedValue !== null && !(Array.isArray(prescribedValue) && prescribedValue.length === 0)) {
                validProperties = false;
                if (!(property in propertiesObject)) {
                  console.error(`Invalid property ${property} for copy of component of type ${targetClass.componentType}`)
                } else {
                  console.error(`Cannot overwrite property ${property} when copying component of type ${targetClass.componentType}`)
                }
                break;
              }
            }
          }
        }

        return { newValues: { validPropertiesSpecified: validProperties } }
      },
    };

    stateVariableDefinitions.readyToExpand = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "useProp"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        if (stateValues.targetComponent === null) {
          return {
            targetComponent: {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            },
            needsReplacementsUpdatedWhenStale: {
              dependencyType: "stateVariable",
              variableName: "needsReplacementsUpdatedWhenStale",
            }
          }
        }

        let dependencies = {
          validPropertiesSpecified: {
            dependencyType: "stateVariable",
            variableName: "validPropertiesSpecified"
          },
          needsReplacementsUpdatedWhenStale: {
            dependencyType: "stateVariable",
            variableName: "needsReplacementsUpdatedWhenStale",
          },
          componentIdentitiesForProp: {
            dependencyType: "stateVariable",
            variableName: "componentIdentitiesForProp"
          },
          propDependenciesSetUp: {
            dependencyType: "stateVariable",
            variableName: "propDependenciesSetUp"
          }

        }

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let targetClass = componentInfoObjects.allComponentClasses[stateValues.targetComponent.componentType];

        // if copying a prop of a composite the uses replacements for props,
        // not ready to expand unless composite is ready to expand
        if (compositeClass.isPrototypeOf(targetClass) &&
          stateValues.useProp && targetClass.useReplacementsWhenCopyProp
        ) {
          dependencies.targetReady = {
            dependencyType: "componentStateVariable",
            componentIdentity: stateValues.targetComponent,
            variableName: "readyToExpand"
          }
        }

        return dependencies;

      },
      definition: function ({ dependencyValues }) {
        if (dependencyValues.targetComponent === null || !dependencyValues.propDependenciesSetUp) {
          return { newValues: { readyToExpand: false } }
        }
        return { newValues: { readyToExpand: true } };
      },
    };


    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "propVariableObjs", "componentIdentitiesForProp"
      ],
      returnDependencies: function ({ stateValues }) {
        if (!stateValues.targetComponent) {
          return {};
        }

        let dependencies = {
          targetComponent: {
            dependencyType: "stateVariable",
            variableName: "targetComponent"
          },
          targetInactive: {
            dependencyType: "stateVariable",
            variableName: "targetInactive"
          }
        }

        if (stateValues.propVariableObjs === null) {
          dependencies.targetDescendantIdentity = {
            dependencyType: "componentDescendantIdentity",
            ancestorName: stateValues.targetComponent.componentName,
            componentTypes: ["_base"],
            useReplacementsForComposites: false,
            includeNonActiveChildren: false,
            recurseToMatchedChildren: true,
          }
        } else {
          if(stateValues.componentIdentitiesForProp === null) {
            return {};
          }
          for (let [ind, cIdentity] of stateValues.componentIdentitiesForProp.entries()) {
            dependencies["targetWithProp" + ind] = {
              dependencyType: "componentStateVariable",
              variableName: stateValues.propVariableObjs[ind].varName,
              componentIdentity: cIdentity,
            }
          }
        }

        return dependencies;
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale: () => ({ updateReplacements: true }),
      definition: () => ({ newValues: { needsReplacementsUpdatedWhenStale: true } })
    }


    stateVariableDefinitions.componentIdentitiesForProp = {
      stateVariablesDeterminingDependencies: ["useProp", "targetComponent"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {
        if (!stateValues.useProp || stateValues.targetComponent === null) {
          return {}
        }
        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let targetClass = componentInfoObjects.allComponentClasses[stateValues.targetComponent.componentType];

        if (compositeClass.isPrototypeOf(targetClass) && targetClass.useReplacementsWhenCopyProp) {
          return {
            targetRecursiveReplacementsForProp: {
              dependencyType: "componentStateVariable",
              componentIdentity: stateValues.targetComponent,
              variableName: "recursiveReplacementsForProp"
            }
          }
        } else {
          return {
            targetComponent: {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            }
          }
        }
      },
      definition: function ({ dependencyValues }) {

        if (dependencyValues.targetRecursiveReplacementsForProp) {
          return {
            newValues: {
              componentIdentitiesForProp:
                dependencyValues.targetRecursiveReplacementsForProp
                  .filter(x => x.componentType !== "empty")
            }
          }
        } else if (dependencyValues.targetComponent) {
          return {
            newValues: {
              componentIdentitiesForProp: [dependencyValues.targetComponent]
            }
          }
        } else {
          return { newValues: { componentIdentitiesForProp: null } }
        }
      }
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

  updateStateUnused() {


    // add original reference dependencies
    this.addReferenceDependencies({ target: this.state.originalRefTarget });


    this.state.previousRefTarget = this.state.targetComponent;

    if (this.state.previousRefTarget !== undefined && this.state.targetInactive) {
      this.state.targetPrevInactive = true;
    } else {
      this.state.targetPrevInactive = false;
    }

    // if childnumber is specified, determine new targetComponent
    // it might be undefined if childnumber is not a valid value
    if (this.state.childnumberChild) {
      if (this.state.childnumberChild.unresolvedState.number) {
        this.unresolvedState.targetComponent = true;
        this.state.targetComponent = undefined;
        return;
      }
      // don't bother checking for changes in childnumber, just set it
      this.state.childnumber = this.state.childnumberChild.state.number;
    } else if (this.state.childnumber !== undefined && !this._state.childnumber.essential) {
      delete this.state.childnumber;
    }

    let childnumber = this.state.childnumber;

    if (childnumber !== undefined) {
      this.state.targetComponent = undefined;

      // replace targetComponent with child if childnumber set
      let childIndex = childnumber - 1;
      if (!Number.isInteger(childIndex) || childIndex < 0) {
        console.log("Invalid child number");
      } else if (childIndex < this.state.originalRefTarget.activeChildren.length) {
        this.state.targetComponent = this.state.originalRefTarget.activeChildren[childIndex];
      }
    } else {
      this.state.targetComponent = this.state.originalRefTarget;
    }

    if (this.state.targetComponent === undefined) {
      return;
    }

    let targetComponent = this.state.targetComponent;

    if (targetComponent.componentName === this.componentName) {
      let message = "Circular reference from " + this.componentName
      // if(this.doenetAttributes.componentName) {
      //   message += " (" + this.doenetAttributes.componentName + ")";
      // }
      message += " to itself."
      throw Error(message);
    }

    // check if find target state variable from prop
    if (this.state.propChild !== undefined) {

      // TODO: can avoid this if prop didn't change

      let result = this.state.propChild.validateProp({
        component: targetComponent,
        standardComponentClasses: this.componentInfoObjects.standardComponentClasses,
      })

      if (result.success !== true) {
        if (result.error === true) {
          let propChildState = this.state.propChild.state;
          let message = "Cannot reference prop " + propChildState.variableName;
          if (propChildState.authorProp !== undefined) {
            message += " (" + propChildState.authorProp + ")"
          }
          message += " from " + targetComponent.componentName;
          // if(targetComponent.doenetAttributes.componentName !== undefined) {
          //   message += " (" + targetComponent.doenetAttributes.componentName + ")";
          // }
          this.unresolvedState.propData = true;
          this.unresolvedMessage = message;
          this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: { props: [this.state.propChild] } };
        } else if (result.unresolved === true) {
          this.unresolvedState.propData = true;
          this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: { props: [this.state.propChild] } };

        }

        this.state.targetComponent = undefined;
        return;
      }

      this.state.propData = result.propData;
      delete this.unresolvedState.propData;
      delete this.unresolvedDependencies;
      this.state.availableClassProperties = result.availableClassProperties;
    } else {
      // no prop

      // if targetComponent is has any unresolved state, then this copy is still unresolved
      // if(Object.keys(this.state.targetComponent.unresolvedState).length > 0) {


      if (this.state.targetComponent.state.unresolvedDependenceChain) {
        if (this.componentName in this.state.targetComponent.state.unresolvedDependenceChain) {
          throw Error("Circular dependence involving " + this.componentName + " and " + this.state.targetComponent.componentName);
        }
        if (this.state.unresolvedDependenceChain === undefined) {
          this.state.unresolvedDependenceChain = {};
        }
        this.mergeUnresolved(this.state.targetComponent);

      }

      if (this.state.targetComponent.unresolvedDependencies) {
        this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: true };
        this.unresolvedState.availableClassProperties = true;
        this.state.targetComponent = undefined; // so no replacements in recreateReplacements
        return;
      }

      delete this.unresolvedState.availableClassProperties;
      delete this.unresolvedDependencies;

      // available properties are those from replacement componentType
      // except that, if it is a composite with at least one replacement
      // we get properties from the class of the first replacement
      let rtForProperties = targetComponent;
      while (rtForProperties instanceof this.componentInfoObjects.allComponentClasses._composite) {
        if (rtForProperties.replacements.length === 0) {
          break;
        }
        // TODO: not sure if just taking the first component is the correct idea
        // because we now apply properties to all the replacements
        // Maybe have the availableClassProperties be the union of the properties
        // of all the replacement classes?
        rtForProperties = rtForProperties.replacements[0];
      }

      if (rtForProperties instanceof this.componentInfoObjects.allComponentClasses.string) {
        // if string (which doesn't have properties), use base component
        this.state.availableClassProperties = this.componentInfoObjects.allComponentClasses._base.createPropertiesObject({
          standardComponentClasses: this.componentInfoObjects.standardComponentClasses
        });
      } else {
        let replacementClassForProperties = this.componentInfoObjects.standardComponentClasses[rtForProperties.componentType];

        this.state.availableClassProperties = replacementClassForProperties.createPropertiesObject({
          standardComponentClasses: this.componentInfoObjects.standardComponentClasses
        });
      }
    }

    // add state of reference target for any state values that
    // correspond to properties
    // and haven't been specified as properties on copy
    this.copyPropertiesFromRefTarget();

    this.verifyValidProperties();

    this.state.targetInactive = this.state.targetComponent.inactive;

    // console.log("Resolved copy");
    // console.log(this.targetComponent);

    if (trackChanges.getVariableChanges({ component: this, variable: "childnumber" })) {

      // if used a childnumber, change dependency of originalRefTarget to denote childnumber
      // and add a dependency to the new targetComponent
      if (this.state.childnumber !== undefined) {
        this.downstreamDependencies[this.state.originalRefTarget.componentName].childnumber = this.state.childnumber;
        if (this.state.targetComponent !== undefined) {
          this.downstreamDependencies[this.state.targetComponent.componentName] = {
            dependencyType: "reference",
          }
        }
      }
    }

    if (trackChanges.getVariableChanges({ component: this, variable: "targetComponent" })) {

      if (this.state.targetComponent !== undefined) {
        if (this.state.propChild === undefined) {
          // if didn't use a prop, then add downstream dependencies
          // to all active descendants of the targetComponent
          // (unless descendants not shadowed because use state variables for references)
          // and indicate they will be shadowed.
          // This overwrites the original dependency of the targetComponent itself
          this.addReferenceDependencies({
            target: this.state.targetComponent,
            recursive: true,
            shadowed: true
          });
        } else {
          // change downstream dependency to show that used a prop
          this.downstreamDependencies[this.state.originalRefTarget.componentName].prop = this.state.propChild.componentName;
          if (this.state.targetComponent !== this.state.originalRefTarget) {
            this.addReferenceDependencies({ target: this.state.targetComponent });
            this.downstreamDependencies[this.state.targetComponent.componentName].prop = this.state.propChild.componentName;
          }
        }
      }

    }

  }

  processNewDoenetML({ newDoenetMLs, message, success }) {

    if (!success) {
      console.warn(message);
      //TODO: handle failure
      return;
    }

    let serializedState = serializeFunctions.doenetMLToSerializedState({ doenetML: newDoenetMLs[0], standardComponentClasses: this.componentInfoObjects.standardComponentClasses, allComponentClasses: this.componentInfoObjects.allComponentClasses });

    serializedState = serializeFunctions.scrapeOffAllDoumentRelated(serializedState);

    serializeFunctions.createComponentsFromProps(serializedState, this.componentInfoObjects.standardComponentClasses);

    // need to redo to include parentDoenetAttributes
    serializeFunctions.createComponentNames({
      serializedState,
      componentInfoObjects: this.componentInfoObjects
    });

    this.componentNameToPreserializedName(serializedState, this.componentInfoObjects.componentTypesTakingComponentNames);

    serializeFunctions.gatherVariantComponents({
      serializedState,
      componentTypesCreatingVariants: this.componentInfoObjects.componentTypesCreatingVariants,
      componentInfoObjects: this.componentInfoObjects,
    });

    this.coreFunctions.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          serializedContent: { changes: serializedState },
          serializedContentChanged: { changes: true },
        }
      }],
      saveSerializedState: false,
    });

  }

  componentNameToPreserializedName(serializedState, componentTypesTakingComponentNames) {

    for (let serializedComponent of serializedState) {
      if (serializedComponent.doenetAttributes) {
        let componentName = serializedComponent.doenetAttributes.componentName;
        if (componentName !== undefined) {
          serializedComponent.doenetAttributes.componentName = this.componentName + componentName;
        }
      }

      if (serializedComponent.componentType in componentTypesTakingComponentNames) {
        let targetName;
        for (let child of serializedComponent.children) {
          if (child.componentType === "string") {
            child.state.value = this.componentName + child.state.value;
            break;
          }
        }
        serializedComponent.targetComponentName = targetName;
      }
      // recurse to children
      if (serializedComponent.children !== undefined) {
        this.componentNameToPreserializedName(serializedComponent.children, componentTypesTakingComponentNames);
      }
    }
  }

  // TODO: need to fix this?
  serializeOld(parameters = {}) {

    let useReplacements = parameters.forCopy || this.state.contentIdChild || this.state.useReplacementsWhenSerialize;


    // TODO: Need to determine how to implement this with new state variable
    // as we no longer have access to targetComponent's ancestors

    // if (parameters.forCopy !== true && parameters.savingJustOneComponent) {
    //   let oneComponentBeingSaved = parameters.savingJustOneComponent;

    //   // We're saving a single component (and its descendants).
    //   // If we have a copy to a component that isn't a descendant
    //   // of the one component, we need to serialize its replacements
    //   // (as a group) instead of serializing the copy to the outside component

    //   if (!this.stateValues.targetComponent.ancestors.includes(oneComponentBeingSaved)) {
    //     useReplacements = true;
    //   }
    // }

    if (useReplacements) {

      // TODO: make useful comment here

      // when serializing a reference to contentId
      // serialize non-withheld replacements
      // rather than component itself
      let serializedState = [];
      let nReplacementsToSerialize = this.replacements.length;
      if (this.replacementsToWithhold !== undefined) {
        nReplacementsToSerialize -= this.replacementsToWithhold;
      }
      for (let ind = 0; ind < nReplacementsToSerialize; ind++) {
        let serializedComponent = this.replacements[ind].serialize(parameters);
        if (Array.isArray(serializedComponent)) {
          serializedState.push(...serializedComponent);
        } else {
          serializedState.push(serializedComponent);
        }

      }

      if (parameters.forCopy !== true) {
        serializedState = [{
          componentType: 'group',
          children: serializedState,
          doenetAttributes: Object.assign({}, this.doenetAttributes),
        }]
      } else {
        // TODO: determine if this check is necessary
        if (serializedState.length === 1) {
          return serializedState[0]
        } else {
          return serializedState;
        }
      }

      return serializedState;


    } else {

      let serializedState = super.serialize(parameters);

      // record component name of targetComponent
      serializedState.targetComponentName = this.stateValues.targetName;

      return serializedState;
    }
  }

  static createSerializedReplacements({ component, components, workspace, componentInfoObjects }) {

    // console.log(`create serialized replacements of ${component.componentName}`)

    // if (component.state.contentIDChild !== undefined) {
    //   if (!component.state.serializedStateForContentId) {
    //     return { replacements: [] };
    //   }
    // }

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    let serializedCopy;

    let assignNames = component.doenetAttributes.assignNames;

    // if (component.state.serializedContent !== undefined) {
    //   if (component.state.serializedContent.length === 0) {
    //     serializedCopy = [];
    //   } else {
    //     serializedCopy = deepClone(component.state.serializedContent);

    //     // top level replacements need state so that can
    //     // add any properties specified by copy
    //     for (let comp of serializedCopy) {
    //       if (comp.state === undefined) {
    //         comp.state = {};
    //       }
    //     }
    //   }
    // } else {


    if (!component.stateValues.targetComponent) {
      let replacements = [];
      if (assignNames) {
        replacements = [{ componentType: "empty", doenetAttributes: { assignNames } }]
      }
      return { replacements };
    }

    // if creating copy from a prop
    // manually create the serialized state
    if (component.stateValues.useProp) {
      let componentOrReplacementNames = component.stateValues.componentIdentitiesForProp.map(x => x.componentName);

      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsed = [];

      let results = replacementFromProp({
        component, components, componentOrReplacementNames, uniqueIdentifiersUsed
      });

      workspace.propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        serializedComponents: results.serializedReplacements,
        // assignDirectlyToComposite: true, 
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        propVariableObjs: component.stateValues.propVariableObjs,
        componentTypeByTarget: component.stateValues.componentTypeByTarget,
        componentInfoObjects,
      });

      // if added empty replacements, add prop variables copied
      if (processResult.nEmptiesAdded > 0) {
        workspace.propVariablesCopiedByReplacement.push(
          ...Array(processResult.nEmptiesAdded).fill([])
        )
      }

      return { replacements: processResult.serializedComponents };

    }

    // TODO: check if inactive?

    // if creating copy directly from the target component,
    // create a serialized copy of the entire component
    let target = components[component.stateValues.targetComponent.componentName];


    // TODO: how do we determine if all target and descendant state variables
    // are resolved?

    // all target descendants have to be resolved to be able to successfully expand copy
    // Rationale: to create the shadow, core will need to
    // evaluate all state variables to determine which are essential

    // if (!this.allVariablesDescendantsReplacementsResolved(target)) {
    //   return { notReadyToExpand: true };
    // }

    serializedCopy = target.serialize({ forCopy: true });
    serializedCopy = [serializedCopy];

    // console.log("targetComponent");
    // console.log(component.state.targetComponent);
    // console.log("serializedCopy");
    // console.log(JSON.parse(JSON.stringify(serializedCopy)));


    if (!workspace.uniqueIdentifiersUsed) {
      workspace.uniqueIdentifiersUsed = []
    }

    let serializedReplacements = postProcessCopy({
      serializedComponents: serializedCopy,
      componentName: component.componentName,
      uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
    })

    let processResult = serializeFunctions.processAssignNames({
      assignNames,
      serializedComponents: serializedReplacements,
      assignDirectlyToComposite: true,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };

  }

  // static allVariablesDescendantsReplacementsResolved(component) {
  //   for(let varName in component.state) {
  //     if(!component.state[varName].isResolved) {
  //       return false;
  //     }
  //   }
  //   for(let child of component.definingChildren) {
  //     if(!this.allVariablesDescendantsReplacementsResolved(child)) {
  //       return false;
  //     }
  //   }
  //   if(component.replacements !== undefined) {
  //     for(let rep of component.replacements) {
  //       if(!this.allVariablesDescendantsReplacementsResolved(rep)) {
  //         return false;
  //       }
  //     }
  //   }

  //   return true;

  // }


  static calculateReplacementChanges({ component, componentChanges, components,
    workspace,
    componentInfoObjects
  }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (!component.stateValues.propDependenciesSetUp) {
      return [];
    }

    let replacementChanges = [];


    // TODO: determine how to calculate replacement changes with new conventions

    // TODO: may need to address the case that the actual targetComponent was deleted

    // if (component.state.contentIdChild) {
    //   if (component.state.serializedContentChanged) {
    //     if (component.state.serializedContent.length === 0) {
    //       if (component.replacements.length > 0) {
    //         let replacementInstruction = {
    //           changeType: "delete",
    //           changeTopLevelReplacements: true,
    //           firstReplacementInd: 0,
    //           numberReplacementsToDelete: component.replacements.length,
    //         }

    //         replacementChanges.push(replacementInstruction);
    //       }
    //     } else {
    //       let serializedCopy = deepClone(component.state.serializedContent);

    //       // top level replacement needs any properties specified by copy
    //       if (serializedCopy[0].state === undefined) {
    //         serializedCopy[0].state = {};
    //       }
    //       component.addPropertiesFromRef({ serializedCopy: serializedCopy[0], includeAllProperties: true });
    //       serializedCopy = postProcessCopy({ serializedComponents: serializedCopy, componentName: component.componentName, addShadowDependencies: false });
    //       let replacementInstruction = {
    //         changeType: "add",
    //         changeTopLevelReplacements: true,
    //         firstReplacementInd: 0,
    //         numberReplacementsToReplace: component.replacements.length,
    //         serializedReplacements: serializedCopy,
    //         applySugar: true,
    //       };
    //       replacementChanges.push(replacementInstruction);
    //     }
    //   }
    //   return replacementChanges;
    // }

    // // if there are no children in location of childnumber
    // // or prop doesn't currently refer to a target
    // // or target is inactive
    // // delete the replacements (if they currently exist)
    // if (component.state.targetComponent === undefined || component.state.targetInactive) {
    //   if (component.replacements.length > 0) {
    //     let replacementInstruction = {
    //       changeType: "delete",
    //       changeTopLevelReplacements: true,
    //       firstReplacementInd: 0,
    //       numberReplacementsToDelete: component.replacements.length,
    //     }

    //     replacementChanges.push(replacementInstruction);
    //   }

    //   return replacementChanges;

    // }

    // // check if targetComponent has changed or new active
    // if (component.state.previousRefTarget === undefined ||
    //   component.state.targetComponent.componentName !== component.state.previousRefTarget.componentName ||
    //   component.state.targetPrevInactive) {

    //   this.recreateReplacements({ component, replacementChanges, components });

    //   return replacementChanges;
    // }

    // for all references determined from copy itself
    // check if they differ from targetComponent
    // If so, send instructions to change them
    // TODO: figure out what this is doing, make sure it is necessary
    // and add test to check that it works correctly
    // May need to add to collect if it is necessary
    // for(let property in component._state) {
    //   if(property === "prop" || property === "childnumber") {
    //     continue;
    //   }
    //   let propertyObj = component._state[property];
    //   for(let replacement of component.replacements) {
    //     if(propertyObj.isProperty === true &&
    //       propertyObj.value !== replacement.state[property]) {
    //       let replacementInstruction = {
    //         changeType: "updateStateVariables",
    //         component: replacement,
    //         stateChanges: {[property]: propertyObj.value}
    //       }
    //       replacementChanges.push(replacementInstruction);
    //     }
    //   }
    // }

    if (!component.stateValues.targetComponent) {
      if (component.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: component.replacements.length,
          replacementsToWithhold: 0,
        }
        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;

    }

    if (component.stateValues.targetInactive) {
      let nReplacements = component.replacements.length;
      if (nReplacements > 0) {
        if (component.replacementsToWithhold !== nReplacements) {
          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: nReplacements,
          };
          replacementChanges.push(replacementInstruction);
        }
      }

      return replacementChanges;
    }

    if (component.replacementsToWithhold > 0) {
      let replacementInstruction = {
        changeType: "changeReplacementsToWithhold",
        replacementsToWithhold: 0,
      };
      replacementChanges.push(replacementInstruction);
    }


    // if copy determined by prop
    // don't change replacements
    // unless have an array
    if (component.stateValues.useProp) {

      // use new uniqueIdentifiersUsed for recreateReplacements
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = [];

      let componentOrReplacementNames = component.stateValues.componentIdentitiesForProp.map(x => x.componentName);

      let results = replacementFromProp({
        component, components, componentOrReplacementNames, uniqueIdentifiersUsed
      });

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: results.serializedReplacements,
        // assignDirectlyToComposite: true, 
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        propVariableObjs: component.stateValues.propVariableObjs,
        componentTypeByTarget: component.stateValues.componentTypeByTarget,
        componentInfoObjects,
      });

      results.serializedReplacements = processResult.serializedComponents;

      let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;
      // if added empty replacements, add prop variables copied
      if (processResult.nEmptiesAdded > 0) {
        propVariablesCopiedByReplacement.push(
          ...Array(processResult.nEmptiesAdded).fill([])
        )
      }

      let newSerializedReplacements = results.serializedReplacements;

      let nNewReplacements = newSerializedReplacements.length;
      let nOldReplacements = component.replacements.length;


      for (let ind = 0; ind < Math.min(nNewReplacements, nOldReplacements); ind++) {
        if (propVariablesCopiedByReplacement[ind].length !== workspace.propVariablesCopiedByReplacement[ind].length ||
          workspace.propVariablesCopiedByReplacement[ind].some((v, i) => v !== propVariablesCopiedByReplacement[ind][i]) ||
          component.replacements[ind].componentType !== newSerializedReplacements[ind].componentType
        ) {

          let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: ind,
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
          firstReplacementInd: nOldReplacements,
          numberReplacementsToReplace: 0,
          serializedReplacements: newSerializedReplacements.slice(nOldReplacements),
        };
        replacementChanges.push(replacementInstruction);
      } else if (nNewReplacements < nOldReplacements) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: nNewReplacements,
          numberReplacementsToDelete: nOldReplacements - nNewReplacements,
        }

        replacementChanges.push(replacementInstruction);
      }

      workspace.propVariablesCopiedByReplacement = propVariablesCopiedByReplacement;

      // console.log(`replacementChanges for ${component.componentName}`)
      // console.log(replacementChanges);
      return replacementChanges;
    }


    // copy not determined by a prop

    // if have no replacements, try creating new replacements

    if (component.replacements.length === 0) {
      console.log(`let's create new ones!`);


      let result = this.createSerializedReplacements({
        component, components, workspace, componentInfoObjects
      });

      if (result.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToReplace: 0,
          serializedReplacements: result.replacements
        };

        replacementChanges.push(replacementInstruction);

      }

    }


    // console.log(`replacementChanges for ${component.componentName}`)
    // console.log(replacementChanges)
    return replacementChanges;


    // if(componentChanges.length > 1) {
    //   console.log("****** if had multiple adds or deletes, might not be putting children in right place. ******");
    // }

    // look for changes that are in downstream dependencies
    let additionalReplacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: component.componentName,
      downstreamDependencies: component.downstreamDependencies,
      components: components, workspace
    })
    replacementChanges.push(...additionalReplacementChanges);

    // console.log(replacementChanges);

    return replacementChanges;
  }

  static recreateReplacements({ component, replacementChanges, components, uniqueIdentifiersUsed }) {
    // // give instructions to move dependency to component.state.targetComponent
    // if (component.state.previousRefTarget !== undefined &&
    //   component.state.previousRefTarget.componentName in component.downstreamDependencies) {
    //   if (component.state.previousRefTarget.componentName !== component.state.targetComponent.componentName) {
    //     let replacementInstruction = {
    //       changeType: "moveDependency",
    //       dependencyDirection: "downstream",
    //       oldComponentName: component.state.previousRefTarget.componentName,
    //       newComponentName: component.state.targetComponent.componentName,
    //       dependencyType: "reference",
    //       otherAttributes: { shadowed: true }
    //     };
    //     if (component.state.propChild === undefined) {
    //       replacementInstruction.recurseToChildren = true;
    //     } else {
    //       replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
    //     }
    //     replacementChanges.push(replacementInstruction);
    //   }
    // }
    // else {
    //   // since no previous targetComponent, need to create new dependencies
    //   let replacementInstruction = {
    //     changeType: "addDependency",
    //     dependencyDirection: "downstream",
    //     newComponentName: component.state.targetComponent.componentName,
    //     dependencyType: "reference",
    //     otherAttributes: { shadowed: true }
    //   };
    //   if (component.state.propChild === undefined) {
    //     replacementInstruction.recurseToChildren = true;
    //   } else {
    //     replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
    //   }
    //   replacementChanges.push(replacementInstruction);
    // }

    let newSerializedChildren, propVariablesCopiedByReplacement;

    if (component.stateValues.useProp) {
      let componentOrReplacementNames = component.stateValues.componentIdentitiesForProp.map(x => x.componentName);

      let results = replacementFromProp({
        component, components, componentOrReplacementNames, uniqueIdentifiersUsed
      });

      propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

      newSerializedChildren = results.serializedReplacements

    } else {

      let target = components[component.stateValues.targetComponent.componentName];

      newSerializedChildren = target.serialize({ forCopy: true });
      newSerializedChildren = [newSerializedChildren];

      if (!workspace.uniqueIdentifiersUsed) {
        workspace.uniqueIdentifiersUsed = []
      }

      newSerializedChildren = postProcessCopy({
        serializedComponents: newSerializedChildren,
        componentName: component.componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
      });
    }

    if (newSerializedChildren.length > 0) {
      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: newSerializedChildren,
      };
      replacementChanges.push(replacementInstruction);
    } else if (component.replacements.length > 0) {
      // delete all replacements, if they exist
      let replacementInstruction = {
        changeType: "delete",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToDelete: component.replacements.length,
      }

      replacementChanges.push(replacementInstruction);
    }
    return { propVariablesCopiedByReplacement };

  }

}

export function replacementFromProp({ component, components, componentOrReplacementNames, uniqueIdentifiersUsed }) {


  let serializedReplacements = [];
  let propVariablesCopiedByReplacement = [];

  let replacementInd = -1;

  if (component.stateValues.componentTypeByTarget) {
    for (let [targetInd, componentType] of component.stateValues.componentTypeByTarget.entries()) {
      let propVariableObj = component.stateValues.propVariableObjs[targetInd];
      let numReplacementsForTarget = 1;
      if (Array.isArray(componentType)) {
        numReplacementsForTarget = componentType.length;
      }

      let targetName = componentOrReplacementNames[targetInd];
      let targetComponent = components[targetName];

      let stateVarObj = targetComponent.state[propVariableObj.varName];

      if (propVariableObj.isArray || propVariableObj.isArrayEntry) {

        let arrayStateVarObj, unflattenedArrayKeys;
        if (stateVarObj.isArray) {
          arrayStateVarObj = stateVarObj;
          unflattenedArrayKeys = stateVarObj.getAllArrayKeys(stateVarObj.arraySize, false);
        } else {
          arrayStateVarObj = targetComponent.state[stateVarObj.arrayStateVariable];
          unflattenedArrayKeys = stateVarObj.unflattenedArrayKeys;
        }

        let wrappingComponents = stateVarObj.wrappingComponents;
        let numWrappingComponents = wrappingComponents.length;

        if (numWrappingComponents === 0) {
          // return flattened entries

          let flattenedArrayKeys = flattenDeep(unflattenedArrayKeys);

          for (let ind = 0; ind < numReplacementsForTarget; ind++) {
            replacementInd++;
            let propVariablesCopied = propVariablesCopiedByReplacement[replacementInd] = [];

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

                  let uniqueIdentifierBase = componentToCopy.componentName + "|copy";
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

                  let uniqueIdentifierBase = componentType + "|empty";
                  let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                  serializedReplacements.push({
                    componentType,
                    uniqueIdentifier,
                  })
                  propVariablesCopied.push(null)

                }

              } else {
                let uniqueIdentifierBase = targetName + "|shadow|" + propVariable;
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                serializedReplacements.push({
                  componentType: componentType,
                  downstreamDependencies: {
                    [targetName]: [{
                      dependencyType: "referenceShadow",
                      compositeName: component.componentName,
                      propVariable
                    }]
                  },
                  uniqueIdentifier,
                })
              }
            } else {
              // didn't match an array key, so just add an empty component of componentType
              let uniqueIdentifierBase = componentType + "|empty";
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


                    let uniqueIdentifierBase = componentToCopy.componentName + "|copy";
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
                    let uniqueIdentifierBase = arrayStateVarObj.componentType + "|empty";
                    let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                    pieces.push({
                      componentType: arrayStateVarObj.componentType,
                      uniqueIdentifier,
                    })
                    propVariablesCopiedForThisPiece.push(null)

                  }

                } else {

                  let uniqueIdentifierBase = targetName + "|shadow|" + propVariable;
                  let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                  pieces.push({
                    componentType: arrayStateVarObj.componentType,
                    downstreamDependencies: {
                      [targetName]: [{
                        dependencyType: "referenceShadow",
                        compositeName: component.componentName,
                        propVariable
                      }]
                    },
                    uniqueIdentifier,
                  })
                }

                propVariablesCopiedByPiece.push(propVariablesCopiedForThisPiece);
              }
            }

            // we wrap this dimension if have corresponding wrapping components
            let wrapCs = wrappingComponents[nDimensionsLeft - 1];
            if (pieces.length > 0 && wrapCs && wrapCs.length > 0) {
              for (let ind = wrapCs.length - 1; ind >= 0; ind--) {
                let uniqueIdentifierBase = wrapCs[ind] + "|wrapper";
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                pieces = [{
                  componentType: wrapCs[ind],
                  children: pieces,
                  uniqueIdentifier,
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
              [targetName]: [{
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable: propVariableObj.varName,
                ignorePrimaryStateVariable: true,
              }]
            }
          }

          replacementInd += newReplacements.length;

          serializedReplacements.push(...newReplacements);

          if (newReplacements.length < numReplacementsForTarget) {
            // we didn't create enough replacements,
            // which could happen if we have includeUndefinedArrayEntries set

            // just create additional replacements,
            // even though they won't yet refer to the right dependencies

            for (let ind = newReplacements.length; ind < numReplacementsForTarget; ind++) {
              replacementInd++;
              propVariablesCopiedByReplacement[replacementInd] = [];

              let replacementClass = component.stateValues.replacementClasses[replacementInd];
              let componentType = replacementClass.componentType.toLowerCase();

              // just add an empty component of componentType

              let uniqueIdentifierBase = componentType + "|empty";
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              serializedReplacements.push({
                componentType,
                uniqueIdentifier,
              })
            }

          } else if (newReplacements > numReplacementsForTarget) {
            throw Error(`Something went wrong when creating replacements for ${component.componentName} as we ended up with too many replacements`)
          }

        }


      } else {
        // if not array or array entry

        for (let ind = 0; ind < numReplacementsForTarget; ind++) {
          replacementInd++;
          let propVariablesCopied = propVariablesCopiedByReplacement[replacementInd] = [];

          let replacementClass = component.stateValues.replacementClasses[replacementInd];

          let componentType = replacementClass.componentType.toLowerCase();

          propVariablesCopied.push(propVariableObj.varName);

          if (propVariableObj.containsComponentNamesToCopy) {

            let componentNameToCopy = targetComponent.state[propVariableObj.varName].value
            let componentToCopy = components[componentNameToCopy];

            if (componentToCopy) {
              while (componentToCopy.replacementOf
                && componentToCopy.replacementOf.replacements.length === 1
              ) {
                componentToCopy = componentToCopy.replacementOf;
              }

              let stateForReplacementCopy;
              if (stateVarObj.targetPropertiesToIgnoreOnCopy) {
                stateForReplacementCopy = {
                  targetPropertiesToIgnore: stateVarObj.targetPropertiesToIgnoreOnCopy
                }
              }

              let uniqueIdentifierBase = componentToCopy.componentName + "|copy";
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

              propVariablesCopied.push(componentToCopy.componentName);

            } else {
              // just give an empty component of componentType
              let uniqueIdentifierBase = componentType + "|empty";
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              serializedReplacements.push({
                componentType,
                uniqueIdentifier,
              })

              propVariablesCopied.push(null);

            }

          } else {

            let uniqueIdentifierBase = targetName + "|shadow|" + propVariableObj.varName;
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType,
              downstreamDependencies: {
                [targetName]: [{
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
    }
  }

  // console.log(`serializedReplacements for ${component.componentName}`)
  // console.log(serializedReplacements)

  return { serializedReplacements, propVariablesCopiedByReplacement };

}



export function processChangesForReplacements({ componentChanges, componentName,
  downstreamDependencies, components, workspace }) {
  let replacementChanges = [];

  for (let change of componentChanges) {
    let childrenToShadow = [];
    let childrenToDeleteShadows = [];
    let replacementsToShadow = [];
    let deleteShadowsofCompositeReplacements;
    let parentShadow;
    let propertyChildrenShadowed;
    let replacementIndex = 0;

    if (change.changeType === "added") {
      let parent = components[change.parent];
      let dep = downstreamDependencies[parent.componentName];
      if (dep === undefined) {
        continue;
      }
      if (dep.dependencyType !== "reference") {
        console.log("Found downstream dependency of " + componentName
          + " that wasn't a reference.  Ignoring.");
        continue;
      }

      // Found a reference that had children added to it.
      // Need to create new shadow of that
      // as long as isn't a child that a dependency doesn't include
      if (dep.shadowed === true) {

        // find shadow of parent
        let parentShadowDep;
        for (let dep2Name in parent.upstreamDependencies) {
          let dep2 = parent.upstreamDependencies[dep2Name];
          if (dep2.dependencyType === "referenceShadow" &&
            dep2.compositeName === componentName) {
            parentShadow = components[dep2Name];
            parentShadowDep = dep2;
            break;
          }
        }

        if (!parentShadow) {
          throw Error("Something is wrong.  Couldn't find shadow of parent referenced");
        }

        // if aren't shadowing any defining children of parent
        // skip adding shadows
        if (!parentShadowDep.includeAnyDefiningChildren) {
          continue;
        }

        propertyChildrenShadowed = parentShadowDep.includePropertyChildren;
        for (let newChild of change.newChildren) {
          if (!newChild.componentIsAProperty || propertyChildrenShadowed) {
            childrenToShadow.push(newChild);
          }
        }
      }
      else {
        // if dependency isn't shadowed
        // it's an error since we've already addressed the case
        // of a childnumber being referenced
        throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
      }
    }
    else if (change.changeType === "deleted") {
      for (let parentName in change.parentsOfDeleted) {
        let dep = downstreamDependencies[parentName];
        if (dep === undefined) {
          continue;
        }
        if (dep.dependencyType !== "reference") {
          console.log("Found downstream dependency of " + componentName
            + " that wasn't a reference.  Ignoring.");
          continue;
        }

        let parentObj = change.parentsOfDeleted[parentName];
        if (dep.shadowed === true) {
          for (var name of parentObj.definingChildrenNames) {
            childrenToDeleteShadows.push(components[name]);
          }
        }
        else {
          // if dependency isn't shadowed
          // it's an error since we've already addressed the case
          // of a childnumber being referenced
          throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
        }
      }
    }
    else if (change.changeType === "addedReplacements") {
      let composite = change.composite;
      let dep = downstreamDependencies[composite.componentName];
      if (dep === undefined || dep.dependencyType !== "reference") {
        continue;
      }

      // Found a reference that had replacements changed
      // Need to create new shadow of that
      if (dep.shadowed === true) {
        // attempt to find shadow of parent

        let result = findParentShadowOrBaseTarget({
          thisComponentName: componentName,
          component: change.newReplacements[0],
          thisDownstreamDependencies: downstreamDependencies,
          topLevel: change.topLevel,
          components,
        });

        parentShadow = result.parentShadow;
        replacementIndex = result.replacementIndex;

        if (parentShadow) {

          // if don't aren't shadowing any defining children of parent
          // skip adding shadows
          if (!result.parentShadowDep.includeAnyDefiningChildren) {
            continue;
          }

          propertyChildrenShadowed = result.parentShadowDep.includePropertyChildren;

          // Found a reference that had children added to it.
          // Need to create new shadow of that
          // as long as isn't a child that a dependency doesn't include
          for (let newReplacement of change.newReplacements) {
            if (!newReplacement.componentIsAProperty || propertyChildrenShadowed) {
              replacementsToShadow.push(newReplacement);
            }
          }
        } else if (result.foundBaseTarget) {
          for (let newReplacement of change.newReplacements) {
            replacementsToShadow.push(newReplacement);
          }
        }
      } else {
        // if dependency isn't shadowed
        // it's an error since we've already addressed the case
        // of a childnumber being referenced
        throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
      }
    }
    else if (change.changeType === "deletedReplacements") {
      let composite = change.composite;
      let dep = downstreamDependencies[composite.componentName];
      if (dep === undefined || dep.dependencyType !== "reference") {
        continue;
      }
      // Found a reference that had replacements changed
      // Need to create new shadow of that
      if (dep.shadowed === true) {
        if (change.topLevel === true) {
          let deletedComponents = [];
          for (let compName in change.deletedComponents) {
            deletedComponents.push(change.deletedComponents[compName]);
          }

          deleteShadowsofCompositeReplacements = {
            composite: composite,
            deletedComponents: deletedComponents,
          }
        }
        else {
          for (let compName in change.deletedComponents) {
            childrenToDeleteShadows.push(change.deletedComponents[compName]);
          }
        }
      }
      else {
        // if dependency isn't shadowed
        // it's an error since we've already addressed the case
        // of a childnumber being referenced
        throw Error("Something is wrong.  Dep isn't shadowed but no childnumber");
      }
    }

    if (childrenToShadow.length > 0) {

      // add reference dependency for each child
      for (let comp of childrenToShadow) {

        let replacementInstruction = {
          changeType: "addDependency",
          dependencyDirection: "downstream",
          newComponentName: comp.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true },
          recurseToChildren: true,
        };

        replacementChanges.push(replacementInstruction);

      }

      let newSerializedChildren = childrenToShadow.map(x => x.serialize({ forCopy: true }));
      // flatten array
      newSerializedChildren = newSerializedChildren.reduce((a, c) => Array.isArray(c) ? [...a, ...c] : [...a, c], [])

      if (newSerializedChildren.length === 0) {
        continue;
      }

      if (!workspace.uniqueIdentifiersUsed) {
        workspace.uniqueIdentifiersUsed = []
      }

      newSerializedChildren = postProcessCopy({
        serializedComponents: newSerializedChildren,
        componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed,
      });
      let replacementInstruction = {
        changeType: "add",
        parent: parentShadow,
        indexOfDefiningChildren: change.indexOfDefiningChildren,
        serializedReplacements: newSerializedChildren,
      };
      replacementChanges.push(replacementInstruction);
    }

    if (childrenToDeleteShadows.length > 0) {
      let componentsToDelete = [];
      // find shadows of each child
      for (let child of childrenToDeleteShadows) {
        for (let depName in child.upstreamDependencies) {
          let dep = child.upstreamDependencies[depName];
          if (dep.dependencyType === "referenceShadow" &&
            dep.compositeName === componentName) {
            componentsToDelete.push(components[depName]);
            break;
          }
        }
      }
      if (componentsToDelete.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          components: componentsToDelete,
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    if (replacementsToShadow.length > 0) {

      // add reference dependency for each replacement
      for (let comp of replacementsToShadow) {

        let replacementInstruction = {
          changeType: "addDependency",
          dependencyDirection: "downstream",
          newComponentName: comp.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true },
          recurseToChildren: true,
        };

        replacementChanges.push(replacementInstruction);

      }

      let newSerializedChildren = replacementsToShadow.map(x => x.serialize({ forCopy: true }));
      // flatten array
      newSerializedChildren = newSerializedChildren.reduce((a, c) => Array.isArray(c) ? [...a, ...c] : [...a, c], [])

      if (newSerializedChildren.length === 0) {
        continue;
      }

      if (!workspace.uniqueIdentifiersUsed) {
        workspace.uniqueIdentifiersUsed = []
      }

      newSerializedChildren = postProcessCopy({
        serializedComponents: newSerializedChildren,
        componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
      });

      // check if parent of replacements is being shadowed

      if (parentShadow === undefined) {

        // if parent isn't being shadowed, we must have a top level replacement
        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: replacementIndex + change.firstIndex,
          numberReplacementsToReplace: change.numberDeleted,
          serializedReplacements: newSerializedChildren,
        };
        replacementChanges.push(replacementInstruction);
      }
      else {
        // if parent is being shadowed, then add to shadowed parent
        // check if replacemenreplacementParent.allChildren[originalComposite.componentName].definingChildrenIndextsToShadow is a defining child of parent
        let replacementParent = components[replacementsToShadow[0].parent];

        let definingIndex = replacementParent.allChildren[replacementsToShadow[0].componentName].definingChildrenIndex;
        // if defining index is undefined,
        // then check if replacementsToShadow is a replacement of a composite
        // that is a defining child of parent
        if (definingIndex !== undefined) {
          // TODO: Need to adjust definingIndex with determineEffectiveSize(definingChild)
          // (as is done below in case when foundNewComposite)
          // since some of the previous defining children might be composites that are expanded.
          // Should find doenetML that triggers this case first, so can create a test.

          // If propertyChildrenShadowed is false, shadow may have fewer children than original.
          // definingIndex for shadow must be reduced if any of the previous children
          // were propertyChildren
          if (propertyChildrenShadowed) {
            let numPreviousPropertyChildren = 0;
            for (let ind = 0; ind < definingIndex; ind++) {
              if (replacementParent.definingChildren[ind].componentIsAProperty) {
                numPreviousPropertyChildren++;
              }
            }
            definingIndex -= numPreviousPropertyChildren;
          }

        } else {
          // find composite for which replacementsToShadow is replacement
          let comp = replacementsToShadow[0];
          let foundNewComposite = true;
          while (foundNewComposite && definingIndex === undefined) {
            foundNewComposite = false;
            for (let depName in comp.downstreamDependencies) {
              let dep = comp.downstreamDependencies[depName];
              if (dep.dependencyType === "replacement" && dep.topLevel) {
                // find which effective replacement we are
                let numReplacementsSoFar = 0;
                let depComponent = components[depName];
                for (let rep of depComponent.replacements) {
                  if (comp.componentName === rep.componentName) {
                    replacementIndex += numReplacementsSoFar;
                    break;
                  } else {
                    numReplacementsSoFar += determineEffectiveSize(rep);
                  }
                }
                foundNewComposite = true;
                definingIndex = replacementParent.allChildren[depName].definingChildrenIndex;
                if (definingIndex !== undefined) {
                  // for each of the defining children before this
                  // count replacements
                  let effectiveDefiningIndex = 0;
                  for (let ind = 0; ind < definingIndex; ind++) {
                    let definingChild = replacementParent.definingChildren[ind];
                    if (propertyChildrenShadowed || !definingChild.componentIsAProperty) {
                      effectiveDefiningIndex += determineEffectiveSize(definingChild);
                    }
                  }

                  definingIndex = effectiveDefiningIndex + replacementIndex;
                }
                break;
              }
            }
          }
          // console.log(originalComposite.componentName);
          // console.log(replacementParent.componentName);
          // if (originalComposite !== undefined) {
          //   console.log(replacementParent.allChildren[originalComposite.componentName].definingChildrenIndex)
          //   definingIndex = replacementParent.allChildren[originalComposite.componentName].definingChildrenIndex + change.firstIndex;
          // }
        }
        if (definingIndex === undefined) {
          // TODO: check out more cases
          // TODO: adapters?
          throw Error("Still need to work on determining replacement changes")
        }
        let replacementInstruction = {
          changeType: "add",
          parent: parentShadow,
          indexOfDefiningChildren: definingIndex,
          serializedReplacements: newSerializedChildren,
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    if (deleteShadowsofCompositeReplacements !== undefined) {
      // attempt to find shadow of composite's parent
      // check if parent of replacements is being shadowed

      let result = findParentShadowOrBaseTarget({
        thisComponentName: componentName,
        component: deleteShadowsofCompositeReplacements.composite,
        thisDownstreamDependencies: downstreamDependencies,
        topLevel: true,
        components,
      });

      parentShadow = result.parentShadow;

      if (result.foundBaseTarget) {

        // we have a top level replacement
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: change.firstIndex,
          numberReplacementsToDelete: change.numberDeleted,
        };
        replacementChanges.push(replacementInstruction);

      } else if (parentShadow) {

        let componentsToDelete = [];

        let findShadowToDelete = function (child, deleteList) {
          let foundShadow = false;
          for (let depName in child.upstreamDependencies) {
            let dep = child.upstreamDependencies[depName];
            if (dep.dependencyType === "referenceShadow" &&
              dep.compositeName === componentName) {
              deleteList.push(components[depName]);
              break;
            }
          }
          if (!foundShadow && child.replacements !== undefined) {
            for (let repl of child.replacements) {
              findShadowToDelete(repl, deleteList);
            }
          }
        }

        // find shadows of each deleted component
        for (let child of deleteShadowsofCompositeReplacements.deletedComponents) {
          findShadowToDelete(child, componentsToDelete);
        }

        let replacementInstruction = {
          changeType: "delete",
          components: componentsToDelete,
        };
        replacementChanges.push(replacementInstruction);

      }
    }
  }

  // console.log(replacementChanges)
  return replacementChanges;
}


function findParentShadowOrBaseTarget({ thisComponentName, component,
  thisDownstreamDependencies, topLevel, components }) {
  let componentParent = components[component.parent];
  let parentShadowDep, parentShadow;
  let replacementIndex = 0;
  for (let depName in componentParent.upstreamDependencies) {
    let dep = componentParent.upstreamDependencies[depName];
    if (dep.dependencyType === "referenceShadow" &&
      dep.compositeName === thisComponentName) {
      parentShadow = components[depName];
      parentShadowDep = dep;
      break;
    }
  }

  if (parentShadow) {
    return {
      parentShadow: parentShadow,
      parentShadowDep: parentShadowDep,
      replacementIndex: replacementIndex,
    }
  }

  if (!topLevel) {
    return {}
  }

  // if don't have parentShadow but it is a topLevel replacement
  // check if is top level replacement of baseTarget
  // or can get to baseTarget by just going through topLevel replacements
  // as in this case, it wouldn't have a shadowed parent
  // but would become of a topLevel replacement of this copy

  let stillTopLevel = true;
  let foundBaseTarget = false;
  let comp = component;
  while (stillTopLevel && !foundBaseTarget) {
    let thisDep = thisDownstreamDependencies[comp.componentName];
    if (thisDep && thisDep.dependencyType === "reference" && thisDep.baseReference) {
      foundBaseTarget = true;
      break;
    }

    stillTopLevel = false;
    for (let depName in comp.downstreamDependencies) {
      let dep = comp.downstreamDependencies[depName];
      if (dep.dependencyType === "replacement" && dep.topLevel) {
        stillTopLevel = true;
        // find which effective replacement we are
        let numReplacementsSoFar = 0;
        let depComponent = components[depName]
        for (let rep of depComponent.replacements) {
          if (comp.componentName === rep.componentName) {
            replacementIndex += numReplacementsSoFar;
            break;
          } else {
            numReplacementsSoFar += determineEffectiveSize(rep);
          }
        }
        comp = depComponent;
      }
    }
  }
  if (foundBaseTarget) {
    return {
      foundBaseTarget: true,
      replacementIndex: replacementIndex,
    }
  }


  // check again for shadow of parent, but this time using
  // parent of the last composite found
  componentParent = components[comp.parent];

  for (let depName in componentParent.upstreamDependencies) {
    let dep = componentParent.upstreamDependencies[depName];
    if (dep.dependencyType === "referenceShadow" &&
      dep.compositeName === thisComponentName) {
      parentShadow = components[depName];
      parentShadowDep = dep;
      break;
    }
  }

  if (parentShadow) {
    return {
      parentShadow: parentShadow,
      parentShadowDep: parentShadowDep,
      replacementIndex: replacementIndex,
    }
  }

  return {};

}

function determineEffectiveSize(component) {
  if (!component.replacements) {
    return 1;
  }
  let replacementsSoFar = 0;
  for (let rep of component.replacements) {
    replacementsSoFar += determineEffectiveSize(rep);
  }
  return replacementsSoFar;

}