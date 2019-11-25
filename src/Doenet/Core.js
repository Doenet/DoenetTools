import * as ComponentTypes from './ComponentTypes'
import readOnlyProxyHandler from './ReadOnlyProxyHandler';
import TrackChanges from './TrackChanges';
import ParameterStack from './ParameterStack';
import availableRenderers from './AvailableRenderers';
import Numerics from './Numerics';
import MersenneTwister from 'mersenne-twister';
import me from 'math-expressions';
import * as serializeFunctions from './utils/serializedStateProcessing';

// string to componentClass: componentTypes["string"].class
// componentClass to string: componentClass.componentType
// validTags: Object.keys(componentTypes);


export default class Core{
  constructor({doenetML, doenetState, update, parameters, requestedVariant,
    externalFunctions, flags={}, postConstructionCallBack }){
    // console.time('start up time');

    this.numerics = new Numerics();
    this.flags = new Proxy(flags, readOnlyProxyHandler); //components shouldn't modify flags

    this.externalFunctions = externalFunctions;
    if(externalFunctions === undefined) {
      this.externalFunctions = {};
    }

    this.requestUpdate = this.requestUpdate.bind(this);
    this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
    this._requestAnimationFrame = this._requestAnimationFrame.bind(this);
    this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this);
    this.expandDoenetMLsToFullSerializedState = this.expandDoenetMLsToFullSerializedState.bind(this);
    this.finishCoreConstruction = this.finishCoreConstruction.bind(this);

    this.update = update;
    this._standardComponentTypes = ComponentTypes.createComponentTypes();
    this._allComponentClasses = ComponentTypes.allComponentClasses();
    this._componentTypesTakingAliases = ComponentTypes.componentTypesTakingAliases();
    this._componentTypesCreatingVariants = ComponentTypes.componentTypesCreatingVariants();

    this.animationIDs = {};
    this.lastAnimationID = 0;
    this.requestedVariant = requestedVariant;
    this.postConstructionCallBack = postConstructionCallBack;

    // console.time('serialize doenetML');
    
    this.parameterStack = new ParameterStack(parameters);

    let serializedState;
    
    if(doenetState){
      serializedState = doenetState;
      this.finishCoreConstruction({fullSerializedStates: [serializedState], finishSerializedStateProcessing: false});
    } else {
      this.expandDoenetMLsToFullSerializedState({
        doenetMLs: [doenetML],
        callBack: this.finishCoreConstruction
      })
    }
  }

  finishCoreConstruction({
    fullSerializedStates,
    finishSerializedStateProcessing=true,
    calledAsynchronously=false
  }) {

    let serializedState = fullSerializedStates[0];

    serializeFunctions.addDocumentIfItsMissing(serializedState);

    if(finishSerializedStateProcessing) {

      serializeFunctions.createAuthorNames({
        serializedState,
        componentTypesTakingAliases:this.componentTypesTakingAliases,
        allComponentClasses:this.allComponentClasses
      });
    } else {
      if(serializedState[0].doenetAttributes === undefined) {
        serializedState[0].doenetAttributes = {};
      }
      serializedState[0].doenetAttributes.componentAlias = "/_document1";
    }

    let variantComponents = serializeFunctions.gatherVariantComponents({
      serializedState,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      allComponentClasses: this.allComponentClasses,
    });

    if(this.requestedVariant !== undefined) {
      this.parameterStack.parameters.variant = this.requestedVariant;
    }

    // this.parameterStack.parameters.variant = {
    //   index: 101,
    //   subvariants: [
    //     {
    //       value: 9,
    //       index: 8,
    //       subvariants: [{
    //         index: -7
    //       }]
    //     },
    //     {
    //       index: 1,
    //       subvariants: [
    //         {
    //           value: 3
    //         }
    //       ]
    //     },
    //     {
    //       value: 'b',
    //       subvariants: [
    //         {
    //           value: 7
    //         }
    //       ]
    //     }
    //   ]
    // }

    // this.parameterStack.parameters.variant = {
    //   subvariants: [{
    //     indices: [0],
    //     subvariants: [{
    //       indices: [1]
    //     }]
    //   }]
    // }
    // this.parameterStack.parameters.variant = {
    //   index: 97,
    // }
    variantComponents[0].variants.desiredVariant = this.parameterStack.parameters.variant;

    // this.assignVariant({
    //   variantComponents: variantComponents,
    //   desiredVariants: this.parameterStack.parameters.variant
    // })

    // console.log(JSON.parse(JSON.stringify(variantComponents)));

    this._components = {};
    this._renderComponents = [];
    this._renderComponentsByName = {};
    this._graphRenderComponents = [];

    this._aliasMap = {};

    // console.timeEnd('serialize doenetML');
    

    // from https://stackoverflow.com/a/7616484
    this.parameterStack.parameters.hashStringToInteger = function(s) {
      var hash = 0, i, chr;
      if (s.length === 0) return hash;
      for (i = 0; i < s.length; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
    
    if(this.parameterStack.parameters.seed === undefined) {
      // this.parameterStack.parameters.seed = '47';
      this.parameterStack.parameters.seed = this.parameterStack.parameters.hashStringToInteger(
        Date.now().toString()
      );
    }
    this.parameterStack.parameters.selectRng = new MersenneTwister(
      this.parameterStack.parameters.seed
    );
    this.parameterStack.parameters.rngClass = MersenneTwister;

    this.addComponents({
      serializedState: serializedState,
      initialAdd: true,
      applySugar: true,
    })

    // console.log(serializedState)
    // console.timeEnd('start up time');
    console.log("** components at the end of the core constructor **");
    console.log(this._components);
    //Make these variables available for cypress
    window.state = {components: this._components}

    this.postConstructionCallBack({
      doenetTags: this.doenetState,
      init: !calledAsynchronously,
    })

  }


  expandDoenetMLsToFullSerializedState({doenetMLs, callBack}) {

    let serializedStates = [];
    let contentIdComponents = {};
    
    for(let doenetML of doenetMLs) {

      let serializedState= serializeFunctions.doenetMLToSerializedState({doenetML,
        standardComponentTypes:this.standardComponentTypes,
        allComponentClasses:this.allComponentClasses,
      });

      serializeFunctions.createComponentsFromProps(serializedState,this.standardComponentTypes);

      serializedStates.push(serializedState);

      let newContentIdComponents = serializeFunctions.findContentIdRefs({ serializedState });

      for(let contentId in newContentIdComponents) {
        if(contentIdComponents[contentId] === undefined) {
          contentIdComponents[contentId] = []
        }
        contentIdComponents[contentId].push(...newContentIdComponents[contentId])
      }

    }

    let contentIdList = Object.keys(contentIdComponents);
    if(contentIdList.length > 0) {
      // found refs with contentIds
      // so look up those contentIds, convert to doenetMLs, and recurse on those doenetMLs

      let mergedContentIdSerializedStateIntoRef = function ({fullSerializedStates}) {

        for(let [ind, contentId] of contentIdList.entries()) {
          let serializedStateForContentId = fullSerializedStates[ind];
          for (let originalRefWithContentId of contentIdComponents[contentId]) {
            if(originalRefWithContentId.state === undefined) {
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

      let recurseToAdditionalDoenetMLs = function ({newDoenetMLs, success, message}) {

        if(!success) {
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

  addComponents({ serializedState, parent, indexOfDefiningChildren, applySugar = false, initialAdd=false}) {

    if(!Array.isArray(serializedState)) {
      serializedState = [serializedState];
    }

    let trackChanges = new TrackChanges({
      BaseComponent: this.allComponentClasses._base,
      components: this.components
    });

    let createResult = this.createIsolatedComponents({
      serializedState: serializedState,
      applySugar: applySugar,
      trackChanges: trackChanges,
    });

    if(createResult.success !== true) {
      throw Error(createResult.message);
    }

    const newComponents = createResult.components;

    let deletedComponents = {};
    let addedComponents = {};
    newComponents.forEach(x => addedComponents[x.componentName]=x);

    if(initialAdd === true) {
      if(newComponents.length !== 1){
        throw Error("Initial components need to be an array of just one component.");
      }
      this.setAncestors(newComponents[0]);
      this.updateRenderers({componentNames: [newComponents[0].componentName]});
      this.document = newComponents[0];
      
    }else{
      if(parent === undefined) {
        throw Error("Must specify parent when adding components.");
      }
      if(indexOfDefiningChildren === undefined) {
        indexOfDefiningChildren = parent.definingChildren.length;
      }

      if(parent.isShadow === true) {
        throw Error("Cannot add components to a shadow component "+ parent.componentName);
      }
  
      let addResults = this.addChildren({
        parent: parent,
        indexOfDefiningChildren: indexOfDefiningChildren,
        newChildren: newComponents,
        trackChanges: trackChanges,
      });
      if(!addResults.success) {
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
  rebuildRenderComponents(component = this._components["/_document1"], init=true){

    if(init===true) {
      // empty the array and object without reassigning
      // so that components still have access to them
      this._renderComponents.length = 0;
      for(let key in this._renderComponentsByName) {
        delete this._renderComponentsByName[key];
      }
      this._graphRenderComponents.length = 0;
    }

    // console.log(component.componentType);
    // console.log(component.componentIsAProperty);
    // console.log("--");

    if (component.state.hide !== true &&
      component.renderer !== undefined  &&
      component.componentIsAProperty === false
      ) {

      let unproxiedComponent = this._components[component.componentName];

      if(unproxiedComponent instanceof this._allComponentClasses.graph) {
        this._graphRenderComponents.push(unproxiedComponent.renderer);
      }
      this._renderComponentsByName[unproxiedComponent.componentName] = unproxiedComponent.renderer;

      let childRenderers = [];
      for (let childName of unproxiedComponent.childrenWhoRender){
        let child = this._components[childName];
        let cr = this.rebuildRenderComponents(child,false);
        if(cr !== undefined) {
          childRenderers.push(cr);
        }
      }

      unproxiedComponent.renderer.childRenderers = childRenderers;

      if(init) {
        this._renderComponents.push(unproxiedComponent.renderer);
      }

      return unproxiedComponent.renderer;
    }
  }

  updateRenderers({componentNames, sourceOfUpdate, recurseToChildren = true}){
    for(let name of componentNames) {
      let unproxiedComponent = this._components[name];
      if(unproxiedComponent !== undefined) {
        // could be undefined if deleted since last updated
        if(unproxiedComponent.renderer === undefined) {
          unproxiedComponent.initializeRenderer({sourceOfUpdate: sourceOfUpdate});
        } else {
          unproxiedComponent.updateRenderer({sourceOfUpdate: sourceOfUpdate});
        }
        if(recurseToChildren && unproxiedComponent.childrenWhoRender.length > 0) {
          this.updateRenderers({
            componentNames: unproxiedComponent.childrenWhoRender,
            sourceOfUpdate: sourceOfUpdate,
            recurseToChildren: true
          });
        }
      }
    }
  }

  initializeAliasMap(serializedState, detectDuplicates=true) {
    // add key-value pairs to aliasMap,
    //  - keyed by doenetAttributes.componentAlias found in serialized state
    //  - with value of false to indicate component with alias is not yet created
    // if detectDuplicates, throw error if aliasMap already has componentAlias key,
    //    otherwise overwrite

    for(let serializedComponent of serializedState) {
      if(serializedComponent.doenetAttributes !== undefined) {
        let componentAlias = serializedComponent.doenetAttributes.componentAlias;
        if(componentAlias !== undefined) {
          if(detectDuplicates === true && componentAlias in this._aliasMap) {
            throw Error("Duplicate component aliases in added components");
          }
          if(componentAlias.substring(0,2) === "__") {
            // disallow __ to prevent collisions with component names
            throw Error("Component aliases cannot begin with __");
          }

          // record that component isn't created yet
          this._aliasMap[componentAlias] = false;
        }
      }

      // recursion
      if(serializedComponent.children !== undefined) {
        this.initializeAliasMap(serializedComponent.children, detectDuplicates);
      }
    }
  }

  createIsolatedComponents({ serializedState, applySugar = false,
    applyAdapters = true, shadow = false, trackChanges }) {

    trackChanges.allowSelectExpands = false;

    let createResult = this.createIsolatedComponentsSub({
      serializedState: serializedState,
      applySugar: applySugar,
      applyAdapters: applyAdapters,
      shadow: shadow,
      trackChanges: trackChanges,
    });

    console.log("createResult")
    console.log(createResult)

    let newComponents = createResult.components;

    // set ancestors within group so upstream updates will work
    newComponents.forEach(x => this.setAncestors(x));

    let result = this.upstreamUpdate({ initialFailures: createResult});
    
    if(result.success) {
      result.components = newComponents;
    }

    return result;

  }

  createIsolatedComponentsSub({ serializedState, applySugar = false,
    applyAdapters = true, shadow = false, trackChanges }) {

    let newComponents = [];

    //TODO: last message
    let lastMessage = "";

    let failures = {
      numUnresolvedStateVariables: {},
      unresolvedComponents: new Set([]),
      unsatisifiedChildLogic: new Set([]),
      unresolvedByDependent: {},
    }

    for(let serializedComponent of serializedState) {

      // if already corresponds to a created component
      // add to array
      if(serializedComponent.createdComponent === true) {
        let newComponent = this._components[serializedComponent.componentName];
        newComponents.push(newComponent);
        // skip rest of processing, as they already occured for this component
        continue;
      }

      let componentClass;
      try {
        componentClass = this.standardComponentTypes[serializedComponent.componentType].class;
      }catch(e) {
        if(this.standardComponentTypes[serializedComponent.componentType] === undefined) {
          throw Error("Cannot create component of type " + serializedComponent.componentType);
        }
        throw e;
      }

      let createResult = this.createChildrenThenComponent({
        serializedComponent: serializedComponent,
        componentClass: componentClass,
        applySugar: applySugar,
        applyAdapters: applyAdapters,
        shadow: shadow,
        trackChanges: trackChanges
      });

      let newComponent = createResult.newComponent;
      newComponents.push(newComponent);


      mergeFailures(failures, createResult);
        
      // TODO: need to get message
      //lastMessage = createResult.lastMessage;

      this.registerComponent(newComponent);
    
      // if added downstream dependencies to new component,
      // add them as upstream dependencies to target
      for(let downDepComponentName in newComponent.downstreamDependencies) {

        let unproxiedComponent = this._components[downDepComponentName];
        let upDep = Object.assign({},
          newComponent.downstreamDependencies[downDepComponentName]);
        // replace component to refer to proxied upstream component
        upDep.component = new Proxy(newComponent, readOnlyProxyHandler); 
        unproxiedComponent.upstreamDependencies[newComponent.componentName] = upDep;
      }

      // register aliases
      this.registerAlias({component: newComponent});

    }

    let results = {components: newComponents};
    Object.assign(results, failures);
    return results;

  }

  registerAlias({component}) {
    let componentAlias = component.doenetAttributes.componentAlias;
    if(componentAlias !== undefined) {
      if(![false, undefined].includes(this._aliasMap[componentAlias])) {
        // console.log(component);
        throw Error("Uh oh, overwriting alias " + componentAlias);
        // console.log("Uh oh, overwriting alias " + componentAlias);
      }
      this._aliasMap[componentAlias] = component;
    }
  }

  createChildrenThenComponent({serializedComponent, componentClass,
    applySugar = false, applyAdapters = true, shadow = false, trackChanges }) {

    // first recursively create children
    let serializedChildren = serializedComponent.children;
    let definingChildren = [];
    let childrenToRemainSerialized = [];

    let failures = {
      numUnresolvedStateVariables: {},
      unresolvedComponents: new Set([]),
      unsatisifiedChildLogic: new Set([]),
      unresolvedByDependent: {},
    }

    // add a new level to parameter stack;
    this.parameterStack.push();

    if(serializedChildren !== undefined) {

      if(componentClass.previewSerializedComponent !== undefined) {
        let creationInstructions = componentClass.previewSerializedComponent({
          serializedComponent: serializedComponent,
          sharedParameters: this.parameterStack.parameters,
          components: this.components,
          allComponentClasses: this.allComponentClasses,
        });
        
        if(creationInstructions === undefined) {
          creationInstructions = [];
        }
        
        let childrenAddressed = new Set([]);

        for(let instruction of creationInstructions) {
          if(instruction.createChildren !== undefined) {
            let childrenToCreate = [];
            for(let ind of instruction.createChildren) {
              if(childrenAddressed.has(Number(ind))) {
                throw Error("Invalid create children instructions from " + componentClass.componentType
                  + ": child repeated");
              }
              if(!(ind in serializedChildren)) {
                throw Error("Invalid create children instructions from " + componentClass.componentType
                  + ": invalid child index");
              }
              childrenAddressed.add(Number(ind));
              childrenToCreate.push(serializedChildren[ind]);
            }

            let childrenResult = this.createIsolatedComponentsSub({
              serializedState: childrenToCreate,
              applySugar: applySugar,
              applyAdapters: applyAdapters,
              shadow: shadow,
              trackChanges: trackChanges,
            });

            mergeFailures(failures, childrenResult);

            for(let [createInd, locationInd] of instruction.createChildren.entries()) {
              definingChildren[locationInd] = new Proxy(childrenResult.components[createInd], readOnlyProxyHandler);
            }
          }
          if(instruction.callMethod !== undefined) {
            componentClass[instruction.callMethod]({
              serializedComponent: serializedComponent,
              sharedParameters: this.parameterStack.parameters,
              definingChildrenSoFar: definingChildren,
              allComponentClasses: this.allComponentClasses,
            })
          }
          if(instruction.keepChildrenSerialized !== undefined) {
            for(let ind of instruction.keepChildrenSerialized) {
              if(childrenAddressed.has(Number(ind))) {
                throw Error("Invalid create children instructions from " + componentClass.componentType
                  + ": child repeated");
              }
              childrenAddressed.add(Number(ind));
              childrenToRemainSerialized[ind] = serializedChildren[ind];
            }
          }
        }

        // create any remaining children
        let childrenToCreate = [];
        let indicesToCreate = [];
        for(let [ind,child] of serializedChildren.entries()) {
          if(!(childrenAddressed.has(ind))) {
            childrenToCreate.push(child)
            indicesToCreate.push(ind);
          }
        }

        if(childrenToCreate.length > 0) {
          let childrenResult = this.createIsolatedComponentsSub({
            serializedState: childrenToCreate,
            applySugar: applySugar,
            applyAdapters: applyAdapters,
            shadow: shadow,
            trackChanges: trackChanges,
          });

          mergeFailures(failures, childrenResult);

          for(let [createInd, locationInd] of indicesToCreate.entries()) {
            definingChildren[locationInd] = new Proxy(childrenResult.components[createInd], readOnlyProxyHandler);
          }
        }

      } else {

        // no previewSerializedComponent method on class
        // so create all children

        let childrenResult = this.createIsolatedComponentsSub({
          serializedState: serializedChildren,
          applySugar: applySugar,
          applyAdapters: applyAdapters,
          shadow: shadow,
          trackChanges: trackChanges,
        });

        mergeFailures(failures, childrenResult);

        definingChildren = childrenResult.components.map(x => new Proxy(x, readOnlyProxyHandler));
      }
    }


    let childResults = this.deriveChildResultsFromDefiningChildren({
      componentClass: componentClass,
      definingChildren: definingChildren,
      applySugar: applySugar,
      applyAdapters: applyAdapters,
      trackChanges: trackChanges,
    });

    mergeFailures(failures, childResults);

    // if have a componentAlias, use that for componentName
    // otherwise generate automatic name
    let componentName;
    if(serializedComponent.doenetAttributes !== undefined) {
      componentName = serializedComponent.doenetAttributes.componentAlias;
    }
    if(componentName === undefined) {
      // no component alias, so generate automatic name
      // get name for component as: __componentType + componentIndex
      // increment maxIndex on standardComponentTypes before assigning to componentIndex
      let componentIndex = ++this._standardComponentTypes[serializedComponent.componentType].maxIndex;
      componentName = '__' + serializedComponent.componentType + componentIndex;
    }

    trackChanges.recordChildrenChanged(componentName);

    // create component itself
    let newComponent = new componentClass({
      componentName: componentName,
      activeChildren: childResults.activeChildren,
      definingChildren: definingChildren,
      allChildren: childResults.allChildren,
      childLogic: childResults.childLogic,
      serializedChildren: childrenToRemainSerialized,
      serializedState: serializedComponent,
      aliasMap: this.aliasMap,
      trackChanges: trackChanges,
      components: this.components,
      standardComponentTypes: this.standardComponentTypes,
      allComponentClasses: this.allComponentClasses,
      componentTypesTakingAliases: this.componentTypesTakingAliases,
      componentTypesCreatingVariants: this.componentTypesCreatingVariants,
      shadow: shadow,
      requestUpdate: this.requestUpdate,
      availableRenderers: availableRenderers,
      allRenderComponents: this._renderComponentsByName,
      graphRenderComponents: this._graphRenderComponents,
      numerics: this.numerics,
      sharedParameters: this.parameterStack.parameters,
      requestAnimationFrame: this.requestAnimationFrame,
      cancelAnimationFrame: this.cancelAnimationFrame,
      externalFunctions: this.externalFunctions,
      allowSugarForChildren: applySugar,
      flags: this.flags,
      styleDefinitions: this.styleDefinitions,
    });

    let numUnresolved = Object.keys(newComponent.unresolvedState).length;
    if(numUnresolved > 0) {
      failures.numUnresolvedStateVariables[componentName] = numUnresolved;
    }
    
    if(newComponent.unresolvedDependencies) {
      failures.unresolvedComponents.add(componentName);
      for(let dep of Object.keys(newComponent.unresolvedDependencies)) {
        let dObj = failures.unresolvedByDependent[dep.componentName];
        if(dObj === undefined) {
          dObj = failures.unresolvedByDependent[dep.componentName] = new Set([]);
        }
        dObj.add(componentName);
      }
    }

    if(!newComponent.childLogicSatisfied) {
      failures.unsatisifiedChildLogic.add(componentName);
    }


    // Right after component is made have it determine which of its children to render
    newComponent.updateChildrenWhoRender(); 

    // if component was composite, expand it to create its replacements
    if(newComponent instanceof this._allComponentClasses['_composite']) {

      let expandResult = this.expandCompositeComponent({
        component: newComponent, trackChanges: trackChanges
      });

      mergeFailures(failures, expandResult);

    }

    // remove a level from parameter stack;
    this.parameterStack.pop();

    let results = {newComponent: newComponent};
    Object.assign(results, failures);
    return results;

  }

  deriveChildResultsFromDefiningChildren({componentClass, definingChildren,
    applySugar, applyAdapters, trackChanges}) {

    // Initialize activeChildren as a shallow copy of definingChildren.
    // When composite activeChildren are expanded or adapters are applied,
    // the activeChildren will be changed, but not the definingChildren
    // Note: an exception of definingChildren not changings is 
    // when a sugar replacement is made, in which case
    // definingChildren, activeChildren, and allChildren will be altered
    // (as a sugar replacement is permanent and the replaced child is deleted)
    let activeChildren = definingChildren.slice();

    // allChildren include activeChildren, definingChildren,
    // and possibly some children that are neither
    // (which could occur when a composite is expanded and the result is adapted)
    let allChildren = {};
    for(let ind=0; ind < activeChildren.length; ind++) {
        let child = activeChildren[ind];
        allChildren[child.componentName] = {
          activeChildrenIndex: ind,
          definingChildrenIndex: ind,
          component: child,
        };
      }

    // if any of activeChildren are compositeComponents
    // replace with new components given by the composite component
    this.replaceCompositeChildren({activeChildren: activeChildren, allChildren: allChildren});


    // If a class is not supposed to have blank string children,
    // it is still possible that it received blank string children from a composite.
    // Hence filter out any blank string children that it might have
    if(!componentClass.includeBlankStringChildren) {
      activeChildren = activeChildren.filter(s => s.componentType !== "string" || /\S/.test(s.state.value));
    }

    let childLogicResults = this.matchChildren({
      componentClass: componentClass,
      activeChildren: activeChildren,
      applySugar: applySugar,
      applyAdapters: applyAdapters,
      definingChildren: definingChildren,
      allChildren: allChildren,
      trackChanges: trackChanges,
    });

    childLogicResults.activeChildren = activeChildren;
    childLogicResults.allChildren = allChildren;

    return childLogicResults;

  }

  expandCompositeComponent({component, trackChanges}) {

    let replacementResult = this.createIsolatedComponentsSub({
      serializedState: component.serializedReplacements,
      applySugar: component.allowSugarInSerializedReplacements,
      shadow: true,
      trackChanges: trackChanges,
    });

    component.replacements = replacementResult.components.map(x => new Proxy(x,readOnlyProxyHandler));

    // register upstream and downstream dependencies
    this.registerCompositeDependencies({composite: component});

    return replacementResult;

  }

  replaceCompositeChildren({activeChildren, allChildren}) {

    for(let ind=0; ind < activeChildren.length; ind++) {
      let child = activeChildren[ind];

      if(child instanceof this._allComponentClasses['_composite']) {

        // use unproxiedChild to avoid pileup of proxies
        let unproxiedChild = this._components[child.componentName];
        let replacements = unproxiedChild.replacements;

        // don't use any replacements that are marked as being withheld
        if(unproxiedChild.replacementsToWithhold > 0) {
          replacements = replacements.slice(0, -unproxiedChild.replacementsToWithhold);
          for(let ind = replacements.length; ind < unproxiedChild.replacements.length; ind++) {
            let unproxiedReplacement = this._components[unproxiedChild.replacements[ind].componentName];
            unproxiedReplacement.inactive = true;
            unproxiedReplacement.changedInactive = true;
          }
        }

        for(let ind = 0; ind < replacements.length; ind++) {
          let unproxiedReplacement = this._components[replacements[ind].componentName];
          delete unproxiedReplacement.inactive;
          unproxiedReplacement.changedInactive = true;
        }


        activeChildren.splice(ind, 1, ...replacements);

        // Update allChildren object with info on composite and its replacemnts
        let allChildrenObj = allChildren[unproxiedChild.componentName];
        delete allChildrenObj.activeChildrenIndex;
        for(let ind2=0; ind2 < replacements.length; ind2++) {
          let replacement = replacements[ind2];
          allChildren[replacement.componentName] = {
            activeChildrenIndex: ind+ind2,
            component: replacement,
          }
        }

        // even replacements that are marked as being withheld
        // should be in allChildren
        if(unproxiedChild.replacementsToWithhold > 0) {
          for(let ind2=replacements.length; ind2 < unproxiedChild.replacements.length; ind2++) {
            let withheldReplacement = unproxiedChild.replacements[ind2];
            allChildren[withheldReplacement.componentName] = {
              component: withheldReplacement,
            }
          }
        }
        if(replacements.length !== 1) {
          // if replaced composite with anything other than one replacement
          // shift activeChildrenIndices of later children
          let nShift = replacements.length - 1;
          for(let ind2=ind+replacements.length; ind2 < activeChildren.length; ind2++) {
            let child2 = activeChildren[ind2];
            allChildren[child2.componentName].activeChildrenIndex += nShift;
          }
        }

        // rewind one index, in case any of the new activeChildren are composites
        ind--;
      }
    }
  }

  registerCompositeDependencies({composite, components, inactive=false, changeToInactive=true}) {
    let topLevel = false;
    if(components === undefined) {
      topLevel = true;
      components = composite.replacements;
    }
    for(let ind in components) {
      let component = components[ind];
      if(topLevel === true) {
        if(composite.replacementsToWithhold > 0) {
          if(ind >= components.length - composite.replacementsToWithhold) {
            inactive = true;
          }else {
            inactive = false;
          }
        }
      }

      let unproxiedComponent = this._components[component.componentName];
      let upDep = composite.upstreamDependencies[component.componentName];
      if(upDep === undefined || upDep.dependencyType !== "replacement") {
        upDep = composite.upstreamDependencies[component.componentName] = {
          dependencyType: "replacement",
          component: new Proxy(unproxiedComponent, readOnlyProxyHandler),
          topLevel: topLevel,
        };
      }
      if(inactive) {
        if(changeToInactive) {
          upDep.inactive=true;
        }
      }else {
        delete upDep.inactive;
      }
      let downDep = unproxiedComponent.downstreamDependencies[composite.componentName];
      if(downDep === undefined || downDep.dependencyType !== "replacement") {
        downDep = unproxiedComponent.downstreamDependencies[composite.componentName] = {
          dependencyType: "replacement",
          component: new Proxy(composite, readOnlyProxyHandler),
          topLevel: topLevel,
        };
      }
      if(inactive) {
        if(changeToInactive) {
          downDep.inactive = true;
        }
      }else {
        delete downDep.inactive;
      }

      this.registerCompositeDependencies({
        composite: composite,
        components: unproxiedComponent.definingChildren,
        inactive: inactive,
        changeToInactive: changeToInactive
      });
    }
  }

  deregisterCompositeDependencies({composite, components}) {

    for(let component of components) {
      let unproxiedComponent = this._components[component.componentName];
      delete composite.upstreamDependencies[component.componentName];
      delete unproxiedComponent.downstreamDependencies[composite.componentName];

      this.deregisterCompositeDependencies({
        composite: composite,
        components: unproxiedComponent.definingChildren
      });

    }
  }

  matchChildren({componentClass,activeChildren, applySugar = false,
      applyAdapters = true, definingChildren, allChildren, trackChanges}) {

    // determine maximum number of adapters on any child
    let maxNumAdapters=0;
    if(applyAdapters === true) {
      for(let child of activeChildren) {
        let n = child.nAdapters;
        if(n > maxNumAdapters) {
          maxNumAdapters = n;
        }
      }
    }

    let numAdaptersUsed = 0;
    let childLogicResult = undefined;

    for(; numAdaptersUsed <= maxNumAdapters; numAdaptersUsed++) {
      let oldChildLogicResult = childLogicResult;
      childLogicResult = this.verifyChildren({
        componentClass: componentClass,
        activeChildren: activeChildren,
        applySugar: applySugar,
        maxAdapterNumber: numAdaptersUsed,
        definingChildren: definingChildren,
        allChildren: allChildren,
        appliedAdapters: applyAdapters,
        trackChanges: trackChanges,
      });
      if(oldChildLogicResult !== undefined) {
        mergeFailures(childLogicResult, oldChildLogicResult);
      }
      if(childLogicResult.success === true) {
        break;
      }
    }

    if(childLogicResult.success !== true) {
      return childLogicResult;
      // throw Error(childLogicResult.message);
    }

    let childLogic = childLogicResult.childLogic;

    if(numAdaptersUsed > 0) {

      let adapterResults = childLogic.logicResult.adapterResults;
      // replace activeChildren with their adapters
      for(let childNum in adapterResults) {

        let unproxiedOriginalChild = this._components[activeChildren[childNum].componentName];

        let newSerializedChild = adapterResults[childNum];
        let adapter = unproxiedOriginalChild.adapterUsed;

        if(adapter === undefined || adapter.componentType !== newSerializedChild.componentType) {
          let newChildrenResult = this.createIsolatedComponentsSub({
            serializedState: [newSerializedChild],
            applySugar: false,
            shadow: true,
            trackChanges: trackChanges,
          });
          mergeFailures(childLogicResult, newChildrenResult);

          adapter = new Proxy(newChildrenResult.components[0], readOnlyProxyHandler);

          // put adapter used directly on originalChild for quick access
          unproxiedOriginalChild.adapterUsed = adapter;
        }

        // Replace originalChild with its adapter in activeChildren
        activeChildren.splice(childNum, 1, adapter);

        // Update allChildren to show that originalChild is no longer active
        // and that adapter is now an active child
        delete allChildren[unproxiedOriginalChild.componentName].activeChildrenIndex;
        allChildren[adapter.componentName] = {
          activeChildrenIndex: Number(childNum),  // childNum is string since was defined via in
          component: adapter,
        }
      }

    }

    return childLogicResult;
  }

  verifyChildren({componentClass, activeChildren, applySugar,
      maxAdapterNumber, definingChildren, allChildren, appliedAdapters, trackChanges}) {
    // verify if activeChildren satisfy the component logic of componentClass
    // if applySugar, possibly delete some activeChildren and create new activeChildren

    let overallResults = {
      numUnresolvedStateVariables: {},
      unresolvedComponents: new Set([]),
      unsatisifiedChildLogic: new Set([]),
      unresolvedByDependent: {},
    }

    let childLogic = componentClass.returnChildLogic({
      standardComponentTypes: this.standardComponentTypes,
      allComponentClasses: this.allComponentClasses,
      components: this.components,
      sharedParameters: this.parameterStack.parameters,
    });

    if(childLogic === undefined || typeof childLogic.applyLogic !== "function") {
      throw Error("Invalid component class " + componentClass.componentType +
        ": returnChildLogic must return a childLogic object")
    }

    let childLogicResult = childLogic.applyLogic({
      activeChildren: activeChildren,
      allChildren: allChildren,
      definingChildren: definingChildren,
      applySugar: applySugar,
      maxAdapterNumber: maxAdapterNumber,
      sharedParameters: this.parameterStack.parameters,
    });

    if(childLogicResult.success === false) {
      // childLogicResult.message = "Can't create component of type " + componentClass.componentType
      //   + " because it doesn't have the right children. " + childLogicResult.message;
      overallResults.childLogic = childLogic;
      overallResults.success = false;
      return overallResults;
    }

    let sugarRepeats = 0;

    // check to see if sugar was used in childLogic
    while(childLogicResult.sugarResults !== undefined) {
      // sugar was used to make the match.
      // We need to replace the matched components with sugar formula

      let result = this.replaceChildrenBySugar({
        sugarResults: childLogicResult.sugarResults,
        activeChildren: activeChildren,
        componentType: componentClass.componentType,
        definingChildren: definingChildren,
        allChildren: allChildren,
        appliedAdapters: appliedAdapters,
        trackChanges: trackChanges,
      });

      mergeFailures(overallResults, result);

      let allowSugar = false;
      if(childLogicResult.repeatSugar === true && sugarRepeats < 5) {
        sugarRepeats++;
        allowSugar = true;
      }

      // repeat child logic
      childLogicResult=childLogic.applyLogic({
        activeChildren: activeChildren,
        definingChildren: definingChildren,
        allChildren: allChildren, 
        applySugar: allowSugar,
        aliasMap: this.aliasMap,
        sharedParameters: this.parameterStack.parameters,
      });
      
      if(childLogicResult.success === false) {
        // throw Error("Error in sugar of component of type " + componentClass.componentType
        //   + ". " + childLogicResult.message);
        overallResults.childLogic = childLogic;
        overallResults.success = false;
        return overallResults;
      }
    }
    // console.log("Result of component logic for " + componentClass.componentType);
    // console.log(childLogicResult);

    // set componentIsAProperty based on child logic
    let propertyChildIndices = childLogic.returnMatches("_properties");
    if (propertyChildIndices !== undefined){
      for (let childIndex of propertyChildIndices){
        let unproxiedChild = this._components[activeChildren[childIndex].componentName]
        unproxiedChild.componentIsAProperty = true;
        while(allChildren[unproxiedChild.componentName].definingChildrenIndex === undefined) {
          // if child isn't a defining child, it must be a replacement
          // need to make composite as a property
          // look for replacement downstream dependency
          let foundComposite = false;
          for(let depName in unproxiedChild.downstreamDependencies) {
            let dep = unproxiedChild.downstreamDependencies[depName];
            if(dep.dependencyType === "replacement") {
              foundComposite = true;
              unproxiedChild = this._components[dep.component.componentName];
              unproxiedChild.componentIsAProperty = true;
              break;
            }
          }
          // if didn't find composite (which shouldn't happen), give up
          if(!foundComposite) {
            break;
          }
        }
      }
    }
 
    overallResults.childLogic = childLogic;
    overallResults.success = true;
    return overallResults;

  }

  replaceChildrenBySugar({sugarResults, activeChildren,
    componentType, definingChildren, allChildren, appliedAdapters, trackChanges}) {

    let failures = {
      numUnresolvedStateVariables: {},
      unresolvedComponents: new Set([]),
      unsatisifiedChildLogic: new Set([]),
      unresolvedByDependent: {},
    }
    
    if(Array.isArray(sugarResults)) {
      // recurse to next level
      for(let ind in sugarResults) {
        let result = this.replaceChildrenBySugar({
          sugarResults: sugarResults[ind],
          activeChildren: activeChildren,
          componentType: componentType,
          definingChildren: definingChildren,
          allChildren: allChildren,
          trackChanges: trackChanges,
        });
        mergeFailures(failures, result);

      }
    }else if(sugarResults !== undefined) {

      // find defining childen indices for the children matched
      // at the same time, swap out active child for matching defining child
      // in newChildren
      for(let change of sugarResults.baseChanges) {
        let result = this.replaceDefiningChildrenBySugar({
          componentType: componentType,
          allChildren: allChildren, 
          sugarResults: change,
          definingChildren: definingChildren,
          trackChanges: trackChanges,
        });
        mergeFailures(failures, result);

      }

      // recreate activeChildren and allChildren
      let prevActiveNumber = activeChildren.length;
      activeChildren.splice(0, prevActiveNumber, ...definingChildren);

      for(let key in allChildren) {
        delete allChildren[key];
      }
      for(let ind=0; ind < activeChildren.length; ind++) {
        let child = activeChildren[ind];
        allChildren[child.componentName] = {
          activeChildrenIndex: ind,
          definingChildrenIndex: ind,
          component: child,
        };
      }

      // if any of activeChildren are compositeComponents
      // replace with new components given by the composite component
      this.replaceCompositeChildren({activeChildren: activeChildren, allChildren: allChildren});

      if(sugarResults.childChanges === undefined) {
        return failures;
      }

      for(let childName in sugarResults.childChanges) {
        let changes = sugarResults.childChanges[childName];

        if(allChildren[childName].definingChildrenIndex === undefined) {
          throw Error("Invalid sugar logic for component of type " + componentType
          + ": can change only defining children");
        }

        let child = this._components[childName];

        this.parameterStack.push(child.sharedParameters, false);

        let result = this.replaceDefiningChildrenBySugar({
          activeChildIndices: changes.activeChildrenIndicesMatched, 
          componentType: componentType,
          allChildren: child.allChildren, 
          sugarResults: changes,
          definingChildren: child.definingChildren,
          trackChanges: trackChanges,
        });
        
        this.parameterStack.pop();

        mergeFailures(failures, result);

        trackChanges.recordChildrenChanged(childName);


        let childResults = this.deriveChildResultsFromDefiningChildren({
          componentClass: this.allComponentClasses[child.componentType],
          definingChildren: child.definingChildren,
          applySugar: false,
          applyAdapters: appliedAdapters,
          trackChanges: trackChanges,
        });
        mergeFailures(failures, childResults);

        child.activeChildren = childResults.activeChildren;
        child.allChildren = childResults.allChildren;
        child.childLogic = childResults.childLogic;
        child.gatherDescendants();

        child.setTrackChanges(trackChanges);
        child.updateState();

      }
    }

    return failures;

  }

  replaceDefiningChildrenBySugar({definingChildren, allChildren,
    sugarResults, trackChanges
  }) {

    // delete the string children specified by childrenToDelete
    if (sugarResults.childrenToDelete !== undefined) {
      for (let componentName of sugarResults.childrenToDelete) {
        let component = this._components[componentName];
        for (let name in component.downstreamDependencies) {
          let downDep = component.downstreamDependencies[name];
          let unproxiedDownDepComponent = this._components[downDep.component.componentName];
          // unproxiedDownDepComponent could have been deleted
          // in earlier pass through loop
          // so first check if it is still defined
          if (unproxiedDownDepComponent !== undefined) {
            unproxiedDownDepComponent.upstreamDependencies[component.componentName];
            delete unproxiedDownDepComponent.upstreamDependencies[component.componentName];
          }
        }
        delete allChildren[componentName];
        this.deregisterComponent(component);
      }
    }

    let childrenResult = this.createIsolatedComponentsSub({
      serializedState: sugarResults.newChildren,
      applySugar: true,
      trackChanges: trackChanges,
    });

    let newChildren = childrenResult.components.map(x => new Proxy(x, readOnlyProxyHandler));
    // insert the replacments in definingChildren
    definingChildren.splice(sugarResults.firstDefiningIndex,
      sugarResults.nDefiningIndices, ...newChildren);

    return childrenResult;

  }


  registerComponent(component) {
    this._components[component.componentName] = component;
  }

  deregisterComponent(component, recursive=true) {
    if(recursive === true) {
      for(let child of component.activeChildren) {
        this.deregisterComponent(child);
      }
    }
    if(component.doenetAttributes !== undefined) {
      let alias = component.doenetAttributes.componentAlias;
      if(alias !== undefined) {
        delete this._aliasMap[alias];
      }
    }
    delete this._components[component.componentName];
  }

  setAncestors(component, ancestors = []) {

    // set answers based on allChildren
    // so that all components get ancestors
    // even if not activeChildren or definingChildren

    component.ancestors = ancestors;

    // check if component is a gathered descendant of any ancestor
    let ancestorsWhoGathered = [];
    for(let anc of ancestors) {
      if(anc.descendantsFound) {
        let wasGathered = false;
        for(let key in anc.descendantsFound) {
          for(let comp of anc.descendantsFound[key]) {
            if(comp.componentName === component.componentName) {
              ancestorsWhoGathered.push(anc.componentName);
              wasGathered = true;
              break;
            }
          }
          if(wasGathered) {
            break;
          }
        }
      }
    }
    if(ancestorsWhoGathered.length > 0) {
      component.ancestorsWhoGathered = ancestorsWhoGathered;
    }else {
      delete component.ancestorsWhoGathered;
    }

    let ancestorsForChildren = [new Proxy(component, readOnlyProxyHandler), ...component.ancestors];

    for(let childName in component.allChildren) {
      let unproxiedChild = this._components[childName];
      this.setAncestors(unproxiedChild, ancestorsForChildren);
    }
  }

  addChildren({parent, indexOfDefiningChildren, newChildren, trackChanges,
      propagateUpdate = true}) {

    // throw error if parent is a downstream dependency of newChildren
    this.checkForCircularAdd(parent, newChildren);

    this.spliceChildren(parent, indexOfDefiningChildren, newChildren);

    let newChildrenResult = this.processNewDefiningChildren({parent: parent, trackChanges: trackChanges});

    let addedComponents = {};
    let deletedComponents = {};

    newChildren.forEach(x => addedComponents[x.componentName] = x);

    if(propagateUpdate === true) {

      // update this component and all upstream components
      // Note: the newChildren are the definingChildren of parent

      let componentChanges = [];
      let componentsAdded = {
        changeType: "added",
        parent: parent,
        newChildren: newChildren,
        indexOfDefiningChildren: indexOfDefiningChildren,
      };

      componentChanges.push(componentsAdded);

      let updateResults = this.upstreamUpdate({
        components: [parent.componentName],
        componentChanges: componentChanges,
        trackChanges: trackChanges
      });

      Object.assign(deletedComponents, updateResults.deletedComponents);
      Object.assign(addedComponents, updateResults.addedComponents);

    }

    this.updateRenderers({componentNames: [parent.componentName]});

    if(!newChildrenResult.success) {
      return newChildrenResult;
    }

    return {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
    }
  }

  processNewDefiningChildren({parent, applySugar=false, trackChanges}) {

    this.parameterStack.push(parent.sharedParameters, false);
    let childResult = this.deriveChildResultsFromDefiningChildren({
      componentClass: parent.constructor,
      definingChildren: parent.definingChildren,
      applySugar: applySugar,
      applyAdapters: true,
      trackChanges: trackChanges,
    });
    this.parameterStack.pop();

    parent.activeChildren = childResult.activeChildren;
    parent.allChildren = childResult.allChildren;
    parent.childLogic = childResult.childLogic;
    parent.gatherDescendants();

    console.log("new children for " + parent.componentName);
    trackChanges.recordChildrenChanged(parent.componentName);

    // gather descendants of ancestors
    for(let ancestor of parent.ancestors) {
      let unproxiedAncestor = this._components[ancestor.componentName];
      unproxiedAncestor.gatherDescendants();
    }

    let ancestorsForChildren = [new Proxy(parent, readOnlyProxyHandler), ...parent.ancestors];

    // set ancestors for allChildren of parent
    // since could replace newChildren by adapters or via composites
    for(let childName in parent.allChildren) {
      let unproxiedChild = this._components[childName];
      this.setAncestors(unproxiedChild, ancestorsForChildren);
    }

    // found a failure
    // TODO: where get error message?
    let newNumUnresolvedStateVariables = 0;
    for(let componentName in childResult.numUnresolvedStateVariables) {
      newNumUnresolvedStateVariables += childResult.numUnresolvedStateVariables[componentName];
    }
    if(newNumUnresolvedStateVariables + childResult.unresolvedComponents.size
      + childResult.unsatisifiedChildLogic.size > 0 ||
      !childResult.childLogic.logicResult.success) {
      console.warn(`Cannot derive child results for ${parent.componentName}.  Need informative error message here.`)
      parent.childLogic = childResult.childLogic;

      childResult.success = false;
      return childResult;

    };

    return {success: true};

  }

  checkForCircularAdd(parent, newChildren) {
    // TODO: what is the equivalent for the new system that has
    // circular dependencies?

    // check if parent is a downstream dependency of any newChildren

    // let newChildrenDownDeps = this.findAllDownstreamDependenciesChildren(newChildren);

    // if(parent.componentName in newChildrenDownDeps) {
    //   throw Error("Cannot add components to " + parent.componentName + " as it would create a circular dependency.")
    // }

  }

  findAllDownstreamDependenciesChildren(components) {
    // Recursively gather all downstream dependencies and children of components.
    // returns a set of componentNames
    // includes inactive downstreamDependencies

    let downDeps = new Set([]);

    for(let component of components) {
      let allChildrenDownstreamComponents = component.getAllChildrenDownstreamComponents(true);
      allChildrenDownstreamComponents.forEach(x=> downDeps.add(x.componentName))
      let recurseDowndeps = this.findAllDownstreamDependenciesChildren(allChildrenDownstreamComponents);
      recurseDowndeps.forEach(x => downDeps.add(x));
    }

    return downDeps;

  }

  spliceChildren(parent, indexOfDefiningChildren, newChildren) {
    // splice newChildren into parent.definingChildren
    // definingChildrenNumber is the index of parent.definingChildren
    // before which to splice the newChildren (set to array length to add at end)

    let numDefiningChildren = parent.definingChildren.length;

    if(!Number.isInteger(indexOfDefiningChildren) ||
        indexOfDefiningChildren > numDefiningChildren ||
        indexOfDefiningChildren < 0) {
      throw Error("Can't add children at index " + indexOfDefiningChildren + ". Invalid index.");
    }

    let newProxiedChildren = newChildren.map(x => new Proxy(x,readOnlyProxyHandler));

    // perform the actual splicing into children
    parent.definingChildren.splice(indexOfDefiningChildren, 0, ...newProxiedChildren);

  }

  deleteComponents({components, deleteUpstreamDependencies = true,
      cancelIfUpstreamDeleteFailure = true, dryRun = false,
      propagateUpdate = true,
      componentChanges, sourceOfUpdate, trackChanges,
    }) {

    // to delete a component, one must
    // 1. recursively delete all children
    // 3. should we delete or mark components who are upstream dependencies?
    // 4. for all other downstream dependencies, 
    //    delete upstream link back to component

    if(!Array.isArray(components)) {
      components = [components];
    }

    // TODO: if delete a shadow directly it should be an error
    // (though it will be OK to delete them through other side effects)

    // step 1. Determine which components to delete
    const componentsToDelete = {}
    this.determineComponentsToDelete({
      components: components,
      deleteUpstreamDependencies: deleteUpstreamDependencies,
      componentsToDelete: componentsToDelete
    });
    

    //TODO: figure out if it's OK to delete our children by asking the references to our children 

    //Ask parent if we can be deleted
    //Calculate parent set
    const parentsOfPotentiallyDeleted = {};
    for(let componentName in componentsToDelete) {
      let component = componentsToDelete[componentName];
      let parent = component.parent;

      // only add parent if it is not in componentsToDelete itself
      if(parent=== undefined || parent.componentName in componentsToDelete) {
        continue;
      }
      let parentObj = parentsOfPotentiallyDeleted[component.parent.componentName];
      if (parentObj === undefined){
        parentObj = 
        {parent: this._components[component.parent.componentName],
          definingChildrenNames: new Set(),
        }
        parentsOfPotentiallyDeleted[component.parent.componentName] = parentObj;
      }
      parentObj.definingChildrenNames.add(componentName);
    }
    
    let goAheadAndDelete = true;

    let allChildResults = {};
    let remainingDefiningChildren = {};


    // if component is a replacement of another component,
    // need to delete component from the replacement
    // so that it isn't added back as a child of its parent
    // Also keep track of which ones deleted so can add back to replacements
    // if the deletion is unsuccessful
    let replacementsDeleted = {};

    for(let componentName in componentsToDelete) {
      let component = this._components[componentName];
      for(let downDepName in component.downstreamDependencies) {
        let downDepComponent = this._components[downDepName];
        if(downDepComponent !== undefined) {
          if(component.downstreamDependencies[downDepName].dependencyType === "replacement") {
          // component to delete is a replacement, delete from replacements of composite
            for(let [ind,replacement] of downDepComponent.replacements.entries()) {
              if(replacement.componentName === component.componentName) {
                let rdObj = replacementsDeleted[downDepName];
                if(rdObj === undefined) {
                  rdObj = replacementsDeleted[downDepName] = [];
                }
                rdObj.push({ind: ind, replacement: downDepComponent.replacements[ind]});
                downDepComponent.replacements.splice(ind,1);
              }
            }
          }
        }
      }
    }

    // delete component from parent's defining children
    // (as a separate copy so that can test if it will work)
    for(let parentName in parentsOfPotentiallyDeleted){
      let parentObj = parentsOfPotentiallyDeleted[parentName];
      let parent = parentObj.parent;

      // create array of remaining defining children of parent
      let definingChildren = parent.definingChildren.slice();

      for(let ind = definingChildren.length-1; ind >=0; ind--) {
        let child = definingChildren[ind];
        if(parentObj.definingChildrenNames.has(child.componentName)) {
          definingChildren.splice(ind,1);  // delete from array
        }
      }

      remainingDefiningChildren[parentName] = definingChildren;
    

      // with new defining children and adjusted replacements
      // determine if parent can accept the active children that result
      let childResult;
      this.parameterStack.push(parent.sharedParameters, false);
      try {
        childResult = this.deriveChildResultsFromDefiningChildren({
          componentClass: parent.constructor,
          definingChildren: definingChildren,
          applySugar: false,
          applyAdapters: true,
          trackChanges: trackChanges,
        });

        // if .map(x=>x.componentName)found a failure that didn't throw error, don't attempt to recover
        let newNumUnresolvedStateVariables = 0;
        for(let componentName in childResult.numUnresolvedStateVariables) {
          newNumUnresolvedStateVariables += childResult.numUnresolvedStateVariables[componentName];
        }
        if(newNumUnresolvedStateVariables + childResult.unresolvedComponents.size
          + childResult.unsatisifiedChildLogic.size > 0 ||
          !childResult.childLogic.logicResult.success) {
          console.log("***** can't delete because couldn't derive child results");
          goAheadAndDelete = false;
        };
      }catch(e) {
        console.log("***** can't delete because couldn't derive child results");
        goAheadAndDelete = false;
      }

      this.parameterStack.pop();


      allChildResults[parentName] = childResult;

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
    if(goAheadAndDelete === false && deleteUpstreamDependencies === true &&
        cancelIfUpstreamDeleteFailure !== true) {
      console.log("**** Need to determine whether or not can delete components and leave upstream in place")
    }

    if(goAheadAndDelete === false) {
      console.log("Failed to delete components");

      // put any deleted replacements back in
      for(let downDepName in replacementsDeleted) {
        let rdObj = replacementsDeleted[downDepName];
        let downDepComponent = this._components[downDepName];
        while(rdObj.length > 0) {
          let rdInfo = rdObj.pop();
          downDepComponent.replacements.splice(rdInfo.ind, 0, rdInfo.replacement)
        }
      }

      return {success: false };
    }

    // TODO: use allChildResults in later call so that can delete efficiently
    if(dryRun === true) {
      return {success: true, allChildResults: allChildResults};
    }

    let allParents = [];

    // actually delete the components
    for(let parentName in parentsOfPotentiallyDeleted){
      let parentObj = parentsOfPotentiallyDeleted[parentName];
      let parent = parentObj.parent;

      let childResult = allChildResults[parentName];

      parent.definingChildren = remainingDefiningChildren[parentName];
      parent.activeChildren = childResult.activeChildren;
      parent.allChildren = childResult.allChildren;
      parent.childLogic = childResult.childLogic;
      parent.gatherDescendants();

      allParents.push(parent);

      // console.log("deleted children of " + parent.componentName);
      trackChanges.recordChildrenChanged(parent.componentName);
  
    }

    for(let componentName in componentsToDelete) {
      let component = this._components[componentName];

      // don't use recursive form since all children should already be included
      this.deregisterComponent(component, false);

      // remove any dependencies to the deleted componentn
      // always check if component is defined
      // in case it was already deleted earlier in the loop
      for(let upDepName in component.upstreamDependencies) {
        let upDepComponent = this._components[upDepName];
        if(upDepComponent !== undefined) {
          delete upDepComponent.downstreamDependencies[component.componentName];
        }
      }
      for(let downDepName in component.downstreamDependencies) {
        let downDepComponent = this._components[downDepName];
        if(downDepComponent !== undefined) {
          delete downDepComponent.upstreamDependencies[component.componentName];
        }
      }
    }

    let deletedComponents = componentsToDelete;

    if(propagateUpdate !== true) {
      return {success: true, deletedComponents: deletedComponents, parentsOfDeleted: allParents};
    }

    // update this component and all upstream components

    componentChanges = [];
    let componentsDeleted = {
      changeType: "deleted",
      parentsOfDeleted: parentsOfPotentiallyDeleted,
      deletedComponents: deletedComponents,
    };

    componentChanges.push(componentsDeleted);

    let updateResults = this.upstreamUpdate({
      componentNames: allParents.map(x=>x.componentName),
      componentChanges: componentChanges
    });

    Object.assign(deletedComponents, updateResults.deletedComponents);

    let addedComponents = updateResults.addedComponents;

    this.finishUpdate({
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
    })

    return {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents
    };
  }

  finishUpdate({deletedComponents, addedComponents, init= false}={}) {

    // for now, reinitialize all renderers
    // TODO: initialize just those renderers that changed
    // (maybe as part of updates, like upstreamupdates?)
    //Should only be called on new components

    //this.initializeRenderers([this._components['__document1']]);

    this.rebuildRenderComponents();

    if(init === false) {
      this.update({doenetTags:this._renderComponents});
    }
  }

  determineComponentsToDelete({components, deleteUpstreamDependencies, componentsToDelete}) {
    for(let component of components) {
      if(component.componentName in componentsToDelete) {
        continue;
      }

      // add unproxied component
      componentsToDelete[component.componentName] = this._components[component.componentName];

      // recurse on allChildren
      this.determineComponentsToDelete({
        components: Object.values(component.allChildren).map(x => x.component),
        deleteUpstreamDependencies: deleteUpstreamDependencies,
        componentsToDelete: componentsToDelete
      });

      if(deleteUpstreamDependencies === true) {
        // recurse on upstream dependencies that are base references or replacements or adapters
        let upstreamToDelete = [];
        for(let upDepName in component.upstreamDependencies) {
          let upDep = component.upstreamDependencies[upDepName];
          if(upDep.baseReference === true ||
            upDep.dependencyType === "replacement" ||
            upDep.dependencyType === "adapter") {
            upstreamToDelete.push(upDep.component);
          }
        }
        if(upstreamToDelete.length > 0) {
          this.determineComponentsToDelete({
            components: upstreamToDelete,
            deleteUpstreamDependencies: deleteUpstreamDependencies,
            componentsToDelete: componentsToDelete
          });
        }
      }
    }
  }

  upstreamUpdate({componentNames=[], componentChanges=[], sourceOfUpdate, trackChanges,
    initialFailures}) {
    
    let unsatisifiedChildLogic = new Set();
    let previousUnresolvedStateVariables = {};

    let numAttemptsFailuresNotReduced = 0;

    if(initialFailures) {
      let unresolvedComponents = Array.from(initialFailures.unresolvedComponents);
      unsatisifiedChildLogic = initialFailures.unsatisifiedChildLogic;
      Object.assign(previousUnresolvedStateVariables, initialFailures.numUnresolvedStateVariables);
      componentNames = [...componentNames, ...unresolvedComponents, ...unsatisifiedChildLogic];
    }

    if(!trackChanges) {
      trackChanges = new TrackChanges({
        BaseComponent: this.allComponentClasses._base,
        components: this.components
      });
    }

    let numFailures = Infinity;
    // use componentNames as stand in for previously unresolved components
    let previousUnresolvedComponents = new Set([...componentNames]);
    let componentsUpdated = new Set();
    let addedComponents = {};
    let deletedComponents = {};

    while(true) {

      let updateResults = this.upstreamUpdateSub({
        componentNames: componentNames,
        componentChanges: componentChanges,
        sourceOfUpdate: sourceOfUpdate,
        trackChanges: trackChanges,
      });

      for(let componentName of updateResults.componentsUpdated) {
        componentsUpdated.add(componentName);
      }

      Object.assign(addedComponents, updateResults.addedComponents);
      Object.assign(deletedComponents, updateResults.deletedComponents);

      // check if any child logic is satisfied
      for(let componentName of unsatisifiedChildLogic) {
        if(this._components[componentName].childLogicSatisfied) {
          unsatisifiedChildLogic.delete(componentName)
        }
      }
      // add any additional unsatisfied child logic
      for(let componentName of updateResults.unsatisifiedChildLogic) {
        unsatisifiedChildLogic.add(componentName);
      }

      let newNumUnresolvedStateVariables = 0;
      for(let componentName in previousUnresolvedStateVariables) {
        if(componentName in updateResults.numUnresolvedStateVariables) {
          previousUnresolvedStateVariables[componentName] = updateResults.numUnresolvedStateVariables[componentName];
          newNumUnresolvedStateVariables += updateResults.numUnresolvedStateVariables[componentName];
        }else {
          let numStillUnresolved = 0;
          if(componentName in this.components) {
            numStillUnresolved = Object.keys(this.components[componentName].unresolvedState).length;
          }
          if(numStillUnresolved > 0) {
            previousUnresolvedStateVariables[componentName] = numStillUnresolved;
            newNumUnresolvedStateVariables += numStillUnresolved;
          }else {
            delete previousUnresolvedStateVariables[componentName];
          }
        }
      }
      for(let componentName in updateResults.numUnresolvedStateVariables) {
        if(!(componentName in previousUnresolvedStateVariables)) {
          previousUnresolvedStateVariables[componentName] = updateResults.numUnresolvedStateVariables[componentName];
          newNumUnresolvedStateVariables += updateResults.numUnresolvedStateVariables[componentName];
        }
      }
      updateResults.numUnresolvedStateVariables = previousUnresolvedStateVariables;
      let newNumFailures = unsatisifiedChildLogic.size + newNumUnresolvedStateVariables
        + updateResults.unresolvedComponents.size;
      console.log("***********Summary of update loop*********");
      console.log(`Total number of failures: ${newNumFailures}`);
      console.log(`Unresolved childlogic: ${unsatisifiedChildLogic.size}, state variables: ${newNumUnresolvedStateVariables}`
        + `, components: ${updateResults.unresolvedComponents.size}`)
      console.log(updateResults);
      console.log(this._components);

      if(newNumFailures === 0) {
        break;
      }

      // if number of failures increased and no components were newly resolved
      // (or newly satisfied child logic) then we can't continue
      if(newNumFailures >= numFailures ) {
        numAttemptsFailuresNotReduced++;

        // check if any component was newly resolved
        let newlyResolvedComponent = false;
        for(let name of previousUnresolvedComponents) {
          if(!updateResults.unresolvedComponents.has(name) 
            && !updateResults.unsatisifiedChildLogic.has(name)) {
            newlyResolvedComponent = true;
            break;
          }
        }
        
        if(!newlyResolvedComponent || numAttemptsFailuresNotReduced > 10) {
          return {success: false, message: updateResults.lastMessage};
        }
      }

      previousUnresolvedComponents = new Set([...updateResults.unresolvedComponents, ...updateResults.unsatisifiedChildLogic]);
    
      // create unresolvedComponents to start the next update loop
      // if a component has newly resolved dependents
      // put them at the beginning of the array
      let unresolvedComponents = [];
      for(let name of updateResults.withNewlyResolvedDependents) {
        if(updateResults.unresolvedComponents.has(name)) {
          if(this.components[name]) {
            // make sure component wasn't deleted
            unresolvedComponents.push(name);
          }
        }
      }
      for(let name of updateResults.unresolvedComponents) {
        if(!updateResults.withNewlyResolvedDependents.has(name)) {
          if(this.components[name]) {
            // make sure component wasn't deleted
            unresolvedComponents.push(name);
          }
        }
      }
      trackChanges.reset();
      trackChanges.allowSelectExpands = true;
      componentNames = [...unresolvedComponents, ...unsatisifiedChildLogic];
      numFailures = newNumFailures;

    }

    for(let graphRenderer of this._graphRenderComponents) {
      graphRenderer.setToLowQualityRender();
    }


    let componentsToUpdateRenderers = [];
    let componentsToUpdateRenderersRecursively = [];
    
    // update renderers and recurse to children for all new components
    // as long as they are in childrenWhoRender of parent or have no parent (i.e., is document)

    for(let componentName in addedComponents) {
      let unproxiedComponent = this._components[componentName];
      if(unproxiedComponent !== undefined) {
        let parent = unproxiedComponent.ancestors[0];
        if(parent === undefined || parent.childrenWhoRender.includes(componentName)) {
          componentsToUpdateRenderersRecursively.push(componentName)
        }
      }
    }

    // update renderers for all source components and all components who changed
    // as long as they are in childrenWhoRender of parent or have no parent (i.e., is document)

    for(let componentName of componentsUpdated) {
      if(!(componentName in addedComponents)) {
        let unproxiedComponent = this._components[componentName];
        if(unproxiedComponent !== undefined) {
          let parent = unproxiedComponent.ancestors[0];
          if(parent === undefined || parent.childrenWhoRender.includes(componentName)) {
            componentsToUpdateRenderers.push(componentName)
          }
        }
      }
    }

    // in case a source component wasn't updated, add it anyway
    // (Its renderer could have initiated a change, which must be set back to original value)
    if(sourceOfUpdate !== undefined) {
      for(let componentName in sourceOfUpdate.instructionsByComponent) {
        if(!(componentsToUpdateRenderers.includes(componentName) || componentName in addedComponents)) {
          let unproxiedComponent = this._components[componentName];
          if(unproxiedComponent !== undefined) {
            let parent = unproxiedComponent.ancestors[0];
            if(parent === undefined || parent.childrenWhoRender.includes(componentName)) {
            componentsToUpdateRenderers.push(componentName)
            }
          }
        }
      }
    }

    this.updateRenderers({
      componentNames: componentsToUpdateRenderersRecursively,
      sourceOfUpdate: sourceOfUpdate,
      recurseToChildren: true,
    })

    this.updateRenderers({
      componentNames: componentsToUpdateRenderers,
      sourceOfUpdate: sourceOfUpdate,
      recurseToChildren: false,
    })

    for(let graphRenderer of this._graphRenderComponents) {
      graphRenderer.setToHighQualityRenderAndUpdate();
    }

    return {
      success: true,
      addedComponents: addedComponents,
      deleteComponents: deletedComponents,
      componentsUpdated: componentsUpdated,
    }
  }

  upstreamUpdateSub({componentNames, componentChanges, sourceOfUpdate, trackChanges}){
    
    let updateResults = {
      numUnresolvedStateVariables: {},
      unresolvedComponents: new Set([]),
      unsatisifiedChildLogic: new Set([]),
      unresolvedByDependent: {},
      addedComponents: {},
      deletedComponents: {},
      withNewlyResolvedDependents: new Set([]),
      componentsUpdated: new Set(),
    }


    let toUpdate = new Set(componentNames);

    let initialRemaining = componentNames.length;

    let count = 0;

    for(let componentName of toUpdate) {
      toUpdate.delete(componentName);
      let component = this._components[componentName];
      if(component === undefined) {
        // component must have been deleted since was added to list
        continue;
      }
      this.upstreamUpdateSingle({
        component: this._components[componentName],
        toUpdate: toUpdate,
        updateResults: updateResults,
        componentChanges: componentChanges,
        sourceOfUpdate: sourceOfUpdate,
        trackChanges: trackChanges,
        init: initialRemaining > 0,
      });
      initialRemaining--;
      count+=1;

      updateResults.componentsUpdated.add(componentName);
      if(count > 10000) {
        // TODO: remove this check.
        // Just here for debugging in case get infinite loops
        throw Error("too much")
      }
    }

    let compositesChanged = new Set([])
    for(let change of componentChanges) {
      if(change.composite !== undefined && change.composite.componentName in this._components) {
        compositesChanged.add(change.composite.componentName);
      }
    }
    for(let compositeName of compositesChanged) {
      this.registerCompositeDependencies({ composite: this._components[compositeName]});
    }

    return updateResults;

  }

  upstreamUpdateSingle({component, toUpdate, updateResults, 
    componentChanges, sourceOfUpdate,
    trackChanges, init=false}){

    // console.log("upstream update for " + component.componentName);

    const unproxiedComponent = this._components[component.componentName];

    unproxiedComponent.setTrackChanges(trackChanges);
    trackChanges.resetRecentChangeOccurred();

    if(unproxiedComponent.unresolvedDependencies) {
      // if have a list of unresolved dependents
      // delete component from their lists
      for(let dep of Object.keys(unproxiedComponent.unresolvedDependencies)) {
        let dObj = updateResults.unresolvedByDependent[dep.componentName];
        if(dObj === undefined) {
          continue;
        }
        dObj.delete(unproxiedComponent.componentName);
      }
    }

    if(!unproxiedComponent.childLogicSatisfied) {
      this.parameterStack.push(unproxiedComponent.sharedParameters, false);
      let childResults = this.deriveChildResultsFromDefiningChildren({
        componentClass: unproxiedComponent.constructor,
        definingChildren: unproxiedComponent.definingChildren,
        applySugar: unproxiedComponent.allowSugarForChildren,
        applyAdapters: true,
        trackChanges: trackChanges,
      });
      this.parameterStack.pop();

      unproxiedComponent.activeChildren = childResults.activeChildren;
      unproxiedComponent.allChildren = childResults.allChildren;
      unproxiedComponent.childLogic = childResults.childLogic;
      unproxiedComponent.gatherDescendants();
      for(let comp of unproxiedComponent.ancestors) {
        this._components[comp.componentName].gatherDescendants();
      }

      let ancestorsForChildren = [new Proxy(unproxiedComponent, readOnlyProxyHandler), ...unproxiedComponent.ancestors];
      for(let childName in unproxiedComponent.allChildren) {
        let unproxiedChild = this._components[childName];
        this.setAncestors(unproxiedChild, ancestorsForChildren);
      }
  
      mergeFailures(updateResults, childResults);

      if(unproxiedComponent.childLogic.logicResult.success) {
        trackChanges.recordChildrenChanged(unproxiedComponent.componentName);
      }

      // TODO: other processing from processNewDefiningChildren?
      // for example, what about gathering descdendants of ancestors?
  
    }

    unproxiedComponent.updateState({sourceOfUpdate: sourceOfUpdate});

    let numUnresolved = Object.keys(unproxiedComponent.unresolvedState).length;
    if(numUnresolved > 0) {
      updateResults.numUnresolvedStateVariables[unproxiedComponent.componentName] = numUnresolved;
    }else if(unproxiedComponent.componentName in updateResults.numUnresolvedStateVariables) {
      delete updateResults.numUnresolvedStateVariables[unproxiedComponent.componentName];
    }
  
    if(unproxiedComponent.unresolvedDependencies) {
      updateResults.unresolvedComponents.add(unproxiedComponent.componentName);

      // if have a list of unresolved dependents
      // add component to their lists
      for(let name of Object.keys(unproxiedComponent.unresolvedDependencies)) {
        let dObj = updateResults.unresolvedByDependent[name];
        if(dObj === undefined) {
          dObj = updateResults.unresolvedByDependent[name] = new Set([]);
        }
        dObj.add(unproxiedComponent.componentName);
      }
    }else {
      // component is resolved
      updateResults.unresolvedComponents.delete(unproxiedComponent.componentName);

      // if componentName is in unresolvedByDependent
      // add unresolved components that are dependent on component
      // to withNewlyResolvedDependents
      // These components will be set to be updated first in next update loop
      if(unproxiedComponent.componentName in updateResults.unresolvedByDependent) {
        for(let name of updateResults.unresolvedByDependent[unproxiedComponent.componentName]) {
          // console.log("******* adding " + name + " as unresolved dependent of " + unproxiedComponent.componentName);
          updateResults.withNewlyResolvedDependents.add(name);
        }
      }
    }

    if(!unproxiedComponent.childLogicSatisfied) {
      updateResults.unsatisifiedChildLogic.add(unproxiedComponent.componentName);
    }else {
      updateResults.unsatisifiedChildLogic.delete(unproxiedComponent.componentName);
    }

    if(component instanceof this._allComponentClasses['_composite']) {
      let updateCompositeResults = this.updateCompositeReplacements({
        component: unproxiedComponent,
        componentChanges: componentChanges,
        sourceOfUpdate: sourceOfUpdate,
        trackChanges: trackChanges,
        toUpdate: toUpdate,
      });
      Object.assign(updateResults.deletedComponents,
        updateCompositeResults.deletedComponents);
      Object.assign(updateResults.addedComponents,
        updateCompositeResults.addedComponents);

      for(let parentName of updateCompositeResults.parentsOfDeleted) {
        toUpdate.add(parentName);
      }

      mergeFailures(updateResults, updateCompositeResults);
    }

    unproxiedComponent.updateChildrenWhoRender();

    if(!(init ||
      trackChanges.checkRecentChangeOccurred() ||
      unproxiedComponent.constructor.alwaysContinueUpstreamUpdates ||
      unproxiedComponent.changedInactive ||
      unproxiedComponent.additionalComponentsToUpdate
    )) {
      // console.log("no changes occured");
      return;
    }

    delete unproxiedComponent.changedInactive;

    for(let downDepComponentName in unproxiedComponent.downstreamDependencies) {
      let unproxiedDownDep = this._components[downDepComponentName];
      if(!(unproxiedComponent.componentName in unproxiedDownDep.upstreamDependencies)) {
        let upDep = Object.assign({},
          unproxiedComponent.downstreamDependencies[downDepComponentName]);
        // replace component to refer to proxied upstream component
        upDep.component = new Proxy(unproxiedComponent, readOnlyProxyHandler); 
        unproxiedDownDep.upstreamDependencies[unproxiedComponent.componentName] = upDep;
      }
    }

    // add dependencies to toUpdate
    for(let dep of Object.values(component.upstreamDependencies)) {
      if(dep.inactive === true) {
        continue;
      }
      toUpdate.add(dep.component.componentName);
    }

    const parent = component.parent;
    if(parent !== undefined) {
      toUpdate.add(parent.componentName);
    }

    // add any components for which the component was a matched descendant
    if(component.ancestorsWhoGathered) {
      for(let name of component.ancestorsWhoGathered) {
        toUpdate.add(name);
      }
    }

    // add any additional components specified to update
    if(unproxiedComponent.additionalComponentsToUpdate) {
      for(let name of unproxiedComponent.additionalComponentsToUpdate) {
        toUpdate.add(name);
      }
      // delete array, since this is a one-time update
      delete unproxiedComponent.additionalComponentsToUpdate;
    }
  }

  downstreamUpdate(componentsToChange, trackChanges){
    const components = [];
    const downstreamStatus = {"": {}};
    for(let componentName in componentsToChange) {
      let componentObj = componentsToChange[componentName];
      components.push(componentObj.component);
      downstreamStatus[componentName] = componentObj;
    }

    let leafComponents = new Set([]);
    let otherComponentsUpdated = new Set([]);

    downstreamStatus.stateVariableChangesToSave = {};

    let toUpdate = new Set([...components].map(x=>x.componentName));

    for(let componentName of toUpdate) {
      toUpdate.delete(componentName);
      this.downstreamUpdateSub({
        component: this._components[componentName],
        toUpdate: toUpdate,
        downstreamStatus: downstreamStatus,
        leafComponents: leafComponents,
        otherComponentsUpdated: otherComponentsUpdated
      });
    }

    // change the state variables to their new values
    for(let componentName in downstreamStatus.stateVariableChangesToSave) {
      const changesToSave = downstreamStatus.stateVariableChangesToSave[componentName];
      const unproxiedComponent = this._components[componentName];
      unproxiedComponent.setTrackChanges(trackChanges);
      unproxiedComponent.changesInitiatedFromDownstream = changesToSave;

      for(let stateVariable in changesToSave) {
        let changes = changesToSave[stateVariable];

        trackChanges.addChange({
          component: unproxiedComponent,
          variable: stateVariable,
          newChanges: changes,
          mergeChangesIntoCurrent: true
        });

      }

    }

    let componentsUpdated = new Set([])
    for(let name of Array.from(leafComponents).reverse()) {
      componentsUpdated.add(name)
    }
    for(let name of Array.from(otherComponentsUpdated).reverse()) {
      componentsUpdated.add(name);
    }

    return { canUpdate: true, componentsUpdated: componentsUpdated };
  }

  downstreamUpdateSub({component, downstreamStatus, toUpdate, leafComponents, otherComponentsUpdated}){

    const status = downstreamStatus[component.componentName]; 

    const componentResult = component.downstreamUpdate({
      status: status,
    });

    if(componentResult.canUpdate !== true) {
      return;
    }

    let savedChange = false;
    let propagatedToDependents = false;
    // record any changes to make directly on the component
    // in the event that the downstream update is successful
    if(componentResult.stateVariableChangesToSave !== undefined && 
        Object.keys(componentResult.stateVariableChangesToSave).length > 0) {
      let changesToSave = downstreamStatus.stateVariableChangesToSave[component.componentName];
      if(changesToSave === undefined) {
        changesToSave = downstreamStatus.stateVariableChangesToSave[component.componentName] = {};
      }
      Object.assign(changesToSave, componentResult.stateVariableChangesToSave);
      savedChange = true;
    }

    if(componentResult.dependenciesToUpdate !== undefined && 
        Object.keys(componentResult.dependenciesToUpdate).length > 0) {
      let foundAdditionalChanges = this.mergeDependenciesToUpdate({
        newDependenciesToUpdate: componentResult.dependenciesToUpdate,
        downstreamObject: downstreamStatus
      });

      if(foundAdditionalChanges) {
        // add dependencies to toUpdate
        // sort by activeChild id, followed by definingChild id,
        // followed by remaining children, followed by other dependencies
        let numChildren = Object.keys(component.allChildren).length;
        let dependenciesWithSortKeys = Object.keys(componentResult.dependenciesToUpdate).map(
          function (name) {
            let childObj = component.allChildren[name];
            if(childObj !== undefined) {
              if(childObj.activeChildrenIndex !== undefined) {
                return {index: childObj.activeChildrenIndex, name: name};
              }
              if(childObj.definingChildrenIndex !== undefined) {
                return {index: childObj.definingChildrenIndex+numChildren, name: name}
              }
              return {index: 2*numChildren, name: name};  // child that isn't active or defining
            }
            return {index: 2*numChildren+1, name: name}; // other
          }
        )

        dependenciesWithSortKeys.sort((a,b) => a.index-b.index);

        for(let depObj of dependenciesWithSortKeys) {
          toUpdate.add(depObj.name);
        }
        propagatedToDependents = true;
      }
    }
    if(propagatedToDependents || !savedChange) {
      otherComponentsUpdated.add(component.componentName);
    } else {
      leafComponents.add(component.componentName);
    }


  }

  mergeDependenciesToUpdate({newDependenciesToUpdate, downstreamObject}) {

    let foundAdditionalChanges = false;

    for(let dependencyName in newDependenciesToUpdate) {
      let dependencyObj = newDependenciesToUpdate[dependencyName];
      let downStatus = downstreamObject[dependencyName];
      if(downStatus === undefined) {
        downStatus = downstreamObject[dependencyName] = {
          stateVariablesToUpdate: {},
        }
      }
      for(let varname in dependencyObj) {
        let dependencyVar = dependencyObj[varname];
        let downVar = downStatus.stateVariablesToUpdate[varname];
        if(dependencyVar.isArray === true) {
          if(downVar === undefined) {
            downVar = downStatus.stateVariablesToUpdate[varname] = {isArray: true, changes: {arrayComponents: {}}};
            Object.assign(downVar.changes.arrayComponents,dependencyVar.changes.arrayComponents);
            foundAdditionalChanges = true;
          }else {
            // need to merge two arrays
            for(let comp in dependencyVar.changes.arrayComponents) {
              let newComponent = dependencyVar.changes.arrayComponents[comp];
              if(newComponent === undefined) {
                continue;
              }
              let prevComponent = downVar.changes.arrayComponents[comp];
              if(prevComponent === undefined) {
                downVar.changes.arrayComponents[comp] = newComponent;
                foundAdditionalChanges = true;
                continue;
              }

              // if array components themselves are javascript arrays, merge arrays
              if(Array.isArray(newComponent) && Array.isArray(prevComponent)) {
                for(let i=0; i< newComponent.length; i++) {
                  if(prevComponent[i] === undefined && newComponent[i] !== undefined) {
                    prevComponent[i] = newComponent[i];
                    foundAdditionalChanges = true;
                  }
                }

              } else if(newComponent.tree !== undefined && prevComponent.tree !== undefined
                  && (newComponent.tree[0] === "tuple" || newComponent.tree[0] === "vector")
                  && prevComponent.tree[0] === newComponent.tree[0]) {
                // if array component is a vector, merge vectors
                let newAst = [...prevComponent.tree];
                for(let i=1; i<newComponent.tree.length; i++) {
                  if(newAst[i] === undefined && newComponent.tree[i] !== undefined) {
                    newAst[i] = newComponent.tree[i];
                    foundAdditionalChanges = true;
                  }
                }
                downVar.changes.arrayComponents[comp] = me.fromAst(newAst);
              }
            }
          }
        }else if(downVar === undefined) {
          downStatus.stateVariablesToUpdate[varname] = dependencyVar;
          foundAdditionalChanges = true;
        }else if(dependencyVar.changes.tree !== undefined && downVar.changes.tree !== undefined
            && (dependencyVar.changes.tree[0] === "tuple" || dependencyVar.changes.tree[0] === "vector")
            && downVar.changes.tree[0] === dependencyVar.changes.tree[0]) {
          // merge the two vectors
          let newAst = [...downVar.changes.tree];
          for(let i=1; i < dependencyVar.changes.tree.length; i++) {
            if(newAst[i] === undefined && dependencyVar.changes.tree[i] !== undefined) {
              newAst[i] = dependencyVar.changes.tree[i];
              foundAdditionalChanges = true;
            }
          }
          downVar.changes = me.fromAst(newAst);
        }
      }
    }
    return foundAdditionalChanges;
  }

  updateCompositeReplacements({component, componentChanges,
    sourceOfUpdate, trackChanges, toUpdate}) {

    // console.log("upstream composites " + component.componentName);
    let failures = {
      numUnresolvedStateVariables: {},
      unresolvedComponents: new Set([]),
      unsatisifiedChildLogic: new Set([]),
      unresolvedByDependent: {},
    }

    let deletedComponents = {};
    let addedComponents = {};
    let parentsOfDeleted = new Set();

    let numAddressed = trackChanges.numComponentChangesAddressed[component.componentName];

    let newComponentChanges = componentChanges.slice(numAddressed);

    const replacementChanges = component.calculateReplacementChanges(
      newComponentChanges);

    trackChanges.numComponentChangesAddressed[component.componentName] = componentChanges.length;

    // console.log("replacement changes for " + component.componentName);
    // console.log(replacementChanges);
    // console.log(component.replacements.map(x=>x.componentName));
    // console.log(component.unresolvedState);
    // console.log(component.unresolvedDependencies);


    // iterate through all replacement changes
    for(let change of replacementChanges) {

      if(change.changeType === "add") {

        if(change.replacementsToWithhold !== undefined) {

          let changeInReplacementsToWithhold;
          if(component.replacementsToWithhold !== undefined) {
            changeInReplacementsToWithhold = change.replacementsToWithhold - component.replacementsToWithhold;
          }else {
            changeInReplacementsToWithhold = change.replacementsToWithhold;
          }

          if(changeInReplacementsToWithhold < 0) {
            // Note: don't subtract one of this last ind, as slice doesn't include last ind
            let lastIndToStopWithholding = component.replacements.length - change.replacementsToWithhold;
            let firstIndToStopWithholding = component.replacements.length - change.replacementsToWithhold + changeInReplacementsToWithhold;

            let newReplacements = component.replacements.slice(firstIndToStopWithholding, lastIndToStopWithholding)
            let newChange = {
              changeType: "addedReplacements",
              composite: component,
              topLevel: true,
              newReplacements: newReplacements.map(x => new Proxy(x, readOnlyProxyHandler)),
              firstIndex: firstIndToStopWithholding,
              numberDeleted: 0,
            };
            componentChanges.push(newChange);
          } else if(changeInReplacementsToWithhold > 0) {

            let firstIndToStartWithholding = component.replacements.length - change.replacementsToWithhold;
            let lastIndToStartWithholding = firstIndToStartWithholding + changeInReplacementsToWithhold;

            let withheldReplacements = component.replacements.slice(firstIndToStartWithholding, lastIndToStartWithholding);
            let withheldNamesByParent = {};
            for(let comp of withheldReplacements) {
              let par = comp.parent;
              if(withheldNamesByParent[par.componentName] === undefined) {
                withheldNamesByParent[par.componentName] = []
              }
              withheldNamesByParent[par.componentName].push(comp.componentName);
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

        let unproxiedComponent = this._components[component.componentName];
        this.parameterStack.push(unproxiedComponent.sharedParameters, false);
        let createResult = this.createIsolatedComponentsSub({
          serializedState: change.serializedReplacements,
          applySugar: component.allowSugarInSerializedReplacements || change.applySugar,
          trackChanges: trackChanges,
        });
        this.parameterStack.pop();
    
        mergeFailures(failures, createResult);

       
        let checkForDownstreamDependencies = function(comp) {
          // if have downstream components that are shadowing,
          // add them to update queue
          // in case they need to update based on presence of new component
          for(let name in comp.downstreamDependencies) {
            let downDep = comp.downstreamDependencies[name];
            if(downDep.dependencyType === "referenceShadow") {
              toUpdate.add(name);
            }
          }
          for(let childName in comp.allChildren) {
            checkForDownstreamDependencies(comp.allChildren[childName].component);
          }
        }

        let newComponents = createResult.components;
 
        for(let comp of newComponents) {
          addedComponents[comp.componentName] = comp;
          checkForDownstreamDependencies(comp);
        }

        if(change.changeTopLevelReplacements === true) {
          let firstIndex = change.firstReplacementInd;
          let numberToDelete = change.numberReplacementsToReplace;
          let replacementsToDelete = component.replacements.slice(firstIndex, firstIndex + numberToDelete);

          let unproxiedParent = this._components[component.parent.componentName];

          // splice in new replacements
          let newProxiedComponents = newComponents.map(x => new Proxy(x, readOnlyProxyHandler));
          component.replacements.splice(firstIndex, numberToDelete, ...newProxiedComponents);

          this.registerCompositeDependencies({ composite: component, changeToInactive: false });

          if(replacementsToDelete.length > 0) {
            // TODO: why does this delete delete upstream components
            // but the delete from changeType="delete" doesn't?
            let deleteResults = this.deleteComponents({
              components: replacementsToDelete,
              propagateUpdate: false,
              componentChanges: componentChanges,
              sourceOfUpdate: sourceOfUpdate,
              trackChanges: trackChanges,
            });

            if(deleteResults.success === false) {
              throw Error("Couldn't delete components on composite update");
            }

            // note: already assigned to addComponents, above
            Object.assign(deletedComponents, deleteResults.deletedComponents);

            for(let parent of deleteResults.parentsOfDeleted) {
              parentsOfDeleted.add(parent.componentName);
            }
          }

          let newChange = {
            changeType: "addedReplacements",
            composite: component,
            newReplacements: newProxiedComponents,
            topLevel: true,
            firstIndex: firstIndex,
            numberDeleted: numberToDelete
          };
    
          componentChanges.push(newChange);


          let newChildrenResult = this.processNewDefiningChildren({
            parent: unproxiedParent,
            applySugar: true,
            trackChanges: trackChanges,
          });
          if(!newChildrenResult.success) {
            mergeFailures(failures, newChildrenResult);
          }

          toUpdate.add(unproxiedParent.componentName);

          // this.initializeRenderers([unproxiedParent]);

        }else {
        
          this.registerCompositeDependencies({ composite: component, changeToInactive: false });

          // TODO: check if change.parent is appropriate dependency of composite?

          let unproxiedParent = this._components[change.parent.componentName];

          let addResults = this.addChildren({
            parent: unproxiedParent,
            indexOfDefiningChildren: change.indexOfDefiningChildren,
            newChildren: newComponents,
            propagateUpdate: false,
            trackChanges: trackChanges,
          });
          if(!addResults.success) {
            mergeFailures(failures, addResults);
          }

          toUpdate.add(unproxiedParent.componentName);

          let newChange = {
            changeType: "addedReplacements",
            composite: component,
            newReplacements: newComponents.map(x => new Proxy(x, readOnlyProxyHandler)),
          };
    
          componentChanges.push(newChange);

          Object.assign(deletedComponents, addResults.deletedComponents);
          Object.assign(addedComponents, addResults.addedComponents);

        }

        // rebuild composite dependencies
        this.registerCompositeDependencies({ composite: component, changeToInactive: false });

      }else if(change.changeType === "delete") {

        let componentsToDelete;

        if(change.changeTopLevelReplacements === true) {
          let firstIndex = change.firstReplacementInd;
          let numberToDelete = change.numberReplacementsToDelete;
          componentsToDelete = component.replacements.slice(
            firstIndex, firstIndex + numberToDelete);
          // delete from replacements
          component.replacements.splice(firstIndex, numberToDelete);

          // TODO: why does this delete delete upstream components
          // but the non toplevel delete doesn't?
          // TODO: if change to propagateUpdate, adjust stateCounters
          let deleteResults = this.deleteComponents({
            components: componentsToDelete,
            propagateUpdate: false,
            componentChanges: componentChanges,
            sourceOfUpdate: sourceOfUpdate,
            trackChanges: trackChanges,
          });

          if(deleteResults.success === false) {
            throw Error("Couldn't delete components on composite update");
          
          }

          for(let parent of deleteResults.parentsOfDeleted) {
            parentsOfDeleted.add(parent.componentName);
            toUpdate.add(parent.componentName);
          }

          let deletedNamesByParent = {};
          for(let compName in deleteResults.deletedComponents) {
            let comp = deleteResults.deletedComponents[compName];
            let par = comp.parent;
            if(deletedNamesByParent[par.componentName] === undefined) {
              deletedNamesByParent[par.componentName] = []
            }
            deletedNamesByParent[par.componentName].push(compName);
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

          let unproxiedParent = this._components[component.parent.componentName];

          let newChildrenResult = this.processNewDefiningChildren({
            parent: unproxiedParent,
            trackChanges: trackChanges,
          });
          if(!newChildrenResult.success) {
            mergeFailures(failures, newChildrenResult);
          }

          toUpdate.add(unproxiedParent.componentName);

          // this.initializeRenderers([unproxiedParent]);

        }else {

          componentsToDelete = change.components;

          let numberToDelete = componentsToDelete.length;

          // TODO: check if components are appropriate dependency of composite
          let deleteResults = this.deleteComponents({
            components: componentsToDelete,
            deleteUpstreamDependencies: false,
            propagateUpdate: false,
            componentChanges: componentChanges,
            sourceOfUpdate: sourceOfUpdate,
            trackChanges: trackChanges,
         });

          if(deleteResults.success === false) {
            throw Error("Couldn't delete components prescribed by composite");
          }

          for(let parent of deleteResults.parentsOfDeleted) {
            parentsOfDeleted.add(parent.componentName);
            toUpdate.add(parent.componentName);
         }
          
          let deletedNamesByParent = {};
          for(let compName in deleteResults.deletedComponents) {
            let comp = deleteResults.deletedComponents[compName];
            let par = comp.parent;
            if(deletedNamesByParent[par.componentName] === undefined) {
              deletedNamesByParent[par.componentName] = []
            }
            deletedNamesByParent[par.componentName].push(compName);
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

        this.registerCompositeDependencies({ composite: component, changeToInactive: false });

      }else if(change.changeType === "moveDependency") {

        // TODO: check if components are appropriate dependency of composite
        let newComponent = this._components[change.newComponentName];

        this.deleteCompositeDependency({
          composite: component,
          oldComponentName: change.oldComponentName,
          dependencyDirection: change.dependencyDirection,
          recursive: change.recurseToChildren,
        });

        this.addCompositeDependency({
          composite: component,
          newComponent: newComponent,
          dependencyType: change.dependencyType,
          dependencyDirection: change.dependencyDirection,
          recursive: change.recurseToChildren,
          otherAttributes: change.otherAttributes,
        });

      }else if(change.changeType === "addDependency") {
        let newComponent = this._components[change.newComponentName];
        
        this.addCompositeDependency({
          composite: component,
          newComponent: newComponent,
          dependencyType: change.dependencyType,
          dependencyDirection: change.dependencyDirection,
          recursive: change.recurseToChildren,
          otherAttributes: change.otherAttributes,
        });

      }else if(change.changeType === "updateStateVariables") {

        // TODO: check if component is appropriate dependency of composite
        let unproxiedComponent = this._components[change.component.componentName];
        unproxiedComponent.setTrackChanges(trackChanges);
        for(let stateVariable in change.stateChanges) {
          unproxiedComponent.updateStateVariable({
            variable: stateVariable,
            value: change.stateChanges[stateVariable]
          });
        }

        // if changed a variable other than on original composite
        // add component and dependencies to toUpdate
        if(unproxiedComponent.componentName !== component.componentName) {
          toUpdate.add(unproxiedComponent.componentName)
          for(let dep of Object.values(unproxiedComponent.upstreamDependencies)) {
            if(dep.inactive === true) {
              continue;
            }
            toUpdate.add(dep.component.componentName);
          }

          const parent = unproxiedComponent.parent;
          if(parent !== undefined) {
            toUpdate.add(parent.componentName);
          }
        }
      }else if(change.changeType === "changedReplacementsToWithhold") {

        // don't change actual array of replacements
        // but just change those that will get added to activeChildren


        if(change.replacementsToWithhold !== undefined) {

          let changeInReplacementsToWithhold;
          if(component.replacementsToWithhold !== undefined) {
            changeInReplacementsToWithhold = change.replacementsToWithhold - component.replacementsToWithhold;
          }else {
            changeInReplacementsToWithhold = change.replacementsToWithhold;
          }

          if(changeInReplacementsToWithhold < 0) {
            // Note: don't subtract one of this last ind, as slice doesn't include last ind
            let lastIndToStopWithholding = component.replacements.length - change.replacementsToWithhold;
            let firstIndToStopWithholding = component.replacements.length - change.replacementsToWithhold + changeInReplacementsToWithhold;

            let newReplacements = component.replacements.slice(firstIndToStopWithholding, lastIndToStopWithholding)
            let newChange = {
              changeType: "addedReplacements",
              composite: component,
              topLevel: true,
              newReplacements: newReplacements.map(x => new Proxy(x, readOnlyProxyHandler)),
              firstIndex: firstIndToStopWithholding,
              numberDeleted: 0,
            };
            componentChanges.push(newChange);
          } else if(changeInReplacementsToWithhold > 0) {

            let firstIndToStartWithholding = component.replacements.length - change.replacementsToWithhold;
            let lastIndToStartWithholding = firstIndToStartWithholding + changeInReplacementsToWithhold;

            let withheldReplacements = component.replacements.slice(firstIndToStartWithholding, lastIndToStartWithholding);
            let withheldNamesByParent = {};
            for(let comp of withheldReplacements) {
              let par = comp.parent;
              if(withheldNamesByParent[par.componentName] === undefined) {
                withheldNamesByParent[par.componentName] = []
              }
              withheldNamesByParent[par.componentName].push(comp.componentName);
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

        let unproxiedParent = this._components[component.parent.componentName];

        let newChildrenResult = this.processNewDefiningChildren({
          parent: unproxiedParent,
          applySugar: true,
          trackChanges: trackChanges,
        });
        if(!newChildrenResult.success) {
          mergeFailures(failures, newChildrenResult);
        }

        toUpdate.add(unproxiedParent.componentName)

        // this.initializeRenderers([unproxiedParent]);

        this.registerCompositeDependencies({ composite: component, changeToInactive: false });

      }

    }

    let results = {
      success: true,
      deletedComponents: deletedComponents,
      addedComponents: addedComponents,
      parentsOfDeleted: parentsOfDeleted,
    };

    Object.assign(results, failures);
    return results;

  }


  deleteCompositeDependency({composite, dependencyDirection, oldComponentName, recursive}) {

    // delete a dependency involving a composite from oldComponent
    let compositeDependencies;
    let oldDependencies;

    let oldComponent = this._components[oldComponentName];

    if(dependencyDirection === "downstream") {
      compositeDependencies = composite.downstreamDependencies;
      if(oldComponent !== undefined) {
        oldDependencies = oldComponent.upstreamDependencies;
      }
    }else if(dependencyDirection === "upstream") {
      compositeDependencies = composite.upstreamDependencies;
      if(oldComponent !== undefined) {
        oldDependencies = oldComponent.downstreamDependencies;
      }
    }else {
      throw Error("Invalid dependency direction");
    }

    // delete dependency in composite
    delete compositeDependencies[oldComponentName];

    // delete other dependency
    let otherDep;
    
    if(oldComponent !== undefined) {
      otherDep = oldDependencies[composite.componentName];
      delete oldDependencies[composite.componentName];
    }

    // recurse if specified and actually found a dependency
    if(recursive === true && otherDep !== undefined) {
      for(let ind=0; ind < oldComponent.definingChildren.length; ind++) {
        this.deleteCompositeDependency({
          composite: composite,
          dependencyDirection: dependencyDirection,
          oldComponent: this._components[oldComponent.definingChildren[ind].componentName],
          recursive: true,
        });
      }
    }
  }

  addCompositeDependency({
    composite, newComponent, dependencyType, dependencyDirection,
    recursive, otherAttributes,
  }) {
    // create a dependency for a composite onto newComponent
    // optionally recursing to children
    let compositeDependencies;
    let newDependencies;

    if(dependencyDirection === "downstream") {
      compositeDependencies = composite.downstreamDependencies;
      newDependencies = newComponent.upstreamDependencies;
    }else if(dependencyDirection === "upstream") {
      compositeDependencies = composite.upstreamDependencies;
      newDependencies = newComponent.downstreamDependencies;
    }else {
      throw Error("Invalid dependency direction");
    }

    // check if dependency already exists
    let newCompositeDep;
    let dep = compositeDependencies[newComponent.componentName];
    if(dep !== undefined && dep.dependencyType === dependencyType) {
      newCompositeDep = dep;
    }else {
      newCompositeDep = {
        dependencyType: dependencyType,
        component: new Proxy(newComponent, readOnlyProxyHandler)
      };
    }

    Object.assign(newCompositeDep, otherAttributes);
    compositeDependencies[newComponent.componentName] = newCompositeDep;

    let otherDep = Object.assign({}, newCompositeDep);
    otherDep.component = new Proxy(composite, readOnlyProxyHandler);
    newDependencies[composite.componentName] = otherDep;

    if(recursive === true) {
      // for reference dependencies, we don't recurse to children
      // if have stateVariablesForReference or for composites
      if(dependencyType !== "reference" || (newComponent.stateVariablesForReference === undefined)) {
        if(dependencyType === "reference" && newComponent instanceof this.allComponentClasses['_composite']) {
          for(let repl of newComponent.replacements) {
            this.addCompositeDependency({
              composite: composite,
              dependencyType: dependencyType,
              dependencyDirection: dependencyDirection,
              newComponent: this._components[repl.componentName],
              recursive: true,
              otherAttributes: otherAttributes
            });
          }
        }else {
          for(let child of newComponent.definingChildren) {
            this.addCompositeDependency({
              composite: composite,
              dependencyType: dependencyType,
              dependencyDirection: dependencyDirection,
              newComponent: this._components[child.componentName],
              recursive: true,
              otherAttributes: otherAttributes
            });
          }
        }
      }
    }
  }

  get standardComponentTypes () {
    return new Proxy(this._standardComponentTypes, readOnlyProxyHandler);
  }

  set standardComponentTypes(value) {
    return null;
  }

  get allComponentClasses () {
    return new Proxy(this._allComponentClasses, readOnlyProxyHandler);
  }

  set allComponentClasses(value) {
    return null;
  }

  get componentTypesTakingAliases () {
    return new Proxy(this._componentTypesTakingAliases, readOnlyProxyHandler);
  }

  set componentTypesTakingAliases(value) {
    return null;
  }
  
  get componentTypesCreatingVariants () {
    return new Proxy(this._componentTypesCreatingVariants, readOnlyProxyHandler);
  }

  set componentTypesCreatingVariants(value) {
    return null;
  }

  get components () {
    return new Proxy(this._components, readOnlyProxyHandler);
  }

  set components(value) {
    return null;
  }

  get aliasMap () {
    return new Proxy(this._aliasMap, readOnlyProxyHandler);
  }

  set aliasMap(value) {
    return null;
  }

  requestUpdate({updateType, updateInstructions, saveSerializedState = true }) {
    // console.log("Requesting updateType " + updateType);
    // console.log(updateInstructions);
    let returnValue = {success: true};

    let saveSerializedStateImmediately = false;

    if(updateType === "updateValue") {
      let trackChanges = new TrackChanges({
        BaseComponent: this.allComponentClasses._base,
        components: this.components
      });
      
      let componentsToChange = {};

      let componentList = [];
      let instructionsByComponent = {};
      for(let instruction of updateInstructions) {
        let unproxiedComponent = this._components[instruction.componentName]
        if(instruction.componentName in componentsToChange) {
          throw Error("Component " + instruction.componentName + " has multiple instructions in a single requestUpdate")
        }
        componentsToChange[instruction.componentName] = {
          component: unproxiedComponent,
          stateVariablesToUpdate: instruction.variableUpdates,
          initialChange: true
        }
        componentList.push(this.components[instruction.componentName]); //proxied
        instructionsByComponent[instruction.componentName] = instruction;
      }
      let downstreamResults = this.downstreamUpdate(componentsToChange, trackChanges);

      let componentsForUpstream;
      if(downstreamResults.canUpdate === true) {
        componentsForUpstream = Array.from(downstreamResults.componentsUpdated);//.reverse();
      }else {
        console.log("********************");
        console.log("Could not update components");
        console.log("Need to flag them as non-updatable");
        console.log("********************");
        componentsForUpstream = componentList.map(x=>x.componentName);
        returnValue.success = false;
      }

      let sourceOfUpdate = {
        components: componentList,
        instructionsByComponent: instructionsByComponent
      };

      let upstreamResults = this.upstreamUpdate({
        componentNames: componentsForUpstream,
        componentChanges:[],
        sourceOfUpdate: sourceOfUpdate,
        trackChanges: trackChanges,
      });

      if(!upstreamResults.success) {
        throw Error(upstreamResults.message);
      }

      this.finishUpdate(upstreamResults);
      console.log("**** Components after updateValue");
      console.log(this._components);

      if(sourceOfUpdate !== undefined && sourceOfUpdate.instructionsByComponent !== undefined) {
        let updateKeys = Object.keys(sourceOfUpdate.instructionsByComponent);
        if(updateKeys.length ===1 && updateKeys[0] === "/_document1") {
          saveSerializedStateImmediately = true;
        }
      }
    }
    else if(updateType === "updateRendererOnly") {
      this.update({doenetTags:this._renderComponents});
    }
    
    if(saveSerializedState) {
      if(saveSerializedStateImmediately) {
        this.externalFunctions.saveSerializedState({
          document: this.components['/_document1'],
        })
      } else {
        this.externalFunctions.delayedSaveSerializedState({
          document: this.components['/_document1'],
        })
      }
    }

    return returnValue;
  }

  get doenetState(){
    return this._renderComponents;
  }

  set doenetState(value){
    return null;
  }

 

  requestAnimationFrame(animationFunction, delay) {
    if(!this.preventMoreAnimations) {

      // create new animationID
      let animationID = ++this.lastAnimationID;

      if(delay) {
        // set a time out to call actual request animation frame after a delay
        let timeoutID = window.setTimeout(
          x=>this._requestAnimationFrame(animationFunction, animationID),
          delay);
        this.animationIDs[animationID] = {timeoutID: timeoutID};
        return animationID;
      }else {
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
    if(timeoutID !== undefined) {
      window.clearTimeout(timeoutID);
    }
    let animationFrameID = animationIDObj.animationFrameID;
    if(animationFrameID !== undefined) {
      window.cancelAnimationFrame(animationFrameID);
    }
    delete this.animationIDs[animationID];

  }

  componentWillUnmount() {
    this.preventMoreAnimations = true;
    for(let id in this.animationIDs) {
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

function mergeFailures(results1, results2) {

  for(let componentName in results2.numUnresolvedStateVariables) {
    results1.numUnresolvedStateVariables[componentName] = results2.numUnresolvedStateVariables[componentName];
  }
  for(let componentName of results2.unresolvedComponents) {
    results1.unresolvedComponents.add(componentName);
  }
  for(let componentName of results2.unsatisifiedChildLogic) {
    results1.unsatisifiedChildLogic.add(componentName);
  }
  for(let componentName in results2.unresolvedByDependent) {
    let dObj = results1.unresolvedByDependent[componentName];
    if(dObj === undefined) {
      dObj = results1.unresolvedByDependent[componentName] = new Set([]);
    }
    for(let name of results2.unresolvedByDependent[componentName]) {
      dObj.add(name)
    }
  }

  return results1;

}