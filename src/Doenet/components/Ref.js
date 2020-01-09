import CompositeComponent from './abstract/CompositeComponent';
import { replaceIncompleteProp } from './commonsugar/createprop';
import * as serializeFunctions from '../utils/serializedStateProcessing';
import { deepClone } from '../utils/deepFunctions';



export default class Ref extends CompositeComponent {
  constructor(args) {
    super(args);
    this.processNewDoenetML = this.processNewDoenetML.bind(this);
  }
  static componentType = "ref";

  static takesComponentName = true;

  static refPropOfReplacements = true;

  static createPropertiesObject({ allPossibleProperties }) {

    if (allPossibleProperties === undefined) {
      return {};
    }


    // Note: putting all possible properties as state variables
    // risks a collision between a newly defined property
    // and one of the state variables of Ref.
    // TODO: is there a better way to organize to avoid this potential collision
    // (Naming state variables beginning with a _ is not an option
    // as the idea is to exclude such state variable names to avoid
    // collision with internal state variables that core creates.)

    // Allow all standard component types to be entered as a property
    // at this stage with no defaults.
    // Will check validity depending on ref target
    let properties = {};
    for (let componentType of allPossibleProperties) {
      properties[componentType] = { ignorePropagationFromAncestors: true };
    }

    // Just in case there is a component that added these as a property, delete them

    // delete string and prop
    delete properties.string;
    delete properties.prop;
    delete properties.reftarget;
    delete properties.childnumber;
    delete properties.contentid;

    // delete math and number so childnumber won't get matched
    delete properties.math;
    delete properties.number;

    // delete text so contentId won't get matched
    delete properties.text;


    return properties;

  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let addRefTarget = function ({ activeChildrenMatched }) {
      // add <reftarget> around string
      return {
        success: true,
        newChildren: [{
          componentType: "reftarget", children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }]
        }],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: 'exactlyOneString',
      componentType: 'string',
      number: 1,
      isSugar: true,
      affectedBySugar: ["exactlyOneRefTarget"],
      replacementFunction: addRefTarget,
    });

    let atMostOnePropForString = childLogic.newLeaf({
      name: "atMostOnePropForString",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
    });

    // let atMostOneChildnumberForString = childLogic.newLeaf({
    //   name: 'atMostOneChildnumberForString',
    //   componentType: 'childnumber',
    //   comparison: 'atMost',
    //   number: 1,
    // });

    let stringWithOptionalProp = childLogic.newOperator({
      name: "stringWithOptionalProp",
      propositions: [exactlyOneString, atMostOnePropForString],//, atMostOneChildnumberForString],
      operator: 'and',
    })


    let exactlyOneRefTarget = childLogic.newLeaf({
      name: 'exactlyOneRefTarget',
      componentType: 'reftarget',
      number: 1,
    });

    let atMostOneProp = childLogic.newLeaf({
      name: "atMostOneProp",
      componentType: 'prop',
      comparison: 'atMost',
      number: 1,
    });

    let refTargetWithOptionalProp = childLogic.newOperator({
      name: "refTargetWithOptionalProp",
      operator: "and",
      propositions: [exactlyOneRefTarget, atMostOneProp],// atMostOneChildnumber]
    });

    let refTargetPropXorSugar = childLogic.newOperator({
      name: "refTargetPropXorSugar",
      operator: "xor",
      propositions: [refTargetWithOptionalProp, stringWithOptionalProp]
    });

    let exactlyOneContentId = childLogic.newLeaf({
      name: "exactlyOneContentId",
      componentType: 'contentid',
      number: 1,
    });

    childLogic.newOperator({
      name: "contentIdXorRefTargetProp",
      operator: "xor",
      propositions: [exactlyOneContentId, refTargetPropXorSugar],
      setAsBase: true,
    });


    return childLogic;
  }

  static returnStateVariableDefinitions({ propertyNames }) {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.refTarget = {
      returnDependencies: () => ({
        refTargetChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneRefTarget",
          variableNames: ["refTarget"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.refTargetChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              refTarget: { variablesToCheck: "refTarget" }
            }
          }
        }
        return { newValues: { refTarget: dependencyValues.refTargetChild[0].stateValues.refTarget } }
      },
    };

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
          throw Error("Cannot ref contentId without specifying a new namespace")
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


    stateVariableDefinitions.refTargetName = {
      returnDependencies: () => ({
        refTarget: {
          dependencyType: "stateVariable",
          variableName: "refTarget",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { refTargetName: dependencyValues.refTarget.componentName } }
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
            newValues: { useProp: false }
          };
        } else {
          return {
            newValues: { useProp: true }
          };
        }
      }
    }


    stateVariableDefinitions.effectiveTargetClasses = {
      stateVariablesDeterminingDependencies: ["refTarget", "useProp"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {
        // If reffing a prop, then want to change the effective target classes
        // to be the classes of the replacements, as the validity of the prop
        // is determined by this replacement class.
        // Otherwise, the effective target class is just the class of the refTarget

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let refTargetClass = componentInfoObjects.allComponentClasses[stateValues.refTarget.componentType];

        let dependencies = {};

        if (stateValues.useProp && compositeClass.isPrototypeOf(refTargetClass) &&
          refTargetClass.refPropOfReplacements
        ) {
          dependencies.refTargetReplacementClassesForProp = {
            dependencyType: "componentStateVariable",
            componentName: stateValues.refTarget.componentName,
            variableName: "replacementClassesForProp"
          }
        } else {
          dependencies.refTarget = {
            dependencyType: "stateVariable",
            variableName: "refTarget"
          }
        }

        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let effectiveTargetClasses;
        if (dependencyValues.refTarget) {
          effectiveTargetClasses = [componentInfoObjects.allComponentClasses[dependencyValues.refTarget.componentType]]
        } else {
          effectiveTargetClasses = dependencyValues.refTargetReplacementClassesForProp;
        }
        return {
          newValues: { effectiveTargetClasses }
        };
      },
    };

    stateVariableDefinitions.preliminaryReplacementClasses = {
      additionalStateVariablesDefined: ["propVariableObjs", "stateVariablesRequested", "validProp"],
      returnDependencies: () => ({
        effectiveTargetClasses: {
          dependencyType: "stateVariable",
          variableName: "effectiveTargetClasses",
        },
        refTargetName: {
          dependencyType: "stateVariable",
          variableName: "refTargetName",
        },
        propChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneProp",
          variableNames: ["propVariableObjs", "propComponentTypes"],
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        if (dependencyValues.propChild.length === 0) {
          return {
            newValues: {
              preliminaryReplacementClasses: dependencyValues.effectiveTargetClasses,
              propVariableObjs: null,
              stateVariablesRequested: null,
              validProp: null,
            }
          };
        }

        let propVariableObjs = dependencyValues.propChild[0].stateValues.propVariableObjs;
        let propComponentTypes = dependencyValues.propChild[0].stateValues.propComponentTypes;

        let validProp = true;

        let replacementClasses = [];

        if (!propComponentTypes) {
          validProp = false;
        } else {
          for (let propComponentType of propComponentTypes) {
            if (!propComponentType) {
              if (propComponentTypes.length !== 1) {
                console.warn(`Have not implemented case of ref of prop with undefined component type and more than one returned component.`)
                validProp = false;
              }
              replacementClasses.push(null);
            } else {
              replacementClasses.push(componentInfoObjects.allComponentClasses[propComponentType.toLowerCase()]);
            }
          }
        }

        if (!validProp) {
          return {
            newValues: {
              preliminaryReplacementClasses: null,
              propVariableObjs,
              stateVariablesRequested: null,
              validProp,
            }
          };
        }

        let stateVariablesRequested = [];

        for (let propVariableObj of propVariableObjs) {
          stateVariablesRequested.push({
            componentOrReplacementOf: dependencyValues.refTargetName,
            stateVariable: propVariableObj.varName,
          })
        }
        return {
          newValues: {
            preliminaryReplacementClasses: replacementClasses,
            propVariableObjs,
            stateVariablesRequested,
            validProp,
          }
        };

      }
    }

    stateVariableDefinitions.replacementClasses = {
      stateVariablesDeterminingDependencies: [
        "preliminaryReplacementClasses", "propVariableObjs", "refTargetName",
      ],
      returnDependencies: function ({ stateValues }) {

        let dependencies = {
          preliminaryReplacementClasses: {
            dependencyType: "stateVariable",
            variableName: "preliminaryReplacementClasses",
          },
        };

        // if have more than one preliminary replacement class
        // or the one preliminary replacement class is defined,
        // then preliminary replacement classes are all we need
        if (!stateValues.preliminaryReplacementClasses
          || stateValues.preliminaryReplacementClasses.length > 1
          || stateValues.preliminaryReplacementClasses[0] !== null
        ) {
          return dependencies;
        }

        dependencies[`replacementComponentType`] = {
          dependencyType: "componentStateVariableComponentType",
          componentName: stateValues.refTargetName,
          variableName: stateValues.propVariableObjs[0].varName,
        }

        return dependencies;
      },
      definition: function ({ dependencyValues, componentInfoObjects }) {

        // if have only one dependency, then had all replacements class to start with
        if (Object.keys(dependencyValues).length === 1) {
          return { newValues: { replacementClasses: dependencyValues.preliminaryReplacementClasses } };
        }

        let replacementClasses = [
          componentInfoObjects.allComponentClasses[dependencyValues[`replacementComponentType`]]
        ];

        return { newValues: { replacementClasses } };
      },
    };


    stateVariableDefinitions.replacementClassesForProp = {
      stateVariablesDeterminingDependencies: ["refTarget", "useProp"],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        // If reffed a composite without using a prop
        // the replacement will be the composite itself
        // However, if one refs this ref with a prop, that ref will need to know
        // the ultimate non-composite replacement class to determine
        // if the prop is valid

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let refTargetClass = componentInfoObjects.allComponentClasses[stateValues.refTarget.componentType];

        let dependencies = {};

        if (!stateValues.useProp && compositeClass.isPrototypeOf(refTargetClass) &&
          refTargetClass.refPropOfReplacements
        ) {
          dependencies.refTargetReplacementClassesForProp = {
            dependencyType: "componentStateVariable",
            componentName: stateValues.refTarget.componentName,
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
        if (dependencyValues.refTargetReplacementClassesForProp) {
          replacementClassesForProp = dependencyValues.refTargetReplacementClassesForProp
        } else {
          replacementClassesForProp = dependencyValues.replacementClasses;
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
            if (!["replacementClasses", "useProp", "validProp"].includes(property) && !(property in propertiesObject)) {
              if (dependencyValues[property] !== null) {
                validProperties = false;
                console.warn(`Invalid property ${property} for reference to component of type ${targetClass.componentType}`)
                break;
              }
            }
          }
        }

        return { newValues: { validPropertiesSpecified: validProperties } }
      },
    };

    stateVariableDefinitions.readyToExpandWhenResolved = {
      stateVariablesDeterminingDependencies: [
        "refTarget", "useProp"
      ],
      returnDependencies: function ({ stateValues, componentInfoObjects }) {

        let dependencies = {
          validPropertiesSpecified: {
            dependencyType: "stateVariable",
            variableName: "validPropertiesSpecified"
          },
        }

        let compositeClass = componentInfoObjects.allComponentClasses._composite;
        let refTargetClass = componentInfoObjects.allComponentClasses[stateValues.refTarget.componentType];

        // if reffing a composite, not ready to expand unless composite is ready to expand
        // Exception: if reffing a prop of a composite and that composite doesn't use
        // replacements for props, then don't need to check if that composite is ready to expand
        if (compositeClass.isPrototypeOf(refTargetClass) &&
          (!stateValues.useProp || refTargetClass.refPropOfReplacements)
        ) {
          dependencies.refTargetReady = {
            dependencyType: "componentStateVariable",
            componentName: stateValues.refTarget.componentName,
            variableName: "readyToExpandWhenResolved"
          }
        }

        return dependencies;

      },
      definition: function () {
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };


    return stateVariableDefinitions;

  }



  updateStateUnused() {


    // add original reference dependencies
    this.addReferenceDependencies({ target: this.state.originalRefTarget });


    this.state.previousRefTarget = this.state.refTarget;

    if (this.state.previousRefTarget !== undefined && this.state.targetInactive) {
      this.state.targetPrevInactive = true;
    } else {
      this.state.targetPrevInactive = false;
    }

    // if childnumber is specified, determine new refTarget
    // it might be undefined if childnumber is not a valid value
    if (this.state.childnumberChild) {
      if (this.state.childnumberChild.unresolvedState.number) {
        this.unresolvedState.refTarget = true;
        this.state.refTarget = undefined;
        return;
      }
      // don't bother checking for changes in childnumber, just set it
      this.state.childnumber = this.state.childnumberChild.state.number;
    } else if (this.state.childnumber !== undefined && !this._state.childnumber.essential) {
      delete this.state.childnumber;
    }

    let childnumber = this.state.childnumber;

    if (childnumber !== undefined) {
      this.state.refTarget = undefined;

      // replace refTarget with child if childnumber set
      let childIndex = childnumber - 1;
      if (!Number.isInteger(childIndex) || childIndex < 0) {
        console.log("Invalid child number");
      } else if (childIndex < this.state.originalRefTarget.activeChildren.length) {
        this.state.refTarget = this.state.originalRefTarget.activeChildren[childIndex];
      }
    } else {
      this.state.refTarget = this.state.originalRefTarget;
    }

    if (this.state.refTarget === undefined) {
      return;
    }

    let refTarget = this.state.refTarget;

    if (refTarget.componentName === this.componentName) {
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
        component: refTarget,
        standardComponentClasses: this.standardComponentClasses,
      })

      if (result.success !== true) {
        if (result.error === true) {
          let propChildState = this.state.propChild.state;
          let message = "Cannot reference prop " + propChildState.variableName;
          if (propChildState.authorProp !== undefined) {
            message += " (" + propChildState.authorProp + ")"
          }
          message += " from " + refTarget.componentName;
          // if(refTarget.doenetAttributes.componentName !== undefined) {
          //   message += " (" + refTarget.doenetAttributes.componentName + ")";
          // }
          this.unresolvedState.propData = true;
          this.unresolvedMessage = message;
          this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: { props: [this.state.propChild] } };
        } else if (result.unresolved === true) {
          this.unresolvedState.propData = true;
          this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: { props: [this.state.propChild] } };

        }

        this.state.refTarget = undefined;
        return;
      }

      this.state.propData = result.propData;
      delete this.unresolvedState.propData;
      delete this.unresolvedDependencies;
      this.state.availableClassProperties = result.availableClassProperties;
    } else {
      // no prop

      // if refTarget is has any unresolved state, then this ref is still unresolved
      // if(Object.keys(this.state.refTarget.unresolvedState).length > 0) {


      if (this.state.refTarget.state.unresolvedDependenceChain) {
        if (this.componentName in this.state.refTarget.state.unresolvedDependenceChain) {
          throw Error("Circular dependence involving " + this.componentName + " and " + this.state.refTarget.componentName);
        }
        if (this.state.unresolvedDependenceChain === undefined) {
          this.state.unresolvedDependenceChain = {};
        }
        this.mergeUnresolved(this.state.refTarget);

      }

      if (this.state.refTarget.unresolvedDependencies) {
        this.unresolvedDependencies = { [this.state.refTargetChild.componentName]: true };
        this.unresolvedState.availableClassProperties = true;
        this.state.refTarget = undefined; // so no replacements in recreateReplacements
        return;
      }

      delete this.unresolvedState.availableClassProperties;
      delete this.unresolvedDependencies;

      // available properties are those from replacement componentType
      // except that, if it is a composite with at least one replacement
      // we get properties from the class of the first replacement
      let rtForProperties = refTarget;
      while (rtForProperties instanceof this.allComponentClasses._composite) {
        if (rtForProperties.replacements.length === 0) {
          break;
        }
        // TODO: not sure if just taking the first component is the correct idea
        // because we now apply properties to all the replacements
        // Maybe have the availableClassProperties be the union of the properties
        // of all the replacement classes?
        rtForProperties = rtForProperties.replacements[0];
      }

      if (rtForProperties instanceof this.allComponentClasses.string) {
        // if string (which doesn't have properties), use base component
        this.state.availableClassProperties = this.allComponentClasses._base.createPropertiesObject({
          standardComponentClasses: this.standardComponentClasses
        });
      } else {
        let replacementClassForProperties = this.standardComponentClasses[rtForProperties.componentType];

        this.state.availableClassProperties = replacementClassForProperties.createPropertiesObject({
          standardComponentClasses: this.standardComponentClasses
        });
      }
    }

    // add state of reference target for any state values that
    // correspond to properties
    // and haven't been specified as properties on ref
    this.copyPropertiesFromRefTarget();

    this.verifyValidProperties();

    this.state.targetInactive = this.state.refTarget.inactive;

    // console.log("Resolved ref");
    // console.log(this.refTarget);

    if (trackChanges.getVariableChanges({ component: this, variable: "childnumber" })) {

      // if used a childnumber, change dependency of originalRefTarget to denote childnumber
      // and add a dependency to the new refTarget
      if (this.state.childnumber !== undefined) {
        this.downstreamDependencies[this.state.originalRefTarget.componentName].childnumber = this.state.childnumber;
        if (this.state.refTarget !== undefined) {
          this.downstreamDependencies[this.state.refTarget.componentName] = {
            dependencyType: "reference",
          }
        }
      }
    }

    if (trackChanges.getVariableChanges({ component: this, variable: "refTarget" })) {

      if (this.state.refTarget !== undefined) {
        if (this.state.propChild === undefined) {
          // if didn't use a prop, then add downstream dependencies
          // to all active descendants of the refTarget
          // (unless descendants not shadowed because use state variables for references)
          // and indicate they will be shadowed.
          // This overwrites the original dependency of the refTarget itself
          this.addReferenceDependencies({
            target: this.state.refTarget,
            recursive: true,
            shadowed: true
          });
        } else {
          // change downstream dependency to show that used a prop
          this.downstreamDependencies[this.state.originalRefTarget.componentName].prop = this.state.propChild.componentName;
          if (this.state.refTarget !== this.state.originalRefTarget) {
            this.addReferenceDependencies({ target: this.state.refTarget });
            this.downstreamDependencies[this.state.refTarget.componentName].prop = this.state.propChild.componentName;
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

    let serializedState = serializeFunctions.doenetMLToSerializedState({ doenetML: newDoenetMLs[0], standardComponentClasses: this.standardComponentClasses, allComponentClasses: this.allComponentClasses });

    serializedState = serializeFunctions.scrapeOffAllDoumentRelated(serializedState);

    serializeFunctions.createComponentsFromProps(serializedState, this.standardComponentClasses);

    // need idRng
    serializeFunctions.createComponentNames({ serializedState, componentTypesTakingComponentNames: this.componentTypesTakingComponentNames, allComponentClasses: this.allComponentClasses });

    this.componentNameToPreserializedName(serializedState, this.componentTypesTakingComponentNames);

    serializeFunctions.gatherVariantComponents({
      serializedState,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      allComponentClasses: this.allComponentClasses,
    });

    this.requestUpdate({
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
        let refTargetName;
        for (let child of serializedComponent.children) {
          if (child.componentType === "string") {
            child.state.value = this.componentName + child.state.value;
            break;
          }
        }
        serializedComponent.refTargetComponentName = refTargetName;
      }
      // recurse to children
      if (serializedComponent.children !== undefined) {
        this.componentNameToPreserializedName(serializedComponent.children, componentTypesTakingComponentNames);
      }
    }
  }

  // TODO: need to fix this?
  serializeOld(parameters = {}) {

    let useReplacements = parameters.forReference || this.state.contentIdChild || this.state.useReplacementsWhenSerialize;


    // TODO: Need to determine how to implement this with new state variable
    // as we no longer have access to refTarget's ancestors

    // if (parameters.forReference !== true && parameters.savingJustOneComponent) {
    //   let oneComponentBeingSaved = parameters.savingJustOneComponent;

    //   // We're saving a single component (and its descendants).
    //   // If we have a ref to a component that isn't a descendant
    //   // of the one component, we need to serialize its replacements
    //   // (as a group) instead of serializing the ref to the outside component

    //   if (!this.stateValues.refTarget.ancestors.includes(oneComponentBeingSaved)) {
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

      if (parameters.forReference !== true) {
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

      // record component name of refTarget
      serializedState.refTargetComponentName = this.stateValues.refTargetName;

      return serializedState;
    }
  }

  static createSerializedReplacements({ component, components, getComponentNamesForProp }) {

    // if (component.state.contentIDChild !== undefined) {
    //   if (!component.state.serializedStateForContentId) {
    //     return { replacements: [] };
    //   }
    // }

    let serializedCopy;

    // if (component.state.serializedContent !== undefined) {
    //   if (component.state.serializedContent.length === 0) {
    //     serializedCopy = [];
    //   } else {
    //     serializedCopy = deepClone(component.state.serializedContent);

    //     // top level replacements need state so that can
    //     // add any properties specified by ref
    //     for (let comp of serializedCopy) {
    //       if (comp.state === undefined) {
    //         comp.state = {};
    //       }
    //     }
    //   }
    // } else {


    if (!component.stateValues.refTarget) {
      return { replacements: [] };
    }

    // if creating reference from a prop
    // manually create the serialized state
    if (component.stateValues.useProp) {
      let componentOrReplacementNames = getComponentNamesForProp(component.stateValues.refTargetName);

      return {
        replacements: refReplacementFromProp({
          component, components, componentOrReplacementNames
        })
      };
    }

    // TODO: check if inactive?

    // if creating reference directly from the target component,
    // create a serialized copy of the entire component
    let target = components[component.stateValues.refTarget.componentName];

    // all target descendants have to be resolved to be able to successfully expand ref
    // Rationale: to create the reference shadow, core will need to
    // evaluate all state variables to determine which are essential

    // if (!this.allVariablesDescendantsReplacementsResolved(target)) {
    //   return { notReadyToExpand: true };
    // }

    serializedCopy = target.serialize({ forReference: true });
    serializedCopy = [serializedCopy];

    // console.log("refTarget");
    // console.log(component.state.refTarget);
    // console.log("serializedCopy");
    // console.log(serializedCopy);

    return { replacements: postProcessRef({ serializedComponents: serializedCopy, componentName: component.componentName }) };

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


  static calculateReplacementChanges({ component, componentChanges, components }) {

    // console.log("Calculating replacement changes for " + component.componentName);

    let replacementChanges = [];

    // TODO: determine how to calculate replacement changes with new conventions

    // TODO: may need to address the case that the actual refTarget was deleted

    return replacementChanges;

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

    //       // top level replacement needs any properties specified by ref
    //       if (serializedCopy[0].state === undefined) {
    //         serializedCopy[0].state = {};
    //       }
    //       component.addPropertiesFromRef({ serializedCopy: serializedCopy[0], includeAllProperties: true });
    //       serializedCopy = postProcessRef({ serializedComponents: serializedCopy, componentName: component.componentName, addShadowDependencies: false });
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
    // if (component.state.refTarget === undefined || component.state.targetInactive) {
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

    // // check if refTarget has changed or new active
    // if (component.state.previousRefTarget === undefined ||
    //   component.state.refTarget.componentName !== component.state.previousRefTarget.componentName ||
    //   component.state.targetPrevInactive) {

    //   this.recreateReplacements({ component, replacementChanges, components });

    //   return replacementChanges;
    // }

    // for all references determined from ref itself
    // check if they differ from refTarget
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

    // if ref determined by prop
    // don't change replacements
    // unless have an array
    if (component.state.propChild !== undefined) {

      // don't change replacements unless
      // the number of components or their component types changed
      let testReplacementChanges = [];
      this.recreateReplacements({ component, replacementChanges: testReplacementChanges, components });

      let newSerializedReplacements = [];
      let redoReplacements = false;

      if (testReplacementChanges.length > 0) {
        let changeInstruction = testReplacementChanges[0];
        newSerializedReplacements = changeInstruction.serializedReplacements;
        if (newSerializedReplacements === undefined) {
          // first instruction isn't an add
          // (but a moveDependency, addDependency, or delete)
          redoReplacements = true;
        } else {

          if (newSerializedReplacements.length !== component.replacements.length) {
            redoReplacements = true;
          } else {
            for (let ind = 0; ind < newSerializedReplacements.length; ind++) {
              if (newSerializedReplacements[ind].componentType !==
                component.replacements[ind].componentType) {
                redoReplacements = true;
                break;
              }
            }
          }
        }
      }

      // check if have a version that changed
      if (!redoReplacements) {
        if (newSerializedReplacements.length > 0) {
          let firstNew = newSerializedReplacements[0];
          let firstOld = component.replacements[0];
          let newVersion;
          if (firstNew.state) {
            newVersion = firstNew.state._version;
          }
          let oldVersion = firstOld.state._version;
          if (newVersion !== oldVersion) {
            redoReplacements = true;
          }
        }
      }
      // check next level, i.e., children of replacements
      // TODO: how many levels should we check?
      // should that be a parameter of the replacement?
      // TODO: should check component type of children?
      if (!redoReplacements) {
        for (let ind = 0; ind < newSerializedReplacements.length; ind++) {
          if (newSerializedReplacements[ind].children === undefined ||
            newSerializedReplacements[ind].children.length === 0) {
            if (component.replacements[ind].definingChildren !== undefined &&
              component.replacements[ind].definingChildren.length !== 0) {
              redoReplacements = true;
              break;
            }
          } else if (component.replacements[ind].definingChildren === undefined ||
            component.replacements[ind].definingChildren.length === 0) {
            redoReplacements = true;
            break;
          } else {
            if (newSerializedReplacements[ind].children.length !==
              component.replacements[ind].definingChildren.length) {
              redoReplacements = true;
              break;
            }
          }
        }
      }

      if (redoReplacements) {
        replacementChanges.push(...testReplacementChanges);
      }

      // console.log(replacementChanges);
      return replacementChanges;
    }

    // ref not determined by a prop

    // if(componentChanges.length > 1) {
    //   console.log("****** if had multiple adds or deletes, might not be putting children in right place. ******");
    // }

    // look for changes that are in downstream dependencies
    let additionalReplacementChanges = processChangesForReplacements({
      componentChanges: componentChanges,
      componentName: component.componentName,
      downstreamDependencies: component.downstreamDependencies,
      components: components
    })
    replacementChanges.push(...additionalReplacementChanges);

    // console.log(replacementChanges);

    return replacementChanges;
  }

  static recreateReplacements({ component, replacementChanges, components }) {
    // give instructions to move dependency to component.state.refTarget
    if (component.state.previousRefTarget !== undefined &&
      component.state.previousRefTarget.componentName in component.downstreamDependencies) {
      if (component.state.previousRefTarget.componentName !== component.state.refTarget.componentName) {
        let replacementInstruction = {
          changeType: "moveDependency",
          dependencyDirection: "downstream",
          oldComponentName: component.state.previousRefTarget.componentName,
          newComponentName: component.state.refTarget.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true }
        };
        if (component.state.propChild === undefined) {
          replacementInstruction.recurseToChildren = true;
        } else {
          replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
        }
        replacementChanges.push(replacementInstruction);
      }
    }
    else {
      // since no previous refTarget, need to create new dependencies
      let replacementInstruction = {
        changeType: "addDependency",
        dependencyDirection: "downstream",
        newComponentName: component.state.refTarget.componentName,
        dependencyType: "reference",
        otherAttributes: { shadowed: true }
      };
      if (component.state.propChild === undefined) {
        replacementInstruction.recurseToChildren = true;
      } else {
        replacementInstruction.otherAttributes.prop = component.state.propChild.componentName;
      }
      replacementChanges.push(replacementInstruction);
    }

    let newSerializedChildren;
    if (component.state.propChild !== undefined) {
      newSerializedChildren = this.refReplacementFromProp({ component, components });
    } else {
      newSerializedChildren = component.state.refTarget.serialize({ forReference: true });
      if (!Array.isArray(newSerializedChildren)) {
        newSerializedChildren = [newSerializedChildren];
      }

      if (newSerializedChildren.length > 0) {
        // top level replacement needs any properties specified by ref
        component.addPropertiesFromRef({ serializedCopy: newSerializedChildren[0] });
        newSerializedChildren = postProcessRef({ serializedComponents: newSerializedChildren, componentName: component.componentName });
      }
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
  }

}

export function refReplacementFromProp({ component, components, componentOrReplacementNames }) {


  let serializedReplacements = [];

  // TODO: correctly generalize to more than one component
  for (let [index, replacementClass] of component.stateValues.replacementClasses.entries()) {
    let propVariableObj = component.stateValues.propVariableObjs[index];
    let targetName = componentOrReplacementNames[index];
    let targetComponent = components[targetName];

    let componentType = replacementClass.componentType

    if (propVariableObj.isArray) {
      let arrayStateVarObj = targetComponent.state[propVariableObj.varName];

      // TODO: generalize to multi-dimensional arrays

      for (let ind in arrayStateVarObj.value) {
        let arrayKey = arrayStateVarObj.indexToKey(ind);
        serializedReplacements.push({
          componentType,
          downstreamDependencies: {
            [componentOrReplacementNames[index]]: [{
              dependencyType: "referenceShadow",
              refComponentName: component.componentName,
              propVariable: arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey),
              // arrayStateVariable: propVariableObj.varName,
              // arrayKey
            }]
          }
        })
      }
    } else if (propVariableObj.isArrayEntry) {

      let arrayStateVarObj = targetComponent.state[propVariableObj.arrayVarName];
      let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
        varEnding: propVariableObj.varEnding,
        arrayEntryPrefix: propVariableObj.arrayEntryPrefix,
      });

      // TODO: commented out below two conditiions to get tests to pass
      // Check why these conditions were added in the first place.

      // let entryValue = targetComponent.state[propVariableObj.varName].value;

      // if (entryValue !== undefined) {
      for (let arrayKey of arrayKeys) {
        // if (arrayStateVarObj.getArrayValue({ arrayKey }) !== undefined) {
        serializedReplacements.push({
          componentType,
          downstreamDependencies: {
            [componentOrReplacementNames[index]]: [{
              dependencyType: "referenceShadow",
              refComponentName: component.componentName,
              propVariable: arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey),
              // propVariable: propVariableObj.varName,
              // arrayStateVariable: propVariableObj.arrayVarName,
              // arrayKey
            }]
          }
        })
        // }
        // }

      }
    } else {
      serializedReplacements.push({
        componentType,
        downstreamDependencies: {
          [componentOrReplacementNames]: [{
            dependencyType: "referenceShadow",
            refComponentName: component.componentName,
            propVariable: propVariableObj.varName,
          }]
        }
      })
    }
  }

  return serializedReplacements;

}


export function postProcessRef({ serializedComponents, componentName, addShadowDependencies = true }) {
  // add downstream dependencies to original component
  // put internal and external references in right form

  let preserializedNamesFound = {};
  let refTargetNamesFound = {};

  postProcessRefSub({
    serializedComponents,
    preserializedNamesFound, refTargetNamesFound,
    componentName, addShadowDependencies,
  });

  for (let refTargetName in refTargetNamesFound) {

    for (let refComponent of refTargetNamesFound[refTargetName]) {
      // change state variable refTargetName to the componentName
      // in case below doesn't work (i.e., have more than 1 replacement)
      for (let child of refComponent.children) {
        if (child.componentType === "reftarget") {
          child.state.refTargetName = refTargetName;
          break;
        }
      }

    }

  }

  return serializedComponents;

}


function postProcessRefSub({ serializedComponents, preserializedNamesFound,
  refTargetNamesFound, componentName, addShadowDependencies = true }) {
  // recurse through serializedComponents
  //   - to add downstream dependencies to original component
  //   - collect names and reference targets

  for (let ind in serializedComponents) {
    let component = serializedComponents[ind];

    if (component.preserializedName) {

      preserializedNamesFound[component.preserializedName] = component;

      if (addShadowDependencies) {
        let downDep = {
          [component.preserializedName]: [{
            dependencyType: "referenceShadow",
            refComponentName: componentName,
          }]
        };
        if (component.state) {
          let stateVariables = Object.keys(component.state);
          downDep[component.preserializedName].downstreamStateVariables = stateVariables;
          downDep[component.preserializedName].upstreamStateVariables = stateVariables;
        }
        if (component.includeAnyDefiningChildren) {
          downDep[component.preserializedName].includeAnyDefiningChildren =
            component.includeAnyDefiningChildren;
        }
        if (component.includePropertyChildren) {
          downDep[component.preserializedName].includePropertyChildren =
            component.includePropertyChildren;
        }

        // create downstream dependency
        component.downstreamDependencies = downDep;
      }

    }

    if (component.componentType === "ref") {
      let refTargetName = component.refTargetComponentName;
      if (!refTargetName) {
        // if refTargetComponentName is undefined,
        // then the ref wasn't serialized via ref's serialize function
        // e.g., directly have a serialized ref from a select
        // in this case, just find ref target by looking at component
        // (and normalizing the form to have a reftarget child at same time)
        refTargetName = normalizeSerializedRef(component);

      }
      if (refTargetName) {
        if (!refTargetNamesFound[refTargetName]) {
          refTargetNamesFound[refTargetName] = [];
        }
        refTargetNamesFound[refTargetName].push(component);
      }
    }

    // recursion
    postProcessRefSub({
      serializedComponents: component.children,
      preserializedNamesFound,
      refTargetNamesFound,
      componentName,
      addShadowDependencies,
    });

    if (component.replacements) {
      postProcessRefSub({
        serializedComponents: component.replacements,
        preserializedNamesFound,
        refTargetNamesFound,
        componentName,
        addShadowDependencies,
      });
    }

  }
}


export function normalizeSerializedRef(serializedRef) {

  let refTargetName;

  // find the refTarget child
  let refTargetChild;
  for (let child of serializedRef.children) {
    if (child.componentType === "reftarget") {
      refTargetChild = child;
      break;
    }
  }
  // if no refTargetChild, then check for string child
  // which we have to do since sugar may not have been applied
  if (!refTargetChild) {
    for (let childInd = 0; childInd < serializedRef.children.length; childInd++) {
      let child = serializedRef.children[childInd];
      if (child.componentType === "string") {
        refTargetName = child.state.value;

        // delete the string child and create a refTarget child
        serializedRef.children[childInd] = {
          componentType: "reftarget",
          state: { refTargetName: refTargetName }
        }
      }
    }
  } else {
    // found a refTargetChild

    // first look to see if refTargetName is defined in state
    if (refTargetChild.state) {
      refTargetName = refTargetChild.state.refTargetName;
    }

    // if not, look for first string child
    if (!refTargetName && refTargetChild.children) {
      for (let childInd = 0; childInd < refTargetChild.children.length; childInd++) {
        let child = refTargetChild.children[childInd];
        if (child.componentType === "string") {
          refTargetName = child.state.value;

          // for consistency, we'll change the form of the reftarget
          // so that the refTargetName is stored in state
          // rather than child.
          // That way, we don't have to deal with cases
          // when processing the refs
          refTargetChild.children.splice(childInd, 1); // delete child
          childInd--;
          if (!refTargetChild.state) {
            refTargetChild.state = {};
          }
          refTargetChild.state.refTargetName = refTargetName; // store in state
        }
      }
    }
  }

  return refTargetName;
}


export function processChangesForReplacements({ componentChanges, componentName,
  downstreamDependencies, components }) {
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
            dep2.refComponentName === componentName) {
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

      let newSerializedChildren = childrenToShadow.map(x => x.serialize({ forReference: true }));
      // flatten array
      newSerializedChildren = newSerializedChildren.reduce((a, c) => Array.isArray(c) ? [...a, ...c] : [...a, c], [])

      if (newSerializedChildren.length === 0) {
        continue;
      }

      newSerializedChildren = postProcessRef({ serializedComponents: newSerializedChildren, componentName });
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
            dep.refComponentName === componentName) {
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

      let newSerializedChildren = replacementsToShadow.map(x => x.serialize({ forReference: true }));
      // flatten array
      newSerializedChildren = newSerializedChildren.reduce((a, c) => Array.isArray(c) ? [...a, ...c] : [...a, c], [])

      if (newSerializedChildren.length === 0) {
        continue;
      }

      newSerializedChildren = postProcessRef({ serializedComponents: newSerializedChildren, componentName });

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
              dep.refComponentName === componentName) {
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
      dep.refComponentName === thisComponentName) {
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
  // but would become of a topLevel replacement of this ref

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
      dep.refComponentName === thisComponentName) {
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