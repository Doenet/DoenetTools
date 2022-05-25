import BaseComponent from './abstract/BaseComponent';

export default class DataFrame extends BaseComponent {
  static componentType = "dataFrame";
  static rendererType = undefined;

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    attributes.cid = {
      createComponentOfType: "text",
      createStateVariable: "cid",
      defaultValue: null,
      public: true,
    };

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.fileContents = {
      stateVariablesDeterminingDependencies: ["cid"],
      returnDependencies: ({stateValues}) => ({
        fileContents: {
          dependencyType: "file",
          cid: stateValues.cid,
          fileType: "csv"
        },
      }),
      definition: function ({ dependencyValues }) {

        return { setValue: { fileContents: dependencyValues.fileContents } };
      },

    }



    return stateVariableDefinitions;

  }


}