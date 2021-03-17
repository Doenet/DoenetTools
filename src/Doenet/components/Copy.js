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


    stateVariableDefinitions.isPlainMacro = {
      returnDependencies: () => ({
        isPlainMacro: {
          dependencyType: "doenetAttribute",
          attributeName: "isPlainMacro"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { isPlainMacro: dependencyValues.isPlainMacro } }
      }
    }

    stateVariableDefinitions.replacementSourceIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "componentIndex",
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {};

        if (stateValues.targetComponent !== null) {

          if (componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false
          })) {
            dependencies.targets = {
              dependencyType: "replacement",
              compositeName: stateValues.targetComponent.componentName,
              recursive: true,
              componentIndex: stateValues.componentIndex,
            }
          } else if (stateValues.componentIndex === null || stateValues.componentIndex === 1) {
            // if we don't have a composite, componentIndex can only match if it is 1
            dependencies.targets = {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            }
          }


        }
        return dependencies;
      },
      definition({ dependencyValues }) {

        let replacementSourceIdentities = null;
        if (dependencyValues.targets) {
          replacementSourceIdentities = dependencyValues.targets;
          if (!Array.isArray(replacementSourceIdentities)) {
            replacementSourceIdentities = [replacementSourceIdentities];
          }
        }
        return { newValues: { replacementSourceIdentities } };
      },
    }


    stateVariableDefinitions.effectivePropNameBySource = {
      stateVariablesDeterminingDependencies: [
        "replacementSourceIdentities", "propName", "isPlainMacro"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities"
          },
        }

        if (stateValues.replacementSourceIdentities !== null) {

          for (let [ind, source] of stateValues.replacementSourceIdentities.entries()) {

            let thisPropName = stateValues.propName;

            if (stateValues.isPlainMacro) {
              thisPropName = componentInfoObjects.allComponentClasses[source.componentType]
                .variableForPlainMacro
            }

            if (thisPropName) {
              dependencies["propName" + ind] = {
                dependencyType: "value",
                value: thisPropName,
              }
            }

          }

        }

        return dependencies;
      },
      definition({ dependencyValues }) {

        let effectivePropNameBySource = null;

        if (dependencyValues.replacementSourceIdentities !== null) {
          effectivePropNameBySource = [];

          for (let ind in dependencyValues.replacementSourceIdentities) {
            if (dependencyValues["propName" + ind]) {
              effectivePropNameBySource[ind] = dependencyValues["propName" + ind];
            }
          }
        }

        return { newValues: { effectivePropNameBySource } };
      },
    }


    stateVariableDefinitions.replacementSources = {
      stateVariablesDeterminingDependencies: [
        "replacementSourceIdentities", "propName", "propIndex", "isPlainMacro",
        "effectivePropNameBySource"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities"
          },
        }

        if (!stateValues.propName && stateValues.propIndex !== null) {
          throw Error(`You cannot specify a propIndex without specifying a prop.`)
        }


        if (stateValues.replacementSourceIdentities !== null) {

          for (let [ind, source] of stateValues.replacementSourceIdentities.entries()) {

            let thisPropName = stateValues.effectivePropNameBySource[ind];

            let thisTarget;

            if (thisPropName) {
              thisTarget = {
                dependencyType: "stateVariable",
                componentName: source.componentName,
                variableName: thisPropName,
                returnAsComponentObject: true,
                variablesOptional: true,
                propIndex: stateValues.propIndex,
                caseInsensitiveVariableMatch: true,
                publicStateVariablesOnly: true,
                useMappedVariableNames: true,
              }

            } else {
              thisTarget = {
                dependencyType: "componentIdentity",
                componentName: source.componentName
              }
            }

            dependencies["target" + ind] = thisTarget;
          }

        }

        return dependencies;
      },
      definition({ dependencyValues }) {
        let replacementSources = null;

        if (dependencyValues.replacementSourceIdentities !== null) {
          replacementSources = [];

          for (let ind in dependencyValues.replacementSourceIdentities) {
            if (dependencyValues["target" + ind]) {
              replacementSources.push(dependencyValues["target" + ind]);
            }
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
          // propName: {
          //   dependencyType: "stateVariable",
          //   variableName: "propName",
          // },
        };
        if (stateValues.targetComponent && componentInfoObjects.isCompositeComponent({
          componentType: stateValues.targetComponent.componentType,
          includeNonStandard: false
        })) {
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


    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      stateVariablesDeterminingDependencies: [
        "targetComponent",
        "replacementSourceIdentities", "effectivePropNameBySource"
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
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities",
          },
          replacementSources: {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          },
        }

        if (stateValues.effectivePropNameBySource !== null) {

          for (let [ind, propName] of stateValues.effectivePropNameBySource.entries()) {
            if (propName) {

              // if we have a propName, then we just need the array size state variable, 
              // as we need to update only if a component changes
              // or the size of the corresponding array changes.
              // (The actual values of the prop state variables will
              // be updated directly through dependencies)

              let source = stateValues.replacementSourceIdentities[ind];

              dependencies["sourceArraySize" + ind] = {
                dependencyType: "stateVariable",
                componentName: source.componentName,
                variableName: "__array_size_" + propName,
                variablesOptional: true,
                caseInsensitiveVariableMatch: true,
              }
            }


          }
        }

        if (stateValues.targetComponent !== null &&
          componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false
          })
        ) {

          // Include identities of all replacements (and inactive target variable)
          // without filtering by componentIndex,
          // as components other than the one at that index could change
          // the identity of the component at the relevant index

          dependencies.allReplacementIdentities = {
            dependencyType: "replacement",
            compositeName: stateValues.targetComponent.componentName,
            recursive: true,
            variableNames: ["isInactiveCompositeReplacement"],
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

    console.log(`create serialized replacements of ${component.componentName}`)

    // console.log(component.stateValues.targetComponent);
    // console.log(component.stateValues.effectivePropNameBySource);
    // console.log(component.stateValues.replacementSources)


    workspace.numReplacementsBySource = [];
    workspace.propVariablesCopiedBySource = [];
    workspace.sourceNames = [];
    workspace.uniqueIdentifiersUsedBySource = {};

    // if (component.state.contentIDChild !== undefined) {
    //   if (!component.state.serializedStateForContentId) {
    //     return { replacements: [] };
    //   }
    // }

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;


    // if have a sourceIndex, it means we had a prop="_sourceindex"
    // so we just return a number that is the index
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


    let replacements = [];

    let numReplacementsBySource = [];
    let numReplacementsSoFar = 0;

    for (let sourceNum in component.stateValues.replacementSources) {

      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];
      let results = this.createReplacementForSource({
        component,
        sourceNum,
        components,
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
        componentInfoObjects
      });

      workspace.propVariablesCopiedBySource[sourceNum] = results.propVariablesCopiedByReplacement;

      let sourceReplacements = results.serializedReplacements;
      numReplacementsBySource[sourceNum] = sourceReplacements.length;
      numReplacementsSoFar += sourceReplacements.length;
      replacements.push(...sourceReplacements);
    }

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.sourceNames = component.stateValues.replacementSources.map(x => x.componentName)

    return { replacements };

  }

  static createReplacementForSource({
    component,
    sourceNum,
    components,
    numReplacementsSoFar,
    uniqueIdentifiersUsed,
    componentInfoObjects
  }) {

    // console.log(`create replacement for sourceNum ${sourceNum}`)
    // console.log(`propName: ${component.stateValues.effectivePropNameBySource[sourceNum]}`)

    let replacementSource = component.stateValues.replacementSources[sourceNum];
    let replacementSourceComponent = components[replacementSource.componentName];
    if (replacementSourceComponent.stateValues.isInactiveCompositeReplacement) {
      return { serializedReplacements: [] }
    }

    // if creating copy from a prop
    // manually create the serialized component
    if (component.stateValues.effectivePropNameBySource[sourceNum]) {

      let results = replacementFromProp({
        component, components,
        replacementSource,
        propName: component.stateValues.effectivePropNameBySource[sourceNum],
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
      });

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: results.serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        indOffset: numReplacementsSoFar,
        componentInfoObjects,
      });

      return {
        serializedReplacements: processResult.serializedComponents,
        propVariablesCopiedByReplacement: results.propVariablesCopiedByReplacement
      };

    }

    // if creating copy directly from the target component,
    // create a serialized copy of the entire component

    let serializedReplacements = [
      replacementSourceComponent.serialize({ forCopy: true })
    ];

    // console.log("targetComponent");
    // console.log(component.state.targetComponent);
    // console.log("serializedReplacements");
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)));


    serializedReplacements = postProcessCopy({
      serializedComponents: serializedReplacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed
    })

    let processResult = serializeFunctions.processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      indOffset: numReplacementsSoFar,
      componentInfoObjects,
    });

    return { serializedReplacements: processResult.serializedComponents };
  }


  static calculateReplacementChanges({ component, componentChanges, components,
    workspace,
    componentInfoObjects
  }) {

    console.log("Calculating replacement changes for " + component.componentName);

    // for prop="_sourceIndex", the replacements never change
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
      workspace.sourceNames = [];
      workspace.numReplacementsBySource = [];
      workspace.propVariablesCopiedBySource = [];
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


    // if replacementSources is a different length than replacementSourceIdentities
    // it means that haven't updated dependencies of replacementSources yet
    // Don't make changes yet.
    if (component.stateValues.replacementSourceIdentities.length
      !== component.stateValues.replacementSources.length
    ) {
      return [];
    }


    if (component.replacementsToWithhold > 0) {
      let replacementInstruction = {
        changeType: "changeReplacementsToWithhold",
        replacementsToWithhold: 0,
      };
      replacementChanges.push(replacementInstruction);
    }


    let numReplacementsSoFar = 0;

    let numReplacementsBySource = [];
    let propVariablesCopiedBySource = [];

    let maxSourceLength = Math.max(component.stateValues.replacementSourceIdentities.length, workspace.numReplacementsBySource.length);

    let recreateRemaining = false;

    for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
      let replacementSource = component.stateValues.replacementSources[sourceNum];
      if (replacementSource === undefined) {
        if (workspace.numReplacementsBySource[sourceNum] > 0) {

          if (!recreateRemaining) {
            // since deleting replacement will shift the remaining replacements
            // and change resulting names,
            // delete all remaining and mark to be recreated

            let numberReplacementsLeft = workspace.numReplacementsBySource.slice(sourceNum)
              .reduce((a, c) => a + c, 0);

            if (numberReplacementsLeft > 0) {
              let replacementInstruction = {
                changeType: "delete",
                changeTopLevelReplacements: true,
                firstReplacementInd: numReplacementsSoFar,
                numberReplacementsToDelete: numberReplacementsLeft,
              }

              replacementChanges.push(replacementInstruction);
            }

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsBySource.slice(sourceNum)
              .forEach((v, i) => workspace.numReplacementsBySource[i] = 0)

          }

          workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];

        }

        numReplacementsBySource[sourceNum] = 0;
        propVariablesCopiedBySource.push([]);

        continue;
      }

      let prevSourceName = workspace.sourceNames[sourceNum];

      // check if replacementSource has changed
      if (prevSourceName === undefined || replacementSource.componentName !== prevSourceName
        || recreateRemaining
      ) {

        let prevNumReplacements = 0;
        if (prevSourceName !== undefined) {
          prevNumReplacements = workspace.numReplacementsBySource[sourceNum];
        }

        let numReplacementsToDelete = prevNumReplacements;
        if (recreateRemaining) {
          // already deleted old replacements
          numReplacementsToDelete = 0;
        }

        let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];
        let results = this.recreateReplacements({
          component,
          sourceNum,
          numReplacementsSoFar,
          numReplacementsToDelete,
          components,
          uniqueIdentifiersUsed,
          componentInfoObjects,
        });

        numReplacementsSoFar += results.numReplacements;

        numReplacementsBySource[sourceNum] = results.numReplacements;

        propVariablesCopiedBySource[sourceNum] = results.propVariablesCopiedByReplacement;

        let replacementInstruction = results.replacementInstruction;

        if (!recreateRemaining) {
          if (results.numReplacements !== prevNumReplacements) {
            // we changed the number of replacements which shifts remaining ones
            // since names won't match, we need to delete 
            // all the remaining replacements and recreate them

            let numberReplacementsLeft = workspace.numReplacementsBySource.slice(sourceNum)
              .reduce((a, c) => a + c, 0);

            replacementInstruction.numberReplacementsToReplace = numberReplacementsLeft;

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsBySource.slice(sourceNum)
              .forEach((v, i) => workspace.numReplacementsBySource[i] = 0)

          }
        }

        replacementChanges.push(replacementInstruction);

        continue;

      }


      if (!component.stateValues.effectivePropNameBySource[sourceNum]) {
        let replacementSourceComponent = components[replacementSource.componentName];
        if (replacementSourceComponent.stateValues.isInactiveCompositeReplacement) {
          if (workspace.numReplacementsBySource[sourceNum] === 0) {
            // no changes
            numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
            numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
            continue;
          }
        } else if (workspace.numReplacementsBySource[sourceNum] > 0) {
          // if previously had replacements and target still isn't inactive
          // then don't check for changes if don't have a propName
          numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
          numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
          continue;
        }
      }


      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];

      let results = this.createReplacementForSource({
        component,
        sourceNum,
        components,
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
        componentInfoObjects,
      });

      let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

      let newSerializedReplacements = results.serializedReplacements;

      let nNewReplacements = newSerializedReplacements.length;
      let nOldReplacements = workspace.numReplacementsBySource[sourceNum];

      if (nNewReplacements !== nOldReplacements) {
        // changing the number of replacements will shift the remaining replacements
        // and change resulting names,
        // delete all remaining and mark to be recreated

        let numberReplacementsLeft = workspace.numReplacementsBySource.slice(sourceNum)
          .reduce((a, c) => a + c, 0);

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: numReplacementsSoFar,
          numberReplacementsToReplace: numberReplacementsLeft,
          serializedReplacements: newSerializedReplacements,
          assignNamesOffset: numReplacementsSoFar,
        };

        replacementChanges.push(replacementInstruction);

        recreateRemaining = true;

        // since deleted remaining, change in workspace
        // so that don't attempt to delete again
        workspace.numReplacementsBySource.slice(sourceNum)
          .forEach((v, i) => workspace.numReplacementsBySource[i] = 0)


      } else {

        for (let ind = 0; ind < nNewReplacements; ind++) {
          if (propVariablesCopiedByReplacement[ind].length !== workspace.propVariablesCopiedBySource[sourceNum][ind].length ||
            workspace.propVariablesCopiedBySource[sourceNum][ind].some((v, i) => v !== propVariablesCopiedByReplacement[ind][i]) ||
            component.replacements[ind].componentType !== newSerializedReplacements[ind].componentType
          ) {

            let replacementInstruction = {
              changeType: "add",
              changeTopLevelReplacements: true,
              firstReplacementInd: numReplacementsSoFar + ind,
              numberReplacementsToReplace: 1,
              serializedReplacements: [newSerializedReplacements[ind]],
              assignNamesOffset: numReplacementsSoFar + ind,
            };
            replacementChanges.push(replacementInstruction);
          }
        }


      }

      numReplacementsSoFar += nNewReplacements;

      numReplacementsBySource[sourceNum] = nNewReplacements;

      propVariablesCopiedBySource[sourceNum] = propVariablesCopiedByReplacement;

    }


    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.sourceNames = component.stateValues.replacementSources.map(x => x.componentName)
    workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;

    // console.log("replacementChanges");
    // console.log(replacementChanges);


    return replacementChanges;


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


  static recreateReplacements({ component, sourceNum, numReplacementsSoFar,
    numReplacementsToDelete,
    uniqueIdentifiersUsed, components, componentInfoObjects
  }) {

    let results = this.createReplacementForSource({
      component, sourceNum, numReplacementsSoFar, components, uniqueIdentifiersUsed,
      componentInfoObjects
    });

    let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

    let newSerializedChildren = results.serializedReplacements

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: numReplacementsToDelete,
      serializedReplacements: newSerializedChildren,
      assignNamesOffset: numReplacementsSoFar,
    };

    return {
      numReplacements: newSerializedChildren.length,
      propVariablesCopiedByReplacement,
      replacementInstruction
    }
  }

}

export function replacementFromProp({ component, components,
  replacementSource,
  propName,
  // numReplacementsSoFar,
  uniqueIdentifiersUsed }) {


  // console.log(`replacement from prop for ${component.componentName}`)
  // console.log(replacementSources)

  let serializedReplacements = [];
  let propVariablesCopiedByReplacement = [];

  // if (replacementSource === null) {
  //   return { serializedReplacements, propVariablesCopiedByReplacement };
  // }

  let replacementInd = -1; //numReplacementsSoFar - 1;

  let target = components[replacementSource.componentName];

  let varName = Object.keys(replacementSource.stateValues)[0];

  if (varName === undefined) {
    console.warn(`Could not find prop ${propName} on a component of type ${replacementSource.componentType}`)
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
            let uniqueIdentifierBase = replacementSource.componentName + "|shadow|" + propVariable;
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            serializedReplacements.push({
              componentType: componentType,
              downstreamDependencies: {
                [replacementSource.componentName]: [{
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

              let uniqueIdentifierBase = replacementSource.componentName + "|shadow|" + propVariable;
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
                  [replacementSource.componentName]: [{
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
            let wrapCT = typeof wrapCs[ind] === "object" ? wrapCs[ind].componentType : wrapCs[ind];
            let uniqueIdentifierBase = wrapCT + "|wrapper";
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            pieces = [{
              componentType: wrapCT.toLowerCase(),
              children: pieces,
              uniqueIdentifier,
            }]
            if (typeof wrapCs[ind] === "object" && wrapCs[ind].doenetAttributes) {
              pieces[0].doenetAttributes = Object.assign({}, wrapCs[ind].doenetAttributes);

            }
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
          [replacementSource.componentName]: [{
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
          let wrapDoenetAttributes;
          if (wrapCs && wrapCs.length > 0) {
            if (typeof wrapCs[0] === "object") {
              componentType = wrapCs[0].componentType;
              wrapDoenetAttributes = Object.assign({}, wrapCs[0].doenetAttributes);
            } else {
              componentType = wrapCs[0];
            }
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

          let newReplacement = {
            componentType,
            uniqueIdentifier,
          }
          if (wrapDoenetAttributes) {
            newReplacement.doenetAttributes = wrapDoenetAttributes;
          }
          serializedReplacements.push(newReplacement)
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


  // console.log(`serializedReplacements for ${component.componentName}`)
  // console.log(serializedReplacements)

  return { serializedReplacements, propVariablesCopiedByReplacement };

}
