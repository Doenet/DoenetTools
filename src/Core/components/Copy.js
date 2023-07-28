import CompositeComponent from "./abstract/CompositeComponent";
import * as serializeFunctions from "../utils/serializedStateProcessing";
import {
  convertAttributesForComponentType,
  postProcessCopy,
  verifyReplacementsMatchSpecifiedType,
} from "../utils/copy";
import { flattenDeep, flattenLevels } from "../utils/array";
import { getUniqueIdentifierFromBase } from "../utils/naming";
import { deepClone } from "../utils/deepFunctions";

export default class Copy extends CompositeComponent {
  static componentType = "copy";

  static excludeFromSchema = true;

  static assignNamesToReplacements = true;

  static acceptTarget = true;
  static acceptAnyAttribute = true;

  static includeBlankStringChildren = true;

  static stateVariableToEvaluateAfterReplacements =
    "needsReplacementsUpdatedWhenStale";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    // delete off attributes from base component that should apply to replacements instead
    // (using acceptAnyAttribute)
    delete attributes.disabled;
    delete attributes.modifyIndirectly;
    delete attributes.fixed;
    delete attributes.styleNumber;
    delete attributes.isResponse;
    delete attributes.hide;

    attributes.assignNewNamespaces = {
      createPrimitiveOfType: "boolean",
    };
    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number",
    };
    attributes.prop = {
      createPrimitiveOfType: "string",
      excludeFromSchema: true,
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
    attributes.numComponents = {
      createPrimitiveOfType: "number",
    };
    attributes.componentIndex = {
      createComponentOfType: "integer",
      createStateVariable: "componentIndex",
      defaultValue: null,
      public: true,
      excludeFromSchema: true,
    };
    attributes.sourceSubnames = {
      createPrimitiveOfType: "stringArray",
      createStateVariable: "targetSubnames",
      defaultValue: null,
      public: true,
      excludeFromSchema: true,
    };
    attributes.sourceSubnamesComponentIndex = {
      createComponentOfType: "numberList",
      createStateVariable: "targetSubnamesComponentIndex",
      defaultValue: null,
      public: true,
      excludeFromSchema: true,
    };
    attributes.propIndex = {
      createComponentOfType: "numberList",
      createStateVariable: "propIndex",
      defaultValue: null,
      public: true,
      excludeFromSchema: true,
    };
    attributes.uri = {
      createPrimitiveOfType: "string",
      createStateVariable: "uri",
      defaultValue: null,
      public: true,
    };
    attributes.sourceAttributesToIgnore = {
      createPrimitiveOfType: "stringArray",
      createStateVariable: "sourceAttributesToIgnore",
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
    };

    attributes.asList = {
      createPrimitiveOfType: "boolean",
      createStateVariable: "asList",
      defaultValue: true,
    };

    return attributes;
  }

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    } else {
      return Object.keys(serializedComponent.children);
    }
  }

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.target = {
      returnDependencies: () => ({
        target: {
          dependencyType: "doenetAttribute",
          attributeName: "target",
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: { target: dependencyValues.target },
      }),
    };

    stateVariableDefinitions.targetSourcesName = {
      additionalStateVariablesDefined: [
        {
          variableName: "sourcesChildNumber",
          hasEssential: true,
          shadowVariable: true,
        },
      ],
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
            value: theMapping.childNumber,
          },
        };
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
        };
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
          },
        };
      },
      definition: function ({ dependencyValues }) {
        let targetSources = dependencyValues.targetSourcesComponent;
        if (!targetSources) {
          targetSources = null;
        }
        return { setValue: { targetSources } };
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
        };
      },
      definition: function ({ dependencyValues }) {
        let sourceIndex = dependencyValues.sourceIndex;
        if (sourceIndex === undefined) {
          sourceIndex = null;
        }
        return {
          setValue: { sourceIndex },
          setEssentialValue: { sourceIndex },
        };
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
              variableName: "childIdentities",
            },
            sourcesChildNumber: {
              dependencyType: "stateVariable",
              variableName: "sourcesChildNumber",
            },
          };
        }

        return {
          targetComponent: {
            dependencyType: "targetComponent",
          },
        };
      },
      definition: function ({ dependencyValues }) {
        let targetComponent = null;
        if (dependencyValues.targetSourcesChildren) {
          targetComponent =
            dependencyValues.targetSourcesChildren[
              dependencyValues.sourcesChildNumber
            ];
          if (!targetComponent) {
            targetComponent = null;
          }
        } else if (dependencyValues.targetComponent) {
          targetComponent = dependencyValues.targetComponent;
        }

        return {
          setValue: { targetComponent },
        };
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
              variableName: "isInactiveCompositeReplacement",
            },
          };
        } else {
          return {};
        }
      },
      definition: function ({ dependencyValues }) {
        return {
          setValue: {
            targetInactive: Boolean(
              dependencyValues.targetIsInactiveCompositeReplacement,
            ),
          },
        };
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
        if (
          !dependencyValues.uri ||
          dependencyValues.uri.substring(0, 7).toLowerCase() !== "doenet:"
        ) {
          return {
            setValue: { cid: null, doenetId: null },
          };
        }

        let cid = null,
          doenetId = null;

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
          variableName: "cid",
        },
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true,
        },
      }),
      definition: function ({ dependencyValues }) {
        if (!dependencyValues.cid) {
          return {
            setValue: { serializedComponentsForCid: null },
          };
        }
        if (!(dependencyValues.serializedChildren?.length > 0)) {
          return {
            setValue: { serializedComponentsForCid: null },
          };
        }

        return {
          setValue: {
            serializedComponentsForCid: dependencyValues.serializedChildren,
          },
        };
      },
    };

    stateVariableDefinitions.propName = {
      shadowVariable: true,
      returnDependencies: () => ({
        propName: {
          dependencyType: "attributePrimitive",
          attributeName: "prop",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { setValue: { propName: dependencyValues.propName } };
      },
    };

    stateVariableDefinitions.linkAttrForDetermineDeps = {
      returnDependencies: () => ({
        linkAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "link",
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
      },
    };

    stateVariableDefinitions.replacementSourceIdentities = {
      stateVariablesDeterminingDependencies: [
        "targetComponent",
        "componentIndex",
        "propName",
        "targetSubnames",
        "targetSubnamesComponentIndex",
        "obtainPropFromComposite",
        "linkAttrForDetermineDeps",
      ],
      additionalStateVariablesDefined: ["addLevelToAssignNames"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {
        let dependencies = {};

        let addLevelToAssignNames = false;
        let useReplacements = false;

        if (stateValues.targetComponent !== null) {
          dependencies.targetComponentNewNamespace = {
            dependencyType: "attributePrimitive",
            parentName: stateValues.targetComponent.componentName,
            attributeName: "newNamespace",
          };

          if (
            stateValues.targetComponent.componentType === "copy" ||
            stateValues.targetComponent.componentType === "extract" ||
            (componentInfoObjects.isCompositeComponent({
              componentType: stateValues.targetComponent.componentType,
              includeNonStandard: true,
            }) &&
              (stateValues.componentIndex !== null ||
                (stateValues.propName && !stateValues.obtainPropFromComposite)))
          ) {
            // If the target is a copy or extract (no matter what),
            // then we'll use replacements (if link attribute is not set to false),
            // which means we cannot obtainPropFromComposite for a copy.
            // For any other composite, we'll use replacements (if link attribute is not set to false)
            // only if we're getting a component index or a prop that is not from the composite.
            // If link attribute was set to false, then we don't use replacements, but add a level to assignNames
            // so that assignNames acts the same way as the linked case
            // (i.e., assignNames skips the composite we're not bypassing).
            // TODO: the behavior of unlinked needs more investigation and documentation,
            // including why linkAttrForDetermineDeps,
            // which is used only here, is different from the link state variable
            // that is adjusted for modules/external content, below

            if (stateValues.linkAttrForDetermineDeps) {
              useReplacements = true;
              let targetSubnamesComponentIndex =
                stateValues.targetSubnamesComponentIndex;
              if (targetSubnamesComponentIndex) {
                targetSubnamesComponentIndex = [
                  ...targetSubnamesComponentIndex,
                ];
              }

              // Note: it is possible that we have more than one target
              // for the case where we have a prop and a composite target
              dependencies.targets = {
                dependencyType: "replacement",
                compositeName: stateValues.targetComponent.componentName,
                recursive: true,
                componentIndex: stateValues.componentIndex,
                targetSubnames: stateValues.targetSubnames,
                targetSubnamesComponentIndex,
              };
            } else {
              addLevelToAssignNames = true;
            }
          }

          if (
            !useReplacements &&
            (stateValues.componentIndex === null ||
              stateValues.componentIndex === 1)
          ) {
            // if we don't have a composite, componentIndex can only match if it is 1
            dependencies.targets = {
              dependencyType: "stateVariable",
              variableName: "targetComponent",
            };
          }
        }

        dependencies.addLevelToAssignNames = {
          dependencyType: "value",
          value: addLevelToAssignNames,
        };

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
            addLevelToAssignNames: dependencyValues.addLevelToAssignNames,
          },
        };
      },
    };

    // In some cases, we will add an implicit prop to a copy that does
    // not already have a prop.
    // The potential implicit prop is given by state variableForImplicitProp
    // variable on a component class.
    // There are two reasons for adding an implicit prop:
    // 1. To automatically create a different component type than the source type
    //    such as a mathinput automatically giving a math based on its value.
    //    One must specify the createComponentOfType attribute to counteract this.
    // 2. To make an more efficient copy that does not copy all the children
    //    (and hence cause the component to recalculate state variables from children).
    //    For example, when copying a <math>, if we know the children aren't needed,
    //    then we want to avoid reparsing the children to create the math
    //    and just copy the source's value state variable.
    stateVariableDefinitions.implicitProp = {
      stateVariablesDeterminingDependencies: [
        "replacementSourceIdentities",
        "propName",
      ],
      returnDependencies({ stateValues }) {
        let dependencies = {
          propName: {
            dependencyType: "stateVariable",
            variableName: "propName",
          },
        };

        if (!stateValues.propName) {
          dependencies.replacementSourceIdentities = {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities",
          };
          dependencies.typeAttr = {
            dependencyType: "attributePrimitive",
            attributeName: "createComponentOfType",
          };
          dependencies.noAttributesOrProp = {
            dependencyType: "doenetAttribute",
            attributeName: "noAttributesOrProp",
          };
          if (stateValues.replacementSourceIdentities?.length > 0) {
            // since know we don't have a propName, then there can be only one source
            let source = stateValues.replacementSourceIdentities[0];
            dependencies[`newNamespaceSource`] = {
              dependencyType: "attributePrimitive",
              parentName: source.componentName,
              attributeName: "newNamespace",
            };
          }
        }

        return dependencies;
      },
      definition({ dependencyValues, componentInfoObjects }) {
        if (
          dependencyValues.propName ||
          !(dependencyValues.replacementSourceIdentities?.length > 0)
        ) {
          return { setValue: { implicitProp: null } };
        }

        let source = dependencyValues.replacementSourceIdentities[0];

        let variableForImplicitProp =
          componentInfoObjects.allComponentClasses[source.componentType]
            .variableForImplicitProp;

        if (!variableForImplicitProp) {
          return { setValue: { implicitProp: null } };
        }

        if (dependencyValues.typeAttr) {
          // if specify createComponentOfType (which can occur either through
          // specifying the createComponentOfType attribute directly or using the copySource form)
          // and the variableForImplicitProp doesn't match that componentType
          // then we won't create an implicit type.
          // (Exception: if the componentType of variableForImplicitProp is undefined, we allow an implicit type)

          let componentTypeFromAttr =
            componentInfoObjects.componentTypeLowerCaseMapping[
              dependencyValues.typeAttr.toLowerCase()
            ];

          // if createComponentOfType matches the source's componentType,
          // we'll allow implicit prop only if implicitPropReturnsSameType is set
          if (componentTypeFromAttr === source.componentType) {
            if (
              !componentInfoObjects.allComponentClasses[source.componentType]
                .implicitPropReturnsSameType
            ) {
              return { setValue: { implicitProp: null } };
            }
          }

          let varInfo =
            componentInfoObjects.publicStateVariableInfo[source.componentType]
              .stateVariableDescriptions[variableForImplicitProp];

          if (
            varInfo.createComponentOfType !== undefined &&
            varInfo.createComponentOfType !== componentTypeFromAttr
          ) {
            return { setValue: { implicitProp: null } };
          }
        }

        // We have a variableForImplicitProp and no typeAttr

        let implicitPropReturnsSameType =
          componentInfoObjects.allComponentClasses[source.componentType]
            .implicitPropReturnsSameType;

        // if the plain copy is returning the same type,
        // then we shouldn't take the shortut of using the implicit prop
        // if the source has a newNamespace or the copy has attributes.
        // If either of those are true, then the state variables could
        // need to be recalculated from the children using new attributes
        // or another component could reference one of the copied children by name,
        // so we should include the children in the copy
        // (i.e., not use an implicitProp)
        if (
          implicitPropReturnsSameType &&
          (dependencyValues.newNamespaceSource ||
            !dependencyValues.noAttributesOrProp)
        ) {
          return { setValue: { implicitProp: null } };
        }

        return { setValue: { implicitProp: variableForImplicitProp } };
      },
    };

    // replacementSources adds the value of the state variable from prop
    // to the replacement sources.
    // It also adds the implicit prop if it is specified.
    stateVariableDefinitions.replacementSources = {
      stateVariablesDeterminingDependencies: [
        "replacementSourceIdentities",
        "propName",
        "propIndex",
        "implicitProp",
      ],
      additionalStateVariablesDefined: ["effectivePropNameBySource"],
      returnDependencies: function ({ stateValues }) {
        let dependencies = {
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities",
          },
          propIndex: {
            dependencyType: "stateVariable",
            variableName: "propIndex",
          },
        };

        if (!stateValues.propName && stateValues.propIndex !== null) {
          throw Error(
            `You cannot specify a propIndex without specifying a prop.`,
          );
        }

        if (stateValues.replacementSourceIdentities !== null) {
          for (let [
            ind,
            source,
          ] of stateValues.replacementSourceIdentities.entries()) {
            let thisPropName = stateValues.propName;

            if (stateValues.implicitProp) {
              thisPropName = stateValues.implicitProp;
            }

            let thisTarget;

            if (thisPropName) {
              dependencies["propName" + ind] = {
                dependencyType: "value",
                value: thisPropName,
              };

              let propIndex = stateValues.propIndex;
              if (propIndex) {
                // make propIndex be a shallow copy
                // so that can detect if it changed
                // when update dependencies
                propIndex = [...propIndex];
              }
              thisTarget = {
                dependencyType: "stateVariable",
                componentName: source.componentName,
                variableName: thisPropName,
                returnAsComponentObject: true,
                variablesOptional: true,
                propIndex,
                caseInsensitiveVariableMatch: true,
                publicStateVariablesOnly: true,
                useMappedVariableNames: true,
              };
            } else {
              thisTarget = {
                dependencyType: "componentIdentity",
                componentName: source.componentName,
              };
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
                propName = "__prop_name_not_found";
              }
              effectivePropNameBySource.push(propName);
            }
          }
        }

        return { setValue: { replacementSources, effectivePropNameBySource } };
      },
    };

    stateVariableDefinitions.numComponentsSpecified = {
      returnDependencies: () => ({
        numComponentsAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "numComponents",
        },
        typeAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "createComponentOfType",
        },
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let numComponentsSpecified;

        if (dependencyValues.typeAttr) {
          let componentType =
            componentInfoObjects.componentTypeLowerCaseMapping[
              dependencyValues.typeAttr.toLowerCase()
            ];

          if (!(componentType in componentInfoObjects.allComponentClasses)) {
            throw Error(
              `Invalid componentType ${dependencyValues.typeAttr} of copy.`,
            );
          }
          if (dependencyValues.numComponentsAttr !== null) {
            numComponentsSpecified = dependencyValues.numComponentsAttr;
          } else {
            numComponentsSpecified = 1;
          }
        } else if (dependencyValues.numComponentsAttr !== null) {
          throw Error(
            `You must specify createComponentOfType when specifying numComponents for a copy.`,
          );
        } else {
          numComponentsSpecified = null;
        }

        return { setValue: { numComponentsSpecified } };
      },
    };

    stateVariableDefinitions.link = {
      returnDependencies: () => ({
        linkAttr: {
          dependencyType: "attributePrimitive",
          attributeName: "link",
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
          if (
            dependencyValues.serializedComponentsForCid ||
            (dependencyValues.replacementSourceIdentities &&
              dependencyValues.replacementSourceIdentities.some((x) =>
                componentInfoObjects.isInheritedComponentType({
                  inheritedComponentType: x.componentType,
                  baseComponentType: "module",
                }),
              ))
          ) {
            link = false;
          } else {
            link = true;
          }
        } else {
          link = dependencyValues.linkAttr !== false;
        }

        return { setValue: { link } };
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      stateVariablesDeterminingDependencies: [
        "targetComponent",
        "propName",
        "obtainPropFromComposite",
        "link",
      ],
      returnDependencies({ stateValues, componentInfoObjects }) {
        let dependencies = {
          targetComponent: {
            dependencyType: "stateVariable",
            variableName: "targetComponent",
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
          stateValues.targetComponent &&
          componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false,
          }) &&
          !(stateValues.propName && stateValues.obtainPropFromComposite)
        ) {
          dependencies.targetReadyToExpandWhenResolved = {
            dependencyType: "stateVariable",
            componentName: stateValues.targetComponent.componentName,
            variableName: "readyToExpandWhenResolved",
          };
        }

        // since will be creating complete replacement when expand,
        // make sure all replacement sources are resolved
        if (!stateValues.link) {
          dependencies.replacementSources = {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          };
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
        "replacementSourceIdentities",
        "effectivePropNameBySource",
        "propName",
        "obtainPropFromComposite",
        "link",
        "removeEmptyArrayEntries",
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {
        // if don't link, never update replacements
        if (!stateValues.link) {
          return {};
        }

        let dependencies = {
          targetComponent: {
            dependencyType: "stateVariable",
            variableName: "targetComponent",
          },
          targetInactive: {
            dependencyType: "stateVariable",
            variableName: "targetInactive",
          },
          replacementSourceIdentities: {
            dependencyType: "stateVariable",
            variableName: "replacementSourceIdentities",
          },
          propIndex: {
            dependencyType: "stateVariable",
            variableName: "propIndex",
          },
        };

        if (stateValues.effectivePropNameBySource !== null) {
          for (let [
            ind,
            propName,
          ] of stateValues.effectivePropNameBySource.entries()) {
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
              };

              dependencies["sourceComponentType" + ind] = {
                dependencyType: "stateVariableComponentType",
                componentName: source.componentName,
                variableName: propName,
                variablesOptional: true,
                caseInsensitiveVariableMatch: true,
              };
            }
          }
        }

        if (
          stateValues.targetComponent !== null &&
          componentInfoObjects.isCompositeComponent({
            componentType: stateValues.targetComponent.componentType,
            includeNonStandard: false,
          }) &&
          !(stateValues.propName && stateValues.obtainPropFromComposite)
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
          };
        }

        if (stateValues.removeEmptyArrayEntries) {
          // if we are to remove empty array entries,
          // then we have to recalculate whenever replacement sources change
          dependencies.replacementSources = {
            dependencyType: "stateVariable",
            variableName: "replacementSources",
          };
        }

        return dependencies;
      },
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale() {
        return { updateReplacements: true };
      },
      definition: () => ({
        setValue: { needsReplacementsUpdatedWhenStale: true },
      }),
    };

    stateVariableDefinitions.effectiveAssignNames = {
      returnDependencies: () => ({
        assignNames: {
          dependencyType: "doenetAttribute",
          attributeName: "assignNames",
        },
        addLevelToAssignNames: {
          dependencyType: "stateVariable",
          variableName: "addLevelToAssignNames",
        },
      }),
      definition({ dependencyValues }) {
        let effectiveAssignNames = dependencyValues.assignNames;

        if (effectiveAssignNames && dependencyValues.addLevelToAssignNames) {
          effectiveAssignNames = [effectiveAssignNames];
        }

        return { setValue: { effectiveAssignNames } };
      },
    };

    return stateVariableDefinitions;
  }

  static async createSerializedReplacements({
    component,
    components,
    workspace,
    componentInfoObjects,

    resolveItem,
    publicCaseInsensitiveAliasSubstitutions,
  }) {
    // console.log(`create serialized replacements of ${component.componentName}`)

    // console.log(await component.stateValues.targetComponent);
    // console.log(await component.stateValues.effectivePropNameBySource);
    // console.log(await component.stateValues.replacementSources)

    let errors = [];
    let warnings = [];

    // evaluate numComponentsSpecified so get error if specify numComponents without createComponentOfType
    await component.stateValues.numComponentsSpecified;

    workspace.numReplacementsBySource = [];
    workspace.numNonStringReplacementsBySource = [];
    workspace.propVariablesCopiedBySource = [];
    workspace.sourceNames = [];
    workspace.uniqueIdentifiersUsedBySource = {};

    let newNamespace = component.attributes.newNamespace?.primitive;

    let compositeAttributesObj = this.createAttributesObject();

    let assignNames = await component.stateValues.effectiveAssignNames;

    let serializedComponentsForCid = await component.stateValues
      .serializedComponentsForCid;

    if (serializedComponentsForCid) {
      let replacements = deepClone([serializedComponentsForCid[0]]);

      let additionalChildren = deepClone(serializedComponentsForCid.slice(1));

      if (replacements[0].children) {
        let namespace;
        if (replacements[0].componentName) {
          namespace = replacements[0].componentName + "/";
        } else {
          namespace = replacements[0].originalName + "/";
        }

        if (component.doenetAttributes.keptNewNamespaceOfLastChild) {
          namespace = namespace.slice(0, namespace.length - 1);
          let lastSlash = namespace.lastIndexOf("/");
          namespace = namespace.slice(0, lastSlash + 1);
        }

        serializeFunctions.restrictTNamesToNamespace({
          components: replacements[0].children,
          namespace,
          invalidateReferencesToBaseNamespace:
            component.doenetAttributes.keptNewNamespaceOfLastChild,
        });
      }

      if (replacements[0].componentType === "externalContent") {
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
            componentInfoObjects,
            compositeAttributesObj,
            compositeCreatesNewNamespace: newNamespace,
          });

          for (let attrName in attributesFromComposite) {
            let attribute = attributesFromComposite[attrName];
            if (attribute.component) {
              serializeFunctions.setTNamesToAbsolute([attribute.component]);
            } else if (attribute.childrenForComponent) {
              serializeFunctions.setTNamesToAbsolute(
                attribute.childrenForComponent,
              );
            }
          }

          Object.assign(repl.attributes, attributesFromComposite);
        }
      } else {
        // if replacements[0] is not an externalContent, add attributes to replacements[0] itself
        if (!replacements[0].attributes) {
          replacements[0].attributes = {};
        }
        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: replacements[0].componentType,
          componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
        });

        for (let attrName in attributesFromComposite) {
          let attribute = attributesFromComposite[attrName];
          if (attribute.component) {
            serializeFunctions.setTNamesToAbsolute([attribute.component]);
          } else if (attribute.childrenForComponent) {
            serializeFunctions.setTNamesToAbsolute(
              attribute.childrenForComponent,
            );
          }
        }

        Object.assign(replacements[0].attributes, attributesFromComposite);
      }

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        assignNewNamespaces:
          component.attributes.assignNewNamespaces?.primitive,
        assignNamesForCompositeReplacement:
          component.doenetAttributes.assignNamesForCompositeReplacement,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });
      errors.push(...processResult.errors);
      warnings.push(...processResult.warnings);

      replacements = processResult.serializedComponents;

      // if have copyFromURI, then add additional children from the composite itself
      if (
        component.doenetAttributes.fromCopyFromURI &&
        additionalChildren.length > 0
      ) {
        let res = this.addChildrenFromComposite({
          replacements,
          children: additionalChildren,
          assignNewNamespaces:
            component.attributes.assignNewNamespaces?.primitive,
          componentInfoObjects,
        });
        errors.push(...res.errors);
        warnings.push(...res.warnings);
      }

      let verificationResult = await verifyReplacementsMatchSpecifiedType({
        component,
        replacements,
        assignNames,
        workspace,
        componentInfoObjects,
        compositeAttributesObj,

        components,
        publicCaseInsensitiveAliasSubstitutions,
      });
      errors.push(...verificationResult.errors);
      warnings.push(...verificationResult.warnings);

      return {
        replacements: verificationResult.replacements,
        errors,
        warnings,
      };
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
      });

      let replacements = [
        {
          componentType: "number",
          attributes: attributesFromComposite,
          state: { value: sourceIndex, fixed: true },
        },
      ];

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        assignNamesForCompositeReplacement:
          component.doenetAttributes.assignNamesForCompositeReplacement,
        serializedComponents: replacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects,
      });
      errors.push(...processResult.errors);
      warnings.push(...processResult.warnings);

      let verificationResult = await verifyReplacementsMatchSpecifiedType({
        component,
        replacements: processResult.serializedComponents,
        assignNames,
        workspace,
        componentInfoObjects,
        compositeAttributesObj,

        components,
        publicCaseInsensitiveAliasSubstitutions,
      });
      errors.push(...verificationResult.errors);
      warnings.push(...verificationResult.warnings);

      return {
        replacements: verificationResult.replacements,
        errors,
        warnings,
      };
    }

    let replacementSourceIdentities = await component.stateValues
      .replacementSourceIdentities;
    if (
      !(await component.stateValues.targetComponent) ||
      !replacementSourceIdentities
    ) {
      // no valid target, so no replacements
      let replacements = [];

      if (component.doenetAttributes.fromCopyTarget) {
        // even though don't have valid target,
        // if have copyTarget, then include children added directly to component

        let componentType =
          componentInfoObjects.componentTypeLowerCaseMapping[
            component.attributes.createComponentOfType.primitive.toLowerCase()
          ];

        let componentClass =
          componentInfoObjects.allComponentClasses[componentType];

        let attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType,
          componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
        });

        workspace.uniqueIdentifiersUsedBySource[0] = [];
        let uniqueIdentifierBase = componentType + "|empty";
        let uniqueIdentifier = getUniqueIdentifierFromBase(
          uniqueIdentifierBase,
          workspace.uniqueIdentifiersUsedBySource[0],
        );

        let children = deepClone(component.serializedChildren);
        if (!componentClass.includeBlankStringChildren) {
          children = children.filter(
            (x) => typeof x !== "string" || x.trim() !== "",
          );
        }

        let attributes = attributesFromComposite;
        if (component.attributes.assignNewNamespaces?.primitive) {
          attributes.newNamespace = { primitive: true };
        }

        replacements = [
          {
            componentType,
            attributes,
            children,
            uniqueIdentifier,
          },
        ];

        let processResult = serializeFunctions.processAssignNames({
          assignNames,
          assignNamesForCompositeReplacement:
            component.doenetAttributes.assignNamesForCompositeReplacement,
          serializedComponents: replacements,
          parentName: component.componentName,
          componentInfoObjects,
          originalNamesAreConsistent: true,
        });
        errors.push(...processResult.errors);
        warnings.push(...processResult.warnings);

        replacements = processResult.serializedComponents;

        workspace.numReplacementsBySource.push(replacements.length);
        workspace.numNonStringReplacementsBySource.push(
          replacements.filter((x) => typeof x !== "string").length,
        );
      }

      let verificationResult = await verifyReplacementsMatchSpecifiedType({
        component,
        replacements,
        assignNames,
        workspace,
        componentInfoObjects,
        compositeAttributesObj,
        components,
        publicCaseInsensitiveAliasSubstitutions,
      });
      errors.push(...verificationResult.errors);
      warnings.push(...verificationResult.warnings);

      return {
        replacements: verificationResult.replacements,
        errors,
        warnings,
      };
    }

    // resolve determine dependencies of replacementSources
    // and resolve recalculateDownstreamComponents of its target dependencies
    // so any array entry prop is created
    let resolveResult = await resolveItem({
      componentName: component.componentName,
      type: "determineDependencies",
      stateVariable: "replacementSources",
      dependency: "__determine_dependencies",
      expandComposites: false,
    });

    if (!resolveResult.success) {
      throw Error(
        `Couldn't resolve determineDependencies of replacementSources of ${component.componentName}`,
      );
    }

    let effectivePropNameBySource = await component.stateValues
      .effectivePropNameBySource;
    for (let ind in replacementSourceIdentities) {
      let thisPropName = effectivePropNameBySource[ind];

      if (thisPropName) {
        resolveResult = await resolveItem({
          componentName: component.componentName,
          type: "recalculateDownstreamComponents",
          stateVariable: "replacementSources",
          dependency: "target" + ind,
          expandComposites: false,
        });

        if (!resolveResult.success) {
          throw Error(
            `Couldn't resolve recalculateDownstreamComponents for target${ind} of replacementSources of ${component.componentName}`,
          );
        }
      }
    }

    if (!component.doenetAttributes.sourceIsProp) {
      let targetComponent =
        components[(await component.stateValues.targetComponent).componentName];
      let componentIndex = await component.stateValues.componentIndex;
      let targetSubnames = await component.stateValues.targetSubnames;
      if (
        targetComponent.doenetAttributes.sourceIsProp &&
        !componentIndex &&
        !targetSubnames
      ) {
        // We are copying a copy/extract of a prop (or a recursive copy of it).
        // Since we are a currently unable to consistently identify this case
        // when processing serialized state,
        // we (incorrectly) converted the name to be assignNames so that it applies to the replacement
        // rather than the copy itself, and then we gave this copy a randomly generated name.
        // Now that we have identified the targetComponent and see that it has sourceIsProp,
        // we implement a workaround of creating an extra copy component
        // that will act like this copy would have if we didn't convert the name and assignNames.
        // We add the sourceIsProp doenetAttribute to that copy both to prevent this
        // workaround from being applied again to that copy
        // and to trigger this workaround in case that copy is copied.

        // Copy all primitive attributes to make the extra copy behave like this copy
        let attributesForExtraCopy = {};
        for (let attrName in component.attributes) {
          if (!component.attributes[attrName].component) {
            attributesForExtraCopy[attrName] = JSON.parse(
              JSON.stringify(component.attributes[attrName]),
            );
          }
        }

        // The extra copy inherit's this copy's target (and will actually use it).
        let doenetAttributesForExtraCopy = {
          target: component.doenetAttributes.target,
          targetComponentName: component.doenetAttributes.targetComponentName,
          sourceIsProp: true,
          convertedAssignNames: true,
        };

        let substituteSerializedReplacements = [
          {
            componentType: "copy",
            attributes: attributesForExtraCopy,
            doenetAttributes: doenetAttributesForExtraCopy,
          },
        ];

        // processAssignNames will set the assignNames of the extra copy
        // to the original assignNames (before it was incorrectly converted)
        // and name the copy the original name
        // (that was converted to assignNamesForCompositeReplacement)
        let processResult = serializeFunctions.processAssignNames({
          assignNames,
          assignNamesForCompositeReplacement:
            component.doenetAttributes.assignNamesForCompositeReplacement,
          serializedComponents: substituteSerializedReplacements,
          parentName: component.componentName,
          componentInfoObjects,
        });

        return {
          replacements: processResult.serializedComponents,
          errors,
          warnings,
        };
      }
    }

    let replacements = [];

    let numReplacementsBySource = [];
    let numNonStringReplacementsBySource = [];
    let numReplacementsSoFar = 0;
    let numNonStringReplacementsSoFar = 0;

    for (let sourceNum in replacementSourceIdentities) {
      let uniqueIdentifiersUsed = (workspace.uniqueIdentifiersUsedBySource[
        sourceNum
      ] = []);

      let numComponentsForSource;

      if (component.attributes.createComponentOfType?.primitive) {
        let numComponentsTotal = await component.stateValues
          .numComponentsSpecified;
        let numSources = replacementSourceIdentities.length;

        // arbitrarily divide these components among the sources
        numComponentsForSource = Math.floor(numComponentsTotal / numSources);
        let nExtras = numComponentsTotal % numSources;
        if (sourceNum < nExtras) {
          numComponentsForSource++;
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
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,

        fromCopyTarget:
          Number(sourceNum) === 0 && component.doenetAttributes.fromCopyTarget,
      });
      errors.push(...results.errors);
      warnings.push(...results.warnings);

      workspace.propVariablesCopiedBySource[sourceNum] =
        results.propVariablesCopiedByReplacement;

      let sourceReplacements = results.serializedReplacements;
      numReplacementsBySource[sourceNum] = sourceReplacements.length;
      numNonStringReplacementsBySource[sourceNum] = sourceReplacements.filter(
        (x) => typeof x !== "string",
      ).length;
      numReplacementsSoFar += numReplacementsBySource[sourceNum];
      numNonStringReplacementsSoFar +=
        numNonStringReplacementsBySource[sourceNum];
      replacements.push(...sourceReplacements);
    }

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.numNonStringReplacementsBySource =
      numNonStringReplacementsBySource;
    workspace.sourceNames = replacementSourceIdentities.map(
      (x) => x.componentName,
    );

    let verificationResult = await verifyReplacementsMatchSpecifiedType({
      component,
      replacements,
      assignNames,
      workspace,
      componentInfoObjects,
      compositeAttributesObj,

      components,
      publicCaseInsensitiveAliasSubstitutions,
    });
    errors.push(...verificationResult.errors);
    warnings.push(...verificationResult.warnings);

    // console.log(`serialized replacements for ${component.componentName}`);
    // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)));

    return { replacements: verificationResult.replacements, errors, warnings };
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
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,

    fromCopyTarget,
  }) {
    // console.log(`create replacement for sourceNum ${sourceNum}`);
    // console.log(
    //   `propName: ${component.stateValues.effectivePropNameBySource[sourceNum]}`,
    // );

    let errors = [];
    let warnings = [];

    let replacementSource = (
      await component.stateValues.replacementSourceIdentities
    )[sourceNum];
    if (typeof replacementSource !== "object") {
      if (component.stateValues.effectivePropNameBySource[sourceNum]) {
        // Cannot get a prop off a non-object (e.g., off a string component)
        return { serializedReplacements: [], errors, warnings };
      } else {
        return {
          serializedReplacements: [replacementSource],
          errors,
          warnings,
        };
      }
    }
    let replacementSourceComponent =
      components[replacementSource.componentName];

    // if not linking or removing empty array entries,
    // then replacementSources is resolved,
    // which we need for state variable value
    let link = await component.stateValues.link;
    if (!link || (await component.stateValues.removeEmptyArrayEntries)) {
      replacementSource = (await component.stateValues.replacementSources)[
        sourceNum
      ];
    }

    let newNamespace = component.attributes.newNamespace?.primitive;

    let assignNames = await component.stateValues.effectiveAssignNames;

    // if creating copy from a prop
    // manually create the serialized component
    let propName = (await component.stateValues.effectivePropNameBySource)[
      sourceNum
    ];
    if (propName) {
      let results = await replacementFromProp({
        component,
        components,
        replacementSource,
        propName,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
      });
      errors.push(...results.errors);
      warnings.push(...results.warnings);

      let processResult = serializeFunctions.processAssignNames({
        assignNames,
        assignNamesForCompositeReplacement:
          component.doenetAttributes.assignNamesForCompositeReplacement,
        serializedComponents: results.serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        indOffset: numNonStringReplacementsSoFar,
        componentInfoObjects,
      });
      errors.push(...processResult.errors);
      warnings.push(...processResult.warnings);

      let serializedReplacements = processResult.serializedComponents;

      if (
        fromCopyTarget &&
        serializedReplacements.length === 1 &&
        component.serializedChildren.length > 0
      ) {
        let res = this.addChildrenFromComposite({
          replacements: serializedReplacements,
          children: component.serializedChildren,
          assignNewNamespaces:
            component.attributes.assignNewNamespaces?.primitive,
          componentInfoObjects,
        });
        errors.push(...res.errors);
        warnings.push(...res.warnings);
      }

      return {
        serializedReplacements,
        propVariablesCopiedByReplacement:
          results.propVariablesCopiedByReplacement,
        errors,
        warnings,
      };
    }

    // if creating copy directly from the target component,
    // create a serialized copy of the entire component

    let sourceAttributesToIgnore = await component.stateValues
      .sourceAttributesToIgnore;

    // a component that shadows a propVariable
    // (or shadows something that shadows a propVariable)
    // will not have enough infomation in its children to determine its state.
    // Therefore, we if are copying without linking, we'll also
    // need to copy the primary essential variable in this case.
    let copyPrimaryEssential = false;
    if (!link) {
      let comp = replacementSourceComponent;
      while (comp.shadows) {
        if (comp.shadows.propVariable) {
          copyPrimaryEssential = true;
          break;
        }
        comp = components[comp.shadows.componentName];
      }
    }

    let serializedReplacements;
    try {
      serializedReplacements = [
        await replacementSourceComponent.serialize({
          copyAll: !link,
          copyVariants: !link,
          primitiveSourceAttributesToIgnore: sourceAttributesToIgnore,
          copyPrimaryEssential,
          errorIfEncounterComponent: [component.componentName],
        }),
      ];
    } catch (e) {
      let message = "Circular dependency detected";
      if (component.attributes.createComponentOfType?.primitive) {
        message += ` involving <${component.attributes.createComponentOfType.primitive}> component`;
      }
      message += ".";
      serializedReplacements = [
        {
          componentType: "_error",
          state: { message },
        },
      ];
      errors.push({
        message,
      });
      return { serializedReplacements, errors, warnings };
    }

    // when copying with link=false, ignore fixed if from essential state
    // so that, for example, a copy from a sequence with link=false is not fixed
    if (!link && serializedReplacements[0].state?.fixed !== undefined) {
      delete serializedReplacements[0].state.fixed;
    }

    // console.log(`serializedReplacements for ${component.componentName}`);
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)));

    serializedReplacements = postProcessCopy({
      serializedComponents: serializedReplacements,
      componentName: component.componentName,
      uniqueIdentifiersUsed,
      addShadowDependencies: link,
      unlinkExternalCopies: !link,
    });

    if (serializedReplacements.length > 0) {
      delete serializedReplacements[0].doenetAttributes
        .haveNewNamespaceOnlyFromShadow;
    }

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
        dontSkipAttributes: ["asList"],
        compositeCreatesNewNamespace: newNamespace,
      });
      Object.assign(repl.attributes, attributesFromComposite);
    }

    if (
      serializedReplacements[0].attributes.newNamespace?.primitive &&
      !component.attributes.assignNewNamespaces?.primitive
    ) {
      serializedReplacements[0].doenetAttributes.haveNewNamespaceOnlyFromShadow = true;
    }

    let parentName = component.componentName;

    if (component.doenetAttributes.parentNameForAssignNames) {
      parentName = component.doenetAttributes.parentNameForAssignNames;
    }

    let compositesParentNameForAssignNames;
    if (await component.stateValues.addLevelToAssignNames) {
      compositesParentNameForAssignNames = parentName;
    }

    let processResult = serializeFunctions.processAssignNames({
      assignNames,
      assignNewNamespaces: component.attributes.assignNewNamespaces?.primitive,
      assignNamesForCompositeReplacement:
        component.doenetAttributes.assignNamesForCompositeReplacement,
      serializedComponents: serializedReplacements,
      parentName,
      parentCreatesNewNamespace: newNamespace,
      indOffset: numNonStringReplacementsSoFar,
      componentInfoObjects,
      originalNamesAreConsistent: newNamespace, // && !assignNames,
      compositesParentNameForAssignNames,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    serializedReplacements = processResult.serializedComponents;

    // if have copy target, then add additional children from the composite itself
    if (
      fromCopyTarget &&
      serializedReplacements.length === 1 &&
      component.serializedChildren.length > 0
    ) {
      let res = this.addChildrenFromComposite({
        replacements: serializedReplacements,
        children: component.serializedChildren,
        assignNewNamespaces:
          component.attributes.assignNewNamespaces?.primitive,
        componentInfoObjects,
      });
      errors.push(...res.errors);
      warnings.push(...res.warnings);
    }

    // console.log(`ending serializedReplacements for ${component.componentName}`);
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)));

    return { serializedReplacements, errors, warnings };
  }

  static addChildrenFromComposite({
    replacements,
    children,
    assignNewNamespaces,
    componentInfoObjects,
  }) {
    let errors = [];
    let warnings = [];

    let repl = replacements[0];
    if (!repl.children) {
      repl.children = [];
    }
    let newChildren = deepClone(children);
    let componentClass =
      componentInfoObjects.allComponentClasses[repl.componentType];

    if (!componentClass.includeBlankStringChildren) {
      newChildren = newChildren.filter(
        (x) => typeof x !== "string" || x.trim() !== "",
      );
    }

    if (
      replacements[0].attributes.newNamespace?.primitive &&
      assignNewNamespaces
    ) {
      // if the new components were added with a new namespace
      // and their parent had a new namespace
      // make the auto numbered component names include the names
      // from the original children so that don't have a name collision
      // from the autonumbering
      let componentCounts =
        serializeFunctions.countRegularComponentTypesInNamespace(repl.children);

      serializeFunctions.renameAutonameBasedOnNewCounts(
        newChildren,
        componentCounts,
      );
    }

    let processResult = serializeFunctions.processAssignNames({
      serializedComponents: newChildren,
      parentName: replacements[0].componentName,
      parentCreatesNewNamespace: assignNewNamespaces,
      componentInfoObjects,
      originalNamesAreConsistent: true,
    });
    errors.push(...processResult.errors);
    warnings.push(...processResult.warnings);

    if (
      replacements[0].attributes.newNamespace?.primitive &&
      !assignNewNamespaces
    ) {
      // the new components were added without a new namespace
      // even though their parent had a new namespace
      // The parent has already been marked as having a new namespace only because it is shadowing.
      // Mark them to ignore their parent's new namespace.
      // Then if the parent is copied directly,
      // the children won't be given a new namespace
      for (let comp of processResult.serializedComponents) {
        if (typeof comp === "object") {
          comp.doenetAttributes.ignoreParentNewNamespace = true;
        }
      }
    }

    repl.children.push(...processResult.serializedComponents);

    return { errors, warnings };
  }

  static async calculateReplacementChanges({
    component,
    componentChanges,
    components,
    workspace,
    componentInfoObjects,

    resolveItem,
    publicCaseInsensitiveAliasSubstitutions,
  }) {
    // console.log(
    //   "Calculating replacement changes for " + component.componentName,
    // );

    // TODO: don't yet have a way to return errors and warnings!
    let errors = [];
    let warnings = [];

    // if copying a cid, no changes
    if (await component.stateValues.serializedComponentsForCid) {
      return [];
    }

    // for indexAlias from a source, the replacements never change
    if ((await component.stateValues.sourceIndex) !== null) {
      return [];
    }

    if ((await component.stateValues.link) === false) {
      return [];
    }

    let compositeAttributesObj = this.createAttributesObject();

    let assignNames = await component.stateValues.effectiveAssignNames;

    let replacementSourceIdentities = await component.stateValues
      .replacementSourceIdentities;
    if (
      !(await component.stateValues.targetComponent) ||
      !replacementSourceIdentities
    ) {
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
          };
          replacementChanges.push(replacementInstruction);
        }

        let previousZeroSourceNames = workspace.sourceNames.length === 0;

        workspace.sourceNames = [];
        workspace.numReplacementsBySource = [];
        workspace.numNonStringReplacementsBySource = [];
        workspace.propVariablesCopiedBySource = [];

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
          component,
          replacementChanges,
          assignNames,
          workspace,
          componentInfoObjects,
          compositeAttributesObj,

          components,
          publicCaseInsensitiveAliasSubstitutions,
        });
        errors.push(...verificationResult.errors);
        warnings.push(...verificationResult.warnings);

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

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
          component,
          replacementChanges,
          assignNames,
          workspace,
          componentInfoObjects,
          compositeAttributesObj,

          components,
          publicCaseInsensitiveAliasSubstitutions,
        });
        errors.push(...verificationResult.errors);
        warnings.push(...verificationResult.warnings);

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
      expandComposites: false,
    });

    if (!resolveResult.success) {
      throw Error(
        `Couldn't resolve determineDependencies of replacementSources of ${component.componentName}`,
      );
    }

    let effectivePropNameBySource = await component.stateValues
      .effectivePropNameBySource;

    for (let ind in replacementSourceIdentities) {
      let thisPropName = effectivePropNameBySource[ind];

      if (thisPropName) {
        resolveResult = await resolveItem({
          componentName: component.componentName,
          type: "recalculateDownstreamComponents",
          stateVariable: "replacementSources",
          dependency: "target" + ind,
          expandComposites: false,
        });

        if (!resolveResult.success) {
          throw Error(
            `Couldn't resolve recalculateDownstreamComponents for target${ind} of replacementSources of ${component.componentName}`,
          );
        }
      }
    }

    if (!component.doenetAttributes.sourceIsProp) {
      let targetComponent =
        components[(await component.stateValues.targetComponent).componentName];
      let componentIndex = await component.stateValues.componentIndex;
      let targetSubnames = await component.stateValues.targetSubnames;
      if (
        targetComponent.doenetAttributes.sourceIsProp &&
        !componentIndex &&
        !targetSubnames
      ) {
        // The case where we added an extra copy as a workaround for sourceIsProp.
        // Any replacement changes will be handled by that copy,
        // so we ignored changes here.
        return [];
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

    let maxSourceLength = Math.max(
      replacementSourceIdentities.length,
      workspace.numReplacementsBySource.length,
    );

    let recreateRemaining = false;

    for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
      let numComponentsForSource;

      if (component.attributes.createComponentOfType?.primitive) {
        let numComponentsTotal = await component.stateValues
          .numComponentsSpecified;
        let numSources = replacementSourceIdentities.length;

        // arbitrarily divide these components among the sources
        numComponentsForSource = Math.floor(numComponentsTotal / numSources);
        let nExtras = numComponentsTotal % numSources;
        if (sourceNum < nExtras) {
          numComponentsForSource++;
        }
      }

      let replacementSource = replacementSourceIdentities[sourceNum];
      if (replacementSource === undefined) {
        if (workspace.numReplacementsBySource[sourceNum] > 0) {
          if (!recreateRemaining) {
            // since deleting replacement will shift the remaining replacements
            // and change resulting names,
            // delete all remaining and mark to be recreated

            let numberReplacementsLeft = workspace.numReplacementsBySource
              .slice(sourceNum)
              .reduce((a, c) => a + c, 0);

            if (numberReplacementsLeft > 0) {
              let replacementInstruction = {
                changeType: "delete",
                changeTopLevelReplacements: true,
                firstReplacementInd: numReplacementsSoFar,
                numberReplacementsToDelete: numberReplacementsLeft,
              };

              replacementChanges.push(replacementInstruction);
            }

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsBySource
              .slice(sourceNum)
              .forEach((v, i) => (workspace.numReplacementsBySource[i] = 0));
            workspace.numNonStringReplacementsBySource
              .slice(sourceNum)
              .forEach(
                (v, i) => (workspace.numNonStringReplacementsBySource[i] = 0),
              );
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
      let needToRecreate =
        prevSourceName === undefined ||
        replacementSource.componentName !== prevSourceName ||
        recreateRemaining;

      if (!needToRecreate) {
        // make sure the current replacements still shadow the replacement source
        for (
          let ind = 0;
          ind < workspace.numReplacementsBySource[sourceNum];
          ind++
        ) {
          let currentReplacement =
            component.replacements[numReplacementsSoFar + ind];
          if (!currentReplacement) {
            needToRecreate = true;
            break;
          } else if (
            !effectivePropNameBySource[sourceNum] &&
            currentReplacement.shadows?.componentName !==
              replacementSourceIdentities[sourceNum].componentName
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

        let uniqueIdentifiersUsed = (workspace.uniqueIdentifiersUsedBySource[
          sourceNum
        ] = []);
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
          numComponentsForSource,
          publicCaseInsensitiveAliasSubstitutions,
        });
        errors.push(...results.errors);
        warnings.push(...results.warnings);

        numReplacementsSoFar += results.numReplacements;
        numNonStringReplacementsSoFar += results.numNonStringReplacements;

        numReplacementsBySource[sourceNum] = results.numReplacements;
        numNonStringReplacementsBySource[sourceNum] =
          results.numNonStringReplacements;

        propVariablesCopiedBySource[sourceNum] =
          results.propVariablesCopiedByReplacement;

        let replacementInstruction = results.replacementInstruction;

        if (!recreateRemaining) {
          if (results.numReplacements !== prevNumReplacements) {
            // we changed the number of replacements which shifts remaining ones
            // since names won't match, we need to delete
            // all the remaining replacements and recreate them

            let numberReplacementsLeft = workspace.numReplacementsBySource
              .slice(sourceNum)
              .reduce((a, c) => a + c, 0);

            replacementInstruction.numberReplacementsToReplace =
              numberReplacementsLeft;

            recreateRemaining = true;

            // since deleted remaining, change in workspace
            // so that don't attempt to delete again
            workspace.numReplacementsBySource
              .slice(sourceNum)
              .forEach((v, i) => (workspace.numReplacementsBySource[i] = 0));
            workspace.numNonStringReplacementsBySource
              .slice(sourceNum)
              .forEach(
                (v, i) => (workspace.numNonStringReplacementsBySource[i] = 0),
              );
          }
        }

        replacementChanges.push(replacementInstruction);

        continue;
      }

      if (
        !effectivePropNameBySource[sourceNum] &&
        workspace.numReplacementsBySource[sourceNum] > 0
      ) {
        // if previously had replacements and target still isn't inactive
        // then don't check for changes if don't have a propName
        numReplacementsSoFar += workspace.numReplacementsBySource[sourceNum];
        numNonStringReplacementsSoFar +=
          workspace.numNonStringReplacementsBySource[sourceNum];
        numReplacementsBySource[sourceNum] =
          workspace.numReplacementsBySource[sourceNum];
        numNonStringReplacementsBySource[sourceNum] =
          workspace.numNonStringReplacementsBySource[sourceNum];
        continue;
      }

      // use new uniqueIdentifiersUsed
      // so will get the same names for pieces that match
      let uniqueIdentifiersUsed = (workspace.uniqueIdentifiersUsedBySource[
        sourceNum
      ] = []);

      let results = await this.createReplacementForSource({
        component,
        sourceNum,
        components,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        uniqueIdentifiersUsed,
        compositeAttributesObj,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        fromCopyTarget:
          Number(sourceNum) === 0 && component.doenetAttributes.fromCopyTarget,
      });
      errors.push(...results.errors);
      warnings.push(...results.warnings);

      let propVariablesCopiedByReplacement =
        results.propVariablesCopiedByReplacement;

      let newSerializedReplacements = results.serializedReplacements;

      let nNewReplacements = newSerializedReplacements.length;
      let nOldReplacements = workspace.numReplacementsBySource[sourceNum];

      if (nNewReplacements !== nOldReplacements) {
        // changing the number of replacements will shift the remaining replacements
        // and change resulting names,
        // delete all remaining and mark to be recreated

        let numberReplacementsLeft = workspace.numReplacementsBySource
          .slice(sourceNum)
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
        workspace.numReplacementsBySource
          .slice(sourceNum)
          .forEach((v, i) => (workspace.numReplacementsBySource[i] = 0));
        workspace.numNonStringReplacementsBySource
          .slice(sourceNum)
          .forEach(
            (v, i) => (workspace.numNonStringReplacementsBySource[i] = 0),
          );
      } else {
        let nonStringInd = 0;
        for (let ind = 0; ind < nNewReplacements; ind++) {
          let foundDifference =
            propVariablesCopiedByReplacement[ind].length !==
            workspace.propVariablesCopiedBySource[sourceNum][ind].length;
          let onlyDifferenceIsType = !foundDifference;
          if (!foundDifference) {
            if (
              workspace.propVariablesCopiedBySource[sourceNum][ind].some(
                (v, i) => v !== propVariablesCopiedByReplacement[ind][i],
              )
            ) {
              onlyDifferenceIsType = false;
              foundDifference = true;
            } else {
              if (
                component.replacements[numReplacementsSoFar + ind]
                  .componentType !==
                newSerializedReplacements[ind].componentType
              ) {
                foundDifference = true;
              }
            }
          }

          if (ind == 0 && foundDifference && onlyDifferenceIsType) {
            let requiredLength = await component.stateValues
              .numComponentsSpecified;

            let wrapExistingReplacements =
              requiredLength === 1 &&
              nNewReplacements === 1 &&
              !(component.replacementsToWithhold > 0) &&
              workspace.sourceNames.length === 1;

            if (wrapExistingReplacements) {
              foundDifference = false;
            }
          }

          if (foundDifference) {
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

      let nNewNonStrings = newSerializedReplacements.filter(
        (x) => typeof x !== "string",
      ).length;

      numReplacementsSoFar += nNewReplacements;
      numNonStringReplacementsSoFar += nNewNonStrings;

      numReplacementsBySource[sourceNum] = nNewReplacements;
      numNonStringReplacementsBySource[sourceNum] = nNewNonStrings;

      propVariablesCopiedBySource[sourceNum] = propVariablesCopiedByReplacement;
    }

    let previousZeroSourceNames = workspace.sourceNames.length === 0;

    workspace.numReplacementsBySource = numReplacementsBySource;
    workspace.numNonStringReplacementsBySource =
      numNonStringReplacementsBySource;
    workspace.sourceNames = replacementSourceIdentities.map(
      (x) => x.componentName,
    );
    workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;

    let verificationResult = await verifyReplacementsMatchSpecifiedType({
      component,
      replacementChanges,
      assignNames,
      workspace,
      componentInfoObjects,
      compositeAttributesObj,

      components,
      publicCaseInsensitiveAliasSubstitutions,
    });
    errors.push(...verificationResult.errors);
    warnings.push(...verificationResult.warnings);

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

  static async recreateReplacements({
    component,
    sourceNum,
    numReplacementsSoFar,
    numNonStringReplacementsSoFar,
    numReplacementsToDelete,
    uniqueIdentifiersUsed,
    components,
    compositeAttributesObj,
    componentInfoObjects,
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
  }) {
    let errors = [];
    let warnings = [];

    let results = await this.createReplacementForSource({
      component,
      sourceNum,
      numReplacementsSoFar,
      numNonStringReplacementsSoFar,
      components,
      uniqueIdentifiersUsed,
      compositeAttributesObj,
      componentInfoObjects,
      numComponentsForSource,
      publicCaseInsensitiveAliasSubstitutions,
      fromCopyTarget:
        Number(sourceNum) === 0 && component.doenetAttributes.fromCopyTarget,
    });
    errors.push(...results.errors);
    warnings.push(...results.warnings);

    let propVariablesCopiedByReplacement =
      results.propVariablesCopiedByReplacement;

    let newSerializedChildren = results.serializedReplacements;

    if (newSerializedChildren.length > 0 || numReplacementsToDelete > 0) {
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
        numNonStringReplacements: newSerializedChildren.filter(
          (x) => typeof x !== "string",
        ).length,
        propVariablesCopiedByReplacement,
        replacementInstruction,
        errors,
        warnings,
      };
    } else {
      return {
        numReplacements: 0,
        numNonStringReplacements: 0,
        propVariablesCopiedByReplacement,
        replacementInstruction: [],
        errors,
        warnings,
      };
    }
  }
}

export async function replacementFromProp({
  component,
  components,
  replacementSource,
  propName,
  // numReplacementsSoFar,
  uniqueIdentifiersUsed,
  compositeAttributesObj,
  componentInfoObjects,
  numComponentsForSource,
  publicCaseInsensitiveAliasSubstitutions,
}) {
  // console.log(`replacement from prop for ${component.componentName}`)
  // console.log(replacementSource)

  let errors = [];
  let warnings = [];

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
    if (propName !== "__prop_name_not_found") {
      warnings.push({
        message: `Could not find prop ${propName} on a component of type ${replacementSource.componentType}`,
        level: 2,
      });
    }
    return {
      serializedReplacements: [],
      propVariablesCopiedByReplacement: [],
      errors,
      warnings,
    };
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
          errors,
          warnings,
        };
      }
    }

    let wrappingComponents = stateVarObj.wrappingComponents;
    let numWrappingComponents = wrappingComponents.length;

    let numReplacementsForSource = numComponentsForSource;

    if (stateVarObj.isArray) {
      if (arraySize.some((v) => v === 0)) {
        numReplacementsForSource = 0;
      } else {
        numReplacementsForSource = arraySize
          .slice(0, arraySize.length - numWrappingComponents)
          .reduce((a, c) => a * c, 1);
      }
    } else {
      if (arrayKeys.length === 0) {
        // have an undefined array entry
        numReplacementsForSource = 0;
      } else if (numWrappingComponents === 0) {
        // with no wrapping components, will just output
        // one component for each component of the array
        numReplacementsForSource = arrayKeys.length;
      } else if (numWrappingComponents >= stateVarObj.numDimensions) {
        // if had an outer wrapping component, would just have a single component
        numReplacementsForSource = 1;
      } else if (numWrappingComponents === stateVarObj.numDimensions - 1) {
        // if the second from outer dimension is wrapped
        // then just count the number of entries in the original array
        numReplacementsForSource = unflattenedArrayKeys.length;
      } else {
        // if have at least two unwrapped dimensions,
        // flatten the array so that the entries counted are the outermost wrapped
        // Note: we need to create a 3D array entry to access this,
        // so this code is so far untested
        let nLevelsToFlatten =
          stateVarObj.numDimensions - numWrappingComponents - 1;
        numReplacementsForSource = flattenLevels(
          unflattenedArrayKeys,
          nLevelsToFlatten,
        ).length;
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
            arrayIndex = [arrayIndex];
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
        let propVariablesCopied = (propVariablesCopiedByReplacement[
          replacementInd
        ] = []);

        let createComponentOfType =
          arrayStateVarObj.shadowingInstructions.createComponentOfType;
        if (Array.isArray(createComponentOfType)) {
          // TODO: multidimensional arrays?

          if (createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)]) {
            createComponentOfType =
              createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)];
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
          let propVariable =
            arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

          propVariablesCopied.push(propVariable);

          let uniqueIdentifierBase =
            replacementSource.componentName + "|shadow|" + propVariable;
          let uniqueIdentifier = getUniqueIdentifierFromBase(
            uniqueIdentifierBase,
            uniqueIdentifiersUsed,
          );

          let attributesFromComposite = convertAttributesForComponentType({
            attributes: component.attributes,
            componentType: createComponentOfType,
            componentInfoObjects,
            compositeAttributesObj,
            compositeCreatesNewNamespace: newNamespace,
          });

          let attributeComponentsShadowingStateVariables;
          if (
            arrayStateVarObj.shadowingInstructions
              .addAttributeComponentsShadowingStateVariables
          ) {
            attributeComponentsShadowingStateVariables = {};

            for (let attrName in arrayStateVarObj.shadowingInstructions
              .addAttributeComponentsShadowingStateVariables) {
              let stateVariableToShadow =
                arrayStateVarObj.shadowingInstructions
                  .addAttributeComponentsShadowingStateVariables[attrName]
                  .stateVariableToShadow;

              let sObj = target.state[stateVariableToShadow];
              if (sObj.isArray) {
                stateVariableToShadow = sObj.arrayVarNameFromArrayKey(arrayKey);
              }

              attributeComponentsShadowingStateVariables[attrName] = {
                stateVariableToShadow,
              };
            }
          }

          let stateVariablesShadowingStateVariables;
          if (
            arrayStateVarObj.shadowingInstructions
              .addStateVariablesShadowingStateVariables
          ) {
            stateVariablesShadowingStateVariables = {};

            for (let attrName in arrayStateVarObj.shadowingInstructions
              .addStateVariablesShadowingStateVariables) {
              let stateVariableToShadow =
                arrayStateVarObj.shadowingInstructions
                  .addStateVariablesShadowingStateVariables[attrName]
                  .stateVariableToShadow;

              let sObj = target.state[stateVariableToShadow];
              if (sObj.isArray) {
                stateVariableToShadow = sObj.arrayVarNameFromArrayKey(arrayKey);
              }

              stateVariablesShadowingStateVariables[attrName] = {
                stateVariableToShadow,
              };
            }
          }

          if (link) {
            let attributesForReplacement = {};

            if (attributeComponentsShadowingStateVariables) {
              let classOfComponentToCreate =
                componentInfoObjects.allComponentClasses[createComponentOfType];
              let attrObj = classOfComponentToCreate.createAttributesObject();

              for (let attrName in attributeComponentsShadowingStateVariables) {
                let stateVariableToShadow =
                  attributeComponentsShadowingStateVariables[attrName]
                    .stateVariableToShadow;
                let attributeComponentType =
                  attrObj[attrName]?.createComponentOfType;

                if (attributeComponentType) {
                  let shadowComponent = {
                    componentType: attributeComponentType,
                    downstreamDependencies: {
                      [target.componentName]: [
                        {
                          compositeName: component.componentName,
                          dependencyType: "referenceShadow",
                          propVariable: stateVariableToShadow,
                        },
                      ],
                    },
                  };

                  attributesForReplacement[attrName] = {
                    component: shadowComponent,
                  };
                }
              }
            }

            Object.assign(attributesForReplacement, attributesFromComposite);

            serializedReplacements.push({
              componentType: createComponentOfType,
              attributes: attributesForReplacement,
              downstreamDependencies: {
                [replacementSource.componentName]: [
                  {
                    dependencyType: "referenceShadow",
                    compositeName: component.componentName,
                    propVariable,
                    additionalStateVariableShadowing:
                      stateVariablesShadowingStateVariables,
                  },
                ],
              },
              uniqueIdentifier,
            });
          } else {
            // no link

            let attributesForReplacement = {};

            if (attributeComponentsShadowingStateVariables) {
              let classOfComponentToCreate =
                componentInfoObjects.allComponentClasses[createComponentOfType];
              let attrObj = classOfComponentToCreate.createAttributesObject();

              let additionalAttributes = {};
              for (let attrName in attributeComponentsShadowingStateVariables) {
                if (attrObj[attrName]?.createComponentOfType) {
                  let vName =
                    attributeComponentsShadowingStateVariables[attrName]
                      .stateVariableToShadow;
                  let attributeStateVarObj = target.state[vName];
                  let attributeValue = await attributeStateVarObj.value;
                  if (attributeStateVarObj.isArray) {
                    // Assume attribute has same dimensions as original
                    // TODO: multidimensional arrays?
                    attributeValue =
                      attributeValue[attributeStateVarObj.keyToIndex[arrayKey]];
                  }
                  if (!target.state[vName].usedDefault) {
                    additionalAttributes[attrName] = attributeValue;
                  }
                }
              }

              let attributesFromComponent = convertAttributesForComponentType({
                attributes: additionalAttributes,
                componentType: createComponentOfType,
                componentInfoObjects,
              });

              if (stateVarObj.shadowingInstructions.attributesToShadow) {
                for (let attrName of stateVarObj.shadowingInstructions
                  .attributesToShadow) {
                  if (target.attributes[attrName]?.component) {
                    attributesFromComponent[attrName] = {
                      component: await target.attributes[
                        attrName
                      ]?.component.serialize({
                        copyAll: true,
                        copyVariants: true,
                      }),
                    };
                  } else if (
                    target.attributes[attrName]?.primitive !== undefined
                  ) {
                    attributesFromComponent[attrName] = {
                      primitive: JSON.parse(
                        JSON.stringify(target.attributes[attrName].primitive),
                      ),
                    };
                  }
                }
              }

              Object.assign(attributesForReplacement, attributesFromComponent);
            }

            Object.assign(attributesForReplacement, attributesFromComposite);

            let primaryEssentialStateVariable = "value";
            let componentClass =
              componentInfoObjects.allComponentClasses[createComponentOfType];
            if (componentClass.primaryEssentialStateVariable) {
              primaryEssentialStateVariable =
                componentClass.primaryEssentialStateVariable;
            } else if (componentClass.primaryStateVariableForDefinition) {
              primaryEssentialStateVariable =
                componentClass.primaryStateVariableForDefinition;
            }

            let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
            if (!Array.isArray(arrayIndex)) {
              arrayIndex = [arrayIndex];
            }
            let propStateValue = await arrayStateVarObj.value;
            for (let ind2 of arrayIndex) {
              propStateValue = propStateValue[ind2];
            }

            let serializedComponent = {
              componentType: createComponentOfType,
              attributes: attributesForReplacement,
              state: {
                [primaryEssentialStateVariable]: propStateValue,
              },
              uniqueIdentifier,
            };

            serializedReplacements.push(serializedComponent);
          }
        } else {
          // didn't match an array key, so just add an empty component of createComponentOfType
          let uniqueIdentifierBase = createComponentOfType + "|empty";
          let uniqueIdentifier = getUniqueIdentifierFromBase(
            uniqueIdentifierBase,
            uniqueIdentifiersUsed,
          );

          serializedReplacements.push({
            componentType: createComponentOfType,
            uniqueIdentifier,
          });
        }
      }
    } else {
      // have wrapping components

      let createReplacementPiece = async function (
        subArrayKeys,
        numDimensionsLeft,
        init = false,
      ) {
        let pieces = [];
        let propVariablesCopiedByPiece = [];

        if (numDimensionsLeft > 1) {
          // since numDimensionsLeft > 1, each component of subArray should be an array
          for (let subSubArrayKeys of subArrayKeys) {
            // recurse down to previous dimension
            let result = await createReplacementPiece(
              subSubArrayKeys,
              numDimensionsLeft - 1,
            );
            pieces.push(...result.pieces);
            propVariablesCopiedByPiece.push(
              ...result.propVariablesCopiedByPiece,
            );
          }
        } else {
          // down to last piece
          for (let arrayKey of subArrayKeys) {
            let propVariable =
              arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);
            let propVariablesCopiedForThisPiece = [propVariable];

            let uniqueIdentifierBase =
              replacementSource.componentName + "|shadow|" + propVariable;
            let uniqueIdentifier = getUniqueIdentifierFromBase(
              uniqueIdentifierBase,
              uniqueIdentifiersUsed,
            );

            let createComponentOfType =
              arrayStateVarObj.shadowingInstructions.createComponentOfType;
            if (Array.isArray(createComponentOfType)) {
              // TODO: multidimensional arrays?
              createComponentOfType =
                createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)];
            }

            let attributeComponentsShadowingStateVariables;
            if (
              arrayStateVarObj.shadowingInstructions
                .addAttributeComponentsShadowingStateVariables
            ) {
              attributeComponentsShadowingStateVariables = {};

              let attributeShadowingInfo =
                arrayStateVarObj.shadowingInstructions
                  .addAttributeComponentsShadowingStateVariables;

              for (let attrName in attributeShadowingInfo) {
                if (
                  !attributeShadowingInfo[attrName].addToOuterIfWrappedArray
                ) {
                  let stateVariableToShadow =
                    attributeShadowingInfo[attrName].stateVariableToShadow;

                  let sObj = target.state[stateVariableToShadow];
                  if (sObj.isArray) {
                    stateVariableToShadow =
                      sObj.arrayVarNameFromArrayKey(arrayKey);
                  }

                  attributeComponentsShadowingStateVariables[attrName] = {
                    stateVariableToShadow,
                  };
                }
              }
            }

            let stateVariablesShadowingStateVariables;
            if (
              arrayStateVarObj.shadowingInstructions
                .addStateVariablesShadowingStateVariables
            ) {
              stateVariablesShadowingStateVariables = {};

              for (let attrName in arrayStateVarObj.shadowingInstructions
                .addStateVariablesShadowingStateVariables) {
                let stateVariableToShadow =
                  arrayStateVarObj.shadowingInstructions
                    .addStateVariablesShadowingStateVariables[attrName]
                    .stateVariableToShadow;

                let sObj = target.state[stateVariableToShadow];
                if (sObj.isArray) {
                  stateVariableToShadow =
                    sObj.arrayVarNameFromArrayKey(arrayKey);
                }

                stateVariablesShadowingStateVariables[attrName] = {
                  stateVariableToShadow,
                };
              }
            }

            if (link) {
              let attributesForReplacement = {};

              if (attributeComponentsShadowingStateVariables) {
                let classOfComponentToCreate =
                  componentInfoObjects.allComponentClasses[
                    createComponentOfType
                  ];
                let attrObj = classOfComponentToCreate.createAttributesObject();

                for (let attrName in attributeComponentsShadowingStateVariables) {
                  let stateVariableToShadow =
                    attributeComponentsShadowingStateVariables[attrName]
                      .stateVariableToShadow;
                  let attributeComponentType =
                    attrObj[attrName]?.createComponentOfType;

                  if (attributeComponentType) {
                    let shadowComponent = {
                      componentType: attributeComponentType,
                      downstreamDependencies: {
                        [target.componentName]: [
                          {
                            compositeName: component.componentName,
                            dependencyType: "referenceShadow",
                            propVariable: stateVariableToShadow,
                          },
                        ],
                      },
                    };

                    attributesForReplacement[attrName] = {
                      component: shadowComponent,
                    };
                  }
                }
              }

              pieces.push({
                componentType: createComponentOfType,
                attributes: attributesForReplacement,
                downstreamDependencies: {
                  [replacementSource.componentName]: [
                    {
                      dependencyType: "referenceShadow",
                      compositeName: component.componentName,
                      propVariable,
                      additionalStateVariableShadowing:
                        stateVariablesShadowingStateVariables,
                    },
                  ],
                },
                uniqueIdentifier,
              });
            } else {
              let attributesForReplacement = {};

              if (attributeComponentsShadowingStateVariables) {
                let classOfComponentToCreate =
                  componentInfoObjects.allComponentClasses[
                    createComponentOfType
                  ];
                let attrObj = classOfComponentToCreate.createAttributesObject();
                let additionalAttributes = {};
                for (let attrName in attributeComponentsShadowingStateVariables) {
                  if (attrObj[attrName]?.createComponentOfType) {
                    let vName =
                      attributeComponentsShadowingStateVariables[attrName]
                        .stateVariableToShadow;
                    let attributeStateVarObj = target.state[vName];
                    let attributeValue = await attributeStateVarObj.value;
                    if (attributeStateVarObj.isArray) {
                      // Assume attribute has same dimensions as original
                      // TODO: multidimensional arrays?
                      attributeValue =
                        attributeValue[
                          attributeStateVarObj.keyToIndex[arrayKey]
                        ];
                    }
                    if (!target.state[vName].usedDefault) {
                      additionalAttributes[attrName] = attributeValue;
                    }
                  }
                }

                let attributesFromComponent = convertAttributesForComponentType(
                  {
                    attributes: additionalAttributes,
                    componentType: createComponentOfType,
                    componentInfoObjects,
                  },
                );

                if (stateVarObj.shadowingInstructions.attributesToShadow) {
                  for (let attrName of stateVarObj.shadowingInstructions
                    .attributesToShadow) {
                    if (target.attributes[attrName]?.component) {
                      attributesFromComponent[attrName] = {
                        component: await target.attributes[
                          attrName
                        ]?.component.serialize({
                          copyAll: true,
                          copyVariants: true,
                        }),
                      };
                    } else if (
                      target.attributes[attrName]?.primitive !== undefined
                    ) {
                      attributesFromComponent[attrName] = {
                        primitive: JSON.parse(
                          JSON.stringify(target.attributes[attrName].primitive),
                        ),
                      };
                    }
                  }
                }

                Object.assign(
                  attributesForReplacement,
                  attributesFromComponent,
                );
              }

              let primaryEssentialStateVariable = "value";
              let componentClass =
                componentInfoObjects.allComponentClasses[createComponentOfType];
              if (componentClass.primaryEssentialStateVariable) {
                primaryEssentialStateVariable =
                  componentClass.primaryEssentialStateVariable;
              } else if (componentClass.primaryStateVariableForDefinition) {
                primaryEssentialStateVariable =
                  componentClass.primaryStateVariableForDefinition;
              }

              let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
              if (!Array.isArray(arrayIndex)) {
                arrayIndex = [arrayIndex];
              }

              let propStateValue = await arrayStateVarObj.value;
              for (let ind of arrayIndex) {
                propStateValue = propStateValue[ind];
              }

              let serializedComponent = {
                componentType: createComponentOfType,
                attributes: attributesForReplacement,
                state: {
                  [primaryEssentialStateVariable]: propStateValue,
                },
                uniqueIdentifier,
              };

              pieces.push(serializedComponent);
            }

            propVariablesCopiedByPiece.push(propVariablesCopiedForThisPiece);
          }
        }

        // we wrap this dimension if have corresponding wrapping components
        let wrapCs = wrappingComponents[numDimensionsLeft - 1];
        if (pieces.length > 0 && wrapCs && wrapCs.length > 0) {
          for (let ind = wrapCs.length - 1; ind >= 0; ind--) {
            let wrapCT =
              typeof wrapCs[ind] === "object"
                ? wrapCs[ind].componentType
                : wrapCs[ind];
            let uniqueIdentifierBase = wrapCT + "|wrapper";
            let uniqueIdentifier = getUniqueIdentifierFromBase(
              uniqueIdentifierBase,
              uniqueIdentifiersUsed,
            );

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

            pieces = [
              {
                componentType: wrapCT,
                children,
                attributes,
                uniqueIdentifier,
                skipSugar: true,
              },
            ];
            if (typeof wrapCs[ind] === "object") {
              if (wrapCs[ind].doenetAttributes) {
                pieces[0].doenetAttributes = Object.assign(
                  {},
                  wrapCs[ind].doenetAttributes,
                );
              }
              if (wrapCs[ind].isAttribute) {
                pieces[0].isAttribute = wrapCs[ind].isAttribute;
              }
            }
          }
          propVariablesCopiedByPiece = [
            flattenDeep(propVariablesCopiedByPiece),
          ];
        }

        if (
          init &&
          arrayStateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables
        ) {
          let attributeComponentsShadowingStateVariables = {};

          let attributeShadowingInfo =
            arrayStateVarObj.shadowingInstructions
              .addAttributeComponentsShadowingStateVariables;

          for (let attrName in attributeShadowingInfo) {
            if (attributeShadowingInfo[attrName].addToOuterIfWrappedArray) {
              let stateVariableToShadow =
                attributeShadowingInfo[attrName].stateVariableToShadow;

              attributeComponentsShadowingStateVariables[attrName] = {
                stateVariableToShadow,
              };
            }
          }

          if (
            Object.keys(attributeComponentsShadowingStateVariables).length > 0
          ) {
            for (let piece of pieces) {
              let attributesForReplacement = piece.attributes;
              if (!attributesForReplacement) {
                attributesForReplacement = piece.attributes = {};
              }

              let classOfComponentToCreate =
                componentInfoObjects.allComponentClasses[piece.componentType];
              let attrObj = classOfComponentToCreate.createAttributesObject();

              if (link) {
                for (let attrName in attributeComponentsShadowingStateVariables) {
                  let stateVariableToShadow =
                    attributeComponentsShadowingStateVariables[attrName]
                      .stateVariableToShadow;
                  let attributeComponentType =
                    attrObj[attrName]?.createComponentOfType;

                  if (attributeComponentType) {
                    let shadowComponent = {
                      componentType: attributeComponentType,
                      downstreamDependencies: {
                        [target.componentName]: [
                          {
                            compositeName: component.componentName,
                            dependencyType: "referenceShadow",
                            propVariable: stateVariableToShadow,
                          },
                        ],
                      },
                    };

                    attributesForReplacement[attrName] = {
                      component: shadowComponent,
                    };
                  }
                }
              } else {
                let additionalAttributes = {};
                for (let attrName in attributeComponentsShadowingStateVariables) {
                  if (attrObj[attrName]?.createComponentOfType) {
                    let vName =
                      attributeComponentsShadowingStateVariables[attrName]
                        .stateVariableToShadow;
                    let attributeStateVarObj = target.state[vName];
                    let attributeValue = await attributeStateVarObj.value;

                    if (!target.state[vName].usedDefault) {
                      additionalAttributes[attrName] = attributeValue;
                    }
                  }
                }

                if (Object.keys(additionalAttributes).length > 0) {
                  additionalAttributes = convertAttributesForComponentType({
                    attributes: additionalAttributes,
                    componentType: piece.componentType,
                    componentInfoObjects,
                  });

                  Object.assign(attributesForReplacement, additionalAttributes);
                }
              }
            }
          }
        }

        return { pieces, propVariablesCopiedByPiece };
      };

      let result = await createReplacementPiece(
        unflattenedArrayKeys,
        stateVarObj.numDimensions,
        true,
      );

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
        });

        Object.assign(replacement.attributes, attributesFromComposite);

        if (link) {
          replacement.downstreamDependencies = {
            [replacementSource.componentName]: [
              {
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable: varName,
                ignorePrimaryStateVariable: true,
              },
            ],
          };
        }
      }

      replacementInd += newReplacements.length;

      serializedReplacements.push(...newReplacements);

      if (newReplacements.length < numReplacementsForSource) {
        // we didn't create enough replacements,
        // which could happen if we have componentType and numComponentsSpecified set

        // just create additional replacements,
        // even though they won't yet refer to the right dependencies

        for (
          let ind = newReplacements.length;
          ind < numReplacementsForSource;
          ind++
        ) {
          replacementInd++;
          propVariablesCopiedByReplacement[replacementInd] = [];

          let createComponentOfType;
          let wrapCs = wrappingComponents[0];
          let wrapDoenetAttributes;
          if (wrapCs && wrapCs.length > 0) {
            if (typeof wrapCs[0] === "object") {
              createComponentOfType = wrapCs[0].componentType;
              wrapDoenetAttributes = Object.assign(
                {},
                wrapCs[0].doenetAttributes,
              );
            } else {
              createComponentOfType = wrapCs[0];
            }
          } else {
            createComponentOfType =
              arrayStateVarObj.shadowingInstructions.createComponentOfType;
            if (Array.isArray(createComponentOfType)) {
              // TODO: multidimensional arrays?
              if (stateVarObj.isArrayEntry) {
                createComponentOfType =
                  createComponentOfType[
                    arrayStateVarObj.keyToIndex(arrayKeys[ind])
                  ];
              } else {
                createComponentOfType = createComponentOfType[ind];
              }
            }
          }

          // just add an empty component of createComponentOfType

          let uniqueIdentifierBase = createComponentOfType + "|empty";
          let uniqueIdentifier = getUniqueIdentifierFromBase(
            uniqueIdentifierBase,
            uniqueIdentifiersUsed,
          );

          let newReplacement = {
            componentType: createComponentOfType,
            uniqueIdentifier,
          };
          if (wrapDoenetAttributes) {
            newReplacement.doenetAttributes = wrapDoenetAttributes;
          }
          serializedReplacements.push(newReplacement);
        }
      } else if (newReplacements > numReplacementsForSource) {
        throw Error(
          `Something went wrong when creating replacements for ${component.componentName} as we ended up with too many replacements`,
        );
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
        errors,
        warnings,
      };
    }

    replacementInd++;

    let propVariablesCopied = (propVariablesCopiedByReplacement[
      replacementInd
    ] = []);

    propVariablesCopied.push(varName);

    let uniqueIdentifierBase = target.componentName + "|shadow|" + varName;
    let uniqueIdentifier = getUniqueIdentifierFromBase(
      uniqueIdentifierBase,
      uniqueIdentifiersUsed,
    );

    if (stateVarObj.shadowingInstructions.createComponentOfType === "string") {
      serializedReplacements.push(await stateVarObj.value);
    } else {
      let attributesFromComposite = convertAttributesForComponentType({
        attributes: component.attributes,
        componentType: stateVarObj.shadowingInstructions.createComponentOfType,
        componentInfoObjects,
        compositeAttributesObj,
        compositeCreatesNewNamespace: newNamespace,
      });

      if (link) {
        let attributesForReplacement = {};

        if (
          stateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables
        ) {
          let classOfComponentToCreate =
            componentInfoObjects.allComponentClasses[
              stateVarObj.shadowingInstructions.createComponentOfType
            ];
          let attrObj = classOfComponentToCreate.createAttributesObject();

          for (let attrName in stateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables) {
            let stateVariableToShadow =
              stateVarObj.shadowingInstructions
                .addAttributeComponentsShadowingStateVariables[attrName]
                .stateVariableToShadow;
            let attributeComponentType =
              attrObj[attrName]?.createComponentOfType;

            if (attributeComponentType) {
              let shadowComponent = {
                componentType: attributeComponentType,
                downstreamDependencies: {
                  [target.componentName]: [
                    {
                      compositeName: component.componentName,
                      dependencyType: "referenceShadow",
                      propVariable: stateVariableToShadow,
                    },
                  ],
                },
              };

              attributesForReplacement[attrName] = {
                component: shadowComponent,
              };
            }
          }
        }

        Object.assign(attributesForReplacement, attributesFromComposite);

        serializedReplacements.push({
          componentType:
            stateVarObj.shadowingInstructions.createComponentOfType,
          attributes: attributesForReplacement,
          downstreamDependencies: {
            [target.componentName]: [
              {
                dependencyType: "referenceShadow",
                compositeName: component.componentName,
                propVariable: varName,
                additionalStateVariableShadowing:
                  stateVarObj.shadowingInstructions
                    .addStateVariablesShadowingStateVariables,
              },
            ],
          },
          uniqueIdentifier,
        });
      } else {
        let attributesForReplacement = {};

        if (
          stateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables
        ) {
          let classOfComponentToCreate =
            componentInfoObjects.allComponentClasses[
              stateVarObj.shadowingInstructions.createComponentOfType
            ];
          let attrObj = classOfComponentToCreate.createAttributesObject();

          let additionalAttributes = {};
          for (let attrName in stateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables) {
            if (attrObj[attrName]?.createComponentOfType) {
              // when copying with link=false, don't copy fixed attribute
              // so that, for example, a copy from a sequence with link=false is not fixed
              if (attrName !== "fixed") {
                let vName =
                  stateVarObj.shadowingInstructions
                    .addAttributeComponentsShadowingStateVariables[attrName]
                    .stateVariableToShadow;
                let attributeValue = await target.state[vName].value;
                if (!target.state[vName].usedDefault) {
                  additionalAttributes[attrName] = attributeValue;
                }
              }
            }
          }

          let attributesFromComponent = convertAttributesForComponentType({
            attributes: additionalAttributes,
            componentType:
              stateVarObj.shadowingInstructions.createComponentOfType,
            componentInfoObjects,
          });

          if (stateVarObj.shadowingInstructions.attributesToShadow) {
            for (let attrName of stateVarObj.shadowingInstructions
              .attributesToShadow) {
              if (target.attributes[attrName]?.component) {
                attributesFromComponent[attrName] = {
                  component: await target.attributes[
                    attrName
                  ]?.component.serialize({ copyAll: true, copyVariants: true }),
                };
              } else if (target.attributes[attrName]?.primitive !== undefined) {
                attributesFromComponent[attrName] = {
                  primitive: JSON.parse(
                    JSON.stringify(target.attributes[attrName].primitive),
                  ),
                };
              }
            }
          }

          Object.assign(attributesForReplacement, attributesFromComponent);
        }

        Object.assign(attributesForReplacement, attributesFromComposite);

        let primaryEssentialStateVariable = "value";
        let componentClass =
          componentInfoObjects.allComponentClasses[
            stateVarObj.shadowingInstructions.createComponentOfType
          ];
        if (componentClass.primaryEssentialStateVariable) {
          primaryEssentialStateVariable =
            componentClass.primaryEssentialStateVariable;
        } else if (componentClass.primaryStateVariableForDefinition) {
          primaryEssentialStateVariable =
            componentClass.primaryStateVariableForDefinition;
        }

        let serializedComponent = {
          componentType:
            stateVarObj.shadowingInstructions.createComponentOfType,
          attributes: attributesForReplacement,
          state: {
            [primaryEssentialStateVariable]: stateVarValue,
          },
          uniqueIdentifier,
        };

        serializedReplacements.push(serializedComponent);
      }
    }
  }

  if (await component.stateValues.implicitProp) {
    for (let repl of serializedReplacements) {
      if (!repl.doenetAttributes) {
        repl.doenetAttributes = {};
      }
      repl.doenetAttributes.fromImplicitProp = true;
      if (repl.downstreamDependencies?.[target.componentName]?.[0]) {
        repl.downstreamDependencies[
          target.componentName
        ][0].fromImplicitProp = true;
      }
    }
  }

  // console.log(`serializedReplacements for ${component.componentName}`)
  // console.log(JSON.parse(JSON.stringify(serializedReplacements)))
  // console.log(serializedReplacements)

  return {
    serializedReplacements,
    propVariablesCopiedByReplacement,
    errors,
    warnings,
  };
}
