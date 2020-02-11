import CompositeComponent from './abstract/CompositeComponent';

export default class Map extends CompositeComponent {
  static componentType = "map";

  static assignNamespacesToChildrenOf = ["template"];

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.behavior = { default: "combination" };
    return properties;
  }

  static returnChildLogic (args) {
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

    let stateVariableDefinitions = {};

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
        let template = dependencyValues.templateChild[0].stateValues.serializedChildren;
        let numberTemplateComponents = template.length;
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

    stateVariableDefinitions.readyToExpandWhenResolved = {

      returnDependencies: () => ({
        validBehavior: {
          dependencyType: "stateVariable",
          variableName: "validBehavior",
        }
      }),
      definition: function () {
        // even with invalid behavior, still ready to expand
        // (it will just expand with zero replacements)
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;

  }

  static createSerializedReplacements({ component, workspace }) {

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


    let replacementsWithInstructions = [];

    if (component.stateValues.behavior === "parallel") {
      for (let iter = 0; iter < component.stateValues.minNIterates; iter++) {
        replacementsWithInstructions.push(
          this.parallelReplacementsWithInstructions({ component, iter })
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
      });
      replacementsWithInstructions = results.replacementsWithInstructions;
    }


    return { replacementsWithInstructions };
  }

  static parallelReplacementsWithInstructions({ component, iter }) {
    let instruction1 = {
      operation: "pushSharedParameter",
      parameterName: "substitutionsInfo",
      value: component.stateValues.substitutionsNames.map(x => ({
        name: x,
        childNumber: iter
      })),
    };
    let instruction2 = {
      operation: "pushSharedParameter",
      parameterName: "substitutionsChildIndices",
      value: Array(component.stateValues.nSubstitutions).fill(iter + 1),
    };

    let namespace;
    let assignNamespaces = component.doenetAttributes.assignNamespaces;
    if (assignNamespaces !== undefined) {
      namespace = assignNamespaces[iter]
    }
    // Note: undefined namespace signals to core to create a unique unreachable namespace

    let instruction3 = {
      operation: "assignNamespace",
      namespace
    }
    return {
      instructions: [instruction1, instruction2, instruction3],
      replacements: component.stateValues.template
    }
  }

  static recurseThroughCombinations({ component, substitutionsNumber, childnumberArray = [], iterateNumber }) {
    let replacementsWithInstructions = [];
    let newChildnumberArray = [...childnumberArray, 0];

    for (let iter = 0; iter < component.stateValues.nIterates[substitutionsNumber]; iter++) {
      newChildnumberArray[substitutionsNumber] = iter;
      if (substitutionsNumber >= component.stateValues.nSubstitutions - 1) {
        iterateNumber++;
        let instruction1 = {
          operation: "pushSharedParameter",
          parameterName: "substitutionsInfo",
          value: component.stateValues.substitutionsNames.map((x, i) => ({
            name: x,
            childNumber: newChildnumberArray[i]
          })),
        };
        let instruction2 = {
          operation: "pushSharedParameter",
          parameterName: "substitutionsChildIndices",
          value: newChildnumberArray.map(i => i + 1),
        };

        let namespace;
        let assignNamespaces = component.doenetAttributes.assignNamespaces;
        if (assignNamespaces !== undefined) {
          namespace = assignNamespaces[iterateNumber]
        }

        // Note: undefined namespace signals to core to create a unique unreachable namespace

        let instruction3 = {
          operation: "assignNamespace",
          namespace
        }

        replacementsWithInstructions.push({
          instructions: [instruction1, instruction2, instruction3],
          replacements: component.stateValues.template
        });
      } else {
        let results = this.recurseThroughCombinations({
          component,
          substitutionsNumber: substitutionsNumber + 1,
          childnumberArray: newChildnumberArray,
          iterateNumber
        });
        replacementsWithInstructions.push(...results.replacementsWithInstructions);
        iterateNumber = results.iterateNumber
      }
    }

    return { replacementsWithInstructions, iterateNumber };
  }

  static calculateReplacementChanges({ component, components, workspace }) {

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
      let newSerializedReplacementsWithInstructions = this.createSerializedReplacements({ component, workspace }).replacementsWithInstructions;

      let replacementInstruction = {
        changeType: "add",
        changeTopLevelReplacements: true,
        firstReplacementInd: 0,
        numberReplacementsToReplace: component.replacements.length,
        replacementsWithInstructions: newSerializedReplacementsWithInstructions,
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
    // we know that any substitutionChildNames that 

    let currentMinNIterates = component.stateValues.minNIterates;
    let prevMinNIterates = lrp.minNIterates;
    let newReplacementsToWithhold = 0;
    let currentReplacementsToWithhold = component.replacementsToWithhold;
    if(!currentReplacementsToWithhold) {
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
      let firstReplacementToDelete = component.stateValues.numberTemplateComponents
        * Math.min(currentMinNIterates, prevMinNIterates);
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
        newReplacementsToWithhold = currentReplacementsToWithhold +
          (prevMinNIterates - currentMinNIterates) * component.stateValues.numberTemplateComponents;

        let replacementInstruction = {
          changeType: "changedReplacementsToWithhold",
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

      let numReplacementsToAdd = (currentMinNIterates - prevMinNIterates) * component.stateValues.numberTemplateComponents;

      if (currentReplacementsToWithhold > 0) {
        if (currentReplacementsToWithhold >= numReplacementsToAdd) {
          newReplacementsToWithhold = currentReplacementsToWithhold -
            numReplacementsToAdd;
          numReplacementsToAdd = 0;

          let replacementInstruction = {
            changeType: "changedReplacementsToWithhold",
            replacementsToWithhold: newReplacementsToWithhold,
          };
          replacementChanges.push(replacementInstruction);

        } else {
          numReplacementsToAdd -= currentReplacementsToWithhold;
          prevMinNIterates += Math.round(currentReplacementsToWithhold / component.stateValues.numberTemplateComponents);
          newReplacementsToWithhold = 0;
          // don't need to send changedReplacementsToWithold instructions
          // since will send add instructions,
          // which will also recalculate replacements in parent
        }
      }

      if (numReplacementsToAdd > 0) {

        let replacementsWithInstructions = [];

        for (let iter = prevMinNIterates; iter < currentMinNIterates; iter++) {
          replacementsWithInstructions.push(
            this.parallelReplacementsWithInstructions({ component, iter })
          );
        }

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevMinNIterates * component.stateValues.numberTemplateComponents,
          numberReplacementsToReplace: 0,
          replacementsWithInstructions: replacementsWithInstructions,
          replacementsToWithhold: newReplacementsToWithhold,
        }
        replacementChanges.push(replacementInstruction);
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

    // console.log(replacementChanges);
    return replacementChanges;
  }

  static determineNumberOfUniqueVariants({ serializedComponent }) {
    // TODO: if template has only one unique variant
    // could treat as a normal component
    return { success: false };
  }
}
