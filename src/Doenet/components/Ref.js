import InlineComponent from './abstract/InlineComponent';

export default class Ref extends InlineComponent {
  static componentType = "ref";

  static includeBlankStringChildren = true;

  // static previewSerializedComponent({ serializedComponent, sharedParameters, components }) {
  //   if (serializedComponent.children === undefined) {
  //     return;
  //   }

  //   // TODO: what is this for?  Do we need to keep it?
  //   for (let child of serializedComponent.children) {
  //     if (child.componentType === "text") {
  //       if (child.doenetAttributes !== undefined && child.doenetAttributes.createdFromProperty) {
  //         // found a text that was given as a property
  //         // change it to a texttype
  //         child.componentType = "texttype";
  //       }
  //       break;
  //     }
  //   }
  // }

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.texttype = { default: "type-global" };
    properties.uri = { default: null, forRenderer: true }
    properties.type = { default: null, forRenderer: true }
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atMostOneTname = childLogic.newLeaf({
      name: 'atMostOneTname',
      componentType: 'tname',
      comparison: "atMost",
      number: 1,
    });

    let atLeastZeroAnything = childLogic.newLeaf({
      name: "atLeastZeroAnything",
      componentType: '_base',
      comparison: 'atLeast',
      number: 0,
    });

    childLogic.newOperator({
      name: "tnameAndText",
      operator: "and",
      propositions: [atMostOneTname, atLeastZeroAnything],
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.targetComponent = {
      returnDependencies: () => ({
        tnameChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneTname",
          variableNames: ["targetComponent"],
        },
      }),
      defaultValue: null,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.tnameChild.length === 0) {
          return {
            useEssentialOrDefaultValue: {
              targetComponent: { variablesToCheck: "targetComponent" }
            }
          }
        }
        return { newValues: { targetComponent: dependencyValues.tnameChild[0].stateValues.targetComponent } }
      },
    };


    stateVariableDefinitions.targetName = {
      forRenderer: true,
      returnDependencies: () => ({
        targetComponent: {
          dependencyType: "stateVariable",
          variableName: "targetComponent",
        },
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri"
        }
      }),
      definition: function ({ dependencyValues }) {
        if (dependencyValues.targetComponent === null) {
          return { newValues: { targetName: "" } }
        } else {
          if (dependencyValues.uri !== null) {
            console.warn("Haven't implemented ref with uri and tname, ignoring tname.");
            return { newValues: { targetName: "" } }
          }
          return { newValues: { targetName: dependencyValues.targetComponent.componentName } }
        }
      },
    };

    stateVariableDefinitions.contentId = {
      returnDependencies: () => ({
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri"
        }
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.uri !== null) {

          let result = dependencyValues.uri.match(/^\s*doenet\s*:\s*(\S*)\s*$/i);

          if (result !== null) {
            return {
              newValues: {
                contentId: result[1]
              }
            }
          }

        }

        return { newValues: { contentId: null } }
      }
    }

    stateVariableDefinitions.linkText = {
      public: true,
      componentType: "text",
      forRenderer: true,
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroAnything",
          variableNames: ["text"],
          variablesOptional: true
        },
        uri: {
          dependencyType: "stateVariable",
          variableName: "uri"
        }
      }),
      definition: function ({ dependencyValues }) {
        let linkText = "";
        if (dependencyValues.inlineChildren.length === 0) {
          if (dependencyValues.uri !== null) {
            linkText = dependencyValues.uri;
          }
        } else {
          for (let child of dependencyValues.inlineChildren) {
            if (typeof child.stateValues.text === "string") {
              linkText += child.stateValues.text;
            }
          }
        }
        return { newValues: { linkText } }
      }
    }


    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        inlineChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroAnything"
        }
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues:
            { childrenToRender: dependencyValues.inlineChildren.map(x => x.componentName) }
        };
      }
    }

    return stateVariableDefinitions;

  }

}