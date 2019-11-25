import BaseComponent from './BaseComponent';

export default class ComponentWithSelectableType extends BaseComponent {
  static componentType = "_componentwithselectabletype";

  static modifySharedParameters({ sharedParameters }) {
    // since sequence turns defaultToPrescribedParameters on,
    // turn it off here so it doesn't propagate further
    sharedParameters.defaultToPrescribedParameters = false;
  }

  static createPropertiesObject({ standardComponentTypes }) {
    let properties = super.createPropertiesObject({
      standardComponentTypes: standardComponentTypes
    });
    properties.type = { default: undefined };
    return properties;
  }

  static returnChildLogic({ standardComponentTypes, allComponentClasses, components }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    function addType({ activeChildrenMatched, dependencyValues }) {

      let selectedType = dependencyValues.type;
      if (selectedType === undefined) {
        if (activeChildrenMatched.length === 1) {
          let child = activeChildrenMatched[0];
          if (child.componentType === "string") {
            let s = child.stateValues.value.trim();
            if (/^[a-zA-Z]+$/.test(s)) {
              selectedType = "letters";
            } else if (Number.isFinite(Number(s))) {
              selectedType = "number";
            } else {
              selectedType = "text";
            }
          } else {
            // have a single non-string child.
            // Don't match sugar: child will be matched by exactlyOneChild.
            return { success: false };
          }
        } else {
          // have more than one child, but don't know what type to create
          return { success: false }
        }
      }


      // if already have a single child of the correct type
      // don't match sugar: child will be matched by exactlyOneChild.
      if (activeChildrenMatched.length === 1 && activeChildrenMatched[0].componentType === selectedType) {
        return { success: false }
      }

      if (!(selectedType in standardComponentTypes)) {
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

    let anythingAsSugar = childLogic.newLeaf({
      name: 'anythingAsSugar',
      componentType: '_base',
      excludeComponentTypes: ["_composite"],
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      sugarDependencies: {
        type: {
          dependencyType: "stateVariable",
          variableName: "type",
        }
      },
      affectedBySugar: ["exactlyOneChild"],
      replacementFunction: addType,
    });

    let exactlyOneChild = childLogic.newLeaf({
      name: 'exactlyOneChild',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'exactly',
      number: 1,
    });

    childLogic.newOperator({
      name: "sugarXorSelectedType",
      operator: "xor",
      propositions: [anythingAsSugar, exactlyOneChild],
      setAsBase: true,
    })

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};

    stateVariableDefinitions.value = {
      public: true,
      returnDependencies: () => ({
        exactlyOneChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneChild",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { value: dependencyValues.exactlyOneChild[0].stateValues.value },
          setComponentType: dependencyValues.exactlyOneChild[0].componentType,
        };
      }
    }

    stateVariableDefinitions.selectedType = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        exactlyOneChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneChild",
          variableNames: ["value"],
        },
      }),
      definition({ dependencyValues }) {
        return {
          newValues: { selectedType: dependencyValues.exactlyOneChild[0].componentType }
        };
      }
    }

    return stateVariableDefinitions;
  }

}
