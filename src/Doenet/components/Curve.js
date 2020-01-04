import GraphicalComponent from './abstract/GraphicalComponent';
import {
  breakEmbeddedStringByCommas, breakIntoVectorComponents,
  breakPiecesByEquals
} from './commonsugar/breakstrings';
import me from 'math-expressions';

export default class Curve extends GraphicalComponent {
  static componentType = "curve";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);

    properties.draggable = { default: true };

    if (this.componentType === "curve") {
      // don't add these properties for components that inherit off curve
      properties.splineTension = { default: 0.8 };
      properties.splineForm = { default: "centripetal" };
      properties.extrapolateBackward = { default: false };
      properties.extrapolateForward = { default: false };

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

    let checkIfMathVector = function (compList) {
      if (compList.length === 1) {
        let component = compList[0]._component;
        if (component !== undefined && component.componentType === "math") {
          let tree = component.state.value.tree;
          if (tree !== undefined) {
            if (Array.isArray(tree) && (tree[0] === "tuple" || tree[0] === "vector")) {
              return true;
            }
          }
        }
      }
      return false;
    }

    let createParametrizationFunctionOrThrough = function ({ activeChildrenMatched, allComponentClasses }) {

      let results = breakEmbeddedStringByCommas({
        childrenList: activeChildrenMatched,
        classesToExtract: [
          allComponentClasses.variables,
          allComponentClasses.parameter,
          allComponentClasses.parmin,
          allComponentClasses.parmax,
        ],

      });

      if (results.success !== true) {
        return { success: false }
      }

      let variablesChild, parameterChild, parminChild, parmaxChild;

      for (let comp of results.componentsExtracted) {
        if (comp._component instanceof allComponentClasses.variables) {
          comp._nVariables = comp._component.stateValues.ncomponents,
            comp._variables = comp._component.stateValues.variables,
            variablesChild = comp;
        } else if (comp._component instanceof allComponentClasses.parameter) {
          parameterChild = comp;
        } else if (comp._component instanceof allComponentClasses.parmin) {
          parminChild = comp;
        } else if (comp._component instanceof allComponentClasses.parmax) {
          parmaxChild = comp;
        }
      }

      let pieces = results.pieces;
      let toDelete = results.toDelete;

      // check if each pieces appears to be a point
      let allPiecesPoints = true;
      for (let piece of pieces) {
        let vresult = breakIntoVectorComponents(piece, true);
        if (vresult.foundVector !== true) {
          if (!checkIfMathVector(piece)) {
            allPiecesPoints = false;
            break;
          }
        }
      }
      let parChildren = [];
      if (variablesChild) {
        parChildren.push(variablesChild);
      }
      if (parameterChild) {
        parChildren.push(parameterChild);
      }
      if (parminChild) {
        parChildren.push(parminChild);
      }
      if (parmaxChild) {
        parChildren.push(parmaxChild);
      }

      if (allPiecesPoints) {
        // put point-like pieces inside points inside a through
        let throughChildren = pieces.map(x => ({
          componentType: "point", children: [{
            componentType: "coords", children: x
          }]
        }));
        let through = {
          componentType: "through",
          children: throughChildren,
        }
        let newChildren = [...parChildren, through];

        return {
          success: true,
          toDelete: toDelete,
          newChildren: newChildren
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

      let initialDefaultVars = ["x", "y", "z"];
      let variableNamesForChildren = [];
      let variableComponentsForChildren = [];
      let parameterForChildren;

      let nVariablesInChild = 0;
      let nVariablesNeeded = Math.max(lhsByPiece.length, 2);
      if (variablesChild !== undefined) {
        nVariablesInChild = variablesChild._nVariables;
        let nVariablesNeeded = Math.max(lhsByPiece.length, 2);
        for (let i = 0; i < Math.min(nVariablesInChild, nVariablesNeeded); i++) {
          // for variables that match a piece, create a reference
          variableComponentsForChildren.push({
            componentType: "ref",
            children: [
              { componentType: 'reftarget', state: { refTargetName: variablesChild.componentName } },
              {
                componentType: 'prop', children: [
                  { componentType: "string", state: { value: `var${i}` } }
                ]
              }
            ]
          })
          variableNamesForChildren.push(variablesChild._variables[i].tree);
        }
      }
      for (let i = nVariablesInChild; i < nVariablesNeeded; i++) {
        // if have more pieces that variables
        // make the variable be x, y, z, x4, x5, x6...
        if (i < 3) {
          variableComponentsForChildren.push({
            componentType: "variable",
            state: { value: me.fromAst(initialDefaultVars[i]) }
          })
          variableNamesForChildren.push(initialDefaultVars[i]);
        } else {
          variableComponentsForChildren.push({
            componentType: "variable",
            state: { value: me.fromAst("x" + (i + 1)) }
          })
          variableNamesForChildren.push("x" + (i + 1));
        }
      }
      if (parameterChild !== undefined) {
        parameterForChildren = {
          componentType: "ref",
          children: [{ componentType: "reftarget", state: { refTargetName: parameterChild.componentName } }]
        }
      }

      let newChildren = [...parChildren];

      if (lhsByPiece.length === 1) {
        let functionChildren = [];
        if (variablesChild) {
          functionChildren.push(variableComponentsForChildren[0]);
        }
        if (rhsByPiece.length === 0) {
          // with just one piece and no equal sign
          // the curve is the graph of a function
          functionChildren = [...functionChildren, ...lhsByPiece[0]];

          newChildren.push({
            componentType: "function",
            children: functionChildren
          });
        } else {
          // one piece with an equal sign
          // the curve should be an implicit function
          // For now, just implement a function in the case
          // where either lhs or rhs is the string corresponding to var2
          if (getVarName(lhsByPiece[0]) === variableNamesForChildren[1]) {
            functionChildren = [...functionChildren, ...rhsByPiece[0]];
          } else if (getVarName(rhsByPiece[0]) === variableNamesForChildren[1]) {
            functionChildren = [...functionChildren, ...lhsByPiece[0]];
          } else if (getVarName(lhsByPiece[0]) === variableNamesForChildren[0]) {
            newChildren.push({
              componentType: "flipfunction",
              state: { value: true }
            });
            functionChildren = [variableComponentsForChildren[1],
            ...rhsByPiece[0]];
          } else if (getVarName(rhsByPiece[0]) === variableNamesForChildren[0]) {
            newChildren.push({
              componentType: "flipfunction",
              state: { value: true }
            });
            functionChildren = [variableComponentsForChildren[1],
            ...lhsByPiece[0]];
          } else {
            console.log("General form of equation for curve not implemented")
            return { success: false }
          }
          newChildren.push({
            componentType: "function",
            children: functionChildren
          });
        }
      } else {
        let parForChildren = [];
        if (parameterForChildren !== undefined) {
          parForChildren.push(parameterForChildren)
        } else {
          parForChildren.push({
            componentType: "parameter",
            state: { value: me.fromAst("t") }
          })
        }

        if (rhsByPiece.length === 0) {
          // multiple pieces with no equal sign
          // each piece is a function for the coresponding variable
          for (let i = 0; i < lhsByPiece.length; i++) {

            let parameterizationChildren = [
              ...parForChildren,
              ...lhsByPiece[i]
            ];
            newChildren.push({
              componentType: "function",
              children: parameterizationChildren
            });

          }
        } else {
          // multiple pieces with equal signs
          // each piece is a function for the coresponding variable
          // For now, just implement a parametrization in the case
          // where either lhs or rhs is the string corresponding to one of the variables
          let variablesLeft = new Set([]);
          variableNamesForChildren.forEach(x => variablesLeft.add(x));

          let variableOrder = {};
          let childrenToBeOrdered = [];
          for (let i = 0; i < lhsByPiece.length; i++) {
            let parameterizationChildren = [...parForChildren];
            let varName = getVarName(lhsByPiece[i]);
            if (variablesLeft.has(varName)) {
              let varInd = variableNamesForChildren.indexOf(varName);
              variableOrder[varInd] = i;
              variablesLeft.delete(varName);
              parameterizationChildren.push(...rhsByPiece[i]);
            } else {
              varName = getVarName(rhsByPiece[i]);
              if (variablesLeft.has(varName)) {
                let varInd = variableNamesForChildren.indexOf(varName);
                variableOrder[varInd] = i;
                variablesLeft.delete(varName);
                parameterizationChildren.push(...lhsByPiece[i]);
              } else {
                console.log("General form of parametric curve not implemented")
                return { success: false }
              }
            }

            childrenToBeOrdered.push({
              componentType: "function",
              children: parameterizationChildren
            });
          }

          for (let i = 0; i < lhsByPiece.length; i++) {
            newChildren.push(childrenToBeOrdered[variableOrder[i]]);
          }

        }
      }

      return {
        success: true,
        newChildren: newChildren,
        toDelete: toDelete,
      }

    }

    let variablesForSugar = childLogic.newLeaf({
      name: "variablesForSugar",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
    });

    let parameterForSugar = childLogic.newLeaf({
      name: "parameterForSugar",
      componentType: 'parameter',
      comparison: 'atMost',
      number: 1,
    });

    let parMinForSugar = childLogic.newLeaf({
      name: "parminForSugar",
      componentType: 'parmin',
      comparison: 'atMost',
      number: 1,
    });

    let parMaxForSugar = childLogic.newLeaf({
      name: "parmaxForSugar",
      componentType: 'parmax',
      comparison: 'atMost',
      number: 1,
    });

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
    });

    let stringsAndMathsSugar = childLogic.newOperator({
      name: "stringsAndMathsSugar",
      operator: 'and',
      propositions: [variablesForSugar, parameterForSugar, parMinForSugar, parMaxForSugar, stringsAndMaths],
      isSugar: true,
      affectedBySugar: ["exactlyOneThrough", "atLeastOneFunction",
        "variables", "parameter", "parMin", "parMax", "flipfunction"],
      replacementFunction: createParametrizationFunctionOrThrough,
    });

    let variables = childLogic.newLeaf({
      name: "variables",
      componentType: 'variables',
      comparison: 'atMost',
      number: 1,
    });

    let parameter = childLogic.newLeaf({
      name: "parameter",
      componentType: 'parameter',
      comparison: 'atMost',
      number: 1,
    });

    let parMin = childLogic.newLeaf({
      name: "parMin",
      componentType: 'parmin',
      comparison: 'atMost',
      number: 1,
    });

    let parMax = childLogic.newLeaf({
      name: "parMax",
      componentType: 'parmax',
      comparison: 'atMost',
      number: 1,
    });

    let flipFunction = childLogic.newLeaf({
      name: "flipFunction",
      componentType: 'flipfunction',
      comparison: 'atMost',
      number: 1,
    });

    let addThrough = function ({ activeChildrenMatched }) {
      // add <through> around points
      let throughChildren = [];
      for (let child of activeChildrenMatched) {
        throughChildren.push({
          createdComponent: true,
          componentName: child.componentName
        });
      }
      return {
        success: true,
        newChildren: [{ componentType: "through", children: throughChildren }],
      }
    }


    let atLeastOnePoint = childLogic.newLeaf({
      name: "atLeastOnePoint",
      componentType: 'point',
      comparison: 'atLeast',
      number: 1,
      isSugar: true,
      affectedBySugar: ["exactlyOneThrough"],
      replacementFunction: addThrough,
    });

    let noPoints = childLogic.newLeaf({
      name: "noPoints",
      componentType: 'point',
      number: 0
    });

    let exactlyOneThrough = childLogic.newLeaf({
      name: "exactlyOneThrough",
      componentType: 'through',
      number: 1
    });

    let atLeastOneFunction = childLogic.newLeaf({
      name: "atLeastOneFunction",
      componentType: 'function',
      comparison: 'atLeast',
      number: 1
    });

    let realCurveOptions = childLogic.newOperator({
      name: "realCurveOptions",
      operator: "xor",
      propositions: [exactlyOneThrough, atLeastOneFunction],
    })

    let realCurve = childLogic.newOperator({
      name: "realCurve",
      operator: "and",
      propositions: [variables, parameter, parMin, parMax, flipFunction, realCurveOptions]
    })

    let curveXorSugar = childLogic.newOperator({
      name: "curveXorSugar",
      operator: 'xor',
      propositions: [realCurve, stringsAndMathsSugar, atLeastOnePoint, noPoints],
    });

    let atMostOneBezierControls = childLogic.newLeaf({
      name: "atMostOneBezierControls",
      componentType: 'beziercontrols',
      comparison: 'atMost',
      number: 1
    });

    let atMostOneConstrainToAngles = childLogic.newLeaf({
      name: "atMostOneConstrainToAngles",
      componentType: 'constraintoangles',
      comparison: 'atMost',
      number: 1
    });

    let atMostOneAttractToAngles = childLogic.newLeaf({
      name: "atMostOneAttractToAngles",
      componentType: 'attracttoangles',
      comparison: 'atMost',
      number: 1
    });

    childLogic.newOperator({
      name: "curveAndControls",
      operator: 'and',
      propositions: [curveXorSugar, atMostOneBezierControls,
        atMostOneConstrainToAngles, atMostOneAttractToAngles],
      setAsBase: true,
    });

    return childLogic;
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = {};


    stateVariableDefinitions.selectedStyle = {
      returnDependencies: () => ({
        styleNumber: {
          dependencyType: "stateVariable",
          variableName: "styleNumber",
        },
      }),
      definition: function ({ dependencyValues, styleDefinitions }) {
        let selectedStyle = styleDefinitions[dependencyValues.styleNumber];
        if (selectedStyle === undefined) {
          selectedStyle = styleDefinitions[1];
        }
        return { newValues: { selectedStyle } };
      }
    }


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

    return stateVariableDefinitions;
  }

  updateState(args = {}) {
    if (args.init === true) {
      this.state.parameterizationMin = 0;
      this.state.parameterizationMax = 1;
      this.state.parameterizationExclude = [];
      this.state.parameterizationKeyPoints = [];
      this.state.parameterizationPeriodic = false;
      this.state.parameterizationNsteps = 500;


      this.parameterization = this.parameterization.bind(this);

      // check if child logic has been overwritten by superclass
      if (this.childLogic.returnMatches("curveAndControls") === undefined) {
        this.state.curveChildLogicOverwritten = true;
      }

      // skip setting up variables if child logic overwritten
      if (!this.curveChildLogicOverwritten) {
        this.makePublicStateVariableArray({
          variableName: "variables",
          componentType: "variable",
        });
        this.makePublicStateVariableArrayEntry({
          entryName: "variable",
          arrayVariableName: "variables",
        });
        this.makePublicStateVariable({
          variableName: "parameter",
          componentType: "parameter",
        });
        this.makePublicStateVariable({
          variableName: "parmin",
          componentType: "parmin",
        });
        this.makePublicStateVariable({
          variableName: "parmax",
          componentType: "parmax",
        });

        this.makePublicStateVariableArray({
          variableName: "throughpoints",
          componentType: "point",
          stateVariableForRef: "coords",
        });
        this.makePublicStateVariableArrayEntry({
          entryName: "throughpoint",
          arrayVariableName: "throughpoints",
        });
        this.makePublicStateVariableArray({
          variableName: "controlpoints",
          componentType: "point",
          stateVariableForRef: "coords",
        });
        this.makePublicStateVariableArrayEntry({
          entryName: "controlpoint",
          arrayVariableName: "controlpoints",
        });
        this.makePublicStateVariableArray({
          variableName: "controlvectors",
          componentType: "vector",
          stateVariableForRef: "displacement",
        });
        this.makePublicStateVariableArrayEntry({
          entryName: "controlvector",
          arrayVariableName: "controlvectors",
        });
        this.makeArrayVariable({
          variableName: "pointCurrentlyControlled",
          trackChanges: true,
        });
        this.makePublicStateVariable({
          variableName: "styledescription",
          componentType: "text",
        });

        // if not already defined, set up essential state variables
        // for bezier controls
        if (this.state.throughForControlChild === undefined) {
          this.state.throughForControlChild = [];
          this._state.throughForControlChild.essential = true;
        }
        if (this.state.lastControlChildValue === undefined) {
          this.state.lastControlChildValue = [];
          this._state.lastControlChildValue.essential = true;
        }
        this._state.pointCurrentlyControlled.essential = true;

        this.moveControlvector = this.moveControlvector.bind(
          new Proxy(this, this.readOnlyProxyHandler)
        );
        this.moveThroughpoint = this.moveThroughpoint.bind(
          new Proxy(this, this.readOnlyProxyHandler)
        );
        this.togglePointControl = this.togglePointControl.bind(
          new Proxy(this, this.readOnlyProxyHandler)
        );
      }
    }

    super.updateState(args);



    // don't execute the remainder of this function
    // for components that inherit off curve
    if (this.state.curveChildLogicOverwritten) {
      return;
    }

    if (!this.childLogicSatisfied) {
      this.unresolvedState.variables = true;
      this.unresolvedState.parameter = true;
      this.unresolvedState.parmin = true;
      this.unresolvedState.parmax = true;
      this.unresolvedState.throughpoints = true;
      this.unresolvedState.controlpoints = true;
      this.unresolvedState.controlvectors = true;
      return;
    }

    let trackChanges = this.currentTracker.trackChanges;
    let childrenChanged = trackChanges.childrenChanged(this.componentName);

    if (childrenChanged) {

      let variablesInd = this.childLogic.returnMatches("variables");
      if (variablesInd.length === 1) {
        this.state.variablesChild = this.activeChildren[variablesInd[0]];
      } else {
        delete this.state.variablesChild;
        if (!this._state.variables.essential) {
          this.state.variables = [me.fromAst("x"), me.fromAst("y")];
          this._state.variables.essential = true;
        }
      }

      let parameterInd = this.childLogic.returnMatches("parameter");
      if (parameterInd.length === 1) {
        this.state.parameterChild = this.activeChildren[parameterInd[0]];
      } else {
        delete this.state.parameterChild;
        if (!this._state.parameter.essential) {
          this.state.parameter = me.fromAst("t");
          this._state.parameter.essential = true;
        }
      }
      let parMinInd = this.childLogic.returnMatches("parMin");
      if (parMinInd.length === 1) {
        this.state.parminChild = this.activeChildren[parMinInd[0]];
      } else {
        delete this.state.parminChild;
        if (!this._state.parmin.essential) {
          this._state.parmin.essential = true;
          this.state.parmin = me.fromAst(-10);
        }
      }
      let parMaxInd = this.childLogic.returnMatches("parMax");
      if (parMaxInd.length === 1) {
        this.state.parmaxChild = this.activeChildren[parMaxInd[0]];
      } else {
        if (!this._state.parmax.essential) {
          this._state.parmax.essential = true;
          this.state.parmax = me.fromAst(10);
        }
      }

      let flipFunctionInd = this.childLogic.returnMatches("flipFunction");
      if (flipFunctionInd.length === 1) {
        this.state.flipFunctionChild = this.activeChildren[flipFunctionInd[0]];
      } else {
        if (!(this._state.flipFunction && this._state.flipFunction.essential)) {
          this.state.flipFunction = false;
          this._state.flipFunction.essential = true;
        }
      }

      let atLeastOneFunctionInds = this.childLogic.returnMatches("atLeastOneFunction");
      if (atLeastOneFunctionInds.length === 1) {
        this.state.functionChild = this.activeChildren[atLeastOneFunctionInds[0]];
        this.state.curveType = "function";
        this.state.parameterizationMin = 0;
        this.state.parameterizationMax = 1;
        this.state.parameterizationExclude = [0, 1];
      } else if (atLeastOneFunctionInds.length > 1) {
        delete this.state.functionChild;
        this.state.parameterizationChildren = atLeastOneFunctionInds.map(x => this.activeChildren[x]);
        this.state.curveType = "parameterization";
        this.state.parameterizationExclude = [];

      } else {
        // no function children, check for through child
        delete this.state.functionChild;
        delete this.state.parameterizationChildren;

        let exactlyOneThroughInd = this.childLogic.returnMatches("exactlyOneThrough");
        if (exactlyOneThroughInd.length === 1) {
          this.state.throughChild = this.activeChildren[exactlyOneThroughInd[0]];

          let controlsInds = this.childLogic.returnMatches("atMostOneBezierControls");
          if (controlsInds.length === 1) {
            this.state.controlsChild = this.activeChildren[controlsInds[0]];
          } else {
            delete this.state.controlsChild;
          }

          this.state.curveType = "spline";
          this.state.parameterizationExclude = [];
        } else {
          delete this.state.throughChild;
          delete this.state.controlsChild;

          // no function children or through
          // check to see if got functionComponent directly from state
          // (which would happen if a function were adapted into a curve)
          if (this.state.functionComponentName !== undefined) {
            this.state.functionComponent = this.downstreamDependencies[this.state.functionComponentName].downstreamComponent;
            this.state.curveType = "function";
            this.state.parameterizationMin = 0;
            this.state.parameterizationMax = 1;
            this.state.parameterizationExclude = [0, 1];
          }
        }
      }
    }

    if (childrenChanged || trackChanges.getVariableChanges({ component: this, variable: "splineForm" })) {
      if (!this.unresolvedState.splineForm) {
        this.state.splineForm = this.state.splineForm.toLowerCase();
        if (this.state.splineForm !== "uniform") {
          this.state.splineForm = "centripetal";
        }
      }
    }

    if (this.state.variablesChild) {
      if (this.state.variablesChild.unresolvedState.variables) {
        this.unresolvedState.variables = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.variablesChild, variable: "variables"
      })) {
        delete this.unresolvedState.variables;
        this.state.variables = [];
        let nVariables = this.state.variablesChild.state.ncomponents;
        for (let i = 0; i < nVariables; i++) {
          this.state.variables.push(this.state.variablesChild.state.variables[i]);
        }
        // at least have two variables
        if (nVariables === 1) {
          this.state.variables.push(me.fromAst("y"));
        }
      }
    }

    if (this.state.parameterChild) {
      if (this.state.parameterChild.unresolvedState.value) {
        this.unresolvedState.parameter = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.parameterChild, variable: "value"
      })) {
        delete this.unresolvedState.parameter;
        this.state.parameter = this.state.parameterChild.state.value;
      }
    }

    if (this.state.parminChild) {
      if (this.state.parminChild.unresolvedState.value) {
        this.unresolvedState.parmin = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.parminChild, variable: "value"
      })) {
        delete this.unresolvedState.parmin;
        this.state.parmin = this.state.parminChild.state.value.simplify();
      }
    }

    if (this.state.parmaxChild) {
      if (this.state.parmaxChild.unresolvedState.value) {
        this.unresolvedState.parmax = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.parmaxChild, variable: "value"
      })) {
        delete this.unresolvedState.parmax;
        this.state.parmax = this.state.parmaxChild.state.value.simplify();
      }
    }

    if (this.state.flipFunctionChild) {
      if (this.state.flipFunctionChild.unresolvedState.value) {
        this.unresolvedState.flipFunction = true;
      } else if (childrenChanged || trackChanges.getVariableChanges({
        component: this.state.flipFunctionChild, variable: "value"
      })) {
        delete this.unresolvedState.flipFunction;
        this.state.flipFunction = this.state.flipFunctionChild.state.value;
      }
    }


    if (this.state.functionChild) {
      if (Object.keys(this.state.functionChild.unresolvedState).length > 0) {
        this.unresolvedState.f = true;
      } else {
        delete this.unresolvedState.f;
        this.state.f = this.state.functionChild.returnNumericF();
      }
    } else if (this.state.parameterizationChildren) {
      if (this.state.parameterizationChildren.some(x => Object.keys(x.unresolvedState).length > 0)) {
        this.unresolvedState.fs = true;
      } else {
        delete this.unresolvedState.fs;
        this.state.fs = [];
        for (let child of this.state.parameterizationChildren) {
          this.state.fs.push(child.returnNumericF());
        }
      }
      if (childrenChanged || trackChanges.getVariableChanges({ component: this, variable: "parmin" })) {
        this.state.parameterizationMin = this.state.parmin.evaluate_to_constant();
      }
      if (childrenChanged || trackChanges.getVariableChanges({ component: this, variable: "parmax" })) {
        this.state.parameterizationMax = this.state.parmax.evaluate_to_constant();
      }
    } else {
      // no function children, check for through child
      if (this.state.throughChild) {
        delete this.unresolvedState.throughpoints;
        delete this.unresolvedState.controlpoints;
        delete this.unresolvedState.controlvectors;

        for (let [index, point] of this.state.throughChild.state.points.entries()) {
          if (point.unresolvedState.coords) {
            if (this.unresolvedState.throughpoints === undefined) {
              this.unresolvedState.throughpoints = { isArray: true, arrayComponents: {} };
            }
            this.unresolvedState.throughpoints.arrayComponents[index] = true;
          }
        }

        if (this.state.controlsChild) {
          if (this.state.controlsChild.unresolvedState.controls === true) {
            // if controls completely unresolved, don't proceed
            this.unresolvedState.controlvectors = true;
            this.unresolvedState.controlpoints = true;
            return;
          } else if (this.state.controlsChild.unresolvedState.controls) {
            // if just some are unresolved, mark as unresolved
            this.unresolvedState.controlvectors = { isArray: true, arrayComponents: {} };
            this.unresolvedState.controlpoints = { isArray: true, arrayComponents: {} };
            for (let ind of this.state.constraintChild.unresolvedState.controls.arrayComponents) {
              this.unresolvedState.controlvectors.arrayComponents[ind] = true;
              this.unresolvedState.controlpoints.arrayComponents[ind] = true;
            }
            // TODO: need to test if following calculations can handle
            // case with some unresolved controls
          }
        }

        this.calculateBezierParameters();

        this.state.parameterizationMax = this.state.throughpoints.length - 1;
        if (this.state.extrapolateBackward) {
          this.state.parameterizationMin = -this.state.parameterizationMax;
        } else {
          this.state.parameterizationMin = 0;
        }
        if (this.state.extrapolateForward) {
          this.state.parameterizationMax *= 2;
        }

      } else {
        // no function children or through
        // check to see if got functionComponent directly from state
        // (which would happen if a function were adapted into a curve)
        if (this.state.functionComponent !== undefined) {
          this.state.f = this.state.functionComponent.returnNumericF();
        }
      }

    }

  }

  calculateBezierParameters() {

    if (this._state.throughpoints === undefined ||
      this._state.throughpoints.essential !== true) {
      this.state.throughpoints = [];
    }
    if (this._state.controlvectors === undefined ||
      this._state.controlvectors.essential !== true) {
      this.state.controlvectors = [];
    }
    if (this._state.symmetriccontrols === undefined ||
      this._state.symmetriccontrols.essential !== true) {
      this.state.symmetriccontrols = [];
    }

    // if controlvectors is a readyonly proxy
    // (which can happen with a ref)
    // make shallow copy
    if (this.state.controlvectors.__isReadOnlyProxy) {
      this.state.controlvectors = [...this.state.controlvectors];
    }

    this.state.numericEntries = true;

    // Step 1: create the through points from the points
    // explicitly specified in the through child

    let points = this.state.throughChild.state.points;
    let nPoints = this.state.throughChild.state.nPoints;

    this.state.throughpoints = [];
    for (let i = 0; i < nPoints; i++) {
      let coords = points[i].state.coords;
      if (coords === undefined || coords.tree.length !== 3) {
        this.state.numericEntries = false;
        this.state.throughpoints.push(me.fromAst(["tuple", NaN, NaN]));
        continue;
      }
      let coordsNumeric = ["tuple"];
      for (let j = 0; j < 2; j++) {
        let comp = coords.get_component(j).evaluate_to_constant();
        if (Number.isFinite(comp)) {
          coordsNumeric.push(comp);
        } else {
          coordsNumeric.push(NaN);
          this.state.numericEntries = false;
        }
      }
      this.state.throughpoints.push(me.fromAst(coordsNumeric));
    }

    this.state.nPoints = this.state.throughpoints.length;

    // Step 2: if controls were explicilty specified via children
    // set the controlvectors as prescribed
    // and mark the corresponding points as being currently controlled
    if (this.state.controlsChild) {

      let controls = this.state.controlsChild.state.controls;
      let nControls = Math.min(controls.length, this.state.nPoints);

      // Note: don't reset controlvectors to zero length even with control children
      // as control children could be combined with essential controls
      // if additional controls beyond prescribed were created

      for (let i = 0; i < nControls; i++) {

        // points with explicitly set controls are always marked as being controlled
        this.state.pointCurrentlyControlled[i] = true;

        let ct = controls[i];
        let controlInd = 2 * i - 1;
        if (i === 0) {
          controlInd = 0;
        }

        // simplest case is when controls were specified as vectors
        // set controlvector component directly from child
        // create a symmetric control vector if only on vector
        // specified for an interior point
        if (ct.controlType === "vector") {
          let symmetric = ct.vectors.length === 1;
          this.state.symmetriccontrols[i] = symmetric;

          let cvector = ["tuple"];
          let vectorValues = [];
          if (ct.vectors[0].tree[0] !== "tuple" || ct.vectors[0].tree.length !== 3) {
            cvector = ["tuple", NaN, NaN]
            vectorValues = [NaN, NaN]
            this.numericEntries = false;
          } else {
            for (let j = 0; j < 2; j++) {
              let val = ct.vectors[0].get_component(j).evaluate_to_constant();
              if (Number.isFinite(val)) {
                cvector.push(val);
                vectorValues.push(val);
              } else {
                cvector.push(NaN);
                vectorValues.push(NaN);
                this.state.numericEntries = false;
              }
            }
          }
          this.state.controlvectors[controlInd] = me.fromAst(cvector);

          // check for second vector everywhere except first through point
          if (i > 0) {
            cvector = ["tuple"];
            if (symmetric) {
              for (let j = 0; j < 2; j++) {
                cvector.push(-vectorValues[j]);
              }
            } else {
              if (ct.vectors[1].tree[0] !== "tuple" || ct.vectors[1].tree.length !== 3) {
                cvector = ["tuple", NaN, NaN]
                this.numericEntries = false;
              } else {
                for (let j = 0; j < 2; j++) {
                  let val = ct.vectors[1].get_component(j).evaluate_to_constant();
                  if (Number.isFinite(val)) {
                    cvector.push(val);
                  } else {
                    cvector.push(NaN);
                    this.numericEntries = false;
                  }
                }
              }
            }
            this.state.controlvectors[controlInd + 1] = me.fromAst(cvector);
          }

        } else {
          // control type is point

          // need more complicated logic for the case when controls
          // are specified via a point since we really care about the vector
          // Logic is needed to get reasonable behavior for the different
          // ways that the through points and the controls points
          // can be changed
          // (such as top-down changes initiated from renderer points
          // or bottom-up changes initiated from reference source points
          // or top-down followed by bottom-up in cases where changes are
          // initiated from render points but then altered by constraints)

          // When a through point is moved but a control point is not touched,
          // we want the control vector (the difference) to be preserved,
          // which means the control point may not match the value
          // passed in from the control point child.
          // To accomplish this, 
          // A. we don't update the throughForControlChild
          // unless the control point location is explicitly changed.
          // In this way, bottom-up changes from through points
          // (which won't alter sources of control points) maintain the vectors
          // B. when through points are explicitly changed top-down
          // the corresponding controlvector values are preserved

          let symmetric = ct.points.length === 1;
          this.state.symmetriccontrols[i] = symmetric;

          let pointValues = [];
          if (ct.points[0].tree[0] !== "tuple" || ct.points[0].tree.length !== 3) {
            pointValues = [NaN, NaN]
            this.numericEntries = false;
          } else {
            for (let j = 0; j < 2; j++) {
              let val = ct.points[0].get_component(j).evaluate_to_constant();
              if (Number.isFinite(val)) {
                pointValues.push(val);
              } else {
                pointValues.push(NaN);
                this.numericEntries = false;
              }
            }
          }

          let pointChanged = false;
          if (this.state.lastControlChildValue[controlInd] === undefined) {
            pointChanged = true;
          } else {
            for (let j = 0; j < 2; j++) {
              if (pointValues[j] !== this.state.lastControlChildValue[controlInd].tree[j + 1]) {
                pointChanged = true;
                break;
              }
            }
          }

          if (pointChanged) {
            // the control point was explicitly changed
            // reset all variables related to preserving the control vector
            this.state.lastControlChildValue[controlInd] = me.fromAst(["tuple", ...pointValues])
            this.state.throughForControlChild[controlInd] = this.state.throughpoints[i].copy();
          }

          // calculate control vector as difference between value of control point
          // and the value of the through point, except that we substitute
          // a value for the through point that will lead to the control vector
          // being maintained as long as the point wasn't changed
          let cvector = ["tuple"];
          for (let j = 0; j < 2; j++) {
            let val = pointValues[j];
            if (Number.isFinite(val)) {
              cvector.push(val - this.state.throughForControlChild[controlInd].tree[j + 1]);
            } else {
              cvector.push(NaN);
              this.numericEntries = false;
            }
          }
          this.state.controlvectors[controlInd] = me.fromAst(cvector);

          // check for second control point everywhere except first through point
          if (i > 0) {
            if (symmetric) {
              // if control vector is symmetric, just make the second vector
              // be a reflection of the first
              let cvector = ["tuple"];
              for (let j = 0; j < 2; j++) {
                cvector.push(-this.state.controlvectors[controlInd].tree[j + 1]);
              }
              this.state.controlvectors[controlInd + 1] = me.fromAst(cvector);
            } else {

              // for non-symmetric case, redo above calculation for the second point
              let pointValues = [];
              if (ct.points[1].tree[0] !== "tuple" || ct.points[1].tree.length !== 3) {
                pointValues = [NaN, NaN]
                this.numericEntries = false;
              } else {
                for (let j = 0; j < 2; j++) {
                  let val = ct.points[1].get_component(j).evaluate_to_constant();
                  if (Number.isFinite(val)) {
                    pointValues.push(val);
                  } else {
                    pointValues.push(NaN);
                    this.numericEntries = false;
                  }
                }
              }

              let pointChanged = false;
              if (this.state.lastControlChildValue[controlInd + 1] === undefined) {
                pointChanged = true;
              } else {
                for (let j = 0; j < 2; j++) {
                  if (pointValues[j] !== this.state.lastControlChildValue[controlInd + 1].tree[j + 1]) {
                    pointChanged = true;
                    break;
                  }
                }
              }
              if (pointChanged) {
                this.state.lastControlChildValue[controlInd + 1] = me.fromAst(["tuple", ...pointValues])
                this.state.throughForControlChild[controlInd + 1] = this.state.throughpoints[i].copy();
              }

              let cvector = ["tuple"];
              for (let j = 0; j < 2; j++) {
                let val = pointValues[j];
                if (Number.isFinite(val)) {
                  cvector.push(val - this.state.throughForControlChild[controlInd + 1].tree[j + 1]);
                } else {
                  cvector.push(NaN);
                  this.numericEntries = false;
                }
              }
              this.state.controlvectors[controlInd + 1] = me.fromAst(cvector);
            }
          }
        }
      }
    }

    // Step 3: Look for any control vectors that aren't being explicitly
    // controlled.  Set those control vectors to be whatever they would
    // be if we had a spline with parameters given by state variables
    // splineForm and splineTension

    // Algorithm based on jsxgraph
    // The implementation (especially the centripetal parametrization) is from
    // http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections .
    // However, made one small change to make the control vectors symmetric
    // 


    let tau = this.state.splineTension;
    if (!(tau >= 0 && tau <= 1)) {
      tau = 0.8;
    }
    let eps = this.numerics.eps;

    let dist = function (p1, p2) {
      let dx = p1[0] - p2[0];
      let dy = p1[1] - p2[1];
      return Math.sqrt(dx * dx + dy * dy);
    }

    for (let i = 0; i < this.state.nPoints; i++) {
      if (this.state.pointCurrentlyControlled[i] === true) {
        continue;
      }

      this._state.controlvectors.essential = true;

      if (this.state.numericEntries !== true) {
        this.state.controlvectors[2 * i] = me.fromAst(["tuple", NaN, NaN]);
        if (i > 0) {
          this.state.controlvectors[2 * i - 1] = me.fromAst(["tuple", NaN, NaN]);
        }
        continue;
      }

      let p1, p2, p3;

      p2 = this.state.throughpoints[i].tree.slice(1);

      if (i === 0) {
        if (this.state.nPoints === 1) {
          this.state.controlvectors[0] = me.fromAst(["tuple", NaN, NaN]);
          continue;
        }
        p3 = this.state.throughpoints[i + 1].tree.slice(1);
        p1 = [
          2 * p2[0] - p3[0],
          2 * p2[1] - p3[1]
        ]
      } else {
        p1 = this.state.throughpoints[i - 1].tree.slice(1);
        if (i < this.state.nPoints - 1) {
          p3 = this.state.throughpoints[i + 1].tree.slice(1);
        } else {
          p3 = [
            2 * p2[0] - p1[0],
            2 * p2[1] - p1[1]
          ]
        }
      }

      let cv = [];

      if (this.state.splineForm === 'centripetal') {
        let dt0 = dist(p1, p2);
        let dt1 = dist(p2, p3);

        dt0 = Math.sqrt(dt0);
        dt1 = Math.sqrt(dt1);

        if (dt1 < eps) { dt1 = 1.0; }
        if (dt0 < eps) { dt0 = dt1; }

        for (let dim = 0; dim < 2; dim++) {

          let t1 = (p2[dim] - p1[dim]) / dt0 -
            (p3[dim] - p1[dim]) / (dt1 + dt0) +
            (p3[dim] - p2[dim]) / dt1;

          // original algorithm would multiply by different dt's on each side
          // of the point
          // Took geometric mean so that control vectors are symmetric
          t1 *= tau * Math.sqrt(dt0 * dt1);

          // Bezier control vector component lengths
          // are one third the respective derivative of the cubic
          if (i === 0) {
            cv.push(t1 / 3);
          } else {
            cv.push(-t1 / 3);
          }
        }
      } else {
        // uniform spline case
        for (let dim = 0; dim < 2; dim++) {
          // Bezier control vector component lengths
          // are one third the respective derivative of the cubic
          if (i === 0) {
            cv.push(tau * (p3[dim] - p1[dim]) / 3);
          } else {
            cv.push(-tau * (p3[dim] - p1[dim]) / 3);
          }
        }
      }

      this.state.symmetriccontrols[i] = true;

      if (i === 0) {
        this.state.controlvectors[0] = me.fromAst(["tuple", ...cv]);
      } else {
        this.state.controlvectors[2 * i - 1] = me.fromAst(["tuple", ...cv]);
        this.state.controlvectors[2 * i] = me.fromAst(["tuple", -cv[0], -cv[1]]);
      }

    }

    // if have extra control vectors (which would happen if just deleted some points)
    // then remove the extras
    if (this.state.controlvectors.length > 2 * this.state.throughpoints.length - 1) {
      this.state.controlvectors = this.state.controlvectors.slice(0, 2 * this.state.throughpoints.length - 1);
    }

    // constrain/attract controlvectors to angles, if have such a child
    let constrainInds = this.childLogic.returnMatches("atMostOneConstrainToAngles");
    let constraintChild;
    if (constrainInds.length === 1) {
      constraintChild = this.activeChildren[constrainInds[0]];
    }
    else {
      let attractInds = this.childLogic.returnMatches("atMostOneAttractToAngles");
      if (attractInds.length === 1) {
        constraintChild = this.activeChildren[attractInds[0]];
      }
    }

    if (constraintChild !== undefined) {
      for (let ind = 0; ind < this.state.throughpoints.length; ind++) {
        if (ind == 0) {
          this.applyAngleConstraint(0, constraintChild)
        } else {

          this.applyAngleConstraint(2 * ind - 1, constraintChild)

          if (ind < this.state.throughpoints.length - 1) {
            if (this.state.symmetriccontrols[ind] === false) {
              this.applyAngleConstraint(2 * ind, constraintChild)
            } else {
              // make symmetric reflection
              let cvec = ["tuple"];
              for (let j = 0; j < 2; j++) {
                cvec.push(-this.state.controlvectors[2 * ind - 1].tree[j + 1]);
              }
              this.state.controlvectors[2 * ind] = me.fromAst(cvec);
            }
          }
        }
      }
    }

    // create controlpoints as controlvectors + corresponding throughpoints
    this.state.controlpoints = [];
    for (let i = 1; i < this.state.throughpoints.length; i++) {
      let cp1 = ["tuple"];
      let cp2 = ["tuple"];
      for (let j = 1; j < 3; j++) {
        cp1.push(this.state.throughpoints[i - 1].tree[j] + this.state.controlvectors[2 * i - 2].tree[j]);
        cp2.push(this.state.throughpoints[i].tree[j] + this.state.controlvectors[2 * i - 1].tree[j]);
      }
      this.state.controlpoints.push(me.fromAst(cp1));
      this.state.controlpoints.push(me.fromAst(cp2));
    }

    let tpNumeric = this.state.throughpoints.map(x => x.tree.slice(1));
    let cvNumeric = this.state.controlvectors.map(x => x.tree.slice(1));


    // Compute coefficients for a cubic polynomial
    //   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
    // such that
    //   p(0) = x1, p(1) = x2
    // and
    //   p'(0) = t1, p'(1) = t2
    let initCubicPoly = function (x1, x2, t1, t2) {
      return [
        x1,
        t1,
        -3 * x1 + 3 * x2 - 2 * t1 - t2,
        2 * x1 - 2 * x2 + t1 + t2
      ];
    }

    this.state.splinecoeffs = [];

    for (let i = 1; i < tpNumeric.length; i++) {

      let p1 = tpNumeric[i - 1];
      let p2 = tpNumeric[i];
      let cv1 = cvNumeric[2 * i - 2];
      let cv2 = cvNumeric[2 * i - 1];

      let c = [];
      for (let dim = 0; dim < 2; dim++) {
        c.push(initCubicPoly(
          p1[dim],
          p2[dim],
          3 * cv1[dim],
          -3 * cv2[dim]
        ));
      }
      this.state.splinecoeffs.push(c);
    }


    // extrapolate beyond the first or last point
    // if extrapolateBackward or extrapolateForward are true
    // For each curve component, we extrapolate with either
    // - a linear function that matches the value and derivative
    //   of the outer point, or
    // - a quadratic function that, in addition, matches the value
    //   of the previous point.
    // We choose the quadratic only if its critical point
    // is not located in the portion we extrapolate, i.e.,
    // we don't want the extrapolated curve to turn around in either x or y direction

    this.state.extracoeffs = [];

    if (this.state.extrapolateBackward) {
      let p1 = tpNumeric[0];
      let p2 = tpNumeric[1];
      let cv1 = cvNumeric[0];
      let c = [];
      c[0] = [
        p1[0],
        3 * cv1[0] * 4,
        0
      ];

      let c2 = (p2[0] - p1[0] - 3 * cv1[0]) * 16;
      if (c2 !== 0) {
        if (cv1[0] / c2 < 0) {
          c[0][2] = c2;
        }
      }

      c[1] = [
        p1[1],
        3 * cv1[1] * 4,
        0
      ];

      c2 = (p2[1] - p1[1] - 3 * cv1[1]) * 16;
      if (c2 !== 0) {
        if (cv1[1] / c2 < 0) {
          c[1][2] = c2;
        }
      }

      this.state.extracoeffs[0] = c;

    }

    if (this.state.extrapolateForward) {
      let n = tpNumeric.length - 1;
      let p1 = tpNumeric[n - 1];
      let p2 = tpNumeric[n];
      let cv2 = cvNumeric[2 * n - 1];

      let c = [];
      c[0] = [
        p2[0],
        -3 * cv2[0] * 4,
        0
      ];

      let c2 = (p1[0] - p2[0] - 3 * cv2[0]) * 16
      if (c2 !== 0) {
        if (cv2[0] / c2 < 0) {
          c[0][2] = c2;
        }
      }

      c[1] = [
        p2[1],
        -3 * cv2[1] * 4,
        0
      ];

      c2 = (p1[1] - p2[1] - 3 * cv2[1]) * 16;
      if (c2 !== 0) {
        if (cv2[1] / c2 < 0) {
          c[1][2] = c2;
        }
      }

      this.state.extracoeffs[1] = c;
    }
  }

  applyAngleConstraint(ind, constraintChild) {
    let vec = this.state.controlvectors[ind].tree.slice(1);
    let result = constraintChild.applyTheConstraint({
      x1: vec[0],
      x2: vec[1],
    })
    if (result.constrained) {
      this.state.controlvectors[ind] =
        me.fromAst(["tuple", result.variables.x1, result.variables.x2]);
    }
  }

  parameterization(t, dim) {

    if (isNaN(t)) {
      return NaN;
    }

    if (this.state.curveType === "parameterization") {
      if (dim !== undefined) {
        return this.state.fs[dim](t);
      } else {
        return this.state.fs.map(x => x(t));
      }
    } else if (this.state.curveType === "function") {
      let x = -10 * Math.log(1 / t - 1);
      if (dim !== undefined) {
        if (this.state.flipFunction === true) {
          if (dim === 0) {
            return this.state.f(x)
          } else {
            return x;
          }
        }
        else {
          if (dim === 0) {
            return x;
          } else {
            return this.state.f(x);
          }
        }
      } else {
        if (this.state.flipFunction === true) {
          return [this.state.f(x), x];
        } else {
          return [x, this.state.f(x)];
        }
      }
    }

    if (this.state.numericEntries !== true) {
      return NaN;
    }

    let len = this.state.nPoints - 1;

    if (len < 0) {
      return NaN;
    }

    let z = Math.floor(t);

    let extrapolate = false;
    if (t < 0) {
      if (this.state.extrapolateBackward) {
        z = 0;
        extrapolate = true;
      } else {
        if (dim !== undefined) {
          return this.state.throughpoints[0].tree[dim + 1];
        } else {
          return this.state.throughpoints[0].tree.slice(1);
        }
      }
    }

    if (t >= len) {
      if (this.state.extrapolateForward) {
        z = len - 1;
        extrapolate = true;
      } else {
        if (dim !== undefined) {
          return this.state.throughpoints[len].tree[dim + 1];
        } else {
          return this.state.throughpoints[len].tree.slice(1);
        }
      }
    }

    t -= z;

    if (extrapolate) {
      if (z > 0) {
        z = 1;
        t -= 1;
      }
      let c = this.state.extracoeffs[z];
      if (c === undefined) {
        return NaN;
      }

      if (dim !== undefined) {
        let cd = c[dim]
        return (cd[2] * t + cd[1]) * t + cd[0];
      } else {
        let r = [];
        for (let dim = 0; dim < 2; dim++) {
          let cd = c[dim]
          r.push((cd[2] * t + cd[1]) * t + cd[0]);
        }
        return r;
      }
    }

    let c = this.state.splinecoeffs[z];
    if (c === undefined) {
      return NaN;
    }

    if (dim !== undefined) {
      let cd = c[dim]
      return (((cd[3] * t + cd[2]) * t + cd[1]) * t + cd[0]);
    } else {
      let r = [];
      for (let dim = 0; dim < 2; dim++) {
        let cd = c[dim]
        r.push((((cd[3] * t + cd[2]) * t + cd[1]) * t + cd[0]));
      }
      return r;
    }
  }

  nearestPoint({ x1, x2, x3 }) {

    if (x1 === undefined || x2 === undefined) {
      return {};
    }

    let minfunc = function (t) {
      let result = this.parameterization(t);
      if (!Array.isArray(result)) {
        return NaN;
      }
      let dx1 = x1 - result[0];
      let dx2 = x2 - result[1];
      return dx1 * dx1 + dx2 * dx2;
    }.bind(this);

    let eps = this.numerics.eps;

    let minT = this.state.parameterizationMin;
    let maxT = this.state.parameterizationMax;
    if (this.state.parameterizationExclude.includes(minT)) {
      minT += eps;
    }
    if (this.state.parameterizationExclude.includes(maxT)) {
      maxT -= eps;
    }

    let intervals = [[minT, maxT]];

    let intInd = 0;
    let intMin = intervals[intInd][0];
    let intMax = intervals[intInd][1];
    for (let t of this.state.parameterizationExclude) {
      if (t <= intMin) {
        continue;
      }
      while (t > intMax) {
        if (intMax >= maxT) {
          break;
        } else {
          intInd++;
          intMin = intervals[intInd][0]
          intMax = intervals[intInd][1];
        }
      }
      if (t >= maxT) {
        break;
      }
      intervals.splice(intInd, 1, [intMin, t - eps], [t + eps, intMax]);
      intInd++;
      intMin = intervals[intInd][0]
      intMax = intervals[intInd][1];

    }

    intInd = 0;
    intMin = intervals[intInd][0];
    intMax = intervals[intInd][1];
    for (let t of this.state.parameterizationKeyPoints) {
      if (t <= intMin) {
        continue;
      }
      while (t > intMax) {
        if (intMax >= maxT) {
          break;
        } else {
          intInd++;
          intMin = intervals[intInd][0]
          intMax = intervals[intInd][1];
        }
      }
      if (t >= maxT) {
        break;
      }
      intervals.splice(intInd, 1, [intMin, t], [t, intMax]);
      intInd++;
      intMin = intervals[intInd][0]
      intMax = intervals[intInd][1];
    }

    let Nsteps = this.state.parameterizationNsteps;

    let maxDelta = (maxT - minT) / (Nsteps);

    let fAtMin = NaN;
    let tAtMin = NaN;
    let tIntervalMin = NaN;
    let tIntervalMax = NaN;

    intMax = undefined;
    for (let intInd = 0; intInd < intervals.length; intInd++) {
      intMin = intervals[intInd][0];
      let consecutiveIntervals = false;
      if (intMin === intMax) {
        consecutiveIntervals = true;
      }
      intMax = intervals[intInd][1];

      let intSteps = Math.ceil((intMax - intMin) / maxDelta);
      let intDelta = (intMax - intMin) / intSteps;

      // if not consecutive intervals, evaluate at intMin
      if (!consecutiveIntervals) {
        let fnew = minfunc(intMin);
        if (fnew < fAtMin || Number.isNaN(fAtMin)) {
          tAtMin = intMin;
          fAtMin = fnew;
          tIntervalMin = intMin;
          tIntervalMax = intMin + intDelta;
        }
      }


      for (let step = 1; step <= intSteps; step++) {
        let tnew = intMin + step * intDelta;
        let fnew = minfunc(tnew);
        if (fnew < fAtMin || Number.isNaN(fAtMin)) {
          tAtMin = tnew;
          fAtMin = fnew;
          tIntervalMin = tnew - intDelta;
          if ((step === intSteps) &&
            (intInd === intervals.length - 1 || intervals[intInd + 1][0] !== intMax)) {
            tIntervalMax = tnew;
          } else {
            tIntervalMax = tnew + intDelta;
          }
        }

      }

    }

    if (this.state.parameterizationPeriodic && minT === this.state.parameterizationMin &&
      maxT == this.state.parameterizationMax) {
      // if have periodic where endpoints haven't been excluded
      // and tAtMin is at endpoint, make interval span past endpoint
      if (Math.abs(tAtMin - minT) < eps) {
        // append interval for delta for last interval before minT
        let intInd = intervals.length - 1;
        let intSteps = Math.ceil((intervals[intInd][1] - intervals[intInd][0]) / maxDelta);
        let intDelta = (intMax - intMin) / intSteps;
        tIntervalMin = minT - intDelta;
      } else if (Math.abs(tAtMin - maxT) < eps) {
        // append interval for delta for first interval after minT
        let intSteps = Math.ceil((intervals[0][1] - intervals[0][0]) / maxDelta);
        let intDelta = (intMax - intMin) / intSteps;
        tIntervalMax = maxT + intDelta;

      }
    }

    let result = this.numerics.fminbr(minfunc, [tIntervalMin, tIntervalMax]);
    tAtMin = result.x;

    let [x1AtMin, x2AtMin] = this.parameterization(tAtMin);
    result = {
      x1: x1AtMin,
      x2: x2AtMin
    }

    if (x3 !== undefined) {
      result.x3 = 0;
    }

    return result;

  }

  calculateCurveRenderParams() {

    let params = {
      parmin: this.stateValues.parameterizationMin,
      parmax: this.stateValues.parameterizationMax,
      curveType: this.stateValues.curveType,
      flipFunction: this.stateValues.flipFunction,
      visible: !this.stateValues.hide,

    };
    if (this.stateValues.curveType === "function") {
      if (this.stateValues.flipFunction === true) {
        params.fx = this.stateValues.f;
      } else {
        params.fy = this.stateValues.f;
      }
    } else if (this.stateValues.curveType === "parameterization") {
      params.fx = this.stateValues.fs[0];
      params.fy = this.stateValues.fs[1];
    } else if (this.stateValues.curveType === "spline") {
      params.fx = t => this.parameterization(t, 0);
      params.fy = t => this.parameterization(t, 1);
      params.throughpoints = this.stateValues.throughpoints.map(x => x.tree.slice(1));
      params.controlpoints = this.stateValues.controlpoints.map(x => x.tree.slice(1));
      params.pointCurrentlyControlled = [...this.stateValues.pointCurrentlyControlled];
    }
    return params;
  }

  moveControlvector({ controlvector, controlvectorInd }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          controlvectors: {
            isArray: true,
            changes: { arrayComponents: { [controlvectorInd]: me.fromAst(["tuple", ...controlvector]) } }
          }
        },
        controlvectorMoved: controlvectorInd,
      }]
    });
  }

  moveThroughpoint({ throughpoint, throughpointInd }) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          throughpoints: {
            isArray: true,
            changes: { arrayComponents: { [throughpointInd]: me.fromAst(["tuple", ...throughpoint]) } }
          }
        },
        throughpointMoved: throughpointInd,
      }]
    });
  }

  togglePointControl(throughpointInd) {
    this.requestUpdate({
      updateType: "updateValue",
      updateInstructions: [{
        componentName: this.componentName,
        variableUpdates: {
          pointCurrentlyControlled: {
            isArray: true,
            changes: { arrayComponents: { [throughpointInd]: this.state.pointCurrentlyControlled[throughpointInd] !== true } }
          }
        },
      }]
    });
  }

  initializeRenderer({ }) {
    if (this.renderer !== undefined) {
      this.updateRenderer();
      return;
    }

    const actions = {
      moveControlvector: this.moveControlvector,
      moveThroughpoint: this.moveThroughpoint,
      togglePointControl: this.togglePointControl,
    }

    let params = this.calculateCurveRenderParams();
    params.key = this.componentName;
    params.label = this.stateValues.label;
    params.draggable = this.stateValues.draggable;
    params.layer = this.stateValues.layer;
    params.actions = actions;
    params.color = this.stateValues.selectedStyle.lineColor;
    params.width = this.stateValues.selectedStyle.lineWidth;
    params.style = this.stateValues.selectedStyle.lineStyle;

    this.renderer = new this.availableRenderers.curve2d(params);
  }

  updateRenderer({ sourceOfUpdate } = {}) {
    let params = this.calculateCurveRenderParams();
    params.changeInitiatedWith = {};

    if (sourceOfUpdate && sourceOfUpdate.instructionsByComponent) {
      let instructions = sourceOfUpdate.instructionsByComponent[this.componentName];
      if (instructions !== undefined) {
        params.changeInitiatedWith.throughpointInd = instructions.throughpointMoved;
        params.changeInitiatedWith.controlvectorInd = instructions.controlvectorMoved;
      }
    }
    this.renderer.updateCurve(params);
  }

  allowDownstreamUpdates(status) {
    if (!((status.initialChange === true && this.state.draggable === true) ||
      (status.initialChange !== true && this.state.modifyIndirectly === true))) {
      return false;
    }

    // don't update if don't currently have numeric entries
    if (!this.state.numericEntries) {
      return false;
    }

    return true;

  }

  get variablesUpdatableDownstream() {
    return ["throughpoints", "controlvectors", "controlpoints", "pointCurrentlyControlled"];
  }

  calculateDownstreamChanges({ stateVariablesToUpdate, stateVariableChangesToSave,
    dependenciesToUpdate }) {

    let newStateVariables = {};

    // console.log(`begin downstream updates for ${this.componentName}`);
    // console.log(stateVariablesToUpdate);

    // these will be overwritten if find values from stateVariableToUpdate
    let newThroughpoints = [...this.state.throughpoints];
    let newControlvectors = [...this.state.controlvectors];
    let newpointCurrentlyControlled = [...this.state.pointCurrentlyControlled];

    let controlsChanged = new Set([]);
    let controlsChangedViaThrough = new Set([]);

    for (let varName in stateVariablesToUpdate) {
      if (varName === "throughpoints") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          let indNum = Number(ind)
          if (indNum > 0) {
            controlsChangedViaThrough.add(2 * indNum - 1);
          }
          if (indNum < newThroughpoints.length - 1) {
            controlsChangedViaThrough.add(2 * indNum);
          }
          newThroughpoints[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      } else if (varName === "controlvectors") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          let indNum = Number(ind)
          controlsChanged.add(indNum);

          newControlvectors[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      } else if (varName === "pointCurrentlyControlled") {
        if (newStateVariables[varName] === undefined) {
          newStateVariables[varName] = {
            isArray: true,
            changes: { arrayComponents: {} }
          }
        }
        for (let ind in stateVariablesToUpdate[varName].changes.arrayComponents) {
          newpointCurrentlyControlled[ind] = newStateVariables[varName].changes.arrayComponents[ind] =
            stateVariablesToUpdate[varName].changes.arrayComponents[ind];
        }
      }
    }

    // check if controlpoints (rather than controlvectors) were changed
    // and fill in any unused control vector slots
    if (stateVariablesToUpdate.controlpoints !== undefined) {
      if (newStateVariables.controlvectors === undefined) {
        newStateVariables.controlvectors = {
          isArray: true,
          changes: { arrayComponents: {} }
        }
      }
      for (let ind in stateVariablesToUpdate.controlpoints.changes.arrayComponents) {
        let indNum = Number(ind)
        if (!controlsChanged.has(indNum)) {
          controlsChanged.add(indNum);

          // check if through point changed
          let tp;
          if (controlsChangedViaThrough.has(indNum)) {
            tp = newThroughpoints[Math.ceil(ind / 2)].tree;
          } else {
            tp = this.state.throughpoints[Math.ceil(ind / 2)].tree;
          }

          let cp = stateVariablesToUpdate.controlpoints.changes.arrayComponents[ind].tree;

          let newCVast = ["tuple"];
          for (let j = 0; j < 2; j++) {
            newCVast.push(cp[j + 1] - tp[j + 1]);
          }

          newControlvectors[ind] = newStateVariables.controlvectors.changes.arrayComponents[ind] =
            me.fromAst(newCVast);
        }
      }
    }

    // after have determined all new values for throughpoints
    // check if have to specify the symmetric control point
    for (let i = 1; i < newThroughpoints.length - 1; i++) {
      if (this.state.symmetriccontrols[i] !== false) {
        if (controlsChanged.has(2 * i - 1)) {
          controlsChanged.add(2 * i);
          // make control vector 2*i be symmetric reflection of 2*i-1
          let c = ["tuple"];
          for (let j = 0; j < 2; j++) {
            c.push(-newControlvectors[2 * i - 1].tree[j + 1]);
          }
          newStateVariables.controlvectors.changes.arrayComponents[2 * i] = newControlvectors[2 * i] = me.fromAst(c);
        } else if (controlsChanged.has(2 * i)) {
          controlsChanged.add(2 * i - 1);
          // make control point 2*i-1 be symmetric reflection of 2*i
          let c = ["tuple"];
          for (let j = 0; j < 2; j++) {
            c.push(-newControlvectors[2 * i].tree[j + 1]);
          }
          newStateVariables.controlvectors.changes.arrayComponents[2 * i - 1] = newControlvectors[2 * i - 1] = me.fromAst(c);
        }
      }
    }

    // delete any control changed directly from controlsChangedViaThrough
    for (let ind of controlsChanged) {
      controlsChangedViaThrough.delete(ind);
    }
    // add any controlsChangedViaThrough to controlsChanged
    for (let ind of controlsChangedViaThrough) {
      controlsChanged.add(ind);
    }

    // check if based on through child
    if (this.state.throughChild !== undefined && "throughpoints" in newStateVariables) {

      let throughPoints = this.state.throughChild.state.points;

      for (let ind in newStateVariables.throughpoints.changes.arrayComponents) {
        let pointName = throughPoints[ind].componentName;
        dependenciesToUpdate[pointName] = { coords: { changes: newThroughpoints[ind] } };
      }
    }

    if (this.state.controlsChild !== undefined && controlsChanged.size > 0) {
      let controlsName = this.state.controlsChild.componentName;

      let controlsInChild = this.state.controlsChild.state.controls;
      let nControlsInChild = controlsInChild.length;

      let controlInstructions = {}
      for (let ind of controlsChanged) {
        let controlNumber = Math.ceil(ind / 2);
        if (controlNumber >= nControlsInChild) {
          continue;
        }
        // skip if already added this controlNumber
        // (so don't repeat work when both inds of a controlNumber have changed)
        if (controlNumber in controlInstructions) {
          continue;
        }

        let controlInds = [];
        if (controlNumber === 0) {
          controlInds.push(0);
        } else if (controlNumber === nControlsInChild - 1) {
          controlInds.push(2 * nControlsInChild - 3);
        } else {
          controlInds.push(2 * controlNumber - 1)
          if (this.state.symmetriccontrols[controlNumber] === false) {
            controlInds.push(2 * controlNumber)
          }
        }

        if (controlsInChild[controlNumber].controlType === "point") {
          controlInstructions[controlNumber] =
            controlInds.map(function (ind) {
              if (controlsChangedViaThrough.has(ind) ||
                ind in newStateVariables.controlvectors.changes.arrayComponents) {
                // if controls changed via through then change all control inds
                // else only change those that directly
                let newPoint = ["tuple"];
                for (let j = 0; j < 2; j++) {
                  newPoint.push(newControlvectors[ind].tree[j + 1]
                    + newThroughpoints[controlNumber].tree[j + 1]);
                }
                return me.fromAst(newPoint);
              }
            });

        } else {
          controlInstructions[controlNumber] =
            controlInds.map(function (ind) {
              if (controlsChangedViaThrough.has(ind) ||
                ind in newStateVariables.controlvectors.changes.arrayComponents) {
                // if controls changed via through then change all control inds
                // else only change those that directly
                return newControlvectors[ind];
              }
            })
        }
      }
      dependenciesToUpdate[controlsName] = {
        controls: {
          isArray: true,
          changes: { arrayComponents: controlInstructions }
        }
      }
    }

    let shadowedResult = this.updateShadowSources({
      newStateVariables: newStateVariables,
      dependenciesToUpdate: dependenciesToUpdate,
    });
    let shadowedStateVariables = shadowedResult.shadowedStateVariables;
    let isReplacement = shadowedResult.isReplacement;

    // add stateVariable to stateVariableChangesToSave if is essential
    // and no shadow sources were updated
    for (let varname in newStateVariables) {
      if (this._state[varname].essential === true &&
        !shadowedStateVariables.has(varname)
        // && !isReplacement
      ) {
        stateVariableChangesToSave[varname] = newStateVariables[varname];
      }
    }

    // console.log("stateVariableChangesToSave")
    // console.log(stateVariableChangesToSave)

    // console.log("dependenciesToUpdate");
    // console.log(dependenciesToUpdate);

    return true;

  }

}