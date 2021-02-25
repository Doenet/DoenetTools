import readOnlyProxyHandler from "./ReadOnlyProxyHandler";
import { deepClone, deepCompare } from "./utils/deepFunctions";
import { gatherDescendants } from "./utils/descendants";

const dependencyTypeArray = [];

export class DependencyHandler {
  constructor({ _components, componentInfoObjects, core }) {

    this.setUpStateVariableDependenciesSub = this.setUpStateVariableDependenciesSub.bind(this);

    this.upstreamDependencies = {};
    this.downstreamDependencies = {};
    this.switchDependencies = {};

    this.circularCheckPassed = {};

    this.dependencyTypes = {};
    dependencyTypeArray.forEach(dt => this.dependencyTypes[dt.dependencyType] = dt);

    this.core = core;
    this._components = _components;
    this.componentInfoObjects = componentInfoObjects;

    this.updateTriggers = {
      descendantDependenciesByAncestor: {},
      ancestorDependenciesByPotentialAncestor: {},
      replacementDependenciesByComposite: {},
      childDependenciesByParent: {},
      parentDependenciesByParent: {},
      dependenciesMissingComponentBySpecifiedName: {},
    }

  }

  setUpComponentDependencies({ component, updatesNeeded, compositesBeingExpanded }) {

    // if component already has downstream dependencies
    // delete them, and the corresponding upstream dependencies
    if (this.downstreamDependencies[component.componentName]) {
      this.deleteAllDownstreamDependencies({ component, updatesNeeded });
    }

    // console.log(`set up component dependencies of ${component.componentName}`)
    this.downstreamDependencies[component.componentName] = {};
    if (!this.upstreamDependencies[component.componentName]) {
      this.upstreamDependencies[component.componentName] = {};
    }

    let stateVariablesToProccess = [];
    let additionalStateVariablesThatWillBeProcessed = [];
    for (let stateVariable in component.state) {
      if (!(component.state[stateVariable].isArrayEntry ||
        component.state[stateVariable].isAlias ||
        additionalStateVariablesThatWillBeProcessed.includes(stateVariable)
      )) {
        // TODO: if do indeed keep aliases deleted from state, then don't need second check
        stateVariablesToProccess.push(stateVariable);
        if (component.state[stateVariable].additionalStateVariablesDefined) {
          additionalStateVariablesThatWillBeProcessed.push(
            ...component.state[stateVariable].additionalStateVariablesDefined
          )
        }
      }
    }

    for (let stateVariable of stateVariablesToProccess) {
      let allStateVariablesAffected = [stateVariable];
      if (component.state[stateVariable].additionalStateVariablesDefined) {
        allStateVariablesAffected.push(...component.state[stateVariable].additionalStateVariablesDefined)
      }

      this.setUpStateVariableDependencies({
        component, stateVariable, allStateVariablesAffected,
        updatesNeeded, compositesBeingExpanded
      });
    }

  }

  setUpStateVariableDependencies({ component, stateVariable, allStateVariablesAffected,
    updatesNeeded, compositesBeingExpanded
  }) {
    let stateVarObj = component.state[stateVariable];
    let dependencies;

    if (stateVarObj.stateVariablesDeterminingDependencies || stateVarObj.determineIfShadowData) {
      let dependencyStateVar = this.createDetermineDependenciesStateVariable({
        stateVariable, component, allStateVariablesAffected,
        updatesNeeded, compositesBeingExpanded
      });
      // make dependencies of actual stateVariable be this
      // determineDependencies state variable we just created
      dependencies = {
        [dependencyStateVar]: {
          dependencyType: "stateVariable",
          componentName: component.componentName,
          variableName: dependencyStateVar,
          __isDetermineDependencyStateVariable: true,
        }
      };
    } else {
      // Note: arrays now always have a state variable determining dependencies
      // (the array size state variable)
      // so we don't have to deal with them here

      dependencies = stateVarObj.returnDependencies({
        componentInfoObjects: this.componentInfoObjects,
        sharedParameters: component.sharedParameters,
      });
    }

    this.setUpStateVariableDependenciesSub({
      dependencies, component, stateVariable,
      allStateVariablesAffected,
      updatesNeeded, compositesBeingExpanded
    });

  }

  deleteAllDownstreamDependencies({ component, stateVariables = '__all__', updatesNeeded }) {
    // console.log(`delete all downstream dependencies of ${component.componentName}, ${stateVariables.toString()}`)
    // console.log(deepClone(this.downstreamDependencies[component.componentName]))
    // console.log(deepClone(this.upstreamDependencies))

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
        downDeps[downDepName].delete(updatesNeeded);
      }

      delete this.downstreamDependencies[componentName][stateVariable];

    }

    if (Object.keys(this.downstreamDependencies[componentName]).length === 0
      && !this.components[componentName]
    ) {
      delete this.downstreamDependencies[componentName];
    }
  }


  deleteAllUpstreamDependencies({ component, stateVariables = '__all__',
    completelyDelete = false,
    updatesNeeded
  }) {

    // if completelyDelete is false, then just remove component from dependency

    // console.log(`delete all upstream dependencies of ${component.componentName}, ${stateVariables.toString()}`)
    // console.log(`completelyDelete: ${completelyDelete}`)
    // console.log(deepClone(this.downstreamDependencies))
    // console.log(deepClone(this.upstreamDependencies))

    let componentName = component.componentName;

    let stateVariablesToAdddress;
    if (stateVariables === '__all__') {
      stateVariablesToAdddress = Object.keys(this.upstreamDependencies[componentName]);
    } else {
      stateVariablesToAdddress = stateVariables;
    }

    for (let stateVariable of stateVariablesToAdddress) {
      if (this.upstreamDependencies[componentName][stateVariable]) {
        // loop over shallow copy, as upstream dependencies are changed in deleteDownstreamDependency
        for (let upDep of [...this.upstreamDependencies[componentName][stateVariable]]) {
          if (completelyDelete) {
            // Note: this completely deletes the dependency even if there
            // were other downstream components involved
            upDep.delete(updatesNeeded);
          } else {
            // Note: this keeps the downstream dependency in the upstream component
            // even if this is the last downstream component
            upDep.removeDownstreamComponent(upDep.downstreamComponentNames.indexOf(componentName), updatesNeeded)
          }
        }
      }

      // clean up by deleting entries that should now be empty objects
      delete this.upstreamDependencies[componentName][stateVariable];
    }

    if (Object.keys(this.upstreamDependencies[componentName]).length === 0
      && !this._components[componentName]
    ) {
      delete this.upstreamDependencies[componentName];
    }

  }

  setUpStateVariableDependenciesSub({ dependencies, component, stateVariable, allStateVariablesAffected,
    updatesNeeded, compositesBeingExpanded
  }) {

    for (let dependencyName in dependencies) {
      let dependencyDefinition = dependencies[dependencyName];
      if (!(dependencyDefinition.dependencyType in this.dependencyTypes)) {
        throw Error(`Unrecognized dependency type ${dependencyDefinition.dependencyType} for ${dependencyName} of ${stateVariable} of ${component.componentName}`);
      }
      let dep = new this.dependencyTypes[dependencyDefinition.dependencyType]({
        component, stateVariable, allStateVariablesAffected,
        dependencyName, dependencyDefinition,
        dependencyHandler: this,
        updatesNeeded, compositesBeingExpanded
      })

      dep.checkForCircular();
    }

  }


  createDetermineDependenciesStateVariable({
    stateVariable, component, allStateVariablesAffected,
    updatesNeeded, compositesBeingExpanded
  }) {

    let stateVariablesDeterminingDependencies = component.state[stateVariable].stateVariablesDeterminingDependencies;
    if (!stateVariablesDeterminingDependencies) {
      stateVariablesDeterminingDependencies = [];
    }

    let determineIfShadowData = component.state[stateVariable].determineIfShadowData;

    let outsideStateVariablesDeterminingDependencies = [];

    if (determineIfShadowData) {
      for (let varName of allStateVariablesAffected) {
        outsideStateVariablesDeterminingDependencies.push({
          component: determineIfShadowData.targetComponent,
          stateVariable: varName
        })
      }
      if (determineIfShadowData.arraySizeStateVariableToResolve) {
        // consider array size state variable an outside state variable
        // as it isn't used to update dependencies if changed
        // but is just there to make sure it is resolved to determine
        // if should shadow
        outsideStateVariablesDeterminingDependencies.push({
          component,
          stateVariable: determineIfShadowData.arraySizeStateVariableToResolve
        })
      }
    }



    let dependencyStateVar = `__determine_dependencies_${stateVariable}`;

    let dependenciesObj = this;

    for (let varName of allStateVariablesAffected) {
      component.state[varName].determineDependenciesStateVariable = dependencyStateVar;
    }

    let stateVariablesNotShadowed = [...allStateVariablesAffected];

    core = this.core;

    component.state[dependencyStateVar] = {
      actionOnResolved: true,
      willNeverBeEssential: true,
      dependenciesForStateVariables: allStateVariablesAffected,
      returnDependencies: function () {
        let theseDependencies = {};
        for (let varName of stateVariablesDeterminingDependencies) {
          theseDependencies[varName] = {
            dependencyType: "stateVariable",
            componentName: component.componentName,
            variableName: varName
          };
        }
        for (let outsideVar of outsideStateVariablesDeterminingDependencies) {
          theseDependencies['_' + outsideVar.component.componentName + "_" + outsideVar.stateVariable] = {
            dependencyType: "stateVariable",
            componentName: outsideVar.component.componentName,
            variableName: outsideVar.stateVariable
          }
        }
        return theseDependencies;
      },
      resolvedAction({ dependencyValues, updatesNeeded }) {

        let stateVarObj = component.state[dependencyStateVar];

        // delete upstream dependencies of determine dependencies state variables
        // so that these dependencies won't show up for the regular state variables
        dependenciesObj.deleteAllUpstreamDependencies({
          component,
          stateVariables: [dependencyStateVar],
          completelyDelete: true,
          updatesNeeded
        });

        // now, can finally run returnDependencies of the state variable (and others affected)
        let varName = stateVarObj.dependenciesForStateVariables[0];
        let changedStateVarObj = component.state[varName];

        // Note: shouldn't have to delete any downstream dependencies
        // of changedStateVarObj
        // as they should have been deleted when deleting above dependencies


        // first check if we should shadow state variable
        if (determineIfShadowData) {
          let stateVariablesToShadow = [];
          stateVariablesNotShadowed = [];

          for (let varName of allStateVariablesAffected) {
            let stateObj = determineIfShadowData.targetComponent.state[varName];
            // since varName of targetComponent is now resolved
            // can evaluate it and then determine if it is essential
            stateObj.value;

            if (stateObj.essential || stateObj.alwaysShadow || stateObj.isShadow
              || (stateObj.isArray
                && stateObj.getAllArrayKeys(stateObj.arraySize).length > 0
                && stateObj.getAllArrayKeys(stateObj.arraySize).some(x => stateObj.essentialByArrayKey[x])
              )
            ) {
              stateVariablesToShadow.push(varName);
            } else {
              stateVariablesNotShadowed.push(varName)
            }

          }

          if (stateVariablesToShadow.length > 0) {
            core.modifyStateDefsToBeShadows({
              stateVariablesToShadow,
              stateVariableDefinitions: component.state,
              foundReadyToExpand: determineIfShadowData.foundReadyToExpand,
              targetComponent: determineIfShadowData.targetComponent
            });

          }

        }

        let newDependencies;
        if (changedStateVarObj.isArray && !changedStateVarObj.entireArrayAtOnce) {
          newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
            arraySize: changedStateVarObj.arraySize,  // we know this must be resolved now
          });
        } else if (changedStateVarObj.isArrayEntry && !changedStateVarObj.entireArrayAtOnce) {
          newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
            arraySize: changedStateVarObj.arraySize,  // we know this must be resolved now
            arrayKeys: changedStateVarObj.arrayKeys // we know this must be resolved now
          });
        } else {
          newDependencies = changedStateVarObj.returnDependencies({
            stateValues: dependencyValues,
            componentInfoObjects: core.componentInfoObjects,
            sharedParameters: component.sharedParameters,
          });
        }

        dependenciesObj.setUpStateVariableDependenciesSub({
          dependencies: newDependencies,
          component,
          stateVariable: varName,
          allStateVariablesAffected: stateVarObj.dependenciesForStateVariables,
          updatesNeeded, compositesBeingExpanded
        });

        return {};
      },
      markStale: function () {
        // if have a state variable that wasn't shadowed, then we should
        // update dependencies when the state variables determining dependencies change
        if (stateVariablesNotShadowed.length > 0 && stateVariablesDeterminingDependencies.length > 0) {
          return {
            updateDependencies: component.state[dependencyStateVar].dependenciesForStateVariables
          };
        } else {
          return {};
        }
      },
      definition() {
        return { newValues: { [dependencyStateVar]: true } }
      }
    };


    // create and set up dependencies for this determineDependencies state variable
    // i.e., repeat the process for creating a state variable here
    this.core.initializeStateVariable({ component, stateVariable: dependencyStateVar });
    // note: don't need to pass arguments to returnDependencies
    // since are calling above returnDependencies that doesn't take arguments
    let theseDependencies = component.state[dependencyStateVar].returnDependencies();
    this.setUpStateVariableDependenciesSub({
      dependencies: theseDependencies,
      component,
      stateVariable: dependencyStateVar,
      allStateVariablesAffected: [dependencyStateVar],
      updatesNeeded, compositesBeingExpanded
    });

    return dependencyStateVar;
  }


  updateChildAndDescendantDependencies(component, updatesNeeded, compositesBeingExpanded) {

    // console.log(`update child and descendant deps for ${component.componentName}`)
    // console.log(JSON.parse(JSON.stringify(this.downstreamDependencies[component.componentName])))

    if (!component.childLogicSatisfied) {
      return;
    }

    let componentName = component.componentName;

    if (this.upstreamDependencies[componentName].__activeChildren) {

      this.markUpstreamDependentsStale({
        component,
        varName: "__activeChildren",
        updatesNeeded,
      })

      this.recordActualChangeInUpstreamDependencies({
        component,
        varName: "__activeChildren",
        updatesNeeded
      })
    }

    if (componentName in this.downstreamDependencies) {
      // only need to change child dependencies if the component already has dependencies

      this.updateChildDependencies(component, updatesNeeded, compositesBeingExpanded);

    }

    if (component.ancestors) {

      this.updateParentDependencies(component, updatesNeeded, compositesBeingExpanded);

      // this.updateDescendantDependencies(component, updatesNeeded, compositesBeingExpanded);

      this.updateAncestorDependencies(component, updatesNeeded, compositesBeingExpanded);

      updatesNeeded.parentsToUpdateDescendants.add(component.componentName);
      for (let ancestor of component.ancestors) {
        updatesNeeded.parentsToUpdateDescendants.add(ancestor.componentName);
      }
    }

  }

  updateChildDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    if (this.updateTriggers.childDependenciesByParent[parent.componentName]) {
      for (let dep of this.updateTriggers.childDependenciesByParent[parent.componentName]) {

        dep.recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded)
      }
    }

  }

  updateDescendantDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    // console.log(`update descendant dependencies for ${parent.componentName}`)

    if (this.updateTriggers.descendantDependenciesByAncestor[parent.componentName]) {
      for (let dep of this.updateTriggers.descendantDependenciesByAncestor[parent.componentName]) {

        dep.recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded)
      }
    }

  }

  updateParentDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    if (this.updateTriggers.parentDependenciesByParent[parent.componentName]) {
      for (let dep of this.updateTriggers.parentDependenciesByParent[parent.componentName]) {

        dep.recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded)
      }
    }

  }

  updateAncestorDependencies(parent, updatesNeeded, compositesBeingExpanded) {

    if (this.updateTriggers.ancestorDependenciesByPotentialAncestor[parent.componentName]) {
      for (let dep of this.updateTriggers.ancestorDependenciesByPotentialAncestor[parent.componentName]) {

        dep.recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded)
      }

    }

  }

  updateReplacementDependencies(composite, updatesNeeded, compositesBeingExpanded) {

    if (this.updateTriggers.replacementDependenciesByComposite[composite.componentName]) {

      for (let dep of this.updateTriggers.replacementDependenciesByComposite[composite.componentName]) {
        dep.recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded)
      }
    }

  }


  checkForCircularDependency({ componentName, varName, previouslyVisited = [] }) {

    let stateVariableIdentifier = componentName + ":" + varName;

    if (previouslyVisited.includes(stateVariableIdentifier)) {
      // Found circular dependency
      // Create error message with list of component names involved

      console.log('found circular', stateVariableIdentifier, previouslyVisited)


      let componentNameRe = /^(.*):/
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
      previouslyVisited = [...previouslyVisited, stateVariableIdentifier];
    }


    if (!this.circularCheckPassed[stateVariableIdentifier]) {
      this.circularCheckPassed[stateVariableIdentifier] = true;


      if (componentName in this.downstreamDependencies) {

        let downDeps = this.downstreamDependencies[componentName][varName];
        for (let dependencyName in downDeps) {
          let dep = downDeps[dependencyName];

          let downstreamComponentNames = dep.downstreamComponentNames;
          if (!downstreamComponentNames) {
            continue;
          }
          let mappedDownstreamVariableNamesByComponent = dep.mappedDownstreamVariableNamesByComponent;
          if (!mappedDownstreamVariableNamesByComponent) {
            continue;
          }

          for (let [ind, cname] of downstreamComponentNames.entries()) {
            let varNames = mappedDownstreamVariableNamesByComponent[ind];
            for (let vname of varNames) {
              this.checkForCircularDependency({
                componentName: cname, varName: vname,
                previouslyVisited
              });
            }
          }
        }
      }
    }
  }


  resetCircularCheckPassed(componentName, varName) {
    let stateVariableIdentifier = componentName + ":" + varName;
    if (this.circularCheckPassed[stateVariableIdentifier]) {
      delete this.circularCheckPassed[stateVariableIdentifier];

      let upstream = this.upstreamDependencies[componentName][varName];

      if (upstream) {
        for (let upDep of upstream) {
          for (let vName of upDep.upstreamVariableNames) {
            if (vName !== '__childLogic' && vName !== "__identity") {
              this.resetCircularCheckPassed(upDep.upstreamComponentName, vName)
            }
          }
        }
      }
    }

  }


  updateDependencies(updatesNeeded, compositesBeingExpanded, prevUpdatesleft) {

    // first update descendant dependencies
    if (updatesNeeded.parentsToUpdateDescendants.size > 0) {
      for (let parentName of updatesNeeded.parentsToUpdateDescendants) {
        if (this._components[parentName]) {
          this.updateDescendantDependencies(this._components[parentName], updatesNeeded, compositesBeingExpanded)
        }
      }
      updatesNeeded.parentsToUpdateDescendants = new Set();
    }


    let dependencyChanges = [];

    if (updatesNeeded.componentsToUpdateDependencies.length > 0) {
      console.log(`updating dependencies`)
      console.log(updatesNeeded.componentsToUpdateDependencies)

      let determineDependenciesStateVariablesToFreshen = [];

      let dependenciesCouldNotUpdate = [];

      let newlyCreatedDependencies = [];

      for (let updateObj of updatesNeeded.componentsToUpdateDependencies) {

        let component = this._components[updateObj.componentName];
        if (!component) {
          // if component was deleted, just skip
          continue;
        }

        let stateVariablesToUpdate = [];
        let additionalStateVariablesThatWillBeUpdated = [];
        for (let stateVariable of updateObj.stateVariables) {
          if (!additionalStateVariablesThatWillBeUpdated.includes(stateVariable)) {
            stateVariablesToUpdate.push(stateVariable);
            if (component.state[stateVariable].additionalStateVariablesDefined) {
              additionalStateVariablesThatWillBeUpdated.push(
                ...component.state[stateVariable].additionalStateVariablesDefined
              )
            }
            let determineDependenciesStateVariable = component.state[stateVariable].determineDependenciesStateVariable;
            determineDependenciesStateVariablesToFreshen.push(
              component.state[determineDependenciesStateVariable]
            )
          }
        }

        for (let stateVariable of stateVariablesToUpdate) {
          let allStateVariablesAffected = [stateVariable];
          if (component.state[stateVariable].additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...component.state[stateVariable].additionalStateVariablesDefined)
          }

          let stateVarObj = component.state[stateVariable];

          let definitionArgs;

          try {
            definitionArgs = this.getStateVariableDependencyValues({
              component,
              stateVariable: stateVarObj.determineDependenciesStateVariable
            });
          } catch (e) {
            // It is possible that a determineDependenciesStateVariable
            // depends on a dependency that was just changed
            // (but not yet updated)
            // Since this could lead to an error being throw when getting
            // the dependency values, just catch this error
            // and we'll recurse to update this state variable
            // after we have finished this round of updating.
            console.log(`Couldn't update dependencies of ${stateVarObj.determineDependenciesStateVariable} of ${component.componentName}`)
            dependenciesCouldNotUpdate.push({
              componentName: component.componentName,
              stateVariables: [stateVariable]
            });
            continue;
          }

          if (Object.keys(definitionArgs.changes).length === 0 &&
            stateVarObj._previousValue !== undefined
          ) {
            // console.log(`no changes for ${stateVariable}`)
            // console.log(definitionArgs)
            // console.log(stateVarObj._previousValue);
            // no changes
            continue;
          }


          // TODO: should we change the output of returnDependencies
          // to be an object with one key being dependencies?
          // That way, we could add another attribute to the return value
          // rather than having returnDependencies add the attribute
          // changedDependency to the arguments
          // (Currently array and array entry state variable could set
          // returnDepArgs.changedDependency to true)
          let returnDepArgs = {
            stateValues: definitionArgs.dependencyValues,
            componentInfoObjects: this.componentInfoObjects,
            sharedParameters: component.sharedParameters,
          }
          let newDependencies = stateVarObj.returnDependencies(returnDepArgs);

          let changeResult = this.replaceDependenciesIfChanged({
            component, stateVariable, newDependencies, allStateVariablesAffected,
            updatesNeeded, compositesBeingExpanded
          });

          newlyCreatedDependencies.push(...changeResult.newlyCreatedDependencies);

          if (changeResult.changedDependency || returnDepArgs.changedDependency) {// || arraySizeChanged) {
            dependencyChanges.push({
              componentName: component.componentName,
              stateVariable,
              allStateVariablesAffected,
            })
          }

        }
      }

      for (let dep of newlyCreatedDependencies) {
        dep.checkForCircular();
      }

      console.log("dependencyChanges")
      console.log(dependencyChanges)


      // initialize componentsToUpdateDependencies with any dependencies
      // that we could not update above
      // We will recurse to update those dependencies, along with any
      // more dependencies that get marked for needing updates
      updatesNeeded.componentsToUpdateDependencies = dependenciesCouldNotUpdate;

      let haveUnresolved = Object.keys(updatesNeeded.unresolvedDependencies).length > 0;
      for (let updateObj of dependencyChanges) {

        let component = this._components[updateObj.componentName];

        for (let varName of updateObj.allStateVariablesAffected) {
          component.state[varName].isResolved = false;
        }

        let resolveResult = this.core.resolveStateVariables({
          component,
          stateVariables: updateObj.allStateVariablesAffected,
          updatesNeeded,
          compositesBeingExpanded,
        })

        this.core.addUnresolvedDependencies({
          varsUnresolved: resolveResult.varsUnresolved,
          component,
          updatesNeeded
        });

        for (let varName of updateObj.allStateVariablesAffected) {
          if (!component.state[varName].isResolved) {
            haveUnresolved = true;
            this.resetUpstreamDependentsUnresolved({
              component,
              varName,
              updatesNeeded
            })
          }

        }
      }

      if (haveUnresolved) {
        this.core.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
      }


      // TODO: where should this looking up the values occur?
      // If put it above where we resolve, can get an error
      // where get a dependency to a new array entry variable
      // that won't be created until after we resolve.
      // However, will it always work doing it here?

      // look up value of all determine dependencies state variables
      // in order to freshen them
      // (needed so that mark stale will be triggered next time they change)
      for (let stateVarObj of determineDependenciesStateVariablesToFreshen) {
        stateVarObj.value;
      }


      for (let updateObj of dependencyChanges) {

        for (let varName of updateObj.allStateVariablesAffected) {
          this.checkForCircularDependency({
            componentName: updateObj.componentName,
            varName,
          });
          this._components[updateObj.componentName].state[varName].forceRecalculation = true;
        }

        // note: markStateVariableAndUpstreamDependentsStale includes
        // any additionalStateVariablesDefined with stateVariable
        this.core.markStateVariableAndUpstreamDependentsStale({
          component: this._components[updateObj.componentName],
          varName: updateObj.stateVariable,
          updatesNeeded,
        })

        this.recordActualChangeInUpstreamDependencies({
          component: this._components[updateObj.componentName],
          varName: updateObj.stateVariable
        })

      }

    }

    // check more more time for unresolved
    // (Encountered case where composite wasn't ready to expand
    // until after the final mark stale step, above.
    // resolveAllDependencies tries to expand composites.)

    if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
      this.core.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
    }

    while (updatesNeeded.compositesToUpdateReplacements.length > 0) {

      this.core.replacementChangesFromCompositesToUpdate({ updatesNeeded, compositesBeingExpanded })

      if (Object.keys(updatesNeeded.unresolvedDependencies).length > 0) {
        this.core.resolveAllDependencies(updatesNeeded, compositesBeingExpanded);
      }

    }

    if ((updatesNeeded.componentsToUpdateDependencies.length > 0 && dependencyChanges.length > 0)
      || updatesNeeded.parentsToUpdateDescendants.size > 0
    ) {

      let nUpdatesLeft = updatesNeeded.componentsToUpdateDependencies.length +
        updatesNeeded.parentsToUpdateDescendants.size;

      // Avoid infinite loop by making sure number of updates left is decreasing
      if (!prevUpdatesleft || nUpdatesLeft < prevUpdatesleft) {

        // TODO: address case where have continued dependencies to update
        console.log(`since found more components to update dependencies, will try to recurse`)
        console.log(updatesNeeded.componentsToUpdateDependencies)
        console.log(updatesNeeded.parentsToUpdateDescendants)

        this.updateDependencies(updatesNeeded, compositesBeingExpanded, nUpdatesLeft);
      }
      // throw Error("Need to address further updates to dependencies caused by composite changes")
    }

  }

  replaceDependenciesIfChanged({ component, stateVariable, newDependencies, allStateVariablesAffected,
    updatesNeeded, compositesBeingExpanded
  }) {

    // Note: currentDeps object is downstream dependencies
    // of allStateVariablesAffected
    let currentDeps = this.downstreamDependencies[component.componentName][stateVariable];

    let changedDependency = false;

    let newlyCreatedDependencies = [];

    for (let dependencyName in currentDeps) {
      if (!(dependencyName in newDependencies)) {
        changedDependency = true;
        currentDeps[dependencyName].delete(updatesNeeded);
      }
    }

    for (let dependencyName in newDependencies) {
      if (dependencyName in currentDeps) {
        let dependencyDefinition = newDependencies[dependencyName];
        let currentDep = currentDeps[dependencyName];
        if (!deepCompare(dependencyDefinition, currentDep.definition)) {
          changedDependency = true;
          currentDeps[dependencyName].delete(updatesNeeded);

          let dependencyDefinition = newDependencies[dependencyName];

          let dep = new this.dependencyTypes[dependencyDefinition.dependencyType]({
            component, stateVariable, allStateVariablesAffected,
            dependencyName, dependencyDefinition,
            dependencyHandler: this,
            updatesNeeded, compositesBeingExpanded
          });

          newlyCreatedDependencies.push(dep);

        }
      } else {
        changedDependency = true;
        let dependencyDefinition = newDependencies[dependencyName];
        let dep = new this.dependencyTypes[dependencyDefinition.dependencyType]({
          component, stateVariable, allStateVariablesAffected,
          dependencyName, dependencyDefinition,
          dependencyHandler: this,
          updatesNeeded, compositesBeingExpanded
        });
        newlyCreatedDependencies.push(dep);

      }
    }
    return { changedDependency, newlyCreatedDependencies };
  }

  checkForDependenciesOnNewComponent({ componentName, updatesNeeded, compositesBeingExpanded }) {

    let variablesChanged = [];

    if (this.updateTriggers.dependenciesMissingComponentBySpecifiedName[componentName]) {

      for (let dep of this.updateTriggers.dependenciesMissingComponentBySpecifiedName[componentName]) {

        let upComponent = this._components[dep.upstreamComponentName];

        if (!upComponent) {
          continue;
        }

        let upVarsInUpstreamComponent = true;

        for (let upVar of dep.upstreamVariableNames) {
          if (!(upVar in upComponent.state)) {
            upVarsInUpstreamComponent = false;
            break;
          }
        }

        if (!upVarsInUpstreamComponent) {
          continue;
        }

        dep.recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded)

        for (let upVar of dep.upstreamVariableNames) {
          variablesChanged.push({
            componentName: dep.upstreamComponentName,
            varName: upVar
          })
        }

      }

      delete this.updateTriggers.dependenciesMissingComponentBySpecifiedName[componentName];
    }

    return variablesChanged;

  }

  getStateVariableDependencyValues({ component, stateVariable }) {

    let dependencyValues = {};
    let dependencyChanges = {};
    let dependencyUsedDefault = {};

    let downDeps = this.downstreamDependencies[component.componentName][stateVariable];

    for (let dependencyName in downDeps) {
      let { value, changes, usedDefault } = downDeps[dependencyName].getValue();

      dependencyValues[dependencyName] = value;
      if (Object.keys(changes).length > 0) {
        dependencyChanges[dependencyName] = changes;
      }
      if (usedDefault) {
        dependencyUsedDefault[dependencyName] = true;
      }
    }

    return {
      dependencyValues,
      changes: dependencyChanges,
      usedDefault: dependencyUsedDefault
    };

  }



  recordActualChangeInUpstreamDependencies({
    component, varName, changes
  }) {
    // console.log(`record actual change in ${varName} of ${component.componentName}`)
    // console.log(deepClone(changes))

    let componentName = component.componentName

    let upstream = this.upstreamDependencies[componentName][varName];

    if (upstream) {
      for (let upDep of upstream) {

        if (upDep.valuesChanged) {

          let ind = upDep.downstreamComponentNames.indexOf(componentName);
          let upValuesChanged = upDep.valuesChanged[ind][varName];

          if (!upValuesChanged) {
            // check if have an alias that maps to varName
            if (component.stateVarAliases) {
              for (let alias in component.stateVarAliases) {
                if (component.stateVarAliases[alias] === varName && alias in upValuesChangedSub) {
                  upValuesChanged = upValuesChangedSub[alias]
                }
              }
            }
          }

          // if still don't have record of change, create new change object
          // (Should only be needed when have array entry variables,
          // where original change was recorded in array)
          if (!upValuesChanged) {
            if (!component.state[varName].isArrayEntry) {
              throw Error(`Something is wrong, as a variable ${varName} of ${component.componentName} actually changed, but wasn't marked with a potential change`)
            }
            upValuesChanged = upValuesChangedSub[varName] = { changed: {} }
          }

          if (component.state[varName] && component.state[varName].isArray) {
            if (upValuesChanged.changed === undefined) {
              upValuesChanged.changed = { arrayKeysChanged: {} };
            } else if (upValuesChanged.changed === true) {
              upValuesChanged.changed = { allArrayKeysChanged: true, arraySizeChanged: true, arrayKeysChanged: {} };
            }
            if (changes) {
              if (changes.allArrayKeysChanged) {
                upValuesChanged.changed.allArrayKeysChanged = true;
              }
              if (changes.arraySizeChanged) {
                upValuesChanged.changed.arraySizeChanged = true;
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


  get components() {
    return new Proxy(this._components, readOnlyProxyHandler);
  }

  set components(value) {
    return null;
  }

}

class Dependency {
  constructor({ component, stateVariable, allStateVariablesAffected,
    dependencyName, dependencyDefinition, dependencyHandler,
    updatesNeeded, compositesBeingExpanded
  }) {

    this.dependencyName = dependencyName;
    this.dependencyHandler = dependencyHandler;


    this.upstreamComponentName = component.componentName;
    this.upstreamVariableNames = allStateVariablesAffected;

    this.definition = Object.assign({}, dependencyDefinition);
    this.representativeStateVariable = stateVariable;

    if (dependencyDefinition.doNotProxy) {
      this.doNotProxy = true;
    }

    if (dependencyDefinition.variablesOptional) {
      this.variablesOptional = true;
    }

    if (dependencyDefinition.requireChildLogicInitiallySatisfied) {
      this.requireChildLogicInitiallySatisfied = true;
    }

    if (dependencyDefinition.__isDetermineDependencyStateVariable) {
      this.__isDetermineDependencyStateVariable = true;
    }

    if (dependencyDefinition.triggerParentChildLogicWhenResolved) {
      this.triggerParentChildLogicWhenResolved = true;
    }

    if (dependencyDefinition.publicStateVariablesOnly) {
      this.publicStateVariablesOnly = true;
    }

    if (dependencyDefinition.caseInsensitiveVariableMatch) {
      this.caseInsensitiveVariableMatch = true;
    }

    if (dependencyDefinition.useMappedVariableNames) {
      this.useMappedVariableNames = true;
    }

    if (Number.isInteger(dependencyDefinition.propIndex)) {
      this.propIndex = dependencyDefinition.propIndex;
    }

    // if returnSingleVariableValue, then
    // return just the value of the state variable when there is
    // exactly one (downstreamComponentName, downstreamVariableName)
    // and return null otherwise
    this.returnSingleVariableValue = false;


    // if returnSingleComponent, then
    // return just the component object (rather than an array) when there
    // is exactly one downstreamComponentName
    // and return null otherwise
    this.returnSingleComponent = false;

    this.originalDownstreamVariableNames = [];



    this.setUpParameters();

    // Note: determineDownstreamComponents has side effects
    // of setting class variables and adding to updateTrigger objects
    let downComponents = this.determineDownstreamComponents();

    // Note: initialize adds dependency to upstreamDependencies and downstreamDependencies
    this.initialize({
      downstreamComponentNames: downComponents.downstreamComponentNames,
      downstreamComponentTypes: downComponents.downstreamComponentTypes,
      updatesNeeded, compositesBeingExpanded
    });

    // this.checkForCircular();

  }

  static dependencyType = "_base";

  downstreamVariableNameIfNoVariables = "__identity";

  static get rendererType() {
    return this.componentType;
  }

  get dependencyType() {
    return this.constructor.dependencyType;
  }

  setUpParameters() { }

  determineDownstreamComponents() {
    return {
      downstreamComponentNames: [],
      downstreamComponentTypes: []
    }
  }

  initialize({ downstreamComponentNames, downstreamComponentTypes,
    updatesNeeded, compositesBeingExpanded
  }) {

    // 1. add this dependency to the downstreamDependencies of the upstream component
    // 2. for each downstreamComponentName, add this dependency to upstreamDependencies
    // 3. map originalDownstreamVariableNames to mappedDownstreamVariableNamesByComponent
    // 4. possibly create array entry variables in downstream components if they don't exist
    // 5. keep track of any unresolved dependencies

    this.componentIdentitiesChanged = true;

    let upCompDownDeps = this.dependencyHandler.downstreamDependencies[this.upstreamComponentName];
    if (!upCompDownDeps) {
      upCompDownDeps = this.dependencyHandler.downstreamDependencies[this.upstreamComponentName] = {};
    }

    for (let varName of this.upstreamVariableNames) {
      if (!upCompDownDeps[varName]) {
        upCompDownDeps[varName] = {};
      }
      upCompDownDeps[varName][this.dependencyName] = this;
    }

    if (this.originalDownstreamVariableNames.length === 0) {
      delete this.mappedDownstreamVariableNamesByComponent;
      delete this.upValuesChanged;
    } else {

      this.mappedDownstreamVariableNamesByComponent = [];
      this.valuesChanged = [];
    }

    this.downstreamComponentNames = [];
    this.downstreamComponentTypes = [];

    for (let [index, downstreamComponentName] of downstreamComponentNames.entries()) {
      this.addDownstreamComponent({
        downstreamComponentName,
        downstreamComponentType: downstreamComponentTypes[index],
        index,
        updatesNeeded, compositesBeingExpanded
      });
    }
  }

  addDownstreamComponent({ downstreamComponentName, downstreamComponentType, index,
    updatesNeeded, compositesBeingExpanded,
  }) {

    this.componentIdentitiesChanged = true;

    this.downstreamComponentNames.splice(index, 0, downstreamComponentName);
    this.downstreamComponentTypes.splice(index, 0, downstreamComponentType);

    let downComponent = this.dependencyHandler._components[downstreamComponentName];

    let originalVarNames = this.originalDownstreamVariableNames;

    if (this.caseInsensitiveVariableMatch) {
      originalVarNames = this.dependencyHandler.core.findCaseInsensitiveMatches({
        stateVariables: originalVarNames,
        componentClass: downComponent.constructor
      });
    }

    if (this.publicStateVariablesOnly) {
      originalVarNames = this.dependencyHandler.core.matchPublicStateVariables({
        stateVariables: originalVarNames,
        componentClass: downComponent.constructor
      });
    }

    let mappedVarNames = this.dependencyHandler.core.substituteAliases({
      stateVariables: originalVarNames,
      componentClass: downComponent.constructor,
    });


    if (this.propIndex !== undefined) {
      console.warn(`Need to implement propIndex!`)
      // mappedVarNames = this.dependencyHandler.core.arrayEntryNameFromPropIndex({
      //   stateVariables: mappedVarNames,
      //   component: downComponent,
      //   propIndex: this.propIndex
      // });
    }

    // Note: mappedVarNames contains all original variables mapped with any aliases.
    // If variablesOptional, downVarNames may be filtered to just include
    // variables that exist in the component.
    // (If not variablesOptional and variable doesn't exist, will eventually get an error)
    let downVarNames = mappedVarNames;

    if (this.originalDownstreamVariableNames.length > 0) {

      this.mappedDownstreamVariableNamesByComponent.splice(index, 0, mappedVarNames);

      let valsChanged = {};
      for (let vName of mappedVarNames) {
        valsChanged[vName] = { changed: true };
      }
      this.valuesChanged.splice(index, 0, valsChanged);

      if (this.variablesOptional) {
        // if variables are optional, then include variables in downVarNames
        // only if the variable exists in the downstream component
        // (or could be created as an array entry)
        downVarNames = downVarNames.filter(vName => vName in downComponent.state ||
          this.dependencyHandler.core.checkIfArrayEntry({
            stateVariable: vName,
            component: downComponent
          })
        );
      }

      for (let vName of downVarNames) {
        if (!downComponent.state[vName]) {

          let result = this.dependencyHandler.core.createFromArrayEntry({
            component: downComponent,
            stateVariable: vName,
            updatesNeeded,
            compositesBeingExpanded
          });

          if (Object.keys(result.varsUnresolved).length > 0) {
            this.dependencyHandler.core.addUnresolvedDependencies({
              varsUnresolved: result.varsUnresolved,
              component: downComponent,
              updatesNeeded
            });

          }
        }

        if (!downComponent.state[vName].isResolved) {
          // just added a dependency to a variable that is not resolved
          // add unresolved dependencies

          let upComponent = this.dependencyHandler._components[this.upstreamComponentName]

          let varsUnresolved = {};
          for (let upVarName of this.upstreamVariableNames) {
            varsUnresolved[upVarName] = [{
              componentName: downstreamComponentName,
              stateVariable: vName
            }]
          }

          this.dependencyHandler.core.addUnresolvedDependencies({
            varsUnresolved,
            component: upComponent,
            updatesNeeded
          });

          // if upstream was previously resolved
          // mark it as unresolved and recursively add 
          // unresolved dependencies upstream
          for (let upVarName of this.upstreamVariableNames) {
            if (upComponent.state[upVarName].isResolved) {

              this.dependencyHandler.core.recordActualChangeInStateVariable({
                componentName: this.upstreamComponentName,
                varName: upVarName,
                updatesNeeded,
              })

              upComponent.state[upVarName].isResolved = false;
              this.dependencyHandler.core.resetUpstreamDependentsUnresolved({
                component: upComponent,
                varName: upVarName,
                updatesNeeded
              })
            }
          }
        }



      }

    }

    // if don't have any state variables,
    // then just record the upstream dependencies on the downstream component
    // under "__identity"
    if (downVarNames.length === 0) {
      downVarNames = [this.downstreamVariableNameIfNoVariables];
    }

    let downCompUpDeps = this.dependencyHandler.upstreamDependencies[downstreamComponentName];
    if (!downCompUpDeps) {
      downCompUpDeps = this.dependencyHandler.upstreamDependencies[downstreamComponentName] = {};
    }

    for (let varName of downVarNames) {
      if (downCompUpDeps[varName] === undefined) {
        downCompUpDeps[varName] = [];
      }
      downCompUpDeps[varName].push(this);

      if (varName !== this.downstreamVariableNameIfNoVariables) {
        for (let upstreamVarName of this.upstreamVariableNames) {
          this.dependencyHandler.resetCircularCheckPassed(this.upstreamComponentName, upstreamVarName);
        }
      }
    }

    for (let upVarName of this.upstreamVariableNames) {
      if (this.dependencyHandler._components[this.upstreamComponentName].state[upVarName].isResolved) {
        this.dependencyHandler.core.recordActualChangeInStateVariable({
          componentName: this.upstreamComponentName,
          varName: upVarName,
          updatesNeeded,
        })
      }
    }

  }

  removeDownstreamComponent(indexToRemove, updatesNeeded) {
    // console.log(`remove downstream ${indexToRemove}, ${this.downstreamComponentNames[indexToRemove]} dependency: ${this.dependencyName}`)
    // console.log(this.upstreamComponentName, this.representativeStateVariable);

    // remove downstream component specified by indexToRemove from this dependency

    this.componentIdentitiesChanged = true;

    let componentName = this.downstreamComponentNames[indexToRemove];

    this.downstreamComponentNames.splice(indexToRemove, 1);
    this.downstreamComponentTypes.splice(indexToRemove, 1);

    let affectedDownstreamVariableNames;

    if (!this.mappedDownstreamVariableNamesByComponent) {
      affectedDownstreamVariableNames = [this.downstreamVariableNameIfNoVariables];
    } else {

      affectedDownstreamVariableNames = this.mappedDownstreamVariableNamesByComponent[indexToRemove];
      this.mappedDownstreamVariableNamesByComponent.splice(indexToRemove, 1);
      this.valuesChanged.splice(indexToRemove, 1);

      if (this.variablesOptional) {
        // if variables are optional, it's possble no variables were found
        // so add placeholder variable name just in case
        // (It doesn't matter if extra variables are included,
        // as they will be skipped below.  And, since the component may have
        // been deleted already, we don't want to check its state.)
        affectedDownstreamVariableNames.push(this.downstreamVariableNameIfNoVariables);
      }
    }


    // delete from upstream dependencies of downstream component
    for (let vName of affectedDownstreamVariableNames) {
      let downCompUpDeps = this.dependencyHandler.upstreamDependencies[componentName][vName];
      if (downCompUpDeps) {
        let ind = downCompUpDeps.indexOf(this);
        // if find an upstream dependency, delete
        if (ind !== -1) {
          if (downCompUpDeps.length === 1) {
            delete this.dependencyHandler.upstreamDependencies[componentName][vName];
          } else {
            downCompUpDeps.splice(ind, 1);
          }
        }
      }


      if (vName !== this.downstreamVariableNameIfNoVariables) {
        for (let upstreamVarName of this.upstreamVariableNames) {
          // TODO: check why have to do this when remove a component from a dependency
          this.dependencyHandler.resetCircularCheckPassed(this.upstreamComponentName, upstreamVarName);
        }
      }
    }

    for (let upVarName of this.upstreamVariableNames) {
      if (this.dependencyHandler._components[this.upstreamComponentName].state[upVarName].isResolved) {
        this.dependencyHandler.core.recordActualChangeInStateVariable({
          componentName: this.upstreamComponentName,
          varName: upVarName,
          updatesNeeded,
        })
      }
    }

  }

  swapDownstreamComponents(index1, index2, updatesNeeded) {

    this.componentIdentitiesChanged = true;

    [this.downstreamComponentNames[index1], this.downstreamComponentNames[index2]]
      = [this.downstreamComponentNames[index2], this.downstreamComponentNames[index1]];

    [this.downstreamComponentTypes[index1], this.downstreamComponentTypes[index2]]
      = [this.downstreamComponentTypes[index2], this.downstreamComponentTypes[index1]];

    if (this.originalDownstreamVariableNames) {
      [this.mappedDownstreamVariableNamesByComponent[index1], this.mappedDownstreamVariableNamesByComponent[index2]]
        = [this.mappedDownstreamVariableNamesByComponent[index2], this.mappedDownstreamVariableNamesByComponent[index1]];

    }

    for (let upVarName of this.upstreamVariableNames) {
      if (this.dependencyHandler._components[this.upstreamComponentName].state[upVarName].isResolved) {
        this.dependencyHandler.core.recordActualChangeInStateVariable({
          componentName: this.upstreamComponentName,
          varName: upVarName,
          updatesNeeded,
        })
      }
    }

  }

  delete(updatesNeeded) {

    // console.log(`deleting dependency: ${this.dependencyName}`)
    // console.log(this.upstreamComponentName, this.representativeStateVariable);


    let affectedDownstreamVariableNamesByUpstreamComponent = [];

    if (!this.mappedDownstreamVariableNamesByComponent) {
      affectedDownstreamVariableNamesByUpstreamComponent = Array(this.downstreamComponentNames.length)
        .fill([this.downstreamVariableNameIfNoVariables]);
    } else {
      affectedDownstreamVariableNamesByUpstreamComponent = this.mappedDownstreamVariableNamesByComponent;
      if (this.variablesOptional) {
        let newVarNames = [];
        for (let [ind, cName] of this.downstreamComponentNames.entries()) {
          let varNamesForComponent = [];
          for (let vName of affectedDownstreamVariableNamesByUpstreamComponent[ind]) {
            if (this.dependencyHandler.components[cName].state[vName]) {
              varNamesForComponent.push(vName);
            }
          }

          // if variablesOptional, it is possible that no variables were found
          if (varNamesForComponent.length > 0) {
            newVarNames.push(varNamesForComponent);
          } else {
            newVarNames.push([this.downstreamVariableNameIfNoVariables]);
          }
        }
        affectedDownstreamVariableNamesByUpstreamComponent = newVarNames;
      }
    }


    // delete from upstream dependencies of downstream components
    for (let [cInd, downCompName] of this.downstreamComponentNames.entries()) {
      for (let vName of affectedDownstreamVariableNamesByUpstreamComponent[cInd]) {
        let downCompUpDeps = this.dependencyHandler.upstreamDependencies[downCompName][vName];
        if (downCompUpDeps) {
          let ind = downCompUpDeps.indexOf(this);
          // if find an upstream dependency, delete
          if (ind !== -1) {
            if (downCompUpDeps.length === 1) {
              delete this.dependencyHandler.upstreamDependencies[downCompName][vName];
            } else {
              downCompUpDeps.splice(ind, 1);
            }
          }
        }


        if (vName !== this.downstreamVariableNameIfNoVariables) {
          for (let upstreamVarName of this.upstreamVariableNames) {
            // TODO: check why have to do this when delete a dependency
            this.dependencyHandler.resetCircularCheckPassed(this.upstreamComponentName, upstreamVarName);
          }
        }
      }
    }

    for (let upVarName of this.upstreamVariableNames) {
      if (this.dependencyHandler._components[this.upstreamComponentName].state[upVarName].isResolved) {
        this.dependencyHandler.core.recordActualChangeInStateVariable({
          componentName: this.upstreamComponentName,
          varName: upVarName,
          updatesNeeded,
        })
      }
    }

    this.deleteFromUpdateTriggers();

    // delete from downstream dependencies of upstream components

    let upCompDownDeps = this.dependencyHandler.downstreamDependencies[this.upstreamComponentName];

    for (let varName of this.upstreamVariableNames) {
      delete upCompDownDeps[varName][this.dependencyName];
    }

  }

  deleteFromUpdateTriggers() { }

  getValue({ verbose = false } = {}) {

    let value = [];
    let changes = {};
    let usedDefault = false;

    if (this.componentIdentitiesChanged) {
      changes.componentIdentitiesChanged = true;
      this.componentIdentitiesChanged = false;
    }

    for (let [componentInd, componentName] of this.downstreamComponentNames.entries()) {
      let depComponent = this.dependencyHandler.components[componentName];

      let componentObj = {
        componentName: depComponent.componentName,
        componentType: depComponent.componentType,
      };

      if (this.originalDownstreamVariableNames.length > 0) {

        componentObj.stateValues = {};

        for (let [varInd, originalVarName] of this.originalDownstreamVariableNames.entries()) {
          let mappedVarName = this.mappedDownstreamVariableNamesByComponent[componentInd][varInd];

          let nameForOutput = this.useMappedVariableNames ? mappedVarName : originalVarName;

          if (!this.variablesOptional || mappedVarName in depComponent.state) {
            if (!depComponent.state[mappedVarName].deferred) {
              componentObj.stateValues[nameForOutput] = depComponent.stateValues[mappedVarName];
              if (this.valuesChanged[componentInd][mappedVarName].changed
              ) {
                if (!changes.valuesChanged) {
                  changes.valuesChanged = {};
                }
                if (!changes.valuesChanged[componentInd]) {
                  changes.valuesChanged[componentInd] = {}
                }
                changes.valuesChanged[componentInd][nameForOutput] = this.valuesChanged[componentInd][mappedVarName];
              }
              this.valuesChanged[componentInd][mappedVarName] = {};
            }
          }
        }
      }

      value.push(componentObj);

    }


    if (!verbose) {
      if (this.returnSingleVariableValue) {
        if (value.length === 1) {
          value = value[0];
          let stateVariables = Object.keys(value.stateValues);
          if (changes.valuesChanged && changes.valuesChanged[0] && changes.valuesChanged[0][0]) {
            changes.valuesChanged = changes.valuesChanged[0][0];
          }

          if (stateVariables.length === 1) {
            value = value.stateValues[stateVariables[0]];

            usedDefault = this.dependencyHandler.components[this.downstreamComponentNames[0]].state[
              this.mappedDownstreamVariableNamesByComponent[0][0]
            ].usedDefault;

          } else {
            value = null;
          }
        } else {
          value = null;
        }
      } else if (this.returnSingleComponent) {
        if (value.length === 1) {
          value = value[0];
          if (changes.valuesChanged && changes.valuesChanged[0]) {
            changes.valuesChanged = changes.valuesChanged[0];
          }
        } else {
          value = null;
        }
      }
    }

    if (!this.doNotProxy && value !== null && typeof value === 'object') {
      value = new Proxy(value, readOnlyProxyHandler)
    }

    return { value, changes, usedDefault }
  }

  checkForCircular() {
    for (let varName of this.upstreamVariableNames) {
      this.dependencyHandler.resetCircularCheckPassed(this.upstreamComponentName, varName);
    }
    for (let varName of this.upstreamVariableNames) {
      this.dependencyHandler.checkForCircularDependency({
        componentName: this.upstreamComponentName, varName
      });
    }
  }

  recalculateDownstreamComponents(updatesNeeded, compositesBeingExpanded) {

    let newDownComponents = this.determineDownstreamComponents();
    // this.downstreamComponentNames = newDownComponents.downstreamComponentNames;
    // this.downstreamComponentTypes = newDownComponents.downstreamComponentTypes;

    let newComponentNames = newDownComponents.downstreamComponentNames;

    let foundChange = newComponentNames.length !== this.downstreamComponentNames.length
      || this.downstreamComponentNames.some((v, i) => v != newComponentNames[i])

    if (foundChange) {

      this.componentIdentitiesChanged = true;

      // first remove any components that are no longer present

      let nRemoved = 0;
      for (let [ind, downCompName] of [...this.downstreamComponentNames].entries()) {
        if (!newComponentNames.includes(downCompName)) {
          // updatesNeeded.componentsTouched.push(downCompName);
          this.removeDownstreamComponent(ind - nRemoved, updatesNeeded);
          nRemoved++;
        }
      }

      for (let [ind, downCompName] of newComponentNames.entries()) {
        let oldInd = this.downstreamComponentNames.indexOf(downCompName);

        if (oldInd !== -1) {
          if (oldInd !== ind) {
            this.swapDownstreamComponents(oldInd, ind, updatesNeeded);
            // updatesNeeded.componentsTouched.push(downCompName);
          }
        } else {
          // updatesNeeded.componentsTouched.push(downCompName);
          this.addDownstreamComponent({
            downstreamComponentName: downCompName,
            downstreamComponentType: newDownComponents.downstreamComponentTypes[ind],
            index: ind,
            createVariables: true,
            updatesNeeded,
            compositesBeingExpanded,
          });

        }

      }

    }

  }

}



class StateVariableDependency extends Dependency {
  static dependencyType = "stateVariable";

  setUpParameters() {

    if (this.definition.componentName) {
      this.componentName = this.definition.componentName;
      this.specifiedComponentName = this.componentName;
    } else {
      this.componentName = this.upstreamComponentName;
    }

    if (this.definition.variableName === undefined) {
      throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: variableName is not defined`);
    }
    this.originalDownstreamVariableNames = [this.definition.variableName];

    if (this.definition.returnAsComponentObject) {
      this.returnSingleComponent = true;
    } else {
      this.returnSingleVariableValue = true;
    }

  }

  determineDownstreamComponents() {

    let component = this.dependencyHandler._components[this.componentName];

    if (!component) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;
      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    return {
      downstreamComponentNames: [this.componentName],
      downstreamComponentTypes: [component.componentType]
    }

  }

  deleteFromUpdateTriggers() {
    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }
  }

}

dependencyTypeArray.push(StateVariableDependency);


class StateVariableComponentTypeDependency extends StateVariableDependency {
  static dependencyType = "stateVariableComponentType";

  getValue({ verbose = false } = {}) {

    let value = [];
    let changes = {};
    let usedDefault = false;

    if (this.componentIdentitiesChanged) {
      changes.componentIdentitiesChanged = true;
      this.componentIdentitiesChanged = false;
    }

    for (let [componentInd, componentName] of this.downstreamComponentNames.entries()) {
      let depComponent = this.dependencyHandler.components[componentName];

      let componentObj = {
        componentName: depComponent.componentName,
        componentType: depComponent.componentType,
      };

      if (this.originalDownstreamVariableNames.length > 0) {

        componentObj.stateValues = {};

        for (let [varInd, originalVarName] of this.originalDownstreamVariableNames.entries()) {
          let mappedVarName = this.mappedDownstreamVariableNamesByComponent[componentInd][varInd];

          let nameForOutput = this.useMappedVariableNames ? mappedVarName : originalVarName;

          if (!this.variablesOptional || mappedVarName in depComponent.state) {
            if (!depComponent.state[mappedVarName].deferred) {

              let stateVarObj = depComponent.state[mappedVarName]
              // call getter to make sure component type is set
              stateVarObj.value;
              componentObj.stateValues[nameForOutput] = stateVarObj.componentType;

              if (stateVarObj.isArray) {
                // if array, use componentType from wrapping components, if exist
                if (stateVarObj.wrappingComponents && stateVarObj.wrappingComponents.length > 0) {
                  let wrapCs = stateVarObj.wrappingComponents[stateVarObj.wrappingComponents.length - 1];
                  componentObj.stateValues[nameForOutput] = wrapCs[0];
                }
              }

              if (this.valuesChanged[componentInd][mappedVarName].changed
              ) {
                if (!changes.valuesChanged) {
                  changes.valuesChanged = {};
                }
                if (!changes.valuesChanged[componentInd]) {
                  changes.valuesChanged[componentInd] = {}
                }
                changes.valuesChanged[componentInd][nameForOutput] = this.valuesChanged[componentInd][mappedVarName];
              }
              this.valuesChanged[componentInd][mappedVarName] = {};
            }
          }
        }
      }

      value.push(componentObj);

    }


    if (!verbose) {
      if (this.returnSingleVariableValue) {
        if (value.length === 1) {
          value = value[0];
          let stateVariables = Object.keys(value.stateValues);
          if (changes.valuesChanged && changes.valuesChanged[0] && changes.valuesChanged[0][0]) {
            changes.valuesChanged = changes.valuesChanged[0][0];
          }

          if (stateVariables.length === 1) {
            value = value.stateValues[stateVariables[0]];

            usedDefault = this.dependencyHandler.components[this.downstreamComponentNames[0]].state[
              this.mappedDownstreamVariableNamesByComponent[0][0]
            ].usedDefault;

          } else {
            value = null;
          }
        } else {
          value = null;
        }
      } else if (this.returnSingleComponent) {
        if (value.length === 1) {
          value = value[0];
          if (changes.valuesChanged && changes.valuesChanged[0]) {
            changes.valuesChanged = changes.valuesChanged[0];
          }
        } else {
          value = null;
        }
      }
    }

    if (!this.doNotProxy && value !== null && typeof value === 'object') {
      value = new Proxy(value, readOnlyProxyHandler)
    }

    return { value, changes, usedDefault }
  }

}

dependencyTypeArray.push(StateVariableComponentTypeDependency);

class RecursiveDependencyValuesDependency extends Dependency {
  static dependencyType = "recursiveDependencyValues";

  setUpParameters() {

    if (this.definition.componentName) {
      this.componentName = this.definition.componentName;
      this.specifiedComponentName = this.componentName;
    } else {
      this.componentName = this.upstreamComponentName;
    }

    if (this.definition.variableName === undefined) {
      throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: variableName is not defined`);
    }
    this.originalDownstreamVariableNames = [this.definition.variableName];

    this.changedValuesOnly = this.definition.changedValuesOnly;
    this.returnSingleVariableValue = false;

  }

  determineDownstreamComponents() {

    let component = this.dependencyHandler._components[this.componentName];

    if (!component) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;
      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    return {
      downstreamComponentNames: [this.componentName],
      downstreamComponentTypes: [component.componentType]
    }

  }

  getValue() {
    // first calculate value of state variable
    // since dependencies are created as though depended on state variable itself

    let mappedVar = this.mappedDownstreamVariableNamesByComponent[0][0];

    this.dependencyHandler._components[this.componentName].stateValues[mappedVar]

    let value = this.getStateVariableRecursiveDependencyValues({
      componentName: this.componentName,
      stateVariable: mappedVar,
      changedValuesOnly: this.changedValuesOnly,
    })

    // don't check if have .changed attribute
    // as it wouldn't reflect if a change occurred anywhere in the dependencies
    let changes = {};
    if (this.valuesChanged[0][mappedVar]) {
      changes = { valuesChanged: this.valuesChanged[0][mappedVar] };
    }
    this.valuesChanged[0][mappedVar] = {};

    return { value, changes };
  }

  getStateVariableRecursiveDependencyValues({ componentName, stateVariable, changedValuesOnly }) {

    let component = this.dependencyHandler._components[componentName];


    let downDeps = this.dependencyHandler.downstreamDependencies[component.componentName][stateVariable];


    let recursiveDependencyValues
      = component.state[stateVariable].recursiveDependencyValues = {};

    for (let dependencyName in downDeps) {
      let dep = downDeps[dependencyName];

      let dependencyValue = dep.getValue({ verbose: true }).value;

      for (let [cInd, cName] of dep.downstreamComponentNames.entries()) {
        let dependencyValuesForCName = recursiveDependencyValues[cName];
        if (dependencyValuesForCName === undefined) {
          dependencyValuesForCName = recursiveDependencyValues[cName] = {};
        }

        let changedValuesForCName = this.dependencyHandler.core.changedStateVariables[cName];

        let vNames = [];
        if (dep.originalDownstreamVariableNames.length > 0) {
          vNames = dep.mappedDownstreamVariableNamesByComponent[cInd];
          if (dep.variablesOptional) {
            let mappedVNames = vNames;
            vNames = [];
            for (let vName of mappedVNames) {
              if (vName in this.dependencyHandler._components[cName].state ||
                this.dependencyHandler.core.checkIfArrayEntry({
                  stateVariable: vName,
                  component: this.dependencyHandler._components[cName]
                })
              ) {
                vNames.push(vName);
              }
            }
          }
        }


        for (let vName of vNames) {
          // don't calculate value or recurse if calculated this value before
          if (!(vName in dependencyValuesForCName)) {

            // if changedValuesOnly, then only include if these values have changed
            if (!changedValuesOnly || changedValuesForCName) {

              let value = dependencyValue[cInd].stateValues[vName];

              if (!changedValuesOnly) {
                dependencyValuesForCName[vName] = value;
              } else {

                let sVarObj = this.dependencyHandler._components[cName].state[vName];

                // sVarObj could be undefined if vName was an optional variable
                if (sVarObj) {
                  if (sVarObj.isArray || sVarObj.isArrayEntry) {

                    let arrayKeys, arrayVName;
                    if (sVarObj.isArray) {
                      arrayVName = vName;
                      arrayKeys = sVarObj.getAllArrayKeys(sVarObj.arraySize);
                    } else {
                      arrayVName = sVarObj.arrayStateVariable;
                      arrayKeys = sVarObj.arrayKeys;
                    }
                    if (changedValuesForCName[arrayVName] &&
                      arrayKeys.some(x => changedValuesForCName[arrayVName].has(x))
                    ) {
                      dependencyValuesForCName[vName] = value;
                    }
                  } else if (changedValuesForCName[vName]) {
                    // found change when not array or array entry
                    dependencyValuesForCName[vName] = value;
                  }
                }

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

  };

  deleteFromUpdateTriggers() {
    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }
  }

}

dependencyTypeArray.push(RecursiveDependencyValuesDependency);


class ComponentIdentityDependency extends Dependency {
  static dependencyType = "componentIdentity";

  setUpParameters() {

    if (this.definition.componentName) {
      this.componentName = this.definition.componentName
      this.specifiedComponentName = this.componentName;
    } else {
      this.componentName = this.upstreamComponentName;
    }

    this.returnSingleComponent = true;

  }

  determineDownstreamComponents() {

    let component = this.dependencyHandler._components[this.componentName];

    if (!component) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;
      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    return {
      downstreamComponentNames: [this.componentName],
      downstreamComponentTypes: [component.componentType]
    }
  }

  deleteFromUpdateTriggers() {
    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }
  }

}

dependencyTypeArray.push(ComponentIdentityDependency);


class ChildDependency extends Dependency {
  static dependencyType = "child";

  setUpParameters() {

    if (this.definition.parentName) {
      this.parentName = this.definition.parentName
      this.specifiedComponentName = this.parentName;
    } else {
      this.parentName = this.upstreamComponentName;
    }

    if (this.definition.variableNames) {
      if (!Array.isArray(this.definition.variableNames)) {
        throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: variableNames must be an array`)
      }
      this.originalDownstreamVariableNames = this.definition.variableNames;
    } else {
      this.originalDownstreamVariableNames = [];
    }

    this.childLogicName = this.definition.childLogicName;

    if (this.definition.childIndices !== undefined) {
      this.childIndices = this.definition.childIndices.map(x => Number(x))
    }


  }

  determineDownstreamComponents() {

    let parent = this.dependencyHandler._components[this.parentName];

    if (!parent) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    let childDependencies = this.dependencyHandler.updateTriggers.childDependenciesByParent[this.parentName];
    if (!childDependencies) {
      childDependencies = this.dependencyHandler.updateTriggers.childDependenciesByParent[this.parentName] = [];
    }
    if (!childDependencies.includes(this)) {
      childDependencies.push(this);
    }

    let activeChildrenIndices = parent.childLogic.returnMatches(this.definition.childLogicName);
    if (activeChildrenIndices === undefined) {
      throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: childLogicName ${this.definition.childLogicName} does not exist.`);
    }

    // if childIndices specified, filter out just those indices
    // Note: indices are relative to the selected ones
    // (not actual index in activeChildren)
    // so filter uses the i argument, not the x argument
    if (this.childIndices) {
      activeChildrenIndices = activeChildrenIndices
        .filter((x, i) => this.childIndices.includes(i));
    }

    return {
      downstreamComponentNames: activeChildrenIndices.map(x => parent.activeChildren[x].componentName),
      downstreamComponentTypes: activeChildrenIndices.map(x => parent.activeChildren[x].componentType),
    }

  }

  deleteFromUpdateTriggers() {
    let childDeps = this.dependencyHandler.updateTriggers.childDependenciesByParent[this.parentName];
    if (childDeps) {
      let ind = childDeps.indexOf(this);
      if (ind !== -1) {
        childDeps.splice(ind, 1);
      }
    }

    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }


  }

}

dependencyTypeArray.push(ChildDependency);


class DescendantDependency extends Dependency {
  static dependencyType = "descendant";

  setUpParameters() {

    if (this.definition.ancestorName) {
      this.ancestorName = this.definition.ancestorName
      this.specifiedComponentName = this.ancestorName;
    } else {
      this.ancestorName = this.upstreamComponentName;
    }

    if (this.definition.variableNames) {
      if (!Array.isArray(this.definition.variableNames)) {
        throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: variableNames must be an array`)
      }
      this.originalDownstreamVariableNames = this.definition.variableNames;
    } else {
      this.originalDownstreamVariableNames = [];
    }

    this.componentTypes = this.definition.componentTypes.map(x => x.toLowerCase());
    this.recurseToMatchedChildren = this.definition.recurseToMatchedChildren;
    this.useReplacementsForComposites = this.definition.useReplacementsForComposites;
    this.includeNonActiveChildren = this.definition.includeNonActiveChildren;
    this.includePropertyChildren = this.definition.includePropertyChildren;
    this.skipOverAdapters = this.definition.skipOverAdapters;
    this.ignoreReplacementsOfMatchedComposites = this.definition.ignoreReplacementsOfMatchedComposites;
    this.definingChildrenFirst = this.definition.definingChildrenFirst;

  }

  determineDownstreamComponents() {

    let ancestor = this.dependencyHandler._components[this.ancestorName];

    if (!ancestor) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    let descendantDependencies = this.dependencyHandler.updateTriggers.descendantDependenciesByAncestor[this.ancestorName];
    if (!descendantDependencies) {
      descendantDependencies = this.dependencyHandler.updateTriggers.descendantDependenciesByAncestor[this.ancestorName] = [];
    }
    if (!descendantDependencies.includes(this)) {
      descendantDependencies.push(this);
    }

    let descendants = gatherDescendants({
      ancestor,
      descendantClasses: this.componentTypes.map(x => this.dependencyHandler.componentInfoObjects.allComponentClasses[x]),
      recurseToMatchedChildren: this.recurseToMatchedChildren,
      useReplacementsForComposites: this.useReplacementsForComposites,
      includeNonActiveChildren: this.includeNonActiveChildren,
      includePropertyChildren: this.includePropertyChildren,
      skipOverAdapters: this.skipOverAdapters,
      ignoreReplacementsOfMatchedComposites: this.ignoreReplacementsOfMatchedComposites,
      definingChildrenFirst: this.definingChildrenFirst,
      compositeClass: this.dependencyHandler.componentInfoObjects.allComponentClasses._composite,
    });

    return {
      downstreamComponentNames: descendants.map(x => x.componentName),
      downstreamComponentTypes: descendants.map(x => x.componentType),
    }



  }

  deleteFromUpdateTriggers() {

    let descendantDeps = this.dependencyHandler.updateTriggers.descendantDependenciesByAncestor[this.ancestorName];
    if (descendantDeps) {
      let ind = descendantDeps.indexOf(this);
      if (ind !== -1) {
        descendantDeps.splice(ind, 1);
      }
    }

    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }

  }

}

dependencyTypeArray.push(DescendantDependency);


class ParentDependency extends Dependency {
  static dependencyType = "parentStateVariable";

  setUpParameters() {

    if (this.definition.childName) {
      this.childName = this.definition.childName
      this.specifiedComponentName = this.childName;
    } else {
      this.childName = this.upstreamComponentName;
    }

    if (!this.definition.variableName) {
      throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: must have a variableName`)
    } else {
      this.originalDownstreamVariableNames = [this.definition.variableName];
    }

    this.returnSingleVariableValue = true;

    // for parent state variable
    // always make variables optional so that don't get error
    // depending on parent (which a component can't control)
    this.variablesOptional = true;

  }


  determineDownstreamComponents() {

    let child = this.dependencyHandler._components[this.childName];

    if (!child) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    if (!child.parentName) {
      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    this.parentName = child.parentName;

    let parent = this.dependencyHandler._components[this.parentName];

    if (!parent) {
      // Note: since parent is created after children,
      // will typically hit this condition first time through
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.parentName];
      if (!dependenciesMissingComponent) {
        dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.parentName] = [];
      }
      if (!dependenciesMissingComponent.includes(this)) {
        dependenciesMissingComponent.push(this);
      }

      this.unresolvedSpecifiedComponent = this.parentName;

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    let parentDependencies = this.dependencyHandler.updateTriggers.parentDependenciesByParent[this.parentName];
    if (!parentDependencies) {
      parentDependencies = this.dependencyHandler.updateTriggers.parentDependenciesByParent[this.parentName] = [];
    }
    if (!parentDependencies.includes(this)) {
      parentDependencies.push(this);
    }

    return {
      downstreamComponentNames: [this.parentName],
      downstreamComponentTypes: [parent.componentType],
    }

  }

  deleteFromUpdateTriggers() {
    let parentDeps = this.dependencyHandler.updateTriggers.parentDependenciesByParent[this.parentName];
    if (parentDeps) {
      let ind = parentDeps.indexOf(this);
      if (ind !== -1) {
        parentDeps.splice(ind, 1);
      }
    }

    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }

    let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.parentName];
    if (dependenciesMissingComponent) {
      let ind = dependenciesMissingComponent.indexOf(this);
      if (ind !== -1) {
        dependenciesMissingComponent.splice(ind, 1);
      }
    }


  }

}

dependencyTypeArray.push(ParentDependency);


class AncestorDependency extends Dependency {
  static dependencyType = "ancestor";

  setUpParameters() {

    if (this.definition.descendantName) {
      this.descendantName = this.definition.descendantName
      this.specifiedComponentName = this.descendantName;
    } else {
      this.descendantName = this.upstreamComponentName;
    }

    if (this.definition.variableNames) {
      if (!Array.isArray(this.definition.variableNames)) {
        throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: variableNames must be an array`)
      }
      this.originalDownstreamVariableNames = this.definition.variableNames;
    } else {
      this.originalDownstreamVariableNames = [];
    }

    this.returnSingleComponent = true;

  }

  determineDownstreamComponents() {

    let descendant = this.dependencyHandler._components[this.descendantName];

    if (!descendant) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    if (this.definition.componentType) {
      this.componentType = this.definition.componentType.toLowerCase();
    }

    let ancestorResults = this.findMatchingAncestor(descendant);

    if (ancestorResults.missingComponentName) {
      // this should typically happen at first,
      // as ancestor won't have been created yet
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[ancestorResults.missingComponentName];
      if (!dependenciesMissingComponent) {
        dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[ancestorResults.missingComponentName] = [];
      }
      if (!dependenciesMissingComponent.includes(this)) {
        dependenciesMissingComponent.push(this);
      }

      this.unresolvedSpecifiedComponent = ancestorResults.missingComponentName;

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    for (let ancestorName of ancestorResults.ancestorsExamined) {
      let ancestorDependencies = this.dependencyHandler.updateTriggers.ancestorDependenciesByPotentialAncestor[ancestorName];
      if (!ancestorDependencies) {
        ancestorDependencies = this.dependencyHandler.updateTriggers.ancestorDependenciesByPotentialAncestor[ancestorName] = [];
      }
      if (!ancestorDependencies.includes(this)) {
        ancestorDependencies.push(this);
      }
    }
    this.ancestorResults = ancestorResults;

    if (ancestorResults.ancestorFound) {
      return {
        downstreamComponentNames: [ancestorResults.ancestorFound.componentName],
        downstreamComponentTypes: [ancestorResults.ancestorFound.componentType],
      }
    } else {
      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

  }

  findMatchingAncestor(descendant) {

    let ancestorsExamined = [];

    if (this.componentType) {
      for (let ancestor of descendant.ancestors) {

        let ancestorComponent = this.dependencyHandler._components[ancestor.componentName];
        if (!ancestorComponent) {
          return { missingComponentName: ancestor.componentName }
        }

        ancestorsExamined.push(ancestor.componentName);


        if (this.dependencyHandler.componentInfoObjects.isInheritedComponentType({
          inheritedComponentType: ancestorComponent.componentType,
          baseComponentType: this.componentType,
        })) {
          return {
            ancestorsExamined,
            ancestorFound: ancestor
          }
        }
      }

      return { ancestorsExamined };
    }

    if (this.originalDownstreamVariableNames.length === 0) {
      console.warn(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: must specify componentType or variableNames to find ancestor`);
      return { ancestorsExamined };
    }

    // the state variable definition did not prescribe the component type
    // of the ancestor, but it did give the variableNames to match
    // Search all the state variables of the ancestors to find one
    // that has all the requisite state variables

    let variableNames = this.originalDownstreamVariableNames;

    for (let ancestor of descendant.ancestors) {

      let ancestorComponent = this.dependencyHandler._components[ancestor.componentName];
      if (!ancestorComponent) {
        return { missingComponentName: ancestor.componentName }
      }

      ancestorsExamined.push(ancestor.componentName);

      let foundAllVarNames = true;
      for (let vName of variableNames) {
        if (!(vName in ancestorComponent.state ||
          this.dependencyHandler.core.checkIfArrayEntry({
            stateVariable: vName,
            component: ancestorComponent
          }))
        ) {
          foundAllVarNames = false;
          break;
        }
      }
      if (foundAllVarNames) {
        return {
          ancestorsExamined,
          ancestorFound: ancestor
        }
      }
    }

    return { ancestorsExamined };

  }


  deleteFromUpdateTriggers() {

    for (let ancestorName of this.ancestorResults.ancestorsExamined) {
      let ancestorDeps = this.dependencyHandler.updateTriggers.ancestorDependenciesByPotentialAncestor[ancestorName];
      if (ancestorDeps) {
        let ind = ancestorDeps.indexOf(this);
        if (ind !== -1) {
          ancestorDeps.splice(ind, 1);
        }
      }
    }

    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }

    if (this.ancestorResults && this.ancestorResults.missingComponentName) {
      // this should typically happen at first,
      // as ancestor won't have been created yet
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.ancestorResults.missingComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }

  }

}

dependencyTypeArray.push(AncestorDependency);


class ReplacementDependency extends Dependency {
  static dependencyType = "replacement";

  setUpParameters() {

    if (this.definition.compositeName) {
      this.compositeName = this.definition.compositeName
      this.specifiedComponentName = this.compositeName;
    } else {
      this.compositeName = this.upstreamComponentName;
    }

    if (this.definition.variableNames) {
      if (!Array.isArray(this.definition.variableNames)) {
        throw Error(`Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}: variableNames must be an array`)
      }
      this.originalDownstreamVariableNames = this.definition.variableNames;
    } else {
      this.originalDownstreamVariableNames = [];
    }

    this.recursive = this.definition.recursive;

    if (Number.isInteger(this.definition.componentIndex)) {
      this.componentIndex = this.definition.componentIndex;
    }

  }

  determineDownstreamComponents() {

    let composite = this.dependencyHandler._components[this.compositeName];

    if (!composite) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    this.compositesFound = [this.compositeName];
    let replacements = composite.replacements;

    if (!replacements) {
      replacements = [];
    } else if (this.recursive) {
      let result = this.dependencyHandler.core.recursivelyReplaceCompositesWithReplacements({
        replacements,
      });
      replacements = result.newReplacements;
      this.compositesFound.push(...result.compositesFound);
    }

    for (let cName of this.compositesFound) {
      let replacementDependencies = this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[cName];
      if (!replacementDependencies) {
        replacementDependencies = this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[cName] = [];
      }
      if (!replacementDependencies.includes(this)) {
        replacementDependencies.push(this);
      }
    }

    if (this.componentIndex !== undefined) {
      let theReplacement = replacements[this.componentIndex - 1];
      if (theReplacement) {
        replacements = [theReplacement]
      } else {
        replacements = [];
      }
    }

    return {
      downstreamComponentNames: replacements.map(x => x.componentName),
      downstreamComponentTypes: replacements.map(x => x.componentType),
    }

  }

  deleteFromUpdateTriggers() {

    for (let compositeName of this.compositesFound) {
      let replacementDeps = this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[compositeName];
      if (replacementDeps) {
        let ind = replacementDeps.indexOf(this);
        if (ind !== -1) {
          replacementDeps.splice(ind, 1);
        }
      }
    }

    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }

  }

}

dependencyTypeArray.push(ReplacementDependency);


class CountAmongSiblingsDependency extends Dependency {
  static dependencyType = "countAmongSiblingsOfSameType";

  setUpParameters() {

    if (this.definition.componentName) {
      this.componentName = this.definition.componentName
      this.specifiedComponentName = this.componentName;
    } else {
      this.componentName = this.upstreamComponentName;
    }

  }

  determineDownstreamComponents() {

    let component = this.dependencyHandler._components[this.componentName];

    if (!component) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    if (!component.parentName) {
      console.warn(`component ${this.componentName} does not have a parent for state variable ${this.representativeStateVariable} of ${this.upstreamComponentName}, dependency ${this.dependencyName}.`)
      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    this.parentName = component.parentName;
    let parent = this.dependencyHandler._components[this.parentName];

    if (!parent) {
      // Note: since parent is created after children,
      // will typically hit this condition first time through
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.parentName];
      if (!dependenciesMissingComponent) {
        dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.parentName] = [];
      }
      if (!dependenciesMissingComponent.includes(this)) {
        dependenciesMissingComponent.push(this);
      }

      this.unresolvedSpecifiedComponent = this.parentNam;

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    let childDependencies = this.dependencyHandler.updateTriggers.childDependenciesByParent[this.parentName];
    if (!childDependencies) {
      childDependencies = this.dependencyHandler.updateTriggers.childDependenciesByParent[this.parentName] = [];
    }
    if (!childDependencies.includes(this)) {
      childDependencies.push(this);
    }


    // TODO: do we need this to actually depend on siblings?
    // Or is the update trigger enough to handle all needed updates?
    return {
      downstreamComponentNames: parent.activeChildren.map(x => x.componentName),
      downstreamComponentTypes: parent.activeChildren.map(x => x.componentType),
    }


  }

  deleteFromUpdateTriggers() {
    let childDeps = this.dependencyHandler.updateTriggers.childDependenciesByParent[this.parentName];
    if (childDeps) {
      let ind = childDeps.indexOf(this);
      if (ind !== -1) {
        childDeps.splice(ind, 1);
      }
    }

    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }

    let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.parentName];
    if (dependenciesMissingComponent) {
      let ind = dependenciesMissingComponent.indexOf(this);
      if (ind !== -1) {
        dependenciesMissingComponent.splice(ind, 1);
      }
    }

  }

  getValue() {

    let childComponentType = this.dependencyHandler.components[this.upstreamComponentName].componentType;
    let childrenOfSameType = this.dependencyHandler.components[this.parentName].activeChildren
      .filter(x => x.componentType === childComponentType);
    let value = childrenOfSameType.map(x => x.componentName).indexOf(this.upstreamComponentName) + 1;

    // don't need changes, as it is changed directly from core
    // and then upstream variables are marked as changed
    return { value, changes: {} };
  }

}

dependencyTypeArray.push(CountAmongSiblingsDependency);


class TargetComponentDependency extends Dependency {
  static dependencyType = "targetComponent";

  setUpParameters() {
    let component = this.dependencyHandler._components[this.upstreamComponentName];

    this.tName = component.doenetAttributes.tName;

    if (this.tName) {
      this.targetComponentName = this.specifiedComponentName = component.doenetAttributes.fullTName;
    }

    this.returnSingleComponent = true;

  }


  determineDownstreamComponents() {

    if (!this.tName) {
      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    let targetComponent = this.dependencyHandler._components[this.targetComponentName];

    if (!targetComponent) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (!dependenciesMissingComponent) {
        dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
      }
      if (!dependenciesMissingComponent.includes(this)) {
        dependenciesMissingComponent.push(this);
      }

      this.unresolvedSpecifiedComponent = this.targetComponentName;

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    return {
      downstreamComponentNames: [this.targetComponentName],
      downstreamComponentTypes: [targetComponent.componentType],
    }

  }


  deleteFromUpdateTriggers() {
    let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
    if (dependenciesMissingComponent) {
      let ind = dependenciesMissingComponent.indexOf(this);
      if (ind !== -1) {
        dependenciesMissingComponent.splice(ind, 1);
      }
    }

  }

}

dependencyTypeArray.push(TargetComponentDependency);


class ValueDependency extends Dependency {
  static dependencyType = "value";

  setUpParameters() {
    this.value = this.definition.value;
  }

  getValue() {
    return {
      value: this.value,
      changes: {}
    }
  }

}

dependencyTypeArray.push(ValueDependency);


class FlagDependency extends ValueDependency {
  static dependencyType = "flag";

  setUpParameters() {
    this.flagName = this.definition.flagName;
    this.value = this.dependencyHandler.core.flags[this.flagName];

  }
}

dependencyTypeArray.push(FlagDependency);


class DoenetAttributeDependency extends StateVariableDependency {
  static dependencyType = "doenetAttribute";

  setUpParameters() {

    this.attributeName = this.definition.attributeName;

    if (this.definition.componentName) {
      this.componentName = this.definition.componentName;
      this.specifiedComponentName = this.componentName;
    } else {
      this.componentName = this.upstreamComponentName;
    }

  }

  getValue() {

    let value = null;
    let changes = {};

    if (this.componentIdentitiesChanged) {
      changes.componentIdentitiesChanged = true;
      this.componentIdentitiesChanged = false;
    }

    if (this.downstreamComponentNames.length === 1) {
      let depComponent = this.dependencyHandler.components[this.downstreamComponentNames[0]];

      value = depComponent.doenetAttributes[this.attributeName];

    }

    if (!this.doNotProxy && value !== null && typeof value === 'object') {
      value = new Proxy(value, readOnlyProxyHandler)
    }

    return { value, changes }
  }

}

dependencyTypeArray.push(DoenetAttributeDependency);

// class SwitchDependency extends Dependency {
//   static dependencyType = "switch";

//   setUpParameters() {
//     this.switchName = this.definition.switchName;
//   }

//   initialize(args) {
//     super.initialize(args);

//     let switches = this.dependencyHandler.switchDependencies[this.switchName];
//     if (!switches) {
//       switches = this.dependencyHandler.switchDependencies[this.switchName] = [];
//     }
//     switches.push(this);
//   }

//   delete(args) {
//     super.delete(args);

//     let switches = this.dependencyHandler.switchDependencies[this.switchName];

//     if (switches) {
//       let ind = switches.indexOf(this);
//       if (ind !== -1) {
//         switches.splice(ind, 1);
//       }
//     }

//   }

//   getValue() {

//     let changes = {};
//     if (this.valuesChanged) {
//       changes = { valuesChanged: this.valuesChanged };
//       delete this.valuesChanged;
//     }
//     return {
//       value: this.dependencyHandler.core.switches[this.switchName],
//       changes
//     }
//   }

// }

// dependencyTypeArray.push(SwitchDependency);


class SerializedChildrenDependency extends Dependency {
  static dependencyType = "serializedChildren";

  setUpParameters() {

    if (this.definition.parentName) {
      this.parentName = this.definition.parentName
      this.specifiedComponentName = this.parentName;
    } else {
      this.parentName = this.upstreamComponentName;
    }

  }

  determineDownstreamComponents() {

    let parent = this.dependencyHandler._components[this.parentName];

    if (!parent) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    return {
      downstreamComponentNames: [this.parentName],
      downstreamComponentTypes: [parent.componentType],
    }

  }

  getValue() {

    let parent = this.dependencyHandler._components[this.parentName];

    return {
      value: parent.serializedChildren,
      changes: {}
    }
  }

  deleteFromUpdateTriggers() {
    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }
  }
}

dependencyTypeArray.push(SerializedChildrenDependency);


class VariantsDependency extends Dependency {
  static dependencyType = "variants";

  setUpParameters() {

    if (this.definition.componentName) {
      this.componentName = this.definition.componentName
      this.specifiedComponentName = this.componentName;
    } else {
      this.componentName = this.upstreamComponentName;
    }

  }

  determineDownstreamComponents() {

    let component = this.dependencyHandler._components[this.componentName];

    if (!component) {
      if (this.specifiedComponentName) {
        let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
        if (!dependenciesMissingComponent) {
          dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
          dependenciesMissingComponent.push(this);
        }

        this.unresolvedSpecifiedComponent = this.specifiedComponentName;

      }

      return {
        downstreamComponentNames: [],
        downstreamComponentTypes: []
      }
    }

    delete this.unresolvedSpecifiedComponent;

    return {
      downstreamComponentNames: [this.componentName],
      downstreamComponentTypes: [component.componentType],
    }

  }

  getValue() {

    let component = this.dependencyHandler._components[this.componentName];

    return {
      value: component.variants,
      changes: {}
    }
  }

  deleteFromUpdateTriggers() {
    if (this.specifiedComponentName) {
      let dependenciesMissingComponent = this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[this.specifiedComponentName];
      if (dependenciesMissingComponent) {
        let ind = dependenciesMissingComponent.indexOf(this);
        if (ind !== -1) {
          dependenciesMissingComponent.splice(ind, 1);
        }
      }
    }
  }

}

dependencyTypeArray.push(VariantsDependency);

