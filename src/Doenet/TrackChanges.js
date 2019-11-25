import me from 'math-expressions';
import { deepCompare, deepClone } from './utils/deepFunctions';


// TrackChanges tracks two categories of changes:
// 1. the nature of changes since the last reset, and
// 2. whether or not a change occurred since the last reset or resetChangeOccured.
// The granularity of changes track differs between the two categories.
// 1. It can determine the nature of any change to a particular state variable
//    or whether or not the identity of any of a component's children changed
//    since the last reset.
// 2. It can determine whether or not any change to any component occurred 
//    since the last reset or resetRecentChangeOccurred.
//    A change to a state variable or the identity of a child is considered a change.
//    For this category, net changes are considered only if one uses logPotentialChange.
//    A call to any other change function is considered the occurrence of a change.

export default class TrackChanges {
  constructor({ BaseComponent, components }) {
    this.stateVariableChanges = {};
    this.childChanges = new Set([]);
    this.childChanges.has = this.childChanges.has.bind(this.childChanges);
    this.recentChangeOccurred = false;
    this.numComponentChangesAddressed = {};
    this.BaseComponent = BaseComponent;
    this.components = components;

    // bind to this so that if called from a proxy
    // this is unproxied trackchanges object
    this.getVariableChanges = this.getVariableChanges.bind(this);
  }

  reset() {
    this.stateVariableChanges = {};
    this.childChanges.clear();
    this.resetRecentChangeOccurred();
  }

  resetRecentChangeOccurred() {
    this.mergeAllLoggedPotentialChanges();
    this.recentChangeOccurred = false;
  }

  addNewComponent(component) {
    this.stateVariableChanges[component.componentName] = {};
    for (let variable in component.state) {
      this.addNewValue(component, variable);
    }

    // any call to this function counts as a change occurring
    this.recentChangeOccurred = true;

  }

  addNewValue(component, variable) {

    let currentStateVariable = component._state[variable];

    let cObjVar = this.setUpObjVar({
      component: component,
      variable: variable,
      currentStateVariable: currentStateVariable
    });

    if (currentStateVariable.isArray) {
      cObjVar.changes = { arrayComponents: {} };
      this.copyAllArrayComponents({
        oldValue: currentStateVariable.arrayComponents,
        newArrayComponents: cObjVar.changes.arrayComponents,
        nDimensions: currentStateVariable.nDimensions
      });
    } else {
      cObjVar.changes = component.state[variable];
    }
    delete cObjVar.oldValue;

    // any call to this function counts as a change occurring
    this.recentChangeOccurred = true;
  }

  logPotentialChange({ component, variable, oldValue, index }) {

    let currentStateVariable = component._state[variable];

    if (currentStateVariable === undefined) {
      return;
    }

    let cObjVar = this.setUpObjVar({
      component: component,
      variable: variable,
      currentStateVariable: currentStateVariable
    });

    if (index === undefined) {
      if (currentStateVariable.isArray) {
        // have an array state variable but are overwriting whole thing
        // add old value to each arrayEntry
        if (!("oldValue" in cObjVar)) {
          cObjVar.oldValue = { arrayComponents: {} }
        } else if (cObjVar.oldValue.arrayComponents === undefined) {
          cObjVar.oldValue.arrayComponents = {};
        }
        this.copyAllArrayComponents({
          oldValue: oldValue,
          newArrayComponents: cObjVar.oldValue.arrayComponents,
          nDimensions: currentStateVariable.nDimensions,
          overwrite: false
        });

      } else if (!("oldValue" in cObjVar)) {
        cObjVar.oldValue = deepClone(oldValue, this.BaseComponent);
      }
    } else {
      if (!currentStateVariable.isArray) {
        throw Error("Cannot log index of non-array state variable: " + variable);
      }
      if (!("oldValue" in cObjVar)) {
        cObjVar.oldValue = { arrayComponents: {} }
      } else if (cObjVar.oldValue.arrayComponents === undefined) {
        cObjVar.oldValue.arrayComponents = {};
      }
      if (!(index in cObjVar.oldValue.arrayComponents)) {
        cObjVar.oldValue.arrayComponents[index] = deepClone(oldValue, this.BaseComponent);
      }

    }
  }

  copyAllArrayComponents({ oldValue, newArrayComponents, nDimensions, indexPrefix = [], overwrite = true }) {
    if (Array.isArray(oldValue)) {
      for (let ind in oldValue) {
        if (nDimensions > 1) {
          this.copyAllArrayComponents({
            oldValue: oldValue[ind],
            newArrayComponents: newArrayComponents,
            nDimensions: nDimensions - 1,
            indexPrefix: [...indexPrefix, ind],
            overwrite: overwrite,
          })
        } else {
          if (indexPrefix.length > 0) {
            if(overwrite || newArrayComponents[[...indexPrefix, ind]] === undefined) {
              newArrayComponents[[...indexPrefix, ind]] = deepClone(oldValue[ind], this.BaseComponent);
            }
          } else if(overwrite || newArrayComponents[ind] === undefined) {
            newArrayComponents[ind] = deepClone(oldValue[ind], this.BaseComponent);
          }
        }
      }
      if(indexPrefix.length === 0) {
        if(overwrite || newArrayComponents.length === undefined) {
          newArrayComponents.length = oldValue.length;
        }
      }
    }
  }

  addChange({ component, variable, newChanges, mergeChangesIntoCurrent = true }) {

    let currentStateVariable = component._state[variable];

    if (currentStateVariable === undefined) {
      return;
    }

    let cObjVar = this.setUpObjVar({
      component: component,
      variable: variable,
      currentStateVariable: currentStateVariable
    });

    // Step 1
    // if previously logged changes that represents an actual change,
    // then first collapse to changes attribute
    // and record the occurence of a change
    this.mergeLoggedPotentialChanges({
      cObjVar: cObjVar,
      currentStateVariable: currentStateVariable,
      variable: variable
    });


    // Step 2
    // now deal with newChanges
    // merge newChanges into previousChanges
    // and, optionally, into currentStateVariable

    let previousChanges = cObjVar.changes;

    newChanges.changes = deepClone(newChanges.changes, this.BaseComponent);

    // it didn't have a previous change and we're not merging values
    // then just set change to be new change
    if (previousChanges === undefined) {
      cObjVar.changes = newChanges.changes;
      this.recentChangeOccurred = true;
      if (!mergeChangesIntoCurrent) {
        return { changes: newChanges.changes }
      }
    }

    // merge newChanges into previousChanges and/or currentStateVariable

    let actualChangesToCurrentValue;

    let foundChangeToPreviousChanges = false;

    if (currentStateVariable.isArray) {

      // first merge new changes into state variable
      if (mergeChangesIntoCurrent) {
        let result = this.mergeArrays(newChanges.changes.arrayComponents, currentStateVariable.arrayComponents)
        if(result.foundChange) {
          actualChangesToCurrentValue  = result.actualChanges;
        }
      }
      if (previousChanges !== undefined) {
        let result = this.mergeArrays(newChanges.changes.arrayComponents, previousChanges.arrayComponents)
        if(result.foundChange) {
          foundChangeToPreviousChanges = true
        }
      }

    } else {
      if (mergeChangesIntoCurrent) {
        let result = this.mergeNonArrays(newChanges.changes, currentStateVariable.value);
        currentStateVariable.value = result.newValue;
        actualChangesToCurrentValue = result.actualChanges;
      }
      if (previousChanges !== undefined) {
        let result = this.mergeNonArrays(newChanges.changes, previousChanges);
        previousChanges = result.newValue;
        if(result.foundChange) {
          foundChangeToPreviousChanges = true;
        }
      }
    }

    if (foundChangeToPreviousChanges) {
      this.recentChangeOccurred = true;
      cObjVar.changes = previousChanges;
    }

    let resultObj = { changes: cObjVar.changes }
    if (mergeChangesIntoCurrent) {
      resultObj.changesMerged = actualChangesToCurrentValue
    }

    return resultObj;

  }

  mergeLoggedPotentialChanges({ cObjVar, currentStateVariable, variable }) {

    if ("oldValue" in cObjVar) {
      let oldValue = cObjVar.oldValue;

      if (currentStateVariable.isArray) {
        let changes = cObjVar.changes;
        if (changes === undefined) {
          changes = cObjVar.changes = {};
        }
        if (changes.arrayComponents === undefined) {
          changes.arrayComponents = {};
        }
        // deal separately with each index being changed
        for (let ind in oldValue.arrayComponents) {
          let oldEntry = oldValue.arrayComponents[ind];
          let currentEntry = currentStateVariable.arrayComponents[ind];
          let changeEntry = changes.arrayComponents[ind];

          if (!deepCompare(currentEntry, oldEntry, this.BaseComponent) ||
            (changeEntry !== undefined && !deepCompare(changeEntry, oldEntry, this.BaseComponent))) {

            changes.arrayComponents[ind] = deepClone(currentEntry, this.BaseComponent);
            // we did find a change that was logged
            this.recentChangeOccurred = true;
          }
          delete oldValue.arrayComponents[ind];
        }
      }
      else {
        // we don't have an array
        let currentValue;
        if("rawValue" in currentStateVariable) {
          currentValue = currentStateVariable.rawValue;
        }else {
          currentValue = currentStateVariable.value;
        }

        let foundChange;
        if(currentStateVariable.trackAsObject) {
          foundChange = currentValue !== cObjVar.oldValue ||
          ("changes" in cObjVar && cObjVar.changes !== cObjVar.oldValue);
        }else {
          foundChange = !deepCompare(currentValue, cObjVar.oldValue, this.BaseComponent) ||
            ("changes" in cObjVar && !deepCompare(cObjVar.changes, cObjVar.oldValue, this.BaseComponent));
        }
        if(foundChange) {
          cObjVar.changes = deepClone(currentValue, this.BaseComponent);
          // record that a change occurred
          this.recentChangeOccurred = true;
        }
        delete cObjVar.oldValue;
      }
    }
  }

  mergeAllLoggedPotentialChanges() {

    for (let componentName in this.stateVariableChanges) {
      let stateObj = this.stateVariableChanges[componentName];

      let component = this.components[componentName];
      
      if(component === undefined) {
        continue;
      }

      for (let variable in stateObj) {

        let currentStateVariable = component._state[variable];

        if (currentStateVariable === undefined) {
          continue;
        }

        let cObjVar = this.setUpObjVar({
          component: component,
          variable: variable,
          currentStateVariable: currentStateVariable,
          createIfUndefined: false,
        });

        if (cObjVar === undefined) {
          // this shouldn't happen
          continue;
        }

        this.mergeLoggedPotentialChanges({
          cObjVar: cObjVar,
          currentStateVariable: currentStateVariable,
          variable: variable
        });
      }
    }
  }

  setUpObjVar({ component, variable, currentStateVariable, createIfUndefined = true }) {
    let cObj = this.stateVariableChanges[component.componentName];
    if (cObj === undefined) {
      if (createIfUndefined) {
        cObj = this.stateVariableChanges[component.componentName] = {};
      } else {
        return;
      }
    }
    let cObjVar = cObj[variable];
    if (cObjVar === undefined) {
      if (createIfUndefined) {
        cObjVar = cObj[variable] = {};
        if (currentStateVariable.isArray) {
          cObjVar.isArray = true;
        }
      } else {
        return;
      }
    } else {
      if (currentStateVariable.isArray) {
        if (!cObjVar.isArray) {
          // state variable change from non-array to array

          if (cObjVar.changes !== undefined || "oldValue" in cObjVar) {
            // make the current value of state variable be the changes
            cObj[variable] = cObjVar = { isArray: true, changes: { arrayComponents: {} } }
            this.copyAllArrayComponents({
              oldValue: currentStateVariable.arrayComponents,
              newArrayComponents: cObjVar.changes.arrayComponents,
              nDimensions: currentStateVariable.nDimensions
            });
          } else {
            // cObjVar was blank anyway, so just set it to be an array
            cObjVar.isArray = true;
          }
        }
      } else if (cObjVar.isArray) {
        // state variable changes from array to non-array
        if (cObjVar.changes !== undefined || "oldValue" in cObjVar) {
          // make the current value of state variable be the changes
          cObj[variable] = cObjVar = { changes: currentStateVariable.value }
        } else {
          // cObjVar was blank anyway, so just set it to no longer be an array
          delete cObjVar.isArray;
        }
      }
    }
    return cObjVar;
  }

  mergeNonArrays(newChanges, originalVar) {
    // the change object is not designated as an array
    // check if is a math-expressions a vector/tuple
    if (newChanges && newChanges.tree !== undefined &&
      (newChanges.tree[0] === "tuple" || newChanges.tree[0] === "vector")) {
      if (originalVar && originalVar.tree !== undefined &&
        originalVar.tree[0] === newChanges.tree[0]) {
        // merge the two vectors
        let newAst = [...originalVar.tree];
        let actualChangesAst = [originalVar.tree[0]];
        actualChangesAst.length = originalVar.tree.length;
        let foundActualChange = false;
        for (let i = 1; i < newChanges.tree.length; i++) {
          if (newChanges.tree[i] !== undefined) {
            if (!deepCompare(newAst[i], newChanges.tree[i], this.BaseComponent)) {
              newAst[i] = actualChangesAst[i] = newChanges.tree[i];
              foundActualChange = true;
            }
          }
        }
        if(newAst.length !== newChanges.tree.length) {
          newAst.length = actualChangesAst.length = newChanges.tree.length;
          foundActualChange = true;
        }
        if (foundActualChange) {
          return {
            foundChange: true,
            newValue: me.fromAst(newAst),
            actualChanges: me.fromAst(actualChangesAst)
          }
        }
      } else {
        if (!deepCompare(originalVar, newChanges, this.BaseComponent)) {
          return { foundChange: true, newValue: newChanges, actualChanges: newChanges };
        }
      }
    } else {
      if (!deepCompare(originalVar, newChanges, this.BaseComponent)) {
        return { foundChange: true, newValue: newChanges, actualChanges: newChanges };
      }
    }
    return { foundChange: false, newValue: originalVar, actualChanges: undefined };
  }

  mergeArrays(newArrayComponents, originalArrayComponents) {
    let actualChanges = {};

    for (let ind in newArrayComponents) {
      // check if new component is a math-expressions vector/tuple
      let newComponent = newArrayComponents[ind];
      let originalComp = originalArrayComponents[ind];
      if (newComponent && newComponent.tree !== undefined &&
        (newComponent.tree[0] === "tuple" || newComponent.tree[0] === "vector")) {
        if (originalComp && originalComp.tree !== undefined &&
          originalComp.tree[0] === newComponent.tree[0]) {
          // merge the two vectors
          let newAst = [...originalComp.tree];
          let actualChangesAst = [originalComp.tree[0]];
          actualChangesAst.length = originalComp.tree.length;
          let foundActualChange = false;
          for (let i = 1; i < newComponent.tree.length; i++) {
            if (newComponent.tree[i] !== undefined) {
              if (!deepCompare(newAst[i], newComponent.tree[i], this.BaseComponent)) {
                foundActualChange = true;
                newAst[i] = actualChangesAst[i] = newComponent.tree[i];
              }
            }
          }
          if (foundActualChange) {
            originalArrayComponents[ind] = me.fromAst(newAst);
            actualChanges[ind] = me.fromAst(actualChangesAst);
          }
        }
        else {
          actualChanges[ind] = newComponent;
          originalArrayComponents[ind] = newComponent;
        }
      }
      else {
        if (!deepCompare(originalComp, newComponent, this.BaseComponent)) {
          actualChanges[ind] = newComponent;
          originalArrayComponents[ind] = newComponent;
        }
      }
    }

    if (Object.keys(actualChanges).length > 0) {
      return {foundChange: true, actualChanges: { arrayComponents: actualChanges }}
    } else {
      return {foundChange: false};
    }
  }

  recordChildrenChanged(componentName) {
    this.childChanges.add(componentName);
    this.recentChangeOccurred = true;
  }

  childrenChanged(componentName) {
    return this.childChanges.has(componentName);
  }

  getVariableChanges({ component, variable, index }) {

    let currentStateVariable = component._state[variable];

    if (currentStateVariable === undefined) {
      return;
    }

    let cObjVar = this.setUpObjVar({
      component: component,
      variable: variable,
      currentStateVariable: currentStateVariable,
      createIfUndefined: false,
    });

    if (cObjVar === undefined) {
      return;
    }

    // Step 1
    // if previously logged changes that represents an actual change,
    // then first collapse to changes attribute
    // and record the occurence of a change
    this.mergeLoggedPotentialChanges({
      cObjVar: cObjVar,
      currentStateVariable: currentStateVariable,
      variable: variable
    });


    if (index === undefined) {
      if (cObjVar.changes !== undefined) {
        return { changes: cObjVar.changes }
      }
    } else {
      if (!currentStateVariable.isArray) {
        throw Error("Cannot get change of index of non-array state variable: " + variable);
      }
      if (cObjVar.changes !== undefined) {
        let entryChange = cObjVar.changes.arrayComponents[index];
        if (entryChange !== undefined) {
          return { arrayComponents: { [index]: entryChange } }
        }
      }
    }
  }


  checkIfVariableChanged(component) {
    let componentChanges = this.stateVariableChanges[component.componentName];
    if (componentChanges === undefined) {
      return;
    }
    for (let variable in componentChanges) {
      if (this.getVariableChanges({ component: component, variable: variable })) {
        return true;
      }
    }
  }

  checkRecentChangeOccurred() {

    if (this.recentChangeOccurred) {
      return true;
    }

    this.mergeAllLoggedPotentialChanges();
    
    return this.recentChangeOccurred;

  }


}

