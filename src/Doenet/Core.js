import * as ComponentTypes from './ComponentTypes'
import readOnlyProxyHandler from './ReadOnlyProxyHandler';
import ParameterStack from './ParameterStack';
import availableRenderers from './AvailableRenderers';
import Numerics from './Numerics';
import MersenneTwister from 'mersenne-twister';
import me from 'math-expressions';
import { createUniqueName } from './utils/naming';
import * as serializeFunctions from './utils/serializedStateProcessing';
import { gatherDescendants } from './utils/descendants';
import crypto from 'crypto';
import { deepCompare, deepClone } from './utils/deepFunctions';
import createStateProxyHandler from './StateProxyHandler';
import { postProcessCopy } from './utils/copy';
import { flattenDeep, mapDeep } from './utils/array';

// string to componentClass: this.allComponentClasses["string"]
// componentClass to string: componentClass.componentType
// validTags: Object.keys(this.standardComponentClasses);


export default class Core {
  constructor({ doenetML, doenetState, parameters, requestedVariant,
    externalFunctions, flags = {}, coreReadyCallback, coreUpdatedCallback }) {
    // console.time('start up time');

    this.numerics = new Numerics();
    this.flags = new Proxy(flags, readOnlyProxyHandler); //components shouldn't modify flags

    this.externalFunctions = externalFunctions;
    if (externalFunctions === undefined) {
      this.externalFunctions = {};
    }

    this.requestUpdate = this.requestUpdate.bind(this);
    this.requestAction = this.requestAction.bind(this);
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this._requestAnimationFrame = this._requestAnimationFrame.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.expandDoenetMLsToFullSerializedState = this.expandDoenetMLsToFullSerializedState.bind(this);
    this.finishCoreConstruction = this.finishCoreConstruction.bind(this);
    this.getStateVariableValue = this.getStateVariableValue.bind(this);
    this.setUpStateVariableDependencies = this.setUpStateVariableDependencies.bind(this);
    this.submitResponseCallBack = this.submitResponseCallBack.bind(this);

    this.coreUpdatedCallback = coreUpdatedCallback;
    this._standardComponentClasses = ComponentTypes.standardComponentClasses();
    this._allComponentClasses = ComponentTypes.allComponentClasses();
    this._componentTypesTakingComponentNames = ComponentTypes.componentTypesTakingComponentNames();
    this._componentTypesCreatingVariants = ComponentTypes.componentTypesCreatingVariants();
    this._componentTypeWithPotentialVariants = ComponentTypes.componentTypeWithPotentialVariants();

    this._allPossibleProperties = this.createAllPossibleProperties();

    this.stateVariableInfo = {};
    for (let componentType in this.allComponentClasses) {
      Object.defineProperty(this.stateVariableInfo, componentType, {
        get: function () {
          let info = this.allComponentClasses[componentType].returnStateVariableInfo({
            standardComponentClasses: this.standardComponentClasses,
            allComponentClasses: this.allComponentClasses,
          });
          delete this.stateVariableInfo[componentType];
          return this.stateVariableInfo[componentType] = info;
        }.bind(this),
        configurable: true
      })
    }


    this.componentInfoObjects = {
      standardComponentClasses: this.standardComponentClasses,
      allComponentClasses: this.allComponentClasses,
      componentTypesTakingComponentNames: this.componentTypesTakingComponentNames,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      componentTypeWithPotentialVariants: this.componentTypeWithPotentialVariants,
      allPossibleProperties: this.allPossibleProperties,
      isInheritedComponentType: this.isInheritedComponentType,
      stateVariableInfo: this.stateVariableInfo,
    };

    this.animationIDs = {};
    this.lastAnimationID = 0;
    this.requestedVariant = requestedVariant;
    this.coreReadyCallback = coreReadyCallback;

    // console.time('serialize doenetML');

    this.parameterStack = new ParameterStack(parameters);
    this.setUpRng();


    let serializedState;

    if (doenetState) {
      serializedState = doenetState;
      let contentId;
      if (serializedState[0].doenetAttributes) {
        contentId = serializedState[0].doenetAttributes.contentId;
      }
      if (contentId === undefined) {
        contentId = "";
      }
      console.log(`contentId from doenetState: ${contentId}`)
      this.finishCoreConstruction({
        contentIds: [contentId],
        fullSerializedStates: [serializedState],
        finishSerializedStateProcessing: false
      });
    } else {
      const hash = crypto.createHash('sha256');
      hash.update(doenetML);
      let contentId = hash.digest('hex');
      this.expandDoenetMLsToFullSerializedState({
        contentIds: [contentId],
        doenetMLs: [doenetML],
        callBack: this.finishCoreConstruction
      })
    }
  }

  finishCoreConstruction({
    contentIds,
    fullSerializedStates,
    finishSerializedStateProcessing = true,
    calledAsynchronously = false
  }) {

    this.contentId = contentIds[0];

    let serializedState = fullSerializedStates[0];

    serializeFunctions.addDocumentIfItsMissing(serializedState);

    if (finishSerializedStateProcessing) {

      serializeFunctions.createComponentNames({
        serializedState,
        componentTypesTakingComponentNames: this.componentTypesTakingComponentNames,
        allComponentClasses: this.allComponentClasses,
      });
    } else {
      if (serializedState[0].doenetAttributes === undefined) {
        serializedState[0].doenetAttributes = {};
      }

      // TODO: why are we hard coding a document name here?
      // Seems like a bad idea, author could have named document something esle
      // serializedState[0].doenetAttributes.componentName = "/_document1";
    }


    this.documentName = serializedState[0].doenetAttributes.componentName;
    serializedState[0].doenetAttributes.contentId = this.contentId;

    this._components = {};
    this.renderedComponentInstructions = {};
    this.componentsWithChangedChildrenToRender = new Set([]);

    this.downstreamDependencies = {};
    this.upstreamDependencies = {};
    this.circularCheckPassed = {};

    this._renderComponents = [];
    this._renderComponentsByName = {};
    this._graphRenderComponents = [];

    this.componentIdentityDependencies = {
      descendantDependenciesByAncestor: {},
      ancestorDependenciesByPotentialAncestor: {},
      replacementDependenciesByComposite: {},
      childDependenciesByParent: {},
      parentDependenciesByParent: {},
    }

    this.unsatisfiedChildLogic = {};
    this.childLogicWaitingOnSugar = {};

    // console.timeEnd('serialize doenetML');

    this.setUpVariants(serializedState);

    //Make these variables available for cypress
    window.state = {
      components: this._components,
      renderedComponentInstructions: this.renderedComponentInstructions,
      renderedComponentTypes: this.renderedComponentTypes,
      downstreamDependencies: this.downstreamDependencies,
      upstreamDependencies: this.upstreamDependencies,
      core: this,
      componentInfoObjects: this.componentInfoObjects,
    }

    this.changedStateVariables = {};

    this.addComponents({
      serializedState: serializedState,
      initialAdd: true,
      applySugar: true,
    })

    this.rendererTypesInDocument = this.document.allPotentialRendererTypes;


    // evalute itemScores so that will be fresh
    // and can detect changes when it is marked stale
    this.document.stateValues.itemScores;

    // console.log(serializedState)
    // console.timeEnd('start up time');
    console.log("** components at the end of the core constructor **");
    console.log(this._components);

    if (calledAsynchronously) {
      this.coreReadyCallback({
        doenetTags: this.doenetState,
      })
    } else {
      setTimeout(() => this.coreReadyCallback({
        doenetTags: this.doenetState,
      }), 0)
    }

  }

  setUpVariants(serializedState) {

    let variantComponents = serializeFunctions.gatherVariantComponents({
      serializedState,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      allComponentClasses: this.allComponentClasses,
    });

    if (this.requestedVariant !== undefined) {
      this.parameterStack.parameters.variant = this.requestedVariant;
    }

    variantComponents[0].variants.desiredVariant = this.parameterStack.parameters.variant;

  }

  setUpRng() {

    // from https://stackoverflow.com/a/7616484
    this.parameterStack.parameters.hashStringToInteger = function (s) {
      var hash = 0, i, chr;
      if (s.length === 0)
        return hash;
      for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
    if (this.parameterStack.parameters.seed === undefined) {
      // this.parameterStack.parameters.seed = '47';
      this.parameterStack.parameters.seed = this.parameterStack.parameters.hashStringToInteger(Date.now().toString());
    }
    this.parameterStack.parameters.selectRng = new MersenneTwister(this.parameterStack.parameters.seed);
    this.parameterStack.parameters.rngClass = MersenneTwister;
  }

  expandDoenetMLsToFullSerializedState({ contentIds, doenetMLs, callBack }) {

    // TODO: check if this works for new core setup

    let serializedStates = [];
    let contentIdComponents = {};

    for (let doenetML of doenetMLs) {

      let serializedState = serializeFunctions.doenetMLToSerializedState({
        doenetML,
        standardComponentClasses: this.standardComponentClasses,
        allComponentClasses: this.allComponentClasses,
      });

      serializeFunctions.createComponentsFromProps(serializedState, this.standardComponentClasses);

      serializedStates.push(serializedState);

      let newContentIdComponents = serializeFunctions.findContentIdRefs({ serializedState });

      for (let contentId in newContentIdComponents) {
        if (contentIdComponents[contentId] === undefined) {
          contentIdComponents[contentId] = []
        }
        contentIdComponents[contentId].push(...newContentIdComponents[contentId])
      }

    }

    let contentIdList = Object.keys(contentIdComponents);
    if (contentIdList.length > 0) {
      // found refs with contentIds
      // so look up those contentIds, convert to doenetMLs, and recurse on those doenetMLs

      let mergedContentIdSerializedStateIntoRef = function ({ fullSerializedStates }) {

        for (let [ind, contentId] of contentIdList.entries()) {
          let serializedStateForContentId = fullSerializedStates[ind];
          for (let originalRefWithContentId of contentIdComponents[contentId]) {
            if (originalRefWithContentId.state === undefined) {
              originalRefWithContentId.state = {};
            }
            originalRefWithContentId.state.serializedStateForContentId = serializedStateForContentId;
          }
        }

        // Note: this is the callback from the enclosing expandDoenetMLsToFullSerializedState
        // so we call it with the contentIds and serializedState from that context
        callBack({
          contentIds,
          fullSerializedStates: serializedStates,
          calledAsynchronously: true,
        })
      }.bind(this);

      let recurseToAdditionalDoenetMLs = function ({ newDoenetMLs, newContentIds, success, message }) {

        if (!success) {
          console.warn(message);
        }

        this.expandDoenetMLsToFullSerializedState({
          doenetMLs: newDoenetMLs,
          contentIds: newContentIds,
          callBack: mergedContentIdSerializedStateIntoRef,
        });
      }.bind(this);

      this.externalFunctions.contentIdsToDoenetMLs({
        contentIds: contentIdList,
        callBack: recurseToAdditionalDoenetMLs
      });

    } else {
      // end recursion when don't find additional refs with contentIds
      callBack({
        contentIds,
        fullSerializedStates: serializedStates,
        calledAsynchronously: false,
      });
    }

  }

  addComponents({ serializedState, parent, indexOfDefiningChildren, applySugar = false, initialAdd = false }) {

    if (!Array.isArray(serializedState)) {
      serializedState = [serializedState];
    }

    let parentName;
    let ancestors = [];
    if (parent) {
      parentName = parent.componentName;
      ancestors = [
        {
          componentName: parentName,
          componentClass: parent.constructor,
        },
        ...parent.ancestors
      ];

    }

    let createResult = this.createIsolatedComponents({
      serializedState, applySugar,
      ancestors,
    });

    if (createResult.success !== true) {
      throw Error(createResult.message);
    }

    const newComponents = createResult.components;

    let deletedComponents = {};
    let addedComponents = {};
    newComponents.forEach(x => addedComponents[x.componentName] = x);

    if (initialAdd === true) {
      if (newComponents.length !== 1) {
        throw Error("Initial components need to be an array of just one component.");
      }
      // this.setAncestors(newComponents[0]);
      this.document = newComponents[0];
      this.initializeRenderedComponentInstruction(this.document);

    } else {
      if (parent === undefined) {
        throw Error("Must specify parent when adding components.");
      }
      if (indexOfDefiningChildren === undefined) {
        indexOfDefiningChildren = parent.definingChildren.length;
      }

      if (parent.isShadow === true) {
        throw Error("Cannot add components to a shadow component " + parent.componentName);
      }

      let addResults = this.addChildren({
        parent,
        indexOfDefiningChildren: indexOfDefiningChildren,
        newChildren: newComponents,
      });
      if (!addResults.success) {
        throw Error("Couldn't satisfy child logic result.  Need informative error message");
      }
      Object.assign(addedComponents, addResults.addedComponents);
      Object.assign(deletedComponents, addResults.deletedComponents);

      this.updateRendererInstructions({ componentNames: this.componentAndRenderedDescendants(parent) });
    }

    this.finishUpdate({
      addedComponents: addedComponents,
      deletedComponents: deletedComponents,
      init: initialAdd,
    });

    return newComponents;
  }


  updateRendererInstructions({ componentNames, sourceOfUpdate }) {

    let renderersToUpdate = [];
    let deletedRenderers = [];

    let instructions = [];

    // evaluate childrenToRender on all componentNames
    // so can detect if any changes
    // (as they are automatically added to this.componentsWithChangedChildrenToRender)
    for (let componentName of componentNames) {
      let unproxiedComponent = this._components[componentName];
      if (unproxiedComponent) {
        // evaluates, getter, if it exists,
        // which will populate this.componentsWithChangedChildrenToRender
        unproxiedComponent.stateValues.childrenToRender;

        if (componentName in this.renderedComponentInstructions) {
          renderersToUpdate.push(componentName);
        }

      }
    }

    for (let componentName of this.componentsWithChangedChildrenToRender) {
      if (componentName in this.renderedComponentInstructions) {
        // check to see if current children who render are
        // different from last time rendered

        let currentChildNames = [];
        let unproxiedComponent = this._components[componentName];
        if (unproxiedComponent) {
          currentChildNames = unproxiedComponent.stateValues.childrenToRender;
        }


        let instructionChildren = this.renderedComponentInstructions[componentName].children;
        let previousChildNames = instructionChildren.map(x => x.componentName);


        // first delete previous children that are no longer in children
        // and create instructions to delete the renderers

        let keptChildren = [];
        let deletedChildren = [];

        for (let [ind, childName] of previousChildNames.entries()) {
          if (currentChildNames.includes(childName)) {
            keptChildren.push(childName);
          } else {
            deletedChildren.push({ childName, ind })
          }
        }

        for (let { childName, ind } of deletedChildren.reverse()) {
          let deletedComponentNames = this.deleteFromRenderedComponentInstructions({
            componentName: childName,
            recurseToChildren: true
          });
          instructionChildren.splice(ind, 1);

          instructions.push({
            instructionType: "deleteRenderers",
            parentName: componentName,
            firstIndexInParent: ind,
            numberChildrenDeleted: 1,
            deletedComponentNames
          })

          deletedRenderers.push(...deletedComponentNames);
        }


        // next permute the kept children to be in the order of the current children
        // and create instructions for the same permutations of the renderers

        let desiredOrderForKeptChildren = currentChildNames.filter(x => keptChildren.includes(x))

        for (let i = 0; i < desiredOrderForKeptChildren.length; i++) {
          if (keptChildren[i] !== desiredOrderForKeptChildren[i]) {
            let prevIndex = keptChildren.indexOf(desiredOrderForKeptChildren[i]);
            // swap in renderedComponentInstructions
            [instructionChildren[i], instructionChildren[prevIndex]]
              = [instructionChildren[prevIndex], instructionChildren[i]];

            // swap in keptChildren
            [keptChildren[i], keptChildren[prevIndex]]
              = [keptChildren[prevIndex], keptChildren[i]];

            instructions.push({
              instructionType: "swapChildRenderers",
              parentName: componentName,
              index1: i,
              index2: prevIndex
            })

          }
        }


        // last, add the new children and create instructions to add the renderers
        for (let [ind, name] of currentChildNames.entries()) {
          if (!previousChildNames.includes(name)) {

            let comp = this._components[name];
            if (comp && comp.rendererType) {

              let childToRender = this.initializeRenderedComponentInstruction(comp);
              instructionChildren.splice(ind, 0, childToRender);

              instructions.push({
                instructionType: "addRenderer",
                componentName: comp.componentName,
                parentName: componentName,
                indexForParent: ind,
              })

            }
          }

        }

      }
    }

    // reset for next time
    this.componentsWithChangedChildrenToRender = new Set([]);

    renderersToUpdate = renderersToUpdate.filter(x => !deletedRenderers.includes(x))

    if (renderersToUpdate.length > 0) {
      let instruction = {
        instructionType: "updateStateVariable",
        renderersToUpdate,
        sourceOfUpdate,
      }
      instructions.push(instruction);
    }

    this.coreUpdatedCallback(instructions)

  }

  initializeRenderedComponentInstruction(component) {

    if (component.rendererType === undefined) {
      return;
    }

    let componentName = component.componentName;

    let childInstructions = [];
    if (component.stateValues.childrenToRender) {
      for (let childName of component.stateValues.childrenToRender) {
        let child = this._components[childName];
        if (!child || !child.rendererType) {
          continue;
        }
        childInstructions.push(
          this.initializeRenderedComponentInstruction(child)
        )
      }
    }

    this.componentsWithChangedChildrenToRender.delete(componentName);

    let stateForRenderer = {};
    for (let stateVariable in component.state) {
      if (component.state[stateVariable].forRenderer) {
        stateForRenderer[stateVariable] = component.state[stateVariable];
      }
    }

    this.renderedComponentInstructions[componentName] = {
      componentName: componentName,
      componentType: component.componentType,
      rendererType: component.rendererType,
      stateValues: new Proxy(stateForRenderer, createStateProxyHandler()),
      children: childInstructions,
      actions: component.actions,
    };

    return this.renderedComponentInstructions[componentName];
  }

  deleteFromRenderedComponentInstructions({
    componentName,
    recurseToChildren = true,
  }) {
    let deletedComponentNames = [componentName]
    if (recurseToChildren) {
      let componentInstruction = this.renderedComponentInstructions[componentName];
      if (componentInstruction) {
        for (let child of componentInstruction.children) {
          let additionalDeleted = this.deleteFromRenderedComponentInstructions({
            componentName: child.componentName,
            recurseToChildren,
          })
          deletedComponentNames.push(...additionalDeleted);
        }
      }
    }
    delete this.renderedComponentInstructions[componentName];

    return deletedComponentNames;
  }

  componentAndRenderedDescendants(component) {
    if (component === undefined) {
      return [];
    }

    let componentNames = [component.componentName];
    if (component.stateValues.childrenToRender) {
      for (let childName of component.stateValues.childrenToRender) {
        componentNames.push(...this.componentAndRenderedDescendants(this._components[childName]));
      }
    }
    return componentNames;
  }

  createIsolatedComponents({ serializedState, ancestors, applySugar = false,
    applyAdapters = true, shadow = false, compositesBeingExpanded = [] }
  ) {

    let updatesNeeded = {
      componentsTouched: [],
      compositesToExpand: new Set([]),
      compositesToUpdateReplacements: [],
      componentsToUpdateDependencies: [],
      unresolvedDependencies: {},
      unresolvedByDependent: {},
      deletedStateVariables: {},
      deletedComponents: {},
      itemScoreChanges: new Set(),
    }

    let previousUnsatisfiedChildLogic = Object.assign({}, this.unsatisfiedChildLogic);

    let createResult = this.createIsolatedComponentsSub({
      serializedState: serializedState,
      ancestors,
      applySugar, applyAdapters,
      shadow, updatesNeeded, compositesBeingExpanded
    });

    // console.log("createResult")
    // console.log(createResult)

    let newComponents = createResult.components;

    // console.log(JSON.parse(JSON.stringify(updatesNeeded.unresolvedDependencies)))
    // console.log(JSON.parse(JSON.stringify(updatesNeeded.unresolvedByDependent)))


    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      updatesNeeded.unresolvedMessage = "";
      this.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
    }


    this.updateDependencies(updatesNeeded, compositesBeingExpanded);


    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      console.log("have some unresolved");
      console.log(updatesNeeded.unresolvedDependencies);
      console.log(updatesNeeded.unresolvedByDependent);
      return { success: false, message: updatesNeeded.unresolvedMessage, updatesNeeded }
    }

    if (Object.keys(this.unsatisfiedChildLogic).length > 0) {
      let childLogicMessage = "";
      let newUnsatisfiedChildLogic = false;
      for (let componentName in this.unsatisfiedChildLogic) {
        childLogicMessage += `Invalid children for ${componentName}: ${this.unsatisfiedChildLogic[componentName].message} `;
        if (!(componentName in previousUnsatisfiedChildLogic)) {
          newUnsatisfiedChildLogic = true;
        }
      }
      if (newUnsatisfiedChildLogic) {
        return { success: false, message: childLogicMessage, updatesNeeded }
      }
    }

    return {
      success: true,
      components: newComponents,
      componentsTouched: [...new Set(updatesNeeded.componentsTouched)]
    }


  }

  createIsolatedComponentsSub({ serializedState, ancestors, applySugar = false,
    applyAdapters = true, shadow = false, updatesNeeded, compositesBeingExpanded,
    createNameContext = ""
  }
  ) {

    let newComponents = [];

    //TODO: last message
    let lastMessage = "";

    for (let [componentInd, serializedComponent] of serializedState.entries()) {

      // if already corresponds to a created component
      // add to array
      if (serializedComponent.createdComponent === true) {
        let newComponent = this._components[serializedComponent.componentName];
        newComponents.push(newComponent);

        // set ancestors, in case component has been moved (e.g., by sugar)
        this.setAncestors(newComponent, ancestors);
        // skip rest of processing, as they already occured for this component
        continue;
      }

      let componentClass;
      try {
        componentClass = this.standardComponentClasses[serializedComponent.componentType];
      } catch (e) {
        if (this.standardComponentClasses[serializedComponent.componentType] === undefined) {
          throw Error("Cannot create component of type " + serializedComponent.componentType);
        }
        throw e;
      }
      if (componentClass === undefined) {
        throw Error("Cannot create component of type " + serializedComponent.componentType);
      }

      // if have a componentName, use that for componentName
      // otherwise generate automatic name
      let componentName;
      if (serializedComponent.doenetAttributes !== undefined) {
        componentName = serializedComponent.doenetAttributes.componentName;
      }
      if (componentName === undefined) {
        // Note: assuming that document always has a name
        // so we never get here without an ancestor
        let longNameId = ancestors[0].componentName + "|" + createNameContext + "|";

        if (serializedComponent.uniqueIdentifier) {
          longNameId += serializedComponent.uniqueIdentifier;
        } else {
          longNameId += componentInd;
        }

        componentName = createUniqueName(serializedComponent.componentType, longNameId);
      }

      let createResult = this.createChildrenThenComponent({
        serializedComponent,
        componentName,
        ancestors,
        componentClass, applySugar,
        applyAdapters, shadow, updatesNeeded, compositesBeingExpanded
      });

      let newComponent = createResult.newComponent;
      newComponents.push(newComponent);


      // TODO: need to get message
      //lastMessage = createResult.lastMessage;

    }

    let results = { components: newComponents };

    return results;

  }

  createChildrenThenComponent({ serializedComponent, componentName,
    ancestors, componentClass,
    applySugar = false, applyAdapters = true, shadow = false,
    updatesNeeded, compositesBeingExpanded,
  }) {

    // first recursively create children
    let serializedChildren = serializedComponent.children;
    let definingChildren = [];
    let childrenToRemainSerialized = [];

    let ancestorsForChildren = [{ componentName, componentClass }, ...ancestors];

    // add a new level to parameter stack;
    this.parameterStack.push();
    let sharedParameters = this.parameterStack.parameters;


    // check if component has any properties to propagate to descendants
    let propertiesPropagated = this.propagateAncestorProps({
      componentClass, componentName, sharedParameters
    });

    if (componentClass.modifySharedParameters) {
      componentClass.modifySharedParameters({ sharedParameters, serializedComponent });
    }

    if (serializedChildren !== undefined) {

      let setUpVariant = false;
      let variantControlInd;
      let variantControlChild;

      if (componentClass.alwaysSetUpVariant || componentClass.setUpVariantIfVariantControlChild) {
        // look for variantControl child
        for (let [ind, child] of serializedChildren.entries()) {
          if (child.componentType === "variantcontrol" || (
            child.createdComponent && components[child.componentName].componentType === "variantcontrol"
          )) {
            variantControlInd = ind;
            variantControlChild = child;
            break;
          }
        }

        if (variantControlInd !== undefined || componentClass.alwaysSetUpVariant) {
          setUpVariant = true;
        }
      }

      if (setUpVariant) {

        if (variantControlInd !== undefined) {
          // if have desired variant value or index
          // add that information to variantControl child
          let desiredVariant = serializedComponent.variants.desiredVariant;
          if (desiredVariant !== undefined) {
            if (desiredVariant.index !== undefined) {
              variantControlChild.variants.desiredVariantNumber = desiredVariant.index;
            } else if (desiredVariant.value !== undefined) {
              variantControlChild.variants.desiredVariant = desiredVariant.value;
            }
          }

          if (serializedComponent.variants.uniquevariants) {
            sharedParameters.numberOfVariants = serializedComponent.variants.numberOfVariants;
          }

          // create variant control child
          let childrenResult = this.createIsolatedComponentsSub({
            serializedState: [variantControlChild],
            ancestors: ancestorsForChildren,
            applySugar, applyAdapters, shadow,
            updatesNeeded, compositesBeingExpanded,
            createNameContext: "variantControl"
          });

          definingChildren[variantControlInd] = childrenResult.components[0];

        }

        componentClass.setUpVariant({
          serializedComponent,
          sharedParameters,
          definingChildrenSoFar: definingChildren,
          allComponentClasses: this.allComponentClasses,
        });

        let indicesToCreate = [...serializedChildren.keys()].filter(v => v !== variantControlInd);
        let childrenToCreate = serializedChildren.filter((v, i) => i !== variantControlInd);

        let childrenResult = this.createIsolatedComponentsSub({
          serializedState: childrenToCreate,
          ancestors: ancestorsForChildren,
          applySugar, applyAdapters, shadow,
          updatesNeeded, compositesBeingExpanded
        });

        for (let [createInd, locationInd] of indicesToCreate.entries()) {
          definingChildren[locationInd] = childrenResult.components[createInd];
        }

      } else if (componentClass.keepChildrenSerialized) {
        let childrenAddressed = new Set([]);

        let keepSerializedInds = componentClass.keepChildrenSerialized({
          serializedComponent,
          allComponentClasses: this.allComponentClasses,
        });

        for (let ind of keepSerializedInds) {
          if (childrenAddressed.has(Number(ind))) {
            throw Error("Invalid instructions to keep children serialized from " + componentClass.componentType
              + ": child repeated");
          }
          childrenAddressed.add(Number(ind));
          childrenToRemainSerialized.push(serializedChildren[ind]);
        }

        // create any remaining children
        let childrenToCreate = [];
        let indicesToCreate = [];
        for (let [ind, child] of serializedChildren.entries()) {
          if (!(childrenAddressed.has(ind))) {
            childrenToCreate.push(child)
            indicesToCreate.push(ind);
          }
        }

        if (childrenToCreate.length > 0) {
          let childrenResult = this.createIsolatedComponentsSub({
            serializedState: childrenToCreate,
            ancestors: ancestorsForChildren,
            applySugar, applyAdapters, shadow,
            updatesNeeded, compositesBeingExpanded
          });

          for (let [createInd, locationInd] of indicesToCreate.entries()) {
            definingChildren[locationInd] = childrenResult.components[createInd];
          }
        }

      } else {

        //create all children

        let childrenResult = this.createIsolatedComponentsSub({
          serializedState: serializedChildren,
          ancestors: ancestorsForChildren,
          applySugar, applyAdapters, shadow,
          updatesNeeded, compositesBeingExpanded
        });

        definingChildren = childrenResult.components;
      }
    }


    let childLogic = componentClass.returnChildLogic({
      standardComponentClasses: this.standardComponentClasses,
      allComponentClasses: this.allComponentClasses,
      components: this.components,
      allPossibleProperties: this.allPossibleProperties,
      sharedParameters,
    });

    if (childLogic === undefined || typeof childLogic.applyLogic !== "function") {
      throw Error("Invalid component class " + componentClass.componentType +
        ": returnChildLogic must return a childLogic object")
    }

    let prescribedDependencies = {};

    if (serializedComponent.downstreamDependencies) {
      Object.assign(prescribedDependencies, serializedComponent.downstreamDependencies);
    }

    // propertiesPropagated contains those properties for which this component
    // has received a propagated value from its ancestors
    for (let property in propertiesPropagated) {
      let ancestorIdentity = propertiesPropagated[property];
      let ancestorName = ancestorIdentity.componentName;
      if (prescribedDependencies[ancestorName] === undefined) {
        prescribedDependencies[ancestorName] = [];
      }
      prescribedDependencies[ancestorName].push({
        dependencyType: "ancestorProp",
        property,
        ancestorIdentity
      })
    }

    let stateVariableDefinitions = this.createStateVariableDefinitions({
      childLogic,
      componentClass,
      prescribedDependencies,
      componentName,
    });

    // in case component with same name was deleted before, delete from deleteComponents and deletedStateVariable
    delete updatesNeeded.deletedComponents[componentName];
    delete updatesNeeded.deletedStateVariables[componentName];

    // create component itself
    let newComponent = new componentClass({
      componentName,
      ancestors,
      definingChildren,
      childLogic,
      stateVariableDefinitions,
      serializedChildren: childrenToRemainSerialized,
      serializedState: serializedComponent,
      standardComponentClasses: this.standardComponentClasses,
      allComponentClasses: this.allComponentClasses,
      allPossibleProperties: this.allPossibleProperties,
      isInheritedComponentType: this.isInheritedComponentType,
      componentTypesTakingComponentNames: this.componentTypesTakingComponentNames,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      shadow: shadow,
      requestUpdate: this.requestUpdate,
      requestAction: this.requestAction,
      availableRenderers: availableRenderers,
      allRenderComponents: this._renderComponentsByName,
      graphRenderComponents: this._graphRenderComponents,
      numerics: this.numerics,
      sharedParameters: sharedParameters,
      requestAnimationFrame: this.requestAnimationFrame,
      cancelAnimationFrame: this.cancelAnimationFrame,
      externalFunctions: this.externalFunctions,
      allowSugarForChildren: applySugar,
      flags: this.flags,
    });

    this.registerComponent(newComponent);

    for (let name in prescribedDependencies) {
      let depArray = prescribedDependencies[name];
      for (let dep of depArray) {
        if (dep.dependencyType === "referenceShadow") {
          let shadowInfo = {
            componentName: name
          }
          Object.assign(shadowInfo, dep);
          delete shadowInfo.dependencyType;
          newComponent.shadows = new Proxy(shadowInfo, readOnlyProxyHandler);

          let shadowedComponent = this._components[name];
          if (!shadowedComponent.shadowedBy) {
            shadowedComponent.shadowedBy = [];
          }
          shadowedComponent.shadowedBy.push(newComponent);

          break;
        }
      }
    }

    if (this.allComponentClasses._composite.isPrototypeOf(componentClass)) {
      // if composite was serialized with replacements
      // then save those serializedReplacements to be used when component is expanded
      if (serializedComponent.replacements !== undefined) {
        newComponent.serializedReplacements = serializedComponent.replacements;
      }
    }


    this.deriveChildResultsFromDefiningChildren(newComponent, updatesNeeded, compositesBeingExpanded);

    this.initializeComponentStateVariables(newComponent);

    // we can ignore result of applySugarOrAddSugarCreationStateVariables
    // because newComponent doesn't yet have dependencies set up
    this.applySugarOrAddSugarCreationStateVariables({
      component: newComponent,
      updatesNeeded, compositesBeingExpanded
    });

    this.setUpComponentDependencies({ component: newComponent });

    let { varsUnresolved } = this.resolveStateVariables({
      component: newComponent,
      updatesNeeded, compositesBeingExpanded,
    });

    this.addUnresolvedDependencies({ varsUnresolved, component: newComponent, updatesNeeded });

    // remove a level from parameter stack;
    this.parameterStack.pop();

    let results = { newComponent: newComponent };

    return results;

  }

  addUnresolvedDependencies({ varsUnresolved, component, updatesNeeded }) {
    // adds the varsUnresolved for component to
    // unresolvedDependencies and unresolvedByDependent of updatesNeeded

    if (Object.keys(varsUnresolved).length > 0) {
      if (!updatesNeeded.unresolvedDependencies[component.componentName]) {
        updatesNeeded.unresolvedDependencies[component.componentName] = {};
      }
      Object.assign(updatesNeeded.unresolvedDependencies[component.componentName],
        varsUnresolved);

      // calculate the reverse direction of unresolved dependencies
      for (let varName in varsUnresolved) {
        for (let dep of varsUnresolved[varName]) {
          if (!updatesNeeded.unresolvedByDependent[dep.componentName]) {
            updatesNeeded.unresolvedByDependent[dep.componentName] = {};
          }
          if (!updatesNeeded.unresolvedByDependent[dep.componentName][dep.stateVariable]) {
            updatesNeeded.unresolvedByDependent[dep.componentName][dep.stateVariable] = [];
          }

          // since a state variable could get re-designated as unresolved
          // while in the middle of it getting resolved,
          // it is possible that the dependency is already in unresolvedByDependent
          let alreadyIn = false;
          for (let oDep of updatesNeeded.unresolvedByDependent[dep.componentName][dep.stateVariable]) {
            if (oDep.componentName === component.componentName && oDep.stateVariable === varName) {
              alreadyIn = true;
              break;
            }
          }
          if (!alreadyIn) {
            updatesNeeded.unresolvedByDependent[dep.componentName][dep.stateVariable].push({
              componentName: component.componentName,
              stateVariable: varName,
            });
          }
        }
      }
    }
  }

  propagateAncestorProps({ componentClass, componentName, sharedParameters }) {

    let propertyObject = componentClass.createPropertiesObject({
      standardComponentClasses: this.standardComponentClasses,
      allPossibleProperties: this.allPossibleProperties
    });

    // check if this component class has properties to propagate to its descendants
    let propertiesToPropagate = {};
    for (let property in propertyObject) {
      if (propertyObject[property].propagateToDescendants) {
        propertiesToPropagate[property] = {
          componentName,
          componentType: componentClass.componentType
        };
      }
    }

    // check if ancestors had properties to propagate to descendants
    // for which this component has a property
    // in which case indicate that the property is propagated to this component
    // Exception if the property is marked to ignore
    // properties propagated from ancestors then skip this step
    // (Property will still propagate onto this component's descendants)
    let propertiesPropagated = {};
    for (let property in sharedParameters.propertiesToPropagate) {
      if (property in propertyObject && !propertyObject[property].ignorePropagationFromAncestors) {
        propertiesPropagated[property] = sharedParameters.propertiesToPropagate[property];
      }
    }

    if (Object.keys(propertiesToPropagate).length > 0 || Object.keys(propertiesPropagated).length > 0) {
      if (sharedParameters.propertiesToPropagate) {
        // shallow copy so that changes won't affect ancestors or siblings
        sharedParameters.propertiesToPropagate = Object.assign({}, sharedParameters.propertiesToPropagate);
        for (let property in propertiesPropagated) {
          delete sharedParameters.propertiesToPropagate[property];
        }
      }
      else {
        sharedParameters.propertiesToPropagate = {};
      }
      Object.assign(sharedParameters.propertiesToPropagate, propertiesToPropagate);
    }

    return propertiesPropagated;
  }

  deriveChildResultsFromDefiningChildren(component, updatesNeeded, compositesBeingExpanded) {

    // create allChildren and activeChildren from defining children
    // apply child logic and substitute adapters to modify activeChildren

    if (component.activeChildren) {
      // if there are any deferred child state variables
      // evaluate them before changing the active children
      this.evaluatedDeferredChildStateVariables(component);
    }

    component.activeChildren = component.definingChildren.slice(); // shallow copy

    // allChildren include activeChildren, definingChildren,
    // and possibly some children that are neither
    // (which could occur when a composite is expanded and the result is adapted)
    component.allChildren = {};
    for (let ind = 0; ind < component.activeChildren.length; ind++) {
      let child = component.activeChildren[ind];
      component.allChildren[child.componentName] = {
        activeChildrenIndex: ind,
        definingChildrenIndex: ind,
        component: child,
      };
    }

    // if any of activeChildren are compositeComponents
    // replace with new components given by the composite component
    let replaceCompositeResult = this.replaceCompositeChildren(component, updatesNeeded, compositesBeingExpanded);

    // If a class is not supposed to have blank string children,
    // it is still possible that it received blank string children from a composite.
    // Hence filter out any blank string children that it might have
    if (!component.constructor.includeBlankStringChildren) {
      component.activeChildren = component.activeChildren.filter(s => s.componentType !== "string" || /\S/.test(s.stateValues.value));
    }


    let childLogicResults = this.matchChildrenToChildLogic({
      component,
      matchSugar: true,
      applyAdapters: true,
      updatesNeeded
    });


    if (childLogicResults.success) {
      delete this.unsatisfiedChildLogic[component.componentName]
    } else {
      this.unsatisfiedChildLogic[component.componentName] = {
        message: component.childLogic.logicResult.message
      }
    }

    return childLogicResults;

  }

  matchChildrenToChildLogic({ component, matchSugar = false, applyAdapters = true, updatesNeeded }) {

    // determine maximum number of adapters on any child
    let maxNumAdapters = 0;
    if (applyAdapters === true) {
      for (let child of component.activeChildren) {
        let n = child.nAdapters;
        if (n > maxNumAdapters) {
          maxNumAdapters = n;
        }
      }
    }

    let numAdaptersUsed = 0;

    let success = false;

    for (; numAdaptersUsed <= maxNumAdapters; numAdaptersUsed++) {

      let newResult = component.childLogic.applyLogic({
        activeChildren: component.activeChildren,
        matchSugar,
        maxAdapterNumber: numAdaptersUsed,
      });

      if (newResult.success) {
        success = true;
        this.substituteAdapters(component, updatesNeeded);
        break;
      }
    }

    return { success };

  }

  expandCompositeComponent({ component, updatesNeeded, compositesBeingExpanded }) {

    if (!("readyToExpand" in component.state)) {
      throw Error(`Could not evaluate state variable readyToExpand of composite ${component.componentName}`);
    }

    if (!component.state.readyToExpand.isResolved || !component.state.readyToExpand.value) {
      updatesNeeded.compositesToExpand.add(component.componentName)
      return { success: false }
    }

    updatesNeeded.compositesToExpand.delete(component.componentName);

    // console.log(`expanding composite ${component.componentName}`);

    compositesBeingExpanded.push(component.componentName);

    if (component.shadows) {

      if (compositesBeingExpanded.includes(component.shadows.componentName)) {
        // found a circular reference,
        // as we are in the middle of expanding a composite
        // that we are now trying to shadow

        let compositeInvolved = this._components[component.shadows.componentName];
        // find non-shadow for error message, as that would be a component from document
        while (compositeInvolved.shadows) {
          compositeInvolved = this._components[compositeInvolved.shadows.componentName];
        }
        throw Error(`Circular reference involving ${compositeInvolved.componentName}`)
      }

      let shadowedComposite = this._components[component.shadows.componentName];

      // console.log(`shadowedComposite: ${shadowedComposite.componentName}`)
      // console.log(shadowedComposite.isExpanded);

      if (!shadowedComposite.isExpanded) {
        let result = this.expandCompositeComponent({
          component: shadowedComposite,
          updatesNeeded, compositesBeingExpanded
        });


        if (!result.success) {
          // record that are finished expanding the composite
          let targetInd = compositesBeingExpanded.indexOf(component.componentName);
          if (targetInd === -1) {
            throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
          }
          compositesBeingExpanded.splice(targetInd, 1)

          return { sucess: false, readyToExpand: true };
        }

      }

      // we'll copy the replacements of the shadowed composite
      // and make those be the replacements of the shadowing composite

      let serializedReplacements = shadowedComposite.replacements.map(x => x.serialize({ forCopy: true }))

      // Have three composites involved:
      // 1. the shadowing composite (component, the one we're trying to expand)
      // 2. the shadowed composite
      // 3. the composite mediating the shadowing 
      //    (of which shadowing composite is the replacement)

      let uniqueIdentifiersUsed = component.replacementsWorkspace.uniqueIdentifiersUsed = [];

      let nameOfCompositeMediatingTheShadow = component.shadows.compositeName;
      serializedReplacements = postProcessCopy({
        serializedComponents: serializedReplacements,
        componentName: nameOfCompositeMediatingTheShadow,
        uniqueIdentifiersUsed
      });


      // console.log(`name of composite mediating shadow: ${nameOfCompositeMediatingTheShadow}`)

      this.createAndSetReplacements({
        component,
        serializedReplacements,
        updatesNeeded,
        compositesBeingExpanded,
      });

      this.updateReplacementDependencies(component, updatesNeeded, compositesBeingExpanded);

      // TODO: make this more specific so just updates descendants
      // of direct parent of composite, as that's the only one that would see
      // replacements as a descendant?
      this.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

      // record that are finished expanding the composite
      let targetInd = compositesBeingExpanded.indexOf(component.componentName);
      if (targetInd === -1) {
        throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
      }
      compositesBeingExpanded.splice(targetInd, 1)

      return { success: true };

    }

    let result = component.constructor.createSerializedReplacements({
      component,
      components: this.components,
      workspace: component.replacementsWorkspace,
    });

    // console.log(`expand result for ${component.componentName}`)
    // console.log(result);

    if (result.replacements) {
      let serializedReplacements = result.replacements;

      if (component.serializedReplacements) {

        // if component came with serialized replacements, use those instead
        // as they may have particular state variables values saved
        serializedReplacements = component.serializedReplacements;
        delete component.serializedReplacements;
      }

      this.createAndSetReplacements({
        component,
        serializedReplacements,
        updatesNeeded,
        compositesBeingExpanded,
      });
    } else if (result.replacementsWithInstructions) {

      let serializedReplacementsFromComponent;
      if (component.serializedReplacements) {
        // if component came with serialized replacements, use those instead
        // however, we will push any sharedparameters from instructions
        // before creating
        serializedReplacementsFromComponent = component.serializedReplacements;
        delete component.serializedReplacements;
      }


      this.createAndSetReplacementsWithInstructions({
        component,
        replacementsWithInstructions: result.replacementsWithInstructions,
        serializedReplacementsFromComponent,
        updatesNeeded,
        compositesBeingExpanded
      })
    } else {
      throw Error(`Invalid createSerializedReplacements of ${component.componentName}`);
    }

    this.updateReplacementDependencies(component, updatesNeeded, compositesBeingExpanded);

    // TODO: make this more specific so just updates descendants
    // of direct parent of composite, as that's the only one that would see
    // replacements as a descendant?
    this.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

    // record that are finished expanding the composite
    let targetInd = compositesBeingExpanded.indexOf(component.componentName);
    if (targetInd === -1) {
      throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
    }
    compositesBeingExpanded.splice(targetInd, 1)

    return { success: true };
  }

  addShadowDependencies({ serializedComponents, shadowedComponents, compositeName }) {

    for (let [ind, serializedComp] of serializedComponents.entries()) {
      let shadowedComp = shadowedComponents[ind];

      if (!shadowedComp) {
        throw Error(`Didn't find shadowed component.  How do we handle this?`);
      }

      if (!serializedComp.downstreamDependencies) {
        serializedComp.downstreamDependencies = {};
      }
      serializedComp.downstreamDependencies[shadowedComp.componentName] = [{
        dependencyType: "referenceShadow",
        compositeName
      }]

      if (serializedComp.children &&
        !(shadowedComp.serializedChildren && shadowedComp.serializedChildren.length > 0)
      ) {
        this.addShadowDependencies({
          serializedComponents: serializedComp.children,
          shadowedComponents: shadowedComp.definingChildren,
          compositeName
        })
      }
    }
  }

  createAndSetReplacements({ component, serializedReplacements, updatesNeeded, compositesBeingExpanded }) {

    this.parameterStack.push(component.sharedParameters, false);

    let replacementResult = this.createIsolatedComponentsSub({
      serializedState: serializedReplacements,
      ancestors: component.ancestors,
      applySugar: true,
      shadow: true,
      updatesNeeded,
      compositesBeingExpanded,
      createNameContext: component.componentName + "|replacements"
    });

    this.parameterStack.pop();

    component.replacements = replacementResult.components;
    component.isExpanded = true;

    // record for top level replacement that they are a replacement of composite
    for (let comp of component.replacements) {
      comp.replacementOf = component;
    }

  }

  createAndSetReplacementsWithInstructions({ component, replacementsWithInstructions,
    serializedReplacementsFromComponent, updatesNeeded, compositesBeingExpanded
  }) {

    this.parameterStack.push(component.sharedParameters, false);

    let replacements = this.processReplacementsWithInstructions({
      replacementsWithInstructions, serializedReplacementsFromComponent, component,
      updatesNeeded, compositesBeingExpanded
    });

    this.parameterStack.pop();

    component.replacements = replacements;
    component.isExpanded = true;

    // record for top level replacement that they are a replacement of composite
    for (let comp of component.replacements) {
      comp.replacementOf = component;
    }

  }

  processReplacementsWithInstructions({ replacementsWithInstructions,
    serializedReplacementsFromComponent, component,
    updatesNeeded, compositesBeingExpanded
  }) {

    let replacements = [];

    for (let replacementInstruction of replacementsWithInstructions) {
      let replacementsToAdd = replacementInstruction.replacements;
      let nReplacementsInChunk = replacementsToAdd.length;

      if (serializedReplacementsFromComponent) {
        replacementsToAdd = serializedReplacementsFromComponent.slice(0, nReplacementsInChunk);
        serializedReplacementsFromComponent = serializedReplacementsFromComponent.slice(nReplacementsInChunk);
      }

      this.parameterStack.push();

      for (let instruction of replacementInstruction.instructions) {
        if (instruction.operation === "pushSharedParameter") {
          let pName = instruction.parameterName;
          if (pName in this.parameterStack.parameters) {
            this.parameterStack.parameters[pName] = [...this.parameterStack.parameters[pName]];
          }
          else {
            this.parameterStack.parameters[pName] = [];
          }
          this.parameterStack.parameters[pName].push(instruction.value);
        }
        else if (instruction.operation === "assignNamespace") {
          // if (serializedReplacementsFromComponent) {
          //   // skip assigning namespace if already have serialized replacements from component
          //   continue;
          // }

          let namespace = instruction.namespace;

          if (namespace === undefined) {
            let longNameId = component.ancestors[0].componentName + "|"
              + component.componentName + "|assignNamespace|";
            if (instruction.uniqueIdentifier) {
              longNameId += instruction.uniqueIdentifier;
            } else {
              longNameId += JSON.stringify(replacementInstruction.instructions)
            }

            namespace = createUniqueName(component.componentType,
              longNameId);
          }

          let namespacePieces = component.componentName.split('/');

          if (!component.doenetAttributes.newNamespace) {
            namespacePieces.pop();
          }

          let namespaceStack = namespacePieces.map(x => ({
            namespace: x,
            componentCounts: {},
            namesUsed: {}
          }));

          if (!(component.componentName[0] === '/')) {
            // if componentName doesn't begin with a /
            // still add a namespace for the root namespace at the beginning
            namespaceStack.splice(0, 0, {
              componentCounts: {},
              namesUsed: {},
              namespace: ""
            })
          }
          namespaceStack.push({ namespace: namespace, componentCounts: {}, namesUsed: {} });

          serializeFunctions.createComponentNames({
            serializedState: replacementsToAdd,
            namespaceStack,
            componentTypesTakingComponentNames: this.componentTypesTakingComponentNames,
            allComponentClasses: this.allComponentClasses,
            parentDoenetAttributes: { componentName: component.ancestors[0].componentName }
          });
        }
        else if (instruction.operation === "assignName") {
          // if (serializedReplacementsFromComponent) {
          //   // skip assigning namespace if already have serialized replacements from component
          //   continue;
          // }

          if (replacementsToAdd.length !== 1) {
            throw Error(`Cannot assign name to replacements when not exactly one replacement`)
          }

          let name = instruction.name;

          if (name === undefined) {
            let longNameId = component.ancestors[0].componentName + "|"
              + component.componentName + "|assignName|";
            if (instruction.uniqueIdentifier) {
              longNameId += instruction.uniqueIdentifier;
            } else {
              longNameId += JSON.stringify(replacementInstruction.instructions)
            }

            name = createUniqueName(component.componentType,
              longNameId);
          }

          let theReplacement = replacementsToAdd[0];

          if (Array.isArray(name)) {
            // if name is an array, then it refers to names of the grandchildren
            // must create unique name for child

            let longNameId = component.ancestors[0].componentName + "|"
              + component.componentName + "|nameForChild|";
            if (instruction.uniqueIdentifier) {
              longNameId += instruction.uniqueIdentifier;
            } else {
              longNameId += JSON.stringify(replacementInstruction.instructions)
            }

            let nameForChild = createUniqueName(component.componentType,
              longNameId);

            if (!theReplacement.doenetAttributes) {
              theReplacement.doenetAttributes = {}
            }
            theReplacement.doenetAttributes.prescribedName = nameForChild;
            delete theReplacement.doenetAttributes.newNamespace;

            if (theReplacement.children !== undefined) {
              let ind = -1;
              for (let grandchild of theReplacement.children) {
                if (grandchild.componentType === "string") {
                  continue;
                }
                ind++;
                let nameForGrandchild = name[ind];
                if (nameForGrandchild === undefined) {
                  let longNameId = nameForChild + "|"
                    + component.componentName + "|nameForGrandchild|";
                  if (grandchild.uniqueIdentifier) {
                    longNameId += grandchild.uniqueIdentifier;
                  } else {
                    longNameId += ind;
                  }
                  nameForGrandchild = createUniqueName(component.componentType,
                    longNameId);
                }
                if (!grandchild.doenetAttributes) {
                  grandchild.doenetAttributes = {}
                }
                grandchild.doenetAttributes.prescribedName = nameForGrandchild;
                grandchild.doenetAttributes.newNamespace = true;
              }
            }

          } else {
            if (!theReplacement.doenetAttributes) {
              theReplacement.doenetAttributes = {}
            }
            theReplacement.doenetAttributes.prescribedName = name;
            theReplacement.doenetAttributes.newNamespace = true;
          }

          let namespacePieces = component.componentName.split('/');

          if (!component.doenetAttributes.newNamespace) {
            namespacePieces.pop();
          }

          let namespaceStack = namespacePieces.map(x => ({
            namespace: x,
            componentCounts: {},
            namesUsed: {}
          }));

          if (!(component.componentName[0] === '/')) {
            // if componentName doesn't begin with a /
            // still add a namespace for the root namespace at the beginning
            namespaceStack.splice(0, 0, {
              componentCounts: {},
              namesUsed: {},
              namespace: ""
            })
          }

          serializeFunctions.createComponentNames({
            serializedState: replacementsToAdd,
            namespaceStack,
            componentTypesTakingComponentNames: this.componentTypesTakingComponentNames,
            allComponentClasses: this.allComponentClasses,
            parentDoenetAttributes: { componentName: component.ancestors[0].componentName }
          });
        }
        else {
          throw Error(`Unimplement replacement instruction operation ${instruction.operation}`);
        }
      }

      let replacementResult = this.createIsolatedComponentsSub({
        serializedState: replacementsToAdd,
        ancestors: component.ancestors,
        applySugar: true,
        shadow: true,
        updatesNeeded,
        compositesBeingExpanded,
        createNameContext: component.componentName + "|replacements"
      });
      replacements.push(...replacementResult.components);

      this.parameterStack.pop();
    }

    return replacements;
  }

  replaceCompositeChildren(component, updatesNeeded, compositesBeingExpanded) {
    // if composite is not directly matched by any childLogic leaf
    // then replace the composite with its replacements,
    // expanding it if not already expanded

    let compositeChildNotReadyToExpand = false;

    for (let ind = 0; ind < component.activeChildren.length; ind++) {
      let child = component.activeChildren[ind];

      if (child instanceof this._allComponentClasses._composite) {

        // if composite itself is in the child logic
        // then don't replace it with its replacements
        // but leave the composite as an activeChild
        if (component.childLogic.checkIfChildInLogic(child)) {
          continue;
        }

        // expand composite if it isn't already
        if (!child.isExpanded || child.needToDryRunExpansion) {

          let expandResult = this.expandCompositeComponent({
            component: child,
            dryRun: child.needToDryRunExpansion,
            updatesNeeded,
            compositesBeingExpanded
          });

          if (!expandResult.success) {
            if (expandResult.readyToExpand) {
              throw Error(`expand result of ${child.componentName} was not a success even though ready to expand.`);
            }

            compositeChildNotReadyToExpand = true;
            continue;
          }

        }

        let replacements = child.replacements;

        // don't use any replacements that are marked as being withheld
        if (child.replacementsToWithhold > 0) {
          replacements = replacements.slice(0, -child.replacementsToWithhold);
          for (let ind = replacements.length; ind < child.replacements.length; ind++) {
            child.replacements[ind].inactive = true;
            child.replacements[ind].changedInactive = true;
          }
        }

        for (let ind = 0; ind < replacements.length; ind++) {
          delete child.replacements[ind].inactive;
          child.replacements[ind].changedInactive = true;
        }


        component.activeChildren.splice(ind, 1, ...replacements);

        // Update allChildren object with info on composite and its replacemnts
        let allChildrenObj = component.allChildren[child.componentName];
        delete allChildrenObj.activeChildrenIndex;
        for (let ind2 = 0; ind2 < replacements.length; ind2++) {
          let replacement = replacements[ind2];
          component.allChildren[replacement.componentName] = {
            activeChildrenIndex: ind + ind2,
            component: replacement,
          }
        }

        // // even replacements that are marked as being withheld
        // // should be in allChildren
        // if (child.replacementsToWithhold > 0) {
        //   for (let ind2 = replacements.length; ind2 < child.replacements.length; ind2++) {
        //     let withheldReplacement = child.replacements[ind2];
        //     component.allChildren[withheldReplacement.componentName] = {
        //       component: withheldReplacement,
        //     }
        //   }
        // }
        if (replacements.length !== 1) {
          // if replaced composite with anything other than one replacement
          // shift activeChildrenIndices of later children
          let nShift = replacements.length - 1;
          for (let ind2 = ind + replacements.length; ind2 < component.activeChildren.length; ind2++) {
            let child2 = component.activeChildren[ind2];
            component.allChildren[child2.componentName].activeChildrenIndex += nShift;
          }
        }

        // rewind one index, in case any of the new activeChildren are composites
        ind--;
      }
    }

    return { compositeChildNotReadyToExpand };
  }

  substituteAdapters(component, updatesNeeded) {

    // let overallResults = {
    //   numUnresolvedStateVariables: {},
    //   unresolvedComponents: new Set([]),
    //   unsatisifiedChildLogic: new Set([]),
    //   unresolvedByDependent: {},
    // }

    // replace activeChildren with their adapters
    if (component.childLogicSatisfied) {
      let adapterResults = component.childLogic.logicResult.adapterResults;
      for (let childNum in adapterResults) {

        let originalChild = component.activeChildren[childNum];

        let newSerializedChild = adapterResults[childNum];
        let adapter = originalChild.adapterUsed;

        if (adapter === undefined || adapter.componentType !== newSerializedChild.componentType) {
          let newChildrenResult = this.createIsolatedComponentsSub({
            serializedState: [newSerializedChild],
            applySugar: false,
            shadow: true,
            ancestors: originalChild.ancestors,
            updatesNeeded,
            createNameContext: originalChild.componentName + "|adapter"
          });

          adapter = newChildrenResult.components[0];

          // put adapter used directly on originalChild for quick access
          originalChild.adapterUsed = adapter;

          adapter.adaptedFrom = originalChild;
        }

        // Replace originalChild with its adapter in activeChildren
        component.activeChildren.splice(childNum, 1, adapter);

        // Update allChildren to show that originalChild is no longer active
        // and that adapter is now an active child
        delete component.allChildren[originalChild.componentName].activeChildrenIndex;
        component.allChildren[adapter.componentName] = {
          activeChildrenIndex: Number(childNum),  // childNum is string since was defined via in
          component: adapter,
        }
      }
    }

    // return overallResults;

  }

  replaceChildrenBySugar({ component, childLogicName, dependencyValues,
    updatesNeeded, compositesBeingExpanded
  }) {

    // find defining childen indices for the children matched
    // at the same time, swap out active child for matching defining child
    // in newChildren

    let childMatches = component.childLogic.returnMatches(childLogicName);

    if (childMatches.length === 0) {
      return;
    }

    // set usedSugar on this particular child logic component
    // so that it won't be applied again
    component.childLogic.logicComponents[childLogicName].usedSugar = true;

    if (component.childLogic.excludeMultipleSugar) {
      // if childLogic is marked as excludeMultipleSugar
      // then also set usedSugar on the childLogic itself,
      // which will prevent any sugar being applied
      component.childLogic.usedSugar = true;
    }

    let childLogicComponent = component.childLogic.logicComponents[childLogicName];

    // calculate replacements for sugar
    let sugarResults = component.childLogic.calculateSugarReplacements({
      childMatches,
      activeChildren: component.activeChildren,
      allChildren: component.allChildren,
      definingChildren: component.definingChildren,
      separateSugarInputs: childLogicComponent.separateSugarInputs,
      replacementFunction: childLogicComponent.replacementFunction,
      dependencyValues,
      parentName: component.componentName,
      childLogicName,
    });

    if (!sugarResults.success) {

      console.warn(`Applying sugar for ${component.componentName} failed: ${sugarResults.message}`)

      // sugar failed.
      // rerun child logic, now that we have marked childlogic component
      // as already having used sugars
      this.processNewDefiningChildren({ parent: component, updatesNeeded, compositesBeingExpanded })

      if (!component.childLogicSatisfied) {
        // TODO: handle case where child logic is no longer satisfied
        console.error(`Child logic of ${component.componentName} is not satisfied after failing to apply sugar`)
      }

      return;

    }


    if (sugarResults.childChanges) {

      for (let childName in sugarResults.childChanges) {
        let changes = sugarResults.childChanges[childName];

        if (component.allChildren[childName].definingChildrenIndex === undefined) {
          throw Error("Invalid sugar logic for component of type " + componentType
            + ": can change only defining children");
        }

        let child = this._components[childName];

        let result = this.replaceDefiningChildrenBySugar({
          component: child,
          sugarResults: changes,
          updatesNeeded,
          compositesBeingExpanded
        });

        // immediately apply sugar to shadows
        // so that defining indices from changes still apply
        // (at later sugar changes could add/delete defining changes)
        if (child.shadowedBy) {
          for (let shadowingComponent of child.shadowedBy) {
            if (!shadowingComponent.shadows.propVariable) {
              let additionalChanges = this.applySugarToShadows(({
                originalComponent: child,
                shadowingComponent,
                changes,
                componentsShadowingDeleted: result.componentsShadowingDeleted,
                updatesNeeded,
                compositesBeingExpanded,
              }));
            }
          }
        }

        this.processNewDefiningChildren({ parent: child, updatesNeeded, compositesBeingExpanded })

        if (!component.childLogicSatisfied) {
          // TODO: handle case where child logic is no longer satisfied
          console.error(`Child logic of ${component.componentName} is not satisfied after applying sugar to children`)
        }


      }
    }

    for (let changes of sugarResults.baseChanges) {
      let result = this.replaceDefiningChildrenBySugar({
        component,
        sugarResults: changes,
        updatesNeeded,
        compositesBeingExpanded
      });


      // immediately apply sugar to shadows
      // so that defining indices from change still apply
      // (at later sugar changes could add/delete defining changes)
      if (component.shadowedBy) {
        for (let shadowingComponent of component.shadowedBy) {
          if (!shadowingComponent.shadows.propVariable) {
            this.applySugarToShadows(({
              originalComponent: component,
              shadowingComponent,
              changes,
              componentsShadowingDeleted: result.componentsShadowingDeleted,
              updatesNeeded,
              compositesBeingExpanded
            }));
          }
        }
      }
    }

    this.processNewDefiningChildren({ parent: component, updatesNeeded, compositesBeingExpanded })

    if (!component.childLogicSatisfied) {
      // TODO: handle case where child logic is no longer satisfied
      console.error(`Child logic of ${component.componentName} is not satisfied after applying sugar`)
    }

    return;

  }

  replaceDefiningChildrenBySugar({ component, sugarResults, shadow = false,
    updatesNeeded, compositesBeingExpanded
  }) {

    let componentsShadowingDeleted = {};

    // delete the string children specified by childrenToDelete
    if (sugarResults.childrenToDelete !== undefined) {
      for (let childName of sugarResults.childrenToDelete) {
        let child = this._components[childName];

        let childAndDescendants = [childName, ...child.allDescendants]

        for (let name of childAndDescendants) {
          if (Object.keys(this.downstreamDependencies[name]).length > 0) {
            this.deleteAllDownstreamDependencies({ component: this._components[name] });
          }
        }

        if (child.shadowedBy) {

          // delete any targetComponent upstream depedendencies
          // ignore childstatevariables/identity
          // as those will be recomputed when children are changed
          for (let varName in this.upstreamDependencies[childName]) {
            for (let [ind, upDep] of this.upstreamDependencies[childName][varName].entries()) {
              if (upDep.dependencyType !== "childStateVariables" && upDep.dependencyType !== "childIdentity") {
                // TODO: do we just delete these types of dependencies
                // or should we delete all?
                // Not sure why just looking for these.  Just added ones found so far.
                if (upDep.dependencyName === "targetVariable" || upDep.dependencyName === "targetReadyToExpand"
                  || upDep.dependencyName.slice(0, 17) === "__composites_for_"
                  || upDep.upstreamVariableNames.every(x => x.slice(0, 24) === "__determine_dependencies")
                ) {

                  this.deleteDownstreamDependency({
                    downDeps: this.downstreamDependencies[upDep.upstreamComponentName][upDep.upstreamVariableNames[0]],
                    downDepName: upDep.dependencyName,
                    downstreamComponentName: childName
                  });

                } else {
                  console.warn(`In deleting ${childName} as child of ${component.componentName} via sugar, found an unexpected dependency`)
                }
              }
            }
          }

          componentsShadowingDeleted[childName] = child.shadowedBy;
        }


        // mark all state variables as deleted
        if (updatesNeeded.deletedStateVariables[childName] === undefined) {
          updatesNeeded.deletedStateVariables[childName] = [];
        }
        for (let varName in child.state) {
          updatesNeeded.deletedStateVariables[childName].push(varName);
        }

        updatesNeeded.deletedComponents[childName] = true;
        delete this.unsatisfiedChildLogic[childName]


        for (let cName of childAndDescendants) {

          if (updatesNeeded.unresolvedDependencies[cName]) {
            for (let varName in updatesNeeded.unresolvedDependencies[cName]) {
              for (let unRes of updatesNeeded.unresolvedDependencies[cName][varName]) {
                // delete from updatesNeeded.unresolvedByDependent so don't attempt
                // to try to resolve this state variable later
                if (updatesNeeded.unresolvedByDependent[unRes.componentName]) {
                  let unResBy = updatesNeeded.unresolvedByDependent[unRes.componentName][unRes.stateVariable];
                  if (unResBy) {
                    for (let [ind, dep] of unResBy.entries()) {
                      if (dep.componentName === cName && dep.stateVariable === varName) {
                        unResBy.splice(ind, 1);
                        break;
                      }
                    }
                  }
                }
              }
            }
          }

          delete updatesNeeded.unresolvedDependencies[cName];
        }

        this.deregisterComponent(this._components[childName]);
      }
    }


    this.parameterStack.push(component.sharedParameters, false);

    let ancestorsForChildren = [
      {
        componentName: component.componentName,
        componentClass: component.constructor
      },
      ...component.ancestors
    ];

    let childrenResult = this.createIsolatedComponentsSub({
      serializedState: sugarResults.newChildren,
      applySugar: true,
      ancestors: ancestorsForChildren,
      shadow, updatesNeeded, compositesBeingExpanded,
      createNameContext: component.componentName + "|sugar"
    });

    this.parameterStack.pop();

    // insert the replacements in definingChildren
    component.definingChildren.splice(sugarResults.firstDefiningIndex,
      sugarResults.nDefiningIndices, ...childrenResult.components);

    return { createResult: childrenResult, componentsShadowingDeleted }

  }

  applySugarToShadows({ originalComponent, shadowingComponent, changes, componentsShadowingDeleted,
    updatesNeeded, compositesBeingExpanded
  }) {

    // recreate sugar results with the following changes
    // 1. replace childrenToDelete with their shadows from componentsShadowingDeleted
    // 2. serialized for reference any newly created components
    //    (don't just use the instructions from the sugar, as additional
    //    sugar could have been applied when creating those components)
    // 3. find any "createdComponents" (components that were preserved)
    //    and replace them with createdComponents referencing their shadows

    let shadowChanges = Object.assign({}, changes)

    let shadowChildrenToDelete = [];

    if (changes.childrenToDelete) {
      for (let deletedName of changes.childrenToDelete) {
        let shadowingDeleted = componentsShadowingDeleted[deletedName];
        if (shadowingDeleted) {
          for (let comp of shadowingDeleted) {
            // check if shadowingComponent is ancestor
            if (comp.ancestors.map(x => x.componentName)
              .includes(shadowingComponent.componentName)
            ) {
              shadowChildrenToDelete.push(comp.componentName);
            }
          }
        }
      }
    }

    shadowChanges.childrenToDelete = shadowChildrenToDelete;


    let originalChildren = originalComponent.definingChildren.slice(
      changes.firstDefiningIndex,
      changes.firstDefiningIndex + changes.newChildren.length
    )

    let serializedChildren = originalChildren.map(x => x.serialize({ forCopy: true }));

    serializedChildren = postProcessCopy({
      serializedComponents: serializedChildren,
      componentName: shadowingComponent.shadows.compositeName
    })

    // go through the defining children of shadowing component
    // if they aren't in shadowChanges.childrenToDelete
    // we should be able to find the component they are shadowing in originalChildren
    // so that we can modify serializedChildren to be a createComponent
    // refering to the shadowChild


    let definingIndsInSugar = [];

    for (let [childInd, shadowingChild] of shadowingComponent.definingChildren.entries()) {
      if (shadowChanges.childrenToDelete.includes(shadowingChild.componentName)) {
        definingIndsInSugar.push(childInd);
        continue;
      }

      let shadowedComponentName = shadowingChild.shadows.componentName;

      // Go through serialized children to find shadowedComponentName
      // and replace it with a createdComponent referring to shadowingChild
      let shadowedChild = this.findShadowedChildInSerializedComponents({
        serializedComponents: serializedChildren,
        shadowedComponentName
      })

      if (shadowedChild) {
        for (let key in shadowedChild) {
          delete shadowedChild[key];
        }
        shadowedChild.createdComponent = true;
        shadowedChild.componentName = shadowingChild.componentName;
        definingIndsInSugar.push(childInd);
      } else {

        // check if shadowingChild is shadowing another defining child
        let shadowedComponentName = shadowingChild.shadows.componentName;
        if (!originalComponent.definingChildren.map(x => x.componentName).includes(shadowedComponentName)) {

          shadowChanges.childrenToDelete.push(shadowingChild.componentName)
          definingIndsInSugar.push(childInd);

        }
      }

    }

    // check if there is a gap in defining inds in sugar
    for (let i = 1; i < definingIndsInSugar.length; i++) {
      if (definingIndsInSugar[i] - definingIndsInSugar[i - 1] !== 1) {
        // this shouldn't happen
        throw Error('Sugar translated to shadowing components affects non-consecutive defining children');
      }
    }

    shadowChanges.newChildren = serializedChildren;

    if (definingIndsInSugar.length > 0) {
      shadowChanges.firstDefiningIndex = Math.min(...definingIndsInSugar);
      let lastDefiningIndex = Math.max(...definingIndsInSugar);
      shadowChanges.nDefiningIndices = lastDefiningIndex - shadowChanges.firstDefiningIndex + 1;
    } else {
      shadowChanges.firstDefiningIndex = 0;
      shadowChanges.nDefiningIndices = 0;
    }

    let result = this.replaceDefiningChildrenBySugar({
      component: shadowingComponent,
      sugarResults: shadowChanges,
      shadow: true,
      updatesNeeded,
      compositesBeingExpanded
    });

    // recurse if shadowingComponent is shadowed
    if (shadowingComponent.shadowedBy) {
      for (let shadowingComponent2 of shadowingComponent.shadowedBy) {
        if (!shadowingComponent2.shadows.propVariable) {
          this.applySugarToShadows(({
            originalComponent: shadowingComponent,
            shadowingComponent: shadowingComponent2,
            changes: shadowChanges,
            componentsShadowingDeleted: result.componentsShadowingDeleted,
            updatesNeeded,
            compositesBeingExpanded,
          }))
        }
      }
    }

    this.processNewDefiningChildren({ parent: shadowingComponent, updatesNeeded, compositesBeingExpanded })


    if (!shadowingComponent.childLogicSatisfied) {
      // TODO: handle case where child logic is no longer satisfied
      console.error(`Child logic of ${shadowingComponent.componentName} is not satisfied after applying sugar in shadows`)
    }

  }

  findShadowedChildInSerializedComponents({ serializedComponents, shadowedComponentName }) {
    for (let serializedComponent of serializedComponents) {
      if (serializedComponent.preserializedName === shadowedComponentName) {
        return serializedComponent;
      }
      if (serializedComponent.children) {
        let result = this.findShadowedChildInSerializedComponents({
          serializedComponents: serializedComponent.children,
          shadowedComponentName
        });
        if (result) {
          return result;
        }
      }
    }

    return;
  }

  createStateVariableDefinitions({ childLogic, componentClass,
    prescribedDependencies, componentName
  }) {

    let redefineDependencies;
    let ancestorProps = {};

    if (prescribedDependencies) {
      for (let name in prescribedDependencies) {
        let depArray = prescribedDependencies[name];
        for (let dep of depArray) {
          if (dep.dependencyType === "referenceShadow") {
            redefineDependencies = {
              linkSource: "referenceShadow",
              targetName: name,
              compositeName: dep.compositeName,
              propVariable: dep.propVariable,
              arrayStateVariable: dep.arrayStateVariable,
              arrayKey: dep.arrayKey,
              ignorePrimaryStateVariable: dep.ignorePrimaryStateVariable,
            }
          } else if (dep.dependencyType === "adapter") {
            redefineDependencies = {
              linkSource: "adapter",
              adapterTargetIdentity: dep.adapterTargetIdentity,
              adapterVariable: dep.adapterVariable
            }
          } else if (dep.dependencyType === "ancestorProp") {
            ancestorProps[dep.property] = dep.ancestorIdentity;
          }
        }
      }
    }

    let stateVariableDefinitions = {};

    // this.createChildLogicStateVariableDefinitions({
    //   childLogic, stateVariableDefinitions, componentName, parentName
    // });

    if (!redefineDependencies) {
      this.createPropertyStateVariableDefinitions({ childLogic, ancestorProps, stateVariableDefinitions });
    }

    //  add state variable definitions from component class
    let newDefinitions = componentClass.returnNormalizedStateVariableDefinitions({
      propertyNames: Object.keys(stateVariableDefinitions),
      numerics: this.numerics
    });

    Object.assign(stateVariableDefinitions, newDefinitions)

    if (redefineDependencies) {

      if (redefineDependencies.linkSource === "adapter") {
        this.createAdapterStateVariableDefinitions({
          redefineDependencies, childLogic, stateVariableDefinitions, componentClass
        });
      } else {
        this.createReferenceShadowStateVariableDefinitions({
          redefineDependencies, childLogic, stateVariableDefinitions, componentClass,
          ancestorProps
        });
      }
    }

    // this.createAllResolvedStateVariableDefinition({
    //   childLogic, stateVariableDefinitions,
    // });

    // if there is a state variable childrenToRender
    // it will be used to specify which children have renderers created
    // To know when renders must be added or deleted,
    // wrap definition of this state variable to append to
    // componentsWithChangedChildrenToRender when definition changes

    let childrenToRender = stateVariableDefinitions.childrenToRender;
    if (childrenToRender) {
      let originalDefinition = childrenToRender.definition;
      let core = this;
      childrenToRender.definition = function (args) {
        core.componentsWithChangedChildrenToRender.add(componentName);
        return originalDefinition(args);
      }
    }

    return stateVariableDefinitions;
  }

  createPropertyStateVariableDefinitions({ childLogic, ancestorProps, stateVariableDefinitions }) {
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let childLogicName = '_property_' + property;
      let componentType = propertySpecification.componentType ? propertySpecification.componentType : property;
      let defaultValue = propertySpecification.default;
      if (defaultValue === undefined) {
        defaultValue = null;
      }
      // let deleteIfUndefined = defaultValue === undefined && propertySpecification.deleteIfUndefined;
      let propertyClass = this.allComponentClasses[property.toLowerCase()];
      let stateVariableForPropertyValue = propertyClass.stateVariableForPropertyValue;
      if (stateVariableForPropertyValue === undefined) {
        stateVariableForPropertyValue = "value";
      }

      let additionalDependentStateVariables = [];
      if (propertySpecification.dependentStateVariables) {
        additionalDependentStateVariables.push(...propertySpecification.dependentStateVariables);
      }

      let propertyIsAnArray = false;
      if (propertyClass.attributesForPropertyValue) {
        propertyIsAnArray = propertyClass.attributesForPropertyValue.isArray;
      }

      let dependencies, definition, inverseDefinition;
      if (property in ancestorProps) {
        dependencies = {
          [childLogicName]: {
            dependencyType: "childStateVariables",
            childLogicName: childLogicName,
            variableNames: [stateVariableForPropertyValue],
            markChildrenAsProperties: true,
          },
          ancestorProp: {
            dependencyType: "componentStateVariable",
            componentIdentity: ancestorProps[property],
            variableName: property,
          }
        };

        for (let depStateVar of additionalDependentStateVariables) {
          dependencies[depStateVar.dependencyName] = {
            dependencyType: "stateVariable",
            variableName: depStateVar.variableName
          }
        }

        definition = function ({ dependencyValues, usedDefault, arrayKeys, freshnessInfo }) {

          let propertyChild = dependencyValues[childLogicName];
          if (propertyChild.length === 0) {
            if (!usedDefault.ancestorProp) {
              return { newValues: { [property]: dependencyValues.ancestorProp } }
            } else {
              if (propertyIsAnArray) {
                return {
                  useEssentialOrDefaultValue: {
                    [property]: {
                      __entire_array: {
                        variablesToCheck: property,
                        defaultValue: dependencyValues.ancestorProp,
                      }
                    }
                  }
                }
              } else {
                return {
                  useEssentialOrDefaultValue: {
                    [property]: {
                      variablesToCheck: property,
                      defaultValue: dependencyValues.ancestorProp,
                    }
                  }
                }
              };
            }
          }

          if (propertySpecification.definitionForPropertyValue) {
            return propertySpecification.definitionForPropertyValue({
              dependencyValues,
              propertyChild,
              propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler),
              arrayKeys, freshnessInfo
            })
          } else if (propertyClass.definitionForPropertyValue) {
            return propertyClass.definitionForPropertyValue({
              dependencyValues,
              propertyChild,
              propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler),
              arrayKeys, freshnessInfo
            })
          }

          let childVariable = validatePropertyValue({
            value: propertyChild[0].stateValues[stateVariableForPropertyValue],
            propertySpecification, property
          })

          // if mergeArrays specified and both ancetor prop and child value
          // are arrays, then property value will combine those arrays
          if (propertySpecification.mergeArrays
            && Array.isArray(dependencyValues.ancestorProp)
            && Array.isArray(childVariable)
          ) {
            let mergedArray = [...childVariable, ...dependencyValues.ancestorProp];
            return { newValues: { [property]: mergedArray } }
          } else {
            return { newValues: { [property]: childVariable } };
          }

        };
        inverseDefinition = function ({ desiredStateVariableValues, dependencyValues, usedDefault }) {
          if (dependencyValues[childLogicName].length === 0) {
            if (usedDefault.ancestorProp) {
              // no children, so value is essential and give it the desired value
              return {
                success: true,
                instructions: [{
                  setStateVariable: property,
                  value: desiredStateVariableValues[property]
                }]
              };
            }
            else {
              // ancestor prop was used, so propagate back to ancestor
              return {
                success: true,
                instructions: [{
                  setDependency: "ancestorProp",
                  desiredValue: desiredStateVariableValues[property],
                }]
              };
            }
          }

          // property based on child

          if (propertySpecification.definitionForPropertyValue) {
            if (propertySpecification.inverseDefinitionForPropertyValue) {
              return propertySpecification.inverseDefinitionForPropertyValue({
                desiredStateVariableValues,
                dependencyValues,
                propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler)
              })
            } else {
              return { success: false }
            }
          } else if (propertyClass.definitionForPropertyValue) {
            if (propertyClass.inverseDefinitionForPropertyValue) {
              return propertyClass.inverseDefinitionForPropertyValue({
                desiredStateVariableValues,
                dependencyValues,
                propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler)
              })
            } else {
              return { success: false }
            }
          }

          if (propertySpecification.mergeArrays) {
            // can't invert if we merged arrays to get the value
            return { success: false }
          } else {

            return {
              success: true,
              instructions: [{
                setDependency: childLogicName,
                desiredValue: desiredStateVariableValues[property],
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          }
        };
      }
      else {
        // usual case of property with no ancestor property being propagated
        dependencies = {
          [childLogicName]: {
            dependencyType: "childStateVariables",
            childLogicName: childLogicName,
            variableNames: [stateVariableForPropertyValue],
            markChildrenAsProperties: true,
          },
        };

        for (let depStateVar of additionalDependentStateVariables) {
          dependencies[depStateVar.dependencyName] = {
            dependencyType: "stateVariable",
            variableName: depStateVar.variableName
          }
        }

        // if property class (or specification) has own definition for property value
        // and default value is not specified for this property
        // then use the definition even if there are no property children
        // Note: since copy specified default=null for all its properties,
        // default will always be used if not property children,
        // allowing copy to check if all properties specified are valid
        let useDefaultIfNoPropertyChild = !(
          (propertyClass.definitionForPropertyValue || propertySpecification.definitionForPropertyValue)
          && !("default" in propertySpecification)
        );

        definition = function ({ dependencyValues, arrayKeys, freshnessInfo }) {
          let propertyChild = dependencyValues[childLogicName];

          // TODO: if property is an array state variable
          // we don't have a way to set its default,
          // we can only set a defaultEntry for an array state variable
          // Do we need to implement a default value for an array
          // so that can use it here in a property?
          if (propertyChild.length === 0 && useDefaultIfNoPropertyChild) {

            if (propertyIsAnArray) {
              return {
                useEssentialOrDefaultValue: {
                  [property]: {
                    __entire_array: { variablesToCheck: property }
                  }
                }
              }
            } else {
              return {
                useEssentialOrDefaultValue: {
                  [property]: { variablesToCheck: property }
                }
              };
            }
          }

          if (propertySpecification.definitionForPropertyValue) {
            return propertySpecification.definitionForPropertyValue({
              dependencyValues,
              propertyChild,
              propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler),
              arrayKeys, freshnessInfo
            })
          } else if (propertyClass.definitionForPropertyValue) {
            return propertyClass.definitionForPropertyValue({
              dependencyValues,
              propertyChild,
              propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler),
              arrayKeys, freshnessInfo
            })
          }


          let childVariable = validatePropertyValue({
            value: propertyChild[0].stateValues[stateVariableForPropertyValue],
            propertySpecification, property
          })

          if (propertySpecification.mergeArrayWithDefault && Array.isArray(childVariable)) {
            let defaultValue = propertySpecification.default;
            if (Array.isArray(defaultValue)) {
              let mergedArray = [...childVariable, ...defaultValue];
              return { newValues: { [property]: mergedArray } }
            }
          }

          return { newValues: { [property]: childVariable } };
        };
        inverseDefinition = function ({ desiredStateVariableValues, dependencyValues }) {

          if (dependencyValues[childLogicName].length === 0) {
            // no children, so value is essential and give it the desired value
            return {
              success: true,
              instructions: [{
                setStateVariable: property,
                value: desiredStateVariableValues[property]
              }]
            };
          }
          // property based on child

          if (propertySpecification.definitionForPropertyValue) {
            if (propertySpecification.inverseDefinitionForPropertyValue) {
              return propertySpecification.inverseDefinitionForPropertyValue({
                desiredStateVariableValues,
                dependencyValues,
                propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler)
              })
            } else {
              return { success: false }
            }
          } else if (propertyClass.definitionForPropertyValue) {
            if (propertyClass.inverseDefinitionForPropertyValue) {
              return propertyClass.inverseDefinitionForPropertyValue({
                desiredStateVariableValues,
                dependencyValues,
                propertySpecification: new Proxy(propertySpecification, readOnlyProxyHandler)
              })
            } else {
              return { success: false }
            }
          }

          if (propertySpecification.mergeArrays) {
            // can't invert if we merged arrays to get the value
            return { success: false }
          } else {

            return {
              success: true,
              instructions: [{
                setDependency: childLogicName,
                desiredValue: desiredStateVariableValues[property],
                childIndex: 0,
                variableIndex: 0,
              }]
            };
          }

        };
      }
      stateVariableDefinitions[property] = {
        public: true,
        componentType,
        isProperty: true,
        defaultValue,
        // deleteIfUndefined,
        // required: propertySpecification.required, // TODO: how do we do required?
        returnDependencies: () => dependencies,
        definition,
        inverseDefinition
      };

      if (propertyClass.markStaleForPropertyValue) {
        stateVariableDefinitions[property].markStale = propertyClass.markStaleForPropertyValue
      }

      for (let attribute in propertyClass.attributesForPropertyValue) {
        stateVariableDefinitions[property][attribute]
          = propertyClass.attributesForPropertyValue[attribute];
      }

      let propertyAttributesToCopy = [
        "forRenderer",
        "entryPrefixes",
        "requireChildLogicInitiallySatisfied",
        "useDefaultForShadows",
        "propagateToProps",
        "disallowOverwriteOnCopy",
      ]

      for (let attribute of propertyAttributesToCopy) {
        if (attribute in propertySpecification) {
          stateVariableDefinitions[property][attribute]
            = propertySpecification[attribute];
        }
      }

    }
  }

  createAdapterStateVariableDefinitions({ redefineDependencies, childLogic, stateVariableDefinitions, componentClass }) {
    let adapterTargetComponent = this._components[redefineDependencies.adapterTargetIdentity.componentName];

    // properties depend on adapterTarget (if exist in adapterTarget)
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let componentType = propertySpecification.componentType ? propertySpecification.componentType : property;
      let defaultValue = propertySpecification.default;
      let thisDependencies = {};
      if (property in adapterTargetComponent.state) {
        thisDependencies.adapterTargetVariable = {
          dependencyType: "componentStateVariable",
          componentIdentity: redefineDependencies.adapterTargetIdentity,
          variableName: property,
        };
      }
      stateVariableDefinitions[property] = {
        public: true,
        componentType,
        isProperty: true,
        defaultValue,
        returnDependencies: () => thisDependencies,
        definition: function ({ dependencyValues }) {
          if (dependencyValues.adapterTargetVariable === undefined) {
            return {
              useEssentialOrDefaultValue: {
                [property]: { variablesToCheck: property }
              }
            };
          }
          else {
            return { newValues: { [property]: dependencyValues.adapterTargetVariable } };
          }
        },
        inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
          if (dependencyValues.adapterTargetVariable === undefined) {
            return {
              success: true,
              instructions: [{
                setStateVariable: property,
                desiredValue: desiredStateVariableValues[property],
              }]
            };
          }
          else {
            return {
              success: true,
              instructions: [{
                setDependency: "adapterTargetVariable",
                desiredValue: desiredStateVariableValues[property],
              }]
            };
          }
        }
      };

      for (let attribute of ["forRenderer", "entryPrefixes"]) {
        if (attribute in propertySpecification) {
          stateVariableDefinitions[property][attribute]
            = propertySpecification[attribute];
        }
      }
    }
    // primaryStateVariableForDefinition is the state variable that the componentClass
    // being created has specified should be given the value when it
    // is created from an outside source like a reference to a prop or an adapter
    let primaryStateVariableForDefinition = "value";
    if (componentClass.primaryStateVariableForDefinition) {
      primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
    }
    let stateDef = stateVariableDefinitions[primaryStateVariableForDefinition];
    stateDef.returnDependencies = () => ({
      adapterTargetVariable: {
        dependencyType: "componentStateVariable",
        componentIdentity: redefineDependencies.adapterTargetIdentity,
        variableName: redefineDependencies.adapterVariable,
      },
    });
    if (stateDef.set) {
      stateDef.definition = function ({ dependencyValues }) {
        return {
          newValues: {
            [primaryStateVariableForDefinition]: stateDef.set(dependencyValues.adapterTargetVariable),
          },
        };
      };
    } else {
      stateDef.definition = function ({ dependencyValues }) {
        return {
          newValues: {
            [primaryStateVariableForDefinition]: dependencyValues.adapterTargetVariable,
          },
        };
      };
    }
    stateDef.inverseDefinition = function ({ desiredStateVariableValues }) {
      return {
        success: true,
        instructions: [{
          setDependency: "adapterTargetVariable",
          desiredValue: desiredStateVariableValues[primaryStateVariableForDefinition],
        }]
      };
    };

  }

  createReferenceShadowStateVariableDefinitions({ redefineDependencies, childLogic, stateVariableDefinitions, componentClass, ancestorProps }) {

    let compositeComponent = this._components[redefineDependencies.compositeName];
    let targetComponent = this._components[redefineDependencies.targetName];

    let additionalPropertiesFromStateVariables = {};

    if (redefineDependencies.propVariable) {
      let propStateVariableInTarget = targetComponent.state[redefineDependencies.propVariable];
      if (propStateVariableInTarget && propStateVariableInTarget.stateVariablesPrescribingAdditionalProperties) {
        additionalPropertiesFromStateVariables = propStateVariableInTarget.stateVariablesPrescribingAdditionalProperties
      }
    }

    // properties depend first on compositeComponent (if exists in compositeComponent),
    // then on targetComponent (if not copying a prop and property exists in targetComponent)
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let componentType = propertySpecification.componentType ? propertySpecification.componentType : property;
      let defaultValue = propertySpecification.default;
      let thisDependencies = {};

      if (property in compositeComponent.state && !propertySpecification.disallowOverwriteOnCopy) {
        thisDependencies.compositeComponentVariable = {
          dependencyType: "componentStateVariable",
          componentIdentity: {
            componentName: compositeComponent.componentName,
            componentType: compositeComponent.componentType
          },
          variableName: property,
        }
      }
      if (
        (!redefineDependencies.propVariable || propertySpecification.propagateToProps)
        && (property in targetComponent.state)
      ) {
        thisDependencies.targetVariable = {
          dependencyType: "componentStateVariable",
          componentIdentity: {
            componentName: targetComponent.componentName,
            componentType: targetComponent.componentType
          },
          variableName: property,
        };
        if ("targetPropertiesToIgnore" in compositeComponent.state) {
          thisDependencies.targetPropertiesToIgnore = {
            dependencyType: "componentStateVariable",
            componentIdentity: {
              componentName: compositeComponent.componentName,
              componentType: compositeComponent.componentType
            },
            variableName: "targetPropertiesToIgnore",
          };
        }
      }

      // TODO: do we really want to overwrite targetVariable here?
      if (additionalPropertiesFromStateVariables[property]) {
        thisDependencies.targetVariable = {
          dependencyType: "componentStateVariable",
          componentIdentity: {
            componentName: targetComponent.componentName,
            componentType: targetComponent.componentType
          },
          variableName: additionalPropertiesFromStateVariables[property]
        }
      }

      if (property in ancestorProps) {
        thisDependencies.ancestorProp = {
          dependencyType: "componentStateVariable",
          componentIdentity: ancestorProps[property],
          variableName: property,
        }
      }
      stateVariableDefinitions[property] = {
        public: true,
        componentType,
        isProperty: true,
        defaultValue,
        returnDependencies: () => thisDependencies,
        definition: function ({ dependencyValues, usedDefault }) {

          if (dependencyValues.compositeComponentVariable !== undefined && (
            !usedDefault.compositeComponentVariable
            || compositeComponent.state[property].useDefaultForShadows
          )) {
            // if value of property was specified on copy component itself
            // then use that property value

            // need to validate it, since copy component
            // wouldn't have the validation logic
            let propertyValue = validatePropertyValue({
              value: dependencyValues.compositeComponentVariable,
              propertySpecification, property
            })
            return { newValues: { [property]: propertyValue } };

          } else if (dependencyValues.targetVariable !== undefined
            && !(
              dependencyValues.targetPropertiesToIgnore &&
              dependencyValues.targetPropertiesToIgnore.map(x => x.toLowerCase()).includes(property.toLowerCase())
            )
            && (
              !usedDefault.targetVariable
              || targetComponent.state[property].useDefaultForShadows
            )) {
            // else if target has property, use that value
            return { newValues: { [property]: dependencyValues.targetVariable } };

          } else if (dependencyValues.ancestorProp !== undefined) {
            // else if have ancestor prop, so use that it wasn't based on default

            // need to validate it, since ancestor
            // may not have had the validation logic
            let ancestorPropertyValue = validatePropertyValue({
              value: dependencyValues.ancestorProp,
              propertySpecification, property
            })

            if (!usedDefault.ancestorProp) {
              return { newValues: { [property]: ancestorPropertyValue } }
            } else {
              return {
                // if ancestor prop used default, use its value as a fallback
                // if the essential value wasn't given
                useEssentialOrDefaultValue: {
                  [property]: {
                    variablesToCheck: property,
                    defaultValue: ancestorPropertyValue,
                  }
                }
              };
            }
          } else {
            // else use default value if not essential
            return {
              useEssentialOrDefaultValue: {
                [property]: { variablesToCheck: property }
              }
            };
          }

        },
        inverseDefinition: function ({ desiredStateVariableValues, dependencyValues, usedDefault }) {

          if (dependencyValues.compositeComponentVariable !== undefined && !usedDefault.compositeComponentVariable) {
            // if value of property was specified on copy component itself
            // then set that value
            return {
              success: true,
              instructions: [{
                setDependency: "compositeComponentVariable",
                desiredValue: desiredStateVariableValues[property],
              }]
            };

          } else if (dependencyValues.targetVariable !== undefined
            && !(
              dependencyValues.targetPropertiesToIgnore &&
              dependencyValues.targetPropertiesToIgnore.map(x => x.toLowerCase()).includes(property.toLowerCase())
            )
            && !usedDefault.targetVariable) {
            // else if target has property, set that value
            return {
              success: true,
              instructions: [{
                setDependency: "targetVariable",
                desiredValue: desiredStateVariableValues[property],
              }]
            };

          } else if (dependencyValues.ancestorProp !== undefined) {
            // else if have ancestor prop, so set that if not essential

            if ("ancestorProp" in usedDefault) {
              // value is essential; give it the desired value
              return {
                success: true,
                instructions: [{
                  setStateVariable: property,
                  value: desiredStateVariableValues[property]
                }]
              };
            }
            else {
              // ancestor prop was used, so propagate back to ancestor
              return {
                success: true,
                instructions: [{
                  setDependency: "ancestorProp",
                  desiredValue: desiredStateVariableValues[property],
                }]
              };
            }
          } else {
            // else used default value or essential, so set to desired value
            return {
              success: true,
              instructions: [{
                setStateVariable: property,
                desiredValue: desiredStateVariableValues[property],
              }]
            };
          }

        }
      };

      for (let attribute of ["forRenderer", "entryPrefixes"]) {
        if (attribute in propertySpecification) {
          stateVariableDefinitions[property][attribute]
            = propertySpecification[attribute];
        }
      }
    }

    if (redefineDependencies.propVariable) {

      if (!redefineDependencies.ignorePrimaryStateVariable) {
        // primaryStateVariableForDefinition is the state variable that the componentClass
        // being created has specified should be given the value when it
        // is created from an outside source like a reference to a prop or an adapter
        let primaryStateVariableForDefinition = "value";
        if (componentClass.primaryStateVariableForDefinition) {
          primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
        }
        let stateDef = stateVariableDefinitions[primaryStateVariableForDefinition];
        if (!stateDef) {
          throw Error(`Cannot have a public state variable with componentType ${componentClass.componentType} as the class doesn't have a primary state variable for definition`)
        }
        stateDef.returnDependencies = () => ({
          targetVariable: {
            dependencyType: "componentStateVariable",
            componentIdentity: {
              componentName: targetComponent.componentName,
              componentType: targetComponent.componentType
            },
            variableName: redefineDependencies.propVariable,
          },
        });
        if (stateDef.set) {
          stateDef.definition = function ({ dependencyValues }) {
            return {
              newValues: {
                [primaryStateVariableForDefinition]: stateDef.set(dependencyValues.targetVariable),
              },
              alwaysShadow: [primaryStateVariableForDefinition],
            };
          };
        } else {
          stateDef.definition = function ({ dependencyValues }) {
            return {
              newValues: {
                [primaryStateVariableForDefinition]: dependencyValues.targetVariable,
              },
              alwaysShadow: [primaryStateVariableForDefinition],
            };
          };
        }
        stateDef.inverseDefinition = function ({ desiredStateVariableValues }) {
          return {
            success: true,
            instructions: [{
              setDependency: "targetVariable",
              desiredValue: desiredStateVariableValues[primaryStateVariableForDefinition],
            }]
          };
        };
      }

      // for referencing a prop variable, don't shadow standard state variables
      // so just return now
      return;

    }

    let foundReadyToExpand = false;
    if ('readyToExpand' in stateVariableDefinitions) {
      // if shadowing a composite
      // make readyToExpand depend on the same variable
      // of the targetComponent also being resolved

      foundReadyToExpand = true;

      let stateDef = stateVariableDefinitions.readyToExpand;
      let originalReturnDependencies = stateDef.returnDependencies.bind(stateDef);
      let originalDefinition = stateDef.definition;

      stateDef.returnDependencies = function (args) {
        let dependencies = originalReturnDependencies(args);
        dependencies.targetReadyToExpand = {
          dependencyType: "componentStateVariable",
          componentIdentity: {
            componentName: targetComponent.componentName,
            componentType: targetComponent.componentType
          },
          variableName: "readyToExpand"
        }
        return dependencies;
      }

      // change definition so that it is false if targetComponent isn't ready to expand
      stateDef.definition = function (args) {
        let result = originalDefinition(args);

        if (result.newValues && result.newValues.readyToExpand) {
          if (!args.dependencyValues.targetReadyToExpand) {
            result.newValues.readyToExpand = false;
          }
        }
        return result;
      }

    }

    let stateVariablesToShadow = [...targetComponent.constructor.stateVariablesShadowedForReference];
    if (!stateVariablesToShadow) {
      stateVariablesToShadow = [];
    }

    let stateVariablesToShadowIfEssential = [];

    // also shadow any essential state variables of targetComponent
    // (Must evaluate them first so that they one can determine if essential)
    for (let varName in targetComponent.state) {
      let stateObj = targetComponent.state[varName];
      if (stateObj.isProperty || varName in stateVariablesToShadow) {
        continue; // aleady are shadowing
      }
      if (stateObj.isResolved) {
        // evaluate so know if it is essential
        stateObj.value;
      }
      if (!stateObj.neverShadow) {
        if (stateObj.essential || stateObj.alwaysShadow || stateObj.isShadow) {
          if (!stateVariablesToShadow.includes(varName)) {
            stateVariablesToShadow.push(varName);
          }
        } else if (!stateObj.isResolved) {
          if (!stateVariablesToShadowIfEssential.includes(varName)) {

            let stateDef = stateVariableDefinitions[varName];

            // some state variables, like determine dependency state variables
            // won't be in shadowing component, so skip those
            if (!stateDef) {
              continue;
            }

            let allStateVariablesAffected = [varName];
            if (stateDef.additionalStateVariablesDefined) {
              allStateVariablesAffected.push(...stateDef.additionalStateVariablesDefined)
            }

            let determineIfShadowData = {
              targetComponent,
              foundReadyToExpand
            }

            for (let varName2 of allStateVariablesAffected) {
              stateVariableDefinitions[varName2].determineIfShadowData = determineIfShadowData;
            }
            stateVariablesToShadowIfEssential.push(...allStateVariablesAffected)

          }
        }

      }
    }

    this.modifyStateDefsToBeShadows({ stateVariablesToShadow, stateVariableDefinitions, foundReadyToExpand, targetComponent });

  }

  modifyStateDefsToBeShadows({ stateVariablesToShadow, stateVariableDefinitions, foundReadyToExpand, targetComponent }) {

    let deleteStateVariablesFromDefinition = {};
    for (let varName of stateVariablesToShadow) {
      let stateDef = stateVariableDefinitions[varName];

      if (stateDef === undefined) {
        if (varName.slice(0, 8) === "__array_") {
          // have an array variable name that is created on the fly
          // rather than being specified in original definition.
          stateDef = stateVariableDefinitions[varName] = {};
        }
      }

      stateDef.isShadow = true;

      if (stateDef.additionalStateVariablesDefined) {
        for (let varName2 of stateDef.additionalStateVariablesDefined) {
          if (!stateVariablesToShadow.includes(varName2)) {
            // varName2 is not shadowed, however, it includes varName
            // in its definition
            if (!deleteStateVariablesFromDefinition[varName2]) {
              deleteStateVariablesFromDefinition[varName2] = [];
            }
            deleteStateVariablesFromDefinition[varName2].push(varName);
          }
        }
      }
      delete stateDef.additionalStateVariablesDefined;
      if (!foundReadyToExpand) {
        // if didn't find a readyToExpand,
        // then won't use original dependencies so can delete any
        // stateVariablesDeterminingDependencies
        delete stateDef.stateVariablesDeterminingDependencies;
      }

      let copyComponentType = stateDef.public && stateDef.componentType === undefined;

      if (stateDef.isArray) {
        stateDef.returnArrayDependenciesByKey = function ({ arrayKeys }) {
          let dependenciesByKey = {};

          for (let key of arrayKeys) {
            dependenciesByKey[key] = {
              targetVariable: {
                dependencyType: "componentStateVariable",
                componentIdentity: {
                  componentName: targetComponent.componentName,
                  componentType: targetComponent.componentType
                },
                variableName: this.arrayVarNameFromArrayKey(key),
              }
            };
          }

          let globalDependencies = {}

          if (copyComponentType) {
            globalDependencies.targetVariableComponentType = {
              dependencyType: "componentStateVariableComponentType",
              componentIdentity: {
                componentName: targetComponent.componentName,
                componentType: targetComponent.componentType
              },
              variableName: varName,
            }
          }
          return { globalDependencies, dependenciesByKey }
        }


        stateDef.arrayDefinitionByKey = function ({
          globalDependencyValues, dependencyValuesByKey, arrayKeys
        }) {
          // console.log(`shadow array definition by key`)
          // console.log(JSON.parse(JSON.stringify(globalDependencyValues)))
          // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
          // console.log(JSON.parse(JSON.stringify(arrayKeys)))

          let newEntries = {};

          for (let arrayKey of arrayKeys) {
            if ("targetVariable" in dependencyValuesByKey[arrayKey]) {
              newEntries[arrayKey] = dependencyValuesByKey[arrayKey].targetVariable;
            } else {
              // put in a placeholder value until this can be rerun
              // with the updated dependencies
              newEntries[arrayKey] = stateDef.defaultEntryValue;
            }
          }

          let result = {
            newValues: { [varName]: newEntries },
            alwaysShadow: [varName]
          };

          // TODO: how do we make it do this just once?
          if ("targetVariableComponentType" in globalDependencyValues) {
            result.setComponentType = {
              [varName]: globalDependencyValues.targetVariableComponentType
            }
          }

          return result;
        }


        stateDef.inverseArrayDefinitionByKey = function ({ desiredStateVariableValues,
          dependencyValuesByKey, dependencyNamesByKey, arraySize
        }) {

          let instructions = [];
          for (let key in desiredStateVariableValues[varName]) {
            if (!dependencyValuesByKey[key]) {
              continue;
            }

            instructions.push({
              setDependency: dependencyNamesByKey[key].targetVariable,
              desiredValue: desiredStateVariableValues[varName][key],
              shadowedVariable: true,
            });
          }
          return {
            success: true,
            instructions
          };

        }
      } else {

        let dependenciesStart = {};

        if (foundReadyToExpand) {
          // even though won't use original dependencies
          // if found a readyToExpand
          // keep original dependencies so that readyToExpand
          // won't be resolved until all its dependent variables are resolved
          dependenciesStart = stateDef.returnDependencies.bind(stateDef);
        }

        stateDef.returnDependencies = function (args) {
          let dependencies = Object.assign({}, dependenciesStart);

          dependencies.targetVariable = {
            dependencyType: "componentStateVariable",
            componentIdentity: {
              componentName: targetComponent.componentName,
              componentType: targetComponent.componentType
            },
            variableName: varName,
          };
          if (copyComponentType) {
            dependencies.targetVariableComponentType = {
              dependencyType: "componentStateVariableComponentType",
              componentIdentity: {
                componentName: targetComponent.componentName,
                componentType: targetComponent.componentType
              },
              variableName: varName,
            }
          }
          return dependencies;
        };
        stateDef.definition = function ({ dependencyValues }) {
          let result = {
            alwaysShadow: [varName]
          }

          // TODO: how do we make it do this just once?
          if ("targetVariableComponentType" in dependencyValues) {
            result.setComponentType = {
              [varName]: dependencyValues.targetVariableComponentType
            }
          }
          result.newValues = { [varName]: dependencyValues.targetVariable }

          return result;

        };
        stateDef.inverseDefinition = function ({ desiredStateVariableValues, dependencyValues }) {

          return {
            success: true,
            instructions: [{
              setDependency: "targetVariable",
              desiredValue: desiredStateVariableValues[varName],
              shadowedVariable: true,
            }]
          };

        };
      }
    }
    for (let varName in deleteStateVariablesFromDefinition) {
      this.modifyStateDefToDeleteVariableReferences({
        varNamesToDelete: deleteStateVariablesFromDefinition[varName],
        stateDef: stateVariableDefinitions[varName]
      });
    }
  }

  modifyStateDefToDeleteVariableReferences({ varNamesToDelete, stateDef }) {

    // delete variables from additionalStateVariablesDefined
    for (let varName2 of varNamesToDelete) {
      let ind = stateDef.additionalStateVariablesDefined.indexOf(varName2);
      stateDef.additionalStateVariablesDefined.splice(ind, 1);
    }

    // remove variables from definition
    let originalDefinition = stateDef.definition;
    stateDef.definition = function (args) {
      let results = originalDefinition(args);
      for (let key in results) {
        if (Array.isArray(results[key])) {
          for (let varName2 of varNamesToDelete) {
            let ind = results[key].indexOf(varName2);
            if (ind !== -1) {
              results[key].splice(ind, 1);
            }
          }
        }
        else {
          for (let varName2 of varNamesToDelete) {
            delete results[key][varName2];
          }
        }
      }
      return results;
    };
  }

  // createAllResolvedStateVariableDefinition({
  //   childLogic,
  //   stateVariableDefinitions
  // }) {
  //   let allStateVariables = Object.keys(stateVariableDefinitions);

  //   stateVariableDefinitions.allStateVariablesAndChildrenResolved = {
  //     returnDependencies: function () {
  //       // make dependencies be allStateVAriablesAndChildrenResolved of children
  //       // and all state variables of current component
  //       // Don't actually need the values, just need them to be resolved.

  //       let dependencies = {};
  //       for(let childLogicName in childLogic.logicComponents) {
  //         dependencies[`childLogic_${childLogicName}`] = {
  //           dependencyType: "childStateVariables",
  //           childLogicName: childLogicName,
  //           variableNames: ["allStateVariablesAndChildrenResolved"]
  //         }
  //       }
  //       for (let varName of allStateVariables) {
  //         dependencies[varName] = {
  //           dependencyType: "stateVariableResolved",
  //           variableName: varName
  //         }
  //       }
  //       return dependencies;
  //     },
  //     definition: () => ({ newValues: { allStateVariablesAndChildrenResolved: true } })
  //   }
  // }

  applySugarOrAddSugarCreationStateVariables({ component, updatesNeeded, compositesBeingExpanded }) {

    let childLogic = component.childLogic;


    if (!childLogic.logicResult.success) {
      // add action state variable that will apply sugar once child logic
      // is satisfied


      // if already have apply sugar state variable,
      // there is nothing more to do
      if (component.state.__apply_sugar) {
        return {};
      }

      let core = this;

      component.state.__apply_sugar = {
        actionOnResolved: true,
        returnDependencies: () => ({
          childLogicSatisfied: {
            dependencyType: "childLogicSatisfied",
            requireChildLogicInitiallySatisfied: true,
          }
        }),
        resolvedAction: function ({ updatesNeeded }) {

          let result = core.applySugarOrAddSugarCreationStateVariables({ component, updatesNeeded, compositesBeingExpanded });

          core.deleteAllUpstreamDependencies({ component, stateVariables: ["__apply_sugar"], updatesNeeded });
          core.deleteAllDownstreamDependencies({ component, stateVariables: ["__apply_sugar"] });

          // delete state variable itself
          delete component.state.__apply_sugar;

          if (!result.varsDeleted) {
            result.varsDeleted = [];
          }

          result.varsDeleted.push("__apply_sugar")

          return result;

        }
      }

      this.initializeStateVariable({ component, stateVariable: "__apply_sugar" });

      return {};

    }

    let varsUnresolved = {};

    for (let childLogicName in childLogic.logicResult.sugarResults) {
      // we have matched children to sugar

      // if component shadows another component
      // then we will not apply sugar
      // instead, the replacements will be made when the component
      // being shadowed has its sugar processed
      // i.e., when we applySugarToShadows
      if (component.shadows) {
        continue;
      }

      let childLogicComponent = childLogic.logicComponents[childLogicName];

      if (childLogicComponent.returnSugarDependencies) {
        // if sugar has dependencies that must be satisfied before it can be applied,
        // then for each affected childlogic component,
        // create a state variable that will apply sugar when dependencies are satisfied

        // need access to actual core functions to create child logic variables
        let core = this;

        // the name of the action state variable that to be created
        let applySugarStateVariable = `__childLogic_${childLogicName}`;

        // if already created this apply sugar state variable,
        // there is nothing more to do
        if (component.state[applySugarStateVariable]) {
          continue;
        }

        let childLogicAffected = [];
        let childLogicWaiting = {};

        if (childLogicComponent.logicToWaitOnSugar) {

          // find all child logic components affected,
          // not only those listed, but those who depend on those listed

          // first create data structure listing all the child logic components
          // that are affected by each child logic component
          // Note: think this is typically not a long loop
          // and this happens relatively rarely,
          // so that it isn't worth precomputing this data structure
          let childLogicDependencies = {};
          for (let logicName in childLogic.logicComponents) {
            let logicComponent = childLogic.logicComponents[logicName];
            if (logicComponent.propositions) {
              for (let proposition of logicComponent.propositions) {
                if (childLogicDependencies[proposition.name] === undefined) {
                  childLogicDependencies[proposition.name] = [];
                }
                childLogicDependencies[proposition.name].push(logicName);
              }
            }
          }

          // create an array of all childLogic components that are directly
          // or indirectly dependent on the components that are listed
          // as being affected by the sugar
          childLogicAffected = [...childLogicComponent.logicToWaitOnSugar];
          let logicToCheck = [...childLogicAffected];
          let logicName = logicToCheck.pop();
          while (logicName !== undefined) {
            let newComponents = childLogicDependencies[logicName];
            if (newComponents) {
              for (let comp of newComponents) {
                if (!childLogicAffected.includes(comp)) {
                  childLogicAffected.push(comp);
                  logicToCheck.push(comp);
                }
              }
            }
            logicName = logicToCheck.pop();
          }

          // for each childLogic component that is dependent on sugar
          // add to data structure that lists all child logic components
          // that are waiting on sugar
          childLogicWaiting = this.childLogicWaitingOnSugar[component.componentName];
          if (childLogicWaiting === undefined) {
            childLogicWaiting = this.childLogicWaitingOnSugar[component.componentName] = {};
          }
          for (let affectedName of childLogicAffected) {
            if (childLogicWaiting[affectedName] === undefined) {
              childLogicWaiting[affectedName] = [];
            }
            childLogicWaiting[affectedName].push(applySugarStateVariable);
          }
        }


        // create an action state variable that will run when the sugar
        // dependencies are satisfied to:
        // - apply sugar
        // - delete any dependencies of this sugar state variable
        // - delete the actual action state variable

        component.state[applySugarStateVariable] = {
          actionOnResolved: true,
          returnDependencies: childLogicComponent.returnSugarDependencies,
          resolvedAction: function ({ dependencyValues, updatesNeeded }) {

            core.replaceChildrenBySugar({
              component,
              childLogicName,
              dependencyValues,
              updatesNeeded,
              compositesBeingExpanded
            });

            core.deleteAllUpstreamDependencies({ component, stateVariables: [applySugarStateVariable], updatesNeeded });
            core.deleteAllDownstreamDependencies({ component, stateVariables: [applySugarStateVariable] });

            // delete state variable itself
            delete component.state[applySugarStateVariable];

            // delete any childLogicWaiting
            for (let affectedName of childLogicAffected) {
              if (childLogicWaiting[affectedName] !== undefined) {
                let index = childLogicWaiting[affectedName].indexOf(applySugarStateVariable);
                if (index !== -1) {
                  if (childLogicWaiting[affectedName].length === 1) {
                    delete childLogicWaiting[affectedName];
                  } else {
                    childLogicWaiting[affectedName].splice(index, 1);
                  }
                }
              }
            }

            if (!updatesNeeded.deletedStateVariables[component.componentName]) {
              updatesNeeded.deletedStateVariables[component.componentName] = [];
            }
            updatesNeeded.deletedStateVariables[component.componentName].push(applySugarStateVariable);


            return {}

          }
        }

        this.initializeStateVariable({ component, stateVariable: applySugarStateVariable });

        // if already set up dependencies for this component
        // then need to set up new state variable
        if (this.downstreamDependencies[component.componentName]) {

          this.processStateVariableDependencies({
            component,
            stateVariable: applySugarStateVariable,
            allStateVariablesAffected: [applySugarStateVariable]
          });

          let result = this.resolveStateVariables({
            component,
            stateVariables: [applySugarStateVariable],
            updatesNeeded,
            compositesBeingExpanded
          });

          Object.assign(varsUnresolved, result.varsUnresolved);

        }

      } else {

        this.replaceChildrenBySugar({
          component,
          childLogicName,
          updatesNeeded,
          compositesBeingExpanded
        });

      }

    }

    return { varsUnresolved }

  }

  initializeComponentStateVariables(component) {
    for (let stateVariable in component.state) {
      if (component.state[stateVariable].isAlias) {
        if (!component.stateVarAliases) {
          component.stateVarAliases = {};
        }
        component.stateVarAliases[stateVariable] = component.state[stateVariable].targetVariableName;

        // TODO: do we want to delete alias from state?
        delete component.state[stateVariable];
      } else {
        this.initializeStateVariable({ component, stateVariable });
      }
    }
  }

  initializeStateVariable({ component, stateVariable,
    arrayStateVariable, arrayEntryPrefix, updatesNeeded
  }) {

    // Note: updatesNeeded is required only when have arrayEntryPrefix

    let getStateVar = this.getStateVariableValue;
    if (!component.state[stateVariable]) {
      component.state[stateVariable] = {};
    }
    let stateVarObj = component.state[stateVariable];
    stateVarObj.isResolved = false;
    Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable }), configurable: true });

    if (arrayEntryPrefix !== undefined) {
      this.initializeArrayEntryStateVariable({
        stateVarObj, arrayStateVariable, arrayEntryPrefix,
        component, stateVariable, updatesNeeded
      });
    } else if (stateVarObj.isArray) {
      this.initializeArrayStateVariable({ stateVarObj, component, stateVariable });
    }

  }

  initializeArrayEntryStateVariable({ stateVarObj, arrayStateVariable,
    arrayEntryPrefix, component, stateVariable, updatesNeeded }) {
    // This function used for initializing array entry variables
    // (not the original array variable)
    // It adds many attributes to state variables corresponding to
    // array entries, including
    // - arrayStateVariable: the name of the array for which this is an entry
    // - arrayKeys: an array of the key(s) that constitute this entry
    // - markStale: function from array state variable
    // - freshnessInfo: object from array state variable
    // - getValueFromArrayValues: function used to get this entry's value

    stateVarObj.isArrayEntry = true;

    stateVarObj.neverShadow = true;

    stateVarObj.arrayStateVariable = arrayStateVariable;
    let arrayStateVarObj = component.state[arrayStateVariable];
    stateVarObj.definition = arrayStateVarObj.definition;
    stateVarObj.inverseDefinition = arrayStateVarObj.inverseDefinition;
    stateVarObj.markStale = arrayStateVarObj.markStale;
    stateVarObj.freshnessInfo = arrayStateVarObj.freshnessInfo;
    stateVarObj.getPreviousDependencyValuesForMarkStale = arrayStateVarObj.getPreviousDependencyValuesForMarkStale;

    stateVarObj.nDimensions = arrayStateVarObj.returnEntryDimensions(arrayEntryPrefix);
    stateVarObj.wrappingComponents = mapDeep(arrayStateVarObj.returnWrappingComponents(arrayEntryPrefix), x => x.toLowerCase());
    stateVarObj.entryPrefix = arrayEntryPrefix;
    stateVarObj.varEnding = stateVariable.slice(arrayEntryPrefix.length)

    // if any of the additional state variables defined are arrays,
    // (which should be all of them)
    // transform to their array entry
    if (arrayStateVarObj.additionalStateVariablesDefined) {
      stateVarObj.additionalStateVariablesDefined = [];

      let entryPrefixInd = arrayStateVarObj.entryPrefixes.indexOf(arrayEntryPrefix);

      for (let varName of arrayStateVarObj.additionalStateVariablesDefined) {
        let sObj = component.state[varName];

        if (sObj.isArray) {

          // find the same array entry prefix in the other array state variable
          let newArrayEntryPrefix = sObj.entryPrefixes[entryPrefixInd];
          let arrayEntryVarName = newArrayEntryPrefix + stateVarObj.varEnding;

          stateVarObj.additionalStateVariablesDefined.push(arrayEntryVarName);
        } else {
          stateVarObj.additionalStateVariablesDefined.push(varName);
        }
      }
    }

    // add this entry name to the array's list of its entries
    // directly manipulate the value attribute of the state variable
    // (as it is essential with no dependencies)
    // Mark it as stale and changed
    let arrayEntryNamesStateVariable = arrayStateVarObj.arrayEntryNamesStateVariable;
    let arrayEntryNames = component.state[arrayEntryNamesStateVariable].value;
    arrayEntryNames.push(stateVariable);
    this.markUpstreamDependentsStale({
      component,
      varName: arrayEntryNamesStateVariable,
      updatesNeeded
    });

    this.recordActualChangeInUpstreamDependencies({
      component, varName: arrayEntryNamesStateVariable,
    })

    // Each arrayEntry state variable will have a function getValueFromArrayValue
    // that will be used to retrieve the actual value of the components
    // specified by this entry from the whole array stored in arrayValues
    // Note: getValueFromArrayValues assumes that arrayValues has been populated
    if (arrayStateVarObj.getEntryValues) {
      // the function getEntryValues must have been overwritten by the class
      // so use this function instead
      stateVarObj.getValueFromArrayValues = function () {
        return arrayStateVarObj.getEntryValues({
          varName: stateVariable,
        });
      };
    }
    else {
      // getValueFromArrayValues returns an array of the values
      // that correspond to the arrayKeys of this entry state variable
      // (returning a scalar instead if it is just a single value)
      // It uses the function getArrayValue, which gets the values
      // from arrayValues of the corresponding array state variable
      stateVarObj.getValueFromArrayValues = function () {
        if (stateVarObj.arrayKeys.length === 0) {
          return;
        }
        let value = [];
        for (let arrayKey of stateVarObj.arrayKeys) {
          value.push(arrayStateVarObj.getArrayValue({ arrayKey }));
        }
        if (value.length === 1) {
          return value[0];
        }
        else {
          return value;
        }
      };
    }

    stateVarObj.arraySizeStateVariable = arrayStateVarObj.arraySizeStateVariable;

    this.createArrayKeysStateVariable({ stateVarObj, component, stateVariable, arrayStateVarObj });

    Object.defineProperty(stateVarObj, 'arrayKeys', {
      get: () => component.stateValues[stateVarObj.arrayKeysStateVariable]
    });

    Object.defineProperty(stateVarObj, 'arraySize', {
      get: () => component.stateValues[stateVarObj.arraySizeStateVariable]
    });

    // don't need separate state variable for unflattenedArrayKeys
    // since it will be defined if arrayKeys is defined
    // (plus it is used infrequently, so we don't need extra overhead for efficiency gain)
    Object.defineProperty(stateVarObj, 'unflattenedArrayKeys', {
      get: () => arrayStateVarObj.getArrayKeysFromVarName({
        arrayEntryPrefix: stateVarObj.entryPrefix,
        varEnding: stateVarObj.varEnding,
        arraySize: stateVarObj.arraySize,
        nDimensions: arrayStateVarObj.nDimensions,
      })
    })

    Object.defineProperty(stateVarObj, 'arrayEntrySize', {
      get: function () {
        // assume array is rectangular, so just look at first subarray of each dimension
        let unflattenedArrayKeys = stateVarObj.unflattenedArrayKeys;
        let arrayEntrySize = [];
        let subArray = [unflattenedArrayKeys];
        for (let i = 0; i < stateVarObj.nDimensions; i++) {
          subArray = subArray[0];
          arrayEntrySize.push(subArray.length);
        }
        arrayEntrySize.reverse();   // so starts with inner dimension
        return arrayEntrySize;
      }
    })

    if (arrayStateVarObj.stateVariablesDeterminingDependencies) {
      for (let varName of arrayStateVarObj.stateVariablesDeterminingDependencies) {
        if (!stateVarObj.stateVariablesDeterminingDependencies.includes(varName)) {
          stateVarObj.stateVariablesDeterminingDependencies.push(varName);
        }
      }
    }


    if (arrayStateVarObj.entireArrayAtOnce) {
      stateVarObj.entireArrayAtOnce = true;

      // if set set entire array at once, we just make return dependencies
      // be identical to the array's
      stateVarObj.returnDependencies = arrayStateVarObj.returnDependencies.bind(arrayStateVarObj);

    } else {

      // add a returnDependencies function based on the array returnDependencies
      // In createArrayKeysStateVariable, we added array keys and array size
      // to stateVariablesDeterminingDependencies
      // Now make the state variable itself depends on them.
      let arrayReturnDependencies = arrayStateVarObj.returnDependencies.bind(arrayStateVarObj);
      stateVarObj.returnDependencies = function (args) {
        // add array size to argument of return dependencies
        args.arraySize = stateVarObj.arraySize;
        args.arrayKeys = stateVarObj.arrayKeys;
        let dependencies = arrayReturnDependencies(args);
        // make sure array keys is a dependency
        dependencies.__array_keys = {
          dependencyType: "stateVariable",
          variableName: stateVarObj.arrayKeysStateVariable
        }

        // We keep track of how many names were defined when we calculate dependencies
        // If this number changes, it should be treated as dependencies changing
        // so that we recalculate the value of the arrayEntry variable
        // TODO: we are communicating this to updateDependencies by adding
        // an attribute to the arguments?  Is there a better way of doing it.
        // Didn't want to add to the return value, as that would add complexity
        // to how we normally define returnDependencies
        // We could change returnDependencies to output an object.
        // That would probably be cleaner.
        let numNames = Object.keys(arrayStateVarObj.dependencyNames.namesByKey).length;
        if (stateVarObj.numberNamesInPreviousReturnDep !== numNames) {
          args.changedDependency = true;
        }
        stateVarObj.numberNamesInPreviousReturnDep = numNames;

        return dependencies
      }
    }

  }

  initializeArrayStateVariable({ stateVarObj, component, stateVariable }) {
    // This function used for initializing original array variables
    // (not array entry variables)

    // Arrays values are stored in a (possibly-multidimensional) array
    // called arrayValues.  However, so that core doesn't have to deal
    // with special cases for multiple dimensions, array values are typically
    // referenced with an arrayKey, which is a single string that corresponds
    // to a single entry in the array.
    // For one dimension, index is an integer and arrayKey is its string representation
    // For multiple dimensions, index is an array of integers, e.g. [i,j,k]
    // and arrayKey is its string representation, i.e., "i,j,k"


    // The function adds attributes to array state variables, including
    // - arrayValues: the array of the current values of the array
    //   (i.e., based on index rather than arrayKey)
    //   arrayValues is used rather than value given that value is
    //   sometimes deleted and replaced by a getter.  arrayValues is
    //   never deleted, but entries are marked as stale using freshnessInfo
    // - freshnessInfo: this object can be used to track information about the
    //   freshness of the array entries or other array features, such as size.
    //   freshnessInfo is prepopulated with
    //     - a freshByKey object for tracking by key
    //     - a freshArraySize for tracking array size
    //   To take advantage of this object, a component can read and modify
    //   freshnessInfo (as core will pass it in as an argument) in
    //   - the state variable's definition function
    //     (to short circuit calculation of something that is already fresh and/or
    //     to indicate what is now fresh)
    //   - the state variable's optional markStale function
    //     (to indicate what is no longer fresh)
    // - keyToIndex: maps arrayKey (single string) to (multi-)index
    // - indexToKey: maps (multi-)index to arrayKey
    // - setArrayValue: sets value in arrayValues corresponding to arrayKey
    // - getArrayValue: gets value in arrayValues corresponding to arrayKey
    // - getArrayKeysFromVarName: returns array of the arrayKeys that correspond
    //   to a given variable name of an array entry
    // - arrayVarNameFromArrayKey: returns the variable name of an array entry
    //   that contains a given array key (if there are many, just return one)
    //   This variable may not yet be created.

    stateVarObj.arrayValues = [];


    if (stateVarObj.nDimensions === undefined) {
      stateVarObj.nDimensions = 1;
    }

    if (stateVarObj.nDimensions > 1) {
      // for multiple dimensions, have to convert from arrayKey
      // to multi-index when getting or setting
      // Note: we don't check that arrayKey has the appropriate number of dimensions
      // If it has fewer dimensions than nDimensions, it will set the slice
      // to the given value
      // (useful, for example, to set entire rows)
      // If it has more dimensinos than nDimensions, behavior isn't determined
      // (it should throw an error, assuming the array entries aren't arrays)
      stateVarObj.keyToIndex = key => key.split(',').map(x => Number(x));
      stateVarObj.setArrayValue = function ({ value, arrayKey, arraySize }) {
        let index = stateVarObj.keyToIndex(arrayKey);
        let nDimensionsInArrayKey = index.length;
        if (!nDimensionsInArrayKey > stateVarObj.nDimensions) {
          console.warn('Cannot set array value.  Number of dimensions is too large.')
          return;
        }
        let arrayValuesDrillDown = stateVarObj.arrayValues;
        let arraySizeDrillDown = arraySize;
        for (let indComponent of index.slice(0, index.length - 1)) {
          if (indComponent >= 0 && indComponent < arraySizeDrillDown[0]) {
            if (!arrayValuesDrillDown[indComponent]) {
              arrayValuesDrillDown[indComponent] = [];
            }
            arrayValuesDrillDown = arrayValuesDrillDown[indComponent];
            arraySizeDrillDown = arraySizeDrillDown.slice(1);
          } else {
            console.warn('ignore setting array value out of bounds')
            return;
          }
        }

        if (nDimensionsInArrayKey < stateVarObj.nDimensions) {
          // if dimensions from arrayKey is less than number of dimensions
          // then attempt to get additional dimensions from 
          // array indices of value

          function setArrayValuesPiece(desiredValue, arrayValuesPiece, arraySizePiece) {
            // try to set value of entries of arrayValuePiece to entries of desiredValue
            // given that size of arrayValuesPieces is arraySizePiece

            if (!Array.isArray(desiredValue)) {
              console.warn('ignoring array values with insufficient dimensions')
              return;
            }

            let currentSize = arraySizePiece[0];
            if (desiredValue.length > currentSize) {
              console.warn('ignoring array values of out bounds')
              desiredValue = desiredValue.slice(0, currentSize);
            }

            if (arraySizePiece.length === 1) {
              // down to last dimension
              for (let [ind, val] of desiredValue.entries()) {
                arrayValuesPiece[ind] = val;
              }
            } else {
              for (let [ind, val] of desiredValue.entries()) {
                if (!arrayValuesPiece[ind]) {
                  arrayValuesPiece = []
                }
                setArrayValuesPiece(val, arrayValuesPiece[ind], arraySizePiece[ind])
              }
            }
          }


          setArrayValuesPiece(value, arrayValuesDrillDown, arraySizeDrillDown)

        } else {
          arrayValuesDrillDown[index[index.length - 1]] = value;

        }

      };
      stateVarObj.getArrayValue = function ({ arrayKey, arrayValues = stateVarObj.arrayValues }) {
        let index = stateVarObj.keyToIndex(arrayKey);
        let aVals = arrayValues;
        for (let indComponent of index.slice(0, index.length - 1)) {
          aVals = aVals[indComponent];
          if (!aVals) {
            return undefined;
          }
        }
        return aVals[index[index.length - 1]];
      };
      if (!stateVarObj.getArrayKeysFromVarName) {
        // the default function for getArrayKeysFromVarName ignores the
        // array entry prefix, but is just based on the variable ending.
        // A component class's function could use arrayEntryPrefix
        stateVarObj.getArrayKeysFromVarName = function ({
          arrayEntryPrefix, varEnding, arraySize, nDimensions
        }) {
          let indices = varEnding.split('_').map(x => Number(x) - 1)
          if (indices.length === nDimensions && indices.every(
            (x, i) => Number.isInteger(x) && x >= 0
          )) {
            if (arraySize) {
              if (indices.every((x, i) => x < arraySize[i])) {
                return [String(indices)];
              } else {
                return [];
              }
            } else {
              // if don't know array size, just guess that the entry is OK
              // It will get corrected once array size is known.
              // TODO: better to return empty array?
              return [String(indices)];
            }
          } else {
            return [];
          }
        };
      }

      stateVarObj.getAllArrayKeys = function (arraySize, flatten = true) {
        function getAllArrayKeysSub(subArraySize) {
          if (subArraySize.length === 1) {
            // array of numbers from 0 to subArraySize[0], cast to strings
            return Array.from(Array(subArraySize[0]), (_, i) => String(i));
          } else {
            let currentSize = subArraySize[0];
            let subSubKeys = getAllArrayKeysSub(subArraySize.slice(1));
            let subKeys = [];
            for (let ind = 0; ind < currentSize; ind++) {
              if (flatten) {
                subKeys.push(...subSubKeys.map(x => ind + "," + x))
              } else {
                subKeys.push(subSubKeys.map(x => ind + "," + x))
              }
            }
            return subKeys;
          }
        }

        if (!arraySize || arraySize.length === 0) {
          return []
        } else {
          return getAllArrayKeysSub(arraySize);
        }

      }

      if (!stateVarObj.arrayVarNameFromArrayKey) {
        stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
          return entryPrefixes[0] + arrayKey.split(',').map(x => Number(x) + 1).join('_')
        };
      }

      stateVarObj.adjustArrayToNewArraySize = function () {
        function resizeSubArray(subArray, subArraySize) {

          subArray.length = subArraySize[0];

          if (subArraySize.length > 1) {
            let subSubArraySize = subArraySize.slice(1);
            for (let [ind, subSubArray] of subArray.entries()) {
              if (!subSubArray) {
                // add in any empty entries
                subSubArray = subArray[ind] = [];
              }
              resizeSubArray(subSubArray, subSubArraySize)
            }
          }
        }

        resizeSubArray(stateVarObj.arrayValues, stateVarObj.arraySize);

      }

    } else {

      // have just one dimension
      stateVarObj.keyToIndex = key => Number(key);
      stateVarObj.setArrayValue = function ({ value, arrayKey, arraySize }) {
        let ind = stateVarObj.keyToIndex(arrayKey);
        if (ind >= 0 && ind < arraySize[0]) {
          stateVarObj.arrayValues[ind] = value;
        } else {
          console.warn(`Ignoring setting array values out of bounds: ${arrayKey} of ${stateVariable}`)
        }

      };
      stateVarObj.getArrayValue = function ({ arrayKey, arrayValues = stateVarObj.arrayValues }) {
        return arrayValues[arrayKey];
      };

      if (!stateVarObj.getArrayKeysFromVarName) {
        // the default function for getArrayKeysFromVarName ignores the
        // array entry prefix, but is just based on the variable ending.
        // A component class's function could use arrayEntryPrefix
        stateVarObj.getArrayKeysFromVarName = function ({ arrayEntryPrefix, varEnding, arraySize }) {
          let index = Number(varEnding) - 1;
          if (Number.isInteger(index) && index >= 0) {
            if (arraySize) {
              if (index < arraySize[0]) {
                return [String(index)];
              } else {
                return [];
              }
            } else {
              // if don't know array size, just guess that the entry is OK
              // It will get corrected once array size is known.
              // TODO: better to return empty array?
              return [String(index)];
            }
          } else {
            return [];
          }
        };
      }

      stateVarObj.getAllArrayKeys = function (arraySize) {
        if (!arraySize || arraySize.length === 0) {
          return []
        } else {
          // array of numbers from 0 to arraySize[0], cast to strings
          return Array.from(Array(arraySize[0]), (_, i) => String(i));
        }
      }

      if (!stateVarObj.arrayVarNameFromArrayKey) {
        stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
          return entryPrefixes[0] + String(Number(arrayKey) + 1);
        };
      }


      stateVarObj.adjustArrayToNewArraySize = function () {
        // console.log(`adjust array ${stateVariable} of ${component.componentName} to new array size: ${stateVarObj.arraySize[0]}`);
        stateVarObj.arrayValues.length = stateVarObj.arraySize[0];
      }
    }

    // converting from index to key is the same for single and multiple
    // dimensions, as we just want the string representation
    stateVarObj.indexToKey = index => String(index);

    let entryPrefixes = stateVarObj.entryPrefixes;

    if (!entryPrefixes) {
      entryPrefixes = [stateVariable]
    }


    if (!component.arrayEntryPrefixes) {
      component.arrayEntryPrefixes = {};
    }
    for (let prefix of entryPrefixes) {
      component.arrayEntryPrefixes[prefix] = stateVariable;
    }

    if (!stateVarObj.returnEntryDimensions) {
      stateVarObj.returnEntryDimensions = () => 1;
    }

    // function that returns wrapping components for whole array or entries (if given prefix)
    if (!stateVarObj.returnWrappingComponents) {
      stateVarObj.returnWrappingComponents = prefix => [];
    }

    stateVarObj.wrappingComponents = mapDeep(stateVarObj.returnWrappingComponents(), x => x.toLowerCase());

    // for array, keep track if each arrayKey is essential
    stateVarObj.essentialByArrayKey = {};


    // create the definition, etc., functions for the array stsate variable
    if (stateVarObj.entireArrayAtOnce) {
      // don't change returnDependencies

      stateVarObj.getCurrentFreshness = function ({ freshnessInfo }) {
        return { fresh: { [stateVariable]: freshnessInfo.arrayFresh } }
      }

      stateVarObj.markStale = function ({ freshnessInfo }) {
        freshnessInfo.arrayFresh = false;
        return { fresh: { [stateVariable]: false } };
      }

      stateVarObj.freshenOnNoChanges = function ({ freshnessInfo }) {
        freshnessInfo.arrayFresh = true;
      }

      function getSubArraySize(subArray, nDimensionsLeft) {
        if (subArray === undefined) {
          return Array(nDimensionsLeft).fill(0);
        }
        let subArraySize = [subArray.length]
        if (nDimensionsLeft > 1) {
          subArraySize.push(...getSubArraySize(subArray[0], nDimensionsLeft - 1));
        }
        return subArraySize;
      }

      stateVarObj.definition = function (args) {

        // console.log(`definition of array ${stateVariable} of ${component.componentName}`)

        if (args.freshnessInfo.arrayFresh) {
          // have to return no changes for array size state variable,
          // as it isn't an array
          return { noChanges: [stateVarObj.arraySizeStateVariable] };
        }

        args.freshnessInfo.arrayFresh = true;

        let result = stateVarObj.entireArrayDefinition(args);

        let newArrayValues = result.newValues[stateVariable];

        let arraySize = getSubArraySize(newArrayValues, stateVarObj.nDimensions);

        result.newValues[stateVarObj.arraySizeStateVariable] = arraySize;

        if (!result.checkForActualChange) {
          result.checkForActualChange = {};
        }
        result.checkForActualChange[stateVarObj.arraySizeStateVariable] = true;

        // always mark as array size having changed,
        // although we'll verify if that's the case for entireArrayAtOnce ccase
        result.arraySizeChanged = [stateVariable];

        return result;

      }

      // don't need to change inverseDefinition

    } else {
      // create returnDependencies function from returnArrayDependenciesByKey
      stateVarObj.returnDependencies = function (args) {
        // console.log(`return dependencies for array ${stateVariable} of ${component.componentName}`)
        // console.log(JSON.parse(JSON.stringify(args)));

        args.arraySize = stateVarObj.arraySize

        // delete the interally added dependencies from args.stateValues
        for (let key in args.stateValues) {
          if (key.slice(0, 8) === "__array_") {
            delete args.stateValues[key];
          }
        }

        if (args.arrayKeys === undefined) {
          args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
        }


        let arrayDependencies = stateVarObj.returnArrayDependenciesByKey(args);

        // link all dependencyNames of additionalStateVariablesDefined
        // to the same object, as they will share the same freshnessinfo
        // TODO: a better idea?  This seems like it could lead to confusion.
        if (!stateVarObj.dependencyNames) {
          stateVarObj.dependencyNames = {
            namesByKey: {}, keysByName: {}, global: [],
          };
          if (stateVarObj.additionalStateVariablesDefined) {
            for (let vName of stateVarObj.additionalStateVariablesDefined) {
              component.state[vName].dependencyNames = stateVarObj.dependencyNames;
            }
          }
        }

        let dependencies = {};
        if (arrayDependencies.globalDependencies) {
          stateVarObj.dependencyNames.global = Object.keys(arrayDependencies.globalDependencies);
          Object.assign(dependencies, arrayDependencies.globalDependencies);
        }

        if (!arrayDependencies.dependenciesByKey) {
          arrayDependencies.dependenciesByKey = {};
        }

        for (let arrayKey of args.arrayKeys) {
          // namesByKey also functions to indicate that dependencies
          // have been returned for that arrayKey

          // If had additional nameByKey, it should be treated as dependencies changing
          // so that we recalculate the value of the array variable
          // TODO: we are communicating this to updateDependencies by adding
          // an attribute to the arguments?  Is there a better way of doing it.
          // Didn't want to add to the return value, as that would add complexity
          // to how we normally define returnDependencies
          // We could change returnDependencies to output an object.
          // That would probably be cleaner.
          if (!(arrayKey in stateVarObj.dependencyNames.namesByKey)) {
            args.changedDependency = true;
          }
          stateVarObj.dependencyNames.namesByKey[arrayKey] = {};
          for (let depName in arrayDependencies.dependenciesByKey[arrayKey]) {
            let extendedDepName = "__" + arrayKey + "_" + depName;
            dependencies[extendedDepName] = arrayDependencies.dependenciesByKey[arrayKey][depName];
            stateVarObj.dependencyNames.namesByKey[arrayKey][depName] = extendedDepName;
            if (!stateVarObj.dependencyNames.keysByName[extendedDepName]) {
              stateVarObj.dependencyNames.keysByName[extendedDepName] = [];
            }
            stateVarObj.dependencyNames.keysByName[extendedDepName].push(arrayKey);
          }
        }

        // make sure array size is a dependency
        dependencies.__array_size = {
          dependencyType: "stateVariable",
          variableName: stateVarObj.arraySizeStateVariable
        };
        stateVarObj.dependencyNames.global.push("__array_size");

        // console.log(`resulting dependencies for ${stateVariable} of ${component.componentName}`)
        // console.log(dependencies)
        return dependencies;

      }

      stateVarObj.getCurrentFreshness = function ({ freshnessInfo, arrayKeys, arraySize }) {

        // console.log(`getCurrentFreshness for array ${stateVariable} of ${component.componentName}`)
        // console.log(arrayKeys, arraySize);
        // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

        if (arrayKeys === undefined) {
          arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
        }

        let freshByKey = freshnessInfo.freshByKey;

        let numberFresh = freshnessInfo.freshArraySize ? 1 : 0;
        for (let arrayKey of arrayKeys) {
          if (freshByKey[arrayKey]) {
            numberFresh += 1;
          }
        }

        if (numberFresh > 0) {
          if (numberFresh === arrayKeys.length + 1) {
            return { fresh: { [stateVariable]: true } }
          } else {
            return { partiallyFresh: { [stateVariable]: numberFresh } }
          }
        } else {
          return { fresh: { [stateVariable]: false } }
        }

      }

      stateVarObj.markStale = function ({ freshnessInfo, changes, arrayKeys, arraySize }) {

        // console.log(`markStale for array ${stateVariable} of ${component.componentName}`)
        // console.log(changes, arrayKeys, arraySize);
        // console.log(JSON.parse(JSON.stringify(freshnessInfo)))


        let result = {};

        if (arrayKeys === undefined) {
          arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
        }

        if (stateVarObj.markStaleByKey) {
          result = stateVarObj.markStaleByKey({ arrayKeys, changes });
        }

        let freshByKey = freshnessInfo.freshByKey;

        if (changes.__array_size) {
          freshnessInfo.freshArraySize = false;
          // everything is stale
          freshnessInfo.freshByKey = {};
          result.fresh = { [stateVariable]: false };
          return result;
        }



        if (changes.__array_keys || Object.keys(freshByKey).length === 0) {
          // everything is stale, except possibly array size
          // (check for nothing fresh as a shortcut, as mark stale could
          // be called repeated if size doesn't change, given that it's partially fresh)
          freshnessInfo.freshByKey = {};
          if (freshnessInfo.freshArraySize) {
            result.partiallyFresh = { [stateVariable]: 1 }
            return result;
          } else {
            result.fresh = { [stateVariable]: false };
            return result;
          }
        }

        for (let changeName in changes) {
          if (stateVarObj.dependencyNames.global.includes(changeName)
          ) {
            // everything is stale, except possible array size
            freshnessInfo.freshByKey = {};
            if (freshnessInfo.freshArraySize) {
              result.partiallyFresh = { [stateVariable]: 1 };
              return result;
            } else {
              result.fresh = { [stateVariable]: false };
              return result;
            }
          }

          for (let key of stateVarObj.dependencyNames.keysByName[changeName]) {
            delete freshByKey[key];
          }

        }

        // check if the array keys requested are fresh
        let numberFresh = freshnessInfo.freshArraySize ? 1 : 0;
        for (let arrayKey of arrayKeys) {
          if (freshByKey[arrayKey]) {
            numberFresh += 1;
          }
        }

        // console.log(`ending freshness`)
        // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

        if (numberFresh > 0) {
          if (numberFresh === arrayKeys.length + 1) {
            result.fresh = { [stateVariable]: true };
            return result;
          } else {
            result.partiallyFresh = { [stateVariable]: numberFresh };
            return result;
          }
        } else {
          result.fresh = { [stateVariable]: false };
          return result;
        }

      }

      stateVarObj.freshenOnNoChanges = function ({ arrayKeys, freshnessInfo, arraySize }) {
        // console.log(`freshenOnNoChanges for ${stateVariable} of ${component.componentName}`)
        let freshByKey = freshnessInfo.freshByKey;

        if (arrayKeys === undefined) {
          arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
        }

        for (let arrayKey of arrayKeys) {
          freshByKey[arrayKey] = true;
        }
      }

      function extractArrayDependencies(dependencyValues, arrayKeys) {
        // console.log(`extract array dependencies`, dependencyValues, arrayKeys)
        // console.log(JSON.parse(JSON.stringify(arrayKeys)))

        let globalDependencyValues = {};
        for (let dependencyName of stateVarObj.dependencyNames.global) {
          globalDependencyValues[dependencyName] = dependencyValues[dependencyName];
        }

        let dependencyValuesByKey = {};
        let foundAllDependencyValuesForKey = {};
        for (let arrayKey of arrayKeys) {
          dependencyValuesByKey[arrayKey] = {};
          if (arrayKey in stateVarObj.dependencyNames.namesByKey) {
            foundAllDependencyValuesForKey[arrayKey] = true;
            for (let dependencyName in stateVarObj.dependencyNames.namesByKey[arrayKey]) {
              let extendedDepName = stateVarObj.dependencyNames.namesByKey[arrayKey][dependencyName];
              if (extendedDepName in dependencyValues) {
                dependencyValuesByKey[arrayKey][dependencyName] = dependencyValues[extendedDepName];
              } else {
                foundAllDependencyValuesForKey[arrayKey] = false;
              }
            }

          }
        }

        return { globalDependencyValues, dependencyValuesByKey, foundAllDependencyValuesForKey };

      }


      stateVarObj.definition = function (args) {
        // console.log(`definition in array ${stateVariable} of ${component.componentName}`)
        // console.log(JSON.parse(JSON.stringify(args)));
        // console.log(args.arrayKeys)

        if (args.arrayKeys === undefined) {
          args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
        }

        let extractedDeps = extractArrayDependencies(args.dependencyValues, args.arrayKeys);
        let globalDependencyValues = extractedDeps.globalDependencyValues;
        let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
        let foundAllDependencyValuesForKey = extractedDeps.foundAllDependencyValuesForKey;

        delete args.dependencyValues;
        args.globalDependencyValues = globalDependencyValues;
        args.dependencyValuesByKey = dependencyValuesByKey;

        let arrayKeysToRecalculate = [];
        let freshByKey = args.freshnessInfo.freshByKey;
        for (let arrayKey of args.arrayKeys) {
          // only recalculate if
          // - arrayKey isn't fresh, and
          // - found all dependency values for array key (i.e., have calculated dependencies for arrayKey)
          if (!freshByKey[arrayKey] && foundAllDependencyValuesForKey[arrayKey]) {
            freshByKey[arrayKey] = true;
            arrayKeysToRecalculate.push(arrayKey);
          }
        }

        let result;
        if (arrayKeysToRecalculate.length === 0) {
          // console.log(`nothing to recalculate`)
          // console.log(`was going to recalculate`, args.arrayKeys)
          // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
          // console.log(JSON.parse(JSON.stringify(stateVarObj.dependencyNames)))
          result = {};
        } else {

          args.arrayKeys = arrayKeysToRecalculate;

          if (!stateVarObj.arrayDefinitionByKey) {
            throw Error(`For ${stateVariable} of ${component.componentType}, arrayDefinitionByKey must be a function`)
          }

          result = stateVarObj.arrayDefinitionByKey(args);

          // in case definition returns additional array entries,
          // mark all array keys received as fresh as well
          if (result.newValues && result.newValues[stateVariable]) {
            for (let arrayKey in result.newValues[stateVariable]) {
              freshByKey[arrayKey] = true;
            }
          }
          if (result.useEssentialOrDefaultValue && result.useEssentialOrDefaultValue[stateVariable]) {
            for (let arrayKey in result.useEssentialOrDefaultValue[stateVariable]) {
              freshByKey[arrayKey] = true;
            }
          }
        }

        if (!args.freshnessInfo.freshArraySize) {
          // TODO: add additional state variables defined
          if (args.changes.__array_size) {
            result.arraySizeChanged = [stateVariable];
          }
          args.freshnessInfo.freshArraySize = true;
        }

        // console.log(`result of array definition of ${stateVariable} of ${component.componentName}`)
        // console.log(JSON.parse(JSON.stringify(result)))
        // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
        return result;

      }

      stateVarObj.inverseDefinition = function (args) {

        if (!stateVarObj.inverseArrayDefinitionByKey) {
          return { success: false }
        }

        if (args.arrayKeys === undefined) {
          args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
        }

        let extractedDeps = extractArrayDependencies(args.dependencyValues, args.arrayKeys);
        let globalDependencyValues = extractedDeps.globalDependencyValues;
        let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
        // let foundAllDependencyValuesForKey = extractedDeps.foundAllDependencyValuesForKey;

        delete args.dependencyValues;
        args.globalDependencyValues = globalDependencyValues;
        args.dependencyValuesByKey = dependencyValuesByKey;

        args.dependencyNamesByKey = stateVarObj.dependencyNames.namesByKey;
        // args.arraySize = stateVarObj.arraySize;

        // let arrayKeysToInvert = [];
        // for (let arrayKey of args.arrayKeys) {
        //   // only invert if
        //   // - found all dependency values for array key (i.e., have calculated dependencies for arrayKey)
        //   if (foundAllDependencyValuesForKey[arrayKey]) {
        //     arrayKeysToInvert.push(arrayKey);
        //   }
        // }

        // if (arrayKeysToInvert.length === 0) {
        //   return {};
        // }

        // args.arrayKeys = arrayKeysToInvert;

        let result = stateVarObj.inverseArrayDefinitionByKey(args);
        // console.log(`result of inverse definition of array`)
        // console.log(JSON.parse(JSON.stringify(result)))
        return result;
      }
    }


    this.createArraySizeStateVariable({ stateVarObj, component, stateVariable });


    Object.defineProperty(stateVarObj, 'arraySize', {
      get: () => component.stateValues[stateVarObj.arraySizeStateVariable]
    });


    this.createArrayEntryNamesStateVariable({ stateVarObj, component, stateVariable });

    Object.defineProperty(stateVarObj, 'arrayEntryNames', {
      get: () => component.stateValues[stateVarObj.arrayEntryNamesStateVariable]
    });

    this.createVarNamesIncludingArrayKeyStateVariable({ stateVarObj, component, stateVariable });

    Object.defineProperty(stateVarObj, 'varNamesIncludingArrayKey', {
      get: () => component.stateValues[stateVarObj.varNamesIncludingArrayKeyStateVariable]
    });


    // link all freshnessInfo of additionalStateVariablesDefined
    // to the same object, as they will share the same freshnessinfo
    // TODO: a better idea?  This seems like it could lead to confusion.
    if (!stateVarObj.freshnessInfo) {
      if (stateVarObj.entireArrayAtOnce) {
        stateVarObj.freshnessInfo = { arrayFresh: false };
      } else {
        stateVarObj.freshnessInfo = { freshByKey: {} };
      }
      if (stateVarObj.additionalStateVariablesDefined) {
        for (let vName of stateVarObj.additionalStateVariablesDefined) {
          if (!component.state[vName]) {
            component.state[vName] = {};
          }
          component.state[vName].freshnessInfo = stateVarObj.freshnessInfo;
        }
      }
    }


  }

  createArraySizeStateVariable({ stateVarObj, component, stateVariable }) {

    let arraySizeStateVar = `__array_size_${stateVariable}`;
    stateVarObj.arraySizeStateVariable = arraySizeStateVar;

    let originalStateVariablesDeterminingDependencies;
    let originalAdditionalStateVariablesDefined;


    if (stateVarObj.entireArrayAtOnce) {
      // if entireArrayAtOnce, array size is calculated after the fact,
      // so we don't add it to stateVariablesDeterminingDependencies
      // Instead, add it to additionalStateVariablesDefined
      if (stateVarObj.additionalStateVariablesDefined) {
        originalAdditionalStateVariablesDefined = [...stateVarObj.additionalStateVariablesDefined];
        stateVarObj.additionalStateVariablesDefined.push(arraySizeStateVar);
      } else {
        stateVarObj.additionalStateVariablesDefined = [arraySizeStateVar];
      }

    } else {

      // Make the array's dependencies depend on the array size state variable
      if (stateVarObj.stateVariablesDeterminingDependencies) {
        originalStateVariablesDeterminingDependencies = [...stateVarObj.stateVariablesDeterminingDependencies];
        stateVarObj.stateVariablesDeterminingDependencies.push(arraySizeStateVar);
      } else {
        stateVarObj.stateVariablesDeterminingDependencies = [arraySizeStateVar];
      }
    }

    if (stateVarObj.entireArrayAtOnce) {

      component.state[arraySizeStateVar] = {
        returnDependencies: stateVarObj.returnDependencies.bind(stateVarObj),
        getCurrentFreshness: stateVarObj.getCurrentFreshness.bind(stateVarObj),
        markStale: stateVarObj.markStale.bind(stateVarObj),
        freshenOnNoChanges: stateVarObj.freshenOnNoChanges.bind(stateVarObj),
        definition: stateVarObj.definition.bind(stateVarObj),
      }

      if (stateVarObj.inverseDefinition) {
        component.state[arraySizeStateVar].inverseDefinition = stateVarObj.inverseDefinition.bind(stateVarObj);
      }

      if (stateVarObj.stateVariablesDeterminingDependencies) {
        component.state[arraySizeStateVar].stateVariablesDeterminingDependencies = stateVarObj.stateVariablesDeterminingDependencies;
      }

      if (originalAdditionalStateVariablesDefined) {
        component.state[arraySizeStateVar].additionalStateVariablesDefined = originalAdditionalStateVariablesDefined;
      } else {
        component.state[arraySizeStateVar].additionalStateVariablesDefined = [];
      }
      component.state[arraySizeStateVar].additionalStateVariablesDefined.push(stateVariable)

    } else {

      // if state variable is a shadow,
      // then the array size state variable has already been created
      // to shadow target array size state variable
      if (stateVarObj.isShadow) {
        return;
      }

      component.state[arraySizeStateVar] = {
        alwaysShadow: true,
        returnDependencies: stateVarObj.returnArraySizeDependencies,
        definition({ dependencyValues }) {
          let arraySize = stateVarObj.returnArraySize({ dependencyValues });
          for (let [ind, value] of arraySize.entries()) {
            if (!(Number.isInteger(value) && value >= 0)) {
              arraySize[ind] = 0;
            }
          }
          return { newValues: { [arraySizeStateVar]: arraySize } }
        },
      };

      // Make the array size state variable's dependencies depend on
      // anything that the array state variable's dependencies depend on
      // (as the returnArraySizeDependencies function could use those).
      if (originalStateVariablesDeterminingDependencies) {
        component.state[arraySizeStateVar].stateVariablesDeterminingDependencies = originalStateVariablesDeterminingDependencies;
      }
    }

    this.initializeStateVariable({ component, stateVariable: arraySizeStateVar });

  }

  createArrayEntryNamesStateVariable({ stateVarObj, component, stateVariable }) {

    let arrayEntryNamesStateVar = `__array_entry_names_${stateVariable}`;
    stateVarObj.arrayEntryNamesStateVariable = arrayEntryNamesStateVar;

    component.state[arrayEntryNamesStateVar] = {
      neverShadow: true,
      defaultValue: [],
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          [arrayEntryNamesStateVar]: { variablesToCheck: [arrayEntryNamesStateVar] }
        }
      })
    };


    this.initializeStateVariable({ component, stateVariable: arrayEntryNamesStateVar });

    // mark it as resolved right away, as it has no dependencies
    component.state[arrayEntryNamesStateVar].isResolved = true;

  }

  createVarNamesIncludingArrayKeyStateVariable({ stateVarObj, component, stateVariable }) {

    let varNamesIncludingArrayKeyStateVar = `__array_var_names_including_array_key_${stateVariable}`;
    stateVarObj.varNamesIncludingArrayKeyStateVariable = varNamesIncludingArrayKeyStateVar;

    component.state[varNamesIncludingArrayKeyStateVar] = {
      never: true,
      stateVariablesDeterminingDependencies: [stateVarObj.arrayEntryNamesStateVariable],
      returnDependencies({ stateValues }) {
        let dependencies = {};
        for (let arrayEntryName of stateValues[stateVarObj.arrayEntryNamesStateVariable]) {
          dependencies[arrayEntryName] = {
            dependencyType: "stateVariable",
            variableName: "__array_keys_" + arrayEntryName
          }
        }
        return dependencies;
      },
      definition({ dependencyValues }) {
        let varNamesIncluding = {};
        for (let arrayEntryName in dependencyValues) {
          let arrayKeys = dependencyValues[arrayEntryName];
          // for each arrayKey, add this entry name to the array's list variables
          for (let arrayKey of flattenDeep(arrayKeys)) {
            if (!varNamesIncluding[arrayKey]) {
              varNamesIncluding[arrayKey] = [];
            }
            varNamesIncluding[arrayKey].push(arrayEntryName);
          }
        }

        return {
          newValues: {
            [varNamesIncludingArrayKeyStateVar]: varNamesIncluding
          }
        }
      }
    };


    this.initializeStateVariable({ component, stateVariable: varNamesIncludingArrayKeyStateVar });

  }

  createArrayKeysStateVariable({ stateVarObj, component, stateVariable, arrayStateVarObj }) {

    let arrayKeysStateVar = `__array_keys_${stateVariable}`;

    component.state[arrayKeysStateVar] = {
      neverShadow: true,
      returnDependencies: () => ({
        arraySize: {
          dependencyType: "stateVariable",
          variableName: arrayStateVarObj.arraySizeStateVariable
        },
      }),
      definition({ dependencyValues }) {
        let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
          arrayEntryPrefix: stateVarObj.entryPrefix,
          varEnding: stateVarObj.varEnding,
          arraySize: dependencyValues.arraySize,
          nDimensions: arrayStateVarObj.nDimensions,
        });
        return {
          newValues: { [arrayKeysStateVar]: flattenDeep(arrayKeys) }
        }
      },
    };


    if (arrayStateVarObj.entireArrayAtOnce) {
      // if we're setting entire array at once, we don't use array keys or array size
      // in the definition of arrays or array entries 
      // (as array size is calculate after the fact)
      // But, make sure stateVariablesDeterminingDependencies exists
      // so that we don't have to check later
      if (!stateVarObj.stateVariablesDeterminingDependencies) {
        stateVarObj.stateVariablesDeterminingDependencies = [];
      }
    } else {
      // make the array entry's dependencies depend on the array keys state variable
      // and on the array's array size state variable
      let arraySizeStateVar = arrayStateVarObj.arraySizeStateVariable
      if (stateVarObj.stateVariablesDeterminingDependencies) {
        stateVarObj.stateVariablesDeterminingDependencies.push(arrayKeysStateVar);
        stateVarObj.stateVariablesDeterminingDependencies.push(arraySizeStateVar);
      } else {
        stateVarObj.stateVariablesDeterminingDependencies = [arrayKeysStateVar, arraySizeStateVar];
      }
    }

    stateVarObj.arrayKeysStateVariable = arrayKeysStateVar;

    this.initializeStateVariable({ component, stateVariable: arrayKeysStateVar });

  }

  setUpComponentDependencies({ component }) {

    // if component already has downstream dependencies
    // delete them, and the corresponding upstream dependencies
    if (this.downstreamDependencies[component.componentName]) {
      this.deleteAllDownstreamDependencies({ component });
    }

    // console.log(`set up component dependencies of ${component.componentName}`)
    this.downstreamDependencies[component.componentName] = {};
    if (!this.upstreamDependencies[component.componentName]) {
      this.upstreamDependencies[component.componentName] = {};
    }

    let stateVariablesToProccess = [];
    let additionalStateVariablesThatWillBeProcessed = [];
    for (let stateVariable in component.state) {
      if (!(component.state[stateVariable].isArrayEntry ||
        component.state[stateVariable].isAlias ||
        additionalStateVariablesThatWillBeProcessed.includes(stateVariable)
      )) {
        // TODO: if do indeed keep aliases deleted from state, then don't need second check
        stateVariablesToProccess.push(stateVariable);
        if (component.state[stateVariable].additionalStateVariablesDefined) {
          additionalStateVariablesThatWillBeProcessed.push(
            ...component.state[stateVariable].additionalStateVariablesDefined
          )
        }
      }
    }

    for (let stateVariable of stateVariablesToProccess) {
      let allStateVariablesAffected = [stateVariable];
      if (component.state[stateVariable].additionalStateVariablesDefined) {
        allStateVariablesAffected.push(...component.state[stateVariable].additionalStateVariablesDefined)
      }

      this.processStateVariableDependencies({ component, stateVariable, allStateVariablesAffected });
    }

  }

  processStateVariableDependencies({ component, stateVariable, allStateVariablesAffected }) {
    let stateVarObj = component.state[stateVariable];
    let dependencies;

    if (stateVarObj.stateVariablesDeterminingDependencies || stateVarObj.determineIfShadowData) {
      let dependencyStateVar = this.createDetermineDependenciesStateVariable({
        stateVariable, component, allStateVariablesAffected
      });
      // make dependencies of actual stateVariable be this
      // determineDependencies state variable we just created
      dependencies = {
        [dependencyStateVar]: {
          dependencyType: "componentStateVariable",
          componentIdentity: {
            componentName: component.componentName,
            componentType: component.componentType
          },
          variableName: dependencyStateVar,
          __isDetermineDependencyStateVariable: true,
        }
      };
    } else {
      // Note: arrays now always have a state variable determining dependencies
      // (the array size state variable)
      // so we don't have to deal with them here

      dependencies = stateVarObj.returnDependencies({
        componentInfoObjects: this.componentInfoObjects,
        sharedParameters: component.sharedParameters,
      });
    }

    this.setUpStateVariableDependencies({
      dependencies, component, stateVariable,
      allStateVariablesAffected
    });

  }

  deleteAllDownstreamDependencies({ component, stateVariables = '__all__' }) {
    // console.log(`delete all downstream dependencies of ${component.componentName}, ${stateVariables.toString()}`)
    // console.log(deepClone(this.downstreamDependencies[component.componentName]))
    // console.log(deepClone(this.upstreamDependencies))

    let componentName = component.componentName;

    let stateVariablesToAdddress;
    if (stateVariables === '__all__') {
      stateVariablesToAdddress = Object.keys(this.downstreamDependencies[componentName]);
    } else {
      stateVariablesToAdddress = stateVariables;
    }

    for (let stateVariable of stateVariablesToAdddress) {
      let downDeps = this.downstreamDependencies[componentName][stateVariable];

      for (let downDepName in downDeps) {
        this.deleteDownstreamDependency({ downDeps, downDepName });
      }

      delete this.downstreamDependencies[componentName][stateVariable];

    }

    if (Object.keys(this.downstreamDependencies[componentName]).length === 0
      && !this._components[componentName]
    ) {
      delete this.downstreamDependencies[componentName];
    }
  }

  deleteDownstreamDependency({ downDeps, downDepName, downstreamComponentName = null }) {

    // console.log('delete downstream dependency')
    // console.log(JSON.parse(JSON.stringify(downDeps)))
    // console.log(downDepName);
    // console.log(downDeps[downDepName].upstreamComponentName)

    // if downstreamComponentName is specified, then just delete that componentName
    // from the downstream dependency, leaving the others, if there are more than
    // one downstream component name
    // Note: we don't check to see if that componentName is actually in the list
    // or is the single downstream component from the dependency

    let depToDelete = downDeps[downDepName];

    let partialDeletion = false;
    let deletedIndex;

    let downstreamComponentNames = [];
    let mappedDownstreamVariableNamesByComponent = [];
    if (depToDelete.downstreamComponentNames) {
      downstreamComponentNames = depToDelete.downstreamComponentNames;
      if (downstreamComponentName !== null && downstreamComponentNames.length > 1) {
        partialDeletion = true;

        // for effiency, should we not check if index is valid?
        deletedIndex = downstreamComponentNames.indexOf(downstreamComponentName);
        if (deletedIndex === -1) {
          throw Error('bad deleted index in dependency')
        }
        depToDelete.downstreamComponentNames.splice(deletedIndex, 1);
        downstreamComponentNames = [downstreamComponentName];
      }
      if (depToDelete.mappedDownstreamVariableNamesByComponent) {
        if (partialDeletion) {
          mappedDownstreamVariableNamesByComponent = [depToDelete.mappedDownstreamVariableNamesByComponent[deletedIndex]];
          depToDelete.mappedDownstreamVariableNamesByComponent.splice(deletedIndex, 1);
        } else {
          mappedDownstreamVariableNamesByComponent = depToDelete.mappedDownstreamVariableNamesByComponent;
        }
        if (depToDelete.variablesOptional) {
          // if variablesOptional, it is possible that no variables were found
          // in which case, the downstream variable name would become __identity
          let newVarNames = [];
          for (let [ind, cName] of downstreamComponentNames.entries()) {
            let varNamesForComponent = [];
            for (let vName of mappedDownstreamVariableNamesByComponent[ind]) {
              if (this.components[cName].state[vName]) {
                varNamesForComponent.push(vName);
              }
            }
            if (varNamesForComponent.length > 0) {
              newVarNames.push(varNamesForComponent);
            } else {
              newVarNames.push(['__identity']);
            }
          }
          mappedDownstreamVariableNamesByComponent = newVarNames;
        }
      }
      else if (depToDelete.dependencyType === "childLogicSatisfied") {
        mappedDownstreamVariableNamesByComponent = Array(downstreamComponentNames.length).fill(['__childLogic']);
      }
      else if (depToDelete.dependencyType === "expandedComposites") {
        mappedDownstreamVariableNamesByComponent = Array(downstreamComponentNames.length).fill(['__replacements']);
      }
      else {
        mappedDownstreamVariableNamesByComponent = Array(downstreamComponentNames.length).fill(['__identity']);
      }
    }
    else if (depToDelete.downstreamComponentName) {
      downstreamComponentNames = [depToDelete.downstreamComponentName];
      if (depToDelete.mappedDownstreamVariableName) {
        mappedDownstreamVariableNamesByComponent = [[depToDelete.mappedDownstreamVariableName]];
      }
      else if (depToDelete.dependencyType === "childLogicSatisfied") {
        mappedDownstreamVariableNamesByComponent = [['__childLogic']];
      }
      else if (depToDelete.dependencyType === "expandedComposites") {
        mappedDownstreamVariableNamesByComponent = [['__replacements']];
      }
      else {
        mappedDownstreamVariableNamesByComponent = [['__identity']];
      }
    }
    for (let [cInd, cName] of downstreamComponentNames.entries()) {
      for (let vName of mappedDownstreamVariableNamesByComponent[cInd]) {
        let upDeps = this.upstreamDependencies[cName][vName];
        if (upDeps) {
          let ind = upDeps.indexOf(depToDelete);
          // if find an upstream dependency, delete
          if (ind !== -1) {
            if (upDeps.length === 1) {
              delete this.upstreamDependencies[cName][vName];
            }
            else {
              upDeps.splice(ind, 1);
            }
          }
        }


        if (!['__childLogic', '__identity'].includes(vName)) {
          for (let upstreamVarName of depToDelete.upstreamVariableNames) {
            this.resetCircularCheckPassed(depToDelete.upstreamComponentName, upstreamVarName);
          }
        }
      }
    }

    if (!partialDeletion) {
      delete downDeps[downDepName];
    }
  }

  deleteAllUpstreamDependencies({ component, stateVariables = '__all__', updatesNeeded }) {
    // console.log(`delete all upstream dependencies of ${component.componentName}, ${stateVariables.toString()}`)
    // console.log(deepClone(this.downstreamDependencies))
    // console.log(deepClone(this.upstreamDependencies))

    let componentName = component.componentName;

    let stateVariablesToAdddress;
    if (stateVariables === '__all__') {
      stateVariablesToAdddress = Object.keys(this.upstreamDependencies[componentName]);
    } else {
      stateVariablesToAdddress = stateVariables;
    }

    for (let stateVariable of stateVariablesToAdddress) {
      if (this.upstreamDependencies[componentName][stateVariable]) {
        // loop over shallow copy, as upstream dependencies are changed in deleteDownstreamDependency
        for (let upDep of [...this.upstreamDependencies[componentName][stateVariable]]) {
          let upstreamComponentName = upDep.upstreamComponentName;
          if (upDep.downstreamComponentNames) {
            this.deleteDownstreamDependency({
              downDeps: this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableNames[0]],
              downDepName: upDep.dependencyName,
              downstreamComponentName: componentName
            })

          } else {
            // Note: all downstream dependencies for upstreamVariablesNames are the same object
            // so just need to delete items from the first object
            this.deleteDownstreamDependency({
              downDeps: this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableNames[0]],
              downDepName: upDep.dependencyName,
            })
            // delete this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableNames[0]][upDep.dependencyName];
          }
          // note: markStateVariableAndUpstreamDependentsStale includes
          // any additionalStateVariablesDefined with stateVariable
          this.markStateVariableAndUpstreamDependentsStale({
            component: this._components[upstreamComponentName],
            varName: upDep.upstreamVariableNames[0],
            updatesNeeded
          });

        }
      }

      // clean up by deleting entries that should now be empty objects
      delete this.upstreamDependencies[componentName][stateVariable];
    }

    if (Object.keys(this.upstreamDependencies[componentName]).length === 0
      && !this._components[componentName]
    ) {
      delete this.upstreamDependencies[componentName];
    }

  }

  setUpStateVariableDependencies({ dependencies, component, stateVariable, allStateVariablesAffected }) {

    let thisDownstream = this.downstreamDependencies[component.componentName];

    let stateVariableDependencies = {};

    for (let dependencyName in dependencies) {
      let dependencyDefinition = dependencies[dependencyName];
      let newStateVariableDependencies = this.createNewStateVariableDependency({
        component, stateVariable, allStateVariablesAffected,
        dependencyName, dependencyDefinition
      });
      Object.assign(stateVariableDependencies, newStateVariableDependencies);
    }

    if (Object.keys(stateVariableDependencies).length > 0) {
      for (let varName of allStateVariablesAffected) {
        thisDownstream[varName] = stateVariableDependencies;
        this.resetCircularCheckPassed(component.componentName, varName);
      }
      for (let varName of allStateVariablesAffected) {
        this.checkForCircularDependency({ componentName: component.componentName, varName });
      }

    }
  }

  createNewStateVariableDependency({ component, stateVariable, allStateVariablesAffected,
    dependencyName, dependencyDefinition
  }) {

    // Note: sometimes create two state variable dependencies
    // so return object will all state variable dependencies created
    let newStateVariableDependencies = {};

    let thisUpstream = this.upstreamDependencies[component.componentName];

    let newDep = {
      dependencyName,
      dependencyType: dependencyDefinition.dependencyType,
      upstreamComponentName: component.componentName,
      upstreamVariableNames: allStateVariablesAffected,
      definition: Object.assign({}, dependencyDefinition)
    };
    if (dependencyDefinition.doNotProxy) {
      newDep.doNotProxy = true;
    }
    if (dependencyDefinition.requireChildLogicInitiallySatisfied) {
      newDep.requireChildLogicInitiallySatisfied = true;
    }
    if (dependencyDefinition.__isDetermineDependencyStateVariable) {
      newDep.__isDetermineDependencyStateVariable = true;
    }
    if (dependencyDefinition.triggerParentChildLogicWhenResolved) {
      newDep.triggerParentChildLogicWhenResolved = true;
    }

    if (dependencyDefinition.dependencyType === "childStateVariables" || dependencyDefinition.dependencyType === "childIdentity") {

      let childDependencies = this.componentIdentityDependencies.childDependenciesByParent[component.componentName];
      if (!childDependencies) {
        childDependencies = this.componentIdentityDependencies.childDependenciesByParent[component.componentName] = [];
      }
      childDependencies.push({
        stateVariables: allStateVariablesAffected,
        dependencyName,
      });


      let activeChildrenIndices = component.childLogic.returnMatches(dependencyDefinition.childLogicName);
      if (activeChildrenIndices === undefined) {
        throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: childLogicName ${dependencyDefinition.childLogicName} does not exist.`);
      }

      newDep.childLogicName = dependencyDefinition.childLogicName;

      // if childIndices specified, filter out just those indices
      // Note: indices are relative to the selected ones
      // (not actual index in activeChildren)
      // so filter uses the i argument, not the x argument
      if (dependencyDefinition.childIndices !== undefined) {
        let childIndices = dependencyDefinition.childIndices.map(x => Number(x))
        activeChildrenIndices = activeChildrenIndices
          .filter((x, i) => childIndices.includes(i));
        newDep.childIndices = childIndices;
      }


      let requestStateVariables = false;
      if (dependencyDefinition.dependencyType === "childStateVariables") {
        requestStateVariables = true;

        if (!Array.isArray(dependencyDefinition.variableNames)) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableNames must be an array`)
        }
        newDep.originalDownstreamVariableNames = dependencyDefinition.variableNames;
        if (dependencyDefinition.variablesOptional) {
          newDep.variablesOptional = true;
        }
      }

      newDep.componentIdentitiesChanged = true;
      if (activeChildrenIndices.length === 0) {
        newDep.downstreamComponentNames = [];
      }
      else {
        let children = [];
        let valuesChanged = [];
        let mappedDownstreamVariableNamesByComponent = []
        for (let childIndex of activeChildrenIndices) {
          let childName = component.activeChildren[childIndex].componentName;
          children.push(childName);

          if (requestStateVariables) {
            let valsChanged = {}
            let mappedVarNames = this.substituteAliases({
              stateVariables: newDep.originalDownstreamVariableNames,
              componentClass: this._components[childName].constructor
            });
            mappedDownstreamVariableNamesByComponent.push(mappedVarNames)

            for (let vName of newDep.originalDownstreamVariableNames) {
              valsChanged[vName] = { changed: true }
            }
            valuesChanged.push(valsChanged);
          } else {
            mappedDownstreamVariableNamesByComponent.push(['__identity'])
          }

        }
        newDep.downstreamComponentNames = children;
        if (requestStateVariables) {
          newDep.valuesChanged = valuesChanged;
          newDep.mappedDownstreamVariableNamesByComponent = mappedDownstreamVariableNamesByComponent;
        }

        if (dependencyDefinition.markChildrenAsProperties) {
          for (let childIndex of activeChildrenIndices) {
            component.activeChildren[childIndex].componentIsAProperty = true;
          }
        }

        for (let [childInd, childName] of children.entries()) {
          let childUp = this.upstreamDependencies[childName];
          if (!childUp) {
            childUp = this.upstreamDependencies[childName] = {};
          }
          // mappedDownstreamVariableNamesByComponent[childInd] is ['__identity'] if child identity
          let childVarNames = mappedDownstreamVariableNamesByComponent[childInd];
          if (dependencyDefinition.variablesOptional && requestStateVariables) {
            childVarNames = [];
            for (let varName of mappedDownstreamVariableNamesByComponent[childInd]) {
              if (varName in this._components[childName].state ||
                this.checkIfArrayEntry({
                  stateVariable: varName,
                  component: this._components[childName]
                })
              ) {
                childVarNames.push(varName)
              }
            }
            if (childVarNames.length === 0) {
              childVarNames = ['__identity'];
            }
          }
          for (let varName of childVarNames) {
            if (childUp[varName] === undefined) {
              childUp[varName] = [];
            }
            childUp[varName].push(newDep);
          }
        }
      }

      if (this.childLogicWaitingOnSugar[component.componentName] &&
        this.childLogicWaitingOnSugar[component.componentName][dependencyDefinition.childLogicName]) {

        // have state variables in component corresponding to the child logic
        // with unresolved sugar
        // so make a dependency to those sugar state variables
        // This will prevent the current state variable from being resolved until
        // after the sugar is applied

        for (let childLogicStateVariable of this.childLogicWaitingOnSugar[component.componentName][dependencyDefinition.childLogicName]) {
          let childLogicDependency = {
            dependencyName: `_${dependencyName}_childLogic`,
            dependencyType: 'stateVariable',
            upstreamComponentName: component.componentName,
            upstreamVariableNames: allStateVariablesAffected,
            downstreamComponentName: component.componentName,
            originalDownstreamVariableName: childLogicStateVariable,
            mappedDownstreamVariableName: childLogicStateVariable,
            valuesChanged: { [childLogicStateVariable]: { changed: true } },
            requireChildLogicInitiallySatisfied: true,
          };

          newStateVariableDependencies[childLogicDependency.dependencyName] = childLogicDependency;
          if (thisUpstream[childLogicStateVariable] === undefined) {
            thisUpstream[childLogicStateVariable] = [];
          }
          thisUpstream[childLogicStateVariable].push(childLogicDependency);
        }
      }


    } else if (["descendantStateVariables", "descendantIdentity", "componentDescendantStateVariables", "componentDescendantIdentity"].includes(dependencyDefinition.dependencyType)) {

      let ancestor = component;
      if (["componentDescendantStateVariables", "componentDescendantIdentity"].includes(dependencyDefinition.dependencyType)) {
        ancestor = this.components[dependencyDefinition.ancestorName];

        // now treat the same regardless of ancestor determined
        if (dependencyDefinition.dependencyType === "componentDescendantStateVariables") {
          newDep.dependencyType = "descendantStateVariables";
        } else {
          newDep.dependencyType = "descendantIdentity";
        }
      }

      newDep.ancestorName = ancestor.componentName;

      let descendantDependencies = this.componentIdentityDependencies.descendantDependenciesByAncestor[ancestor.componentName];
      if (!descendantDependencies) {
        descendantDependencies = this.componentIdentityDependencies.descendantDependenciesByAncestor[ancestor.componentName] = [];
      }
      descendantDependencies.push({
        componentName: component.componentName,
        stateVariables: allStateVariablesAffected,
        dependencyName,
      });

      let descendants = gatherDescendants({
        ancestor,
        descendantClasses: dependencyDefinition.componentTypes.map(x => this.allComponentClasses[x]),
        recurseToMatchedChildren: dependencyDefinition.recurseToMatchedChildren,
        useReplacementsForComposites: dependencyDefinition.useReplacementsForComposites,
        includeNonActiveChildren: dependencyDefinition.includeNonActiveChildren,
        includePropertyChildren: dependencyDefinition.includePropertyChildren,
        ignoreReplacementsOfMatchedComposites: dependencyDefinition.ignoreReplacementsOfMatchedComposites,
        definingChildrenFirst: dependencyDefinition.definingChildrenFirst,
        compositeClass: this.allComponentClasses._composite,
      });

      newDep.componentTypes = dependencyDefinition.componentTypes.map(x => x.toLowerCase());
      newDep.recurseToMatchedChildren = dependencyDefinition.recurseToMatchedChildren;
      newDep.useReplacementsForComposites = dependencyDefinition.useReplacementsForComposites;
      newDep.includeNonActiveChildren = dependencyDefinition.includeNonActiveChildren;
      newDep.includePropertyChildren = dependencyDefinition.includePropertyChildren;
      newDep.ignoreReplacementsOfMatchedComposites = dependencyDefinition.ignoreReplacementsOfMatchedComposites;
      newDep.definingChildrenFirst = dependencyDefinition.definingChildrenFirst;

      let requestStateVariables = newDep.dependencyType === "descendantStateVariables";

      if (requestStateVariables) {
        if (!Array.isArray(dependencyDefinition.variableNames)) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableNames must be an array`)
        }
        newDep.originalDownstreamVariableNames = dependencyDefinition.variableNames;
        if (dependencyDefinition.variablesOptional) {
          newDep.variablesOptional = true;
        }
      }

      newDep.componentIdentitiesChanged = true;
      newDep.downstreamComponentNames = descendants;
      let valuesChanged = [];
      let mappedDownstreamVariableNamesByComponent = []
      if (requestStateVariables) {
        for (let descendantName of descendants) {
          let valsChanged = {}
          let mappedVarNames = this.substituteAliases({
            stateVariables: newDep.originalDownstreamVariableNames,
            componentClass: this._components[descendantName].constructor
          });
          mappedDownstreamVariableNamesByComponent.push(mappedVarNames)

          for (let vName of newDep.originalDownstreamVariableNames) {
            valsChanged[vName] = { changed: true }
          }
          valuesChanged.push(valsChanged);

        }

        newDep.valuesChanged = valuesChanged;
        newDep.mappedDownstreamVariableNamesByComponent = mappedDownstreamVariableNamesByComponent;
      }
      else {
        mappedDownstreamVariableNamesByComponent = descendants.map(() => ['__identity'])
      }


      for (let [descendantInd, descendantName] of descendants.entries()) {
        let descendantUp = this.upstreamDependencies[descendantName];
        if (!descendantUp) {
          descendantUp = this.upstreamDependencies[descendantName] = {};
        }

        // mappedDownstreamVariableNamesByComponent[descendantInd] is ['__identity'] if descendant identity
        let descendantVarNames = mappedDownstreamVariableNamesByComponent[descendantInd];
        if (dependencyDefinition.variablesOptional && requestStateVariables) {
          descendantVarNames = [];
          for (let varName of mappedDownstreamVariableNamesByComponent[descendantInd]) {
            if (varName in this._components[descendantName].state ||
              this.checkIfArrayEntry({
                stateVariable: varName,
                component: this._components[descendantName]
              })
            ) {
              descendantVarNames.push(varName)
            }
          }
          if (descendantVarNames.length === 0) {
            descendantVarNames = ['__identity'];
          }
        }
        for (let varName of descendantVarNames) {
          if (descendantUp[varName] === undefined) {
            descendantUp[varName] = [];
          }
          descendantUp[varName].push(newDep);
        }


      }

    } else if (dependencyDefinition.dependencyType === "stateVariable" ||
      dependencyDefinition.dependencyType === "stateVariableComponentType"
    ) {
      newDep.downstreamComponentName = component.componentName;
      if (dependencyDefinition.variableName === undefined) {
        throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableName is not defined`);
      }
      newDep.originalDownstreamVariableName = dependencyDefinition.variableName;
      newDep.mappedDownstreamVariableName = this.substituteAliases({
        stateVariables: [newDep.originalDownstreamVariableName],
        componentClass: component.constructor
      })[0];
      newDep.valuesChanged = { [newDep.originalDownstreamVariableName]: { changed: true } };
      if (thisUpstream[newDep.mappedDownstreamVariableName] === undefined) {
        thisUpstream[newDep.mappedDownstreamVariableName] = [];
      }
      thisUpstream[newDep.mappedDownstreamVariableName].push(newDep);
      if (dependencyDefinition.variableOptional) {
        newDep.variableOptional = true;
      }
    } else if (dependencyDefinition.dependencyType === "recursiveDependencyValues") {
      newDep.downstreamComponentName = component.componentName;
      if (dependencyDefinition.variableName === undefined) {
        throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableName is not defined`);
      }
      newDep.originalDownstreamVariableName = dependencyDefinition.variableName;
      newDep.mappedDownstreamVariableName = this.substituteAliases({
        stateVariables: [newDep.originalDownstreamVariableName],
        componentClass: component.constructor
      })[0];
      newDep.changedValuesOnly = dependencyDefinition.changedValuesOnly;
      newDep.valuesChanged = { [newDep.originalDownstreamVariableName]: { changed: true } };

      if (thisUpstream[newDep.mappedDownstreamVariableName] === undefined) {
        thisUpstream[newDep.mappedDownstreamVariableName] = [];
      }
      thisUpstream[newDep.mappedDownstreamVariableName].push(newDep);
    } else if (dependencyDefinition.dependencyType === "componentStateVariable" ||
      dependencyDefinition.dependencyType === "componentStateVariableComponentType"
    ) {
      newDep.downstreamComponentName = dependencyDefinition.componentIdentity.componentName;
      if (dependencyDefinition.variableName === undefined) {
        throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableName is not defined`);
      }
      newDep.originalDownstreamVariableName = dependencyDefinition.variableName;
      newDep.mappedDownstreamVariableName = this.substituteAliases({
        stateVariables: [newDep.originalDownstreamVariableName],
        componentClass: this.allComponentClasses[dependencyDefinition.componentIdentity.componentType.toLowerCase()]
      })[0];
      newDep.valuesChanged = { [newDep.originalDownstreamVariableName]: { changed: true } };

      let depUp = this.upstreamDependencies[newDep.downstreamComponentName];
      if (!depUp) {
        depUp = this.upstreamDependencies[newDep.downstreamComponentName] = {};
      }
      if (depUp[newDep.mappedDownstreamVariableName] === undefined) {
        depUp[newDep.mappedDownstreamVariableName] = [];
      }
      depUp[newDep.mappedDownstreamVariableName].push(newDep);
      if (dependencyDefinition.variableOptional) {
        newDep.variableOptional = true;
      }
    } else if (dependencyDefinition.dependencyType === "parentStateVariable") {
      if (!component.parentName) {
        throw Error(`cannot have state variable ${stateVariable} of ${component.componentName} depend on parentStateVariables when parent isn't defined.`);
      }
      newDep.downstreamComponentName = component.parentName;
      if (dependencyDefinition.variableName === undefined) {
        throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableName is not defined`);
      }

      let parentDependencies = this.componentIdentityDependencies.parentDependenciesByParent[component.parentName];
      if (!parentDependencies) {
        parentDependencies = this.componentIdentityDependencies.parentDependenciesByParent[component.parentName] = [];
      }
      parentDependencies.push({
        componentName: component.componentName,
        stateVariables: allStateVariablesAffected,
        dependencyName,
      });

      newDep.originalDownstreamVariableName = dependencyDefinition.variableName;
      newDep.mappedDownstreamVariableName = this.substituteAliases({
        stateVariables: [newDep.originalDownstreamVariableName],
        componentClass: component.ancestors[0].componentClass
      })[0];
      newDep.valuesChanged = { [newDep.originalDownstreamVariableName]: { changed: true } };
      let depUp = this.upstreamDependencies[component.parentName];
      if (!depUp) {
        depUp = this.upstreamDependencies[component.parentName] = {};
      }
      if (depUp[newDep.mappedDownstreamVariableName] === undefined) {
        depUp[newDep.mappedDownstreamVariableName] = [];
      }
      depUp[newDep.mappedDownstreamVariableName].push(newDep);

      // for parent state variable
      // always make variable optional so that don't get error
      // depending on parent (which a component can't control)
      newDep.variableOptional = true;

    } else if (dependencyDefinition.dependencyType === "ancestorStateVariables" || dependencyDefinition.dependencyType === "ancestorIdentity") {

      newDep.descendant = component.componentName;

      let requestStateVariables = newDep.dependencyType === "ancestorStateVariables";

      if (requestStateVariables) {
        if (!Array.isArray(dependencyDefinition.variableNames)) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableNames must be an array`)
        }
        newDep.originalDownstreamVariableNames = dependencyDefinition.variableNames;
      }

      if (dependencyDefinition.componentType) {
        newDep.componentType = dependencyDefinition.componentType.toLowerCase();
      }

      let ancestorResults = this.findMatchingAncestor({
        dependencyObj: dependencyDefinition,
        component, stateVariable, dependencyName
      });

      newDep.componentIdentityChanged = true;
      if (requestStateVariables) {
        let valsChanged = {}
        for (let vName of newDep.originalDownstreamVariableNames) {
          valsChanged[vName] = { changed: true }
        }
        newDep.valuesChanged = [valsChanged];
      }

      ancestorResults.componentName = component.componentName;

      // TODO: why is stateVariables an array of arrays?
      ancestorResults.stateVariables = [allStateVariablesAffected];
      ancestorResults.dependencyName = dependencyName;

      for (let ancestorName of ancestorResults.ancestorsExamined) {
        let ancestorDependencies = this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[ancestorName];
        if (!ancestorDependencies) {
          ancestorDependencies = this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[ancestorName] = [];
        }

        ancestorDependencies.push(ancestorResults);

      }

      if (ancestorResults.ancestorFound) {

        newDep.downstreamComponentNames = [ancestorResults.ancestorFound.componentName];

        let depUp = this.upstreamDependencies[ancestorResults.ancestorFound.componentName];
        if (!depUp) {
          depUp = this.upstreamDependencies[ancestorResults.ancestorFound.componentName] = {};
        }

        let mappedVarNames;

        if (requestStateVariables) {
          mappedVarNames = this.substituteAliases({
            stateVariables: newDep.originalDownstreamVariableNames,
            componentClass: ancestorResults.ancestorFound.componentClass
          });
          newDep.mappedDownstreamVariableNamesByComponent = [mappedVarNames];
        } else {
          mappedVarNames = ['__identity'];
        }
        for (let varName of mappedVarNames) {
          if (depUp[varName] === undefined) {
            depUp[varName] = [];
          }
          depUp[varName].push(newDep);
        }
      } else {
        newDep.downstreamComponentNames = [];
      }
    } else if (dependencyDefinition.dependencyType === "componentIdentity") {

      newDep.downstreamComponentName = dependencyDefinition.componentName;
      newDep.componentIdentityChanged = true;

      // for identity
      // it just depends on identity of downstream component

      let depUp = this.upstreamDependencies[dependencyDefinition.componentName];
      if (!depUp) {
        depUp = this.upstreamDependencies[dependencyDefinition.componentName] = {};
      }
      if (depUp['__identity'] === undefined) {
        depUp['__identity'] = [];
      }
      depUp['__identity'].push(newDep);
    } else if (dependencyDefinition.dependencyType === "replacementStateVariables" ||
      dependencyDefinition.dependencyType === "replacementIdentity"
    ) {

      let replacements = component.replacements;
      if (replacements === undefined) {
        replacements = [];
      }

      let compositesFound = [component.componentName];

      if (dependencyDefinition.recursive) {
        newDep.recursive = true;
        if (dependencyDefinition.recurseForProp) {
          newDep.recurseForProp = true;
        }
        let result = this.recursivelyReplaceCompositesWithReplacements({
          replacements,
          recurseForProp: dependencyDefinition.recurseForProp
        });
        replacements = result.newReplacements;
        compositesFound.push(...result.compositesFound);
      }

      newDep.compositesFound = compositesFound;

      let depDescription = {
        componentName: component.componentName,
        stateVariables: [allStateVariablesAffected],
        dependencyName,
      }

      for (let compositeName of newDep.compositesFound) {
        if (!this.componentIdentityDependencies.replacementDependenciesByComposite[compositeName]) {
          this.componentIdentityDependencies.replacementDependenciesByComposite[compositeName] = [];
        }
        this.componentIdentityDependencies.replacementDependenciesByComposite[compositeName].push(depDescription);
      }


      let requestStateVariables = false;
      if (dependencyDefinition.dependencyType === "replacementStateVariables") {
        requestStateVariables = true;

        if (!Array.isArray(dependencyDefinition.variableNames)) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableNames must be an array`)
        }
        newDep.originalDownstreamVariableNames = dependencyDefinition.variableNames;
        if (dependencyDefinition.variablesOptional) {
          newDep.variablesOptional = true;
        }
      }

      newDep.componentIdentitiesChanged = true;
      if (replacements.length === 0) {
        newDep.downstreamComponentNames = [];
      }
      else {
        let replacementNames = [];
        let valuesChanged = [];
        let mappedDownstreamVariableNamesByComponent = []
        for (let replacement of replacements) {
          replacementNames.push(replacement.componentName);

          if (requestStateVariables) {
            let valsChanged = {}
            let mappedVarNames = this.substituteAliases({
              stateVariables: newDep.originalDownstreamVariableNames,
              componentClass: replacement.constructor
            });
            mappedDownstreamVariableNamesByComponent.push(mappedVarNames)

            for (let vName of newDep.originalDownstreamVariableNames) {
              valsChanged[vName] = { changed: true }
            }
            valuesChanged.push(valsChanged);
          } else {
            mappedDownstreamVariableNamesByComponent.push(['__identity'])
          }

        }

        newDep.downstreamComponentNames = replacementNames;
        if (requestStateVariables) {
          newDep.valuesChanged = valuesChanged;
          newDep.mappedDownstreamVariableNamesByComponent = mappedDownstreamVariableNamesByComponent;
        }


        for (let [replacementInd, replacementName] of replacementNames.entries()) {
          let replacementUp = this.upstreamDependencies[replacementName];
          if (!replacementUp) {
            replacementUp = this.upstreamDependencies[replacementName] = {};
          }
          // mappedDownstreamVariableNamesByComponent[replacementInd] is ['__identity'] if replacement identity
          let replacementVarNames = mappedDownstreamVariableNamesByComponent[replacementInd];
          if (dependencyDefinition.variablesOptional && requestStateVariables) {
            replacementVarNames = [];
            for (let varName of mappedDownstreamVariableNamesByComponent[replacementInd]) {
              if (varName in this._components[replacementName].state ||
                this.checkIfArrayEntry({
                  stateVariable: varName,
                  component: this._components[replacementName]
                })
              ) {
                replacementVarNames.push(varName)
              }
            }
            if (replacementVarNames.length === 0) {
              replacementVarNames = ['__identity'];
            }
          }
          for (let varName of replacementVarNames) {
            if (replacementUp[varName] === undefined) {
              replacementUp[varName] = [];
            }
            replacementUp[varName].push(newDep);
          }
        }
      }

      // also create a dependency to the composites
      let dependencyName2 = '__composites_for_' + dependencyName
      let dep2 = {
        dependencyName: dependencyName2,
        dependencyType: `expandedComposites`,
        upstreamComponentName: component.componentName,
        upstreamVariableNames: allStateVariablesAffected,
        downstreamComponentNames: [...newDep.compositesFound],
        expandReplacements: true,
        componentIdentitiesChanged: true,
      };

      for (let compositeName of dep2.downstreamComponentNames) {
        let compositeUp = this.upstreamDependencies[compositeName];
        if (!compositeUp) {
          compositeUp = this.upstreamDependencies[compositeName] = {};
        }
        if (compositeUp.__replacements === undefined) {
          compositeUp.__replacements = [];
        }
        compositeUp.__replacements.push(dep2);
      }

      newStateVariableDependencies[dependencyName2] = dep2;

      // console.log(`added second dependency: ${dependencyName2}`)
      // console.log(dep2);

    } else if (dependencyDefinition.dependencyType === "componentStateVariableArraySize") {
      newDep.downstreamComponentName = dependencyDefinition.componentIdentity.componentName;
      if (dependencyDefinition.variableName === undefined) {
        throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: variableName is not defined`);
      }
      newDep.originalDownstreamArrayVariableName = dependencyDefinition.variableName;
      newDep.mappedDownstreamArrayVariableName = this.substituteAliases({
        stateVariables: [newDep.originalDownstreamArrayVariableName],
        componentClass: this.allComponentClasses[dependencyDefinition.componentIdentity.componentType.toLowerCase()]
      })[0];
      newDep.originalDownstreamVariableName = "__array_size_" + newDep.mappedDownstreamArrayVariableName;
      newDep.mappedDownstreamVariableName = newDep.originalDownstreamVariableName;

      newDep.valuesChanged = { [newDep.originalDownstreamVariableName]: { changed: true } };

      let depUp = this.upstreamDependencies[newDep.downstreamComponentName];
      if (!depUp) {
        depUp = this.upstreamDependencies[newDep.downstreamComponentName] = {};
      }
      if (depUp[newDep.mappedDownstreamVariableName] === undefined) {
        depUp[newDep.mappedDownstreamVariableName] = [];
      }
      depUp[newDep.mappedDownstreamVariableName].push(newDep);
      if (dependencyDefinition.variableOptional) {
        newDep.variableOptional = true;
      }
    } else if (dependencyDefinition.dependencyType === "doenetAttribute") {
      newDep.attributeName = dependencyDefinition.attributeName;
    } else if (dependencyDefinition.dependencyType === "flag") {
      newDep.flagName = dependencyDefinition.flagName;
    } else if (dependencyDefinition.dependencyType === "value") {
      newDep.value = dependencyDefinition.value;
    } else if (dependencyDefinition.dependencyType === "potentialEssentialVariable") {
      newDep.variableName = dependencyDefinition.variableName;
    } else if (dependencyDefinition.dependencyType === "childLogicSatisfied") {

      newDep.downstreamComponentName = component.componentName;
      newDep.valueChanged = true;
      if (thisUpstream['__childLogic'] === undefined) {
        thisUpstream['__childLogic'] = [];
      }
      thisUpstream['__childLogic'].push(newDep);

    } else if (dependencyDefinition.dependencyType !== "serializedChildren"
      && dependencyDefinition.dependencyType !== "variants"
    ) {
      throw Error(`Unrecognized dependency type ${dependencyDefinition.dependencyType}`);
    }

    newStateVariableDependencies[dependencyName] = newDep;


    return newStateVariableDependencies;

  }

  findMatchingAncestor({ dependencyObj, component, stateVariable, dependencyName }) {
    let ancestorsExamined = [];
    if (dependencyObj.componentType) {
      let ancestorsSearchClass = this.allComponentClasses[dependencyObj.componentType.toLowerCase()];
      for (let ancestor of component.ancestors) {
        ancestorsExamined.push(ancestor.componentName);
        if (ancestor.componentClass === ancestorsSearchClass ||
          ancestorsSearchClass.isPrototypeOf(ancestor.componentClass)) {
          return {
            ancestorsExamined,
            ancestorFound: ancestor
          }
        }
      }

      return { ancestorsExamined };
    }

    if (dependencyObj.dependencyType !== "ancestorStateVariables") {
      throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${dependencyName}: must have componentType for ancestor identity`);
    }

    // the state variable definition did not prescribe the component type
    // of the ancestor, but it did give the variableNames to match
    // Search all the state variables of the ancestors to find one
    // that has all the requisite state variables

    let variableNames = dependencyObj.variableNames;
    if (!variableNames) {
      // in case dependencyObj is a current dependency,
      // rather than a dependency definition,
      // then the variables names are in originalDownstreamVariableNames
      variableNames = dependencyObj.originalDownstreamVariableNames
    }

    for (let ancestor of component.ancestors) {
      ancestorsExamined.push(ancestor.componentName);
      let stateVarInfo = this.componentInfoObjects.stateVariableInfo[ancestor.componentClass.componentType]
      // let stateVarInfo = ancestor.componentClass.returnStateVariableInfo({
      //   standardComponentClasses: this.standardComponentClasses,
      //   allPossibleProperties: this.allPossibleProperties,
      // });

      let arrayEntryPrefixesLongestToShortest = Object.keys(stateVarInfo.arrayEntryPrefixes).sort((a, b) => b.length - a.length)

      let foundAllVarNames = true;
      for (let vName of variableNames) {
        if (!(vName in stateVarInfo.stateVariableDescriptions ||
          vName in stateVarInfo.aliases)) {
          let foundPrefix = false;
          for (let prefix of arrayEntryPrefixesLongestToShortest) {
            if (vName.slice(0, prefix.length) === prefix) {
              foundPrefix = true;
              break;
            }
          }
          if (!foundPrefix) {
            foundAllVarNames = false;
            break;
          }
        }
      }
      if (foundAllVarNames) {
        return {
          ancestorsExamined,
          ancestorFound: ancestor
        }
      }
    }

    return { ancestorsExamined };

  }

  createDetermineDependenciesStateVariable({
    stateVariable, component, allStateVariablesAffected
  }) {

    let stateVariablesDeterminingDependencies = component.state[stateVariable].stateVariablesDeterminingDependencies;
    if (!stateVariablesDeterminingDependencies) {
      stateVariablesDeterminingDependencies = [];
    }

    let determineIfShadowData = component.state[stateVariable].determineIfShadowData;

    let outsideStateVariablesDeterminingDependencies = [];

    if (determineIfShadowData) {
      for (let varName of allStateVariablesAffected) {
        outsideStateVariablesDeterminingDependencies.push({
          component: determineIfShadowData.targetComponent,
          stateVariable: varName
        })
      }
    }

    let dependencyStateVar = `__determine_dependencies_${stateVariable}`;

    let core = this;

    for (let varName of allStateVariablesAffected) {
      component.state[varName].determineDependenciesStateVariable = dependencyStateVar;
    }

    let stateVariablesNotShadowed = [...allStateVariablesAffected];

    component.state[dependencyStateVar] = {
      actionOnResolved: true,
      dependenciesForStateVariables: allStateVariablesAffected,
      returnDependencies: function () {
        let theseDependencies = {};
        for (let varName of stateVariablesDeterminingDependencies) {
          theseDependencies[varName] = {
            dependencyType: "componentStateVariable",
            componentIdentity: {
              componentName: component.componentName,
              componentType: component.componentType
            },
            variableName: varName
          };
        }
        for (let outsideVar of outsideStateVariablesDeterminingDependencies) {
          theseDependencies['_' + outsideVar.component.componentName + "_" + outsideVar.stateVariable] = {
            dependencyType: "componentStateVariable",
            componentIdentity: {
              componentName: outsideVar.component.componentName,
              componentType: outsideVar.component.componentType
            },
            variableName: outsideVar.stateVariable
          }
        }
        return theseDependencies;
      },
      resolvedAction({ dependencyValues, updatesNeeded }) {

        let stateVarObj = component.state[dependencyStateVar];

        // delete upstream dependencies of determine dependencies state variables
        // so that these dependencies won't show up for the regular state variables
        core.deleteAllUpstreamDependencies({ component, stateVariables: [dependencyStateVar], updatesNeeded });

        // now, can finally run returnDependencies of the state variable (and others affected)
        let varName = stateVarObj.dependenciesForStateVariables[0];
        let changedStateVarObj = component.state[varName];

        // Note: shouldn't have to delete any downstream dependencies
        // of changedStateVarObj
        // as they should have been deleted when deleting above dependencies


        // first check if we should shadow state variable
        if (determineIfShadowData) {
          let stateVariablesToShadow = [];
          stateVariablesNotShadowed = [];

          for (let varName of allStateVariablesAffected) {
            // since varName of targetComponent is now resolved
            // can evaluate it and then determine if it is essential
            determineIfShadowData.targetComponent.state[varName].value;

            if (determineIfShadowData.targetComponent.state[varName].essential
              || determineIfShadowData.targetComponent.state[varName].alwaysShadow
            ) {
              stateVariablesToShadow.push(varName);
            } else {
              stateVariablesNotShadowed.push(varName)
            }

          }

          if (stateVariablesToShadow.length > 0) {
            core.modifyStateDefsToBeShadows({
              stateVariablesToShadow,
              stateVariableDefinitions: component.state,
              foundReadyToExpand: determineIfShadowData.foundReadyToExpand,
              targetComponent: determineIfShadowData.targetComponent
            });

          }

        }

        let newDependencies;
        if (changedStateVarObj.isArray && !changedStateVarObj.entireArrayAtOnce) {
          newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
            arraySize: changedStateVarObj.arraySize,  // we know this must be resolved now
          });
        } else if (changedStateVarObj.isArrayEntry && !changedStateVarObj.entireArrayAtOnce) {
          newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
            arraySize: changedStateVarObj.arraySize,  // we know this must be resolved now
            arrayKeys: changedStateVarObj.arrayKeys // we know this must be resolved now
          });
        } else {
          newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
          });
        }

        core.setUpStateVariableDependencies({
          dependencies: newDependencies,
          component,
          stateVariable: varName,
          allStateVariablesAffected: stateVarObj.dependenciesForStateVariables
        });

        return {};
      },
      markStale: function () {
        // if have a state variable that wasn't shadowed, then we should
        // update dependencies when the state variables determining dependencies change
        if (stateVariablesNotShadowed.length > 0 && stateVariablesDeterminingDependencies.length > 0) {
          return {
            updateDependencies: component.state[dependencyStateVar].dependenciesForStateVariables
          };
        } else {
          return {};
        }
      },
      definition: () => ({ newValues: { [dependencyStateVar]: true } })
    };


    // create and set up dependencies for this determineDependencies state variable
    // i.e., repeat the process for creating a state variable here
    this.initializeStateVariable({ component, stateVariable: dependencyStateVar });
    // note: don't need to pass arguments to returnDependencies
    // since are calling above returnDependencies that doesn't take arguments
    let theseDependencies = component.state[dependencyStateVar].returnDependencies();
    this.setUpStateVariableDependencies({
      dependencies: theseDependencies,
      component,
      stateVariable: dependencyStateVar,
      allStateVariablesAffected: [dependencyStateVar],
    });

    return dependencyStateVar;
  }

  recursivelyReplaceCompositesWithReplacements({ replacements, recurseForProp }) {
    let compositesFound = [];
    let newReplacements = [];
    for (let replacement of replacements) {
      if (replacement instanceof this.allComponentClasses._composite && (
        !recurseForProp || replacement.constructor.useReplacementsWhenCopyProp
      )) {
        compositesFound.push(replacement.componentName);
        if (replacement.replacements) {
          let recursionResult = this.recursivelyReplaceCompositesWithReplacements({
            replacements: replacement.replacements,
            recurseForProp
          });
          compositesFound.push(...recursionResult.compositesFound);
          newReplacements.push(...recursionResult.newReplacements);
        }
      } else {
        newReplacements.push(replacement)
      }
    }

    return { compositesFound, newReplacements };
  }

  getStateVariableValue({ component, stateVariable }) {

    let stateVarObj = component.state[stateVariable];

    if (!(stateVarObj && stateVarObj.isResolved)) {
      throw Error(`Can't get value of ${stateVariable} of ${component.componentName} as it doesn't exist or is not resolved.`);
    }

    let definitionArgs = this.getStateVariableDependencyValues({ component, stateVariable });
    definitionArgs.componentInfoObjects = this.componentInfoObjects;

    definitionArgs.freshnessInfo = stateVarObj.freshnessInfo;

    let additionalStateVariablesDefined = stateVarObj.additionalStateVariablesDefined;

    if (component instanceof this.allComponentClasses._composite) {
      definitionArgs.replacementsWorkspace = new Proxy(component.replacementsWorkspace, readOnlyProxyHandler);
    }

    let result;

    if (Object.keys(definitionArgs.changes).length === 0 &&
      stateVarObj._previousValue !== undefined && !stateVarObj.forceRecalculation
    ) {
      let noChanges = [stateVariable];
      if (additionalStateVariablesDefined) {
        noChanges.push(...additionalStateVariablesDefined)
      }
      // console.log(`no changes for ${stateVariable} of ${component.componentName}`);
      // console.log(noChanges)
      result = { noChanges };

      if (stateVarObj.freshenOnNoChanges) {
        stateVarObj.freshenOnNoChanges(definitionArgs);
      }
    } else {
      delete stateVarObj.forceRecalculation;
      result = stateVarObj.definition(definitionArgs);
    }

    let receivedValue = {
      [stateVariable]: false,
    }

    let valuesChanged = {};

    if (additionalStateVariablesDefined) {
      for (let otherVar of additionalStateVariablesDefined) {
        receivedValue[otherVar] = false;
      }
    }


    // console.log(`result for ${stateVariable} of ${component.componentName}`)
    // console.log(result);


    for (let varName in result.newValues) {
      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} returned value of ${varName}, which isn't a state variable.`);
      }


      let matchingArrayEntry;

      if (!(varName in receivedValue)) {
        if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
          for (let arrayEntryName of component.state[varName].arrayEntryNames) {
            if (arrayEntryName in receivedValue) {
              matchingArrayEntry = arrayEntryName;
              receivedValue[arrayEntryName] = true;
              valuesChanged[arrayEntryName] = true;
              break;
            }
          }
        }
        if (!matchingArrayEntry) {
          throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      } else {
        receivedValue[varName] = true;
        valuesChanged[varName] = true;
      }

      if (!component.state[varName].isResolved) {
        if (!matchingArrayEntry || !component.state[matchingArrayEntry].isResolved) {
          throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
        }
      }

      if (component.state[varName].isArray) {

        if (component.state[varName].entireArrayAtOnce) {

          // if specify entire array at once, then expect to get an array
          // of all the array values
          // We bypass setArrayValue and set arrayValues directly
          component.state[varName].arrayValues = result.newValues[varName];

          // we don't support checkForActualChange in this case
          valuesChanged[varName] = { arrayKeysChanged: {}, allArrayKeysChanged: true };

        } else {
          valuesChanged[varName] = { arrayKeysChanged: {} };
          let checkForActualChange = {};
          if (result.checkForActualChange && result.checkForActualChange[varName]) {
            checkForActualChange = result.checkForActualChange[varName];
          }

          let arraySize = component.state[varName].arraySize;

          for (let arrayKey in result.newValues[varName]) {
            if (checkForActualChange[arrayKey]) {
              let prevValue = component.state[varName].getArrayValue({ arrayKey });
              let newValue = result.newValues[varName][arrayKey];
              if (prevValue !== newValue) {
                component.state[varName].setArrayValue({
                  value: result.newValues[varName][arrayKey],
                  arrayKey,
                  arraySize,
                });
                valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
              }
            } else {
              component.state[varName].setArrayValue({
                value: result.newValues[varName][arrayKey],
                arrayKey,
                arraySize,
              });
              valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
            }
          }
        }
      } else {
        // not an array

        // if (!(Object.getOwnPropertyDescriptor(component.state[varName], 'value').get || component.state[varName].immutable)) {
        //   throw Error(`${varName} of ${component.componentName} is not stale, but still setting its valuae!!`)
        // }

        // delete before assigning value to remove any getter for the property
        delete component.state[varName].value;
        component.state[varName].value = result.newValues[varName];
        delete component.state[varName].usedDefault;

        if (result.checkForActualChange && result.checkForActualChange[varName]) {
          let newValue = component.state[varName].value;
          let previousValue = component.state[varName]._previousValue;

          if (newValue === previousValue) {
            delete valuesChanged[varName];
          } else if (Array.isArray(newValue) && Array.isArray(previousValue)) {

            // for arrays, do a shallow comparison along first dimension
            // TODO: is there a reason to check deeper?
            // Probably, not as have array state variables that would usually handle this
            // (Need this shallow check for arraySize for entireArrayAtOnce case)
            if (newValue.length === previousValue.length &&
              newValue.every((v, i) => v === previousValue[i])
            ) {
              delete valuesChanged[varName];
            }
          }
        }

      }
    }


    for (let varName in result.useEssentialOrDefaultValue) {

      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} requested essential or default value of ${varName}, which isn't a state variable.`);
      }

      let matchingArrayEntry;

      if (!(varName in receivedValue)) {
        if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
          for (let arrayEntryName of component.state[varName].arrayEntryNames) {
            if (arrayEntryName in receivedValue) {
              matchingArrayEntry = arrayEntryName;
              receivedValue[arrayEntryName] = true;
              break;
            }
          }
        }
        if (!matchingArrayEntry) {
          throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      } else {
        receivedValue[varName] = true;
      }

      if (!component.state[varName].isResolved) {
        if (!matchingArrayEntry || !component.state[matchingArrayEntry].isResolved) {
          throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
        }
      }

      // first determine if can get value from essential state
      let { haveEssentialValue, valueUnchanged, byArrayEntries } = this.setValueToEssential({
        component, varName,
        useEssentialInfo: result.useEssentialOrDefaultValue[varName]
      });

      if (byArrayEntries) {

        let arraySize = component.state[varName].arraySize;

        for (let arrayKey in result.useEssentialOrDefaultValue[varName]) {
          if (!haveEssentialValue[arrayKey]) {
            if ("defaultValue" in result.useEssentialOrDefaultValue[varName][arrayKey]) {
              component.state[varName].setArrayValue({
                value: result.useEssentialOrDefaultValue[varName][arrayKey].defaultValue,
                arrayKey,
                arraySize,
              });
              component.state[varName].essentialByArrayKey[arrayKey] = true;
            } else if ("defaultEntryValue" in component.state[varName]) {
              component.state[varName].setArrayValue({
                value: component.state[varName].defaultEntryValue,
                arrayKey,
                arraySize,
              });
              component.state[varName].essentialByArrayKey[arrayKey] = true;
            }
          }
          if (!valueUnchanged[arrayKey]) {
            if (valuesChanged[varName] === undefined) {
              valuesChanged[varName] = { arrayKeysChanged: {} }
            }
            valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
          }
        }
      } else {
        if (!valueUnchanged) {
          valuesChanged[varName] = true;
        }
        if (!haveEssentialValue) {
          if ("defaultValue" in result.useEssentialOrDefaultValue[varName]) {
            // delete before assigning value to remove any getter for the property
            delete component.state[varName].value;
            component.state[varName].value = result.useEssentialOrDefaultValue[varName].defaultValue;
            component.state[varName].usedDefault = true;
            component.state[varName].essential = true;
          } else if ("defaultValue" in component.state[varName]) {
            // delete before assigning value to remove any getter for the property
            delete component.state[varName].value;
            component.state[varName].value = component.state[varName].defaultValue;
            component.state[varName].usedDefault = true;
            component.state[varName].essential = true;
          } else {
            throw Error(`Neither value nor default value specified; state variable: ${varName}, component: ${component.componentName}.`);
          }
        }
      }
    }


    if (result.noChanges) {
      for (let varName of result.noChanges) {
        if (!component.state[varName].isResolved) {
          throw Error(`Claiming state variable is unchanged when it isn't yet resolved: ${varName} of ${component.componentName}`)
        }

        if (!(varName in receivedValue)) {
          let matchingArrayEntry;
          if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
            for (let arrayEntryName of component.state[varName].arrayEntryNames) {
              if (arrayEntryName in receivedValue) {
                matchingArrayEntry = arrayEntryName;
                break;
              }
            }
          }
          if (!matchingArrayEntry) {
            throw Error(`Claiming stateVariable ${varName} is unchanged in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
          }
        }

        receivedValue[varName] = true;

        if (Object.getOwnPropertyDescriptor(component.state[varName], 'value').get || component.state[varName].immutable) {
          // have getter, so state variable was marked as stale
          // delete getter then assign previous value
          delete component.state[varName].value;
          component.state[varName].value = component.state[varName]._previousValue;
        }

      }
    }


    if (result.makeEssential) {
      for (let varName of result.makeEssential) {

        if (!(varName in component.state)) {
          throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} tried to make ${varName} essential, which isn't a state variable.`);
        }

        if (!component.state[varName].isResolved) {
          throw Error(`Attempting to make stateVariable ${varName} of ${component.componentName} essential while it is still unresolved!`)
        }

        if (!(varName in receivedValue)) {
          let matchingArrayEntry;
          if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
            for (let arrayEntryName of component.state[varName].arrayEntryNames) {
              if (arrayEntryName in receivedValue) {
                matchingArrayEntry = arrayEntryName;
                break;
              }
            }
          }
          if (!matchingArrayEntry) {
            throw Error(`Attempting to make stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName} essential, but it's not listed as an additional state variable defined.`)
          }
        }

        component.state[varName].essential = true;
      }
    }

    if (result.makeImmutable) {
      for (let varName of result.makeImmutable) {

        if (!(varName in component.state)) {
          throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} tried to make ${varName} immutable, which isn't a state variable.`);
        }

        if (!component.state[varName].isResolved) {
          throw Error(`Attempting to make stateVariable ${varName} of ${component.componentName} immutable while it is still unresolved!`)
        }

        if (!(varName in receivedValue)) {
          let matchingArrayEntry;
          if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
            for (let arrayEntryName of component.state[varName].arrayEntryNames) {
              if (arrayEntryName in receivedValue) {
                matchingArrayEntry = arrayEntryName;
                break;
              }
            }
          }
          if (!matchingArrayEntry) {
            throw Error(`Attempting to make stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName} immutable, but it's not listed as an additional state variable defined.`)
          }
        }

        component.state[varName].immutable = true;
      }
    }

    if (result.alwaysShadow) {
      for (let varName of result.alwaysShadow) {
        if (!(varName in component.state)) {
          throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} set alwaysShadow for ${varName}, which isn't a state variable.`);
        }
        if (!(varName in receivedValue)) {
          let foundMatchingArrayEntry = false;
          if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
            for (let arrayEntryName of component.state[varName].arrayEntryNames) {
              if (arrayEntryName in receivedValue) {
                foundMatchingArrayEntry = true;
                break;
              }
            }
          }
          if (!foundMatchingArrayEntry) {
            throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} set alwaysShadow for ${varName}, but didn't set its value.`);
          }
        }
        component.state[varName].alwaysShadow = true;
      }
    }

    if (result.setComponentType) {
      for (let varName in result.setComponentType) {
        component.state[varName].componentType = result.setComponentType[varName];
        if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
          let arrayComponentType = result.setComponentType[varName];
          let arrayComponentTypeIsArray = Array.isArray(arrayComponentType)
          for (let arrayEntryName of component.state[varName].arrayEntryNames) {
            // TODO: address multidimensional arrays
            if (arrayComponentTypeIsArray) {
              let arrayKeys = component.state[arrayEntryName].arrayKeys;
              let componentType = [];
              for (let arrayKey of arrayKeys) {
                let ind = component.state[varName].keyToIndex(arrayKey);
                componentType.push(arrayComponentType[ind])
              }
              component.state[arrayEntryName].componentType = componentType;
            } else {
              component.state[arrayEntryName].componentType = arrayComponentType;

            }
          }
        }
      }
    }

    if (result.arraySizeChanged) {
      for (let varName of result.arraySizeChanged) {

        if (component.state[varName].entireArrayAtOnce) {
          // check if arraySizeVariables is in varsChanged, since we already
          // compared to see if it changed
          if (valuesChanged[component.state[varName].arraySizeStateVariable]) {
            if (valuesChanged[varName] === undefined) {
              valuesChanged[varName] = { arrayKeysChanged: {} }
            } else if (valuesChanged[varName] === true) {
              valuesChanged[varName] = { allArrayKeysChanged: true, arrayKeysChanged: {} }
            }
            valuesChanged[varName].arraySizeChanged = true;
          }
        } else {

          component.state[varName].adjustArrayToNewArraySize();

          if (valuesChanged[varName] === undefined) {
            valuesChanged[varName] = { arrayKeysChanged: {} }
          } else if (valuesChanged[varName] === true) {
            valuesChanged[varName] = { allArrayKeysChanged: true, arrayKeysChanged: {} }
          }
          valuesChanged[varName].arraySizeChanged = true;
        }
      }

    }


    for (let varName in receivedValue) {
      if (!(receivedValue[varName] ||
        component.state[varName].isArrayEntry ||
        component.state[varName].isArray
      )) {
        throw Error(`definition of ${stateVariable} of ${component.componentName} didn't return value of ${varName}`);
      }

      if (component.state[varName].isArray) {
        // delete before assigning value to remove any getter for the property
        delete component.state[varName].value;
        component.state[varName].value = component.state[varName].arrayValues;
      } else if (component.state[varName].isArrayEntry) {
        delete component.state[varName].value;
        if (component.state[varName].entireArrayAtOnce) {

          // if value of arraySize has changed, need to record its actual change now
          // before we try to access the value of arrayKeys
          // (Otherwise, arrayKey won't be told that arraySize changed)
          let arraySizeVarName = component.state[varName].arraySizeStateVariable;
          if (valuesChanged[arraySizeVarName]) {
            this.recordActualChangeInUpstreamDependencies({
              component, varName: arraySizeVarName,
              changes: valuesChanged[arraySizeVarName]
            });

            delete valuesChanged[arraySizeVarName]
          }

        }
        component.state[varName].value = component.state[varName].getValueFromArrayValues();
      }

    }

    for (let varName in valuesChanged) {
      this.recordActualChangeInUpstreamDependencies({
        component, varName,
        changes: valuesChanged[varName] // so far, just in case is an array state variable
      })

      if (component.state[varName].isArray) {
        let arrayVarNamesChanged = [];
        if (valuesChanged[varName].allArrayKeysChanged || valuesChanged.arraySizeChanged) {
          if (component.state[varName].arrayEntryNames) {
            arrayVarNamesChanged = component.state[varName].arrayEntryNames;
          }
        } else {
          let varNamesStateVar = component.state[varName].varNamesIncludingArrayKeyStateVariable;
          let varNamesByArrayKey = component.stateValues[varNamesStateVar];
          for (let arrayKeyChanged in valuesChanged[varName].arrayKeysChanged) {
            let additionalVarNamesChanged = varNamesByArrayKey[arrayKeyChanged];
            if (additionalVarNamesChanged) {
              arrayVarNamesChanged.push(...additionalVarNamesChanged)
            }
          }
        }
        for (let arrayVarName of arrayVarNamesChanged) {
          this.recordActualChangeInUpstreamDependencies({
            component, varName: arrayVarName,
          })
        }
      }

    }


    return stateVarObj.value;

  }

  setValueToEssential({ component, varName, useEssentialInfo }) {
    let haveEssentialValue = false;
    let valueUnchanged = false;
    let byArrayEntries = false;

    if (component.state[varName].isArray) {
      if ("__entire_array" in useEssentialInfo) {
        useEssentialInfo = useEssentialInfo.__entire_array;
      } else {
        byArrayEntries = true;
        valueUnchanged = {};
        haveEssentialValue = {};
        for (let arrayKey in useEssentialInfo) {
          haveEssentialValue[arrayKey] = false;
        }
      }
    }

    // if state variable itself is already essential, then don't change the value
    // just use the previous value
    if (component.state[varName].essential && !byArrayEntries) {
      if (!component.state[varName].isArray) {
        // (if isArray, then arrayValues should still have previous value)

        // delete value to remove getter
        delete component.state[varName].value;
        component.state[varName].value = component.state[varName]._previousValue;
      }
      // return that did set it to an essential value
      return { haveEssentialValue: true, valueUnchanged: true, byArrayEntries };
    }
    if (component.potentialEssentialState) {
      if (byArrayEntries) {
        let arraySize = component.state[varName].arraySize;
        for (let arrayKey in useEssentialInfo) {
          if (component.state[varName].essentialByArrayKey[arrayKey] || component.state[varName].essential) {
            // if already essential, no need to do more
            haveEssentialValue[arrayKey] = true;
            valueUnchanged[arrayKey] = true;

          } else {
            let variablesToCheck = useEssentialInfo[arrayKey].variablesToCheck;
            if (!Array.isArray(variablesToCheck)) {
              variablesToCheck = [variablesToCheck];
            }
            let { foundEssential, value } = this.findPotentialEssentialValue({
              variablesToCheck,
              potentialEssentialState: component.potentialEssentialState
            });

            if (foundEssential) {
              component.state[varName].setArrayValue({
                value,
                arrayKey,
                arraySize
              });
              component.state[varName].essentialByArrayKey[arrayKey] = true;
              haveEssentialValue[arrayKey] = true;
            }
          }
        }
      }
      else {
        let variablesToCheck = useEssentialInfo.variablesToCheck;
        if (!Array.isArray(variablesToCheck)) {
          variablesToCheck = [variablesToCheck];
        }

        let { foundEssential, value } = this.findPotentialEssentialValue({
          variablesToCheck,
          potentialEssentialState: component.potentialEssentialState
        });

        if (foundEssential) {

          if (component.state[varName].isArray) {
            component.state[varName].arrayValues = value;
          } else {
            // delete before assigning value to remove any getter for the property
            delete component.state[varName].value;
            component.state[varName].value = value;
          }
          component.state[varName].essential = true;
          haveEssentialValue = true;
        }
      }
    } else if (byArrayEntries) {
      // if don't have potential essential state,
      // still check if arrayKeys are already essential
      for (let arrayKey in useEssentialInfo) {
        if (component.state[varName].essentialByArrayKey[arrayKey] || component.state[varName].essential) {
          haveEssentialValue[arrayKey] = true;
          valueUnchanged[arrayKey] = true;
        }
      }
    }
    return { haveEssentialValue, valueUnchanged, byArrayEntries };
  }


  findPotentialEssentialValue({ variablesToCheck, potentialEssentialState }) {
    for (let essentialVarInfo of variablesToCheck) {
      let essentialVarName, mathComponentIndex, arrayIndex;
      if (typeof essentialVarInfo === "string") {
        essentialVarName = essentialVarInfo;
      }
      else {
        essentialVarName = essentialVarInfo.variableName;
        mathComponentIndex = essentialVarInfo.mathComponentIndex;
        arrayIndex = essentialVarInfo.arrayIndex;
      }
      if (potentialEssentialState[essentialVarName] !== undefined) {
        let value = potentialEssentialState[essentialVarName];
        if (arrayIndex !== undefined) {
          if (Array.isArray(arrayIndex)) {
            for (let ind of arrayIndex) {
              value = value[ind];
            }
          }
          else {
            value = value[arrayIndex];
          }
        }
        else if (mathComponentIndex !== undefined && value instanceof me.class) {
          value = value.get_component(mathComponentIndex);
        }

        return {
          foundEssential: true,
          value
        }
      }
    }

    return { foundEssential: false }
  }

  getStateVariableDependencyValues({ component, stateVariable }) {
    // console.log(`get state variable dependencies of ${component.componentName}, ${stateVariable}`)

    let dependencyValues = {};
    let changes = {};
    let usedDefault = {};

    let downDeps = this.downstreamDependencies[component.componentName][stateVariable];

    for (let dependencyName in downDeps) {
      let dep = downDeps[dependencyName];

      let value;

      if (dep.dependencyType === "childStateVariables" ||
        dep.dependencyType === "childIdentity" ||
        dep.dependencyType === "descendantStateVariables" ||
        dep.dependencyType === "descendantIdentity" ||
        dep.dependencyType === "replacementStateVariables" ||
        dep.dependencyType === "replacementIdentity" ||
        dep.dependencyType === "expandedComposites"
      ) {

        let newDep = [];
        let newChanges = {};

        if (dep.componentIdentitiesChanged) {
          newChanges.componentIdentitiesChanged = true;
          dep.componentIdentitiesChanged = false;
        }

        for (let [childInd, childName] of dep.downstreamComponentNames.entries()) {
          let depComponent = this.components[childName];

          let childObj = {
            componentName: depComponent.componentName,
            componentType: depComponent.componentType,
            stateValues: {}
          };

          if (dep.originalDownstreamVariableNames) {
            for (let [varInd, originalVarName] of dep.originalDownstreamVariableNames.entries()) {
              let mappedVarName = dep.mappedDownstreamVariableNamesByComponent[childInd][varInd];

              if (!dep.variablesOptional || mappedVarName in depComponent.state) {
                if (!depComponent.state[mappedVarName].deferred) {
                  childObj.stateValues[originalVarName] = depComponent.stateValues[mappedVarName];
                  if (dep.valuesChanged && dep.valuesChanged[childInd] &&
                    dep.valuesChanged[childInd][originalVarName] && dep.valuesChanged[childInd][originalVarName].changed
                  ) {
                    if (!newChanges.valuesChanged) {
                      newChanges.valuesChanged = {};
                    }
                    if (!newChanges.valuesChanged[childInd]) {
                      newChanges.valuesChanged[childInd] = {}
                    }
                    newChanges.valuesChanged[childInd][originalVarName] = dep.valuesChanged[childInd][originalVarName];
                  }
                }
              }
            }
          }

          newDep.push(childObj);

        }

        delete dep.valuesChanged;

        value = newDep;
        if (Object.keys(newChanges).length > 0) {
          changes[dep.dependencyName] = newChanges;
        }

      } else if (dep.dependencyType === "ancestorStateVariables" ||
        dep.dependencyType === "ancestorIdentity"
      ) {

        let newDep = null;
        let newChanges = {};

        if (dep.componentIdentityChanged) {
          newChanges.componentIdentityChanged = true;
          dep.componentIdentityChanged = false;
        }

        if (dep.downstreamComponentNames.length === 1) {
          let depComponent = this.components[dep.downstreamComponentNames[0]];

          let ancestorObj = {
            componentName: depComponent.componentName,
            componentType: depComponent.componentType,
            stateValues: {}
          };

          if (dep.originalDownstreamVariableNames) {
            for (let [varInd, originalVarName] of dep.originalDownstreamVariableNames.entries()) {
              let mappedVarName = dep.mappedDownstreamVariableNamesByComponent[0][varInd];

              if (!dep.variablesOptional || mappedVarName in depComponent.state) {
                if (!depComponent.state[mappedVarName].deferred) {
                  ancestorObj.stateValues[originalVarName] = depComponent.stateValues[mappedVarName];
                  if (dep.valuesChanged && dep.valuesChanged[0] && dep.valuesChanged[0][originalVarName] &&
                    dep.valuesChanged[0][originalVarName].changed
                  ) {
                    if (!newChanges.valuesChanged) {
                      newChanges.valuesChanged = [{}]
                    }
                    newChanges.valuesChanged[0][originalVarName] = dep.valuesChanged[0][originalVarName];
                  }
                }
              }
            }
          }

          newDep = ancestorObj;

        }

        delete dep.valuesChanged;

        value = newDep;
        if (Object.keys(newChanges).length > 0) {
          changes[dep.dependencyName] = newChanges;
        }

      } else if (dep.dependencyType === "stateVariable" ||
        dep.dependencyType === "componentStateVariable" ||
        dep.dependencyType === "parentStateVariable" ||
        dep.dependencyType === "componentStateVariableArraySize") {

        let depComponent = this.components[dep.downstreamComponentName];

        if (!dep.variableOptional || dep.mappedDownstreamVariableName in depComponent.state) {

          value = depComponent.state[dep.mappedDownstreamVariableName].value;

          // if have valuesChanged, then must have dep.originalDownstreamVariableName
          // so don't bother checking if it exists
          if (dep.valuesChanged && dep.valuesChanged[dep.originalDownstreamVariableName].changed) {
            changes[dep.dependencyName] = { valuesChanged: dep.valuesChanged };
            delete dep.valuesChanged;
          }
          if (depComponent.state[dep.mappedDownstreamVariableName].usedDefault) {
            usedDefault[dep.dependencyName] = true
          }
        } else {
          // variable is optional and doesn't exist
          value = null;
        }
      } else if (dep.dependencyType === "componentStateVariableComponentType" ||
        dep.dependencyType === "stateVariableComponentType"
      ) {
        let depComponent = this.components[dep.downstreamComponentName];
        // call getter to make sure component type is set
        depComponent.state[dep.mappedDownstreamVariableName].value;
        value = depComponent.state[dep.mappedDownstreamVariableName].componentType;
        // if have valuesChanged, then must have dep.originalDownstreamVariableName
        // so don't bother checking if it exists
        if (dep.valuesChanged && dep.valuesChanged[dep.originalDownstreamVariableName].changed) {
          changes[dep.dependencyName] = { valuesChanged: dep.valuesChanged };
          delete dep.valuesChanged;
        }
      } else if (dep.dependencyType === "componentIdentity") {

        let depComponent = this.components[dep.downstreamComponentName];
        value = {
          componentName: depComponent.componentName,
          componentType: depComponent.componentType,
        };

        if (dep.componentIdentitiesChanged) {
          changes[dep.dependencyName] = { componentIdentitiesChanged: true };
          dep.componentIdentitiesChanged = false;
        }
      } else if (dep.dependencyType === "recursiveDependencyValues") {
        // first calculate value of state variable
        // since dependencies are created as though depended on state variable itself
        this.components[dep.downstreamComponentName].stateValues[dep.mappedDownstreamVariableName]

        value = this.getStateVariableRecursiveDependencyValues({
          componentName: dep.downstreamComponentName,
          stateVariable: dep.mappedDownstreamVariableName,
          changedValuesOnly: dep.changedValuesOnly,
        })

        // don't check if have .changed attribute
        // as it wouldn't reflect if a change occurred anywhere in the dependencies
        if (dep.valuesChanged) {
          changes[dep.dependencyName] = { valuesChanged: dep.valuesChanged };
          delete dep.valuesChanged;
        }
      } else if (dep.dependencyType === "doenetAttribute") {
        value = component.doenetAttributes[dep.attributeName];
      } else if (dep.dependencyType === "flag") {
        value = this.flags[dep.flagName];
      } else if (dep.dependencyType === "value") {
        value = dep.value;
      } else if (dep.dependencyType === "serializedChildren") {
        value = component.serializedChildren;
      } else if (dep.dependencyType === "variants") {
        value = component.variants;
      } else if (dep.dependencyType === "potentialEssentialVariable") {
        if (component.potentialEssentialState) {
          value = component.potentialEssentialState[dep.variableName];
        } else {
          value = null;
        }
      } else if (dep.dependencyType === "childLogicSatisfied" ||
        dep.dependencyType === "unresolvedUntilChildLogicSatisfied"
      ) {

        value = component.childLogicSatisfied;

        if (dep.valueChanged) {
          changes[dep.dependencyName] = { valueChanged: dep.valuesChanged };
          delete dep.valueChanged;
        }

      } else {
        throw Error(`unrecognized dependency type ${dep.dependencyType}`);
      }

      if (!dep.doNotProxy && value !== null && typeof value === 'object') {
        value = new Proxy(value, readOnlyProxyHandler)
      }

      dependencyValues[dep.dependencyName] = value;
    }

    let args = {
      dependencyValues,
      changes, usedDefault,
    }

    let stateVarObj = component.state[stateVariable];
    if (stateVarObj.isArrayEntry && !stateVarObj.entireArrayAtOnce) {
      args.arrayKeys = stateVarObj.arrayKeys;
      args.arraySize = stateVarObj.arraySize;
    } else if (stateVarObj.isArray && !stateVarObj.entireArrayAtOnce) {
      args.arraySize = stateVarObj.arraySize;
    }

    return args;
  }

  // gets all dependency values that are state variables themselves
  getStateVariableRecursiveDependencyValues({ componentName, stateVariable, changedValuesOnly }) {
    // and then recurses on those state variables
    // stores result on object keyed by component name and state variable
    // (dependency considered a state variable if it has
    // downstreamComponentName(s) and mappedDownstreamVariableName(s))


    let component = this._components[componentName];

    // if they recursive dependency values are already computed, just return them
    if (component.state[stateVariable].recursiveDependencyValues) {
      return component.state[stateVariable].recursiveDependencyValues;
    }

    let { dependencyValues } = this.getStateVariableDependencyValues({ component, stateVariable });

    let recursiveDependencyValues
      = component.state[stateVariable].recursiveDependencyValues = {};

    let downDeps = this.downstreamDependencies[componentName][stateVariable];

    for (let dependencyName in downDeps) {
      let dep = downDeps[dependencyName];

      let cNames = [];
      let multipleComponentsAndVariables = false;
      if (dep.downstreamComponentName) {
        cNames = [dep.downstreamComponentName];
      } else if (dep.downstreamComponentNames) {
        cNames = dep.downstreamComponentNames;
        multipleComponentsAndVariables = true;
      }

      for (let [cInd, cName] of cNames.entries()) {
        let dependencyValuesForCName = recursiveDependencyValues[cName];
        if (dependencyValuesForCName === undefined) {
          dependencyValuesForCName = recursiveDependencyValues[cName] = {};
        }

        let changedValuesForCName = this.changedStateVariables[cName];

        let vNames = [];
        if (dep.mappedDownstreamVariableName) {
          vNames = [dep.mappedDownstreamVariableName];
        } else if (dep.mappedDownstreamVariableNamesByComponent) {
          vNames = dep.mappedDownstreamVariableNamesByComponent[cInd];
          if (dep.variablesOptional) {
            let mappedVNames = vNames;
            vNames = [];
            for (let vName of mappedVNames) {
              if (vName in this._components[cName].state ||
                this.checkIfArrayEntry({
                  stateVariable: vName,
                  component: this._components[cName]
                })
              ) {
                vNames.push(vName);
              }
            }
          }
        }



        for (let vName of vNames) {
          // don't calculate value or recurse if calculated this value before
          if (!(vName in dependencyValuesForCName)) {

            // if changedValuesOnly, then only include if these values have changed
            if (!changedValuesOnly || changedValuesForCName) {

              let value = dependencyValues[dependencyName];

              if (multipleComponentsAndVariables) {
                value = value[cInd].stateValues[vName];
              }

              if (!changedValuesOnly || changedValuesForCName.has(vName)) {
                dependencyValuesForCName[vName] = value;
              }

            }

            let additionalValues = this.getStateVariableRecursiveDependencyValues({
              componentName: cName,
              stateVariable: vName,
              changedValuesOnly
            });

            for (let cName2 in additionalValues) {
              let dependencyValuesForCName2 = recursiveDependencyValues[cName2];
              if (dependencyValuesForCName2 === undefined) {
                dependencyValuesForCName2 = recursiveDependencyValues[cName2] = {};
              }

              Object.assign(dependencyValuesForCName2, additionalValues[cName2])

            }

          }
        }

        if (Object.keys(dependencyValuesForCName).length === 0) {
          delete recursiveDependencyValues[cName];
        }

      }

    }

    // console.log(`recursiveDependencyValues for ${component.componentName}, ${stateVariable}`)
    // console.log(JSON.parse(JSON.stringify(recursiveDependencyValues)))
    return recursiveDependencyValues;

  }

  recordActualChangeInUpstreamDependencies({
    component, varName, changes
  }) {
    // console.log(`record actual change in ${varName} of ${component.componentName}`)
    // console.log(deepClone(changes))

    let componentName = component.componentName

    let upstream = this.upstreamDependencies[componentName][varName];

    if (upstream) {
      for (let upDep of upstream) {

        if (upDep.valuesChanged) {

          let upValuesChangedSub;
          if (upDep.downstreamComponentNames) {
            let ind = upDep.downstreamComponentNames.indexOf(componentName);
            upValuesChangedSub = upDep.valuesChanged[ind];
          } else {
            upValuesChangedSub = upDep.valuesChanged;
          }

          let upValuesChanged = upValuesChangedSub[varName];

          if (!upValuesChanged) {
            // check if have an alias that maps to varName
            if (component.stateVarAliases) {
              for (let alias in component.stateVarAliases) {
                if (component.stateVarAliases[alias] === varName && alias in upValuesChangedSub) {
                  upValuesChanged = upValuesChangedSub[alias]
                }
              }
            }
          }

          // if still don't have record of change, create new change object
          // (Should only be needed when have array entry variables,
          // where original change was recorded in array)
          if (!upValuesChanged) {
            if (!component.state[varName].isArrayEntry) {
              throw Error(`Something is wrong, as a variable ${varName} of ${component.componentName} actually changed, but wasn't marked with a potential change`)
            }
            upValuesChanged = upValuesChangedSub[varName] = { changed: {} }
          }

          if (component.state[varName] && component.state[varName].isArray) {
            if (upValuesChanged.changed === undefined) {
              upValuesChanged.changed = { arrayKeysChanged: {} };
            } else if (upValuesChanged.changed === true) {
              upValuesChanged.changed = { allArrayKeysChanged: true, arraySizeChanged: true, arrayKeysChanged: {} };
            }
            if (changes) {
              if (changes.allArrayKeysChanged) {
                upValuesChanged.changed.allArrayKeysChanged = true;
              }
              if (changes.arraySizeChanged) {
                upValuesChanged.changed.arraySizeChanged = true;
              }
              Object.assign(upValuesChanged.changed.arrayKeysChanged, changes.arrayKeysChanged);
            }
          } else {
            upValuesChanged.changed = true;
          }

        }
      }
    }

  }

  resolveStateVariables({ component, stateVariables, updatesNeeded, compositesBeingExpanded }) {
    // console.log(`resolve state variable ${stateVariables ? stateVariables.toString() : ""} for ${component.componentName}`);

    let componentName = component.componentName;

    let varsUnresolved = {};

    let numInternalUnresolved = Infinity;
    let prevUnresolved = [];

    let triggerParentChildLogic = false;

    if (!stateVariables) {
      stateVariables = Object.keys(component.state);
    }

    for (let varName of stateVariables) {
      if (!component.state[varName].isResolved) {
        prevUnresolved.push(varName);
      }
    }

    while (prevUnresolved.length > 0 && prevUnresolved.length < numInternalUnresolved) {

      let onlyInternalDependenciesUnresolved = [];

      for (let varName of prevUnresolved) {
        if (updatesNeeded.deletedStateVariables[componentName] &&
          updatesNeeded.deletedStateVariables[componentName].includes(varName)
        ) {
          continue;
        }

        let downDeps = this.downstreamDependencies[componentName][varName];
        let resolved = true;
        let unresolvedDependencies = [];
        let externalDependenciesResolved = true;
        for (let dependencyName in downDeps) {
          let dep = downDeps[dependencyName];

          if (dep.requireChildLogicInitiallySatisfied && !component.childLogicSatisfied) {
            resolved = false;
            unresolvedDependencies.push({
              componentName: componentName,
              stateVariable: "__childLogic"
            })
          }

          let downstreamComponentNames = dep.downstreamComponentNames;
          if (!downstreamComponentNames) {
            if (dep.downstreamComponentName) {
              downstreamComponentNames = [dep.downstreamComponentName]
            } else {
              downstreamComponentNames = [];
            }
          }
          let mappedDownstreamVariableNamesByComponent = dep.mappedDownstreamVariableNamesByComponent;
          if (!mappedDownstreamVariableNamesByComponent) {
            if (dep.mappedDownstreamVariableName) {
              mappedDownstreamVariableNamesByComponent = [[dep.mappedDownstreamVariableName]];
            }
            // don't make mappedDownstreamVariableNamesByComponent = [] if no variables
            // as below check downstreamAttribute only if mappedDownstreamVariableNamesByComponent is undefined
          }
          for (let [componentInd, downstreamComponentName] of downstreamComponentNames.entries()) {
            let depComponent = this._components[downstreamComponentName];
            if (!depComponent) {
              resolved = false;
              if (downstreamComponentName !== componentName) {
                externalDependenciesResolved = false;
              }
              unresolvedDependencies.push({
                componentName: downstreamComponentName,
                stateVariable: '__identity',
              });
            } else {

              if (mappedDownstreamVariableNamesByComponent) {
                let variableNames = mappedDownstreamVariableNamesByComponent[componentInd];

                for (let downVar of variableNames) {
                  let thisDownVarResolved = false;

                  if (!depComponent.state[downVar]) {
                    if ((dep.variablesOptional || dep.variableOptional) &&
                      !this.checkIfArrayEntry({
                        stateVariable: downVar,
                        component: depComponent
                      })
                    ) {
                      continue;
                    }


                    // see if can create the variable downVar from an array entry

                    let result = this.createFromArrayEntry({
                      stateVariable: downVar,
                      component: depComponent,
                      updatesNeeded,
                      compositesBeingExpanded
                    });

                    if (Object.keys(result.varsUnresolved).length > 0) {
                      this.addUnresolvedDependencies({
                        varsUnresolved: result.varsUnresolved,
                        component: depComponent,
                        updatesNeeded
                      });

                      // if happened to create a new unresolved dependency
                      // for the current component
                      // add it to varsUnresolved so that
                      // returned object of resolveStateVariables
                      // includes it
                      if (depComponent.componentName === componentName) {
                        Object.assign(varsUnresolved, result.varsUnresolved)
                      }
                    }

                  }

                  if (depComponent.state[downVar] && depComponent.state[downVar].isResolved) {
                    thisDownVarResolved = true;
                  }

                  if (!thisDownVarResolved) {
                    resolved = false;

                    if (downstreamComponentName !== componentName) {
                      externalDependenciesResolved = false;
                    }

                    unresolvedDependencies.push({
                      componentName: downstreamComponentName,
                      stateVariable: downVar
                    })
                  }
                }
              } else if (dep.expandReplacements) {
                if (!depComponent.isExpanded) {
                  let expandResult = this.expandCompositeComponent({
                    component: depComponent,
                    updatesNeeded,
                    compositesBeingExpanded
                  });

                  if (!expandResult.success) {
                    resolved = false;

                    unresolvedDependencies.push({
                      componentName: downstreamComponentName,
                      stateVariable: "__replacements"
                    })
                  }
                }

              } else if (dep.downstreamAttribute) {
                throw Error(`Unrecognized downstream attribute ${dep.downstreamAttribute} for state variable ${varName} of ${componentName}`)
              }

            }
          }
        }

        component.state[varName].isResolved = resolved;


        if (resolved) {
          delete varsUnresolved[varName];

          if (component.state[varName].triggerParentChildLogicWhenResolved) {
            triggerParentChildLogic = true;
          }

          if (component.state[varName].actionOnResolved) {

            let actionArgs = this.getStateVariableDependencyValues({ component, stateVariable: varName });
            actionArgs.updatesNeeded = updatesNeeded

            let result = component.state[varName].resolvedAction(actionArgs);

            if (result) {

              if (result.varsUnresolved) {
                Object.assign(varsUnresolved, result.varsUnresolved);
              }

            }


            // if varName wasn't deleted, then evaluate its value
            // so that it can be marked stale
            if (varName in component.state) {
              component.stateValues[varName];
            }

          }

        } else {
          // need to deduplicate unresolvedDependencies
          // as it is possible that a single dependency shows up multiple times
          // (for example, in an array where multiple arrayKeys
          // have the same dependency)
          let uniqueVariableIdentifiers = [...new Set(unresolvedDependencies.map(x => x.componentName + "|" + x.stateVariable))];
          varsUnresolved[varName] = uniqueVariableIdentifiers.map(function (x) {
            let y = x.split("|");
            return { componentName: y[0], stateVariable: y[1] };
          });
          if (externalDependenciesResolved) {
            onlyInternalDependenciesUnresolved.push(varName);
          }
        }
      }

      // treat those with only internal dependencies unresolved as the previously unresolved
      // as these are the only state variables that might now be resolved
      numInternalUnresolved = prevUnresolved.length;
      prevUnresolved = onlyInternalDependenciesUnresolved;

    }

    return { varsUnresolved, triggerParentChildLogic };

  }

  checkIfArrayEntry({ stateVariable, component }) {
    // check if stateVariable begins when an arrayEntry
    for (let arrayEntryPrefix in component.arrayEntryPrefixes) {
      if (stateVariable.substring(0, arrayEntryPrefix.length) === arrayEntryPrefix) {
        return true
      }
    }

    return false
  }

  substituteAliases({ stateVariables, componentClass }) {

    let newVariables = [];

    let stateVarInfo = this.componentInfoObjects.stateVariableInfo[componentClass.componentType.toLowerCase()]

    // let stateVarInfo = componentClass.returnStateVariableInfo({
    //   standardComponentClasses: this.standardComponentClasses,
    //   allPossibleProperties: this.allPossibleProperties,
    // });

    for (let stateVariable of stateVariables) {
      if (stateVariable in stateVarInfo.aliases) {
        newVariables.push(stateVarInfo.aliases[stateVariable])
      } else {
        newVariables.push(stateVariable)
      }
    }

    return newVariables;

  }

  createFromArrayEntry({ stateVariable, component, updatesNeeded,
    compositesBeingExpanded, initializeOnly = false,
  }) {

    let varsUnresolved = {};

    let foundArrayEntry = false;

    if (!component.arrayEntryPrefixes) {
      throw Error(`Unknown state variable ${stateVariable} of ${component.componentName}`);
    }

    let arrayEntryPrefixesLongestToShortest = Object.keys(component.arrayEntryPrefixes)
      .sort((a, b) => b.length - a.length)

    // check if stateVariable begins when an arrayEntry
    for (let arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
      if (stateVariable.substring(0, arrayEntryPrefix.length) === arrayEntryPrefix
      ) {
        // found a reference to an arrayEntry that hasn't been created yet
        // attempt to resolve this arrayEntry

        let arrayStateVariable = component.arrayEntryPrefixes[arrayEntryPrefix];

        this.initializeStateVariable({
          component, stateVariable,
          arrayStateVariable, arrayEntryPrefix,
          updatesNeeded
        });

        if (initializeOnly) {
          return { varsUnresolved }
        }

        let allStateVariablesAffected = [stateVariable];
        // create an additional array entry state variables
        // specified as additional state variables defined
        if (component.state[stateVariable].additionalStateVariablesDefined) {
          allStateVariablesAffected.push(...component.state[stateVariable].additionalStateVariablesDefined);
          for (let additionalVar of component.state[stateVariable].additionalStateVariablesDefined) {
            if (!component.state[additionalVar]) {
              this.createFromArrayEntry({
                stateVariable: additionalVar,
                component, updatesNeeded,
                compositesBeingExpanded,
                initializeOnly: true
              });
            }
          }
        }


        this.processStateVariableDependencies({
          component, stateVariable,
          allStateVariablesAffected
        });

        let newStateVariablesToResolve = [];

        for (let varName of allStateVariablesAffected) {
          let arrayKeysStateVariable;

          if (component.state[varName].isArrayEntry) {
            // also process state variable dependencies of the array key state varible
            arrayKeysStateVariable = component.state[varName].arrayKeysStateVariable
            this.processStateVariableDependencies({
              component, stateVariable: arrayKeysStateVariable,
              allStateVariablesAffected: [arrayKeysStateVariable]
            });
          }

          this.checkForCircularDependency({
            componentName: component.componentName,
            varName
          });

          newStateVariablesToResolve.push(varName);

          if (component.state[varName].determineDependenciesStateVariable) {
            newStateVariablesToResolve.push(component.state[varName].determineDependenciesStateVariable)
          }

          if (component.state[varName].isArrayEntry) {
            newStateVariablesToResolve.push(arrayKeysStateVariable);

            if (component.state[arrayKeysStateVariable].determineDependenciesStateVariable) {
              newStateVariablesToResolve.push(component.state[arrayKeysStateVariable].determineDependenciesStateVariable)
            }
          }
        }

        let result = this.resolveStateVariables({
          component,
          stateVariables: newStateVariablesToResolve,
          updatesNeeded,
          compositesBeingExpanded,
        });

        Object.assign(varsUnresolved, result.varsUnresolved);

        foundArrayEntry = true;

        break;
      }
    }

    if (!foundArrayEntry) {
      throw Error(`Unknown state variable ${stateVariable} of ${component.componentName}`);
    }

    return { varsUnresolved };
  }

  resolveAllDependencies(updatesNeeded, compositesBeingExpanded) {
    // attempt to resolve all dependencies of all components
    // Does not return anything, but if updatesNeeded.unresolvedDependencies
    // is not empty when the function finishes,
    // it did not succeed in resolving all dependencies

    // The key data structures are
    // - updatesNeeded.unresolvedDependencies and
    // - updatesNeeded.unresolvedByDependent
    // Both are keyed by componentName and stateVariable
    // with values that are arrays of {componentName, stateVariable}

    // updatesNeeded.unresolvedDependencies is keyed by the unresolved name/variable
    // and contains an array of dependent name/variables that were
    // preventing the variable from being resolved

    // updatesNeeded.unresolvedByDependent is keyed by the dependendent name/variable
    // and contains an array of name/variables that it was preventing
    // from being resolved

    // Note: varName in unresolvedByDependent could also be
    // "__identity", "__childLogic", "__replacements"


    console.log('resolving all dependencies');

    // keep track of unresolved references to component names
    // so that can give an appropriate error message
    // in the case that the component name is never resolved
    let unResolvedRefToComponentNames = [];

    // keep looping until
    // - we have resolved all dependencies, or
    // - we are no longer resolving additional dependencies
    let resolvedAnotherDependency = true;
    while (resolvedAnotherDependency && Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      // console.log(JSON.parse(JSON.stringify(updatesNeeded)));
      // console.log(JSON.parse(JSON.stringify(this.downstreamDependencies)))
      // console.log(JSON.parse(JSON.stringify(this.upstreamDependencies)))
      resolvedAnotherDependency = false;

      // find component/state variable that
      // - had been preventing others from being resolved
      //   (i.e., is in updatesNeeded.unresolvedByDependent), and
      // - is now resolved (i.e., isn't in updatesNeeded.unresolvedDependencies)
      for (let componentName in updatesNeeded.unresolvedByDependent) {
        let componentDeleted = updatesNeeded.deletedComponents[componentName];
        if (!(componentName in this.components) && !componentDeleted) {
          // componentName doesn't exist yet (and it wasn't deleted)
          // It may be created later as a replacement of a composite
          unResolvedRefToComponentNames.push(componentName);
          continue;
        }
        for (let varName in updatesNeeded.unresolvedByDependent[componentName]) {
          // check if componentName/varName is a resolved state variable

          // in case component was deleted in earlier loop, check again
          componentDeleted = updatesNeeded.deletedComponents[componentName];

          // if components hasn't been expanded, then its replacements aren't resolved
          if (varName === "__replacements" && !componentDeleted && !this.components[componentName].isExpanded) {
            continue;
          }

          // __childLogic isn't resolved until child logic is satisfied
          if (varName === "__childLogic" && !componentDeleted && !this.components[componentName].childLogicSatisfied) {
            continue;
          }

          let stateVariableDeleted = updatesNeeded.deletedStateVariables[componentName] &&
            updatesNeeded.deletedStateVariables[componentName].includes(varName);

          if (varName !== "__identity" && varName !== "__replacements"
            && varName !== "__childLogic" && !componentDeleted
            && !(varName in this.components[componentName].state) && !stateVariableDeleted
          ) {
            throw Error(`Reference to invalid state variable ${varName} of ${componentName}`);
          }

          if (!(componentName in updatesNeeded.unresolvedDependencies) ||
            componentDeleted || stateVariableDeleted ||
            !(varName in updatesNeeded.unresolvedDependencies[componentName])
          ) {
            // found a componentName/state variable that
            // - is now resolved or
            // - represent a component that now exists (for __identity) or
            // - is now deleted (so can't prevent others from being resolved)

            // Now, go through the array of state variables that were being blocked
            // by componentName/varName to see if we can resolved them
            for (let dep of updatesNeeded.unresolvedByDependent[componentName][varName]) {

              let depComponent = this._components[dep.componentName];

              if (updatesNeeded.unresolvedDependencies[dep.componentName] === undefined ||
                updatesNeeded.unresolvedDependencies[dep.componentName][dep.stateVariable] === undefined) {
                // if already resolved (by another dependency), skip
                continue;
              }
              if (updatesNeeded.deletedStateVariables[dep.componentName] &&
                updatesNeeded.deletedStateVariables[dep.componentName].includes(dep.stateVariable)) {
                // if depComponent's variable was already deleted
                // (from when we processed another dependency)
                // remove it from unresolvedDepenencies and skip
                delete updatesNeeded.unresolvedDependencies[dep.componentName][dep.stateVariable];
                if (Object.keys(updatesNeeded.unresolvedDependencies[dep.componentName]).length === 0) {
                  delete updatesNeeded.unresolvedDependencies[dep.componentName];
                }

                continue;
              }

              // see if we can resolve depComponent's state variable
              let resolveResult = this.resolveStateVariables({
                component: depComponent,
                stateVariables: [dep.stateVariable],
                updatesNeeded,
                compositesBeingExpanded,
              });

              // check to see if we can update replacements of any composites
              if (updatesNeeded.compositesToUpdateReplacements.length > 0) {
                this.replacementChangesFromCompositesToUpdate({
                  updatesNeeded,
                  compositesBeingExpanded,
                });
              }

              // check if have any additional unresolved state variables
              // other than dep.stateVariable, which we just set off to resolve
              if (Object.keys(resolveResult.varsUnresolved).length > 0) {
                let otherUnresolved = Object.assign({}, resolveResult.varsUnresolved);
                delete otherUnresolved[dep.stateVariable];

                if (Object.keys(otherUnresolved).length > 0) {
                  this.addUnresolvedDependencies({
                    varsUnresolved: otherUnresolved,
                    component: depComponent,
                    updatesNeeded
                  });

                  for (let newVarName in otherUnresolved) {
                    // delete from resolve result, so it will end up with just
                    // dep.stateVariable, if dep.stateVariable isn't resolved
                    delete resolveResult.varsUnresolved[newVarName];
                  }
                }

              }



              if (Object.keys(resolveResult.varsUnresolved).length === 0) {
                // we have resolved the state variable dep.stateVariable

                resolvedAnotherDependency = true;

                // delete state from unresolvedDependencies
                delete updatesNeeded.unresolvedDependencies[dep.componentName][dep.stateVariable];
                if (Object.keys(updatesNeeded.unresolvedDependencies[dep.componentName]).length === 0) {
                  delete updatesNeeded.unresolvedDependencies[dep.componentName];
                }

                // TODO: do we have to worry about circular dependence here?


                // The state variable readyToExpand is a special state variable
                // for composite components.
                // Once this variable is newly resolved,
                // we might be able to expand the composite component into its replacements

                let processParentChildLogic = dep.stateVariable === "readyToExpand" &&
                  depComponent instanceof this._allComponentClasses['_composite'];

                if (resolveResult.triggerParentChildLogic) {
                  // could also trigger parent child logic if all additional state variables defined
                  // are resolved

                  let allAdditionalResolved = true;

                  let depStateVarObj = depComponent.state[dep.stateVariable];
                  if (depStateVarObj.additionalStateVariablesDefined) {
                    for (let vName of depStateVarObj.additionalStateVariablesDefined) {
                      if (!depComponent.state[vName].isResolved) {
                        allAdditionalResolved = false;
                        break;
                      }
                    }
                  }

                  if (allAdditionalResolved) {
                    processParentChildLogic = true;
                  }
                }

                if (processParentChildLogic) {

                  this.processNewDefiningChildren({
                    parent: this._components[depComponent.parentName],
                    updatesNeeded,
                    compositesBeingExpanded,
                  });

                  let sugarResult = this.applySugarOrAddSugarCreationStateVariables({
                    component: this._components[depComponent.parentName],
                    updatesNeeded,
                    compositesBeingExpanded
                  });

                  if (sugarResult.varsUnresolved) {
                    this.addUnresolvedDependencies({
                      varsUnresolved: sugarResult.varsUnresolved,
                      component: this._components[depComponent.parentName],
                      updatesNeeded
                    });
                  }

                  // check to see if we can update replacements of any composites
                  if (updatesNeeded.compositesToUpdateReplacements.length > 0) {
                    this.replacementChangesFromCompositesToUpdate({
                      updatesNeeded,
                      compositesBeingExpanded
                    });
                  }

                }
              } else {
                // dep.stateVariable still not resolved.  Delete old unresolved dependencies
                // and add back new ones
                this.recalculateUnresolvedForDep({
                  dep, componentName, varName, updatesNeeded,
                  varsUnresolved: resolveResult.varsUnresolved
                });

              }

              delete resolveResult.varsUnresolved[dep.stateVariable];

            }

            // We finished processing the array of state variables that we being blocked
            // by componentName/varName

            // Assuming that componentName/varName still qualifies as resolved,
            // delete the records that componentName/varName is blocking any variables
            if (!(componentName in updatesNeeded.unresolvedDependencies) ||
              componentDeleted || stateVariableDeleted ||
              !(varName in updatesNeeded.unresolvedDependencies[componentName])
            ) {
              delete updatesNeeded.unresolvedByDependent[componentName][varName];
              if (Object.keys(updatesNeeded.unresolvedByDependent[componentName]).length === 0) {
                delete updatesNeeded.unresolvedByDependent[componentName];
              }
            }

          }
        }
      }

      // check if any composites unexpanded composites can now be expanded
      for (let compositeName of updatesNeeded.compositesToExpand) {

        let composite = this._components[compositeName];
        if (!composite) {
          continue;
        }

        let nUnexpanded = updatesNeeded.compositesToExpand.size

        this.processNewDefiningChildren({
          parent: this._components[composite.parentName],
          updatesNeeded,
          compositesBeingExpanded,
        });

        this.applySugarOrAddSugarCreationStateVariables({
          component: this._components[composite.parentName],
          updatesNeeded,
          compositesBeingExpanded,
        });

        if (updatesNeeded.compositesToExpand.size < nUnexpanded) {
          resolvedAnotherDependency = true;
          // check to see if we can update replacements of any composites
          if (updatesNeeded.compositesToUpdateReplacements.length > 0) {
            this.replacementChangesFromCompositesToUpdate({
              updatesNeeded,
              compositesBeingExpanded,
            });
          }
        }
      }



      // We finished
      // - looping through all componentName/varNames of updatesNeeded.unresolvedByDependent
      // - finding those varNames that were resolved, and
      // - attempting to resolve those variables that depend on it

      // We'll repeat this process as long as we're making progress
      // and there are still unresolved variables left




    }

    // All attempts to resolve variables have finished
    // Either we resolved all variables or we stopped making progress

    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      // still didn't resolve all state variables
      this.createUnresolvedMessage(unResolvedRefToComponentNames, updatesNeeded);
    }

  }


  createUnresolvedMessage(unResolvedRefToComponentNames, updatesNeeded) {
    // create message about the unresolved variable,
    // separating out those due to unsatisfied childlogic

    let childLogicMessage = "";
    let unresolvedVarMessage = "";
    let unresolvedReferenceMessage = "";
    if (unResolvedRefToComponentNames.length > 0) {
      unResolvedRefToComponentNames = new Set(unResolvedRefToComponentNames);
      for (let componentName of unResolvedRefToComponentNames) {
        if (!(componentName in this.components)) {
          unresolvedReferenceMessage += `Reference to invalid component name ${componentName}. `;
        }
      }
    }
    if (unresolvedReferenceMessage) {
      updatesNeeded.unresolvedMessage = unresolvedReferenceMessage;
    }
    else {
      for (let componentName in updatesNeeded.unresolvedDependencies) {
        let component = this.components[componentName];
        if (!component.childLogicSatisfied) {
          childLogicMessage += `Invalid children for ${componentName}: ${component.childLogic.logicResult.message} `;
        }
        else {
          for (let varName in updatesNeeded.unresolvedDependencies[componentName]) {
            unresolvedVarMessage += `Could not resolve state variable ${varName} of ${componentName}. `;
          }
        }
      }
      if (childLogicMessage) {
        updatesNeeded.unresolvedMessage = childLogicMessage;
      }
      else {
        updatesNeeded.unresolvedMessage = unresolvedVarMessage;
      }
    }
  }

  recalculateUnresolvedForDep({ dep, componentName, varName, varsUnresolved, updatesNeeded }) {

    // Note: we have two componentName/stateVariables in play now
    // 1. componentName/varName: the variable that is resolved
    // 2. dep.componentName/dep.stateVariable: the variable that depends on
    //    componentName/varName but still was not able to be resolved

    // We have completely recalculated those stateVariables that are
    // preventing dep.stateVariable from being resolved
    // (they are in varsUnresolved[dep.stateVariable])
    // This will be the new unresolvedDependencies for dep.stateVariable
    // but we also need to adjust unresolvedByDependent to keep it consisteent

    // Loop through a third componentName/stateVariable,
    // i.e., other stateVariables that used to be the ones that prevented
    // dep.stateVariable from being resolved

    for (let currentDep of updatesNeeded.unresolvedDependencies[dep.componentName][dep.stateVariable]) {
      let cName2 = currentDep.componentName;
      let varName2 = currentDep.stateVariable;
      if (cName2 !== componentName || varName2 !== varName) {
        // delete any other dependencies that current depended on
        // (will re-add at end if still have this dependency)
        let indexOfDep;
        for (let [ind, oDep] of updatesNeeded.unresolvedByDependent[cName2][varName2].entries()) {
          if (oDep.componentName === dep.componentName && oDep.stateVariable === dep.stateVariable) {
            indexOfDep = ind;
            break;
          }
        }
        if (indexOfDep === undefined) {
          throw Error(`Something went wrong with unresolved dependencies....`);
        }
        updatesNeeded.unresolvedByDependent[cName2][varName2].splice(indexOfDep, 1);
      }
    }
    updatesNeeded.unresolvedDependencies[dep.componentName][dep.stateVariable] = varsUnresolved[dep.stateVariable];
    // add any new (or possibly deleted above) unresolved dependencies
    // that we calculate from the new varsUnresolved
    for (let unresDep of varsUnresolved[dep.stateVariable]) {
      let cName2 = unresDep.componentName;
      let varName2 = unresDep.stateVariable;
      if (cName2 === componentName && varName2 === varName) {
        throw Error(`State variable ${varName2} of ${cName2} reported as unresolved after already being resolved.`);
      }
      if (updatesNeeded.unresolvedByDependent[cName2] === undefined) {
        updatesNeeded.unresolvedByDependent[cName2] = {};
      }
      if (updatesNeeded.unresolvedByDependent[cName2][varName2] === undefined) {
        updatesNeeded.unresolvedByDependent[cName2][varName2] = [];
      }
      updatesNeeded.unresolvedByDependent[cName2][varName2].push({
        componentName: dep.componentName,
        stateVariable: dep.stateVariable
      });
    }
  }


  updateChildAndDescendantDependencies(component, updatesNeeded, compositesBeingExpanded) {

    // console.log(`update child and descendant deps for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(this.downstreamDependencies[component.componentName])))

    if (!component.childLogicSatisfied) {
      return;
    }

    let componentName = component.componentName;

    if (componentName in this.downstreamDependencies) {
      // only need to change child dependencies if the component already has dependencies

      this.updateChildDependencies(component, updatesNeeded, compositesBeingExpanded);

    }

    if (component.ancestors) {

      this.updateParentDependencies(component, updatesNeeded, compositesBeingExpanded);

      this.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

      this.updateAncestorDependencies(component, updatesNeeded, compositesBeingExpanded);

    }

  }

  updateChildDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    // console.log(`update child dependencies for ${parent.componentName}`)

    let componentName = parent.componentName;

    let childDependencies = this.componentIdentityDependencies.childDependenciesByParent[componentName];
    if (childDependencies) {

      // console.log("childDependencies")
      // console.log(JSON.parse(JSON.stringify(childDependencies)))
      // console.log(JSON.parse(JSON.stringify(this.downstreamDependencies[componentName])))

      let childDepsToDelete = [];

      for (let depDescription of childDependencies) {
        let dependencyName = depDescription.dependencyName;

        let currentDep;
        if (this.downstreamDependencies[componentName][depDescription.stateVariables[0]]) {
          currentDep = this.downstreamDependencies[componentName][depDescription.stateVariables[0]][dependencyName];
        }

        if (!currentDep) {
          childDepsToDelete.push(depDescription);
          continue;
        }


        let activeChildrenIndices = parent.childLogic.returnMatches(currentDep.childLogicName);
        if (activeChildrenIndices === undefined) {
          throw Error(`Invalid state variable ${depDescription.stateVariables[0]} of ${parent.componentName}: childLogicName ${currentDep.childLogicName} does not exist.`);
        }
        // if childIndices specified, filter out just those indices
        // Note: indices are relative to the selected ones
        // (not actual index in activeChildren)
        // so filter uses the i (index) argument, not the x (value) argument
        if (currentDep.childIndices !== undefined) {
          activeChildrenIndices = activeChildrenIndices
            .filter((x, i) => currentDep.childIndices.includes(i));
        }
        let newChildren = activeChildrenIndices.map(x => parent.activeChildren[x].componentName);

        let childrenChanged = false;
        if (newChildren.length !== currentDep.downstreamComponentNames.length) {
          childrenChanged = true;
        } else {
          for (let [ind, childName] of newChildren.entries()) {
            if (childName !== currentDep.downstreamComponentNames[ind]) {
              childrenChanged = true;
              break;
            }
          }
        }

        if (childrenChanged) {
          currentDep.componentIdentitiesChanged = true;
          let children = [];
          let valuesChanged = [];
          for (let childIndex of activeChildrenIndices) {
            let childName = parent.activeChildren[childIndex].componentName;
            children.push(childName);

            let valsChanged = {}
            if (currentDep.dependencyType === "childStateVariables") {
              for (let vName of currentDep.originalDownstreamVariableNames) {
                valsChanged[vName] = { changed: true }
              }
            }
            valuesChanged.push(valsChanged);
          }

          // change upstream dependencies
          for (let [childInd, currentChild] of currentDep.downstreamComponentNames.entries()) {
            if (!children.includes(currentChild)) {
              // lost a child that matched this childLogic component.  remove dependency
              updatesNeeded.componentsTouched.push(currentChild);

              let childUpDep = this.upstreamDependencies[currentChild];
              let depNamesToCheck = ['__identity'];
              if (currentDep.mappedDownstreamVariableNamesByComponent) {
                depNamesToCheck.push(...currentDep.mappedDownstreamVariableNamesByComponent[childInd]);
              }
              for (let vName of depNamesToCheck) {

                let upDeps = childUpDep[vName];
                if (upDeps) {
                  for (let [ind, u] of upDeps.entries()) {
                    if (u === currentDep) {
                      upDeps.splice(ind, 1);
                      break;
                    }
                  }
                }
              }

              if (currentDep.mappedDownstreamVariableNamesByComponent) {
                this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);
              }

            }
          }

          let newMappedDownstreamVariableNamesByComponent = [];

          for (let newChildName of children) {
            let originalIndex = currentDep.downstreamComponentNames.indexOf(newChildName)
            if (originalIndex !== -1) {

              if (currentDep.originalDownstreamVariableNames) {
                newMappedDownstreamVariableNamesByComponent.push(currentDep.mappedDownstreamVariableNamesByComponent[originalIndex]);
              }

            } else {
              // gained a child that matched this childLogic component.  add dependency

              updatesNeeded.componentsTouched.push(newChildName);
              let childUpDep = this.upstreamDependencies[newChildName];
              if (childUpDep === undefined) {
                childUpDep = this.upstreamDependencies[newChildName] = {};
              }
              if (currentDep.originalDownstreamVariableNames) {

                let mappedVarNames = this.substituteAliases({
                  stateVariables: currentDep.originalDownstreamVariableNames,
                  componentClass: this._components[newChildName].constructor
                });
                newMappedDownstreamVariableNamesByComponent.push(mappedVarNames)

                let childVarNames = mappedVarNames;
                if (currentDep.variablesOptional) {
                  childVarNames = [];
                  for (let varName of mappedVarNames) {
                    if (varName in this._components[newChildName].state ||
                      this.checkIfArrayEntry({
                        stateVariable: varName,
                        component: this._components[newChildName]
                      })
                    ) {
                      childVarNames.push(varName)
                    }
                  }
                  if (childVarNames.length === 0) {
                    childVarNames = ['__identity'];
                  }
                }
                for (let vName of childVarNames) {
                  if (!this._components[newChildName].state[vName] && vName !== "__identity") {
                    let result = this.createFromArrayEntry({
                      component: this._components[newChildName],
                      stateVariable: vName,
                      updatesNeeded,
                      compositesBeingExpanded
                    });
                    if (Object.keys(result.varsUnresolved).length > 0) {
                      this.addUnresolvedDependencies({
                        varsUnresolved: result.varsUnresolved,
                        component: this._components[newChildName],
                        updatesNeeded
                      });

                    }
                  }

                  if (childUpDep[vName] === undefined) {
                    childUpDep[vName] = [];
                  }
                  childUpDep[vName].push(currentDep);

                  if (vName !== "__identity" && !this._components[newChildName].state[vName].isResolved) {
                    // just added a dependency to parent/stateVariables that is not resolved
                    // add unresolved dependencies

                    let varsUnresolved = {};
                    for (let varName of depDescription.stateVariables) {
                      varsUnresolved[varName] = [{
                        componentName: newChildName,
                        stateVariable: vName
                      }]
                    }
                    this.addUnresolvedDependencies({
                      varsUnresolved,
                      component: parent,
                      updatesNeeded
                    });

                    // if parent/stateVariables was previously resolved
                    // mark it as unresolved and recursively add 
                    //unresolved dependencies upstream
                    for (let varName of depDescription.stateVariables) {
                      if (parent.state[varName].isResolved) {
                        this.markStateVariableAndUpstreamDependentsStale({
                          component: parent,
                          varName,
                          updatesNeeded,
                          forceRecalculation: true
                        });

                        parent.state[varName].isResolved = false;
                        this.resetUpstreamDependentsUnresolved({
                          component: parent,
                          varName,
                          updatesNeeded
                        })
                      }
                    }

                  }

                }

                this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);

              }
              else if (currentDep.dependencyType === "childIdentity") {
                if (childUpDep['__identity'] === undefined) {
                  childUpDep['__identity'] = [];
                }
                childUpDep['__identity'].push(currentDep);
              }
            }
          }

          currentDep.downstreamComponentNames = children;
          if (currentDep.originalDownstreamVariableNames) {
            currentDep.mappedDownstreamVariableNamesByComponent = newMappedDownstreamVariableNamesByComponent;
            currentDep.valuesChanged = valuesChanged;
          }
        }

        for (let varName of depDescription.stateVariables) {
          this.checkForCircularDependency({ componentName: parent.componentName, varName });
        }

        // note: markStateVariableAndUpstreamDependentsStale includes
        // any additionalStateVariablesDefined with stateVariable
        this.markStateVariableAndUpstreamDependentsStale({
          component: parent,
          varName: depDescription.stateVariables[0],
          updatesNeeded
        });

      }

      for (let depDescription of childDepsToDelete) {
        // if this dependency were deleted, simply delete from childDependenciesByParent
        if (childDependencies.length === 1) {
          delete this.componentIdentityDependencies.childDependenciesByParent[componentName];
        } else {
          childDependencies.splice(childDependencies.indexOf(depDescription), 1)
        }
        continue;
      }


    }

  }

  updateDescendantDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    // console.log(`update descendant dependencies for ${parent.componentName}`)

    let parentAndAncestors = [
      {
        componentName: parent.componentName,
        componentClass: parent.constructor
      },
      ...parent.ancestors
    ];

    for (let ancestorObj of parentAndAncestors) {
      let descendantDependencies = this.componentIdentityDependencies.descendantDependenciesByAncestor[ancestorObj.componentName];

      if (descendantDependencies) {
        let descendantDepsToDelete = [];

        for (let depDescription of descendantDependencies) {
          let upstreamComponentName = depDescription.componentName;
          let dependencyName = depDescription.dependencyName;

          let depsOfStateVar = this.downstreamDependencies[upstreamComponentName][depDescription.stateVariables[0]];
          if (!depsOfStateVar) {
            descendantDepsToDelete.push(depDescription);
            continue;
          }
          let currentDep = depsOfStateVar[dependencyName];


          if (!currentDep) {
            descendantDepsToDelete.push(depDescription);
            continue;
          }

          let descendants = gatherDescendants({
            ancestor: this.components[currentDep.ancestorName],
            descendantClasses: currentDep.componentTypes.map(x => this.allComponentClasses[x]),
            recurseToMatchedChildren: currentDep.recurseToMatchedChildren,
            useReplacementsForComposites: currentDep.useReplacementsForComposites,
            includeNonActiveChildren: currentDep.includeNonActiveChildren,
            includePropertyChildren: currentDep.includePropertyChildren,
            ignoreReplacementsOfMatchedComposites: currentDep.ignoreReplacementsOfMatchedComposites,
            definingChildrenFirst: currentDep.definingChildrenFirst,
            compositeClass: this.allComponentClasses._composite,
          });

          let descendantsChanged = false;
          if (descendants.length !== currentDep.downstreamComponentNames.length) {
            descendantsChanged = true;
          }
          else {
            for (let [ind, descendantName] of descendants.entries()) {
              if (descendantName !== currentDep.downstreamComponentNames[ind]) {
                descendantsChanged = true;
                break;
              }
            }
          }

          if (descendantsChanged) {
            currentDep.componentIdentitiesChanged = true;
            let valuesChanged = [];
            if (currentDep.originalDownstreamVariableNames) {
              let valsChanged = {}
              for (let vName of currentDep.originalDownstreamVariableNames) {
                valsChanged[vName] = { changed: true }
              }
              valuesChanged = descendants.map(() => valsChanged);
            }

            // change upstream dependencies
            for (let [descendantInd, currentDescendant] of currentDep.downstreamComponentNames.entries()) {
              if (!descendants.includes(currentDescendant)) {
                // lost a descendant.  remove dependency
                updatesNeeded.componentsTouched.push(currentDescendant);
                let descendantUpDep = this.upstreamDependencies[currentDescendant];
                let depNamesToCheck = [];
                if (currentDep.mappedDownstreamVariableNamesByComponent) {
                  depNamesToCheck.push(...currentDep.mappedDownstreamVariableNamesByComponent[descendantInd]);
                }
                else {
                  depNamesToCheck = ['__identity'];
                }
                for (let vName of depNamesToCheck) {
                  let upDeps = descendantUpDep[vName];
                  if (upDeps) {
                    for (let [ind, u] of upDeps.entries()) {
                      if (u === currentDep) {
                        upDeps.splice(ind, 1);
                        break;
                      }
                    }
                  }
                }

                if (currentDep.mappedDownstreamVariableNamesByComponent) {
                  this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);
                }

              }
            }

            let newMappedDownstreamVariableNamesByComponent = [];


            for (let newDescendantName of descendants) {
              let originalIndex = currentDep.downstreamComponentNames.indexOf(newDescendantName)
              if (originalIndex !== -1) {

                if (currentDep.originalDownstreamVariableNames) {
                  newMappedDownstreamVariableNamesByComponent.push(currentDep.mappedDownstreamVariableNamesByComponent[originalIndex]);
                }

              } else {
                // gained a descendant.  add dependency
                updatesNeeded.componentsTouched.push(newDescendantName);
                let descendantUpDep = this.upstreamDependencies[newDescendantName];
                if (descendantUpDep === undefined) {
                  descendantUpDep = this.upstreamDependencies[newDescendantName] = {};
                }
                if (currentDep.originalDownstreamVariableNames) {

                  let mappedVarNames = this.substituteAliases({
                    stateVariables: currentDep.originalDownstreamVariableNames,
                    componentClass: this._components[newDescendantName].constructor
                  });
                  newMappedDownstreamVariableNamesByComponent.push(mappedVarNames)

                  let descendantVarNames = mappedVarNames;
                  if (currentDep.variablesOptional) {
                    descendantVarNames = [];
                    for (let varName of mappedVarNames) {
                      if (varName in this._components[newDescendantName].state ||
                        this.checkIfArrayEntry({
                          stateVariable: varName,
                          component: this._components[newDescendantName]
                        })
                      ) {
                        descendantVarNames.push(varName)
                      }
                    }
                    if (descendantVarNames.length === 0) {
                      descendantVarNames = ['__identity'];
                    }
                  }
                  for (let vName of descendantVarNames) {
                    if (!this._components[newDescendantName].state[vName] && vName !== "__identity") {
                      let result = this.createFromArrayEntry({
                        component: this._components[newDescendantName],
                        stateVariable: vName,
                        updatesNeeded,
                        compositesBeingExpanded,
                      });
                      if (Object.keys(result.varsUnresolved).length > 0) {
                        this.addUnresolvedDependencies({
                          varsUnresolved: result.varsUnresolved,
                          component: this._components[newDescendantName],
                          updatesNeeded
                        });
                      }
                    }
                    if (descendantUpDep[vName] === undefined) {
                      descendantUpDep[vName] = [];
                    }
                    descendantUpDep[vName].push(currentDep);

                    if (vName !== "__identity" && !this._components[newDescendantName].state[vName].isResolved) {
                      // just added a dependency to parent/stateVariables that is not resolved
                      // add unresolved dependencies

                      let upstreamComponent = this._components[upstreamComponentName]


                      let varsUnresolved = {};
                      for (let varName of depDescription.stateVariables) {
                        varsUnresolved[varName] = [{
                          componentName: newDescendantName,
                          stateVariable: vName
                        }]
                      }
                      this.addUnresolvedDependencies({
                        varsUnresolved,
                        component: upstreamComponent,
                        updatesNeeded
                      });

                      // if upstreamComponent/stateVariables was previously resolved
                      // mark it as unresolved and recursively add 
                      //unresolved dependencies upstream
                      for (let varName of depDescription.stateVariables) {
                        if (upstreamComponent.state[varName].isResolved) {
                          this.markStateVariableAndUpstreamDependentsStale({
                            component: upstreamComponent,
                            varName,
                            updatesNeeded,
                            forceRecalculation: true
                          });

                          upstreamComponent.state[varName].isResolved = false;
                          this.resetUpstreamDependentsUnresolved({
                            component: upstreamComponent,
                            varName,
                            updatesNeeded
                          })
                        }
                      }

                    }

                  }

                  this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);

                }
                else if (currentDep.dependencyType === "descendantIdentity") {
                  if (descendantUpDep['__identity'] === undefined) {
                    descendantUpDep['__identity'] = [];
                  }
                  descendantUpDep['__identity'].push(currentDep);
                }
              }
            }

            currentDep.downstreamComponentNames = descendants;
            if (currentDep.originalDownstreamVariableNames) {
              currentDep.mappedDownstreamVariableNamesByComponent = newMappedDownstreamVariableNamesByComponent;
              currentDep.valuesChanged = valuesChanged;
            }

            for (let varName of depDescription.stateVariables) {
              this.checkForCircularDependency({ componentName: upstreamComponentName, varName });
            }

            // note: markStateVariableAndUpstreamDependentsStale includes
            // any additionalStateVariablesDefined with stateVariable
            this.markStateVariableAndUpstreamDependentsStale({
              component: this._components[upstreamComponentName],
              varName: depDescription.stateVariables[0],
              updatesNeeded
            });
          }
        }

        for (let depDescription of descendantDepsToDelete) {
          // if this dependency were deleted, simply delete from descendantDependenciesByAncestor
          if (descendantDependencies.length === 1) {
            delete this.componentIdentityDependencies.descendantDependenciesByAncestor[ancestorObj.componentName];
          } else {
            descendantDependencies.splice(descendantDependencies.indexOf(depDescription), 1)
          }
          continue;
        }
      }
    }

  }

  updateParentDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    // TODO: test this code

    // TODO: need to add logic for adding an unresolved dependency to a resolved variable

    let parentName = parent.componentName;

    let parentDependencies = this.componentIdentityDependencies.parentDependenciesByParent[parentName];
    if (parentDependencies) {

      let parentDependenciesToDelete = [];

      for (let [ind, depDescription] of parentDependencies.entries()) {
        let cName = depDescription.componentName;

        let child = this._components[cName];

        if (child.parentName === parentName) {
          continue;
        }

        // found a child with a parent dependency that now has a different parent

        // mark to delete from parentDependencies
        parentDependenciesToDelete.push(ind);

        let dependencyName = depDescription.dependencyName;

        // add to new parent's parentDependencies
        let newParentDependencies = this.componentIdentityDependencies.parentDependenciesByParent[child.parentName];
        if (!newParentDependencies) {
          newParentDependencies = this.componentIdentityDependencies.parentDependenciesByParent[child.parentName] = [];
        }
        newParentDependencies.push(depDescription)

        let childDownDeps = this.downstreamDependencies[cName];

        // if child not in downstream dependencies, there's nothing to do
        if (childDownDeps === undefined) {
          continue;
        }

        let currentDep = childDownDeps[depDescription.stateVariables[0]][dependencyName];

        if (!currentDep) {
          // if this dependency were deleted, simply delete from parentDependenciesByParent
          if (newParentDependencies.length === 1) {
            delete this.componentIdentityDependencies.parentDependenciesByParent[child.parentName];
          } else {
            newParentDependencies.splice(newParentDependencies.indexOf(depDescription), 1)
          }
          continue;
        }

        // delete updep from previous parent
        let parentUpDep = this.upstreamDependencies[parentName][currentDep.mappedDownstreamVariableName];
        if (parentUpDep) {
          for (let [ind, u] of parentUpDep.entries()) {
            if (u === currentDep) {
              parentUpDep.splice(ind, 1);
              break;
            }
          }
        }

        currentDep.downstreamComponentName = child.parentName;

        currentDep.valuesChanged = { [currentDep.originalDownstreamVariableName]: { changed: true } };

        // add updep to new parent

        currentDep.mappedDownstreamVariableName = this.substituteAliases({
          stateVariables: [currentDep.originalDownstreamVariableName],
          componentClass: child.ancestors[0].componentClass
        })[0];


        let depUp = this.upstreamDependencies[child.parentName];
        if (!depUp) {
          depUp = this.upstreamDependencies[child.parentName] = {};
        }
        if (depUp[currentDep.mappedDownstreamVariableName] === undefined) {
          depUp[currentDep.mappedDownstreamVariableName] = [];
        }

        let foundCurrentDep = false;
        for (let u of depUp[currentDep.mappedDownstreamVariableName]) {
          if (u === currentDep) {
            foundCurrentDep = true;
            break;
          }
        }
        if (!foundCurrentDep) {
          depUp[currentDep.mappedDownstreamVariableName].push(currentDep);
        }

        this.resetCircularCheckPassed(cName, currentDep.upstreamVariableNames[0]);

        for (let varName of depDescription.stateVariables) {
          this.checkForCircularDependency({ componentName: cName, varName });
        }

        // note: markStateVariableAndUpstreamDependentsStale includes
        // any additionalStateVariablesDefined with stateVariable
        this.markStateVariableAndUpstreamDependentsStale({
          component: child,
          varName: depDescription.stateVariables[0],
          updatesNeeded
        });
      }

      // delete all moved dependencies from original parent's parentDependencies
      for (let ind of parentDependenciesToDelete.reverse()) {
        parentDependencies.splice(ind, 1)
      }

    }

  }

  updateAncestorDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    // TODO: test this code

    let ancestorDependencies = this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[parent.componentName];
    if (ancestorDependencies) {
      let ancestorDependenciesToDelete = [];

      for (let depDescription of ancestorDependencies) {
        let cName = depDescription.componentName;

        if (!(cName in this._components)) {
          // if cName were deleted, it wouldn't get communicated to
          // ancestorDependenciesByPotentialAncestor
          // as it isn't keyed on descendant name
          // Simply delete from ancestorDependenciesByPotentialAncestor

          ancestorDependenciesToDelete.push(depDescription);
          continue;
        }

        let dependencyName = depDescription.dependencyName;

        let currentDep = this.downstreamDependencies[cName][depDescription.stateVariables[0]][dependencyName];

        if (!currentDep) {
          // if this dependency were deleted, simply delete from ancestorDependenciesByPotentialAncestor
          ancestorDependenciesToDelete.push(depDescription);

          continue;
        }

        let ancestorResults = this.findMatchingAncestor({
          dependencyObj: currentDep,
          component: this._components[cName],
          stateVariable: depDescription.stateVariables[0],
          dependencyName
        });


        let potentialAncestorChanged = false;
        if (ancestorResults.ancestorsExamined.length !== depDescription.ancestorsExamined.length) {
          potentialAncestorChanged = true;
        }
        else {
          for (let [ind, ancestorName] of ancestorResults.ancestorsExamined.entries()) {
            if (ancestorName !== depDescription.ancestorsExamined[ind]) {
              potentialAncestorChanged = true;
              break;
            }
          }
        }

        if (potentialAncestorChanged) {
          // change ancestorDependenciesByPotentialAncestor

          // delete depDescription for any former potential ancestors
          for (let potentialAncestorName of depDescription.ancestorsExamined) {
            if (!ancestorResults.ancestorsExamined.includes(potentialAncestorName)) {
              let formerAncestorDeps = this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[potentialAncestorName];
              if (formerAncestorDeps.length === 1) {
                delete this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[potentialAncestorName];
              } else {
                formerAncestorDeps.splice(formerAncestorDeps.indexOf(depDescription), 1)
              }
            }
          }

          // add depDescription to any new potential ancestors
          for (let potentialAncestorName of ancestorResults.ancestorsExamined) {
            if (!depDescription.ancestorsExamined.includes(potentialAncestorName)) {
              let formerAncestorDeps = this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[potentialAncestorName];
              if (!formerAncestorDeps) {
                formerAncestorDeps = this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[potentialAncestorName] = [];
              }
              formerAncestorDeps.push(depDescription);
            }
          }

          depDescription.ancestorsExamined = ancestorResults.ancestorsExamined;
        }


        // now check if the actual ancestor for the dependency changed
        let ancestorChanged = ancestorResults.ancestorFound !== depDescription.ancestorFound;

        if (ancestorChanged) {
          currentDep.componentIdentityChanged = true;
          if (currentDep.originalDownstreamVariableNames) {
            let valsChanged = {}
            for (let vName of currentDep.originalDownstreamVariableNames) {
              valsChanged[vName] = { changed: true }
            }
            currentDep.valuesChanged = [valsChanged];
          }

          // delete updep from previous ancestor
          let ancestorUpDep = this.upstreamDependencies[depDescription.ancestorFound.componentName];
          let depNamesToCheck = [];
          if (currentDep.mappedDownstreamVariableNamesByComponent) {
            depNamesToCheck = currentDep.mappedDownstreamVariableNamesByComponent[0];
          }
          else {
            depNamesToCheck = ['__identity'];
          }
          for (let vName of depNamesToCheck) {
            let upDeps = ancestorUpDep[vName];
            if (upDeps) {
              for (let [ind, u] of upDeps.entries()) {
                if (u === currentDep) {
                  upDeps.splice(ind, 1);
                  break;
                }
              }
            }
          }


          if (currentDep.mappedDownstreamVariableNamesByComponent) {
            this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);
          }

          currentDep.downstreamComponentNames = [ancestorResults.ancestorFound.componentName];
          depDescription.ancestorFound = ancestorResults.ancestorFound;


          // add updep to new ancestor
          ancestorUpDep = this.upstreamDependencies[ancestorResults.ancestorFound.componentName];
          if (!ancestorUpDep) {
            ancestorUpDep = this.upstreamDependencies[ancestorResults.ancestorFound.componentName] = {};
          }


          if (currentDep.originalDownstreamVariableNames) {
            currentDep.mappedDownstreamVariableNamesByComponent = [this.substituteAliases({
              stateVariables: currentDep.originalDownstreamVariableNames,
              componentClass: ancestorResults.ancestorFound.componentClass
            })];

            let ancestorVarNames = currentDep.mappedDownstreamVariableNamesByComponent[0];
            if (currentDep.variablesOptional) {
              ancestorVarNames = [];
              for (let varName of currentDep.mappedDownstreamVariableNamesByComponent[0]) {
                if (varName in this._components[ancestorResults.ancestorFound.componentName].state ||
                  this.checkIfArrayEntry({
                    stateVariable: varName,
                    component: this._components[ancestorResults.ancestorFound.componentName]
                  })
                ) {
                  ancestorVarNames.push(varName)
                }
              }
              if (ancestorVarNames.length === 0) {
                ancestorVarNames = ['__identity'];
              }
            }
            for (let vName of ancestorVarNames) {
              if (!this._components[ancestorResults.ancestorFound.componentName].state[vName] && vName !== "__identity") {
                let result = this.createFromArrayEntry({
                  component: this._components[ancestorResults.ancestorFound.componentName],
                  stateVariable: vName,
                  updatesNeeded,
                  compositesBeingExpanded,
                });
                if (Object.keys(result.varsUnresolved).length > 0) {
                  this.addUnresolvedDependencies({
                    varsUnresolved: result.varsUnresolved,
                    component: this._components[ancestorResults.ancestorFound.componentName],
                    updatesNeeded
                  });

                }
              }
              if (ancestorUpDep[vName] === undefined) {
                ancestorUpDep[vName] = [];
              }
              ancestorUpDep[vName].push(currentDep);

              if (vName !== "__identity" && !this._components[ancestorResults.ancestorFound.componentName].state[vName].isResolved) {
                // just added a dependency to descendant/stateVariables that is not resolved
                // add unresolved dependencies

                let upstreamComponent = this._components[currentDep.upstreamComponentName]

                let varsUnresolved = {};
                for (let varName of depDescription.stateVariables) {
                  varsUnresolved[varName] = [{
                    componentName: ancestorResults.ancestorFound.componentName,
                    stateVariable: vName
                  }]
                }

                this.addUnresolvedDependencies({
                  varsUnresolved,
                  component: upstreamComponent,
                  updatesNeeded
                });

                // if upstreamComponent/stateVariables was previously resolved
                // mark it as unresolved and recursively add 
                //unresolved dependencies upstream
                for (let varName of depDescription.stateVariables) {
                  if (upstreamComponent.state[varName].isResolved) {
                    this.markStateVariableAndUpstreamDependentsStale({
                      component: upstreamComponent,
                      varName,
                      updatesNeeded,
                      forceRecalculation: true
                    });

                    upstreamComponent.state[varName].isResolved = false;
                    this.resetUpstreamDependentsUnresolved({
                      component: upstreamComponent,
                      varName,
                      updatesNeeded
                    })
                  }
                }

              }

            }

            this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);

          }
          else {
            if (ancestorUpDep['__identity'] === undefined) {
              ancestorUpDep['__identity'] = [];
            }
            ancestorUpDep['__identity'].push(currentDep);
          }

          for (let varName of depDescription.stateVariables) {
            this.checkForCircularDependency({ componentName: cName, varName });
          }

          // note: markStateVariableAndUpstreamDependentsStale includes
          // any additionalStateVariablesDefined with stateVariable
          this.markStateVariableAndUpstreamDependentsStale({
            component: this._components[cName],
            varName: depDescription.stateVariables[0],
            updatesNeeded
          });

        }
      }

      for (let depDescription of ancestorDependenciesToDelete) {
        if (ancestorDependencies.length === 1) {
          delete this.componentIdentityDependencies.ancestorDependenciesByPotentialAncestor[parent.componentName];
        } else {
          ancestorDependencies.splice(ancestorDependencies.indexOf(depDescription), 1)
        }
      }
    }

  }

  updateReplacementDependencies(composite, updatesNeeded, compositesBeingExpanded) {
    // composite's replacements have changed
    // find all replacement dependencies that include that composite
    // and check for changes in the components

    // console.log(`update replacement dependencies for composite ${composite.componentName}`)


    if (this.componentIdentityDependencies.replacementDependenciesByComposite[composite.componentName]) {
      for (let depDescription of this.componentIdentityDependencies.replacementDependenciesByComposite[composite.componentName]) {

        // cName might not be same as composite if recursive === true
        let cName = depDescription.componentName;
        let dependencyName = depDescription.dependencyName;
        let currentDep = this.downstreamDependencies[cName][depDescription.stateVariables[0]][dependencyName];

        if (!currentDep) {
          // if this dependency were deleted, simply delete from replacementDependenciesByComposite
          let replacementDependencies = this.componentIdentityDependencies.replacementDependenciesByComposite[composite.componentName]
          if (replacementDependencies.length === 1) {
            delete this.componentIdentityDependencies.replacementDependenciesByComposite[composite.componentName];
          } else {
            replacementDependencies.splice(replacementDependencies.indexOf(depDescription), 1)
          }
          continue;
        }

        let depComponent = this.components[cName];

        let replacements = depComponent.replacements;
        if (!replacements) {
          replacements = [];
        }

        let compositesFound = [cName];

        if (currentDep.recursive) {
          let result = this.recursivelyReplaceCompositesWithReplacements({
            replacements,
            recurseForProp: currentDep.recurseForProp
          });
          replacements = result.newReplacements;
          compositesFound.push(...result.compositesFound);
        }

        let replacementNames = replacements.map(x => x.componentName);

        let replacementsChanged = false;
        if (replacements.length !== currentDep.downstreamComponentNames.length) {
          replacementsChanged = true;
        }
        else {
          for (let [ind, replacementName] of replacementNames.entries()) {
            if (replacementName !== currentDep.downstreamComponentNames[ind]) {
              replacementsChanged = true;
              break;
            }
          }
        }

        // console.log(`replacementsChanged: ${replacementsChanged}`)

        if (replacementsChanged) {
          currentDep.componentIdentitiesChanged = true;
          let valuesChanged = [];
          if (currentDep.originalDownstreamVariableNames) {
            let valsChanged = {}
            for (let vName of currentDep.originalDownstreamVariableNames) {
              valsChanged[vName] = { changed: true }
            }
            valuesChanged = replacements.map(() => valsChanged);
          }

          // change upstream dependencies
          for (let [replacementInd, currentReplacementName] of currentDep.downstreamComponentNames.entries()) {
            if (!replacementNames.includes(currentReplacementName)) {
              // lost a replacement.  remove dependency
              updatesNeeded.componentsTouched.push(currentReplacementName);
              let replacementUpDep = this.upstreamDependencies[currentReplacementName];
              let depNamesToCheck = [];
              if (currentDep.mappedDownstreamVariableNamesByComponent) {
                depNamesToCheck.push(...currentDep.mappedDownstreamVariableNamesByComponent[replacementInd]);
              }
              else {
                depNamesToCheck = ['__identity'];
              }
              for (let vName of depNamesToCheck) {
                let upDeps = replacementUpDep[vName];
                if (upDeps) {
                  for (let [ind, u] of upDeps.entries()) {
                    if (u === currentDep) {
                      upDeps.splice(ind, 1);
                      break;
                    }
                  }
                }
              }

              if (currentDep.mappedDownstreamVariableNamesByComponent) {
                this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);
              }

            }
          }

          let newMappedDownstreamVariableNamesByComponent = [];
          for (let newReplacementName of replacementNames) {
            let originalIndex = currentDep.downstreamComponentNames.indexOf(newReplacementName)
            if (originalIndex !== -1) {

              if (currentDep.originalDownstreamVariableNames) {
                newMappedDownstreamVariableNamesByComponent.push(currentDep.mappedDownstreamVariableNamesByComponent[originalIndex]);
              }

            } else {
              // gained a replacement.  add dependency
              updatesNeeded.componentsTouched.push(newReplacementName);
              let replacementUpDep = this.upstreamDependencies[newReplacementName];
              if (replacementUpDep === undefined) {
                replacementUpDep = this.upstreamDependencies[newReplacementName] = {};
              }
              if (currentDep.originalDownstreamVariableNames) {

                let mappedVarNames = this.substituteAliases({
                  stateVariables: currentDep.originalDownstreamVariableNames,
                  componentClass: this._components[newReplacementName].constructor
                });
                newMappedDownstreamVariableNamesByComponent.push(mappedVarNames)

                let replacementVarNames = mappedVarNames;

                if (currentDep.variablesOptional) {
                  replacementVarNames = [];
                  for (let varName of mappedVarNames) {
                    if (varName in this._components[newReplacementName].state ||
                      this.checkIfArrayEntry({
                        stateVariable: varName,
                        component: this._components[newReplacementName]
                      })
                    ) {
                      replacementVarNames.push(varName)
                    }
                  }
                  if (replacementVarNames.length === 0) {
                    replacementVarNames = ['__identity'];
                  }
                }
                for (let vName of replacementVarNames) {
                  if (!this._components[newReplacementName].state[vName] && vName !== "__identity") {
                    let result = this.createFromArrayEntry({
                      component: this._components[newReplacementName],
                      stateVariable: vName,
                      updatesNeeded,
                      compositesBeingExpanded
                    });
                    if (Object.keys(result.varsUnresolved).length > 0) {
                      this.addUnresolvedDependencies({
                        varsUnresolved: result.varsUnresolved,
                        component: this._components[newReplacementName],
                        updatesNeeded
                      });

                    }
                  }

                  if (replacementUpDep[vName] === undefined) {
                    replacementUpDep[vName] = [];
                  }
                  replacementUpDep[vName].push(currentDep);

                  if (vName !== "__identity" && !this._components[newReplacementName].state[vName].isResolved) {
                    // just added a dependency upstreamComponent/stateVariables that is not resolved
                    // add unresolved dependencies

                    let varsUnresolved = {};
                    for (let varName of depDescription.stateVariables) {
                      varsUnresolved[varName] = [{
                        componentName: newReplacementName,
                        stateVariable: vName
                      }]
                    }

                    let upstreamComponent = this.components[currentDep.upstreamComponentName];

                    this.addUnresolvedDependencies({
                      varsUnresolved,
                      component: upstreamComponent,
                      updatesNeeded
                    });

                    // if upstreamComponent/stateVariables was previously resolved
                    // mark it as unresolved and recursively add 
                    //unresolved dependencies upstream
                    for (let varName of depDescription.stateVariables) {
                      if (upstreamComponent.state[varName].isResolved) {
                        this.markStateVariableAndUpstreamDependentsStale({
                          component: upstreamComponent,
                          varName,
                          updatesNeeded,
                          forceRecalculation: true
                        });

                        upstreamComponent.state[varName].isResolved = false;
                        this.resetUpstreamDependentsUnresolved({
                          component: upstreamComponent,
                          varName,
                          updatesNeeded
                        })
                      }
                    }

                  }

                }

                this.resetCircularCheckPassed(currentDep.upstreamComponentName, currentDep.upstreamVariableNames[0]);

              }
              else if (currentDep.dependencyType === "replacementIdentity") {
                if (replacementUpDep['__identity'] === undefined) {
                  replacementUpDep['__identity'] = [];
                }
                replacementUpDep['__identity'].push(currentDep);
              }
            }
          }

          currentDep.downstreamComponentNames = replacementNames;
          if (currentDep.originalDownstreamVariableNames) {
            currentDep.mappedDownstreamVariableNamesByComponent = newMappedDownstreamVariableNamesByComponent;
            currentDep.valuesChanged = valuesChanged;
          }

          for (let varName of depDescription.stateVariables) {
            this.checkForCircularDependency({ componentName: cName, varName });
          }

          // note: markStateVariableAndUpstreamDependentsStale includes
          // any additionalStateVariablesDefined with stateVariable
          this.markStateVariableAndUpstreamDependentsStale({
            component: this._components[cName],
            varName: depDescription.stateVariables[0],
            updatesNeeded
          });

        }


        if (currentDep.recursive) {

          let compositesFoundChanged = false;
          if (compositesFound.length !== currentDep.compositesFound.length) {
            compositesFoundChanged = true;
          }
          else {
            for (let [ind, compositeName] of compositesFound.entries()) {
              if (compositeName !== currentDep.compositesFound[ind]) {
                compositesFoundChanged = true;
                break;
              }
            }
          }


          if (compositesFoundChanged) {

            // change upstream dependencies
            for (let currentCompositeName of currentDep.compositesFound) {
              if (!compositesFound.includes(currentCompositeName)) {
                // lost a composite.  remove dependency
                updatesNeeded.componentsTouched.push(currentCompositeName);
                let compositeUpDep = this.upstreamDependencies[currentCompositeName];
                let upDeps = compositeUpDep.__replacements;
                if (upDeps) {
                  for (let [ind, u] of upDeps.entries()) {
                    if (u === currentDep) {
                      upDeps.splice(ind, 1);
                      break;
                    }
                  }
                }

                // remove from replacementDependenciesByComposite
                let ind = this.componentIdentityDependencies.replacementDependenciesByComposite[currentCompositeName].indexOf(depDescription);
                if (ind === -1) {
                  console.error(`replacement dependency should have been in ${currentCompositeName}`)
                } else {
                  this.componentIdentityDependencies.replacementDependenciesByComposite[currentCompositeName].splice(ind, 1)
                }

              }
            }

            for (let newCompositeName of compositesFound) {
              if (!currentDep.compositesFound.includes(newCompositeName)) {
                // gained a replacement.  add dependency
                updatesNeeded.componentsTouched.push(newCompositeName);
                let compositeUpDep = this.upstreamDependencies[newCompositeName];
                if (compositeUpDep === undefined) {
                  compositeUpDep = this.upstreamDependencies[newCompositeName] = {};
                }
                if (compositeUpDep.__replacements === undefined) {
                  compositeUpDep.__replacements = [];
                }
                compositeUpDep.__replacements.push(currentDep);

                // add to replacementDependenciesByComposite
                if (!this.componentIdentityDependencies.replacementDependenciesByComposite[newCompositeName]) {
                  this.componentIdentityDependencies.replacementDependenciesByComposite[newCompositeName] = [];
                }
                this.componentIdentityDependencies.replacementDependenciesByComposite[newCompositeName].push(depDescription);
              }
            }


            currentDep.compositesFound = compositesFound;

          }

        }


      }
    }

  }

  resetUpstreamDependentsUnresolved({ component, varName, updatesNeeded }) {
    // component/varName has newly become unresolved
    // recursively mark its upstream dependents as newly unresolved
    // and add unresolved dependencies

    // console.log(`reset upstream dependents unresolved for ${component.componentName}, ${varName}`)

    let upstream = this.upstreamDependencies[component.componentName][varName];

    if (upstream) {
      for (let upDep of upstream) {
        updatesNeeded.componentsTouched.push(upDep.upstreamComponentName);
        let upDepComponent = this._components[upDep.upstreamComponentName];

        let varsUnresolved = {};
        for (let upVarName of upDep.upstreamVariableNames) {
          varsUnresolved[upVarName] = [{
            componentName: component.componentName,
            stateVariable: varName
          }]
        }
        this.addUnresolvedDependencies({
          varsUnresolved,
          component: upDepComponent,
          updatesNeeded
        });

        for (let upVarName of upDep.upstreamVariableNames) {
          let upVar = upDepComponent.state[upVarName];

          // if upVar was previously resolved
          // mark it as unresolved and recursively add 
          // unresolved dependencies upstream
          if (upVar.isResolved) {
            upVar.isResolved = false;
            this.resetUpstreamDependentsUnresolved({
              component: upDepComponent,
              varName: upVarName,
              updatesNeeded
            })
          }
        }
      }
    }
  }

  checkForCircularDependency({ componentName, varName, previouslyVisited = [] }) {

    let stateVariableIdentifier = `${componentName}:${varName}`

    if (previouslyVisited.includes(stateVariableIdentifier)) {
      // Found circular dependency
      // Create error message with list of component names involved

      console.log('found circular', stateVariableIdentifier, previouslyVisited)


      let componentNameRe = /^(.*):/
      let componentNamesInvolved = previouslyVisited
        .map(x => x.match(componentNameRe)[1])

      // remove internally created component names
      // and deduplicate while keeping order (so don't use Set)
      let uniqueComponentNames = componentNamesInvolved
        .filter(x => x.slice(0, 2) !== "__")
        .reduce((a, b) => a.includes(b) ? a : [...a, b], [])

      // If had only internally created component names, just give first componentName
      if (uniqueComponentNames.length === 0) {
        uniqueComponentNames = [componentNamesInvolved[0]]
      }

      let nameString;
      if (uniqueComponentNames.length === 1) {
        nameString = uniqueComponentNames[0]
      } else if (uniqueComponentNames.length === 2) {
        nameString = uniqueComponentNames.join(' and ')
      } else {
        uniqueComponentNames[uniqueComponentNames.length - 2] = uniqueComponentNames.slice(uniqueComponentNames.length - 2).join(", and ")
        uniqueComponentNames.pop();
        nameString = uniqueComponentNames.join(", ")
      }

      throw Error(`Circular dependency involving ${nameString}`);

    } else {
      // shallow copy so don't change original
      previouslyVisited = [...previouslyVisited, stateVariableIdentifier];
    }


    if (!this.circularCheckPassed[stateVariableIdentifier]) {
      this.circularCheckPassed[stateVariableIdentifier] = true;


      if (componentName in this.downstreamDependencies) {

        let downDeps = this.downstreamDependencies[componentName][varName];
        for (let dependencyName in downDeps) {
          let dep = downDeps[dependencyName];

          let downstreamComponentNames = dep.downstreamComponentNames;
          if (!downstreamComponentNames) {
            if (dep.downstreamComponentName) {
              downstreamComponentNames = [dep.downstreamComponentName];
            } else {
              continue;
            }
          }
          let mappedDownstreamVariableNamesByComponent = dep.mappedDownstreamVariableNamesByComponent;
          if (!mappedDownstreamVariableNamesByComponent) {
            if (dep.mappedDownstreamVariableName) {
              mappedDownstreamVariableNamesByComponent = [[dep.mappedDownstreamVariableName]];
            } else {
              continue;
            }
          }

          for (let [ind, cname] of downstreamComponentNames.entries()) {
            let varNames = mappedDownstreamVariableNamesByComponent[ind];
            for (let vname of varNames) {
              this.checkForCircularDependency({
                componentName: cname, varName: vname,
                previouslyVisited
              });
            }
          }
        }
      }
    }
  }


  resetCircularCheckPassed(componentName, varName) {
    let stateVariableIdentifier = componentName + ":" + varName;
    if (this.circularCheckPassed[stateVariableIdentifier]) {
      delete this.circularCheckPassed[stateVariableIdentifier];

      let upstream = this.upstreamDependencies[componentName][varName];

      if (upstream) {
        for (let upDep of upstream) {
          for (let vName of upDep.upstreamVariableNames) {
            if (vName !== '__childLogic' && vName !== "__identity") {
              this.resetCircularCheckPassed(upDep.upstreamComponentName, vName)
            }
          }
        }
      }
    }

  }


  markStateVariableAndUpstreamDependentsStale({ component, varName, updatesNeeded, forceRecalculation = false }) {

    // console.log(`mark state variable ${varName} of ${component.componentName} and updeps stale`)

    updatesNeeded.componentsTouched.push(component.componentName);

    let allStateVariablesAffectedObj = { [varName]: component.state[varName] };
    if (component.state[varName].additionalStateVariablesDefined) {
      component.state[varName].additionalStateVariablesDefined.forEach(x => allStateVariablesAffectedObj[x] = component.state[x]);
    }


    let currentFreshnessInfo = this.lookUpCurrentFreshness({ component, varName, allStateVariablesAffectedObj });
    let previouslyFreshVars = [];
    let previouslyEffectivelyFresh = [];
    let sumPreviouslyPartiallyFresh = 0;

    for (let vName in allStateVariablesAffectedObj) {
      let stateVarObj = allStateVariablesAffectedObj[vName]
      // if don't have a getter set, this indicates that, before this markStale function,
      // a state variable was fresh.
      if (!(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)) {
        previouslyFreshVars.push(vName);
      } else if (currentFreshnessInfo) {
        if (currentFreshnessInfo.fresh && currentFreshnessInfo.fresh[vName]) {
          previouslyEffectivelyFresh.push(vName);
        } else if (currentFreshnessInfo.partiallyFresh && currentFreshnessInfo.partiallyFresh[vName]) {
          sumPreviouslyPartiallyFresh += currentFreshnessInfo.partiallyFresh[vName];
        }
      }
    }

    previouslyEffectivelyFresh.push(...previouslyFreshVars)

    let aVarWasFreshOrPartiallyFresh = previouslyEffectivelyFresh.length > 0 || sumPreviouslyPartiallyFresh > 0;

    let varsChanged = {};
    for (let vName in allStateVariablesAffectedObj) {
      varsChanged[vName] = true;
    }

    let freshnessDecreased = false;

    if (aVarWasFreshOrPartiallyFresh || forceRecalculation) {

      let result = this.processMarkStale({ component, varName, allStateVariablesAffectedObj });

      if (result.fresh && !forceRecalculation) {
        for (let vName in result.fresh) {
          if (result.fresh[vName]) {
            delete varsChanged[vName];
          }
        }
      }

      let sumNewPartiallyFresh = 0;
      for (let vName in allStateVariablesAffectedObj) {
        if (previouslyEffectivelyFresh.includes(vName) && !(result.fresh && result.fresh[vName])) {
          freshnessDecreased = true;
          break;
        }
        if (result.partiallyFresh && result.partiallyFresh[vName]) {
          sumNewPartiallyFresh += result.partiallyFresh[vName];
        }
      }

      if (sumNewPartiallyFresh < sumPreviouslyPartiallyFresh) {
        freshnessDecreased = true;
      }

      if (result.updateReplacements) {
        updatesNeeded.compositesToUpdateReplacements.push(component.componentName);
      }

      if (result.updateDependencies) {
        updatesNeeded.componentsToUpdateDependencies.push({
          componentName: upDepComponent.componentName,
          stateVariables: result.updateDependencies
        })
      }

      if (result.itemScoreChanged) {
        for (let itemNumber of result.itemScoreChanged.itemNumbers) {
          updatesNeeded.itemScoreChanges.add(itemNumber)
        }
      }

    }

    for (let vName in varsChanged) {

      let stateVarObj = allStateVariablesAffectedObj[vName];

      // delete recursive dependency values, if they exist
      delete stateVarObj.recursiveDependencyValues;

      if (previouslyFreshVars.includes(vName)) {

        // save old value
        // mark stale by putting getter back in place to get a new value next time it is requested
        stateVarObj._previousValue = stateVarObj.value;
        delete stateVarObj.value;
        let getStateVar = this.getStateVariableValue;
        Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable: vName }), configurable: true });
      }

      if (forceRecalculation) {
        // The reason for a forceRecalculation is that, if a dependency is removed,
        // that wouldn't be detected by the algorithm
        // that looks for changes in dependencies
        stateVarObj.forceRecalculation = true;
      }
    }

    // we recurse on upstream dependents
    if (freshnessDecreased || forceRecalculation) {
      for (let vName in varsChanged) {
        this.markUpstreamDependentsStale({ component, varName: vName, updatesNeeded, forceRecalculation });
      }
    }

  }


  lookUpCurrentFreshness({ component, varName, allStateVariablesAffectedObj }) {


    let stateVarObj = component.state[varName];

    if (!stateVarObj.getCurrentFreshness) {
      return;
    }

    let freshnessInfo = stateVarObj.freshnessInfo;

    let arrayKeys, arraySize;

    if (stateVarObj.isArrayEntry) {
      // have to use old value of arrayKeys
      // because can't evaluate state variable in middle of marking stale
      let arrayKeysStateVar = component.state[stateVarObj.arrayKeysStateVariable];
      arrayKeys = arrayKeysStateVar._previousValue;
      let varWasFresh = !(Object.getOwnPropertyDescriptor(arrayKeysStateVar, 'value').get || arrayKeysStateVar.immutable);
      if (varWasFresh) {
        arrayKeys = arrayKeysStateVar.value;
      }

      arrayKeys = new Proxy(arrayKeys, readOnlyProxyHandler);

    }

    if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
      // have to use old value of arraySize
      // because can't evaluate state variable in middle of marking stale

      let arraySizeStateVar = component.state[stateVarObj.arraySizeStateVariable];
      arraySize = arraySizeStateVar._previousValue;
      let varWasFresh = !(Object.getOwnPropertyDescriptor(arraySizeStateVar, 'value').get || arraySizeStateVar.immutable);
      if (varWasFresh) {
        arraySize = arraySizeStateVar.value;
      }

      if (Array.isArray(arraySize)) {
        arraySize = new Proxy(arraySize, readOnlyProxyHandler);
      } else {
        arraySize = [];
      }

    }

    let result = stateVarObj.getCurrentFreshness({
      freshnessInfo,
      arrayKeys, arraySize,
    });

    if (result.partiallyFresh) {
      // if have array entry, then intrepret partiallyfresh as indicating
      // freshness of array entry, not whole array
      for (let vName in allStateVariablesAffectedObj) {
        if (allStateVariablesAffectedObj[vName].isArrayEntry) {
          let arrayName = allStateVariablesAffectedObj[vName].arrayStateVariable;
          result.partiallyFresh[vName] = result.partiallyFresh[arrayName];
          delete result.partiallyFresh[arrayName];
        }
      }
    }

    if (result.fresh) {
      // if have array entry, then intrepret fresh as indicating
      // freshness of array entry, not whole array
      for (let vName in allStateVariablesAffectedObj) {
        if (allStateVariablesAffectedObj[vName].isArrayEntry) {
          let arrayName = allStateVariablesAffectedObj[vName].arrayStateVariable;
          if (arrayName in result.fresh) {
            result.fresh[vName] = result.fresh[arrayName];
            delete result.fresh[arrayName];
          }
        }
      }
    }

    // console.log(`result of lookUpCurrentFreshness of ${varName} of ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(result)))

    return result;
  }

  processMarkStale({ component, varName, allStateVariablesAffectedObj }) {
    // if the stateVariable varName (or its array state variable)
    // has a markStale function, then run that function,
    // giving it arguments with information about what changed

    // markStale may change the freshnessInfo for varName (or its array state variable)
    // and will return an object with attributes
    // - fresh: if the variable is to be considered completely fresh,
    //   indicating the mark stale process should not recurse
    // - partiallyFresh: if the variable is partially fresh,
    //   indicating the mark stale process should recurse,
    //   but the variable should be marked to allow later mark stale
    //   processes that involve the variable to process the variable again
    // - updateReplacements: set to true if need to update composite
    //   replacements after marking this variable stale


    let stateVarObj = component.state[varName];

    if (!stateVarObj.markStale) {
      let fresh = {};
      Object.keys(allStateVariablesAffectedObj).forEach(x => fresh[x] = false)
      return { fresh }
    }

    let changes = {};
    let downDeps = this.downstreamDependencies[component.componentName][varName];

    for (let dependencyName in downDeps) {
      let dep = downDeps[dependencyName];
      let depChanges = {};
      let foundDepChange = false;
      if (dep.componentIdentityChanged) {
        depChanges.componentIdentityChanged = true;
        foundDepChange = true;
      }
      if (dep.componentIdentitiesChanged) {
        depChanges.componentIdentitiesChanged = true;
        foundDepChange = true;
      }
      if (dep.valuesChanged) {
        depChanges.valuesChanged = dep.valuesChanged;
        foundDepChange = true;
      }
      if (foundDepChange) {
        changes[dependencyName] = depChanges;
      }

    }

    let freshnessInfo = stateVarObj.freshnessInfo;

    let arrayKeys, arraySize;

    if (stateVarObj.isArrayEntry && !stateVarObj.entireArrayAtOnce) {
      // have to use old value of arrayKeys
      // because can't evaluate state variable in middle of marking stale
      let arrayKeysStateVar = component.state[stateVarObj.arrayKeysStateVariable];
      arrayKeys = arrayKeysStateVar._previousValue;
      let varWasFresh = !(Object.getOwnPropertyDescriptor(arrayKeysStateVar, 'value').get || arrayKeysStateVar.immutable);
      if (varWasFresh) {
        arrayKeys = arrayKeysStateVar.value;
      }

      arrayKeys = new Proxy(arrayKeys, readOnlyProxyHandler);

    }

    if ((stateVarObj.isArrayEntry || stateVarObj.isArray) && !stateVarObj.entireArrayAtOnce) {
      // have to use old value of arraySize
      // because can't evaluate state variable in middle of marking stale

      let arraySizeStateVar = component.state[stateVarObj.arraySizeStateVariable];
      arraySize = arraySizeStateVar._previousValue;
      let varWasFresh = !(Object.getOwnPropertyDescriptor(arraySizeStateVar, 'value').get || arraySizeStateVar.immutable);
      if (varWasFresh) {
        arraySize = arraySizeStateVar.value;
      }

      if (Array.isArray(arraySize)) {
        arraySize = new Proxy(arraySize, readOnlyProxyHandler);
      } else {
        arraySize = [];
      }

    }

    let result = stateVarObj.markStale({
      freshnessInfo,
      changes,
      arrayKeys, arraySize,
    });

    // console.log(`result of mark stale`, deepClone(result))

    if (result.partiallyFresh) {
      // if have array entry, then intrepret partiallyfresh as indicating
      // freshness of array entry, not whole array
      for (let vName in allStateVariablesAffectedObj) {
        if (allStateVariablesAffectedObj[vName].isArrayEntry) {
          let arrayName = allStateVariablesAffectedObj[vName].arrayStateVariable;
          result.partiallyFresh[vName] = result.partiallyFresh[arrayName];
          delete result.partiallyFresh[arrayName];
        }
      }
    }


    if (result.fresh) {
      // if have array entry, then intrepret fresh as indicating
      // freshness of array entry, not whole array
      for (let vName in allStateVariablesAffectedObj) {
        if (allStateVariablesAffectedObj[vName].isArrayEntry) {
          let arrayName = allStateVariablesAffectedObj[vName].arrayStateVariable;
          if (arrayName in result.fresh) {
            result.fresh[vName] = result.fresh[arrayName];
            delete result.fresh[arrayName];
          }
        }
      }
    }

    // console.log(`result of process mark stale of ${varName} of ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(result)))

    return result;
  }

  markUpstreamDependentsStale({ component, varName, updatesNeeded, forceRecalculation = false }) {
    // Recursively mark every upstream dependency of component/varName as stale
    // If a state variable is already stale (has a getter in place)
    // then don't recurse
    // Before marking a stateVariable as stale, run markStale function, if it exists
    // Record additional information about the staleness from result of markStale,
    // and recurse only if markStale indicates variable is actually stale

    let componentName = component.componentName;
    let getStateVar = this.getStateVariableValue;

    // console.log(`marking upstream of ${varName} of ${componentName} as stale`);

    let upstream = this.upstreamDependencies[componentName][varName];

    let freshnessInfo = component.state[varName].freshnessInfo;

    if (upstream) {
      for (let upDep of upstream) {

        // TODO: remove all these error checks to speed up process
        // once we're confident bugs have been removed?

        let foundVarChange = false;

        if (upDep.downstreamComponentNames) {
          // this particular upstream dependency has multiple downstream components
          // must find which one of those components correspond to current component

          let componentInd = upDep.downstreamComponentNames.indexOf(componentName);
          if (componentInd === -1) {
            // presumably component was deleted
            continue;
          }

          // if have multiple components, there must be multiple variables
          // ensure that varName is one of them
          let varInd = upDep.mappedDownstreamVariableNamesByComponent[componentInd].indexOf(varName);
          if (varInd === -1) {
            throw Error(`something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`);
          }

          let originalVarName = upDep.originalDownstreamVariableNames[varInd];

          // records that component (index componentInd) and varName have changed
          if (!upDep.valuesChanged) {
            upDep.valuesChanged = [];
          }
          if (!upDep.valuesChanged[componentInd]) {
            upDep.valuesChanged[componentInd] = {};
          }
          if (!upDep.valuesChanged[componentInd][originalVarName]) {
            upDep.valuesChanged[componentInd][originalVarName] = {};
          }
          upDep.valuesChanged[componentInd][originalVarName].potentialChange = true;

          // add any additional information about the stalename of component/originalVarName
          if (freshnessInfo) {
            upDep.valuesChanged[componentInd][originalVarName].freshnessInfo
              = new Proxy(freshnessInfo, readOnlyProxyHandler);
          }

          foundVarChange = true;

        } else {
          // if there is only one downstream component name, it must be the current component
          if (upDep.downstreamComponentName !== componentName) {
            throw Error(`something went wrong as ${componentName} not the downstreamComponent of ${upDep.dependencyName}`);
          }

          // with one downstream component, dependency could have one or multiple variables
          if (upDep.mappedDownstreamVariableName) {

            // if single downstream variable, it must be the current variable
            if (upDep.mappedDownstreamVariableName !== varName) {
              throw Error(`something went wrong as ${varName} not the downstreamVariable of ${upDep.dependencyName}`);
            }

            // record that componentName/varName have changed
            // and any additional stale information
            if (!upDep.valuesChanged) {
              upDep.valuesChanged = { [upDep.originalDownstreamVariableName]: {} };
            }

            upDep.valuesChanged[upDep.originalDownstreamVariableName].potentialChange = true;

            if (freshnessInfo) {
              upDep.valuesChanged[upDep.originalDownstreamVariableName].freshnessInfo
                = new Proxy(freshnessInfo, readOnlyProxyHandler);
            }

            foundVarChange = true;

          }

        }

        if (foundVarChange) {

          updatesNeeded.componentsTouched.push(upDep.upstreamComponentName);

          let upVarName = upDep.upstreamVariableNames[0];
          let upDepComponent = this._components[upDep.upstreamComponentName];
          // let upVar = upDepComponent.state[upVarName];

          let allStateVariablesAffectedObj = {};
          upDep.upstreamVariableNames.forEach(x => allStateVariablesAffectedObj[x] = upDepComponent.state[x]);

          let currentFreshnessInfo = this.lookUpCurrentFreshness({
            component: upDepComponent,
            varName: upVarName,
            allStateVariablesAffectedObj,
          });

          let previouslyFreshVars = [];
          let previouslyEffectivelyFresh = [];
          let sumPreviouslyPartiallyFresh = 0;
          for (let vName in allStateVariablesAffectedObj) {
            let stateVarObj = allStateVariablesAffectedObj[vName]
            // if don't have a getter set, this indicates that, before this markStale function,
            // a state variable was fresh.
            if (!(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)) {
              previouslyFreshVars.push(vName);
            } else if (currentFreshnessInfo) {
              if (currentFreshnessInfo.fresh && currentFreshnessInfo.fresh[vName]) {
                previouslyEffectivelyFresh.push(vName);
              } else if (currentFreshnessInfo.partiallyFresh && currentFreshnessInfo.partiallyFresh[vName]) {
                sumPreviouslyPartiallyFresh += currentFreshnessInfo.partiallyFresh[vName];
              }
            }
          }

          previouslyEffectivelyFresh.push(...previouslyFreshVars)

          let aVarWasFreshOrPartiallyFresh = previouslyEffectivelyFresh.length > 0 || sumPreviouslyPartiallyFresh > 0;

          let varsChanged = {};
          for (let vName in allStateVariablesAffectedObj) {
            varsChanged[vName] = true;
          }

          let freshnessDecreased = false;

          if (aVarWasFreshOrPartiallyFresh || forceRecalculation) {

            let result = this.processMarkStale({
              component: upDepComponent,
              varName: upVarName,
              allStateVariablesAffectedObj,
            });

            if (result.fresh && !forceRecalculation) {
              for (let vName in result.fresh) {
                if (result.fresh[vName]) {
                  delete varsChanged[vName];
                }
              }
            }

            let sumNewPartiallyFresh = 0;
            for (let vName in allStateVariablesAffectedObj) {
              if (previouslyEffectivelyFresh.includes(vName) && !(result.fresh && result.fresh[vName])) {
                freshnessDecreased = true;
                break;
              }
              if (result.partiallyFresh && result.partiallyFresh[vName]) {
                sumNewPartiallyFresh += result.partiallyFresh[vName];
              }
            }

            if (sumNewPartiallyFresh < sumPreviouslyPartiallyFresh) {
              freshnessDecreased = true;
            }


            if (result.updateReplacements) {
              updatesNeeded.compositesToUpdateReplacements.push(upDep.upstreamComponentName);
            }

            if (result.updateDependencies) {
              updatesNeeded.componentsToUpdateDependencies.push({
                componentName: upDepComponent.componentName,
                stateVariables: result.updateDependencies
              })
            }

            if (result.itemScoreChanged) {
              for (let itemNumber of result.itemScoreChanged.itemNumbers) {
                updatesNeeded.itemScoreChanges.add(itemNumber)
              }
            }

          }

          for (let vName in varsChanged) {

            let stateVarObj = allStateVariablesAffectedObj[vName];

            // delete recursive dependency values, if they exist
            delete stateVarObj.recursiveDependencyValues;

            if (previouslyFreshVars.includes(vName)) {

              // save old value
              // mark stale by putting getter back in place to get a new value next time it is requested
              stateVarObj._previousValue = stateVarObj.value;
              delete stateVarObj.value;
              Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component: upDepComponent, stateVariable: vName }), configurable: true });
            }

            if (forceRecalculation) {
              // The reason for a forceRecalculation is that, if a dependency is removed,
              // that wouldn't be detected by the algorithm
              // that looks for changes in dependencies
              stateVarObj.forceRecalculation = true;
            }

          }

          // we recurse on upstream dependents
          if (freshnessDecreased || forceRecalculation) {
            for (let vName in varsChanged) {
              this.markUpstreamDependentsStale({
                component: upDepComponent,
                varName: vName,
                updatesNeeded,
                forceRecalculation
              });
            }
          }

        }
      }
    }

  }

  updateDependencies(updatesNeeded, compositesBeingExpanded) {

    let dependencyChanges = [];

    if (updatesNeeded.componentsToUpdateDependencies.length > 0) {
      console.log(`updating dependencies`)
      console.log(updatesNeeded.componentsToUpdateDependencies)

      let determineDependenciesStateVariablesToFreshen = [];

      let dependenciesCouldNotUpdate = [];

      for (let updateObj of updatesNeeded.componentsToUpdateDependencies) {

        let component = this._components[updateObj.componentName];
        if (!component) {
          // if component was deleted, just skip
          continue;
        }

        let stateVariablesToUpdate = [];
        let additionalStateVariablesThatWillBeUpdated = [];
        for (let stateVariable of updateObj.stateVariables) {
          if (!additionalStateVariablesThatWillBeUpdated.includes(stateVariable)) {
            stateVariablesToUpdate.push(stateVariable);
            if (component.state[stateVariable].additionalStateVariablesDefined) {
              additionalStateVariablesThatWillBeUpdated.push(
                ...component.state[stateVariable].additionalStateVariablesDefined
              )
            }
            let determineDependenciesStateVariable = component.state[stateVariable].determineDependenciesStateVariable;
            determineDependenciesStateVariablesToFreshen.push(
              component.state[determineDependenciesStateVariable]
            )
          }
        }

        for (let stateVariable of stateVariablesToUpdate) {
          let allStateVariablesAffected = [stateVariable];
          if (component.state[stateVariable].additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...component.state[stateVariable].additionalStateVariablesDefined)
          }


          let stateVarObj = component.state[stateVariable];

          let definitionArgs;

          try {
            definitionArgs = this.getStateVariableDependencyValues({
              component,
              stateVariable: stateVarObj.determineDependenciesStateVariable
            });
          } catch (e) {
            // It is possible that a determineDependenciesStateVariable
            // depends on a dependency that was just changed
            // (but not yet updated)
            // Since this could lead to an error being throw when getting
            // the dependency values, just catch this error
            // and we'll recurse to update this state variable
            // after we have finished this round of updating.
            console.log(`Couldn't update dependencies of ${stateVarObj.determineDependenciesStateVariable} of ${component.componentName}`)
            dependenciesCouldNotUpdate.push({
              componentName: component.componentName,
              stateVariables: [stateVariable]
            });
            continue;
          }

          if (Object.keys(definitionArgs.changes).length === 0 &&
            stateVarObj._previousValue !== undefined
          ) {
            // console.log(`no changes for ${stateVariable}`)
            // no changes
            continue;
          }


          // TODO: should we change the output of returnDependencies
          // to be an object with one key being dependencies?
          // That wway, we could add another attribute to the return value
          // rather than having returnDependencies add the attribute
          // changedDependency to the arguments
          let returnDepArgs = {
            stateValues: definitionArgs.dependencyValues,
            componentInfoObjects: this.componentInfoObjects,
            sharedParameters: component.sharedParameters,
          }
          let newDependencies = stateVarObj.returnDependencies(returnDepArgs);

          let changedDependency = this.replaceDependenciesIfChanged({
            component, stateVariable, newDependencies, allStateVariablesAffected
          });

          if (changedDependency || returnDepArgs.changedDependency) {// || arraySizeChanged) {
            dependencyChanges.push({
              componentName: component.componentName,
              stateVariable,
              allStateVariablesAffected,
            })
          }

        }
      }

      console.log("dependencyChanges")
      console.log(dependencyChanges)

      // initialize componentsToUpdateDependencies with any dependencies
      // that we could not update above
      // We will recurse to update those dependencies, along with any
      // more dependencies that get marked for needing updates
      updatesNeeded.componentsToUpdateDependencies = dependenciesCouldNotUpdate;

      let haveUnresolved = Object.keys(updatesNeeded.unresolvedDependencies).length > 0;
      for (let updateObj of dependencyChanges) {

        let component = this._components[updateObj.componentName];

        for (let varName of updateObj.allStateVariablesAffected) {
          component.state[varName].isResolved = false;
        }

        let resolveResult = this.resolveStateVariables({
          component,
          stateVariables: updateObj.allStateVariablesAffected,
          updatesNeeded,
          compositesBeingExpanded,
        })

        this.addUnresolvedDependencies({
          varsUnresolved: resolveResult.varsUnresolved,
          component,
          updatesNeeded
        });

        for (let varName of updateObj.allStateVariablesAffected) {
          if (!component.state[varName].isResolved) {
            haveUnresolved = true;
            this.resetUpstreamDependentsUnresolved({
              component,
              varName,
              updatesNeeded
            })
          }

        }
      }

      if (haveUnresolved) {
        this.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
      }

      // look up value of all determine dependencies state variables
      // in order to freshen them
      // (needed so that mark stale will be triggered next time they change)
      for (let stateVarObj of determineDependenciesStateVariablesToFreshen) {
        stateVarObj.value;
      }

      for (let updateObj of dependencyChanges) {

        for (let varName of updateObj.allStateVariablesAffected) {
          this.checkForCircularDependency({
            componentName: updateObj.componentName,
            varName,
          });
        }

        // note: markStateVariableAndUpstreamDependentsStale includes
        // any additionalStateVariablesDefined with stateVariable
        this.markStateVariableAndUpstreamDependentsStale({
          component: this._components[updateObj.componentName],
          varName: updateObj.stateVariable,
          updatesNeeded,
          forceRecalculation: true,
        })

      }

    }

    // check more more time for unresolved
    // (Encountered case where composite wasn't ready to expand
    // until after the final mark stale step, above.
    // resolveAllDependencies tries to expand composites.)

    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      this.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
    }

    this.replacementChangesFromCompositesToUpdate({ updatesNeeded, compositesBeingExpanded })

    if (updatesNeeded.componentsToUpdateDependencies.length > 0) {
      // TODO: address case where have continued dependencies to update
      // How do we make sure don't have infinite loop?
      console.log(`since found more components to update dependencies, will try to recurse`)
      console.log(updatesNeeded.componentsToUpdateDependencies)
      this.updateDependencies(updatesNeeded, compositesBeingExpanded);
      // throw Error("Need to address further updates to dependencies caused by composite changes")
    }

  }

  replaceDependenciesIfChanged({ component, stateVariable, newDependencies, allStateVariablesAffected }) {

    // Note: currentDeps object is downstream dependencies
    // of allStateVariablesAffected
    let currentDeps = this.downstreamDependencies[component.componentName][stateVariable];

    let changedDependency = false;

    for (let dependencyName in currentDeps) {
      if (!(dependencyName in newDependencies)) {
        changedDependency = true;
        this.deleteDownstreamDependency({
          downDeps: currentDeps,
          downDepName: dependencyName
        });
      }
    }

    for (let dependencyName in newDependencies) {
      if (dependencyName in currentDeps) {
        let dependencyDefinition = newDependencies[dependencyName];
        let currentDep = currentDeps[dependencyName];
        if (!deepCompare(dependencyDefinition, currentDep.definition)) {
          changedDependency = true;
          this.deleteDownstreamDependency({
            downDeps: currentDeps,
            downDepName: dependencyName
          });
          let dependencyDefinition = newDependencies[dependencyName];
          let newStateVariableDependencies = this.createNewStateVariableDependency({
            component,
            stateVariable,
            dependencyName, dependencyDefinition,
            allStateVariablesAffected,
          });
          Object.assign(currentDeps, newStateVariableDependencies);

          for (let varName of allStateVariablesAffected) {
            this.resetCircularCheckPassed(component.componentName, varName);
          }
        }
      }
      else {
        changedDependency = true;
        let dependencyDefinition = newDependencies[dependencyName];
        let newStateVariableDependencies = this.createNewStateVariableDependency({
          component,
          stateVariable,
          dependencyName, dependencyDefinition,
          allStateVariablesAffected,
        });
        Object.assign(currentDeps, newStateVariableDependencies);

        for (let varName of allStateVariablesAffected) {
          this.resetCircularCheckPassed(component.componentName, varName);
        }

      }
    }
    return changedDependency;
  }

  evaluatedDeferredChildStateVariables(component) {
    for (let child of component.activeChildren) {
      if (child.componentType === "string") {
        for (let varName in child.state) {
          if (child.state[varName].deferred) {
            let evaluateSoNoLongerDeferred = child.state[varName].value;
          }
        }
      }
    }
  }

  registerComponent(component) {
    if (component.componentName in this._components) {
      throw Error(`Duplicate componentName: ${component.componentName}`);
    }
    this._components[component.componentName] = component;
  }

  deregisterComponent(component, recursive = true) {
    if (recursive === true) {
      for (let childName in component.allChildren) {
        this.deregisterComponent(component.allChildren[childName].component);
      }
    }

    delete this._components[component.componentName];
  }

  setAncestors(component, ancestors = []) {

    // set ancestors based on allChildren
    // so that all components get ancestors
    // even if not activeChildren or definingChildren

    component.ancestors = ancestors;

    // // check if component is a gathered descendant of any ancestor
    // let ancestorsWhoGathered = [];
    // for (let ancName of ancestors) {
    //   let anc = this.components[ancName];
    //   if (anc.descendantsFound) {
    //     let wasGathered = false;
    //     for (let key in anc.descendantsFound) {
    //       for (let comp of anc.descendantsFound[key]) {
    //         if (comp.componentName === component.componentName) {
    //           ancestorsWhoGathered.push(ancName);
    //           wasGathered = true;
    //           break;
    //         }
    //       }
    //       if (wasGathered) {
    //         break;
    //       }
    //     }
    //   }
    // }
    // if (ancestorsWhoGathered.length > 0) {
    //   component.ancestorsWhoGathered = ancestorsWhoGathered;
    // } else {
    //   delete component.ancestorsWhoGathered;
    // }

    let ancestorsForChildren = [
      {
        componentName: component.componentName,
        componentClass: component.constructor
      },
      ...component.ancestors
    ];

    for (let childName in component.allChildren) {
      let unproxiedChild = this._components[childName];
      this.setAncestors(unproxiedChild, ancestorsForChildren);
    }
  }

  addChildren({ parent, indexOfDefiningChildren, newChildren, updatesNeeded, compositesBeingExpanded }) {

    this.spliceChildren(parent, indexOfDefiningChildren, newChildren);

    let newChildrenResult = this.processNewDefiningChildren({
      parent, updatesNeeded, compositesBeingExpanded
    });

    let sugarResult = this.applySugarOrAddSugarCreationStateVariables({
      component: parent,
      updatesNeeded,
      compositesBeingExpanded
    });

    if (sugarResult.varsUnresolved) {
      throw Error(`need to implement resolving additional state variables in addChildren`)
    }

    let addedComponents = {};
    let deletedComponents = {};

    newChildren.forEach(x => addedComponents[x.componentName] = x);


    if (!newChildrenResult.success) {
      return newChildrenResult;
    }

    return {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
    }
  }

  processNewDefiningChildren({ parent, updatesNeeded, compositesBeingExpanded }) {

    this.parameterStack.push(parent.sharedParameters, false);
    let childResult = this.deriveChildResultsFromDefiningChildren(
      parent, updatesNeeded, compositesBeingExpanded
    );
    this.parameterStack.pop();

    let ancestorsForChildren = [
      {
        componentName: parent.componentName,
        componentClass: parent.constructor
      },
      ...parent.ancestors
    ];

    // set ancestors for allChildren of parent
    // since could replace newChildren by adapters or via composites
    for (let childName in parent.allChildren) {
      let unproxiedChild = this._components[childName];
      this.setAncestors(unproxiedChild, ancestorsForChildren);
    }

    this.updateChildAndDescendantDependencies(parent, updatesNeeded, compositesBeingExpanded);

    return childResult;

  }

  spliceChildren(parent, indexOfDefiningChildren, newChildren) {
    // splice newChildren into parent.definingChildren
    // definingChildrenNumber is the index of parent.definingChildren
    // before which to splice the newChildren (set to array length to add at end)

    let numDefiningChildren = parent.definingChildren.length;

    if (!Number.isInteger(indexOfDefiningChildren) ||
      indexOfDefiningChildren > numDefiningChildren ||
      indexOfDefiningChildren < 0) {
      throw Error("Can't add children at index " + indexOfDefiningChildren + ". Invalid index.");
    }

    // perform the actual splicing into children
    parent.definingChildren.splice(indexOfDefiningChildren, 0, ...newChildren);

  }

  finishUpdate({ deletedComponents, addedComponents, init = false } = {}) {

    // TODO: review this function and what it is supposed to be doing

    // for now, reinitialize all renderers
    // TODO: initialize just those renderers that changed
    // (maybe as part of updates, like upstreamupdates?)
    //Should only be called on new components

    //this.initializeRenderers([this._components['__document1']]);

    // this.rebuildRenderComponents();

    // if (init === false) {
    //   this.update({ doenetTags: this._renderComponents });
    // }
  }

  deleteComponents({ components, deleteUpstreamDependencies = true,
    cancelIfUpstreamDeleteFailure = true, //dryRun = false,
    updatesNeeded,
    compositesBeingExpanded
  }) {

    // to delete a component, one must
    // 1. recursively delete all children
    // 3. should we delete or mark components who are upstream dependencies?
    // 4. for all other downstream dependencies,
    //    delete upstream link back to component

    if (!Array.isArray(components)) {
      components = [components];
    }

    // TODO: if delete a shadow directly it should be an error
    // (though it will be OK to delete them through other side effects)

    // step 1. Determine which components to delete
    const componentsToDelete = {}
    this.determineComponentsToDelete({
      components,
      deleteUpstreamDependencies,
      componentsToDelete
    });


    //TODO: figure out if it's OK to delete our children by asking the references to our children

    //Ask parent if we can be deleted
    //Calculate parent set
    const parentsOfPotentiallyDeleted = {};
    for (let componentName in componentsToDelete) {
      let component = componentsToDelete[componentName];
      let parent = this.components[component.parentName];

      // only add parent if it is not in componentsToDelete itself
      if (parent === undefined || parent.componentName in componentsToDelete) {
        continue;
      }
      let parentObj = parentsOfPotentiallyDeleted[component.parentName];
      if (parentObj === undefined) {
        parentObj =
        {
          parent: this._components[component.parentName],
          definingChildrenNames: new Set(),
        }
        parentsOfPotentiallyDeleted[component.parentName] = parentObj;
      }
      parentObj.definingChildrenNames.add(componentName);
    }

    let goAheadAndDelete = true;

    let previousDefiningChildren = {};

    // if component is a replacement of another component,
    // need to delete component from the replacement
    // so that it isn't added back as a child of its parent
    // Also keep track of which ones deleted so can add back to replacements
    // if the deletion is unsuccessful
    let replacementsDeleted = {};

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];
      if (component.replacementOf) {
        let composite = component.replacementOf;
        // component to delete is a replacement, delete from replacements of composite
        for (let [ind, replacement] of composite.replacements.entries()) {
          if (replacement.componentName === componentName) {
            let rdObj = replacementsDeleted[composite.componentName];
            if (rdObj === undefined) {
              rdObj = replacementsDeleted[composite.componentName] = [];
            }
            rdObj.push({ ind: ind, replacement: composite.replacements[ind] });
            composite.replacements.splice(ind, 1);

            // TODO: if have stateVariable dependencies that depend on replacements
            // these will need to be modified

            break;
          }
        }
      }
    }

    // delete component from parent's defining children
    // (as a separate copy so that can test if it will work)
    for (let parentName in parentsOfPotentiallyDeleted) {
      let parentObj = parentsOfPotentiallyDeleted[parentName];
      let parent = parentObj.parent;

      previousDefiningChildren[parentName] = parent.definingChildren;

      // create shallow copy of definingChildren so can modify
      parent.definingChildren = parent.definingChildren.slice();

      let deletedADefiningChild = false;

      for (let ind = parent.definingChildren.length - 1; ind >= 0; ind--) {
        let child = parent.definingChildren[ind];
        if (parentObj.definingChildrenNames.has(child.componentName)) {
          parent.definingChildren.splice(ind, 1);  // delete from array
          deletedADefiningChild = true;
        }
      }

      if (deletedADefiningChild) {

        // TODO: need to rethink processing new defining child with fake children
        // What does that do to dependencies?  Do we need a dry run mode?

        // with new defining children and adjusted replacements
        // determine if parent can accept the active children that result
        let childResult = this.processNewDefiningChildren({
          parent, updatesNeeded, compositesBeingExpanded
        });

        if (!childResult.success) {
          console.log("***** can't delete because couldn't derive child results");
          goAheadAndDelete = false;
        }
      }

      // parent.activeChildren = childResult.activeChildren;
      // parent.allChildren = childResult.allChildren;
      // parent.childLogic = childResult.childLogic;
      // parent.descendantsFound = childResult.descendantsFound;
    }

    // TODO: if
    // (A) we tried to delete upstream dependencies,
    // (B) there was a delete failure, and
    // (C) we shouldn't cancel upon upstream failure,
    // then we need to determine if the failure was just on an upstream dependence
    // and delete what we can in this case
    if (goAheadAndDelete === false && deleteUpstreamDependencies === true &&
      cancelIfUpstreamDeleteFailure !== true) {
      console.log("**** Need to determine whether or not can delete components and leave upstream in place")
    }

    if (goAheadAndDelete === false) {
      console.log("Failed to delete components");

      // put any deleted replacements back in
      for (let compositeName in replacementsDeleted) {
        let rdObj = replacementsDeleted[compositeName];
        let downDepComponent = this._components[compositeName];
        while (rdObj.length > 0) {
          let rdInfo = rdObj.pop();
          downDepComponent.replacements.splice(rdInfo.ind, 0, rdInfo.replacement)
        }
      }

      // put original defining children back in
      for (let parentName in parentsOfPotentiallyDeleted) {
        let parentObj = parentsOfPotentiallyDeleted[parentName];
        let parent = parentObj.parent;
        parent.definingChildren = previousDefiningChildren[parentName];
        this.processNewDefiningChildren({ parent, updatesNeeded, compositesBeingExpanded });
      }
      return { success: false };
    }

    // // TODO: do we want dry run?
    // if (dryRun === true) {
    //   return { success: true, allChildResults: allChildResults };
    // }


    // record parents
    let allParents = [];
    for (let parentName in parentsOfPotentiallyDeleted) {
      let parentObj = parentsOfPotentiallyDeleted[parentName];
      let parent = parentObj.parent;
      allParents.push(parent);

      // processing new defining children again,
      // as even if changed composite replacements rather than actual defining children
      // we still need to process new defining children to get the change
      // TODO: currently doing extra work if did process new defining childrean already, above
      // Need to refine.
      this.processNewDefiningChildren({
        parent, updatesNeeded, compositesBeingExpanded
      })
    }

    for (let compositeName in replacementsDeleted) {
      if (!(compositeName in componentsToDelete)) {
        this.updateReplacementDependencies(
          this._components[compositeName], updatesNeeded, compositesBeingExpanded
        );

        // TODO: make this more specific so just updates descendants
        // of direct parent of composite, as that's the only one that would see
        // replacements as a descendant?
        this.updateDescendantDependencies(
          this._components[compositeName], updatesNeeded, compositesBeingExpanded
        );

      }
    }

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];

      if (component.shadows) {
        let shadowedComponent = this._components[component.shadows.componentName];
        if (shadowedComponent.shadowedBy.length === 1) {
          delete shadowedComponent.shadowedBy;
        } else {
          shadowedComponent.shadowedBy.splice(shadowedComponent.shadowedBy.indexOf(component), 1);
        }
      }

      this.deleteAllDownstreamDependencies({ component });

      this.deleteAllUpstreamDependencies({ component, updatesNeeded });

      if (!updatesNeeded.deletedStateVariables[component.componentName]) {
        updatesNeeded.deletedStateVariables[component.componentName] = [];
      }
      updatesNeeded.deletedStateVariables[component.componentName].push(...Object.keys(component.state))

      updatesNeeded.deletedComponents[component.componentName] = true;
      delete this.unsatisfiedChildLogic[component.componentName];

    }

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];

      // don't use recursive form since all children should already be included
      this.deregisterComponent(component, false);

    }


    // remove deleted components from updatesNeeded arrays
    updatesNeeded.componentsTouched = [... new Set(updatesNeeded.componentsTouched)].filter(x => !(x in componentsToDelete))
    updatesNeeded.compositesToUpdateReplacements = [... new Set(updatesNeeded.compositesToUpdateReplacements)].filter(x => !(x in componentsToDelete))
    updatesNeeded.componentsToUpdateDependencies = updatesNeeded.componentsToUpdateDependencies.filter(x => !(x.componentName in componentsToDelete))

    return {
      success: true,
      deletedComponents: componentsToDelete,
      parentsOfDeleted: allParents,
    };

  }

  determineComponentsToDelete({ components, deleteUpstreamDependencies, componentsToDelete }) {
    for (let component of components) {
      if (component.componentName in componentsToDelete) {
        continue;
      }

      // add unproxied component
      componentsToDelete[component.componentName] = this._components[component.componentName];

      // recurse on allChildren
      let componentsToRecurse = Object.values(component.allChildren).map(x => x.component);

      // if delete an adapter, also delete component it is adapting
      if (component.adaptedFrom !== undefined) {
        componentsToRecurse.push(component.adaptedFrom);
      }

      if (deleteUpstreamDependencies === true) {

        // TODO: recurse on copy of the component (other composites?)

        // recurse on components that shadow
        if (component.shadowedBy) {
          componentsToRecurse.push(...component.shadowedBy);
        }

        // recurse on replacements and adapters
        if (component.adapterUsed) {
          componentsToRecurse.push(component.adapterUsed);
        }
        if (component.replacements) {
          componentsToRecurse.push(...component.replacements);
        }
      }

      this.determineComponentsToDelete({
        components: componentsToRecurse,
        deleteUpstreamDependencies,
        componentsToDelete
      });

    }
  }

  updateCompositeReplacements({ component, componentChanges,
    sourceOfUpdate, updatesNeeded, compositesBeingExpanded }) {

    // TODO: this function is only partially converted to the new system


    // console.log("updateCompositeReplacements " + component.componentName);

    let deletedComponents = {};
    let addedComponents = {};
    let parentsOfDeleted = new Set();

    if (component.shadows) {
      // if shadows, don't update replacements
      // instead, replacements will get updated when shadowed component
      // is updated

      let results = {
        success: true,
        deletedComponents: deletedComponents,
        addedComponents: addedComponents,
        parentsOfDeleted: parentsOfDeleted,
      };

      return results;
    }


    let proxiedComponent = this.components[component.componentName];

    if (!component.replacements) {
      component.replacements = [];
    }

    const replacementChanges = component.constructor.calculateReplacementChanges({
      component: proxiedComponent,
      componentChanges,
      components: this.components,
      workspace: component.replacementsWorkspace,
    });

    // console.log("replacement changes for " + component.componentName);
    // console.log(replacementChanges);
    // console.log(component.replacements.map(x => x.componentName));
    // console.log(component.replacements);
    // console.log(component.unresolvedState);
    // console.log(component.unresolvedDependencies);


    let changedReplacementIdentities = false;

    // iterate through all replacement changes
    for (let change of replacementChanges) {

      if (change.changeType === "add") {

        changedReplacementIdentities = true;

        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        let unproxiedComponent = this._components[component.componentName];
        this.parameterStack.push(unproxiedComponent.sharedParameters, false);


        let newComponents;

        let currentShadowedBy = {
          [component.componentName]: calculateAllComponentsShadowing(component)
        }

        let numberToDelete = change.numberReplacementsToReplace;
        let firstIndex = change.firstReplacementInd;

        if (numberToDelete > 0 && change.changeTopLevelReplacements) {

          // delete replacements before creating new replacements so that can reuse componentNames
          let compositesToDeleteFrom = [component.componentName];

          // gather the name of all shadowing composites, as we'll delete from all their replacements
          if (component.shadowedBy) {
            let getShadowingComponents = function (comp) {
              let shadowingComponents = [];
              if (comp.shadowedBy) {
                for (let shadowingComp of comp.shadowedBy) {
                  shadowingComponents.push(shadowingComp.componentName);
                  shadowingComponents.push(...getShadowingComponents(shadowingComp));
                }
              }
              return shadowingComponents;
            }

            compositesToDeleteFrom.push(...getShadowingComponents(component));

          }

          for (let compositeName of compositesToDeleteFrom) {

            let composite = this._components[compositeName];

            // remove the replacements from composite's replacements
            let replacementsToDelete = composite.replacements.splice(firstIndex, numberToDelete);

            let deleteResults = this.deleteComponents({
              components: replacementsToDelete,
              componentChanges,
              updatesNeeded,
              compositesBeingExpanded,
              // sourceOfUpdate: sourceOfUpdate,
            });


            if (deleteResults.success === false) {
              throw Error("Couldn't delete components on composite update");
            }

            // note: already assigned to addComponents, above
            Object.assign(deletedComponents, deleteResults.deletedComponents);

            for (let parent2 of deleteResults.parentsOfDeleted) {
              parentsOfDeleted.add(parent2.componentName);
            }


          }

        }

        if (change.serializedReplacements) {

          let serializedReplacements = change.serializedReplacements;

          let createResult = this.createIsolatedComponentsSub({
            serializedState: serializedReplacements,
            applySugar: true,
            ancestors: component.ancestors,
            updatesNeeded,
            compositesBeingExpanded,
            createNameContext: component.componentName + "|replacements"
          });

          newComponents = createResult.components;


        } else if (change.replacementsWithInstructions) {

          let serializedReplacementsFromComponent;

          newComponents = this.processReplacementsWithInstructions({
            replacementsWithInstructions: change.replacementsWithInstructions,
            serializedReplacementsFromComponent,
            component,
            updatesNeeded,
            compositesBeingExpanded,
          })

        } else {
          throw Error(`Invalid replacement change.`)
        }

        this.parameterStack.pop();

        let newReplacementsByComposite = {
          [component.componentName]: { newComponents, parent: change.parent }
        }

        if (unproxiedComponent.shadowedBy) {
          let newReplacementsForShadows = this.createShadowedReplacements({
            replacementsToShadow: newComponents,
            componentToShadow: unproxiedComponent,
            parentToShadow: change.parent,
            updatesNeeded,
            compositesBeingExpanded,
            currentShadowedBy,
          });

          Object.assign(newReplacementsByComposite, newReplacementsForShadows)
        }

        for (let compositeName in newReplacementsByComposite) {

          let composite = this._components[compositeName];

          // if composite was just deleted in previous pass of this loop, skip
          if (!composite) {
            continue;
          }

          let newReplacements = newReplacementsByComposite[compositeName].newComponents;

          if (!composite.isExpanded) {
            this.expandCompositeComponent({
              component: composite,
              updatesNeeded,
              compositesBeingExpanded,
            });

            let newChange = {
              changeType: "addedReplacements",
              composite,
              newReplacements: composite.replacements,
              topLevel: true,
              firstIndex: 0,
              numberDeleted: 0
            };

            componentChanges.push(newChange);

            continue;
          }

          for (let comp of newReplacements) {
            addedComponents[comp.componentName] = comp;

            // TODO: used to checkForDownstreamDependencies here
            // Is this needed for new system?
          }

          if (change.changeTopLevelReplacements === true) {

            let parent = this._components[composite.parentName];

            // splice in new replacements
            composite.replacements.splice(firstIndex, 0, ...newReplacements);

            // record for top level replacement that they are a replacement of composite
            for (let comp of newReplacements) {
              comp.replacementOf = composite;
            }

            let newChange = {
              changeType: "addedReplacements",
              composite,
              newReplacements,
              topLevel: true,
              firstIndex: firstIndex,
              numberDeleted: numberToDelete
            };

            componentChanges.push(newChange);

            this.processNewDefiningChildren({
              parent,
              updatesNeeded,
              compositesBeingExpanded
            });

            updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));

            this.applySugarOrAddSugarCreationStateVariables({
              component: parent,
              updatesNeeded,
              compositesBeingExpanded,
            });

            // TODO: do we need to do anything if applySugar returns varsUnresolved?

          } else {
            // if not top level replacements

            // TODO: check if change.parent is appropriate dependency of composite?

            let parent = this._components[newReplacementsByComposite[compositeName].parent.componentName];

            this.spliceChildren(parent, change.indexOfDefiningChildren, newReplacements);

            this.processNewDefiningChildren({ parent, updatesNeeded, compositesBeingExpanded });

            newReplacements.forEach(x => addedComponents[x.componentName] = x);

            updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));

            this.applySugarOrAddSugarCreationStateVariables({
              component: parent,
              updatesNeeded,
              compositesBeingExpanded,
            });

            // TODO: do we need to do anything if applySugar returns varsUnresolved?

            let newChange = {
              changeType: "addedReplacements",
              composite,
              newReplacements,
            };

            componentChanges.push(newChange);

          }
        }

      } else if (change.changeType === "delete") {

        changedReplacementIdentities = true;

        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        this.deleteReplacementsFromShadowsThenComposite({
          change, composite: component,
          componentsToDelete: change.components,
          componentChanges, sourceOfUpdate,
          parentsOfDeleted, deletedComponents, addedComponents,
          updatesNeeded,
          compositesBeingExpanded,
        });


      } else if (change.changeType === "moveDependency") {

        // TODO: this is not converted to new system
        throw Error('moveDependency not implemented');

      } else if (change.changeType === "addDependency") {

        // TODO: this is not converted to new system
        throw Error('addDependency not implemented');

      } else if (change.changeType === "updateStateVariables") {


        // TODO: check if component is appropriate dependency of composite

        updatesNeeded.componentsTouched.push(change.component.componentName);

        let workspace = {};
        let newStateVariableValues = {};
        for (let stateVariable in change.stateChanges) {
          let instruction = {
            componentName: change.component.componentName,
            stateVariable,
            value: change.stateChanges[stateVariable],
            overrideFixed: true
          }

          this.requestComponentChanges({
            instruction, initialChange: false, workspace, updatesNeeded,
            newStateVariableValues,
          });
        }

        this.processNewStateVariableValues(newStateVariableValues, updatesNeeded);


      } else if (change.changeType === "changeReplacementsToWithhold") {

        // don't change actual array of replacements
        // but just change those that will get added to activeChildren

        changedReplacementIdentities = true;

        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        this.processChildChangesAndRecurseToShadows({ component, updatesNeeded, compositesBeingExpanded });

      }

    }

    if (changedReplacementIdentities) {
      this.updateReplacementDependencies(component, updatesNeeded, compositesBeingExpanded);

      // TODO: make this more specific so just updates descendants
      // of direct parent of composite, as that's the only one that would see
      // replacements as a descendant?
      this.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

    }

    let results = {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
      parentsOfDeleted: parentsOfDeleted,
    };

    return results;

  }

  deleteReplacementsFromShadowsThenComposite({
    change, composite, componentsToDelete,
    componentChanges, sourceOfUpdate,
    parentsOfDeleted, deletedComponents, addedComponents,
    updatesNeeded,
    compositesBeingExpanded
  }) {

    if (!composite.isExpanded) {
      return;
    }

    if (composite.shadowedBy) {
      for (let shadowingComposite of composite.shadowedBy) {

        let shadowingComponentsToDelete;

        if (componentsToDelete) {
          shadowingComponentsToDelete = [];
          for (let compToDelete of componentsToDelete) {
            let shadowingCompToDelete;
            if (compToDelete.shadowedBy) {
              for (let cShadow of compToDelete.shadowedBy) {
                if (cShadow.shadows.compositeName === shadowingComposite.shadows.compositeName) {
                  shadowingCompToDelete = cShadow;
                  break;
                }
              }
            }
            if (!shadowingCompToDelete) {
              console.error(`could not find shadowing component of ${compToDelete.componentName}`)
            } else {
              shadowingComponentsToDelete.push(shadowingCompToDelete);
            }
          }

        }

        this.deleteReplacementsFromShadowsThenComposite({
          change,
          composite: shadowingComposite,
          componentsToDelete: shadowingComponentsToDelete,
          componentChanges, sourceOfUpdate,
          parentsOfDeleted, deletedComponents, addedComponents,
          updatesNeeded,
          compositesBeingExpanded
        })
      }
    }

    if (change.changeTopLevelReplacements === true) {
      let firstIndex = change.firstReplacementInd;
      let numberToDelete = change.numberReplacementsToDelete;
      let replacementsToDelete = composite.replacements.slice(firstIndex, firstIndex + numberToDelete);
      // delete from replacements
      composite.replacements.splice(firstIndex, numberToDelete);

      // TODO: why does this delete delete upstream components
      // but the non toplevel delete doesn't?
      let deleteResults = this.deleteComponents({
        components: replacementsToDelete,
        componentChanges: componentChanges,
        sourceOfUpdate: sourceOfUpdate,
        updatesNeeded,
      });

      if (deleteResults.success === false) {
        throw Error("Couldn't delete components on composite update");
      }
      for (let parent of deleteResults.parentsOfDeleted) {
        parentsOfDeleted.add(parent.componentName);
        updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));
      }
      let deletedNamesByParent = {};
      for (let compName in deleteResults.deletedComponents) {
        let comp = deleteResults.deletedComponents[compName];
        let par = comp.parentName;
        if (deletedNamesByParent[par] === undefined) {
          deletedNamesByParent[par] = [];
        }
        deletedNamesByParent[par].push(compName);
      }
      let newChange = {
        changeType: "deletedReplacements",
        composite,
        topLevel: true,
        firstIndex: firstIndex,
        numberDeleted: numberToDelete,
        deletedNamesByParent: deletedNamesByParent,
        deletedComponents: deleteResults.deletedComponents,
      };
      componentChanges.push(newChange);
      Object.assign(deletedComponents, deleteResults.deletedComponents);
      let parent = this._components[composite.parentName];
      updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));
    }
    else {
      // if not change top level replacements
      let numberToDelete = componentsToDelete.length;
      // TODO: check if components are appropriate dependency of composite
      let deleteResults = this.deleteComponents({
        components: componentsToDelete,
        deleteUpstreamDependencies: false,
        componentChanges: componentChanges,
        sourceOfUpdate: sourceOfUpdate,
        updatesNeeded,
        compositesBeingExpanded
      });
      if (deleteResults.success === false) {
        throw Error("Couldn't delete components prescribed by composite");
      }
      for (let parent of deleteResults.parentsOfDeleted) {
        parentsOfDeleted.add(parent.componentName);
        updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));
      }
      let deletedNamesByParent = {};
      for (let compName in deleteResults.deletedComponents) {
        let comp = deleteResults.deletedComponents[compName];
        let par = comp.parentName;
        if (deletedNamesByParent[par] === undefined) {
          deletedNamesByParent[par] = [];
        }
        deletedNamesByParent[par].push(compName);
      }
      let newChange = {
        changeType: "deletedReplacements",
        composite,
        numberDeleted: numberToDelete,
        deletedNamesByParent: deletedNamesByParent,
        deletedComponents: deleteResults.deletedComponents,
      };
      componentChanges.push(newChange);
      Object.assign(deletedComponents, deleteResults.deletedComponents);
      Object.assign(addedComponents, deleteResults.addedComponents);
    }
  }

  processChildChangesAndRecurseToShadows({ component, updatesNeeded, compositesBeingExpanded }) {
    let parent = this._components[component.parentName];
    this.processNewDefiningChildren({
      parent,
      applySugar: true,
      updatesNeeded,
      compositesBeingExpanded
    });
    updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));

    if (component.shadowedBy) {
      for (let shadowingComponent of component.shadowedBy) {
        this.processChildChangesAndRecurseToShadows({
          component: shadowingComponent,
          updatesNeeded,
          compositesBeingExpanded
        })
      }
    }
  }

  createShadowedReplacements({
    replacementsToShadow,
    componentToShadow,
    parentToShadow,
    updatesNeeded,
    compositesBeingExpanded,
    currentShadowedBy,
  }) {

    let newShadowedBy = calculateAllComponentsShadowing(componentToShadow);

    if (!currentShadowedBy[componentToShadow.componentName] ||
      !newShadowedBy.every(
        x => currentShadowedBy[componentToShadow.componentName].includes(x)
      )
    ) {
      // If components shadowing componentToShadow increased
      // that means it is shadowed by one of its newly created replacements
      // so we have a circular reference
      throw Error(`circular reference involving ${componentToShadow.componentName}`);
    }

    // use compositesBeingExpanded to look for circular dependence
    compositesBeingExpanded.push(componentToShadow.componentName);

    let newComponentsForShadows = {};

    for (let shadowingComponent of componentToShadow.shadowedBy) {

      if (compositesBeingExpanded.includes(shadowingComponent.componentName)) {
        throw Error(`circular dependence involving ${shadowingComponent.componentName}`)
      }

      if (shadowingComponent.shadowedBy) {
        currentShadowedBy[shadowingComponent.componentName] = calculateAllComponentsShadowing(shadowingComponent);
      }


      if (shadowingComponent.isExpanded) {

        let newSerializedReplacements = replacementsToShadow.map(x => x.serialize({ forCopy: true }))
        newSerializedReplacements = postProcessCopy({
          serializedComponents: newSerializedReplacements,
          componentName: shadowingComponent.shadows.compositeName
        });

        let newComponents;

        let createResult = this.createIsolatedComponentsSub({
          serializedState: newSerializedReplacements,
          applySugar: true,
          ancestors: shadowingComponent.ancestors,
          updatesNeeded,
          compositesBeingExpanded,
          createNameContext: shadowingComponent.componentName + "|replacements"
        });

        newComponents = createResult.components;

        let shadowingParent;
        if (parentToShadow) {
          if (parentToShadow.shadowedBy) {
            for (let pShadow of parentToShadow.shadowedBy) {
              if (pShadow.shadows.compositeName === shadowingComponent.shadows.compositeName) {
                shadowingParent = pShadow;
                break;
              }
            }
          }
          if (!shadowingParent) {
            console.error(`could not find shadowing parent of ${parentToShadow.componentName}`)
          }
        }

        newComponentsForShadows[shadowingComponent.componentName] = {
          newComponents,
          parent: shadowingParent
        };

        if (shadowingComponent.shadowedBy) {
          let recursionComponents = this.createShadowedReplacements({
            replacementsToShadow: newComponents,
            componentToShadow: shadowingComponent,
            parentToShadow: shadowingParent,
            updatesNeeded,
            compositesBeingExpanded,
            currentShadowedBy,
          })
          Object.assign(newComponentsForShadows, recursionComponents);
        }
      }
    }

    // record that are finished expanding the composite
    let targetInd = compositesBeingExpanded.indexOf(componentToShadow.componentName);
    if (targetInd === -1) {
      throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
    }
    compositesBeingExpanded.splice(targetInd, 1)

    return newComponentsForShadows;

  }

  adjustReplacementsToWithhold(component, change, componentChanges) {
    let changeInReplacementsToWithhold;
    if (component.replacementsToWithhold !== undefined) {
      changeInReplacementsToWithhold = change.replacementsToWithhold - component.replacementsToWithhold;
    }
    else {
      changeInReplacementsToWithhold = change.replacementsToWithhold;
    }
    if (changeInReplacementsToWithhold < 0) {
      // Note: don't subtract one of this last ind, as slice doesn't include last ind
      let lastIndToStopWithholding = component.replacements.length - change.replacementsToWithhold;
      let firstIndToStopWithholding = component.replacements.length - change.replacementsToWithhold + changeInReplacementsToWithhold;
      let newReplacements = component.replacements.slice(firstIndToStopWithholding, lastIndToStopWithholding);
      let newChange = {
        changeType: "addedReplacements",
        composite: component,
        topLevel: true,
        newReplacements: newReplacements,
        firstIndex: firstIndToStopWithholding,
        numberDeleted: 0,
      };
      componentChanges.push(newChange);
    }
    else if (changeInReplacementsToWithhold > 0) {
      let firstIndToStartWithholding = component.replacements.length - change.replacementsToWithhold;
      let lastIndToStartWithholding = firstIndToStartWithholding + changeInReplacementsToWithhold;
      let withheldReplacements = component.replacements.slice(firstIndToStartWithholding, lastIndToStartWithholding);
      let withheldNamesByParent = {};
      for (let comp of withheldReplacements) {
        let par = comp.parentName;
        if (withheldNamesByParent[par] === undefined) {
          withheldNamesByParent[par] = [];
        }
        withheldNamesByParent[par].push(comp.componentName);
      }
      let newChange = {
        changeType: "deletedReplacements",
        composite: component,
        topLevel: true,
        firstIndex: firstIndToStartWithholding,
        numberDeleted: changeInReplacementsToWithhold,
        deletedNamesByParent: withheldNamesByParent,
        deletedComponents: withheldReplacements,
      };
      componentChanges.push(newChange);
    }
    component.replacementsToWithhold = change.replacementsToWithhold;

    if (component.shadowedBy) {
      for (let shadowingComponent of component.shadowedBy) {
        this.adjustReplacementsToWithhold(shadowingComponent, change, componentChanges);
      }
    }

  }

  get standardComponentClasses() {
    return new Proxy(this._standardComponentClasses, readOnlyProxyHandler);
  }

  set standardComponentClasses(value) {
    return null;
  }

  get allComponentClasses() {
    return new Proxy(this._allComponentClasses, readOnlyProxyHandler);
  }

  set allComponentClasses(value) {
    return null;
  }

  isInheritedComponentType({ inheritedComponentType, baseComponentType }) {
    if (inheritedComponentType === baseComponentType) {
      return true;
    }
    return this.allComponentClasses[baseComponentType].isPrototypeOf(
      this.allComponentClasses[inheritedComponentType]
    );
  }

  get componentTypesTakingComponentNames() {
    return new Proxy(this._componentTypesTakingComponentNames, readOnlyProxyHandler);
  }

  set componentTypesTakingComponentNames(value) {
    return null;
  }

  get componentTypesCreatingVariants() {
    return new Proxy(this._componentTypesCreatingVariants, readOnlyProxyHandler);
  }

  set componentTypesCreatingVariants(value) {
    return null;
  }

  get componentTypeWithPotentialVariants() {
    return new Proxy(this._componentTypeWithPotentialVariants, readOnlyProxyHandler);
  }

  set componentTypeWithPotentialVariants(value) {
    return null;
  }

  get allPossibleProperties() {
    return new Proxy(this._allPossibleProperties, readOnlyProxyHandler);
  }

  set allPossibleProperties(value) {
    return null;
  }

  createAllPossibleProperties() {
    let allPossibleProperties = new Set([]);
    for (let componentType in this.allComponentClasses) {
      let componentClass = this.allComponentClasses[componentType];

      let properties = componentClass.createPropertiesObject({
        standardComponentClasses: this.standardComponentClasses
      });
      for (let propertyName in properties) {
        if (propertyName.toLowerCase() in this.standardComponentClasses) {
          allPossibleProperties.add(propertyName);
        }
      }
    }
    return [...allPossibleProperties]; // convert to array
  }

  get components() {
    return new Proxy(this._components, readOnlyProxyHandler);
  }

  set components(value) {
    return null;
  }

  requestAction({ componentName, actionName, args }) {
    let component = this.components[componentName];
    if (component && component.actions) {
      let action = component.actions[actionName];
      if (action) {
        return action(args);
      }
    }
    console.warn(`Cannot run action ${actionName} on component ${componentName}`);
  }

  requestUpdate({ updateInstructions, transient = false }) {

    let updatesNeeded = {
      componentsTouched: [],
      compositesToExpand: new Set([]),
      compositesToUpdateReplacements: [],
      componentsToUpdateDependencies: [],
      unresolvedDependencies: {},
      unresolvedByDependent: {},
      deletedStateVariables: {},
      deletedComponents: {},
      itemScoreChanges: new Set(),
    }


    let newStateVariableValues = {};
    let sourceInformation = {};
    let workspace = {};

    for (let instruction of updateInstructions) {

      let componentSourceInformation = sourceInformation[instruction.componentName];
      if (!componentSourceInformation) {
        componentSourceInformation = sourceInformation[instruction.componentName] = {};
      }

      if (instruction.sourceInformation) {
        Object.assign(componentSourceInformation, instruction.sourceInformation);
      }

      if (instruction.updateType === "updateValue") {

        this.requestComponentChanges({
          instruction, workspace,
          updatesNeeded,
          newStateVariableValues
        });

      } else if (instruction.updateType === "addComponents") {
        console.log("add component")
        // this.addComponents({
        //   serializedComponents: instruction.serializedComponents,
        //   parent: instruction.parent,
        //   updatesNeeded,
        // })
      } else if (instruction.updateType === "deleteComponents") {
        console.log("delete component")
      } else if (instruction.updateType === "executeUpdate") {
        // this should be used only if further updates depend on having all
        // state variables updated,
        // i.e., the subsequent inverse definitions use stateValues
        // in their calculations that need to be updated
        this.executeUpdateStateVariables({
          newStateVariableValues,
          updatesNeeded,
          preliminary: true,
        });
      }

    }

    //TODO: Inside for loop?
    if (this.externalFunctions.localStateChanged) {
      // TODO: make this call asynchronous
      this.externalFunctions.localStateChanged({
        newStateVariableValues,
        contentId: this.contentId,
        sourceOfUpdate: {
          sourceInformation
        },
        transient,
      });
    }


    //TODO: Inside for loop?
    this.executeUpdateStateVariables({
      newStateVariableValues,
      updatesNeeded,
      sourceOfUpdate: {
        sourceInformation,
        local: true,
      }
    });

    if (this.externalFunctions.submitResponse) {
      for (let itemNumber of updatesNeeded.itemScoreChanges) {
        this.externalFunctions.submitResponse({
          itemNumber,
          itemCreditAchieved: this.document.stateValues.itemScores[itemNumber],
          callBack: this.submitResponseCallBack,
        });
      }
    }

    // evalute itemScores so that will be fresh
    // and can detect changes when it is marked stale
    this.document.stateValues.itemScores;

    return { success: true };
  }

  executeUpdateStateVariables({
    newStateVariableValues,
    updatesNeeded,
    sourceOfUpdate,
    preliminary = false
  }) {


    let compositesBeingExpanded = [];

    // merge keys of newStateVariableValues into changedStateVariables
    for (let cName in newStateVariableValues) {
      if (this.changedStateVariables[cName]) {
        // add all keys of newStateVariableValues[cName] to this.changedStateVariables[cName]
        let changedSvs = this.changedStateVariables[cName];
        Object.keys(newStateVariableValues[cName]).forEach(changedSvs.add, changedSvs);
      } else {
        // create new set from scratch if don't have old changed state variables
        this.changedStateVariables[cName] = new Set(Object.keys(newStateVariableValues[cName]));
      }

    }


    // if executeUpdateStateVariables is called from an external source
    // then it may not have updatesNeeded initialized
    if (updatesNeeded === undefined) {
      updatesNeeded = {
        componentsTouched: Object.keys(newStateVariableValues),
        compositesToExpand: new Set([]),
        compositesToUpdateReplacements: [],
        componentsToUpdateDependencies: [],
        unresolvedDependencies: {},
        unresolvedByDependent: {},
        deletedStateVariables: {},
        deletedComponents: {},
        itemScoreChanges: new Set(),
      }
    }

    let previousUnsatisfiedChildLogic = Object.assign({}, this.unsatisfiedChildLogic);

    this.processNewStateVariableValues(newStateVariableValues, updatesNeeded);

    // calculate any replacement changes on composites touched
    this.replacementChangesFromCompositesToUpdate({ updatesNeeded, compositesBeingExpanded });

    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      updatesNeeded.unresolvedMessage = "";
      this.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
    }


    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      console.log("have some unresolved");
      console.log(updatesNeeded.unresolvedDependencies);
      console.log(updatesNeeded.unresolvedByDependent);
      throw Error(`Have unresolved dependencies after executing update state variables.  How should we handle this?`)
    }

    if (Object.keys(this.unsatisfiedChildLogic).length > 0) {
      let childLogicMessage = "";
      let newUnsatisfiedChildLogic = false;
      for (let componentName in this.unsatisfiedChildLogic) {
        childLogicMessage += `Invalid children for ${componentName}: ${this.unsatisfiedChildLogic[componentName].message} `;
        if (!(componentName in previousUnsatisfiedChildLogic)) {
          newUnsatisfiedChildLogic = true;
        }
      }
      if (newUnsatisfiedChildLogic) {
        console.error('Have unresolved child logic after execute update state variables')
        console.error(childLogicMessage);
      }
    }


    this.updateDependencies(updatesNeeded, compositesBeingExpanded);


    // if preliminary, we don't update renderer instructions or display information
    if (preliminary) {
      return;
    }

    // get unique list of components touched
    updatesNeeded.componentsTouched = [...new Set(updatesNeeded.componentsTouched)];

    this.updateRendererInstructions({ componentNames: updatesNeeded.componentsTouched, sourceOfUpdate });

    this.finishUpdate();

    if (Object.keys(this.unsatisfiedChildLogic).length > 0) {
      let childLogicMessage = "";
      for (let componentName in this.unsatisfiedChildLogic) {
        childLogicMessage += `Invalid children for ${componentName}: ${this.unsatisfiedChildLogic[componentName].message} `;
      }
      console.warn(childLogicMessage)
    }


    console.log("**** Components after updateValue");
    console.log(this._components);

    // if (sourceOfUpdate !== undefined && sourceOfUpdate.instructionsByComponent !== undefined) {
    //   let updateKeys = Object.keys(sourceOfUpdate.instructionsByComponent);
    //   if (updateKeys.length === 1 && updateKeys[0] === this.documentName) {
    //     saveSerializedStateImmediately = true;
    //   }
    // }


    // TODO: implement saving serialized state

    // if (saveSerializedState) {
    //   if (saveSerializedStateImmediately) {
    //     this.externalFunctions.saveSerializedState({
    //       document: this.components[this.documentName],
    //       contentId: this.contentId,
    //     })
    //   } else {
    //     this.externalFunctions.delayedSaveSerializedState({'
    //       document: this.components[this.documentName],
    //       contentId: this.contentId,
    //     })
    //   }
    // }

  }

  replacementChangesFromCompositesToUpdate({
    updatesNeeded, compositesBeingExpanded
  }) {

    let compositesToUpdateReplacements = [...new Set(updatesNeeded.compositesToUpdateReplacements)];
    updatesNeeded.compositesToUpdateReplacements = [];

    let compositesNotReady = [];

    let componentChanges = []; // TODO: what to do with componentChanges?
    while (compositesToUpdateReplacements.length > 0) {
      for (let cName of compositesToUpdateReplacements) {
        let composite = this._components[cName];
        if (composite instanceof this.allComponentClasses._composite
          && composite.isExpanded
        ) {

          if (composite.state.readyToExpand.isResolved) {
            let result = this.updateCompositeReplacements({
              component: composite,
              componentChanges,
              updatesNeeded,
              compositesBeingExpanded
            });

            for (let componentName in result.addedComponents) {
              this.changedStateVariables[componentName] = new Set(Object.keys(this._components[componentName].state));
            }
          } else {
            compositesNotReady.push(cName)
          }
        }
      }
      // Is it possible that could ever get an infinite loop here?
      // I.e., is there some type of circular dependence among composites
      // that could happen and we aren't detecting?
      // Note: have encountered cases where a composite must be updated twice
      // in this loop
      // Note 2: if we don't update a composite here, the state variable indicating
      // its replacements need updating may remain stale, which will
      // prevent futher changes from being triggered
      compositesToUpdateReplacements = [...new Set(updatesNeeded.compositesToUpdateReplacements)];
      updatesNeeded.compositesToUpdateReplacements = [];

    }

    updatesNeeded.compositesToUpdateReplacements = compositesNotReady;

    return { componentChanges };
  }

  processNewStateVariableValues(newStateVariableValues, updatesNeeded) {

    // console.log('process new state variable values')
    // console.log(newStateVariableValues);

    let getStateVar = this.getStateVariableValue;

    for (let cName in newStateVariableValues) {
      let comp = this._components[cName];

      if (comp === undefined) {
        console.warn(`can't update state variables of component ${cName}, as it doesn't exist.`);
        continue;
      }

      let newComponentStateVariables = newStateVariableValues[cName];

      for (let vName in newComponentStateVariables) {


        let compStateObj = comp.state[vName];
        if (compStateObj === undefined) {
          console.warn(`can't update state variable ${vName} of component ${cName}, as it doesn't exist.`);
          continue;
        }
        // get value of state variable so it will determine if essential
        compStateObj.value;

        compStateObj._previousValue = compStateObj.value;

        if (compStateObj.isArray) {

          let arrayEntryNamesAffected = [];

          if (Array.isArray(newComponentStateVariables[vName])) {

            throw Error(`do we still want to support setting entire array in inverse direction? ${vName}, ${cName}`)
            // if given an array, then set entire array to that value
            // Note don't check or change array size here
            if (compStateObj.set) {
              compStateObj.value = compStateObj.arrayValues = compStateObj.set(newComponentStateVariables[vName]);
            } else {
              compStateObj.value = compStateObj.arrayValues = newComponentStateVariables[vName];
            }

            // since changed entire array, all entry names are affected
            if (compStateObj.arrayEntryNames) {
              arrayEntryNamesAffected = compStateObj.arrayEntryNames;
            }

          } else {
            // since were not given array,
            // newComponentStateVariables[vName] must be an object keyed on arrayKeys
            // except that it will have mergeObject=true
            // to tell external functions new attributes of the object
            // should be merged into the old object

            let varNamesStateVar = compStateObj.varNamesIncludingArrayKeyStateVariable;

            // TODO: what about a .set function here?
            for (let arrayKey in newComponentStateVariables[vName]) {

              if (arrayKey === "mergeObject") {
                continue;
              }

              if (!(
                compStateObj.essential ||
                (compStateObj.essentialByArrayKey && compStateObj.essentialByArrayKey[arrayKey])
              )) {
                console.warn(`can't update arrayKey ${arrayKey}  of state variable ${vName} of component ${cName}, as it is not an essential state variable.`);
                continue;
              }

              compStateObj.setArrayValue({
                value: newComponentStateVariables[vName][arrayKey],
                arrayKey,
                arraySize: compStateObj.arraySize
              });

              // mark any array entry state variables containing arrayKey
              // as affected
              let varNamesContainingArrayKey = comp.stateValues[varNamesStateVar][arrayKey];
              if (varNamesContainingArrayKey) {
                arrayEntryNamesAffected.push(...varNamesContainingArrayKey);
              }


            }
          }

          for (let arrayEntryName of arrayEntryNamesAffected) {

            let entryStateVarObj = comp.state[arrayEntryName];

            // is array entry was fresh, mark it stale
            if (!(Object.getOwnPropertyDescriptor(entryStateVarObj, 'value').get || entryStateVarObj.immutable)) {
              entryStateVarObj._previousValue = entryStateVarObj.value;
              delete entryStateVarObj.value;
              Object.defineProperty(entryStateVarObj, 'value', { get: () => getStateVar({ component: comp, stateVariable: arrayEntryName }), configurable: true });
            }

            this.markUpstreamDependentsStale({
              component: comp, varName: arrayEntryName, updatesNeeded
            });
            this.recordActualChangeInUpstreamDependencies({
              component: comp, varName: arrayEntryName,
            })
          }
        } else {

          // don't have array

          if (!compStateObj.essential) {
            console.warn(`can't update state variable ${vName} of component ${cName}, as it is not an essential state variable.`);
            continue;
          }

          if (compStateObj.set) {
            compStateObj.value = compStateObj.set(newComponentStateVariables[vName]);
          } else {
            compStateObj.value = newComponentStateVariables[vName];
          }
        }
        this.markUpstreamDependentsStale({
          component: comp, varName: vName, updatesNeeded
        });

        this.recordActualChangeInUpstreamDependencies({
          component: comp, varName: vName,
        })

      }
    }

  }

  requestComponentChanges({ instruction, initialChange = true, workspace, updatesNeeded,
    newStateVariableValues
  }) {

    // console.log(`request component changes`);
    // console.log(instruction);
    // console.log('overall workspace')
    // console.log(JSON.parse(JSON.stringify(workspace)))

    let component = this._components[instruction.componentName];

    let stateVariable = this.substituteAliases({
      stateVariables: [instruction.stateVariable],
      componentClass: component.constructor
    })[0];

    if (workspace[instruction.componentName] === undefined) {
      workspace[instruction.componentName] = {};
    }
    let componentWorkspace = workspace[instruction.componentName];

    let inverseDefinitionArgs = this.getStateVariableDependencyValues({ component, stateVariable });
    inverseDefinitionArgs.componentInfoObjects = this.componentInfoObjects;
    inverseDefinitionArgs.initialChange = initialChange;
    inverseDefinitionArgs.stateValues = component.stateValues;
    inverseDefinitionArgs.overrideFixed = instruction.overrideFixed;
    inverseDefinitionArgs.shadowedVariable = instruction.shadowedVariable;

    let stateVarObj = component.state[stateVariable];

    let stateVariableForWorkspace = stateVariable;

    if (stateVarObj.isArrayEntry) {
      let arrayStateVariable = stateVarObj.arrayStateVariable;
      stateVariableForWorkspace = arrayStateVariable;

      if (stateVarObj.entireArrayAtOnce) {
        // if have entireArrayAtOnce, we didn't add arrayKeys
        // in getStateVariableDependencyValues
        // because, in the forward direction, we don't know arrayKeys ahead of time
        // So, add then manually now
        inverseDefinitionArgs.arrayKeys = stateVarObj.arrayKeys;
      }

      let desiredValuesForArray = {};
      if (inverseDefinitionArgs.arrayKeys.length === 1) {
        if ("value" in instruction) {
          desiredValuesForArray[inverseDefinitionArgs.arrayKeys[0]] = instruction.value
        } else if ("valueOfStateVariable" in instruction) {
          let otherStateVariable = this.substituteAliases({
            stateVariables: [instruction.valueOfStateVariable],
            componentClass: component.constructor
          })[0];
          let sObj = component.state[otherStateVariable];
          if (sObj) {
            desiredValuesForArray[inverseDefinitionArgs.arrayKeys[0]] = sObj.value
          } else {
            throw Error(`Invalid instruction to change ${instruction.stateVariable} of ${instruction.componentName}, value of state variable ${instruction.valueOfStateVariable} not found.`)
          }
        }
      } else {
        for (let [ind, arrayKey] of inverseDefinitionArgs.arrayKeys.entries()) {
          desiredValuesForArray[arrayKey] = instruction.value[ind];
        }
      }
      inverseDefinitionArgs.desiredStateVariableValues = { [arrayStateVariable]: desiredValuesForArray };

    } else {
      if ("value" in instruction) {
        inverseDefinitionArgs.desiredStateVariableValues = { [stateVariable]: instruction.value };
      } else if ("valueOfStateVariable" in instruction) {
        let otherStateVariable = this.substituteAliases({
          stateVariables: [instruction.valueOfStateVariable],
          componentClass: component.constructor
        })[0];
        let sObj = component.state[otherStateVariable];
        if (sObj) {
          inverseDefinitionArgs.desiredStateVariableValues = { [stateVariable]: sObj.value };
        } else {
          throw Error(`Invalid instruction to change ${instruction.stateVariable} of ${instruction.componentName}, value of state variable ${instruction.valueOfStateVariable} not found.`)
        }
      }
    }



    let stateVariableWorkspace = componentWorkspace[stateVariableForWorkspace];
    if (stateVariableWorkspace === undefined) {
      stateVariableWorkspace = componentWorkspace[stateVariableForWorkspace] = {};
    }

    if (stateVarObj.additionalStateVariablesDefined) {
      // combine workspaces of additional state varibles into one
      for (let varName2 of stateVarObj.additionalStateVariablesDefined) {

        let stateVariableForWorkspace2 = varName2;
        let stateVarObj2 = component.state[varName2];
        if (stateVarObj2.isArray) {
          stateVariableForWorkspace2 = stateVarObj.arrayStateVariable;
        }
        let stateVariableWorkspace2 = componentWorkspace[stateVariableForWorkspace2];
        if (stateVariableWorkspace2) {
          Object.assign(stateVariableWorkspace, stateVariableWorkspace2);
          componentWorkspace[stateVariableForWorkspace2] = stateVariableWorkspace;
        }
      }
    }

    inverseDefinitionArgs.workspace = stateVariableWorkspace;


    if (instruction.additionalStateVariableValues) {
      for (let varName2 in instruction.additionalStateVariableValues) {
        if (!stateVarObj.additionalStateVariablesDefined.includes(varName2)) {
          console.warn(`Can't invert ${varName2} at the same time as ${stateVariable}, as not an additional state variable defined`);
          continue;
        }
        // Note: don't check if varName2 is an array
        // Haven't implemented changing an array as an additional state variable value
        inverseDefinitionArgs.desiredStateVariableValues[varName2] = instruction.additionalStateVariableValues[varName2];
      }
    }


    updatesNeeded.componentsTouched.push(component.componentName);

    if (!stateVarObj.inverseDefinition) {
      console.warn(`Cannot change state variable ${stateVariable} of ${component.componentName} as it doesn't have an inverse definition`);
      return;
    }

    if (component.stateValues.fixed && !instruction.overrideFixed) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed because fixed is true.`);
      return;
    }

    if (!(initialChange || component.stateValues.modifyIndirectly !== false)) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed because modifyIndirectly is false.`);
      return;
    }

    let inverseResult = stateVarObj.inverseDefinition(inverseDefinitionArgs);

    if (!inverseResult.success) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed.`);
      return;
    }

    // console.log("inverseResult");
    // console.log(inverseResult);

    // Note: we reverse order of instructions so that the first instructions
    // (which will correspond to the first children)
    // will have precendence
    for (let newInstruction of inverseResult.instructions.reverse()) {
      if (newInstruction.setStateVariable) {
        // if (newInstruction.setStateVariable !== stateVariable) {
        //   throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: specified changing value of ${newInstruction.setStateVariable}, which is not state variable itself.`);
        // }
        // if (!(component.state[stateVariable].essential || newInstruction.allowNonEssential)) {
        //   throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: can't set its value if it is not essential.`);
        // }

        if (!newStateVariableValues[component.componentName]) {
          newStateVariableValues[component.componentName] = {};
        }

        if (component.state[newInstruction.setStateVariable].isArray) {
          if (!newStateVariableValues[component.componentName][newInstruction.setStateVariable]) {
            // include key mergeObject to let external functions
            // know that new attributes of the object
            // should be merged into the old object
            newStateVariableValues[component.componentName][newInstruction.setStateVariable] = {
              mergeObject: true
            }
          }

          Object.assign(
            newStateVariableValues[component.componentName][newInstruction.setStateVariable],
            newInstruction.value
          )

        } else {
          newStateVariableValues[component.componentName][newInstruction.setStateVariable] = newInstruction.value;
        }

      } else if (newInstruction.setDependency) {
        let dependencyName = newInstruction.setDependency;

        let dep = this.downstreamDependencies[component.componentName][stateVariable][dependencyName];

        if (dep.dependencyType === "childStateVariables") {
          let cName = dep.downstreamComponentNames[newInstruction.childIndex];
          if (!cName) {
            throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`)
          }
          let varName = dep.mappedDownstreamVariableNamesByComponent[newInstruction.childIndex][newInstruction.variableIndex];
          if (!varName) {
            throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist.`)
          }
          let inst = {
            componentName: cName,
            stateVariable: varName,
            value: newInstruction.desiredValue,
            overrideFixed: instruction.overrideFixed,
            arrayKey: newInstruction.arrayKey,
          }
          this.requestComponentChanges({
            instruction: inst, initialChange: false, workspace, updatesNeeded,
            newStateVariableValues
          });
        } else if (["componentStateVariable", "stateVariable", "parentStateVariable"].includes(dep.dependencyType)) {
          let inst = {
            componentName: dep.downstreamComponentName,
            stateVariable: dep.mappedDownstreamVariableName,
            value: newInstruction.desiredValue,
            overrideFixed: instruction.overrideFixed,
            arrayKey: newInstruction.arrayKey,
            shadowedVariable: newInstruction.shadowedVariable,
          };
          if (newInstruction.additionalDependencyValues) {
            // it is possible to simultaneously set the values of multiple
            // component state variables, if they share a definition
            // i.e. are in additionalStateVariablesDefined

            let stateVarObj = this.components[dep.downstreamComponentName].state[dep.mappedDownstreamVariableName]
            for (let dependencyName2 in newInstruction.additionalDependencyValues) {
              let dep2 = this.downstreamDependencies[component.componentName][stateVariable][dependencyName2];
              if (!["componentStateVariable", "stateVariable", "parentStateVariable"].includes(dep2.dependencyType)) {
                console.warn(`Can't simultaneously set additional dependency value ${dependencyName2} if it isn't a state variable`);
                continue;
              }

              let varName2 = dep2.mappedDownstreamVariableName;
              if (dep2.downstreamComponentName !== dep.downstreamComponentName ||
                !stateVarObj.additionalStateVariablesDefined.includes(varName2)
              ) {
                console.warn(`Can't simultaneously set additional dependency value ${dependencyName2} if it doesn't correspond to additional state variable defined of ${dependencyName}'s state variable`);
                continue;
              }
              if (!inst.additionalStateVariableValues) {
                inst.additionalStateVariableValues = {};
              }
              inst.additionalStateVariableValues[varName2] = newInstruction.additionalDependencyValues[dependencyName2]
            }

          }
          this.requestComponentChanges({
            instruction: inst, initialChange: false, workspace, updatesNeeded,
            newStateVariableValues
          });
        } else {
          throw Error(`unimplemented dependency type ${dep.dependencyType} in requestComponentChanges`)
        }

      } else if (newInstruction.deferSettingDependency) {
        let dependencyName = newInstruction.deferSettingDependency;

        let dep = this.downstreamDependencies[component.componentName][stateVariable][dependencyName];

        if (dep.dependencyType === "childStateVariables") {
          let cName = dep.downstreamComponentNames[newInstruction.childIndex];
          if (!cName) {
            throw Error(`Invalid for deferSettingDependency in inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`)
          }

          let varName = dep.mappedDownstreamVariableNamesByComponent[newInstruction.childIndex][newInstruction.variableIndex];
          if (!varName) {
            throw Error(`Invalid for deferSettingDependency in inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist..`)
          }

          let componentToDefer = this._components[cName];

          if (componentToDefer.componentType !== "string") {
            throw Error(`deferStateVariableDependency is implemented just when dependency is a string.`)
          }

          // save previous value if don't have a getter
          if (!Object.getOwnPropertyDescriptor(componentToDefer.state[varName], 'value').get) {
            componentToDefer.state[varName]._previousValue = componentToDefer.state[varName].value;
          }

          delete componentToDefer.state[varName].value;

          let getDefStateVar = () => this.getDeferredStateVariable({
            component: componentToDefer,
            stateVariable: varName,
            upstreamComponent: component,
            upstreamStateVariable: stateVariable,
            dependencyValues: newInstruction.dependencyValues,
            inverseDefinition: newInstruction.inverseDefinition,
          });

          Object.defineProperty(componentToDefer.state[varName], 'value', { get: getDefStateVar, configurable: true });
          componentToDefer.state[varName].deferred = true;

        } else {
          throw Error(`unimplemented dependency type ${dep.dependencyType} in requestComponentChanges`)
        }

      } else {
        throw Error(`Unrecognized instruction for deferSettingDependency in inverse definition of ${stateVariable} of ${component.componentName}`)
      }
    }

    return;
  }

  submitResponseCallBack(results) {

    console.log(`submit response callback`)
    console.log(results);
    return;

    if (!results.success) {
      let errorMessage = "Answer not saved due to a network error. \nEither you are offline or your authentication has timed out.";
      this.renderer.updateSection({
        title: this.state.title,
        viewedSolution: this.state.viewedSolution,
        isError: true,
        errorMessage,
      });
      alert(errorMessage);

      this.requestUpdate({
        updateType: "updateRendererOnly",
      });
    } else if (results.viewedSolution) {
      console.log(`******** Viewed solution for ${scoredComponent.componentName}`);
      this.requestUpdate({
        updateType: "updateValue",
        updateInstructions: [{
          componentName: scoredComponent.componentName,
          variableUpdates: {
            viewedSolution: { changes: true },
          }
        }]
      })
    }

    // if this.answersToSubmitCounter is a positive number
    // that means that we have call this.submitAllAnswers and we still have
    // some answers that haven't been submitted
    // In this case, we will decrement this.answersToSubmitCounter
    // If this.answersToSubmitCounter newly becomes zero, 
    // then we know that we have submitted the last one answer
    if (this.answersToSubmitCounter > 0) {
      this.answersToSubmitCounter -= 1;
      if (this.answersToSubmitCounter === 0) {
        this.externalFunctions.allAnswersSubmitted();
      }
    }
  }

  // addComponents({ serializedComponents, parent, updatesNeeded}) {
  //   //Check if 
  //   //Child logic is violated
  //   //Parent exists
  //   //Check composites in serializedComponents??
  // }

  getDeferredStateVariable({ component, stateVariable, upstreamComponent, upstreamStateVariable, dependencyValues, inverseDefinition }) {

    let inverseResult = inverseDefinition({ dependencyValues, stateValues: upstreamComponent.stateValues });

    if (!inverseResult.success) {
      console.warn(`Inverse definition for deferring state variable failed. component: ${component.componentName}, stateVariable: ${stateVariable}, upstreamComponent: ${upstreamComponent.componentName}, upstreamStateVariable: ${upstreamStateVariable}`);
      return undefined;
    }

    for (let newInstruction of inverseResult.instructions) {
      if (newInstruction.setDependency) {
        let dependencyName = newInstruction.setDependency;

        let dep = this.downstreamDependencies[upstreamComponent.componentName][upstreamStateVariable][dependencyName];

        if (dep.dependencyType === "childStateVariables") {
          let cName = dep.downstreamComponentNames[newInstruction.childIndex];
          if (!cName) {
            throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`)
          }
          let varName = dep.mappedDownstreamVariableNamesByComponent[newInstruction.childIndex][newInstruction.variableIndex];
          if (!varName) {
            throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist..`)
          }

          let compNew = this._components[cName];

          // delete before assigning value to remove any getter for the property
          delete compNew.state[varName].value;
          delete compNew.state[varName].deferred;
          compNew.state[varName].value = newInstruction.desiredValue;

        } else {
          throw Error(`unimplemented dependency type ${dep.dependencyType} in deferred inverse definition`)
        }

      } else {
        throw Error(`Unrecognized instruction deferred inverse definition of ${stateVariable} of ${component.componentName}`)
      }
    }


    // if value of state variable still has a get, then it wasn't defined
    // in the function called for its definition
    if (Object.getOwnPropertyDescriptor(component.state[stateVariable], 'value').get) {
      throw Error(`deferred inverse definition of ${stateVariable} of ${component.componentName} didn't return value of variable`);
    }

    return component.state[stateVariable].value;

  }

  get doenetState() {
    return this._renderComponents;
  }

  set doenetState(value) {
    return null;
  }

  get scoredItemWeights() {
    return this.document.stateValues.scoredDescendants.map(
      x => x.stateValues.weight
    );
  }

  requestAnimationFrame(animationFunction, delay) {
    if (!this.preventMoreAnimations) {

      // create new animationID
      let animationID = ++this.lastAnimationID;

      if (delay) {
        // set a time out to call actual request animation frame after a delay
        let timeoutID = window.setTimeout(
          x => this._requestAnimationFrame(animationFunction, animationID),
          delay);
        this.animationIDs[animationID] = { timeoutID: timeoutID };
        return animationID;
      } else {
        // call actual request animation frame right away
        this.animationIDs[animationID] = {};
        return this._requestAnimationFrame(animationFunction, animationID);
      }
    }
  }

  _requestAnimationFrame(animationFunction, animationID) {
    let animationFrameID = window.requestAnimationFrame(animationFunction);
    let animationIDObj = this.animationIDs[animationID];
    delete animationIDObj.timeoutID;
    animationIDObj.animationFrameID = animationFrameID;
    return animationID;
  }


  cancelAnimationFrame(animationID) {
    let animationIDObj = this.animationIDs[animationID];
    let timeoutID = animationIDObj.timeoutID;
    if (timeoutID !== undefined) {
      window.clearTimeout(timeoutID);
    }
    let animationFrameID = animationIDObj.animationFrameID;
    if (animationFrameID !== undefined) {
      window.cancelAnimationFrame(animationFrameID);
    }
    delete this.animationIDs[animationID];

  }

  componentWillUnmount() {
    this.preventMoreAnimations = true;
    for (let id in this.animationIDs) {
      this.cancelAnimationFrame(id);
    }
    this.animationIDs = {};
  }

}


function validatePropertyValue({ value, propertySpecification, property }) {

  if (propertySpecification.valueTransformations &&
    value in propertySpecification.valueTransformations
  ) {
    value = propertySpecification.valueTransformations[value];
  }

  if (propertySpecification.toLowerCase) {
    value = value.toLowerCase();
  }

  if (propertySpecification.validValues) {
    if (!propertySpecification.validValues.includes(value)) {
      let firstValue = propertySpecification.validValues[0]
      console.warn(`Invalid value ${value} for property ${property}, using value ${firstValue}`);
      value = firstValue;
    }
  } else if (propertySpecification.clamp) {
    if (value < propertySpecification.clamp[0]) {
      value = propertySpecification.clamp[0];
    } else if (value > propertySpecification.clamp[1]) {
      value = propertySpecification.clamp[1];
    } else if (!Number.isFinite(value)) {
      value = property.default;
    }
  }

  return value;
}

function calculateAllComponentsShadowing(component) {
  let allShadowing = [];
  if (component.shadowedBy) {
    for (let comp2 of component.shadowedBy) {
      allShadowing.push(comp2.componentName);
      let additionalShadowing = calculateAllComponentsShadowing(comp2);
      allShadowing.push(...additionalShadowing);
    }
  }
  if (component.replacementOf) {
    let additionalShadowing = calculateAllComponentsShadowing(component.replacementOf);
    allShadowing.push(...additionalShadowing);
  }

  return allShadowing;
}
