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

  static assignNamesToReplacements = true;

  static acceptTname = true;
  static acceptProp = true;
  static acceptFromMapAncestor = true;
  static acceptFromSources = true;

  static get stateVariablesShadowedForReference() { return ["targetComponent", "propName"] };


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

    // TODO: have check validity of properties again?

    let properties = {};
    for (let componentType of allPossibleProperties) {
      properties[componentType] = { ignorePropagationFromAncestors: true, default: null };
    }

    // Just in case there is a component that added these as a property, delete them

    // delete string and contentid
    delete properties.string;
    delete properties.contentid;

    // delete basic types, in case they were used as property
    delete properties.math;
    delete properties.number;
    delete properties.text;

    properties.includeUndefinedObjects = { default: false };
    properties.componentIndex = { default: null };
    properties.propIndex = { default: null };

    // properties.targetPropertiesToIgnore = { default: [] };

    return properties;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "atMostOneContentId",
      componentType: 'contentid',
      number: 1,
      comparison: "atMost",
      setAsBase: true
    });


    return childLogic;
  }

  static returnStateVariableDefinitions({ propertyNames }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.fromMapAncestor = {
      returnDependencies: () => ({
        fromMapAncestor: {
          dependencyType: "doenetAttribute",
          attributeName: "fromMapAncestor"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { fromMapAncestor: dependencyValues.fromMapAncestor }
      })
    }

    stateVariableDefinitions.fromSources = {
      returnDependencies: () => ({
        fromSources: {
          dependencyType: "doenetAttribute",
          attributeName: "fromSources"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { fromSources: dependencyValues.fromSources }
      })
    }

    stateVariableDefinitions.tName = {
      returnDependencies: () => ({
        tName: {
          dependencyType: "doenetAttribute",
          attributeName: "tName"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { tName: dependencyValues.tName }
      })
    }

    stateVariableDefinitions.targetSourcesName = {
      additionalStateVariablesDefined: ["sourcesChildNumber"],
      stateVariablesDeterminingDependencies: ["fromMapAncestor", "fromSources", "tName"],
      returnDependencies: function ({ stateValues, sharedParameters }) {

        if (stateValues.tName !== "_source") {
          return {};
        }

        let sourcesInfo = sharedParameters.sourcesInfo;

        if (sourcesInfo === undefined) {
          console.error(`Cannot copy _source when not inside a map template.`);
          return {};
        }

        let fromMapAncestor = stateValues.fromMapAncestor ? Number(stateValues.fromMapAncestor) : 1
        let fromSources = stateValues.fromSources ? Number(stateValues.fromSources) : 1

        let level = sourcesInfo.length - fromMapAncestor;
        let infoForLevel = sourcesInfo[level];
        if (infoForLevel === undefined) {
          console.error(`For copy of _source, invalid value of fromMapAncestor: ${stateValues.fromMapAncestor}`);
          return {};
        }
        let infoForSources = infoForLevel[fromSources - 1];
        if (infoForSources === undefined) {
          console.error(`For copy of _source, invalid value of fromSources: ${stateValues.fromSources}`);
          return {};
        };

        return {
          targetSourcesName: {
            dependencyType: "value",
            value: infoForSources.name,
          },
          sourcesChildNumber: {
            dependencyType: "value",
            value: infoForSources.childNumber
          }
        }

      },
      definition: function ({ dependencyValues }) {
        let targetSourcesName = dependencyValues.targetSourcesName;
        let sourcesChildNumber = dependencyValues.sourcesChildNumber;
        if (!targetSourcesName) {
          targetSourcesName = null;
          sourcesChildNumber = null;
        }
        return {
          newValues: { targetSourcesName, sourcesChildNumber },
          makeEssential: ["targetSourcesName", "sourcesChildNumber"],
        }
      },
    };

    stateVariableDefinitions.targetSources = {
      stateVariablesDeterminingDependencies: ["targetSourcesName"],
      returnDependencies({ stateValues }) {
        if (!stateValues.targetSourcesName) {
          return {};
        }
        return {
          targetSourcesComponent: {
            dependencyType: "componentIdentity",
            componentName: stateValues.targetSourcesName,
          }
        }
      },
      definition: function ({ dependencyValues }) {
        let targetSources = dependencyValues.targetSourcesComponent;
        if (!targetSources) {
          targetSources = null;
        }
        return { newValues: { targetSources } }
      },
    };


    stateVariableDefinitions.sourceIndex = {
      stateVariablesDeterminingDependencies: ["tName", "fromMapAncestor", "fromSources"],
      returnDependencies: function ({ stateValues, sharedParameters }) {
        if (stateValues.tName !== "_sourceindex") {
          return {};
        }

        let sourcesChildIndices = sharedParameters.sourcesChildIndices;

        if (sourcesChildIndices === undefined) {
          console.error(`Cannot copy _sourceindex when not inside a map template.`);
          return {};
        }

        let fromMapAncestor = stateValues.fromMapAncestor ? Number(stateValues.fromMapAncestor) : 1
        let fromSources = stateValues.fromSources ? Number(stateValues.fromSources) : 1

        let level = sourcesChildIndices.length - fromMapAncestor;
        let childIndices = sourcesChildIndices[level];
        if (childIndices === undefined) {
          console.error(`For copy of _sourceindex, invalid value of fromMapAncestor: ${stateValues.fromMapAncestor}`);
          return {};
        }
        let childIndex = childIndices[fromSources - 1];
        if (childIndex === undefined) {
          console.error(`For copy of _sourceindex, invalid value of fromSources: ${stateValues.fromSources}`);
          return {};
        };

        return {
          sourceIndex: {
            dependencyType: "value",
            value: childIndex,
          }

        }

      },
      definition: function ({ dependencyValues }) {
        let sourceIndex = dependencyValues.sourceIndex;
        if (sourceIndex === undefined) {
          sourceIndex = null;
        }
        return {
          newValues: { sourceIndex },
          makeEssential: ["sourceIndex"]
        }
      },
    };


    stateVariableDefinitions.targetComponent = {
      stateVariablesDeterminingDependencies: ["targetSources", "sourceIndex"],
      returnDependencies({ stateValues }) {
        if (stateValues.sourceIndex !== null) {
          return {};
        }

        if (stateValues.targetSources !== null) {
          return {
            targetSourcesChildren: {
              dependencyType: "stateVariable",
              componentName: stateValues.targetSources.componentName,
              variableName: "childIdentities"
            },
            sourcesChildNumber: {
              dependencyType: "stateVariable",
              variableName: "sourcesChildNumber"
            }

          }
        }

        return {
          targetComponent: {
            dependencyType: "targetComponent",
          }
        }
      },
      definition: function ({ dependencyValues }) {

        let targetComponent = null;
        if (dependencyValues.targetSourcesChildren) {
          targetComponent = dependencyValues.targetSourcesChildren[dependencyValues.sourcesChildNumber]
          if (!targetComponent) {
            targetComponent = null;
          }
        } else if (dependencyValues.targetComponent) {
          targetComponent = dependencyValues.targetComponent
        }

        return {
          newValues: { targetComponent }
        }
      },
    };

    stateVariableDefinitions.targetInactive = {
      stateVariablesDeterminingDependencies: ["targetComponent"],
      returnDependencies({ stateValues }) {
        if (stateValues.targetComponent) {
          return {
            targetIsInactiveCompositeReplacement: {
              dependencyType: "stateVariable",
              componentName: stateValues.targetComponent.componentName,
              variableName: "isInactiveCompositeReplacement"
            }
          }
        } else {
          return {}
        }
      },
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            targetInactive: Boolean(dependencyValues.targetIsInactiveCompositeReplacement)
          }
        }
      },
    };

    stateVariableDefinitions.contentId = {
      returnDependencies: () => ({
        contentIdChild: {
          dependencyType: "child",
          childLogicName: "atMostOneContentId",
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



    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "doenetAttribute",
          attributeName: "propName"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { propName: dependencyValues.propName } }
      }
    }


    stateVariableDefinitions.replacementSources = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "propName", "componentIndex", "propIndex"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {
          propName: {
            dependencyType: "stateVariable",
            variableName: "propName"
          }
        }

        if (!stateValues.propName && stateValues.propIndex !== null) {
          throw Error(`You cannot specify a propIndex without specifying a prop.`)
        }


        if (stateValues.targetComponent !== null) {

          let targets;

          if (componentInfoObjects.isStandardComposite(stateValues.targetComponent.componentType)) {
            targets = {
              dependencyType: "replacement",
              compositeName: stateValues.targetComponent.componentName,
              recursive: true,
              componentIndex: stateValues.componentIndex,
            }
            if (stateValues.propName) {
              targets.variableNames = [stateValues.propName];
            }
          } else if (stateValues.componentIndex === null || stateValues.componentIndex === 1) {
            // if we don't have a composite, componentIndex can only match if it is 1
            if (stateValues.propName) {
              targets = {
                dependencyType: "stateVariable",
                componentName: stateValues.targetComponent.componentName,
                variableName: stateValues.propName,
                returnAsComponentObject: true,
              }
            } else {
              targets = {
                dependencyType: "stateVariable",
                variableName: "targetComponent"
              }
            }
          }

          if (targets) {
            if (stateValues.propName) {
              targets.variablesOptional = true;
              targets.propIndex = stateValues.propIndex;
              targets.caseInsensitiveVariableMatch = true;
              targets.publicStateVariablesOnly = true;
              targets.useMappedVariableNames = true;
            }
            dependencies.targets = targets;
          }

        }
        return dependencies;
      },
      definition({ dependencyValues }) {

        let replacementSources = null;
        if (dependencyValues.targets) {
          replacementSources = dependencyValues.targets;
          if (!Array.isArray(replacementSources)) {
            replacementSources = [replacementSources];
          }
        }
        return { newValues: { replacementSources } };
      },
    }

    // stateVariableDefinitions.validPropertiesSpecified = {
    //   returnDependencies: function () {
    //     let dependencies = {
    //       replacementClasses: {
    //         dependencyType: "stateVariable",
    //         variableName: "replacementClasses"
    //       },
    //       propName: {
    //         dependencyType: "stateVariable",
    //         variableName: "propName",
    //       },
    //       validProp: {
    //         dependencyType: "stateVariable",
    //         variableName: "validProp"
    //       }
    //     }
    //     for (let property of propertyNames) {
    //       dependencies[property] = {
    //         dependencyType: "stateVariable",
    //         variableName: property,
    //       }
    //     }

    //     return dependencies;
    //   },
    //   definition: function ({ dependencyValues, componentInfoObjects }) {

    //     if (dependencyValues.propName && !dependencyValues.validProp) {
    //       return { newValues: { validPropertiesSpecified: false } }
    //     }

    //     let replacementClasses = dependencyValues.replacementClasses;

    //     let validProperties = true;


    //     for (let targetClass of replacementClasses) {
    //       let propertiesObject = targetClass.createPropertiesObject({
    //         standardComponentClasses: componentInfoObjects.standardComponentClasses,
    //         allPossibleProperties: componentInfoObjects.allPossibleProperties
    //       });

    //       for (let property in dependencyValues) {
    //         if (!["replacementClasses", "propName", "validProp",
    //           "includeUndefinedObjects", "fromSources", "fromMapAncestor"].includes(property)
    //           && (!(property in propertiesObject) )
    //         ) {
    //           let prescribedValue = dependencyValues[property];
    //           if (prescribedValue !== null && !(Array.isArray(prescribedValue) && prescribedValue.length === 0)) {
    //             validProperties = false;
    //             if (!(property in propertiesObject)) {
    //               console.error(`Invalid property ${property} for copy of component of type ${targetClass.componentType}`)
    //             } else {
    //               console.error(`Cannot overwrite property ${property} when copying component of type ${targetClass.componentType}`)
    //             }
    //             break;
    //           }
    //         }
    //       }
    //     }

    //     return { newValues: { validPropertiesSpecified: validProperties } }
    //   },
    // };

    stateVariableDefinitions.readyToExpand = {
      stateVariablesDeterminingDependencies: [
        "targetComponent",
      ],
      returnDependencies({ stateValues, componentInfoObjects }) {

        let dependencies = {
          targetComponent: {
            dependencyType: "stateVariable",
            variableName: "targetComponent"
          },
          needsReplacementsUpdatedWhenStale: {
            dependencyType: "stateVariable",
            variableName: "needsReplacementsUpdatedWhenStale",
          },
          replacementSources: {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          },
          propName: {
            dependencyType: "stateVariable",
            variableName: "propName",
          },
        };
        if (stateValues.targetComponent && componentInfoObjects.isStandardComposite(stateValues.targetComponent.componentType)) {
          dependencies.targetReadyToExpand = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetComponent.componentName,
            variableName: "readyToExpand",
          }
        }
        return dependencies;

      },
      definition: function ({ dependencyValues }) {

        let readyToExpand = true;
        if (dependencyValues.targetReadyToExpand !== undefined) {
          readyToExpand = dependencyValues.targetReadyToExpand;
        }

        return { newValues: { readyToExpand } };
      },
    };


    stateVariableDefinitions.allTargetRecursiveReplacementIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "propName", "componentIndex", "propIndex"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        if (stateValues.propName || stateValues.targetComponent === null
          || !componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: stateValues.targetComponent.componentType,
            baseComponentType: "_composite"
          })
        ) {
          return {};
        }

        return {
          replacementIdentities: {
            dependencyType: "replacement",
            compositeName: stateValues.targetComponent.componentName,
            recursive: true,
          }
        }
      },
      definition({ dependencyValues }) {
        return {
          newValues: {
            allTargetRecursiveReplacementIdentities: dependencyValues.replacementIdentities
          }
        };
      }
    }

    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "propName", "allTargetRecursiveReplacementIdentities"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {
          targetComponent: {
            dependencyType: "stateVariable",
            variableName: "targetComponent"
          },
          targetInactive: {
            dependencyType: "stateVariable",
            variableName: "targetInactive"
          },
          replacementSources: {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          },
        }

        if (stateValues.targetComponent !== null) {

          if (stateValues.propName) {
            // if we have a propName, then we just need the array size state
            // variable (and inactive target variable), 
            // as we need to update only if a component changes
            // or the size of the corresponding array changes.
            // (The actual values of the prop state variables will
            // be updated directly through dependencies)
            // Also include identities (and inactive target variable)
            // without filtering by componentIndex,
            // as components other than the one at that index could change
            // the identity of the component at the relevant index


            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: stateValues.targetComponent.componentType,
              baseComponentType: "_composite"
            })) {
              if (stateValues.componentIndex === null) {
                dependencies.replacementArraySizes = {
                  dependencyType: "replacement",
                  compositeName: stateValues.targetComponent.componentName,
                  recursive: true,
                  variableNames: [
                    "__array_size_" + stateValues.propName,
                    "isInactiveCompositeReplacement"
                  ],
                  variablesOptional: true,
                  caseInsensitiveVariableMatch: true,
                }
              } else {
                dependencies.selectedReplacementArraySize = {
                  dependencyType: "replacement",
                  compositeName: stateValues.targetComponent.componentName,
                  recursive: true,
                  componentIndex: stateValues.componentIndex,
                  variableNames: ["__array_size_" + stateValues.propName],
                  variablesOptional: true,
                  caseInsensitiveVariableMatch: true,
                }
                dependencies.allReplacementIdentities = {
                  dependencyType: "replacement",
                  compositeName: stateValues.targetComponent.componentName,
                  recursive: true,
                  variableNames: ["isInactiveCompositeReplacement"],
                }
              }

            } else if (stateValues.componentIndex === null || stateValues.componentIndex === 1) {
              dependencies.targetArraySize = {
                dependencyType: "stateVariable",
                componentName: stateValues.targetComponent.componentName,
                variableName: "__array_size_" + stateValues.propName,
                variablesOptional: true,
                caseInsensitiveVariableMatch: true,
              }
            }

          } else {
            // no propName

            if (stateValues.allTargetRecursiveReplacementIdentities) {
              // have composite

              // always include all replacement identities with target inactive variables
              // (as changes to any of these could change which is at componentIndex)
              dependencies.allTargetRecursiveReplacementIdentities = {
                dependencyType: "replacement",
                compositeName: stateValues.targetComponent.componentName,
                recursive: true,
                variableNames: ["isInactiveCompositeReplacement"],
              }

              // if no component index, include all descendants of all replacements
              if (stateValues.componentIndex === null) {
                for (let replacementIdentity of stateValues.allTargetRecursiveReplacementIdentities) {
                  dependencies[replacementIdentity.componentName] = {
                    dependencyType: "descendant",
                    ancestorName: replacementIdentity.componentName,
                    componentTypes: ["_base"],
                    useReplacementsForComposites: false,
                    includeNonActiveChildren: false,
                    recurseToMatchedChildren: true,
                  }
                }
              } else {
                // if component index,
                // include all descendants of the replacement at componentIndex
                let replacementIdentity = stateValues.allTargetRecursiveReplacementIdentities[
                  stateValues.componentIndex - 1];
                if (replacementIdentity) {
                  dependencies[replacementIdentity.componentName] = {
                    dependencyType: "descendant",
                    ancestorName: replacementIdentity.componentName,
                    componentTypes: ["_base"],
                    useReplacementsForComposites: false,
                    includeNonActiveChildren: false,
                    recurseToMatchedChildren: true,
                  }
                }
              }
            } else if (stateValues.componentIndex === null || stateValues.componentIndex === 1) {
              dependencies.targetDescendantIdentity = {
                dependencyType: "descendant",
                ancestorName: stateValues.targetComponent.componentName,
                componentTypes: ["_base"],
                useReplacementsForComposites: false,
                includeNonActiveChildren: false,
                recurseToMatchedChildren: true,
              }
            }

          }
        }

        return dependencies;
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale() {
        return { updateReplacements: true }
      },
      definition: () => ({ newValues: { needsReplacementsUpdatedWhenStale: true } })
    }


    return stateVariableDefinitions;

  }

  get allPotentialRendererTypes() {


    // TODO: do we need this since allPotentialRendererTypes of base component
    // should get any possible replacement renderer types?

    let allPotentialRendererTypes = [];

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

  componentNameToPreserializedName(serializedComponents, componentTypesTakingComponentNames) {

    for (let serializedComponent of serializedComponents) {
      let componentName = serializedComponent.componentName;
      if (componentName !== undefined) {
        serializedComponent.componentName = this.componentName + componentName;
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


  static createSerializedReplacements({ component, components, workspace, componentInfoObjects }) {

    // console.log(`create serialized replacements of ${component.componentName}`)

    // console.log(component.stateValues.targetComponent);
    // console.log(component.stateValues.propName);
    // console.log(component.stateValues.replacementSources)


    // if (component.state.contentIDChild !== undefined) {
    //   if (!component.state.serializedStateForContentId) {
    //     return { replacements: [] };
    //   }
    // }

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;


    let assignNames = component.doenetAttributes.assignNames;

    if (component.stateValues.sourceIndex !== null) {
      let replacements = [{
        componentType: "number",
        state: { value: component.stateValues.sourceIndex, fixed: true },
      }];

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        componentInfoObjects,
      });

      return { replacements: processResult.serializedComponents };
    }


    if (!component.stateValues.targetComponent || !component.stateValues.replacementSources) {
      return { replacements: [] };
    }

    // if creating copy from a prop
    // manually create the serialized state
    if (component.stateValues.propName) {
      // let componentOrReplacementNames = component.stateValues.componentNamesForProp;

      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsed = [];

      let results = replacementFromProp({
        component, components,
        replacementSources: component.stateValues.replacementSources,
        uniqueIdentifiersUsed
      });

      workspace.propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        serializedComponents: results.serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        componentInfoObjects,
      });

      return { replacements: processResult.serializedComponents };

    }

    // TODO: check if inactive?

    // if creating copy directly from the target component,
    // create a serialized copy of the entire component

    let serializedReplacements = [];

    for (let replacementIdentity of component.stateValues.replacementSources) {
      let replacementSourceComponent = components[replacementIdentity.componentName];
      if (!replacementSourceComponent.stateValues.isInactiveCompositeReplacement) {
        serializedReplacements.push(replacementSourceComponent.serialize({ forCopy: true }));
      }

    }

    // console.log("targetComponent");
    // console.log(component.state.targetComponent);
    // console.log("serializedReplacements");
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)));

    if (!workspace.uniqueIdentifiersUsed) {
      workspace.uniqueIdentifiersUsed = []
    }

    serializedReplacements = postProcessCopy({
      serializedComponents: serializedReplacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
    })

    let processResult = serializeFunctions.processAssignNames({
      assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };

  }


  static calculateReplacementChanges({ component, componentChanges, components,
    workspace,
    componentInfoObjects
  }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    if (component.stateValues.sourceIndex !== null) {
      return [];
    }

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    let replacementChanges = [];

    let assignNames = component.doenetAttributes.assignNames;

    if (!component.stateValues.targetComponent || !component.stateValues.replacementSources) {
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


    if (component.stateValues.propName) {

      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = [];

      let results = replacementFromProp({
        component, components,
        replacementSources: component.stateValues.replacementSources,
        uniqueIdentifiersUsed
      });

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        serializedComponents: results.serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
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
            assignNamesOffset: ind,
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
          assignNamesOffset: nOldReplacements,
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
      workspace.uniqueIdentifiersUsed = uniqueIdentifiersUsed;

      // console.log(`replacementChanges for ${component.componentName}`)
      // console.log(replacementChanges);
      return replacementChanges;
    }


    // copy not determined by a prop

    // compare replacementSources with replacements


    // TODO: could make this more efficient by withholding replacements
    // whose sources is an inactive composite replacement
    // (at least if the replacement has already been created)
    // but that would require withholding non-consecutive replacements
    // (also should we check for reordering of replacements?)
    let replacementSourceComponents = component.stateValues.replacementSources.map(
      x => components[x.componentName]
    )

    let activeReplacementSourceComponents = replacementSourceComponents.filter(
      x => !x.stateValues.isInactiveCompositeReplacement
    )

    let nNewReplacements = activeReplacementSourceComponents.length;
    let nOldReplacements = component.replacements.length;


    // TODO: understand uniqueIdentifiersUsed
    // Could be a problem that we are just including new replacements
    // let uniqueIdentifiersUsed= [];

    for (let ind = 0; ind < Math.min(nNewReplacements, nOldReplacements); ind++) {
      let currentReplacement = component.replacements[ind];
      let replacementSourceComponent = activeReplacementSourceComponents[ind];

      if (currentReplacement.shadows.componentName !== replacementSourceComponent.componentName) {
        let newReplacements = [replacementSourceComponent.serialize({ forCopy: true })];

        newReplacements = postProcessCopy({
          serializedComponents: newReplacements,
          componentName: component.componentName,
          uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
        })

        let processResult = serializeFunctions.processAssignNames({
          assignNames,
          serializedComponents: newReplacements,
          parentName: component.componentName,
          parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
          componentInfoObjects,
          indOffset: ind
        });

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: ind,
          numberReplacementsToReplace: 1,
          serializedReplacements: processResult.serializedComponents,
          assignNamesOffset: ind
        };
        replacementChanges.push(replacementInstruction);
      }
    }

    if (nNewReplacements > nOldReplacements) {

      let serializedReplacements = [];

      for (let replacementSourceComponent of activeReplacementSourceComponents.slice(nOldReplacements)) {
        serializedReplacements.push(replacementSourceComponent.serialize({ forCopy: true }));
      }

      serializedReplacements = postProcessCopy({
        serializedComponents: serializedReplacements,
        componentName: component.componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
      })

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        serializedComponents: serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        componentInfoObjects,
        indOffset: nOldReplacements
      });

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: nOldReplacements,
        numberReplacementsToReplace: 0,
        serializedReplacements: processResult.serializedComponents,
        assignNamesOffset: nOldReplacements,
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


    // console.log(`replacementChanges for ${component.componentName}`)
    // console.log(replacementChanges)

    return replacementChanges;

  }

}

export function replacementFromProp({ component, components,
  replacementSources,
  // numReplacementsSoFar = 0,
  uniqueIdentifiersUsed }) {


  // console.log(`replacement from prop for ${component.componentName}`)
  // console.log(replacementSources)

  let serializedReplacements = [];
  let propVariablesCopiedByReplacement = [];

  if (replacementSources === null) {
    return { serializedReplacements, propVariablesCopiedByReplacement };
  }

  let replacementInd = -1; //numReplacementsSoFar - 1;

  for (let replacmentObj of replacementSources) {
    let target = components[replacmentObj.componentName];

    let varName = Object.keys(replacmentObj.stateValues)[0];

    if (varName === undefined) {
      console.warn(`Could not find prop ${component.stateValues.propName} on a component of type ${replacmentObj.componentType}`)
      return {
        serializedReplacements: [],
        propVariablesCopiedByReplacement: [],
      }
    }

    let stateVarObj = target.state[varName];

    if (stateVarObj.isArray || stateVarObj.isArrayEntry) {

      let arrayStateVarObj, unflattenedArrayKeys;
      if (stateVarObj.isArray) {
        arrayStateVarObj = stateVarObj;
        unflattenedArrayKeys = stateVarObj.getAllArrayKeys(stateVarObj.arraySize, false);
      } else {
        arrayStateVarObj = target.state[stateVarObj.arrayStateVariable];
        unflattenedArrayKeys = stateVarObj.unflattenedArrayKeys;
      }

      if (!arrayStateVarObj.componentType) {
        return {
          serializedReplacements: [],
          propVariablesCopiedByReplacement: [],
        }
      }

      let wrappingComponents = stateVarObj.wrappingComponents;
      let numWrappingComponents = wrappingComponents.length;

      let numReplacementsForTarget;

      if (stateVarObj.isArray) {
        numReplacementsForTarget = stateVarObj.arraySize.
          slice(0, stateVarObj.arraySize.length - numWrappingComponents)
          .reduce((a, c) => a * c, 1);
      } else {

        if (stateVarObj.arrayKeys.length === 0) {
          // have an undefined array entry
          // either show nothing or a blank entry
          if (component.stateValues.includeUndefinedObjects) {
            numReplacementsForTarget = 1;
          } else {
            numReplacementsForTarget = 0;
          }

        } else if (numWrappingComponents === 0) {
          // with no wrapping components, will just output
          // one component for each component of the array
          numReplacementsForTarget = stateVarObj.arrayKeys.length;
        } else if (numWrappingComponents >= stateVarObj.nDimensions) {
          // if had an outer wrapping component, would just have a single component
          numReplacementsForTarget = 1;
        } else if (numWrappingComponents === stateVarObj.nDimensions - 1) {
          // if the second from outer dimension is wrapped
          // then just count the number of entries in the original array
          numReplacementsForTarget = unflattenedArrayKeys.length;
        } else {
          // if have at least two unwrapped dimensions,
          // flatten the array so that the entries counted are the outermost wrapped
          // Note: we need to create a 3D array entry to access this,
          // so this code is so far untested
          let nLevelsToFlatten = stateVarObj.nDimensions - numWrappingComponents - 1;
          numReplacementsForTarget = flattenLevels(unflattenedArrayKeys, nLevelsToFlatten).length;
        }
      }


      if (numWrappingComponents === 0) {
        // return flattened entries

        let flattenedArrayKeys = flattenDeep(unflattenedArrayKeys);

        for (let ind = 0; ind < numReplacementsForTarget; ind++) {
          replacementInd++;
          let propVariablesCopied = propVariablesCopiedByReplacement[replacementInd] = [];

          let componentType = arrayStateVarObj.componentType;
          if (Array.isArray(componentType)) {
            // TODO: multidimensional arrays?
            if (stateVarObj.isArrayEntry) {
              componentType = componentType[arrayStateVarObj.keyToIndex(stateVarObj.arrayKeys[ind])];
            } else {
              componentType = componentType[ind];
            }
          }

          componentType = componentType.toLowerCase();

          let arrayKey = flattenedArrayKeys[ind];

          if (arrayKey) {
            let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

            propVariablesCopied.push(propVariable);

            if (false) {//propVariableObj.containsComponentNamesToCopy) {

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
              let uniqueIdentifierBase = replacmentObj.componentName + "|shadow|" + propVariable;
              let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

              serializedReplacements.push({
                componentType: componentType,
                downstreamDependencies: {
                  [replacmentObj.componentName]: [{
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

              if (false) {//propVariableObj.containsComponentNamesToCopy) {

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
                  let uniqueIdentifierBase = arrayStateVarObj.componentType.toLowerCase() + "|empty";
                  let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                  pieces.push({
                    componentType: arrayStateVarObj.componentType.toLowerCase(),
                    uniqueIdentifier,
                  })
                  propVariablesCopiedForThisPiece.push(null)

                }

              } else {

                let uniqueIdentifierBase = replacmentObj.componentName + "|shadow|" + propVariable;
                let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

                let componentType = arrayStateVarObj.componentType;
                if (Array.isArray(componentType)) {
                  // TODO: multidimensional arrays?
                  componentType = componentType[arrayStateVarObj.keyToIndex(arrayKey)];
                }

                componentType = componentType.toLowerCase();

                pieces.push({
                  componentType,
                  downstreamDependencies: {
                    [replacmentObj.componentName]: [{
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
                componentType: wrapCs[ind].toLowerCase(),
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
            [replacmentObj.componentName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: varName,
              ignorePrimaryStateVariable: true,
            }]
          }
        }

        replacementInd += newReplacements.length;

        serializedReplacements.push(...newReplacements);

        if (newReplacements.length < numReplacementsForTarget) {
          // we didn't create enough replacements,
          // which could happen if we have includeUndefinedObjects set

          // just create additional replacements,
          // even though they won't yet refer to the right dependencies

          for (let ind = newReplacements.length; ind < numReplacementsForTarget; ind++) {
            replacementInd++;
            propVariablesCopiedByReplacement[replacementInd] = [];


            let componentType;
            let wrapCs = wrappingComponents[0];
            if (wrapCs && wrapCs.length > 0) {
              componentType = wrapCs[0];
            } else {
              componentType = arrayStateVarObj.componentType;
              if (Array.isArray(componentType)) {
                // TODO: multidimensional arrays?
                if (stateVarObj.isArrayEntry) {
                  componentType = componentType[arrayStateVarObj.keyToIndex(stateVarObj.arrayKeys[ind])];
                } else {
                  componentType = componentType[ind];
                }
              }
              componentType = componentType.toLowerCase();
            }

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

      if (!stateVarObj.componentType) {
        return {
          serializedReplacements: [],
          propVariablesCopiedByReplacement: [],
        }
      }

      replacementInd++;

      let propVariablesCopied = propVariablesCopiedByReplacement[replacementInd] = [];

      propVariablesCopied.push(varName);

      let uniqueIdentifierBase = target.componentName + "|shadow|" + varName;
      let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

      serializedReplacements.push({
        componentType: stateVarObj.componentType.toLowerCase(),
        downstreamDependencies: {
          [target.componentName]: [{
            dependencyType: "referenceShadow",
            compositeName: component.componentName,
            propVariable: varName,
          }]
        },
        uniqueIdentifier,
      })
    }
  }


  // console.log(`serializedReplacements for ${component.componentName}`)
  // console.log(serializedReplacements)

  return { serializedReplacements, propVariablesCopiedByReplacement };

}
