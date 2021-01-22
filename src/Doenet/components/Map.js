import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Map extends CompositeComponent {
  static componentType = "map";

  static createNewNamespacesForChildren = ["template"];

  static assignNamesToReplacements = true;

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.behavior = { default: "combination", trim: true };
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let exactlyOneTemplate = childLogic.newLeaf({
      name: "exactlyOneTemplate",
      componentType: 'template',
      number: 1
    });

    let atLeastOneSubstitutions = childLogic.newLeaf({
      name: "atLeastOneSubstitutions",
      componentType: 'substitutions',
      comparison: "atLeast",
      number: 1
    });

    childLogic.newOperator({
      name: "templateSubstitutions",
      operator: 'and',
      propositions: [exactlyOneTemplate, atLeastOneSubstitutions],
      setAsBase: true,
    });

    return childLogic;

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nSubstitutions = {
      additionalStateVariablesDefined: ["substitutionsNames"],
      returnDependencies: () => ({
        substitutionsChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastOneSubstitutions",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            nSubstitutions: dependencyValues.substitutionsChildren.length,
            substitutionsNames: dependencyValues.substitutionsChildren.map(x => x.componentName)
          }
        }
      },
    };

    stateVariableDefinitions.nIterates = {
      additionalStateVariablesDefined: ["minNIterates", "substitutionsChildNames"],
      returnDependencies: () => ({
        substitutionsChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneSubstitutions",
          variableNames: ["numberOfChildren", "childComponentNames"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let nIterates = dependencyValues.substitutionsChildren.map(x => x.stateValues.numberOfChildren);

        // calculate scalar minNIterates, a scalar holding the minimum value
        let minNIterates = Math.min(...nIterates);

        let substitutionsChildNames = dependencyValues.substitutionsChildren.map(x => [...x.stateValues.childComponentNames]);

        return { newValues: { nIterates, minNIterates, substitutionsChildNames } };
      }

    }


    stateVariableDefinitions.numberTemplateComponents = {
      additionalStateVariablesDefined: ["template"],
      returnDependencies: () => ({
        templateChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneTemplate",
          variableNames: ["serializedChildren"],
        },
      }),
      definition: function ({ dependencyValues }) {
        let templateChildren = dependencyValues.templateChild[0].stateValues.serializedChildren;
        let numberTemplateComponents = templateChildren.length;
        let template = {
          componentType: "template",
          state: { rendered: true },
          children: templateChildren
        }
        return {
          newValues: {
            numberTemplateComponents, template
          }
        }
      }
    }


    stateVariableDefinitions.validBehavior = {
      returnDependencies: () => ({
        behavior: {
          dependencyType: "stateVariable",
          variableName: "behavior"
        },
        nIterates: {
          dependencyType: "stateVariable",
          variableName: "nIterates"
        }
      }),
      definition: function ({ dependencyValues }) {

        let validBehavior = true;

        if (dependencyValues.behavior === "parallel") {
          // display warning if some substitutions activeChildren have differ numbers of iterates
          if (dependencyValues.nIterates.slice(1).some(x => x != dependencyValues.nIterates[0])) {
            console.warn("Warning: map with parallel behavior and different numbers of iterates in substitutions activeChildren." +
              " Extra iterates will be ignored.");
          }
        } else if (dependencyValues.behavior !== "combination") {
          console.warn("Invalid map behavior: " + dependencyValues.behavior);
          validBehavior = false;
        }

        return { newValues: { validBehavior } };
      }
    }

    stateVariableDefinitions.readyToExpand = {

      returnDependencies: () => ({
        validBehavior: {
          dependencyType: "stateVariable",
          variableName: "validBehavior",
        }
      }),
      // when this state variable is marked stale
      // it indicates we should update replacement
      // For this to work, must get value in replacement functions
      // so that the variable is marked fresh
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        // even with invalid behavior, still ready to expand
        // (it will just expand with zero replacements)
        return { newValues: { readyToExpand: true } };
      },
    };

    return stateVariableDefinitions;

  }

  static createSerializedReplacements({ component, workspace, componentInfoObjects }) {

    // console.log(`create serialized replacements for ${component.componentName}`);

    // evaluate readyToExpand so that it is marked fresh,
    // as it being marked stale triggers replacement update
    component.stateValues.readyToExpand;

    if (!component.stateValues.validBehavior) {
      workspace.lastReplacementParameters = {
        substitutionsNames: [],
        substitutionsChildNames: [],
        behavior: undefined,
        nIterates: undefined,
        minNIterates: undefined,
      }
      return { replacements: [] };
    }

    workspace.lastReplacementParameters = {
      substitutionsNames: component.stateValues.substitutionsNames,
      substitutionsChildNames: component.stateValues.substitutionsChildNames,
      behavior: component.stateValues.behavior,
      nIterates: component.stateValues.nIterates,
      minNIterates: component.stateValues.minNIterates,
      replacementsToWithhold: 0,
      withheldSubstitutionChildNames: [],
    }


    let replacements = [];

    if (component.stateValues.behavior === "parallel") {
      for (let iter = 0; iter < component.stateValues.minNIterates; iter++) {
        replacements.push(
          ...this.parallelReplacement({ component, iter, componentInfoObjects })
        );
      }
    } else {
      //behavior is combination
      // A better solution here?
      // https://stackoverflow.com/a/51470002
      let results = this.recurseThroughCombinations({
        component,
        substitutionsNumber: 0,
        iterateNumber: -1,
        componentInfoObjects
      });
      replacements = results.replacements;

    }

    let nAssignNames = 0;
    if (component.doenetAttributes.assignNames) {
      nAssignNames = component.doenetAttributes.assignNames.length;
    }
    let nReplacements = replacements.length;

    if (nAssignNames > nReplacements) {
      let empties = this.createEmptiesFromTemplate({
        nEmptiesToAdd: nAssignNames - nReplacements,
        firstInd: nReplacements,
        assignNames: component.doenetAttributes.assignNames,
        parentName: component.componentName,
        parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
        componentInfoObjects,
        additionalArgs: {
          template: component.stateValues.template
        }
      });
      replacements.push(...empties);

      workspace.nEmptiesAdded = empties.length;

    } else {
      workspace.nEmptiesAdded = 0;
    }


    // console.log(`replacements of map`)
    // console.log(JSON.parse(JSON.stringify(replacements)));
    return { replacements };
  }

  static parallelReplacement({ component, iter, componentInfoObjects }) {

    let replacements = [deepClone(component.stateValues.template)];

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
      componentInfoObjects,
      indOffset: iter,
      addEmpties: false,
    });

    replacements = processResult.serializedComponents;

    replacements[0].doenetAttributes.pushSharedParameters = [
      {
        parameterName: "substitutionsInfo",
        value: component.stateValues.substitutionsNames.map(x => ({
          name: x,
          childNumber: iter
        })),
      },
      {
        parameterName: "substitutionsChildIndices",
        value: Array(component.stateValues.nSubstitutions).fill(iter + 1),
      }
    ];

    return replacements;

  }

  static createEmptiesFromTemplate({ nEmptiesToAdd, firstInd,
    assignNames, parentName, parentCreatesNewNamespace,
    componentInfoObjects, additionalArgs
  }) {
    let setToEmptyAndDeleteUnreachable = function (comps) {
      for (let i = comps.length - 1; i >= 0; i--) {
        let comp = comps[i];
        // Since these empties are just for creating names,
        // delete component if it has an unreachable name
        // unless it assignNames.
        let deleteComp = true;
        if (comp.doenetAttributes) {
          if (comp.doenetAttributes.assignNames) {
            deleteComp = false;
          } else {
            let cName = comp.componentName;
            if (cName) {
              let lastSlash = cName.lastIndexOf("/");
              cName = cName.slice(lastSlash + 1);
              if (cName.slice(0, 2) !== "__") {
                deleteComp = false;
              }
            }
          }
        }
        if (deleteComp) {
          comps.splice(i, 1);
        } else {
          comp.componentType = "empty";
          if (comp.children) {
            setToEmptyAndDeleteUnreachable(comp.children);
          }
        }
      }
    };

    let empties = [];

    for (let i = 0; i < nEmptiesToAdd; i++) {
      empties.push(deepClone(additionalArgs.template));
    }

    let processResult = processAssignNames({
      assignNames,
      serializedComponents: empties,
      parentName,
      parentCreatesNewNamespace,
      componentInfoObjects,
      indOffset: firstInd,
      addEmpties: false,
    });

    empties = processResult.serializedComponents;

    for (let i = 0; i < nEmptiesToAdd; i++) {
      empties[i].componentType = "empty";
      if (empties[i].children) {
        setToEmptyAndDeleteUnreachable(empties[i].children);
      }
    }

    return empties;
  }

  static returnEmptiesFunctionAndAdditionalArgs(component) {
    return {
      createEmptiesFunction: this.createEmptiesFromTemplate,
      additionalArgs: {
        template: component.stateValues.template
      }
    }
  }

  static recurseThroughCombinations({ component, substitutionsNumber,
    childnumberArray = [], iterateNumber, componentInfoObjects }) {
    let replacements = [];
    let newChildnumberArray = [...childnumberArray, 0];

    for (let iter = 0; iter < component.stateValues.nIterates[substitutionsNumber]; iter++) {
      newChildnumberArray[substitutionsNumber] = iter;
      if (substitutionsNumber >= component.stateValues.nSubstitutions - 1) {
        iterateNumber++;

        let processResult = processAssignNames({
          assignNames: component.doenetAttributes.assignNames,
          serializedComponents: [deepClone(component.stateValues.template)],
          parentName: component.componentName,
          parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
          componentInfoObjects,
          indOffset: iterateNumber,
          addEmpties: false,
        });

        let thisRepl = processResult.serializedComponents[0];

        thisRepl.doenetAttributes.pushSharedParameters = [
          {
            parameterName: "substitutionsInfo",
            value: component.stateValues.substitutionsNames.map((x, i) => ({
              name: x,
              childNumber: newChildnumberArray[i]
            })),
          },
          {
            parameterName: "substitutionsChildIndices",
            value: newChildnumberArray.map(i => i + 1),
          }
        ];

        replacements.push(thisRepl)

      } else {
        let results = this.recurseThroughCombinations({
          component,
          substitutionsNumber: substitutionsNumber + 1,
          childnumberArray: newChildnumberArray,
          iterateNumber,
          componentInfoObjects
        });
        replacements.push(...results.replacements);
        iterateNumber = results.iterateNumber
      }
    }

    return { replacements, iterateNumber };
  }

  static calculateReplacementChanges({ component, components, workspace, componentInfoObjects }) {

    // console.log(`calculate replacement changes for ${component.componentName}`)

    // evaluate readyToExpand so that it is marked fresh,
    // as it being marked stale triggers replacement update
    component.stateValues.readyToExpand;

    let replacementChanges = [];

    // if invalid behavior, have no replacements
    if (!component.stateValues.validBehavior) {

      workspace.lastReplacementParameters = {
        substitutionsNames: [],
        substitutionsChildNames: [],
        behavior: undefined,
        nIterates: undefined,
        minNIterates: undefined,
        replacementsToWithhold: 0,
        withheldSubstitutionChildNames: [],
      }

      if (component.replacements.length > 0) {
        let replacementInstruction = {
          changeType: "delete",
          changeTopLevelReplacements: true,
          firstReplacementInd: 0,
          numberReplacementsToDelete: component.replacements.length,
          replacementsToWithhold: 0,
        }

        replacementChanges.push(replacementInstruction);
      }
      return replacementChanges;
    }


    let lrp = workspace.lastReplacementParameters;
    let recreateReplacements = false;

    let allSameSubstitutionsNames = true;

    if (component.stateValues.nSubstitutions !== lrp.substitutionsNames.length) {
      allSameSubstitutionsNames = false;
    }
    else {
      for (let ind = 0; ind < component.stateValues.nSubstitutions; ind++) {
        if (component.stateValues.substitutionsNames[ind] !== lrp.substitutionsNames[ind]) {
          allSameSubstitutionsNames = false;
          break;
        }
      }
    }


    // if substitutions names or behavior changed,
    // need to recalculate all replacements

    if (!allSameSubstitutionsNames || lrp.behavior !== component.stateValues.behavior) {
      recreateReplacements = true;
    } else {
      // same substitution names and behavior

      let allSameChildSubstitutionNames = true;

      if (lrp.nIterates === undefined) {
        recreateReplacements = true;
      } else {
        for (let ind = 0; ind < component.stateValues.nSubstitutions; ind++) {
          let currentNIters = component.stateValues.nIterates[ind];
          let prevNIters = lrp.nIterates[ind];
          if (currentNIters !== prevNIters) {
            allSameChildSubstitutionNames = false;
          }
          let minNiters = Math.min(currentNIters, prevNIters);
          for (let ind2 = 0; ind2 < minNiters; ind2++) {
            if (component.stateValues.substitutionsChildNames[ind][ind2] !=
              lrp.substitutionsChildNames[ind][ind2]
            ) {
              recreateReplacements = true;
              allSameChildSubstitutionNames = false;
              break;
            }
          }
          if (recreateReplacements) {
            break;
          }
        }
      }

      if (allSameChildSubstitutionNames) {
        // if all childSubstitutionNames are unchanged, don't do anything
        return [];
      }

      // for combinations with more than one substitution,
      // just recreate everything if iterates have changed
      // TODO: actually calculate changes in this case rather than completely redoing
      if (component.stateValues.behavior === "combination" &&
        component.stateValues.nSubstitutions > 1
      ) {
        recreateReplacements = true;
      }
    }

    if (recreateReplacements) {
      let newSerializedReplacements = this.createSerializedReplacements({
        component, workspace, componentInfoObjects
      }).replacements;

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        serializedReplacements: newSerializedReplacements,
        replacementsToWithhold: 0,
      };

      replacementChanges.push(replacementInstruction);

      workspace.lastReplacementParameters = {
        substitutionsNames: component.stateValues.substitutionsNames,
        substitutionsChildNames: component.stateValues.substitutionsChildNames,
        behavior: component.stateValues.behavior,
        nIterates: component.stateValues.nIterates,
        minNIterates: component.stateValues.minNIterates,
        replacementsToWithhold: 0,
        withheldSubstitutionChildNames: [],
      }

      return replacementChanges;

    }

    // parallel or combination with just one substitutions (which behaves as parallel)

    let currentMinNIterates = component.stateValues.minNIterates;
    let prevMinNIterates = lrp.minNIterates;
    let newReplacementsToWithhold = 0;
    let currentReplacementsToWithhold = component.replacementsToWithhold;
    if (!currentReplacementsToWithhold) {
      currentReplacementsToWithhold = 0;
    }
    let withheldSubstitutionChildNames = lrp.withheldSubstitutionChildNames;

    // Check if any previous substitution child names 
    // or any previously withheld child names
    // correspond to components that are now deleted

    let foundDeletedSubstitutionsChild = false;
    if (currentMinNIterates < prevMinNIterates) {
      for (let ind = 0; ind < component.stateValues.nSubstitutions; ind++) {
        for (let ind2 = currentMinNIterates; ind2 < prevMinNIterates; ind2++) {
          if (components[lrp.substitutionsChildNames[ind][ind2]] === undefined) {
            foundDeletedSubstitutionsChild = true;
          }
        }
      }

      if (!foundDeletedSubstitutionsChild) {
        // check if any of the previously withheld substitutionChildNames are deleted
        for (let nameArray of lrp.withheldSubstitutionChildNames) {
          for (let name of nameArray) {
            if (components[name] === undefined) {
              foundDeletedSubstitutionsChild = true;
            }
          }
        }
      }

    }

    if (foundDeletedSubstitutionsChild) {
      // delete all the extra replacements 
      let firstReplacementToDelete = Math.min(currentMinNIterates, prevMinNIterates);
      let numberReplacementsToDelete = component.replacements.length - firstReplacementToDelete;
      let replacementInstruction = {
        changeType: "delete",
        changeTopLevelReplacements: true,
        firstReplacementInd: firstReplacementToDelete,
        numberReplacementsToDelete,
        replacementsToWithhold: 0,
      };
      replacementChanges.push(replacementInstruction);

      withheldSubstitutionChildNames = [];
      currentReplacementsToWithhold = 0;

    }


    // if have fewer iterates than before
    // mark old replacements as hidden
    // unless one of the former substitutions child names does not exist
    if (currentMinNIterates < prevMinNIterates) {

      if (!foundDeletedSubstitutionsChild) {
        // since use number of replacements directly, it accounts for empties
        newReplacementsToWithhold = component.replacements.length - currentMinNIterates;

        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);

        for (let ind = 0; ind < component.stateValues.nSubstitutions; ind++) {
          let withheldNames = lrp.withheldSubstitutionChildNames[ind];
          if (withheldNames) {
            withheldNames = [...withheldNames];
          } else {
            withheldNames = [];
          }
          withheldNames = new Set([...lrp.substitutionsChildNames[ind].slice(currentMinNIterates), ...withheldNames]);

          withheldSubstitutionChildNames[ind] = withheldNames;

        }
      }
    } else if (currentMinNIterates > prevMinNIterates) {

      let numReplacementsToAdd = currentMinNIterates - prevMinNIterates;

      if (currentReplacementsToWithhold > 0) {
        let nonEmptiesWithheld = currentReplacementsToWithhold;
        if (workspace.nEmptiesAdded) {
          nonEmptiesWithheld -= workspace.nEmptiesAdded;
        }
        if (nonEmptiesWithheld >= numReplacementsToAdd) {
          newReplacementsToWithhold = currentReplacementsToWithhold -
            numReplacementsToAdd;
          numReplacementsToAdd = 0;

          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: newReplacementsToWithhold,
          };
          replacementChanges.push(replacementInstruction);

        } else {
          numReplacementsToAdd -= nonEmptiesWithheld;
          prevMinNIterates += nonEmptiesWithheld;
          newReplacementsToWithhold = 0;
          // don't need to send changedReplacementsToWithold instructions
          // since will send add instructions,
          // which will also recalculate replacements in parent
        }
      }

      if (numReplacementsToAdd > 0) {

        let replacements = [];

        for (let iter = prevMinNIterates; iter < currentMinNIterates; iter++) {
          replacements.push(
            ...this.parallelReplacement({ component, iter, componentInfoObjects })
          );
        }

        let nAssignNames = 0;
        if (component.doenetAttributes.assignNames) {
          nAssignNames = component.doenetAttributes.assignNames.length;
        }
        let nReplacements = replacements.length + prevMinNIterates;

        let newNEmptiesAdded = 0;

        if (nAssignNames > nReplacements) {
          let empties = this.createEmptiesFromTemplate({
            nEmptiesToAdd: nAssignNames - nReplacements,
            firstInd: nReplacements,
            assignNames: component.doenetAttributes.assignNames,
            parentName: component.componentName,
            parentCreatesNewNamespace: component.doenetAttributes.newNamespace,
            componentInfoObjects,
            additionalArgs: {
              template: component.stateValues.template
            }
          });
          replacements.push(...empties);

          newNEmptiesAdded = empties.length;

        }

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevMinNIterates,
          numberReplacementsToReplace: workspace.nEmptiesAdded,
          serializedReplacements: replacements,
          replacementsToWithhold: 0,
          assignNamesOffset: prevMinNIterates,
        }
        replacementChanges.push(replacementInstruction);
        workspace.nEmptiesAdded = newNEmptiesAdded;

      }
    }


    workspace.lastReplacementParameters = {
      substitutionsNames: component.stateValues.substitutionsNames,
      substitutionsChildNames: component.stateValues.substitutionsChildNames,
      behavior: component.stateValues.behavior,
      nIterates: component.stateValues.nIterates,
      minNIterates: currentMinNIterates,
      replacementsToWithhold: newReplacementsToWithhold,
      withheldSubstitutionChildNames,
    }

    // console.log("replacementChanges");
    // console.log(replacementChanges);
    return replacementChanges;
  }

  static determineNumberOfUniqueVariants({ serializedComponent }) {
    // TODO: if template has only one unique variant
    // could treat as a normal component
    return { success: false };
  }

  get allPotentialRendererTypes() {

    let allPotentialRendererTypes = [];

    for (let childName in this.allChildren) {
      let child = this.allChildren[childName].component;
      for (let rendererType of child.allPotentialRendererTypes) {
        if (!allPotentialRendererTypes.includes(rendererType)) {
          allPotentialRendererTypes.push(rendererType);
        }
      }
    }

    if (this.replacements) {
      for (let replacement of this.replacements) {
        for (let rendererType of replacement.allPotentialRendererTypes) {
          if (!allPotentialRendererTypes.includes(rendererType)) {
            allPotentialRendererTypes.push(rendererType);
          }
        }

      }
    }

    return allPotentialRendererTypes;

  }

}
