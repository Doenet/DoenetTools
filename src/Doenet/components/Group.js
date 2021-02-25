import BaseComponent from './abstract/BaseComponent';
import { deepClone } from '../utils/deepFunctions';

export default class Group extends BaseComponent {
  static componentType = "group";

  static rendererType = "container";

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'anyNonString',
      componentType: '_base',
      excludeComponentTypes: ["string"],
      comparison: 'atLeast',
      number: 0,
      setAsBase: true,
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        children: {
          dependencyType: "child",
          childLogicName: "anyNonString"
        }
      }),
      definition({ dependencyValues }) {
        return {
          newValues: {
            childrenToRender: dependencyValues.children.map(x => x.componentName)
          }
        };
      }
    }

    return stateVariableDefinitions;
  }

}
