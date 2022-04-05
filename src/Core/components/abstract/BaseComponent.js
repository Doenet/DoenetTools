import createStateProxyHandler from '../../StateProxyHandler';
import { flattenDeep, mapDeep } from '../../utils/array';
import { deepClone } from '../../utils/deepFunctions';
import { enumerateCombinations } from '../../utils/enumeration';
import { gatherVariantComponents } from '../../utils/serializedStateProcessing';
import { returnDefaultGetArrayKeysFromVarName } from '../../utils/stateVariables';

export default class BaseComponent {
  constructor({
    componentName, ancestors,
    serializedComponent,
    definingChildren,
    serializedChildren,
    attributes,
    stateVariableDefinitions,
    componentInfoObjects,
    coreFunctions,
    flags,
    shadow,
    numerics, parentSharedParameters, sharedParameters,
  }) {

    this.numerics = numerics;
    this.parentSharedParameters = parentSharedParameters;
    this.sharedParameters = sharedParameters;

    this.componentName = componentName;
    this.ancestors = ancestors;
    this.counters = {};

    this.componentInfoObjects = componentInfoObjects;
    this.coreFunctions = coreFunctions;
    this.flags = flags;

    if (shadow === true) {
      this.isShadow = true;
    }

    this.definingChildren = definingChildren;
    if (this.definingChildren === undefined) {
      this.definingChildren = [];
    }

    this.serializedChildren = serializedChildren;

    this.attributes = attributes;

    this.state = {};
    for (let stateVariable in stateVariableDefinitions) {
      // need to separately create a shallow copy of each state variable
      // as state variable definitions of multiple variables could be same object
      this.state[stateVariable] = Object.assign({}, stateVariableDefinitions[stateVariable]);
    }
    this.stateValues = new Proxy(this.state, createStateProxyHandler());

    this.essentialState = {};

    if (serializedComponent.state) {
      this.essentialState = deepClone(serializedComponent.state);
    }

    this.doenetAttributes = {};
    if (serializedComponent.doenetAttributes !== undefined) {
      Object.assign(this.doenetAttributes, serializedComponent.doenetAttributes);
    }

    if (serializedComponent.variants !== undefined) {
      this.variants = serializedComponent.variants;
    }

  }

  static componentType = "_base";

  static get rendererType() {
    return this.componentType;
  }

  get componentType() {
    return this.constructor.componentType;
  }

  get componentOrAdaptedName() {
    if (this.adaptedFrom) {
      return this.adaptedFrom.componentOrAdaptedName
    } else {
      return this.componentName;
    }
  }

  get rendererType() {
    return this.constructor.rendererType;
  }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = [];
    if (this.rendererType) {
      allPotentialRendererTypes.push(this.rendererType);
    }

    // include any potential renderer type that could be
    // created from a public state variable
    for (let varName in this.state) {
      let stateVarObj = this.state[varName];
      if (stateVarObj.public) {

        let componentTypes = stateVarObj.componentType;
        if (!Array.isArray(componentTypes)) {
          componentTypes = [componentTypes]
        }
        if (stateVarObj.wrappingComponents) {
          componentTypes.push(...flattenDeep(stateVarObj.wrappingComponents)
            .map(x => typeof x === "object" ? x.componentType : x));
        }
        for (let componentType of componentTypes) {
          let componentClass = this.componentInfoObjects.allComponentClasses[componentType];
          if (componentClass) {
            let rendererType = componentClass.rendererType;
            if (rendererType && !allPotentialRendererTypes.includes(rendererType)) {
              allPotentialRendererTypes.push(rendererType)
            }
          }
        }
      }
    }

    // include renderers from components it could adapt to
    if (this.constructor.adapters) {
      for (let adapterInfo of this.constructor.adapters) {
        let componentType;
        if (typeof adapterInfo === "string") {
          componentType = adapterInfo;
        } else {
          componentType = adapterInfo.componentType;
        }
        let componentClass = this.componentInfoObjects.allComponentClasses[componentType];
        if (componentClass) {
          let rendererType = componentClass.rendererType;
          if (rendererType && !allPotentialRendererTypes.includes(rendererType)) {
            allPotentialRendererTypes.push(rendererType)
          }
        }
      }
    }

    if (!this.rendererType) {
      return allPotentialRendererTypes;
    }


    // recurse to all children
    for (let childName in this.allChildren) {
      let child = this.allChildren[childName].component;
      if (typeof child !== "object") {
        continue;
      } else {
        for (let rendererType of child.allPotentialRendererTypes) {
          if (!allPotentialRendererTypes.includes(rendererType)) {
            allPotentialRendererTypes.push(rendererType);
          }
        }
      }
    }

    return allPotentialRendererTypes;

  }


  potentialRendererTypesFromSerializedComponents(serializedComponents) {
    let potentialRendererTypes = [];

    for (let comp of serializedComponents) {
      let compClass = this.componentInfoObjects.allComponentClasses[comp.componentType];
      if (compClass) {
        let rendererType = compClass.rendererType;
        if (rendererType && !potentialRendererTypes.includes(rendererType)) {
          potentialRendererTypes.push(rendererType);
        }

        // include any potential renderer type that could be
        // created from a public state variable

        let stateVariableDescriptions = compClass.returnStateVariableInfo(
          { onlyPublic: true, flags: this.flags }
        ).stateVariableDescriptions;


        for (let varName in stateVariableDescriptions) {
          let stateDescrip = stateVariableDescriptions[varName];

          let componentTypes = stateDescrip.componentType;
          if (!Array.isArray(componentTypes)) {
            componentTypes = [componentTypes]
          }
          if (stateDescrip.wrappingComponents) {
            componentTypes.push(...flattenDeep(stateDescrip.wrappingComponents)
              .map(x => typeof x === "object" ? x.componentType : x));
          }
          for (let componentType of componentTypes) {
            let componentClass = this.componentInfoObjects.allComponentClasses[componentType];
            if (componentClass) {
              let rendererType = componentClass.rendererType;
              if (rendererType && !potentialRendererTypes.includes(rendererType)) {
                potentialRendererTypes.push(rendererType)
              }
            }
          }
        }


        // include renderers from components it could adapt to
        if (compClass.adapters) {
          for (let adapterInfo of compClass.adapters) {
            let componentType;
            if (typeof adapterInfo === "string") {
              componentType = adapterInfo;
            } else {
              componentType = adapterInfo.componentType;
            }
            let componentClass = this.componentInfoObjects.allComponentClasses[componentType];
            if (componentClass) {
              let rendererType = componentClass.rendererType;
              if (rendererType && !potentialRendererTypes.includes(rendererType)) {
                potentialRendererTypes.push(rendererType)
              }
            }
          }
        }
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

  get childrenMatched() {
    return this.childrenMatchedWithPlaceholders
      && !this.placeholderActiveChildrenIndices;
  }


  static createAttributesObject({ flags = {} } = {}) {

    return {
      hide: {
        createComponentOfType: "boolean",
        createStateVariable: "hide",
        defaultValue: false,
        public: true,
      },
      disabled: {
        createComponentOfType: "boolean",
        createStateVariable: "disabledPreliminary",
        defaultValue: null,//flags.readOnly ? true : false,
        // public: true,
      },
      disabledIgnoresParentReadOnly: {
        createComponentOfType: "boolean",
        createStateVariable: "disabledIgnoresParentReadOnly",
        defaultValue: false,
      },
      modifyIndirectly: {
        createComponentOfType: "boolean",
        createStateVariable: "modifyIndirectly",
        defaultValue: true,
        public: true,
        propagateToProps: true,
      },
      fixed: {
        createComponentOfType: "boolean",
        createStateVariable: "fixedPreliminary",
        defaultValue: null, //false,
        // public: true,
        // forRenderer: true,
      },
      styleNumber: {
        createComponentOfType: "number",
        createStateVariable: "styleNumber",
        defaultValue: 1,
        public: true,
        fallBackToParentStateVariable: "styleNumber",
      },
      isResponse: {
        createPrimitiveOfType: "boolean",
        createStateVariable: "isResponse",
        defaultValue: false,
        public: true,
      },

      newNamespace: {
        createPrimitiveOfType: "boolean"
      }
    };
  }

  static returnSugarInstructions() {
    return [];
  }

  static returnChildGroups() {
    return [];
  }

  static get childGroups() {
    if (this.hasOwnProperty("childGroupsData")) {
      return this.childGroupsData;
    } else {
      this.childGroupsData = this.returnChildGroups();
      return this.childGroupsData;
    }
  }

  static childGroupOfComponentTypeData;

  static get childGroupOfComponentType() {
    if (this.hasOwnProperty("childGroupOfComponentTypeData")) {
      return this.childGroupOfComponentTypeData
    } else {
      this.childGroupOfComponentTypeData = {};
      return this.childGroupOfComponentTypeData;
    }
  }

  static childGroupIndsByNameData;

  static get childGroupIndsByName() {
    if (this.hasOwnProperty("childGroupIndsByNameData")) {
      return Object.assign({}, this.childGroupIndsByNameData);
    }

    this.childGroupIndsByNameData = {};
    for (let [ind, group] of this.childGroups.entries()) {
      if (group.group in this.childGroupIndsByNameData) {
        throw Error(`Invalid childGroups for componentClass ${this.componentType}: ${group} is repeated`)
      }
      this.childGroupIndsByNameData[group.group] = ind;
    }

    return Object.assign({}, this.childGroupIndsByNameData);
  }


  returnMatchedChildIndices(childGroups) {
    let matchedIndices = [];
    for (let groupName of childGroups) {
      let matches = this.childMatchesByGroup[groupName];
      if (!matches) {
        throw Error(`child group ${groupName} is not defined for a component of type ${this.componentType}`)
      }
      matchedIndices.push(...matches)
    }
    return matchedIndices.sort((a, b) => a - b);
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.hidden = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      returnDependencies: () => ({
        hide: {
          dependencyType: "stateVariable",
          variableName: "hide",
          variablesOptional: true,
        },
        parentHidden: {
          dependencyType: "parentStateVariable",
          variableName: "hidden"
        },
        sourceCompositeHidden: {
          dependencyType: "sourceCompositeStateVariable",
          variableName: "hidden"
        },
        adapterSourceHidden: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "hidden"
        },
      }),
      definition: ({ dependencyValues }) => ({
        setValue: {
          hidden:  // check === true so null gives false
            dependencyValues.parentHidden === true
            || dependencyValues.sourceCompositeHidden === true
            || dependencyValues.adapterSourceHidden === true
            || dependencyValues.hide === true
        }
      }),
      markStale: () => ({ updateParentRenderedChildren: true }),

    }

    stateVariableDefinitions.disabled = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      hasEssential: true,
      doNotShadowEssential: true,
      defaultValue: false,
      returnDependencies: () => ({
        disabledPreliminary: {
          dependencyType: "stateVariable",
          variableName: "disabledPreliminary",
          variablesOptional: true,
        },
        disabledAttr: {
          dependencyType: "attributeComponent",
          attributeName: "disabled",
        },
        readOnly: {
          dependencyType: "flag",
          flagName: "readOnly"
        },
        disabledIgnoresParentReadOnly: {
          dependencyType: "stateVariable",
          variableName: "disabledIgnoresParentReadOnly",
          variablesOptional: true,
        },
        parentDisabled: {
          dependencyType: "parentStateVariable",
          variableName: "disabled"
        },
        sourceCompositeDisabled: {
          dependencyType: "sourceCompositeStateVariable",
          variableName: "disabled"
        },
        adapterSourceDisabled: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "disabled"
        },
      }),
      definition({ dependencyValues, usedDefault }) {

        if (dependencyValues.readOnly && !dependencyValues.disabledIgnoresParentReadOnly) {
          return { setValue: { disabled: true } }
        }

        if (dependencyValues.disabledPreliminary !== null &&
          dependencyValues.disabledAttr !== null
        ) {
          return {
            setValue: {
              disabled: dependencyValues.disabledPreliminary
            }
          }
        }

        let disabled = false;
        let useEssential = true;

        if (!dependencyValues.disabledIgnoresParentReadOnly && dependencyValues.parentDisabled !== null && !usedDefault.parentDisabled) {
          disabled = disabled || dependencyValues.parentDisabled;
          useEssential = false;
        }
        if (dependencyValues.sourceCompositeDisabled !== null && !usedDefault.sourceCompositeDisabled) {
          disabled = disabled || dependencyValues.sourceCompositeDisabled;
          useEssential = false;
        }
        if (dependencyValues.adapterSourceDisabled !== null && !usedDefault.adapterSourceDisabled) {
          disabled = disabled || dependencyValues.adapterSourceDisabled;
          useEssential = false;
        }

        // disabled wasn't supplied by parent/sourceComposite/adapterSource,
        // was specified as a non-default from disabledPreliminary,
        // but wasn't specified via an attribute component
        // It must have been specified from a target shadowing
        // or from an essential state variable
        if (useEssential && dependencyValues.disabledPreliminary !== null && !usedDefault.disabledPreliminary) {
          useEssential = false;
          disabled = dependencyValues.disabledPreliminary
        }

        if (useEssential) {
          return {
            useEssentialOrDefaultValue: {
              disabled: true
            }
          }
        } else {
          return { setValue: { disabled } }
        }
      },
    }

    stateVariableDefinitions.fixed = {
      public: true,
      componentType: "boolean",
      forRenderer: true,
      defaultValue: false,
      hasEssential: true,
      doNotShadowEssential: true,
      returnDependencies: () => ({
        fixedPreliminary: {
          dependencyType: "stateVariable",
          variableName: "fixedPreliminary",
          variablesOptional: true,
        },
        fixedAttr: {
          dependencyType: "attributeComponent",
          attributeName: "fixed",
        },
        parentFixed: {
          dependencyType: "parentStateVariable",
          variableName: "fixed"
        },
        sourceCompositeFixed: {
          dependencyType: "sourceCompositeStateVariable",
          variableName: "fixed"
        },
        adapterSourceFixed: {
          dependencyType: "adapterSourceStateVariable",
          variableName: "fixed"
        },
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.fixedPreliminary !== null &&
          dependencyValues.fixedAttr !== null
        ) {
          return {
            setValue: {
              fixed: dependencyValues.fixedPreliminary
            }
          }
        }

        let fixed = false;
        let useEssential = true;

        if (dependencyValues.parentFixed !== null && !usedDefault.parentFixed) {
          fixed = fixed || dependencyValues.parentFixed;
          useEssential = false;
        }
        if (dependencyValues.sourceCompositeFixed !== null && !usedDefault.sourceCompositeFixed) {
          fixed = fixed || dependencyValues.sourceCompositeFixed;
          useEssential = false;
        }
        if (dependencyValues.adapterSourceFixed !== null && !usedDefault.adapterSourceFixed) {
          fixed = fixed || dependencyValues.adapterSourceFixed;
          useEssential = false;
        }

        // fixed wasn't supplied by parent/sourceComposite/adapterSource,
        // was specified as a non-default from fixedPreliminary,
        // but wasn't specified via an attribute component
        // It must have been specified from a target shadowing
        // or from an essential state variable
        if (useEssential && dependencyValues.fixedPreliminary !== null && !usedDefault.fixedPreliminary) {
          useEssential = false;
          fixed = dependencyValues.fixedPreliminary
        }

        if (useEssential) {
          return {
            useEssentialOrDefaultValue: {
              fixed: true
            }
          }
        }
        else {
          return { setValue: { fixed } }
        }
      }
    }

    stateVariableDefinitions.isInactiveCompositeReplacement = {
      defaultValue: false,
      hasEssential: true,
      returnDependencies: () => ({}),
      definition: () => ({
        useEssentialOrDefaultValue: {
          isInactiveCompositeReplacement: true
        }
      }),
      inverseDefinition({ desiredStateVariableValues }) {
        return {
          success: true,
          instructions: [{
            setEssentialValue: {
              variableName: "isInactiveCompositeReplacement",
              value: desiredStateVariableValues.isInactiveCompositeReplacement
            }
          }]
        }
      }
    }

    return stateVariableDefinitions;
  }

  static returnNormalizedStateVariableDefinitions({ attributeNames, numerics }) {
    // return state variable definitions
    // where have added additionalStateVariablesDefined


    //  add state variable definitions from component class
    let newDefinitions = this.returnStateVariableDefinitions({
      attributeNames, numerics,
    });

    if (!newDefinitions) {
      throw Error(`Error in state variable definitions of ${this.componentType}: returnStateVariableDefinitions did not return anything`)
    }

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
      "stateVariablesDeterminingArraySizeDependencies",
      "isArray", "nDimensions",
      "returnArraySizeDependencies", "returnArraySize",
      "returnArrayDependenciesByKey", "arrayDefinitionByKey",
      "inverseArrayDefinitionByKey",
      "basedOnArrayKeyStateVariables",
      "markStale", "getPreviousDependencyValuesForMarkStale",
      "determineDependenciesImmediately",
      "createWorkspace", "workspace",
      "provideEssentialValuesInDefinition",
      "providePreviousValuesInDefinition",
    ];

    let stateVariableDefinitions = {};

    for (let varName in newDefinitions) {
      let thisDef = newDefinitions[varName];
      stateVariableDefinitions[varName] = thisDef;

      if (thisDef.createWorkspace) {
        thisDef.workspace = {};
      }

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

  static returnStateVariableInfo({ onlyPublic = false, flags, onlyForRenderer = false }) {
    let attributeObject = this.createAttributesObject({ flags });

    let stateVariableDescriptions = {};
    let arrayEntryPrefixes = {};
    let aliases = {};

    for (let varName in attributeObject) {
      let attrObj = attributeObject[varName];
      let componentTypeOverride = attrObj.componentType;
      if ((!onlyPublic || attrObj.public) && (!onlyForRenderer || attrObj.forRenderer)) {
        stateVariableDescriptions[varName] = {
          componentType: componentTypeOverride ? componentTypeOverride : varName,
          public: attrObj.public,
        }
      }

    }

    let stateDef = this.returnNormalizedStateVariableDefinitions({ attributeNames: Object.keys(stateVariableDescriptions) });

    for (let varName in stateDef) {
      let theStateDef = stateDef[varName];
      if (theStateDef.isAlias) {
        aliases[varName] = theStateDef.targetVariableName;
        continue;
      }
      if ((!onlyPublic || theStateDef.public) && (!onlyForRenderer || theStateDef.forRenderer)) {
        stateVariableDescriptions[varName] = {
          componentType: theStateDef.componentType,
          public: theStateDef.public,
          containsComponentNamesToCopy: theStateDef.containsComponentNamesToCopy,
        };
        if (theStateDef.isArray) {
          stateVariableDescriptions[varName].isArray = true;
          stateVariableDescriptions[varName].nDimensions = theStateDef.nDimensions === undefined ? 1 : theStateDef.nDimensions;
          stateVariableDescriptions[varName].wrappingComponents = theStateDef.returnWrappingComponents ? theStateDef.returnWrappingComponents() : [];
          if (theStateDef.entryPrefixes) {
            for (let prefix of theStateDef.entryPrefixes) {
              arrayEntryPrefixes[prefix] = {
                arrayVariableName: varName,
                nDimensions: theStateDef.returnEntryDimensions ? theStateDef.returnEntryDimensions(prefix) : 1,
                wrappingComponents: theStateDef.returnWrappingComponents ? theStateDef.returnWrappingComponents(prefix) : []
              }
            }
          }
          if (theStateDef.getArrayKeysFromVarName) {
            stateVariableDescriptions[varName].getArrayKeysFromVarName = theStateDef.getArrayKeysFromVarName;
          } else {
            stateVariableDescriptions[varName].getArrayKeysFromVarName = returnDefaultGetArrayKeysFromVarName(stateVariableDescriptions[varName].nDimensions)
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



  // returnSerializeInstructions() {
  //   return {};
  // }

  async serialize(parameters = {}) {
    // TODO: this function is converted only for the case with the parameter
    // forLink set

    // TODO: not serializing attribute children (as don't need them with forLink)

    let includeDefiningChildren = true;
    // let stateVariablesToInclude = [];


    let serializedComponent = {
      componentType: this.componentType,
    }

    let serializedChildren = [];

    if (includeDefiningChildren) {

      for (let child of this.definingChildren) {
        if (typeof child !== "object") {
          serializedChildren.push(child)
        } else {
          serializedChildren.push(await child.serialize(parameters));
        }
      }

      if (this.serializedChildren !== undefined) {
        for (let child of this.serializedChildren) {
          serializedChildren.push(this.copySerializedComponent(child));
        }
      }

      if (serializedChildren.length > 0) {
        serializedComponent.children = serializedChildren;
      }

    }

    let attributesObject = this.constructor.createAttributesObject({ flags: this.flags });

    serializedComponent.attributes = {};

    for (let attrName in this.attributes) {
      let attribute = this.attributes[attrName];
      if (attribute.component) {
        // only copy attribute components if attributes object specifies
        // or if copy all
        let attrInfo = attributesObject[attrName];
        if (parameters.copyAll) {
          serializedComponent.attributes[attrName] = { component: await attribute.component.serialize(parameters) };
        }
      } else {
        // always copy others
        // TODO: for now not copying isResponse if not copy all
        // but not sure if that is the right thing to do
        if (attrName !== "isResponse" || parameters.copyAll) {
          serializedComponent.attributes[attrName] = JSON.parse(JSON.stringify(attribute));
        }
      }
    }

    // always copy essential state
    if (this.essentialState && Object.keys(this.essentialState).length > 0) {
      serializedComponent.state = deepClone(this.essentialState);
    }

    serializedComponent.originalName = this.componentName;
    serializedComponent.originalDoenetAttributes = deepClone(this.doenetAttributes);
    serializedComponent.doenetAttributes = deepClone(this.doenetAttributes);
    serializedComponent.originalAttributes = deepClone(serializedComponent.attributes);

    delete serializedComponent.doenetAttributes.prescribedName;
    delete serializedComponent.doenetAttributes.assignNames;


    return serializedComponent;

  }

  copySerializedComponent(serializedComponent) {

    if (typeof serializedComponent !== "object") {
      return serializedComponent;
    }

    let serializedChildren = [];
    if (serializedComponent.children !== undefined) {
      for (let child of serializedComponent.children) {
        serializedChildren.push(this.copySerializedComponent(child));
      }
    }

    let serializedCopy = {
      componentType: serializedComponent.componentType,
      originalName: serializedComponent.componentName,
      originalNameFromSerializedComponent: true,
      children: serializedChildren,
      state: {},
      doenetAttributes: {},
    }

    if (serializedComponent.doenetAttributes !== undefined) {
      serializedCopy.originalDoenetAttributes = deepClone(serializedComponent.doenetAttributes);
      serializedCopy.doenetAttributes = deepClone(serializedComponent.doenetAttributes);
      serializedCopy.originalAttributes = deepClone(serializedComponent.attributes);
      serializedCopy.attributes = deepClone(serializedComponent.attributes);
      delete serializedCopy.doenetAttributes.prescribedName;
      delete serializedCopy.doenetAttributes.assignNames;

    }

    if (serializedComponent.state !== undefined) {
      // shallow copy of state
      Object.assign(serializedCopy.state, serializedComponent.state);
    }

    return serializedCopy;

  }

  static adapters = [];

  static get nAdapters() {
    return this.adapters.length;
  }

  getAdapter(ind) {

    if (ind >= this.constructor.adapters.length) {
      return;
    }

    let adapter = this.constructor.adapters[ind];

    let adapterStateVariable;
    let adapterComponentType;
    let substituteForPrimaryStateVariable;

    // adapter could be either 
    // - a string specifying a public state variable, or
    // - an object specify a public state variable and, optionally
    //   a component type and a state variable for the new component
    if (typeof adapter === "string") {
      adapterStateVariable = adapter;
    } else {
      adapterStateVariable = adapter.stateVariable;
      adapterComponentType = adapter.componentType;
      substituteForPrimaryStateVariable = adapter.substituteForPrimaryStateVariable;
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
          },
          substituteForPrimaryStateVariable
        }]
      }
    }

  }

  static getAdapterComponentType(ind, publicStateVariableInfo) {

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

    if (adapterComponentType === undefined) {
      // if didn't override componentType, use componentType from state variable

      let stateVarInfo = publicStateVariableInfo[this.componentType]

      let varInfo = stateVarInfo.stateVariableDescriptions[adapterStateVariable];
      if (!varInfo) {
        throw Error("Invalid adapter " + adapterStateVariable + " in "
          + this.componentType);
      }

      adapterComponentType = varInfo.componentType;

      if (!adapterComponentType) {
        throw Error(`Couldn't get adapter component type for ${adapterStateVariable} of componentType ${this.componentType}`)
      }
    }

    return adapterComponentType;

  }


  static determineNumberOfUniqueVariants({
    serializedComponent, componentInfoObjects
  }) {

    let numberOfVariants = serializedComponent.variants?.numberOfVariants;

    if (numberOfVariants !== undefined) {
      return { success: true, numberOfVariants };
    }

    let descendantVariantComponents = gatherVariantComponents({
      serializedComponents: serializedComponent.children,
      componentInfoObjects
    });



    if (serializedComponent.variants === undefined) {
      serializedComponent.variants = {};
    }

    serializedComponent.variants.descendantVariantComponents = descendantVariantComponents;


    // number of variants is the product of 
    // number of variants for each descendantVariantComponent
    numberOfVariants = 1;

    let numberOfVariantsByDescendant = [];
    for (let descendant of descendantVariantComponents) {
      let descendantClass = componentInfoObjects.allComponentClasses[descendant.componentType];
      let result = descendantClass.determineNumberOfUniqueVariants({
        serializedComponent: descendant,
        componentInfoObjects
      })
      if (!result.success) {
        return { success: false }
      }
      numberOfVariantsByDescendant.push(result.numberOfVariants);
      numberOfVariants *= result.numberOfVariants;
    }


    serializedComponent.variants.numberOfVariants = numberOfVariants;
    serializedComponent.variants.uniqueVariantData = { numberOfVariantsByDescendant };

    return { success: true, numberOfVariants }

  }

  static getUniqueVariant({ serializedComponent, variantIndex, componentInfoObjects }) {

    let numberOfVariants = serializedComponent.variants?.numberOfVariants;
    if (numberOfVariants === undefined) {
      return { success: false }
    }

    if (!Number.isInteger(variantIndex) || variantIndex < 1 || variantIndex > numberOfVariants) {
      return { success: false }
    }

    let haveNontrivialSubvariants = false;

    let numberOfVariantsByDescendant = serializedComponent.variants.uniqueVariantData.numberOfVariantsByDescendant;
    let descendantVariantComponents = serializedComponent.variants.descendantVariantComponents;

    if (descendantVariantComponents.length > 0) {

      let indicesForEachDescendant = enumerateCombinations({
        numberOfOptionsByIndex: numberOfVariantsByDescendant,
        maxNumber: variantIndex,
      })[variantIndex - 1].map(x => x + 1);

      // for each descendant, get unique variant corresponding
      // to the selected variant number and include that as a subvariant

      let subvariants = [];

      for (let descendantNum = 0; descendantNum < numberOfVariantsByDescendant.length; descendantNum++) {
        if (numberOfVariantsByDescendant[descendantNum] > 1) {
          let descendant = descendantVariantComponents[descendantNum];
          let compClass = componentInfoObjects.allComponentClasses[descendant.componentType];
          let result = compClass.getUniqueVariant({
            serializedComponent: descendant,
            variantIndex: indicesForEachDescendant[descendantNum],
            componentInfoObjects,
          });
          if (!result.success) {
            return { success: false }
          }
          subvariants.push(result.desiredVariant);
          haveNontrivialSubvariants = true;
        } else {
          subvariants.push({});
        }
      }
    }

    let desiredVariant = { index: variantIndex };
    if (haveNontrivialSubvariants) {
      desiredVariant.subvariants = subvariants;
    }

    return { success: true, desiredVariant }

  }

}
