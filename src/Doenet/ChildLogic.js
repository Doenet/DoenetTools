import { flattenDeep } from "./utils/array";

export default class ChildLogic {
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
      // let propertySpecification = properties[property];
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
        takePropertyChildren: true,
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
    condition,
    allowSpillover, excludeComponentTypes, excludeCompositeReplacements, takePropertyChildren,
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
      takePropertyChildren,
      comparison, number,
      requireConsecutive, condition,
      allowSpillover,
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
    allowSpillover,
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

  applyLogic({ activeChildren, maxAdapterNumber = 0 }) {

    if (this.propertyAndBaseLogic === undefined) {
      // OK to have no child logic if have no activeChildren
      if (activeChildren.length === 0) {
        this.logicResult = { success: true, childMatches: [] };
      } else {
        this.logicResult = { success: false, message: activeChildren.length + " extra children." };
      }
      return this.logicResult;
    }

    try {
      this.logicResult = this.propertyAndBaseLogic.applyLogic({
        activeChildren,
        maxAdapterNumber: maxAdapterNumber,
      });
    } catch (e) {
      console.warn(`error encountered when evaluating child logic`)
      console.warn(e);
      this.logicResult = { success: false, message: e.message };
      return this.logicResult;
    }

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
    takePropertyChildren = false,
    comparison = "exactly", number = 1,
    requireConsecutive = false, condition,
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
    this.takePropertyChildren = takePropertyChildren;

    this.comparison = comparison;
    this.number = number;
    this.requireConsecutive = requireConsecutive;
    this.condition = condition;
    this.allowSpillover = allowSpillover;


    if (!["atLeast", "atMost", "exactly"].includes(comparison)) {
      throw Error("Error in leaf " + name + " from child logic of " + this.parentComponentType
        + ": comparision must be 'atLeast', 'atMost', or 'exactly'");
    }
    if (!(Number.isInteger(number) && number >= 0)) {
      throw Error("Error in leaf " + name + " from child logic of " + this.parentComponentType
        + ": number must be a non-negative integer");
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
    previouslyMatched = [],
    maxAdapterNumber
  }) {

    // Note: it is OK if componentType is not a valid component type
    // In this case, componentClass will be undefined,
    // and we will return no matches with this leaf
    this.componentClass = this.allComponentClasses[this.componentType];

    let childMatches = [];
    let adapterResults = {};

    if (this.componentClass !== undefined) {
      for (let childNum = 0; childNum < activeChildren.length; childNum++) {
        if (previouslyMatched.includes(childNum)) {
          continue;
        }
        let child = activeChildren[childNum];

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
          if (matched) {
            matched = (this.takePropertyChildren && child.doenetAttributes.isPropertyChild)
              || (!this.takePropertyChildren && !child.doenetAttributes.isPropertyChild)
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

    return { success: true, childMatches: childMatches, adapterResults: adapterResults, };

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
    previouslyMatched = [],
    maxAdapterNumber }) {

    // check if each proposition is satisfied
    let childMatches = [];
    let adapterResults = {};
    let numSuccess = 0;
    let allResults = [];
    let newPreviouslyMatched = previouslyMatched.slice(0); // copy

    for (let proposition of this.propositions) {
      // recurse
      let result = proposition.applyLogic({
        activeChildren,
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

        // although have more than one match
        // it is possible that all the successful matches were with zero children
        // in which case propositionOfMinIndex is undefined
        // and there is nothing to do here

        if (propositionOfMinIndex !== undefined) {
          // reset adapterResults
          // to correspond to the one proposition chosen
          adapterResults = allResults[propositionOfMinIndex].adapterResults;
        }
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

    return { success: true, childMatches: childMatches, adapterResults: adapterResults, };

  }

  checkIfChildInLogic(child, allowInheritance) {
    return this.propositions.some(x => x.checkIfChildInLogic(child, allowInheritance));
  }

}
