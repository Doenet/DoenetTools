import BooleanBaseOperatorOfMath from './abstract/BooleanBaseOperatorOfMath';

export class IsInteger extends BooleanBaseOperatorOfMath {
  static componentType = "isInteger";


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.booleanOperator.definition = () => ({
      setValue: {
        booleanOperator: function (values) {
          if (values.length === 0) {
            return false;
          }
          if (values.length !== 1) {
            console.warn("IsInteger requires exactly one math child");
            return null;
          }
          let numericValue = values[0].evaluate_to_constant();

          if (!Number.isFinite(numericValue)) {
            return false;
          }

          // to account for round off error, round to nearest integer
          // and check if close to that integer
          let rounded = Math.round(numericValue);
          if (Math.abs(rounded - numericValue) <= 1E-15 * Math.abs(numericValue)) {
            return true;
          } else {
            return false;
          }
        }
      }

    })


    return stateVariableDefinitions;

  }

}

export class IsNumber extends BooleanBaseOperatorOfMath {
  static componentType = "isNumber";

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.booleanOperator.definition = () => ({
      setValue: {
        booleanOperator: function (values) {
          if (values.length === 0) {
            return false;
          }
          if (values.length !== 1) {
            console.warn("IsNumber requires exactly one math child");
            return null;
          }
          let numericValue = values[0].evaluate_to_constant();

          return Number.isFinite(numericValue);

        }
      }

    })

    return stateVariableDefinitions;

  }

}

export class IsBetween extends BooleanBaseOperatorOfMath {
  static componentType = "isBetween";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);
    attributes.limits = {
      createComponentOfType: "numberList",
      createStateVariable: "limits",
      defaultValue: [],
      public: true,
    };
    attributes.strict = {
      createComponentOfType: "boolean",
      createStateVariable: "strict",
      defaultValue: false,
      public: true,
    }
    return attributes;
  }

  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.booleanOperator = {
      returnDependencies: () => ({
        limits: {
          dependencyType: "stateVariable",
          variableName: "limits"
        },
        strict: {
          dependencyType: "stateVariable",
          variableName: "strict"
        }
      }),
      definition({ dependencyValues }) {
        let upperLimit, lowerLimit;

        let lim1 = dependencyValues.limits[0];
        let lim2 = dependencyValues.limits[1];

        if (lim1 < lim2) {
          lowerLimit = lim1;
          upperLimit = lim2;
        } else if (lim2 < lim1) {
          lowerLimit = lim2;
          upperLimit = lim1;
        } else {
          return { setValue: { booleanOperator: () => false } }
        }

        let strict = dependencyValues.strict;

        return {
          setValue: {
            booleanOperator: function (values) {
              if (values.length === 0) {
                return false;
              }
              if (values.length !== 1) {
                console.warn("IsBetween requires exactly one math child");
                return null;
              }
              let numericValue = values[0].evaluate_to_constant();

              if(strict) {
                return numericValue > lowerLimit && numericValue < upperLimit;
              } else {
                return numericValue >= lowerLimit && numericValue <= upperLimit;
              }

            }
          }
        }

      }
    }


    return stateVariableDefinitions;

  }

}
