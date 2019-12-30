import InlineComponent from './abstract/InlineComponent';
import me from 'math-expressions';

export default class MathList extends InlineComponent {
  static componentType = "mathlist";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.simplify = {
      propagateToDescendants: true,
      default: "none",
      toLowerCase: true,
      valueTransformations: { "": "full", "true": "full" },
      validValues: new Set(["full", "numbers", "numbersepreserveorder", "none"])
    };
    properties.unordered = { default: false };
    properties.maximumNumber = { default: undefined };
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

    let breakStringIntoMathsByCommas = function ({ activeChildrenMatched }) {
      let stringChild = activeChildrenMatched[0];


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

    let stateVariableDefinitions = {};

    stateVariableDefinitions.mathAndMathlistChildren = {
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "childIdentity",
          childLogicName: "mathAndMathLists",
          variableNames: ["value"],
        },
      }),
      definition: function ({ dependencyValues }) {
        return {
          newValues: {
            mathAndMathlistChildren: dependencyValues.mathAndMathlistChildren
          }
        }
      }
    }

    stateVariableDefinitions.maths = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["math"],
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "stateVariable",
          variableName: "mathAndMathlistChildren",
        },
        mathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["value"],
        },
        mathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMathlists",
          variableNames: ["maths"],
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
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let mathNumber = 0;
        let mathlistNumber = 0;
        let maths = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "math"
          })) {

            let childValue = dependencyValues.mathChildren[mathNumber].stateValues.value;
            mathNumber++;

            if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
              for (let i = 0; i < childValue.tree.length - 1; i++) {
                maths.push(childValue.get_component(i));
              }
            } else {
              maths.push(childValue);
            }

          } else {
            maths.push(...dependencyValues.mathlistChildren[mathlistNumber].stateValues.maths);
            mathlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && maths.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          maths = maths.slice(0, maxNum)
        }

        return { newValues: { maths } }

      }
    }

    stateVariableDefinitions.latex = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "stateVariable",
          variableName: "mathAndMathlistChildren",
        },
        mathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["valueForDisplay", "latex"],
        },
        mathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMathlists",
          variableNames: ["latex"],
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
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let mathNumber = 0;
        let mathlistNumber = 0;
        let latexs = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "math"
          })) {

            let childValue = dependencyValues.mathChildren[mathNumber].stateValues.valueToDisplay;

            if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
              for (let i = 0; i < childValue.tree.length - 1; i++) {
                latexs.push(childValue.get_component(i).toLatex());
              }
            } else {
              latexs.push(dependencyValues.mathChildren[mathNumber].stateValues.latex);
            }

            mathNumber++;

          } else {
            latexs.push(...dependencyValues.mathlistChildren[mathlistNumber].stateValues.latex);
            mathlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && latexs.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          latexs = latexs.slice(0, maxNum)
        }

        let latex = latexs.join(', ');

        return { newValues: { latex } }

      }
    }


    stateVariableDefinitions.text = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "stateVariable",
          variableName: "mathAndMathlistChildren",
        },
        mathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMaths",
          variableNames: ["valueForDisplay", "text"],
        },
        mathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMathlists",
          variableNames: ["text"],
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
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let mathNumber = 0;
        let mathlistNumber = 0;
        let texts = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "math"
          })) {

            let childValue = dependencyValues.mathChildren[mathNumber].stateValues.valueToDisplay;

            if (dependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
              for (let i = 0; i < childValue.tree.length - 1; i++) {
                texts.push(childValue.get_component(i).toString());
              }
            } else {
              texts.push(dependencyValues.mathChildren[mathNumber].stateValues.text);
            }

            mathNumber++;

          } else {
            texts.push(...dependencyValues.mathlistChildren[mathlistNumber].stateValues.text);
            mathlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && texts.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          texts = texts.slice(0, maxNum)
        }

        let text = texts.join(', ');

        return { newValues: { text } }

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

    stateVariableDefinitions.childrenWhoRender = {
      returnDependencies: () => ({
        mathAndMathlistChildren: {
          dependencyType: "stateVariable",
          variableName: "mathAndMathlistChildren",
        },
        mathChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastZeroMaths",
        },
        mathlistChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "atLeastZeroMathlists",
          variableNames: ["childrenWhoRender"],
        },
        maximumNumber: {
          dependencyType: "stateVariable",
          variableName: "maximumNumber",
        },
      }),
      definition: function ({ dependencyValues, componentInfoObjects }) {
        let mathNumber = 0;
        let mathlistNumber = 0;
        let childrenWhoRender = [];

        for (let child of dependencyValues.mathAndMathlistChildren) {

          if (componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: child.componentType,
            baseComponentType: "math"
          })) {
            childrenWhoRender.push(dependencyValues.mathChildren[mathNumber].componentName);
            mathNumber++;
          } else {
            childrenWhoRender.push(...dependencyValues.mathlistChildren[mathlistNumber].stateValues.childrenWhoRender);
            mathlistNumber++;
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== undefined && childrenWhoRender.length > maxNum) {
          maxNum = Math.max(0, Math.floor(maxNum));
          childrenWhoRender = childrenWhoRender.slice(0, maxNum)
        }

        return { newValues: { childrenWhoRender } }

      }
    }


    return stateVariableDefinitions;
  }


  initializeRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new this.availableRenderers.aslist({
        key: this.componentName,
      });
    }
  }

}