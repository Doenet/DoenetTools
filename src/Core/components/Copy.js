import CompositeComponent from './abstract/CompositeComponent';
import * as serializeFunctions from '../utils/serializedStateProcessing';
import { convertAttributesForComponentType, postProcessCopy } from '../utils/copy';
import { flattenDeep, flattenLevels } from '../utils/array';
import { getUniqueIdentifierFromBase } from '../utils/naming';
import { deepClone } from '../utils/deepFunctions';


export default class Copy extends CompositeComponent {
  static componentType = "copy";

  static assignNamesToReplacements = true;

  static acceptTname = true;
  static acceptAnyAttribute = true;

  static get stateVariablesShadowedForReference() { return ["targetComponent", "propName"] };

  static stateVariableToEvaluateAfterReplacements = "needsReplacementsUpdatedWhenStale";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    // delete off attributes from base component that should apply to replacements instead
    // (using acceptAnyAttribute)
    delete attributes.disabled;
    delete attributes.modifyIndirectly;
    delete attributes.fixed;
    delete attributes.styleNumber;
    delete attributes.isResponse;

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }
    attributes.prop = {
      createPrimitiveOfType: "string",
    };
    attributes.obtainPropFromComposite = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "obtainPropFromComposite",
      defaultValue: false,
      public: true,
    };
    attributes.componentType = {
      createPrimitiveOfType: "string",
    };
    attributes.nComponents = {
      createPrimitiveOfType: "number",
    };
    attributes.componentIndex = {
      createComponentOfType: "number",
      createStateVariable: "componentIndex",
      defaultValue: null,
      public: true,
    };
    attributes.propIndex = {
      createComponentOfType: "number",
      createStateVariable: "propIndex",
      defaultValue: null,
      public: true,
    };
    attributes.uri = {
      createPrimitiveOfType: "string",
      createStateVariable: "uri",
      defaultValue: null,
      public: true,
    };
    attributes.targetAttributesToIgnore = {
      createComponentOfType: "textList",
      createStateVariable: "targetAttributesToIgnore",
      defaultValue: ["hide"],
      public: true,
    };
    attributes.targetAttributesToAlwaysIgnore = {
      createComponentOfType: "textList",
      createStateVariable: "targetAttributesToAlwaysIgnore",
      defaultValue: ["isResponse"],
      public: true,
    };
    attributes.link = {
      createPrimitiveOfType: "boolean",
    };

    // Note: only implemented with no wrapping components
    attributes.removeEmptyArrayEntries = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "removeEmptyArrayEntries",
      defaultValue: false,
    }
    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "externalContents",
      componentTypes: ["externalContent"]
    }]

  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

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
      stateVariablesDeterminingDependencies: ["tName"],
      determineDependenciesImmediately: true,
      returnDependencies: function ({ stateValues, sharedParameters }) {

        let sourceNameMappings = sharedParameters.sourceNameMappings;
        if (!sourceNameMappings) {
          return {};
        }

        let theMapping = sourceNameMappings[stateValues.tName];
        if (!theMapping) {
          return {};
        }
        return {
          targetSourcesName: {
            dependencyType: "value",
            value: theMapping.name,
          },
          sourcesChildNumber: {
            dependencyType: "value",
            value: theMapping.childNumber
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
          makeEssential: { targetSourcesName: true, sourcesChildNumber: true },
        }
      },
    };

    stateVariableDefinitions.targetSources = {
      stateVariablesDeterminingDependencies: ["targetSourcesName"],
      determineDependenciesImmediately: true,
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
      stateVariablesDeterminingDependencies: ["tName"],
      determineDependenciesImmediately: true,
      returnDependencies: function ({ stateValues, sharedParameters }) {

        let sourceIndexMappings = sharedParameters.sourceIndexMappings;
        if (!sourceIndexMappings) {
          return {};
        }

        let theMapping = sourceIndexMappings[stateValues.tName];
        if (theMapping === undefined) {
          return {};
        }

        return {
          sourceIndex: {
            dependencyType: "value",
            value: theMapping,
          },
        }

      },
      definition: function ({ dependencyValues }) {
        let sourceIndex = dependencyValues.sourceIndex;
        if (sourceIndex === undefined) {
          sourceIndex = null;
        }
        return {
          newValues: { sourceIndex },
          makeEssential: { sourceIndex: true },
        }
      },
    };


    stateVariableDefinitions.targetComponent = {
      stateVariablesDeterminingDependencies: ["targetSources", "sourceIndex"],
      determineDependenciesImmediately: true,
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
      additionalStateVariablesDefined: ["doenetId"],
      returnDependencies: () => ({
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri",
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.uri ||
          dependencyValues.uri.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            newValues: { contentId: null, doenetId: null }
          }
        }

        let contentId = null, doenetId = null;

        let result = dependencyValues.uri.match(/[:&]contentid=([^&]+)/i);
        if (result) {
          contentId = result[1];
        }
        result = dependencyValues.uri.match(/[:&]doenetid=([^&]+)/i);
        if (result) {
          doenetId = result[1];
        }

        return { newValues: { contentId, doenetId } };
      },
    };


    stateVariableDefinitions.serializedComponentsForContentId = {
      returnDependencies: () => ({
        contentId: {
          dependencyType: "stateVariable",
          variableName: "contentId"
        },
        externalContentChild: {
          dependencyType: "child",
          childGroups: ["externalContents"],
          variableNames: ["serializedChildren", "newNamespace"],
        }
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.contentId) {
          return {
            newValues: { serializedComponentsForContentId: null }
          }
        }
        let externalContentChild = dependencyValues.externalContentChild[0];
        if (!externalContentChild) {
          return {
            newValues: { serializedComponentsForContentId: null }
          }
        }
        let childrenOfContent = externalContentChild.stateValues.serializedChildren;
        let serializedComponentsForContentId = {
          componentType: "externalContent",
          state: { rendered: true },
          children: childrenOfContent,
          originalName: externalContentChild.componentName,
        }
        if (externalContentChild.stateValues.newNamespace) {
          serializedComponentsForContentId.attributes = { newNamespace: { primitive: true } }
        }
        return {
          newValues: {
            serializedComponentsForContentId
          }
        }
      }
    };

    stateVariableDefinitions.propName = {
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop"
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

    stateVariableDefinitions.linkAttrForDetermineDeps = {
      returnDependencies: () => ({
        linkAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "link"
        },
      }),
      definition({ dependencyValues }) {
        let linkAttrForDetermineDeps;
        if (dependencyValues.linkAttr === null) {
          linkAttrForDetermineDeps = true;
        } else {
          linkAttrForDetermineDeps = dependencyValues.linkAttr;
        }

        return { newValues: { linkAttrForDetermineDeps } };
      }
    }


    stateVariableDefinitions.replacementSourceIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "componentIndex", "propName",
        "obtainPropFromComposite", "linkAttrForDetermineDeps"
      ],
      additionalStateVariablesDefined: ["addLevelToAssignNames"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {};

        let addLevelToAssignNames = false;
        let useReplacements = false;

        if (stateValues.targetComponent !== null) {

          if (
            componentInfoObjects.isCompositeComponent({
              componentType: stateValues.targetComponent.componentType,
              includeNonStandard: false
            })
            && !(stateValues.propName && stateValues.obtainPropFromComposite)
          ) {

            if (stateValues.linkAttrForDetermineDeps) {

              useReplacements = true;
              dependencies.targets = {
                dependencyType: "replacement",
                compositeName: stateValues.targetComponent.componentName,
                recursive: true,
                componentIndex: stateValues.componentIndex,
              }
            } else {
              addLevelToAssignNames = true;
            }
          }


          if (!useReplacements && (stateValues.componentIndex === null || stateValues.componentIndex === 1)) {
            // if we don't have a composite, componentIndex can only match if it is 1
            dependencies.targets = {
              dependencyType: "stateVariable",
              variableName: "targetComponent"
            }
          }
        }

        dependencies.addLevelToAssignNames = {
          dependencyType: "value",
          value: addLevelToAssignNames
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
        return {
          newValues: {
            replacementSourceIdentities,
            addLevelToAssignNames: dependencyValues.addLevelToAssignNames
          }
        };
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

        return {
          newValues: {
            effectivePropNameBySource
          }
        };
      },
    }


    // only reason for replacementSources state variable
    // is to create any array entry state variables from prop
    // when resolve determineDependencies
    stateVariableDefinitions.replacementSources = {
      stateVariablesDeterminingDependencies: [
        "replacementSourceIdentities", "propName", "propIndex", "isPlainMacro",
        "effectivePropNameBySource"
      ],
      returnDependencies: function ({ stateValues }) {

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

    stateVariableDefinitions.nComponentsSpecified = {
      returnDependencies: () => ({
        nComponentsAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "nComponents"
        },
        typeAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "componentType"
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let nComponentsSpecified;

        if (dependencyValues.typeAttr) {
          if (!(dependencyValues.typeAttr in componentInfoObjects.allComponentClasses)) {
            throw Error(`Invalid componentType ${dependencyValues.typeAttr} of copy.`)
          }
          if (dependencyValues.nComponentsAttr !== null) {
            nComponentsSpecified = dependencyValues.nComponentsAttr
          } else {
            nComponentsSpecified = 1;
          }
        } else if (dependencyValues.nComponentsAttr !== null) {
          throw Error(`You must specify a componentType when specifying nComponents for a copy.`)
        } else {
          nComponentsSpecified = null;
        }

        return { newValues: { nComponentsSpecified } };
      }
    }


    stateVariableDefinitions.link = {
      returnDependencies: () => ({
        linkAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "link"
        },
        serializedComponentsForContentId: {
          dependencyType: "stateVariable",
          variableName: "serializedComponentsForContentId",
        },
        replacementSourceIdentities: {
          dependencyType: "stateVariable",
          variableName: "replacementSourceIdentities",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let link;
        if (dependencyValues.linkAttr === null) {
          if (dependencyValues.serializedComponentsForContentId ||
            dependencyValues.replacementSourceIdentities &&
            dependencyValues.replacementSourceIdentities.some(x =>
              componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: x.componentType,
                baseComponentType: "module"
              })
            )
          ) {
            link = false;
          } else {
            link = true;
          }

        } else {
          link = dependencyValues.linkAttr;
        }

        return { newValues: { link } };
      }
    }

    stateVariableDefinitions.readyToExpandWhenResolved = {
      stateVariablesDeterminingDependencies: [
        "targetComponent", "propName", "obtainPropFromComposite", "link"
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
          // replacementSources: {
          //   dependencyType: "stateVariable",
          //   variableName: "replacementSources",
          // },
          serializedComponentsForContentId: {
            dependencyType: "stateVariable",
            variableName: "serializedComponentsForContentId",
          },
          link: {
            dependencyType: "stateVariable",
            variableName: "link",
          },
          // propName: {
          //   dependencyType: "stateVariable",
          //   variableName: "propName",
          // },
        };
        if (
          stateValues.targetComponent && componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false
          })
          && !(stateValues.propName && stateValues.obtainPropFromComposite)
        ) {
          dependencies.targetReadyToExpandWhenResolved = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetComponent.componentName,
            variableName: "readyToExpandWhenResolved",
          }
        }

        // since will be creating complete replacement when expand,
        // make sure all replacement sources are resolved
        if (stateValues.link === false) {
          dependencies.replacementSources = {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          }
        }


        return dependencies;

      },
      definition() {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };


    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      stateVariablesDeterminingDependencies: [
        "targetComponent",
        "replacementSourceIdentities", "effectivePropNameBySource",
        "propName", "obtainPropFromComposite", "link", "removeEmptyArrayEntries"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        // if don't link, never update replacements
        if (stateValues.link === false) {
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
          },
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities",
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
                dependencyType: "stateVariableArraySize",
                componentName: source.componentName,
                variableName: propName,
                variablesOptional: true,
                caseInsensitiveVariableMatch: true,
              }

              dependencies["sourceComponentType" + ind] = {
                dependencyType: "stateVariableComponentType",
                componentName: source.componentName,
                variableName: propName,
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
          && !(stateValues.propName && stateValues.obtainPropFromComposite)
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

        if (stateValues.removeEmptyArrayEntries) {
          // if we are to remove empty array entries,
          // then we have to recalculate whenever replacement sources change
          dependencies.replacementSources = {
            dependencyType: "stateVariable",
            variableName: "replacementSources"
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

    stateVariableDefinitions.effectiveAssignNames = {
      returnDependencies: () => ({
        assignNames: {
          dependencyType: "doenetAttribute",
          attributeName: "assignNames"
        },
        addLevelToAssignNames: {
          dependencyType: "stateVariable",
          variableName: "addLevelToAssignNames"
        }
      }),
      definition({ dependencyValues }) {
        let effectiveAssignNames = dependencyValues.assignNames;

        if (effectiveAssignNames && dependencyValues.addLevelToAssignNames) {
          effectiveAssignNames = [effectiveAssignNames]
        }

        return { newValues: { effectiveAssignNames } }
      }
    }

    return stateVariableDefinitions;

  }


  static createSerializedReplacements({ component, components, workspace,
    componentInfoObjects, flags, resolveItem,
    publicCaseInsensitiveAliasSubstitutions
  }) {

    // console.log(`create serialized replacements of ${component.componentName}`)

    // console.log(component.stateValues.targetComponent);
    // console.log(component.stateValues.effectivePropNameBySource);
    // console.log(component.stateValues.replacementSources)


    workspace.numReplacementsBySource = [];
    workspace.numNonStringReplacementsBySource = [];
    workspace.propVariablesCopiedBySource = [];
    workspace.sourceNames = [];
    workspace.uniqueIdentifiersUsedBySource = {};

    // if (component.state.contentIDChild !== undefined) {
    //   if (!component.state.serializedComponentsForContentId) {
    //     return { replacements: [] };
    //   }
    // }

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let compositeAttributesObj = this.createAttributesObject({ flags });


    if (component.stateValues.serializedComponentsForContentId) {
      // Note: any attributes (other than hide) specified on copy are ignored
      // when have serialized components from uri
      let replacements = [deepClone(component.stateValues.serializedComponentsForContentId)];

      if (replacements[0].children) {
        serializeFunctions.restrictTNamesToNamespace({
          components: replacements[0].children,
          namespace: replacements[0].originalName + "/"
        })
      }

      // replacements[0] is externalContent
      // add any specified attributes to its children
      for (let repl of replacements[0].children) {
        // add attributes
        if (!repl.attributes) {
          repl.attributes = {};
        }
        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: repl.componentType,
          componentInfoObjects, compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace
        });

        for (let attrName in attributesFromComposite) {
          let attribute = attributesFromComposite[attrName];
          if (attribute.component) {
            serializeFunctions.setTNamesToAbsolute([attribute.component])
          } else if (attribute.childrenForComponent) {
            serializeFunctions.setTNamesToAbsolute(attribute.childrenForComponent)
          }
        }

        Object.assign(repl.attributes, attributesFromComposite)

      }


      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.stateValues.effectiveAssignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });

      replacements = processResult.serializedComponents;

      let verificationResult = this.verifyReplacementsMatchSpecifiedType({
        component,
        replacements,
        workspace, componentInfoObjects, compositeAttributesObj
      });

      return { replacements: verificationResult.replacements };

    }


    // if have a sourceIndex, it means we are copying the indexAlias from a source
    // so we just return a number that is the index
    if (component.stateValues.sourceIndex !== null) {

      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: "number",
        componentInfoObjects, compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace
      })

      let replacements = [{
        componentType: "number",
        attributes: attributesFromComposite,
        state: { value: component.stateValues.sourceIndex, fixed: true },
      }];

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.stateValues.effectiveAssignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });

      let verificationResult = this.verifyReplacementsMatchSpecifiedType({
        component,
        replacements: processResult.serializedComponents,
        workspace, componentInfoObjects, compositeAttributesObj
      });

      return { replacements: verificationResult.replacements };

    }


    if (!component.stateValues.targetComponent || !component.stateValues.replacementSourceIdentities) {

      let verificationResult = this.verifyReplacementsMatchSpecifiedType({
        component,
        replacements: [],
        workspace, componentInfoObjects, compositeAttributesObj
      });

      return { replacements: verificationResult.replacements };

    }


    // resolve determine dependencies of replacementSources
    // and resolve recalculateDownstreamComponents of its target dependencies
    // so any array entry prop is created
    let resolveResult = resolveItem({
      componentName: component.componentName,
      type: "determineDependencies",
      stateVariable: "replacementSources",
      dependency: "__determine_dependencies",
      expandComposites: false
    });

    if (!resolveResult.success) {
      throw Error(`Couldn't resolve determineDependencies of replacementSources of ${component.componentName}`)
    }

    for (let ind in component.stateValues.replacementSourceIdentities) {

      let thisPropName = component.stateValues.effectivePropNameBySource[ind];

      if (thisPropName) {
        resolveResult = resolveItem({
          componentName: component.componentName,
          type: "recalculateDownstreamComponents",
          stateVariable: "replacementSources",
          dependency: "target" + ind,
          expandComposites: false
        });

        if (!resolveResult.success) {
          throw Error(`Couldn't resolve recalculateDownstreamComponents for target${ind} of replacementSources of ${component.componentName}`)
        }

      }

    }


    let replacements = [];

    let numReplacementsBySource = [];
    let numNonStringReplacementsBySource = [];
    let numReplacementsSoFar = 0;
    let numNonStringReplacementsSoFar = 0;

    for (let sourceNum in component.stateValues.replacementSourceIdentities) {

      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];

      let nComponentsForSource;

      if (component.attributes.componentType && component.attributes.componentType.primitive) {
        let nComponentsTotal = component.stateValues.nComponentsSpecified;
        let nSources = component.stateValues.replacementSourceIdentities.length;

        // arbitrarily divide these components among the sources
        nComponentsForSource = Math.floor(nComponentsTotal / nSources);
        let nExtras = nComponentsTotal % nSources;
        if (sourceNum < nExtras) {
          nComponentsForSource++;
        }
      }


      let results = this.createReplacementForSource({
        component,
        sourceNum,
        components,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        nComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions
      });

      workspace.propVariablesCopiedBySource[sourceNum] = results.propVariablesCopiedByReplacement;

      let sourceReplacements = results.serializedReplacements;
      numReplacementsBySource[sourceNum] = sourceReplacements.length;
      numNonStringReplacementsBySource[sourceNum] = sourceReplacements.filter(x => x.componentType !== "string").length;
      numReplacementsSoFar += numReplacementsBySource[sourceNum];
      numNonStringReplacementsSoFar += numNonStringReplacementsBySource[sourceNum];
      replacements.push(...sourceReplacements);
    }

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.numNonStringReplacementsBySource = numNonStringReplacementsBySource;
    workspace.sourceNames = component.stateValues.replacementSourceIdentities.map(x => x.componentName)

    let verificationResult = this.verifyReplacementsMatchSpecifiedType({
      component,
      replacements,
      workspace, componentInfoObjects, compositeAttributesObj
    });

    // console.log(`serialized replacements for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)))

    return { replacements: verificationResult.replacements };

  }

  static verifyReplacementsMatchSpecifiedType({ component,
    replacements, replacementChanges,
    workspace, componentInfoObjects, compositeAttributesObj
  }) {

    if (!(component.attributes.componentType && component.attributes.componentType.primitive)
      && !component.sharedParameters.compositesMustHaveAReplacement
    ) {

      return { replacements, replacementChanges }
    }

    let replacementsToWithhold = component.replacementsToWithhold;
    let replacementTypes;

    if (!replacementChanges) {
      replacementTypes = replacements.map(x => x.componentType);

      if (replacementTypes.length === 1 && replacementTypes[0] === "externalContent") {
        replacementTypes = replacements[0].children.map(x => x.componentType)
      }

    } else {

      replacementTypes = component.replacements.map(x => x.componentType);

      // apply any replacement changes to replacementTypes and replacementsToWithhold
      for (let change of replacementChanges) {

        if (change.changeType === "add") {
          if (change.replacementsToWithhold !== undefined) {
            replacementsToWithhold = change.replacementsToWithhold;
          }

          if (!change.changeTopLevelReplacements) {
            continue;
          }

          if (change.serializedReplacements) {

            let numberToDelete = change.numberReplacementsToReplace;
            if (!(numberToDelete > 0)) {
              numberToDelete = 0;
            }

            let firstIndex = change.firstReplacementInd;

            let newTypes = change.serializedReplacements.map(x => x.componentType);

            replacementTypes.splice(firstIndex, numberToDelete, ...newTypes);

          }

        } else if (change.changeType === "delete") {

          if (change.replacementsToWithhold !== undefined) {
            replacementsToWithhold = change.replacementsToWithhold;
          }

          if (change.changeTopLevelReplacements) {
            let firstIndex = change.firstReplacementInd;
            let numberToDelete = change.numberReplacementsToDelete;
            replacementTypes.splice(firstIndex, numberToDelete);
          }

        } else if (change.changeType === "changeReplacementsToWithhold") {
          if (change.replacementsToWithhold !== undefined) {
            replacementsToWithhold = change.replacementsToWithhold;
          }
        }

      }
    }

    if (replacementsToWithhold > 0) {
      replacementTypes = replacementTypes.slice(0, replacementTypes.length - replacementsToWithhold);
    }

    if (!(component.attributes.componentType && component.attributes.componentType.primitive)
      && component.sharedParameters.compositesMustHaveAReplacement
      && replacementTypes.length > 0
    ) {
      // no changes since only reason we got this far was that
      // composites must have a replacement
      // and we have at least one replacement
      return { replacements, replacementChanges }
    }

    let requiredComponentType = component.attributes.componentType;
    if (requiredComponentType) {
      requiredComponentType = component.attributes.componentType.primitive;
    }

    let requiredLength = component.stateValues.nComponentsSpecified;

    if (!requiredComponentType) {
      // must have be here due to composites needing a replacement
      requiredComponentType = component.sharedParameters.compositesDefaultReplacementType;
      if (!requiredComponentType) {
        throw Error(`A component class specified descendantCompositesMustHaveAReplacement but didn't specify descendantCompositesDefaultReplacementType`)
      }
      requiredLength = 1;
    }


    if (replacementTypes.length !== requiredLength ||
      !replacementTypes.every(x => x === requiredComponentType)) {

      // console.warn(`Replacements from copy ${component.componentName} do not match the specified componentType and number of components`);

      // since clearing out all replacements, reset all workspace variables
      workspace.numReplacementsBySource = [];
      workspace.numNonStringReplacementsBySource = [];
      workspace.propVariablesCopiedBySource = [];
      workspace.sourceNames = [];
      workspace.uniqueIdentifiersUsedBySource = {};

      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[0] = [];
      let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

      replacements = []
      for (let i = 0; i < requiredLength; i++) {

        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: requiredComponentType,
          componentInfoObjects, compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace
        });

        let uniqueIdentifierBase = requiredComponentType + "|empty" + i;
        let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);
        replacements.push({
          componentType: requiredComponentType,
          attributes: attributesFromComposite,
          uniqueIdentifier,
        });

      }

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.stateValues.effectiveAssignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });

      replacements = processResult.serializedComponents;

      workspace.numReplacementsBySource.push(replacements.length)
      workspace.numNonStringReplacementsBySource.push(replacements.filter(x => x.componentType !== "string").length)

      if (replacementChanges) {
        replacementChanges = [];
        if (component.replacementsToWithhold > 0) {
          replacementChanges.push({
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: 0,
          });
        }

        let numberReplacementsToReplace = 0;
        if (component.replacements) {
          numberReplacementsToReplace = component.replacements.length;
        }

        replacementChanges.push({
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToReplace,
          serializedReplacements: replacements,
        })
      }
    }

    return { replacements, replacementChanges }
  }

  static createReplacementForSource({
    component,
    sourceNum,
    components,
    numReplacementsSoFar,
    numNonStringReplacementsSoFar,
    uniqueIdentifiersUsed,
    compositeAttributesObj,
    componentInfoObjects,
    nComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions
  }) {

    // console.log(`create replacement for sourceNum ${sourceNum}`)
    // console.log(`propName: ${component.stateValues.effectivePropNameBySource[sourceNum]}`)

    let replacementSource = component.stateValues.replacementSourceIdentities[sourceNum];
    let replacementSourceComponent = components[replacementSource.componentName];
    if (replacementSourceComponent.stateValues.isInactiveCompositeReplacement) {
      return { serializedReplacements: [] }
    }

    // if not linking or removing empty array entries,
    // then replacementSources is resolved,
    // which we need for state variable value
    if (component.stateValues.link === false || component.stateValues.removeEmptyArrayEntries) {
      replacementSource = component.stateValues.replacementSources[sourceNum];
    }

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    // if creating copy from a prop
    // manually create the serialized component
    if (component.stateValues.effectivePropNameBySource[sourceNum]) {

      let results = replacementFromProp({
        component, components,
        replacementSource,
        propName: component.stateValues.effectivePropNameBySource[sourceNum],
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        nComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions
      });

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.stateValues.effectiveAssignNames,
        serializedComponents: results.serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        indOffset: numNonStringReplacementsSoFar,
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
      replacementSourceComponent.serialize({ forLink: component.stateValues.link })
    ];

    // console.log("targetComponent");
    // console.log(component.state.targetComponent);
    // console.log(`serializedReplacements for ${component.componentName}`);
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)));


    serializedReplacements = postProcessCopy({
      serializedComponents: serializedReplacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed,
      addShadowDependencies: !(component.stateValues.link === false),
      unlinkExternalCopies: component.stateValues.link === false
    })

    for (let repl of serializedReplacements) {
      // add attributes
      if (!repl.attributes) {
        repl.attributes = {};
      }
      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: repl.componentType,
        componentInfoObjects, compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace
      });
      Object.assign(repl.attributes, attributesFromComposite)
    }

    let processResult = serializeFunctions.processAssignNames({
      assignNames: component.stateValues.effectiveAssignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      indOffset: numNonStringReplacementsSoFar,
      componentInfoObjects,
    });

    return { serializedReplacements: processResult.serializedComponents };
  }


  static calculateReplacementChanges({ component, componentChanges, components,
    workspace,
    componentInfoObjects, flags, resolveItem,
    publicCaseInsensitiveAliasSubstitutions
  }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    // if copying a contentID, no changes
    if (component.stateValues.serializedComponentsForContentId) {
      return [];
    }

    // for indexAlias from a source, the replacements never change
    if (component.stateValues.sourceIndex !== null) {
      return [];
    }


    let compositeAttributesObj = this.createAttributesObject({ flags });


    if (!component.stateValues.targetComponent || !component.stateValues.replacementSourceIdentities) {


      if (component.stateValues.targetSources) {
        // if have targetSources, then we're in a template instance
        // that will be withheld
        // Don't change replacements so that maintain replacement
        // if the template instance is later no longer withheld
        return [];

      } else {
        let replacementChanges = [];

        if (component.replacements.length > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: 0,
            numberReplacementsToDelete: component.replacements.length,
          }
          replacementChanges.push(replacementInstruction);
        }

        let previousZeroSourceNames = workspace.sourceNames.length === 0;

        workspace.sourceNames = [];
        workspace.numReplacementsBySource = [];
        workspace.numNonStringReplacementsBySource = [];
        workspace.propVariablesCopiedBySource = [];


        let verificationResult = this.verifyReplacementsMatchSpecifiedType({
          component,
          replacementChanges,
          workspace, componentInfoObjects, compositeAttributesObj
        });

        // Note: this has to run after verify,
        // as verify has side effects of setting workspace variables,
        // such as numReplacementsBySource
        if (previousZeroSourceNames) {
          // didn't have sources before and still don't have sources.
          // we're just getting filler components being recreated.
          // Don't actually make those changes
          return [];
        }

        return verificationResult.replacementChanges;
      }
    }

    if (component.stateValues.targetInactive) {
      let replacementChanges = [];

      let nReplacements = component.replacements.length;
      if (nReplacements > 0) {
        if (component.replacementsToWithhold !== nReplacements) {
          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: nReplacements,
          };
          replacementChanges.push(replacementInstruction);
        }

        let verificationResult = this.verifyReplacementsMatchSpecifiedType({
          component,
          replacementChanges,
          workspace, componentInfoObjects, compositeAttributesObj
        });

        replacementChanges = verificationResult.replacementChanges;

      }

      return replacementChanges;
    }


    // resolve determine dependencies of replacementSources
    // and resolve recalculateDownstreamComponents of its target dependencies
    // so any array entry prop is created
    let resolveResult = resolveItem({
      componentName: component.componentName,
      type: "determineDependencies",
      stateVariable: "replacementSources",
      dependency: "__determine_dependencies",
      expandComposites: false
    });

    if (!resolveResult.success) {
      throw Error(`Couldn't resolve determineDependencies of replacementSources of ${component.componentName}`)
    }


    for (let ind in component.stateValues.replacementSourceIdentities) {

      let thisPropName = component.stateValues.effectivePropNameBySource[ind];

      if (thisPropName) {
        resolveResult = resolveItem({
          componentName: component.componentName,
          type: "recalculateDownstreamComponents",
          stateVariable: "replacementSources",
          dependency: "target" + ind,
          expandComposites: false
        });

        if (!resolveResult.success) {
          throw Error(`Couldn't resolve recalculateDownstreamComponents for target${ind} of replacementSources of ${component.componentName}`)
        }

      }

    }


    let replacementChanges = [];

    if (component.replacementsToWithhold > 0) {
      let replacementInstruction = {
        changeType: "changeReplacementsToWithhold",
        replacementsToWithhold: 0,
      };
      replacementChanges.push(replacementInstruction);
    }


    let numReplacementsSoFar = 0;
    let numNonStringReplacementsSoFar = 0;

    let numReplacementsBySource = [];
    let numNonStringReplacementsBySource = [];
    let propVariablesCopiedBySource = [];

    let maxSourceLength = Math.max(component.stateValues.replacementSourceIdentities.length, workspace.numReplacementsBySource.length);

    let recreateRemaining = false;

    for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
      let nComponentsForSource;

      if (component.attributes.componentType && component.attributes.componentType.primitive) {
        let nComponentsTotal = component.stateValues.nComponentsSpecified;
        let nSources = component.stateValues.replacementSourceIdentities.length;

        // arbitrarily divide these components among the sources
        nComponentsForSource = Math.floor(nComponentsTotal / nSources);
        let nExtras = nComponentsTotal % nSources;
        if (sourceNum < nExtras) {
          nComponentsForSource++;
        }
      }

      let replacementSource = component.stateValues.replacementSourceIdentities[sourceNum];
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
            workspace.numNonStringReplacementsBySource.slice(sourceNum)
              .forEach((v, i) => workspace.numNonStringReplacementsBySource[i] = 0)

          }

          workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];

        }

        numReplacementsBySource[sourceNum] = 0;
        numNonStringReplacementsBySource[sourceNum] = 0;
        propVariablesCopiedBySource.push([]);

        continue;
      }

      let prevSourceName = workspace.sourceNames[sourceNum];

      // check if replacementSource has changed
      let needToRecreate = prevSourceName === undefined || replacementSource.componentName !== prevSourceName
        || recreateRemaining;

      if (!needToRecreate) {
        // make sure the current replacements still shadow the replacement source
        for (let ind = 0; ind < workspace.numReplacementsBySource[sourceNum]; ind++) {
          let currentReplacement = component.replacements[numReplacementsSoFar + ind];
          if (!currentReplacement) {
            needToRecreate = true;
            break;
          } else if (
            !component.stateValues.effectivePropNameBySource[sourceNum]
            && currentReplacement.shadows
            && currentReplacement.shadows.componentName !== component.stateValues.replacementSourceIdentities[sourceNum].componentName
          ) {
            needToRecreate = true;
            break;
          }
        }
      }

      if (needToRecreate) {

        let prevNumReplacements = 0;
        if (sourceNum in workspace.numReplacementsBySource) {
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
          numNonStringReplacementsSoFar,
          numReplacementsToDelete,
          components,
          uniqueIdentifiersUsed,
          compositeAttributesObj,
          componentInfoObjects,
          nComponentsForSource,
          publicCaseInsensitiveAliasSubstitutions
        });

        numReplacementsSoFar += results.numReplacements;
        numNonStringReplacementsSoFar += results.numNonStringReplacements;

        numReplacementsBySource[sourceNum] = results.numReplacements;
        numNonStringReplacementsBySource[sourceNum] = results.numNonStringReplacements;

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
            workspace.numNonStringReplacementsBySource.slice(sourceNum)
              .forEach((v, i) => workspace.numNonStringReplacementsBySource[i] = 0)

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
            numNonStringReplacementsSoFar += workspace.numNonStringReplacementsBySource[sourceNum];
            numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
            numNonStringReplacementsBySource[sourceNum] = workspace.numNonStringReplacementsBySource[sourceNum];
            continue;
          }
        } else if (workspace.numReplacementsBySource[sourceNum] > 0) {
          // if previously had replacements and target still isn't inactive
          // then don't check for changes if don't have a propName
          numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
          numNonStringReplacementsSoFar += workspace.numNonStringReplacementsBySource[sourceNum];
          numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
          numNonStringReplacementsBySource[sourceNum] = workspace.numNonStringReplacementsBySource[sourceNum];
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
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        nComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions
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
          assignNamesOffset: numNonStringReplacementsSoFar,
        };

        replacementChanges.push(replacementInstruction);

        recreateRemaining = true;

        // since deleted remaining, change in workspace
        // so that don't attempt to delete again
        workspace.numReplacementsBySource.slice(sourceNum)
          .forEach((v, i) => workspace.numReplacementsBySource[i] = 0)
        workspace.numNonStringReplacementsBySource.slice(sourceNum)
          .forEach((v, i) => workspace.numNonStringReplacementsBySource[i] = 0)


      } else {

        let nonStringInd = 0;
        for (let ind = 0; ind < nNewReplacements; ind++) {
          if (propVariablesCopiedByReplacement[ind].length !== workspace.propVariablesCopiedBySource[sourceNum][ind].length ||
            workspace.propVariablesCopiedBySource[sourceNum][ind].some((v, i) => v !== propVariablesCopiedByReplacement[ind][i]) ||
            component.replacements[numReplacementsSoFar + ind].componentType !== newSerializedReplacements[ind].componentType
          ) {

            let replacementInstruction = {
              changeType: "add",
              changeTopLevelReplacements: true,
              firstReplacementInd: numReplacementsSoFar + ind,
              numberReplacementsToReplace: 1,
              serializedReplacements: [newSerializedReplacements[ind]],
              assignNamesOffset: numNonStringReplacementsSoFar + nonStringInd,
            };
            replacementChanges.push(replacementInstruction);
          }

          if (newSerializedReplacements[ind].componentType !== "string") {
            nonStringInd++;
          }

        }


      }


      let nNewNonStrings = newSerializedReplacements.filter(x => x.componentType !== "string").length;

      numReplacementsSoFar += nNewReplacements;
      numNonStringReplacementsSoFar += nNewNonStrings;

      numReplacementsBySource[sourceNum] = nNewReplacements;
      numNonStringReplacementsBySource[sourceNum] = nNewNonStrings;

      propVariablesCopiedBySource[sourceNum] = propVariablesCopiedByReplacement;

    }


    let previousZeroSourceNames = workspace.sourceNames.length === 0;

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.numNonStringReplacementsBySource = numNonStringReplacementsBySource;
    workspace.sourceNames = component.stateValues.replacementSourceIdentities.map(x => x.componentName)
    workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;


    let verificationResult = this.verifyReplacementsMatchSpecifiedType({
      component,
      replacementChanges,
      workspace, componentInfoObjects, compositeAttributesObj
    });

    // Note: this has to run after verify,
    // as verify has side effects of setting workspace variables,
    // such as numReplacementsBySource
    if (previousZeroSourceNames && workspace.sourceNames.length === 0) {
      // didn't have sources before and still don't have sources.
      // we're just getting filler components being recreated.
      // Don't actually make those changes
      return [];
    }

    // console.log("replacementChanges");
    // console.log(verificationResult.replacementChanges);


    return verificationResult.replacementChanges;

  }


  static recreateReplacements({ component, sourceNum,
    numReplacementsSoFar, numNonStringReplacementsSoFar,
    numReplacementsToDelete,
    uniqueIdentifiersUsed, components, compositeAttributesObj, componentInfoObjects,
    nComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions
  }) {

    let results = this.createReplacementForSource({
      component, sourceNum, numReplacementsSoFar, numNonStringReplacementsSoFar,
      components, uniqueIdentifiersUsed,
      compositeAttributesObj, componentInfoObjects, nComponentsForSource,
      publicCaseInsensitiveAliasSubstitutions
    });

    let propVariablesCopiedByReplacement = results.propVariablesCopiedByReplacement;

    let newSerializedChildren = results.serializedReplacements

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: numReplacementsToDelete,
      serializedReplacements: newSerializedChildren,
      assignNamesOffset: numNonStringReplacementsSoFar,
    };

    return {
      numReplacements: newSerializedChildren.length,
      numNonStringReplacements: newSerializedChildren.filter(x => x.componentType !== "string").length,
      propVariablesCopiedByReplacement,
      replacementInstruction
    }
  }

}

export function replacementFromProp({ component, components,
  replacementSource,
  propName,
  // numReplacementsSoFar,
  uniqueIdentifiersUsed,
  compositeAttributesObj,
  componentInfoObjects,
  nComponentsForSource,
  publicCaseInsensitiveAliasSubstitutions
}) {


  // console.log(`replacement from prop for ${component.componentName}`)
  // console.log(replacementSource)

  let serializedReplacements = [];
  let propVariablesCopiedByReplacement = [];
  let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;


  // if (replacementSource === null) {
  //   return { serializedReplacements, propVariablesCopiedByReplacement };
  // }

  let replacementInd = -1; //numReplacementsSoFar - 1;

  let target = components[replacementSource.componentName];

  let varName = publicCaseInsensitiveAliasSubstitutions({
    stateVariables: [propName],
    componentClass: target.constructor,
  })[0];

  if (varName === undefined || varName.slice(0, 12) === "__not_public") {
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

    if (arrayStateVarObj.hasVariableComponentType) {
      component.stateValues.replacementSources;
      if (!arrayStateVarObj.componentType) {
        return {
          serializedReplacements: [],
          propVariablesCopiedByReplacement: [],
        }
      }
    }

    let wrappingComponents = stateVarObj.wrappingComponents;
    let numWrappingComponents = wrappingComponents.length;

    let numReplacementsForSource = nComponentsForSource;

    if (stateVarObj.isArray) {
      numReplacementsForSource = stateVarObj.arraySize.
        slice(0, stateVarObj.arraySize.length - numWrappingComponents)
        .reduce((a, c) => a * c, 1);
    } else {

      if (stateVarObj.arrayKeys.length === 0) {
        // have an undefined array entry
        numReplacementsForSource = 0;

      } else if (numWrappingComponents === 0) {
        // with no wrapping components, will just output
        // one component for each component of the array
        numReplacementsForSource = stateVarObj.arrayKeys.length;
      } else if (numWrappingComponents >= stateVarObj.nDimensions) {
        // if had an outer wrapping component, would just have a single component
        numReplacementsForSource = 1;
      } else if (numWrappingComponents === stateVarObj.nDimensions - 1) {
        // if the second from outer dimension is wrapped
        // then just count the number of entries in the original array
        numReplacementsForSource = unflattenedArrayKeys.length;
      } else {
        // if have at least two unwrapped dimensions,
        // flatten the array so that the entries counted are the outermost wrapped
        // Note: we need to create a 3D array entry to access this,
        // so this code is so far untested
        let nLevelsToFlatten = stateVarObj.nDimensions - numWrappingComponents - 1;
        numReplacementsForSource = flattenLevels(unflattenedArrayKeys, nLevelsToFlatten).length;
      }
    }

    if (numWrappingComponents === 0) {
      // return flattened entries

      let flattenedArrayKeys = flattenDeep(unflattenedArrayKeys);

      for (let ind = 0; ind < numReplacementsForSource; ind++) {

        let arrayKey = flattenedArrayKeys[ind];

        if (component.stateValues.removeEmptyArrayEntries) {
          // check if value of replacmentSource is undefined or null
          // if so, skip

          if (!arrayKey) {
            // skip because didn't match array key
            continue;
          }

          let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
          if (!Array.isArray(arrayIndex)) {
            arrayIndex = [arrayIndex]
          }
          let propStateValue = arrayStateVarObj.value;
          for (let ind2 of arrayIndex) {
            propStateValue = propStateValue[ind2];
          }

          if (propStateValue === undefined || propStateValue === null) {
            continue;
          }

        }

        replacementInd++;
        let propVariablesCopied = propVariablesCopiedByReplacement[replacementInd] = [];

        let componentType = arrayStateVarObj.componentType;
        if (Array.isArray(componentType)) {
          // TODO: multidimensional arrays?

          if (componentType[arrayStateVarObj.keyToIndex(arrayKey)]) {
            componentType = componentType[arrayStateVarObj.keyToIndex(arrayKey)];
          } else {
            // TODO: better way to handle no match?
            componentType = componentType[0];
          }
          // if (stateVarObj.isArrayEntry) {
          //   componentType = componentType[arrayStateVarObj.keyToIndex(arrayKey)];
          // } else {
          //   componentType = componentType[ind];
          // }
        }


        if (arrayKey) {
          let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

          propVariablesCopied.push(propVariable);

          let uniqueIdentifierBase = replacementSource.componentName + "|shadow|" + propVariable;
          let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

          let attributesFromComposite = convertAttributesForComponentType({
            attributes: component.attributes,
            componentType,
            componentInfoObjects, compositeAttributesObj,
            compositeCreatesNewNamespace: newNamespace
          });

          if (component.stateValues.link !== false) {
            serializedReplacements.push({
              componentType: componentType,
              attributes: attributesFromComposite,
              downstreamDependencies: {
                [replacementSource.componentName]: [{
                  dependencyType: "referenceShadow",
                  compositeName: component.componentName,
                  propVariable
                }]
              },
              uniqueIdentifier,
            })
          } else {
            let primaryStateVariableForDefinition = "value";
            let componentClass = componentInfoObjects.allComponentClasses[componentType];
            if (componentClass.primaryStateVariableForDefinition) {
              primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
            }


            let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
            if (!Array.isArray(arrayIndex)) {
              arrayIndex = [arrayIndex]
            }
            let propStateValue = arrayStateVarObj.value;
            for (let ind2 of arrayIndex) {
              propStateValue = propStateValue[ind2];
            }

            let serializedComponent = {
              componentType: componentType,
              attributes: attributesFromComposite,
              state: {
                [primaryStateVariableForDefinition]: propStateValue
              },
              uniqueIdentifier,
            }


            if (arrayStateVarObj.stateVariablesPrescribingAdditionalAttributes) {
              let additionalAttributes = {};
              for (let attrName in arrayStateVarObj.stateVariablesPrescribingAdditionalAttributes) {
                let varName = arrayStateVarObj.stateVariablesPrescribingAdditionalAttributes[attrName]
                additionalAttributes[attrName] = target.stateValues[varName];
              }

              let attributesFromComponent = convertAttributesForComponentType({
                attributes: additionalAttributes,
                componentType,
                componentInfoObjects
              });

              Object.assign(serializedComponent.attributes, attributesFromComponent)

            }

            serializedReplacements.push(serializedComponent);

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

            let uniqueIdentifierBase = replacementSource.componentName + "|shadow|" + propVariable;
            let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

            let componentType = arrayStateVarObj.componentType;
            if (Array.isArray(componentType)) {
              // TODO: multidimensional arrays?
              componentType = componentType[arrayStateVarObj.keyToIndex(arrayKey)];
            }


            if (component.stateValues.link !== false) {
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
            } else {

              let primaryStateVariableForDefinition = "value";
              let componentClass = componentInfoObjects.allComponentClasses[componentType];
              if (componentClass.primaryStateVariableForDefinition) {
                primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
              }


              let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
              if (!Array.isArray(arrayIndex)) {
                arrayIndex = [arrayIndex]
              }

              let propStateValue = arrayStateVarObj.value;
              for (let ind of arrayIndex) {
                propStateValue = propStateValue[ind];
              }


              let serializedComponent = {
                componentType: componentType,
                state: {
                  [primaryStateVariableForDefinition]: propStateValue
                },
                uniqueIdentifier,
              }


              if (arrayStateVarObj.stateVariablesPrescribingAdditionalAttributes) {
                let additionalAttributes = {};
                for (let attrName in arrayStateVarObj.stateVariablesPrescribingAdditionalAttributes) {
                  let varName = arrayStateVarObj.stateVariablesPrescribingAdditionalAttributes[attrName]
                  additionalAttributes[attrName] = target.stateValues[varName];
                }

                let attributesFromComponent = convertAttributesForComponentType({
                  attributes: additionalAttributes,
                  componentType,
                  componentInfoObjects
                });

                serializedComponent.attributes, attributesFromComponent;

              }

              pieces.push(serializedComponent);

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

            let children = [];
            let attributes = {};

            for (let p of pieces) {
              if (p.isAttribute) {
                let attr = p.isAttribute;
                delete p.isAttribute;
                attributes[attr] = { component: p };
              } else {
                children.push(p);
              }
            }

            pieces = [{
              componentType: wrapCT,
              children,
              attributes,
              uniqueIdentifier,
              skipSugar: true,
            }]
            if (typeof wrapCs[ind] === "object") {
              if (wrapCs[ind].doenetAttributes) {
                pieces[0].doenetAttributes = Object.assign({}, wrapCs[ind].doenetAttributes);
              }
              if (wrapCs[ind].isAttribute) {
                pieces[0].isAttribute = wrapCs[ind].isAttribute
              }
            }

          }
          propVariablesCopiedByPiece = [flattenDeep(propVariablesCopiedByPiece)];
        }

        return { pieces, propVariablesCopiedByPiece };

      }

      let result = createReplacementPiece(unflattenedArrayKeys, stateVarObj.nDimensions);

      let newReplacements = result.pieces;
      propVariablesCopiedByReplacement = result.propVariablesCopiedByPiece;


      // add downstream dependencies and attributes to top level replacements
      // (which are wrappers, so didn't get downstream dependencies originally)
      for (let replacement of newReplacements) {

        if (!replacement.attributes) {
          replacement.attributes = {};
        }

        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: replacement.componentType,
          componentInfoObjects, compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace
        });

        Object.assign(replacement.attributes, attributesFromComposite)

        if (component.stateValues.link !== false) {
          replacement.downstreamDependencies = {
            [replacementSource.componentName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: varName,
              ignorePrimaryStateVariable: true,
            }]
          }
        }
      }

      replacementInd += newReplacements.length;

      serializedReplacements.push(...newReplacements);

      if (newReplacements.length < numReplacementsForSource) {
        // we didn't create enough replacements,
        // which could happen if we have componentType and nComponentsSpecified set

        // just create additional replacements,
        // even though they won't yet refer to the right dependencies

        for (let ind = newReplacements.length; ind < numReplacementsForSource; ind++) {
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

      } else if (newReplacements > numReplacementsForSource) {
        throw Error(`Something went wrong when creating replacements for ${component.componentName} as we ended up with too many replacements`)
      }

    }



  } else {

    if (stateVarObj.hasVariableComponentType) {
      // evaluate stateVarObj to make sure componentType is calculated and up-to-date
      stateVarObj.value;
    }

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


    let attributesFromComposite = convertAttributesForComponentType({
      attributes: component.attributes,
      componentType: stateVarObj.componentType,
      componentInfoObjects, compositeAttributesObj,
      compositeCreatesNewNamespace: newNamespace
    });

    if (component.stateValues.link !== false) {
      serializedReplacements.push({
        componentType: stateVarObj.componentType,
        attributes: attributesFromComposite,
        downstreamDependencies: {
          [target.componentName]: [{
            dependencyType: "referenceShadow",
            compositeName: component.componentName,
            propVariable: varName,
          }]
        },
        uniqueIdentifier,
      })

    } else {

      let primaryStateVariableForDefinition = "value";
      let componentClass = componentInfoObjects.allComponentClasses[stateVarObj.componentType];
      if (componentClass.primaryStateVariableForDefinition) {
        primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
      }

      let propStateVariableInTarget = target.state[varName];

      if (!propStateVariableInTarget) {
        console.warn(`Could not find variable ${varName} in target ${replacementSource.componentName}.`)
      } else {


        let serializedComponent = {
          componentType: stateVarObj.componentType,
          attributes: attributesFromComposite,
          state: {
            [primaryStateVariableForDefinition]: target.stateValues[varName]
          },
          uniqueIdentifier,
        }


        if (propStateVariableInTarget.stateVariablesPrescribingAdditionalAttributes) {
          let additionalAttributes = {};
          for (let attrName in propStateVariableInTarget.stateVariablesPrescribingAdditionalAttributes) {
            let varName = propStateVariableInTarget.stateVariablesPrescribingAdditionalAttributes[attrName]
            additionalAttributes[attrName] = target.stateValues[varName];
          }

          let attributesFromComponent = convertAttributesForComponentType({
            attributes: additionalAttributes,
            componentType: stateVarObj.componentType,
            componentInfoObjects
          });

          Object.assign(serializedComponent.attributes, attributesFromComponent)

        }

        serializedReplacements.push(serializedComponent);
      }

    }
  }


  // console.log(`serializedReplacements for ${component.componentName}`)
  // console.log(JSON.parse(JSON.stringify(serializedReplacements)))
  // console.log(serializedReplacements)

  return { serializedReplacements, propVariablesCopiedByReplacement };

}
