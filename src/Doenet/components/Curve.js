import GraphicalComponent from './abstract/GraphicalComponent';
import { createUniqueName } from '../utils/naming';
import {
  breakEmbeddedStringByCommas, breakIntoVectorComponents,
  breakPiecesByEquals
} from './commonsugar/breakstrings';
import me from 'math-expressions';

export default class Curve extends GraphicalComponent {
  static componentType = "curve";
  static rendererType = "container";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.draggable = { default: true, forRender: true, propagateToDescendants: true };
    properties.label.propagateToDescendants = true;
    properties.showLabel.propagateToDescendants = true;
    properties.layer.propagateToDescendants = true;

    // some of these properties won't make sense for components that
    // inherit off curve
    // However, even those components should keep these properties
    // so that code can assume that a curve has these properties
    properties.parameter = { default: me.fromAst('t'), propagateToDescendants: true };
    properties.parmin = { default: me.fromAst(-10), propagateToDescendants: true };
    properties.parmax = { default: me.fromAst(10), propagateToDescendants: true };

    properties.variables = {
      componentType: "math",
      entryPrefixes: ["var"],
      dependentStateVariables: [{
        dependencyName: "nVariables",
        variableName: "nVariables"
      }],
      propagateToDescendants: true,
    }

    return properties;
  }

  static returnChildLogic(args) {
    let childLogic = super.returnChildLogic(args);

    childLogic.deleteAllLogic();

    let getVarName = function (piece) {
      if (piece.length > 1) {
        return;
      }
      let varName = piece[0]._string;
      if (varName !== undefined) {
        return varName.trim();
      }
    }

    let checkIfMathVector = function (compList, mathClass) {
      if (compList.length === 1) {
        let component = compList[0]._component;
        if (component instanceof mathClass) {
          let tree = component.stateValues.value.tree;
          if (tree !== undefined) {
            if (Array.isArray(tree) && (tree[0] === "tuple" || tree[0] === "vector")) {
              return true;
            }
          }
        }
      }
      return false;
    }

    let createParametrizationFunctionOrThrough = function ({ dependencyValues, allComponentClasses, idRng }) {

      let results = breakEmbeddedStringByCommas({
        childrenList: dependencyValues.stringsAndMaths,
      });

      if (results.success !== true) {
        return { success: false }
      }

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      // check if each pieces appears to be a point
      let allPiecesPoints = true;
      for (let piece of pieces) {
        let vresult = breakIntoVectorComponents(piece, true);
        if (vresult.foundVector !== true) {
          if (!checkIfMathVector(piece, allComponentClasses.math)) {
            allPiecesPoints = false;
            break;
          }
        }
      }

      if (allPiecesPoints) {
        // put point-like pieces inside points inside a through
        // and create a Bezier curve
        let throughChildren = pieces.map(x => ({
          componentType: "point", children: [{
            componentType: "coords", children: x
          }]
        }));

        let newChildren = [{
          componentType: "beziercurve",
          children: [{
            componentType: "through",
            children: throughChildren
          }]
        }];

        return {
          success: true,
          toDelete,
          newChildren
        };
      }

      // at least one piece wasn't point-like,
      // meaning it wasn't surrounded by parenthesis
      // or a math vector

      // for each piece, we could have the following:
      // - An expression without an = sign.
      //   Make it a function of the first variable.
      // - For case of one piece only:
      //   An expression with a single = sign where both sides are of the form
      //   of vectors of the same length, i.e., (x,y).
      //   Treat them the same as multiple pieces with matched equalities.
      // - Any other expression with a single = sign.
      //   Eventually want to be able to treat as an implicit function of the variables.
      //   For now, require one side of = to be one of the variables.
      //   Treat it a function of the other variables
      // - Anything else
      //   The sugar fails.
      // Note: all punctuation (=, comma, or parens) are recognized only inside strings

      results = breakPiecesByEquals(pieces, true);

      if (results.success !== true) {
        return { success: false }
      }

      toDelete = [...toDelete, ...results.toDelete];

      let lhsByPiece = results.lhsByPiece;
      let rhsByPiece = results.rhsByPiece;


      let newChildren = [];

      if (lhsByPiece.length === 1) {
        if (rhsByPiece.length === 0) {
          // with just one piece and no equal sign
          // the curve is the graph of a function
          newChildren = [{
            componentType: "functioncurve",
            children: [{
              componentType: "function",
              children: lhsByPiece[0]
            }]
          }]
        } else {
          // one piece with an equal sign
          // the curve should be an implicit function
          // For now, just implement a function in the case
          // where either lhs or rhs is the string corresponding to var2
          let functionChildren;
          let flip = false;
          if (getVarName(lhsByPiece[0]) === dependencyValues.variables[1].tree) {
            functionChildren = rhsByPiece[0];
          } else if (getVarName(rhsByPiece[0]) === dependencyValues.variables[1].tree) {
            functionChildren = lhsByPiece[0];
          } else if (getVarName(lhsByPiece[0]) === dependencyValues.variables[0].tree) {
            functionChildren = rhsByPiece[0];
            flip = true;
          } else if (getVarName(rhsByPiece[0]) === dependencyValues.variables[0].tree) {
            functionChildren = lhsByPiece[0];
            flip = true;
          } else {
            console.log("General form of equation for curve not implemented")
            return { success: false }
          }

          let functionCurveName = createUniqueName("functioncurve", idRng);


          let functionCurveChildren = [];
          let variableName = "var1";
          if (flip) {
            functionCurveChildren.push({
              componentType: "flipfunction",
              state: { value: true }
            });
            variableName = "var2";
          }

          functionChildren.push({
            componentType: "variable",
            children: [{
              componentType: "ref",
              children: [{
                componentType: "reftarget",
                state: { refTargetName: functionCurveName }
              },
              {
                componentType: "prop",
                state: { variableName }
              }]
            }]
          })

          functionCurveChildren.push({
            componentType: "function",
            children: functionChildren,
          })

          newChildren = [{
            componentType: "functioncurve",
            children: functionCurveChildren,
            doenetAttributes: { componentName: functionCurveName },
          }]

        }
      } else {

        let parametrizedCurveName = createUniqueName("parametrizedcurve", idRng);

        let variableForParameterFunctions = {
          componentType: "variable",
          children: [{
            componentType: "ref",
            children: [{
              componentType: "reftarget",
              state: { refTargetName: parametrizedCurveName }
            },
            {
              componentType: "prop",
              state: { variableName: "parameter" }
            }]
          }]
        }
        if (rhsByPiece.length === 0) {
          // multiple pieces with no equal sign
          // each piece is a function for the coresponding variable

          let functionChildren = []
          for (let i = 0; i < lhsByPiece.length; i++) {
            functionChildren.push({
              componentType: "function",
              children: [variableForParameterFunctions, ...lhsByPiece[i]]
            });
          }
          newChildren = [{
            componentType: "parametrizedcurve",
            children: functionChildren,
            doenetAttributes: { componentName: parametrizedCurveName },
          }]

        } else {
          // multiple pieces with equal signs
          // each piece is a function for the coresponding variable
          // For now, just implement a parametrization in the case
          // where either lhs or rhs is the string corresponding to one of the variables
          let variablesLeft = new Set([]);
          let variableNames = dependencyValues.variables.map(x => x.tree);
          variableNames.forEach(x => variablesLeft.add(x));


          let variableOrder = {};
          let childrenToBeOrdered = [];
          for (let i = 0; i < lhsByPiece.length; i++) {
            let functionChildren = [variableForParameterFunctions];
            let varName = getVarName(lhsByPiece[i]);
            if (variablesLeft.has(varName)) {
              let varInd = variableNames.indexOf(varName);
              variableOrder[varInd] = i;
              variablesLeft.delete(varName);
              functionChildren.push(...rhsByPiece[i]);
            } else {
              varName = getVarName(rhsByPiece[i]);
              if (variablesLeft.has(varName)) {
                let varInd = variableNames.indexOf(varName);
                variableOrder[varInd] = i;
                variablesLeft.delete(varName);
                functionChildren.push(...lhsByPiece[i]);
              } else {
                console.log("General form of parametric curve not implemented")
                return { success: false }
              }
            }

            childrenToBeOrdered.push({
              componentType: "function",
              children: functionChildren,
            });
          }

          let orderedChildren = [];
          for (let i = 0; i < lhsByPiece.length; i++) {
            orderedChildren.push(childrenToBeOrdered[variableOrder[i]]);
          }

          newChildren = [{
            componentType: "parametrizedcurve",
            children: orderedChildren,
            doenetAttributes: { componentName: parametrizedCurveName },
          }]
        }
      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let atLeastOneString = childLogic.newLeaf({
      name: "atLeastOneString",
      componentType: 'string',
      comparison: 'atLeast',
      number: 1,
    });

    let atLeastOneMath = childLogic.newLeaf({
      name: "atLeastOneMath",
      componentType: 'math',
      comparison: 'atLeast',
      number: 1,
    });

    let stringsAndMaths = childLogic.newOperator({
      name: "stringsAndMaths",
      operator: 'or',
      propositions: [atLeastOneString, atLeastOneMath],
      requireConsecutive: true,
      isSugar: true,
      returnSugarDependencies: () => ({
        stringsAndMaths: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"],
        },
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables"
        },
      }),
      logicToWaitOnSugar: ["exactlyOneCurve"],
      replacementFunction: createParametrizationFunctionOrThrough,
    });


    let addThroughAndBezierCurve = function ({ activeChildrenMatched }) {
      // add <beizercurve><through> around points
      let throughChildren = [];
      for (let child of activeChildrenMatched) {
        throughChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{
          componentType: "beziercurve",
          children: [{ componentType: "through", children: throughChildren }],
        }]
      }
    }

    let atLeastOnePoint = childLogic.newLeaf({
      name: "atLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneCurve"],
      replacementFunction: addThroughAndBezierCurve,
    });


    let addBezierCurve = function ({ activeChildrenMatched }) {
      // add <beziercurve> around through
      return {
        success: true,
        newChildren: [{
          componentType: "beziercurve",
          children: [{
            createdComponent: true,
            componentName: activeChildrenMatched[0].componentName
          }],
        }]
      }
    }

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneCurve"],
      replacementFunction: addBezierCurve,
    });


    let addFunctionCurve = function ({ activeChildrenMatched }) {
      // add <functioncurve> around function and options
      let functionChildren = [];
      for (let child of activeChildrenMatched) {
        functionChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{
          componentType: "functioncurve",
          children: functionChildren,
        }]
      }
    }

    let exactlyOneFunction = childLogic.newLeaf({
      name: "exactlyOneFunction",
      componentType: 'function',
      number: 1,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneCurve"],
      replacementFunction: addFunctionCurve,
    });


    let addParametrizedCurve = function ({ activeChildrenMatched }) {
      // add <parametrizedcurve> around functions and options
      let parametrizedCurveChildren = [];
      for (let child of activeChildrenMatched) {
        parametrizedCurveChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{
          componentType: "parametrizedcurve",
          children: parametrizedCurveChildren,
        }]
      }
    }


    let atLeastTwoFunctions = childLogic.newLeaf({
      name: "atLeastTwoFunctions",
      componentType: 'function',
      comparison: 'atLeast',
      number: 2,
      isSugar: true,
      logicToWaitOnSugar: ["exactlyOneCurve"],
      replacementFunction: addParametrizedCurve,
    });

    let exactlyOneCurve = childLogic.newLeaf({
      name: "exactlyOneCurve",
      componentType: "curve",
      number: 1,
    })

    childLogic.newOperator({
      name: "curveXorSugar",
      operator: 'xor',
      propositions: [
        stringsAndMaths, atLeastOnePoint, exactlyOneThrough,
        exactlyOneFunction, atLeastTwoFunctions,
        exactlyOneCurve
      ],
      setAsBase: true
    });

    return childLogic;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.styleDescription = {
      public: true,
      componentType: "text",
      returnDependencies: () => ({
        selectedStyle: {
          dependencyType: "stateVariable",
          variableName: "selectedStyle",
        },
      }),
      definition: function ({ dependencyValues }) {


        let curveDescription = "";
        if (dependencyValues.selectedStyle.lineWidth >= 4) {
          curveDescription += "thick ";
        } else if (dependencyValues.selectedStyle.lineWidth <= 1) {
          curveDescription += "thin ";
        }
        if (dependencyValues.selectedStyle.lineStyle === "dashed") {
          curveDescription += "dashed ";
        } else if (dependencyValues.selectedStyle.lineStyle === "dotted") {
          curveDescription += "dotted ";
        }

        curveDescription += `${dependencyValues.selectedStyle.lineColor} `;

        return { newValues: { styleDescription: curveDescription } };
      }
    }

    stateVariableDefinitions.nVariables = {
      defaultValue: 2,
      returnDependencies: () => ({
        stringAndMathChildren: {
          dependencyType: "childStateVariables",
          childLogicName: "stringsAndMaths",
          variableNames: ["value"]
        },
        functionChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneFunction",
        },
        functionChildren: {
          dependencyType: "childIdentity",
          childLogicName: "atLeastTwoFunctions",
        }
      }),
      definition: function ({ dependencyValues }) {

        if (dependencyValues.functionChild.length === 1) {
          return {
            newValues: { nVariables: 2 },
            makeEssential: ["nVariables"],
          }
        } else if (dependencyValues.functionChildren.length > 1) {
          return {
            newValues: { nVariables: dependencyValues.functionChildren.length },
            makeEssential: ["nVariables"],
          }
        } else if (dependencyValues.stringAndMathChildren.length > 0) {

          // repeat the same function that is executed in sugar
          let results = breakEmbeddedStringByCommas({
            childrenList: dependencyValues.stringAndMathChildren,
          });

          if (!results.success) {
            return {
              useEssentialOrDefaultValue: {
                nVariables: { variablesToCheck: ["nVariables"], }
              }
            }
          }

          results = breakPiecesByEquals(results.pieces, true);

          if (!results.success) {
            return {
              useEssentialOrDefaultValue: {
                nVariables: { variablesToCheck: ["nVariables"], }
              }
            }
          }

          let nVariables = me.math.max([
            results.lhsByPiece.length,
            results.rhsByPiece.length,
            2
          ])

          return {
            newValues: { nVariables },
            makeEssential: ["nVariables"]
          }

        } else {
          return {
            useEssentialOrDefaultValue: {
              nVariables: { variablesToCheck: ["nVariables"], }
            }
          }
        }

      }
    }

    stateVariableDefinitions.nearestPoint = {
      returnDependencies: () => ({
        curveChild: {
          dependencyType: "childStateVariables",
          childLogicName: "exactlyOneCurve",
          variableNames: ["nearestPoint"]
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: { nearestPoint: dependencyValues.curveChild[0].stateValues.nearestPoint }
      })
    }

    stateVariableDefinitions.childrenToRender = {
      returnDependencies: () => ({
        curveChild: {
          dependencyType: "childIdentity",
          childLogicName: "exactlyOneCurve"
        }
      }),
      definition: ({ dependencyValues }) => ({
        newValues: {
          childrenToRender: [dependencyValues.curveChild[0].componentName]
        }
      })
    }

    return stateVariableDefinitions;
  }


}