import CompositeComponent from './abstract/CompositeComponent.js';
import * as serializeFunctions from '../utils/serializedStateProcessing.js';
import { convertAttributesForComponentType, postProcessCopy } from '../utils/copy.js';
import { flattenDeep, flattenLevels } from '../utils/array.js';
import { getUniqueIdentifierFromBase } from '../utils/naming.js';
import { deepClone } from '../utils/deepFunctions.js';


export default class Copy extends CompositeComponent {
  static componentType = "copy";

  static assignNamesToReplacements = true;

  static acceptTarget = true;
  static acceptAnyAttribute = true;

  static stateVariableToEvaluateAfterReplacements = "needsReplacementsUpdatedWhenStale";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

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
    attributes.createComponentOfType = {
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
    attributes.targetAttributesToIgnoreRecursively = {
      createComponentOfType: "textList",
      createStateVariable: "targetAttributesToIgnoreRecursively",
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

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      return Object.keys(serializedComponent.children)
    }
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.target = {
      returnDependencies: () => ({
        target: {
          dependencyType: "doenetAttribute",
          attributeName: "target"
        }
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { target: dependencyValues.target }
      })
    }

    stateVariableDefinitions.targetSourcesName = {
      additionalStateVariablesDefined: [{
        variableName: "sourcesChildNumber",
        hasEssential: true,
        shadowVariable: true
      }],
      stateVariablesDeterminingDependencies: ["target"],
      determineDependenciesImmediately: true,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: function ({ stateValues, sharedParameters }) {

        let sourceNameMappings = sharedParameters.sourceNameMappings;
        if (!sourceNameMappings) {
          return {};
        }

        let theMapping = sourceNameMappings[stateValues.target];
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
          setValue: { targetSourcesName, sourcesChildNumber },
          setEssentialValue: { targetSourcesName, sourcesChildNumber },
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
        return { setValue: { targetSources } }
      },
    };


    stateVariableDefinitions.sourceIndex = {
      stateVariablesDeterminingDependencies: ["target"],
      determineDependenciesImmediately: true,
      hasEssential: true,
      shadowVariable: true,
      returnDependencies: function ({ stateValues, sharedParameters }) {

        let sourceIndexMappings = sharedParameters.sourceIndexMappings;
        if (!sourceIndexMappings) {
          return {};
        }

        let theMapping = sourceIndexMappings[stateValues.target];
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
          setValue: { sourceIndex },
          setEssentialValue: { sourceIndex },
        }
      },
    };


    stateVariableDefinitions.targetComponent = {
      shadowVariable: true,
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
          setValue: { targetComponent }
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
          setValue: {
            targetInactive: Boolean(dependencyValues.targetIsInactiveCompositeReplacement)
          }
        }
      },
    };

    stateVariableDefinitions.cid = {
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
            setValue: { cid: null, doenetId: null }
          }
        }

        let cid = null, doenetId = null;

        let result = dependencyValues.uri.match(/[:&]cid=([^&]+)/i);
        if (result) {
          cid = result[1];
        }
        result = dependencyValues.uri.match(/[:&]doenetid=([^&]+)/i);
        if (result) {
          doenetId = result[1];
        }

        return { setValue: { cid, doenetId } };
      },
    };


    stateVariableDefinitions.serializedComponentsForCid = {
      returnDependencies: () => ({
        cid: {
          dependencyType: "stateVariable",
          variableName: "cid"
        },
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.cid) {
          return {
            setValue: { serializedComponentsForCid: null }
          }
        }
        let externalContentChild = dependencyValues.serializedChildren?.[0];
        if (!externalContentChild) {
          return {
            setValue: { serializedComponentsForCid: null }
          }
        }

        let childrenOfContent = externalContentChild.children;
        let serializedComponentsForCid = {
          componentType: "externalContent",
          state: { rendered: true },
          children: childrenOfContent,
          originalName: externalContentChild.componentName,
          variants: externalContentChild.variants,
        }
        if (externalContentChild.attributes?.newNamespace?.primitive) {
          serializedComponentsForCid.attributes = { newNamespace: { primitive: true } }
        }
        return {
          setValue: {
            serializedComponentsForCid
          }
        }
      }
    };

    stateVariableDefinitions.propName = {
      shadowVariable: true,
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop"
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } }
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
        return { setValue: { isPlainMacro: dependencyValues.isPlainMacro } }
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

        return { setValue: { linkAttrForDetermineDeps } };
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
          setValue: {
            replacementSourceIdentities,
            addLevelToAssignNames: dependencyValues.addLevelToAssignNames
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
      ],
      additionalStateVariablesDefined: ["effectivePropNameBySource"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities"
          },
          propIndex: {
            dependencyType: "stateVariable",
            variableName: "propIndex"
          },
        }

        if (!stateValues.propName && stateValues.propIndex !== null) {
          throw Error(`You cannot specify a propIndex without specifying a prop.`)
        }


        if (stateValues.replacementSourceIdentities !== null) {

          for (let [ind, source] of stateValues.replacementSourceIdentities.entries()) {

            let thisPropName = stateValues.propName;

            if (stateValues.isPlainMacro) {
              thisPropName = componentInfoObjects.allComponentClasses[source.componentType]
                .variableForPlainMacro
            }

            let thisTarget;

            if (thisPropName) {

              dependencies["propName" + ind] = {
                dependencyType: "value",
                value: thisPropName,
              }

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
        let effectivePropNameBySource = null;

        if (dependencyValues.replacementSourceIdentities !== null) {
          replacementSources = [];
          effectivePropNameBySource = [];

          for (let ind in dependencyValues.replacementSourceIdentities) {
            let targetDep = dependencyValues["target" + ind];
            if (targetDep) {
              replacementSources.push(targetDep);

              let propName;
              if (targetDep.stateValues) {
                propName = Object.keys(targetDep.stateValues)[0];
              }
              if (!propName && dependencyValues["propName" + ind]) {
                // a propName was specified, but it just wasn't found
                propName = dependencyValues["propName" + ind];
              }
              effectivePropNameBySource.push(propName)
            }
          }
        }

        return { setValue: { replacementSources, effectivePropNameBySource } };
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
          attributeName: "createComponentOfType"
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
          throw Error(`You must specify createComponentOfType when specifying nComponents for a copy.`)
        } else {
          nComponentsSpecified = null;
        }

        return { setValue: { nComponentsSpecified } };
      }
    }


    stateVariableDefinitions.link = {
      returnDependencies: () => ({
        linkAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "link"
        },
        serializedComponentsForCid: {
          dependencyType: "stateVariable",
          variableName: "serializedComponentsForCid",
        },
        replacementSourceIdentities: {
          dependencyType: "stateVariable",
          variableName: "replacementSourceIdentities",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let link;
        if (dependencyValues.linkAttr === null) {
          if (dependencyValues.serializedComponentsForCid ||
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
          link = dependencyValues.linkAttr !== false;
        }

        return { setValue: { link } };
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
          serializedComponentsForCid: {
            dependencyType: "stateVariable",
            variableName: "serializedComponentsForCid",
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
        if (!stateValues.link) {
          dependencies.replacementSources = {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          }
        }


        return dependencies;

      },
      definition() {
        return { setValue: { readyToExpandWhenResolved: true } };
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
        if (!stateValues.link) {
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
          propIndex: {
            dependencyType: "stateVariable",
            variableName: "propIndex",
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
      definition: () => ({ setValue: { needsReplacementsUpdatedWhenStale: true } })
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

        return { setValue: { effectiveAssignNames } }
      }
    }

    return stateVariableDefinitions;

  }


  static async createSerializedReplacements({ component, components, workspace,
    componentInfoObjects, flags, resolveItem,
    publicCaseInsensitiveAliasSubstitutions
  }) {

    // console.log(`create serialized replacements of ${component.componentName}`)

    // console.log(await component.stateValues.targetComponent);
    // console.log(await component.stateValues.effectivePropNameBySource);
    // console.log(await component.stateValues.replacementSources)


    workspace.numReplacementsBySource = [];
    workspace.numNonStringReplacementsBySource = [];
    workspace.propVariablesCopiedBySource = [];
    workspace.sourceNames = [];
    workspace.uniqueIdentifiersUsedBySource = {};


    let newNamespace = component.attributes.newNamespace?.primitive;

    let compositeAttributesObj = this.createAttributesObject();

    let assignNames = await component.stateValues.effectiveAssignNames;

    let serializedComponentsForCid = await component.stateValues.serializedComponentsForCid;

    if (serializedComponentsForCid) {
      // Note: any attributes (other than hide) specified on copy are ignored
      // when have serialized components from uri
      let replacements = [deepClone(serializedComponentsForCid)];

      if (replacements[0].children) {
        serializeFunctions.restrictTNamesToNamespace({
          components: replacements[0].children,
          namespace: replacements[0].originalName + "/"
        })
      }

      // replacements[0] is externalContent
      // add any specified attributes to its children
      for (let repl of replacements[0].children) {
        if (typeof repl !== "object") {
          continue;
        }

        // add attributes
        if (!repl.attributes) {
          repl.attributes = {};
        }
        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: repl.componentType,
          componentInfoObjects, compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
          flags
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
        assignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });

      replacements = processResult.serializedComponents;

      let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
        component,
        replacements,
        workspace, componentInfoObjects, compositeAttributesObj,
        flags
      });

      return { replacements: verificationResult.replacements };

    }


    // if have a sourceIndex, it means we are copying the indexAlias from a source
    // so we just return a number that is the index
    let sourceIndex = await component.stateValues.sourceIndex;
    if (sourceIndex !== null) {

      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: "number",
        componentInfoObjects,
        compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace,
        flags
      })

      let replacements = [{
        componentType: "number",
        attributes: attributesFromComposite,
        state: { value: sourceIndex, fixed: true },
      }];

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });

      let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
        component,
        replacements: processResult.serializedComponents,
        workspace, componentInfoObjects, compositeAttributesObj,
        flags
      });

      return { replacements: verificationResult.replacements };

    }

    let replacementSourceIdentities = await component.stateValues.replacementSourceIdentities;
    if (!await component.stateValues.targetComponent || !replacementSourceIdentities) {

      let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
        component,
        replacements: [],
        workspace, componentInfoObjects, compositeAttributesObj
      });

      return { replacements: verificationResult.replacements };

    }


    // resolve determine dependencies of replacementSources
    // and resolve recalculateDownstreamComponents of its target dependencies
    // so any array entry prop is created
    let resolveResult = await resolveItem({
      componentName: component.componentName,
      type: "determineDependencies",
      stateVariable: "replacementSources",
      dependency: "__determine_dependencies",
      expandComposites: false
    });

    if (!resolveResult.success) {
      throw Error(`Couldn't resolve determineDependencies of replacementSources of ${component.componentName}`)
    }

    let effectivePropNameBySource = await component.stateValues.effectivePropNameBySource;
    for (let ind in replacementSourceIdentities) {

      let thisPropName = effectivePropNameBySource[ind];

      if (thisPropName) {
        resolveResult = await resolveItem({
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

    for (let sourceNum in replacementSourceIdentities) {

      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];

      let nComponentsForSource;

      if (component.attributes.createComponentOfType?.primitive) {
        let nComponentsTotal = await component.stateValues.nComponentsSpecified;
        let nSources = replacementSourceIdentities.length;

        // arbitrarily divide these components among the sources
        nComponentsForSource = Math.floor(nComponentsTotal / nSources);
        let nExtras = nComponentsTotal % nSources;
        if (sourceNum < nExtras) {
          nComponentsForSource++;
        }
      }


      let results = await this.createReplacementForSource({
        component,
        sourceNum,
        components,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        nComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        flags
      });

      workspace.propVariablesCopiedBySource[sourceNum] = results.propVariablesCopiedByReplacement;

      let sourceReplacements = results.serializedReplacements;
      numReplacementsBySource[sourceNum] = sourceReplacements.length;
      numNonStringReplacementsBySource[sourceNum] = sourceReplacements.filter(x => typeof x !== "string").length;
      numReplacementsSoFar += numReplacementsBySource[sourceNum];
      numNonStringReplacementsSoFar += numNonStringReplacementsBySource[sourceNum];
      replacements.push(...sourceReplacements);
    }

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.numNonStringReplacementsBySource = numNonStringReplacementsBySource;
    workspace.sourceNames = replacementSourceIdentities.map(x => x.componentName)

    let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
      component,
      replacements,
      workspace, componentInfoObjects, compositeAttributesObj,
      flags
    });

    // console.log(`serialized replacements for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)))

    return { replacements: verificationResult.replacements };

  }

  static async verifyReplacementsMatchSpecifiedType({ component,
    replacements, replacementChanges,
    workspace, componentInfoObjects, compositeAttributesObj, flags
  }) {

    if (!component.attributes.createComponentOfType?.primitive
      && !component.sharedParameters.compositesMustHaveAReplacement
    ) {

      return { replacements, replacementChanges }
    }

    let replacementsToWithhold = component.replacementsToWithhold;
    let replacementTypes;

    if (!replacementChanges) {
      replacementTypes = replacements.map(x => x.componentType);

      if (replacementTypes.length === 1 && replacementTypes[0] === "externalContent") {
        // since looking for a particular componentType, filter out blank strings
        replacementTypes = replacements[0].children
          .filter(x => x.componentType || x.trim().length > 0)
          .map(x => x.componentType)
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

    if (!(component.attributes.createComponentOfType?.primitive)
      && component.sharedParameters.compositesMustHaveAReplacement
      && replacementTypes.length > 0
    ) {
      // no changes since only reason we got this far was that
      // composites must have a replacement
      // and we have at least one replacement
      return { replacements, replacementChanges }
    }

    let requiredComponentType = component.attributes.createComponentOfType?.primitive;

    let requiredLength = await component.stateValues.nComponentsSpecified;

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
      let newNamespace = component.attributes.newNamespace?.primitive;

      replacements = []
      for (let i = 0; i < requiredLength; i++) {

        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: requiredComponentType,
          componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
          flags
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
        assignNames: await component.stateValues.effectiveAssignNames,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });

      replacements = processResult.serializedComponents;

      workspace.numReplacementsBySource.push(replacements.length)
      workspace.numNonStringReplacementsBySource.push(replacements.filter(x => typeof x !== "string").length)

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

  static async createReplacementForSource({
    component,
    sourceNum,
    components,
    numReplacementsSoFar,
    numNonStringReplacementsSoFar,
    uniqueIdentifiersUsed,
    compositeAttributesObj,
    componentInfoObjects,
    nComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
    flags
  }) {

    // console.log(`create replacement for sourceNum ${sourceNum}`)
    // console.log(`propName: ${component.stateValues.effectivePropNameBySource[sourceNum]}`)

    let replacementSource = (await component.stateValues.replacementSourceIdentities)[sourceNum];
    if (typeof replacementSource !== "object") {
      return { serializedReplacements: [replacementSource] }
    }
    let replacementSourceComponent = components[replacementSource.componentName];

    // if not linking or removing empty array entries,
    // then replacementSources is resolved,
    // which we need for state variable value
    let link = await component.stateValues.link;
    if (!link || await component.stateValues.removeEmptyArrayEntries) {
      replacementSource = (await component.stateValues.replacementSources)[sourceNum];
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let assignNames = await component.stateValues.effectiveAssignNames;

    // if creating copy from a prop
    // manually create the serialized component
    let propName = (await component.stateValues.effectivePropNameBySource)[sourceNum]
    if (propName) {

      let results = await replacementFromProp({
        component, components,
        replacementSource,
        propName,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        nComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        flags
      });

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
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
      await replacementSourceComponent.serialize({ copyAll: !link, copyVariants: !link })
    ];

    // console.log(`serializedReplacements for ${component.componentName}`);
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)));


    serializedReplacements = postProcessCopy({
      serializedComponents: serializedReplacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed,
      addShadowDependencies: link,
      unlinkExternalCopies: !link
    })

    for (let repl of serializedReplacements) {
      if (typeof repl !== "object") {
        continue;
      }

      // add attributes
      if (!repl.attributes) {
        repl.attributes = {};
      }
      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: repl.componentType,
        componentInfoObjects,
        compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace,
        flags
      });
      Object.assign(repl.attributes, attributesFromComposite)
    }

    let processResult = serializeFunctions.processAssignNames({
      assignNames,
      serializedComponents: serializedReplacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      indOffset: numNonStringReplacementsSoFar,
      componentInfoObjects,
      originalNamesAreConsistent: newNamespace && !assignNames
    });

    // console.log(`ending serializedReplacements for ${component.componentName}`);
    // console.log(JSON.parse(JSON.stringify(processResult.serializedComponents)));



    return { serializedReplacements: processResult.serializedComponents };
  }


  static async calculateReplacementChanges({ component, componentChanges, components,
    workspace,
    componentInfoObjects, flags, resolveItem,
    publicCaseInsensitiveAliasSubstitutions
  }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    // if copying a cid, no changes
    if (await component.stateValues.serializedComponentsForCid) {
      return [];
    }

    // for indexAlias from a source, the replacements never change
    if (await component.stateValues.sourceIndex !== null) {
      return [];
    }


    let compositeAttributesObj = this.createAttributesObject();

    let replacementSourceIdentities = await component.stateValues.replacementSourceIdentities;
    if (!await component.stateValues.targetComponent || !replacementSourceIdentities) {


      if (await component.stateValues.targetSources) {
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


        let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
          component,
          replacementChanges,
          workspace, componentInfoObjects, compositeAttributesObj,
          flags
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

    if (await component.stateValues.targetInactive) {
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

        let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
          component,
          replacementChanges,
          workspace, componentInfoObjects, compositeAttributesObj,
          flags
        });

        replacementChanges = verificationResult.replacementChanges;

      }

      return replacementChanges;
    }


    // resolve determine dependencies of replacementSources
    // and resolve recalculateDownstreamComponents of its target dependencies
    // so any array entry prop is created
    let resolveResult = await resolveItem({
      componentName: component.componentName,
      type: "determineDependencies",
      stateVariable: "replacementSources",
      dependency: "__determine_dependencies",
      expandComposites: false
    });

    if (!resolveResult.success) {
      throw Error(`Couldn't resolve determineDependencies of replacementSources of ${component.componentName}`)
    }

    let effectivePropNameBySource = await component.stateValues.effectivePropNameBySource;

    for (let ind in replacementSourceIdentities) {

      let thisPropName = effectivePropNameBySource[ind];

      if (thisPropName) {
        resolveResult = await resolveItem({
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

    let maxSourceLength = Math.max(replacementSourceIdentities.length, workspace.numReplacementsBySource.length);

    let recreateRemaining = false;

    for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
      let nComponentsForSource;

      if (component.attributes.createComponentOfType?.primitive) {
        let nComponentsTotal = await component.stateValues.nComponentsSpecified;
        let nSources = replacementSourceIdentities.length;

        // arbitrarily divide these components among the sources
        nComponentsForSource = Math.floor(nComponentsTotal / nSources);
        let nExtras = nComponentsTotal % nSources;
        if (sourceNum < nExtras) {
          nComponentsForSource++;
        }
      }

      let replacementSource = replacementSourceIdentities[sourceNum];
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
            !effectivePropNameBySource[sourceNum]
            && currentReplacement.shadows
            && currentReplacement.shadows.componentName !== replacementSourceIdentities[sourceNum].componentName
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
        let results = await this.recreateReplacements({
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
          publicCaseInsensitiveAliasSubstitutions,
          flags
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


      if (!effectivePropNameBySource[sourceNum]
        && workspace.numReplacementsBySource[sourceNum] > 0
      ) {
        // if previously had replacements and target still isn't inactive
        // then don't check for changes if don't have a propName
        numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
        numNonStringReplacementsSoFar += workspace.numNonStringReplacementsBySource[sourceNum];
        numReplacementsBySource[sourceNum] = workspace.numReplacementsBySource[sourceNum];
        numNonStringReplacementsBySource[sourceNum] = workspace.numNonStringReplacementsBySource[sourceNum];
        continue;
      }


      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];

      let results = await this.createReplacementForSource({
        component,
        sourceNum,
        components,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        nComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        flags
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

          if (typeof newSerializedReplacements[ind] !== "string") {
            nonStringInd++;
          }

        }


      }


      let nNewNonStrings = newSerializedReplacements.filter(x => typeof x !== "string").length;

      numReplacementsSoFar += nNewReplacements;
      numNonStringReplacementsSoFar += nNewNonStrings;

      numReplacementsBySource[sourceNum] = nNewReplacements;
      numNonStringReplacementsBySource[sourceNum] = nNewNonStrings;

      propVariablesCopiedBySource[sourceNum] = propVariablesCopiedByReplacement;

    }


    let previousZeroSourceNames = workspace.sourceNames.length === 0;

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.numNonStringReplacementsBySource = numNonStringReplacementsBySource;
    workspace.sourceNames = replacementSourceIdentities.map(x => x.componentName)
    workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;


    let verificationResult = await this.verifyReplacementsMatchSpecifiedType({
      component,
      replacementChanges,
      workspace, componentInfoObjects, compositeAttributesObj,
      flags
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


  static async recreateReplacements({ component, sourceNum,
    numReplacementsSoFar, numNonStringReplacementsSoFar,
    numReplacementsToDelete,
    uniqueIdentifiersUsed, components, compositeAttributesObj, componentInfoObjects,
    nComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
    flags
  }) {

    let results = await this.createReplacementForSource({
      component, sourceNum, numReplacementsSoFar, numNonStringReplacementsSoFar,
      components, uniqueIdentifiersUsed,
      compositeAttributesObj, componentInfoObjects, nComponentsForSource,
      publicCaseInsensitiveAliasSubstitutions,
      flags
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
      numNonStringReplacements: newSerializedChildren.filter(x => typeof x !== "string").length,
      propVariablesCopiedByReplacement,
      replacementInstruction
    }
  }

}

export async function replacementFromProp({ component, components,
  replacementSource,
  propName,
  // numReplacementsSoFar,
  uniqueIdentifiersUsed,
  compositeAttributesObj,
  componentInfoObjects,
  nComponentsForSource,
  publicCaseInsensitiveAliasSubstitutions,
  flags
}) {


  // console.log(`replacement from prop for ${component.componentName}`)
  // console.log(replacementSource)

  let serializedReplacements = [];
  let propVariablesCopiedByReplacement = [];
  let newNamespace = component.attributes.newNamespace?.primitive;


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
  let stateVarValue = await stateVarObj.value;

  let link = await component.stateValues.link;

  if (stateVarObj.isArray || stateVarObj.isArrayEntry) {

    let arrayStateVarObj, unflattenedArrayKeys, arraySize, arrayKeys;
    if (stateVarObj.isArray) {
      arrayStateVarObj = stateVarObj;
      arraySize = await stateVarObj.arraySize;
      unflattenedArrayKeys = stateVarObj.getAllArrayKeys(arraySize, false);
    } else {
      arrayStateVarObj = target.state[stateVarObj.arrayStateVariable];
      unflattenedArrayKeys = await stateVarObj.unflattenedArrayKeys;
      arrayKeys = await stateVarObj.arrayKeys;
    }

    if (arrayStateVarObj.shadowingInstructions?.hasVariableComponentType) {
      await component.stateValues.replacementSources;
      if (!arrayStateVarObj.shadowingInstructions.createComponentOfType) {
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
      numReplacementsForSource = arraySize.
        slice(0, arraySize.length - numWrappingComponents)
        .reduce((a, c) => a * c, 1);
    } else {

      if (arrayKeys.length === 0) {
        // have an undefined array entry
        numReplacementsForSource = 0;

      } else if (numWrappingComponents === 0) {
        // with no wrapping components, will just output
        // one component for each component of the array
        numReplacementsForSource = arrayKeys.length;
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

        if (await component.stateValues.removeEmptyArrayEntries) {
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
          let propStateValue = await arrayStateVarObj.value;
          for (let ind2 of arrayIndex) {
            propStateValue = propStateValue[ind2];
          }

          if (propStateValue === undefined || propStateValue === null) {
            continue;
          }

        }

        replacementInd++;
        let propVariablesCopied = propVariablesCopiedByReplacement[replacementInd] = [];

        let createComponentOfType = arrayStateVarObj.shadowingInstructions.createComponentOfType;
        if (Array.isArray(createComponentOfType)) {
          // TODO: multidimensional arrays?

          if (createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)]) {
            createComponentOfType = createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)];
          } else {
            // TODO: better way to handle no match?
            createComponentOfType = createComponentOfType[0];
          }
          // if (stateVarObj.isArrayEntry) {
          //   createComponentOfType = createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)];
          // } else {
          //   createComponentOfType = createComponentOfType[ind];
          // }
        }


        if (arrayKey) {
          let propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

          propVariablesCopied.push(propVariable);

          let uniqueIdentifierBase = replacementSource.componentName + "|shadow|" + propVariable;
          let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

          let attributesFromComposite = convertAttributesForComponentType({
            attributes: component.attributes,
            componentType: createComponentOfType,
            componentInfoObjects,
            compositeAttributesObj,
            compositeCreatesNewNamespace: newNamespace,
            flags
          });

          let attributeComponentsShadowingStateVariables;
          if (arrayStateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
            attributeComponentsShadowingStateVariables = {};

            for (let attrName in arrayStateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
              let stateVariableToShadow = arrayStateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;

              let sObj = target.state[stateVariableToShadow];
              if (sObj.isArray) {
                stateVariableToShadow = sObj.arrayVarNameFromArrayKey(arrayKey);
              }

              attributeComponentsShadowingStateVariables[attrName] = {
                stateVariableToShadow
              }
            }
          }

          let stateVariablesShadowingStateVariables;
          if (arrayStateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables) {
            stateVariablesShadowingStateVariables = {};

            for (let attrName in arrayStateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables) {
              let stateVariableToShadow = arrayStateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables[attrName].stateVariableToShadow;

              let sObj = target.state[stateVariableToShadow];
              if (sObj.isArray) {
                stateVariableToShadow = sObj.arrayVarNameFromArrayKey(arrayKey);
              }

              stateVariablesShadowingStateVariables[attrName] = {
                stateVariableToShadow
              }
            }
          }

          if (link) {

            let attributesForReplacement = {};

            if (attributeComponentsShadowingStateVariables) {
              let classOfComponentToCreate = componentInfoObjects.allComponentClasses[createComponentOfType];
              let attrObj = classOfComponentToCreate.createAttributesObject();

              for (let attrName in attributeComponentsShadowingStateVariables) {
                let stateVariableToShadow = attributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
                let attributeComponentType = attrObj[attrName].createComponentOfType;

                let shadowComponent = {
                  componentType: attributeComponentType,
                  downstreamDependencies: {
                    [target.componentName]: [
                      {
                        compositeName: component.componentName,
                        dependencyType: "referenceShadow",
                        propVariable: stateVariableToShadow
                      }
                    ]
                  }
                }

                attributesForReplacement[attrName] = {
                  component: shadowComponent
                }
              }


            }

            Object.assign(attributesForReplacement, attributesFromComposite)


            serializedReplacements.push({
              componentType: createComponentOfType,
              attributes: attributesForReplacement,
              downstreamDependencies: {
                [replacementSource.componentName]: [{
                  dependencyType: "referenceShadow",
                  compositeName: component.componentName,
                  propVariable,
                  additionalStateVariableShadowing: stateVariablesShadowingStateVariables
                }]
              },
              uniqueIdentifier,
            })
          } else {
            // no link

            let attributesForReplacement = {};

            if (attributeComponentsShadowingStateVariables) {
              let additionalAttributes = {};
              for (let attrName in attributeComponentsShadowingStateVariables) {
                let vName = attributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
                let attributeStateVarObj = target.state[vName];
                let attributeValue = await attributeStateVarObj.value;
                if (attributeStateVarObj.isArray) {
                  // Assume attribute has same dimensions as original
                  // TODO: multidimensional arrays?
                  attributeValue = attributeValue[attributeStateVarObj.keyToIndex[arrayKey]]
                }
                if (!target.state[vName].usedDefault) {
                  additionalAttributes[attrName] = attributeValue;
                }
              }

              let attributesFromComponent = convertAttributesForComponentType({
                attributes: additionalAttributes,
                componentType: createComponentOfType,
                componentInfoObjects,
                flags
              });

              if (stateVarObj.shadowingInstructions.attributeComponentsToShadow) {
                for (let attrName of stateVarObj.shadowingInstructions.attributeComponentsToShadow) {
                  if (target.attributes[attrName]?.component) {
                    attributesFromComponent[attrName] = { component: await target.attributes[attrName]?.component.serialize({ copyAll: true, copyVariants: true }) }

                  }
                }
              }

              Object.assign(attributesForReplacement, attributesFromComponent)

            }

            Object.assign(attributesForReplacement, attributesFromComposite)


            let primaryStateVariableForDefinition = "value";
            let componentClass = componentInfoObjects.allComponentClasses[createComponentOfType];
            if (componentClass.primaryStateVariableForDefinition) {
              primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
            }


            let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
            if (!Array.isArray(arrayIndex)) {
              arrayIndex = [arrayIndex]
            }
            let propStateValue = await arrayStateVarObj.value;
            for (let ind2 of arrayIndex) {
              propStateValue = propStateValue[ind2];
            }

            let serializedComponent = {
              componentType: createComponentOfType,
              attributes: attributesForReplacement,
              state: {
                [primaryStateVariableForDefinition]: propStateValue
              },
              uniqueIdentifier,
            }

            serializedReplacements.push(serializedComponent);

          }

        } else {
          // didn't match an array key, so just add an empty component of createComponentOfType
          let uniqueIdentifierBase = createComponentOfType + "|empty";
          let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

          serializedReplacements.push({
            componentType: createComponentOfType,
            uniqueIdentifier,
          })
        }
      }
    } else {
      // have wrapping components

      let createReplacementPiece = async function (subArrayKeys, nDimensionsLeft) {

        let pieces = [];
        let propVariablesCopiedByPiece = [];

        if (nDimensionsLeft > 1) {
          // since nDimensionsLeft > 1, each component of subArray should be an array
          for (let subSubArrayKeys of subArrayKeys) {
            // recurse down to previous dimension
            let result = await createReplacementPiece(subSubArrayKeys, nDimensionsLeft - 1);
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

            let createComponentOfType = arrayStateVarObj.shadowingInstructions.createComponentOfType;
            if (Array.isArray(createComponentOfType)) {
              // TODO: multidimensional arrays?
              createComponentOfType = createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)];
            }

            let attributeComponentsShadowingStateVariables;
            if (arrayStateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
              attributeComponentsShadowingStateVariables = {};
  
              for (let attrName in arrayStateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
                let stateVariableToShadow = arrayStateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
  
                let sObj = target.state[stateVariableToShadow];
                if (sObj.isArray) {
                  stateVariableToShadow = sObj.arrayVarNameFromArrayKey(arrayKey);
                }
  
                attributeComponentsShadowingStateVariables[attrName] = {
                  stateVariableToShadow
                }
              }
            }

            let stateVariablesShadowingStateVariables;
            if (arrayStateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables) {
              stateVariablesShadowingStateVariables = {};
  
              for (let attrName in arrayStateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables) {
                let stateVariableToShadow = arrayStateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables[attrName].stateVariableToShadow;
  
                let sObj = target.state[stateVariableToShadow];
                if (sObj.isArray) {
                  stateVariableToShadow = sObj.arrayVarNameFromArrayKey(arrayKey);
                }
  
                stateVariablesShadowingStateVariables[attrName] = {
                  stateVariableToShadow
                }
              }
            }

            if (link) {

              let attributesForReplacement = {};

              if (attributeComponentsShadowingStateVariables) {
                let classOfComponentToCreate = componentInfoObjects.allComponentClasses[createComponentOfType];
                let attrObj = classOfComponentToCreate.createAttributesObject();

                for (let attrName in attributeComponentsShadowingStateVariables) {
                  let stateVariableToShadow = attributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
                  let attributeComponentType = attrObj[attrName].createComponentOfType;

                  let shadowComponent = {
                    componentType: attributeComponentType,
                    downstreamDependencies: {
                      [target.componentName]: [
                        {
                          compositeName: component.componentName,
                          dependencyType: "referenceShadow",
                          propVariable: stateVariableToShadow
                        }
                      ]
                    }
                  }

                  attributesForReplacement[attrName] = {
                    component: shadowComponent
                  }
                }

              }

              pieces.push({
                componentType: createComponentOfType,
                attributes: attributesForReplacement,
                downstreamDependencies: {
                  [replacementSource.componentName]: [{
                    dependencyType: "referenceShadow",
                    compositeName: component.componentName,
                    propVariable,
                    additionalStateVariableShadowing: stateVariablesShadowingStateVariables
                  }]
                },
                uniqueIdentifier,
              })
            } else {


              let attributesForReplacement = {};

              if (attributeComponentsShadowingStateVariables) {
                let additionalAttributes = {};
                for (let attrName in attributeComponentsShadowingStateVariables) {
                  let vName = attributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
                  let attributeStateVarObj = target.state[vName];
                  let attributeValue = await attributeStateVarObj.value;
                  if (attributeStateVarObj.isArray) {
                    // Assume attribute has same dimensions as original
                    // TODO: multidimensional arrays?
                    attributeValue = attributeValue[attributeStateVarObj.keyToIndex[arrayKey]]
                  }
                  if (!target.state[vName].usedDefault) {
                    additionalAttributes[attrName] = attributeValue;
                  }
                }

                let attributesFromComponent = convertAttributesForComponentType({
                  attributes: additionalAttributes,
                  componentType: createComponentOfType,
                  componentInfoObjects,
                  flags
                });

                if (stateVarObj.shadowingInstructions.attributeComponentsToShadow) {
                  for (let attrName of stateVarObj.shadowingInstructions.attributeComponentsToShadow) {
                    if (target.attributes[attrName]?.component) {
                      attributesFromComponent[attrName] = { component: await target.attributes[attrName]?.component.serialize({ copyAll: true, copyVariants: true }) }

                    }
                  }
                }

                Object.assign(attributesForReplacement, attributesFromComponent)

              }


              let primaryStateVariableForDefinition = "value";
              let componentClass = componentInfoObjects.allComponentClasses[createComponentOfType];
              if (componentClass.primaryStateVariableForDefinition) {
                primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
              }


              let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
              if (!Array.isArray(arrayIndex)) {
                arrayIndex = [arrayIndex]
              }

              let propStateValue = await arrayStateVarObj.value;
              for (let ind of arrayIndex) {
                propStateValue = propStateValue[ind];
              }


              let serializedComponent = {
                componentType: createComponentOfType,
                attributes: attributesForReplacement,
                state: {
                  [primaryStateVariableForDefinition]: propStateValue
                },
                uniqueIdentifier,
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

      let result = await createReplacementPiece(unflattenedArrayKeys, stateVarObj.nDimensions);

      let newReplacements = result.pieces;
      propVariablesCopiedByReplacement = result.propVariablesCopiedByPiece;


      // add downstream dependencies and attributes to top level replacements
      // (which are wrappers, so didn't get downstream dependencies originally)
      for (let replacement of newReplacements) {
        if (typeof replacement !== "object") {
          continue;
        }

        if (!replacement.attributes) {
          replacement.attributes = {};
        }

        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: replacement.componentType,
          componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
          flags
        });

        Object.assign(replacement.attributes, attributesFromComposite)

        if (link) {
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


          let createComponentOfType;
          let wrapCs = wrappingComponents[0];
          let wrapDoenetAttributes;
          if (wrapCs && wrapCs.length > 0) {
            if (typeof wrapCs[0] === "object") {
              createComponentOfType = wrapCs[0].componentType;
              wrapDoenetAttributes = Object.assign({}, wrapCs[0].doenetAttributes);
            } else {
              createComponentOfType = wrapCs[0];
            }
          } else {
            createComponentOfType = arrayStateVarObj.shadowingInstructions.createComponentOfType;
            if (Array.isArray(createComponentOfType)) {
              // TODO: multidimensional arrays?
              if (stateVarObj.isArrayEntry) {
                createComponentOfType = createComponentOfType[arrayStateVarObj.keyToIndex(arrayKeys[ind])];
              } else {
                createComponentOfType = createComponentOfType[ind];
              }
            }
          }

          // just add an empty component of createComponentOfType

          let uniqueIdentifierBase = createComponentOfType + "|empty";
          let uniqueIdentifier = getUniqueIdentifierFromBase(uniqueIdentifierBase, uniqueIdentifiersUsed);

          let newReplacement = {
            componentType: createComponentOfType,
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
    // not an array or array entry

    if (stateVarObj.shadowingInstructions?.hasVariableComponentType) {
      // evaluate stateVarObj to make sure createComponentOfType is calculated and up-to-date
      await stateVarObj.value;
    }

    if (!stateVarObj.shadowingInstructions?.createComponentOfType) {
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

    if (stateVarObj.shadowingInstructions.createComponentOfType === "string") {
      serializedReplacements.push(await stateVarObj.value);
    } else {

      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: stateVarObj.shadowingInstructions.createComponentOfType,
        componentInfoObjects,
        compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace,
        flags
      });

      if (link) {

        let attributesForReplacement = {};

        if (stateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
          let classOfComponentToCreate = componentInfoObjects.allComponentClasses[stateVarObj.shadowingInstructions.createComponentOfType];
          let attrObj = classOfComponentToCreate.createAttributesObject();

          for (let attrName in stateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
            let stateVariableToShadow = stateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
            let attributeComponentType = attrObj[attrName].createComponentOfType;

            let shadowComponent = {
              componentType: attributeComponentType,
              downstreamDependencies: {
                [target.componentName]: [
                  {
                    compositeName: component.componentName,
                    dependencyType: "referenceShadow",
                    propVariable: stateVariableToShadow
                  }
                ]
              }
            }

            attributesForReplacement[attrName] = {
              component: shadowComponent
            }
          }

        }

        Object.assign(attributesForReplacement, attributesFromComposite)


        serializedReplacements.push({
          componentType: stateVarObj.shadowingInstructions.createComponentOfType,
          attributes: attributesForReplacement,
          downstreamDependencies: {
            [target.componentName]: [{
              dependencyType: "referenceShadow",
              compositeName: component.componentName,
              propVariable: varName,
              additionalStateVariableShadowing: stateVarObj.shadowingInstructions.addStateVariablesShadowingStateVariables
            }]
          },
          uniqueIdentifier,
        })

      } else {

        let attributesForReplacement = {};

        if (stateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
          let additionalAttributes = {};
          for (let attrName in stateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables) {
            let vName = stateVarObj.shadowingInstructions.addAttributeComponentsShadowingStateVariables[attrName].stateVariableToShadow;
            let attributeValue = await target.state[vName].value;
            if (!target.state[vName].usedDefault) {
              additionalAttributes[attrName] = attributeValue;
            }
          }

          let attributesFromComponent = convertAttributesForComponentType({
            attributes: additionalAttributes,
            componentType: stateVarObj.shadowingInstructions.createComponentOfType,
            componentInfoObjects,
            flags
          });

          if (stateVarObj.shadowingInstructions.attributeComponentsToShadow) {
            for (let attrName of stateVarObj.shadowingInstructions.attributeComponentsToShadow) {
              if (target.attributes[attrName]?.component) {
                attributesFromComponent[attrName] = { component: await target.attributes[attrName]?.component.serialize({ copyAll: true, copyVariants: true }) }

              }
            }
          }

          Object.assign(attributesForReplacement, attributesFromComponent)

        }

        Object.assign(attributesForReplacement, attributesFromComposite)


        let primaryStateVariableForDefinition = "value";
        let componentClass = componentInfoObjects.allComponentClasses[stateVarObj.shadowingInstructions.createComponentOfType];
        if (componentClass.primaryStateVariableForDefinition) {
          primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
        }


        let serializedComponent = {
          componentType: stateVarObj.shadowingInstructions.createComponentOfType,
          attributes: attributesForReplacement,
          state: {
            [primaryStateVariableForDefinition]: stateVarValue
          },
          uniqueIdentifier,
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
