import * as ComponentTypes from './ComponentTypes'
import readOnlyProxyHandler from './ReadOnlyProxyHandler';
import ParameterStack from './ParameterStack';
import Numerics from './Numerics';
import MersenneTwister from 'mersenne-twister';
import me from 'math-expressions';
import { createUniqueName, getNamespaceFromName } from './utils/naming';
import * as serializeFunctions from './utils/serializedStateProcessing';
import crypto from 'crypto';
import { deepCompare, deepClone } from './utils/deepFunctions';
import createStateProxyHandler from './StateProxyHandler';
import { postProcessCopy } from './utils/copy';
import { flattenDeep, mapDeep } from './utils/array';
import { DependencyHandler } from './Dependencies';

// string to componentClass: this.allComponentClasses["string"]
// componentClass to string: componentClass.componentType
// validTags: Object.keys(this.standardComponentClasses);


export default class Core {
  constructor({ doenetML, doenetState, parameters, requestedVariant,
    externalFunctions, flags = {}, coreReadyCallback, coreUpdatedCallback }) {
    // console.time('start up time');

    this.numerics = new Numerics();
    this.flags = new Proxy(flags, readOnlyProxyHandler); //components shouldn't modify flags

    this.switches = {
      ignoreRequireChildLogicInitiallySatisfied: false,
      ignoreUnresolvedSpecifiedComponents: false,
    }

    this.externalFunctions = externalFunctions;
    if (externalFunctions === undefined) {
      this.externalFunctions = {};
    }

    this.requestUpdate = this.requestUpdate.bind(this);
    this.requestAction = this.requestAction.bind(this);
    this.requestRecordEvent = this.requestRecordEvent.bind(this);
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this._requestAnimationFrame = this._requestAnimationFrame.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.calculateScoredItemNumberOfContainer = this.calculateScoredItemNumberOfContainer.bind(this);

    this.expandDoenetMLsToFullSerializedState = this.expandDoenetMLsToFullSerializedState.bind(this);
    this.finishCoreConstruction = this.finishCoreConstruction.bind(this);
    this.getStateVariableValue = this.getStateVariableValue.bind(this);
    this.submitResponseCallBack = this.submitResponseCallBack.bind(this);

    this.coreUpdatedCallback = coreUpdatedCallback;
    this.coreReadyCallback = function () {
      coreReadyCallback();

      this.requestRecordEvent({
        verb: "experienced",
        object: {
          componentName: this.document.componentName,
          componentType: "document",
        },
      })
    }.bind(this);


    this._standardComponentClasses = ComponentTypes.standardComponentClasses();
    this._allComponentClasses = ComponentTypes.allComponentClasses();
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

    this.publicStateVariableInfo = {};
    for (let componentType in this.allComponentClasses) {
      Object.defineProperty(this.publicStateVariableInfo, componentType, {
        get: function () {
          let info = this.allComponentClasses[componentType].returnStateVariableInfo({
            onlyPublic: true,
            standardComponentClasses: this.standardComponentClasses,
            allComponentClasses: this.allComponentClasses,
          });
          delete this.publicStateVariableInfo[componentType];
          return this.publicStateVariableInfo[componentType] = info;
        }.bind(this),
        configurable: true
      })
    }


    this.componentInfoObjects = {
      standardComponentClasses: this.standardComponentClasses,
      allComponentClasses: this.allComponentClasses,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      componentTypeWithPotentialVariants: this.componentTypeWithPotentialVariants,
      allPossibleProperties: this.allPossibleProperties,
      isInheritedComponentType: this.isInheritedComponentType,
      isStandardComposite: this.isStandardComposite,
      stateVariableInfo: this.stateVariableInfo,
      publicStateVariableInfo: this.publicStateVariableInfo,
    };

    this.coreFunctions = {
      requestUpdate: this.requestUpdate,
      requestAction: this.requestAction,
      requestRecordEvent: this.requestRecordEvent,
      requestAnimationFrame: this.requestAnimationFrame,
      cancelAnimationFrame: this.cancelAnimationFrame,
      calculateScoredItemNumberOfContainer: this.calculateScoredItemNumberOfContainer,
      recordSolutionView: this.externalFunctions.recordSolutionView,
    }

    this.animationIDs = {};
    this.lastAnimationID = 0;
    this.requestedVariant = requestedVariant;

    // console.time('serialize doenetML');

    this.parameterStack = new ParameterStack(parameters);
    this.setUpRng();


    let serializedComponents;

    if (doenetState) {
      serializedComponents = doenetState;
      let contentId;
      if (serializedComponents[0].doenetAttributes) {
        contentId = serializedComponents[0].doenetAttributes.contentId;
      }
      if (contentId === undefined) {
        contentId = "";
      }
      console.log(`contentId from doenetState: ${contentId}`)
      this.finishCoreConstruction({
        contentIds: [contentId],
        fullSerializedStates: [serializedComponents],
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

    let serializedComponents = fullSerializedStates[0];

    serializeFunctions.addDocumentIfItsMissing(serializedComponents);

    if (finishSerializedStateProcessing) {

      serializeFunctions.createComponentNames({
        serializedComponents,
        componentInfoObjects: this.componentInfoObjects,
      });
    } else {
      if (serializedComponents[0].doenetAttributes === undefined) {
        serializedComponents[0].doenetAttributes = {};
      }

      // TODO: why are we hard coding a document name here?
      // Seems like a bad idea, author could have named document something esle
      // serializedComponents[0].componentName = "/_document1";
    }

    console.log(`serialized components at the beginning`)
    console.log(deepClone(serializedComponents));


    this.documentName = serializedComponents[0].componentName;
    serializedComponents[0].doenetAttributes.contentId = this.contentId;

    this._components = {};
    this.renderedComponentInstructions = {};
    this.componentsWithChangedChildrenToRender = new Set([]);


    this._renderComponents = [];
    this._renderComponentsByName = {};
    this._graphRenderComponents = [];

    this.dependencies = new DependencyHandler({
      _components: this._components,
      componentInfoObjects: this.componentInfoObjects,
      core: this,
    });

    this.unsatisfiedChildLogic = {};

    // console.timeEnd('serialize doenetML');

    this.setUpVariants(serializedComponents);

    //Make these variables available for cypress
    window.state = {
      components: this._components,
      renderedComponentInstructions: this.renderedComponentInstructions,
      renderedComponentTypes: this.renderedComponentTypes,
      dependencies: this.dependencies,
      core: this,
      componentInfoObjects: this.componentInfoObjects,
    }

    this.changedStateVariables = {};

    this.addComponents({
      serializedComponents,
      initialAdd: true,
    })

    this.rendererTypesInDocument = this.document.allPotentialRendererTypes;


    // evalute itemCreditAchieved so that will be fresh
    // and can detect changes when it is marked stale
    this.document.stateValues.itemCreditAchieved;

    // console.log(serializedComponents)
    // console.timeEnd('start up time');
    console.log("** components at the end of the core constructor **");
    console.log(this._components);

    if (calledAsynchronously) {
      this.coreReadyCallback()
    } else {
      setTimeout(() => this.coreReadyCallback(), 0)
    }

  }

  setUpVariants(serializedComponents) {

    let variantComponents = serializeFunctions.gatherVariantComponents({
      serializedComponents,
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

      let serializedComponents = serializeFunctions.doenetMLToSerializedComponents({
        doenetML,
        standardComponentClasses: this.standardComponentClasses,
        allComponentClasses: this.allComponentClasses,
      });

      serializeFunctions.createComponentsFromProps(serializedComponents, this.standardComponentClasses);

      // console.log('before macros')
      // console.log(deepClone(serializedComponents));

      serializedComponents = serializeFunctions.applyMacros(serializedComponents, this.componentInfoObjects);

      serializeFunctions.applySugar({ serializedComponents, componentInfoObjects: this.componentInfoObjects });

      serializedStates.push(serializedComponents);

      let newContentIdComponents = serializeFunctions.findContentIdRefs({ serializedComponents });

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
        // so we call it with the contentIds and serializedComponents from that context
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

  addComponents({ serializedComponents, parent, indexOfDefiningChildren, initialAdd = false }) {

    if (!Array.isArray(serializedComponents)) {
      serializedComponents = [serializedComponents];
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

    // TODO: not currently setting shared parameters as this is called from the beginning
    // However, if we call add components from some other context,
    // do we need to appropriately set shared parameters? 

    let createResult = this.createIsolatedComponents({
      serializedComponents, ancestors,
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
      addedComponents,
      deletedComponents,
      init: initialAdd,
    });

    return newComponents;
  }


  updateRendererInstructions({ componentNames, sourceOfUpdate, recreatedComponents = {} }) {

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
          if (currentChildNames.includes(childName) && !recreatedComponents[childName]) {
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
          if (!previousChildNames.includes(name) || recreatedComponents[name]) {

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
    if (component.state.childrenToRender.isResolved) {
      if (component.stateValues.childrenToRender) {
        for (let childName of component.stateValues.childrenToRender) {
          componentNames.push(...this.componentAndRenderedDescendants(this._components[childName]));
        }
      }
    }
    return componentNames;
  }

  createIsolatedComponents({ serializedComponents, ancestors,
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
      recreatedComponents: {},
      itemScoreChanges: new Set(),
      parentsToUpdateDescendants: new Set(),
    }

    let previousUnsatisfiedChildLogic = Object.assign({}, this.unsatisfiedChildLogic);

    let namespaceForUnamed = "/";

    if (ancestors.length > 0) {
      let parentName = ancestors[0].componentName;
      let parent = this.components[parentName];
      if (parent.doenetAttributes.newNamespace) {
        namespaceForUnamed = parent.componentName + "/";
      } else {
        namespaceForUnamed = getNamespaceFromName(parent.componentName);
      }
    }

    let createResult = this.createIsolatedComponentsSub({
      serializedComponents,
      ancestors,
      applyAdapters,
      shadow, updatesNeeded, compositesBeingExpanded,
      namespaceForUnamed
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


    this.dependencies.updateDependencies(updatesNeeded, compositesBeingExpanded);


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

  createIsolatedComponentsSub({ serializedComponents, ancestors,
    applyAdapters = true, shadow = false, updatesNeeded, compositesBeingExpanded,
    createNameContext = "", namespaceForUnamed = "/",
  }
  ) {

    let newComponents = [];

    //TODO: last message
    let lastMessage = "";

    for (let [componentInd, serializedComponent] of serializedComponents.entries()) {

      // if already corresponds to a created component
      // add to array
      if (serializedComponent.createdComponent === true) {
        let newComponent = this._components[serializedComponent.componentName];
        newComponents.push(newComponent);

        // set ancestors, in case component has been moved
        // TODO: do we still need with since removed sugar?
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

      if (!serializedComponent.doenetAttributes) {
        serializedComponent.doenetAttributes = {};
      }

      // if have a componentName, use that for componentName
      // otherwise generate automatic name
      let componentName = serializedComponent.componentName;
      if (componentName === undefined) {
        // Note: assuming that document always has a name
        // so we never get here without an ancestor
        let parentName = ancestors[0].componentName;
        let longNameId = parentName + "|" + createNameContext + "|";

        if (serializedComponent.uniqueIdentifier) {
          longNameId += serializedComponent.uniqueIdentifier;
        } else {
          longNameId += componentInd;
        }

        componentName = createUniqueName(serializedComponent.componentType, longNameId);

        // add namespace
        componentName = namespaceForUnamed + componentName;
      }

      let createResult = this.createChildrenThenComponent({
        serializedComponent,
        componentName,
        ancestors,
        componentClass,
        applyAdapters, shadow, updatesNeeded, compositesBeingExpanded,
        namespaceForUnamed,
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
    applyAdapters = true, shadow = false,
    updatesNeeded, compositesBeingExpanded,
    namespaceForUnamed = "/",
  }) {

    // first recursively create children
    let serializedChildren = serializedComponent.children;
    let definingChildren = [];
    let childrenToRemainSerialized = [];

    let ancestorsForChildren = [{ componentName, componentClass }, ...ancestors];

    // add a new level to parameter stack;
    let parentSharedParameters = this.parameterStack.parameters;
    this.parameterStack.push();
    let sharedParameters = this.parameterStack.parameters;


    // check if component has any properties to propagate to descendants
    let propertiesPropagated = this.propagateAncestorProps({
      componentClass, componentName, sharedParameters
    });

    if (componentClass.modifySharedParameters) {
      componentClass.modifySharedParameters({ sharedParameters, serializedComponent });
    }

    if (serializedComponent.doenetAttributes.pushSharedParameters
    ) {
      for (let parInstruction of serializedComponent.doenetAttributes.pushSharedParameters) {
        let pName = parInstruction.parameterName;
        if (pName in sharedParameters) {
          sharedParameters[pName] = [...sharedParameters[pName]];
        }
        else {
          sharedParameters[pName] = [];
        }
        sharedParameters[pName].push(parInstruction.value);
      }
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
            serializedComponents: [variantControlChild],
            ancestors: ancestorsForChildren,
            applyAdapters, shadow,
            updatesNeeded, compositesBeingExpanded,
            createNameContext: "variantControl",
            namespaceForUnamed,
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
          serializedComponents: childrenToCreate,
          ancestors: ancestorsForChildren,
          applyAdapters, shadow,
          updatesNeeded, compositesBeingExpanded,
          namespaceForUnamed,
        });

        for (let [createInd, locationInd] of indicesToCreate.entries()) {
          definingChildren[locationInd] = childrenResult.components[createInd];
        }

      } else if (componentClass.keepChildrenSerialized) {
        let childrenAddressed = new Set([]);

        let keepSerializedInds = componentClass.keepChildrenSerialized({
          serializedComponent,
          componentInfoObjects: this.componentInfoObjects,
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
            serializedComponents: childrenToCreate,
            ancestors: ancestorsForChildren,
            applyAdapters, shadow,
            updatesNeeded, compositesBeingExpanded,
            namespaceForUnamed,
          });

          for (let [createInd, locationInd] of indicesToCreate.entries()) {
            definingChildren[locationInd] = childrenResult.components[createInd];
          }
        }

      } else {

        //create all children

        let childrenResult = this.createIsolatedComponentsSub({
          serializedComponents: serializedChildren,
          ancestors: ancestorsForChildren,
          applyAdapters, shadow,
          updatesNeeded, compositesBeingExpanded,
          namespaceForUnamed,
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
      flags: this.flags,
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
    if (updatesNeeded.deletedComponents[componentName]) {
      updatesNeeded.recreatedComponents[componentName] = true;
    }
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
      serializedComponent,
      componentInfoObjects: this.componentInfoObjects,
      coreFunctions: this.coreFunctions,
      flags: this.flags,
      shadow,
      numerics: this.numerics,
      sharedParameters,
      parentSharedParameters,
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

    // if (this.allComponentClasses._composite.isPrototypeOf(componentClass)) {
    //   // if composite was serialized with replacements
    //   // then save those serializedReplacements to be used when component is expanded
    //   if (serializedComponent.replacements !== undefined) {
    //     newComponent.serializedReplacements = serializedComponent.replacements;
    //   }
    // }


    this.deriveChildResultsFromDefiningChildren(newComponent, updatesNeeded, compositesBeingExpanded);

    this.initializeComponentStateVariables(newComponent);

    this.dependencies.setUpComponentDependencies({
      component: newComponent,
      core: this,
      updatesNeeded, compositesBeingExpanded,
    });

    let { varsUnresolved } = this.resolveStateVariables({
      component: newComponent,
      updatesNeeded, compositesBeingExpanded,
    });

    this.addUnresolvedDependencies({ varsUnresolved, component: newComponent, updatesNeeded });

    let variablesChanged = this.dependencies.checkForDependenciesOnNewComponent({
      componentName,
      updatesNeeded, compositesBeingExpanded,
    })

    for (let varDescription of variablesChanged) {
      this.recordActualChangeInStateVariable({
        componentName: varDescription.componentName,
        varName: varDescription.varName,
        updatesNeeded
      });
    }


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
    let propertiesToStopPropagation = {};
    for (let property in sharedParameters.propertiesToPropagate) {
      if (property in propertyObject) {
        propertiesToStopPropagation[property] = true;
        if (!propertyObject[property].ignorePropagationFromAncestors) {
          propertiesPropagated[property] = sharedParameters.propertiesToPropagate[property];
        }
      }
    }

    if (Object.keys(propertiesToPropagate).length > 0 || Object.keys(propertiesToStopPropagation).length > 0) {
      if (sharedParameters.propertiesToPropagate) {
        // shallow copy so that changes won't affect ancestors or siblings
        sharedParameters.propertiesToPropagate = Object.assign({}, sharedParameters.propertiesToPropagate);
        for (let property in propertiesToStopPropagation) {
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

  matchChildrenToChildLogic({ component, applyAdapters = true, updatesNeeded }) {

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


      if (component.constructor.assignNamesToReplacements) {

        let originalNamesAreConsistent = component.constructor.originalNamesAreConsistent
          && component.doenetAttributes.newNamespace;

        let processResult = serializeFunctions.processAssignNames({
          assignNames: component.doenetAttributes.assignNames,
          serializedComponents: serializedReplacements,
          parentName: component.componentName,
          parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
          componentInfoObjects: this.componentInfoObjects,
          originalNamesAreConsistent,
        });

        serializedReplacements = processResult.serializedComponents;
      } else {
        // console.log(`since ${component.componentName} doesn't assign names to replacements, just call create component names from children`)
        // console.log(deepClone(serializedReplacements))

        // since original names came from the targetComponent
        // we can use them only if we created a new namespace
        let originalNamesAreConsistent = component.doenetAttributes.newNamespace;

        let processResult = serializeFunctions.processAssignNames({
          // assignNames: component.doenetAttributes.assignNames,
          serializedComponents: serializedReplacements,
          parentName: component.componentName,
          parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
          componentInfoObjects: this.componentInfoObjects,
          originalNamesAreConsistent,
        });

        serializedReplacements = processResult.serializedComponents;

      }

      // console.log(`serialized replacements for ${component.componentName} who is shadowing ${shadowedComposite.componentName}`)
      // console.log(deepClone(serializedReplacements));

      this.createAndSetReplacements({
        component,
        serializedReplacements,
        updatesNeeded,
        compositesBeingExpanded,
      });

      this.dependencies.updateReplacementDependencies(component, updatesNeeded, compositesBeingExpanded);

      // TODO: make this more specific so just updates descendants
      // of direct parent of composite, as that's the only one that would see
      // replacements as a descendant?
      this.dependencies.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

      // record that are finished expanding the composite
      let targetInd = compositesBeingExpanded.indexOf(component.componentName);
      if (targetInd === -1) {
        throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
      }
      compositesBeingExpanded.splice(targetInd, 1)

      return { success: true };

    }

    let result = component.constructor.createSerializedReplacements({
      component: this.components[component.componentName],  // to create proxy
      components: this.components,
      workspace: component.replacementsWorkspace,
      componentInfoObjects: this.componentInfoObjects,
    });

    // console.log(`expand result for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(result)));

    if (result.replacements) {
      let serializedReplacements = result.replacements;

      // if (component.serializedReplacements) {

      //   // if component came with serialized replacements, use those instead
      //   // as they may have particular state variables values saved
      //   serializedReplacements = component.serializedReplacements;
      //   delete component.serializedReplacements;
      // }

      this.createAndSetReplacements({
        component,
        serializedReplacements,
        updatesNeeded,
        compositesBeingExpanded,
      });
    } else {
      throw Error(`Invalid createSerializedReplacements of ${component.componentName}`);
    }

    this.dependencies.updateReplacementDependencies(component, updatesNeeded, compositesBeingExpanded);

    // TODO: make this more specific so just updates descendants
    // of direct parent of composite, as that's the only one that would see
    // replacements as a descendant?
    this.dependencies.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

    // record that are finished expanding the composite
    let targetInd = compositesBeingExpanded.indexOf(component.componentName);
    if (targetInd === -1) {
      throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
    }
    compositesBeingExpanded.splice(targetInd, 1)

    return { success: true };
  }

  createAndSetReplacements({ component, serializedReplacements, updatesNeeded, compositesBeingExpanded }) {

    this.parameterStack.push(component.sharedParameters, false);

    let namespaceForUnamed;
    if (component.doenetAttributes.newNamespace) {
      namespaceForUnamed = component.componentName + "/";
    } else {
      namespaceForUnamed = getNamespaceFromName(component.componentName);
    }

    let replacementResult = this.createIsolatedComponentsSub({
      serializedComponents: serializedReplacements,
      ancestors: component.ancestors,
      shadow: true,
      updatesNeeded,
      compositesBeingExpanded,
      createNameContext: component.componentName + "|replacements",
      namespaceForUnamed,
    });

    this.parameterStack.pop();

    component.replacements = replacementResult.components;
    component.isExpanded = true;

    // record for top level replacement that they are a replacement of composite
    for (let comp of component.replacements) {
      comp.replacementOf = component;
    }

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


        // don't use any replacements that are marked as being withheld
        this.markWithheldReplacementInactive(child, updatesNeeded);

        let replacements = child.replacements;
        if (child.replacementsToWithhold > 0) {
          replacements = replacements.slice(0, -child.replacementsToWithhold);
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

  markWithheldReplacementInactive(composite, updatesNeeded) {

    let numActive = composite.replacements.length;

    if (composite.stateValues.isInactiveCompositeReplacement) {
      numActive = 0;
    } else if (composite.replacementsToWithhold > 0) {
      numActive -= composite.replacementsToWithhold;
    }

    for (let repl of composite.replacements.slice(0, numActive)) {
      this.changeInactiveComponentAndDescendants(
        repl, false, updatesNeeded
      );
    }

    for (let repl of composite.replacements.slice(numActive)) {
      this.changeInactiveComponentAndDescendants(
        repl, true, updatesNeeded
      );
    }
  }

  changeInactiveComponentAndDescendants(component, inactive, updatesNeeded) {
    if (component.stateValues.isInactiveCompositeReplacement !== inactive) {
      component.state.isInactiveCompositeReplacement.value = inactive;
      this.markUpstreamDependentsStale({
        component,
        varName: "isInactiveCompositeReplacement",
        updatesNeeded
      });
      this.dependencies.recordActualChangeInUpstreamDependencies({
        component,
        varName: "isInactiveCompositeReplacement"
      });
      for (let childName in component.allChildren) {
        this.changeInactiveComponentAndDescendants(this._components[childName], inactive, updatesNeeded)
      }

      if (component.replacements) {
        this.markWithheldReplacementInactive(component, updatesNeeded);
      }
    }
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
          let namespaceForUnamed;
          if (component.doenetAttributes.newNamespace) {
            namespaceForUnamed = component.componentName + "/";
          } else {
            namespaceForUnamed = getNamespaceFromName(component.componentName);
          }
          let newChildrenResult = this.createIsolatedComponentsSub({
            serializedComponents: [newSerializedChild],
            shadow: true,
            ancestors: originalChild.ancestors,
            updatesNeeded,
            createNameContext: originalChild.componentName + "|adapter",
            namespaceForUnamed,
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

  findShadowedChildInSerializedComponents({ serializedComponents, shadowedComponentName }) {
    for (let serializedComponent of serializedComponents) {
      if (serializedComponent.originalName === shadowedComponentName) {
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
      if (!propertyClass) {
        throw Error(`Component type ${property} does not exist so cannot create property.`)
      }
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
            dependencyType: "child",
            childLogicName: childLogicName,
            variableNames: [stateVariableForPropertyValue],
          },
          ancestorProp: {
            dependencyType: "stateVariable",
            componentName: ancestorProps[property].componentName,
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
            dependencyType: "child",
            childLogicName: childLogicName,
            variableNames: [stateVariableForPropertyValue],
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
          dependencyType: "stateVariable",
          componentName: redefineDependencies.adapterTargetIdentity.componentName,
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
        dependencyType: "stateVariable",
        componentName: redefineDependencies.adapterTargetIdentity.componentName,
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

      if (property in compositeComponent.state) {
        thisDependencies.compositeComponentVariable = {
          dependencyType: "stateVariable",
          componentName: compositeComponent.componentName,
          variableName: property,
        }
      }
      if (
        (!redefineDependencies.propVariable || propertySpecification.propagateToProps)
        && (property in targetComponent.state)
      ) {
        thisDependencies.targetVariable = {
          dependencyType: "stateVariable",
          componentName: targetComponent.componentName,
          variableName: property,
        };
        if ("targetPropertiesToIgnore" in compositeComponent.state) {
          thisDependencies.targetPropertiesToIgnore = {
            dependencyType: "stateVariable",
            componentName: compositeComponent.componentName,
            variableName: "targetPropertiesToIgnore",
          };
        }
      }

      // TODO: do we really want to overwrite targetVariable here?
      if (additionalPropertiesFromStateVariables[property]) {
        thisDependencies.targetVariable = {
          dependencyType: "stateVariable",
          componentName: targetComponent.componentName,
          variableName: additionalPropertiesFromStateVariables[property]
        }
      }

      if (property in ancestorProps) {
        thisDependencies.ancestorProp = {
          dependencyType: "stateVariable",
          componentName: ancestorProps[property].componentName,
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
            dependencyType: "stateVariable",
            componentName: targetComponent.componentName,
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
          dependencyType: "stateVariable",
          componentName: targetComponent.componentName,
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
        continue; // already are shadowing
      }
      if (stateObj.isResolved && !stateObj.willNeverBeEssential) {
        // evaluate so know if it is essential
        stateObj.value;
      }
      if (!stateObj.neverShadow) {
        if (stateObj.essential || stateObj.alwaysShadow || stateObj.isShadow
          || (stateObj.isArray && stateObj.isResolved
            && targetComponent.state[stateObj.arraySizeStateVariable].isResolved
            && stateObj.getAllArrayKeys(stateObj.arraySize).length > 0
            && stateObj.getAllArrayKeys(stateObj.arraySize).some(x => stateObj.essentialByArrayKey[x])
          )
        ) {
          if (!stateVariablesToShadow.includes(varName)) {
            stateVariablesToShadow.push(varName);
          }
        } else if (!stateObj.isResolved ||
          (stateObj.isArray && !targetComponent.state[stateObj.arraySizeStateVariable].isResolved)
        ) {
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
            if (stateObj.isArray && !stateObj.entireArrayAtOnce
              && !targetComponent.state[stateObj.arraySizeStateVariable].isResolved
            ) {
              determineIfShadowData.arraySizeStateVariableToResolve = stateObj.arraySizeStateVariable;
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

    // Note: if add a markStale function to these shadow,
    // will need to modify array size state variable definition
    // (createArraySizeStateVariable)
    // to not overwrite markStale when it finds a shadow

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
                dependencyType: "stateVariable",
                componentName: targetComponent.componentName,
                variableName: this.arrayVarNameFromArrayKey(key),
              }
            };
          }

          let globalDependencies = {}

          if (copyComponentType) {
            globalDependencies.targetVariableComponentType = {
              dependencyType: "stateVariableComponentType",
              componentName: targetComponent.componentName,
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
            dependencyType: "stateVariable",
            componentName: targetComponent.componentName,
            variableName: varName,
          };
          if (copyComponentType) {
            dependencies.targetVariableComponentType = {
              dependencyType: "stateVariableComponentType",
              componentName: targetComponent.componentName,
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

    stateVarObj._arrayKeys = [];
    stateVarObj._unflattenedArrayKeys = [];


    Object.defineProperty(stateVarObj, 'arrayKeys', {
      get: function () {
        // first evaluate arraySize so _arrayKeys is recalculated
        // in case arraySize change
        arrayStateVarObj.arraySize;
        return stateVarObj._arrayKeys;
      }
    });

    Object.defineProperty(stateVarObj, 'unflattenedArrayKeys', {
      get: function () {
        // first evaluate arraySize so _unflattenedArrayKeys is recalculated
        // in case arraySize change
        arrayStateVarObj.arraySize;
        return stateVarObj._unflattenedArrayKeys;
      }
    });


    if (component.state[stateVarObj.arraySizeStateVariable].isResolved) {
      let arraySize = component.stateValues[stateVarObj.arraySizeStateVariable];
      let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
        arrayEntryPrefix: stateVarObj.entryPrefix,
        varEnding: stateVarObj.varEnding,
        arraySize,
        nDimensions: arrayStateVarObj.nDimensions,
      });

      stateVarObj._unflattenedArrayKeys = arrayKeys;
      stateVarObj._arrayKeys = flattenDeep(arrayKeys);

      // for each arrayKey, add this entry name to the array's list variables
      let varNamesIncluding = arrayStateVarObj.varNamesIncludingArrayKeys
      for (let arrayKey of stateVarObj._arrayKeys) {
        if (!varNamesIncluding[arrayKey]) {
          varNamesIncluding[arrayKey] = [];
        }
        varNamesIncluding[arrayKey].push(stateVariable);
      }

    }

    arrayStateVarObj.arrayEntryNames.push(stateVariable);

    Object.defineProperty(stateVarObj, 'arraySize', {
      get: () => arrayStateVarObj.arraySize
    });

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

      if (!stateVarObj.stateVariablesDeterminingDependencies) {
        stateVarObj.stateVariablesDeterminingDependencies = [];
      }

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
      let arrayReturnDependencies = arrayStateVarObj.returnDependencies.bind(arrayStateVarObj);
      stateVarObj.returnDependencies = function (args) {
        // add array size to argument of return dependencies
        args.arraySize = stateVarObj.arraySize;
        args.arrayKeys = stateVarObj.arrayKeys;
        let dependencies = arrayReturnDependencies(args);

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
          return { nFailures: 1 };
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
            return { nFailures: 1 };
          }
        }

        let nFailures = 0;

        if (nDimensionsInArrayKey < stateVarObj.nDimensions) {
          // if dimensions from arrayKey is less than number of dimensions
          // then attempt to get additional dimensions from 
          // array indices of value

          function setArrayValuesPiece(desiredValue, arrayValuesPiece, arraySizePiece) {
            // try to set value of entries of arrayValuePiece to entries of desiredValue
            // given that size of arrayValuesPieces is arraySizePiece

            if (!Array.isArray(desiredValue)) {
              console.warn('ignoring array values with insufficient dimensions')
              return { nFailures: 1 };
            }

            let nFailures = 0;

            let currentSize = arraySizePiece[0];
            if (desiredValue.length > currentSize) {
              console.warn('ignoring array values of out bounds')
              nFailures += desiredValue.length - currentSize;
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
                let result = setArrayValuesPiece(val, arrayValuesPiece[ind], arraySizePiece[ind])
                nFailures += result.nFailures;
              }
            }

            return { nFailures };
          }


          let result = setArrayValuesPiece(value, arrayValuesDrillDown, arraySizeDrillDown)
          nFailures += result.nFailures;

        } else {
          arrayValuesDrillDown[index[index.length - 1]] = value;

        }

        return { nFailures };

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

        for (let key of Object.keys(stateVarObj.essentialByArrayKey)) {
          let index = stateVarObj.keyToIndex(key);
          if (index.some((v, i) => v >= stateVarObj.arraySize[i])) {
            delete stateVarObj.essentialByArrayKey[key];
          }

        }

      }

    } else {

      // have just one dimension
      stateVarObj.keyToIndex = key => Number(key);
      stateVarObj.setArrayValue = function ({ value, arrayKey, arraySize }) {
        let ind = stateVarObj.keyToIndex(arrayKey);
        if (ind >= 0 && ind < arraySize[0]) {
          stateVarObj.arrayValues[ind] = value;
          return { nFailures: 0 };
        } else {
          console.warn(`Ignoring setting array values out of bounds: ${arrayKey} of ${stateVariable}`)
          return { nFailures: 1 };
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

        for (let key of Object.keys(stateVarObj.essentialByArrayKey)) {
          let index = stateVarObj.keyToIndex(key);
          if (index >= stateVarObj.arraySize[0]) {
            delete stateVarObj.essentialByArrayKey[key];
          }
        }
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


    stateVarObj.arrayEntryNames = [];
    stateVarObj.varNamesIncludingArrayKeys = {};

    // create the definition, etc., functions for the array stsate variable
    if (stateVarObj.entireArrayAtOnce) {

      stateVarObj.getCurrentFreshness = function ({ freshnessInfo }) {
        return { fresh: { [stateVariable]: freshnessInfo.arrayFresh } }
      }

      stateVarObj.markStale = function ({ freshnessInfo }) {
        freshnessInfo.arrayFresh = false;
        stateVarObj.arraySizeStale = true;
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
        // console.log(JSON.parse(JSON.stringify(args)));

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
        if (stateVarObj.additionalStateVariablesDefined) {
          for (let varName of stateVarObj.additionalStateVariablesDefined) {
            // do we have to check if it is array?
            if (component.state[varName].isArray) {
              result.arraySizeChanged.push(varName);
            }
          }
        }

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

        let dependencies = {};

        if (stateVarObj.basedOnArrayKeyStateVariables && args.arrayKeys.length > 1) {
          for (let arrayKey of args.arrayKeys) {
            dependencies[arrayKey] = {
              dependencyType: "stateVariable",
              variableName: stateVarObj.arrayVarNameFromArrayKey(arrayKey)
            }
          }
        } else {

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

          // to tie into making sure array size is a dependency, below
          stateVarObj.dependencyNames.global.push("__array_size");

        }

        // make sure array size is a dependency
        dependencies.__array_size = {
          dependencyType: "stateVariable",
          variableName: stateVarObj.arraySizeStateVariable
        };

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



        if (Object.keys(freshByKey).length === 0) {
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

          if (stateVarObj.basedOnArrayKeyStateVariables && arrayKeys.length > 1) {
            delete freshByKey[changeName];
          } else {
            for (let key of stateVarObj.dependencyNames.keysByName[changeName]) {
              delete freshByKey[key];
            }
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
        // console.log(args.dependencyValues)

        if (args.arrayKeys === undefined) {
          args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
        }

        if (stateVarObj.basedOnArrayKeyStateVariables && args.arrayKeys.length > 1) {
          // if based on array key state variables and have more than one array key
          // then must have calculated all the relevant array keys
          // when retrieving the dependency values
          // Hence there is nothing to do, as arrayValues has been populated
          // with all the requisite values

          return {};
        } else {

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
            if (args.changes.__array_size) {
              result.arraySizeChanged = [stateVariable];
              if (stateVarObj.additionalStateVariablesDefined) {
                for (let varName of stateVarObj.additionalStateVariablesDefined) {
                  // do we have to check if it is array?
                  if (component.state[varName].isArray) {
                    result.arraySizeChanged.push(varName);
                  }
                }
              }
            }
            args.freshnessInfo.freshArraySize = true;
          }

          // console.log(`result of array definition of ${stateVariable} of ${component.componentName}`)
          // console.log(JSON.parse(JSON.stringify(result)))
          // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
          return result;
        }
      }

      stateVarObj.inverseDefinition = function (args) {
        // console.log(`inverse definition args for ${stateVariable}`)
        // console.log(args)

        if (!stateVarObj.inverseArrayDefinitionByKey) {
          return { success: false }
        }

        if (args.arrayKeys === undefined) {
          args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
        }

        if (stateVarObj.basedOnArrayKeyStateVariables && args.arrayKeys.length > 1) {
          let instructions = [];

          for (let key in args.desiredStateVariableValues[stateVariable]) {
            if (key in args.dependencyValues) {
              instructions.push({
                setDependency: key,
                desiredValue: args.desiredStateVariableValues[stateVariable][key],
                treatAsInitialChange: args.initialChange
              })
            }
          }
          return {
            success: true,
            instructions
          };

        } else {


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
    }


    this.createArraySizeStateVariable({ stateVarObj, component, stateVariable });

    stateVarObj.arraySizeStale = true;
    stateVarObj.previousArraySize = [];

    Object.defineProperty(stateVarObj, 'arraySize', {
      get: function () {
        if (!component.state[stateVarObj.arraySizeStateVariable].isResolved) {
          return [];
        }
        if (stateVarObj.arraySizeStale) {
          stateVarObj.recalculateArraySizeDependentQuantities();
        }
        return component.stateValues[stateVarObj.arraySizeStateVariable];
      }
    });

    stateVarObj.recalculateArraySizeDependentQuantities = function () {

      let newArraySize = component.stateValues[stateVarObj.arraySizeStateVariable];
      if (stateVarObj.previousArraySize.length !== newArraySize.length
        || stateVarObj.previousArraySize.some((v, i) => v != newArraySize[i])
      ) {
        stateVarObj.previousArraySize = [...newArraySize];
        let varNamesIncluding = stateVarObj.varNamesIncludingArrayKeys = {};
        for (let entryName of stateVarObj.arrayEntryNames) {
          let entryStateVarObj = component.state[entryName];
          let arrayKeys = stateVarObj.getArrayKeysFromVarName({
            arrayEntryPrefix: entryStateVarObj.entryPrefix,
            varEnding: entryStateVarObj.varEnding,
            arraySize: newArraySize,
            nDimensions: stateVarObj.nDimensions,
          });
          entryStateVarObj._unflattenedArrayKeys = arrayKeys;
          entryStateVarObj._arrayKeys = flattenDeep(arrayKeys);

          // for each arrayKey, add this entry name to the array's list variables
          for (let arrayKey of entryStateVarObj._arrayKeys) {
            if (!varNamesIncluding[arrayKey]) {
              varNamesIncluding[arrayKey] = [];
            }
            varNamesIncluding[arrayKey].push(entryName);
          }
        }

      }
      stateVarObj.arraySizeStale = false;
    }


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
      // Just make it mark the array's arraySize as stale on markStale
      if (stateVarObj.isShadow) {
        let arraySizeStateVarObj = component.state[arraySizeStateVar];
        arraySizeStateVarObj.markStale = function () {
          stateVarObj.arraySizeStale = true;
          return {};
        }
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
        markStale() {
          stateVarObj.arraySizeStale = true;
          return {};
        }
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


  recursivelyReplaceCompositesWithReplacements({ replacements }) {
    let compositesFound = [];
    let newReplacements = [];
    for (let replacement of replacements) {
      if (this.isStandardComposite(replacement.componentType)) {
        compositesFound.push(replacement.componentName);
        if (replacement.replacements) {
          let recursionResult = this.recursivelyReplaceCompositesWithReplacements({
            replacements: replacement.replacements,
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

    let definitionArgs = this.getStateVariableDefinitionArguments({ component, stateVariable });
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
        let changedComponentType = false;
        let originalComponentType = component.state[varName].componentType;
        let newComponentType = result.setComponentType[varName];
        if (Array.isArray(originalComponentType)) {
          if (Array.isArray(newComponentType)) {
            if (originalComponentType.length !== newComponentType.length) {
              changedComponentType = true;
            } else if (originalComponentType.some((v, i) => v != newComponentType[i])) {
              changedComponentType = true;
            }
          } else {
            changedComponentType = true;
          }
        } else if (Array.isArray(newComponentType)) {
          changedComponentType = true;
        } else {
          changedComponentType = originalComponentType !== newComponentType
        }
        if (changedComponentType) {
          valuesChanged[varName] = true;
        }
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
            this.dependencies.recordActualChangeInUpstreamDependencies({
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
      this.dependencies.recordActualChangeInUpstreamDependencies({
        component, varName,
        changes: valuesChanged[varName] // so far, just in case is an array state variable
      })

      if (component.state[varName].isArray) {
        let arrayVarNamesChanged = [];
        if (valuesChanged[varName] === true
          || valuesChanged[varName].allArrayKeysChanged
          || valuesChanged.arraySizeChanged
        ) {
          if (component.state[varName].arrayEntryNames) {
            arrayVarNamesChanged = component.state[varName].arrayEntryNames;
          }
        } else {

          let varNamesByArrayKey = component.state[varName].varNamesIncludingArrayKeys;
          for (let arrayKeyChanged in valuesChanged[varName].arrayKeysChanged) {
            let additionalVarNamesChanged = varNamesByArrayKey[arrayKeyChanged];
            if (additionalVarNamesChanged) {
              arrayVarNamesChanged.push(...additionalVarNamesChanged)
            }
          }
        }
        for (let arrayVarName of arrayVarNamesChanged) {
          this.dependencies.recordActualChangeInUpstreamDependencies({
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


  getStateVariableDefinitionArguments({ component, stateVariable }) {
    // console.log(`get state variable dependencies of ${component.componentName}, ${stateVariable}`)

    let args = this.dependencies.getStateVariableDependencyValues({ component, stateVariable });

    args.componentName = component.componentName;

    let stateVarObj = component.state[stateVariable];
    if (stateVarObj.isArrayEntry && !stateVarObj.entireArrayAtOnce) {
      args.arrayKeys = stateVarObj.arrayKeys;
      args.arraySize = stateVarObj.arraySize;
    } else if (stateVarObj.isArray && !stateVarObj.entireArrayAtOnce) {
      args.arraySize = stateVarObj.arraySize;
    }

    if (stateVarObj.providePreviousValuesInDefinition) {
      let allStateVariablesDefined = [stateVariable];
      if (stateVarObj.additionalStateVariablesDefined) {
        allStateVariablesDefined.push(...stateVarObj.additionalStateVariablesDefined)
      }
      let previousValues = {};
      for (let varName of allStateVariablesDefined) {
        previousValues[varName] = component.state[varName]._previousValue;
      }
      args.previousValues = previousValues;
    }

    return args;
  }


  recordActualChangeInStateVariable({
    componentName, varName, includeAdditionalStateVariables = true,
    updatesNeeded,
  }) {

    let component = this._components[componentName];

    // mark stale always includes additional state variables defined
    this.markStateVariableAndUpstreamDependentsStale({
      component,
      varName,
      updatesNeeded,
    });

    let allStateVariables = [varName];
    if (includeAdditionalStateVariables && component.state[varName].additionalStateVariablesDefined) {
      allStateVariables.push(...component.state[varName].additionalStateVariablesDefined);
    }

    for (let vName of allStateVariables) {

      component.state[vName].forceRecalculation = true;
      this.dependencies.recordActualChangeInUpstreamDependencies({
        component,
        varName: vName
      });

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

        let downDeps = this.dependencies.downstreamDependencies[componentName][varName];
        let resolved = true;
        let unresolvedDependencies = [];
        let externalDependenciesResolved = true;
        for (let dependencyName in downDeps) {
          let dep = downDeps[dependencyName];

          if (dep.unresolvedSpecifiedComponent && !this.switches.ignoreUnresolvedSpecifiedComponents) {
            resolved = false;
            if (dep.unresolvedSpecifiedComponent !== componentName) {
              externalDependenciesResolved = false;
            }
            unresolvedDependencies.push({
              componentName: dep.unresolvedSpecifiedComponent,
              stateVariable: '__specified_component_identity',
            });
          }

          if (dep.requireChildLogicInitiallySatisfied && !component.childLogicSatisfied
            && !this.switches.ignoreRequireChildLogicInitiallySatisfied
          ) {
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

            let actionArgs = this.getStateVariableDefinitionArguments({ component, stateVariable: varName });
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

  findCaseInsensitiveMatches({ stateVariables, componentClass }) {

    let stateVarInfo = this.componentInfoObjects.stateVariableInfo[componentClass.componentType.toLowerCase()]

    let newVariables = [];

    for (let stateVariable of stateVariables) {
      let foundMatch = false;

      let lowerCaseVarName = stateVariable.toLowerCase();

      for (let varName in stateVarInfo.stateVariableDescriptions) {
        if (lowerCaseVarName === varName.toLowerCase()) {
          foundMatch = true;
          newVariables.push(varName);
          break;
        }
      }

      if (foundMatch) {
        continue;
      }

      for (let aliasName in stateVarInfo.aliases) {
        if (lowerCaseVarName === aliasName.toLowerCase()) {
          // don't substitute alias here, just fix case
          newVariables.push(aliasName);
          foundMatch = true;
          break;
        }
      }
      if (foundMatch) {
        continue;
      }


      let arrayEntryPrefixesLongestToShortest = Object.keys(stateVarInfo.arrayEntryPrefixes).sort((a, b) => b.length - a.length)
      for (let prefix of arrayEntryPrefixesLongestToShortest) {
        if (lowerCaseVarName.substring(0, prefix.length) === prefix.toLowerCase()) {
          let newVarName = prefix + lowerCaseVarName.substring(prefix.length);
          foundMatch = true;
          newVariables.push(newVarName);
          break;
        }
      }

      if (foundMatch) {
        continue;
      }

      // no match, so don't alter
      newVariables.push(stateVariable);

    }

    return newVariables;

  }

  matchPublicStateVariables({ stateVariables, componentClass }) {

    let stateVarInfo = this.componentInfoObjects.publicStateVariableInfo[componentClass.componentType.toLowerCase()]

    let newVariables = [];

    for (let stateVariable of stateVariables) {

      if (stateVariable in stateVarInfo.stateVariableDescriptions) {
        // found public
        newVariables.push(stateVariable);
        continue;
      }

      let varName = stateVariable;

      if (varName in stateVarInfo.aliases) {
        varName = stateVarInfo.aliases[varName];
      }

      let foundMatch = false;

      let arrayEntryPrefixesLongestToShortest = Object.keys(stateVarInfo.arrayEntryPrefixes).sort((a, b) => b.length - a.length)
      for (let prefix of arrayEntryPrefixesLongestToShortest) {
        if (varName.substring(0, prefix.length) === prefix) {
          foundMatch = true;
          break;
        }
      }

      if (foundMatch) {
        newVariables.push(stateVariable);
      } else {
        // no match, so make it a name that won't match
        newVariables.push("__not_public_" + stateVariable);
      }

    }

    return newVariables;

  }

  substituteAliases({ stateVariables, componentClass }) {

    let newVariables = [];

    let stateVarInfo = this.componentInfoObjects.stateVariableInfo[componentClass.componentType.toLowerCase()]


    for (let stateVariable of stateVariables) {
      if (stateVariable in stateVarInfo.aliases) {
        newVariables.push(stateVarInfo.aliases[stateVariable])
      } else {
        newVariables.push(stateVariable)
      }
    }

    return newVariables;

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


        this.dependencies.setUpStateVariableDependencies({
          component, stateVariable,
          allStateVariablesAffected,
          core: this,
          updatesNeeded,
          compositesBeingExpanded
        });

        let newStateVariablesToResolve = [];

        for (let varName of allStateVariablesAffected) {

          this.dependencies.checkForCircularDependency({
            componentName: component.componentName,
            varName
          });

          newStateVariablesToResolve.push(varName);

          if (component.state[varName].determineDependenciesStateVariable) {
            newStateVariablesToResolve.push(component.state[varName].determineDependenciesStateVariable)
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
    let justChangedSwitch = false;
    while ((resolvedAnotherDependency && Object.keys(updatesNeeded.unresolvedDependencies).length > 0)
      || justChangedSwitch) {
      // console.log(JSON.parse(JSON.stringify(updatesNeeded)));
      // console.log(JSON.parse(JSON.stringify(this.dependencies.downstreamDependencies)))
      // console.log(JSON.parse(JSON.stringify(this.dependencies.upstreamDependencies)))
      resolvedAnotherDependency = false;
      justChangedSwitch = false;

      // find component/state variable that
      // - had been preventing others from being resolved
      //   (i.e., is in updatesNeeded.unresolvedByDependent), and
      // - is now resolved (i.e., isn't in updatesNeeded.unresolvedDependencies)
      for (let componentName in updatesNeeded.unresolvedByDependent) {
        let componentDeleted = updatesNeeded.deletedComponents[componentName];
        let missingComponentIgnored = false;

        if (!(componentName in this.components) && !componentDeleted) {

          // if we are ignoring unresolved specified components
          // and an unresolved specified component is the only thing unresolved
          if (this.switches.ignoreUnresolvedSpecifiedComponents) {
            let varList = Object.keys(updatesNeeded.unresolvedByDependent[componentName]);
            if (varList.length === 1 && varList[0] === "__specified_component_identity") {
              missingComponentIgnored = true;
            }
          }

          if (!missingComponentIgnored) {
            // componentName doesn't exist yet (and it wasn't deleted)
            // It may be created later as a replacement of a composite
            unResolvedRefToComponentNames.push(componentName);
            continue;
          }
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
          if (varName === "__childLogic" && !componentDeleted && !this.components[componentName].childLogicSatisfied
            && !this.switches.ignoreRequireChildLogicInitiallySatisfied
          ) {
            continue;
          }

          let stateVariableDeleted = updatesNeeded.deletedStateVariables[componentName] &&
            updatesNeeded.deletedStateVariables[componentName].includes(varName);

          if (varName !== "__identity" && varName !== "__specified_component_identity" && varName !== "__replacements"
            && varName !== "__childLogic" && !componentDeleted
            && !(varName in this.components[componentName].state) && !stateVariableDeleted
          ) {
            throw Error(`Reference to invalid state variable ${varName} of ${componentName}`);
          }

          if (!(componentName in updatesNeeded.unresolvedDependencies) ||
            componentDeleted || stateVariableDeleted || missingComponentIgnored ||
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
              componentDeleted || stateVariableDeleted || missingComponentIgnored ||
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


      if (!(resolvedAnotherDependency && Object.keys(updatesNeeded.unresolvedDependencies).length > 0)) {
        // this would be the condition that would stop the loop

        if (!this.switches.ignoreUnresolvedSpecifiedComponents) {
          this.switches.ignoreUnresolvedSpecifiedComponents = true;
          justChangedSwitch = true;

        }
        if (!this.switches.ignoreRequireChildLogicInitiallySatisfied) {
          this.switches.ignoreRequireChildLogicInitiallySatisfied = true;
          justChangedSwitch = true;
        }


      }


    }

    // All attempts to resolve variables have finished
    // Either we resolved all variables or we stopped making progress

    // first, give warning if there were any references to specified component
    // names that don't exist
    // or throw an error if another dependency reference to specified component
    // that doesn't exist

    for (let componentName in this.dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName) {
      for (let dep of this.dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName[componentName]) {
        if (dep.dependencyType === "targetComponent") {
          console.error(`Reference to invalid target name ${dep.tName} by component ${dep.upstreamComponentName}`)
        } else {
          console.error(`Dependency ${dep.dependencyName} of state variable ${dep.representativeStateVariable} of component ${dep.upstreamComponentName} references unknown component ${componentName}`)
        }
      }
    }

    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      // still didn't resolve all state variables
      this.createUnresolvedMessage(unResolvedRefToComponentNames, updatesNeeded);
    }

    // turn switch back off
    this.switches.ignoreUnresolvedSpecifiedComponents = false;
    this.switches.ignoreRequireChildLogicInitiallySatisfied = false;

  }

  createUnresolvedMessage(unResolvedRefToComponentNames, updatesNeeded) {
    // create message about the unresolved variable,
    // separating out those due to unsatisfied childlogic

    let childLogicMessage = "";
    let unresolvedVarMessage = "";
    let unresolvedReferenceMessage = "";

    // TODO: this unResolvedRefToComponentNames probably doesn't do anything anymore
    // as unresolved references are now treated differently,
    // and will be picked up from dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName

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

  resetUpstreamDependentsUnresolved({ component, varName, updatesNeeded }) {
    // component/varName has newly become unresolved
    // recursively mark its upstream dependents as newly unresolved
    // and add unresolved dependencies

    // console.log(`reset upstream dependents unresolved for ${component.componentName}, ${varName}`)

    let upstream = this.dependencies.upstreamDependencies[component.componentName][varName];

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

  markStateVariableAndUpstreamDependentsStale({ component, varName, updatesNeeded }) {

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

    if (aVarWasFreshOrPartiallyFresh) {

      let result = this.processMarkStale({ component, varName, allStateVariablesAffectedObj });

      if (result.fresh) {
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
          componentName: component.componentName,
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

    }

    // we recurse on upstream dependents
    if (freshnessDecreased) {
      for (let vName in varsChanged) {
        this.markUpstreamDependentsStale({ component, varName: vName, updatesNeeded });
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
      // have to use last calculated value of arrayKeys
      // because can't evaluate state variable in middle of marking stale

      arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);

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
    let downDeps = this.dependencies.downstreamDependencies[component.componentName][varName];

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
      // have to use last calculated value of arrayKeys
      // because can't evaluate state variable in middle of marking stale

      arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);

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

  markUpstreamDependentsStale({ component, varName, updatesNeeded }) {
    // Recursively mark every upstream dependency of component/varName as stale
    // If a state variable is already stale (has a getter in place)
    // then don't recurse
    // Before marking a stateVariable as stale, run markStale function, if it exists
    // Record additional information about the staleness from result of markStale,
    // and recurse only if markStale indicates variable is actually stale

    let componentName = component.componentName;
    let getStateVar = this.getStateVariableValue;

    // console.log(`marking upstream of ${varName} of ${componentName} as stale`);

    let upstream = this.dependencies.upstreamDependencies[componentName][varName];

    let freshnessInfo;

    if (component.state[varName]) {
      freshnessInfo = component.state[varName].freshnessInfo;
    }

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

          if (upDep.originalDownstreamVariableNames.length > 0) {

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
            if (!upDep.valuesChanged[componentInd][varName]) {
              upDep.valuesChanged[componentInd][varName] = {};
            }
            upDep.valuesChanged[componentInd][varName].potentialChange = true;

            // add any additional information about the stalename of component/varName
            if (freshnessInfo) {
              upDep.valuesChanged[componentInd][varName].freshnessInfo
                = new Proxy(freshnessInfo, readOnlyProxyHandler);
            }

            foundVarChange = true;
          } else if (varName === upDep.downstreamVariableNameIfNoVariables) {
            // no original downstream variable names
            // but matched the placeholder
            // We just mark upDep as changed

            if (!upDep.valuesChanged) {
              upDep.valuesChanged = { [upDep.downstreamVariableNameIfNoVariables]: {} };
            }

            upDep.componentIdentityChanged = true;

            upDep.valuesChanged[upDep.downstreamVariableNameIfNoVariables].potentialChange = true;

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

          if (aVarWasFreshOrPartiallyFresh) {

            let result = this.processMarkStale({
              component: upDepComponent,
              varName: upVarName,
              allStateVariablesAffectedObj,
            });

            if (result.fresh) {
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
                componentName: upDep.upstreamComponentName,
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

          }

          // we recurse on upstream dependents
          if (freshnessDecreased) {
            for (let vName in varsChanged) {
              this.markUpstreamDependentsStale({
                component: upDepComponent,
                varName: vName,
                updatesNeeded,
              });
            }
          }

        }
      }
    }

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

    let addedComponents = {};
    let deletedComponents = {};

    newChildren.forEach(x => addedComponents[x.componentName] = x);


    if (!newChildrenResult.success) {
      return newChildrenResult;
    }

    return {
      success: true,
      deletedComponents,
      addedComponents,
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

    this.dependencies.updateChildAndDescendantDependencies(parent, updatesNeeded, compositesBeingExpanded);

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
        this.dependencies.updateReplacementDependencies(
          this._components[compositeName], updatesNeeded, compositesBeingExpanded
        );

        // TODO: make this more specific so just updates descendants
        // of direct parent of composite, as that's the only one that would see
        // replacements as a descendant?
        this.dependencies.updateDescendantDependencies(
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

      this.dependencies.deleteAllDownstreamDependencies({ component, updatesNeeded });

      // record any upstream dependencies that depend directly on componentName
      // (componentIdentity, componentStateVariable*)

      for (let varName in this.dependencies.upstreamDependencies[component.componentName]) {

        let upDeps = this.dependencies.upstreamDependencies[component.componentName][varName];
        for (let upDep of upDeps) {
          if (upDep.specifiedComponentName && (upDep.specifiedComponentName in componentsToDelete)) {
            let dependenciesMissingComponent = this.dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName[upDep.specifiedComponentName];
            if (!dependenciesMissingComponent) {
              dependenciesMissingComponent = this.dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName[upDep.specifiedComponentName] = [];
            }
            if (!dependenciesMissingComponent.includes(upDep)) {
              dependenciesMissingComponent.push(upDep);
            }

          }
        }
      }


      this.dependencies.deleteAllUpstreamDependencies({ component, updatesNeeded });

      if (!updatesNeeded.deletedStateVariables[component.componentName]) {
        updatesNeeded.deletedStateVariables[component.componentName] = [];
      }
      updatesNeeded.deletedStateVariables[component.componentName].push(...Object.keys(component.state))

      updatesNeeded.deletedComponents[component.componentName] = true;
      delete this.unsatisfiedChildLogic[component.componentName];

    }

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];

      // console.log(`deregistering ${componentName}`)

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
        deletedComponents,
        addedComponents,
        parentsOfDeleted,
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
      componentInfoObjects: this.componentInfoObjects,
    });

    // console.log("replacement changes for " + component.componentName);
    // console.log(replacementChanges);
    // console.log(component.replacements.map(x => x.componentName));
    // console.log(component.replacements);
    // console.log(component.unresolvedState);
    // console.log(component.unresolvedDependencies);


    let changedReplacementIdentitiesOfComposites = [];

    // iterate through all replacement changes
    for (let change of replacementChanges) {

      if (change.changeType === "add") {

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
          this.deleteReplacementsFromShadowsThenComposite({
            change, composite: component,
            componentChanges, sourceOfUpdate,
            parentsOfDeleted, deletedComponents, addedComponents,
            updatesNeeded,
            compositesBeingExpanded,
          });

        }

        if (change.serializedReplacements) {

          let serializedReplacements = change.serializedReplacements;

          let namespaceForUnamed;
          if (component.doenetAttributes.newNamespace) {
            namespaceForUnamed = component.componentName + "/";
          } else {
            namespaceForUnamed = getNamespaceFromName(component.componentName);
          }

          let createResult = this.createIsolatedComponentsSub({
            serializedComponents: serializedReplacements,
            ancestors: component.ancestors,
            updatesNeeded,
            compositesBeingExpanded,
            createNameContext: component.componentName + "|replacements",
            namespaceForUnamed,
          });

          newComponents = createResult.components;

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
            assignNamesOffset: change.assignNamesOffset,
            componentChanges, sourceOfUpdate,
            parentsOfDeleted, deletedComponents, addedComponents,
          });

          Object.assign(newReplacementsByComposite, newReplacementsForShadows)
        }

        for (let compositeName in newReplacementsByComposite) {

          changedReplacementIdentitiesOfComposites.push(compositeName);

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

          } else {
            // if not top level replacements

            // TODO: check if change.parent is appropriate dependency of composite?

            let parent = this._components[newReplacementsByComposite[compositeName].parent.componentName];

            this.spliceChildren(parent, change.indexOfDefiningChildren, newReplacements);

            this.processNewDefiningChildren({ parent, updatesNeeded, compositesBeingExpanded });

            newReplacements.forEach(x => addedComponents[x.componentName] = x);

            updatesNeeded.componentsTouched.push(...this.componentAndRenderedDescendants(parent));

            let newChange = {
              changeType: "addedReplacements",
              composite,
              newReplacements,
            };

            componentChanges.push(newChange);

          }
        }

      } else if (change.changeType === "delete") {

        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        let compsitesDeletedFrom = this.deleteReplacementsFromShadowsThenComposite({
          change, composite: component,
          componentsToDelete: change.components,
          componentChanges, sourceOfUpdate,
          parentsOfDeleted, deletedComponents, addedComponents,
          updatesNeeded,
          compositesBeingExpanded,
        });

        changedReplacementIdentitiesOfComposites.push(...compsitesDeletedFrom);


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

        if (change.replacementsToWithhold !== undefined) {
          let compositesWithAdjustedReplacements =
            this.adjustReplacementsToWithhold(component, change, componentChanges);

          changedReplacementIdentitiesOfComposites.push(...compositesWithAdjustedReplacements);

        }

        this.processChildChangesAndRecurseToShadows({ component, updatesNeeded, compositesBeingExpanded });

      }

    }

    for (let compositeName of changedReplacementIdentitiesOfComposites) {
      let composite = this._components[compositeName]
      this.dependencies.updateReplacementDependencies(composite, updatesNeeded, compositesBeingExpanded);

      // TODO: make this more specific so just updates descendants
      // of direct parent of composite, as that's the only one that would see
      // replacements as a descendant?
      this.dependencies.updateDescendantDependencies(composite, updatesNeeded, compositesBeingExpanded);

    }

    let results = {
      success: true,
      deletedComponents,
      addedComponents,
      parentsOfDeleted,
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

    let compositesDeletedFrom = [];

    if (!composite.isExpanded) {
      return compositesDeletedFrom;
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

        let additionalCompositesDeletedFrom = this.deleteReplacementsFromShadowsThenComposite({
          change,
          composite: shadowingComposite,
          componentsToDelete: shadowingComponentsToDelete,
          componentChanges, sourceOfUpdate,
          parentsOfDeleted, deletedComponents, addedComponents,
          updatesNeeded,
          compositesBeingExpanded
        });

        compositesDeletedFrom.push(...additionalCompositesDeletedFrom);

      }
    }

    if (change.changeTopLevelReplacements) {

      let firstIndex = change.firstReplacementInd;
      let numberToDelete = change.numberReplacementsToDelete;
      if (change.changeType === "add") {
        numberToDelete = change.numberReplacementsToReplace;
      }


      // delete from replacements
      let replacementsToDelete = composite.replacements.splice(firstIndex, numberToDelete);

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

    return compositesDeletedFrom;

  }

  processChildChangesAndRecurseToShadows({ component, updatesNeeded, compositesBeingExpanded }) {
    let parent = this._components[component.parentName];
    this.processNewDefiningChildren({
      parent,
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
    assignNamesOffset,
    componentChanges, sourceOfUpdate,
    parentsOfDeleted, deletedComponents, addedComponents,
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

        // TODO: not using uniqueIdentifiers used here
        // is this a problem?
        let newSerializedReplacements = replacementsToShadow.map(x => x.serialize({ forCopy: true }))
        newSerializedReplacements = postProcessCopy({
          serializedComponents: newSerializedReplacements,
          componentName: shadowingComponent.shadows.compositeName
        });


        if (shadowingComponent.constructor.assignNamesToReplacements) {

          let originalNamesAreConsistent = shadowingComponent.constructor.originalNamesAreConsistent
            && shadowingComponent.doenetAttributes.newNamespace;

          let processResult = serializeFunctions.processAssignNames({
            assignNames: shadowingComponent.doenetAttributes.assignNames,
            indOffset: assignNamesOffset,
            serializedComponents: newSerializedReplacements,
            parentName: shadowingComponent.componentName,
            parentCreatesNewNamespace: shadowingComponent.doenetAttributes.newNamespace,
            componentInfoObjects: this.componentInfoObjects,
            originalNamesAreConsistent,
          });

          newSerializedReplacements = processResult.serializedComponents;

        } else {


          // since original names came from the targetComponent
          // we can use them only if we created a new namespace
          let originalNamesAreConsistent = shadowingComponent.doenetAttributes.newNamespace;

          let processResult = serializeFunctions.processAssignNames({
            // assignNames: shadowingComponent.doenetAttributes.assignNames,
            indOffset: assignNamesOffset,
            serializedComponents: newSerializedReplacements,
            parentName: shadowingComponent.componentName,
            parentCreatesNewNamespace: shadowingComponent.doenetAttributes.newNamespace,
            componentInfoObjects: this.componentInfoObjects,
            originalNamesAreConsistent,
          });

          newSerializedReplacements = processResult.serializedComponents;

        }

        // console.log(`newSerializedReplacements for ${shadowingComponent.componentName} who shadows ${shadowingComponent.shadows.componentName}`)
        // console.log(deepClone(newSerializedReplacements));

        let newComponents;

        let unproxiedShadowingComponent = this._components[shadowingComponent.componentName];
        this.parameterStack.push(unproxiedShadowingComponent.sharedParameters, false);

        let namespaceForUnamed;
        if (shadowingComponent.doenetAttributes.newNamespace) {
          namespaceForUnamed = shadowingComponent.componentName + "/";
        } else {
          namespaceForUnamed = getNamespaceFromName(shadowingComponent.componentName);
        }

        let createResult = this.createIsolatedComponentsSub({
          serializedComponents: newSerializedReplacements,
          ancestors: shadowingComponent.ancestors,
          updatesNeeded,
          compositesBeingExpanded,
          createNameContext: shadowingComponent.componentName + "|replacements",
          namespaceForUnamed,
        });

        this.parameterStack.pop();

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
            assignNamesOffset,
            componentChanges, sourceOfUpdate,
            parentsOfDeleted, deletedComponents, addedComponents,
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

    let compositesWithAdjustedReplacements = [];

    let replacementsToWithhold = change.replacementsToWithhold;

    let changeInReplacementsToWithhold;
    if (component.replacementsToWithhold !== undefined) {
      changeInReplacementsToWithhold = replacementsToWithhold - component.replacementsToWithhold;
    }
    else {
      changeInReplacementsToWithhold = replacementsToWithhold;
    }
    if (changeInReplacementsToWithhold < 0) {
      compositesWithAdjustedReplacements.push(component.componentName)
      // Note: don't subtract one of this last ind, as slice doesn't include last ind
      let lastIndToStopWithholding = component.replacements.length - replacementsToWithhold;
      let firstIndToStopWithholding = component.replacements.length - replacementsToWithhold + changeInReplacementsToWithhold;
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
      compositesWithAdjustedReplacements.push(component.componentName)
      let firstIndToStartWithholding = component.replacements.length - replacementsToWithhold;
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
    component.replacementsToWithhold = replacementsToWithhold;

    if (component.shadowedBy) {
      for (let shadowingComponent of component.shadowedBy) {
        let additionalcompositesWithAdjustedReplacements =
          this.adjustReplacementsToWithhold(shadowingComponent, change, componentChanges);
        compositesWithAdjustedReplacements.push(...additionalcompositesWithAdjustedReplacements)
      }
    }

    return compositesWithAdjustedReplacements;

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
    inheritedComponentType = inheritedComponentType.toLowerCase();
    baseComponentType = baseComponentType.toLowerCase();
    if (inheritedComponentType === baseComponentType) {
      return true;
    }
    return this.allComponentClasses[baseComponentType].isPrototypeOf(
      this.allComponentClasses[inheritedComponentType]
    );
  }

  isStandardComposite(componentType) {
    let componentClass = this.allComponentClasses[componentType];
    if (!componentClass) {
      return false;
    }
    return this.isInheritedComponentType({
      inheritedComponentType: componentType,
      baseComponentType: "_composite"
    })
      && !componentClass.treatAsComponentForRecursiveReplacements
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

  requestUpdate({ updateInstructions, transient = false, event }) {

    if (this.flags.readOnly) {

      let sourceInformation = {};

      for (let instruction of updateInstructions) {

        let componentSourceInformation = sourceInformation[instruction.componentName];
        if (!componentSourceInformation) {
          componentSourceInformation = sourceInformation[instruction.componentName] = {};
        }

        if (instruction.sourceInformation) {
          Object.assign(componentSourceInformation, instruction.sourceInformation);
        }
      }

      this.updateRendererInstructions({
        componentNames: updateInstructions.map(x => x.componentName),
        sourceOfUpdate: { sourceInformation }
      });

      this.finishUpdate();

      return { success: false };
    }

    let updatesNeeded = {
      componentsTouched: [],
      compositesToExpand: new Set([]),
      compositesToUpdateReplacements: [],
      componentsToUpdateDependencies: [],
      unresolvedDependencies: {},
      unresolvedByDependent: {},
      deletedStateVariables: {},
      deletedComponents: {},
      recreatedComponents: {},
      itemScoreChanges: new Set(),
      parentsToUpdateDescendants: new Set(),
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

    let nFailures = Infinity;
    while (nFailures > 0) {
      let result = this.executeUpdateStateVariables({
        newStateVariableValues,
        updatesNeeded,
        sourceOfUpdate: {
          sourceInformation,
          local: true,
        }
      })
      if (!(result.nFailures && result.nFailures < nFailures)) {
        break;
      }
      nFailures = result.nFailures;
    }

    // //TODO: Inside for loop?
    // this.executeUpdateStateVariables({
    //   newStateVariableValues,
    //   updatesNeeded,
    //   sourceOfUpdate: {
    //     sourceInformation,
    //     local: true,
    //   }
    // });

    if (updatesNeeded.itemScoreChanges.size > 0) {
      if (event) {
        if (!event.context) {
          event.context = {};
        }
        if (!event.context.itemCreditAchieved) {
          event.context.itemCreditAchieved = {};
        }
        event.context.documentCreditAchieved = this.document.stateValues.creditAchieved;
      }
      for (let itemNumber of updatesNeeded.itemScoreChanges) {
        if (this.externalFunctions.submitResponse) {
          this.externalFunctions.submitResponse({
            itemNumber,
            itemCreditAchieved: this.document.stateValues.itemCreditAchieved[itemNumber],
            callBack: this.submitResponseCallBack,
          });
        }
        if (event) {
          event.context.itemCreditAchieved[Number(itemNumber) + 1] = this.document.stateValues.itemCreditAchieved[itemNumber]
        }
      }
    }

    // evalute itemCreditAchieved so that will be fresh
    // and can detect changes when it is marked stale
    this.document.stateValues.itemCreditAchieved;

    if (event) {
      this.requestRecordEvent(event);
    }

    return { success: true };
  }

  requestRecordEvent(event) {
    if (this.externalFunctions.recordEvent) {

      // event.object.documentTitle = this.document.stateValues.title;
      event.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      if (!event.result) {
        event.result = {};
      }
      if (!event.context) {
        event.context = {};
      }

      this.externalFunctions.recordEvent(event);
    }
  }

  executeUpdateStateVariables({
    newStateVariableValues,
    updatesNeeded,
    sourceOfUpdate,
    preliminary = false
  }) {

    let executeResult = {};

    let compositesBeingExpanded = [];

    // merge new variables changed from newStateVariableValues into changedStateVariables
    for (let cName in newStateVariableValues) {
      let changedSvs = this.changedStateVariables[cName];
      if (!changedSvs) {
        changedSvs = this.changedStateVariables[cName] = {};
      }
      for (let vName in newStateVariableValues[cName]) {
        let sVarObj = this._components[cName].state[vName];
        if (sVarObj.isArray) {
          if (!changedSvs[vName]) {
            changedSvs[vName] = new Set();
          }
          for (let key in newStateVariableValues[cName][vName]) {
            if (key === "mergeObject") {
              continue;
            }
            changedSvs[vName].add(key);
          }
        } else {
          // shouldn't have arrayEntries, so don't need to check
          changedSvs[vName] = true;
        }
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
        recreatedComponents: {},
        itemScoreChanges: new Set(),
        parentsToUpdateDescendants: new Set(),
      }
    }

    let previousUnsatisfiedChildLogic = Object.assign({}, this.unsatisfiedChildLogic);


    let processResult = this.processNewStateVariableValues(newStateVariableValues, updatesNeeded);
    Object.assign(executeResult, processResult);

    // calculate any replacement changes on composites touched
    this.replacementChangesFromCompositesToUpdate({ updatesNeeded, compositesBeingExpanded });

    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      updatesNeeded.unresolvedMessage = "";
      this.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
    }


    this.dependencies.updateDependencies(updatesNeeded, compositesBeingExpanded);

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



    // if preliminary, we don't update renderer instructions or display information
    if (preliminary) {
      return executeResult;
    }

    // get unique list of components touched
    updatesNeeded.componentsTouched = [...new Set(updatesNeeded.componentsTouched)];

    this.updateRendererInstructions({
      componentNames: updatesNeeded.componentsTouched,
      sourceOfUpdate,
      recreatedComponents: updatesNeeded.recreatedComponents
    });

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

    return executeResult;

  }

  replacementChangesFromCompositesToUpdate({
    updatesNeeded, compositesBeingExpanded
  }) {

    let compositesToUpdateReplacements = [...new Set(updatesNeeded.compositesToUpdateReplacements)];
    updatesNeeded.compositesToUpdateReplacements = [];

    let compositesNotReady = [];

    let nPasses = 0;

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
              this.changedStateVariables[componentName] = {};
              for (let varName in this._components[componentName].state) {
                let stateVarObj = this._components[componentName].state[varName];
                if (stateVarObj.isArray) {
                  this.changedStateVariables[componentName][varName] =
                    new Set(stateVarObj.getAllArrayKeys(stateVarObj.arraySize))
                } else if (!stateVarObj.isArrayEntry) {
                  this.changedStateVariables[componentName][varName] = true;
                }
              }
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

      // just in case have infinite loop, throw error after 100 passes
      nPasses++;
      if (nPasses > 100) {
        throw Error(`Seem to have an infinite loop while calculating replacement changes`)
      }

    }

    updatesNeeded.compositesToUpdateReplacements = compositesNotReady;

    return { componentChanges };
  }

  processNewStateVariableValues(newStateVariableValues, updatesNeeded) {

    // console.log('process new state variable values')
    // console.log(JSON.parse(JSON.stringify(newStateVariableValues)));

    let nFailures = 0;

    let getStateVar = this.getStateVariableValue;

    for (let cName in newStateVariableValues) {
      let comp = this._components[cName];

      if (comp === undefined) {
        console.warn(`can't update state variables of component ${cName}, as it doesn't exist.`);
        nFailures += 1;
        continue;
      }

      let newComponentStateVariables = newStateVariableValues[cName];

      for (let vName in newComponentStateVariables) {


        let compStateObj = comp.state[vName];
        if (compStateObj === undefined) {
          console.warn(`can't update state variable ${vName} of component ${cName}, as it doesn't exist.`);
          nFailures += 1;
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


            // TODO: what about a .set function here?
            for (let arrayKey in newComponentStateVariables[vName]) {

              if (arrayKey === "mergeObject") {
                continue;
              }

              if (!(
                compStateObj.essential || compStateObj.essentialByArrayKey[arrayKey]
              )) {
                console.warn(`can't update arrayKey ${arrayKey}  of state variable ${vName} of component ${cName}, as it is not an essential state variable.`);
                nFailures += 1;
                continue;
              }

              let setResult = compStateObj.setArrayValue({
                value: newComponentStateVariables[vName][arrayKey],
                arrayKey,
                arraySize: compStateObj.arraySize
              });

              nFailures += setResult.nFailures;

              // mark any array entry state variables containing arrayKey
              // as affected

              let varNamesContainingArrayKey = compStateObj.varNamesIncludingArrayKeys[arrayKey];
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
            this.dependencies.recordActualChangeInUpstreamDependencies({
              component: comp, varName: arrayEntryName,
            })
          }
        } else {

          // don't have array

          if (!compStateObj.essential) {
            console.warn(`can't update state variable ${vName} of component ${cName}, as it is not an essential state variable.`);
            nFailures += 1;
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

        this.dependencies.recordActualChangeInUpstreamDependencies({
          component: comp, varName: vName,
        })

      }
    }

    return { nFailures };

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

    let inverseDefinitionArgs = this.getStateVariableDefinitionArguments({ component, stateVariable });
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
        // in getStateVariableDefinitionArguments
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

    let combinedInstructions = [];

    let arrayInstructionInProgress;

    for (let newInstruction of inverseResult.instructions) {
      let foundArrayInstruction = false;

      if (newInstruction.setDependency) {
        let dependencyName = newInstruction.setDependency;

        let dep = this.dependencies.downstreamDependencies[component.componentName][stateVariable][dependencyName];
        if (["stateVariable", "parentStateVariable"].includes(dep.dependencyType)
          && dep.downstreamComponentNames.length === 1
        ) {

          let dComponentName = dep.downstreamComponentNames[0];
          let dVarName = dep.mappedDownstreamVariableNamesByComponent[0][0];

          let depStateVarObj = this._components[dComponentName].state[dVarName]

          if (depStateVarObj.isArrayEntry || depStateVarObj.isArray) {

            let arrayStateVariable = depStateVarObj.isArrayEntry ? depStateVarObj.arrayStateVariable : dVarName;

            if (arrayInstructionInProgress && !(
              arrayInstructionInProgress.componentName === dComponentName
              && arrayInstructionInProgress.stateVariable === arrayStateVariable
              && arrayInstructionInProgress.shadowedVariable === newInstruction.shadowedVariable
              && arrayInstructionInProgress.treatAsInitialChange === newInstruction.treatAsInitialChange
            )) {
              // arrayInstructionInProgress didn't match,
              // so add it to combined instructions
              combinedInstructions.push(arrayInstructionInProgress);
              arrayInstructionInProgress = undefined;
            }

            // haven't implemented combining when have additional dependency values
            if (!newInstruction.additionalDependencyValues) {
              foundArrayInstruction = true;

              if (!arrayInstructionInProgress) {
                arrayInstructionInProgress = {
                  combinedArray: true,
                  componentName: dComponentName,
                  stateVariable: arrayStateVariable,
                  shadowedVariable: newInstruction.shadowedVariable,
                  treatAsInitialChange: newInstruction.treatAsInitialChange,
                  desiredValue: {}
                }
              }

              if (depStateVarObj.isArrayEntry) {

                let arrayKeys = depStateVarObj.arrayKeys;

                if (arrayKeys.length === 1) {
                  arrayInstructionInProgress.desiredValue[arrayKeys[0]] = newInstruction.desiredValue
                } else {
                  for (let [ind, arrayKey] of arrayKeys.entries()) {
                    arrayInstructionInProgress.desiredValue[arrayKey] = newInstruction.desiredValue[ind];
                  }
                }
              } else {
                Object.assign(arrayInstructionInProgress.desiredValue, newInstruction.desiredValue);
              }


            }



          }
        }
      }

      if (!foundArrayInstruction) {
        if (arrayInstructionInProgress) {
          combinedInstructions.push(arrayInstructionInProgress);
          arrayInstructionInProgress = undefined;
        }
        combinedInstructions.push(newInstruction);
      }

    }

    if (arrayInstructionInProgress) {
      combinedInstructions.push(arrayInstructionInProgress);
      arrayInstructionInProgress = undefined;
    }

    for (let newInstruction of combinedInstructions) {
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

        let dep = this.dependencies.downstreamDependencies[component.componentName][stateVariable][dependencyName];

        if (dep.dependencyType === "child") {
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
            instruction: inst,
            initialChange: newInstruction.treatAsInitialChange === true,
            workspace, updatesNeeded,
            newStateVariableValues
          });
        } else if (["stateVariable", "parentStateVariable"].includes(dep.dependencyType)
          && dep.downstreamComponentNames.length === 1
        ) {

          let dComponentName = dep.downstreamComponentNames[0];
          let dVarName = dep.mappedDownstreamVariableNamesByComponent[0][0];

          let inst = {
            componentName: dComponentName,
            stateVariable: dVarName,
            value: newInstruction.desiredValue,
            overrideFixed: instruction.overrideFixed,
            shadowedVariable: newInstruction.shadowedVariable,
          };
          if (newInstruction.additionalDependencyValues) {
            // it is possible to simultaneously set the values of multiple
            // component state variables, if they share a definition
            // i.e. are in additionalStateVariablesDefined

            let stateVarObj = this.components[dComponentName].state[dVarName]
            for (let dependencyName2 in newInstruction.additionalDependencyValues) {
              let dep2 = this.dependencies.downstreamDependencies[component.componentName][stateVariable][dependencyName2];
              if (!(["stateVariable", "parentStateVariable"].includes(dep2.dependencyType)
                && dep2.downstreamComponentNames.length === 1)
              ) {
                console.warn(`Can't simultaneously set additional dependency value ${dependencyName2} if it isn't a state variable`);
                continue;
              }

              let varName2 = dep2.mappedDownstreamVariableNamesByComponent[0][0];
              if (dep2.downstreamComponentNames[0] !== dComponentName ||
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
            instruction: inst,
            initialChange: newInstruction.treatAsInitialChange === true,
            workspace, updatesNeeded,
            newStateVariableValues
          });
        } else {
          throw Error(`unimplemented dependency type ${dep.dependencyType} in requestComponentChanges`)
        }

      } else if (newInstruction.combinedArray) {

        let inst = {
          componentName: newInstruction.componentName,
          stateVariable: newInstruction.stateVariable,
          value: newInstruction.desiredValue,
          overrideFixed: instruction.overrideFixed,
          shadowedVariable: newInstruction.shadowedVariable,
        };

        this.requestComponentChanges({
          instruction: inst,
          initialChange: newInstruction.treatAsInitialChange === true,
          workspace, updatesNeeded,
          newStateVariableValues
        });
      } else if (newInstruction.deferSettingDependency) {
        let dependencyName = newInstruction.deferSettingDependency;

        let dep = this.dependencies.downstreamDependencies[component.componentName][stateVariable][dependencyName];

        if (dep.dependencyType === "child") {
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
        console.log(newInstruction);
        throw Error(`Unrecognized instruction in inverse definition of ${stateVariable} of ${component.componentName}`)
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

      this.coreFunctions.requestUpdate({
        updateType: "updateRendererOnly",
      });
    } else if (results.viewedSolution) {
      console.log(`******** Viewed solution for ${scoredComponent.componentName}`);
      this.coreFunctions.requestUpdate({
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

    console.log(`get deffered state variable`)
    console.log(component.componentName, upstreamComponent.componentName)
    console.log(upstreamStateVariable)
    let inverseResult = inverseDefinition({ dependencyValues, stateValues: upstreamComponent.stateValues });

    if (!inverseResult.success) {
      console.warn(`Inverse definition for deferring state variable failed. component: ${component.componentName}, stateVariable: ${stateVariable}, upstreamComponent: ${upstreamComponent.componentName}, upstreamStateVariable: ${upstreamStateVariable}`);
      return undefined;
    }

    for (let newInstruction of inverseResult.instructions) {
      if (newInstruction.setDependency) {
        let dependencyName = newInstruction.setDependency;

        let dep = this.dependencies.downstreamDependencies[upstreamComponent.componentName][upstreamStateVariable][dependencyName];

        if (dep.dependencyType === "child") {
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

  calculateScoredItemNumberOfContainer(componentName) {

    let component = this._components[componentName];
    let ancestorNames = [
      ...component.ancestors.slice(0, -1).reverse().map(x => x.componentName),
      componentName
    ];
    let scoredComponent;
    let scoredItemNumber;
    for (let [index, scored] of this.document.stateValues.scoredDescendants.entries()) {
      for (let ancestorName of ancestorNames) {
        if (scored.componentName === ancestorName) {
          scoredComponent = ancestorName;
          scoredItemNumber = index + 1;
          break;
        }
      }
      if (scoredComponent !== undefined) {
        break;
      }
    }

    // if component wasn't inside a scoredComponent and isn't a scoredComponent itself
    // then let the scoredComponent be the document itself
    if (scoredComponent === undefined) {
      scoredComponent = this.document.componentName;
      scoredItemNumber = this.document.stateValues.scoredDescendants.length;
    }

    return { scoredItemNumber, scoredComponent };
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
      this.coreFunctions.cancelAnimationFrame(id);
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

  if (propertySpecification.trim) {
    value = value.trim();
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
