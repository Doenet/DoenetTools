import Line from './Line';
import me from 'math-expressions';

export default class BestFitLine extends Line {
  static componentType = "bestFitLine";
  static rendererType = "line";

  static createAttributesObject() {
    let attributes = super.createAttributesObject();

    delete attributes.draggable;
    delete attributes.equation;
    delete attributes.through;
    delete attributes.slope;

    attributes.points = {
      createComponentOfType: "_pointListComponent",
    };

    return attributes;
  }


  static returnSugarInstructions() {
    return [];
  }



  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();

    stateVariableDefinitions.draggable = {
      componentType: "boolean",
      public: true,
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { draggable: false } })
    }


    stateVariableDefinitions.nDimensions = {
      public: true,
      componentType: "number",
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { nDimensions: 2 } })
    }


    delete stateVariableDefinitions.nPointsPrescribed;
    delete stateVariableDefinitions.basedOnSlope;
    delete stateVariableDefinitions.dForSlope;
    delete stateVariableDefinitions.essentialPoint1x;
    delete stateVariableDefinitions.essentialPoint1y;
    delete stateVariableDefinitions.equationIdentity;


    delete stateVariableDefinitions.equation.stateVariablesDeterminingDependencies;

    stateVariableDefinitions.equation.returnDependencies = () => ({
      points: {
        dependencyType: "attributeComponent",
        attributeName: "points",
        variableNames: ["points", "nDimensions"]
      },
      variables: {
        dependencyType: "stateVariable",
        variableName: "variables"
      }
    })

    stateVariableDefinitions.equation.definition = function ({ dependencyValues }) {

      if (!dependencyValues.points
        || dependencyValues.points.stateValues.nDimensions < 2
        || dependencyValues.points.stateValues.points.length < 1
      ) {
        let blankMath = me.fromAst('\uff3f');
        return {
          setValue: {
            equation: blankMath,
            coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
          }
        }
      }

      let X = [];
      let Y = [];


      for (let pt of dependencyValues.points.stateValues.points) {
        let numericalX = pt.slice(0, 2).map(x => x && x.evaluate_to_constant());
        if (numericalX.every(Number.isFinite)) {
          X.push([1, numericalX[0]]);
          Y.push([numericalX[1]]);
        }

      }

      if (X.length === 0) {
        let blankMath = me.fromAst('\uff3f');
        return {
          setValue: {
            equation: blankMath,
            coeff0: blankMath, coeffvar1: blankMath, coeffvar2: blankMath
          }
        }
      }

      X = me.math.matrix(X);
      Y = me.math.matrix(Y);
      let Xt = me.math.transpose(X);

      let b = me.math.multiply(Xt, Y);

      let A = me.math.multiply(Xt, X)

      let s = me.math.lusolve(A, b);

      let coeff0 = me.fromAst(me.math.subset(s, me.math.index(0, 0)));
      let coeffvar1 = me.fromAst(me.math.subset(s, me.math.index(1, 0)));
      let coeffvar2 = me.fromAst(-1);

      let variables = dependencyValues.variables;

      let rhs = me.fromAst(['+', ['*', 'a', 'x'], 'c']).substitute({
        a: coeffvar1, c: coeff0, x: variables[0], y: variables[1]
      }).simplify();

      let equation = me.fromAst(['=', 'y', 'r']).substitute({
        r: rhs
      });

      return {
        setValue: {
          equation, coeff0, coeffvar1, coeffvar2
        }
      }

    }

    delete stateVariableDefinitions.equation.inverseDefinition;



    delete stateVariableDefinitions.points.stateVariablesDeterminingDependencies;

    stateVariableDefinitions.points.returnArrayDependenciesByKey = function () {

      let globalDependencies = {
        coeff0: {
          dependencyType: "stateVariable",
          variableName: "coeff0"
        },
        coeffvar1: {
          dependencyType: "stateVariable",
          variableName: "coeffvar1"
        },
        coeffvar2: {
          dependencyType: "stateVariable",
          variableName: "coeffvar2"
        },
        variables: {
          dependencyType: "stateVariable",
          variableName: "variables",
        },
        lastPointsFromInverting: {
          dependencyType: "stateVariable",
          variableName: "lastPointsFromInverting"
        }
      }
      return { globalDependencies }
    }



    return stateVariableDefinitions;

  }


}