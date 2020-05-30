export default class childLogic {
  constructor({ properties, parentComponentType,
    allComponentClasses, standardComponentClasses, components }) {
    this.logicComponents = {};
    this.parentComponentType = parentComponentType;
    this.allComponentClasses = allComponentClasses;
    this.standardComponentClasses = standardComponentClasses;
    this.components = components;
    this.setProperties(properties);
  }

  setParentComponentType(parentComponentType) {
    this.parentComponentType = parentComponentType.toLowerCase();
  }

  setProperties(properties) {
    this.properties = properties;

    let propertyKeys = Object.keys(properties);
    let nProperties = propertyKeys.length;
    let propertyPropositions = [];

    for (let property of propertyKeys) {
      let propertySpecification = properties[property];
      let name = '_property_' + property;

      let leaf;
      // TODO: determine how to handle case where want to allow
      // multiple matches to property
      // changed how isArray works to make it like other state variables
      // if (propertySpecification.isArray) {
      //   leaf = new ChildLogicLeaf({
      //     name: name,
      //     componentType: propertySpecification.singularName,
      //     comparison: 'atLeast',
      //     number: 0,
      //     allowSpillover: false,
      //     parentComponentType: this.parentComponentType,
      //     allComponentClasses: this.allComponentClasses,
      //     standardComponentClasses: this.standardComponentClasses,
      //     components: this.components,
      //   });
      // } else {
      leaf = new ChildLogicLeaf({
        name: name,
        componentType: property,
        comparison: 'atMost',
        number: 1,
        allowSpillover: false,
        excludeCompositeReplacements: true,
        parentComponentType: this.parentComponentType,
        allComponentClasses: this.allComponentClasses,
        standardComponentClasses: this.standardComponentClasses,
        components: this.components,
      });
      this.properties[property].name = name;
      this.logicComponents[name] = leaf;
      propertyPropositions.push(leaf);
    }
    this.propertyLogic = undefined;

    if (nProperties >= 1) {
      let name = '_properties';
      this.propertyLogic = new ChildLogicOperator({
        name: name,
        operator: 'and',
        propositions: propertyPropositions,
        parentComponentType: this.parentComponentType,
        allComponentClasses: this.allComponentClasses,
        standardComponentClasses: this.standardComponentClasses,
        components: this.components,
      });
      this.logicComponents[name] = this.propertyLogic;
    }
    this.combinePropertyAndBase();
  }

  combinePropertyAndBase() {
    if (this.baseLogic !== undefined) {
      if (this.propertyLogic !== undefined) {
        let name = '_propertyAndBase';
        this.propertyAndBaseLogic = new ChildLogicOperator({
          name: name,
          operator: 'and',
          propositions: [this.propertyLogic, this.baseLogic],
          parentComponentType: this.parentComponentType,
          allComponentClasses: this.allComponentClasses,
          standardComponentClasses: this.standardComponentClasses,
          components: this.components,
        });
        this.logicComponents[name] = this.propertyAndBaseLogic;
      } else {
        this.propertyAndBaseLogic = this.baseLogic;
      }
    } else {
      this.propertyAndBaseLogic = this.propertyLogic;
    }
  }

  deleteAllLogic() {
    for (let name in this.logicComponents) {
      if (name.substring(0, 1) !== '_') {
        delete this.logicComponents[name];
      }
    }
    delete this.baseLogic;
    this.combinePropertyAndBase();
  }

  newLeaf({ name, componentType, getComponentType, comparison, number, requireConsecutive,
    condition, isSugar, repeatSugar, replacementFunction, returnSugarDependencies, logicToWaitOnSugar,
    allowSpillover, excludeComponentTypes, excludeCompositeReplacements,
    setAsBase = false, ...invalidArguments
  }) {

    if (name === undefined) {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": child logic leaf must be named");
    }
    if (name.substring(0, 1) === '_') {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": child logic leaf name cannot begin with _");
    }
    if (name in this.logicComponents) {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": name " + name + " duplicated");
    }
    if (Object.keys(invalidArguments).length > 0) {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": unexpected arguments to child logic leaf named " + name);
    }

    let leaf = new ChildLogicLeaf({
      name,
      componentType, getComponentType, excludeComponentTypes,
      excludeCompositeReplacements,
      comparison, number,
      requireConsecutive, condition,
      isSugar, repeatSugar, returnSugarDependencies, logicToWaitOnSugar,
      replacementFunction, allowSpillover,
      parentComponentType: this.parentComponentType,
      allComponentClasses: this.allComponentClasses,
      standardComponentClasses: this.standardComponentClasses,
      components: this.components,
    });

    this.logicComponents[name] = leaf;

    if (setAsBase) {
      this.baseLogic = leaf;
      this.combinePropertyAndBase();
    }

    return leaf;
  }

  newOperator({ name, operator, propositions, sequenceMatters, requireConsecutive,
    isSugar, repeatSugar, separateSugarInputs, replacementFunction, returnSugarDependencies,
    logicToWaitOnSugar, allowSpillover,
    setAsBase = false, ...invalidArguments
  }) {

    if (name === undefined) {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": child logic operator must be named");
    }
    if (name.substring(0, 1) === '_') {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": child logic operator name cannot begin with _");
    }
    if (name in this.logicComponents) {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": name " + name + " duplicated");
    }

    if (Object.keys(invalidArguments).length > 0) {
      throw Error("Error in child logic of " + this.parentComponentType
        + ": unexpected arguments to child logic operator named " + name);
    }

    let logicOperator = new ChildLogicOperator({
      name,
      operator, propositions,
      sequenceMatters, requireConsecutive,
      isSugar, repeatSugar,
      separateSugarInputs, replacementFunction, returnSugarDependencies, logicToWaitOnSugar,
      allowSpillover,
      parentComponentType: this.parentComponentType,
      allComponentClasses: this.allComponentClasses,
      standardComponentClasses: this.standardComponentClasses,
      components: this.components,
    });

    this.logicComponents[name] = logicOperator;

    if (setAsBase) {
      this.baseLogic = logicOperator;
      this.combinePropertyAndBase();
    }

    return logicOperator;
  }

  getLogicComponent(name) {
    return this.logicComponents[name];
  }

  applyLogic({ activeChildren,
    matchSugar = true, maxAdapterNumber = 0
  }) {

    if (this.usedSugar) {
      matchSugar = false;
    }

    if (this.propertyAndBaseLogic === undefined) {
      // OK to have no child logic if have no activeChildren
      if (activeChildren.length === 0) {
        this.logicResult = { success: true, childMatches: [] };
      } else {
        this.logicResult = { success: false, message: activeChildren.length + " extra children." };
      }
      return this.logicResult;
    }

    this.logicResult = this.propertyAndBaseLogic.applyLogic({
      activeChildren,
      matchSugar,
      maxAdapterNumber: maxAdapterNumber,
    });

    // number of matches must match number of activeChildren
    if (this.logicResult.success === true) {
      let flattenedMatchIndices = flattenDeep(this.logicResult.childMatches);
      if (flattenedMatchIndices.length !== activeChildren.length) {
        this.logicResult = { success: false, message: (activeChildren.length - flattenedMatchIndices.length) + " extra children." };
      }
    }

    return this.logicResult;
  }

  checkIfChildInLogic(child, allowInheritance = false) {

    if (this.propertyAndBaseLogic === undefined) {
      return false;
    }

    return this.propertyAndBaseLogic.checkIfChildInLogic(child, allowInheritance);

  }

  returnMatches(name) {


    if (this.propertyAndBaseLogic === undefined) {
      return;
    }

    if (this.logicResult.success !== true) {
      if (name in this.logicComponents) {
        return [];
      } else {
        return;
      }
    }

    let resultIndices = this.propertyAndBaseLogic.indicesFromNames[name];

    if (resultIndices === undefined) {
      return;
    }

    let matches = this.logicResult.childMatches;
    for (let ind of resultIndices) {
      matches = matches[ind];
      if (matches === undefined) {
        return [];
      }
    }

    matches = flattenDeep(matches);
    matches.sort((a, b) => a - b);

    return matches;

  }

  calculateSugarReplacements({ childMatches, activeChildren, allChildren, definingChildren,
    separateSugarInputs, replacementFunction, dependencyValues, idRng }) {

    let flattenedMatches = flattenDeep(childMatches);
    flattenedMatches.sort((a, b) => a - b);

    let activeChildrenMatched = flattenedMatches.map(x => activeChildren[x]);

    let activeChildrenPieces = [];
    let replacementResults = [];
    let gatheredChildChanges = {};

    if (separateSugarInputs === true) {
      for (let cm of childMatches) {
        let flattenedMatches = flattenDeep(cm);
        flattenedMatches.sort((a, b) => a - b);
        activeChildrenPieces.push(flattenedMatches.map(x => activeChildren[x]));
      }

      let activeChildrenPiecesBasicInfoOnly = activeChildrenPieces.map(x => ({
        componentType: x.componentType,
        componentName: x.componentName
      }))

      let result = replacementFunction({
        activeChildrenPieces: activeChildrenPiecesBasicInfoOnly,
        components: this.components,
        dependencyValues,
        allComponentClasses: this.allComponentClasses,
        idRng,
      });
      if (result.success !== true) {
        return { success: false, message: "Sugar for " + this.parentComponentType + " did not succeed." }
      }
      replacementResults = result.resultsByPiece;

      // gather child changes requested
      // throw error if same child twice
      for (let piece of replacementResults) {
        if (piece.childChanges !== undefined) {
          for (let childName in piece.childChanges) {
            if (childName in gatheredChildChanges) {
              return { success: false, message: "Sugar for " + this.parentComponentType + " did not succeed due to duplicate child changes." }
            }
            gatheredChildChanges[childName] = piece.childChanges[childName];
          }
        }
      }
    } else {

      activeChildrenPieces.push(activeChildrenMatched);

      let activeChildrenMatchedBasicInfoOnly = activeChildrenMatched.map(x => ({
        componentType: x.componentType,
        componentName: x.componentName
      }))

      let result = replacementFunction({
        activeChildrenMatched: activeChildrenMatchedBasicInfoOnly,
        components: this.components,
        dependencyValues,
        allComponentClasses: this.allComponentClasses,
        idRng
      });
      if (result.success !== true) {
        return { success: false, message: "Sugar for " + this.parentComponentType + " did not succeed." }
      }
      replacementResults.push(result);
      gatheredChildChanges = result.childChanges;

    }

    let baseChanges = [];

    for (let ind in activeChildrenPieces) {

      // verify that 
      // -- only string children are set to be deleted
      // -- all children are either to be deleted or appear once in newChildren
      let verifyResult = this.verifySugar({
        activeChildrenMatched: activeChildrenPieces[ind],
        toDelete: replacementResults[ind].toDelete,
        newChildren: replacementResults[ind].newChildren,
        allChildren: allChildren,
        definingChildren: definingChildren
      });

      if (verifyResult.success !== true) {
        return verifyResult;
      }

      baseChanges.push(verifyResult);
    }


    if (gatheredChildChanges === undefined || Object.keys(gatheredChildChanges).length === 0) {
      return {
        success: true,
        baseChanges: baseChanges,
      }
    }

    let childChanges = {};

    let activeChildrenMatchedNameSet = new Set([]);
    activeChildrenMatched.forEach(x => {
      activeChildrenMatchedNameSet.add(x.componentName)
    });

    for (let childName in gatheredChildChanges) {

      let changes = gatheredChildChanges[childName];

      let child = allChildren[childName].component;

      if (!activeChildrenMatchedNameSet.has(child.componentName)) {
        throw Error("Invalid sugar for " + this.parentComponentType
          + ". Can't change child than logic didn't match");
      }

      let activeGrandchildrenMatched = changes.activeChildrenMatched;

      let activeGrandchildrenIndices = [];
      // verify that activeGrandchildrenMatched contains valid components
      for (let grandChild of activeGrandchildrenMatched) {
        let name = grandChild.componentName;
        if (child.allChildren[name] === undefined ||
          child.allChildren[name].activeChildrenIndex === undefined) {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Specified component isn't an active grandchild");
        }
        activeGrandchildrenIndices.push(child.allChildren[name].activeChildrenIndex)
      }
      activeGrandchildrenIndices.sort((a, b) => a - b);

      for (let ind = 1; ind < activeGrandchildrenIndices.length; ind++) {
        if (activeGrandchildrenIndices[ind - 1] !== activeGrandchildrenIndices[ind] - 1) {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Must specify sequential active grandchildren");

        }
      }

      let verifyGrandchildrenResult = this.verifySugar({
        activeChildrenMatched: activeGrandchildrenMatched,
        toDelete: changes.toDelete,
        newChildren: changes.newChildren,
        allChildren: child.allChildren,
        definingChildren: child.definingChildren
      });

      if (verifyGrandchildrenResult.success !== true) {
        return verifyGrandchildrenResult;
      }

      childChanges[childName] = verifyGrandchildrenResult;

    }

    return {
      success: true,
      baseChanges: baseChanges,
      childChanges: childChanges,
    }
  }

  verifySugar({ activeChildrenMatched, toDelete, newChildren, allChildren, definingChildren }) {

    // all newly created components in newChildren must be of known types
    if (this.verifyHaveKnownComponentTypes({ components: newChildren }) !== true) {
      return { success: false, message: "Sugar for " + this.parentComponentType + " included undefined component types." }
    }

    let childrenAddressed = {};
    let childrenToDelete = [];
    let activeChildrenMatchedObj = {};

    activeChildrenMatched.forEach(x => activeChildrenMatchedObj[x.componentName] = x);

    if (toDelete !== undefined) {
      for (let childName of toDelete) {
        if (!(childName in activeChildrenMatchedObj)) {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Can't delete child than logic didn't match");
        }

        let child = allChildren[childName].component;
        if (child.componentType !== "string") {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Can delete only string children.");
        }
        if (childName in childrenAddressed) {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Cannot delete same child twice.");
        }
        childrenAddressed[childName] = "delete";
        childrenToDelete.push(childName);
      }
    }

    this.gatherChildrenAddressed({
      components: newChildren,
      activeChildrenMatchedObj: activeChildrenMatchedObj,
      childrenAddressed: childrenAddressed
    });

    // check if each child was addressed 
    for (let child of activeChildrenMatched) {
      if (!(child.componentName in childrenAddressed)) {
        throw Error("Invalid sugar for " + this.parentComponentType
          + ". Some children do not appear in results.");
      }
    }

    let definingChildrenIndices = [];
    let compositesFound = {};
    let definingIndexForActiveChild = {};
    let activeChildrenForDefiningIndex = {};

    for (let component of activeChildrenMatched) {

      let potentialDefiningChild = component;
      let definingChildIndex = allChildren[potentialDefiningChild.componentName].definingChildrenIndex;
      while (definingChildIndex === undefined) {
        // try to find what child is a replacement or adapter for
        let foundNewPotentialDefiningChild = false;
        if (potentialDefiningChild.adaptedFrom) {
          foundNewPotentialDefiningChild = true;
          potentialDefiningChild = potentialDefiningChild.adaptedFrom;
          definingChildIndex = allChildren[potentialDefiningChild.componentName].definingChildrenIndex;
        } else if (potentialDefiningChild.replacementOf) {
          let composite = potentialDefiningChild.replacementOf;
          if (compositesFound[composite.componentName] === undefined) {
            compositesFound[composite.componentName] =
              { replacementsFound: new Set([]) };
          }
          compositesFound[composite.componentName].composite = composite;
          compositesFound[composite.componentName].replacementsFound.add(
            potentialDefiningChild.componentName)
          potentialDefiningChild = composite;
          definingChildIndex = allChildren[potentialDefiningChild.componentName].definingChildrenIndex;
          foundNewPotentialDefiningChild = true;
        }
        if (!foundNewPotentialDefiningChild) {
          break;
        }
      }

      if (definingChildIndex === undefined) {
        return { success: false, message: "Sugar for " + this.parentComponentType + " did not succeed." }
      }

      definingIndexForActiveChild[component.componentName] = definingChildIndex;
      let lastIndex = definingChildrenIndices[definingChildrenIndices.length - 1];
      if (lastIndex === undefined || definingChildIndex !== lastIndex) {
        definingChildrenIndices.push(definingChildIndex)
        activeChildrenForDefiningIndex[definingChildIndex] = [component];
      } else {
        activeChildrenForDefiningIndex[definingChildIndex].push(component);
      }
    }

    // to be valid,
    //  -definingChildrenIndices must be consecutive, unless missing indices
    //   correspond to composites with no replacements
    //  -all composites matched must have all replacements matched
    //  -immediately preceeding and following defining children, if exist,
    //   must not be composites with no replacements
    //   (as in that case we wouldn't know if they should be included)

    let definingGaps = [];
    for (let i = 1; i < definingChildrenIndices.length; i++) {
      let inda = definingChildrenIndices[i - 1];
      let indb = definingChildrenIndices[i];

      if (indb === inda + 1) {
        continue;
      }
      if (indb < inda) {
        throw Error("Something went wrong in sugar for " + this.parentComponentType
          + ": children out of order");
      }

      // found a gap in defining children
      // check if missing children are composites with no replacements
      for (let indc = inda + 1; indc < indb; indc++) {
        let definingChild = definingChildren[indc];
        if (!(definingChild instanceof this.allComponentClasses['_composite'] &&
          definingChild.replacements.length === 0)) {
          return { success: false, message: "Sugar for " + this.parentComponentType + " did not succeed: children not consecutive" };
        }
      }

      // merge consecutive gaps
      if (definingGaps.length > 0) {
        let lastGap = definingGaps[definingGaps.length - 1];
        if (lastGap[1] === inda) {
          definingGaps[definingGaps.length - 1] = [...lastGap, indb];
          continue;
        }
      }

      definingGaps.push([inda, indb]);
    }

    for (let compositeName in compositesFound) {
      let composite = compositesFound[compositeName].composite;
      let replacementsFound = compositesFound[compositeName].replacementsFound;
      for (let replacement of composite.replacements) {
        if (!(replacementsFound.has(replacement.componentName))) {
          return { success: false, message: "Sugar for " + this.parentComponentType + " did not succeed." }
        }
      }
    }

    let compositeHasReplacement = function (composite) {
      if (composite.replacements.length === 0) {
        return false;
      }
      for (let replacement of composite.replacements) {
        if (!(replacement instanceof this.allComponentClasses['_composite'])) {
          return true;
        }
        if (compositeHasReplacement(replacement)) {
          return true;
        }
      }
      return false;
    }.bind(this);

    let firstDefiningIndex = definingChildrenIndices[0];
    let lastDefiningIndex = definingChildrenIndices[definingChildrenIndices.length - 1];
    let nDefiningIndices = lastDefiningIndex - firstDefiningIndex + 1;

    let adjacentIndices = [];
    if (firstDefiningIndex > 0) {
      adjacentIndices.push(firstDefiningIndex - 1);
    }
    if (lastDefiningIndex < definingChildren.length - 1) {
      adjacentIndices.push(lastDefiningIndex + 1)
    }

    for (let ind of adjacentIndices) {
      let definingChild = definingChildren[ind];
      if (definingChild instanceof this.allComponentClasses['_composite']) {
        if (!compositeHasReplacement(definingChild)) {
          return {
            success: false, message: "Sugar for " + this.parentComponentType +
              " did not succeed as matches were adjacent to a composite with no replacements."
          }
        }
      }
    }

    // replace activeChildren with definingChildren 
    // In two cases, the activeChildren must be consecutive in newChildren 
    // 1. If more than one activeChild map to the same definingChild,
    //    all must be replaced with the single definingChild
    // 2. If there is a gap in defining index, the components
    //    on either side must be consecutive, as the gap indices 
    //    must be replaced with them

    let activeToDefiningSubstitutions = {};
    let activeUsed = new Set([]);

    // first add gaps
    for (let gap of definingGaps) {
      let firstActiveName = activeChildrenForDefiningIndex[gap[0]][0].componentName;
      let activeNames = [];
      for (let ind = 0; ind < gap.length; ind++) {
        activeNames = [...activeNames,
        ...activeChildrenForDefiningIndex[gap[ind]].map(x => x.componentName)];
      }
      let definingIndices = [];
      for (let ind = gap[0]; ind <= gap[gap.length - 1]; ind++) {
        definingIndices.push(ind);
      }
      activeToDefiningSubstitutions[firstActiveName] = {
        activeNames: activeNames,
        definingIndices: definingIndices
      }
      for (let name of activeNames) {
        activeUsed.add(name);
      }
    }

    // next add any that aren't in gap
    for (let activeChild of activeChildrenMatched) {

      // if already addressed in gap or a previous group, skip
      if (activeUsed.has(activeChild.componentName)) {
        continue;
      }

      let definingIndex = definingIndexForActiveChild[activeChild.componentName];
      let activeNames = activeChildrenForDefiningIndex[definingIndex].map(x => x.componentName);

      let firstActiveName = activeNames[0];
      activeToDefiningSubstitutions[firstActiveName] = {
        activeNames: activeNames,
        definingIndices: [definingIndex],
      }
      for (let name of activeNames) {
        activeUsed.add(name);
      }

    }

    // loop through all activeChildren found in newChildren
    // and use activeToDefiningSubstitutions to replace with definingChildren
    // if activeToDefiningSubstitutions includes more than one activeName
    // then make sure they are all consecutive and replace whole group as one
    activeUsed = new Set([]);

    for (let activeName in childrenAddressed) {

      if (activeUsed.has(activeName)) {
        continue;
      }

      let newChildrenStructure = childrenAddressed[activeName];
      let substitutions = activeToDefiningSubstitutions[activeName];
      if (newChildrenStructure === "delete") {
        if (substitutions && substitutions.definingIndices.length > 1) {
          return {
            success: false, message: "Sugar for " + this.parentComponentType +
              " did not succeed as cannot delete components adjacent to a composite with no replacements."
          }
        }
        continue;
      }

      let activeNames = substitutions.activeNames;
      let childContainer = newChildrenStructure.newSiblings

      let replaceInd;
      if (activeNames.length === 1) {
        for (let ind = 0; ind < childContainer.length; ind++) {
          let comp = childContainer[ind];
          if (comp.createdComponent === true && comp.componentName === activeName) {
            replaceInd = ind;
            break;
          }
        }
        activeUsed.add(activeName);
      } else {
        // more than one name, must find them consecutive within siblings
        let siblingStructure = newChildrenStructure.newSiblings;
        let firstActiveName = activeNames[0];

        for (let ind in siblingStructure) {
          let serializedComponent = siblingStructure[ind];
          if (serializedComponent.createdComponent === true &&
            serializedComponent.componentName === firstActiveName) {

            // see if remaining indices match activeNames
            let matched = true;
            for (let i = 1; i < activeNames.length; i++) {
              let comp = siblingStructure[Number(ind) + i];
              if (!(comp.createdComponent === true &&
                comp.componentName === activeNames[i])) {
                matched = false;
                break;
              }
            }
            if (!matched) {
              return {
                success: false, message: "Sugar for " + this.parentComponentType +
                  " did not succeed as it didn't keep required groups adjacent"
              }
            }

            replaceInd = ind;
            break;
          }
        }

        if (replaceInd === undefined) {
          return {
            success: false, message: "Sugar for " + this.parentComponentType +
              " did not succeed as it didn't keep required groups adjacent"
          }
        }
        for (let name of activeNames) {
          activeUsed.add(name);
        }
      }

      let newDefiningChildren = substitutions.definingIndices.map(x => ({
        createdComponent: true,
        componentName: definingChildren[x].componentName,
      }))

      childContainer.splice(replaceInd, activeNames.length, ...newDefiningChildren);

    }

    return {
      success: true,
      newChildren: newChildren,
      childrenToDelete: childrenToDelete,
      firstDefiningIndex: firstDefiningIndex,
      nDefiningIndices: nDefiningIndices,
    }

  }

  gatherChildrenAddressed({ components, activeChildrenMatchedObj,
    childrenAddressed
  }) {
    for (let component of components) {
      if (component.createdComponent === true) {
        if (!(component.componentName in activeChildrenMatchedObj)) {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Can't include child that logic didn't match");
        }
        if (component.componentName in childrenAddressed) {
          throw Error("Invalid sugar for " + this.parentComponentType
            + ". Same child cannot appear in results twice.");
        }
        childrenAddressed[component.componentName] = {
          newChild: component,
          newSiblings: components,
        };
      }
      else if (component.children !== undefined) {
        // recurse
        this.gatherChildrenAddressed({
          components: component.children,
          activeChildrenMatchedObj: activeChildrenMatchedObj,
          childrenAddressed: childrenAddressed
        });
      }
    }
  };

  verifyHaveKnownComponentTypes({ components }) {
    for (let component of components) {
      if (component.createdComponent === true) {
        continue;
      }
      if (component.componentType === undefined) {
        return false;
      }
      if (this.standardComponentClasses[component.componentType.toLowerCase()] === undefined) {
        return false;
      }
      if (component.children !== undefined) {
        // recurse
        let result = this.verifyHaveKnownComponentTypes({
          components: component.children
        });
        if (result !== true) {
          return false;
        }
      }
    }
    return true;
  };
}

class ChildLogicBase {
  constructor({ name, parentComponentType, allComponentClasses, standardComponentClasses, components }) {
    this.name = name;
    this.parentComponentType = parentComponentType.toLowerCase();
    this.allComponentClasses = allComponentClasses;
    this.standardComponentClasses = standardComponentClasses;
    this.components = components;
  }

  applyLogic() {
  }

  checkIfChildInLogic() {
  }

  setIndicesFromNames() {
    this.indicesFromNames = {};
  }



}

class ChildLogicLeaf extends ChildLogicBase {
  constructor({ name, componentType, getComponentType, excludeComponentTypes,
    excludeCompositeReplacements = false,
    comparison = "exactly", number = 1,
    requireConsecutive = false, condition, isSugar = false, repeatSugar = false,
    replacementFunction, returnSugarDependencies, logicToWaitOnSugar,
    allowSpillover = true,
    parentComponentType,
    allComponentClasses,
    standardComponentClasses,
    components,
  }) {

    super({
      name: name,
      parentComponentType: parentComponentType,
      allComponentClasses: allComponentClasses,
      standardComponentClasses: standardComponentClasses,
      components: components
    })

    if (getComponentType !== undefined) {
      Object.defineProperty(this, 'componentType', { get: () => getComponentType().toLowerCase() });
    } else {
      this.componentType = componentType.toLowerCase();
    }
    this.excludeComponentTypes = excludeComponentTypes;
    this.excludeCompositeReplacements = excludeCompositeReplacements;

    this.comparison = comparison;
    this.number = number;
    this.requireConsecutive = requireConsecutive;
    this.condition = condition;
    this.isSugar = isSugar;
    this.repeatSugar = repeatSugar;
    this.replacementFunction = replacementFunction;
    this.returnSugarDependencies = returnSugarDependencies;
    this.logicToWaitOnSugar = logicToWaitOnSugar;
    this.allowSpillover = allowSpillover;


    if (!["atLeast", "atMost", "exactly"].includes(comparison)) {
      throw Error("Error in leaf " + name + " from child logic of " + this.parentComponentType
        + ": comparision must be 'atLeast', 'atMost', or 'exactly'");
    }
    if (!(Number.isInteger(number) && number >= 0)) {
      throw Error("Error in leaf " + name + " from child logic of " + this.parentComponentType
        + ": number must be a non-negative integer");
    }
    if (isSugar === true && replacementFunction === undefined) {
      throw Error("Error in leaf " + name + " from child logic of " + this.parentComponentType
        + ": replacementFunction must be defined when is sugar");
    }

    this.maxMatches = Infinity;
    if (this.allowSpillover) {
      // if allow spillover, then stop matching one get desired number,
      // leaving remaining activeChildren for a potential future leaf
      // (if don't allow spillover, match as many as possible, leading to
      // a failure if too many matches were created)
      if (this.comparison === "atMost" || this.comparison === "exactly") {
        this.maxMatches = this.number;
      }
    }

    this.setIndicesFromNames();

  }

  setIndicesFromNames() {
    this.indicesFromNames = {};
    this.indicesFromNames[this.name] = [];
  }

  applyLogic({ activeChildren,
    matchSugar, previouslyMatched = [],
    maxAdapterNumber
  }) {

    if (this.usedSugar) {
      matchSugar = false;
    }

    // Note: it is OK if componentType is not a valid component type
    // In this case, componentClass will be undefined,
    // and we will return no matches with this leaf
    this.componentClass = this.allComponentClasses[this.componentType];

    if (matchSugar === false && this.isSugar === true) {
      return { success: false, message: "Sugar not allowed." };
    }

    let childMatches = [];
    let adapterResults = {};

    if (this.componentClass !== undefined) {
      for (let childNum = 0; childNum < activeChildren.length; childNum++) {
        if (previouslyMatched.includes(childNum)) {
          continue;
        }
        let child = activeChildren[childNum];

        // // if child is a shadow, cannot match with sugar
        // if(child.isShadow === true && this.isSugar === true) {
        //   continue;
        // }

        let matched = false;

        if (child instanceof this.componentClass) {
          matched = true;
          if (this.condition && !this.condition(child)) {
            matched = false;
          } else if (this.excludeComponentTypes) {
            for (let ct of this.excludeComponentTypes) {
              if (child instanceof this.allComponentClasses[ct]) {
                matched = false;
                break;
              }
            }
          }
          if (matched && this.excludeCompositeReplacements && child.replacementOf) {
            matched = false;
          }
        }

        if (matched) {
          childMatches.push(childNum)
        }
        else {
          // if didn't match child, attempt to match with child's adapters

          let maxAdapt = Math.min(maxAdapterNumber, child.nAdapters);
          for (let n = 0; n < maxAdapt; n++) {
            let adapter = child.getAdapter(n);
            let adapterClass = this.allComponentClasses[adapter.componentType.toLowerCase()];
            if (adapterClass !== undefined &&
              (adapterClass === this.componentClass ||
                this.componentClass.isPrototypeOf(adapterClass))
            ) {
              matched = true;
              if (this.condition && !this.condition(child)) {
                matched = false;
              } else if (this.excludeComponentTypes) {
                for (let ct of this.excludeComponentTypes) {
                  let ctClass = this.allComponentClasses[ct];
                  if (adapterClass === ctClass || ctClass.isPrototypeOf(adapterClass)) {
                    matched = false;
                    break;
                  }
                }
              }
              if (matched) {
                childMatches.push(childNum);
                adapterResults[childNum] = adapter;
                break;
              }
            }
          }
        }

        if (childMatches.length === this.maxMatches) {
          break;
        }
      }
    }
    let numMatches = childMatches.length;
    if (this.comparison === "atLeast") {
      if (numMatches < this.number) {
        return { success: false, message: "Need at least " + this.number + " " + this.componentType + " children, but found " + numMatches + "." };
      }
    } else if (this.comparison === "exactly") {
      // note: if allow spillover, numMatches will never be greater than this.number
      if (numMatches !== this.number) {
        return { success: false, message: "Need " + this.number + " " + this.componentType + " children, but found " + numMatches + "." };
      }
    } else if (this.comparison === "atMost") {
      // note: if allow spillover, this condition will never be reached
      if (numMatches > this.number) {
        return { success: false, message: "Need at most " + this.number + " " + this.componentType + " children, but found " + numMatches + "." };
      }
    }

    // found appropriate number of matches
    // check if matches consecutive criterion
    if (this.requireConsecutive === true) {
      for (let ind = 1; ind < numMatches; ind++) {
        if (childMatches[ind] !== childMatches[ind - 1] + 1) {
          return { success: false, message: this.componentType + " children must be consecutive." };
        }
      }
    }

    // found a valid match

    if (matchSugar && this.isSugar) {
      let sugarResults = { [this.name]: true };
      return {
        success: true, childMatches: childMatches, adapterResults: adapterResults,
        sugarResults: sugarResults, repeatSugar: this.repeatSugar
      };
    } else {
      return { success: true, childMatches: childMatches, adapterResults: adapterResults, };
    }

  }

  checkIfChildInLogic(child, allowInheritance) {

    this.componentClass = this.allComponentClasses[this.componentType];

    if (child.constructor === this.componentClass ||
      (allowInheritance && child instanceof this.componentClass)
    ) {
      return true;
    } else {
      return false;
    }
  }

}

class ChildLogicOperator extends ChildLogicBase {
  constructor({ name, operator, propositions = [],
    sequenceMatters = false, requireConsecutive = false,
    isSugar = false, repeatSugar = false, separateSugarInputs = false,
    replacementFunction, returnSugarDependencies, logicToWaitOnSugar,
    allowSpillover = true,
    parentComponentType,
    allComponentClasses,
    standardComponentClasses,
    components,
  }) {

    super({
      name: name,
      parentComponentType: parentComponentType,
      allComponentClasses: allComponentClasses,
      standardComponentClasses: standardComponentClasses,
      components: components,
    })

    this.operator = operator;
    this.propositions = propositions;
    this.sequenceMatters = sequenceMatters;
    this.requireConsecutive = requireConsecutive;
    this.isSugar = isSugar;
    this.repeatSugar = repeatSugar;
    this.separateSugarInputs = separateSugarInputs;
    this.replacementFunction = replacementFunction;
    this.returnSugarDependencies = returnSugarDependencies;
    this.logicToWaitOnSugar = logicToWaitOnSugar;
    this.allowSpillover = allowSpillover;

    for (let proposition of propositions) {
      if (!(proposition instanceof ChildLogicBase)) {
        throw Error("Error in operator " + name + " from child logic of " + this.parentComponentType
          + ": each proposition must be a child logic leaf or operator");
      }
      if (!["and", "or", "xor"].includes(operator)) {
        throw Error("Error in operator " + name + " from child logic of " + this.parentComponentType
          + ": operator must be 'and', 'or', or 'xor'");
      }
    }

    if (isSugar === true && replacementFunction === undefined) {
      throw Error("Error in operator " + name + " from child logic of " + this.parentComponentType
        + ": replacementFunction must be defined when is sugar");
    }

    this.setIndicesFromNames();
  }

  setIndicesFromNames() {
    this.indicesFromNames = {};
    this.indicesFromNames[this.name] = [];

    for (let propInd in this.propositions) {
      let proposition = this.propositions[propInd];
      for (let name in proposition.indicesFromNames) {
        if (name in this.indicesFromNames) {
          throw Error("Child logic name used multiple times: " + name);
        }
        let indices = proposition.indicesFromNames[name];
        this.indicesFromNames[name] = [propInd, ...indices];
      }
    }
  }

  applyLogic({ activeChildren,
    matchSugar, previouslyMatched = [],
    maxAdapterNumber }) {

    if (this.usedSugar) {
      matchSugar = false;
    }

    if (matchSugar === false && this.isSugar === true) {
      return { success: false, message: "Sugar not allowed." };
    }

    // check if each proposition is satisfied
    let childMatches = [];
    let adapterResults = {};
    let numSuccess = 0;
    let allResults = [];
    let sugarResults = {};
    let repeatSugar = false;
    let foundSugarResults = false;
    let newPreviouslyMatched = previouslyMatched.slice(0); // copy
    let sugarsMatchedByPropositionName = {};
    for (let proposition of this.propositions) {
      // recurse
      let result = proposition.applyLogic({
        activeChildren,
        matchSugar,
        previouslyMatched: newPreviouslyMatched,
        maxAdapterNumber: maxAdapterNumber,
      });
      result.name = proposition.name;
      allResults.push(result);
      if (result.success === true) {
        numSuccess++;
        childMatches.push(result.childMatches);
        adapterResults = Object.assign(adapterResults, result.adapterResults);
        if (this.operator !== 'xor') {
          // for any logic but xor, exclude newly matched activeChildren
          newPreviouslyMatched = [...newPreviouslyMatched, ...flattenDeep(result.childMatches)];
        }
      } else {
        // for And, we can reject right away upon a failure
        if (this.operator === 'and') {
          return { success: false, message: result.message };
        }
        childMatches.push([]);
      }

      // keep track of any sugarResults
      if (result.sugarResults !== undefined) {
        foundSugarResults = true;
        Object.assign(sugarResults, result.sugarResults);
        if (result.repeatSugar === true) {
          repeatSugar = true;
        }
        sugarsMatchedByPropositionName[proposition.name] = result.sugarResults;
      }

    }

    if (this.operator === 'or') {
      if (numSuccess === 0) {
        let message = "Or criterion not matched. ("
        for (let result of allResults) {
          message += result.message + " ";
        }
        message += ")";
        return { success: false, message: message };
      }
    } else if (this.operator === 'xor') {
      if (numSuccess === 0 || (!this.allowSpillover && numSuccess > 1)) {
        let message = "Xor criterion not matched. (";
        if (numSuccess === 0) {
          for (let result of allResults) {
            message += result.message + " ";
          }
        } else {
          message += numSuccess + " criteria matched and spillover not allowed."
        }
        message += ")";
        return { success: false, message: message };
      }
      if (numSuccess > 1) {
        // if allow spillover and found more than one for xor,
        // pick one encountered first (with smallest index)
        // allowing the remaining matches to spill over any later logic
        // (we could reach here only if allow spillover)
        let minIndex = Infinity;
        let propositionOfMinIndex = undefined;
        for (let propInd in childMatches) {
          let childMatch = childMatches[propInd];
          let flatMatch = flattenDeep(childMatch);
          if (flatMatch.length > 0) {
            let newMin = Math.min(...flatMatch);
            if (newMin < minIndex) {
              minIndex = newMin;
              propositionOfMinIndex = propInd;
            }
          }
        }
        // for all propositions that weren't the first, set childMatches to empty
        for (let propInd in childMatches) {
          if (propInd !== propositionOfMinIndex) {
            childMatches[propInd] = [];
          }
        }

        // chose just the sugar from the proposition chosen
        let nameofMinIndex = allResults[propositionOfMinIndex].name;
        if (sugarsMatchedByPropositionName[nameofMinIndex]) {
          foundSugarResults = true;
          sugarResults = sugarsMatchedByPropositionName[nameofMinIndex];
        } else {
          foundSugarResults = false;
          sugarResults = {};
        }

        // reset adapterResults
        // to correspond to the one proposition chosen
        adapterResults = allResults[propositionOfMinIndex].adapterResults;

      }
    }

    if (numSuccess > 1 && this.sequenceMatters === true) {
      // if sequenceMatters, child indices from each proposition
      // must be greater than all child indices from the previous proposition

      let maxIndexPrevious = -1;
      for (let match of childMatches) {
        let flattenedMatchIndices = flattenDeep(match);
        if (flattenedMatchIndices.length > 0) {
          let minIndex = Math.min(...flattenedMatchIndices);
          if (minIndex <= maxIndexPrevious) {
            return { success: false, message: "Active children were in wrong order." };
          }
          maxIndexPrevious = Math.max(...flattenedMatchIndices);
        }
      }
    }
    if (this.requireConsecutive === true) {
      // if requireConsecutive, then can't skip any childNums
      let flattenedMatchIndices = flattenDeep(childMatches);
      flattenedMatchIndices.sort((a, b) => a - b);
      let numIndices = flattenedMatchIndices.length;
      for (let ind = 1; ind < numIndices; ind++) {
        if (flattenedMatchIndices[ind] !== flattenedMatchIndices[ind - 1] + 1) {
          return { success: false, message: "Active children must be consecutive." };
        }
      }
    }

    // if sugar, 
    if (matchSugar && this.isSugar) {
      if (foundSugarResults) {
        // can't have nested sugars
        throw Error("Error in operator " + this.name + " from child logic of " + this.parentComponentType
          + ": cannot have nested sugars");
      } else {

        sugarResults = { [this.name]: true };
        return {
          success: true, childMatches: childMatches, adapterResults: adapterResults,
          sugarResults: sugarResults, repeatSugar: this.repeatSugar
        };
      }
    } else {
      if (foundSugarResults) {
        return {
          success: true, childMatches: childMatches, adapterResults: adapterResults,
          sugarResults: sugarResults, repeatSugar: repeatSugar
        };
      } else {
        return { success: true, childMatches: childMatches, adapterResults: adapterResults, };
      }
    }
  }

  checkIfChildInLogic(child, allowInheritance) {
    return this.propositions.some(x => x.checkIfChildInLogic(child, allowInheritance));
  }

}

// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}