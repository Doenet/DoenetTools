import NumberComponent from '../Number';
import me from 'math-expressions';

export default class NumberBaseOperatorOrNumber extends NumberComponent {
  static componentType = "_numberbaseoperatorornumber";

  static modifySharedParameters({ sharedParameters, serializedComponent }) {

    // if serializedComponent has a defaultToPrescribedParameters
    // essential state variable set, it overrides the value from shared parameters

    if (serializedComponent.state !== undefined &&
      serializedComponent.state.defaultToPrescribedParameters !== undefined) {
      sharedParameters.defaultToPrescribedParameters =
        serializedComponent.state.defaultToPrescribedParameters;
    }
  }


  static returnChildLogic({ standardComponentTypes, allComponentClasses, components,
    sharedParameters }) {
    let childLogic = super.returnChildLogic({
      standardComponentTypes: standardComponentTypes,
      allComponentClasses: allComponentClasses,
      components: components,
    });

    if (sharedParameters.defaultToPrescribedParameters) {
      // if prescribed parameter, behaves just as a number component
      return childLogic;

    }

    childLogic.deleteAllLogic();

    let breakStringIntoNumbersByCommas = function ({ activeChildrenMatched }) {
      console.log("activeChildrenMatched")
      console.log(activeChildrenMatched)
      let stringChild = activeChildrenMatched[0];
      let newChildren = stringChild.stateValues.value.split(",").map(x => ({
        componentType: "number",
        state: { value: Number(x) }
      }));
      return {
        success: true,
        newChildren: newChildren,
        toDelete: [stringChild.componentName],
      }
    }

    let exactlyOneString = childLogic.newLeaf({
      name: "exactlyOneString",
      componentType: 'string',
      number: 1,
      isSugar: true,
      affectedBySugar: ["atLeastZeroNumbers"],
      replacementFunction: breakStringIntoNumbersByCommas,
    });

    let atLeastZeroNumbers = childLogic.newLeaf({
      name: "atLeastZeroNumbers",
      componentType: 'number',
      comparison: "atLeast",
      number: 0,
    });

    childLogic.newOperator({
      name: "SugarXorNumbers",
      operator: "xor",
      propositions: [exactlyOneString, atLeastZeroNumbers],
      setAsBase: true,
    })
    return childLogic;
  }



  static returnStateVariableDefinitions({ sharedParameters }) {

    let stateVariableDefinitions = super.returnStateVariableDefinitions({ sharedParameters });

    if (sharedParameters.defaultToPrescribedParameters) {
      // if prescribed parameter, behaves just as a number component
      return stateVariableDefinitions;
    }

    let componentClass = this;

    stateVariableDefinitions.value = {
      public: true,
      componentType: this.componentType,
      returnDependencies: () => ({
        atLeastZeroNumbers: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroNumbers",
          variableNames: ["value"],
        },
      }),
      defaultValue: NaN,
      definition: function ({ dependencyValues }) {
        if (dependencyValues.atLeastZeroNumbers.length === 0) {
          return { useEssentialOrDefaultValue: { value: { variablesToCheck: ["value"] } } }
        }

        let numbers = dependencyValues.atLeastZeroNumbers.map(x => x.stateValues.value);
        return { newValues: { value: componentClass.applyNumberOperator(numbers, dependencyValues) } };

      },
      inverseDefinition: function () {
        return { success: false };
      }
    };

    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({}),
      definition: function () {
        return { newValues: { canBeModified: false } };
      },
    }

    return stateVariableDefinitions;

  }

}
