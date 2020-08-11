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
      logicToWaitOnSugar: ["atLeastZeroMaths"],
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

    stateVariableDefinitions.nComponents = {
      public: true,
      componentType: "number",
      stateVariablesDeterminingDependencies: ["mergeMathLists"],
      additionalStateVariablesDefined: ["childIndexByArrayKey"],
      returnDependencies({ stateValues }) {

        let dependencies = {
          maximumNumber: {
            dependencyType: "stateVariable",
            variableName: "maximumNumber",
          },
          mergeMathLists: {
            dependencyType: "stateVariable",
            variableName: "mergeMathLists",
          }
        }

        if (stateValues.mergeMathLists) {
          dependencies.mathAndMathlistChildren = {
            dependencyType: "childStateVariables",
            childLogicName: "mathAndMathLists",
            variableNames: ["value", "nComponents"],
            variablesOptional: true,
          };
        } else {
          dependencies.mathAndMathlistChildren = {
            dependencyType: "childStateVariables",
            childLogicName: "mathAndMathLists",
            variableNames: ["nComponents"],
            variablesOptional: true,
          };
        }

        return dependencies;
      },
      definition: function ({ dependencyValues }) {

        let nComponents = 0;
        let childIndexByArrayKey = [];

        for (let [childInd, child] of dependencyValues.mathAndMathlistChildren.entries()) {
          if (child.stateValues.nComponents !== undefined) {
            for (let i = 0; i < child.stateValues.nComponents; i++) {
              childIndexByArrayKey[nComponents + i] = [childInd, i];
            }
            nComponents += child.stateValues.nComponents;

          } else {

            if (dependencyValues.mergeMathLists) {

              let childValue = child.stateValues.value;

              if (childValue && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
                let nPieces = childValue.tree.length - 1
                for (let i = 0; i < nPieces; i++) {
                  childIndexByArrayKey[i + nComponents] = [childInd, i];
                }
                nComponents += nPieces;
              } else {
                childIndexByArrayKey[nComponents] = [childInd, 0];
                nComponents += 1;
              }
            } else {
              childIndexByArrayKey[nComponents] = [childInd, 0];
              nComponents += 1;
            }
          }
        }

        let maxNum = dependencyValues.maximumNumber;
        if (maxNum !== null && nComponents > maxNum) {
          nComponents = maxNum;
          childIndexByArrayKey = childIndexByArrayKey.slice(0, maxNum);
        }

        return {
          newValues: { nComponents, childIndexByArrayKey },
          checkForActualChange: { nComponents: true }
        }
      }
    }


    stateVariableDefinitions.maths = {
      public: true,
      componentType: "math",
      isArray: true,
      entryPrefixes: ["math"],
      stateVariablesDeterminingDependencies: ["mergeMathLists", "childIndexByArrayKey"],
      returnArraySizeDependencies: () => ({
        nComponents: {
          dependencyType: "stateVariable",
          variableName: "nComponents",
        },
      }),
      returnArraySize({ dependencyValues }) {
        return [dependencyValues.nComponents];
      },

      returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
        let dependenciesByKey = {}
        let globalDependencies = {
          mergeMathLists: {
            dependencyType: "stateVariable",
            variableName: "mergeMathLists",
          },
          childIndexByArrayKey: {
            dependencyType: "stateVariable",
            variableName: "childIndexByArrayKey"
          }
        };

        for (let arrayKey of arrayKeys) {
          let childIndices = [];
          let mathIndex = "1";
          if (stateValues.childIndexByArrayKey[arrayKey]) {
            childIndices = [stateValues.childIndexByArrayKey[arrayKey][0]];
            mathIndex = stateValues.childIndexByArrayKey[arrayKey][1] + 1;
          }
          dependenciesByKey[arrayKey] = {
            mathAndMathlistChildren: {
              dependencyType: "childStateVariables",
              childLogicName: "mathAndMathLists",
              variableNames: ["value", "math" + mathIndex],
              variablesOptional: true,
              childIndices,
            },
          }
        }
        return { globalDependencies, dependenciesByKey }

      },
      arrayDefinitionByKey({
        globalDependencyValues, dependencyValuesByKey, arrayKeys,
      }) {

        let maths = {};

        for (let arrayKey of arrayKeys) {
          let child = dependencyValuesByKey[arrayKey].mathAndMathlistChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              let childValue = child.stateValues.value;
              if (globalDependencyValues.mergeMathLists && Array.isArray(childValue.tree) && childValue.tree[0] === "list") {
                let ind2 = globalDependencyValues.childIndexByArrayKey[arrayKey][1];
                maths[arrayKey] = childValue.get_component(ind2);

              } else {
                maths[arrayKey] = childValue;
              }

            } else {

              let mathIndex = globalDependencyValues.childIndexByArrayKey[arrayKey][1] + 1;
              maths[arrayKey] = child.stateValues["math" + mathIndex];

            }

          }

        }

        return { newValues: { maths } }

      },
      inverseArrayDefinitionByKey({ desiredStateVariableValues, globalDependencyValues,
        dependencyValuesByKey, dependencyNamesByKey, arraySize
      }) {

        if (globalDependencyValues.mergeMathLists) {
          console.log("Have not implemented inverse definition for math list with mergeMathLists=true");
          return { success: false };
        }

        let instructions = [];

        for (let arrayKey in desiredStateVariableValues.maths) {

          if (!dependencyValuesByKey[arrayKey]) {
            continue;
          }

          let child = dependencyValuesByKey[arrayKey].mathAndMathlistChildren[0];

          if (child) {
            if (child.stateValues.value !== undefined) {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].mathAndMathlistChildren,
                desiredValue: desiredStateVariableValues.maths[arrayKey],
                childIndex: 0,
                variableIndex: 0,
              });

            } else {
              instructions.push({
                setDependency: dependencyNamesByKey[arrayKey].mathAndMathlistChildren,
                desiredValue: desiredStateVariableValues.maths[arrayKey],
                childIndex: 0,
                variableIndex: 1,
              });

            }
          }
        }

        return {
          success: true,
          instructions
        }


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