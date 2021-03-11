import BaseComponent from './BaseComponent';

export default class ComponentWithSelectableType extends BaseComponent {
  static componentType = "_componentwithselectabletype";
  static rendererType = undefined;

  // used when referencing this component without prop
  static useChildrenForReference = false;
  static get stateVariablesShadowedForReference() { return ["value", "selectedType"] };

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    function addType({ matchedChildren, parentProps, componentInfoObjects }) {

      let selectedType = parentProps.type;

      if (!selectedType) {
        if (matchedChildren.length === 1) {
          let child = matchedChildren[0];
          if (child.componentType === "string") {
            let s = child.state.value.trim();
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
      if (matchedChildren.length === 1 && matchedChildren[0].componentType === selectedType) {
        return { success: false }
      }

      if (!(selectedType in componentInfoObjects.standardComponentClasses)) {
        // if didn't get a valid type and component is string
        // set to selected type to text
        if (matchedChildren.length === 1 && matchedChildren[0].componentType === "string") {
          selectedType = 'text';
        } else {
          // else don't match sugar
          // which means
          // - if there is only one component, that will become the type
          // - if there are more than one component, child logic will fail
          return { success: false }
        }
      }

      return {
        success: true,
        newChildren: [{ componentType: selectedType, children: matchedChildren }],
      }
    }

    sugarInstructions.push({
      replacementFunction: addType
    })

    return sugarInstructions;

  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.newLeaf({
      name: 'atMostOneChild',
      componentType: "_base",
      excludeComponentTypes: ["_composite"],
      comparison: 'atMost',
      number: 1,
      setAsBase: true,
    });

    return childLogic;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.value = {
      public: true,
      returnDependencies: () => ({
        atMostOneChild: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.atMostOneChild.length === 0) {
          return {
            newValues: { value: null }
          }
        }
        return {
          newValues: { value: dependencyValues.atMostOneChild[0].stateValues.value },
          setComponentType: { value: dependencyValues.atMostOneChild[0].componentType },
        };
      }
    }

    stateVariableDefinitions.selectedType = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        atMostOneChild: {
          dependencyType: "child",
          childLogicName: "atMostOneChild",
          variableNames: ["value"],
          requireChildLogicInitiallySatisfied: true,
        },
      }),
      definition({ dependencyValues }) {
        if (dependencyValues.atMostOneChild.length === 0) {
          return { newValues: { selectedType: null } }
        }
        return {
          newValues: { selectedType: dependencyValues.atMostOneChild[0].componentType }
        };
      }
    }

    return stateVariableDefinitions;
  }


}
