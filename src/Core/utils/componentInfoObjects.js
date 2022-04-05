import * as ComponentTypes from '../ComponentTypes'


export default function createComponentInfoObjects(flags) {

  let allComponentClasses = ComponentTypes.allComponentClasses();
  let componentTypesCreatingVariants = ComponentTypes.componentTypesCreatingVariants();

  let componentTypeLowerCaseMapping = {};
  for (let componentType in allComponentClasses) {
    componentTypeLowerCaseMapping[componentType.toLowerCase()] = componentType;
  }

  let stateVariableInfo = {};
  for (let componentType in allComponentClasses) {
    Object.defineProperty(stateVariableInfo, componentType, {
      get: function () {
        let info = allComponentClasses[componentType].returnStateVariableInfo({ flags: flags });
        delete stateVariableInfo[componentType];
        return stateVariableInfo[componentType] = info;
      }.bind(this),
      configurable: true
    })
  }

  let publicStateVariableInfo = {};
  for (let componentType in allComponentClasses) {
    Object.defineProperty(publicStateVariableInfo, componentType, {
      get: function () {
        let info = allComponentClasses[componentType].returnStateVariableInfo({
          onlyPublic: true, flags: flags
        });
        delete publicStateVariableInfo[componentType];
        return publicStateVariableInfo[componentType] = info;
      }.bind(this),
      configurable: true
    })
  }


  function isInheritedComponentType({ inheritedComponentType, baseComponentType }) {
    if (inheritedComponentType === baseComponentType) {
      return true;
    }
    if (inheritedComponentType === "string") {
      return baseComponentType === "_base" || baseComponentType === "_inline";
    } else if (baseComponentType === "string") {
      return false;
    }

    let baseClass = allComponentClasses[baseComponentType];
    if (!baseClass) {
      return false;
    }
    return baseClass.isPrototypeOf(
      allComponentClasses[inheritedComponentType]
    );
  }


  function isCompositeComponent({ componentType, includeNonStandard = true }) {
    let componentClass = allComponentClasses[componentType];
    if (!componentClass) {
      return false;
    }

    let isComposite = isInheritedComponentType({
      inheritedComponentType: componentType,
      baseComponentType: "_composite"
    })

    return isComposite &&
      (includeNonStandard || !componentClass.treatAsComponentForRecursiveReplacements)
  }


  return {
    allComponentClasses,
    componentTypesCreatingVariants,
    componentTypeLowerCaseMapping,
    isInheritedComponentType,
    isCompositeComponent,
    stateVariableInfo,
    publicStateVariableInfo
  };


}

