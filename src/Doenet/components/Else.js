import BaseComponent from './abstract/BaseComponent';
import { deepClone } from '../utils/deepFunctions';

export default class Else extends BaseComponent {
  static componentType = "else";
  static rendererType = undefined;

  // used when referencing this component without prop
  static useChildrenForReference = false;

  static keepChildrenSerialized({ serializedComponent, componentInfoObjects }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    return Object.keys(serializedComponent.children);

  }

  static createPropertiesObject(args) {
    return {};
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.childrenWhenSelected = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
          doNotProxy: true
        },
      }),
      definition: function ({ dependencyValues }) {

        return {
          newValues: {
            childrenWhenSelected: deepClone(dependencyValues.serializedChildren),
          }
        }
      }
    }

    return stateVariableDefinitions;
  }

}
