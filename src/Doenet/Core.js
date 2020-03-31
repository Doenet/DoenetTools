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
import { deepClone } from './utils/deepFunctions';
import createStateProxyHandler from './StateProxyHandler';
import { postProcessRef } from './components/Ref';

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
    this.getComponentNamesForProp = this.getComponentNamesForProp.bind(this);

    this.coreUpdatedCallback = coreUpdatedCallback;
    this._standardComponentClasses = ComponentTypes.standardComponentClasses();
    this._allComponentClasses = ComponentTypes.allComponentClasses();
    this._componentTypesTakingComponentNames = ComponentTypes.componentTypesTakingComponentNames();
    this._componentTypesCreatingVariants = ComponentTypes.componentTypesCreatingVariants();

    this._allPossibleProperties = this.createAllPossibleProperties();

    this.componentInfoObjects = {
      standardComponentClasses: this.standardComponentClasses,
      allComponentClasses: this.allComponentClasses,
      componentTypesTakingComponentNames: this.componentTypesTakingComponentNames,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      allPossibleProperties: this.allPossibleProperties,
      isInheritedComponentType: this.isInheritedComponentType
    };

    this.animationIDs = {};
    this.lastAnimationID = 0;
    this.requestedVariant = requestedVariant;
    this.coreReadyCallback = coreReadyCallback;

    // console.time('serialize doenetML');

    this.parameterStack = new ParameterStack(parameters);
    this.setUpRng();


    this.idRng = new MersenneTwister('47');

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
        idRng: this.idRng
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
    this.deletedStateVariables = {};

    this._renderComponents = [];
    this._renderComponentsByName = {};
    this._graphRenderComponents = [];

    this.descendantDependenciesByAncestor = {};
    this.ancestorDependenciesByDescendant = {};

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
      core: this
    }

    this.changedStateVariables = {};

    this.addComponents({
      serializedState: serializedState,
      initialAdd: true,
      applySugar: true,
    })

    this.rendererTypesInDocument = this._components[this.documentName].allPotentialRendererTypes;

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

    }

    this.finishUpdate({
      addedComponents: addedComponents,
      deletedComponents: deletedComponents,
      init: initialAdd,
    });

    return newComponents;
  }


  updateRendererInstructions({ componentNames, sourceOfUpdate }) {

    // create shallow copy so can add components to end
    // if parent comes after child

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
            if (comp.rendererType) {

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
        if (!child.rendererType) {
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
    let componentNames = [component.componentName];
    if (component.stateValues.childrenToRender) {
      for (let childName of component.stateValues.childrenToRender) {
        componentNames.push(...this.componentAndRenderedDescendants(this._components[childName]));
      }
    }
    return componentNames;
  }

  createIsolatedComponents({ serializedState, ancestors, applySugar = false,
    applyAdapters = true, shadow = false }
  ) {

    this.unresolvedDependencies = {};
    this.unresolvedByDependent = {};

    let createResult = this.createIsolatedComponentsSub({
      serializedState: serializedState,
      ancestors,
      applySugar, applyAdapters,
      shadow,
    });

    console.log("createResult")
    console.log(createResult)

    let newComponents = createResult.components;

    // console.log(JSON.parse(JSON.stringify(this.unresolvedDependencies)))
    // console.log(JSON.parse(JSON.stringify(this.unresolvedByDependent)))


    if (Object.keys(this.unresolvedDependencies).length > 0) {
      this.unresolvedMessage = "";
      this.resolveAllDependencies();
    }
    if (Object.keys(this.unresolvedDependencies).length > 0) {
      console.log("have some unresolved");
      console.log(this.unresolvedDependencies);
      console.log(this.unresolvedByDependent);
      return { success: false, message: this.unresolvedMessage }
    }


    return {
      success: true,
      components: newComponents,
    }


  }

  createIsolatedComponentsSub({ serializedState, ancestors, applySugar = false,
    applyAdapters = true, shadow = false }
  ) {

    let newComponents = [];

    //TODO: last message
    let lastMessage = "";

    for (let serializedComponent of serializedState) {

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

      // if have a componentName, use that for componentName
      // otherwise generate automatic name
      let componentName;
      if (serializedComponent.doenetAttributes !== undefined) {
        componentName = serializedComponent.doenetAttributes.componentName;
      }
      if (componentName === undefined) {
        componentName = createUniqueName(serializedComponent.componentType,
          this.idRng)
      }

      let createResult = this.createChildrenThenComponent({
        serializedComponent,
        componentName,
        ancestors,
        componentClass, applySugar,
        applyAdapters, shadow,
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
    applySugar = false, applyAdapters = true, shadow = false }
  ) {

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

        if (variantControlInd || componentClass.alwaysSetUpVariant) {
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
      let ancestorName = propertiesPropagated[property];
      if (prescribedDependencies[ancestorName] === undefined) {
        prescribedDependencies[ancestorName] = [];
      }
      prescribedDependencies[ancestorName].push({
        dependencyType: "ancestorProp",
        property,
      })
    }

    let stateVariableDefinitions = this.createStateVariableDefinitions({
      childLogic,
      componentClass,
      prescribedDependencies,
      componentName,
    });


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


    this.deriveChildResultsFromDefiningChildren(newComponent);

    this.initializeComponentStateVariables(newComponent);

    if (newComponent.childLogicSatisfied) {

      let { varsUnresolved } = this.createAndResolveDependencies(newComponent);

      this.addUnresolvedDependencies({ varsUnresolved, component: newComponent });
    } else {

      if (!this.unresolvedDependencies[newComponent.componentName]) {
        this.unresolvedDependencies[newComponent.componentName] = {};
      }

      // child logic not satisfied
      for (let varName in newComponent.state) {
        this.unresolvedDependencies[newComponent.componentName][varName] = [{
          componentName: newComponent.componentName,
          stateVariable: "__childLogic"
        }];
      }
    }


    // remove a level from parameter stack;
    this.parameterStack.pop();

    let results = { newComponent: newComponent };
    // Object.assign(results, failures);
    return results;

  }

  addUnresolvedDependencies({ varsUnresolved, component }) {
    if (Object.keys(varsUnresolved).length > 0) {
      if (!this.unresolvedDependencies[component.componentName]) {
        this.unresolvedDependencies[component.componentName] = {};
      }
      Object.assign(this.unresolvedDependencies[component.componentName],
        varsUnresolved);

      // calculate the reverse direction of unresolved dependencies
      for (let varName in varsUnresolved) {
        for (let dep of varsUnresolved[varName]) {
          if (!this.unresolvedByDependent[dep.componentName]) {
            this.unresolvedByDependent[dep.componentName] = {};
          }
          if (!this.unresolvedByDependent[dep.componentName][dep.stateVariable]) {
            this.unresolvedByDependent[dep.componentName][dep.stateVariable] = [];
          }
          this.unresolvedByDependent[dep.componentName][dep.stateVariable].push({
            componentName: component.componentName,
            stateVariable: varName,
          });
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
        propertiesToPropagate[property] = componentName;
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

  createAndResolveDependencies(component) {

    this.applySugarOrAddSugarCreationStateVariables({
      component
    });

    this.setUpComponentDependencies({ component });

    return this.resolveStateVariables({ component });

  }

  deriveChildResultsFromDefiningChildren(component) {
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
    let compositeChildNotReadyToExpand = this.replaceCompositeChildren(component);

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
    });

    return childLogicResults;

  }

  matchChildrenToChildLogic({ component, matchSugar = false, applyAdapters = true }) {

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
        this.substituteAdapters(component);
        break;
      }
    }

    return { success };

  }

  expandCompositeComponent({ component }) {

    let readyToExpand;
    if (!("readyToExpandWhenResolved" in component.state)) {
      throw Error(`Could not evaluate state variable readyToExpandWhenResolved of composite ${component.componentName}`);
    }

    readyToExpand = component.state.readyToExpandWhenResolved.isResolved;

    if (!readyToExpand) {
      return { success: false };
    }

    // console.log(`expanding composite ${component.componentName}`);

    let shadowedComposite;

    if (component.shadows) {
      shadowedComposite = this._components[component.shadows.componentName];

      if (!shadowedComposite.isExpanded) {
        let result = this.expandCompositeComponent({
          component: shadowedComposite
        });
        if (!result.success) {
          return { sucess: false, readyToExpand: true };
        }
      }

    }

    // TODO: verify this works and understand what it does
    if (component.stateValues.stateVariablesRequested) {
      for (let stateVarInfo of component.stateValues.stateVariablesRequested) {
        let componentOrReplacementNames = this.getComponentNamesForProp(stateVarInfo.componentOrReplacementOf);
        let targetComponent = this._components[componentOrReplacementNames[0]];
        let targetVarObj = targetComponent.state[stateVarInfo.stateVariable];

        if (targetVarObj === undefined) {
          // if target state variable doesn't exist, attempt to create and resolve it
          // TODO: handle unresolved variables created from this?
          let result = this.createFromAliasOrArrayEntry({
            stateVariable: stateVarInfo.stateVariable,
            component: targetComponent
          });

          if (Object.keys(result.varsUnresolved).length > 0) {
            this.addUnresolvedDependencies({
              varsUnresolved: result.varsUnresolved,
              component: targetComponent
            });

            // // make readyToExpand be marked as unresolved
            // // dependent on newly unresolved components of target
            // let readyToExpandVarsUnresolved = [];
            // for (let varName in result.varsUnresolved) {
            //   readyToExpandVarsUnresolved.push({
            //     componentName: targetComponent.componentName,
            //     stateVariable: varName
            //   })
            // }
            // this.addUnresolvedDependencies({
            //   varsUnresolved: { readyToExpand: readyToExpandVarsUnresolved },
            //   component
            // });

            // return { success: false };
          }

        }
      }
    }

    let result = component.constructor.createSerializedReplacements({
      component,
      components: this.components,
      workspace: component.replacementsWorkspace,
      getComponentNamesForProp: this.getComponentNamesForProp,
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
      } else if (component.shadows) {
        // if shadowing a composite but don't have serializedReplacements
        // it means that the shadowed composite wasn't expanded at the time
        // when shadowing component was created.
        // serialize shadowed composite's replacements
        serializedReplacements = shadowedComposite.replacements.map(x => x.serialize({ forReference: true }))
      }

      if (component.shadows) {
        // add shadow dependencies from composite's shadows
        // to the shadows of the shadowed composite

        let refComponentName = component.shadows.refComponentName;
        let shadowedComposite = this._components[component.shadows.componentName];

        this.addShadowDependencies({
          serializedComponents: serializedReplacements,
          shadowedComponents: shadowedComposite.replacements,
          refComponentName,
        })
      }

      this.createAndSetReplacements({
        component,
        serializedReplacements,
      });
    } else if (result.replacementsWithInstructions) {

      let serializedReplacementsFromComponent;
      if (component.serializedReplacements) {
        // if component came with serialized replacements, use those instead
        // however, we will push any sharedparameters from instructions
        // before creating
        serializedReplacementsFromComponent = component.serializedReplacements;
        delete component.serializedReplacements;
      } else if (component.shadows) {
        // if shadowing a composite but don't have serializedReplacements
        // it means that the shadowed composite wasn't expanded at the time
        // when shadowing component was created.
        // serialize shadowed composite's replacements
        serializedReplacementsFromComponent = shadowedComposite.replacements.map(x => x.serialize({ forReference: true }))
      }

      if (component.shadows) {
        // add shadow dependencies from composite's shadows
        // to the shadows of the shadowed composite

        let refComponentName = component.shadows.refComponentName;
        let shadowedComposite = this._components[component.shadows.componentName];

        this.addShadowDependencies({
          serializedComponents: serializedReplacementsFromComponent,
          shadowedComponents: shadowedComposite.replacements,
          refComponentName,
        })

      }

      this.createAndSetReplacementsWithInstructions({
        component,
        replacementsWithInstructions: result.replacementsWithInstructions,
        serializedReplacementsFromComponent
      })
    } else {
      throw Error(`Invalid createSerializedReplacements of ${component.componentName}`);
    }
    return { success: true };
  }

  addShadowDependencies({ serializedComponents, shadowedComponents, refComponentName }) {

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
        refComponentName
      }]

      if (serializedComp.children &&
        !(shadowedComp.serializedChildren && shadowedComp.serializedChildren.length > 0)
      ) {
        this.addShadowDependencies({
          serializedComponents: serializedComp.children,
          shadowedComponents: shadowedComp.definingChildren,
          refComponentName
        })
      }
    }
  }

  createAndSetReplacements({ component, serializedReplacements }) {

    this.parameterStack.push(component.sharedParameters, false);

    let replacementResult = this.createIsolatedComponentsSub({
      serializedState: serializedReplacements,
      ancestors: component.ancestors,
      applySugar: true,
      shadow: true,
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
    serializedReplacementsFromComponent
  }) {

    this.parameterStack.push(component.sharedParameters, false);

    let replacements = this.processReplacementsWithInstructions({
      replacementsWithInstructions, serializedReplacementsFromComponent, component
    });

    this.parameterStack.pop();

    component.replacements = replacements;
    component.isExpanded = true;

    // record for top level replacement that they are a replacement of composite
    for (let comp of component.replacements) {
      comp.replacementOf = component;
    }

  }

  processReplacementsWithInstructions({ replacementsWithInstructions, serializedReplacementsFromComponent, component }) {

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

          // make a deep copy to get rid of the readonly proxy
          // TODO: test if deepClone is faster
          replacementsToAdd = JSON.parse(JSON.stringify(replacementsToAdd), me.reviver);
          let namespace = instruction.namespace;

          if (namespace === undefined) {
            namespace = createUniqueName(component.componentType,
              this.idRng);
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
            idRng: this.idRng
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

          // make a deep copy to get rid of the readonly proxy
          // TODO: test if deepClone is faster
          replacementsToAdd = JSON.parse(JSON.stringify(replacementsToAdd), me.reviver);
          let name = instruction.name;

          if (name === undefined) {
            name = createUniqueName(component.componentType,
              this.idRng);
          }

          let theReplacement = replacementsToAdd[0];

          if (Array.isArray(name)) {
            // if name is an array, then it refers to names of the grandchildren

            let nameForChild = createUniqueName(component.componentType,
              this.idRng);
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
                  nameForGrandchild = createUniqueName(component.componentType,
                    this.idRng);
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
            idRng: this.idRng
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
      });

      replacements.push(...replacementResult.components);

      this.parameterStack.pop();
    }

    return replacements;
  }

  replaceCompositeChildren(component) {
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

        // even replacements that are marked as being withheld
        // should be in allChildren
        if (child.replacementsToWithhold > 0) {
          for (let ind2 = replacements.length; ind2 < child.replacements.length; ind2++) {
            let withheldReplacement = child.replacements[ind2];
            component.allChildren[withheldReplacement.componentName] = {
              component: withheldReplacement,
            }
          }
        }
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

    return compositeChildNotReadyToExpand;
  }

  substituteAdapters(component) {

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
          });
          // mergeFailures(overallResults, newChildrenResult);

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

  replaceChildrenBySugar({ component, childLogicName, dependencyValues }) {

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
      idRng: this.idRng,
    });

    if (!sugarResults.success) {

      console.warn(`Applying sugar for ${component.componentName} failed: ${sugarResults.message}`)

      // sugar failed.
      // rerun child logic, now that we have marked childlogic component
      // as already having used sugars
      this.deriveChildResultsFromDefiningChildren(component);

      if (!component.childLogicSatisfied) {
        // TODO: handle case where child logic is no longer satisfied
        console.error(`Child logic of ${component.componentName} is not satisfied after failing to apply sugar`)
      }

      this.markChildAndDescendantDependenciesChanged(component);

      return
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
        });

        // immediately apply sugar to shadows
        // so that defining indices from changes still apply
        // (at later sugar changes could add/delete defining changes)
        if (child.shadowedBy) {
          for (let shadowingComponent of child.shadowedBy) {
            if (!shadowingComponent.shadows.propVariable) {
              this.applySugarToShadows(({
                originalComponent: child,
                shadowingComponent,
                changes,
                componentsShadowingDeleted: result.componentsShadowingDeleted
              }))
            }
          }
        }

        this.deriveChildResultsFromDefiningChildren(child);

        if (!component.childLogicSatisfied) {
          // TODO: handle case where child logic is no longer satisfied
          console.error(`Child logic of ${component.componentName} is not satisfied after applying sugar to children`)
        }

        this.markChildAndDescendantDependenciesChanged(child);

      }
    }

    for (let changes of sugarResults.baseChanges) {
      let result = this.replaceDefiningChildrenBySugar({
        component,
        sugarResults: changes,
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
              componentsShadowingDeleted: result.componentsShadowingDeleted
            }))
          }
        }
      }
    }

    this.deriveChildResultsFromDefiningChildren(component);

    if (!component.childLogicSatisfied) {
      // TODO: handle case where child logic is no longer satisfied
      console.error(`Child logic of ${component.componentName} is not satisfied after applying sugar`)
    }

    this.markChildAndDescendantDependenciesChanged(component);

  }

  replaceDefiningChildrenBySugar({ component, sugarResults, shadow = false }) {

    let componentsShadowingDeleted = {};

    // delete the string children specified by childrenToDelete
    if (sugarResults.childrenToDelete !== undefined) {
      for (let childName of sugarResults.childrenToDelete) {
        let child = this._components[childName];

        let childAndDescendants = [childName, ...child.allDescendants]

        for (let name of childAndDescendants) {
          if (Object.keys(this.downstreamDependencies[name]).length > 0) {
            this.deleteAllDownstreamDependencies(this._components[name]);
          }
        }

        if (child.shadowedBy) {

          // delete any refTarget upstream depedendencies
          // ignore childstatevariables/identity
          // as those will be recomputed when children are changed
          for (let varName in this.upstreamDependencies[childName]) {
            for (let [ind, upDep] of this.upstreamDependencies[childName][varName].entries()) {
              if (upDep.dependencyType !== "childStateVariables" && upDep.dependencyType !== "childIdentity") {
                if (upDep.dependencyName === "refTargetVariable") {

                  let upstreamComponentName = upDep.upstreamComponentName;
                  if (upDep.downstreamComponentNames && upDep.downstreamComponentNames.length > 1) {
                    // if the dependency depends on other downstream components
                    // just delete component from the array
                    let ind = upDep.downstreamComponentNames.indexOf(componentName);
                    upDep.downstreamComponentNames.splice(ind, 1);
                  } else {
                    delete this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableName][upDep.dependencyName];
                    if (Object.keys(this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableName]).length == 0) {
                      delete this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableName];
                    }
                  }

                  // also delete from child's upstream dependencies
                  this.upstreamDependencies[childName][varName].splice(ind, 1);

                } else {
                  console.warn(`In deleting ${childName} as child of ${component.componentName} via sugar, found an unexpected dependency`)
                }
              }
            }
          }

          componentsShadowingDeleted[childName] = child.shadowedBy;
        }


        // mark all state variables as deleted
        if (this.deletedStateVariables[childName] === undefined) {
          this.deletedStateVariables[childName] = [];
        }
        for (let varName in child.state) {
          this.deletedStateVariables[childName].push(varName);
        }

        for (let cName of childAndDescendants) {

          if (this.unresolvedDependencies[cName]) {
            for (let varName in this.unresolvedDependencies[cName]) {
              for (let unRes of this.unresolvedDependencies[cName][varName]) {
                // delete from this.unresolvedByDependent so don't attempt
                // to try to resolve this state variable later
                if (this.unresolvedByDependent[unRes.componentName]) {
                  let unResBy = this.unresolvedByDependent[unRes.componentName][unRes.stateVariable];
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

          delete this.unresolvedDependencies[cName];
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
      shadow,
    });

    this.parameterStack.pop();

    // insert the replacements in definingChildren
    component.definingChildren.splice(sugarResults.firstDefiningIndex,
      sugarResults.nDefiningIndices, ...childrenResult.components);

    return { createResult: childrenResult, componentsShadowingDeleted }

  }

  applySugarToShadows({ originalComponent, shadowingComponent, changes, componentsShadowingDeleted }) {

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

    let serializedChildren = originalChildren.map(x => x.serialize({ forReference: true }));

    serializedChildren = postProcessRef({
      serializedComponents: serializedChildren,
      componentName: shadowingComponent.shadows.refComponentName
    })

    // go through the defining children of shadowing component
    // if they aren't in shadowChanges.childrenToDelete
    // we should be able to the component they are shadoing in originalChildren
    // so that we can modify serializedChildren to be a createComponent
    // refering to the shadowChild

    for (let shadowingChild of shadowingComponent.definingChildren) {
      if (shadowChanges.childrenToDelete.includes(shadowingChild.componentName)) {
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
      } else {

        shadowChanges.childrenToDelete.push(shadowingChild.componentName)

      }

    }

    shadowChanges.newChildren = serializedChildren;

    let result = this.replaceDefiningChildrenBySugar({
      component: shadowingComponent,
      sugarResults: shadowChanges,
      shadow: true,
    });

    // recurse if shadowingComponent is shadowed
    if (shadowingComponent.shadowedBy) {
      for (let shadowingComponent2 of shadowingComponent.shadowedBy) {
        if (!shadowingComponent2.shadows.propVariable) {
          this.applySugarToShadows(({
            originalComponent: shadowingComponent,
            shadowingComponent: shadowingComponent2,
            changes: shadowChanges,
            componentsShadowingDeleted: result.componentsShadowingDeleted
          }))
        }
      }
    }

    this.deriveChildResultsFromDefiningChildren(shadowingComponent);

    if (!shadowingComponent.childLogicSatisfied) {
      // TODO: handle case where child logic is no longer satisfied
      console.error(`Child logic of ${shadowingComponent.componentName} is not satisfied after applying sugar in shadows`)
    }

    this.markChildAndDescendantDependenciesChanged(shadowingComponent);


    // Because we are changing the children of shadowingComponent
    // out of the normal sequence
    // we need to set up the component dependencies and resolve them,
    // as it is possible they weren't set up do to child logic
    // previously not being satisfied

    this.setUpComponentDependencies({ component: shadowingComponent });

    result = this.resolveStateVariables({ component: shadowingComponent });

    if (Object.keys(result.varsUnresolved).length === 0) {
      delete this.unresolvedDependencies[shadowingComponent.componentName];
    }
    else {
      this.unresolvedDependencies[shadowingComponent.componentName] = {};
      this.addUnresolvedDependencies({
        varsUnresolved: result.varsUnresolved,
        component: shadowingComponent
      });
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
              refTargetName: name,
              refComponentName: dep.refComponentName,
              propVariable: dep.propVariable,
              arrayStateVariable: dep.arrayStateVariable,
              arrayKey: dep.arrayKey,
            }
          } else if (dep.dependencyType === "adapter") {
            redefineDependencies = {
              linkSource: "adapter",
              adapterTargetName: name,
              adapterVariable: dep.adapterVariable
            }
          } else if (dep.dependencyType === "ancestorProp") {
            ancestorProps[dep.property] = name;
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
            componentName: ancestorProps[property],
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

          if (propertyClass.definitionForPropertyValue) {
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

          if (propertyClass.definitionForPropertyValue) {
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
                desiredValue: [desiredStateVariableValues[property]],
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

        // if property class has own definition for property value
        // and default value is not specified for this property
        // then use the definition even if there are no property children
        // Note: since ref specified default=null for all its properties,
        // default will always be used if not property children,
        // allowing ref to check if all properties specified are valid
        let useDefaultIfNoPropertyChild = (
          !propertyClass.definitionForPropertyValue
          || "default" in propertySpecification
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

          if (propertyClass.definitionForPropertyValue) {
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


          if (propertyClass.definitionForPropertyValue) {
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
                desiredValue: [desiredStateVariableValues[property]],
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
      for (let attribute of ["forRenderer", "entryPrefixes"]) {
        if (attribute in propertySpecification) {
          stateVariableDefinitions[property][attribute]
            = propertySpecification[attribute];
        }
      }

    }
  }

  createAdapterStateVariableDefinitions({ redefineDependencies, childLogic, stateVariableDefinitions, componentClass }) {
    let adapterTargetComponent = this._components[redefineDependencies.adapterTargetName];

    // properties depend on adapterTarget (if exist in adapterTarget)
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let componentType = propertySpecification.componentType ? propertySpecification.componentType : property;
      let defaultValue = propertySpecification.default;
      let thisDependencies = {};
      if (property in adapterTargetComponent.state) {
        thisDependencies.adapterTargetVariable = {
          dependencyType: "componentStateVariable",
          componentName: redefineDependencies.adapterTargetName,
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
        componentName: redefineDependencies.adapterTargetName,
        variableName: redefineDependencies.adapterVariable,
      },
    });
    stateDef.definition = function ({ dependencyValues }) {
      return { newValues: { [primaryStateVariableForDefinition]: dependencyValues.adapterTargetVariable } };
    };
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

    let refComponent = this._components[redefineDependencies.refComponentName];
    let refTargetComponent = this._components[redefineDependencies.refTargetName];

    // properties depend first on refComponent (if exists in refComponent),
    // then on refTarget (if exist in refTarget)
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let componentType = propertySpecification.componentType ? propertySpecification.componentType : property;
      let defaultValue = propertySpecification.default;
      let thisDependencies = {};

      if (property in refComponent.state) {
        thisDependencies.refComponentVariable = {
          dependencyType: "componentStateVariable",
          componentName: redefineDependencies.refComponentName,
          variableName: property,
        }
      }
      if (property in refTargetComponent.state) {
        thisDependencies.refTargetVariable = {
          dependencyType: "componentStateVariable",
          componentName: redefineDependencies.refTargetName,
          variableName: property,
        };
      }

      if (property in ancestorProps) {
        thisDependencies.ancestorProp = {
          dependencyType: "componentStateVariable",
          componentName: ancestorProps[property],
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

          if (dependencyValues.refComponentVariable !== undefined && !usedDefault.refComponentVariable) {
            // if value of property was specified on ref component itself
            // then use that property value
            return { newValues: { [property]: dependencyValues.refComponentVariable } };

          } else if (dependencyValues.refTargetVariable !== undefined && !usedDefault.refTargetVariable) {
            // else if ref target has property, use that value
            return { newValues: { [property]: dependencyValues.refTargetVariable } };

          } else if (dependencyValues.ancestorProp !== undefined) {
            // else if have ancestor prop, so use that it wasn't based on default
            if (!usedDefault.ancestorProp) {
              return { newValues: { [property]: dependencyValues.ancestorProp } }
            } else {
              return {
                // if ancestor prop used default, use its value as a fallback
                // if the essential value wasn't given
                useEssentialOrDefaultValue: {
                  [property]: {
                    variablesToCheck: property,
                    defaultValue: dependencyValues.ancestorProp,
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

          if (dependencyValues.refComponentVariable !== undefined && !usedDefault.refComponentVariable) {
            // if value of property was specified on ref component itself
            // then set that value
            return {
              success: true,
              instructions: [{
                setDependency: "refComponentVariable",
                desiredValue: desiredStateVariableValues[property],
              }]
            };

          } else if (dependencyValues.refTargetVariable !== undefined && !usedDefault.refTargetVariable) {
            // else if ref target has property, set that value
            return {
              success: true,
              instructions: [{
                setDependency: "refTargetVariable",
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
      // primaryStateVariableForDefinition is the state variable that the componentClass
      // being created has specified should be given the value when it
      // is created from an outside source like a reference to a prop or an adapter
      let primaryStateVariableForDefinition = "value";
      if (componentClass.primaryStateVariableForDefinition) {
        primaryStateVariableForDefinition = componentClass.primaryStateVariableForDefinition;
      }
      let stateDef = stateVariableDefinitions[primaryStateVariableForDefinition];
      stateDef.returnDependencies = () => ({
        refTargetVariable: {
          dependencyType: "componentStateVariable",
          componentName: redefineDependencies.refTargetName,
          variableName: redefineDependencies.propVariable,
        },
      });
      if (stateDef.set) {
        stateDef.definition = function ({ dependencyValues }) {
          return {
            newValues: {
              [primaryStateVariableForDefinition]: stateDef.set(dependencyValues.refTargetVariable),
            },
            alwaysShadow: [primaryStateVariableForDefinition],
          };
        };
      } else {
        stateDef.definition = function ({ dependencyValues }) {
          return {
            newValues: {
              [primaryStateVariableForDefinition]: dependencyValues.refTargetVariable,
            },
            alwaysShadow: [primaryStateVariableForDefinition],
          };
        };
      }
      stateDef.inverseDefinition = function ({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setDependency: "refTargetVariable",
            desiredValue: desiredStateVariableValues[primaryStateVariableForDefinition],
          }]
        };
      };

      // for referencing a prop variable, don't shadow standard state variables
      // so just return now
      return;

    }

    let foundReadyToExpand = false;
    if ('readyToExpandWhenResolved' in stateVariableDefinitions) {
      // if shadowing a composite
      // make readyToExpandWhenResolved depend on the same variable
      // of the refTarget also being resolved

      foundReadyToExpand = true;

      let stateDef = stateVariableDefinitions.readyToExpandWhenResolved;
      let originalReturnDependencies = stateDef.returnDependencies;

      stateDef.returnDependencies = function (args) {
        let dependencies = originalReturnDependencies(args);
        dependencies.targetReadyToExpandWhenResolved = {
          dependencyType: "componentStateVariable",
          componentName: redefineDependencies.refTargetName,
          variableName: "readyToExpandWhenResolved"
        }
        return dependencies;
      }

    }

    let stateVariablesToShadow = [...refTargetComponent.constructor.stateVariablesShadowedForReference];
    if (!stateVariablesToShadow) {
      stateVariablesToShadow = [];
    }

    let stateVariablesToShadowIfEssential = [];

    // also shadow any essential state variables of refTarget
    // (Must evaluate them first so that they one can determine if essential)
    for (let varName in refTargetComponent.state) {
      let stateObj = refTargetComponent.state[varName];
      if (stateObj.isProperty || varName in stateVariablesToShadow) {
        continue; // aleady are shadowing
      }
      if (stateObj.isResolved) {
        // evaluate so know if it is essential
        stateObj.value;
      }
      if (stateObj.essential || stateObj.alwaysShadow) {
        stateVariablesToShadow.push(varName);
      } else if (!stateObj.isResolved) {
        // TODO: How do we handle this situation?  Create an action state variable?
        console.warn(`*************** don't know if ${varName} of ${refTargetComponent.componentName} is essential and should be shadowed.`)
      }
    }


    let deleteStateVariablesFromDefinition = {};
    for (let varName of stateVariablesToShadow) {
      let stateDef = stateVariableDefinitions[varName];


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
      // Todo: if have additionalStateVariablesDefined
      // how do we remove value of varName from the other state variables?
      delete stateDef.additionalStateVariablesDefined;


      let originalReturnDependencies = stateDef.returnDependencies;

      stateDef.returnDependencies = function (args) {
        let dependencies = {};
        if (foundReadyToExpand) {
          // even though won't use original dependencies
          // if found a readyToExpandWhenResolved
          // keep original dependencies so that readyToExpandWhenResolved
          // won't be resolved until all its dependent variables are resolved
          dependencies = originalReturnDependencies(args);
        }

        if (args.arrayKeys) {
          for (let key of args.arrayKeys) {
            dependencies[key] = {
              dependencyType: "componentStateVariable",
              componentName: redefineDependencies.refTargetName,
              variableName: this.arrayVarNameFromArrayKey(key),
            }
          }
        } else {
          dependencies.refTargetVariable = {
            dependencyType: "componentStateVariable",
            componentName: redefineDependencies.refTargetName,
            variableName: varName,
          };
        }
        return dependencies;
      };
      stateDef.definition = function ({ dependencyValues }) {
        if ("refTargetVariable" in dependencyValues) {
          return {
            newValues: { [varName]: dependencyValues.refTargetVariable },
            alwaysShadow: [varName]
          };
        } else {
          return {
            newValues: { [varName]: dependencyValues },
            alwaysShadow: [varName]
          };
        }

      };
      stateDef.inverseDefinition = function ({ desiredStateVariableValues, dependencyValues }) {

        if ("refTargetVariable" in dependencyValues) {
          return {
            success: true,
            instructions: [{
              setDependency: "refTargetVariable",
              desiredValue: desiredStateVariableValues[varName],
            }]
          };
        } else {
          let instructions = [];
          for (let key in dependencyValues) {
            instructions.push({
              setDependency: key,
              desiredValue: desiredStateVariableValues[varName][key]
            })
          }
          return {
            success: true,
            instructions
          }
        }
      };
    }


    for (let varName in deleteStateVariablesFromDefinition) {
      let varNamesToDelete = deleteStateVariablesFromDefinition[varName];
      let stateDef = stateVariableDefinitions[varName];

      // delete variables from additionalStateVariablesDefined
      for (let varName2 of varNamesToDelete) {
        let ind = stateDef.additionalStateVariablesDefined.indexOf(varName2);
        stateDef.additionalStateVariablesDefined.splice(ind, 1);
      }

      // remove variables from definition
      let originalDefinition = stateDef.definition;

      stateDef.definition = function (args) {
        let results = originalDefinition(args);

        if (results.useEssentialOrDefaultValue) {
          for (let varName2 of varNamesToDelete) {
            delete results.useEssentialOrDefaultValue[varName2];
          }
        }
        if (results.newValues) {
          for (let varName2 of varNamesToDelete) {
            delete results.newValues[varName2];
          }
        }
        if (results.noChanges) {
          for (let varName2 of varNamesToDelete) {
            let ind = results.noChanges.indexOf(varName2);
            if (ind !== -1) {
              results.noChanges.splice(ind, 1);
            }
          }
        }
        if (results.makeEssential) {
          for (let varName2 of varNamesToDelete) {
            let ind = results.makeEssential.indexOf(varName2);
            if (ind !== -1) {
              results.makeEssential.splice(ind, 1);
            }
          }
        }

        if (results.alwaysShadow) {
          for (let varName2 of varNamesToDelete) {
            let ind = results.alwaysShadow.indexOf(varName2);
            if (ind !== -1) {
              results.alwaysShadow.splice(ind, 1);
            }
          }
        }

        if (results.setComponentType) {
          if (results.setComponentType) {
            for (let varName2 of varNamesToDelete) {
              delete results.setComponentType[varName2];
            }
          }
        }
        return results;
      }

    }

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

  applySugarOrAddSugarCreationStateVariables({ component }) {

    let childLogic = component.childLogic;
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
        let childLogicAffected = [...childLogicComponent.affectedBySugar];
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
        let childLogicWaiting = this.childLogicWaitingOnSugar[component.componentName];
        if (childLogicWaiting === undefined) {
          childLogicWaiting = this.childLogicWaitingOnSugar[component.componentName] = {};
        }
        for (let affectedName of childLogicAffected) {
          if (childLogicWaiting[affectedName] === undefined) {
            childLogicWaiting[affectedName] = [];
          }
          childLogicWaiting[affectedName].push(applySugarStateVariable);
        }

        // create an action state variable that will run when the sugar
        // dependencies are satisfied to:
        // - apply sugar
        // - delete any dependencies of this sugar state variable
        //   (that might be later added based on childLogicWaitingOnSugar)
        //   so that these other state variables can now be resolved
        // - delete this action state variable from any childLogicWaitingOnSugar
        // - delete the actual action state variable

        component.state[applySugarStateVariable] = {
          isAction: true,
          returnDependencies: childLogicComponent.returnSugarDependencies,
          action: function ({ dependencyValues }) {

            core.replaceChildrenBySugar({
              component,
              childLogicName,
              dependencyValues,
            });

            core.deleteAllUpstreamDependencies(component, [applySugarStateVariable]);
            core.deleteAllDownstreamDependencies(component, [applySugarStateVariable]);

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

            return { varsDeleted: [applySugarStateVariable] };

          }
        }

        this.initializeStateVariable({ component, stateVariable: applySugarStateVariable });

      } else {


        this.replaceChildrenBySugar({
          component,
          childLogicName
        });

      }

    }
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

  initializeStateVariable({ component, stateVariable, arrayKeys, arrayStateVariable }) {
    let getStateVar = this.getStateVariableValue;
    if (!component.state[stateVariable]) {
      component.state[stateVariable] = {};
    }
    let stateVarObj = component.state[stateVariable];
    stateVarObj.isResolved = false;
    Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable }), configurable: true });

    if (arrayKeys !== undefined) {
      this.initializeArrayEntryStateVariable({ stateVarObj, arrayStateVariable, arrayKeys, component, stateVariable });
    } else if (stateVarObj.isArray) {
      this.initializeArrayStateVariable({ stateVarObj, component, stateVariable });
    }

  }

  initializeArrayEntryStateVariable({ stateVarObj, arrayStateVariable, arrayKeys, component, stateVariable }) {
    // This function used for initializing array entry variables
    // (not the original array variable)
    // It adds many attributes to state variables corresponding to 
    // array entries, including
    // - arrayStateVariable: the name of the array for which this is an entry
    // - arrayKeys: an array of the key(s) that constitute this entry
    // - markStale: function from array state variable
    // - getValueFromArrayValues: function used to get this entry's value

    stateVarObj.isArrayEntry = true;
    stateVarObj.arrayKeys = arrayKeys;

    stateVarObj.arrayStateVariable = arrayStateVariable;
    let arrayStateVarObj = component.state[arrayStateVariable];
    stateVarObj.markStale = arrayStateVarObj.markStale;

    // add this entry name to the array's list of its entries
    if (!arrayStateVarObj.arrayEntryNames) {
      arrayStateVarObj.arrayEntryNames = [];
    }
    arrayStateVarObj.arrayEntryNames.push(stateVariable);

    // Each arrayEntry state variable will have a funciton getValueFromArrayValue
    // that will be used to retrieve the actual value of the components
    // specified by this entry from the whole array stored in arrayValues
    // Note: getValueFromArrayValues assumes that arrayValues has been populated
    if (arrayStateVarObj.getEntryValues) {
      // the function getEntryValues must have been overwritten by the class
      // so use this function instead
      stateVarObj.getValueFromArrayValues = function () {//({ overridesByKey } = {}) {
        return arrayStateVarObj.getEntryValues({
          varName: stateVariable,
          // overridesByKey
        });
      };
    }
    else {
      // getValueFromArrayValues returns an array of the values
      // that correspond to the arrayKeys of this entry state variable
      // (returning a scalar instead if it is just a single value)
      // It uses the function getArrayValue, which gets the values
      // from arrayValues of the corresponding array state variable
      // Any values in overridesByKey are used instead of values
      // from the array state variable
      stateVarObj.getValueFromArrayValues = function () {//({ overridesByKey } = {}) {
        let value = [];
        for (let arrayKey of stateVarObj.arrayKeys) {
          // if (overridesByKey && arrayKey in overridesByKey) {
          //   value.push(overridesByKey[arrayKey]);
          // }
          // else {
          value.push(arrayStateVarObj.getArrayValue({ arrayKey }));
          // }
        }
        if (value.length === 1) {
          return value[0];
        }
        else {
          return value;
        }
      };
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
    //   freshnessInfo is prepopulated with a freshByKey object for tracking by key
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
    // - allVarNamesThatIncludeArrayKey: returns an array of the variable names
    //   of all array entries that contain a given array key

    stateVarObj.arrayValues = [];
    stateVarObj.freshnessInfo = { freshByKey: {} };

    if (stateVarObj.nDimensions > 1) {
      // for multiple dimensions, have to convert from arrayKey
      // to multi-index when getting or setting
      stateVarObj.keyToIndex = key => key.split(',').map(x => Number(x));
      stateVarObj.setArrayValue = function ({ value, arrayKey }) {
        let index = stateVarObj.keyToIndex(arrayKey);
        let aVals = stateVarObj.arrayValues;
        for (let indComponent of index.slice(0, index.length - 1)) {
          aVals = aVals[indComponent];
        }
        aVals[index[index.length - 1]] = value;
      };
      stateVarObj.getArrayValue = function ({ arrayKey }) {
        let index = stateVarObj.keyToIndex(arrayKey);
        let aVals = stateVarObj.arrayValues;
        for (let indComponent of index.slice(0, index.length - 1)) {
          aVals = aVals[indComponent];
        }
        return aVals[index[index.length - 1]];
      };
    }
    else {
      // for a single dimension, can just use arrayKey directly
      // since it is just the string version of the index
      stateVarObj.keyToIndex = key => Number(key);
      stateVarObj.setArrayValue = function ({ value, arrayKey }) {
        stateVarObj.arrayValues[arrayKey] = value;
      };
      stateVarObj.getArrayValue = function ({ arrayKey }) {
        return stateVarObj.arrayValues[arrayKey];
      };
    }

    // converting from index to key is the same for single and multiple
    // dimensions, as we just want the string representation
    stateVarObj.indexToKey = index => String(index);

    if (!stateVarObj.getArrayKeysFromVarName) {
      // the default function for getArrayKeysFromVarName ignores the
      // array entry prefix, but is just based on the variable ending.
      // A component class's function could use arrayEntryPrefix
      stateVarObj.getArrayKeysFromVarName = function ({ arrayEntryPrefix, varEnding }) {
        let num = Number(varEnding);
        if (Number.isInteger(num)) {
          return [String(num - 1)];
        } else {
          return;
        }
      };
    }

    let entryPrefixes = stateVarObj.entryPrefixes;

    if (!entryPrefixes) {
      entryPrefixes = [stateVariable]
    }

    if (!stateVarObj.arrayVarNameFromArrayKey) {
      stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
        return entryPrefixes[0] + String(Number(arrayKey) + 1);
      };
    }
    if (!stateVarObj.allVarNamesThatIncludeArrayKey) {
      stateVarObj.allVarNamesThatIncludeArrayKey = function (arrayKey) {
        return [entryPrefixes[0] + String(Number(arrayKey) + 1)];
      };
    }
    if (!component.arrayEntryPrefixes) {
      component.arrayEntryPrefixes = {};
    }
    for (let prefix of entryPrefixes) {
      component.arrayEntryPrefixes[prefix] = stateVariable;
    }

    // for array, keep track if each arrayKey is essential
    stateVarObj.essentialByArrayKey = {};

  }

  setUpComponentDependencies({ component }) {

    // if component already has downstream dependencies
    // delete them, and the corresponding upstream dependencies
    if (this.downstreamDependencies[component.componentName]) {
      this.deleteAllDownstreamDependencies(component);
    }

    // console.log(`set up component dependencies of ${component.componentName}`)
    this.downstreamDependencies[component.componentName] = {};
    if (!this.upstreamDependencies[component.componentName]) {
      this.upstreamDependencies[component.componentName] = {};
    }

    let stateVariablesToProccess = [];
    for (let stateVariable in component.state) {
      if (!(component.state[stateVariable].isArrayEntry || component.state[stateVariable].isAlias)) {
        // TODO: if do indeed keep aliases deleted from state, then don't need second check
        stateVariablesToProccess.push(stateVariable);
      }
    }

    for (let stateVariable of stateVariablesToProccess) {
      let stateVarObj = component.state[stateVariable];

      let dependencies;

      if (stateVarObj.stateVariablesDeterminingDependencies) {
        let dependencyStateVar = this.createDetermineDependenciesStateVariable({
          stateVariable, component,
        });

        // make dependencies of actual stateVariable be this
        // temporary state variable we just created
        dependencies = {
          [dependencyStateVar]: {
            dependencyType: "componentStateVariable",
            componentName: component.componentName,
            variableName: dependencyStateVar,
          }
        }

      } else {
        dependencies = stateVarObj.returnDependencies({
          componentInfoObjects: this.componentInfoObjects,
          sharedParameters: component.sharedParameters,
        });
      }

      this.setUpStateVariableDependencies({ dependencies, component, stateVariable });
      if (stateVarObj.isArray) {
        let dependencyOverride;
        if (stateVarObj.stateVariablesDeterminingDependencies) {
          dependencyOverride = dependencies;
        }
        this.setUpDependenciesOfArrayEntries({ component, stateVariable, dependencyOverride });
      }
    }

    if (component.aliasesToCopyDependencies) {
      for (let stateVariable in component.aliasesToCopyDependencies) {
        this.downstreamDependencies[component.componentName][stateVariable]
          = this.downstreamDependencies[component.componentName][component.aliasesToCopyDependencies[stateVariable]];
        this.upstreamDependencies[component.componentName][stateVariable]
          = this.upstreamDependencies[component.componentName][component.aliasesToCopyDependencies[stateVariable]];
      }
      delete component.aliasesToCopyDependencies;
    }

  }

  setUpDependenciesOfArrayEntries({ component, dependencyOverride, stateVariable, stateValues }) {
    let stateVarObj = component.state[stateVariable];

    let setUpArrayEntryDependencies = function (varName) {

      let dependencies = dependencyOverride;
      if (!dependencies) {
        let arrayKeys = component.state[varName].arrayKeys;
        dependencies = stateVarObj.returnDependencies({
          arrayKeys,
          componentInfoObjects: this.componentInfoObjects,
          sharedParameters: component.sharedParameters,
          stateValues
        })
      }
      this.setUpStateVariableDependencies({ dependencies, component, stateVariable: varName });
    }.bind(this);
    if (!component.state[stateVariable]) {
      component.state[stateVariable] = {};
    }
    component.state[stateVariable].setUpArrayEntryDependencies = setUpArrayEntryDependencies;
    if (component.state[stateVariable].arrayEntryNames) {
      // array entries are already created, set them up now
      for (let arrayEntryStateVariable of component.state[stateVariable].arrayEntryNames) {
        component.state[stateVariable].setUpArrayEntryDependencies(arrayEntryStateVariable);
      }
    }
  }

  deleteAllDownstreamDependencies(component, stateVariables = '__all__') {

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
        let dep = downDeps[downDepName];
        let downstreamComponentNames = [];
        let downstreamVariableNames = [];
        if (dep.downstreamComponentNames) {
          downstreamComponentNames = dep.downstreamComponentNames;
          if (dep.downstreamVariableNames) {
            downstreamVariableNames = dep.downstreamVariableNames;
          }
          else {
            downstreamVariableNames = ['__identity'];
          }
        }
        else if (dep.downstreamComponentName) {
          downstreamComponentNames = [dep.downstreamComponentName];
          if (dep.downstreamVariableName) {
            downstreamVariableNames = [dep.downstreamVariableName];
          }
          else {
            downstreamVariableNames = ['__identity'];
          }
        }

        for (let cName of downstreamComponentNames) {
          for (let vName of downstreamVariableNames) {
            let upDeps = this.upstreamDependencies[cName][vName];
            if (upDeps) {
              let ind = upDeps.indexOf(dep);

              // if find an upstream dependency, delete
              if (ind !== -1) {
                if (upDeps.length === 1) {
                  delete this.upstreamDependencies[cName][vName];
                } else {
                  upDeps.splice(ind, 1);
                }
              }
            }
          }
        }
      }

      delete this.downstreamDependencies[componentName][stateVariable];

    }

    if (Object.keys(this.downstreamDependencies[componentName]).length === 0) {
      delete this.downstreamDependencies[componentName];
    }
  }

  deleteAllUpstreamDependencies(component, stateVariables = '__all__') {

    let componentsTouched = [];

    let componentName = component.componentName;

    let stateVariablesToAdddress;
    if (stateVariables === '__all__') {
      stateVariablesToAdddress = Object.keys(this.upstreamDependencies[componentName]);
    } else {
      stateVariablesToAdddress = stateVariables;
    }

    for (let stateVariable of stateVariablesToAdddress) {
      if (this.upstreamDependencies[componentName][stateVariable]) {
        for (let upDep of this.upstreamDependencies[componentName][stateVariable]) {
          let upstreamComponentName = upDep.upstreamComponentName;
          if (upDep.downstreamComponentNames && upDep.downstreamComponentNames.length > 1) {
            // if the dependency depends on other downstream components
            // just delete component from the array
            let ind = upDep.downstreamComponentNames.indexOf(componentName);
            upDep.downstreamComponentNames.splice(ind, 1);
          } else {
            delete this.downstreamDependencies[upstreamComponentName][upDep.upstreamVariableName][upDep.dependencyName];
          }
          let additionalComponentsTouched = this.markStateVariableAndUpstreamDependentsStale({
            component: this._components[upstreamComponentName],
            varName: upDep.upstreamVariableName
          })
          componentsTouched.push(...additionalComponentsTouched);

        }
      }
      delete this.upstreamDependencies[componentName][stateVariable];
    }

    if (Object.keys(this.upstreamDependencies[componentName]).length === 0) {
      delete this.upstreamDependencies[componentName];
    }

    return componentsTouched;
  }

  setUpStateVariableDependencies({ dependencies, component, stateVariable }) {

    let thisUpstream = this.upstreamDependencies[component.componentName];
    let thisDownstream = this.downstreamDependencies[component.componentName];

    let stateVariableDependencies = {};

    for (let depName in dependencies) {
      let dep = dependencies[depName];
      let newDep = {
        dependencyName: depName,
        dependencyType: dep.dependencyType,
        upstreamComponentName: component.componentName,
        upstreamVariableName: stateVariable,
      };
      if (dep.doNotProxy) {
        newDep.doNotProxy = true;
      }

      if (dep.dependencyType === "childStateVariables" || dep.dependencyType === "childIdentity") {
        let activeChildrenIndices = component.childLogic.returnMatches(dep.childLogicName);
        if (activeChildrenIndices === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: childLogicName ${dep.childLogicName} does not exist.`);
        }

        // if childIndices specified, filter out just those indices
        // Note: indices are relative to the selected ones
        // (not actual index in activeChildren)
        // so filter uses the i argument, not the x argument
        if (dep.childIndices !== undefined) {
          activeChildrenIndices = activeChildrenIndices
            .filter((x, i) => dep.childIndices.includes(i));
        }

        let varNames;
        let requestStateVariables = false;
        if (dep.dependencyType === "childStateVariables") {
          requestStateVariables = true;

          if (!Array.isArray(dep.variableNames)) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableNames must be an array`)
          }
          varNames = newDep.downstreamVariableNames = dep.variableNames;
          if (dep.variablesOptional) {
            newDep.variablesOptional = true;
          }
        } else {
          varNames = ['__identity'];
        }

        newDep.componentIdentitiesChanged = true;
        if (activeChildrenIndices.length === 0) {
          newDep.downstreamComponentNames = [];
        }
        else {
          let children = [];
          let valuesChanged = [];
          for (let childIndex of activeChildrenIndices) {
            let childName = component.activeChildren[childIndex].componentName;
            children.push(childName);

            if (requestStateVariables) {
              let valsChanged = {}
              for (let vName of dep.variableNames) {
                valsChanged[vName] = { changed: true }
              }
              valuesChanged.push(valsChanged);
            }

          }
          newDep.downstreamComponentNames = children;
          if (requestStateVariables) {
            newDep.valuesChanged = valuesChanged;
          }

          if (dep.markChildrenAsProperties) {
            for (let childIndex of activeChildrenIndices) {
              component.activeChildren[childIndex].componentIsAProperty = true;
            }
          }

          for (let childName of children) {
            let childUp = this.upstreamDependencies[childName];
            if (!childUp) {
              childUp = this.upstreamDependencies[childName] = {};
            }
            // varNames is ['__identity'] if child identity
            let childVarNames = varNames;
            if (dep.variablesOptional && dep.dependencyType === "childStateVariables") {
              childVarNames = [];
              for (let varName of varNames) {
                if (varName in this._components[childName].state ||
                  this.checkIfAliasOrArrayEntry({
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
          this.childLogicWaitingOnSugar[component.componentName][dep.childLogicName]) {

          // have state variables in component corresponding to the child logic
          // with unresolved sugar
          // so make a dependency to those sugar state variables
          // This will prevent the current state variable from being resolved until
          // after the sugar is applied

          for (let childLogicStateVariable of this.childLogicWaitingOnSugar[component.componentName][dep.childLogicName]) {
            let childLogicDependency = {
              dependencyName: `_${depName}_childLogic`,
              dependencyType: 'stateVariable',
              upstreamComponentName: component.componentName,
              upstreamVariableName: stateVariable,
              downstreamComponentName: component.componentName,
              downstreamVariableName: childLogicStateVariable,
              valuesChanged: { [childLogicStateVariable]: { changed: true } },
            };

            stateVariableDependencies[childLogicDependency.dependencyName] = childLogicDependency;
            if (thisUpstream[childLogicStateVariable] === undefined) {
              thisUpstream[childLogicStateVariable] = [];
            }
            thisUpstream[childLogicStateVariable].push(childLogicDependency);
          }
        }

      }
      else if (["descendantStateVariables", "descendantIdentity", "componentDescendantStateVariables", "componentDescendantIdentity"].includes(dep.dependencyType)) {

        let ancestor = component;
        if (["componentDescendantStateVariables", "componentDescendantIdentity"].includes(dep.dependencyType)) {
          ancestor = this.components[dep.ancestorName];

          // now treat the same regardless of ancestor determined
          if (dep.dependencyType === "componentDescendantStateVariables") {
            newDep.dependencyType = "descendantStateVariables";
          } else {
            newDep.dependencyType = "descendantIdentity";
          }
        }

        newDep.ancestorName = ancestor.componentName;

        if (!this.descendantDependenciesByAncestor[ancestor.componentName]) {
          this.descendantDependenciesByAncestor[ancestor.componentName] = [];
        }
        this.descendantDependenciesByAncestor[ancestor.componentName].push({
          componentName: component.componentName,
          stateVariable,
          depName,
        });

        let descendants = gatherDescendants({
          ancestor,
          descendantClasses: dep.componentTypes.map(x => this.allComponentClasses[x]),
          recurseToMatchedChildren: dep.recurseToMatchedChildren,
          useReplacementsForComposites: dep.useReplacementsForComposites,
          includeNonActiveChildren: dep.includeNonActiveChildren,
          includePropertyChildren: dep.includePropertyChildren,
          compositeClass: this.allComponentClasses._composite,
        });

        newDep.componentTypes = dep.componentTypes;
        newDep.recurseToMatchedChildren = dep.recurseToMatchedChildren;
        newDep.useReplacementsForComposites = dep.useReplacementsForComposites;
        newDep.includeNonActiveChildren = dep.includeNonActiveChildren;
        newDep.includePropertyChildren = dep.includePropertyChildren;

        let requestStateVariables = newDep.dependencyType === "descendantStateVariables";

        let varNames;
        if (requestStateVariables) {
          if (!Array.isArray(dep.variableNames)) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableNames must be an array`)
          }
          varNames = newDep.downstreamVariableNames = dep.variableNames;
          if (dep.variablesOptional) {
            newDep.variablesOptional = true;
          }
        } else {
          varNames = ['__identity'];
        }

        newDep.componentIdentitiesChanged = true;
        newDep.downstreamComponentNames = descendants;
        if (requestStateVariables) {
          newDep.valuesChanged = [];
          let valsChanged = {}
          for (let vName of dep.variableNames) {
            valsChanged[vName] = { changed: true }
          }
          newDep.valuesChanged = descendants.map(() => valsChanged);
        }

        for (let descendantName of descendants) {
          let descendantUp = this.upstreamDependencies[descendantName];
          if (!descendantUp) {
            descendantUp = this.upstreamDependencies[descendantName] = {};
          }
          // varNames is ['__identity'] if identity
          let descendantVarNames = varNames;
          if (dep.variablesOptional && requestStateVariables) {
            descendantVarNames = [];
            for (let varName of varNames) {
              if (varName in this._components[descendantName].state ||
                this.checkIfAliasOrArrayEntry({
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

      }
      else if (dep.dependencyType === "stateVariable") {
        newDep.downstreamComponentName = component.componentName;
        if (dep.variableName === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
        }
        newDep.downstreamVariableName = dep.variableName;
        newDep.valuesChanged = { [dep.variableName]: { changed: true } };
        if (thisUpstream[dep.variableName] === undefined) {
          thisUpstream[dep.variableName] = [];
        }
        thisUpstream[dep.variableName].push(newDep);
      }
      else if (dep.dependencyType === "recursiveDependencyValues") {
        newDep.downstreamComponentName = component.componentName;
        if (dep.variableName === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
        }
        newDep.downstreamVariableName = dep.variableName;
        newDep.changedValuesOnly = dep.changedValuesOnly;
        newDep.valuesChanged = { [dep.variableName]: { changed: true } };

        if (thisUpstream[dep.variableName] === undefined) {
          thisUpstream[dep.variableName] = [];
        }
        thisUpstream[dep.variableName].push(newDep);
      }
      else if (dep.dependencyType === "componentStateVariable" ||
        dep.dependencyType === "componentStateVariableComponentType"
      ) {
        newDep.downstreamComponentName = dep.componentName;
        if (dep.variableName === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
        }
        newDep.downstreamVariableName = dep.variableName;
        newDep.valuesChanged = { [dep.variableName]: { changed: true } };

        let depUp = this.upstreamDependencies[dep.componentName];
        if (!depUp) {
          depUp = this.upstreamDependencies[dep.componentName] = {};
        }
        if (depUp[dep.variableName] === undefined) {
          depUp[dep.variableName] = [];
        }
        depUp[dep.variableName].push(newDep);
      }
      else if (dep.dependencyType === "parentStateVariable") {
        if (!component.parentName) {
          throw Error(`cannot have state variable ${stateVariable} of ${component.componentName} depend on parentStateVariables when parent isn't defined.`);
        }
        newDep.downstreamComponentName = component.parentName;
        if (dep.variableName === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
        }
        newDep.downstreamVariableName = dep.variableName;
        newDep.valuesChanged = { [dep.variableName]: { changed: true } };
        let depUp = this.upstreamDependencies[component.parentName];
        if (!depUp) {
          depUp = this.upstreamDependencies[component.parentName] = {};
        }
        if (depUp[dep.variableName] === undefined) {
          depUp[dep.variableName] = [];
        }
        depUp[dep.variableName].push(newDep);
      }
      else if (dep.dependencyType === "ancestorStateVariables" || dep.dependencyType === "ancestorIdentity") {

        newDep.descendant = component.componentName;

        if (!this.ancestorDependenciesByDescendant[component.componentName]) {
          this.ancestorDependenciesByDescendant[component.componentName] = [];
        }

        this.ancestorDependenciesByDescendant[component.componentName].push({
          componentName: component.componentName,
          stateVariable,
          depName,
        });


        let requestStateVariables = newDep.dependencyType === "ancestorStateVariables";

        let varNames;
        if (requestStateVariables) {
          if (!Array.isArray(dep.variableNames)) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableNames must be an array`)
          }
          varNames = newDep.downstreamVariableNames = dep.variableNames;
        } else {
          varNames = ['__identity'];
        }

        let foundAncestorName;

        if (dep.componentType) {
          newDep.componentType = dep.componentType;

          let ancestorsSearchClass = this.allComponentClasses[dep.componentType];

          for (let ancestor of component.ancestors) {
            if (ancestor.componentClass === ancestorsSearchClass ||
              ancestorsSearchClass.isPrototypeOf(ancestor.componentClass)
            ) {
              foundAncestorName = ancestor.componentName;
              break;
            }
          }
        } else {

          if (!requestStateVariables) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: must have componentType for ancestor identity`)
          }

          // the state variable definition did not prescribe the component type
          // of the ancestor, but it did give the variableNames to match
          // Search all the state variables of the ancestors to find one
          // that has all the requisite state variables
          for (let ancestor of component.ancestors) {

            let stateVarInfo = ancestor.componentClass.returnStateVariableInfo({
              standardComponentClasses: this.standardComponentClasses,
              allPossibleProperties: this.allPossibleProperties,
            });

            let foundAllVarNames = true;
            for (let vName of varNames) {
              if (!(
                vName in stateVarInfo.stateVariableDescriptions ||
                vName in stateVarInfo.aliases
              )) {
                let foundPrefix = false;
                for (let prefix in stateVarInfo.arrayEntryPrefixes) {
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
              foundAncestorName = ancestor.componentName;
              break;
            }
          }

        }


        newDep.componentIdentityChanged = true;
        if (requestStateVariables) {
          let valsChanged = {}
          for (let vName of dep.variableNames) {
            valsChanged[vName] = { changed: true }
          }
          newDep.valuesChanged = valsChanged;
        }

        if (foundAncestorName) {
          newDep.downstreamComponentName = foundAncestorName;

          let depUp = this.upstreamDependencies[foundAncestorName];
          if (!depUp) {
            depUp = this.upstreamDependencies[foundAncestorName] = {};
          }
          // varNames is ['__identity'] if identity
          for (let varName of varNames) {
            if (depUp[varName] === undefined) {
              depUp[varName] = [];
            }
            depUp[varName].push(newDep);
          }
        } else {
          newDep.downstreamComponentName = null;
        }
      }
      else if (dep.dependencyType === "componentIdentity") {

        newDep.downstreamComponentName = dep.componentName;
        newDep.componentIdentityChanged = true;

        // for identity
        // it just depends on identity of downstream component

        let depUp = this.upstreamDependencies[dep.componentName];
        if (!depUp) {
          depUp = this.upstreamDependencies[dep.componentName] = {};
        }
        if (depUp['__identity'] === undefined) {
          depUp['__identity'] = [];
        }
        depUp['__identity'].push(newDep);
      }
      else if (dep.dependencyType == "doenetAttribute") {
        newDep.attributeName = dep.attributeName;
      }
      else if (dep.dependencyType === "flag") {
        newDep.flagName = dep.flagName;
      }
      else if (dep.dependencyType === "value") {
        newDep.value = dep.value;
      }
      else if (dep.dependencyType === "potentialEssentialVariable") {
        newDep.variableName = dep.variableName;
      }
      else if (dep.dependencyType !== "serializedChildren"
        && dep.dependencyType !== "variants"
      ) {
        throw Error(`Unrecognized dependency type ${dep.dependencyType}`);
      }
      stateVariableDependencies[depName] = newDep;
    }

    if (Object.keys(stateVariableDependencies).length > 0) {
      thisDownstream[stateVariable] = stateVariableDependencies;
      this.checkForCircularDependency({ componentName: component.componentName, varName: stateVariable });

    }
  }

  createDetermineDependenciesStateVariable({
    stateVariable, component,
  }) {

    let stateVariablesDeterminingDependencies = component.state[stateVariable].stateVariablesDeterminingDependencies;
    let additionalStateVariablesDefined = component.state[stateVariable].additionalStateVariablesDefined;

    let dependencyStateVar = `__determine_dependencies_${stateVariable}`;

    let core = this;

    component.state[dependencyStateVar] = {
      isAction: true,
      dependenciesForStateVariable: stateVariable,
      additionalStateVariablesAffected: additionalStateVariablesDefined,
      returnDependencies: function () {
        let theseDependencies = {};
        for (let varName of stateVariablesDeterminingDependencies) {
          theseDependencies[varName] = {
            dependencyType: "componentStateVariable",
            componentName: component.componentName,
            variableName: varName
          };
        }
        return theseDependencies;
      },
      action({ dependencyValues }) {

        let stateVarObj = component.state[dependencyStateVar];

        let stateVariablesToCreateDependencies = [stateVarObj.dependenciesForStateVariable];
        let stateVariablesToDelete = [dependencyStateVar];

        if (stateVarObj.additionalStateVariablesAffected) {
          for (let varName of stateVarObj.additionalStateVariablesAffected) {
            stateVariablesToCreateDependencies.push(varName);
            stateVariablesToDelete.push(`__determine_dependencies_${varName}`)
          }
        }

        core.deleteAllUpstreamDependencies(component, stateVariablesToDelete);
        core.deleteAllDownstreamDependencies(component, stateVariablesToDelete);

        if (core.deletedStateVariables[component.componentName] === undefined) {
          core.deletedStateVariables[component.componentName] = [];
        }
        for (let varName of stateVariablesToDelete) {
          // delete state variable itself
          delete component.state[varName];
          core.deletedStateVariables[component.componentName].push(varName);
        }

        // now, can finally run returnDependencies of the state variable (and other affected)

        for (let varName of stateVariablesToCreateDependencies) {

          let changedStateVarObj = component.state[varName];

          // Note: shouldn't have to delete any downstream dependencies
          // of changedStateVarObj
          // as they should have been deleted when deleting above dependencies


          let newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
          });

          core.setUpStateVariableDependencies({
            dependencies: newDependencies,
            component,
            stateVariable: varName,
          });

          if (changedStateVarObj.isArray) {
            core.setUpDependenciesOfArrayEntries({
              component,
              stateValues: dependencyValues,
              stateVariable: varName
            });
          }
        }

        return { varsDeleted: stateVariablesToDelete };
      }
    };

    // create and set up dependencies for this temporary state variable
    // i.e., repeat the process for creating a state variable here
    this.initializeStateVariable({ component, stateVariable: dependencyStateVar });
    // note: don't need to pass arguments to returnDependencies
    // since are calling above returnDependencies that doesn't take arguments
    let theseDependencies = component.state[dependencyStateVar].returnDependencies();
    this.setUpStateVariableDependencies({
      dependencies: theseDependencies,
      component,
      stateVariable: dependencyStateVar,
    });

    return dependencyStateVar;
  }

  getStateVariableValue({ component, stateVariable }) {

    let stateVarObj = component.state[stateVariable];

    if (!(stateVarObj && stateVarObj.isResolved)) {
      throw Error(`Can't get value of ${stateVariable} of ${component.componentName} as it doesn't exist or is not resolved.`);
    }

    let definitionArgs = this.getStateVariableDependencyValues({ component, stateVariable });
    definitionArgs.componentInfoObjects = this.componentInfoObjects;
    definitionArgs.freshnessInfo = stateVarObj.freshnessInfo;

    let definitionFunction = stateVarObj.definition;

    let additionalStateVariablesDefined = stateVarObj.additionalStateVariablesDefined;

    if (stateVarObj.isArrayEntry) {
      definitionArgs.arrayKeys = stateVarObj.arrayKeys;
      let arrayStateVariable = stateVarObj.arrayStateVariable;
      let arrayStateVarObj = component.state[arrayStateVariable];
      additionalStateVariablesDefined = arrayStateVarObj.additionalStateVariablesDefined;
      definitionArgs.freshnessInfo = arrayStateVarObj.freshnessInfo;
      definitionFunction = arrayStateVarObj.definition;
    }

    let result;

    if (Object.keys(definitionArgs.changes).length === 0 &&
      stateVarObj._previousValue !== undefined
    ) {
      let noChanges = [stateVariable];
      if (additionalStateVariablesDefined) {
        noChanges.push(...additionalStateVariablesDefined)
      }
      // console.log(`no changes for ${stateVariable}`);
      // console.log(noChanges)
      result = { noChanges };
    } else {
      result = definitionFunction(definitionArgs);
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

    for (let varName in result.useEssentialOrDefaultValue) {
      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} requested essential or default value of ${varName}, which isn't a state variable.`);
      }

      if (!component.state[varName].isResolved) {
        throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
      }

      if (!(varName in receivedValue)) {
        let foundMatchingArrayEntry = false;
        if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
          for (let arrayEntryName of component.state[varName].arrayEntryNames) {
            if (arrayEntryName in receivedValue) {
              foundMatchingArrayEntry = true;
              receivedValue[arrayEntryName] = true;
              break;
            }
          }
        }
        if (!foundMatchingArrayEntry) {
          throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      } else {
        receivedValue[varName] = true;
      }


      // first determine if can get value from essential state
      let { haveEssentialValue, valueUnchanged, byArrayEntries } = this.setValueToEssential({
        component, varName,
        useEssentialInfo: result.useEssentialOrDefaultValue[varName]
      });

      if (byArrayEntries) {

        for (let arrayKey in result.useEssentialOrDefaultValue[varName]) {
          if (!haveEssentialValue[arrayKey]) {
            if ("defaultEntryValue" in result.useEssentialOrDefaultValue[varName]) {
              component.state[varName].setArrayValue({
                value: result.useEssentialOrDefaultValue[varName].defaultEntryValue,
                arrayKey,
              });
              component.state[varName].essentialByArrayKey[arrayKey] = true;
            } else if ("defaultEntryValue" in component.state[varName]) {
              component.state[varName].setArrayValue({
                value: component.state[varName].defaultEntryValue,
                arrayKey,
              });
              component.state[varName].essentialByArrayKey[arrayKey] = true;
            }
          }
          if (!valueUnchanged[arrayKey]) {
            if (valuesChanged[varName] == undefined) {
              valuesChanged[varName] = {}
            }
            valuesChanged[varName][arrayKey] = true;
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


    for (let varName in result.newValues) {
      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} returned value of ${varName}, which isn't a state variable.`);
      }

      if (!component.state[varName].isResolved) {
        throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
      }

      if (!(varName in receivedValue)) {
        let foundMatchingArrayEntry = false;
        if (component.state[varName].isArray && component.state[varName].arrayEntryNames) {
          for (let arrayEntryName of component.state[varName].arrayEntryNames) {
            if (arrayEntryName in receivedValue) {
              foundMatchingArrayEntry = true;
              receivedValue[arrayEntryName] = true;
              valuesChanged[arrayEntryName] = true;
              break;
            }
          }
        }
        if (!foundMatchingArrayEntry) {
          throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      } else {
        receivedValue[varName] = true;
        valuesChanged[varName] = true;
      }



      if (component.state[varName].isArray) {
        // if new value is an array, then reset arrayValues to be empty
        // TODO: how should this work with multi-dimensional arrays?
        valuesChanged[varName] = { arrayKeysChanged: {} };
        if (Array.isArray(result.newValues[varName])) {
          component.state[varName].arrayValues = [];
          valuesChanged[varName].changedEntireArray = true;
        }
        for (let arrayKey in result.newValues[varName]) {
          component.state[varName].setArrayValue({
            value: result.newValues[varName][arrayKey],
            arrayKey,
          });
          valuesChanged[varName].arrayKeysChanged[arrayKey] = true;
        }
      } else {

        // delete before assigning value to remove any getter for the property
        delete component.state[varName].value;
        component.state[varName].value = result.newValues[varName];

        if (result.checkForActualChange && result.checkForActualChange.includes(varName)) {
          // TODO: should this be a deep comparison?
          if (component.state[varName].value === component.state[varName]._previousValue) {
            delete valuesChanged[varName];
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
          throw Error(`Claiming stateVariable ${varName} is unchanged in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }

        receivedValue[varName] = true;

        // delete before assigning value to remove any getter for the property
        // then assign previous value
        delete component.state[varName].value;
        component.state[varName].value = component.state[varName]._previousValue;
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
          throw Error(`Attempting to make stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName} essential, but it's not listed as an additional state variable defined.`)
        }

        component.state[varName].essential = true;
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
          for (let arrayEntryName of component.state[varName].arrayEntryNames) {
            component.state[arrayEntryName].componentType = result.setComponentType[varName];
          }
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
        for (let arrayKeyChanged in valuesChanged[varName].arrayKeysChanged) {
          arrayVarNamesChanged.push(...component.state[varName].allVarNamesThatIncludeArrayKey(arrayKeyChanged))
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
        for (let arrayKey in useEssentialInfo) {
          if (component.state[varName].essentialByArrayKey[arrayKey]) {
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

    let dependencyValues = {};
    let changes = {};
    let usedDefault = {};

    let downDeps = this.downstreamDependencies[component.componentName][stateVariable];

    for (let depName in downDeps) {
      let dep = downDeps[depName];

      let value;

      if (dep.dependencyType === "childStateVariables" ||
        dep.dependencyType === "childIdentity" ||
        dep.dependencyType === "descendantStateVariables" ||
        dep.dependencyType === "descendantIdentity"
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

          if (dep.downstreamVariableNames) {
            for (let varName of dep.downstreamVariableNames) {
              if (!dep.variablesOptional || varName in depComponent.state ||
                this.checkIfAliasOrArrayEntry({
                  stateVariable: varName,
                  component: depComponent
                })
              ) {
                if (!depComponent.state[varName].deferred) {
                  childObj.stateValues[varName] = depComponent.stateValues[varName];
                  if (dep.valuesChanged && dep.valuesChanged[childInd] &&
                    dep.valuesChanged[childInd][varName] && dep.valuesChanged[childInd][varName].changed
                  ) {
                    if (!newChanges.valuesChanged) {
                      newChanges.valuesChanged = {};
                    }
                    if (!newChanges.valuesChanged[childInd]) {
                      newChanges.valuesChanged[childInd] = {}
                    }
                    newChanges.valuesChanged[childInd][varName] = dep.valuesChanged[childInd][varName];
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

        if (dep.downstreamComponentName !== null) {
          let depComponent = this.components[dep.downstreamComponentName];

          let ancestorObj = {
            componentName: depComponent.componentName,
            componentType: depComponent.componentType,
            stateValues: {}
          };

          if (dep.downstreamVariableNames) {
            for (let varName of dep.downstreamVariableNames) {
              if (!dep.variablesOptional || varName in depComponent.state ||
                this.checkIfAliasOrArrayEntry({
                  stateVariable: varName,
                  component: depComponent
                })
              ) {
                if (!depComponent.state[varName].deferred) {
                  ancestorObj.stateValues[varName] = depComponent.stateValues[varName];
                  if (dep.valuesChanged && dep.valuesChanged[varName] &&
                    dep.valuesChanged[varName].changed
                  ) {
                    if (!newChanges.valuesChanged) {
                      newChanges.valuesChanged = {}
                    }
                    newChanges.valuesChanged[varName] = dep.valuesChanged[varName];
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
        dep.dependencyType === "parentStateVariable") {
        let depComponent = this.components[dep.downstreamComponentName];
        value = depComponent.state[dep.downstreamVariableName].value;

        // if have valuesChanged, then must have dep.downstreamVariableName
        // so don't bother checking if it exists
        if (dep.valuesChanged && dep.valuesChanged[dep.downstreamVariableName].changed) {
          changes[dep.dependencyName] = { valuesChanged: dep.valuesChanged };
          delete dep.valuesChanged;
        }
        if (depComponent.state[dep.downstreamVariableName].usedDefault) {
          usedDefault[dep.dependencyName] = true
        }
      } else if (dep.dependencyType === "componentStateVariableComponentType") {
        let depComponent = this.components[dep.downstreamComponentName];
        // call getter to make sure component type is set
        depComponent.state[dep.downstreamVariableName].value;
        value = depComponent.state[dep.downstreamVariableName].componentType;
        if (dep.valuesChanged && dep.valuesChanged.changed) {
          changes[dep.dependencyName] = { valuesChanged: dep.valuesChanged };
          delete dep.valuesChanged;
        }
      }
      else if (dep.dependencyType === "componentIdentity") {

        let depComponent = this.components[dep.downstreamComponentName];
        value = {
          componentName: depComponent.componentName,
          componentType: depComponent.componentType,
        };

        if (dep.componentIdentitiesChanged) {
          changes[dep.dependencyName] = { componentIdentitiesChanged: true };
          dep.componentIdentitiesChanged = false;
        }
      }
      else if (dep.dependencyType === "recursiveDependencyValues") {
        // first calculate value of state variable
        // since dependencies are created as though depended on state variable itself
        this.components[dep.downstreamComponentName].stateValues[dep.downstreamVariableName]

        value = this.getStateVariableRecursiveDependencyValues({
          componentName: dep.downstreamComponentName,
          stateVariable: dep.downstreamVariableName,
          changedValuesOnly: dep.changedValuesOnly,
        })

        // don't check if have .changed attribute
        // as it wouldn't reflect if a change occurred anywhere in the dependencies
        if (dep.valuesChanged) {
          changes[dep.dependencyName] = { valuesChanged: dep.valuesChanged };
          delete dep.valuesChanged;
        }
      }

      else if (dep.dependencyType === "doenetAttribute") {
        value = component.doenetAttributes[dep.attributeName];
      }
      else if (dep.dependencyType === "flag") {
        value = this.flags[dep.flagName];
      }
      else if (dep.dependencyType === "value") {
        value = dep.value;
      }
      else if (dep.dependencyType === "serializedChildren") {
        value = component.serializedChildren;
      }
      else if (dep.dependencyType === "variants") {
        value = component.variants;
      }
      else if (dep.dependencyType === "potentialEssentialVariable") {
        if (component.potentialEssentialState) {
          value = component.potentialEssentialState[dep.variableName];
        } else {
          value = null;
        }
      }
      else {
        throw Error(`unrecognized dependency type ${dep.dependencyType}`);
      }

      if (!dep.doNotProxy && value !== null && typeof value === 'object') {
        value = new Proxy(value, readOnlyProxyHandler)
      }

      dependencyValues[dep.dependencyName] = value;
    }
    return {
      dependencyValues,
      changes, usedDefault,
    }
  }

  // gets all dependency values that are state variables themselves
  getStateVariableRecursiveDependencyValues({ componentName, stateVariable, changedValuesOnly }) {
    // and then recurses on those state variables
    // stores result on object keyed by component name and state variable
    // (dependency considered a state variable if it has 
    // downstreamComponentName(s) and downstreamVariableName(s))


    let component = this._components[componentName];

    // if they recursive dependency values are already computed, just return them
    if (component.state[stateVariable].recursiveDependencyValues) {
      return component.state[stateVariable].recursiveDependencyValues;
    }

    let { dependencyValues } = this.getStateVariableDependencyValues({ component, stateVariable });

    let recursiveDependencyValues
      = component.state[stateVariable].recursiveDependencyValues = {};

    let downDeps = this.downstreamDependencies[componentName][stateVariable];

    for (let depName in downDeps) {
      let dep = downDeps[depName];

      let cNames = [];
      let multipleComponents = false;
      if (dep.downstreamComponentName) {
        cNames = [dep.downstreamComponentName];
      } else if (dep.downstreamComponentNames) {
        cNames = dep.downstreamComponentNames;
        multipleComponents = true;
      }

      for (let [cInd, cName] of cNames.entries()) {
        let dependencyValuesForCName = recursiveDependencyValues[cName];
        if (dependencyValuesForCName === undefined) {
          dependencyValuesForCName = recursiveDependencyValues[cName] = {};
        }

        let changedValuesForCName = this.changedStateVariables[cName];

        let vNames = [];
        let multipleVariables = false;
        if (dep.downstreamVariableName) {
          vNames = [dep.downstreamVariableName];
        } else if (dep.downstreamVariableNames) {
          vNames = dep.downstreamVariableNames;
          multipleVariables = true;
          if (dep.variablesOptional) {
            vNames = [];
            for (let vName of dep.downstreamVariableNames) {
              if (vName in this._components[cName].state ||
                this.checkIfAliasOrArrayEntry({
                  stateVariable: vName,
                  component: this._components[cName]
                })
              ) {
                vNames.push(vName);
              }
            }
            if (vNames.length === 0) {
              vNames = ['__identity'];
            }
          }
        }



        for (let vName of vNames) {
          // don't calculate value or recurse if calculated this value before
          if (!(vName in dependencyValuesForCName)) {

            // if changedValuesOnly, then only include if these values have changed
            if (!changedValuesOnly || changedValuesForCName) {

              let value = dependencyValues[depName];

              if (multipleComponents) {
                value = value[cInd];
              }
              if (multipleVariables) {
                value = value.stateValues[vName]
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

    // console.log(`**** record actual change for ${varName} of ${component.componentName}`)

    let componentName = component.componentName

    let upstream = this.upstreamDependencies[componentName][varName];

    if (upstream) {
      for (let upDep of upstream) {

        if (upDep.valuesChanged) {

          let upValuesChanged;
          if (upDep.downstreamComponentNames) {
            let ind = upDep.downstreamComponentNames.indexOf(componentName);
            upValuesChanged = upDep.valuesChanged[ind][varName]
          } else {
            upValuesChanged = upDep.valuesChanged[varName]

          }

          if (component.state[varName].isArray) {
            if (upValuesChanged.changed === undefined) {
              upValuesChanged.changed = { arrayKeysChanged: {} };
            } else if (upValuesChanged.changed === true) {
              upValuesChanged.changed = { changedEntireArray: true, arrayKeysChanged: {} };
            }
            if (changes) {
              if (changes.changedEntireArray) {
                upValuesChanged.changed.changedEntireArray = true;
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

  getComponentNamesForProp(componentName) {
    let component = this._components[componentName];
    if (!component) {
      return [];
    }

    if (component instanceof this.allComponentClasses._composite
      && component.constructor.refPropOfReplacements
    ) {
      if (!component.isExpanded) {
        let readyToExpand;
        if (!("readyToExpandWhenResolved" in component.state)) {
          throw Error(`Could not evaluate state variable readyToExpandWhenResolved of composite ${componentName}`);
        }
        readyToExpand = component.state.readyToExpandWhenResolved.isResolved
        if (!readyToExpand) {
          throw Error(`State variable readyToExpandWhenResolved of composite ${componentName} is not resolved`);
        }

        let expandResult = this.expandCompositeComponent({
          component,
        });

        if (!expandResult.success) {
          throw Error(`Could not expand composite ${componentName} as expanding was not successful`);
        }
      }
      let replacementNames = [];
      for (let replacement of component.replacements) {
        replacementNames.push(...this.getComponentNamesForProp(replacement.componentName));
      }
      return replacementNames;
    } else {
      return [componentName];
    }
  }

  resolveStateVariables({ component, stateVariable }) {
    // console.log(`resolve state variable ${stateVariable ? stateVariable : ""} for ${component.componentName}`);

    let componentName = component.componentName;

    let varsUnresolved = {};
    let componentVarsDeleted = {};

    let numInternalUnresolved = Infinity;
    let prevUnresolved = [];

    if (stateVariable) {
      prevUnresolved.push(stateVariable);
    } else {
      for (let varName in component.state) {
        if (!component.state[varName].isResolved) {
          prevUnresolved.push(varName);
        }
      }
    }

    // if child logic isn't satisfied, all variables remain unresolved
    if (!component.childLogicSatisfied) {
      for (let varName of prevUnresolved) {
        varsUnresolved[varName] = [{
          componentName,
          stateVariable: '__childLogic'
        }];
      }

      return { varsUnresolved, componentVarsDeleted };
    }


    while (prevUnresolved.length > 0 && prevUnresolved.length < numInternalUnresolved) {

      let onlyInternalDependenciesUnresolved = [];

      for (let varName of prevUnresolved) {
        if (componentVarsDeleted[componentName] &&
          componentVarsDeleted[componentName].includes(varName)
        ) {
          continue;
        }

        let downDeps = this.downstreamDependencies[componentName][varName];
        let resolved = true;
        let unresolvedDependencies = [];
        let externalDependenciesResolved = true;
        for (let depName in downDeps) {
          let dep = downDeps[depName];
          let downstreamComponentNames = dep.downstreamComponentNames;
          if (!downstreamComponentNames) {
            if (dep.downstreamComponentName) {
              downstreamComponentNames = [dep.downstreamComponentName]
            } else {
              downstreamComponentNames = [];
            }
          }
          let downstreamVariableNames = dep.downstreamVariableNames;
          if (!downstreamVariableNames) {
            if (dep.downstreamVariableName) {
              downstreamVariableNames = [dep.downstreamVariableName];
            }
            // don't make downstreamVariableNames = [] if no variables
            // as below check downstreamAttribute only if downstreamVariableNames is undefined
          }
          for (let downstreamComponentName of downstreamComponentNames) {
            let depComponent = this._components[downstreamComponentName];
            if (!depComponent) {
              resolved = false;
              unresolvedDependencies.push({
                componentName: downstreamComponentName,
                stateVariable: '__identity',
              });
            } else if (downstreamVariableNames) {
              for (let downVar of downstreamVariableNames) {
                let thisDownVarResolved = false;
                if (downVar === "__identity") {
                  thisDownVarResolved = true;
                } else {

                  if (!depComponent.state[downVar]) {
                    if (dep.variablesOptional &&
                      !this.checkIfAliasOrArrayEntry({
                        stateVariable: downVar,
                        component: depComponent
                      })
                    ) {
                      continue;
                    }


                    // see if can create the variable downVar from an alias or array entry

                    let result = this.createFromAliasOrArrayEntry({
                      stateVariable: downVar,
                      component: depComponent
                    });

                    for (let cName in result.componentVarsDeleted) {
                      if (!componentVarsDeleted[cName]) {
                        componentVarsDeleted[cName] = [];
                      }
                      componentVarsDeleted[cName].push(...result.componentVarsDeleted[cName])
                    }

                    if (Object.keys(result.varsUnresolved).length > 0) {
                      this.addUnresolvedDependencies({
                        varsUnresolved: result.varsUnresolved,
                        component: depComponent
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
            } else if (dep.downstreamAttribute) {
              if (dep.downstreamAttribute === "classOrReplacementClass") {
                if (depComponent instanceof this.allComponentClasses._composite) {
                  if (!depComponent.isExpanded) {
                    // TODO: what should really be here?  How know if ready to calculate replacements
                    // TODO: need to recurse to replacements of replacements, or won't that happen?
                    // throw Error(`replacements for composite ${depComponent.componentName} not calculated....`)
                    resolved = false;
                    unresolvedDependencies.push({
                      componentName: downstreamComponentName,
                      stateVariable: '__replacements',
                    });
                  }
                }
              } else {
                throw Error(`Unrecognized downstream attribute ${dep.downstreamAttribute} for state variable ${varName} of ${componentName}`)
              }
            }
          }
        }

        component.state[varName].isResolved = resolved;


        if (resolved) {
          delete varsUnresolved[varName];

          if (component.state[varName].isAction) {

            let actionArgs = this.getStateVariableDependencyValues({ component, stateVariable: varName });

            let result = component.state[varName].action(actionArgs);

            if (result && result.varsDeleted) {
              if (!componentVarsDeleted[componentName]) {
                componentVarsDeleted[componentName] = [];
              }
              componentVarsDeleted[componentName].push(...result.varsDeleted);
            }

          }

        } else {
          varsUnresolved[varName] = unresolvedDependencies;
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

    return { varsUnresolved, componentVarsDeleted };

  }

  checkIfAliasOrArrayEntry({ stateVariable, component }) {
    if (component.stateVarAliases && stateVariable in component.stateVarAliases) {
      return true;
    }
    // check if stateVariable begins when an arrayEntry
    for (let arrayEntryPrefix in component.arrayEntryPrefixes) {
      if (stateVariable.substring(0, arrayEntryPrefix.length) === arrayEntryPrefix) {
        return true;
      }
    }

    return false;
  }

  createFromAliasOrArrayEntry({ stateVariable, component }) {
    // console.log(`create from alias or array entry: ${stateVariable} of ${component.componentName}`);

    let varsUnresolved = {};
    let componentVarsDeleted = {};

    if (component.stateVarAliases && stateVariable in component.stateVarAliases) {
      let aliasVar = component.stateVarAliases[stateVariable];
      if (!(aliasVar in component.state)) {
        // if aliasVar isn't in state, then check if it is an alias or array entry
        let result = this.createFromAliasOrArrayEntry({ stateVariable: aliasVar, component });
        // this.resolveStateVariables({ component: component, stateVariable: aliasVar });
        Object.assign(varsUnresolved, result.varsUnresolved);
        for (let cName in result.componentVarsDeleted) {
          if (!componentVarsDeleted[cName]) {
            componentVarsDeleted[cName] = [];
          }
          componentVarsDeleted[cName].push(...results.componentVarsDeleted[cName])
        }

        if (aliasVar in varsUnresolved) {
          varsUnresolved[stateVariable] = varsUnresolved[aliasVar];
        }
      } else {
        if (!component.state[aliasVar].isResolved) {
          // TODO: if it is possible that aliasVar is already in state
          // but it is still the first round where this.unresolvedDependencies
          // it not yet populated, then need to propagate unresolved
          // info via another mechanism
          if (!this.unresolvedDependencies[component.componentName]) {
            throw Error(`must implement case where already created alias isn't resolved during first pass`)
          }
          varsUnresolved[stateVariable] = this.unresolvedDependencies[component.componentName][aliasVar];
        }
      }
      component.state[stateVariable] = component.state[aliasVar];

      if (component.componentName in this.downstreamDependencies) {
        // copy downstream and upstream deps
        this.downstreamDependencies[component.componentName][stateVariable] = this.downstreamDependencies[component.componentName][aliasVar];
        this.upstreamDependencies[component.componentName][stateVariable] = this.upstreamDependencies[component.componentName][aliasVar];
        this.checkForCircularDependency({ componentName: component.componentName, varName: stateVariable });

        // note: don't need to copy dependencies that point to alias
        // as don't need to actually update alias
      } else {
        if (!component.aliasesToCopyDependencies) {
          component.aliasesToCopyDependencies = {}
        }
        component.aliasesToCopyDependencies[stateVariable] = aliasVar
      }
    }
    else {

      let foundArrayEntry = false;

      // check if stateVariable begins when an arrayEntry
      for (let arrayEntryPrefix in component.arrayEntryPrefixes) {
        if (stateVariable.substring(0, arrayEntryPrefix.length) === arrayEntryPrefix) {
          // found a reference to an arrayEntry that hasn't been created yet
          // attempt to resolve this arrayEntry

          let varEnding = stateVariable.substring(arrayEntryPrefix.length);
          if (varEnding === "") {
            continue;
          }

          let arrayStateVariable = component.arrayEntryPrefixes[arrayEntryPrefix];

          let arrayKeys = component.state[arrayStateVariable].getArrayKeysFromVarName({
            varEnding,
            arrayEntryPrefix,
          });

          if (arrayKeys !== undefined) {

            this.initializeStateVariable({ component, stateVariable, arrayKeys, arrayStateVariable });
            if (component.state[arrayStateVariable].setUpArrayEntryDependencies) {
              component.state[arrayStateVariable].setUpArrayEntryDependencies(stateVariable);
              this.checkForCircularDependency({ componentName: component.componentName, varName: stateVariable });

              // console.log(component.state)
              let result = this.resolveStateVariables({ component: component, stateVariable: stateVariable });

              Object.assign(varsUnresolved, result.varsUnresolved);
              for (let cName in result.componentVarsDeleted) {
                if (!componentVarsDeleted[cName]) {
                  componentVarsDeleted[cName] = [];
                }
                componentVarsDeleted[cName].push(...results.componentVarsDeleted[cName])
              }
            } else {
              // arrayStateVariable doesn't yet have setUpArrayEntryDependencies
              // (meaning child logic wasn't satisfied when it was created)
              // So, add array entry to list of variables that must be set up

              // TODO: verify this, but it appears don't need to create an entriesToSetUp array
              // as setUpArrayEntryDependencies is called on any array entries previous created
              // when arrayStateVariable gets a setUpArrayEntryDependencies function
              // if (component.state[arrayStateVariable].entriesToSetUp === undefined) {
              //   component.state[arrayStateVariable].entriesToSetUp = [];
              // }
              // component.state[arrayStateVariable].entriesToSetUp.push(stateVariable);
              varsUnresolved[stateVariable] = [{
                componentName: component.componentName,
                stateVariable: "__childLogic"
              }];
            }
            foundArrayEntry = true;
            break;
          }
        }
      }

      if (!foundArrayEntry) {
        throw Error(`Unknown state variable ${stateVariable} of ${component.componentName}`);
      }
    }

    return { varsUnresolved, componentVarsDeleted };
  }

  resolveAllDependencies() {
    // attempt to resolve all dependencies of all components
    // Does not return anything, but if this.unresolvedDependencies
    // is not empty when the function finishes,
    // it did not succeed in resolving all dependencies

    // The key data structures are
    // - this.unresolvedDependencies and
    // - this.unresolvedByDependent
    // Both are keyed by componentName and stateVariable
    // with values that are arrays of {componentName, stateVariable}

    // this.unresolvedDependencies is keyed by the unresolved name/variable
    // and contains an array of dependent name/variables that were
    // preventing the variable from being resolved

    // this.unresolvedByDependent is keyed by the dependendent name/variable
    // and contains an array of name/variables that it was preventing
    // from being resolved

    // Note: varName in unresolvedByDependent could also be
    // "__identity", "__childLogic", "__replacements"


    console.log('resolving all dependencies');

    // for each component, keep an array of state variables deleted
    let componentVarsDeleted = this.deletedStateVariables;

    // keep track of unresolved references to component names
    // so that can give an appropriate error message
    // in the case that the component name is never resolved
    let unResolvedRefToComponentNames = [];

    // keep looping until
    // - we have resolved all dependencies, or
    // - we are no longer resolving additional dependencies
    let resolvedAnotherDependency = true;
    while (resolvedAnotherDependency && Object.keys(this.unresolvedDependencies).length > 0) {
      // console.log(JSON.parse(JSON.stringify(this.unresolvedDependencies)));
      // console.log(JSON.parse(JSON.stringify(this.unresolvedByDependent)));

      resolvedAnotherDependency = false;

      // find component/state variable that 
      // - had been preventing others from being resolved
      //   (i.e., is in this.unresolvedByDependent), and
      // - is now resolved (i.e., isn't in this.unresolvedDependencies)
      for (let componentName in this.unresolvedByDependent) {
        if (!(componentName in this.components)) {
          // componentName doesn't exist yet, but it may be created later
          // as a replacement of a composite
          unResolvedRefToComponentNames.push(componentName);
          continue;
        }
        for (let varName in this.unresolvedByDependent[componentName]) {
          // check if componentName/varName is a resolved state variable

          // if components hasn't been expanded, then its replacements aren't resolved
          if (varName === "__replacements" && !this.components[componentName].isExpanded) {
            continue;
          }

          // newly successful childLogic will be processed right after it is processed
          if (varName === "__childLogic") {
            continue;
          }

          let deleted = componentVarsDeleted[componentName] &&
            componentVarsDeleted[componentName].includes(varName);

          if (varName !== "__identity" && !(varName in this.components[componentName].state) && !deleted) {
            throw Error(`Reference to invalid state variable ${varName} of ${componentName}`);
          }

          if (!(componentName in this.unresolvedDependencies) ||
            varName === "__identity" || deleted ||
            !(varName in this.unresolvedDependencies[componentName])
          ) {
            // found a componentName/state variable that
            // - is now resolved or
            // - represent a component that now exists (for __identity) or
            // - is now deleted (so can't prevent others from being resolved)

            // Now, go through the array of state variables that were being blocked
            // by componentName/varName to see if we can resolved them
            for (let dep of this.unresolvedByDependent[componentName][varName]) {

              let depComponent = this._components[dep.componentName];

              if (this.unresolvedDependencies[dep.componentName] === undefined ||
                this.unresolvedDependencies[dep.componentName][dep.stateVariable] === undefined) {
                // if already resolved (by another dependency), skip
                continue;
              }
              if (componentVarsDeleted[dep.componentName] &&
                componentVarsDeleted[dep.componentName].includes(dep.stateVariable)) {
                // if depComponent's variable was already deleted 
                // (from when we processed another dependency)
                // remove it from unresolvedDepenencies and skip
                delete this.unresolvedDependencies[dep.componentName][dep.stateVariable];
                if (Object.keys(this.unresolvedDependencies[dep.componentName]).length === 0) {
                  delete this.unresolvedDependencies[dep.componentName];
                }

                continue;
              }

              // see if we can resolve depComponent's state variable
              let resolveResult = this.resolveStateVariables({
                component: depComponent,
                stateVariable: dep.stateVariable
              });

              for (let cName in resolveResult.componentVarsDeleted) {
                if (!componentVarsDeleted[cName]) {
                  componentVarsDeleted[cName] = [];
                }
                componentVarsDeleted[cName].push(...resolveResult.componentVarsDeleted[cName])
              }


              if (Object.keys(resolveResult.varsUnresolved).length === 0) {
                // we have resolved just the one state variable dep.stateVariable

                resolvedAnotherDependency = true;

                // delete state from unresolvedDependencies
                delete this.unresolvedDependencies[dep.componentName][dep.stateVariable];
                if (Object.keys(this.unresolvedDependencies[dep.componentName]).length === 0) {
                  delete this.unresolvedDependencies[dep.componentName];
                }

                // TODO: do we have to worry about circular dependence here?

                // The state variable readyToExpandWhenResolved is a special state variable
                // for composite components.
                // Once this variable is newly resolved,
                // we may expand the composite component into its replacements

                if (dep.stateVariable === "readyToExpandWhenResolved" &&
                  depComponent instanceof this._allComponentClasses['_composite']) {

                  let result = this.expandNewlyResolvedComposite(depComponent);

                  if (result.varsDeleted && result.varsDeleted.length > 0) {
                    if (componentVarsDeleted[compositeComponent.parentName]) {
                      componentVarsDeleted[compositeComponent.parentName].push(...result.varsDeleted);
                    }
                    else {
                      componentVarsDeleted[compositeComponent.parentName] = result.varsDeleted;
                    }
                  }

                }
              } else {
                // dep.stateVariable still not resolved.  Delete old unresolved dependencies
                // and add back new ones
                this.recalculateUnresolvedForDep({ dep, componentName, varName, varsUnresolved: resolveResult.varsUnresolved });

              }
            }

            // We finished processing the array of state variables that we being blocked
            // by componentName/varName
            // Delete the records that componentName/varName is blocking any variables

            delete this.unresolvedByDependent[componentName][varName];
            if (Object.keys(this.unresolvedByDependent[componentName]).length === 0) {
              delete this.unresolvedByDependent[componentName];
            }

          }
        }
      }

      // We finished 
      // - looping through all componentName/varNames of this.unresolvedByDependent
      // - finding those varNames that were resolved, and
      // - attempting to resolve those variables that depend on it

      // We'll repeat this process as long as we're making progress
      // and there are still unresolved variables left

    }

    // All attempts to resolve variables have finished
    // Either we resolved all variables or we stopped making progress

    if (Object.keys(this.unresolvedDependencies).length > 0) {
      // still didn't resolve all state variables
      this.createUnresolvedMessage(unResolvedRefToComponentNames);
    }

  }


  createUnresolvedMessage(unResolvedRefToComponentNames) {
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
      this.unresolvedMessage = unresolvedReferenceMessage;
    }
    else {
      for (let componentName in this.unresolvedDependencies) {
        let component = this.components[componentName];
        if (!component.childLogicSatisfied) {
          childLogicMessage += `Invalid children for ${componentName}: ${component.childLogic.logicResult.message} `;
        }
        else {
          for (let varName in this.unresolvedDependencies[componentName]) {
            unresolvedVarMessage += `Could not resolve state variable ${varName} of ${componentName}. `;
          }
        }
      }
      if (childLogicMessage) {
        this.unresolvedMessage = childLogicMessage;
      }
      else {
        this.unresolvedMessage = unresolvedVarMessage;
      }
    }
  }

  recalculateUnresolvedForDep({ dep, componentName, varName, varsUnresolved }) {

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

    for (let currentDep of this.unresolvedDependencies[dep.componentName][dep.stateVariable]) {
      let cName2 = currentDep.componentName;
      let varName2 = currentDep.stateVariable;
      if (cName2 !== componentName || varName2 !== varName) {
        // delete any other dependencies that current depended on
        // (will re-add at end if still have this dependency)
        let indexOfDep;
        for (let [ind, oDep] of this.unresolvedByDependent[cName2][varName2].entries()) {
          if (oDep.componentName === dep.componentName && oDep.stateVariable === dep.stateVariable) {
            indexOfDep = ind;
            break;
          }
        }
        if (indexOfDep === undefined) {
          throw Error(`Something went wrong with unresolved dependencies....`);
        }
        this.unresolvedByDependent[cName2][varName2].splice(indexOfDep, 1);
      }
    }
    this.unresolvedDependencies[dep.componentName][dep.stateVariable] = varsUnresolved[dep.stateVariable];
    // add any new (or possibly deleted above) unresolved dependencies
    // that we calculate from the new varsUnresolved
    for (let unresDep of varsUnresolved[dep.stateVariable]) {
      let cName2 = unresDep.componentName;
      let varName2 = unresDep.stateVariable;
      if (cName2 === componentName && varName2 === varName) {
        throw Error(`State variable ${varName2} of ${cName2} reported as unresolved after already being resolved.`);
      }
      if (this.unresolvedByDependent[cName2] === undefined) {
        this.unresolvedByDependent[cName2] = {};
      }
      if (this.unresolvedByDependent[cName2][varName2] === undefined) {
        this.unresolvedByDependent[cName2][varName2] = [];
      }
      this.unresolvedByDependent[cName2][varName2].push({
        componentName: dep.componentName,
        stateVariable: dep.stateVariable
      });
    }
  }

  expandNewlyResolvedComposite(compositeComponent) {

    // Note: save parentName to variable
    // as it is possible that actual parent of composite will change
    // when resolving dependencies of parent (e.g., through sugar)
    let parentName = compositeComponent.parentName
    let parent = this._components[parentName];

    let newChildrenResult = this.processNewDefiningChildren({
      parent,
      applySugar: true,
    });

    if (!newChildrenResult.success) {
      return {};
    }

    // recreate the dependencies for parent
    // TODO: understand exactly why we have to do this here
    // Presumably due to fact that new replacements might not
    // be completely resolved?
    let result = this.createAndResolveDependencies(parent);

    if (Object.keys(result.varsUnresolved).length === 0) {
      delete this.unresolvedDependencies[parentName];
    }
    else {
      this.unresolvedDependencies[parentName] = {};
      this.addUnresolvedDependencies({
        varsUnresolved: result.varsUnresolved,
        component: parent
      });
    }

    return result;

  }

  markChildAndDescendantDependenciesChanged(component) {

    let componentsTouched = [];

    if (!component.childLogicSatisfied) {
      return componentsTouched;
    }

    let componentName = component.componentName;

    if (componentName in this.downstreamDependencies) {
      // only need to change child dependencies if the component already has dependencies
      componentsTouched = this.markChildDependenciesChanged(component);
    }

    if (component.ancestors) {

      // if component or its ancestors are the ancestor
      // of a descendant state variable
      // then need to recalculate dependencies of that state variable
      componentsTouched.push(...this.markDescendantDependenciesChanged(component));

    }

    // TODO: if we do need to update composite replacements here
    // we need to check if appropriate state variables are resolved

    // // get unique list of components touched
    // componentsTouched = new Set(componentsTouched);

    // // calculate any replacement changes on composites touched
    // this.replacementChangesFromComponentsTouched(componentsTouched);

    // // changed componentsTouched back to array
    // componentsTouched = [...componentsTouched];

    return componentsTouched;

  }

  markChildDependenciesChanged(component) {

    let componentName = component.componentName;
    let componentsTouched = [];

    // before making any changes, go through and find out if there are
    // any components with state variables determining dependencies
    // and get the value of those state variables
    let stateValuesForDependencies = {};
    for (let varName in component.state) {
      let stateVarObj = component.state[varName];
      if (stateVarObj.stateVariablesDeterminingDependencies) {
        for (let varName2 of stateVarObj.stateVariablesDeterminingDependencies) {
          if (!(varName2 in stateValuesForDependencies)) {
            if (component.state[varName2].isResolved) {
              stateValuesForDependencies[varName2] = component.stateValues[varName2];
            }
          }
        }
      }
    }

    for (let varName in component.state) {
      let stateVarObj = component.state[varName];

      if (stateVarObj.isArrayEntry) {
        // skip array entries, as will get them from whole array
        // (and they don't have a returnDependencies function directly)
        continue;
      }

      let stateValues = {};
      if (stateVarObj.stateVariablesDeterminingDependencies) {
        let missingAValue = false;
        for (let varName2 of stateVarObj.stateVariablesDeterminingDependencies) {
          if (!(varName2 in stateValuesForDependencies)) {
            missingAValue = true;
            break;
          }
          stateValues[varName2] = stateValuesForDependencies[varName2];
        }
        if (missingAValue) {
          // if a value determining dependencies isn't defined
          // then we can't reexamine the state variable dependencies
          continue;
        }
      }

      let dependencyDefinitions = stateVarObj.returnDependencies({
        componentInfoObjects: this.componentInfoObjects,
        stateValues,
        sharedParameters: component.sharedParameters,
      });

      let downDeps = this.downstreamDependencies[componentName][varName];
      let varDepsChanged = false;

      for (let depName in dependencyDefinitions) {
        let depDef = dependencyDefinitions[depName];
        let currentDep = downDeps[depName];
        if (depDef.dependencyType === "childStateVariables" || depDef.dependencyType === "childIdentity") {
          let childrenChanged = false;
          let activeChildrenIndices = component.childLogic.returnMatches(depDef.childLogicName);
          if (activeChildrenIndices === undefined) {
            throw Error(`Invalid state variable ${varName} of ${component.componentName}: childLogicName ${depDef.childLogicName} does not exist.`);
          }
          // if childIndices specified, filter out just those indices
          // Note: indices are relative to the selected ones
          // (not actual index in activeChildren)
          // so filter uses the i argument, not the x argument
          if (depDef.childIndices !== undefined) {
            activeChildrenIndices = activeChildrenIndices
              .filter((x, i) => depDef.childIndices.includes(i));
          }

          let newChildren = activeChildrenIndices.map(x => component.activeChildren[x].componentName);
          if (newChildren.length !== currentDep.downstreamComponentNames.length) {
            childrenChanged = true;
          }
          else {
            for (let [ind, childName] of newChildren) {
              if (childName !== currentDep.downstreamComponentNames[ind]) {
                childrenChanged = true;
                break;
              }
            }
          }

          if (childrenChanged) {
            varDepsChanged = true;
            currentDep.componentIdentitiesChanged = true;
            let children = [];
            let valuesChanged = [];
            for (let childIndex of activeChildrenIndices) {
              let childName = component.activeChildren[childIndex].componentName;
              children.push(childName);

              let valsChanged = {}
              if (depDef.dependencyType === "childStateVariables") {
                for (let vName of currentDep.downstreamVariableNames) {
                  valsChanged[vName] = { changed: true }
                }
              }
              valuesChanged.push(valsChanged);
            }

            // change upstream dependencies
            for (let currentChild of currentDep.downstreamComponentNames) {
              if (!children.includes(currentChild)) {
                // lost a child that matched this childLogic component.  remove dependency
                componentsTouched.push(currentChild);

                let childUpDep = this.upstreamDependencies[currentChild];
                let depNamesToCheck = ['__identity'];
                if (currentDep.downstreamVariableNames) {
                  depNamesToCheck.push(...currentDep.downstreamVariableNames);
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
              }
            }

            for (let newChild of children) {
              if (!currentDep.downstreamComponentNames.includes(newChild)) {
                // gained a child that matched this childLogic component.  add dependency
                componentsTouched.push(newChild);
                let childUpDep = this.upstreamDependencies[newChild];
                if (childUpDep === undefined) {
                  childUpDep = this.upstreamDependencies[newChild] = {};
                }
                if (currentDep.downstreamVariableNames) {
                  let childVarNames = currentDep.downstreamVariableNames;
                  if (currentDep.variablesOptional) {
                    childVarNames = [];
                    for (let varName of currentDep.downstreamVariableNames) {
                      if (varName in this._components[newChild].state ||
                        this.checkIfAliasOrArrayEntry({
                          stateVariable: varName,
                          component: this._components[newChild]
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
                    if (childUpDep[vName] === undefined) {
                      childUpDep[vName] = [];
                    }
                    childUpDep[vName].push(currentDep);
                  }
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
            currentDep.valuesChanged = valuesChanged;
          }
        }
      }

      if (varDepsChanged) {
        this.checkForCircularDependency({ componentName: component.componentName, varName });
        let additionalComponentsTouched = this.markStateVariableAndUpstreamDependentsStale({ component, varName });
        componentsTouched.push(...additionalComponentsTouched);
      }
    }


    // for all children, check if they need to change their parent state variables
    for (let childName in component.allChildren) {
      let additionalComponentsTouched = this.changeParentStateVariables(childName);
      componentsTouched.push(...additionalComponentsTouched);
    }

    return componentsTouched;

  }

  markDescendantDependenciesChanged(component) {

    let componentsTouched = [];

    let componentAndAncestors = [
      {
        componentName: component.componentName,
        componentClass: component.constructor
      },
      ...component.ancestors
    ];

    for (let ancestorObj of componentAndAncestors) {
      let ancestorName = ancestorObj.componentName;
      if (this.descendantDependenciesByAncestor[ancestorName]) {
        for (let depDescription of this.descendantDependenciesByAncestor[ancestorName]) {
          let cName = depDescription.componentName;
          let varName = depDescription.stateVariable;
          let depName = depDescription.depName;
          let currentDep = this.downstreamDependencies[cName][varName][depName];

          let descendants = gatherDescendants({
            ancestor: this.components[currentDep.ancestorName],
            descendantClasses: currentDep.componentTypes.map(x => this.allComponentClasses[x]),
            recurseToMatchedChildren: currentDep.recurseToMatchedChildren,
            useReplacementsForComposites: currentDep.useReplacementsForComposites,
            includeNonActiveChildren: currentDep.includeNonActiveChildren,
            includePropertyChildren: currentDep.includePropertyChildren,
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
            if (currentDep.downstreamVariableNames) {
              let valsChanged = {}
              for (let vName of currentDep.downstreamVariableNames) {
                valsChanged[vName] = { changed: true }
              }
              valuesChanged = descendants.map(() => valsChanged);
            }

            // change upstream dependencies
            for (let currentDescendant of currentDep.downstreamComponentNames) {
              if (!descendants.includes(currentDescendant)) {
                // lost a descendant.  remove dependency
                componentsTouched.push(currentDescendant);
                let descendantUpDep = this.upstreamDependencies[currentDescendant];
                let depNamesToCheck = [];
                if (currentDep.downstreamVariableNames) {
                  depNamesToCheck = currentDep.downstreamVariableNames;
                }
                else {
                  depNamesToCheck = ['__identity'];
                }
                for (let vName of depNamesToCheck) {
                  let upDeps = descendantUpDep[vName];
                  for (let [ind, u] of upDeps.entries()) {
                    if (u === currentDep) {
                      upDeps.splice(ind, 1);
                      break;
                    }
                  }
                }
              }
            }

            for (let newDescendant of descendants) {
              if (!currentDep.downstreamComponentNames.includes(newDescendant)) {
                // gained a descendant.  add dependency
                componentsTouched.push(newDescendant);
                let descendantUpDep = this.upstreamDependencies[newDescendant];
                if (descendantUpDep === undefined) {
                  descendantUpDep = this.upstreamDependencies[newDescendant] = {};
                }
                if (currentDep.downstreamVariableNames) {
                  let descendantVarNames = currentDep.downstreamVariableNames;
                  if (currentDep.variablesOptional) {
                    descendantVarNames = [];
                    for (let varName of currentDep.downstreamVariableNames) {
                      if (varName in this._components[newDescendant].state ||
                        this.checkIfAliasOrArrayEntry({
                          stateVariable: varName,
                          component: this._components[newDescendant]
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
                    if (descendantUpDep[vName] === undefined) {
                      descendantUpDep[vName] = [];
                    }
                    descendantUpDep[vName].push(currentDep);
                  }
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
            currentDep.valuesChanged = valuesChanged;

            this.checkForCircularDependency({ componentName: cName, varName });

            let additionalComponentsTouched = this.markStateVariableAndUpstreamDependentsStale({
              component: this._components[cName],
              varName
            });

            componentsTouched.push(...additionalComponentsTouched);
          }
        }
      }
    }

    return componentsTouched;

  }

  changeParentStateVariables(componentName) {

    let componentsTouched = [];

    let componentDownDeps = this.downstreamDependencies[componentName];

    // if component not in downstream dependencies, there's nothing to do
    if (componentDownDeps === undefined) {
      return componentsTouched
    }

    // Note: this function is untested as parentStateVariables are not common
    // TODO: test this function

    let component = this._components[componentName];


    // before making any changes, go through and find out if there are
    // any components with state variables determining dependencies
    // and get the value of those state variables
    let stateValuesForDependencies = {}
    for (let varName in component.state) {
      let stateVarObj = component.state[varName];
      if (stateVarObj.stateVariablesDeterminingDependencies) {
        for (let varName2 of stateVarObj.stateVariablesDeterminingDependencies) {
          if (!(varName2 in stateValuesForDependencies)) {
            if (component.state[varName2].isResolved) {
              stateValuesForDependencies[varName2] = component.stateValues[varName2]
            }
          }
        }
      }
    }


    for (let varName in component.state) {

      let stateVarObj = component.state[varName];

      if (stateVarObj.isArrayEntry) {
        // skip array entries, as will get them from whole array
        // (and they don't have a returnDependencies function directly)
        continue;
      }

      let stateValues = {};
      if (stateVarObj.stateVariablesDeterminingDependencies) {
        let missingAValue = false;
        for (let varName2 of stateVarObj.stateVariablesDeterminingDependencies) {
          if (!(varName2 in stateValuesForDependencies)) {
            missingAValue = true;
            break;
          }
          stateValues[varName2] = stateValuesForDependencies[varName2]
        }
        if (missingAValue) {
          // if a value determining dependencies isn't defined
          // then we cannot reexamine the state variable dependencies
          continue;
        }
      }

      let dependencyDefinitions = stateVarObj.returnDependencies({
        componentInfoObjects: this.componentInfoObjects,
        stateValues,
        sharedParameters: component.sharedParameters,
      });

      let downDeps = componentDownDeps[varName];

      let varDepsChanged = false;

      for (let depName in dependencyDefinitions) {
        let depDef = dependencyDefinitions[depName];
        let currentDep = downDeps[depName];

        if (depDef.dependencyType === "parentStateVariable") {
          if (!component.parentName) {
            throw Error(`cannot have state variable ${stateVariable} of ${component.componentName} depend on parentStateVariables when parent isn't defined.`);
          }
          if (depDef.variableName === undefined) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
          }

          // delete updep from previous parent
          let previousParentName = currentDep.downstreamComponentName;

          // (It's possible this gets called when a component switches child logic
          // components for the same parent)
          if (previousParentName === component.parentName) {
            continue;
          }

          varDepsChanged = true;

          let parentUpDep = this.upstreamDependencies[previousParentName][depDef.variableName];
          for (let [ind, u] of parentUpDep.entries()) {
            if (u === currentDep) {
              parentUpDep.splice(ind, 1);
              break;
            }
          }

          currentDep.downstreamComponentName = component.parentName;

          currentDep.valuesChanged = { [depDef.variableName]: { changed: true } };

          let depUp = this.upstreamDependencies[component.parentName];
          if (!depUp) {
            depUp = this.upstreamDependencies[depDef.componentName] = {};
          }
          if (depUp[depDef.variableName] === undefined) {
            depUp[depDef.variableName] = [];
          }

          let foundCurrentDep = false;
          for (let u of depUp) {
            if (u === currentDep) {
              foundCurrentDep = true;
              break;
            }
          }
          if (!foundCurrentDep) {
            depUp[depDef.variableName].push(currentDep);
          }

        }
      }


      if (varDepsChanged) {
        this.checkForCircularDependency({ componentName: component.componentName, varName });
        let additionalComponentsTouched = this.markStateVariableAndUpstreamDependentsStale({ component, varName });
        componentsTouched.push(...additionalComponentsTouched);
      }
    }

    return componentsTouched;
  }

  checkForCircularDependency({ componentName, varName, previouslyVisited = [] }) {

    let varNameKey = `${componentName}__|__${varName}`

    if (previouslyVisited.includes(varNameKey)) {
      // Found circular dependency
      // Create error message with list of component names involved

      let componentNameRe = /^(.*)__\|__/
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
      previouslyVisited = [...previouslyVisited, varNameKey];
    }

    if (componentName in this.downstreamDependencies) {

      let downDeps = this.downstreamDependencies[componentName][varName];
      for (let depName in downDeps) {
        let dep = downDeps[depName];

        let downstreamComponentNames = dep.downstreamComponentNames;
        if (!downstreamComponentNames) {
          if (dep.downstreamComponentName) {
            downstreamComponentNames = [dep.downstreamComponentName];
          } else {
            continue;
          }
        }
        let downstreamVariableNames = dep.downstreamVariableNames;
        if (!downstreamVariableNames) {
          if (dep.downstreamVariableName) {
            downstreamVariableNames = [dep.downstreamVariableName];
          } else {
            continue;
          }
        }

        for (let cname of downstreamComponentNames) {
          for (let vname of downstreamVariableNames) {
            this.checkForCircularDependency({
              componentName: cname, varName: vname,
              previouslyVisited
            });
          }
        }
      }
    }
  }

  markStateVariableAndUpstreamDependentsStale({ component, varName }) {

    // console.log(`mark state variable ${varName} of ${component.componentName} and updeps stale`)

    let componentsTouched = [component.componentName];
    let stateVarObj = component.state[varName];

    // if don't have a getter set, this indicates that, before this markStale function,
    // stateVarObj was fresh.
    let varWasFresh = !(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)

    // record whether or not stateVarObj was partially fresh before we do any more processing
    // as we might change the attribute partiallyFresh from the result of markStale
    let varWasPartiallyFresh = stateVarObj.partiallyFresh;

    let foundVarChange = true;

    if (varWasFresh || varWasPartiallyFresh) {

      let result = this.processMarkStale({ component, varName });

      if (result.fresh) {
        foundVarChange = false;
      }

    }

    // check foundVarChange again, as it could have been
    // set to false when processing markStale
    if (foundVarChange) {

      // delete recursive dependency values, if they exist
      delete stateVarObj.recursiveDependencyValues;

      if (varWasFresh) {

        // save old value
        // mark stale by putting getter back in place to get a new value next time it is requested
        stateVarObj._previousValue = stateVarObj.value;
        delete stateVarObj.value;
        let getStateVar = this.getStateVariableValue;
        Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable: varName }), configurable: true });
      }

      // if stateVarObj was fresh (and also if stateVarObj was marked partiallyFresh before started processing),
      // we recurse on upstream dependents
      if (varWasFresh || varWasPartiallyFresh) {
        let additionalComponentsTouched = this.markUpstreamDependentsStale({ component, varName });
        componentsTouched.push(...additionalComponentsTouched)
      }
    }

    return componentsTouched;
  }

  processMarkStale({ component, varName }) {
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


    let stateVarObj = component.state[varName];

    let stateVarForMarkStale = stateVarObj;
    if (stateVarObj.isArrayEntry) {
      stateVarForMarkStale = component.state[stateVarObj.arrayStateVariable]
    }

    if (!stateVarForMarkStale.markStale) {
      return { fresh: false }
    }

    let changes = {};
    let downDeps = this.downstreamDependencies[component.componentName][varName];
    let previousValues = {};

    for (let depName in downDeps) {
      let dep = downDeps[depName];
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
        changes[depName] = depChanges;
      }
      let foundPreviousValues = false;
      let previousValuesForThisDep;

      let cNames = [];
      let multipleComponents = false;
      if (dep.downstreamComponentName) {
        cNames = [dep.downstreamComponentName];
      } else if (dep.downstreamComponentNames) {
        cNames = dep.downstreamComponentNames;
        multipleComponents = true;
        previousValuesForThisDep = [];
      }

      for (let cName of cNames) {
        let vNames = [];
        let multipleVariables = false;
        if (dep.downstreamVariableName) {
          vNames = [dep.downstreamVariableName];
        } else if (dep.downstreamVariableNames) {
          vNames = dep.downstreamVariableNames;
          multipleVariables = true;
        }

        let compState = this._components[cName].state;

        let prevValForThisComp;

        if (multipleVariables) {
          prevValForThisComp = { stateValues: {} };
        }

        for (let vName of vNames) {
          let stObj = compState[vName];

          if (!stObj) {
            continue;
          }

          foundPreviousValues = true;

          let prevVal = stObj._previousValue;

          let varWasFresh = !(Object.getOwnPropertyDescriptor(stObj, 'value').get || stObj.immutable);
          if (varWasFresh) {
            prevVal = stObj.value;
          }

          if (typeof prevVal === "object" && prevVal !== null) {
            prevVal = new Proxy(prevVal, readOnlyProxyHandler);
          }

          if (multipleVariables) {
            prevValForThisComp.stateValues[vName] = prevVal;
          } else {
            prevValForThisComp = prevVal;
          }

        }

        if (multipleComponents) {
          previousValuesForThisDep.push(prevValForThisComp);
        } else {
          previousValuesForThisDep = prevValForThisComp;
        }

      }

      if (foundPreviousValues) {
        previousValues[depName] = previousValuesForThisDep;
      }

    }

    let result = stateVarForMarkStale.markStale({
      freshnessInfo: stateVarForMarkStale.freshnessInfo,
      changes,
      arrayKeys: stateVarObj.arrayKeys,
      varName,  // include varName in case multiple state variables defined
      previousValues,
    });


    // if stateVarObj is partially fresh, we do want to recurse to upstream dependencies
    // we also want to mark stateVarObj as partiallyFresh so that if we reach stateVarObj
    // again while marking stale, we will still recurse on its dependencies
    // (needed because its getter will have been deleted, which is usually
    // the indication that we don't need to recurse)
    // 
    if (result.partiallyFresh) {
      stateVarObj.partiallyFresh = true;
    } else {
      delete stateVarObj.partiallyFresh;
    }
    return result;
  }

  markUpstreamDependentsStale({ component, varName }) {
    // Recursively mark every upstream dependency of component/varName as stale
    // If a state variable is already stale (has a getter in place)
    // then don't recurse
    // Before marking a stateVariable as stale, run markStale function, if it exists
    // Record additional information about the staleness from result of markStale,
    // and recurse only if markStale indicates variable is actually stale

    let componentsTouched = [];

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

          let ind = upDep.downstreamComponentNames.indexOf(componentName);
          if (ind === -1) {
            throw Error(`something went wrong as ${componentName} not a downstreamComponent of ${upDep.dependencyName}`);
          }

          // if have multiple components, there must be multiple variables
          // ensure that varName is one of them
          if (!upDep.downstreamVariableNames.includes(varName)) {
            throw Error(`something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`);
          }

          // records that component (index ind) and varName have changed
          if (!upDep.valuesChanged) {
            upDep.valuesChanged = [];
          }
          if (!upDep.valuesChanged[ind]) {
            upDep.valuesChanged[ind] = {};
          }
          if (!upDep.valuesChanged[ind][varName]) {
            upDep.valuesChanged[ind][varName] = {};
          }
          upDep.valuesChanged[ind][varName].potentialChange = true;

          // any any additional information about the stalename of component/varName
          if (freshnessInfo) {
            upDep.valuesChanged[ind][varName].freshnessInfo
              = new Proxy(freshnessInfo, readOnlyProxyHandler);
          }

          foundVarChange = true;

        } else {
          // if there is only one downstream component name, it must be the current component
          if (upDep.downstreamComponentName !== componentName) {
            throw Error(`something went wrong as ${componentName} not the downstreamComponent of ${upDep.dependencyName}`);
          }

          // with one downstream component, dependency could have one or multiple variables
          if (upDep.downstreamVariableName) {

            // if single downstream variable, it must be the current variable
            if (upDep.downstreamVariableName !== varName) {
              throw Error(`something went wrong as ${varName} not the downstreamVariable of ${upDep.dependencyName}`);
            }

            // record that componentName/varName have changed
            // and any additional stale information
            if (!upDep.valuesChanged) {
              upDep.valuesChanged = { [varName]: {} };
            }

            upDep.valuesChanged[varName].potentialChange = true;

            if (freshnessInfo) {
              upDep.valuesChanged[varName].freshnessInfo
                = new Proxy(freshnessInfo, readOnlyProxyHandler);
            }

            foundVarChange = true;

          } else if (upDep.downstreamVariableNames) {

            // if have multiple downstream variables (and only one component)
            // verify varName is one of the variables
            if (!upDep.downstreamVariableNames.includes(varName)) {
              throw Error(`something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`);

            }

            // record that componentName/varName have changed
            // and any additional stale information
            if (!upDep.valuesChanged) {
              upDep.valuesChanged = {};
            }
            if (!upDep.valuesChanged[varName]) {
              upDep.valuesChanged[varName] = {};
            }

            upDep.valuesChanged[varName].potentialChange = true;
            if (freshnessInfo) {
              upDep.valuesChanged[varName].freshnessInfo
                = new Proxy(freshnessInfo, readOnlyProxyHandler);
            }

            foundVarChange = true;
          }

        }

        if (foundVarChange) {

          componentsTouched.push(upDep.upstreamComponentName);

          let upVarName = upDep.upstreamVariableName;
          let upDepComponent = this._components[upDep.upstreamComponentName];
          let upVar = upDepComponent.state[upVarName];

          // if don't have a getter set, this indicates that, before this markStale function,
          // upVar was fresh.
          let upVarWasFresh = !(Object.getOwnPropertyDescriptor(upVar, 'value').get || upVar.immutable)

          // record whether or not upVar was partially fresh before we do any more processing
          // as we might change the attribute partiallyFresh from the result of markStale
          let upVarWasPartiallyFresh = upVar.partiallyFresh;

          if (upVarWasFresh || upVarWasPartiallyFresh) {

            let result = this.processMarkStale({
              component: upDepComponent,
              varName: upVarName,
            });

            if (result.fresh) {
              foundVarChange = false;
            }

          }


          // check foundVarChange again, as it could have been
          // set to false when processing markStale
          if (foundVarChange) {

            // delete recursive dependency values, if they exist
            delete upVar.recursiveDependencyValues;

            if (upVarWasFresh) {

              // save old value
              // mark stale by putting getter back in place to get a new value next time it is requested
              upVar._previousValue = upVar.value;
              delete upVar.value;
              Object.defineProperty(upVar, 'value', { get: () => getStateVar({ component: upDepComponent, stateVariable: upVarName }), configurable: true });
            }

            // if upVar was fresh (and also if upVar was marked partiallyFresh before started processing),
            // we recurse on upstream dependents
            if (upVarWasFresh || upVarWasPartiallyFresh) {
              let additionalComponentsTouched = this.markUpstreamDependentsStale({ component: upDepComponent, varName: upVarName });
              componentsTouched.push(...additionalComponentsTouched)
            }
          }

        }
      }
    }

    return componentsTouched;

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

  addChildren({ parent, indexOfDefiningChildren, newChildren }) {

    // TODO: this function has not been examined to see if it works
    // properly with new core setup


    // TODO: do we need check for circular add anymore?
    // We now have checkForCircularDependency, so maybe don't have to do
    // anything else when add children
    // throw error if parent is a downstream dependency of newChildren
    // this.checkForCircularAdd(parent, newChildren);

    this.spliceChildren(parent, indexOfDefiningChildren, newChildren);

    let newChildrenResult = this.processNewDefiningChildren({ parent });

    let addedComponents = {};
    let deletedComponents = {};

    newChildren.forEach(x => addedComponents[x.componentName] = x);

    this.updateRendererInstructions({ componentNames: [parent.componentName] });

    if (!newChildrenResult.success) {
      return newChildrenResult;
    }

    return {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
    }
  }

  processNewDefiningChildren({ parent, applySugar = false }) {

    this.parameterStack.push(parent.sharedParameters, false);
    let childResult = this.deriveChildResultsFromDefiningChildren(parent);
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

    childResult.componentsTouched = this.markChildAndDescendantDependenciesChanged(parent);

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
    let componentsTouched = [];

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

      for (let ind = parent.definingChildren.length - 1; ind >= 0; ind--) {
        let child = parent.definingChildren[ind];
        if (parentObj.definingChildrenNames.has(child.componentName)) {
          parent.definingChildren.splice(ind, 1);  // delete from array
        }
      }

      // with new defining children and adjusted replacements
      // determine if parent can accept the active children that result
      let childResult = this.processNewDefiningChildren({ parent });
      componentsTouched.push(...childResult.componentsTouched);

      if (!childResult.success) {
        console.log("***** can't delete because couldn't derive child results");
        goAheadAndDelete = false;
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
      for (let downDepName in replacementsDeleted) {
        let rdObj = replacementsDeleted[downDepName];
        let downDepComponent = this._components[downDepName];
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
        let childResult = this.processNewDefiningChildren({ parent });
        componentsTouched.push(...childResult.componentsTouched);
      }
      return { success: false, componentsTouched };
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

      this.deleteAllDownstreamDependencies(component);

      let additionalComponentsTouched = this.deleteAllUpstreamDependencies(component);
      componentsTouched.push(...additionalComponentsTouched);
    }

    for (let componentName in componentsToDelete) {
      let component = this._components[componentName];

      // don't use recursive form since all children should already be included
      this.deregisterComponent(component, false);

    }

    // remove deleted components from componentsTouched;
    componentsTouched = [... new Set(componentsTouched)].filter(x => !(x in componentsToDelete))

    return {
      success: true,
      deletedComponents: componentsToDelete,
      parentsOfDeleted: allParents,
      componentsTouched
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

        // TODO: recurse on ref of the component (other composites?)

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
    sourceOfUpdate }) {

    // TODO: this function is only partially converted to the new system


    // console.log("updateCompositeReplacements " + component.componentName);

    let deletedComponents = {};
    let addedComponents = {};
    let parentsOfDeleted = new Set();
    let componentsTouched = [];

    let proxiedComponent = this.components[component.componentName];

    if (!component.replacements) {
      component.replacements = [];
    }

    const replacementChanges = component.constructor.calculateReplacementChanges({
      component: proxiedComponent,
      componentChanges,
      components: this.components,
      workspace: component.replacementsWorkspace,
      getComponentNamesForProp: this.getComponentNamesForProp,
    });

    // console.log("replacement changes for " + component.componentName);
    // console.log(replacementChanges);
    // console.log(component.replacements.map(x=>x.componentName));
    // console.log(component.unresolvedState);
    // console.log(component.unresolvedDependencies);


    // iterate through all replacement changes
    for (let change of replacementChanges) {

      if (change.changeType === "add") {

        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        let unproxiedComponent = this._components[component.componentName];
        this.parameterStack.push(unproxiedComponent.sharedParameters, false);


        let newComponents;

        if (change.serializedReplacements) {

          let serializedReplacements = change.serializedReplacements;

          if (component.shadows) {
            if (!change.changeTopLevelReplacements) {
              throw Error(`Haven't implemented non-top level change in replacements for shadowed composite`);
            }

            // rather than using serializedReplacements
            // serialize the corresponding replacements of the shadowed composite
            // and add shadow dependencies
            let shadowedComposite = this._components[component.shadows.componentName];
            let firstIndex = change.firstReplacementInd;
            let lastIndex = firstIndex + serializedReplacements.length;
            let replacementsToShadow = shadowedComposite.replacements
              .filter((v, i) => i >= firstIndex && i < lastIndex);

            serializedReplacements = replacementsToShadow.map(x => x.serialize({ forReference: true }));

            let refComponentName = component.shadows.refComponentName;

            this.addShadowDependencies({
              serializedComponents: serializedReplacements,
              shadowedComponents: replacementsToShadow,
              refComponentName,
            });

          }

          let createResult = this.createIsolatedComponentsSub({
            serializedState: serializedReplacements,
            applySugar: true,
            ancestors: component.ancestors,
          });
          newComponents = createResult.components;

        } else if (change.replacementsWithInstructions) {

          let serializedReplacementsFromComponent;

          if (component.shadows) {

            let nReplacements = change.replacementsWithInstructions.reduce((a, c) => a + c.replacements.length, 0);
            let shadowedComposite = this._components[component.shadows.componentName];
            let firstIndex = change.firstReplacementInd;
            let lastIndex = firstIndex + nReplacements;
            let replacementsToShadow = shadowedComposite.replacements
              .filter((v, i) => i >= firstIndex && i < lastIndex);

            serializedReplacementsFromComponent = replacementsToShadow.map(x => x.serialize({ forReference: true }));

            let refComponentName = component.shadows.refComponentName;

            this.addShadowDependencies({
              serializedComponents: serializedReplacementsFromComponent,
              shadowedComponents: replacementsToShadow,
              refComponentName,
            })
          }

          newComponents = this.processReplacementsWithInstructions({
            replacementsWithInstructions: change.replacementsWithInstructions,
            serializedReplacementsFromComponent,
            component,
          })

        } else {
          throw Error(`Invalid replacement change.`)
        }


        this.parameterStack.pop();

        for (let comp of newComponents) {
          addedComponents[comp.componentName] = comp;

          // TODO: used to checkForDownstreamDependencies here
          // Is this needed for new system?
        }

        if (change.changeTopLevelReplacements === true) {
          let firstIndex = change.firstReplacementInd;
          let numberToDelete = change.numberReplacementsToReplace;
          let replacementsToDelete = component.replacements.slice(firstIndex, firstIndex + numberToDelete);

          let parent = this._components[component.parentName];

          // splice in new replacements
          component.replacements.splice(firstIndex, numberToDelete, ...newComponents);

          // record for top level replacement that they are a replacement of composite
          for (let comp of newComponents) {
            comp.replacementOf = component;
          }

          if (replacementsToDelete.length > 0) {
            let deleteResults = this.deleteComponents({
              components: replacementsToDelete,
              componentChanges: componentChanges,
              // sourceOfUpdate: sourceOfUpdate,
            });

            if (deleteResults.success === false) {
              throw Error("Couldn't delete components on composite update");
            }

            // note: already assigned to addComponents, above
            Object.assign(deletedComponents, deleteResults.deletedComponents);

            for (let parent of deleteResults.parentsOfDeleted) {
              parentsOfDeleted.add(parent.componentName);
            }
          }

          let newChange = {
            changeType: "addedReplacements",
            composite: component,
            newReplacements: newComponents,
            topLevel: true,
            firstIndex: firstIndex,
            numberDeleted: numberToDelete
          };

          componentChanges.push(newChange);


          let newChildrenResult = this.processNewDefiningChildren({
            parent,
            applySugar: true,
          });

          componentsTouched.push(...newChildrenResult.componentsTouched);

          componentsTouched.push(...this.componentAndRenderedDescendants(parent));

        } else {
          // if not top level replacements

          // TODO: check if change.parent is appropriate dependency of composite?

          let parent = this._components[change.parent.componentName];

          let addResults = this.addChildren({
            parent,
            indexOfDefiningChildren: change.indexOfDefiningChildren,
            newChildren: newComponents,
          });

          componentsTouched.push(...this.componentAndRenderedDescendants(parent));

          let newChange = {
            changeType: "addedReplacements",
            composite: component,
            newReplacements: newComponents,
          };

          componentChanges.push(newChange);

          Object.assign(deletedComponents, addResults.deletedComponents);
          Object.assign(addedComponents, addResults.addedComponents);

        }

      } else if (change.changeType === "delete") {

        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        let componentsToDelete;

        if (change.changeTopLevelReplacements === true) {
          let firstIndex = change.firstReplacementInd;
          let numberToDelete = change.numberReplacementsToDelete;
          componentsToDelete = component.replacements.slice(
            firstIndex, firstIndex + numberToDelete);
          // delete from replacements
          component.replacements.splice(firstIndex, numberToDelete);

          // TODO: why does this delete delete upstream components
          // but the non toplevel delete doesn't?
          let deleteResults = this.deleteComponents({
            components: componentsToDelete,
            componentChanges: componentChanges,
            sourceOfUpdate: sourceOfUpdate,
          });

          componentsTouched.push(...deleteResults.componentsTouched);

          if (deleteResults.success === false) {
            throw Error("Couldn't delete components on composite update");

          }

          for (let parent of deleteResults.parentsOfDeleted) {
            parentsOfDeleted.add(parent.componentName);
            componentsTouched.push(...this.componentAndRenderedDescendants(parent));
          }

          let deletedNamesByParent = {};
          for (let compName in deleteResults.deletedComponents) {
            let comp = deleteResults.deletedComponents[compName];
            let par = comp.parentName;
            if (deletedNamesByParent[par] === undefined) {
              deletedNamesByParent[par] = []
            }
            deletedNamesByParent[par].push(compName);
          }

          let newChange = {
            changeType: "deletedReplacements",
            composite: component,
            topLevel: true,
            firstIndex: firstIndex,
            numberDeleted: numberToDelete,
            deletedNamesByParent: deletedNamesByParent,
            deletedComponents: deleteResults.deletedComponents,
          };

          componentChanges.push(newChange);

          Object.assign(deletedComponents, deleteResults.deletedComponents);

          let parent = this._components[component.parentName];

          let newChildrenResult = this.processNewDefiningChildren({
            parent,
          });

          componentsTouched.push(...newChildrenResult.componentsTouched);
          componentsTouched.push(...this.componentAndRenderedDescendants(parent));

        } else {
          // if not change top level replacements

          componentsToDelete = change.components;

          let numberToDelete = componentsToDelete.length;

          // TODO: check if components are appropriate dependency of composite
          let deleteResults = this.deleteComponents({
            components: componentsToDelete,
            deleteUpstreamDependencies: false,
            componentChanges: componentChanges,
            sourceOfUpdate: sourceOfUpdate,
          });

          componentsTouched.push(...deleteResults.componentsTouched);

          if (deleteResults.success === false) {
            throw Error("Couldn't delete components prescribed by composite");
          }

          for (let parent of deleteResults.parentsOfDeleted) {
            parentsOfDeleted.add(parent.componentName);
            componentsTouched.push(...this.componentAndRenderedDescendants(parent));
          }

          let deletedNamesByParent = {};
          for (let compName in deleteResults.deletedComponents) {
            let comp = deleteResults.deletedComponents[compName];
            let par = comp.parentName;
            if (deletedNamesByParent[par] === undefined) {
              deletedNamesByParent[par] = []
            }
            deletedNamesByParent[par].push(compName);
          }

          let newChange = {
            changeType: "deletedReplacements",
            composite: component,
            numberDeleted: numberToDelete,
            deletedNamesByParent: deletedNamesByParent,
            deletedComponents: deleteResults.deletedComponents,
          };

          componentChanges.push(newChange);

          Object.assign(deletedComponents, deleteResults.deletedComponents);
          Object.assign(addedComponents, deleteResults.addedComponents);
        }


      } else if (change.changeType === "moveDependency") {

        // TODO: this is not converted to new system
        throw Error('moveDependency not implemented');

      } else if (change.changeType === "addDependency") {

        // TODO: this is not converted to new system
        throw Error('addDependency not implemented');

      } else if (change.changeType === "updateStateVariables") {


        // TODO: check if component is appropriate dependency of composite

        componentsTouched.push(change.component.componentName);

        let workspace = {};
        let newStateVariableValues = {};
        for (let stateVariable in change.stateChanges) {
          let instruction = {
            componentName: change.component.componentName,
            stateVariable,
            value: change.stateChanges[stateVariable],
            overrideFixed: true
          }

          let additionalChanges = this.requestComponentChanges({
            instruction, initialChange: false, workspace,
          });
          componentsTouched.push(...additionalChanges.componentsTouched);
          for (let cName in additionalChanges.newStateVariableValues) {
            if (!newStateVariableValues[cName]) {
              newStateVariableValues[cName] = {};
            }
            Object.assign(newStateVariableValues[cName], additionalChanges.newStateVariableValues[cName]);
          }
        }

        this.processNewStateVariableValues({ newStateVariableValues, componentsTouched });


      } else if (change.changeType === "changedReplacementsToWithhold") {

        // don't change actual array of replacements
        // but just change those that will get added to activeChildren


        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        let parent = this._components[component.parentName];

        let newChildrenResult = this.processNewDefiningChildren({
          parent,
          applySugar: true,
        });

        componentsTouched.push(...newChildrenResult.componentsTouched);

        componentsTouched.push(...this.componentAndRenderedDescendants(parent));

      }

    }

    let results = {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
      parentsOfDeleted: parentsOfDeleted,
      componentsTouched
    };

    // Object.assign(results, failures);
    return results;

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
    return this.allComponentClasses[baseComponentType].isPrototypeOf(inheritedComponentType);
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

  requestUpdate({ updateType, updateInstructions, saveSerializedState }) {

    let returnValue = { success: true };

    if (updateType === "updateValue") {
      let componentsTouched = [];
      let newStateVariableValues = {};
      let workspace = {};

      let originalComponents = [];

      for (let instruction of updateInstructions) {

        let additionalChanges = this.requestComponentChanges({ instruction, workspace });
        componentsTouched.push(...additionalChanges.componentsTouched);
        for (let cName in additionalChanges.newStateVariableValues) {
          if (!newStateVariableValues[cName]) {
            newStateVariableValues[cName] = {};
          }
          Object.assign(newStateVariableValues[cName], additionalChanges.newStateVariableValues[cName]);
        }

        originalComponents.push(instruction.componentName);
      }

      if (this.externalFunctions.localStateChanged) {
        // TODO: make this call asynchronous
        this.externalFunctions.localStateChanged({
          newStateVariableValues,
          contentId: this.contentId,
          sourceOfUpdate: {
            originalComponents
          }
        });
      }

      this.executeUpdateStateVariables({
        newStateVariableValues,
        componentsTouched,
        saveSerializedState,
        sourceOfUpdate: {
          originalComponents,
          local: true,
        }
      });

    }
    else if (updateType === "updateRendererOnly") {
      this.coreUpdatedCallback({ doenetTags: this._renderComponents });
    }

    return returnValue;
  }

  executeUpdateStateVariables({ newStateVariableValues, componentsTouched,
    saveSerializedState = true, sourceOfUpdate
  }) {

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


    let saveSerializedStateImmediately = false;

    if (componentsTouched === undefined) {
      componentsTouched = Object.keys(newStateVariableValues);
    }

    this.processNewStateVariableValues({ newStateVariableValues, componentsTouched });

    // get unique list of components touched
    componentsTouched = new Set(componentsTouched);

    // calculate any replacement changes on composites touched
    let componentChanges = this.replacementChangesFromComponentsTouched(componentsTouched);

    this.updateRendererInstructions({ componentNames: componentsTouched, sourceOfUpdate });


    this.finishUpdate();

    console.log("**** Components after updateValue");
    console.log(this._components);

    if (sourceOfUpdate !== undefined && sourceOfUpdate.instructionsByComponent !== undefined) {
      let updateKeys = Object.keys(sourceOfUpdate.instructionsByComponent);
      if (updateKeys.length === 1 && updateKeys[0] === this.documentName) {
        saveSerializedStateImmediately = true;
      }
    }


    // TODO: implement saving serialized state

    // if (saveSerializedState) {
    //   if (saveSerializedStateImmediately) {
    //     this.externalFunctions.saveSerializedState({
    //       document: this.components[this.documentName],
    //       contentId: this.contentId,
    //     })
    //   } else {
    //     this.externalFunctions.delayedSaveSerializedState({
    //       document: this.components[this.documentName],
    //       contentId: this.contentId,
    //     })
    //   }
    // }

  }

  replacementChangesFromComponentsTouched(componentsTouched) {
    let componentChanges = []; // TODO: what to do with componentChanges?
    let additionalComponentsTouched = [...componentsTouched];
    while (additionalComponentsTouched.length > 0) {
      let newTouched = [];
      for (let cName of additionalComponentsTouched) {
        if (this._components[cName] instanceof this.allComponentClasses._composite) {
          let result = this.updateCompositeReplacements({
            component: this._components[cName],
            componentChanges
          });
          if (result.componentsTouched) {
            newTouched.push(...result.componentsTouched);
          }

          for (let componentName in result.addedComponents) {
            this.changedStateVariables[componentName] = new Set(Object.keys(this._components[componentName].state));
          }
        }
      }
      newTouched = new Set(newTouched);
      additionalComponentsTouched = [];
      for (let cName of newTouched) {
        if (!componentsTouched.has(cName)) {
          componentsTouched.add(cName);
          additionalComponentsTouched.push(cName);
        }
      }
    }

    return componentChanges;
  }

  processNewStateVariableValues({ newStateVariableValues, componentsTouched }) {

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

        if (vName[0] === "_") {
          // have an array where set specific keys
          let newValueInfo = newComponentStateVariables[vName];
          let arrayVarObj = comp.state[newValueInfo.stateVariable];
          if (arrayVarObj === undefined) {
            console.warn(`can't update state variable ${vName} of component ${cName}, as it doesn't exist.`);
            continue;
          }

          arrayVarObj.setArrayValue({
            value: newValueInfo.value,
            arrayKey: newValueInfo.arrayKey
          });

          for (let arrayVarName of arrayVarObj.allVarNamesThatIncludeArrayKey(newValueInfo.arrayKey)) {
            if (comp.state[arrayVarName]) {
              // arrayVarName might not actually be a state variable created in comp
              // delete value before assigning new value to remove any getter
              delete comp.state[arrayVarName].value;
              if (arrayVarName === arrayVarObj.arrayVarNameFromArrayKey(newValueInfo.arrayKey)) {
                // this is the variable that corresponds exactly to the value set
                // so can just give it the new value
                comp.state[arrayVarName].value = newValueInfo.value;
              }
              else {
                // this variable presumably includes other array keys
                // so just put a getter on
                Object.defineProperty(comp.state[arrayVarName], 'value', { get: () => getStateVar({ component: comp, stateVariable: arrayVarName }), configurable: true });
              }
              let additionalComponentsTouched = this.markUpstreamDependentsStale({
                component: comp, varName: arrayVarName
              });
              componentsTouched.push(...additionalComponentsTouched);

              this.recordActualChangeInUpstreamDependencies({
                component: comp, varName: arrayVarName,
              })

            }
          }

          // don't have to make array state variable itself stale
          // at its value is set to be arrayValues, which was changed with setArrayValue
          // Just need to set any variable upstream of the entire
          // array state variable stale
          // TODO: should this be more refined to be specific to the fact
          // that just arrayKey changed?
          let additionalComponentsTouched = this.markUpstreamDependentsStale({
            component: comp, varName: newValueInfo.stateVariable
          });
          componentsTouched.push(...additionalComponentsTouched);


        }
        else {

          let compStateObj = comp.state[vName];
          if (compStateObj === undefined) {
            console.warn(`can't update state variable ${vName} of component ${cName}, as it doesn't exist.`);
            continue;
          }
          // get value of state variable so it will determine if essential
          compStateObj.value;
          if (!compStateObj.essential && !compStateObj.isArray) {
            console.warn(`can't update state variable ${vName} of component ${cName}, as it is not an essential state variable.`);
            continue;
          }

          compStateObj._previousValue = compStateObj.value;

          // delete value before assigning new value to remove any getter
          delete compStateObj.value;
          if (compStateObj.set) {
            compStateObj.value = compStateObj.set(newComponentStateVariables[vName]);
          } else {
            compStateObj.value = newComponentStateVariables[vName];
          }
          let additionalComponentsTouched = this.markUpstreamDependentsStale({
            component: comp, varName: vName
          });
          componentsTouched.push(...additionalComponentsTouched);

          this.recordActualChangeInUpstreamDependencies({
            component: comp, varName: vName,
          })

        }
      }
    }
  }

  requestComponentChanges({ instruction, initialChange = true, workspace }) {

    // console.log(`request component changes`);
    // console.log(instruction);
    // console.log('overall workspace')
    // console.log(JSON.parse(JSON.stringify(workspace)))

    let component = this._components[instruction.componentName];
    let stateVariable = instruction.stateVariable;

    if (workspace[instruction.componentName] === undefined) {
      workspace[instruction.componentName] = {};
    }


    let inverseDefinitionArgs = this.getStateVariableDependencyValues({ component, stateVariable });
    inverseDefinitionArgs.componentInfoObjects = this.componentInfoObjects;
    inverseDefinitionArgs.initialChange = initialChange;
    inverseDefinitionArgs.stateValues = component.stateValues;
    inverseDefinitionArgs.overrideFixed = instruction.overrideFixed;

    let stateVarObj = component.state[stateVariable];
    let inverseDefinitionFunction = stateVarObj.inverseDefinition;

    let stateVariableForWorkspace = stateVariable;

    if (stateVarObj.isArrayEntry) {
      let arrayStateVariable = stateVarObj.arrayStateVariable;
      inverseDefinitionFunction = component.state[arrayStateVariable].inverseDefinition;
      stateVariableForWorkspace = arrayStateVariable;

      let desiredValuesForArray = {};
      if (stateVarObj.arrayKeys.length === 1) {
        desiredValuesForArray[stateVarObj.arrayKeys[0]] = instruction.value
      } else {
        for (let [ind, arrayKey] of stateVarObj.arrayKeys) {
          desiredValuesForArray[arrayKey] = instruction.value[ind];
        }
      }
      inverseDefinitionArgs.desiredStateVariableValues = { [arrayStateVariable]: desiredValuesForArray };
      inverseDefinitionArgs.arrayKeys = stateVarObj.arrayKeys;

    } else {
      inverseDefinitionArgs.desiredStateVariableValues = { [stateVariable]: instruction.value };
    }

    let stateVariableWorkspace = workspace[instruction.componentName][stateVariableForWorkspace];
    if (stateVariableWorkspace === undefined) {
      stateVariableWorkspace = workspace[instruction.componentName][stateVariableForWorkspace] = {};
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


    let componentsTouched = [component.componentName];
    let newStateVariableValues = {};

    if (!inverseDefinitionFunction) {
      console.warn(`Cannot change state variable ${stateVariable} of ${component.componentName} as it doesn't have an inverse definition`);
      return { newStateVariableValues, componentsTouched };
    }

    if (component.stateValues.fixed && !instruction.overrideFixed) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed because fixed is true.`);
      return { newStateVariableValues, componentsTouched };
    }

    if (!(initialChange || component.stateValues.modifyIndirectly !== false)) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed because modifyIndirectly is false.`);
      return { newStateVariableValues, componentsTouched };
    }

    let inverseResult = inverseDefinitionFunction(inverseDefinitionArgs);

    if (!inverseResult.success) {
      console.log(`Changing ${stateVariable} of ${component.componentName} did not succeed.`);
      return { newStateVariableValues, componentsTouched };
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
        if ("arrayKey" in newInstruction) {
          newStateVariableValues[component.componentName]['_' + newInstruction.setStateVariable + '_' + newInstruction.arrayKey] = {
            stateVariable: newInstruction.setStateVariable,
            arrayKey: newInstruction.arrayKey,
            value: newInstruction.value
          }
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
          let varName = dep.downstreamVariableNames[newInstruction.variableIndex];
          if (!varName) {
            throw Error(`Invalid inverse definition of ${stateVariable} of ${component.componentName}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist.`)
          }
          let inst = {
            componentName: cName,
            stateVariable: varName,
            value: newInstruction.desiredValue,
            overrideFixed: instruction.overrideFixed,
            arrayKey: newInstruction.arrayKey
          }
          let additionalChanges = this.requestComponentChanges({
            instruction: inst, initialChange: false, workspace,
          });
          componentsTouched.push(...additionalChanges.componentsTouched);
          for (let cName in additionalChanges.newStateVariableValues) {
            if (!newStateVariableValues[cName]) {
              newStateVariableValues[cName] = {};
            }
            Object.assign(newStateVariableValues[cName], additionalChanges.newStateVariableValues[cName]);
          }
        } else if (["componentStateVariable", "stateVariable", "parentStateVariable"].includes(dep.dependencyType)) {
          let inst = {
            componentName: dep.downstreamComponentName,
            stateVariable: dep.downstreamVariableName,
            value: newInstruction.desiredValue,
            overrideFixed: instruction.overrideFixed,
            arrayKey: newInstruction.arrayKey
          };
          if (newInstruction.additionalDependencyValues) {
            // it is possible to simultaneously set the values of multiple
            // component state variables, if they share a definition
            // i.e. are in additionalStateVariablesDefined

            let stateVarObj = this.components[dep.downstreamComponentName].state[dep.downstreamVariableName]
            for (let depName2 in newInstruction.additionalDependencyValues) {
              let dep2 = this.downstreamDependencies[component.componentName][stateVariable][depName2];
              if (!["componentStateVariable", "stateVariable", "parentStateVariable"].includes(dep2.dependencyType)) {
                console.warn(`Can't simultaneously set additional dependency value ${depName2} if it isn't a state variable`);
                continue;
              }

              let varName2 = dep2.downstreamVariableName;
              if (dep2.downstreamComponentName !== dep.downstreamComponentName ||
                !stateVarObj.additionalStateVariablesDefined.includes(varName2)
              ) {
                console.warn(`Can't simultaneously set additional dependency value ${depName2} if it doesn't correspond to additional state variable defined of ${depName}'s state variable`);
                continue;
              }
              if (!inst.additionalStateVariableValues) {
                inst.additionalStateVariableValues = {};
              }
              inst.additionalStateVariableValues[varName2] = newInstruction.additionalDependencyValues[depName2]
            }

          }
          let additionalChanges = this.requestComponentChanges({
            instruction: inst, initialChange: false, workspace
          });
          componentsTouched.push(...additionalChanges.componentsTouched);
          for (let cName in additionalChanges.newStateVariableValues) {
            if (!newStateVariableValues[cName]) {
              newStateVariableValues[cName] = {};
            }
            Object.assign(newStateVariableValues[cName], additionalChanges.newStateVariableValues[cName]);
          }
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

          let varName = dep.downstreamVariableNames[newInstruction.variableIndex];
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

    return { newStateVariableValues, componentsTouched };
  }

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
          let varName = dep.downstreamVariableNames[newInstruction.variableIndex];
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
  }

  return value;
}
