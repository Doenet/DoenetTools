import CompositeComponent from './abstract/CompositeComponent';
import { postProcessCopy } from '../utils/copy';
import ComponentSize from './abstract/ComponentSize';

export default class ConditionalContent extends CompositeComponent {
  static componentType = "conditionalcontent";

  static createPropertiesObject() {
    let properties = super.createPropertiesObject();
    delete properties.hide;
    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneCondition = childLogic.newLeaf({
      name: "atMostOneCondition",
      componentType: 'condition',
      comparison: 'atMost',
      number: 1,
      allowSpillover: false,
    });

    let atLeastZeroAnything = childLogic.newLeaf({
      name: "atLeastZeroAnything",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "ifAndRest",
      operator: "and",
      propositions: [atMostOneCondition, atLeastZeroAnything],
      setAsBase: true,
    })

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.hide = {
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneCondition",
          variableNames: ["conditionSatisfied"],
        },
      }),
      definition: function ({ dependencyValues }) {

        let hide;
        if (dependencyValues.conditionChild.length === 0) {
          hide = true;
        } else {
          hide = !dependencyValues.conditionChild[0].stateValues.conditionSatisfied;
        }

        return { newValues: { hide } }
      }
    };

    stateVariableDefinitions.replacementClasses = {
      returnDependencies: () => ({
        hide: {
          dependencyType: "stateVariable",
          variableName: "hide",
        },
        anyChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroAnything"
        }
      }),
      definition({ dependencyValues, componentInfoObjects }) {
        let replacementClasses = [];

        if (!dependencyValues.hide) {
          replacementClasses = dependencyValues.anyChildren.map(
            x => componentInfoObjects.allComponentClass[x.componentType]
          )
        }

        return { newValues: { replacementClasses } };

      }
    }

    stateVariableDefinitions.readyToExpand = {
      returnDependencies: () => ({
        replacementClasses: {
          dependencyType: "stateVariable",
          variableName: "replacementClasses"
        },
        needsReplacementsUpdatedWhenStale: {
          dependencyType: "stateVariable",
          variableName: "needsReplacementsUpdatedWhenStale",
        },
      }),
      definition() {
        return { newValues: { readyToExpand: true } }
      }
    }

    stateVariableDefinitions.conditionName = {
      returnDependencies: () => ({
        conditionChild: {
          dependencyType: "childIdentity",
          childLogicName: "atMostOneCondition",
        },
      }),
      definition: function ({ dependencyValues }) {

        let conditionName;
        if (dependencyValues.conditionChild.length === 1) {
          conditionName = dependencyValues.conditionChild[0].componentName;
        }

        return { newValues: { conditionName } }
      }
    };


    stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
      returnDependencies: () => ({
        hide: {
          dependencyType: "stateVariable",
          variableName: "hide",
        },
      }),
      // the whole point of this state variable is to return updateReplacements
      // on mark stale
      markStale: () => ({ updateReplacements: true }),
      definition: () => ({ newValues: { needsReplacementsUpdatedWhenStale: true } })
    }

    return stateVariableDefinitions;
  }

  static createSerializedReplacements({ component, workspace }) {

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    workspace.previouslyHidden = component.stateValues.hide;

    if (component.stateValues.hide) {
      return { replacements: [] };
    }

    let serializedChildrenCopy = component.activeChildren
      .filter(x => x.componentName !== component.stateValues.conditionName)
      .map(
        x => x.serialize({ forCopy: true })
      );


    if (!workspace.uniqueIdentifiersUsed) {
      workspace.uniqueIdentifiersUsed = []
    }

    return {
      replacements: postProcessCopy({
        serializedComponents: serializedChildrenCopy,
        componentName: component.componentName,
        uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
      })
    };

  }

  static calculateReplacementChanges({ component, componentChanges, components, workspace }) {

    // evaluate needsReplacementsUpdatedWhenStale to make it fresh
    component.stateValues.needsReplacementsUpdatedWhenStale;

    if (component.stateValues.hide) {
      if (workspace.previouslyHidden) {
        return [];
      } else {

        workspace.previouslyHidden = true;

        let replacementsToWithhold = component.replacements.length;
        let replacementInstruction = {
          changeType: "changeReplacementsToWithhold",
          replacementsToWithhold,
        };

        return [replacementInstruction];

      }
    }

    if (!workspace.previouslyHidden) {
      return [];
    }

    workspace.previouslyHidden = false;

    let childrenToCopy = component.activeChildren
      .filter(x => x.componentName !== component.stateValues.conditionName);

    if (component.replacements.length === childrenToCopy.length) {
      // just stop withholding replacements
      let replacementInstruction = {
        changeType: "changeReplacementsToWithhold",
        replacementsToWithhold: 0,
      };

      return [replacementInstruction];

    }

    // create new replacements

    let serializedChildrenCopy = childrenToCopy.map(
      x => x.serialize({ forCopy: true })
    );

    if (!workspace.uniqueIdentifiersUsed) {
      workspace.uniqueIdentifiersUsed = []
    }

    let serializedReplacements = postProcessCopy({
      serializedComponents: serializedChildrenCopy,
      componentName: component.componentName,
      uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed
    })

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      replacementsToWithhold: 0,
      serializedReplacements: serializedReplacements,
    };

    return [replacementInstruction];

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

    return allPotentialRendererTypes;

  }

}
