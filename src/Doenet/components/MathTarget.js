import BaseComponent from './abstract/BaseComponent';

export default class MathTarget extends BaseComponent {
  static componentType = "mathtarget";
  static rendererType = undefined;

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: "exactlyOneMath",
      componentType: 'math',
      number: 1,
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.mathChildName = {
      returnDependencies: () => ({
        mathChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneMath",
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            mathChildName: dependencyValues.mathChild[0].componentName
          }
        };
      },
    }

    return stateVariableDefinitions;

  }

}