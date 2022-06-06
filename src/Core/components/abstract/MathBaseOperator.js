import MathComponent from '../Math';
import me from 'math-expressions';

export default class MathOperator extends MathComponent {
  static componentType = "_mathOperator";
  static rendererType = "math";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();
    attributes.forceSymbolic = {
      createComponentOfType: "boolean",
      createStateVariable: "forceSymbolic",
      defaultValue: false,
      public: true,
    };
    attributes.forceNumeric = {
      createComponentOfType: "boolean",
      createStateVariable: "forceNumeric",
      defaultValue: false,
      public: true,
    };
    return attributes;
  }

  static returnSugarInstructions() {
    let sugarInstructions = super.returnSugarInstructions();

    let breakStringsIntoMathsBySpaces = function ({ matchedChildren }) {

      // break any string by white space and wrap pieces with math or number

      let newChildren = matchedChildren.reduce(function (a, c) {
        if (typeof c === "string") {
          return [
            ...a,
            ...c.split(/\s+/)
              .filter(s => s)
              .map(s => ({
                componentType: Number.isFinite(Number(s)) ? "number" : "math",
                children: [s]
              }))
          ]
        } else {
          return [...a, c]
        }
      }, []);

      return {
        success: true,
        newChildren: newChildren,
      }
    }


    sugarInstructions.push({
      replacementFunction: breakStringsIntoMathsBySpaces
    });

    return sugarInstructions;

  }


  static returnChildGroups() {

    return [{
      group: "maths",
      componentTypes: ["math"]
    }, {
      group: "numbers",
      componentTypes: ["number"]
    }, {
      group: "mathLists",
      componentTypes: ["mathList"]
    }, {
      group: "numberLists",
      componentTypes: ["numberList"]
    }]

  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.displayDigits = {
      public: true,
      componentType: "integer",
      hasEssential: true,
      defaultValue: 10,
      returnDependencies: () => ({
        displayDigitsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDigits",
          variableNames: ["value"]
        },
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        mathLikeChildren: {
          dependencyType: "child",
          childGroups: ["maths", "numbers", "mathLists", "numberLists"],
          variableNames: ["displayDigits"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDigitsAttr !== null) {
          return {
            setValue: {
              displayDigits: dependencyValues.displayDigitsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.displayDecimalsAttr === null
          && dependencyValues.mathLikeChildren.length === 1
          && !(usedDefault.mathLikeChildren[0] && usedDefault.mathLikeChildren[0].displayDigits)
        ) {
          // have to check to exclude case where have displayDecimals attribute
          // because otherwise a non-default displayDigits will win over displayDecimals
          return {
            setValue: {
              displayDigits: dependencyValues.mathLikeChildren[0].stateValues.displayDigits
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { displayDigits: true } }
        }

      }
    }

    stateVariableDefinitions.displayDecimals = {
      public: true,
      componentType: "integer",
      hasEssential: true,
      defaultValue: null,
      returnDependencies: () => ({
        displayDecimalsAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displayDecimals",
          variableNames: ["value"]
        },
        mathLikeChildren: {
          dependencyType: "child",
          childGroups: ["maths", "numbers", "mathLists", "numberLists"],
          variableNames: ["displayDecimals"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displayDecimalsAttr !== null) {
          return {
            setValue: {
              displayDecimals: dependencyValues.displayDecimalsAttr.stateValues.value
            }
          }
        } else if (dependencyValues.mathLikeChildren.length === 1
          && !(usedDefault.mathLikeChildren[0] && usedDefault.mathLikeChildren[0].displayDecimals)
        ) {
          return {
            setValue: {
              displayDecimals: dependencyValues.mathLikeChildren[0].stateValues.displayDecimals
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { displayDecimals: true } }
        }

      }
    }

    stateVariableDefinitions.displaySmallAsZero = {
      public: true,
      componentType: "number",
      hasEssential: true,
      defaultValue: 0,
      returnDependencies: () => ({
        displaySmallAsZeroAttr: {
          dependencyType: "attributeComponent",
          attributeName: "displaySmallAsZero",
          variableNames: ["value"]
        },
        mathLikeChildren: {
          dependencyType: "child",
          childGroups: ["maths", "numbers", "mathLists", "numberLists"],
          variableNames: ["displaySmallAsZero"]
        }
      }),
      definition({ dependencyValues, usedDefault }) {
        if (dependencyValues.displaySmallAsZeroAttr !== null) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.displaySmallAsZeroAttr.stateValues.value
            }
          }
        } else if (dependencyValues.mathLikeChildren.length === 1
          && !(usedDefault.mathLikeChildren[0] && usedDefault.mathLikeChildren[0].displaySmallAsZero)
        ) {
          return {
            setValue: {
              displaySmallAsZero: dependencyValues.mathLikeChildren[0].stateValues.displaySmallAsZero
            }
          };
        } else {
          return { useEssentialOrDefaultValue: { displaySmallAsZero: true } }
        }

      }
    }


    stateVariableDefinitions.isNumericOperator = {
      returnDependencies: () => ({
        forceNumeric: {
          dependencyType: "stateVariable",
          variableName: "forceNumeric"
        },
        forceSymbolic: {
          dependencyType: "stateVariable",
          variableName: "forceSymbolic"
        },
        mathChildren: {
          dependencyType: "child",
          childGroups: ["maths"],
          variableNames: ["isNumber"],
          variablesOptional: true,
        },
        mathListChildren: {
          dependencyType: "child",
          childGroups: ["mathLists"],
          variableNames: ["maths"],
        },
      }),
      definition({ dependencyValues }) {
        let isNumericOperator;
        if (dependencyValues.forceNumeric) {
          isNumericOperator = true;
        } else if (dependencyValues.forceSymbolic) {
          isNumericOperator = false;
        } else if (dependencyValues.mathChildren.length === 0 && dependencyValues.mathListChildren.length === 0) {
          isNumericOperator = true;
        } else {

          // have math children and aren't forced to be numeric or symbolic
          // will be numeric only if have all math children are numbers
          isNumericOperator = dependencyValues.mathChildren.every(
            x => x.stateValues.isNumber
          )
            && dependencyValues.mathListChildren.every(
              x => x.stateValues.maths.every(y => Number.isFinite(y.tree))
            );
        }

        return { setValue: { isNumericOperator } }
      }
    }

    delete stateVariableDefinitions.codePre;
    delete stateVariableDefinitions.expressionWithCodes;
    delete stateVariableDefinitions.mathChildrenFunctionSymbols;
    delete stateVariableDefinitions.codesAdjacentToStrings;
    delete stateVariableDefinitions.mathChildrenByVectorComponent;

    stateVariableDefinitions.mathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { mathOperator: x => me.fromAst('\uff3f') } })
    }

    stateVariableDefinitions.numericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { numericOperator: x => me.fromAst('\uff3f') } })
    }

    stateVariableDefinitions.inverseMathOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { inverseMathOperator: null } })
    }

    stateVariableDefinitions.inverseNumericOperator = {
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { inverseNumericOperator: null } })
    }

    stateVariableDefinitions.unnormalizedValue = {
      returnDependencies: () => ({
        mathNumberChildren: {
          dependencyType: "child",
          childGroups: ["maths", "numbers", "mathLists", "numberLists"],
          variableNames: ["value", "maths", "numbers"],
          variablesOptional: true,
        },
        isNumericOperator: {
          dependencyType: "stateVariable",
          variableName: "isNumericOperator"
        },
        mathOperator: {
          dependencyType: "stateVariable",
          variableName: "mathOperator"
        },
        numericOperator: {
          dependencyType: "stateVariable",
          variableName: "numericOperator"
        },
        inverseMathOperator: {
          dependencyType: "stateVariable",
          variableName: "inverseMathOperator"
        },
        inverseNumericOperator: {
          dependencyType: "stateVariable",
          variableName: "inverseNumericOperator"
        }
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        if (dependencyValues.mathNumberChildren.length === 0) {
          return {
            setValue: { unnormalizedValue: me.fromAst('\uff3f') }
          }
        } else if (dependencyValues.isNumericOperator) {
          let inputs = [];
          for (let child of dependencyValues.mathNumberChildren) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "number"
            })) {
              inputs.push(child.stateValues.value)
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "math"
            })) {
              let value = child.stateValues.value.evaluate_to_constant();
              if (!Number.isFinite(value)) {
                value = NaN;
              }
              inputs.push(value);
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "numberList"
            })) {
              inputs.push(...child.stateValues.numbers)
            } else {
              // mathLIst
              let values = child.stateValues.maths.map(x => {
                let value = x.evaluate_to_constant();
                if (!Number.isFinite(value)) {
                  value = NaN;
                }
                return value;
              })
              inputs.push(...values);
            }
          }

          return {
            setValue: {
              unnormalizedValue: me.fromAst(dependencyValues.numericOperator(inputs))
            }
          }

        } else {

          let inputs = [];
          for (let child of dependencyValues.mathNumberChildren) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "number"
            })) {
              inputs.push(me.fromAst(child.stateValues.value))
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "math"
            })) {
              inputs.push(child.stateValues.value)
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "numberList"
            })) {
              inputs.push(...child.stateValues.numbers.map(x => me.fromAst(x)))
            } else {
              // mathList
              inputs.push(...child.stateValues.maths)
            }
          }

          return {
            setValue: {
              unnormalizedValue: dependencyValues.mathOperator(inputs)
            }
          }
        }

      },
      inverseDefinition: function ({ desiredStateVariableValues, dependencyValues }) {
        if (dependencyValues.mathNumberChildren.length === 0) {
          return { success: false }
        } else if (dependencyValues.isNumericOperator) {

          if (dependencyValues.inverseNumericOperator) {
            let inputs = [];
            for (let child of dependencyValues.mathNumberChildren) {
              if (componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "number"
              })) {
                inputs.push(child.stateValues.value)
              } else if (componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "math"
              })) {
                let value = child.stateValues.value.evaluate_to_constant();
                if (!Number.isFinite(value)) {
                  value = NaN;
                }
                inputs.push(value);
              } else if (componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: "numberList"
              })) {
                inputs.push(...child.stateValues.numbers)
              } else {
                // mathLIst
                let values = child.stateValues.maths.map(x => {
                  let value = x.evaluate_to_constant();
                  if (!Number.isFinite(value)) {
                    value = NaN;
                  }
                  return value;
                })
                inputs.push(...values);
              }
            }
            let results = dependencyValues.inverseNumericOperator({
              desiredValue: desiredStateVariableValues.unnormalizedValue.evaluate_to_constant(),
              inputs
            })

            if (results.success) {
              return {
                success: true,
                instructions: [{
                  setDependency: "mathNumberChildren",
                  desiredValue: results.inputValue,
                  childIndex: results.inputNumber,
                  variableIndex: 0
                }]
              }
            } else {
              return { success: false }
            }

          } else {
            return { success: false }
          }

        } else if (dependencyValues.inverseMathOperator) {

          let inputs = [];
          for (let child of dependencyValues.mathNumberChildren) {
            if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "number"
            })) {
              inputs.push(me.fromAst(child.stateValues.value))
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "math"
            })) {
              inputs.push(child.stateValues.value)
            } else if (componentInfoObjects.isInheritedComponentType({
              inheritedComponentType: child.componentType,
              baseComponentType: "numberList"
            })) {
              inputs.push(...child.stateValues.numbers.map(x => me.fromAst(x)))
            } else {
              // mathList
              inputs.push(...child.stateValues.maths)
            }
          }

          let results = dependencyValues.inverseMathOperator({
            desiredValue: desiredStateVariableValues.unnormalizedValue,
            inputs
          })

          if (results.success) {
            return {
              success: true,
              instructions: [{
                setDependency: "mathNumberChildren",
                desiredValue: results.inputValue,
                childIndex: results.inputNumber,
                variableIndex: 0
              }]
            }
          } else {
            return { success: false }
          }

        } else {
          return { success: false }
        }
      }
    }


    // create new version on canBeModified that is true only if
    // there is just one child or child list component
    // and we have a inverseMathOperator/inverseNumberOperator
    stateVariableDefinitions.canBeModified = {
      returnDependencies: () => ({
        modifyIndirectly: {
          dependencyType: "stateVariable",
          variableName: "modifyIndirectly",
        },
        fixed: {
          dependencyType: "stateVariable",
          variableName: "fixed",
        },
        mathNumberChildren: {
          dependencyType: "child",
          childGroups: ["maths", "numbers"],
        },
        mathNumberListChildren: {
          dependencyType: "child",
          childGroups: ["mathLists", "numberLists"],
          variableNames: ["nComponents"]
        },
        isNumericOperator: {
          dependencyType: "stateVariable",
          variableName: "isNumericOperator"
        },
        inverseMathOperator: {
          dependencyType: "stateVariable",
          variableName: "mathOperator"
        },
        inverseNumericOperator: {
          dependencyType: "stateVariable",
          variableName: "inverseNumericOperator"
        }
      }),
      definition: function ({ dependencyValues }) {
        let canBeModified = dependencyValues.modifyIndirectly
          && !dependencyValues.fixed
          && dependencyValues.mathNumberChildren.length
          + dependencyValues.mathNumberListChildren.reduce((a, c) => a + c.stateValues.nComponents, 0)
          === 1
          && (
            dependencyValues.isNumericOperator ?
              dependencyValues.inverseNumericOperator :
              dependencyValues.inverseMathOperator
          )

        return { setValue: { canBeModified } }
      }
    }


    return stateVariableDefinitions;
  }

}
