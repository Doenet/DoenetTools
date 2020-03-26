import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class MathList extends InlineComponent {
  static componentType = "mathlist";
  static rendererType = "aslist";

  // when another component has a property that is a mathlist,
  // use the maths state variable to populate that property
  static stateVariableForPropertyValue = "maths";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.simplify = {
      propagateToDescendants: true,
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: ["none", "full", "numbers", "numbersepreserveorder", "none"]
    };
    properties.unordered = { default: false };
    properties.maximumNumber = { default: null };
    properties.mergeMathLists = { default: false };
    return properties;
  }


  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    let atLeastZeroMaths = childLogic.newLeaf({
      name: "atLeastZeroMaths",
      componentType: 'math',
      comparison: 'atLeast',
      number: 0
    });

    let atLeastZeroMathlists = childLogic.newLeaf({
      name: "atLeastZeroMathlists",
      componentType: 'mathlist',
      comparison: 'atLeast',
      number: 0
    });

    let breakStringIntoMathsByCommas = function ({ dependencyValues }) {
      let stringChild = dependencyValues.stringChildren[0];

      let stringPieces = stringChild.stateValues.value.split(",").map(x => x.trim()).filter(x => x != "");
      let newChildren = [];

      for (let piece of stringPieces) {
        let mathExpr;
        try {
          mathExpr = me.fromText(piece);
        } catch (e) {
          console.warn(`Invalid string piece in mathlist: ${piece}`);
          mathExpr = me.fromAst('\uFF3F');
        }
        newChildren.push({
          componentType: "math",
          state: { value: mathExpr },
        });
      }

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
      returnSugarDependencies: () => ({
        stringChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneString",
          variableNames: ["value"]
        }
      }),
      affectedBySugar: ["atLeastZeroMaths"],
      replacementFunction: breakStringIntoMathsByCommas,
    });

    let mathAndMathLists = childLogic.newOperator({
      name: "mathAndMathLists",
      operator: "and",
      propositions: [atLeastZeroMaths, atLeastZeroMathlists]
    })

    childLogic.newOperator({
      name: "mathsXorSugar",
      operator: 'xor',
      propositions: [exactlyOneString, mathAndMathLists],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.maths = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["math"],
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "mathAndMathLists",
          variableNames: ["value", "maths"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        }
      }),
      definition: function ({ dependencyValues }) {
        let maths = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {
          if (child.stateValues.maths) {
            maths.push(...child.stateValues.maths);
          } else {

            let childValue = child.stateValues.value;

            if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
              for (let i = 0; i < childValue.tree.length - 1; i++) {
                maths.push(childValue.get_component(i));
              }
            } else {
              maths.push(childValue);
            }
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && maths.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          maths = maths.slice(0, maxNum)
        }

        return { newValues: { maths } }

      }
    }

    stateVariableDefinitions.latex = {
      additionalStateVariablesDefined: ["latexs"],
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "mathAndMathLists",
          variableNames: ["valueForDisplay", "latex", "latexs"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        }
      }),
      definition: function ({ dependencyValues }) {
        let latexs = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {

          if (child.stateValues.valueForDisplay) {

            let childValue = child.stateValues.valueForDisplay;

            if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
              for (let i = 0; i < childValue.tree.length - 1; i++) {
                latexs.push(childValue.get_component(i).toLatex());
              }
            } else {
              latexs.push(child.stateValues.latex);
            }

          } else {
            latexs.push(...child.stateValues.latexs);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && latexs.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          latexs = latexs.slice(0, maxNum)
        }

        let latex = latexs.join(', ');

        return { newValues: { latex, latexs } }

      }
    }


    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      additionalStateVariablesDefined: ["texts"],
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "mathAndMathLists",
          variableNames: ["valueForDisplay", "text", "texts"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
        mergeMathLists: {
          dependencyType: "stateVariable",
          variableName: "mergeMathLists",
        }
      }),
      definition: function ({ dependencyValues }) {
        let texts = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {

          if (child.stateValues.valueForDisplay) {

            let childValue = child.stateValues.valueForDisplay;

            if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
              for (let i = 0; i < childValue.tree.length - 1; i++) {
                texts.push(childValue.get_component(i).toString());
              }
            } else {
              texts.push(child.stateValues.text);
            }
          } else {
            texts.push(...child.stateValues.texts);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        let text = texts.join(', ');

        return { newValues: { text, texts } }

      }
    }

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({
        maths: {
          dependencyType: "stateVariable",
          variableName: "maths"
        }
      }),
      definition: function ({ dependencyValues }) {
        return { newValues: { nComponents: dependencyValues.maths.length } }
      }
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "mathAndMathLists",
          variableNames: ["childrenToRender"],
          variablesOptional: true,
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let childrenToRender = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {
          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "mathlist"
          })) {
            childrenToRender.push(...child.stateValues.childrenToRender);
          } else {
            childrenToRender.push(child.componentName);
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && childrenToRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenToRender = childrenToRender.slice(0, maxNum)
        }

        return { newValues: { childrenToRender } }

      }
    }


    return stateVariableDefinitions;
  }

}