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

// string to componentClass: this.allComponentClasses["string"]
// componentClass to string: componentClass.componentType
// validTags: Object.keys(this.standardComponentClasses);


export default class Core {
  constructor({ doenetML, doenetState, update, parameters, requestedVariant,
    externalFunctions, flags = {}, postConstructionCallBack }) {
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

    this.update = update;
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
    this.postConstructionCallBack = postConstructionCallBack;

    // console.time('serialize doenetML');

    this.parameterStack = new ParameterStack(parameters);
    this.setUpRng();


    this.idRng = new MersenneTwister('47');

    let serializedState;

    if (doenetState) {
      serializedState = doenetState;
      this.finishCoreConstruction({ fullSerializedStates: [serializedState], finishSerializedStateProcessing: false });
    } else {
      this.expandDoenetMLsToFullSerializedState({
        doenetMLs: [doenetML],
        callBack: this.finishCoreConstruction
      })
    }
  }

  finishCoreConstruction({
    fullSerializedStates,
    finishSerializedStateProcessing = true,
    calledAsynchronously = false
  }) {

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

    this._components = {};
    this.downstreamDependencies = {};
    this.upstreamDependencies = {};

    this._renderComponents = [];
    this._renderComponentsByName = {};
    this._graphRenderComponents = [];

    this.descendantDependenciesByAncestor = {};
    this.ancestorDependenciesByDescendant = {};

    this.childLogicWaitingOnSugar = {};

    // console.timeEnd('serialize doenetML');

    this.setUpVariants(serializedState);

    //Make these variables available for cypress
    window.state = { components: this._components, downstreamDependencies: this.downstreamDependencies, upstreamDependencies: this.upstreamDependencies, core: this }

    this.addComponents({
      serializedState: serializedState,
      initialAdd: true,
      applySugar: true,
    })

    // console.log(serializedState)
    // console.timeEnd('start up time');
    console.log("** components at the end of the core constructor **");
    console.log(this._components);

    this.postConstructionCallBack({
      doenetTags: this.doenetState,
      init: !calledAsynchronously,
    })

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

  expandDoenetMLsToFullSerializedState({ doenetMLs, callBack }) {

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

        callBack({
          fullSerializedStates: serializedStates,
          calledAsynchronously: true,
        })
      }.bind(this);

      let recurseToAdditionalDoenetMLs = function ({ newDoenetMLs, success, message }) {

        if (!success) {
          console.warn(message);
        }

        this.expandDoenetMLsToFullSerializedState({
          doenetMLs: newDoenetMLs,
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
      parentName,
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
      this.updateRenderers({ componentNames: [newComponents[0].componentName] });
      this.document = newComponents[0];

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

  //Add on to array of components that render things
  rebuildRenderComponents(component = this._components[this.documentName], init = true) {

    if (init === true) {
      // empty the array and object without reassigning
      // so that components still have access to them
      this._renderComponents.length = 0;
      for (let key in this._renderComponentsByName) {
        delete this._renderComponentsByName[key];
      }
      this._graphRenderComponents.length = 0;
    }

    // console.log(component.componentType);
    // console.log(component.componentIsAProperty);
    // console.log("--");

    if (!component.stateValues.hide &&
      component.renderer !== undefined &&
      component.componentIsAProperty === false
    ) {

      let unproxiedComponent = this._components[component.componentName];

      if (unproxiedComponent instanceof this._allComponentClasses.graph) {
        this._graphRenderComponents.push(unproxiedComponent.renderer);
      }
      this._renderComponentsByName[unproxiedComponent.componentName] = unproxiedComponent.renderer;

      let childRenderers = [];

      if (unproxiedComponent.stateValues.childrenWhoRender) {
        for (let childName of unproxiedComponent.stateValues.childrenWhoRender) {
          let child = this._components[childName];
          if (child !== undefined) {
            let cr = this.rebuildRenderComponents(child, false);
            if (cr !== undefined) {
              childRenderers.push(cr);
            }
          }
        }
      }

      unproxiedComponent.renderer.childRenderers = childRenderers;

      if (init) {
        this._renderComponents.push(unproxiedComponent.renderer);
      }

      return unproxiedComponent.renderer;
    }
  }

  updateRenderers({ componentNames, sourceOfUpdate, recurseToChildren = true }) {
    for (let name of componentNames) {
      let unproxiedComponent = this._components[name];
      if (unproxiedComponent !== undefined) {
        // could be undefined if deleted since last updated
        if (unproxiedComponent.renderer === undefined) {
          unproxiedComponent.initializeRenderer({ sourceOfUpdate: sourceOfUpdate });
        } else {
          unproxiedComponent.updateRenderer({ sourceOfUpdate: sourceOfUpdate });
        }


        if (recurseToChildren && unproxiedComponent.stateValues.childrenWhoRender &&
          unproxiedComponent.stateValues.childrenWhoRender.length > 0
        ) {
          this.updateRenderers({
            componentNames: unproxiedComponent.stateValues.childrenWhoRender,
            sourceOfUpdate: sourceOfUpdate,
            recurseToChildren: true
          });
        }
      }
    }
  }

  componentAndRenderedDescendants(component) {
    let componentNames = [component.componentName];
    if (component.stateValues.childrenWhoRender) {
      for (let childName of component.stateValues.childrenWhoRender) {
        componentNames.push(...this.componentAndRenderedDescendants(this._components[childName]));
      }
    }
    return componentNames;
  }

  createIsolatedComponents({ serializedState, parentName, ancestors, applySugar = false,
    applyAdapters = true, shadow = false }
  ) {

    this.unresolvedDependencies = {};
    this.unresolvedByDependent = {};

    let createResult = this.createIsolatedComponentsSub({
      serializedState: serializedState,
      parentName, ancestors,
      applySugar, applyAdapters,
      shadow,
    });

    console.log("createResult")
    console.log(createResult)

    let newComponents = createResult.components;

    // set ancestors within group so upstream updates will work
    // newComponents.forEach(x => this.setAncestors(x));

    // let result = this.upstreamUpdate({ initialFailures: createResult });

    // if (result.success) {
    //   result.components = newComponents;
    // }



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

  createIsolatedComponentsSub({ serializedState, parentName, ancestors, applySugar = false,
    applyAdapters = true, shadow = false }
  ) {

    let newComponents = [];

    //TODO: last message
    let lastMessage = "";

    // let failures = {
    //   numUnresolvedStateVariables: {},
    //   unresolvedComponents: new Set([]),
    //   unsatisifiedChildLogic: new Set([]),
    //   unresolvedByDependent: {},
    // }

    for (let serializedComponent of serializedState) {

      // if already corresponds to a created component
      // add to array
      if (serializedComponent.createdComponent === true) {
        let newComponent = this._components[serializedComponent.componentName];
        newComponents.push(newComponent);
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
        parentName, ancestors,
        componentClass, applySugar,
        applyAdapters, shadow,
      });

      let newComponent = createResult.newComponent;
      newComponents.push(newComponent);


      // mergeFailures(failures, createResult);

      // TODO: need to get message
      //lastMessage = createResult.lastMessage;

      // if added downstream dependencies to new component,
      // add them as upstream dependencies to target
      // for (let downDepComponentName in newComponent.downstreamDependencies) {

      //   let downDep = newComponent.downstreamDependencies[downDepComponentName];
      //   let upDep = Object.assign({}, downDep);
      //   delete upDep.downstreamComponent;
      //   let unproxiedComponent = this._components[downDepComponentName];
      //   unproxiedComponent.upstreamDependencies[newComponent.componentName] = upDep;
      // }

    }

    let results = { components: newComponents };
    // Object.assign(results, failures);
    return results;

  }

  createChildrenThenComponent({ serializedComponent, componentName, parentName,
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
            parentName: componentName,
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
          parentName: componentName,
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
            parentName: componentName,
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
          parentName: componentName,
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
    });


    // create component itself
    let newComponent = new componentClass({
      componentName,
      parentName, ancestors,
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
      styleDefinitions: this.styleDefinitions,
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

    readyToExpand = component.state.readyToExpandWhenResolved.isResolved
    if (!readyToExpand) {
      return { success: false };
    }

    console.log(`expanding composite ${component.componentName}`);

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
      parentName: component.parentName,
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
        parentName: component.parentName,
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
            parentName: component.parentName,
            ancestors: component.ancestors,
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

    component.childLogic.usedSugar = true;

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


    for (let change of sugarResults.baseChanges) {
      let result = this.replaceDefiningChildrenBySugar({
        component,
        sugarResults: change,
      });

    }

    this.deriveChildResultsFromDefiningChildren(component);

    if (!component.childLogicSatisfied) {
      // TODO: handle case where child logic is no longer satisfied
      console.error(`Child logic of ${component.componentName} is not satisfied after applying sugar`)
    }

    this.markChildAndDescendantDependenciesChanged(component);

    if (sugarResults.childChanges === undefined) {
      return;
    }

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

      this.deriveChildResultsFromDefiningChildren(child);

      if (!component.childLogicSatisfied) {
        // TODO: handle case where child logic is no longer satisfied
        console.error(`Child logic of ${component.componentName} is not satisfied after applying sugar`)
      }

      this.markChildAndDescendantDependenciesChanged(child);

    }

  }

  replaceDefiningChildrenBySugar({ component, sugarResults }) {

    // delete the string children specified by childrenToDelete
    if (sugarResults.childrenToDelete !== undefined) {
      for (let childName of sugarResults.childrenToDelete) {
        if (Object.keys(this.downstreamDependencies[childName]).length > 0) {
          throw Error(`Need to implement deleting dependencies when deleting string via sugar`)
        }
        // upstream dependencies should be from parent
        // but we'll need to recompute those dependencies anyway

        // TODO: do we deal with case when component has been reffed
        // and sugar is applied afterwards, as that means string could have
        // other upstream dependencies?

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
      parentName: component.componentName,
      ancestors: ancestorsForChildren,
    });

    this.parameterStack.pop();

    // insert the replacments in definingChildren
    component.definingChildren.splice(sugarResults.firstDefiningIndex,
      sugarResults.nDefiningIndices, ...childrenResult.components);

    return childrenResult;

  }

  createStateVariableDefinitions({ childLogic, componentClass, prescribedDependencies }) {

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
    let newDefinitions = componentClass.returnStateVariableDefinitions({
      propertyNames: Object.keys(stateVariableDefinitions),
    });


    let cleanAdditionalStateVariableDefined = function (additionalStateVariablesDefined) {
      for (let [ind, varObj] of additionalStateVariablesDefined.entries()) {
        if (typeof varObj === "object") {
          additionalStateVariablesDefined[ind] = varObj.variableName
        }
      }
    }
    let defAttributesToCopy = [
      "returnDependencies", "definition",
      "inverseDefinition", "stateVariablesDeterminingDependencies"
    ];

    for (let varName in newDefinitions) {
      let thisDef = newDefinitions[varName];
      stateVariableDefinitions[varName] = thisDef;

      if (thisDef.additionalStateVariablesDefined) {
        for (let [ind, otherVarObj] of thisDef.additionalStateVariablesDefined.entries()) {
          let defCopy = {};
          for (let attr of defAttributesToCopy) {
            defCopy[attr] = thisDef[attr];
          }
          defCopy.additionalStateVariablesDefined = [...thisDef.additionalStateVariablesDefined];
          defCopy.additionalStateVariablesDefined[ind] = varName;
          cleanAdditionalStateVariableDefined(defCopy.additionalStateVariablesDefined);

          let otherVarName = otherVarObj;

          // if otherVarObj is actually an object (rather than a string)
          // then get variableName and assign other attributes 
          // to the copied state variable definition
          if (typeof otherVarObj === "object") {
            otherVarName = otherVarObj.variableName;
            delete otherVarObj.variableName;
            Object.assign(defCopy, otherVarObj);
          }

          stateVariableDefinitions[otherVarName] = defCopy;

        }

        cleanAdditionalStateVariableDefined(thisDef.additionalStateVariablesDefined);

      }

    }

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

    return stateVariableDefinitions;
  }

  createPropertyStateVariableDefinitions({ childLogic, ancestorProps, stateVariableDefinitions }) {
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let childLogicName = '_property_' + property;
      let componentType = propertySpecification.componentName ? propertySpecification.componentName : property;
      let defaultValue = propertySpecification.default;
      // let deleteIfUndefined = defaultValue === undefined && propertySpecification.deleteIfUndefined;
      let propertyClass = this.allComponentClasses[property.toLowerCase()];
      let stateVariableForPropertyValue = propertyClass.stateVariableForPropertyValue;
      if (stateVariableForPropertyValue === undefined) {
        stateVariableForPropertyValue = "value";
      }
      let returnDependencies, definition, inverseDefinition;
      if (property in ancestorProps) {
        returnDependencies = () => ({
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
        });
        definition = function ({ dependencyValues, usedDefault }) {
          let propertyChildVariables = dependencyValues[childLogicName];
          if (propertyChildVariables.length === 0) {
            if (!usedDefault.ancestorProp) {
              return { newValues: { [property]: dependencyValues.ancestorProp } }
            } else {
              return {
                useEssentialOrFallbackValue: {
                  [property]: {
                    variablesToCheck: property,
                    valueIfNotEssential: dependencyValues.ancestorProp,
                    treatAsDefault: true,
                  }
                }
              };
            }
          }
          let childVariable = validatePropertyValue({
            value: propertyChildVariables[0].stateValues[stateVariableForPropertyValue],
            propertySpecification, property
          })

          return { newValues: { [property]: childVariable } };
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
          return {
            success: true,
            instructions: [{
              setDependency: childLogicName,
              desiredValue: [desiredStateVariableValues[property]],
              childIndex: 0,
            }]
          };
        };
      }
      else {
        // usual case of property with no ancestor property being propagated
        returnDependencies = () => ({
          [childLogicName]: {
            dependencyType: "childStateVariables",
            childLogicName: childLogicName,
            variableNames: [stateVariableForPropertyValue],
            markChildrenAsProperties: true,
          },
        });
        definition = function ({ dependencyValues }) {
          let propertyChildVariables = dependencyValues[childLogicName];
          if (propertyChildVariables.length === 0) {
            return {
              useEssentialOrDefaultValue: {
                [property]: { variablesToCheck: property }
              }
            };
          }
          let childVariable = validatePropertyValue({
            value: propertyChildVariables[0].stateValues[stateVariableForPropertyValue],
            propertySpecification, property
          })
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
          return {
            success: true,
            instructions: [{
              setDependency: childLogicName,
              desiredValue: [desiredStateVariableValues[property]],
              variableIndex: 0,
              childIndex: 0,
            }]
          };
        };
      }
      stateVariableDefinitions[property] = {
        public: true,
        componentType,
        isProperty: true,
        defaultValue,
        // deleteIfUndefined,
        // required: propertySpecification.required, // TODO: how do we do required?
        returnDependencies,
        definition,
        inverseDefinition
      };
    }
  }

  createAdapterStateVariableDefinitions({ redefineDependencies, childLogic, stateVariableDefinitions, componentClass }) {
    let adapterTargetComponent = this._components[redefineDependencies.adapterTargetName];

    // properties depend on adapterTarget (if exist in adapterTarget)
    for (let property in childLogic.properties) {
      let propertySpecification = childLogic.properties[property];
      let componentType = propertySpecification.componentName ? propertySpecification.componentName : property;
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
      let componentType = propertySpecification.componentName ? propertySpecification.componentName : property;
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
                useEssentialOrFallbackValue: {
                  [property]: {
                    variablesToCheck: property,
                    valueIfNotEssential: dependencyValues.ancestorProp,
                    treatAsDefault: true,
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
      stateDef.definition = function ({ dependencyValues }) {
        return { newValues: { [primaryStateVariableForDefinition]: dependencyValues.refTargetVariable } };
      };
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

    let stateVariablesToShadow = refTargetComponent.stateVariablesForReference;
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


    for (let varName of stateVariablesToShadow) {
      let stateDef = stateVariableDefinitions[varName];

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

      let childLogicComponent = childLogic.logicComponents[childLogicName];

      if (childLogicComponent.sugarDependencies) {
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
          returnDependencies: () => childLogicComponent.sugarDependencies,
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

    stateVarObj.isArrayEntry = true;
    stateVarObj.arrayStateVariable = arrayStateVariable;
    stateVarObj.arrayKeys = arrayKeys;
    stateVarObj.markStale = component.state[arrayStateVariable].markStale;
    let arrayStateVarObj = component.state[arrayStateVariable];

    if (!arrayStateVarObj.arrayEntryNames) {
      arrayStateVarObj.arrayEntryNames = [];
    }
    arrayStateVarObj.arrayEntryNames.push(stateVariable);

    // Note: getValueFromArrayValues assumes that arrayValues has been populated
    if (arrayStateVarObj.getEntryValues) {
      stateVarObj.getValueFromArrayValues = function ({ overridesByKey } = {}) {
        return arrayStateVarObj.getEntryValues({
          varName: stateVariable,
          overridesByKey
        });
      };
    }
    else {
      stateVarObj.getValueFromArrayValues = function ({ overridesByKey } = {}) {
        let value = [];
        for (let arrayKey of stateVarObj.arrayKeys) {
          if (overridesByKey && arrayKey in overridesByKey) {
            value.push(overridesByKey[arrayKey]);
          }
          else {
            value.push(arrayStateVarObj.getArrayValue({ arrayKey }));
          }
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
    // this function used for initializing original array variables
    // (not array entry variables)

    stateVarObj.arrayValues = [];
    stateVarObj.staleByKey = {};
    // key is key for a 1D array so that core doesn't have to worry about dimensions
    // index is multi-index for the possibly multi-dimensional arrayValues array
    if (stateVarObj.nDimensions > 1) {
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
      stateVarObj.keyToIndex = key => Number(key);
      stateVarObj.setArrayValue = function ({ value, arrayKey }) {
        stateVarObj.arrayValues[arrayKey] = value;
      };
      stateVarObj.getArrayValue = function ({ arrayKey }) {
        return stateVarObj.arrayValues[arrayKey];
      };
    }
    stateVarObj.indexToKey = index => String(index);
    if (!stateVarObj.getArrayKeysFromVarName) {
      stateVarObj.getArrayKeysFromVarName = function ({ varEnding }) {
        return [String(Number(varEnding) - 1)];
      };
    }
    if (!stateVarObj.arrayVarNameFromArrayKey) {
      stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
        return stateVarObj.entryPrefixes[0] + String(Number(arrayKey) + 1);
      };
    }
    if (!stateVarObj.allVarNamesThatIncludeArrayKey) {
      stateVarObj.allVarNamesThatIncludeArrayKey = function (arrayKey) {
        return [stateVarObj.entryPrefixes[0] + String(Number(arrayKey) + 1)];
      };
    }
    if (!component.arrayEntryPrefixes) {
      component.arrayEntryPrefixes = {};
    }
    for (let prefix of stateVarObj.entryPrefixes) {
      component.arrayEntryPrefixes[prefix] = stateVariable;
    }
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
          stateVariablesDeterminingDependencies: stateVarObj.stateVariablesDeterminingDependencies,
          additionalStateVariablesDefined: stateVarObj.additionalStateVariablesDefined
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
          childLogic: component.childLogic,
          componentInfoObjects: this.componentInfoObjects,
          sharedParameters: component.sharedParameters,
          shadows: component.shadows,
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
  }

  setUpDependenciesOfArrayEntries({ component, dependencyOverride, stateVariable, stateValues }) {
    let stateVarObj = component.state[stateVariable];

    let setUpArrayEntryDependencies = function (varName) {

      let dependencies = dependencyOverride;
      if (!dependencies) {
        let arrayKeys = component.state[varName].arrayKeys;
        dependencies = stateVarObj.returnDependencies({
          childLogic: component.childLogic,
          arrayKeys,
          componentInfoObjects: this.componentInfoObjects,
          sharedParameters: component.sharedParameters,
          shadows: component.shadows,
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
            // if the dependency depend on other downstream components
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

        let varNames;
        if (dep.dependencyType === "childStateVariables") {
          if (!Array.isArray(dep.variableNames)) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableNames must be an array`)
          }
          varNames = newDep.downstreamVariableNames = dep.variableNames;
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
            valuesChanged.push(dep.variableNames);
          }
          newDep.downstreamComponentNames = children;
          if (dep.dependencyType === "childStateVariables") {
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
            for (let varName of varNames) {
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
              valueChanged: true,
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

        newDep.ancestor = ancestor;

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
        } else {
          varNames = ['__identity'];
        }

        newDep.componentIdentitiesChanged = true;
        newDep.downstreamComponentNames = descendants;
        if (requestStateVariables) {
          newDep.valuesChanged = descendants.map(() => dep.variableNames);
        }

        for (let descendantName of descendants) {
          let descendantUp = this.upstreamDependencies[descendantName];
          if (!descendantUp) {
            descendantUp = this.upstreamDependencies[descendantName] = {};
          }
          // varNames is ['__identity'] if identity
          for (let varName of varNames) {
            if (descendantUp[varName] === undefined) {
              descendantUp[varName] = [];
            }
            descendantUp[varName].push(newDep);
          }


        }

      }
      else if (dep.dependencyType === "stateVariable" ||
        dep.dependencyType === "recursiveDependencyValues") { //|| dep.dependencyType === "stateVariableResolved") {
        newDep.downstreamComponentName = component.componentName;
        if (dep.variableName === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
        }
        newDep.downstreamVariableName = dep.variableName;
        newDep.valueChanged = true;
        if (thisUpstream[dep.variableName] === undefined) {
          thisUpstream[dep.variableName] = [];
        }
        thisUpstream[dep.variableName].push(newDep);
        // } else if (dep.dependencyType === "previouslyCalculatedStateVariable") {
        //   newDep.downstreamComponentName = component.componentName;
        //   // mark as just depending on identity, we don't actually want
        //   // a dependency from the state variable, we just want to
        //   // return a previously calculated value if it exists
        //   newDep.downstreamVariableName = '__identity';
        //   newDep.downstreamVariableNameForPrevious = dep.variableName;
        //   if (thisUpstream['__identity'] === undefined) {
        //     thisUpstream['__identity'] = [];
        //   }
        //   thisUpstream['__identity'].push(newDep);
      }
      else if (dep.dependencyType === "componentStateVariable" ||
        dep.dependencyType === "componentStateVariableComponentType"
      ) {
        newDep.downstreamComponentName = dep.componentName;
        if (dep.variableName === undefined) {
          throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
        }
        newDep.downstreamVariableName = dep.variableName;
        newDep.valueChanged = true;
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
        newDep.valueChanged = true;
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

        newDep.descendant = component;

        if (!this.ancestorDependenciesByDescendant[component.componentName]) {
          this.ancestorDependenciesByDescendant[component.componentName] = [];
        }

        this.ancestorDependenciesByDescendant[component.componentName].push({
          componentName: component.componentName,
          stateVariable,
          depName,
        });

        let ancestorsSearchClass = this.allComponentClasses[dep.componentType];

        let foundAncestorName;

        for (let ancestor of component.ancestors) {
          if (ancestor.componentClass === ancestorsSearchClass ||
            ancestorsSearchClass.isPrototypeOf(ancestor.componentClass)
          ) {
            foundAncestorName = ancestor.componentName;
            break;
          }
        }

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

        newDep.componentIdentitiesChanged = true;
        if (requestStateVariables) {
          newDep.valuesChanged = [dep.variableNames];
        }

        if (foundAncestorName) {
          newDep.downstreamComponentNames = [foundAncestorName];

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
          newDep.downstreamComponentNames = [];
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
    }
  }

  createDetermineDependenciesStateVariable({
    stateVariable, component, stateVariablesDeterminingDependencies,
    additionalStateVariablesDefined,
  }) {


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

        for (let varName of stateVariablesToDelete) {
          // delete state variable itself
          delete component.state[varName];
        }

        // now, can finally run returnDependencies of the state variable (and other affected)

        for (let varName of stateVariablesToCreateDependencies) {

          let changedStateVarObj = component.state[varName];

          // Note: shouldn't have to delete any downstream dependencies
          // of changedStateVarObj
          // as they should have been deleted when deleting above dependencies


          let newDependencies = changedStateVarObj.returnDependencies({
            childLogic: component.childLogic,
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
            shadows: component.shadows,
          });

          core.setUpStateVariableDependencies({
            dependencies: newDependencies,
            component,
            stateVariable: varName,
          });

          core.checkForCircularDependency({
            componentName: component.componentName,
            varName
          });

          if (changedStateVarObj.isArray) {
            core.setUpDependenciesOfArrayEntries({
              component,
              stateValues: dependencyValues,
              stateVariable: varName
            });

            if (changedStateVarObj.arrayEntryNames) {
              for (let entryVarName of changedStateVarObj.arrayEntryNames) {
                core.checkForCircularDependency({
                  componentName: component.componentName,
                  varName: entryVarName
                });
              }
            }
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
    definitionArgs.styleDefinitions = this.styleDefinitions;

    let originalStateVariable = stateVariable;

    let definitionFunction = stateVarObj.definition;

    if (stateVarObj.isArrayEntry) {
      definitionArgs.arrayKeys = stateVarObj.arrayKeys;
      originalStateVariable = stateVarObj.arrayStateVariable;
      let arrayStateVarObj = component.state[originalStateVariable];
      definitionArgs.arrayValues = arrayStateVarObj.arrayValues;
      definitionArgs.staleByKey = arrayStateVarObj.staleByKey;
      definitionFunction = arrayStateVarObj.definition;
    } else if (stateVarObj.isArray) {
      definitionArgs.arrayValues = stateVarObj.arrayValues;
      definitionArgs.staleByKey = stateVarObj.staleByKey;
    }

    let result = definitionFunction(definitionArgs);

    let receivedValue = {
      [stateVariable]: false,
    }

    if (stateVarObj.additionalStateVariablesDefined) {
      for (let otherVar of stateVarObj.additionalStateVariablesDefined) {
        receivedValue[otherVar] = false;
      }
    }


    // console.log(`result for ${stateVariable} of ${component.componentName}`)
    // console.log(result);

    let arrayDefaultsUsedByKey = {};

    for (let varName in result.useEssentialOrDefaultValue) {
      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} requested essential or default value of ${varName}, which isn't a state variable.`);
      }

      if (!component.state[varName].isResolved) {
        throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
      }

      if (!(stateVarObj.isArrayEntry || varName in receivedValue)) {
        throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
      }

      receivedValue[varName] = true;

      // first determine if can get value from essential state
      let setToEssentialValue = this.setValueToEssential({
        component, varName,
        useEssentialInfo: result.useEssentialOrDefaultValue[varName]
      });

      if (component.state[varName].isArray) {
        for (let arrayKey in result.useEssentialOrDefaultValue[varName]) {
          if (!setToEssentialValue[arrayKey]) {
            if ("defaultEntryValue" in component.state[varName]) {
              arrayDefaultsUsedByKey[arrayKey] = component.state[varName].defaultEntryValue;
              // component.state[varName].setArrayValue({
              //   value: component.stateVariableDefinitions[varName].defaultEntryValue,
              //   arrayKey,
              // });
              // delete component.state[varName].staleByKey[arrayKey];
              // // TODO: do we mark the whole array as essential?
              // component.state[varName].essential = true;
            }
          }
        }
      } else {
        if (!setToEssentialValue) {
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


    for (let varName in result.useEssentialOrFallbackValue) {

      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} requested essential or fallback value of ${varName}, which isn't a state variable.`);
      }

      if (!component.state[varName].isResolved) {
        throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
      }

      if (!(stateVarObj.isArrayEntry || varName in receivedValue)) {
        throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
      }

      receivedValue[varName] = true;

      // first determine if can get value from essential state
      let setToEssentialValue = this.setValueToEssential({
        component, varName,
        useEssentialInfo: result.useEssentialOrFallbackValue[varName]
      });

      if (component.state[varName].isArray) {
        for (let arrayKey in result.useEssentialOrFallbackValue[varName]) {
          if (!setToEssentialValue[arrayKey]) {
            component.state[varName].setArrayValue({
              value: result.useEssentialOrFallbackValue[varName][arrayKey].valueIfNotEssential,
              arrayKey,
            });
            delete component.state[varName].staleByKey[arrayKey];

          }
        }
      } else {
        if (!setToEssentialValue) {

          // delete before assigning value to remove any getter for the property
          delete component.state[varName].value;
          component.state[varName].value =
            result.useEssentialOrFallbackValue[varName].valueIfNotEssential;
          component.state[varName].essential = true;
          if (result.useEssentialOrFallbackValue[varName].treatAsDefault) {
            component.state[varName].usedDefault = true;
          }

        }
      }
    }


    for (let varName in result.newValues) {
      if (!(varName in component.state)) {
        throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} returned value of ${varName}, which isn't a state variable.`);
      }

      if (!stateVarObj.isArrayEntry) {
        if (!component.state[varName].isResolved) {
          throw Error(`Attempting to set value of stateVariable ${varName} of ${component.componentName} while it is still unresolved!`)
        }

        if (!(varName in receivedValue)) {
          throw Error(`Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentName}, but it's not listed as an additional state variable defined.`)
        }
      }

      receivedValue[varName] = true;


      if (component.state[varName].isArray) {
        for (let arrayKey in result.newValues[varName]) {
          component.state[varName].setArrayValue({
            value: result.newValues[varName][arrayKey],
            arrayKey,
          });
          delete component.state[varName].staleByKey[arrayKey];
        }
      } else {

        // delete before assigning value to remove any getter for the property
        delete component.state[varName].value;
        component.state[varName].value = result.newValues[varName];

      }
    }


    if (result.noChanges) {
      for (let varName of result.noChanges) {
        if (!component.state[varName].isResolved) {
          throw Error(`Claiming state variable is unchanged when it isn't yet resolved: ${varName} of ${component.componentName}`)
        }

        if (!(stateVarObj.isArrayEntry || varName in receivedValue)) {
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

        if (!(stateVarObj.isArrayEntry || varName in receivedValue)) {
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
          throw Error(`Definition of state variable ${stateVariable} of ${component.componentName} set alwaysShadow for ${varName}, but didn't set its value.`);
        }
        component.state[varName].alwaysShadow = true;
      }
    }

    if (result.setComponentType) {
      stateVarObj.componentType = result.setComponentType
    }


    if (stateVarObj.isArray) {
      // delete before assigning value to remove any getter for the property
      delete stateVarObj.value;
      stateVarObj.value = stateVarObj.arrayValues;
      // if actually got the whole array, then we save default results to the array
      for (let arrayKey in arrayDefaultsUsedByKey) {
        stateVarObj.setArrayValue({
          value: arrayDefaultsUsedByKey[arrayKey],
          arrayKey,
        });
        delete stateVarObj.staleByKey[arrayKey];
      }
    } else if (stateVarObj.isArrayEntry) {
      delete stateVarObj.value;
      stateVarObj.value = stateVarObj.getValueFromArrayValues({ overridesByKey: arrayDefaultsUsedByKey });
    } else {

      for (let varName in receivedValue) {
        if (!receivedValue[varName]) {
          throw Error(`definition of ${stateVariable} of ${component.componentName} didn't return value of ${varName}`);
        }
      }
    }


    return stateVarObj.value;

  }

  setValueToEssential({ component, varName, useEssentialInfo }) {
    let setToEssentialValue = false;
    if (component.state[varName].isArray) {
      setToEssentialValue = {};
      for (let arrayKey in useEssentialInfo) {
        setToEssentialValue[arrayKey] = false;
      }
    }

    // if state variable itself is already essential, then don't change the value
    // just use the previous value
    if (component.state[varName].essential && !component.state[varName].isArray) {
      // delete value to remove getter
      delete component.state[varName].value;
      component.state[varName].value = component.state[varName]._previousValue;
      // return that did set it to an essential value
      return true;
    }
    if (component.potentialEssentialState) {
      if (component.state[varName].isArray) {
        for (let arrayKey in useEssentialInfo) {
          let variablesToCheck = useEssentialInfo[arrayKey].variablesToCheck;
          if (!Array.isArray(variablesToCheck)) {
            variablesToCheck = [variablesToCheck];
          }
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
            if (component.potentialEssentialState[essentialVarName] !== undefined) {
              let value = component.potentialEssentialState[essentialVarName];
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
              component.state[varName].setArrayValue({
                value,
                arrayKey,
              });
              delete component.state[varName].staleByKey[arrayKey];
              // TODO: do we mark the whole array as essential?
              component.state[varName].essential = true;
              setToEssentialValue[arrayKey] = true;
              break;
            }
          }
        }
      }
      else {
        let variablesToCheck = useEssentialInfo.variablesToCheck;
        if (!Array.isArray(variablesToCheck)) {
          variablesToCheck = [variablesToCheck];
        }
        for (let essentialVarInfo of variablesToCheck) {
          let essentialVarName, mathComponentIndex;
          if (typeof essentialVarInfo === "string") {
            essentialVarName = essentialVarInfo;
          }
          else {
            essentialVarName = essentialVarInfo.variableName;
            mathComponentIndex = essentialVarInfo.mathComponentIndex;
          }
          if (component.potentialEssentialState[essentialVarName] !== undefined) {
            // delete before assigning value to remove any getter for the property
            delete component.state[varName].value;
            component.state[varName].value = component.potentialEssentialState[essentialVarName];
            if (mathComponentIndex !== undefined && component.state[varName].value instanceof me.class) {
              component.state[varName].value = component.state[varName].value.get_component(mathComponentIndex);
            }
            component.state[varName].essential = true;
            setToEssentialValue = true;
            break;
          }
        }
      }
    }
    return setToEssentialValue;
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
        dep.dependencyType === "descendantIdentity" ||
        dep.dependencyType === "ancestorStateVariables" ||
        dep.dependencyType === "ancestorIdentity"
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
              if (!depComponent.state[varName].deferred) {
                childObj.stateValues[varName] = depComponent.stateValues[varName];
                if (dep.valuesChanged && dep.valuesChanged[childInd] && dep.valuesChanged[childInd].includes(varName)) {
                  if (!newChanges.valuesChanged) {
                    newChanges.valuesChanged = {};
                  }
                  newChanges.valuesChanged[childInd] = true;
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

      } else if (dep.dependencyType === "stateVariable" ||
        dep.dependencyType === "componentStateVariable" ||
        dep.dependencyType === "parentStateVariable") {
        let depComponent = this.components[dep.downstreamComponentName];
        value = depComponent.state[dep.downstreamVariableName].value;

        if (dep.valueChanged) {
          changes[dep.dependencyName] = { valueChanged: true };
          dep.valueChanged = false;
        }
        if (depComponent.state[dep.downstreamVariableName].usedDefault) {
          usedDefault[dep.dependencyName] = true
        }
        // } else if (dep.dependencyType === "previouslyCalculatedStateVariable") {
        //   let depComponent = this.components[dep.downstreamComponentName];
        //   // return value only if it happen to have a previous value around
        //   value = {
        //     value: depComponent._calculatedStateValues[dep.downstreamVariableNameForPrevious],
        //   }
        // } else if (dep.dependencyType === "stateVariableResolved") {
        //   value = true;
        //   if (dep.valueChanged) {
        //     changes[dep.dependencyName] = { valueChanged: true };
        //     dep.valueChanged = false;
        //   }
      } else if (dep.dependencyType === "componentStateVariableComponentType") {
        let depComponent = this.components[dep.downstreamComponentName];
        // call getter to make sure component type is set
        depComponent.state[dep.downstreamVariableName].value;
        value = depComponent.state[dep.downstreamVariableName].componentType;
        if (dep.valueChanged) {
          changes[dep.dependencyName] = { valueChanged: true };
          dep.valueChanged = false;
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
          stateVariable: dep.downstreamVariableName
        })

        if (dep.valueChanged) {
          changes[dep.dependencyName] = { valueChanged: true };
          dep.valueChanged = false;
        }
      }
      // else if (dep.dependencyType === "replacementClassesAndNames") {
      //   let depComponent = this.components[dep.downstreamComponentName];
      //   let replacements = this.getComponentOrReplacements(depComponent);
      //   let replacementNames = replacements.map(x => x.componentName);
      //   let replacementClasses = replacements.map(x => this.allComponentClasses[x.componentType]);
      //   value = {
      //     replacementNames,
      //     replacementClasses,
      //   };
      //   // TODO: how to determine if changed?
      // }

      else if (dep.dependencyType === "doenetAttribute") {
        value = component.doenetAttributes[dep.attributeName];
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
          value = undefined;
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
  getStateVariableRecursiveDependencyValues({ componentName, stateVariable }) {
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

        let vNames = [];
        let multipleVariables = false;
        if (dep.downstreamVariableName) {
          vNames = [dep.downstreamVariableName];
        } else if (dep.downstreamVariableNames) {
          vNames = dep.downstreamVariableNames;
          multipleVariables = true;
        }



        for (let vName of vNames) {
          // don't calculate value or recurse if calculated this value before
          if (!(vName in dependencyValuesForCName)) {

            let value = dependencyValues[depName];

            if (multipleComponents) {
              value = value[cInd];
            }
            if (multipleVariables) {
              value = value.stateValues[vName]
            }
            dependencyValuesForCName[vName] = value;


            let additionalValues = this.getStateVariableRecursiveDependencyValues({
              componentName: cName,
              stateVariable: vName
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

      }

    }

    // console.log(`recursiveDependencyValues for ${component.componentName}, ${stateVariable}`)
    // console.log(JSON.parse(JSON.stringify(recursiveDependencyValues)))
    return recursiveDependencyValues;

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
    let varsDeleted = [];

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

      return { varsUnresolved, varsDeleted };
    }


    while (prevUnresolved.length > 0 && prevUnresolved.length < numInternalUnresolved) {

      let onlyInternalDependenciesUnresolved = [];

      for (let varName of prevUnresolved) {
        if (varsDeleted.includes(varName)) {
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
                    let result = this.createFromAliasOrArrayEntry({
                      stateVariable: downVar,
                      component: depComponent
                    });
                    Object.assign(varsUnresolved, result.varsUnresolved);
                    varsDeleted.push(...result.varsDeleted);
                  }

                  if (depComponent.state[downVar].isResolved) {
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
              varsDeleted.push(...result.varsDeleted);
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

    return { varsUnresolved, varsDeleted };

  }

  createFromAliasOrArrayEntry({ stateVariable, component }) {
    // console.log(`create from alias or array entry: ${stateVariable} of ${component.componentName}`);

    let varsUnresolved = {};
    let varsDeleted = [];

    if (component.stateVarAliases && stateVariable in component.stateVarAliases) {
      let aliasVar = component.stateVarAliases[stateVariable];
      if (!(aliasVar in component.state)) {
        // if aliasVar isn't in state, then check if it is an alias or array entry
        let result = this.createFromAliasOrArrayEntry({ stateVariable: aliasVar, component });
        // this.resolveStateVariables({ component: component, stateVariable: aliasVar });
        Object.assign(varsUnresolved, result.varsUnresolved);
        varsDeleted.push(...result.varsDeleted);

        if (aliasVar in varsUnresolved) {
          varsUnresolved[stateVariable] = varsUnresolved[aliasVar];
        }
      } else {
        if (!component.state[aliasVar].isResolved) {
          // TODO: if it is possible that aliasVar is already in state
          // but it is still the first round where this.unresolvedDependencies
          // it not yet population, then need to propagate unresolved
          // info via another mechanism
          if (!this.unresolvedDependencies[component.componentName]) {
            throw Error(`must implement case where already crated alias isn't resolved during first pass`)
          }
          varsUnresolved[stateVariable] = this.unresolvedDependencies[component.componentName][aliasVar];
        }
      }
      component.state[stateVariable] = component.state[aliasVar];

      // copy downstream and upstream deps
      this.downstreamDependencies[component.componentName][stateVariable] = this.downstreamDependencies[component.componentName][aliasVar];
      this.upstreamDependencies[component.componentName][stateVariable] = this.upstreamDependencies[component.componentName][aliasVar];
      // note: don't need to copy dependencies that point to alias
      // as don't need to actually update alias
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

          this.initializeStateVariable({ component, stateVariable, arrayKeys, arrayStateVariable });
          if (component.state[arrayStateVariable].setUpArrayEntryDependencies) {
            component.state[arrayStateVariable].setUpArrayEntryDependencies(stateVariable);
            // console.log(component.state)
            let result = this.resolveStateVariables({ component: component, stateVariable: stateVariable });

            Object.assign(varsUnresolved, result.varsUnresolved);
            varsDeleted.push(...result.varsDeleted);
          } else {
            // arrayStateVariable doesn't yet have setUpArrayEntryDependencies
            // (meaning child logic wasn't satisfied when it was created)
            // So, add array entry to list of variables that must be set up
            if (component.state[arrayStateVariable].entriesToSetUp === undefined) {
              component.state[arrayStateVariable].entriesToSetUp = [];
            }
            component.state[arrayStateVariable].entriesToSetUp.push(stateVariable);
            varsUnresolved[stateVariable] = [{
              componentName: component.componentName,
              stateVariable: "__childLogic"
            }];
          }
          foundArrayEntry = true;
          break;
        }
      }

      if (!foundArrayEntry) {
        throw Error(`Unknown state variable ${stateVariable} of ${component.componentName}`);
      }
    }

    return { varsUnresolved, varsDeleted };
  }

  resolveAllDependencies() {

    console.log('resolving all dependencies');

    let resolvedADependency = true;

    let varsDeletedByComponent = {};

    let unResolvedRefToComponentNames = [];

    while (resolvedADependency && Object.keys(this.unresolvedDependencies).length > 0) {
      // console.log(JSON.parse(JSON.stringify(this.unresolvedDependencies)));
      // console.log(JSON.parse(JSON.stringify(this.unresolvedByDependent)));

      resolvedADependency = false;

      // find a component/state variable in this.unresolvedByDependent
      // that isn't in this.unresolvedDependencies
      for (let componentName in this.unresolvedByDependent) {
        if (!(componentName in this.components)) {
          // componentName doesn't exist yet, but it may be created later
          // as a replacement of a composite
          // TODO: how do we get this error message out for the case
          // when componentName actually doesn't exist?
          unResolvedRefToComponentNames.push(componentName);
          continue;
        }
        for (let varName in this.unresolvedByDependent[componentName]) {
          if (varName === "__replacements" && !this.components[componentName].isExpanded) {
            continue;
          }

          if (varName === "__childLogic") {
            continue;
          }

          let deleted = varsDeletedByComponent[componentName] &&
            varsDeletedByComponent[componentName].includes(varName);

          if (varName !== "__identity" && !(varName in this.components[componentName].state) && !deleted) {
            throw Error(`Reference to invalid state variable ${varName} of ${componentName}`);
          }

          if (!(componentName in this.unresolvedDependencies) ||
            varName === "__identity" || deleted ||
            !(varName in this.unresolvedDependencies[componentName])
          ) {

            for (let dep of this.unresolvedByDependent[componentName][varName]) {

              let depComponent = this._components[dep.componentName];

              if (this.unresolvedDependencies[dep.componentName] === undefined ||
                this.unresolvedDependencies[dep.componentName][dep.stateVariable] === undefined) {
                // if already resolved (by another dependency), skip
                continue;
              }
              if (varsDeletedByComponent[dep.componentName] &&
                varsDeletedByComponent[dep.componentName].includes(dep.stateVariable)) {
                // if deleted when processing another dependency
                // removed from unresolvedDepenencies and skip
                delete this.unresolvedDependencies[dep.componentName][dep.stateVariable];
                if (Object.keys(this.unresolvedDependencies[dep.componentName]).length === 0) {
                  delete this.unresolvedDependencies[dep.componentName];
                }

                continue;
              }

              let { varsUnresolved, varsDeleted } = this.resolveStateVariables({
                component: depComponent,
                stateVariable: dep.stateVariable
              });

              if (varsDeleted.length > 0) {
                if (varsDeletedByComponent[dep.componentName]) {
                  varsDeletedByComponent[dep.componentName].push(...varsDeleted);
                } else {
                  varsDeletedByComponent[dep.componentName] = varsDeleted;
                }

              }

              if (Object.keys(varsUnresolved).length === 0) {
                // we have resolved just the one state variable dep.stateVariable

                resolvedADependency = true;
                // console.log(`resolved ${dep.stateVariable} of ${dep.componentName}`)
                delete this.unresolvedDependencies[dep.componentName][dep.stateVariable];
                if (Object.keys(this.unresolvedDependencies[dep.componentName]).length === 0) {
                  delete this.unresolvedDependencies[dep.componentName];
                }

                // TODO: pretty sure don't need this as wouldn't be able to resolve
                // variable if had circular dependence here.  But should think
                // through this more carefully.
                // It may be possible to get circular dependency if add extra dependence
                // after the initial dependence structure is finished....
                // try {
                //   this.checkForCircularDependency({ componentName, varName });
                // } catch (e) {
                //   if (e.message === "foundCircular") {
                //     throw Error(`Circular dependency involving ${componentName}`)
                //   } else {
                //     throw e;
                //   }
                // }

                if (dep.stateVariable === "readyToExpandWhenResolved" &&
                  depComponent instanceof this._allComponentClasses['_composite']) {

                  let parent = this._components[depComponent.parent];
                  let newChildrenResult;

                  try {
                    newChildrenResult = this.processNewDefiningChildren({
                      parent,
                      applySugar: true,
                    });
                  } catch (e) {
                    if (e.message === "foundCircular") {
                      throw Error(`Circular dependency involving ${depComponent.componentName}`)
                    } else {
                      throw e;
                    }
                  }

                  if (newChildrenResult.success) {

                    let result = this.createAndResolveDependencies(parent);

                    if (result.varsDeleted.length > 0) {
                      if (varsDeletedByComponent[depComponent.parent]) {
                        varsDeletedByComponent[depComponent.parent].push(...result.varsDeleted);
                      } else {
                        varsDeletedByComponent[depComponent.parent] = result.varsDeleted;
                      }
                    }


                    if (Object.keys(result.varsUnresolved).length === 0) {
                      delete this.unresolvedDependencies[depComponent.parent];
                    } else {
                      this.unresolvedDependencies[depComponent.parent] = [];
                      this.addUnresolvedDependencies({
                        varsUnresolved: result.varsUnresolved,
                        component: parent
                      });
                    }

                  }

                }
              } else {
                // dep.stateVariable still not resolved.  Delete old unresolved dependencies
                // and add back new ones

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
                for (let unresDep of varsUnresolved[dep.stateVariable]) {

                  let cName2 = unresDep.componentName;
                  let varName2 = unresDep.stateVariable;

                  if (cName2 === componentName && varName2 === varName) {
                    throw Error(`State variable ${varName2} of ${cName2} reported as unresolved after already being resolved.`)
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
            }

            delete this.unresolvedByDependent[componentName][varName];
            if (Object.keys(this.unresolvedByDependent[componentName]).length === 0) {
              delete this.unresolvedByDependent[componentName];
            }

          }
        }
      }
    }


    if (Object.keys(this.unresolvedDependencies).length > 0) {
      // still didn't resolve all state variables
      // display message, separating out those due to unsatisfied childlogic
      let childLogicMessage = "";
      let unresolvedVarMessage = "";
      let unresolvedReferenceMessage = "";

      if (unResolvedRefToComponentNames.length > 0) {
        unResolvedRefToComponentNames = new Set(unResolvedRefToComponentNames);
        for (let componentName of unResolvedRefToComponentNames) {
          if (!(componentName in this.components)) {
            unresolvedReferenceMessage += `Reference to invalid component name ${componentName}. `
          }

        }
      }

      if (unresolvedReferenceMessage) {
        this.unresolvedMessage = unresolvedReferenceMessage;
      } else {

        for (let componentName in this.unresolvedDependencies) {
          let component = this.components[componentName];
          if (!component.childLogicSatisfied) {
            childLogicMessage += `Invalid children for ${componentName}: ${component.childLogic.logicResult.message} `
          } else {
            for (let varName in this.unresolvedDependencies[componentName]) {
              unresolvedVarMessage += `Could not resolve state variable ${varName} of ${componentName}. `
            }
          }
        }

        if (childLogicMessage) {
          this.unresolvedMessage = childLogicMessage;
        } else {
          this.unresolvedMessage = unresolvedVarMessage;
        }
      }
    }

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

    return componentsTouched;

  }

  markChildDependenciesChanged(component) {

    let componentName = component.componentName;
    let componentsTouched = [];

    // before making any changes, go through and find out if there are
    // any components with state variables determining dependencies
    // and get the value fo those state variables
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
      let stateValues;
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
        childLogic: component.childLogic,
        componentInfoObjects: this.componentInfoObjects,
        stateValues,
        sharedParameters: component.sharedParameters,
        shadows: component.shadows,
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
              valuesChanged.push(depDef.variableNames);
            }

            // change upstream dependencies
            for (let currentChild of currentDep.downstreamComponentNames) {
              if (!children.includes(currentChild)) {
                // lost a child.  remove dependency
                // and change any child state variable that refer to parent state variables
                componentsTouched.push(currentChild);
                let additionalComponentsTouched = this.changeParentStateVariables(currentChild);
                componentsTouched.push(...additionalComponentsTouched);
                let childUpDep = this.upstreamDependencies[currentChild];
                let depNamesToCheck = [];
                if (currentDep.downstreamVariableNames) {
                  depNamesToCheck = currentDep.downstreamVariableNames;
                }
                else {
                  depNamesToCheck = ['__identity'];
                }
                for (let vName of depNamesToCheck) {
                  let upDeps = childUpDep[vName];
                  for (let [ind, u] of upDeps.entries()) {
                    if (u === currentDep) {
                      upDeps.splice(ind, 1);
                      break;
                    }
                  }
                }
              }
            }

            for (let newChild of children) {
              if (!currentDep.downstreamComponentNames.includes(newChild)) {
                // gained a child.  add dependency
                // and change any child state variable that refer to parent state variables
                componentsTouched.push(newChild);
                let additionalComponentsTouched = this.changeParentStateVariables(newChild);
                componentsTouched.push(...additionalComponentsTouched);
                let childUpDep = this.upstreamDependencies[newChild];
                if (childUpDep === undefined) {
                  childUpDep = this.upstreamDependencies[newChild] = {};
                }
                if (currentDep.downstreamVariableNames) {
                  for (let vName of currentDep.downstreamVariableNames) {
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
            ancestor: currentDep.ancestor,
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
            for (let [ind, descendantName] of descendants) {
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
              valuesChanged = descendants.map(() => currentDep.downstreamVariableNames);
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
                  for (let vName of currentDep.downstreamVariableNames) {
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
    // and get the value fo those state variables
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
        childLogic: component.childLogic,
        componentInfoObjects: this.componentInfoObjects,
        stateValues,
        sharedParameters: component.sharedParameters,
        shadows: component.shadows,
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
          if (dep.variableName === undefined) {
            throw Error(`Invalid state variable ${stateVariable} of ${component.componentName}, dependency ${depName}: variableName is not defined`);
          }

          // delete updep from previous parent
          let previousParentName = currentDep.downstreamComponentName;

          // TODO: Not sure if this is the right behavior
          // Another option is to just continue if the parentName hasn't changed
          // Is it possible this is called when previousParentName is undefined?
          if (previousParentName === component.parentName) {
            throw Error(`Something's wrong.  Shouldn't be calling this function if parent hasn't changed`)
          }

          varDepsChanged = true;

          let parentUpDep = this.upstreamDependencies[previousParentName][dep.variableName];
          for (let [ind, u] of parentUpDep.entries()) {
            if (u === currentDep) {
              parentUpDep.splice(ind, 1);
              break;
            }
          }

          currentDep.downstreamComponentName = component.parentName;

          currentDep.valueChanged = true;

          let depUp = this.upstreamDependencies[component.parentName];
          if (!depUp) {
            depUp = this.upstreamDependencies[dep.componentName] = {};
          }
          if (depUp[dep.variableName] === undefined) {
            depUp[dep.variableName] = [];
          }

          let foundCurrentDep = false;
          for (let u of depUp) {
            if (u === currentDep) {
              foundCurrentDep = true;
              break;
            }
          }
          if (!foundCurrentDep) {
            depUp[dep.variableName].push(currentDep);
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

  checkForCircularDependency({ componentName, varName, initialComponentName, initialVarName }) {
    if (initialComponentName) {
      if (componentName === initialComponentName && varName === initialVarName) {
        throw Error('foundCircular')
      }
    } else {
      initialComponentName = componentName;
      initialVarName = varName;
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
              initialComponentName, initialVarName
            });
          }
        }
      }
    }
  }

  markStateVariableAndUpstreamDependentsStale({ component, varName }) {

    let componentsTouched = [component.componentName];
    let stateVarObj = component.state[varName];

    // delete recursive dependency values, in case they were defined
    delete stateVarObj.recursiveDependencyValues;

    // if don't have a getter set, then need to save old value
    // and put getter back in place to get a new value next time it is requested
    if (!(Object.getOwnPropertyDescriptor(stateVarObj, 'value').get || stateVarObj.immutable)) {
      stateVarObj._previousValue = stateVarObj.value;
      delete stateVarObj.value;
      let getStateVar = this.getStateVariableValue;
      Object.defineProperty(stateVarObj, 'value', { get: () => getStateVar({ component, stateVariable: varName }), configurable: true });

      let additionalComponentsTouched = this.markUpstreamDependentsStale({ component, varName });
      componentsTouched.push(...additionalComponentsTouched);

    }
    return componentsTouched;
  }

  markUpstreamDependentsStale({ component, varName }) {

    let componentsTouched = [];

    let componentName = component.componentName;
    let getStateVar = this.getStateVariableValue;

    // console.log(`marking upstream of ${varName} of ${componentName} as stale`);

    let upstream = this.upstreamDependencies[componentName][varName];

    if (upstream) {
      for (let upDep of upstream) {

        // TODO: remove all these error checks to speed up process
        // once we're confident bugs have been removed?

        let foundVarChange = false;

        if (upDep.downstreamComponentNames) {
          let ind = upDep.downstreamComponentNames.indexOf(componentName);
          if (ind === -1) {
            throw Error(`something went wrong as ${componentName} not a downstreamComponent of ${upDep.dependencyName}`);
          }
          if (!upDep.downstreamVariableNames.includes(varName)) {
            throw Error(`something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`);

          }
          if (!upDep.valuesChanged) {
            upDep.valuesChanged = [];
          }
          if (!upDep.valuesChanged[ind]) {
            upDep.valuesChanged[ind] = [];
          }
          if (!upDep.valuesChanged[ind].includes(varName)) {
            upDep.valuesChanged[ind].push(varName);
          }
          foundVarChange = true;
        } else {
          if (upDep.downstreamComponentName !== componentName) {
            throw Error(`something went wrong as ${componentName} not the downstreamComponent of ${upDep.dependencyName}`);
          }
          if (upDep.downstreamVariableName) {
            if (upDep.downstreamVariableName !== varName) {
              throw Error(`something went wrong as ${varName} not the downstreamVariable of ${upDep.dependencyName}`);
            }
            upDep.valueChanged = true;
            foundVarChange = true;
          }
        }

        if (foundVarChange) {

          componentsTouched.push(upDep.upstreamComponentName);

          let upVarName = upDep.upstreamVariableName;
          let upDepComponent = this._components[upDep.upstreamComponentName];
          let upVar = upDepComponent.state[upVarName];

          if (upVar.markStale) {
            // if the variable wants to do more processing for marking stale
            // (so far, just for array variables)
            let depChanges = {};
            if (upDep.componentIdentityChanged) {
              depChanges.componentIdentityChanged = true;
            }
            if (upDep.componentIdentitiesChanged) {
              depChanges.componentIdentitiesChanged = true;
            }
            if (upDep.valuesChanged) {
              depChanges.valuesChanged = upDep.valuesChanged;
            }
            if (upDep.valueChanged) {
              depChanges.valueChanged = true;
            }
            // let arrayValues = upVar.arrayValues;
            // if(upVar.isArrayEntry) {
            //   arrayValues = upDepComponent.state[upVar.arrayStateVariable].arrayValues;
            // }
            let stateVarForMarkStale = upVar;
            if (upVar.isArrayEntry) {
              stateVarForMarkStale = upDepComponent.state[upVar.arrayStateVariable]
            }
            upVar.markStale({
              stateVarObj: stateVarForMarkStale,
              changes: { [upDep.dependencyName]: depChanges },
              // arrayValues
            });
          }

          // delete recursive dependency values, if they exist
          delete upVar.recursiveDependencyValues;

          // if don't have a getter set, then need to save old value
          // and put getter back in place to get a new value next time it is requested
          if (!(Object.getOwnPropertyDescriptor(upVar, 'value').get || upVar.immutable)) {
            upVar._previousValue = upVar.value;
            delete upVar.value;
            Object.defineProperty(upVar, 'value', { get: () => getStateVar({ component: upDepComponent, stateVariable: upVarName }), configurable: true });

            // recurse to upstream dependents
            let additionalComponentsTouched = this.markUpstreamDependentsStale({ component: upDepComponent, varName: upVarName });
            componentsTouched.push(...additionalComponentsTouched)
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
      for (let child of component.activeChildren) {
        this.deregisterComponent(child);
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

    this.updateRenderers({ componentNames: [parent.componentName] });

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

    // parent.gatherDescendants();

    console.log("new children for " + parent.componentName);
    // this.resolveAllDependencies();


    // // gather descendants of ancestors
    // for (let ancestor of parent.ancestors) {
    //   let unproxiedAncestor = this._components[ancestor];
    //   unproxiedAncestor.gatherDescendants();
    // }

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

    this.rebuildRenderComponents();

    if (init === false) {
      this.update({ doenetTags: this._renderComponents });
    }
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
      let parent = this.components[component.parent];

      // only add parent if it is not in componentsToDelete itself
      if (parent === undefined || parent.componentName in componentsToDelete) {
        continue;
      }
      let parentObj = parentsOfPotentiallyDeleted[component.parent];
      if (parentObj === undefined) {
        parentObj =
          {
            parent: this._components[component.parent],
            definingChildrenNames: new Set(),
          }
        parentsOfPotentiallyDeleted[component.parent] = parentObj;
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


    console.log("upstream composites " + component.componentName);

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
            parentName: component.componentName,
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

          let parent = this._components[component.parent];

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
            let par = comp.parent;
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

          let parent = this._components[component.parent];

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
            let par = comp.parent;
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
        let overrides = {};
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
          for (let cName in additionalChanges.overrides) {
            if (!overrides[cName]) {
              overrides[cName] = {};
            }
            Object.assign(overrides[cName], additionalChanges.overrides[cName]);
          }
        }

        this.processNewStateVariableValues({ newStateVariableValues, overrides, componentsTouched });


      } else if (change.changeType === "changedReplacementsToWithhold") {

        // don't change actual array of replacements
        // but just change those that will get added to activeChildren


        if (change.replacementsToWithhold !== undefined) {
          this.adjustReplacementsToWithhold(component, change, componentChanges);
        }

        let parent = this._components[component.parent];

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
        let par = comp.parent;
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
      let overrides = {};
      let workspace = {};

      for (let instruction of updateInstructions) {

        let additionalChanges = this.requestComponentChanges({ instruction, workspace });
        componentsTouched.push(...additionalChanges.componentsTouched);
        for (let cName in additionalChanges.newStateVariableValues) {
          if (!newStateVariableValues[cName]) {
            newStateVariableValues[cName] = {};
          }
          Object.assign(newStateVariableValues[cName], additionalChanges.newStateVariableValues[cName]);
        }
        for (let cName in additionalChanges.overrides) {
          if (!overrides[cName]) {
            overrides[cName] = {};
          }
          Object.assign(overrides[cName], additionalChanges.overrides[cName]);
        }
      }

      if (this.externalFunctions.localStateChanged) {
        // TODO: make this call asynchronous
        this.externalFunctions.localStateChanged({ newStateVariableValues, overrides });
      }

      this.executeUpdateStateVariables({ newStateVariableValues, overrides, componentsTouched, saveSerializedState });

    }
    else if (updateType === "updateRendererOnly") {
      this.update({ doenetTags: this._renderComponents });
    }

    return returnValue;
  }

  executeUpdateStateVariables({ newStateVariableValues, componentsTouched, saveSerializedState = true }) {


    let saveSerializedStateImmediately = false;

    if (componentsTouched === undefined) {
      componentsTouched = Object.keys(newStateVariableValues);
    }

    this.processNewStateVariableValues({ newStateVariableValues, componentsTouched });

    // get unique list of components touched
    componentsTouched = new Set(componentsTouched);

    // calculate any replacement changes on composites touched
    let componentChanges = []; // TODO: what to doadditionalComponentsTouched with componentChanges?

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

    // TODO: figure out sourceOfUpdate
    let sourceOfUpdate;

    this.updateRenderers({
      componentNames: componentsTouched,
      sourceOfUpdate,
      recurseToChildren: false,
    });

    this.finishUpdate();

    console.log("**** Components after updateValue");
    console.log(this._components);

    if (sourceOfUpdate !== undefined && sourceOfUpdate.instructionsByComponent !== undefined) {
      let updateKeys = Object.keys(sourceOfUpdate.instructionsByComponent);
      if (updateKeys.length === 1 && updateKeys[0] === this.documentName) {
        saveSerializedStateImmediately = true;
      }
    }

    if (saveSerializedState) {
      if (saveSerializedStateImmediately) {
        this.externalFunctions.saveSerializedState({
          document: this.components[this.documentName],
        })
      } else {
        this.externalFunctions.delayedSaveSerializedState({
          document: this.components[this.documentName],
        })
      }
    }

  }

  processNewStateVariableValues({ newStateVariableValues, componentsTouched }) {
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
            }
          }
        }
        else {

          if (comp.state[vName] === undefined) {
            console.warn(`can't update state variable ${vName} of component ${cName}, as it doesn't exist.`);
            continue;
          }

          comp.state[vName]._previousValue = comp.state[vName].value;

          // delete value before assigning new value to remove any getter
          delete comp.state[vName].value;
          comp.state[vName].value = newComponentStateVariables[vName];
          let additionalComponentsTouched = this.markUpstreamDependentsStale({
            component: comp, varName: vName
          });
          componentsTouched.push(...additionalComponentsTouched);
        }
      }
    }
  }

  requestComponentChanges({ instruction, initialChange = true, workspace }) {

    // console.log(`request component changes`);
    // console.log(instruction);

    let component = this._components[instruction.componentName];
    let stateVariable = instruction.stateVariable;

    if (workspace[instruction.componentName] === undefined) {
      workspace[instruction.componentName] = {};
    }
    let stateVariableWorkspace = workspace[instruction.componentName][stateVariable];
    if (stateVariableWorkspace === undefined) {
      stateVariableWorkspace = workspace[instruction.componentName][stateVariable] = {};
    }

    let inverseDefinitionArgs = this.getStateVariableDependencyValues({ component, stateVariable });
    inverseDefinitionArgs.componentInfoObjects = this.componentInfoObjects;
    inverseDefinitionArgs.initialChange = initialChange;
    inverseDefinitionArgs.stateValues = component.stateValues;
    inverseDefinitionArgs.workspace = stateVariableWorkspace;
    inverseDefinitionArgs.overrideFixed = instruction.overrideFixed;

    let originalStateVariable = stateVariable;
    let stateVarObj = component.state[stateVariable];

    if (stateVarObj.isArrayEntry) {
      originalStateVariable = stateVarObj.arrayStateVariable;

      let desiredValuesForArray = {};
      if (stateVarObj.arrayKeys.length === 1) {
        desiredValuesForArray[stateVarObj.arrayKeys[0]] = instruction.value
      } else {
        for (let [ind, arrayKey] of stateVarObj.arrayKeys) {
          desiredValuesForArray[arrayKey] = instruction.value[ind];
        }
      }
      inverseDefinitionArgs.desiredStateVariableValues = { [originalStateVariable]: desiredValuesForArray };

    } else {
      inverseDefinitionArgs.desiredStateVariableValues = { [stateVariable]: instruction.value };
    }


    let origStateVarObj = component.state[originalStateVariable];

    let componentsTouched = [component.componentName];
    let newStateVariableValues = {};
    let overrides = {};

    if (!origStateVarObj.inverseDefinition) {
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

    let inverseResult = origStateVarObj.inverseDefinition(inverseDefinitionArgs);

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

        if (newInstruction.temporaryOverride) {
          if (!overrides[component.componentName]) {
            overrides[component.componentName] = {};
            overrides[component.componentName][newInstruction.setStateVariable] = true;
          }
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
        } else if (dep.dependencyType = "componentStateVariable") {
          let inst = {
            componentName: dep.downstreamComponentName,
            stateVariable: dep.downstreamVariableName,
            value: newInstruction.desiredValue,
            overrideFixed: instruction.overrideFixed,
          };
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

    return { newStateVariableValues, overrides, componentsTouched };
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


  styleDefinitions = {
    1: {
      lineColor: "blue",
      lineWidth: 4,
      lineStyle: "solid",
      markerColor: "blue",
      markerStyle: "circle",
      markerSize: 3
    },
    2: {
      lineColor: "green",
      lineWidth: 1,
      lineStyle: "solid",
      markerColor: "green",
      markerStyle: "square",
      markerSize: 4
    },
    3: {
      lineColor: "red",
      lineWidth: 3,
      lineStyle: "solid",
      markerColor: "red",
      markerStyle: "triangle",
      markerSize: 5
    },
    4: {
      lineColor: "purple",
      lineWidth: 2,
      lineStyle: "solid",
      markerColor: "purple",
      markerStyle: "diamond",
      markerSize: 4
    },
    5: {
      lineColor: "black",
      lineWidth: 1,
      lineStyle: "solid",
      markerColor: "black",
      markerStyle: "circle",
      markerSize: 2
    },
    6: {
      lineColor: "lightgray",
      lineWidth: 1,
      lineStyle: "dotted",
      markerColor: "lightgray",
      markerStyle: "circle",
      markerSize: 2
    },
  }


}


function validatePropertyValue({ value, propertySpecification, property }) {

  if (propertySpecification.valueTransformations &&
    value in propertySpecification.valueTransformations
  ) {
    value = propertySpecification.valueTransformations[value];
  }

  if (propertySpecification.validValues) {
    if (!propertySpecification.validValues.has(value)) {
      throw Error(`Invalid value ${value} for property ${property}`)
    }
  }

  if (propertySpecification.toLowerCase) {
    value = value.toLowerCase();
  }

  return value;
}
