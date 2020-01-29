import BaseComponent from './BaseComponent';

export default class ComponentWithSelectableType extends BaseComponent {
  static componentType = "_componentwithselectabletype";

  static modifySharedParameters({ sharedParameters }) {
    // since sequence turns defaultToPrescribedParameters on,
    // turn it off here so it doesn't propagate further
    sharedParameters.defaultToPrescribedParameters = false;
  }

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.type = { default: undefined };
    return properties;
  }

  static returnChildLogic (args) {
    let childLogic = super.returnChildLogic(args);
    let standardComponentClasses = args.standardComponentClasses;

    function addType({ activeChildrenMatched, dependencyValues }) {

      let selectedType = dependencyValues.type;
      if (selectedType === undefined) {
        if (activeChildrenMatched.length === 1) {
          let child = activeChildrenMatched[0];
          if (child.componentType === "string") {
            let s = dependencyValues.stringChild[0].stateValues.value.trim();
            if (/^[a-zA-Z]+$/.test(s)) {
              selectedType = "letters";
            } else if (Number.isFinite(Number(s))) {
              selectedType = "number";
            } else {
              selectedType = "text";
            }
          } else {
            // have a single non-string child.
            // Don't match sugar: child will be matched by atMostOneChild.
            return { success: false };
          }
        } else {
          // have more than one child, but don't know what type to create
          return { success: false }
        }
      }


      // if already have a single child of the correct type
      // don't match sugar: child will be matched by atMostOneChild.
      if (activeChildrenMatched.length === 1 && activeChildrenMatched[0].componentType === selectedType) {
        return { success: false }
      }

      if (!(selectedType in standardComponentClasses)) {
        // if didn't get a valid type and component is string
        // set to selected type to text
        if (activeChildrenMatched.length === 1 && activeChildrenMatched[0].componentType === "string") {
          selectedType = 'text';
        } else {
          // else don't match sugar
          // which means
          // - if there is only one component, that will become the type
          // - if there are more than one component, child logic will fail
          return { success: false }
        }
      }

      let typeChildren = [];
      for (let child of activeChildrenMatched) {
        typeChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }

      return {
        success: true,
        newChildren: [{ componentType: selectedType, children: typeChildren }],
      }
    }

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: "string",
      comparison: "atLeast",
      number: 1
    });

    let atLeastOneNonString = childLogic.newLeaf({
      name: "atLeastOneNonStrings",
      componentType: "_base",
      comparison: "atLeast",
      excludeComponentTypes: ["_composite", "string"],
      number: 1
    });

    let anythingAsSugar = childLogic.newOperator({
      name: 'anythingAsSugar',
      operator: "or",
      propositions: [atLeastOneString, atLeastOneNonString],
      isSugar: true,
      sugarDependencies: {
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        },
        stringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastOneString",
          variableNames: ["value"],
        }
      },
      affectedBySugar: ["atMostOneChild"],
      replacementFunction: addType,
    });

    let atMostOneChild = childLogic.newLeaf({
      name: 'atMostOneChild',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'atMost',
      number: 1,
    });

    childLogic.newOperator({
      name: "sugarXorSelectedType",
      operator: "xor",
      propositions: [anythingAsSugar, atMostOneChild],
      setAsBase: true,
    })

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      returnDependencies: () => ({
        atMostOneChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneChild",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.atMostOneChild.length === 0) {
          return {
            newValues: { value: undefined }
          }
        }
        return {
          newValues: { value: dependencyValues.atMostOneChild[0].stateValues.value },
          setComponentType: dependencyValues.atMostOneChild[0].componentType,
        };
      }
    }

    stateVariableDefinitions.selectedType = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        atMostOneChild: {
          dependencyType: "childStateVariables",
          childLogicName: "atMostOneChild",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.atMostOneChild.length === 0) {
          return { newValues: { selectedType: undefined } }
        }
        return {
          newValues: { selectedType: dependencyValues.atMostOneChild[0].componentType }
        };
      }
    }

    return stateVariableDefinitions;
  }

  useChildrenForReference = false;

  get stateVariablesForReference() {
    return ["value", "selectedType"];
  }

}
