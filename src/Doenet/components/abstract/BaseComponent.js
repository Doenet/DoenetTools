import ChildLogicClass from '../../ChildLogic';
import readOnlyProxyHandler from '../../ReadOnlyProxyHandler';
import createStateProxyHandler from '../../StateProxyHandler';

export default class BaseComponent {
  constructor({
    componentName, ancestors,
    serializedState,
    definingChildren,
    serializedChildren, childLogic,
    stateVariableDefinitions,
    standardComponentClasses, allComponentClasses, isInheritedComponentType,
    componentTypesTakingComponentNames, componentTypesCreatingVariants,
    shadow, requestUpdate, requestAction, availableRenderers,
    allRenderComponents, graphRenderComponents,
    numerics, sharedParameters,
    requestAnimationFrame, cancelAnimationFrame,
    externalFunctions,
    allowSugarForChildren,
    flags,
  }) {

    this.numerics = numerics;
    this.sharedParameters = sharedParameters;
    this.requestAnimationFrame = requestAnimationFrame;
    this.cancelAnimationFrame = cancelAnimationFrame;

    this.readOnlyProxyHandler = readOnlyProxyHandler;
    this.availableRenderers = availableRenderers;
    this.allRenderComponents = allRenderComponents;
    this.graphRenderComponents = graphRenderComponents;

    this.componentName = componentName;
    this.ancestors = ancestors;

    this.standardComponentClasses = standardComponentClasses;
    this.allComponentClasses = allComponentClasses;
    this.isInheritedComponentType = isInheritedComponentType;
    this.componentTypesTakingComponentNames = componentTypesTakingComponentNames;
    this.componentTypesCreatingVariants = componentTypesCreatingVariants;
    this.componentIsAProperty = false;
    this.requestUpdate = requestUpdate;
    this.requestAction = requestAction;
    this.externalFunctions = externalFunctions;
    this.allowSugarForChildren = allowSugarForChildren;
    this.flags = flags;

    if (shadow === true) {
      this.isShadow = true;
    }

    this.definingChildren = definingChildren;
    if (this.definingChildren === undefined) {
      this.definingChildren = [];
    }

    this.serializedChildren = serializedChildren;

    this.childLogic = childLogic;

    this.state = {};
    for (let stateVariable in stateVariableDefinitions) {
      // need to separately create a shallow copy of each state variable
      // as state variable definitions of multiple variables could be same object
      this.state[stateVariable] = Object.assign({}, stateVariableDefinitions[stateVariable]);
    }
    this.stateValues = new Proxy(this.state, createStateProxyHandler());

    if (serializedState.state) {
      this.potentialEssentialState = new Proxy(serializedState.state, readOnlyProxyHandler);
    }

    this.doenetAttributes = {};
    if (serializedState.doenetAttributes !== undefined) {
      Object.assign(this.doenetAttributes, serializedState.doenetAttributes);
    }

    if (serializedState.variants !== undefined) {
      this.variants = serializedState.variants;
    }

  }

  static componentType = "_base";

  static get rendererType() {
    return this.componentType;
  }

  get componentType() {
    return this.constructor.componentType;
  }

  get rendererType() {
    return this.constructor.rendererType;
  }

  get allPotentialRendererTypes() {
    if (!this.rendererType) {
      return [];
    }

    let allPotentialRendererTypes = [this.rendererType];

    // include any potential renderer type that could be
    // created from a public state variable
    for (let varName in this.state) {
      if (this.state[varName].public) {
        let componentTypes = this.state[varName].componentType;
        if (!Array.isArray(componentTypes)) {
          componentTypes = [componentTypes]
        }
        for (let componentType of componentTypes) {
          let componentClass = this.allComponentClasses[componentType];
          if (componentClass) {
            let rendererType = componentClass.rendererType;
            if (rendererType && !allPotentialRendererTypes.includes(rendererType)) {
              allPotentialRendererTypes.push(rendererType)
            }
          }
        }
      }
    }

    // recurse to all children
    for (let childName in this.allChildren) {
      let child = this.allChildren[childName].component;
      for (let rendererType of child.allPotentialRendererTypes) {
        if (!allPotentialRendererTypes.includes(rendererType)) {
          allPotentialRendererTypes.push(rendererType);
        }
      }
    }

    return allPotentialRendererTypes;

  }

  potentialRendererTypesFromSerializedComponents(serializedComponents) {
    let potentialRendererTypes = [];

    for (let comp of serializedComponents) {
      let compClass = this.allComponentClasses[comp.componentType];
      let rendererType = compClass.rendererType;
      if (rendererType && !potentialRendererTypes.includes(rendererType)) {
        potentialRendererTypes.push(rendererType);
      }

      if (comp.children) {
        let childRenderTypes = this.potentialRendererTypesFromSerializedComponents(comp.children);
        for (let rendererType of childRenderTypes) {
          if (!potentialRendererTypes.includes(rendererType)) {
            potentialRendererTypes.push(rendererType);
          }
        }
      }

    }

    return potentialRendererTypes;
  }

  get childLogicSatisfied() {
    return this.childLogic.logicResult.success;
  }

  static createPropertiesObject() {

    return {
      hide: { default: false, forRenderer: true },
      modifyIndirectly: { default: true },
      fixed: { default: false },
      styleNumber: { default: 1, propagateToDescendants: true },
    };
  }

  static returnChildLogic({ standardComponentClasses, allComponentClasses, components, allPossibleProperties }) {
    let childLogic = new ChildLogicClass({
      parentComponentType: this.componentType,
      properties: this.createPropertiesObject({
        standardComponentClasses, allPossibleProperties,
      }),
      allComponentClasses,
      standardComponentClasses,
      components,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { childrenToRender: [] } })
    }

    return stateVariableDefinitions;
  }

  static returnNormalizedStateVariableDefinitions({ propertyNames, numerics }) {
    // return state variable definitions
    // where have added additionalStateVariablesDefined


    //  add state variable definitions from component class
    let newDefinitions = this.returnStateVariableDefinitions({
      propertyNames, numerics,
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
      "inverseDefinition", "stateVariablesDeterminingDependencies",
      "isArray", "nDimensions",
      "markStale", "getPreviousDependencyValuesForMarkStale",
      "triggerParentChildLogicWhenResolved",
    ];

    let stateVariableDefinitions = {};

    for (let varName in newDefinitions) {
      let thisDef = newDefinitions[varName];
      stateVariableDefinitions[varName] = thisDef;

      if (thisDef.additionalStateVariablesDefined) {
        for (let [ind, otherVarObj] of thisDef.additionalStateVariablesDefined.entries()) {
          let defCopy = {};
          for (let attr of defAttributesToCopy) {
            if (attr in thisDef) {
              defCopy[attr] = thisDef[attr];
            }
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
            otherVarObj = Object.assign({}, otherVarObj);
            delete otherVarObj.variableName;
            Object.assign(defCopy, otherVarObj);
          }

          stateVariableDefinitions[otherVarName] = defCopy;

        }

        cleanAdditionalStateVariableDefined(thisDef.additionalStateVariablesDefined);

      }

    }

    return stateVariableDefinitions;

  }

  static returnStateVariableInfo({ onlyPublic = false, standardComponentClasses, allPossibleProperties }) {
    let propertyObject = this.createPropertiesObject({ standardComponentClasses, allPossibleProperties });

    let stateVariableDescriptions = {};
    let arrayEntryPrefixes = {};
    let aliases = {};

    for (let varName in propertyObject) {
      let componentTypeOverride = propertyObject[varName].componentType;
      stateVariableDescriptions[varName] = {
        componentType: componentTypeOverride ? componentTypeOverride : varName,
        public: true,

      }
      if (propertyObject[varName].entryPrefixes) {
        let classPropertyAttributes = standardComponentClasses[varName].attributesForPropertyValue;
        if (classPropertyAttributes && classPropertyAttributes.isArray) {
          stateVariableDescriptions[varName].isArray = true;
          for (let prefix of propertyObject[varName].entryPrefixes) {
            arrayEntryPrefixes[prefix] = {
              arrayVariableName: varName,
            }
          }
        } else {
          console.warn(`entryPrefixes ignored for property ${varName} of ${this.componentName}`)
        }
      }

    }

    let stateDef = this.returnNormalizedStateVariableDefinitions({ propertyNames: Object.keys(stateVariableDescriptions) });


    for (let varName in stateDef) {
      let theStateDef = stateDef[varName];
      if (theStateDef.isAlias) {
        aliases[varName] = theStateDef.targetVariableName;
        continue;
      }
      if (!onlyPublic || theStateDef.public) {
        stateVariableDescriptions[varName] = {
          componentType: theStateDef.componentType,
          public: theStateDef.public,
        };
        if (theStateDef.isArray) {
          stateVariableDescriptions[varName].isArray = true;
          if (theStateDef.entryPrefixes) {
            for (let prefix of theStateDef.entryPrefixes) {
              arrayEntryPrefixes[prefix] = {
                arrayVariableName: varName,
              }
            }
          }
        }
      }
    }

    return { stateVariableDescriptions, arrayEntryPrefixes, aliases };

  }

  get parentName() {
    if (this.ancestors === undefined || this.ancestors.length === 0) {
      return;
    }
    return this.ancestors[0].componentName;
  }

  // TODO: if resurrect this, it would just be componentNames
  // getParentUpstreamComponents(includeInactive = false) {
  //   const parent = this.parent;
  //   let upstream = Object.values(this.upstreamDependencies)
  //   if (includeInactive !== true) {
  //     upstream = upstream.filter(x => x.inactive !== true);
  //   }
  //   upstream = upstream.map(x => x.component);
  //   if (parent === undefined) {
  //     return upstream;
  //   } else {
  //     return [parent, ...upstream];
  //   }
  // }

  getAllChildrenDownstreamComponentNames(includeInactive = false) {
    const childrenNames = Object.keys(this.allChildren);
    let downstreamNames = Object.keys(this.downstreamDependencies);
    if (includeInactive !== true) {
      downstreamNames = downstreamNames.filter(x => this.downstreamDependencies[x].inactive !== true);
    }
    return [...childrenNames, ...downstreamNames];
  }

  get allDescendants() {
    let descendants = [];
    for (let name in this.allChildren) {
      let child = this.allChildren[name].component;
      descendants = [...descendants, name, ...child.allDescendants];
    }
    return descendants;
  }


  static useChildrenForReference = true;

  static get stateVariablesShadowedForReference() { return [] };

  returnSerializeInstructions() {
    return {};
  }

  serialize(parameters = {}) {
    // TODO: this function is converted only for the case with the parameter
    // forReference set

    let includePropertyChildren = true;
    let includeOtherDefiningChildren = true;
    let stateVariablesToInclude = [];

    if (parameters.forReference) {
      includePropertyChildren = false;
      includeOtherDefiningChildren = this.constructor.useChildrenForReference;
    } else {
      let instructions = this.returnSerializeInstructions();
      if (instructions.skipChildren) {
        includeOtherDefiningChildren = false;
      }
      if (instructions.stateVariables) {
        stateVariablesToInclude = instructions.stateVariables;
      }

    }

    let serializedState = {
      componentType: this.componentType,
    }

    let serializedChildren = [];

    if (includePropertyChildren || includeOtherDefiningChildren) {

      for (let child of this.definingChildren) {
        if ((includePropertyChildren && child.componentIsAProperty) ||
          (includeOtherDefiningChildren && !child.componentIsAProperty)) {

          serializedChildren.push(child.serialize(parameters));
        }
      }

      if (this.serializedChildren !== undefined) {
        for (let child of this.serializedChildren) {
          serializedChildren.push(this.copySerializedComponent({
            serializedComponent: child,
            parameters: parameters
          }));
        }
      }

      if (serializedChildren.length > 0) {
        serializedState.children = serializedChildren;
      }

    }


    if (parameters.forReference) {
      serializedState.preserializedName = this.componentName;
    } else {
      console.warn('serializing a component without forReference set is not yet converted!!!!')
      let additionalState = {};
      for (let item in this._state) {
        if (this.state[item].essential || stateVariablesToInclude.includes(item)) {

          // evaluate state variable first so that usedDefault attribute is populated
          let value = this.state[item].value;

          if (!this.state[item].usedDefault) {
            additionalState[item] = value;
          }
        }
      }

      if (Object.keys(additionalState).length > 0) {
        serializedState.state = additionalState;
      }

      let doenetAttributes = Object.assign({}, this.doenetAttributes);
      delete doenetAttributes.createdFromProperty;
      if (Object.keys(doenetAttributes).length > 0) {
        serializedState.doenetAttributes = doenetAttributes;
      }
    }

    return serializedState;

  }

  copySerializedComponent({ serializedComponent, parameters }) {

    let serializedChildren = [];
    if (serializedComponent.children !== undefined) {
      for (let child of serializedComponent.children) {
        serializedChildren.push(this.copySerializedComponent({
          serializedComponent: child,
          parameters: parameters
        }));
      }
    }

    let serializedState = {
      componentType: serializedComponent.componentType,
      children: serializedChildren,
      state: {},
      doenetAttributes: {},
    }

    if (//parameters.forReference !== true &&
      serializedComponent.doenetAttributes !== undefined) {
      // shallow copy of doenetAttributes
      Object.assign(serializedState.doenetAttributes, serializedComponent.doenetAttributes);
    }

    if (serializedComponent.state !== undefined) {
      // shallow copy of state
      Object.assign(serializedState.state, serializedComponent.state);
    }

    return serializedState;

  }

  adapters = [];

  get nAdapters() {
    return this.adapters.length;
  }

  getAdapter(ind) {

    if (ind >= this.adapters.length) {
      return;
    }

    let adapter = this.adapters[ind];

    let adapterStateVariable;
    let adapterComponentType;

    // adapter could be either 
    // - a string specifying a public state variable, or
    // - an object specify a public state variable and, optionally
    //   a component type and a state variable for the new component
    if (typeof adapter === "string") {
      adapterStateVariable = adapter;
    } else {
      adapterStateVariable = adapter.stateVariable;
      adapterComponentType = adapter.componentType;
    }

    // look in state for matching public value
    let stateFromAdapter = this.state[adapterStateVariable];
    if (stateFromAdapter === undefined || (!stateFromAdapter.public && !adapterComponentType)) {
      throw Error("Invalid adapter " + adapterStateVariable + " in "
        + this.componentType);
    }

    if (adapterComponentType === undefined) {
      // if didn't override componentType, use componentType from state variable
      adapterComponentType = stateFromAdapter.componentType;
    }

    return {
      componentType: adapterComponentType,
      downstreamDependencies: {
        [this.componentName]: [{
          dependencyType: "adapter",
          adapterVariable: adapterStateVariable,
          adapterTargetIdentity: {
            componentName: this.componentName,
            componentType: this.componentType,
          }
        }]
      }
    }

  }

}
