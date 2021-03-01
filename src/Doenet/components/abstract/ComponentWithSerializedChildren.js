import BaseComponent from './BaseComponent';

export default class ComponentWithSerializedChildren extends BaseComponent {
  static componentType = "_componentwithserializedchildren";

  static createPropertiesObject() {
    return {};
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.serializedChildren = {
      returnDependencies: () => ({
        serializedChildren: {
          dependencyType: "serializedChildren",
        },
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { serializedChildren: dependencyValues.serializedChildren } };
      },
    };

    return stateVariableDefinitions;
  }

  static keepChildrenSerialized({ serializedComponent }) {
    if (serializedComponent.children === undefined) {
      return [];
    }

    return Object.keys(serializedComponent.children);

  }

}
