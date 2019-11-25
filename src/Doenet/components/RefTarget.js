import BaseComponent from './abstract/BaseComponent';

export default class RefTarget extends BaseComponent {
  static componentType = "reftarget";

  static takesComponentName = true;
  static stateVariableForTakingComponentName = 'refTargetName';

  static createPropertiesObject() {
    return {};
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    childLogic.newLeaf({
      name: 'atMostOneString',
      comparison: 'atMost',
      componentType: 'string',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.refTargetName = {
      returnDependencies: () => ({
        stringChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneString",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.stringChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              refTargetName: { variablesToCheck: "refTargetName" }
            }
          }
        }
        return { newValues: { refTargetName: dependencyValues.stringChild[0].stateValues.value } }
      },
    };

    stateVariableDefinitions.refTarget = {
      stateVariablesDeterminingDependencies: ["refTargetName"],
      returnDependencies: ({ stateValues }) => ({
        refTargetComponent: {
          dependencyType: "componentIdentity",
          componentName: stateValues.refTargetName,
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { refTarget: dependencyValues.refTargetComponent } }
      },
    };

    return stateVariableDefinitions;

  }


  useChildrenForReference = false;

  get stateVariablesForReference() {
    return ["refTargetName"];
  }

  returnSerializeInstructions() {
    return { skipChildren: true, stateVariables: ["refTargetName"] };
  }

}