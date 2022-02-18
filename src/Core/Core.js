import readOnlyProxyHandler from './ReadOnlyProxyHandler';
import ParameterStack from './ParameterStack';
import Numerics from './Numerics';
import { prng_alea } from 'esm-seedrandom';
import me from 'math-expressions';
import { createUniqueName, getNamespaceFromName } from './utils/naming';
import * as serializeFunctions from './utils/serializedStateProcessing';
import { deepCompare, deepClone } from './utils/deepFunctions';
import createStateProxyHandler from './StateProxyHandler';
import { convertAttributesForComponentType, postProcessCopy } from './utils/copy';
import { flattenDeep, mapDeep } from './utils/array';
import { DependencyHandler } from './Dependencies';
import { preprocessMathInverseDefinition } from './utils/math';
import { returnDefaultGetArrayKeysFromVarName } from './utils/stateVariables';
import { nanoid } from 'nanoid';
import { CIDFromDoenetML } from './utils/cid';
import { preprocessForPostMessage } from './CoreWorker';
import createComponentInfoObjects from './utils/componentInfoObjects';

// string to componentClass: this.componentInfoObjects.allComponentClasses["string"]
// componentClass to string: componentClass.componentType

export default class Core {
  constructor({ doenetML, doenetId, attemptNumber,
    requestedVariant,
    flags = {},
    stateVariableChanges = {},
    coreId }) {
    // console.time('core');


    this.coreId = coreId;
    this.doenetId = doenetId;
    this.attemptNumber = attemptNumber;

    this.numerics = new Numerics();
    // this.flags = new Proxy(flags, readOnlyProxyHandler); //components shouldn't modify flags
    this.flags = flags;

    this.executeProcesses = this.executeProcesses.bind(this);
    this.requestUpdate = this.requestUpdate.bind(this);
    this.performUpdate = this.performUpdate.bind(this);
    this.requestAction = this.requestAction.bind(this);
    this.performAction = this.performAction.bind(this);
    this.recordSolutionView = this.recordSolutionView.bind(this);
    this.triggerChainedActions = this.triggerChainedActions.bind(this);
    this.requestRecordEvent = this.requestRecordEvent.bind(this);
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this._requestAnimationFrame = this._requestAnimationFrame.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.calculateScoredItemNumberOfContainer = this.calculateScoredItemNumberOfContainer.bind(this);

    this.finishCoreConstruction = this.finishCoreConstruction.bind(this);
    this.getStateVariableValue = this.getStateVariableValue.bind(this);
    // this.submitResponseCallBack = this.submitResponseCallBack.bind(this);

    this.postUpdateRenderers = async function (args, init = false) {

      postMessage({
        messageType: "updateRenderers",
        args,
        init
      })
    }
    this.coreReadyCallback = async function () {

      postMessage({
        messageType: "coreCreated",
        args: {
          generatedVariantInfo: deepClone(await this.document.stateValues.generatedVariantInfo),
          itemVariantInfo: deepClone(await this.document.stateValues.itemVariantInfo),
          allPossibleVariants: deepClone(await this.document.sharedParameters.allPossibleVariants),
          rendererTypesInDocument: deepClone(this.rendererTypesInDocument),
          documentToRender: this.documentRendererInstructions,
          scoredItemWeights: await this.scoredItemWeights,
        }
      })



      // coreReadyCallback(this);

      this.requestRecordEvent({
        verb: "experienced",
        object: {
          componentName: this.document.componentName,
          componentType: "document",
        },
      })
    }.bind(this);


    this.componentInfoObjects = createComponentInfoObjects(flags);

    this.rendererStateVariables = {};
    for (let componentType in this.componentInfoObjects.allComponentClasses) {
      Object.defineProperty(this.rendererStateVariables, componentType, {
        get: function () {
          let varDescriptions = this.componentInfoObjects.allComponentClasses[componentType].returnStateVariableInfo({
            onlyForRenderer: true, flags: this.flags
          }).stateVariableDescriptions;
          delete this.rendererStateVariables[componentType];
          return this.rendererStateVariables[componentType] = varDescriptions;
        }.bind(this),
        configurable: true
      })
    }




    this.coreFunctions = {
      requestUpdate: this.requestUpdate,
      performUpdate: this.performUpdate,
      requestAction: this.requestAction,
      performAction: this.performAction,
      triggerChainedActions: this.triggerChainedActions,
      requestRecordEvent: this.requestRecordEvent,
      requestAnimationFrame: this.requestAnimationFrame,
      cancelAnimationFrame: this.cancelAnimationFrame,
      calculateScoredItemNumberOfContainer: this.calculateScoredItemNumberOfContainer,
      recordSolutionView: this.recordSolutionView,
    }

    this.updateInfo = {
      componentsToUpdateRenderers: [],
      compositesToExpand: new Set([]),
      compositesToUpdateReplacements: [],
      inactiveCompositesToUpdateReplacements: [],
      componentsToUpdateActionChaining: {},

      unresolvedDependencies: {},
      unresolvedByDependent: {},
      deletedStateVariables: {},
      deletedComponents: {},
      recreatedComponents: {},
      // parentsToUpdateDescendants: new Set(),
      compositesBeingExpanded: [],
      // stateVariableUpdatesForMissingComponents: deepClone(stateVariableChanges),
      stateVariableUpdatesForMissingComponents: JSON.parse(JSON.stringify(stateVariableChanges, serializeFunctions.serializedComponentsReplacer), serializeFunctions.serializedComponentsReviver),
    }

    this.animationIDs = {};
    this.lastAnimationID = 0;
    this.requestedVariant = requestedVariant;

    // console.time('serialize doenetML');

    this.parameterStack = new ParameterStack();

    this.parameterStack.parameters.rngClass = prng_alea;

    this.initialized = false;
    this.initializedPromiseResolves = [];
    this.resolveInitialized = () => {
      this.initializedPromiseResolves.forEach(resolve => resolve(true))
      this.initialized = true;
    }
    this.getInitializedPromise = () => {
      if (this.initialized) {
        return Promise.resolve(true);
      } else {
        return new Promise((resolve, reject) => {
          this.initializedPromiseResolves.push(resolve)
        })
      }
    }

    CIDFromDoenetML(doenetML)
      .then(CID =>
        serializeFunctions.expandDoenetMLsToFullSerializedComponents({
          CIDs: [CID],
          doenetMLs: [doenetML],
          componentInfoObjects: this.componentInfoObjects,
          flags: this.flags,
        }))
      .then(this.finishCoreConstruction)
  }


  async finishCoreConstruction({
    CIDs,
    fullSerializedComponents,
  }) {

    this.CID = CIDs[0];

    let serializedComponents = fullSerializedComponents[0];

    serializeFunctions.addDocumentIfItsMissing(serializedComponents);

    serializeFunctions.createComponentNames({
      serializedComponents,
      componentInfoObjects: this.componentInfoObjects,
    });

    // console.log(`serialized components at the beginning`)
    // console.log(deepClone(serializedComponents));


    this.documentName = serializedComponents[0].componentName;
    serializedComponents[0].doenetAttributes.CID = this.CID;

    this._components = {};
    this.componentsToRender = {};
    this.componentsWithChangedChildrenToRender = new Set([]);

    this.stateVariableChangeTriggers = {};
    this.actionsChangedToActions = {};
    this.originsOfActionsChangedToActions = {};

    this.essentialValuesSavedInDefinition = {};

    this._renderComponents = [];
    this._renderComponentsByName = {};
    this._graphRenderComponents = [];

    this.processQueue = [];

    this.resolveRecordSolutionView = {};

    this.dependencies = new DependencyHandler({
      _components: this._components,
      componentInfoObjects: this.componentInfoObjects,
      core: this,
    });

    this.unmatchedChildren = {};


    // console.timeEnd('serialize doenetML');

    if (this.requestedVariant !== undefined) {
      this.parameterStack.parameters.variant = this.requestedVariant;
    }
    serializedComponents[0].variants = {
      desiredVariant: this.parameterStack.parameters.variant
    }

    // //Make these variables available for cypress
    // window.state = {
    //   components: this._components,
    //   componentsToRender: this.componentsToRender,
    //   renderedComponentTypes: this.renderedComponentTypes,
    //   dependencies: this.dependencies,
    //   core: this,
    //   componentInfoObjects: this.componentInfoObjects,
    // }

    this.changedStateVariables = {};

    await this.addComponents({
      serializedComponents,
      initialAdd: true,
    })

    this.updateInfo.componentsToUpdateRenderers = [];

    // evalute itemCreditAchieved so that will be fresh
    // and can detect changes when it is marked stale
    await this.document.stateValues.itemCreditAchieved;

    // console.log(serializedComponents)
    // console.timeEnd('start up time');
    // console.log("** components at the end of the core constructor **");
    // console.log(this._components);


    this.coreReadyCallback()

    this.resolveInitialized();

  }


  async addComponents({ serializedComponents, parentName,
    indexOfDefiningChildren, initialAdd = false,
    assignNamesOffset
  }) {

    if (!Array.isArray(serializedComponents)) {
      serializedComponents = [serializedComponents];
    }

    let parent;
    let ancestors = [];
    let createNameContext = "";

    if (!initialAdd) {

      parent = this._components[parentName];
      if (!parent) {
        console.warn(`Cannot add children to parent ${parentName} as ${parentName} does not exist`)
        return [];
      }

      if (parent.isShadow) {
        console.warn(`Cannot add children to parent ${parentName} as it is a shadow component.`);
        return [];
      }

      ancestors = [
        {
          componentName: parentName,
          componentClass: parent.constructor,
        },
        ...parent.ancestors
      ];

      this.parameterStack.push(parent.sharedParameters, false);

      if (!this.nTimesAddedComponents) {
        this.nTimesAddedComponents = 1;
      } else {
        this.nTimesAddedComponents++;
      }

      createNameContext = `addComponents${this.nTimesAddedComponents}`;

    }
    let createResult = await this.createIsolatedComponents({
      serializedComponents, ancestors, createNameContext,
    });
    if (!initialAdd) {
      this.parameterStack.pop();
    }

    if (createResult.success !== true) {
      throw Error(createResult.message);
    }

    const newComponents = createResult.components;

    let deletedComponents = {};
    let addedComponents = {};
    newComponents.forEach(x => addedComponents[x.componentName] = x);

    if (initialAdd) {
      if (newComponents.length !== 1) {
        throw Error("Initial components need to be an array of just one component.");
      }
      // this.setAncestors(newComponents[0]);
      this.document = newComponents[0];

      await this.expandAllComposites(this.document);

      await this.expandAllComposites(this.document, true);

      // calculate any replacement changes on composites touched
      await this.replacementChangesFromCompositesToUpdate();

      let results = await this.initializeRenderedComponentInstruction(this.document);

      this.documentRendererInstructions = results.componentToRender;

      let updateInstructions = [{
        instructionType: "updateRendererStates",
        rendererStatesToUpdate: results.rendererStatesToUpdate,
      }]

      this.postUpdateRenderers(updateInstructions, true)

      await this.processStateVariableTriggers();

    } else {
      if (parent === undefined) {
        throw Error("Must specify parent when adding components.");
      }
      if (indexOfDefiningChildren === undefined) {
        indexOfDefiningChildren = parent.definingChildren.length;
      }

      let addResults = await this.addChildrenAndRecurseToShadows({
        parent,
        indexOfDefiningChildren: indexOfDefiningChildren,
        newChildren: newComponents,
        assignNamesOffset
      });
      if (!addResults.success) {
        throw Error("Couldn't satisfy child logic result.  Need informative error message");
      }
      Object.assign(addedComponents, addResults.addedComponents);
      Object.assign(deletedComponents, addResults.deletedComponents);

      await this.expandAllComposites(this.document);
      await this.expandAllComposites(this.document, true);

      // calculate any replacement changes on composites touched
      await this.replacementChangesFromCompositesToUpdate();

      await this.updateRendererInstructions({
        componentNamesToUpdate: await this.componentAndRenderedDescendants(parent)
      });
      await this.processStateVariableTriggers();

    }

    return newComponents;
  }


  async updateRendererInstructions({ componentNamesToUpdate, sourceOfUpdate, recreatedComponents = {} }) {

    let deletedRenderers = [];

    let updateInstructions = [];
    let rendererStatesToUpdate = [];

    let newChildrenInstructions = {};

    //TODO: Figure out what we need from here
    for (let componentName of this.componentsWithChangedChildrenToRender) {
      if (componentName in this.componentsToRender) {
        // check to see if current children who render are
        // different from last time rendered

        let currentChildIdentifiers = [];
        let unproxiedComponent = this._components[componentName];
        let indicesToRender = [];

        if (unproxiedComponent && unproxiedComponent.constructor.renderChildren) {
          if (!unproxiedComponent.childrenMatched) {
            await this.deriveChildResultsFromDefiningChildren({
              parent: unproxiedComponent, expandComposites: true, forceExpandComposites: true,
            });
          }

          indicesToRender = await this.returnActiveChildrenIndicesToRender(unproxiedComponent);

          let renderedInd = 0;
          for (let [ind, child] of unproxiedComponent.activeChildren.entries()) {
            if (indicesToRender.includes(ind)) {
              if (child.rendererType) {
                currentChildIdentifiers.push(`componentName:${child.componentName}`)
                renderedInd++;
              } else if (typeof child === "string") {
                currentChildIdentifiers.push(`string${renderedInd}:${child}`)
                renderedInd++;
              } else if (typeof child === "number") {
                currentChildIdentifiers.push(`number${renderedInd}:${child.toString()}`)
                renderedInd++;
              }
            }
          }

        }


        let previousChildRenderers = this.componentsToRender[componentName].children;

        let previousChildIdentifiers = [];
        for (let [ind, child] of previousChildRenderers.entries()) {
          if (child.componentName) {
            previousChildIdentifiers.push(`componentName:${child.componentName}`)
          } else if (typeof child === "string") {
            previousChildIdentifiers.push(`string${ind}:${child}`)
          } else if (typeof child === "number") {
            previousChildIdentifiers.push(`number${ind}:${child.toString()}`)
          }
        }

        if (currentChildIdentifiers.length !== previousChildIdentifiers.length
          || currentChildIdentifiers.some((v, i) => v !== previousChildIdentifiers[i])
        ) {

          // delete old renderers
          for (let child of previousChildRenderers) {
            if (child.componentName) {
              let deletedNames = this.deleteFromComponentsToRender({
                componentName: child.componentName,
                recurseToChildren: true
              });
              deletedRenderers.push(...deletedNames);
            }
          }

          // create new renderers
          let childrenToRender = [];
          if (indicesToRender.length > 0) {
            for (let [ind, child] of unproxiedComponent.activeChildren.entries()) {
              if (indicesToRender.includes(ind)) {
                if (child.rendererType) {
                  let results = await this.initializeRenderedComponentInstruction(child);
                  childrenToRender.push(results.componentToRender);
                  rendererStatesToUpdate.push(...results.rendererStatesToUpdate);
                } else if (typeof child === "string") {
                  childrenToRender.push(child);
                } else if (typeof child === "number") {
                  childrenToRender.push(child.toString())
                }
              }
            }
          }

          this.componentsToRender[componentName].children = childrenToRender;

          newChildrenInstructions[componentName] = childrenToRender;

          this.componentsWithChangedChildrenToRender.delete(componentName);

          if (!componentNamesToUpdate.includes(componentName)) {
            componentNamesToUpdate.push(componentName);
          }

        }

      }
    }


    // reset for next time
    this.componentsWithChangedChildrenToRender = new Set([]);


    for (let componentName of componentNamesToUpdate) {
      if (componentName in this.componentsToRender
        // && !deletedRenderers.includes(componentName)  TODO: what if recreate with same name?
      ) {
        let component = this._components[componentName];
        if (component) {
          let stateValuesForRenderer = {};
          for (let stateVariable in component.state) {
            if (component.state[stateVariable].forRenderer) {
              let value = preprocessForPostMessage(await component.state[stateVariable].value);
              // if (value !== null && typeof value === 'object') {
              //   value = new Proxy(value, readOnlyProxyHandler)
              // }
              stateValuesForRenderer[stateVariable] = value;
            }
          }

          let newRendererState = {
            componentName,
            stateValues: stateValuesForRenderer,
            rendererType: component.rendererType,  // TODO: need this to ignore baseVariables change: is this right place?
          }

          // only add childrenInstructions if they changed
          if (newChildrenInstructions[componentName]) {
            newRendererState.childrenInstructions = newChildrenInstructions[componentName];
          }

          rendererStatesToUpdate.push(newRendererState);
        }
      }
    }


    // rendererStatesToUpdate = rendererStatesToUpdate.filter(x => !deletedRenderers.includes(x))
    if (rendererStatesToUpdate.length > 0) {
      let instruction = {
        instructionType: "updateRendererStates",
        rendererStatesToUpdate,
        sourceOfUpdate,
      }
      updateInstructions.splice(0, 0, instruction);
    }

    this.postUpdateRenderers(updateInstructions)

  }

  async initializeRenderedComponentInstruction(component) {

    if (component.rendererType === undefined) {
      return;
    }

    if (!component.childrenMatched) {
      await this.deriveChildResultsFromDefiningChildren({
        parent: component, expandComposites: true, //forceExpandComposites: true,
      });
    }


    let rendererStatesToUpdate = [];

    let stateValuesForRenderer = {};
    for (let stateVariable in component.state) {
      if (component.state[stateVariable].forRenderer) {
        stateValuesForRenderer[stateVariable] = preprocessForPostMessage(await component.state[stateVariable].value);
      }
    }

    let componentName = component.componentName;


    let childrenToRender = [];
    if (component.constructor.renderChildren) {
      let indicesToRender = await this.returnActiveChildrenIndicesToRender(component);
      for (let [ind, child] of component.activeChildren.entries()) {
        if (indicesToRender.includes(ind)) {
          if (child.rendererType) {
            let results = await this.initializeRenderedComponentInstruction(child);
            childrenToRender.push(results.componentToRender);
            rendererStatesToUpdate.push(...results.rendererStatesToUpdate);

          } else if (typeof child === "string") {
            childrenToRender.push(child);
          } else if (typeof child === "number") {
            childrenToRender.push(child.toString())
          }
        }
      }
    }

    rendererStatesToUpdate.push({
      componentName,
      stateValues: stateValuesForRenderer,
      childrenInstructions: childrenToRender,
    });

    this.componentsWithChangedChildrenToRender.delete(componentName);


    let requestActions = {};
    for (let actionName in component.actions) {
      requestActions[actionName] = {
        actionName,
        componentName: component.componentName
      }
    }

    for (let actionName in component.externalActions) {
      let action = await component.externalActions[actionName];
      if (action) {
        requestActions[actionName] = {
          actionName,
          componentName: action.componentName,
        }
      }
    }

    let rendererInstructions = {
      componentName: componentName,
      componentType: component.componentType,
      rendererType: component.rendererType,
      actions: requestActions
    }

    this.componentsToRender[componentName] = {
      children: childrenToRender
    };


    return { componentToRender: rendererInstructions, rendererStatesToUpdate };
  }

  deleteFromComponentsToRender({
    componentName,
    recurseToChildren = true,
  }) {
    let deletedComponentNames = [componentName]
    if (recurseToChildren) {
      let componentInstruction = this.componentsToRender[componentName];
      if (componentInstruction) {
        for (let child of componentInstruction.children) {
          let additionalDeleted = this.deleteFromComponentsToRender({
            componentName: child.componentName,
            recurseToChildren,
          })
          deletedComponentNames.push(...additionalDeleted);
        }
      }
    }
    delete this.componentsToRender[componentName];
    this.componentsWithChangedChildrenToRender.delete(componentName);

    return deletedComponentNames;
  }

  async processStateVariableTriggers() {

    // TODO: can we make this more efficient by only checking components that changed?
    // componentsToUpdateRenderers is close, but it includes only rendered components
    // and we could have components with triggers that are not rendered

    for (let componentName in this.stateVariableChangeTriggers) {
      let component = this._components[componentName];
      for (let stateVariable in this.stateVariableChangeTriggers[componentName]) {
        let triggerInstructions = this.stateVariableChangeTriggers[componentName][stateVariable];

        let value = await component.state[stateVariable].value;

        if (value !== triggerInstructions.previousValue) {
          let previousValue = triggerInstructions.previousValue;
          triggerInstructions.previousValue = value;
          let action = component.actions[triggerInstructions.action];
          if (action) {
            await this.performAction({
              componentName,
              actionName: triggerInstructions.action,
              args: {
                stateValues: { [stateVariable]: value },
                previousValues: { [stateVariable]: previousValue }
              }
            })
          }
        }

      }
    }

  }

  async expandAllComposites(component, force = false) {
    // console.log(`*****expand all composites force=${force} *****`)

    let parentsWithCompositesNotReady = await this.expandCompositesOfDescendants(component, force);

    let expandedAnother = true;

    while (expandedAnother) {
      expandedAnother = false;

      for (let parentName of parentsWithCompositesNotReady) {
        let parent = this._components[parentName]
        let foundReady = false;
        for (let compositeName of parent.unexpandedCompositesNotReady) {
          let composite = this._components[compositeName];
          if (composite.state.readyToExpandWhenResolved.isResolved) {
            foundReady = true;
            break;
          } else {
            let resolveResult = await this.dependencies.resolveItem({
              componentName: composite.componentName,
              type: "stateVariable",
              stateVariable: "readyToExpandWhenResolved",
              force,
              recurseUpstream: true
            })

            if (resolveResult.success) {
              foundReady = true;
              break;
            }

          }
        }

        if (foundReady) {
          let parent = this._components[parentName]
          await this.deriveChildResultsFromDefiningChildren({
            parent, expandComposites: true, forceExpandComposites: force
          });
          expandedAnother = true;

        }
      }
    }

    // console.log(`*********finished expanding all composites*****`)

  }

  async expandCompositesOfDescendants(component, forceExpandComposites = false) {

    // console.log(`expand composites of descendants of ${component.componentName}, forceExpandComposites = ${forceExpandComposites}`)

    // attempt to expand the composites of all descendants
    // include attributes with children

    let parentsWithCompositesNotReady = [];

    if (!component.childrenMatched) {
      await this.deriveChildResultsFromDefiningChildren({
        parent: component, expandComposites: true, forceExpandComposites,
      });
      if (component.unexpandedCompositesNotReady.length > 0) {
        parentsWithCompositesNotReady.push(component.componentName);
      } else {
        // console.log(`resolving blockers from changed active children of ${component.componentName}`)
        await this.dependencies.resolveBlockersFromChangedActiveChildren(component, forceExpandComposites)
        // console.log(`done resolving blockers from changed active children of ${component.componentName}`)
      }
    }

    for (let attrName in component.attributes) {
      let attrComp = component.attributes[attrName].component;
      if (attrComp) {
        let additionalParentsWithNotReady = await this.expandCompositesOfDescendants(attrComp, forceExpandComposites);
        parentsWithCompositesNotReady.push(...additionalParentsWithNotReady);
      }
    }

    for (let childName in component.allChildren) {
      let child = component.allChildren[childName].component;
      if (typeof child !== "object") {
        continue;
      }

      let additionalParentsWithNotReady = await this.expandCompositesOfDescendants(child, forceExpandComposites);
      parentsWithCompositesNotReady.push(...additionalParentsWithNotReady);
    }
    // console.log(`done expanding composites of descendants of ${component.componentName}`)

    return parentsWithCompositesNotReady;

  }

  async componentAndRenderedDescendants(component) {
    if (!component?.componentName) {
      return [];
    }

    let componentNames = [component.componentName];
    if (component.constructor.renderChildren) {
      if (!component.childrenMatched) {
        await this.deriveChildResultsFromDefiningChildren({
          parent: component, expandComposites: true, //forceExpandComposites: true,
        });
      }
      for (let child of component.activeChildren) {
        componentNames.push(...await this.componentAndRenderedDescendants(child));
      }
    }
    return componentNames;
  }

  async createIsolatedComponents({ serializedComponents, ancestors,
    shadow = false, createNameContext = "" }
  ) {

    let namespaceForUnamed = "/";

    if (ancestors.length > 0) {
      let parentName = ancestors[0].componentName;
      let parent = this.components[parentName];
      if (parent.attributes.newNamespace && parent.attributes.newNamespace.primitive) {
        namespaceForUnamed = parent.componentName + "/";
      } else {
        namespaceForUnamed = getNamespaceFromName(parent.componentName);
      }
    }

    let createResult = await this.createIsolatedComponentsSub({
      serializedComponents,
      ancestors,
      shadow,
      namespaceForUnamed,
      createNameContext
    });

    return {
      success: true,
      components: createResult.components,
    }


  }

  async createIsolatedComponentsSub({ serializedComponents, ancestors,
    shadow = false,
    createNameContext = "", namespaceForUnamed = "/", componentsReplacementOf,
  }
  ) {

    let newComponents = [];

    //TODO: last message
    let lastMessage = "";

    for (let [componentInd, serializedComponent] of serializedComponents.entries()) {
      // console.timeLog('core','<-Top serializedComponents ',serializedComponent.componentName);

      if (typeof serializedComponent !== "object") {
        newComponents.push(serializedComponent);
        continue;
      }

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

      let componentClass = this.componentInfoObjects.allComponentClasses[serializedComponent.componentType];
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

        componentName = createUniqueName(serializedComponent.componentType.toLowerCase(), longNameId);

        // add namespace
        componentName = namespaceForUnamed + componentName;
      }

      let createResult = await this.createChildrenThenComponent({
        serializedComponent,
        componentName,
        ancestors,
        componentClass,
        shadow,
        namespaceForUnamed,
        componentsReplacementOf,
      });

      let newComponent = createResult.newComponent;
      newComponents.push(newComponent);


      // TODO: need to get message
      //lastMessage = createResult.lastMessage;
      // console.timeLog('core','<-Bottom serializedComponents ',serializedComponent.componentName);
    }

    let results = { components: newComponents };

    return results;

  }

  async createChildrenThenComponent({ serializedComponent, componentName,
    ancestors, componentClass,
    shadow = false,
    namespaceForUnamed = "/", componentsReplacementOf
  }) {

    // first recursively create children and attribute components
    let serializedChildren = serializedComponent.children;
    let definingChildren = [];
    let childrenToRemainSerialized = [];

    let ancestorsForChildren = [{ componentName, componentClass }, ...ancestors];

    // add a new level to parameter stack;
    let parentSharedParameters = this.parameterStack.parameters;
    this.parameterStack.push();
    let sharedParameters = this.parameterStack.parameters;

    if (componentClass.descendantCompositesMustHaveAReplacement) {
      sharedParameters.compositesMustHaveAReplacement = true;
      sharedParameters.compositesDefaultReplacementType = componentClass.descendantCompositesDefaultReplacementType;
    } else if (componentClass.descendantCompositesMustHaveAReplacement === false) {
      sharedParameters.compositesMustHaveAReplacement = false;
    }


    if (componentClass.modifySharedParameters) {
      componentClass.modifySharedParameters({ sharedParameters, serializedComponent });
    }

    if (serializedComponent.doenetAttributes.pushSharedParameters) {
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

    if (serializedComponent.doenetAttributes.addToSharedParameters) {
      for (let parInstruction of serializedComponent.doenetAttributes.addToSharedParameters) {
        let pName = parInstruction.parameterName;
        if (pName in sharedParameters) {
          sharedParameters[pName] = Object.assign({}, sharedParameters[pName]);
        }
        else {
          sharedParameters[pName] = {};
        }
        sharedParameters[pName][parInstruction.key] = parInstruction.value;
      }
    }


    if (serializedChildren !== undefined) {

      let setUpVariant = false;
      let variantControlInd;
      let variantControlChild;

      if (componentClass.alwaysSetUpVariant || componentClass.setUpVariantIfVariantControlChild) {
        // look for variantControl child
        for (let [ind, child] of serializedChildren.entries()) {
          if (child.componentType === "variantControl" || (
            child.createdComponent && this._components[child.componentName].componentType === "variantControl"
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

      if (!setUpVariant && componentClass.setUpVariantUnlessAttributePrimitive) {
        let attribute = componentClass.setUpVariantUnlessAttributePrimitive;

        if (!(serializedComponent.attributes && serializedComponent.attributes[attribute]
          && serializedComponent.attributes[attribute].primitive)) {
          setUpVariant = true;
        }
      }

      if (setUpVariant) {

        let descendantVariantComponents = serializeFunctions.gatherVariantComponents({
          serializedComponents: serializedChildren,
          componentInfoObjects: this.componentInfoObjects,
        });

        if (variantControlInd !== undefined) {
          // if have desired variant name or index
          // add that information to variantControl child

          if (serializedComponent.variants) {
            let desiredVariant = serializedComponent.variants.desiredVariant;
            if (desiredVariant !== undefined) {
              if (desiredVariant.index !== undefined) {
                variantControlChild.variants = {
                  desiredVariantIndex: desiredVariant.index
                }
              } else if (desiredVariant.name !== undefined) {
                variantControlChild.variants = {
                  desiredVariantName: desiredVariant.name
                }
              }
            }

            if (serializedComponent.variants.uniqueVariants) {
              sharedParameters.numberOfVariants = serializedComponent.variants.numberOfVariants;
            }
          }

          // create variant control child
          let childrenResult = await this.createIsolatedComponentsSub({
            serializedComponents: [variantControlChild],
            ancestors: ancestorsForChildren,
            shadow,
            createNameContext: "variantControl",
            namespaceForUnamed,
          });

          definingChildren[variantControlInd] = childrenResult.components[0];

        }

        await componentClass.setUpVariant({
          serializedComponent,
          sharedParameters,
          definingChildrenSoFar: definingChildren,
          allComponentClasses: this.componentInfoObjects.allComponentClasses,
          descendantVariantComponents
        });

        let indicesToCreate = [...serializedChildren.keys()].filter(v => v !== variantControlInd);
        let childrenToCreate = serializedChildren.filter((v, i) => i !== variantControlInd);

        let childrenResult = await this.createIsolatedComponentsSub({
          serializedComponents: childrenToCreate,
          ancestors: ancestorsForChildren,
          shadow,
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
        for (let [ind, child] of serializedChildren.entries()) {
          if (!(childrenAddressed.has(ind))) {
            childrenToCreate.push(child)
          }
        }

        if (childrenToCreate.length > 0) {
          let childrenResult = await this.createIsolatedComponentsSub({
            serializedComponents: childrenToCreate,
            ancestors: ancestorsForChildren,
            shadow,
            namespaceForUnamed,
          });

          definingChildren = childrenResult.components;

        }

      } else {

        //create all children

        let childrenResult = await this.createIsolatedComponentsSub({
          serializedComponents: serializedChildren,
          ancestors: ancestorsForChildren,
          shadow,
          namespaceForUnamed,
        });

        definingChildren = childrenResult.components;
      }
    }


    let attributes = {};

    if (serializedComponent.attributes) {

      for (let attrName in serializedComponent.attributes) {
        let attribute = serializedComponent.attributes[attrName];

        if (attribute.component) {

          let attrResult = await this.createIsolatedComponentsSub({
            serializedComponents: [serializedComponent.attributes[attrName].component],
            ancestors: ancestorsForChildren,
            shadow,
            namespaceForUnamed,
            createNameContext: `attribute|${attrName}`
          });

          attributes[attrName] = { component: attrResult.components[0] };
        } else {
          attributes[attrName] = serializedComponent.attributes[attrName];
        }
      }
    }

    let prescribedDependencies = {};

    if (serializedComponent.downstreamDependencies) {
      Object.assign(prescribedDependencies, serializedComponent.downstreamDependencies);
    }

    let stateVariableDefinitions = await this.createStateVariableDefinitions({
      componentClass,
      prescribedDependencies,
    });

    // in case component with same name was deleted before, delete from deleteComponents and deletedStateVariable
    if (this.updateInfo.deletedComponents[componentName]) {
      this.updateInfo.recreatedComponents[componentName] = true;
    }
    delete this.updateInfo.deletedComponents[componentName];
    delete this.updateInfo.deletedStateVariables[componentName];

    // create component itself
    let newComponent = new componentClass({
      componentName,
      ancestors,
      definingChildren,
      stateVariableDefinitions,
      serializedChildren: childrenToRemainSerialized,
      serializedComponent,
      attributes,
      componentInfoObjects: this.componentInfoObjects,
      coreFunctions: this.coreFunctions,
      flags: this.flags,
      shadow,
      numerics: this.numerics,
      sharedParameters,
      parentSharedParameters,
    });

    this.registerComponent(newComponent);

    if (componentsReplacementOf) {
      newComponent.replacementOf = componentsReplacementOf
    }

    if (serializedComponent.adaptedFrom) {
      // record adapter relationship
      newComponent.adaptedFrom = this._components[serializedComponent.adaptedFrom];
      newComponent.adaptedFrom.adapterUsed = newComponent;
    }

    for (let name in prescribedDependencies) {
      let depArray = prescribedDependencies[name];
      for (let dep of depArray) {
        if (dep.dependencyType === "referenceShadow") {
          let shadowInfo = {
            componentName: name
          }
          Object.assign(shadowInfo, dep);
          delete shadowInfo.dependencyType;
          // newComponent.shadows = new Proxy(shadowInfo, readOnlyProxyHandler);
          newComponent.shadows = shadowInfo;

          let shadowedComponent = this._components[name];
          if (!shadowedComponent.shadowedBy) {
            shadowedComponent.shadowedBy = [];
          }
          shadowedComponent.shadowedBy.push(newComponent);

          break;
        }
      }
    }


    await this.deriveChildResultsFromDefiningChildren({ parent: newComponent, expandComposites: false });

    await this.initializeComponentStateVariables(newComponent);

    await this.dependencies.setUpComponentDependencies(newComponent);

    let variablesChanged = await this.dependencies.checkForDependenciesOnNewComponent(
      componentName,
    )

    for (let varDescription of variablesChanged) {
      await this.recordActualChangeInStateVariable({
        componentName: varDescription.componentName,
        varName: varDescription.varName,
      });
    }

    await this.checkForStateVariablesUpdatesForNewComponent(componentName)

    await this.dependencies.resolveStateVariablesIfReady({ component: newComponent });

    await this.checkForActionChaining({ component: newComponent });

    // this.dependencies.collateCountersAndPropagateToAncestors(newComponent);

    // remove a level from parameter stack;
    this.parameterStack.pop();

    let results = { newComponent: newComponent };

    return results;

  }

  async checkForStateVariablesUpdatesForNewComponent(componentName) {

    if (componentName in this.updateInfo.stateVariableUpdatesForMissingComponents) {
      let result = await this.processNewStateVariableValues({
        [componentName]: this.updateInfo.stateVariableUpdatesForMissingComponents[componentName]
      });

      if (result.foundIgnore) {
        let comp = this._components[componentName]
        for (let vName in this.updateInfo.stateVariableUpdatesForMissingComponents[componentName]) {
          if (comp.state[vName]) {
            await comp.state[vName].value
          }
        }

        await this.processNewStateVariableValues({
          [componentName]: this.updateInfo.stateVariableUpdatesForMissingComponents[componentName]
        });

      }

      delete this.updateInfo.stateVariableUpdatesForMissingComponents[componentName]
    }

  }

  async deriveChildResultsFromDefiningChildren({ parent, expandComposites = true,
    forceExpandComposites = false
  }) {

    // console.log(`derive child results for ${parent.componentName}, ${expandComposites}, ${forceExpandComposites}`)

    if (!this.derivingChildResults) {
      this.derivingChildResults = [];
    }
    if (this.derivingChildResults.includes(parent.componentName)) {
      // console.log(`not deriving child results of ${parent.componentName} while in the middle of deriving them already`)
      return { success: false, skipping: true };
    }
    this.derivingChildResults.push(parent.componentName);

    // create allChildren and activeChildren from defining children
    // apply child logic and substitute adapters to modify activeChildren

    // if (parent.activeChildren) {
    //   // if there are any deferred child state variables
    //   // evaluate them before changing the active children
    //   this.evaluatedDeferredChildStateVariables(parent);
    // }

    // attempt to expand composites before modifying active children
    let result = await this.expandCompositeOfDefiningChildren(parent, parent.definingChildren, expandComposites, forceExpandComposites);
    parent.unexpandedCompositesReady = result.unexpandedCompositesReady;
    parent.unexpandedCompositesNotReady = result.unexpandedCompositesNotReady;


    parent.activeChildren = parent.definingChildren.slice(); // shallow copy

    // allChildren include activeChildren, definingChildren,
    // and possibly some children that are neither
    // (which could occur when a composite is expanded and the result is adapted)
    // ignores string and number primitive children
    parent.allChildren = {};

    // allChildrenOrdered contains same children as allChildren,
    // but retaining an order that we can use for counters.
    // If defining children are replaced my composite replacements or adapters,
    // those children will come immediately after the corresponding defining child
    parent.allChildrenOrdered = [];

    for (let ind = 0; ind < parent.activeChildren.length; ind++) {
      let child = parent.activeChildren[ind];
      let childName;
      if (typeof child !== "object") {
        continue;
      }

      childName = child.componentName;

      parent.allChildren[childName] = {
        activeChildrenIndex: ind,
        definingChildrenIndex: ind,
        component: child,
      };

      parent.allChildrenOrdered.push(childName)
    }


    // if any of activeChildren are expanded compositeComponents
    // replace with new components given by the composite component
    await this.replaceCompositeChildren(parent);


    let childGroupResults = await this.matchChildrenToChildGroups(parent);

    if (childGroupResults.success) {
      delete this.unmatchedChildren[parent.componentName];
      parent.childrenMatchedWithPlaceholders = true;
    } else {
      parent.childrenMatchedWithPlaceholders = false;
      let unmatchedChildrenTypes = childGroupResults.unmatchedChildren
        .map(x => x.componentType).join(', ')
      this.unmatchedChildren[parent.componentName] = {
        message: `invalid children of type(s): ${unmatchedChildrenTypes}`
      }
    }

    await this.dependencies.addBlockersFromChangedActiveChildren({ parent });

    let ind = this.derivingChildResults.indexOf(parent.componentName);

    this.derivingChildResults.splice(ind, 1);


    if (parent.constructor.renderChildren) {
      this.componentsWithChangedChildrenToRender.add(parent.componentName);
    }

    return childGroupResults;

  }

  async expandCompositeOfDefiningChildren(parent, children, expandComposites, forceExpandComposites) {
    // if composite is not directly matched by any childGroup
    // then replace the composite with its replacements,
    // expanding it if not already expanded


    // console.log(`expanding defining children of of ${parent.componentName}`)

    let unexpandedCompositesReady = [];
    let unexpandedCompositesNotReady = [];

    for (let childInd = 0; childInd < children.length; childInd++) {
      let child = children[childInd];

      if (child instanceof this.componentInfoObjects.allComponentClasses._composite) {

        // if composite itself is in the child logic
        // then don't replace it with its replacements
        // but leave the composite as an activeChild
        if (this.findChildGroup(child.componentType, parent.constructor).success) {
          continue;
        }

        // expand composite if it isn't already
        if (!child.isExpanded) {

          // console.log(`child ${child.componentName} is not expanded`)
          // console.log(child.state.readyToExpandWhenResolved.isResolved)

          if (!child.state.readyToExpandWhenResolved.isResolved) {
            if (expandComposites) {
              let resolveResult = await this.dependencies.resolveItem({
                componentName: child.componentName,
                type: "stateVariable",
                stateVariable: "readyToExpandWhenResolved",
                expandComposites,//: forceExpandComposites,
                force: forceExpandComposites,
              })

              if (!resolveResult.success) {
                unexpandedCompositesNotReady.push(child.componentName);
                this.updateInfo.compositesToExpand.add(child.componentName);
                continue;
              }

            } else {
              unexpandedCompositesNotReady.push(child.componentName);
              this.updateInfo.compositesToExpand.add(child.componentName);
              continue;
            }
          } else if (!expandComposites) {
            unexpandedCompositesReady.push(child.componentName)
            this.updateInfo.compositesToExpand.add(child.componentName)
            continue;
          }

          // will either succeed or throw error since is ready to expand
          await this.expandCompositeComponent(child);

        }

        // recurse on replacements
        let result = await this.expandCompositeOfDefiningChildren(parent, child.replacements,
          expandComposites, forceExpandComposites);

        unexpandedCompositesReady.push(...result.unexpandedCompositesReady);
        unexpandedCompositesNotReady.push(...result.unexpandedCompositesNotReady);

      }
    }

    // console.log(`done expanding defining children of of ${parent.componentName}`)


    return { unexpandedCompositesReady, unexpandedCompositesNotReady }

  }

  async matchChildrenToChildGroups(parent) {

    parent.childMatchesByGroup = {};

    for (let groupName in parent.constructor.childGroupIndsByName) {
      parent.childMatchesByGroup[groupName] = [];
    }

    let success = true;

    let unmatchedChildren = [];

    for (let [ind, child] of parent.activeChildren.entries()) {

      let childType = typeof child !== "object" ? typeof child : child.componentType;

      let result = this.findChildGroup(childType, parent.constructor)

      if (result.success) {

        parent.childMatchesByGroup[result.group].push(ind);

        if (result.adapterIndUsed !== undefined) {
          await this.substituteAdapter({
            parent,
            childInd: ind,
            adapterIndUsed: result.adapterIndUsed
          })
        }

      } else {
        success = false;
        unmatchedChildren.push(child)
      }

    }

    return { success, unmatchedChildren };

  }


  findChildGroup(childType, parentClass) {

    let result = this.findChildGroupNoAdapters(
      childType, parentClass
    )

    if (result.success) {
      return result;
    } else if (childType === "string") {
      return { success: false };
    }

    // check if can match with adapters
    let childClass = this.componentInfoObjects.allComponentClasses[childType];

    // if didn't match child, attempt to match with child's adapters
    let nAdapters = childClass.nAdapters;

    for (let n = 0; n < nAdapters; n++) {
      let adapterComponentType = childClass
        .getAdapterComponentType(n, this.componentInfoObjects.publicStateVariableInfo)

      result = this.findChildGroupNoAdapters(
        adapterComponentType, parentClass
      )

      if (result.success) {
        result.adapterIndUsed = n;
        return result;
      }

    }

    return { success: false }

  }

  findChildGroupNoAdapters(componentType, parentClass) {
    if (parentClass.childGroupOfComponentType[componentType]) {
      return {
        success: true,
        group: parentClass.childGroupOfComponentType[componentType]
      }
    }

    for (let group of parentClass.childGroups) {
      for (let typeFromGroup of group.componentTypes) {
        if (this.componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: componentType,
          baseComponentType: typeFromGroup
        })) {
          // don't match composites to the base component
          // so that they will expand
          if (!(typeFromGroup === "_base" &&
            this.componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: componentType,
              baseComponentType: "_composite"
            }))) {

            parentClass.childGroupOfComponentType[componentType] = group.group;

            return {
              success: true,
              group: group.group
            }
          }

        }
      }

    }

    return { success: false }
  }

  async returnActiveChildrenIndicesToRender(component) {
    let indicesToRender = [];
    let nChildrenToRender = Infinity;
    if ("nChildrenToRender" in component.state) {
      nChildrenToRender = await component.stateValues.nChildrenToRender;
    }
    for (let [ind, child] of component.activeChildren.entries()) {
      if (ind >= nChildrenToRender) {
        break;
      }

      if (typeof child === "object") {
        if (!await child.stateValues.hidden) {
          indicesToRender.push(ind);
        }
      } else {
        // if have a primitive,
        // will be hidden if a composite source is hidden
        let hidden = false;
        if (component.compositeReplacementActiveRange) {
          for (let compositeInfo of component.compositeReplacementActiveRange) {
            let composite = this._components[compositeInfo.compositeName];
            if (await composite.stateValues.hidden) {
              if (compositeInfo.firstInd <= ind && compositeInfo.lastInd >= ind) {
                hidden = true;
                break;
              }
            }
          }
        }
        if (!hidden) {
          indicesToRender.push(ind);
        }
      }

    }

    return indicesToRender;
  }

  async substituteAdapter({ parent, childInd, adapterIndUsed }) {

    // replace activeChildren with their adapters

    let originalChild = parent.activeChildren[childInd];

    let newSerializedChild;
    if (originalChild.componentName) {
      newSerializedChild = originalChild.getAdapter(adapterIndUsed);
    } else {
      // child isn't a component, just an object with a componentType
      // Create an object that is just the componentType of the adapter
      newSerializedChild = {
        componentType:
          this.componentInfoObjects.allComponentClasses[originalChild.componentType]
            .getAdapterComponentType(adapterIndUsed, this.componentInfoObjects.publicStateVariableInfo),
        placeholderInd: originalChild.placeholderInd + "adapt"
      }
    }

    let adapter = originalChild.adapterUsed;

    if (adapter === undefined || adapter.componentType !== newSerializedChild.componentType) {
      if (originalChild.componentName) {
        let namespaceForUnamed;
        if (parent.attributes.newNamespace && parent.attributes.newNamespace.primitive) {
          namespaceForUnamed = parent.componentName + "/";
        } else {
          namespaceForUnamed = getNamespaceFromName(parent.componentName);
        }

        newSerializedChild.adaptedFrom = originalChild.componentName;
        let newChildrenResult = await this.createIsolatedComponentsSub({
          serializedComponents: [newSerializedChild],
          shadow: true,
          ancestors: originalChild.ancestors,
          createNameContext: originalChild.componentName + "|adapter",
          namespaceForUnamed,
        });

        adapter = newChildrenResult.components[0];
      } else {
        // didn't have a component for the original child, just a componentType
        // Adapter will also just be the componentType returned from childmatches
        newSerializedChild.adaptedFrom = originalChild;
        adapter = newSerializedChild;
      }

    }

    // Replace originalChild with its adapter in activeChildren
    parent.activeChildren.splice(childInd, 1, adapter);

    // TODO: if originalChild is a placeholder, we lose track of it
    // (other than through adaptedFrom of adapted)
    // once we splice it out of activeChildren.  Is that a problem?

    // Update allChildren to show that originalChild is no longer active
    // and that adapter is now an active child
    if (originalChild.componentName) {
      // ignore placeholder active children
      delete parent.allChildren[originalChild.componentName].activeChildrenIndex;
      parent.allChildren[adapter.componentName] = {
        activeChildrenIndex: childInd,
        component: adapter,
      }
    }

    // find index of originalChild in allChildrenOrdered
    // and place adapter immediately afterward
    if (originalChild.componentName) {
      let originalInd = parent.allChildrenOrdered.indexOf(originalChild.componentName)
      parent.allChildrenOrdered.splice(originalInd + 1, 0, adapter.componentName)
    } else {
      // adapter of placeholder
      let originalInd = parent.allChildrenOrdered.indexOf(originalChild.placeholderInd)
      parent.allChildrenOrdered.splice(originalInd + 1, 0, adapter.placeholderInd)
    }


  }


  async expandCompositeComponent(component) {

    if (!("readyToExpandWhenResolved" in component.state)) {
      throw Error(`Could not find state variable readyToExpandWhenResolved of composite ${component.componentName}`);
    }

    if (!component.state.readyToExpandWhenResolved.isResolved) {
      this.updateInfo.compositesToExpand.add(component.componentName)
      return { success: false }
    }

    this.updateInfo.compositesToExpand.delete(component.componentName);

    // console.log(`expanding composite ${component.componentName}`);

    this.updateInfo.compositesBeingExpanded.push(component.componentName);

    if (component.parent) {
      if (component.parent.unexpandedCompositesReady) {
        let ind = component.parent.unexpandedCompositesReady.indexOf(component.componentName);
        if (ind !== -1) {
          component.parent.unexpandedCompositesReady.splice(ind, 1);
        }
      }
      if (component.parent.unexpandedCompositesNotReady) {
        let ind = component.parent.unexpandedCompositesNotReady.indexOf(component.componentName);
        if (ind !== -1) {
          component.parent.unexpandedCompositesNotReady.splice(ind, 1);
        }
      }
    }

    if (component.shadows) {

      return await this.expandShadowingComposite(component);

    }

    let result = await component.constructor.createSerializedReplacements({
      component: this.components[component.componentName],  // to create proxy
      components: this.components,
      workspace: component.replacementsWorkspace,
      componentInfoObjects: this.componentInfoObjects,
      flags: this.flags,
      resolveItem: this.dependencies.resolveItem.bind(this.dependencies),
      publicCaseInsensitiveAliasSubstitutions: this.publicCaseInsensitiveAliasSubstitutions.bind(this)
    });

    // console.log(`expand result for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(result)));

    if (component.constructor.stateVariableToEvaluateAfterReplacements) {
      // console.log(`evaluating ${component.constructor.stateVariableToEvaluateAfterReplacements} of ${component.componentName}`)
      await component.stateValues[component.constructor.stateVariableToEvaluateAfterReplacements];
      // console.log(`done evaluating ${component.constructor.stateVariableToEvaluateAfterReplacements} of ${composite.componentName}`)
    }

    if (result.replacements) {
      let serializedReplacements = result.replacements;

      // if (component.serializedReplacements) {

      //   // if component came with serialized replacements, use those instead
      //   // as they may have particular state variables values saved
      //   serializedReplacements = component.serializedReplacements;
      //   delete component.serializedReplacements;
      // }

      await this.createAndSetReplacements({
        component,
        serializedReplacements,
      });

      if (result.withholdReplacements) {
        component.replacementsToWithhold = component.replacements.length;
      }

    } else {
      throw Error(`Invalid createSerializedReplacements of ${component.componentName}`);
    }

    // record that are finished expanding the composite
    let targetInd = this.updateInfo.compositesBeingExpanded.indexOf(component.componentName);
    if (targetInd === -1) {
      throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
    }
    this.updateInfo.compositesBeingExpanded.splice(targetInd, 1)

    return { success: true, compositesExpanded: [component.componentName] };
  }

  async expandShadowingComposite(component) {

    // console.log(`expand shadowing composite, ${component.componentName}`)

    if (this.updateInfo.compositesBeingExpanded.includes(component.shadows.componentName)) {
      // found a circular reference,
      // as we are in the middle of expanding a composite
      // that we are now trying to shadow
      let compositeInvolved = this._components[component.shadows.componentName];
      // find non-shadow for error message, as that would be a component from document
      while (compositeInvolved.shadows) {
        compositeInvolved = this._components[compositeInvolved.shadows.componentName];
      }
      throw Error(`Circular reference involving ${compositeInvolved.componentName}`);
    }

    let shadowedComposite = this._components[component.shadows.componentName];
    let compositesExpanded = [];

    // console.log(`shadowedComposite: ${shadowedComposite.componentName}`)
    // console.log(shadowedComposite.isExpanded);
    if (!shadowedComposite.isExpanded) {
      let result = await this.expandCompositeComponent(shadowedComposite);

      if (!result.success) {
        throw Error(`expand result of ${component.componentName} was not a success even though ready to expand.`);
      }
      compositesExpanded.push(...result.compositesExpanded);

    }

    // we'll copy the replacements of the shadowed composite
    // and make those be the replacements of the shadowing composite
    let serializedReplacements = [];
    for (let repl of shadowedComposite.replacements) {
      if (typeof repl === "object") {
        serializedReplacements.push(await repl.serialize())
      } else {
        serializedReplacements.push(repl)
      }
    }

    // console.log(`serialized replacements of ${shadowedComposite.componentName}`)
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)))

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

    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    // TODO: is isResponse the only attribute to convert?
    if (component.attributes.isResponse) {

      let compositeAttributesObj = component.constructor.createAttributesObject({ flags: this.flags });

      for (let repl of serializedReplacements) {
        if (typeof repl !== "object") {
          continue;
        }

        // add attributes
        if (!repl.attributes) {
          repl.attributes = {};
        }
        let attributesFromComposite = convertAttributesForComponentType({
          attributes: { isResponse: component.attributes.isResponse },
          componentType: repl.componentType,
          componentInfoObjects: this.componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace
        });
        Object.assign(repl.attributes, attributesFromComposite)
      }
    }

    // console.log(`name of composite mediating shadow: ${nameOfCompositeMediatingTheShadow}`)
    if (component.constructor.assignNamesToReplacements) {

      let originalNamesAreConsistent = component.constructor.originalNamesAreConsistent
        && newNamespace;

      let processResult = serializeFunctions.processAssignNames({
        assignNames: component.doenetAttributes.assignNames,
        serializedComponents: serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects: this.componentInfoObjects,
        originalNamesAreConsistent,
      });

      serializedReplacements = processResult.serializedComponents;
    } else {
      // console.log(`since ${component.componentName} doesn't assign names to replacements, just call create component names from children`)
      // console.log(deepClone(serializedReplacements))
      // since original names came from the targetComponent
      // we can use them only if we created a new namespace
      let originalNamesAreConsistent = newNamespace;

      let processResult = serializeFunctions.processAssignNames({
        // assignNames: component.doenetAttributes.assignNames,
        serializedComponents: serializedReplacements,
        parentName: component.componentName,
        parentCreatesNewNamespace: newNamespace,
        componentInfoObjects: this.componentInfoObjects,
        originalNamesAreConsistent,
      });

      serializedReplacements = processResult.serializedComponents;

    }

    // console.log(`serialized replacements for ${component.componentName} who is shadowing ${shadowedComposite.componentName}`);
    // console.log(deepClone(serializedReplacements));

    await this.createAndSetReplacements({
      component,
      serializedReplacements,
    });

    // record that are finished expanding the composite
    let targetInd = this.updateInfo.compositesBeingExpanded.indexOf(component.componentName);
    if (targetInd === -1) {
      throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
    }
    this.updateInfo.compositesBeingExpanded.splice(targetInd, 1);

    compositesExpanded.push(component.componentName);

    return { success: true, compositesExpanded };
  }

  async createAndSetReplacements({ component, serializedReplacements }) {

    this.parameterStack.push(component.sharedParameters, false);

    let namespaceForUnamed;
    if (component.attributes.newNamespace && component.attributes.newNamespace.primitive) {
      namespaceForUnamed = component.componentName + "/";
    } else {
      namespaceForUnamed = getNamespaceFromName(component.componentName);
    }

    let replacementResult = await this.createIsolatedComponentsSub({
      serializedComponents: serializedReplacements,
      ancestors: component.ancestors,
      shadow: true,
      createNameContext: component.componentName + "|replacements",
      namespaceForUnamed,
      componentsReplacementOf: component
    });

    this.parameterStack.pop();

    component.replacements = replacementResult.components;
    await this.dependencies.addBlockersFromChangedReplacements(component);

    component.isExpanded = true;

  }

  async replaceCompositeChildren(parent) {
    // if composite is not directly matched by any childGroup
    // then replace the composite with its replacements,
    // expanding it if not already expanded

    // console.log(`replace composite children of ${parent.componentName}`)

    delete parent.placeholderActiveChildrenIndices;
    delete parent.placeholderActiveChildrenIndicesByComposite;
    delete parent.compositeReplacementActiveRange;

    let nPlaceholdersAdded = 0;

    for (let childInd = 0; childInd < parent.activeChildren.length; childInd++) {
      let child = parent.activeChildren[childInd];

      if (child instanceof this.componentInfoObjects.allComponentClasses._composite) {

        // if composite itself is in the child logic
        // then don't replace it with its replacements
        // but leave the composite as an activeChild
        if (this.findChildGroup(child.componentType, parent.constructor).success) {
          continue;
        }

        let replaceWithPlaceholders = false;

        // if an unexpanded composite has a componentType specified
        // replace with placeholders
        // otherwise, leave composite as an activeChild
        if (!child.isExpanded) {
          if (child.attributes.componentType && child.attributes.componentType.primitive) {
            replaceWithPlaceholders = true;
          } else {
            continue;
          }
        }

        let replacements;

        if (replaceWithPlaceholders) {

          let nComponents;

          if (child.attributes.nComponents) {
            nComponents = child.attributes.nComponents.primitive;
          } else {
            nComponents = 1;
          }

          let componentType = this.componentInfoObjects.
            componentTypeLowerCaseMapping[child.attributes.componentType.primitive.toLowerCase()];
          replacements = [];

          for (let i = 0; i < nComponents; i++) {
            replacements.push({
              componentType,
              fromComposite: child.componentName,
              placeholderInd: nPlaceholdersAdded
            })
            nPlaceholdersAdded++;
          }

          parent.hasPlaceholderActiveChildren = true;
          let placeholdInds = [...Array(nComponents).keys()].map(x => x + childInd)

          if (!parent.placeholderActiveChildrenIndices) {
            parent.placeholderActiveChildrenIndices = [];
          }
          parent.placeholderActiveChildrenIndices.push(...placeholdInds);

          if (!parent.placeholderActiveChildrenIndicesByComposite) {
            parent.placeholderActiveChildrenIndicesByComposite = {};
          }
          parent.placeholderActiveChildrenIndicesByComposite[child.componentName] = placeholdInds;

        } else {
          // don't use any replacements that are marked as being withheld
          await this.markWithheldReplacementsInactive(child);

          replacements = child.replacements;
          if (child.replacementsToWithhold > 0) {
            replacements = replacements.slice(0, -child.replacementsToWithhold);
          }

          // don't include blank string replacements if parent excludes blank children
          if (!parent.constructor.includeBlankStringChildren || parent.constructor.removeBlankStringChildrenPostSugar) {
            replacements = replacements.filter(x => typeof x !== "string" || /\S/.test(x))
          }

        }

        if (!parent.compositeReplacementActiveRange) {
          parent.compositeReplacementActiveRange = [];
        }

        for (let otherCompositeObject of parent.compositeReplacementActiveRange) {
          if (otherCompositeObject.lastInd >= childInd) {
            otherCompositeObject.lastInd += replacements.length - 1;
          }
        }

        parent.compositeReplacementActiveRange.push({
          compositeName: child.componentName,
          target: await child.stateValues.target,
          firstInd: childInd,
          lastInd: childInd + replacements.length - 1
        });

        parent.activeChildren.splice(childInd, 1, ...replacements);

        // Update allChildren object with info on composite and its replacemnts
        let allChildrenObj = parent.allChildren[child.componentName];
        delete allChildrenObj.activeChildrenIndex;
        for (let ind2 = 0; ind2 < replacements.length; ind2++) {
          let replacement = replacements[ind2];
          if (replacement.componentName) {
            // ignore placeholder, string, and primitive number active children
            parent.allChildren[replacement.componentName] = {
              activeChildrenIndex: childInd + ind2,
              component: replacement,
            }
          }
        }


        // find index of child in allChildrenOrdered
        // and place replacements immediately afterward
        let ind2 = parent.allChildrenOrdered.indexOf(child.componentName)
        parent.allChildrenOrdered.splice(ind2 + 1, 0,
          ...replacements.filter(x => typeof x === "object")
            .map(x => x.componentName ? x.componentName : x.placeholderInd))

        if (replacements.length !== 1) {
          // if replaced composite with anything other than one replacement
          // shift activeChildrenIndices of later children
          let nShift = replacements.length - 1;
          for (let ind2 = childInd + replacements.length; ind2 < parent.activeChildren.length; ind2++) {
            let child2 = parent.activeChildren[ind2];
            if (child2.componentName) {
              parent.allChildren[child2.componentName].activeChildrenIndex += nShift;
            }
          }
        }

        // rewind one index, in case any of the new activeChildren are composites
        childInd--;
      }
    }

  }

  async markWithheldReplacementsInactive(composite) {

    let numActive = composite.replacements.length;

    if (await composite.stateValues.isInactiveCompositeReplacement) {
      numActive = 0;
    } else if (composite.replacementsToWithhold > 0) {
      numActive -= composite.replacementsToWithhold;
    }

    for (let repl of composite.replacements.slice(0, numActive)) {
      await this.changeInactiveComponentAndDescendants(
        repl, false
      );
    }

    for (let repl of composite.replacements.slice(numActive)) {
      await this.changeInactiveComponentAndDescendants(
        repl, true
      );
    }

    // composite is newly active
    // if updates to replacements were postponed
    // add them back to the queue
    if (!await composite.stateValues.isInactiveCompositeReplacement) {
      let cName = composite.componentName;
      if (this.updateInfo.inactiveCompositesToUpdateReplacements.includes(cName)) {
        this.updateInfo.inactiveCompositesToUpdateReplacements
          = this.updateInfo.inactiveCompositesToUpdateReplacements.filter(x => x != cName);
        this.updateInfo.compositesToUpdateReplacements.push(cName);
      }

    }
  }

  async changeInactiveComponentAndDescendants(component, inactive) {
    if (typeof component !== "object") {
      return;
    }

    if (await component.stateValues.isInactiveCompositeReplacement !== inactive) {
      component.state.isInactiveCompositeReplacement.value = inactive;
      await this.markUpstreamDependentsStale({
        component,
        varName: "isInactiveCompositeReplacement",
      });
      this.dependencies.recordActualChangeInUpstreamDependencies({
        component,
        varName: "isInactiveCompositeReplacement"
      });
      for (let childName in component.allChildren) {
        await this.changeInactiveComponentAndDescendants(this._components[childName], inactive)
      }

      for (let attrName in component.attributes) {
        let attrComp = component.attributes[attrName].component;
        if (attrComp) {
          await this.changeInactiveComponentAndDescendants(this._components[attrComp.componentName], inactive)
        }
      }

      if (component.replacements) {
        await this.markWithheldReplacementsInactive(component);
      }
    }
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

  async createStateVariableDefinitions({ componentClass,
    prescribedDependencies
  }) {

    let redefineDependencies;

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
              substituteForPrimaryStateVariable: dep.substituteForPrimaryStateVariable,
              firstLevelReplacement: dep.firstLevelReplacement,
            }
          } else if (dep.dependencyType === "adapter") {
            redefineDependencies = {
              linkSource: "adapter",
              adapterTargetIdentity: dep.adapterTargetIdentity,
              adapterVariable: dep.adapterVariable,
              substituteForPrimaryStateVariable: dep.substituteForPrimaryStateVariable,
            }
          }
        }
      }
    }

    let stateVariableDefinitions = {};

    if (!redefineDependencies) {
      this.createAttributeStateVariableDefinitions({
        stateVariableDefinitions, componentClass
      });
    }

    //  add state variable definitions from component class
    let newDefinitions = componentClass.returnNormalizedStateVariableDefinitions({
      attributeNames: Object.keys(stateVariableDefinitions),
      numerics: this.numerics
    });

    Object.assign(stateVariableDefinitions, newDefinitions)

    if (redefineDependencies) {

      if (redefineDependencies.linkSource === "adapter") {
        this.createAdapterStateVariableDefinitions({
          redefineDependencies, stateVariableDefinitions, componentClass
        });
      } else {
        await this.createReferenceShadowStateVariableDefinitions({
          redefineDependencies, stateVariableDefinitions, componentClass,
        });
      }
    }


    return stateVariableDefinitions;
  }

  createAttributeStateVariableDefinitions({ componentClass, stateVariableDefinitions }) {

    let attributes = componentClass.createAttributesObject({ flags: this.flags });

    for (let attrName in attributes) {
      let attributeSpecification = attributes[attrName];
      if (!attributeSpecification.createStateVariable) {
        continue;
      }

      let varName = attributeSpecification.createStateVariable;

      let stateVarDef = stateVariableDefinitions[varName] = {
        isAttribute: true,
        hasEssential: true,
      };

      let attributeFromPrimitive = !attributeSpecification.createComponentOfType;

      if (attributeSpecification.public) {
        stateVarDef.public = true;
        stateVarDef.componentType = attributeSpecification.stateVariableComponentType;
        if (stateVarDef.componentType === undefined) {
          if (attributeFromPrimitive) {
            stateVarDef.componentType = attributeSpecification.createPrimitiveOfType;
          } else {
            stateVarDef.componentType = attributeSpecification.createComponentOfType;
          }
        }
      }

      let stateVariableForAttributeValue;

      if (!attributeFromPrimitive) {

        let attributeClass = this.componentInfoObjects.allComponentClasses[attributeSpecification.createComponentOfType];
        if (!attributeClass) {
          throw Error(`Component type ${attributeSpecification.createComponentOfType} does not exist so cannot create state variable for attribute ${attrName} of componentType ${componentClass.componentType}.`)
        }

        stateVariableForAttributeValue = attributeSpecification.componentStateVariableForAttributeValue;
        if (stateVariableForAttributeValue === undefined) {
          stateVariableForAttributeValue = attributeClass.stateVariableForAttributeValue;
          if (stateVariableForAttributeValue === undefined) {
            stateVariableForAttributeValue = "value";
          }
        }
      }


      stateVarDef.returnDependencies = function () {
        let dependencies = {};
        if (attributeSpecification.fallBackToParentStateVariable) {
          dependencies.parentValue = {
            dependencyType: "parentStateVariable",
            variableName: attributeSpecification.fallBackToParentStateVariable
          }
        }
        if (attributeFromPrimitive) {
          dependencies.attributePrimitive = {
            dependencyType: "attributePrimitive",
            attributeName: attrName
          }
        } else {
          dependencies.attributeComponent = {
            dependencyType: "attributeComponent",
            attributeName: attrName,
            variableNames: [stateVariableForAttributeValue],
          }
        }

        return dependencies;
      };


      stateVarDef.definition = function ({ dependencyValues, usedDefault }) {

        let attributeValue;
        if (dependencyValues.attributeComponent) {
          attributeValue = dependencyValues.attributeComponent.stateValues[stateVariableForAttributeValue];
        } else if (dependencyValues.attributePrimitive !== undefined
          && dependencyValues.attributePrimitive !== null
        ) {
          attributeValue = dependencyValues.attributePrimitive;
        } else {

          // parentValue would be undefined if fallBackToParentStateVariable wasn't specified
          // parentValue would be null if the parentValue state variables
          // did not exist or its value was null 
          let haveParentValue = dependencyValues.parentValue !== undefined
            && dependencyValues.parentValue !== null;
          if (haveParentValue && !usedDefault.parentValue) {
            return { setValue: { [varName]: dependencyValues.parentValue } }
          } else {
            return {
              useEssentialOrDefaultValue: {
                [varName]: true
              }
            }
          }
        }

        attributeValue = validateAttributeValue({
          value: attributeValue,
          attributeSpecification,
          attribute: attrName
        })

        return { setValue: { [varName]: attributeValue } };
      };

      if (!attributeSpecification.noInverse) {
        stateVarDef.inverseDefinition = async function ({ desiredStateVariableValues, dependencyValues, usedDefault }) {

          if (!dependencyValues.attributeComponent) {
            if (dependencyValues.attributePrimitive !== undefined && dependencyValues.attributePrimitive !== null) {
              // can't invert if have primitive
              return { success: false }
            }

            let haveParentValue = dependencyValues.parentValue !== undefined
              && dependencyValues.parentValue !== null;
            if (haveParentValue && !usedDefault.parentValue) {
              // value from parent was used, so propagate back to parent
              return {
                success: true,
                instructions: [{
                  setDependency: "parentValue",
                  desiredValue: desiredStateVariableValues[varName],
                }]
              };
            } else {
              // no component or primitive, so value is essential and give it the desired value
              return {
                success: true,
                instructions: [{
                  setEssentialValue: varName,
                  value: desiredStateVariableValues[varName]
                }]
              };
            }
          }

          // attribute based on component

          return {
            success: true,
            instructions: [{
              setDependency: "attributeComponent",
              desiredValue: desiredStateVariableValues[varName],
              variableIndex: 0,
            }]
          };

        };
      }


      let attributesToCopy = [
        "forRenderer",
        "defaultValue",
        "propagateToProps",
        "triggerActionOnChange",
      ]

      for (let attrName2 of attributesToCopy) {
        if (attrName2 in attributeSpecification) {
          stateVarDef[attrName2]
            = attributeSpecification[attrName2];
        }
      }

    }
  }

  createAdapterStateVariableDefinitions({ redefineDependencies, stateVariableDefinitions, componentClass }) {

    // attributes depend on adapterTarget (if attribute exists in adapterTarget)
    let adapterTargetComponent = this._components[redefineDependencies.adapterTargetIdentity.componentName];

    let attributes = componentClass.createAttributesObject({ flags: this.flags });

    for (let attrName in attributes) {
      let attributeSpecification = attributes[attrName];
      if (!attributeSpecification.createStateVariable) {
        continue;
      }

      let varName = attributeSpecification.createStateVariable;

      let stateVarDef = stateVariableDefinitions[varName] = {
        isAttribute: true,
        hasEssential: true,
      };

      let attributeFromPrimitive = !attributeSpecification.createComponentOfType;

      if (attributeSpecification.public) {
        stateVarDef.public = true;
        stateVarDef.componentType = attributeSpecification.stateVariableComponentType;
        if (stateVarDef.componentType === undefined) {
          if (attributeFromPrimitive) {
            stateVarDef.componentType = attributeSpecification.createPrimitiveOfType;
            if (stateVarDef.componentType === "string") {
              stateVarDef.componentType = "text";
            }
          } else {
            stateVarDef.componentType = attributeSpecification.createComponentOfType;
          }
        }
      }

      if (varName in adapterTargetComponent.state) {
        stateVarDef.returnDependencies = () => ({
          adapterTargetVariable: {
            dependencyType: "stateVariable",
            componentName: redefineDependencies.adapterTargetIdentity.componentName,
            variableName: varName,
          }
        })
      } else {
        stateVarDef.returnDependencies = () => ({});
      }


      stateVarDef.definition = function ({ dependencyValues, usedDefault }) {
        if (dependencyValues.adapterTargetVariable === undefined
          || usedDefault.adapterTargetVariable
        ) {
          return {
            useEssentialOrDefaultValue: {
              [varName]: true
            }
          };
        }
        else {
          return { setValue: { [varName]: dependencyValues.adapterTargetVariable } };
        }
      };

      if (!attributeSpecification.noInverse) {
        stateVarDef.inverseDefinition = async function ({ desiredStateVariableValues, dependencyValues }) {
          if (dependencyValues.adapterTargetVariable === undefined) {
            return {
              success: true,
              instructions: [{
                setEssentialValue: varName,
                value: desiredStateVariableValues[varName],
              }]
            };
          }
          else {
            return {
              success: true,
              instructions: [{
                setDependency: "adapterTargetVariable",
                desiredValue: desiredStateVariableValues[varName],
              }]
            };
          }
        }
      }

      let attributesToCopy = [
        "forRenderer",
        "defaultValue",
        "propagateToProps",
      ]

      for (let attrName2 of attributesToCopy) {
        if (attrName2 in attributeSpecification) {
          stateVarDef[attrName2]
            = attributeSpecification[attrName2];
        }
      }

    }

    // primaryStateVariableForDefinition is the state variable that the componentClass
    // being created has specified should be given the value when it
    // is created from an outside source like a reference to a prop or an adapter
    let primaryStateVariableForDefinition = "value";
    if (redefineDependencies.substituteForPrimaryStateVariable) {
      primaryStateVariableForDefinition = redefineDependencies.substituteForPrimaryStateVariable;
    } else if (componentClass.primaryStateVariableForDefinition) {
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
          setValue: {
            [primaryStateVariableForDefinition]: stateDef.set(dependencyValues.adapterTargetVariable),
          },
        };
      };
    } else {
      stateDef.definition = function ({ dependencyValues }) {
        return {
          setValue: {
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

  async createReferenceShadowStateVariableDefinitions({ redefineDependencies, stateVariableDefinitions, componentClass }) {

    let compositeComponent = this._components[redefineDependencies.compositeName];
    let targetComponent = this._components[redefineDependencies.targetName];

    let additionalAttributesFromStateVariables = {};

    if (redefineDependencies.propVariable) {
      let propStateVariableInTarget = targetComponent.state[redefineDependencies.propVariable];
      if (propStateVariableInTarget && propStateVariableInTarget.stateVariablesPrescribingAdditionalAttributes) {
        additionalAttributesFromStateVariables = propStateVariableInTarget.stateVariablesPrescribingAdditionalAttributes
      }
    }

    // attributes depend 
    // - first on attributes from component attribute components, if they exist
    // - then on targetComponent (if not copying a prop and attribute exists in targetComponent)

    let attributes = componentClass.createAttributesObject({ flags: this.flags });

    for (let attrName in attributes) {
      let attributeSpecification = attributes[attrName];
      if (!attributeSpecification.createStateVariable) {
        continue;
      }

      let varName = attributeSpecification.createStateVariable;

      let stateVarDef = stateVariableDefinitions[varName] = {
        isAttribute: true,
        hasEssential: true,
      };

      let attributeFromPrimitive = !attributeSpecification.createComponentOfType;

      if (attributeSpecification.public) {
        stateVarDef.public = true;
        stateVarDef.componentType = attributeSpecification.stateVariableComponentType;
        if (stateVarDef.componentType === undefined) {
          if (attributeFromPrimitive) {
            stateVarDef.componentType = attributeSpecification.createPrimitiveOfType;
            if (stateVarDef.componentType === "string") {
              stateVarDef.componentType = "text";
            }
          } else {
            stateVarDef.componentType = attributeSpecification.createComponentOfType;
          }
        }
      }


      let stateVariableForAttributeValue;

      if (!attributeFromPrimitive) {

        let attributeClass = this.componentInfoObjects.allComponentClasses[attributeSpecification.createComponentOfType];
        if (!attributeClass) {
          throw Error(`Component type ${attributeSpecification.createComponentOfType} does not exist so cannot create state variable for attribute ${attrName} of componentType ${componentClass.componentType}.`)
        }

        stateVariableForAttributeValue = attributeSpecification.componentStateVariableForAttributeValue;
        if (stateVariableForAttributeValue === undefined) {
          stateVariableForAttributeValue = attributeClass.stateVariableForAttributeValue;
          if (stateVariableForAttributeValue === undefined) {
            stateVariableForAttributeValue = "value";
          }
        }
      }

      let thisDependencies = {}

      if (attributeFromPrimitive) {
        thisDependencies.attributePrimitive = {
          dependencyType: "attributePrimitive",
          attributeName: attrName
        }
      } else {
        thisDependencies.attributeComponent = {
          dependencyType: "attributeComponent",
          attributeName: attrName,
          variableNames: [stateVariableForAttributeValue],
          fallBackToAttributeFromShadow: false,
        }
      }


      if ((!redefineDependencies.propVariable || attributeSpecification.propagateToProps)
        && (varName in targetComponent.state)
      ) {
        thisDependencies.targetVariable = {
          dependencyType: "stateVariable",
          componentName: targetComponent.componentName,
          variableName: varName,
        };
        if ("targetAttributesToIgnore" in compositeComponent.state &&
          redefineDependencies.firstLevelReplacement
        ) {
          thisDependencies.targetAttributesToIgnore = {
            dependencyType: "stateVariable",
            componentName: compositeComponent.componentName,
            variableName: "targetAttributesToIgnore",
          };
        }
      }

      if ("targetAttributesToAlwaysIgnore" in compositeComponent.state) {
        thisDependencies.targetAttributesToAlwaysIgnore = {
          dependencyType: "stateVariable",
          componentName: compositeComponent.componentName,
          variableName: "targetAttributesToAlwaysIgnore",
        };
      }

      // We overwrite targetVariable here as the instructions
      // mean we should map this variable from the target
      // onto attribute of replacement
      // (rather than state variable attribute from the target
      // even if it were to exist)
      if (additionalAttributesFromStateVariables[attrName]) {
        thisDependencies.targetVariable = {
          dependencyType: "stateVariable",
          componentName: targetComponent.componentName,
          variableName: additionalAttributesFromStateVariables[attrName]
        }
      }

      if (attributeSpecification.fallBackToParentStateVariable) {
        thisDependencies.parentValue = {
          dependencyType: "parentStateVariable",
          variableName: attributeSpecification.fallBackToParentStateVariable
        }
      }

      stateVarDef.returnDependencies = () => thisDependencies;


      stateVarDef.definition = function ({ dependencyValues, usedDefault }) {
        let attributeValue;
        if (dependencyValues.attributeComponent) {
          attributeValue = dependencyValues.attributeComponent.stateValues[stateVariableForAttributeValue];
        } else if (dependencyValues.attributePrimitive !== undefined && dependencyValues.attributePrimitive !== null) {
          attributeValue = dependencyValues.attributePrimitive;
        } else {

          let targetAttributesToIgnore = [];
          if (dependencyValues.targetAttributesToIgnore) {
            targetAttributesToIgnore.push(...dependencyValues.targetAttributesToIgnore)
          }
          if (dependencyValues.targetAttributesToAlwaysIgnore) {
            targetAttributesToIgnore.push(...dependencyValues.targetAttributesToAlwaysIgnore);
          }

          if (dependencyValues.targetVariable !== undefined
            && !targetAttributesToIgnore.includes(attrName)
            && !usedDefault.targetVariable) {
            // if don't have attribute component or primitive
            // and target has attribute, use that value
            return { setValue: { [varName]: dependencyValues.targetVariable } };
          } else {

            // parentValue would be undefined if fallBackToParentStateVariable wasn't specified
            // parentValue would be null if the parentValue state variables
            // did not exist or its value was null 
            let haveParentValue = dependencyValues.parentValue !== undefined
              && dependencyValues.parentValue !== null;
            if (haveParentValue && !usedDefault.parentValue) {
              return { setValue: { [varName]: dependencyValues.parentValue } }
            } else {
              return {
                useEssentialOrDefaultValue: {
                  [varName]: true
                }
              }
            }
          }
        }

        attributeValue = validateAttributeValue({
          value: attributeValue,
          attributeSpecification, attribute: attrName
        })

        return { setValue: { [varName]: attributeValue } };
      };

      if (!attributeSpecification.noInverse) {
        stateVarDef.inverseDefinition = async function ({ desiredStateVariableValues,
          dependencyValues, stateValues, workspace
        }) {

          if (!dependencyValues.attributeComponent) {
            if (dependencyValues.attributePrimitive !== undefined && dependencyValues.attributePrimitive !== null) {
              // can't invert if have primitive
              return { success: false }
            }

            let targetAttributesToIgnore = [];
            if (dependencyValues.targetAttributesToIgnore) {
              targetAttributesToIgnore.push(...dependencyValues.targetAttributesToIgnore)
            }
            if (dependencyValues.targetAttributesToAlwaysIgnore) {
              targetAttributesToIgnore.push(...dependencyValues.targetAttributesToAlwaysIgnore);
            }

            if (dependencyValues.targetVariable !== undefined
              && !targetAttributesToIgnore.includes(attrName)
            ) {
              //  if target has attribute, set that value
              return {
                success: true,
                instructions: [{
                  setDependency: "targetVariable",
                  desiredValue: desiredStateVariableValues[varName],
                }]
              };
            } else {

              let haveParentValue = dependencyValues.parentValue !== undefined
                && dependencyValues.parentValue !== null;
              if (haveParentValue && !usedDefault.parentValue) {
                // value from parent was used, so propagate back to parent
                return {
                  success: true,
                  instructions: [{
                    setDependency: "parentValue",
                    desiredValue: desiredStateVariableValues[varName],
                  }]
                };
              } else {
                // no component or primitive, so value is essential and give it the desired value
                return {
                  success: true,
                  instructions: [{
                    setEssentialValue: varName,
                    value: desiredStateVariableValues[varName]
                  }]
                };
              }

            }
          }
          // attribute based on child

          return {
            success: true,
            instructions: [{
              setDependency: "attributeComponent",
              desiredValue: desiredStateVariableValues[varName],
              variableIndex: 0,
            }]
          };

        };
      }




      let attributesToCopy = [
        "forRenderer",
        "defaultValue",
        "propagateToProps",
      ]

      for (let attrName2 of attributesToCopy) {
        if (attrName2 in attributeSpecification) {
          stateVarDef[attrName2]
            = attributeSpecification[attrName2];
        }
      }
    }

    if (redefineDependencies.propVariable) {

      if (!redefineDependencies.ignorePrimaryStateVariable) {
        // primaryStateVariableForDefinition is the state variable that the componentClass
        // being created has specified should be given the value when it
        // is created from an outside source like a reference to a prop or an adapter
        let primaryStateVariableForDefinition = "value";
        if (redefineDependencies.substituteForPrimaryStateVariable) {
          primaryStateVariableForDefinition = redefineDependencies.substituteForPrimaryStateVariable;
        } else if (componentClass.primaryStateVariableForDefinition) {
          primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
        }
        let stateDef = stateVariableDefinitions[primaryStateVariableForDefinition];
        if (!stateDef) {
          if (redefineDependencies.substituteForPrimaryStateVariable) {
            throw Error(`Invalid public state variable of componentType ${componentClass.componentType}: substituteForPrimaryStateVariable ${redefineDependencies.substituteForPrimaryStateVariable} does not exist`)
          } else {
            throw Error(`Cannot have a public state variable with componentType ${componentClass.componentType} as the class doesn't have a primary state variable for definition`)
          }
        }
        stateDef.isShadow = true;
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
              setValue: {
                [primaryStateVariableForDefinition]: stateDef.set(dependencyValues.targetVariable),
              },
              alwaysShadow: [primaryStateVariableForDefinition],
            };
          };
        } else {
          stateDef.definition = function ({ dependencyValues }) {
            return {
              setValue: {
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

    let foundReadyToExpandWhenResolved = false;
    if ('readyToExpandWhenResolved' in stateVariableDefinitions) {
      // if shadowing a composite
      // make readyToExpandWhenResolved depend on the same variable
      // of the targetComponent also being resolved

      foundReadyToExpandWhenResolved = true;

      let stateDef = stateVariableDefinitions.readyToExpandWhenResolved;
      let originalReturnDependencies = stateDef.returnDependencies.bind(stateDef);
      let originalDefinition = stateDef.definition;

      stateDef.returnDependencies = function (args) {
        let dependencies = originalReturnDependencies(args);
        dependencies.targetReadyToExpandWhenResolved = {
          dependencyType: "stateVariable",
          componentName: targetComponent.componentName,
          variableName: "readyToExpandWhenResolved"
        }
        return dependencies;
      }

      // change definition so that it is false if targetComponent isn't ready to expand
      stateDef.definition = function (args) {
        let result = originalDefinition(args);

        if (result.setValue && result.setValue.readyToExpandWhenResolved) {
          if (!args.dependencyValues.targetReadyToExpandWhenResolved) {
            result.setValue.readyToExpandWhenResolved = false;
          }
        }
        return result;
      }

    }

    let stateVariablesToShadow = [];

    // shadow any variables marked as shadowVariable
    for (let varName in targetComponent.state) {
      let stateObj = targetComponent.state[varName];
      if ((stateObj.shadowVariable || stateObj.isShadow)) {
        stateVariablesToShadow.push(varName);
      }
    }

    this.modifyStateDefsToBeShadows({ stateVariablesToShadow, stateVariableDefinitions, foundReadyToExpandWhenResolved, targetComponent });

  }

  modifyStateDefsToBeShadows({ stateVariablesToShadow, stateVariableDefinitions, foundReadyToExpandWhenResolved, targetComponent }) {

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
        } else {
          continue;
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
      if (!foundReadyToExpandWhenResolved) {
        // if didn't find a readyToExpandWhenResolved,
        // then won't use original dependencies so can delete any
        // stateVariablesDeterminingDependencies
        delete stateDef.stateVariablesDeterminingDependencies;
      }

      let copyComponentType = stateDef.public && stateDef.hasVariableComponentType;

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

          if (stateDef.inverseShadowToSetEntireArray) {
            globalDependencies.targetArray = {
              dependencyType: "stateVariable",
              componentName: targetComponent.componentName,
              variableName: varName,
            }
          }

          return { globalDependencies, dependenciesByKey }
        }


        stateDef.arrayDefinitionByKey = function ({
          globalDependencyValues, dependencyValuesByKey, arrayKeys
        }) {
          // console.log(`shadow array definition by key for ${varName}`)
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
              newEntries[arrayKey] = stateDef.defaultValueByArrayKey?.(arrayKey);
            }
          }

          let result = {
            setValue: { [varName]: newEntries },
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
          dependencyValuesByKey, dependencyNamesByKey, arraySize, initialChange
        }) {

          if (stateDef.inverseShadowToSetEntireArray) {
            return {
              success: true,
              instructions: [{
                setDependency: "targetArray",
                desiredValue: desiredStateVariableValues[varName],
                treatAsInitialChange: initialChange
              }]
            }
          }

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

        let returnStartingDependencies = () => ({});

        if (foundReadyToExpandWhenResolved) {
          // even though won't use original dependencies
          // if found a readyToExpandWhenResolved
          // keep original dependencies so that readyToExpandWhenResolved
          // won't be resolved until all its dependent variables are resolved
          returnStartingDependencies = stateDef.returnDependencies.bind(stateDef);
        }

        stateDef.returnDependencies = function (args) {
          let dependencies = Object.assign({}, returnStartingDependencies(args));

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
        stateDef.definition = function ({ dependencyValues, usedDefault }) {
          let result = {
            alwaysShadow: [varName]
          }

          // TODO: how do we make it do this just once?
          if ("targetVariableComponentType" in dependencyValues) {
            result.setComponentType = {
              [varName]: dependencyValues.targetVariableComponentType
            }
          }

          // TODO: this will throw an error since did not set hasEssential
          // But does this make sense if don't set essential in inverse definition?
          if (usedDefault.targetVariable && "defaultValue" in stateDef) {
            result.useEssentialOrDefaultValue = { [varName]: true }
          } else {
            result.setValue = { [varName]: dependencyValues.targetVariable }
          }

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

  async initializeComponentStateVariables(component) {
    for (let stateVariable in component.state) {
      if (component.state[stateVariable].isAlias) {
        if (!component.stateVarAliases) {
          component.stateVarAliases = {};
        }
        component.stateVarAliases[stateVariable] = component.state[stateVariable].targetVariableName;

        // TODO: do we want to delete alias from state?
        delete component.state[stateVariable];
      } else {
        await this.initializeStateVariable({ component, stateVariable });
      }
    }
  }

  async initializeStateVariable({
    component, stateVariable,
    arrayStateVariable, arrayEntryPrefix
  }) {


    let getStateVar = this.getStateVariableValue;
    if (!component.state[stateVariable]) {
      component.state[stateVariable] = {};
    }
    let stateVarObj = component.state[stateVariable];
    stateVarObj.isResolved = false;
    Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable }), configurable: true });
    // Object.defineProperty(stateVarObj, 'value', {
    //   get:
    //     async function () {
    //       try {
    //         return getStateVar({ component, stateVariable });
    //       } catch (e) {
    //         console.log(`got an error in getter`, e);
    //         throw e;
    //       }
    //     },
    //   configurable: true
    // });

    // Object.defineProperty(stateVarObj, 'value', { get: () => Promise.resolve(getStateVar({ component, stateVariable })), configurable: true });

    if (arrayEntryPrefix !== undefined) {
      await this.initializeArrayEntryStateVariable({
        stateVarObj, arrayStateVariable, arrayEntryPrefix,
        component, stateVariable
      });
    } else if (stateVarObj.isArray) {
      await this.initializeArrayStateVariable({ stateVarObj, component, stateVariable });
    }

    if (stateVarObj.triggerActionOnChange) {
      let componentTriggers = this.stateVariableChangeTriggers[component.componentName];
      if (!componentTriggers) {
        componentTriggers = this.stateVariableChangeTriggers[component.componentName] = {};
      }
      componentTriggers[stateVariable] = { action: stateVarObj.triggerActionOnChange };
    }

  }

  async checkForActionChaining({ component, stateVariables }) {

    if (!component) {
      return;
    }

    if (!stateVariables) {
      stateVariables = Object.keys(component.state);
    }

    for (let varName of stateVariables) {
      let stateVarObj = component.state[varName];

      if (stateVarObj.chainActionOnActionOfStateVariableTargets) {
        let chainInfo = stateVarObj.chainActionOnActionOfStateVariableTargets;
        let targetNames = await stateVarObj.value;

        let originObj = this.originsOfActionsChangedToActions[component.componentName];

        let previousNames;
        if (originObj) {
          previousNames = originObj[varName];
        }

        if (!previousNames) {
          previousNames = [];
        }

        let newNames = [];

        if (Array.isArray(targetNames)) {
          newNames = [...new Set(targetNames)];
          for (let target of newNames) {

            let indPrev = previousNames.indexOf(target);

            if (indPrev === -1) {
              // found a component that wasn't previously chained
              let componentActionsChained = this.actionsChangedToActions[target];
              if (!componentActionsChained) {
                componentActionsChained = this.actionsChangedToActions[target] = [];
              }

              componentActionsChained.push({
                componentName: component.componentName,
                actionName: chainInfo.triggeredAction,
                stateVariableDefiningChain: varName,
              });
            } else {
              // target was already chained
              // remove from previous names to indicate it should still be chained
              previousNames.splice(indPrev, 1);
            }
          }


        }

        // if any names are left in previousNames,
        // then they should no longer be chained
        for (let nameToNoLongerChain of previousNames) {
          let componentActionsChained = this.actionsChangedToActions[nameToNoLongerChain];
          if (componentActionsChained) {
            let newComponentActionsChained = [];

            for (let chainedInfo of componentActionsChained) {
              if (chainedInfo.componentName !== component.componentName ||
                chainedInfo.stateVariableDefiningChain !== varName
              ) {
                newComponentActionsChained.push(chainedInfo)
              }
            }

            this.actionsChangedToActions[nameToNoLongerChain] = newComponentActionsChained;

          }
        }

        if (newNames.length > 0) {
          if (!originObj) {
            originObj = this.originsOfActionsChangedToActions[component.componentName] = {};
          }
          originObj[varName] = newNames;
        } else if (originObj) {
          delete originObj[varName];

          if (Object.keys(originObj).length === 0) {
            delete this.originsOfActionsChangedToActions[component.componentName];
          }
        }


      }

    }
  }

  async initializeArrayEntryStateVariable({
    stateVarObj, arrayStateVariable,
    arrayEntryPrefix, component, stateVariable
  }) {
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

    stateVarObj.arrayStateVariable = arrayStateVariable;
    let arrayStateVarObj = component.state[arrayStateVariable];
    stateVarObj.definition = arrayStateVarObj.definition;
    stateVarObj.inverseDefinition = arrayStateVarObj.inverseDefinition;
    stateVarObj.markStale = arrayStateVarObj.markStale;
    stateVarObj.freshnessInfo = arrayStateVarObj.freshnessInfo;
    stateVarObj.getPreviousDependencyValuesForMarkStale = arrayStateVarObj.getPreviousDependencyValuesForMarkStale;
    stateVarObj.provideEssentialValuesInDefinition = arrayStateVarObj.provideEssentialValuesInDefinition;
    stateVarObj.providePreviousValuesInDefinition = arrayStateVarObj.providePreviousValuesInDefinition;

    stateVarObj.nDimensions = arrayStateVarObj.returnEntryDimensions(arrayEntryPrefix);
    stateVarObj.wrappingComponents = arrayStateVarObj.returnWrappingComponents(arrayEntryPrefix);
    stateVarObj.entryPrefix = arrayEntryPrefix;
    stateVarObj.varEnding = stateVariable.slice(arrayEntryPrefix.length)

    if (arrayStateVarObj.createWorkspace) {
      stateVarObj.createWorkspace = true;
      stateVarObj.workspace = arrayStateVarObj.workspace;
    }

    if (arrayStateVarObj.basedOnArrayKeyStateVariables) {
      stateVarObj.basedOnArrayKeyStateVariables = true;
    }


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
      stateVarObj.getValueFromArrayValues = async function () {
        return await arrayStateVarObj.getEntryValues({
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
      stateVarObj.getValueFromArrayValues = async function () {
        let arrayKeys = await stateVarObj.arrayKeys;
        if (arrayKeys.length === 0) {
          return;
        }
        let value = [];
        for (let arrayKey of arrayKeys) {
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
        return (async () => {
          // first evaluate arraySize so _arrayKeys is recalculated
          // in case arraySize change
          await arrayStateVarObj.arraySize;
          return stateVarObj._arrayKeys;
        })();
      }
    });

    Object.defineProperty(stateVarObj, 'unflattenedArrayKeys', {
      get: function () {
        return (async () => {
          // first evaluate arraySize so _unflattenedArrayKeys is recalculated
          // in case arraySize change
          await arrayStateVarObj.arraySize;
          return stateVarObj._unflattenedArrayKeys;
        })();
      }
    });


    if (component.state[stateVarObj.arraySizeStateVariable].initiallyResolved) {
      let arraySize = await arrayStateVarObj.arraySize;
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

    // TODO: delete since arrayEntrySize isn't currently used?
    Object.defineProperty(stateVarObj, 'arrayEntrySize', {
      get: function () {
        return (async () => {
          // assume array is rectangular, so just look at first subarray of each dimension
          let unflattenedArrayKeys = await stateVarObj.unflattenedArrayKeys;
          let arrayEntrySize = [];
          let subArray = [unflattenedArrayKeys];
          for (let i = 0; i < stateVarObj.nDimensions; i++) {
            subArray = subArray[0];
            arrayEntrySize.push(subArray.length);
          }
          arrayEntrySize.reverse();   // so starts with inner dimension
          return arrayEntrySize;
        })();

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


    // add a returnDependencies function based on the array returnDependencies
    let arrayReturnDependencies = arrayStateVarObj.returnDependencies.bind(arrayStateVarObj);
    stateVarObj.returnDependencies = async function (args) {
      // add array size to argument of return dependencies
      args.arraySize = await stateVarObj.arraySize;
      args.arrayKeys = await stateVarObj.arrayKeys;
      let dependencies = await arrayReturnDependencies(args);


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

  async initializeArrayStateVariable({ stateVarObj, component, stateVariable }) {
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
      stateVarObj.setArrayValue = function ({ value, arrayKey, arraySize, arrayValues = stateVarObj.arrayValues }) {
        let index = stateVarObj.keyToIndex(arrayKey);
        let nDimensionsInArrayKey = index.length;
        if (!nDimensionsInArrayKey > stateVarObj.nDimensions) {
          console.warn('Cannot set array value.  Number of dimensions is too large.')
          return { nFailures: 1 };
        }
        let arrayValuesDrillDown = arrayValues;
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

            let nFailuresSub = 0;

            let currentSize = arraySizePiece[0];
            if (desiredValue.length > currentSize) {
              console.warn('ignoring array values of out bounds')
              nFailuresSub += desiredValue.length - currentSize;
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
                nFailuresSub += result.nFailures;
              }
            }

            return { nFailures: nFailuresSub };
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

      if (!stateVarObj.getAllArrayKeys) {
        stateVarObj.getAllArrayKeys = function (arraySize, flatten = true, desiredSize) {
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

          if (desiredSize) {
            if (desiredSize.length === 0) {
              return [];
            } else {
              return getAllArrayKeysSub(desiredSize);
            }
          } else if (!arraySize || arraySize.length === 0) {
            return [];
          } else {
            return getAllArrayKeysSub(arraySize);
          }

        }
      }

      if (!stateVarObj.arrayVarNameFromArrayKey) {
        stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
          return entryPrefixes[0] + arrayKey.split(',').map(x => Number(x) + 1).join('_')
        };
      }

      stateVarObj.adjustArrayToNewArraySize = async function () {
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

        let arraySize = await stateVarObj.arraySize;
        resizeSubArray(stateVarObj.arrayValues, arraySize);

      }

    } else {

      // have just one dimension
      stateVarObj.keyToIndex = key => Number(key);
      stateVarObj.setArrayValue = function ({ value, arrayKey, arraySize, arrayValues = stateVarObj.arrayValues }) {
        let ind = stateVarObj.keyToIndex(arrayKey);
        if (ind >= 0 && ind < arraySize[0]) {
          arrayValues[ind] = value;
          return { nFailures: 0 };
        } else {
          console.warn(`Ignoring setting array values out of bounds: ${arrayKey} of ${stateVariable}`)
          return { nFailures: 1 };
        }

      };
      stateVarObj.getArrayValue = function ({ arrayKey, arrayValues = stateVarObj.arrayValues }) {
        return arrayValues[arrayKey];
      };

      if (!stateVarObj.getAllArrayKeys) {
        stateVarObj.getAllArrayKeys = function (arraySize, flatten, desiredSize) {
          if (desiredSize) {
            if (desiredSize.length === 0) {
              return [];
            } else {
              // array of numbers from 0 to desiredSize[0], cast to strings
              return Array.from(Array(desiredSize[0]), (_, i) => String(i));
            }
          } else if (!arraySize || arraySize.length === 0) {
            return []
          } else {
            // array of numbers from 0 to arraySize[0], cast to strings
            return Array.from(Array(arraySize[0]), (_, i) => String(i));
          }
        }
      }

      if (!stateVarObj.arrayVarNameFromArrayKey) {
        stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
          return entryPrefixes[0] + String(Number(arrayKey) + 1);
        };
      }


      stateVarObj.adjustArrayToNewArraySize = async function () {
        // console.log(`adjust array ${stateVariable} of ${component.componentName} to new array size: ${stateVarObj.arraySize[0]}`);
        let arraySize = await stateVarObj.arraySize;
        stateVarObj.arrayValues.length = arraySize[0];

      }
    }


    if (!stateVarObj.getArrayKeysFromVarName) {
      stateVarObj.getArrayKeysFromVarName = returnDefaultGetArrayKeysFromVarName(stateVarObj.nDimensions)
    }

    // converting from index to key is the same for single and multiple
    // dimensions, as we just want the string representation
    stateVarObj.indexToKey = index => String(index);

    let entryPrefixes = stateVarObj.entryPrefixes;

    if (!entryPrefixes) {
      entryPrefixes = stateVarObj.entryPrefixes = [stateVariable];
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

    stateVarObj.wrappingComponents = stateVarObj.returnWrappingComponents();

    stateVarObj.usedDefaultByArrayKey = {};

    stateVarObj.arrayEntryNames = [];
    stateVarObj.varNamesIncludingArrayKeys = {};

    let allStateVariablesAffected = [stateVariable];
    if (stateVarObj.additionalStateVariablesDefined) {
      allStateVariablesAffected.push(...stateVarObj.additionalStateVariablesDefined);
    }

    // create the definition, etc., functions for the array state variable

    // create returnDependencies function from returnArrayDependenciesByKey
    stateVarObj.returnDependencies = async function (args) {
      // console.log(`return dependencies for array ${stateVariable} of ${component.componentName}`)
      // console.log(JSON.parse(JSON.stringify(args)));

      args.arraySize = await stateVarObj.arraySize

      // delete the interally added dependencies from args.stateValues
      for (let key in args.stateValues) {
        if (key.slice(0, 8) === "__array_") {
          delete args.stateValues[key];
        }
      }

      if (args.arrayKeys === undefined) {
        args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
      }

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

      if (stateVarObj.basedOnArrayKeyStateVariables && args.arrayKeys.length > 1) {
        for (let arrayKey of args.arrayKeys) {
          for (let vName of allStateVariablesAffected) {
            let sObj = component.state[vName];
            dependencies[vName + "_" + arrayKey] = {
              dependencyType: "stateVariable",
              variableName: sObj.arrayVarNameFromArrayKey(arrayKey)
            }
          }
        }
      } else {

        let arrayDependencies = stateVarObj.returnArrayDependenciesByKey(args);

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
            if (!stateVarObj.dependencyNames.keysByName[extendedDepName].includes(arrayKey)) {
              stateVarObj.dependencyNames.keysByName[extendedDepName].push(arrayKey);
            }
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

    function extractArrayDependencies(dependencyValues, arrayKeys, usedDefault) {
      // console.log(`extract array dependencies`, dependencyValues, arrayKeys, usedDefault)
      // console.log(JSON.parse(JSON.stringify(arrayKeys)))

      let globalDependencyValues = {};
      let globalUsedDefault = {};
      for (let dependencyName of stateVarObj.dependencyNames.global) {
        globalDependencyValues[dependencyName] = dependencyValues[dependencyName];
        globalUsedDefault[dependencyName] = usedDefault[dependencyName];
      }

      let dependencyValuesByKey = {};
      let usedDefaultByKey = {};
      let foundAllDependencyValuesForKey = {};
      for (let arrayKey of arrayKeys) {
        dependencyValuesByKey[arrayKey] = {};
        usedDefaultByKey[arrayKey] = {};
        if (arrayKey in stateVarObj.dependencyNames.namesByKey) {
          foundAllDependencyValuesForKey[arrayKey] = true;
          for (let dependencyName in stateVarObj.dependencyNames.namesByKey[arrayKey]) {
            let extendedDepName = stateVarObj.dependencyNames.namesByKey[arrayKey][dependencyName];
            if (extendedDepName in dependencyValues) {
              dependencyValuesByKey[arrayKey][dependencyName] = dependencyValues[extendedDepName];
              usedDefaultByKey[arrayKey][dependencyName] = usedDefault[extendedDepName];
            } else {
              foundAllDependencyValuesForKey[arrayKey] = false;
            }
          }

        }
      }

      return {
        globalDependencyValues, globalUsedDefault,
        dependencyValuesByKey, usedDefaultByKey,
        foundAllDependencyValuesForKey
      };

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

        let extractedDeps = extractArrayDependencies(args.dependencyValues, args.arrayKeys, args.usedDefault);
        let globalDependencyValues = extractedDeps.globalDependencyValues;
        let globalUsedDefault = extractedDeps.globalUsedDefault;
        let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
        let usedDefaultByKey = extractedDeps.usedDefaultByKey;
        let foundAllDependencyValuesForKey = extractedDeps.foundAllDependencyValuesForKey;

        delete args.dependencyValues;
        args.globalDependencyValues = globalDependencyValues;
        args.globalUsedDefault = globalUsedDefault;
        args.dependencyValuesByKey = dependencyValuesByKey;
        args.usedDefaultByKey = usedDefaultByKey;

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
          if (result.setValue && result.setValue[stateVariable]) {
            for (let arrayKey in result.setValue[stateVariable]) {
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

        for (let vName of allStateVariablesAffected) {
          for (let key in args.desiredStateVariableValues[vName]) {
            let depName = vName + "_" + key;
            if (depName in args.dependencyValues) {
              instructions.push({
                setDependency: depName,
                desiredValue: args.desiredStateVariableValues[vName][key],
                treatAsInitialChange: args.initialChange
              })
            }
          }
        }

        return {
          success: true,
          instructions
        };

      } else {


        let extractedDeps = extractArrayDependencies(args.dependencyValues, args.arrayKeys, args.usedDefault);
        let globalDependencyValues = extractedDeps.globalDependencyValues;
        let globalUsedDefault = extractedDeps.globalUsedDefault;
        let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
        let usedDefaultByKey = extractedDeps.usedDefaultByKey;
        // let foundAllDependencyValuesForKey = extractedDeps.foundAllDependencyValuesForKey;

        delete args.dependencyValues;
        args.globalDependencyValues = globalDependencyValues;
        args.globalUsedDefault = globalUsedDefault;
        args.dependencyValuesByKey = dependencyValuesByKey;
        args.usedDefaultByKey = usedDefaultByKey;

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



    await this.createArraySizeStateVariable({ stateVarObj, component, stateVariable });

    stateVarObj.arraySizeStale = true;
    stateVarObj.previousArraySize = [];

    Object.defineProperty(stateVarObj, 'arraySize', {
      get: function () {
        return (async () => {
          if (!component.state[stateVarObj.arraySizeStateVariable].initiallyResolved) {
            return [];
          }
          if (stateVarObj.arraySizeStale) {
            await stateVarObj.recalculateArraySizeDependentQuantities();
          }
          return await component.stateValues[stateVarObj.arraySizeStateVariable];
        })();
      }
    });

    stateVarObj.recalculateArraySizeDependentQuantities = async function () {


      let newArraySize = await component.stateValues[stateVarObj.arraySizeStateVariable];
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
      stateVarObj.freshnessInfo = { freshByKey: {} };
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

  async createArraySizeStateVariable({ stateVarObj, component, stateVariable }) {

    let allStateVariablesAffected = [stateVariable];
    if (stateVarObj.additionalStateVariablesDefined) {
      allStateVariablesAffected.push(...stateVarObj.additionalStateVariablesDefined);
    }
    allStateVariablesAffected.sort();

    let arraySizeStateVar = `__array_size_` + allStateVariablesAffected.join('_');
    stateVarObj.arraySizeStateVariable = arraySizeStateVar;

    let originalStateVariablesDeterminingDependencies;
    let originalAdditionalStateVariablesDefined;


    // Make the array's dependencies depend on the array size state variable
    if (stateVarObj.stateVariablesDeterminingDependencies) {
      originalStateVariablesDeterminingDependencies = [...stateVarObj.stateVariablesDeterminingDependencies];
      stateVarObj.stateVariablesDeterminingDependencies.push(arraySizeStateVar);
    } else {
      stateVarObj.stateVariablesDeterminingDependencies = [arraySizeStateVar];
    }


    // If array size state variable has already been created,
    // either it was created due to being shadowed 
    // or from an additional state variable defined.
    // If it is shadowing target array size state variable,
    // make it mark the array's arraySize as stale on markStale
    if (component.state[arraySizeStateVar]) {
      if (component.state[arraySizeStateVar].isShadow) {
        let arraySizeStateVarObj = component.state[arraySizeStateVar];
        arraySizeStateVarObj.markStale = function () {
          for (let varName of allStateVariablesAffected) {
            component.state[varName].arraySizeStale = true;
          }
          return {};
        }
      }
      return;
    }

    component.state[arraySizeStateVar] = {
      returnDependencies: stateVarObj.returnArraySizeDependencies,
      definition({ dependencyValues }) {
        let arraySize = stateVarObj.returnArraySize({ dependencyValues });
        for (let [ind, value] of arraySize.entries()) {
          if (!(Number.isInteger(value) && value >= 0)) {
            arraySize[ind] = 0;
          }
        }
        return { setValue: { [arraySizeStateVar]: arraySize } }
      },
      markStale() {
        for (let varName of allStateVariablesAffected) {
          component.state[varName].arraySizeStale = true;
        }
        return {};
      }
    };

    if (stateVarObj.stateVariablesDeterminingArraySizeDependencies) {
      component.state[arraySizeStateVar].stateVariablesDeterminingDependencies
        = stateVarObj.stateVariablesDeterminingArraySizeDependencies;
    }


    await this.initializeStateVariable({ component, stateVariable: arraySizeStateVar });

  }


  recursivelyReplaceCompositesWithReplacements({
    replacements,
    recurseNonStandardComposites = false,
    forceExpandComposites = false,
    includeWithheldReplacements = false,
  }) {
    let compositesFound = [];
    let newReplacements = [];
    let unexpandedCompositesReady = [];
    let unexpandedCompositesNotReady = [];

    for (let replacement of replacements) {
      if (this.componentInfoObjects.isCompositeComponent({
        componentType: replacement.componentType,
        includeNonStandard: recurseNonStandardComposites
      })) {

        compositesFound.push(replacement.componentName);

        if (!replacement.isExpanded) {
          if (replacement.state.readyToExpandWhenResolved.isResolved) {
            unexpandedCompositesReady.push(replacement.componentName);
          } else {
            unexpandedCompositesNotReady.push(replacement.componentName)
          }
        }

        if (replacement.isExpanded) {

          let replacementReplacements = replacement.replacements;
          if (!includeWithheldReplacements && replacement.replacementsToWithhold > 0) {
            replacementReplacements = replacementReplacements.slice(0, -replacement.replacementsToWithhold)
          }
          let recursionResult = this.recursivelyReplaceCompositesWithReplacements({
            replacements: replacementReplacements,
            recurseNonStandardComposites,
            forceExpandComposites,
            includeWithheldReplacements,
          });
          compositesFound.push(...recursionResult.compositesFound);
          newReplacements.push(...recursionResult.newReplacements);
          unexpandedCompositesReady.push(...recursionResult.unexpandedCompositesReady);
          unexpandedCompositesNotReady.push(...recursionResult.unexpandedCompositesNotReady);

        } else {
          newReplacements.push(replacement);
        }
      } else {
        newReplacements.push(replacement)
      }
    }


    return {
      compositesFound, newReplacements,
      unexpandedCompositesReady,
      unexpandedCompositesNotReady
    };
  }

  async getStateVariableValue({ component, stateVariable }) {

    // console.log(`getting value of state variable ${stateVariable} of ${component.componentName}`)

    let stateVarObj = component.state[stateVariable];
    if (!stateVarObj) {
      throw Error(`Can't get value of ${stateVariable} of ${component.componentName} as it doesn't exist.`);

    }

    let additionalStateVariablesDefined = stateVarObj.additionalStateVariablesDefined;


    let allStateVariablesAffected = [stateVariable];
    if (additionalStateVariablesDefined) {
      allStateVariablesAffected.push(...additionalStateVariablesDefined)
    }

    for (let varName of allStateVariablesAffected) {

      if (!component.state[varName].isResolved) {

        let result = await this.dependencies.resolveItem({
          componentName: component.componentName,
          type: "stateVariable",
          stateVariable: varName,
          force: true,
        });

        if (!result.success) {
          throw Error(`Can't get value of ${stateVariable} of ${component.componentName} as ${varName} couldn't be resolved.`);
        }

      }

    }

    let definitionArgs = await this.getStateVariableDefinitionArguments({ component, stateVariable });
    definitionArgs.componentInfoObjects = this.componentInfoObjects;

    definitionArgs.freshnessInfo = stateVarObj.freshnessInfo;

    // ararySize will be definited if have array or arrayEntry
    // (If have multiple state variables defined, they must be of same size)
    let arraySize = definitionArgs.arraySize;

    // if (component instanceof this.componentInfoObjects.allComponentClasses._composite) {
    //   definitionArgs.replacementsWorkspace = new Proxy(component.replacementsWorkspace, readOnlyProxyHandler);
    // }

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

    for (let varName in result.setValue) {
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

        if (component.state[varName].isArray) {
          if (!valuesChanged[varName]) {
            valuesChanged[varName] = { arrayKeysChanged: {} };
          }
        } else {
          valuesChanged[varName] = true;
        }
      }

      if (!component.state[varName].isResolved) {
        if (!matchingArrayEntry || !component.state[matchingArrayEntry].isResolved) {
          throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
        }
      }

      if (component.state[varName].isArray) {

        if (!valuesChanged[varName]) {
          valuesChanged[varName] = { arrayKeysChanged: {} };
        }

        let checkForActualChange = {};
        if (result.checkForActualChange && result.checkForActualChange[varName]) {
          checkForActualChange = result.checkForActualChange[varName];
        }

        for (let arrayKey in result.setValue[varName]) {
          if (checkForActualChange[arrayKey]) {
            let prevValue = component.state[varName].getArrayValue({ arrayKey });
            let newValue = result.setValue[varName][arrayKey];
            if (prevValue !== newValue) {
              component.state[varName].setArrayValue({
                value: result.setValue[varName][arrayKey],
                arrayKey,
                arraySize,
              });
              component.state[varName].usedDefaultByArrayKey[arrayKey] = false;
              valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
            }
          } else {
            component.state[varName].setArrayValue({
              value: result.setValue[varName][arrayKey],
              arrayKey,
              arraySize,
            });
            component.state[varName].usedDefaultByArrayKey[arrayKey] = false;
            valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
          }
        }

      } else {
        // not an array

        // if (!(Object.getOwnPropertyDescriptor(component.state[varName], 'value').get || component.state[varName].immutable)) {
        //   throw Error(`${varName} of ${component.componentName} is not stale, but still setting its value!!`)
        // }

        // delete before assigning value to remove any getter for the property
        delete component.state[varName].value;
        component.state[varName].value = result.setValue[varName];
        delete component.state[varName].usedDefault;

        if (result.checkForActualChange?.[varName]) {
          let newValue = component.state[varName].value;
          let previousValue = component.state[varName]._previousValue;

          if (newValue === previousValue) {
            delete valuesChanged[varName];
          } else if (Array.isArray(newValue) && Array.isArray(previousValue)) {

            // for arrays, do a shallow comparison along first dimension
            // TODO: is there a reason to check deeper?
            // Probably, not as have array state variables that would usually handle this
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

      if (!component.state[varName].hasEssential) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} requested essential or default value of ${varName}, but hasEssential is not set.`);
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
        if (component.state[varName].isArray) {
          if (!valuesChanged[varName]) {
            valuesChanged[varName] = { arrayKeysChanged: {} };
          }
        } else {
          valuesChanged[varName] = true;
        }
      }

      if (!component.state[varName].isResolved) {
        if (!matchingArrayEntry || !component.state[matchingArrayEntry].isResolved) {
          throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
        }
      }

      let essentialVarName = varName;

      if (component.state[varName].essentialVarName) {
        essentialVarName = component.state[varName].essentialVarName;
      }
      let essentialValue = component.essentialState[essentialVarName];

      if (component.state[varName].isArray) {
        // if have an array state variable,
        // then need to have an object keyed on arrayKey

        if (!valuesChanged[varName]) {
          valuesChanged[varName] = { arrayKeysChanged: {} };
        }

        let checkForActualChange = {};
        if (result.checkForActualChange && result.checkForActualChange[varName]) {
          checkForActualChange = result.checkForActualChange[varName];
        }

        for (let arrayKey in result.useEssentialOrDefaultValue[varName]) {

          let prevValue;
          if (checkForActualChange[arrayKey]) {
            prevValue = component.state[varName].getArrayValue({ arrayKey });
          }

          let essentialValueForArrayKey;
          if (Array.isArray(essentialValue)) {
            essentialValueForArrayKey = component.state[varName].getArrayValue({ arrayKey, arrayValues: essentialValue });
          } else {
            essentialValue = component.essentialState[essentialVarName] = [];
          }

          if (essentialValueForArrayKey !== undefined) {
            component.state[varName].setArrayValue({
              value: essentialValueForArrayKey,
              arrayKey,
              arraySize,
            });
          } else {

            let defaultValue = result.useEssentialOrDefaultValue[varName][arrayKey].defaultValue;
            if (defaultValue !== undefined) {

              // save to state variable
              component.state[varName].setArrayValue({
                value: defaultValue,
                arrayKey,
                arraySize,
              });

              component.state[varName].usedDefaultByArrayKey[arrayKey] = true;

            } else if (component.state[varName].defaultValueByArrayKey?.(arrayKey) !== undefined) {
              component.state[varName].setArrayValue({
                value: component.state[varName].defaultValueByArrayKey(arrayKey),
                arrayKey,
                arraySize,
              });
              component.state[varName].usedDefaultByArrayKey[arrayKey] = true;
            } else {
              throw Error(`Neither value nor default value specified; state variable: ${varName}, component: ${component.componentName}, arrayKey: ${arrayKey}.`);
            }
          }

          if (checkForActualChange[arrayKey]) {
            let newValue = component.state[varName].getArrayValue({ arrayKey });
            if (newValue !== prevValue) {
              valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
            }
          } else {
            valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
          }
        }

      } else {

        if (essentialValue !== undefined) {

          // delete before assigning essential value to remove any getter for the property
          delete component.state[varName].value;
          component.state[varName].value = essentialValue;

        } else {

          let defaultValue = result.useEssentialOrDefaultValue[varName].defaultValue;
          if (defaultValue !== undefined) {

            // save state variable value
            delete component.state[varName].value;
            component.state[varName].value = defaultValue;

            component.state[varName].usedDefault = true;


          } else if (component.state[varName].defaultValue !== undefined) {
            // This default value will be the same every time,
            // so we don't need to save its value

            // delete before assigning value to remove any getter for the property
            delete component.state[varName].value;
            component.state[varName].value = component.state[varName].defaultValue;
            component.state[varName].usedDefault = true;
          } else {
            throw Error(`Neither value nor default value specified; state variable: ${varName}, component: ${component.componentName}.`);
          }
        }

        if (result.checkForActualChange?.[varName]) {
          let newValue = component.state[varName].value;
          let previousValue = component.state[varName]._previousValue;

          if (newValue === previousValue) {
            delete valuesChanged[varName];
          } else if (Array.isArray(newValue) && Array.isArray(previousValue)) {

            // for arrays, do a shallow comparison along first dimension
            // TODO: is there a reason to check deeper?
            // Probably, not as have array state variables that would usually handle this
            if (newValue.length === previousValue.length &&
              newValue.every((v, i) => v === previousValue[i])
            ) {
              delete valuesChanged[varName];
            }
          }
        }
      }
    }

    for (let varName in result.markAsUsedDefault) {
      if (!component.state[varName].isResolved) {
        throw Error(`Marking state variable as used default when it isn't yet resolved: ${varName} of ${component.componentName}`)
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
          throw Error(`Marking state variable  ${varName} as used default in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      }

      if (Array.isArray()) {

        for (let arrayKey in result.markAsUsedDefault[varName]) {
          if (result.markAsUsedDefault[varName][arrayKey]) {
            component.state[varName].usedDefaultByArrayKey[arrayKey] = true;
          }
        }

      } else {

        if (result.markAsUsedDefault[varName]) {
          component.state[varName].usedDefault = true;
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


    for (let varName in result.setEssentialValue) {

      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} tried to make ${varName} essential, which isn't a state variable.`);
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
          throw Error(`Attempting to set essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      }

      if (!(component.state[varName].hasEssential)) {
        throw Error(`Attempting to set the essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it does not have an essential value`)
      }

      // Setting essential value is only valid if the essential value is not shadowed
      // (or if the state variable itself is shadowed,
      // which implicitly means the essential value is not shadowed)
      // Otherwise, changing the essential value could change the effective dependencies
      // of the shadowed state variables, which would necessitate recalculating those values.
      // Not only is marking those values stale not available when getting state variable values,
      // but it would cause an infinite loop when those definitions also set the essential value

      if (!(component.state[varName].shadowVariable || component.state[varName].doNotShadowEssential)) {
        throw Error(`Attempting to set the essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it is not allowed unless the state variable is shadowed or the essential state is not shadowed.`)
      }

      if (!this.essentialValuesSavedInDefinition[component.componentName]) {
        this.essentialValuesSavedInDefinition[component.componentName] = {};
      }

      let essentialVarName = varName;
      if (component.state[varName].essentialVarName) {
        essentialVarName = component.state[varName].essentialVarName;
      }

      if (component.state[varName].isArray) {
        let essentialArray = component.essentialState[essentialVarName];

        if (!Array.isArray(essentialArray)) {
          essentialArray = component.essentialState[essentialVarName] = [];
        }

        // Since setting an essential value during a defintion,
        // we also add the value to essentialValuesSavedInDefinition
        // so that it will be saved to the database during the next update

        if (!this.essentialValuesSavedInDefinition[component.componentName][varName]) {
          // include key mergeObject to let external functions
          // know that new attributes of the object
          // should be merged into the old object
          this.essentialValuesSavedInDefinition[component.componentName][varName] = {
            mergeObject: true
          };
        }
        for (let arrayKey in result.setEssentialValue[varName]) {

          component.state[varName].setArrayValue({
            value: result.setEssentialValue[varName][arrayKey],
            arrayKey,
            arraySize,
            arrayValues: essentialArray
          });


          this.essentialValuesSavedInDefinition[component.componentName][varName][arrayKey]
            = result.setEssentialValue[varName][arrayKey];

        }
      } else {
        component.essentialState[essentialVarName] = result.setEssentialValue[varName];

        // Since setting an essential value during a defintion,
        // we also add the value to essentialValuesSavedInDefinition
        // so that it will be saved to the database during the next update
        this.essentialValuesSavedInDefinition[component.componentName][varName]
          = result.setEssentialValue[varName];

      }

    }


    if (result.setComponentType) {
      for (let varName in result.setComponentType) {
        if (!component.state[varName].hasVariableComponentType) {
          throw Error(`Cannot set type of ${varName} of ${component.componentName} as it it does not have the hasVariableComponentType attribute.`)
        }
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
              let arrayKeys = await component.state[arrayEntryName].arrayKeys;
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

        await component.state[varName].adjustArrayToNewArraySize();

        if (valuesChanged[varName] === undefined) {
          valuesChanged[varName] = { arrayKeysChanged: {} }
        } else if (valuesChanged[varName] === true) {
          valuesChanged[varName] = { allArrayKeysChanged: true, arrayKeysChanged: {} }
        }
        valuesChanged[varName].arraySizeChanged = true;

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
        component.state[varName].value = await component.state[varName].getValueFromArrayValues();
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

        // remove duplicates
        arrayVarNamesChanged = [...new Set(arrayVarNamesChanged)]

        for (let arrayVarName of arrayVarNamesChanged) {
          this.dependencies.recordActualChangeInUpstreamDependencies({
            component, varName: arrayVarName,
          })
        }
      }

    }


    return await stateVarObj.value;

  }


  async getStateVariableDefinitionArguments({ component, stateVariable }) {
    // console.log(`get state variable dependencies of ${component.componentName}, ${stateVariable}`)

    let args = await this.dependencies.getStateVariableDependencyValues({ component, stateVariable });

    args.componentName = component.componentName;

    let stateVarObj = component.state[stateVariable];
    if (stateVarObj.isArrayEntry) {
      args.arrayKeys = await stateVarObj.arrayKeys;
      args.arraySize = await stateVarObj.arraySize;
    } else if (stateVarObj.isArray) {
      args.arraySize = await stateVarObj.arraySize;
    }

    if (stateVarObj.createWorkspace) {
      args.workspace = stateVarObj.workspace;
    }

    if (stateVarObj.providePreviousValuesInDefinition || stateVarObj.provideEssentialValuesInDefinition) {
      let allStateVariablesDefined = [stateVariable];
      if (stateVarObj.additionalStateVariablesDefined) {
        allStateVariablesDefined.push(...stateVarObj.additionalStateVariablesDefined)
      }
      if (stateVarObj.providePreviousValuesInDefinition) {
        let previousValues = {};
        for (let varName of allStateVariablesDefined) {
          if (component.state[varName].isArrayEntry) {
            varName = component.state[varName].arrayStateVariable;
          }
          previousValues[varName] = component.state[varName]._previousValue;
        }
        // args.previousValues = new Proxy(previousValues, readOnlyProxyHandler);
        args.previousValues = previousValues;
      }
      if (stateVarObj.provideEssentialValuesInDefinition) {
        let essentialValues = {};
        for (let varName of allStateVariablesDefined) {
          if (component.state[varName].isArrayEntry) {
            varName = component.state[varName].arrayStateVariable;
          }
          let essentialVarName = varName;
          if (component.state[varName].essentialVarName) {
            essentialVarName = component.state[varName].essentialVarName;
          }

          essentialValues[varName] = component.essentialState[essentialVarName];
        }
        // args.essentialValues = new Proxy(essentialValues, readOnlyProxyHandler);
        args.essentialValues = essentialValues;
      }
    }

    return args;
  }


  async recordActualChangeInStateVariable({
    componentName, varName
  }) {

    let component = this._components[componentName];

    // mark stale always includes additional state variables defined
    await this.markStateVariableAndUpstreamDependentsStale({
      component,
      varName,
    });

    let allStateVariables = [varName];
    if (component.state[varName].additionalStateVariablesDefined) {
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

  findCaseInsensitiveMatches({ stateVariables, componentClass }) {

    let stateVarInfo = this.componentInfoObjects.stateVariableInfo[componentClass.componentType]

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

      let isArraySize = false;
      let lowerCaseNameMinusSize = lowerCaseVarName;
      if (lowerCaseVarName.substring(0, 13) === "__array_size_") {
        isArraySize = true;
        lowerCaseNameMinusSize = lowerCaseVarName.substring(13);
      }

      for (let aliasName in stateVarInfo.aliases) {
        if (lowerCaseNameMinusSize === aliasName.toLowerCase()) {
          // don't substitute alias here, just fix case
          if (isArraySize) {
            aliasName = "__array_size_" + aliasName;
          }
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
          // TODO: the varEnding is still a case-senstitive match
          // Should we require that getArrayKeysFromVarName have 
          // a case-insensitive mode?
          let arrayVariableName = stateVarInfo.arrayEntryPrefixes[prefix].arrayVariableName;
          let arrayStateVarDescription = stateVarInfo.stateVariableDescriptions[arrayVariableName];
          let arrayKeys = arrayStateVarDescription.getArrayKeysFromVarName({
            arrayEntryPrefix: prefix,
            varEnding: stateVariable.substring(prefix.length),
            nDimensions: arrayStateVarDescription.nDimensions,
          });
          if (arrayKeys.length > 0) {
            let newVarName = prefix + lowerCaseVarName.substring(prefix.length);
            foundMatch = true;
            newVariables.push(newVarName);
            break;
          }
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

    let stateVarInfo = this.componentInfoObjects.publicStateVariableInfo[componentClass.componentType]

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

        // check again to see if alias is public
        if (varName in stateVarInfo.stateVariableDescriptions) {
          // found public
          newVariables.push(varName);
          continue;
        }
      }

      let foundMatch = false;

      let arrayEntryPrefixesLongestToShortest = Object.keys(stateVarInfo.arrayEntryPrefixes).sort((a, b) => b.length - a.length)
      for (let prefix of arrayEntryPrefixesLongestToShortest) {
        if (varName.substring(0, prefix.length) === prefix) {
          let arrayVariableName = stateVarInfo.arrayEntryPrefixes[prefix].arrayVariableName;
          let arrayStateVarDescription = stateVarInfo.stateVariableDescriptions[arrayVariableName];
          let arrayKeys = arrayStateVarDescription.getArrayKeysFromVarName({
            arrayEntryPrefix: prefix,
            varEnding: varName.substring(prefix.length),
            nDimensions: arrayStateVarDescription.nDimensions,
          });
          if (arrayKeys.length > 0) {
            foundMatch = true;
            break;
          }
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

    let stateVarInfo = this.componentInfoObjects.stateVariableInfo[componentClass.componentType]


    for (let stateVariable of stateVariables) {
      let isArraySize = false;
      if (stateVariable.substring(0, 13) === "__array_size_") {
        isArraySize = true;
        stateVariable = stateVariable.substring(13);
      }
      stateVariable = stateVariable in stateVarInfo.aliases ?
        stateVarInfo.aliases[stateVariable] : stateVariable;
      if (isArraySize) {
        stateVariable = "__array_size_" + stateVariable;
      }
      newVariables.push(stateVariable)
    }

    return newVariables;

  }

  publicCaseInsensitiveAliasSubstitutions({ stateVariables, componentClass }) {
    let mappedVarNames = this.findCaseInsensitiveMatches({
      stateVariables,
      componentClass
    });

    mappedVarNames = this.matchPublicStateVariables({
      stateVariables: mappedVarNames,
      componentClass
    });

    mappedVarNames = this.substituteAliases({
      stateVariables: mappedVarNames,
      componentClass
    });

    return mappedVarNames;

  }


  checkIfArrayEntry({ stateVariable, component }) {
    // check if stateVariable begins when an arrayEntry
    for (let arrayEntryPrefix in component.arrayEntryPrefixes) {
      if (stateVariable.substring(0, arrayEntryPrefix.length) === arrayEntryPrefix) {
        let arrayVariableName = component.arrayEntryPrefixes[arrayEntryPrefix];
        let arrayStateVarObj = component.state[arrayVariableName];
        let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
          arrayEntryPrefix,
          varEnding: stateVariable.substring(arrayEntryPrefix.length),
          nDimensions: arrayStateVarObj.nDimensions,
        });
        if (arrayKeys.length > 0) {
          return true
        }
      }
    }

    return false
  }

  async createFromArrayEntry({
    stateVariable, component, initializeOnly = false,
  }) {

    if (!component.arrayEntryPrefixes) {
      throw Error(`Unknown state variable ${stateVariable} of ${component.componentName}`);
    }

    let arrayEntryPrefixesLongestToShortest = Object.keys(component.arrayEntryPrefixes)
      .sort((a, b) => b.length - a.length)

    // check if stateVariable begins when an arrayEntry
    for (let arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
      if (stateVariable.substring(0, arrayEntryPrefix.length) === arrayEntryPrefix
        // && stateVariable.length > arrayEntryPrefix.length
      ) {

        let arrayVariableName = component.arrayEntryPrefixes[arrayEntryPrefix];
        let arrayStateVarObj = component.state[arrayVariableName];
        let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
          arrayEntryPrefix,
          varEnding: stateVariable.substring(arrayEntryPrefix.length),
          nDimensions: arrayStateVarObj.nDimensions,
        });

        if (arrayKeys.length > 0) {

          // found a reference to an arrayEntry that hasn't been created yet
          // create this arrayEntry

          let arrayStateVariable = component.arrayEntryPrefixes[arrayEntryPrefix];

          await this.initializeStateVariable({
            component, stateVariable,
            arrayStateVariable, arrayEntryPrefix,
          });

          if (initializeOnly) {
            return;
          }

          let allStateVariablesAffected = [stateVariable];
          // create an additional array entry state variables
          // specified as additional state variables defined
          if (component.state[stateVariable].additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...component.state[stateVariable].additionalStateVariablesDefined);
            for (let additionalVar of component.state[stateVariable].additionalStateVariablesDefined) {
              if (!component.state[additionalVar]) {
                await this.createFromArrayEntry({
                  stateVariable: additionalVar,
                  component,
                  initializeOnly: true
                });
              }
            }
          }


          await this.dependencies.setUpStateVariableDependencies({
            component, stateVariable,
            allStateVariablesAffected,
            core: this,
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

          await this.dependencies.resolveStateVariablesIfReady({
            component,
            stateVariables: newStateVariablesToResolve,
          });

          return
        }
      }
    }

    throw Error(`Unknown state variable ${stateVariable} of ${component.componentName}`);

  }

  async markStateVariableAndUpstreamDependentsStale({ component, varName }) {

    // console.log(`mark state variable ${varName} of ${component.componentName} and updeps stale`)

    if (varName in this.rendererStateVariables[component.componentType]) {
      this.updateInfo.componentsToUpdateRenderers.push(component.componentName);
    }

    let allStateVariablesAffectedObj = { [varName]: component.state[varName] };
    if (component.state[varName].additionalStateVariablesDefined) {
      component.state[varName].additionalStateVariablesDefined.forEach(x => allStateVariablesAffectedObj[x] = component.state[x]);
    }


    let currentFreshnessInfo = await this.lookUpCurrentFreshness({ component, varName, allStateVariablesAffectedObj });
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

      let result = await this.processMarkStale({ component, varName, allStateVariablesAffectedObj });

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
        this.updateInfo.compositesToUpdateReplacements.push(component.componentName);
      }

      if (result.updateParentRenderedChildren) {
        // find ancestor that isn't a composite and mark it to update children to render
        for (let ancestorObj of component.ancestors) {
          if (!this.componentInfoObjects.allComponentClasses._composite.isPrototypeOf(
            ancestorObj.componentCase
          )) {
            // found non-composite ancestor
            if (ancestorObj.componentClass.renderChildren) {
              this.componentsWithChangedChildrenToRender.add(ancestorObj.componentName);
            }
            break;
          }
        }
      }

      if (result.updateActionChaining) {
        let chainObj = this.updateInfo.componentsToUpdateActionChaining[component.componentName];
        if (!chainObj) {
          chainObj = this.updateInfo.componentsToUpdateActionChaining[component.componentName] = [];
        }
        for (let vName in allStateVariablesAffectedObj) {
          if (!chainObj.includes(vName)) {
            chainObj.push(vName);
          }
        }
      }

      if (result.updateDependencies) {
        for (let vName of result.updateDependencies) {
          component.state[vName].needDependenciesUpdated = true;
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
        stateVarObj._previousValue = await stateVarObj.value;
        delete stateVarObj.value;
        let getStateVar = this.getStateVariableValue;
        Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable: vName }), configurable: true });
      }

    }

    // we recurse on upstream dependents
    if (freshnessDecreased) {
      for (let vName in varsChanged) {
        await this.markUpstreamDependentsStale({ component, varName: vName });
      }
    }

  }

  async lookUpCurrentFreshness({ component, varName, allStateVariablesAffectedObj }) {


    let stateVarObj = component.state[varName];

    if (!stateVarObj.getCurrentFreshness) {
      return;
    }

    let freshnessInfo = stateVarObj.freshnessInfo;

    let arrayKeys, arraySize;

    if (stateVarObj.isArrayEntry) {
      // have to use last calculated value of arrayKeys
      // because can't evaluate state variable in middle of marking stale

      // arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);
      arrayKeys = stateVarObj._arrayKeys;

    }

    if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
      // have to use old value of arraySize
      // because can't evaluate state variable in middle of marking stale

      let arraySizeStateVar = component.state[stateVarObj.arraySizeStateVariable];
      arraySize = arraySizeStateVar._previousValue;
      let varWasFresh = !(Object.getOwnPropertyDescriptor(arraySizeStateVar, 'value').get || arraySizeStateVar.immutable);
      if (varWasFresh) {
        arraySize = await arraySizeStateVar.value;
      }

      if (Array.isArray(arraySize)) {
        // arraySize = new Proxy(arraySize, readOnlyProxyHandler);
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

  async processMarkStale({ component, varName, allStateVariablesAffectedObj }) {
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

    if (!stateVarObj.markStale || !stateVarObj.initiallyResolved) {
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

    if (stateVarObj.isArrayEntry) {
      // have to use last calculated value of arrayKeys
      // because can't evaluate state variable in middle of marking stale

      // arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);
      arrayKeys = stateVarObj._arrayKeys;

    }

    if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
      // have to use old value of arraySize
      // because can't evaluate state variable in middle of marking stale

      let arraySizeStateVar = component.state[stateVarObj.arraySizeStateVariable];
      arraySize = arraySizeStateVar._previousValue;
      let varWasFresh = !(Object.getOwnPropertyDescriptor(arraySizeStateVar, 'value').get || arraySizeStateVar.immutable);
      if (varWasFresh) {
        arraySize = await arraySizeStateVar.value;
      }

      if (Array.isArray(arraySize)) {
        // arraySize = new Proxy(arraySize, readOnlyProxyHandler);
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

  async markUpstreamDependentsStale({ component, varName }) {
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

        if (upDep.markStale) {
          await upDep.markStale();
        }

        if (upDep.downstreamComponentNames) {
          // this particular upstream dependency has multiple downstream components
          // must find which one of those components correspond to current component

          let componentInd = upDep.downstreamComponentNames.indexOf(componentName);
          if (componentInd === -1) {
            // presumably component was deleted
            continue;
          }

          if (upDep.mappedDownstreamVariableNamesByComponent) {

            // if have multiple components, there must be multiple variables
            // ensure that varName is one of them
            let varInd = upDep.mappedDownstreamVariableNamesByComponent[componentInd].indexOf(varName);
            if (varInd === -1) {
              throw Error(`something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`);
            }

            if (upDep.dependencyType === "determineDependencies") {
              upDep.recalculateDependencies = true;
            }


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
                = freshnessInfo;
              // = new Proxy(freshnessInfo, readOnlyProxyHandler);
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

          for (let varName of upDep.upstreamVariableNames) {
            if (varName in this.rendererStateVariables[this.components[upDep.upstreamComponentName].componentType]) {
              this.updateInfo.componentsToUpdateRenderers.push(upDep.upstreamComponentName);
              break;
            }
          }

          let upVarName = upDep.upstreamVariableNames[0];
          let upDepComponent = this._components[upDep.upstreamComponentName];
          // let upVar = upDepComponent.state[upVarName];

          let allStateVariablesAffectedObj = {};
          upDep.upstreamVariableNames.forEach(x => allStateVariablesAffectedObj[x] = upDepComponent.state[x]);

          let currentFreshnessInfo = await this.lookUpCurrentFreshness({
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

            let result = await this.processMarkStale({
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
              this.updateInfo.compositesToUpdateReplacements.push(upDep.upstreamComponentName);
            }

            if (result.updateParentRenderedChildren) {
              // find ancestor that isn't a composite and mark it to update children to render
              for (let ancestorObj of upDepComponent.ancestors) {
                if (!this.componentInfoObjects.allComponentClasses._composite.isPrototypeOf(
                  ancestorObj.componentCase
                )) {
                  // found non-composite ancestor
                  if (ancestorObj.componentClass.renderChildren) {
                    this.componentsWithChangedChildrenToRender.add(ancestorObj.componentName);
                  }
                  break;
                }
              }
            }

            if (result.updateActionChaining) {
              let chainObj = this.updateInfo.componentsToUpdateActionChaining[upDep.componentName];
              if (!chainObj) {
                chainObj = this.updateInfo.componentsToUpdateActionChaining[upDep.componentName] = [];
              }
              for (let vName in allStateVariablesAffectedObj) {
                if (!chainObj.includes(vName)) {
                  chainObj.push(vName);
                }
              }
            }

            if (result.updateDependencies) {
              for (let vName of result.updateDependencies) {
                component.state[vName].needDependenciesUpdated = true;
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
              stateVarObj._previousValue = await stateVarObj.value;
              delete stateVarObj.value;
              Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component: upDepComponent, stateVariable: vName }), configurable: true });
            }

          }

          // we recurse on upstream dependents
          if (freshnessDecreased) {
            for (let vName in varsChanged) {
              await this.markUpstreamDependentsStale({
                component: upDepComponent,
                varName: vName,
              });
            }
          }

        }
      }
    }

  }

  // evaluatedDeferredChildStateVariables(component) {
  //   for (let child of component.activeChildren) {
  //     if (child.componentType === "string") {
  //       for (let varName in child.state) {
  //         if (child.state[varName].deferred) {
  //           let evaluateSoNoLongerDeferred = child.state[varName].value;
  //         }
  //       }
  //     }
  //   }
  // }

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

    // set ancestors based on allChildren and attribute components
    // so that all components get ancestors
    // even if not activeChildren or definingChildren

    component.ancestors = ancestors;

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

    for (let attrName in component.attributes) {
      let comp = component.attributes[attrName].component;
      if (comp) {
        this.setAncestors(comp, ancestorsForChildren)
      }
    }
  }

  async addChildrenAndRecurseToShadows({
    parent, indexOfDefiningChildren,
    newChildren, assignNamesOffset
  }) {

    this.spliceChildren(parent, indexOfDefiningChildren, newChildren);

    let newChildrenResult = await this.processNewDefiningChildren({ parent });

    let addedComponents = {};
    let deletedComponents = {};

    if (!newChildrenResult.success) {
      return newChildrenResult;
    }


    for (let child of newChildren) {
      if (typeof child === "object") {
        addedComponents[child.componentName] = child;
      }
    }


    if (parent.shadowedBy) {
      for (let shadowingParent of parent.shadowedBy) {
        if (shadowingParent.shadows.propVariable) {
          continue;
        }

        let shadowingSerializeChildren = [];
        for (let child of newChildren) {
          shadowingSerializeChildren.push(await child.serialize())
        }
        shadowingSerializeChildren = postProcessCopy({
          serializedComponents: shadowingSerializeChildren,
          componentName: shadowingParent.shadows.compositeName
        });

        let shadowingNewNamespace = shadowingParent.attributes.newNamespace && shadowingParent.attributes.newNamespace.primitive;
        // we can use original only if we created a new namespace
        let originalNamesAreConsistent = shadowingNewNamespace;

        let processResult = serializeFunctions.processAssignNames({
          indOffset: assignNamesOffset,
          serializedComponents: shadowingSerializeChildren,
          parentName: shadowingParent.componentName,
          parentCreatesNewNamespace: shadowingNewNamespace,
          componentInfoObjects: this.componentInfoObjects,
          originalNamesAreConsistent,
        });

        shadowingSerializeChildren = processResult.serializedComponents;


        let unproxiedShadowingParent = this._components[shadowingParent.componentName];
        this.parameterStack.push(unproxiedShadowingParent.sharedParameters, false);

        let namespaceForUnamed;
        if (shadowingNewNamespace) {
          namespaceForUnamed = shadowingParent.componentName + "/";
        } else {
          namespaceForUnamed = getNamespaceFromName(shadowingParent.componentName);
        }

        let createResult = await this.createIsolatedComponentsSub({
          serializedComponents: shadowingSerializeChildren,
          ancestors: shadowingParent.ancestors,
          createNameContext: shadowingParent.componentName + "|addChildren|" + assignNamesOffset,
          namespaceForUnamed,
        });

        this.parameterStack.pop();


        let shadowResult = await this.addChildrenAndRecurseToShadows({
          parent: unproxiedShadowingParent,
          indexOfDefiningChildren,
          newChildren: createResult.components,
          assignNamesOffset
        });

        if (!shadowResult.success) {
          throw Error(`was able to add components to parent but not shadows!`)
        }

        Object.assign(addedComponents, shadowResult.addedComponents)

      }
    }


    return {
      success: true,
      deletedComponents,
      addedComponents,
    }
  }

  async processNewDefiningChildren({ parent, expandComposites = true }) {

    this.parameterStack.push(parent.sharedParameters, false);
    let childResult = await this.deriveChildResultsFromDefiningChildren({
      parent, expandComposites
    });
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


  async deleteComponents({
    components, deleteUpstreamDependencies = true,
    skipProcessingChildrenOfParents = []
  }) {

    // to delete a component, one must
    // 1. recursively delete all children and attribute components
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
          childNamesToBeDeleted: new Set(),
        }
        parentsOfPotentiallyDeleted[component.parentName] = parentObj;
      }
      parentObj.childNamesToBeDeleted.add(componentName);
    }


    // if component is a replacement of another component,
    // need to delete component from the replacement
    // so that it isn't added back as a child of its parent
    // Also keep track of which ones deleted so can add back to replacements
    // if the deletion is unsuccessful
    let replacementsDeletedFromComposites = [];

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];
      if (component.replacementOf) {
        let composite = component.replacementOf;

        let replacementNames = composite.replacements.map(x => x.componentName);

        let replacementInd = replacementNames.indexOf(componentName);
        if (replacementInd !== -1) {
          composite.replacements.splice(replacementInd, 1);
          if (!replacementsDeletedFromComposites.includes(composite.componentName)) {
            replacementsDeletedFromComposites.push(composite.componentName);
          }
        }
      }
    }

    for (let compositeName of replacementsDeletedFromComposites) {
      if (!(compositeName in componentsToDelete)) {
        await this.dependencies.addBlockersFromChangedReplacements(this._components[compositeName])
      }
    }

    // delete component from parent's defining children
    // and record parents
    let allParents = [];
    for (let parentName in parentsOfPotentiallyDeleted) {
      let parentObj = parentsOfPotentiallyDeleted[parentName];
      let parent = parentObj.parent;
      allParents.push(parent);

      // if (parent.activeChildren) {
      //   this.evaluatedDeferredChildStateVariables(parent);
      // }

      for (let ind = parent.definingChildren.length - 1; ind >= 0; ind--) {
        let child = parent.definingChildren[ind];
        if (parentObj.childNamesToBeDeleted.has(child.componentName)) {
          parent.definingChildren.splice(ind, 1);  // delete from array
        }
      }

      if (!skipProcessingChildrenOfParents.includes(parent.componentName)) {
        await this.processNewDefiningChildren({ parent, expandComposites: false });
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

      this.dependencies.deleteAllDownstreamDependencies({ component });

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


      await this.dependencies.deleteAllUpstreamDependencies({ component });

      if (!this.updateInfo.deletedStateVariables[component.componentName]) {
        this.updateInfo.deletedStateVariables[component.componentName] = [];
      }
      this.updateInfo.deletedStateVariables[component.componentName].push(...Object.keys(component.state))

      this.updateInfo.deletedComponents[component.componentName] = true;
      delete this.unmatchedChildren[component.componentName];

      delete this.stateVariableChangeTriggers[component.componentName];

    }

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];

      // console.log(`deregistering ${componentName}`)

      // don't use recursive form since all children should already be included
      this.deregisterComponent(component, false);

    }


    // remove deleted components from this.updateInfo arrays
    this.updateInfo.componentsToUpdateRenderers = [... new Set(this.updateInfo.componentsToUpdateRenderers)].filter(x => !(x in componentsToDelete))
    this.updateInfo.compositesToUpdateReplacements = [... new Set(this.updateInfo.compositesToUpdateReplacements)].filter(x => !(x in componentsToDelete))

    return {
      success: true,
      deletedComponents: componentsToDelete,
      parentsOfDeleted: allParents,
    };

  }

  determineComponentsToDelete({ components, deleteUpstreamDependencies, componentsToDelete }) {
    for (let component of components) {
      if (typeof component !== "object") {
        continue;
      }

      if (component.componentName in componentsToDelete) {
        continue;
      }

      // add unproxied component
      componentsToDelete[component.componentName] = this._components[component.componentName];

      // recurse on allChildren and attributes
      let componentsToRecurse = Object.values(component.allChildren).map(x => x.component);

      for (let attrName in component.attributes) {
        let comp = component.attributes[attrName].component;
        if (comp) {
          componentsToRecurse.push(comp)
        }
      }

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

  async updateCompositeReplacements({ component, componentChanges, sourceOfUpdate }) {

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

    // evaluate readyToExpandWhenResolved
    // to make sure all dependencies needed to calculate
    // replacement changes are resolved
    // TODO: why must we evaluate and not just resolve it?
    await component.stateValues.readyToExpandWhenResolved;

    const replacementChanges = await component.constructor.calculateReplacementChanges({
      component: proxiedComponent,
      componentChanges,
      components: this.components,
      workspace: component.replacementsWorkspace,
      componentInfoObjects: this.componentInfoObjects,
      flags: this.flags,
      resolveItem: this.dependencies.resolveItem.bind(this.dependencies),
      publicCaseInsensitiveAliasSubstitutions: this.publicCaseInsensitiveAliasSubstitutions.bind(this)
    });

    if (component.constructor.stateVariableToEvaluateAfterReplacements) {
      await component.stateValues[component.constructor.stateVariableToEvaluateAfterReplacements];
    }


    // console.log("replacement changes for " + component.componentName);
    // console.log(replacementChanges);
    // console.log(component.replacements.map(x => x.componentName));
    // console.log(component.replacements);
    // console.log(component.unresolvedState);
    // console.log(component.unresolvedDependencies);


    // let changedReplacementIdentitiesOfComposites = [];

    // iterate through all replacement changes
    for (let change of replacementChanges) {

      if (change.changeType === "add") {

        if (change.replacementsToWithhold !== undefined) {
          await this.adjustReplacementsToWithhold({
            component, change, componentChanges,
          });
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
          await this.deleteReplacementsFromShadowsThenComposite({
            change, composite: component,
            componentChanges, sourceOfUpdate,
            parentsOfDeleted, deletedComponents, addedComponents,
            processNewChildren: false,
          });

        }

        if (change.serializedReplacements) {

          let serializedReplacements = change.serializedReplacements;

          let namespaceForUnamed;
          if (component.attributes.newNamespace && component.attributes.newNamespace.primitive) {
            namespaceForUnamed = component.componentName + "/";
          } else {
            namespaceForUnamed = getNamespaceFromName(component.componentName);
          }

          let createResult = await this.createIsolatedComponentsSub({
            serializedComponents: serializedReplacements,
            ancestors: component.ancestors,
            createNameContext: component.componentName + "|replacements",
            namespaceForUnamed,
            componentsReplacementOf: component
          });

          newComponents = createResult.components;

        } else {
          throw Error(`Invalid replacement change.`)
        }

        this.parameterStack.pop();

        let newReplacementsByComposite = {
          [component.componentName]: { newComponents, parent: change.parent }
        }

        if (unproxiedComponent.shadowedBy && currentShadowedBy[unproxiedComponent.componentName].length > 0) {
          let newReplacementsForShadows = await this.createShadowedReplacements({
            replacementsToShadow: newComponents,
            componentToShadow: unproxiedComponent,
            parentToShadow: change.parent,
            currentShadowedBy,
            assignNamesOffset: change.assignNamesOffset,
            componentChanges, sourceOfUpdate,
            parentsOfDeleted, deletedComponents, addedComponents,
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
            await this.expandCompositeComponent(composite);

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
            if (typeof comp === "object") {
              addedComponents[comp.componentName] = comp;
            }

            // TODO: used to checkForDownstreamDependencies here
            // Is this needed for new system?
          }

          if (change.changeTopLevelReplacements === true) {

            let parent = this._components[composite.parentName];

            // splice in new replacements
            composite.replacements.splice(firstIndex, 0, ...newReplacements);
            await this.dependencies.addBlockersFromChangedReplacements(composite);

            let newChange = {
              changeType: "addedReplacements",
              composite,
              newReplacements,
              topLevel: true,
              firstIndex: firstIndex,
              numberDeleted: numberToDelete
            };

            componentChanges.push(newChange);

            await this.processNewDefiningChildren({ parent, expandComposites: false });

            let componentsAffected = await this.componentAndRenderedDescendants(parent);
            this.updateInfo.componentsToUpdateRenderers.push(...componentsAffected);

          } else {
            // if not top level replacements

            // TODO: check if change.parent is appropriate dependency of composite?

            let parent = this._components[newReplacementsByComposite[compositeName].parent.componentName];

            this.spliceChildren(parent, change.indexOfDefiningChildren, newReplacements);

            await this.processNewDefiningChildren({ parent });

            for (let repl of newReplacements) {
              if (typeof repl === "object") {
                addedComponents[repl.componentName] = repl;
              }
            }

            let componentsAffected = await this.componentAndRenderedDescendants(parent);
            this.updateInfo.componentsToUpdateRenderers.push(...componentsAffected);

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
          await this.adjustReplacementsToWithhold({
            component, change, componentChanges,
          });
        }

        await this.deleteReplacementsFromShadowsThenComposite({
          change, composite: component,
          componentsToDelete: change.components,
          componentChanges, sourceOfUpdate,
          parentsOfDeleted, deletedComponents, addedComponents,
        });


      } else if (change.changeType === "moveDependency") {

        // TODO: this is not converted to new system
        throw Error('moveDependency not implemented');

      } else if (change.changeType === "addDependency") {

        // TODO: this is not converted to new system
        throw Error('addDependency not implemented');

      } else if (change.changeType === "updateStateVariables") {


        // TODO: check if component is appropriate dependency of composite

        let workspace = {};
        let newStateVariableValues = {};
        for (let stateVariable in change.stateChanges) {
          let instruction = {
            componentName: change.component.componentName,
            stateVariable,
            value: change.stateChanges[stateVariable],
            overrideFixed: true
          }

          await this.requestComponentChanges({
            instruction, initialChange: false, workspace,
            newStateVariableValues,
          });
        }

        await this.processNewStateVariableValues(newStateVariableValues);


      } else if (change.changeType === "changeReplacementsToWithhold") {

        // don't change actual array of replacements
        // but just change those that will get added to activeChildren

        if (change.replacementsToWithhold !== undefined) {
          let compositesWithAdjustedReplacements =
            await this.adjustReplacementsToWithhold({
              component, change, componentChanges,
            });

        }

        await this.processChildChangesAndRecurseToShadows(component);

      }

    }


    let results = {
      success: true,
      deletedComponents,
      addedComponents,
      parentsOfDeleted,
    };

    return results;

  }

  async deleteReplacementsFromShadowsThenComposite({
    change, composite, componentsToDelete,
    componentChanges, sourceOfUpdate,
    parentsOfDeleted, deletedComponents, addedComponents,
    processNewChildren = true
  }) {

    let compositesDeletedFrom = [];

    if (!composite.isExpanded) {
      return compositesDeletedFrom;
    }

    if (composite.shadowedBy) {
      for (let shadowingComposite of composite.shadowedBy) {
        if (shadowingComposite.shadows.propVariable) {
          continue;
        }

        let shadowingComponentsToDelete;

        if (componentsToDelete) {
          shadowingComponentsToDelete = [];
          for (let compToDelete of componentsToDelete) {
            let shadowingCompToDelete;
            if (compToDelete.shadowedBy) {
              for (let cShadow of compToDelete.shadowedBy) {
                if (cShadow.shadows.propVariable) {
                  continue;
                }
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

        let additionalCompositesDeletedFrom = await this.deleteReplacementsFromShadowsThenComposite({
          change,
          composite: shadowingComposite,
          componentsToDelete: shadowingComponentsToDelete,
          componentChanges, sourceOfUpdate,
          parentsOfDeleted, deletedComponents, addedComponents,
          processNewChildren,
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
      await this.dependencies.addBlockersFromChangedReplacements(composite);

      // TODO: why does this delete delete upstream components
      // but the non toplevel delete doesn't?
      let deleteResults = await this.deleteComponents({
        components: replacementsToDelete,
        componentChanges, sourceOfUpdate,
        skipProcessingChildrenOfParents: [composite.parentName]
      });

      if (processNewChildren) {
        // since skipped, process children now but without expanding composites
        await this.processNewDefiningChildren({
          parent: this._components[composite.parentName],
          expandComposites: false
        });
      }

      if (deleteResults.success === false) {
        throw Error("Couldn't delete components on composite update");
      }
      for (let parent of deleteResults.parentsOfDeleted) {
        parentsOfDeleted.add(parent.componentName);
        let componentsAffected = await this.componentAndRenderedDescendants(parent);
        this.updateInfo.componentsToUpdateRenderers.push(...componentsAffected);
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
      let componentsAffected = await this.componentAndRenderedDescendants(parent);
      this.updateInfo.componentsToUpdateRenderers.push(...componentsAffected);
    }
    else {
      // if not change top level replacements
      let numberToDelete = componentsToDelete.length;
      // TODO: check if components are appropriate dependency of composite
      let deleteResults = await this.deleteComponents({
        components: componentsToDelete,
        deleteUpstreamDependencies: false,
        componentChanges: componentChanges,
        sourceOfUpdate: sourceOfUpdate,
      });
      if (deleteResults.success === false) {
        throw Error("Couldn't delete components prescribed by composite");
      }
      for (let parent of deleteResults.parentsOfDeleted) {
        parentsOfDeleted.add(parent.componentName);
        let componentsAffected = await this.componentAndRenderedDescendants(parent);
        this.updateInfo.componentsToUpdateRenderers.push(...componentsAffected);
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

  async processChildChangesAndRecurseToShadows(component) {
    let parent = this._components[component.parentName];
    await this.processNewDefiningChildren({ parent, expandComposites: false });
    let componentsAffected = await this.componentAndRenderedDescendants(parent);
    this.updateInfo.componentsToUpdateRenderers.push(...componentsAffected);

    if (component.shadowedBy) {
      for (let shadowingComponent of component.shadowedBy) {
        if (shadowingComponent.shadows.propVariable) {
          continue;
        }
        await this.processChildChangesAndRecurseToShadows(shadowingComponent)
      }
    }
  }

  async createShadowedReplacements({
    replacementsToShadow,
    componentToShadow,
    parentToShadow,
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
    this.updateInfo.compositesBeingExpanded.push(componentToShadow.componentName);

    let newComponentsForShadows = {};

    for (let shadowingComponent of componentToShadow.shadowedBy) {
      if (shadowingComponent.shadows.propVariable) {
        continue;
      }

      if (this.updateInfo.compositesBeingExpanded.includes(shadowingComponent.componentName)) {
        throw Error(`circular dependence involving ${shadowingComponent.componentName}`)
      }

      if (shadowingComponent.shadowedBy) {
        currentShadowedBy[shadowingComponent.componentName] = calculateAllComponentsShadowing(shadowingComponent);
      }

      if (shadowingComponent.isExpanded) {

        // TODO: not using uniqueIdentifiers used here
        // is this a problem?
        let newSerializedReplacements = [];
        for (let repl of replacementsToShadow) {
          if (typeof repl === "object") {
            newSerializedReplacements.push(await repl.serialize());
          } else {
            newSerializedReplacements.push(repl);
          }
        }
        newSerializedReplacements = postProcessCopy({
          serializedComponents: newSerializedReplacements,
          componentName: shadowingComponent.shadows.compositeName
        });

        let shadowingNewNamespace = shadowingComponent.attributes.newNamespace?.primitive;

        // TODO: is isResponse the only attribute to convert?
        if (shadowingComponent.attributes.isResponse) {
          let compositeAttributesObj = shadowingComponent.constructor.createAttributesObject({ flags: this.flags });

          for (let repl of newSerializedReplacements) {
            if (typeof repl !== "object") {
              continue;
            }

            // add attributes
            if (!repl.attributes) {
              repl.attributes = {};
            }
            let attributesFromComposite = convertAttributesForComponentType({
              attributes: { isResponse: shadowingComponent.attributes.isResponse },
              componentType: repl.componentType,
              componentInfoObjects: this.componentInfoObjects,
              compositeAttributesObj,
              compositeCreatesNewNamespace: shadowingNewNamespace
            });
            Object.assign(repl.attributes, attributesFromComposite)
          }
        }

        if (shadowingComponent.constructor.assignNamesToReplacements) {

          let originalNamesAreConsistent = shadowingComponent.constructor.originalNamesAreConsistent
            && shadowingNewNamespace;

          let processResult = serializeFunctions.processAssignNames({
            assignNames: shadowingComponent.doenetAttributes.assignNames,
            indOffset: assignNamesOffset,
            serializedComponents: newSerializedReplacements,
            parentName: shadowingComponent.componentName,
            parentCreatesNewNamespace: shadowingNewNamespace,
            componentInfoObjects: this.componentInfoObjects,
            originalNamesAreConsistent,
          });

          newSerializedReplacements = processResult.serializedComponents;

        } else {


          // since original names came from the targetComponent
          // we can use them only if we created a new namespace
          let originalNamesAreConsistent = shadowingNewNamespace;

          let processResult = serializeFunctions.processAssignNames({
            // assignNames: shadowingComponent.doenetAttributes.assignNames,
            indOffset: assignNamesOffset,
            serializedComponents: newSerializedReplacements,
            parentName: shadowingComponent.componentName,
            parentCreatesNewNamespace: shadowingNewNamespace,
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
        if (shadowingNewNamespace) {
          namespaceForUnamed = shadowingComponent.componentName + "/";
        } else {
          namespaceForUnamed = getNamespaceFromName(shadowingComponent.componentName);
        }

        let createResult = await this.createIsolatedComponentsSub({
          serializedComponents: newSerializedReplacements,
          ancestors: shadowingComponent.ancestors,
          createNameContext: shadowingComponent.componentName + "|replacements",
          namespaceForUnamed,
          componentsReplacementOf: shadowingComponent
        });

        this.parameterStack.pop();

        newComponents = createResult.components;

        let shadowingParent;
        if (parentToShadow) {
          if (parentToShadow.shadowedBy) {
            for (let pShadow of parentToShadow.shadowedBy) {
              if (pShadow.shadows.propVariable) {
                continue;
              }
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

        if (shadowingComponent.shadowedBy && currentShadowedBy[shadowingComponent.componentName].length > 0) {
          let recursionComponents = await this.createShadowedReplacements({
            replacementsToShadow: newComponents,
            componentToShadow: shadowingComponent,
            parentToShadow: shadowingParent,
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
    let targetInd = this.updateInfo.compositesBeingExpanded.indexOf(componentToShadow.componentName);
    if (targetInd === -1) {
      throw Error(`Something is wrong as we lost track that we were expanding ${component.componentName}`);
    }
    this.updateInfo.compositesBeingExpanded.splice(targetInd, 1)

    return newComponentsForShadows;

  }

  async adjustReplacementsToWithhold({ component, change, componentChanges }) {

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
    await this.dependencies.addBlockersFromChangedReplacements(component);

    if (component.shadowedBy) {
      for (let shadowingComponent of component.shadowedBy) {
        if (shadowingComponent.shadows.propVariable) {
          continue;
        }
        let additionalcompositesWithAdjustedReplacements =
          await this.adjustReplacementsToWithhold({
            component: shadowingComponent, change, componentChanges,
          });
        compositesWithAdjustedReplacements.push(...additionalcompositesWithAdjustedReplacements)
      }
    }

    return compositesWithAdjustedReplacements;

  }


  get rendererTypesInDocument() {
    return this.document.allPotentialRendererTypes;
  }

  get components() {
    // return new Proxy(this._components, readOnlyProxyHandler);
    return this._components;
  }

  set components(value) {
    return null;
  }

  async executeProcesses() {

    while (this.processQueue.length > 0) {
      let nextUpdateInfo = this.processQueue.splice(0, 1)[0];
      let result;
      if (nextUpdateInfo.type === "update") {
        if (!nextUpdateInfo.skippable || this.processQueue.length < 2) {
          result = await this.performUpdate(nextUpdateInfo);
        }

        // TODO: if skip an update, presumably we should call reject???


        // } else if (nextUpdateInfo.type === "getStateVariableValues") {
        //   result = await this.performGetStateVariableValues(nextUpdateInfo);
      } else if (nextUpdateInfo.type === "action") {
        if (!nextUpdateInfo.skippable || this.processQueue.length < 2) {
          result = await this.performAction(nextUpdateInfo);
        }

        // TODO: if skip an update, presumably we should call reject???

      } else if (nextUpdateInfo.type === "recordEvent") {
        result = await this.performRecordEvent(nextUpdateInfo);
      } else {
        throw Error(`Unrecognized process type: ${nextUpdateInfo.type}`)
      }

      nextUpdateInfo.resolve(result);
    }

    this.processing = false;

  }


  // requestStateVariableValues({ requestedValues }) {

  //   return new Promise((resolve, reject) => {
  //     this.processQueue.push({
  //       type: "getStateVariableValues", requestedValues, resolve, reject
  //     })

  //     if (!this.processing) {
  //       this.processing = true;
  //       setTimeout(this.executeProcesses, 0);
  //     }
  //   })

  // }

  // performGetStateVariableValues({ requestedValues }) {

  //   let retrievedValues = {};

  //   let success = true;

  //   for (let componentName in requestedValues) {

  //     let component = this._components[componentName];
  //     if (!component) {
  //       console.error(`Component ${componentName} does not exist.  Cannot get value of its state variables.`);
  //       success = false;
  //     } else {

  //       let valuesForComponent = retrievedValues[componentName] = {};

  //       for (let stateVariable of requestedValues[componentName]) {
  //         let stateVarObj = component.state[stateVariable];
  //         if (!stateVarObj) {
  //           console.error(`State variable ${stateVariable} of component ${componentName} does not exist.  Cannot get its value.`);
  //           success = false;
  //         } else {
  //           valuesForComponent[stateVariable] = stateVarObj.value;
  //         }

  //       }
  //     }
  //   }

  //   return Promise.resolve({ success, retrievedValues });
  // }


  requestAction({ componentName, actionName, args, event }) {

    return new Promise((resolve, reject) => {

      let skippable = args?.skippable;

      this.processQueue.push({
        type: "action", componentName, actionName, args, skippable, event, resolve, reject
      })

      if (!this.processing) {
        this.processing = true;
        this.executeProcesses();
      }

      // if (this.processing) {
      //   this.processQueue.push({
      //     type: "action", componentName, actionName, args, skippable, event, resolve, reject
      //   })
      // } else {
      //   this.processing = true;

      //   // Note: execute this process synchronously
      //   // so that UI doesn't update until after finished.

      //   this.performAction({ componentName, actionName, args, event }).then(resolve);

      //   // execute asynchronously any remaining processes
      //   // (that got added while performAction was running)

      //   if (this.processQueue.length > 0) {
      //     setTimeout(this.executeProcesses, 0);
      //   } else {
      //     this.processing = false;
      //   }
      // }
    });

  }

  async performAction({ componentName, actionName, args, event }) {

    let component = this.components[componentName];
    if (component && component.actions) {
      let action = component.actions[actionName];
      if (action) {
        if (event) {
          this.requestRecordEvent(event);
        }
        return await action(args);
      }
    }

    console.warn(`Cannot run action ${actionName} on component ${componentName}`);

  }

  async triggerChainedActions({ componentName }) {

    for (let cName in this.updateInfo.componentsToUpdateActionChaining) {
      await this.checkForActionChaining({
        component: this.components[cName],
        stateVariables: this.updateInfo.componentsToUpdateActionChaining[cName]
      })
    }

    this.updateInfo.componentsToUpdateActionChaining = {};


    if (this.actionsChangedToActions[componentName]) {
      for (let chainedActionInstructions of this.actionsChangedToActions[componentName]) {
        await this.performAction(chainedActionInstructions);
      }
    }
  }


  async requestUpdate({
    updateInstructions, transient = false, event, skippable = false,
    overrideReadOnly = false
  }) {

    if (this.flags.readOnly && !overrideReadOnly) {

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

      await this.updateRendererInstructions({
        componentNamesToUpdate: updateInstructions.map(x => x.componentName),
        sourceOfUpdate: { sourceInformation }
      });

      return;

    }

    return new Promise((resolve, reject) => {

      this.processQueue.push({
        type: "update", updateInstructions, transient, event, skippable, resolve, reject
      })

      if (!this.processing) {
        this.processing = true;
        this.executeProcesses();
      }

      // if (this.processing) {

      // } else {
      //   this.processing = true;

      //   // Note: execute this process synchronously
      //   // so that UI doesn't update until after finished.
      //   // It is a tradeoff, as the UI has to wait,
      //   // but it allows constraints to be applied before renderering.

      //   this.performUpdate({ updateInstructions, transient, event }).then(() => {
      //     // execute asynchronously any remaining processes
      //     // (that got added while performUpdate was running)

      //     // if (this.processQueue.length > 0) {
      //       setTimeout(this.executeProcesses, 0);
      //     // } else {
      //     //   this.processing = false;
      //     // }
      //     resolve();
      //   });

      // }
    });


  }

  async performUpdate({ updateInstructions, transient = false, event }) {

    let newStateVariableValues = {};
    let newStateVariableValuesProcessed = [];
    let sourceInformation = {};
    let workspace = {};
    let recordItemSubmissions = [];

    for (let instruction of updateInstructions) {

      if (instruction.componentName) {
        let componentSourceInformation = sourceInformation[instruction.componentName];
        if (!componentSourceInformation) {
          componentSourceInformation = sourceInformation[instruction.componentName] = {};
        }

        if (instruction.sourceInformation) {
          Object.assign(componentSourceInformation, instruction.sourceInformation);
        }
      }

      if (instruction.updateType === "updateValue") {

        await this.requestComponentChanges({
          instruction, workspace,
          newStateVariableValues
        });

      } else if (instruction.updateType === "addComponents") {
        await this.addComponents({
          serializedComponents: instruction.serializedComponents,
          parentName: instruction.parentName,
          assignNamesOffset: instruction.assignNamesOffset,
        })
      } else if (instruction.updateType === "deleteComponents") {
        if (instruction.componentNames.length > 0) {
          let componentsToDelete = [];
          for (let componentName of instruction.componentNames) {
            let component = this._components[componentName];
            if (component) {
              componentsToDelete.push(component);
            } else {
              console.warn(`Cannot delete ${componentName} as it doesn't exist.`)
            }
          }

          if (componentsToDelete.length > 0) {
            await this.deleteComponents({ components: componentsToDelete });
          }
        }

      } else if (instruction.updateType === "executeUpdate") {
        // this should be used only if further updates depend on having all
        // state variables updated,
        // i.e., the subsequent inverse definitions use stateValues
        // in their calculations that need to be updated
        await this.executeUpdateStateVariables(newStateVariableValues);

        newStateVariableValuesProcessed.push(newStateVariableValues);
        newStateVariableValues = {};

      } else if (instruction.updateType === "recordItemSubmission") {
        recordItemSubmissions.push(instruction.itemNumber)
      }

    }


    await this.executeUpdateStateVariables(newStateVariableValues)

    newStateVariableValuesProcessed.push(newStateVariableValues);


    await this.finishUpdate({
      sourceInformation,
      local: true,
    });



    let itemsWithCreditAchieved = {};

    if (recordItemSubmissions.length > 0) {
      recordItemSubmissions = [...new Set(recordItemSubmissions)];
      if (event) {
        if (!event.context) {
          event.context = {};
        }
        if (!event.context.itemCreditAchieved) {
          event.context.itemCreditAchieved = {};
        }
        event.context.documentCreditAchieved = await this.document.stateValues.creditAchieved;
      }
      let itemCreditAchieved = await this.document.stateValues.itemCreditAchieved;
      for (let itemNumber of recordItemSubmissions) {
        itemsWithCreditAchieved[itemNumber] = itemCreditAchieved[itemNumber - 1];
        // if (this.externalFunctions.submitResponse) {
        //   this.externalFunctions.submitResponse({
        //     itemNumber,
        //     itemCreditAchieved: itemCreditAchieved[itemNumber - 1],
        //     callBack: this.submitResponseCallBack,
        //   });
        // }
        if (event) {
          event.context.itemCreditAchieved[itemNumber] = itemCreditAchieved[itemNumber - 1]
        }
      }
    }


    //TODO: Inside for loop?
    if (!transient) {

      let newVals = {};

      // start with any essential values saved when calculating definitions
      if (Object.keys(this.essentialValuesSavedInDefinition).length > 0) {
        for (let componentName in this.essentialValuesSavedInDefinition) {
          let essentialState = this._components[componentName]?.essentialState;
          if (essentialState) {
            newVals[componentName] = {};
            for (let varName in this.essentialValuesSavedInDefinition[componentName]) {
              if (essentialState[varName] !== undefined) {
                // console.log(`saving ${varName} of ${componentName}`, essentialState[varName])
                // console.log('not using', this.essentialValuesSavedInDefinition[componentName][varName])
                newVals[componentName][varName] = essentialState[varName];
              }
            }
          }

        }
        this.essentialValuesSavedInDefinition = {};
      }

      // merge in new state variables set in update
      for (let newValuesProcessed of newStateVariableValuesProcessed) {
        for (let componentName in newValuesProcessed) {
          if (!newVals[componentName]) {
            newVals[componentName] = {}
          }
          for (let varName in newValuesProcessed[componentName]) {
            let essentialVals = newVals[componentName][varName];
            // if essentialVals is an object with mergeObject = true,
            // then merge attributes from newValuesProcessed into essentialVals
            if (typeof essentialVals === "object" && essentialVals !== null && essentialVals.mergeObject) {
              Object.assign(essentialVals, newValuesProcessed[componentName][varName])
            } else {
              newVals[componentName][varName] = newValuesProcessed[componentName][varName];
            }
          }
        }

      }

      let currentVariant = await this.document.state.generatedVariantInfo.value

      postMessage({
        messageType: "saveState",
        args: {
          newStateVariableValues: preprocessForPostMessage(newVals),
          CID: this.CID,
          itemsWithCreditAchieved,
          currentVariant
        },
      })

    }


    // evalute itemCreditAchieved so that will be fresh
    // and can detect changes when it is marked stale
    await this.document.stateValues.itemCreditAchieved;

    if (event) {
      this.requestRecordEvent(event);
    }


  }

  requestRecordEvent(event) {
    return new Promise((resolve, reject) => {

      this.processQueue.push({
        type: "recordEvent", event, resolve, reject
      })

      if (!this.processing) {
        this.processing = true;
        this.executeProcesses();

      }
    })
  }

  performRecordEvent({ event }) {

    if (!this.flags.allowSaveEvents) {
      return;
    }

    event.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!event.result) {
      event.result = {};
    }
    if (!event.context) {
      event.context = {};
    }

    setTimeout(() => {

      const payload = {
        doenetId: this.doenetId,
        attemptNumber: this.attemptNumber,
        verb: event.verb,
        object: JSON.stringify(event.object, serializeFunctions.serializedComponentsReplacer),
        result: JSON.stringify(event.result, serializeFunctions.serializedComponentsReplacer),
        context: JSON.stringify(event.context, serializeFunctions.serializedComponentsReplacer),
        timestamp: event.timestamp,
        version: "0.1.0",
      }

      axios.post('/api/recordEvent.php', payload)
      // .then(resp => {
      //   console.log(">>>>resp",resp.data)
      // });

    }, 0);

    return Promise.resolve();
  }

  async executeUpdateStateVariables(newStateVariableValues) {

    // merge new variables changed from newStateVariableValues into changedStateVariables
    for (let cName in newStateVariableValues) {
      let component = this._components[cName];
      if (component) {
        let changedSvs = this.changedStateVariables[cName];
        if (!changedSvs) {
          changedSvs = this.changedStateVariables[cName] = {};
        }
        for (let vName in newStateVariableValues[cName]) {
          let sVarObj = component.state[vName];
          if (sVarObj) {
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
      }

    }

    await this.processNewStateVariableValues(newStateVariableValues);


    // calculate any replacement changes on composites touched
    let replacementResult = await this.replacementChangesFromCompositesToUpdate();

    if (replacementResult.updatedComposites) {
      // make sure the new composite replacements didn't
      // create other composites that have to be expanded
      await this.expandAllComposites(this.document);
      await this.expandAllComposites(this.document, true);

    }

    // calculate any replacement changes on composites touched again
    await this.replacementChangesFromCompositesToUpdate();

    // TODO: do we need to check again if update composites to expand again?
    // If so, how would we end the loop?

  }


  async finishUpdate(sourceOfUpdate) {

    // use set to create deduplicated list of components to update renderers
    let componentNamesToUpdate = [...new Set(this.updateInfo.componentsToUpdateRenderers)];
    this.updateInfo.componentsToUpdateRenderers = [];

    await this.updateRendererInstructions({
      componentNamesToUpdate,
      sourceOfUpdate,
      recreatedComponents: this.updateInfo.recreatedComponents
    });

    await this.processStateVariableTriggers();

    // it is possible that components were added back to componentNamesToUpdateRenderers
    // while processing the renderer instructions
    // so delete any names that were just addressed
    this.updateInfo.componentsToUpdateRenderers
      = this.updateInfo.componentsToUpdateRenderers.filter(x => !componentNamesToUpdate.includes(x));

    if (Object.keys(this.unmatchedChildren).length > 0) {
      let childLogicMessage = "";
      for (let componentName in this.unmatchedChildren) {
        if (!this._components[componentName].isShadow) {
          childLogicMessage += `Invalid children for ${componentName}: ${this.unmatchedChildren[componentName].message} `;
        }
      }
      if (childLogicMessage) {
        console.warn(childLogicMessage);
      }
    }
  }

  async replacementChangesFromCompositesToUpdate() {

    let compositesToUpdateReplacements = [...new Set(this.updateInfo.compositesToUpdateReplacements)];
    this.updateInfo.compositesToUpdateReplacements = [];

    let compositesNotReady = [];

    let nPasses = 0;

    let updatedComposites = false;

    let componentChanges = []; // TODO: what to do with componentChanges?
    while (compositesToUpdateReplacements.length > 0) {
      for (let cName of compositesToUpdateReplacements) {
        let composite = this._components[cName];
        if (composite instanceof this.componentInfoObjects.allComponentClasses._composite
          && composite.isExpanded
        ) {

          if (composite.state.readyToExpandWhenResolved.initiallyResolved) {
            if (await composite.stateValues.isInactiveCompositeReplacement) {
              this.updateInfo.inactiveCompositesToUpdateReplacements.push(cName)
            } else {
              let result = await this.updateCompositeReplacements({
                component: composite,
                componentChanges,
              });

              for (let componentName in result.addedComponents) {
                updatedComposites = true;
                this.changedStateVariables[componentName] = {};
                for (let varName in this._components[componentName].state) {
                  let stateVarObj = this._components[componentName].state[varName];
                  if (stateVarObj.isArray) {
                    this.changedStateVariables[componentName][varName] =
                      new Set(stateVarObj.getAllArrayKeys(await stateVarObj.arraySize))
                  } else if (!stateVarObj.isArrayEntry) {
                    this.changedStateVariables[componentName][varName] = true;
                  }
                }
              }
              if (Object.keys(result.deletedComponents).length > 0) {
                updatedComposites = true;
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
      // its replacements need processing may remain stale, which will
      // prevent futher changes from being triggered
      compositesToUpdateReplacements = [...new Set(this.updateInfo.compositesToUpdateReplacements)];
      this.updateInfo.compositesToUpdateReplacements = [];

      // just in case have infinite loop, throw error after 100 passes
      nPasses++;
      if (nPasses > 100) {
        throw Error(`Seem to have an infinite loop while calculating replacement changes`)
      }

    }

    this.updateInfo.compositesToUpdateReplacements = compositesNotReady;

    // return { componentChanges };
    return { updatedComposites };
  }

  async processNewStateVariableValues(newStateVariableValues) {

    // console.log('process new state variable values')
    // console.log(JSON.parse(JSON.stringify(newStateVariableValues)));

    let nFailures = 0;

    let foundIgnore = false;


    for (let cName in newStateVariableValues) {
      let comp = this._components[cName];

      if (comp === undefined) {
        // console.warn(`can't update state variables of component ${cName}, as it doesn't exist.`);
        // nFailures += 1;

        let updatesForComp = this.updateInfo.stateVariableUpdatesForMissingComponents[cName];
        if (updatesForComp === undefined) {
          updatesForComp = this.updateInfo.stateVariableUpdatesForMissingComponents[cName] = {};
        }

        Object.assign(updatesForComp, newStateVariableValues[cName]);

        continue;
      }

      let newComponentStateVariables = newStateVariableValues[cName];

      for (let vName in newComponentStateVariables) {


        let compStateObj = comp.state[vName];
        if (compStateObj === undefined) {

          let match = vName.match(/^__def_primitive_(\d+)$/)

          if (match) {
            let childInd = Number(match[1]);

            comp.definingChildren[childInd] = newComponentStateVariables[vName];

            await this.processNewDefiningChildren({ parent: comp, expandComposites: false });

            continue;

          } else {
            match = vName.match(/^__def_primitive_ignore_(\d+)$/)

            if (match) {

              let childInd = Number(match[1]);

              comp.definingChildren[childInd] = newComponentStateVariables[vName];

              foundIgnore = true;

              // since marked to ignore, we don't process new defining children

              continue;

            }

          }

          console.warn(`can't update state variable ${vName} of component ${cName}, as it doesn't exist.`);
          continue;
        }

        if (!(
          compStateObj.hasEssential
        )) {
          console.warn(`can't update state variable ${vName} of component ${cName}, as it does not have an essential state variable.`);
          continue;
        }

        let essentialVarName = vName;
        if (comp.state[vName].essentialVarName) {
          essentialVarName = comp.state[vName].essentialVarName;
        }

        if (vName in this.rendererStateVariables[comp.componentType]) {
          this.updateInfo.componentsToUpdateRenderers.push(comp.componentName);
        }

        if (compStateObj.isArray) {

          let essentialArray = comp.essentialState[essentialVarName];

          if (!Array.isArray(essentialArray)) {
            essentialArray = comp.essentialState[essentialVarName] = [];
          }

          let arrayEntryNamesAffected = [];


          // If array size state variable isn't initially resolved,
          // arraySize will return an empty array.
          // Call its value to resolve it
          if (!comp.state[compStateObj.arraySizeStateVariable].initiallyResolved) {
            await comp.state[compStateObj.arraySizeStateVariable].value
          }

          let arraySize = await compStateObj.arraySize;


          // newComponentStateVariables[vName] must be an object keyed on arrayKeys
          // except that it will have mergeObject=true
          // to tell external functions new attributes of the object
          // should be merged into the old object

          for (let arrayKey in newComponentStateVariables[vName]) {

            if (arrayKey === "mergeObject") {
              continue;
            }

            let set = x => x;
            if (compStateObj.set) {
              set = compStateObj.set;
            }

            let setResult = compStateObj.setArrayValue({
              value: set(newComponentStateVariables[vName][arrayKey]),
              arrayKey,
              arraySize,
              arrayValues: essentialArray
            });

            compStateObj.usedDefaultByArrayKey[arrayKey] = false;

            nFailures += setResult.nFailures;

            // mark any array entry state variables containing arrayKey
            // as affected

            let varNamesContainingArrayKey = compStateObj.varNamesIncludingArrayKeys[arrayKey];
            if (varNamesContainingArrayKey) {
              arrayEntryNamesAffected.push(...varNamesContainingArrayKey);
            }


          }



          for (let arrayEntryName of arrayEntryNamesAffected) {

            await this.recordActualChangeInStateVariable({
              componentName: cName,
              varName: arrayEntryName,
            })

          }
        } else {

          // don't have array

          if (!compStateObj.hasEssential) {

            console.warn(`can't update state variable ${vName} of component ${cName}, as it does not have an essential state variable.`);
            continue;
          }

          if (compStateObj.set) {
            comp.essentialState[essentialVarName] = compStateObj.set(newComponentStateVariables[vName]);
          } else {
            comp.essentialState[essentialVarName] = newComponentStateVariables[vName];
          }

          delete compStateObj.usedDefault;

        }

        await this.recordActualChangeInStateVariable({
          componentName: cName,
          varName: vName,
        })

      }
    }

    return { nFailures, foundIgnore };

  }

  async requestComponentChanges({
    instruction, initialChange = true, workspace,
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


    let stateVarObj = component.state[stateVariable];

    let additionalStateVariablesDefined = stateVarObj.additionalStateVariablesDefined;

    let allStateVariablesAffected = [stateVariable];
    if (additionalStateVariablesDefined) {
      allStateVariablesAffected.push(...additionalStateVariablesDefined)
    }

    for (let varName of allStateVariablesAffected) {

      if (!component.state[varName].isResolved) {

        let result = await this.dependencies.resolveItem({
          componentName: component.componentName,
          type: "stateVariable",
          stateVariable: varName,
          force: true,
        });

        if (!result.success) {
          throw Error(`Can't get value of ${stateVariable} of ${component.componentName} as ${varName} couldn't be resolved.`);
        }

      }

    }


    let inverseDefinitionArgs = await this.getStateVariableDefinitionArguments({ component, stateVariable });
    inverseDefinitionArgs.componentInfoObjects = this.componentInfoObjects;
    inverseDefinitionArgs.initialChange = initialChange;
    inverseDefinitionArgs.stateValues = component.stateValues;
    inverseDefinitionArgs.overrideFixed = instruction.overrideFixed;
    inverseDefinitionArgs.shadowedVariable = instruction.shadowedVariable;
    inverseDefinitionArgs.sourceInformation = instruction.sourceInformation;


    let stateVariableForWorkspace = stateVariable;

    if (stateVarObj.isArrayEntry) {
      let arrayStateVariable = stateVarObj.arrayStateVariable;
      stateVariableForWorkspace = arrayStateVariable;

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
            desiredValuesForArray[inverseDefinitionArgs.arrayKeys[0]] = await sObj.value
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
          inverseDefinitionArgs.desiredStateVariableValues = { [stateVariable]: await sObj.value };
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


    if (!stateVarObj.inverseDefinition) {
      console.warn(`Cannot change state variable ${stateVariable} of ${component.componentName} as it doesn't have an inverse definition`);
      return;
    }

    if (await component.stateValues.fixed && !instruction.overrideFixed) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed because fixed is true.`);
      return;
    }

    if (!(initialChange || await component.stateValues.modifyIndirectly !== false)) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed because modifyIndirectly is false.`);
      return;
    }

    let inverseResult = await stateVarObj.inverseDefinition(inverseDefinitionArgs);

    if (!inverseResult.success) {
      // console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed.`);
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

          if ((depStateVarObj.isArrayEntry || depStateVarObj.isArray)
            && !depStateVarObj.doNotCombineInverseArrayInstructions
          ) {

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
            if (!(newInstruction.additionalDependencyValues || depStateVarObj.basedOnArrayKeyStateVariables)) {
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

                let arrayKeys = await depStateVarObj.arrayKeys;

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

      if (newInstruction.setEssentialValue) {
        if (!allStateVariablesAffected.includes(newInstruction.setEssentialValue)) {
          let foundArrayMatch = false;
          if (stateVarObj.isArrayEntry) {
            let arrayStateVariables = [stateVarObj.arrayStateVariable];
            if (stateVarObj.additionalStateVariablesDefined) {
              for (let vName of stateVarObj.additionalStateVariablesDefined) {
                let sObj = component.state[vName];
                if (sObj.isArrayEntry) {
                  arrayStateVariables.push(sObj.arrayStateVariable)
                }
              }
            }
            foundArrayMatch = arrayStateVariables.includes(newInstruction.setEssentialValue);
          }
          if (!foundArrayMatch) {
            throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: specified changing value of ${newInstruction.setEssentialValue}, which is not a state variable defined with ${stateVariable}.`);
          }
        }

        if (!component.state[newInstruction.setEssentialValue].hasEssential) {
          throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: can't set essential value of ${newInstruction.setEssentialValue} if it is does not have an essential value.`);
        }

        if (!("value" in newInstruction)) {
          throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: setEssentialValue must specify a value`);
        }

        let value = newInstruction.value;

        if (value instanceof me.class) {
          let result = await preprocessMathInverseDefinition({
            desiredValue: value,
            stateValues: component.stateValues,
            variableName: newInstruction.setEssentialValue,
            workspace: stateVariableWorkspace,
          })
          value = result.desiredValue
        }

        if (component.state[newInstruction.setEssentialValue].doNotShadowEssential
          || component.state[newInstruction.setEssentialValue].shadowVariable
        ) {

          // Note: if shadow state variable, then we don't shadow essential
          // as the shadowed state variables will not use the essential value

          this.calculateEssentialVariableChanges({
            component,
            varName: newInstruction.setEssentialValue,
            value,
            newStateVariableValues,
            recurseToShadows: false
          });

        } else {
          // For setting essential value, we keep the values for all 
          // shadowed components in sync.
          // We find the original component and the recurse on all the components
          // that shadow it
          let baseComponent = component;
          while (baseComponent.shadows && baseComponent.shadows.propVariable === undefined) {
            baseComponent = this._components[baseComponent.shadows.componentName]
          }

          this.calculateEssentialVariableChanges({
            component: baseComponent,
            varName: newInstruction.setEssentialValue,
            value,
            newStateVariableValues
          });
        }

      } else if (newInstruction.setDependency) {
        let dependencyName = newInstruction.setDependency;

        let dep = this.dependencies.downstreamDependencies[component.componentName][stateVariable][dependencyName];

        if (dep.dependencyType === "child") {

          let childInd = newInstruction.childIndex;

          if (dep.downstreamPrimitives[childInd] !== null) {
            // have a primitive child
            // if desiredValue is same type of primitive, set it as a state variable

            // TODO: how to address case if string index could change


            if (typeof newInstruction.desiredValue === typeof dep.downstreamPrimitives[childInd]) {

              let parent = this._components[dep.parentName];

              let activeChildInd = dep.activeChildrenIndices[childInd];

              // TODO: if child is a replacement of a composite, determine what to do
              if (parent.compositeReplacementActiveRange) {
                for (let compositeObj of parent.compositeReplacementActiveRange) {
                  if (compositeObj.firstInd <= activeChildInd && compositeObj.lastInd >= activeChildInd) {
                    console.log(`parent: ${parent.componentName}, activeChildInd: ${activeChildInd}`)
                    console.log(parent.compositeReplacementActiveRange)
                    console.log(newInstruction)
                    throw Error('Need to implement changing primitive replacements from composite')
                  }
                }
              }


              let definingInd = activeChildInd;
              if (parent.compositeReplacementActiveRange) {
                for (let compositeObj of parent.compositeReplacementActiveRange) {
                  if (compositeObj.lastInd < definingInd) {
                    definingInd -= compositeObj.lastInd - compositeObj.firstInd;
                  }
                }
              }


              // For primitive children, we keep the values for all 
              // shadowed parents in sync.
              // We find the original parent and the recurse on all the parents
              // that shadow it
              let baseParent = parent;
              while (baseParent.shadows && baseParent.shadows.propVariable === undefined) {
                baseParent = this._components[baseParent.shadows.componentName]
              }

              let markToIgnoreForParent;

              if (newInstruction.ignoreChildChangeForComponent) {
                markToIgnoreForParent = parent.componentName;
              }

              this.calculatePrimitiveChildChanges({
                parent: baseParent,
                definingInd,
                newValue: newInstruction.desiredValue,
                newStateVariableValues,
                markToIgnoreForParent,
              });
            }

          } else {

            // find downstream ind of childInd

            let downstreamInd = dep.downstreamPrimitives.slice(0, childInd + 1).filter(x => !x).length - 1;

            let cName = dep.downstreamComponentNames[downstreamInd];
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
            await this.requestComponentChanges({
              instruction: inst,
              initialChange: newInstruction.treatAsInitialChange === true,
              workspace,
              newStateVariableValues
            });
          }
        } else if (dep.dependencyType === "attributeComponent") {
          let cName = dep.downstreamComponentNames[0];
          let varName = dep.mappedDownstreamVariableNamesByComponent[0][newInstruction.variableIndex];
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
          await this.requestComponentChanges({
            instruction: inst,
            initialChange: newInstruction.treatAsInitialChange === true,
            workspace,
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
          await this.requestComponentChanges({
            instruction: inst,
            initialChange: newInstruction.treatAsInitialChange === true,
            workspace,
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

        await this.requestComponentChanges({
          instruction: inst,
          initialChange: newInstruction.treatAsInitialChange === true,
          workspace,
          newStateVariableValues
        });
        // } else if (newInstruction.deferSettingDependency) {
        //   let dependencyName = newInstruction.deferSettingDependency;

        //   let dep = this.dependencies.downstreamDependencies[component.componentName][stateVariable][dependencyName];

        //   if (dep.dependencyType === "child") {
        //     let cName = dep.downstreamComponentNames[newInstruction.childIndex];
        //     if (!cName) {
        //       throw Error(`Invalid for deferSettingDependency in inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`)
        //     }

        //     let varName = dep.mappedDownstreamVariableNamesByComponent[newInstruction.childIndex][newInstruction.variableIndex];
        //     if (!varName) {
        //       throw Error(`Invalid for deferSettingDependency in inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist..`)
        //     }

        //     let componentToDefer = this._components[cName];

        //     if (componentToDefer.componentType !== "string") {
        //       throw Error(`deferStateVariableDependency is implemented just when dependency is a string.`)
        //     }

        //     // save previous value if don't have a getter
        //     if (!Object.getOwnPropertyDescriptor(componentToDefer.state[varName], 'value').get) {
        //       componentToDefer.state[varName]._previousValue = componentToDefer.state[varName].value;
        //     }

        //     delete componentToDefer.state[varName].value;

        //     let getDefStateVar = () => this.getDeferredStateVariable({
        //       component: componentToDefer,
        //       stateVariable: varName,
        //       upstreamComponent: component,
        //       upstreamStateVariable: stateVariable,
        //       dependencyValues: newInstruction.dependencyValues,
        //       inverseDefinition: newInstruction.inverseDefinition,
        //     });

        //     Object.defineProperty(componentToDefer.state[varName], 'value', { get: getDefStateVar, configurable: true });
        //     componentToDefer.state[varName].deferred = true;

        //   } else {
        //     throw Error(`unimplemented dependency type ${dep.dependencyType} in requestComponentChanges`)
        //   }

      } else {
        console.log(newInstruction);
        throw Error(`Unrecognized instruction in inverse definition of ${stateVariable} of ${component.componentName}`)
      }
    }

    return;
  }

  calculateEssentialVariableChanges({
    component,
    varName,
    value,
    newStateVariableValues,
    recurseToShadows = true,
  }) {

    if (!newStateVariableValues[component.componentName]) {
      newStateVariableValues[component.componentName] = {};
    }

    if (component.state[varName].isArray) {
      if (!newStateVariableValues[component.componentName][varName]) {
        // include key mergeObject to let external functions
        // know that new attributes of the object
        // should be merged into the old object
        newStateVariableValues[component.componentName][varName] = {
          mergeObject: true
        };
      }

      Object.assign(
        newStateVariableValues[component.componentName][varName],
        value
      );

    } else {
      newStateVariableValues[component.componentName][varName] = value;
    }

    if (recurseToShadows && component.shadowedBy) {
      for (let shadow of component.shadowedBy) {
        if (shadow.shadows.propVariable === undefined) {
          this.calculateEssentialVariableChanges({
            component: shadow,
            varName,
            value,
            newStateVariableValues
          })

        }
      }
    }

  }

  calculatePrimitiveChildChanges
    ({
      parent,
      definingInd,
      newValue,
      newStateVariableValues,
      markToIgnoreForParent
    }) {

    if (!newStateVariableValues[parent.componentName]) {
      newStateVariableValues[parent.componentName] = {};
    }
    if (parent.componentName === markToIgnoreForParent) {
      newStateVariableValues[parent.componentName][`__def_primitive_ignore_${definingInd}`] = newValue;
    } else {
      newStateVariableValues[parent.componentName][`__def_primitive_${definingInd}`] = newValue;
    }

    if (parent.shadowedBy) {
      for (let shadow of parent.shadowedBy) {
        if (shadow.shadows.propVariable === undefined) {
          this.calculatePrimitiveChildChanges({
            parent: shadow,
            definingInd,
            newValue,
            newStateVariableValues,
            markToIgnoreForParent
          })

        }
      }
    }

  }

  // submitResponseCallBack(results) {

  //   // console.log(`submit response callback`)
  //   // console.log(results);
  //   return;

  //   if (!results.success) {
  //     let errorMessage = "Answer not saved due to a network error. \nEither you are offline or your authentication has timed out.";
  //     this.renderer.updateSection({
  //       title: this.state.title,
  //       viewedSolution: this.state.viewedSolution,
  //       isError: true,
  //       errorMessage,
  //     });
  //     alert(errorMessage);

  //     this.coreFunctions.requestUpdate({
  //       updateType: "updateRendererOnly",
  //     });
  //   } else if (results.viewedSolution) {
  //     console.log(`******** Viewed solution for ${scoredComponent.componentName}`);
  //     this.coreFunctions.requestUpdate({
  //       updateType: "updateValue",
  //       updateInstructions: [{
  //         componentName: scoredComponent.componentName,
  //         variableUpdates: {
  //           viewedSolution: { changes: true },
  //         }
  //       }]
  //     })
  //   }

  //   // if this.answersToSubmitCounter is a positive number
  //   // that means that we have call this.submitAllAnswers and we still have
  //   // some answers that haven't been submitted
  //   // In this case, we will decrement this.answersToSubmitCounter
  //   // If this.answersToSubmitCounter newly becomes zero, 
  //   // then we know that we have submitted the last one answer
  //   if (this.answersToSubmitCounter > 0) {
  //     this.answersToSubmitCounter -= 1;
  //     if (this.answersToSubmitCounter === 0) {
  //       this.externalFunctions.allAnswersSubmitted();
  //     }
  //   }
  // }

  // addComponents({ serializedComponents, parent }) {
  //   //Check if 
  //   //Child logic is violated
  //   //Parent exists
  //   //Check composites in serializedComponents??
  // }

  // getDeferredStateVariable({ component, stateVariable, upstreamComponent, upstreamStateVariable, dependencyValues, inverseDefinition }) {

  //   // console.log(`get deferred state variable ${stateVariable} of ${component.componentName}`)

  //   let inverseResult = inverseDefinition({ dependencyValues, stateValues: upstreamComponent.stateValues });

  //   if (!inverseResult.success) {
  //     console.warn(`Inverse definition for deferring state variable failed. component: ${component.componentName}, stateVariable: ${stateVariable}, upstreamComponent: ${upstreamComponent.componentName}, upstreamStateVariable: ${upstreamStateVariable}`);
  //     return undefined;
  //   }

  //   for (let newInstruction of inverseResult.instructions) {
  //     if (newInstruction.setDependency) {
  //       let dependencyName = newInstruction.setDependency;

  //       let dep = this.dependencies.downstreamDependencies[upstreamComponent.componentName][upstreamStateVariable][dependencyName];

  //       if (dep.dependencyType === "child") {
  //         let cName = dep.downstreamComponentNames[newInstruction.childIndex];
  //         if (!cName) {
  //           throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`)
  //         }
  //         let varName = dep.mappedDownstreamVariableNamesByComponent[newInstruction.childIndex][newInstruction.variableIndex];
  //         if (!varName) {
  //           throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist..`)
  //         }

  //         let compNew = this._components[cName];

  //         // delete before assigning value to remove any getter for the property
  //         delete compNew.state[varName].value;
  //         delete compNew.state[varName].deferred;
  //         compNew.state[varName].value = newInstruction.desiredValue;

  //       } else {
  //         throw Error(`unimplemented dependency type ${dep.dependencyType} in deferred inverse definition`)
  //       }

  //     } else {
  //       throw Error(`Unrecognized instruction deferred inverse definition of ${stateVariable} of ${component.componentName}`)
  //     }
  //   }


  //   // if value of state variable still has a get, then it wasn't defined
  //   // in the function called for its definition
  //   if (Object.getOwnPropertyDescriptor(component.state[stateVariable], 'value').get) {
  //     throw Error(`deferred inverse definition of ${stateVariable} of ${component.componentName} didn't return value of variable`);
  //   }

  //   return component.state[stateVariable].value;

  // }

  async calculateScoredItemNumberOfContainer(componentName) {

    let component = this._components[componentName];
    let ancestorNames = [
      ...component.ancestors.slice(0, -1).reverse().map(x => x.componentName),
      componentName
    ];
    let scoredComponent;
    let scoredItemNumber;
    for (let [index, scored] of (await this.document.stateValues.scoredDescendants).entries()) {
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
      scoredItemNumber = (await this.document.stateValues.scoredDescendants).length;
    }

    return { scoredItemNumber, scoredComponent };
  }

  recordSolutionView({ itemNumber, scoredComponent }) {
    let messageId = nanoid();

    postMessage({ messageType: "recordSolutionView", args: { itemNumber, scoredComponent, messageId } })

    return new Promise((resolve, reject) => {
      this.resolveRecordSolutionView[messageId] = resolve;
    })
  }

  get doenetState() {
    return this._renderComponents;
  }

  set doenetState(value) {
    return null;
  }

  get scoredItemWeights() {
    return (async () => (await this.document.stateValues.scoredDescendants).map(
      x => x.stateValues.weight
    ))();
  }

  requestAnimationFrame(animationFunction, delay) {
    if (!this.preventMoreAnimations) {

      // // create new animationID
      // let animationID = ++this.lastAnimationID;

      // if (delay) {
      //   // set a time out to call actual request animation frame after a delay
      //   let timeoutID = window.setTimeout(
      //     x => this._requestAnimationFrame(animationFunction, animationID),
      //     delay);
      //   this.animationIDs[animationID] = { timeoutID: timeoutID };
      //   return animationID;
      // } else {
      //   // call actual request animation frame right away
      //   this.animationIDs[animationID] = {};
      //   return this._requestAnimationFrame(animationFunction, animationID);
      // }
    }
  }

  _requestAnimationFrame(animationFunction, animationID) {
    // let animationFrameID = window.requestAnimationFrame(animationFunction);
    // let animationIDObj = this.animationIDs[animationID];
    // delete animationIDObj.timeoutID;
    // animationIDObj.animationFrameID = animationFrameID;
    // return animationID;
  }


  async cancelAnimationFrame(animationID) {
    // let animationIDObj = this.animationIDs[animationID];
    // let timeoutID = animationIDObj.timeoutID;
    // if (timeoutID !== undefined) {
    //   window.clearTimeout(timeoutID);
    // }
    // let animationFrameID = animationIDObj.animationFrameID;
    // if (animationFrameID !== undefined) {
    //   window.cancelAnimationFrame(animationFrameID);
    // }
    // delete this.animationIDs[animationID];

  }

  componentWillUnmount() {
    this.preventMoreAnimations = true;
    for (let id in this.animationIDs) {
      this.coreFunctions.cancelAnimationFrame(id);
    }
    this.animationIDs = {};
  }

}


function validateAttributeValue({ value, attributeSpecification, attribute }) {

  if (attributeSpecification.valueTransformations &&
    value in attributeSpecification.valueTransformations
  ) {
    value = attributeSpecification.valueTransformations[value];
  }

  if (attributeSpecification.transformNonFiniteTo !== undefined &&
    !Number.isFinite(value)
  ) {
    value = attributeSpecification.transformNonFiniteTo;
  }

  if (attributeSpecification.toLowerCase) {
    value = value.toLowerCase();
  }

  if (attributeSpecification.trim) {
    value = value.trim();
  }

  if (attributeSpecification.validValues) {
    if (!attributeSpecification.validValues.includes(value)) {
      let firstValue = attributeSpecification.validValues[0]
      console.warn(`Invalid value ${value} for attribute ${attribute}, using value ${firstValue}`);
      value = firstValue;
    }
  } else if (attributeSpecification.clamp) {
    if (value < attributeSpecification.clamp[0]) {
      value = attributeSpecification.clamp[0];
    } else if (value > attributeSpecification.clamp[1]) {
      value = attributeSpecification.clamp[1];
    } else if (!Number.isFinite(value)) {
      value = attributeSpecification.defaultValue;
    }
  }

  return value;
}

function calculateAllComponentsShadowing(component) {
  let allShadowing = [];
  if (component.shadowedBy) {
    for (let comp2 of component.shadowedBy) {
      if (!comp2.shadows.propVariable) {
        allShadowing.push(comp2.componentName);
        let additionalShadowing = calculateAllComponentsShadowing(comp2);
        allShadowing.push(...additionalShadowing);
      }
    }
  }
  if (component.replacementOf) {
    let additionalShadowing = calculateAllComponentsShadowing(component.replacementOf);
    allShadowing.push(...additionalShadowing);
  }

  return allShadowing;
}
