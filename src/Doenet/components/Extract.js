import CompositeComponent from './abstract/CompositeComponent';
import {replaceIncompleteProp} from './commonsugar/createprop';

export default class Extract extends CompositeComponent {
  static componentType = "extract";

  static returnChildLogic ({standardComponentTypes, allComponentClasses, components}) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    let anythingForSugar = childLogic.newLeaf({
      name: 'anythingForSugar',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    let atMostOneChildnumberForSugar = childLogic.newLeaf({
      name: 'atMostOneChildnumberForSugar',
      componentType: 'childnumber',
      comparison: 'atMost',
      number: 1,
    });

    let propIsIncomplete = function(child) {
      return (child.state.incomplete === true);
    }

    let exactlyOneIncompletePropForSugar = childLogic.newLeaf({
      name: "exactlyOneIncompletePropForSugar",
      componentType: 'prop',
      number: 1,
      condition: propIsIncomplete,
    });

    let incompletePropPlus = childLogic.newOperator({
      name: "incompletePropPlus",
      operator: "and",
      propositions: [exactlyOneIncompletePropForSugar, atMostOneChildnumberForSugar, anythingForSugar],
      isSugar: true,
      replacementFunction: replaceIncompleteProp,
      separateSugarInputs: true,
    })


    let atMostOneChildnumberForNothing = childLogic.newLeaf({
      name: 'atMostOneChildnumberForNothing',
      componentType: 'childnumber',
      comparison: 'atMost',
      number: 1,
    });

    let exactlyOneIncompletePropForNothing = childLogic.newLeaf({
      name: "exactlyOneIncompletePropForNothing",
      componentType: 'prop',
      number: 1,
      condition: propIsIncomplete,
    });

    let nothing = childLogic.newLeaf({
      name: "nothing",
      componentType: '_base',
      number: 0,
    });

    let nothingPlus = childLogic.newOperator({
      name: "nothingPlus",
      operator: "and",
      propositions: [atMostOneChildnumberForNothing, exactlyOneIncompletePropForNothing, nothing]
    })

    
    let anything = childLogic.newLeaf({
      name: 'anything',
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    let atMostOneChildnumber = childLogic.newLeaf({
      name: 'atMostOneChildnumber',
      componentType: 'childnumber',
      comparison: 'atMost',
      number: 1,
    });

    let propIsComplete = function(child) {
      return (child.state.incomplete !== true);
    }

    let exactlyOneCompleteProp = childLogic.newLeaf({
      name: "exactlyOneCompleteProp",
      componentType: 'prop',
      number: 1,
      condition: propIsComplete,
    });

    let completePropPlus = childLogic.newOperator({
      name: "completePropPlus",
      operator: "and",
      propositions: [exactlyOneCompleteProp, atMostOneChildnumber, anything]
    });

    childLogic.newOperator({
      name: "refTargetPropXorSugar",
      operator: "xor",
      propositions: [incompletePropPlus, completePropPlus, nothingPlus],
      setAsBase: true,
    })

    return childLogic;
  }

  updateState(args={}) {
    if(args.init) {
      this.state.numReplacementsBySource = [];
    }
    super.updateState(args);

    if(!this.childLogicSatisfied) {
      this.unresolvedState.sourceComponents = true;
      this.state.sourceComponents = [];
      this.state.previousSources = [];
      this.serializedReplacements = [];
      return;
    }

    this.state.previousSources = this.state.sourceComponents;
    if(this.state.previousSources === undefined) {
      this.state.previousSources = [];
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if(childrenChanged) {
      delete this.unresolvedState.sourceComponents;

      let childInds = this.childLogic.returnMatches("anything");
      if(childInds.length > 0) {
        this.state.sourceComponents = childInds.map(x => this.activeChildren[x]);
      }else {
        this.state.sourceComponents = [];
        this.serializedReplacements = [];
        return;
      }
        
      let atMostOneChildnumber = this.childLogic.returnMatches("atMostOneChildnumber");
      if(atMostOneChildnumber.length === 1) {
        this.state.childnumberChild = this.activeChildren[atMostOneChildnumber[0]];
      }else {
        delete this.state.childnumberChild;
      }

      let exactlyOneCompleteProp = this.childLogic.returnMatches("exactlyOneCompleteProp");
      this.state.propChild = this.activeChildren[exactlyOneCompleteProp[0]];
    }

    // if childnumber is specified, determine new sources
    // it might be undefined if childnumber is not a valid value
    if(this.state.childnumberChild) {
      if(this.state.childnumberChild.unresolvedState.number) {
        this.unresolvedState.sourceComponents = true;
        this.state.sourceComponents = [];
        this.serializedReplacements = [];
        return;
      }
      // don't bother checking for changes in childnumber, just set it
      this.state.childnumber = this.state.childnumberChild.state.number;
    }else if(this.state.childnumber !== undefined && !this._state.childnumber.essential) {
      delete this.state.childnumber;
    }
    
    let childnumber = this.state.childnumber;

    if(childnumber !== undefined) {
      let childIndex = childnumber-1;
      if(!Number.isInteger(childIndex) || childIndex < 0) {
        console.log("Invalid child number");
        this.state.sourceComponents = [];
      } else {
        for(let sourceNum=0; sourceNum < this.state.sourceComponents.length; sourceNum++) {
          let source = this.state.sourceComponents[sourceNum];

          if(childIndex < source.activeChildren.length) {
            this.state.sourceComponents[sourceNum] = source.activeChildren[childIndex];
          }else {
            this.state.sourceComponents[sourceNum] === undefined;
          }
        }
      }
    }

    // if a source is a ref or extract
    // use its replacements instead
    for(let sourceNum=0; sourceNum < this.state.sourceComponents.length; sourceNum++) {
      let source = this.state.sourceComponents[sourceNum];
      if(source !== undefined) {
        if(source.componentType === "ref" || source.componentType === "extract") {
          this.state.sourceComponents.splice(sourceNum, 1, ...source.replacements);
          sourceNum--;
          continue;
        }
        this.state.sourceComponents[sourceNum] = source;
      }
    }

    this.state.stateForSource = [];

    // get prop

    for(let sourceNum=0; sourceNum < this.state.sourceComponents.length; sourceNum++) {
      let source = this.state.sourceComponents[sourceNum];
      if(source === undefined) {
        continue;
      }

      if(this.state.stateForSource[sourceNum] === undefined) {
        this.state.stateForSource[sourceNum] = {};
      }
      let stateForSource = this.state.stateForSource[sourceNum];

      let result = this.state.propChild.validateProp({
        component: source,
        standardComponentTypes: this.standardComponentTypes,
      })

      if(result.success !== true) {
        if(result.error === true) {

          let propChildState = this.state.propChild.state;
          let message = "Cannot extract prop " + propChildState.variableName;
          if(propChildState.authorProp !== undefined) {
            message += " (" + propChildState.authorProp + ")"
          }
          message += " from " + source.componentType;
          if(source.doenetAttributes.componentAlias !== undefined) {
            message += " (" + source.doenetAttributes.componentAlias + ")";
          }
          console.warn(message);
          this.unresolvedState.stateForSource = true;

        }else if(result.unresolved === true) {
          this.unresolvedState.stateForSource = true;
        }

        this.state.sourceComponents[sourceNum] = undefined;
        continue;
      }

      stateForSource.propData = result.propData;
      stateForSource.availableClassProperties = result.availableClassProperties;

      // add state of source for any state values that
      // correspond to properties
      this.copyPropertiesFromSources(true, sourceNum);
    }

    if(args.init) {
      this.serializedReplacements = this.createSerializedReplacements();
    }

  }

  // Look in source component for property state variables.
  // If those properties haven't expectly been specified 
  // as an attribute of the <extract> tag,
  // then add those properties to the state for this source
  // Rationale: When creating the serialized replacement for the source
  // we will add these properties to the seralized replacement
  copyPropertiesFromSources(init=true, sourceNum) {
    let stateForSource = this.state.stateForSource[sourceNum];
    stateForSource.properties = {};

    for(let item in stateForSource.availableClassProperties) {

      // don't copy prop
      if(item === "prop") {
        continue;
      }

      let propertyInSource = this.state.sourceComponents[sourceNum]._state[item];

      // don't copy a state variable from target than isn't a property
      if(propertyInSource !== undefined && propertyInSource.isProperty !== true) {
        continue;
      }

      if(propertyInSource !== undefined) {
        stateForSource.properties[item] = propertyInSource.value;
      }else {
        if(init && stateForSource.availableClassProperties[item].default !== undefined) {
          // assign default value if available and not defined elsewhere
          stateForSource.properties[item] = stateForSource.availableClassProperties[item].default;
        }
      }
    }

    // check if any properties have been added explicitly in extract tag
    // and add those to state
    // (Currently, only possibilities are the properties from basecomponent:
    // hide, modifybyreference, and fixed)
    for(let item in this.state) {
      if(this._state[item].isProperty && !this._state[item].usedDefault) {
        stateForSource.properties[item] = this.state[item];
      }
    }
  }

  createSerializedReplacements() {

    let replacements = [];

    this.state.numReplacementsBySource = [];

    for(let sourceNum=0; sourceNum < this.state.sourceComponents.length; sourceNum++) {
      if(this.state.sourceComponents[sourceNum] !== undefined) {
        let sourceReplacements = this.createReplacementForSource(sourceNum);
        this.state.numReplacementsBySource[sourceNum] = sourceReplacements.length;
        replacements.push(...sourceReplacements);
      }else {
        this.state.numReplacementsBySource[sourceNum] = 0;
      }
    }

    return replacements;

  }

  createReplacementForSource(sourceNum) {
    let stateForSource = this.state.stateForSource[sourceNum];
    
    let additionalDepProperties = {
      extractComponentName: this.componentName,
    }

    // add properties copied from source
    let additionalProperties = stateForSource.properties;

    return this.state.propChild.createSerializedReplacements({
      propData: stateForSource.propData, 
      additionalProperties: additionalProperties,
      additionalDepProperties: additionalDepProperties,
    });

  }

  calculateReplacementChanges(componentChanges) {

    // TODO: directly changing this.state.numReplacementsBySource
    // Probably shouldn't do that here

    // console.log(`calculating replacement changes for ${this.componentName}`);

    let replacementChanges = [];

    let numReplacementsSoFar = 0;
    let numPrevNumReplacements = 0;
    let numDeletedSoFar = 0;

    // cumulative sum: https://stackoverflow.com/a/44081700
    let replacementIndexBySource = [0, ...this.state.numReplacementsBySource];
    replacementIndexBySource = replacementIndexBySource.reduce(
      (a, x, i) => [...a, x + (a[i-1] || 0)], []); 


    let maxSourceLength = Math.max(this.state.sourceComponents.length, this.state.previousSources.length);

    for(let sourceNum=0; sourceNum < maxSourceLength; sourceNum++) {
      let source = this.state.sourceComponents[sourceNum];
      if(source === undefined) {
        if(this.state.numReplacementsBySource[sourceNum] > 0) {
          let replacementInstruction = {
            changeType: "delete",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToDelete: this.state.numReplacementsBySource[sourceNum],
          }

          replacementChanges.push(replacementInstruction);

          // TODO: change state variable here?
          this.state.numReplacementsBySource[sourceNum] = 0;
        }
        continue;
      }

      let prevSource = this.state.previousSources[sourceNum];

      // check if source has changed
      if(prevSource=== undefined || source.componentName !== prevSource.componentName) {

        let prevNumReplacements = 0;
        if(prevSource !== undefined) {
          prevNumReplacements = this.state.numReplacementsBySource[sourceNum];
        }
        let results = this.recreateReplacements({
          sourceNum: sourceNum,
          numReplacementsSoFar: numReplacementsSoFar,
          prevNumReplacements: prevNumReplacements,
          replacementChanges: replacementChanges
        });

        numReplacementsSoFar += results.numReplacements;

        // TODO: change state variable here?
        this.state.numReplacementsBySource[sourceNum] = results.numReplacements;

        continue;
      }

      let redoReplacements = false;
      let testReplacementChanges = [];
      let results;


      // don't change replacements unless
      // the number of components or their component types changed
      results = this.recreateReplacements({
        sourceNum: sourceNum,
        numReplacementsSoFar: numReplacementsSoFar,
        prevNumReplacements: this.state.numReplacementsBySource[sourceNum],
        replacementChanges: testReplacementChanges
      });

      let changeInstruction = testReplacementChanges[testReplacementChanges.length-1];
      let newSerializedReplacements = changeInstruction.serializedReplacements;

      if(newSerializedReplacements.length !== this.state.numReplacementsBySource[sourceNum]) {
        redoReplacements = true;
      }else {
        for(let ind=0; ind < newSerializedReplacements.length; ind++) {
          if(newSerializedReplacements[ind].componentType !== 
            this.replacements[numReplacementsSoFar+ind].componentType) {
            redoReplacements=true;
            break;
          }
        }
      }


      if(redoReplacements) {
        replacementChanges.push(...testReplacementChanges);
        numReplacementsSoFar += results.numReplacements;

        // TODO: change state variable here?
        this.state.numReplacementsBySource[sourceNum] = results.numReplacements;
      }else {
        numReplacementsSoFar += this.state.numReplacementsBySource[sourceNum];
      }

    }

    return replacementChanges;

  }

  recreateReplacements({sourceNum, numReplacementsSoFar, prevNumReplacements, replacementChanges}) {
    if (prevNumReplacements > 0) {
      // give instructions to move dependency to new source
      let prevSource = this.state.previousSources[sourceNum];
      let newSource = this.state.sourceComponents[sourceNum];
      if (prevSource !== undefined) {
        if(prevSource.componentName !== newSource.componentName) {
          let replacementInstruction = {
            changeType: "moveDependency",
            dependencyDirection: "downstream",
            oldComponentName: prevSource.componentName,
            newComponentName: newSource.componentName,
            dependencyType: "reference",
            otherAttributes: { shadowed: true, prop: this.state.propChild.componentName}
          };
          replacementChanges.push(replacementInstruction);
        }
      }
      else {
        // since no previous source, need to create new dependencies
        let replacementInstruction = {
          changeType: "addDependency",
          dependencyDirection: "downstream",
          newComponentName: newSource.componentName,
          dependencyType: "reference",
          otherAttributes: { shadowed: true, prop: this.state.propChild.componentName}
        };
        replacementChanges.push(replacementInstruction);
      }
    }
    let newSerializedChildren = this.createReplacementForSource(sourceNum);

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: numReplacementsSoFar,
      numberReplacementsToReplace: prevNumReplacements,
      serializedReplacements: newSerializedChildren,
    };
    replacementChanges.push(replacementInstruction);

    return {numReplacements: newSerializedChildren.length}
  }

}
