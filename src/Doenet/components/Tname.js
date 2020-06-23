import BaseComponent from './abstract/BaseComponent';

export default class Tname extends BaseComponent {
  static componentType = "tname";
  static rendererType = undefined;

  static takesComponentName = true;
  static stateVariableForTakingComponentName = 'targetName';

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["targetName"] };

  static createPropertiesObject() {
    return {};
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atMostOneString',
      comparison: 'atMost',
      componentType: 'string',
      number: 1,
      excludeCompositeReplacements: "true",
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetName = {
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
              targetName: { variablesToCheck: "targetName" }
            }
          }
        }
        return { newValues: { targetName: dependencyValues.stringChild[0].stateValues.value } }
      },
    };

    stateVariableDefinitions.targetComponent = {
      stateVariablesDeterminingDependencies: ["targetName"],
      returnDependencies: ({ stateValues }) => ({
        targetComponent: {
          dependencyType: "componentIdentity",
          componentName: stateValues.targetName,
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { targetComponent: dependencyValues.targetComponent } }
      },
    };

    return stateVariableDefinitions;

  }


  returnSerializeInstructions() {
    return { skipChildren: true, stateVariables: ["targetName"] };
  }

}