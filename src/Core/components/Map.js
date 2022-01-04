import CompositeComponent from './abstract/CompositeComponent';
import { deepClone } from '../utils/deepFunctions';
import { processAssignNames } from '../utils/serializedStateProcessing';
import { convertAttributesForComponentType } from '../utils/copy';

export default class Map extends CompositeComponent {
  static componentType = "map";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.assignNamesSkip = {
      createPrimitiveOfType: "number"
    }
    attributes.behavior = {
      createComponentOfType: "text",
      createStateVariable: "behavior",
      defaultValue: "combination",
      public: true,
      trim: true,
    };
    attributes.isResponse = {
      leaveRaw: true,
    }

    return attributes;
  }

  static returnChildGroups() {

    return [{
      group: "templates",
      componentTypes: ["template"]
    }, {
      group: "sources",
      componentTypes: ["sources"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.nSources = {
      additionalStateVariablesDefined: ["sourcesNames", "sourceAliases", "sourceIndexAliases"],
      returnDependencies: () => ({
        sourcesChildren: {
          dependencyType: "child",
          childGroups: ["sources"],
          variableNames: ["alias", "indexAlias"]
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            nSources: dependencyValues.sourcesChildren.length,
            sourcesNames: dependencyValues.sourcesChildren.map(x => x.componentName),
            sourceAliases: dependencyValues.sourcesChildren.map(x => x.stateValues.alias),
            sourceIndexAliases: dependencyValues.sourcesChildren.map(x => x.stateValues.indexAlias),
          }
        }
      },
    };

    stateVariableDefinitions.nIterates = {
      additionalStateVariablesDefined: ["minNIterates", "sourcesChildNames"],
      returnDependencies: () => ({
        sourcesChildren: {
          dependencyType: "child",
          childGroups: ["sources"],
          variableNames: ["numberOfChildren", "childComponentNames"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let nIterates = dependencyValues.sourcesChildren.map(x => x.stateValues.numberOfChildren);

        // calculate scalar minNIterates, a scalar holding the minimum value
        let minNIterates = Math.min(...nIterates);

        let sourcesChildNames = dependencyValues.sourcesChildren.map(x => [...x.stateValues.childComponentNames]);

        return { newValues: { nIterates, minNIterates, sourcesChildNames } };
      }

    }


    stateVariableDefinitions.template = {
      returnDependencies: () => ({
        templateChild: {
          dependencyType: "child",
          childGroups: ["templates"],
          variableNames: ["serializedChildren", "newNamespace"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let templateChild = dependencyValues.templateChild[0];
        if (!templateChild) {
          return {
            newValues: { template: null }
          }
        }
        let childrenOfTemplate = templateChild.stateValues.serializedChildren;
        let template = {
          componentType: "template",
          state: { rendered: true },
          children: childrenOfTemplate,
          originalName: templateChild.componentName,
        }
        if (templateChild.stateValues.newNamespace) {
          template.attributes = { newNamespace: { primitive: true } }
        }
        return {
          newValues: {
            template
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
          // display warning if some sources activeChildren have differ numbers of iterates
          if (dependencyValues.nIterates.slice(1).some(x => x != dependencyValues.nIterates[0])) {
            console.warn("Warning: map with parallel behavior and different numbers of iterates in sources activeChildren." +
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
      // when this state variable is marked stale
      // it indicates we should update replacement
      // For this to work, must get value in replacement functions
      // so that the variable is marked fresh
      markStale: () => ({ updateReplacements: true }),
      definition: function () {
        // even with invalid behavior, still ready to expand
        // (it will just expand with zero replacements)
        return { newValues: { readyToExpandWhenResolved: true } };
      },
    };

    return stateVariableDefinitions;

  }

  static async createSerializedReplacements({ component, workspace, componentInfoObjects, flags }) {

    // console.log(`create serialized replacements for ${component.componentName}`);

    if (!await component.stateValues.validBehavior) {
      workspace.lastReplacementParameters = {
        sourcesNames: [],
        sourcesChildNames: [],
        behavior: undefined,
        nIterates: undefined,
        minNIterates: undefined,
      }
      return { replacements: [] };
    }

    workspace.lastReplacementParameters = {
      sourcesNames: await component.stateValues.sourcesNames,
      sourcesChildNames: await component.stateValues.sourcesChildNames,
      behavior: await component.stateValues.behavior,
      nIterates: await component.stateValues.nIterates,
      minNIterates: await component.stateValues.minNIterates,
      replacementsToWithhold: 0,
      withheldSubstitutionChildNames: [],
    }


    let replacements = [];

    if (await component.stateValues.behavior === "parallel") {
      for (let iter = 0; iter < await component.stateValues.minNIterates; iter++) {
        replacements.push(
          ...await this.parallelReplacement({ component, iter, componentInfoObjects, flags })
        );
      }
    } else {
      //behavior is combination
      // A better solution here?
      // https://stackoverflow.com/a/51470002
      let results = await this.recurseThroughCombinations({
        component,
        sourcesNumber: 0,
        iterateNumber: -1,
        componentInfoObjects,
        flags
      });
      replacements = results.replacements;

    }


    // console.log(`replacements of map`)
    // console.log(JSON.parse(JSON.stringify(replacements)));
    return { replacements };
  }

  static async parallelReplacement({ component, iter, componentInfoObjects, flags }) {

    let replacements = [deepClone(await component.stateValues.template)];
    let newNamespace = component.attributes.newNamespace?.primitive;


    if ("isResponse" in component.attributes) {
      // pass isResponse to replacements

      let attributesFromComposite = convertAttributesForComponentType({
        attributes: { isResponse: component.attributes.isResponse },
        componentType: repl.componentType,
        componentInfoObjects,
        compositeCreatesNewNamespace: newNamespace,
        flags
      })
      if (!replacements[0].attributes) {
        replacements[0].attributes = {};
      }

      Object.assign(replacements[0].attributes, attributesFromComposite)
    }

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
      indOffset: iter,
    });

    replacements = processResult.serializedComponents;

    await addSharedParameters(replacements[0], component, Array(await component.stateValues.nSources).fill(iter));

    return replacements;

  }


  static async recurseThroughCombinations({ component, sourcesNumber,
    childnumberArray = [], iterateNumber, componentInfoObjects, flags
  }) {
    let replacements = [];
    let newChildnumberArray = [...childnumberArray, 0];
    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let nIterates = await component.stateValues.nIterates;
    let nSources = await component.stateValues.nSources;
    let template = await component.stateValues.template;

    let compositeAttributesObj = this.createAttributesObject({ flags });

    for (let iter = 0; iter < nIterates[sourcesNumber]; iter++) {
      newChildnumberArray[sourcesNumber] = iter;
      if (sourcesNumber >= nSources - 1) {
        iterateNumber++;

        let serializedComponents = [deepClone(template)];

        // pass isResponse to template
        // (only isResponse will be copied, as it is only attribute with leaveRaw)

        let attributesFromComposite = {};

        attributesFromComposite = convertAttributesForComponentType({
          attributes: component.attributes,
          componentType: serializedComponents[0].componentType,
          componentInfoObjects,
          compositeAttributesObj,
          compositeCreatesNewNamespace: newNamespace,
          flags
        })

        if (!serializedComponents[0].attributes) {
          serializedComponents[0].attributes = {};
        }

        Object.assign(serializedComponents[0].attributes, attributesFromComposite)


        let processResult = processAssignNames({
          assignNames: component.doenetAttributes.assignNames,
          serializedComponents,
          parentName: component.componentName,
          parentCreatesNewNamespace: newNamespace,
          componentInfoObjects,
          indOffset: iterateNumber,
        });

        let thisRepl = processResult.serializedComponents[0];

        await addSharedParameters(thisRepl, component, newChildnumberArray);

        replacements.push(thisRepl)

      } else {
        let results = await this.recurseThroughCombinations({
          component,
          sourcesNumber: sourcesNumber + 1,
          childnumberArray: newChildnumberArray,
          iterateNumber,
          componentInfoObjects,
          flags
        });
        replacements.push(...results.replacements);
        iterateNumber = results.iterateNumber
      }
    }

    return { replacements, iterateNumber };
  }

  static async calculateReplacementChanges({ component, components, workspace, componentInfoObjects, flags }) {

    // console.log(`calculate replacement changes for ${component.componentName}`)

    let replacementChanges = [];

    // if invalid behavior, have no replacements
    if (!await component.stateValues.validBehavior) {

      workspace.lastReplacementParameters = {
        sourcesNames: [],
        sourcesChildNames: [],
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

    let allSameSourcesNames = true;

    let nSources = await component.stateValues.nSources;
    let sourcesNames = await component.stateValues.sourcesNames;

    if (nSources !== lrp.sourcesNames.length) {
      allSameSourcesNames = false;
    }
    else {
      for (let ind = 0; ind < nSources; ind++) {
        if (sourcesNames[ind] !== lrp.sourcesNames[ind]) {
          allSameSourcesNames = false;
          break;
        }
      }
    }


    // if sources names or behavior changed,
    // need to recalculate all replacements

    let nIterates = await component.stateValues.nIterates;
    let sourcesChildNames = await component.stateValues.sourcesChildNames;
    let behavior = await component.stateValues.behavior;

    if (!allSameSourcesNames || lrp.behavior !== await behavior) {
      recreateReplacements = true;
    } else {
      // same substitution names and behavior

      let allSameChildSubstitutionNames = true;

      if (lrp.nIterates === undefined) {
        recreateReplacements = true;
      } else {
        for (let ind = 0; ind < nSources; ind++) {
          let currentNIters = nIterates[ind];
          let prevNIters = lrp.nIterates[ind];
          if (currentNIters !== prevNIters) {
            allSameChildSubstitutionNames = false;
          }
          let minNiters = Math.min(currentNIters, prevNIters);
          for (let ind2 = 0; ind2 < minNiters; ind2++) {
            if (sourcesChildNames[ind][ind2] !=
              lrp.sourcesChildNames[ind][ind2]
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
      if (behavior === "combination" &&
        nSources > 1
      ) {
        recreateReplacements = true;
      }
    }

    if (recreateReplacements) {
      let newSerializedReplacements = await this.createSerializedReplacements({
        component, workspace, componentInfoObjects, flags
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
        sourcesNames,
        sourcesChildNames,
        behavior,
        nIterates,
        minNIterates: await component.stateValues.minNIterates,
        replacementsToWithhold: 0,
        withheldSubstitutionChildNames: [],
      }

      return replacementChanges;

    }

    // parallel or combination with just one sources (which behaves as parallel)

    let currentMinNIterates = await component.stateValues.minNIterates;
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

    let foundDeletedSourcesChild = false;
    if (currentMinNIterates < prevMinNIterates) {
      for (let ind = 0; ind < nSources; ind++) {
        for (let ind2 = currentMinNIterates; ind2 < prevMinNIterates; ind2++) {
          if (components[lrp.sourcesChildNames[ind][ind2]] === undefined) {
            foundDeletedSourcesChild = true;
          }
        }
      }

      if (!foundDeletedSourcesChild) {
        // check if any of the previously withheld substitutionChildNames are deleted
        for (let nameArray of lrp.withheldSubstitutionChildNames) {
          for (let name of nameArray) {
            if (components[name] === undefined) {
              foundDeletedSourcesChild = true;
            }
          }
        }
      }

    }

    if (foundDeletedSourcesChild) {
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
    // unless one of the former sources child names does not exist
    if (currentMinNIterates < prevMinNIterates) {

      if (!foundDeletedSourcesChild) {
        newReplacementsToWithhold = component.replacements.length - currentMinNIterates;

        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold: newReplacementsToWithhold,
        };
        replacementChanges.push(replacementInstruction);

        for (let ind = 0; ind < nSources; ind++) {
          let withheldNames = lrp.withheldSubstitutionChildNames[ind];
          if (withheldNames) {
            withheldNames = [...withheldNames];
          } else {
            withheldNames = [];
          }
          withheldNames = new Set([...lrp.sourcesChildNames[ind].slice(currentMinNIterates), ...withheldNames]);

          withheldSubstitutionChildNames[ind] = withheldNames;

        }
      }
    } else if (currentMinNIterates > prevMinNIterates) {

      let numReplacementsToAdd = currentMinNIterates - prevMinNIterates;

      if (currentReplacementsToWithhold > 0) {
        if (currentReplacementsToWithhold >= numReplacementsToAdd) {
          newReplacementsToWithhold = currentReplacementsToWithhold -
            numReplacementsToAdd;
          numReplacementsToAdd = 0;

          let replacementInstruction = {
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold: newReplacementsToWithhold,
          };
          replacementChanges.push(replacementInstruction);

        } else {
          numReplacementsToAdd -= currentReplacementsToWithhold;
          prevMinNIterates += currentReplacementsToWithhold;
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
            ...await this.parallelReplacement({ component, iter, componentInfoObjects, flags })
          );
        }

        let nAssignNames = 0;
        if (component.doenetAttributes.assignNames) {
          nAssignNames = component.doenetAttributes.assignNames.length;
        }

        let replacementInstruction = {
          changeType: "add",
          changeTopLevelReplacements: true,
          firstReplacementInd: prevMinNIterates,
          serializedReplacements: replacements,
          replacementsToWithhold: 0,
          assignNamesOffset: prevMinNIterates,
        }
        replacementChanges.push(replacementInstruction);

      }
    }


    workspace.lastReplacementParameters = {
      sourcesNames,
      sourcesChildNames,
      behavior,
      nIterates,
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

}


async function addSharedParameters(thisRepl, component, newChildnumberArray) {

  let addToPars = thisRepl.doenetAttributes.addToSharedParameters = [];
  let sourcesNames = await component.stateValues.sourcesNames;

  for (let [ind, alias] of (await component.stateValues.sourceAliases).entries()) {
    if (alias) {
      let sourcesName = sourcesNames[ind];

      addToPars.push({
        parameterName: "sourceNameMappings",
        key: alias,
        value: {
          name: sourcesName,
          childNumber: newChildnumberArray[ind]
        },
      })
    }

  }

  for (let [ind, indexAlias] of (await component.stateValues.sourceIndexAliases).entries()) {

    if (indexAlias) {
      addToPars.push({
        parameterName: "sourceIndexMappings",
        key: indexAlias,
        value: newChildnumberArray[ind] + 1,
      })

    }
  }

}

